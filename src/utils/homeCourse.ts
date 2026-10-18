import type { Module, PlacementResult } from '../data/types';
export type HomeArtworkKey = 'fox' | 'identity' | 'family' | 'backpack' | 'house' | 'clock' | 'guitar' | 'headphones';
export type HomeModuleState = 'current' | 'completed' | 'available' | 'locked' | 'planned';
export interface HomeModuleItem {
  id: string; title: string; order: number; artwork: HomeArtworkKey; state: HomeModuleState;
  completedCount: number; lessonsCount: number; percent: number;
  examPercent: number | null; examPassed: boolean;
}
export interface HomeCourse { items: HomeModuleItem[]; completedCount: number; lessonsCount: number; percent: number }
// Display-only future cards. They never create lessons or award completion.
const EN_A1_OUTLINE: { order: number; title: string; artwork: HomeArtworkKey }[] = [
  { order: 1, title: 'İlk tanışlıq', artwork: 'fox' },
  { order: 2, title: 'Şəxsi məlumatlar', artwork: 'identity' },
  { order: 3, title: 'Ailə və yaxın insanlar', artwork: 'family' },
  { order: 4, title: 'Əşyalar və sahiblik', artwork: 'backpack' },
  { order: 5, title: 'Ev və əşyaların yeri', artwork: 'house' },
  { order: 6, title: 'Gündəlik rejim və vaxt', artwork: 'clock' },
  { order: 7, title: 'Maraqlar və bacarıqlar', artwork: 'guitar' },
];
export function boundedPercent(part: number, total: number): number {
  if (!Number.isFinite(part) || !Number.isFinite(total) || total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((part / total) * 100)));
}
export function buildHomeCourse(input: {
  modules: readonly Module[]; language: string; level: string; completedLessons: readonly string[];
  availableLessonIds: ReadonlySet<string>; placementResults: readonly PlacementResult[];
}): HomeCourse {
  const modules = input.modules.filter((m) => m.language === input.language && m.level === input.level)
    .slice().sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  const completed = new Set(input.completedLessons);
  const records = modules.map((module) => {
    const ids = [...new Set(module.lessonIds)];
    const validIds = ids.filter((id) => input.availableLessonIds.has(id));
    const count = validIds.filter((id) => completed.has(id)).length;
    const available = ids.length > 0 && validIds.length === ids.length;
    const done = available && count === ids.length;
    const exam = input.placementResults.find((p) => p.moduleId === module.id);
    return { module, ids, count, available, done, passed: exam?.passed === true,
      examPercent: exam && exam.totalCount > 0 ? boundedPercent(exam.correctCount, exam.totalCount) : null };
  });
  const unlocked = records.map((r, i) => r.available && records.slice(0, i).every((p) => p.done || p.passed));
  let current = records.findIndex((r, i) => unlocked[i] && !r.done && !r.passed);
  if (current < 0) current = records.findIndex((r, i) => unlocked[i] && !r.done);
  const items: HomeModuleItem[] = records.map((r, i) => ({
    id: r.module.id, title: r.module.titleAz, order: r.module.order,
    artwork: input.language === 'en' && input.level === 'A1'
      ? EN_A1_OUTLINE.find((p) => p.order === r.module.order)?.artwork ?? 'headphones' : 'headphones',
    state: !r.available ? 'planned' : r.done ? 'completed' : !unlocked[i] ? 'locked' : i === current ? 'current' : 'available',
    completedCount: r.count, lessonsCount: r.ids.length,
    percent: boundedPercent(r.count, r.ids.length), examPercent: r.examPercent, examPassed: r.passed,
  }));
  if (input.language === 'en' && input.level === 'A1') {
    for (const future of EN_A1_OUTLINE) if (!records.some((r) => r.module.order === future.order)) items.push({
      id: `upcoming_en_A1_${future.order}`, ...future, state: 'planned', completedCount: 0,
      lessonsCount: 0, percent: 0, examPercent: null, examPassed: false,
    });
  }
  items.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  const allIds = new Set(records.flatMap((r) => r.ids));
  const completedCount = [...allIds].filter((id) => input.availableLessonIds.has(id) && completed.has(id)).length;
  return { items, completedCount, lessonsCount: allIds.size, percent: boundedPercent(completedCount, allIds.size) };
}
