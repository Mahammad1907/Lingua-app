import type { TaskEvidence } from './lessonEvidence';
export const MAX_ENERGY = 5;
export const LESSON_XP = 20;
export const gameLevel = (xp: number) => Math.floor(xp / 100) + 1;
export function localDay(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function previousDay(date = new Date()): string {
  const d = new Date(date); d.setDate(d.getDate() - 1); return localDay(d);
}
export interface TaskResult { firstCorrect: boolean; resolved: boolean; skipped: boolean; wrong: number; token: string; evidence?: TaskEvidence }
export interface LessonAttempt { id: string; lessonId: string; expected: string[]; optional?: string[]; tasks: Record<string, TaskResult>; assisted: boolean; finished: boolean }
export interface RewardReceipt { id: string; lessonId: string; xp: number; completed: boolean; correct: number; total: number }
export interface RewardRecord { amount: number; day: string }
