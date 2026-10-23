import type { PacketCard, PacketLesson } from '../data/b1PacketTypes';

const introductions = [
  { subtitle: 'İlk söhbətinə bir addım.', board: 'Hello!', objectives: ['Salamlaşmaq', 'Sağollaşmaq', 'Vəziyyətə uyğun ifadə seçmək'] },
  { subtitle: 'Tanışlıq öz adından başlayır.', board: 'My name is…', objectives: ['Adını demək', 'Özünü təqdim etmək', 'Sadə təqdimat cümləsi qurmaq'] },
  { subtitle: 'Söhbəti bir sualla davam etdir.', board: 'Your name?', objectives: ['Qarşı tərəfin adını soruşmaq', 'Ad sualına cavab vermək', 'Tanışlığa qarşılıq vermək'] },
  { subtitle: 'Bir-birinizin halını soruşun.', board: 'How are you?', objectives: ['Hal-əhval soruşmaq', 'Öz halını bildirmək', 'Söhbəti qarşılıqlı davam etdirmək'] },
  { subtitle: 'Kiçik sözlər, xoş münasibət.', board: 'Thank you!', objectives: ['Təşəkkür etmək', 'Üzr istəmək', 'Nəzakətli cavab vermək'] },
  { subtitle: 'Başa düşməyəndə söhbəti davam etdir.', board: 'Again, please!', objectives: ['Təkrar istəmək', 'Yavaş danışmağı istəmək', 'Anlamadığını bildirmək'] },
  { subtitle: 'Öyrəndiklərini söhbətdə birləşdir.', board: 'Let’s talk!', objectives: ['Özünü təqdim etmək', 'Sual verib cavablandırmaq', 'BirFox ilə səsli məşq etmək'] },
];
export function lessonIntroduction(packet: PacketLesson) {
  return introductions[packet.order - 1] || { subtitle: 'BirFox ilə birlikdə öyrən.', board: 'Let’s learn!', objectives: [packet.goal] };
}
// Hints explain the requested skill. Answer keys/explanations are deliberately not read here.
export function lessonHint(card: PacketCard): string | null {
  if (card.kind !== 'task' || card.audio || card.options) return null;
  if (card.words) return 'Sözlərə düzgün ardıcıllıqla toxun. Seçdiyin sözü çıxarmaq üçün ona yenidən toxuna bilərsən.';
  const goals = card.rule?.goals || [];
  const hints: Partial<Record<typeof goals[number], string>> = {
    greet: 'Söhbətə salamla başla.', introduce: 'Sonra adını bildir. Rol adı verilibsə, həmin adı saxla.',
    askName: 'Qarşı tərəfin adını öyrənən sual ver.', meet: 'Tanış olduğuna şad olduğunu bildir.',
    fine: 'Yaxşı olduğunu bildir; inkar sözü mənanı dəyişir.', unwell: 'Özünü yaxşı hiss etmədiyini bildir.', feeling: 'Öz halına uyğun cavab ver.',
    askFeeling: 'Cavabından sonra söhbəti qarşı tərəfin halına qaytar.', thanks: 'Edilən köməyə təşəkkür et.', welcome: 'Təşəkkürə nəzakətli cavab ver.',
    sorry: 'Etdiyin kiçik səhvə görə üzr istə.', attention: 'Sualdan əvvəl qarşı tərəfin diqqətini nəzakətlə çək.',
    noProblem: 'Kiçik səhvin problem olmadığını bildir.', politeName: 'Ad istəyən ifadəyə nəzakətli xahiş sözü əlavə et.',
    dontUnderstand: 'Deyilən mənanı anlamadığını bildir.', repeat: 'Deyiləni yenidən eşitmək istədiyini bildir.', slow: 'Danışıq sürətinin azalmasını istə.',
    farewell: 'Görüş bitir. Söhbəti bitirmək üçün uyğun ifadə seç.',
  };
  return goals.map(goal => hints[goal]).filter(Boolean).join(' ') || 'Səndən istənən məlumatı düşün. İngiliscə həmin məqsədə uyğun qısa cavab qur.';
}
export function teachingText(card: PacketCard): string {
  // The board already contains these examples; retain the authored explanation once.
  return card.kind === 'teach' ? card.body.split(/\n\s*\n/)[0] : card.body;
}
export function microphoneLevel(db: number | undefined): number {
  return db === undefined || !Number.isFinite(db) ? 0 : Math.min(1, Math.max(0, (db + 55) / 55));
}

// Read only after grading; pre-answer lessonHint never calls this helper.
export function lessonCorrection(card: PacketCard, answer: string, verdict: { status: string; message: string }): string {
  const rule = card.turns?.[0]?.rule || card.rule;
  if (rule?.goals?.includes('introduce') && /\b(from|in|years|teacher|student|doctor|engineer)\b/i.test(answer)) return 'Burada adını çatdırmalısan. Ölkə, yaş və peşə haqqında məlumat adını demək tapşırığını yerinə yetirmir. I’m və ya My name is ifadəsindən sonra adını de.';
  if (rule?.goals?.includes('fine') && /\bnot\b/i.test(answer)) return 'Not mənanı mənfiyə çevirir. I’m not good yaxşı olmadığını bildirir; burada yaxşı olduğunu deməlisən.';
  if (rule?.goals?.length === 1 && rule.goals[0] === 'askFeeling' && /^and you[?! .]*$/i.test(answer)) return 'And you? əvvəl verilən sualı qarşı tərəfə qaytarır. Burada bütöv hal-əhval sualı lazımdır: How are you?';
  if (rule?.goals?.includes('sorry') && /excuse me/i.test(answer)) return 'Bu vəziyyətdə artıq etdiyin kiçik səhvə görə üzr istəyirsən: Sorry və ya I’m sorry. Excuse me burada öyrəndiyimiz diqqət çəkmək ifadəsidir.';
  if (rule?.goals?.includes('attention') && /sorry/i.test(answer)) return 'Burada söhbətə başlamazdan əvvəl diqqət çəkmək lazımdır. Bu vəziyyət üçün öyrəndiyimiz ifadə Excuse me-dir.';
  if (rule?.goals?.includes('farewell') && /\b(hi|hello|hey)\b/i.test(answer)) return 'Hi və Hello salamlaşmaq üçündür. Görüş bitəndə Goodbye və ya Bye deyirik.';
  if (rule?.goals?.includes('greet') && /\b(goodbye|bye)\b/i.test(answer)) return 'Goodbye və Bye sağollaşmaq üçündür. Söhbət başlayanda Hello və ya Hi deyirik.';
  if (verdict.status === 'partial') return `${verdict.message}${card.explanation ? ` ${card.explanation}` : ''}`;
  return [verdict.message, card.explanation].filter(Boolean).join(' ');
}
