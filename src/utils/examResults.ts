// One place that reads section-exam results (18 Nov 2026). Section exams on the new screens are stored by
// userStore.saveSectionExam (best result in `sectionExams`, every attempt in `examHistory`); older module tests stay in
// `placementResults`. A section that has an exam opens the next section only when its lessons are done AND the exam is passed.
export const PASS_PERCENT = 70;
export interface ExamAttempt { percent: number; passed: boolean; at: string }
export type SectionExams = Record<string, ExamAttempt>;
export type ExamHistory = Record<string, ExamAttempt[]>;
export const MAX_ATTEMPTS_KEPT = 20;

/** Best attempt wins; a pass is never replaced by a fail, and a higher percent replaces a lower one. */
export function bestAttempt(prior: ExamAttempt | undefined, next: ExamAttempt): ExamAttempt {
  if (!prior) return next;
  if (prior.passed !== next.passed) return prior.passed ? prior : next;
  return next.percent > prior.percent ? next : prior;
}
export function addAttempt(history: ExamHistory, lessonId: string, attempt: ExamAttempt): ExamHistory {
  return { ...history, [lessonId]: [...(history[lessonId] ?? []), attempt].slice(-MAX_ATTEMPTS_KEPT) };
}
/** Pass mark in one place (70 %, changed from 80 on 18 Nov 2026). */
export const isPass = (percent: number) => percent >= PASS_PERCENT;
/** True when a section either has no exam or its exam has been passed. */
export function examCleared(examLessonId: string | undefined, exams: SectionExams | undefined): boolean {
  return !examLessonId || exams?.[examLessonId]?.passed === true;
}
