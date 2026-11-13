// Writes a readable document for each Bölmə 1 lesson (2–8) from its data, so the text can be reviewed
// without reading code: node scripts/export-unit1-docs.cjs → docs/dersler/Ders_N.md
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const L = require('../src/utils/designLesson.ts');
const { unit1Lessons } = require('../src/data/unit1/index.ts');

const SCREEN = { choice: 'Seç', gap: 'Sözü tamamla', scene: 'Səhnədə tap', write: 'Yaz', chat: 'Dialoqu tamamla', tiles: 'Mesaj yaz (sözlərdən)', voice: 'Səslə cavab', repeat: 'Dinlə və təkrarla', match: 'Kim nə dedi?', two: 'İki mesaj yaz', word: 'Yeni söz', teach: 'Öyrətmə / səhnə', intro: 'Giriş' };
const kind = t => t.type === 'write' ? (t.tiles ? 'tiles' : t.chat ? 'chat' : 'write') : t.type === 'choice' ? (t.gap ? 'gap' : t.spots ? 'scene' : 'choice') : t.type === 'voice' ? (t.repeat ? 'repeat' : 'voice') : t.type;
const rule = r => r.exact ? `dəqiq: ${r.answers.join(' / ')}` : `məna: ${(r.goals || []).join(' + ')} — nümunə: ${r.answers.join(' / ')}`;

function task(t, out) {
  out.push(`**Tapşırıq:** ${t.prompt.replace(/\n/g, ' ')}`);
  if (t.audio) out.push(`**Səs:** ${t.audio}`);
  if (t.chat) out.push(`**Yazışma (${t.chat.partner}):** ${t.chat.lines.map(l => `“${l.text}”`).join(' → ') || '—'}`);
  if (t.gap) out.push(`**Cümlə:** ${t.gap.before} ___ ${t.gap.after}`);
  if (t.type === 'choice') out.push(`**Seçimlər:** ${t.options.join(' / ')} — **düzgün:** ${t.answer}`);
  if (t.tiles) out.push(`**Sözlər:** ${t.tiles.join(' · ')}`);
  if (t.type === 'match') out.push(`**Cütlər:** ${t.rows.map(r => `${r.en} — ${r.az}`).join('; ')} · artıq: ${t.extra.join(', ')}`);
  if (t.type === 'two') for (const f of t.fields) out.push(`**${f.label}:** ${rule(f.rule)}`);
  if (t.rule) out.push(`**Qəbul:** ${rule(t.rule)}`);
  if (t.sample) out.push(`**Nümunə göstərilir:** ${t.sample}`);
  if (t.hint) out.push(`**İpucu:** ${t.hint}`);
  if (t.why) out.push(`**Düzgün olanda:** ${t.why}`);
  for (const v of t.variants) {
    const m = v.match; const when = 'option' in m ? `“${m.option}” seçiləndə` : 'goal' in m ? `cavab “${m.goal}” işini görəndə` : v.field ? `${v.field} səhv olanda` : 'başqa səhvdə';
    out.push(`- *İzah (${when}):* ${v.short ? `${v.short} — ` : ''}Uyğun: ${v.explain.answers.replace(/\.$/, "")}. Səbəb: ${v.explain.reason} Qayda: ${v.explain.rule} Nümunə: ${v.explain.example}`);
  }
}

fs.mkdirSync(path.join(__dirname, '../docs/dersler'), { recursive: true });
for (const raw of unit1Lessons) {
  const lesson = L.resolveLesson(raw);
  const out = [`# Dərs ${lesson.order} — ${lesson.title}`, '', `Bölmə 1 · ${lesson.section}. Bu sənəd \`src/data/unit1/lesson${lesson.order}.ts\`-dən yaradılıb — mətni orada dəyiş, sonra \`node scripts/export-unit1-docs.cjs\`.`, ''];
  for (const card of lesson.cards) {
    const k = card.type === 'intro' || card.type === 'teach' || card.type === 'word' ? card.type : kind(card);
    out.push(`## ${card.number ? `Kart ${card.number}` : 'Giriş'} — ${SCREEN[k]}${card.title ? `: ${card.title}` : ''}`, '');
    if (card.type === 'intro') out.push(card.subtitle, '', ...card.goals.map(g => `- ${g.text}`));
    if (card.type === 'teach') out.push(card.lead ?? '', '', ...card.phrases.map(p => `- **${p.en}** — ${p.az}`), '', ...card.notes);
    if (card.type === 'word') out.push(`**${card.word}** ${card.pronunciation} — ${card.az}`, '', ...(card.notes ?? []), '', `Nümunə: **${card.example}** — ${card.exampleAz}`);
    if (L.isTask(card)) {
      const lines = []; task(card, lines); out.push(...lines.map(l => `${l}  `));
      out.push('', '**Təkrar (yeni vəziyyət):**', '');
      const r = []; task(L.reviewTask(lesson, card.id), r); out.push(...r.map(l => `${l}  `));
    }
    out.push('');
  }
  out.push('## Nəticə', '', `${lesson.result.done.join(' — ')}`, '', ...lesson.result.goals.map(g => `- ${g.group}: ${g.text}`), '', lesson.result.closing, '');
  if (lesson.vocabulary.length) out.push('## Lüğətim', '', '| Söz | Tərcümə | Nümunə |', '|---|---|---|', ...lesson.vocabulary.map(v => `| ${v.word} | ${v.translation} | ${v.example} — ${v.exampleAz} |`), '');
  fs.writeFileSync(path.join(__dirname, `../docs/dersler/Ders_${lesson.order}.md`), out.join('\n'));
}
console.log(`Wrote docs/dersler/Ders_${unit1Lessons.map(l => l.order).join(', ')}.md`);
