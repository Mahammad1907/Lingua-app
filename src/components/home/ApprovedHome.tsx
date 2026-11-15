import { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { getPacketLesson } from '../../data/b1Course';
import { designLessons } from '../../data/designLessons';
import { TEST_OPEN_SECTIONS } from '../../config/testAccess';
import { getModuleById } from '../../data/modules';
import { useUserStore } from '../../store/userStore';
import type { HomeCourse } from '../../utils/homeCourse';
import { HomeDashboard as OriginalHomeDashboard } from './HomeDashboard';
import { hardPhrases } from '../../utils/progressInsights';
import { IslandHome, IslandNavigation, NAV_HEIGHT } from './IslandHome';
export { NAV_HEIGHT };

export { HOME_LANGUAGES } from './HomeDashboard';
export type HomeDestination = Destination;

type Destination = 'learn' | 'review' | 'chat' | 'vocabulary' | 'profile' | 'analysis';

// The English A1 first section is shown as the island (docs/LAYIHE_DEFTERI.md, items 46–47).
// Other selections keep the original real-data home instead of faking sections.
export function HomeDashboard({ course, language, level, xp, compact = false, topInset = 0, bottomSpace = 90, onSelect, onOpen, onNavigate, onLesson }: {
  course: HomeCourse; language: string; level: string; xp: number; compact?: boolean; topInset?: number; bottomSpace?: number;
  onSelect: () => void; onOpen: (id: string) => void; onNavigate?: (destination: Destination) => void; onLesson?: (id: string) => void;
}) {
  const streak = useUserStore(s => s.streak);
  const partial = useUserStore(s => s.lessonPartial);
  const progress = useUserStore(s => s.lessonProgress);
  const completed = useUserStore(s => s.completedLessons);
  const exams = useUserStore(s => s.sectionExams) ?? {};
  // All sections with lessons are stacked on one scrolling page; it opens at the learner's current section (15 Nov 2026).
  const sections = course.items.filter(item => item.lessonsCount > 0);
  const current = sections.find(item => item.state === 'current')?.order ?? 1;
  const scrollRef = useRef<ScrollView>(null);
  const scrolled = useRef(false);
  if (language !== 'en' || level !== 'A1' || !sections.length) {
    return <OriginalHomeDashboard course={course} language={language} level={level} xp={xp}
      compact={compact} topInset={topInset} onSelect={onSelect} onOpen={onOpen} />;
  }
  const words = (id: string) => getPacketLesson(id)?.vocabulary.slice(0, 4).map(w => w.word).join(' · ') || undefined;
  const sectionProps = (module: typeof sections[number]) => {
    const ids = getModuleById(module.id)?.lessonIds ?? [];
    const unit = module.order;
    // A map lesson split in parts (same `number`) becomes one node with parts.
    const unitLessons = designLessons.filter(l => (l.unit ?? 1) === unit && !l.exam && ids.includes(l.id));
    const lessons = unit === 1 ? ids.map((id, i) => ({ id, number: i + 1, title: SHORT_TITLES[id] ?? getPacketLesson(id)?.title ?? `Dərs ${i + 1}`, phrases: words(id) }))
      : [...new Set(unitLessons.map(l => l.number ?? l.order))].map(n => {
        const parts = unitLessons.filter(l => (l.number ?? l.order) === n);
        return { id: parts[0].id, number: n, title: SHORT_TITLES[`u${unit}_${n}`] ?? parts[0].title,
          phrases: parts.map(p => words(p.id)).filter(Boolean).join(' · ') || undefined,
          parts: parts.length > 1 ? parts.map(p => ({ id: p.id, title: p.title })) : undefined };
      });
    const examLesson = designLessons.find(l => l.exam && (l.unit ?? 1) === unit);
    const exam = examLesson ? { id: examLesson.id, percent: exams[examLesson.id]?.percent ?? null, passed: exams[examLesson.id]?.passed ?? false } : undefined;
    return { section: unit, sectionTitle: getModuleById(module.id)?.titleAz ?? module.title, lessons, completed, partial: partial ?? {},
      locked: module.state === 'locked' || module.state === 'planned', exam, allOpen: TEST_OPEN_SECTIONS.includes(unit),
      onOpenLesson: (id: string) => onLesson ? onLesson(id) : onOpen(module.id) };
  };
  const shared = { streak, xp, languageLabel: `${language.toUpperCase()} · ${level}`, topInset, bottomSpace,
    onSelectLanguage: onSelect, onAnalysis: () => onNavigate?.('analysis'), onReview: () => onNavigate?.('review') };
  const reviewCount = hardPhrases(progress.filter(p => p.completed) as Parameters<typeof hardPhrases>[0]).length;
  const [first, ...rest] = sections;
  const after = rest.map(m => <View key={m.id} onLayout={e => {
    if (m.order !== current || scrolled.current) return;
    scrolled.current = true; const y = e.nativeEvent.layout.y; setTimeout(() => scrollRef.current?.scrollTo({ y, animated: false }), 0);
  }}><IslandHome {...shared} {...sectionProps(m)} review={{ count: reviewCount }} bare /></View>);
  return <IslandHome {...shared} {...sectionProps(first)} review={{ count: reviewCount }} after={after} scrollRef={scrollRef} />;
}

/** Short names on the island (Bölmə 1 map, docs/BOLME_1_XERITESI.md). */
const SHORT_TITLES: Record<string, string> = {
  a1_en_b1_v2_d1: 'Salam', a1_en_b1_v2_d2: 'Adın', a1_en_b1_v2_d3: 'Ad soruş', a1_en_b1_v2_d4: 'Necəsən?',
  a1_en_b1_v2_d5: 'Təşəkkür', a1_en_b1_v2_d6: 'Üzr', a1_en_b1_v2_d7: 'Başa düşmürəm', a1_en_b1_v2_d8: 'Bölmə söhbəti',
  // Bölmə 2 (docs/BOLME_2_XERITESI.md), keyed by map number.
  u2_1: 'Rəqəmlər', u2_2: 'Telefon', u2_3: 'Hərflər', u2_4: 'Hərf-hərf', u2_5: 'Ad, soyad', u2_6: 'E-poçt', u2_7: 'Yaş', u2_8: 'Qeydiyyat',
  // Bölmə 3 (docs/BOLME_3_XERITESI.md).
  u3_1: 'Haradansan?', u3_2: 'Ölkələr', u3_3: 'Millət', u3_4: 'Sən …-dansan?', u3_5: 'O haradandır?', u3_6: 'Yaşayırsan', u3_7: 'Dillər', u3_8: 'Dil klubu',
};

export function HomeNavigation({ bottomInset = 0, onNavigate }: {
  bottomInset?: number; onNavigate: (destination: Destination) => void;
}) {
  return <IslandNavigation bottomInset={bottomInset} onNavigate={onNavigate} />;
}
