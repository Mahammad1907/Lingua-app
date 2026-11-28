// Bölmə 4 · Dərs 7 və 8 üçün ortaq səhv variantları: peşə sözündən əvvəl a / an, he ↔ she.
// Hər pattern öyrənənin real səhvini tutur (He's doctor · an doctor · a engineer) və düzgün cavabı rədd etmir.
import type { Variant } from '../designLessonTypes';
import { ex } from '../unit1/build';

/** a atılıb: “He's doctor.” */
export const noArticle = (right: string, wrong: string, example: string): Variant => ({
  match: { pattern: String.raw`^(?:he|she)(?:'?s|\s+is)\s+(?:teacher|student|doctor|engine(?:er))\b` }, short: 'Peşə sözündən əvvəl a və ya an lazımdır.',
  explain: ex(right, 'Biz “həkimdir” deyirik, ingiliscə peşə sözündən əvvəl a və ya an gəlir.', `${right} — düzdür; ${wrong} — olmur.`, example),
});
/** Samitlə başlayan sözdən əvvəl an: “an doctor”. */
export const anForConsonant = (right: string, wrong: string, reason: string, example: string): Variant => ({
  match: { pattern: String.raw`\ban\s+(?:teacher|student|doctor)\b` }, short: 'Bu sözdən əvvəl an yox, a gəlir.',
  explain: ex(right, reason, `${right} — düzdür; ${wrong} — olmur.`, example),
});
/** Saitlə başlayan sözdən əvvəl a: “a engineer”. */
export const aForVowel = (right: string, wrong: string, example: string): Variant => ({
  match: { pattern: String.raw`\ba\s+engine(?:er)\b` }, short: 'engineer-dən əvvəl a yox, an gəlir.',
  explain: ex(right, 'engineer e səsi ilə başlayır: belə sözdən əvvəl an gəlir.', `${right} — düzdür; ${wrong} — olmur.`, example),
});
/** Qız haqqında he deyilib. */
export const heForShe = (right: string, example: string): Variant => ({
  match: { pattern: String.raw`^he\b` }, short: 'Qız haqqında “she” deyilir.',
  explain: ex(right, 'Azərbaycancada ikisi də “o”dur, ingiliscə qız üçün “she” gəlir.', `${right} — qız; ${right.replace(/^She/, 'He')} — oğlan.`, example),
});
/** Oğlan haqqında she deyilib. */
export const sheForHe = (right: string, example: string): Variant => ({
  match: { pattern: String.raw`^she\b` }, short: 'Oğlan haqqında “he” deyilir.',
  explain: ex(right, 'Azərbaycancada ikisi də “o”dur, ingiliscə oğlan üçün “he” gəlir.', `${right} — oğlan; ${right.replace(/^He/, 'She')} — qız.`, example),
});
/** Variant for one field of a two-message task. */
export const forField = (field: string, v: Variant): Variant => ({ ...v, field });
