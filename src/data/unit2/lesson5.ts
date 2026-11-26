// Bölmə 2 · Dərs 5 — Ad və soyad. 26 Nov 2026: two parts (a lesson part is 8–12 screens, nothing removed).
// 1-ci hissə: first name · last name · What's your last name?. 2-ci hissə: Mr. · Ms. və öz soyadını demək.
// Kurs qeydiyyat masası. Soyadlar yalnız formada/siyahıda görünür, personaj adı kimi yox.
// Spiral: hərf-hərf (Dərs 4), double, Hello, What's your name?, phone number (Dərs 2).
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from '../unit1/build';
import { LAST_NAME_SAID, NAME, notices, own, resultTexts, said } from './shared';

const askLast = goal(['askLastName'], ["What's your last name?"]);
const first = own(NAME, '[ad]');
const last = own(NAME, 'Mammadova');
const myLast = own(LAST_NAME_SAID, 'My last name is [soyad]', "It's [soyad].");
/** “Hello, Ms. Hasanova!” — Hello or Hi, Mr./Ms. (the full stop may be left out) and the last name. */
const greet = (title: string, surname: string) => said(String.raw`^(?:hello|hi)[,!]?\s+${title}\.?\s+${surname}\s*[!.]?$`, `Hello, ${title}. ${surname}!`, `Hi, ${title}. ${surname}!`);

export const lesson5: DesignLesson = {
  id: 'a1_en_b2_d5', order: 28, unit: 2, number: 5, part: 1, title: 'Ad və soyad', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d5_c01', badge: 'Şəxsi məlumat', subtitle: 'Kursa yazılırsan: qeydiyyat masasında ad və soyad.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Formada adımı və soyadımı öz yerinə yazıram.' },
        { icon: 'wave', text: 'Soyadı soruşa və eşitdiyim soyadı yaza bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u2d5_c02', number: 2, scenes: ['u2/word-first-name'],
      word: 'first name', pronunciation: '/ˈfɜrst ˌneɪm/', reading: 'fırst neym', az: 'ad',
      notes: ['Formada “First name” — sənin adın.'],
      example: 'My first name is [ad]', exampleAz: 'Adım [ad]-dır.',
    },
    {
      type: 'choice', id: 'u2d5_c03', number: 3, title: 'Oxu və seç', why: '“First name” — ad.', hint: 'Sözün mənasını kartdan xatırla.',
      prompt: 'Kurs qeydiyyat vərəqində “First name” sətri var.\nBura nə yazırsan?',
      options: ['Adını', 'Soyadını', 'Telefon nömrəni'], answer: 'Adını',
      variants: [
        pick('Soyadını', '“First name” soyad deyil.', ex('Adını', '“First name” addır; soyad üçün ayrıca sətir olur.', 'First name — ad; Phone number — telefon nömrəsi.', 'My first name is [ad]')),
        pick('Telefon nömrəni', 'Nömrə üçün “Phone number” yazılır.', ex('Adını', '“name” — ad; nömrə “number”dir.', 'First name — ad; Phone number — telefon nömrəsi.', 'My first name is [ad]')),
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
        { id: 'u2d5_c05a', label: 'First name', placeholder: 'Adını yaz', rule: first, purpose: 'adını yazmaq', empty: 'Adını da yaz.' },
        { id: 'u2d5_c05b', label: 'Last name', placeholder: 'Soyadını yaz', rule: last, purpose: 'soyadını yazmaq', empty: 'Soyadını da yaz.' },
      ],
      variants: [
        { field: 'u2d5_c05a', match: { other: true }, explain: ex('[ad]', 'Bu sətirdə yalnız adın lazımdır, cümlə yox.', 'First name — adın; Last name — soyadın.', 'My first name is [ad]') },
        { field: 'u2d5_c05b', match: { other: true }, explain: ex('Mammadova', 'Bu sətirdə yalnız soyadın lazımdır, cümlə yox.', 'First name — adın; Last name — soyadın.', 'My last name is Mammadova.') },
      ],
      review: {
        title: 'Formanı doldur', why: 'Dostunun adını və soyadını öz yerinə yazdın.', hint: 'Pasportda əvvəl soyad yazılıb; formada isə sətirlərin başlığını oxu.', scenes: ['u2/form-gym'],
        prompt: 'Dostunu idman zalına yazırsan. Pasportunda latın hərfləri ilə belə yazılıb: “ALIYEV KAMRAN”.\nFormanı doldur.', form: { title: 'İdman zalı', subtitle: 'Yeni üzv' },
        fields: [
          { id: 'u2d5_c05b', label: 'Last name', placeholder: 'Soyadını yaz', rule: exact('Aliyev'), purpose: 'soyadı yazmaq', empty: 'Soyadı da yaz.' },
          { id: 'u2d5_c05a', label: 'First name', placeholder: 'Adını yaz', rule: exact('Kamran'), purpose: 'adı yazmaq', empty: 'Adı da yaz.' },
        ],
        variants: [
          { field: 'u2d5_c05b', match: { other: true }, explain: ex('Aliyev', 'Last name — soyaddır: pasportdakı birinci söz.', 'Last name — Aliyev; First name — Kamran.', 'My last name is Aliyev.') },
          { field: 'u2d5_c05a', match: { other: true }, explain: ex('Kamran', 'First name — addır: pasportdakı ikinci söz.', 'First name — Kamran; Last name — Aliyev.', 'My first name is Kamran.') },
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
      prompt: 'Yeni tələbə qeydiyyata yazdı.\nSözlərdən soyadını soruşan sual qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Yeni tələbə', from: 'G', lines: [{ from: 'G', text: 'Hello! Nice to meet you!' }] },
      tiles: ["What's", 'last', 'your', 'name', 'first', 'is', '?'], rule: exact("What's your last name?"),
      variants: [other("What's your last name?", ex("What's your last name?", 'Soyad “last name”dir, “first name” addır.', "What's your first name? — ad; What's your last name? — soyad.", "Hi! What's your last name?"))],
      review: {
        title: 'Sualı qur', why: 'Soyadı soruşdun: last name.', hint: 'Ad yox, soyad soruşursan — kartdakı sözü xatırla.',
        prompt: 'Yeni üzv qeydiyyata yazdı.\nSözlərdən soyadını soruşan sual qur.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'Yeni üzv', from: 'B', lines: [{ from: 'B', text: 'Hi!' }] },
        tiles: ['name', "What's", 'your', 'last', 'my', 'first', '?'], rule: exact("What's your last name?"),
        variants: [other("What's your last name?", ex("What's your last name?", 'Soyad “last name”dir, “first name” addır.', "What's your first name? — ad; What's your last name? — soyad.", "What's your last name?"))],
      },
    },
    {
      type: 'write', id: 'u2d5_c14', number: 8, title: 'Cavab yaz', why: 'Soyadını yazdın.', hint: 'Ad yox, soyad soruşulur.',
      prompt: 'Kursun müəllimi sənə mesaj yazır.\nSoyadını yaz.', placeholder: 'Cavabını yaz',
      chat: { partner: 'Kurs müəllimi', from: 'G', lines: [{ from: 'G', text: "Hi! What's your last name?" }] }, rule: myLast,
      variants: [other('My last name is [soyad]', ex('My last name is [soyad]', 'Soruşulan soyaddır, ad deyil.', 'My first name is [ad] — ad; My last name is [soyad] — soyad.', 'My last name is Mammadova.'))],
      review: {
        title: 'Cavab yaz', why: 'Soyadını yazdın.', hint: 'Ad yox, soyad soruşulur.',
        prompt: 'İdman zalının qəbulu mesaj yazır.\nSoyadını yaz.', placeholder: 'Cavabını yaz',
        chat: { partner: 'İdman zalının qəbulu', from: 'B', lines: [{ from: 'B', text: 'Hello! Last name, please?' }] }, rule: myLast,
        variants: [other('My last name is [soyad]', ex('My last name is [soyad]', 'Soruşulan soyaddır, ad deyil.', 'My first name is [ad] — ad; My last name is [soyad] — soyad.', 'My last name is Hasanova.'))],
      },
    },
    {
      type: 'voice', id: 'u2d5_c10', number: 10, title: 'Soyadı soruş', why: 'Soyadı soruşdun.', hint: 'Ad yox, soyad soruşulur — kartdakı sualı xatırla.',
      prompt: 'Kurs qeydiyyat masasındasan. Yeni tələbə yalnız adını dedi.\nOndan soyadını soruş.', reply: "It's Mammadov. M-A-double M-A-D-O-V.",
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
      prompt: 'Soyadı yaz.', audio: 'Last name: G-U-L-I-Y-E-V.', placeholder: 'Soyad',
      rule: exact('Guliyev'),
      variants: [other('Hərfləri yoxla.', ex('Guliyev', 'Səsdə G, U, L, I, Y, E, V deyilir; I “ay”, E “i” oxunur.', 'I — ay; E — i.', 'Last name: G-U-L-I-Y-E-V.'))],
      review: {
        title: 'Dinlə və yaz', why: 'M-A-double M-A-D-O-V-A — Mammadova.', hint: 'Hər hərfi eşidən kimi yaz; qoşa hərfə diqqət et.',
        prompt: 'Soyadı yaz.', audio: 'Last name: M-A-double M-A-D-O-V-A.', placeholder: 'Soyad',
        rule: exact('Mammadova'),
        variants: [other('Hərfləri yoxla.', ex('Mammadova', '“double M” — iki M yan-yana: MM.', 'double M — MM; double L — LL.', 'Last name: M-A-double M-A-D-O-V-A.'))],
      },
    },
  ],
  result: {
    done: ['Dərs 5 · 1-ci hissə tamamlandı', 'Artıq formada adını və soyadını yazır, soyadı soruşa bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Formadakı sözləri anlamaq', tasks: ['u2d5_c03'] },
      { group: 'Yazı', text: 'Formanı doldurmaq, soyadı yazmaq və soruşmaq', tasks: ['u2d5_c05', 'u2d5_c07', 'u2d5_c14', 'u2d5_c11'] },
      { group: 'Danışıq', text: 'Soyadı soruşmaq', tasks: ['u2d5_c10'] },
    ],
    closing: 'Növbəti hissə — Mr. və Ms.: nəzakətli müraciət.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'first name', translation: 'ad', example: 'My first name is [ad]', exampleAz: 'Adım [ad]-dır.', usageNote: 'Formada ad sətri.', pronunciation: '/ˈfɜrst ˌneɪm/', teachCard: 'u2d5_c02' },
    { word: 'last name', translation: 'soyad', example: 'My last name is Mammadova.', exampleAz: 'Soyadım Məmmədovadır.', usageNote: 'Formada soyad sətri.', pronunciation: '/ˈlæst ˌneɪm/', teachCard: 'u2d5_c04' },
    { word: "What's your last name?", translation: 'Soyadın nədir?', example: "Hi! What's your last name?", exampleAz: 'Salam! Soyadın nədir?', usageNote: 'Soyad soruşmaq.', pronunciation: '/wʌts jʊr ˈlæst ˌneɪm/', teachCard: 'u2d5_c06' },
  ],
};

export const lesson5Part2: DesignLesson = {
  id: 'a1_en_b2_d5_2', order: 29, unit: 2, number: 5, part: 2, title: 'Mr. və Ms.', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d5_2_c01', badge: 'Şəxsi məlumat', subtitle: 'Kursda və ofisdə müəllimə, müdirə nəzakətlə müraciət edirsən.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Mr. və Ms. ilə nəzakətlə salam verə bilirəm.' },
        { icon: 'wave', text: 'Soyadımı deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u2d5_c08', number: 8, scenes: ['u2/word-mr-ms'],
      word: 'Mr. Guliyev · Ms. Hasanova', pronunciation: '/ˈmɪstər/ · /mɪz/', reading: 'mistır quliyev · miz hasanova', az: 'cənab Quliyev · Həsənova xanım',
      structure: ['Mr. + soyad', 'Ms. + soyad'],
      notes: ['Mr. — kişiyə, Ms. — qadına; ardınca soyad gəlir.'],
      example: 'Hello, Ms. Hasanova!', exampleAz: 'Salam, Həsənova xanım!',
    },
    {
      type: 'choice', id: 'u2d5_c15', number: 4, title: 'Dinlə və anla', why: '“Mr.” kişiyə deyilir.', hint: 'Soyaddan əvvəlki sözə qulaq as.',
      prompt: 'Ofisdə katib yeni gələn qonağa salam verir.\nO kimə müraciət edir?', audio: 'Hello, Mr. Guliyev!',
      options: ['Qadına', 'Kişiyə', 'Yaxın dostuna'], answer: 'Kişiyə',
      variants: [
        pick('Qadına', 'Qadına “Ms.” deyilir.', ex('Kişiyə', 'Səsdə “Mr.” var — kişiyə müraciətdir.', 'Mr. Guliyev — kişi; Ms. Guliyeva — qadın.', 'Hello, Mr. Guliyev!')),
        pick('Yaxın dostuna', 'Mr. + soyad nəzakətli, rəsmi müraciətdir.', ex('Kişiyə', 'Mr. və soyad tanımadığın və ya rəsmi adama deyilir.', 'Hello, Mr. Guliyev! — rəsmi; Hi! — dosta.', 'Hello, Mr. Guliyev!')),
      ],
      review: {
        title: 'Dinlə və anla', why: '“Ms.” qadına deyilir.', hint: 'Soyaddan əvvəlki sözə qulaq as.',
        prompt: 'Kursda tələbə yeni müəllimə salam verir.\nO kimə müraciət edir?', audio: 'Hello, Ms. Aliyeva!',
        options: ['Kişiyə', 'Yaxın dostuna', 'Qadına'], answer: 'Qadına',
        variants: [
          pick('Kişiyə', 'Kişiyə “Mr.” deyilir.', ex('Qadına', 'Səsdə “Ms.” var — qadına müraciətdir.', 'Ms. Aliyeva — qadın; Mr. Aliyev — kişi.', 'Hello, Ms. Aliyeva!')),
          pick('Yaxın dostuna', 'Ms. + soyad nəzakətli, rəsmi müraciətdir.', ex('Qadına', 'Ms. və soyad müəllimə, rəsmi adama deyilir.', 'Hello, Ms. Aliyeva! — rəsmi; Hi! — dosta.', 'Hello, Ms. Aliyeva!')),
        ],
      },
    },
    {
      type: 'choice', id: 'u2d5_c09', number: 9, title: 'Sözü tamamla', why: '-ova ilə bitən soyad qadınındır — Ms.', hint: 'Soyadın sonuna bax: -ova, yoxsa -ov?',
      prompt: 'Kursun yeni müəllimi gəldi, soyadı Hasanova.\nOna salam verirsən. Hansı söz çatmır?', gap: { speaker: 'B', before: 'Hello,', after: 'Hasanova!' },
      options: ['Ms.', 'Mr.', 'last'], answer: 'Ms.',
      variants: [
        pick('Mr.', '“Mr.” kişiyə deyilir.', ex('Ms.', 'Hasanova — qadın soyadıdır, ona “Ms.” deyilir.', 'Mr. Hasanov — kişi; Ms. Hasanova — qadın.', 'Hello, Ms. Hasanova!')),
        pick('last', '“last” soyad sözündədir: last name.', ex('Ms.', 'Salam verəndə soyaddan əvvəl “Ms.” və ya “Mr.” gəlir.', 'Hello, Ms. Hasanova! — müraciət; last name — soyad.', 'Hello, Ms. Hasanova!')),
      ],
      review: {
        title: 'Sözü tamamla', why: '-ov/-yev ilə bitən soyad kişinindir — Mr.', hint: 'Soyadın sonuna bax: -yeva, yoxsa -yev?',
        prompt: 'Ofisdə yeni müdirin soyadı Guliyev.\nOna salam verirsən. Hansı söz çatmır?', gap: { speaker: 'G', before: 'Hello,', after: 'Guliyev!' },
        options: ['Ms.', 'first', 'Mr.'], answer: 'Mr.',
        variants: [
          pick('Ms.', '“Ms.” qadına deyilir.', ex('Mr.', 'Guliyev — kişi soyadıdır, ona “Mr.” deyilir.', 'Mr. Guliyev — kişi; Ms. Guliyeva — qadın.', 'Hello, Mr. Guliyev!')),
          pick('first', '“first” ad sözündədir: first name.', ex('Mr.', 'Salam verəndə soyaddan əvvəl “Mr.” və ya “Ms.” gəlir.', 'Hello, Mr. Guliyev! — müraciət; first name — ad.', 'Hello, Mr. Guliyev!')),
        ],
      },
    },
    {
      type: 'voice', id: 'u2d5_c17', number: 6, title: 'Salam ver', why: 'Müəllimə nəzakətlə salam verdin.', hint: 'Qadın müəllimdir — soyaddan əvvəl hansı söz gəlir?',
      prompt: 'Dərsdən əvvəl yeni müəllimin sinfə gəlir. O qadındır, soyadı Abbasova.\nOna nəzakətlə salam ver.', reply: 'Hello! Nice to meet you.',
      rule: greet('Ms', 'Abbasova'),
      variants: [other('Hello, Ms. Abbasova!', ex('Hello, Ms. Abbasova!', 'Qadın müəllimə “Ms.” və soyadla müraciət edirsən.', 'Ms. Abbasova — qadın; Mr. Abbasov — kişi.', 'Hello, Ms. Hasanova!'))],
      review: {
        title: 'Salam ver', why: 'Müdirə nəzakətlə salam verdin.', hint: 'Müdir kişidir — soyaddan əvvəl hansı söz gəlir?',
        prompt: 'Ofisdə yeni müdirin yanına gedirsən. O kişidir, soyadı Aliyev.\nOna nəzakətlə salam ver.', reply: 'Hi! How are you?',
        rule: greet('Mr', 'Aliyev'),
        variants: [other('Hello, Mr. Aliyev!', ex('Hello, Mr. Aliyev!', 'Kişi müdirə “Mr.” və soyadla müraciət edirsən.', 'Mr. Aliyev — kişi; Ms. Aliyeva — qadın.', 'Hello, Mr. Guliyev!'))],
      },
    },
    {
      type: 'write', id: 'u2d5_c16', number: 7, title: 'Mesajda salam yaz', why: 'Müəllimə nəzakətlə salam yazdın.', hint: 'Soyad -ova ilə bitir — kimə yazırsan?',
      prompt: 'Kursun müəllimi Hasanovaya ilk dəfə mesaj yazırsan.\nOna nəzakətlə salam yaz.', placeholder: 'Mesajını yaz',
      chat: { partner: 'Hasanova (müəllim)', from: 'G', lines: [{ from: 'G', text: '👋' }] }, rule: greet('Ms', 'Hasanova'),
      variants: [other('Hello, Ms. Hasanova!', ex('Hello, Ms. Hasanova!', 'Hasanova qadın soyadıdır — “Ms.” və soyad yazılır.', 'Ms. Hasanova — qadın; Mr. Hasanov — kişi.', 'Hello, Ms. Hasanova!'))],
      review: {
        title: 'Mesajda salam yaz', why: 'Müdirə nəzakətlə salam yazdın.', hint: 'Soyad -yev ilə bitir — kimə yazırsan?',
        prompt: 'Yeni müdirin Guliyevə ilk dəfə mesaj yazırsan.\nOna nəzakətlə salam yaz.', placeholder: 'Mesajını yaz',
        chat: { partner: 'Guliyev (müdir)', from: 'B', lines: [{ from: 'B', text: '👋' }] }, rule: greet('Mr', 'Guliyev'),
        variants: [other('Hello, Mr. Guliyev!', ex('Hello, Mr. Guliyev!', 'Guliyev kişi soyadıdır — “Mr.” və soyad yazılır.', 'Mr. Guliyev — kişi; Ms. Guliyeva — qadın.', 'Hello, Mr. Guliyev!'))],
      },
    },
    {
      type: 'voice', id: 'u2d5_c12', number: 12, title: 'Soyadını de', why: 'Soyadını dedin.', hint: 'Sual soyad haqqındadır — kartdakı cavabın qurulmasını xatırla.',
      prompt: 'Müəllim soruşur: “What\'s your last name?”\nSoyadını de.', audio: "What's your last name?", reply: 'Thank you!',
      rule: myLast,
      variants: [other('My last name is [soyad]', ex('My last name is [soyad]', 'Soruşulan soyaddır, ad deyil.', 'My first name is [ad] — ad; My last name is [soyad] — soyad.', 'My last name is Mammadova.'))],
      review: {
        title: 'Soyadını de', why: 'Soyadını dedin.', hint: 'Sual soyad haqqındadır — kartdakı cavabın qurulmasını xatırla.',
        prompt: 'Otel resepsiyasında soruşurlar: “Last name, please?”\nSoyadını de.', audio: 'Last name, please?', reply: 'Thanks!',
        rule: myLast,
        variants: [other('My last name is [soyad]', ex('My last name is [soyad]', 'Soruşulan soyaddır, ad deyil.', 'My first name is [ad] — ad; My last name is [soyad] — soyad.', 'My last name is Hasanova.'))],
      },
    },
    {
      type: 'match', id: 'u2d5_c13', number: 13, title: 'Kim nə dedi?', why: 'Formadakı sözlərin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun sözü yerinə qoy.',
      prompt: 'Qeydiyyat masasında eşitdiyin sözlər.\nHər birinə mənasını qoş.',
      rows: [{ en: 'First name', az: 'Ad' }, { en: 'Last name', az: 'Soyad' }, { en: 'How do you spell it?', az: 'Hərf-hərf necə yazılır?' }],
      extra: ['Cənab'],
      variants: [other('Bir sözün mənası yerində deyil.', ex('First name — Ad; Last name — Soyad; How do you spell it? — Hərf-hərf necə yazılır?', 'first — ad, last — soyad; spell — hərf-hərf demək.', 'First name — ad; Last name — soyad.', 'Mammadova? How do you spell it?'))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
        prompt: 'Qeydiyyat masasında eşitdiklərin.\nHər birinə mənasını qoş.',
        rows: [{ en: 'Mr.', az: 'Cənab' }, { en: "What's your last name?", az: 'Soyadın nədir?' }, { en: 'Phone number', az: 'Telefon nömrəsi' }],
        extra: ['Ad'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("Mr. — Cənab; What's your last name? — Soyadın nədir?; Phone number — Telefon nömrəsi", 'Mr. kişiyə deyilir; last name — soyad.', "What's your last name? — soyad; What's your phone number? — nömrə.", 'Hello, Mr. Guliyev!'))],
      },
    },
  ],
  result: {
    done: ['Dərs 5 · 2-ci hissə tamamlandı', 'Artıq Mr. və Ms. ilə nəzakətlə salam verir və soyadını deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Mr., Ms.-i və formadakı sözləri anlamaq', tasks: ['u2d5_c15', 'u2d5_c09', 'u2d5_c13'] },
      { group: 'Yazı', text: 'Mesajda nəzakətlə salam yazmaq', tasks: ['u2d5_c16'] },
      { group: 'Danışıq', text: 'Nəzakətlə salam vermək və soyadını demək', tasks: ['u2d5_c17', 'u2d5_c12'] },
    ],
    closing: 'Növbəti dərs — e-poçt: ofisdə ünvanını deyirsən.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'Mr.', translation: 'cənab', example: 'Hello, Mr. Guliyev!', exampleAz: 'Salam, cənab Quliyev!', usageNote: 'Kişiyə, soyaddan əvvəl.', pronunciation: '/ˈmɪstər/', teachCard: 'u2d5_c08' },
    { word: 'Ms.', translation: 'xanım', example: 'Hello, Ms. Hasanova!', exampleAz: 'Salam, Həsənova xanım!', usageNote: 'Qadına, soyaddan əvvəl.', pronunciation: '/mɪz/', teachCard: 'u2d5_c08' },
  ],
};
