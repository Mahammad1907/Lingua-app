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
  if (goals.includes('introduce')) return 'Özünü təqdim etməlisən. Tapşırıqda ad verilibsə, həmin adı istifadə et.';
  if (goals.includes('askName')) return 'Qarşı tərəfin adını öyrənmək üçün ingiliscə sual qur.';
  if (goals.includes('farewell')) return 'Görüş bitir. Söhbəti bitirərkən işlənən ifadəni düşün.';
  if (goals.includes('greet')) return 'Söhbət yeni başlayır. Qarşılaşanda deyilən ingiliscə salamlaşma ifadəsini düşün.';
  if (goals.includes('thanks')) return 'Sənə kömək edilib. Təşəkkür etmək üçün uyğun ingiliscə ifadə yaz.';
  if (goals.includes('askFeeling')) return 'Qarşı tərəfin halını soruşan sual və ya qısa qarşılıq yaz.';
  if (goals.includes('repeat') || goals.includes('slow')) return 'Qarşı tərəfdən nəyi dəyişməsini istədiyini düşün: yenidən deməsini, yoxsa daha yavaş danışmasını?';
  return 'Tapşırıqda səndən nə istəndiyini yenidən oxu. Cavabını ingiliscə və həmin vəziyyətə uyğun yaz.';
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
  if (rule?.goals?.includes('farewell') && /\b(hi|hello|hey)\b/i.test(answer)) return 'Hi və Hello salamlaşmaq üçündür. Görüş bitəndə Goodbye və ya Bye deyirik.';
  if (rule?.goals?.includes('greet') && /\b(goodbye|bye)\b/i.test(answer)) return 'Goodbye və Bye sağollaşmaq üçündür. Söhbət başlayanda Hello və ya Hi deyirik.';
  if (verdict.status === 'partial') return `${verdict.message}${card.explanation ? ` ${card.explanation}` : ''}`;
  return card.explanation || verdict.message;
}
