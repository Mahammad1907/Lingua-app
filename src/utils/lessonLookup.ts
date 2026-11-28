// Lookups over all lesson content (20 Nov 2026):
// - meaningOf: the Azerbaijani meaning of a model answer, shown in the wrong-answer panel;
// - taughtIn: which earlier lesson taught a phrase in the answer, shown as “Təkrarla: Bölmə X · Dərs Y”.
import type { DesignLesson } from '../data/designLessonTypes';
import { designLessons } from '../data/designLessons';
import { ordinal } from './ordinal';

const norm = (t: string) => t.toLowerCase().replace(/[’‘]/g, "'").replace(/[“”"….,!?:;()]/g, ' ').replace(/\[ad\]|\{[a-z]\}/gi, ' ').replace(/\s+/g, ' ').trim();

let meanings: Map<string, string> | undefined;
let taught: { key: string; lesson: number }[] | undefined;

function build() {
  meanings = new Map(); taught = [];
  const add = (en?: string, az?: string) => { if (!en || !az) return; const k = norm(en); if (k && !meanings!.has(k)) meanings!.set(k, az.trim()); };
  designLessons.forEach((l, i) => {
    for (const c of l.cards) {
      if (c.type === 'word') {
        add(c.example, c.exampleAz); add(c.word, c.az);
        if (!l.exam && !l.reviewOf) { const k = norm(c.word); if (k) taught!.push({ key: k, lesson: i }); }
      } else if (c.type === 'teach') {
        c.phrases.forEach(p => add(p.en, p.az)); add(c.example?.en, c.example?.az);
      } else if (c.type === 'match') {
        c.rows.forEach(r => add(r.en, r.az));
      }
    }
    l.vocabulary.forEach(v => { add(v.example, v.exampleAz); add(v.word, v.translation); });
  });
}

/** Azerbaijani meaning of an English answer, or undefined when it is not known (never a guess). */
export function meaningOf(answer?: string): string | undefined {
  if (!answer) return undefined;
  if (!meanings) build();
  const whole = meanings!.get(norm(answer));
  if (whole) return whole;
  // “A → B”, “A; B”: every part must be known.
  const parts = answer.split(/\s*(?:→|;|\s—\s)\s*/).filter(p => norm(p));
  if (parts.length < 2) return undefined;
  const az = parts.map(p => meanings!.get(norm(p)));
  return az.every(Boolean) ? az.join(' → ') : undefined;
}

const label = (l: DesignLesson) => `Bölmə ${l.unit ?? 1} · Dərs ${l.number ?? l.order}${l.part ? ` (${ordinal(l.part)} hissə)` : ''}`;

/** The earlier lesson whose “Yeni söz” card taught the longest phrase found in the answer; undefined if it is this lesson. */
export function taughtIn(answer: string | undefined, current: DesignLesson): string | undefined {
  if (!answer) return undefined;
  if (!taught) build();
  const text = ` ${norm(answer)} `;
  const here = designLessons.findIndex(l => l.id === current.id);
  const hits = taught!.filter(t => text.includes(` ${t.key} `));
  if (!hits.length) return undefined;
  const best = hits.reduce((a, b) => (b.key.length > a.key.length ? b : a));
  if (best.lesson === here || (here >= 0 && best.lesson > here)) return undefined;
  return label(designLessons[best.lesson]);
}
