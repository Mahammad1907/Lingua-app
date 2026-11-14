// Pure lesson logic for the redesigned lesson screens (no React, so it can be tested in Node).
import type { DesignLesson, DesignTask, Explanation, IntroCard, MatchTask, ReviewOf, TeachCard, TwoTask, Variant, WordCard } from '../data/designLessonTypes';
import { resolveNames } from '../config/characters';
import { assessPacketAnswer, normalizePacketAnswer, type PacketVerdict } from './packetAnswer';

export type FlowCard = IntroCard | TeachCard | WordCard | DesignTask;
export type Verdict = 'correct' | 'wrong' | 'unknown' | 'empty';

export interface Graded {
  status: Verdict;
  /** Short reason shown in the result panel. */
  short?: string;
  /** Five-part explanation (“Mənə başa sal”). Present for confirmed wrong answers only. */
  explain?: Explanation & { yourAnswer: string };
  spellingCorrections?: PacketVerdict['spellingCorrections'];
  /** “Kim nə dedi?”: which sentences got the right meaning. */
  rows?: Record<string, 'correct' | 'wrong'>;
}

export interface TwoGraded { fields: Record<string, Graded>; status: Verdict; short?: string; explain?: Graded['explain']; emptyNotice?: string }

export function resolveLesson(lesson: DesignLesson): DesignLesson { return resolveNames(lesson); }

export function isTask(card: FlowCard | undefined): card is DesignTask {
  return Boolean(card && (card.type === 'choice' || card.type === 'write' || card.type === 'two' || card.type === 'voice' || card.type === 'match'));
}

export function lessonFlow(lesson: DesignLesson): FlowCard[] {
  return lesson.cards.map(card => {
    if (!isTask(card as FlowCard)) return card as FlowCard;
    const { review: _review, ...task } = card as DesignTask & { review?: unknown };
    return task as DesignTask;
  });
}

/** Retry version of a task: same id, type and modality; new situation from the review bank. */
export function reviewTask(lesson: DesignLesson, id: string): DesignTask | undefined {
  const card = lesson.cards.find(c => c.id === id) as (DesignTask & { review?: ReviewOf<DesignTask> }) | undefined;
  if (!card || !isTask(card)) return undefined;
  return card.review ? { ...card, ...card.review, id: card.id, number: card.number, type: card.type } as DesignTask : card;
}

/** Task ids the progress store tracks. Written/choice answers are required; voice can be skipped. */
export function lessonTaskIds(lesson: DesignLesson) {
  const flow = lessonFlow(lesson).filter(isTask);
  const required = flow.flatMap(t => t.type === 'two' ? t.fields.map(f => f.id) : t.type === 'voice' ? [] : [t.id]);
  const optional = flow.filter(t => t.type === 'voice').map(t => t.id);
  return { required, optional };
}

const fulfils = (value: string, goal: NonNullable<Parameters<typeof assessPacketAnswer>[1]['goals']>[number], voice = false) =>
  assessPacketAnswer(value, { answers: [], goals: [goal] }, voice).status === 'correct';

function pickVariant(variants: Variant[], value: string, voice: boolean, field?: string): Variant | undefined {
  const words = normalizePacketAnswer(value);
  return variants.find(v => {
    if (v.field && v.field !== field) return false;
    const m = v.match;
    if ('other' in m) return true;
    if ('words' in m) return m.words.some(w => normalizePacketAnswer(w) === words);
    if ('goal' in m) return fulfils(value, m.goal, voice);
    if ('option' in m) return m.option === value;
    if ('pattern' in m) return new RegExp(m.pattern, 'iu').test(value.trim());
    return false;
  });
}

const explainOf = (variant: Variant | undefined, yourAnswer: string, purpose?: string): Graded['explain'] =>
  variant ? { ...variant.explain, reason: variant.explain.reason.replace('{purpose}', purpose ?? ''), yourAnswer } : undefined;

export function gradeChoice(task: Extract<DesignTask, { type: 'choice' }>, option: string): Graded {
  if (!option) return { status: 'empty' };
  if (option === task.answer) return { status: 'correct' };
  const variant = task.variants.find(v => 'option' in v.match && v.match.option === option) ?? task.variants.find(v => 'other' in v.match);
  return { status: 'wrong', short: variant?.short ?? variant?.explain.reason, explain: explainOf(variant, option) };
}

/** Written and spoken answers. `voice` relaxes known speech-recognition spellings only. */
export function gradeText(task: Extract<DesignTask, { type: 'write' | 'voice' }>, value: string, voice = false): Graded {
  if (!value.trim()) return { status: 'empty' };
  const verdict = assessPacketAnswer(value, task.rule, voice);
  if (verdict.status === 'correct') return { status: 'correct', spellingCorrections: verdict.spellingCorrections };
  const variant = pickVariant(task.variants, value, voice);
  // Speech the grader cannot judge stays “Yoxlanmadı” — unless it is one of the task's known typical mistakes
  // (e.g. “I have 25 years”), which is a real language error with its own explanation (14 Nov 2026).
  if (verdict.status === 'unknown' && !(variant && !('other' in variant.match))) return { status: 'unknown' };
  return { status: 'wrong', short: variant?.short ?? variant?.explain.reason, explain: explainOf(variant, value) };
}

/** Tiles in the order the learner tapped them, as one sentence (“My name is Leyla .” → “My name is Leyla.”). */
export function joinTiles(tiles: string[]) {
  return tiles.join(' ').replace(/\s+([.,!?])/g, '$1').trim();
}

export function gradeMatch(task: MatchTask, pairs: Record<string, string>): Graded {
  if (task.rows.some(r => !pairs[r.en])) return { status: 'empty' };
  const rows = Object.fromEntries(task.rows.map(r => [r.en, pairs[r.en] === r.az ? 'correct' as const : 'wrong' as const]));
  if (Object.values(rows).every(v => v === 'correct')) return { status: 'correct', rows };
  const wrong = task.rows.find(r => rows[r.en] === 'wrong')!;
  const variant = task.variants.find(v => 'option' in v.match && v.match.option === wrong.en) ?? task.variants.find(v => 'other' in v.match);
  const yourAnswer = task.rows.filter(r => rows[r.en] === 'wrong').map(r => `${r.en} — ${pairs[r.en]}`).join('; ');
  return { status: 'wrong', rows, short: variant?.short ?? variant?.explain.reason, explain: explainOf(variant, yourAnswer) };
}

export function gradeTwo(task: TwoTask, values: Record<string, string>, keep: Record<string, Graded> = {}): TwoGraded {
  const [first, second] = task.fields;
  const fields: Record<string, Graded> = {};
  for (const field of task.fields) {
    if (keep[field.id]?.status === 'correct') { fields[field.id] = keep[field.id]; continue; }
    const value = values[field.id] ?? '';
    if (!value.trim()) { fields[field.id] = { status: 'empty' }; continue; }
    const verdict = assessPacketAnswer(value, field.rule);
    fields[field.id] = verdict.status === 'correct' ? { status: 'correct', spellingCorrections: verdict.spellingCorrections }
      : verdict.status === 'unknown' ? { status: 'unknown' } : { status: 'wrong' };
  }
  const empty = task.fields.find(f => fields[f.id].status === 'empty');
  if (empty) return { fields, status: 'empty', emptyNotice: empty.empty };
  const swapped = fields[first.id].status === 'wrong' && fields[second.id].status === 'wrong'
    && fulfils(values[first.id], 'farewell') && fulfils(values[second.id], 'greet');
  if (swapped) {
    const variant = task.variants.find(v => 'swapped' in v.match);
    const explain = explainOf(variant, `Əvvəldə “${values[first.id]}”; sonda “${values[second.id]}”`);
    for (const f of task.fields) fields[f.id] = { status: 'wrong', short: variant?.explain.reason, explain };
    return { fields, status: 'wrong', short: variant?.explain.reason, explain };
  }
  for (const field of task.fields) {
    if (fields[field.id].status !== 'wrong') continue;
    const variant = pickVariant(task.variants.filter(v => !('swapped' in v.match)), values[field.id], false, field.id);
    const short = variant?.short && !(field.id === second.id && fields[first.id].status !== 'correct') ? variant.short : variant?.explain.reason.replace('{purpose}', field.purpose);
    fields[field.id] = { status: 'wrong', short, explain: explainOf(variant, values[field.id], field.purpose) };
  }
  const statuses = task.fields.map(f => fields[f.id].status);
  const wrong = task.fields.find(f => fields[f.id].status === 'wrong');
  const status: Verdict = statuses.includes('wrong') ? 'wrong' : statuses.includes('unknown') ? 'unknown' : 'correct';
  return { fields, status, short: wrong ? fields[wrong.id].short : undefined, explain: wrong ? fields[wrong.id].explain : undefined };
}

export type TaskStatus = 'independent' | 'assisted' | 'needsPractice' | 'unverified';
export const statusLabels: Record<TaskStatus, string> = { independent: 'Müstəqil', assisted: 'Köməklə', needsPractice: 'Yenidən məşq lazımdır', unverified: 'Yoxlanmadı' };

export interface TaskRecord {
  first?: 'correct' | 'wrong';
  /** Hint, shown sample or text help before the first answer. */
  assisted?: boolean;
  /** Result of the end-of-lesson retry. */
  review?: 'correct' | 'wrong';
  unverified?: boolean;
  /** Listening was not verified (text help, technical problem or skip). */
  listeningUnverified?: boolean;
  technical?: boolean;
}

export function taskStatus(r: TaskRecord | undefined): TaskStatus {
  if (!r || r.unverified && !r.first) return 'unverified';
  if (r.first === 'correct') return r.assisted ? 'assisted' : 'independent';
  if (r.first === 'wrong') return r.review === 'correct' ? 'assisted' : 'needsPractice';
  return 'unverified';
}
