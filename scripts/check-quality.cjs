// Quality checks over every lesson task (user, 25 Nov 2026). Rules Q1–Q6, explained in docs/MENTIQ_YOXLAMASI.md:
//  Q1 a correct answer written another normal way (lower case, no full stop, I'm ↔ I am …) must still be correct
//  Q2 a “wrong” option of a choice task must not be just as correct (Hi / Hello, Bye / Goodbye …)
//  Q3 a hint must not give the answer away
//  Q4 what the audio says must match the correct option (numbers, letters, codes) — and only that option
//  Q5 every lesson picture is listed in docs/SEKIL_SIYAHISI.md (and listed pictures are still used or marked “lazım deyil”)
//  Q6 screens use the shared parts (rules G6/G7): one sound button, orange forward buttons, one screen-type chip
// Every hit is read by a person; the word lists are a filter, not a verdict.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true, jsx: ts.JsxEmit.ReactJSX },
}).outputText, filename);
const { designLessons } = require('../src/data/designLessons.ts');
const { gradeText, gradeTwo } = require('../src/utils/designLesson.ts');

const root = path.join(__dirname, '..');
const hits = { Q1: [], Q2: [], Q3: [], Q4: [], Q5: [], Q6: [] };
// How much each check actually looked at (so “0 problems” is not “0 checked”).
const seen = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
const tasks = [];
for (const lesson of designLessons) for (const card of lesson.cards || []) {
  if (!card || ['intro', 'teach', 'explain', 'word'].includes(card.type)) continue;
  tasks.push({ lesson, task: card, id: `${lesson.id.replace('a1_en_', '')} · ${card.id}` });
  if (card.review) tasks.push({ lesson, task: { ...card, ...card.review }, id: `${lesson.id.replace('a1_en_', '')} · ${card.id} (təkrar)` });
}

// ── Q1: other normal ways of writing a correct answer ──
const fill = a => a.replace(/\[ad\]/g, 'Ali').replace(/\[soyad\]/g, 'Aliyev').replace(/\{[A-Za-z:]+\}/g, 'Ali');
const SWAPS = [[/\bI'm\b/g, 'I am'], [/\bI am\b/g, "I'm"], [/\bWhat's\b/g, 'What is'], [/\bwhat's\b/g, 'what is'], [/\bIt's\b/g, 'It is'],
  [/\bit's\b/g, 'it is'], [/\bthat's\b/g, 'that is'], [/\bYou're\b/g, 'You are'], [/\bHe's\b/g, 'He is'], [/\bShe's\b/g, 'She is'], [/'/g, '’']];
const waysOf = answer => {
  // An e-mail keeps its dot; everything else may lose its punctuation.
  const out = new Set([answer.toLowerCase(), answer.replace(/[.!?]+$/, ''), /@/.test(answer) ? answer : answer.replace(/[.,!?]/g, ''), ` ${answer}  `]);
  for (const [from, to] of SWAPS) if (from.test(answer)) out.add(answer.replace(from, to));
  return [...out].filter(v => v.trim() && v !== answer);
};
for (const { task, id } of tasks) {
  const rules = [];
  if ((task.type === 'write' || task.type === 'voice') && task.rule && !task.tiles && !task.letters && !task.keypad) rules.push({ rule: task.rule, voice: task.type === 'voice', grade: v => gradeText(task, v, task.type === 'voice') });
  if (task.type === 'two' && task.fields) for (const f of task.fields) if (f.rule) rules.push({ rule: f.rule, grade: v => gradeTwo(task, { ...Object.fromEntries(task.fields.map(x => [x.id, fill((x.rule.answers || [''])[0])])), [f.id]: v }).fields?.[f.id] ?? { status: 'unknown' } });
  for (const { rule, grade } of rules) {
    for (const answer of (rule.answers || []).map(fill)) {
      let base;
      try { base = grade(answer); } catch (e) { continue; }
      if (base.status !== 'correct' && !(rule.pattern && base.status === 'unknown')) { hits.Q1.push(`${id}: nümunə cavabın özü düz sayılmır — “${answer}” → ${base.status}`); continue; }
      if (rule.pattern) continue; // learner's own data: only the model itself is checked against its pattern
      for (const v of waysOf(answer)) {
        seen.Q1++;
        const g = grade(v);
        if (g.status !== 'correct' && g.status !== 'unknown') hits.Q1.push(`${id}: “${v.trim()}” səhv sayılır (düz: “${answer}”)`);
      }
    }
  }
}

// ── Q2: a “wrong” option that is just as correct ──
const SAME = [['hi', 'hello', 'hey'], ['bye', 'goodbye', 'see you'], ['thanks', 'thank you'], ['fine', 'good', 'great', 'ok', 'okay'], ['sorry', "i'm sorry"]];
const core = s => s.toLowerCase().replace(/[’']/g, "'").replace(/[.!?,]/g, '').trim();
for (const { task, id } of tasks) {
  if (task.type !== 'choice' || !task.options) continue;
  const right = core(task.answer);
  seen.Q2++;
  for (const o of task.options) {
    if (o === task.answer) continue;
    const group = SAME.find(g => g.includes(right) && g.includes(core(o)));
    if (group) hits.Q2.push(`${id}: “${o}” də “${task.answer}” kimi düz ola bilər — ${(task.prompt || '').replace(/\s+/g, ' ').slice(0, 90)}`);
  }
}

// ── Q3: hint gives the answer away ──
const norm = s => (s || '').toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();
for (const { task, id } of tasks) {
  if (!task.hint) continue;
  const hint = ` ${norm(task.hint)} `;
  seen.Q3++;
  const answers = task.type === 'choice' ? [task.answer] : (task.rule && !task.rule.pattern ? task.rule.answers || [] : []);
  for (const a of answers) {
    const n = norm(a);
    // a single short word may appear in a hint for another reason; whole phrases (2+ words) or long words may not
    if (n && (n.split(' ').length >= 2 || n.length >= 6) && hint.includes(` ${n} `)) hits.Q3.push(`${id}: ipucu cavabı deyir — “${task.hint}” ⊃ “${a}”`);
  }
}

// ── Q4: audio ↔ correct option ──
const NUM = { zero: '0', oh: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15', sixteen: '16', seventeen: '17', eighteen: '18', nineteen: '19', twenty: '20', thirty: '30', forty: '40', fifty: '50', sixty: '60', seventy: '70', eighty: '80', ninety: '90' };
const audioKey = audio => {
  const words = audio.replace(/-/g, ' ').replace(/[.,!?…]/g, ' ').split(/\s+/).filter(Boolean);
  let out = '';
  for (let i = 0; i < words.length; i++) {
    const w = words[i], lw = w.toLowerCase();
    if (lw === 'double' && words[i + 1]) { const n = NUM[words[i + 1].toLowerCase()] ?? words[i + 1].toUpperCase(); out += n + n; i++; continue; }
    // sixty-five → 65 (tens + unit)
    if (/^[2-9]0$/.test(NUM[lw] || '') && words[i + 1] && /^[1-9]$/.test(NUM[words[i + 1].toLowerCase()] || '')) { out += NUM[lw][0] + NUM[words[i + 1].toLowerCase()]; i++; continue; }
    if (NUM[lw] !== undefined) { out += NUM[lw]; continue; }
    if (/^[A-Z]$/.test(w)) out += w;
  }
  return out;
};
// Only whole words made of capitals/digits count (“GYD — Bakı” → GYD, “17-ci dolab” → 17).
const optionKey = o => o.split(/[\s—–,]+/).map(w => w.replace(/[-.!?:]+(ci|cı|cu|cü|nci|ncı|ncu|ncü)?$|^[(\[]|[)\]]$/g, '')).filter(w => /^[A-Z0-9]+$/.test(w) && (/\d/.test(w) || w.length <= 4)).join('');
for (const { task, id } of tasks) {
  if (!task.audio) continue;
  const heard = audioKey(task.audio);
  if (!heard) continue;
  seen.Q4++;
  if (task.type === 'choice' && task.options) {
    const keys = task.options.map(o => [o, optionKey(o)]).filter(([, k]) => k);
    if (keys.length < 2) continue;
    const right = optionKey(task.answer);
    if (right && !heard.includes(right)) hits.Q4.push(`${id}: səsdə “${task.audio}”, düz variant “${task.answer}” səsə uyğun deyil`);
    for (const [o, k] of keys) if (o !== task.answer && k === heard) hits.Q4.push(`${id}: səhv variant “${o}” də səsə tam uyğundur`);
  }
  if (task.type === 'write' && task.rule && task.rule.answers && /\d/.test(task.rule.answers[0]) && !task.rule.pattern) {
    const digits = s => (s.match(/\d/g) || []).join('');
    if (digits(task.rule.answers[0]) !== digits(heard)) hits.Q4.push(`${id}: səsdə “${task.audio}” (${digits(heard)}), cavab “${task.rule.answers[0]}”`);
  }
}

// ── Q5: pictures ──
const list = fs.readFileSync(path.join(root, 'docs/SEKIL_SIYAHISI.md'), 'utf8');
const used = new Set();
for (const { task, id } of tasks) for (const s of task.scenes || []) {
  used.add(s);
  if (!list.includes(s)) hits.Q5.push(`${id}: şəkil “${s}” SEKIL_SIYAHISI.md-də yoxdur`);
}
for (const line of list.split('\n')) {
  // ids appear as `d1/x`, as a bare “| u3/x |” cell, or inside an assets path
  const m = line.match(/(?:^|[\s|`/])((?:d\d|u\d)\/[a-z0-9-]+)(?=[\s|`.]|$)/);
  if (m && !used.has(m[1]) && !/lazım deyil|istifadə olunmur/.test(line) && !designLessons.some(l => JSON.stringify(l).includes(`"${m[1]}"`))) hits.Q5.push(`siyahıda “${m[1]}” var, heç bir dərsdə işlənmir və “lazım deyil” qeyd olunmayıb`);
}

// ── Q6: shared parts on the screens ──
const designDir = path.join(root, 'src/components/design');
for (const file of fs.readdirSync(designDir).filter(f => f.endsWith('.tsx'))) {
  const src = fs.readFileSync(path.join(designDir, file), 'utf8');
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    const at = `${file}:${i + 1}`;
    if (/name="speaker"/.test(line)) hits.Q6.push(`${at}: dinamik ikonu — dinləmə ikonu ▶ olmalıdır (G6)`);
    // allowed: SoundIcon itself and the voice-message player (same ▶, same purple round: s.play)
    if (/name="play"/.test(line) && !/return <Icon name="play"/.test(line) && !/s\.play\b/.test(lines[i - 1] || '')) hits.Q6.push(`${at}: ▶ ortaq SoundButton/SoundIcon-dan kənar çəkilib (G6/G7)`);
    if (/tone="green"|tone='green'|tone: 'green'/.test(line) && file !== 'LessonSheets.tsx') hits.Q6.push(`${at}: yaşıl düymə — irəli düymələri narıncıdır, yaşıl yalnız cavabdan sonradır (G6)`);
    if (/lessonLabel\(lesson\)[^;]*toUpperCase/.test(line)) hits.Q6.push(`${at}: dərs adı əl ilə yazılıb — KindChip işlət (G7)`);
  });
}

console.log(`yoxlanıb: Q1 ${seen.Q1} cavab yazılışı, Q2 ${seen.Q2} seçim tapşırığı, Q3 ${seen.Q3} ipucu, Q4 ${seen.Q4} səsli rəqəm/hərf tapşırığı`);
const total = Object.values(hits).reduce((n, a) => n + a.length, 0);
const names = { Q1: 'düz cavabın başqa normal yazılışı səhv sayılır', Q2: 'səhv variant da düz ola bilər', Q3: 'ipucu cavabı deyir', Q4: 'səs ilə düz variant uyğun deyil', Q5: 'şəkil siyahısı', Q6: 'ortaq ekran hissələri (G6/G7)' };
for (const [q, list] of Object.entries(hits)) console.log(`${q} ${names[q]}: ${list.length}${list.length ? '\n  - ' + list.join('\n  - ') : ''}`);
if (total) { console.log(`check-quality: ${total} yer yoxlanmalıdır.`); process.exit(1); }
console.log('check-quality: Q1–Q6 passed.');
