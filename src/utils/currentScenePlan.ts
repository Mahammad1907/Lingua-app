import type { PacketCard } from '../data/b1PacketTypes';
export type CurrentScene = 'greeting' | 'farewell' | 'name' | 'meeting' | 'feelings' | 'thanks' | 'attention' | 'apology' | 'repeat' | 'conversation';
// Explicit author-context mapping. Never decorate an assessed listening/writing
// card, and never infer a scene from an answer key.
export function currentTeachingScene(order: number, card: Pick<PacketCard, 'kind' | 'number'>): CurrentScene | undefined {
  if (card.kind !== 'teach') return;
  const positions: Record<string, CurrentScene> = {
    '1:2': 'greeting', '1:6': 'farewell', '2:4': 'name', '2:9': 'name',
    '3:4': 'meeting', '4:4': 'meeting', '6:4': 'feelings', '7:4': 'thanks',
    '8:8': 'attention', '9:4': 'apology', '9:5': 'apology', '10:4': 'repeat',
    '10:8': 'repeat', '11:4': 'repeat', '12:4': 'conversation',
  };
  return positions[`${order}:${card.number}`];
}
export function currentDialogueScene(order: number): CurrentScene {
  return ({ 1: 'greeting', 2: 'name', 3: 'meeting', 4: 'meeting', 5: 'conversation', 6: 'feelings', 7: 'thanks', 8: 'attention', 9: 'apology', 10: 'repeat', 11: 'repeat', 12: 'conversation' } as Record<number, CurrentScene>)[order] || 'conversation';
}
