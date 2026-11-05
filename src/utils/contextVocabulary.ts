import type { PacketLesson } from '../data/b1PacketTypes';
export type VocabularyEntry = PacketLesson['vocabulary'][number];
const normal = (s: string) => s.toLocaleLowerCase('en').replace(/[‘’]/g, "'");
export function vocabularySegments(text: string, entries: readonly VocabularyEntry[]) {
  const aliases = entries.flatMap(entry => entry.word.split(/\s*\/\s*/).map(word => ({ word: word.replace(/[.!?…]+$/, '').trim(), entry })))
    .filter(a => a.word.trim()).sort((a, b) => b.word.length - a.word.length);
  const parts: { text: string; entry?: VocabularyEntry }[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    const match = aliases.find(a => normal(text.slice(cursor, cursor + a.word.length)) === normal(a.word)
      && !/[\p{L}]/u.test(text[cursor - 1] || '') && !/[\p{L}]/u.test(text[cursor + a.word.length] || ''));
    if (match) { parts.push({ text: text.slice(cursor, cursor + match.word.length), entry: match.entry }); cursor += match.word.length; }
    else { const last = parts.at(-1); if (last && !last.entry) last.text += text[cursor]; else parts.push({ text: text[cursor] }); cursor++; }
  }
  return parts;
}
