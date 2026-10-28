import { describe, expect, test } from 'bun:test';
import { EXAMPLES } from '../src/data/examples';
import { runSource } from '../src/lang';

const byId = (id: string) => EXAMPLES.find((e) => e.id === id)!;
const dist = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!);

describe('programy wzorcowe', () => {
  test('jest trzynaście programów w odpowiednich trybach', () => {
    expect(EXAMPLES.map((e) => `${e.id}:${e.mode}`)).toEqual([
      'kwadrat:2d', 'gwiazda:2d', 'rozeta:2d', 'spirala:2d', 'wielokaty:2d', 'drzewo:2d', 'sniezynka:2d',
      'schody:3d', 'szescian:3d', 'pierscien:3d', 'kula:3d', 'helisa:3d', 'drzewo3d:3d',
    ]);
    expect(EXAMPLES.map((e) => e.name)).toEqual([
      'Kwadrat', 'Gwiazda', 'Rozeta', 'Spirala', 'Wielokąty', 'Drzewo', 'Śnieżynka',
      'Schody', 'Sześcian', 'Pierścień', 'Kula', 'Helisa', 'Drzewo 3D',
    ]);
  });

  test('każdy działa bez błędu we własnym trybie', () => {
    for (const e of EXAMPLES) {
      const r = runSource(e.source, e.mode);
      expect({ id: e.id, error: r.error }).toEqual({ id: e.id, error: null });
      expect(r.segments.length).toBeGreaterThan(0);
    }
  });

  test('programy 2D działają też w trybie 3D i dają to samo', () => {
    for (const e of EXAMPLES.filter((x) => x.mode === '2d')) {
      expect(JSON.stringify(runSource(e.source, '3d'))).toBe(JSON.stringify(runSource(e.source, '2d')));
    }
  });

  test('programy 3D w trybie 2D są błędem analizy', () => {
    for (const e of EXAMPLES.filter((x) => x.mode === '3d')) {
      const r = runSource(e.source, '2d');
      expect(r.error).not.toBeNull();
      expect(r.segments).toEqual([]);
    }
  });

  test('liczba odcinków', () => {
    const counts: Record<string, number> = {
      kwadrat: 4, gwiazda: 5, rozeta: 48, spirala: 90, wielokaty: 3 + 4 + 5 + 6 + 7 + 8 + 9, drzewo: 255,
      sniezynka: 768, schody: 12, szescian: 17, pierscien: 36, kula: 432, helisa: 240, drzewo3d: 121,
    };
    for (const e of EXAMPLES) expect(runSource(e.source, e.mode).segments.length).toBe(counts[e.id]!);
  });

  test('Kwadrat to kwadrat o boku 120', () => {
    const r = runSource(byId('kwadrat').source, '2d');
    expect(r.segments.map((s) => s.to)).toEqual([[0, 120, 0], [120, 120, 0], [120, 0, 0], [0, 0, 0]]);
    expect(r.segments.every((s) => s.color === '#16866a' && s.width === 3)).toBe(true);
  });

  test('Gwiazda domyka się w punkcie startowym', () => {
    const r = runSource(byId('gwiazda').source, '2d');
    expect(dist(r.segments[4]!.to, [0, 0, 0])).toBeLessThan(1e-9);
    expect(r.segments.every((s) => s.color === '#c1763d')).toBe(true);
  });

  test('Spirala zmienia kolory na przemian, a Kula także', () => {
    const sp = runSource(byId('spirala').source, '2d').segments;
    expect(sp[0]!.color).toBe('#16866a'); // zmiana = 1 przy pierwszym boku
    expect(new Set(sp.map((s) => s.color))).toEqual(new Set(['#16866a', '#c1763d']));
    const ku = runSource(byId('kula').source, '3d').segments;
    expect(new Set(ku.map((s) => s.color))).toEqual(new Set(['#16866a', '#2b6fb3']));
  });

  test('Wielokąty rysują wielokąty foremne o boku 60', () => {
    const r = runSource(byId('wielokaty').source, '2d').segments;
    for (const s of r) expect(dist(s.from, s.to)).toBeCloseTo(60, 9);
  });

  test('Śnieżynka: trzy krzywe Kocha tworzą zamknięty kontur', () => {
    const r = runSource(byId('sniezynka').source, '2d').segments;
    expect(dist(r[0]!.from, r[r.length - 1]!.to)).toBeLessThan(1e-6);
  });

  test('Sześcian ma 12 krawędzi długości 100 i wierzchołki w narożnikach', () => {
    const r = runSource(byId('szescian').source, '3d').segments;
    const corners = new Set<string>();
    for (const s of r) {
      for (const p of [s.from, s.to]) corners.add(p.map((v) => Math.round(v)).join(','));
      expect(Math.abs(dist(s.from, s.to) - 100)).toBeLessThan(1e-9);
    }
    expect(corners.size).toBe(8);
  });

  test('Pierścień jest okręgiem przechylonym o 30° (36 boków po 12)', () => {
    const r = runSource(byId('pierscien').source, '3d').segments;
    expect(dist(r[0]!.from, r[35]!.to)).toBeLessThan(1e-9);
    // wszystkie punkty leżą w jednej płaszczyźnie przechylonej o 30° względem poziomej
    const pts = r.map((s) => s.from);
    const n = [0, -Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)];
    for (const p of pts) expect(Math.abs(p[0]! * n[0]! + p[1]! * n[1]! + p[2]! * n[2]!)).toBeLessThan(1e-9);
  });

  test('Schody wznoszą się o 20 na stopień', () => {
    const r = runSource(byId('schody').source, '3d').segments;
    expect(r[r.length - 1]!.to).toEqual([0, 210, 120]);
  });
});
