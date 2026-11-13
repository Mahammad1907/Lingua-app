import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Graded } from '../../utils/designLesson';
import Icon from './Icons';
import { Capsule, MainButton, Sheet, ds } from './parts';
import { d, radius, shadow } from './theme';

/** Inline result panel: correct (green) / wrong (red) / neutral (not assessed). Locks until “Davam et”. */
export function ResultPanel({ tone, title, short, answers, corrections, assisted, onExplain, onReport, onContinue, continueLabel = 'Davam et', actions, collapsed, onCollapse }: {
  tone: 'correct' | 'wrong' | 'neutral'; title: string; short?: string; answers?: string; corrections?: Graded['spellingCorrections']; assisted?: boolean;
  onExplain?: () => void; onReport: () => void; onContinue?: () => void; continueLabel?: string; actions?: ReactNode; collapsed: boolean; onCollapse: () => void;
}) {
  const button = onContinue ? <MainButton label={continueLabel} tone={tone === 'correct' ? 'green' : tone === 'wrong' ? 'red' : 'purple'} onPress={onContinue} /> : null;
  if (collapsed) return <View style={{ gap: 10 }}>{button}</View>;
  return <View style={[s.panel, shadow]}>
    <View style={s.handle} />
    <View style={s.topRow}>
      {/* No close button: the panel stays until “Davam et” (collapse is only used internally for a voice retry). */}
      <Capsule small tone="outline" icon="flag" label="Xəta bildir" onPress={onReport} />
    </View>
    <View accessibilityLiveRegion="polite" style={s.titleRow}>
      {tone === 'correct' ? <View style={[s.badge, { borderColor: d.green, backgroundColor: d.greenSoft }]}><Icon name="check" size={20} color={d.green} stroke={2.6} /></View>
        : tone === 'wrong' ? <Icon name="alert" size={32} color={d.red} /> : <Icon name="alert" size={30} color={d.lavenderText} />}
      <Text style={s.title}>{title}</Text>
    </View>
    {short ? <Text style={s.short}>{short}</Text> : null}
    {assisted ? <Text style={ds.small}>Köməklə qeyd olundu.</Text> : null}
    {corrections?.length ? <Text style={ds.small}>Cavab qəbul olundu. Kiçik yazı düzəlişi: {corrections.map(c => `${c.before} → ${c.after}`).join(', ')}</Text> : null}
    {answers ? <View style={s.answerBox}><Text style={s.answerText}><Text style={{ fontWeight: '800' }}>Uyğun cavab: </Text>{answers}</Text></View> : null}
    {onExplain || actions ? <View style={s.actions}>{actions}{onExplain ? <Capsule small icon="bulb" label="Mənə başa sal" onPress={onExplain} /> : null}</View> : null}
    {button}
  </View>;
}

export function ExplainSheet({ visible, explain, onClose, onReport }: { visible: boolean; explain?: Graded['explain']; onClose: () => void; onReport: () => void }) {
  if (!explain) return null;
  const row = (label: string, text: string, mine?: boolean) => <View style={s.exRow} key={label}>
    <Text style={ds.label}>{label}</Text>
    <View style={[s.exBox, mine && s.exMine]}><Text style={ds.strong}>{text}</Text></View>
  </View>;
  return <Sheet visible={visible} onClose={onClose} dismissible={false} title="Mənə başa sal" icon="bulb" tall right={<Capsule small tone="outline" icon="flag" label="Xəta bildir" onPress={onReport} />}>
    {row('Sənin cavabın', explain.yourAnswer, true)}
    {row('Uyğun cavablar', explain.answers)}
    {row('Səbəb', explain.reason)}
    {row('Qısa qayda', explain.rule)}
    {row('Yeni nümunə', explain.example)}
  </Sheet>;
}

const REPORT_KEY = 'birtalk.errorReports.v1';
const reasons = ['Cavabım səhv qiymətləndirildi', 'Səs və ya mikrofon problemi', 'Mətndə səhv var', 'Başqa problem'];

/** “Xəta bildir”: saved on the device only; there is no server for reports yet. */
export function ReportSheet({ visible, onClose, context }: { visible: boolean; onClose: () => void; context: Record<string, string> }) {
  const [reason, setReason] = useState(''), [note, setNote] = useState(''), [saved, setSaved] = useState(''), [busy, setBusy] = useState(false);
  const close = () => { setReason(''); setNote(''); setSaved(''); onClose(); };
  const save = async () => {
    setBusy(true);
    try {
      const list = JSON.parse((await AsyncStorage.getItem(REPORT_KEY)) || '[]') as unknown[];
      await AsyncStorage.setItem(REPORT_KEY, JSON.stringify([...list.slice(-49), { ...context, reason, note: note.trim(), at: new Date().toISOString() }]));
      setSaved('Təşəkkürlər! Bildiriş bu telefonda saxlanıldı.');
    } catch { setSaved('Bildiriş saxlanmadı. Yenidən cəhd et.'); }
    finally { setBusy(false); }
  };
  return <Sheet visible={visible} onClose={close} title="Xəta bildir" icon="flag">
    {saved ? <Text accessibilityLiveRegion="polite" style={ds.strong}>{saved}</Text> : <>
      {reasons.map(r => <Pressable key={r} accessibilityRole="radio" accessibilityState={{ selected: reason === r }} onPress={() => setReason(r)} style={[s.reason, reason === r && s.reasonOn]}>
        <View style={[s.radio, reason === r && { borderColor: d.purple }]}>{reason === r ? <View style={s.dot} /> : null}</View><Text style={ds.strong}>{r}</Text>
      </Pressable>)}
      <TextInput accessibilityLabel="Əlavə qeyd" value={note} onChangeText={setNote} placeholder="Əlavə qeyd (istəyə bağlı)" placeholderTextColor="#9C8BB8" multiline maxLength={400} style={s.note} />
      <MainButton label="Göndər" disabled={!reason || busy} onPress={() => void save()} />
    </>}
  </Sheet>;
}

/** Small ⋮ dropdown. */
export function MenuPopover({ visible, onClose, items, top }: { visible: boolean; onClose: () => void; top: number; items: { label: string; icon: 'alert' | 'muted'; onPress: () => void }[] }) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable accessibilityLabel="Menyunu bağla" style={StyleSheet.absoluteFill} onPress={onClose} />
    <View style={[s.menu, shadow, { top }]}>
      {items.map((item, i) => <Pressable key={item.label} accessibilityRole="menuitem" onPress={() => { onClose(); item.onPress(); }} style={[s.menuItem, i > 0 && { borderTopWidth: 1, borderTopColor: d.border }]}>
        <Icon name={item.icon} size={22} color={d.ink} /><Text style={s.menuText}>{item.label}</Text>
      </Pressable>)}
    </View>
  </Modal>;
}

const s = StyleSheet.create({
  panel: { backgroundColor: '#F4EEFD', borderRadius: 26, borderWidth: 1, borderColor: d.border, padding: 18, paddingTop: 8, gap: 10 },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#C5ADF2' },
  topRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8 },
  close: { width: 36, height: 36, borderRadius: 18, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  title: { color: d.ink, fontSize: 24, fontWeight: '800', flexShrink: 1 },
  short: { color: d.lavenderText, fontSize: 16, lineHeight: 22, fontWeight: '600' },
  answerBox: { borderRadius: radius.field, backgroundColor: d.purpleSoft, paddingVertical: 10, paddingHorizontal: 14 },
  answerText: { color: d.ink, fontSize: 16, lineHeight: 22 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' },
  exRow: { gap: 4, borderTopWidth: 1, borderTopColor: d.border, paddingTop: 8 },
  exBox: { borderRadius: 14, backgroundColor: d.purpleSoft, paddingVertical: 10, paddingHorizontal: 14 },
  exMine: { backgroundColor: d.redSoft, borderLeftWidth: 5, borderLeftColor: d.red },
  reason: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingHorizontal: 14, borderRadius: radius.field, borderWidth: 1, borderColor: d.border, backgroundColor: d.surface },
  reasonOn: { borderColor: d.purple, borderWidth: 2 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: d.borderStrong, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: d.purple },
  note: { minHeight: 80, borderRadius: radius.field, borderWidth: 1, borderColor: d.borderStrong, backgroundColor: d.surface, padding: 12, fontSize: 16, color: d.ink, textAlignVertical: 'top' },
  menu: { position: 'absolute', right: 16, minWidth: 220, borderRadius: 18, backgroundColor: '#F7F2FE', borderWidth: 1, borderColor: d.border, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 52, paddingHorizontal: 16 },
  menuText: { color: d.ink, fontSize: 17, fontWeight: '600' },
});
