import { lessons } from '../data/lessons';
import { getAllModules, getModuleById } from '../data/modules';
import { getPlacementTestByModuleId } from '../data/placementTests';
import type { PlacementResult } from '../data/types';
export function moduleHasContent(id: string): boolean {
  const m = getModuleById(id);
  return Boolean(m?.lessonIds.length && m.lessonIds.every((key) => lessons.some((l) => l.id === key)));
}
export function moduleUnlocked(id: string, completed: readonly string[], results: readonly PlacementResult[]): boolean {
  const m = getModuleById(id);
  if (!m || !moduleHasContent(id)) return false;
  if (results.some((r) => r.moduleId === id && r.passed)) return true;
  return getAllModules().filter((p) => p.language === m.language && p.level === m.level && p.order < m.order)
    .every((p) => moduleHasContent(p.id) && p.lessonIds.every((key) => completed.includes(key)));
}
// Each test opens its own module, without completing prerequisites or opening successors.
export function moduleTest(id: string) {
  if (!moduleHasContent(id)) return undefined;
  const m = getModuleById(id)!; const t = getPlacementTestByModuleId(id);
  return t && t.language === m.language && t.level === m.level && t.questions.length
    && t.questions.every((q) => q.correctAnswer?.trim()) ? t : undefined;
}
