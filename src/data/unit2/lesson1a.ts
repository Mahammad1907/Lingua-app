// Bölmə 2 · Dərs 1 · 1-ci hissə — Rəqəmlər 0–5 (zero … five). Lift, otel, ofis, kafe.
// Spiral (Bölmə 1): Excuse me, please, Thank you, You're welcome, Sorry? Again, please., tea.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, resultTexts, said } from './shared';

const floor = (word: string, digit: string, ...answers: string[]) =>
  said(String.raw`^(?:excuse me[,.!]?\s*)?(?:${word}|${digit})[,.!]?\s*please[.!]?$`, ...answers);

export const lesson1a: DesignLesson = {
  id: 'a1_en_b2_d1a', order: 10, unit: 2, number: 1, part: 1, title: 'Rəqəmlər 0–5', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d1a_c01', badge: 'Şəxsi məlumat', subtitle: 'Liftdə, oteldə, kafedə — rəqəmlər hər yerdədir.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: '0–5 rəqəmlərini eşidib tanıyıram.' },
        { icon: 'wave', text: 'Liftdə mərtəbəni nəzakətlə deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u2d1a_c02', number: 2, scenes: ['u2/word-zero-one'],
      word: 'zero · one', pronunciation: '/ˈzɪroʊ/ · /wʌn/', reading: 'zirou · uan', az: 'sıfır · bir',
      notes: ['one yazıldığı kimi yox, “uan” kimi oxunur.'],
      example: 'One tea, please.', exampleAz: 'Bir çay, zəhmət olmasa.',
    },
    {
      type: 'voice', id: 'u2d1a_c03', number: 3, title: 'Dinlə və təkrarla', why: '“one” düzgün səsləndi.', hint: 'Əvvəl yavaş dinlə, sonra sözləri bir-bir de.',
      prompt: 'Kafedəsən, çay sifariş edirsən.\nDinlə, sonra eyni cür de.', audio: 'One tea, please.', repeat: { stress: 'One', note: 'one — “uan”: dodaqlar əvvəl yumrulanır.', reading: 'uan ti, pliz' },
      rule: exact('One tea, please.', '1 tea please'),
      variants: [other('Bir daha dinlə və yavaş de.', ex('One tea, please.', '“one” yazıldığı kimi yox, “uan” kimi oxunur.', 'One tea, please. — bir çay; Tea, please. — çay.', 'One tea, please.'))],
      review: {
        title: 'Dinlə və təkrarla', why: '“three” düzgün səsləndi.', hint: 'Əvvəl yavaş dinlə, sonra sözləri bir-bir de.',
        prompt: 'Liftdəsən, düymə qonşunun tərəfindədir.\nDinlə, sonra eyni cür de.', audio: 'Three, please.', repeat: { stress: 'Three', note: 'three — dil dişlərin arasına gəlir.', reading: '**th**ri, pliz' },
        rule: exact('Three, please.', '3 please'),
        variants: [other('Bir daha dinlə və yavaş de.', ex('Three, please.', '“three”də dil dişlərin arasına gəlir, “t” kimi deyilmir.', 'Three, please. — üç; Two, please. — iki.', 'Excuse me, three, please.'))],
      },
    },
    {
      type: 'word', id: 'u2d1a_c04', number: 4, scenes: ['u2/word-two-three'],
      word: 'two · three', pronunciation: '/tu/ · /θri/', reading: 'tu · **th**ri', az: 'iki · üç',
      notes: ['three-də dil dişlərin arasına gəlir; “t” ilə desən, başqa söz alınır.'],
      example: 'One, two, three!', exampleAz: 'Bir, iki, üç!',
    },
    {
      type: 'choice', id: 'u2d1a_c05', number: 5, title: 'Dinlə və seç', why: '“three” — üç.', hint: 'Rəqəmin ilk səsinə qulaq as.',
      prompt: 'Otel liftindəsən, düymələrin yanında durursan.\nQonşu nəsə deyir. Hansı düyməni basırsan?', audio: 'Excuse me, three, please.',
      options: ['3', '2', '1'], answer: '3',
      variants: [
        pick('2', '“two” — iki, səsdə isə başqa rəqəm var.', ex('3', 'Səsdə “three” deyilir, “two” yox.', 'Two, please. — iki; Three, please. — üç.', 'Excuse me, three, please.')),
        pick('1', '“one” — bir, səsdə isə başqa rəqəm var.', ex('3', 'Səsdə “three” deyilir, “one” yox.', 'One, please. — bir; Three, please. — üç.', 'Excuse me, three, please.')),
      ],
      review: {
        title: 'Dinlə və seç', why: '“two” — iki.', hint: 'Rəqəmin ilk səsinə qulaq as.',
        prompt: 'Ofis binasının liftindəsən.\nİş yoldaşı nəsə deyir. Hansı düyməni basırsan?', audio: 'Excuse me, two, please.',
        options: ['3', '1', '2'], answer: '2',
        variants: [
          pick('3', '“three” — üç, səsdə isə başqa rəqəm var.', ex('2', 'Səsdə “two” deyilir, “three” yox.', 'Two, please. — iki; Three, please. — üç.', 'Excuse me, two, please.')),
          pick('1', '“one” — bir, səsdə isə başqa rəqəm var.', ex('2', 'Səsdə “two” deyilir, “one” yox.', 'One, please. — bir; Two, please. — iki.', 'Excuse me, two, please.')),
        ],
      },
    },
    {
      type: 'word', id: 'u2d1a_c06', number: 6, scenes: ['u2/word-four-five'],
      word: 'four · five', pronunciation: '/fɔr/ · /faɪv/', reading: 'for · fayv', az: 'dörd · beş',
      notes: ['five “v” ilə bitir: fayv.'],
      example: 'Five, four, three, two, one, zero!', exampleAz: 'Beş, dörd, üç, iki, bir, sıfır!',
    },
    {
      type: 'write', id: 'u2d1a_c07', number: 7, keypad: true, title: 'Nömrəni yığ', why: 'four, zero, one — 401.', hint: 'Hər rəqəmi eşidən kimi bas; lazım olsa, yavaş dinlə.',
      prompt: 'Oteldə otaq telefonundasan.\nResepsiya restoranın daxili nömrəsini deyir. Dinlə və yığ.', audio: 'Four, zero, one.', placeholder: 'Daxili nömrə',
      rule: exact('401'),
      variants: [other('Rəqəmləri bir-bir dinlə.', ex('401', 'Səsdə üç rəqəm var: four, zero, one.', 'four — 4; five — 5.', 'Four, zero, one.'))],
      review: {
        keypad: true, title: 'Nömrəni yığ', why: 'two, five, three — 253.', hint: 'Hər rəqəmi eşidən kimi bas; lazım olsa, yavaş dinlə.',
        prompt: 'Ofisdəsən.\nİş yoldaşı daxili nömrəsini deyir. Dinlə və yığ.', audio: 'Two, five, three.', placeholder: 'Daxili nömrə',
        rule: exact('253'),
        variants: [other('Rəqəmləri bir-bir dinlə.', ex('253', 'Səsdə üç rəqəm var: two, five, three.', 'two — 2; three — 3.', 'Two, five, three.'))],
      },
    },
    {
      type: 'match', id: 'u2d1a_c08', number: 8, title: 'Kim nə dedi?', why: 'Hər rəqəmi tanıdın.', hint: 'Hər cümlədə rəqəmi tap, qalan sözlər eynidir.',
      prompt: 'Liftdə hər kəs öz mərtəbəsini deyir.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'Three, please.', az: 'Üç, zəhmət olmasa.', from: 'G' }, { en: 'Excuse me, five, please.', az: 'Bağışlayın, beş, zəhmət olmasa.', from: 'B' }, { en: 'Zero, please.', az: 'Sıfır, zəhmət olmasa.', from: 'M' }],
      extra: ['Dörd, zəhmət olmasa.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex('Three, please. — Üç, zəhmət olmasa.; Excuse me, five, please. — Bağışlayın, beş, zəhmət olmasa.; Zero, please. — Sıfır, zəhmət olmasa.', 'Cümlələr oxşardır, yalnız rəqəm dəyişir.', 'Three, please. — üç; Five, please. — beş.', 'Excuse me, four, please.'))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər rəqəmi tanıdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
        prompt: 'Kafedə və liftdə.\nHər cümləyə mənasını qoş.',
        rows: [{ en: 'Four, please.', az: 'Dörd, zəhmət olmasa.', from: 'B' }, { en: 'One tea, please.', az: 'Bir çay, zəhmət olmasa.', from: 'G' }, { en: 'Two, please. Thank you!', az: 'İki, zəhmət olmasa. Təşəkkür edirəm!', from: 'M' }],
        extra: ['Beş, zəhmət olmasa.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex('Four, please. — Dörd, zəhmət olmasa.; One tea, please. — Bir çay, zəhmət olmasa.; Two, please. Thank you! — İki, zəhmət olmasa. Təşəkkür edirəm!', 'Hər cümlədə başqa rəqəm var.', 'Four, please. — dörd; Two, please. — iki.', 'One tea, please.'))],
      },
    },
    {
      type: 'choice', id: 'u2d1a_c09', number: 9, title: 'Sözü tamamla', why: '“four” — dörd.', hint: 'Rəqəmlərin sırasını xatırla: üçdən sonra hansı gəlir?',
      prompt: 'Qız 4-cü mərtəbəyə gedir.\nHansı söz çatmır?', gap: { speaker: 'G', before: 'Excuse me,', after: ', please.' },
      options: ['five', 'four', 'fine'], answer: 'four',
      variants: [
        pick('five', '“five” — beş.', ex('four', '“five” beşdir, qız isə 4-cü mərtəbəyə gedir.', 'Four, please. — dörd; Five, please. — beş.', 'Excuse me, four, please.')),
        pick('fine', '“fine” — yaxşı, rəqəm deyil.', ex('four', '“fine” halı bildirir, rəqəm deyil.', "I'm fine. — yaxşıyam; Four, please. — dörd, zəhmət olmasa.", 'Excuse me, four, please.')),
      ],
      review: {
        title: 'Sözü tamamla', why: '“three” — üç.', hint: 'Rəqəmlərin sırasını xatırla: ikidən sonra hansı gəlir?',
        prompt: 'Oğlan 3-cü mərtəbəyə gedir.\nHansı söz çatmır?', gap: { speaker: 'B', before: 'Excuse me,', after: ', please.' },
        options: ['tea', 'three', 'two'], answer: 'three',
        variants: [
          pick('tea', '“tea” — çay, rəqəm deyil.', ex('three', '“tea” çaydır; “three”də dil dişlərin arasına gəlir.', 'One tea, please. — bir çay; Three, please. — üç.', 'Excuse me, three, please.')),
          pick('two', '“two” — iki.', ex('three', '“two” ikidir, oğlan isə 3-cü mərtəbəyə gedir.', 'Two, please. — iki; Three, please. — üç.', 'Excuse me, three, please.')),
        ],
      },
    },
    {
      type: 'voice', id: 'u2d1a_c10', number: 10, title: 'Mərtəbəni de', why: 'Rəqəmi dedin və nəzakətlə xahiş etdin.', hint: 'Əvvəl diqqəti çək, sonra rəqəmi de və xahişi nəzakətli et.',
      prompt: 'Liftdə düymələr qonşunun tərəfindədir. Sən 2-ci mərtəbəyə gedirsən.\nNəzakətlə xahiş et.', reply: 'Two. OK!',
      rule: floor('two', '2', 'Excuse me, two, please.', 'Two, please.'),
      variants: [other('Rəqəm + please.', ex('Excuse me, two, please.', 'Sənə 2-ci mərtəbə lazımdır: rəqəmi de və “please” əlavə et.', 'Two, please. — iki; Three, please. — üç.', 'Excuse me, two, please.'))],
      review: {
        title: 'Mərtəbəni de', why: 'Rəqəmi dedin və nəzakətlə xahiş etdin.', hint: 'Əvvəl diqqəti çək, sonra rəqəmi de və xahişi nəzakətli et.',
        prompt: 'Ofis liftində 5-ci mərtəbəyə gedirsən, düymələr yanındakı adamın tərəfindədir.\nNəzakətlə xahiş et.', reply: 'Five. OK!',
        rule: floor('five', '5', 'Excuse me, five, please.', 'Five, please.'),
        variants: [other('Rəqəm + please.', ex('Excuse me, five, please.', 'Sənə 5-ci mərtəbə lazımdır: rəqəmi de və “please” əlavə et.', 'Five, please. — beş; Four, please. — dörd.', 'Excuse me, five, please.'))],
      },
    },
    {
      type: 'write', id: 'u2d1a_c11', number: 11, title: 'Dinlə və yaz', why: 'three — th ilə yazılır.', hint: 'Yeni söz kartındakı yazılışı xatırla.',
      prompt: 'Liftdə oğlan mərtəbəni deyir.\nEşitdiyin rəqəmi sözlə yaz.', audio: 'Three, please.', placeholder: 'Rəqəmi sözlə yaz',
      rule: exact('three'),
      variants: [other('Yazılışı yoxla.', ex('three', 'Bu söz “th” ilə başlayır.', 'two — iki; three — üç.', 'One, two, three!'))],
      review: {
        title: 'Dinlə və yaz', why: 'five — “v” ilə bitir.', hint: 'Yeni söz kartındakı yazılışı xatırla.',
        prompt: 'Otel resepsiyasında qadın otağın mərtəbəsini deyir.\nEşitdiyin rəqəmi sözlə yaz.', audio: 'Five.', placeholder: 'Rəqəmi sözlə yaz',
        rule: exact('five'),
        variants: [other('Yazılışı yoxla.', ex('five', 'Bu söz “v” səsi ilə bitir, sonunda “e” yazılır.', 'four — dörd; five — beş.', 'Five, four, three, two, one, zero!'))],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u2d1a_c12', number: 12, title: 'Söhbəti sırala', why: 'Xahiş, təkrar, təşəkkür və cavab düz sıradadır.', hint: 'Düşün: eşitməyən nə deyir və bundan sonra nə olur?',
      prompt: 'Liftdə səs-küy var.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: 'Excuse me. Four, please.', from: 'G' }, { en: '2', az: 'Sorry? Again, please.', from: 'B' }, { en: '3', az: 'Four, please. Thank you!', from: 'G' }, { en: '4', az: "You're welcome.", from: 'B' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Excuse me. Four, please. → Sorry? Again, please. → Four, please. Thank you! → You're welcome.", 'Oğlan eşitmədi və təkrar istədi; qız yenə dedi və təşəkkür etdi.', "Sorry? Again, please. — eşitmədin; Thank you! — You're welcome.", 'Sorry? Again, please.'))],
      review: {
        title: 'Söhbəti sırala', why: 'Sifariş, təkrar, təşəkkür və cavab düz sıradadır.', hint: 'Düşün: eşitməyən nə deyir və bundan sonra nə olur?',
        prompt: 'Kafedə səs-küy var.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: 'Hello! One tea, please.', from: 'M' }, { en: '2', az: 'Sorry? Again, please.', from: 'G' }, { en: '3', az: 'One tea, please. Thank you!', from: 'M' }, { en: '4', az: "You're welcome.", from: 'G' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Hello! One tea, please. → Sorry? Again, please. → One tea, please. Thank you! → You're welcome.", 'Qız eşitmədi və təkrar istədi; sifariş yenə deyildi.', "Sorry? Again, please. — eşitmədin; Thank you! — You're welcome.", 'One tea, please.'))],
      },
    },
  ],
  result: {
    done: ['Dərs 1 · 1-ci hissə tamamlandı', 'Artıq 0–5 rəqəmlərini eşidib tanıyır və liftdə mərtəbəni deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: '0–5 rəqəmlərini eşidib tanımaq', tasks: ['u2d1a_c05', 'u2d1a_c07', 'u2d1a_c08', 'u2d1a_c09', 'u2d1a_c12'] },
      { group: 'Yazı', text: 'Eşitdiyin rəqəmi sözlə yazmaq', tasks: ['u2d1a_c11'] },
      { group: 'Danışıq', text: 'Rəqəmi deyib nəzakətlə xahiş etmək', tasks: ['u2d1a_c03', 'u2d1a_c10'] },
    ],
    closing: 'Növbəti hissə — 6–10: avtobus dayanacağında.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'zero', translation: 'sıfır', example: 'Five, four, three, two, one, zero!', exampleAz: 'Beş, dörd, üç, iki, bir, sıfır!', usageNote: 'Rəqəm 0.', pronunciation: '/ˈzɪroʊ/', teachCard: 'u2d1a_c02' },
    { word: 'one', translation: 'bir', example: 'One tea, please.', exampleAz: 'Bir çay, zəhmət olmasa.', usageNote: '“uan” oxunur.', pronunciation: '/wʌn/', teachCard: 'u2d1a_c02' },
    { word: 'two', translation: 'iki', example: 'One, two, three!', exampleAz: 'Bir, iki, üç!', usageNote: 'Rəqəm 2.', pronunciation: '/tu/', teachCard: 'u2d1a_c04' },
    { word: 'three', translation: 'üç', example: 'One, two, three!', exampleAz: 'Bir, iki, üç!', usageNote: 'th: dil dişlərin arasında.', pronunciation: '/θri/', teachCard: 'u2d1a_c04' },
    { word: 'four', translation: 'dörd', example: 'Excuse me, four, please.', exampleAz: 'Bağışlayın, dörd, zəhmət olmasa.', usageNote: 'Rəqəm 4.', pronunciation: '/fɔr/', teachCard: 'u2d1a_c06' },
    { word: 'five', translation: 'beş', example: 'Five, four, three, two, one, zero!', exampleAz: 'Beş, dörd, üç, iki, bir, sıfır!', usageNote: '“v” ilə bitir.', pronunciation: '/faɪv/', teachCard: 'u2d1a_c06' },
  ],
};
