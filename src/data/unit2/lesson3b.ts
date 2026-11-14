// Bölmə 2 · Dərs 3 · 2-ci hissə — Hərflər: “e” (F L M N S X), “ay” (I Y), O, “yu” (Q U W), R.
// Hava limanı (şəhər kodları, tablo, qapı). Spiral: 1-ci hissənin hərfləri, telefon nömrəsi (Dərs 2).
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, own, PHONE, resultTexts, said, spelled } from './shared';

const myNumber = own(PHONE, "It's 050 321 45 67.");

export const lesson3b: DesignLesson = {
  id: 'a1_en_b2_d3b', order: 14, unit: 2, number: 3, part: 2, title: 'Hərflər 2', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d3b_c01', badge: 'Şəxsi məlumat', subtitle: 'Hava limanında qalan hərfləri də tanıyırsan.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'F L M N S X, I Y, O, Q U W, R hərflərini eşidib tanıyıram.' },
        { icon: 'wave', text: 'Şəhər kodunu hərf-hərf deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u2d3b_c10', number: 10, scenes: ['u2/word-letter-r'],
      word: 'R', pronunciation: '/ɑr/', reading: 'ar', az: '“ar” oxunan hərf',
      notes: ['R — “ar”, “er” yox.'],
      example: 'A, R.', exampleAz: 'ey, ar',
    },
    {
      type: 'voice', id: 'u2d3b_c09', number: 9, title: 'Dinlə və təkrarla', why: 'Hərfləri ingiliscə dedin.', hint: 'Azərbaycan əlifbasındakı oxunuşa aldanma.',
      prompt: 'Taksinin nömrəsində iki hərf var.\nDinlə, sonra eyni cür de.', audio: 'H, R.', repeat: { stress: 'R', note: 'H — “eyç”, R — “ar”.', reading: 'eyç, ar' },
      rule: exact('H, R.', 'HR'),
      variants: [other('Bir daha dinlə və yavaş de.', ex('H, R.', 'İngiliscə H “aş” yox, “eyç”; R “er” yox, “ar” oxunur.', 'H — eyç; R — ar.', 'H, R.'))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Hərfləri ingiliscə dedin.', hint: 'Üç hərfin üçü də eyni “yu” səsi ilə bitir.',
        prompt: 'Tabloda üç hərf yanır.\nDinlə, sonra eyni cür de.', audio: 'Q, U, W.', repeat: { stress: 'W', note: 'W üç hecadır: da-bəl-yu.', reading: 'kyu, yu, dabəlyu' },
        rule: exact('Q, U, W.', 'QUW'),
        variants: [other('Bir daha dinlə və yavaş de.', ex('Q, U, W.', 'İngiliscə W “ve” yox, “dabəlyu” oxunur.', 'W — dabəlyu; V — vi.', 'Q, U, W.'))],
      },
    },
    {
      type: 'word', id: 'u2d3b_c02', number: 2, scenes: ['u2/word-letters-e'],
      word: 'F, L, M, N, S, X', pronunciation: '/ef/ · /el/ · /em/ · /en/ · /es/ · /eks/', reading: 'ef, el, em, en, es, eks', az: '“e” ilə başlayan hərflər',
      notes: ['Hamısı “e” ilə başlayır: X — “eks”.'],
      example: 'F, L, M, N, S, X.', exampleAz: 'ef, el, em, en, es, eks',
    },
    {
      type: 'match', id: 'u2d3b_c03', number: 3, title: 'Hərfi oxunuşuna qoş', why: 'Hər hərfin ingiliscə adını tapdın.', hint: 'Bu qrupdakı hərflərin hamısı eyni səslə başlayır.',
      prompt: 'Tabloda hərflər var.\nHər hərfə onun ingiliscə oxunuşunu qoş.',
      rows: [{ en: 'F', az: 'ef' }, { en: 'X', az: 'eks' }, { en: 'S', az: 'es' }],
      extra: ['iks'],
      variants: [other('Bir hərfin oxunuşu yerində deyil.', ex('F — ef; X — eks; S — es', 'Bu hərflərin hamısı “e” ilə başlayır.', 'X — eks; S — es.', 'F, L, M, N, S, X.'))],
      review: {
        title: 'Hərfi oxunuşuna qoş', why: 'Hər hərfin ingiliscə adını tapdın.', hint: 'Əvvəl ən əmin olduğun hərfi yerinə qoy.',
        prompt: 'Maşın nömrələrində hərflər var.\nHər hərfə onun ingiliscə oxunuşunu qoş.',
        rows: [{ en: 'W', az: 'dabəlyu' }, { en: 'R', az: 'ar' }, { en: 'Y', az: 'uay' }],
        extra: ['ve'],
        variants: [other('Bir hərfin oxunuşu yerində deyil.', ex('W — dabəlyu; R — ar; Y — uay', 'İngiliscə W “dabəlyu”, R “ar”, Y “uay” oxunur.', 'W — dabəlyu; V — vi.', 'Q, U, W.'))],
      },
    },
    {
      type: 'word', id: 'u2d3b_c04', number: 4, scenes: ['u2/word-letters-iy'],
      word: 'I, Y', pronunciation: '/aɪ/ · /waɪ/', reading: 'ay, uay', az: '“ay” ilə bitən hərflər',
      notes: ['I — “ay”; Y — “uay”, “ye” yox.'],
      example: 'I, Y.', exampleAz: 'ay, uay',
    },
    {
      type: 'write', id: 'u2d3b_c05', number: 5, letters: ['Y', 'D', 'G', 'J', 'I', 'T'], title: 'Hərfləri tut', why: 'G-Y-D — Bakı hava limanının kodu.', hint: 'Hər hərfi eşidən kimi toxun; Azərbaycan əlifbasındakı oxunuşa aldanma.',
      prompt: 'Bakı uçuşu elan olunur. Elan hava limanının kodunu deyir.\nEşitdiyin hərflərə toxun.', audio: 'G, Y, D.', placeholder: 'Şəhər kodu',
      rule: exact('GYD'),
      variants: [other('Hərfləri bir-bir dinlə.', ex('GYD', 'Səsdə G, Y, D deyilir: “ci”, “uay”, “di”.', 'G — ci; Y — uay.', 'G, Y, D.'))],
      review: {
        letters: ['X', 'B', 'D', 'S', 'P', 'T'], title: 'Hərfləri tut', why: 'D-X-B — Dubay hava limanının kodu.', hint: 'Hər hərfi eşidən kimi toxun; “es” və “eks” fərqinə qulaq as.',
        prompt: 'Dubay uçuşu elan olunur.\nEşitdiyin hərflərə toxun.', audio: 'D, X, B.', placeholder: 'Şəhər kodu',
        rule: exact('DXB'),
        variants: [other('Hərfləri bir-bir dinlə.', ex('DXB', 'Səsdə D, X, B deyilir: “di”, “eks”, “bi”.', 'X — eks; S — es.', 'D, X, B.'))],
      },
    },
    {
      type: 'word', id: 'u2d3b_c06', number: 6, scenes: ['u2/word-letter-o'],
      word: 'O', pronunciation: '/oʊ/', reading: 'ou', az: '“ou” oxunan hərf',
      notes: ['Nömrədəki “oh” da belə səslənir.'],
      example: 'OK — O, K.', exampleAz: 'OK — ou, key.',
    },
    {
      type: 'choice', id: 'u2d3b_c07', number: 7, title: 'Dinlə və seç', why: 'I — “ay”.', hint: 'Səsi diqqətlə dinlə: “i”, “ay” və “uay” fərqlidir.',
      prompt: 'Tabloda qapı hərfi dəyişdi. Elan yeni qapını deyir.\nHansı hərf deyilir?', audio: 'I.',
      options: ['I', 'E', 'Y'], answer: 'I',
      variants: [
        pick('E', 'E “i” oxunur, səsdə “ay” var.', ex('I', 'Səsdəki “ay” — I-dir; E “i” oxunur.', 'I — ay; E — i.', 'I, Y.')),
        pick('Y', 'Y “uay” oxunur, əvvəlində “u” var.', ex('I', 'Səsdə yalnız “ay” var — bu, I-dir.', 'I — ay; Y — uay.', 'I, Y.')),
      ],
      review: {
        title: 'Dinlə və seç', why: 'O — “ou”.', hint: 'Səsi diqqətlə dinlə: “ou”, “ey” və “yu” fərqlidir.',
        prompt: 'Qatar stansiyasında platforma hərfi elan olunur.\nHansı hərf deyilir?', audio: 'O.',
        options: ['A', 'O', 'U'], answer: 'O',
        variants: [
          pick('A', 'A “ey” oxunur, səsdə “ou” var.', ex('O', 'Səsdəki “ou” — O-dur; A “ey” oxunur.', 'O — ou; A — ey.', 'O, K.')),
          pick('U', 'U “yu” oxunur, səsdə “ou” var.', ex('O', 'Səsdəki “ou” — O-dur; U “yu” oxunur.', 'O — ou; U — yu.', 'O, K.')),
        ],
      },
    },
    {
      type: 'word', id: 'u2d3b_c08', number: 8, scenes: ['u2/word-letters-yu'],
      word: 'Q, U, W', pronunciation: '/kju/ · /ju/ · /ˈdʌbəlju/', reading: 'kyu, yu, dabəlyu', az: '“yu” ilə bitən hərflər',
      notes: ['W — “dabəlyu”, “ve” yox.'],
      example: 'Q, U, W.', exampleAz: 'kyu, yu, dabəlyu',
    },
    {
      type: 'voice', id: 'u2d3b_c11', number: 11, title: 'Kodu de', why: 'Kodu ingiliscə hərf-hərf dedin.', hint: 'Hər hərfi ayrıca de; son hərf “er” deyil.',
      prompt: 'Hava limanında dostun soruşur hansı uçuşa minirsən. Biletində “LHR” yazılıb (London).\nKodu hərf-hərf de.',
      rule: said(spelled('LHR'), 'L, H, R.'),
      variants: [other('Hərf-hərf de.', ex('L, H, R.', 'İngiliscə H “eyç”, R “ar” oxunur.', 'H — eyç; R — ar.', 'L, H, R.'))],
      review: {
        title: 'Kodu de', why: 'Kodu ingiliscə hərf-hərf dedin.', hint: 'Hər hərfi ayrıca de; ilk hərf “ye” deyil.',
        prompt: 'Taksi sürücüsü soruşur hansı uçuşdur. Biletində “JFK” yazılıb (Nyu-York).\nKodu hərf-hərf de.',
        rule: said(spelled('JFK'), 'J, F, K.'),
        variants: [other('Hərf-hərf de.', ex('J, F, K.', 'İngiliscə J “cey”, F “ef”, K “key” oxunur.', 'J — cey; G — ci.', 'J, F, K.'))],
      },
    },
    {
      type: 'write', id: 'u2d3b_c12', number: 12, title: 'Mesaj yaz', why: 'Nömrəni yazdın.', hint: 'Dərs 2-dəki kimi: qısa söz, sonra rəqəmlər.',
      prompt: 'Uçuşu gözləyərkən biri ilə tanış oldun. O yazır.\nÖz nömrəni yaz (istəsən, uydurma).', placeholder: 'Cavabını yaz',
      chat: { partner: 'Yeni tanış', from: 'B', lines: [{ from: 'B', text: "Hi! What's your phone number?" }] }, rule: myNumber,
      variants: [other("It's + nömrə.", ex("It's 050 321 45 67.", 'Nömrəni “It’s” ilə başla, sonra rəqəmləri yaz.', "It's 050… — nömrə; My phone… — telefonun özü.", "What's your phone number? — It's 050 321 45 67."))],
      review: {
        title: 'Mesaj yaz', why: 'Nömrəni yazdın.', hint: 'Dərs 2-dəki kimi: qısa söz, sonra rəqəmlər.',
        prompt: 'Kursda yeni yoldaş yazır.\nÖz nömrəni yaz (istəsən, uydurma).', placeholder: 'Cavabını yaz',
        chat: { partner: 'Kurs yoldaşı', from: 'G', lines: [{ from: 'G', text: "Hello! What's your phone number?" }] }, rule: myNumber,
        variants: [other("It's + nömrə.", ex("It's 050 321 45 67.", 'Nömrəni “It’s” ilə başla, sonra rəqəmləri yaz.', "It's 050… — nömrə; My phone… — telefonun özü.", "It's 050 321 45 67."))],
      },
    },
    {
      type: 'choice', id: 'u2d3b_c13', number: 13, title: 'Səhnədə tap', why: 'D-O-H — Doha.', hint: 'Üç hərfin hər birinə ayrıca qulaq as.', scenes: ['u2/airport-board'],
      prompt: 'Tabloda üç uçuş var. Elan birini deyir.\nŞəkildə həmin uçuşu tap.', audio: 'D, O, H.',
      spots: [{ option: 'DOH — Doha', x: 50, y: 28 }, { option: 'IST — İstanbul', x: 50, y: 50 }, { option: 'LHR — London', x: 50, y: 72 }],
      options: ['DOH — Doha', 'IST — İstanbul', 'LHR — London'], answer: 'DOH — Doha',
      variants: [
        pick('IST — İstanbul', 'Səsdə “ay, es, ti” yoxdur.', ex('DOH — Doha', 'Səsdə “di, ou, eyç” deyilir.', 'O — ou; I — ay.', 'D, O, H.')),
        pick('LHR — London', 'Səsdə “el, eyç, ar” yoxdur.', ex('DOH — Doha', 'Səsdə “di, ou, eyç” deyilir.', 'D — di; L — el.', 'D, O, H.')),
      ],
      review: {
        title: 'Səhnədə tap', why: 'I-S-T — İstanbul.', hint: 'İlk hərfə qulaq as: “ay”, “cey”, yoxsa “ci”?', scenes: ['u2/airport-board-2'],
        prompt: 'Başqa tabloda üç uçuş var. Elan birini deyir.\nŞəkildə həmin uçuşu tap.', audio: 'I, S, T.',
        spots: [{ option: 'JFK — Nyu-York', x: 50, y: 28 }, { option: 'GYD — Bakı', x: 50, y: 50 }, { option: 'IST — İstanbul', x: 50, y: 72 }],
        options: ['JFK — Nyu-York', 'GYD — Bakı', 'IST — İstanbul'], answer: 'IST — İstanbul',
        variants: [
          pick('JFK — Nyu-York', 'Səsdə “cey, ef, key” yoxdur.', ex('IST — İstanbul', 'Səsdə “ay, es, ti” deyilir.', 'I — ay; J — cey.', 'I, S, T.')),
          pick('GYD — Bakı', 'Səsdə “ci, uay, di” yoxdur.', ex('IST — İstanbul', 'Səsdə “ay, es, ti” deyilir.', 'I — ay; Y — uay.', 'I, S, T.')),
        ],
      },
    },
  ],
  result: {
    done: ['Dərs 3 · 2-ci hissə tamamlandı', 'Artıq bütün hərfləri tanıyır və şəhər kodunu hərf-hərf deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Eşitdiyin hərfi və kodu tanımaq', tasks: ['u2d3b_c03', 'u2d3b_c05', 'u2d3b_c07', 'u2d3b_c13'] },
      { group: 'Yazı', text: 'Öz nömrəni mesajla yazmaq', tasks: ['u2d3b_c12'] },
      { group: 'Danışıq', text: 'Kodu hərf-hərf demək', tasks: ['u2d3b_c09', 'u2d3b_c11'] },
    ],
    closing: 'Növbəti dərs — hərf-hərf de: oteldə adını və şəhərini.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'F, L, M, N, S, X', translation: 'ef, el, em, en, es, eks', example: 'F, L, M, N, S, X.', exampleAz: 'ef, el, em, en, es, eks', usageNote: 'Hamısı “e” ilə başlayır.', pronunciation: '/ef/ · /el/ · /em/ · /en/ · /es/ · /eks/', teachCard: 'u2d3b_c02' },
    { word: 'I, Y', translation: 'ay, uay', example: 'I, Y.', exampleAz: 'ay, uay', usageNote: 'Y — “uay”.', pronunciation: '/aɪ/ · /waɪ/', teachCard: 'u2d3b_c04' },
    { word: 'O', translation: 'ou', example: 'OK — O, K.', exampleAz: 'OK — ou, key.', usageNote: 'Nömrədəki “oh” kimi.', pronunciation: '/oʊ/', teachCard: 'u2d3b_c06' },
    { word: 'Q, U, W', translation: 'kyu, yu, dabəlyu', example: 'Q, U, W.', exampleAz: 'kyu, yu, dabəlyu', usageNote: 'W — “dabəlyu”.', pronunciation: '/kju/ · /ju/ · /ˈdʌbəlju/', teachCard: 'u2d3b_c08' },
    { word: 'R', translation: 'ar', example: 'A, R.', exampleAz: 'ey, ar', usageNote: 'R — “ar”.', pronunciation: '/ɑr/', teachCard: 'u2d3b_c10' },
  ],
};
