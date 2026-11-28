// Prints every task of the lessons whose id contains the given text (e.g. _b3_) on one line: situation, audio,
// chat, gap, answers, picture and hint — for the human part of the logic review (docs/MENTIQ_YOXLAMASI.md).
// Usage: node scripts/dump-tasks.cjs _b3_ > /tmp/b3.txt
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: 1, target: 9, esModuleInterop: true, resolveJsonModule: true } }).outputText, f);
const { designLessons } = require('../src/data/designLessons.ts');
const pick = process.argv[2];
const out = [];
const sh = s => (s || '').replace(/\s+/g, ' ').trim();
for (const l of designLessons) {
  if (!l.id.includes(pick)) continue;
  out.push(`## ${l.id}`);
  for (const c of l.cards || []) {
    if (!c || ['intro','teach','explain','word'].includes(c.type)) continue;
    const row = (t, tag) => {
      const ans = t.type === 'choice' ? `opts:[${t.options.join(' / ')}] ✓${t.answer}` : t.rule ? `✓[${(t.rule.answers||[]).slice(0,4).join(' / ')}]` : t.fields ? `fields:${t.fields.map(f=>(f.rule?.answers||[])[0]).join(';')}` : t.answers ? JSON.stringify(t.answers).slice(0,80) : '';
      return `${c.id}${tag} ${t.type}${t.repeat?'(rep)':''} | ${sh(t.prompt||t.title)}${t.context?' / '+sh(t.context):''}${t.audio?` | 🔊${sh(t.audio)}`:''}${t.chat?` | 💬${t.chat.partner}: ${t.chat.lines.map(x=>x.text).join(' | ')}`:''}${t.gap?` | gap:${sh(t.gap.before)}__${sh(t.gap.after)}`:''} | ${ans}${t.scenes?` | 🖼${t.scenes.join(',')}`:''}${t.hint?` | 💡${sh(t.hint)}`:''}`;
    };
    out.push(row(c, ''));
    if (c.review) out.push(row({ ...c, ...c.review }, 'R'));
  }
}
console.log(out.join('\n'));
