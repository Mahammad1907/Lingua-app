import { useEffect, useState } from 'react';
import { AccessibilityInfo, AppState, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lessonResult, ResultMood } from '../utils/lessonResult';
import { lessonTheme as t } from '../constants/lessonTheme';
const frames = require('../../assets/birtalk/result-atlas.png');
function ResultFox({ mood }: { mood: ResultMood }) {
  const [frame, setFrame] = useState(3);
  useEffect(() => {
    let disposed = false; let timer: ReturnType<typeof setInterval> | undefined;
    const stop = () => { if (timer) clearInterval(timer); setFrame(3); };
    void AccessibilityInfo.isReduceMotionEnabled().then(reduced => {
      if (disposed || reduced || AppState.currentState !== 'active') return;
      let tick = 0; setFrame(0);
      timer = setInterval(() => { tick++; if (tick >= 12) stop(); else setFrame(tick % 4); }, 220);
    }).catch(() => {});
    const motion = AccessibilityInfo.addEventListener('reduceMotionChanged', reduced => { if (reduced) stop(); });
    const state = AppState.addEventListener('change', value => { if (value !== 'active') stop(); });
    return () => { disposed = true; if (timer) clearInterval(timer); motion.remove(); state.remove(); };
  }, [mood]);
  const row = mood === 'excellent' ? 0 : mood === 'good' ? 1 : 2;
  return <View accessibilityLabel="BirFox dərs nəticəsini qeyd edir" style={{ width: 210, height: 240, overflow: 'hidden', alignSelf: 'center' }}>
    <Image source={frames} style={{ position: 'absolute', width: 840, height: 840, left: -210 * frame, top: -280 * row - 20 }} />
  </View>;
}
export default function LessonResults({ title, correct, wrong, skipped, seconds, xp, onBack }: {
  title: string; correct: number; wrong: number; skipped: number; seconds: number; xp: number; onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { percent, mood, total } = lessonResult(correct, wrong);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined; let disposed = false;
    void AccessibilityInfo.isReduceMotionEnabled().then(reduced => {
      if (disposed) return;
      if (reduced || percent === null) { setShown(percent || 0); return; }
      let value = 0;
      timer = setInterval(() => { value = Math.min(percent, value + 4); setShown(value); if (value >= percent && timer) clearInterval(timer); }, 25);
    }).catch(() => setShown(percent || 0));
    return () => { disposed = true; if (timer) clearInterval(timer); };
  }, [percent]);
  return <View style={[styles.screen, { paddingTop: insets.top }]}>
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>DƏRS TAMAMLANDI</Text><ResultFox mood={mood} />
      <Text style={styles.title}>{mood === 'excellent' ? 'Möhtəşəm nəticə!' : mood === 'good' ? 'Yaxşı irəliləyiş!' : mood === 'neutral' ? 'Məşq tamamlandı' : 'Hər məşq bir addımdır!'}</Text>
      <Text style={styles.subtitle}>{title}</Text>
      <View style={styles.score}><Text style={styles.percent}>{percent === null ? '—' : `${shown}%`}</Text><Text style={styles.subtitle}>İlk cəhddə düzgün cavab</Text>
        <View style={styles.track}><View style={[styles.fill, { width: `${shown}%` }]} /></View>
      </View>
      <View style={styles.grid}>{[[`${correct}/${total}`, 'Düzgün'], [String(wrong), 'Təkrar tələb etdi'], [String(skipped), 'Danışıq keçildi'], [`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`, 'Məşq müddəti']].map(([value, label]) => <View key={label} style={styles.tile}><Text style={styles.value}>{value}</Text><Text style={styles.subtitle}>{label}</Text></View>)}</View>
      <Text style={styles.reward}>{xp ? `+${xp} XP qazandın` : 'Təkrar məşq tamamlandı'}</Text>
      <Text style={styles.note}>Keçilmiş danışıq tapşırıqları və səs tanıma xətaları səhv sayılmır.</Text>
    </ScrollView>
    <View style={{ padding: 20, paddingBottom: Math.max(16, insets.bottom) }}><TouchableOpacity onPress={onBack} style={styles.button}><Text style={styles.buttonText}>Bölmə xəritəsinə qayıt  →</Text></TouchableOpacity></View>
  </View>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: t.background }, content: { padding: 22, alignItems: 'center' }, eyebrow: { color: t.orange, letterSpacing: 2, fontSize: 11, fontWeight: '800', marginTop: 12 }, title: { fontSize: 27, fontWeight: '800', color: t.text, textAlign: 'center' }, subtitle: { color: t.muted, fontSize: 12, marginTop: 6, textAlign: 'center' }, score: { width: '100%', borderRadius: 24, padding: 22, backgroundColor: t.surface, marginTop: 22 }, percent: { color: t.success, fontSize: 44, fontWeight: '800', textAlign: 'center' }, track: { height: 7, backgroundColor: t.raised, borderRadius: 5, overflow: 'hidden', marginTop: 16 }, fill: { height: '100%', backgroundColor: t.success }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }, tile: { width: '48%', flexGrow: 1, backgroundColor: t.surface, padding: 16, borderRadius: 18 }, value: { color: t.text, fontSize: 22, textAlign: 'center', fontWeight: '800' }, reward: { color: t.orange, fontWeight: '800', marginTop: 22 }, note: { color: t.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 12 }, button: { backgroundColor: t.orange, borderRadius: 16, padding: 17, alignItems: 'center' }, buttonText: { color: '#241321', fontWeight: '800', fontSize: 15 },
});
