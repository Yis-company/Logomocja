import os
from pathlib import Path
import subprocess
import sys
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch

from remove_clean_worktree import git, remove_clean_worktree


class WorktreeRemovalTest(unittest.TestCase):
    def setUp(self):
        fixture = TemporaryDirectory()
        self.addCleanup(fixture.cleanup)
        self.repo = Path(fixture.name).resolve() / "repository"
        self.tree = self.repo.parent / "candidate with spaces"
        self.repo.mkdir()
        git(self.repo, "init", "-b", "main")
        (self.repo / ".gitignore").write_text(
            "/.serena/\n/output/\n/node_modules/\n/dist/\n", encoding="utf-8"
        )
        (self.repo / "tracked.txt").write_text("original", encoding="utf-8")
        git(self.repo, "add", ".gitignore", "tracked.txt")
        git(self.repo, "-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-m", "fixture")
        self.head = git(self.repo, "rev-parse", "HEAD").decode().strip()
        git(self.repo, "worktree", "add", "-b", "fixture", os.fspath(self.tree))

    def add_file(self, path):
        target = self.tree / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text("fixture", encoding="utf-8")
        return target

    def record_removal(self, *, fail_scan=False):
        calls = []
        run = subprocess.run

        def dispatch(args, **kwargs):
            if "status" in args and fail_scan:
                raise subprocess.CalledProcessError(1, args)
            if args[4:6] == ["worktree", "remove"]:
                calls.append(args[6:])
                return subprocess.CompletedProcess(args, 0, stdout=b"")
            return run(args, **kwargs)

        return calls, patch("remove_clean_worktree.subprocess.run", side_effect=dispatch)

    def test_keeps_local_files_and_unknown_ignored_paths(self):
        for path in (
            ".serena/project.local.yml",
            "output/bench-experiments/run.json",
            "untracked.txt",
            "tracked.txt",
        ):
            with self.subTest(path=path):
                target = self.add_file(path)
                calls, recorder = self.record_removal()
                with recorder, self.assertRaisesRegex(ValueError, "Protected worktree entry"):
                    remove_clean_worktree(self.repo, self.tree, self.head)
                self.assertEqual(calls, [])
                self.assertTrue(target.is_file())
                if path != "tracked.txt":
                    target.unlink()

    def test_keeps_candidate_when_scan_fails(self):
        calls, recorder = self.record_removal(fail_scan=True)
        with recorder, self.assertRaises(subprocess.CalledProcessError):
            remove_clean_worktree(self.repo, self.tree, self.head)
        self.assertEqual(calls, [])
        self.assertTrue(self.tree.is_dir())

    def test_keeps_main_worktree_and_stale_candidate(self):
        calls, recorder = self.record_removal()
        with recorder:
            with self.assertRaises(ValueError):
                remove_clean_worktree(self.repo, self.repo, self.head)
            with self.assertRaises(ValueError):
                remove_clean_worktree(self.repo, self.tree, "0" * len(self.head))
        self.assertEqual(calls, [])

    def test_removes_only_the_cache_only_candidate(self):
        self.add_file("node_modules/rebuildable/file")
        self.add_file("dist/rebuildable.js")
        calls, recorder = self.record_removal()
        with recorder:
            remove_clean_worktree(self.repo, self.tree, self.head)
        self.assertEqual(calls, [["--", os.fspath(self.tree)]])
        self.assertTrue(self.tree.is_dir())

        subprocess.run(
            [
                sys.executable, "-I", Path(__file__).with_name("remove_clean_worktree.py"),
                self.repo, self.tree, self.head,
            ],
            check=True,
        )
        self.assertFalse(self.tree.exists())
        self.assertEqual(git(self.repo, "rev-parse", "refs/heads/fixture").decode().strip(), self.head)
