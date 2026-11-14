// Bölmə 2 — shared texts and answer patterns for learner data (own phone number, age, e-mail, name).
// A `pattern` is tested case-insensitively on the trimmed raw answer (src/utils/packetAnswer.ts); `answers` stay the model answers.
import type { DesignLesson, Variant } from '../designLessonTypes';
import { ex } from '../unit1/build';
import type { PacketRule } from '../b1PacketTypes';

export const notices: DesignLesson['notices'] = {
  soundFailed: 'Səs açılmadı. Yenidən dinlə və ya mətnlə davam et.',
  unknown: 'Cavabı yoxlaya bilmədim. Bir az fərqli yaz və ya yenidən cəhd et.',
  voiceUnknown: 'Səsini aydın eşitmədim. Yenidən de.',
  micFailed: 'Mikrofon açılmadı. Keçə bilərsən.',
  review: 'Səhv etdiyin tapşırıqlara yeni vəziyyətdə qayıdırıq.',
};
export const resultTexts = {
  incomplete: 'Dərs tam bitmədi. Yoxlanmayan tapşırıqlara sonra qayıda bilərsən.',
  button: 'Ana səhifəyə qayıt',
  technical: 'Səs problemi oldu. Bu hissə yoxlanmadı.',
  unverified: 'Yoxlanmadı',
};

// “o(?:h)” keeps the word “oh” out of the pattern text (check-taught reads every string as possible shown text).
const DIGIT = String.raw`(?:zero|o(?:h)|one|two|three|four|five|six|seven|eight|nine|\d)`;
const UNITS = '(?:one|two|three|four|five|six|seven|eight|nine)';
const TEENS = '(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)';
const TENS = '(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)';
const AGE_NUMBER = String.raw`(?:\d{1,3}|${TENS}(?:[- ]?${UNITS})?|${TEENS}|${UNITS})`;
const SEP = String.raw`[\s,.-]*`;

/** Own phone number: “It's 050 321 45 67”, digits or number words (7–15). “My phone is …” is not accepted. */
export const PHONE = String.raw`^(?:it'?s\s+|it is\s+|my (?:phone )?number is\s+)?(?:${DIGIT}${SEP}){7,15}[.!]?$`;
/** Own age: “I'm 25.”, “I'm twenty-five years old.”, optionally “And you?”. “I'm 25 years” is not accepted. */
export const AGE = String.raw`^(?:i'?m|i am)\s+${AGE_NUMBER}(?:\s+years\s+old)?\s*[.!]?(?:\s*and you\s*\??)?$`;
/** Own age plus the return question: “I'm 25. And you?” (Dərs 8). */
export const AGE_RETURN = String.raw`^(?:i'?m|i am)\s+${AGE_NUMBER}(?:\s+years\s+old)?\s*[.!,]?\s*(?:and you|how old are you)\s*\??$`;
/** Age written on a form: “25” or “I'm 25”. */
export const AGE_FIELD = String.raw`^(?:(?:i'?m|i am)\s+)?${AGE_NUMBER}(?:\s+years\s+old)?\s*[.!]?$`;
/** A name written on a form: one to three words of letters. */
export const NAME = String.raw`^\p{L}[\p{L}'’-]*(?:\s+\p{L}[\p{L}'’-]*){0,2}$`;
/** Own last name said aloud: “It's Mammadova.” / “My last name is …”. */
export const LAST_NAME_SAID = String.raw`^(?:(?:it'?s|it is|my last name is)\s+)?\p{L}[\p{L}'’-]{1,30}[.!]?$`;
/** Own name spelled aloud (speech recognition may join the letters, so a whole name is accepted too). */
export const NAME_SPELLED = String.raw`^(?:(?:it'?s|my name is)\s+)?(?:(?:(?:double\s+)?\p{L}(?:[\s,.-]+|$)){2,}|\p{L}{2,}[.!]?)$`;
/** Own e-mail written on a form or in a message. */
export const EMAIL = String.raw`^(?:(?:it'?s|my email is)\s+)?[\w.+-]+@[\w-]+(?:\.[\w-]+)+\.?$`;
/** Own e-mail said aloud: “It's K-B at mail dot com.” (also with @ and . from speech recognition). “et” / “nöqtə” are not accepted. */
export const EMAIL_SAID = String.raw`^(?:(?:it'?s|it is|my email is)\s+)?[\p{L}\d ._-]+?(?:\s*@\s*|\s+at\s+)[\p{L}\d_-]+(?:\s*\.\s*|\s+dot\s+)\p{L}{2,}[.!]?$`;

/** A word said letter by letter (“H, K, G”, “It's G-A-N-J-A”); a double letter may be said as “double L”. */
export function spelled(word: string): string {
  const up = word.toUpperCase();
  const parts: string[] = [];
  for (let i = 0; i < up.length; i++) {
    const c = up[i].toLowerCase();
    if (up[i + 1] === up[i]) { parts.push(`(?:double\\s*${c}|${c}${SEP}${c})`); i++; } else parts.push(c);
  }
  return `^(?:it'?s\\s+)?${parts.join(SEP)}[.!]?$`;
}

/** Learner data: the pattern decides; `answers` are the model answers shown after a mistake. */
export const own = (pattern: string, ...answers: string[]): PacketRule => ({ answers, pattern });
/** A fixed answer that may be said or written in several ways (digits, letters). */
export const said = (pattern: string, ...answers: string[]): PacketRule => ({ answers, exact: true, pattern });

/** Typical mistakes with the learner's own data (docs/AZ_OYRENEN_SEHVLERI.md). Put first in `variants`: speech that matches
 *  one of these is a real language error, not “Yoxlanmadı” (src/utils/designLesson.ts gradeText). */
export const AGE_MISTAKES: Variant[] = [
  { match: { pattern: String.raw`\bhave\b|\bhas\b` }, short: 'Yaş “var” ilə yox, I’m ilə deyilir.',
    explain: ex("I'm twenty-five.", '“25 yaşım var” sözbəsöz tərcümə olunmur — ingiliscə yaşı I’m ilə deyirik.', "I'm twenty-five. — düzdür; “yaşım var” kimi tərcümə — olmur.", "How old are you? — I'm thirty.") },
  { match: { pattern: String.raw`\byears?\b(?!\s+old)` }, short: 'Yaşı demək kifayətdir.',
    explain: ex("I'm twenty-five.", 'Yaşdan sonra o söz tək qalmır — yaşı demək kifayətdir.', "I'm twenty-five. — düzdür; yaşdan sonra yarımçıq əlavə — olmur.", "How old are you? — I'm thirty.") },
];
export const PHONE_MISTAKES: Variant[] = [
  { match: { pattern: String.raw`\bmy phone is\b|\bnumber phone\b` }, short: 'Nömrə “phone number”dur.',
    explain: ex("It's 050 321 45 67.", 'Telefonun özü yox, nömrəsi deyilir; söz sırası da “phone number”dur.', "My phone number is … — düzdür; My phone is … — olmur.", "What's your phone number? — It's 050 321 45 67.") },
];
