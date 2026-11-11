import type { Module, TopicGroup } from '../data/types';
/** Never infer seven groups from seven lessons. Only explicit author metadata is accepted. */
export function validateTopicGroups(module: Module): TopicGroup[] | undefined {
  if (!module.topicGroups) return undefined;
  const groups = module.topicGroups;
  const lessons = groups.flatMap(group => group.lessonIds);
  if (groups.length !== 7 || new Set(groups.map(g => g.id)).size !== 7 || groups.some(g => !g.id.trim() || !g.title.trim() || !g.lessonIds.length) || new Set(lessons).size !== lessons.length || lessons.length !== module.lessonIds.length || module.lessonIds.some(id => !lessons.includes(id))) throw new Error('Bölmənin 7 mövzu qrupu və dərs bölgüsü tam deyil.');
  return groups;
}
