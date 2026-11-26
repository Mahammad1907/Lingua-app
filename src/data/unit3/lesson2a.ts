// Bölmə 3 · Dərs 2 — Ölkələr. 1-ci hissə: country · Turkey · Georgia; 2-ci hissə (lesson2a_2): Russia · Iran.
// Hava limanı, qatar, hostel, kurs sinfində dünya xəritəsi. Ölkə adları hərf-hərf də tutulur (Hərfləri tut).
// Spiral: Where are you from? I'm from …, Azerbaijan (Dərs 1); hərflər, It's …, Thank you! (Bölmə 1–2).
import type { DesignLesson, Variant } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { FROM, notices, own, resultTexts } from './shared';

const myCountry = own(FROM, "I'm from Azerbaijan.");
/** “I'm Azerbaijan” (from is missing) and “I from …” (am is missing). */
const fromMistakes: Variant[] = [
  { match: { pattern: String.raw`^(?:i'?m|i am)\s+(?!from\b)\p{L}` }, short: 'Ölkədən əvvəl “from” lazımdır.',
    explain: ex("I'm from Azerbaijan.", 'Azərbaycancada “-dan” şəkilçidir; ingiliscə ölkədən əvvəl ayrıca “from” gəlir.', "I'm from Azerbaijan. — haradan; I'm fine. — hal.", "What country are you from? — I'm from Azerbaijan.") },
  { match: { pattern: String.raw`^i\s+from\b` }, short: 'I-dan sonra am lazımdır.',
    explain: ex("I'm from Azerbaijan.", 'Azərbaycancada “-am” şəkilçidir, ingiliscə I-dan sonra ayrıca gəlir.', "I'm from Azerbaijan. — düzdür; I from Azerbaijan. — olmur.", "What country are you from? — I'm from Azerbaijan.") },
];

export const lesson2a: DesignLesson = {
  id: 'a1_en_b3_d2a', order: 40, unit: 3, number: 2, part: 1, title: 'Ölkələr', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d2a_c01', badge: 'Haradansan', subtitle: 'Hava limanında, qatarda və hosteldə qonşu ölkələrin adlarını eşidirsən: Türkiyə, Gürcüstan.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Türkiyə və Gürcüstanın ingiliscə adını eşidib tanıyıram.' },
        { icon: 'wave', text: '“Hansı ölkədənsən?” sualını başa düşürəm.' },
      ],
    },
    {
      type: 'word', id: 'u3d2a_c02', number: 2, scenes: ['mascot/globe'],
      word: 'country', pronunciation: '/ˈkʌntri/', reading: 'kantri', az: 'ölkə',
      structure: ['What country are you from?'],
      notes: ['What country is it? — hansı ölkə?'],
      example: "What country are you from? — I'm from Azerbaijan.", exampleAz: 'Hansı ölkədənsən? — Azərbaycandanam.',
    },
    {
      type: 'choice', id: 'u3d2a_c03', number: 3, title: 'Dinlə və anla', why: '“country” — ölkə.', hint: 'Sualın ikinci sözünə qulaq as.',
      prompt: 'Hava limanında uçuş tablosunun qarşısında yeni tanış səninlə danışır.\nO nə soruşur?', audio: 'What country are you from?',
      options: ['Hansı ölkədən olduğunu soruşur.', 'Hansı şəhərdən olduğunu soruşur.', 'Adını soruşur.'], answer: 'Hansı ölkədən olduğunu soruşur.',
      variants: [
        pick('Hansı şəhərdən olduğunu soruşur.', '“country” şəhər yox, ölkədir.', ex('Hansı ölkədən olduğunu soruşur.', 'Səsdə “country” var — ölkə.', 'What country are you from? — ölkə; Where are you from? — ölkə və ya şəhər.', 'What country are you from?')),
        pick('Adını soruşur.', 'Səsdə “name” yoxdur.', ex('Hansı ölkədən olduğunu soruşur.', 'Səsdə “country” və “from” var.', "What country are you from? — ölkə; What's your name? — ad.", 'What country are you from?')),
      ],
      review: {
        title: 'Dinlə və anla', why: '“country” — ölkə.', hint: 'Sualın ortasındakı yeni sözə qulaq as.',
        prompt: 'Hostelin resepsiyasında işçi səninlə danışır.\nO nə soruşur?', audio: 'Excuse me, what country are you from?',
        options: ['Telefon nömrəni soruşur.', 'Hansı ölkədən olduğunu soruşur.', 'Yaşını soruşur.'], answer: 'Hansı ölkədən olduğunu soruşur.',
        variants: [
          pick('Telefon nömrəni soruşur.', 'Səsdə “phone number” yoxdur.', ex('Hansı ölkədən olduğunu soruşur.', 'Səsdə “country” və “from” var.', "What country are you from? — ölkə; What's your phone number? — nömrə.", 'Excuse me, what country are you from?')),
          pick('Yaşını soruşur.', 'Yaş “How old are you?” ilə soruşulur.', ex('Hansı ölkədən olduğunu soruşur.', 'Səsdə “old” yox, “country” var.', 'What country are you from? — ölkə; How old are you? — yaş.', 'Excuse me, what country are you from?')),
        ],
      },
    },
    {
      type: 'word', id: 'u3d2a_c04', number: 4, scenes: ['mascot/point'],
      word: 'Turkey', pronunciation: '/ˈtɝki/', reading: 'törki', az: 'Türkiyə',
      notes: ['Türkiyə ingiliscə Turkey yazılır və “törki” oxunur.'],
      example: "I'm from Turkey.", exampleAz: 'Türkiyədənəm.',
    },
    {
      type: 'write', id: 'u3d2a_c05', number: 5, letters: ['T', 'U', 'R', 'K', 'E', 'Y', 'I', 'A'], title: 'Hərfləri tut', why: 'T-U-R-K-E-Y — Türkiyə.', hint: 'Hər hərfi eşidən kimi toxun; “i” və “ay” səslərini qarışdırma.',
      prompt: 'Eşitdiyin hərflərə toxun.', audio: "It's T-U-R-K-E-Y.", placeholder: 'Ölkə',
      rule: exact('TURKEY'),
      variants: [other('Hərfləri bir-bir dinlə.', ex('TURKEY', 'Səsdə T, U, R, K, E, Y deyilir: E “i” oxunur, Y “uay”.', 'E — i; I — ay.', "It's T-U-R-K-E-Y."))],
      review: {
        letters: ['G', 'E', 'O', 'R', 'G', 'I', 'A', 'J', 'U'], title: 'Hərfləri tut', why: 'G-E-O-R-G-I-A — Gürcüstan.', hint: 'Hər hərfi eşidən kimi toxun; “ci” və “cey” səslərini qarışdırma.',
        prompt: 'Eşitdiyin hərflərə toxun.', audio: "It's G-E-O-R-G-I-A.", placeholder: 'Ölkə',
        rule: exact('GEORGIA'),
        variants: [other('Hərfləri bir-bir dinlə.', ex('GEORGIA', 'Səsdə G, E, O, R, G, I, A deyilir: G “ci”, E “i”, I “ay” oxunur.', 'G — ci; J — cey.', "It's G-E-O-R-G-I-A."))],
      },
    },
    {
      type: 'word', id: 'u3d2a_c06', number: 6, scenes: ['mascot/think'],
      word: 'Georgia', pronunciation: '/ˈdʒɔrdʒə/', reading: 'corcə', az: 'Gürcüstan',
      notes: ['“corcə” oxunur; ABŞ-da da Georgia adlı ştat var.'],
      example: "I'm from Georgia.", exampleAz: 'Gürcüstandanam.',
    },
    {
      type: 'voice', id: 'u3d2a_c07', number: 7, title: 'Dinlə və təkrarla', why: 'Cümləni dedin; Georgia — “corcə”.', hint: 'Əvvəl yavaş dinlə, sonra sözləri bir-bir de.',
      prompt: 'Qatarda yeni tanış Gürcüstandan olduğunu deyir.\nDinlə, sonra eyni cür de.', audio: "I'm from Georgia.", repeat: { stress: 'Geor', note: 'Georgia — “corcə”: iki “c” səsi var.', reading: 'aym fram corcə' },
      rule: exact("I'm from Georgia."),
      variants: [other('Bir daha dinlə və yavaş de.', ex("I'm from Georgia.", '“Georgia” yazıldığı kimi yox, “corcə” kimi oxunur.', "I'm from Georgia. — Gürcüstandan; I'm from Turkey. — Türkiyədən.", "I'm from Georgia."))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Cümləni dedin; Turkey — “törki”.', hint: 'Əvvəl yavaş dinlə, sonra sözləri bir-bir de.',
        prompt: 'Hostelin mətbəxində yeni tanış Türkiyədən olduğunu deyir.\nDinlə, sonra eyni cür de.', audio: "I'm from Turkey.", repeat: { stress: 'Tur', note: 'Turkey — “törki”: “ü” yox, “ö” kimi.', reading: 'aym fram törki' },
        rule: exact("I'm from Turkey."),
        variants: [other('Bir daha dinlə və yavaş de.', ex("I'm from Turkey.", '“Turkey” “törki” kimi oxunur.', "I'm from Turkey. — Türkiyədən; I'm from Georgia. — Gürcüstandan.", "I'm from Turkey."))],
      },
    },
    {
      type: 'choice', id: 'u3d2a_c15', number: 8, title: 'Sözü tamamla', why: '“What country” — hansı ölkə.', hint: 'Sual ölkəni soruşur — bu dərsin ilk sözünü xatırla.',
      prompt: 'Hava limanında yeni tanış hansı ölkədən olduğunu soruşur.\nHansı söz çatmır?', gap: { speaker: 'other', before: 'What', after: 'are you from?' },
      options: ['country', 'name', 'where'], answer: 'country',
      variants: [
        pick('name', '“name” — ad; burada ölkə soruşulur.', ex('country', 'Sual hansı ölkədən olduğunu soruşur: What country.', "What country are you from? — ölkə; What's your name? — ad.", 'What country are you from?')),
        pick('where', '“What where” birlikdə olmur.', ex('country', 'What-dan sonra soruşulan şey gəlir: country — ölkə.', 'What country are you from? — hansı ölkə; Where are you from? — haradan.', 'What country are you from?')),
      ],
      review: {
        title: 'Sözü tamamla', why: '“What country” — hansı ölkə.', hint: 'Sual ölkəni soruşur — bu dərsin ilk sözünü xatırla.',
        prompt: 'Qatarda yanındakı sərnişin hansı ölkədən olduğunu soruşur.\nHansı söz çatmır?', gap: { speaker: 'other', before: 'Excuse me, what', after: 'are you from?' },
        options: ['where', 'country', 'phone'], answer: 'country',
        variants: [
          pick('phone', '“phone” — telefon; burada ölkə soruşulur.', ex('country', 'Sual hansı ölkədən olduğunu soruşur: what country.', "What country are you from? — ölkə; What's your phone number? — nömrə.", 'Excuse me, what country are you from?')),
          pick('where', '“what where” birlikdə olmur.', ex('country', 'what-dan sonra soruşulan şey gəlir: country — ölkə.', 'What country are you from? — hansı ölkə; Where are you from? — haradan.', 'Excuse me, what country are you from?')),
        ],
      },
    },
    {
      type: 'match', mode: 'reply', id: 'u3d2a_c16', number: 9, title: 'Cavab cütü', why: 'Hər cümləyə uyğun cavabı tapdın.',
      prompt: 'Hostelin mətbəxində tanışlıq.\nHər cümləyə uyğun cavabı qoş.',
      rows: [{ en: 'What country are you from?', az: "I'm from Turkey.", from: 'other' }, { en: "I'm from Georgia.", az: 'Me too!', from: 'G' }, { en: 'How are you?', az: "I'm fine, thanks.", from: 'B' }],
      extra: ['You too.'],
      variants: [other('Bir cavab yerində deyil.', ex("What country are you from? → I'm from Turkey.; I'm from Georgia. → Me too!; How are you? → I'm fine, thanks.", 'Ölkə sualına ölkə ilə, eyni yerə “Me too!” ilə, hala “fine” ilə cavab verilir.', 'What country are you from? — ölkə; How are you? — hal.', "What country are you from? — I'm from Turkey."))],
      review: {
        title: 'Cavab cütü', why: 'Hər cümləyə uyğun cavabı tapdın.',
        prompt: 'Hava limanında gözləmə zalında söhbət.\nHər cümləyə uyğun cavabı qoş.',
        rows: [{ en: "Hi! I'm from Turkey.", az: 'Me too!', from: 'other' }, { en: 'Nice to meet you.', az: 'You too.', from: 'G' }, { en: 'What country are you from?', az: "I'm from Georgia.", from: 'B' }],
        extra: ["I'm fine, thanks."],
        variants: [other('Bir cavab yerində deyil.', ex("Hi! I'm from Turkey. → Me too!; Nice to meet you. → You too.; What country are you from? → I'm from Georgia.", 'Eyni yerə “Me too!”, tanışlığa “You too.”, ölkə sualına ölkə ilə cavab verilir.', 'Me too! — mən də; You too. — sənə də.', "What country are you from? — I'm from Georgia."))],
      },
    },
  ],
  result: {
    done: ['Dərs 2 · 1-ci hissə tamamlandı', 'Artıq “country” sözünü, Türkiyə və Gürcüstanın ingiliscə adını tanıyırsan.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Ölkə sualını və ölkə adlarını tanımaq', tasks: ['u3d2a_c03', 'u3d2a_c05', 'u3d2a_c15', 'u3d2a_c16'] },
      { group: 'Danışıq', text: 'Ölkənin adını düzgün demək', tasks: ['u3d2a_c07'] },
    ],
    closing: 'Növbəti hissə — Rusiya və İran.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'country', translation: 'ölkə', example: "What country are you from? — I'm from Azerbaijan.", exampleAz: 'Hansı ölkədənsən? — Azərbaycandanam.', usageNote: 'What country is it? — hansı ölkə?', pronunciation: '/ˈkʌntri/', teachCard: 'u3d2a_c02' },
    { word: 'Turkey', translation: 'Türkiyə', example: "I'm from Turkey.", exampleAz: 'Türkiyədənəm.', usageNote: '“törki” oxunur.', pronunciation: '/ˈtɝki/', teachCard: 'u3d2a_c04' },
    { word: 'Georgia', translation: 'Gürcüstan', example: "I'm from Georgia.", exampleAz: 'Gürcüstandanam.', usageNote: '“corcə” oxunur.', pronunciation: '/ˈdʒɔrdʒə/', teachCard: 'u3d2a_c06' },
  ],
};

// Dərs 2 · 2-ci hissə (26 Nov 2026: the lesson was split, nothing removed): Russia · Iran.
export const lesson2a_2: DesignLesson = {
  id: 'a1_en_b3_d2a_2', order: 41, unit: 3, number: 2, part: 2, title: 'Ölkələr', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d2a_c20', badge: 'Haradansan', subtitle: 'Hostelin resepsiyasında və kurs sinfində Rusiya və İrandan gələnlərlə tanış olursan.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Rusiya və İranın ingiliscə adını eşidib tanıyıram.' },
        { icon: 'wave', text: 'Hansı ölkədən olduğumu deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u3d2a_c08', number: 8, scenes: ['mascot/wave'],
      word: 'Russia', pronunciation: '/ˈrʌʃə/', reading: 'raşə', az: 'Rusiya',
      notes: ['“Rusiya” yox, “raşə” oxunur.'],
      example: "I'm from Russia.", exampleAz: 'Rusiyadanam.',
    },
    {
      type: 'choice', id: 'u3d2a_c09', number: 9, title: 'Dinlə və seç', why: 'Russia — Rusiya.', hint: 'Cümlənin sonundakı ölkə adına qulaq as.',
      prompt: 'Hostelin resepsiyasında yeni gələn qonaq danışır.\nO hansı ölkədəndir?', audio: "Hello! I'm from Russia.",
      options: ['Rusiya', 'Türkiyə', 'Gürcüstan'], answer: 'Rusiya',
      variants: [
        pick('Türkiyə', 'Səsdə “Turkey” yoxdur.', ex('Rusiya', 'Səsdə “Russia” — “raşə” var.', "I'm from Russia. — Rusiyadan; I'm from Turkey. — Türkiyədən.", "Hello! I'm from Russia.")),
        pick('Gürcüstan', 'Səsdə “Georgia” yoxdur.', ex('Rusiya', 'Səsdə “raşə” var, “corcə” yox.', "I'm from Russia. — Rusiyadan; I'm from Georgia. — Gürcüstandan.", "Hello! I'm from Russia.")),
      ],
      review: {
        title: 'Dinlə və seç', why: 'Georgia — Gürcüstan.', hint: 'Cümlənin sonundakı ölkə adına qulaq as.',
        prompt: 'Kafedə yeni tanış haradan olduğunu deyir.\nO hansı ölkədəndir?', audio: "Hi! I'm from Georgia.",
        options: ['Türkiyə', 'Gürcüstan', 'Rusiya'], answer: 'Gürcüstan',
        variants: [
          pick('Türkiyə', 'Səsdə “Turkey” yoxdur.', ex('Gürcüstan', 'Səsdə “Georgia” — “corcə” var.', "I'm from Georgia. — Gürcüstandan; I'm from Turkey. — Türkiyədən.", "Hi! I'm from Georgia.")),
          pick('Rusiya', 'Səsdə “Russia” yoxdur.', ex('Gürcüstan', 'Səsdə “corcə” var, “raşə” yox.', "I'm from Georgia. — Gürcüstandan; I'm from Russia. — Rusiyadan.", "Hi! I'm from Georgia.")),
        ],
      },
    },
    {
      type: 'write', id: 'u3d2a_c17', number: 10, letters: ['R', 'U', 'S', 'S', 'I', 'A', 'H', 'E'], title: 'Hərfləri tut', why: 'R-U-S-S-I-A — Rusiya.', hint: 'Hər hərfi eşidən kimi toxun; bir hərf iki dəfə dalbadal gəlir.',
      prompt: 'Eşitdiyin hərflərə toxun.', audio: "It's R-U-S-S-I-A.", placeholder: 'Ölkə',
      rule: exact('RUSSIA'),
      variants: [other('Hərfləri bir-bir dinlə.', ex('RUSSIA', 'Səsdə R, U, S, S, I, A deyilir: U “yu”, I “ay” oxunur.', 'U — yu; I — ay.', "It's R-U-S-S-I-A."))],
      review: {
        letters: ['I', 'R', 'A', 'N', 'E', 'Y', 'M'], title: 'Hərfləri tut', why: 'I-R-A-N — İran.', hint: 'Hər hərfi eşidən kimi toxun; “ay” və “ey” səslərini qarışdırma.',
        prompt: 'Eşitdiyin hərflərə toxun.', audio: "It's I-R-A-N.", placeholder: 'Ölkə',
        rule: exact('IRAN'),
        variants: [other('Hərfləri bir-bir dinlə.', ex('IRAN', 'Səsdə I, R, A, N deyilir: I “ay”, A “ey” oxunur.', 'I — ay; A — ey.', "It's I-R-A-N."))],
      },
    },
    {
      type: 'word', id: 'u3d2a_c10', number: 10, scenes: ['mascot/point'],
      word: 'Iran', pronunciation: '/ɪˈrɑn/', reading: 'iran', az: 'İran',
      notes: ['Vurğu sondadır.'],
      example: "I'm from Iran.", exampleAz: 'İrandanam.',
    },
    {
      type: 'choice', map: 'neighbours', id: 'u3d2a_c14', number: 11, title: 'Xəritədə tap', why: 'Georgia — Gürcüstan.', hint: 'Bu ölkə “Sən buradasan” nöqtəsinin şimal-qərbindədir, kiçikdir.',
      prompt: 'Qatarda yeni tanış haradan olduğunu deyir.\nDinlə və xəritədə ölkəyə toxun.', audio: "I'm from Georgia.",
      options: ['Turkey', 'Georgia', 'Iran'], answer: 'Georgia',
      variants: [
        pick('Turkey', 'Səsdə “Turkey” yox, “Georgia” deyilir.', ex('Georgia', 'Georgia “corcə” kimi oxunur və Gürcüstandır.', "I'm from Georgia. — Gürcüstandanam; I'm from Turkey. — Türkiyədənəm.", "I'm from Georgia.")),
        pick('Iran', 'Səsdə “Iran” yox, “Georgia” deyilir.', ex('Georgia', 'Georgia “corcə” kimi oxunur və Gürcüstandır.', "I'm from Georgia. — Gürcüstandanam; I'm from Iran. — İrandanam.", "I'm from Georgia.")),
      ],
      review: {
        title: 'Xəritədə tap', why: 'Russia — Rusiya.', hint: 'Xəritədə ən böyük ölkə, “Sən buradasan” nöqtəsinin şimalında.',
        prompt: 'Hostelin mətbəxində yeni tanış haradan olduğunu deyir.\nDinlə və xəritədə ölkəyə toxun.', audio: "I'm from Russia.",
        options: ['Iran', 'Georgia', 'Russia'], answer: 'Russia',
        variants: [
          pick('Iran', 'Səsdə “Iran” yox, “Russia” deyilir.', ex('Russia', 'Russia “raşə” kimi oxunur və Rusiyadır.', "I'm from Russia. — Rusiyadanam; I'm from Iran. — İrandanam.", "I'm from Russia.")),
          pick('Georgia', 'Səsdə “Georgia” yox, “Russia” deyilir.', ex('Russia', 'Russia “raşə” kimi oxunur və Rusiyadır.', "I'm from Russia. — Rusiyadanam; I'm from Georgia. — Gürcüstandanam.", "I'm from Russia.")),
        ],
      },
    },
    {
      type: 'match', id: 'u3d2a_c11', number: 11, title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
      prompt: 'Kurs sinfində dünya xəritəsinin qarşısında söhbət.\nHər cümləyə mənasını qoş.',
      rows: [{ en: "I'm from Iran.", az: 'İrandanam.', from: 'other' }, { en: "I'm from Georgia.", az: 'Gürcüstandanam.', from: 'G' }, { en: 'What country are you from?', az: 'Hansı ölkədənsən?', from: 'B' }],
      extra: ['Rusiyadanam.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex("I'm from Iran. — İrandanam.; I'm from Georgia. — Gürcüstandanam.; What country are you from? — Hansı ölkədənsən?", 'Ölkə adları fərqlidir; sual “country” ilə soruşur.', "I'm from Iran. — İrandan; I'm from Georgia. — Gürcüstandan.", 'What country are you from?'))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
        prompt: 'Hava limanında gözləmə zalında söhbət.\nHər cümləyə mənasını qoş.',
        rows: [{ en: "I'm from Russia.", az: 'Rusiyadanam.', from: 'other' }, { en: "I'm from Turkey.", az: 'Türkiyədənəm.', from: 'B' }, { en: 'Where are you from?', az: 'Haradansan?', from: 'G' }],
        extra: ['İrandanam.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("I'm from Russia. — Rusiyadanam.; I'm from Turkey. — Türkiyədənəm.; Where are you from? — Haradansan?", 'Ölkə adları fərqlidir; sual “where” ilə başlayır.', "I'm from Russia. — Rusiyadan; I'm from Turkey. — Türkiyədən.", 'Where are you from?'))],
      },
    },
    {
      type: 'write', id: 'u3d2a_c12', number: 12, title: 'Yaz', why: 'İstanbul Türkiyədədir — Turkey.', hint: 'İstanbul hansı ölkədədir — 1-ci hissədəki ingiliscə adını xatırla.', scenes: ['u3/airport'],
      prompt: 'Hava limanında tabloda “Istanbul” var, dostun çatda soruşur.\nÖlkəsini ingiliscə yaz.', placeholder: 'Ölkə',
      rule: exact('Turkey'),
      variants: [
        { match: { words: ['Turkiye', 'Türkiye', 'Turkiya', 'Turkia'] }, short: 'İngiliscə bu ölkənin adı başqa cür yazılır.', explain: ex('Turkey', 'Türkiyə ingiliscə Turkey yazılır.', "I'm from Turkey. — Türkiyədən; I'm from Russia. — Rusiyadan.", "I'm from Turkey.") },
        other('Ölkənin ingiliscə adını yaz.', ex('Turkey', 'İstanbul Türkiyədədir; ingiliscə Turkey.', "I'm from Turkey. — Türkiyədən; I'm from Iran. — İrandan.", "I'm from Turkey.")),
      ],
      review: { scenes: ['u3/train'],
        title: 'Yaz', why: 'Tbilisi Gürcüstandadır — Georgia.', hint: 'Tbilisi hansı ölkədədir — 1-ci hissədəki ingiliscə adını xatırla.',
        prompt: 'Qatar tablosunda “Tbilisi” var, dostun çatda soruşur.\nÖlkəsini ingiliscə yaz.', placeholder: 'Ölkə',
        rule: exact('Georgia'),
        variants: [
          { match: { words: ['Gruziya', 'Gruzia', 'Gurcustan', 'Gürcüstan'] }, short: 'İngiliscə bu ölkənin adı başqa cür yazılır.', explain: ex('Georgia', 'Gürcüstan ingiliscə Georgia yazılır.', "I'm from Georgia. — Gürcüstandan; I'm from Russia. — Rusiyadan.", "I'm from Georgia.") },
          other('Ölkənin ingiliscə adını yaz.', ex('Georgia', 'Tbilisi Gürcüstandadır; ingiliscə Georgia.', "I'm from Georgia. — Gürcüstandan; I'm from Turkey. — Türkiyədən.", "I'm from Georgia.")),
        ],
      },
    },
    {
      type: 'voice', id: 'u3d2a_c13', number: 13, title: 'Səslə cavab', why: 'Hansı ölkədən olduğunu dedin.', hint: 'Ölkənin adından əvvəl “-dan” sözünü unutma.',
      prompt: 'Hava limanında pasport nəzarətində işçi soruşur.\nHansı ölkədən olduğunu de.', audio: 'What country are you from?', reply: 'Thank you!',
      rule: myCountry,
      variants: [...fromMistakes, other("I'm from + ölkə.", ex("I'm from Azerbaijan.", 'Sual ölkəni soruşur — I’m from və ölkənin adı.', "I'm from Azerbaijan. — ölkə; My name is [ad] — ad.", "What country are you from? — I'm from Azerbaijan."))],
      review: {
        title: 'Səslə cavab', why: 'Hansı ölkədən olduğunu dedin.', hint: 'Cavabı “mən” sözü ilə başla, ölkədən əvvəl “-dan” sözünü unutma.',
        prompt: 'Hostelin mətbəxində yeni tanış soruşur.\nHansı ölkədən olduğunu de.', audio: 'Hi! What country are you from?', reply: "I'm from Iran.",
        rule: myCountry,
        variants: [...fromMistakes, other("I'm from + ölkə.", ex("I'm from Azerbaijan.", 'Sual ölkəni soruşur — I’m from və ölkənin adı.', "I'm from Azerbaijan. — ölkə; I'm fine. — hal.", "What country are you from? — I'm from Azerbaijan."))],
      },
    },
  ],
  result: {
    done: ['Dərs 2 · 2-ci hissə tamamlandı', 'Artıq qonşu ölkələrin ingiliscə adını tanıyır və hansı ölkədən olduğunu deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Ölkə adlarını eşidib tanımaq', tasks: ['u3d2a_c09', 'u3d2a_c17', 'u3d2a_c14', 'u3d2a_c11'] },
      { group: 'Yazı', text: 'Ölkənin ingiliscə adını yazmaq', tasks: ['u3d2a_c12'] },
      { group: 'Danışıq', text: 'Hansı ölkədən olduğunu demək', tasks: ['u3d2a_c13'] },
    ],
    closing: 'Növbəti hissə — daha uzaq ölkələr: İngiltərə, ABŞ, Almaniya, Fransa.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'Russia', translation: 'Rusiya', example: "I'm from Russia.", exampleAz: 'Rusiyadanam.', usageNote: '“raşə” oxunur.', pronunciation: '/ˈrʌʃə/', teachCard: 'u3d2a_c08' },
    { word: 'Iran', translation: 'İran', example: "I'm from Iran.", exampleAz: 'İrandanam.', usageNote: 'Vurğu sondadır.', pronunciation: '/ɪˈrɑn/', teachCard: 'u3d2a_c10' },
  ],
};
