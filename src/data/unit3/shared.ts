// Bölmə 3 — "Haradansan" (docs/BOLME_3_XERITESI.md): answer patterns for the learner's own data and typical mistakes.
// A `pattern` is tested case-insensitively on the trimmed raw answer and is checked BEFORE the variants,
// so every pattern here must itself reject the typical mistakes (gradeText in src/utils/designLesson.ts).
// Rule 20 (user, 15 Nov 2026): the word “Azeri” is never accepted, shown or taught — only “Azerbaijani”.
import type { Variant } from '../designLessonTypes';
import { ex } from '../unit1/build';
export { notices, resultTexts, own, said } from '../unit2/shared';

/** A place name: one to three words of letters (Baku, Ganja, Turkey, the UK, the USA). */
const PLACE = String.raw`(?:the\s+)?\p{L}[\p{L}'’-]*(?:\s+\p{L}[\p{L}'’-]*){0,2}`;
/** A place that is not a nationality word (rejects “I'm from Azerbaijani”). */
const NOT_NATIONALITY = String.raw`(?!(?:azerbaijani|turkish|russian|georgian|english|american|german|french|british|azeri)\b)`;
const END = String.raw`\s*[.!]?`;

/** Own origin: “I'm from Azerbaijan.” / “I'm from Baku.”, optionally “And you?”. “I'm Azerbaijan”, “I from …” are not accepted. */
export const FROM = String.raw`^(?:i'?m|i am)\s+from\s+${NOT_NATIONALITY}${PLACE}${END}(?:\s*and you\s*\??)?$`;
/** Own origin plus the return question (“I'm from Ganja. And you?”). */
export const FROM_RETURN = String.raw`^(?:i'?m|i am)\s+from\s+${NOT_NATIONALITY}${PLACE}\s*[.!,]?\s*(?:and you|where are you from)\s*\??$`;
/** Own nationality: “I'm Azerbaijani.” (any nationality word; “Azeri” and country names are not accepted). */
export const NATIONALITY = String.raw`^(?:i'?m|i am)\s+(?!azeri\b)(?:azerbaijani|turkish|russian|georgian|english|american|german|french|british|\p{L}+(?:ian|ish|ese))${END}$`;
/** Nationality written on a form: one word. */
export const NATIONALITY_FIELD = String.raw`^(?!azeri\b)(?:azerbaijani|turkish|russian|georgian|english|american|german|french|british|\p{L}+(?:ian|ish|ese))$`;
/** Own city: “I live in Baku.” (“I live at …”, “I'm live …” are not accepted). */
export const LIVE = String.raw`^i\s+live\s+in\s+${PLACE}${END}$`;
/** Origin and city together: “I'm from Ganja, but I live in Baku.” (also without “but”, as two sentences). */
export const FROM_LIVE = String.raw`^(?:i'?m|i am)\s+from\s+${NOT_NATIONALITY}${PLACE}\s*[.,]?\s*(?:but\s+)?i\s+live\s+in\s+${PLACE}${END}$`;
/** Language words (a language is the same word as the nationality). */
const LANG = String.raw`(?!azeri\b)(?:azerbaijani|turkish|russian|georgian|english|german|french|\p{L}+(?:ian|ish|ese))`;
/** Own languages: “I speak Azerbaijani and Russian.”, “I speak English a little.”, “I speak a little English.” */
export const SPEAK = String.raw`^(?:yes,?\s*(?:i do\s*[.,]?\s*)?)?i\s+speak\s+(?:a\s+little\s+)?${LANG}(?:\s*(?:,|and)\s*(?:a\s+little\s+)?${LANG})*(?:\s+a\s+little)?${END}$`;

/** Typical mistakes with own origin (docs/AZ_OYRENEN_SEHVLERI.md). Use as variants of tasks with FROM / FROM_RETURN. */
export const FROM_MISTAKES: Variant[] = [
  { match: { pattern: String.raw`^(?:i'?m|i am)\s+(?!from\b)(?:azerbaijan|turkey|georgia|russia|iran|england|germany|france|baku|ganja)\b` }, short: 'Ölkədən əvvəl “from” lazımdır.',
    explain: ex("I'm from Azerbaijan.", 'Haradan olduğunu deyəndə “from” gəlir: Azərbaycandan.', "I'm from Azerbaijan. — haradan; I'm Azerbaijani. — millət.", "Where are you from? — I'm from Baku.") },
  { match: { pattern: String.raw`^i\s+from\b` }, short: 'I-dan sonra am lazımdır.',
    explain: ex("I'm from Azerbaijan.", 'Azərbaycancada “-am” şəkilçidir, ingiliscə I-dan sonra ayrıca gəlir.', "I'm from Baku. — düzdür; I from Baku. — olmur.", "Where are you from? — I'm from Ganja.") },
  { match: { pattern: String.raw`\bfrom\s+(?:azerbaijani|turkish|russian|georgian|english|american|german|french)\b` }, short: '“from”dan sonra ölkə gəlir, millət yox.',
    explain: ex("I'm from Azerbaijan.", 'Azerbaijani millətdir; “from”dan sonra ölkə və ya şəhər gəlir.', "I'm from Azerbaijan. — ölkə; I'm Azerbaijani. — millət.", "I'm from Azerbaijan. I'm Azerbaijani.") },
];
/** Typical mistakes with own city. */
export const LIVE_MISTAKES: Variant[] = [
  { match: { pattern: String.raw`\blive\s+at\b` }, short: 'Şəhərdən əvvəl “in” gəlir.',
    explain: ex('I live in Baku.', 'Şəhərdə yaşayırsan — “in”: Bakıda.', 'I live in Baku. — düzdür; I live at Baku. — olmur.', 'Where do you live? — I live in Ganja.') },
  { match: { pattern: String.raw`^(?:i'?m|i am)\s+liv|^i\s+living\b` }, short: 'Burada I-dan sonra birbaşa live gəlir.',
    explain: ex('I live in Baku.', '“yaşayıram” üçün I-dan sonra am lazım deyil: I live.', "I live in Baku. — düzdür; I'm live in Baku. — olmur.", 'Where do you live? — I live in Ganja.') },
];
/** Typical mistakes with own languages. */
export const SPEAK_MISTAKES: Variant[] = [
  { match: { pattern: String.raw`\bspeak\b.*\b(?:azerbaijan|turkey|georgia|russia|england|germany|france)\b` }, short: 'Dil ölkə adı deyil.',
    explain: ex('I speak Azerbaijani.', 'Dilin adı millət sözü ilə eynidir: Azerbaijani, Russian, English.', 'I speak Russian. — dil; I am from Russia. — ölkə.', 'Do you speak English? — Yes, I do.') },
  { match: { pattern: String.raw`\bspeak\b.*(?<!\ba\s)\blittle\b` }, short: '“little”dən əvvəl “a” gəlir: a little.',
    explain: ex('I speak a little English.', '“bir az” ingiliscə iki sözdür: a little.', 'I speak a little English. — düzdür; I speak little English. — başqa məna verir.', 'Do you speak English? — Yes, a little.') },
];
