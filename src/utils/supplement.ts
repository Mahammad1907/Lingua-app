import type { PacketRule } from '../data/b1PacketTypes';
import { assessPacketAnswer, goalLabels, type PacketVerdict } from './packetAnswer';
export interface SupplementCard { id: string; number: number; title: string; kind: 'read'|'task'|'voice'; body: string; rule?: PacketRule; options?: string[]; audio?: string; meaning?: string; rate?: number; after?: { id: string; goals: string[] }; review?: SupplementCard; reviewTarget?: {lesson: number; number: number; suffix?:string} }
export interface SupplementPlan { title: string; cards: SupplementCard[]; exam?: boolean; source: string; requiresAllLessons?: boolean }
export interface SupplementResponse { value: string; verdict: PacketVerdict; spoken: boolean; helped: boolean; heard: boolean; technical: boolean; status: 'independent'|'assisted'|'needsPractice'|'unverified'; }
export interface SupplementAttempt { version: 2; index: number; responses: Record<string, SupplementResponse>; completed: boolean; }
export function assessSupplement(card: SupplementCard, value: string, options: {spoken:boolean; helped:boolean; heard:boolean; technical?:boolean; skipped?:boolean}): SupplementResponse {
  const verdict:PacketVerdict = options.skipped || options.technical || card.kind==='voice' && !options.spoken
    ? {status:'unknown',criteria:[],message:'Yoxlanmadı.'} : assessPacketAnswer(value,card.rule || {answers:[]},options.spoken);
  const valid = verdict.status==='correct' && (!card.audio || options.heard || options.helped);
  return {value, verdict, ...options, technical:Boolean(options.technical), status: verdict.status==='unknown' ? 'unverified' : valid ? options.helped ? 'assisted' : 'independent' : 'needsPractice'};
}
export function followUpAvailable(card: SupplementCard, responses: Record<string,SupplementResponse>) {
  if(!card.after)return true;
  const previous=responses[card.after.id];
  return Boolean(previous && !previous.technical && previous.verdict.status!=='unknown' && card.after.goals.every(g=>previous.verdict.criteria.some(c=>c.goal===(goalLabels[g as keyof typeof goalLabels]||g)&&c.passed)));
}
export function supplementalFlow(plan:SupplementPlan,responses:Record<string,SupplementResponse>):SupplementCard[]{return plan.exam?plan.cards:[...plan.cards,...plan.cards.filter(c=>responses[c.id]?.status==='needsPractice'&&c.review).map(c=>({...c.review!,id:`${c.id}:review`}))];}
export function validateSupplementDraft(value: unknown, plan: SupplementPlan): SupplementAttempt | undefined {
  if(!value || typeof value!=='object')return;
  const draft=value as SupplementAttempt;
  if(draft.version!==2||!Number.isInteger(draft.index)||draft.index<0||!draft.responses||typeof draft.responses!=='object')return;
  const cards=supplementalFlow(plan,draft.responses);if(draft.index>cards.length)return;
  const validIds=new Set(cards.map(c=>c.id));
  for(const [id,r] of Object.entries(draft.responses))if(!validIds.has(id)||!r||typeof r.value!=='string'||!r.verdict||!Array.isArray(r.verdict.criteria))return;
  // Finishing needs a response for every assessed stage; read cards need none.
  if(cards.slice(0,draft.index).some(c=>c.kind!=='read'&&!draft.responses[c.id]))return;
  return {...draft,completed:draft.index===cards.length};
}
