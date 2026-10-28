import { beforeEach, describe, expect, test } from 'bun:test';
import { isUserDraft } from '../src/ui/dirty';
import { EXAMPLES } from '../src/data/examples';
import { Drafts, Progress, resetMemory, Settings, Stash, guessLabel } from '../src/ui/store';

// W środowisku testowym nie ma localStorage — działa zapasowy magazyn w pamięci.
beforeEach(() => resetMemory());

describe('magazyn lokalny', () => {
  test('ustawienia mają rozsądne wartości domyślne i się zapisują', () => {
    expect(Settings.mode).toBe('2d');
    expect(Settings.theme).toBe('system');
    expect(Settings.speed).toBe(3);
    expect(Settings.split).toBe(0.42);
    Settings.mode = '3d';
    Settings.theme = 'dark';
    Settings.speed = 5;
    Settings.split = 0.5;
    expect([Settings.mode, Settings.theme, Settings.speed, Settings.split]).toEqual(['3d', 'dark', 5, 0.5]);
  });

  test('szkice każdego trybu są osobne', () => {
    expect(Drafts.get('2d')).toBeNull();
    Drafts.set('2d', 'np 1');
    Drafts.set('3d', 'gora 1');
    expect(Drafts.get('2d')).toBe('np 1');
    expect(Drafts.get('3d')).toBe('gora 1');
  });

  test('szkice zachowane: dodawanie bez duplikatów, usuwanie, nazwa z komentarza', () => {
    const a = Stash.add('2d', '; mój kwadrat\nnp 1');
    expect(a.label).toBe('mój kwadrat');
    expect(Stash.add('2d', '; mój kwadrat\nnp 1').id).toBe(a.id);
    Stash.add('3d', 'gora 5');
    expect(Stash.list().length).toBe(2);
    expect(Stash.list()[0]!.mode).toBe('3d'); // najnowszy pierwszy
    Stash.remove(a.id);
    expect(Stash.list().map((e) => e.source)).toEqual(['gora 5']);
    for (let i = 0; i < 30; i++) Stash.add('2d', `np ${i}`);
    expect(Stash.list().length).toBeLessThanOrEqual(30);
    expect(guessLabel('')).toBe('Szkic bez nazwy');
    expect(guessLabel('; ' + 'x'.repeat(100)).length).toBeLessThanOrEqual(48);
  });

  test('postęp w wyzwaniach', () => {
    expect(Progress.get('a')).toEqual({ solved: false, attempts: 0 });
    Progress.update('a', (p) => ({ ...p, attempts: p.attempts + 1, best: 40 }));
    Progress.update('a', (p) => ({ ...p, solved: true, attempts: p.attempts + 1, best: 100 }));
    expect(Progress.get('a')).toEqual({ solved: true, attempts: 2, best: 100 });
    expect(Progress.all().b).toBeUndefined();
    Progress.reset();
    expect(Progress.get('a').solved).toBe(false);
  });
});

describe('ochrona niezapisanego szkicu', () => {
  test('przykłady, pusty tekst i szablony nie są szkicem użytkownika', () => {
    expect(isUserDraft('', '2d')).toBe(false);
    expect(isUserDraft('  \n ', '2d')).toBe(false);
    for (const e of EXAMPLES) expect(isUserDraft(e.source, e.mode)).toBe(false);
    expect(isUserDraft('powtorz 3 [np 120 pw 120]', '2d')).toBe(false); // rozwiązanie wyzwania / przykład z opisu
    expect(isUserDraft('np 100\npw 90\nnp 50', '2d')).toBe(false); // przykład polecenia np
    expect(isUserDraft(EXAMPLES[0]!.source.replace(/\n/g, '\r\n'), '2d')).toBe(false);
    expect(isUserDraft('; start\n', '2d', ['; start'])).toBe(false);
  });

  test('zmieniony przykład lub własny kod jest szkicem, o ile nie ma go już w „Szkicach”', () => {
    expect(isUserDraft(EXAMPLES[0]!.source + '\nnp 1', '2d')).toBe(true);
    expect(isUserDraft('np 77', '2d')).toBe(true);
    Stash.add('2d', 'np 77');
    expect(isUserDraft('np 77', '2d')).toBe(false);
    expect(isUserDraft('np 77', '3d')).toBe(true);
  });
});
