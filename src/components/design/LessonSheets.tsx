import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Graded } from '../../utils/designLesson';
import { englishWords, glossOf } from '../../data/unit1/glossary';
import Icon from './Icons';
import { Capsule, MainButton, Sheet, ds, nameSlot } from './parts';
import { d, radius, shadow, font } from './theme';

/** Inline result panel: correct (green) / wrong (red) / neutral (not assessed). Locks until “Davam et”. */
export function ResultPanel({ tone, title, short, answers, corrections, assisted, onExplain, onReport, onContinue, continueLabel = 'Davam et', actions, collapsed, onCollapse }: {
  tone: 'correct' | 'wrong' | 'neutral'; title: string; short?: string; answers?: string; corrections?: Graded['spellingCorrections']; assisted?: boolean;
  onExplain?: () => void; onReport: () => void; onContinue?: () => void; continueLabel?: string; actions?: ReactNode; collapsed: boolean; onCollapse: () => void;
}) {
  const button = onContinue ? <MainButton label={continueLabel} tone={tone === 'correct' ? 'green' : tone === 'wrong' ? 'red' : 'purple'} onPress={onContinue} /> : null;
  if (collapsed) return <View style={{ gap: 10 }}>{button}</View>;
  return <View style={[s.panel, shadow]}>
    <View style={s.handle} />
    <View accessibilityLiveRegion="polite" style={s.titleRow}>
      {tone === 'correct' ? <View style={[s.badge, { borderColor: d.green, backgroundColor: d.greenSoft }]}><Icon name="check" size={20} color={d.green} stroke={2.6} /></View>
        : tone === 'wrong' ? <Icon name="alert" size={32} color={d.red} /> : <Icon name="alert" size={30} color={d.lavenderText} />}
      <Text style={s.title}>{title}</Text>
    </View>
    {short ? <Text style={s.short}>{short}</Text> : null}
    {assisted ? <Text style={ds.small}>Köməklə qeyd olundu.</Text> : null}
    {corrections?.length ? <Text style={ds.small}>Cavab qəbul olundu. Kiçik yazı düzəlişi: {corrections.map(c => `${c.before} → ${c.after}`).join(', ')}</Text> : null}
    {answers ? <View style={s.answerBox}><Text style={s.answerText}><Text style={{ ...font.extrabold }}>Uyğun cavab: </Text>{nameSlot(answers)}</Text></View> : null}
    <View style={s.actions}>
      <Pressable accessibilityRole="button" accessibilityLabel="Xəta bildir" onPress={onReport} hitSlop={6} style={s.flag}><Icon name="flag" size={18} color={d.lavenderText} /></Pressable>
      <View style={{ flex: 1 }} />
      {actions}{onExplain ? <Capsule small icon="bulb" label="Mənə başa sal" onPress={onExplain} /> : null}
    </View>
    {button}
  </View>;
}

/** Is this text an English sentence we can explain word by word? */
function englishSentence(text: string) {
  const words = englishWords(text);
  const known = words.filter(w => glossOf(w)).length;
  return words.length > 0 && known >= Math.max(1, Math.ceil(words.length * .6)) ? words : undefined;
}

export function ExplainSheet({ visible, explain, onClose, onReport, onSay }: { visible: boolean; explain?: Graded['explain']; onClose: () => void; onReport: () => void; onSay?: (t: string) => void }) {
  const [open, setOpen] = useState('');
  if (!explain) return null;
  const row = (label: string, body: ReactNode, mine?: boolean) => <View style={s.exRow} key={label}>
    <Text style={ds.label}>{label}</Text>
    <View style={[s.exBox, mine && s.exMine]}>{typeof body === 'string' ? <Text style={ds.strong}>{body}</Text> : body}</View>
  </View>;
  // Word by word: the first accepted English answer, each word with its meaning and job.
  const right = englishSentence(explain.answers.split(/\s+\/\s+|;\s*/)[0]);
  const mine = englishSentence(explain.yourAnswer);
  const rightSet = new Set((right ?? []).map(w => w.toLowerCase()));
  const yours = mine && right ? <Text style={ds.strong}>{mine.map((w, i) => {
    const lw = w.toLowerCase(); const extra = !rightSet.has(lw); const moved = !extra && right[i]?.toLowerCase() !== lw;
    return <Text key={i} style={extra ? s.wordExtra : moved ? s.wordMoved : undefined}>{w}{i < mine.length - 1 ? ' ' : ''}</Text>;
  })}</Text> : explain.yourAnswer;
  const legend = mine && right ? <Text style={ds.small}><Text style={s.wordExtra}>qırmızı</Text> — artıq və ya səhv söz · <Text style={s.wordMoved}>narıncı</Text> — yeri dəyişib</Text> : null;
  return <Sheet visible={visible} onClose={onClose} dismissible={false} title="Mənə başa sal" icon="bulb" tall
    right={<Pressable accessibilityRole="button" accessibilityLabel="Xəta bildir" onPress={onReport} hitSlop={6} style={s.flag}><Icon name="flag" size={18} color={d.lavenderText} /></Pressable>}>
    {row('Sənin cavabın', <View style={{ gap: 4 }}>{typeof yours === 'string' ? <Text style={ds.strong}>{yours}</Text> : yours}{legend}</View>, true)}
    {row('Uyğun cavablar', nameSlot(explain.answers))}
    {right ? row('Söz-söz', <View style={{ gap: 8 }}>
      <View style={s.wordRow}>{right.map((w, i) => <Pressable key={i} accessibilityRole="button" accessibilityHint="Mənasını gör və dinlə" onPress={() => { setOpen(w); onSay?.(w); }}
        style={[s.wordChip, open === w && s.wordChipOn]}><Text style={[s.wordChipText, open === w && { color: '#fff' }]}>{w}</Text></Pressable>)}</View>
      {right.map(w => glossOf(w)).some(Boolean) ? <View style={{ gap: 4 }}>{right.map((w, i) => { const g = glossOf(w); return g ? <Text key={i} style={[ds.body, open === w && { color: d.purple }]}>
        <Text style={{ ...font.extrabold }}>{w}</Text> — {g.az}{g.role ? ` (${g.role})` : ''}</Text> : null; })}</View> : null}
    </View>) : null}
    {row('Səbəb', explain.reason)}
    {row('Qısa qayda', explain.rule)}
    {row('Yeni nümunə', nameSlot(explain.example))}
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
  wordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  wordChip: { minHeight: 40, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: d.borderStrong, justifyContent: 'center' },
  wordChipOn: { backgroundColor: d.purple, borderColor: d.purple },
  wordChipText: { color: d.ink, fontSize: 17, ...font.extrabold },
  wordExtra: { color: d.red, textDecorationLine: 'line-through', ...font.extrabold },
  wordMoved: { color: '#C2570A', ...font.extrabold },
  flag: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: d.border, alignItems: 'center', justifyContent: 'center' },
  panel: { backgroundColor: '#F4EEFD', borderRadius: 26, borderWidth: 1, borderColor: d.border, padding: 18, paddingTop: 8, gap: 10 },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#C5ADF2' },
  topRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8 },
  close: { width: 36, height: 36, borderRadius: 18, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  title: { color: d.ink, fontSize: 24, ...font.extrabold, flexShrink: 1 },
  short: { color: d.ink, fontSize: 16, lineHeight: 22, ...font.bold },
  answerBox: { borderRadius: radius.field, backgroundColor: d.purpleSoft, paddingVertical: 10, paddingHorizontal: 14 },
  answerText: { color: d.ink, fontSize: 16, ...font.regular, lineHeight: 22 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' },
  exRow: { gap: 4, borderTopWidth: 1, borderTopColor: d.border, paddingTop: 8 },
  exBox: { borderRadius: 14, backgroundColor: d.purpleSoft, paddingVertical: 10, paddingHorizontal: 14 },
  exMine: { backgroundColor: d.redSoft, borderLeftWidth: 5, borderLeftColor: d.red },
  reason: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingHorizontal: 14, borderRadius: radius.field, borderWidth: 1, borderColor: d.border, backgroundColor: d.surface },
  reasonOn: { borderColor: d.purple, borderWidth: 2 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: d.borderStrong, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: d.purple },
  note: { minHeight: 80, borderRadius: radius.field, borderWidth: 1, borderColor: d.borderStrong, backgroundColor: d.surface, padding: 12, fontSize: 16, ...font.regular, color: d.ink, textAlignVertical: 'top' },
  menu: { position: 'absolute', right: 16, minWidth: 220, borderRadius: 18, backgroundColor: '#F7F2FE', borderWidth: 1, borderColor: d.border, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 52, paddingHorizontal: 16 },
  menuText: { color: d.ink, fontSize: 17, ...font.semibold },
});
