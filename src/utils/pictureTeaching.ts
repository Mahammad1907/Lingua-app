import { b1Packet } from '../data/b1Course';
import type { PacketLesson } from '../data/b1PacketTypes';
import { vocabularySegments } from './contextVocabulary';
const tokens = (text: string) => text.toLowerCase().replace(/[‘’]/g,"'").match(/[a-z]+(?:'[a-z]+)?/g) || [];
export function pictureTeachingEntries(text: string, packet: PacketLesson, cardNumber: number) {
  const taught = b1Packet.filter(p=>p.order<=packet.order).flatMap(p=>p.cards.filter(c=>c.kind==='teach' && (p.order<packet.order || c.number<=cardNumber))).flatMap(c=>[c.body,c.board||'',...(c.examples||[])]).join(' ');
  const allowed = new Set([...tokens(taught),'ali','leyla','sam','alex']);
  return [...new Map(vocabularySegments(text,packet.vocabulary).flatMap(p=>p.entry?[[p.entry.word,p.entry] as const]:[])).values()].map(entry=>({...entry, example:tokens(entry.example).every(t=>allowed.has(t))?entry.example:'', exampleAz:tokens(entry.example).every(t=>allowed.has(t))?entry.exampleAz:''}));
}
