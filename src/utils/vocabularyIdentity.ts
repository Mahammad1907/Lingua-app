import { normalizeApostrophes } from './spelling';
export const vocabularyKey = (word: string) => normalizeApostrophes(word).toLowerCase().replace(/[.!?]/g, '').replace(/\s+/g, ' ').trim();
