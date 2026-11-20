// “Müəllim izahı” for every lesson (user, 21 Nov 2026). Each card comes right after the Yeni söz card it explains.
// A hard topic gets two cards with at least one task between them. Section conversations (Dərs 8) have none.
// English here uses only phrases taught on or before the card it follows (scripts/check-taught.cjs).
import type { DesignLesson, ExplainCard } from './designLessonTypes';

type Explain = Omit<ExplainCard, 'type' | 'id' | 'number'>;
const E = (id: string, after: string, card: Explain) => ({ after, card: { type: 'explain' as const, id, number: 0, ...card } });

const EXPLAINS: Record<string, { after: string; card: ExplainCard }[]> = {
  // ── Bölmə 1 ──
  a1_en_b1_v2_d1: [E('d1_c02t', 'd1_c02', {
    lead: 'Salamın iki forması var: Hello və Hi.', focus: 'Hello və Hi',
    sections: [
      { title: 'Hansını kimə deyirsən?', pairs: [{ en: 'Hello!', az: 'hər kəsə' }, { en: 'Hi!', az: 'dosta, tanışa' }] },
      { title: 'Fərq nədir?', text: 'İkisi də “Salam”dır. Hello mağazada, işdə də olar. Hi daha sadədir, dosta deyilir.' },
    ],
    attention: 'Hello və Hi görüşün əvvəlində deyilir.',
  })],
  a1_en_b1_v2_d2: [
    E('d2_c02t', 'd2_c02s', {
      lead: "Gəl, I'm-ə yaxından baxaq.", focus: "I'm",
      sections: [
        { title: 'Hissə harada gəlir?', text: 'Biz “-am” hissəsini adın sonuna qoşuruq. İngiliscə o, adın əvvəlində ayrıca gəlir.' },
        { title: 'Necə qurulur?', build: { parts: ["I'm", 'ad'], examples: [{ en: "Hello! I'm …", az: 'Salam! Mən …-am.' }] } },
      ],
      attention: "Adın sonuna heç nə artırılmır: I'm və ad kifayətdir.",
    }),
    E('d2_c02bt', 'd2_c02b', {
      lead: 'My name is … da adını deyir.', focus: 'My name is',
      sections: [
        { title: 'Hissələr', pairs: [{ en: 'My name', az: 'mənim adım' }, { en: 'is', az: '-dır' }] },
        { title: 'Necə qurulur?', build: { parts: ['My name is', 'ad'], examples: [{ en: 'Hi! My name is …', az: 'Salam! Mənim adım …-dır.' }] } },
      ],
      attention: 'Biz “-dır” hissəsini sonda deyirik. İngiliscə o, ayrıca sözdür: is. Onu atma.',
    }),
  ],
  a1_en_b1_v2_d3: [E('d3_c03t', 'd3_c03', {
    lead: "What's your name? sualına baxaq.", focus: "What's your name?",
    sections: [
      { title: 'Sözlərin sırası', text: 'Biz “Adın nədir?” deyirik: “nə” sonda gəlir. İngiliscə What sualın əvvəlindədir.' },
      { title: 'Necə qurulur?', build: { parts: ["What's", 'your name?'], examples: [{ en: "Hi! What's your name?", az: 'Salam! Adın nədir?' }] } },
    ],
    attention: 'Sualın sonunda sual işarəsi qoyulur.',
  })],
  a1_en_b1_v2_d4: [E('d4_c04t', 'd4_c04', {
    lead: 'Halını deyəndən sonra And you? ilə sən də soruş.', focus: 'And you?',
    sections: [
      { title: 'Cavab', build: { parts: ["I'm fine, thanks.", 'And you?'], examples: [{ en: "How are you? — I'm fine, thanks. And you?", az: 'Necəsən? — Yaxşıyam, sağ ol. Bəs sən?' }] } },
      { title: 'Niyə And you?', text: 'Cavab verəndən sonra eyni sualı qarşı tərəfə qaytarırsan. Bu, nəzakətdir.' },
    ],
    attention: 'And you? deyəndə How are you? sualını təkrar demək lazım deyil.',
  })],
  a1_en_b1_v2_d5: [E('d5_c05bt', 'd5_c05b', {
    lead: 'please xahişi nəzakətli edir.', focus: 'please',
    sections: [
      { title: 'Harada gəlir?', text: 'please çox vaxt sonda, vergüldən sonra gəlir.', build: { parts: ['Tea,', 'please.'], examples: [{ en: 'Tea, please.', az: 'Çay, zəhmət olmasa.' }] } },
      { title: 'Təşəkkürə cavab', pairs: [{ en: 'Thank you!', az: 'təşəkkür' }, { en: "You're welcome.", az: 'cavab' }] },
    ],
    attention: "please təşəkkürə cavab deyil. Təşəkkürə You're welcome. deyilir.",
  })],
  a1_en_b1_v2_d6: [E('d6_c04t', 'd6_c04', {
    lead: 'İkisi də “Bağışlayın”dır, amma işi fərqlidir.', focus: '“Bağışlayın”',
    sections: [
      { title: 'Hansı nə üçündür?', pairs: [{ en: 'Excuse me', az: 'diqqət çəkmək' }, { en: 'Sorry!', az: 'üzr istəmək' }] },
      { title: 'Nə vaxt deyirsən?', text: 'Kimdənsə nəsə soruşmaq istəyəndə Excuse me deyirsən. Səhv edəndə, kiminsə ayağını basanda Sorry! deyirsən.' },
    ],
    attention: 'Excuse me sözə başlamazdan əvvəl, Sorry! isə səhvdən sonra deyilir.',
  })],
  a1_en_b1_v2_d7: [E('d7_c03t', 'd7_c03', {
    lead: 'Sorry sözü iki cür deyilir.', focus: 'Sorry',
    sections: [
      { title: 'Səs nə deyir?', pairs: [{ en: 'Sorry!', az: 'üzr' }, { en: 'Sorry?', az: 'nə dedin?' }] },
      { title: 'Başa düşmürəm', build: { parts: ["I don't", 'understand.'], examples: [{ en: "Sorry? I don't understand.", az: 'Bağışlayın? Başa düşmürəm.' }] } },
    ],
    attention: "don't “-mır” hissəsini verir: understand — başa düşmək, I don't understand — başa düşmürəm.",
  })],
  // ── Bölmə 2 ──
  a1_en_b2_d1a: [E('u2d1a_c04t', 'u2d1a_c04', {
    lead: 'three sözündə th səsi var.', focus: 'th',
    sections: [
      { title: 'th necə deyilir?', text: 'Dilin ucunu dişlərin arasına qoy və yavaşca hava burax. “s” deyil, th: three.' },
      { title: 'Saymaq', build: { parts: ['One', 'two', 'three'], examples: [{ en: 'One, two, three!', az: 'Bir, iki, üç!' }] } },
    ],
    attention: 'zero “ziro” oxunur, z səsi ilə başlayır.',
  })],
  a1_en_b2_d1b: [E('u2d1b_c04t', 'u2d1b_c04', {
    lead: 'Bəzi rəqəmlər yazıldığı kimi oxunmur.', focus: 'oxunmur',
    sections: [
      { title: 'Necə oxunur?', pairs: [{ en: 'eight', az: '“eyt”' }, { en: 'nine', az: '“nayn”' }] },
      { title: 'Niyə belədir?', text: 'eight sözündə gh oxunmur. nine sözünün sonundakı e də oxunmur.' },
    ],
    attention: 'Yazanda hərflərə, deyəndə səsə fikir ver.',
  })],
  a1_en_b2_d2: [E('u2d2_c07t', 'u2d2_c07', {
    lead: 'Nömrədə 0 iki cür deyilə bilər.', focus: '0',
    sections: [
      { title: 'zero və oh', pairs: [{ en: 'zero', az: 'sıfır' }, { en: 'oh', az: 'nömrədə sıfır' }] },
      { title: 'Nömrə necə deyilir?', text: 'Telefon nömrəsində rəqəmlər bir-bir deyilir: 050 — “oh five oh”, “əlli” yox.', build: { parts: ["It's", 'nömrə'], examples: [{ en: "It's oh five oh, three two one, four five, six seven.", az: 'Nömrəm 050 321 45 67-dir.' }] } },
    ],
    attention: 'Rəqəmləri qrup-qrup de, qrupların arasında qısa fasilə ver.',
  })],
  a1_en_b2_d3a: [
    E('u2d3a_c03t', 'u2d3a_c03', {
      lead: 'İngilis hərflərinin öz adları var.', focus: 'öz adları',
      sections: [
        { title: 'Hərfin adı', pairs: [{ en: 'F', az: '“ef”' }, { en: 'M', az: '“em”' }] },
        { title: 'Nə vaxt lazımdır?', text: 'Adını, şəhərini hərf-hərf deyəndə hərflərin ingiliscə adını deyirsən.' },
      ],
      attention: 'Bu hərflər asandır: adları bizimkinə oxşayır.',
    }),
    E('u2d3a_c09t', 'u2d3a_c09', {
      lead: 'E və I ən çox qarışan cütdür.', focus: 'E və I',
      sections: [
        { title: 'Necə oxunur?', pairs: [{ en: 'E', az: '“i”' }, { en: 'I', az: '“ay”' }] },
        { title: 'Niyə qarışır?', text: 'Bizim “i” səsi ingiliscə E hərfinin adıdır. I hərfi isə “ay” deyilir.' },
      ],
      attention: 'Adını hərf-hərf deyəndə E və I-yə xüsusi diqqət et.',
    }),
  ],
  a1_en_b2_d3b: [E('u2d3b_c06t', 'u2d3b_c06', {
    lead: 'G və J bizdə başqa cür oxunur.', focus: 'G və J',
    sections: [
      { title: 'Necə oxunur?', pairs: [{ en: 'G', az: '“ci”' }, { en: 'J', az: '“cey”' }] },
      { title: 'Necə ayırırsan?', text: 'İkisi də “c” səsi ilə başlayır. G-nin sonunda “i”, J-nin sonunda “ey” var.' },
    ],
    attention: 'A — “ey”, J — “cey”: sonları eynidir, diqqətlə dinlə.',
  })],
  a1_en_b2_d3c: [E('u2d3c_c06t', 'u2d3c_c06', {
    lead: 'Q və R-in adları bizimkindən çox fərqlidir.', focus: 'Q və R',
    sections: [
      { title: 'Necə oxunur?', pairs: [{ en: 'Q', az: '“kyu”' }, { en: 'R', az: '“ar”' }] },
      { title: 'Harada görürsən?', text: 'QR kodda bu iki hərfi yan-yana görürsən: “kyu-ar”.' },
    ],
    attention: 'K — “key”, Q — “kyu”: ikisi də “k” səsi ilə başlayır.',
  })],
  a1_en_b2_d4: [E('u2d4_c06t', 'u2d4_c06', {
    lead: 'Eyni hərf iki dəfə gəlirsə, double deyirsən.', focus: 'double',
    sections: [
      { title: 'Necə deyilir?', pairs: [{ en: 'double L', az: 'LL' }, { en: 'H-E-double L-O', az: 'Hello' }] },
      { title: 'Nə vaxt?', text: 'Hərf yan-yana iki dəfə gəlirsə, onu iki dəfə demirsən: double və hərfin adı.' },
    ],
    attention: 'Hərfləri tək-tək, aydın de. double-dan sonra hərfin özünü de.',
  })],
  a1_en_b2_d5: [E('u2d5_c08t', 'u2d5_c08', {
    lead: 'Mr və Ms nəzakətli müraciətdir.', focus: 'Mr və Ms',
    sections: [
      { title: 'Kimə?', pairs: [{ en: 'Mr', az: 'kişiyə' }, { en: 'Ms', az: 'qadına' }] },
      { title: 'Necə qurulur?', build: { parts: ['Ms', 'soyad'], examples: [{ en: 'Hello, Ms Hasanova!', az: 'Salam, Həsənova xanım!' }] } },
    ],
    attention: 'Mr və Ms adla yox, soyadla işlənir və soyaddan əvvəl gəlir. Biz isə “xanım” sözünü sonda deyirik.',
  })],
  a1_en_b2_d6: [E('u2d6_c08t', 'u2d6_c08', {
    lead: 'E-poçtda işarələr sözlə deyilir.', focus: 'sözlə',
    sections: [
      { title: 'İşarələr', pairs: [{ en: 'at', az: '@' }, { en: 'dot', az: '.' }] },
      { title: 'Necə deyilir?', build: { parts: ["It's", 'e-poçt'], examples: [{ en: "It's K-B at mail dot com.", az: 'kb@mail.com' }] } },
    ],
    attention: 'Adı hərf-hərf de, sonra at və dot.',
  })],
  a1_en_b2_d7a: [
    E('u2d7a_c04t', 'u2d7a_c04', {
      lead: 'eleven və twelve öz adı olan rəqəmlərdir.', focus: 'eleven və twelve',
      sections: [
        { title: 'Rəqəmlər', pairs: [{ en: 'eleven', az: '11' }, { en: 'twelve', az: '12' }] },
        { title: 'Nə fərqi var?', text: 'Biz “on bir”, “on iki” deyirik. İngiliscə bunlar iki hissədən qurulmur, ayrıca söz kimi yadda saxlanır.' },
      ],
      attention: 'eleven-də “i” səsi ilə başla: “ilevn”.',
    }),
    E('u2d7a_c06t', 'u2d7a_c06', {
      lead: '13-dən 19-a qədər sonda -teen gəlir.', focus: '-teen',
      sections: [
        { title: 'Necə qurulur?', text: 'Rəqəmin adına -teen artırılır: four + teen → fourteen.', build: { parts: ['four', 'teen'], examples: [{ en: 'Thirteen, fourteen, fifteen!', az: 'On üç, on dörd, on beş!' }] } },
        { title: 'Vurğu harada?', text: '-teen hissəsini uzun və güclü de: “fortiin”. Sonra 40 ilə qarışdırmayacaqsan.' },
      ],
      attention: 'thirteen və fifteen bir az fərqli qurulur: three → thir, five → fif.',
    }),
  ],
  a1_en_b2_d7b: [
    E('u2d7b_c04t', 'u2d7b_c04', {
      lead: '-teen və -ty asan qarışır.', focus: '-teen və -ty',
      sections: [
        { title: 'Fərq', pairs: [{ en: 'fourteen', az: '14' }, { en: 'forty', az: '40' }] },
        { title: 'Necə ayırırsan?', text: '-teen-də son hissə uzun və güclü deyilir. -ty-də isə əvvəl güclüdür: “FORti”.' },
      ],
      attention: 'four → forty: forty sözündə u yoxdur.',
    }),
    E('u2d7b_c08t', 'u2d7b_c08', {
      lead: "Yaşını I'm ilə deyirsən.", focus: "I'm",
      sections: [
        { title: 'Necə qurulur?', build: { parts: ["I'm", 'yaş'], examples: [{ en: "I'm twenty-five.", az: '25 yaşındayam.' }] } },
        { title: 'Nə fərqi var?', text: 'Biz “25 yaşım var” deyirik. İngiliscə “var” sözü işlənmir: I\'m və rəqəm kifayətdir.' },
      ],
      attention: "Sual How old are you? — cavab I'm və yaş.",
    }),
  ],
  // ── Bölmə 3 ──
  a1_en_b3_d1: [E('u3d1_c04t', 'u3d1_c04', {
    lead: 'from bizim “-dan” hissəmizdir.', focus: 'from',
    sections: [
      { title: 'Harada gəlir?', text: 'Biz “-dan” hissəsini sonda deyirik: Bakı-dan. İngiliscə from şəhərdən əvvəl gəlir.', build: { parts: ["I'm from", 'şəhər / ölkə'], examples: [{ en: "I'm from Baku.", az: 'Bakıdanam.' }] } },
      { title: 'Sualda', build: { parts: ['Where are you', 'from?'], examples: [{ en: 'Where are you from?', az: 'Haradansan?' }] } },
    ],
    attention: 'Sualda from sona keçir: Where are you from?',
  })],
  a1_en_b3_d2a: [E('u3d2a_c04t', 'u3d2a_c04', {
    lead: 'Ölkə adı böyük hərflə yazılır.', focus: 'böyük hərflə',
    sections: [
      { title: 'Ölkələr', pairs: [{ en: 'Turkey', az: 'Türkiyə' }, { en: 'Azerbaijan', az: 'Azərbaycan' }] },
      { title: 'Necə deyilir?', build: { parts: ["I'm from", 'ölkə'], examples: [{ en: "I'm from Turkey.", az: 'Türkiyədənəm.' }] } },
    ],
    attention: 'Ölkənin adı dəyişmir, “-dan” hissəsini from verir.',
  })],
  a1_en_b3_d2b: [E('u3d2b_c06t', 'u3d2b_c06', {
    lead: 'Bəzi ölkə adlarından əvvəl the gəlir.', focus: 'the',
    sections: [
      { title: 'the ilə', pairs: [{ en: 'the UK', az: 'Böyük Britaniya' }, { en: 'the USA', az: 'ABŞ' }] },
      { title: 'Necə deyilir?', build: { parts: ["I'm from", 'the USA'], examples: [{ en: "I'm from the USA.", az: 'ABŞ-danam.' }] } },
    ],
    attention: 'Turkey və England adlarında the yoxdur.',
  })],
  a1_en_b3_d3a: [
    E('u3d3a_c02t', 'u3d3a_c02', {
      lead: 'Ölkə və millət iki ayrı sözdür.', focus: 'Ölkə və millət',
      sections: [
        { title: 'Fərq', pairs: [{ en: 'Azerbaijan', az: 'ölkə' }, { en: 'Azerbaijani', az: 'millət' }] },
        { title: 'Necə deyilir?', text: 'Ölkədən danışanda from işlənir. Milləti deyəndə from yoxdur.', build: { parts: ["I'm", 'millət'], examples: [{ en: "I'm from Azerbaijan. I'm Azerbaijani.", az: 'Mən Azərbaycandanam. Azərbaycanlıyam.' }] } },
      ],
      attention: 'Millət adı da böyük hərflə yazılır: Azerbaijani.',
    }),
    E('u3d3a_c06t', 'u3d3a_c06', {
      lead: 'from-dan sonra ölkə, from-suz millət.', focus: 'from',
      sections: [
        { title: 'İki cümlə', pairs: [{ en: "I'm from Turkey.", az: 'ölkə' }, { en: "I'm Turkish.", az: 'millət' }] },
        { title: 'Necə qurulur?', build: { parts: ["I'm", 'millət'], examples: [{ en: "I'm from Russia. I'm Russian.", az: 'Mən Rusiyadanam. Rusam.' }] } },
      ],
      attention: "“I'm from Turkish” olmur: from-dan sonra ölkə gəlir.",
    }),
  ],
  a1_en_b3_d3b: [E('u3d3b_c10t', 'u3d3b_c10', {
    lead: 'Formada Nationality sətrinə millət yazılır.', focus: 'Nationality',
    sections: [
      { title: 'Ölkə və millət', pairs: [{ en: 'Germany', az: 'ölkə' }, { en: 'German', az: 'millət' }] },
      { title: 'Formada', build: { parts: ['Nationality:', 'millət'], examples: [{ en: 'Nationality: Azerbaijani.', az: 'Milləti: azərbaycanlı.' }] } },
    ],
    attention: 'Ölkə və millət adları oxşardır, sonları fərqlidir: France — French.',
  })],
  a1_en_b3_d4: [
    E('u3d4_c02t', 'u3d4_c02', {
      lead: 'Sualda Are cümlənin əvvəlinə keçir.', focus: 'Are',
      sections: [
        { title: 'Sual necə qurulur?', text: 'Biz sualı səslə, sonda “-mı” ilə edirik. İngiliscə isə Are əvvəldə gəlir.' },
        { title: 'Nümunə', build: { parts: ['Are you from', 'ölkə?'], examples: [{ en: 'Are you from Turkey?', az: 'Sən Türkiyədənsən?' }] } },
      ],
      attention: 'Cavab Yes və ya No ilə başlayır, onu indi öyrənəcəksən.',
    }),
    E('u3d4_c06t', 'u3d4_c06', {
      lead: 'Qısa cavabda Yes və No-dan sonra I am gəlir.', focus: 'I am',
      sections: [
        { title: 'Cavablar', pairs: [{ en: 'Yes, I am.', az: 'bəli' }, { en: "No, I'm not.", az: 'xeyr' }] },
        { title: 'Niyə belədir?', text: 'Sual Are you ilə başlayırsa, cavab I am ilə verilir. “Xeyr” cavabına not artırılır.' },
      ],
      attention: "“Yes, I'm.” olmur: cümlənin sonunda I am tam deyilir.",
    }),
  ],
  a1_en_b3_d5b: [
    E('u3d5b_c05t', 'u3d5b_c05', {
      lead: 'Sualda is əvvələ keçir.', focus: 'is',
      sections: [
        { title: 'Sual necə qurulur?', text: "Cavabda She's / He's deyirsən. Sualda isə is əvvələ keçir: Is she …?" },
        { title: 'Nümunə', build: { parts: ['Is', 'she / he', 'millət?'], examples: [{ en: 'Is she Turkish?', az: 'O türkdürmü?' }] } },
      ],
      attention: 'Biz “-mı” hissəsini sonda deyirik. İngiliscə Is əvvəldə gəlir.',
    }),
    E('u3d5b_c09t', 'u3d5b_c09', {
      lead: 'Is she …? sualına qısa cavab.', focus: 'qısa cavab',
      sections: [
        { title: 'Cavablar', pairs: [{ en: 'Yes, he is.', az: 'bəli' }, { en: "No, she isn't.", az: 'xeyr' }] },
        { title: 'Qısa forma', short: { full: 'is not', drop: 'o', short: "isn't", note: 'Danışıqda qısa deyilir, mənası eynidir.' } },
      ],
      attention: "“Yes, he's.” olmur: sonda is tam deyilir.",
    }),
  ],
  a1_en_b3_d6: [
    E('u3d6_c02t', 'u3d6_c02', {
      lead: 'Bu sualda do var.', focus: 'do',
      sections: [
        { title: 'do nə edir?', text: 'do sualı açır, özü tərcümə olunmur. Sözlər yenə “Harada yaşayırsan?” deməkdir.' },
        { title: 'Necə qurulur?', build: { parts: ['Where do you', 'live?'], examples: [{ en: 'Where do you live?', az: 'Harada yaşayırsan?' }] } },
      ],
      attention: 'Where are you from? sualında do yoxdur, orada are var.',
    }),
    E('u3d6_c04t', 'u3d6_c04', {
      lead: 'Cavabda do yoxdur.', focus: 'do',
      sections: [
        { title: 'Fərq', pairs: [{ en: 'I live in', az: '…-da yaşayıram' }, { en: "I'm from", az: '…-danam' }] },
        { title: 'Necə qurulur?', build: { parts: ['I live in', 'şəhər / ölkə'], examples: [{ en: 'Where do you live? — I live in Baku.', az: 'Harada yaşayırsan? — Bakıda yaşayıram.' }] } },
      ],
      attention: 'Biz “-da” hissəsini sonda deyirik. İngiliscə in şəhərdən əvvəl gəlir.',
    }),
  ],
  a1_en_b3_d7: [E('u3d7_c06t', 'u3d7_c06', {
    lead: 'Do you …? sualına do ilə cavab verilir.', focus: 'do',
    sections: [
      { title: 'Cavablar', pairs: [{ en: 'Yes, I do.', az: 'bəli' }, { en: "No, I don't.", az: 'xeyr' }] },
      { title: 'Niyə belədir?', text: 'Sual Do ilə başlayırsa, qısa cavabda da do gəlir. “Xeyr” cavabında don\'t deyilir.' },
    ],
    attention: 'Are you …? sualına I am, Do you …? sualına I do ilə cavab verilir.',
  })],
};

/** Puts the explain cards after the cards they belong to and renumbers the lesson. */
export function withExplains(lesson: DesignLesson): DesignLesson {
  const extra = EXPLAINS[lesson.id];
  if (!extra) return lesson;
  const cards = [...lesson.cards] as DesignLesson['cards'][number][];
  for (const { after, card } of extra) {
    if (cards.some(c => c.id === card.id)) continue;
    const at = cards.findIndex(c => c.id === after);
    if (at < 0) throw new Error(`${lesson.id}: explain ${card.id} — no card ${after}`);
    cards.splice(at + 1, 0, card);
  }
  return { ...lesson, cards: cards.map((c, i) => ('number' in c ? { ...c, number: i + 1 } : c)) as DesignLesson['cards'] };
}
