import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Graded } from '../../utils/designLesson';
import { englishWords, glossOf } from '../../data/unit1/glossary';
import Icon from './Icons';
import { Capsule, MainButton, Sheet, ds, nameSlot, tapHaptic } from './parts';
import Reanimated, { SlideInDown } from 'react-native-reanimated';
import { SoundIcon } from './TaskScreens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { d, radius, shadow, font } from './theme';

/** English phrase we can play (Latin letters, no Azerbaijani letters). */
const isEnglish = (x: string) => /[A-Za-z]/.test(x) && !/[əğıöüşçƏĞİÖÜŞÇ]/.test(x);
const splitAnswers = (x: string) => x.split(/\s+\/\s+|;\s*/).map(v => v.trim()).filter(Boolean);

/** One part of a multi-part answer (e.g. the two messages): label, verdict, what the learner wrote, the right answer. */
export interface ResultPart { label: string; ok: boolean; mine?: string; answer: string }

/** Tappable phrase chip with the royal-purple ▶ (pronunciation). */
function SayChip({ text, onSay, tone = 'white' }: { text: string; onSay?: (t: string) => void; tone?: 'white' | 'lavender' }) {
  const playable = Boolean(onSay) && isEnglish(text);
  return <Pressable accessibilityRole="button" accessibilityLabel={playable ? `Dinlə: ${text}` : text} disabled={!playable} onPress={() => { tapHaptic(); onSay?.(text); }} hitSlop={4}
    style={({ pressed }) => [s.chip, tone === 'lavender' && s.chipLav, pressed && { transform: [{ scale: .96 }] }]}>
    {playable ? <SoundIcon size={14} color={d.purple} /> : null}
    <Text style={[s.chipText, tone === 'lavender' && { color: d.purple }]}>{nameSlot(text)}</Text>
  </Pressable>;
}

/** Post-check bottom sheet (25 Nov 2026 design): white sheet with a grabber, icon + title + ⚑ in one row, a short line,
 *  then — wrong: an inline-diff card (✓/✕ per part, or “UYĞUN CAVAB”) and the Qaydaya bax / Mənə başa sal pills;
 *  correct: a mint “TƏLƏFFÜZÜ DİNLƏ” card; neutral (not assessed): grey icon. Green / red / orange gradient CTA.
 *  Kept from before: “Köməklə”, small spelling fixes, meaning, “Təkrarla”, retry and collapse (tap the grabber). */
export function ResultPanel({ tone, title, short, answers, parts, mine, listen, onSay, meaning, repeatFrom, corrections, assisted, onExplain, onRule, onReport, onContinue, continueLabel = 'Davam et', actions, collapsed, onCollapse }: {
  tone: 'correct' | 'wrong' | 'neutral'; title: string; short?: string; answers?: string; meaning?: string; repeatFrom?: string; corrections?: Graded['spellingCorrections']; assisted?: boolean;
  /** Multi-part answers (two-message tasks): one diff row each. */ parts?: ResultPart[];
  /** The learner's single answer, shown struck through on a wrong check when it is English. */ mine?: string;
  /** Correct check: phrases to hear again. */ listen?: string[]; onSay?: (t: string) => void;
  onExplain?: () => void; onRule?: () => void; onReport: () => void; onContinue?: () => void; continueLabel?: string; actions?: ReactNode; collapsed: boolean; onCollapse: () => void;
}) {
  const insets = useSafeAreaInsets();
  const button = onContinue ? <MainButton label={continueLabel} tone={tone === 'correct' ? 'green' : tone === 'wrong' ? 'red' : 'purple'} onPress={onContinue} /> : null;
  if (collapsed) return <View style={{ gap: 10, paddingHorizontal: 20, paddingBottom: Math.max(14, insets.bottom + 6) }}>{button}</View>;
  const say = listen?.filter(isEnglish) ?? [];
  const pills = [onRule ? <Capsule key="r" small align="stretch" tone="neutral" icon="layers" label="Qaydaya bax" onPress={onRule} /> : null, onExplain ? <Capsule key="e" small align="stretch" tone="soft" icon="sparkle" label="Mənə başa sal" onPress={onExplain} /> : null].filter(Boolean);
  return <Reanimated.View entering={SlideInDown.springify().damping(18).stiffness(180)} style={[s.panel, { paddingBottom: Math.max(18, insets.bottom + 8) }]}>
    <Pressable accessibilityRole="button" accessibilityLabel="Paneli kiçilt" onPress={onCollapse} hitSlop={12} style={s.grab}><View style={s.handle} /></Pressable>
    <View accessibilityLiveRegion="polite" style={s.titleRow}>
      <View style={[s.badge, { backgroundColor: tone === 'correct' ? '#22C55E' : tone === 'wrong' ? '#EF4444' : d.purpleDisabledText }]}>
        <Icon name={tone === 'correct' ? 'check' : 'bang'} size={tone === 'correct' ? 20 : 22} color="#fff" stroke={3} />
      </View>
      <Text style={s.title}>{title}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Xəta bildir" onPress={onReport} hitSlop={10} style={s.flag}><Icon name="flag" size={20} color="#A3A8B8" /></Pressable>
    </View>
    {short ? <Text style={s.short}>{short}</Text> : null}
    {assisted ? <Text style={s.note}>Köməklə qeyd olundu.</Text> : null}
    {corrections?.length ? <Text style={s.note}>Kiçik yazı düzəlişi: {corrections.map(c => `${c.before} → ${c.after}`).join(', ')}</Text> : null}

    {tone === 'wrong' && parts?.length ? <View style={s.diff}>{parts.map((p, i) => <View key={p.label} style={[s.diffRow, i > 0 && s.hair]}>
      <Icon name={p.ok ? 'check' : 'close'} size={16} color={p.ok ? '#10B981' : '#EF4444'} stroke={2.8} />
      <Text style={s.diffLabel}>{p.label}:</Text>
      <View style={s.diffBody}>
        {!p.ok && p.mine ? <><Text style={s.struck} numberOfLines={1}>{nameSlot(p.mine)}</Text><Text style={s.arrow}>→</Text></> : null}
        {p.ok ? <><Text style={s.okText} numberOfLines={1}>{nameSlot(p.mine || splitAnswers(p.answer)[0])}</Text><View style={{ flex: 1 }} /><SayChip text={splitAnswers(p.mine || p.answer)[0]} onSay={onSay} /></>
          : splitAnswers(p.answer).slice(0, 2).map(x => <SayChip key={x} text={x} onSay={onSay} tone="lavender" />)}
      </View>
    </View>)}</View>
    : tone === 'wrong' && answers ? <View style={s.diff}>
      <Text style={s.cardLabel}>UYĞUN CAVAB</Text>
      {mine && isEnglish(mine) ? <View style={s.diffBody}><Icon name="close" size={16} color="#EF4444" stroke={2.8} /><Text style={s.struck} numberOfLines={1}>{nameSlot(mine)}</Text><Text style={s.arrow}>→</Text></View> : null}
      <View style={s.chips}>{splitAnswers(answers).slice(0, 4).map(x => <SayChip key={x} text={x} onSay={onSay} tone="lavender" />)}</View>
      {meaning ? <Text style={s.note}>Mənası: {nameSlot(meaning)}</Text> : null}
    </View> : null}

    {tone === 'correct' && say.length ? <View style={s.mint}>
      <Text style={[s.cardLabel, { color: d.greenText }]}>TƏLƏFFÜZÜ DİNLƏ</Text>
      <View style={s.chips}>{say.slice(0, 4).map(x => <SayChip key={x} text={x} onSay={onSay} />)}</View>
    </View> : null}

    {repeatFrom ? <Text style={[s.note, { ...font.bold }]}>Təkrarla: {repeatFrom}</Text> : null}
    {pills.length ? <View style={s.pillRow}>{pills.map((p, i) => <View key={i} style={{ flex: 1 }}>{p}</View>)}</View> : null}
    {actions ? <View style={s.actions}>{actions}</View> : null}
    {button}
  </Reanimated.View>;
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
    {/* Placeholder (user, 25 Nov 2026): reminds us of the AI follow-up. Works once the paid AI server exists (BIRTALK §9); hide before release if still empty. */}
    <View accessibilityRole="button" accessibilityState={{ disabled: true }} accessibilityLabel="Daha çox soruş. Tezliklə" style={s.askSoon}>
      <Icon name="chat" size={18} color={d.purpleDisabledText} /><Text style={s.askSoonText}>Daha çox soruş</Text>
      <View style={s.soonTag}><Text style={s.soonTagText}>tezliklə</Text></View>
    </View>
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
  askSoon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48, borderRadius: 999, borderWidth: 1, borderStyle: 'dashed', borderColor: d.borderStrong, marginTop: 4 },
  askSoonText: { color: d.purpleDisabledText, fontSize: 16, ...font.bold },
  soonTag: { backgroundColor: d.purpleSoft, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  soonTagText: { color: d.lavenderText, fontSize: 12, ...font.bold },
  wordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  wordChip: { minHeight: 40, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: d.borderStrong, justifyContent: 'center' },
  wordChipOn: { backgroundColor: d.purple, borderColor: d.purple },
  wordChipText: { color: d.ink, fontSize: 17, ...font.extrabold },
  wordExtra: { color: d.redText, textDecorationLine: 'line-through', ...font.extrabold },
  wordMoved: { color: '#C2570A', ...font.extrabold },
  flag: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' },
  panel: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingTop: 6, gap: 12,
    shadowColor: '#0F172A', shadowOpacity: .12, shadowRadius: 18, shadowOffset: { width: 0, height: -4 }, elevation: 12 },
  grab: { alignSelf: 'center', paddingVertical: 6, paddingHorizontal: 20 },
  handle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#D9DCE5' },
  note: { color: d.slate, fontSize: 14, lineHeight: 20, ...font.semibold },
  diff: { gap: 10, backgroundColor: '#FFF9F9', borderWidth: 1, borderColor: '#FDE2E4', borderRadius: 18, padding: 14 },
  diffRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  hair: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#F5C9CE', paddingTop: 10 },
  diffLabel: { color: d.inkSoft, fontSize: 15, ...font.semibold },
  diffBody: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  okText: { color: d.title, fontSize: 17, ...font.extrabold, flexShrink: 1 },
  struck: { color: '#E57373', fontSize: 16, ...font.semibold, textDecorationLine: 'line-through', flexShrink: 1 },
  arrow: { color: d.inkSoft, fontSize: 16, ...font.bold },
  cardLabel: { color: d.redText, fontSize: 13, letterSpacing: .8, ...font.extrabold },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 40, paddingHorizontal: 14, borderRadius: 999, backgroundColor: '#fff', ...shadow, shadowOpacity: .1 },
  chipLav: { backgroundColor: d.purpleSoft, shadowOpacity: 0, elevation: 0 },
  chipText: { color: d.title, fontSize: 17, ...font.extrabold },
  mint: { gap: 10, backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', borderRadius: 18, padding: 14 },
  pillRow: { flexDirection: 'row', gap: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8 },
  close: { width: 36, height: 36, borderRadius: 18, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  title: { color: d.title, fontSize: 26, ...font.extrabold, flexShrink: 1 },
  short: { color: d.slate, fontSize: 17, lineHeight: 24, ...font.semibold },
  answerBox: { borderRadius: radius.field, backgroundColor: d.purpleSoft, paddingVertical: 10, paddingHorizontal: 14 },
  answerText: { color: d.ink, fontSize: 16, ...font.regular, lineHeight: 22 },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 8, flexWrap: 'wrap' },
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
