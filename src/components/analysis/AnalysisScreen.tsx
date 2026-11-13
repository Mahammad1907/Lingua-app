// Analiz: clear, modern charts built only from saved results. Every number says what it counts.
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { d, font, shadow } from '../design/theme';
import Icon from '../design/Icons';
import { HomeIcon } from '../home/HomeIcon';
import { useUserStore } from '../../store/userStore';
import { averageScore, canDo, hardPhrases, skillTotals, weekActivity, type GoalStatus } from '../../utils/progressInsights';

const STATUS: Record<GoalStatus, { label: string; color: string; bg: string }> = {
  independent: { label: 'Müstəqil', color: '#147A33', bg: '#DDF4E3' },
  assisted: { label: 'Köməklə', color: '#B4530A', bg: '#FFE3C7' },
  practice: { label: 'Məşq lazımdır', color: '#B42318', bg: '#F8DCE3' },
  todo: { label: 'Hələ yox', color: '#7C6F95', bg: '#EFE6FB' },
};

function Ring({ value, size = 96, stroke = 12, color = d.purple, label, sub }: { value: number; size?: number; stroke?: number; color?: string; label: string; sub: string }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke="#EFE6FB" strokeWidth={stroke} fill="none" />
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
        strokeDasharray={`${c * Math.min(1, value / 100)} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </Svg>
    <Text style={s.ringValue}>{label}</Text><Text style={s.ringSub}>{sub}</Text>
  </View>;
}

function WeekChart({ days }: { days: { label: string; count: number }[] }) {
  const max = Math.max(1, ...days.map(x => x.count)), H = 110, W = 300, bw = 26, gap = (W - bw * 7) / 6;
  return <View>
    <Svg width="100%" height={H + 24} viewBox={`0 0 ${W} ${H + 24}`}>
      <Defs><LinearGradient id="bar" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#7B4FDD" /><Stop offset="1" stopColor="#5B1FD1" /></LinearGradient></Defs>
      {days.map((x, i) => {
        const h = x.count ? Math.max(10, x.count / max * (H - 18)) : 6;
        return <Rect key={i} x={i * (bw + gap)} y={H - h} width={bw} height={h} rx={8} fill={x.count ? 'url(#bar)' : '#E6DAFB'} />;
      })}
    </Svg>
    <View style={s.weekLabels}>{days.map((x, i) => <View key={i} style={{ width: `${100 / 7}%`, alignItems: 'center' }}>
      <Text style={[s.weekCount, !x.count && { color: '#B9AED0' }]}>{x.count}</Text><Text style={s.weekDay}>{x.label}</Text></View>)}</View>
  </View>;
}

function Bar({ label, value, max, note, color = d.purple }: { label: string; value: number; max: number; note: string; color?: string }) {
  return <View style={{ gap: 6 }}>
    <View style={s.barHead}><Text style={s.barLabel}>{label}</Text><Text style={s.barNote}>{note}</Text></View>
    <View style={s.barTrack}><View style={[s.barFill, { width: `${max ? Math.round(value / max * 100) : 0}%`, backgroundColor: color }]} /></View>
  </View>;
}

export default function AnalysisScreen() {
  const router = useRouter(); const insets = useSafeAreaInsets();
  const progress = useUserStore(st => st.lessonProgress) as Parameters<typeof weekActivity>[0];
  const streak = useUserStore(st => st.streak); const xp = useUserStore(st => st.xp);
  const done = progress.filter(p => p.completed);
  const week = weekActivity(done); const skills = skillTotals(done); const avg = averageScore(done);
  const goals = canDo(done); const hard = hardPhrases(done).slice(0, 8);
  const reached = goals.filter(g => g.status === 'independent').length;
  const maxSkill = Math.max(1, skills.written, skills.spoken, skills.listening + skills.listeningHelp);
  return <View style={[s.screen, { paddingTop: insets.top }]}>
    <View style={s.top}>
      <Pressable accessibilityRole="button" accessibilityLabel="Geri" onPress={() => router.back()} style={s.back}><Icon name="back" size={20} color={d.ink} /></Pressable>
      <Text accessibilityRole="header" style={s.title}>Analiz</Text>
    </View>
    <ScrollView contentContainerStyle={[s.body, { paddingBottom: insets.bottom + 24 }]}>
      <View style={s.stats}>
        <View style={[s.stat, shadow]}><HomeIcon name="bolt" color={d.orange} size={20} /><Text style={s.statValue}>{streak}</Text><Text style={s.statLabel}>gün ardıcıl</Text></View>
        <View style={[s.stat, shadow]}><Text style={[s.statValue, { color: '#C99A00' }]}>★ {xp}</Text><Text style={s.statLabel}>xal</Text></View>
        <View style={[s.stat, shadow]}><Text style={s.statValue}>{done.length}</Text><Text style={s.statLabel}>dərs bitib</Text></View>
      </View>

      <View style={[s.card, shadow, s.rowCard]}>
        <Ring value={avg} label={`${avg}%`} sub="düzgün" />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={s.cardTitle}>Ümumi nəticə</Text>
          <Text style={s.cardText}>Bitirdiyin dərslərdə cavablarının orta faizi. 90%-dən yuxarı — bacarıq möhkəmdir.</Text>
        </View>
      </View>

      <View style={[s.card, shadow]}>
        <Text style={s.cardTitle}>Son 7 gün</Text>
        <Text style={s.cardText}>Hər gün neçə dərs bitirdin</Text>
        <WeekChart days={week} />
      </View>

      <View style={[s.card, shadow, { gap: 14 }]}>
        <Text style={s.cardTitle}>Bacarıqlar</Text>
        <Bar label="Yazı" value={skills.written} max={maxSkill} note={`${skills.written} cavab`} />
        <Bar label="Danışıq" value={skills.spoken} max={maxSkill} note={`${skills.spoken} cavab`} color={d.orange} />
        <Bar label="Dinləmə" value={skills.listening} max={maxSkill} note={`${skills.listening} müstəqil · ${skills.listeningHelp} köməklə`} color={d.green} />
      </View>

      <View style={[s.card, shadow]}>
        <View style={s.barHead}><Text style={s.cardTitle}>Edə bilirəm</Text><Text style={s.barNote}>{reached}/{goals.length} müstəqil</Text></View>
        <View style={s.goalBar}>{goals.map((g, i) => <View key={i} style={[s.goalSeg, { backgroundColor: STATUS[g.status].bg, borderColor: STATUS[g.status].color }]} />)}</View>
        {goals.map((g, i) => <View key={i} style={[s.goal, i > 0 && { borderTopWidth: 1, borderTopColor: '#F0E8FC' }]}>
          <Text style={s.goalLesson}>{g.lesson}</Text>
          <Text style={s.goalText}>{g.text}</Text>
          <Text style={[s.pill, { color: STATUS[g.status].color, backgroundColor: STATUS[g.status].bg }]}>{STATUS[g.status].label}</Text>
        </View>)}
      </View>

      <View style={[s.card, shadow, { backgroundColor: '#FFF6EC', borderColor: '#F7CFA6' }]}>
        <Text style={s.cardTitle}>Ən çox çətinlik çəkdiyin</Text>
        {hard.length ? <View style={s.chips}>{hard.map(p => <Text key={p} style={s.chip}>{p}</Text>)}</View>
          : <Text style={s.cardText}>Hələ səhv toplanmayıb. Dərslərdə səhv etdiyin ifadələr burada görünəcək.</Text>}
        {hard.length ? <Pressable accessibilityRole="button" onPress={() => router.push('/vocabulary/wrong-words-list')} style={s.cta}><Text style={s.ctaText}>Bunları təkrarla</Text></Pressable> : null}
      </View>
    </ScrollView>
  </View>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3ECFC' },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, height: 56 },
  back: { width: 42, height: 42, borderRadius: 21, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  title: { color: d.ink, fontSize: 24, ...font.extrabold },
  body: { paddingHorizontal: 16, gap: 12 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, gap: 2, padding: 14, borderRadius: 20, backgroundColor: '#fff' },
  statValue: { color: d.ink, fontSize: 22, ...font.extrabold },
  statLabel: { color: d.inkSoft, fontSize: 12, ...font.bold },
  card: { gap: 8, padding: 16, borderRadius: 22, backgroundColor: '#fff', borderWidth: 1, borderColor: '#EDE3FB' },
  rowCard: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  cardTitle: { color: d.ink, fontSize: 17, ...font.extrabold },
  cardText: { color: d.inkSoft, fontSize: 13, lineHeight: 19, ...font.semibold },
  ringValue: { color: d.ink, fontSize: 22, ...font.extrabold },
  ringSub: { color: d.inkSoft, fontSize: 11, marginTop: -2, ...font.bold },
  weekLabels: { flexDirection: 'row', marginTop: 4 },
  weekCount: { color: d.purple, fontSize: 13, ...font.extrabold },
  weekDay: { color: d.inkSoft, fontSize: 11, ...font.bold },
  barHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  barLabel: { color: d.ink, fontSize: 15, ...font.extrabold },
  barNote: { color: d.inkSoft, fontSize: 12, ...font.bold },
  barTrack: { height: 10, borderRadius: 5, backgroundColor: '#EFE6FB', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  goalBar: { flexDirection: 'row', gap: 3, marginVertical: 4 },
  goalSeg: { flex: 1, height: 10, borderRadius: 5, borderWidth: 1 },
  goal: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  goalLesson: { width: 24, height: 24, borderRadius: 12, backgroundColor: d.purpleSoft, color: d.purple, textAlign: 'center', lineHeight: 24, fontSize: 12, ...font.extrabold },
  goalText: { flex: 1, color: d.ink, fontSize: 14, lineHeight: 19, ...font.bold },
  pill: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', ...font.extrabold },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#F7CFA6', color: d.ink, fontSize: 14, overflow: 'hidden', ...font.extrabold },
  cta: { marginTop: 6, height: 44, borderRadius: 22, backgroundColor: d.orange, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#fff', fontSize: 15, ...font.extrabold },
});
