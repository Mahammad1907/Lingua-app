// Spaced review (18 Nov 2026, user: “1, 3, 7, 14 günlük təkrar”). Pure functions, no storage.
// The 1 / 3 / 7 / 14 day steps are a BirTalk starting policy, not a CEFR rule (AGENTS.md, spaced review).
// An item is one skill: a task of a finished lesson, practised again in its review situation (same skill, new situation).
//   stage 0 → next review in 1 day, 1 → 3 days, 2 → 7 days, 3 → 14 days, 4 → “steady”: every 30 days.
// Correct: one stage up. Wrong: two stages down (never below 0), so difficulty shortens the interval.
// Skipped, technical and unassessable answers change nothing (they stay Unverified, never a language mistake).
import { localDay } from './rewards';

export const INTERVALS = [1, 3, 7, 14] as const;
export const STEADY_DAYS = 30;
export const MAX_STAGE = INTERVALS.length;
/** A review session never asks more than this many tasks at once. */
export const SESSION_SIZE = 10;

export interface ReviewItem {
  /** `${lessonId}:${taskId}` */
  key: string; lessonId: string; taskId: string;
  stage: number; dueDay: string; lapses: number; lastDay: string;
}

export const addDays = (day: string, days: number): string => {
  const [y, m, d] = day.split('-').map(Number);
  return localDay(new Date(y, m - 1, d + days));
};
export const intervalFor = (stage: number): number => stage >= MAX_STAGE ? STEADY_DAYS : INTERVALS[Math.max(0, stage)];

/** A task of a finished lesson enters the schedule. Answered correctly on its own → starts at 3 days; otherwise tomorrow. */
export function registerItem(items: Record<string, ReviewItem>, lessonId: string, taskId: string, today: string, difficult: boolean): Record<string, ReviewItem> {
  const key = `${lessonId}:${taskId}`;
  if (items[key]) return items;
  const stage = difficult ? 0 : 1;
  return { ...items, [key]: { key, lessonId, taskId, stage, dueDay: addDays(today, intervalFor(stage)), lapses: difficult ? 1 : 0, lastDay: today } };
}

/** The result of one review. `correct` is true or false for a confirmed verdict; anything else must not call this. */
export function gradeItem(item: ReviewItem, correct: boolean, today: string): ReviewItem {
  const stage = correct ? Math.min(MAX_STAGE, item.stage + 1) : Math.max(0, item.stage - 2);
  return { ...item, stage, dueDay: addDays(today, intervalFor(stage)), lapses: item.lapses + (correct ? 0 : 1), lastDay: today };
}

export const isDue = (item: ReviewItem, today: string) => item.dueDay <= today;

/** Due items, most overdue and most difficult first. */
export function dueItems(items: Record<string, ReviewItem>, today: string, limit = Infinity): ReviewItem[] {
  return Object.values(items).filter(i => isDue(i, today))
    .sort((a, b) => a.dueDay.localeCompare(b.dueDay) || a.stage - b.stage || b.lapses - a.lapses || a.key.localeCompare(b.key))
    .slice(0, limit);
}
