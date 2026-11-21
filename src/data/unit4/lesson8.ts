// Bölmə 4 · Dərs 8 — Bölmə söhbəti: {F} ilə video zəngdə ailəni təqdim edirsən. Yeni söz yoxdur: Dərs 1–7 qarışıq.
// Kim, adı, yaşı, peşəsi, nə var / yoxdur. Spiral: Bölmə 1–3 (salam, rəqəmlər, he/she, Yes, I do.).
// Səs işləməsə, yazılı tapşırıqlar hər məqsədi yenə əhatə edir.
import type { DesignLesson, ExplainCard } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, own, resultTexts } from '../unit3/shared';
import { aForVowel, anForConsonant, forField, heForShe, sheForHe } from './shared78';

const noMy = (right: string, example: string) => ({ match: { pattern: String.raw`^this\s+is\s+(?:brother|sister|mother|father|friend)\b` }, short: 'Ailə sözündən əvvəl my lazımdır.',
  explain: ex(right, 'Biz “qardaşım” deyirik, ingiliscə my ayrıca söz kimi gəlir.', `${right} — düzdür; ${right.replace(' my ', ' ')} — olmur.`, example) });
const noA = (right: string, wrong: string, example: string) => ({ match: { pattern: String.raw`\b(?:he|she)(?:'?s|\s+is)\s+(?:teacher|student|doctor|engine(?:er))\b` }, short: 'Peşə sözündən əvvəl a və ya an lazımdır.',
  explain: ex(right, 'Biz “həkimdir” deyirik, ingiliscə peşə sözündən əvvəl a və ya an gəlir.', `${right} — düzdür; ${wrong} — olmur.`, example) });
const noHis = (right: string, wrong: string, example: string) => ({ match: { pattern: String.raw`^(?:he|she)'?s\s+name\b` }, short: 'Adı deməkdə His və ya Her lazımdır.',
  explain: ex(right, 'Adı demək üçün “onun” sözü lazımdır: His name, Her name.', `${right} — düzdür; ${wrong} — olmur.`, example) });
const AGE_HAVE = { match: { pattern: String.raw`\bhas?\b|\bhave\b` }, short: 'Yaş “var” ilə yox, He\'s və She\'s ilə deyilir.',
  explain: ex("She's fifty.", '“50 yaşı var” sözbəsöz tərcümə olunmur — ingiliscə yaşı She\'s ilə deyirik.', "She's fifty. — düzdür; “yaşı var” kimi tərcümə — olmur.", "How old are you? — I'm thirty.") };
const AGE_YEARS = { match: { pattern: String.raw`\byears?\b` }, short: 'Yaşı demək kifayətdir.',
  explain: ex("She's fifty.", 'Yaşı yalnız rəqəmlə deyirik.', "She's fifty. — düzdür; “50 il” kimi demək — olmur.", "How old are you? — I'm thirty.") };
const HAVE_ANSWER = String.raw`^(?:yes,?\s+i\s+do|no,?\s+i\s+don['’]?t|(?:yes,?\s+)?i\s+have\s+a\s+(?:brother|sister)|(?:no,?\s+)?i\s+don['’]?t\s+have\s+a\s+(?:brother|sister))\s*[.!]?$`;
const haveMistakes = (sib: string) => [
  { match: { pattern: String.raw`^(?:yes,?\s+)?i\s+have\s+(?:brother|sister)\b` }, short: 'brother və sister-dən əvvəl a lazımdır.',
    explain: ex(`I have a ${sib}.`, 'Biz “qardaşım var” deyirik, ingiliscə tək qardaşdan əvvəl a gəlir.', `I have a ${sib}. — düzdür; I have ${sib}. — olmur.`, 'Do you have a brother? — Yes, I do.') },
  { match: { pattern: String.raw`^yes,?\s+i\s+have\s*[.!]?$` }, short: 'Do sualına do ilə cavab verilir.',
    explain: ex('Yes, I do.', 'Sual Do you ilə başlayır, qısa cavabda da do gəlir.', "Yes, I do. — düzdür; Yes, I have. — olmur.", 'Do you speak English? — Yes, I do.') },
  { match: { pattern: String.raw`^have\s+you\b` }, short: 'Sual Do you have ilə başlayır.',
    explain: ex(`Do you have a ${sib}?`, 'Bu sualı Do you başlayır, have ondan sonra gəlir.', `Do you have a ${sib}? — düzdür; Have you a ${sib}? — olmur.`, 'Do you speak English? — Yes, I do.') },
];

export const lesson8: DesignLesson = {
  id: 'a1_en_b4_d8', order: 43, unit: 4, number: 8, title: 'Ailə söhbəti', section: 'Ailə və insanlar',
  notices,
  cards: [
    {
      type: 'intro', id: 'u4d8_c01', badge: 'Bölmə söhbəti', subtitle: 'Video zəngdə {F} ilə ailə söhbəti. Öyrəndiklərin bir yerdə.', start: 'Söhbətə başla',
      goals: [
        { icon: 'chat', text: 'Ailə şəklindəki adamın kim olduğunu, adını, yaşını və peşəsini deyə bilirəm.' },
        { icon: 'wave', text: 'Ailəmdə kim olduğunu və kimin olmadığını deyə bilirəm.' },
      ],
    },
    {
      type: 'teach', id: 'u4d8_c02', number: 2, title: 'Video zəngdə {F} ilə',
      lead: 'Video zəngdə {F} ilə ailə şəkillərinə baxırsan. Hər cümləni dinlə:',
      phrases: [
        { en: 'Hi! Welcome!', az: 'Salam! Xoş gəlmisən!' },
        { en: "Who's this?", az: 'Bu kimdir?' },
        { en: 'This is my sister. Her name is Leyla.', az: 'Bu mənim bacımdır. Adı Leyladır.' },
        { en: 'How old is she?', az: 'O neçə yaşındadır?' },
        { en: "She's a doctor.", az: 'O həkimdir.' },
      ],
      notes: ['Bu sualların hamısını Bölmə 4-də öyrəndin. İndi özün danışırsan.'],
    },
    {
      type: 'choice', id: 'u4d8_c03', number: 3, title: 'Dinlə və anla', why: '“my father” — atam; “an engineer” — mühəndis.', hint: 'İki xəbərə qulaq as: kimdir və nə işləyir.',
      prompt: '{F} albomdakı şəkli göstərir.\nO kim haqqında nə deyir?', audio: "This is my father. He's an engineer.",
      options: ['Atamdır, mühəndisdir.', 'Qardaşımdır, mühəndisdir.', 'Atamdır, həkimdir.'], answer: 'Atamdır, mühəndisdir.',
      variants: [
        pick('Qardaşımdır, mühəndisdir.', 'Səsdə “father” var, “brother” yox.', ex('Atamdır, mühəndisdir.', 'father — ata, brother — qardaş: səsdə father deyilir.', "This is my father. — ata; This is my brother. — qardaş.", "This is my friend.")),
        pick('Atamdır, həkimdir.', 'Səsdə “an engineer” var, “a doctor” yox.', ex('Atamdır, mühəndisdir.', 'engineer — mühəndis, doctor — həkim: səsdə engineer deyilir.', "He's an engineer. — mühəndis; He's a doctor. — həkim.", "This is my father.")),
      ],
      review: {
        title: 'Dinlə və anla', why: '“my mother” — anam; “a teacher” — müəllim.', hint: 'İki xəbərə qulaq as: kimdir və nə işləyir.',
        prompt: 'Ailə yeməyində {F} telefondakı şəkli göstərir.\nO kim haqqında nə deyir?', audio: "This is my mother. She's a teacher.",
        options: ['Anamdır, tələbədir.', 'Bacımdır, müəllimdir.', 'Anamdır, müəllimdir.'], answer: 'Anamdır, müəllimdir.',
        variants: [
          pick('Anamdır, tələbədir.', 'Səsdə “a teacher” var, “a student” yox.', ex('Anamdır, müəllimdir.', 'teacher — müəllim, student — tələbə: səsdə teacher deyilir.', "She's a teacher. — müəllim; She's a student. — tələbə.", "This is my mother.")),
          pick('Bacımdır, müəllimdir.', 'Səsdə “mother” var, “sister” yox.', ex('Anamdır, müəllimdir.', 'mother — ana, sister — bacı: səsdə mother deyilir.', "This is my mother. — ana; This is my sister. — bacı.", "She's a teacher.")),
        ],
      },
    },
    {
      type: 'voice', id: 'u4d8_c04', number: 4, title: 'Kim olduğunu de', why: 'Qardaşını təqdim etdin: my brother.', hint: 'Ailə sözündən əvvəl “mənim” sözü gəlir.',
      prompt: '{F} albomdakı oğlanı göstərib soruşur. Bu, sənin qardaşındır.\nSualı dinlə və cavab ver.', audio: "Who's this?", reply: 'Nice!',
      rule: own(String.raw`^(?:this\s+is|he'?s|he\s+is)\s+my\s+brother\s*[.!]?$`, 'This is my brother.', "He's my brother."),
      variants: [noMy('This is my brother.', 'This is my friend.'), other('This is my brother.', ex('This is my brother.', 'Kimin kim olduğunu This is my ilə deyirsən.', "This is my brother. — düzdür; This is my friend. — dost.", "Who's this? — This is my friend."))],
      review: {
        title: 'Kim olduğunu de', why: 'Bacını təqdim etdin: my sister.', hint: 'Ailə sözündən əvvəl “mənim” sözü gəlir.',
        prompt: 'Ailə yeməyində {F} divardakı şəkildəki qızı göstərib soruşur. Bu, sənin bacındır.\nSualı dinlə və cavab ver.', audio: "Who's this?", reply: 'Nice!',
        rule: own(String.raw`^(?:this\s+is|she'?s|she\s+is)\s+my\s+sister\s*[.!]?$`, 'This is my sister.', "She's my sister."),
        variants: [noMy('This is my sister.', 'This is my friend.'), other('This is my sister.', ex('This is my sister.', 'Kimin kim olduğunu This is my ilə deyirsən.', "This is my sister. — düzdür; This is my friend. — dost.", "Who's this? — This is my friend."))],
      },
    },
    {
      type: 'write', id: 'u4d8_c05', number: 5, letters: ['A', 'N', 'A', 'R', 'E', 'K', 'S'], title: 'Hərfləri tut', why: 'A-N-A-R — Anar.', hint: 'Hər hərfi eşidən kimi toxun; “ey” və “ay” fərqinə qulaq as.',
      prompt: '{F} qardaşının adını hərf-hərf deyir.\nEşitdiyin hərflərə toxun.', audio: 'His name is A-N-A-R.', placeholder: 'Ad',
      rule: exact('ANAR'),
      variants: [other('Hərfləri bir-bir dinlə.', ex('ANAR', 'Səsdə A, N, A, R deyilir: A “ey” oxunur.', 'A — ey; R — ar.', 'His name is A-N-A-R.'))],
      review: {
        letters: ['L', 'E', 'Y', 'L', 'A', 'M', 'R'], title: 'Hərfləri tut', why: 'L-E-Y-L-A — Leyla.', hint: 'Hər hərfi eşidən kimi toxun; “i” və “ay” fərqinə qulaq as.',
        prompt: '{F} bacısının adını hərf-hərf deyir.\nEşitdiyin hərflərə toxun.', audio: 'Her name is L-E-Y-L-A.', placeholder: 'Ad',
        rule: exact('LEYLA'),
        variants: [other('Hərfləri bir-bir dinlə.', ex('LEYLA', 'Səsdə L, E, Y, L, A deyilir: Y “uay” oxunur.', 'E — i; Y — uay.', 'Her name is L-E-Y-L-A.'))],
      },
    },
    {
      type: 'match', id: 'u4d8_c06', number: 6, title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.',
      prompt: '{F} ailə şəkillərinin altına yazılar qoyub.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'This is my grandmother.', az: 'Bu mənim nənəmdir.', from: 'other' }, { en: 'This is my wife.', az: 'Bu mənim həyat yoldaşımdır.', from: 'other' }, { en: "He's a student.", az: 'O tələbədir.', from: 'other' }],
      extra: ['Bu mənim qızımdır.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex("This is my grandmother. — Bu mənim nənəmdir.; This is my wife. — Bu mənim həyat yoldaşımdır.; He's a student. — O tələbədir.", 'grandmother — nənə, wife — həyat yoldaşı, a student — tələbə.', "This is my wife. — kim; He's a student. — iş.", 'This is my friend.'))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.',
        prompt: 'Ailə qrupunda {F} şəkillərin altına yazılar qoyub.\nHər cümləyə mənasını qoş.',
        rows: [{ en: 'His name is Anar.', az: 'Onun adı Anardır.', from: 'other' }, { en: 'This is my daughter.', az: 'Bu mənim qızımdır.', from: 'other' }, { en: "She's an engineer.", az: 'O mühəndisdir.', from: 'other' }],
        extra: ['Bu mənim oğlumdur.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("His name is Anar. — Onun adı Anardır.; This is my daughter. — Bu mənim qızımdır.; She's an engineer. — O mühəndisdir.", 'name — ad, daughter — qız övlad, an engineer — mühəndis.', "This is my daughter. — kim; She's an engineer. — iş.", 'This is my friend.'))],
      },
    },
    {
      type: 'choice', id: 'u4d8_c07', number: 7, title: 'Sözü tamamla', why: 'Qız haqqında “onun adı” — Her name.', hint: 'Şəkildə qız var: adı kimin adıdır?',
      prompt: '{F} albomdakı qızı göstərir və adını deyir.\nHansı söz çatmır?', gap: { speaker: 'other', before: 'This is my sister.', after: 'name is Leyla.' },
      options: ['Her', 'His', 'She'], answer: 'Her',
      variants: [
        pick('His', 'His oğlan üçündür, şəkildə qız var.', ex('Her', 'Azərbaycancada “onun” birdir; qız üçün Her, oğlan üçün His deyilir.', 'Her name is Leyla. — qız; His name is Anar. — oğlan.', 'This is my sister.')),
        pick('She', 'She “o” deməkdir; adı demək üçün “onun” lazımdır.', ex('Her', 'Adı demək üçün “onun” sözü lazımdır: Her name.', 'Her name is Leyla. — düzdür; She name is Leyla. — olmur.', 'This is my sister.')),
      ],
      review: {
        title: 'Sözü tamamla', why: 'Oğlan haqqında “onun adı” — His name.', hint: 'Şəkildə oğlan var: adı kimin adıdır?',
        prompt: 'Video zəngdə {F} ekrandakı oğlanı göstərir və adını deyir.\nHansı söz çatmır?', gap: { speaker: 'other', before: 'This is my brother.', after: 'name is Anar.' },
        options: ['His', 'He', 'Her'], answer: 'His',
        variants: [
          pick('He', 'He “o” deməkdir; adı demək üçün “onun” lazımdır.', ex('His', 'Adı demək üçün “onun” sözü lazımdır: His name.', 'His name is Anar. — düzdür; He name is Anar. — olmur.', 'This is my brother.')),
          pick('Her', 'Her qız üçündür, şəkildə oğlan var.', ex('His', 'Azərbaycancada “onun” birdir; oğlan üçün His, qız üçün Her deyilir.', 'His name is Anar. — oğlan; Her name is Leyla. — qız.', 'This is my brother.')),
        ],
      },
    },
    {
      type: 'voice', id: 'u4d8_c08', number: 8, title: 'Yaşını de', why: 'Yaşı dedin: She\'s fifty.', hint: 'Yaşı deyəndə She\'s-dən sonra birbaşa rəqəm gəlir.',
      prompt: '{F} albomdakı qadını göstərib soruşur. Qadın əlli yaşındadır.\nSualı dinlə və cavab ver.', audio: 'How old is she?', reply: 'Really? Nice!',
      rule: exact("She's fifty.", 'She is fifty.'),
      variants: [
        AGE_HAVE, AGE_YEARS,
        { match: { pattern: String.raw`fifteen` }, short: 'fifty və fifteen fərqlidir.', explain: ex("She's fifty.", 'fifty — 50, fifteen — 15: sonluğa qulaq as.', "She's fifty. — 50; She's fifteen. — 15.", "How old are you? — I'm thirty.") },
        heForShe("She's fifty.", "How old are you? — I'm thirty."),
        other("She's fifty.", ex("She's fifty.", 'Qadının yaşını She\'s və rəqəmlə deyirsən.', "How old is she? — She's fifty.; How old is he? — He's forty.", "How old are you? — I'm thirty.")),
      ],
      review: {
        title: 'Yaşını de', why: 'Yaşı dedin: He\'s forty.', hint: 'Yaşı deyəndə He\'s-dən sonra birbaşa rəqəm gəlir.',
        prompt: 'Ad günü şəklində {F} kişini göstərib soruşur. Kişi qırx yaşındadır.\nSualı dinlə və cavab ver.', audio: 'How old is he?', reply: 'Really? Nice!',
        rule: exact("He's forty.", 'He is forty.'),
        variants: [
          { ...AGE_HAVE, explain: ex("He's forty.", '“40 yaşı var” sözbəsöz tərcümə olunmur — ingiliscə yaşı He\'s ilə deyirik.', "He's forty. — düzdür; “yaşı var” kimi tərcümə — olmur.", "How old are you? — I'm thirty.") },
          { ...AGE_YEARS, explain: ex("He's forty.", 'Yaşı yalnız rəqəmlə deyirik.', "He's forty. — düzdür; “40 il” kimi demək — olmur.", "How old are you? — I'm thirty.") },
          { match: { pattern: String.raw`fourteen` }, short: 'forty və fourteen fərqlidir.', explain: ex("He's forty.", 'forty — 40, fourteen — 14: sonluğa qulaq as.', "He's forty. — 40; He's fourteen. — 14.", "How old are you? — I'm thirty.") },
          sheForHe("He's forty.", "How old are you? — I'm thirty."),
          other("He's forty.", ex("He's forty.", 'Kişinin yaşını He\'s və rəqəmlə deyirsən.', "How old is he? — He's forty.; How old is she? — She's fifty.", "How old are you? — I'm thirty.")),
        ],
      },
    },
    {
      type: 'write', id: 'u4d8_c09', number: 9, title: 'Cavab yaz', why: 'Qardaşının olub-olmadığını yazdın.', hint: 'Sual Do ilə başlayır: qısa cavab da do ilə.',
      prompt: 'Video zəngdə {F} sənin ailən haqqında soruşur.\nÖz cavabını yaz (bəli də olar, xeyr də).', placeholder: 'Cavabını yaz',
      chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: 'Do you have a brother?' }] },
      rule: own(HAVE_ANSWER, 'Yes, I do.', "No, I don't."),
      variants: [...haveMistakes('brother'), other('Qısa cavab: Yes, I do. / No, I don\'t.', ex('Yes, I do.', 'Sual Do you ilə başlayır, cavab da do ilə verilir.', "Do you have a brother? — Yes, I do.; Do you have a brother? — No, I don't.", 'Do you speak English? — Yes, I do.'))],
      review: {
        title: 'Cavab yaz', why: 'Bacının olub-olmadığını yazdın.', hint: 'Sual Do ilə başlayır: qısa cavab da do ilə.',
        prompt: 'Ailə qrupunda {F} sənin ailən haqqında soruşur.\nÖz cavabını yaz (bəli də olar, xeyr də).', placeholder: 'Cavabını yaz',
        chat: { partner: '{F}', from: 'other', lines: [{ from: 'other', text: 'Do you have a sister?' }] },
        rule: own(HAVE_ANSWER, 'Yes, I do.', "No, I don't."),
        variants: [...haveMistakes('sister'), other('Qısa cavab: Yes, I do. / No, I don\'t.', ex('Yes, I do.', 'Sual Do you ilə başlayır, cavab da do ilə verilir.', "Do you have a sister? — Yes, I do.; Do you have a sister? — No, I don't.", 'Do you speak English? — Yes, I do.'))],
      },
    },
    {
      type: 'write', id: 'u4d8_c10', number: 10, keypad: true, title: 'Yaşı yığ', why: 'Yaşı rəqəmlə yığdın.', hint: 'Əvvəl onluğu, sonra təkliyi eşit.',
      prompt: 'Ad günü şəklində {F} atasının yaşını deyir.\nDinlə və yığ.', audio: "He's forty-five.", placeholder: 'Yaş',
      rule: exact('45'),
      variants: [other('Rəqəmləri bir-bir yoxla.', ex('45', 'forty — 40, five — 5: birlikdə 45.', 'forty — 40; five — 5.', "He's forty-five."))],
      review: {
        keypad: true, title: 'Yaşı yığ', why: 'Yaşı rəqəmlə yığdın.', hint: 'Əvvəl onluğu, sonra təkliyi eşit.',
        prompt: 'Ailə yeməyində {F} anasının yaşını deyir.\nDinlə və yığ.', audio: "She's thirty-six.", placeholder: 'Yaş',
        rule: exact('36'),
        variants: [other('Rəqəmləri bir-bir yoxla.', ex('36', 'thirty — 30, six — 6: birlikdə 36.', 'thirty — 30; six — 6.', "She's thirty-six."))],
      },
    },
    {
      type: 'match', mode: 'reply', id: 'u4d8_c11', number: 11, title: 'Cavab cütü', why: 'Hər suala uyğun cavabı tapdın.',
      prompt: '{F} ailə haqqında suallar verir.\nSuala toxun, sonra onun cavabını seç.',
      rows: [{ en: "Who's he?", az: "He's my brother.", from: 'other' }, { en: 'Is this your mother?', az: 'Yes, it is.', from: 'other' }, { en: 'Do you have a sister?', az: "No, I don't.", from: 'other' }],
      extra: ["She's a teacher."],
      variants: [other('Bir sualın cavabı yerində deyil.', ex("Who's he? — He's my brother.; Is this your mother? — Yes, it is.; Do you have a sister? — No, I don't.", 'Kim sualına kim, Is this sualına it is, Do you sualına do ilə cavab verilir.', "Is this your mother? — Yes, it is.; Do you have a sister? — No, I don't.", "Who's he? — He's my brother."))],
      review: {
        title: 'Cavab cütü', why: 'Hər suala uyğun cavabı tapdın.',
        prompt: 'Ailə yeməyində {F} şəkillər haqqında suallar verir.\nSuala toxun, sonra onun cavabını seç.',
        rows: [{ en: 'How old is she?', az: "She's thirty.", from: 'other' }, { en: "What's his job?", az: "He's a doctor.", from: 'other' }, { en: 'Is this your father?', az: "No, it isn't.", from: 'other' }],
        extra: ['His name is Anar.'],
        variants: [other('Bir sualın cavabı yerində deyil.', ex("How old is she? — She's thirty.; What's his job? — He's a doctor.; Is this your father? — No, it isn't.", 'Yaş sualına rəqəm, iş sualına peşə, Is this sualına it isn\'t ilə cavab verilir.', "What's his job? — He's a doctor.; Is this your father? — No, it isn't.", "How old is she? — She's thirty."))],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u4d8_c12', number: 12, title: 'Söhbəti sırala', why: 'Sual, cavab, yeni sual və cavab düz sıradadır.', hint: 'Əvvəl salam və kim olduğu, sonra yaş.',
      prompt: 'Video zəngdə {F} şəkil göstərir.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: "Hi! Who's this?", from: 'other' }, { en: '2', az: 'This is my father.', from: 'G' }, { en: '3', az: 'How old is he?', from: 'other' }, { en: '4', az: "He's fifty.", from: 'G' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hi! Who's this? → This is my father. → How old is he? → He's fifty.", 'Əvvəl kim olduğu soruşulur, sonra yaşı.', "Who's this? — kim; How old is he? — yaş.", "Hi! Who's this?"))],
      review: {
        title: 'Söhbəti sırala', why: 'Sual, cavab, yeni sual və cavab düz sıradadır.', hint: 'Əvvəl şəkildəki adamın anan olub-olmadığı, sonra peşəsi.',
        prompt: 'Ailə yeməyində {F} başqa şəkil göstərir.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: 'Is this your sister?', from: 'other' }, { en: '2', az: 'Yes, it is.', from: 'B' }, { en: '3', az: "What's her job?", from: 'other' }, { en: '4', az: "She's a teacher.", from: 'B' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Is this your sister? → Yes, it is. → What's her job? → She's a teacher.", 'Əvvəl kim olduğu soruşulur, sonra peşəsi.', "Is this your sister? — kim; What's her job? — peşə.", 'Is this your sister?'))],
      },
    },
    {
      type: 'two', id: 'u4d8_c13', number: 13, title: 'İki mesaj yaz', why: 'Atanın adını və peşəsini yazdın.', hint: 'Hər mesaj kişi haqqındadır: adı üçün “onun”, peşə üçün kiçik söz.',
      prompt: 'Ailə qrupunda {F} sənin atan haqqında soruşur. Atanın adı Anardır, həkimdir.\nİki mesaj yaz:\n1. Adı.\n2. Peşəsi.',
      fields: [
        { id: 'u4d8_c13a', label: 'Birinci mesaj', placeholder: 'Adı', rule: exact('His name is Anar.'), purpose: 'adını demək', empty: 'Birinci mesajı da yaz.' },
        { id: 'u4d8_c13b', label: 'İkinci mesaj', placeholder: 'Peşəsi', rule: exact("He's a doctor.", 'He is a doctor.'), purpose: 'peşəsini demək', empty: 'İkinci mesajı da yaz.' },
      ],
      variants: [
        forField('u4d8_c13a', noHis('His name is Anar.', "He's name is Anar.", 'Her name is Aysu.')),
        forField('u4d8_c13a', { match: { pattern: String.raw`^her\b` }, short: 'Kişi üçün His deyilir.', explain: ex('His name is Anar.', 'Azərbaycancada “onun” birdir; kişi üçün His, qadın üçün Her deyilir.', 'His name is Anar. — kişi; Her name is Aysu. — qadın.', 'This is my father.') }),
        forField('u4d8_c13a', other('His name is Anar.', ex('His name is Anar.', 'Adı demək üçün His name is yazırsan.', 'His name is Anar. — kişi; Her name is Aysu. — qadın.', 'This is my father.'))),
        forField('u4d8_c13b', sheForHe("He's a doctor.", "She's an engineer.")),
        forField('u4d8_c13b', noA("He's a doctor.", "He's doctor.", "She's an engineer.")),
        forField('u4d8_c13b', anForConsonant("He's a doctor.", "He's an doctor.", 'doctor d səsi ilə başlayır: an yox, a gəlir.', "She's an engineer.")),
        forField('u4d8_c13b', other("He's a doctor.", ex("He's a doctor.", 'Peşəni He\'s, a və peşə sözü ilə yazırsan.', "He's a doctor. — kişi; She's an engineer. — qadın.", "What's his job? — He's a teacher."))),
      ],
      review: {
        title: 'İki mesaj yaz', why: 'Ananın adını və peşəsini yazdın.', hint: 'Hər mesaj qadın haqqındadır: adı üçün “onun”, peşə üçün kiçik söz.',
        prompt: 'Başqa söhbətdə {F} sənin anan haqqında soruşur. Ananın adı Aysudur, mühəndisdir.\nİki mesaj yaz:\n1. Adı.\n2. Peşəsi.',
        fields: [
          { id: 'u4d8_c13a', label: 'Birinci mesaj', placeholder: 'Adı', rule: exact('Her name is Aysu.'), purpose: 'adını demək', empty: 'Birinci mesajı da yaz.' },
          { id: 'u4d8_c13b', label: 'İkinci mesaj', placeholder: 'Peşəsi', rule: exact("She's an engineer.", 'She is an engineer.'), purpose: 'peşəsini demək', empty: 'İkinci mesajı da yaz.' },
        ],
        variants: [
          forField('u4d8_c13a', noHis('Her name is Aysu.', "She's name is Aysu.", 'His name is Anar.')),
          forField('u4d8_c13a', { match: { pattern: String.raw`^his\b` }, short: 'Qadın üçün Her deyilir.', explain: ex('Her name is Aysu.', 'Azərbaycancada “onun” birdir; qadın üçün Her, kişi üçün His deyilir.', 'Her name is Aysu. — qadın; His name is Anar. — kişi.', 'This is my mother.') }),
          forField('u4d8_c13a', other('Her name is Aysu.', ex('Her name is Aysu.', 'Adı demək üçün Her name is yazırsan.', 'Her name is Aysu. — qadın; His name is Anar. — kişi.', 'This is my mother.'))),
          forField('u4d8_c13b', heForShe("She's an engineer.", "He's a doctor.")),
          forField('u4d8_c13b', noA("She's an engineer.", "She's engineer.", "He's a doctor.")),
          forField('u4d8_c13b', aForVowel("She's an engineer.", "She's a engineer.", "He's a doctor.")),
          forField('u4d8_c13b', other("She's an engineer.", ex("She's an engineer.", 'Peşəni She\'s, an və peşə sözü ilə yazırsan.', "She's an engineer. — qadın; He's a doctor. — kişi.", "What's her job? — She's a teacher."))),
        ],
      },
    },
    {
      type: 'voice', id: 'u4d8_c14', number: 14, title: 'Bacını təqdim et', why: 'Bacını təqdim etdin: kimdir və peşəsi.', hint: 'Əvvəl kim olduğunu, sonra peşəsini de; hər ikisində kiçik sözləri unutma.',
      prompt: 'Ailə yeməyində {F} qızı göstərib soruşur. O sənin bacındır, həkimdir.\nİki cümlə ilə təqdim et: kimdir və peşəsi.', audio: "Who's this?", reply: 'Nice to meet you!',
      rule: own(String.raw`^this\s+is\s+my\s+sister\s*[.,!]?\s*(?:she'?s|she\s+is)\s+a\s+doctor\s*[.!]?$`, "This is my sister. She's a doctor."),
      variants: [
        noMy("This is my sister. She's a doctor.", 'This is my friend.'),
        noA("This is my sister. She's a doctor.", "She's doctor.", "He's a student."),
        anForConsonant("This is my sister. She's a doctor.", "She's an doctor.", 'doctor d səsi ilə başlayır: an yox, a gəlir.', "She's an engineer."),
        other("This is my sister. She's a doctor.", ex("This is my sister. She's a doctor.", 'Əvvəl kim olduğunu, sonra peşəsini de.', "This is my sister. — kim; She's a doctor. — peşə.", "This is my friend.")),
      ],
      review: {
        title: 'Qardaşını təqdim et', why: 'Qardaşını təqdim etdin: kimdir və peşəsi.', hint: 'Əvvəl kim olduğunu, sonra peşəsini de; hər ikisində kiçik sözləri unutma.',
        prompt: 'Video zəngdə {F} oğlanı göstərib soruşur. O sənin qardaşındır, mühəndisdir.\nİki cümlə ilə təqdim et: kimdir və peşəsi.', audio: "Who's this?", reply: 'Nice to meet you!',
        rule: own(String.raw`^this\s+is\s+my\s+brother\s*[.,!]?\s*(?:he'?s|he\s+is)\s+an\s+engineer\s*[.!]?$`, "This is my brother. He's an engineer."),
        variants: [
          noMy("This is my brother. He's an engineer.", 'This is my friend.'),
          noA("This is my brother. He's an engineer.", "He's engineer.", "She's a doctor."),
          aForVowel("This is my brother. He's an engineer.", "He's a engineer.", "She's a doctor."),
          other("This is my brother. He's an engineer.", ex("This is my brother. He's an engineer.", 'Əvvəl kim olduğunu, sonra peşəsini de.', "This is my brother. — kim; He's an engineer. — peşə.", "This is my friend.")),
        ],
      },
    },
  ],
  result: {
    done: ['Dərs 8 tamamlandı', 'Video zəngdə ailəni təqdim etdin: kim olduğunu, adını, yaşını və peşəsini dedin.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Ailə, ad, yaş və peşə haqqında deyiləni anlamaq', tasks: ['u4d8_c03', 'u4d8_c05', 'u4d8_c06', 'u4d8_c07', 'u4d8_c10', 'u4d8_c11', 'u4d8_c12'] },
      { group: 'Yazı', text: 'Ailə sualına cavab yazmaq və adı, peşəni yazıda demək', tasks: ['u4d8_c09', 'u4d8_c13'] },
      { group: 'Danışıq', text: 'Kim olduğunu, yaşı demək və ailə üzvünü təqdim etmək', tasks: ['u4d8_c04', 'u4d8_c08', 'u4d8_c14'] },
    ],
    closing: 'Bölmə 4 bitdi! İndi bölmə imtahanını verə bilərsən.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [],
};

export const explains: { after: string; card: ExplainCard }[] = [];
export const ruleMeta: Record<string, { title: string; eg: string; topic: 'questions' | 'short' | 'order' | 'polite' | 'sound' | 'numbers' | 'letters' | 'country' }> = {};
