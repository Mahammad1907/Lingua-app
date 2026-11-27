// Pure lesson logic for the redesigned lesson screens (no React, so it can be tested in Node).
import type { DesignLesson, DesignTask, DragTask, ExplainCard, Explanation, IntroCard, MatchTask, ProfileTask, ReviewOf, TeachCard, TwoTask, Variant, WordCard } from '../data/designLessonTypes';
import { resolveNames } from '../config/characters';
import { assessPacketAnswer, normalizePacketAnswer, type PacketVerdict } from './packetAnswer';

export type FlowCard = IntroCard | TeachCard | WordCard | ExplainCard | DesignTask;
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
  /** “Söz sürüklə” / “Profil kartı”: a short reason under each wrong slot or row. */
  notes?: Record<string, string>;
}

export interface TwoGraded { fields: Record<string, Graded>; status: Verdict; short?: string; explain?: Graded['explain']; emptyNotice?: string }

export function resolveLesson(lesson: DesignLesson): DesignLesson { return resolveNames(lesson); }

export const TASK_TYPES = new Set(['choice', 'write', 'two', 'voice', 'match', 'drag', 'profile']);

export function isTask(card: FlowCard | undefined): card is DesignTask {
  return Boolean(card && TASK_TYPES.has(card.type));
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
  const card = [...lesson.cards, ...(lesson.pool ?? [])].find(c => c.id === id) as (DesignTask & { review?: ReviewOf<DesignTask> }) | undefined;
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

/** Typical slips that are wrong in ANY task (15 Nov 2026): when the task has no specific variant for them,
 *  the explanation names the slip itself instead of a general “other” text. Only taught English is quoted. */
const COMMON_SLIPS: Variant[] = [
  { match: { pattern: String.raw`\bwhat'?s\s+is\b` }, short: 'What’s = What is — is ikinci dəfə yazılmır.',
    explain: { answers: "What's your name?", reason: 'What’s artıq “What is” deməkdir; sonra yenə is yazanda söz iki dəfə olur.', rule: 'What’s your name? — düzdür; What’s is your name? — olmur.', example: "What's your name?" } },
  { match: { pattern: String.raw`^\s*it'?s\s+that'?s?\s+right\b|^\s*its\s+thats?\s+right\b` }, short: 'Soruşanda Is ilə başla: Is that right?',
    explain: { answers: 'Is that right?', reason: 'Düz olduğunu soruşursan — sual Is ilə başlayır, It’s ilə yox.', rule: 'Is that right? — sualdır; It’s [ad] — cavabdır.', example: "Oh five five… Is that right?" } },
];
const commonSlip = (value: string) => COMMON_SLIPS.find(v => 'pattern' in v.match && new RegExp(v.match.pattern, 'iu').test(value.trim()));
/** A common slip names the slip, but the right answer always comes from THIS task (27 Nov 2026: a name question
 *  showed “What's your phone number?” as the answer). The slip's own answer is used only when the task has none. */
const slipExplain = (slip: Variant, own: Variant | undefined, value: string, purpose?: string): Graded['explain'] => {
  const mine = explainOf(own, value, purpose);
  return mine ? { ...mine, reason: slip.explain.reason, rule: slip.explain.rule } : explainOf(slip, value);
};

const explainOf = (variant: Variant | undefined, yourAnswer: string, purpose?: string): Graded['explain'] =>
  variant ? { ...variant.explain, reason: variant.explain.reason.replace('{purpose}', purpose ?? ''), yourAnswer } : undefined;

/** Learner's own data (e-mail) written almost right: show THEIR address corrected and name the exact slip,
 *  never someone else's model address (15 Nov 2026). Returns undefined when no safe single fix exists. */
const DOMAINS = /(gmail|mail|yahoo|outlook|hotmail|icloud|box|list|inbox|yandex)(\.|\s+dot\s+)/i;
export function ownDataFix(value: string, rule: { pattern?: string }): { fixed: string; reason: string } | undefined {
  if (!rule.pattern) return undefined;
  const raw = value.trim();
  const ok = (v: string) => new RegExp(rule.pattern!, 'iu').test(v);
  const tries: [string, string][] = [];
  if (/\s+(at|et)\s+/i.test(raw)) tries.push([raw.replace(/\s+(at|et)\s+/i, '@').replace(/\s+dot\s+/gi, '.'), 'Ünvanda “at” sözü yox, @ işarəsi yazılır.']);
  if (/\s+dot\s+/i.test(raw)) tries.push([raw.replace(/\s+dot\s+/gi, '.'), 'Ünvanda “dot” sözü yox, nöqtə (.) yazılır.']);
  if (!raw.includes('@') && DOMAINS.test(raw)) tries.push([raw.replace(DOMAINS, (m) => `@${m}`).replace(/@\s+/, '@').replace(/\s+@/, '@'), '@ işarəsi çatışmır: addan sonra @, sonra poçt xidmətinin adı.']);
  if (raw.includes('@') && /@[a-z0-9-]+\s*com$/i.test(raw)) tries.push([raw.replace(/\s*com$/i, '.com'), 'Sonda nöqtə çatışmır: .com']);
  for (const [fixed, reason] of tries) if (fixed !== raw && ok(fixed)) return { fixed, reason };
  return undefined;
}
const withOwnFix = (graded: Graded, value: string, rule: { pattern?: string }): Graded => {
  const fix = ownDataFix(value, rule);
  if (!fix || graded.status !== 'wrong') return graded;
  return { ...graded, short: fix.reason, explain: { answers: fix.fixed, reason: fix.reason, rule: '', example: '', ...(graded.explain ? { rule: graded.explain.rule, example: graded.explain.example } : {}), yourAnswer: value } as Graded['explain'] };
};

export function gradeChoice(task: Pick<Extract<DesignTask, { type: 'choice' }>, 'answer' | 'variants'>, option: string): Graded {
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
  const slip = (!variant || 'other' in variant.match) ? commonSlip(value) : undefined;
  const used = slip ?? variant;
  return withOwnFix({ status: 'wrong', short: used?.short ?? used?.explain.reason, explain: slip ? slipExplain(slip, variant, value) : explainOf(variant, value) }, value, task.rule);
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

/** “Ailə ağacı”: the same as a choice. */

/** Wrong slots/rows: the first one's variant (its `field`, then the chosen value, then `other`) explains the card. */
function gradeSlots(variants: Variant[], slots: { id: string; label: string; value: string; ok: boolean }[]): Graded {
  const rows = Object.fromEntries(slots.map(x => [x.id, x.ok ? 'correct' as const : 'wrong' as const]));
  const wrong = slots.filter(x => !x.ok);
  if (!wrong.length) return { status: 'correct', rows };
  const pick = (w: typeof slots[number]) => {
    const fits = (v: Variant) => !v.field || v.field === w.id;
    return variants.find(v => fits(v) && 'option' in v.match && normalizePacketAnswer(v.match.option) === normalizePacketAnswer(w.value))
      ?? variants.find(v => fits(v) && 'other' in v.match);
  };
  const notes = Object.fromEntries(wrong.map(w => { const v = pick(w); return [w.id, v?.short ?? v?.explain.reason ?? '']; }));
  const variant = pick(wrong[0]);
  const yourAnswer = wrong.map(x => `${x.label} — ${x.value}`).join('; ');
  return { status: 'wrong', rows, notes, short: variant?.short ?? variant?.explain.reason, explain: explainOf(variant, yourAnswer) };
}

/** “Söz sürüklə”: placed = person id → chip. Every slot right = correct. */
export function gradeDrag(task: DragTask, placed: Record<string, string>): Graded {
  if (task.people.some(p => !placed[p.id])) return { status: 'empty' };
  return gradeSlots(task.variants, task.people.map((p, i) => ({ id: p.id, label: p.label || `${i + 1}`, value: placed[p.id], ok: placed[p.id] === task.answers[p.id] })));
}

/** “Profil kartı”: values = row id → chip or digits. Number rows compare digits; chip rows compare the chip. */
export function gradeProfile(task: ProfileTask, values: Record<string, string>): Graded {
  if (task.rows.some(r => !(values[r.id] ?? '').trim())) return { status: 'empty' };
  const same = (r: ProfileTask['rows'][number], v: string) => r.number ? v.replace(/\D/g, '') === r.answer.replace(/\D/g, '') : v === r.answer;
  return gradeSlots(task.variants, task.rows.map(r => ({ id: r.id, label: r.label, value: values[r.id], ok: same(r, values[r.id]) })));
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
    const slip = (!variant || 'other' in variant.match) ? commonSlip(values[field.id]) : undefined;
    fields[field.id] = withOwnFix(slip ? { status: 'wrong', short: slip.short, explain: slipExplain(slip, variant, values[field.id], field.purpose) }
      : { status: 'wrong', short, explain: explainOf(variant, values[field.id], field.purpose) }, values[field.id], field.rule);
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
