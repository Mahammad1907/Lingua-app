import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Surface, LessonIcon, ink } from './ApprovedLessonSurface';
import LessonMascot from './LessonMascot';
import EarnedXP from '../EarnedXP';
import type { summarizeEvidence } from '../../utils/lessonEvidence';
export default function LessonResult({ title, goal, done, missing, summary, evidence, receipt, error, onDetails }: {
  title: string; goal: string; done: boolean; missing: number;
  summary: Record<'independent' | 'assisted' | 'wrong' | 'unverified', number>;
  evidence: ReturnType<typeof summarizeEvidence>; receipt: string; error: string; onDetails: () => void;
}) {
  const total = summary.independent + summary.assisted + summary.wrong + summary.unverified;
  return <View style={s.box}>
    <Text style={s.badge}>{missing ? 'Davam edək' : 'Dərsin nəticəsi'}</Text>
    <View style={s.celebration}><View style={s.halo} /><LessonMascot height={145} /></View>
    <Text accessibilityRole="header" style={s.title}>{missing ? 'Dərs hələ tamamlanmayıb' : done ? 'Dərs tamamlandı!' : 'Məşqi tamamladın!'}</Text>
    <Text style={s.subtitle}>{title}</Text>
    {missing ? <Text style={s.error}>{missing} məcburi tapşırıq qalır. Düzgün cavabların saxlanılıb.</Text> : null}
    <Surface><Text style={s.section}>Cavabların</Text><View style={s.stats}>{([
      ['independent', 'Müstəqil', '✓', ink.mint], ['assisted', 'Köməklə', '✓', ink.violet], ['wrong', 'Məşq lazımdır', '↻', ink.orange], ['unverified', 'Yoxlanmadı', 'ⓘ', ink.muted],
    ] as const).map(([key, label, symbol, color]) => <View key={key} style={s.stat}><View style={[s.statIcon, { backgroundColor: `${color}12` }]}><Text style={[s.number, { color }]}>{symbol} {summary[key]}</Text></View><Text style={s.label}>{label}</Text></View>)}</View><Text style={s.note}>{total} tapşırıq üzrə nəticə</Text></Surface>
    <Surface><Text style={s.section}>Bacarıqlar üzrə nəticə</Text><Text style={s.body}>Yazılı cavab: {evidence.written} · Səsli cavab: {evidence.spoken}</Text><Text style={s.note}>Dinləmə: {evidence.listeningIndependent} müstəqil · {evidence.listeningAssisted} köməklə</Text>{evidence.technicalText || evidence.textHelp ? <Text style={s.note}>Dinləmə yoxlanmadı: {evidence.technicalText + evidence.textHelp}</Text> : null}<Text style={s.small}>Səsli cavab sayı tələffüz balı deyil.</Text></Surface>
    <Text style={s.note}>{goal}</Text>
    <Pressable accessibilityRole="button" onPress={onDetails} style={s.details}><LessonIcon name="book" size={18} /><Text style={s.link}>Tapşırıqların nəticələri</Text></Pressable>
    {done ? <EarnedXP receiptId={receipt} /> : null}
    {error ? <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text> : null}
  </View>;
}
const s = StyleSheet.create({ box: { gap: 12 }, badge: { color: ink.violet, alignSelf: 'center', backgroundColor: ink.soft, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 18, fontWeight: '700', fontSize: 14 }, celebration: { alignItems: 'center', justifyContent: 'center' }, halo: { width: 145, height: 135, borderRadius: 70, backgroundColor: '#E4D2F8', position: 'absolute' }, title: { color: ink.text, textAlign: 'center', fontSize: 28, lineHeight: 34, fontWeight: '800' }, subtitle: { color: ink.muted, textAlign: 'center', fontSize: 16, lineHeight: 22 }, section: { color: ink.text, fontWeight: '800', fontSize: 17 }, stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, stat: { width: '46%', gap: 5 }, statIcon: { borderRadius: 15, paddingVertical: 6, paddingHorizontal: 10 }, number: { fontSize: 22, fontWeight: '800' }, label: { color: ink.text, fontSize: 13, fontWeight: '600' }, body: { color: ink.text, fontSize: 15, lineHeight: 22 }, note: { color: ink.muted, fontSize: 14, lineHeight: 21 }, small: { color: ink.muted, fontSize: 12, lineHeight: 17 }, details: { alignSelf: 'center', minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, borderColor: ink.border, backgroundColor: ink.soft }, link: { color: ink.violet, fontSize: 14, fontWeight: '700' }, error: { color: ink.error, fontSize: 14, lineHeight: 21 } });
