// Bölmə 1 · Dərs 6 — Bağışlayın, üzr (Excuse me, Sorry, No problem).
// Spiral: please, thank you, What's your name? (“Excuse me, what's your name?”). Trap: Excuse me ↔ Sorry (both “Bağışlayın”).
import type { DesignLesson } from '../designLessonTypes';
import { ex, exact, goal, insteadOf, other, pick } from './build';

const noProblem = goal(['noProblem'], ['No problem.']);
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
      type: 'match', id: 'd6_c02', number: 2, title: 'Kim nə dedi?', why: 'Keçən dərslərin ifadələrini xatırladın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy. Qalanların seçimi azalacaq.',
      prompt: 'Keçən dərsləri xatırla.\nHər cümləyə mənasını qoş.',
      rows: [{ en: 'Thank you!', az: 'Təşəkkür edirəm!', from: 'G' }, { en: "You're welcome.", az: 'Dəyməz.', from: 'B' }, { en: 'How are you?', az: 'Necəsən?', from: 'M' }],
      extra: ['Zəhmət olmasa.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex('Thank you! — Təşəkkür edirəm!; You’re welcome. — Dəyməz.; How are you? — Necəsən?', 'Təşəkkür, ona cavab və hal sualı — üç ayrı iş.', 'Mənaya görə qoş.', "Thank you! — You're welcome."))],
      review: {
        title: 'Kim nə dedi?', why: 'Bu dərsin ifadələrini xatırladın.', hint: 'Əvvəl ən əmin olduğun cümləni yerinə qoy. Qalanların seçimi azalacaq.', prompt: 'Bu dərsi xatırla.\nHər cümləyə mənasını qoş.',
        rows: [{ en: 'Excuse me', az: 'Bağışlayın', from: 'G' }, { en: 'Sorry!', az: 'Bağışla!', from: 'B' }, { en: 'No problem.', az: 'Eybi yox.', from: 'G' }],
        extra: ['Dəyməz.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex('Excuse me — Bağışlayın; Sorry! — Bağışla!; No problem. — Eybi yox.', '“Excuse me” diqqəti çəkir, “Sorry” üzrdür, “No problem” üzrə cavabdır.', 'Mənaya görə qoş.', 'Sorry! — No problem.'))],
      },
    },
    {
      type: 'word', id: 'd6_c03', number: 3, scenes: ['d6/word-excuse-me'],
      word: 'Excuse me', pronunciation: '/ɪkˈskjuz mi/', reading: 'ikskyuz mi', az: 'Bağışlayın',
      notes: ['Sual verməzdən əvvəl diqqəti çəkmək üçün.'],
      example: "Excuse me, what's your name?", exampleAz: 'Bağışlayın, adınız nədir?',
    },
    {
      type: 'word', id: 'd6_c04', number: 4, scenes: ['d6/word-sorry'],
      word: 'Sorry!', pronunciation: '/ˈsɑri/', reading: 'sari', az: 'Bağışla!',
      notes: ['Səhv edəndə deyilir.'],
      example: 'Sorry! — No problem.', exampleAz: 'Bağışla! — Eybi yox.',
    },
    {
      type: 'word', id: 'd6_c04b', number: 5, scenes: ['d6/word-no-problem'],
      word: 'No problem.', pronunciation: '/noʊ ˈprɑbləm/', reading: 'nou prabləm', az: 'Eybi yox.',
      notes: ['Üzrü qəbul edəndə deyilir.'],
      example: 'Sorry! — No problem.', exampleAz: 'Bağışla! — Eybi yox.',
    },
    {
      type: 'choice', id: 'd6_c05', number: 5, scenes: ['d6/street-ask'], title: 'Hansı “bağışlayın”?', why: 'Diqqət çəkəndə: Excuse me.',
      prompt: 'Küçədə birindən sual soruşmaq istəyirsən.\nNə ilə başlayarsan?', options: ['Sorry!', 'Excuse me.', 'No problem.'], answer: 'Excuse me.',
      hint: 'Səhv etmisən, yoxsa sadəcə danışmaq istəyirsən?', hintAssists: true,
      variants: [
        pick('Sorry!', 'Səhv etməmisən — sadəcə diqqət çəkirsən.', ex('Excuse me.', 'İkisi də “bağışlayın”dır, amma “Sorry” səhvə görə üzrdür.', 'Diqqət → Excuse me; səhv → Sorry.', "Excuse me, what's your name?")),
        pick('No problem.', '“No problem” üzrə cavabdır.', ex('Excuse me.', 'Söhbətə başlayırsan, diqqəti çəkirsən.', 'Diqqət → Excuse me.', 'Excuse me!')),
      ],
      review: {
        scenes: ['d6/foot-step'],
        title: 'Hansı “bağışlayın”?', why: 'Səhv edəndə: Sorry.', prompt: 'Təsadüfən birinin ayağına basdın.\nNə deyərsən?', options: ['Excuse me.', 'Sorry!', 'Thank you!'], answer: 'Sorry!',
        hint: 'Səhv etmisən, yoxsa sadəcə danışmaq istəyirsən?', hintAssists: true,
        variants: [
          pick('Excuse me.', 'Burada səhv etmisən — üzr istəyirsən.', ex('Sorry!', '“Excuse me” diqqət çəkmək üçündür. Səhvə görə “Sorry” deyilir.', 'Səhv → Sorry; diqqət → Excuse me.', 'Sorry! — No problem.')),
          other('Səhvə görə üzr: Sorry!', ex('Sorry!', 'Səhv sənindir, üzr istəyirsən.', 'Səhv → Sorry.', "I'm sorry!")),
        ],
      },
    },
    {
      type: 'choice', id: 'd6_c06', number: 6, title: 'Səhnədə tap', why: 'Səhv edən üzr istəyir.', hint: 'Kim səhv etdi?',
      prompt: 'Kafedə üç nəfər var.\nKim “Sorry!” deməlidir?', scenes: ['d6/cafe-spill'],
      spots: [{ option: 'Kitab oxuyan qız', x: 22, y: 30 }, { option: 'Qəhvəni yerə tökən oğlan', x: 52, y: 66 }, { option: 'Pəncərədən baxan adam', x: 82, y: 28 }],
      options: ['Kitab oxuyan qız', 'Qəhvəni yerə tökən oğlan', 'Pəncərədən baxan adam'], answer: 'Qəhvəni yerə tökən oğlan',
      variants: [other('Üzrü səhv edən istəyir.', ex('Qəhvəni yerə tökən oğlan', 'O, səhv etdi — qəhvəni tökdü. “Sorry!” onun sözüdür.', 'Səhv → Sorry.', 'Sorry! — No problem.'))],
      review: {
        title: 'Səhnədə tap', why: 'Sual verməzdən əvvəl: Excuse me.', hint: 'Kim birindən nəsə soruşmaq istəyir?', prompt: 'Dayanacaqda üç nəfər var.\nKim “Excuse me” deməlidir?', scenes: ['d6/bus-stop'],
        spots: [{ option: 'Avtobus gözləyən oğlan', x: 24, y: 40 }, { option: 'Telefonla danışan adam', x: 78, y: 34 }, { option: 'Yol soruşmaq istəyən qız', x: 52, y: 70 }],
        options: ['Avtobus gözləyən oğlan', 'Telefonla danışan adam', 'Yol soruşmaq istəyən qız'], answer: 'Yol soruşmaq istəyən qız',
        variants: [other('Diqqəti sual verən çəkir.', ex('Yol soruşmaq istəyən qız', 'O, birindən soruşmaq istəyir — əvvəl “Excuse me” deyir.', 'Diqqət → Excuse me.', 'Excuse me!'))],
      },
    },
    {
      type: 'voice', id: 'd6_c07', number: 7, title: 'Dinlə və təkrarla', why: 'Vurğu düzgün yerdə idi.',
      prompt: 'Dinlə, sonra eyni cür de.', audio: 'Excuse me.', repeat: { stress: 'Excuse', note: 'Vurğu ikinci hecadadır: ex-CUSE me. Sonda deyil.', reading: 'ikskyuz mi' },
      rule: exact('Excuse me'),
      variants: [other('Bir daha dinlə və yavaş de.', ex('Excuse me.', 'Azərbaycan dilində vurğu çox vaxt sondadır, burada isə ortada.', 'ex-CUSE me.', 'Excuse me.'))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Vurğu düzgün yerdə idi.', prompt: 'Dinlə, sonra eyni cür de.', audio: 'Sorry!', repeat: { stress: 'Sorry', note: 'Vurğu əvvəldədir: SO-rry.', reading: 'sari' },
        rule: exact('Sorry'),
        variants: [other('Bir daha dinlə və yavaş de.', ex('Sorry!', 'Birinci heca güclü deyilir.', 'SO-rry.', 'Sorry!'))],
      },
    },
    {
      type: 'choice', id: 'd6_c08', number: 8, title: 'Sözü tamamla', why: 'Excuse me + sual.', hint: 'Dərs 3-ün ad sualını xatırla.',
      prompt: 'Qız tanımadığı oğlanın adını soruşur.\nHansı söz çatmır?', gap: { speaker: 'G', before: 'Excuse me,', after: 'your name?' }, options: ['how', "what's", 'sorry'], answer: "what's",
      variants: [other('Ad sualı “What’s” ilə başlayır.', ex("what's", 'Ad sualı: What’s your name? Əvvəlinə nəzakət üçün “Excuse me” gəlir.', 'Excuse me, what’s your name?', "Excuse me, what's your name?"))],
      review: {
        title: 'Sözü tamamla', why: 'No problem — Eybi yox.', hint: 'O üzr istədi. Bu dərsdə “Eybi yox” mənasında ifadə öyrəndin.', prompt: 'Oğlan üzr istədi. Qız cavab verir.\nHansı söz çatmır?', gap: { speaker: 'G', before: 'No', after: '.' }, options: ['sorry', 'problem', 'please'], answer: 'problem',
        variants: [other('Üzrə cavab: No problem.', ex('problem', '“No problem” — “Eybi yox”.', 'Sorry → No problem.', 'Sorry! — No problem.'))],
      },
    },
    {
      type: 'write', id: 'd6_c09', number: 9, title: 'Mesajı qur', why: 'Nəzakətlə diqqət çəkib adı soruşdun.', hint: 'Əvvəl diqqəti çək, sonra Dərs 3-ün sualını ver.',
      prompt: 'Tədbirdə yanındakı qızın adını bilmirsən.\nSözlərdən nəzakətli sual qur.', placeholder: 'Sözlərə toxun',
      chat: { partner: 'Tədbirdə qız', from: 'G', lines: [] }, tiles: ['your', 'Excuse', 'sorry', "what's", 'me,', 'name', '?'], rule: exact("Excuse me, what's your name?"),
      variants: [other('Excuse me, what’s your name?', ex("Excuse me, what's your name?", 'Əvvəl diqqət (Excuse me), sonra sual. “sorry” burada lazım deyil.', 'Excuse me + sual.', "Excuse me, what's your name?"))],
      review: {
        title: 'Mesajı qur', why: 'Nəzakətlə diqqət çəkib adı soruşdun.', hint: 'Əvvəl diqqəti çək, sonra Dərs 3-ün sualını ver.', prompt: 'Yeni işdə bir oğlanla tanış olmaq istəyirsən.\nSözlərdən nəzakətli sual qur.', placeholder: 'Sözlərə toxun',
        chat: { partner: 'Yeni iş yoldaşı', from: 'B', lines: [] }, tiles: ['me,', 'name', 'Excuse', 'you', "what's", 'your', '?'], rule: exact("Excuse me, what's your name?"),
        variants: [other('Excuse me, what’s your name?', ex("Excuse me, what's your name?", '“your” — sənin; “you” burada uyğun deyil.', 'Excuse me + sual.', "Excuse me, what's your name?"))],
      },
    },
    {
      type: 'write', id: 'd6_c10', number: 10, title: 'Cavabını yaz', why: 'Üzrü qəbul etdin.', hint: 'O üzr istədi. Sən “Eybi yox” deyirsən.',
      prompt: 'Oğlan səhvən çantanı yerə saldı və deyir: “Sorry!”\nÜzrünü qəbul et.', placeholder: 'Cavabını yaz', rule: noProblem,
      variants: [
        insteadOf('sorry', 'Səhv onundur — sən üzrü qəbul edirsən.', ex('No problem.', 'Üzrə “Sorry” ilə yox, “No problem” ilə cavab verilir.', 'Sorry → No problem.', 'Sorry! — No problem.')),
        other('Üzrə cavab: No problem.', ex('No problem.', 'O, üzr istədi. Sən “Eybi yox” deyirsən.', 'Sorry → No problem.', 'No problem.')),
      ],
      review: {
        title: 'Cavabını yaz', why: 'Üzrü qəbul etdin.', hint: 'O üzr istədi. Sən “Eybi yox” deyirsən.', prompt: 'Qız sənin növbənə keçdi və deyir: “I’m sorry!”\nÜzrünü qəbul et.', placeholder: 'Cavabını yaz', rule: noProblem,
        variants: [other('Üzrə cavab: No problem.', ex('No problem.', 'O, üzr istədi. Sən “Eybi yox” deyirsən.', 'Sorry → No problem.', 'No problem.'))],
      },
    },
    {
      type: 'voice', id: 'd6_c11', number: 11, speaker: 'mascot', title: 'Üzrü qəbul et', why: 'Üzrü qəbul etdin.', hint: 'O üzr istədi. Sən “Eybi yox” deyirsən.',
      prompt: '{M} deyir: “Sorry!”\nÜzrünü qəbul et.', audio: 'Sorry!', sample: 'No problem.', rule: noProblem,
      variants: [other('Üzrə cavab: No problem.', ex('No problem.', '{M} üzr istədi. Sən “Eybi yox” deyirsən.', 'Sorry → No problem.', 'No problem.'))],
      review: {
        speaker: 'mascot', title: 'Üzrü qəbul et', why: 'Üzrü qəbul etdin.', hint: 'O üzr istədi. Sən “Eybi yox” deyirsən.', prompt: '{M} gecikdi və deyir: “I’m sorry!”\nÜzrünü qəbul et.', audio: "I'm sorry!", rule: noProblem,
        variants: [other('Üzrə cavab: No problem.', ex('No problem.', 'Üzrə “Eybi yox” deyirsən.', 'Sorry → No problem.', 'Sorry! — No problem.'))],
      },
    },
    {
      type: 'voice', id: 'd6_c12', number: 12, speaker: 'mascot', title: 'Üzr istə', why: 'Səhvə görə üzr istədin.', hint: 'Səhv sənindir. Üzr istə.',
      prompt: '{M:gen} ayağına təsadüfən basdın.\nÜzr istə.', rule: sorry, reply: 'No problem!',
      variants: [
        insteadOf('attention', '“Excuse me” diqqət üçündür — burada səhv etmisən.', ex('Sorry!', 'Səhvə görə “Sorry” deyilir.', 'Səhv → Sorry.', "I'm sorry!")),
        other('Üzr ifadəsi de.', ex('Sorry!', 'Səhv sənindir, üzr istəyirsən.', 'Səhv → Sorry.', "I'm sorry!")),
      ],
      review: {
        speaker: 'mascot', title: 'Üzr istə', why: 'Səhvə görə üzr istədin.', hint: 'Səhv sənindir. Üzr istə.', prompt: '{M:gen} kitabını səhvən yerə saldın.\nÜzr istə.', rule: sorry, reply: 'No problem!',
        variants: [other('Üzr ifadəsi de.', ex('Sorry!', 'Səhv sənindir, üzr istəyirsən.', 'Səhv → Sorry.', 'Sorry!'))],
      },
    },
    {
      type: 'voice', id: 'd6_c13', number: 13, title: 'Nəzakətlə soruş', why: 'Diqqət çəkib adı soruşdun.', hint: 'İki hissə: əvvəl diqqəti çək, sonra adını soruş.',
      prompt: 'Sinifdə yeni uşağın adını bilmirsən.\nDiqqətini çək və adını soruş.', rule: politeAsk, reply: 'Nice to meet you!',
      variants: [other('Excuse me + ad sualı.', ex("Excuse me, what's your name?", 'Tanımadığın adama əvvəl “Excuse me” deyirsən.', 'Excuse me + What’s your name?', "Excuse me, what's your name?"))],
      review: {
        title: 'Nəzakətlə soruş', why: 'Diqqət çəkib adı soruşdun.', hint: 'İki hissə: əvvəl diqqəti çək, sonra adını soruş.', prompt: 'Kitabxanada yanındakı qızın adını bilmirsən.\nDiqqətini çək və adını soruş.', rule: politeAsk, reply: 'Nice to meet you!',
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
    { word: 'Excuse me', translation: 'Bağışlayın', example: "Excuse me, what's your name?", exampleAz: 'Bağışlayın, adınız nədir?', usageNote: 'Diqqəti çəkmək üçün.', pronunciation: '/ɪkˈskjuz mi/', teachCard: 'd6_c03' },
    { word: 'Sorry', translation: 'Bağışla / Üzr istəyirəm', example: 'Sorry! — No problem.', exampleAz: 'Bağışla! — Eybi yox.', usageNote: 'Səhvə görə üzr.', pronunciation: '/ˈsɑri/', teachCard: 'd6_c04' },
    { word: 'No problem', translation: 'Eybi yox', example: 'Sorry! — No problem.', exampleAz: 'Bağışla! — Eybi yox.', usageNote: 'Üzrə cavab.', pronunciation: '/noʊ ˈprɑbləm/', teachCard: 'd6_c04b' },
  ],
};
