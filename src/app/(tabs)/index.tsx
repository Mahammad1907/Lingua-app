import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeDashboard, HOME_LANGUAGES, HomeNavigation, type HomeDestination } from '../../components/home/HomeDashboard';
import { HomeIcon } from '../../components/home/HomeIcon';
import { lessons } from '../../data/lessons';
import { getAllModules } from '../../data/modules';
import { useUserStore } from '../../store/userStore';
import { buildHomeCourse } from '../../utils/homeCourse';
import { moduleTest } from '../../utils/moduleAccess';

const SELECTION_KEY = '@birtalk_home_selection_v1';
const LEVELS = ['A1', 'A2', 'B1', 'B2'];
const AVAILABLE_LESSONS = new Set(lessons.map((lesson) => lesson.id));

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const userLevel = useUserStore((s) => s.level);
  const xp = useUserStore((s) => s.xp);
  const completedLessons = useUserStore((s) => s.completedLessons);
  const placementResults = useUserStore((s) => s.placementResults);
  const [selection, setSelection] = useState({ language: 'en', level: LEVELS.includes(userLevel) ? userLevel : 'A1' });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [lockedId, setLockedId] = useState<string | null>(null);
  const userSelected = useRef(false);
  const modules = useMemo(() => getAllModules(), []);
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(SELECTION_KEY).then((raw) => {
      if (!raw || cancelled || userSelected.current) return;
      try {
        const value: unknown = JSON.parse(raw);
        if (typeof value !== 'object' || value === null) return;
        const saved = value as Record<string, unknown>;
        if (HOME_LANGUAGES.some((l) => l.code === saved.language) && typeof saved.level === 'string' && LEVELS.includes(saved.level)) {
          setSelection({ language: String(saved.language), level: saved.level });
        }
      } catch { /* Invalid preferences do not alter saved course progress. */ }
    }).catch(() => { /* Keep the usable default selection when storage is unavailable. */ });
    return () => { cancelled = true; };
  }, []);
  const course = useMemo(() => buildHomeCourse({ modules, ...selection, completedLessons,
    placementResults, availableLessonIds: AVAILABLE_LESSONS }), [modules, selection, completedLessons, placementResults]);
  function choose(language: string, level: string) {
    userSelected.current = true;
    const next = { language, level };
    setSelection(next);
    void AsyncStorage.setItem(SELECTION_KEY, JSON.stringify(next)).catch(() => {});
  }
  function navigate(destination: HomeDestination) {
    if (destination === 'review') router.push('/vocabulary/wrong-words-list');
    if (destination === 'vocabulary') router.navigate('/(tabs)/vocabulary');
    if (destination === 'profile') router.navigate('/(tabs)/profile');
  }
  return <View style={styles.root}>
    <HomeDashboard course={course} language={selection.language} level={selection.level} xp={xp}
      compact={width < 360} topInset={insets.top} onSelect={() => setPickerOpen(true)}
      onOpen={(id) => {
        if (course.items.find((item) => item.id === id)?.state === 'locked') setLockedId(id);
        else router.push({ pathname: '/module/[id]', params: { id } });
      }} />
    <HomeNavigation bottomInset={insets.bottom} onNavigate={navigate} />
    <Modal visible={lockedId !== null} transparent animationType="fade" onRequestClose={() => setLockedId(null)}>
      <View style={styles.modalWrap}>
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]} accessibilityViewIsModal>
          <Text style={styles.sheetTitle}>Bu mövzuları artıq bilirsən?</Text>
          <Text style={{ color: '#f5efff', fontSize: 16 }}>Biliklərini yoxlayaraq bu bölmənin kilidini aça bilərsən.</Text>
          {lockedId && !moduleTest(lockedId) ? <Text style={{ color: '#c1afd9' }}>Bu bölmə üçün sınaq hələ hazır deyil</Text> : null}
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: !lockedId || !moduleTest(lockedId) }} disabled={!lockedId || !moduleTest(lockedId)}
            style={[styles.done, (!lockedId || !moduleTest(lockedId)) && { opacity: .45 }]}
            onPress={() => { if (!lockedId || !moduleTest(lockedId)) return; const id = lockedId; setLockedId(null); router.push({ pathname: '/module/check', params: { moduleId: id } }); }}>
            <Text style={styles.doneText}>Keçid imtahanına başla</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => setLockedId(null)}><Text style={{ color: '#f5efff', padding: 10 }}>Geri</Text></Pressable>
        </View>
      </View>
    </Modal>
    <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
      <View style={styles.modalWrap}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setPickerOpen(false)} accessibilityRole="button" accessibilityLabel="Seçimi bağla" />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]} accessibilityViewIsModal>
          <View style={styles.sheetHeading}><Text style={styles.sheetTitle}>Dil və səviyyə</Text>
            <Pressable onPress={() => setPickerOpen(false)} accessibilityRole="button" accessibilityLabel="Bağla" hitSlop={12}><HomeIcon name="close" /></Pressable>
          </View>
          {HOME_LANGUAGES.map((language) => <Pressable key={language.code} accessibilityRole="radio"
            accessibilityState={{ checked: selection.language === language.code }} onPress={() => choose(language.code, selection.level)}
            style={[styles.languageOption, selection.language === language.code && styles.selected]}>
            <Text style={styles.optionFlag}>{language.flag}</Text><Text style={styles.optionTitle}>{language.name}</Text>
            {selection.language === language.code && <HomeIcon name="check" color="#ff9c35" />}
          </Pressable>)}
          <View style={styles.levelOptions}>{LEVELS.map((level) => <Pressable key={level} onPress={() => choose(selection.language, level)} accessibilityRole="radio"
            accessibilityState={{ checked: selection.level === level }} style={[styles.levelOption, selection.level === level && styles.selected]}>
            <Text style={styles.optionTitle}>{level}</Text></Pressable>)}</View>
          <Pressable onPress={() => setPickerOpen(false)} accessibilityRole="button" style={styles.done}><Text style={styles.doneText}>Hazırdır</Text></Pressable>
        </View>
      </View>
    </Modal>
  </View>;
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0c1020' }, modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,.65)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#19172e', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, gap: 12 },
  sheetHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }, sheetTitle: { fontSize: 22, fontWeight: '800', color: '#faf5ff' },
  languageOption: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, padding: 12, minHeight: 48, borderWidth: 1, borderColor: '#3d3457' },
  selected: { borderColor: '#ff9b35', backgroundColor: '#342535' }, optionFlag: { fontSize: 25 }, optionTitle: { color: '#f5efff', fontSize: 16, fontWeight: '600', flex: 1 },
  levelOptions: { flexDirection: 'row', gap: 9, marginTop: 8 }, levelOption: { flex: 1, paddingVertical: 13, paddingHorizontal: 10, alignItems: 'center', borderWidth: 1, borderColor: '#3d3457', borderRadius: 10 },
  done: { backgroundColor: '#ffa038', padding: 14, alignItems: 'center', borderRadius: 12, marginTop: 8 }, doneText: { color: '#251a25', fontWeight: '800', fontSize: 17 },
});
