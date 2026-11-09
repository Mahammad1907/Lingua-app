import { b1Packet } from '../data/b1Course';
import type { PacketLesson } from '../data/b1PacketTypes';
import { vocabularySegments } from './contextVocabulary';
import type { VocabularyEntry } from './contextVocabulary';
const tokens = (text: string) => text.toLowerCase().replace(/[‘’]/g,"'").match(/[a-z]+(?:'[a-z]+)?/g) || [];
export function safeTeachingEntry(entry: VocabularyEntry, packet: PacketLesson, cardNumber: number) {
  const taught = b1Packet.filter(p=>p.order<=packet.order).flatMap(p=>p.cards.filter(c=>c.kind==='teach' && (p.order<packet.order || c.number<=cardNumber))).flatMap(c=>[c.body,c.board||'',...(c.examples||[])]).join(' ');
  const allowed = new Set([...tokens(taught),'ali','leyla','sam','alex']);
  const safe = tokens(entry.example).every(t => allowed.has(t));
  return { ...entry, example: safe ? entry.example : '', exampleAz: safe ? entry.exampleAz : '' };
}
export function pictureTeachingEntries(text: string, packet: PacketLesson, cardNumber: number) {
  return [...new Map(vocabularySegments(text,packet.vocabulary).flatMap(p=>p.entry?[[p.entry.word,p.entry] as const]:[])).values()].map(entry => safeTeachingEntry(entry, packet, cardNumber));
}
