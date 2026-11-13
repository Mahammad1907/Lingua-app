// Bölmə 1 · Dərs 6 — Bağışlayın, üzr (Excuse me, Sorry, No problem).
// Spiral: please, thank you, What's your name? (“Excuse me, what's your name?”). Trap: Excuse me ↔ Sorry (both “Bağışlayın”).
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from './build';

const noProblem = goal(['noProblem'], ['No problem.', "That's OK."]);
const sorry = goal(['sorry'], ['Sorry!', "I'm sorry."]);
const politeAsk = goal(['attention', 'askName'], ["Excuse me, what's your name?"]);

export const lesson6: DesignLesson = {
  id: 'a1_en_b1_v2_d6', order: 6, title: 'Bağışlayın, üzr', section: 'İlk tanışlıq',
  notices: {
    soundFailed: 'Səs açılmadı. Yenidən dinlə və ya mətnlə davam et.',
    unknown: 'Cavabı yoxlaya bilmədim. Bir az fərqli yaz və ya yenidən cəhd et.',
    voiceUnknown: 'Səsini aydın eşitmədim. Yenidən de.',
    micFailed: 'Mikrofon açılmadı. Keçə bilərsən.',
    review: 'Səhv etdiyin tapşırıqlara yeni vəziyyətdə qayıdırıq.',
  },
  cards: [
    {
      type: 'intro', id: 'd6_c01', badge: 'İlk tanışlıq', subtitle: 'İki “bağışlayın” var — işləri fərqlidir.', start: 'Dərsə başla',
      goals: [
        { icon: 'wave', text: 'Diqqəti nəzakətlə çəkə bilirəm.' },
        { icon: 'chat', text: 'Üzr istəyə və üzrü qəbul edə bilirəm.' },
      ],
    },
    {
      type: 'choice', id: 'd6_c02', number: 2, title: 'Xatırla', why: 'Təşəkkürə cavab: You’re welcome.',
      prompt: 'Sən qıza “Thank you!” dedin.\nO nə cavab verər?', options: ['Please.', "You're welcome.", 'How are you?'], answer: "You're welcome.",
      variants: [
        pick('Please.', '“Please” xahişdir.', ex("You're welcome.", 'Təşəkkürə cavab “Dəyməz” — “You’re welcome”dur.', 'Thank you → You’re welcome.', "Thanks! — You're welcome.")),
        pick('How are you?', 'Bu, hal sualıdır.', ex("You're welcome.", 'Təşəkkürə cavab verilir, yeni sual yox.', 'Thank you → You’re welcome.', "Thank you! — You're welcome.")),
      ],
      review: {
        title: 'Xatırla', why: 'Kömək alanda təşəkkür edirsən.', prompt: 'Oğlan sənə yol göstərdi.\nNə deyərsən?', options: ["You're welcome.", 'Thank you!', 'Please.'], answer: 'Thank you!',
        variants: [other('Kömək alan təşəkkür edir.', ex('Thank you!', '“You’re welcome” cavabdır, “please” xahişdir.', 'Kömək alanda: Thank you!', 'Thanks!'))],
      },
    },
    {
      type: 'word', id: 'd6_c03', number: 3,
      word: 'Excuse me', pronunciation: '/ɪkˈskjuːz miː/', az: 'Bağışlayın',
      notes: ['Kiminsə diqqətini çəkəndə deyilir — sual verməzdən əvvəl.', 'Səhvə görə üzr istəmək üçün deyil.'],
      example: "Excuse me, what's your name?", exampleAz: 'Bağışlayın, adınız nədir?',
    },
    {
      type: 'word', id: 'd6_c04', number: 4,
      word: 'Sorry! · No problem.', pronunciation: '/ˈsɒri/ · /nəʊ ˈprɒbləm/', az: 'Bağışla! · Eybi yox.',
      notes: ['Sorry — səhv edəndə, kiminsə yolunu kəsəndə.', 'No problem — üzrü qəbul edəndə.'],
      example: 'Sorry! — No problem.', exampleAz: 'Bağışla! — Eybi yox.',
    },
    {
      type: 'choice', id: 'd6_c05', number: 5, title: 'Hansı “bağışlayın”?', why: 'Diqqət çəkəndə: Excuse me.',
      prompt: 'Küçədə birindən sual soruşmaq istəyirsən.\nNə ilə başlayarsan?', options: ['Sorry!', 'Excuse me.', 'No problem.'], answer: 'Excuse me.',
      hint: 'Səhv etmisən, yoxsa sadəcə danışmaq istəyirsən?', hintAssists: true,
      variants: [
        pick('Sorry!', 'Səhv etməmisən — sadəcə diqqət çəkirsən.', ex('Excuse me.', 'İkisi də “bağışlayın”dır, amma “Sorry” səhvə görə üzrdür.', 'Diqqət → Excuse me; səhv → Sorry.', "Excuse me, what's your name?")),
        pick('No problem.', '“No problem” üzrə cavabdır.', ex('Excuse me.', 'Söhbətə başlayırsan, diqqəti çəkirsən.', 'Diqqət → Excuse me.', 'Excuse me!')),
      ],
      review: {
        title: 'Hansı “bağışlayın”?', why: 'Səhv edəndə: Sorry.', prompt: 'Təsadüfən birinin ayağına basdın.\nNə deyərsən?', options: ['Excuse me.', 'Sorry!', 'Thank you!'], answer: 'Sorry!',
        hint: 'Səhv etmisən, yoxsa sadəcə danışmaq istəyirsən?', hintAssists: true,
        variants: [
          pick('Excuse me.', 'Burada səhv etmisən — üzr istəyirsən.', ex('Sorry!', '“Excuse me” diqqət çəkmək üçündür. Səhvə görə “Sorry” deyilir.', 'Səhv → Sorry; diqqət → Excuse me.', 'Sorry! — No problem.')),
          other('Səhvə görə üzr: Sorry!', ex('Sorry!', 'Səhv sənindir, üzr istəyirsən.', 'Səhv → Sorry.', "I'm sorry!")),
        ],
      },
    },
    {
      type: 'choice', id: 'd6_c06', number: 6, title: 'Səhnədə tap', why: 'Səhv edən üzr istəyir.',
      prompt: 'Kafedə üç nəfər var.\nKim “Sorry!” deməlidir?', scenes: ['d6/cafe-spill'],
      spots: [{ option: 'Kitab oxuyan qız', x: 22, y: 30 }, { option: 'Qəhvəni yerə tökən oğlan', x: 52, y: 66 }, { option: 'Pəncərədən baxan adam', x: 82, y: 28 }],
      options: ['Kitab oxuyan qız', 'Qəhvəni yerə tökən oğlan', 'Pəncərədən baxan adam'], answer: 'Qəhvəni yerə tökən oğlan',
      variants: [other('Üzrü səhv edən istəyir.', ex('Qəhvəni yerə tökən oğlan', 'O, səhv etdi — qəhvəni tökdü. “Sorry!” onun sözüdür.', 'Səhv → Sorry.', 'Sorry! — No problem.'))],
      review: {
        title: 'Səhnədə tap', why: 'Sual verməzdən əvvəl: Excuse me.', prompt: 'Dayanacaqda üç nəfər var.\nKim “Excuse me” deməlidir?', scenes: ['d6/bus-stop'],
        spots: [{ option: 'Avtobus gözləyən oğlan', x: 24, y: 40 }, { option: 'Telefonla danışan adam', x: 78, y: 34 }, { option: 'Yol soruşmaq istəyən qız', x: 52, y: 70 }],
        options: ['Avtobus gözləyən oğlan', 'Telefonla danışan adam', 'Yol soruşmaq istəyən qız'], answer: 'Yol soruşmaq istəyən qız',
        variants: [other('Diqqəti sual verən çəkir.', ex('Yol soruşmaq istəyən qız', 'O, birindən soruşmaq istəyir — əvvəl “Excuse me” deyir.', 'Diqqət → Excuse me.', 'Excuse me!'))],
      },
    },
    {
      type: 'voice', id: 'd6_c07', number: 7, title: 'Dinlə və təkrarla', why: 'Vurğu düzgün yerdə idi.',
      prompt: 'Dinlə, sonra eyni cür de.', audio: 'Excuse me.', repeat: { stress: 'Excuse', note: 'Vurğu ikinci hecadadır: ex-CUSE me. Sonda deyil.' },
      rule: exact('Excuse me'),
      variants: [other('Bir daha dinlə və yavaş de.', ex('Excuse me.', 'Azərbaycan dilində vurğu çox vaxt sondadır, burada isə ortada.', 'ex-CUSE me.', 'Excuse me.'))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Vurğu düzgün yerdə idi.', prompt: 'Dinlə, sonra eyni cür de.', audio: 'Sorry!', repeat: { stress: 'Sorry', note: 'Vurğu əvvəldədir: SO-rry.' },
        rule: exact('Sorry'),
        variants: [other('Bir daha dinlə və yavaş de.', ex('Sorry!', 'Birinci heca güclü deyilir.', 'SO-rry.', 'Sorry!'))],
      },
    },
    {
      type: 'choice', id: 'd6_c08', number: 8, title: 'Sözü tamamla', why: 'Excuse me + sual.',
      prompt: 'Qız tanımadığı oğlanın adını soruşur.\nHansı söz çatmır?', gap: { speaker: 'G', before: 'Excuse me,', after: 'your name?' }, options: ['how', "what's", 'sorry'], answer: "what's",
      variants: [other('Ad sualı “What’s” ilə başlayır.', ex("what's", 'Ad sualı: What’s your name? Əvvəlinə nəzakət üçün “Excuse me” gəlir.', 'Excuse me, what’s your name?', "Excuse me, what's your name?"))],
      review: {
        title: 'Sözü tamamla', why: 'No problem — Eybi yox.', prompt: 'Oğlan üzr istədi. Qız cavab verir.\nHansı söz çatmır?', gap: { speaker: 'G', before: 'No', after: '.' }, options: ['sorry', 'problem', 'please'], answer: 'problem',
        variants: [other('Üzrə cavab: No problem.', ex('problem', '“No problem” — “Eybi yox”.', 'Sorry → No problem.', 'Sorry! — No problem.'))],
      },
    },
    {
      type: 'write', id: 'd6_c09', number: 9, title: 'Mesajı qur', why: 'Nəzakətlə diqqət çəkib adı soruşdun.',
      prompt: 'Tədbirdə yanındakı qızın adını bilmirsən.\nSözlərdən nəzakətli sual qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Tədbirdə qız', from: 'G', lines: [] }, tiles: ['your', 'Excuse', 'sorry', "what's", 'me,', 'name', '?'], rule: exact("Excuse me, what's your name?"),
      variants: [other('Excuse me, what’s your name?', ex("Excuse me, what's your name?", 'Əvvəl diqqət (Excuse me), sonra sual. “sorry” burada lazım deyil.', 'Excuse me + sual.', "Excuse me, what's your name?"))],
      review: {
        title: 'Mesajı qur', why: 'Nəzakətlə diqqət çəkib adı soruşdun.', prompt: 'Yeni işdə bir oğlanla tanış olmaq istəyirsən.\nSözlərdən nəzakətli sual qur.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'Yeni iş yoldaşı', from: 'B', lines: [] }, tiles: ['me,', 'name', 'Excuse', 'you', "what's", 'your', '?'], rule: exact("Excuse me, what's your name?"),
        variants: [other('Excuse me, what’s your name?', ex("Excuse me, what's your name?", '“your” — sənin; “you” burada uyğun deyil.', 'Excuse me + sual.', "Excuse me, what's your name?"))],
      },
    },
    {
      type: 'write', id: 'd6_c10', number: 10, title: 'Dialoqu tamamla', why: 'Üzrü qəbul etdin.',
      prompt: 'Oğlan səhvən çantanı yerə saldı və üzr istədi.\nÜzrünü qəbul et.', placeholder: 'Cavabını yaz',
      chat: { partner: 'Oğlan', from: 'B', lines: [{ from: 'B', text: 'Oh! Sorry!' }] }, rule: noProblem,
      variants: [
        insteadOf('sorry', 'Səhv onundur — sən üzrü qəbul edirsən.', ex('No problem.', 'Üzrə “Sorry” ilə yox, “No problem” ilə cavab verilir.', 'Sorry → No problem.', 'Sorry! — No problem.')),
        other('Üzrə cavab: No problem.', ex('No problem.', 'O, üzr istədi. Sən “Eybi yox” deyirsən.', 'Sorry → No problem.', 'No problem.')),
      ],
      review: {
        title: 'Dialoqu tamamla', why: 'Üzrü qəbul etdin.', prompt: 'Qız sənin növbənə keçdi və üzr istədi.\nÜzrünü qəbul et.', placeholder: 'Cavabını yaz',
        chat: { partner: 'Qız', from: 'G', lines: [{ from: 'G', text: "I'm sorry!" }] }, rule: noProblem,
        variants: [other('Üzrə cavab: No problem.', ex('No problem.', 'O, üzr istədi. Sən “Eybi yox” deyirsən.', 'Sorry → No problem.', 'No problem.'))],
      },
    },
    {
      type: 'voice', id: 'd6_c11', number: 11, speaker: 'mascot', title: 'Üzrü qəbul et', why: 'Üzrü qəbul etdin.',
      prompt: '{M} deyir: “Sorry!”\nÜzrünü qəbul et.', audio: 'Sorry!', sample: 'No problem.', rule: noProblem,
      variants: [other('Üzrə cavab: No problem.', ex('No problem.', '{M} üzr istədi. Sən “Eybi yox” deyirsən.', 'Sorry → No problem.', 'No problem.'))],
      review: {
        speaker: 'mascot', title: 'Üzrü qəbul et', why: 'Üzrü qəbul etdin.', prompt: '{M} gecikdi və deyir: “I’m sorry!”\nÜzrünü qəbul et.', audio: "I'm sorry!", rule: noProblem,
        variants: [other('Üzrə cavab: No problem.', ex('No problem.', 'Üzrə “Eybi yox” deyirsən.', 'Sorry → No problem.', "That's OK."))],
      },
    },
    {
      type: 'voice', id: 'd6_c12', number: 12, speaker: 'mascot', title: 'Üzr istə', why: 'Səhvə görə üzr istədin.',
      prompt: '{M:gen} ayağına təsadüfən basdın.\nÜzr istə.', rule: sorry, reply: 'No problem!',
      variants: [
        insteadOf('attention', '“Excuse me” diqqət üçündür — burada səhv etmisən.', ex('Sorry!', 'Səhvə görə “Sorry” deyilir.', 'Səhv → Sorry.', "I'm sorry!")),
        other('Üzr ifadəsi de.', ex('Sorry!', 'Səhv sənindir, üzr istəyirsən.', 'Səhv → Sorry.', "I'm sorry!")),
      ],
      review: {
        speaker: 'mascot', title: 'Üzr istə', why: 'Səhvə görə üzr istədin.', prompt: '{M:gen} kitabını səhvən yerə saldın.\nÜzr istə.', rule: sorry, reply: 'No problem!',
        variants: [other('Üzr ifadəsi de.', ex('Sorry!', 'Səhv sənindir, üzr istəyirsən.', 'Səhv → Sorry.', 'Sorry!'))],
      },
    },
    {
      type: 'voice', id: 'd6_c13', number: 13, title: 'Nəzakətlə soruş', why: 'Diqqət çəkib adı soruşdun.',
      prompt: 'Sinifdə yeni uşağın adını bilmirsən.\nDiqqətini çək və adını soruş.', rule: politeAsk, reply: 'Nice to meet you!',
      variants: [other('Excuse me + ad sualı.', ex("Excuse me, what's your name?", 'Tanımadığın adama əvvəl “Excuse me” deyirsən.', 'Excuse me + What’s your name?', "Excuse me, what's your name?"))],
      review: {
        title: 'Nəzakətlə soruş', why: 'Diqqət çəkib adı soruşdun.', prompt: 'Kitabxanada yanındakı qızın adını bilmirsən.\nDiqqətini çək və adını soruş.', rule: politeAsk, reply: 'Nice to meet you!',
        variants: [other('Excuse me + ad sualı.', ex("Excuse me, what's your name?", 'Tanımadığın adama əvvəl “Excuse me” deyirsən.', 'Excuse me + What’s your name?', "Excuse me, what's your name?"))],
      },
    },
  ],
  result: {
    done: ['Dərs 6 tamamlandı', 'Artıq “Excuse me” və “Sorry”ni ayırırsan.'],
    incomplete: 'Dərs tam bitmədi. Yoxlanmayan tapşırıqlara sonra qayıda bilərsən.',
    goals: [
      { group: 'Tanıma', text: 'Excuse me və Sorry fərqi', tasks: ['d6_c02', 'd6_c05', 'd6_c06', 'd6_c08'] },
      { group: 'Yazı', text: 'Nəzakətli sual və üzrə cavab', tasks: ['d6_c09', 'd6_c10'] },
      { group: 'Danışıq', text: 'Üzr istəmək, qəbul etmək, diqqət çəkmək', tasks: ['d6_c11', 'd6_c12', 'd6_c13'] },
    ],
    closing: 'Növbəti dərsdə başa düşmədiyini deməyi öyrənəcəksən.', button: 'Ana səhifəyə qayıt',
    technical: 'Səs problemi oldu. Bu hissə yoxlanmadı.', unverified: 'Yoxlanmadı',
  },
  vocabulary: [
    { word: 'Excuse me', translation: 'Bağışlayın', example: "Excuse me, what's your name?", exampleAz: 'Bağışlayın, adınız nədir?', usageNote: 'Diqqəti çəkmək üçün.', pronunciation: '/ɪkˈskjuːz miː/', teachCard: 'd6_c03' },
    { word: 'Sorry', translation: 'Bağışla / Üzr istəyirəm', example: 'Sorry! — No problem.', exampleAz: 'Bağışla! — Eybi yox.', usageNote: 'Səhvə görə üzr.', pronunciation: '/ˈsɒri/', teachCard: 'd6_c04' },
    { word: 'No problem', translation: 'Eybi yox', example: 'Sorry! — No problem.', exampleAz: 'Bağışla! — Eybi yox.', usageNote: 'Üzrə cavab.', pronunciation: '/nəʊ ˈprɒbləm/', teachCard: 'd6_c04' },
  ],
};
