// Writes a readable document for each Bölmə 1 lesson (2–8) from its data, so the text can be reviewed
// without reading code: node scripts/export-unit1-docs.cjs → docs/dersler/Ders_N.md
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const L = require('../src/utils/designLesson.ts');
// All lessons on the new screens: Bölmə 1 (Ders_N.md), section exams (BolmeN_Imtahan.md), Bölmə 2 (Bolme2_Ders_1a.md …).
const { designLessons: allLessons } = require('../src/data/designLessons.ts');
const fileOf = l => l.exam ? `Bolme${l.unit ?? 1}_Imtahan.md` : (l.unit ?? 1) === 1 ? `Ders_${l.order}.md` : `Bolme${l.unit}_Ders_${l.number}${l.part === 1 ? 'a' : l.part === 2 ? 'b' : ''}.md`;
const sourceOf = l => l.exam ? `src/data/unit${l.unit ?? 1}/exam.ts` : l.order === 1 ? 'src/data/lesson1Design.ts' : (l.unit ?? 1) === 1 ? `src/data/unit1/lesson${l.order}.ts` : `src/data/unit${l.unit}/lesson${l.number}${l.part === 1 ? 'a' : l.part === 2 ? 'b' : ''}.ts`;
const headOf = l => l.exam ? `Bölmə ${l.unit ?? 1} imtahanı` : `Dərs ${l.number ?? l.order}${l.part ? ` · ${l.part}-ci hissə` : ''} — ${l.title}`;

const SCREEN = { keypad: 'Nömrəni yığ', letters: 'Hərfləri tut', form: 'Formanı doldur', choice: 'Seç', gap: 'Sözü tamamla', scene: 'Səhnədə tap', write: 'Yaz', chat: 'Dialoqu tamamla', tiles: 'Mesaj yaz (sözlərdən)', voice: 'Səslə cavab', repeat: 'Dinlə və təkrarla', match: 'Kim nə dedi?', order: 'Söhbəti sırala', reply: 'Cavab cütü', two: 'İki mesaj yaz', word: 'Yeni söz', teach: 'Öyrətmə / səhnə', intro: 'Giriş' };
const kind = t => t.type === 'two' && t.form ? 'form' : t.type === 'write' ? (t.keypad ? 'keypad' : t.letters ? 'letters' : t.tiles ? 'tiles' : t.chat ? 'chat' : 'write') : t.type === 'choice' ? (t.gap ? 'gap' : t.spots ? 'scene' : 'choice') : t.type === 'voice' ? (t.repeat ? 'repeat' : 'voice') : t.type === 'match' ? (t.mode && t.mode !== 'meaning' ? t.mode : 'match') : t.type;
const rule = r => r.exact ? `dəqiq: ${r.answers.join(' / ')}` : `məna: ${(r.goals || []).join(' + ')} — nümunə: ${r.answers.join(' / ')}`;

function task(t, out) {
  out.push(`**Tapşırıq:** ${t.prompt.replace(/\n/g, ' ')}`);
  if (t.audio) out.push(`**Səs:** ${t.audio}`);
  if (t.chat) out.push(`**Yazışma (${t.chat.partner}):** ${t.chat.lines.map(l => `“${l.text}”`).join(' → ') || '—'}`);
  if (t.gap) out.push(`**Cümlə:** ${t.gap.before} ___ ${t.gap.after}`);
  if (t.type === 'choice') out.push(`**Seçimlər:** ${t.options.join(' / ')} — **düzgün:** ${t.answer}`);
  if (t.tiles) out.push(`**Sözlər:** ${t.tiles.join(' · ')}`);
  if (t.letters) out.push(`**Hərflər:** ${t.letters.join(' ')}`);
  if (t.form) out.push(`**Forma:** ${t.form.title}${t.form.subtitle ? ` — ${t.form.subtitle}` : ''}`);
  if (t.type === 'match' && t.mode === 'order') out.push(`**Düzgün sıra:** ${t.rows.map(r => `${r.en}. ${r.az}`).join(' → ')}`);
  else if (t.type === 'match') out.push(`**Cütlər:** ${t.rows.map(r => `${r.en} — ${r.az}`).join('; ')}${t.extra.length ? ` · artıq: ${t.extra.join(', ')}` : ''}`);
  if (t.type === 'two') for (const f of t.fields) out.push(`**${f.label}:** ${rule(f.rule)}`);
  if (t.rule) out.push(`**Qəbul:** ${rule(t.rule)}${t.rule.pattern ? ` · öz məlumatı: /${t.rule.pattern}/` : ''}`);
  if (t.sample) out.push(`**Nümunə göstərilir:** ${t.sample}`);
  if (t.hint) out.push(`**İpucu:** ${t.hint}`);
  if (t.why) out.push(`**Düzgün olanda:** ${t.why}`);
  for (const v of t.variants) {
    const m = v.match; const field = v.field && t.fields?.find(f => f.id === v.field);
    const when = 'swapped' in m ? 'iki mesajın yeri dəyişəndə' : 'option' in m ? `“${m.option}” seçiləndə` : 'goal' in m ? `${field ? `“${field.label}” sahəsində ` : ''}cavab “${m.goal}” işini görəndə` : field ? `“${field.label}” səhv olanda` : 'başqa səhvdə';
    out.push(`- *İzah (${when}):* ${v.short ? `${v.short} — ` : ''}Uyğun: ${v.explain.answers.replace(/\.$/, "")}${/[!?…]$/.test(v.explain.answers) ? "" : "."} Səbəb: ${v.explain.reason} Qayda: ${v.explain.rule} Nümunə: ${v.explain.example}`);
  }
}

fs.mkdirSync(path.join(__dirname, '../docs/dersler'), { recursive: true });
for (const raw of allLessons) {
  const lesson = L.resolveLesson(raw);
  const out = [`# ${headOf(lesson)}`, '', `Bölmə ${lesson.unit ?? 1} · ${lesson.section ?? ''}. Bu sənəd \`${sourceOf(lesson)}\`-dən yaradılıb — mətni orada dəyiş, sonra \`node scripts/export-unit1-docs.cjs\`.`, ''];
  for (const card of lesson.cards) {
    const k = card.type === 'intro' || card.type === 'teach' || card.type === 'word' ? card.type : kind(card);
    out.push(`## ${card.number ? `Kart ${card.number}` : 'Giriş'} — ${SCREEN[k]}${card.title ? `: ${card.title}` : ''}`, '');
    if (card.type === 'intro') out.push(card.subtitle, '', ...card.goals.map(g => `- ${g.text}`));
    if (card.type === 'teach') out.push(card.lead ?? '', '', ...card.phrases.map(p => `- **${p.en}** — ${p.az}`), '', ...card.notes, ...(card.structure ? ['', `Quruluşu: ${card.structure.join(' · ')}`] : []), ...(card.example ? ['', `Nümunə: **${card.example.en}** — ${card.example.az}`] : []));
    if (card.type === 'word') out.push(`**${card.word}** — ${card.az}`, '', `Oxunuşu: ${card.reading ?? '—'} · IPA: ${card.pronunciation}`, ...(card.structure ? ['', `Quruluşu: ${card.structure.join(' · ')}`] : []), '', `Nümunə: **${card.example}** — ${card.exampleAz}`, '', ...(card.notes ?? []).map(n => `Qeyd: ${n}`));
    if (L.isTask(card)) {
      const lines = []; task(card, lines); out.push(...lines.map(l => `${l}  `));
      if (card.review) {
        out.push('', '**Təkrar (yeni vəziyyət):**', '');
        const r = []; task(L.reviewTask(lesson, card.id), r); out.push(...r.map(l => `${l}  `));
      }
    }
    out.push('');
  }
  out.push('## Nəticə', '', `${lesson.result.done.join(' — ')}`, '', ...lesson.result.goals.map(g => `- ${g.group}: ${g.text}`), '', lesson.result.closing, '');
  if (lesson.vocabulary.length) out.push('## Lüğətim', '', '| Söz | Tərcümə | Nümunə |', '|---|---|---|', ...lesson.vocabulary.map(v => `| ${v.word} | ${v.translation} | ${v.example} — ${v.exampleAz} |`), '');
  fs.writeFileSync(path.join(__dirname, `../docs/dersler/${fileOf(lesson)}`), out.join('\n'));
}
console.log(`Wrote docs/dersler/: ${allLessons.map(fileOf).join(', ')}`);
