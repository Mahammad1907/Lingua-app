import { useCallback, useEffect, useRef } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getPacketLesson } from '../../data/b1Course';
import { designLessons } from '../../data/designLessons';
import { TEST_OPEN_SECTIONS } from '../../config/testAccess';
import { getModuleById } from '../../data/modules';
import { useUserStore } from '../../store/userStore';
import type { HomeCourse } from '../../utils/homeCourse';
import { HomeDashboard as OriginalHomeDashboard } from './HomeDashboard';
import { useReviewStore } from '../../store/reviewStore';
import { useLastOpenedStore } from '../../store/lastOpenedStore';
import { registerFinishedLessons } from '../../data/reviewSession';
import { IslandHome, IslandNavigation, NAV_HEIGHT, type IslandLesson } from './IslandHome';
import type { LessonIconName } from './LessonIcon';
export { NAV_HEIGHT };

export { HOME_LANGUAGES } from './HomeDashboard';
export type HomeDestination = Destination;

type Destination = 'learn' | 'review' | 'rules' | 'chat' | 'vocabulary' | 'profile' | 'analysis';

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
  // The map opens at the section and lesson last opened (user, 21 Nov 2026); before any lesson was opened, at the
  // first unfinished section.
  const lastSection = useLastOpenedStore(s => s.section), lastLesson = useLastOpenedStore(s => s.lessonId);
  const rememberOpened = useLastOpenedStore(s => s.remember);
  useEffect(() => { void useLastOpenedStore.getState().load(); }, []);
  const current = (lastSection && sections.some(item => item.order === lastSection) ? lastSection : null)
    ?? sections.find(item => item.state === 'current')?.order ?? 1;
  const scrollRef = useRef<ScrollView>(null);
  // The map opens at the current lesson, also after coming back from a lesson (user, 20 Nov 2026):
  // top of the current section + the current lesson inside it, placed about a third down the screen.
  const { height: screenH } = useWindowDimensions();
  const sectionTop = useRef<Record<number, number>>({ 1: 0 });
  const activeY = useRef<Record<number, number>>({});
  const scrollToCurrent = useCallback(() => {
    const top = sectionTop.current[current], inside = activeY.current[current];
    if (top === undefined) return;
    const y = Math.max(0, top + (inside ?? 0) - (inside === undefined ? 0 : screenH * .35));
    setTimeout(() => scrollRef.current?.scrollTo({ y, animated: false }), 0);
  }, [current, screenH]);
  useFocusEffect(useCallback(() => { scrollToCurrent(); }, [scrollToCurrent]));
  if (language !== 'en' || level !== 'A1' || !sections.length) {
    return <OriginalHomeDashboard course={course} language={language} level={level} xp={xp}
      compact={compact} topInset={topInset} onSelect={onSelect} onOpen={onOpen} />;
  }
  // “~N dəq” on the map: about half a minute per card (an estimate from the lesson's own length).
  const minutesOf = (ids: string[]) => { const n = ids.reduce((a, id) => a + (designLessons.find(l => l.id === id)?.cards.length ?? 0), 0); return n ? Math.max(4, Math.round(n * .5)) : undefined; };
  const words = (id: string) => getPacketLesson(id)?.vocabulary.slice(0, 4).map(w => w.word).join(' · ') || undefined;
  const sectionProps = (module: typeof sections[number]) => {
    const ids = getModuleById(module.id)?.lessonIds ?? [];
    const unit = module.order;
    // A map lesson split in parts (same `number`) becomes one node with parts.
    const unitLessons = designLessons.filter(l => (l.unit ?? 1) === unit && !l.exam && ids.includes(l.id));
    const lessons: IslandLesson[] = unit === 1 ? ids.map((id, i) => ({ id, number: i + 1, title: SHORT_TITLES[id] ?? getPacketLesson(id)?.title ?? `Dərs ${i + 1}`, phrases: words(id), minutes: minutesOf([id]), icon: ICONS[id] }))
      : [...new Set(unitLessons.map(l => l.number ?? l.order))].map(n => {
        const parts = unitLessons.filter(l => (l.number ?? l.order) === n);
        return { id: parts[0].id, number: n, title: SHORT_TITLES[`u${unit}_${n}`] ?? parts[0].title,
          phrases: parts.map(p => words(p.id)).filter(Boolean).join(' · ') || undefined, minutes: minutesOf(parts.map(p => p.id)),
          parts: parts.length > 1 ? parts.map(p => ({ id: p.id, title: p.title })) : undefined, icon: ICONS[`u${unit}_${n}`] };
      });
    const examLesson = designLessons.find(l => l.exam && (l.unit ?? 1) === unit);
    const exam = examLesson ? { id: examLesson.id, percent: exams[examLesson.id]?.percent ?? null, passed: exams[examLesson.id]?.passed ?? false } : undefined;
    return { section: unit, sectionTitle: getModuleById(module.id)?.titleAz ?? module.title, lessons, completed, partial: partial ?? {},
      locked: module.state === 'locked' || module.state === 'planned', exam, allOpen: TEST_OPEN_SECTIONS.includes(unit),
      hasNext: sections.some(m => m.order > unit),
      focusId: unit === current ? lastLesson ?? undefined : undefined,
      onOpenLesson: (id: string) => { rememberOpened(unit, id); if (onLesson) onLesson(id); else onOpen(module.id); } };
  };
  const shared = { streak, xp, languageLabel: `${language.toUpperCase()} · ${level}`, topInset, bottomSpace,
    onSelectLanguage: onSelect, onAnalysis: () => onNavigate?.('analysis'), onReview: () => onNavigate?.('review') };
  // Daily review card: tasks due today in the 1 / 3 / 7 / 14 day schedule (lessons finished earlier enter it once).
  const hydrated = useReviewStore(s => s.hydrated);
  const reviewCount = useReviewStore(s => s.dueCount());
  useEffect(() => { void useReviewStore.getState().load(); }, []);
  useEffect(() => { if (hydrated) registerFinishedLessons(progress); }, [hydrated, progress]);
  const [first, ...rest] = sections;
  // Sticky unit header data (25 Nov 2026): title and progress of every section, shown for the one on screen.
  const sticky = sections.map(m => {
    const p = sectionProps(m);
    const done = p.lessons.filter(l => l.parts ? l.parts.every(x => completed.includes(x.id)) : completed.includes(l.id)).length;
    return { section: m.order, title: p.sectionTitle, done, count: p.lessons.length };
  });
  const placed = (order: number) => (y: number) => { activeY.current[order] = y; if (order === current) scrollToCurrent(); };
  const after = rest.map(m => <View key={m.id} onLayout={e => {
    sectionTop.current[m.order] = e.nativeEvent.layout.y; if (m.order === current) scrollToCurrent();
  }}><IslandHome {...shared} {...sectionProps(m)} review={{ count: reviewCount }} bare onActiveY={placed(m.order)} /></View>);
  return <IslandHome {...shared} {...sectionProps(first)} review={{ count: reviewCount }} after={after} scrollRef={scrollRef} onActiveY={placed(first.order)}
    sticky={sticky} sectionTops={sectionTop} />;
}

/** Short names on the island (Bölmə 1 map, docs/BOLME_1_XERITESI.md). */
const SHORT_TITLES: Record<string, string> = {
  a1_en_b1_v2_d1: 'Salam', a1_en_b1_v2_d2: 'Adın', a1_en_b1_v2_d3: 'Ad soruş', a1_en_b1_v2_d4: 'Necəsən?',
  a1_en_b1_v2_d5: 'Təşəkkür', a1_en_b1_v2_d6: 'Üzr', a1_en_b1_v2_d7: 'Başa düşmürəm', a1_en_b1_v2_d8: 'Bölmə söhbəti',
  // Bölmə 2 (docs/BOLME_2_XERITESI.md), keyed by map number.
  u2_1: 'Rəqəmlər', u2_2: 'Telefon', u2_3: 'Hərflər', u2_4: 'Hərf-hərf', u2_5: 'Ad, soyad', u2_6: 'E-poçt', u2_7: 'Yaş', u2_8: 'Qeydiyyat',
  // Bölmə 3 (docs/BOLME_3_XERITESI.md).
  u3_1: 'Haradansan?', u3_2: 'Ölkələr', u3_3: 'Millət', u3_4: 'Bəli / xeyr', u3_5: 'O haradandır?', u3_6: 'Yaşayırsan', u3_7: 'Dillər', u3_8: 'Dil klubu',
  u4_1: 'Bu kimdir?', u4_2: 'Ailə', u4_3: 'his və her', u4_4: 'Bu sənindir?', u4_5: 'Qardaşın var?', u4_6: 'Yaş', u4_7: 'Peşə', u4_8: 'Ailə söhbəti',
};

/** Map icons (25 Nov 2026), keyed like SHORT_TITLES. */
const ICONS: Record<string, LessonIconName> = {
  a1_en_b1_v2_d1: 'wave', a1_en_b1_v2_d2: 'nametag', a1_en_b1_v2_d3: 'askname', a1_en_b1_v2_d4: 'smile',
  a1_en_b1_v2_d5: 'thanks', a1_en_b1_v2_d6: 'sad', a1_en_b1_v2_d7: 'confused', a1_en_b1_v2_d8: 'chats',
  u2_1: 'digits', u2_2: 'phone', u2_3: 'letters', u2_4: 'spell', u2_5: 'idcard', u2_6: 'mail', u2_7: 'age', u2_8: 'form',
  u3_1: 'globe', u3_2: 'flag', u3_3: 'passport', u3_4: 'yesno', u3_5: 'pin', u3_6: 'home', u3_7: 'lang', u3_8: 'chats',
  u4_1: 'who', u4_2: 'family', u4_3: 'pair', u4_4: 'tag', u4_5: 'siblings', u4_6: 'age', u4_7: 'briefcase', u4_8: 'chats',
};

export function HomeNavigation({ bottomInset = 0, onNavigate }: {
  bottomInset?: number; onNavigate: (destination: Destination) => void;
}) {
  return <IslandNavigation bottomInset={bottomInset} onNavigate={onNavigate} />;
}
