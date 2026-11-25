// Bölmə 4 · Dərs 1 — Bu kimdir? (This is [ad]. · friend · my friend · Who's this? · Welcome!)
// {F:gen} evinin qapısı: ilk dəfə xarici dost (ABŞ-dan qadın) tanış edilir. Başqasını təqdim edirəm və kim olduğunu soruşuram.
// Spiral: Hello/Hi, Nice to meet you. You too., What's your name? I'm [ad]. (Bölmə 1), Thank you!
// Tipik səhvlər: “This are”, “Who this?”, “This is friend”, “This is friend my”. “Who is this?” və “He's my friend.” səhv deyil.
import type { DesignLesson, ExplainCard, Variant } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, own, resultTexts, said } from '../unit3/shared';

/** A name: one to three words of letters, never “friend”, “my” or a verb form. */
const NAME = String.raw`(?!(?:friend|my|me|are|is|am|he|she|i)\b)(?!.*\bfriend\b)\p{L}[\p{L}'’-]*(?:\s+\p{L}[\p{L}'’-]*){0,2}`;
/** “This is Tom.” / “This is my friend.” / “This is my friend Tom.” (also “He's my friend.”). “This is friend.”, “This is me.” and “This are …” are not accepted. */
const THIS_IS = String.raw`^(?:this\s+is\s+(?:my\s+friend(?:\s+${NAME})?|${NAME})|(?:he|she)(?:'s|\s+is)\s+my\s+friend)\s*[.!]?$`;
/** Asking about a person: “Who's this?” or “Who is this?”. “Who this?” is not accepted. */
const WHOS_THIS = String.raw`^who(?:'s|\s+is)\s+this\s*\??$`;
/** Welcoming a guest: “Welcome!” (also “Hello! Welcome!”). “You're welcome.” answers thanks and is not accepted. */
const WELCOME = String.raw`^(?:(?:hello|hi)[,!.\s]+)?welcome\s*[.!]?$`;

const thisMistakes = (model: string, example: string): Variant[] => [
  { match: { pattern: String.raw`^this\s+are\b` }, short: 'This ilə are olmur: is gəlir.',
    explain: ex(model, 'Azərbaycancada “-dır” sonda gəlir; ingiliscə o, This-dən sonra ayrıca gəlir: is.', 'This is Tom. — düzdür; This are Tom. — olmur.', example) },
  { match: { pattern: String.raw`^this\s+is\s+friend\b|^this\s+is\s+friend\s+my\b|\bfriend\s+my\b` }, short: 'Ailə və dost sözündən əvvəl my lazımdır.',
    explain: ex(model, 'Azərbaycancada “dostum” bir sözdür; ingiliscə “mənim” ayrıca gəlir: my friend.', 'This is my friend. — düzdür; This is friend my. — olmur.', example) },
  { match: { pattern: String.raw`^(?:i'?m|i am)\b` }, short: 'Başqasını təqdim edəndə This is deyilir.',
    explain: ex(model, 'I’m özünü təqdim edir; başqasını This is ilə təqdim edirsən.', "I'm Tom. — özüm; This is Tom. — başqası.", example) },
];
const askMistakes: Variant[] = [
  { match: { pattern: String.raw`^who\s+this\b` }, short: 'Sualda is lazımdır: Who’s this?',
    explain: ex("Who's this?", 'Azərbaycancada “kimdir” bir sözdür; ingiliscə is ayrıca gəlir: Who’s.', "Who's this? — düzdür; Who this? — olmur.", "Who's this? — This is my friend.") },
  { match: { pattern: String.raw`^this\s+is\b` }, short: 'Bu cümlə təqdimdir, sual deyil.',
    explain: ex("Who's this?", 'Kim olduğunu soruşursan: Who’s this? This is isə cavabdır.', "Who's this? — sual; This is my friend. — cavab.", "Who's this? — This is my friend.") },
];
const welcomeMistakes: Variant[] = [
  { match: { pattern: String.raw`you'?re\s+welcome` }, short: 'You’re welcome təşəkkürə cavabdır.',
    explain: ex('Welcome!', 'Qonağı qarşılayanda Welcome! deyirsən. You’re welcome isə təşəkkürə cavabdır.', "Welcome! — qonaq gəlir; You're welcome. — təşəkkür edən var.", 'Hello! Welcome!') },
  { match: { pattern: String.raw`^(?:thank you|thanks|goodbye|bye)\b` }, short: 'Qonağı qarşılamaq lazımdır.',
    explain: ex('Welcome!', 'Qonaq gələndə onu Welcome! ilə qarşılayırsan.', 'Welcome! — gələnə; Goodbye! — gedənə.', 'Hello! Welcome!') },
];

export const lesson1: DesignLesson = {
  id: 'a1_en_b4_d1', order: 35, unit: 4, number: 1, title: 'Bu kimdir?', section: 'Ailə və insanlar',
  notices,
  cards: [
    {
      type: 'intro', id: 'u4d1_c01', badge: 'Ailə və insanlar', subtitle: '{F} sənə evinin qapısını açır və ailə albomunu göstərir. Bir tanışını təqdim edir, kim olduğunu soruşursan.', start: 'Dərsə başla',
      goals: [
        { icon: 'wave', text: 'Başqasını təqdim edə bilirəm.' },
        { icon: 'chat', text: 'Şəkildəki adamın kim olduğunu soruşa bilirəm.' },
        { icon: 'bye', text: 'Qonağı qarşılaya bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u4d1_c02', number: 2, scenes: ['mascot/wave'],
      word: 'This is [ad].', pronunciation: '/ðɪs ɪz/', reading: '**th**is iz [ad].', az: 'Bu [ad]-dır.',
      structure: ['This is + ad.'],
      notes: ['This — bu; is — “-dır”. İkisi ayrı deyilir.'],
      example: 'Hello! This is Tom.', exampleAz: 'Salam! Bu Tomdur.',
    },
    {
      type: 'choice', id: 'u4d1_c03', number: 3, title: 'Dinlə və anla', why: 'This is + ad başqasını təqdim edir.', hint: 'İlk iki sözə qulaq as: danışan özündən, yoxsa başqasından danışır?',
      prompt: '{F:gen} qapısındasan. O, yanındakı adamı sənə göstərir.\nO nə edir?', audio: 'Hi! This is Anna.',
      options: ['Yanındakı adamı təqdim edir.', 'Özünü təqdim edir.', 'Adını soruşur.'], answer: 'Yanındakı adamı təqdim edir.',
      variants: [
        pick('Özünü təqdim edir.', 'Özünü I’m ilə təqdim edirlər.', ex('Yanındakı adamı təqdim edir.', 'Özünü I’m ilə təqdim edirsən; səsdə This is var — başqasını təqdim edir.', "I'm Anna. — özüm; This is Anna. — başqası.", 'Hi! This is Anna.')),
        pick('Adını soruşur.', 'Səsdə ad soruşan sual yoxdur.', ex('Yanındakı adamı təqdim edir.', 'Ad soruşanda “What’s your name?” deyilir; burada This is var.', "What's your name? — ad soruşur; This is Anna. — təqdim edir.", 'Hi! This is Anna.')),
      ],
      review: {
        title: 'Dinlə və anla', why: 'This is + ad başqasını təqdim edir.', hint: 'Hello-dan sonrakı iki sözə qulaq as: danışan kimdən danışır?',
        prompt: 'Kafedə dostun yanındakı qadını sənə göstərir.\nO nə edir?', audio: 'Hello! This is Emma.',
        options: ['Adını soruşur.', 'Özünü təqdim edir.', 'Yanındakı qadını təqdim edir.'], answer: 'Yanındakı qadını təqdim edir.',
        variants: [
          pick('Özünü təqdim edir.', 'Özünü I’m ilə təqdim edirlər.', ex('Yanındakı qadını təqdim edir.', 'Özünü I’m ilə təqdim edirsən; səsdə This is var — başqasını təqdim edir.', "I'm Emma. — özüm; This is Emma. — başqası.", 'Hello! This is Emma.')),
          pick('Adını soruşur.', 'Səsdə ad soruşan sual yoxdur.', ex('Yanındakı qadını təqdim edir.', 'Ad soruşanda “What’s your name?” deyilir; burada This is var.', "What's your name? — ad soruşur; This is Emma. — təqdim edir.", 'Hello! This is Emma.')),
        ],
      },
    },
    {
      type: 'word', id: 'u4d1_c04', number: 4, scenes: ['mascot/happy'],
      word: 'friend', pronunciation: '/frɛnd/', reading: 'frend', az: 'dost',
      notes: ['Yazılışa diqqət: friend — i-dən sonra e gəlir.'],
      example: 'Hi, friend!', exampleAz: 'Salam, dostum!',
    },
    {
      type: 'write', id: 'u4d1_c05', number: 5, title: 'Dinlə və yaz', why: 'friend — i-dən sonra e gəlir.', hint: 'Sözün ortasında iki saitin ardıcıllığına diqqət et.',
      prompt: '{F} səsli mesajda bir söz deyib, yazılışını soruşur.\nEşitdiyin sözü yaz.', audio: 'friend', placeholder: 'Eşitdiyin sözü yaz',
      rule: exact('friend'),
      variants: [
        { match: { pattern: String.raw`^fr(?:ei|ie?)nd?$|^frend$` }, short: 'Yazılış: f-r-i-e-n-d.',
          explain: ex('friend', 'Sözün ortasında əvvəl i, sonra e gəlir.', 'friend — düzdür; freind — olmur.', 'Hi, friend!') },
        other('Eşitdiyin söz: friend.', ex('friend', 'Eşitdiyin sözü hərf-hərf yaz: f-r-i-e-n-d.', 'friend — dost.', 'Hi, friend!')),
      ],
      review: {
        title: 'Dinlə və yaz', why: 'friend — i-dən sonra e gəlir.', hint: 'Telefonda eşitdiyin sözün ortasında iki sait yan-yanadır — sırasına diqqət et.',
        prompt: 'Telefonda dostun bir söz deyir və soruşur ki, o necə yazılır.\nEşitdiyin sözü yaz.', audio: 'friend', placeholder: 'Eşitdiyin sözü yaz',
        rule: exact('friend'),
        variants: [
          { match: { pattern: String.raw`^fr(?:ei|ie?)nd?$|^frend$` }, short: 'Yazılış: f-r-i-e-n-d.',
            explain: ex('friend', 'Sözün ortasında əvvəl i, sonra e gəlir.', 'friend — düzdür; freind — olmur.', 'Hi, friend!') },
          other('Eşitdiyin söz: friend.', ex('friend', 'Eşitdiyin sözü hərf-hərf yaz: f-r-i-e-n-d.', 'friend — dost.', 'Hi, friend!')),
        ],
      },
    },
    {
      type: 'word', id: 'u4d1_c06', number: 6, scenes: ['mascot/point'],
      word: 'my friend', pronunciation: '/maɪ frɛnd/', reading: 'may frend', az: 'mənim dostum',
      structure: ['my + friend'],
      notes: ['my — mənim, friend — dost: “dostum” ingiliscə iki sözdür.'],
      example: 'This is my friend.', exampleAz: 'Bu mənim dostumdur.',
    },
    {
      type: 'write', id: 'u4d1_c07', number: 7, title: 'Mesaj yaz', why: 'This is my friend. — dostunu təqdim etdin.', hint: 'Təqdim cümləsi bu dərsin ilk söz kartındakı kimi başlayır.',
      prompt: 'Qrupa öz dostunu əlavə etdin.\nSözlərdən cavab qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: 'Hi!' }] },
      tiles: ['This', 'is', 'my', 'friend', '.', 'are', "I'm"], rule: exact('This is my friend.'),
      variants: [
        ...thisMistakes('This is my friend.', 'This is my friend.'),
        other('Sıra: This is my friend.', ex('This is my friend.', 'Əvvəl This is, sonra my friend.', 'This is my friend. — dostum; This is Tom. — ad.', 'This is my friend.')),
      ],
      review: {
        title: 'Mesaj yaz', why: 'This is my friend. — dostunu təqdim etdin.', hint: 'İş yoldaşına da dostunu bu dərsin ilk söz kartındakı kimi təqdim et.',
        prompt: 'Söhbətə dostunu əlavə etdin.\nSözlərdən cavab qur.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'İş yoldaşı', from: 'other', lines: [{ from: 'other', text: 'Hello!' }] },
        tiles: ['my', 'This', 'friend', 'is', '.', 'I', 'are'], rule: exact('This is my friend.'),
        variants: [
          ...thisMistakes('This is my friend.', 'This is my friend.'),
          other('Sıra: This is my friend.', ex('This is my friend.', 'Əvvəl This is, sonra my friend.', 'This is my friend. — dostum; This is Tom. — ad.', 'This is my friend.')),
        ],
      },
    },
    {
      type: 'word', id: 'u4d1_c08', number: 8, scenes: ['mascot/ask'],
      word: "Who's this?", pronunciation: '/huz ðɪs/', reading: 'huz **th**is?', az: 'Bu kimdir?',
      shortForm: { full: 'Who is', short: "Who's" },
      structure: ["Who's this?"],
      notes: ['Who’s = Who is: who — kim, ’s — “-dır”, this — bu.'],
      example: "Who's this? — This is my friend.", exampleAz: 'Bu kimdir? — Bu mənim dostumdur.',
    },
    {
      type: 'voice', id: 'u4d1_c09', number: 9, title: 'Səslə soruş', why: 'Kim olduğunu soruşdun: Who’s this?', hint: 'Albomdakı adamı göstərib soruş — sual sözü cümlənin əvvəlində gəlir.',
      prompt: '{F:gen} ailə albomunda tanımadığın bir adam var.\n{F:abl} kim olduğunu soruş.', reply: 'This is my friend.',
      rule: said(WHOS_THIS, "Who's this?"),
      variants: [...askMistakes, other("Who's this?", ex("Who's this?", 'Kim olduğunu soruşanda Who’s this? deyilir.', "Who's this? — sual; This is my friend. — cavab.", "Who's this? — This is my friend."))],
      review: {
        title: 'Səslə soruş', why: 'Kim olduğunu soruşdun: Who’s this?', hint: 'Şəkildəki qadını göstərib soruş — sual sözü cümlənin əvvəlində gəlir.',
        prompt: 'Video zəngdə {f} qrup şəkli göstərir. Şəkildəki qadını tanımırsan.\nKim olduğunu soruş.', reply: 'This is my friend.',
        rule: said(WHOS_THIS, "Who's this?"),
        variants: [...askMistakes, other("Who's this?", ex("Who's this?", 'Kim olduğunu soruşanda Who’s this? deyilir.', "Who's this? — sual; This is my friend. — cavab.", "Who's this? — This is my friend."))],
      },
    },
    {
      type: 'match', mode: 'reply', id: 'u4d1_c10', number: 10, title: 'Cavab cütü', why: 'Hər cümləyə uyğun cavabı tapdın.', hint: 'Əvvəl kim, ad və tanışlıq sualını ayır.',
      prompt: '{F:gen} qapısında hamı bir-birini tanıyır.\nCümləyə toxun, sonra ona uyğun cavabı seç.',
      rows: [{ en: "Who's this?", az: 'This is my friend.', from: 'other' }, { en: "What's your name?", az: "I'm Tom.", from: 'other' }, { en: 'Nice to meet you.', az: 'You too.', from: 'other' }],
      extra: ['Goodbye.'],
      variants: [other('Bir cavab yerində deyil.', ex("Who's this? — This is my friend.; What's your name? — I'm Tom.; Nice to meet you. — You too.", 'Kim olduğunu soruşana təqdim cavabı, adı soruşana I’m və ad, tanışlığa You too.', "Who's this? — This is my friend. ; What's your name? — I'm Tom.", "Who's this? — This is my friend."))],
      review: {
        title: 'Cavab cütü', why: 'Hər cümləyə uyğun cavabı tapdın.', hint: 'Əvvəl “Bu kimdir?” sualını tap.',
        prompt: 'Ofisə yeni yoldaş gəlib, hamı tanış olur.\nCümləyə toxun, sonra ona uyğun cavabı seç.',
        rows: [{ en: "Who's this?", az: 'This is Anna.', from: 'other' }, { en: 'Hello!', az: 'Hi!', from: 'other' }, { en: 'Thank you!', az: "You're welcome.", from: 'other' }],
        extra: ['Sorry!'],
        variants: [other('Bir cavab yerində deyil.', ex("Who's this? — This is Anna.; Hello! — Hi!; Thank you! — You're welcome.", 'Kim olduğunu soruşana təqdim cavabı, salama salam, təşəkkürə You’re welcome.', "Who's this? — This is Anna. ; Hello! — Hi!", "Who's this? — This is my friend."))],
      },
    },
    {
      type: 'word', id: 'u4d1_c11', number: 11, scenes: ['mascot/wave'],
      word: 'Welcome!', pronunciation: '/ˈwɛlkəm/', reading: 'uelkəm!', az: 'Xoş gəldin!',
      notes: ['Qonağı qarşılayanda deyilir.'],
      example: 'Hello! Welcome!', exampleAz: 'Salam! Xoş gəldin!',
    },
    {
      type: 'write', id: 'u4d1_c12', number: 13, title: 'Dialoqu tamamla', why: 'Kim olduğunu dedin: This is + ad.', hint: 'Cavab bu dərsin ilk söz kartındakı kimi başlayır.',
      prompt: '{F} çatda şəkildəki adamı soruşur. O, dostundur, adı: {N:B}.\nOnu təqdim et.', placeholder: 'Cavabın',
      chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: "Who's this?" }] },
      rule: own(THIS_IS, 'This is {NE:B}.', 'This is my friend.'),
      variants: [...thisMistakes('This is {NE:B}.', "Who's this? — This is {NE:B}."), other('This is + ad.', ex('This is {NE:B}.', 'Başqasını təqdim edəndə This is, sonra ad və ya my friend deyirsən.', 'This is {NE:B}. — ad; This is my friend. — dost.', "Who's this? — This is {NE:B}."))],
      review: {
        title: 'Dialoqu tamamla', why: 'Kim olduğunu dedin: This is + ad.', hint: 'Yeni yoldaşa da dostunu bu dərsin ilk söz kartındakı kimi göstər.',
        prompt: 'İş yoldaşı çatda şəkildəki adamı soruşur. O, dostundur, adı: {N:G}.\nOnu təqdim et.', placeholder: 'Cavabın',
        chat: { partner: 'İş yoldaşı', from: 'other', lines: [{ from: 'other', text: "Who's this?" }] },
        rule: own(THIS_IS, 'This is {NE:G}.', 'This is my friend.'),
        variants: [...thisMistakes('This is {NE:G}.', "Who's this? — This is {NE:G}."), other('This is + ad.', ex('This is {NE:G}.', 'Başqasını təqdim edəndə This is, sonra ad və ya my friend deyirsən.', 'This is {NE:G}. — ad; This is my friend. — dost.', "Who's this? — This is {NE:G}."))],
      },
    },
    {
      type: 'voice', id: 'u4d1_c13', number: 12, title: 'Səslə cavab', why: 'Qonağı qarşıladın: Welcome!', hint: 'Qonaq gələndə deyilən yeni sözü xatırla.',
      prompt: '{F} ilk dəfə sənin evinə gəlir. Qapını açırsan.\nOnu qarşıla.', reply: 'Thank you!',
      rule: said(WELCOME, 'Hello! Welcome!'),
      variants: [...welcomeMistakes, other('Welcome!', ex('Welcome!', 'Qonağı qarşılayanda Welcome! deyilir.', 'Welcome! — qonaq gəlir; Goodbye! — qonaq gedir.', 'Hello! Welcome!'))],
      review: {
        title: 'Səslə cavab', why: 'Qonağı qarşıladın: Welcome!', hint: 'Ofisə ilk dəfə gələn adamı qarşılayanda deyilən yeni sözü xatırla.',
        prompt: 'Yeni iş yoldaşın ilk dəfə sizin ofisə gəlir.\nOnu qarşıla.', reply: 'Hi!',
        rule: said(WELCOME, 'Hello! Welcome!'),
        variants: [...welcomeMistakes, other('Welcome!', ex('Welcome!', 'Qonağı qarşılayanda Welcome! deyilir.', 'Welcome! — qonaq gəlir; Goodbye! — qonaq gedir.', 'Hello! Welcome!'))],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u4d1_c14', number: 14, title: 'Söhbəti sırala', why: 'Qarşılama, təqdim, ad sualı və cavab düz sıradadır.', hint: 'Əvvəl qapıda salamlaşırlar; ad sualından sonra cavab gəlir.',
      prompt: '{G:gen} qapısı. {B} dostu ilə gəlir.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: 'Hello! Welcome!', from: 'G' }, { en: '2', az: 'Thank you! This is my friend.', from: 'B' }, { en: '3', az: "Hi! What's your name?", from: 'G' }, { en: '4', az: "I'm Tom. Nice to meet you!", from: 'other' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hello! Welcome! → Thank you! This is my friend. → Hi! What's your name? → I'm Tom. Nice to meet you!", 'Əvvəl qarşılama, sonra təqdim, sonra ad sualı və cavab.', "Hello! Welcome! — qarşılama; What's your name? — ad.", 'Hello! Welcome!'))],
      review: {
        title: 'Söhbəti sırala', why: 'Qarşılama, təqdim, ad sualı və cavab düz sıradadır.', hint: 'Əvvəl qapıda salamlaşırlar; ad sualından sonra cavab gəlir.',
        prompt: 'Ofisin girişi. {G} dostu ilə gəlir.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: 'Hi! Welcome!', from: 'B' }, { en: '2', az: 'Thanks! This is my friend.', from: 'G' }, { en: '3', az: "Hello! What's your name?", from: 'B' }, { en: '4', az: "I'm Anna. Nice to meet you!", from: 'other' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Hi! Welcome! → Thanks! This is my friend. → Hello! What's your name? → I'm Anna. Nice to meet you!", 'Əvvəl qarşılama, sonra təqdim, sonra ad sualı və cavab.', "Hi! Welcome! — qarşılama; What's your name? — ad.", 'Hi! Welcome!'))],
      },
    },
  ],
  result: {
    done: ['Dərs 1 tamamlandı', 'Artıq başqasını təqdim edir, kim olduğunu soruşur və qonağı qarşılayırsan.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Təqdimi eşidib başa düşmək və söhbəti sıralamaq', tasks: ['u4d1_c03', 'u4d1_c10', 'u4d1_c14'] },
      { group: 'Yazı', text: 'Dostumu təqdim edən cümlə yazmaq', tasks: ['u4d1_c05', 'u4d1_c07', 'u4d1_c12'] },
      { group: 'Danışıq', text: 'Kim olduğunu soruşmaq və qonağı qarşılamaq', tasks: ['u4d1_c09', 'u4d1_c13'] },
    ],
    closing: 'Növbəti dərs — ailə üzvləri: mother, father, brother, sister.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'This is [ad].', translation: 'Bu [ad]-dır.', example: 'Hello! This is Tom.', exampleAz: 'Salam! Bu Tomdur.', usageNote: 'Başqasını təqdim edəndə This is, özünü isə I’m ilə təqdim edirsən.', pronunciation: '/ðɪs ɪz/', teachCard: 'u4d1_c02' },
    { word: 'friend', translation: 'dost', example: 'Hi, friend!', exampleAz: 'Salam, dostum!', usageNote: 'Yazılış: friend — i-dən sonra e.', pronunciation: '/frɛnd/', teachCard: 'u4d1_c04' },
    { word: 'my friend', translation: 'mənim dostum', example: 'This is my friend.', exampleAz: 'Bu mənim dostumdur.', usageNote: '“Mənim” ayrıca gəlir: my friend.', pronunciation: '/maɪ frɛnd/', teachCard: 'u4d1_c06' },
    { word: "Who's this?", translation: 'Bu kimdir?', example: "Who's this? — This is my friend.", exampleAz: 'Bu kimdir? — Bu mənim dostumdur.', usageNote: "Who's — Who is-in qısası.", pronunciation: '/huz ðɪs/', teachCard: 'u4d1_c08' },
    { word: 'Welcome!', translation: 'Xoş gəldin!', example: 'Hello! Welcome!', exampleAz: 'Salam! Xoş gəldin!', usageNote: 'Qonağı qarşılayanda deyilir.', pronunciation: '/ˈwɛlkəm/', teachCard: 'u4d1_c11' },
  ],
};

export const explains: { after: string; card: ExplainCard }[] = [
  {
    after: 'u4d1_c02',
    card: {
      type: 'explain', id: 'u4d1_c02t', number: 0,
      lead: 'Başqasını This is ilə təqdim edirsən.', focus: 'This is',
      sections: [
        { title: 'Kimi təqdim edirsən?', pairs: [{ en: "I'm [ad].", az: 'özümü' }, { en: 'This is [ad].', az: 'başqasını' }] },
        { title: 'Necə qurulur?', build: { parts: ['This is', 'ad'], examples: [{ en: 'This is Tom.', az: 'Bu Tomdur.' }] } },
      ],
      attention: 'Azərbaycancada “-dır” sonda gəlir. İngiliscə is adın əvvəlində ayrıca söz kimi gəlir.',
    },
  },
];

export const ruleMeta: Record<string, { title: string; eg: string; topic: 'questions' | 'short' | 'order' | 'polite' | 'sound' | 'numbers' | 'letters' | 'country' }> = {
  u4d1_c02t: { title: 'Başqasını necə təqdim edim?', eg: 'This is Tom.', topic: 'polite' },
};
