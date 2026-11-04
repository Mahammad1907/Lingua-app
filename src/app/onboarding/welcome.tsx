// This existing route remains the summary destination of the unchanged placement test.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Frame, Mascot, s, useOnboardingSize } from '../../components/onboarding/OnboardingUI';
import { usePreferences } from '../../components/onboarding/usePreferences';
import { getAllModules } from '../../data/modules';
import { getLessonById } from '../../data/lessons';
import { useUserStore } from '../../store/userStore';
import { goals, levelSummary, practiceMinutes } from '../../utils/onboarding';
import { moduleUnlocked } from '../../utils/moduleAccess';

export default function StartingPlan() {
  const router = useRouter();
  const p = usePreferences();
  const { compact, height, fontScale } = useOnboardingSize();
  const [planPage, setPlanPage] = useState(0);
  const paged = height < 650 || fontScale > 1.25;
  const showChoices = !paged || planPage === 0;
  const showPractice = !paged || planPage === 1;
  const completed = useUserStore(state => state.completedLessons);
  const placements = useUserStore(state => state.placementResults);
  const goal = goals.find(g => g.id === p.preferences.goal)!;
  const availableModule = getAllModules().find(m => m.language === p.language && m.level === p.storedLevel
    && moduleUnlocked(m.id, completed, placements) && m.lessonIds.some(id => getLessonById(id) && !completed.includes(id)));
  const lesson = availableModule?.lessonIds.map(getLessonById).find(l => l && !completed.includes(l.id));
  const finish = () => void p.run(async () => {
    await p.save();
    // Bridge to the existing home selector without changing its screens or progress/assessment store.
    if (p.storedLevel && p.storedLevel !== 'test') await AsyncStorage.setItem('@birtalk_home_selection_v1', JSON.stringify({ language: p.language, level: p.storedLevel }));
    await AsyncStorage.setItem('onboarding_completed', 'true');
    if (lesson) router.replace({ pathname: '/lesson/session', params: { id: lesson.id } });
    else router.replace('/(tabs)');
  });
  return <Frame step={4} back={() => router.replace('/onboarding/level')} title="Başlanğıc planın"
    subtitle="Seçimlərini nəzərdən keçir, öz tempinlə başla."
    action={paged && planPage === 0 ? 'Davam et' : lesson ? 'İlk dərsə başla' : 'Ana səhifəyə keç'} onAction={paged && planPage === 0 ? () => setPlanPage(1) : finish}
    ready={p.ready} busy={p.busy} error={p.error} retry={p.retry}>
    <Mascot name="plan" />
    {showChoices && <View style={[s.summary, compact && { marginVertical: 4 }]}>
      <View style={[s.summaryCard, compact && { padding: 8 }]}><Text style={s.label}>Məqsədin</Text><Text style={s.value}>{goal.title}</Text></View>
      <View style={[s.summaryCard, compact && { padding: 8 }]}><Text style={s.label}>Səviyyən</Text><Text style={s.value}>{levelSummary(p.preferences, p.storedLevel, p.placementScore)}</Text></View>
    </View>}
    <View style={[s.plan, compact && { padding: 8, gap: 6 }]}>
      {!compact && <Text style={s.planTitle}>Başlanğıc seçimlərin</Text>}
      {showChoices && <View style={s.planRow}><Text style={s.planIcon} accessible={false}>👋</Text><View style={s.planCopy}><Text style={s.label}>Mövcud ilk mövzu</Text><Text style={s.value}>{availableModule?.titleAz || 'Bu səviyyədə dərs hələ yoxdur'}</Text></View></View>}
      {showPractice && <>
      {!paged && <View style={s.rule} />}
      <View><Text style={s.label}>{compact ? 'Gündəlik tövsiyə · dəyişə bilərsən' : 'Gündəlik məşq · tövsiyə, dəyişə bilərsən'}</Text>
        <View style={s.minutes} accessibilityRole="radiogroup" accessibilityLabel="Gündəlik məşq müddəti">
          {practiceMinutes.map(minutes => <Pressable key={minutes} accessibilityRole="radio" accessibilityState={{ selected: p.preferences.minutes === minutes, checked: p.preferences.minutes === minutes, disabled: p.busy }}
            accessibilityLabel={`${minutes} dəqiqə`} disabled={p.busy} onPress={() => p.setPreferences(v => ({ ...v, minutes }))}
            style={[s.minute, p.preferences.minutes === minutes && s.minuteSelected]}><Text style={[s.minuteText, p.preferences.minutes === minutes && s.minuteTextSelected]}>{minutes} dəq</Text></Pressable>)}
        </View>
      </View>
      <View style={s.rule} />
      <View style={s.planRow}><Text style={s.planIcon} accessible={false}>🎧</Text><View style={s.planCopy}><Text style={s.label}>Məşq növü</Text><Text style={s.value}>{lesson ? 'Dinləmə və danışıq' : 'Dərs açıldıqda göstəriləcək'}</Text></View></View></>}
      <Text style={s.note}>{compact ? 'Ayrıca məqsəd yolu hələ yoxdur.' : 'Məqsədin qeyd edilir. Ayrıca məqsədə uyğun dərs yolu hələ hazırlanmır.'}</Text>
    </View>
    {paged && <View style={s.pagination}>
      <Pressable accessibilityRole="button" accessibilityLabel="Plan seçimlərinə qayıt" disabled={planPage === 0} onPress={() => setPlanPage(0)} style={s.pageButton}><Text style={[s.pageText, planPage === 0 && s.disabled]}>‹ Seçimlər</Text></Pressable>
      <Text style={s.label}>{planPage + 1}/2</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Məşq tövsiyəsinə bax" disabled={planPage === 1} onPress={() => setPlanPage(1)} style={s.pageButton}><Text style={[s.pageText, planPage === 1 && s.disabled]}>Məşq ›</Text></Pressable>
    </View>}
  </Frame>;
}
