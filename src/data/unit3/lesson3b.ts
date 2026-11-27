// Bölmə 3 · Dərs 3, 3-cü hissə — Millət (English · American · German); 4-cü hissə (lesson3b_2): French · nationality.
// Hostel qeydiyyatı və pasport nəzarəti; “Formanı doldur” — First name, Last name, Nationality. “Azeri” sözü işlənmir (qayda 20).
// Spiral: first name, last name (Bölmə 2), I'm Azerbaijani., Turkish, Russian (Dərs 3a), England, the USA, Germany, France (Dərs 2).
import type { DesignLesson, Variant } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { NAME } from '../unit2/shared';
import { NATIONALITY_FIELD, notices, own, resultTexts } from './shared';

/** Nationality said aloud after “Nationality?”: “Azerbaijani.” or “I'm Azerbaijani.” (“Azeri” and country names are not accepted). */
const NATIONALITY_SAID = String.raw`^(?:(?:i'?m|i am)\s+)?(?!azeri\b)(?:azerbaijani|turkish|russian|georgian|english|american|german|french|british|\p{L}+(?:ian|ish|ese))\s*[.!]?$`;
const COUNTRY_MISTAKE: Variant = {
  match: { pattern: String.raw`^(?:(?:i'?m|i am)\s+)?(?:from\s+)?(?:azerbaijan|turkey|russia|georgia|iran|england|germany|france|the\s+usa|the\s+uk)\s*[.!]?$` }, short: 'Ölkə yox, millət lazımdır.',
  explain: ex('Azerbaijani.', 'Nationality soruşulanda ölkə adı yox, millət deyilir.', 'Nationality? — Azerbaijani. ; Where are you from? — Azerbaijan.', 'Nationality? — Azerbaijani.'),
};

export const lesson3b: DesignLesson = {
  id: 'a1_en_b3_d3b', order: 46, unit: 3, number: 3, part: 3, title: 'Millət', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d3b_c01', badge: 'Haradansan', subtitle: 'Hosteldə və dil klubunda ingilis, amerikalı və alman qonaqlarla tanış olursan.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'İngilis, amerikalı və alman sözlərini tanıya bilirəm.' },
        { icon: 'wave', text: 'Ölkə ilə millət sözünü ayıra bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u3d3b_c02', number: 2, scenes: ['mascot/globe'],
      word: 'English', pronunciation: '/ˈɪŋɡlɪʃ/', reading: 'inqliş', az: 'ingilis',
      structure: ['England — ölkə; English — millət.'],
      notes: ['Böyük hərflə yazılır: English.'],
      example: "I'm from England. I'm English.", exampleAz: 'Mən İngiltərədənəm. İngilisəm.',
    },
    {
      type: 'choice', id: 'u3d3b_c03', number: 3, title: 'Düz yazını seç', why: 'Millət böyük hərflə yazılır: English.', hint: 'Həm hərfin böyüklüyünə, həm sözün sonuna bax.',
      prompt: 'Hostelin qeydiyyat vərəqində ingilis qonağın milləti yazılıb.\nHansı yazı düzdür?',
      options: ['English', 'english', 'England'], answer: 'English',
      variants: [
        pick('english', 'Millət sözü böyük hərflə yazılır.', ex('English', 'Azərbaycancada “ingilis” kiçik hərflə yazılır, ingiliscə isə böyük hərflə.', "I'm English. — düzdür; I'm english. — olmur.", "I'm from England. I'm English.")),
        pick('England', 'England ölkədir, millət deyil.', ex('English', 'Millət sahəsinə ölkə adı yox, millət yazılır.', "I'm English. — millət; I'm from England. — ölkə.", "I'm from England. I'm English.")),
      ],
      review: {
        title: 'Düz yazını seç', why: 'Millət böyük hərflə yazılır: Russian.', hint: 'Həm hərfin böyüklüyünə, həm sözün sonuna bax.',
        prompt: 'Qatarda bilet siyahısında rus sərnişinin milləti yazılıb.\nHansı yazı düzdür?',
        options: ['Russia', 'Russian', 'russian'], answer: 'Russian',
        variants: [
          pick('russian', 'Millət sözü böyük hərflə yazılır.', ex('Russian', 'Azərbaycancada “rus” kiçik hərflə yazılır, ingiliscə isə böyük hərflə.', "I'm Russian. — düzdür; I'm russian. — olmur.", "I'm from Russia. I'm Russian.")),
          pick('Russia', 'Russia ölkədir, millət deyil.', ex('Russian', 'Millət sahəsinə ölkə adı yox, millət yazılır.', "I'm Russian. — millət; I'm from Russia. — ölkə.", "I'm from Russia. I'm Russian.")),
        ],
      },
    },
    {
      type: 'word', id: 'u3d3b_c04', number: 4, scenes: ['mascot/point'],
      word: 'American', pronunciation: '/əˈmɛrɪkən/', reading: 'əmerikən', az: 'amerikalı',
      structure: ['the USA — ölkə; American — millət.'],
      notes: ['Vurğu ikinci hecadadır: a-ME-rican.'],
      example: "I'm from the USA. I'm American.", exampleAz: 'Mən ABŞ-danam. Amerikalıyam.',
    },
    {
      type: 'match', mode: 'reply', id: 'u3d3b_c05', number: 5, title: 'Cavab cütü', why: 'Hər ölkəyə öz millətini qoşdun.', hint: 'Hər cümlədəki ölkədən millətə keç.',
      prompt: 'Dil klubunda hər kəs əvvəl ölkəsini deyir.\nCümləyə toxun, sonra onun davamını seç.',
      rows: [{ en: "I'm from England.", az: "I'm English.", from: 'other' }, { en: "I'm from the USA.", az: "I'm American.", from: 'G' }, { en: "I'm from Turkey.", az: "I'm Turkish.", from: 'B' }],
      extra: ["I'm Russian."],
      variants: [other('Bir cümlənin davamı yerində deyil.', ex("I'm from England. — I'm English.; I'm from the USA. — I'm American.; I'm from Turkey. — I'm Turkish.", 'Hər ölkədən öz milləti gəlir.', "I'm from the USA. — ölkə; I'm American. — millət.", "I'm from the USA. I'm American."))],
      review: {
        title: 'Cavab cütü', why: 'Hər ölkəyə öz millətini qoşdun.', hint: 'Hər cümlədəki ölkədən millətə keç.',
        prompt: 'Hostelin mətbəxində qonaqlar əvvəl ölkəsini deyir.\nCümləyə toxun, sonra onun davamını seç.',
        rows: [{ en: "I'm from Russia.", az: "I'm Russian.", from: 'other' }, { en: "I'm from Georgia.", az: "I'm Georgian.", from: 'G' }, { en: "I'm from England.", az: "I'm English.", from: 'B' }],
        extra: ["I'm American."],
        variants: [other('Bir cümlənin davamı yerində deyil.', ex("I'm from Russia. — I'm Russian.; I'm from Georgia. — I'm Georgian.; I'm from England. — I'm English.", 'Hər ölkədən öz milləti gəlir.', "I'm from England. — ölkə; I'm English. — millət.", "I'm from Georgia. I'm Georgian."))],
      },
    },
    {
      type: 'word', id: 'u3d3b_c06', number: 6, scenes: ['mascot/wave'],
      word: 'German', pronunciation: '/ˈdʒɝmən/', reading: 'cörmən', az: 'alman',
      structure: ['Germany — ölkə; German — millət.'],
      notes: ['“Almaniya” ingiliscə Germany-dir; G “c” kimi oxunur.'],
      example: "I'm from Germany. I'm German.", exampleAz: 'Mən Almaniyadanam. Almanam.',
    },
    {
      type: 'voice', id: 'u3d3b_c07', number: 7, title: 'Dinlə və təkrarla', why: 'Cümləni dedin; German — “cörmən”.', hint: 'Əvvəl yavaş dinlə, sonra sözləri bir-bir de.',
      prompt: 'Hostelin resepsiyasında alman qonaq özünü təqdim edir.\nDinlə, sonra eyni cür de.', audio: "I'm German.", repeat: { stress: 'German', note: 'German — “cörmən”: G burada “c” kimi oxunur.', reading: 'aym cörmən' },
      rule: exact("I'm German."),
      variants: [other('Bir daha dinlə və yavaş de.', ex("I'm German.", 'German “q” ilə yox, “c” ilə başlayır.', "I'm German. — millət; I'm from Germany. — ölkə.", "I'm German."))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Cümləni dedin; American-da vurğu ikinci hecadadır.', hint: 'Əvvəl yavaş dinlə, sonra sözləri bir-bir de.',
        prompt: 'Dil klubunda amerikalı qonaq özünü təqdim edir.\nDinlə, sonra eyni cür de.', audio: "I'm American.", repeat: { stress: 'me', note: 'American — vurğu ikinci hecada: ə-ME-rikən.', reading: 'aym əmerikən' },
        rule: exact("I'm American."),
        variants: [other('Bir daha dinlə və yavaş de.', ex("I'm American.", 'Vurğu ikinci hecadadır: ə-ME-rikən.', "I'm American. — millət; I'm from the USA. — ölkə.", "I'm American."))],
      },
    },
    {
      type: 'choice', id: 'u3d3b_c14', number: 8, title: 'Sözü tamamla', why: 'England — ölkə, English — millət.', hint: 'Birinci cümlə ölkəni deyir, ikinci cümlə başqa şeyi.',
      prompt: 'Dil klubunda yeni tanış özünü təqdim edir.\nHansı söz çatmır?', gap: { speaker: 'other', before: "I'm from England. I'm", after: '.' },
      options: ['England', 'English', 'American'], answer: 'English',
      variants: [
        pick('England', 'England ölkədir; I\'m-dən sonra millət gəlir.', ex('English', 'from-suz I\'m-dən sonra millət gəlir: English.', "I'm English. — millət; I'm from England. — ölkə.", "I'm from England. I'm English.")),
        pick('American', 'American — ABŞ-dan olan; o isə İngiltərədəndir.', ex('English', 'İngiltərədən olan — English.', "I'm English. — İngiltərə; I'm American. — ABŞ.", "I'm from England. I'm English.")),
      ],
      review: {
        title: 'Sözü tamamla', why: 'the USA — ölkə, American — millət.', hint: 'Birinci cümlə ölkəni deyir, ikinci cümlə başqa şeyi.',
        prompt: 'Hostelin resepsiyasında qonaq özünü təqdim edir.\nHansı söz çatmır?', gap: { speaker: 'other', before: "I'm from the USA. I'm", after: '.' },
        options: ['German', 'the USA', 'American'], answer: 'American',
        variants: [
          pick('the USA', 'the USA ölkədir; I\'m-dən sonra millət gəlir.', ex('American', 'from-suz I\'m-dən sonra millət gəlir: American.', "I'm American. — millət; I'm from the USA. — ölkə.", "I'm from the USA. I'm American.")),
          pick('German', 'German — Almaniyadan olan; o isə ABŞ-dandır.', ex('American', 'ABŞ-dan olan — American.', "I'm American. — ABŞ; I'm German. — Almaniya.", "I'm from the USA. I'm American.")),
        ],
      },
    },
    {
      type: 'match', id: 'u3d3b_c15', number: 9, title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'from olan cümləni millət cümlələrindən ayır.',
      prompt: 'Hostelin mətbəxində tanışlıq.\nHər cümləyə mənasını qoş.',
      rows: [{ en: "I'm from England.", az: 'İngiltərədənəm.', from: 'other' }, { en: "I'm English.", az: 'İngilisəm.', from: 'G' }, { en: "I'm American.", az: 'Amerikalıyam.', from: 'B' }],
      extra: ['ABŞ-danam.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex("I'm from England. — İngiltərədənəm.; I'm English. — İngilisəm.; I'm American. — Amerikalıyam.", 'from olan cümlə ölkəni, from-suz cümlə milləti deyir.', "I'm English. — millət; I'm from England. — ölkə.", "I'm from England. I'm English."))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'from olan cümləni millət cümlələrindən ayır.',
        prompt: 'Qatarda sərnişinlər tanış olur.\nHər cümləyə mənasını qoş.',
        rows: [{ en: "I'm German.", az: 'Almanam.', from: 'other' }, { en: "I'm from the USA.", az: 'ABŞ-danam.', from: 'G' }, { en: "I'm English.", az: 'İngilisəm.', from: 'B' }],
        extra: ['Almaniyadanam.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("I'm German. — Almanam.; I'm from the USA. — ABŞ-danam.; I'm English. — İngilisəm.", 'from olan cümlə ölkəni, from-suz cümlə milləti deyir.', "I'm German. — millət; I'm from Germany. — ölkə.", "I'm from Germany. I'm German."))],
      },
    },
    {
      type: 'write', id: 'u3d3b_c16', number: 10, title: 'Dinlə və yaz', why: 'American — amerikalı.', hint: 'Ölkənin adı ilə millət sözü fərqlidir — millət sözünü yaz.',
      prompt: 'Millətini yaz.', audio: "I'm American.", placeholder: 'Millət',
      rule: exact('American', "I'm American."),
      variants: [
        { match: { words: ['the USA', 'USA', "I'm from the USA"] }, short: 'the USA ölkədir; səsdə millət deyilir.', explain: ex('American', 'Səsdə from yoxdur — bu, millətdir: American.', "I'm American. — millət; I'm from the USA. — ölkə.", "I'm American.") },
        other('American', ex('American', 'Səsdə millət sözü var: American.', "I'm American. — millət; I'm from the USA. — ölkə.", "I'm American.")),
      ],
      review: {
        title: 'Dinlə və yaz', why: 'German — alman.', hint: 'Ölkənin adı ilə millət sözü fərqlidir — millət sözünü yaz.',
        prompt: 'Millətini yaz.', audio: "I'm German.", placeholder: 'Millət',
        rule: exact('German', "I'm German."),
        variants: [
          { match: { words: ['Germany', "I'm from Germany"] }, short: 'Germany ölkədir; səsdə millət deyilir.', explain: ex('German', 'Səsdə from yoxdur — bu, millətdir: German.', "I'm German. — millət; I'm from Germany. — ölkə.", "I'm German.") },
          other('German', ex('German', 'Səsdə millət sözü var: German.', "I'm German. — millət; I'm from Germany. — ölkə.", "I'm German.")),
        ],
      },
    },
  ],
  result: {
    done: ['Dərs 3 · 3-cü hissə tamamlandı', 'Artıq ingilis, amerikalı və alman sözlərini tanıyır, ölkə ilə milləti ayırırsan.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'İngilis, amerikalı və alman sözlərini tanımaq', tasks: ['u3d3b_c03', 'u3d3b_c05', 'u3d3b_c14', 'u3d3b_c15'] },
      { group: 'Yazı', text: 'Eşitdiyin milləti yazmaq', tasks: ['u3d3b_c16'] },
      { group: 'Danışıq', text: 'Millət sözünü düzgün demək', tasks: ['u3d3b_c07'] },
    ],
    closing: 'Növbəti hissə — fransız və formada millət sahəsi.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'English', translation: 'ingilis', example: "I'm from England. I'm English.", exampleAz: 'Mən İngiltərədənəm. İngilisəm.', usageNote: 'England — ölkə, English — millət.', pronunciation: '/ˈɪŋɡlɪʃ/', teachCard: 'u3d3b_c02' },
    { word: 'American', translation: 'amerikalı', example: "I'm from the USA. I'm American.", exampleAz: 'Mən ABŞ-danam. Amerikalıyam.', usageNote: 'the USA — ölkə, American — millət.', pronunciation: '/əˈmɛrɪkən/', teachCard: 'u3d3b_c04' },
    { word: 'German', translation: 'alman', example: "I'm from Germany. I'm German.", exampleAz: 'Mən Almaniyadanam. Almanam.', usageNote: 'Germany — ölkə, German — millət.', pronunciation: '/ˈdʒɝmən/', teachCard: 'u3d3b_c06' },
  ],
};

// Dərs 3 · 4-cü hissə (26 Nov 2026: the lesson was split, nothing removed): French · nationality.
export const lesson3b_2: DesignLesson = {
  id: 'a1_en_b3_d3b_2', order: 47, unit: 3, number: 3, part: 4, title: 'Millət', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d3b_c20', badge: 'Haradansan', subtitle: 'Hosteldə qeydiyyat vərəqini doldurur, pasport nəzarətində millətini deyirsən.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Fransız sözünü və “Nationality” sualını tanıya bilirəm.' },
        { icon: 'bye', text: 'Formada millət sahəsini doldura bilirəm.' },
        { icon: 'wave', text: 'Millətim soruşulanda cavab verə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u3d3b_c08', number: 8, scenes: ['mascot/happy'],
      word: 'French', pronunciation: '/frɛntʃ/', reading: 'frenç', az: 'fransız',
      structure: ['France — ölkə; French — millət.'],
      notes: ['Sonda “ç” səsi var.'],
      example: "I'm from France. I'm French.", exampleAz: 'Mən Fransadanam. Fransızam.',
    },
    {
      type: 'choice', id: 'u3d3b_c09', number: 9, title: 'Sözü tamamla', why: 'France — ölkə, French — millət.', hint: 'I\'m-dən sonra from yoxdur — hansı söz yaraşır?',
      prompt: 'Hostelin mətbəxində yeni tanış özünü təqdim edir.\nHansı söz çatmır?', gap: { speaker: 'other', before: "I'm from France. I'm", after: '.' },
      options: ['France', 'French', 'German'], answer: 'French',
      variants: [
        pick('France', 'France ölkədir; I\'m-dən sonra millət gəlir.', ex('French', 'from-suz I\'m-dən sonra millət gəlir: French.', "I'm French. — millət; I'm from France. — ölkə.", "I'm from France. I'm French.")),
        pick('German', 'O, Fransadandır.', ex('French', 'Fransadan olan fransızdır: French.', "I'm from France. I'm French. — fransız; I'm from Germany. I'm German. — alman.", "I'm from France. I'm French.")),
      ],
      review: {
        title: 'Sözü tamamla', why: 'Germany — ölkə, German — millət.', hint: 'I\'m-dən sonra from yoxdur — hansı söz yaraşır?',
        prompt: 'Pasport nəzarətinin növbəsində sərnişin özünü təqdim edir.\nHansı söz çatmır?', gap: { speaker: 'other', before: "I'm from Germany. I'm", after: '.' },
        options: ['German', 'Germany', 'French'], answer: 'German',
        variants: [
          pick('Germany', 'Germany ölkədir; I\'m-dən sonra millət gəlir.', ex('German', 'from-suz I\'m-dən sonra millət gəlir: German.', "I'm German. — millət; I'm from Germany. — ölkə.", "I'm from Germany. I'm German.")),
          pick('French', 'O, Almaniyadandır.', ex('German', 'Almaniyadan olan almandır: German.', "I'm from Germany. I'm German. — alman; I'm from France. I'm French. — fransız.", "I'm from Germany. I'm German.")),
        ],
      },
    },
    {
      type: 'choice', id: 'u3d3b_c17', number: 10, title: 'Dinlə və seç', why: 'French — fransız.', hint: 'Cümlənin sonundakı millət sözünə qulaq as.',
      prompt: 'Hostelin resepsiyasında qonaq özünü təqdim edir.\nO hansı millətdəndir?', audio: "Hello! I'm French.",
      options: ['Fransız', 'Alman', 'İngilis'], answer: 'Fransız',
      variants: [
        pick('Alman', 'Səsdə “German” yoxdur.', ex('Fransız', 'Səsdə French var — fransız.', "I'm French. — fransız; I'm German. — alman.", "Hello! I'm French.")),
        pick('İngilis', 'Səsdə “English” yoxdur.', ex('Fransız', 'Səsdə French var — fransız.', "I'm French. — fransız; I'm English. — ingilis.", "Hello! I'm French.")),
      ],
      review: {
        title: 'Dinlə və seç', why: 'English — ingilis.', hint: 'Cümlənin sonundakı millət sözünə qulaq as.',
        prompt: 'Dil klubunda qonaq özünü təqdim edir.\nO hansı millətdəndir?', audio: "Hi! I'm English.",
        options: ['Amerikalı', 'İngilis', 'Fransız'], answer: 'İngilis',
        variants: [
          pick('Amerikalı', 'Səsdə “American” yoxdur.', ex('İngilis', 'Səsdə English var — ingilis.', "I'm English. — ingilis; I'm American. — amerikalı.", "Hi! I'm English.")),
          pick('Fransız', 'Səsdə “French” yoxdur.', ex('İngilis', 'Səsdə English var — ingilis.', "I'm English. — ingilis; I'm French. — fransız.", "Hi! I'm English.")),
        ],
      },
    },
    {
      type: 'word', id: 'u3d3b_c10', number: 10, scenes: ['u3/hostel'],
      word: 'nationality', pronunciation: '/ˌnæʃəˈnæləti/', reading: 'neşənələti', az: 'millət, vətəndaşlıq',
      structure: ['Nationality: + millət.'],
      notes: ['Formalarda sahə adıdır; tək sözlə sual kimi də deyilir: Nationality?'],
      example: 'Nationality: Azerbaijani.', exampleAz: 'Milləti: azərbaycanlı.',
    },
    {
      type: 'two', id: 'u3d3b_c11', number: 11, title: 'Formanı doldur', why: 'Adını, soyadını və millətini öz yerinə yazdın.', hint: 'Hər sətrin başlığını oxu; millət sətrinə ölkə adı yazılmır.', scenes: ['u3/hostel'],
      prompt: 'Hostelə yazılırsan.\nQeydiyyat vərəqini doldur (istəsən, uydurma məlumat).', form: { title: 'Hostel qeydiyyatı', subtitle: 'Yeni qonaq' },
      fields: [
        { id: 'u3d3b_c11a', label: 'First name', placeholder: 'Adını yaz', rule: own(NAME, '[ad]'), purpose: 'adını yazmaq', empty: 'Adını da yaz.' },
        { id: 'u3d3b_c11b', label: 'Last name', placeholder: 'Soyadını yaz', rule: own(NAME, 'Mammadova'), purpose: 'soyadını yazmaq', empty: 'Soyadını da yaz.' },
        { id: 'u3d3b_c11c', label: 'Nationality', placeholder: 'Millətini yaz', rule: own(NATIONALITY_FIELD, 'Azerbaijani'), purpose: 'millətini yazmaq', empty: 'Millətini də yaz.' },
      ],
      variants: [
        { field: 'u3d3b_c11a', match: { other: true }, explain: ex('[ad]', 'Bu sətirdə yalnız adın lazımdır.', 'First name — adın; Last name — soyadın.', 'My first name is [ad]') },
        { field: 'u3d3b_c11b', match: { other: true }, explain: ex('Mammadova', 'Bu sətirdə yalnız soyadın lazımdır.', 'Last name — soyadın; First name — adın.', 'My last name is Mammadova.') },
        { field: 'u3d3b_c11c', match: { other: true }, explain: ex('Azerbaijani', 'Nationality sətrinə ölkə yox, millət yazılır.', 'Nationality: Azerbaijani. ; Where are you from? — Azerbaijan.', 'Nationality: Azerbaijani.') },
      ],
      review: {
        title: 'Formanı doldur', why: 'Soyadı, adı və milləti öz yerinə yazdın.', hint: 'Hər sətrin başlığını oxu; millət sətrinə ölkə adı yazılmır.', scenes: ['u3/hostel'],
        prompt: 'Hosteldə dostunu yazırsan. Pasportda: “SMITH ANNA”, the USA.\nFormanı doldur.', form: { title: 'Hostel qeydiyyatı', subtitle: 'Yeni qonaq' },
        fields: [
          { id: 'u3d3b_c11b', label: 'Last name', placeholder: 'Soyadını yaz', rule: exact('Smith'), purpose: 'soyadı yazmaq', empty: 'Soyadı da yaz.' },
          { id: 'u3d3b_c11a', label: 'First name', placeholder: 'Adını yaz', rule: exact('Anna'), purpose: 'adı yazmaq', empty: 'Adı da yaz.' },
          { id: 'u3d3b_c11c', label: 'Nationality', placeholder: 'Millətini yaz', rule: exact('American'), purpose: 'milləti yazmaq', empty: 'Milləti də yaz.' },
        ],
        variants: [
          { field: 'u3d3b_c11b', match: { other: true }, explain: ex('Smith', 'Last name — soyaddır: pasportdakı birinci söz.', 'Last name — Smith; First name — Anna.', 'My last name is Smith.') },
          { field: 'u3d3b_c11a', match: { other: true }, explain: ex('Anna', 'First name — addır: pasportdakı ikinci söz.', 'First name — Anna; Last name — Smith.', 'My first name is Anna.') },
          { field: 'u3d3b_c11c', match: { other: true }, explain: ex('American', 'the USA ölkədir; millət sətrinə American yazılır.', "I'm American. — millət; I'm from the USA. — ölkə.", 'Nationality: American.') },
        ],
      },
    },
    {
      type: 'voice', id: 'u3d3b_c12', number: 12, title: 'Millətini de', why: 'Millətini dedin.', hint: 'Bu dərsin son sözü millətini soruşur — ölkəni yox.',
      prompt: 'Pasport nəzarətində əməkdaş pasportuna baxıb soruşur.\nCavab ver.', audio: 'Nationality?', reply: 'Thank you!',
      rule: own(NATIONALITY_SAID, 'Azerbaijani.', "I'm Azerbaijani."),
      variants: [COUNTRY_MISTAKE, other('Millətini de.', ex('Azerbaijani.', 'Nationality — millətdir; bir sözlə də cavab vermək olar.', "Nationality? — Azerbaijani. ; Where are you from? — I'm from Azerbaijan.", "Nationality? — I'm Azerbaijani."))],
      review: {
        title: 'Millətini de', why: 'Millətini dedin.', hint: 'Sual millətini soruşur — ölkəni yox.',
        prompt: 'Hostelin resepsiyasında işçi vərəqi doldurur və soruşur.\nCavab ver.', audio: 'Nationality, please.', reply: 'Thanks!',
        rule: own(NATIONALITY_SAID, 'Azerbaijani.', "I'm Azerbaijani."),
        variants: [COUNTRY_MISTAKE, other('Millətini de.', ex('Azerbaijani.', 'Nationality — millətdir; bir sözlə də cavab vermək olar.', "Nationality, please. — Azerbaijani. ; Where are you from? — I'm from Azerbaijan.", "Nationality, please. — I'm Azerbaijani."))],
      },
    },
    {
      type: 'match', id: 'u3d3b_c13', number: 13, title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'from olan cümləni millət cümlələrindən ayır.',
      prompt: 'Dil klubunda qonaqlar özlərini təqdim edir.\nHər cümləyə mənasını qoş.',
      rows: [{ en: "I'm American.", az: 'Amerikalıyam.', from: 'other' }, { en: "I'm from France.", az: 'Fransadanam.', from: 'G' }, { en: "I'm German.", az: 'Almanam.', from: 'B' }],
      extra: ['Almaniyadanam.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex("I'm American. — Amerikalıyam; I'm from France. — Fransadanam; I'm German. — Almanam.", 'from olan cümlə ölkədir, from-suz cümlələr millətdir.', "I'm German. — almanam; I'm from Germany. — Almaniyadanam.", "I'm from Germany. I'm German."))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.', hint: 'from olan cümləni millət cümlələrindən ayır.',
        prompt: 'Hava limanında sərnişinlər tanış olur.\nHər cümləyə mənasını qoş.',
        rows: [{ en: "I'm French.", az: 'Fransızam.', from: 'other' }, { en: "I'm English.", az: 'İngilisəm.', from: 'G' }, { en: "I'm from the USA.", az: 'ABŞ-danam.', from: 'B' }],
        extra: ['Amerikalıyam.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("I'm French. — Fransızam; I'm English. — İngilisəm; I'm from the USA. — ABŞ-danam.", 'from olan cümlə ölkədir, from-suz cümlələr millətdir.', "I'm American. — amerikalıyam; I'm from the USA. — ABŞ-danam.", "I'm from the USA. I'm American."))],
      },
    },
  ],
  result: {
    done: ['Dərs 3 · 4-cü hissə tamamlandı', 'Artıq formada millətini yazır, millətin soruşulanda cavab verirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Fransız və digər millət sözlərini tanımaq', tasks: ['u3d3b_c09', 'u3d3b_c17', 'u3d3b_c13'] },
      { group: 'Yazı', text: 'Qeydiyyat vərəqində millət sahəsini doldurmaq', tasks: ['u3d3b_c11'] },
      { group: 'Danışıq', text: 'Millətin soruşulanda cavab vermək', tasks: ['u3d3b_c12'] },
    ],
    closing: 'Növbəti dərs — “Sən Türkiyədənsən?” kimi suallar və qısa cavablar.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'French', translation: 'fransız', example: "I'm from France. I'm French.", exampleAz: 'Mən Fransadanam. Fransızam.', usageNote: 'France — ölkə, French — millət.', pronunciation: '/frɛntʃ/', teachCard: 'u3d3b_c08' },
    { word: 'nationality', translation: 'millət, vətəndaşlıq', example: 'Nationality: Azerbaijani.', exampleAz: 'Milləti: azərbaycanlı.', usageNote: 'Formada sahə adı.', pronunciation: '/ˌnæʃəˈnæləti/', teachCard: 'u3d3b_c10' },
  ],
};
