// Bölmə 2 imtahanı (exam: true — Kömək və ipucu yoxdur, Təkrar turu yoxdur, keçid ≥80 %).
// Hər xəritə dərsindən ən azı bir tapşırıq; dinlə + oxu + yaz + danış; yeni söz yoxdur.
import type { DesignLesson } from '../designLessonTypes';
import type { Variant } from '../designLessonTypes';
import { ex, exact, goal, other, pick } from '../unit1/build';
import { AGE_MISTAKES, AGE, EMAIL, NAME, notices, own, resultTexts } from './shared';

const asWords = (address: string, words: string): Variant => ({
  match: { words: [words] }, short: 'Sözlər yox, işarələr yaz: @ və nöqtə.',
  explain: ex(address, '“at” @ ilə, “dot” nöqtə ilə yazılır.', 'at — @; dot — nöqtə.', "It's K-B at mail dot com."),
});

export const exam: DesignLesson = {
  id: 'a1_en_b2_exam', order: 21, unit: 2, exam: true, title: 'Bölmə 2 imtahanı', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2x_c01', badge: 'Bölmə 2 imtahanı', subtitle: 'Kömək yoxdur. Keçmək üçün 80% lazımdır. Keçməsən, səhv bacarıqlar təkrara düşür və imtahanı yenidən verə bilərsən.', start: 'İmtahana başla',
      goals: [
        { icon: 'chat', text: 'Rəqəmləri, hərfləri və şəxsi məlumatı eşidib anlayıram.' },
        { icon: 'wave', text: 'Nömrəmi, yaşımı deyir, hərf-hərf soruşuram.' },
        { icon: 'bye', text: 'Formanı və e-poçtumu yaza bilirəm.' },
      ],
    },
    {
      type: 'write', id: 'u2x_c02', number: 2, keypad: true, title: 'Nömrəni yığ', why: 'four, nine, zero, seven — 4907.',
      prompt: 'Oteldə resepsiya restoranın daxili nömrəsini deyir.\nDinlə və yığ.', audio: 'Four, nine, zero, seven.', placeholder: 'Daxili nömrə',
      rule: exact('4907'),
      variants: [other('Rəqəmləri bir-bir dinlə.', ex('4907', 'Səsdə dörd rəqəm var: four, nine, zero, seven.', 'four — 4; nine — 9.', 'Four, nine, zero, seven.'))],
    },
    {
      type: 'choice', id: 'u2x_c03', number: 3, title: 'Dinlə və seç', why: 'W — “dabəlyu”.',
      prompt: 'Hava limanında elan qapı hərfini deyir.\nHansı hərfdir?', audio: 'W.',
      options: ['V', 'W', 'U'], answer: 'W',
      variants: [
        pick('V', 'V “vi” oxunur.', ex('W', 'Səsdə “dabəlyu” deyilir — bu, W-dir.', 'W — dabəlyu; V — vi.', 'Q, U, W.')),
        pick('U', 'U “yu” oxunur.', ex('W', 'Səsdə “dabəlyu” deyilir — bu, W-dir.', 'W — dabəlyu; U — yu.', 'Q, U, W.')),
      ],
    },
    {
      type: 'two', id: 'u2x_c04', number: 4, title: 'Formanı doldur', why: 'Adını və soyadını öz yerinə yazdın.', scenes: ['u2/form-course'],
      prompt: 'Yeni kursa yazılırsan.\nFormada adını və soyadını yaz.', form: { title: 'Kurs qeydiyyatı', subtitle: 'Yeni tələbə' },
      fields: [
        { id: 'u2x_c04a', label: 'Last name', placeholder: 'Soyadın', rule: own(NAME, 'Mammadova'), purpose: 'soyadını yazmaq', empty: 'Soyadını da yaz.' },
        { id: 'u2x_c04b', label: 'First name', placeholder: 'Adın', rule: own(NAME, '…'), purpose: 'adını yazmaq', empty: 'Adını da yaz.' },
      ],
      variants: [
        { field: 'u2x_c04a', match: { other: true }, explain: ex('Mammadova', 'Bu sətirdə yalnız soyadın lazımdır.', 'Last name — soyadın; First name — adın.', 'My last name is Mammadova.') },
        { field: 'u2x_c04b', match: { other: true }, explain: ex('…', 'Bu sətirdə yalnız adın lazımdır.', 'Last name — soyadın; First name — adın.', 'My first name is …') },
      ],
    },
    {
      type: 'choice', id: 'u2x_c05', number: 5, title: 'Dinlə və anla', why: '“Is that right?” — düzdür?',
      prompt: 'Yoldaşın nömrəni yazıb sənə oxuyur.\nO nə edir?', audio: 'Zero five five, two one nine, oh three, eight eight. Is that right?',
      options: ['Nömrəni yoxlayır.', 'Nömrəni soruşur.', 'Yavaş danışmağı xahiş edir.'], answer: 'Nömrəni yoxlayır.',
      variants: [
        pick('Nömrəni soruşur.', 'Nömrəni artıq deyir — indi yoxlayır.', ex('Nömrəni yoxlayır.', 'O, nömrəni təkrar edir və “Is that right?” soruşur.', "What's your phone number? — soruşur; Is that right? — yoxlayır.", 'Zero five five… Is that right?')),
        pick('Yavaş danışmağı xahiş edir.', 'Səsdə “slowly” yoxdur.', ex('Nömrəni yoxlayır.', 'Səsdə “Is that right?” var, “Slowly, please” yox.', 'Is that right? — yoxlama; Slowly, please. — xahiş.', 'Zero five five… Is that right?')),
      ],
    },
    {
      type: 'write', id: 'u2x_c06', number: 6, letters: ['J', 'F', 'K', 'G', 'E', 'Y'], title: 'Hərfləri tut', why: 'J-F-K — Nyu-York hava limanı.',
      prompt: 'Hava limanında elan uçuşun şəhər kodunu deyir.\nEşitdiyin hərflərə toxun.', audio: 'J, F, K.', placeholder: 'Şəhər kodu',
      rule: exact('JFK'),
      variants: [other('Hərfləri bir-bir dinlə.', ex('JFK', 'Səsdə “cey, ef, key” deyilir.', 'J — cey; G — ci.', 'J, F, K.'))],
    },
    {
      type: 'write', id: 'u2x_c07', number: 7, title: 'Dinlə və yaz', why: 'T-A-double L-I-double N — Tallinn.',
      prompt: 'Hava limanında qeydiyyatçı uçuşun şəhərini hərf-hərf deyir.\nŞəhərin adını yaz.', audio: "It's T-A-double L-I-double N.", placeholder: 'Şəhər',
      rule: exact('Tallinn'),
      variants: [other('Hərfləri yoxla.', ex('Tallinn', '“double L” — LL, “double N” — NN.', 'double L — LL; double N — NN.', "It's T-A-double L-I-double N."))],
    },
    {
      type: 'voice', id: 'u2x_c08', number: 8, title: 'Hərf-hərf soruş', why: 'Hərf-hərf deməyi nəzakətlə xahiş etdin.',
      prompt: 'Oteldə qonaq şəhərini deyir, sən onu tanımırsan.\nHərf-hərf deməsini nəzakətlə xahiş et.', audio: "It's Gabala.", reply: "It's G-A-B-A-L-A.",
      rule: goal(['askSpell'], ['Can you spell it, please?', 'How do you spell it?']),
      variants: [other('Can you spell it, please?', ex('Can you spell it, please?', 'Adı tanımırsan — hərf-hərf deməsini xahiş edirsən.', 'Can you spell it, please? — hərf-hərf; Again, please. — bir də.', 'Gabala? Can you spell it, please?'))],
    },
    {
      type: 'write', id: 'u2x_c09', number: 9, keypad: true, title: 'Nömrəni yığ', why: 'oh — sıfır; nömrəni rəqəm-rəqəm yığdın.',
      prompt: 'Kurs yoldaşın nömrəsini deyir.\nDinlə və yığ.', audio: "It's oh five oh, seven seven one, two nine, four four.", placeholder: 'Telefon nömrəsi',
      rule: exact('0507712944'),
      variants: [other('Rəqəmləri bir-bir yoxla.', ex('0507712944', '“oh” sıfırdır; nömrə rəqəm-rəqəm deyilir.', 'oh — 0; seven seven — 77.', "It's oh five oh, seven seven one, two nine, four four."))],
    },
    {
      type: 'choice', id: 'u2x_c10', number: 10, title: 'Sözü tamamla', why: 'Qadına — Ms.',
      prompt: 'Kurs müəllimi qadındır, soyadı Aliyeva.\nOna salam verirsən. Hansı söz çatmır?', gap: { speaker: 'B', before: 'Hello,', after: 'Aliyeva!' },
      options: ['Mr', 'Ms', 'first'], answer: 'Ms',
      variants: [
        pick('Mr', '“Mr” kişiyə deyilir.', ex('Ms', 'Müəllim qadındır, ona “Ms” deyilir.', 'Mr Aliyev — kişi; Ms Aliyeva — qadın.', 'Hello, Ms Aliyeva!')),
        pick('first', '“first” ad sözündədir: first name.', ex('Ms', 'Salam verəndə soyaddan əvvəl “Ms” və ya “Mr” gəlir.', 'Hello, Ms Aliyeva! — müraciət; first name — ad.', 'Hello, Ms Aliyeva!')),
      ],
    },
    {
      type: 'write', id: 'u2x_c11', number: 11, title: 'Mesaj yaz', why: 'E-poçtunu yazdın.',
      prompt: 'Yeni iş yoldaşı yazır.\nÖz e-poçtunu yaz (istəsən, uydurma).', placeholder: 'Cavabını yaz',
      chat: { partner: 'Yeni iş yoldaşı', from: 'G', lines: [{ from: 'G', text: "Hi! What's your email?" }] }, rule: own(EMAIL, "It's ganja5@mail.com."),
      variants: [other('ad@mail.com', ex("It's ganja5@mail.com.", 'Yazanda “at” yox, @; “dot” yox, nöqtə yazılır.', 'at — @; dot — nöqtə.', "It's G-A-N-J-A five at mail dot com."))],
    },
    {
      type: 'choice', id: 'u2x_c12', number: 12, title: 'Dinlə və seç', why: '“fourteen” — 14, vurğu sonda.',
      prompt: 'İdman zalında qəbul dolabının nömrəsini deyir.\nHansı nömrədir?', audio: 'Fourteen.',
      options: ['40', '4', '14'], answer: '14',
      variants: [
        pick('40', '“forty” — 40, vurğu əvvəldə.', ex('14', 'Səsdə four-TEEN deyilir, vurğu sondadır.', 'four-TEEN — 14; FOR-ty — 40.', 'Fourteen.')),
        pick('4', '“four” — 4; səsdə “teen” də var.', ex('14', 'Sözün sonunda “teen” var — bu, 14-dür.', 'four — 4; fourteen — 14.', 'Fourteen.')),
      ],
    },
    {
      type: 'voice', id: 'u2x_c13', number: 13, title: 'Yaşını de', why: 'Yaşını dedin.',
      prompt: 'İdman zalında məşqçi soruşur: “How old are you?”\nYaşını de (istəsən, istənilən yaş).', audio: 'How old are you?', reply: 'OK, thank you!',
      rule: own(AGE, "I'm twenty-five.", "I'm 25."),
      variants: [...AGE_MISTAKES, other("I'm + yaş.", ex("I'm twenty-five.", 'Yaş “I’m” ilə deyilir; “years old” istəsən əlavə olunur.', "I'm twenty-five. — düzdür; I'm twenty-five years old. — düzdür.", "How old are you? — I'm thirty."))],
    },
    {
      type: 'match', id: 'u2x_c14', number: 14, title: 'Kim nə dedi?', why: 'Hər sualın mənasını tapdın.',
      prompt: 'Qeydiyyat masasında eşitdiklərin.\nHər cümləyə mənasını qoş.',
      rows: [{ en: "What's your email?", az: 'E-poçtun nədir?', from: 'G' }, { en: 'How do you spell it?', az: 'Hərf-hərf necə yazılır?', from: 'B' }, { en: "What's your last name?", az: 'Soyadın nədir?', from: 'M' }],
      extra: ['Neçə yaşın var?'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex("What's your email? — E-poçtun nədir?; How do you spell it? — Hərf-hərf necə yazılır?; What's your last name? — Soyadın nədir?", 'E-poçt, hərflər və soyad fərqli suallardır.', "What's your email? — e-poçt; What's your last name? — soyad.", 'How do you spell it?'))],
    },
    {
      type: 'write', id: 'u2x_c15', number: 15, title: 'Dinlə və yaz', why: 'aliyeva@mail.com — hərflər, @ və nöqtə.',
      prompt: 'Qeydiyyatçı kurs müəlliminin e-poçtunu deyir.\nÜnvanı yaz.', audio: "It's A-L-I-Y-E-V-A at mail dot com.", placeholder: 'E-poçt ünvanı',
      rule: exact('aliyeva@mail.com'),
      variants: [asWords('aliyeva@mail.com', 'aliyeva at mail dot com'), other('Ünvanı yoxla.', ex('aliyeva@mail.com', 'Hərflər A-L-I-Y-E-V-A, sonra @, mail, nöqtə, com.', 'at — @; dot — nöqtə.', "It's A-L-I-Y-E-V-A at mail dot com."))],
    },
    {
      type: 'match', mode: 'order', id: 'u2x_c16', number: 16, title: 'Söhbəti sırala', why: 'Qeydiyyat söhbəti düz sıradadır.',
      prompt: 'Qeydiyyat masasında.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: "Hello! What's your phone number?", from: 'M' }, { en: '2', az: "It's zero five zero, two two one, four eight, three six.", from: 'B' }, { en: '3', az: 'Zero five zero, two two one, four eight, three six. Is that right?', from: 'M' }, { en: '4', az: "Yes, that's right. Thank you!", from: 'B' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hello! What's your phone number? → It's zero five zero… → … Is that right? → Yes, that's right. Thank you!", 'Sual, nömrə, yoxlama, sonra təsdiq.', "Is that right? — yoxlama; Yes, that's right. — təsdiq.", "What's your phone number?"))],
    },
  ],
  result: {
    done: ['Bölmə 2 imtahanı bitdi', 'Rəqəmləri, hərfləri, nömrəni, e-poçtu, formanı və yaşı bir yerdə yoxladın.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Rəqəmlər', text: '0–60 rəqəmlərini və telefon nömrəsini eşidib yığmaq', tasks: ['u2x_c02', 'u2x_c09', 'u2x_c12'] },
      { group: 'Telefon', text: 'Nömrənin yoxlanmasını anlamaq', tasks: ['u2x_c05', 'u2x_c16'] },
      { group: 'Hərflər', text: 'Eşitdiyin hərfi və kodu tanımaq', tasks: ['u2x_c03', 'u2x_c06'] },
      { group: 'Hərf-hərf', text: 'Hərf-hərf deyiləni yazmaq və hərf-hərf soruşmaq', tasks: ['u2x_c07', 'u2x_c08'] },
      { group: 'Forma', text: 'Formada ad və soyadını yazmaq, Mr və Ms-i işlətmək', tasks: ['u2x_c04', 'u2x_c10', 'u2x_c14'] },
      { group: 'E-poçt', text: 'E-poçtunu yazmaq və eşitdiyin ünvanı yazmaq', tasks: ['u2x_c11', 'u2x_c15'] },
      { group: 'Yaş', text: 'Yaşını demək', tasks: ['u2x_c13'] },
    ],
    closing: 'Təbriklər! Bölmə 2-nin bacarıqlarını yoxladın.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [],
};
