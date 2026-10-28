import { expect, test } from 'bun:test';
import pkg from '../package.json';
import { VERSION } from '../src/version';

test('wersja w kodzie zgadza się z package.json', () => {
  expect(VERSION).toBe(pkg.version);
});
