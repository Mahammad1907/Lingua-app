import type { Lesson } from '../data/types';
import type { LessonAttempt } from './rewards';

export type JourneyStatus = 'completed' | 'current' | 'available' | 'locked';
export type JourneyArtwork = 'greeting' | 'identity' | 'board' | 'dialogue' | 'questions' | 'headphones' | 'family' | 'backpack' | 'house' | 'clock' | 'guitar';
export interface JourneyLesson {
  lesson: Lesson;
  status: JourneyStatus;
  percent: number;
  artwork: JourneyArtwork;
}

export function clampPercent(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
}

function artworkFor(lesson: Lesson): JourneyArtwork {
  const title = `${lesson.titleAz} ${lesson.title}`.toLocaleLowerCase('az');
  if (lesson.focus === 'speaking' || /səsli söhbət|voice chat/.test(title)) return 'headphones';
  if (/salam|greeting/.test(title)) return 'greeting';
  if (/hal-əhval|dialog|söhbət/.test(title)) return 'dialogue';
  if (/cümlə|qrammatika|grammar|sentence/.test(title)) return 'board';
  if (/təqdim|şəxsi|introduc|personal/.test(title)) return 'identity';
  if (/ailə|family/.test(title)) return 'family';
  if (/ev |house|home/.test(`${title} `)) return 'house';
  if (/vaxt|rejim|time|routine/.test(title)) return 'clock';
  if (/maraq|bacarıq|hobb|abilit/.test(title)) return 'guitar';
  if (/əşya|sahiblik|belong/.test(title)) return 'backpack';
  return 'questions';
}

// Completion is distinct from answer accuracy. Never project LessonProgress.score
// onto this route: a fully completed lesson is 100%, even after corrected mistakes.
export function buildChapterJourney(
  lessons: readonly Lesson[],
  completedIds: readonly string[],
  attempts: Readonly<Record<string, LessonAttempt>>,
  placementPassed: boolean,
): JourneyLesson[] {
  const unique = lessons.filter((lesson, index) => lessons.findIndex((l) => l.id === lesson.id) === index);
  const completed = new Set(completedIds);
  const firstIncomplete = unique.findIndex((lesson) => !completed.has(lesson.id));
  return unique.map((lesson, index) => {
    const done = completed.has(lesson.id);
    const open = index === 0 || completed.has(unique[index - 1].id)
      || (placementPassed && lesson.isReview && lesson.reviewType === 'module_review');
    const status: JourneyStatus = done ? 'completed' : !open ? 'locked'
      : index === firstIncomplete ? 'current' : 'available';
    const latest = Object.values(attempts).filter((a) => a.lessonId === lesson.id).at(-1);
    const expected = [...new Set(latest?.expected ?? [])];
    const resolved = expected.filter((key) => latest?.tasks[key]?.resolved && !latest.tasks[key].skipped).length;
    // Until the actual completion transaction succeeds, do not claim 100%.
    const partial = expected.length ? Math.min(99, Math.floor(resolved / expected.length * 100)) : 0;
    return { lesson, status, percent: done ? 100 : status === 'locked' ? 0 : partial, artwork: artworkFor(lesson) };
  });
}

export interface RoutePoint { x: number; y: number; fraction: number }
// Measurements from the approved 654px-wide reference, converted to layout units.
// The native status bar/safe area is outside this content coordinate system.
export function chapterReferenceLayout(contentWidth: number) {
  const width = Math.max(220, Math.min(480, Number.isFinite(contentWidth) ? contentWidth : 345));
  const scale = width / 345;
  return {
    scale, badge: 88 * scale, heroHeight: 128 * scale, foxWidth: 168 * scale, foxHeight: 156 * scale,
    titleSize: Math.max(28, 32 * scale), titleLine: Math.max(34, 39 * scale), lessonSize: Math.max(12, 12.5 * scale),
    cardWidth: (artwork: JourneyArtwork, current: boolean) => Math.min(width - 8 * scale,
      (current || artwork === 'board' ? 328 : artwork === 'identity' ? 221 : artwork === 'headphones' ? 264 : artwork === 'dialogue' ? 240 : 244) * scale),
    gap: (current: boolean) => (current ? 36 : 28) * scale,
  };
}
// Equal-distance dots ensure 40% means 40% of the curve length, not of its x axis.
export function journeyRoute(width: number, height: number, fromRight: boolean, inset = 48, endInset = inset): RoutePoint[] {
  const safeWidth = Math.max(1, Number.isFinite(width) ? width : 1);
  const safeHeight = Math.max(1, Number.isFinite(height) ? height : 1);
  const edge = Math.min(Math.max(0, inset), safeWidth / 2);
  const endEdge = Math.min(Math.max(0, endInset), safeWidth / 2);
  const start = fromRight ? safeWidth - edge : edge;
  const end = fromRight ? endEdge : safeWidth - endEdge;
  const delta = end - start;
  const samples = Array.from({ length: 121 }, (_, i) => {
    const t = i / 120; const u = 1 - t;
    return {
      x: u ** 3 * start + 3 * u ** 2 * t * (start + delta * 0.12)
        + 3 * u * t ** 2 * (end - delta * 0.12) + t ** 3 * end,
      y: 3 * u ** 2 * t * safeHeight * 0.43 + 3 * u * t ** 2 * safeHeight * 0.57 + t ** 3 * safeHeight,
    };
  });
  const lengths = [0];
  for (let i = 1; i < samples.length; i++) lengths.push(lengths[i - 1]
    + Math.hypot(samples[i].x - samples[i - 1].x, samples[i].y - samples[i - 1].y));
  const length = lengths.at(-1)!;
  const count = Math.max(3, Math.ceil(length / 13));
  return Array.from({ length: count }, (_, i) => {
    const fraction = i / (count - 1); const target = fraction * length;
    const next = Math.max(1, lengths.findIndex((d) => d >= target));
    const before = next - 1;
    const local = (target - lengths[before]) / (lengths[next] - lengths[before] || 1);
    return { x: samples[before].x + (samples[next].x - samples[before].x) * local,
      y: samples[before].y + (samples[next].y - samples[before].y) * local, fraction };
  });
}
