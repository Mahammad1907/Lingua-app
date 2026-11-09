import { useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/userStore';
import { buildHomeGroups, resumeGroup } from '../../utils/homeGroups';
import { HomeIcon } from './HomeIcon';
export default function LessonGroupPanel({ groupId, onClose, onLesson }: {
  groupId: string | null; onClose: () => void; onLesson: (id: string) => void;
}) {
  const reduced = useReducedMotion();
  const insets = useSafeAreaInsets();
  const completed = useUserStore(s => s.completedLessons);
  const attempts = useUserStore(s => s.attempts);
  const groups = buildHomeGroups(completed, attempts);
  const group = groups.find(g => g.id === groupId);
  const [error, setError] = useState('');
  return <Modal visible={Boolean(group)} transparent animationType={reduced ? 'none' : 'slide'} onRequestClose={onClose}>
    <View style={s.scrim}>
      <Pressable accessibilityRole="button" accessibilityLabel="Paneli bağla" onPress={onClose} style={StyleSheet.absoluteFill} />
      {group && <View style={[s.sheet, { paddingBottom: Math.max(20, insets.bottom) }]} accessibilityViewIsModal>
        <View style={s.handle} /><View style={s.heading}><Text style={s.title}>{group.title}</Text><Pressable accessibilityRole="button" accessibilityLabel="Bağla" onPress={onClose} style={s.close}><HomeIcon name="close" color="#7B429D" /></Pressable></View>
        <Text style={s.note}>{group.count}/{group.lessons.length} dərs tamamlanıb · {group.percent}%</Text>
        <View style={s.track}><View style={[s.fill, { width: `${group.percent}%` }]} /></View>
        <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 9 }}>
          {group.lessons.map(lesson => <Pressable key={lesson.id} accessibilityRole="button"
            accessibilityLabel={`${lesson.order}. ${lesson.title}. ${lesson.action}`}
            onPress={() => { if (lesson.locked) { setError('Əvvəlki dərsi tamamla.'); return; } if (!lesson.ready) { setError('Bu dərsin məzmunu hələ qoşulmayıb.'); return; } onClose(); onLesson(lesson.id); }}
            style={({ pressed }) => [s.lesson, pressed && { opacity: .75 }]}>
            <HomeIcon name={lesson.completed ? 'check' : 'arrow'} color={lesson.completed ? '#44A65E' : '#F49028'} />
            <View style={{ flex: 1 }}><Text style={s.lessonTitle}>{lesson.order}. {lesson.title}</Text><Text style={s.note}>{lesson.locked ? 'Əvvəlki dərsi tamamla' : lesson.ready ? lesson.action : 'Məzmun hazırlanır'}</Text></View>
            <HomeIcon name="chevron" color="#9362B0" size={18} />
          </Pressable>)}
        </ScrollView>
        {error ? <Text accessibilityLiveRegion="polite" style={s.note}>{error}</Text> : null}
      </View>}
    </View>
  </Modal>;
}
export { resumeGroup };
const s = StyleSheet.create({
  scrim: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(36,17,57,.48)' },
  sheet: { maxHeight: '85%', padding: 20, gap: 13, backgroundColor: '#F8EEFF', borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  handle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#CFB2E3', alignSelf: 'center' }, heading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { flex: 1, fontSize: 25, fontWeight: '900', color: '#301344' }, close: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  note: { fontSize: 14, lineHeight: 20, color: '#84569D' }, track: { height: 9, backgroundColor: '#DBC4ED', borderRadius: 9, overflow: 'hidden' }, fill: { height: '100%', backgroundColor: '#9A41DF' },
  lesson: { minHeight: 64, padding: 12, borderRadius: 17, backgroundColor: '#FDF9FF', borderWidth: 1, borderColor: '#E5CFF4', flexDirection: 'row', alignItems: 'center', gap: 10 }, lessonTitle: { fontSize: 16, lineHeight: 22, fontWeight: '800', color: '#35164B' },
});
