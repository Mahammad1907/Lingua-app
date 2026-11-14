// Bölmə 2 · Dərs 5 — Ad və soyad (first name · last name · What's your last name? · Mr · Ms).
// Kurs qeydiyyat masası. Soyadlar yalnız formada/siyahıda görünür, personaj adı kimi yox.
// Spiral: hərf-hərf (Dərs 4), double, Hello, What's your name?, phone number (Dərs 2).
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from '../unit1/build';
import { LAST_NAME_SAID, NAME, notices, own, resultTexts } from './shared';

const askLast = goal(['askLastName'], ["What's your last name?"]);
const first = own(NAME, '…');
const last = own(NAME, 'Mammadova');
const myLast = own(LAST_NAME_SAID, 'My last name is …');

export const lesson5: DesignLesson = {
  id: 'a1_en_b2_d5', order: 16, unit: 2, number: 5, title: 'Ad və soyad', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d5_c01', badge: 'Şəxsi məlumat', subtitle: 'Kursa yazılırsan: qeydiyyat masasında ad və soyad.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Formada adımı və soyadımı öz yerinə yazıram.' },
        { icon: 'wave', text: 'Soyadı soruşa və öz soyadımı deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u2d5_c02', number: 2, scenes: ['u2/word-first-name'],
      word: 'first name', pronunciation: '/ˈfɜrst ˌneɪm/', reading: 'fırst neym', az: 'ad',
      notes: ['Formada “First name” — sənin adın.'],
      example: 'My first name is …', exampleAz: 'Adım …-dır.',
    },
    {
      type: 'choice', id: 'u2d5_c03', number: 3, title: 'Oxu və seç', why: '“First name” — ad.', hint: 'Sözün mənasını kartdan xatırla.',
      prompt: 'Kurs qeydiyyat vərəqində “First name” sətri var.\nBura nə yazırsan?',
      options: ['Adını', 'Soyadını', 'Telefon nömrəni'], answer: 'Adını',
      variants: [
        pick('Soyadını', '“First name” soyad deyil.', ex('Adını', '“First name” addır; soyad üçün ayrıca sətir olur.', 'First name — ad; Phone number — telefon nömrəsi.', 'My first name is …')),
        pick('Telefon nömrəni', 'Nömrə üçün “Phone number” yazılır.', ex('Adını', '“name” — ad; nömrə “number”dir.', 'First name — ad; Phone number — telefon nömrəsi.', 'My first name is …')),
      ],
      review: {
        title: 'Oxu və seç', why: '“Last name” — soyad.', hint: 'Sözün mənasını kartdan xatırla.',
        prompt: 'İdman zalının formasında “Last name” sətri var.\nBura nə yazırsan?',
        options: ['Adını', 'Soyadını', 'Telefon nömrəni'], answer: 'Soyadını',
        variants: [
          pick('Adını', '“Last name” ad deyil.', ex('Soyadını', '“Last name” soyaddır, ad “First name” sətrinə yazılır.', 'First name — ad; Last name — soyad.', 'My last name is Mammadova.')),
          pick('Telefon nömrəni', 'Nömrə üçün “Phone number” yazılır.', ex('Soyadını', '“name” — ad, soyad; nömrə “number”dir.', 'Last name — soyad; Phone number — telefon nömrəsi.', 'My last name is Mammadova.')),
        ],
      },
    },
    {
      type: 'word', id: 'u2d5_c04', number: 4, scenes: ['u2/word-last-name'],
      word: 'last name', pronunciation: '/ˈlæst ˌneɪm/', reading: 'ləst neym', az: 'soyad',
      notes: ['Azərbaycanda soyad çox vaxt əvvəl deyilir; formada isə ayrıca sətirdir.'],
      example: 'My last name is Mammadova.', exampleAz: 'Soyadım Məmmədovadır.',
    },
    {
      type: 'two', id: 'u2d5_c05', number: 5, title: 'Formanı doldur', why: 'Adını və soyadını öz yerinə yazdın.', hint: 'Hər sətrin başlığını oxu: biri ad, biri soyaddır.', scenes: ['u2/form-course'],
      prompt: 'Kursa yazılırsan.\nQeydiyyat vərəqində adını və soyadını yaz.', form: { title: 'Kurs qeydiyyatı', subtitle: 'İngilis dili kursu' },
      fields: [
        { id: 'u2d5_c05a', label: 'First name', placeholder: 'Adın', rule: first, purpose: 'adını yazmaq', empty: 'Adını da yaz.' },
        { id: 'u2d5_c05b', label: 'Last name', placeholder: 'Soyadın', rule: last, purpose: 'soyadını yazmaq', empty: 'Soyadını da yaz.' },
      ],
      variants: [
        { field: 'u2d5_c05a', match: { other: true }, explain: ex('…', 'Bu sətirdə yalnız adın lazımdır, cümlə yox.', 'First name — adın; Last name — soyadın.', 'My first name is …') },
        { field: 'u2d5_c05b', match: { other: true }, explain: ex('Mammadova', 'Bu sətirdə yalnız soyadın lazımdır, cümlə yox.', 'First name — adın; Last name — soyadın.', 'My last name is Mammadova.') },
      ],
      review: {
        title: 'Formanı doldur', why: 'Adını və soyadını öz yerinə yazdın.', hint: 'Diqqət: bu formada sətirlərin sırası başqadır.', scenes: ['u2/form-gym'],
        prompt: 'İdman zalına yazılırsan.\nFormada soyadını və adını yaz.', form: { title: 'İdman zalı', subtitle: 'Yeni üzv' },
        fields: [
          { id: 'u2d5_c05b', label: 'Last name', placeholder: 'Soyadın', rule: last, purpose: 'soyadını yazmaq', empty: 'Soyadını da yaz.' },
          { id: 'u2d5_c05a', label: 'First name', placeholder: 'Adın', rule: first, purpose: 'adını yazmaq', empty: 'Adını da yaz.' },
        ],
        variants: [
          { field: 'u2d5_c05b', match: { other: true }, explain: ex('Mammadova', 'Bu sətirdə yalnız soyadın lazımdır.', 'Last name — soyadın; First name — adın.', 'My last name is Mammadova.') },
          { field: 'u2d5_c05a', match: { other: true }, explain: ex('…', 'Bu sətirdə yalnız adın lazımdır.', 'Last name — soyadın; First name — adın.', 'My first name is …') },
        ],
      },
    },
    {
      type: 'word', id: 'u2d5_c06', number: 6, scenes: ['u2/word-whats-last-name'],
      word: "What's your last name?", pronunciation: '/wʌts jʊr ˈlæst ˌneɪm/', reading: 'uats yor ləst neym?', az: 'Soyadın nədir?',
      example: "Hi! What's your last name?", exampleAz: 'Salam! Soyadın nədir?',
    },
    {
      type: 'write', id: 'u2d5_c07', number: 7, title: 'Sualı qur', why: 'Soyadı soruşdun: last name.', hint: 'Ad yox, soyad soruşursan — kartdakı sözü xatırla.',
      prompt: 'Qeydiyyat masasında işləyirsən. Yeni tələbə gəldi.\nSözlərdən onun soyadını soruşan sual qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Yeni tələbə', from: 'G', lines: [{ from: 'G', text: 'Hello!' }] },
      tiles: ["What's", 'last', 'your', 'name', 'first', 'is', '?'], rule: exact("What's your last name?"),
      variants: [other("What's your last name?", ex("What's your last name?", 'Soyad “last name”dir, “first name” addır.', "What's your first name? — ad; What's your last name? — soyad.", "Hi! What's your last name?"))],
      review: {
        title: 'Sualı qur', why: 'Soyadı soruşdun: last name.', hint: 'Ad yox, soyad soruşursan — kartdakı sözü xatırla.',
        prompt: 'İdman zalında qeydiyyatdasan. Yeni üzvün soyadını soruş.\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'Yeni üzv', from: 'B', lines: [{ from: 'B', text: 'Hi!' }] },
        tiles: ['name', "What's", 'your', 'last', 'my', 'first', '?'], rule: exact("What's your last name?"),
        variants: [other("What's your last name?", ex("What's your last name?", 'Soyad “last name”dir, “first name” addır.', "What's your first name? — ad; What's your last name? — soyad.", "What's your last name?"))],
      },
    },
    {
      type: 'word', id: 'u2d5_c08', number: 8, scenes: ['u2/word-mr-ms'],
      word: 'Mr Guliyev · Ms Hasanova', pronunciation: '/ˈmɪstər/ · /mɪz/', reading: 'mistır quliyev · miz hasanova', az: 'cənab Quliyev · Həsənova xanım',
      structure: ['Mr + soyad', 'Ms + soyad'],
      notes: ['Mr — kişiyə, Ms — qadına; ardınca soyad gəlir.'],
      example: 'Hello, Ms Hasanova!', exampleAz: 'Salam, Həsənova xanım!',
    },
    {
      type: 'choice', id: 'u2d5_c09', number: 9, title: 'Sözü tamamla', why: 'Qadına — Ms.', hint: 'Müəllim kişidir, yoxsa qadın?',
      prompt: 'Kursun müəllimi qadındır, soyadı Hasanova.\nOna salam verirsən. Hansı söz çatmır?', gap: { speaker: 'B', before: 'Hello,', after: 'Hasanova!' },
      options: ['Ms', 'Mr', 'last'], answer: 'Ms',
      variants: [
        pick('Mr', '“Mr” kişiyə deyilir.', ex('Ms', 'Müəllim qadındır, ona “Ms” deyilir.', 'Mr Hasanov — kişi; Ms Hasanova — qadın.', 'Hello, Ms Hasanova!')),
        pick('last', '“last” soyad sözündədir: last name.', ex('Ms', 'Salam verəndə soyaddan əvvəl “Ms” və ya “Mr” gəlir.', 'Hello, Ms Hasanova! — müraciət; last name — soyad.', 'Hello, Ms Hasanova!')),
      ],
      review: {
        title: 'Sözü tamamla', why: 'Kişiyə — Mr.', hint: 'Müdir kişidir, yoxsa qadın?',
        prompt: 'Ofisdə müdirin kişidir, soyadı Guliyev.\nOna salam verirsən. Hansı söz çatmır?', gap: { speaker: 'G', before: 'Hello,', after: 'Guliyev!' },
        options: ['Ms', 'first', 'Mr'], answer: 'Mr',
        variants: [
          pick('Ms', '“Ms” qadına deyilir.', ex('Mr', 'Müdir kişidir, ona “Mr” deyilir.', 'Mr Guliyev — kişi; Ms Guliyeva — qadın.', 'Hello, Mr Guliyev!')),
          pick('first', '“first” ad sözündədir: first name.', ex('Mr', 'Salam verəndə soyaddan əvvəl “Mr” və ya “Ms” gəlir.', 'Hello, Mr Guliyev! — müraciət; first name — ad.', 'Hello, Mr Guliyev!')),
        ],
      },
    },
    {
      type: 'voice', id: 'u2d5_c10', number: 10, title: 'Soyadı soruş', why: 'Soyadı soruşdun.', hint: 'Ad yox, soyad soruşulur — kartdakı sualı xatırla.',
      prompt: 'Kurs qeydiyyat masasındasan. Yeni tələbə yalnız adını dedi.\nOndan soyadını soruş.', reply: "It's Mammadov.",
      rule: askLast,
      variants: [
        insteadOf('askName', 'Adını artıq dedi — soyadını soruş.', ex("What's your last name?", 'Ad məlumdur, soyad lazımdır.', "What's your name? — ad; What's your last name? — soyad.", "Hi! What's your last name?")),
        other("What's your last name?", ex("What's your last name?", 'Soyadı “last name” ilə soruşursan.', "What's your first name? — ad; What's your last name? — soyad.", "What's your last name?")),
      ],
      review: {
        title: 'Soyadı soruş', why: 'Soyadı soruşdun.', hint: 'Ad yox, soyad soruşulur — kartdakı sualı xatırla.',
        prompt: 'İdman zalında yeni üzv adını dedi. Formaya soyadı da lazımdır.\nOndan soyadını soruş.', reply: "It's Hasanova.",
        rule: askLast,
        variants: [other("What's your last name?", ex("What's your last name?", 'Ad məlumdur, soyad lazımdır.', "What's your name? — ad; What's your last name? — soyad.", "What's your last name?"))],
      },
    },
    {
      type: 'write', id: 'u2d5_c11', number: 11, title: 'Dinlə və yaz', why: 'G-U-L-I-Y-E-V — Guliyev.', hint: 'Hər hərfi eşidən kimi yaz; “ay” və “i” səslərini qarışdırma.',
      prompt: 'Qeydiyyatçı siyahıdan bir tələbənin soyadını hərf-hərf oxuyur.\nSoyadı yaz.', audio: 'Last name: G-U-L-I-Y-E-V.', placeholder: 'Soyad',
      rule: exact('Guliyev'),
      variants: [other('Hərfləri yoxla.', ex('Guliyev', 'Səsdə G, U, L, I, Y, E, V deyilir; I “ay”, E “i” oxunur.', 'I — ay; E — i.', 'Last name: G-U-L-I-Y-E-V.'))],
      review: {
        title: 'Dinlə və yaz', why: 'M-A-double M-A-D-O-V-A — Mammadova.', hint: 'Hər hərfi eşidən kimi yaz; qoşa hərfə diqqət et.',
        prompt: 'İdman zalında qeydiyyatçı yeni üzvün soyadını hərf-hərf oxuyur.\nSoyadı yaz.', audio: 'Last name: M-A-double M-A-D-O-V-A.', placeholder: 'Soyad',
        rule: exact('Mammadova'),
        variants: [other('Hərfləri yoxla.', ex('Mammadova', '“double M” — iki M yan-yana: MM.', 'double M — MM; double L — LL.', 'Last name: M-A-double M-A-D-O-V-A.'))],
      },
    },
    {
      type: 'voice', id: 'u2d5_c12', number: 12, title: 'Soyadını de', why: 'Soyadını dedin.', hint: 'Sual soyad haqqındadır — kartdakı cavabın qurulmasını xatırla.',
      prompt: 'Müəllim soruşur: “What\'s your last name?”\nSoyadını de.', audio: "What's your last name?", reply: 'Thank you!',
      rule: myLast,
      variants: [other('My last name is …', ex('My last name is …', 'Soruşulan soyaddır, ad deyil.', 'My first name is … — ad; My last name is … — soyad.', 'My last name is Mammadova.'))],
      review: {
        title: 'Soyadını de', why: 'Soyadını dedin.', hint: 'Sual soyad haqqındadır — kartdakı cavabın qurulmasını xatırla.',
        prompt: 'Otel resepsiyasında soruşurlar: “Last name, please?”\nSoyadını de.', audio: 'Last name, please?', reply: 'Thanks!',
        rule: myLast,
        variants: [other('My last name is …', ex('My last name is …', 'Soruşulan soyaddır, ad deyil.', 'My first name is … — ad; My last name is … — soyad.', 'My last name is Hasanova.'))],
      },
    },
    {
      type: 'match', id: 'u2d5_c13', number: 13, title: 'Kim nə dedi?', why: 'Formadakı sözlərin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun sözü yerinə qoy.',
      prompt: 'Qeydiyyat vərəqindəki sözlər.\nHər birinə mənasını qoş.',
      rows: [{ en: 'First name', az: 'Ad' }, { en: 'Last name', az: 'Soyad' }, { en: 'Ms', az: 'Xanım' }],
      extra: ['Cənab'],
      variants: [other('Bir sözün mənası yerində deyil.', ex('First name — Ad; Last name — Soyad; Ms — Xanım', 'first — ad, last — soyad; Ms qadına deyilir.', 'First name — ad; Last name — soyad.', 'Hello, Ms Hasanova!'))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
        prompt: 'Qeydiyyat masasında eşitdiklərin.\nHər birinə mənasını qoş.',
        rows: [{ en: 'Mr', az: 'Cənab' }, { en: "What's your last name?", az: 'Soyadın nədir?' }, { en: 'Phone number', az: 'Telefon nömrəsi' }],
        extra: ['Ad'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("Mr — Cənab; What's your last name? — Soyadın nədir?; Phone number — Telefon nömrəsi", 'Mr kişiyə deyilir; last name — soyad.', "What's your last name? — soyad; What's your phone number? — nömrə.", 'Hello, Mr Guliyev!'))],
      },
    },
  ],
  result: {
    done: ['Dərs 5 tamamlandı', 'Artıq formada adını və soyadını yazır, soyadı soruşur və deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Formadakı sözləri və Mr, Ms-i anlamaq', tasks: ['u2d5_c03', 'u2d5_c09', 'u2d5_c13'] },
      { group: 'Yazı', text: 'Formanı doldurmaq, soyadı yazmaq və soruşmaq', tasks: ['u2d5_c05', 'u2d5_c07', 'u2d5_c11'] },
      { group: 'Danışıq', text: 'Soyadı soruşmaq və öz soyadını demək', tasks: ['u2d5_c10', 'u2d5_c12'] },
    ],
    closing: 'Növbəti dərs — e-poçt: ofisdə ünvanını deyirsən.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'first name', translation: 'ad', example: 'My first name is …', exampleAz: 'Adım …-dır.', usageNote: 'Formada ad sətri.', pronunciation: '/ˈfɜrst ˌneɪm/', teachCard: 'u2d5_c02' },
    { word: 'last name', translation: 'soyad', example: 'My last name is Mammadova.', exampleAz: 'Soyadım Məmmədovadır.', usageNote: 'Formada soyad sətri.', pronunciation: '/ˈlæst ˌneɪm/', teachCard: 'u2d5_c04' },
    { word: "What's your last name?", translation: 'Soyadın nədir?', example: "Hi! What's your last name?", exampleAz: 'Salam! Soyadın nədir?', usageNote: 'Soyad soruşmaq.', pronunciation: '/wʌts jʊr ˈlæst ˌneɪm/', teachCard: 'u2d5_c06' },
    { word: 'Mr', translation: 'cənab', example: 'Hello, Mr Guliyev!', exampleAz: 'Salam, cənab Quliyev!', usageNote: 'Kişiyə, soyaddan əvvəl.', pronunciation: '/ˈmɪstər/', teachCard: 'u2d5_c08' },
    { word: 'Ms', translation: 'xanım', example: 'Hello, Ms Hasanova!', exampleAz: 'Salam, Həsənova xanım!', usageNote: 'Qadına, soyaddan əvvəl.', pronunciation: '/mɪz/', teachCard: 'u2d5_c08' },
  ],
};
