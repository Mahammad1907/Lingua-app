// “Söhbəti tamamla” (25 Nov 2026, user): the word version of “Söhbəti sırala”. Every conversation stays one style:
// either the learner orders whole lines (sentence mode) or all lines stand in order and each misses ONE word (word
// mode). The two alternate across the course. The missing word is a taught glossary word (never a name), and one or
// two other taught words from the same conversation are added as distractors. Grading needs no change: each row's
// answer (az) becomes the missing word and `line` keeps the sentence with a “___” gap.
import type { MatchTask } from '../data/designLessonTypes';
import { glossOf } from '../data/unit1/glossary';

const tokensOf = (line: string) => line.match(/[A-Za-z][A-Za-z'’]*/g) ?? [];
const sameWord = (a: string, b: string) => a.toLowerCase().replace(/’/g, "'") === b.toLowerCase().replace(/’/g, "'");

/** Word-mode copy of an order task, or null when some line has no taught word to leave out (then it stays sentence mode). */
export function gapVersion(task: MatchTask): MatchTask | null {
  if (task.mode !== 'order' || !task.rows.length) return null;
  const rows: MatchTask['rows'] = [];
  for (const r of task.rows) {
    // Taught words only; prefer longer ones (“name” over “my”). Names are not in the glossary, so they are never left out.
    const pick = tokensOf(r.az).filter(w => glossOf(w) && w.length >= 2).sort((a, b) => b.length - a.length)[0];
    if (!pick) return null;
    const at = r.az.search(new RegExp(`(?<![A-Za-z'’])${pick.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z'’])`));
    if (at < 0) return null;
    rows.push({ ...r, az: pick, line: `${r.az.slice(0, at)}___${r.az.slice(at + pick.length)}` });
  }
  const answers = rows.map(r => r.az);
  const pool = [...task.rows.map(r => r.az), ...task.extra].flatMap(tokensOf)
    .filter(w => glossOf(w) && w.length >= 3 && !answers.some(a => sameWord(a, w)));
  const extra: string[] = [];
  for (const w of pool) if (extra.length < 2 && !extra.some(e => sameWord(e, w))) extra.push(w);
  // Wrong-answer sheet: the full lines with the right words (the sentence-order explanations would not fit here).
  const full = task.rows.map(r => r.az).join(' / ');
  const base = task.variants.find(v => 'other' in v.match)?.explain;
  const variants: MatchTask['variants'] = [{ match: { other: true }, short: 'Bəzi boşluqlara başqa söz lazımdır.',
    explain: { answers: full, reason: 'Hər boşluğa cümlənin mənasına uyğun söz düşür.', rule: base?.rule ?? '', example: base?.example ?? task.rows[0].az } }];
  return { ...task, gaps: true, title: 'Söhbəti tamamla', rows, extra, variants };
}
