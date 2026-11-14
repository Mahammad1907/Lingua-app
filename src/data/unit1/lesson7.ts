// Bölmə 1 · Dərs 7 — Başa düşmürəm (Sorry? I don't understand. Again, please. Slowly, please.).
// Recognition only: Could you say that again, please? Spiral: How are you?, Excuse me, Thank you.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from './build';

const slow = goal(['slow'], ['Slowly, please.']);
const again = goal(['repeat'], ['Again, please.', 'Sorry? Again, please.']);
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
      type: 'choice', id: 'd7_c02', number: 2, title: 'Dinlə və anla', why: 'Halını dedi və “And you?” ilə soruşdu.', hint: 'İki hissəyə qulaq as: əvvəl özü haqqında deyir, sonra sənə sual verir.',
      prompt: 'Qızın cavabını dinlə.\nO nə edir?', audio: "I'm fine, thanks. And you?",
      options: ['Adını soruşur.', 'Halını deyib səni soruşur.', 'Üzr istəyir.'], answer: 'Halını deyib səni soruşur.',
      variants: [other('“fine” və “And you?” sözlərinə qulaq as.', ex('Halını deyib səni soruşur.', '“I’m fine, thanks” — halı; “And you?” — sualı geri qaytarır.', 'Halın + And you?', "I'm fine, thanks. And you?"))],
      review: {
        title: 'Dinlə və anla', why: 'Excuse me ilə nəzakətlə adı soruşdu.', hint: 'İki hissəyə qulaq as: əvvəl diqqəti çəkir, sonra sual verir.', prompt: 'Oğlanın sözlərini dinlə.\nO nə edir?', audio: "Excuse me, what's your name?",
        options: ['Üzr istəyir.', 'Təşəkkür edir.', 'Adını nəzakətlə soruşur.'], answer: 'Adını nəzakətlə soruşur.',
        variants: [other('“Excuse me” üzr deyil — diqqət çəkir.', ex('Adını nəzakətlə soruşur.', '“Excuse me” diqqəti çəkir, sonra ad sualı gəlir.', 'Excuse me + sual.', "Excuse me, what's your name?"))],
      },
    },
    {
      type: 'word', id: 'd7_c03', number: 3, scenes: ['d7/word-dont-understand'],
      word: "Sorry? I don't understand.", pronunciation: '/ˈsɑri aɪ doʊnt ˌʌndərˈstænd/', reading: 'sari? ay dount andərstend', az: 'Nə dedin? Başa düşmürəm.',
      notes: ['Sual kimi deyilən “Sorry?” — “nə dedin?” deməkdir.'],
      example: "Sorry? I don't understand.", exampleAz: 'Bağışla, nə dedin? Başa düşmürəm.',
    },
    {
      type: 'word', id: 'd7_c04', number: 4, scenes: ['d7/word-again'],
      word: 'Again, please.', pronunciation: '/əˈɡen pliz/', reading: 'əgen, pliz', az: 'Bir də, zəhmət olmasa.',
      notes: ['Uzun forması: Could you say that again, please?'],
      example: 'Could you say that again, please?', exampleAz: 'Bir də deyə bilərsən?',
    },
    {
      type: 'word', id: 'd7_c04b', number: 5, scenes: ['d7/word-slowly'],
      word: 'Slowly, please.', pronunciation: '/ˈsloʊli pliz/', reading: 'slouli, pliz', az: 'Yavaş, zəhmət olmasa.',
      notes: ['Çox sürətli danışanda deyilir.'],
      example: 'Sorry? Slowly, please.', exampleAz: 'Nə dedin? Yavaş, zəhmət olmasa.',
    },
    {
      type: 'choice', id: 'd7_c05', number: 5, title: 'Dinlə və anla', why: '“again” — bir də.',
      prompt: 'Oğlan sənə nə deyir?\nDinlə.', audio: 'Could you say that again, please?',
      options: ['Adını soruşur.', 'Bir də deməyini istəyir.', 'Sağollaşır.'], answer: 'Bir də deməyini istəyir.', hint: 'Bu dərsdə “Bir də deyə bilərsən?” mənasında uzun bir sual gördün. Səsdəki ona bənzəyir?', hintAssists: true,
      variants: [other('“again” — bir də.', ex('Bir də deməyini istəyir.', 'Uzun sualdır, amma əsas söz “again”dir.', 'again = bir də.', 'Again, please.'))],
      review: {
        title: 'Dinlə və anla', why: '“slowly” — yavaş.', prompt: 'Qız sənə nə deyir?\nDinlə.', audio: 'Slowly, please.',
        options: ['Təşəkkür edir.', 'Yavaş danışmağı istəyir.', 'Halını soruşur.'], answer: 'Yavaş danışmağı istəyir.', hint: 'Bu dərsdə iki xahiş öyrəndin: biri “bir də”, biri “yavaş”. Səsdəki hansıdır?', hintAssists: true,
        variants: [other('“slowly” — yavaş.', ex('Yavaş danışmağı istəyir.', '“Slowly, please” — “Yavaş, zəhmət olmasa”.', 'slowly = yavaş.', 'Slowly, please.'))],
      },
    },
    {
      type: 'match', id: 'd7_c06', number: 6, title: 'Kim nə dedi?', why: 'Hər xahiş öz yerində.', hint: 'Sual kimi deyilən “Sorry?” üzr deyil, “nə dedin?” deməkdir.',
      prompt: 'Hər cümləyə mənasını qoş.',
      rows: [{ en: 'Sorry?', az: 'Nə dedin?', from: 'G' }, { en: "I don't understand.", az: 'Başa düşmürəm.', from: 'B' }, { en: 'Slowly, please.', az: 'Yavaş, zəhmət olmasa.', from: 'M' }],
      extra: ['Eybi yox.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex('Sorry? — Nə dedin?; I don’t understand. — Başa düşmürəm.; Slowly, please. — Yavaş, zəhmət olmasa.', 'Sual kimi “Sorry?” üzr deyil — “nə dedin?”dir.', 'Mənaya görə qoş.', "Sorry? I don't understand."))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlə öz yerində.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.', prompt: 'Hər cümləyə mənasını qoş.',
        rows: [{ en: 'Again, please.', az: 'Bir də, zəhmət olmasa.', from: 'B' }, { en: 'No problem.', az: 'Eybi yox.', from: 'G' }, { en: 'Thank you!', az: 'Təşəkkür edirəm!', from: 'M' }],
        extra: ['Necəsən?'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex('Again, please. — Bir də, zəhmət olmasa.; No problem. — Eybi yox.; Thank you! — Təşəkkür edirəm!', 'Xahiş, üzrə cavab və təşəkkür fərqlidir.', 'Mənaya görə qoş.', 'Again, please.'))],
      },
    },
    {
      type: 'voice', id: 'd7_c07', number: 7, title: 'Dinlə və təkrarla', why: 'Vurğu düzgün yerdə idi.',
      prompt: 'Dinlə, sonra eyni cür de.', audio: "I don't understand.", repeat: { stress: 'understand', note: 'Vurğu sondadır: under-STAND.', reading: 'ay dount andərstend' },
      rule: exact("I don't understand"),
      variants: [other('Bir daha dinlə və yavaş de.', ex("I don't understand.", '“don’t” bir hecadır, “understand”də vurğu sonda.', 'under-STAND.', "I don't underSTAND."))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Vurğu düzgün yerdə idi.', prompt: 'Dinlə, sonra eyni cür de.', audio: 'Again, please.', repeat: { stress: 'Again', note: 'Vurğu ikinci hecadadır: a-GAIN.', reading: 'əgen, pliz' },
        rule: exact('Again please'),
        variants: [other('Bir daha dinlə və yavaş de.', ex('Again, please.', 'Birinci heca zəif, ikinci güclü.', 'a-GAIN.', 'Again, please.'))],
      },
    },
    {
      type: 'choice', id: 'd7_c08', number: 8, title: 'Sözü tamamla', why: 'I don’t understand — başa düşmürəm.', hint: '“Başa düşmürəm” — bu dərsin əvvəlindəki cümləni xatırla.',
      prompt: 'Oğlan başa düşmür.\nHansı söz çatmır?', gap: { speaker: 'B', before: 'Sorry? I', after: 'understand.' }, options: ['am', "don't", 'not'], answer: "don't",
      variants: [
        pick('not', '“I not understand” deyilmir.', ex("don't", 'I not understand demirik. Burada don’t lazımdır.', 'I’m not very well. — burada not. I don’t understand. — burada don’t.', "Sorry? I don't understand.")),
        pick('am', '“am” burada lazım deyil.', ex("don't", '“Başa düşmürəm” — I don’t understand.', 'I don’t understand.', "Sorry? I don't understand.")),
      ],
      review: {
        title: 'Sözü tamamla', why: 'Xahiş edəndə “please”.', hint: 'Xahişi nəzakətli edən söz Dərs 5-dən tanışdır.', prompt: 'Qız bir də eşitmək istəyir.\nHansı söz çatmır?', gap: { speaker: 'G', before: 'Again,', after: '.' }, options: ['sorry', 'thanks', 'please'], answer: 'please',
        variants: [other('Xahiş — please.', ex('please', 'Xahişi nəzakətli edən söz “please”dir.', 'Again, please.', 'Slowly, please.'))],
      },
    },
    {
      type: 'match', mode: 'order', id: 'd7_c09', number: 9, title: 'Söhbəti sırala', why: 'Əvvəl başa düşmədin, xahiş etdin, sonra cavab verdin.', hint: 'Söhbət salamla və ya sualla başlayır, sonra ona cavab gəlir.',
      prompt: 'Oğlan çox sürətli danışır.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: 'Hellohowareyou!', from: 'B' }, { en: '2', az: 'Sorry? Slowly, please.', from: 'G' }, { en: '3', az: 'How are you?', from: 'B' }, { en: '4', az: "I'm fine, thanks.", from: 'G' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hellohowareyou! → Sorry? Slowly, please. → How are you? → I'm fine, thanks.", 'Əvvəl salam və ya sual gəlir, sonra ona cavab verilir.', 'Sual → cavab.', "Hellohowareyou! → Sorry? Slowly, please. → How are you? → I'm fine, thanks."))],
      review: {
        title: 'Söhbəti sırala', why: 'Xahiş, təkrar və cavab düz sıradadır.', hint: 'Söhbət salamla və ya sualla başlayır, sonra ona cavab gəlir.', prompt: 'Qız sürətli soruşur.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: "Hiwhat'syourname?", from: 'G' }, { en: '2', az: 'Sorry? Again, please.', from: 'B' }, { en: '3', az: "What's your name?", from: 'G' }, { en: '4', az: 'My name is …', from: 'B' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Hiwhat'syourname? → Sorry? Again, please. → What's your name? → My name is …", 'Əvvəl salam və ya sual gəlir, sonra ona cavab verilir.', 'Sual → cavab.', "Hiwhat'syourname? → Sorry? Again, please. → What's your name? → My name is …"))],
      },
    },
    {
      type: 'write', id: 'd7_c10', number: 10, title: 'Cavabını yaz', why: 'Yavaş danışmağı xahiş etdin.', hint: 'Problem sürətdədir. Ondan nə xahiş edirsən?',
      prompt: 'Oğlan çox sürətli deyir: “Hellohowareyounicetomeetyou!”\nOndan yavaş danışmağı xahiş et.', placeholder: 'Cavabını yaz', rule: slow,
      variants: [
        insteadOf('repeat', 'Bu da olar, amma burada “yavaş” xahiş et.', ex('Slowly, please.', 'Problem sürətdir — yavaş danışmağı istəyirsən.', 'Xahişin sonuna “please” gəlir.', 'Slowly, please.')),
        other('Yavaş danışmağı xahiş et.', ex('Slowly, please.', 'O çox sürətli danışır.', 'Xahişin sonuna “please” gəlir.', 'Sorry? Slowly, please.')),
      ],
      review: {
        title: 'Cavabını yaz', why: 'Yavaş danışmağı xahiş etdin.', hint: 'Problem sürətdədir. Ondan nə xahiş edirsən?', prompt: 'Qız çox sürətli soruşur: “Hiwhat’syourname?”\nOndan yavaş danışmağı xahiş et.', placeholder: 'Cavabını yaz', rule: slow,
        variants: [other('Yavaş danışmağı xahiş et.', ex('Slowly, please.', 'O çox sürətli danışır.', 'Xahişin sonuna “please” gəlir.', 'Slowly, please.'))],
      },
    },
    {
      type: 'voice', id: 'd7_c11', number: 11, speaker: 'mascot', title: 'Təkrar istə', why: 'Təkrarı nəzakətlə istədin.', hint: 'Eşitmədin. Bir də deməsini xahiş et.',
      prompt: '{M} çox sürətli danışdı.\nBir də deməsini xahiş et.', audio: 'Hello how are you nice to meet you', sample: 'Sorry? Again, please.', rule: again,
      variants: [other('Again, please.', ex('Sorry? Again, please.', 'Eşitmədin — bir də deməsini istəyirsən.', 'Eşitməyəndə “bir də” xahiş edirsən.', 'Again, please.'))],
      review: {
        speaker: 'mascot', title: 'Təkrar istə', why: 'Təkrarı nəzakətlə istədin.', hint: 'Eşitmədin. Bir də deməsini xahiş et.', prompt: 'Səs-küylü yerdə {m} nəsə dedi.\nBir də deməsini xahiş et.', audio: "What's your name", rule: again,
        variants: [other('Again, please.', ex('Again, please.', 'Eşitmədin — bir də deməsini istəyirsən.', 'Eşitməyəndə “bir də” xahiş edirsən.', 'Sorry? Again, please.'))],
      },
    },
    {
      type: 'voice', id: 'd7_c12', number: 12, speaker: 'mascot', title: 'Başa düşmədiyini de', why: 'Başa düşmədiyini açıq dedin.', hint: 'Bu dərsin əvvəlində öyrəndiyin “Başa düşmürəm” cümləsini de.',
      prompt: '{M} sənə yeni bir söz deyir, mənasını bilmirsən.\nBaşa düşmədiyini de.', rule: dont, reply: 'OK! Slowly…',
      variants: [other("I don't understand.", ex("I don't understand.", 'Bilmədiyini demək normaldır.', 'I don’t understand.', "Sorry? I don't understand."))],
      review: {
        speaker: 'mascot', title: 'Başa düşmədiyini de', why: 'Başa düşmədiyini açıq dedin.', hint: 'Bu dərsin əvvəlində öyrəndiyin “Başa düşmürəm” cümləsini de.', prompt: '{M} uzun cümlə dedi, heç nə anlamadın.\nBaşa düşmədiyini de.', rule: dont, reply: 'OK! Slowly…',
        variants: [other("I don't understand.", ex("I don't understand.", 'Bilmədiyini demək normaldır.', 'I don’t understand.', "I don't understand."))],
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
      { group: 'Yazı', text: 'Başa düşmədiyini yazmaq', tasks: ['d7_c10'] },
      { group: 'Danışıq', text: 'Təkrar və yavaş danışmağı istəmək', tasks: ['d7_c11', 'd7_c12', 'd7_c13'] },
    ],
    closing: 'Növbəti dərs — bölmə söhbəti: öyrəndiklərinin hamısı bir yerdə.', button: 'Ana səhifəyə qayıt',
    technical: 'Səs problemi oldu. Bu hissə yoxlanmadı.', unverified: 'Yoxlanmadı',
  },
  vocabulary: [
    { word: "I don't understand", translation: 'Başa düşmürəm', example: "Sorry? I don't understand.", exampleAz: 'Nə dedin? Başa düşmürəm.', usageNote: 'Başa düşməyəndə.', pronunciation: '/aɪ doʊnt ˌʌndərˈstænd/', teachCard: 'd7_c03' },
    { word: 'Again, please', translation: 'Bir də, zəhmət olmasa', example: 'Sorry? Again, please.', exampleAz: 'Nə dedin? Bir də, zəhmət olmasa.', usageNote: 'Təkrar istəmək.', pronunciation: '/əˈɡen pliz/', teachCard: 'd7_c04' },
    { word: 'Slowly, please', translation: 'Yavaş, zəhmət olmasa', example: 'Slowly, please.', exampleAz: 'Yavaş, zəhmət olmasa.', usageNote: 'Yavaş danışmağı istəmək.', pronunciation: '/ˈsloʊli pliz/', teachCard: 'd7_c04b' },
  ],
};
