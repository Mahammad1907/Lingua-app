import type { PacketCard } from '../data/b1PacketTypes';
import { assessPacketAnswer, type PacketVerdict } from './packetAnswer';
/** Preserve demonstrated parts; retry only missing criteria in the authored new situation. */
export function authoredRetry(card: PacketCard, verdict: PacketVerdict, answer: string): PacketCard {
  const retry: PacketCard = JSON.parse(JSON.stringify(card.review || card));
  retry.feedbacks = []; // Never attach an original situation's reason to a changed retry prompt.
  if (card.fields) {
    let values: string[] = []; try { values = JSON.parse(answer); } catch { /* empty fields stay unverified */ }
    retry.fields = card.fields;
    retry.rule = { answers: [], fields: card.fields.map(f => f.rule) };
    retry.retainedFields = card.fields.map((f, i) => assessPacketAnswer(values[i] || '', f.rule).status === 'correct' ? values[i] : '');
  }
  const originalRule = card.turns?.[0]?.rule || card.rule;
  if (originalRule?.goals && verdict.status === 'partial') {
    const failed = originalRule.goals.filter((_, i) => !verdict.criteria[i]?.passed);
    if (failed.length) {
      if (retry.turns?.[0]) retry.turns[0].rule = { ...retry.turns[0].rule, goals: failed };
      else if (retry.rule) retry.rule = { ...retry.rule, goals: failed };
      retry.retainedCriteria = verdict.criteria.filter(c => c.passed).map(c => c.goal);
    }
  }
  return retry;
}

/** Replace only an authored opening recall slot with an authored, modality-matched bank item. */
export function spacedWarmups(packet: import('../data/b1PacketTypes').PacketLesson, lessons: readonly import('../data/b1PacketTypes').PacketLesson[], progress: readonly import('../data/types').LessonProgress[]): PacketCard[] {
  const cards = packet.cards.filter(c => c.kind !== 'review');
  const firstTeach = cards.findIndex(c => c.kind === 'teach');
  if (firstTeach < 0) return cards;
  const candidates = progress.flatMap(p => {
    const source = lessons.find(l => l.id === p.lessonId && l.order < packet.order && packet.order-l.order <= 2);
    return source ? (p.practiceNeeds || []).flatMap(id => {const c=source.cards.find(c=>c.id===id);return c?.review?[{card:c,source}]:[];}) : [];
  });
  const used = new Set<string>();
  return cards.map((slot, index) => {
    if(index>=firstTeach || !['task','voice'].includes(slot.kind))return slot;
    const goals=slot.turns?.[0]?.rule.goals || slot.rule?.goals || [];
    const selected=candidates.find(c=>!used.has(c.card.id)&&c.card.kind===slot.kind&&Boolean(c.card.audio||c.card.turns?.[0]?.audio)===Boolean(slot.audio||slot.turns?.[0]?.audio)&&(c.card.turns?.[0]?.rule.goals||c.card.rule?.goals||[]).some(g=>goals.includes(g)));
    if(!selected)return slot;
    used.add(selected.card.id);const card=JSON.parse(JSON.stringify(selected.card.review!)) as PacketCard;
    card.id=`recheck:${selected.source.id}:${selected.card.id}`;card.number=slot.number;
    if(card.turns)card.turns=card.turns.map(t=>({...t,id:card.id,sample:undefined}));
    return card;
  });
}
export function restoreAuthoredFlow(packet: import('../data/b1PacketTypes').PacketLesson, ids: readonly string[]|undefined, lessons: readonly import('../data/b1PacketTypes').PacketLesson[]): PacketCard[]|undefined {
  if(!ids)return;
  const cards:PacketCard[]=[];
  for(const id of ids){
    const direct=packet.cards.find(c=>c.id===id);
    if(direct){cards.push(direct);continue;}
    const source=lessons.flatMap(l=>l.cards).find(c=>id.startsWith('recheck:')&&id.endsWith(`:${c.id}`));
    if(!source?.review)return;
    const copy=JSON.parse(JSON.stringify(source.review)) as PacketCard;copy.id=id;
    if(copy.turns)copy.turns=copy.turns.map(t=>({...t,id,sample:undefined}));cards.push(copy);
  }
  return cards;
}
