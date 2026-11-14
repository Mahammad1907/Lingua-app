// Bölmə 2 · Dərs 4 — Hərf-hərf de (How do you spell it? · It's B-A-K-U. · double · Can you spell it, please?).
// Otel resepsiyası. Personaj adları boşdur: yer adları (Ganja, London, Lankaran…), formadakı soyadlar və öyrənənin öz adı hərf-hərf deyilir.
// Spiral: hərflər (Dərs 3), What's your name?, Hello, Sorry? Slowly, please., Is that right? / Yes, that's right. (Dərs 2).
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, other, pick } from '../unit1/build';
import { NAME_SPELLED, notices, own, resultTexts } from './shared';

const askSpell = goal(['askSpell'], ['Can you spell it, please?', 'How do you spell it?']);
const myName = own(NAME_SPELLED, "It's …");

export const lesson4: DesignLesson = {
  id: 'a1_en_b2_d4', order: 15, unit: 2, number: 4, title: 'Hərf-hərf de', section: 'Şəxsi məlumat',
  notices,
  cards: [
    {
      type: 'intro', id: 'u2d4_c01', badge: 'Şəxsi məlumat', subtitle: 'Otel resepsiyasında adını və şəhərini hərf-hərf deyirsən.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Hərf-hərf deyiləni eşidib yaza bilirəm.' },
        { icon: 'wave', text: 'Adımı hərf-hərf deyir, hərf-hərf deməyi xahiş edə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u2d4_c02', number: 2, scenes: ['u2/word-how-spell'],
      word: 'How do you spell it?', pronunciation: '/haʊ du ju spel ɪt/', reading: 'hau du yu spel it?', az: 'Hərf-hərf necə yazılır?',
      notes: ['spell — hərf-hərf demək.'],
      example: 'Ganja? How do you spell it?', exampleAz: 'Gəncə? Hərf-hərf necə yazılır?',
    },
    {
      type: 'choice', id: 'u2d4_c03', number: 3, title: 'Dinlə və anla', why: '“spell” — hərf-hərf demək.', hint: 'Sualın sonundakı yeni sözə qulaq as.',
      prompt: 'Otel resepsiyasındasan. Şəhərinin adını dedin.\nResepsiyaçı nə istəyir?', audio: 'Ganja? How do you spell it?',
      options: ['Hərf-hərf deməyini istəyir.', 'Şəhərin adını soruşur.', 'Yavaş danışmağını istəyir.'], answer: 'Hərf-hərf deməyini istəyir.',
      variants: [
        pick('Şəhərin adını soruşur.', 'Adı artıq dedin — indi hərfləri istəyir.', ex('Hərf-hərf deməyini istəyir.', 'O, adı təkrar edir və “spell” deyir — hərfləri istəyir.', 'How do you spell it? — hərf-hərf; Slowly, please. — yavaş.', 'Ganja? How do you spell it?')),
        pick('Yavaş danışmağını istəyir.', 'Səsdə “slowly” yoxdur.', ex('Hərf-hərf deməyini istəyir.', 'Səsdə “slowly” yox, “spell” var.', 'How do you spell it? — hərf-hərf; Slowly, please. — yavaş.', 'Ganja? How do you spell it?')),
      ],
      review: {
        title: 'Dinlə və anla', why: '“spell” — hərf-hərf demək.', hint: 'Sualın sonundakı sözlərə qulaq as.',
        prompt: 'İdman zalında qeydiyyatdasan. Soyadını dedin.\nQeydiyyatçı nə istəyir?', audio: 'Sorry? Can you spell it, please?',
        options: ['Soyadını soruşur.', 'Hərf-hərf deməyini istəyir.', 'Təşəkkür edir.'], answer: 'Hərf-hərf deməyini istəyir.',
        variants: [
          pick('Soyadını soruşur.', 'Soyadı artıq dedin — indi hərfləri istəyir.', ex('Hərf-hərf deməyini istəyir.', 'O, “spell” deyir — hərfləri istəyir.', 'Can you spell it, please? — hərf-hərf; Thank you! — təşəkkür.', 'Sorry? Can you spell it, please?')),
          pick('Təşəkkür edir.', 'Səsdə “thank you” yoxdur, “please” xahişdir.', ex('Hərf-hərf deməyini istəyir.', '“please” xahişdir, təşəkkür deyil.', 'Can you spell it, please? — xahiş; Thank you! — təşəkkür.', 'Sorry? Can you spell it, please?')),
        ],
      },
    },
    {
      type: 'word', id: 'u2d4_c04', number: 4, scenes: ['u2/word-its-baku'],
      word: "It's B-A-K-U.", pronunciation: '/ɪts bi eɪ keɪ ju/', reading: 'its bi-ey-key-yu', az: 'Belədir: B-A-K-U.',
      structure: ["It's + hərflər."],
      example: "How do you spell it? — It's B-A-K-U.", exampleAz: 'Hərf-hərf necə yazılır? — B-A-K-U.',
    },
    {
      type: 'write', id: 'u2d4_c05', number: 5, letters: ['G', 'A', 'N', 'J', 'A', 'E', 'Y', 'K'], title: 'Hərfləri tut', why: 'G-A-N-J-A — Gəncə.', hint: 'Hər hərfi eşidən kimi toxun; “ci” və “cey” fərqinə qulaq as.',
      prompt: 'Resepsiyaçı şəhərinin adını hərf-hərf yoxlayır.\nEşitdiyin hərflərə toxun.', audio: "It's G-A-N-J-A.", placeholder: 'Şəhər',
      rule: exact('GANJA'),
      variants: [other('Hərfləri bir-bir dinlə.', ex('GANJA', 'Səsdə G, A, N, J, A deyilir: G “ci”, J “cey”.', 'G — ci; J — cey.', "It's G-A-N-J-A."))],
      review: {
        letters: ['L', 'O', 'N', 'D', 'O', 'N', 'M', 'U', 'A'], title: 'Hərfləri tut', why: 'L-O-N-D-O-N — London.', hint: 'Hər hərfi eşidən kimi toxun; “el” və “en” fərqinə qulaq as.',
        prompt: 'Hava limanında qeydiyyatçı uçuşun şəhərini hərf-hərf deyir.\nEşitdiyin hərflərə toxun.', audio: "It's L-O-N-D-O-N.", placeholder: 'Şəhər',
        rule: exact('LONDON'),
        variants: [other('Hərfləri bir-bir dinlə.', ex('LONDON', 'Səsdə L, O, N, D, O, N deyilir.', 'L — el; N — en.', "It's L-O-N-D-O-N."))],
      },
    },
    {
      type: 'word', id: 'u2d4_c06', number: 6, scenes: ['u2/word-double'],
      word: 'double', pronunciation: '/ˈdʌbəl/', reading: 'dabəl', az: 'qoşa (eyni hərf iki dəfə)',
      structure: ['double L = LL'],
      notes: ['İki eyni hərf yan-yana gələndə “double” deyilir.'],
      example: 'Hello — H-E-double L-O.', exampleAz: 'Hello — H-E-qoşa L-O.',
    },
    {
      type: 'write', id: 'u2d4_c07', number: 7, title: 'Sualı qur', why: 'How-dan sonra “do” gəlir.', hint: 'Azərbaycancada olmayan kiçik bir söz ingiliscə sualda lazımdır.',
      prompt: 'Sən oteldə resepsiyada işləyirsən. Qonaq şəhərini dedi.\nSözlərdən sual qur: hərf-hərf necə yazılır?', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Qonaq', from: 'G', lines: [{ from: 'G', text: 'Lankaran.' }] },
      tiles: ['How', 'you', 'spell', 'it', 'do', 'is', 'your', '?'], rule: exact('How do you spell it?'),
      variants: [other('Sıra: How do you spell it?', ex('How do you spell it?', 'How-dan sonra “do” gəlir, sonra you spell it.', 'How do you spell it? — düzdür; How you spell? — olmur.', 'Ganja? How do you spell it?'))],
      review: {
        title: 'Sualı qur', why: 'How-dan sonra “do” gəlir.', hint: 'Azərbaycancada olmayan kiçik bir söz ingiliscə sualda lazımdır.',
        prompt: 'Kafedə yeni tanış şəhərini dedi.\nSözlərdən sual qur: hərf-hərf necə yazılır?', placeholder: 'Sözlərə toxun',
        chat: { partner: 'Yeni tanış', from: 'B', lines: [{ from: 'B', text: 'Shamakhi.' }] },
        tiles: ['spell', 'How', 'it', 'you', 'do', 'name', 'is', '?'], rule: exact('How do you spell it?'),
        variants: [other('Sıra: How do you spell it?', ex('How do you spell it?', 'How-dan sonra “do” gəlir, sonra you spell it.', 'How do you spell it? — düzdür; How you spell? — olmur.', 'Shamakhi? How do you spell it?'))],
      },
    },
    {
      type: 'word', id: 'u2d4_c08', number: 8, scenes: ['u2/word-can-spell'],
      word: 'Can you spell it, please?', pronunciation: '/kən ju spel ɪt pliz/', reading: 'kən yu spel it, pliz?', az: 'Hərf-hərf deyə bilərsən, zəhmət olmasa?',
      notes: ['Daha nəzakətli xahişdir.'],
      example: 'Lankaran? Can you spell it, please?', exampleAz: 'Lənkəran? Hərf-hərf deyə bilərsən, zəhmət olmasa?',
    },
    {
      type: 'voice', id: 'u2d4_c09', number: 9, title: 'Adını hərf-hərf de', why: 'Adını hərf-hərf dedin.', hint: 'Adının hər hərfini ingiliscə oxunuşla, ayrı-ayrı de.',
      prompt: 'Resepsiyaçı soruşur: “What\'s your name? How do you spell it?”\nAdını hərf-hərf de.', audio: "What's your name? How do you spell it?", reply: 'Thank you!',
      rule: myName,
      variants: [other("It's + hərflər.", ex("It's …", 'Adının hər hərfini ingiliscə ayrıca de.', "It's B-A-K-U. — hərf-hərf; Baku. — bütöv söz.", "It's B-A-K-U."))],
      review: {
        title: 'Adını hərf-hərf de', why: 'Adını hərf-hərf dedin.', hint: 'Adının hər hərfini ingiliscə oxunuşla, ayrı-ayrı de.',
        prompt: 'Kursda müəllim adını siyahıya yazır və soruşur.\nAdını hərf-hərf de.', audio: 'Can you spell it, please?', reply: 'Thanks!',
        rule: myName,
        variants: [other("It's + hərflər.", ex("It's …", 'Adının hər hərfini ingiliscə ayrıca de.', "It's G-A-N-J-A. — hərf-hərf; Ganja. — bütöv söz.", "It's G-A-N-J-A."))],
      },
    },
    {
      type: 'choice', id: 'u2d4_c10', number: 10, title: 'Sözü tamamla', why: 'MM — double M.', hint: 'Eyni hərf yan-yana gəlir — onu necə deyirsən?',
      prompt: 'Resepsiyada oğlan qonağın soyadını hərf-hərf oxuyur: Mammadov.\nHansı söz çatmır?', gap: { speaker: 'B', before: "It's M-A-", after: 'M-A-D-O-V.' },
      options: ['double', 'two', 'again'], answer: 'double',
      variants: [
        pick('two', '“two M” — iki M; hərf-hərf deyəndə “double M” deyilir.', ex('double', 'Azərbaycancada “iki M” deyirik, ingiliscə “double M”.', 'double M — MM; two — 2.', "It's M-A-double M-A-D-O-V.")),
        pick('again', '“again” — bir də; xahişdə işlənir.', ex('double', '“again” təkrar xahişidir; eyni iki hərf “double” ilə deyilir.', 'double M — MM; Again, please. — bir də.', "It's M-A-double M-A-D-O-V.")),
      ],
      review: {
        title: 'Sözü tamamla', why: 'LL — double L.', hint: 'Eyni hərf yan-yana gəlir — onu necə deyirsən?',
        prompt: 'Kursda qız lövhədəki “Hello” sözünü hərf-hərf deyir.\nHansı söz çatmır?', gap: { speaker: 'G', before: 'H-E-', after: 'L-O.' },
        options: ['two', 'double', 'sorry'], answer: 'double',
        variants: [
          pick('two', '“two L” — iki L; hərf-hərf deyəndə “double L” deyilir.', ex('double', 'Azərbaycancada “iki L” deyirik, ingiliscə “double L”.', 'double L — LL; two — 2.', 'H-E-double L-O.')),
          pick('sorry', '“sorry” üzrdür.', ex('double', 'Burada üzr yox, qoşa hərf lazımdır.', 'double L — LL; Sorry! — üzr.', 'H-E-double L-O.')),
        ],
      },
    },
    {
      type: 'write', id: 'u2d4_c11', number: 11, title: 'Dinlə və yaz', why: 'H-A-S-A-N-O-V — Hasanov.', hint: 'Hər hərfi eşidən kimi yaz; “ey” və “i” səslərini qarışdırma.',
      prompt: 'Resepsiyada qonaq soyadını hərf-hərf deyir.\nSoyadı yaz.', audio: "It's H-A-S-A-N-O-V.", placeholder: 'Soyad',
      rule: exact('Hasanov'),
      variants: [other('Hərfləri yoxla.', ex('Hasanov', 'Səsdə H, A, S, A, N, O, V deyilir; A “ey” oxunur.', 'A — ey; E — i.', "It's H-A-S-A-N-O-V."))],
      review: {
        title: 'Dinlə və yaz', why: 'A-double B-A-S-O-V — Abbasov.', hint: 'Hər hərfi eşidən kimi yaz; qoşa hərfə diqqət et.',
        prompt: 'Hava limanında qeydiyyatda sərnişin soyadını hərf-hərf deyir.\nSoyadı yaz.', audio: "It's A-double B-A-S-O-V.", placeholder: 'Soyad',
        rule: exact('Abbasov'),
        variants: [other('Hərfləri yoxla.', ex('Abbasov', '“double B” — iki B yan-yana: BB.', 'double B — BB; double L — LL.', "It's A-double B-A-S-O-V."))],
      },
    },
    {
      type: 'voice', id: 'u2d4_c12', number: 12, title: 'Hərf-hərf soruş', why: 'Hərf-hərf deməyi nəzakətlə xahiş etdin.', hint: 'Bu dərsin nəzakətli xahişini xatırla.',
      prompt: 'Oteldə qonaq şəhərini deyir, sən onu tanımırsan.\nHərf-hərf deməsini nəzakətlə xahiş et.', audio: "It's Shamakhi.", reply: "It's S-H-A-M-A-K-H-I.",
      rule: askSpell,
      variants: [other('Can you spell it, please?', ex('Can you spell it, please?', 'Adı tanımırsan — hərf-hərf deməsini xahiş edirsən.', 'Can you spell it, please? — hərf-hərf; Again, please. — bir də.', 'Shamakhi? Can you spell it, please?'))],
      review: {
        title: 'Hərf-hərf soruş', why: 'Hərf-hərf deməyi nəzakətlə xahiş etdin.', hint: 'Bu dərsin nəzakətli xahişini xatırla.',
        prompt: 'Kursda yeni yoldaş soyadını deyir. Formaya yazmalısan.\nHərf-hərf deməsini nəzakətlə xahiş et.', audio: "It's Guliyeva.", reply: "It's G-U-L-I-Y-E-V-A.",
        rule: askSpell,
        variants: [other('Can you spell it, please?', ex('Can you spell it, please?', 'Soyadı yazmaq üçün hərflər lazımdır.', 'Can you spell it, please? — hərf-hərf; Slowly, please. — yavaş.', 'Guliyeva? Can you spell it, please?'))],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u2d4_c13', number: 13, title: 'Söhbəti sırala', why: 'Sual, hərflər, xahiş və yavaş təkrar düz sıradadır.', hint: 'Əvvəl sual gəlir; çox sürətli olanda nə xahiş edirsən?',
      prompt: 'Otel resepsiyası.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: 'Lankaran? How do you spell it?', from: 'B' }, { en: '2', az: "It's L-A-N-K-A-R-A-N.", from: 'G' }, { en: '3', az: 'Sorry? Slowly, please.', from: 'B' }, { en: '4', az: 'L… A… N… K… A… R… A… N.', from: 'G' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Lankaran? How do you spell it? → It's L-A-N-K-A-R-A-N. → Sorry? Slowly, please. → L… A… N…", 'Sual, hərflər, sonra yavaş təkrar xahişi.', 'How do you spell it? — sual; Slowly, please. — xahiş.', 'Lankaran? How do you spell it?'))],
      review: {
        title: 'Söhbəti sırala', why: 'Xahiş, hərflər, yoxlama və təsdiq düz sıradadır.', hint: 'Əvvəl xahiş gəlir; hərfləri eşidən onları yoxlayır.',
        prompt: 'Hava limanında qeydiyyat.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: 'Ganja? Can you spell it, please?', from: 'G' }, { en: '2', az: "It's G-A-N-J-A.", from: 'B' }, { en: '3', az: 'G-A-N-J-A. Is that right?', from: 'G' }, { en: '4', az: "Yes, that's right.", from: 'B' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Ganja? Can you spell it, please? → It's G-A-N-J-A. → G-A-N-J-A. Is that right? → Yes, that's right.", 'Xahiş, hərflər, yoxlama, sonra təsdiq.', "Is that right? — yoxlama; Yes, that's right. — təsdiq.", 'Ganja? Can you spell it, please?'))],
      },
    },
  ],
  result: {
    done: ['Dərs 4 tamamlandı', 'Artıq adını hərf-hərf deyir, hərf-hərf deyiləni yazır və bunu xahiş edə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Hərf-hərf deyiləni eşidib tanımaq', tasks: ['u2d4_c03', 'u2d4_c05', 'u2d4_c10', 'u2d4_c13'] },
      { group: 'Yazı', text: 'Hərf-hərf sual qurmaq və soyadı yazmaq', tasks: ['u2d4_c07', 'u2d4_c11'] },
      { group: 'Danışıq', text: 'Adını hərf-hərf demək və bunu xahiş etmək', tasks: ['u2d4_c09', 'u2d4_c12'] },
    ],
    closing: 'Növbəti dərs — ad və soyad: qeydiyyat vərəqi.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'How do you spell it?', translation: 'Hərf-hərf necə yazılır?', example: 'Ganja? How do you spell it?', exampleAz: 'Gəncə? Hərf-hərf necə yazılır?', usageNote: 'spell — hərf-hərf demək.', pronunciation: '/haʊ du ju spel ɪt/', teachCard: 'u2d4_c02' },
    { word: "It's B-A-K-U.", translation: 'Belədir: B-A-K-U.', example: "How do you spell it? — It's B-A-K-U.", exampleAz: 'Hərf-hərf necə yazılır? — B-A-K-U.', usageNote: "It's + hərflər.", pronunciation: '/ɪts bi eɪ keɪ ju/', teachCard: 'u2d4_c04' },
    { word: 'double', translation: 'qoşa', example: 'Hello — H-E-double L-O.', exampleAz: 'Hello — H-E-qoşa L-O.', usageNote: 'İki eyni hərf: double L.', pronunciation: '/ˈdʌbəl/', teachCard: 'u2d4_c06' },
    { word: 'Can you spell it, please?', translation: 'Hərf-hərf deyə bilərsən, zəhmət olmasa?', example: 'Lankaran? Can you spell it, please?', exampleAz: 'Lənkəran? Hərf-hərf deyə bilərsən, zəhmət olmasa?', usageNote: 'Nəzakətli xahiş.', pronunciation: '/kən ju spel ɪt pliz/', teachCard: 'u2d4_c08' },
  ],
};
