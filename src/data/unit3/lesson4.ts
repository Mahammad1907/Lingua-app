// Bölmə 3 · Dərs 4 — Sən …-dansan? 1-ci hissə: Are you from …? · Yes, I am.; 2-ci hissə (lesson4_2): No, I'm not. · Really?
// Hostelin mətbəxi, qatar. Bəli/xeyr sualı və qısa cavab. Tipik səhvlər: “Do you from…?”, “You are from…?”, “Yes, I'm.”, “No, I not.”
// Spiral: Where are you from? I'm from … Me too. (Dərs 1), ölkələr (Dərs 2), millətlər (Dərs 3), Nice to meet you.
import type { DesignLesson, Variant } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, resultTexts, said } from './shared';

const PLACE = String.raw`(?:the\s+)?\p{L}[\p{L}'’-]*(?:\s+\p{L}[\p{L}'’-]*){0,2}`;
/** “No, I'm not.” — optionally followed by where the learner is from. “No, I not.” is not accepted. */
const NO_NOT = String.raw`^no\s*,?\s*i(?:'m|’m|\s+am)\s+not\s*[.!]?(?:\s*(?:i'?m|i am)\s+from\s+${PLACE}\s*[.!]?)?$`;
/** “Are you from <country>?” for a fixed country. */
const areYouFrom = (country: string) => said(String.raw`^are\s+you\s+from\s+${country}\s*\??$`, `Are you from ${country.replace(/\\s\+/g, ' ')}?`);

/** “Yes, I am.” — optionally followed by where the learner is from. “Yes, I'm.” is not accepted. */
const YES_AM = String.raw`^yes\s*,?\s*i\s+am\s*[.!]?(?:\s*(?:i'?m|i am)\s+(?:from\s+)?${PLACE}\s*[.!]?)?$`;
const YES_MISTAKES = (example: string): Variant[] => [
  { match: { pattern: String.raw`^yes\s*,?\s*i(?:'m|’m)\s*[.!]?$` }, short: 'Qısa cavabın sonunda I\'m olmur.',
    explain: ex('Yes, I am.', 'Cavab I-la bitəndə am qısalmır, ayrıca deyilir.', "Yes, I am. — düzdür; Yes, I'm. — olmur.", example) },
  { match: { pattern: String.raw`^yes\s*,?\s*you\b` }, short: 'Sual sənə verilib — özün haqqında cavab ver.',
    explain: ex('Yes, I am.', 'Sual “sən” haqqındadır; cavabda “mən” deyirsən: I am.', 'Yes, I am. — mən; Yes, you are. — sən.', example) },
  { match: { pattern: String.raw`^no\b` }, short: 'Sən oradansan — cavab “bəli”dir.',
    explain: ex('Yes, I am.', 'Sual düz yeri soruşur; “bəli” cavabı lazımdır.', "Yes, I am. — düzdür; Yes, I'm. — olmur.", example) },
];

const NO_MISTAKES: Variant[] = [
  { match: { pattern: String.raw`^no\s*,?\s*i\s+not\b` }, short: 'not-dan əvvəl am lazımdır.',
    explain: ex("No, I'm not.", 'Azərbaycancada “deyiləm” bir sözdür, ingiliscə I-dan sonra am, sonra not gəlir.', "No, I'm not. — düzdür; No, I not. — olmur.", "Are you from Turkey? — No, I'm not.") },
  { match: { pattern: String.raw`^yes\b` }, short: 'Sən oradan deyilsən — cavab “yox”dur.',
    explain: ex("No, I'm not.", 'Sual səhv ölkəni soruşur; “yox” cavabı lazımdır.', "Yes, I am. — bəli; No, I'm not. — xeyr.", "Are you from Turkey? — No, I'm not.") },
];
const QUESTION_MISTAKES: Variant[] = [
  { match: { pattern: String.raw`^do\s+you\s+from\b` }, short: 'Bu sual do ilə yox, are ilə başlayır.',
    explain: ex('Are you from Georgia?', 'from olan sualda do yoxdur: are ilə başlayır.', 'Are you from Georgia? — düzdür; Do you from Georgia? — olmur.', 'Are you from Turkey?') },
  { match: { pattern: String.raw`^you\s+are\s+from\b` }, short: 'Sualda are önə keçir.',
    explain: ex('Are you from Georgia?', 'Azərbaycancada sual səslə qurulur, ingiliscə are cümlənin əvvəlinə keçir.', "Are you from Georgia? — sual; You're from Georgia. — cümlə.", 'Are you from Turkey?') },
];

export const lesson4: DesignLesson = {
  id: 'a1_en_b3_d4', order: 48, unit: 3, number: 4, part: 1, title: 'Sən [ölkə]-dansan?', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d4_c01', badge: 'Haradansan', subtitle: 'Hostelin mətbəxində yeni tanışlarla “Sən [ölkə]-dansan?” deyə soruşub qısa cavab verirsən.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: '“Sən [ölkə]-dansan?” sualını eşidib anlaya bilirəm.' },
        { icon: 'wave', text: '“Bəli” ilə qısa cavab verə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u3d4_c02', number: 2, scenes: ['u3/hostel-kitchen'],
      word: 'Are you from [ölkə]?', pronunciation: '/ɑr ju frʌm/', reading: 'ar yu fram [ölkə]?', az: 'Sən [ölkə]-dansan?',
      structure: ['Are you from + ölkə?'],
      notes: ['Sual are ilə başlayır.'],
      example: 'Are you from Turkey?', exampleAz: 'Sən Türkiyədənsən?',
    },
    {
      type: 'choice', id: 'u3d4_c03', number: 3, title: 'Sözü tamamla', why: 'Haradan olduğunu soruşanda ölkədən əvvəl from gəlir.', hint: 'Ölkədən əvvəl hansı söz “-dan” mənasını verir?',
      prompt: 'Hostelin mətbəxində yeni tanış sənin pasportunu görür və soruşur.\nHansı söz çatmır?', gap: { speaker: 'other', before: 'Are you', after: 'Azerbaijan?' },
      options: ['from', 'is', 'do'], answer: 'from',
      variants: [
        pick('is', 'you ilə is işlənmir; burada from lazımdır.', ex('from', 'Ölkədən əvvəl “-dan” mənasını from verir.', 'Are you from Azerbaijan? — haradan; Are you Azerbaijani? — millət.', 'Are you from Azerbaijan?')),
        pick('do', '“Do you from…?” olmur.', ex('from', 'Bu sual are ilə başlayır, do lazım deyil; ölkədən əvvəl from gəlir.', 'Are you from Azerbaijan? — düzdür; Do you from Azerbaijan? — olmur.', 'Are you from Azerbaijan?')),
      ],
      review: {
        title: 'Sözü tamamla', why: 'Haradan olduğunu soruşanda ölkədən əvvəl from gəlir.', hint: 'Ölkədən əvvəl hansı söz “-dan” mənasını verir?',
        prompt: 'Qatarda qonşu sərnişin sənin Gürcüstan bayraqlı çantanı görür və soruşur.\nHansı söz çatmır?', gap: { speaker: 'other', before: 'Are you', after: 'Georgia?' },
        options: ['do', 'from', 'is'], answer: 'from',
        variants: [
          pick('is', 'you ilə is işlənmir; burada from lazımdır.', ex('from', 'Ölkədən əvvəl “-dan” mənasını from verir.', 'Are you from Georgia? — haradan; Are you Georgian? — millət.', 'Are you from Georgia?')),
          pick('do', '“Do you from…?” olmur.', ex('from', 'Bu sual are ilə başlayır, do lazım deyil; ölkədən əvvəl from gəlir.', 'Are you from Georgia? — düzdür; Do you from Georgia? — olmur.', 'Are you from Georgia?')),
        ],
      },
    },
    {
      type: 'word', id: 'u3d4_c04', number: 4, scenes: ['mascot/happy'],
      word: 'Yes, I am.', pronunciation: '/jɛs aɪ æm/', reading: 'yes, ay əm', az: 'Bəli, eləyəm.',
      structure: ['Are you [millət]? — Yes, I am.'],
      notes: ['Qısa cavabın sonunda I am qısalmır.'],
      example: 'Are you from Azerbaijan? — Yes, I am.', exampleAz: 'Sən Azərbaycandansan? — Bəli, eləyəm.',
    },
    {
      type: 'choice', id: 'u3d4_c05', number: 5, title: 'Seçim', why: 'Qısa cavab I am ilə bitir: Yes, I am.', hint: 'Cavabın sonuna qulaq as: sözlər ayrı deyilir, yoxsa bitişik?',
      prompt: 'Hostelin mətbəxində yeni tanış soruşur: “Are you from Azerbaijan?”\nSən Azərbaycandansan. Hansı cavab düzdür?',
      options: ['Yes, I am.', "Yes, I'm.", 'Yes, you are.'], answer: 'Yes, I am.',
      variants: [
        pick("Yes, I'm.", 'Qısa cavabın sonunda I\'m olmur.', ex('Yes, I am.', 'Cavab I-la bitəndə am qısalmır, ayrıca deyilir.', "Yes, I am. — düzdür; Yes, I'm. — olmur.", 'Are you from Azerbaijan? — Yes, I am.')),
        pick('Yes, you are.', 'Sual sənə verilib — özün haqqında cavab ver.', ex('Yes, I am.', 'Sual “sən” haqqındadır; cavabda “mən” deyirsən: I am.', 'Yes, I am. — mən; Yes, you are. — sən.', 'Are you from Azerbaijan? — Yes, I am.')),
      ],
      review: {
        title: 'Seçim', why: 'Qısa cavab I am ilə bitir: Yes, I am.', hint: 'Sual kimin haqqındadır — sənin, yoxsa onun?',
        prompt: 'Qatarda qonşu sərnişin soruşur: “Are you Azerbaijani?”\nSən azərbaycanlısan. Hansı cavab düzdür?',
        options: ['Yes, you are.', 'Yes, I am.', "Yes, I'm."], answer: 'Yes, I am.',
        variants: [
          pick("Yes, I'm.", 'Qısa cavabın sonunda I\'m olmur.', ex('Yes, I am.', 'Cavab I-la bitəndə am qısalmır, ayrıca deyilir.', "Yes, I am. — düzdür; Yes, I'm. — olmur.", 'Are you Azerbaijani? — Yes, I am.')),
          pick('Yes, you are.', 'Sual sənə verilib — özün haqqında cavab ver.', ex('Yes, I am.', 'Sual “sən” haqqındadır; cavabda “mən” deyirsən: I am.', 'Yes, I am. — mən; Yes, you are. — sən.', 'Are you Azerbaijani? — Yes, I am.')),
        ],
      },
    },
    {
      type: 'match', id: 'u3d4_c14', number: 6, title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Əvvəl “haradan?” sualını “[ölkə]-dansan?” sualından ayır.',
      prompt: 'Hostelin mətbəxində söhbət.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'Are you from Turkey?', az: 'Sən Türkiyədənsən?', from: 'other' }, { en: 'Yes, I am.', az: 'Bəli, eləyəm.', from: 'G' }, { en: 'Where are you from?', az: 'Haradansan?', from: 'B' }],
      extra: ['Türkəm.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex('Are you from Turkey? — Sən Türkiyədənsən?; Yes, I am. — Bəli, eləyəm.; Where are you from? — Haradansan?', '“[ölkə]-dansan?” sualı are ilə başlayır, “haradan?” sualı where ilə.', 'Are you from Turkey? — bəli/xeyr sualı; Where are you from? — haradan?', 'Are you from Turkey? — Yes, I am.'))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Ölkə olan sualı millət olan sualdan ayır.',
        prompt: 'Qatarda söhbət.\nHər cümləyə mənasını qoş.',
        rows: [{ en: 'Are you Azerbaijani?', az: 'Sən azərbaycanlısan?', from: 'other' }, { en: "I'm from Georgia.", az: 'Gürcüstandanam.', from: 'G' }, { en: 'Are you from Georgia?', az: 'Sən Gürcüstandansan?', from: 'B' }],
        extra: ['Bəli, eləyəm.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("Are you Azerbaijani? — Sən azərbaycanlısan?; I'm from Georgia. — Gürcüstandanam.; Are you from Georgia? — Sən Gürcüstandansan?", 'Sual are ilə başlayır; from olan sual ölkəni, from-suz sual milləti soruşur.', 'Are you from Georgia? — ölkə; Are you Azerbaijani? — millət.', 'Are you from Georgia? — Yes, I am.'))],
      },
    },
    {
      type: 'write', id: 'u3d4_c15', number: 7, title: 'Dialoqu tamamla', why: 'Qısa “bəli” cavabı yazdın: Yes, I am.', hint: 'Sən oradansan — bu dərsin “bəli” cavabını xatırla.',
      prompt: 'Hostelin çatında yeni tanış yazır. Sən Bakıdansan.\nQısa cavab yaz.', placeholder: 'Cavabın',
      chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: 'Are you from Baku?' }], reply: 'Me too!' },
      rule: said(YES_AM, 'Yes, I am.'),
      variants: [...YES_MISTAKES('Are you from Baku? — Yes, I am.'), other('Yes, I am.', ex('Yes, I am.', 'Sual bəli/xeyr sualıdır; sən Bakıdansan — qısa “bəli” cavabı.', "Yes, I am. — düzdür; Yes, I'm. — olmur.", 'Are you from Baku? — Yes, I am.'))],
      review: {
        title: 'Dialoqu tamamla', why: 'Qısa “bəli” cavabı yazdın: Yes, I am.', hint: 'Sən elə millətdənsən — bu dərsin “bəli” cavabını xatırla.',
        prompt: 'Dil klubunun çatında iş yoldaşın yazır. Sən azərbaycanlısan.\nQısa cavab yaz.', placeholder: 'Cavabın',
        chat: { partner: 'İş yoldaşı', from: 'G', lines: [{ from: 'G', text: 'Are you Azerbaijani?' }], reply: 'Me too!' },
        rule: said(YES_AM, 'Yes, I am.'),
        variants: [...YES_MISTAKES('Are you Azerbaijani? — Yes, I am.'), other('Yes, I am.', ex('Yes, I am.', 'Sual bəli/xeyr sualıdır; sən azərbaycanlısan — qısa “bəli” cavabı.', "Yes, I am. — düzdür; Yes, I'm. — olmur.", 'Are you Azerbaijani? — Yes, I am.'))],
      },
    },
    {
      type: 'voice', id: 'u3d4_c16', number: 8, title: 'Səslə cavab', why: 'Qısa “bəli” cavabı verdin: Yes, I am.', hint: 'Sən oradansan — cavabın sonunda iki söz ayrı deyilir.',
      prompt: 'Qatarda yanındakı sərnişin pasportuna baxıb soruşur. Sən Azərbaycandansan.\nQısa cavab ver.', audio: 'Are you from Azerbaijan?', reply: 'Nice to meet you!',
      rule: said(YES_AM, 'Yes, I am.'),
      variants: [...YES_MISTAKES('Are you from Azerbaijan? — Yes, I am.'), other('Yes, I am.', ex('Yes, I am.', 'Sual bəli/xeyr sualıdır; sən Azərbaycandansan — qısa “bəli” cavabı.', "Yes, I am. — düzdür; Yes, I'm. — olmur.", 'Are you from Azerbaijan? — Yes, I am.'))],
      review: {
        title: 'Səslə cavab', why: 'Qısa “bəli” cavabı verdin: Yes, I am.', hint: 'Sən elə millətdənsən — cavabın sonunda iki söz ayrı deyilir.',
        prompt: 'Hostelin resepsiyasında işçi soruşur. Sən azərbaycanlısan.\nQısa cavab ver.', audio: 'Are you Azerbaijani?', reply: 'Thank you!',
        rule: said(YES_AM, 'Yes, I am.'),
        variants: [...YES_MISTAKES('Are you Azerbaijani? — Yes, I am.'), other('Yes, I am.', ex('Yes, I am.', 'Sual bəli/xeyr sualıdır; sən azərbaycanlısan — qısa “bəli” cavabı.', "Yes, I am. — düzdür; Yes, I'm. — olmur.", 'Are you Azerbaijani? — Yes, I am.'))],
      },
    },
  ],
  result: {
    done: ['Dərs 4 · 1-ci hissə tamamlandı', 'Artıq “Sən [ölkə]-dansan?” sualını anlayır və “bəli” ilə qısa cavab verirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Bəli/xeyr sualını və “bəli” cavabını anlamaq', tasks: ['u3d4_c03', 'u3d4_c05', 'u3d4_c14'] },
      { group: 'Yazı', text: 'Qısa “bəli” cavabı yazmaq', tasks: ['u3d4_c15'] },
      { group: 'Danışıq', text: 'Qısa “bəli” cavabı vermək', tasks: ['u3d4_c16'] },
    ],
    closing: 'Növbəti hissə — “xeyr” cavabı və təəccüb.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'Are you from [ölkə]?', translation: 'Sən [ölkə]-dansan?', example: 'Are you from Turkey?', exampleAz: 'Sən Türkiyədənsən?', usageNote: 'Are you from + ölkə?', pronunciation: '/ɑr ju frʌm/', teachCard: 'u3d4_c02' },
    { word: 'Yes, I am.', translation: 'Bəli, eləyəm.', example: 'Are you from Azerbaijan? — Yes, I am.', exampleAz: 'Sən Azərbaycandansan? — Bəli, eləyəm.', usageNote: 'Qısa cavabda I am qısalmır.', pronunciation: '/jɛs aɪ æm/', teachCard: 'u3d4_c04' },
  ],
};

// Dərs 4 · 2-ci hissə (26 Nov 2026: the lesson was split, nothing removed): No, I'm not. · Really?
export const lesson4_2: DesignLesson = {
  id: 'a1_en_b3_d4_2', order: 49, unit: 3, number: 4, part: 2, title: 'Sən [ölkə]-dansan?', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d4_c20', badge: 'Haradansan', subtitle: 'Hostelin mətbəxində və qatarda “xeyr” deyir, təəccübünü bildirir, özün də soruşursan.', start: 'Dərsə başla',
      goals: [
        { icon: 'wave', text: '“Xeyr” ilə qısa cavab verə bilirəm.' },
        { icon: 'chat', text: 'Təəccübümü bildirə bilirəm.' },
        { icon: 'bye', text: 'Bir ölkədən olub-olmadığını soruşa bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u3d4_c06', number: 6, scenes: ['mascot/think'],
      word: "No, I'm not.", pronunciation: '/noʊ aɪm nɑt/', reading: 'nou, aym nat', az: 'Xeyr, deyiləm.',
      structure: ["Are you [millət]? — No, I'm not."],
      notes: ['I’m not — burada not am-dan sonra gəlir.'],
      example: "Are you from Russia? — No, I'm not.", exampleAz: 'Sən Rusiyadansan? — Xeyr, deyiləm.',
    },
    {
      type: 'voice', id: 'u3d4_c07', number: 7, title: 'Səslə cavab', why: "Qısa “xeyr” cavabı verdin: No, I'm not.", hint: 'Sən o ölkədən deyilsən — bu dərsin “xeyr” cavabını xatırla.',
      prompt: 'Hostelin mətbəxində yeni tanış soruşur.\nSən Türkiyədən deyilsən. Qısa cavab ver.', audio: 'Are you from Turkey?', reply: 'OK! Where are you from?',
      rule: said(NO_NOT, "No, I'm not."),
      variants: [...NO_MISTAKES, other("No, I'm not.", ex("No, I'm not.", 'Sual bəli/xeyr sualıdır; qısa “xeyr” cavabı lazımdır.', "Yes, I am. — bəli; No, I'm not. — xeyr.", "Are you from Turkey? — No, I'm not."))],
      review: {
        title: 'Səslə cavab', why: "Qısa “xeyr” cavabı verdin: No, I'm not.", hint: 'Sən o ölkədən deyilsən — “xeyr” cavabını xatırla.',
        prompt: 'Qatarda qonşu sərnişin soruşur.\nSən İrandan deyilsən. Qısa cavab ver.', audio: 'Are you from Iran?', reply: 'OK! Where are you from?',
        rule: said(NO_NOT, "No, I'm not."),
        variants: [...NO_MISTAKES, other("No, I'm not.", ex("No, I'm not.", 'Sual bəli/xeyr sualıdır; qısa “xeyr” cavabı lazımdır.', "Yes, I am. — bəli; No, I'm not. — xeyr.", "Are you from Iran? — No, I'm not."))],
      },
    },
    {
      type: 'word', id: 'u3d4_c08', number: 8, scenes: ['mascot/ask'],
      word: 'Really?', pronunciation: '/ˈriəli/', reading: 'riəli?', az: 'Doğrudan?',
      notes: ['Təəccüb edəndə səsin sonda yuxarı qalxır.'],
      example: "I'm from the USA. — Really? Me too!", exampleAz: 'Mən ABŞ-danam. — Doğrudan? Mən də!',
    },
    {
      type: 'match', mode: 'reply', id: 'u3d4_c09', number: 9, title: 'Cavab cütü', why: 'Hər cümləyə uyğun cavabı tapdın.', hint: 'Əvvəl sualları ayır: biri “haradan?”, biri “[ölkə]-dansan?” soruşur.',
      prompt: 'Hostelin mətbəxində yeni tanışlar danışır.\nCümləyə toxun, sonra ona uyğun cavabı seç.',
      rows: [{ en: 'Where are you from?', az: "I'm from Ganja.", from: 'other' }, { en: "I'm from France.", az: 'Really? Me too!', from: 'other' }, { en: 'Are you from Russia?', az: "No, I'm not.", from: 'other' }],
      extra: ['Nice to meet you.'],
      variants: [other('Bir cavab yerində deyil.', ex("Where are you from? — I'm from Ganja.; I'm from France. — Really? Me too!; Are you from Russia? — No, I'm not.", '“Haradan?” sualına yer deyilir, “[ölkə]-dansan?” sualına bəli və ya xeyr.', "Where are you from? — I'm from Ganja. ; Are you from Russia? — No, I'm not.", 'Are you from Russia?'))],
      review: {
        title: 'Cavab cütü', why: 'Hər cümləyə uyğun cavabı tapdın.', hint: 'Əvvəl “[ölkə]-dansan?” sualını tap.',
        prompt: 'Qatarda sərnişinlər tanış olur.\nCümləyə toxun, sonra ona uyğun cavabı seç.',
        rows: [{ en: 'Are you from Georgia?', az: 'Yes, I am.', from: 'other' }, { en: "I'm from Iran.", az: 'Really?', from: 'other' }, { en: 'Where are you from?', az: "I'm from Baku.", from: 'other' }],
        extra: ['Thank you!'],
        variants: [other('Bir cavab yerində deyil.', ex("Are you from Georgia? — Yes, I am.; I'm from Iran. — Really?; Where are you from? — I'm from Baku.", '“Haradan?” sualına yer deyilir, “[ölkə]-dansan?” sualına bəli və ya xeyr.', "Where are you from? — I'm from Baku. ; Are you from Georgia? — Yes, I am.", 'Are you from Georgia?'))],
      },
    },
    {
      type: 'write', id: 'u3d4_c10', number: 10, title: 'Dialoqu tamamla', why: 'Təəccübünü bildirdin: Really?', hint: 'Təəccüb edəndə deyilən bu dərsin sözünü yaz.',
      prompt: 'Hostelin çatında Bakıdan olduğunu yazdın. Yeni tanış cavab yazır.\nTəəccübünü bildir.', placeholder: 'Cavabın',
      chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: "I'm from Baku too!" }] },
      rule: exact('Really?'),
      variants: [other('Really?', ex('Really?', 'Gözləmədiyin bir şey eşidəndə təəccüb bildirirsən.', 'Really? — təəccüb; Me too. — mən də.', "I'm from Baku too! — Really?"))],
      review: {
        title: 'Dialoqu tamamla', why: 'Təəccübünü bildirdin: Really?', hint: 'Təəccüb edəndə deyilən bu dərsin sözünü yaz.',
        prompt: 'Qatarda tanış olduğun adama mesajda Gəncədən olduğunu yazdın. O cavab yazır.\nTəəccübünü bildir.', placeholder: 'Cavabın',
        chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: "I'm from Ganja too!" }] },
        rule: exact('Really?'),
        variants: [other('Really?', ex('Really?', 'Gözləmədiyin bir şey eşidəndə təəccüb bildirirsən.', 'Really? — təəccüb; Me too. — mən də.', "I'm from Ganja too! — Really?"))],
      },
    },
    {
      type: 'write', id: 'u3d4_c11', number: 11, title: 'Mesaj yaz', why: 'Sual are ilə başlayır: Are you from Turkey?', hint: 'Sual bu dərsin ilk kartındakı kimi başlayır.',
      prompt: 'Yeni tanış türk çayından yazır.\nSözlərdən sual qur: “Sən Türkiyədənsən?”', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: 'Tea?' }] },
      tiles: ['Are', 'you', 'from', 'Turkey', '?', 'Do', 'is'], rule: exact('Are you from Turkey?'),
      variants: [...QUESTION_MISTAKES, other('Sıra: Are you from Turkey?', ex('Are you from Turkey?', 'Sual are ilə başlayır, sonra you, from və ölkə.', 'Are you from Turkey? — sual; Where are you from? — haradan?', 'Are you from Turkey?'))],
      review: {
        title: 'Mesaj yaz', why: 'Sual are ilə başlayır: Are you from Russia?', hint: 'Sual bu dərsin ilk kartındakı kimi başlayır.',
        prompt: 'Yeni tanış Moskvanın şəklini paylaşıb.\nSözlərdən sual qur: “Sən Rusiyadansan?”', placeholder: 'Sözlərə toxun',
        chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: '📷' }, { from: 'other', text: 'Hello!' }] },
        tiles: ['Russia', 'you', 'Do', 'Are', 'from', '?', 'at'], rule: exact('Are you from Russia?'),
        variants: [...QUESTION_MISTAKES, other('Sıra: Are you from Russia?', ex('Are you from Russia?', 'Sual are ilə başlayır, sonra you, from və ölkə.', 'Are you from Russia? — sual; Where are you from? — haradan?', 'Are you from Russia?'))],
      },
    },
    {
      type: 'voice', id: 'u3d4_c12', number: 12, title: 'Səslə soruş', why: 'Bəli/xeyr sualı verdin: Are you from Georgia?', hint: 'Sual bu dərsin ilk kartındakı kimi başlayır.',
      prompt: 'Qatarda yanındakı sərnişinin çantasında Gürcüstan bayrağı var.\nOndan Gürcüstandan olub-olmadığını soruş.', reply: 'Yes, I am!',
      rule: areYouFrom('Georgia'),
      variants: [...QUESTION_MISTAKES, other('Are you from Georgia?', ex('Are you from Georgia?', 'Bəli/xeyr sualı are ilə başlayır, sonra you from və ölkə.', 'Are you from Georgia? — bəli/xeyr sualı; Where are you from? — haradan?', 'Are you from Georgia?'))],
      review: {
        title: 'Səslə soruş', why: 'Bəli/xeyr sualı verdin: Are you from Germany?', hint: 'Sual bu dərsin ilk kartındakı kimi başlayır.',
        prompt: 'Hostelin mətbəxində yeni tanış alman çörəyi bişirir.\nOndan Almaniyadan olub-olmadığını soruş.', reply: 'Yes, I am!',
        rule: areYouFrom('Germany'),
        variants: [...QUESTION_MISTAKES, other('Are you from Germany?', ex('Are you from Germany?', 'Bəli/xeyr sualı are ilə başlayır, sonra you from və ölkə.', 'Are you from Germany? — bəli/xeyr sualı; Where are you from? — haradan?', 'Are you from Germany?'))],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u3d4_c13', number: 13, title: 'Söhbəti sırala', why: 'Sual, xeyr cavabı, təəccüb və tanışlıq düz sıradadır.', hint: 'Əvvəl sual gəlir; təəccüb cavabdan sonra olur.',
      prompt: 'Hostelin mətbəxi.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: 'Hi! Are you from Turkey?', from: 'other' }, { en: '2', az: "No, I'm not. I'm from Azerbaijan.", from: 'B' }, { en: '3', az: 'Really? Me too!', from: 'other' }, { en: '4', az: 'Nice to meet you!', from: 'B' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hi! Are you from Turkey? → No, I'm not. I'm from Azerbaijan. → Really? Me too! → Nice to meet you!", 'Sual, xeyr cavabı, təəccüb, sonra tanışlıq.', "Are you from Turkey? — sual; No, I'm not. — cavab.", 'Hi! Are you from Turkey?'))],
      review: {
        title: 'Söhbəti sırala', why: 'Sual, bəli cavabı, təəccüb və tanışlıq düz sıradadır.', hint: 'Əvvəl sual gəlir; təəccüb cavabdan sonra olur.',
        prompt: 'Qatar vaqonu.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: 'Excuse me. Are you from Georgia?', from: 'G' }, { en: '2', az: 'Yes, I am. And you?', from: 'other' }, { en: '3', az: "I'm from Georgia too!", from: 'G' }, { en: '4', az: 'Really?', from: 'other' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Excuse me. Are you from Georgia? → Yes, I am. And you? → I'm from Georgia too! → Really?", 'Sual, bəli cavabı və geri sual, cavab, sonra təəccüb.', 'Are you from Georgia? — sual; Yes, I am. — cavab.', 'Excuse me. Are you from Georgia?'))],
      },
    },
  ],
  result: {
    done: ['Dərs 4 · 2-ci hissə tamamlandı', 'Artıq “Sən [ölkə]-dansan?” deyə soruşur, bəli və xeyr ilə qısa cavab verirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Bəli/xeyr sualını və cavablarını anlamaq', tasks: ['u3d4_c09', 'u3d4_c13'] },
      { group: 'Yazı', text: 'Bəli/xeyr sualı qurmaq və təəccüb bildirmək', tasks: ['u3d4_c10', 'u3d4_c11'] },
      { group: 'Danışıq', text: 'Qısa “xeyr” cavabı vermək və bəli/xeyr sualı soruşmaq', tasks: ['u3d4_c07', 'u3d4_c12'] },
    ],
    closing: 'Növbəti dərs — başqası haqqında: he və she.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: "No, I'm not.", translation: 'Xeyr, deyiləm.', example: "Are you from Russia? — No, I'm not.", exampleAz: 'Sən Rusiyadansan? — Xeyr, deyiləm.', usageNote: 'Qısa xeyr cavabı: No, I’m not.', pronunciation: '/noʊ aɪm nɑt/', teachCard: 'u3d4_c06' },
    { word: 'Really?', translation: 'Doğrudan?', example: "I'm from the USA. — Really? Me too!", exampleAz: 'Mən ABŞ-danam. — Doğrudan? Mən də!', usageNote: 'Təəccüb bildirir.', pronunciation: '/ˈriəli/', teachCard: 'u3d4_c08' },
  ],
};
