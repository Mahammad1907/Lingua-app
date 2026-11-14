// Bölmə 1 · Dərs 8 — Bölmə söhbəti. No new words: the whole section in one party, listening, writing and speaking mixed.
// If the microphone fails the voice cards can be skipped; the written cards still cover every goal.
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from './build';

const greetIntro = goal(['greet', 'introduce'], ["Hi! I'm …", 'Hello! My name is …']);
const askName = goal(['askName'], ["What's your name?"]);
const help = goal(['dontUnderstand', 'repeat'], ["Sorry? I don't understand. Again, please."]);

export const lesson8: DesignLesson = {
  id: 'a1_en_b1_v2_d8', order: 8, title: 'Bölmə söhbəti', section: 'İlk tanışlıq',
  notices: {
    soundFailed: 'Səs açılmadı. Yenidən dinlə və ya mətnlə davam et.',
    unknown: 'Cavabı yoxlaya bilmədim. Bir az fərqli yaz və ya yenidən cəhd et.',
    voiceUnknown: 'Səsini aydın eşitmədim. Yenidən de.',
    micFailed: 'Mikrofon açılmadı. Keçə bilərsən.',
    review: 'Səhv etdiyin tapşırıqlara yeni vəziyyətdə qayıdırıq.',
  },
  cards: [
    {
      type: 'intro', id: 'd8_c01', badge: 'Bölmə söhbəti', subtitle: 'Ziyafətdə hamı ilə tanış olursan. Öyrəndiklərin bir yerdə.', start: 'Söhbətə başla',
      goals: [
        { icon: 'wave', text: 'Qısa tanışlıq söhbəti apara bilirəm.' },
        { icon: 'chat', text: 'Başa düşməyəndə kömək istəyə bilirəm.' },
        { icon: 'bye', text: 'Söhbəti nəzakətlə bitirə bilirəm.' },
      ],
    },
    {
      type: 'teach', id: 'd8_c02', number: 2, scenes: ['d8/party-talk'], title: 'Ziyafətdə',
      lead: 'Qız və oğlan ziyafətdə tanış olur. Hər cümləni dinlə:',
      phrases: [
        { en: 'Hi! How are you?', az: 'Salam! Necəsən?' },
        { en: "I'm fine, thanks. And you?", az: 'Yaxşıyam, sağ ol. Bəs sən?' },
        { en: "I'm OK. What's your name?", az: 'Normalam. Adın nədir?' },
        { en: "I'm … Nice to meet you!", az: 'Mən …-am. Tanış olmağıma şadam!' },
      ],
      notes: ['Bu söhbətdə ilk dörd dərsin hamısı var. Sən də belə danışa bilirsən.'],
    },
    {
      type: 'choice', id: 'd8_c03', number: 3, title: 'Dinlə və cavab seç', why: 'Nice to meet you → You too!', hint: 'Dərs 3-də tanışlığın xoş sözünə necə cavab verilirdi?',
      prompt: 'Ziyafətdə oğlan sənə nəsə deyir.\nNecə cavab verərsən?', audio: 'Nice to meet you!', options: ['Please.', 'You too!', 'Sorry!'], answer: 'You too!',
      variants: [
        pick('Please.', '“Please” xahişdir.', ex('You too!', '“Please” xahişdir, tanışlığa cavab deyil.', 'Nice to meet you → You too!', 'Nice to meet you! — You too!')),
        pick('Sorry!', 'Səhv etməmisən.', ex('You too!', '“Sorry” üzrdür, burada isə tanışlığa cavab verirsən.', 'Nice to meet you → You too!', 'Nice to meet you! — You too!')),
      ],
      review: {
        title: 'Dinlə və cavab seç', why: 'Thank you → You’re welcome.', hint: 'Dərs 5-də təşəkkürə necə cavab verilirdi?', prompt: 'Qıza su verdin. O sənə təşəkkür edir.\nNecə cavab verərsən?', audio: 'Thank you!', options: ["You're welcome.", 'You too!', 'Again, please.'], answer: "You're welcome.",
        variants: [other('Təşəkkürə cavab: You’re welcome.', ex("You're welcome.", '“You too” tanışlığa cavabdır, “Again, please” təkrar xahişidir.', 'Thank you → You’re welcome.', "Thanks! — You're welcome."))],
      },
    },
    {
      type: 'choice', id: 'd8_c04', number: 4, title: 'Sözü tamamla', why: 'Halından sonra təşəkkür.', hint: 'Dərs 4-ün cavabını xatırla: halın, sonra təşəkkür.',
      prompt: 'Qız halını deyir.\nHansı söz çatmır?', gap: { speaker: 'G', before: "I'm fine,", after: '. And you?' }, options: ['please', 'thanks', 'sorry'], answer: 'thanks',
      variants: [other('Halından sonra “thanks”.', ex('thanks', 'Sual verənə təşəkkür edirsən: I’m fine, thanks.', 'Halın + thanks + And you?', "I'm fine, thanks. And you?"))],
      review: {
        title: 'Sözü tamamla', why: 'Nice to meet you.', hint: 'Dərs 3-də tanışlıqda deyilən xoş sözü xatırla.', prompt: 'Oğlan tanış olur.\nHansı söz çatmır?', gap: { speaker: 'B', before: 'Nice to', after: 'you!' }, options: ['meet', 'welcome', 'understand'], answer: 'meet',
        variants: [other('Nice to meet you.', ex('meet', '“Nice to meet you” — Tanış olmağıma şadam.', 'Nice to meet you!', 'Nice to meet you! — You too!'))],
      },
    },
    {
      type: 'match', id: 'd8_c05', number: 5, title: 'Kim nə dedi?', why: 'İki “bağışlayın”ı ayırdın.', hint: 'İki “bağışlayın”ı ayır: biri diqqət çəkir, biri üzrdür.',
      prompt: 'Hər cümləyə mənasını qoş.',
      rows: [{ en: 'Excuse me.', az: 'Bağışlayın (diqqət).', from: 'B' }, { en: 'Sorry!', az: 'Bağışlayın (səhv).', from: 'G' }, { en: 'No problem.', az: 'Eybi yox.', from: 'M' }],
      extra: ['Dəyməz.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex('Excuse me. — Bağışlayın (diqqət).; Sorry! — Bağışlayın (səhv).; No problem. — Eybi yox.', 'Excuse me diqqət çəkir, Sorry üzrdür, No problem üzrə cavabdır.', 'Diqqət → Excuse me; səhv → Sorry.', 'Sorry! — No problem.'))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlə öz yerində.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy.', prompt: 'Hər cümləyə mənasını qoş.',
        rows: [{ en: 'Hello!', az: 'Salam!', from: 'G' }, { en: "I don't understand.", az: 'Başa düşmürəm.', from: 'B' }, { en: 'Goodbye!', az: 'Görüşənədək!', from: 'M' }],
        extra: ['Yavaş, zəhmət olmasa.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex('Hello! — Salam!; I don’t understand. — Başa düşmürəm.; Goodbye! — Görüşənədək!', 'Salam, kömək istəmək və sağollaşma fərqli işlərdir.', 'Mənaya görə qoş.', "Hello! … Sorry? I don't understand. … Goodbye!"))],
      },
    },
    {
      type: 'choice', id: 'd8_c06', number: 6, title: 'Səhnədə tap', why: 'Gedən sağollaşır.', hint: 'Kim gedir?',
      prompt: 'Ziyafətdə üç nəfər var.\nKim “Goodbye!” deyir?', scenes: ['d8/party'],
      spots: [{ option: 'Tort kəsən qız', x: 26, y: 44 }, { option: 'Qapıdan çıxan oğlan', x: 80, y: 40 }, { option: 'Musiqiyə qulaq asan adam', x: 50, y: 74 }],
      options: ['Tort kəsən qız', 'Qapıdan çıxan oğlan', 'Musiqiyə qulaq asan adam'], answer: 'Qapıdan çıxan oğlan',
      variants: [other('Gedən adam sağollaşır.', ex('Qapıdan çıxan oğlan', 'O, ziyafətdən gedir — “Goodbye!” deyir.', 'Ayrılarkən: Goodbye! / Bye!', 'Goodbye!'))],
      review: {
        title: 'Səhnədə tap', why: 'Yeni gələn salam verir.', hint: 'Kim indi gəldi?', prompt: 'Ziyafətin girişində üç nəfər var.\nKim “Hello!” deyir?', scenes: ['d8/party-door'],
        spots: [{ option: 'Paltosunu geyinən oğlan', x: 24, y: 40 }, { option: 'Masada oturan adam', x: 76, y: 66 }, { option: 'Yenicə içəri girən qız', x: 54, y: 34 }],
        options: ['Paltosunu geyinən oğlan', 'Masada oturan adam', 'Yenicə içəri girən qız'], answer: 'Yenicə içəri girən qız',
        variants: [other('Yeni gələn salam verir.', ex('Yenicə içəri girən qız', 'O, indi gəldi — görüş başlayır.', 'Gələndə: Hello! / Hi!', 'Hello!'))],
      },
    },
    {
      type: 'two', id: 'd8_c07', number: 7, scenes: ['d8/party-meet'], title: 'İki mesaj yaz', why: 'Özünü təqdim etdin və onun adını soruşdun.', hint: 'Birinci mesajda özünü təqdim et, ikincidə onun adını soruş.',
      prompt: 'Ziyafətdə yeni biri ilə tanış olursan.\nİki mesaj yaz:\n1. Salam ver və adını de.\n2. Onun adını soruş.',
      fields: [
        { id: 'd8_c07a', label: 'Birinci mesaj', placeholder: 'Salam + adın', rule: greetIntro, purpose: 'salam verib adını demək', empty: 'Birinci mesajı da yaz.' },
        { id: 'd8_c07b', label: 'İkinci mesaj', placeholder: 'Onun adını soruş', rule: askName, purpose: 'adını soruşmaq', empty: 'İkinci mesajı da yaz.' },
      ],
      variants: [
        { field: 'd8_c07a', match: { other: true }, explain: ex("Hi! I'm …", 'Bu mesajda salam və adın lazımdır.', 'Salam + I’m / My name is + adın.', 'Hello! My name is …') },
        { field: 'd8_c07b', match: { other: true }, explain: ex("What's your name?", 'Bu mesajda onun adını soruşmalısan.', 'What’s your name?', "Excuse me, what's your name?") },
      ],
      review: {
        scenes: ['d8/online-class'],
        title: 'İki mesaj yaz', why: 'Özünü təqdim etdin və onun adını soruşdun.', hint: 'Birinci mesajda özünü təqdim et, ikincidə onun adını soruş.',
        prompt: 'Onlayn dərsdə yeni yoldaşa yazırsan.\nİki mesaj yaz:\n1. Salam ver və adını de.\n2. Onun adını soruş.',
        fields: [
          { id: 'd8_c07a', label: 'Birinci mesaj', placeholder: 'Salam + adın', rule: greetIntro, purpose: 'salam verib adını demək', empty: 'Birinci mesajı da yaz.' },
          { id: 'd8_c07b', label: 'İkinci mesaj', placeholder: 'Onun adını soruş', rule: askName, purpose: 'adını soruşmaq', empty: 'İkinci mesajı da yaz.' },
        ],
        variants: [
          { field: 'd8_c07a', match: { other: true }, explain: ex("Hello! My name is …", 'Bu mesajda salam və adın lazımdır.', 'Salam + I’m / My name is + adın.', "Hi! I'm …") },
          { field: 'd8_c07b', match: { other: true }, explain: ex("What's your name?", 'Bu mesajda onun adını soruşmalısan.', 'What’s your name?', "What's your name?") },
        ],
      },
    },
    {
      type: 'match', mode: 'order', id: 'd8_c08', number: 8, title: 'Söhbəti sırala', why: 'Salam, hal, ad və xoş söz — bütöv söhbət.', hint: 'Söhbət salamla və ya sualla başlayır, sonra ona cavab gəlir.',
      prompt: 'Ziyafətdə tanışlıq.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [{ en: '1', az: 'Hi! How are you?', from: 'G' }, { en: '2', az: "I'm fine, thanks. And you?", from: 'B' }, { en: '3', az: "I'm OK. What's your name?", from: 'G' }, { en: '4', az: "I'm … Nice to meet you!", from: 'B' }],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Hi! How are you? → I'm fine, thanks. And you? → I'm OK. What's your name? → I'm … Nice to meet you!", 'Əvvəl salam və ya sual gəlir, sonra ona cavab verilir.', 'Sual → cavab.', "Hi! How are you? → I'm fine, thanks. And you? → I'm OK. What's your name? → I'm … Nice to meet you!"))],
      review: {
        title: 'Söhbəti sırala', why: 'Ad sualı, cavab və xoş sözlər düz sıradadır.', hint: 'Söhbət salamla və ya sualla başlayır, sonra ona cavab gəlir.', prompt: 'Başqa tanışlıq.\nBalonlara toxun, söhbəti sıraya düz.',
        rows: [{ en: '1', az: "Hello! What's your name?", from: 'B' }, { en: '2', az: 'My name is …', from: 'G' }, { en: '3', az: 'Nice to meet you.', from: 'B' }, { en: '4', az: 'You too.', from: 'G' }],
        extra: [],
        variants: [other('Söhbətin sırası düz deyil.', ex("Hello! What's your name? → My name is … → Nice to meet you. → You too.", 'Əvvəl salam və ya sual gəlir, sonra ona cavab verilir.', 'Sual → cavab.', "Hello! What's your name? → My name is … → Nice to meet you. → You too."))],
      },
    },
    {
      type: 'write', id: 'd8_c09', number: 9, title: 'Kömək istə', why: 'Başa düşmədiyini deyib təkrar istədin.',
      prompt: 'Qız çox sürətli yazdı, nə yazdığını anlamadın.\nBaşa düşmədiyini de və bir də yazmasını xahiş et.', placeholder: 'Cavabını yaz',
      chat: { partner: 'Ziyafətdə qız', from: 'G', lines: [{ from: 'G', text: "Hiwhat'syourname?" }] }, rule: help,
      hint: 'Əvvəl başa düşmədiyini de, sonra təkrar xahiş et.', hintAssists: false,
      variants: [other('İki hissə lazımdır.', ex("Sorry? I don't understand. Again, please.", 'Başa düşmədiyini de və xahiş et.', 'I don’t understand + Again, please.', "I don't understand. Again, please."))],
      review: {
        title: 'Kömək istə', why: 'Başa düşmədiyini deyib təkrar istədin.', prompt: 'Oğlan çox sürətli yazdı.\nBaşa düşmədiyini de və bir də yazmasını xahiş et.', placeholder: 'Cavabını yaz',
        chat: { partner: 'Ziyafətdə oğlan', from: 'B', lines: [{ from: 'B', text: 'Hellohowareyou?' }] }, rule: help,
        hint: 'Əvvəl başa düşmədiyini de, sonra təkrar xahiş et.', hintAssists: false,
        variants: [other('İki hissə lazımdır.', ex("Sorry? I don't understand. Again, please.", 'Başa düşmədiyini de və xahiş et.', 'I don’t understand + Again, please.', "I don't understand. Again, please."))],
      },
    },
    {
      type: 'voice', id: 'd8_c10', number: 10, speaker: 'mascot', title: 'Söhbət: salam və hal', why: 'Salam verdin, halını dedin və soruşdun.', hint: 'Üç hissə: salam, öz halın, sualı geri qaytar.',
      prompt: '{M} ziyafətdə səni görür.\nSalam ver, halını de və onu da soruş.', audio: 'Hi! How are you?', rule: goal(['greet', 'feeling', 'askFeeling'], ["Hi! I'm fine, thanks. And you?"]),
      variants: [
        insteadOf('farewell', 'Görüş yeni başlayır.', ex("Hi! I'm fine, thanks. And you?", 'Sağollaşma sonda olur.', 'Salam + halın + And you?', "Hello! I'm OK. And you?")),
        other('Üç hissə: salam, halın, sual.', ex("Hi! I'm fine, thanks. And you?", '{M} salam verib halını soruşdu.', 'Salam + halın + And you?', "Hello! I'm OK. And you?")),
      ],
      review: {
        speaker: 'mascot', title: 'Söhbət: salam və hal', why: 'Salam verdin, halını dedin və soruşdun.', hint: 'Üç hissə: salam, öz halın, sualı geri qaytar.', prompt: 'Ertəsi gün {m} yenə soruşur.\nSalam ver, halını de və onu da soruş.', audio: 'Hello! How are you?', rule: goal(['greet', 'feeling', 'askFeeling'], ["Hello! I'm OK. And you?"]),
        variants: [other('Üç hissə: salam, halın, sual.', ex("Hello! I'm OK. And you?", '{M} salam verib halını soruşdu.', 'Salam + halın + And you?', "Hi! I'm fine, thanks. And you?"))],
      },
    },
    {
      type: 'voice', id: 'd8_c11', number: 11, speaker: 'mascot', title: 'Söhbət: tanışlıq', why: 'Tanışlığa cavab verib adını dedin.', hint: 'İki cavab: xoş sözə və ad sualına.',
      prompt: '{M} deyir: “Nice to meet you! What’s your name?”\nİkisinə də cavab ver.', audio: "Nice to meet you! What's your name?", rule: goal(['meet', 'introduce'], ["You too! I'm …"]),
      variants: [other('İki cavab: You too! + adın.', ex("You too! I'm …", 'Xoş sözə və ad sualına cavab verirsən.', 'You too! + I’m …', "Nice to meet you too! My name is …"))],
      review: {
        speaker: 'mascot', title: 'Söhbət: tanışlıq', why: 'Tanışlığa cavab verib adını dedin.', hint: 'İki cavab: xoş sözə və ad sualına.', prompt: 'Yeni qonaq deyir: “Nice to meet you! What’s your name?”\nİkisinə də cavab ver.', audio: "Nice to meet you! What's your name?", rule: goal(['meet', 'introduce'], ["You too! My name is …"]),
        variants: [other('İki cavab: You too! + adın.', ex("You too! My name is …", 'Xoş sözə və ad sualına cavab verirsən.', 'You too! + My name is …', "You too! I'm …"))],
      },
    },
    {
      type: 'match', mode: 'reply', id: 'd8_c13', number: 13, title: 'Cavab cütü', why: 'Hər cümləyə uyğun cavabı tapdın.', hint: 'Hər cümləyə uyğun cavabı tap, bir cavab artıqdır.',
      prompt: 'Hər deyilənə bir cavab var.\nCümləyə toxun, sonra onun cavabını seç.',
      rows: [{ en: 'Sorry!', az: 'No problem.', from: 'B' }, { en: 'Thank you!', az: "You're welcome.", from: 'G' }, { en: 'Nice to meet you!', az: 'You too!', from: 'M' }],
      extra: ['Excuse me.'],
      variants: [other('Bir cümlənin cavabı yerində deyil.', ex("Sorry! — No problem.; Thank you! — You're welcome.; Nice to meet you! — You too!", 'Üzrə, təşəkkürə və xoş sözə fərqli cavab verilir.', 'Deyilənə uyğun cavab.', 'Sorry! — No problem.'))],
      review: {
        title: 'Cavab cütü', why: 'Hər cümləyə uyğun cavabı tapdın.', hint: 'Hər cümləyə uyğun cavabı tap, bir cavab artıqdır.', prompt: 'Başqa söhbətlər.\nCümləyə toxun, sonra onun cavabını seç.',
        rows: [{ en: "I'm sorry!", az: 'No problem.', from: 'G' }, { en: 'How are you?', az: "I'm OK.", from: 'B' }, { en: "What's your name?", az: 'My name is …', from: 'M' }],
        extra: ['Please.'],
        variants: [other('Bir cümlənin cavabı yerində deyil.', ex("I'm sorry! — No problem.; How are you? — I'm OK.; What's your name? — My name is …", 'Üzrə, hal sualına və ad sualına fərqli cavab verilir.', 'Deyilənə uyğun cavab.', "I'm sorry! — No problem."))],
      },
    },
    {
      type: 'voice', id: 'd8_c12', number: 12, speaker: 'mascot', title: 'Söhbət: sağollaşma', why: 'Təşəkkürə cavab verib sağollaşdın.', hint: 'Əvvəl təşəkkürə cavab ver, sonra sağollaş.',
      prompt: 'Ziyafət bitir. {M} deyir: “Thank you! Bye!”\nCavab ver və sağollaş.', audio: 'Thank you! Bye!', rule: goal(['welcome', 'farewell'], ["You're welcome. Bye!"]),
      variants: [
        insteadOf('greet', 'Ziyafət bitir — salam yox, sağollaşma.', ex("You're welcome. Bye!", 'Görüş bitir.', 'You’re welcome + Bye!', "You're welcome. Goodbye!")),
        other('İki hissə: cavab və sağollaşma.', ex("You're welcome. Bye!", '{M} təşəkkür edib sağollaşdı.', 'You’re welcome + Bye!', "You're welcome. Goodbye!")),
      ],
      review: {
        speaker: 'mascot', title: 'Söhbət: sağollaşma', why: 'Təşəkkürə cavab verib sağollaşdın.', hint: 'Əvvəl təşəkkürə cavab ver, sonra sağollaş.', prompt: 'Qonaqlar gedir. {M} deyir: “Thanks! Goodbye!”\nCavab ver və sağollaş.', audio: 'Thanks! Goodbye!', rule: goal(['welcome', 'farewell'], ["You're welcome. Goodbye!"]),
        variants: [other('İki hissə: cavab və sağollaşma.', ex("You're welcome. Goodbye!", 'Təşəkkürə cavab verib sağollaşırsan.', 'You’re welcome + Goodbye!', "You're welcome. Bye!"))],
      },
    },
  ],
  result: {
    done: ['Bölmə 1 tamamlandı', 'Artıq ingiliscə qısa tanışlıq söhbəti apara bilirsən.'],
    incomplete: 'Bölmə söhbəti tam bitmədi. Yoxlanmayan hissələrə sonra qayıda bilərsən.',
    goals: [
      { group: 'Tanıma', text: 'Söhbətdə eşitdiyini anlamaq', tasks: ['d8_c08', 'd8_c03', 'd8_c04', 'd8_c05', 'd8_c06'] },
      { group: 'Yazı', text: 'Tanışlıq mesajları və kömək istəmək', tasks: ['d8_c07a', 'd8_c07b', 'd8_c09'] },
      { group: 'Danışıq', text: 'Qısa söhbəti başdan sona aparmaq', tasks: ['d8_c10', 'd8_c11', 'd8_c12'] },
    ],
    closing: 'Növbəti bölmə: şəxsi məlumat — hərflər, rəqəmlər, yaş.', button: 'Ana səhifəyə qayıt',
    technical: 'Səs problemi oldu. Bu hissə yoxlanmadı.', unverified: 'Yoxlanmadı',
  },
  vocabulary: [],
};
