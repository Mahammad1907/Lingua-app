// Bölmə 3 · Dərs 5 · 1-ci hissə — O haradandır? (he · she · He's from … · She's from …).
// Video zəng və qatar. Əsas səhv: azərbaycancada he və she ikisi də “o”dur — tapşırıqlar kişi/qadın fərqi üzərində qurulub.
// Qız və oğlan azərbaycanlıdır; xarici danışanlar adsız “yeni tanış”dır (from: 'other').
// Spiral: Are you …? Yes, I am. (Dərs 4), ölkə və millət sözləri (Dərs 2–3), I'm fine / OK (Bölmə 1).
import type { DesignLesson, Variant } from '../designLessonTypes';
import { ex, other, pick } from '../unit1/build';
import { notices, resultTexts, said } from './shared';

/** “He's from Georgia.” / “He is from Georgia.” */
const heFrom = (country: string) => said(String.raw`^he(?:'s|’s|\s+is)\s+from\s+${country.toLowerCase()}\s*[.!]?$`, `He's from ${country}.`);
const sheFrom = (country: string) => said(String.raw`^she(?:'s|’s|\s+is)\s+from\s+${country.toLowerCase()}\s*[.!]?$`, `She's from ${country}.`);
/** Typical mistakes: he ↔ she (both “o”), and leaving out “is” (“She from Turkey”). */
const wrongPerson = (said: 'he' | 'she', country: string): Variant => said === 'she'
  ? { match: { pattern: String.raw`^she\b` }, short: 'Kişi haqqında danışırsan — he.', explain: ex(`He's from ${country}.`, 'Azərbaycancada ikisi də “o”dur, ingiliscə kişi üçün he deyilir.', `He's from ${country}. — kişi; She is from ${country}. — qadın.`, "He's from Turkey.") }
  : { match: { pattern: String.raw`^he\b` }, short: 'Qadın haqqında danışırsan — she.', explain: ex(`She's from ${country}.`, 'Azərbaycancada ikisi də “o”dur, ingiliscə qadın üçün she deyilir.', `She's from ${country}. — qadın; He's from ${country}. — kişi.`, "She's from Turkey.") };
const noIs = (answer: string): Variant => ({
  match: { pattern: String.raw`^s?he\s+from\b` }, short: 'He/she-dən sonra “is” lazımdır.',
  explain: ex(answer, 'Azərbaycancada “-dır” şəkilçidir, ingiliscə ayrıca söz kimi gəlir: is, qısası ’s.', `${answer} — düzdür; ${answer.replace(/'s/, '')} — olmur.`, "He's from Turkey."),
});

export const lesson5a: DesignLesson = {
  id: 'a1_en_b3_d5a', order: 29, unit: 3, number: 5, part: 1, title: 'O haradandır?', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d5a_c01', badge: 'Haradansan', subtitle: 'Video zəngdə və qatarda başqaları haqqında danışırsan: o kişidir, yoxsa qadın?', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Kişi haqqında he, qadın haqqında she deyildiyini eşidib ayırıram.' },
        { icon: 'wave', text: 'Başqasının haradan olduğunu deyə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u3d5a_c02', number: 2, scenes: ['mascot/point'],
      word: 'he', pronunciation: '/hi/', reading: 'hi', az: 'o (kişi, oğlan)',
      notes: ['Azərbaycancada “o” hər kəs üçündür; ingiliscə kişi üçün he.'],
      example: 'He is fine, thanks.', exampleAz: 'O yaxşıdır, sağ ol.',
    },
    {
      type: 'choice', id: 'u3d5a_c03', number: 3, title: 'Dinlə və seç', why: '“he” — kişi haqqında.', hint: 'Cümlənin birinci sözünə qulaq as.',
      prompt: 'Qız video zəngdədir, ekranda bir kişi və bir qadın görünür.\nQız kim haqqında danışır?', audio: 'He is OK.',
      options: ['Kişi haqqında', 'Qadın haqqında', 'Özü haqqında'], answer: 'Kişi haqqında',
      variants: [
        pick('Qadın haqqında', 'Səsdə “he” var — bu, kişidir.', ex('Kişi haqqında', '“he” kişi və ya oğlan haqqında deyilir.', 'He is OK. — o (kişi); I am OK. — mən.', 'He is fine, thanks.')),
        pick('Özü haqqında', 'Özü haqqında “I” deyərdi.', ex('Kişi haqqında', 'Səsdə “I” yox, “he” var.', 'He is OK. — o (kişi); I am OK. — mən.', 'He is fine, thanks.')),
      ],
      review: {
        title: 'Dinlə və seç', why: '“she” — qadın haqqında.', hint: 'Cümlənin birinci sözünə qulaq as.',
        prompt: 'Qatarda oğlan telefonla danışır, yanında yaşlı bir qadın oturub.\nOğlan kim haqqında danışır?', audio: 'She is not great.',
        options: ['Özü haqqında', 'Bir kişi haqqında', 'Bir qadın haqqında'], answer: 'Bir qadın haqqında',
        variants: [
          pick('Özü haqqında', 'Özü haqqında “I” deyərdi.', ex('Bir qadın haqqında', 'Səsdə “I” yox, “she” var.', "She is not great. — o (qadın); I'm not great. — mən.", "She's from France.")),
          pick('Bir kişi haqqında', 'Kişi üçün “he” deyilir, səsdə isə “she” var.', ex('Bir qadın haqqında', '“she” qadın haqqında deyilir.', 'She is not great. — qadın; He is not great. — kişi.', "She's from France.")),
        ],
      },
    },
    {
      type: 'word', id: 'u3d5a_c04', number: 4, scenes: ['mascot/wave'],
      word: 'she', pronunciation: '/ʃi/', reading: 'şi', az: 'o (qadın, qız)',
      notes: ['Kişi üçün he, qadın üçün she — azərbaycancada ikisi də “o”.'],
      example: 'She is OK. He is fine.', exampleAz: 'O (qadın) normaldır. O (kişi) yaxşıdır.',
    },
    {
      type: 'match', id: 'u3d5a_c05', number: 5, title: 'Kim nə dedi?', why: 'He və she fərqini tapdın.', hint: 'Hər cümlənin birinci sözünə bax: kişi, qadın, yoxsa özü?',
      prompt: 'Video zəngdə qız və oğlan dostlarının halını deyir.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'He is fine.', az: 'O (kişi) yaxşıdır.', from: 'G' }, { en: 'She is OK.', az: 'O (qadın) normaldır.', from: 'B' }, { en: "I'm not great.", az: 'Mən çox yaxşı deyiləm.', from: 'M' }],
      extra: ['O (kişi) normaldır.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex('He is fine. — O (kişi) yaxşıdır.; She is OK. — O (qadın) normaldır.; I\'m not great. — Mən çox yaxşı deyiləm.', 'He kişi, she qadın haqqındadır; fine və OK da fərqlidir.', 'He is fine. — kişi; She is fine. — qadın.', 'She is OK. He is fine.'))],
      review: {
        title: 'Kim nə dedi?', why: 'He və she fərqini tapdın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.',
        prompt: 'Qatarda iki yeni tanış yol yoldaşları haqqında danışır.\nHər cümləyə mənasını qoş.',
        rows: [{ en: 'She is fine.', az: 'O (qadın) yaxşıdır.', from: 'other' }, { en: 'He is not great.', az: 'O (kişi) çox yaxşı deyil.', from: 'other' }, { en: 'He is OK.', az: 'O (kişi) normaldır.', from: 'B' }],
        extra: ['O (qadın) çox yaxşı deyil.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex('She is fine. — O (qadın) yaxşıdır.; He is not great. — O (kişi) çox yaxşı deyil.; He is OK. — O (kişi) normaldır.', 'Birinci söz kimin haqqında olduğunu deyir.', 'He is OK. — kişi; She is OK. — qadın.', 'She is fine.'))],
      },
    },
    {
      type: 'word', id: 'u3d5a_c06', number: 6, scenes: ['mascot/globe'],
      word: "He's from [ölkə]", pronunciation: '/hiz frʌm/', reading: 'hiz fram [ölkə]', az: 'O (kişi) [ölkə]-dandır.',
      structure: ["He's from + ölkə / şəhər."],
      notes: ["He's — he is-in qısası, “hiz” oxunur."],
      example: "He's from Turkey.", exampleAz: 'O, Türkiyədəndir.',
    },
    {
      type: 'choice', id: 'u3d5a_c07', number: 7, title: 'Sözü tamamla', why: 'Kişi haqqında — He.', hint: 'Ekrandakı adam kişidir, yoxsa qadın?',
      prompt: 'Qız video zəngdə ekrandakı kişi dostunu göstərir. Dost Türkiyədəndir.\nHansı söz çatmır?', gap: { speaker: 'G', before: '', after: "'s from Turkey." },
      options: ['She', 'He', 'I'], answer: 'He',
      variants: [
        pick('She', 'Azərbaycancada “o” deyirik, ingiliscə kişi üçün he.', ex('He', 'Ekrandakı dost kişidir, ona görə He.', "He's from Turkey. — kişi; She is from Turkey. — qadın.", "He's from Turkey.")),
        pick('I', 'Qız özü haqqında yox, dostu haqqında danışır.', ex('He', 'Özün haqqında I’m deyirsən, kişi dost haqqında He’s.', "I'm from Azerbaijan. — mən; He's from Turkey. — o (kişi).", "He's from Turkey.")),
      ],
      review: {
        title: 'Sözü tamamla', why: 'Qadın haqqında — She.', hint: 'Yanındakı adam kişidir, yoxsa qadın?',
        prompt: 'Qatarda oğlan yanındakı qadını dostuna təqdim edir. Qadın Fransadandır.\nHansı söz çatmır?', gap: { speaker: 'B', before: '', after: "'s from France." },
        options: ['He', 'I', 'She'], answer: 'She',
        variants: [
          pick('He', 'Qadın üçün she deyilir.', ex('She', 'Yanındakı qadındır, ona görə She.', "She's from France. — qadın; He's from France. — kişi.", "She's from France.")),
          pick('I', 'Oğlan özü haqqında danışmır.', ex('She', 'Özün haqqında I’m, qadın haqqında She’s.', "I'm from Azerbaijan. — mən; She's from France. — o (qadın).", "She's from France.")),
        ],
      },
    },
    {
      type: 'voice', id: 'u3d5a_c08', number: 8, title: 'Səslə cavab', why: 'Kişi haqqında haradan olduğunu dedin.', hint: 'Kişi haqqında danışırsan; sonra ölkənin adı gəlir.',
      prompt: 'Video zəngdə {M} ekrandakı kişini soruşur. O kişi Gürcüstandandır.\nDe: o, Gürcüstandandır.', reply: 'Really? Nice!',
      rule: heFrom('Georgia'),
      variants: [wrongPerson('she', 'Georgia'), noIs("He's from Georgia."), other("He's from + ölkə.", ex("He's from Georgia.", 'Kişi haqqında He’s from, sonra ölkə.', "He's from Georgia. — kişi; She is from Georgia. — qadın.", "He's from Turkey."))],
      review: {
        title: 'Səslə cavab', why: 'Kişi haqqında haradan olduğunu dedin.', hint: 'Yanındakı adam kişidir; sonra ölkənin adı gəlir.',
        prompt: 'Qatarda dostun yanındakı yaşlı kişini soruşur. Kişi Rusiyadandır.\nDe: o, Rusiyadandır.', reply: 'Really? Thanks!',
        rule: heFrom('Russia'),
        variants: [wrongPerson('she', 'Russia'), noIs("He's from Russia."), other("He's from + ölkə.", ex("He's from Russia.", 'Kişi haqqında He’s from, sonra ölkə.', "He's from Russia. — kişi; She's from Russia. — qadın.", "He's from Turkey."))],
      },
    },
    {
      type: 'word', id: 'u3d5a_c09', number: 9, scenes: ['mascot/happy'],
      word: "She's from [ölkə]", pronunciation: '/ʃiz frʌm/', reading: 'şiz fram [ölkə]', az: 'O (qadın) [ölkə]-dandır.',
      structure: ["She's from + ölkə / şəhər."],
      notes: ["She's — she is-in qısası, “şiz” oxunur."],
      example: "She's from France.", exampleAz: 'O, Fransadandır.',
    },
    {
      // “Müəllim izahı” (approved mockup, 20 Nov 2026): he's / she's in detail right after both word cards.
      type: 'explain', id: 'u3d5a_c09t', number: 10,
      lead: "Gəl, She's from ifadəsinə yaxından baxaq.", focus: "She's from",
      sections: [
        { title: 'Kim haqqında danışırsan?', pairs: [{ en: "He's", az: 'kişi' }, { en: "She's", az: 'qadın' }] },
        { title: 'Niyə qısa yazılır?', short: { full: 'She is', drop: 'i', short: "She's", note: 'I am → I’m kimi: danışıqda belə deyilir, mənası eynidir. Apostrof (’) düşən hərfin yeridir.' } },
        { title: 'Necə qurulur?', build: { parts: ["She's from", 'ölkə / şəhər'], examples: [{ en: "She's from France.", az: 'Fransadandır.' }, { en: "He's from Baku.", az: 'Bakıdandır.' }] } },
      ],
      attention: 'Biz “Fransa-dan” deyirik, “-dan” sonda gəlir. İngiliscədə from ölkədən əvvəl gəlir: from France.',
    },
    {
      type: 'write', id: 'u3d5a_c10', number: 10, title: 'Mesaj yaz', why: 'Qadın haqqında — She’s from.', hint: 'Qadın haqqında yazırsan; “-dandır” hissəsi ayrıca sözdür.',
      prompt: 'Video zəngdəki qadın Almaniyadandır.\nSözlərdən cümlə qur.', placeholder: 'Sözlərə toxun', scenes: ['u3/videocall'],
      tiles: ["She's", "He's", 'from', 'Germany', 'German', 'at', '.'], rule: sheFrom('Germany'),
      variants: [wrongPerson('he', 'Germany'), other("She's from Germany.", ex("She's from Germany.", 'Qadın haqqında She’s from, sonra ölkə: Germany.', "She's from Germany. — ölkə; She's German. — millət.", "She's from France."))],
      review: { scenes: ['u3/hostel'],
        title: 'Mesaj yaz', why: 'Kişi haqqında — He’s from.', hint: 'Kişi haqqında yazırsan; “-dandır” hissəsi ayrıca sözdür.',
        prompt: 'Hostelin çatına yazırsan: otaq yoldaşın İrandandır.\nSözlərdən cümlə qur.', placeholder: 'Sözlərə toxun',
        tiles: ['from', "He's", "She's", 'Iran', 'at', 'Turkish', '.'], rule: heFrom('Iran'),
        variants: [wrongPerson('she', 'Iran'), other("He's from Iran.", ex("He's from Iran.", 'Kişi haqqında He’s from, sonra ölkə: Iran.', "He's from Iran. — kişi; She's from Iran. — qadın.", "He's from Turkey."))],
      },
    },
    {
      type: 'choice', id: 'u3d5a_c11', number: 11, title: 'Seçim', why: 'Qadın haqqında — She’s from Iran.', hint: 'Kim haqqında danışırsan və “-dandır” hissəsi harada?', scenes: ['u3/train'],
      prompt: 'Qatarda yanındakı qadın dedi: “I\'m from Iran.” İndi onu dostuna təqdim edirsən.\nNə deyirsən?',
      options: ["He's from Iran.", "She's from Iran.", 'She from Iran.'], answer: "She's from Iran.",
      variants: [
        pick("He's from Iran.", 'Azərbaycancada “o” deyirik, ingiliscə qadın üçün she.', ex("She's from Iran.", 'Yanındakı qadındır, ona görə She.', "She's from Iran. — qadın; He's from Iran. — kişi.", "She's from France.")),
        pick('She from Iran.', 'She-dən sonra ’s (is) lazımdır.', ex("She's from Iran.", '“-dandır” hissəsi ingiliscə ayrıca gəlir: ’s.', "She's from Iran. — düzdür; She from Iran. — olmur.", "She's from France.")),
      ],
      review: { scenes: ['u3/hostel-kitchen'],
        title: 'Seçim', why: 'Kişi haqqında — He’s from England.', hint: 'Kim haqqında danışırsan və “-dandır” hissəsi harada?',
        prompt: 'Hostelin mətbəxində qız İngiltərədən olan tanışı təqdim edir.\nQız nə deyir?',
        options: ['He from England.', "She's from England.", "He's from England."], answer: "He's from England.",
        variants: [
          pick('He from England.', 'He-dən sonra ’s (is) lazımdır.', ex("He's from England.", '“-dandır” hissəsi ingiliscə ayrıca gəlir: ’s.', "He's from England. — düzdür; He from England. — olmur.", "He's from Turkey.")),
          pick("She's from England.", 'Kişi üçün he deyilir.', ex("He's from England.", 'Yeni tanış kişidir, ona görə He.', "He's from England. — kişi; She's from England. — qadın.", "He's from Turkey.")),
        ],
      },
    },
    {
      type: 'write', id: 'u3d5a_c12', number: 12, title: 'Dinlə və yaz', why: 'She’s from Germany — qadın haqqında.', hint: 'Birinci sözə qulaq as: “hiz”, yoxsa “şiz”?',
      prompt: 'Eşitdiyini yaz.', audio: "She's from Germany.", placeholder: 'Cümlə',
      rule: sheFrom('Germany'),
      variants: [wrongPerson('he', 'Germany'), other('Cümləni yoxla.', ex("She's from Germany.", 'Səsdə “şiz” — she’s, sonra from Germany.', "She's from Germany. — qadın; He's from Germany. — kişi.", "She's from France."))],
      review: {
        title: 'Dinlə və yaz', why: 'He’s from Russia — kişi haqqında.', hint: 'Birinci sözə qulaq as: “hiz”, yoxsa “şiz”?',
        prompt: 'Eşitdiyini yaz.', audio: "He's from Russia.", placeholder: 'Cümlə',
        rule: heFrom('Russia'),
        variants: [wrongPerson('she', 'Russia'), other('Cümləni yoxla.', ex("He's from Russia.", 'Səsdə “hiz” — he’s, sonra from Russia.', "He's from Russia. — kişi; She's from Russia. — qadın.", "He's from Turkey."))],
      },
    },
  ],
  result: {
    done: ['Dərs 5 · 1-ci hissə tamamlandı', 'Artıq kişi və qadın haqqında haradan olduğunu deyə bilirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'He və she fərqini eşidib tanımaq', tasks: ['u3d5a_c03', 'u3d5a_c05', 'u3d5a_c07'] },
      { group: 'Yazı', text: 'Başqası haqqında cümlə qurmaq və yazmaq', tasks: ['u3d5a_c10', 'u3d5a_c11', 'u3d5a_c12'] },
      { group: 'Danışıq', text: 'Kişinin haradan olduğunu demək', tasks: ['u3d5a_c08'] },
    ],
    closing: 'Növbəti hissə — o haradandır? Soruşmaq və qısa cavab.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'he', translation: 'o (kişi, oğlan)', example: 'He is fine, thanks.', exampleAz: 'O yaxşıdır, sağ ol.', usageNote: 'Kişi üçün he.', pronunciation: '/hi/', teachCard: 'u3d5a_c02' },
    { word: 'she', translation: 'o (qadın, qız)', example: 'She is OK. He is fine.', exampleAz: 'O (qadın) normaldır. O (kişi) yaxşıdır.', usageNote: 'Qadın üçün she.', pronunciation: '/ʃi/', teachCard: 'u3d5a_c04' },
    { word: "He's from [ölkə]", translation: 'O (kişi) [ölkə]-dandır.', example: "He's from Turkey.", exampleAz: 'O, Türkiyədəndir.', usageNote: "He's — he is-in qısası.", pronunciation: '/hiz frʌm/', teachCard: 'u3d5a_c06' },
    { word: "She's from [ölkə]", translation: 'O (qadın) [ölkə]-dandır.', example: "She's from France.", exampleAz: 'O, Fransadandır.', usageNote: "She's — she is-in qısası.", pronunciation: '/ʃiz frʌm/', teachCard: 'u3d5a_c09' },
  ],
};
