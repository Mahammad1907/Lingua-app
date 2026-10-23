import { isSafeEnglishTypo, normalizeApostrophes } from './spelling';

export type VoiceIntent = 'greeting' | 'introduce' | 'ask_name' | 'meet' | 'feeling' |
  'positive_feeling' | 'feeling_return' | 'ask_feeling' | 'thanks' | 'apology' | 'attention' | 'repeat' |
  'slow' | 'repeat_slow' | 'farewell';
export interface SpokenVerdict { correct: boolean; message: string; countAsAttempt?: boolean }

export function normalizeSpeech(text: string): string {
  return normalizeApostrophes(text).toLowerCase()
    .replace(/\bi'?m\b/g, 'i am').replace(/\bname'?s\b/g, 'name is')
    .replace(/\bwhat'?s\b/g, 'what is').replace(/[.!?,;:“”"]/g, '')
    .replace(/\s+/g, ' ').trim();
}
const forbiddenNameWords = new Set(('from in at not fine good well okay ok tired happy sad great hungry sick sorry ' +
  'a an the student teacher years old live living feeling am is are i my name your you thanks thank and very').split(' '));
export function isPlausibleName(text: string): boolean {
  const parts = normalizeSpeech(text).split(' ');
  return parts.length > 0 && parts.length <= 4 && parts.every((part) =>
    /^[\p{L}][\p{L}'-]*$/u.test(part) && !forbiddenNameWords.has(part));
}
export function checkSpokenAnswer(text: string, intent: VoiceIntent, name = ''): SpokenVerdict {
  const input = normalizeSpeech(text);
  if (!input) return { correct: false, countAsAttempt: false, message: 'Cavab alınmadı. Yenidən cəhd et; bu, dil səhvi sayılmır.' };
  let correct = false;
  switch (intent) {
    case 'greeting': correct = /^(hi|hey|hello(?: there)?|good morning|good afternoon|good evening)( birfox)?$/.test(input); break;
    case 'introduce': {
      const introduction = input.replace(/^(hi|hello)( birfox)? /, '');
      const match = /^(?:i am|my name is) (.+)$/.exec(introduction);
      correct = Boolean(match && isPlausibleName(match[1]) && (!name || normalizeSpeech(match[1]) === normalizeSpeech(name)));
      break;
    }
    case 'ask_name': correct = /^what is your name( please)?$/.test(input); break;
    case 'meet': correct = /^nice to meet you( too)?$/.test(input); break;
    case 'feeling':
      correct = /^(?:(?:i am|i feel|i am feeling) (?:(?:not|very|a bit) )?)?(fine|good|well|okay|ok|tired|happy|sad|great|hungry|sick|bad)( thank you| thanks)?( and you| how are you)?$/.test(input);
      break;
    case 'feeling_return': correct = checkSpokenAnswer(input, 'feeling').correct && / (and you|how are you)$/.test(input); break;
    case 'positive_feeling': correct = /^(?:(?:i am|i feel|i am feeling) (?:very )?)?(fine|good|well|great)( thank you| thanks)?$/.test(input); break;
    case 'ask_feeling': correct = /^how are you(?: doing| today)?$/.test(input); break;
    case 'thanks': correct = /^(thank you( very much| so much)?|thanks( a lot)?|many thanks)$/.test(input); break;
    case 'apology': correct = /^(i am( very)? )?sorry$/.test(input); break;
    case 'attention': correct = /^excuse me( please)?$/.test(input); break;
    case 'repeat': correct = /^(pardon|say (?:it|that) again(?: please)?|repeat(?: (?:it|that))?(?: please)?|again please|please (?:repeat(?: (?:that|it))?|say (?:it|that) again)|(?:(?:can|could) you )(?:repeat(?: (?:that|it))?|say (?:it|that) again)( please)?|sorry (?:can|could) you (?:repeat(?: (?:that|it))?|say (?:it|that) again)( please)?)$/.test(input); break;
    case 'slow': correct = /^(slower please|more slowly please|slow please|slowly please|please speak (?:more )?slowly|(?:can|could) you speak (?:more )?slowly(?: please)?|speak (?:more )?slowly(?: please)?)$/.test(input); break;
    case 'repeat_slow':
      correct = /^(?:again (?:more )?slowly(?: please)?|(?:please )?(?:say (?:it|that) again|repeat(?: (?:it|that))?) (?:more )?slowly(?: please)?)$/.test(input) ||
        (input.includes(' and ') && input.split(' and ').length === 2 && input.split(' and ').some((part) => checkSpokenAnswer(part, 'repeat').correct) && input.split(' and ').some((part) => checkSpokenAnswer(part, 'slow').correct)) ||
        /^(?:(?:can|could) you |please )?(?:say (?:it|that) again|repeat(?: (?:it|that))?)(?: and (?:speak|say it))? (?:more )?slowly(?: please)?$/.test(input) ||
        /^(?:(?:can|could) you |please )?(?:repeat(?: (?:it|that))?|say (?:it|that) again)(?: please)? and (?:(?:can|could) you |please )?speak (?:more )?slowly(?: please)?$/.test(input);
      break;
    case 'farewell': correct = /^(bye(?: bye)?|good ?bye|see you(?: later)?|good night)(?: birfox)?(?: see you(?: later)?)?$/.test(input); break;
  }
  const messages: Record<VoiceIntent, string> = {
    greeting: 'Burada salam vermək lazımdır: Hello və ya Hi.',
    introduce: name ? `Bu rolda ad ${name} olmalıdır. I’m və ya My name is ilə həmin adı de.` : 'Burada adını demək lazımdır: I’m və ya My name is + ad. Ölkə və hal haqqında məlumat ad deyil.',
    ask_name: 'Adını soruşmaq üçün What’s your name? de. My mənim, your isə sənin deməkdir.',
    meet: 'Tanış olduğuna şad olduğunu Nice to meet you ilə bildir.',
    feeling: 'Özünü necə hiss etdiyini de. Müsbət, normal və mənfi hal bildirən uyğun cavablar mümkündür.',
    feeling_return: 'Əvvəl halını de, sonra And you? və ya How are you? ilə sualı BirFox-a qaytar.',
    positive_feeling: 'Tapşırıq yaxşı olduğunu deməyi tələb edir. Not mənanı inkar edir; I’m not good uyğun deyil.',
    ask_feeling: 'Tam sual tələb olunur: How are you? And you? yalnız əvvəlki sualı qarşı tərəfə qaytarır.',
    thanks: 'Köməyə görə təşəkkür et: Thank you və ya Thanks.',
    apology: 'Kiçik səhvə görə üzr istə: Sorry.',
    attention: 'Diqqət çəkmək üçün Excuse me de; bu vəziyyətdə təşəkkür tələb olunmur.',
    repeat: 'Deyiləni yenidən eşitmək üçün təkrar istə: Again, please və ya Could you say it again, please?',
    slow: 'Danışıq sürətini azaltmağı istə: Slowly, please və ya Please speak slowly.',
    repeat_slow: 'Hər iki istək lazımdır: deyiləni təkrar etmək və yavaş danışmaq. Təkcə Slowly, please kifayət deyil.',
    farewell: 'Söhbət bitir. Bye, Goodbye və ya See you ilə sağollaş.',
  };
  return { correct, message: correct ? 'Cavabın bu tapşırığa uyğundur.' : messages[intent] };
}

// A recognized proper name can differ even when the spoken language is valid.
// Written role answers still use checkSpokenAnswer and keep the assigned name.
export function checkRecognizedAnswer(text: string, intent: VoiceIntent, name = ''): SpokenVerdict {
  const verdict = checkSpokenAnswer(text, intent, name);
  if (!verdict.correct && intent === 'introduce' && name && checkSpokenAnswer(text, intent).correct) {
    return { correct: false, countAsAttempt: false, message: 'Eşidilən ad yazdığın ada uyğun gəlmədi. Səs tanıma adını fərqli eşidə bilər; mətni yoxlayıb yenidən danış. Bu, dil səhvi kimi hesablanmır.' };
  }
  return verdict;
}

// Only written input gets spelling tolerance. Speech transcripts remain semantic evidence.
export const writtenIntentWords: Record<VoiceIntent, string[]> = {
  greeting: ['hello', 'there', 'good', 'morning', 'afternoon', 'evening'],
  introduce: ['name'], ask_name: ['what', 'your', 'name', 'please'],
  meet: ['nice', 'meet'],
  feeling: ['feeling', 'very', 'fine', 'good', 'well', 'okay', 'tired', 'happy', 'great', 'hungry', 'sick', 'thank', 'thanks', 'how'],
  positive_feeling: ['feeling', 'very', 'fine', 'good', 'well', 'great', 'thank', 'thanks'],
  feeling_return: ['feeling', 'very', 'fine', 'good', 'well', 'okay', 'tired', 'happy', 'great', 'hungry', 'sick', 'thank', 'thanks', 'your'],
  ask_feeling: ['doing', 'today'], thanks: ['thank', 'thanks', 'very', 'much', 'many'],
  apology: ['sorry', 'very'], attention: ['excuse', 'please'],
  repeat: ['again', 'please', 'repeat', 'that', 'could', 'sorry', 'pardon'],
  slow: ['slowly', 'slower', 'please', 'speak', 'more', 'could'],
  repeat_slow: ['again', 'please', 'repeat', 'that', 'could', 'slowly', 'slower', 'speak', 'more'],
  farewell: ['goodbye', 'good', 'night', 'later'],
};
export function checkWrittenIntentAnswer(text: string, intent: VoiceIntent, name = ''): SpokenVerdict {
  const verdict = checkSpokenAnswer(text, intent, name);
  if (verdict.correct) return verdict;
  const tokens = normalizeSpeech(text).split(' ');
  const options = tokens.map((token) => [token, ...writtenIntentWords[intent].filter((word) => isSafeEnglishTypo(token, word))]);
  let attempts = 0;
  const visit = (index: number, words: string[]): boolean => {
    if (++attempts > 512) return false;
    if (index === options.length) return checkSpokenAnswer(words.join(' '), intent, name).correct;
    return options[index].some((word) => visit(index + 1, [...words, word]));
  };
  return visit(0, []) ? { correct: true, message: 'Məna düzgündür. Bir hərflik yazı səhvi cavabını səhv etmir.' } : verdict;
}
