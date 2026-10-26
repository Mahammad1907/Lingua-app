import { assessPacketAnswer, goalLabels } from './packetAnswer';
import type { PacketCard } from '../data/b1PacketTypes';
export function feedbackCopy(card: PacketCard, answer: string) {
  const rule = card.turns?.[0]?.rule || card.rule;
  const assessed = rule ? assessPacketAnswer(answer, rule) : undefined;
  const goals = (rule?.goals || []).filter(g => !assessed?.criteria.find(c => c.goal === goalLabels[g])?.passed);
  if (goals.includes('farewell')) return { reason: /\b(hi|hello|hey)\b/i.test(answer) ? 'Bu, salamlaşmadır. Burada görüş bitir və sağollaşmaq lazımdır.' : 'Burada sağollaşmaq lazımdır. Goodbye! və ya Bye! yaza bilərsən.', example: 'Əli gedəndə Leyla “Bye!” deyir.' };
  if (goals.includes('greet')) return { reason: goals.length > 1 ? goals.includes('introduce') ? 'Salam ver və adını de.' : 'Salam ver və qarşı tərəfin adını soruş.' : 'Burada salam vermək lazımdır. Hello! və ya Hi! yaza bilərsən.', example: 'Əli ilə qarşılaşanda “Hello!” deyə bilərsən.' };
  if (goals.includes('introduce')) return { reason: /\bfrom\b/i.test(answer) ? 'Bu cümlə haralı olduğunu bildirir. Burada adını demək lazımdır.' : rule?.roleName ? `Burada ${rule.roleName} adını demək lazımdır.` : 'Burada öz adını demək lazımdır.', example: 'Leyla özünü belə təqdim edir: My name is Leyla.' };
  if (goals.includes('askName')) return { reason: 'Qarşı tərəfin adını soruşmaq lazımdır.', example: 'Əlinin adını öyrənmək üçün: What’s your name?' };
  if (goals.includes('fine')) return { reason: /\bnot\b/i.test(answer) ? 'Not sözü mənanı mənfiyə çevirir. Burada yaxşı olduğunu bildirməlisən.' : 'Burada yaxşı olduğunu bildirməlisən.', example: 'Əli yaxşıdır: I’m fine.' };
  if (goals.includes('repeat') && goals.includes('slow')) return { reason: 'İki xahiş lazımdır: yenidən demək və daha yavaş danışmaq.', example: 'Can you repeat that more slowly, please?' };
  const simple: Record<string, string> = { thanks: 'Edilən köməyə təşəkkür etmək lazımdır.', welcome: 'Təşəkkürə “dəyməz” mənalı cavab vermək lazımdır.', sorry: 'Etdiyin kiçik səhvə görə üzr istəmək lazımdır.', attention: 'Əvvəl qarşı tərəfin diqqətini nəzakətlə çəkmək lazımdır.', unwell: 'Özünü yaxşı hiss etmədiyini bildirmək lazımdır.', feeling: 'Öz halını bildir və istənirsə, sualı qarşı tərəfə qaytar.', askFeeling: 'Qarşı tərəfin halını soruşmaq lazımdır.', noProblem: 'Kiçik səhvin problem olmadığını bildirmək lazımdır.', politeName: 'Ad istəyərkən please sözünü də işlət.', dontUnderstand: 'Deyiləni anlamadığını bildirmək lazımdır.', repeat: 'Deyiləni yenidən eşitmək istədiyini bildir.', slow: 'Daha yavaş danışılmasını istə.' };
  if (card.audio && card.options) return { reason: 'Seçdiyin cavab eşitdiyin ifadəyə uyğun deyil.', example: card.explanation || '' };
  if (card.audio) return { reason: 'Bu tapşırıqda səsdə eşitdiyin hissəni yazmaq lazımdır.', example: `Səsdə: ${card.audio}` };
  if (card.words) return { reason: 'Verilən sözlərin sırasını yoxla.', example: rule?.answers[0] || '' };
  return { reason: goals.map(g => simple[g]).filter(Boolean).join(' ') || 'Bu cavab uyğun deyil. Aşağıdakı nümunəyə bax.', example: rule?.answers[0] || '' };
}
