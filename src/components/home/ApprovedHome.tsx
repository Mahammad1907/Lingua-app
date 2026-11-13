import { getPacketLesson } from '../../data/b1Course';
import { getModuleById } from '../../data/modules';
import { useUserStore } from '../../store/userStore';
import type { HomeCourse } from '../../utils/homeCourse';
import { HomeDashboard as OriginalHomeDashboard } from './HomeDashboard';
import { IslandHome, IslandNavigation } from './IslandHome';

export { HOME_LANGUAGES } from './HomeDashboard';
export type { HomeDestination } from './HomeDashboard';

type Destination = 'learn' | 'review' | 'vocabulary' | 'profile';

// The English A1 first section is shown as the island (docs/LAYIHE_DEFTERI.md, items 46–47).
// Other selections keep the original real-data home instead of faking sections.
export function HomeDashboard({ course, language, level, xp, compact = false, topInset = 0, onSelect, onOpen, onNavigate, onLesson }: {
  course: HomeCourse; language: string; level: string; xp: number; compact?: boolean; topInset?: number;
  onSelect: () => void; onOpen: (id: string) => void; onNavigate?: (destination: Destination) => void; onLesson?: (id: string) => void;
}) {
  const streak = useUserStore(s => s.streak);
  const completed = useUserStore(s => s.completedLessons);
  const module = course.items.find(item => item.order === 1 && item.lessonsCount > 0);
  const preview = course.items.find(item => item.order === 2);
  if (language !== 'en' || level !== 'A1' || !module) {
    return <OriginalHomeDashboard course={course} language={language} level={level} xp={xp}
      compact={compact} topInset={topInset} onSelect={onSelect} onOpen={onOpen} />;
  }

  const ids = getModuleById(module.id)?.lessonIds ?? [];
  const moduleLocked = module.state === 'locked' || module.state === 'planned';
  const lessons = ids.map((id, i) => ({ id, number: i + 1, title: SHORT_TITLES[id] ?? getPacketLesson(id)?.title ?? `Dərs ${i + 1}` }));
  return <IslandHome section={module.order} sectionTitle={getModuleById(module.id)?.titleAz ?? module.title} lessons={lessons} completed={completed}
    locked={moduleLocked} streak={streak} xp={xp} languageLabel={`${language.toUpperCase()} · ${level}`} topInset={topInset}
    nextSection={preview ? { title: preview.title, available: preview.state !== 'planned' && preview.state !== 'locked' } : undefined}
    onSelectLanguage={onSelect} onOpenLesson={id => onLesson ? onLesson(id) : onOpen(module.id)} onAnalysis={() => onNavigate?.('profile')}
    onChat={() => onOpen(module.id)} onNextSection={() => preview && onOpen(preview.id)} />;
}

/** Short names on the island (Bölmə 1 map, docs/BOLME_1_XERITESI.md). */
const SHORT_TITLES: Record<string, string> = {
  a1_en_b1_v2_d1: 'Salam', a1_en_b1_v2_d2: 'Adın', a1_en_b1_v2_d3: 'Ad soruş', a1_en_b1_v2_d4: 'Necəsən?',
  a1_en_b1_v2_d5: 'Təşəkkür', a1_en_b1_v2_d6: 'Üzr', a1_en_b1_v2_d7: 'Başa düşmədim', a1_en_b1_v2_d8: 'Bölmə söhbəti',
};

export function HomeNavigation({ bottomInset = 0, onNavigate }: {
  bottomInset?: number; onNavigate: (destination: Destination) => void;
}) {
  return <IslandNavigation bottomInset={bottomInset} onNavigate={onNavigate} />;
}
