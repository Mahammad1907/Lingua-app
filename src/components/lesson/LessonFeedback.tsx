import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PacketVerdict } from '../../utils/packetAnswer';
import { LessonButton, LessonIcon, ink } from './ApprovedLessonSurface';
import SpellingNote from './SpellingNote';
import LessonSheet from './LessonSheet';
import { ReportAction } from './LessonReportSheet';
export default function LessonFeedback({ verdict, explanation, assisted = false, answer, accepted, needsPractice = false, example, shortRule, onContinue, onReport, disabled = false, open = true, onClose }: { verdict: PacketVerdict; explanation: string; meaning?: string | null; assisted?: boolean; answer?: string; accepted?: string[]; needsPractice?: boolean; example?: string; shortRule?: string; onContinue?: () => void; onReport?: () => void; disabled?: boolean; open?: boolean; onClose?: () => void }) {
  const [details, setDetails] = useState(false);
  const correct = verdict.status === 'correct', unknown = verdict.status === 'unknown';
  const color = unknown ? ink.violet : correct ? ink.mint : ink.error;
  const title = unknown ? 'Səs yoxlanmadı' : correct ? 'Düzgündür' : 'Bir daha baxaq';
  return <LessonSheet visible={open} onClose={onClose || (() => {})} title={details ? 'Mənə başa sal' : `${unknown ? 'ⓘ' : correct ? '✓' : '!'} ${title}`} action={onReport ? <ReportAction onPress={onReport} /> : undefined} footer={onContinue ? <LessonButton disabled={disabled} tone={unknown ? 'primary' : correct ? 'correct' : 'wrong'} label="Davam et" onPress={onContinue} /> : undefined}>
    <View accessibilityLiveRegion="polite" style={{ gap: 12 }}>
      {details ? <>
        {[['Sənin cavabın', answer || '—'], ['Uyğun cavablar', accepted?.join(' / ') || '—'], ['Səbəb', explanation], ['Qısa qayda', shortRule || explanation], ['Yeni nümunə', example || accepted?.[0] || '—']].map(([label, value]) => <View key={label} style={s.section}><Text style={s.label}>{label}</Text><Text style={s.text}>{value}</Text></View>)}
      </> : <>
        <Text style={[s.status, { color }]}>{unknown ? verdict.message : correct ? assisted ? 'Cavabı köməklə tamamladın.' : 'Cavabın bu vəziyyətə uyğundur.' : explanation}</Text>
        {correct && verdict.spellingCorrections?.length ? <SpellingNote corrections={verdict.spellingCorrections} /> : null}
        {!correct && !unknown && accepted?.length ? <Text style={s.text}>Uyğun cavab: {accepted.join(' / ')}</Text> : null}
        {needsPractice ? <Text style={s.text}>Bu hissəni sonra yenidən məşq edəcəyik.</Text> : null}
        {!unknown ? <Pressable accessibilityRole="button" onPress={() => setDetails(true)} style={s.help}><LessonIcon name="hint" size={18} /><Text style={s.label}>Mənə başa sal</Text></Pressable> : null}
      </>}
    </View>
  </LessonSheet>;
}
const s = StyleSheet.create({ status: { fontSize: 16, lineHeight: 24, fontWeight: '600' }, text: { color: ink.text, fontSize: 16, lineHeight: 24 }, label: { color: ink.violet, fontSize: 14, fontWeight: '700' }, section: { borderBottomWidth: 1, borderColor: ink.border, paddingBottom: 12, gap: 6 }, help: { flexDirection: 'row', gap: 7, alignItems: 'center', alignSelf: 'flex-end', minHeight: 44, borderRadius: 22, borderWidth: 1, borderColor: ink.border, paddingHorizontal: 14, justifyContent: 'center' } });
