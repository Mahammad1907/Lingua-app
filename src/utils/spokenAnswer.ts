import { normalizeApostrophes } from './spelling';
export type VoiceIntent = 'greeting' | 'introduce' | 'meet' | 'feeling' | 'repeat' | 'farewell';
export interface SpokenVerdict { correct: boolean; message: string; countAsAttempt?: boolean }

export function normalizeSpeech(text: string): string {
  return normalizeApostrophes(text).toLowerCase().replace(/[‘’]/g, "'")
    .replace(/\bi['’]?m\b/g, 'i am').replace(/\bname['’]s\b/g, 'name is')
    .replace(/[.!?,;:“”"]/g, '').replace(/\s+/g, ' ').trim();
}
export function checkSpokenAnswer(text: string, intent: VoiceIntent, name = ''): SpokenVerdict {
  const input = normalizeSpeech(text);
  if (!input) return { correct: false, countAsAttempt: false, message: 'Səsin mətni alınmadı. Yenidən danış; səhv kimi hesablanmır.' };
  let correct = false;
  switch (intent) {
    case 'greeting':
      correct = /^(hi|hello|hey|good morning|good afternoon|good evening)( birfox)?$/.test(input);
      break;
    case 'introduce': {
      const expected = normalizeSpeech(name);
      const introduction = input.replace(/^(hi|hello)( birfox)? /, '');
      correct = Boolean(expected) && [`i am ${expected}`, `my name is ${expected}`].includes(introduction);
      if (!correct && /^(i am|my name is) /.test(introduction)) {
        return { correct: false, countAsAttempt: false, message: 'Eşidilən ad yazdığın ada uyğun gəlmədi. Səs tanıma adını səhv eşidə bilər; yoxlayıb yenidən danış.' };
      }
      break;
    }
    case 'meet': correct = /^(nice|pleased) to meet you( too)?$/.test(input); break;
    case 'feeling':
      correct = /^(?:(?:i am|i feel|i am feeling) (?:(?:not|very|a bit) )?)?(fine|good|well|okay|ok|tired|happy|sad|great|hungry)( thank you| thanks)?( and you| how are you)?$/.test(input);
      break;
    case 'repeat':
      correct = /^(again please|please repeat( that)?|can you repeat( that)?( please)?|could you repeat( that)?( please)?|sorry can you repeat( that)?|pardon|sorry)$/.test(input);
      break;
    case 'farewell':
      correct = /^(bye|goodbye|see you( later)?|take care|good night)( birfox)?$/.test(input);
      break;
  }
  const messages: Record<VoiceIntent, string> = {
    greeting: 'Burada salam vermək lazımdır. Eşidilən mətni yoxla və yenidən danış.',
    introduce: 'Eşidilən təqdimat yazdığın ada uyğun gəlmədi. Mətni yoxla; I’m və ya My name is ilə adını de.',
    meet: 'Tanış olduğuna şad olduğunu bildir. Eşidilən mətni yoxla və yenidən danış.',
    feeling: 'Bu sual halını soruşur. Eşidilən mətni yoxla və özünü necə hiss etdiyini de.',
    repeat: 'Qarşı tərəfdən deyiləni təkrar etməsini istə.',
    farewell: 'Söhbət bitir. Sağollaşma ifadəsi işlət.',
  };
  return { correct, message: correct ? 'Cavabın bu tapşırığa uyğundur.' : messages[intent] };
}
