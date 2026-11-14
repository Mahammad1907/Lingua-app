// Bölmə 2 · Dərs 3 · 2-ci hissə — Hərflər: R, “e” (F L M N S X), “ay” (I Y), O, “yu” (Q U W).
// Hava limanı (şəhər kodları, tablo, qapı). Spiral: 1-ci hissənin hərfləri, telefon nömrəsi (Dərs 2).
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, own, PHONE, PHONE_MISTAKES, resultTexts, said, spelled } from './shared';

const myNumber = own(PHONE, "It's 050 321 45 67.");

export const lesson3b: DesignLesson = {
  id: 'a1_en_b2_d3b', order: 14, unit: 2, number: 3, part: 2, title: 'Hərflər 2', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d3b_c01', badge: 'Şəxsi məlumat', subtitle: 'Maşın nömrələri, hava limanı və qatar — qalan hərfləri də tanıyırsan.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'R, F L M N S X, I Y, O, Q U W hərflərini eşidib tanıyıram.' },
        { icon: 'wave', text: 'Şəhər kodunu hərf-hərf deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u2d3b_c02', number: 2, scenes: ['u2/word-letter-r'],
      word: 'R', pronunciation: '/ɑr/', reading: 'ar', az: '“ar” oxunan hərf',
      notes: ['R — “ar”, “er” yox.'],
      example: 'A, R.', exampleAz: 'ey, ar',
    },
    {
      type: 'write', id: 'u2d3b_c03', number: 3, title: 'Dinlə və yaz', why: '10 RH 302 — rəqəm, iki hərf, rəqəmlər.', hint: 'Əvvəl rəqəm, sonra iki hərf, sonra yenə rəqəmlər gəlir.',
      prompt: 'Taksi çağırdın. Dispetçer maşının nömrəsini deyir.\nNömrəni yaz.', audio: 'Ten, R, H, three, zero, two.', placeholder: 'Maşının nömrəsi',
      rule: exact('10 RH 302', '10-RH-302', '10RH302', '10 RH302', '10RH 302', '10-RH 302', '10 RH-302'),
      variants: [other('Hərfləri və rəqəmləri yoxla.', ex('10 RH 302', 'Səsdə ten, R, H, three, zero, two deyilir; R “ar” oxunur.', 'R — ar; H — eyç.', 'Ten, R, H, three, zero, two.'))],
      review: {
        title: 'Dinlə və yaz', why: '10 AR 551 — rəqəm, iki hərf, rəqəmlər.', hint: 'Əvvəl rəqəm, sonra iki hərf, sonra yenə rəqəmlər gəlir.',
        prompt: 'Kursun qarşısında taksi gözləyirsən. Dostun maşının nömrəsini deyir.\nNömrəni yaz.', audio: 'Ten, A, R, five, five, one.', placeholder: 'Maşının nömrəsi',
        rule: exact('10 AR 551', '10-AR-551', '10AR551', '10 AR551', '10AR 551', '10-AR 551', '10 AR-551'),
        variants: [other('Hərfləri və rəqəmləri yoxla.', ex('10 AR 551', 'Səsdə ten, A, R deyilir: A “ey”, R “ar”.', 'A — ey; R — ar.', 'Ten, A, R, five, five, one.'))],
      },
    },
    {
      type: 'word', id: 'u2d3b_c04', number: 4, scenes: ['u2/word-letters-e'],
      word: 'F, L, M, N, S, X', pronunciation: '/ef/ · /el/ · /em/ · /en/ · /es/ · /eks/', reading: 'ef, el, em, en, es, eks', az: '“e” ilə başlayan hərflər',
      notes: ['Hamısı “e” ilə başlayır: X — “eks”.'],
      example: 'F, L, M, N, S, X.', exampleAz: 'ef, el, em, en, es, eks',
    },
    {
      type: 'write', id: 'u2d3b_c05', number: 5, letters: ['H', 'R', 'L', 'A', 'E', 'M'], title: 'Hərfləri tut', why: 'L-H-R — London hava limanının kodu.', hint: 'Hər hərfi eşidən kimi toxun; “ar” səsi hansı hərfdir — kartı xatırla.',
      prompt: 'Hava limanında London uçuşu elan olunur. Elan hava limanının kodunu deyir.\nEşitdiyin hərflərə toxun.', audio: 'L, H, R.', placeholder: 'Şəhər kodu',
      rule: exact('LHR'),
      variants: [other('Hərfləri bir-bir dinlə.', ex('LHR', 'Səsdə “el, eyç, ar” deyilir.', 'R — ar; H — eyç.', 'L, H, R.'))],
      review: {
        letters: ['X', 'B', 'D', 'S', 'P', 'T'], title: 'Hərfləri tut', why: 'D-X-B — Dubay hava limanının kodu.', hint: 'Hər hərfi eşidən kimi toxun; “es” və “eks” fərqinə qulaq as.',
        prompt: 'Dubay uçuşu elan olunur.\nEşitdiyin hərflərə toxun.', audio: 'D, X, B.', placeholder: 'Şəhər kodu',
        rule: exact('DXB'),
        variants: [other('Hərfləri bir-bir dinlə.', ex('DXB', 'Səsdə D, X, B deyilir: “di”, “eks”, “bi”.', 'X — eks; S — es.', 'D, X, B.'))],
      },
    },
    {
      type: 'word', id: 'u2d3b_c06', number: 6, scenes: ['u2/word-letters-iy'],
      word: 'I, Y', pronunciation: '/aɪ/ · /waɪ/', reading: 'ay, uay', az: '“ay” ilə bitən hərflər',
      notes: ['I — “ay”; Y — “uay”, “ye” yox.'],
      example: 'I, Y.', exampleAz: 'ay, uay',
    },
    {
      type: 'match', id: 'u2d3b_c07', number: 7, title: 'Hərfi oxunuşuna qoş', why: 'Hər hərfin ingiliscə adını tapdın.', hint: 'Azərbaycan əlifbasındakı oxunuşa aldanma.',
      prompt: 'Maşın nömrələrində hərflər var.\nHər hərfə onun ingiliscə oxunuşunu qoş.',
      rows: [{ en: 'F', az: 'ef' }, { en: 'X', az: 'eks' }, { en: 'Y', az: 'uay' }],
      extra: ['ye'],
      variants: [other('Bir hərfin oxunuşu yerində deyil.', ex('F — ef; X — eks; Y — uay', 'İngiliscə X “eks”, Y “uay” oxunur.', 'X — eks; Y — uay.', 'F, L, M, N, S, X.'))],
      review: {
        title: 'Hərfi oxunuşuna qoş', why: 'Hər hərfin ingiliscə adını tapdın.', hint: 'Əvvəl ən əmin olduğun hərfi yerinə qoy.',
        prompt: 'Tabloda hərflər var.\nHər hərfə onun ingiliscə oxunuşunu qoş.',
        rows: [{ en: 'W', az: 'dabəlyu' }, { en: 'R', az: 'ar' }, { en: 'I', az: 'ay' }],
        extra: ['ve'],
        variants: [other('Bir hərfin oxunuşu yerində deyil.', ex('W — dabəlyu; R — ar; I — ay', 'İngiliscə W “dabəlyu”, R “ar”, I “ay” oxunur.', 'W — dabəlyu; V — vi.', 'Q, U, W.'))],
      },
    },
    {
      type: 'word', id: 'u2d3b_c08', number: 8, scenes: ['u2/word-letter-o'],
      word: 'O', pronunciation: '/oʊ/', reading: 'ou', az: '“ou” oxunan hərf',
      notes: ['Nömrədəki “oh” da belə səslənir.'],
      example: 'OK — O, K.', exampleAz: 'OK — ou, key.',
    },
    {
      type: 'choice', id: 'u2d3b_c09', number: 9, title: 'Dinlə və seç', why: 'I — “ay”.', hint: 'Səsi diqqətlə dinlə: “i”, “ay” və “uay” fərqlidir.',
      prompt: 'Konsertdəsən. Qapıdakı işçi biletinə baxıb sıranın hərfini deyir.\nHansı hərfdir?', audio: 'I.',
      options: ['I', 'E', 'Y'], answer: 'I',
      variants: [
        pick('E', 'E “i” oxunur, səsdə “ay” var.', ex('I', 'Səsdəki “ay” — I-dir; E “i” oxunur.', 'I — ay; E — i.', 'I, Y.')),
        pick('Y', 'Y “uay” oxunur, əvvəlində “u” var.', ex('I', 'Səsdə yalnız “ay” var — bu, I-dir.', 'I — ay; Y — uay.', 'I, Y.')),
      ],
      review: {
        title: 'Dinlə və seç', why: 'O — “ou”.', hint: 'Səsi diqqətlə dinlə: “ou”, “ey” və “yu” fərqlidir.',
        prompt: 'Qatar stansiyasında platformanın hərfi elan olunur.\nHansı hərfdir?', audio: 'O.',
        options: ['A', 'O', 'U'], answer: 'O',
        variants: [
          pick('A', 'A “ey” oxunur, səsdə “ou” var.', ex('O', 'Səsdəki “ou” — O-dur; A “ey” oxunur.', 'O — ou; A — ey.', 'O, K.')),
          pick('U', 'U “yu” oxunur, səsdə “ou” var.', ex('O', 'Səsdəki “ou” — O-dur; U “yu” oxunur.', 'O — ou; U — yu.', 'O, K.')),
        ],
      },
    },
    {
      type: 'word', id: 'u2d3b_c10', number: 10, scenes: ['u2/word-letters-yu'],
      word: 'Q, U, W', pronunciation: '/kju/ · /ju/ · /ˈdʌbəlju/', reading: 'kyu, yu, dabəlyu', az: '“yu” ilə bitən hərflər',
      notes: ['W — “dabəlyu”, “ve” yox.'],
      example: 'Q, U, W.', exampleAz: 'kyu, yu, dabəlyu',
    },
    {
      type: 'voice', id: 'u2d3b_c11', number: 11, title: 'Dinlə və təkrarla', why: 'Hərfləri dedin; W — “dabəlyu”.', hint: 'Üç hərfin üçü də eyni “yu” səsi ilə bitir.',
      prompt: 'Qatar biletində vaqonların hərfləri var.\nDinlə, sonra eyni cür de.', audio: 'Q, U, W.', repeat: { stress: 'W', note: 'W üç hecadır: da-bəl-yu.', reading: 'kyu, yu, dabəlyu' },
      rule: exact('Q, U, W.', 'QUW'),
      variants: [other('Bir daha dinlə və yavaş de.', ex('Q, U, W.', 'İngiliscə W “ve” yox, “dabəlyu” oxunur.', 'W — dabəlyu; V — vi.', 'Q, U, W.'))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Hərfləri dedin; R — “ar”.', hint: 'Azərbaycan əlifbasındakı oxunuşa aldanma.',
        prompt: 'Taksinin nömrəsində iki hərf var.\nDinlə, sonra eyni cür de.', audio: 'H, R.', repeat: { stress: 'R', note: 'H — “eyç”, R — “ar”.', reading: 'eyç, ar' },
        rule: exact('H, R.', 'HR'),
        variants: [other('Bir daha dinlə və yavaş de.', ex('H, R.', 'İngiliscə H “aş” yox, “eyç”; R “er” yox, “ar” oxunur.', 'H — eyç; R — ar.', 'H, R.'))],
      },
    },
    {
      type: 'voice', id: 'u2d3b_c12', number: 12, title: 'Kodu de', why: 'Kodu ingiliscə hərf-hərf dedin.', hint: 'Hər hərfi ayrıca de; W “ve” deyil.',
      prompt: 'Hava limanında dostun soruşur hansı uçuşa minirsən. Biletində “WAW” yazılıb (Varşava).\nKodu hərf-hərf de.',
      rule: said(spelled('WAW'), 'W, A, W.'),
      variants: [other('Hərf-hərf de.', ex('W, A, W.', 'İngiliscə W “dabəlyu”, A “ey” oxunur.', 'W — dabəlyu; V — vi.', 'W, A, W.'))],
      review: {
        title: 'Kodu de', why: 'Kodu ingiliscə hərf-hərf dedin.', hint: 'Hər hərfi ayrıca de; ilk hərf “je” deyil.',
        prompt: 'Taksi sürücüsü soruşur hansı uçuşdur. Biletində “JFK” yazılıb (Nyu-York).\nKodu hərf-hərf de.',
        rule: said(spelled('JFK'), 'J, F, K.'),
        variants: [other('Hərf-hərf de.', ex('J, F, K.', 'İngiliscə J “cey”, F “ef”, K “key” oxunur.', 'J — cey; G — ci.', 'J, F, K.'))],
      },
    },
    {
      type: 'write', id: 'u2d3b_c13', number: 13, title: 'Mesaj yaz', why: 'Nömrəni yazdın.', hint: 'Dərs 2-dəki kimi: qısa söz, sonra rəqəmlər.',
      prompt: 'Kursun qrup çatında nömrələr görünmür. Yeni yoldaş sənin nömrəni istəyir.\nÖz nömrəni yaz (istəsən, uydurma).', placeholder: 'Cavabını yaz',
      chat: { partner: 'Kursun qrup çatı', from: 'B', lines: [{ from: 'B', text: "Hi! What's your phone number?" }] }, rule: myNumber,
      variants: [...PHONE_MISTAKES, other("It's + nömrə.", ex("It's 050 321 45 67.", 'Nömrəni “It’s” ilə başla, sonra rəqəmləri yaz.', "It's 050… — nömrə; My phone… — telefonun özü.", "What's your phone number? — It's 050 321 45 67."))],
      review: {
        title: 'Mesaj yaz', why: 'Nömrəni yazdın.', hint: 'Dərs 2-dəki kimi: qısa söz, sonra rəqəmlər.',
        prompt: 'İdman zalının qrup çatında nömrələr görünmür. Məşqçi sənin nömrəni istəyir.\nÖz nömrəni yaz (istəsən, uydurma).', placeholder: 'Cavabını yaz',
        chat: { partner: 'Zalın qrup çatı', from: 'G', lines: [{ from: 'G', text: "Hello! What's your phone number?" }] }, rule: myNumber,
        variants: [...PHONE_MISTAKES, other("It's + nömrə.", ex("It's 050 321 45 67.", 'Nömrəni “It’s” ilə başla, sonra rəqəmləri yaz.', "It's 050… — nömrə; My phone… — telefonun özü.", "It's 050 321 45 67."))],
      },
    },
    {
      type: 'choice', id: 'u2d3b_c14', number: 14, title: 'Səhnədə tap', why: 'G-Y-D — Bakı.', hint: 'Üç hərfin hər birinə ayrıca qulaq as.', scenes: ['u2/airport-board'],
      prompt: 'Tabloda üç uçuş var. Elan birini deyir.\nŞəkildə həmin uçuşu tap.', audio: 'G, Y, D.',
      spots: [{ option: 'JFK — Nyu-York', x: 50, y: 28 }, { option: 'GYD — Bakı', x: 50, y: 50 }, { option: 'IST — İstanbul', x: 50, y: 72 }],
      options: ['JFK — Nyu-York', 'GYD — Bakı', 'IST — İstanbul'], answer: 'GYD — Bakı',
      variants: [
        pick('JFK — Nyu-York', 'Səsdə “cey, ef, key” yoxdur.', ex('GYD — Bakı', 'Səsdə “ci, uay, di” deyilir.', 'G — ci; J — cey.', 'G, Y, D.')),
        pick('IST — İstanbul', 'Səsdə “ay, es, ti” yoxdur.', ex('GYD — Bakı', 'Səsdə “ci, uay, di” deyilir.', 'Y — uay; I — ay.', 'G, Y, D.')),
      ],
      review: {
        title: 'Səhnədə tap', why: 'D-O-H — Doha.', hint: 'Ortadakı hərfə xüsusi qulaq as.', scenes: ['u2/airport-board-2'],
        prompt: 'Başqa tabloda üç uçuş var. Elan birini deyir.\nŞəkildə həmin uçuşu tap.', audio: 'D, O, H.',
        spots: [{ option: 'DOH — Doha', x: 50, y: 28 }, { option: 'IST — İstanbul', x: 50, y: 50 }, { option: 'LHR — London', x: 50, y: 72 }],
        options: ['DOH — Doha', 'IST — İstanbul', 'LHR — London'], answer: 'DOH — Doha',
        variants: [
          pick('IST — İstanbul', 'Səsdə “ay, es, ti” yoxdur.', ex('DOH — Doha', 'Səsdə “di, ou, eyç” deyilir.', 'O — ou; I — ay.', 'D, O, H.')),
          pick('LHR — London', 'Səsdə “el, eyç, ar” yoxdur.', ex('DOH — Doha', 'Səsdə “di, ou, eyç” deyilir.', 'D — di; L — el.', 'D, O, H.')),
        ],
      },
    },
  ],
  result: {
    done: ['Dərs 3 · 2-ci hissə tamamlandı', 'Artıq bütün hərfləri tanıyırsan və şəhər kodunu hərf-hərf deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Eşitdiyin hərfi və kodu tanımaq', tasks: ['u2d3b_c05', 'u2d3b_c07', 'u2d3b_c09', 'u2d3b_c14'] },
      { group: 'Yazı', text: 'Maşın nömrəsini və öz nömrəni yazmaq', tasks: ['u2d3b_c03', 'u2d3b_c13'] },
      { group: 'Danışıq', text: 'Hərfləri və kodu hərf-hərf demək', tasks: ['u2d3b_c11', 'u2d3b_c12'] },
    ],
    closing: 'Növbəti dərs — hərf-hərf de: oteldə adını və şəhərini.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'F, L, M, N, S, X', translation: 'ef, el, em, en, es, eks', example: 'F, L, M, N, S, X.', exampleAz: 'ef, el, em, en, es, eks', usageNote: 'Hamısı “e” ilə başlayır.', pronunciation: '/ef/ · /el/ · /em/ · /en/ · /es/ · /eks/', teachCard: 'u2d3b_c04' },
    { word: 'I, Y', translation: 'ay, uay', example: 'I, Y.', exampleAz: 'ay, uay', usageNote: 'Y — “uay”.', pronunciation: '/aɪ/ · /waɪ/', teachCard: 'u2d3b_c06' },
    { word: 'O', translation: 'ou', example: 'OK — O, K.', exampleAz: 'OK — ou, key.', usageNote: 'Nömrədəki “oh” kimi.', pronunciation: '/oʊ/', teachCard: 'u2d3b_c08' },
    { word: 'Q, U, W', translation: 'kyu, yu, dabəlyu', example: 'Q, U, W.', exampleAz: 'kyu, yu, dabəlyu', usageNote: 'W — “dabəlyu”.', pronunciation: '/kju/ · /ju/ · /ˈdʌbəlju/', teachCard: 'u2d3b_c10' },
    { word: 'R', translation: 'ar', example: 'A, R.', exampleAz: 'ey, ar', usageNote: 'R — “ar”.', pronunciation: '/ɑr/', teachCard: 'u2d3b_c02' },
  ],
};
