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
  const normalize = (s: string) => s.toLowerCase().replace(/[‘’]/g, "'").replace(/[.!?]/g, '').replace(/\s+/g, ' ').trim();
  const authored = Object.entries(packet.audioMeanings || {}).find(([text]) => normalize(text) === normalize(audio));
  if (authored) return `${audio} — ${authored[1]}`;
  const entry = packet.vocabulary.find(v => normalize(v.word) === normalize(audio));
  return entry ? `${audio} — ${entry.translation}` : null;
}
export function heroHeight(available: number, dense: boolean, keyboard: boolean, fontScale: number): number {
  if (keyboard || fontScale > 1.35) return 0;
  return Math.max(110, Math.min(dense ? 215 : 260, available * (dense ? .27 : .32)));
}

// Spend the remaining entry viewport on artwork, rather than leaving a fixed empty gap.
export function welcomeSceneHeight(viewport: number, heading: number, objectives: number): number {
  return Math.max(140, Math.min(280, (viewport || 590) - heading - objectives - 70));
}

// Non-artwork is measured at the current width/font scale. Decoration yields first.
export function fitLessonArtwork(viewport: number, body: number, desired: number, reserved = 68): number {
  if (!viewport || !body) return 0;
  const remaining = viewport - body - reserved;
  // A very thin classroom or cropped wave is less useful than room for the answer.
  return remaining < Math.min(desired, 120) ? 0 : Math.max(0, Math.min(desired, remaining));
}
