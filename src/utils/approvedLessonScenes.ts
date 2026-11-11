import type { PacketCard } from '../data/b1PacketTypes';
export const approvedSceneIds = ['toy-park', 'toy-farewell', 'toy-entrance', 'toy-introduction', 'toy-ask-name', 'toy-feeling-good', 'toy-feeling-okay', 'toy-feeling-unwell', 'toy-gratitude', 'toy-apology', 'toy-clarify'] as const;
export type ApprovedSceneId = typeof approvedSceneIds[number];
export const approvedSceneLabels: Record<ApprovedSceneId, string> = {
  'toy-park': 'Leyla və Əli parkda görüşür', 'toy-farewell': 'Əli Leylagildən ayrılır',
  'toy-entrance': 'Leyla Əlini binanın girişində qarşılayır', 'toy-introduction': 'Leyla özünü təqdim edir',
  'toy-ask-name': 'Əli Leylanın adını soruşur', 'toy-feeling-good': 'Leyla özünü yaxşı hiss edir',
  'toy-feeling-okay': 'Əli özünü normal hiss edir', 'toy-feeling-unwell': 'Əli özünü yaxşı hiss etmir',
  'toy-gratitude': 'Əli Leylanın dəftərini geri qaytarır', 'toy-apology': 'Əli kiçik səhvə görə üzr istəyir',
  'toy-clarify': 'Əli deyiləni daha aydın eşitmək istəyir',
};
// Presentation bindings for already-authored situations. They do not edit the packet or its rules.
const placements: Record<string, readonly ApprovedSceneId[]> = {
  a1_en_b1_v2_d1_c05: ['toy-entrance'], a1_en_b1_v2_d1_c09: ['toy-farewell'],
  a1_en_b1_v2_d2_c04: ['toy-introduction'], a1_en_b1_v2_d2_c15: ['toy-park'],
  a1_en_b1_v2_d3_c04: ['toy-ask-name'], a1_en_b1_v2_d3_c11: ['toy-ask-name'], a1_en_b1_v2_d3_c13: ['toy-park'],
  a1_en_b1_v2_d4_c05: ['toy-feeling-good'], a1_en_b1_v2_d4_c14: ['toy-feeling-okay', 'toy-feeling-unwell'],
  a1_en_b1_v2_d5_c04: ['toy-gratitude'], a1_en_b1_v2_d5_c07: ['toy-gratitude'],
  a1_en_b1_v2_d5_c14: ['toy-apology'], a1_en_b1_v2_d5_c17: ['toy-apology'],
  a1_en_b1_v2_d6_c04: ['toy-clarify'], a1_en_b1_v2_d6_c11: ['toy-clarify'],
};
export function approvedScenesForCard(card: PacketCard, reviewing = false): readonly ApprovedSceneId[] {
  // No scene can answer an independent listening/choice question, or reuse a stale review context.
  if (reviewing || !['teach', 'task'].includes(card.kind) || card.audio || card.turns?.length || card.options || card.words || card.messages || card.objectWord) return [];
  return placements[card.id] || [];
}
export function buildApprovedScenePlan(cards: readonly PacketCard[]): (readonly ApprovedSceneId[])[] {
  let previous: readonly ApprovedSceneId[] = [];
  return cards.map(card => {
    const selected = approvedScenesForCard(card).filter(id => !previous.includes(id));
    previous = selected;
    return selected;
  });
}
