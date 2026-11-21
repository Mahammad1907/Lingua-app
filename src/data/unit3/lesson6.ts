// Bölmə 3 · Dərs 6 — Harada yaşayırsan? (Where do you live? · I live in … · city · but · here).
// Kafe və şəhər turu avtobusu. Hədəf: “I'm from Ganja, but I live in Baku.”
// Səhvlər: “I live at Baku”, “I'm live in …”, “Where are you live?”, from ↔ live qarışığı.
// Spiral: Where are you from? I'm from … Me too. (Dərs 1), He's / She's from … (Dərs 5), Really?
import type { DesignLesson, Variant } from '../designLessonTypes';
import { ex, goal, other, pick } from '../unit1/build';
import { FROM_LIVE, FROM_MISTAKES, LIVE, LIVE_MISTAKES, notices, own, resultTexts, said } from './shared';

const myCity = own(LIVE, 'I live in [şəhər]');
const fromLive = own(FROM_LIVE, "I'm from [ölkə], but I live in [şəhər]");
const fromBut = (from: string, live: string) =>
  said(String.raw`^i(?:'m|’m|\s+am)\s+from\s+${from.toLowerCase()}\s*,?\s+but\s+i\s+live\s+in\s+${live.toLowerCase()}\s*[.!]?$`, `I'm from ${from}, but I live in ${live}.`);
const andNotBut = (answer: string): Variant => ({
  match: { pattern: String.raw`\band\s+i\s+live\b` }, short: 'Burada “amma” lazımdır — but.',
  explain: ex(answer, 'Bir yerdənsən, amma başqa yerdə yaşayırsan — iki fərqli şey: but.', 'Burada “amma” deyirik — but I live. (“and” də düzgündür, amma bu tapşırıq “amma” fərqini öyrədir.)', "I'm from Ganja, but I live in Baku."),
});
const whereLive = goal(['askLive'], ['Where do you live?']);
const whereFrom = goal(['askFrom'], ['Where are you from?']);

export const lesson6: DesignLesson = {
  id: 'a1_en_b3_d6', order: 31, unit: 3, number: 6, title: 'Harada yaşayırsan?', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d6_c01', badge: 'Haradansan', subtitle: 'Kafedə və şəhər turu avtobusunda harada yaşadığını deyirsən.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Harada yaşadığını soruşanı anlayıram.' },
        { icon: 'wave', text: 'Harada yaşadığımı deyirəm: “I live in Baku.”' },
        { icon: 'bye', text: 'Haradan olduğumu və harada yaşadığımı bir cümlədə deyirəm.' },
      ],
    },
    {
      type: 'word', id: 'u3d6_c02', number: 2, scenes: ['mascot/ask'],
      word: 'Where do you live?', pronunciation: '/wɛr du ju lɪv/', reading: 'uer du yu liv?', az: 'Harada yaşayırsan?',
      notes: ['do — sualı qurur, How do you spell it? kimi.'],
      example: 'Hi! Where do you live?', exampleAz: 'Salam! Harada yaşayırsan?',
    },
    {
      type: 'choice', id: 'u3d6_c03', number: 3, title: 'Dinlə və seç', why: '“live” — yaşamaq.', hint: 'Sualın sonundakı yeni sözə qulaq as.',
      prompt: 'Kafedə yeni tanışla oturmusan.\nO nəyi soruşur?', audio: 'Where do you live?',
      options: ['Haradan olduğunu', 'Harada yaşadığını', 'Adını'], answer: 'Harada yaşadığını',
      variants: [
        pick('Haradan olduğunu', 'Haradan olduğunu soruşsaydı, “from” deyərdi.', ex('Harada yaşadığını', 'Səsdə “from” yox, “live” var.', 'Where do you live? — yaşayırsan; Where are you from? — haradansan.', 'Hi! Where do you live?')),
        pick('Adını', 'Ad üçün “name” deyilir.', ex('Harada yaşadığını', 'Səsdə “name” yoxdur, “live” var.', "Where do you live? — yer; What's your name? — ad.", 'Hi! Where do you live?')),
      ],
      review: {
        title: 'Dinlə və seç', why: '“live” — yaşamaq.', hint: 'Sualın sonundakı sözə qulaq as.',
        prompt: 'Şəhər turu avtobusunda bələdçi səninlə tanış olur.\nO nəyi soruşur?', audio: 'Nice to meet you! Where do you live?',
        options: ['Necə olduğunu', 'Harada yaşadığını', 'Haradan olduğunu'], answer: 'Harada yaşadığını',
        variants: [
          pick('Necə olduğunu', 'Hal soruşsaydı, “How are you?” deyərdi.', ex('Harada yaşadığını', 'Səsdə “How are you?” yox, “Where do you live?” var.', 'Where do you live? — yer; How are you? — hal.', 'Hi! Where do you live?')),
          pick('Haradan olduğunu', 'Haradan olduğunu soruşsaydı, “from” deyərdi.', ex('Harada yaşadığını', 'Səsdə “from” yox, “live” var.', 'Where do you live? — yaşayırsan; Where are you from? — haradansan.', 'Hi! Where do you live?')),
        ],
      },
    },
    {
      type: 'word', id: 'u3d6_c04', number: 4, scenes: ['mascot/point'],
      word: 'I live in [şəhər]', pronunciation: '/aɪ lɪv ɪn/', reading: 'ay liv in [şəhər]', az: 'Mən [şəhər]-da yaşayıram.',
      structure: ['I live in + şəhər / ölkə.'],
      notes: ['“-da, -də” şəkilçisi ingiliscə şəhərdən əvvəl gəlir: in Baku.'],
      example: 'Where do you live? — I live in Baku.', exampleAz: 'Harada yaşayırsan? — Bakıda yaşayıram.',
    },
    {
      type: 'voice', id: 'u3d6_c05', number: 5, title: 'Səslə cavab', why: 'Harada yaşadığını dedin.', hint: '“-da” ingiliscə şəhərdən əvvəl ayrıca gəlir.',
      prompt: 'Kafedə yeni tanış soruşur.\nHarada yaşadığını de.', audio: 'Where do you live?', reply: 'Nice!',
      rule: myCity,
      variants: [...LIVE_MISTAKES, other('I live in + şəhər.', ex('I live in [şəhər]', 'Harada yaşadığını I live in ilə deyirsən.', "I live in Baku. — yaşayıram; I'm from Baku. — Bakıdanam.", 'Where do you live? — I live in Ganja.'))],
      review: {
        title: 'Səslə cavab', why: 'Harada yaşadığını dedin.', hint: '“-da” ingiliscə şəhərdən əvvəl ayrıca gəlir.',
        prompt: 'Şəhər turu avtobusunda bələdçi hər kəsdən soruşur.\nHarada yaşadığını de.', audio: 'And you? Where do you live?', reply: 'OK, thanks!',
        rule: myCity,
        variants: [...LIVE_MISTAKES, other('I live in + şəhər.', ex('I live in [şəhər]', 'Harada yaşadığını I live in ilə deyirsən.', "I live in Ganja. — yaşayıram; I'm from Ganja. — Gəncədənəm.", 'Where do you live? — I live in Baku.'))],
      },
    },
    {
      type: 'word', id: 'u3d6_c06', number: 6, scenes: ['mascot/globe'],
      word: 'city', pronunciation: '/ˈsɪti/', reading: 'siti', az: 'şəhər',
      notes: ['Ölkə — country, şəhər — city.'],
      example: 'What city are you from? — Ganja.', exampleAz: 'Hansı şəhərdənsən? — Gəncədən.',
    },
    {
      type: 'match', id: 'u3d6_c07', number: 7, title: 'Kim nə dedi?', why: 'from və live fərqini tapdın.', hint: 'from — haradan, live — harada yaşamaq.',
      prompt: 'Kafedə hər kəs özü haqqında danışır.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'I live in Baku.', az: 'Bakıda yaşayıram.', from: 'G' }, { en: "I'm from Baku.", az: 'Bakıdanam.', from: 'B' }, { en: 'What city are you from?', az: 'Hansı şəhərdənsən?', from: 'other' }],
      extra: ['Hansı ölkədənsən?'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex("I live in Baku. — Bakıda yaşayıram.; I'm from Baku. — Bakıdanam.; What city are you from? — Hansı şəhərdənsən?", 'from haradan olduğunu, live harada yaşadığını deyir; city şəhərdir.', "I live in Baku. — yaşayıram; I'm from Baku. — Bakıdanam.", 'What city are you from? — Ganja.'))],
      review: {
        title: 'Kim nə dedi?', why: 'from və live fərqini tapdın.', hint: 'Əvvəl sualı tap, sonra iki cavabı ayır.',
        prompt: 'Şəhər turu avtobusunda tanışlıq.\nHər cümləyə mənasını qoş.',
        rows: [{ en: "I'm from Ganja.", az: 'Gəncədənəm.', from: 'other' }, { en: 'I live in Ganja.', az: 'Gəncədə yaşayıram.', from: 'G' }, { en: 'Where do you live?', az: 'Harada yaşayırsan?', from: 'B' }],
        extra: ['Haradansan?'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("I'm from Ganja. — Gəncədənəm.; I live in Ganja. — Gəncədə yaşayıram.; Where do you live? — Harada yaşayırsan?", 'from haradan olduğunu, live harada yaşadığını deyir.', 'Where do you live? — yaşayırsan; Where are you from? — haradansan.', 'Where do you live? — I live in Ganja.'))],
      },
    },
    {
      type: 'word', id: 'u3d6_c08', number: 8, scenes: ['mascot/think'],
      word: 'but', pronunciation: '/bʌt/', reading: 'bat', az: 'amma',
      notes: ['İki fərqli fikri birləşdirir.'],
      example: "I'm from Ganja, but I live in Baku.", exampleAz: 'Gəncədənəm, amma Bakıda yaşayıram.',
    },
    {
      type: 'write', id: 'u3d6_c09', number: 9, title: 'Mesaj yaz', why: 'Haradan olduğunu və harada yaşadığını but ilə birləşdirdin.', hint: 'Əvvəl haradan olduğun, sonra “amma”, sonra harada yaşadığın.', scenes: ['u3/cafe'],
      prompt: 'Kafedə tanış olduğun qıza mesaj yazırsan: Şəkidənsən, amma Bakıda yaşayırsan.\nSözlərdən cümlə qur.', placeholder: 'Sözlərə toxun',
      tiles: ["I'm", 'from', 'Shaki,', 'but', 'I', 'live', 'in', 'Baku', 'at', 'and', '.'], rule: fromBut('Shaki', 'Baku'),
      variants: [andNotBut("I'm from Shaki, but I live in Baku."), ...LIVE_MISTAKES, other("I'm from Shaki, but I live in Baku.", ex("I'm from Shaki, but I live in Baku.", 'Əvvəl from + şəhər, sonra but, sonra I live in + şəhər.', "I'm from Shaki. — haradan; I live in Baku. — harada.", "I'm from Ganja, but I live in Baku."))],
      review: {
        title: 'Mesaj yaz', why: 'Haradan olduğunu və harada yaşadığını but ilə birləşdirdin.', hint: 'Əvvəl haradan olduğun, sonra “amma”, sonra harada yaşadığın.',
        prompt: 'Şəhər turunun qrup çatına özün haqqında yazırsan: Lənkərandansan, amma Gəncədə yaşayırsan.\nSözlərdən cümlə qur.', placeholder: 'Sözlərə toxun',
        tiles: ['live', "I'm", 'Lankaran,', 'from', 'but', 'in', 'I', 'Ganja', 'and', 'at', '.'], rule: fromBut('Lankaran', 'Ganja'),
        variants: [andNotBut("I'm from Lankaran, but I live in Ganja."), ...LIVE_MISTAKES, other("I'm from Lankaran, but I live in Ganja.", ex("I'm from Lankaran, but I live in Ganja.", 'Əvvəl from + şəhər, sonra but, sonra I live in + şəhər.', "I'm from Lankaran. — haradan; I live in Ganja. — harada.", "I'm from Ganja, but I live in Baku."))],
      },
    },
    {
      type: 'word', id: 'u3d6_c10', number: 10, scenes: ['mascot/wave'],
      word: 'here', pronunciation: '/hɪr/', reading: 'hir', az: 'burada',
      notes: ['Şəhərin adını demək əvəzinə: I live here.'],
      example: "I'm from Ganja, but I live here.", exampleAz: 'Gəncədənəm, amma burada yaşayıram.',
    },
    {
      type: 'choice', id: 'u3d6_c11', number: 11, title: 'Sözü tamamla', why: '“here” — burada, yəni Bakıda.', hint: 'Avtobus hansı şəhərdədir? Bəs qadın indi haradadır?',
      prompt: 'Bakıda şəhər turu avtobusundasan. Yanındakı qadın özü haqqında danışır.\nHansı söz çatmır?', gap: { speaker: 'other', before: "I'm from Turkey, but I live", after: '.' },
      options: ['here', 'in', 'from'], answer: 'here',
      variants: [
        pick('in', '“in”dən sonra şəhərin adı gəlməlidir.', ex('here', 'Şəhərin adı yoxdur — onda “burada”: here.', 'I live here. — burada; I live in Baku. — Bakıda.', "I'm from Ganja, but I live here.")),
        pick('from', '“from” haradan olduğunu deyir, yaşadığın yeri yox.', ex('here', 'live-dan sonra yer gəlir: burada — here.', "I live here. — yaşayıram; I'm from Turkey. — haradan.", "I'm from Ganja, but I live here.")),
      ],
      review: {
        title: 'Sözü tamamla', why: '“here” — burada, yəni Gəncədə.', hint: 'Kafe hansı şəhərdədir? Bəs kişi indi haradadır?',
        prompt: 'Gəncədə kafedəsən. Yeni tanış kişi özü haqqında danışır.\nHansı söz çatmır?', gap: { speaker: 'other', before: "I'm from Germany, but I live", after: '.' },
        options: ['from', 'here', 'in'], answer: 'here',
        variants: [
          pick('in', '“in”dən sonra şəhərin adı gəlməlidir.', ex('here', 'Şəhərin adı yoxdur — onda “burada”: here.', 'I live here. — burada; I live in Ganja. — Gəncədə.', "I'm from Ganja, but I live here.")),
          pick('from', '“from” haradan olduğunu deyir, yaşadığın yeri yox.', ex('here', 'live-dan sonra yer gəlir: burada — here.', "I live here. — yaşayıram; I'm from Germany. — haradan.", "I'm from Ganja, but I live here.")),
        ],
      },
    },
    {
      type: 'voice', id: 'u3d6_c12', number: 12, title: 'Özün haqqında de', why: 'Haradan olduğunu və harada yaşadığını dedin.', hint: 'İki hissə: əvvəl haradan olduğun, sonra harada yaşadığın.',
      prompt: 'Şəhər turu avtobusunda bələdçi səninlə tanış olur.\nDe: haradansan və harada yaşayırsan.', audio: 'Where are you from? And where do you live?', reply: 'Nice to meet you!',
      rule: fromLive,
      variants: [...FROM_MISTAKES, ...LIVE_MISTAKES, other("I'm from [ölkə], but I live in [şəhər]", ex("I'm from [ölkə], but I live in [şəhər]", 'Əvvəl haradan olduğunu, sonra harada yaşadığını de.', "I'm from Ganja. — haradan; I live in Baku. — harada.", "I'm from Ganja, but I live in Baku."))],
      review: {
        title: 'Özün haqqında de', why: 'Haradan olduğunu və harada yaşadığını dedin.', hint: 'İki hissə: əvvəl haradan olduğun, sonra harada yaşadığın.',
        prompt: 'Kafedə yeni tanış qadın səndən soruşur.\nDe: haradansan və harada yaşayırsan.', audio: "I'm from England, but I live here. And you?", reply: 'Really? Nice!',
        rule: fromLive,
        variants: [...FROM_MISTAKES, ...LIVE_MISTAKES, other("I'm from [ölkə], but I live in [şəhər]", ex("I'm from [ölkə], but I live in [şəhər]", 'Əvvəl haradan olduğunu, sonra harada yaşadığını de.', "I'm from Shaki. — haradan; I live in Ganja. — harada.", "I'm from Ganja, but I live in Baku."))],
      },
    },
    {
      type: 'two', id: 'u3d6_c13', number: 13, title: 'İki mesaj yaz', why: 'Haradan olduğunu və harada yaşadığını soruşdun.', hint: 'Birinci mesajda haradan, ikincidə harada yaşadığını soruş.',
      prompt: 'Kafedə tanış olduğun yeni tanış sənə mesaj yazdı: “Hi!”\nİki mesaj yaz:\n1. Haradan olduğunu soruş.\n2. Harada yaşadığını soruş.',
      fields: [
        { id: 'u3d6_c13a', label: 'Birinci mesaj', placeholder: 'Haradan olduğunu soruş', rule: whereFrom, purpose: 'haradan olduğunu soruşmaq', empty: 'Birinci mesajı da yaz.' },
        { id: 'u3d6_c13b', label: 'İkinci mesaj', placeholder: 'Harada yaşadığını soruş', rule: whereLive, purpose: 'harada yaşadığını soruşmaq', empty: 'İkinci mesajı da yaz.' },
      ],
      variants: [
        { field: 'u3d6_c13a', match: { other: true }, explain: ex('Where are you from?', 'Bu mesajda haradan olduğunu soruşursan.', 'Where are you from? — haradan; Where do you live? — harada yaşayır.', "Hi! Where are you from?") },
        { field: 'u3d6_c13b', match: { other: true }, explain: ex('Where do you live?', 'Bu mesajda harada yaşadığını soruşursan.', 'Where do you live? — harada yaşayır; Where are you from? — haradan.', 'Hi! Where do you live?') },
      ],
      review: {
        title: 'İki mesaj yaz', why: 'Harada yaşadığını və haradan olduğunu soruşdun.', hint: 'Birinci mesajda harada yaşadığını, ikincidə haradan olduğunu soruş.',
        prompt: 'Şəhər turunun qrup çatına yeni üzv qoşuldu.\nİki mesaj yaz:\n1. Harada yaşadığını soruş.\n2. Haradan olduğunu soruş.',
        fields: [
          { id: 'u3d6_c13b', label: 'Birinci mesaj', placeholder: 'Harada yaşadığını soruş', rule: whereLive, purpose: 'harada yaşadığını soruşmaq', empty: 'Birinci mesajı da yaz.' },
          { id: 'u3d6_c13a', label: 'İkinci mesaj', placeholder: 'Haradan olduğunu soruş', rule: whereFrom, purpose: 'haradan olduğunu soruşmaq', empty: 'İkinci mesajı da yaz.' },
        ],
        variants: [
          { field: 'u3d6_c13b', match: { other: true }, explain: ex('Where do you live?', 'Bu mesajda harada yaşadığını soruşursan.', 'Where do you live? — harada yaşayır; Where are you from? — haradan.', 'Hi! Where do you live?') },
          { field: 'u3d6_c13a', match: { other: true }, explain: ex('Where are you from?', 'Bu mesajda haradan olduğunu soruşursan.', 'Where are you from? — haradan; Where do you live? — harada yaşayır.', 'Hi! Where are you from?') },
        ],
      },
    },
  ],
  result: {
    done: ['Dərs 6 tamamlandı', 'Artıq harada yaşadığını deyir, haradan olduğunla birlikdə but ilə birləşdirə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Harada yaşadığını soruşanı anlamaq; from və live fərqi', tasks: ['u3d6_c03', 'u3d6_c07', 'u3d6_c11'] },
      { group: 'Yazı', text: 'But ilə cümlə qurmaq və iki sual yazmaq', tasks: ['u3d6_c09', 'u3d6_c13'] },
      { group: 'Danışıq', text: 'Harada yaşadığını və haradan olduğunu demək', tasks: ['u3d6_c05', 'u3d6_c12'] },
    ],
    closing: 'Növbəti dərs — hansı dildə danışırsan?', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'Where do you live?', translation: 'Harada yaşayırsan?', example: 'Hi! Where do you live?', exampleAz: 'Salam! Harada yaşayırsan?', usageNote: 'do — sualı qurur.', pronunciation: '/wɛr du ju lɪv/', teachCard: 'u3d6_c02' },
    { word: 'I live in [şəhər]', translation: 'Mən [şəhər]-da yaşayıram.', example: 'Where do you live? — I live in Baku.', exampleAz: 'Harada yaşayırsan? — Bakıda yaşayıram.', usageNote: 'Şəhərdən əvvəl in.', pronunciation: '/aɪ lɪv ɪn/', teachCard: 'u3d6_c04' },
    { word: 'city', translation: 'şəhər', example: 'What city are you from? — Ganja.', exampleAz: 'Hansı şəhərdənsən? — Gəncədən.', usageNote: 'Ölkə — country, şəhər — city.', pronunciation: '/ˈsɪti/', teachCard: 'u3d6_c06' },
    { word: 'but', translation: 'amma', example: "I'm from Ganja, but I live in Baku.", exampleAz: 'Gəncədənəm, amma Bakıda yaşayıram.', usageNote: 'İki fərqli fikri birləşdirir.', pronunciation: '/bʌt/', teachCard: 'u3d6_c08' },
    { word: 'here', translation: 'burada', example: "I'm from Ganja, but I live here.", exampleAz: 'Gəncədənəm, amma burada yaşayıram.', usageNote: 'Şəhərin adı əvəzinə.', pronunciation: '/hɪr/', teachCard: 'u3d6_c10' },
  ],
};
