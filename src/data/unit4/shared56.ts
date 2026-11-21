// Bölmə 4 · Dərs 5 (I have / Do you have …?) və Dərs 6 (How old is he/she?) — answer patterns and typical mistakes.
// A `pattern` is tested case-insensitively on the trimmed raw answer BEFORE the variants (src/utils/packetAnswer.ts),
// so every pattern here must itself reject the typical mistakes (docs/BOLME_4_XERITESI.md, Dərs 5–6).
import type { Variant } from '../designLessonTypes';
import { ex } from '../unit1/build';

const END = String.raw`\s*[.!]?`;
const DONT = String.raw`(?:don['’]?t|do\s+not)`;
/** Family words of Dərs 2a–3 that go with “a” (no plural in Dərs 5). */
const MEMBER = '(?:brother|sister|son|daughter|friend|husband|wife)';
const HAVE_ONE = String.raw`i\s+have\s+a\s+${MEMBER}(?:\s+and\s+a\s+${MEMBER})?`;
const DONT_ONE = String.raw`i\s+${DONT}\s+have\s+a\s+${MEMBER}(?:\s+(?:and|or)\s+a\s+${MEMBER})?`;
const ONE = `(?:${HAVE_ONE}|${DONT_ONE})`;
const YES = String.raw`yes\s*,?\s*i\s+do`;
const NO = String.raw`no\s*,?\s*i\s+${DONT}`;
const AND_YOU = String.raw`(?:\s*and you\s*\??)?`;

/** Own family, one or two sentences: “I have a brother.”, “I have a brother, but I don't have a sister.”
 *  “I am have”, “I has”, “I have not a …”, “I have brother” are not accepted. */
export const MY_FAMILY = String.raw`^(?:hi\s*[,!.]?\s*)?${ONE}(?:\s*(?:[.,]|and|but)\s*(?:but\s+|and\s+)?${ONE})?${END}${AND_YOU}$`;
/** Reply to “Do you have a …?”: “Yes, I do.” / “No, I don't.”, alone or with a full sentence. “Yes, I have.” is not accepted. */
export const HAVE_REPLY = String.raw`^(?:${YES}|${NO}|${YES}\s*[.,!]?\s*${HAVE_ONE}|${NO}\s*[.,!]?\s*${DONT_ONE}|yes\s*,?\s*${HAVE_ONE}|no\s*,?\s*${DONT_ONE}|${ONE})(?:\s*(?:[.,]|and|but)\s*(?:but\s+|and\s+)?${ONE})?${END}${AND_YOU}$`;
/** Reply to “Do you have a <member>?”: like HAVE_REPLY, but a full first sentence must be about the asked member
 *  (“I have a wife.” is not an answer to “Do you have a brother?”). */
export const haveReply = (member: string) => {
  const has = String.raw`i\s+have\s+a\s+${member}(?:\s+and\s+a\s+${MEMBER})?`;
  const hasNot = String.raw`i\s+${DONT}\s+have\s+a\s+${member}(?:\s+(?:and|or)\s+a\s+${MEMBER})?`;
  return String.raw`^(?:${YES}|${NO}|${YES}\s*[.,!]?\s*${has}|${NO}\s*[.,!]?\s*${hasNot}|yes\s*,?\s*${has}|no\s*,?\s*${hasNot}|${has}|${hasNot})(?:\s*(?:[.,]|and|but)\s*(?:but\s+|and\s+)?${ONE})?${END}${AND_YOU}$`;
};
/** The question “Do you have a son?” (optionally after “And”). “Have you a son?” is not accepted. */
export const askHave = (member: string) => String.raw`^(?:and\s*,?\s*)?do\s+you\s+have\s+a\s+${member}\s*\??$`;

/** Dərs 5: statements with “have” (used from the “I don't have” card on). */
export const HAVE_MISTAKES: Variant[] = [
  { match: { pattern: String.raw`\b(?:i'?m|i\s+am)\s+(?:not\s+)?have\b` }, short: 'have-dən əvvəl am lazım deyil.',
    explain: ex('I have a sister.', '“var” üçün ayrıca am lazım deyil: I have kifayətdir.', 'I have a sister. — düzdür; I am have a sister. — olmur.', 'I have a brother and a sister.') },
  { match: { pattern: String.raw`^i\s+has\b|\bi\s+(?:don'?t|do\s+not)\s+has\b` }, short: 'I ilə have gəlir.',
    explain: ex('I have a sister.', 'Bu dərsdə I ilə yalnız have öyrəndik.', 'I have a sister. — düzdür; I have — mənim var.', 'I have a son.') },
  { match: { pattern: String.raw`\bhave\s+not\b|\bhaven'?t\b|^i\s+not\s+have\b` }, short: "Yoxdursa, don't have deyilir.",
    explain: ex("I don't have a sister.", "“yoxdur” üçün have-dən əvvəl don't gəlir.", "I don't have a sister. — düzdür; I have not a sister. — olmur.", "I don't have a brother.") },
  { match: { pattern: String.raw`\bhave\s+(?:brother|sister|son|daughter|friend|husband|wife)\b` }, short: 'Qardaş, bacı sözündən əvvəl a gəlir.',
    explain: ex('I have a brother.', 'Bir qardaş, bir bacı — qabağında a gəlir.', 'I have a brother. — düzdür; I have brother. — olmur.', 'I have a brother and a sister.') },
  { match: { pattern: String.raw`^there\s+is\b` }, short: '“var” sözünü burada ayrıca tərcümə etmirik.',
    explain: ex('I have a brother.', 'Ailədə kimin olduğunu I have ilə deyirik.', 'I have a brother. — mənim qardaşım var.', 'I have a sister.') },
];
/** Dərs 5: the question and its short answer (used from the “Do you have a brother?” card on). */
export const ASK_MISTAKES: Variant[] = [
  { match: { pattern: String.raw`^(?:and\s*,?\s*)?have\s+you\b` }, short: 'Sual Do ilə başlayır.',
    explain: ex('Do you have a brother?', 'Biz sonda -mı deyirik; ingiliscə əvvələ Do gəlir.', 'Do you have a brother? — sual; I have a brother. — cümlə.', 'Do you have a sister? — Yes, I do.') },
  { match: { pattern: String.raw`^(?:and\s*,?\s*)?are\s+you\s+have\b` }, short: 'are və have birlikdə gəlmir.',
    explain: ex('Do you have a brother?', 'Bu sualda are yox, Do gəlir.', 'Do you have a brother? — düzdür; Are you have a brother? — olmur.', 'Do you have a son? — No, I don\'t.') },
  { match: { pattern: String.raw`^yes\s*,?\s*i\s+have\s*[.!]?$|^no\s*,?\s*i\s+have\s*not\s*[.!]?$` }, short: 'Qısa cavabda do təkrar olunur.',
    explain: ex("Yes, I do. / No, I don't.", 'Sual Do ilə başlayıb — qısa cavabda da do gəlir.', "Yes, I do. — var; No, I don't. — yoxdur.", 'Do you have a sister? — Yes, I do.') },
  { match: { pattern: String.raw`^(?:yes\s*,?\s*i(?:'?m|\s+am)|no\s*,?\s*i(?:'?m|\s+am)\s+not)\b` }, short: 'Bu sual Do ilə başlayıb, Are ilə yox.',
    explain: ex("Yes, I do. / No, I don't.", 'Do ilə sual — do ilə qısa cavab.', "Do you have a brother? — Yes, I do.; Are you from Baku? — Yes, I am.", 'Do you have a sister? — No, I don\'t.') },
];

// ── Dərs 6: yaş ──
const UNITS = '(?:one|two|three|four|five|six|seven|eight|nine)';
const TEENS = '(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)';
const TENS = '(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)';
/** Any age, in digits or words. */
export const AGE_NUMBER = String.raw`(?:\d{1,3}|${TENS}(?:[- ]?${UNITS})?|${TEENS}|${UNITS})`;
/** One given age: num('sixty-two', '62') accepts “sixty-two”, “sixty two”, “62”. */
export const num = (word: string, digits: string) => String.raw`(?:${word.replace('-', '[- ]?')}|${digits})`;
const OLD = String.raw`(?:\s+years\s+old)?`;
const pron = (p: 'he' | 'she') => String.raw`${p}(?:'?s|\s+is)`;

/** “She's sixteen.” (optionally after “Yes.”, “Yes, it is.” or “Yes, she is.”). “She has sixteen”, “She's sixteen years”, “He's sixteen” are not accepted. */
export const ageOf = (p: 'he' | 'she', n: string) => String.raw`^(?:yes\s*[.,!]?\s*(?:(?:it|${p})\s+is\s*[.,!]?\s*)?)?${pron(p)}\s+${n}${OLD}${END}$`;
/** Age written on a form for a woman / a man: “50” or “She's 50”. */
export const ageField = (p: 'he' | 'she') => String.raw`^(?:${pron(p)}\s+)?${AGE_NUMBER}${OLD}${END}$`;
/** “She's my sister. She's twenty.” (her name may come in between: “Her name is Aysel.”). */
export const whoAge = (p: 'he' | 'she', member: string) => {
  const name = p === 'he' ? 'his' : 'her';
  return String.raw`^(?:(?:${pron(p)}|this\s+is)\s+)?my\s+${member}\s*[.,!]?\s*(?:${name}\s+name\s+is\s+\p{L}+\s*[.,!]?\s*)?${pron(p)}\s+${AGE_NUMBER}${OLD}${END}$`;
};

/** Dərs 6: answers with an age. */
export const AGE_OF_MISTAKES: Variant[] = [
  { match: { pattern: String.raw`\b(?:has|have)\b` }, short: 'Yaş “var” ilə deyilmir.',
    explain: ex("He's thirty.", '“30 yaşı var” sözbəsöz tərcümə olunmur. Yaşı He\'s, She\'s ilə deyirik.', "He's thirty. — kişi; She's thirty. — qadın.", "How old is she? — She's twenty.") },
  { match: { pattern: String.raw`\byears?\b(?!\s+old)` }, short: 'Yaşı demək kifayətdir.',
    explain: ex("He's thirty.", 'Ya yalnız yaşı de, ya da years old birlikdə.', "He's thirty. — düzdür; He's thirty years. — olmur.", "How old is she? — She's twenty-five.") },
  { match: { pattern: String.raw`^(?:yes\s*[.,!]?\s*(?:(?:it|he|she)\s+is\s*[.,!]?\s*)?)?(?:he|she)\s+(?!is\b)(?:\d|${TENS}|${TEENS}|${UNITS})` }, short: 'he, she-dən sonra is lazımdır.',
    explain: ex("She's twenty.", 'Azərbaycancada “-dır” şəkilçidir. İngiliscə is ayrıca gəlir: She\'s.', "She's twenty. — düzdür; She twenty. — olmur.", "How old is he? — He's thirty.") },
];
/** Dərs 6: the question “How old is he/she?”. */
export const ASK_AGE_MISTAKES: Variant[] = [
  { match: { pattern: String.raw`^how\s+old\s+(?:he|she|your\s+\p{L}+)\s+is\b` }, short: 'Sualda is qabağa keçir.',
    explain: ex('How old is she?', 'Sualda is he, she sözündən əvvəl gəlir.', "How old is she? — sual; She's twenty. — cavab.", 'How old is your brother?') },
  { match: { pattern: String.raw`^how\s+old\s+are\s+(?:he|she|your\s+(?:mother|father|brother|sister|son|daughter|grandmother|grandfather|friend|husband|wife))\b` }, short: 'Bir nəfər haqqında is gəlir.',
    explain: ex('How old is she?', 'are you ilə gəlir; he, she və bir nəfər ilə is.', 'How old are you? — sən; How old is she? — o.', 'How old is your father?') },
  { match: { pattern: String.raw`\byears\b` }, short: 'Sualda years lazım deyil.',
    explain: ex('How old is he?', 'Yaş sualı How old ilə qurulur, başqa söz lazım deyil.', 'How old is he? — düzdür; How old are you? — sən.', 'How old is your son?') },
];
