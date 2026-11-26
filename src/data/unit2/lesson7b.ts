// Bölmə 2 · Dərs 7 · 3–4-cü hissə — Yaş. 26 Nov 2026: split in two parts (a lesson part is 8–12 screens, nothing removed).
// 3-cü hissə: How old are you? · “-ty” nümunəsi (13 ↔ 30). 4-cü hissə: twenty-five · I'm twenty-five. · years old — tanıma.
// İdman zalında qeydiyyat. Yaş həssasdır: sərbəst cavabda istənilən yaş qəbul olunur.
// Spiral: 11–20 (1–2-ci hissə), I'm …, And you?, No, telefon nömrəsi (Dərs 2), first name (Dərs 5).
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { AGE_MISTAKES, AGE, AGE_FIELD, NAME, notices, own, PHONE, resultTexts } from './shared';

const myAge = own(AGE, "I'm twenty-five.", "I'm 25.");

export const lesson7b: DesignLesson = {
  id: 'a1_en_b2_d7b', order: 34, unit: 2, number: 7, part: 3, title: 'Neçə yaşın var?', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d7b_c01', badge: 'Şəxsi məlumat', subtitle: 'İdman zalında qeydiyyat: yaş da soruşulur.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Yaşı soruşa bilirəm.' },
        { icon: 'wave', text: '13 ilə 30-u eşidib ayırıram.' },
      ],
    },
    {
      type: 'word', id: 'u2d7b_c02', number: 2, scenes: ['u2/word-how-old'],
      word: 'How old are you?', pronunciation: '/haʊ oʊld ɑr ju/', reading: 'hau ould ar yu?', az: 'Neçə yaşın var?',
      notes: ['Hərfi mənası “nə qədər yaşlısan?” — ingiliscə yaş belə soruşulur.'],
      example: 'Hi! How old are you?', exampleAz: 'Salam! Neçə yaşın var?',
    },
    {
      type: 'choice', id: 'u2d7b_c03', number: 3, title: 'Dinlə və anla', why: '“How old” — yaş sualı.', hint: '“How” ilə “are you” arasındakı sözə qulaq as.',
      prompt: 'İdman zalında qeydiyyatdasan. Məşqçi sual verir.\nO nə soruşur?', audio: 'How old are you?',
      options: ['Halını soruşur.', 'Yaşını soruşur.', 'Adını soruşur.'], answer: 'Yaşını soruşur.',
      variants: [
        pick('Halını soruşur.', 'Halı “How are you?” ilə soruşurlar; burada “old” var.', ex('Yaşını soruşur.', 'Sualda “old” sözü var — bu, yaş sualıdır.', 'How are you? — hal; How old are you? — yaş.', 'How old are you?')),
        pick('Adını soruşur.', 'Səsdə “name” yoxdur.', ex('Yaşını soruşur.', 'Sualda “name” yox, “old” var.', "What's your name? — ad; How old are you? — yaş.", 'How old are you?')),
      ],
      review: {
        title: 'Dinlə və anla', why: '“How old” — yaş sualı.', hint: 'Sonuncu sualdakı sözlərə diqqətlə qulaq as.',
        prompt: 'Kursda yeni yoldaş yaşını dedi və sənə sual verir.\nO nə soruşur?', audio: "I'm thirty. How old are you?",
        options: ['Yaşını soruşur.', 'Halını soruşur.', 'Soyadını soruşur.'], answer: 'Yaşını soruşur.',
        variants: [
          pick('Halını soruşur.', 'Burada “old” var — yaş sualıdır.', ex('Yaşını soruşur.', 'Sualda “old” sözü var.', 'How are you? — hal; How old are you? — yaş.', "I'm thirty. How old are you?")),
          pick('Soyadını soruşur.', 'Səsdə “last name” yoxdur.', ex('Yaşını soruşur.', 'Sualda “old” var, “last name” yox.', "What's your last name? — soyad; How old are you? — yaş.", 'How old are you?')),
        ],
      },
    },
    {
      type: 'word', id: 'u2d7b_c04', number: 4, scenes: ['u2/word-ty'],
      word: 'thirty · forty · fifty · sixty', pronunciation: '/ˈθɜrti/ · /ˈfɔrti/ · /ˈfɪfti/ · /ˈsɪksti/', reading: '**th**ırdi · fordi · fifti · siksti', az: '30 · 40 · 50 · 60',
      structure: ['six → sixty', 'three → thirty; four → forty; five → fifty'],
      notes: ['Vurğu əvvəldədir: THIR-ty; thirteen-də isə sondadır.'],
      example: 'Thirty, forty, fifty, sixty!', exampleAz: 'Otuz, qırx, əlli, altmış!',
    },
    {
      type: 'write', id: 'u2d7b_c05', number: 5, keypad: true, title: 'Kodu yığ', why: 'thirty, thirteen — 3013.', hint: 'Vurğuya qulaq as: hansı söz əvvəldən, hansı sondan güclüdür?',
      prompt: 'Eşitdiyin rəqəmləri yığ.', audio: 'Thirty, thirteen.', placeholder: 'Dolabın kodu',
      rule: exact('3013'),
      variants: [other('13 və 30-u ayır.', ex('3013', 'Əvvəl THIR-ty (30), sonra thir-TEEN (13).', 'THIR-ty — 30; thir-TEEN — 13.', 'Thirty, thirteen.'))],
      review: {
        keypad: true, title: 'Kodu yığ', why: 'fifty, fifteen — 5015.', hint: 'Vurğuya qulaq as: hansı söz əvvəldən, hansı sondan güclüdür?',
        prompt: 'Eşitdiyin rəqəmləri yığ.', audio: 'Fifty, fifteen.', placeholder: 'Qapının kodu',
        rule: exact('5015'),
        variants: [other('15 və 50-ni ayır.', ex('5015', 'Əvvəl FIF-ty (50), sonra fif-TEEN (15).', 'FIF-ty — 50; fif-TEEN — 15.', 'Fifty, fifteen.'))],
      },
    },
    {
      type: 'choice', id: 'u2d7b_c07', number: 7, title: 'Cütü ayır: -teen yoxsa -ty?', why: 'thir-TEEN, FOR-ty, FIF-ty.', hint: 'Vurğuya qulaq as: sonda güclüdürsə “teen”, əvvəldə güclüdürsə “ty”.',
      prompt: 'İdman zalında məşqçi üç dolabın nömrəsini deyir.\nHansı nömrələrdir?', audio: 'Thirteen, forty, fifty.',
      options: ['30, 14, 15', '13, 40, 50', '13, 14, 50'], answer: '13, 40, 50',
      variants: [
        pick('30, 14, 15', '“-teen” və “-ty” yerini dəyişdin.', ex('13, 40, 50', 'Birinci sözdə vurğu sondadır (thir-TEEN), qalanlarda əvvəldə (FOR-ty, FIF-ty).', 'thir-TEEN — 13; THIR-ty — 30.', 'Thirteen, forty, fifty.')),
        pick('13, 14, 50', 'İkinci söz “-ty” ilə bitir.', ex('13, 40, 50', 'İkinci sözdə vurğu əvvəldədir: FOR-ty — 40.', 'four-TEEN — 14; FOR-ty — 40.', 'Thirteen, forty, fifty.')),
      ],
      review: {
        title: 'Cütü ayır: -teen yoxsa -ty?', why: 'THIR-ty, four-TEEN, fif-TEEN.', hint: 'Vurğuya qulaq as: sonda güclüdürsə “teen”, əvvəldə güclüdürsə “ty”.',
        prompt: 'Hovuzda qəbul üç dolabın nömrəsini deyir.\nHansı nömrələrdir?', audio: 'Thirty, fourteen, fifteen.',
        options: ['30, 14, 15', '13, 40, 50', '30, 40, 15'], answer: '30, 14, 15',
        variants: [
          pick('13, 40, 50', '“-teen” və “-ty” yerini dəyişdin.', ex('30, 14, 15', 'Birinci sözdə vurğu əvvəldədir (THIR-ty), qalanlarda sonda (four-TEEN, fif-TEEN).', 'THIR-ty — 30; thir-TEEN — 13.', 'Thirty, fourteen, fifteen.')),
          pick('30, 40, 15', 'İkinci söz “-teen” ilə bitir.', ex('30, 14, 15', 'İkinci sözdə vurğu sondadır: four-TEEN — 14.', 'four-TEEN — 14; FOR-ty — 40.', 'Thirty, fourteen, fifteen.')),
        ],
      },
    },
    {
      type: 'write', id: 'u2d7b_c13', number: 13, title: 'Sualı qur', why: 'Yaşı soruşdun: How old are you?', hint: 'Kartdakı sualı xatırla — yaş haqqında.',
      prompt: 'Yeni tanışa mesaj yazırsan, yaşını soruş.\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Yeni tanış', from: 'G', lines: [{ from: 'G', text: 'Hello! Nice to meet you.' }] },
      tiles: ['old', 'How', 'you', 'are', 'is', 'your', '?'], rule: exact('How old are you?'),
      variants: [other('How old are you?', ex('How old are you?', 'Yaş “How old” ilə soruşulur, sonra “are you”.', 'How are you? — hal; How old are you? — yaş.', 'Hi! How old are you?'))],
      review: {
        title: 'Sualı qur', why: 'Yaşı soruşdun: How old are you?', hint: 'Kartdakı sualı xatırla — yaş haqqında.',
        prompt: 'Yeni yoldaşına mesaj yazırsan, yaşını soruş.\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'Kurs yoldaşı', from: 'B', lines: [{ from: 'B', text: 'Hello!' }] },
        tiles: ['are', 'old', 'How', 'is', 'you', 'name', '?'], rule: exact('How old are you?'),
        variants: [other('How old are you?', ex('How old are you?', 'Yaş “How old” ilə soruşulur, sonra “are you”.', 'How are you? — hal; How old are you? — yaş.', 'How old are you?'))],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u2d7b_c14', number: 14, title: 'Söhbəti sırala', why: 'Sual, cavab, yanlış eşitmə və düzəliş düz sıradadır.', hint: 'Əvvəl sual gəlir; yanlış eşidən soruşur, o biri düzəldir.',
      prompt: 'İdman zalında tanışlıq.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: 'How old are you?', from: 'B' }, { en: '2', az: "I'm thirty. And you?", from: 'G' }, { en: '3', az: 'Sorry? Thirteen?', from: 'B' }, { en: '4', az: 'No, thirty. Three, zero.', from: 'G' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("How old are you? → I'm thirty. And you? → Sorry? Thirteen? → No, thirty. Three, zero.", 'Oğlan 30-u 13 kimi eşitdi, qız düzəltdi.', 'thirteen — 13; thirty — 30.', 'No, thirty. Three, zero.'))],
      review: {
        title: 'Söhbəti sırala', why: 'Sual, cavab, yanlış eşitmə və düzəliş düz sıradadır.', hint: 'Əvvəl sual gəlir; yanlış eşidən soruşur, o biri düzəldir.',
        prompt: 'Kursda tanışlıq.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: 'How old are you?', from: 'G' }, { en: '2', az: "I'm forty. And you?", from: 'B' }, { en: '3', az: 'Sorry? Fourteen?', from: 'G' }, { en: '4', az: 'No, forty. Four, zero.', from: 'B' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("How old are you? → I'm forty. And you? → Sorry? Fourteen? → No, forty. Four, zero.", 'Qız 40-ı 14 kimi eşitdi, oğlan düzəltdi.', 'fourteen — 14; forty — 40.', 'No, forty. Four, zero.'))],
      },
    },
  ],
  result: {
    done: ['Dərs 7 · 3-cü hissə tamamlandı', 'Artıq yaşı soruşur və 13 ilə 30-u ayırırsan.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Yaş sualını anlamaq, 13 ilə 30-u ayırmaq', tasks: ['u2d7b_c03', 'u2d7b_c05', 'u2d7b_c07', 'u2d7b_c14'] },
      { group: 'Yazı', text: 'Yaşı soruşmaq', tasks: ['u2d7b_c13'] },
    ],
    closing: 'Növbəti hissə — yaşını demək: I\'m twenty-five.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'How old are you?', translation: 'Neçə yaşın var?', example: 'Hi! How old are you?', exampleAz: 'Salam! Neçə yaşın var?', usageNote: 'Yaş soruşmaq.', pronunciation: '/haʊ oʊld ɑr ju/', teachCard: 'u2d7b_c02' },
    { word: 'thirty · forty · fifty · sixty', translation: '30 · 40 · 50 · 60', example: 'Thirty, forty, fifty, sixty!', exampleAz: 'Otuz, qırx, əlli, altmış!', usageNote: 'Vurğu əvvəldə: THIR-ty.', pronunciation: '/ˈθɜrti/ · /ˈfɔrti/ · /ˈfɪfti/ · /ˈsɪksti/', teachCard: 'u2d7b_c04' },
  ],
};

export const lesson7bPart2: DesignLesson = {
  id: 'a1_en_b2_d7b_2', order: 35, unit: 2, number: 7, part: 4, title: 'Yaşını de', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d7b_2_c01', badge: 'Şəxsi məlumat', subtitle: 'İdman zalında qeydiyyat: yaşını deyir və yazırsan.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Yaşımı deyə və yaza bilirəm.' },
        { icon: 'wave', text: '25 kimi rəqəmləri tanıyıram.' },
      ],
    },
    {
      type: 'word', id: 'u2d7b_c06', number: 6, scenes: ['u2/word-twenty-five'],
      word: 'twenty-five', pronunciation: '/ˌtwenti ˈfaɪv/', reading: 'tuenti-fayv', az: '25',
      structure: ['twenty + five → twenty-five', 'forty + two → forty-two'],
      notes: ['Əvvəl onluq, sonra tək rəqəm.'],
      example: 'Twenty-five, thirty-two, forty-one.', exampleAz: '25, 32, 41.',
    },
    {
      type: 'choice', id: 'u2d7b_c15', number: 3, title: 'Dinlə və seç', why: 'thirty-two — 32: əvvəl onluq, sonra tək rəqəm.', hint: 'Əvvəl onluğa, sonra tək rəqəmə qulaq as.',
      prompt: 'İdman zalında qəbul sənin dolabını deyir.\nHansı nömrədir?', audio: 'Thirty-two.',
      options: ['23', '32', '320'], answer: '32',
      variants: [
        pick('23', 'Rəqəmlərin sırası tərsdir.', ex('32', 'Əvvəl thirty (30), sonra two (2) deyilir: 32.', 'thirty-two — 32; twenty-three — 23.', 'Twenty-five, thirty-two, forty-one.')),
        pick('320', 'thirty-two iki rəqəmdir: 3 və 2.', ex('32', 'thirty və two birlikdə 32 olur.', 'thirty + two → thirty-two — 32.', 'Twenty-five, thirty-two, forty-one.')),
      ],
      review: {
        title: 'Dinlə və seç', why: 'forty-one — 41: əvvəl onluq, sonra tək rəqəm.', hint: 'Əvvəl onluğa, sonra tək rəqəmə qulaq as.',
        prompt: 'Hovuzda qəbul sənin dolabını deyir.\nHansı nömrədir?', audio: 'Forty-one.',
        options: ['14', '410', '41'], answer: '41',
        variants: [
          pick('14', 'Rəqəmlərin sırası tərsdir.', ex('41', 'Əvvəl forty (40), sonra one (1) deyilir: 41.', 'forty-one — 41; fourteen — 14.', 'Twenty-five, thirty-two, forty-one.')),
          pick('410', 'forty-one iki rəqəmdir: 4 və 1.', ex('41', 'forty və one birlikdə 41 olur.', 'forty + one → forty-one — 41.', 'Twenty-five, thirty-two, forty-one.')),
        ],
      },
    },
    {
      type: 'word', id: 'u2d7b_c08', number: 8, scenes: ['u2/word-im-25'],
      word: "I'm twenty-five.", pronunciation: '/aɪm ˌtwenti ˈfaɪv/', reading: 'aym tuenti-fayv', az: 'Mən 25 yaşındayam.',
      structure: ["I'm + yaş"],
      notes: ['Azərbaycancadakı “yaşım var” burada lazım deyil: I’m + yaş.'],
      example: "How old are you? — I'm twenty-five.", exampleAz: 'Neçə yaşın var? — 25 yaşındayam.',
    },
    {
      type: 'write', id: 'u2d7b_c16', number: 5, title: 'Cavab yaz', why: 'Yaşını yazdın.', hint: 'Kartdakı kimi: “I’m” + yaş.',
      prompt: 'Yeni tanış mesaj yazır.\nYaşını yaz (istəsən, istənilən yaş).', placeholder: 'Cavabını yaz',
      chat: { partner: 'Yeni tanış', from: 'G', lines: [{ from: 'G', text: "I'm twenty-five. How old are you?" }] }, rule: myAge,
      variants: [...AGE_MISTAKES, other("I'm + yaş.", ex("I'm twenty-five.", 'Yaş “I’m” ilə yazılır, “var” mənasında söz lazım deyil.', "I'm twenty-five. — yaş; I'm fine. — hal.", "How old are you? — I'm thirty."))],
      review: {
        title: 'Cavab yaz', why: 'Yaşını yazdın.', hint: 'Kartdakı kimi: “I’m” + yaş.',
        prompt: 'Kurs yoldaşın mesaj yazır.\nYaşını yaz (istəsən, istənilən yaş).', placeholder: 'Cavabını yaz',
        chat: { partner: 'Kurs yoldaşı', from: 'B', lines: [{ from: 'B', text: 'Hi! How old are you?' }] }, rule: myAge,
        variants: [...AGE_MISTAKES, other("I'm + yaş.", ex("I'm twenty-five.", 'Yaş “I’m” ilə yazılır, “var” mənasında söz lazım deyil.', "I'm twenty-five. — yaş; I'm fine. — hal.", "How old are you? — I'm forty."))],
      },
    },
    {
      type: 'word', id: 'u2d7b_c10', number: 10, scenes: ['u2/word-years-old'],
      word: 'years old', pronunciation: '/jɪrz oʊld/', reading: 'yirz ould', az: 'yaşında',
      notes: ['“years old” birlikdə gəlir; yalnız “years” deyilmir.'],
      example: "I'm twenty-five years old.", exampleAz: 'Mən 25 yaşındayam.',
    },
    {
      type: 'voice', id: 'u2d7b_c09', number: 9, title: 'Yaşını de', why: 'Yaşını dedin.', hint: 'Kartdakı kimi: “mən” + yaş, başqa söz lazım deyil.',
      prompt: 'Məşqçi soruşur: “How old are you?”\nYaşını de (istəsən, istənilən yaş).', audio: 'How old are you?', reply: 'OK, thank you!',
      rule: myAge,
      variants: [...AGE_MISTAKES, other("I'm + yaş.", ex("I'm twenty-five.", 'Yaş “I’m” ilə deyilir, “var” mənasında söz lazım deyil.', "I'm twenty-five. — yaş; I'm fine. — hal.", "How old are you? — I'm thirty."))],
      review: {
        title: 'Yaşını de', why: 'Yaşını dedin.', hint: 'Kartdakı kimi: “mən” + yaş.',
        prompt: 'Kursda yeni yoldaş yaşını deyib səndən soruşur.\nYaşını de (istəsən, istənilən yaş).', audio: "I'm forty. And you?", reply: 'Nice!',
        rule: myAge,
        variants: [...AGE_MISTAKES, other("I'm + yaş.", ex("I'm twenty-five.", 'Yaş “I’m” ilə deyilir; “years old” istəsən əlavə olunur.', "I'm twenty-five. — düzdür; I'm twenty-five years old. — düzdür.", "I'm thirty. And you?"))],
      },
    },
    {
      type: 'choice', id: 'u2d7b_c12', number: 12, title: 'Sözü tamamla', why: "I'm thirty years old.", hint: 'Yaşdan sonra hansı ifadə gəlir — kartı xatırla.',
      prompt: 'Oğlan yaşını tam cümlə ilə deyir.\nHansı söz çatmır?', gap: { speaker: 'B', before: "I'm thirty", after: '.' },
      options: ['years', 'years old', 'old years'], answer: 'years old',
      variants: [
        pick('years', '“I’m thirty years” deyilmir.', ex('years old', 'Ya “I’m thirty”, ya “I’m thirty years old” deyilir.', "I'm thirty. — düzdür; I'm thirty years old. — düzdür.", "I'm twenty-five years old.")),
        pick('old years', 'Sıra tərsdir.', ex('years old', 'Əvvəl “years”, sonra “old” gəlir.', "I'm thirty years old. — düzdür; I'm thirty old years. — olmur.", "I'm twenty-five years old.")),
      ],
      review: {
        title: 'Sözü tamamla', why: "I'm forty-two years old.", hint: 'Yaşdan sonra hansı ifadə gəlir — kartı xatırla.',
        prompt: 'Qız mesajda yaşını tam cümlə ilə yazır.\nHansı söz çatmır?', gap: { speaker: 'G', before: "I'm forty-two", after: '.' },
        options: ['old years', 'years old', 'years'], answer: 'years old',
        variants: [
          pick('years', '“I’m forty-two years” deyilmir.', ex('years old', 'Ya “I’m forty-two”, ya “I’m forty-two years old” deyilir.', "I'm forty-two. — düzdür; I'm forty-two years old. — düzdür.", "I'm forty-two years old.")),
          pick('old years', 'Sıra tərsdir.', ex('years old', 'Əvvəl “years”, sonra “old” gəlir.', "I'm forty-two years old. — düzdür; I'm forty-two old years. — olmur.", "I'm forty-two years old.")),
        ],
      },
    },
    {
      type: 'two', id: 'u2d7b_c11', number: 11, title: 'Formanı doldur', why: 'Adını, nömrəni və yaşını yazdın.', hint: 'Hər sətrin başlığını oxu; yaşı rəqəmlə yaza bilərsən.', scenes: ['u2/form-gym'],
      prompt: 'İdman zalında qeydiyyat.\nVərəqi doldur (istəsən, uydurma məlumat).', form: { title: 'İdman zalı', subtitle: 'Qeydiyyat' },
      fields: [
        { id: 'u2d7b_c11a', label: 'First name', placeholder: 'Adını yaz', rule: own(NAME, '[ad]'), purpose: 'adını yazmaq', empty: 'Adını da yaz.' },
        { id: 'u2d7b_c11b', label: 'Phone number', placeholder: 'Nömrəni yaz', rule: own(PHONE, '050 321 45 67'), purpose: 'nömrəni yazmaq', empty: 'Nömrəni də yaz.' },
        { id: 'u2d7b_c11c', label: 'How old are you?', placeholder: 'Yaşını yaz', rule: own(AGE_FIELD, '25'), purpose: 'yaşını yazmaq', empty: 'Yaşını da yaz.' },
      ],
      variants: [
        { field: 'u2d7b_c11a', match: { other: true }, explain: ex('[ad]', 'Bu sətirdə yalnız adın lazımdır.', 'First name — adın; Phone number — nömrən.', 'My first name is [ad]') },
        { field: 'u2d7b_c11b', match: { other: true }, explain: ex('050 321 45 67', 'Bu sətirdə rəqəmlər lazımdır.', 'Phone number — nömrən; How old are you? — yaşın.', "It's zero five zero, three two one, four five, six seven.") },
        { field: 'u2d7b_c11c', match: { other: true }, explain: ex('25', 'Bu sətirdə yaşın lazımdır: rəqəmlə və ya “I’m” ilə.', "25 — rəqəmlə; I'm twenty-five. — cümlə ilə.", "I'm twenty-five.") },
      ],
      review: {
        title: 'Formanı doldur', why: 'Yaşını, adını və nömrəni yazdın.', hint: 'Hər sətrin başlığını oxu; sıra fərqli ola bilər.', scenes: ['u2/form-pool'],
        prompt: 'Hovuza yazılırsan.\nVərəqi doldur (istəsən, uydurma məlumat).', form: { title: 'Hovuz', subtitle: 'Yeni üzv' },
        fields: [
          { id: 'u2d7b_c11c', label: 'How old are you?', placeholder: 'Yaşını yaz', rule: own(AGE_FIELD, '25'), purpose: 'yaşını yazmaq', empty: 'Yaşını da yaz.' },
          { id: 'u2d7b_c11a', label: 'First name', placeholder: 'Adını yaz', rule: own(NAME, '[ad]'), purpose: 'adını yazmaq', empty: 'Adını da yaz.' },
          { id: 'u2d7b_c11b', label: 'Phone number', placeholder: 'Nömrəni yaz', rule: own(PHONE, '050 321 45 67'), purpose: 'nömrəni yazmaq', empty: 'Nömrəni də yaz.' },
        ],
        variants: [
          { field: 'u2d7b_c11c', match: { other: true }, explain: ex('25', 'Bu sətirdə yaşın lazımdır: rəqəmlə və ya “I’m” ilə.', "25 — rəqəmlə; I'm twenty-five. — cümlə ilə.", "I'm twenty-five.") },
          { field: 'u2d7b_c11a', match: { other: true }, explain: ex('[ad]', 'Bu sətirdə yalnız adın lazımdır.', 'First name — adın; Phone number — nömrən.', 'My first name is [ad]') },
          { field: 'u2d7b_c11b', match: { other: true }, explain: ex('050 321 45 67', 'Bu sətirdə rəqəmlər lazımdır.', 'Phone number — nömrən; How old are you? — yaşın.', "It's zero five zero, three two one, four five, six seven.") },
        ],
      },
    },
  ],
  result: {
    done: ['Dərs 7 · 4-cü hissə tamamlandı', 'Artıq yaşını deyir, yazır və formaya yaza bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: '25 kimi rəqəmləri və “years old”u anlamaq', tasks: ['u2d7b_c15', 'u2d7b_c12'] },
      { group: 'Yazı', text: 'Mesajda və formada yaşını yazmaq', tasks: ['u2d7b_c16', 'u2d7b_c11'] },
      { group: 'Danışıq', text: 'Yaşını demək', tasks: ['u2d7b_c09'] },
    ],
    closing: 'Növbəti dərs — bölmə söhbəti: qeydiyyatda hamısı bir yerdə.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'twenty-five', translation: '25', example: 'Twenty-five, thirty-two, forty-one.', exampleAz: '25, 32, 41.', usageNote: 'Onluq + tək rəqəm.', pronunciation: '/ˌtwenti ˈfaɪv/', teachCard: 'u2d7b_c06' },
    { word: "I'm twenty-five.", translation: 'Mən 25 yaşındayam.', example: "How old are you? — I'm twenty-five.", exampleAz: 'Neçə yaşın var? — 25 yaşındayam.', usageNote: "I'm + yaş.", pronunciation: '/aɪm ˌtwenti ˈfaɪv/', teachCard: 'u2d7b_c08' },
    { word: 'years old', translation: 'yaşında', example: "I'm twenty-five years old.", exampleAz: 'Mən 25 yaşındayam.', usageNote: 'Birlikdə gəlir.', pronunciation: '/jɪrz oʊld/', teachCard: 'u2d7b_c10' },
  ],
};
