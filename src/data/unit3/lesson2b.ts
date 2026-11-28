// Bölmə 3 · Dərs 2 · 3-cü hissə — Ölkələr (the UK · England · the USA); 4-cü hissə (lesson2b_2): Germany · France.
// Hostel, hava limanı, qatar. Tipik səhvlər: “the”-ni atmaq (from UK), “the England”, Germany ↔ “Almaniya”.
// Spiral: Where are you from? I'm from …, Me too (Dərs 1); country, Turkey, Georgia, Russia, Iran (1-ci hissə); hərflər (Bölmə 2).
import type { DesignLesson, Variant } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { FROM_RETURN, notices, own, resultTexts, said } from './shared';

const fromAndAsk = own(FROM_RETURN, "I'm from Azerbaijan. And you?");
/** Role play: the learner is from a given country (“the” must stay where it belongs). */
const fromPlace = (pattern: string, ...answers: string[]) => said(String.raw`^(?:i'?m|i am)\s+from\s+(?:${pattern})\s*[.!]?$`, ...answers);
/** “I'm Azerbaijan” (from is missing), “I from …” (am is missing), no return question. */
const fromMistakes: Variant[] = [
  { match: { pattern: String.raw`^(?:i'?m|i am)\s+(?!from\b)\p{L}` }, short: 'Ölkədən əvvəl “from” lazımdır.',
    explain: ex("I'm from Azerbaijan. And you?", 'Azərbaycancada “-dan” şəkilçidir; ingiliscə ölkədən əvvəl ayrıca “from” gəlir.', "I'm from Azerbaijan. — haradan; I'm fine. — hal.", "Where are you from? — I'm from Azerbaijan. And you?") },
  { match: { pattern: String.raw`^i\s+from\b` }, short: 'I-dan sonra am lazımdır.',
    explain: ex("I'm from Azerbaijan. And you?", 'Azərbaycancada “-am” şəkilçidir, ingiliscə I-dan sonra ayrıca gəlir.', "I'm from Azerbaijan. — düzdür; I from Azerbaijan. — olmur.", "Where are you from? — I'm from Azerbaijan. And you?") },
  { match: { pattern: String.raw`^(?:i'?m|i am)\s+from\s+[^?]*$` }, short: 'Ondan da soruşmağı unutma.',
    explain: ex("I'm from Azerbaijan. And you?", 'Haradan olduğunu dedin, amma ondan soruşmadın.', "I'm from Azerbaijan. And you? — cavab və sual; I'm from Azerbaijan. — yalnız cavab.", "I'm from Baku. And you?") },
];

export const lesson2b: DesignLesson = {
  id: 'a1_en_b3_d2b', order: 42, unit: 3, number: 2, part: 3, title: 'Ölkələr', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d2b_c01', badge: 'Haradansan', subtitle: 'Hosteldə və hava limanında uzaq ölkələrdən gələnlərlə tanış olursan.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Böyük Britaniya, İngiltərə və ABŞ-ın ingiliscə adını eşidib tanıyıram.' },
        { icon: 'wave', text: '“the” sözünü ölkə adının əvvəlində yerində işlədirəm.' },
      ],
    },
    {
      type: 'word', id: 'u3d2b_c02', number: 2, scenes: ['u3/word-uk'],
      word: 'the UK', pronunciation: '/ðə ˌjuˈkeɪ/', reading: '**th**ə yu-key', az: 'Böyük Britaniya',
      structure: ['from + the UK'],
      notes: ['Bu ölkənin adından əvvəl “the” gəlir və atılmır.'],
      example: "I'm from the UK.", exampleAz: 'Böyük Britaniyadanam.',
    },
    {
      type: 'choice', id: 'u3d2b_c03', number: 3, title: 'Sözü tamamla', why: 'the UK — “the” atılmır.', hint: 'Bu ölkənin adından əvvəl kiçik bir söz gəlir.',
      prompt: 'Hosteldə yeni tanış haradan olduğunu deyir.\nHansı söz çatmır?', gap: { speaker: 'other', before: "I'm from", after: 'UK.' },
      options: ['the', 'is', 'at'], answer: 'the',
      variants: [
        pick('is', '“from is” olmur.', ex('the', 'UK-dan əvvəl “the” gəlir.', "I'm from the UK. — düzdür; I'm from is UK. — olmur.", "I'm from the UK.")),
        pick('at', '“at” e-poçtda @ deməkdir.', ex('the', 'Bu ölkənin adından əvvəl “the” gəlir.', "I'm from the UK. — ölkə; at — @ (e-poçtda).", "I'm from the UK.")),
      ],
      review: {
        title: 'Sözü tamamla', why: 'the USA — “the” atılmır.', hint: 'Bu ölkənin adından əvvəl kiçik bir söz gəlir.',
        prompt: 'Hava limanında oğlan yeni tanışa haradan olduğunu deyir.\nHansı söz çatmır?', gap: { speaker: 'B', before: "I'm from", after: 'USA.' },
        options: ['at', 'the', 'my'], answer: 'the',
        variants: [
          pick('at', '“at” e-poçtda @ deməkdir.', ex('the', 'Bu ölkənin adından əvvəl “the” gəlir.', "I'm from the USA. — ölkə; at — @ (e-poçtda).", "I'm from the USA.")),
          pick('my', '“my” — mənim; ölkə adından əvvəl gəlmir.', ex('the', 'USA-dan əvvəl “the” gəlir.', "I'm from the USA. — düzdür; I'm from my USA. — olmur.", "I'm from the USA.")),
        ],
      },
    },
    {
      type: 'word', id: 'u3d2b_c04', number: 4, scenes: ['u3/word-england'],
      word: 'England', pronunciation: '/ˈɪŋɡlənd/', reading: 'inqlənd', az: 'İngiltərə',
      notes: ['England-dən əvvəl “the” gəlmir.'],
      example: "I'm from England.", exampleAz: 'İngiltərədənəm.',
    },
    {
      type: 'choice', id: 'u3d2b_c05', number: 5, title: 'Seçim', why: '“I’m from England.” — from var, the yoxdur.', hint: 'Hər variantı yavaş oxu: hansında bütün sözlər yerindədir?',
      prompt: 'Hosteldə yeni tanış Londondandır. Sən soruşursan: “Where are you from?”\nO necə cavab verər?',
      options: ["I'm from England.", "I'm from the England.", "I'm England."], answer: "I'm from England.",
      variants: [
        pick("I'm from the England.", 'England-dən əvvəl “the” gəlmir.', ex("I'm from England.", '“the” yalnız bəzi ölkələrdən əvvəl gəlir.', "I'm from England. — “the”siz; I'm from the UK. — “the” ilə.", "I'm from England.")),
        pick("I'm England.", '“from” çatmır.', ex("I'm from England.", 'Haradan olduğunu deyəndə “from” lazımdır.', "I'm from England. — haradan; I'm fine. — hal.", "I'm from England.")),
      ],
      review: {
        title: 'Seçim', why: '“I’m from Turkey.” — I’m və from yerindədir.', hint: 'Hər variantı yavaş oxu: hansında bütün sözlər yerindədir?',
        prompt: 'Qatarda yeni tanış İstanbuldandır. Sən soruşursan: “What country are you from?”\nO necə cavab verər?',
        options: ["I'm from the Turkey.", "I from Turkey.", "I'm from Turkey."], answer: "I'm from Turkey.",
        variants: [
          pick("I'm from the Turkey.", 'Turkey-dən əvvəl “the” gəlmir.', ex("I'm from Turkey.", '“the” yalnız bəzi ölkələrdən əvvəl gəlir.', "I'm from Turkey. — “the”siz; I'm from the UK. — “the” ilə.", "I'm from Turkey.")),
          pick('I from Turkey.', 'I-dan sonra am lazımdır.', ex("I'm from Turkey.", 'Azərbaycancada “-am” şəkilçidir, ingiliscə I-dan sonra ayrıca gəlir.', "I'm from Turkey. — düzdür; I from Turkey. — olmur.", "I'm from Turkey.")),
        ],
      },
    },
    {
      type: 'word', id: 'u3d2b_c06', number: 6, scenes: ['u3/word-usa'],
      word: 'the USA', pronunciation: '/ðə ˌjuɛsˈeɪ/', reading: '**th**ə yu-es-ey', az: 'ABŞ',
      structure: ['from + the USA'],
      notes: ['Burada da “the” gəlir: the USA, the UK.'],
      example: "I'm from the USA.", exampleAz: 'ABŞ-danam.',
    },
    {
      type: 'write', id: 'u3d2b_c07', number: 7, title: 'Dinlə və yaz', why: 'the USA — “the” də yazılır.', hint: '“from”dan sonra eşitdiyin hər sözü yaz.',
      prompt: '“from”dan sonra eşitdiyini yaz.', audio: "Hi! I'm from the USA.", placeholder: 'Ölkə',
      rule: exact('the USA', "I'm from the USA."),
      variants: [
        { match: { words: ['USA'] }, short: '“the” də eşidilir.', explain: ex('the USA', 'Səsdə “from”dan sonra “the USA” var.', "I'm from the USA. — düzdür; I'm from USA. — olmur.", "I'm from the USA.") },
        other('Bir daha dinlə.', ex('the USA', 'Səsdə “the” və U, S, A hərfləri var.', "I'm from the USA. — ABŞ; I'm from the UK. — Böyük Britaniya.", "I'm from the USA.")),
      ],
      review: {
        title: 'Dinlə və yaz', why: 'the UK — “the” də yazılır.', hint: '“from”dan sonra eşitdiyin hər sözü yaz.',
        prompt: '“from”dan sonra eşitdiyini yaz.', audio: "Hello! I'm from the UK.", placeholder: 'Ölkə',
        rule: exact('the UK', "I'm from the UK."),
        variants: [
          { match: { words: ['UK'] }, short: '“the” də eşidilir.', explain: ex('the UK', 'Səsdə “from”dan sonra “the UK” var.', "I'm from the UK. — düzdür; I'm from UK. — olmur.", "I'm from the UK.") },
          other('Bir daha dinlə.', ex('the UK', 'Səsdə “the” və U, K hərfləri var.', "I'm from the UK. — Böyük Britaniya; I'm from the USA. — ABŞ.", "I'm from the UK.")),
        ],
      },
    },
    {
      type: 'voice', id: 'u3d2b_c15', number: 8, title: 'Səslə cavab', why: 'Ölkəni “the” ilə birlikdə düz dedin.', hint: 'Bu ölkənin adından əvvəl kiçik söz gəlirmi? Yadına sal.',
      prompt: 'Dil klubunda rol oyunu: sən Londondan gələn qonaqsan. Yeni tanış soruşur.\nHansı ölkədən olduğunu de.', audio: 'What country are you from?', reply: 'Nice to meet you!',
      rule: fromPlace(String.raw`england|the\s+uk`, "I'm from England.", "I'm from the UK."),
      variants: [
        { match: { pattern: String.raw`\bfrom\s+uk\b` }, short: 'UK-dan əvvəl “the” gəlir.', explain: ex("I'm from the UK.", 'Bu ölkənin adı “the” ilə deyilir: the UK.', "I'm from the UK. — düzdür; I'm from UK. — olmur.", "What country are you from? — I'm from the UK.") },
        { match: { pattern: String.raw`\bthe\s+england\b` }, short: 'England-dən əvvəl “the” gəlmir.', explain: ex("I'm from England.", '“the” yalnız bəzi ölkələrdən əvvəl gəlir.', "I'm from England. — “the”siz; I'm from the UK. — “the” ilə.", "What country are you from? — I'm from England.") },
        { match: { pattern: String.raw`^(?:i'?m|i am)\s+(?!from\b)\p{L}` }, short: 'Ölkədən əvvəl “from” lazımdır.', explain: ex("I'm from England.", 'Haradan olduğunu deyəndə “from” lazımdır.', "I'm from England. — haradan; I'm fine. — hal.", "What country are you from? — I'm from England.") },
        other("I'm from + ölkə.", ex("I'm from England.", 'Rol oyununda Londondansan — ölkə İngiltərədir.', "I'm from England. — “the”siz; I'm from the UK. — “the” ilə.", "What country are you from? — I'm from England.")),
      ],
      review: {
        title: 'Səslə cavab', why: 'Ölkəni “the” ilə birlikdə düz dedin.', hint: 'Bu ölkənin adından əvvəl kiçik söz gəlirmi? Yadına sal.',
        prompt: 'Rol oyunu: sən Nyu-Yorkdan gələn turistsən. Hostelin resepsiyasında işçi soruşur.\nHansı ölkədən olduğunu de.', audio: 'Hello! Where are you from?', reply: 'Thank you!',
        rule: fromPlace(String.raw`the\s+usa`, "I'm from the USA."),
        variants: [
          { match: { pattern: String.raw`\bfrom\s+usa\b` }, short: 'USA-dan əvvəl “the” gəlir.', explain: ex("I'm from the USA.", 'Bu ölkənin adı “the” ilə deyilir: the USA.', "I'm from the USA. — düzdür; I'm from USA. — olmur.", "Where are you from? — I'm from the USA.") },
          { match: { pattern: String.raw`^(?:i'?m|i am)\s+(?!from\b)\p{L}` }, short: 'Ölkədən əvvəl “from” lazımdır.', explain: ex("I'm from the USA.", 'Haradan olduğunu deyəndə “from” lazımdır.', "I'm from the USA. — haradan; I'm fine. — hal.", "Where are you from? — I'm from the USA.") },
          other("I'm from the USA.", ex("I'm from the USA.", 'Rol oyununda Nyu-Yorkdansan — ölkə ABŞ-dır.', "I'm from the USA. — “the” ilə; I'm from England. — “the”siz.", "Where are you from? — I'm from the USA.")),
        ],
      },
    },
  ],
  result: {
    done: ['Dərs 2 · 3-cü hissə tamamlandı', 'Artıq Böyük Britaniya, İngiltərə və ABŞ-ın ingiliscə adını tanıyır, “the”-ni yerində işlədirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Ölkə adlarını və “the”-ni tanımaq', tasks: ['u3d2b_c03', 'u3d2b_c05'] },
      { group: 'Yazı', text: 'Eşitdiyin ölkəni yazmaq', tasks: ['u3d2b_c07'] },
      { group: 'Danışıq', text: 'Hansı ölkədən olduğunu “the” ilə düz demək', tasks: ['u3d2b_c15'] },
    ],
    closing: 'Növbəti hissə — Almaniya və Fransa.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'the UK', translation: 'Böyük Britaniya', example: "I'm from the UK.", exampleAz: 'Böyük Britaniyadanam.', usageNote: '“the” atılmır.', pronunciation: '/ðə ˌjuˈkeɪ/', teachCard: 'u3d2b_c02' },
    { word: 'England', translation: 'İngiltərə', example: "I'm from England.", exampleAz: 'İngiltərədənəm.', usageNote: '“the” gəlmir.', pronunciation: '/ˈɪŋɡlənd/', teachCard: 'u3d2b_c04' },
    { word: 'the USA', translation: 'ABŞ', example: "I'm from the USA.", exampleAz: 'ABŞ-danam.', usageNote: '“the” atılmır.', pronunciation: '/ðə ˌjuɛsˈeɪ/', teachCard: 'u3d2b_c06' },
  ],
};

// Dərs 2 · 4-cü hissə (26 Nov 2026: the lesson was split, nothing removed): Germany · France.
export const lesson2b_2: DesignLesson = {
  id: 'a1_en_b3_d2b_2', order: 43, unit: 3, number: 2, part: 4, title: 'Ölkələr', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d2b_c20', badge: 'Haradansan', subtitle: 'Hosteldə və hava limanında Almaniya və Fransadan gələnlərlə tanış olursan.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Almaniya və Fransanın ingiliscə adını eşidib tanıyıram.' },
        { icon: 'wave', text: 'Haradan olduğumu deyib qarşı tərəfdən də soruşa bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u3d2b_c08', number: 8, scenes: ['u3/word-germany'],
      word: 'Germany', pronunciation: '/ˈdʒɝməni/', reading: 'cörməni', az: 'Almaniya',
      notes: ['“Almaniya” yox: ingiliscə Germany, “cörməni” oxunur.'],
      example: "I'm from Germany.", exampleAz: 'Almaniyadanam.',
    },
    {
      type: 'voice', id: 'u3d2b_c09', number: 9, title: 'Dinlə və təkrarla', why: 'Cümləni dedin; Germany — “cörməni”.', hint: 'Əvvəl yavaş dinlə, sonra sözləri bir-bir de.',
      prompt: 'Hostelin resepsiyasında qonaq Almaniyadan olduğunu deyir.\nDinlə, sonra eyni cür de.', audio: "I'm from Germany.", repeat: { stress: 'Ger', note: 'Germany — “cörməni”: G burada “c” oxunur.', reading: 'aym fram cörməni' },
      rule: exact("I'm from Germany."),
      variants: [other('Bir daha dinlə və yavaş de.', ex("I'm from Germany.", '“Germany” “cörməni” kimi oxunur, “Almaniya” deyilmir.', "I'm from Germany. — Almaniyadan; I'm from the USA. — ABŞ-dan.", "I'm from Germany."))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Cümləni dedin; the UK — “**th**ə yu-key”.', hint: 'Əvvəl yavaş dinlə, sonra sözləri bir-bir de.',
        prompt: 'Kafedə yeni tanış haradan olduğunu deyir.\nDinlə, sonra eyni cür de.', audio: "I'm from the UK.", repeat: { stress: 'UK', note: '“the” — dil dişlərin arasına gəlir.', reading: 'aym fram **th**ə yu-key' },
        rule: exact("I'm from the UK."),
        variants: [other('Bir daha dinlə və yavaş de.', ex("I'm from the UK.", '“the” atılmır və dil dişlərin arasında deyilir.', "I'm from the UK. — düzdür; I'm from UK. — olmur.", "I'm from the UK."))],
      },
    },
    {
      type: 'choice', id: 'u3d2b_c16', number: 10, title: 'Seçim', why: '“I’m from Germany.” — from var, the yoxdur.', hint: 'Hər variantı yavaş oxu: hansında bütün sözlər yerindədir?',
      prompt: 'Hosteldə yeni tanış Berlindəndir. Sən soruşursan: “Where are you from?”\nO necə cavab verər?',
      options: ["I'm Germany.", "I'm from Germany.", "I'm from the Germany."], answer: "I'm from Germany.",
      variants: [
        pick("I'm from the Germany.", 'Germany-dən əvvəl “the” gəlmir.', ex("I'm from Germany.", '“the” yalnız bəzi ölkələrdən əvvəl gəlir.', "I'm from Germany. — “the”siz; I'm from the USA. — “the” ilə.", "I'm from Germany.")),
        pick("I'm Germany.", '“from” çatmır.', ex("I'm from Germany.", 'Haradan olduğunu deyəndə “from” lazımdır.', "I'm from Germany. — haradan; I'm fine. — hal.", "I'm from Germany.")),
      ],
      review: {
        title: 'Seçim', why: '“I’m from France.” — I’m və from yerindədir.', hint: 'Hər variantı yavaş oxu: hansında bütün sözlər yerindədir?',
        prompt: 'Qatarda yeni tanış Parisdəndir. Sən soruşursan: “What country are you from?”\nO necə cavab verər?',
        options: ["I'm from the France.", "I'm from France.", "I from France."], answer: "I'm from France.",
        variants: [
          pick("I'm from the France.", 'France-dan əvvəl “the” gəlmir.', ex("I'm from France.", '“the” yalnız bəzi ölkələrdən əvvəl gəlir.', "I'm from France. — “the”siz; I'm from the USA. — “the” ilə.", "I'm from France.")),
          pick('I from France.', 'I-dan sonra am lazımdır.', ex("I'm from France.", 'Azərbaycancada “-am” şəkilçidir, ingiliscə I-dan sonra ayrıca gəlir.', "I'm from France. — düzdür; I from France. — olmur.", "I'm from France.")),
        ],
      },
    },
    {
      type: 'word', id: 'u3d2b_c10', number: 10, scenes: ['u3/word-france'],
      word: 'France', pronunciation: '/fræns/', reading: 'frəns', az: 'Fransa',
      notes: ['“Fransa” yox, “frəns” oxunur.'],
      example: "I'm from France.", exampleAz: 'Fransadanam.',
    },
    {
      type: 'choice', map: 'world', id: 'u3d2b_c14', number: 11, title: 'Xəritədə tap', why: 'Germany — Almaniya.', hint: 'Bu ölkə Avropadadır, xəritədə Fransa ilə Rusiyanın arasında.',
      prompt: 'Hava limanında elan: təyyarə hansı ölkəyə uçur?\nDinlə və xəritədə ölkəyə toxun.', audio: 'Germany.',
      options: ['France', 'the UK', 'Germany'], answer: 'Germany',
      variants: [
        pick('France', 'Səsdə “France” yox, “Germany” deyilir.', ex('Germany', 'Germany “cörməni” oxunur və Almaniyadır.', "I'm from Germany. — Almaniyadanam; I'm from France. — Fransadanam.", "I'm from Germany.")),
        pick('the UK', 'Səsdə “the UK” yox, “Germany” deyilir.', ex('Germany', 'Germany “cörməni” oxunur və Almaniyadır.', "I'm from Germany. — Almaniyadanam; I'm from the UK. — Böyük Britaniyadanam.", "I'm from Germany.")),
      ],
      review: {
        title: 'Xəritədə tap', why: 'the USA — ABŞ.', hint: 'Bu ölkə xəritədə ən qərbdədir, okeanın o tayında.',
        prompt: 'Hosteldə yeni tanış haradan olduğunu deyir.\nDinlə və xəritədə ölkəyə toxun.', audio: "I'm from the USA.",
        options: ['the USA', 'France', 'Germany'], answer: 'the USA',
        variants: [
          pick('France', 'Səsdə “France” yox, “the USA” deyilir.', ex('the USA', 'the USA — ABŞ; hərf-hərf “yu-es-ey” deyilir.', "I'm from the USA. — ABŞ-danam; I'm from France. — Fransadanam.", "I'm from the USA.")),
          pick('Germany', 'Səsdə “Germany” yox, “the USA” deyilir.', ex('the USA', 'the USA — ABŞ; hərf-hərf “yu-es-ey” deyilir.', "I'm from the USA. — ABŞ-danam; I'm from Germany. — Almaniyadanam.", "I'm from the USA.")),
        ],
      },
    },
    {
      type: 'write', id: 'u3d2b_c11', number: 11, letters: ['F', 'R', 'A', 'N', 'C', 'E', 'S', 'I'], title: 'Hərfləri tut', why: 'F-R-A-N-C-E — Fransa.', hint: 'Hər hərfi eşidən kimi toxun; “si” və “es” səslərini qarışdırma.',
      prompt: 'Eşitdiyin hərflərə toxun.', audio: "It's F-R-A-N-C-E.", placeholder: 'Ölkə',
      rule: exact('FRANCE'),
      variants: [other('Hərfləri bir-bir dinlə.', ex('FRANCE', 'Səsdə F, R, A, N, C, E deyilir: C “si”, E “i” oxunur.', 'C — si; S — es.', "It's F-R-A-N-C-E."))],
      review: {
        letters: ['E', 'N', 'G', 'L', 'A', 'N', 'D', 'I', 'J'], title: 'Hərfləri tut', why: 'E-N-G-L-A-N-D — İngiltərə.', hint: 'Hər hərfi eşidən kimi toxun; “ci” və “cey” səslərini qarışdırma.',
        prompt: 'Eşitdiyin hərflərə toxun.', audio: "It's E-N-G-L-A-N-D.", placeholder: 'Ölkə',
        rule: exact('ENGLAND'),
        variants: [other('Hərfləri bir-bir dinlə.', ex('ENGLAND', 'Səsdə E, N, G, L, A, N, D deyilir: G “ci” oxunur.', 'G — ci; J — cey.', "It's E-N-G-L-A-N-D."))],
      },
    },
    {
      type: 'match', id: 'u3d2b_c12', number: 12, title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
      prompt: 'Hostelin mətbəxində tanışlıq.\nHər cümləyə mənasını qoş.',
      rows: [{ en: "I'm from Germany.", az: 'Almaniyadanam.', from: 'other' }, { en: "I'm from France.", az: 'Fransadanam.', from: 'G' }, { en: "I'm from the USA.", az: 'ABŞ-danam.', from: 'B' }],
      extra: ['İngiltərədənəm.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex("I'm from Germany. — Almaniyadanam.; I'm from France. — Fransadanam.; I'm from the USA. — ABŞ-danam.", 'Ölkə adları ingiliscə başqa cür səslənir.', "I'm from Germany. — Almaniyadan; I'm from the USA. — ABŞ-dan.", "I'm from Germany."))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
        prompt: 'Hava limanında gözləmə zalında söhbət.\nHər cümləyə mənasını qoş.',
        rows: [{ en: "I'm from England.", az: 'İngiltərədənəm.', from: 'other' }, { en: "I'm from the UK.", az: 'Böyük Britaniyadanam.', from: 'G' }, { en: 'What country are you from?', az: 'Hansı ölkədənsən?', from: 'B' }],
        extra: ['Fransadanam.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("I'm from England. — İngiltərədənəm.; I'm from the UK. — Böyük Britaniyadanam.; What country are you from? — Hansı ölkədənsən?", 'England İngiltərədir, the UK isə Böyük Britaniya.', "I'm from England. — İngiltərədən; I'm from the UK. — Böyük Britaniyadan.", 'What country are you from?'))],
      },
    },
    {
      type: 'choice', id: 'u3d2b_c17', number: 13, title: 'Söhbəti tamamla', why: 'France-dan əvvəl “the” gəlmir.', hint: 'Yeni tanış hansı ölkədəndir? Bu adın əvvəlinə nəsə gəlirmi?',
      prompt: 'Hava limanında söhbət. Yeni tanış Parisdəndir.\nSöhbətdə bir söz əskikdir. Düzgün sözü seç.',
      dialog: [{ from: 'G', text: 'Hi! Where are you from?' }],
      gap: { speaker: 'other', before: "I'm from", after: '. And you?' }, options: ['France', 'the France', 'Germany'], answer: 'France',
      variants: [
        pick('the France', 'France-dan əvvəl “the” gəlmir.', ex('France', '“the” yalnız bəzi ölkələrdən əvvəl gəlir.', "I'm from France. — “the”siz; I'm from the UK. — “the” ilə.", "I'm from France. And you?")),
        pick('Germany', 'Paris Almaniyada deyil.', ex('France', 'Paris Fransadadır: France.', "I'm from France. — Fransadan; I'm from Germany. — Almaniyadan.", "I'm from France. And you?")),
      ],
      review: {
        title: 'Söhbəti tamamla', why: 'Germany-dən əvvəl “the” gəlmir.', hint: 'Yeni tanış hansı ölkədəndir? Bu adın əvvəlinə nəsə gəlirmi?',
        prompt: 'Qatarda söhbət. Yeni tanış Berlindəndir.\nSöhbətdə bir söz əskikdir. Düzgün sözü seç.',
        dialog: [{ from: 'B', text: 'Excuse me, where are you from?' }],
        gap: { speaker: 'other', before: "I'm from", after: '. And you?' }, options: ['the Germany', 'France', 'Germany'], answer: 'Germany',
        variants: [
          pick('the Germany', 'Germany-dən əvvəl “the” gəlmir.', ex('Germany', '“the” yalnız bəzi ölkələrdən əvvəl gəlir.', "I'm from Germany. — “the”siz; I'm from the USA. — “the” ilə.", "I'm from Germany. And you?")),
          pick('France', 'Berlin Fransada deyil.', ex('Germany', 'Berlin Almaniyadadır: Germany.', "I'm from Germany. — Almaniyadan; I'm from France. — Fransadan.", "I'm from Germany. And you?")),
        ],
      },
    },
    {
      type: 'voice', id: 'u3d2b_c13', number: 13, title: 'Cavab ver və soruş', why: 'Haradan olduğunu dedin və ondan da soruşdun.', hint: 'Əvvəl öz cavabını de, sonra Bölmə 1-dən tanıdığın qısa geri sualı əlavə et.',
      prompt: 'Hostelin mətbəxində yeni tanış soruşur.\nHaradan olduğunu de və ondan da soruş.', audio: 'Hi! Where are you from?', reply: "I'm from Germany.",
      rule: fromAndAsk,
      variants: [...fromMistakes, other("I'm from [ölkə]. And you?", ex("I'm from Azerbaijan. And you?", 'Əvvəl haradan olduğunu deyirsən, sonra qısa sualla ondan soruşursan.', "I'm from Azerbaijan. And you? — cavab və sual; Me too! — mən də.", "I'm from Baku. And you?"))],
      review: {
        title: 'Cavab ver və soruş', why: 'Haradan olduğunu dedin və ondan da soruşdun.', hint: 'Əvvəl öz cavabını de, sonra Bölmə 1-dən tanıdığın qısa geri sualı əlavə et.',
        prompt: 'Qatarda yanındakı sərnişin soruşur.\nHaradan olduğunu de və ondan da soruş.', audio: 'Excuse me, where are you from?', reply: "I'm from France.",
        rule: fromAndAsk,
        variants: [...fromMistakes, other("I'm from [ölkə]. And you?", ex("I'm from Azerbaijan. And you?", 'Əvvəl haradan olduğunu deyirsən, sonra qısa sualla ondan soruşursan.', "I'm from Azerbaijan. And you? — cavab və sual; Me too! — mən də.", "I'm from Ganja. And you?"))],
      },
    },
  ],
  result: {
    done: ['Dərs 2 · 4-cü hissə tamamlandı', 'Artıq uzaq ölkələrin ingiliscə adını tanıyır, “the”-ni yerində işlədir və haradan olduğunu deyib geri soruşa bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Ölkə adlarını eşidib tanımaq', tasks: ['u3d2b_c16', 'u3d2b_c14', 'u3d2b_c11', 'u3d2b_c12', 'u3d2b_c17'] },
      { group: 'Danışıq', text: 'Ölkə adını demək, haradan olduğunu deyib geri soruşmaq', tasks: ['u3d2b_c09', 'u3d2b_c13'] },
    ],
    closing: 'Növbəti dərs — millət: azərbaycanlı, türk, rus, gürcü.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'Germany', translation: 'Almaniya', example: "I'm from Germany.", exampleAz: 'Almaniyadanam.', usageNote: '“cörməni” oxunur.', pronunciation: '/ˈdʒɝməni/', teachCard: 'u3d2b_c08' },
    { word: 'France', translation: 'Fransa', example: "I'm from France.", exampleAz: 'Fransadanam.', usageNote: '“frəns” oxunur.', pronunciation: '/fræns/', teachCard: 'u3d2b_c10' },
  ],
};
