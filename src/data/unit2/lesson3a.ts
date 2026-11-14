// Bölmə 2 · Dərs 3 · 1-ci hissə — Hərflər səs qrupları ilə: “ey” (A H J K), “i” (B C D · P T V Z) və ən çaşdırıcı cüt E G.
// Hava limanı (şəhər kodu, qapı), taksi nömrəsi. Spiral: rəqəmlər (Dərs 1), Is that right? / Yes, that's right. (Dərs 2).
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, resultTexts, said, spelled } from './shared';

const plate = (...answers: string[]) => exact(...answers);

export const lesson3a: DesignLesson = {
  id: 'a1_en_b2_d3a', order: 13, unit: 2, number: 3, part: 1, title: 'Hərflər 1', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d3a_c01', badge: 'Şəxsi məlumat', subtitle: 'Hava limanında tablo və elanlar hərflərlə doludur.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'A H J K, B C D, P T V Z, E G hərflərini eşidib tanıyıram.' },
        { icon: 'wave', text: 'Qısa kodu hərf-hərf deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u2d3a_c02', number: 2, scenes: ['u2/word-letters-ay'],
      word: 'A, H, J, K', pronunciation: '/eɪ/ · /eɪtʃ/ · /dʒeɪ/ · /keɪ/', reading: 'ey, eyç, cey, key', az: '“ey” ilə bitən hərflər',
      notes: ['H — “eyç”, “aş” yox; J — “cey”.'],
      example: 'A, H, J, K.', exampleAz: 'ey, eyç, cey, key',
    },
    {
      type: 'voice', id: 'u2d3a_c03', number: 3, title: 'Dinlə və təkrarla', why: 'Hərfləri ingiliscə dedin.', hint: 'Dörd hərfin dördündə də eyni “ey” səsi var.',
      prompt: 'Hava limanındasan, tabloda hərflər yanır.\nDinlə, sonra eyni cür de.', audio: 'A, H, J, K.', repeat: { stress: 'H', note: 'H — “eyç”, J — “cey”.', reading: 'ey, eyç, cey, key' },
      rule: exact('A, H, J, K.', 'AHJK'),
      variants: [other('Bir daha dinlə və yavaş de.', ex('A, H, J, K.', 'İngiliscə H “eyç”, J “cey” oxunur.', 'H — eyç; J — cey.', 'A, H, J, K.'))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Hərfləri ingiliscə dedin.', hint: 'Azərbaycan əlifbasındakı oxunuşa aldanma.',
        prompt: 'Qatar stansiyasında platforma hərfləri elan olunur.\nDinlə, sonra eyni cür de.', audio: 'E, G.', repeat: { stress: 'G', note: 'E — “i”, G — “ci”.', reading: 'i, ci' },
        rule: exact('E, G.', 'EG'),
        variants: [other('Bir daha dinlə və yavaş de.', ex('E, G.', 'İngiliscə E “i”, G “ci” oxunur.', 'E — i; G — ci.', 'E, G.'))],
      },
    },
    {
      type: 'word', id: 'u2d3a_c04', number: 4, scenes: ['u2/word-letters-bcd'],
      word: 'B, C, D', pronunciation: '/bi/ · /si/ · /di/', reading: 'bi, si, di', az: '“i” ilə bitən hərflər',
      notes: ['C — “si”, “ce” yox.'],
      example: 'B, C, D.', exampleAz: 'bi, si, di',
    },
    {
      type: 'match', id: 'u2d3a_c05', number: 5, title: 'Hərfi oxunuşuna qoş', why: 'Hər hərfin ingiliscə adını tapdın.', hint: 'Azərbaycan əlifbasındakı oxunuşa aldanma.',
      prompt: 'Tabloda hərflər var.\nHər hərfə onun ingiliscə oxunuşunu qoş.',
      rows: [{ en: 'H', az: 'eyç' }, { en: 'C', az: 'si' }, { en: 'J', az: 'cey' }],
      extra: ['aş'],
      variants: [other('Bir hərfin oxunuşu yerində deyil.', ex('H — eyç; C — si; J — cey', 'İngiliscə hərflərin adı Azərbaycan əlifbasındakından fərqlidir.', 'H — eyç; C — si.', 'A, H, J, K.'))],
      review: {
        title: 'Hərfi oxunuşuna qoş', why: 'Hər hərfin ingiliscə adını tapdın.', hint: 'Əvvəl ən əmin olduğun hərfi yerinə qoy.',
        prompt: 'Taksinin nömrəsində hərflər var.\nHər hərfə onun ingiliscə oxunuşunu qoş.',
        rows: [{ en: 'K', az: 'key' }, { en: 'D', az: 'di' }, { en: 'A', az: 'ey' }],
        extra: ['ka'],
        variants: [other('Bir hərfin oxunuşu yerində deyil.', ex('K — key; D — di; A — ey', 'İngiliscə K “key”, A “ey” oxunur.', 'K — key; A — ey.', 'B, C, D.'))],
      },
    },
    {
      type: 'word', id: 'u2d3a_c06', number: 6, scenes: ['u2/word-letters-ptvz'],
      word: 'P, T, V, Z', pronunciation: '/pi/ · /ti/ · /vi/ · /zi/', reading: 'pi, ti, vi, zi', az: '“i” ilə bitən hərflər',
      notes: ['Z Amerikada “zi” oxunur.'],
      example: 'P, T, V, Z.', exampleAz: 'pi, ti, vi, zi',
    },
    {
      type: 'write', id: 'u2d3a_c07', number: 7, letters: ['B', 'P', 'K', 'D', 'T', 'V'], title: 'Hərfləri tut', why: 'K-B-P — Kiyev hava limanının kodu.', hint: 'Hər hərfi eşidən kimi toxun; “bi” və “pi” fərqinə qulaq as.',
      prompt: 'Hava limanında elan uçuşun şəhər kodunu deyir.\nEşitdiyin hərflərə toxun.', audio: 'K, B, P.', placeholder: 'Şəhər kodu',
      rule: exact('KBP'),
      variants: [other('Hərfləri bir-bir dinlə.', ex('KBP', 'Səsdə K, B, P deyilir.', 'B — bi; P — pi.', 'K, B, P.'))],
      review: {
        letters: ['E', 'K', 'P', 'B', 'G', 'A'], title: 'Hərfləri tut', why: 'P-E-K — Pekin hava limanının kodu.', hint: 'Hər hərfi eşidən kimi toxun; “i” səsi hansı hərfdir — kartı xatırla.',
        prompt: 'Tabloda Pekin uçuşu var. Elan şəhər kodunu deyir.\nEşitdiyin hərflərə toxun.', audio: 'P, E, K.', placeholder: 'Şəhər kodu',
        rule: exact('PEK'),
        variants: [other('Hərfləri bir-bir dinlə.', ex('PEK', 'Səsdə P, E, K deyilir; E “i” oxunur.', 'E — i; A — ey.', 'P, E, K.'))],
      },
    },
    {
      type: 'word', id: 'u2d3a_c08', number: 8, scenes: ['u2/word-letters-eg'],
      word: 'E, G', pronunciation: '/i/ · /dʒi/', reading: 'i, ci', az: 'ən çaşdırıcı iki hərf',
      notes: ['E — “i”, G — “ci”. Azərbaycan əlifbasındakı kimi oxunmur.'],
      example: 'E, G.', exampleAz: 'i, ci',
    },
    {
      type: 'choice', id: 'u2d3a_c09', number: 9, title: 'Dinlə və seç', why: 'G — “ci”, E — “i”.', hint: 'Azərbaycan əlifbasındakı oxunuşa aldanma.',
      prompt: 'Biletində uçuş kodu var. Elan iki hərf deyir.\nHansı kod deyilir?', audio: 'G, E.',
      options: ['GE', 'JE', 'GA'], answer: 'GE',
      variants: [
        pick('JE', 'J “cey” oxunur, səsdə “ci” var.', ex('GE', 'Səsdəki “ci” — G-dir; J “cey” oxunur.', 'G — ci; J — cey.', 'G, E.')),
        pick('GA', 'A “ey” oxunur, səsdə “i” var.', ex('GE', 'Səsdəki “i” — E-dir; A “ey” oxunur.', 'E — i; A — ey.', 'G, E.')),
      ],
      review: {
        title: 'Dinlə və seç', why: 'J — “cey”, A — “ey”.', hint: 'Hər hərfin sonundakı səsə qulaq as.',
        prompt: 'Qatar biletində vaqon kodu var. Elan iki hərf deyir.\nHansı kod deyilir?', audio: 'J, A.',
        options: ['GE', 'JA', 'GA'], answer: 'JA',
        variants: [
          pick('GE', 'Səsdə “cey” və “ey” var.', ex('JA', '“cey” — J, “ey” — A; G “ci”, E “i” oxunur.', 'J — cey; G — ci.', 'J, A.')),
          pick('GA', 'G “ci” oxunur, səsdə “cey” var.', ex('JA', 'Səsdəki “cey” — J-dir; G “ci” oxunur.', 'J — cey; G — ci.', 'J, A.')),
        ],
      },
    },
    {
      type: 'voice', id: 'u2d3a_c10', number: 10, title: 'Kodu de', why: 'Kodu ingiliscə hərf-hərf dedin.', hint: 'Hər hərfi ayrıca de; birinci hərf “aş” deyil.',
      prompt: 'Dostun soruşur hansı uçuşa minirsən. Biletində “HKG” yazılıb (Honkonq).\nKodu hərf-hərf de.',
      rule: said(spelled('HKG'), 'H, K, G.'),
      variants: [other('Hərf-hərf de.', ex('H, K, G.', 'İngiliscə H “eyç”, G “ci” oxunur.', 'H — eyç; G — ci.', 'H, K, G.'))],
      review: {
        title: 'Kodu de', why: 'Kodu ingiliscə hərf-hərf dedin.', hint: 'Hər hərfi ayrıca de; sonuncu hərf “qe” deyil.',
        prompt: 'Taksi sürücüsü soruşur hansı uçuşdur. Biletində “ZAG” yazılıb (Zaqreb).\nKodu hərf-hərf de.',
        rule: said(spelled('ZAG'), 'Z, A, G.'),
        variants: [other('Hərf-hərf de.', ex('Z, A, G.', 'İngiliscə Z “zi”, A “ey”, G “ci” oxunur.', 'Z — zi; G — ci.', 'Z, A, G.'))],
      },
    },
    {
      type: 'choice', id: 'u2d3a_c11', number: 11, title: 'Səhnədə tap', why: 'D — “di”.', hint: 'Üç hərf eyni səslə bitir — ilk səsə qulaq as.', scenes: ['u2/airport-gates'],
      prompt: 'Hava limanında üç qapı var. Elan sənin qapını deyir.\nŞəkildə həmin qapını tap.', audio: 'D, five.',
      spots: [{ option: 'D5 qapısı', x: 20, y: 40 }, { option: 'B5 qapısı', x: 50, y: 40 }, { option: 'T5 qapısı', x: 80, y: 40 }],
      options: ['D5 qapısı', 'B5 qapısı', 'T5 qapısı'], answer: 'D5 qapısı',
      variants: [
        pick('B5 qapısı', 'B — “bi”, səsdə “di” var.', ex('D5 qapısı', 'Səsdə “di” deyilir — bu, D-dir.', 'B — bi; D — di.', 'D, five.')),
        pick('T5 qapısı', 'T — “ti”, səsdə “di” var.', ex('D5 qapısı', 'Səsdə “di” deyilir — bu, D-dir.', 'T — ti; D — di.', 'D, five.')),
      ],
      review: {
        title: 'Səhnədə tap', why: 'Z — “zi”.', hint: 'Üç hərf eyni səslə bitir — ilk səsə qulaq as.', scenes: ['u2/airport-gates-2'],
        prompt: 'Başqa terminaldasan. Elan sənin qapını deyir.\nŞəkildə həmin qapını tap.', audio: 'Z, three.',
        spots: [{ option: 'C3 qapısı', x: 22, y: 42 }, { option: 'G3 qapısı', x: 52, y: 40 }, { option: 'Z3 qapısı', x: 80, y: 42 }],
        options: ['C3 qapısı', 'G3 qapısı', 'Z3 qapısı'], answer: 'Z3 qapısı',
        variants: [
          pick('C3 qapısı', 'C — “si”, səsdə “zi” var.', ex('Z3 qapısı', 'Səsdə “zi” deyilir — bu, Z-dir.', 'C — si; Z — zi.', 'Z, three.')),
          pick('G3 qapısı', 'G — “ci”, səsdə “zi” var.', ex('Z3 qapısı', 'Səsdə “zi” deyilir — bu, Z-dir.', 'G — ci; Z — zi.', 'Z, three.')),
        ],
      },
    },
    {
      type: 'write', id: 'u2d3a_c12', number: 12, title: 'Dinlə və yaz', why: '10 KB 205 — rəqəm, iki hərf, rəqəmlər.', hint: 'Əvvəl rəqəm, sonra iki hərf, sonra yenə rəqəmlər gəlir.',
      prompt: 'Taksi çağırdın. Dispetçer maşının nömrəsini deyir.\nNömrəni yaz.', audio: 'Ten, K, B, two, zero, five.', placeholder: 'Maşının nömrəsi',
      rule: plate('10 KB 205', '10-KB-205', '10KB205', '10 KB205', '10KB 205', '10-KB 205', '10 KB-205'),
      variants: [other('Hərfləri və rəqəmləri yoxla.', ex('10 KB 205', 'Səsdə ten, K, B, two, zero, five deyilir.', 'B — bi; P — pi.', 'Ten, K, B, two, zero, five.'))],
      review: {
        title: 'Dinlə və yaz', why: '10 HE 401 — rəqəm, iki hərf, rəqəmlər.', hint: 'Əvvəl rəqəm, sonra iki hərf, sonra yenə rəqəmlər gəlir.',
        prompt: 'Otelin qarşısında taksi gözləyirsən. Resepsiya maşının nömrəsini deyir.\nNömrəni yaz.', audio: 'Ten, H, E, four, zero, one.', placeholder: 'Maşının nömrəsi',
        rule: plate('10 HE 401', '10-HE-401', '10HE401', '10 HE401', '10HE 401', '10-HE 401', '10 HE-401'),
        variants: [other('Hərfləri və rəqəmləri yoxla.', ex('10 HE 401', 'Səsdə ten, H, E, four, zero, one deyilir; E “i” oxunur.', 'H — eyç; E — i.', 'Ten, H, E, four, zero, one.'))],
      },
    },
    {
      type: 'choice', id: 'u2d3a_c13', number: 13, title: 'Sözü tamamla', why: 'Is that right? — düzdür?', hint: 'Dərs 2-də nömrəni yoxlayanda hansı sual verilirdi?',
      prompt: 'Qız elanda kodu eşidib təkrar edir və yoxlayır.\nHansı söz çatmır?', gap: { speaker: 'G', before: 'K, B, P. Is that', after: '?' },
      options: ['right', 'well', 'name'], answer: 'right',
      variants: [
        pick('well', '“well” halı bildirir.', ex('right', '“well” halı bildirir; yoxlayanda “right” deyilir.', "Is that right? — düzdür?; I'm not very well. — hal.", 'K, B, P. Is that right?')),
        pick('name', '“name” addır.', ex('right', '“name” ad deməkdir; yoxlayanda “right” deyilir.', "Is that right? — düzdür?; What's your name? — ad.", 'K, B, P. Is that right?')),
      ],
      review: {
        title: 'Sözü tamamla', why: "Yes, that's right. — bəli, düzdür.", hint: 'Dərs 2-də nömrə düz olanda necə təsdiq edirdin?',
        prompt: 'Oğlan qızın təkrar etdiyi kodu təsdiqləyir.\nHansı söz çatmır?', gap: { speaker: 'B', before: "Yes, that's", after: '.' },
        options: ['name', 'right', 'please'], answer: 'right',
        variants: [
          pick('name', '“name” addır.', ex('right', 'Təsdiq edəndə “that’s right” deyilir.', "Yes, that's right. — təsdiq; My name is … — ad.", "K, B, P? — Yes, that's right.")),
          pick('please', '“please” xahişdir.', ex('right', 'Burada xahiş yox, təsdiq lazımdır.', "Yes, that's right. — təsdiq; Slowly, please. — xahiş.", "Yes, that's right.")),
        ],
      },
    },
  ],
  result: {
    done: ['Dərs 3 · 1-ci hissə tamamlandı', 'Artıq A H J K, B C D, P T V Z, E G hərflərini tanıyır və kodu hərf-hərf deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Eşitdiyin hərfi tanımaq', tasks: ['u2d3a_c05', 'u2d3a_c07', 'u2d3a_c09', 'u2d3a_c11', 'u2d3a_c13'] },
      { group: 'Yazı', text: 'Maşın nömrəsini eşidib yazmaq', tasks: ['u2d3a_c12'] },
      { group: 'Danışıq', text: 'Kodu hərf-hərf demək', tasks: ['u2d3a_c03', 'u2d3a_c10'] },
    ],
    closing: 'Növbəti hissə — qalan hərflər: F L M N S X, I Y, O, Q U W, R.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'A, H, J, K', translation: 'ey, eyç, cey, key', example: 'A, H, J, K.', exampleAz: 'ey, eyç, cey, key', usageNote: 'Hamısı “ey” ilə bitir.', pronunciation: '/eɪ/ · /eɪtʃ/ · /dʒeɪ/ · /keɪ/', teachCard: 'u2d3a_c02' },
    { word: 'B, C, D', translation: 'bi, si, di', example: 'B, C, D.', exampleAz: 'bi, si, di', usageNote: 'C — “si”.', pronunciation: '/bi/ · /si/ · /di/', teachCard: 'u2d3a_c04' },
    { word: 'P, T, V, Z', translation: 'pi, ti, vi, zi', example: 'P, T, V, Z.', exampleAz: 'pi, ti, vi, zi', usageNote: 'Z — “zi”.', pronunciation: '/pi/ · /ti/ · /vi/ · /zi/', teachCard: 'u2d3a_c06' },
    { word: 'E, G', translation: 'i, ci', example: 'E, G.', exampleAz: 'i, ci', usageNote: 'E — “i”, G — “ci”.', pronunciation: '/i/ · /dʒi/', teachCard: 'u2d3a_c08' },
  ],
};
