import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import LessonSheet from './LessonSheet';
import { LessonButton, ink } from './ApprovedLessonSurface';
import { saveLessonReport, type LessonReport } from '../../utils/lessonReports';

export function ReportAction({ onPress }: { onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={s.flag}><Text style={s.link}>⚑ Xəta bildir</Text></Pressable>;
}
export default function LessonReportSheet({ visible, onClose, context }: { visible: boolean; onClose: () => void; context: Omit<LessonReport, 'reason' | 'note'> }) {
  const [reason, setReason] = useState(''), [note, setNote] = useState(''), [busy, setBusy] = useState(false), [saved, setSaved] = useState(false), [error, setError] = useState('');
  const save = async () => {
    if (!reason || busy) return;
    setBusy(true); setError('');
    try { await saveLessonReport({ ...context, reason, note: note.trim() }); setSaved(true); }
    catch { setError('Hesabat saxlanmadı. Yenidən cəhd et.'); }
    finally { setBusy(false); }
  };
  return <LessonSheet visible={visible} onClose={onClose} title="Xəta bildir" footer={<LessonButton label={saved ? 'Bağla' : busy ? 'Saxlanır…' : 'Hesabatı saxla'} disabled={!saved && (!reason || busy)} onPress={saved ? onClose : () => void save()} />}>
    {saved ? <Text accessibilityLiveRegion="polite" style={s.text}>Hesabat bu cihazda saxlanıldı. Dəstək xidmətinə göndərilməyib.</Text> : <>
      <Text style={s.text}>Nə ilə bağlı problem var?</Text>
      <View accessibilityRole="radiogroup" style={{ gap: 8 }}>{['Cavabın yoxlanması', 'Mətn və ya tərcümə', 'Audio', 'Şəkil', 'Digər'].map(item => <Pressable key={item} accessibilityRole="radio" accessibilityState={{ selected: reason === item }} onPress={() => setReason(item)} style={[s.choice, reason === item && s.selected]}><Text style={s.text}>{reason === item ? '◉' : '○'} {item}</Text></Pressable>)}</View>
      <TextInput accessibilityLabel="Problemin izahı" placeholder="İstəsən, qısa izah yaz" placeholderTextColor={ink.muted} value={note} onChangeText={setNote} multiline maxLength={1500} style={s.input} />
      <Text style={s.note}>Hesabat cihazda saxlanacaq; hazırda dəstəyə göndəriş qoşulmayıb.</Text>
      {error ? <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text> : null}
    </>}
  </LessonSheet>;
}
const s = StyleSheet.create({ flag: { minHeight: 40, borderWidth: 1, borderColor: ink.border, borderRadius: 20, paddingHorizontal: 12, justifyContent: 'center' }, link: { color: ink.violet, fontSize: 13, fontWeight: '600' }, text: { color: ink.text, fontSize: 15, lineHeight: 22 }, note: { color: ink.muted, fontSize: 12, lineHeight: 18 }, choice: { padding: 12, borderWidth: 1, borderColor: ink.border, borderRadius: 14 }, selected: { borderColor: ink.violet, backgroundColor: '#E8D9FA' }, input: { padding: 14, minHeight: 86, borderWidth: 1, borderColor: ink.border, borderRadius: 16, color: ink.text, fontSize: 15 }, error: { color: '#B91C36', fontSize: 14 } });
