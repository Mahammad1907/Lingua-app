import type { PacketGoal, PacketRule } from '../data/b1PacketTypes';
import { isSafeEnglishTypo, normalizeApostrophes } from './spelling';
import { typoConfusables } from '../data/typoConfusables';

export const goalLabels: Record<PacketGoal, string> = {
  greet: 'Salam vermək', farewell: 'Sağollaşmaq', introduce: 'Adını demək', askName: 'Ad soruşmaq', meet: 'Tanışlığa qarşılıq',
  feeling: 'Halını bildirmək', fine: 'Yaxşı olduğunu demək', unwell: 'Yaxşı olmadığını demək', askFeeling: 'Qarşı tərəfin halını soruşmaq',
  thanks: 'Təşəkkür etmək', welcome: 'Təşəkkürə cavab', sorry: 'Üzr istəmək', noProblem: 'Üzrü qəbul etmək', politeName: 'Adı nəzakətlə istəmək',
  attention: 'Diqqəti nəzakətlə çəkmək', dontUnderstand: 'Anlamadığını bildirmək', repeat: 'Təkrar istəmək', slow: 'Yavaş danışmağı istəmək', reason: 'Təkrarın səbəbini anlamaq',
};
export function normalizePacketAnswer(text: string): string {
  return normalizeApostrophes(text).toLowerCase().replace(/\u0307/g, '').replace(/[‘’]/g, "'")
    .replace(/\bi'm\b/g, 'i am').replace(/\bname's\b/g, 'name is').replace(/\bwhat's\b/g, 'what is')
    .replace(/\byou're\b/g, 'you are').replace(/\bdon't\b/g, 'do not').replace(/\bthat's\b/g, 'that is').replace(/\bit's\b/g, 'it is')
    .replace(/[.!?,;:“”"]/g, ' ').replace(/\s+/g, ' ').trim();
}
const patterns: Partial<Record<PacketGoal, RegExp>> = {
  greet: /\b(hello(?: there)?|hi(?: there)?|hey(?: there)?|hallo|hullo|good morning|good afternoon|good evening)\b/g,
  farewell: /\b(good ?bye|bye(?: bye)?|see you(?: later)?|take care|good night)\b/g,
  askName: /\b(?:what is your name|(?:can|could|would) you (?:please )?tell me your name)\b/g,
  meet: /\b(?:(?:nice|pleased|glad) to meet you(?: too)?|you too|same here)\b/g,
  unwell: /\b(?:(?:i am|i feel|i am feeling) )?(?:not (?:very )?(?:well|good|fine|great|ok|okay)|(?:very )?(?:sick|ill|unwell|bad))\b/g,
  fine: /\b(?:(?:i am|i feel|i am feeling) )?(?:very )?(?:fine|good(?!\s+(?:morning|afternoon|evening|night))|well|great|all right)\b/g,
  feeling: /\b(?:(?:i am|i feel|i am feeling) )?(?:(?:not|very|a bit) )?(?:ok|okay|tired|happy|sad|hungry|busy|bored|excited|angry|nervous|so so)\b/g,
  askFeeling: /\b(?:and you|how about you|how are you(?: doing| today)?|what about you)\b/g,
  thanks: /\b(?:thank you(?: very much| so much)?|thanks(?: a lot)?|many thanks)\b/g,
  welcome: /\b(?:you are welcome|no problem|not at all|my pleasure|do not mention it)\b/g,
  sorry: /\b(?:i am )?sorry\b/g,
  attention: /\bexcuse me\b/g,
  noProblem: /\b(?:no problem|that is (?:ok|okay|all right)|it is (?:ok|okay|all right)|never mind)\b/g,
  dontUnderstand: /\bi (?:do not|cannot|can't) understand\b/g,
  repeat: /\b(?:(?:could|can|would) you (?:please )?(?:say (?:that|it) again|repeat(?: that| it)?)(?: more slowly)?|(?:please )?say (?:that|it) again|(?:please )?repeat(?: that| it)?|again|pardon)\b/g,
  slow: /\b(?:(?:could|can|would) you (?:please )?(?:repeat(?: that| it)?|speak|say (?:it|that))(?: more)? (?:slowly|slower)|(?:please )?speak(?: more)? (?:slowly|slower)|(?:please )?(?:more )?slowly|slower|slow)\b/g,
};
export interface PacketVerdict { status: 'correct' | 'partial' | 'wrong' | 'unknown'; criteria: { goal: string; passed: boolean }[]; message: string }
function assessNormalizedAnswer(value: string, rule: PacketRule, voice = false): PacketVerdict {
  let input = normalizePacketAnswer(value);
  if (voice && rule.goals?.includes('farewell') && /^(by|buy)$/.test(input)) input = 'bye';
  const exact = rule.answers.some((answer) => normalizePacketAnswer(answer) === input);
  if (!rule.goals?.length || rule.exact) return { status: !input ? 'unknown' : exact ? 'correct' : voice ? 'unknown' : 'wrong', criteria: [{ goal: 'Tapşırığın cavabı', passed: exact }], message: exact ? 'Düzdür.' : 'Cavab bu tapşırığın hədəfinə uyğun deyil.' };
  const found = new Set<PacketGoal>();
  // Find criteria independently so an early match cannot hide a later one.
  for (const [goal, pattern] of Object.entries(patterns)) {
    const checked = goal === 'fine' ? input.replace(patterns.unwell!, ' ') : input;
    if (new RegExp(pattern).test(checked)) found.add(goal as PacketGoal);
  }
  // A full question and a short return question serve different task goals.
  const fullQuestion = rule.goals.length === 1 && rule.goals[0] === 'askFeeling' && rule.answers.length > 0 && rule.answers.every(a => /^how are you/.test(normalizePacketAnswer(a)));
  if (fullQuestion && !/\bhow are you(?: doing| today)?\b/.test(input)) found.delete('askFeeling');
  if (found.has('unwell') && !/\b(?:i am|i feel) (?:fine|good|well|great)\b/.test(input)) found.delete('fine');
  if (found.has('unwell') || found.has('fine')) found.add('feeling');
  if (/\bplease\b/.test(input) && (found.has('askName') || /\byour name\b/.test(input))) found.add('politeName');
  if (found.has('noProblem')) found.add('welcome');

  if (/(başa düşm|anlamayıb|anlamadığı|anlamadı|eşitməyib|eşitmədiyi)/u.test(input)) found.add('reason');
  let rest = input;
  // Remove complete courtesy/context phrases before extracting the chosen name.
  for (const goal of ['dontUnderstand','politeName','slow','repeat','askName','askFeeling','unwell','fine','feeling','meet','thanks','welcome','noProblem','sorry','attention','greet','farewell'] as PacketGoal[]) {
    const pattern = patterns[goal]; if (pattern) rest = rest.replace(pattern, ' ');
  }
  rest = rest.replace(/\byour name\b/g, ' ').replace(/\bplease\b/g, ' ').trim();
  const introduction = /^(?:i am|my name is) ([\p{L}][\p{L}'-]*(?: [\p{L}][\p{L}'-]*){0,2})$/u.exec(rest);
  const nonNames = new Set(('a an the from in at not very feeling teacher student doctor engineer software ' +
    'busy working bored married excited single divorced sleepy angry nervous thirsty unemployed retired italian azerbaijani english spanish french tired happy sad hungry ready here there years old living live sick fine good well ok okay').split(' '));
  const plausibleName = introduction && introduction[1].split(' ').every(part => !nonNames.has(part));
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

// Fuzz only written English spelling. Names, short grammar words and real-word
// substitutions stay exact; recognition uncertainty is never repaired this way.
export function assessPacketAnswer(value: string, rule: PacketRule, voice = false): PacketVerdict {
  const original = assessNormalizedAnswer(value, rule, voice);
  if (voice || original.status === 'correct' || !value.trim()) return original;
  const words = normalizePacketAnswer(value).split(' ');
  if (words.length > 40) return original;
  const targets = rule.exact || !rule.goals?.length
    ? [...new Set(rule.answers.flatMap(a => normalizePacketAnswer(a).split(' ')))]
    : Object.keys(typoConfusables);
  // In introduction tasks every chosen name is learner data, not spelling data.
  const nameStart = rule.goals?.includes('introduce') ? words.findIndex((w, i) =>
    w === 'am' && words[i - 1] === 'i' || w === 'is' && words[i - 1] === 'name' && words[i - 2] === 'my') : -1;
  let candidates = [''];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const protectedName = nameStart >= 0 && i > nameStart && !/^(what|how|and|nice|pleased|glad|hello|hi|hey)$/.test(word) &&
      !words.slice(nameStart + 1, i).some(w => /^(what|how|and|nice|pleased|glad|hello|hi|hey)$/.test(w));
    const alternatives = protectedName ? [] : targets.filter(target => isSafeEnglishTypo(word, target));
    candidates = candidates.flatMap(prefix => [word, ...alternatives].map(w => `${prefix} ${w}`.trim())).slice(0, 128);
  }
  for (const candidate of candidates.slice(1)) {
    const verdict = assessNormalizedAnswer(candidate, rule);
    if (verdict.status === 'correct') return { ...verdict, message: 'Məna düzdür. Kiçik yazı səhvi cavaba mane olmadı.' };
  }
  return original;
}
