// Bölmə 3 · Dərs 3, 1-ci hissə — Millət (I'm Azerbaijani. · Turkish · Russian · Georgian).
// Pasport nəzarəti və hostel. Ölkə (from + ölkə) ilə millət (I'm + millət) fərqi. “Azeri” sözü işlənmir (qayda 20).
// Spiral: Where are you from? I'm from … Azerbaijan, Turkey, Russia, Georgia (Dərs 1–2), And you? Nice to meet you.
import type { DesignLesson, Variant } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { NATIONALITY, notices, own, resultTexts } from './shared';

const myNationality = own(NATIONALITY, "I'm Azerbaijani.");
/** Typical mistakes when the nationality is asked: a country name, or “from” + country. */
const NATIONALITY_MISTAKES: Variant[] = [
  { match: { pattern: String.raw`^(?:i'?m|i am)\s+(?!from\b)(?:azerbaijan|turkey|russia|georgia|iran|england|germany|france)\b` }, short: 'Ölkə yox, millət lazımdır.',
    explain: ex("I'm Azerbaijani.", 'Azerbaijan ölkədir; millət üçün sonu -i olan söz lazımdır.', "I'm Azerbaijani. — millət; I'm from Azerbaijan. — ölkə.", "I'm from Azerbaijan. I'm Azerbaijani.") },
  { match: { pattern: String.raw`^(?:i'?m|i am)\s+from\b` }, short: 'Bu, haradan olduğundur; millətini de.',
    explain: ex("I'm Azerbaijani.", 'from ilə ölkəni deyirsən; millət from-suz deyilir.', "I'm Azerbaijani. — millət; I'm from Azerbaijan. — ölkə.", "I'm Turkish. — I'm Azerbaijani.") },
];

export const lesson3a: DesignLesson = {
  id: 'a1_en_b3_d3a', order: 26, unit: 3, number: 3, part: 1, title: 'Millət', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d3a_c01', badge: 'Haradansan', subtitle: 'Pasport nəzarətində və hosteldə millətini deyirsən.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Millət sözlərini eşidib tanıya bilirəm.' },
        { icon: 'wave', text: 'Millətimi deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u3d3a_c02', number: 2, scenes: ['mascot/point'],
      word: "I'm Azerbaijani.", pronunciation: '/aɪm ˌæzərbaɪˈdʒɑni/', reading: 'aym əzərbaycani', az: 'Mən azərbaycanlıyam.',
      structure: ["I'm + millət.", "I'm from + ölkə."],
      notes: ['Millət sözü böyük hərflə yazılır: Azerbaijani.'],
      example: "I'm from Azerbaijan. I'm Azerbaijani.", exampleAz: 'Mən Azərbaycandanam. Azərbaycanlıyam.',
    },
    {
      type: 'choice', id: 'u3d3a_c03', number: 3, title: 'Dinlə və seç', why: 'Azerbaijani — azərbaycanlı (millət).', hint: 'Sözün sonuna qulaq as: ölkə adıdır, yoxsa millət?',
      prompt: 'Pasport nəzarətində oğlan özü haqqında deyir.\nEşitdiyin cümlənin tərcüməsini seç.', audio: "I'm Azerbaijani.",
      options: ['Mən azərbaycanlıyam.', 'Mən Azərbaycandanam.', 'Mən Bakıdanam.'], answer: 'Mən azərbaycanlıyam.',
      variants: [
        pick('Mən Azərbaycandanam.', 'Səsdə “from” yoxdur — bu, millətdir.', ex('Mən azərbaycanlıyam.', 'Səsdə from yoxdur, sözün sonunda -i var: millət.', "I'm Azerbaijani. — millət; I'm from Azerbaijan. — ölkə.", "I'm Azerbaijani.")),
        pick('Mən Bakıdanam.', 'Səsdə şəhər adı yoxdur.', ex('Mən azərbaycanlıyam.', 'Səsdə Baku yox, Azerbaijani deyilir.', "I'm Azerbaijani. — millət; I'm from Baku. — şəhər.", "I'm Azerbaijani.")),
      ],
      review: {
        title: 'Dinlə və seç', why: 'Azerbaijani — azərbaycanlı (millət).', hint: 'Sözdən əvvəl kiçik bir söz var, ya yox — qulaq as.',
        prompt: 'Hostel resepsiyasında qız özü haqqında deyir.\nEşitdiyin cümlənin tərcüməsini seç.', audio: "I'm from Azerbaijan.",
        options: ['Mən azərbaycanlıyam.', 'Mən Azərbaycandanam.', 'Adım Gəncədir.'], answer: 'Mən Azərbaycandanam.',
        variants: [
          pick('Mən azərbaycanlıyam.', 'Səsdə “from” var — bu, ölkədir.', ex('Mən Azərbaycandanam.', 'from ölkədən əvvəl gəlir: haradan olduğunu deyir.', "I'm from Azerbaijan. — ölkə; I'm Azerbaijani. — millət.", "I'm from Azerbaijan.")),
          pick('Adım Gəncədir.', 'Səsdə ad yoxdur.', ex('Mən Azərbaycandanam.', 'Səsdə my name is yoxdur, from var.', "I'm from Azerbaijan. — ölkə; My name is … — ad.", "I'm from Azerbaijan.")),
        ],
      },
    },
    {
      type: 'word', id: 'u3d3a_c04', number: 4, scenes: ['mascot/globe'],
      word: 'Turkish', pronunciation: '/ˈtɝkɪʃ/', reading: 'törkiş', az: 'türk',
      structure: ['Turkey — ölkə; Turkish — millət.'],
      notes: ['Millət sözü böyük hərflə yazılır.'],
      example: "I'm from Turkey. I'm Turkish.", exampleAz: 'Mən Türkiyədənəm. Türkəm.',
    },
    {
      type: 'choice', id: 'u3d3a_c05', number: 5, title: 'Sözü tamamla', why: 'Turkey — ölkə, Turkish — millət.', hint: 'Cümlə I\'m ilə başlayır, from yoxdur — hansı söz yaraşır?',
      prompt: 'Hostelin resepsiyasında yeni tanış özünü təqdim edir.\nHansı söz çatmır?', gap: { speaker: 'other', before: "I'm from Turkey. I'm", after: '.' },
      options: ['Turkish', 'Turkey', 'Azerbaijani'], answer: 'Turkish',
      variants: [
        pick('Turkey', 'Turkey ölkədir; I\'m-dən sonra millət gəlir.', ex('Turkish', 'from-suz I\'m-dən sonra millət gəlir: Turkish.', "I'm Turkish. — millət; I'm from Turkey. — ölkə.", "I'm from Turkey. I'm Turkish.")),
        pick('Azerbaijani', 'O, Türkiyədəndir.', ex('Turkish', 'Türkiyədən olan türkdür: Turkish.', "I'm from Turkey. I'm Turkish. — türk; I'm from Azerbaijan. I'm Azerbaijani. — azərbaycanlı.", "I'm from Turkey. I'm Turkish.")),
      ],
      review: {
        title: 'Sözü tamamla', why: 'Azerbaijan — ölkə, Azerbaijani — millət.', hint: 'Cümlə I\'m ilə başlayır, from yoxdur — hansı söz yaraşır?',
        prompt: 'Qatarda qonşu sərnişin özünü təqdim edir.\nHansı söz çatmır?', gap: { speaker: 'other', before: "I'm from Azerbaijan. I'm", after: '.' },
        options: ['Azerbaijan', 'Azerbaijani', 'Russian'], answer: 'Azerbaijani',
        variants: [
          pick('Azerbaijan', 'Azerbaijan ölkədir; I\'m-dən sonra millət gəlir.', ex('Azerbaijani', 'from-suz I\'m-dən sonra millət gəlir: Azerbaijani.', "I'm Azerbaijani. — millət; I'm from Azerbaijan. — ölkə.", "I'm from Azerbaijan. I'm Azerbaijani.")),
          pick('Russian', 'O, Azərbaycandandır.', ex('Azerbaijani', 'Azərbaycandan olan azərbaycanlıdır: Azerbaijani.', "I'm from Azerbaijan. I'm Azerbaijani. — azərbaycanlı; I'm from Russia. I'm Russian. — rus.", "I'm from Azerbaijan. I'm Azerbaijani.")),
        ],
      },
    },
    {
      type: 'word', id: 'u3d3a_c06', number: 6, scenes: ['mascot/wave'],
      word: 'Russian', pronunciation: '/ˈrʌʃən/', reading: 'raşən', az: 'rus',
      structure: ['Russia — ölkə; Russian — millət.'],
      notes: ['Sonda “n” var: Russia + n.'],
      example: "I'm from Russia. I'm Russian.", exampleAz: 'Mən Rusiyadanam. Rusam.',
    },
    {
      type: 'match', id: 'u3d3a_c07', number: 7, title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
      prompt: 'Hostelin resepsiyasında qonaqlar özlərini təqdim edir.\nHər cümləyə mənasını qoş.',
      rows: [{ en: "I'm Azerbaijani.", az: 'Azərbaycanlıyam.', from: 'G' }, { en: "I'm Turkish.", az: 'Türkəm.', from: 'other' }, { en: "I'm Russian.", az: 'Rusam.', from: 'other' }],
      extra: ['Rusiyadanam.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex("I'm Azerbaijani. — Azərbaycanlıyam; I'm Turkish. — Türkəm; I'm Russian. — Rusam.", 'Cümlələrdə from yoxdur — hamısı millətdir.', "I'm Russian. — rusam; I'm from Russia. — Rusiyadanam.", "I'm from Russia. I'm Russian."))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'from olan cümləni millət cümlələrindən ayır.',
        prompt: 'Pasport nəzarətinin növbəsində sərnişinlər danışır.\nHər cümləyə mənasını qoş.',
        rows: [{ en: "I'm from Turkey.", az: 'Türkiyədənəm.', from: 'other' }, { en: "I'm Georgian.", az: 'Gürcüyəm.', from: 'other' }, { en: "I'm Turkish.", az: 'Türkəm.', from: 'B' }],
        extra: ['Gürcüstandanam.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("I'm from Turkey. — Türkiyədənəm; I'm Georgian. — Gürcüyəm; I'm Turkish. — Türkəm.", 'from olan cümlə ölkədir, from-suz cümlələr millətdir.', "I'm Georgian. — gürcüyəm; I'm from Georgia. — Gürcüstandanam.", "I'm from Georgia. I'm Georgian."))],
      },
    },
    {
      type: 'word', id: 'u3d3a_c08', number: 8, scenes: ['mascot/think'],
      word: 'Georgian', pronunciation: '/ˈdʒɔrdʒən/', reading: 'corcən', az: 'gürcü',
      structure: ['Georgia — ölkə; Georgian — millət.'],
      notes: ['Hər iki G burada “c” kimi oxunur.'],
      example: "I'm from Georgia. I'm Georgian.", exampleAz: 'Mən Gürcüstandanam. Gürcüyəm.',
    },
    {
      type: 'voice', id: 'u3d3a_c09', number: 9, title: 'Millətini de', why: 'Millətini dedin: I\'m + millət.', hint: 'Bu dəfə from olmadan, millətinlə cavab ver.',
      prompt: 'Hosteldə yeni tanış soruşur: “I\'m Turkish. And you?”\nMillətini de.', audio: "I'm Turkish. And you?", reply: 'Nice to meet you!',
      rule: myNationality,
      variants: [...NATIONALITY_MISTAKES, other("I'm + millət.", ex("I'm Azerbaijani.", 'O, millətini dedi; sən də millətini de.', "I'm Azerbaijani. — millət; I'm from Azerbaijan. — ölkə.", "I'm Turkish. And you? — I'm Azerbaijani."))],
      review: {
        title: 'Millətini de', why: 'Millətini dedin: I\'m + millət.', hint: 'Bu dəfə from olmadan, millətinlə cavab ver.',
        prompt: 'Qatarda qonşu sərnişin deyir: “I\'m Russian. And you?”\nMillətini de.', audio: "I'm Russian. And you?", reply: 'Nice to meet you!',
        rule: myNationality,
        variants: [...NATIONALITY_MISTAKES, other("I'm + millət.", ex("I'm Azerbaijani.", 'O, millətini dedi; sən də millətini de.', "I'm Azerbaijani. — millət; I'm from Azerbaijan. — ölkə.", "I'm Russian. And you? — I'm Azerbaijani."))],
      },
    },
    {
      type: 'write', id: 'u3d3a_c10', number: 10, title: 'Mesaj yaz', why: 'I\'m + millət: I\'m Azerbaijani.', hint: 'Ölkə adı ilə millət sözünü qarışdırma.',
      prompt: 'Hostelin söhbət qrupunda yeni tanış yazır.\nSözlərdən cavab qur: azərbaycanlı olduğunu de.', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: "I'm Georgian. And you?" }] },
      tiles: ["I'm", 'Azerbaijan', 'Azerbaijani', 'from', '.'], rule: exact("I'm Azerbaijani."),
      variants: [other("I'm Azerbaijani.", ex("I'm Azerbaijani.", 'from-suz cümlədə ölkə yox, millət gəlir.', "I'm Azerbaijani. — millət; I'm from Azerbaijan. — ölkə.", "I'm Georgian. And you? — I'm Azerbaijani."))],
      review: {
        title: 'Mesaj yaz', why: 'I\'m + millət: I\'m Azerbaijani.', hint: 'Ölkə adı ilə millət sözünü qarışdırma.',
        prompt: 'Pasport nəzarətindən sonra yeni tanış mesaj yazır.\nSözlərdən cavab qur: azərbaycanlı olduğunu de.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: "I'm Russian. And you?" }] },
        tiles: ['from', 'Azerbaijani', '.', "I'm", 'Russian', 'Azerbaijan'], rule: exact("I'm Azerbaijani."),
        variants: [other("I'm Azerbaijani.", ex("I'm Azerbaijani.", 'from-suz cümlədə ölkə yox, millət gəlir.', "I'm Azerbaijani. — millət; I'm Russian. — rus.", "I'm Russian. And you? — I'm Azerbaijani."))],
      },
    },
    {
      type: 'write', id: 'u3d3a_c11', number: 11, title: 'Dinlə və yaz', why: 'Georgian — gürcü.', hint: 'Səsdə G “c” kimi oxunur, amma yazıda G-dir.',
      prompt: 'Hostel resepsiyasında qonaq millətini deyir.\nMillətini yaz.', audio: "I'm Georgian.", placeholder: 'Millət',
      rule: exact('Georgian'),
      variants: [other('Yazılışı yoxla: Georgian.', ex('Georgian', 'Səsdə “corcən” eşidilir, yazıda Georgia + n.', "I'm Georgian. — millət; I'm from Georgia. — ölkə.", "I'm Georgian."))],
      review: {
        title: 'Dinlə və yaz', why: 'Russian — rus.', hint: 'Səsdə “ş” eşidilir, yazıda isə iki s-dən sonra i var.',
        prompt: 'Pasport nəzarətində sərnişin millətini deyir.\nMillətini yaz.', audio: "I'm Russian.", placeholder: 'Millət',
        rule: exact('Russian'),
        variants: [other('Yazılışı yoxla: Russian.', ex('Russian', 'Səsdə “raşən” eşidilir, yazıda Russia + n.', "I'm Russian. — millət; I'm from Russia. — ölkə.", "I'm Russian."))],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u3d3a_c12', number: 12, title: 'Söhbəti sırala', why: 'Sual, cavab və tanışlıq düz sıradadır.', hint: 'Əvvəl sual gəlir; sonda tanışlığa sevinirlər.',
      prompt: 'Hostelin resepsiyası.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: 'Hi! Where are you from?', from: 'G' }, { en: '2', az: "I'm from Georgia. I'm Georgian. And you?", from: 'other' }, { en: '3', az: "I'm from Azerbaijan. I'm Azerbaijani.", from: 'G' }, { en: '4', az: 'Nice to meet you!', from: 'other' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hi! Where are you from? → I'm from Georgia. I'm Georgian. And you? → I'm from Azerbaijan. I'm Azerbaijani. → Nice to meet you!", 'Sual, cavab və geri sual, sonra cavab və tanışlıq.', "Where are you from? — sual; I'm from Georgia. — cavab.", 'Hi! Where are you from?'))],
      review: {
        title: 'Söhbəti sırala', why: 'Sual, cavab və tanışlıq düz sıradadır.', hint: 'Əvvəl salam və sual gəlir; And you? soruşandan sonra o biri cavab verir.',
        prompt: 'Pasport nəzarətinin növbəsi.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: 'Hello! Where are you from?', from: 'other' }, { en: '2', az: "I'm from Azerbaijan. And you?", from: 'B' }, { en: '3', az: "I'm from Turkey. I'm Turkish.", from: 'other' }, { en: '4', az: 'Nice to meet you!', from: 'B' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Hello! Where are you from? → I'm from Azerbaijan. And you? → I'm from Turkey. I'm Turkish. → Nice to meet you!", 'Sual, cavab və geri sual, sonra cavab və tanışlıq.', "Where are you from? — sual; And you? — geri sual.", 'Hello! Where are you from?'))],
      },
    },
  ],
  result: {
    done: ['Dərs 3 · 1-ci hissə tamamlandı', 'Artıq millətini deyir, türk, rus və gürcü sözlərini tanıyırsan.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Millət sözlərini eşidib tanımaq', tasks: ['u3d3a_c03', 'u3d3a_c05', 'u3d3a_c07', 'u3d3a_c12'] },
      { group: 'Yazı', text: 'Millətini yazmaq və eşitdiyin milləti yazmaq', tasks: ['u3d3a_c10', 'u3d3a_c11'] },
      { group: 'Danışıq', text: 'Millətini demək', tasks: ['u3d3a_c09'] },
    ],
    closing: 'Növbəti hissə — ingilis, amerikalı, alman, fransız və formada millət sahəsi.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: "I'm Azerbaijani.", translation: 'Mən azərbaycanlıyam.', example: "I'm from Azerbaijan. I'm Azerbaijani.", exampleAz: 'Mən Azərbaycandanam. Azərbaycanlıyam.', usageNote: "I'm + millət; I'm from + ölkə.", pronunciation: '/aɪm ˌæzərbaɪˈdʒɑni/', teachCard: 'u3d3a_c02' },
    { word: 'Turkish', translation: 'türk', example: "I'm from Turkey. I'm Turkish.", exampleAz: 'Mən Türkiyədənəm. Türkəm.', usageNote: 'Turkey — ölkə, Turkish — millət.', pronunciation: '/ˈtɝkɪʃ/', teachCard: 'u3d3a_c04' },
    { word: 'Russian', translation: 'rus', example: "I'm from Russia. I'm Russian.", exampleAz: 'Mən Rusiyadanam. Rusam.', usageNote: 'Russia — ölkə, Russian — millət.', pronunciation: '/ˈrʌʃən/', teachCard: 'u3d3a_c06' },
    { word: 'Georgian', translation: 'gürcü', example: "I'm from Georgia. I'm Georgian.", exampleAz: 'Mən Gürcüstandanam. Gürcüyəm.', usageNote: 'Georgia — ölkə, Georgian — millət.', pronunciation: '/ˈdʒɔrdʒən/', teachCard: 'u3d3a_c08' },
  ],
};
