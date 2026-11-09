import { normalizeApostrophes } from './spelling';
export const vocabularyKeys = (word: string) => word.split(/\s*\/\s*/).map(value => normalizeApostrophes(value).toLowerCase()
  .replace(/\bi'm\b/g, 'i am').replace(/\byou're\b/g, 'you are').replace(/\bwhat's\b/g, 'what is').replace(/\bname's\b/g, 'name is')
  .replace(/\bdon't\b/g, 'do not').replace(/\bthat's\b/g, 'that is').replace(/\bit's\b/g, 'it is')
  .replace(/[.!?…]/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean);
export const vocabularyKey = (word: string) => vocabularyKeys(word)[0] || '';
