// Bölmə 3 · Dərs 5 · 2-ci hissə — O haradandır? (Where's he/she from? · Is she …? / Is he …? · Yes, he is. · No, she isn't.).
// Hostelin mətbəxi, video zəng, qatar. Səhvlər: “She from Turkey” (is-i atmaq), “Is she from?” (sonu yoxdur), he ↔ she, “No, she not”.
// Spiral: He's / She's from … (1-ci hissə), Are you from …? Yes, I am. (Dərs 4), Really? (Dərs 4), millət sözləri (Dərs 3).
import type { DesignLesson, Variant } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, resultTexts, said } from './shared';

const askWhere = (who: 'he' | 'she') => said(String.raw`^where(?:'s|’s|\s+is)\s+${who}\s+from\s*\??$`, `Where's ${who} from?`);
const fromCountry = (who: 'he' | 'she', country: string) =>
  said(String.raw`^${who}(?:'s|’s|\s+is)\s+from\s+${country.toLowerCase()}\s*[.!]?$`, `${who === 'he' ? 'He' : 'She'}'s from ${country}.`);
/** “No, she isn't.” (also “No, she is not.”), optionally followed by where she is from. */
const noShort = (who: 'he' | 'she', then?: string) =>
  said(String.raw`^no,?\s+${who}\s+(?:isn'?t|isn’t|is\s+not)\s*[.!]?${then ? String.raw`(?:\s*${who}(?:'s|’s|\s+is)\s+from\s+${then.toLowerCase()}\s*[.!]?)?` : ''}$`, `No, ${who} isn't.`);

/** he ↔ she: Azerbaijani has one word, “o”. */
const wrongPerson = (answer: string, right: 'he' | 'she'): Variant => ({
  match: { pattern: String.raw`\b${right === 'he' ? 'she' : 'he'}\b` },
  short: right === 'he' ? 'Kişi haqqında danışırsan — he.' : 'Qadın haqqında danışırsan — she.',
  explain: ex(answer, `Azərbaycancada ikisi də “o”dur; ingiliscə ${right === 'he' ? 'kişi üçün he' : 'qadın üçün she'}.`,
    right === 'he' ? "Where's he from? — kişi; Where's she from? — qadın." : "Where's she from? — qadın; Where's he from? — kişi.", answer),
});
const noIsInQuestion = (answer: string): Variant => ({
  match: { pattern: String.raw`^where\s+s?he\b` }, short: 'Where-dən sonra ’s (is) lazımdır.',
  explain: ex(answer, 'Sualda “-dır” hissəsi ayrıca gəlir: Where’s = Where is.', `${answer} — düzdür; ${answer.replace("'s", '')} — olmur.`, "Where's she from? — She's from Turkey."),
});
const shortNot = (answer: string): Variant => ({
  match: { pattern: String.raw`^no,?\s+s?he\s+not\b` }, short: 'Qısa cavabda isn’t deyilir.',
  explain: ex(answer, '“deyil” üçün is və not birlikdə gəlir: isn’t.', `${answer} — düzdür; ${answer.replace("isn't", 'not')} — olmur.`, "Is she from Iran? — No, she isn't."),
});
const aboutSelf = (answer: string): Variant => ({
  match: { pattern: String.raw`^(?:yes|no),?\s+i\b` }, short: 'Sənin haqqında yox, başqası haqqında soruşur.',
  explain: ex(answer, 'Sualda he və ya she var — cavabda da eyni söz gəlir.', `${answer} — o; No, I'm not. — mən.`, "Is she from Iran? — No, she isn't."),
});

export const lesson5b: DesignLesson = {
  id: 'a1_en_b3_d5b', order: 30, unit: 3, number: 5, part: 2, title: 'O haradandır?', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d5b_c01', badge: 'Haradansan', subtitle: 'Hosteldə, qatarda və video zəngdə başqasının haradan olduğunu soruşursan.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Başqası haqqında sualı eşidib anlayıram.' },
        { icon: 'wave', text: 'Başqasının haradan olduğunu soruşuram.' },
        { icon: 'bye', text: 'He və she ilə qısa cavab verirəm: Yes, he is. / No, she isn’t.' },
      ],
    },
    {
      type: 'word', id: 'u3d5b_c02', number: 2, scenes: ['mascot/ask'],
      word: "Where's he from? · Where's she from?", pronunciation: '/wɛrz hi frʌm/ · /wɛrz ʃi frʌm/', reading: 'uerz hi fram? · uerz şi fram?', az: 'O (kişi / qadın) haradandır?',
      structure: ["Where's + he / she + from?"],
      notes: ["Where's — where is-in qısası, “uerz” oxunur."],
      example: "Where's she from? — She's from Turkey.", exampleAz: 'O haradandır? — Türkiyədəndir.',
    },
    {
      type: 'choice', id: 'u3d5b_c03', number: 3, title: 'Dinlə və seç', why: '“she” — qız haqqında soruşur.', hint: 'Where’s-dən sonrakı sözə qulaq as.',
      prompt: 'Hostelin mətbəxində qız və oğlan oturub. Yeni tanış onlardan birini göstərib soruşur.\nNəyi soruşur?', audio: "Where's she from?",
      options: ['Oğlanın haradan olduğunu', 'Qızın haradan olduğunu', 'Sənin haradan olduğunu'], answer: 'Qızın haradan olduğunu',
      variants: [
        pick('Oğlanın haradan olduğunu', 'Oğlan üçün “he” olardı, səsdə “she” var.', ex('Qızın haradan olduğunu', '“she” qadın və ya qız haqqındadır.', "Where's she from? — qız; Where's he from? — oğlan.", "Where's she from? — She's from Turkey.")),
        pick('Sənin haradan olduğunu', 'Səndən soruşsaydı, “you” deyərdi.', ex('Qızın haradan olduğunu', 'Səsdə “you” yox, “she” var.', "Where's she from? — o (qız); Where are you from? — sən.", "Where's she from? — She's from Turkey.")),
      ],
      review: {
        title: 'Dinlə və seç', why: '“he” — kişi haqqında soruşur.', hint: 'Where’s-dən sonrakı sözə qulaq as.',
        prompt: 'Qatarda yanında bir kişi və bir qadın oturub. Bələdçi sənə yaxınlaşıb soruşur.\nNəyi soruşur?', audio: "Where's he from?",
        options: ['Sənin haradan olduğunu', 'Qadının haradan olduğunu', 'Kişinin haradan olduğunu'], answer: 'Kişinin haradan olduğunu',
        variants: [
          pick('Sənin haradan olduğunu', 'Səndən soruşsaydı, “you” deyərdi.', ex('Kişinin haradan olduğunu', 'Səsdə “you” yox, “he” var.', "Where's he from? — o (kişi); Where are you from? — sən.", "Where's he from? — He's from Russia.")),
          pick('Qadının haradan olduğunu', 'Qadın üçün “she” olardı, səsdə “he” var.', ex('Kişinin haradan olduğunu', '“he” kişi haqqındadır.', "Where's he from? — kişi; Where's she from? — qadın.", "Where's he from? — He's from Russia.")),
        ],
      },
    },
    {
      type: 'voice', id: 'u3d5b_c04', number: 4, title: 'Soruş', why: 'Kişinin haradan olduğunu soruşdun.', hint: 'Dərs 1-dəki “haradan” sualını xatırla, amma indi kişi haqqındadır.',
      prompt: 'Video zəngdə qız ekranda yeni bir kişi dostunu göstərir.\nOnun haradan olduğunu soruş.', reply: "He's from Georgia.",
      rule: askWhere('he'),
      variants: [wrongPerson("Where's he from?", 'he'), noIsInQuestion("Where's he from?"), other("Where's he from?", ex("Where's he from?", 'Kişi haqqında soruşursan: Where’s he from?', "Where's he from? — o (kişi); Where are you from? — sən.", "Where's he from? — He's from Georgia."))],
      review: {
        title: 'Soruş', why: 'Qadının haradan olduğunu soruşdun.', hint: 'Dərs 1-dəki “haradan” sualını xatırla, amma indi qadın haqqındadır.',
        prompt: 'Qatarda oğlanın yanında bir qadın oturub, sən onu tanımırsan.\nOğlandan qadının haradan olduğunu soruş.', reply: "She's from Iran.",
        rule: askWhere('she'),
        variants: [wrongPerson("Where's she from?", 'she'), noIsInQuestion("Where's she from?"), other("Where's she from?", ex("Where's she from?", 'Qadın haqqında soruşursan: Where’s she from?', "Where's she from? — o (qadın); Where are you from? — sən.", "Where's she from? — She's from Iran."))],
      },
    },
    {
      type: 'word', id: 'u3d5b_c05', number: 5, scenes: ['mascot/think'],
      word: 'Is she …? · Is he …?', pronunciation: '/ɪz ʃi/ · /ɪz hi/', reading: 'iz şi …? · iz hi …?', az: 'O …-dırmı?',
      structure: ['Is + she / he + from + ölkə?', 'Is + she / he + millət?'],
      notes: ['Sualda is əvvələ keçir: She is → Is she?'],
      example: 'Is she Turkish?', exampleAz: 'O türkdürmü?',
    },
    {
      type: 'write', id: 'u3d5b_c06', number: 6, title: 'Mesaj yaz', why: 'Sualda Is əvvəldədir.', hint: 'Bəli/xeyr sualında hansı söz birinci gəlir?', scenes: ['u3/videocall'],
      prompt: 'Video zəngdən sonra qıza yazırsan: ekrandakı kişi Rusiyadandırmı?\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
      tiles: ['Is', 'he', 'from', 'Russia', 'He', 'is', 'at', '?'], rule: exact('Is he from Russia?'),
      variants: [
        { match: { pattern: String.raw`^he\s+is\b` }, short: 'Sualda Is əvvələ keçir.', explain: ex('Is he from Russia?', 'Bəli/xeyr sualında Is birinci gəlir, he ondan sonra.', 'Is he from Russia? — sual; He is from Russia. — cavab.', 'Is she Turkish?') },
        other('Is he from Russia?', ex('Is he from Russia?', 'Sual Is ilə başlayır, sonra he from, sonra ölkə.', 'Is he from Russia? — ölkə; Is he Russian? — millət.', 'Is she Turkish?')),
      ],
      review: {
        title: 'Mesaj yaz', why: 'Sualda Is əvvəldədir.', hint: 'Bəli/xeyr sualında hansı söz birinci gəlir?',
        prompt: 'Hosteldə oğlana yazırsan: mətbəxdəki qadın fransızdırmı?\nSözlərdən sual qur.', placeholder: 'Sözlərə toxun',
        tiles: ['French', 'Is', 'she', 'is', 'She', 'France', '?'], rule: exact('Is she French?'),
        variants: [
          { match: { pattern: String.raw`^she\s+is\b` }, short: 'Sualda Is əvvələ keçir.', explain: ex('Is she French?', 'Bəli/xeyr sualında Is birinci gəlir, she ondan sonra.', 'Is she French? — sual; She is French. — cavab.', 'Is she Turkish?') },
          other('Is she French?', ex('Is she French?', 'Sual Is ilə başlayır, sonra she, sonra millət.', 'Is she French? — millət; Is she from France? — ölkə.', 'Is she Turkish?')),
        ],
      },
    },
    {
      type: 'word', id: 'u3d5b_c07', number: 7, scenes: ['mascot/happy'],
      word: 'Yes, he is.', pronunciation: '/jɛs hi ɪz/', reading: 'yes, hi iz', az: 'Bəli, elədir.',
      structure: ['Yes, + he / she + is.'],
      notes: ['Qısa cavabın sonunda is qalır, qısalmır.'],
      example: 'Is he Georgian? — Yes, he is.', exampleAz: 'O gürcüdürmü? — Bəli, elədir.',
    },
    {
      type: 'match', mode: 'reply', id: 'u3d5b_c08', number: 8, title: 'Cavab cütü', why: 'Hər suala uyğun qısa cavabı tapdın.', hint: 'Sualdakı you, he, she sözü cavabda necə qayıdır?',
      prompt: 'Dil klubunda suallar və qısa cavablar.\nSuala toxun, sonra onun cavabını seç.',
      rows: [{ en: 'Is he from Turkey?', az: 'Yes, he is.', from: 'other' }, { en: 'Are you from Iran?', az: 'Yes, I am.', from: 'G' }, { en: 'Is she Russian?', az: 'Yes, she is.', from: 'B' }],
      extra: ['Yes, it is.'],
      variants: [other('Bir cavab yerində deyil.', ex('Is he from Turkey? — Yes, he is.; Are you from Iran? — Yes, I am.; Is she Russian? — Yes, she is.', 'Sualdakı söz cavabda qayıdır: he → he, you → I, she → she.', 'Is he …? — Yes, he is.; Are you …? — Yes, I am.', 'Is he Georgian? — Yes, he is.'))],
      review: {
        title: 'Cavab cütü', why: 'Hər suala uyğun qısa cavabı tapdın.', hint: 'Əvvəl sualın ilk iki sözünə bax.',
        prompt: 'Hostelin mətbəxində söhbət.\nSuala toxun, sonra onun cavabını seç.',
        rows: [{ en: 'Is she from Georgia?', az: 'Yes, she is.', from: 'other' }, { en: 'Is he German?', az: 'Yes, he is.', from: 'G' }, { en: 'Are you Turkish?', az: 'Yes, I am.', from: 'other' }],
        extra: ['Yes, it is.'],
        variants: [other('Bir cavab yerində deyil.', ex('Is she from Georgia? — Yes, she is.; Is he German? — Yes, he is.; Are you Turkish? — Yes, I am.', 'Sualdakı söz cavabda qayıdır: she → she, he → he, you → I.', 'Is she …? — Yes, she is.; Are you …? — Yes, I am.', 'Is he Georgian? — Yes, he is.'))],
      },
    },
    {
      type: 'word', id: 'u3d5b_c09', number: 9, scenes: ['mascot/point'],
      word: "No, she isn't.", pronunciation: '/noʊ ʃi ˈɪzənt/', reading: 'nou, şi izənt', az: 'Xeyr, o deyil.',
      structure: ["No, + she / he + isn't."],
      notes: ["isn't — is not-un qısası."],
      example: "Is she from Iran? — No, she isn't.", exampleAz: 'O İrandandırmı? — Xeyr.',
    },
    {
      type: 'choice', id: 'u3d5b_c10', number: 10, title: 'Sözü tamamla', why: '“deyil” — isn’t.', hint: 'Qısa “xeyr” cavabının sonunda nə gəlir?',
      prompt: 'Hosteldə yeni tanış soruşur: “Is he from Georgia?” Qız bilir ki, oğlan Gürcüstandan deyil.\nHansı söz çatmır?', gap: { speaker: 'G', before: 'No, he', after: '.' },
      options: ['not', "isn't", "don't"], answer: "isn't",
      variants: [
        pick('not', 'Tək “not” kifayət deyil, is də lazımdır.', ex("isn't", '“deyil” üçün is və not birlikdə gəlir: isn’t.', "No, he isn't. — düzdür; No, he not. — olmur.", "Is she from Iran? — No, she isn't.")),
        pick("don't", "don't “başa düşmürəm” kimi cümlələrdədir.", ex("isn't", 'Sual Is ilə başlayıb, cavab da is ilə gəlir.', "Is he …? — No, he isn't.; I don't understand. — başa düşmürəm.", "Is she from Iran? — No, she isn't.")),
      ],
      review: {
        title: 'Sözü tamamla', why: '“deyil” — isn’t.', hint: 'Qısa “xeyr” cavabının sonunda nə gəlir?',
        prompt: 'Qatarda bələdçi soruşur: “Is she Turkish?” Oğlan bilir ki, yanındakı qadın türk deyil.\nHansı söz çatmır?', gap: { speaker: 'B', before: 'No, she', after: '.' },
        options: ["isn't", "don't", 'not'], answer: "isn't",
        variants: [
          pick('not', 'Tək “not” kifayət deyil, is də lazımdır.', ex("isn't", '“deyil” üçün is və not birlikdə gəlir: isn’t.', "No, she isn't. — düzdür; No, she not. — olmur.", "Is she from Iran? — No, she isn't.")),
          pick("don't", "don't “başa düşmürəm” kimi cümlələrdədir.", ex("isn't", 'Sual Is ilə başlayıb, cavab da is ilə gəlir.', "Is she …? — No, she isn't.; I don't understand. — başa düşmürəm.", "Is she from Iran? — No, she isn't.")),
        ],
      },
    },
    {
      type: 'voice', id: 'u3d5b_c11', number: 11, title: 'Qısa cavab ver', why: 'Qadın haqqında qısa “xeyr” cavabı verdin.', hint: 'Sual kimin haqqındadır? Cavabda da o söz qayıdır.',
      prompt: 'Video zəngdə ekranda qızın rəfiqəsi görünür. O, Fransadandır. Yeni tanış soruşur.\nQısa cavab ver.', audio: 'Is she from Germany?', reply: 'Oh, OK!',
      rule: noShort('she', 'France'),
      variants: [wrongPerson("No, she isn't.", 'she'), shortNot("No, she isn't."), aboutSelf("No, she isn't."), other("No, she isn't.", ex("No, she isn't.", 'O, Almaniyadan deyil — qısa “xeyr” cavabı.', "Is she …? — No, she isn't.; Is she …? — Yes, she is.", "Is she from Iran? — No, she isn't."))],
      review: {
        title: 'Qısa cavab ver', why: 'Kişi haqqında qısa “xeyr” cavabı verdin.', hint: 'Sual kimin haqqındadır? Cavabda da o söz qayıdır.',
        prompt: 'Hostelin mətbəxində oğlanın otaq yoldaşı gürcüdür. Yeni tanış soruşur.\nQısa cavab ver.', audio: 'Is he Turkish?', reply: 'Oh, sorry!',
        rule: noShort('he', 'Georgia'),
        variants: [wrongPerson("No, he isn't.", 'he'), shortNot("No, he isn't."), aboutSelf("No, he isn't."), other("No, he isn't.", ex("No, he isn't.", 'O, türk deyil — qısa “xeyr” cavabı.', "Is he …? — No, he isn't.; Is he …? — Yes, he is.", "Is he Georgian? — Yes, he is."))],
      },
    },
    {
      type: 'write', id: 'u3d5b_c12', number: 12, title: 'Dialoqu tamamla', why: 'Oğlanın haradan olduğunu yazdın.', hint: 'Sual oğlan haqqındadır; cavab da onun haqqında olsun.',
      prompt: 'Hostelin çatında yeni tanış oğlanın şəklini görüb yazır. Oğlan Azərbaycandandır.\nCavab yaz.', placeholder: 'Cavabın',
      chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: "Where's he from?" }] },
      rule: fromCountry('he', 'Azerbaijan'),
      variants: [
        { match: { pattern: String.raw`^she\b` }, short: 'Oğlan haqqında danışırsan — he.', explain: ex("He's from Azerbaijan.", 'Azərbaycancada “o” deyirik, ingiliscə oğlan üçün he.', "He's from Azerbaijan. — oğlan; She's from Azerbaijan. — qız.", "He's from Azerbaijan.") },
        { match: { pattern: String.raw`^he\s+from\b` }, short: 'He-dən sonra ’s (is) lazımdır.', explain: ex("He's from Azerbaijan.", '“-dandır” hissəsi ingiliscə ayrıca gəlir: ’s.', "He's from Azerbaijan. — düzdür; He from Azerbaijan. — olmur.", "Where's he from? — He's from Georgia.") },
        other("He's from Azerbaijan.", ex("He's from Azerbaijan.", 'Sual oğlan haqqındadır: He’s from, sonra ölkə.', "He's from Azerbaijan. — ölkə; He's Azerbaijani. — millət.", "Where's he from? — He's from Georgia.")),
      ],
      review: {
        title: 'Dialoqu tamamla', why: 'Qızın haradan olduğunu yazdın.', hint: 'Sual qız haqqındadır; cavab da onun haqqında olsun.',
        prompt: 'Dil klubunun çatında yeni tanış qızın şəklini görüb yazır. Qız Azərbaycandandır.\nCavab yaz.', placeholder: 'Cavabın',
        chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: "Where's she from?" }] },
        rule: fromCountry('she', 'Azerbaijan'),
        variants: [
          { match: { pattern: String.raw`^he\b` }, short: 'Qız haqqında danışırsan — she.', explain: ex("She's from Azerbaijan.", 'Azərbaycancada “o” deyirik, ingiliscə qız üçün she.', "She's from Azerbaijan. — qız; He's from Azerbaijan. — oğlan.", "She's from Azerbaijan.") },
          { match: { pattern: String.raw`^she\s+from\b` }, short: 'She-dən sonra ’s (is) lazımdır.', explain: ex("She's from Azerbaijan.", '“-dandır” hissəsi ingiliscə ayrıca gəlir: ’s.', "She's from Azerbaijan. — düzdür; She from Azerbaijan. — olmur.", "Where's she from? — She's from Turkey.") },
          other("She's from Azerbaijan.", ex("She's from Azerbaijan.", 'Sual qız haqqındadır: She’s from, sonra ölkə.', "She's from Azerbaijan. — ölkə; She's Azerbaijani. — millət.", "Where's she from? — She's from Turkey.")),
        ],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u3d5b_c13', number: 13, title: 'Söhbəti sırala', why: 'Sual, cavab, yoxlama və təsdiq düz sıradadır.', hint: 'Əvvəl haradan olduğu soruşulur, sonra millət yoxlanır.',
      prompt: 'Hostelin mətbəxi. Yeni tanış qızdan otaq yoldaşını soruşur.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: "Where's he from?", from: 'other' }, { en: '2', az: "He's from Georgia.", from: 'G' }, { en: '3', az: 'Is he Georgian?', from: 'other' }, { en: '4', az: 'Yes, he is.', from: 'G' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Where's he from? → He's from Georgia. → Is he Georgian? → Yes, he is.", 'Sual, cavab, millətlə yoxlama, sonra qısa təsdiq.', "Is he Georgian? — sual; Yes, he is. — cavab.", "Where's he from? — He's from Georgia."))],
      review: {
        title: 'Söhbəti sırala', why: 'Yoxlama, “xeyr” cavabı, sual və cavab düz sıradadır.', hint: 'Əvvəl bəli/xeyr sualı gəlir; “xeyr”dən sonra nə soruşulur?',
        prompt: 'Qatar. Bələdçi oğlandan yanındakı qadını soruşur.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: 'Is she from Russia?', from: 'other' }, { en: '2', az: "No, she isn't.", from: 'B' }, { en: '3', az: "Where's she from?", from: 'other' }, { en: '4', az: "She's from Georgia.", from: 'B' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Is she from Russia? → No, she isn't. → Where's she from? → She's from Georgia.", '“Xeyr” cavabından sonra haradan olduğu soruşulur.', "Is she from Russia? — bəli/xeyr sualı; Where's she from? — haradan.", "Is she from Iran? — No, she isn't."))],
      },
    },
  ],
  result: {
    done: ['Dərs 5 · 2-ci hissə tamamlandı', 'Artıq başqasının haradan olduğunu soruşur və qısa cavab verə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Başqası haqqında sualı anlamaq və qısa cavabı seçmək', tasks: ['u3d5b_c03', 'u3d5b_c08', 'u3d5b_c10', 'u3d5b_c13'] },
      { group: 'Yazı', text: 'Sual qurmaq və başqasının haradan olduğunu yazmaq', tasks: ['u3d5b_c06', 'u3d5b_c12'] },
      { group: 'Danışıq', text: 'Haradan olduğunu soruşmaq və qısa cavab vermək', tasks: ['u3d5b_c04', 'u3d5b_c11'] },
    ],
    closing: 'Növbəti dərs — harada yaşayırsan?', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: "Where's he from? · Where's she from?", translation: 'O haradandır?', example: "Where's she from? — She's from Turkey.", exampleAz: 'O haradandır? — Türkiyədəndir.', usageNote: "Kişi üçün he, qadın üçün she. Where's — where is.", pronunciation: '/wɛrz hi frʌm/ · /wɛrz ʃi frʌm/', teachCard: 'u3d5b_c02' },
    { word: 'Is she …? · Is he …?', translation: 'O …-dırmı?', example: 'Is she Turkish?', exampleAz: 'O türkdürmü?', usageNote: 'Sualda is əvvələ keçir.', pronunciation: '/ɪz ʃi/ · /ɪz hi/', teachCard: 'u3d5b_c05' },
    { word: 'Yes, he is.', translation: 'Bəli, elədir.', example: 'Is he Georgian? — Yes, he is.', exampleAz: 'O gürcüdürmü? — Bəli, elədir.', usageNote: 'Qısa cavabın sonunda is qalır.', pronunciation: '/jɛs hi ɪz/', teachCard: 'u3d5b_c07' },
    { word: "No, she isn't.", translation: 'Xeyr, o deyil.', example: "Is she from Iran? — No, she isn't.", exampleAz: 'O İrandandırmı? — Xeyr.', usageNote: "isn't — is not.", pronunciation: '/noʊ ʃi ˈɪzənt/', teachCard: 'u3d5b_c09' },
  ],
};
