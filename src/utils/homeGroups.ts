import manifest from '../data/b1GroupsV2.json';
import { getLessonById } from '../data/lessons';
import type { LessonAttempt } from './rewards';
export const homeGroups = manifest.groups;
export function buildHomeGroups(completedIds: readonly string[], attempts: Readonly<Record<string, LessonAttempt>>) {
  const completed = new Set(completedIds);
  return homeGroups.map(group => {
    const allIds = homeGroups.flatMap(g => g.lessonIds);
    const lessons = group.lessonIds.map(id => {
      const lesson = getLessonById(id);
      const draft = Object.values(attempts).find(a => a.lessonId === id && !a.finished);
      return { id, title: lesson?.titleAz ?? '', order: lesson?.order ?? 0,
        ready: Boolean(lesson), completed: completed.has(id),
        locked: !completed.has(id) && allIds.indexOf(id) > 0 && !completed.has(allIds[allIds.indexOf(id) - 1]),
        action: completed.has(id) ? 'Yenidən məşq et' : draft ? 'Davam et' : 'Başla' };
    });
    const count = lessons.filter(l => l.completed).length;
    return { ...group, lessons, count, percent: Math.round(count / lessons.length * 100) };
  });
}
export function resumeGroup(completed: readonly string[], attempts: Readonly<Record<string, LessonAttempt>>) {
  const ids = new Set(completed);
  const draft = Object.values(attempts).sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)).find(a => !a.finished && homeGroups.some(g => g.lessonIds.includes(a.lessonId)));
  return homeGroups.find(g => draft ? g.lessonIds.includes(draft.lessonId) : g.lessonIds.some(id => !ids.has(id)))?.id ?? homeGroups[6].id;
}
