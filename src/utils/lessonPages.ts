export interface LessonBlockBounds { y: number; height: number }

// Prefer a boundary between elements. Oversized accessible text gets overlapping
// pages so a line crossing the boundary is always readable on the next page.
export function lessonPages(content: number, viewport: number, blocks: readonly LessonBlockBounds[]): number[] {
  if (viewport <= 0 || content <= viewport + 1) return [0];
  const pages = [0];
  const limit = Math.max(40, viewport);
  const step = Math.max(24, limit - 40);
  while (pages.at(-1)! + limit < content - 1 && pages.length < 500) {
    const start = pages.at(-1)!;
    const boundary = blocks.filter(b => b.y > start + 40 && b.y <= start + limit && b.y + b.height > start + limit).at(-1)?.y;
    const next = Math.min(content - limit, boundary ?? start + step);
    if (next <= start + 1) break;
    pages.push(next);
  }
  return pages;
}
