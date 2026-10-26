import type { PacketCard, PacketLesson } from '../data/b1PacketTypes';
import type { LessonProgress } from '../data/types';
import { packetFlow } from '../data/b1Course';

// Lesson distance is a starting policy, not a CEFR rule. Failed rechecks return
// sooner; previously independent skills wait longer and compete at lower priority.
export function lessonRecall(packet: PacketLesson, lessons: readonly PacketLesson[], progress: readonly LessonProgress[]): PacketCard | undefined {
  const candidates: { card: PacketCard; priority: number; distance: number }[] = [];
  for (const result of progress) {
    const prior = lessons.find(l => l.id === result.lessonId && l.order < packet.order);
    if (!prior) continue;
    const flow = packetFlow(prior);
    const ids = new Set([...(result.practiceNeeds || []), ...flow.filter(c => ['task', 'voice'].includes(c.kind)).map(c => c.id)]);
    for (const id of ids) {
      const original = flow.find(c => c.id === id);
      if (!original?.review) continue;
      const history = progress.flatMap(p => {
        const order = lessons.find(l => l.id === p.lessonId)?.order || 0;
        return order < packet.order ? (p.rechecks || []).filter(r => r.sourceLessonId === prior.id && r.taskId === id).map(r => ({ ...r, order })) : [];
      }).sort((a, b) => b.order - a.order);
      const latest = history[0];
      const difficult = latest ? latest.status !== 'independent' : Boolean(result.practiceNeeds?.includes(id));
      const distance = packet.order - (latest?.order || prior.order);
      if (distance < (difficult ? 1 : 3)) continue;
      const source = original.review;
      const recallId = `recheck:${prior.id}:${id}`;
      const turns = source.turns?.map(t => ({ ...t, id: recallId, sample: undefined }));
      const card = { ...source, id: recallId, turns, review: { ...source, id: recallId }, title: 'Əvvəlki bacarığı yenidən yoxla' };
      candidates.push({ card, priority: difficult ? 0 : 1, distance });
    }
  }
  candidates.sort((a, b) => a.priority - b.priority || b.distance - a.distance);
  return candidates[0]?.card;
}
export function withLessonRecall(flow: PacketCard[], recall?: PacketCard): PacketCard[] {
  if (!recall) return flow;
  const after = flow.map((c, i) => c.kind === 'task' || c.kind === 'voice' ? i : -1).filter(i => i >= 0)[2];
  if (after === undefined) return flow;
  return [...flow.slice(0, after + 1), recall, ...flow.slice(after + 1)];
}
