// Bölmə 2 · Dərs 2 — Telefon nömrəsi (What's your phone number? · It's zero five zero… · oh · Is that right? · Yes, that's right.).
// Spiral: 0–10 (Dərs 1), Hi, Nice to meet you, Excuse me, Slowly, please., Again, please., Thanks, OK.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, other, pick } from '../unit1/build';
import { PHONE_MISTAKES, notices, own, PHONE, resultTexts } from './shared';

const askPhone = goal(['askPhone'], ["What's your phone number?"]);
const yes = goal(['confirmYes'], ["Yes, that's right."]);
/** “Is that right?”, optionally after the number read back (digits or words). */
const check = own(String.raw`^(?:(?:[\d\s,.-]|zero|o(?:h)|one|two|three|four|five|six|seven|eight|nine)+[.?]?\s*)?is (?:that|it) right\s*\??$`, 'Is that right?');
const MY = "It's zero five zero, three two one, four five, six seven.";

export const lesson2: DesignLesson = {
  id: 'a1_en_b2_d2', order: 12, unit: 2, number: 2, title: 'Telefon nömrəsi', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d2_c01', badge: 'Şəxsi məlumat', subtitle: 'Kursda yeni yoldaşla nömrə mübadiləsi edirsən.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Telefon nömrəsini soruşub yoxlaya bilirəm.' },
        { icon: 'wave', text: 'Öz nömrəmi rəqəm-rəqəm deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u2d2_c02', number: 2, scenes: ['u2/word-phone-number'],
      word: "What's your phone number?", pronunciation: '/wʌts jʊr ˈfoʊn ˌnʌmbər/', reading: 'uats yor foun nambər?', az: 'Telefon nömrən nədir?',
      notes: ['Sıra azərbaycancadakı kimidir: əvvəl phone, sonra number.'],
      example: "Hi! What's your phone number?", exampleAz: 'Salam! Telefon nömrən nədir?',
    },
    {
      type: 'choice', id: 'u2d2_c03', number: 3, title: 'Dinlə və anla', why: '“phone number” — telefon nömrəsi.', hint: 'Sualın sonundakı iki sözə qulaq as.',
      prompt: 'Kursda fasilədir. Oğlan sənə yaxınlaşır.\nO nə istəyir?', audio: "Hi! What's your phone number?",
      options: ['Telefon nömrəni soruşur.', 'Adını soruşur.', 'Telefonunu istəyir.'], answer: 'Telefon nömrəni soruşur.',
      variants: [
        pick('Adını soruşur.', 'Səsdə “name” yox, “phone number” var.', ex('Telefon nömrəni soruşur.', 'Səsdə “name” yox, “phone number” deyilir.', "What's your name? — ad; What's your phone number? — nömrə.", "Hi! What's your phone number?")),
        pick('Telefonunu istəyir.', 'O, telefonu yox, nömrəni soruşur.', ex('Telefon nömrəni soruşur.', 'Sualda “number” sözü də var — telefonu yox, nömrəni soruşur.', 'phone — telefon; phone number — telefon nömrəsi.', "What's your phone number?")),
      ],
      review: {
        title: 'Dinlə və anla', why: 'Excuse me ilə nəzakətlə nömrəni soruşdu.', hint: 'Cümlənin iki hissəsinə ayrıca qulaq as.',
        prompt: 'İşdə yeni iş yoldaşı yanına gəlir.\nO nə istəyir?', audio: "Excuse me, what's your phone number?",
        options: ['Üzr istəyir.', 'Telefon nömrəni nəzakətlə soruşur.', 'Adını soruşur.'], answer: 'Telefon nömrəni nəzakətlə soruşur.',
        variants: [
          pick('Üzr istəyir.', '“Excuse me” üzr deyil — diqqət çəkir.', ex('Telefon nömrəni nəzakətlə soruşur.', '“Excuse me” diqqəti çəkir, sonra nömrə sualı gəlir.', "Excuse me — diqqət; What's your phone number? — sual.", "Excuse me, what's your phone number?")),
          pick('Adını soruşur.', 'Səsdə “phone number” var.', ex('Telefon nömrəni nəzakətlə soruşur.', 'Səsdə “name” yox, “phone number” deyilir.', "What's your name? — ad; What's your phone number? — nömrə.", "Excuse me, what's your phone number?")),
        ],
      },
    },
    {
      type: 'write', id: 'u2d2_c04', number: 4, title: 'Sualı qur', why: 'Sual düzgün sıradadır: phone number.', hint: 'Azərbaycancada “telefon nömrəsi” necə sıralanır? İngiliscə də elədir.',
      prompt: 'Kursdan sonra yoldaşına yazırsan.\nSözlərdən onun nömrəsini soruşan sual qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Kurs yoldaşı', from: 'G', lines: [{ from: 'G', text: 'Hi! Nice to meet you!' }] },
      tiles: ["What's", 'number', 'your', 'phone', 'name', 'my', '?'], rule: exact("What's your phone number?"),
      variants: [other("Sıra: What's your phone number?", ex("What's your phone number?", 'Əvvəl “phone”, sonra “number” gəlir.', "What's your phone number? — düzdür; What's your number phone? — olmur.", "Hi! What's your phone number?"))],
      review: {
        title: 'Sualı qur', why: 'Sual düzgün sıradadır: phone number.', hint: 'Azərbaycancada “telefon nömrəsi” necə sıralanır? İngiliscə də elədir.',
        prompt: 'İş yoldaşın evə gedir. Onun nömrəsini soruşmaq istəyirsən.\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'İş yoldaşı', from: 'B', lines: [{ from: 'B', text: 'OK, bye!' }] },
        tiles: ['phone', "What's", 'your', 'number', 'is', 'name', '?'], rule: exact("What's your phone number?"),
        variants: [other("Sıra: What's your phone number?", ex("What's your phone number?", 'Əvvəl “phone”, sonra “number” gəlir.', "What's your phone number? — düzdür; What's your number phone? — olmur.", "Excuse me, what's your phone number?"))],
      },
    },
    {
      type: 'word', id: 'u2d2_c05', number: 5, scenes: ['u2/word-its-number'],
      word: "It's zero five zero…", pronunciation: '/ɪts ˈzɪroʊ faɪv ˈzɪroʊ/', reading: 'its zirou fayv zirou…', az: 'Nömrəm 050…-dır.',
      structure: ["It's + nömrə"],
      notes: ['Nömrə rəqəm-rəqəm deyilir: four five, “qırx beş” kimi yox.'],
      example: MY, exampleAz: 'Nömrəm 050 321 45 67-dir.',
    },
    {
      type: 'voice', id: 'u2d2_c06', number: 6, title: 'Nömrəni de', why: 'Nömrəni rəqəm-rəqəm dedin.', hint: 'Kartdakı kimi başla və rəqəmləri bir-bir de.',
      prompt: 'Kurs yoldaşın soruşur: “What\'s your phone number?”\nÖz nömrəni de (istəsən, uydurma nömrə).', audio: "What's your phone number?", reply: 'Thanks!',
      rule: own(PHONE, MY),
      variants: [...PHONE_MISTAKES, other("It's + nömrə.", ex(MY, 'Nömrəni “It’s” ilə başla və rəqəmləri bir-bir de.', "It's zero five zero… — nömrə; My phone… — telefonun özü.", "It's zero five five, two one nine, zero three, eight eight."))],
      review: {
        title: 'Nömrəni de', why: 'Nömrəni rəqəm-rəqəm dedin.', hint: 'Kartdakı kimi başla və rəqəmləri bir-bir de.',
        prompt: 'Ofisdə yeni iş yoldaşı nömrəni soruşur.\nÖz nömrəni de (istəsən, uydurma nömrə).', audio: "Excuse me, what's your phone number?", reply: 'Thank you!',
        rule: own(PHONE, MY),
        variants: [...PHONE_MISTAKES, other("It's + nömrə.", ex(MY, 'Nömrəni “It’s” ilə başla və rəqəmləri bir-bir de.', "It's zero five zero… — nömrə; My phone… — telefonun özü.", MY))],
      },
    },
    {
      type: 'word', id: 'u2d2_c07', number: 7, scenes: ['u2/word-oh'],
      word: 'oh', pronunciation: '/oʊ/', reading: 'ou', az: 'sıfır (nömrədə)',
      notes: ['Amerikada nömrədə sıfırı çox vaxt “oh” deyirlər.'],
      example: "It's oh five oh, three two one, four five, six seven.", exampleAz: 'Nömrəm 050 321 45 67-dir.',
    },
    {
      type: 'write', id: 'u2d2_c08', number: 8, keypad: true, title: 'Nömrəni yığ', why: 'oh — sıfır; nömrəni rəqəm-rəqəm yığdın.', hint: 'Nömrədə “ou” səsini eşidəndə hansı rəqəmi basırsan? Kartı xatırla.',
      prompt: 'Kurs yoldaşın nömrəsini deyir.\nDinlə və telefonuna yığ.', audio: "It's oh five five, two eight one, four oh, nine six.", placeholder: 'Telefon nömrəsi',
      rule: exact('0552814096'),
      variants: [other('Rəqəmləri bir-bir yoxla.', ex('0552814096', '“oh” sıfırdır, onu da yığmaq lazımdır.', 'oh five — 05; zero five — 05.', "It's oh five five, two eight one, four oh, nine six."))],
      review: {
        keypad: true, title: 'Nömrəni yığ', why: 'Nömrəni rəqəm-rəqəm yığdın.', hint: 'Hər rəqəmi eşidən kimi bas; “ou” səsini unutma.',
        prompt: 'Ofisdə iş yoldaşın nömrəsini deyir.\nDinlə və yığ.', audio: "It's zero seven oh, three three nine, one oh, two five.", placeholder: 'Telefon nömrəsi',
        rule: exact('0703391025'),
        variants: [other('Rəqəmləri bir-bir yoxla.', ex('0703391025', 'Nömrədə həm “zero”, həm “oh” var — ikisi də sıfırdır.', 'zero — 0; oh — 0.', "It's zero seven oh, three three nine, one oh, two five."))],
      },
    },
    {
      type: 'word', id: 'u2d2_c09', number: 9, scenes: ['u2/word-is-that-right'],
      word: 'Is that right?', pronunciation: '/ɪz ðæt raɪt/', reading: 'iz **th**ət rayt?', az: 'Düzdür?',
      notes: ['Nömrəni təkrar edib yoxlayanda deyilir.'],
      example: 'Oh five five, two eight one… Is that right?', exampleAz: '055 281… Düzdür?',
    },
    {
      type: 'match', id: 'u2d2_c10', number: 10, title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
      prompt: 'Kursda nömrə mübadiləsi.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'Is that right?', az: 'Düzdür?', from: 'G' }, { en: "What's your phone number?", az: 'Telefon nömrən nədir?', from: 'B' }, { en: 'Slowly, please.', az: 'Yavaş, zəhmət olmasa.', from: 'M' }],
      extra: ['Telefonun haradadır?'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex("Is that right? — Düzdür?; What's your phone number? — Telefon nömrən nədir?; Slowly, please. — Yavaş, zəhmət olmasa.", 'Yoxlama, sual və xahiş fərqli işlərdir.', "Is that right? — yoxlayırsan; What's your phone number? — soruşursan.", 'Oh five five… Is that right?'))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
        prompt: 'Ofisdə nömrə mübadiləsi.\nHər cümləyə mənasını qoş.',
        rows: [{ en: "It's oh five oh…", az: 'Nömrəm 050…-dır.', from: 'B' }, { en: "Yes, that's right.", az: 'Bəli, düzdür.', from: 'G' }, { en: 'Again, please.', az: 'Bir də, zəhmət olmasa.', from: 'M' }],
        extra: ['Telefon nömrən nədir?'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("It's oh five oh… — Nömrəm 050…-dır.; Yes, that's right. — Bəli, düzdür.; Again, please. — Bir də, zəhmət olmasa.", 'Nömrə, təsdiq və xahiş fərqli işlərdir.', "Is that right? — sual; Yes, that's right. — cavab.", "Yes, that's right."))],
      },
    },
    {
      type: 'word', id: 'u2d2_c11', number: 11, scenes: ['u2/word-thats-right'],
      word: "Yes, that's right.", pronunciation: '/jes ðæts raɪt/', reading: 'yes, **th**əts rayt', az: 'Bəli, düzdür.',
      example: "Is that right? — Yes, that's right.", exampleAz: 'Düzdür? — Bəli, düzdür.',
    },
    {
      type: 'write', id: 'u2d2_c12', number: 12, title: 'Cavab yaz', why: 'Nömrənin düz olduğunu təsdiqlədin.', hint: 'Nömrə düzdür — onun sualına razılıqla cavab ver.',
      prompt: 'Kurs yoldaşın nömrəni yazıb yoxlayır. Nömrə düzdür.\nTəsdiqlə.', placeholder: 'Cavabını yaz',
      chat: { partner: 'Kurs yoldaşı', from: 'G', lines: [{ from: 'G', text: 'Zero five zero, three two one, four five, six seven. Is that right?' }] }, rule: yes,
      variants: [other("Yes, that's right.", ex("Yes, that's right.", 'Nömrə düzdür, ona görə razılıq bildirirsən.', "Is that right? — Yes, that's right.", "Oh five five… Is that right? — Yes, that's right."))],
      review: {
        title: 'Cavab yaz', why: 'Nömrənin düz olduğunu təsdiqlədin.', hint: 'Nömrə düzdür — onun sualına razılıqla cavab ver.',
        prompt: 'İdman zalının qəbulu nömrəni oxuyub yoxlayır. Nömrə düzdür.\nTəsdiqlə.', placeholder: 'Cavabını yaz',
        chat: { partner: 'İdman zalının qəbulu', from: 'B', lines: [{ from: 'B', text: 'Oh five five, two one nine, oh three, eight eight. Is that right?' }] }, rule: yes,
        variants: [other("Yes, that's right.", ex("Yes, that's right.", 'Nömrə düzdür, ona görə razılıq bildirirsən.', "Is that right? — Yes, that's right.", "Yes, that's right."))],
      },
    },
    {
      type: 'two', id: 'u2d2_c13', number: 13, title: 'İki mesaj yaz', why: 'Nömrəni soruşdun və yazdığını yoxladın.', hint: 'Birinci mesajda sual ver, ikincidə yazdığını yoxla.',
      prompt: 'Kursda yeni yoldaşla tanış oldun.\nİki mesaj yaz:\n1. Onun telefon nömrəsini soruş.\n2. Nömrəni yazdın — düz olduğunu soruş.',
      fields: [
        { id: 'u2d2_c13a', label: 'Birinci mesaj', placeholder: 'Nömrəsini soruş', rule: askPhone, purpose: 'nömrəsini soruşmaq', empty: 'Birinci mesajı da yaz.' },
        { id: 'u2d2_c13b', label: 'İkinci mesaj', placeholder: 'Düz olduğunu soruş', rule: check, purpose: 'düz olduğunu soruşmaq', empty: 'İkinci mesajı da yaz.' },
      ],
      variants: [
        { field: 'u2d2_c13a', match: { other: true }, explain: ex("What's your phone number?", 'Bu mesajda onun nömrəsini soruşmalısan.', "What's your phone number? — düzdür; What's your number phone? — olmur.", "Hi! What's your phone number?") },
        { field: 'u2d2_c13b', match: { other: true }, explain: ex('Is that right?', 'Bu mesajda yazdığın nömrənin düz olduğunu soruşursan.', "Is that right? — sual; Yes, that's right. — cavab.", 'Oh five five… Is that right?') },
      ],
      review: {
        title: 'İki mesaj yaz', why: 'Nömrəni soruşdun və yazdığını yoxladın.', hint: 'Birinci mesajda sual ver, ikincidə yazdığını yoxla.',
        prompt: 'Ofisdə yeni iş yoldaşına yazırsan.\nİki mesaj yaz:\n1. Onun telefon nömrəsini soruş.\n2. Nömrəni yazdın — düz olduğunu soruş.',
        fields: [
          { id: 'u2d2_c13a', label: 'Birinci mesaj', placeholder: 'Nömrəsini soruş', rule: askPhone, purpose: 'nömrəsini soruşmaq', empty: 'Birinci mesajı da yaz.' },
          { id: 'u2d2_c13b', label: 'İkinci mesaj', placeholder: 'Düz olduğunu soruş', rule: check, purpose: 'düz olduğunu soruşmaq', empty: 'İkinci mesajı da yaz.' },
        ],
        variants: [
          { field: 'u2d2_c13a', match: { other: true }, explain: ex("What's your phone number?", 'Bu mesajda onun nömrəsini soruşmalısan.', "What's your phone number? — düzdür; What's your number phone? — olmur.", "Excuse me, what's your phone number?") },
          { field: 'u2d2_c13b', match: { other: true }, explain: ex('Is that right?', 'Bu mesajda yazdığın nömrənin düz olduğunu soruşursan.', "Is that right? — sual; Yes, that's right. — cavab.", 'Is that right?') },
        ],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u2d2_c14', number: 14, title: 'Söhbəti sırala', why: 'Sual, nömrə, yoxlama və təsdiq düz sıradadır.', hint: 'Əvvəl sual gəlir; nömrəni eşidən onu yoxlayır.',
      prompt: 'Kursda nömrə mübadiləsi.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: "What's your phone number?", from: 'B' }, { en: '2', az: "It's zero five one, four four two, three eight, nine six.", from: 'G' }, { en: '3', az: 'Zero five one, four four two, three eight, nine six. Is that right?', from: 'B' }, { en: '4', az: "Yes, that's right.", from: 'G' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("What's your phone number? → It's zero five one… → Zero five one… Is that right? → Yes, that's right.", 'Sual, nömrə, yoxlama, sonra təsdiq.', "Is that right? — yoxlama; Yes, that's right. — təsdiq.", "What's your phone number?"))],
      review: {
        title: 'Söhbəti sırala', why: 'Sual, nömrə, xahiş və təkrar düz sıradadır.', hint: 'Əvvəl sual gəlir; çox sürətli olanda nə xahiş edirsən?',
        prompt: 'Ofisdə nömrə mübadiləsi.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: "What's your phone number?", from: 'G' }, { en: '2', az: "It's oh seven oh, two two one, eight eight, three oh.", from: 'B' }, { en: '3', az: 'Sorry? Slowly, please.', from: 'G' }, { en: '4', az: 'Oh… seven… oh… two two one…', from: 'B' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("What's your phone number? → It's oh seven oh… → Sorry? Slowly, please. → Oh… seven… oh…", 'Nömrə sürətli deyildi, xahişdən sonra yavaş təkrar olundu.', 'Slowly, please. — sürətli idi; Again, please. — eşitmədin.', 'Sorry? Slowly, please.'))],
      },
    },
  ],
  result: {
    done: ['Dərs 2 tamamlandı', 'Artıq telefon nömrəsini soruşur, deyir, yığır və yoxlaya bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Nömrə sualını və nömrəni eşidib anlamaq', tasks: ['u2d2_c03', 'u2d2_c08', 'u2d2_c10', 'u2d2_c14'] },
      { group: 'Yazı', text: 'Nömrəni soruşmaq, yoxlamaq və təsdiqləmək', tasks: ['u2d2_c04', 'u2d2_c12', 'u2d2_c13'] },
      { group: 'Danışıq', text: 'Öz nömrəni rəqəm-rəqəm demək', tasks: ['u2d2_c06'] },
    ],
    closing: 'Növbəti dərs — hərflər: hava limanında kodları tanıyırsan.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: "What's your phone number?", translation: 'Telefon nömrən nədir?', example: "Hi! What's your phone number?", exampleAz: 'Salam! Telefon nömrən nədir?', usageNote: 'Əvvəl phone, sonra number.', pronunciation: '/wʌts jʊr ˈfoʊn ˌnʌmbər/', teachCard: 'u2d2_c02' },
    { word: "It's …", translation: 'Nömrəm …-dır', example: MY, exampleAz: 'Nömrəm 050 321 45 67-dir.', usageNote: 'Nömrə rəqəm-rəqəm deyilir.', pronunciation: '/ɪts/', teachCard: 'u2d2_c05' },
    { word: 'oh', translation: 'sıfır (nömrədə)', example: "It's oh five oh…", exampleAz: 'Nömrəm 050…-dır.', usageNote: 'Amerikada nömrədə 0.', pronunciation: '/oʊ/', teachCard: 'u2d2_c07' },
    { word: 'Is that right?', translation: 'Düzdür?', example: 'Oh five five… Is that right?', exampleAz: '055… Düzdür?', usageNote: 'Yoxlamaq üçün.', pronunciation: '/ɪz ðæt raɪt/', teachCard: 'u2d2_c09' },
    { word: "Yes, that's right.", translation: 'Bəli, düzdür.', example: "Is that right? — Yes, that's right.", exampleAz: 'Düzdür? — Bəli, düzdür.', usageNote: 'Təsdiq.', pronunciation: '/jes ðæts raɪt/', teachCard: 'u2d2_c11' },
  ],
};
