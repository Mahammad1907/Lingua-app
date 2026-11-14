// Also: every accepted answer (not only the first) counts as shown to the learner (review, 14 Nov 2026).
// Rule (user, 13 Nov 2026): no task may show or ask for an English word that was not taught before it.
// "Taught" = the word appears on an earlier Yeni söz / Öyrən card of this lesson (word, example, structure)
// or in any earlier lesson. Notes do not count: a word mentioned only in a note is not taught.
// Retry versions run after the whole lesson, so they may use anything taught in the lesson.
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);

const L = require('../src/utils/designLesson.ts');
const { designLessons } = require('../src/data/designLessons.ts');

// Words that are not vocabulary: placeholders and the learner's own name slot.
const FREE = new Set(['…', 'sonda', 'ex', 'cuse']); // Azerbaijani words inside explanations, stress marks like ex-CUSE
const { GLOSSARY } = require('../src/data/unit1/glossary.ts');
// A contraction teaches its parts too: I'm = I + am, what's = what + is.
const PARTS = { "'m": ['am'], "'s": ['is'], "'re": ['are'], "n't": ['not'] };
const words = text => {
  const out = [];
  for (const w of (text || '').replace(/[’‘]/g, "'").toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || []) {
    if (w.length > 14) continue; // deliberately run-together “fast speech” lines, not vocabulary
    out.push(w);
    for (const [end, extra] of Object.entries(PARTS)) if (w.endsWith(end)) { out.push(w.slice(0, -end.length).replace(/^do$/, 'do'), ...extra); }
  }
  return out;
};
const GLOSS = new Set(Object.keys(GLOSSARY).flatMap(k => words(k)));
// English text = it has letters and at least one word from the English glossary (Azerbaijani options are skipped).
const english = text => /[a-z]/i.test(text || '') && !/[əğıöüşçƏĞİÖÜŞÇ]/.test(text) && words(text).some(w => GLOSS.has(w));

function teaches(card) {
  if (card.type === 'word') return [card.word, card.example, ...(card.structure || [])];
  if (card.type === 'teach') return [...card.phrases.map(p => p.en), ...(card.structure || []), card.example?.en];
  return [];
}
function asks(t) {
  const out = [];
  const add = (label, text) => { if (text && english(text)) out.push([label, text]); };
  if (t.audio) add('audio', t.audio);
  if (t.type === 'choice') { t.options.forEach(o => add('option', o)); if (t.gap) { add('gap', t.gap.before); add('gap', t.gap.after); } }
  if (t.type === 'write') { t.rule.answers.forEach(a => add('qəbul', a)); t.chat?.lines.forEach(l => add('chat', l.text)); t.tiles?.forEach(x => add('tile', x)); }
  if (t.type === 'two' && t.form) { add('form', t.form.title); add('form', t.form.subtitle); t.fields.forEach(f => add('form', f.label)); }
  if (t.type === 'two') t.fields.forEach(f => f.rule.answers.forEach(a => add('qəbul', a)));
  if (t.type === 'voice') { add('sample', t.sample); t.rule.answers.forEach(a => add('qəbul', a)); add('reply', t.reply); }
  if (t.type === 'match') {
    if (t.mode !== 'order') t.rows.forEach(r => add('row', r.en));
    if (t.mode === 'reply' || t.mode === 'order') { t.rows.forEach(r => add(t.mode === 'order' ? 'turn' : 'reply', r.az)); t.extra.forEach(x => add('extra', x)); }
  }
  // Explanations, examples and hints may not show untaught English either (reviewer rule, 14 Nov 2026).
  for (const v of t.variants || []) for (const x of [v.explain?.answers, v.explain?.rule, v.explain?.example]) if (x) x.split(/[;/—→·]|\s-\s/).forEach(part => add('izah', part));
  for (const m of (t.hint || '').matchAll(/“([^”]+)”/g)) add('ipucu', m[1]);
  // Quoted English inside the task text (e.g. Qız deyir: “Hi!”).
  for (const m of (t.prompt || '').matchAll(/“([^”]+)”/g)) add('prompt', m[1]);
  return out;
}

const names = new Set();
const known = new Set();
const problems = [];
for (const raw of designLessons) {
  const lesson = L.resolveLesson(raw);
  // Names used in the lesson are not vocabulary.
  for (const m of JSON.stringify(lesson).matchAll(/\b([A-Z][a-z]{2,})\b/g)) if (!['Hello', 'Hi', 'Bye', 'Goodbye', 'Nice', 'What', 'How', 'And', 'Yes', 'No', 'You', 'See', 'Good', 'Thanks', 'Thank', 'Excuse', 'Sorry', 'Fine', 'Where', 'This', 'My', 'Are', 'Is', 'Not', 'Me', 'Please', 'Welcome'].includes(m[1])) names.add(m[1].toLowerCase());
  const here = new Set(known);
  const check = (card, t, label) => {
    for (const [where, text] of asks(t)) {
      const missing = [...new Set(words(text).filter(w => !here.has(w) && !names.has(w) && !FREE.has(w)))];
      if (missing.length) problems.push(`Dərs ${lesson.order} ${card.id}${label} ${where}: “${text}” — öyrədilməyib: ${missing.join(', ')}`);
    }
  };
  for (const card of lesson.cards) {
    teaches(card).forEach(text => words(text).forEach(w => here.add(w)));
    if (L.isTask(card)) check(card, card, '');
  }
  for (const card of lesson.cards) if (L.isTask(card) && card.review) check(card, L.reviewTask(lesson, card.id), ' (təkrar)');
  here.forEach(w => known.add(w));
}

// Variety (user, 13 Nov 2026): no template. The same screen type never comes twice in a row
// (except the turns of one conversation, e.g. c11a + c11b), and no two lessons share the same last three screens.
const kind = c => !L.isTask(c) ? c.type : c.type === 'two' && c.form ? 'form' : c.type === 'write' ? (c.keypad ? 'keypad' : c.letters ? 'letters' : c.tiles ? 'tiles' : c.chat ? 'chat' : 'write') : c.type === 'choice' ? (c.gap ? 'gap' : c.spots ? 'scene' : 'choice') : c.type === 'voice' ? (c.repeat ? 'repeat' : 'voice') : c.type === 'match' ? (c.mode === 'order' ? 'order' : c.mode === 'reply' ? 'pairs' : 'match') : c.type;
const endings = new Map();
for (const raw of designLessons) {
  const cards = raw.cards;
  for (let i = 1; i < cards.length; i++) {
    const a = cards[i - 1], b = cards[i];
    const sameTalk = a.id.replace(/[ab]$/, '') === b.id.replace(/[ab]$/, '');
    if (kind(a) === kind(b) && !sameTalk) problems.push(`Dərs ${raw.order}: ${a.id} və ${b.id} eyni ekran növüdür (${kind(a)}) və dalbadal gəlir`);
  }
  const end = cards.slice(-3).map(kind).join(' ');
  if (endings.has(end)) problems.push(`Dərs ${raw.order} və Dərs ${endings.get(end)} eyni üç ekranla bitir: ${end}`);
  endings.set(end, raw.order);
}

// Explanation wording (docs/IZAH_STANDARTI.md): no empty templates, no system sentences, no rules that the next lesson makes false.
const BANNED = [/\{purpose\}/, /müəyyən edilmədi/, /həmişə/, /başqa şəxs/, /\binkar/, /\bfel(?:i|lər|də|dən)?\b/i, /not = deyil/];
for (const raw of designLessons) {
  const lesson = L.resolveLesson(raw);
  const texts = [];
  const pushTask = t => { texts.push(t.hint, t.why, ...(t.variants || []).flatMap(v => [v.short, v.explain?.answers, v.explain?.reason, v.explain?.rule, v.explain?.example])); };
  for (const c of lesson.cards) {
    if (c.type === 'word' || c.type === 'teach') texts.push(...(c.notes || []));
    if (L.isTask(c)) { pushTask(c); pushTask(L.reviewTask(lesson, c.id)); }
  }
  for (const t of texts.filter(Boolean)) for (const b of BANNED) if (b.test(t)) problems.push(`Dərs ${raw.order} izah/ipucu qadağan ifadə (${b}): “${t}”`);
}

// Rule (review 2, 14 Nov 2026): a phrase with its own Yeni söz card is not shown anywhere earlier in the lesson —
// not in options, audio, examples, explanations, hints, nor in an earlier word card's example.
// Whole-phrase match, case-insensitive, punctuation ignored. Retries run after the lesson, so `review` is skipped;
// the intro's goal list is a can-do statement, not a task, and is skipped too. Earlier lessons do not count.
const norm = s => ' ' + (s || '').replace(/[’‘]/g, "'").toLowerCase().replace(/[^a-z']+/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
const SKIP_KEYS = new Set(['review', 'id', 'scenes', 'pronunciation', 'reading', 'icon', 'speaker', 'from']);
const strings = (value, out = []) => {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach(v => strings(v, out));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) if (!SKIP_KEYS.has(k)) strings(v, out);
  return out;
};
for (const raw of designLessons) {
  const lesson = L.resolveLesson(raw);
  lesson.cards.forEach((card, i) => {
    if (card.type !== 'word') return;
    for (const phrase of card.word.split(' · ')) {
      const p = norm(phrase);
      if (!p.trim()) continue;
      for (const before of lesson.cards.slice(0, i)) {
        if (before.type === 'intro') continue;
        for (const text of strings(before)) if (norm(text).includes(p)) problems.push(`Dərs ${lesson.order}: “${phrase}” öz kartından (${card.id}) əvvəl ${before.id}-də görünür: “${text}”`);
      }
    }
  });
}

// Rule (review 2, 14 Nov 2026): Qayda is a pair of forms, not a dictionary translation or a generic line; no IPA for the learner.
const DICT = /^\s*[A-Za-z’' ]+\s*=\s*[^;]+$/;
const GENERIC = ['Mənaya görə qoş.', 'Deyilənə uyğun cavab.', 'Təşəkkür, cavab, xahiş.'];
const IPA = /\/[^/\n]*[ɪæθʊʌɑʃŋˈ][^/\n]*\/|\/[^/\nğıöüşçĞİÖÜŞÇ ]*ə[^/\nğıöüşçĞİÖÜŞÇ ]*\//;
for (const raw of designLessons) {
  const lesson = L.resolveLesson(raw);
  const tasks = lesson.cards.filter(L.isTask).flatMap(c => [[c.id, c], [`${c.id} (təkrar)`, L.reviewTask(lesson, c.id)]]);
  for (const [id, t] of tasks) {
    for (const v of t.variants || []) {
      const e = v.explain || {};
      if (e.rule && DICT.test(e.rule)) problems.push(`Dərs ${lesson.order} ${id}: qayda lüğət tərcüməsidir: “${e.rule}”`);
      if (e.rule && GENERIC.includes(e.rule.trim())) problems.push(`Dərs ${lesson.order} ${id}: qayda ümumi cümlədir: “${e.rule}”`);
      for (const x of [e.rule, e.reason, e.example]) if (x && IPA.test(x)) problems.push(`Dərs ${lesson.order} ${id}: izahda IPA: “${x}”`);
    }
    for (const x of [t.hint, t.repeat?.note]) if (x && IPA.test(x)) problems.push(`Dərs ${lesson.order} ${id}: ipucu/qeyddə IPA: “${x}”`);
  }
}

if (problems.length) {
  console.error(`${problems.length} problem:\n` + problems.join('\n'));
  process.exit(1);
}
console.log('check-taught: every task uses only words taught before it; no screen type twice in a row; lesson endings differ.');
