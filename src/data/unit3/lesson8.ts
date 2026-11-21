// Bölmə 3 · Dərs 8 — Bölmə söhbəti: dil klubu. Yeni söz yoxdur: haradan, millət, he/she, harada yaşamaq və dillər bir yerdə.
// Dil klubunun ziyafəti. Spiral: Bölmə 1 (salam, tanışlıq) və Bölmə 2 (hərf-hərf, telefon nömrəsi).
// Səs işləməsə, yazılı tapşırıqlar hər məqsədi yenə əhatə edir.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { FROM_MISTAKES, FROM_RETURN, LIVE, LIVE_MISTAKES, notices, own, resultTexts } from './shared';

const heFrom = String.raw`^(?:he'?s|he is)\s+from\s+baku\s*[.,!]?\s*(?:he'?s|he is)\s+azerbaijani\s*[.!]?$`;
const sheFrom = String.raw`^(?:she'?s|she is)\s+from\s+ganja\s*[.,!]?\s*(?:she'?s|she is)\s+azerbaijani\s*[.!]?$`;
const wrongHe = { match: { pattern: String.raw`^she\b` }, short: 'Oğlan haqqında “he” deyilir.',
  explain: ex("He's from Baku. He's Azerbaijani.", 'Azərbaycancada ikisi də “o”dur, ingiliscə oğlan üçün “he” gəlir.', "He's from Baku. — oğlan; She's from Baku. — qız.", "He's from Baku. He's Azerbaijani.") };
const wrongShe = { match: { pattern: String.raw`^he\b` }, short: 'Qız haqqında “she” deyilir.',
  explain: ex("She's from Ganja. She's Azerbaijani.", 'Azərbaycancada ikisi də “o”dur, ingiliscə qız üçün “she” gəlir.', "She's from Ganja. — qız; He's from Ganja. — oğlan.", "She's from Ganja. She's Azerbaijani.") };

export const lesson8: DesignLesson = {
  id: 'a1_en_b3_d8', order: 33, unit: 3, number: 8, title: 'Dil klubu', section: 'Haradansan',
  notices,
  cards: [
    {
      type: 'intro', id: 'u3d8_c01', badge: 'Bölmə söhbəti', subtitle: 'Dil klubunun ziyafəti. Öyrəndiklərin bir yerdə.', start: 'Söhbətə başla',
      goals: [
        { icon: 'chat', text: 'Yeni tanışla haradan olduğumuzu, harada yaşadığımızı və dillərimizi danışa bilirəm.' },
        { icon: 'wave', text: 'Dostumu təqdim edə bilirəm: haradandır, millətidir.' },
      ],
    },
    {
      type: 'teach', id: 'u3d8_c02', number: 2, scenes: ['u3/party'], title: 'Dil klubunun ziyafətində',
      lead: 'Ziyafətdə hamı bir-birinə bu sualları verir. Hər cümləni dinlə:',
      phrases: [
        { en: 'Hello! Where are you from?', az: 'Salam! Haradansan?' },
        { en: "I'm from Baku. And you?", az: 'Bakıdanam. Bəs sən?' },
        { en: 'Where do you live?', az: 'Harada yaşayırsan?' },
        { en: 'Do you speak English?', az: 'İngiliscə danışırsan?' },
        { en: "She's from Turkey. She's Turkish.", az: 'O Türkiyədəndir. O türkdür.' },
      ],
      notes: ['Bu sualların hamısını Bölmə 3-də öyrəndin. İndi özün danışırsan.'],
    },
    {
      type: 'choice', id: 'u3d8_c03', number: 3, title: 'Dinlə və anla', why: '“from Georgia” — haradan; “live in Baku” — harada yaşayır.', hint: '“from” və “live in”dən sonrakı yerlərə qulaq as.',
      prompt: 'Ziyafətdə yeni tanış özü haqqında danışır.\nOnun haqqında nə düzdür?', audio: "Hi! I'm from Georgia, but I live in Baku.",
      options: ['Gürcüstandandır, Bakıda yaşayır.', 'Bakıdandır, Gürcüstanda yaşayır.', 'Gürcüdür, Gürcüstanda yaşayır.'], answer: 'Gürcüstandandır, Bakıda yaşayır.',
      variants: [
        pick('Bakıdandır, Gürcüstanda yaşayır.', 'Yerlər tərsinə düşüb.', ex('Gürcüstandandır, Bakıda yaşayır.', '“from”dan sonra gəldiyi yer, “live in”dən sonra yaşadığı yer gəlir.', "I'm from Georgia. — haradan; I live in Baku. — harada yaşayır.", "I'm from Georgia, but I live in Baku.")),
        pick('Gürcüdür, Gürcüstanda yaşayır.', 'Yaşadığı yer Gürcüstan deyil.', ex('Gürcüstandandır, Bakıda yaşayır.', '“live in”dən sonra Baku gəlir.', "I'm from Georgia. — haradan; I live in Baku. — harada yaşayır.", "I'm from Georgia, but I live in Baku.")),
      ],
      review: {
        title: 'Dinlə və anla', why: '“from Germany” — haradan; “live in Ganja” — harada yaşayır.', hint: '“from” və “live in”dən sonrakı yerlərə qulaq as.',
        prompt: 'Kafedə yeni tanış özü haqqında danışır.\nOnun haqqında nə düzdür?', audio: "I'm from Germany, but I live here, in Ganja.",
        options: ['Gəncədəndir, Almaniyada yaşayır.', 'Almaniyadandır, Gəncədə yaşayır.', 'Almandır, Almaniyada yaşayır.'], answer: 'Almaniyadandır, Gəncədə yaşayır.',
        variants: [
          pick('Gəncədəndir, Almaniyada yaşayır.', 'Yerlər tərsinə düşüb.', ex('Almaniyadandır, Gəncədə yaşayır.', '“from”dan sonra gəldiyi yer, “live”dan sonra yaşadığı yer gəlir.', "I'm from Germany. — haradan; I live in Ganja. — harada yaşayır.", "I'm from Germany, but I live here, in Ganja.")),
          pick('Almandır, Almaniyada yaşayır.', 'Yaşadığı yer Almaniya deyil.', ex('Almaniyadandır, Gəncədə yaşayır.', '“here, in Ganja” — burada, Gəncədə.', "I'm from Germany. — haradan; I live here, in Ganja. — harada yaşayır.", "I'm from Germany, but I live here, in Ganja.")),
        ],
      },
    },
    {
      type: 'voice', id: 'u3d8_c04', number: 4, title: 'Haradan olduğunu de', why: 'Haradan olduğunu dedin və sualı qaytardın.', hint: 'Əvvəl haradan olduğunu de, sonra qısa qarşı sualı əlavə et.',
      prompt: 'Ziyafətdə yeni tanış soruşur: “Where are you from?”\nHaradan olduğunu de və ondan da soruş.', audio: 'Hi! Where are you from?', reply: "I'm from France.",
      rule: own(FROM_RETURN, "I'm from Azerbaijan. And you?", "I'm from Baku. Where are you from?"),
      variants: [...FROM_MISTAKES, other("I'm from [ölkə]. And you?", ex("I'm from Azerbaijan. And you?", 'Haradan olduğunu “I’m from” ilə de, sonra “And you?” ilə soruş.', "I'm from Azerbaijan. — haradan; And you? — qarşı sual.", "I'm from Baku. And you?"))],
      review: {
        title: 'Haradan olduğunu de', why: 'Haradan olduğunu dedin və sualı qaytardın.', hint: 'Əvvəl haradan olduğunu de, sonra qısa qarşı sualı əlavə et.',
        prompt: 'Qatarda yanındakı sərnişin səninlə tanış olur.\nHaradan olduğunu de və ondan da soruş.', audio: 'Nice to meet you! Where are you from?', reply: "I'm from the UK.",
        rule: own(FROM_RETURN, "I'm from Azerbaijan. And you?", "I'm from Ganja. Where are you from?"),
        variants: [...FROM_MISTAKES, other("I'm from [ölkə]. And you?", ex("I'm from Azerbaijan. And you?", 'Haradan olduğunu “I’m from” ilə de, sonra “And you?” ilə soruş.', "I'm from Ganja. — haradan; Where are you from? — qarşı sual.", "I'm from Ganja. And you?"))],
      },
    },
    {
      type: 'write', id: 'u3d8_c05', number: 5, letters: ['T', 'B', 'I', 'L', 'I', 'S', 'I', 'E', 'Y'], title: 'Hərfləri tut', why: 'T-B-I-L-I-S-I — Tbilisi.', hint: 'Hər hərfi eşidən kimi toxun; “ay” və “i” fərqinə qulaq as.',
      prompt: 'Gürcüstandan olan yeni tanış şəhərini hərf-hərf deyir.\nEşitdiyin hərflərə toxun.', audio: "It's T-B-I-L-I-S-I.", placeholder: 'Şəhər',
      rule: exact('TBILISI'),
      variants: [other('Hərfləri bir-bir dinlə.', ex('TBILISI', 'Səsdə T, B, I, L, I, S, I deyilir: I “ay” oxunur.', 'I — ay; E — i.', "It's T-B-I-L-I-S-I."))],
      review: {
        letters: ['I', 'Z', 'M', 'I', 'R', 'E', 'S', 'A'], title: 'Hərfləri tut', why: 'I-Z-M-I-R — İzmir.', hint: 'Hər hərfi eşidən kimi toxun; “ay” və “i” fərqinə qulaq as.',
        prompt: 'Hostelin mətbəxində Türkiyədən olan gənc şəhərini hərf-hərf deyir.\nEşitdiyin hərflərə toxun.', audio: "It's I-Z-M-I-R.", placeholder: 'Şəhər',
        rule: exact('IZMIR'),
        variants: [other('Hərfləri bir-bir dinlə.', ex('IZMIR', 'Səsdə I, Z, M, I, R deyilir: I “ay”, R “ar”.', 'I — ay; R — ar.', "It's I-Z-M-I-R."))],
      },
    },
    {
      type: 'match', id: 'u3d8_c06', number: 6, title: 'Kim nə dedi?', why: 'Hər cümləni mənası ilə birləşdirdin.',
      prompt: 'Ziyafətdə eşitdiyin cümlələr.\nCümləyə toxun, sonra mənasını seç.',
      rows: [{ en: "She's from Iran.", az: 'O İrandandır.', from: 'G' }, { en: "He's German.", az: 'O almandır.', from: 'other' }, { en: 'I live in Baku.', az: 'Bakıda yaşayıram.', from: 'B' }],
      extra: ['O Almaniyadandır.'],
      variants: [
        pick("He's German.", '“German” — millət, ölkə yox.', ex("He's German. — O almandır.", 'German millətdir; ölkə “Germany”dir.', "He's German. — millət; He's from Germany. — ölkə.", "He's German.")),
        other('Bir cümlənin mənası yerində deyil.', ex("She's from Iran. — O İrandandır.; He's German. — O almandır.; I live in Baku. — Bakıda yaşayıram.", '“from” haradan olduğunu, “live in” harada yaşadığını deyir.', "She's from Iran. — haradan; I live in Baku. — harada yaşayır.", "She's from Iran.")),
      ],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümləni mənası ilə birləşdirdin.',
        prompt: 'Video zəngdə eşitdiyin cümlələr.\nCümləyə toxun, sonra mənasını seç.',
        rows: [{ en: "He's from the USA.", az: 'O ABŞ-dandır.', from: 'B' }, { en: 'Do you speak French?', az: 'Fransızca danışırsan?', from: 'other' }, { en: "I'm Georgian.", az: 'Mən gürcüyəm.', from: 'G' }],
        extra: ['Mən Gürcüstandanam.'],
        variants: [
          pick("I'm Georgian.", '“Georgian” — millət, ölkə yox.', ex("I'm Georgian. — Mən gürcüyəm.", 'Georgian millətdir; ölkə “Georgia”dır.', "I'm Georgian. — millət; I'm from Georgia. — ölkə.", "I'm Georgian.")),
          other('Bir cümlənin mənası yerində deyil.', ex("He's from the USA. — O ABŞ-dandır.; Do you speak French? — Fransızca danışırsan?; I'm Georgian. — Mən gürcüyəm.", '“from” ölkəni, “speak” dili, millət sözü milləti deyir.', "I'm Georgian. — millət; He's from the USA. — ölkə.", 'Do you speak French?')),
        ],
      },
    },
    {
      type: 'two', id: 'u3d8_c07', number: 7, title: 'İki mesaj yaz', why: 'Qızı təqdim etdin: haradandır və millətidir.', hint: 'Qız haqqında yazırsan — hər iki mesajı eyni sözlə başla.',
      prompt: 'Klubun çatında yeni üzv qız haqqında soruşur. Qız Gəncədəndir, azərbaycanlıdır.\nİki mesaj yaz:\n1. Haradan olduğunu.\n2. Millətini.',
      fields: [
        { id: 'u3d8_c07a', label: 'Birinci mesaj', placeholder: 'Haradandır?', rule: exact("She's from Ganja.", 'She is from Ganja.'), purpose: 'haradan olduğunu demək', empty: 'Birinci mesajı da yaz.' },
        { id: 'u3d8_c07b', label: 'İkinci mesaj', placeholder: 'Millətidir?', rule: exact("She's Azerbaijani.", 'She is Azerbaijani.'), purpose: 'millətini demək', empty: 'İkinci mesajı da yaz.' },
      ],
      variants: [
        { field: 'u3d8_c07a', match: { pattern: String.raw`^he\b` }, explain: ex("She's from Ganja.", 'Qız haqqında “she” deyilir, “he” oğlan üçündür.', "She's from Ganja. — qız; He's from Ganja. — oğlan.", "She's from Ganja.") },
        { field: 'u3d8_c07a', match: { other: true }, explain: ex("She's from Ganja.", 'Haradan olduğunu “from” ilə yazırsan.', "She's from Ganja. — haradan; She's Azerbaijani. — millət.", "She's from Ganja.") },
        { field: 'u3d8_c07b', match: { pattern: String.raw`^he\b` }, explain: ex("She's Azerbaijani.", 'Qız haqqında “she” deyilir, “he” oğlan üçündür.', "She's Azerbaijani. — qız; He's Azerbaijani. — oğlan.", "She's Azerbaijani.") },
        { field: 'u3d8_c07b', match: { other: true }, explain: ex("She's Azerbaijani.", 'Millət “from”suz yazılır: Azerbaijani.', "She's Azerbaijani. — millət; She's from Azerbaijan. — ölkə.", "She's Azerbaijani.") },
      ],
      review: {
        title: 'İki mesaj yaz', why: 'Oğlanı təqdim etdin: haradandır və millətidir.', hint: 'Oğlan haqqında yazırsan — hər iki mesajı eyni sözlə başla.',
        prompt: 'Hostelin çatında biri oğlan haqqında soruşur. Oğlan Bakıdandır, azərbaycanlıdır.\nİki mesaj yaz:\n1. Haradan olduğunu.\n2. Millətini.',
        fields: [
          { id: 'u3d8_c07a', label: 'Birinci mesaj', placeholder: 'Haradandır?', rule: exact("He's from Baku.", 'He is from Baku.'), purpose: 'haradan olduğunu demək', empty: 'Birinci mesajı da yaz.' },
          { id: 'u3d8_c07b', label: 'İkinci mesaj', placeholder: 'Millətidir?', rule: exact("He's Azerbaijani.", 'He is Azerbaijani.'), purpose: 'millətini demək', empty: 'İkinci mesajı da yaz.' },
        ],
        variants: [
          { field: 'u3d8_c07a', match: { pattern: String.raw`^she\b` }, explain: ex("He's from Baku.", 'Oğlan haqqında “he” deyilir, “she” qız üçündür.', "He's from Baku. — oğlan; She's from Baku. — qız.", "He's from Baku.") },
          { field: 'u3d8_c07a', match: { other: true }, explain: ex("He's from Baku.", 'Haradan olduğunu “from” ilə yazırsan.', "He's from Baku. — haradan; He's Azerbaijani. — millət.", "He's from Baku.") },
          { field: 'u3d8_c07b', match: { pattern: String.raw`^she\b` }, explain: ex("He's Azerbaijani.", 'Oğlan haqqında “he” deyilir, “she” qız üçündür.', "He's Azerbaijani. — oğlan; She's Azerbaijani. — qız.", "He's Azerbaijani.") },
          { field: 'u3d8_c07b', match: { other: true }, explain: ex("He's Azerbaijani.", 'Millət “from”suz yazılır: Azerbaijani.', "He's Azerbaijani. — millət; He's from Azerbaijan. — ölkə.", "He's Azerbaijani.") },
        ],
      },
    },
    {
      type: 'choice', id: 'u3d8_c08', number: 8, title: 'Sözü tamamla', why: 'Qız haqqında soruşanda “she” gəlir.', hint: 'Kim haqqında soruşur — qız, yoxsa oğlan?',
      prompt: 'Ziyafətdə oğlan yeni tanışın yanındakı qızı göstərir.\nQızın haradan olduğunu soruşur. Hansı söz çatmır?', gap: { speaker: 'B', before: "Where's", after: 'from?' },
      options: ['he', 'she', 'you'], answer: 'she',
      variants: [
        pick('he', '“he” oğlan üçündür.', ex("Where's she from?", 'Azərbaycancada “o” birdir, ingiliscə qız üçün “she” deyilir.', "Where's she from? — qız; Where's he from? — oğlan.", "Where's she from? — She's from Georgia.")),
        pick('you', 'Qızın özündən yox, onun haqqında soruşur.', ex("Where's she from?", '“you” qarşıdakı adamdır; onun haqqında danışanda “she” gəlir.', "Where's she from? — o; Where are you from? — sən.", "Where's she from?")),
      ],
      review: {
        title: 'Sözü tamamla', why: 'Oğlan haqqında soruşanda “he” gəlir.', hint: 'Kim haqqında soruşur — qız, yoxsa oğlan?',
        prompt: 'Video zəngdə qız ekrandakı oğlanı göstərir.\nYeni tanış oğlanın haradan olduğunu soruşur. Hansı söz çatmır?', gap: { speaker: 'other', before: "Where's", after: 'from?' },
        options: ['she', 'you', 'he'], answer: 'he',
        variants: [
          pick('she', '“she” qız üçündür.', ex("Where's he from?", 'Azərbaycancada “o” birdir, ingiliscə oğlan üçün “he” deyilir.', "Where's he from? — oğlan; Where's she from? — qız.", "Where's he from? — He's from Baku.")),
          pick('you', 'Oğlanın özündən yox, onun haqqında soruşur.', ex("Where's he from?", '“you” qarşıdakı adamdır; onun haqqında danışanda “he” gəlir.', "Where's he from? — o; Where are you from? — sən.", "Where's he from?")),
        ],
      },
    },
    {
      type: 'voice', id: 'u3d8_c09', number: 9, title: 'Dostunu təqdim et', why: 'Oğlanı təqdim etdin: haradandır və millətidir.', hint: 'Oğlan haqqında danışırsan; iki qısa cümlə de.',
      prompt: 'Yeni tanış oğlan haqqında soruşur. Oğlan Bakıdandır, azərbaycanlıdır.\nİki cümlə ilə de: haradandır və millətidir.', audio: "Where's he from?", reply: 'Nice!',
      rule: own(heFrom, "He's from Baku. He's Azerbaijani."),
      variants: [wrongHe, other("He's from [ölkə]. He's [millət]", ex("He's from Baku. He's Azerbaijani.", 'Əvvəl haradan olduğunu, sonra millətini de.', "He's from Baku. — haradan; He's Azerbaijani. — millət.", "He's from Baku. He's Azerbaijani."))],
      review: {
        title: 'Dostunu təqdim et', why: 'Qızı təqdim etdin: haradandır və millətidir.', hint: 'Qız haqqında danışırsan; iki qısa cümlə de.',
        prompt: 'Qatarda sərnişin qız haqqında soruşur. Qız Gəncədəndir, azərbaycanlıdır.\nİki cümlə ilə de: haradandır və millətidir.', audio: "Where's she from?", reply: 'Really? Nice!',
        rule: own(sheFrom, "She's from Ganja. She's Azerbaijani."),
        variants: [wrongShe, other("She's from [ölkə]. She's [millət]", ex("She's from Ganja. She's Azerbaijani.", 'Əvvəl haradan olduğunu, sonra millətini de.', "She's from Ganja. — haradan; She's Azerbaijani. — millət.", "She's from Ganja. She's Azerbaijani."))],
      },
    },
    {
      type: 'write', id: 'u3d8_c10', number: 10, keypad: true, title: 'Nömrəni yığ', why: 'Nömrəni rəqəm-rəqəm yığdın: oh — sıfır.', hint: 'Hər rəqəmi eşidən kimi bas; “ou” səsini də unutma.',
      prompt: 'Ziyafətin sonunda yeni tanış nömrəsini deyir.\nDinlə və yığ.', audio: "It's oh five five, four one eight, two two, seven three.", placeholder: 'Telefon nömrəsi',
      rule: exact('0554182273'),
      variants: [other('Rəqəmləri bir-bir yoxla.', ex('0554182273', '“oh” sıfırdır; “two two” — iki iki.', 'oh — 0; two two — 22.', "It's oh five five, four one eight, two two, seven three."))],
      review: {
        keypad: true, title: 'Nömrəni yığ', why: 'Nömrəni rəqəm-rəqəm yığdın.', hint: 'Hər rəqəmi eşidən kimi bas; “ou” səsini də unutma.',
        prompt: 'Hostelin resepsiyası klubun nömrəsini deyir.\nDinlə və yığ.', audio: "It's zero one two, five six oh, nine nine, one four.", placeholder: 'Telefon nömrəsi',
        rule: exact('0125609914'),
        variants: [other('Rəqəmləri bir-bir yoxla.', ex('0125609914', '“zero” və “oh” ikisi də sıfırdır.', 'zero — 0; oh — 0.', "It's zero one two, five six oh, nine nine, one four."))],
      },
    },
    {
      type: 'match', mode: 'reply', id: 'u3d8_c11', number: 11, title: 'Cavab cütü', why: 'Hər suala uyğun cavabı tapdın.',
      prompt: 'Ziyafətdə suallar.\nSuala toxun, sonra onun cavabını seç.',
      rows: [{ en: 'Do you speak Russian?', az: 'Yes, a little.', from: 'other' }, { en: 'Are you from Iran?', az: "No, I'm not.", from: 'G' }, { en: "Is he Turkish?", az: 'Yes, he is.', from: 'B' }],
      extra: ['I live in Ganja.'],
      variants: [other('Bir sualın cavabı yerində deyil.', ex("Do you speak Russian? — Yes, a little.; Are you from Iran? — No, I'm not.; Is he Turkish? — Yes, he is.", 'Dil, sən və o haqqında suallar fərqli cavab istəyir.', "Are you from Iran? — No, I'm not.; Is he Turkish? — Yes, he is.", 'Do you speak Russian? — Yes, a little.'))],
      review: {
        title: 'Cavab cütü', why: 'Hər suala uyğun cavabı tapdın.',
        prompt: 'Hostelin mətbəxində suallar.\nSuala toxun, sonra onun cavabını seç.',
        rows: [{ en: 'Where do you live?', az: 'I live in Baku.', from: 'other' }, { en: 'Do you speak German?', az: "No, I don't.", from: 'B' }, { en: 'Is she from France?', az: "No, she isn't.", from: 'G' }],
        extra: ["I'm from Georgia."],
        variants: [other('Bir sualın cavabı yerində deyil.', ex("Where do you live? — I live in Baku.; Do you speak German? — No, I don't.; Is she from France? — No, she isn't.", '“Do you” sualına “do”, “Is she” sualına “is” ilə cavab verilir.', "Do you speak German? — No, I don't.; Is she from France? — No, she isn't.", 'Where do you live? — I live in Baku.'))],
      },
    },
    {
      type: 'write', id: 'u3d8_c12', number: 12, title: 'Mesaj yaz', why: 'Harada yaşadığını yazdın.', hint: 'Şəhərindən əvvəl kiçik bir söz lazımdır.',
      prompt: 'Ziyafətdən sonra yeni tanış yazır.\nHarada yaşadığını yaz (istəsən, istənilən şəhər).', placeholder: 'Cavabını yaz',
      chat: { partner: 'Yeni tanış', from: 'other', lines: [{ from: 'other', text: 'Hi! Nice to meet you! Where do you live?' }] },
      rule: own(LIVE, 'I live in Baku.'),
      variants: [...LIVE_MISTAKES, other('I live in + şəhər.', ex('I live in Baku.', 'Harada yaşadığını “I live in” ilə yazırsan.', 'I live in Baku. — harada yaşayıram; I’m from Baku. — haradanam.', 'Where do you live? — I live in Ganja.'))],
      review: {
        title: 'Mesaj yaz', why: 'Harada yaşadığını yazdın.', hint: 'Şəhərindən əvvəl kiçik bir söz lazımdır.',
        prompt: 'Klubun çatında yeni üzv hamıdan soruşur.\nHarada yaşadığını yaz (istəsən, istənilən şəhər).', placeholder: 'Cavabını yaz',
        chat: { partner: 'Yeni üzv', from: 'other', lines: [{ from: 'other', text: "Hello! I live in Sumgayit. Where do you live?" }] },
        rule: own(LIVE, 'I live in Ganja.'),
        variants: [...LIVE_MISTAKES, other('I live in + şəhər.', ex('I live in Ganja.', 'Harada yaşadığını “I live in” ilə yazırsan.', 'I live in Ganja. — harada yaşayıram; I’m from Ganja. — haradanam.', 'Where do you live? — I live in Baku.'))],
      },
    },
    {
      type: 'voice', id: 'u3d8_c13', number: 13, repeat: { stress: 'live', note: 'live — “liv”, qısa “i” ilə.', reading: 'aym fram gəncə, bat ay liv in baku' }, title: 'Dinlə və təkrarla', why: 'Cümləni dedin: from — haradan, live in — harada.', hint: 'Əvvəl yavaş dinlə, sonra cümləni iki hissədə de.',
      prompt: 'Ziyafətdə qız özü haqqında deyir.\nDinlə, sonra eyni cür de.', audio: "I'm from Ganja, but I live in Baku.",
      rule: exact("I'm from Ganja, but I live in Baku.", "I'm from Ganja but I live in Baku."),
      variants: [other('Bir daha dinlə və yavaş de.', ex("I'm from Ganja, but I live in Baku.", 'İki hissə “but” ilə birləşir: haradan, amma harada yaşayır.', "I'm from Ganja. — haradan; I live in Baku. — harada yaşayır.", "I'm from Ganja, but I live in Baku."))],
      review: {
        repeat: { stress: 'speak', note: 'speak — “spik”, uzun “i” ilə.', reading: 'ay spik əzərbaycani ənd ə litl inqliş' }, title: 'Dinlə və təkrarla', why: 'Cümləni dedin: and — və, a little — bir az.', hint: 'Əvvəl yavaş dinlə, sonra cümləni iki hissədə de.',
        prompt: 'Video zəngdə oğlan dilləri haqqında deyir.\nDinlə, sonra eyni cür de.', audio: 'I speak Azerbaijani and a little English.',
        rule: exact('I speak Azerbaijani and a little English.'),
        variants: [other('Bir daha dinlə və yavaş de.', ex('I speak Azerbaijani and a little English.', '“and” iki dili birləşdirir, “a little” — bir az.', 'I speak Azerbaijani. — bir dil; I speak Azerbaijani and a little English. — iki dil.', 'I speak Azerbaijani and a little English.'))],
      },
    },
    {
      type: 'match', mode: 'order', id: 'u3d8_c14', number: 14, title: 'Söhbəti sırala', why: 'Tanışlıq, ölkə, dil və cavab düz sıradadır.', hint: 'Əvvəl salam və sual gəlir; ölkəni eşidən dil haqqında soruşur.',
      prompt: 'Dil klubunun ziyafəti.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: "Hi! I'm from Baku. Where are you from?", from: 'G' }, { en: '2', az: "I'm from France.", from: 'other' }, { en: '3', az: 'Really? Do you speak Azerbaijani?', from: 'G' }, { en: '4', az: 'Yes, a little.', from: 'other' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hi! I'm from Baku. Where are you from? → I'm from France. → Really? Do you speak Azerbaijani? → Yes, a little.", 'Əvvəl ölkə soruşulur, sonra dil.', "Where are you from? — ölkə; Do you speak English? — dil.", "Hi! I'm from Baku. Where are you from?"))],
      review: {
        title: 'Söhbəti sırala', why: 'Sual, cavab, yoxlama və təsdiq düz sıradadır.', hint: 'Əvvəl sual gəlir; cavabı eşidən millətini yoxlayır.',
        prompt: 'Ziyafətdə iki dost başqa bir qonaq haqqında danışır.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: "Where's she from?", from: 'B' }, { en: '2', az: "She's from Turkey.", from: 'G' }, { en: '3', az: 'Is she Turkish?', from: 'B' }, { en: '4', az: 'Yes, she is.', from: 'G' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Where's she from? → She's from Turkey. → Is she Turkish? → Yes, she is.", 'Sual, ölkə, millət haqqında yoxlama, sonra təsdiq.', "Where's she from? — ölkə; Is she Turkish? — millət.", "Where's she from? — She's from Turkey."))],
      },
    },
  ],
  result: {
    done: ['Dərs 8 tamamlandı', 'Ziyafətdə haradan olduğunu, harada yaşadığını, dillərini dedin və dostunu təqdim etdin.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Haradan, harada yaşamaq və dil haqqında deyiləni anlamaq', tasks: ['u3d8_c03', 'u3d8_c05', 'u3d8_c06', 'u3d8_c08', 'u3d8_c10', 'u3d8_c11', 'u3d8_c14'] },
      { group: 'Yazı', text: 'Dostunu yazıda təqdim etmək və harada yaşadığını yazmaq', tasks: ['u3d8_c07', 'u3d8_c12'] },
      { group: 'Danışıq', text: 'Haradan olduğunu demək, dostunu təqdim etmək, cümləni düzgün təkrarlamaq', tasks: ['u3d8_c04', 'u3d8_c09', 'u3d8_c13'] },
    ],
    closing: 'Bölmə 3 bitdi! İndi bölmə imtahanını verə bilərsən.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [],
};
