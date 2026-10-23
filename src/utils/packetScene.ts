import type { PacketCard } from '../data/b1PacketTypes';

export type ReusableSceneId = 'conversation' | 'gratitude' | 'apology' | 'clarify' | 'farewell' | 'name-card' | 'feelings';

// Use topic illustrations sparingly. Assessed questions and mistake reviews keep
// the board: visual hints must not expose an answer before it is submitted.
export function packetScene(order: number, card: Pick<PacketCard, 'kind' | 'number'>, reviewing = false): ReusableSceneId | undefined {
  if (reviewing || !['intro', 'teach'].includes(card.kind)) return undefined;
  if (card.kind === 'intro') {
    if ([1, 3, 4].includes(order)) return 'conversation';
    if (order === 6) return 'clarify';
  }
  if (card.kind === 'teach') {
    if (order === 1 && card.number === 2) return 'conversation';
    if (order === 1 && card.number === 7) return 'farewell';
    if ([2, 3].includes(order) && card.number === 4) return 'name-card';
    if (order === 4 && [5, 14].includes(card.number)) return 'feelings';
  }
  if (card.kind === 'teach' && order === 5) {
    if (card.number === 4) return 'gratitude';
    if (card.number === 14) return 'apology';
  }
  if (card.kind === 'teach' && order === 6 && card.number === 13) return 'clarify';
  return undefined;
}
