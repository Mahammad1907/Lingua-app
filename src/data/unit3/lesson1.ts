// Bölmə 3 · Dərs 1 — Haradansan? (Where are you from? · I'm from … · Azerbaijan · Me too.)
// Dil klubunun açılışı. Xarici danışanlar adsız “Yeni tanış”dır (from: 'other').
// Spiral: Hello/Hi, Nice to meet you. You too., How are you?, Excuse me, Sorry? Say that again, please., Thank you!
import type { DesignLesson, Variant } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from '../unit1/build';
import { FROM, notices, own, resultTexts } from './shared';

const askFrom = goal(['askFrom'], ['Where are you from?']);
const myOrigin = own(FROM, "I'm from Azerbaijan.");
/** “I'm Ganja” (from is missing) and “I from Ganja” (am is missing) — typical Azerbaijani-speaker slips. */
const fromMistakes = (model: string, example: string): Variant[] => [
  { match: { pattern: String.raw`^(?:i'?m|i am)\s+(?!from\b)\p{L}` }, short: 'Haradan olduğunu deyəndə “from” lazımdır.',
    explain: ex(model, 'Azərbaycancada “-dan” şəkilçidir; ingiliscə yerin adından əvvəl ayrıca “from” gəlir.', "I'm from Ganja. — haradan; I'm fine. — hal.", example) },
  { match: { pattern: String.raw`^i\s+from\b` }, short: 'I-dan sonra am lazımdır.',
    explain: ex(model, 'Azərbaycancada “-am” şəkilçidir, ingiliscə I-dan sonra ayrıca gəlir.', "I'm from Ganja. — düzdür; I from Ganja. — olmur.", example) },
];

export const lesson1: DesignLesson = {
  id: 'a1_en_b3_d1', order: 23, unit: 3, number: 1, title: 'Haradansan?', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d1_c01', badge: 'Haradansan', subtitle: 'Dil klubunun açılışındasan: yeni tanışlar haradan olduğunu soruşur.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Haradan olduğunu soruşanda başa düşürəm.' },
        { icon: 'wave', text: 'Haradan olduğumu deyir və soruşa bilirəm.' },
        { icon: 'bye', text: '“Mən də” deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u3d1_c02', number: 2, scenes: ['mascot/ask'],
      word: 'Where are you from?', pronunciation: '/wɛr ɑr ju frʌm/', reading: 'uer ar yu fram?', az: 'Haradansan?',
      structure: ['Where are you from?'],
      notes: ['Azərbaycancadakı “-dan” ingiliscə sualın sonunda ayrıca söz kimi gəlir: from.'],
      example: 'Hello! Where are you from?', exampleAz: 'Salam! Haradansan?',
    },
    {
      type: 'choice', id: 'u3d1_c03', number: 3, title: 'Dinlə və anla', why: '“where … from” — haradan.', hint: 'Sualın əvvəlindəki və sonundakı sözə qulaq as.',
      prompt: 'Dil klubunun açılışındasan. Yeni tanış sənə yaxınlaşır.\nO nə soruşur?', audio: 'Hello! Where are you from?',
      options: ['Haradan olduğunu soruşur.', 'Adını soruşur.', 'Halını soruşur.'], answer: 'Haradan olduğunu soruşur.',
      variants: [
        pick('Adını soruşur.', 'Səsdə “name” yoxdur.', ex('Haradan olduğunu soruşur.', 'Səsdə “where” və “from” var — haradan olduğunu soruşur.', "Where are you from? — haradan; What's your name? — ad.", 'Hello! Where are you from?')),
        pick('Halını soruşur.', 'Səsdə “how” yoxdur.', ex('Haradan olduğunu soruşur.', 'Hal “How are you?” ilə soruşulur; burada “where … from” var.', 'Where are you from? — haradan; How are you? — hal.', 'Hello! Where are you from?')),
      ],
      review: {
        title: 'Dinlə və anla', why: '“where … from” — haradan.', hint: 'Sualın sonundakı kiçik sözə qulaq as.',
        prompt: 'Kafedə qonşu masadakı yeni tanış səninlə danışır.\nO nə soruşur?', audio: 'Excuse me, where are you from?',
        options: ['Üzr istəyir.', 'Haradan olduğunu soruşur.', 'Telefon nömrəni soruşur.'], answer: 'Haradan olduğunu soruşur.',
        variants: [
          pick('Üzr istəyir.', '“Excuse me” diqqət çəkir, sonra sual gəlir.', ex('Haradan olduğunu soruşur.', '“Excuse me” ilə diqqəti çəkir, sonra haradan olduğunu soruşur.', 'Excuse me — diqqət; Sorry! — üzr.', 'Excuse me, where are you from?')),
          pick('Telefon nömrəni soruşur.', 'Səsdə “phone number” yoxdur.', ex('Haradan olduğunu soruşur.', 'Səsdə “where” və “from” var.', "Where are you from? — haradan; What's your phone number? — nömrə.", 'Excuse me, where are you from?')),
        ],
      },
    },
    {
      type: 'word', id: 'u3d1_c04', number: 4, scenes: ['mascot/point'],
      word: "I'm from …", pronunciation: '/aɪm frʌm/', reading: 'aym fram …', az: 'Mən …-danam',
      structure: ["I'm from + şəhər / ölkə."],
      notes: ['“Bakıdanam” ingiliscə üç hissədir: I’m from Baku.'],
      example: "Where are you from? — I'm from Baku.", exampleAz: 'Haradansan? — Bakıdanam.',
    },
    {
      type: 'write', id: 'u3d1_c05', number: 5, title: 'Mesaj yaz', why: 'I’m from + şəhər — haradan olduğunu dedin.', hint: 'Bölmə 1-dəki “I’m” ilə başla.',
      prompt: 'Klubun söhbət qrupunda yeni tanış yazır. Sən Gəncədənsən.\nSözlərdən cavab qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: 'Hi! Where are you from?' }] },
      tiles: ["I'm", 'from', 'Ganja', '.', 'is', 'my', 'I'], rule: exact("I'm from Ganja."),
      variants: [
        ...fromMistakes("I'm from Ganja.", "Where are you from? — I'm from Ganja."),
        other("I'm from + şəhər.", ex("I'm from Ganja.", 'Haradan olduğunu deyirsən: I’m, from, sonra şəhər.', "I'm from Ganja. — haradan; My name is … — ad.", "Where are you from? — I'm from Ganja.")),
      ],
      review: {
        title: 'Mesaj yaz', why: 'I’m from + şəhər — haradan olduğunu dedin.', hint: 'Bölmə 1-dəki “I’m” ilə başla.',
        prompt: 'İş yoldaşın mesaj yazır. Sən Şamaxıdansan.\nSözlərdən cavab qur.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'İş yoldaşı', from: 'G', lines: [{ from: 'G', text: 'Where are you from?' }] },
        tiles: ['Shamakhi', 'from', "I'm", '.', 'at', 'you', 'is'], rule: exact("I'm from Shamakhi."),
        variants: [
          ...fromMistakes("I'm from Shamakhi.", "Where are you from? — I'm from Shamakhi."),
          other("I'm from + şəhər.", ex("I'm from Shamakhi.", 'Haradan olduğunu deyirsən: I’m, from, sonra şəhər.', "I'm from Shamakhi. — haradan; My name is … — ad.", "Where are you from? — I'm from Shamakhi.")),
        ],
      },
    },
    {
      type: 'word', id: 'u3d1_c06', number: 6, scenes: ['mascot/globe'],
      word: 'Azerbaijan', pronunciation: '/ˌæzərbaɪˈdʒɑn/', reading: 'əzərbaycan', az: 'Azərbaycan',
      notes: ['Ölkənin adı böyük hərflə yazılır; vurğu sondadır.'],
      example: "I'm from Azerbaijan.", exampleAz: 'Azərbaycandanam.',
    },
    {
      type: 'voice', id: 'u3d1_c07', number: 7, title: 'Səslə cavab', why: 'Haradan olduğunu dedin.', hint: 'Azərbaycancadakı “-dan” ingiliscə yerin adından əvvəl ayrıca gəlir.',
      prompt: 'Klubun qeydiyyat masasında işçi soruşur.\nHaradan olduğunu de.', audio: 'Hello! Where are you from?', reply: 'Thank you!',
      rule: myOrigin,
      variants: [
        ...fromMistakes("I'm from Azerbaijan.", "Where are you from? — I'm from Azerbaijan."),
        other("I'm from + ölkə və ya şəhər.", ex("I'm from Azerbaijan.", 'Sual haradan olduğunu soruşur — I’m from və yerin adı.', "I'm from Azerbaijan. — haradan; My name is … — ad.", "Where are you from? — I'm from Baku.")),
      ],
      review: {
        title: 'Səslə cavab', why: 'Haradan olduğunu dedin.', hint: 'Cavabı “mən” sözü ilə başla, yerin adından əvvəl “-dan” sözünü unutma.',
        prompt: 'Taksidə sürücü səninlə söhbət edir.\nHaradan olduğunu de.', audio: 'Where are you from?', reply: 'Thanks!',
        rule: myOrigin,
        variants: [
          ...fromMistakes("I'm from Azerbaijan.", "Where are you from? — I'm from Azerbaijan."),
          other("I'm from + ölkə və ya şəhər.", ex("I'm from Azerbaijan.", 'Sual haradan olduğunu soruşur — I’m from və yerin adı.', "I'm from Azerbaijan. — haradan; I'm fine. — hal.", "Where are you from? — I'm from Ganja.")),
        ],
      },
    },
    {
      type: 'choice', id: 'u3d1_c08', number: 8, title: 'Sözü tamamla', why: 'from — “-dan”: I’m from Baku.', hint: 'Azərbaycancada bu, şəhərin sonuna şəkilçi kimi qoşulur.',
      prompt: 'Klubda qız yeni tanışa haradan olduğunu deyir.\nHansı söz çatmır?', gap: { speaker: 'G', before: "I'm", after: 'Baku.' },
      options: ['from', 'at', 'is'], answer: 'from',
      variants: [
        pick('at', '“at” e-poçtda @ deməkdir.', ex('from', 'Haradan olduğunu deyəndə “from” gəlir.', "I'm from Baku. — haradan; at — @ (e-poçtda).", "I'm from Baku.")),
        pick('is', 'I’m-dan sonra “is” gəlmir.', ex('from', 'I’m artıq “mən …-am” deməkdir; haradan — from.', "I'm from Baku. — düzdür; I'm is Baku. — olmur.", "I'm from Baku.")),
      ],
      review: {
        title: 'Sözü tamamla', why: 'from — “-dan”: I’m from Ganja.', hint: 'Azərbaycancada bu, şəhərin sonuna şəkilçi kimi qoşulur.',
        prompt: 'Kafedə oğlan yeni tanışa haradan olduğunu deyir.\nHansı söz çatmır?', gap: { speaker: 'B', before: "I'm", after: 'Ganja.' },
        options: ['is', 'from', 'my'], answer: 'from',
        variants: [
          pick('is', 'I’m-dan sonra “is” gəlmir.', ex('from', 'I’m artıq “mən …-am” deməkdir; haradan — from.', "I'm from Ganja. — düzdür; I'm is Ganja. — olmur.", "I'm from Ganja.")),
          pick('my', '“my” — mənim; burada haradan olduğunu deyir.', ex('from', 'Haradan olduğunu deyəndə “from” gəlir.', "I'm from Ganja. — haradan; My name is … — ad.", "I'm from Ganja.")),
        ],
      },
    },
    {
      type: 'word', id: 'u3d1_c09', number: 9, scenes: ['mascot/happy'],
      word: 'Me too.', pronunciation: '/mi tu/', reading: 'mi tu', az: 'Mən də.',
      notes: ['Qarşındakı ilə eyni olanda deyilir; “You too” isə “sənə də”dir.'],
      example: "I'm from Baku. — Me too!", exampleAz: 'Bakıdanam. — Mən də!',
    },
    {
      type: 'match', mode: 'reply', id: 'u3d1_c10', number: 10, title: 'Cavab cütü', why: 'Hər cümləyə uyğun cavabı tapdın.',
      prompt: 'Dil klubunda söhbət.\nHər cümləyə uyğun cavabı qoş.',
      rows: [{ en: 'Where are you from?', az: "I'm from Ganja.", from: 'other' }, { en: "I'm from Baku.", az: 'Me too!', from: 'G' }, { en: 'Nice to meet you.', az: 'You too.', from: 'B' }],
      extra: ["I'm fine, thanks."],
      variants: [other('Bir cavab yerində deyil.', ex("Where are you from? → I'm from Ganja.; I'm from Baku. → Me too!; Nice to meet you. → You too.", 'Sual, eyni yer və tanışlıq fərqli cavab istəyir.', 'Me too! — mən də; You too. — sənə də.', "I'm from Baku. — Me too!"))],
      review: {
        title: 'Cavab cütü', why: 'Hər cümləyə uyğun cavabı tapdın.',
        prompt: 'Hostelin mətbəxində söhbət.\nHər cümləyə uyğun cavabı qoş.',
        rows: [{ en: "Hi! I'm from Azerbaijan.", az: 'Me too!', from: 'other' }, { en: 'How are you?', az: "I'm fine, thanks.", from: 'G' }, { en: 'Where are you from?', az: "I'm from Lankaran.", from: 'B' }],
        extra: ['You too.'],
        variants: [other('Bir cavab yerində deyil.', ex("Hi! I'm from Azerbaijan. → Me too!; How are you? → I'm fine, thanks.; Where are you from? → I'm from Lankaran.", 'Eyni yer, hal və sual fərqli cavab istəyir.', "Me too! — mən də; I'm fine, thanks. — hal.", "I'm from Azerbaijan. — Me too!"))],
      },
    },
    {
      type: 'write', id: 'u3d1_c11', number: 11, title: 'Dialoqu tamamla', why: 'Me too — sən də oradansan.', hint: 'Sən də eyni şəhərdənsən — “mən də” necə deyilir?',
      prompt: 'Klubda yeni tanış haradan olduğunu yazdı. Sən də Bakıdansan.\nQısa cavab yaz.', placeholder: 'Cavabın',
      chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: "Hi! I'm from Baku." }] },
      rule: exact('Me too!', 'Me too.', "Me too! I'm from Baku.", "Me too. I'm from Baku."),
      variants: [
        { match: { words: ['You too'] }, short: '“You too” — sənə də; burada “mən də” lazımdır.', explain: ex('Me too!', 'O, Bakıdan olduğunu dedi; sən də — “mən də”.', 'Me too! — mən də; You too. — sənə də.', "I'm from Baku. — Me too!") },
        other('Me too!', ex('Me too!', 'Burada qısa cavab istənir: sən də Bakıdansan.', "Me too! — qısa cavab; I'm from Baku. — tam cümlə.", "I'm from Baku. — Me too!")),
      ],
      review: {
        title: 'Dialoqu tamamla', why: 'Me too — sən də oradansan.', hint: 'Sən də eyni şəhərdənsən — “mən də” necə deyilir?',
        prompt: 'İş yoldaşın haradan olduğunu yazdı. Sən də Gəncədənsən.\nQısa cavab yaz.', placeholder: 'Cavabın',
        chat: { partner: 'İş yoldaşı', from: 'G', lines: [{ from: 'G', text: "I'm from Ganja." }] },
        rule: exact('Me too!', 'Me too.', "Me too! I'm from Ganja.", "Me too. I'm from Ganja."),
        variants: [
          { match: { words: ['You too'] }, short: '“You too” — sənə də; burada “mən də” lazımdır.', explain: ex('Me too!', 'O, Gəncədən olduğunu dedi; sən də — “mən də”.', 'Me too! — mən də; You too. — sənə də.', "I'm from Ganja. — Me too!") },
          other('Me too!', ex('Me too!', 'Burada qısa cavab istənir: sən də Gəncədənsən.', "Me too! — qısa cavab; I'm from Ganja. — tam cümlə.", "I'm from Ganja. — Me too!")),
        ],
      },
    },
    {
      type: 'voice', id: 'u3d1_c12', number: 12, title: 'Haradan olduğunu soruş', why: 'Haradan olduğunu soruşdun.', hint: 'Bu dərsin ilk sualını xatırla.',
      prompt: 'Klubda yeni tanışla salamlaşdın, adını da bilirsən.\nHaradan olduğunu soruş.', reply: "I'm from Lankaran.",
      rule: askFrom,
      variants: [
        insteadOf('askName', 'Adını artıq bilirsən — haradan olduğunu soruş.', ex('Where are you from?', 'Ad yox, haradan olduğu lazımdır.', "Where are you from? — haradan; What's your name? — ad.", 'Hello! Where are you from?')),
        other('Where are you from?', ex('Where are you from?', 'Haradan olduğunu soruşursan: Where … from?', 'Where are you from? — haradan; How are you? — hal.', 'Hi! Where are you from?')),
      ],
      review: {
        title: 'Haradan olduğunu soruş', why: 'Haradan olduğunu soruşdun.', hint: 'Bu dərsin ilk sualını xatırla.',
        prompt: 'Hostelin mətbəxində yeni tanışla çay içirsən.\nHaradan olduğunu soruş.', reply: "I'm from Ganja.",
        rule: askFrom,
        variants: [
          insteadOf('askFeeling', 'Hal yox, haradan olduğunu soruş.', ex('Where are you from?', 'Hal yox, haradan olduğu lazımdır.', 'Where are you from? — haradan; How are you? — hal.', 'Hi! Where are you from?')),
          other('Where are you from?', ex('Where are you from?', 'Haradan olduğunu soruşursan: Where … from?', "Where are you from? — haradan; What's your name? — ad.", 'Hi! Where are you from?')),
        ],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u3d1_c13', number: 13, title: 'Söhbəti sırala', why: 'Sual, cavab, “mən də” və tanışlıq düz sıradadır.', hint: 'Əvvəl sual gəlir; eyni şəhərdən olan nə deyir?',
      prompt: 'Dil klubu.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: 'Hi! Where are you from?', from: 'other' }, { en: '2', az: "I'm from Baku. And you?", from: 'G' }, { en: '3', az: 'Me too!', from: 'other' }, { en: '4', az: 'Nice to meet you!', from: 'G' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hi! Where are you from? → I'm from Baku. And you? → Me too! → Nice to meet you!", 'Sual, cavab, sonra “mən də”.', "Where are you from? — sual; I'm from Baku. — cavab.", 'Hi! Where are you from?'))],
      review: {
        title: 'Söhbəti sırala', why: 'Sual, cavab, təkrar xahişi və təkrar düz sıradadır.', hint: 'Əvvəl sual gəlir; eşitməyən nə xahiş edir?',
        prompt: 'Qatarda söhbət.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: 'Excuse me, where are you from?', from: 'other' }, { en: '2', az: "I'm from Shamakhi.", from: 'B' }, { en: '3', az: 'Sorry? Say that again, please.', from: 'other' }, { en: '4', az: "Shamakhi. I'm from Shamakhi.", from: 'B' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Excuse me, where are you from? → I'm from Shamakhi. → Sorry? Say that again, please. → Shamakhi.", 'Sual, cavab, təkrar xahişi, sonra təkrar.', 'Sorry? Say that again, please. — eşitmədin; Shamakhi. — təkrar.', 'Excuse me, where are you from?'))],
      },
    },
  ],
  result: {
    done: ['Dərs 1 tamamlandı', 'Artıq haradan olduğunu deyir, soruşur və “mən də” deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Haradan olduğunu soruşanda başa düşmək', tasks: ['u3d1_c03', 'u3d1_c08', 'u3d1_c10', 'u3d1_c13'] },
      { group: 'Yazı', text: 'Haradan olduğunu və “mən də” yazmaq', tasks: ['u3d1_c05', 'u3d1_c11'] },
      { group: 'Danışıq', text: 'Haradan olduğunu demək və soruşmaq', tasks: ['u3d1_c07', 'u3d1_c12'] },
    ],
    closing: 'Növbəti dərs — ölkələr: Türkiyə, Gürcüstan, Rusiya, İran.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'Where are you from?', translation: 'Haradansan?', example: 'Hello! Where are you from?', exampleAz: 'Salam! Haradansan?', usageNote: 'from — “-dan”, sualın sonunda gəlir.', pronunciation: '/wɛr ɑr ju frʌm/', teachCard: 'u3d1_c02' },
    { word: "I'm from …", translation: 'Mən …-danam', example: "Where are you from? — I'm from Baku.", exampleAz: 'Haradansan? — Bakıdanam.', usageNote: "I'm from + şəhər / ölkə.", pronunciation: '/aɪm frʌm/', teachCard: 'u3d1_c04' },
    { word: 'Azerbaijan', translation: 'Azərbaycan', example: "I'm from Azerbaijan.", exampleAz: 'Azərbaycandanam.', usageNote: 'Ölkə adı, böyük hərflə.', pronunciation: '/ˌæzərbaɪˈdʒɑn/', teachCard: 'u3d1_c06' },
    { word: 'Me too.', translation: 'Mən də.', example: "I'm from Baku. — Me too!", exampleAz: 'Bakıdanam. — Mən də!', usageNote: 'Eyni olanda: mən də.', pronunciation: '/mi tu/', teachCard: 'u3d1_c09' },
  ],
};
