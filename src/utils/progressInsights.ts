// Plain numbers for the home screen and the Analiz screen, taken only from saved lesson results.
import { resolveNames } from '../config/characters';
import { designLessons } from '../data/designLessons';
import type { DesignTask } from '../data/designLessonTypes';
import type { LessonProgress } from '../data/types';

type Saved = LessonProgress & { completedAt?: string; practiceNeeds?: string[];
  evidence?: { written: number; spoken: number; listeningIndependent: number; listeningAssisted: number } };

const DAYS = ['B', 'B.e', 'Ç.a', 'Ç', 'C.a', 'C', 'Ş'];
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/** Lessons finished on each of the last 7 days, oldest first. */
export function weekActivity(progress: Saved[], now = new Date()) {
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(now); day.setDate(now.getDate() - (6 - i));
    const count = progress.filter(p => p.completedAt && dayKey(new Date(p.completedAt)) === dayKey(day)).length;
    return { label: i === 6 ? 'Bu gün' : DAYS[day.getDay()], count };
  });
}

/** How many answers were given by writing, by voice, and how many listening answers were independent. */
export function skillTotals(progress: Saved[]) {
  return progress.reduce((t, p) => {
    const e = p.evidence; if (!e) return t;
    return { written: t.written + e.written, spoken: t.spoken + e.spoken, listening: t.listening + e.listeningIndependent, listeningHelp: t.listeningHelp + e.listeningAssisted };
  }, { written: 0, spoken: 0, listening: 0, listeningHelp: 0 });
}

export const averageScore = (progress: Saved[]) => progress.length ? Math.round(progress.reduce((s, p) => s + p.score, 0) / progress.length) : 0;

/** The English phrase a task practises, for the “hard phrases” list. */
function phraseOf(task: DesignTask, id: string): string | undefined {
  if (task.type === 'choice') return /[a-z]/i.test(task.answer) && !/[əğışçöü]/i.test(task.answer) ? task.answer : undefined;
  if (task.type === 'write' || task.type === 'voice') return task.rule.answers[0];
  if (task.type === 'two') return task.fields.find(f => f.id === id)?.rule.answers[0];
  if (task.type === 'match') return task.rows[0]?.en;
  return undefined;
}

/** Phrases from tasks that had mistakes, newest lessons first, without repeats. */
export function hardPhrases(progress: Saved[]): string[] {
  const out: string[] = [];
  for (const p of [...progress].reverse()) {
    const lesson = designLessons.find(l => l.id === p.lessonId); if (!lesson) continue;
    for (const id of p.practiceNeeds ?? []) {
      const task = lesson.cards.find(c => c.id === id || ('fields' in c && c.fields.some(f => f.id === id))) as DesignTask | undefined;
      const phrase = task && phraseOf(task, id);
      if (phrase && !out.includes(phrase)) out.push(resolveNames(phrase));
    }
  }
  return out;
}

export type GoalStatus = 'independent' | 'assisted' | 'practice' | 'todo';
/** “Edə bilirəm”: each lesson goal with a status from that lesson's saved result. */
export function canDo(progress: Saved[]) {
  return designLessons.flatMap(lesson => {
    const p = progress.find(x => x.lessonId === lesson.id);
    const status: GoalStatus = !p ? 'todo' : p.score >= 90 ? 'independent' : p.score >= 60 ? 'assisted' : 'practice';
    const intro = lesson.cards.find(c => c.type === 'intro');
    const goals = intro && intro.type === 'intro' ? intro.goals.map(g => g.text) : [lesson.title];
    return goals.map(text => ({ lesson: lesson.order, text: resolveNames(text), status }));
  });
}
