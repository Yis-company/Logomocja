import { describe, expect, test } from 'bun:test';
import { ok, closeSeg, closeVec, last } from './helpers';

const S3 = Math.sqrt(3) / 2; // sin 60 = cos 30
const R2 = Math.SQRT1_2;

describe('2D turning', () => {
  test('square returns to the origin', () => {
    const s = ok('powtorz 4 [np 10 pw 90]');
    expect(s.length).toBe(4);
    closeSeg(s[0], [0, 0, 0], [0, 10, 0]);
    closeSeg(s[1], [0, 10, 0], [10, 10, 0]);
    closeSeg(s[2], [10, 10, 0], [10, 0, 0]);
    closeSeg(s[3], [10, 0, 0], [0, 0, 0]);
  });
  test('right 30 / left 30', () => {
    closeVec(last(ok('pw 30 np 10')), [5, 10 * S3, 0]);
    closeVec(last(ok('lw 30 np 10')), [-5, 10 * S3, 0]);
  });
  test('negative angles turn the other way', () => {
    closeVec(last(ok('pw -90 np 10')), [-10, 0, 0]);
    closeVec(last(ok('lw -90 np 10')), [10, 0, 0]);
  });
  test('angles beyond 360 and decimals', () => {
    closeVec(last(ok('pw 450 np 10')), [10, 0, 0]);
    closeVec(last(ok('pw 22.5 pw 22.5 np 10')), [10 * R2, 10 * R2, 0]);
  });
  test('ws after turn', () => {
    closeVec(last(ok('pw 90 ws 10')), [-10, 0, 0]);
  });
  test('all 2D coordinates have z = 0', () => {
    for (const s of ok('powtorz 7 [np 13 pw 51.4]')) {
      expect(s.from[2]).toBeCloseTo(0, 9);
      expect(s.to[2]).toBeCloseTo(0, 9);
    }
  });
});

describe('3D pitch', () => {
  test('gora 90 heads along former up (+Z)', () => {
    closeVec(last(ok('gora 90 np 10', '3d')), [0, 0, 10]);
  });
  test('dol 90 heads -Z', () => {
    closeVec(last(ok('dol 90 np 10', '3d')), [0, 0, -10]);
  });
  test('gora 30 / dol 30', () => {
    closeVec(last(ok('gora 30 np 10', '3d')), [0, 10 * S3, 5]);
    closeVec(last(ok('dol 30 np 10', '3d')), [0, 10 * S3, -5]);
  });
  test('negative pitch goes the other way', () => {
    closeVec(last(ok('gora -90 np 10', '3d')), [0, 0, -10]);
  });
  test('up vector follows: second gora 90 heads -Y', () => {
    closeVec(last(ok('gora 90 gora 90 np 10', '3d')), [0, -10, 0]);
  });
  test('pitch keeps the right vector', () => {
    closeVec(last(ok('gora 37 pw 90 np 10', '3d')), [10, 0, 0]);
    closeVec(last(ok('gora 90 lw 90 np 10', '3d')), [-10, 0, 0]);
  });
  test('turning keeps up vector', () => {
    closeVec(last(ok('pw 37 gora 90 np 10', '3d')), [0, 0, 10]);
  });
  test('turn, pitch, turn', () => {
    // pw 90: H=+X R=-Y U=+Z ; gora 90: H=+Z U=-X R=-Y ; pw 90: H=-Y
    const s = ok('pw 90 gora 90 np 10 pw 90 np 10', '3d');
    expect(s.length).toBe(2);
    closeSeg(s[0], [0, 0, 0], [0, 0, 10]);
    closeSeg(s[1], [0, 0, 10], [0, -10, 10]);
  });
  test('turn after pitch rotates around the new up', () => {
    // gora 90: H=+Z, U=-Y, R=+X ; pw 90: H=+X
    const s = ok('gora 90 np 10 pw 90 np 10', '3d');
    closeSeg(s[1], [0, 0, 10], [10, 0, 10]);
  });
});

describe('3D roll', () => {
  test('roll does not change heading', () => {
    closeVec(last(ok('pp 37 np 10', '3d')), [0, 10, 0]);
    closeVec(last(ok('pl 37 np 10', '3d')), [0, 10, 0]);
  });
  test('after pp 90 right is former down (-Z)', () => {
    closeVec(last(ok('pp 90 pw 90 np 10', '3d')), [0, 0, -10]);
  });
  test('after pp 90 up is former right (+X)', () => {
    closeVec(last(ok('pp 90 gora 90 np 10', '3d')), [10, 0, 0]);
  });
  test('after pl 90 up is former left (-X), right is former up (+Z)', () => {
    closeVec(last(ok('pl 90 gora 90 np 10', '3d')), [-10, 0, 0]);
    closeVec(last(ok('pl 90 pw 90 np 10', '3d')), [0, 0, 10]);
  });
  test('negative roll goes the other way', () => {
    closeVec(last(ok('pp -90 pw 90 np 10', '3d')), [0, 0, 10]);
  });
  test('pp 30 then pitch up 90', () => {
    closeVec(last(ok('pp 30 gora 90 np 10', '3d')), [5, 0, 10 * S3]);
    closeVec(last(ok('pl 30 gora 90 np 10', '3d')), [-5, 0, 10 * S3]);
  });
  test('upside down turtle: pp 180 then right turns towards -X', () => {
    closeVec(last(ok('pp 180 pw 90 np 10', '3d')), [-10, 0, 0]);
  });
  test('pp 90 then dol 90 heads -X', () => {
    closeVec(last(ok('pp 90 dol 90 np 10', '3d')), [-10, 0, 0]);
  });
  test('roll, pitch, turn', () => {
    // pp 90: U=+X R=-Z ; gora 90: H=+X U=-Y R=-Z ; pw 90: H=-Z
    const s = ok('pp 90 gora 90 np 10 pw 90 np 10', '3d');
    closeSeg(s[0], [0, 0, 0], [10, 0, 0]);
    closeSeg(s[1], [10, 0, 0], [10, 0, -10]);
  });
  test('roll after turning rolls around current heading', () => {
    // pw 90: H=+X R=-Y U=+Z ; pp 90: U=-Y R=-Z ; gora 90: H=-Y
    closeVec(last(ok('pw 90 pp 90 gora 90 np 10', '3d')), [0, -10, 0]);
  });
});

describe('2D and 3D agree on flat programs', () => {
  test('identical coordinates', () => {
    const src =
      'powtorz 5 [np 20 pw 144] lw 33.3 ws 7 pod np 3 opu kolor "#123abc" grubosc 4 powtorz 3 [np nrpowt * 5 lw 120] dom np 2';
    const a = ok(src, '2d');
    const b = ok(src, '3d');
    expect(a.length).toBe(b.length);
    expect(a.length).toBeGreaterThan(0);
    for (let i = 0; i < a.length; i++) {
      closeSeg(b[i], a[i].from, a[i].to);
      expect(b[i].color).toBe(a[i].color);
      expect(b[i].width).toBe(a[i].width);
    }
  });
});
