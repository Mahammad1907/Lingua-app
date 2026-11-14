// Bölmə 2 · Dərs 1 · 2-ci hissə — Rəqəmlər 6–10 (six … ten). Avtobus dayanacağı, taksi, kassa.
// Spiral: 0–5 (1-ci hissə), Excuse me, please, Thank you / Thanks, You're welcome.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from '../unit1/build';
import { notices, resultTexts, said } from './shared';

const numberPlease = (word: string, digit: string, ...answers: string[]) =>
  said(String.raw`^(?:excuse me[,.!]?\s*)?(?:${word}|${digit})[,.!]?\s*please[.!]?$`, ...answers);
const welcome = goal(['welcome'], ["You're welcome."]);

export const lesson1b: DesignLesson = {
  id: 'a1_en_b2_d1b', order: 11, unit: 2, number: 1, part: 2, title: 'Rəqəmlər 6–10', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d1b_c01', badge: 'Şəxsi məlumat', subtitle: 'Avtobus dayanacağındasan: nömrələri tanı, bilet al.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: '6–10 rəqəmlərini eşidib tanıyıram.' },
        { icon: 'wave', text: 'Avtobus nömrəsini deyib bilet istəyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u2d1b_c02', number: 2, scenes: ['u2/word-six-seven'],
      word: 'six · seven', pronunciation: '/sɪks/ · /ˈsevən/', reading: 'siks · sevən', az: 'altı · yeddi',
      notes: ['seven-də vurğu əvvəldədir: SE-ven.'],
      example: 'Five, six, seven!', exampleAz: 'Beş, altı, yeddi!',
    },
    {
      type: 'voice', id: 'u2d1b_c03', number: 3, title: 'Dinlə və təkrarla', why: 'Rəqəmlər aydın səsləndi.', hint: 'Əvvəl yavaş dinlə, sonra rəqəmləri bir-bir de.',
      prompt: 'Dayanacaqda avtobusları sayırsan.\nDinlə, sonra eyni cür de.', audio: 'Five, six, seven.', repeat: { stress: 'seven', note: 'six və seven “s” ilə başlayır; seven-də vurğu əvvəldədir.', reading: 'fayv, siks, sevən' },
      rule: exact('Five, six, seven.', '5 6 7', '567'),
      variants: [other('Bir daha dinlə və yavaş de.', ex('Five, six, seven.', 'Hər rəqəmi ayrıca və aydın de.', 'Six! — altı; Seven! — yeddi.', 'Five, six, seven!'))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Rəqəmlər aydın səsləndi.', hint: 'Əvvəl yavaş dinlə, sonra rəqəmləri bir-bir de.',
        prompt: 'Taksidə sürücü dayanacaqları sayır.\nDinlə, sonra eyni cür de.', audio: 'Eight, nine, ten.', repeat: { stress: 'Eight', note: 'eight — “eyt”: yazıdakı gh oxunmur.', reading: 'eyt, nayn, ten' },
        rule: exact('Eight, nine, ten.', '8 9 10', '8910'),
        variants: [other('Bir daha dinlə və yavaş de.', ex('Eight, nine, ten.', 'eight “eyt” oxunur, yazıdakı gh səslənmir.', 'Eight! — səkkiz; Nine! — doqquz.', 'Eight, nine, ten!'))],
      },
    },
    {
      type: 'word', id: 'u2d1b_c04', number: 4, scenes: ['u2/word-eight-nine'],
      word: 'eight · nine', pronunciation: '/eɪt/ · /naɪn/', reading: 'eyt · nayn', az: 'səkkiz · doqquz',
      notes: ['eight-də “gh” oxunmur: eyt.'],
      example: 'Seven, eight, nine!', exampleAz: 'Yeddi, səkkiz, doqquz!',
    },
    {
      type: 'choice', id: 'u2d1b_c05', number: 5, title: 'Səhnədə tap', why: '“nine” — doqquz.', hint: 'Rəqəmin ilk səsinə qulaq as.', scenes: ['u2/bus-stop'],
      prompt: 'Dayanacağa üç avtobus gəlir. Qız sürücüdən soruşur.\nO hansı avtobusu gözləyir?', audio: 'Excuse me, nine?',
      spots: [{ option: '9 nömrəli avtobus', x: 22, y: 46 }, { option: '5 nömrəli avtobus', x: 52, y: 42 }, { option: '8 nömrəli avtobus', x: 80, y: 48 }],
      options: ['9 nömrəli avtobus', '5 nömrəli avtobus', '8 nömrəli avtobus'], answer: '9 nömrəli avtobus',
      variants: [
        pick('5 nömrəli avtobus', 'five — beş; səsdə başqa rəqəm var.', ex('9 nömrəli avtobus', '“five” və “nine”də eyni “ay” səsi var, amma ilk səs fərqlidir.', 'Five? — beş; Nine? — doqquz.', 'Excuse me, nine?')),
        pick('8 nömrəli avtobus', 'eight — səkkiz; səsdə başqa rəqəm var.', ex('9 nömrəli avtobus', 'Səsdə “eyt” yox, “nayn” deyilir.', 'Eight? — səkkiz; Nine? — doqquz.', 'Excuse me, nine?')),
      ],
      review: {
        title: 'Səhnədə tap', why: '“six” — altı.', hint: 'Rəqəmin sonuna da qulaq as.', scenes: ['u2/bus-stop-2'],
        prompt: 'Oğlan dayanacaqda sürücüdən soruşur.\nO hansı avtobusa minir?', audio: 'Excuse me, six?',
        spots: [{ option: '7 nömrəli avtobus', x: 24, y: 44 }, { option: '6 nömrəli avtobus', x: 54, y: 46 }, { option: '10 nömrəli avtobus', x: 82, y: 42 }],
        options: ['7 nömrəli avtobus', '6 nömrəli avtobus', '10 nömrəli avtobus'], answer: '6 nömrəli avtobus',
        variants: [
          pick('7 nömrəli avtobus', 'seven — yeddi; səsdə başqa rəqəm var.', ex('6 nömrəli avtobus', '“six” və “seven” ikisi də “s” ilə başlayır, amma six qısadır.', 'Six? — altı; Seven? — yeddi.', 'Excuse me, six?')),
          pick('10 nömrəli avtobus', 'ten — on; səsdə başqa rəqəm var.', ex('6 nömrəli avtobus', 'Səsdə “ten” yox, “six” deyilir.', 'Six? — altı; Ten? — on.', 'Excuse me, six?')),
        ],
      },
    },
    {
      type: 'word', id: 'u2d1b_c06', number: 6, scenes: ['u2/word-ten'],
      word: 'ten', pronunciation: '/ten/', reading: 'ten', az: 'on',
      notes: ['ten yazıldığı kimi oxunur.'],
      example: 'Eight, nine, ten!', exampleAz: 'Səkkiz, doqquz, on!',
    },
    {
      type: 'write', id: 'u2d1b_c07', number: 7, keypad: true, speaker: 'mascot', title: 'Nömrəni yığ', why: 'nine, eight, seven, six — 9876.', hint: 'Hər rəqəmi eşidən kimi bas; lazım olsa, yavaş dinlə.',
      prompt: 'Taksi çağırırsan.\n{M} taksinin qısa nömrəsini deyir. Dinlə və yığ.', audio: 'Nine, eight, seven, six.', placeholder: 'Qısa nömrə',
      rule: exact('9876'),
      variants: [other('Rəqəmləri bir-bir dinlə.', ex('9876', 'Səsdə dörd rəqəm var və sıra ilə yığılır.', 'nine — 9; six — 6.', 'Nine, eight, seven, six.'))],
      review: {
        keypad: true, title: 'Nömrəni yığ', why: 'eight, zero, six, nine — 8069.', hint: 'Hər rəqəmi eşidən kimi bas; lazım olsa, yavaş dinlə.',
        prompt: 'Dayanacaqda elan avtobus şirkətinin qısa nömrəsini deyir.\nDinlə və yığ.', audio: 'Eight, zero, six, nine.', placeholder: 'Qısa nömrə',
        rule: exact('8069'),
        variants: [other('Rəqəmləri bir-bir dinlə.', ex('8069', 'Səsdə dörd rəqəm var: eight, zero, six, nine.', 'eight — 8; zero — 0.', 'Eight, zero, six, nine.'))],
      },
    },
    {
      type: 'choice', id: 'u2d1b_c08', number: 8, title: 'Sözü tamamla', why: '“seven” — yeddi.', hint: 'Altıdan sonra hansı rəqəm gəlir?',
      prompt: 'Oğlan 7 nömrəli avtobusu gözləyir.\nSürücüdən soruşur. Hansı söz çatmır?', gap: { speaker: 'B', before: 'Excuse me,', after: '?' },
      options: ['six', 'seven', 'eight'], answer: 'seven',
      variants: [
        pick('six', '“six” — altı.', ex('seven', '“six” altıdır, oğlan isə 7 nömrəni gözləyir.', 'Six? — altı; Seven? — yeddi.', 'Excuse me, seven?')),
        pick('eight', '“eight” — səkkiz.', ex('seven', '“eight” səkkizdir, oğlan isə 7 nömrəni gözləyir.', 'Seven? — yeddi; Eight? — səkkiz.', 'Excuse me, seven?')),
      ],
      review: {
        title: 'Sözü tamamla', why: '“eight” — səkkiz.', hint: 'Yeddidən sonra hansı rəqəm gəlir?',
        prompt: 'Qız 8 nömrəli avtobusu gözləyir.\nSürücüdən soruşur. Hansı söz çatmır?', gap: { speaker: 'G', before: 'Excuse me,', after: '?' },
        options: ['nine', 'ten', 'eight'], answer: 'eight',
        variants: [
          pick('nine', '“nine” — doqquz.', ex('eight', '“nine” doqquzdur, qız isə 8 nömrəni gözləyir.', 'Eight? — səkkiz; Nine? — doqquz.', 'Excuse me, eight?')),
          pick('ten', '“ten” — on.', ex('eight', '“ten” ondur, qız isə 8 nömrəni gözləyir.', 'Eight? — səkkiz; Ten? — on.', 'Excuse me, eight?')),
        ],
      },
    },
    {
      type: 'match', mode: 'reply', id: 'u2d1b_c09', number: 9, title: 'Cavab cütü', why: 'Hər sıranı düz davam etdirdin.', hint: 'Hər sıranın son rəqəmindən sonra hansının gəldiyini düşün.',
      prompt: 'Avtobusu gözləyərkən sayma oyunu.\nSıraya toxun, sonra onun davamını seç.',
      rows: [{ en: 'One, two, three…', az: 'Four, five, six!', from: 'G' }, { en: 'Six, seven…', az: 'Eight, nine, ten!', from: 'B' }, { en: 'Zero, one…', az: 'Two, three!', from: 'M' }],
      extra: ['Nine, ten!'],
      variants: [other('Bir sıranın davamı yerində deyil.', ex('One, two, three… — Four, five, six!; Six, seven… — Eight, nine, ten!; Zero, one… — Two, three!', 'Hər sıra son rəqəmdən sonra davam edir.', 'Six, seven… → eight; Eight, nine… → ten.', 'Eight, nine, ten!'))],
      review: {
        title: 'Cavab cütü', why: 'Geriyə sayımı düz davam etdirdin.', hint: 'Geriyə sayırsan: son rəqəmdən əvvəl hansı gəlir?',
        prompt: 'İndi geriyə sayırıq.\nSıraya toxun, sonra onun davamını seç.',
        rows: [{ en: 'Ten, nine, eight…', az: 'Seven, six, five!', from: 'B' }, { en: 'Four, three…', az: 'Two, one, zero!', from: 'G' }, { en: 'Seven, six…', az: 'Five, four!', from: 'M' }],
        extra: ['Six, five!'],
        variants: [other('Bir sıranın davamı yerində deyil.', ex('Ten, nine, eight… — Seven, six, five!; Four, three… — Two, one, zero!; Seven, six… — Five, four!', 'Geriyə sayanda hər sıra bir rəqəm azalır.', 'Ten, nine… → eight; Seven, six… → five.', 'Ten, nine, eight, seven!'))],
      },
    },
    {
      type: 'voice', id: 'u2d1b_c10', number: 10, title: 'Bilet al', why: 'Nömrəni dedin və nəzakətlə xahiş etdin.', hint: 'Rəqəmi de, sonra xahişi nəzakətli edən sözü əlavə et.',
      prompt: 'Kassadasan. 10 nömrəli avtobusa bilet lazımdır.\nNömrəni de və nəzakətlə xahiş et.', reply: 'Ten. OK!',
      rule: numberPlease('ten', '10', 'Ten, please.', 'Excuse me, ten, please.'),
      variants: [other('Rəqəm + please.', ex('Ten, please.', 'Sənə 10 nömrəli avtobus lazımdır: rəqəmi de və “please” əlavə et.', 'Ten, please. — on; Nine, please. — doqquz.', 'Excuse me, ten, please.'))],
      review: {
        title: 'Masanı de', why: 'Nömrəni dedin və nəzakətlə xahiş etdin.', hint: 'Rəqəmi de, sonra xahişi nəzakətli edən sözü əlavə et.',
        prompt: 'Kafedə 6 nömrəli masa sənindir. Ofisiant hansı masa olduğunu soruşur.\nNömrəni de və nəzakətlə xahiş et.', reply: 'Six. OK!',
        rule: numberPlease('six', '6', 'Six, please.', 'Excuse me, six, please.'),
        variants: [other('Rəqəm + please.', ex('Six, please.', 'Sənin masan 6-dır: rəqəmi de və “please” əlavə et.', 'Six, please. — altı; Seven, please. — yeddi.', 'Six, please.'))],
      },
    },
    {
      type: 'write', id: 'u2d1b_c11', number: 11, title: 'Rəqəmi yaz', why: 'eight — gh yazılır, amma oxunmur.', hint: 'Yeni söz kartındakı yazılışı xatırla: səsdə olmayan hərflər də var.',
      prompt: 'Dayanacaqdakı lövhədə “8” yazılıb.\nDostun soruşur ki, ingiliscə necədir. Sözlə yaz.', placeholder: 'Rəqəmi sözlə yaz',
      rule: exact('eight'),
      variants: [other('Yazılışı yoxla.', ex('eight', '“eyt” deyilir, amma yazıda gh var.', 'eight — 8; nine — 9.', 'Seven, eight, nine!'))],
      review: {
        title: 'Rəqəmi yaz', why: 'nine — sonunda “e” var.', hint: 'Yeni söz kartındakı yazılışı xatırla.',
        prompt: 'Biletində “9” yazılıb.\nSözlə yaz.', placeholder: 'Rəqəmi sözlə yaz',
        rule: exact('nine'),
        variants: [other('Yazılışı yoxla.', ex('nine', '“nayn” deyilir, yazıda sonda “e” var.', 'nine — 9; ten — 10.', 'Eight, nine, ten!'))],
      },
    },
    {
      type: 'write', id: 'u2d1b_c12', number: 12, title: 'Mesaj yaz', why: 'Təşəkkürə cavab verdin.', hint: 'Bölmə 1, Dərs 5: təşəkkürə necə cavab verilirdi?',
      prompt: 'Kurs yoldaşına avtobusun nömrəsini yazdın: 7. O cavab yazır.\nOna cavab ver.', placeholder: 'Cavabını yaz',
      chat: { partner: 'Kurs yoldaşı', from: 'B', lines: [{ from: 'B', text: 'Seven? Thank you!' }] }, rule: welcome,
      variants: [
        insteadOf('thanks', 'O sənə təşəkkür etdi — sən cavab verirsən.', ex("You're welcome.", 'Təşəkkür edən odur, sən təşəkkürə cavab verirsən.', "Thank you! — You're welcome.", "Seven? Thank you! — You're welcome.")),
        other('Təşəkkürə cavab yaz.', ex("You're welcome.", 'Kimsə təşəkkür edəndə “Dəyməz” deyirsən.', "Thank you! — You're welcome.", "Thanks! — You're welcome.")),
      ],
      review: {
        title: 'Mesaj yaz', why: 'Təşəkkürə cavab verdin.', hint: 'Kimsə sənə təşəkkür edəndə nə deyirsən?',
        prompt: 'İş yoldaşına taksinin nömrəsini yazdın. O təşəkkür edir.\nOna cavab ver.', placeholder: 'Cavabını yaz',
        chat: { partner: 'İş yoldaşı', from: 'G', lines: [{ from: 'G', text: 'Eight? Thanks!' }] }, rule: welcome,
        variants: [other('Təşəkkürə cavab yaz.', ex("You're welcome.", 'Kimsə təşəkkür edəndə “Dəyməz” deyirsən.', "Thanks! — You're welcome.", "Thank you! — You're welcome."))],
      },
    },
  ],
  result: {
    done: ['Dərs 1 · 2-ci hissə tamamlandı', 'Artıq 0–10 rəqəmlərini tanıyır, nömrə yığır və bilet istəyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: '6–10 rəqəmlərini eşidib tanımaq', tasks: ['u2d1b_c05', 'u2d1b_c07', 'u2d1b_c08', 'u2d1b_c09'] },
      { group: 'Yazı', text: 'Rəqəmi sözlə yazmaq və təşəkkürə cavab yazmaq', tasks: ['u2d1b_c11', 'u2d1b_c12'] },
      { group: 'Danışıq', text: 'Nömrəni deyib nəzakətlə xahiş etmək', tasks: ['u2d1b_c03', 'u2d1b_c10'] },
    ],
    closing: 'Növbəti dərs — telefon nömrəsi: soruşmaq, demək, yoxlamaq.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'six', translation: 'altı', example: 'Five, six, seven!', exampleAz: 'Beş, altı, yeddi!', usageNote: 'Rəqəm 6.', pronunciation: '/sɪks/', teachCard: 'u2d1b_c02' },
    { word: 'seven', translation: 'yeddi', example: 'Excuse me, seven?', exampleAz: 'Bağışlayın, yeddi?', usageNote: 'Vurğu əvvəldə: SE-ven.', pronunciation: '/ˈsevən/', teachCard: 'u2d1b_c02' },
    { word: 'eight', translation: 'səkkiz', example: 'Seven, eight, nine!', exampleAz: 'Yeddi, səkkiz, doqquz!', usageNote: 'gh oxunmur.', pronunciation: '/eɪt/', teachCard: 'u2d1b_c04' },
    { word: 'nine', translation: 'doqquz', example: 'Excuse me, nine?', exampleAz: 'Bağışlayın, doqquz?', usageNote: 'Rəqəm 9.', pronunciation: '/naɪn/', teachCard: 'u2d1b_c04' },
    { word: 'ten', translation: 'on', example: 'Eight, nine, ten!', exampleAz: 'Səkkiz, doqquz, on!', usageNote: 'Rəqəm 10.', pronunciation: '/ten/', teachCard: 'u2d1b_c06' },
  ],
};
