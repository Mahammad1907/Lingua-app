// Bölmə 3 · Dərs 7 — Dillər. 1-ci hissə: Do you speak …? · Yes, I do. · No, I don't.; 2-ci hissə (lesson7_2): a little · language.
// Dil mübadiləsi masası. Dil adları millət sözləri ilə eynidir (Dərs 3) — yenidən öyrədilmir, qeyddə izah olunur.
// Spiral: Really?, Are you …?, Where are you from?, I live in …, More slowly, please.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, own, resultTexts, said, SPEAK, SPEAK_MISTAKES } from './shared';

const areYouSpeak = { match: { pattern: String.raw`^are\s+you\s+speak` }, short: 'Bu sualda “are” yox, “do” gəlir.',
  explain: ex('Do you speak Russian?', 'Danışmaq haqqında sualı “Do” başladır.', 'Do you speak Russian? — dil; Are you Russian? — millət.', 'Excuse me, do you speak English?') };
/** Own short answer to “Do you speak …?”: “Yes, I do.” or “No, I don't.” */
const DO_SHORT = String.raw`^(?:yes\s*,?\s*i\s+do|no\s*,?\s*i\s+(?:don'?t|don’t|do\s+not))\s*[.!]?$`;
const DO_MISTAKES = (example: string) => [
  { match: { pattern: String.raw`^(?:yes\s*,?\s*i(?:'m|’m|\s+am)|no\s*,?\s*i(?:'m|’m|\s+am)\s+not)\b` }, short: 'Sual Do ilə başlayıb — cavabda da do gəlir.',
    explain: ex('Yes, I do.', 'Sual Do ilə başlayırsa, qısa cavabda da do gəlir.', "Yes, I do. — danışıram; Yes, I am. — eləyəm.", example) },
  { match: { pattern: String.raw`^no\s*,?\s*i\s+not\b` }, short: '“xeyr” cavabında don’t deyilir.',
    explain: ex("No, I don't.", '“danışmıram” üçün do və not birlikdə gəlir: don’t.', "No, I don't. — düzdür; No, I not. — olmur.", example) },
];
const noLittle = { match: { pattern: String.raw`(?<!\ba\s)\blittle\b` }, short: '“bir az” iki sözdür: a little.',
  explain: ex('Yes, a little.', '“little”dən əvvəl “a” gəlir: a little — bir az.', 'Yes, a little. — düzdür; Yes, little. — olmur.', 'Do you speak English? — Yes, a little.') };

export const lesson7: DesignLesson = {
  id: 'a1_en_b3_d7', order: 55, unit: 3, number: 7, part: 1, title: 'Dillər', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d7_c01', badge: 'Haradansan', subtitle: 'Dil mübadiləsi masasında kim hansı dildə danışır — soruşursan və deyirsən.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Hansı dildə danışdığını soruşa bilirəm.' },
        { icon: 'wave', text: 'Bəli və xeyr ilə qısa cavab verə bilirəm: Yes, I do. / No, I don’t.' },
      ],
    },
    {
      type: 'word', id: 'u3d7_c02', number: 2, scenes: ['mascot/ask'],
      word: 'Do you speak English?', pronunciation: '/du ju spik ˈɪŋɡlɪʃ/', reading: 'du yu spik inqliş?', az: 'İngiliscə danışırsan?',
      structure: ['Do you speak + dil?'],
      notes: ['Do sualı başladır, ayrıca tərcümə olunmur.'],
      example: 'Excuse me, do you speak English?', exampleAz: 'Bağışlayın, ingiliscə danışırsınız?',
    },
    {
      type: 'choice', id: 'u3d7_c03', number: 3, title: 'Dinlə və anla', why: '“speak” — danışmaq; dil haqqında sualdır.', hint: 'Sualın ortasındakı yeni sözə qulaq as.',
      prompt: 'Dil mübadiləsi masasına yeni tanış yaxınlaşır.\nO nə soruşur?', audio: 'Hi! Do you speak English?',
      options: ['İngiliscə danışıb-danışmadığını soruşur.', 'İngilis olub-olmadığını soruşur.', 'İngiltərədən olub-olmadığını soruşur.'], answer: 'İngiliscə danışıb-danışmadığını soruşur.',
      variants: [
        pick('İngilis olub-olmadığını soruşur.', 'Səsdə “speak” var — dil haqqındadır.', ex('İngiliscə danışıb-danışmadığını soruşur.', 'Millət “Are you [millət]?” ilə soruşulur, burada “Do you speak” var.', 'Do you speak English? — dil; Are you English? — millət.', 'Hi! Do you speak English?')),
        pick('İngiltərədən olub-olmadığını soruşur.', 'Səsdə “from” və ölkə yoxdur.', ex('İngiliscə danışıb-danışmadığını soruşur.', 'Ölkə “Are you from [ölkə]?” ilə soruşulur.', 'Do you speak English? — dil; Are you from England? — ölkə.', 'Hi! Do you speak English?')),
      ],
      review: {
        title: 'Dinlə və anla', why: '“speak” — danışmaq; dil haqqında sualdır.', hint: 'Sualın ortasındakı sözə qulaq as.',
        prompt: 'Hostelin mətbəxində yanındakı gənc sənə müraciət edir.\nO nə soruşur?', audio: 'Excuse me, do you speak Russian?',
        options: ['Rus olub-olmadığını soruşur.', 'Rusca danışıb-danışmadığını soruşur.', 'Rusiyadan olub-olmadığını soruşur.'], answer: 'Rusca danışıb-danışmadığını soruşur.',
        variants: [
          pick('Rus olub-olmadığını soruşur.', 'Səsdə “speak” var — dil haqqındadır.', ex('Rusca danışıb-danışmadığını soruşur.', 'Millət “Are you [millət]?” ilə soruşulur, burada “Do you speak” var.', 'Do you speak Russian? — dil; Are you Russian? — millət.', 'Excuse me, do you speak Russian?')),
          pick('Rusiyadan olub-olmadığını soruşur.', 'Səsdə “from” və ölkə yoxdur.', ex('Rusca danışıb-danışmadığını soruşur.', 'Ölkə “Are you from [ölkə]?” ilə soruşulur.', 'Do you speak Russian? — dil; Are you from Russia? — ölkə.', 'Excuse me, do you speak Russian?')),
        ],
      },
    },
    {
      type: 'word', id: 'u3d7_c04', number: 4, scenes: ['mascot/happy'],
      word: 'Yes, I do.', pronunciation: '/jɛs aɪ du/', reading: 'yes, ay du', az: 'Bəli, danışıram.',
      structure: ['Do you [dil]? — Yes, I do.'],
      notes: ['Qısa cavabda sualdakı “do” təkrar olunur.'],
      example: 'Do you speak Russian? — Yes, I do.', exampleAz: 'Rusca danışırsan? — Bəli, danışıram.',
    },
    {
      type: 'write', id: 'u3d7_c05', number: 5, title: 'Sualı qur', why: 'Danışmaq haqqında sual “Do” ilə başlayır.', hint: 'Bu dərsin sualı hansı kiçik sözlə başlayır?',
      prompt: 'Yeni tanışa mesaj yaz: rusca bilirmi?\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
      tiles: ['speak', 'Do', 'Russian', 'you', 'Are', 'Russia', '?'], rule: exact('Do you speak Russian?'),
      variants: [areYouSpeak, other('Sıra: Do you speak Russian?', ex('Do you speak Russian?', 'Do, sonra you speak, sonda dilin adı.', 'Do you speak Russian? — dil; Are you from Russia? — ölkə.', 'Excuse me, do you speak Russian?'))],
      review: {
        title: 'Sualı qur', why: 'Danışmaq haqqında sual “Do” ilə başlayır.', hint: 'Bu dərsin sualı hansı kiçik sözlə başlayır?',
        prompt: 'Hostelin çatında qonağa yaz: fransızca bilirmi?\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
        tiles: ['you', 'French', 'Do', 'speak', 'Are', 'France', '?'], rule: exact('Do you speak French?'),
        variants: [{ ...areYouSpeak, explain: ex('Do you speak French?', 'Danışmaq haqqında sualı “Do” başladır.', 'Do you speak French? — dil; Are you French? — millət.', 'Excuse me, do you speak French?') },
          other('Sıra: Do you speak French?', ex('Do you speak French?', 'Do, sonra you speak, sonda dilin adı.', 'Do you speak French? — dil; Are you from France? — ölkə.', 'Excuse me, do you speak French?'))],
      },
    },
    {
      type: 'word', id: 'u3d7_c06', number: 6, scenes: ['mascot/think'],
      word: "No, I don't.", pronunciation: '/noʊ aɪ doʊnt/', reading: 'nou, ay dont', az: 'Xeyr, danışmıram.',
      structure: ["Do you [dil]? — No, I don't."],
      notes: ["don't — do not-un qısasıdır."],
      example: "Do you speak French? — No, I don't.", exampleAz: 'Fransızca danışırsan? — Xeyr, danışmıram.',
    },
    {
      type: 'match', mode: 'reply', id: 'u3d7_c07', number: 7, title: 'Cavab cütü', why: 'Hər suala uyğun qısa cavabı tapdın.',
      prompt: 'Dil mübadiləsi masasında suallar.\nSuala toxun, sonra onun cavabını seç.',
      rows: [{ en: 'Do you speak Turkish?', az: 'Yes, I do.', from: 'other' }, { en: 'Are you Turkish?', az: "No, I'm not.", from: 'G' }, { en: 'Where are you from?', az: "I'm from Georgia.", from: 'B' }],
      extra: ['Yes, he is.'],
      variants: [other('Bir sualın cavabı yerində deyil.', ex("Do you speak Turkish? — Yes, I do.; Are you Turkish? — No, I'm not.; Where are you from? — I'm from Georgia.", '“Do you” sualına “do” ilə, “Are you” sualına “am” ilə cavab verilir.', "Do you speak Turkish? — Yes, I do.; Are you Turkish? — No, I'm not.", 'Do you speak Turkish? — Yes, I do.'))],
      review: {
        title: 'Cavab cütü', why: 'Hər suala uyğun qısa cavabı tapdın.',
        prompt: 'Hostelin mətbəxində suallar.\nSuala toxun, sonra onun cavabını seç.',
        rows: [{ en: 'Do you speak French?', az: "No, I don't.", from: 'other' }, { en: 'Are you from Iran?', az: 'Yes, I am.', from: 'G' }, { en: 'Where do you live?', az: 'I live in Ganja.', from: 'B' }],
        extra: ['More slowly, please.'],
        variants: [other('Bir sualın cavabı yerində deyil.', ex("Do you speak French? — No, I don't.; Are you from Iran? — Yes, I am.; Where do you live? — I live in Ganja.", '“Do you” sualına “do” ilə, “Are you” sualına “am” ilə cavab verilir.', "Do you speak French? — No, I don't.; Are you from Iran? — Yes, I am.", "Do you speak French? — No, I don't."))],
      },
    },
    {
      type: 'voice', id: 'u3d7_c14', number: 8, title: 'Səslə cavab', why: 'Do sualına do ilə qısa cavab verdin.', hint: 'Sual hansı kiçik sözlə başlayıb? Cavabda da o gəlir.',
      prompt: 'Dil mübadiləsi masasında yeni tanış soruşur.\nRusca bilirsən? Düzünü qısa cavabla de.', audio: 'Do you speak Russian?', reply: 'OK!',
      rule: said(DO_SHORT, 'Yes, I do.', "No, I don't."),
      variants: [...DO_MISTAKES('Do you speak Russian? — Yes, I do.'), other('Yes, I do. / No, I don’t.', ex('Yes, I do.', 'Sual bəli/xeyr sualıdır və Do ilə başlayır — qısa cavab da do ilə.', "Yes, I do. — bəli; No, I don't. — xeyr.", 'Do you speak Russian? — Yes, I do.'))],
      review: {
        title: 'Səslə cavab', why: 'Do sualına do ilə qısa cavab verdin.', hint: 'Sual hansı kiçik sözlə başlayıb? Cavabda da o gəlir.',
        prompt: 'Hostelin mətbəxində yanındakı gənc soruşur.\nFransızca bilirsən? Düzünü qısa cavabla de.', audio: 'Excuse me, do you speak French?', reply: 'OK, thanks!',
        rule: said(DO_SHORT, 'Yes, I do.', "No, I don't."),
        variants: [...DO_MISTAKES("Do you speak French? — No, I don't."), other('Yes, I do. / No, I don’t.', ex("No, I don't.", 'Sual bəli/xeyr sualıdır və Do ilə başlayır — qısa cavab da do ilə.', "Yes, I do. — bəli; No, I don't. — xeyr.", "Do you speak French? — No, I don't."))],
      },
    },
  ],
  result: {
    done: ['Dərs 7 · 1-ci hissə tamamlandı', 'Artıq dil haqqında soruşur və qısa cavab verə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Dil sualını və qısa cavabları anlamaq', tasks: ['u3d7_c03', 'u3d7_c07'] },
      { group: 'Yazı', text: 'Dil haqqında sual qurmaq', tasks: ['u3d7_c05'] },
      { group: 'Danışıq', text: 'Dil sualına qısa cavab vermək', tasks: ['u3d7_c14'] },
    ],
    closing: 'Növbəti hissə — “bir az” və “dil”: hansı dillərdə danışdığını demək.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'Do you speak English?', translation: 'İngiliscə danışırsan?', example: 'Excuse me, do you speak English?', exampleAz: 'Bağışlayın, ingiliscə danışırsınız?', usageNote: 'Do you speak + dil?', pronunciation: '/du ju spik ˈɪŋɡlɪʃ/', teachCard: 'u3d7_c02' },
    { word: 'Yes, I do.', translation: 'Bəli, danışıram.', example: 'Do you speak Russian? — Yes, I do.', exampleAz: 'Rusca danışırsan? — Bəli, danışıram.', usageNote: 'Do you [dil]? sualına qısa “bəli”.', pronunciation: '/jɛs aɪ du/', teachCard: 'u3d7_c04' },
    { word: "No, I don't.", translation: 'Xeyr, danışmıram.', example: "Do you speak French? — No, I don't.", exampleAz: 'Fransızca danışırsan? — Xeyr, danışmıram.', usageNote: 'Do you [dil]? sualına qısa “xeyr”.', pronunciation: '/noʊ aɪ doʊnt/', teachCard: 'u3d7_c06' },
  ],
};

// Dərs 7 · 2-ci hissə (26 Nov 2026: the lesson was split, nothing removed): a little · language.
export const lesson7_2: DesignLesson = {
  id: 'a1_en_b3_d7_2', order: 56, unit: 3, number: 7, part: 2, title: 'Dillər', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d7_c20', badge: 'Haradansan', subtitle: 'Dil mübadiləsi masasında hansı dillərdə və nə qədər danışdığını deyirsən.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Hansı dildə danışdığını soruşanı anlayıram.' },
        { icon: 'wave', text: 'Hansı dillərdə və nə qədər danışdığımı deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u3d7_c08', number: 8, scenes: ['mascot/point'],
      word: 'a little', pronunciation: '/ə ˈlɪtəl/', reading: 'ə litl', az: 'bir az',
      structure: ['I speak a little + dil.', 'Yes, a little.'],
      notes: ['“a” və “little” birlikdə gəlir: bir az.'],
      example: 'I speak a little English.', exampleAz: 'Bir az ingiliscə danışıram.',
    },
    {
      type: 'voice', id: 'u3d7_c15', number: 9, title: 'Dinlə və təkrarla', why: 'Cümləni dedin; a little — “ə litl”.', hint: 'Əvvəl yavaş dinlə, sonra sözləri bir-bir de.',
      prompt: 'Dil mübadiləsi masasında yeni tanış ingiliscə nə qədər bildiyini deyir.\nDinlə, sonra eyni cür de.', audio: 'I speak a little English.', repeat: { stress: 'lit', note: 'a little — “ə litl”: a ilə little birlikdə deyilir.', reading: 'ay spik ə litl inqliş' },
      rule: exact('I speak a little English.'),
      variants: [other('Bir daha dinlə və yavaş de.', ex('I speak a little English.', '“bir az” iki sözdür: a little.', 'I speak a little English. — düzdür; I speak little English. — başqa məna verir.', 'Do you speak English? — Yes, a little.'))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Cümləni dedin; a little — “ə litl”.', hint: 'Əvvəl yavaş dinlə, sonra sözləri bir-bir de.',
        prompt: 'Hostelin mətbəxində qonaq rusca nə qədər bildiyini deyir.\nDinlə, sonra eyni cür de.', audio: 'I speak a little Russian.', repeat: { stress: 'lit', note: 'a little — “ə litl”: a ilə little birlikdə deyilir.', reading: 'ay spik ə litl raşən' },
        rule: exact('I speak a little Russian.'),
        variants: [other('Bir daha dinlə və yavaş de.', ex('I speak a little Russian.', '“bir az” iki sözdür: a little.', 'I speak a little Russian. — düzdür; I speak little Russian. — başqa məna verir.', 'Do you speak Russian? — Yes, a little.'))],
      },
    },
    {
      type: 'voice', id: 'u3d7_c09', number: 9, title: 'Dillərini de', why: 'Hansı dillərdə danışdığını dedin.', hint: 'Əvvəl qısa cavab ver, sonra dilləri bir-bir sadala.',
      prompt: 'Dil mübadiləsi masasında yeni tanış soruşur.\nCavab ver və hansı dillərdə danışdığını de: “I speak [dil]”.', audio: 'Hi! Do you speak Azerbaijani?', reply: 'Really? Nice!',
      rule: own(SPEAK, 'Yes, I do. I speak Azerbaijani and a little English.', 'I speak Azerbaijani and Russian.'),
      variants: [...SPEAK_MISTAKES, other('I speak + dil.', ex('Yes, I do. I speak Azerbaijani and a little English.', 'Danışdığın dilləri “I speak” ilə de; bir neçəsini “and” birləşdirir.', 'I speak Azerbaijani. — bir dil; I speak Azerbaijani and Russian. — iki dil.', 'I speak Azerbaijani and a little English.'))],
      review: {
        title: 'Dillərini de', why: 'Hansı dillərdə danışdığını dedin.', hint: 'Əvvəl qısa cavab ver, sonra dilləri bir-bir sadala.',
        prompt: 'Hostelin mətbəxində yanındakı gənc soruşur.\nCavab ver və hansı dillərdə danışdığını de: “I speak [dil]”.', audio: 'Excuse me, do you speak Turkish?', reply: 'OK, thanks!',
        rule: own(SPEAK, 'Yes, I do. I speak Azerbaijani and a little Turkish.', 'I speak Azerbaijani and English.'),
        variants: [...SPEAK_MISTAKES, other('I speak + dil.', ex('I speak Azerbaijani and English.', 'Danışdığın dilləri “I speak” ilə de; bir neçəsini “and” birləşdirir.', 'I speak Turkish. — bir dil; I speak Turkish and English. — iki dil.', 'I speak Azerbaijani and a little Turkish.'))],
      },
    },
    {
      type: 'word', id: 'u3d7_c10', number: 10, scenes: ['mascot/globe'],
      word: 'language', pronunciation: '/ˈlæŋɡwɪdʒ/', reading: 'lənqvic', az: 'dil',
      notes: ['Dilin adı millət sözü ilə eynidir: Russian — rus, rus dili.'],
      example: 'What language do you speak?', exampleAz: 'Hansı dildə danışırsan?',
    },
    {
      type: 'choice', id: 'u3d7_c16', number: 12, title: 'Dinlə və anla', why: '“language” — dil.', hint: 'Sualın ikinci sözünə qulaq as.',
      prompt: 'Dil mübadiləsi masasında yeni tanış səninlə danışır.\nO nə soruşur?', audio: 'What language do you speak?',
      options: ['Hansı dildə danışdığını soruşur.', 'Haradan olduğunu soruşur.', 'Harada yaşadığını soruşur.'], answer: 'Hansı dildə danışdığını soruşur.',
      variants: [
        pick('Haradan olduğunu soruşur.', 'Səsdə “from” yoxdur.', ex('Hansı dildə danışdığını soruşur.', 'Səsdə language və speak var — dil.', 'What language do you speak? — dil; Where are you from? — haradan.', 'What language do you speak?')),
        pick('Harada yaşadığını soruşur.', 'Səsdə “live” yoxdur.', ex('Hansı dildə danışdığını soruşur.', 'Səsdə language və speak var — dil.', 'What language do you speak? — dil; Where do you live? — harada yaşayırsan.', 'What language do you speak?')),
      ],
      review: {
        title: 'Dinlə və anla', why: '“language” — dil.', hint: 'Sualın ortasındakı yeni sözə qulaq as.',
        prompt: 'Hostelin resepsiyasında işçi səninlə danışır.\nO nə soruşur?', audio: 'Excuse me, what language do you speak?',
        options: ['Millətini soruşur.', 'Hansı dildə danışdığını soruşur.', 'Haradan olduğunu soruşur.'], answer: 'Hansı dildə danışdığını soruşur.',
        variants: [
          pick('Millətini soruşur.', 'Səsdə millət sualı yoxdur.', ex('Hansı dildə danışdığını soruşur.', 'Səsdə language və speak var — dil.', 'What language do you speak? — dil; Are you Russian? — millət.', 'Excuse me, what language do you speak?')),
          pick('Haradan olduğunu soruşur.', 'Səsdə “from” yoxdur.', ex('Hansı dildə danışdığını soruşur.', 'Səsdə language və speak var — dil.', 'What language do you speak? — dil; Where are you from? — haradan.', 'Excuse me, what language do you speak?')),
        ],
      },
    },
    {
      type: 'choice', id: 'u3d7_c11', number: 11, title: 'Sözü tamamla', why: '“Do you [dil]?” sualına “No, I don’t.” ilə cavab verilir.', hint: 'Sual “Are you” ilə yox, başqa sözlə başlayıb.',
      prompt: 'Oğlan almanca bilmir.\nHansı söz çatmır?', gap: { speaker: 'B', before: 'No, I', after: '.' },
      options: ['am', "don't", 'not'], answer: "don't",
      variants: [
        pick('am', '“am” ilə “Are you [millət]?” sualına cavab verilir.', ex("No, I don't.", 'Sual “Do” ilə başlayıb, cavabda da “do” işlənir.', "Do you speak German? — No, I don't.; Are you German? — No, I'm not.", "Do you speak German? — No, I don't.")),
        pick('not', 'I-dan sonra tək “not” qalmır.', ex("No, I don't.", 'Burada “not” “do” ilə birlikdə gəlir: don’t.', "No, I don't. — düzdür; No, I not. — olmur.", "Do you speak German? — No, I don't.")),
      ],
      review: {
        title: 'Sözü tamamla', why: '“Do you [dil]?” sualına “Yes, I do.” ilə cavab verilir.', hint: 'Sual “Are you” ilə yox, başqa sözlə başlayıb.',
        prompt: 'Hostelin mətbəxində qızdan soruşurlar: “Do you speak French?”\nQız fransızca bilir. Hansı söz çatmır?', gap: { speaker: 'G', before: 'Yes, I', after: '. I speak French.' },
        options: ['am', 'speak', 'do'], answer: 'do',
        variants: [
          pick('am', '“am” ilə “Are you [millət]?” sualına cavab verilir.', ex('Yes, I do.', 'Sual “Do” ilə başlayıb, cavabda da “do” işlənir.', 'Do you speak French? — Yes, I do.; Are you French? — Yes, I am.', 'Do you speak French? — Yes, I do.')),
          pick('speak', 'Qısa cavabda “speak” təkrar olunmur.', ex('Yes, I do.', 'Qısa cavabda sualdakı “do” işlənir.', 'Yes, I do. — düzdür; Yes, I speak. — olmur.', 'Do you speak French? — Yes, I do.')),
        ],
      },
    },
    {
      type: 'match', id: 'u3d7_c17', number: 14, title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
      prompt: 'Dil mübadiləsi masasında söhbət.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'I speak a little English.', az: 'Bir az ingiliscə danışıram.', from: 'other' }, { en: 'What language do you speak?', az: 'Hansı dildə danışırsan?', from: 'G' }, { en: 'Do you speak Russian?', az: 'Rusca danışırsan?', from: 'B' }],
      extra: ['Rusam.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex('I speak a little English. — Bir az ingiliscə danışıram.; What language do you speak? — Hansı dildə danışırsan?; Do you speak Russian? — Rusca danışırsan?', 'speak — danışmaq; language — dil; a little — bir az.', "Do you speak Russian? — dil; Are you Russian? — millət.", 'What language do you speak? — I speak a little English.'))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
        prompt: 'Hostelin mətbəxində söhbət.\nHər cümləyə mənasını qoş.',
        rows: [{ en: "No, I don't.", az: 'Xeyr, danışmıram.', from: 'other' }, { en: 'Yes, a little.', az: 'Bəli, bir az.', from: 'G' }, { en: "I'm Russian.", az: 'Rusam.', from: 'B' }],
        extra: ['Rusca danışıram.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("No, I don't. — Xeyr, danışmıram.; Yes, a little. — Bəli, bir az.; I'm Russian. — Rusam.", 'I’m millət deyir; dil haqqında qısa cavab do və ya a little ilə gəlir.', "No, I don't. — dil; No, I'm not. — millət.", 'Do you speak Russian? — Yes, a little.'))],
      },
    },
    {
      type: 'write', id: 'u3d7_c12', number: 12, title: 'Dialoqu tamamla', why: '“a little” — bir az.', hint: 'Bəli de və nə qədər bildiyini iki sözlə əlavə et.',
      prompt: 'Yeni tanış yazır. Sən ingiliscə bir az bilirsən.\nQısa cavab yaz: bəli, bir az.', placeholder: 'Cavabını yaz',
      chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: 'Hi! Do you speak English?' }] },
      rule: exact('Yes, a little.', 'Yes, I do. A little.', 'Yes, I do, a little.', 'A little.', 'Yes, I speak a little English.', 'Yes, I speak English a little.', 'Yes, a little English.'),
      variants: [noLittle, other('Yes, a little.', ex('Yes, a little.', 'Bəli deyirsən və “a little” ilə bir az bildiyini bildirirsən.', "Yes, a little. — bir az; Yes, I do. — bilirəm.", 'Do you speak English? — Yes, a little.'))],
      review: {
        title: 'Dialoqu tamamla', why: '“a little” — bir az.', hint: 'Bəli de və nə qədər bildiyini iki sözlə əlavə et.',
        prompt: 'Qrup çatında soruşurlar. Rusca bir az bilirsən.\nQısa cavab yaz.', placeholder: 'Cavabını yaz',
        chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: 'Hello! Do you speak Russian?' }] },
        rule: exact('Yes, a little.', 'Yes, I do. A little.', 'Yes, I do, a little.', 'A little.', 'Yes, I speak a little Russian.', 'Yes, I speak Russian a little.', 'Yes, a little Russian.'),
        variants: [{ ...noLittle, explain: ex('Yes, a little.', '“little”dən əvvəl “a” gəlir: a little — bir az.', 'Yes, a little. — düzdür; Yes, little. — olmur.', 'Do you speak Russian? — Yes, a little.') },
          other('Yes, a little.', ex('Yes, a little.', 'Bəli deyirsən və “a little” ilə bir az bildiyini bildirirsən.', 'Yes, a little. — bir az; Yes, I do. — bilirəm.', 'Do you speak Russian? — Yes, a little.'))],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u3d7_c13', number: 13, title: 'Söhbəti sırala', why: 'Sual, cavab və qarşı sual, sonra dil haqqında cavab düz sıradadır.', hint: 'Əvvəl sual gəlir; cavab verən sualı geri qaytarır.',
      prompt: 'Dil mübadiləsi masası.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: 'Hello! Do you speak Azerbaijani?', from: 'other' }, { en: '2', az: 'Yes, I do. And you?', from: 'B' }, { en: '3', az: "A little. I'm Turkish.", from: 'other' }, { en: '4', az: 'Really? Nice to meet you!', from: 'B' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hello! Do you speak Azerbaijani? → Yes, I do. And you? → A little. I'm Turkish. → Really? Nice to meet you!", 'Sual, cavab və qarşı sual, sonra o biri haradan olduğunu deyir.', 'Do you speak Azerbaijani? — sual; And you? — qarşı sual.', 'Yes, I do. And you?'))],
      review: {
        title: 'Söhbəti sırala', why: 'Sual, “xeyr”, yeni sual və “bəli” düz sıradadır.', hint: 'Əvvəl sual gəlir; “xeyr” eşidən başqa dil soruşur.',
        prompt: 'Hostelin mətbəxi.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: 'Excuse me, do you speak English?', from: 'G' }, { en: '2', az: "No, I don't. Sorry!", from: 'other' }, { en: '3', az: 'Do you speak Russian?', from: 'G' }, { en: '4', az: 'Yes, I do!', from: 'other' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Excuse me, do you speak English? → No, I don't. Sorry! → Do you speak Russian? → Yes, I do!", 'Birinci dil olmadı, qız başqa dil soruşdu.', "No, I don't. — bilmirəm; Yes, I do. — bilirəm.", 'Do you speak Russian? — Yes, I do!'))],
      },
    },
  ],
  result: {
    done: ['Dərs 7 · 2-ci hissə tamamlandı', 'Artıq hansı dildə danışdığını soruşur, dillərini və nə qədər bildiyini deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Dil sualını və qısa cavabları anlamaq', tasks: ['u3d7_c16', 'u3d7_c11', 'u3d7_c17', 'u3d7_c13'] },
      { group: 'Yazı', text: 'Dil haqqında qısa cavab yazmaq', tasks: ['u3d7_c12'] },
      { group: 'Danışıq', text: 'Hansı dillərdə və nə qədər danışdığını demək', tasks: ['u3d7_c15', 'u3d7_c09'] },
    ],
    closing: 'Növbəti dərs — bölmə söhbəti: dil klubunun ziyafəti.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'a little', translation: 'bir az', example: 'I speak a little English.', exampleAz: 'Bir az ingiliscə danışıram.', usageNote: 'a və little birlikdə.', pronunciation: '/ə ˈlɪtəl/', teachCard: 'u3d7_c08' },
    { word: 'language', translation: 'dil', example: 'What language do you speak?', exampleAz: 'Hansı dildə danışırsan?', usageNote: 'Dil adı = millət sözü: Russian, English.', pronunciation: '/ˈlæŋɡwɪdʒ/', teachCard: 'u3d7_c10' },
  ],
};
