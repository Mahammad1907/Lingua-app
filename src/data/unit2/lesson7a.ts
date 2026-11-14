// Bölmə 2 · Dərs 7 · 1-ci hissə — 11–20 (eleven · twelve · “-teen” nümunəsi · twenty). İdman zalı: dolab, kod, təkrar sayı.
// Spiral: 0–10 (Dərs 1), It's … (Dərs 2), Excuse me, please.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, resultTexts, said } from './shared';

const itsNumber = (word: string, digits: string, ...answers: string[]) =>
  said(String.raw`^(?:it'?s\s+|it is\s+)?(?:${word}|${digits})[.!]?$`, ...answers);

export const lesson7a: DesignLesson = {
  id: 'a1_en_b2_d7a', order: 18, unit: 2, number: 7, part: 1, title: 'Rəqəmlər 11–20', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d7a_c01', badge: 'Şəxsi məlumat', subtitle: 'İdman zalında dolab, kod və təkrarlar — hamısı rəqəmdir.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: '11–20 rəqəmlərini eşidib tanıyıram.' },
        { icon: 'wave', text: 'Dolabımın nömrəsini deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u2d7a_c02', number: 2, scenes: ['u2/word-eleven'],
      word: 'eleven', pronunciation: '/ɪˈlevən/', reading: 'ilevən', az: 'on bir',
      notes: ['Vurğu ortadadır: e-LE-ven.'],
      example: 'Nine, ten, eleven!', exampleAz: 'Doqquz, on, on bir!',
    },
    {
      type: 'choice', id: 'u2d7a_c03', number: 3, title: 'Dinlə və seç', why: '“eleven” — on bir.', hint: 'Sözün əvvəlinə və uzunluğuna qulaq as.',
      prompt: 'İdman zalının qəbulundasan. Qadın dolabının nömrəsini deyir.\nHansı nömrədir?', audio: 'Eleven.',
      options: ['11', '7', '1'], answer: '11',
      variants: [
        pick('7', '“seven” — yeddi; səsdə başqa söz var.', ex('11', '“seven” və “eleven”in sonu oxşayır, amma eleven “i” ilə başlayır.', 'Seven! — yeddi; Eleven! — on bir.', 'Nine, ten, eleven!')),
        pick('1', '“one” — bir; səsdə başqa söz var.', ex('11', '“eleven” ayrıca sözdür, “one one” deyil.', 'One! — bir; Eleven! — on bir.', 'Nine, ten, eleven!')),
      ],
      review: {
        title: 'Dinlə və seç', why: '“twelve” — on iki.', hint: 'Sözün sonuna qulaq as.',
        prompt: 'Kafedə ofisiant masanın nömrəsini deyir.\nHansı nömrədir?', audio: 'Twelve.',
        options: ['2', '12', '20'], answer: '12',
        variants: [
          pick('2', '“two” — iki; səsdə başqa söz var.', ex('12', '“twelve” ayrıca sözdür, “two” deyil.', 'Two! — iki; Twelve! — on iki.', 'Ten, eleven, twelve!')),
          pick('20', '“twenty” — iyirmi; səsdə başqa söz var.', ex('12', '“twenty” “ti” ilə bitir, “twelve” isə “v” ilə.', 'Twelve! — on iki; Twenty! — iyirmi.', 'Ten, eleven, twelve!')),
        ],
      },
    },
    {
      type: 'word', id: 'u2d7a_c04', number: 4, scenes: ['u2/word-twelve'],
      word: 'twelve', pronunciation: '/twelv/', reading: 'tuelv', az: 'on iki',
      notes: ['twelve ayrıca sözdür, “two” ilə qurulmur.'],
      example: 'Ten, eleven, twelve!', exampleAz: 'On, on bir, on iki!',
    },
    {
      type: 'write', id: 'u2d7a_c05', number: 5, keypad: true, title: 'Kodu yığ', why: 'twelve, eleven — 1211.', hint: 'Hər sözü eşidəndə iki rəqəm yığ.',
      prompt: 'İdman zalında dolabın kodu var.\nQəbul kodu deyir. Dinlə və yığ.', audio: 'Twelve, eleven.', placeholder: 'Dolabın kodu',
      rule: exact('1211'),
      variants: [other('Hər sözdə iki rəqəm var.', ex('1211', 'twelve — 12, eleven — 11; sıra ilə yığılır.', 'Twelve, eleven. — 1211; Eleven, twelve. — 1112.', 'Twelve, eleven.'))],
      review: {
        keypad: true, title: 'Kodu yığ', why: 'fifteen, nineteen — 1519.', hint: 'Hər sözü eşidəndə iki rəqəm yığ.',
        prompt: 'Ofisin qapısında kod var.\nİş yoldaşın kodu deyir. Dinlə və yığ.', audio: 'Fifteen, nineteen.', placeholder: 'Qapının kodu',
        rule: exact('1519'),
        variants: [other('Hər sözdə iki rəqəm var.', ex('1519', 'fifteen — 15, nineteen — 19.', 'Fifteen, nineteen. — 1519; Nineteen, fifteen. — 1915.', 'Fifteen, nineteen.'))],
      },
    },
    {
      type: 'word', id: 'u2d7a_c06', number: 6, scenes: ['u2/word-teen'],
      word: 'thirteen · fourteen · fifteen · sixteen · seventeen · eighteen · nineteen', pronunciation: '/ˌθɜrˈtin/ · /ˌfɔrˈtin/ · /ˌfɪfˈtin/ · /ˌsɪksˈtin/ · /ˌsevənˈtin/ · /ˌeɪˈtin/ · /ˌnaɪnˈtin/',
      reading: '**th**ırtin · fortin · fiftin · sikstin · sevəntin · eytin · nayntin', az: '13 · 14 · 15 · 16 · 17 · 18 · 19',
      structure: ['four + teen → fourteen', 'three → thirteen; five → fifteen'],
      notes: ['Vurğu sondadır: thir-TEEN.'],
      example: 'Thirteen, fourteen, fifteen!', exampleAz: 'On üç, on dörd, on beş!',
    },
    {
      type: 'voice', id: 'u2d7a_c07', number: 7, title: 'Dinlə və təkrarla', why: 'Rəqəmləri dedin; vurğu “teen” üzərindədir.', hint: 'Hər sözün sonunu güclü de.',
      prompt: 'Məşqçi təkrarları sayır.\nDinlə, sonra eyni cür de.', audio: 'Thirteen, fourteen, fifteen.', repeat: { stress: 'teen', note: 'Vurğu “teen” üzərindədir: thir-TEEN.', reading: '**th**ırtin, fortin, fiftin' },
      rule: exact('Thirteen, fourteen, fifteen.', '13 14 15'),
      variants: [other('Bir daha dinlə və sonunu güclü de.', ex('Thirteen, fourteen, fifteen.', 'Bu sözlərdə vurğu sondakı “teen” üzərindədir.', 'thir-TEEN — 13; four-TEEN — 14.', 'Thirteen, fourteen, fifteen!'))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Rəqəmləri dedin; vurğu “teen” üzərindədir.', hint: 'Hər sözün sonunu güclü de.',
        prompt: 'Yoqa dərsində müəllim nəfəsləri sayır.\nDinlə, sonra eyni cür de.', audio: 'Sixteen, seventeen, eighteen.', repeat: { stress: 'teen', note: 'Vurğu “teen” üzərindədir: six-TEEN.', reading: 'sikstin, sevəntin, eytin' },
        rule: exact('Sixteen, seventeen, eighteen.', '16 17 18'),
        variants: [other('Bir daha dinlə və sonunu güclü de.', ex('Sixteen, seventeen, eighteen.', 'Bu sözlərdə vurğu sondakı “teen” üzərindədir.', 'six-TEEN — 16; eigh-TEEN — 18.', 'Sixteen, seventeen, eighteen.'))],
      },
    },
    {
      type: 'word', id: 'u2d7a_c08', number: 8, scenes: ['u2/word-twenty'],
      word: 'twenty', pronunciation: '/ˈtwenti/', reading: 'tuenti', az: 'iyirmi',
      notes: ['Vurğu əvvəldədir: TWEN-ty.'],
      example: 'Eighteen, nineteen, twenty!', exampleAz: 'On səkkiz, on doqquz, iyirmi!',
    },
    {
      type: 'match', mode: 'reply', id: 'u2d7a_c09', number: 9, title: 'Cavab cütü', why: 'Hər sıranı düz davam etdirdin.', hint: 'Hər sıranın son rəqəmindən sonra hansının gəldiyini düşün.',
      prompt: 'Zalda təkrarları birlikdə sayırsınız.\nSıraya toxun, sonra onun davamını seç.',
      rows: [{ en: 'Eleven, twelve…', az: 'Thirteen!', from: 'G' }, { en: 'Eighteen, nineteen…', az: 'Twenty!', from: 'B' }, { en: 'Fourteen, fifteen…', az: 'Sixteen!', from: 'M' }],
      extra: ['Ten!'],
      variants: [other('Bir sıranın davamı yerində deyil.', ex('Eleven, twelve… — Thirteen!; Eighteen, nineteen… — Twenty!; Fourteen, fifteen… — Sixteen!', 'Hər sıra son rəqəmdən sonra davam edir.', 'Twelve… → thirteen; Nineteen… → twenty.', 'Eighteen, nineteen, twenty!'))],
      review: {
        title: 'Cavab cütü', why: 'Geriyə sayımı düz davam etdirdin.', hint: 'Geriyə sayırsan: son rəqəmdən əvvəl hansı gəlir?',
        prompt: 'İndi geriyə sayırsınız.\nSıraya toxun, sonra onun davamını seç.',
        rows: [{ en: 'Twenty, nineteen…', az: 'Eighteen!', from: 'B' }, { en: 'Thirteen, twelve…', az: 'Eleven!', from: 'G' }, { en: 'Seventeen, sixteen…', az: 'Fifteen!', from: 'M' }],
        extra: ['Fourteen!'],
        variants: [other('Bir sıranın davamı yerində deyil.', ex('Twenty, nineteen… — Eighteen!; Thirteen, twelve… — Eleven!; Seventeen, sixteen… — Fifteen!', 'Geriyə sayanda hər sıra bir rəqəm azalır.', 'Twelve… → eleven; Sixteen… → fifteen.', 'Twenty, nineteen, eighteen!'))],
      },
    },
    {
      type: 'write', id: 'u2d7a_c10', number: 10, title: 'Dinlə və yaz', why: 'fifteen — five yox, fif-.', hint: 'Yeni söz kartındakı yazılışı xatırla.',
      prompt: 'Qəbulda qadın dolabının nömrəsini deyir.\nEşitdiyin sözü yaz.', audio: 'Fifteen.', placeholder: 'Rəqəmi sözlə yaz',
      rule: exact('fifteen'),
      variants: [other('Yazılışı yoxla.', ex('fifteen', '15-də “five” dəyişir: fif- + teen.', 'four → fourteen; five → fifteen.', 'Thirteen, fourteen, fifteen!'))],
      review: {
        title: 'Dinlə və yaz', why: 'thirteen — three yox, thir-.', hint: 'Yeni söz kartındakı yazılışı xatırla.',
        prompt: 'Məşqçi neçə dəfə təkrar edəcəyini deyir.\nEşitdiyin sözü yaz.', audio: 'Thirteen.', placeholder: 'Rəqəmi sözlə yaz',
        rule: exact('thirteen'),
        variants: [other('Yazılışı yoxla.', ex('thirteen', '13-də “three” dəyişir: thir- + teen.', 'four → fourteen; three → thirteen.', 'Thirteen, fourteen, fifteen!'))],
      },
    },
    {
      type: 'choice', id: 'u2d7a_c11', number: 11, title: 'Sözü tamamla', why: '12 — twelve.', hint: 'On ikinin öz ayrıca sözü var — kartı xatırla.',
      prompt: 'Qız dolabının nömrəsini deyir: 12.\nHansı söz çatmır?', gap: { speaker: 'G', before: "It's", after: '.' },
      options: ['twelve', 'twoteen', 'twenty'], answer: 'twelve',
      variants: [
        pick('twoteen', 'Belə söz yoxdur: 12 — twelve.', ex('twelve', '“-teen” 13-dən başlayır; 12-nin öz sözü var.', 'twelve — 12; thirteen — 13.', "It's twelve.")),
        pick('twenty', '“twenty” — 20.', ex('twelve', '“twenty” iyirmidir, dolab isə 12-dir.', 'twelve — 12; twenty — 20.', "It's twelve.")),
      ],
      review: {
        title: 'Sözü tamamla', why: '11 — eleven.', hint: 'On birin öz ayrıca sözü var — kartı xatırla.',
        prompt: 'Oğlan dolabının nömrəsini deyir: 11.\nHansı söz çatmır?', gap: { speaker: 'B', before: "It's", after: '.' },
        options: ['oneteen', 'eleven', 'seventeen'], answer: 'eleven',
        variants: [
          pick('oneteen', 'Belə söz yoxdur: 11 — eleven.', ex('eleven', '“-teen” 13-dən başlayır; 11-in öz sözü var.', 'eleven — 11; thirteen — 13.', "It's eleven.")),
          pick('seventeen', '“seventeen” — 17.', ex('eleven', '“seventeen” on yeddidir, dolab isə 11-dir.', 'eleven — 11; seventeen — 17.', "It's eleven.")),
        ],
      },
    },
    {
      type: 'choice', id: 'u2d7a_c12', number: 12, title: 'Səhnədə tap', why: '“seventeen” — 17.', hint: 'Sözün sonuna qulaq as: “teen” var, yoxsa yox?', scenes: ['u2/gym-lockers'],
      prompt: 'Zalda dolablar sıra ilə düzülüb. Qəbul sənin dolabını deyir.\nŞəkildə həmin dolabı tap.', audio: 'Seventeen.',
      spots: [{ option: '7-ci dolab', x: 20, y: 50 }, { option: '17-ci dolab', x: 50, y: 50 }, { option: '16-cı dolab', x: 80, y: 50 }],
      options: ['7-ci dolab', '17-ci dolab', '16-cı dolab'], answer: '17-ci dolab',
      variants: [
        pick('7-ci dolab', '“seven” — 7; səsdə “teen” də var.', ex('17-ci dolab', 'Sözün sonunda “teen” var — bu, 17-dir.', 'seven — 7; seventeen — 17.', 'Seventeen.')),
        pick('16-cı dolab', '“sixteen” — 16; səsdə “seven” var.', ex('17-ci dolab', 'Sözün əvvəlində “seven” var, “six” yox.', 'sixteen — 16; seventeen — 17.', 'Seventeen.')),
      ],
      review: {
        title: 'Səhnədə tap', why: '“nineteen” — 19.', hint: 'Sözün sonuna qulaq as: “teen” var, yoxsa yox?', scenes: ['u2/gym-lockers-2'],
        prompt: 'Hovuzun soyunma otağındasan. Qəbul sənin dolabını deyir.\nŞəkildə həmin dolabı tap.', audio: 'Nineteen.',
        spots: [{ option: '9-cu dolab', x: 22, y: 48 }, { option: '18-ci dolab', x: 52, y: 48 }, { option: '19-cu dolab', x: 80, y: 48 }],
        options: ['9-cu dolab', '18-ci dolab', '19-cu dolab'], answer: '19-cu dolab',
        variants: [
          pick('9-cu dolab', '“nine” — 9; səsdə “teen” də var.', ex('19-cu dolab', 'Sözün sonunda “teen” var — bu, 19-dur.', 'nine — 9; nineteen — 19.', 'Nineteen.')),
          pick('18-ci dolab', '“eighteen” — 18; səsdə “nine” var.', ex('19-cu dolab', 'Sözün əvvəlində “nine” var, “eigh” yox.', 'eighteen — 18; nineteen — 19.', 'Nineteen.')),
        ],
      },
    },
    {
      type: 'voice', id: 'u2d7a_c13', number: 13, title: 'Dolabını de', why: 'Dolabının nömrəsini dedin.', hint: 'Dərs 2-dəki kimi qısa sözlə başla, sonra nömrəni de.',
      prompt: 'Qəbulda soruşurlar ki, dolabın neçədir. Sənin dolabın 18-dir.\nNömrəni de.', reply: 'Eighteen. Thank you!',
      rule: itsNumber('eighteen', '18', "It's eighteen."),
      variants: [other("It's eighteen.", ex("It's eighteen.", '18 — eight + teen; “gh” oxunmur.', 'eight — 8; eighteen — 18.', "It's eighteen."))],
      review: {
        title: 'Dolabını de', why: 'Dolabının nömrəsini dedin.', hint: 'Dərs 2-dəki kimi qısa sözlə başla, sonra nömrəni de.',
        prompt: 'Hovuzda soruşurlar ki, dolabın neçədir. Sənin dolabın 13-dür.\nNömrəni de.', reply: 'Thirteen. Thank you!',
        rule: itsNumber('thirteen', '13', "It's thirteen."),
        variants: [other("It's thirteen.", ex("It's thirteen.", '13 — thir- + teen, “three” dəyişir.', 'three — 3; thirteen — 13.', "It's thirteen."))],
      },
    },
  ],
  result: {
    done: ['Dərs 7 · 1-ci hissə tamamlandı', 'Artıq 11–20 rəqəmlərini tanıyırsan, yazırsan və dolabının nömrəsini deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: '11–20 rəqəmlərini eşidib tanımaq', tasks: ['u2d7a_c03', 'u2d7a_c05', 'u2d7a_c09', 'u2d7a_c11', 'u2d7a_c12'] },
      { group: 'Yazı', text: 'Eşitdiyin rəqəmi sözlə yazmaq', tasks: ['u2d7a_c10'] },
      { group: 'Danışıq', text: '11–20 rəqəmlərini demək', tasks: ['u2d7a_c07', 'u2d7a_c13'] },
    ],
    closing: 'Növbəti hissə — yaş: How old are you?', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'eleven', translation: 'on bir', example: 'Nine, ten, eleven!', exampleAz: 'Doqquz, on, on bir!', usageNote: 'Vurğu ortada: e-LE-ven.', pronunciation: '/ɪˈlevən/', teachCard: 'u2d7a_c02' },
    { word: 'twelve', translation: 'on iki', example: 'Ten, eleven, twelve!', exampleAz: 'On, on bir, on iki!', usageNote: 'Ayrıca söz.', pronunciation: '/twelv/', teachCard: 'u2d7a_c04' },
    { word: 'thirteen – nineteen', translation: '13–19', example: 'Thirteen, fourteen, fifteen!', exampleAz: 'On üç, on dörd, on beş!', usageNote: 'rəqəm + teen; thir-, fif- dəyişir.', pronunciation: '/ˌθɜrˈtin/ … /ˌnaɪnˈtin/', teachCard: 'u2d7a_c06' },
    { word: 'twenty', translation: 'iyirmi', example: 'Eighteen, nineteen, twenty!', exampleAz: 'On səkkiz, on doqquz, iyirmi!', usageNote: 'Vurğu əvvəldə.', pronunciation: '/ˈtwenti/', teachCard: 'u2d7a_c08' },
  ],
};
