"""Remove a previously selected Logomocja worktree only if its files are safe to discard."""

import argparse
import os
from pathlib import Path
import subprocess
import sys


IGNORED_CACHES = {b"node_modules/", b"dist/"}


def git(directory, *args):
    # Git hooks can export another repository's directory, worktree or index.
    env = {key: value for key, value in os.environ.items() if not key.startswith("GIT_")}
    return subprocess.run(
        ["git", "--no-optional-locks", "-C", directory, *args],
        env=env,
        stdout=subprocess.PIPE,
        check=True,
    ).stdout


def remove_clean_worktree(repository, candidate, expected_head):
    repository = Path(repository).resolve(strict=True)
    candidate = Path(candidate).resolve(strict=True)
    inventory = git(os.fspath(repository), "worktree", "list", "--porcelain", "-z")
    worktrees = [
        dict(field.partition(b" ")[::2] for field in record.split(b"\0"))
        for record in inventory.rstrip(b"\0").split(b"\0\0")
    ]
    if worktrees[0].get(b"worktree") != os.fsencode(repository):
        raise ValueError("Use the main worktree as the repository path.")
    entry = next(
        (entry for entry in worktrees[1:] if entry[b"worktree"] == os.fsencode(candidate)),
        None,
    )
    if (
        entry is None
        or b"locked" in entry
        or b"prunable" in entry
        or entry.get(b"HEAD") != expected_head.encode("ascii")
    ):
        raise ValueError("Candidate is not an unlocked linked worktree at the expected commit.")
    if any(
        candidate in Path(os.fsdecode(other[b"worktree"])).parents
        for other in worktrees
    ):
        raise ValueError("Candidate still contains a registered worktree.")

    location = git(os.fspath(candidate), "rev-parse", "--show-toplevel", "HEAD")
    expected_location = b"\n".join((os.fsencode(candidate), expected_head.encode("ascii"), b""))
    if location != expected_location:
        raise ValueError("Candidate checkout changed since it was selected.")
    status = git(
        os.fspath(candidate),
        "-c", "core.fsmonitor=false",
        "-c", "core.untrackedCache=false",
        "status", "--porcelain=v1", "-z", "--untracked-files=normal",
        "--ignored=traditional", "--ignore-submodules=none",
    )
    if status and not status.endswith(b"\0"):
        raise ValueError("Incomplete worktree inventory.")
    for record in status.split(b"\0")[:-1]:
        if not record.startswith(b"!! ") or record[3:] not in IGNORED_CACHES:
            raise ValueError(f"Protected worktree entry {os.fsdecode(record)!r}.")

    # Let Git check tracked files, untracked files and submodules again at removal.
    git(os.fspath(repository), "worktree", "remove", "--", os.fspath(candidate))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("repository", help="Main worktree of the selected repository")
    parser.add_argument("candidate", help="Linked worktree selected by the cleanup inventory")
    parser.add_argument("expected_head", help="Full candidate commit ID from that inventory")
    args = parser.parse_args()
    try:
        remove_clean_worktree(args.repository, args.candidate, args.expected_head)
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        print(f"Kept worktree: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
