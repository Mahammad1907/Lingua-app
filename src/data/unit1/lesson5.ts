// Bölmə 1 · Dərs 5 — Təşəkkür və xahiş (Thank you / Thanks, You're welcome, please).
// Spiral: How are you?, What's your name?, I'm fine, thanks. Known trap: “Please.” as a reply to thanks (docs/AZ_OYRENEN_SEHVLERI.md).
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from './build';

const thanks = goal(['thanks'], ['Thank you!', 'Thanks!']);
const welcome = goal(['welcome'], ["You're welcome."]);

export const lesson5: DesignLesson = {
  id: 'a1_en_b1_v2_d5', order: 5, title: 'Təşəkkür və xahiş', section: 'İlk tanışlıq',
  notices: {
    soundFailed: 'Səs açılmadı. Yenidən dinlə və ya mətnlə davam et.',
    unknown: 'Cavabı yoxlaya bilmədim. Bir az fərqli yaz və ya yenidən cəhd et.',
    voiceUnknown: 'Səsini aydın eşitmədim. Yenidən de.',
    micFailed: 'Mikrofon açılmadı. Keçə bilərsən.',
    review: 'Səhv etdiyin tapşırıqlara yeni vəziyyətdə qayıdırıq.',
  },
  cards: [
    {
      type: 'intro', id: 'd5_c01', badge: 'İlk tanışlıq', subtitle: 'Nəzakət sözləri söhbəti yumşaldır.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Təşəkkür edə və təşəkkürə cavab verə bilirəm.' },
        { icon: 'wave', text: 'Xahiş edəndə “please” deyirəm.' },
      ],
    },
    {
      type: 'choice', id: 'd5_c02', number: 2, title: 'Dinlə və anla', why: 'How are you? — Necəsən?', hint: 'Dərs 3 və 4-ün iki sualını xatırla: biri adı, biri halı soruşur. Səsdəki hansıdır?',
      prompt: 'Oğlanın sualını dinlə.\nO nə soruşur?', audio: 'How are you?', options: ['Adını soruşur.', 'Halını soruşur.', 'Sağollaşır.'], answer: 'Halını soruşur.',
      variants: [
        pick('Adını soruşur.', 'Ad sualı “What’s your name?”dir.', ex('Halını soruşur.', 'Səsdə “How are you?” deyilir — “Necəsən?”.', 'How are you? — hal; What’s your name? — ad.', 'How are you? — I’m fine.')),
        pick('Sağollaşır.', 'Bu sualdır, sağollaşma yox.', ex('Halını soruşur.', '“How are you?” sualdır — “Necəsən?”.', 'How are you? = Necəsən?', 'Hi! How are you?')),
      ],
      review: {
        title: 'Dinlə və anla', why: 'What’s your name? — Adın nədir?', hint: 'Dərs 3 və 4-ün iki sualını xatırla: biri adı, biri halı soruşur. Səsdəki hansıdır?', prompt: 'Qızın sualını dinlə.\nO nə soruşur?', audio: "What's your name?",
        options: ['Halını soruşur.', 'Sağollaşır.', 'Adını soruşur.'], answer: 'Adını soruşur.',
        variants: [other('“name” sözünə qulaq as.', ex('Adını soruşur.', 'Səsdə “What’s your name?” deyilir — “Adın nədir?”.', 'name = ad.', "What's your name? — I'm …"))],
      },
    },
    {
      type: 'word', id: 'd5_c03', number: 3,
      word: 'Thank you! · Thanks!', pronunciation: '/θæŋk ju/ · /θæŋks/', reading: '**th**enk yu · **th**enks', az: 'Təşəkkür edirəm! · Sağ ol!',
      notes: ['Thanks daha qısa və qeyri-rəsmidir.', 'th — dilin ucu dişlərin arasında.', 'Hər kəsə demək olar.'],
      example: 'Thanks! Bye!', exampleAz: 'Sağ ol! Hələlik!',
    },
    {
      type: 'voice', id: 'd5_c04', number: 4, title: 'Dinlə və təkrarla', why: '“th” səsi alındı.',
      prompt: 'Dinlə, sonra eyni cür de.', audio: 'Thank you.', repeat: { stress: 'Thank', note: '“tenk yu” yox: dil dişlərin arasında — /θ/.', reading: '**th**enk yu' },
      rule: exact('Thank you'),
      variants: [other('Bir daha dinlə və yavaş de.', ex('Thank you.', '“th” Azərbaycan dilində yoxdur. Dili dişlərin arasına qoyub üfür.', 'th = /θ/.', 'THANK you.'))],
      review: {
        title: 'Dinlə və təkrarla', why: '“th” səsi alındı.', prompt: 'Dinlə, sonra eyni cür de.', audio: 'Thanks!', repeat: { stress: 'Thanks', note: 'Dil dişlərin arasında başlayır: /θ/.', reading: '**th**enks' },
        rule: exact('Thanks'),
        variants: [other('Bir daha dinlə və yavaş de.', ex('Thanks!', '“th” — dil dişlərin arasında.', 'th = /θ/.', 'THANKS!'))],
      },
    },
    {
      type: 'word', id: 'd5_c05', number: 5,
      word: "You're welcome. · please", pronunciation: '/jʊr ˈwelkəm/ · /pliz/', reading: 'yor uelkəm · pliz', az: 'Dəyməz. · zəhmət olmasa',
      notes: ['“You’re welcome” — təşəkkürə cavabdır.', '“please” xahiş edəndə deyilir. Təşəkkürə cavab deyil.'],
      example: "Thank you! — You're welcome.", exampleAz: 'Təşəkkür edirəm! — Dəyməz.',
    },
    {
      type: 'match', id: 'd5_c06', number: 6, title: 'Kim nə dedi?', why: 'Üç nəzakət sözü öz yerində.', hint: 'Hər söz nə vaxt deyilir: kömək alanda, kömək edəndə, yoxsa xahiş edəndə?',
      prompt: 'Hər cümləyə mənasını qoş.',
      rows: [{ en: 'Thank you!', az: 'Təşəkkür edirəm!', from: 'G' }, { en: "You're welcome.", az: 'Dəyməz.', from: 'B' }, { en: 'Please.', az: 'Zəhmət olmasa.', from: 'M' }],
      extra: ['Bağışla.'],
      variants: [
        pick('Please.', '“Please” — zəhmət olmasa.', ex('Please. — Zəhmət olmasa.', '“Please” xahiş edəndə deyilir. Təşəkkürə cavab “You’re welcome”dur.', 'Thank you → You’re welcome. Xahiş → please.', "Thank you! — You're welcome.")),
        other('Bir cümlənin mənası yerində deyil.', ex('Thank you! — Təşəkkür edirəm!; You’re welcome. — Dəyməz.; Please. — Zəhmət olmasa.', 'Hər nəzakət sözünün öz işi var.', 'Təşəkkür, cavab, xahiş.', "Thanks! — You're welcome.")),
      ],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlə öz yerində.', hint: 'Hər söz nə vaxt deyilir: kömək alanda, kömək edəndə, yoxsa xahiş edəndə?', prompt: 'Hər cümləyə mənasını qoş.',
        rows: [{ en: 'Thanks!', az: 'Sağ ol!', from: 'B' }, { en: 'How are you?', az: 'Necəsən?', from: 'G' }, { en: "You're welcome.", az: 'Dəyməz.', from: 'M' }],
        extra: ['Mən də!'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex('Thanks! — Sağ ol!; How are you? — Necəsən?; You’re welcome. — Dəyməz.', 'Təşəkkür, sual və cavab fərqli işlərdir.', 'Mənaya görə qoş.', "Thanks! — You're welcome."))],
      },
    },
    {
      type: 'choice', id: 'd5_c07', number: 7, title: 'Cavabı seç', why: 'Təşəkkürə cavab: You’re welcome.', hint: 'Kömək edən sənsən, o sənə təşəkkür edir. Bu dərsdə “Dəyməz” mənasında söz öyrəndin.',
      prompt: 'Qıza kömək etdin. O deyir: “Thank you!”\nNecə cavab verərsən?', options: ['Please.', "You're welcome.", 'Thank you!'], answer: "You're welcome.",
      variants: [
        pick('Please.', '“Buyurun” kimi düşünmə: təşəkkürə cavab “You’re welcome”dur.', ex("You're welcome.", 'Azərbaycan dilində “buyurun” hər yerdə işlənir. İngiliscə “please” yalnız xahişdir.', 'Thank you → You’re welcome.', "Thanks! — You're welcome.")),
        pick('Thank you!', 'Təşəkkürü geri qaytarmırsan — cavab verirsən.', ex("You're welcome.", 'Sən kömək etdin, o təşəkkür etdi. Sən “Dəyməz” deyirsən.', 'Thank you → You’re welcome.', "Thank you! — You're welcome.")),
      ],
      review: {
        title: 'Cavabı seç', why: 'Təşəkkürə cavab: You’re welcome.', hint: 'Kömək edən sənsən, o sənə təşəkkür edir. Bu dərsdə “Dəyməz” mənasında söz öyrəndin.', prompt: 'Oğlana yol göstərdin. O deyir: “Thanks!”\nNecə cavab verərsən?', options: ["You're welcome.", 'Please.', 'Bye!'], answer: "You're welcome.",
        variants: [other('Təşəkkürə cavab “You’re welcome”dur.', ex("You're welcome.", '“Please” xahişdir, “Bye” sağollaşmadır.', 'Thanks → You’re welcome.', "Thanks! — You're welcome."))],
      },
    },
    {
      type: 'choice', id: 'd5_c08', number: 8, title: 'Sözü tamamla', why: 'Xahiş edəndə “please”.', hint: 'Hələ çayı almamısan, xahiş edirsən. Bu dərsdəki xahiş sözünü xatırla.',
      prompt: 'Kafedə çay istəyirsən.\nHansı söz nəzakətlidir?', gap: { before: 'Tea,', after: '.' }, options: ['please', 'thanks', 'welcome'], answer: 'please',
      variants: [
        pick('thanks', 'Hələ heç nə almamısan — əvvəl xahiş edirsən.', ex('please', '“thanks” sonra, aldıqdan sonra deyilir.', 'Xahiş → please; aldıqdan sonra → thanks.', 'Tea, please. … Thanks!')),
        pick('welcome', '“welcome” təşəkkürə cavabdır.', ex('please', 'Xahiş edəndə “please” deyilir.', 'Xahiş → please.', 'Tea, please.')),
      ],
      review: {
        title: 'Sözü tamamla', why: '“You’re welcome” — Dəyməz.', hint: 'O sənə təşəkkür etdi. Bu dərsdə “Dəyməz” mənasında söz öyrəndin.', prompt: 'Qonşun təşəkkür etdi.\nCavabında hansı söz çatmır?', gap: { speaker: 'G', before: "You're", after: '.' }, options: ['please', 'welcome', 'thanks'], answer: 'welcome',
        variants: [other('Təşəkkürə cavab: You’re welcome.', ex('welcome', '“You’re welcome” birlikdə “Dəyməz” deməkdir.', 'Thank you → You’re welcome.', "You're welcome."))],
      },
    },
    {
      type: 'write', id: 'd5_c09', number: 9, title: 'Mesajı qur', why: 'Halını dedin, təşəkkür etdin və sualı qaytardın.', hint: 'Dərs 4-dəki cavabı xatırla: əvvəl halın, sonra təşəkkür, sonda sualı qaytar.',
      prompt: 'Qonşun halını soruşur.\nSözlərdən cavab qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Qonşu qız', from: 'G', lines: [{ from: 'G', text: 'Hi! How are you?' }] },
      tiles: ['And', "I'm", 'please', 'thanks.', 'fine,', 'you', '?'], rule: exact("I'm fine, thanks. And you?"),
      variants: [other('Sıra: I’m fine, thanks. And you?', ex("I'm fine, thanks. And you?", 'Əvvəl halın və təşəkkür, sonra sual. “please” burada lazım deyil.', 'Halın + thanks + And you?', "I'm fine, thanks. And you?"))],
      review: {
        title: 'Mesajı qur', why: 'Halını dedin, təşəkkür etdin və sualı qaytardın.', hint: 'Dərs 4-dəki cavabı xatırla: əvvəl halın, sonra təşəkkür, sonda sualı qaytar.', prompt: 'Yoldaşın halını soruşur.\nSözlərdən cavab qur.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'Yoldaş', from: 'B', lines: [{ from: 'B', text: 'Hello! How are you?' }] },
        tiles: ["I'm", 'welcome', 'fine,', 'And', 'thanks.', 'you', '?'], rule: exact("I'm fine, thanks. And you?"),
        variants: [other('Sıra: I’m fine, thanks. And you?', ex("I'm fine, thanks. And you?", '“welcome” təşəkkürə cavabdır, burada lazım deyil.', 'Halın + thanks + And you?', "I'm fine, thanks. And you?"))],
      },
    },
    {
      type: 'write', id: 'd5_c10', number: 10, title: 'Təşəkkür et', why: 'Kömək üçün təşəkkür etdin.', hint: 'Kömək sənə edildi. Sən nə deyirsən?',
      prompt: 'Qonşun düşən açarını sənə qaytardı.\nOna təşəkkür et.', placeholder: 'Cavabını yaz',
      chat: { partner: 'Qonşu oğlan', from: 'B', lines: [] }, rule: thanks,
      variants: [
        insteadOf('welcome', 'Kömək sənə edildi — sən təşəkkür edirsən.', ex('Thank you! / Thanks!', '“You’re welcome” təşəkkürə cavabdır.', 'Kömək alanda: Thank you!', 'Thanks!')),
        other('Təşəkkür ifadəsi yaz.', ex('Thank you! / Thanks!', 'Kimsə sənə kömək edəndə təşəkkür edirsən.', 'Kimsə sənə kömək edəndə və ya nəsə verəndə təşəkkür edirsən.', 'Thank you!')),
      ],
      review: {
        title: 'Təşəkkür et', why: 'Kömək üçün təşəkkür etdin.', hint: 'Kömək sənə edildi. Sən nə deyirsən?', prompt: 'Yoldaşın sənə qələm verdi.\nOna təşəkkür et.', placeholder: 'Cavabını yaz',
        chat: { partner: 'Yoldaş', from: 'G', lines: [] }, rule: thanks,
        variants: [other('Təşəkkür ifadəsi yaz.', ex('Thank you! / Thanks!', 'Kimsə sənə nəsə verəndə təşəkkür edirsən.', 'Kimsə sənə kömək edəndə və ya nəsə verəndə təşəkkür edirsən.', 'Thanks!'))],
      },
    },
    {
      type: 'voice', id: 'd5_c11', number: 11, speaker: 'mascot', title: 'Təşəkkürə cavab ver', why: 'Təşəkkürə düzgün cavab verdin.', hint: 'Sən kömək etdin, o təşəkkür etdi. “Dəyməz” de.',
      prompt: '{M:dat} kömək etdin. O deyir: “Thank you!”\nCavab ver.', audio: 'Thank you!', sample: "You're welcome.", rule: welcome,
      variants: [
        insteadOf('thanks', 'Təşəkkürü qaytarmırsan — cavab verirsən.', ex("You're welcome.", 'Sən kömək etdin. “Dəyməz” deyirsən.', 'Thank you → You’re welcome.', "You're welcome.")),
        other('Təşəkkürə cavab: You’re welcome.', ex("You're welcome.", '“Please” xahişdir, cavab deyil.', 'Thank you → You’re welcome.', "You're welcome.")),
      ],
      review: {
        speaker: 'mascot', title: 'Təşəkkürə cavab ver', why: 'Təşəkkürə düzgün cavab verdin.', hint: 'Sən kömək etdin, o təşəkkür etdi. “Dəyməz” de.', prompt: '{M:dat} su verdin. O deyir: “Thanks!”\nCavab ver.', audio: 'Thanks!', rule: welcome,
        variants: [other('Təşəkkürə cavab: You’re welcome.', ex("You're welcome.", 'Sən kömək etdin. “Dəyməz” deyirsən.', 'Thanks → You’re welcome.', "You're welcome."))],
      },
    },
    {
      type: 'voice', id: 'd5_c12', number: 12, speaker: 'mascot', title: 'Nümunəsiz təşəkkür et', why: 'Təşəkkürü özün dedin.', hint: 'Sənə nəsə verəndə nə deyirsən?',
      prompt: '{M} sənə çətir verir.\nTəşəkkür et.', rule: thanks, reply: "You're welcome!",
      variants: [other('Təşəkkür ifadəsi de.', ex('Thank you! / Thanks!', 'Sənə nəsə verəndə təşəkkür edirsən.', 'Kimsə sənə kömək edəndə və ya nəsə verəndə təşəkkür edirsən.', 'Thank you!'))],
      review: {
        speaker: 'mascot', title: 'Nümunəsiz təşəkkür et', why: 'Təşəkkürü özün dedin.', hint: 'Sənə nəsə verəndə nə deyirsən?', prompt: '{M} sənə qapını açır.\nTəşəkkür et.', rule: thanks, reply: "You're welcome!",
        variants: [other('Təşəkkür ifadəsi de.', ex('Thank you! / Thanks!', 'Sənə kömək edəndə təşəkkür edirsən.', 'Kimsə sənə kömək edəndə və ya nəsə verəndə təşəkkür edirsən.', 'Thanks!'))],
      },
    },
  ],
  result: {
    done: ['Dərs 5 tamamlandı', 'Artıq təşəkkür edib təşəkkürə cavab verə bilirsən.'],
    incomplete: 'Dərs tam bitmədi. Yoxlanmayan tapşırıqlara sonra qayıda bilərsən.',
    goals: [
      { group: 'Tanıma', text: 'Nəzakət sözlərini ayırmaq', tasks: ['d5_c02', 'd5_c06', 'd5_c07', 'd5_c08'] },
      { group: 'Yazı', text: 'Təşəkkür etmək və cavab qurmaq', tasks: ['d5_c09', 'd5_c10'] },
      { group: 'Danışıq', text: 'Təşəkkür etmək və cavab vermək', tasks: ['d5_c11', 'd5_c12'] },
    ],
    closing: 'Növbəti dərsdə üzr istəməyi öyrənəcəksən.', button: 'Ana səhifəyə qayıt',
    technical: 'Səs problemi oldu. Bu hissə yoxlanmadı.', unverified: 'Yoxlanmadı',
  },
  vocabulary: [
    { word: 'Thank you', translation: 'Təşəkkür edirəm', example: 'Thank you!', exampleAz: 'Təşəkkür edirəm!', usageNote: 'Thanks daha qısadır.', pronunciation: '/θæŋk ju/', teachCard: 'd5_c03' },
    { word: 'Thanks', translation: 'Sağ ol', example: 'Thanks! Bye!', exampleAz: 'Sağ ol! Hələlik!', usageNote: 'Qeyri-rəsmi.', pronunciation: '/θæŋks/', teachCard: 'd5_c03' },
    { word: "You're welcome", translation: 'Dəyməz', example: "Thank you! — You're welcome.", exampleAz: 'Təşəkkür edirəm! — Dəyməz.', usageNote: 'Təşəkkürə cavab.', pronunciation: '/jʊr ˈwelkəm/', teachCard: 'd5_c05' },
    { word: 'please', translation: 'zəhmət olmasa', example: 'Tea, please.', exampleAz: 'Çay, zəhmət olmasa.', usageNote: 'Xahiş edəndə deyilir.', pronunciation: '/pliz/', teachCard: 'd5_c05' },
  ],
};
