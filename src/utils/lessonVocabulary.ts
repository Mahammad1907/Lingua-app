import type { PacketCard, PacketLesson } from '../data/b1PacketTypes';
import { normalizeApostrophes } from './spelling';
const tokens = (text: string) => normalizeApostrophes(text).toLowerCase().match(/[\p{L}]+(?:'[\p{L}]+)*/gu) ?? [];
export function newLessonWords(packet: PacketLesson, earlier: readonly PacketLesson[]): Set<string> {
  const index = earlier.findIndex(l => l.id === packet.id);
  const previous = index >= 0 ? earlier.slice(0, index) : earlier.filter(l => l.order < packet.order);
  const known = new Set(previous.flatMap(l => l.vocabulary.flatMap(v => tokens(v.word))));
  const lexical = packet.vocabulary.filter(v => v.lexical);
  return new Set((lexical.length ? lexical : packet.vocabulary).flatMap(v => tokens(v.word)).filter(w => !known.has(w)));
}
export function vocabularyParts(text: string, fresh: ReadonlySet<string>): { text: string; fresh: boolean }[] {
  return text.split(/([\p{L}]+(?:[‘’´ʼʻ`'][\p{L}]+)*)/gu).filter(Boolean).map(part => ({
    text: part, fresh: fresh.has(normalizeApostrophes(part).toLowerCase()),
  }));
}

// Only the teaching text/examples currently visible to the learner introduce a word.
export function introducedVocabulary(card: PacketCard, packet: PacketLesson): string[] {
  if (card.kind !== 'teach') return [];
  if (card.introducedWords) return card.introducedWords.filter(word => packet.vocabulary.some(v => v.word === word));
  const text = ` ${tokens([card.body, card.board, card.objectWord?.word, card.objectWord?.example, ...(card.examples || [])].filter(Boolean).join(' ')).join(' ')} `;
  return packet.vocabulary.filter(entry => {
    const key = tokens(entry.word).join(' ');
    return key && text.includes(` ${key} `);
  }).map(entry => entry.word);
}

/** Longest phrase wins; positions refer to the original, visibly rendered string. */
export function vocabularySegments(text: string, entries: PacketLesson['vocabulary']): { text: string; entry?: PacketLesson['vocabulary'][number] }[] {
  const normalized = text.replace(/[‘’´ʼʻ`]/g, "'").toLowerCase();
  const candidates = entries.flatMap(entry => entry.word.split(/\s*\/\s*/).map(variant => ({ entry, key: variant.replace(/[‘’´ʼʻ`]/g, "'").replace(/\s*[.…]+$/g, '').toLowerCase().trim() }))).filter(c => c.key).sort((a, b) => b.key.length - a.key.length);
  const output: { text: string; entry?: PacketLesson['vocabulary'][number] }[] = [];
  let start = 0, position = 0;
  const letter = (char: string | undefined) => Boolean(char && /[\p{L}\p{N}]/u.test(char));
  while (position < text.length) {
    const candidate = candidates.find(c => normalized.startsWith(c.key, position) && !letter(text[position - 1]) && !letter(text[position + c.key.length]));
    if (!candidate) { position++; continue; }
    if (position > start) output.push({ text: text.slice(start, position) });
    output.push({ text: text.slice(position, position + candidate.key.length), entry: candidate.entry });
    position += candidate.key.length; start = position;
  }
  if (start < text.length) output.push({ text: text.slice(start) });
  return output;
}
