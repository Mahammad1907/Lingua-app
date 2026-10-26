import type { PacketCard, PacketLesson } from '../data/b1PacketTypes';
import type { LessonProgress } from '../data/types';
import { packetFlow } from '../data/b1Course';

export function lessonRecall(packet: PacketLesson, lessons: readonly PacketLesson[], progress: readonly LessonProgress[]): PacketCard | undefined {
  for (const result of progress) {
    const prior = lessons.find(l => l.id === result.lessonId && l.order < packet.order);
    if (!prior) continue;
    for (const id of result.practiceNeeds || []) {
      if (progress.some(p => p.rechecks?.some(r => r.sourceLessonId === prior.id && r.taskId === id && r.status === 'independent'))) continue;
      const original = packetFlow(prior).find(c => c.id === id);
      if (!original?.review) continue;
      const source = original.review;
      const recallId = `recheck:${prior.id}:${id}`;
      return { ...source, id: recallId, review: { ...source, id: recallId },
        turns: source.turns?.map(t => ({ ...t, id: recallId, sample: undefined })),
        body: source.body, title: 'Əvvəlki bacarığı yenidən yoxla' };
    }
  }
}
export function withLessonRecall(flow: PacketCard[], recall?: PacketCard): PacketCard[] {
  if (!recall) return flow;
  const after = flow.map((c, i) => c.kind === 'task' || c.kind === 'voice' ? i : -1).filter(i => i >= 0)[2];
  if (after === undefined) return flow;
  return [...flow.slice(0, after + 1), recall, ...flow.slice(after + 1)];
}
