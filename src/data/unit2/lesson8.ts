// Bölmə 2 · Dərs 8 — Bölmə söhbəti: qeydiyyat. Yeni söz yoxdur: ad, soyad (hərf-hərf), telefon, e-poçt və yaş bir yerdə.
// Kursun açılış ziyafəti + qeydiyyat masası. Spiral: bütün Bölmə 1 (salam, tanışlıq, təşəkkür, başa düşmədim) və Bölmə 2.
// Səs işləməsə, yazılı tapşırıqlar hər məqsədi yenə əhatə edir.
import type { DesignLesson } from '../designLessonTypes';
import type { Variant } from '../designLessonTypes';
import { ex, exact, goal, other, pick } from '../unit1/build';
import { PHONE_MISTAKES, AGE_MISTAKES, AGE_FIELD, AGE_RETURN, EMAIL, NAME, NAME_SPELLED, notices, own, PHONE, resultTexts } from './shared';

const asWords = (address: string, words: string): Variant => ({
  match: { words: [words] }, short: 'Sözlər yox, işarələr yaz: @ və nöqtə.',
  explain: ex(address, '“at” @ ilə, “dot” nöqtə ilə yazılır.', 'at — @; dot — nöqtə.', "It's K-B at mail dot com."),
});

export const lesson8: DesignLesson = {
  id: 'a1_en_b2_d8', order: 20, unit: 2, number: 8, title: 'Bölmə söhbəti: qeydiyyat', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d8_c01', badge: 'Bölmə söhbəti', subtitle: 'Kursun açılış ziyafəti və qeydiyyat masası. Öyrəndiklərin bir yerdə.', start: 'Söhbətə başla',
      goals: [
        { icon: 'chat', text: 'Qeydiyyatda ad, soyad, telefon, e-poçt və yaşımı verə bilirəm.' },
        { icon: 'wave', text: 'Hərf-hərf soruşa və eşitdiyimi yaza bilirəm.' },
      ],
    },
    {
      type: 'teach', id: 'u2d8_c02', number: 2, scenes: ['u2/registration-desk'], title: 'Qeydiyyat masasında',
      lead: 'Qeydiyyatçı yeni tələbələrə bu sualları verir. Hər cümləni dinlə:',
      phrases: [
        { en: "Hello! What's your first name?", az: 'Salam! Adın nədir?' },
        { en: "What's your last name? How do you spell it?", az: 'Soyadın nədir? Hərf-hərf necə yazılır?' },
        { en: "What's your phone number?", az: 'Telefon nömrən nədir?' },
        { en: "What's your email?", az: 'E-poçtun nədir?' },
        { en: 'How old are you?', az: 'Neçə yaşın var?' },
      ],
      notes: ['Bu sualların hamısını Bölmə 2-də öyrəndin. İndi özün cavab verirsən.'],
    },
    {
      type: 'choice', id: 'u2d8_c03', number: 3, title: 'Dinlə və anla', why: '“last name” — soyad.', hint: 'Sualın sonundakı iki sözə qulaq as.',
      prompt: 'Ziyafətdə yeni tanış səninlə tanış olur.\nO nə soruşur?', audio: "Nice to meet you! What's your last name?",
      options: ['Adını soruşur.', 'Soyadını soruşur.', 'Yaşını soruşur.'], answer: 'Soyadını soruşur.',
      variants: [
        pick('Adını soruşur.', 'Sualda “last name” var — ad yox.', ex('Soyadını soruşur.', '“last name” soyaddır, ad “first name”dir.', "What's your first name? — ad; What's your last name? — soyad.", "What's your last name?")),
        pick('Yaşını soruşur.', 'Yaş “How old are you?” ilə soruşulur.', ex('Soyadını soruşur.', 'Sualda “old” yox, “last name” var.', "How old are you? — yaş; What's your last name? — soyad.", "What's your last name?")),
      ],
      review: {
        title: 'Dinlə və anla', why: '“email” — e-poçt.', hint: 'Sualın sonundakı sözə qulaq as.',
        prompt: 'Ziyafətin sonunda iş yoldaşı sənə yaxınlaşır.\nO nə soruşur?', audio: "Excuse me, what's your email? Thanks!",
        options: ['Telefon nömrəni soruşur.', 'E-poçtunu soruşur.', 'Halını soruşur.'], answer: 'E-poçtunu soruşur.',
        variants: [
          pick('Telefon nömrəni soruşur.', 'Səsdə “phone number” yoxdur.', ex('E-poçtunu soruşur.', 'Sualın sonunda “email” var.', "What's your email? — e-poçt; What's your phone number? — nömrə.", "What's your email?")),
          pick('Halını soruşur.', 'Hal “How are you?” ilə soruşulur.', ex('E-poçtunu soruşur.', 'Sualın sonunda “email” var.', "How are you? — hal; What's your email? — e-poçt.", "What's your email?")),
        ],
      },
    },
    {
      type: 'write', id: 'u2d8_c04', number: 4, letters: ['S', 'H', 'E', 'K', 'I', 'A', 'Y', 'G'], title: 'Hərfləri tut', why: 'S-H-E-K-I — Şəki.', hint: 'Hər hərfi eşidən kimi toxun; “i” və “ay” fərqinə qulaq as.',
      prompt: 'Qeydiyyatçı bir tələbənin şəhərini hərf-hərf yoxlayır.\nEşitdiyin hərflərə toxun.', audio: "It's S-H-E-K-I.", placeholder: 'Şəhər',
      rule: exact('SHEKI'),
      variants: [other('Hərfləri bir-bir dinlə.', ex('SHEKI', 'Səsdə S, H, E, K, I deyilir: E “i”, I “ay”.', 'E — i; I — ay.', "It's S-H-E-K-I."))],
      review: {
        letters: ['Q', 'U', 'B', 'A', 'G', 'K', 'O', 'W'], title: 'Hərfləri tut', why: 'Q-U-B-A — Quba.', hint: 'Hər hərfi eşidən kimi toxun; “kyu” və “key” fərqinə qulaq as.',
        prompt: 'Otel resepsiyasında qonaq şəhərini hərf-hərf deyir.\nEşitdiyin hərflərə toxun.', audio: "It's Q-U-B-A.", placeholder: 'Şəhər',
        rule: exact('QUBA'),
        variants: [other('Hərfləri bir-bir dinlə.', ex('QUBA', 'Səsdə Q, U, B, A deyilir: Q “kyu”.', 'Q — kyu; K — key.', "It's Q-U-B-A."))],
      },
    },
    {
      type: 'voice', id: 'u2d8_c05', number: 5, title: 'Nömrəni de', why: 'Nömrəni rəqəm-rəqəm dedin.', hint: 'Qısa sözlə başla, sonra rəqəmləri bir-bir de.',
      prompt: 'Qeydiyyatçı soruşur: “What\'s your phone number?”\nÖz nömrəni de (istəsən, uydurma).', audio: "What's your phone number?", reply: 'Thank you!',
      rule: own(PHONE, "It's zero five zero, three two one, four five, six seven."),
      variants: [...PHONE_MISTAKES, other("It's + nömrə.", ex("It's zero five zero, three two one, four five, six seven.", 'Nömrəni “It’s” ilə başla və rəqəmləri bir-bir de.', "It's zero five zero… — nömrə; My phone… — telefonun özü.", "It's oh five five, two one nine, oh three, eight eight."))],
      review: {
        title: 'Nömrəni de', why: 'Nömrəni rəqəm-rəqəm dedin.', hint: 'Qısa sözlə başla, sonra rəqəmləri bir-bir de.',
        prompt: 'Ziyafətdə yeni tanış nömrəni istəyir.\nÖz nömrəni de (istəsən, uydurma).', audio: "Excuse me, what's your phone number?", reply: 'Thanks!',
        rule: own(PHONE, "It's zero five zero, three two one, four five, six seven."),
        variants: [...PHONE_MISTAKES, other("It's + nömrə.", ex("It's zero five zero, three two one, four five, six seven.", 'Nömrəni “It’s” ilə başla və rəqəmləri bir-bir de.', "It's zero five zero… — nömrə; My phone… — telefonun özü.", "It's zero five zero, three two one, four five, six seven."))],
      },
    },
    {
      type: 'write', id: 'u2d8_c06', number: 6, keypad: true, title: 'Nömrəni yığ', why: 'Nömrəni rəqəm-rəqəm yığdın: oh — sıfır.', hint: 'Hər rəqəmi eşidən kimi bas; “ou” səsini də unutma.',
      prompt: 'Ziyafətdə yeni tanış nömrəsini deyir.\nDinlə və yığ.', audio: "It's oh five oh, seven seven one, two nine, four four.", placeholder: 'Telefon nömrəsi',
      rule: exact('0507712944'),
      variants: [other('Rəqəmləri bir-bir yoxla.', ex('0507712944', '“oh” sıfırdır; “seven seven” — iki yeddi.', 'oh — 0; seven seven — 77.', "It's oh five oh, seven seven one, two nine, four four."))],
      review: {
        keypad: true, title: 'Nömrəni yığ', why: 'Nömrəni rəqəm-rəqəm yığdın.', hint: 'Hər rəqəmi eşidən kimi bas; “ou” səsini də unutma.',
        prompt: 'Qeydiyyatçı kursun nömrəsini deyir.\nDinlə və yığ.', audio: "It's zero one two, four nine eight, oh six, three three.", placeholder: 'Telefon nömrəsi',
        rule: exact('0124980633'),
        variants: [other('Rəqəmləri bir-bir yoxla.', ex('0124980633', '“zero” və “oh” ikisi də sıfırdır.', 'zero — 0; oh — 0.', "It's zero one two, four nine eight, oh six, three three."))],
      },
    },
    {
      type: 'match', mode: 'reply', id: 'u2d8_c07', number: 7, title: 'Cavab cütü', why: 'Hər suala uyğun cavabı tapdın.', hint: 'Hər suala uyğun cavabı tap, bir cavab artıqdır.',
      prompt: 'Qeydiyyat masasında suallar.\nSuala toxun, sonra onun cavabını seç.',
      rows: [{ en: 'How old are you?', az: "I'm thirty.", from: 'G' }, { en: 'How do you spell it?', az: "It's B-A-K-U.", from: 'B' }, { en: 'Is that right?', az: "Yes, that's right.", from: 'M' }],
      extra: ['Nice to meet you.'],
      variants: [other('Bir sualın cavabı yerində deyil.', ex("How old are you? — I'm thirty.; How do you spell it? — It's B-A-K-U.; Is that right? — Yes, that's right.", 'Yaş, hərflər və təsdiq fərqli suallara cavabdır.', "How old are you? → I'm thirty; Is that right? → Yes, that's right.", "How do you spell it? — It's B-A-K-U."))],
      review: {
        title: 'Cavab cütü', why: 'Hər suala uyğun cavabı tapdın.', hint: 'Hər suala uyğun cavabı tap, bir cavab artıqdır.',
        prompt: 'Ziyafətdə suallar.\nSuala toxun, sonra onun cavabını seç.',
        rows: [{ en: "What's your email?", az: "It's K-B at mail dot com.", from: 'B' }, { en: 'Thank you!', az: "You're welcome.", from: 'G' }, { en: "What's your phone number?", az: "It's oh five oh…", from: 'M' }],
        extra: ["I'm fine, thanks."],
        variants: [other('Bir sualın cavabı yerində deyil.', ex("What's your email? — It's K-B at mail dot com.; Thank you! — You're welcome.; What's your phone number? — It's oh five oh…", 'E-poçt, təşəkkür və nömrə fərqli cavab istəyir.', "Thank you! → You're welcome; What's your email? → It's … at mail dot com.", "What's your email? — It's K-B at mail dot com."))],
      },
    },
    {
      type: 'write', id: 'u2d8_c08', number: 8, title: 'Dinlə və yaz', why: 'mammadova@mail.com — double M, @ və nöqtə.', hint: 'Hərfləri bir-bir yaz; qoşa hərfə və işarələrə diqqət et.',
      prompt: 'Qeydiyyatçı kurs müəlliminin e-poçtunu deyir.\nÜnvanı yaz.', audio: "It's M-A-double M-A-D-O-V-A at mail dot com.", placeholder: 'E-poçt ünvanı',
      rule: exact('mammadova@mail.com'),
      variants: [asWords('mammadova@mail.com', 'mammadova at mail dot com'), other('Ünvanı yoxla.', ex('mammadova@mail.com', '“double M” — MM; “at” — @; “dot” — nöqtə.', 'double M — MM; at — @.', "It's M-A-double M-A-D-O-V-A at mail dot com."))],
      review: {
        title: 'Dinlə və yaz', why: 'abbasov3@mail.com — double B, @ və nöqtə.', hint: 'Hərfləri bir-bir yaz; qoşa hərfə və işarələrə diqqət et.',
        prompt: 'Ofisdə iş yoldaşın müdirin e-poçtunu deyir.\nÜnvanı yaz.', audio: "It's A-double B-A-S-O-V three at mail dot com.", placeholder: 'E-poçt ünvanı',
        rule: exact('abbasov3@mail.com'),
        variants: [asWords('abbasov3@mail.com', 'abbasov3 at mail dot com'), other('Ünvanı yoxla.', ex('abbasov3@mail.com', '“double B” — BB; “at” — @; “dot” — nöqtə.', 'double B — BB; dot — nöqtə.', "It's A-double B-A-S-O-V three at mail dot com."))],
      },
    },
    {
      type: 'voice', id: 'u2d8_c09', number: 9, title: 'Soyadını hərf-hərf de', why: 'Soyadını hərf-hərf dedin.', hint: 'Soyadının hər hərfini ingiliscə oxunuşla, ayrı-ayrı de.',
      prompt: 'Qeydiyyatçı soruşur: “What\'s your last name? How do you spell it?”\nSoyadını hərf-hərf de. Ə, ş, ç varsa, pasportdakı latın yazılışı ilə de (Ş → SH, Ə → A).', audio: "What's your last name? How do you spell it?", reply: 'Thank you!',
      rule: own(NAME_SPELLED, 'My last name is …'),
      variants: [other("It's + hərflər.", ex('My last name is …', 'Soyadını hərf-hərf de: hər hərfin ingiliscə oxunuşu ilə.', "How do you spell it? — It's M-A-double M-A-D-O-V-A.", "It's H-A-S-A-N-O-V-A."))],
      review: {
        title: 'Adını hərf-hərf de', why: 'Adını hərf-hərf dedin.', hint: 'Adının hər hərfini ingiliscə oxunuşla, ayrı-ayrı de.',
        prompt: 'Ziyafətdə yeni tanış adını kartına yazmaq istəyir.\nAdını hərf-hərf de. Ə, ş, ç varsa, latın yazılışı ilə de (Ş → SH, Ə → A).', audio: "What's your first name? Can you spell it, please?", reply: 'Thanks!',
        rule: own(NAME_SPELLED, "It's …"),
        variants: [other("It's + hərflər.", ex("It's …", 'Adını hərf-hərf de: hər hərfin ingiliscə oxunuşu ilə.', "Can you spell it, please? — It's G-A-N-J-A.", "It's B-A-K-U."))],
      },
    },
    {
      type: 'two', id: 'u2d8_c10', number: 10, title: 'Formanı doldur', why: 'Qeydiyyat vərəqini tam doldurdun.', hint: 'Hər sətrin başlığını oxu və öz məlumatını yaz.', scenes: ['u2/form-course'],
      prompt: 'Kursun qeydiyyat masasındasan.\nVərəqi doldur (istəsən, uydurma məlumat).', form: { title: 'Kurs qeydiyyatı', subtitle: 'Yeni tələbə' },
      fields: [
        { id: 'u2d8_c10a', label: 'First name', placeholder: '…', rule: own(NAME, '…'), purpose: 'adını yazmaq', empty: 'Adını da yaz.' },
        { id: 'u2d8_c10b', label: 'Last name', placeholder: '…', rule: own(NAME, 'Mammadova'), purpose: 'soyadını yazmaq', empty: 'Soyadını da yaz.' },
        { id: 'u2d8_c10c', label: 'Phone number', placeholder: '…', rule: own(PHONE, '050 321 45 67'), purpose: 'nömrəni yazmaq', empty: 'Nömrəni də yaz.' },
        { id: 'u2d8_c10d', label: 'How old are you?', placeholder: '…', rule: own(AGE_FIELD, '25'), purpose: 'yaşını yazmaq', empty: 'Yaşını da yaz.' },
      ],
      variants: [
        { field: 'u2d8_c10a', match: { other: true }, explain: ex('…', 'Bu sətirdə yalnız adın lazımdır.', 'First name — adın; Last name — soyadın.', 'My first name is …') },
        { field: 'u2d8_c10b', match: { other: true }, explain: ex('Mammadova', 'Bu sətirdə yalnız soyadın lazımdır.', 'First name — adın; Last name — soyadın.', 'My last name is Mammadova.') },
        { field: 'u2d8_c10c', match: { other: true }, explain: ex('050 321 45 67', 'Bu sətirdə rəqəmlər lazımdır.', 'Phone number — nömrən; How old are you? — yaşın.', "It's zero five zero, three two one, four five, six seven.") },
        { field: 'u2d8_c10d', match: { other: true }, explain: ex('25', 'Bu sətirdə yaşın lazımdır: rəqəmlə və ya “I’m” ilə.', "25 — rəqəmlə; I'm twenty-five. — cümlə ilə.", "I'm twenty-five.") },
      ],
      review: {
        title: 'Formanı doldur', why: 'Vərəqi tam doldurdun.', hint: 'Hər sətrin başlığını oxu; sıra fərqli ola bilər.', scenes: ['u2/form-gym'],
        prompt: 'İdman zalına yazılırsan.\nVərəqi doldur (istəsən, uydurma məlumat).', form: { title: 'İdman zalı', subtitle: 'Yeni üzv' },
        fields: [
          { id: 'u2d8_c10b', label: 'Last name', placeholder: '…', rule: own(NAME, 'Mammadova'), purpose: 'soyadını yazmaq', empty: 'Soyadını da yaz.' },
          { id: 'u2d8_c10a', label: 'First name', placeholder: '…', rule: own(NAME, '…'), purpose: 'adını yazmaq', empty: 'Adını da yaz.' },
          { id: 'u2d8_c10d', label: 'How old are you?', placeholder: '…', rule: own(AGE_FIELD, '25'), purpose: 'yaşını yazmaq', empty: 'Yaşını da yaz.' },
          { id: 'u2d8_c10c', label: 'Email', placeholder: '…', rule: own(EMAIL, 'ganja5@mail.com'), purpose: 'e-poçtunu yazmaq', empty: 'E-poçtunu da yaz.' },
        ],
        variants: [
          { field: 'u2d8_c10b', match: { other: true }, explain: ex('Mammadova', 'Bu sətirdə yalnız soyadın lazımdır.', 'Last name — soyadın; First name — adın.', 'My last name is Mammadova.') },
          { field: 'u2d8_c10a', match: { other: true }, explain: ex('…', 'Bu sətirdə yalnız adın lazımdır.', 'Last name — soyadın; First name — adın.', 'My first name is …') },
          { field: 'u2d8_c10d', match: { other: true }, explain: ex('25', 'Bu sətirdə yaşın lazımdır.', "25 — rəqəmlə; I'm twenty-five. — cümlə ilə.", "I'm twenty-five.") },
          { field: 'u2d8_c10c', match: { other: true }, explain: ex('ganja5@mail.com', 'Ünvanda @ və nöqtə olur, söz yox.', 'at — @; dot — nöqtə.', "It's G-A-N-J-A five at mail dot com.") },
        ],
      },
    },
    {
      type: 'choice', id: 'u2d8_c11', number: 11, title: 'Sözü tamamla', why: '-ov ilə bitən soyad kişinindir — Mr.', hint: 'Soyadın sonuna bax: -ova, yoxsa -ov?',
      prompt: 'Ziyafətə kursun direktoru gəlir, soyadı Mammadov.\nQız ona salam verir. Hansı söz çatmır?', gap: { speaker: 'G', before: 'Hello,', after: 'Mammadov! Nice to meet you.' },
      options: ['Ms', 'Mr', 'last'], answer: 'Mr',
      variants: [
        pick('Ms', '“Ms” qadına deyilir.', ex('Mr', 'Mammadov — kişi soyadıdır, ona “Mr” deyilir.', 'Mr Mammadov — kişi; Ms Mammadova — qadın.', 'Hello, Mr Mammadov!')),
        pick('last', '“last” soyad sözündədir: last name.', ex('Mr', 'Salam verəndə soyaddan əvvəl “Mr” və ya “Ms” gəlir.', 'Hello, Mr Mammadov! — müraciət; last name — soyad.', 'Hello, Mr Mammadov!')),
      ],
      review: {
        title: 'Sözü tamamla', why: '-yeva ilə bitən soyad qadınındır — Ms.', hint: 'Soyadın sonuna bax: -yeva, yoxsa -yev?',
        prompt: 'Qeydiyyatçının soyadı Aliyeva.\nOğlan ona təşəkkür edir. Hansı söz çatmır?', gap: { speaker: 'B', before: 'Thank you,', after: 'Aliyeva!' },
        options: ['Mr', 'first', 'Ms'], answer: 'Ms',
        variants: [
          pick('Mr', '“Mr” kişiyə deyilir.', ex('Ms', 'Aliyeva — qadın soyadıdır, ona “Ms” deyilir.', 'Mr Aliyev — kişi; Ms Aliyeva — qadın.', 'Thank you, Ms Aliyeva!')),
          pick('first', '“first” ad sözündədir: first name.', ex('Ms', 'Müraciətdə soyaddan əvvəl “Ms” və ya “Mr” gəlir.', 'Thank you, Ms Aliyeva! — müraciət; first name — ad.', 'Thank you, Ms Aliyeva!')),
        ],
      },
    },
    {
      type: 'write', id: 'u2d8_c12', number: 12, title: 'Mesaj yaz', why: 'E-poçtunu yazdın.', hint: 'Ünvanı @ və nöqtə ilə yaz.',
      prompt: 'Ziyafətdən sonra yeni tanış yazır.\nÖz e-poçtunu yaz (istəsən, uydurma).', placeholder: 'Cavabını yaz',
      chat: { partner: 'Yeni tanış', from: 'B', lines: [{ from: 'B', text: "Hi! Nice to meet you! What's your email?" }] }, rule: own(EMAIL, "It's ganja5@mail.com."),
      variants: [other('ad@mail.com', ex("It's ganja5@mail.com.", 'Yazanda “at” yox, @; “dot” yox, nöqtə yazılır.', 'at — @; dot — nöqtə.', "It's G-A-N-J-A five at mail dot com."))],
      review: {
        title: 'Mesaj yaz', why: 'E-poçtunu yazdın.', hint: 'Ünvanı @ və nöqtə ilə yaz.',
        prompt: 'Kurs müəllimi hamıdan e-poçt istəyir.\nÖz e-poçtunu yaz (istəsən, uydurma).', placeholder: 'Cavabını yaz',
        chat: { partner: 'Kurs müəllimi', from: 'G', lines: [{ from: 'G', text: 'Hello! Email, please.' }] }, rule: own(EMAIL, "It's ganja5@mail.com."),
        variants: [other('ad@mail.com', ex("It's ganja5@mail.com.", 'Yazanda @ və nöqtə işarəsi qoyulur.', 'at — @; dot — nöqtə.', "It's ganja5@mail.com."))],
      },
    },
    {
      type: 'voice', id: 'u2d8_c13', number: 13, title: 'Yaşını de və soruş', why: 'Yaşını dedin və sualı qaytardın.', hint: 'Əvvəl yaşını de, sonra Bölmə 1-dəki qısa qarşı sualı əlavə et.',
      prompt: 'Ziyafətdə yeni tanış soruşur: “How old are you?”\nYaşını de və ondan da soruş (istəsən, istənilən yaş).', audio: 'How old are you?', reply: "I'm thirty-two.",
      rule: own(AGE_RETURN, "I'm twenty-five. And you?"),
      variants: [...AGE_MISTAKES, other("I'm … And you?", ex("I'm twenty-five. And you?", 'Yaşından sonra “And you?” ilə sualı qaytarırsan.', "I'm twenty-five. — yaş; And you? — qarşı sual.", "I'm thirty. And you?"))],
      review: {
        title: 'Yaşını de və soruş', why: 'Yaşını dedin və sualı qaytardın.', hint: 'Əvvəl yaşını de, sonra qısa qarşı sualı əlavə et.',
        prompt: 'Qeydiyyat növbəsində yanındakı adam soruşur.\nYaşını de və ondan da soruş (istəsən, istənilən yaş).', audio: 'Hi! How old are you?', reply: 'Nice!',
        rule: own(AGE_RETURN, "I'm twenty-five. And you?"),
        variants: [...AGE_MISTAKES, other("I'm … And you?", ex("I'm twenty-five. And you?", 'Yaşından sonra “And you?” ilə sualı qaytarırsan.', "I'm twenty-five. — yaş; And you? — qarşı sual.", "I'm thirty. And you?"))],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u2d8_c14', number: 14, title: 'Söhbəti sırala', why: 'Sual, nömrə, çaşqınlıq və izah düz sıradadır.', hint: 'Əvvəl sual gəlir; tanış olmayan səsi eşidən soruşur, o biri izah edir.',
      prompt: 'Ziyafətdə nömrə mübadiləsi.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: "What's your phone number?", from: 'G' }, { en: '2', az: "It's oh five five, two one nine, three oh, eight eight.", from: 'B' }, { en: '3', az: "Sorry? Oh? I don't understand.", from: 'G' }, { en: '4', az: 'Oh — zero. Zero five five, two one nine…', from: 'B' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("What's your phone number? → It's oh five five… → Sorry? Oh? I don't understand. → Oh — zero. Zero five five…", 'Qız “oh” sözünü başa düşmədi, oğlan onun sıfır olduğunu izah etdi.', "oh five five — 055; zero five five — 055.", "Sorry? I don't understand."))],
      review: {
        title: 'Söhbəti sırala', why: 'Sual, cavab, qarşı sual və xoş söz düz sıradadır.', hint: 'Əvvəl sual gəlir; cavab verən sualı geri qaytarır.',
        prompt: 'Qeydiyyat növbəsində tanışlıq.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: 'Hi! How old are you?', from: 'G' }, { en: '2', az: "I'm thirty-five. And you?", from: 'B' }, { en: '3', az: "I'm thirty.", from: 'G' }, { en: '4', az: 'Nice to meet you!', from: 'B' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Hi! How old are you? → I'm thirty-five. And you? → I'm thirty. → Nice to meet you!", 'Sual, cavab və qarşı sual, sonra ikinci cavab.', "How old are you? — sual; And you? — qarşı sual.", "I'm thirty-five. And you?"))],
      },
    },
  ],
  result: {
    done: ['Dərs 8 tamamlandı', 'Qeydiyyat söhbətində adını, soyadını, nömrəni, e-poçtunu və yaşını verdin.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Qeydiyyat suallarını və hərf-hərf deyiləni anlamaq', tasks: ['u2d8_c03', 'u2d8_c04', 'u2d8_c06', 'u2d8_c07', 'u2d8_c11', 'u2d8_c14'] },
      { group: 'Yazı', text: 'Formanı doldurmaq, ünvanı yazmaq, e-poçtunu göndərmək', tasks: ['u2d8_c08', 'u2d8_c10', 'u2d8_c12'] },
      { group: 'Danışıq', text: 'Nömrəni, yaşını demək və soyadını hərf-hərf demək', tasks: ['u2d8_c05', 'u2d8_c09', 'u2d8_c13'] },
    ],
    closing: 'Bölmə 2 bitdi! İndi bölmə imtahanını verə bilərsən.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [],
};
