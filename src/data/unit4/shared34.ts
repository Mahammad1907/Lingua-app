// Bölmə 4 · Dərs 3–4 (docs/BOLME_4_XERITESI.md): answer patterns and typical mistakes shared by “his və her” and “Bu sənin anandır?”.
// A `pattern` is tested case-insensitively on the trimmed raw answer BEFORE the variants (gradeText in src/utils/designLesson.ts),
// so every pattern here rejects the typical mistakes itself.
// check-taught reads every string of a card (patterns too) for the “phrase before its own card” rule:
// “he(?:r)” keeps the word out of the patterns used before the her card.
import type { Variant } from '../designLessonTypes';
import { ex } from '../unit1/build';

export const END = String.raw`\s*[.!]?`;
/** A first name the learner may choose (one word of letters). */
export const NAME = String.raw`\p{L}[\p{L}'’-]*`;
/** “He's” / “He is” and “She's” / “She is”. */
export const HE_IS = String.raw`he(?:'s|’s|\s+is)`;
export const SHE_IS = String.raw`she(?:'s|’s|\s+is)`;

/** Family and people words of Bölmə 4 (Dərs 1–3); “hus(?:band)”, “wi(?:fe)” keep the words out of cards before their own. */
const PEOPLE = '(?:name|family|friend|mother|father|brother|sister|parents|grandmother|grandfather|son|daughter|hus(?:band)|wi(?:fe))';

/** “He's name” / “She's name”: “o …-dır” instead of “onun”. */
export const ownerNotIs = (right: 'his' | 'her', answer: string, example: string): Variant => ({
  match: { pattern: String.raw`\bs?he(?:'s|’s|\s+is)\s+${PEOPLE}\b` },
  short: right === 'his' ? '“onun” üçün his lazımdır, he’s yox.' : '“onun” üçün her lazımdır, she’s yox.',
  explain: ex(answer, right === 'his' ? 'He’s “odur” deməkdir. “Onun” üçün his deyilir.' : 'She’s “odur” deməkdir. “Onun” üçün her deyilir.',
    right === 'his' ? "He's my brother. — odur; His name is Elvin. — onun." : "She's my sister. — odur; Her name is Nigar. — onun.", example),
});
/** his ↔ her: Azerbaijani has one word, “onun”. `owner` says whose it is (for husband / wife). */
export const wrongOwner = (right: 'his' | 'her', answer: string, example: string, owner?: string): Variant => ({
  match: { pattern: String.raw`\b${right === 'his' ? 'he(?:r)' : 'his'}\s+${PEOPLE}\b` },
  short: right === 'his' ? 'Kişinin — his.' : 'Qadının — her.',
  explain: ex(answer, owner ?? (right === 'his' ? 'Azərbaycancada ikisi də “onun”dur; kişinin adı və ailəsi üçün his.' : 'Azərbaycancada ikisi də “onun”dur; qadının adı və ailəsi üçün her.'),
    right === 'his' ? 'his — kişinin; her — qadının.' : 'her — qadının; his — kişinin.', example),
});
/** “His name Elvin.” — is is missing. */
export const nameNoIs = (answer: string, example: string): Variant => ({
  match: { pattern: String.raw`\b(?:his|he(?:r))\s+name\s+(?!is\b)\p{L}` },
  short: 'Adın əvvəlində is lazımdır.',
  explain: ex(answer, 'Azərbaycancada “-dır” şəkilçidir, ingiliscə ayrıca söz kimi gəlir: is.', 'My name is [ad]. — kimi: name, sonra is, sonra ad.', example),
});
/** “His is name Elvin.” — word order. */
export const nameOrder = (answer: string, example: string): Variant => ({
  match: { pattern: String.raw`\b(?:his|he(?:r))\s+is\s+name\b` },
  short: 'Sıra: əvvəl name, sonra is.',
  explain: ex(answer, 'My name is [ad]. sırası kimidir: kimin, name, is, ad.', 'My name is [ad]. — sıra eynidir.', example),
});

/** Dərs 4: “No, it isn't.” (also “No, it is not.”, “No, it's not.”, “No, she isn't.” / “No, he isn't.”), optionally who it is. */
export const noIt = (who: 'he' | 'she', then?: string) => {
  const subject = String.raw`(?:it|${who})`;
  const not = String.raw`(?:\s+(?:isn'?t|isn’t|is\s+not)|(?:'s|’s)\s+not)`;
  const tail = then ? String.raw`(?:\s*(?:${who === 'he' ? HE_IS : SHE_IS}|this\s+is)\s+my\s+${then}${END})?` : '';
  return String.raw`^no\s*,?\s*${subject}${not}${END}${tail}$`;
};
/** “No, it not.” / “No, isn't.” / “No, I'm not.” / “Yes”: typical mistakes with the short “no” answer about a photo. */
export const NO_IT_MISTAKES = (answer: string): Variant[] => [
  { match: { pattern: String.raw`^no\s*,?\s*(?:it|s?he)\s+not\b` }, short: 'not-dan əvvəl is lazımdır: isn’t.',
    explain: ex(answer, '“deyil” üçün is və not birlikdə gəlir: isn’t.', "No, it isn't. — düzdür; No, it not. — olmur.", "Is this your mother? — No, it isn't.") },
  { match: { pattern: String.raw`^no\s*,?\s*isn` }, short: 'isn’t-dən əvvəl it lazımdır.',
    explain: ex(answer, 'Qısa cavabda “bu” yerinə it gəlir: No, it isn’t.', "No, it isn't. — düzdür; No, isn't. — olmur.", "Is this your mother? — No, it isn't.") },
  { match: { pattern: String.raw`^no\s*,?\s*i(?:'m|’m|\s+am)\b` }, short: 'Sual sənin haqqında deyil, şəkildəki adam haqqındadır.',
    explain: ex(answer, 'Sualda this var — cavabda it gəlir, I yox.', "No, it isn't. — şəkildəki adam; No, I'm not. — mən.", "Is this your mother? — No, it isn't.") },
  { match: { pattern: String.raw`^yes\b` }, short: 'O sənin dediyin adam deyil — cavab “xeyr”dir.',
    explain: ex(answer, 'Şəkildəki adam soruşulan adam deyil, “xeyr” lazımdır.', "Yes, it is. — bəli; No, it isn't. — xeyr.", "Is this your mother? — No, it isn't.") },
];
/** “Is this your mother?” — also “Is she your mother?”. */
export const isThisYour = (word: string) => String.raw`^is\s+(?:this|s?he)\s+your\s+${word}\s*\??$`;
/** Typical mistakes with the question: you ↔ your, word order, “Do this is…”. */
export const QUESTION_MISTAKES = (answer: string): Variant[] => [
  { match: { pattern: String.raw`\byou\s+(?!are\b)${PEOPLE}\b` }, short: '“sənin” üçün your lazımdır.',
    explain: ex(answer, 'you — “sən”, your — “sənin”. Ailə sözündən əvvəl your gəlir.', "What's your name? — your; How are you? — you.", 'Is she your sister?') },
  { match: { pattern: String.raw`^this\s+is\b` }, short: 'Sualda is əvvələ keçir.',
    explain: ex(answer, 'Azərbaycancada sual səslə qurulur, ingiliscə is cümlənin əvvəlinə keçir.', 'This is my mother. — cümlə; Is this your mother? — sual.', 'Is this your father?') },
  { match: { pattern: String.raw`^do\b` }, short: 'Bu sual do ilə yox, is ilə başlayır.',
    explain: ex(answer, 'this olan sualda do yoxdur: Is this ilə başlayır.', 'Is this your father? — düzdür; Do this is your father? — olmur.', 'Is this your father?') },
  { match: { pattern: String.raw`\bmy\s+${PEOPLE}\b` }, short: 'Onun ailəsini soruşursan — your.',
    explain: ex(answer, 'my — “mənim”, your — “sənin”. Qarşındakının ailəsini soruşursan.', 'This is my mother. — mənim; Is this your mother? — sənin.', 'Is she your sister?') },
];
