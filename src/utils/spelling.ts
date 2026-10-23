import { typoConfusables } from '../data/typoConfusables';

export function normalizeApostrophes(text: string): string {
  // Acute accents must be handled before NFKC splits them into combining marks.
  return text.replace(/[‘’´ʼʻ`]+/g, "'").normalize('NFKC');
}

export function oneLetterDifference(actual: string, expected: string): boolean {
  if (actual === expected || Math.abs(actual.length - expected.length) > 1) return false;
  let i = 0; let j = 0; let changes = 0;
  while (i < actual.length && j < expected.length) {
    if (actual[i] === expected[j]) { i++; j++; continue; }
    if (++changes > 1) return false;
    if (actual.length >= expected.length) i++;
    if (expected.length >= actual.length) j++;
  }
  return changes + Number(i < actual.length || j < expected.length) === 1;
}

export function isSafeEnglishTypo(actual: string, expected: string): boolean {
  // Short grammar words, names and unaudited vocabulary are deliberately exact.
  return expected.length >= 4 && actual.length >= 3 && /^[a-z]+$/.test(actual) &&
    Object.hasOwn(typoConfusables, expected) && !typoConfusables[expected].includes(actual) &&
    oneLetterDifference(actual, expected);
}
