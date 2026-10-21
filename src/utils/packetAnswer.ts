import type { PacketGoal, PacketRule } from '../data/b1PacketTypes';

export const goalLabels: Record<PacketGoal, string> = {
  greet: 'Salam vermək', farewell: 'Sağollaşmaq', introduce: 'Adını demək', askName: 'Ad soruşmaq', meet: 'Tanışlığa qarşılıq',
  feeling: 'Halını bildirmək', fine: 'Yaxşı olduğunu demək', unwell: 'Yaxşı olmadığını demək', askFeeling: 'Qarşı tərəfin halını soruşmaq',
  thanks: 'Təşəkkür etmək', welcome: 'Təşəkkürə cavab', sorry: 'Üzr istəmək', noProblem: 'Üzrü qəbul etmək', politeName: 'Adı nəzakətlə istəmək',
  attention: 'Diqqəti nəzakətlə çəkmək', dontUnderstand: 'Anlamadığını bildirmək', repeat: 'Təkrar istəmək', slow: 'Yavaş danışmağı istəmək', reason: 'Təkrarın səbəbini anlamaq',
};
export function normalizePacketAnswer(text: string): string {
  return text.normalize('NFKC').toLowerCase().replace(/\u0307/g, '').replace(/[‘’]/g, "'")
    .replace(/\bi'm\b/g, 'i am').replace(/\bname's\b/g, 'name is').replace(/\bwhat's\b/g, 'what is')
    .replace(/\byou're\b/g, 'you are').replace(/\bdon't\b/g, 'do not').replace(/\bthat's\b/g, 'that is').replace(/\bit's\b/g, 'it is')
    .replace(/[.!?,;:“”"]/g, ' ').replace(/\s+/g, ' ').trim();
}
const patterns: Partial<Record<PacketGoal, RegExp>> = {
  greet: /\b(hello|hi|hey|hallo|hullo|good morning|good afternoon|good evening)\b/g,
  farewell: /\b(goodbye|bye|see you(?: later)?|take care|good night)\b/g,
  askName: /\b(?:what is your name|(?:can|could|would) you (?:please )?tell me your name)\b/g,
  meet: /\b(?:(?:nice|pleased|glad) to meet you(?: too)?|you too|same here)\b/g,
  unwell: /\b(?:(?:i am|i feel) )?not (?:very )?well\b/g,
  fine: /\b(?:(?:i am|i feel|i am feeling) )?(?:fine|good(?!\s+(?:morning|afternoon|evening|night))|well|great)\b/g,
  feeling: /\b(?:(?:i am|i feel|i am feeling) )?(?:ok|okay|tired|happy|sad|hungry)\b/g,
  askFeeling: /\b(?:and you|how (?:about|are) you|what about you)\b/g,
  thanks: /\b(?:thank you(?: very much| so much)?|thanks(?: a lot)?)\b/g,
  welcome: /\b(?:you are welcome|no problem|not at all|my pleasure|do not mention it)\b/g,
  sorry: /\b(?:(?:i am )?sorry|excuse me)\b/g,
  noProblem: /\b(?:no problem|that is (?:ok|okay|all right)|it is (?:ok|okay|all right)|never mind)\b/g,
  dontUnderstand: /\bi (?:do not|cannot|can't) understand\b/g,
  repeat: /\b(?:(?:could|can|would) you (?:please )?(?:say that again|repeat(?: that| it)?)(?: more slowly)?|again|please repeat(?: that| it)?|pardon)\b/g,
  slow: /\b(?:(?:could|can|would) you (?:please )?(?:repeat(?: that| it)?|speak|say (?:it|that))(?: more)? slowly|(?:please )?(?:more )?slowly)\b/g,
};
export interface PacketVerdict { status: 'correct' | 'partial' | 'wrong' | 'unknown'; criteria: { goal: string; passed: boolean }[]; message: string }
export function assessPacketAnswer(value: string, rule: PacketRule, voice = false): PacketVerdict {
  let input = normalizePacketAnswer(value);
  if (voice && rule.goals?.includes('farewell') && /^(by|buy)$/.test(input)) input = 'bye';
  const exact = rule.answers.some((answer) => normalizePacketAnswer(answer) === input);
  if (!rule.goals?.length) return { status: !input ? 'unknown' : exact ? 'correct' : 'wrong', criteria: [{ goal: 'Tapşırığın cavabı', passed: exact }], message: exact ? 'Düzdür.' : 'Cavab bu tapşırığın hədəfinə uyğun deyil.' };
  const found = new Set<PacketGoal>();
  // Find criteria independently so an early match cannot hide a later one.
  for (const [goal, pattern] of Object.entries(patterns)) if (new RegExp(pattern).test(input)) found.add(goal as PacketGoal);
  if (found.has('unwell') && !/\b(?:i am|i feel) (?:fine|good|well|great)\b/.test(input)) found.delete('fine');
  if (found.has('unwell') || found.has('fine')) found.add('feeling');
  if (/\bplease\b/.test(input) && (found.has('askName') || /\byour name\b/.test(input))) found.add('politeName');
  if (found.has('noProblem')) found.add('welcome');
  if (/\b(?:excuse me|sorry|hello|hi)\b/.test(input)) found.add('attention');
  if (/(başa düşm|anlamayıb|anlamadığı|anlamadı|eşitməyib|eşitmədiyi)/u.test(input)) found.add('reason');
  let rest = input;
  // Remove complete courtesy/context phrases before extracting the chosen name.
  for (const goal of ['dontUnderstand','politeName','slow','repeat','askName','askFeeling','unwell','fine','feeling','meet','thanks','welcome','noProblem','sorry','greet','farewell'] as PacketGoal[]) {
    const pattern = patterns[goal]; if (pattern) rest = rest.replace(pattern, ' ');
  }
  rest = rest.replace(/\byour name\b/g, ' ').replace(/\bplease\b/g, ' ').trim();
  const introduction = /^(?:i am|my name is) ([\p{L}][\p{L}'-]*(?: [\p{L}][\p{L}'-]*){0,2})$/u.exec(rest);
  const plausibleName = introduction && !/^(?:a |an |the |teacher$|student$|doctor$|engineer$)/.test(introduction[1]);
  if (plausibleName && (!rule.roleName || normalizePacketAnswer(rule.roleName) === introduction[1])) { found.add('introduce'); rest = ''; }
  if (rule.goals.length === 1 && ['greet','farewell','thanks'].includes(rule.goals[0]) && /^(ali|leyla|murad|birfox|aysel|nora|leo|mila|tom)$/.test(rest)) rest = '';
  const criteria = rule.goals.map((goal) => ({ goal: goalLabels[goal], passed: found.has(goal) }));
  const contradiction = found.has('greet') && found.has('farewell') || found.has('fine') && found.has('unwell');
  const all = criteria.every((c) => c.passed);
  const known = found.size > 0 || Boolean(introduction);
  const knownError = /\b(?:what is my name|my name (?:am|are)|i (?:is|are))\b/.test(input);
  const detected = exact && all ? 'correct' : contradiction || knownError ? 'wrong' : all && (!rest.trim() || rule.goals.includes('reason')) ? 'correct' : rest.trim() && !introduction ? 'unknown' : known ? 'partial' : 'unknown';
  // A submitted written answer is a language attempt, even when no pattern matches.
  // Only empty input or uncertain speech recognition remains unverified.
  const status = detected === 'unknown' && !voice && input ? 'wrong' : detected;
  return { status, criteria, message: status === 'correct' ? 'Cavab tapşırığa uyğundur.' : status === 'unknown' ? voice ? 'Səsli cavab dəqiq tanınmadı. Yenidən danış.' : 'Cavabını yaz.' : detected === 'unknown' ? 'Yazılışı və tapşırıqda istənən mənanı yoxla.' : `Bu hissəni tamamla: ${criteria.filter((c) => !c.passed).map((c) => c.goal).join(', ') || 'situasiyaya uyğun bir məna seç'}.` };
}
