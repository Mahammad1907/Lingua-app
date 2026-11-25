// Bölmə 4 · Dərs 5 — I have… (I have · a brother / a sister · I don't have · Do you have a brother?).
// Xarici dost video zəngdə ailə albomunu göstərir və ailən haqqında soruşur. Cavablar: Yes, I do. / No, I don't. (Bölmə 3).
// Səhvlər: “I am have”, “I has”, “Have you a brother?”, “I have not a sister”, “I have brother”, “Yes, I have.”
// Cəm (-s) və “has” yoxdur; a yalnız hazır cüt kimi (a brother, a sister), tam izahı Bölmə 5-də.
import type { DesignLesson, ExplainCard } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, own, resultTexts, said } from '../unit3/shared';
import { ASK_MISTAKES, HAVE_MISTAKES, MY_FAMILY, askHave, haveReply } from './shared56';

const myFamily = own(MY_FAMILY, "I have a brother, but I don't have a sister.", 'I have a sister.');
const reply = (member: string) => own(haveReply(member), 'Yes, I do.', "No, I don't.");
const familyOther = (answer: string) => other('I have / I don\'t have + a brother, a sister.', ex(answer, 'Var — I have, yoxdur — I don\'t have; qabağında a gəlir.', "I have a brother. — var; I don't have a brother. — yoxdur.", "I have a sister, but I don't have a brother."));
const replyOther = (q: string) => other("Yes, I do. / No, I don't.", ex("Yes, I do. / No, I don't.", 'Sual Do ilə başlayıb — cavabda da do gəlir.', "Yes, I do. — var; No, I don't. — yoxdur.", `${q} — Yes, I do.`));

export const lesson5: DesignLesson = {
  id: 'a1_en_b4_d5', order: 40, unit: 4, number: 5, title: 'Qardaşın var?', section: 'Ailə və insanlar',
  notices,
  cards: [
    {
      type: 'intro', id: 'u4d5_c01', badge: 'Ailə və insanlar', subtitle: '{F} video zəngdə ailə albomunu göstərir və sənin ailəni soruşur.', start: 'Dərsə başla',
      goals: [
        { icon: 'wave', text: 'Qardaşım, bacım olduğunu deyə bilirəm.' },
        { icon: 'bye', text: 'Kimim olmadığını deyə bilirəm.' },
        { icon: 'chat', text: 'Qardaşın, bacın varmı — soruşa və cavab verə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u4d5_c02', number: 2, scenes: ['mascot/point'],
      word: "I have · I don't have", pronunciation: '/aɪ hæv/ · /aɪ doʊnt hæv/', reading: 'ay həv · ay dont həv', az: 'mənim var · mənim yoxdur',
      structure: ['I have + a + son / daughter', "I don't have + a son / a daughter"],
      notes: ['I — mən, have — “var”; a — bir (tərcümə olunmur): I have a son.', 'don’t — “yox”: I don’t understand kimi, don’t have-dən əvvəl gəlir.'],
      example: 'I have a son.', exampleAz: 'Mənim oğlum var.',
    },
    {
      type: 'choice', id: 'u4d5_c03', number: 3, title: 'Sözü tamamla', why: '“Mənim oğlum var” — I have a son.', hint: '“Mənim oğlum var” deyir — “var” üçün bu dərsin ilk söz kartını xatırla.', scenes: ['u3/videocall'],
      prompt: '{F} video zəngdə şəkildəki kiçik oğlanı göstərir.\nHansı söz çatmır?', gap: { speaker: 'other', before: 'I', after: 'a son. His name is Leo.' },
      options: ['have', 'am have', 'am'], answer: 'have',
      variants: [
        pick('am have', 'have-dən əvvəl am lazım deyil.', ex('have', '“var” üçün ayrıca am gəlmir: I have kifayətdir.', 'I have a son. — düzdür; I am have a son. — olmur.', 'I have a daughter.')),
        pick('am', 'I am a son — “mən oğulam” deməkdir.', ex('have', 'Onun oğlu var, özü oğul deyil — have lazımdır.', "I have a son. — oğlum var; I'm [ad] — mən [ad]-am.", 'I have a son.')),
      ],
      review: { scenes: [],
        title: 'Sözü tamamla', why: '“Mənim qızım var” — I have a daughter.', hint: '“Mənim qızım var” deyir — “var” üçün bu dərsin ilk söz kartını xatırla.',
        prompt: 'Parkda yeni tanış qadın kiçik qızı göstərir.\nHansı söz çatmır?', gap: { speaker: 'other', before: 'I', after: 'a daughter. Her name is Mia.' },
        options: ['am', 'have', 'am have'], answer: 'have',
        variants: [
          pick('am have', 'have-dən əvvəl am lazım deyil.', ex('have', '“var” üçün ayrıca am gəlmir: I have kifayətdir.', 'I have a daughter. — düzdür; I am have a daughter. — olmur.', 'I have a son.')),
          pick('am', 'I am a daughter — “mən qızam” deməkdir.', ex('have', 'Onun qızı var, özü qız deyil — have lazımdır.', "I have a daughter. — qızım var; I'm [ad] — mən [ad]-am.", 'I have a daughter.')),
        ],
      },
    },
    {
      type: 'word', id: 'u4d5_c04', number: 4, scenes: ['mascot/happy'],
      word: 'a brother · a sister', pronunciation: '/ə ˈbrʌðər/ · /ə ˈsɪstər/', reading: 'ə bra**th**ər · ə sistər', az: 'qardaş · bacı (bir nəfər)',
      notes: ['a son kimi: bir qardaş, bir bacı haqqında qabağında a gəlir. a ayrıca tərcümə olunmur.'],
      example: 'I have a brother and a sister.', exampleAz: 'Mənim bir qardaşım və bir bacım var.',
    },
    {
      type: 'write', id: 'u4d5_c07', number: 5, title: 'Cümlə qur', why: '“Bacım yoxdur” — I don\'t have a sister.', hint: '“yoxdur” üçün have-dən əvvəl hansı söz gəlir?',
      prompt: '{F} mesajda bacın olub-olmadığını soruşur. Bacın yoxdur.\nSözlərdən cümlə qur.', placeholder: 'Sözlərə toxun',
      tiles: ['have', 'I', 'sister', "don't", 'a', 'not', 'am', '.'], rule: exact("I don't have a sister."),
      variants: [...HAVE_MISTAKES, familyOther("I don't have a sister.")],
      review: {
        title: 'Cümlə qur', why: '“Qardaşım yoxdur” — I don\'t have a brother.', hint: 'Qardaşın yoxdur — “yoxdur” üçün have-dən əvvəl nə lazımdır?',
        prompt: 'Kurs yoldaşın mesajda soruşur. Qardaşın yoxdur.\nSözlərdən cümlə qur.', placeholder: 'Sözlərə toxun',
        tiles: ['brother', "don't", 'I', 'am', 'have', 'a', 'not', '.'], rule: exact("I don't have a brother."),
        variants: [...HAVE_MISTAKES, familyOther("I don't have a brother.")],
      },
    },
    {
      type: 'word', id: 'u4d5_c08', number: 6, scenes: ['mascot/ask'],
      word: 'Do you have a brother?', pronunciation: '/du ju hæv ə ˈbrʌðər/', reading: 'du yu həv ə bra**th**ər?', az: 'Qardaşın var?',
      structure: ['Do you have + a brother / a sister?'],
      notes: ['Do — sualı başladır, you — sən, have — var: Do you speak English? kimi.'],
      example: 'Do you have a brother? — Yes, I do.', exampleAz: 'Qardaşın var? — Bəli, var.',
    },
    {
      type: 'choice', id: 'u4d5_c09', number: 7, title: 'Düz sualı seç', why: 'Sual Do ilə başlayır: Do you have a brother?', hint: 'Bölmə 3-dəki “İngiliscə danışırsan?” sualının quruluşunu xatırla.',
      prompt: 'Video zəngdə {f:dat} sual vermək istəyirsən: qardaşı varmı?\nHansı sual düzdür?',
      options: ['Have you a brother?', 'Do you have a brother?', 'Are you have a brother?'], answer: 'Do you have a brother?',
      variants: [
        pick('Have you a brother?', 'Sual Do ilə başlayır.', ex('Do you have a brother?', 'Biz sonda -mı deyirik; ingiliscə əvvələ Do gəlir.', 'Do you have a brother? — sual; I have a brother. — cümlə.', 'Do you have a sister? — Yes, I do.')),
        pick('Are you have a brother?', 'are və have birlikdə gəlmir.', ex('Do you have a brother?', 'Bu sualda are yox, Do gəlir.', 'Do you have a brother? — düzdür; Are you from Baku? — başqa sualdır.', 'Do you have a sister? — No, I don\'t.')),
      ],
      review: {
        title: 'Düz sualı seç', why: 'Sual Do ilə başlayır: Do you have a sister?', hint: 'Bacısını soruşursan — Bölmə 3-dəki “İngiliscə danışırsan?” sualı kimi qur.',
        prompt: 'Kursda yeni yoldaşla tanış olursan. Bacısı varmı — öyrənmək istəyirsən.\nHansı sual düzdür?',
        options: ['Are you have a sister?', 'Have you a sister?', 'Do you have a sister?'], answer: 'Do you have a sister?',
        variants: [
          pick('Have you a sister?', 'Sual Do ilə başlayır.', ex('Do you have a sister?', 'Biz sonda -mı deyirik; ingiliscə əvvələ Do gəlir.', 'Do you have a sister? — sual; I have a sister. — cümlə.', 'Do you have a brother? — Yes, I do.')),
          pick('Are you have a sister?', 'are və have birlikdə gəlmir.', ex('Do you have a sister?', 'Bu sualda are yox, Do gəlir.', 'Do you have a sister? — düzdür; Are you from Baku? — başqa sualdır.', 'Do you have a brother? — No, I don\'t.')),
        ],
      },
    },
    {
      type: 'voice', id: 'u4d5_c10', number: 8, title: 'Səslə cavab', why: 'Do ilə suala do ilə cavab verdin.', hint: 'Qardaşın haqqında qısa cavab ver — Do you speak English? sualına cavabı xatırla.',
      prompt: '{F} soruşur.\nDüzünü de: qardaşın var, yoxsa yox?', audio: 'Do you have a brother?', reply: 'OK, thanks!',
      rule: reply('brother'),
      variants: [...ASK_MISTAKES, ...HAVE_MISTAKES, replyOther('Do you have a brother?')],
      review: {
        title: 'Səslə cavab', why: 'Do ilə suala do ilə cavab verdin.', hint: 'Bacın haqqında qısa cavab ver — Do you speak English? sualına cavabı xatırla.',
        prompt: 'Kurs yoldaşın bacısından danışıb səndən soruşur.\nDüzünü de: bacın var, yoxsa yox?', audio: 'I have a sister. Do you have a sister?', reply: 'Really? Nice!',
        rule: reply('sister'),
        variants: [...ASK_MISTAKES, ...HAVE_MISTAKES, replyOther('Do you have a sister?')],
      },
    },
    {
      type: 'two', id: 'u4d5_c12', number: 9, title: 'İki mesaj yaz', why: 'Ailəni dedin və {f:dat} sual verdin.', hint: 'Birinci mesajda “var/yoxdur” sözlərini, ikincidə bu dərsin sual quruluşunu xatırla.',
      prompt: '{F} yazdı: “I have a brother and a sister.”\nİki mesaj yaz:\n1. Bacın var, yoxsa yox (uydura bilərsən).\n2. Soruş: oğlu varmı?',
      fields: [
        { id: 'u4d5_c12a', label: 'Birinci mesaj', placeholder: 'Bacın var, yoxsa yox?', rule: own(MY_FAMILY, 'I have a sister.', "I don't have a sister."), purpose: 'bacın olub-olmadığını demək', empty: 'Birinci mesajı da yaz.' },
        { id: 'u4d5_c12b', label: 'İkinci mesaj', placeholder: 'Oğlu varmı — soruş', rule: said(askHave('son'), 'Do you have a son?'), purpose: 'oğlu olub-olmadığını soruşmaq', empty: 'İkinci mesajı da yaz.' },
      ],
      variants: [
        { field: 'u4d5_c12a', match: { other: true }, explain: ex("I have a sister. / I don't have a sister.", 'Var — I have, yoxdur — I don\'t have; qabağında a gəlir.', "I have a sister. — var; I don't have a sister. — yoxdur.", 'I have a brother and a sister.') },
        { field: 'u4d5_c12b', match: { other: true }, explain: ex('Do you have a son?', 'Sual Do ilə başlayır, sonra you have a son.', 'Do you have a son? — sual; I have a son. — cümlə.', 'Do you have a daughter? — Yes, I do.') },
      ],
      review: {
        title: 'İki mesaj yaz', why: 'Ailəni dedin və sual verdin.', hint: 'Yeni yoldaşa da əvvəl “var/yoxdur” ilə, sonra bu dərsin sual quruluşu ilə yaz.',
        prompt: 'Yeni yoldaş yazdı: “I have a son.”\nİki mesaj yaz:\n1. Qardaşın var, yoxsa yox (uydura bilərsən).\n2. Soruş: qızı varmı?',
        fields: [
          { id: 'u4d5_c12a', label: 'Birinci mesaj', placeholder: 'Qardaşın var, yoxsa yox?', rule: own(MY_FAMILY, 'I have a brother.', "I don't have a brother."), purpose: 'qardaşın olub-olmadığını demək', empty: 'Birinci mesajı da yaz.' },
          { id: 'u4d5_c12b', label: 'İkinci mesaj', placeholder: 'Qızı varmı — soruş', rule: said(askHave('daughter'), 'Do you have a daughter?'), purpose: 'qızı olub-olmadığını soruşmaq', empty: 'İkinci mesajı da yaz.' },
        ],
        variants: [
          { field: 'u4d5_c12a', match: { other: true }, explain: ex("I have a brother. / I don't have a brother.", 'Var — I have, yoxdur — I don\'t have; qabağında a gəlir.', "I have a brother. — var; I don't have a brother. — yoxdur.", 'I have a brother and a sister.') },
          { field: 'u4d5_c12b', match: { other: true }, explain: ex('Do you have a daughter?', 'Sual Do ilə başlayır, sonra you have a daughter.', 'Do you have a daughter? — sual; I have a daughter. — cümlə.', 'Do you have a son? — No, I don\'t.') },
        ],
      },
    },
    {
      type: 'write', id: 'u4d5_c13', number: 10, title: 'Mesaj yaz', why: 'Ailəndə kimin olub-olmadığını özün dedin.', hint: 'Hər ailə üzvü üçün ayrıca de: var, yoxsa yoxdur.',
      prompt: '{F} ailən haqqında soruşur.\nYaz: qardaşın və bacın var, yoxsa yox? (uydura bilərsən)', placeholder: 'Cavabını yaz',
      chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: 'I have a brother and a sister. And you?' }] },
      rule: myFamily,
      variants: [...HAVE_MISTAKES, familyOther("I have a brother, but I don't have a sister.")],
      review: { scenes: [],
        title: 'Mesaj yaz', why: 'Ailəndə kimin olub-olmadığını özün dedin.', hint: 'Yeni yoldaşa hər ailə üzvünü ayrıca yaz: var, yoxsa yoxdur.',
        prompt: 'Kursda yeni yoldaş mesaj yazdı.\nCavab yaz: qardaşın və bacın var, yoxsa yox? (istəsən, uydurma)', placeholder: 'Cavabını yaz',
        chat: { partner: 'Kurs yoldaşı', from: 'other', lines: [{ from: 'other', text: "Hi! I don't have a brother, but I have a sister. And you?" }] },
        rule: myFamily,
        variants: [...HAVE_MISTAKES, familyOther("I have a sister, but I don't have a brother.")],
      },
    },
  ],
  pool: [
    {
      type: 'choice', id: 'u4d5_c05', number: 5, title: 'Dinlə və anla', why: '“I have a sister” — bacım var.', hint: 'Cümlə “This is” ilə başlayır, yoxsa başqa sözlə?',
      prompt: '{G} video zəngdə {f:dat} ailəsindən danışır.\n{G} nə deyir?', audio: 'I have a sister.',
      options: ['Mənim bacım var.', 'Bu, mənim bacımdır.', 'Mənim qardaşım var.'], answer: 'Mənim bacım var.',
      variants: [
        pick('Bu, mənim bacımdır.', 'Səsdə “This is” yoxdur, “I have” var.', ex('Mənim bacım var.', 'Səsdə şəkil göstərmək yoxdur — I have deyir.', 'I have a sister. — bacım var; This is my sister. — bu, bacımdır.', 'I have a brother and a sister.')),
        pick('Mənim qardaşım var.', 'Səsdə “brother” yox, “sister” var.', ex('Mənim bacım var.', 'sister — bacı, brother — qardaş.', 'I have a sister. — bacım var; I have a brother. — qardaşım var.', 'I have a sister.')),
      ],
      review: {
        title: 'Dinlə və anla', why: '“I have a brother and a sister” — qardaşım və bacım var.', hint: 'Cümlədəki ailə sözlərini say və başlanğıca qulaq as.',
        prompt: 'Kursda yeni yoldaş ailəsi haqqında danışır.\nO nə deyir?', audio: 'I have a brother and a sister.',
        options: ['Bu, qardaşım və bacımdır.', 'Qardaşım və bacım var.', 'Qardaşım var, bacım yoxdur.'], answer: 'Qardaşım və bacım var.',
        variants: [
          pick('Bu, qardaşım və bacımdır.', 'Səsdə “This is” yoxdur, “I have” var.', ex('Qardaşım və bacım var.', 'O, şəkil göstərmir — I have deyir.', 'I have a brother. — qardaşım var; This is my brother. — bu, qardaşımdır.', 'I have a brother and a sister.')),
          pick('Qardaşım var, bacım yoxdur.', 'Səsdə “and a sister” var — bacısı da var.', ex('Qardaşım və bacım var.', 'and — və: hər ikisi var.', 'a brother and a sister — qardaş və bacı.', 'I have a brother and a sister.')),
        ],
      },
    },
    {
      type: 'match', mode: 'reply', id: 'u4d5_c11', number: 11, title: 'Cavab cütü', why: 'Hər suala uyğun cavabı tapdın.',
      prompt: '{F} ailə albomunu vərəqləyir və suallar verir.\nHər suala cavabını qoş.',
      rows: [{ en: 'Do you have a sister?', az: 'Yes, I do.', from: 'other' }, { en: 'Is this your sister?', az: 'Yes, it is.', from: 'other' }, { en: "Who's this?", az: 'This is my sister.', from: 'other' }],
      extra: ['Yes, I have.'],
      variants: [
        pick('Do you have a sister?', 'Do ilə suala Yes, I do. cavab verilir.', ex('Do you have a sister? — Yes, I do.', 'Sual Do ilə başlayıb — cavabda da do gəlir.', 'Do you have a sister? — Yes, I do.; Is this your sister? — Yes, it is.', 'Do you have a brother? — No, I don\'t.')),
        other('Bir cavab yerində deyil.', ex("Do you have a sister? — Yes, I do.; Is this your sister? — Yes, it is.; Who's this? — This is my sister.", 'Do ilə suala do, Is ilə suala is, Who ilə suala kim olduğu.', 'Do you have a sister? — Yes, I do.; Is this your sister? — Yes, it is.', "Who's this? — This is my brother.")),
      ],
      review: {
        title: 'Cavab cütü', why: 'Hər suala uyğun cavabı tapdın.',
        prompt: 'Kursda yoldaşın telefonda ailə şəkillərini göstərir və soruşur.\nHər suala cavabını qoş.',
        rows: [{ en: 'Do you have a brother?', az: "No, I don't.", from: 'other' }, { en: 'Is this your brother?', az: "No, it isn't.", from: 'other' }, { en: "Who's he?", az: "He's my friend.", from: 'other' }],
        extra: ["No, I'm not."],
        variants: [
          pick('Do you have a brother?', "Do ilə suala No, I don't. cavab verilir.", ex("Do you have a brother? — No, I don't.", 'Sual Do ilə başlayıb — cavabda da do gəlir.', "Do you have a brother? — No, I don't.; Is this your brother? — No, it isn't.", 'Do you have a sister? — Yes, I do.')),
          other('Bir cavab yerində deyil.', ex("Do you have a brother? — No, I don't.; Is this your brother? — No, it isn't.; Who's he? — He's my friend.", 'Do ilə suala do, Is ilə suala is, Who ilə suala kim olduğu.', "Do you have a brother? — No, I don't.; Is this your brother? — No, it isn't.", "Who's he? — He's my brother.")),
        ],
      },
    },
  ],
  result: {
    done: ['Dərs 5 tamamlandı', 'Artıq ailəndə kimin olub-olmadığını deyir və soruşa bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'I have cümləsini və düz sualı tanımaq', tasks: ['u4d5_c03', 'u4d5_c09'] },
      { group: 'Yazı', text: 'Var və yoxdur demək, Do ilə soruşmaq', tasks: ['u4d5_c07', 'u4d5_c12', 'u4d5_c13'] },
      { group: 'Danışıq', text: 'Do you have…? sualına cavab vermək', tasks: ['u4d5_c10'] },
    ],
    closing: 'Növbəti dərs — ailəndə kim neçə yaşındadır?', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'I have', translation: 'mənim var', example: 'I have a son.', exampleAz: 'Mənim oğlum var.', usageNote: '“var” əvvəldə gəlir: I have.', pronunciation: '/aɪ hæv/', teachCard: 'u4d5_c02' },
    { word: 'a brother · a sister', translation: 'qardaş · bacı (bir nəfər)', example: 'I have a brother and a sister.', exampleAz: 'Mənim bir qardaşım və bir bacım var.', usageNote: 'Bir nəfər üçün qabağında a.', pronunciation: '/ə ˈbrʌðər/ · /ə ˈsɪstər/', teachCard: 'u4d5_c04' },
    { word: "I don't have", translation: 'mənim yoxdur', example: "I have a sister, but I don't have a brother.", exampleAz: 'Mənim bacım var, amma qardaşım yoxdur.', usageNote: "have-dən əvvəl don't.", pronunciation: '/aɪ doʊnt hæv/', teachCard: 'u4d5_c02' },
    { word: 'Do you have a brother?', translation: 'Qardaşın var?', example: 'Do you have a brother? — Yes, I do.', exampleAz: 'Qardaşın var? — Bəli, var.', usageNote: 'Sualı Do başlayır.', pronunciation: '/du ju hæv ə ˈbrʌðər/', teachCard: 'u4d5_c08' },
  ],
};

export const explains: { after: string; card: ExplainCard }[] = [
  { after: 'u4d5_c02', card: { type: 'explain', id: 'u4d5_c02t', number: 0,
    lead: '“Mənim oğlum var” ingiliscə I have ilə deyilir.', focus: 'I have',
    sections: [
      { title: '“var” harada gəlir?', text: 'Biz “var” sözünü sonda deyirik. İngiliscə I have cümlənin əvvəlində gəlir.' },
      { title: 'Necə qurulur?', build: { parts: ['I have', 'a son'], examples: [{ en: 'I have a son.', az: 'Mənim oğlum var.' }, { en: 'I have a daughter.', az: 'Mənim qızım var.' }] } },
      { title: 'a nədir?', text: 'a bir nəfər deməkdir: a son — bir oğul. Ayrıca tərcümə olunmur. I ilə have arasına am gəlmir.' },
    ],
    attention: 'I have — iki söz. I am have demirik.',
  } },
  { after: 'u4d5_c08', card: { type: 'explain', id: 'u4d5_c08t', number: 0,
    lead: 'Sual qurmaq üçün əvvələ Do gəlir.', focus: 'Do',
    sections: [
      { title: 'Cümlə və sual', pairs: [{ en: 'I have a brother.', az: 'cümlə' }, { en: 'Do you have a brother?', az: 'sual' }] },
      { title: 'Niyə Do?', text: 'Biz sonda -mı deyirik; ingiliscə əvvələ Do gəlir, Do you speak English? sualındakı kimi. Do ayrıca tərcümə olunmur.' },
      { title: 'Qısa cavab', pairs: [{ en: 'Yes, I do.', az: 'bəli, var' }, { en: "No, I don't.", az: 'xeyr, yoxdur' }] },
    ],
    attention: 'Sual Do ilə başlayıbsa, qısa cavabda da do gəlir.',
  } },
];

export const ruleMeta: Record<string, { title: string; eg: string; topic: 'questions' | 'short' | 'order' | 'polite' | 'sound' | 'numbers' | 'letters' | 'country' }> = {
  u4d5_c02t: { title: '“Mənim oğlum var” necə deyilir?', eg: 'I have a son.', topic: 'order' },
  u4d5_c08t: { title: '“Qardaşın var?” necə soruşulur?', eg: 'Do you have a brother? — Yes, I do.', topic: 'questions' },
};
