// Bölmə 2 · Dərs 6 — E-poçt (email · What's your email? · dot · at; com və mail tanıma üçün dot kartının nümunəsindədir).
// Ofisdə yeni iş yoldaşı. Spiral: hərf-hərf (Dərs 4), double, Is that right? / Yes, that's right. (Dərs 2), first/last name (Dərs 5).
import type { DesignLesson } from '../designLessonTypes';
import type { Variant } from '../designLessonTypes';
import { ex, exact, goal, other, pick } from '../unit1/build';
import { EMAIL, EMAIL_SAID, NAME, notices, own, resultTexts } from './shared';

const askEmail = goal(['askEmail'], ["What's your email?"]);
const MY = "It's K-B at mail dot com.";
/** The address written as words instead of @ and “.”. */
const asWords = (address: string, words: string): Variant => ({
  match: { words: [words] }, short: 'Sözlər yox, işarələr yaz: @ və nöqtə.',
  explain: ex(address, '“at” @ ilə, “dot” nöqtə ilə yazılır.', 'at — @; dot — nöqtə.', MY),
});

export const lesson6: DesignLesson = {
  id: 'a1_en_b2_d6', order: 17, unit: 2, number: 6, title: 'E-poçt', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d6_c01', badge: 'Şəxsi məlumat', subtitle: 'Ofisdə ilk günündür: e-poçt ünvanları mübadiləsi.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Eşitdiyim e-poçt ünvanını yaza bilirəm.' },
        { icon: 'wave', text: 'E-poçtumu soruşub deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u2d6_c02', number: 2, scenes: ['u2/word-email'],
      word: 'email', pronunciation: '/ˈimeɪl/', reading: 'imeyl', az: 'e-poçt',
      notes: ['Həm ünvan, həm məktub üçün deyilir.'],
      example: 'Email, please.', exampleAz: 'E-poçt, zəhmət olmasa.',
    },
    {
      type: 'choice', id: 'u2d6_c03', number: 3, title: 'Dinlə və anla', why: '“email” — e-poçt.', hint: 'Səsdəki yeni sözə qulaq as.',
      prompt: 'Ofisdə ilk günündür. İş yoldaşı sənə forma verib deyir.\nO nə istəyir?', audio: 'Email, please.',
      options: ['E-poçt ünvanını istəyir.', 'Telefon nömrəni istəyir.', 'Adını hərf-hərf istəyir.'], answer: 'E-poçt ünvanını istəyir.',
      variants: [
        pick('Telefon nömrəni istəyir.', 'Səsdə “phone number” yoxdur.', ex('E-poçt ünvanını istəyir.', 'Səsdə “email” deyilir, “phone number” yox.', 'Email, please. — e-poçt; Phone number, please. — nömrə.', 'Email, please.')),
        pick('Adını hərf-hərf istəyir.', 'Səsdə “spell” yoxdur.', ex('E-poçt ünvanını istəyir.', 'Səsdə “email” deyilir, “spell” yox.', 'Email, please. — e-poçt; Can you spell it, please? — hərf-hərf.', 'Email, please.')),
      ],
      review: {
        title: 'Dinlə və anla', why: 'Nömrə və e-poçt istəyir.', hint: 'Səsdə iki şey istənilir — ikisini də tut.',
        prompt: 'Otel resepsiyasında qeydiyyatdasan. Resepsiyaçı deyir.\nO nə istəyir?', audio: 'Phone number and email, please.',
        options: ['Yalnız adını istəyir.', 'Nömrəni və e-poçtunu istəyir.', 'Soyadını soruşur.'], answer: 'Nömrəni və e-poçtunu istəyir.',
        variants: [
          pick('Yalnız adını istəyir.', 'Səsdə “name” yoxdur.', ex('Nömrəni və e-poçtunu istəyir.', 'Səsdə “phone number” və “email” deyilir.', 'Phone number — nömrə; email — e-poçt.', 'Phone number and email, please.')),
          pick('Soyadını soruşur.', 'Səsdə “last name” yoxdur.', ex('Nömrəni və e-poçtunu istəyir.', 'Səsdə “phone number” və “email” deyilir.', 'Phone number — nömrə; last name — soyad.', 'Phone number and email, please.')),
        ],
      },
    },
    {
      type: 'word', id: 'u2d6_c04', number: 4, scenes: ['u2/word-whats-email'],
      word: "What's your email?", pronunciation: '/wʌts jʊr ˈimeɪl/', reading: 'uats yor imeyl?', az: 'E-poçtun nədir?',
      example: "Hi! What's your email?", exampleAz: 'Salam! E-poçtun nədir?',
    },
    {
      type: 'write', id: 'u2d6_c05', number: 5, title: 'Sualı qur', why: 'E-poçtunu soruşdun.', hint: 'Telefon yox, e-poçt soruşursan.',
      prompt: 'Ofisdə yeni iş yoldaşına yazırsan.\nSözlərdən onun e-poçtunu soruşan sual qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Yeni iş yoldaşı', from: 'B', lines: [{ from: 'B', text: 'Hi! Nice to meet you!' }] },
      tiles: ["What's", 'email', 'your', 'phone', 'my', 'is', '?'], rule: exact("What's your email?"),
      variants: [other("What's your email?", ex("What's your email?", 'Burada e-poçt soruşulur, telefon yox.', "What's your email? — e-poçt; What's your phone number? — nömrə.", "Hi! What's your email?"))],
      review: {
        title: 'Sualı qur', why: 'E-poçtunu soruşdun.', hint: 'Telefon yox, e-poçt soruşursan.',
        prompt: 'Kurs yoldaşın evə gedir. Onun e-poçtunu soruş.\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'Kurs yoldaşı', from: 'G', lines: [{ from: 'G', text: 'OK, bye!' }] },
        tiles: ['email', "What's", 'number', 'your', 'name', '?'], rule: exact("What's your email?"),
        variants: [other("What's your email?", ex("What's your email?", 'Burada e-poçt soruşulur.', "What's your email? — e-poçt; What's your name? — ad.", "What's your email?"))],
      },
    },
    {
      type: 'word', id: 'u2d6_c06', number: 6, scenes: ['u2/word-dot'],
      word: 'dot', pronunciation: '/dɑt/', reading: 'dat', az: 'nöqtə (.)',
      notes: ['E-poçtda nöqtə “dot” deyilir; com ünvanın sonudur.'],
      example: 'mail dot com', exampleAz: 'mail.com',
    },
    {
      type: 'match', id: 'u2d6_c07', number: 7, title: 'Kim nə dedi?', why: 'Hər sözün mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun sözü yerinə qoy.',
      prompt: 'Ofisdə eşitdiklərin.\nHər birinə mənasını qoş.',
      rows: [{ en: 'dot', az: 'nöqtə (.)', from: 'B' }, { en: "What's your email?", az: 'E-poçtun nədir?', from: 'G' }, { en: 'Email, please.', az: 'E-poçt, zəhmət olmasa.', from: 'M' }],
      extra: ['Telefon nömrən nədir?'],
      variants: [other('Bir mənası yerində deyil.', ex("dot — nöqtə (.); What's your email? — E-poçtun nədir?; Email, please. — E-poçt, zəhmət olmasa.", 'Sual və xahiş fərqlidir; dot — nöqtədir.', "What's your email? — sual; Email, please. — xahiş.", 'mail dot com'))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər sözün mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun sözü yerinə qoy.',
        prompt: 'E-poçt sözləri.\nHər birinə mənasını qoş.',
        rows: [{ en: 'at', az: '@', from: 'B' }, { en: 'dot', az: '.', from: 'G' }, { en: "What's your phone number?", az: 'Telefon nömrən nədir?', from: 'M' }],
        extra: ['E-poçtun nədir?'],
        variants: [other('Bir mənası yerində deyil.', ex("at — @; dot — .; What's your phone number? — Telefon nömrən nədir?", 'at — @ işarəsi, dot — nöqtə.', 'at — @; dot — nöqtə.', MY))],
      },
    },
    {
      type: 'word', id: 'u2d6_c08', number: 8, scenes: ['u2/word-at'],
      word: 'at', pronunciation: '/æt/', reading: 'ət', az: '@ (e-poçtda)',
      notes: ['@ işarəsi “at” deyilir, “et” yox.'],
      example: MY, exampleAz: 'kb@mail.com',
    },
    {
      type: 'write', id: 'u2d6_c09', number: 9, title: 'Dinlə və yaz', why: 'abbasova@mail.com — double B, @ və nöqtə.', hint: 'Hərfləri bir-bir yaz; qoşa hərfə diqqət et, ünvanda boşluq olmur.',
      prompt: 'İş yoldaşın müdirin (Ms Abbasova) e-poçtunu hərf-hərf deyir.\nÜnvanı yaz.', audio: "It's A-double B-A-S-O-V-A at mail dot com.", placeholder: 'E-poçt ünvanı',
      rule: exact('abbasova@mail.com'),
      variants: [asWords('abbasova@mail.com', 'abbasova at mail dot com'), other('Ünvanı yoxla.', ex('abbasova@mail.com', '“double B” — BB, sonra @, mail, nöqtə, com.', 'double B — BB; at — @.', "It's A-double B-A-S-O-V-A at mail dot com."))],
      review: {
        title: 'Dinlə və yaz', why: 'guliyev7@mail.com — hərflər, rəqəm, @ və nöqtə.', hint: 'Hərfləri və rəqəmi bir-bir yaz; ünvanda boşluq olmur.',
        prompt: 'Kursda müəllim öz e-poçtunu deyir.\nÜnvanı yaz.', audio: "It's G-U-L-I-Y-E-V seven at mail dot com.", placeholder: 'E-poçt ünvanı',
        rule: exact('guliyev7@mail.com'),
        variants: [asWords('guliyev7@mail.com', 'guliyev7 at mail dot com'), other('Ünvanı yoxla.', ex('guliyev7@mail.com', 'Hərflər G-U-L-I-Y-E-V, rəqəm 7, sonra @, mail, nöqtə, com.', 'at — @; dot — nöqtə.', "It's G-U-L-I-Y-E-V seven at mail dot com."))],
      },
    },
    {
      type: 'voice', id: 'u2d6_c10', number: 10, title: 'E-poçtunu de', why: 'Ünvanını dedin: @ — at, nöqtə — dot.', hint: 'Ünvanı hərf-hərf de; işarələri ingiliscə de.',
      prompt: 'Yeni iş yoldaşı soruşur: “What\'s your email?”\nÖz e-poçtunu de (istəsən, uydurma).', audio: "What's your email?", reply: 'Thanks!',
      rule: own(EMAIL_SAID, MY),
      variants: [other("It's … at … dot com.", ex(MY, '@ “at”, nöqtə “dot” deyilir, “et” və “nöqtə” yox.', 'at — @; dot — nöqtə.', "It's G-A-N-J-A five at mail dot com."))],
      review: {
        title: 'E-poçtunu de', why: 'Ünvanını dedin: @ — at, nöqtə — dot.', hint: 'Ünvanı hərf-hərf de; işarələri ingiliscə de.',
        prompt: 'İdman zalının qəbulu soruşur: “Email, please.”\nÖz e-poçtunu de (istəsən, uydurma).', audio: 'Email, please.', reply: 'Thank you!',
        rule: own(EMAIL_SAID, MY),
        variants: [other("It's … at … dot com.", ex(MY, '@ “at”, nöqtə “dot” deyilir.', 'at — @; dot — nöqtə.', MY))],
      },
    },
    {
      type: 'choice', id: 'u2d6_c11', number: 11, title: 'Sözü tamamla', why: '@ — at.', hint: '@ işarəsi ingiliscə necə deyilir? Azərbaycanca oxunuşa aldanma.',
      prompt: 'Oğlan e-poçtunu deyir: kb@mail.com.\nHansı söz çatmır?', gap: { speaker: 'B', before: "It's K-B", after: 'mail dot com.' },
      options: ['at', 'et', 'dot'], answer: 'at',
      variants: [
        pick('et', '“et” ingiliscə söz deyil.', ex('at', '@ işarəsi ingiliscə “at” deyilir, “et” yox.', 'at — @; dot — nöqtə.', MY)),
        pick('dot', '“dot” nöqtədir.', ex('at', 'Bu yerdə @ var, nöqtə yox.', 'at — @; dot — nöqtə.', MY)),
      ],
      review: {
        title: 'Sözü tamamla', why: '. — dot.', hint: 'Nöqtə ingiliscə necə deyilir? Azərbaycanca sözə aldanma.',
        prompt: 'Qız e-poçtunu deyir: ganja5@mail.com.\nHansı söz çatmır?', gap: { speaker: 'G', before: "It's G-A-N-J-A five at mail", after: 'com.' },
        options: ['dot', 'nöqtə', 'at'], answer: 'dot',
        variants: [
          pick('nöqtə', 'İngiliscə ünvanda nöqtə “dot” deyilir.', ex('dot', 'Nöqtə ingiliscə “dot” deyilir.', 'dot — nöqtə; at — @.', "It's G-A-N-J-A five at mail dot com.")),
          pick('at', '“at” @ işarəsidir.', ex('dot', 'Bu yerdə nöqtə var, @ yox.', 'at — @; dot — nöqtə.', "It's G-A-N-J-A five at mail dot com.")),
        ],
      },
    },
    {
      type: 'two', id: 'u2d6_c12', number: 12, title: 'Formanı doldur', why: 'Adını, soyadını və e-poçtunu yazdın.', hint: 'Hər sətrin başlığını oxu; e-poçtda @ və nöqtə olmalıdır.', scenes: ['u2/form-office'],
      prompt: 'Ofisdə ilk günündür.\nYeni işçi vərəqini doldur (istəsən, uydurma e-poçt yaz).', form: { title: 'Yeni işçi', subtitle: 'Ofis qeydiyyatı' },
      fields: [
        { id: 'u2d6_c12a', label: 'First name', placeholder: '…', rule: own(NAME, '…'), purpose: 'adını yazmaq', empty: 'Adını da yaz.' },
        { id: 'u2d6_c12b', label: 'Last name', placeholder: '…', rule: own(NAME, 'Mammadova'), purpose: 'soyadını yazmaq', empty: 'Soyadını da yaz.' },
        { id: 'u2d6_c12c', label: 'Email', placeholder: '…', rule: own(EMAIL, 'ganja5@mail.com'), purpose: 'e-poçtunu yazmaq', empty: 'E-poçtunu da yaz.' },
      ],
      variants: [
        { field: 'u2d6_c12a', match: { other: true }, explain: ex('…', 'Bu sətirdə yalnız adın lazımdır.', 'First name — adın; Last name — soyadın.', 'My first name is …') },
        { field: 'u2d6_c12b', match: { other: true }, explain: ex('Mammadova', 'Bu sətirdə yalnız soyadın lazımdır.', 'First name — adın; Last name — soyadın.', 'My last name is Mammadova.') },
        { field: 'u2d6_c12c', match: { other: true }, explain: ex('ganja5@mail.com', 'Ünvanda @ və nöqtə olur, söz yox.', 'at — @; dot — nöqtə.', MY) },
      ],
      review: {
        title: 'Formanı doldur', why: 'Adını, soyadını və e-poçtunu yazdın.', hint: 'Hər sətrin başlığını oxu; sıra fərqli ola bilər.', scenes: ['u2/form-library'],
        prompt: 'Kitabxanaya yazılırsan.\nVərəqi doldur (istəsən, uydurma e-poçt yaz).', form: { title: 'Kitabxana', subtitle: 'Yeni oxucu' },
        fields: [
          { id: 'u2d6_c12c', label: 'Email', placeholder: '…', rule: own(EMAIL, 'ganja5@mail.com'), purpose: 'e-poçtunu yazmaq', empty: 'E-poçtunu da yaz.' },
          { id: 'u2d6_c12b', label: 'Last name', placeholder: '…', rule: own(NAME, 'Mammadova'), purpose: 'soyadını yazmaq', empty: 'Soyadını da yaz.' },
          { id: 'u2d6_c12a', label: 'First name', placeholder: '…', rule: own(NAME, '…'), purpose: 'adını yazmaq', empty: 'Adını da yaz.' },
        ],
        variants: [
          { field: 'u2d6_c12c', match: { other: true }, explain: ex('ganja5@mail.com', 'Ünvanda @ və nöqtə olur, söz yox.', 'at — @; dot — nöqtə.', MY) },
          { field: 'u2d6_c12b', match: { other: true }, explain: ex('Mammadova', 'Bu sətirdə yalnız soyadın lazımdır.', 'Last name — soyadın; First name — adın.', 'My last name is Mammadova.') },
          { field: 'u2d6_c12a', match: { other: true }, explain: ex('…', 'Bu sətirdə yalnız adın lazımdır.', 'Last name — soyadın; First name — adın.', 'My first name is …') },
        ],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u2d6_c13', number: 13, title: 'Söhbəti sırala', why: 'Sual, ünvan, hərf-hərf xahişi və hərflər düz sıradadır.', hint: 'Əvvəl sual gəlir; sözü tanımayan nə soruşur?',
      prompt: 'Ofisdə e-poçt mübadiləsi.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: "What's your email?", from: 'B' }, { en: '2', az: "It's ganja five at mail dot com.", from: 'G' }, { en: '3', az: 'Ganja? How do you spell it?', from: 'B' }, { en: '4', az: "G-A-N-J-A five at mail dot com.", from: 'G' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("What's your email? → It's ganja five at mail dot com. → Ganja? How do you spell it? → G-A-N-J-A five at mail dot com.", 'Sual, ünvan, hərf-hərf xahişi, sonra hərflər.', "How do you spell it? — xahiş; G-A-N-J-A — hərflər.", "What's your email?"))],
      review: {
        title: 'Söhbəti sırala', why: 'Sual, ünvan, xahiş və yavaş təkrar düz sıradadır.', hint: 'Əvvəl sual gəlir; çox sürətli olanda nə xahiş edirsən?',
        prompt: 'Kursda e-poçt mübadiləsi.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: "Excuse me, what's your email?", from: 'G' }, { en: '2', az: "It's B-A-K-U nine at mail dot com.", from: 'B' }, { en: '3', az: 'Sorry? Slowly, please.', from: 'G' }, { en: '4', az: 'B… A… K… U… nine at mail dot com.', from: 'B' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Excuse me, what's your email? → It's B-A-K-U nine at mail dot com. → Sorry? Slowly, please. → B… A… K… U…", 'Ünvanı çox sürətlə dedi; xahişdən sonra yavaş təkrar etdi.', 'Slowly, please. — sürətli idi; Again, please. — eşitmədin.', 'Sorry? Slowly, please.'))],
      },
    },
  ],
  result: {
    done: ['Dərs 6 tamamlandı', 'Artıq e-poçtu soruşur, deyir, eşidib yazır və formaya yaza bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'E-poçt sözlərini və ünvanı eşidib anlamaq', tasks: ['u2d6_c03', 'u2d6_c07', 'u2d6_c11', 'u2d6_c13'] },
      { group: 'Yazı', text: 'E-poçtu soruşmaq, eşitdiyin ünvanı yazmaq, formanı doldurmaq', tasks: ['u2d6_c05', 'u2d6_c09', 'u2d6_c12'] },
      { group: 'Danışıq', text: 'Öz e-poçtunu demək', tasks: ['u2d6_c10'] },
    ],
    closing: 'Növbəti dərs — 11–20: idman zalında nömrələr.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'email', translation: 'e-poçt', example: 'Email, please.', exampleAz: 'E-poçt, zəhmət olmasa.', usageNote: 'Ünvan və ya məktub.', pronunciation: '/ˈimeɪl/', teachCard: 'u2d6_c02' },
    { word: "What's your email?", translation: 'E-poçtun nədir?', example: "Hi! What's your email?", exampleAz: 'Salam! E-poçtun nədir?', usageNote: 'E-poçt soruşmaq.', pronunciation: '/wʌts jʊr ˈimeɪl/', teachCard: 'u2d6_c04' },
    { word: 'dot', translation: 'nöqtə (.)', example: 'mail dot com', exampleAz: 'mail.com', usageNote: 'Ünvanda nöqtə.', pronunciation: '/dɑt/', teachCard: 'u2d6_c06' },
    { word: 'at', translation: '@', example: MY, exampleAz: 'kb@mail.com', usageNote: '@ — “at”, “et” yox.', pronunciation: '/æt/', teachCard: 'u2d6_c08' },
  ],
};
