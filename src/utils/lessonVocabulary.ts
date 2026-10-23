import type { PacketLesson } from '../data/b1PacketTypes';
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
