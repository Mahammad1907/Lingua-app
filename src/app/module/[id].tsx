import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChapterJourney from '../../components/chapter/ChapterJourney';
import EnergyMeter from '../../components/EnergyMeter';
import { getLessonById } from '../../data/lessons';
import { getShortSession } from '../../data/firstConversation';
import { getModuleById } from '../../data/modules';
import type { Lesson } from '../../data/types';
import { useUserStore } from '../../store/userStore';
import { buildChapterJourney } from '../../utils/chapterJourney';
import { moduleUnlocked } from '../../utils/moduleAccess';

export default function ModuleScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const moduleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [focused, setFocused] = useState(false);
  useFocusEffect(useCallback(() => {
    setFocused(true);
    return () => setFocused(false);
  }, []));
  const moduleData = getModuleById(moduleId || '');
  const completed = useUserStore((s) => s.completedLessons);
  const placementResults = useUserStore((s) => s.placementResults);
  const attempts = useUserStore((s) => s.attempts);
  const placementPassed = placementResults.some((r) => r.moduleId === moduleId && r.passed);
  const lessons = useMemo(() => (moduleData?.lessonIds ?? [])
    .map(getLessonById).filter((lesson): lesson is Lesson => Boolean(lesson)), [moduleData]);
  const items = useMemo(() => buildChapterJourney(lessons, completed, attempts, placementPassed),
    [lessons, completed, attempts, placementPassed]);
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/'); };

  if (!moduleData || !moduleUnlocked(moduleData.id, completed, placementResults)) {
    return <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={s.error}>
        <Text style={s.title}>{moduleData ? 'Bölmə kilidlidir' : 'Bölmə tapılmadı'}</Text>
        <Pressable accessibilityRole="button" onPress={back} style={s.back}><Text style={s.backText}>Geri qayıt</Text></Pressable>
      </View>
    </>;
  }
  const openLesson = (id: string) => {
    // Recheck availability at the boundary; never navigate from a stale locked card.
    if (!items.some((item) => item.lesson.id === id && item.status !== 'locked')) return;
    if (getShortSession(id)) router.push({ pathname: '/lesson/session', params: { id } });
    else router.push({ pathname: '/lesson/vocabulary', params: { id } });
  };
  return <>
    <Stack.Screen options={{ headerShown: false }} />
    <ChapterJourney title={moduleData.titleAz} order={moduleData.order} level={moduleData.level}
      items={items} energy={<EnergyMeter />} topInset={insets.top} bottomInset={insets.bottom}
      onBack={back} onLessonPress={openLesson} active={focused} />
  </>;
}
const s = StyleSheet.create({
  error: { flex: 1, backgroundColor: '#0c1020', alignItems: 'center', justifyContent: 'center', padding: 28 },
  title: { color: '#f6f1ff', fontWeight: '700', fontSize: 24, textAlign: 'center' },
  back: { marginTop: 24, backgroundColor: '#ff9b35', borderRadius: 16, minHeight: 48, paddingHorizontal: 24, justifyContent: 'center' },
  backText: { color: '#21192a', fontSize: 16, fontWeight: '700' },
});
