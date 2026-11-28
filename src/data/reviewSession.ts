// Daily review session (18 Nov 2026): due tasks of finished lessons, each in its review situation
// (same skill, new situation), run by the same DesignLesson screens. No XP, no hearts, no end-of-lesson retry round.
import { isTask, reviewTask } from '../utils/designLesson';
import { addDays, type ReviewItem } from '../utils/spacedReview';
import { ordinal } from '../utils/ordinal';
import { useReviewStore } from '../store/reviewStore';
import { designLessons, getDesignLesson } from './designLessons';
import type { DesignLesson, TaskWithReview } from './designLessonTypes';
import type { LessonProgress } from './types';

/** Voice tasks need a microphone and a recogniser (Expo Go has none), so they are not part of the review. */
const reviewable = (card: DesignLesson['cards'][number]): card is TaskWithReview => isTask(card as never) && card.type !== 'voice';
const fieldIds = (t: TaskWithReview) => t.type === 'two' ? t.fields.map(f => f.id) : [t.id];

const label = (l: DesignLesson) => `Bölmə ${l.unit ?? 1} · Dərs ${l.number ?? l.order}${l.part ? ` · ${ordinal(l.part)} hissə` : ''}`;

export function buildReviewLesson(items: ReviewItem[], today: string): DesignLesson | undefined {
  const cards: DesignLesson['cards'] = [];
  const goals: DesignLesson['result']['goals'] = [];
  const reviewOf: Record<string, string> = {};
  let base: DesignLesson | undefined;
  for (const item of items) {
    const lesson = getDesignLesson(item.lessonId);
    const source = lesson ? [...lesson.cards, ...(lesson.pool ?? [])].find(c => c.id === item.taskId) : undefined;
    if (!lesson || lesson.exam || !source || !reviewable(source)) continue;
    const task = reviewTask(lesson, item.taskId) as TaskWithReview | undefined;
    if (!task) continue;
    const ids = fieldIds(task);
    if ([task.id, ...ids].some(id => id in reviewOf)) continue; // a clashing id would mix two skills up
    base ??= lesson;
    for (const id of [task.id, ...ids]) reviewOf[id] = item.key;
    const n = cards.length + 1;
    cards.push({ ...task, number: n } as TaskWithReview);
    const goal = lesson.result.goals.find(g => g.tasks.some(t => ids.includes(t) || t === task.id));
    goals.push({ group: label(lesson), text: `${n}. ${goal?.text ?? task.title}`, tasks: [ids[0]] });
  }
  if (!base || !cards.length) return undefined;
  return {
    id: `review:${today}`, order: 0, title: 'Gündəlik təkrar', section: 'Təkrar', cards, reviewOf,
    notices: base.notices, vocabulary: [],
    result: {
      done: ['Təkrar tamamlandı', 'Cavabların növbəti təkrarın vaxtını müəyyən edir.'],
      incomplete: 'Təkrar tamamlanmadı.', goals,
      closing: 'Çətin gələnlər tezliklə yenidən gələcək, rahat olanlar isə daha gec.',
      button: 'Ana səhifəyə qayıt', technical: base.result.technical, unverified: base.result.unverified,
    },
  };
}

/** Lessons finished before the schedule existed enter it once: difficult tasks (practiceNeeds) tomorrow, the rest in 3 days. */
export function registerFinishedLessons(progress: readonly LessonProgress[]) {
  const store = useReviewStore.getState();
  for (const p of progress) {
    if (!p.completed) continue;
    const lesson = designLessons.find(l => l.id === p.lessonId);
    if (!lesson || lesson.exam || Object.values(store.items).some(i => i.lessonId === lesson.id)) continue;
    const needs = new Set((p as LessonProgress & { practiceNeeds?: string[] }).practiceNeeds ?? []);
    const tasks = [...lesson.cards.filter(reviewable).map(t => ({ taskId: t.id, difficult: fieldIds(t).some(id => needs.has(id)) })),
      ...(lesson.pool ?? []).filter(reviewable).map(t => ({ taskId: t.id, difficult: false, fresh: true }))];
    if (tasks.length) store.registerLesson(lesson.id, tasks);
  }
}
export { addDays };
