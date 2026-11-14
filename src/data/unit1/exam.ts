// Bölmə 1 imtahanı on the new screens (exam: true — no Kömək, no hints, no retry round, pass mark 80 %).
// Rules: docs/BOLME_2_XERITESI.md §0. 14 tasks, new adult situations (course, work, café, street), only Bölmə 1 English.
// Every lesson is checked at least once:
//   Dərs 1 salam/sağollaşma — c02, c13b · Dərs 2 adını demək — c03 · Dərs 3 ad sualı, Nice to meet you — c05, c09
//   Dərs 4 hal — c04, c07 · Dərs 5 təşəkkür, please — c08, c13a · Dərs 6 Excuse me, Sorry — c06, c15
//   Dərs 7 başa düşmürəm, təkrar, yavaş — c10, c12 · Dərs 8 bütöv söhbət — c11, c14
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from './build';

const greetIntro = goal(['greet', 'introduce'], ['Hello! My name is …', "Hi! I'm …"]);

export const unit1Exam: DesignLesson[] = [{
  id: 'a1_en_b1_exam', order: 9, unit: 1, exam: true, title: 'Bölmə 1 imtahanı', section: 'İlk tanışlıq',
  notices: {
    soundFailed: 'Səs açılmadı. Yenidən dinlə və ya mətnlə davam et.',
    unknown: 'Cavabı yoxlaya bilmədim. Bir az fərqli yaz və ya yenidən cəhd et.',
    voiceUnknown: 'Səsini aydın eşitmədim. Yenidən de.',
    micFailed: 'Mikrofon açılmadı. Keçə bilərsən.',
    review: 'Səhv etdiyin bacarıqlar təkrara düşür.',
  },
  cards: [
    {
      type: 'intro', id: 'u1x_c01', badge: 'Bölmə 1 imtahanı', subtitle: 'Kömək və ipucu yoxdur. Keçmək üçün cavabların 80 %-i düzgün olmalıdır.', start: 'İmtahana başla',
      goals: [
        { icon: 'wave', text: 'Salam verib sağollaşmaq, adını demək və soruşmaq.' },
        { icon: 'chat', text: 'Halını demək, təşəkkür və xahiş etmək.' },
        { icon: 'chat', text: '“Bağışlayın” demək və başa düşməyəndə kömək istəmək.' },
      ],
    },
    {
      type: 'choice', id: 'u1x_c02', number: 2, title: 'Dinlə və cavab seç', why: 'Gedənə sağollaşma ilə cavab verirsən.',
      prompt: 'Kursda dərs bitdi. Qrup yoldaşın gedir və sənə nəsə deyir.\nNecə cavab verərsən?', audio: 'Bye!',
      options: ['Hello!', 'Goodbye!', 'Thank you!'], answer: 'Goodbye!',
      variants: [
        pick('Hello!', 'Görüş başlamır, bitir.', ex('Goodbye!', '“Hello” görüşün əvvəlində deyilir, yoldaşın isə gedir.', 'Gələndə — Hello!; gedəndə — Goodbye!', 'Goodbye! — Bye!')),
        pick('Thank you!', 'Bu, təşəkkürdür.', ex('Goodbye!', 'Azərbaycanca “sağ ol” həm təşəkkür, həm sağollaşmadır, ingiliscə “Thank you” isə yalnız təşəkkürdür.', 'Kömək edəndə — Thank you!; gedəndə — Bye!', 'Goodbye! — Bye!')),
      ],
    },
    {
      type: 'write', id: 'u1x_c03', number: 3, title: 'Özünü təqdim et', why: 'Salam verdin və adını dedin.',
      prompt: 'Kursun ilk günüdür. Qrupun söhbətinə ilk mesajını yazırsan.\nSalam ver və adını yaz.', placeholder: 'Salam + adın', rule: greetIntro,
      variants: [
        insteadOf('farewell', 'Tanışlıq yeni başlayır.', ex('Hello! My name is …', 'Sağollaşma söhbətin sonunda olur, sən isə qrupla yeni tanış olursan.', 'Salam + I’m … / Salam + My name is …', "Hi! I'm …")),
        other('Salam və adın lazımdır.', ex('Hello! My name is …', 'Azərbaycancada “-am” və “-dır” şəkilçidir, ingiliscə am və is ayrıca sözdür.', 'I + am → I’m …; My name is …', "Hi! I'm …")),
      ],
    },
    {
      type: 'choice', id: 'u1x_c04', number: 4, title: 'Sözü tamamla', why: 'I’m not very well — not am-dan sonra gəlir.',
      prompt: 'İşdə həmkarın yorğun görünür. Halını soruşdun, o cavab verir.\nHansı söz çatmır?', gap: { speaker: 'B', before: "I'm", after: 'very well.' },
      options: ['not', "don't", 'no'], answer: 'not',
      variants: [
        pick("don't", '“I’m” cümləsində don’t işlənmir.', ex('not', 'Burada artıq “I’m” var, ondan sonra don’t yox, not gəlir.', 'I’m not very well. — burada not; I don’t understand. — burada don’t.', "How are you? — I'm not very well.")),
        pick('no', '“No” başqa ifadədədir.', ex('not', '“No” “No problem” ifadəsindədir, halını deyəndə not lazımdır.', 'I’m not very well. — not; No problem. — no.', "I'm not very well.")),
      ],
    },
    {
      type: 'voice', id: 'u1x_c05', number: 5, title: 'Danış: adını soruş', why: 'Yeni tanışın adını soruşdun.',
      prompt: 'Kafedə növbədə yanındakı qadını kursdan tanıyırsan, amma adını bilmirsən.\nOnun adını soruş.', rule: goal(['askName'], ["What's your name?"]),
      variants: [
        insteadOf('introduce', 'Sən öz adını dedin, onunkunu soruşmadın.', ex("What's your name?", '“My name is …” sənin adındır, sual deyil.', 'My name is … — öz adın; What’s your name? — onun adı.', "Hi! What's your name?")),
        other('Ad sualı lazımdır.', ex("What's your name?", 'Onun adını bilmək üçün sual verirsən: your name, “you name” yox.', 'What’s your name? — sual; My name is … — cavab.', "Hello! What's your name?")),
      ],
    },
    {
      type: 'match', id: 'u1x_c06', number: 6, title: 'Kim nə dedi?', why: 'Üç “bağışlayın”ı ayırdın.',
      prompt: 'Küçədə üç nəfər “bağışlayın” deyir, amma hərəsi başqa iş üçün.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'Excuse me.', az: 'Bağışlayın (diqqət).', from: 'G' }, { en: 'Sorry!', az: 'Bağışlayın (səhv).', from: 'B' }, { en: 'Sorry?', az: 'Nə dedin?', from: 'M' }],
      extra: ['Eybi yox.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex('Excuse me. — Bağışlayın (diqqət).; Sorry! — Bağışlayın (səhv).; Sorry? — Nə dedin?', 'Excuse me diqqət çəkir, Sorry! üzrdür, sual kimi deyilən Sorry? isə “nə dedin?”dir.', 'Sorry! — üzr; Sorry? — nə dedin.', 'Sorry! — No problem.'))],
    },
    {
      type: 'write', id: 'u1x_c07', number: 7, title: 'Mesaj yaz', why: 'Halını dedin və sualı geri qaytardın.',
      prompt: 'Kurs yoldaşın sənə mesaj yazır.\nHalını yaz və onu da soruş.', placeholder: 'Cavabını yaz',
      chat: { partner: 'Kursdan qız', from: 'G', lines: [{ from: 'G', text: 'Hi! How are you?' }] },
      rule: goal(['feeling', 'askFeeling'], ["I'm fine, thanks. And you?", "I'm OK. And you?"]),
      variants: [
        { match: { words: ['i fine and you', 'i fine thanks and you', 'i ok and you'] }, short: 'I + am → I’m.', explain: ex("I'm fine, thanks. And you?", 'Azərbaycancada “-am” şəkilçidir, ingiliscə am I-dan sonra ayrıca gəlir.', 'I’m fine. — I + am; I’m OK. — I + am.', "Hi! I'm OK. And you?") },
        other('İki hissə: halın və sual.', ex("I'm fine, thanks. And you?", 'O, halını soruşdu — sən halını deyib onu da soruşursan.', 'I’m fine. — halın; And you? — sual.', "Hi! I'm OK. And you?")),
      ],
    },
    {
      type: 'choice', id: 'u1x_c08', number: 8, title: 'Oxu və seç', why: 'Sənə nəsə gətirəndə təşəkkür edirsən.',
      prompt: 'İşdə həmkarın sənə qəhvə gətirdi.\nOna nə deyərsən?',
      options: ["You're welcome.", 'Thank you!', 'Please.'], answer: 'Thank you!',
      variants: [
        pick("You're welcome.", 'Bu, təşəkkürə cavabdır.', ex('Thank you!', '“You’re welcome” təşəkkür eşidəndə deyilir, burada isə təşəkkürü sən edirsən.', 'Thank you! — təşəkkür; You’re welcome. — ona cavab.', "Thanks! — You're welcome.")),
        pick('Please.', 'Bu, xahişdir.', ex('Thank you!', '“Buyurun” kimi səslənir, amma “Please” bir şey istəyəndə deyilir, qəhvə isə artıq gəlib.', 'Tea, please. — xahiş; Thanks! — təşəkkür.', 'Thanks!')),
      ],
    },
    {
      type: 'write', id: 'u1x_c09', number: 9, title: 'Cümləni qur', why: 'Nice to meet you — “to” da yerindədir.',
      prompt: 'İşdə yeni həmkarla tanış oldun.\nSözlərdən “Tanış olduğuma şadam” cümləsini qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Yeni həmkar', from: 'B', lines: [] },
      tiles: ['meet', 'you', 'Nice', 'your', 'to', 'too', '.'], rule: exact('Nice to meet you.'),
      variants: [other('Söz sırası və ya bir söz düz deyil.', ex('Nice to meet you.', 'Azərbaycanca “tanış olduğuma” bir sözdür, ingiliscə “to meet” iki sözdür və sonda “your” yox, “you” gəlir.', 'Nice to meet you. — xoş söz; You too. — ona cavab.', 'Nice to meet you! — You too!'))],
    },
    {
      type: 'voice', id: 'u1x_c10', number: 10, title: 'Danış: kömək istə', why: 'Başa düşmədiyini dedin və təkrar istədin.',
      prompt: 'Kafedə ofisiant sənə uzun bir şey dedi, heç nə başa düşmədin.\nBaşa düşmədiyini de və bir də deməsini xahiş et.',
      rule: goal(['dontUnderstand', 'repeat'], ["Sorry? I don't understand. Again, please."]),
      variants: [other('İki hissə: başa düşmürəm + bir də.', ex("Sorry? I don't understand. Again, please.", '“I not understand” və “I am understand” demirik.', 'I’m not very well. — burada not; I don’t understand. — burada don’t.', "I don't understand. Again, please."))],
    },
    {
      type: 'match', mode: 'reply', id: 'u1x_c11', number: 11, title: 'Cavab cütü', why: 'Hər cümləyə uyğun cavabı tapdın.',
      prompt: 'Kursda fasilədir. Hər deyilənə bir cavab var.\nCümləyə toxun, sonra onun cavabını seç.',
      rows: [{ en: 'Thanks!', az: "You're welcome.", from: 'G' }, { en: 'How are you?', az: "I'm OK. And you?", from: 'B' }, { en: 'Goodbye!', az: 'Bye!', from: 'M' }],
      extra: ['You too.'],
      variants: [other('Bir cümlənin cavabı yerində deyil.', ex("Thanks! — You're welcome.; How are you? — I'm OK. And you?; Goodbye! — Bye!", 'Təşəkkürə, hal sualına və sağollaşmaya fərqli cavab verilir.', 'Thanks! → You’re welcome; Goodbye! → Bye!', "Thank you! — You're welcome."))],
    },
    {
      type: 'voice', id: 'u1x_c12', number: 12, title: 'Dinlə və təkrarla', why: 'Xahiş aydın səsləndi.',
      prompt: 'Dinlə, sonra eyni cür de.', audio: 'Sorry? Slowly, please.',
      repeat: { stress: 'Slowly', note: 'Vurğu birinci hecadadır: SLOW-ly.', reading: 'sari? slouli, pliz' },
      rule: exact('Sorry? Slowly, please'),
      variants: [other('Bir daha dinlə və eyni cür de.', ex('Sorry? Slowly, please.', 'Səsdəki sözləri eyni sıra ilə de.', 'Sorry? — nə dedin; Slowly, please. — yavaş.', 'Slowly, please.'))],
    },
    {
      type: 'two', id: 'u1x_c13', number: 13, title: 'İki mesaj yaz', why: 'Təşəkkür etdin və sağollaşdın.',
      prompt: 'İşdə həmkarın sənə kömək etdi, indi evə gedir.\nİki mesaj yaz:\n1. Təşəkkür et.\n2. Sağollaş.',
      fields: [
        { id: 'u1x_c13a', label: 'Birinci mesaj', placeholder: 'Təşəkkür et', rule: goal(['thanks'], ['Thank you!', 'Thanks!']), purpose: 'təşəkkür etmək', empty: 'Birinci mesajı da yaz.' },
        { id: 'u1x_c13b', label: 'İkinci mesaj', placeholder: 'Sağollaş', rule: goal(['farewell'], ['Goodbye!', 'Bye!']), purpose: 'sağollaşmaq', empty: 'İkinci mesajı da yaz.' },
      ],
      variants: [
        { field: 'u1x_c13a', match: { other: true }, explain: ex('Thank you!', 'Kömək edənə təşəkkür edirsən; “Please” xahişdir, “You’re welcome” təşəkkürə cavabdır.', 'Thank you! — təşəkkür; You’re welcome. — ona cavab.', "I'm fine, thanks.") },
        { field: 'u1x_c13b', match: { other: true }, explain: ex('Bye!', 'Həmkarın gedir — sağollaşırsan; “Hello” görüşün əvvəlində deyilir.', 'Hello! — gələndə; Goodbye! — gedəndə.', 'Goodbye!') },
      ],
    },
    {
      type: 'match', mode: 'order', id: 'u1x_c14', number: 14, title: 'Söhbəti sırala', why: 'Diqqət, təkrar xahişi, sual və cavab düz sıradadır.',
      prompt: 'Kafedə iki nəfər tanış olur.\nBalonlara toxun, söhbəti sıraya düz.',
      rows: [
        { en: '1', az: "Excuse me, what's your name?", from: 'G' },
        { en: '2', az: 'Sorry? Again, please.', from: 'B' },
        { en: '3', az: "What's your name?", from: 'G' },
        { en: '4', az: 'My name is … Nice to meet you.', from: 'B' },
      ],
      extra: [],
      variants: [other('Söhbətin sırası düz deyil.', ex("Excuse me, what's your name? → Sorry? Again, please. → What's your name? → My name is … Nice to meet you.", 'Əvvəl diqqət çəkib soruşur, eşitməyən bir də xahiş edir, sual təkrarlanır, sonra cavab gəlir.', 'What’s your name? — əvvəl sual; My name is … — sonra cavab.', "Hello! What's your name? — Hi! I'm …"))],
    },
    {
      type: 'voice', id: 'u1x_c15', number: 15, title: 'Danış: üzrə cavab', why: 'Üzrü qəbul etdin.',
      prompt: 'Küçədə bir kişi səhvən sənə toxundu və üzr istəyir.\nOna cavab ver.', audio: 'Sorry!', rule: goal(['noProblem'], ['No problem.']),
      variants: [
        insteadOf('sorry', 'Üzr istəyən o idi, sən yox.', ex('No problem.', '“Sorry” deyən odur, sən isə üzrə cavab verirsən.', 'Sorry! — üzr; No problem. — ona cavab.', "I'm sorry! — No problem.")),
        insteadOf('welcome', 'Bu, təşəkkürə cavabdır.', ex('No problem.', '“You’re welcome” təşəkkür eşidəndə deyilir, burada isə üzr eşitdin.', 'Thank you! → You’re welcome; Sorry! → No problem.', "I'm sorry! — No problem.")),
        other('Üzrə cavab ver.', ex('No problem.', 'Kişi üzr istədi, sən onu qəbul edirsən.', 'Sorry! → No problem.', "I'm sorry! — No problem.")),
      ],
    },
  ],
  result: {
    done: ['Bölmə 1 imtahanı bitdi', 'Aşağıda hər bacarığın nəticəsi ayrıca göstərilir.'],
    incomplete: 'İmtahan tam bitmədi. Yoxlanmayan tapşırıqlar nəticəyə düşmədi.',
    goals: [
      { group: 'Salam və sağollaşma', text: 'Salam verib sağollaşa bilirəm.', tasks: ['u1x_c02', 'u1x_c03', 'u1x_c11', 'u1x_c13b'] },
      { group: 'Adını demək', text: 'Adımı deyə bilirəm.', tasks: ['u1x_c03', 'u1x_c14'] },
      { group: 'Ad soruşmaq', text: 'Yeni tanışın adını soruşub ona xoş söz deyə bilirəm.', tasks: ['u1x_c05', 'u1x_c09', 'u1x_c14'] },
      { group: 'Hal', text: 'Halımı deyib qarşı tərəfi soruşa bilirəm.', tasks: ['u1x_c04', 'u1x_c07', 'u1x_c11'] },
      { group: 'Təşəkkür və xahiş', text: 'Təşəkkür edə, təşəkkürə cavab verə və “please” ilə xahiş edə bilirəm.', tasks: ['u1x_c08', 'u1x_c13a', 'u1x_c11', 'u1x_c10'] },
      { group: 'Excuse me və Sorry', text: 'Diqqət çəkməyi üzrdən ayırıram və üzrə cavab verə bilirəm.', tasks: ['u1x_c06', 'u1x_c15', 'u1x_c14'] },
      { group: 'Kömək istəmək', text: 'Başa düşməyəndə bunu deyib təkrar və yavaş danışmağı istəyə bilirəm.', tasks: ['u1x_c10', 'u1x_c12', 'u1x_c06'] },
    ],
    closing: 'Keçid həddi 80 %-dir. Keçməsən, səhv etdiyin bacarıqlar təkrara düşür və imtahanı yenidən verə bilərsən.', button: 'Ana səhifəyə qayıt',
    technical: 'Səs problemi oldu. Bu hissə yoxlanmadı.', unverified: 'Yoxlanmadı',
  },
  vocabulary: [],
}];
