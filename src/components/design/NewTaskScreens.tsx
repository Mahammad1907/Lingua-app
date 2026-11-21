// Three task screens approved as mockups (21 Nov 2026): “Ailə ağacı” (tree), “Söz sürüklə” (drag), “Profil kartı” (profile).
// Code-drawn only (react-native-svg + Views); colours from theme `d`; Animated/PanResponder only; reduced motion = no movement.
import { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import type { DragTask, ProfileTask, TreeTask } from '../../data/designLessonTypes';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import Icon from './Icons';
import { ds, nameSlot } from './parts';
import { PhoneKeypad } from './TaskScreens';
import { d, font, shadow } from './theme';

type Mark = 'correct' | 'wrong' | undefined;
const tone = (m: Mark) => m === 'correct' ? { borderColor: d.green, backgroundColor: d.greenSoft } : m === 'wrong' ? { borderColor: d.red, backgroundColor: d.redSoft } : null;
const ink = (m: Mark, fallback: string) => m === 'correct' ? d.greenText : m === 'wrong' ? d.redText : fallback;

/** Pastel circle with a code-drawn person; `tint` picks one of four theme pairs. */
const TINTS: [string, string][] = [[d.purpleSoft, d.lavender], [d.orangeSoft, d.orange], [d.surfaceStrong, d.inkSoft], [d.surface, d.yellow]];
export function PersonDot({ tint = 0, size = 46, ring }: { tint?: number; size?: number; ring?: string }) {
  const [bg, body] = TINTS[tint % TINTS.length];
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, borderWidth: ring ? 3 : 1.5, borderColor: ring ?? d.border, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }}>
    <Svg width={size * .8} height={size * .72} viewBox="0 0 40 36">
      <Path d="M5 36c1-8 7-12 15-12s14 4 15 12z" fill={body} />
      <Circle cx={20} cy={14} r={8} fill={body} opacity={.75} />
    </Svg>
  </View>;
}

/** One short shake when `on` turns true (skipped with reduced motion). */
function useShake(on: boolean) {
  const reduced = useReducedMotion();
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!on || reduced) return;
    Animated.sequence([3, -3, 2, 0].map(v => Animated.timing(x, { toValue: v, duration: 80, useNativeDriver: true }))).start();
  }, [on, reduced, x]);
  return x;
}

// ---------- “Ailə ağacı” ----------
const NODE = 46;
export function FamilyTree({ task, answer, mark }: { task: TreeTask; answer?: string; mark?: Mark }) {
  const [w, setW] = useState(0);
  const h = 220;
  const at = (id: string) => { const n = task.nodes.find(x => x.id === id); return n ? { x: n.x / 100 * (w - NODE) + NODE / 2, y: n.y / 100 * (h - NODE - 20) + NODE / 2 } : undefined; };
  const label = task.nodes.map(n => n.id === task.target ? 'narıncı halqalı adam: sual' : n.label).filter(Boolean).join(', ');
  return <View accessible accessibilityRole="image" accessibilityLabel={`Ailə ağacı. ${label}`} onLayout={e => setW(e.nativeEvent.layout.width)} style={[t.tree, shadow, { height: h + 16 }]}>
    {w ? <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
      {task.links.map(([a, b]) => {
        const p = at(a), q = at(b); if (!p || !q) return null;
        const mid = (p.y + q.y) / 2;
        const path = Math.abs(p.y - q.y) < 4 ? `M${p.x} ${p.y}H${q.x}` : `M${p.x} ${p.y}V${mid}H${q.x}V${q.y}`;
        return <Path key={`${a}-${b}`} d={path} stroke={d.borderStrong} strokeWidth={2} fill="none" strokeLinecap="round" />;
      })}
    </Svg> : null}
    {w ? task.nodes.map((n, i) => {
      const p = at(n.id)!; const target = n.id === task.target;
      return <View key={n.id} style={[t.node, { left: p.x - 40, top: p.y - NODE / 2 }]}>
        <PersonDot tint={i} ring={target ? (mark === 'correct' ? d.green : mark === 'wrong' ? d.red : d.orange) : undefined} />
        {target ? <View style={[t.ask, mark && { backgroundColor: mark === 'correct' ? d.green : d.red }]}>{mark === 'correct' ? <Icon name="check" size={14} color="#fff" stroke={3} /> : <Text style={t.askText}>?</Text>}</View> : null}
        <Text numberOfLines={1} style={[t.nodeLabel, target && { color: ink(mark, d.orangeText) }]}>{target ? (mark === 'correct' && answer ? nameSlot(answer) : '?') : n.label ? nameSlot(n.label) : ''}</Text>
      </View>;
    }) : null}
  </View>;
}

// ---------- “Söz sürüklə” ----------
type Rect = { x: number; y: number; w: number; h: number };
function DragChip({ word, selected, wrong, disabled, onTap, onDrop, onGrab }: {
  word: string; selected: boolean; wrong: boolean; disabled?: boolean; onTap: () => void; onDrop: (x: number, y: number) => boolean; onGrab: () => void;
}) {
  const reduced = useReducedMotion();
  const pos = useRef(new Animated.ValueXY()).current;
  const cb = useRef({ onTap, onDrop, onGrab, disabled, reduced }); cb.current = { onTap, onDrop, onGrab, disabled, reduced };
  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !cb.current.disabled,
    onPanResponderGrant: () => cb.current.onGrab(),
    onPanResponderMove: Animated.event([null, { dx: pos.x, dy: pos.y }], { useNativeDriver: false }),
    onPanResponderTerminationRequest: () => false,
    onPanResponderRelease: (_e, g) => {
      const moved = Math.abs(g.dx) + Math.abs(g.dy) > 8;
      const placed = moved ? cb.current.onDrop(g.moveX, g.moveY) : false;
      if (!moved) cb.current.onTap();
      if (placed || cb.current.reduced) pos.setValue({ x: 0, y: 0 });
      else Animated.spring(pos, { toValue: { x: 0, y: 0 }, useNativeDriver: false, friction: 6 }).start();
    },
    onPanResponderTerminate: () => pos.setValue({ x: 0, y: 0 }),
  })).current;
  return <Animated.View {...pan.panHandlers} accessible accessibilityRole="button" accessibilityState={{ selected, disabled }}
    accessibilityLabel={`${word}${selected ? ', seçilib' : ''}`} accessibilityHint="Seç, sonra adamın altındakı boş yerə toxun. Və ya sürüklə."
    onAccessibilityTap={onTap} accessibilityActions={[{ name: 'activate' }]} onAccessibilityAction={e => { if (e.nativeEvent.actionName === 'activate') onTap(); }}
    style={[t.chip, selected && t.chipOn, wrong && { borderColor: d.red, borderWidth: 2 }, { transform: pos.getTranslateTransform(), zIndex: 9 }]}>
    <Text style={[t.chipText, wrong && { color: d.redText }]}>{nameSlot(word)}</Text>
  </Animated.View>;
}

function DropSlot({ label, value, mark, active, disabled, onPress, refSet }: {
  label: string; value?: string; mark: Mark; active: boolean; disabled?: boolean; onPress: () => void; refSet: (v: View | null) => void;
}) {
  const shake = useShake(mark === 'wrong');
  const shown = mark === 'wrong' ? undefined : value; // a wrong chip goes back to the tray
  return <Animated.View style={{ transform: [{ translateX: shake }] }}>
    <View ref={refSet} collapsable={false}>
      <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
        accessibilityLabel={`${label}: ${shown ?? (mark === 'wrong' ? 'səhv söz, geri qayıtdı' : 'boş yer')}${shown && !disabled ? '. Geri qaytarmaq üçün toxun' : ''}`}
        style={[t.slot, shown ? t.slotFilled : null, active && !shown && t.slotActive, tone(mark)]}>
        {shown ? <Text numberOfLines={1} style={[t.chipText, { color: ink(mark, d.purple) }]}>{nameSlot(shown)}</Text>
          : mark === 'wrong' ? <Icon name="close" size={18} color={d.redText} /> : null}
      </Pressable>
    </View>
  </Animated.View>;
}

/** placed = person id → chip. Tap a chip then a slot, or drag the chip onto the slot; tap a filled slot to send the chip back. */
export function DragBoard({ task, placed, onChange, marks, disabled, onSay }: {
  task: DragTask; placed: Record<string, string>; onChange: (next: Record<string, string>) => void; marks?: Record<string, 'correct' | 'wrong'>; disabled?: boolean; onSay?: (w: string) => void;
}) {
  const [selected, setSelected] = useState('');
  const refs = useRef<Record<string, View | null>>({});
  const rects = useRef<Record<string, Rect>>({});
  const measure = () => task.people.forEach(p => refs.current[p.id]?.measureInWindow((x, y, w, h) => { rects.current[p.id] = { x, y, w, h }; }));
  const put = (pid: string, word: string) => {
    const next = Object.fromEntries(Object.entries(placed).filter(([k, v]) => v !== word && k !== pid));
    onChange({ ...next, [pid]: word }); setSelected('');
  };
  const live = Object.entries(placed).filter(([pid]) => marks?.[pid] !== 'wrong').map(([, w]) => w);
  const wrongWords = new Set(Object.entries(placed).filter(([pid]) => marks?.[pid] === 'wrong').map(([, w]) => w));
  return <View style={{ gap: 18 }}>
    <View style={t.people}>
      {task.people.map((p, i) => <View key={p.id} style={t.person}>
        <PersonDot tint={i} size={52} />
        {p.label ? <Text numberOfLines={1} style={t.personLabel}>{nameSlot(p.label)}</Text> : null}
        <DropSlot label={p.label || `${i + 1}-ci adam`} value={placed[p.id]} mark={marks?.[p.id]} active={Boolean(selected)} disabled={disabled}
          refSet={v => { refs.current[p.id] = v; }}
          onPress={() => { if (selected) put(p.id, selected); else if (placed[p.id]) { const { [p.id]: _gone, ...rest } = placed; onChange(rest); } }} />
      </View>)}
    </View>
    <View style={t.tray}>
      {task.chips.filter(c => !live.includes(c)).map(c => <DragChip key={c} word={c} selected={selected === c} wrong={wrongWords.has(c)} disabled={disabled}
        onGrab={measure} onTap={() => { onSay?.(c); setSelected(v => v === c ? '' : c); }}
        onDrop={(x, y) => {
          const hit = task.people.find(p => { const r = rects.current[p.id]; return r && x >= r.x - 8 && x <= r.x + r.w + 8 && y >= r.y - 8 && y <= r.y + r.h + 8; });
          if (!hit) return false; put(hit.id, c); return true;
        }} />)}
    </View>
  </View>;
}

// ---------- “Profil kartı” ----------
/** values = row id → chip or digits. The active row's chips (or the keypad for a number row) are shown under the card. */
export function ProfileCard({ task, values, onChange, marks, notes, disabled, onSay }: {
  task: ProfileTask; values: Record<string, string>; onChange: (next: Record<string, string>) => void;
  marks?: Record<string, 'correct' | 'wrong'>; notes?: Record<string, string>; disabled?: boolean; onSay?: (w: string) => void;
}) {
  const [active, setActive] = useState(task.rows[0]?.id ?? '');
  const row = task.rows.find(r => r.id === active);
  const set = (id: string, v: string, advance: boolean) => {
    const next = { ...values, [id]: v }; onChange(next);
    if (advance) setActive(task.rows.find(r => r.id !== id && !next[r.id])?.id ?? id);
  };
  return <View style={{ gap: 14 }}>
    <View style={[t.card, shadow]}>
      <View style={t.cardHead}><PersonDot tint={1} size={56} /><Text style={[ds.strong, { flex: 1 }]}>Profil</Text></View>
      {task.rows.map(r => {
        const m = marks?.[r.id], on = active === r.id && !disabled;
        return <View key={r.id} style={{ gap: 4 }}>
          <Pressable accessibilityRole="button" disabled={disabled} onPress={() => setActive(r.id)} accessibilityState={{ selected: on }}
            accessibilityLabel={`${r.label}: ${values[r.id] || 'boş'}`} accessibilityHint="Bu sətri doldurmaq üçün toxun"
            style={[t.row, on && t.rowOn, tone(m)]}>
            <Text style={t.rowLabel}>{r.label}</Text>
            <Text numberOfLines={1} style={[t.rowValue, { color: ink(m, values[r.id] ? d.ink : d.purpleDisabledText) }]}>{values[r.id] ? nameSlot(values[r.id]) : '—'}</Text>
          </Pressable>
          {m === 'wrong' && notes?.[r.id] ? <Text style={[ds.small, { color: d.redText }]}>{notes[r.id]}</Text> : null}
        </View>;
      })}
    </View>
    {row && !disabled && row.number ? <PhoneKeypad label={row.label} value={values[row.id] ?? ''} onChange={v => set(row.id, v.replace(/\D/g, '').slice(0, 3), false)} /> : null}
    {row && !disabled && !row.number ? <View style={t.tray}>
      {(row.options ?? []).map(o => <Pressable key={o} accessibilityRole="radio" accessibilityState={{ selected: values[row.id] === o }} accessibilityLabel={`${row.label}: ${o}`}
        onPress={() => { onSay?.(o); set(row.id, o, true); }} style={({ pressed }) => [t.chip, values[row.id] === o && t.chipOn, pressed && { transform: [{ scale: .96 }] }]}>
        <Text style={t.chipText}>{nameSlot(o)}</Text>
      </Pressable>)}
    </View> : null}
  </View>;
}

const t = StyleSheet.create({
  tree: { borderRadius: 22, backgroundColor: d.surfaceStrong, borderWidth: 1, borderColor: d.border, overflow: 'visible' },
  node: { position: 'absolute', width: 80, alignItems: 'center', gap: 2 },
  nodeLabel: { color: d.inkSoft, fontSize: 14, ...font.bold },
  ask: { position: 'absolute', top: -6, right: 14, width: 22, height: 22, borderRadius: 11, backgroundColor: d.orange, alignItems: 'center', justifyContent: 'center' },
  askText: { color: '#fff', fontSize: 14, ...font.extrabold },
  people: { flexDirection: 'row', justifyContent: 'space-around', gap: 8 },
  person: { flex: 1, alignItems: 'center', gap: 6, maxWidth: 110 },
  personLabel: { color: d.inkSoft, fontSize: 14, ...font.bold },
  slot: { minWidth: 84, minHeight: 46, borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed', borderColor: d.borderStrong, backgroundColor: d.surface, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  slotFilled: { borderStyle: 'solid', backgroundColor: d.purpleSoft },
  slotActive: { borderColor: d.purple, borderWidth: 2 },
  tray: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  chip: { minHeight: 48, minWidth: 64, paddingHorizontal: 18, borderRadius: 24, borderWidth: 1, borderColor: d.borderStrong, backgroundColor: d.surfaceStrong, alignItems: 'center', justifyContent: 'center' },
  chipOn: { borderWidth: 2, borderColor: d.orange, backgroundColor: d.orangeSoft },
  chipText: { color: d.ink, fontSize: 18, ...font.extrabold },
  card: { borderRadius: 22, backgroundColor: d.surfaceStrong, borderWidth: 1, borderColor: d.border, padding: 14, gap: 10 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5, borderColor: d.border, backgroundColor: d.surface },
  rowOn: { borderColor: d.purple, borderWidth: 2, backgroundColor: d.purpleSoft },
  rowLabel: { width: 52, color: d.lavenderText, fontSize: 15, ...font.extrabold },
  rowValue: { flex: 1, fontSize: 19, ...font.extrabold },
});
