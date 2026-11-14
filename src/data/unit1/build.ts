// Small helpers so Bölmə 1 lessons read like the lesson document, not like plumbing.
// Every learner-facing string stays in the lesson files; nothing is generated here.
import type { PacketGoal, PacketRule } from '../b1PacketTypes';
import type { Explanation, Variant } from '../designLessonTypes';

/** Five-part explanation (“Sənin cavabın” is filled with the learner's real answer). */
export const ex = (answers: string, reason: string, rule: string, example: string): Explanation => ({ answers, reason, rule, example });

/** Explanation for any other confirmed wrong answer. */
export const other = (short: string, explain: Explanation): Variant => ({ match: { other: true }, short, explain });
/** Explanation for one chosen option (choice tasks) or one sentence row (match tasks). */
export const pick = (option: string, short: string, explain: Explanation): Variant => ({ match: { option }, short, explain });
/** Explanation when the answer does another job (e.g. a farewell where a greeting was needed). */
export const insteadOf = (goal: PacketGoal, short: string, explain: Explanation): Variant => ({ match: { goal }, short, explain });

/** Answer rule by communicative goal(s); `answers` are the model answers shown after a mistake. */
export const goal = (goals: PacketGoal[], answers: string[]): PacketRule => ({ goals, answers });
/** Answer rule for an exact word or phrase (listening, word-order). */
export const exact = (...answers: string[]): PacketRule => ({ answers, exact: true });
