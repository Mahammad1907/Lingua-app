// Bölmə 4 · Dərs 7 — Peşə (teacher · student · doctor · engineer · What's his job?).
// {F} ailə albomunu göstərir: xəstəxana, məktəb, ofis. a və an: samitdən əvvəl a, saitdən əvvəl an (tam izahı Bölmə 5-də davam edir).
// Spiral: He's/She's, Is she …?, Yes, she is. (Bölmə 3), his/her (Dərs 3), ailə sözləri.
import type { DesignLesson, ExplainCard } from '../designLessonTypes';
import { ex, exact, other, pick } from '../unit1/build';
import { notices, resultTexts } from '../unit3/shared';
import { aForVowel, anForConsonant, forField, heForShe, noArticle, sheForHe } from './shared78';

export const lesson7: DesignLesson = {
  id: 'a1_en_b4_d7', order: 42, unit: 4, number: 7, title: 'Peşə', section: 'Ailə və insanlar',
  notices,
  cards: [
    {
      type: 'intro', id: 'u4d7_c01', badge: 'Ailə və insanlar', subtitle: '{F} ailə albomunun iş şəkillərini göstərir: xəstəxana, məktəb, ofis.', start: 'Dərsə başla',
      goals: [
        { icon: 'chat', text: 'Peşə sözlərini tanıya bilirəm.' },
        { icon: 'wave', text: 'Ailə üzvünün peşəsi soruşulanda cavab verə bilirəm.' },
      ],
    },
    {
      type: 'word', id: 'u4d7_c02', number: 2, scenes: ['mascot/point'],
      word: 'teacher', pronunciation: '/ˈtitʃɚ/', reading: 'tiçər', az: 'müəllim',
      structure: ["She's a teacher.", "He's a teacher."],
      notes: ['Vurğu birinci hecadadır: Ti-çır.'],
      example: "She's a teacher.", exampleAz: 'O müəllimdir.',
    },
    {
      type: 'choice', id: 'u4d7_c03', number: 3, title: 'Dinlə və anla', why: '“a teacher” — müəllim; iş deyilir.', hint: 'Cümlənin sonundakı sözə qulaq as.',
      prompt: '{F} albomda məktəbdəki qadını göstərir.\nO nə deyir?', audio: "She's a teacher.",
      options: ['O müəllimdir.', 'O türkdür.', 'O Bakıdandır.'], answer: 'O müəllimdir.',
      variants: [
        pick('O türkdür.', 'Səsdə millət yox, iş deyilir.', ex('O müəllimdir.', 'Səsdə “a teacher” var: bu, işdir, millət deyil.', "She's a teacher. — iş; She's Turkish. — millət.", "She's from Baku.")),
        pick('O Bakıdandır.', 'Səsdə “from” yoxdur.', ex('O müəllimdir.', 'Bakıdan olmaq “from” ilə deyilir; burada “a teacher” eşidilir.', "She's a teacher. — iş; She's from Baku. — haradan.", "She's Turkish.")),
      ],
      review: {
        title: 'Dinlə və anla', why: '“a teacher” — müəllim; iş deyilir.', hint: 'Cümlənin sonundakı yeni sözə qulaq as.',
        prompt: 'Kafedə yeni tanış telefondakı şəkildəki kişini göstərir.\nO nə deyir?', audio: "He's a teacher.",
        options: ['O gürcüdür.', 'O Gəncədəndir.', 'O müəllimdir.'], answer: 'O müəllimdir.',
        variants: [
          pick('O gürcüdür.', 'Səsdə millət yox, iş deyilir.', ex('O müəllimdir.', 'Səsdə “a teacher” var: bu, işdir, millət deyil.', "He's a teacher. — iş; He's Georgian. — millət.", "He's from Ganja.")),
          pick('O Gəncədəndir.', 'Səsdə “from” yoxdur.', ex('O müəllimdir.', 'Gəncədən olmaq “from” ilə deyilir; burada “a teacher” eşidilir.', "He's a teacher. — iş; He's from Ganja. — haradan.", "He's Georgian.")),
        ],
      },
    },
    {
      type: 'word', id: 'u4d7_c04', number: 4, scenes: ['mascot/happy'],
      word: 'student', pronunciation: '/ˈstudənt/', reading: 'studənt', az: 'tələbə',
      structure: ["He's a student.", "She's a student."],
      notes: ['Vurğu birinci hecadadır: STU-dənt.'],
      example: "He's a student.", exampleAz: 'O tələbədir.',
    },
    {
      type: 'match', id: 'u4d7_c05', number: 5, title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.',
      prompt: '{F} albomdakı şəkillərin altına yazılar qoyub.\nHər cümləyə mənasını qoş.',
      rows: [{ en: "She's a teacher.", az: 'O müəllimdir.', from: 'other' }, { en: "He's a student.", az: 'O tələbədir.', from: 'other' }, { en: "He's from Baku.", az: 'O Bakıdandır.', from: 'other' }],
      extra: ['O Gəncədəndir.'],
      variants: [other('Bir cümlənin mənası yerində deyil.', ex("She's a teacher. — O müəllimdir.; He's a student. — O tələbədir.; He's from Baku. — O Bakıdandır.", 'a teacher və a student işdir, from olan cümlə yerdir.', "He's a student. — iş; He's from Baku. — haradan.", "She's a teacher."))],
      review: {
        title: 'Kim nə dedi?', why: 'Hər cümlənin mənasını tapdın.',
        prompt: 'Hostelin divarında şəkillər və altında yazılar var.\nHər cümləyə mənasını qoş.',
        rows: [{ en: "He's a doctor.", az: 'O həkimdir.', from: 'other' }, { en: "She's an engineer.", az: 'O mühəndisdir.', from: 'other' }, { en: "She's Turkish.", az: 'O türkdür.', from: 'other' }],
        extra: ['O müəllimdir.'],
        variants: [other('Bir cümlənin mənası yerində deyil.', ex("He's a doctor. — O həkimdir.; She's an engineer. — O mühəndisdir.; She's Turkish. — O türkdür.", 'a doctor və an engineer işdir, Turkish millətdir.', "She's an engineer. — iş; She's Turkish. — millət.", "He's a teacher."))],
      },
    },
    {
      type: 'word', id: 'u4d7_c06', number: 6, scenes: ['mascot/wave'],
      word: 'doctor', pronunciation: '/ˈdɑktɚ/', reading: 'daktər', az: 'həkim',
      structure: ["He's a doctor.", "She's a doctor."],
      notes: ['“doctor” — “dəktər” yox, “daktər”: birinci saitdə “a”.'],
      example: "He's a doctor.", exampleAz: 'O həkimdir.',
    },
    {
      type: 'write', id: 'u4d7_c07', number: 7, title: 'Cümləni qur', why: 'Peşə sözündən əvvəl a gəlir: a doctor.', hint: 'Kişidən danış, peşəni bu dərsin söz kartındakı kimi qur.',
      prompt: 'Şəkildəki kişi həkimdir.\nŞəklin altına yaz. Sözlərdən cümlə qur.', placeholder: 'Sözlərə toxun',
      photo: { from: 'Sənin albomun', shows: 'ağ xalatlı kişi həkim' },
      tiles: ['doctor', "He's", 'a', "She's", 'student', '.'], rule: exact("He's a doctor.", 'He is a doctor.'),
      variants: [
        noArticle("He's a doctor.", "He's doctor.", "She's a teacher."),
        sheForHe("He's a doctor.", "She's a teacher."),
        other('Sıra: He\'s a doctor.', ex("He's a doctor.", 'Əvvəl He\'s, sonra a, sonra peşə.', "He's a doctor. — kişi; She's a doctor. — qadın.", "She's a teacher.")),
      ],
      review: {
        title: 'Cümləni qur', why: 'Peşə sözündən əvvəl a gəlir: a teacher.', hint: 'Qadından danış, peşəni bu dərsin söz kartındakı kimi qur.',
        prompt: 'Şəkildəki qadın müəllimdir.\nŞəklin altına yaz. Sözlərdən cümlə qur.', placeholder: 'Sözlərə toxun',
        photo: { from: 'Sənin albomun', shows: 'sinifdə qadın müəllim' },
        tiles: ['teacher', "She's", 'a', "He's", 'student', '.'], rule: exact("She's a teacher.", 'She is a teacher.'),
        variants: [
          noArticle("She's a teacher.", "She's teacher.", "He's a doctor."),
          heForShe("She's a teacher.", "He's a doctor."),
          other('Sıra: She\'s a teacher.', ex("She's a teacher.", 'Əvvəl She\'s, sonra a, sonra peşə.', "She's a teacher. — qadın; He's a teacher. — kişi.", "He's a doctor.")),
        ],
      },
    },
    {
      type: 'word', id: 'u4d7_c08', number: 8, scenes: ['mascot/think'],
      word: 'engineer', pronunciation: '/ˌɛndʒəˈnɪr/', reading: 'encinir', az: 'mühəndis',
      structure: ["She's an engineer.", "He's an engineer."],
      notes: ['Vurğu sonuncu hecadadır: en-ci-NİR.'],
      example: "She's an engineer.", exampleAz: 'O mühəndisdir.',
    },
    {
      type: 'choice', id: 'u4d7_c09', number: 9, title: 'Sözü tamamla', why: 'engineer e səsi ilə başlayır: an engineer.', hint: 'engineer sözünün ilk səsinə qulaq as.',
      prompt: 'Albomdakı başqa şəkildə qadın ofisdə işləyir. O mühəndisdir.\nHansı söz çatmır?', gap: { speaker: 'other', before: "She's", after: 'engineer.' },
      options: ['a', 'an', 'is'], answer: 'an',
      variants: [
        pick('a', 'engineer e səsi ilə başlayır: a yox, an gəlir.', ex('an', 'engineer e səsi ilə başlayır; belə sözdən əvvəl an gəlir.', "She's an engineer. — düzdür; She's a engineer. — olmur.", "He's a doctor.")),
        pick('is', "She's artıq “She is” deməkdir.", ex('an', "She's artıq “She is” deməkdir; is bir daha gəlmir.", "She's an engineer. — düzdür; She's is engineer. — olmur.", "He's a doctor.")),
      ],
      review: {
        title: 'Sözü tamamla', why: 'doctor d səsi ilə başlayır: a doctor.', hint: 'doctor sözünün ilk səsinə qulaq as.',
        prompt: 'Hostelin divarındakı şəkildə kişi xəstəxanadadır. O həkimdir.\nHansı söz çatmır?', gap: { speaker: 'other', before: "He's", after: 'doctor.' },
        options: ['an', 'a', 'is'], answer: 'a',
        variants: [
          pick('an', 'doctor d səsi ilə başlayır: an yox, a gəlir.', ex('a', 'doctor d səsi ilə başlayır; belə sözdən əvvəl a gəlir.', "He's a doctor. — düzdür; He's an doctor. — olmur.", "She's an engineer.")),
          pick('is', "He's artıq “He is” deməkdir.", ex('a', "He's artıq “He is” deməkdir; is bir daha gəlmir.", "He's a doctor. — düzdür; He's is doctor. — olmur.", "She's an engineer.")),
        ],
      },
    },
    {
      type: 'word', id: 'u4d7_c10', number: 10, scenes: ['mascot/ask'],
      word: "What's his job?", pronunciation: '/wʌts hɪz dʒɑb/', reading: 'uats hiz cab?', az: 'O nə işləyir? (Onun peşəsi nədir?)',
      structure: ["What's his job?", "What's her job?"],
      notes: ['what’s — nədir, his — onun (kişinin), job — iş, peşə; qadın üçün her.'],
      example: "What's his job? — He's a doctor.", exampleAz: 'O nə işləyir? — O həkimdir.',
    },
    {
      type: 'voice', id: 'u4d7_c11', number: 11, title: 'Peşəsini de', why: 'Peşəsini dedin: He\'s a doctor.', hint: 'Sual kişi haqqındadır — peşəni söz kartındakı kimi de.',
      prompt: 'Albomdakı kişi həkimdir.\nSualı dinlə və cavab ver.', audio: "What's his job?", reply: 'Really? Nice!',
      rule: exact("He's a doctor.", 'He is a doctor.'),
      variants: [
        noArticle("He's a doctor.", "He's doctor.", "She's an engineer."),
        anForConsonant("He's a doctor.", "He's an doctor.", 'doctor d səsi ilə başlayır: an yox, a gəlir.', "She's an engineer."),
        sheForHe("He's a doctor.", "She's an engineer."),
        other("He's a doctor.", ex("He's a doctor.", 'Sual kişi haqqındadır: He\'s, sonra a və peşə.', "What's his job? — He's a doctor.; What's her job? — She's an engineer.", "What's his job? — He's a teacher.")),
      ],
      review: {
        title: 'Peşəsini de', why: 'Peşəsini dedin: She\'s an engineer.', hint: 'Sual qadın haqqındadır; peşə sözünün ilk səsinə qulaq as.',
        prompt: 'Şəkildəki qadın mühəndisdir.\nSualı dinlə və cavab ver.', audio: "What's her job?", reply: 'Really? Nice!',
        rule: exact("She's an engineer.", 'She is an engineer.'),
        variants: [
          noArticle("She's an engineer.", "She's engineer.", "He's a doctor."),
          aForVowel("She's an engineer.", "She's a engineer.", "He's a doctor."),
          heForShe("She's an engineer.", "He's a doctor."),
          other("She's an engineer.", ex("She's an engineer.", 'Sual qadın haqqındadır: She\'s, sonra an və peşə.', "What's her job? — She's an engineer.; What's his job? — He's a doctor.", "What's her job? — She's a teacher.")),
        ],
      },
    },
    {
      type: 'profile', id: 'u4d7_profile', number: 12, title: 'Profil kartı', why: "mother — ana; fifty — 50; a teacher — müəllim.", hint: 'Üç cümləni ayrıca tut: kim, neçə yaşında, nə işləyir.',
      prompt: 'Video zəngdə {f} albomdakı bir qadını göstərir.\nDinlə və kartı doldur.', audio: "This is my mother. She's fifty. She's a teacher.",
      rows: [{ id: 'who', label: 'Kim', options: ['sister', 'mother', 'grandmother'], answer: 'mother' }, { id: 'age', label: 'Yaş', number: true, answer: '50' },
        { id: 'job', label: 'Peşə', options: ['doctor', 'engineer', 'teacher'], answer: 'teacher' }],
      variants: [
        { field: 'who', ...pick('sister', 'Səsdə sister yox, mother deyilir.', ex('mother', 'Birinci cümlə This is my mother ilə bitir — ana.', 'mother — ana; sister — bacı.', 'This is my mother.')) },
        { field: 'who', ...pick('grandmother', 'Səsdə grand hissəsi yoxdur: yalnız mother.', ex('mother', 'grandmother uzun sözdür; səsdə qısa mother deyilir.', 'mother — ana; grandmother — nənə.', 'This is my mother.')) },
        { field: 'age', ...other('FIF-ty — 50: vurğu əvvəldədir.', ex('50', 'Vurğu əvvəldədir: FIF-ty — 50.', 'FIF-ty — 50; fif-TEEN — 15.', "She's fifty.")) },
        { field: 'job', ...pick('doctor', 'Səsdə doctor yox, teacher deyilir.', ex('teacher', "Son cümlə She's a teacher-dir — müəllim.", "She's a teacher. — müəllim; She's a doctor. — həkim.", "She's a teacher.")) },
        { field: 'job', ...pick('engineer', 'Səsdə an engineer yox, a teacher deyilir.', ex('teacher', "Son cümlədə a teacher eşidilir; engineer olsaydı, an gələrdi.", "She's a teacher. — müəllim; She's an engineer. — mühəndis.", "She's a teacher.")) },
        other('Kartı səslə yenidən yoxla.', ex('Kim — mother; Yaş — 50; Peşə — teacher', 'Hər cümlə kartın bir sətridir: kim, yaş, peşə.', "She's fifty. — yaş; She's a teacher. — peşə.", "What's her job? — She's a teacher.")),
      ],
      review: {
        title: 'Profil kartı', why: "brother — qardaş; twenty-five — 25; a student — tələbə.", hint: 'Üç cümləni ayrıca tut: kim, neçə yaşında, nə işləyir.',
        prompt: 'Kafedə yeni tanış telefonda bir şəkil göstərir.\nDinlə və kartı doldur.', audio: "This is my brother. He's twenty-five. He's a student.",
        rows: [{ id: 'who', label: 'Kim', options: ['son', 'father', 'brother'], answer: 'brother' }, { id: 'age', label: 'Yaş', number: true, answer: '25' },
          { id: 'job', label: 'Peşə', options: ['student', 'teacher', 'engineer'], answer: 'student' }],
        variants: [
          { field: 'who', ...pick('son', 'Səsdə son yox, brother deyilir.', ex('brother', 'Birinci cümlə This is my brother ilə bitir — qardaş.', 'brother — qardaş; son — oğul.', 'This is my brother.')) },
          { field: 'who', ...pick('father', 'Səsdə father yox, brother deyilir.', ex('brother', 'Birinci cümlə This is my brother ilə bitir — qardaş.', 'brother — qardaş; father — ata.', 'This is my brother.')) },
          { field: 'age', ...other('twenty-five — 25: əvvəl 20, sonra 5.', ex('25', 'Əvvəl onluq gəlir: twenty — 20, sonra five — 5.', 'twenty-five — 25; fifty-two — 52.', "He's twenty-five.")) },
          { field: 'job', ...pick('teacher', 'Səsdə teacher yox, student deyilir.', ex('student', "Son cümlə He's a student-dir — tələbə.", "He's a student. — tələbə; He's a teacher. — müəllim.", "He's a student.")) },
          { field: 'job', ...pick('engineer', 'Səsdə an engineer yox, a student deyilir.', ex('student', 'Son cümlədə a student eşidilir; engineer olsaydı, an gələrdi.', "He's a student. — tələbə; He's an engineer. — mühəndis.", "He's a student.")) },
          other('Kartı səslə yenidən yoxla.', ex('Kim — brother; Yaş — 25; Peşə — student', 'Hər cümlə kartın bir sətridir: kim, yaş, peşə.', "He's twenty-five. — yaş; He's a student. — peşə.", "What's his job? — He's a student.")),
        ],
      },
    },
    {
      type: 'voice', id: 'u4d7_c13', number: 13, title: 'Dinlə və təkrarla', why: 'Cümləni dedin; an engineer bir nəfəsdə deyilir.', hint: 'Əvvəl yavaş dinlə, sonra an-ı engineer ilə birlikdə de.',
      prompt: '{F} albomdakı qadını təqdim edir.\nDinlə, sonra eyni cür de.', audio: "She's an engineer.", repeat: { stress: 'an', note: 'an engineer — an sözü engineer ilə qoşa deyilir: ənencinir.', reading: 'şiz ən encinir' },
      rule: exact("She's an engineer.", 'She is an engineer.'),
      variants: [other('Bir daha dinlə və yavaş de.', ex("She's an engineer.", 'an engineer ayrı-ayrı yox, bir nəfəsdə deyilir.', "She's an engineer. — düzdür; She's a engineer. — olmur.", "He's a doctor."))],
      review: {
        title: 'Dinlə və təkrarla', why: 'Cümləni dedin; student — “studənt”.', hint: 'Əvvəl yavaş dinlə, sonra sözləri bir-bir de.',
        prompt: 'Kafedə yeni tanış kursdakı yoldaşını təqdim edir.\nDinlə, sonra eyni cür de.', audio: "He's a student.", repeat: { stress: 'stu', note: 'student — vurğu birinci hecadadır: STU-dənt.', reading: 'hiz ə studənt' },
        rule: exact("He's a student.", 'He is a student.'),
        variants: [other('Bir daha dinlə və yavaş de.', ex("He's a student.", 'student — “studənt”: vurğu birinci hecadadır.', "He's a student. — düzdür; He's student. — olmur.", "She's a teacher."))],
      },
    },
    {
      type: 'two', id: 'u4d7_c14', number: 14, title: 'İki mesaj yaz', why: 'İki peşəni düzgün a və an ilə yazdın.', hint: 'Hər mesajda əvvəl kimdən danışdığını, sonra peşəsini söz kartındakı kimi yaz.',
      prompt: 'Kişi müəllimdir, qadın mühəndisdir.\nİki mesaj yaz:\n1. Kişinin peşəsi.\n2. Qadının peşəsi.',
      fields: [
        { id: 'u4d7_c14a', label: 'Birinci mesaj', placeholder: 'Kişinin peşəsi', rule: exact("He's a teacher.", 'He is a teacher.'), purpose: 'kişinin peşəsini demək', empty: 'Birinci mesajı da yaz.' },
        { id: 'u4d7_c14b', label: 'İkinci mesaj', placeholder: 'Qadının peşəsi', rule: exact("She's an engineer.", 'She is an engineer.'), purpose: 'qadının peşəsini demək', empty: 'İkinci mesajı da yaz.' },
      ],
      variants: [
        forField('u4d7_c14a', sheForHe("He's a teacher.", "She's an engineer.")),
        forField('u4d7_c14a', noArticle("He's a teacher.", "He's teacher.", "She's an engineer.")),
        forField('u4d7_c14a', anForConsonant("He's a teacher.", "He's an teacher.", 'teacher t səsi ilə başlayır: an yox, a gəlir.', "She's an engineer.")),
        forField('u4d7_c14a', other("He's a teacher.", ex("He's a teacher.", 'Kişinin peşəsini yazırsan: He\'s, sonra a və peşə.', "He's a teacher. — kişi; She's an engineer. — qadın.", "He's a doctor."))),
        forField('u4d7_c14b', heForShe("She's an engineer.", "He's a doctor.")),
        forField('u4d7_c14b', noArticle("She's an engineer.", "She's engineer.", "He's a doctor.")),
        forField('u4d7_c14b', aForVowel("She's an engineer.", "She's a engineer.", "He's a doctor.")),
        forField('u4d7_c14b', other("She's an engineer.", ex("She's an engineer.", 'Qadının peşəsini yazırsan: She\'s, sonra an və peşə.', "She's an engineer. — qadın; He's a teacher. — kişi.", "She's a teacher."))),
      ],
      review: {
        title: 'İki mesaj yaz', why: 'İki peşəni düzgün a və an ilə yazdın.', hint: 'Bu albomda peşələr yer dəyişib — kişini və qadını qarışdırma.',
        prompt: 'Kişi mühəndisdir, qadın həkimdir.\nİki mesaj yaz:\n1. Kişinin peşəsi.\n2. Qadının peşəsi.',
        fields: [
          { id: 'u4d7_c14a', label: 'Birinci mesaj', placeholder: 'Kişinin peşəsi', rule: exact("He's an engineer.", 'He is an engineer.'), purpose: 'kişinin peşəsini demək', empty: 'Birinci mesajı da yaz.' },
          { id: 'u4d7_c14b', label: 'İkinci mesaj', placeholder: 'Qadının peşəsi', rule: exact("She's a doctor.", 'She is a doctor.'), purpose: 'qadının peşəsini demək', empty: 'İkinci mesajı da yaz.' },
        ],
        variants: [
          forField('u4d7_c14a', sheForHe("He's an engineer.", "She's a doctor.")),
          forField('u4d7_c14a', noArticle("He's an engineer.", "He's engineer.", "She's a doctor.")),
          forField('u4d7_c14a', aForVowel("He's an engineer.", "He's a engineer.", "She's a doctor.")),
          forField('u4d7_c14a', other("He's an engineer.", ex("He's an engineer.", 'Kişinin peşəsini yazırsan: He\'s, sonra an və peşə.', "He's an engineer. — kişi; She's a doctor. — qadın.", "He's a teacher."))),
          forField('u4d7_c14b', heForShe("She's a doctor.", "He's an engineer.")),
          forField('u4d7_c14b', noArticle("She's a doctor.", "She's doctor.", "He's an engineer.")),
          forField('u4d7_c14b', anForConsonant("She's a doctor.", "She's an doctor.", 'doctor d səsi ilə başlayır: an yox, a gəlir.', "He's an engineer.")),
          forField('u4d7_c14b', other("She's a doctor.", ex("She's a doctor.", 'Qadının peşəsini yazırsan: She\'s, sonra a və peşə.', "She's a doctor. — qadın; He's an engineer. — kişi.", "She's a teacher."))),
        ],
      },
    },
  ],
  result: {
    done: ['Dərs 7 tamamlandı', 'Artıq peşə sualını başa düşür və ailə üzvünün peşəsini a / an ilə deyirsən.'],
    incomplete: resultTexts.incomplete,
    goals: [
      { group: 'Tanıma', text: 'Peşə sözlərini və a / an-ı tanımaq, eşidib profil kartını doldurmaq', tasks: ['u4d7_c03', 'u4d7_c05', 'u4d7_c09', 'u4d7_profile'] },
      { group: 'Yazı', text: 'Peşəni düzgün a və ya an ilə yazmaq', tasks: ['u4d7_c07', 'u4d7_c14'] },
      { group: 'Danışıq', text: 'Peşəni soruşanda cavab vermək və cümləni düzgün təkrarlamaq', tasks: ['u4d7_c11', 'u4d7_c13'] },
    ],
    closing: 'Növbəti dərs — Bölmə söhbəti: {f} ilə video zəngdə ailəni təqdim edirsən.', button: resultTexts.button,
    technical: resultTexts.technical, unverified: resultTexts.unverified,
  },
  vocabulary: [
    { word: 'teacher', translation: 'müəllim', example: "She's a teacher.", exampleAz: 'O müəllimdir.', usageNote: 'Peşə sözündən əvvəl a gəlir: a teacher.', pronunciation: '/ˈtitʃɚ/', teachCard: 'u4d7_c02' },
    { word: 'student', translation: 'tələbə', example: "He's a student.", exampleAz: 'O tələbədir.', usageNote: 'a student.', pronunciation: '/ˈstudənt/', teachCard: 'u4d7_c04' },
    { word: 'doctor', translation: 'həkim', example: "He's a doctor.", exampleAz: 'O həkimdir.', usageNote: 'd səsi ilə başlayır: a doctor.', pronunciation: '/ˈdɑktɚ/', teachCard: 'u4d7_c06' },
    { word: 'engineer', translation: 'mühəndis', example: "She's an engineer.", exampleAz: 'O mühəndisdir.', usageNote: 'e səsi ilə başlayır: an engineer.', pronunciation: '/ˌɛndʒəˈnɪr/', teachCard: 'u4d7_c08' },
    { word: "What's his job?", translation: 'O nə işləyir?', example: "What's his job? — He's a doctor.", exampleAz: 'O nə işləyir? — O həkimdir.', usageNote: 'Qadın haqqında: What\'s her job?', pronunciation: '/wʌts hɪz dʒɑb/', teachCard: 'u4d7_c10' },
  ],
};

export const explains: { after: string; card: ExplainCard }[] = [
  { after: 'u4d7_c06', card: {
    type: 'explain', id: 'u4d7_c06t', number: 0,
    lead: 'Peşə sözündən əvvəl a gəlir.', focus: 'a',
    sections: [
      { title: 'Azərbaycancada nə fərqlidir?', text: 'Biz “həkimdir” deyirik, “bir” demirik. İngiliscə peşə sözündən əvvəl a gəlir.', build: { parts: ["He's a", 'peşə'], examples: [{ en: "He's a doctor.", az: 'O həkimdir.' }, { en: "She's a teacher.", az: 'O müəllimdir.' }] } },
      { title: 'a hansı sözdən əvvəl gəlir?', pairs: [{ en: 'a doctor', az: 'd səsi ilə başlayır' }, { en: 'a student', az: 's səsi ilə başlayır' }] },
    ],
    attention: '“He\'s doctor.” olmur: a atılmır.',
  } },
  { after: 'u4d7_c08', card: {
    type: 'explain', id: 'u4d7_c08t', number: 0,
    lead: 'a və an: sözün ilk səsinə bax.', focus: 'an',
    sections: [
      { title: 'Hansı nə vaxt?', pairs: [{ en: 'a doctor', az: 'd kimi səslə' }, { en: 'an engineer', az: 'e kimi səslə' }] },
      { title: 'Necə qurulur?', text: 'a, e, i, o, u səsləri ilə başlayan sözdən əvvəl an gəlir. Qalan səslərdən əvvəl a gəlir.', build: { parts: ["She's an", 'engineer'], examples: [{ en: "She's an engineer.", az: 'O mühəndisdir.' }] } },
    ],
    attention: '“a engineer” və “an doctor” olmur: söz hansı səslə başlayır, ona bax.',
  } },
];

export const ruleMeta: Record<string, { title: string; eg: string; topic: 'questions' | 'short' | 'order' | 'polite' | 'sound' | 'numbers' | 'letters' | 'country' }> = {
  u4d7_c06t: { title: 'Peşə sözündən əvvəl a niyə lazımdır?', eg: 'a doctor', topic: 'order' },
  u4d7_c08t: { title: 'a və an-ı nə vaxt işlədim?', eg: 'an engineer', topic: 'sound' },
};
