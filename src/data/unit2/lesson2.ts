// Bölmə 2 · Dərs 2 — Telefon nömrəsi (What's your phone number? · It's zero five zero… · oh · Is that right? · Yes, that's right.).
// Spiral: 0–10 (Dərs 1), Hi, Nice to meet you, Excuse me, More slowly, please., Say that again, please., Thanks, OK.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, other, pick } from '../unit1/build';
import { PHONE_MISTAKES, notices, own, PHONE, resultTexts } from './shared';

const askPhone = goal(['askPhone'], ["What's your phone number?"]);
const yes = goal(['confirmYes'], ["Yes, that's right."]);
/** “Is that right?”, optionally after the number read back (digits or words). */
const check = own(String.raw`^(?:(?:[\d\s,.-]|zero|o(?:h)|one|two|three|four|five|six|seven|eight|nine)+[.?]?\s*)?is (?:that|it) (?:right|correct)\s*\??$`, '050 321 45 67? Is that right?');
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
      shortForm: { full: "It is", short: "It's" },
      word: "What's your phone number? · It's zero five zero…", pronunciation: '/wʌts jʊr ˈfoʊn ˌnʌmbər/ · /ɪts ˈzɪroʊ faɪv ˈzɪroʊ/', reading: 'uats yor foun nambər? · its zirou fayv zirou…', az: 'Telefon nömrən nədir? · Nömrəm 050…-dir.',
      structure: ["It's + nömrə"],
      notes: ['Sıra azərbaycancadakı kimidir: əvvəl phone, sonra number.', 'Nömrə rəqəm-rəqəm deyilir: four five, “qırx beş” kimi yox.'],
      example: "Hi! What's your phone number?", exampleAz: 'Salam! Telefon nömrən nədir?',
    },
    {
      type: 'choice', id: 'u2d2_c03', number: 3, title: 'Dinlə və anla', why: '“phone number” — telefon nömrəsi.', hint: 'Sualın sonundakı iki sözə qulaq as.',
      prompt: 'Kursda fasilədir. Oğlan sənə yaxınlaşır.\nO nə istəyir?', audio: "Hi! What's your phone number?",
      options: ['Telefon nömrəni soruşur.', 'Adını soruşur.', 'Telefonunu istəyir.'], answer: 'Telefon nömrəni soruşur.',
      variants: [
        pick('Adını soruşur.', 'Səsdə “name” yox, “phone number” var.', ex('Telefon nömrəni soruşur.', 'Səsdə “name” yox, “phone number” deyilir.', "What's your name? — ad; What's your phone number? — nömrə.", "Hi! What's your phone number?")),
        pick('Telefonunu istəyir.', 'O, telefonu yox, nömrəni soruşur.', ex('Telefon nömrəni soruşur.', 'Sualda “number” sözü də var — telefonu yox, nömrəni soruşur.', "What's your phone number? — nömrə; Phone, please. — telefonun özü.", "What's your phone number?")),
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
      prompt: 'Kursun yeni üzvünə mesaj yazırsan.\nSözlərdən nömrəsini soruşan sual qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Yeni kurs yoldaşı', from: 'G', lines: [{ from: 'G', text: 'Hi! Nice to meet you!' }] },
      tiles: ["What's", 'number', 'your', 'phone', 'name', 'my', '?'], rule: exact("What's your phone number?"),
      variants: [other("Sıra: What's your phone number?", ex("What's your phone number?", 'Əvvəl “phone”, sonra “number” gəlir.', "What's your phone number? — nömrə; What's your name? — ad.", "Hi! What's your phone number?"))],
      review: {
        title: 'Sualı qur', why: 'Sual düzgün sıradadır: phone number.', hint: 'Azərbaycancada “telefon nömrəsi” necə sıralanır? İngiliscə də elədir.',
        prompt: 'Yeni iş yoldaşına mesaj yazırsan.\nSözlərdən nömrəsini soruşan sual qur.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'Yeni iş yoldaşı', from: 'B', lines: [{ from: 'B', text: 'Hello! How are you?' }] },
        tiles: ['phone', "What's", 'your', 'number', 'is', 'name', '?'], rule: exact("What's your phone number?"),
        variants: [other("Sıra: What's your phone number?", ex("What's your phone number?", 'Əvvəl “phone”, sonra “number” gəlir.', "What's your phone number? — nömrə; What's your name? — ad.", "Excuse me, what's your phone number?"))],
      },
    },
    {
      type: 'voice', id: 'u2d2_c06', number: 6, title: 'Nömrəni de', why: 'Nömrəni rəqəm-rəqəm dedin.', hint: 'Kartdakı kimi başla və rəqəmləri bir-bir de.',
      prompt: 'Kurs yoldaşın soruşur: “What\'s your phone number?”\nÖz nömrəni de (istəsən, uydurma nömrə).', audio: "What's your phone number?", reply: 'Thanks!',
      rule: own(PHONE, MY),
      variants: [...PHONE_MISTAKES, other("It's + nömrə.", ex(MY, 'Nömrəni “It’s” ilə başla və rəqəmləri bir-bir de.', "What's your phone number? — It's zero five zero…", "It's zero five five, two one nine, zero three, eight eight."))],
      review: {
        title: 'Nömrəni de', why: 'Nömrəni rəqəm-rəqəm dedin.', hint: 'Kartdakı kimi başla və rəqəmləri bir-bir de.',
        prompt: 'Ofisdə yeni iş yoldaşı nömrəni soruşur.\nÖz nömrəni de (istəsən, uydurma nömrə).', audio: "Excuse me, what's your phone number?", reply: 'Thank you!',
        rule: own(PHONE, MY),
        variants: [...PHONE_MISTAKES, other("It's + nömrə.", ex(MY, 'Nömrəni “It’s” ilə başla və rəqəmləri bir-bir de.', "What's your phone number? — It's zero five zero…", MY))],
      },
    },
    {
      type: 'word', id: 'u2d2_c07', number: 7, scenes: ['u2/word-oh'],
      word: 'oh', pronunciation: '/oʊ/', reading: 'ou', az: 'sıfır (nömrədə)',
      notes: ['Amerikada nömrədə sıfırı çox vaxt “oh” deyirlər.'],
      example: "It's oh five oh, three two one, four five, six seven.", exampleAz: 'Nömrəm 050 321 45 67-dir.',
    },
    {
      type: 'write', id: 'u2d2_c08', number: 8, keypad: true, title: 'Nömrəni yığ', why: 'Nömrəni rəqəm-rəqəm yığdın.', hint: 'Hər rəqəmi eşidən kimi bas; ilk rəqəmi də unutma.',
      prompt: 'Eşitdiyin nömrəni yığ.', audio: "It's zero five five, two eight one, four zero, nine six.", placeholder: 'Telefon nömrəsi',
      rule: exact('0552814096'),
      variants: [other('Rəqəmləri bir-bir yoxla.', ex('0552814096', 'Nömrə rəqəm-rəqəm deyilir və elə də yığılır.', "It's zero five five… — 055; It's five five… — 55.", "It's zero five five, two eight one, four zero, nine six."))],
      review: {
        keypad: true, title: 'Nömrəni yığ', why: 'Nömrəni rəqəm-rəqəm yığdın.', hint: 'Hər rəqəmi eşidən kimi bas; “ou” səsini unutma.',
        prompt: 'Eşitdiyin rəqəmləri yığ.', audio: "It's zero seven oh, three three nine, one oh, two five.", placeholder: 'Telefon nömrəsi',
        rule: exact('0703391025'),
        variants: [other('Rəqəmləri bir-bir yoxla.', ex('0703391025', 'Nömrədə həm “zero”, həm “oh” var — ikisi də sıfırdır.', "It's zero seven oh… — 070; It's seven… — 7.", "It's zero seven oh, three three nine, one oh, two five."))],
      },
    },
    {
      type: 'word', id: 'u2d2_c09', number: 9, scenes: ['u2/word-is-that-right'],
      shortForm: { full: "that is", short: "that's" },
      word: "Is that right? · Yes, that's right.", pronunciation: '/ɪz ðæt raɪt/ · /jes ðæts raɪt/', reading: 'iz **th**ət rayt? · yes, **th**əts rayt', az: 'Düzdür? · Bəli, düzdür.',
      notes: ['Nömrəni təkrar edib yoxlayanda deyilir.'],
      example: "Is that right? — Yes, that's right.", exampleAz: 'Düzdür? — Bəli, düzdür.',
    },
    {
      type: 'match', id: 'u2d2_c10', number: 10, title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
      prompt: 'Kursda nömrə mübadiləsi.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'Is that right?', az: 'Düzdür?', from: 'G' }, { en: "What's your phone number?", az: 'Telefon nömrən nədir?', from: 'B' }, { en: "Thanks! — You're welcome.", az: 'Sağ ol! — Dəyməz.', from: 'M' }],
      extra: ['Telefonun haradadır?'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex("Is that right? — Düzdür?; What's your phone number? — Telefon nömrən nədir?; Thanks! — You're welcome. — Sağ ol! — Dəyməz.", 'Yoxlama, sual və təşəkkür fərqli işlərdir.', "Is that right? — yoxlayırsan; What's your phone number? — soruşursan.", 'Oh five five… Is that right?'))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
        prompt: 'Ofisdə nömrə mübadiləsi.\nHər cümləyə mənasını qoş.',
        rows: [{ en: "It's oh five oh…", az: 'Nömrəm 050…-dir.', from: 'B' }, { en: "Yes, that's right.", az: 'Bəli, düzdür.', from: 'G' }, { en: 'Say that again, please.', az: 'Bunu bir daha deyin, zəhmət olmasa.', from: 'M' }],
        extra: ['Telefon nömrən nədir?'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("It's oh five oh… — Nömrəm 050…-dır.; Yes, that's right. — Bəli, düzdür.; Say that again, please. — Bunu bir daha deyin, zəhmət olmasa.", 'Nömrə, təsdiq və xahiş fərqli işlərdir.', "Is that right? — sual; Yes, that's right. — cavab.", "Yes, that's right."))],
      },
    },
    {
      type: 'write', id: 'u2d2_c12', number: 12, title: 'Cavab yaz', why: 'Nömrənin düz olduğunu təsdiqlədin.', hint: 'Nömrə düzdür — onun sualına razılıqla cavab ver.',
      prompt: 'Kurs yoldaşın nömrəni yazıb yoxlayır. Nömrə düzdür.\nTəsdiqlə.', placeholder: 'Cavabını yaz',
      chat: { partner: 'Kurs yoldaşı', from: 'G', lines: [{ from: 'G', text: '050 321 45 67? Is that right?' }] }, rule: yes,
      variants: [other("Yes, that's right.", ex("Yes, that's right.", 'Nömrə düzdür, ona görə razılıq bildirirsən.', "Is that right? — Yes, that's right.", "Oh five five… Is that right? — Yes, that's right."))],
      review: {
        title: 'Cavab yaz', why: 'Nömrənin düz olduğunu təsdiqlədin.', hint: 'Nömrə düzdür — onun sualına razılıqla cavab ver.',
        prompt: 'İdman zalının qəbulu nömrəni mesajla yoxlayır. Nömrə düzdür.\nTəsdiqlə.', placeholder: 'Cavabını yaz',
        chat: { partner: 'İdman zalının qəbulu', from: 'B', lines: [{ from: 'B', text: '055 219 03 88? Is that right?' }] }, rule: yes,
        variants: [other("Yes, that's right.", ex("Yes, that's right.", 'Nömrə düzdür, ona görə razılıq bildirirsən.', "Is that right? — Yes, that's right.", "Yes, that's right."))],
      },
    },
    {
      type: 'two', id: 'u2d2_c13', number: 13, title: 'İki mesaj yaz', why: 'Nömrəni soruşdun və yazdığını yoxladın.', hint: 'Birinci mesajda sual ver, ikincidə yazdığını yoxla.',
      prompt: 'Kursun yeni üzvünə yazırsan.\nİki mesaj yaz:\n1. Nömrəsini soruş.\n2. Düz yazdığını soruş.',
      fields: [
        { id: 'u2d2_c13a', label: 'Birinci mesaj', placeholder: 'Nömrəsini soruş', rule: askPhone, purpose: 'nömrəsini soruşmaq', empty: 'Birinci mesajı da yaz.' },
        { id: 'u2d2_c13b', label: 'İkinci mesaj', placeholder: 'Düz olduğunu soruş', rule: check, purpose: 'düz olduğunu soruşmaq', empty: 'İkinci mesajı da yaz.' },
      ],
      variants: [
        { field: 'u2d2_c13a', match: { other: true }, explain: ex("What's your phone number?", 'Bu mesajda onun nömrəsini soruşmalısan.', "What's your phone number? — nömrə; What's your name? — ad.", "Hi! What's your phone number?") },
        { field: 'u2d2_c13b', match: { other: true }, explain: ex('Is that right?', 'Bu mesajda yazdığın nömrənin düz olduğunu soruşursan.', "Is that right? — sual; Yes, that's right. — cavab.", 'Oh five five… Is that right?') },
      ],
      review: {
        title: 'İki mesaj yaz', why: 'Nömrəni soruşdun və yazdığını yoxladın.', hint: 'Birinci mesajda sual ver, ikincidə yazdığını yoxla.',
        prompt: 'İdman zalının yeni üzvünə yazırsan.\nİki mesaj yaz:\n1. Nömrəsini soruş.\n2. Düz yazdığını soruş.',
        fields: [
          { id: 'u2d2_c13a', label: 'Birinci mesaj', placeholder: 'Nömrəsini soruş', rule: askPhone, purpose: 'nömrəsini soruşmaq', empty: 'Birinci mesajı da yaz.' },
          { id: 'u2d2_c13b', label: 'İkinci mesaj', placeholder: 'Düz olduğunu soruş', rule: check, purpose: 'düz olduğunu soruşmaq', empty: 'İkinci mesajı da yaz.' },
        ],
        variants: [
          { field: 'u2d2_c13a', match: { other: true }, explain: ex("What's your phone number?", 'Bu mesajda onun nömrəsini soruşmalısan.', "What's your phone number? — nömrə; What's your name? — ad.", "Excuse me, what's your phone number?") },
          { field: 'u2d2_c13b', match: { other: true }, explain: ex('Is that right?', 'Bu mesajda yazdığın nömrənin düz olduğunu soruşursan.', "Is that right? — sual; Yes, that's right. — cavab.", 'Is that right?') },
        ],
      },
    },
    {
      // “Söhbəti tamamla” (20 Nov 2026): turns are ready, one word is missing. Each section keeps both kinds.
      type: 'choice', id: 'u2d2_c14', number: 14, title: 'Söhbəti tamamla', why: 'Nömrə yoxlandı və təsdiq olundu.', hint: 'Oğlan “Is that right?” soruşdu — qız nömrənin düz olduğunu deyir.',
      prompt: 'Kursda nömrə mübadiləsi.\nSöhbətdə bir söz əskikdir. Düzgün sözü seç.',
      dialog: [{ from: 'B', text: "What's your phone number?" }, { from: 'G', text: "It's zero five one, four four two, three eight, nine six." }, { from: 'B', text: 'Zero five one, four four two, three eight, nine six. Is that right?' }],
      gap: { speaker: 'G', before: "Yes, that's", after: '.' }, options: ['right', 'fine', 'name'], answer: 'right',
      variants: [
        pick('fine', '“Is that right?” sualına “right” ilə cavab verilir.', ex('right', 'Oğlan nömrənin düz olub-olmadığını soruşdu.', "Yes, that's right. — düzdür; I'm fine. — yaxşıyam.", "Yes, that's right.")),
        pick('name', 'Burada ad yox, nömrənin düzlüyü soruşulur.', ex('right', 'Sual nömrə haqqındadır, ad haqqında deyil.', "Yes, that's right. — düzdür; My name is [ad] — ad.", "Yes, that's right.")),
      ],
      review: {
        title: 'Söhbəti tamamla', why: 'Yavaş danışmağı xahiş etdin.', hint: 'Nömrə çox sürətli deyildi — nə xahiş edirsən?',
        prompt: 'Ofisdə nömrə mübadiləsi.\nSöhbətdə bir söz əskikdir. Düzgün sözü seç.',
        dialog: [{ from: 'G', text: "What's your phone number?" }, { from: 'B', text: "It's oh seven oh, two two one, eight eight, three oh." }],
        gap: { speaker: 'G', before: 'Sorry? More', after: ', please.' }, options: ['slowly', 'again', 'right'], answer: 'slowly',
        variants: [
          pick('again', '“again” “Say that again” içində gəlir; burada problem sürətdədir.', ex('slowly', 'Nömrə çox sürətli deyildi, ona görə “More slowly”.', 'More slowly, please. — yavaş; Say that again, please. — bir də.', 'Sorry? More slowly, please.')),
          pick('right', '“right” düzlüyü yoxlayır, yavaşlığı yox.', ex('slowly', 'Sürətli danışana “More slowly” deyirsən.', 'More slowly, please. — yavaş; Is that right? — düzdür?', 'Sorry? More slowly, please.')),
        ],
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
    { word: "It's [nömrə]", translation: 'Nömrəm [nömrə]-dir', example: MY, exampleAz: 'Nömrəm 050 321 45 67-dir.', usageNote: 'Nömrə rəqəm-rəqəm deyilir.', pronunciation: '/ɪts/', teachCard: 'u2d2_c02' },
    { word: 'oh', translation: 'sıfır (nömrədə)', example: "It's oh five oh…", exampleAz: 'Nömrəm 050…-dir.', usageNote: 'Amerikada nömrədə 0.', pronunciation: '/oʊ/', teachCard: 'u2d2_c07' },
    { word: 'Is that right?', translation: 'Düzdür?', example: 'Oh five five… Is that right?', exampleAz: '055… Düzdür?', usageNote: 'Yoxlamaq üçün.', pronunciation: '/ɪz ðæt raɪt/', teachCard: 'u2d2_c09' },
    { word: "Yes, that's right.", translation: 'Bəli, düzdür.', example: "Is that right? — Yes, that's right.", exampleAz: 'Düzdür? — Bəli, düzdür.', usageNote: 'Təsdiq.', pronunciation: '/jes ðæts raɪt/', teachCard: 'u2d2_c09' },
  ],
};
