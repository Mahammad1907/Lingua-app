import type { PacketCard } from '../data/b1PacketTypes';
export type LessonPictureId = 'P01' | 'P02' | 'P03' | 'P04' | 'P05' | 'P06' | 'P07-attention' | 'P07-apology' | 'P08' | 'P09';
// Explicit author-plan positions; never infer a picture from an accepted answer.
export function lessonPictures(order: number, card: Pick<PacketCard, 'number' | 'kind'>): LessonPictureId[] {
  if (order === 1 && card.number === 2) return ['P01'];
  if (order === 1 && [6,9].includes(card.number)) return ['P02'];
  if (order === 2 && [4,9].includes(card.number)) return ['P03'];
  if ([3,4].includes(order) && card.number === 4) return ['P04'];
  if ([5,6].includes(order) && card.number === 4) return ['P05'];
  if (order === 7 && card.number === 4) return ['P06'];
  if (order === 8 && card.number === 8) return ['P07-attention','P07-apology'];
  if (order === 9 && card.number === 4) return ['P07-apology'];
  if ([10,11].includes(order) && card.number === 4) return ['P08'];
  if (order === 12 && card.kind === 'voice') return ['P09'];
  return [];
}
