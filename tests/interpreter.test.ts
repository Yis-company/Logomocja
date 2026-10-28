import { describe, expect, test } from 'bun:test';
import { examples } from '../src/examples';
import { compileProgram, LogoMachine, runLogo } from '../src/interpreter';

describe('interpretacja programu Logo', () => {
  test('uruchamia wszystkie trzynaście programów wbudowanych', () => {
    expect(examples).toHaveLength(13);
    for (const example of examples) {
      const result = runLogo(example.source, example.mode);
      expect(result.error).toBeNull();
      expect(result.segments.length).toBeGreaterThan(0);
    }
  });

  test('zachowuje priorytet i lewostronność działań', () => {
    expect(runLogo('np 20 - 5 - 3', '2d').segments[0].to).toEqual([0, 12, 0]);
    expect(runLogo('np 2 + 3 * 4', '2d').segments[0].to).toEqual([0, 14, 0]);
    expect(runLogo('np 10-5', '2d').segments[0].to).toEqual([0, 5, 0]);
    expect(runLogo('powtorz 4 [np 120 pw 90]', '2d').segments.at(-1)?.to).toEqual([0, 0, 0]);
    const malformed = runLogo('np 10 -5', '2d');
    expect(malformed.segments).toHaveLength(0);
    expect(malformed.error?.column).toBe(7);
  });

  test('przed rysowaniem sprawdza składnię całego programu', () => {
    const result = runLogo('np 10\nnieznane 2', '2d');
    expect(result.segments).toHaveLength(0);
    expect(result.error?.line).toBe(2);
    expect(runLogo('gora 90', '2d').segments).toHaveLength(0);
    expect(runLogo('powtorz 2 [np 4', '2d').segments).toHaveLength(0);
  });

  test('zachowuje rysunek po błędzie wykonania i wskazuje początek argumentu', () => {
    const result = runLogo('np 5\nnp 10 / 0', '2d');
    expect(result.segments).toHaveLength(1);
    expect(result.error?.line).toBe(2);
    expect(result.error?.column).toBe(4);
    expect(result.error?.message).toContain('zero');
    const grouped = runLogo('np (10 / 0)', '2d');
    expect(grouped.error?.column).toBe(4);
  });

  test('obsługuje zakres zmiennej globalnej, lokalne zmienne i parametry', () => {
    const source = 'niech bok 10\noto odcinek ma: bok\n  np bok\njuż\nodcinek 25';
    const result = runLogo(source, '2d');
    expect(result.error).toBeNull();
    expect(result.segments[0].to).toEqual([0, 25, 0]);

    const unassigned = runLogo('niech x 4\noto p\n  jeśli 0 = 1 [niech x 2]\n  np x\njuż\np', '2d');
    expect(unassigned.segments).toHaveLength(0);
    expect(unassigned.error?.message).toContain('nie ma jeszcze wartości');
  });

  test('ogranicza nrpowt do leksykalnego ciała pętli', () => {
    expect(runLogo('np nrpowt', '2d').error?.message).toContain('tylko wewnątrz');
    const procedure = 'oto p\n  np nrpowt\njuż\np';
    expect(runLogo(procedure, '2d').error?.message).toContain('tylko wewnątrz');
    expect(runLogo('powtorz 3 [np nrpowt]', '2d').segments.map(segment => segment.to[1])).toEqual([1, 3, 6]);
  });

  test('wspiera stop, czyszczenie i 3D orientację', () => {
    const stopped = runLogo('oto p\n  np 7\n  stop\n  np 50\njuż\np', '2d');
    expect(stopped.segments).toHaveLength(1);
    expect(stopped.segments[0].to).toEqual([0, 7, 0]);
    expect(runLogo('np 10\nczyść\nnp 5', '2d').segments).toHaveLength(1);
    expect(runLogo('gora 90 np 10', '3d').segments[0].to[2]).toBeCloseTo(10);
    expect(runLogo('np 10 pw 90 np 10', '2d').segments).toEqual(runLogo('np 10 pw 90 np 10', '3d').segments);
  });

  test('sprawdza liczbę argumentów procedury', () => {
    const result = runLogo('oto odcinek ma: bok\n  np bok\njuż\nodcinek 10 20', '2d');
    expect(result.segments).toHaveLength(0);
    expect(result.error?.message).toContain('dokładnie 1 argument.');
  });

  test('krok zatrzymuje się na kolejnych poleceniach, nie na księgowaniu pętli', () => {
    const machine = new LogoMachine(compileProgram('powtorz 2 [\n  np 1\n]\nnp 5', '2d'));
    expect(machine.step().line).toBe(1);
    expect(machine.step().line).toBe(2);
    expect(machine.step().line).toBe(2);
    expect(machine.step().line).toBe(4);
    expect(machine.step().done).toBe(true);
  });

  test('odrzuca niepoprawny literał i zbyt duży wymiar przed rysowaniem', () => {
    expect(runLogo('np 10\ngrubosc 13', '2d').segments).toHaveLength(0);
    expect(runLogo('np 1e3', '2d').error).not.toBeNull();
    expect(runLogo('kolor "green"\nnp 2', '2d').segments).toHaveLength(0);
  });
});
