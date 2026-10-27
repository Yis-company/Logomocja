import { expect, test } from 'bun:test'
import { runProgram } from '../src/lang'

const near = (a: number[], b: number[]) => a.forEach((v, i) => expect(v).toBeCloseTo(b[i], 9))

test('square closes and uses defaults', () => {
  const r = runProgram('powtorz 4 [np 80 pw 90]', '2d')
  expect(r.error).toBeNull()
  expect(r.segments.length).toBe(4)
  near(r.segments[0].to, [0, 80, 0])
  near(r.segments[1].to, [80, 80, 0])
  near(r.segments[3].to, [0, 0, 0])
  expect(r.segments[0].color).toBe('#16866a')
  expect(r.segments[0].width).toBe(3)
})

test('procedures, both header styles, params', () => {
  const a = runProgram('oto kwadrat ma: bok, kąt\n powtorz 4 [np bok pw kąt]\njuż\nkwadrat 80 90', '3d')
  const b = runProgram('KWADRAT 80 90\nTO kwadrat :bok :kąt\n repeat 4 [fd :bok rt :kąt]\nEND', '2d')
  expect(a.error).toBeNull()
  expect(b.error).toBeNull()
  expect(a.segments).toEqual(b.segments)
  expect(a.segments.length).toBe(4)
})

test('pitch', () => {
  const r = runProgram('gora 90 np 10', '3d')
  near(r.segments[0].to, [0, 0, 10])
  const e = runProgram('gora 90', '2d')
  expect(e.error?.line).toBe(1)
  expect(e.error?.column).toBe(1)
})

test('errors have positions and draw nothing', () => {
  const r = runProgram('np 10\n  foo 3', '2d')
  expect(r.segments).toEqual([])
  expect(r.error).toMatchObject({ line: 2, column: 3 })
  expect(runProgram('np 10 grubosc 13', '2d').error?.column).toBe(15)
  expect(runProgram('kolor "#12"', '2d').error?.column).toBe(7)
  expect(runProgram('powtorz 2 [np 5', '2d').error?.column).toBe(11)
  expect(runProgram('np 5 ]', '2d').error?.column).toBe(6)
  expect(runProgram('oto a\n np 1', '2d').error?.line).toBe(1)
  expect(runProgram('oto a ma: x\n np x\njuż\na', '2d').error?.message).toContain('wymaga 1')
  expect(runProgram('oto a\n powtorz 2 [oto b\n już]\njuż', '2d').error?.line).toBe(2)
  expect(runProgram('oto a\n a\njuż', '2d').error?.message).toContain('rekurencja')
  expect(runProgram('oto a\n b\njuż\noto b\n a\njuż', '2d').error).not.toBeNull()
  expect(runProgram('oto a ma: w\n grubosc w\njuż\nnp 5\na 20', '2d').segments).toEqual([])
})

test('runtime errors keep drawn segments', () => {
  const r = runProgram('np 5 np 99990 np 100000', '2d')
  expect(r.segments.length).toBe(2)
  expect(r.error).not.toBeNull()
  const l = runProgram('powtorz 100 [powtorz 101 [np 1]]', '2d')
  expect(l.error?.message).toContain('limit')
  expect(l.segments.length).toBeGreaterThan(9000)
})

test('pen up, zero moves, comments', () => {
  const r = runProgram('; hi\npod np 5 opu np 0 ws 5 kolor "#ABCDEF" grubosc 12 np 1', '2d')
  expect(r.error).toBeNull()
  expect(r.segments.length).toBe(2)
  expect(r.segments[1].color).toBe('#abcdef')
  expect(r.segments[1].width).toBe(12)
})
