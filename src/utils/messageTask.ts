import type { PacketCard } from '../data/b1PacketTypes';
import { assessPacketAnswer, type PacketVerdict } from './packetAnswer';
export interface MessageResult { value: string; verdict: PacketVerdict }
export type MessageResults = Record<string, MessageResult>;
export function messageValues(answer: string): Record<string, string> {
  try {
    const value: unknown = JSON.parse(answer);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([, v]) => typeof v === 'string'));
  } catch { return {}; }
}
export function retainedMessages(card: PacketCard, previous?: MessageResults): Record<string, string> {
  return Object.fromEntries((card.messages || []).flatMap(field => {
    const saved = previous?.[field.id];
    // A changed role/answer in a review must not retain an inapplicable answer.
    return saved?.verdict.status === 'correct' && assessPacketAnswer(saved.value, field.rule).status === 'correct' ? [[field.id, saved.value]] : [];
  }));
}
export function assessMessages(card: PacketCard, values: Record<string, string>): { verdict: PacketVerdict; fields: MessageResults } {
  const fields = Object.fromEntries((card.messages || []).map(field => [field.id, { value: values[field.id] || '', verdict: assessPacketAnswer(values[field.id] || '', field.rule) }]));
  const results = Object.values(fields);
  const correct = results.length === 2 && results.every(r => r.verdict.status === 'correct');
  const unknown = results.length !== 2 || results.some(r => r.verdict.status === 'unknown');
  return { fields, verdict: { status: correct ? 'correct' : unknown ? 'unknown' : 'wrong', criteria: (card.messages || []).map(field => ({ goal: field.label, passed: fields[field.id].verdict.status === 'correct' })), message: correct ? 'Hər iki mesaj vəziyyətə uyğundur.' : unknown ? 'Hər iki sahədə cavab yaz.' : 'Düzgün hissə saxlanıldı. Digər mesajın məqsədinə bir daha bax.' } };
}
export const messageAnswerText = (card: PacketCard, values: Record<string, string>) => (card.messages || []).map(field => `${field.label}: ${values[field.id] || '—'}`).join('\n');
