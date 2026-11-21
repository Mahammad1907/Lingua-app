// Bölmə 3 · Dərs 7 — Dillər (Do you speak …? · Yes, I do. · No, I don't. · a little · language).
// Dil mübadiləsi masası. Dil adları millət sözləri ilə eynidir (Dərs 3) — yenidən öyrədilmir, qeyddə izah olunur.
// Spiral: Really?, Are you …?, Where are you from?, I live in …, More slowly, please.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, own, resultTexts, SPEAK, SPEAK_MISTAKES } from './shared';

const areYouSpeak = { match: { pattern: String.raw`^are\s+you\s+speak` }, short: 'Bu sualda “are” yox, “do” gəlir.',
  explain: ex('Do you speak Russian?', 'Danışmaq haqqında sualı “Do” başladır.', 'Do you speak Russian? — dil; Are you Russian? — millət.', 'Excuse me, do you speak English?') };
const noLittle = { match: { pattern: String.raw`(?<!\ba\s)\blittle\b` }, short: '“bir az” iki sözdür: a little.',
  explain: ex('Yes, a little.', '“little”dən əvvəl “a” gəlir: a little — bir az.', 'Yes, a little. — düzdür; Yes, little. — olmur.', 'Do you speak English? — Yes, a little.') };

export const lesson7: DesignLesson = {
  id: 'a1_en_b3_d7', order: 32, unit: 3, number: 7, title: 'Dillər', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d7_c01', badge: 'Haradansan', subtitle: 'Dil mübadiləsi masasında kim hansı dildə danışır — soruşursan və deyirsən.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Hansı dildə danışdığını soruşa bilirəm.' },
        { icon: 'wave', text: 'Hansı dillərdə və nə qədər danışdığımı deyə bilirəm.' },
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
      prompt: 'Dil mübadiləsi masasındasan. Yeni tanışın rusca bilib-bilmədiyini öyrənmək istəyirsən.\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
      tiles: ['speak', 'Do', 'Russian', 'you', 'Are', 'Russia', '?'], rule: exact('Do you speak Russian?'),
      variants: [areYouSpeak, other('Sıra: Do you speak Russian?', ex('Do you speak Russian?', 'Do, sonra you speak, sonda dilin adı.', 'Do you speak Russian? — dil; Are you from Russia? — ölkə.', 'Excuse me, do you speak Russian?'))],
      review: {
        title: 'Sualı qur', why: 'Danışmaq haqqında sual “Do” ilə başlayır.', hint: 'Bu dərsin sualı hansı kiçik sözlə başlayır?',
        prompt: 'Hostelin resepsiyasında qonaq fransızca bilib-bilmədiyini öyrənmək istəyirsən.\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
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
      type: 'word', id: 'u3d7_c08', number: 8, scenes: ['mascot/point'],
      word: 'a little', pronunciation: '/ə ˈlɪtəl/', reading: 'ə litl', az: 'bir az',
      structure: ['I speak a little + dil.', 'Yes, a little.'],
      notes: ['“a” və “little” birlikdə gəlir: bir az.'],
      example: 'I speak a little English.', exampleAz: 'Bir az ingiliscə danışıram.',
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
      type: 'choice', id: 'u3d7_c11', number: 11, title: 'Sözü tamamla', why: '“Do you [dil]?” sualına “No, I don’t.” ilə cavab verilir.', hint: 'Sual “Are you” ilə yox, başqa sözlə başlayıb.',
      prompt: 'Dil mübadiləsi masasında yeni tanış oğlandan soruşur: “Do you speak German?”\nOğlan almanca bilmir. Hansı söz çatmır?', gap: { speaker: 'B', before: 'No, I', after: '.' },
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
      type: 'write', id: 'u3d7_c12', number: 12, title: 'Dialoqu tamamla', why: '“a little” — bir az.', hint: 'Bəli de və nə qədər bildiyini iki sözlə əlavə et.',
      prompt: 'Yeni tanış yazır. Sən ingiliscə bir az bilirsən.\nQısa cavab yaz: bəli, bir az.', placeholder: 'Cavabını yaz',
      chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: 'Hi! Do you speak English?' }] },
      rule: exact('Yes, a little.', 'Yes, I do. A little.', 'Yes, I do, a little.', 'A little.', 'Yes, I speak a little English.', 'Yes, I speak English a little.', 'Yes, a little English.'),
      variants: [noLittle, other('Yes, a little.', ex('Yes, a little.', 'Bəli deyirsən və “a little” ilə bir az bildiyini bildirirsən.', "Yes, a little. — bir az; Yes, I do. — bilirəm.", 'Do you speak English? — Yes, a little.'))],
      review: {
        title: 'Dialoqu tamamla', why: '“a little” — bir az.', hint: 'Bəli de və nə qədər bildiyini iki sözlə əlavə et.',
        prompt: 'Hostelin qrup çatında biri yazır. Sən rusca bir az bilirsən.\nQısa cavab yaz: bəli, bir az.', placeholder: 'Cavabını yaz',
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
    done: ['Dərs 7 tamamlandı', 'Artıq hansı dildə danışdığını soruşur, dillərini və nə qədər bildiyini deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Dil sualını və qısa cavabları anlamaq', tasks: ['u3d7_c03', 'u3d7_c07', 'u3d7_c11', 'u3d7_c13'] },
      { group: 'Yazı', text: 'Dil haqqında sual qurmaq və qısa cavab yazmaq', tasks: ['u3d7_c05', 'u3d7_c12'] },
      { group: 'Danışıq', text: 'Hansı dillərdə danışdığını demək', tasks: ['u3d7_c09'] },
    ],
    closing: 'Növbəti dərs — bölmə söhbəti: dil klubunun ziyafəti.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'Do you speak English?', translation: 'İngiliscə danışırsan?', example: 'Excuse me, do you speak English?', exampleAz: 'Bağışlayın, ingiliscə danışırsınız?', usageNote: 'Do you speak + dil?', pronunciation: '/du ju spik ˈɪŋɡlɪʃ/', teachCard: 'u3d7_c02' },
    { word: 'Yes, I do.', translation: 'Bəli, danışıram.', example: 'Do you speak Russian? — Yes, I do.', exampleAz: 'Rusca danışırsan? — Bəli, danışıram.', usageNote: 'Do you [dil]? sualına qısa “bəli”.', pronunciation: '/jɛs aɪ du/', teachCard: 'u3d7_c04' },
    { word: "No, I don't.", translation: 'Xeyr, danışmıram.', example: "Do you speak French? — No, I don't.", exampleAz: 'Fransızca danışırsan? — Xeyr, danışmıram.', usageNote: 'Do you [dil]? sualına qısa “xeyr”.', pronunciation: '/noʊ aɪ doʊnt/', teachCard: 'u3d7_c06' },
    { word: 'a little', translation: 'bir az', example: 'I speak a little English.', exampleAz: 'Bir az ingiliscə danışıram.', usageNote: 'a və little birlikdə.', pronunciation: '/ə ˈlɪtəl/', teachCard: 'u3d7_c08' },
    { word: 'language', translation: 'dil', example: 'What language do you speak?', exampleAz: 'Hansı dildə danışırsan?', usageNote: 'Dil adı = millət sözü: Russian, English.', pronunciation: '/ˈlæŋɡwɪdʒ/', teachCard: 'u3d7_c10' },
  ],
};
