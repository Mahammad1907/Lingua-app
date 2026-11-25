// Bölmə 1 · Dərs 7 — Başa düşmürəm (Sorry? I don't understand. Say that again, please. More slowly, please.).
// Spiral: How are you?, Excuse me, Thank you.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from './build';

const slow = goal(['slow'], ['More slowly, please.', 'Slowly, please.']);
const again = goal(['repeat'], ['Say that again, please.', 'Sorry? Say that again, please.', 'Again, please.']);
const dont = goal(['dontUnderstand'], ["I don't understand."]);

export const lesson7: DesignLesson = {
  id: 'a1_en_b1_v2_d7', order: 7, title: 'Başa düşmürəm', section: 'İlk tanışlıq',
  notices: {
    soundFailed: 'Səs açılmadı. Yenidən dinlə və ya mətnlə davam et.',
    unknown: 'Cavabı yoxlaya bilmədim. Bir az fərqli yaz və ya yenidən cəhd et.',
    voiceUnknown: 'Səsini aydın eşitmədim. Yenidən de.',
    micFailed: 'Mikrofon açılmadı. Keçə bilərsən.',
    review: 'Səhv etdiyin tapşırıqlara yeni vəziyyətdə qayıdırıq.',
  },
  cards: [
    {
      type: 'intro', id: 'd7_c01', badge: 'İlk tanışlıq', subtitle: 'Başa düşməmək normaldır — bunu demək bacarıqdır.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Başa düşməyəndə “I don’t understand” deyə bilirəm.' },
        { icon: 'wave', text: 'Təkrar və yavaş danışmağı xahiş edirəm.' },
      ],
    },
    {
      type: 'choice', id: 'd7_c02', number: 2, title: 'Dinlə və anla', why: 'Halını dedi və “And you?” ilə soruşdu.', hint: 'Cümlənin iki hissəsinə ayrıca qulaq as.',
      prompt: 'Qızın cavabını dinlə.\nO nə edir?', audio: "I'm fine, thanks. And you?",
      options: ['Adını soruşur.', 'Halını deyib səni soruşur.', 'Üzr istəyir.'], answer: 'Halını deyib səni soruşur.',
      variants: [other('“fine” və “And you?” sözlərinə qulaq as.', ex('Halını deyib səni soruşur.', '“I’m fine, thanks” — halı; “And you?” — sualı geri qaytarır.', 'Halın + And you?', "I'm fine, thanks. And you?"))],
      review: {
        title: 'Dinlə və anla', why: 'Salam deyib adını soruşdu.', hint: 'Cümlənin iki hissəsinə ayrıca qulaq as.', prompt: 'Oğlanın sözlərini dinlə.\nO nə edir?', audio: "Hi! What's your name?",
        options: ['Üzr istəyir.', 'Təşəkkür edir.', 'Salam deyib adını soruşur.'], answer: 'Salam deyib adını soruşur.',
        variants: [other('Səsdə “Hi” və ad sualı var.', ex('Salam deyib adını soruşur.', '“Hi” salamdır, “What’s your name?” ad sualıdır.', 'Hi + ad sualı.', "Hi! What's your name?"))],
      },
    },
    {
      type: 'word', id: 'd7_c03', number: 3, scenes: ['d7/word-dont-understand'],
      shortForm: { full: "do not", short: "don't" },
      word: "Sorry? I don't understand.", pronunciation: '/ˈsɑri aɪ doʊnt ˌʌndərˈstænd/', reading: 'sari? ay dount andərstənd', az: 'Bağışlayın? Başa düşmürəm.',
      notes: ['Sual kimi deyilən “Sorry?” — “Bağışlayın? / Necə?” deməkdir.'],
      example: "Sorry? I don't understand.", exampleAz: 'Bağışlayın? Başa düşmürəm.',
    },
    {
      type: 'word', id: 'd7_c04', number: 4, scenes: ['d7/word-again'],
      word: 'Say that again, please.', pronunciation: '/seɪ ðæt əˈɡen pliz/', reading: 'sey thət əgen, pliz', az: 'Bunu bir daha deyin, zəhmət olmasa.',
      notes: ['Eşitmədiyini təkrar istəməyin təbii yolu: “bunu bir daha de”.', 'th — dil ucu dişlərin arasında.'],
      example: 'Sorry? Say that again, please.', exampleAz: 'Bağışlayın? Bunu bir daha deyin, zəhmət olmasa.',
    },
    {
      type: 'word', id: 'd7_c04b', number: 5, scenes: ['d7/word-slowly'],
      word: 'More slowly, please.', pronunciation: '/mɔr ˈsloʊli pliz/', reading: 'mor slouli, pliz', az: 'Daha yavaş, zəhmət olmasa.',
      notes: ['Çox sürətli danışanda deyilir.'],
      example: 'Sorry? More slowly, please.', exampleAz: 'Bağışlayın? Daha yavaş, zəhmət olmasa.',
    },
    {
      type: 'choice', id: 'd7_c05', number: 5, title: 'Dinlə və anla', why: '“Say that again” — bunu bir daha de.',
      prompt: 'Oğlan sənə nə deyir?\nDinlə.', audio: 'Sorry? Say that again, please.',
      options: ['Adını soruşur.', 'Bir də deməyini istəyir.', 'Sağollaşır.'], answer: 'Bir də deməyini istəyir.', hint: 'Səsdə “please”-dən əvvəlki sözə qulaq as.', hintAssists: true,
      variants: [other('“again” — bir daha.', ex('Bir də deməyini istəyir.', 'Səsdə “Say that again, please” deyilir — “Bunu bir daha deyin, zəhmət olmasa”.', 'Sorry? Say that again, please. — bir də de; Sorry? I don’t understand. — başa düşmürəm.', 'Sorry? Say that again, please.'))],
      review: {
        title: 'Dinlə və anla', why: '“more slowly” — daha yavaş.', prompt: 'Qız sənə nə deyir?\nDinlə.', audio: 'More slowly, please.',
        options: ['Təşəkkür edir.', 'Yavaş danışmağı istəyir.', 'Halını soruşur.'], answer: 'Yavaş danışmağı istəyir.', hint: 'Səsdə “please”-dən əvvəlki sözə qulaq as.', hintAssists: true,
        variants: [other('“more slowly” — daha yavaş.', ex('Yavaş danışmağı istəyir.', '“More slowly, please” — “Daha yavaş, zəhmət olmasa”.', 'Say that again, please — bir də; More slowly, please — yavaş.', 'More slowly, please.'))],
      },
    },
    {
      type: 'match', id: 'd7_c06', number: 6, title: 'Kim nə dedi?', why: 'Hər xahiş öz yerində.', hint: 'Sual kimi deyilən sözə diqqət et — o, üzr deyil.',
      prompt: 'Hər cümləyə mənasını qoş.',
      rows: [{ en: 'Sorry?', az: 'Necə?', from: 'G' }, { en: "I don't understand.", az: 'Başa düşmürəm.', from: 'B' }, { en: 'More slowly, please.', az: 'Daha yavaş, zəhmət olmasa.', from: 'M' }],
      extra: ['Eybi yox.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex('Sorry? — Necə?; I don’t understand. — Başa düşmürəm.; More slowly, please. — Daha yavaş, zəhmət olmasa.', 'Sual kimi “Sorry?” üzr deyil — “Bağışlayın? / Necə?” deməkdir.', 'Sorry? — Necə?; Sorry! — üzr.', "Sorry? I don't understand."))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlə öz yerində.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.', prompt: 'Hər cümləyə mənasını qoş.',
        rows: [{ en: 'Say that again, please.', az: 'Bunu bir daha deyin, zəhmət olmasa.', from: 'B' }, { en: 'No problem.', az: 'Eybi yox.', from: 'G' }, { en: 'Thank you!', az: 'Təşəkkür edirəm!', from: 'M' }],
        extra: ['Necəsən?'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex('Say that again, please. — Bunu bir daha deyin, zəhmət olmasa.; No problem. — Eybi yox.; Thank you! — Təşəkkür edirəm!', 'Xahiş, üzrə cavab və təşəkkür fərqlidir.', 'Say that again, please — xahiş; No problem. — üzrə cavab.', 'Say that again, please.'))],
      },
    },
    {
      type: 'voice', id: 'd7_c07', number: 7, title: 'Dinlə və təkrarla', why: 'Vurğu düzgün yerdə idi.',
      prompt: 'Dinlə, sonra eyni cür de.', audio: "I don't understand.", repeat: { stress: 'understand', note: 'Vurğu sondadır: under-STAND.', reading: 'ay dount andərstənd' },
      rule: exact("I don't understand"),
      variants: [other('Bir daha dinlə və yavaş de.', ex("I don't understand.", '“don’t” bir hecadır, “understand”də vurğu sonda.', 'under-STAND.', "I don't underSTAND."))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Vurğu düzgün yerdə idi.', prompt: 'Dinlə, sonra eyni cür de.', audio: 'Say that again, please.', repeat: { stress: 'again', note: '“again”də vurğu ikinci hecadadır: a-GAIN.', reading: 'sey thət əgen, pliz' },
        rule: exact('Say that again please', 'Again please'),
        variants: [other('Bir daha dinlə və yavaş de.', ex('Say that again, please.', 'Birinci heca zəif, ikinci güclü.', 'a-GAIN.', 'Say that again, please.'))],
      },
    },
    {
      type: 'choice', id: 'd7_c08', number: 8, title: 'Sözü tamamla', why: 'I don’t understand — başa düşmürəm.', hint: '“Başa düşmürəm” — bu dərsin əvvəlindəki cümləni xatırla.',
      prompt: 'Oğlan başa düşmür.\nHansı söz çatmır?', gap: { speaker: 'B', before: 'Sorry? I', after: 'understand.' }, options: ['am', "don't", 'not'], answer: "don't",
      variants: [
        pick('not', '“I not understand” deyilmir.', ex("don't", 'I not understand demirik, burada don’t lazımdır.', 'I’m not great — burada not, I don’t understand — burada don’t.', "Sorry? I don't understand.")),
        pick('am', '“am” burada lazım deyil.', ex("don't", 'I am understand demirik, burada don’t lazımdır.', 'I’m not great — burada not; I don’t understand — burada don’t.', "Sorry? I don't understand.")),
      ],
      review: {
        title: 'Sözü tamamla', why: 'Xahiş edəndə “please”.', hint: 'Xahişi nəzakətli edən söz Dərs 5-dən tanışdır.', prompt: 'Qız bir də eşitmək istəyir.\nHansı söz çatmır?', gap: { speaker: 'G', before: 'Say that again,', after: '.' }, options: ['sorry', 'thanks', 'please'], answer: 'please',
        variants: [other('Xahiş — please.', ex('please', 'Xahişi nəzakətli edən söz “please”dir.', 'Say that again, please.', 'More slowly, please.'))],
      },
    },
    {
      type: 'match', mode: 'order', id: 'd7_c09', number: 9, title: 'Söhbəti sırala', why: 'Əvvəl başa düşmədin, xahiş etdin, sonra cavab verdin.', hint: 'Düşün: başa düşməyəndə nə deyirsən və bundan sonra nə olur?',
      prompt: 'Oğlan çox sürətli danışır.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: 'Hellohowareyou!', from: 'B' }, { en: '2', az: 'Sorry? More slowly, please.', from: 'G' }, { en: '3', az: 'How are you?', from: 'B' }, { en: '4', az: "I'm fine, thanks.", from: 'G' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hellohowareyou! → Sorry? More slowly, please. → How are you? → I'm fine, thanks.", 'Sürətli danışdı, sən xahiş etdin, o yavaş təkrar etdi.', 'More slowly, please — çox sürətli idi; Say that again, please — eşitmədin.', "Hellohowareyou! → Sorry? More slowly, please. → How are you? → I'm fine, thanks."))],
      review: {
        title: 'Söhbəti sırala', why: 'Xahiş, təkrar və cavab düz sıradadır.', hint: 'Düşün: eşitməyəndə nə deyirsən və bundan sonra nə olur?', prompt: 'Səs-küydə qızın sualını eşitmədin.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: "Hi! What's your name?", from: 'G' }, { en: '2', az: 'Sorry? Say that again, please.', from: 'B' }, { en: '3', az: "What's your name?", from: 'G' }, { en: '4', az: 'My name is [ad]', from: 'B' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Hi! What's your name? → Sorry? Say that again, please. → What's your name? → My name is [ad]", 'Sualı eşitmədin, sən təkrar istədin, o yenidən soruşdu.', 'Say that again, please — eşitmədin; More slowly, please — çox sürətli idi.', "Hi! What's your name? → Sorry? Say that again, please. → What's your name? → My name is [ad]"))],
      },
    },
    {
      type: 'write', id: 'd7_c10', number: 10, title: 'Cavabını yaz', why: 'Yavaş danışmağı xahiş etdin.', hint: 'Problem sürətdədir — ondan nə xahiş edirsən?',
      prompt: 'Oğlan çox sürətli səsli mesaj göndərdi.\nYavaş danışmasını xahiş et.', placeholder: 'Cavabını yaz', rule: slow,
      variants: [
        insteadOf('repeat', 'Problem sürətdədir — yavaş danışmağı xahiş et.', ex('More slowly, please.', 'Problem sürətdədir, ona görə “More slowly” lazımdır.', 'Say that again, please — bir də; More slowly, please — yavaş.', 'More slowly, please.')),
        other('Yavaş danışmağı xahiş et.', ex('More slowly, please.', 'O çox sürətli danışır, ona görə “More slowly” lazımdır.', 'Say that again, please — bir də; More slowly, please — yavaş.', 'Sorry? More slowly, please.')),
      ],
      review: {
        title: 'Cavabını yaz', why: 'Yavaş danışmağı xahiş etdin.', hint: 'Problem sürətdədir — ondan nə xahiş edirsən?', prompt: 'Qız çox sürətli səsli mesaj göndərdi.\nYavaş danışmasını xahiş et.', placeholder: 'Cavabını yaz', rule: slow,
        variants: [other('Yavaş danışmağı xahiş et.', ex('More slowly, please.', 'O çox sürətli danışır, ona görə “More slowly” lazımdır.', 'Say that again, please — bir də; More slowly, please — yavaş.', 'More slowly, please.'))],
      },
    },
    {
      type: 'voice', id: 'd7_c11', number: 11, speaker: 'mascot', title: 'Təkrar istə', why: 'Təkrarı nəzakətlə istədin.', hint: 'Dərsin “bir də” xahişini xatırla.',
      prompt: 'Səs-küydə {m} nəsə dedi, eşitmədin.\nBir də deməsini xahiş et.', audio: 'Hello! How are you?', sample: 'Sorry? Say that again, please.', rule: again,
      variants: [other('Say that again, please.', ex('Sorry? Say that again, please.', 'Eşitmədin — bir də deməsini istəyirsən.', 'Sorry? Say that again, please. — eşitmədin; Sorry? I don’t understand. — başa düşmürsən.', 'Say that again, please.'))],
      review: {
        speaker: 'mascot', title: 'Təkrar istə', why: 'Təkrarı nəzakətlə istədin.', hint: 'Dərsin “bir də” xahişini xatırla.', prompt: 'Səs-küylü yerdə {m} nəsə dedi.\nBir də deməsini xahiş et.', audio: "What's your name?", rule: again,
        variants: [other('Say that again, please.', ex('Say that again, please.', 'Səs-küydə eşitmədin — bir də deməsini istəyirsən.', 'Say that again, please — eşitmədin; More slowly, please — çox sürətli idi.', 'Sorry? Say that again, please.'))],
      },
    },
    {
      type: 'voice', id: 'd7_c12', number: 12, speaker: 'mascot', title: 'Başa düşmədiyini de', why: 'Başa düşmədiyini açıq dedin.', hint: 'Bu dərsin əvvəlində öyrəndiyin “Başa düşmürəm” cümləsini de.',
      prompt: '{M} sənə yeni bir söz deyir, mənasını bilmirsən.\nBaşa düşmədiyini de.', rule: dont, reply: 'OK! More slowly…',
      variants: [other("I don't understand.", ex("I don't understand.", 'Mənasını bilmirsən, ona görə “Başa düşmürəm” deyirsən.', 'I don’t understand. — burada don’t; I’m not great. — burada not.', "Sorry? I don't understand."))],
      review: {
        speaker: 'mascot', title: 'Başa düşmədiyini de', why: 'Başa düşmədiyini açıq dedin.', hint: 'Bu dərsin əvvəlində öyrəndiyin “Başa düşmürəm” cümləsini de.', prompt: '{M} uzun cümlə dedi, heç nə anlamadın.\nBaşa düşmədiyini de.', rule: dont, reply: 'OK! More slowly…',
        variants: [other("I don't understand.", ex("I don't understand.", 'Heç nə anlamadın, ona görə “Başa düşmürəm” deyirsən.', 'I don’t understand. — burada don’t; I’m not great. — burada not.', "I don't understand."))],
      },
    },
    {
      type: 'voice', id: 'd7_c13', number: 13, speaker: 'mascot', title: 'İndi başa düşdün', why: 'Halını dedin və təşəkkür etdin.', hint: 'Əvvəl halını de, sonra təşəkkür et.',
      prompt: '{M} yavaş təkrar edir: “How are you?”\nCavab ver və təşəkkür et.', audio: 'How are you?', rule: goal(['feeling', 'thanks'], ["I'm fine, thanks!", "I'm OK, thank you!"]),
      variants: [other('Halın + thanks.', ex("I'm fine, thanks!", 'İndi sualı başa düşdün: halını de və təşəkkür et.', 'Halın + thanks.', "I'm OK, thank you!"))],
      review: {
        speaker: 'mascot', title: 'İndi başa düşdün', why: 'Halını dedin və təşəkkür etdin.', hint: 'Əvvəl halını de, sonra təşəkkür et.', prompt: '{M} yavaş soruşur: “How are you?”\nCavab ver və təşəkkür et.', audio: 'How are you?', rule: goal(['feeling', 'thanks'], ["I'm OK, thank you!", "I'm fine, thanks!"]),
        variants: [other('Halın + thanks.', ex("I'm OK, thank you!", 'Halını de və təşəkkür et.', 'Halın + thanks.', "I'm fine, thanks!"))],
      },
    },
  ],
  result: {
    done: ['Dərs 7 tamamlandı', 'Artıq başa düşmədiyini deyib kömək istəyə bilirsən.'],
    incomplete: 'Dərs tam bitmədi. Yoxlanmayan tapşırıqlara sonra qayıda bilərsən.',
    goals: [
      { group: 'Tanıma', text: 'Təkrar və yavaş xahişlərini anlamaq', tasks: ['d7_c09', 'd7_c02', 'd7_c05', 'd7_c06', 'd7_c08'] },
      { group: 'Yazı', text: 'Yavaş danışmağı yazıyla xahiş etmək', tasks: ['d7_c10'] },
      { group: 'Danışıq', text: 'Təkrar və yavaş danışmağı istəmək', tasks: ['d7_c11', 'd7_c12', 'd7_c13'] },
    ],
    closing: 'Növbəti dərs — bölmə söhbəti: öyrəndiklərinin hamısı bir yerdə.', button: 'Ana səhifəyə qayıt',
    technical: 'Səs problemi oldu. Bu hissə yoxlanmadı.', unverified: 'Yoxlanmadı',
  },
  vocabulary: [
    { word: "I don't understand", translation: 'Başa düşmürəm', example: "Sorry? I don't understand.", exampleAz: 'Bağışlayın? Başa düşmürəm.', usageNote: 'Başa düşməyəndə.', pronunciation: '/aɪ doʊnt ˌʌndərˈstænd/', teachCard: 'd7_c03' },
    { word: 'Say that again, please', translation: 'Bunu bir daha deyin, zəhmət olmasa', example: 'Sorry? Say that again, please.', exampleAz: 'Bağışlayın? Bunu bir daha deyin, zəhmət olmasa.', usageNote: 'Təkrar istəmək.', pronunciation: '/seɪ ðæt əˈɡen pliz/', teachCard: 'd7_c04' },
    { word: 'More slowly, please', translation: 'Daha yavaş, zəhmət olmasa', example: 'More slowly, please.', exampleAz: 'Daha yavaş, zəhmət olmasa.', usageNote: 'Yavaş danışmağı istəmək.', pronunciation: '/mɔr ˈsloʊli pliz/', teachCard: 'd7_c04b' },
  ],
};
