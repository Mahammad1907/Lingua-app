import type { PacketCard, PacketLesson } from '../data/b1PacketTypes';

export function lessonMode(card: PacketCard): string {
  if (card.kind === 'intro') return 'BAŞLAMAZDAN ƏVVƏL';
  if (card.kind === 'teach') return 'ÖYRƏN';
  if (card.kind === 'result') return 'DƏRSİN NƏTİCƏSİ';
  if (card.kind === 'voice') return 'DANIŞIQ';
  if (card.audio) return 'DİNLƏMƏ';
  if (card.options) return 'DÜZGÜN CAVABI SEÇ';
  if (card.words) return 'CÜMLƏ QUR';
  return 'YAZI MƏŞQİ';
}
// Translation is looked up, never guessed from a selected answer. Hide until graded.
export function audioMeaning(packet: PacketLesson, audio: string | undefined): string | null {
  if (!audio) return null;
  const normalize = (s: string) => s.toLowerCase().replace(/[.!?]/g, '').trim();
  const entry = packet.vocabulary.find(v => normalize(v.word) === normalize(audio));
  return entry ? `${audio} — ${entry.translation}` : null;
}
export function heroHeight(available: number, dense: boolean, keyboard: boolean, fontScale: number): number {
  if (keyboard || fontScale > 1.35) return 0;
  return Math.max(110, Math.min(dense ? 150 : 260, available * (dense ? .19 : .32)));
}
