// “Qaydalar” tab (user, 21 Nov 2026). Every Müəllim izahı card in the lessons is a rule here, automatically:
// a new explain card only needs a line in RULE_META (scripts/check-rules.cjs fails without it).
// The tasks after an explain card (up to the next one) practise that rule; their mistakes weaken it.
import { designLessons } from './designLessons';
import type { DesignLesson, ExplainCard } from './designLessonTypes';

export type RuleTopic = 'polite' | 'order' | 'questions' | 'short' | 'sound' | 'numbers' | 'letters' | 'country';
export const RULE_TOPICS: { id: RuleTopic; title: string; icon: string; tint: string; ink: string; bar: string }[] = [
  { id: 'questions', title: 'Sual qurmaq', icon: '?', tint: '#E6DAFB', ink: '#5B1FD1', bar: '#5B1FD1' },
  { id: 'short', title: 'Qısa formalar', icon: "'", tint: '#FFE3C7', ink: '#A84A08', bar: '#F27A12' },
  { id: 'order', title: 'Sözlərin sırası', icon: '↔', tint: '#D4F2F1', ink: '#0B6E70', bar: '#14A3A3' },
  { id: 'polite', title: 'Nəzakət və ünsiyyət', icon: '♥', tint: '#FBDDE6', ink: '#A12E50', bar: '#E0567A' },
  { id: 'sound', title: 'Tələffüz', icon: '♪', tint: '#DDF2E3', ink: '#0F6E2A', bar: '#3DA35D' },
  { id: 'numbers', title: 'Rəqəmlər', icon: '#', tint: '#E1E4F6', ink: '#38458F', bar: '#5C6BC0' },
  { id: 'letters', title: 'Hərflər və e-poçt', icon: 'A', tint: '#FBEFCF', ink: '#9A6A07', bar: '#E0A21B' },
  { id: 'country', title: 'Ölkə və millət', icon: '⚑', tint: '#DCE8FD', ink: '#1F4FB0', bar: '#3B7DF0' },
];

/** Short name and topic of every explain card. */
export const RULE_META: Record<string, { title: string; eg: string; topic: RuleTopic }> = {
  d1_c02t: { title: 'Salamı necə deyim?', eg: "Hello! · Hi!", topic: 'polite' },
  d2_c02t: { title: 'Özümü necə təqdim edim?', eg: "Hi! I'm [ad].", topic: 'order' },
  d2_c02bt: { title: 'Adımı tam cümlə ilə necə deyim?', eg: "My name is [ad].", topic: 'order' },
  d3_c03t: { title: 'Adını necə soruşum?', eg: "What's your name?", topic: 'questions' },
  d4_c04t: { title: '“Bəs sən?” necə soruşum?', eg: "And you?", topic: 'polite' },
  d5_c05bt: { title: 'Xahişi necə deyim, təşəkkürə necə cavab verim?', eg: "Tea, please. · You're welcome.", topic: 'polite' },
  d6_c04t: { title: '“Bağışlayın”ı nə vaxt necə deyim?', eg: "Excuse me! · Sorry!", topic: 'polite' },
  d7_c03t: { title: 'Başa düşməyəndə nə deyim?', eg: "Sorry? · I don't understand.", topic: 'polite' },
  u2d1a_c04t: { title: '“th” səsini necə deyim?', eg: "three", topic: 'sound' },
  u2d1b_c04t: { title: 'eight və nine necə oxunur?', eg: "eight · nine", topic: 'sound' },
  u2d2_c07t: { title: 'Nömrədə 0-ı necə deyim?', eg: "zero · oh", topic: 'numbers' },
  u2d3a_c03t: { title: 'Hərfləri necə adlandırım?', eg: "A · B · C", topic: 'letters' },
  u2d3a_c09t: { title: 'E ilə I necə fərqlənir?', eg: "E · I", topic: 'letters' },
  u2d3b_c06t: { title: 'G ilə J necə fərqlənir?', eg: "G · J", topic: 'letters' },
  u2d3c_c06t: { title: 'Q ilə R necə fərqlənir?', eg: "Q · R", topic: 'letters' },
  u2d4_c06t: { title: 'Qoşa hərfi necə deyim?', eg: "double L", topic: 'letters' },
  u2d5_c08t: { title: 'Mr. və Ms.-i nə vaxt işlədim?', eg: "Ms. Hasanova", topic: 'polite' },
  u2d6_c08t: { title: '@ və nöqtəni necə deyim?', eg: "at · dot", topic: 'letters' },
  u2d7a_c04t: { title: '11 və 12 necə deyilir?', eg: "eleven · twelve", topic: 'numbers' },
  u2d7a_c06t: { title: '13–19 necə düzəlir?', eg: "thirteen · nineteen", topic: 'numbers' },
  u2d7b_c04t: { title: '14 ilə 40 necə fərqlənir?', eg: "fourteen · forty", topic: 'numbers' },
  u2d7b_c08t: { title: 'Yaşımı necə deyim?', eg: "I'm twenty-five.", topic: 'order' },
  u3d1_c04t: { title: 'Haradan olduğumu necə deyim?', eg: "I'm from Baku.", topic: 'order' },
  u3d2a_c04t: { title: 'Ölkənin adını necə deyim?', eg: "Turkey", topic: 'country' },
  u3d2b_c06t: { title: 'the USA-da “the” nə üçündür?', eg: "the USA", topic: 'country' },
  u3d3a_c02t: { title: 'Ölkə ilə millət necə fərqlənir?', eg: "Turkey · Turkish", topic: 'country' },
  u3d3a_c06t: { title: 'Millətimi necə deyim?', eg: "I'm Turkish.", topic: 'country' },
  u3d3b_c10t: { title: 'Formada “Nationality” nə deməkdir?', eg: "Nationality", topic: 'country' },
  u3d4_c02t: { title: 'Ölkəni necə soruşum?', eg: "Are you from Turkey?", topic: 'questions' },
  u3d4_c06t: { title: 'Bəli/xeyr necə cavab verim?', eg: "Yes, I am. · No, I'm not.", topic: 'questions' },
  u3d5a_c09t: { title: 'Başqası haqqında necə deyim?', eg: "She's from Turkey.", topic: 'short' },
  u3d5b_c05t: { title: 'Başqası haqqında necə soruşum?', eg: "Is she Turkish?", topic: 'questions' },
  u3d5b_c09t: { title: 'Başqasının bəli/xeyrini necə deyim?', eg: "Yes, he is. · No, she isn't.", topic: 'short' },
  u3d6_c02t: { title: 'Harada yaşadığını necə soruşum?', eg: "Where do you live?", topic: 'questions' },
  u3d6_c04t: { title: 'Harada yaşadığımı necə deyim?', eg: "I live in Baku.", topic: 'order' },
  u3d7_c06t: { title: 'Dil sualına necə cavab verim?', eg: "Yes, I do. · No, I don't.", topic: 'short' },
};

export interface Rule {
  id: string; title: string; eg: string; topic: RuleTopic; card: ExplainCard;
  lessonId: string; unit: number; lessonNumber: number; part?: number; lessonTitle: string; section: string;
  /** Task cards that practise the rule (after the explain card, up to the next one). */
  tasks: string[];
}

const TASK_TYPES = new Set(['choice', 'write', 'voice', 'two', 'match']);
export const lessonLabel = (l: Pick<DesignLesson, 'unit' | 'number' | 'order' | 'part'>) =>
  `Bölmə ${l.unit ?? 1} · Dərs ${l.number ?? l.order}${l.part ? ` · ${l.part}-${l.part === 3 ? 'cü' : 'ci'} hissə` : ''}`;

export const RULES: Rule[] = designLessons.filter(l => !l.exam).flatMap(lesson => {
  const out: Rule[] = [];
  lesson.cards.forEach((card, i) => {
    if (card.type !== 'explain') return;
    const meta = RULE_META[card.id] ?? { title: card.lead, eg: '', topic: 'order' as RuleTopic };
    const tasks: string[] = [];
    for (const c of lesson.cards.slice(i + 1)) { if (c.type === 'explain') break; if (TASK_TYPES.has(c.type)) tasks.push(c.id); }
    out.push({ id: card.id, title: meta.title, eg: meta.eg, topic: meta.topic, card, lessonId: lesson.id, unit: lesson.unit ?? 1,
      lessonNumber: lesson.number ?? lesson.order, part: lesson.part, lessonTitle: lesson.title, section: lesson.section, tasks });
  });
  return out;
});

const BY_TASK = new Map<string, string>(RULES.flatMap(r => r.tasks.map(t => [t, r.id] as [string, string])));
export const ruleOfTask = (taskId: string) => { const id = BY_TASK.get(taskId); return id ? RULES.find(r => r.id === id) : undefined; };
export const getRule = (id: string) => RULES.find(r => r.id === id);

/** Text used by the search box: name, topic, teacher's words and English examples. */
export const ruleSearchText = (r: Rule) => [r.title, r.eg, r.card.lead, r.card.attention,
  ...r.card.sections.flatMap(s => [s.title, s.text, ...(s.pairs ?? []).flatMap(p => [p.en, p.az]), s.short?.full, s.short?.short,
    ...(s.build?.examples ?? []).flatMap(e => [e.en, e.az])])].filter(Boolean).join(' ').toLowerCase();

// ── Cədvəllər: built from the lessons' own word cards, so readings stay the same as in the lessons ──
const cardIndex = new Map<string, { lesson: DesignLesson; card: DesignLesson['cards'][number] }>();
for (const lesson of designLessons) for (const card of lesson.cards) cardIndex.set(card.id, { lesson, card });
export const lessonOfCard = (cardId: string) => cardIndex.get(cardId)?.lesson;

export interface TableRow { key: string; big: string; en: string; reading?: string; note?: string; say: string; card: string }
export interface Table { id: string; title: string; sub: string; tint: string; ink: string; groups: { title: string; rows: TableRow[] }[]; foot?: string }

const NUMBERS: Record<string, number> = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
  thirty: 30, forty: 40, fifty: 50, sixty: 60, 'twenty-five': 25 };
const NUMBER_NOTES: Record<string, string> = { zero: 'nömrədə: oh', eight: 'gh oxunmur', eleven: 'öz adı var', twelve: 'öz adı var', thirteen: 'three → thir', fifteen: 'five → fif', forty: 'u yoxdur', 'twenty-five': 'twenty + five' };
function wordRows(ids: string[]): TableRow[] {
  return ids.flatMap(id => {
    const c = cardIndex.get(id)?.card;
    if (!c || c.type !== 'word') return [];
    const words = c.word.split(/\s*·\s*/), reads = (c.reading ?? '').split(/\s*·\s*/);
    return words.map((w, i) => ({ key: `${id}:${w}`, big: String(NUMBERS[w] ?? w), en: w, reading: reads.length === words.length ? reads[i] : undefined, note: NUMBER_NOTES[w], say: w, card: id }));
  });
}
const sortNum = (rows: TableRow[]) => rows.sort((a, b) => Number(a.big) - Number(b.big));

const SHORT_FORMS: TableRow[] = (() => {
  const rows: TableRow[] = []; const seen = new Set<string>();
  const add = (full: string, short: string, card: string) => { if (seen.has(short)) return; seen.add(short); rows.push({ key: short, big: short, en: full, say: `${full}. ${short}`, card }); };
  for (const lesson of designLessons) for (const c of lesson.cards) {
    if (c.type === 'teach' && c.title === 'Qısa forma' && c.phrases.length === 2) add(c.phrases[0].en, c.phrases[1].en, c.id);
    if (c.type === 'word' && c.shortForm) add(c.shortForm.full, c.shortForm.short, c.id);
    if (c.type === 'explain') for (const s of c.sections) if (s.short) add(s.short.full, s.short.short, c.id);
  }
  return rows;
})();

const COUNTRIES: [string, string, string][] = [['Azerbaijan', 'Azerbaijani', 'u3d3a_c02'], ['Turkey', 'Turkish', 'u3d3a_c04'], ['Russia', 'Russian', 'u3d3a_c06'],
  ['Georgia', 'Georgian', 'u3d3a_c08'], ['England', 'English', 'u3d3b_c02'], ['the USA', 'American', 'u3d3b_c04'], ['Germany', 'German', 'u3d3b_c06'], ['France', 'French', 'u3d3b_c08']];
const readingOf = (id: string) => { const c = cardIndex.get(id)?.card; return c && c.type === 'word' ? c.reading : undefined; };

export const TABLES: Table[] = [
  { id: 'numbers', title: 'Rəqəmlər', sub: '0–20 · 30–60 · 25 kimi', tint: '#E6DAFB', ink: '#5B1FD1', foot: '70–100 və daha böyük rəqəmlər sonrakı bölmələrdə açılacaq.',
    groups: [
      { title: '0–10', rows: sortNum(wordRows(['u2d1a_c02', 'u2d1a_c04', 'u2d1a_c06', 'u2d1b_c02', 'u2d1b_c04', 'u2d1b_c06'])) },
      { title: '11–20', rows: sortNum(wordRows(['u2d7a_c02', 'u2d7a_c04', 'u2d7a_c06', 'u2d7a_c08'])) },
      { title: '30–60', rows: sortNum(wordRows(['u2d7b_c04'])) },
      { title: '25 kimi', rows: wordRows(['u2d7b_c06']) },
    ] },
  { id: 'letters', title: 'Əlifba', sub: '26 hərf · adı və oxunuşu', tint: '#FFE3C7', ink: '#A84A08', groups: [] },
  { id: 'short', title: 'Qısa formalar', sub: SHORT_FORMS.slice(0, 4).map(r => r.big).join(' · '), tint: '#DDF2E3', ink: '#0F6E2A',
    groups: [{ title: 'Tam → qısa', rows: SHORT_FORMS }] },
  { id: 'phone', title: 'Nömrə və e-poçt', sub: '0 = oh · @ = at · . = dot', tint: '#DCE8FD', ink: '#1F4FB0',
    groups: [{ title: 'Deyiliş', rows: [
      { key: 'oh', big: '0', en: 'oh', reading: readingOf('u2d2_c07'), note: 'telefon nömrəsində', say: 'oh', card: 'u2d2_c07' },
      { key: 'at', big: '@', en: 'at', reading: readingOf('u2d6_c08'), note: 'e-poçtda', say: 'at', card: 'u2d6_c08' },
      { key: 'dot', big: '.', en: 'dot', reading: readingOf('u2d6_c06'), note: 'e-poçtda', say: 'dot', card: 'u2d6_c06' },
      { key: 'double', big: 'LL', en: 'double L', reading: readingOf('u2d4_c06') ? `${readingOf('u2d4_c06')} el` : undefined, note: 'qoşa hərf', say: 'double L', card: 'u2d4_c06' },
    ] }] },
  { id: 'country', title: 'Ölkə və millət', sub: 'Azerbaijan → Azerbaijani', tint: '#FBDDE6', ink: '#A12E50',
    groups: [{ title: 'Ölkə → millət', rows: COUNTRIES.map(([c, n, id]) => ({ key: n, big: c, en: n, say: `${c}. ${n}.`, card: id })) }] },
];
