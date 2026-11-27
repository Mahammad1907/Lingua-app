// Screens for the new task kinds (approved mockups, 13 noyabr 2026).
// Principle: every task is a small conversation — speech bubbles, avatars, a message thread.
// No paired two-column buttons, no 2×2 picture grids, no 3D button shadows, no gradients or emoji.
import { Image } from 'expo-image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Reanimated, { FadeIn, FadeInDown, FadeOut, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { AccessibilityInfo, Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { characterAz, hasCharacterName } from '../../config/characters';
import { missingScenes, sceneImage } from '../../config/sceneImages';
import type { ChatLine, ExplainCard, MatchTask, WordCard, Who } from '../../data/designLessonTypes';
import { glossOf } from '../../data/unit1/glossary';
import Icon, { type IconName } from './Icons';
import { ds, KindChip, nameSlot, Pop, tapHaptic, Waveform } from './parts';
import { useArtFit } from './fit';
import { d, font, radius, shadow } from './theme';

const mascotHead = require('../../../assets/mascot/hood_head.png');
const mascotFull = require('../../../assets/mascot/hood_full.png');

type Mark = 'correct' | 'wrong' | undefined;
const markColor = (m: Mark, fallback: string) => m === 'correct' ? d.greenText : m === 'wrong' ? d.redText : fallback;

/** Round avatar: the mascot picture, or the girl's purple / boy's orange circle with an initial until their pictures exist. */
export function Avatar({ who, size = 34 }: { who: Who; size?: number }) {
  // The head picture sits inside the circle with a margin, so the hood is never cut by the circle's edge.
  if (who === 'M') return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' }}>
    <Image source={mascotHead} style={{ width: size * .8, height: size * .8 }} contentFit="contain" accessibilityLabel={characterAz('mascot') || 'Maskot'} />
  </View>;
  const role = who === 'G' ? 'girl' as const : who === 'B' ? 'boy' as const : undefined;
  const name = role ? characterAz(role) || (role === 'girl' ? 'Qız' : 'Oğlan') : '';
  const look = who === 'G' ? { bg: '#EFE3FF', ring: d.purple, body: '#8E63E8', hair: '#5B1FD1' } : who === 'B' ? { bg: '#FFEBD6', ring: d.orange, body: '#F27A12', hair: '#7A3A0A' } : { bg: d.purpleSoft, ring: d.borderStrong, body: '#B9AED0', hair: '#8C7FA6' };
  return <View accessibilityLabel={name || undefined}
    style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: look.ring, backgroundColor: look.bg, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }}>
    <Svg width={size * .86} height={size * .78} viewBox="0 0 40 36">
      <Path d="M4 36c1-8 7-12 16-12s15 4 16 12z" fill={look.body} />
      <Circle cx={20} cy={15} r={8.5} fill="#F6D2B8" />
      {who === 'G' ? <Path d="M11 16c0-7 4-11 9-11s9 4 9 11c-2-4-5-6-9-6s-7 2-9 6zM10 15c-1 5 0 9 2 11M30 15c1 5 0 9-2 11" fill={look.hair} stroke={look.hair} strokeWidth={2} />
        : <Path d="M11.5 14c0-6 4-9 8.5-9s8.5 3 8.5 9c-2-3-5-4.5-8.5-4.5s-6.5 1.5-8.5 4.5z" fill={look.hair} />}
    </Svg>
  </View>;
}

/** English text whose known words can be tapped (meaning + sound). Other characters stay plain. */
export function TapText({ text: raw, style, onWord }: { text: string; style: any; onWord?: (w: string) => void }) {
  const text = nameSlot(raw);
  if (!onWord) return <Text style={style}>{text}</Text>;
  const parts = text.split(/(\s+)/);
  return <Text style={style}>{parts.map((p, i) => {
    const word = p.replace(/^[“"(]+|[.,!?”")…]+$/g, '');
    return word && glossOf(word) ? <Text key={i} onPress={() => onWord(word)} suppressHighlighting={false} style={{ textDecorationLine: 'underline', textDecorationStyle: 'dotted', textDecorationColor: d.lavenderMist }}>{p}</Text> : p;
  })}</Text>;
}

/** Temporary dashed frame where a picture will go (docs/SEKIL_SIYAHISI.md). */
export function ImageSlot({ scenes, height = 150 }: { scenes?: string[]; height?: number }) {
  const notes = missingScenes(scenes);
  const art = useArtFit();
  if (!notes.length) return null;
  // Temporary, deliberately loud marker so the user sees every place that waits for a picture.
  return <View style={[s.imageSlot, { minHeight: Math.round(height * art) }]} accessibilityLabel="Burada şəkil olacaq">
    {notes.map(n => <Text key={n} style={s.slotNote}>ŞƏKİL {n}</Text>)}
  </View>;
}

/** Round sound buttons used everywhere, icons only (user, 13 Nov 2026): purple play and the turtle (slow). */
/** THE listening button (rule G6, 24 Nov 2026): every “listen” control uses this same round button and the ▶ icon. */
export function SoundButton({ onPress, size = 48, playing, label = 'Dinlə', soft }: { onPress: () => void; size?: number; playing?: boolean; label?: string; soft?: boolean }) {
  // soft (25 Nov 2026): lavender round with a purple ▶ — used inside white cards (Uyğunlaşdır). Same ▶ icon everywhere.
  return <Pop accessibilityRole="button" accessibilityLabel={playing ? 'Dinləmə gedir' : label} onPress={() => { tapHaptic(); onPress(); }} hitSlop={4}
    style={[s.playRound, soft && { backgroundColor: d.purpleSoft }, { width: size, height: size, borderRadius: size / 2 }]}>
    <View style={{ marginLeft: size * .06 }}><SoundIcon size={size * .46} color={soft ? d.purple : '#fff'} /></View>
  </Pop>;
}
/** The listening icon itself, for places that draw their own round (rule G6). */
export function SoundIcon({ size = 22, color = '#fff' }: { size?: number; color?: string }) {
  return <Icon name="play" size={size} color={color} />;
}
export const PlayButton = SoundButton;
export function SlowButton({ onPress, size = 48 }: { onPress: () => void; size?: number }) {
  return <Pressable accessibilityRole="button" accessibilityLabel="Yavaş dinlə" onPress={onPress} hitSlop={4}
    style={({ pressed }) => [s.slowRound, { width: size, height: size, borderRadius: size / 2 }, pressed && { opacity: .85 }]}>
    <Icon name="turtle" size={size * .55} color={d.purple} />
  </Pressable>;
}

/** What the other person says (approved audio card): avatar, the sentence with play + wave under it, turtle on the right. */
export function SayBubble({ who, text, onPlay, onSlow, playing, onWord }: { who: Who; text: string; onPlay?: () => void; onSlow?: () => void; playing?: boolean; onWord?: (w: string) => void }) {
  return <View style={[s.sayCard, shadow]}>
    <Avatar who={who} size={56} />
    <View style={{ flex: 1, gap: 8 }}>
      <TapText text={text} style={s.sayText} onWord={onWord} />
      {onPlay ? <View style={s.sayAudio}><PlayButton onPress={onPlay} playing={playing} size={44} /><View style={{ flex: 1 }}><Waveform active={playing} height={34} /></View></View> : null}
    </View>
    {onSlow ? <><View style={s.vline} /><SlowButton onPress={onSlow} /></> : null}
  </View>;
}

function Bubble({ line, onWord }: { line: ChatLine; onWord?: (w: string) => void }) {
  return <View style={s.inRow}>
    <Avatar who={line.from} />
    <View style={s.inBubble}><TapText text={line.text} style={s.bubbleText} onWord={onWord} /></View>
  </View>;
}

/** Chat thread for “Dialoqu tamamla” and “Mesaj yaz” (messenger design of 24 Nov 2026): a header with the partner's
 *  avatar, name, “Onlayn” and Kömək; “Bu gün”; their messages on the left with the time; the learner's bubble on the
 *  right. The learner's bubble appears once something is typed (the answer is typed in the field under the chat, one
 *  place only) and gets the time and ✓ only after Yoxla — before that it is not “sent”. */
export function ChatThread({ partner, from, lines, mine, placeholder, mark, chips, onSay, onWord, help, sent, posted, reply, children }: {
  partner: string; from: Who; lines: ChatLine[]; mine: string; placeholder: string; mark?: Mark; chips?: ReactNode; onSay?: (t: string) => void; onWord?: (w: string) => void;
  /** Kömək button, shown in the chat header. */ help?: ReactNode;
  /** The answer was checked: the learner's message counts as sent. */ sent?: boolean; children?: ReactNode;
  /** ↑ was tapped (before Yoxla): the bubble pops into place and the partner “types…” for a moment. */ posted?: boolean;
  /** The partner's reaction, shown only after a correct check (Dərs 1: emoji only; later: taught words). */ reply?: string;
}) {
  const now = new Date(), clock = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const showMine = Boolean(mine || chips);
  return <View style={[s.thread, shadow]}>
    <View style={s.threadHead}>
      <Avatar who={from} size={44} />
      <View style={{ flex: 1 }}>
        <Text style={s.threadName} numberOfLines={1}>{nameSlot(partner)}</Text>
        <Text style={s.threadSub}>Onlayn</Text>
      </View>
      {help}
    </View>
    <View style={s.threadBody}>
      <View style={s.today}><Text style={s.todayText}>Bu gün</Text></View>
      {lines.map((l, i) => {
        // A message without words (👋) is not read aloud.
        const speakable = /[A-Za-z]/.test(l.text) && Boolean(onSay);
        return <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
          <Pressable disabled={!speakable} onPress={() => onSay?.(l.text)} accessibilityHint={speakable ? 'Dinləmək üçün toxun' : undefined} style={{ flexShrink: 1 }}><Bubble line={l} onWord={onWord} /></Pressable>
          <Text style={s.msgTime}>{clock}</Text>
        </View>;
      })}
      {showMine ? <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Pops on={Boolean(posted || sent)}><View accessibilityLabel={mine ? `Sənin cavabın: ${mine}` : placeholder}
          style={[s.outBubble, mark && { backgroundColor: markColor(mark, d.purple), borderColor: markColor(mark, d.purple) }, chips ? s.outChips : null]}>
          {chips ?? <Text style={[s.bubbleText, { color: '#fff' }]}>{nameSlot(mine)}</Text>}
        </View></Pops>
        {sent ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {/* After the check: hear what you wrote. */}
          {onSay && /[A-Za-z]/.test(mine) ? <SoundButton size={28} label={`Dinlə: ${mine}`} onPress={() => onSay(mine)} /> : null}
          <Text style={s.msgTime}>{clock}</Text><Icon name="check" size={16} color={d.purple} /></View> : null}
      </View> : null}
      {posted && !sent ? <TypingDots key={mine} /> : null}
      {sent && mark === 'correct' && reply ? <Reanimated.View entering={FadeInDown.springify().damping(14)} style={s.inRow}>
        <Avatar who={from} /><View style={s.inBubble}><Text style={s.bubbleText}>{reply}</Text></View></Reanimated.View> : null}
    </View>
    {children}
  </View>;
}

/** Springs a just-sent bubble into place (scale 0.85 → 1). */
export function Pops({ on, children }: { on: boolean; children: ReactNode }) {
  const k = useSharedValue(1);
  useEffect(() => { if (on) { k.value = .85; k.value = withSpring(1, { damping: 11, stiffness: 240 }); } }, [on, k]);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: k.value }] }));
  return <Reanimated.View style={a}>{children}</Reanimated.View>;
}

/** The partner “is typing…”: three dots for half a second after the learner sends (25 Nov 2026). */
export function TypingDots({ ms = 500, onDone }: { ms?: number; onDone?: () => void }) {
  const [shown, setShown] = useState(true);
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 420 }), -1, true);
    const id = setTimeout(() => { setShown(false); onDone?.(); }, ms);
    return () => clearTimeout(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const a0 = useAnimatedStyle(() => ({ opacity: .35 + .65 * t.value }));
  const a1 = useAnimatedStyle(() => ({ opacity: 1 - .65 * t.value }));
  if (!shown) return null;
  return <Reanimated.View entering={FadeIn.duration(120)} exiting={FadeOut.duration(120)} accessibilityLabel="Yazır" style={[s.inBubble, { flexDirection: 'row', gap: 5, alignSelf: 'flex-start', paddingVertical: 14 }]}>
    <Reanimated.View style={[s.dot, a0]} /><Reanimated.View style={[s.dot, a1]} /><Reanimated.View style={[s.dot, a0]} />
  </Reanimated.View>;
}

/** The reply being built: each picked word is a chip inside the learner's bubble; tapping it sends it back to its place. */
export function PickedChips({ tiles, picked, onRemove, disabled, placeholder }: { tiles: string[]; picked: number[]; onRemove: (i: number) => void; disabled?: boolean; placeholder: string }) {
  if (!picked.length) return <Text style={[s.bubbleText, { color: d.lavenderText }]}>{placeholder}</Text>;
  return <View style={s.chipsRow}>
    {picked.map(i => <Pressable key={i} accessibilityRole="button" accessibilityLabel={`${tiles[i]}, geri qaytar`} disabled={disabled} onPress={() => onRemove(i)} hitSlop={4} style={s.chip}>
      <Text style={s.chipText}>{nameSlot(tiles[i])}</Text>
    </Pressable>)}
  </View>;
}

/** Word tiles under the chat. Each word keeps its own place: a used word stays there faded; tapping a word says it and adds it. */
export function TileTray({ tiles, picked, onPick, onSay, disabled }: { tiles: string[]; picked: number[]; onPick: (i: number) => void; onSay?: (t: string) => void; disabled?: boolean }) {
  return <View style={s.tray}>
    {tiles.map((t, i) => {
      const used = picked.includes(i);
      return <Pressable key={i} accessibilityRole="button" accessibilityLabel={used ? `${t}, artıq cavabdadır` : t} accessibilityState={{ disabled: disabled || used }}
        disabled={disabled || used} onPress={() => { onSay?.(t); onPick(i); }} style={({ pressed }) => [s.tile, used && s.tileUsed, pressed && { transform: [{ scale: .96 }] }]}>
        <Text style={[s.tileText, used && { color: d.purpleDisabledText }]}>{nameSlot(t)}</Text>
      </Pressable>;
    })}
  </View>;
}

/** “Sözü tamamla”: the speaker says one sentence with a gap; the options sit under it, centred. */
export function GapSentence({ before, after, options, value, onPick, onSay, mark, disabled, pieces, lit = -1, onReplay, onHelp }: {
  speaker?: Who; before: string; after: string; options: string[]; value: string; onPick: (o: string) => void; onSay?: (t: string) => void; mark?: Mark; disabled?: boolean;
  /** After the answer: the full correct sentence in pieces; `lit` is the piece being read (green). */
  pieces?: string[]; lit?: number; onReplay?: () => void; onHelp?: () => void;
}) {
  // Approved picture (25 Nov 2026): the sentence large in the middle, the gap a framed capsule, Dinlə · Kömək under it,
  // the choices as large white capsules at the bottom. Dinlə works only after the check (before, it would give the answer).
  const color = mark === 'correct' ? d.greenText : mark === 'wrong' ? d.redText : d.purple;
  const words = (x: string) => nameSlot(x).split(/\s+/).filter(Boolean);
  const sentence = pieces
    ? <Text style={[s.gapText, s.gapCenter]}>{pieces.map((p, i) => <Text key={i} style={i === lit ? { color: d.greenText, backgroundColor: d.greenSoft } : null}>{nameSlot(p)}{p.endsWith('-') || i === pieces.length - 1 ? '' : ' '}</Text>)}</Text>
    : <View style={s.gapFlow}>
      {words(before).map((w, i) => <Text key={`b${i}`} style={s.gapText}>{w}</Text>)}
      <View style={[s.gapCap, value ? { borderColor: color, backgroundColor: mark === 'correct' ? d.greenSoft : mark === 'wrong' ? d.redSoft : d.purpleSoft } : null]}>
        <Text style={[s.gapText, { color: value ? color : '#B8BCCB' }]}>{value ? nameSlot(value) : '      '}</Text></View>
      {words(after).map((w, i) => <Text key={`a${i}`} style={[s.gapText, i === 0 && /^[.,!?]/.test(w) && { marginLeft: -8 }]}>{w}</Text>)}
    </View>;
  return <View style={{ flex: 1, justifyContent: 'space-between', gap: 18 }}>
    <View style={{ flex: 1, justifyContent: 'center', gap: 22 }}>
      {sentence}
      <View style={s.gapTools}>
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: !onReplay }} disabled={!onReplay} accessibilityLabel="Dinlə" onPress={() => { tapHaptic(); onReplay?.(); }}
          style={({ pressed }) => [s.gapTool, !onReplay && { opacity: .45 }, pressed && { opacity: .8 }]}>
          <SoundIcon size={18} color={d.purple} /><Text style={s.gapToolText}>Dinlə</Text></Pressable>
        {onHelp ? <Pressable accessibilityRole="button" accessibilityLabel="Kömək" onPress={() => { tapHaptic(); onHelp(); }}
          style={({ pressed }) => [s.gapTool, s.gapToolLine, pressed && { opacity: .8 }]}>
          <Icon name="bulb" size={18} color={d.purple} /><Text style={s.gapToolText}>Kömək</Text></Pressable> : null}
      </View>
    </View>
    <View style={s.pills}>
      {options.map(o => {
        const on = value === o;
        return <Pressable key={o} accessibilityRole="radio" accessibilityState={{ selected: on, disabled }} disabled={disabled} onPress={() => { tapHaptic(); onSay?.(o); onPick(o); }}
          style={({ pressed }) => [s.pill, s.softShadow, on && s.pillOn, on && mark && { borderColor: color, backgroundColor: mark === 'correct' ? d.greenSoft : d.redSoft }, pressed && { transform: [{ scale: .96 }] }]}>
          <Text style={[s.pillText, on && { color }]}>{nameSlot(o)}</Text>
        </Pressable>;
      })}
    </View>
  </View>;
}

/** “Kim nə dedi?”: sentence bubbles with a meaning slot; meanings below. Tap a slot, then a meaning (or just a meaning: it fills the first empty slot). */
export function MatchBoard({ task, pairs, active, onActive, onPlace, onSay, marks, disabled }: {
  task: MatchTask; pairs: Record<string, string>; active: string; onActive: (en: string) => void; onPlace: (az: string) => void; onSay?: (t: string) => void;
  marks?: Record<string, 'correct' | 'wrong'>; disabled?: boolean;
}) {
  if (task.mode === 'order' && task.gaps) return <GapBoard task={task} pairs={pairs} active={active} onActive={onActive} onPlace={onPlace} onSay={onSay} marks={marks} disabled={disabled} />;
  if (task.mode === 'order') return <OrderBoard task={task} pairs={pairs} active={active} onActive={onActive} onPlace={onPlace} onSay={onSay} marks={marks} disabled={disabled} />;
  const reply = task.mode === 'reply';
  const used = new Set(Object.values(pairs));
  const meanings = [...task.rows.map(r => r.az), ...task.extra].sort((a, b) => a.localeCompare(b, reply ? 'en' : 'az'));
  // The highlighted slot: the one the learner picked, otherwise the first empty one (where the next answer goes).
  const target = active && !pairs[active] ? active : task.rows.find(r => !pairs[r.en])?.en;
  // Redesign (25 Nov 2026): one white card per sentence (avatar · sentence · ▶, full-width slot under it),
  // then the answers as a borderless 2×2 grid. Green/red only after Yoxla.
  return <View style={{ gap: 14 }}>
    <View style={{ gap: 10 }}>
      {task.rows.map(r => {
        const value = pairs[r.en], mark = marks?.[r.en], on = target === r.en && !disabled && !value;
        const slotStyle = value ? s.mSlotFilled : on ? s.mSlotActive : s.mSlotWaiting;
        return <View key={r.en} style={s.mCard}>
          <View style={s.mTop}>
            {r.avatar ? <View style={s.mAvatar}><Image source={r.avatar} style={{ width: 40, height: 40 }} contentFit="cover" /></View> : <Avatar who={r.from ?? 'other'} size={40} />}
            <Text style={s.mEn} numberOfLines={2}>{nameSlot(r.en)}</Text>
            {onSay ? <SoundButton soft size={38} label={`Dinlə: ${r.en}`} onPress={() => onSay(r.en)} /> : null}
          </View>
          <Pressable accessibilityRole="button" disabled={disabled}
            accessibilityLabel={value ? `${r.en}: ${value}. Silmək üçün toxun` : `${r.en}: ${reply ? 'cavabı' : 'mənası'} boşdur${on ? ', seçilib' : ''}`}
            onPress={() => { tapHaptic(); onActive(r.en); }}
            style={[s.mSlot, slotStyle,
              mark === 'correct' && { backgroundColor: d.greenSoft, borderColor: d.green, borderWidth: 1.5 }, mark === 'wrong' && { backgroundColor: d.redSoft, borderColor: d.red, borderWidth: 1.5 }]}>
            {/* Plain fade (25 Nov 2026): the spring zoom made the answer jump inside the slot. */}
            {value ? <Reanimated.View key={value} entering={FadeIn.duration(180)} style={s.mFilledRow}>
              <Text numberOfLines={2} style={[s.mFilledText, mark && { color: markColor(mark, d.purple) }]}>{nameSlot(value)}</Text>
              {!disabled ? <Icon name="close" size={16} color={d.lavenderText} /> : null}
            </Reanimated.View>
              : <Text style={[s.mPrompt, !on && { opacity: 0 }]}>{reply ? 'Cavabı seç...' : 'Mənasını seç...'}</Text>}
          </Pressable>
        </View>;
      })}
    </View>
    <View style={s.mGrid}>
      {meanings.map(m => {
        const gone = used.has(m);
        return <Reanimated.View key={`${m}|${gone}`} entering={gone ? undefined : FadeIn.duration(180)} style={s.mCell}>
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: disabled || gone }} disabled={disabled || gone}
            onPress={() => { tapHaptic(); if (reply) onSay?.(m); onPlace(m); }}
            style={({ pressed }) => [s.mChip, gone ? s.mChipUsed : shadow, pressed && { transform: [{ scale: .96 }] }]}>
            <Text numberOfLines={2} style={[s.mChipText, gone && { color: d.purpleDisabledText }]}>{nameSlot(m)}</Text>
          </Pressable>
        </Reanimated.View>;
      })}
    </View>
  </View>;
}

/** Same order every time, but never the answer order (so the tray is never already solved). */
function trayOrder(items: string[]): string[] {
  const hash = (t: string) => [...t].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const out = [...items].sort((a, b) => hash(a) - hash(b));
  return out.every((t, i) => t === items[i]) ? [...out.slice(1), out[0]] : out;
}

/** “Söhbəti sırala”: numbered places for each turn (girl left, boy right); tap a bubble below to put it in the next empty place,
 *  tap a placed bubble to send it back. Bubbles speak when tapped. */
function OrderBoard({ task, pairs, active, onActive, onPlace, onSay, marks, disabled }: {
  task: MatchTask; pairs: Record<string, string>; active: string; onActive: (en: string) => void; onPlace: (az: string) => void; onSay?: (t: string) => void;
  marks?: Record<string, 'correct' | 'wrong'>; disabled?: boolean;
}) {
  const used = new Set(Object.values(pairs));
  const tray = trayOrder([...task.rows.map(r => r.az), ...task.extra]);
  const speaker = new Map(task.rows.map(r => [r.az, r.from]));
  return <View style={{ gap: 10 }}>
    {task.rows.map(r => {
      const value = pairs[r.en], mark = marks?.[r.en], right = r.from === 'B';
      const color = mark === 'correct' ? d.greenText : mark === 'wrong' ? d.redText : undefined;
      return <View key={r.en} style={[s.turn, right && { flexDirection: 'row-reverse' }]}>
        <View style={s.turnNo}><Text style={s.turnNoText}>{r.en}</Text></View>
        {r.from ? <Avatar who={r.from} size={34} /> : null}
        <Pressable accessibilityRole="button" disabled={disabled || !value} onPress={() => onActive(r.en)}
          accessibilityLabel={value ? `${r.en}: ${value}. Geri qaytarmaq üçün toxun` : `${r.en}: boş yer`}
          style={[s.turnSlot, value ? s.turnFilled : s.slotEmpty, active === r.en && !value && s.slotActive, color && { borderColor: color, backgroundColor: mark === 'correct' ? d.greenSoft : d.redSoft }]}>
          {value ? <Text style={[s.turnText, color && { color }]}>{nameSlot(value)}</Text> : null}
        </Pressable>
      </View>;
    })}
    <View style={s.orderTray}>
      {tray.filter(t => !used.has(t)).map(t => <Pressable key={t} accessibilityRole="button" accessibilityHint="Dinlə və növbəti boş yerə qoy" disabled={disabled}
        onPress={() => { onSay?.(t); onPlace(t); }} style={({ pressed }) => [s.orderChip, pressed && { transform: [{ scale: .97 }] }]}>
        {speaker.get(t) ? <Avatar who={speaker.get(t)!} size={26} /> : null}
        <Text style={[s.turnText, { flex: 1 }]}>{nameSlot(t)}</Text>
        <View style={s.chipPlay}><SoundIcon size={13} /></View>
      </Pressable>)}
      {used.size === tray.length ? <Text style={[ds.small, { textAlign: 'center' }]}>Hamısı yerindədir. Yoxla.</Text> : null}
    </View>
  </View>;
}

/** “Söhbəti tamamla” (25 Nov 2026): the conversation stands in order, each line misses one taught word.
 *  Tap a gap (or just pick — the next empty gap fills), choose the word below; tap a filled gap to take it back. */
function GapBoard({ task, pairs, active, onActive, onPlace, onSay, marks, disabled }: {
  task: MatchTask; pairs: Record<string, string>; active: string; onActive: (en: string) => void; onPlace: (az: string) => void; onSay?: (t: string) => void;
  marks?: Record<string, 'correct' | 'wrong'>; disabled?: boolean;
}) {
  const used = Object.values(pairs);
  const tray = trayOrder([...task.rows.map(r => r.az), ...task.extra]);
  const target = active && !pairs[active] ? active : task.rows.find(r => !pairs[r.en])?.en;
  const left = (w: string) => tray.filter(x => x === w).length - used.filter(x => x === w).length;
  // Bigger bubbles and chips (user, 25 Nov 2026: “the screen is empty, the cards are small”); the fit still shrinks long talks.
  return <View style={{ gap: 14 }}>
    {task.rows.map(r => {
      const value = pairs[r.en], mark = marks?.[r.en], right = r.from === 'B', on = target === r.en && !disabled && !value;
      const color = mark === 'correct' ? d.greenText : mark === 'wrong' ? d.redText : d.purple;
      const [before, after] = (r.line ?? '___').split('___');
      return <View key={r.en} style={[s.turn, right && { flexDirection: 'row-reverse' }]}>
        {r.from ? <Avatar who={r.from} size={42} /> : null}
        <View style={[s.gapBubble, right && { borderBottomRightRadius: 6, borderBottomLeftRadius: 18 }]}>
          <Text style={[s.turnText, s.gapLine]}>{nameSlot(before)}
            <Text accessibilityRole="button" onPress={disabled ? undefined : () => { tapHaptic(); onActive(r.en); }}
              accessibilityLabel={value ? `${value}. Geri qaytarmaq üçün toxun` : 'Boşluq'}
              style={[s.gapWord, value ? { color, textDecorationLine: 'none' } : on ? s.gapOn : s.gapEmpty]}>{value ? ` ${value} ` : ' ______ '}</Text>
            {nameSlot(after)}</Text>
        </View>
        {onSay && value ? <SoundButton soft size={38} label="Dinlə" onPress={() => onSay(`${before}${value}${after}`)} /> : null}
      </View>;
    })}
    <View style={s.gapTray}>
      {[...new Set(tray)].map(w => {
        const gone = left(w) <= 0;
        return <Pressable key={w} accessibilityRole="button" accessibilityState={{ disabled: disabled || gone }} disabled={disabled || gone}
          onPress={() => { tapHaptic(); onPlace(w); }} style={({ pressed }) => [s.gapChip, gone ? s.mChipUsed : shadow, pressed && { transform: [{ scale: .96 }] }]}>
          <Text style={[s.mChipText, { fontSize: 18 }, gone && { color: d.purpleDisabledText }]}>{w}</Text>
        </Pressable>;
      })}
    </View>
  </View>;
}

/** “Səhnədə tap”: numbered places on the scene picture. Returns null when the picture is not there yet. */
export function SceneSpots({ scenes, spots, value, onPick, mark, disabled }: {
  scenes?: string[]; spots: { option: string; x: number; y: number }[]; value: string; onPick: (o: string) => void; mark?: Mark; disabled?: boolean;
}) {
  const image = sceneImage(scenes);
  const art = useArtFit();
  if (!image) return null;
  return <View style={[s.scene, art < 1 && { width: `${Math.round(art * 100)}%`, alignSelf: 'center' }]}>
    <Image source={image} style={StyleSheet.absoluteFill} contentFit="cover" accessibilityIgnoresInvertColors />
    {spots.map((sp, i) => {
      const on = value === sp.option;
      const color = on ? markColor(mark, d.purple) : d.purple;
      return <Pressable key={sp.option} accessibilityRole="radio" accessibilityLabel={`${i + 1}: ${sp.option}`} accessibilityState={{ selected: on, disabled }} disabled={disabled}
        onPress={() => onPick(sp.option)} hitSlop={10}
        style={[s.spot, { left: `${sp.x}%`, top: `${sp.y}%`, borderColor: color, backgroundColor: on ? color : '#fff' }, on && { shadowColor: color, shadowOpacity: .4, shadowRadius: 8 }]}>
        <Text style={[s.spotText, { color: on ? '#fff' : d.purple }]}>{i + 1}</Text>
      </Pressable>;
    })}
  </View>;
}

/** “Xəritədə tap” (Bölmə 3, approved mockup 15 Nov 2026): a simple code-drawn map. Only the option countries are numbered
 *  and tappable; their names are never shown (that would give the answer). Azerbaijan is orange with “Sən buradasan”. */
type MapShape = { path: string; pin: [number, number] };
const MAPS: Record<'neighbours' | 'world', { w: number; h: number; sea?: string; home: string; label: [number, number]; shapes: Record<string, MapShape> }> = {
  neighbours: {
    w: 300, h: 200, sea: 'M226 70 Q246 80 240 120 Q236 140 224 128 Q218 100 226 70 Z', home: 'Azerbaijan', label: [186, 122],
    shapes: {
      Russia: { path: 'M8 8 H292 V66 Q220 74 160 62 Q96 70 8 64 Z', pin: [150, 34] },
      Georgia: { path: 'M100 70 Q130 64 160 74 L156 90 Q128 94 104 86 Z', pin: [130, 80] },
      Azerbaijan: { path: 'M160 74 Q186 70 210 80 L206 108 Q182 112 160 102 Z', pin: [184, 92] },
      Turkey: { path: 'M8 96 Q62 88 104 92 Q130 98 150 108 L148 146 Q86 156 8 148 Z', pin: [76, 122] },
      Iran: { path: 'M152 112 Q186 116 212 112 Q250 120 288 134 L284 192 H160 Q148 168 152 112 Z', pin: [222, 160] },
    },
  },
  world: {
    w: 300, h: 180, home: 'Azerbaijan', label: [236, 112],
    shapes: {
      'the USA': { path: 'M10 52 Q50 40 96 50 L92 104 Q60 116 18 104 Z', pin: [54, 78] },
      'the UK': { path: 'M120 34 Q130 28 134 40 L132 58 Q124 62 120 54 Z', pin: [127, 46] },
      England: { path: 'M120 34 Q130 28 134 40 L132 58 Q124 62 120 54 Z', pin: [127, 46] },
      France: { path: 'M128 70 Q142 64 154 70 L152 92 Q138 98 128 90 Z', pin: [141, 81] },
      Germany: { path: 'M146 46 Q160 42 170 48 L168 68 Q156 72 148 66 Z', pin: [158, 57] },
      Russia: { path: 'M176 14 Q236 6 292 16 V60 Q236 66 180 58 Z', pin: [236, 36] },
      Turkey: { path: 'M174 82 Q196 76 216 84 L214 98 Q194 102 176 96 Z', pin: [195, 90] },
      Azerbaijan: { path: 'M222 80 Q230 78 236 84 L234 94 Q226 96 222 92 Z', pin: [229, 87] },
    },
  },
};
/** Bounding box of a map path (M, L, Q, H, V, Z commands only). */
function pathBox(path: string) {
  const xs: number[] = [], ys: number[] = []; let x = 0, y = 0;
  for (const [, cmd, args] of path.matchAll(/([MLQHVZ])([^MLQHVZ]*)/g)) {
    const n = (args.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    if (cmd === 'H') n.forEach(v => { x = v; xs.push(x); ys.push(y); });
    else if (cmd === 'V') n.forEach(v => { y = v; xs.push(x); ys.push(y); });
    else for (let i = 0; i + 1 < n.length; i += 2) { x = n[i]; y = n[i + 1]; xs.push(x); ys.push(y); }
  }
  const x0 = Math.min(...xs) - 2, y0 = Math.min(...ys) - 2;
  return { x: x0, y: y0, w: Math.max(...xs) - x0 + 4, h: Math.max(...ys) - y0 + 4 };
}

/** Simplified flags drawn into a country's box (user, 20 Nov 2026: the map keeps its shape, each country wears its flag). */
function Flag({ name, b }: { name: string; b: { x: number; y: number; w: number; h: number } }) {
  const { x, y, w, h } = b;
  const rows = (colors: string[]) => colors.map((c, i) => <Rect key={i} x={x} y={y + i * h / colors.length} width={w} height={h / colors.length + .5} fill={c} />);
  const cols = (colors: string[]) => colors.map((c, i) => <Rect key={i} x={x + i * w / colors.length} y={y} width={w / colors.length + .5} height={h} fill={c} />);
  const cx = x + w / 2, cy = y + h / 2, u = Math.min(w, h);
  const cross = (c: string, t: number) => <><Rect x={cx - t / 2} y={y} width={t} height={h} fill={c} /><Rect x={x} y={cy - t / 2} width={w} height={t} fill={c} /></>;
  const crescent = (bg: string, r: number, dx = 0) => <><Circle cx={cx + dx} cy={cy} r={r} fill="#fff" /><Circle cx={cx + dx + r * .28} cy={cy} r={r * .8} fill={bg} /></>;
  switch (name) {
    case 'Russia': return <>{rows(['#FFFFFF', '#1C57A5', '#D52B1E'])}</>;
    case 'Iran': return <>{rows(['#239F40', '#FFFFFF', '#DA0000'])}</>;
    case 'Germany': return <>{rows(['#000000', '#DD0000', '#FFCE00'])}</>;
    case 'France': return <>{cols(['#0055A4', '#FFFFFF', '#EF4135'])}</>;
    case 'Azerbaijan': return <>{rows(['#0092BC', '#E4002B', '#00AF66'])}{crescent('#E4002B', u * .12)}</>;
    case 'Turkey': return <><Rect x={x} y={y} width={w} height={h} fill="#E30A17" />{crescent('#E30A17', u * .2, -u * .06)}<Circle cx={cx + u * .2} cy={cy} r={u * .05} fill="#fff" /></>;
    case 'England': return <><Rect x={x} y={y} width={w} height={h} fill="#fff" />{cross('#CE1124', u * .16)}</>;
    // Georgia: the four small crosses keep it apart from England.
    case 'Georgia': return <><Rect x={x} y={y} width={w} height={h} fill="#fff" />{cross('#E8112D', u * .14)}
      {[[.25, .25], [.75, .25], [.25, .75], [.75, .75]].map(([px, py], i) => <G key={i}><Rect x={x + px * w - u * .03} y={y + py * h - u * .1} width={u * .06} height={u * .2} fill="#E8112D" />
        <Rect x={x + px * w - u * .1} y={y + py * h - u * .03} width={u * .2} height={u * .06} fill="#E8112D" /></G>)}</>;
    case 'the UK': return <><Rect x={x} y={y} width={w} height={h} fill="#012169" />
      <Path d={`M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}`} stroke="#fff" strokeWidth={u * .18} /><Path d={`M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}`} stroke="#C8102E" strokeWidth={u * .06} />
      {cross('#fff', u * .26)}{cross('#C8102E', u * .14)}</>;
    case 'the USA': return <>{Array.from({ length: 7 }, (_, i) => <Rect key={i} x={x} y={y + i * h / 7} width={w} height={h / 7 + .5} fill={i % 2 ? '#fff' : '#B22234'} />)}
      <Rect x={x} y={y} width={w * .42} height={h * 4 / 7} fill="#3C3B6E" /></>;
    default: return <Rect x={x} y={y} width={w} height={h} fill="#fff" />;
  }
}

/** “Sən buradasan” without words: a location pin with a slowly widening live ring (still under reduced motion). */
function LivePin({ left, top }: { left: string; top: string }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined; let alive = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(reduce => {
      if (!alive || reduce) return;
      loop = Animated.loop(Animated.timing(pulse, { toValue: 1, duration: 1600, easing: Easing.out(Easing.quad), useNativeDriver: true }));
      loop.start();
    });
    return () => { alive = false; loop?.stop(); };
  }, [pulse]);
  return <View pointerEvents="none" accessibilityLabel="Sən buradasan" style={{ position: 'absolute', left: left as `${number}%`, top: top as `${number}%`, width: 0, height: 0, alignItems: 'center', justifyContent: 'center' }}>
    <Animated.View style={{ position: 'absolute', width: 34, height: 34, borderRadius: 17, backgroundColor: d.orange,
      opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [.45, 0] }), transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [.4, 1.4] }) }] }} />
    <View style={{ position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: d.orange, borderWidth: 2.5, borderColor: '#fff' }} />
    <Svg width={24} height={30} viewBox="0 0 24 30" style={{ position: 'absolute', top: -36 }}>
      <Path d="M12 29 C12 29 2 17.5 2 11 A10 10 0 0 1 22 11 C22 17.5 12 29 12 29 Z" fill={d.orange} stroke="#fff" strokeWidth={2} />
      <Circle cx={12} cy={11} r={3.6} fill="#fff" />
    </Svg>
  </View>;
}

/** “Müəllim izahı” (approved mockup 20 Nov 2026): mascot bubble, numbered parts, “Diqqət et”. */
/** Colours the English forms (Hello, Hi …) inside an Azerbaijani sentence. */
function marked(text: string, forms: string[], style: object) {
  if (!forms.length) return text;
  const set = new Set(forms);
  return text.split(/([A-Za-z']+)/).map((part, i) => set.has(part) ? <Text key={i} style={style}>{part}</Text> : part);
}

/** “Müəllim izahı” (design of 24 Nov 2026): caption + big title, mascot bubble, form cards side by side with the
 *  same sound button, an optional Səmimi … Rəsmi scale, the explanation in a white card and the “Diqqət” box. */
/** Müəllim izahı phrase card (25 Nov 2026): tapping it (or its ▶) plays the phrase, pops the card, glows its border
 *  lavender and shows a small Glow Line for a moment. */
function FormCard({ on, onPlay, label, children }: { on: boolean; onPlay: () => void; label: string; children: (play: () => void) => ReactNode }) {
  const [lit, setLit] = useState(false);
  const k = useSharedValue(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const play = () => {
    tapHaptic(); onPlay(); setLit(true);
    k.value = withSequence(withTiming(1.04, { duration: 110 }), withSpring(1, { damping: 10, stiffness: 220 }));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLit(false), 1500);
  };
  const a = useAnimatedStyle(() => ({ transform: [{ scale: k.value }] }));
  return <Reanimated.View style={[s.tvForm, on ? s.tvFormOn : null, lit && s.tvFormLit, a]}>
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={play} style={{ gap: 4 }}>
      {children(play)}
      <View style={{ height: 16, marginTop: 2 }}>{lit ? <Waveform active height={16} /> : null}</View>
    </Pressable>
  </Reanimated.View>;
}

/** A formality marker that glides from the middle to its place when the card opens. */
function ScaleMark({ at, children }: { at: number; children: ReactNode }) {
  const x = useRef(new Animated.Value(.5)).current;
  useEffect(() => { Animated.spring(x, { toValue: at, friction: 8, tension: 50, useNativeDriver: false }).start(); }, [at, x]);
  return <Animated.View style={[s.tvMarkAt, { left: x.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}>{children}</Animated.View>;
}

export function TeacherView({ card, onPlay }: { card: ExplainCard; onPlay: (t: string) => void }) {
  const forms = [...new Set(card.sections.flatMap(sec => [
    ...(sec.pairs ?? []).map(p => p.en.replace(/[!?.,]+$/, '')), ...(sec.scale?.marks ?? []).map(m => m.en)]))].filter(f => /[A-Za-z]/.test(f));
  const heading = card.heading ?? card.sections[0]?.title;
  const crossed = (full: string, drop: string) => {
    const at = full.indexOf(` ${drop}`) + 1 || full.indexOf(drop);
    return <Text style={s.tvBig}>{full.slice(0, at)}<Text style={{ color: d.purpleDisabledText, textDecorationLine: 'line-through' }}>{drop}</Text>{full.slice(at + drop.length)}</Text>;
  };
  const bold = { color: d.ink, ...font.extrabold };
  // The “Diqqət” box slides under the white card above it (design 24 Nov 2026) when the last section has one.
  const lastSec = card.sections[card.sections.length - 1];
  const tucked = Boolean(lastSec && (lastSec.text || lastSec.scale || lastSec.short || lastSec.build));
  return <View style={{ gap: 12 }}>
    <View style={{ gap: 2 }}>
      <KindChip kind="Müəllim izahı" icon="bulb" />
      {heading ? <Text accessibilityRole="header" style={s.tvHeading}>{heading}</Text> : null}
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Avatar who="M" size={52} />
      <View style={s.tvBubble}><View style={s.tvTail} /><Text style={ds.body}>{forms.length ? marked(card.lead, forms, { color: d.purple, ...font.extrabold })
        : (card.focus ? card.lead.split(card.focus) : [card.lead]).map((p, i, all) => <Text key={i}>{p}{i < all.length - 1 ? <Text style={{ color: d.purple, ...font.bold }}>{card.focus}</Text> : null}</Text>)}</Text></View>
    </View>
    {card.sections.map((sec, i) => {
      const label = !card.heading && i > 0 ? <Text style={ds.label}>{sec.title}</Text> : null;
      const pairs = sec.pairs ? <View style={{ flexDirection: 'row', gap: 10 }}>{sec.pairs.map((p, k) => <FormCard key={p.en} on={k % 2 === 1} onPlay={() => onPlay(p.en)} label={`Dinlə: ${p.en}`}>
        {lit => <>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          {p.tag ? <View style={[s.tvTag, k % 2 ? { backgroundColor: d.purpleSoft } : null]}><Text style={[s.tvTagText, k % 2 ? { color: d.purple } : null]} numberOfLines={1}>{p.tag.toLocaleUpperCase('az')}</Text></View> : <View />}
          <SoundButton size={40} label={`Dinlə: ${p.en}`} onPress={lit} />
        </View>
        <Text style={s.tvFormEn} numberOfLines={1} adjustsFontSizeToFit>{nameSlot(p.en)}</Text>
        <Text style={s.tvFormAz}>{p.az}</Text>
        </>}
      </FormCard>)}</View> : null;
      const inner = sec.text || sec.scale || sec.short || sec.build ? <View style={s.tvCard}>
        {label}
        {sec.scale ? <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={s.tvScaleEnd}>{sec.scale.left}</Text><Text style={s.tvScaleEnd}>{sec.scale.right}</Text></View>
          <View style={s.tvScale}>
            <View style={s.tvScaleLine} />
            {sec.scale.marks.length > 1 ? (() => {
              const at = sec.scale!.marks.map(m => m.at), lo = Math.min(...at), hi = Math.max(...at);
              return <View style={[s.tvScaleSpan, { left: `${Math.round(lo * 100)}%`, width: `${Math.round((hi - lo) * 100)}%` }]} />;
            })() : null}
            {sec.scale.marks.map((m, k) => <ScaleMark key={m.en} at={m.at}>
              <View style={[s.tvMark, { backgroundColor: k % 2 ? d.ink : d.purple }]}><Text style={s.tvMarkText}>{m.en}</Text></View></ScaleMark>)}
          </View>
        </View> : null}
        {sec.text ? <Text style={ds.body}>{marked(sec.text, forms, bold)}</Text> : null}
        {sec.short ? <>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {crossed(sec.short.full, sec.short.drop)}<Text style={[s.tvBig, { color: d.purple }]}>→</Text><Text style={[s.tvBig, { color: d.purple }]}>{sec.short.short}</Text>
            <View style={{ flex: 1 }} />
            <SoundButton size={44} onPress={() => onPlay(`${sec.short!.full}. ${sec.short!.short}`)} />
          </View>
          <Text style={[ds.body, { color: d.lavenderText }]}>{sec.short.note}</Text>
        </> : null}
        {sec.build ? <>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>{sec.build.parts.map((p, k) => <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {k ? <Text style={ds.strong}>+</Text> : null}<View style={[s.tvPair, { flex: 0, backgroundColor: k % 2 ? d.orangeSoft : d.purpleSoft }]}><Text style={ds.strong}>{nameSlot(p)}</Text></View></View>)}</View>
          {sec.build.examples.map(e => <View key={e.en} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <SoundButton size={36} label={`Dinlə: ${e.en}`} onPress={() => onPlay(e.en)} />
            <View style={{ flex: 1 }}><Text style={ds.strong}>{nameSlot(e.en)}</Text><Text style={[ds.body, { color: d.lavenderText }]}>{e.az}</Text></View></View>)}
        </> : null}
      </View> : null;
      return <View key={i} style={[{ gap: 8 }, inner ? { zIndex: 1 } : null]}>{pairs && label && !inner ? label : null}{pairs}{inner}</View>;
    })}
    {card.attention ? <View style={[s.tvAttention, tucked && s.tvAttentionTucked]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Icon name="bulb" size={18} color={d.purple} /><Text style={s.tvAttentionTitle}>Diqqət:</Text></View>
      <Text style={ds.body}>{marked(card.attention, forms, bold)}</Text>
    </View> : null}
  </View>;
}

export function CountryMap({ map, options, value, onPick, mark, disabled }: {
  map: 'neighbours' | 'world'; options: string[]; value: string; onPick: (o: string) => void; mark?: Mark; disabled?: boolean;
}) {
  const m = MAPS[map];
  const homeShape = m.shapes[m.home];
  const art = useArtFit();
  const drawn = Object.entries(m.shapes).filter(([name]) => !(name === 'England' && !options.includes('England')) && !(name === 'the UK' && options.includes('England')));
  return <View style={[s.mapBox, art < 1 && { width: `${Math.round(art * 100)}%`, alignSelf: 'center' }]} accessibilityLabel="Xəritə: nömrəli ölkəyə toxun">
    <Svg width="100%" height="100%" viewBox={`0 0 ${m.w} ${m.h}`}>
      <Rect x={0} y={0} width={m.w} height={m.h} rx={14} fill="#E3EEFB" />
      {m.sea ? <Path d={m.sea} fill="#C9DDF6" /> : null}
      <Defs>{drawn.map(([name, sh]) => <ClipPath key={name} id={`${map}-${name.replace(/\W/g, '')}`}><Path d={sh.path} /></ClipPath>)}</Defs>
      {drawn.map(([name, sh]) => {
        const option = options.includes(name);
        const home = name === m.home;
        const on = option && value === name;
        const stroke = on ? markColor(mark, d.purple) : home ? d.orange : '#3A2E55';
        return <G key={name} onPress={option && !disabled ? () => onPick(name) : undefined}>
          <G clipPath={`url(#${map}-${name.replace(/\W/g, '')})`} opacity={option || home ? 1 : .35}><Flag name={name} b={pathBox(sh.path)} /></G>
          <Path d={sh.path} fill="none" stroke={stroke} strokeOpacity={option || home ? 1 : .35} strokeWidth={on ? 3 : home ? 2.5 : 1.4} strokeLinejoin="round" />
        </G>;
      })}
    </Svg>
    {homeShape ? <LivePin left={`${(homeShape.pin[0] / m.w) * 100}%`} top={`${(homeShape.pin[1] / m.h) * 100}%`} /> : null}
    {options.map((o, i) => {
      const sh = m.shapes[o];
      if (!sh) return null;
      const on = value === o;
      const color = on ? markColor(mark, d.purple) : d.purple;
      return <Pressable key={o} accessibilityRole="radio" accessibilityLabel={`${i + 1}`} accessibilityState={{ selected: on, disabled }} disabled={disabled}
        onPress={() => onPick(o)} hitSlop={12}
        style={[s.spot, { left: `${(sh.pin[0] / m.w) * 100}%`, top: `${(sh.pin[1] / m.h) * 100}%`, borderColor: color, backgroundColor: on ? color : '#fff' }, on && { shadowColor: color, shadowOpacity: .4, shadowRadius: 8 }]}>
        <Text style={[s.spotText, { color: on ? '#fff' : d.purple }]}>{i + 1}</Text>
      </Pressable>;
    })}
  </View>;
}

/** “Dinlə və təkrarla”: the phrase, with the stressed word in orange. */
export function PhraseCard({ text, stress, note, reading }: { text: string; stress?: string; note?: string; reading?: string }) {
  const parts = stress ? text.split(new RegExp(`(\\b${stress.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b)`)) : [text];
  return <View style={s.phrase}>
    <Text style={s.phraseText}>{parts.map((p, i) => p === stress ? <Text key={i} style={{ color: d.orangeText }}>{p}</Text> : nameSlot(p))}</Text>
    {reading ? <Reading text={reading} /> : null}
    {note ? <Text style={s.phraseNote}>{note}</Text> : null}
  </View>;
}

/** Azerbaijani-letter reading; **th** parts are bold (no Azerbaijani letter for that sound). */
export function Reading({ text, left }: { text: string; left?: boolean }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return <Text style={[s.reading, left && { textAlign: 'left' }]} accessibilityLabel={`Oxunuşu: ${text.replace(/\*/g, '')}`}>
    {/* th in orange on the purple reading line — the approved card look the user asked back (25 Nov 2026). */}
    {parts.map((p, i) => p.startsWith('**') ? <Text key={i} style={{ ...font.extrabold, color: d.orangeText }}>{p.slice(2, -2)}</Text> : p)}
  </Text>;
}

function InfoRow({ icon, label, children, first, tight }: { icon: IconName; label: string; children: ReactNode; first?: boolean; tight?: boolean }) {
  return <View style={[s.infoRow, !first && s.infoLine, tight && { paddingVertical: 6 }]}>
    <View style={s.infoIcon}><Icon name={icon} size={18} color={d.purple} /></View>
    <View style={{ flex: 1, gap: tight ? 2 : 4 }}><Text style={s.rowLabel}>{label.toLocaleUpperCase('az')}</Text>{children}</View>
  </View>;
}

/** Text with “[ad]”-style slots shown as a soft lavender inline pill (25 Nov 2026). */
export function Slotted({ text, style }: { text: string; style: any }) {
  return <Text style={style}>{nameSlot(text).split(/(\[[^\]]+\])/).map((p, i) => p.startsWith('[') ? <Text key={i} style={s.slotPill}>{` ${p} `}</Text> : p)}</Text>;
}

/** “[ad]” inside a pattern is the name slot, shown in lavender. */
function Pattern({ text, small }: { text: string; small?: boolean }) {
  return <View style={[s.pattern, small && { paddingVertical: 4, paddingHorizontal: 12 }]}><Text style={[s.patternText, small && { fontSize: 15 }]}>{text.split(/(\[[^\]]+\])/).map((p, i) => p.startsWith('[') ? <Text key={i} style={{ color: d.lavender }}>{p}</Text> : p)}</Text></View>;
}

/** Teaching card (approved “İlk salam” design): purple banner with the mascot and the phrase in a bubble,
 *  then Mənası · Oxunuşu · Quruluşu · other phrases · Qeyd · Nümunə rows. Used for Yeni söz and Öyrən cards. */
export function LearnView({ chip, title, lead, phrases, az, reading, ipa, structure, notes, example, scenes, dialog, shortForm, onPlay, onWord, rate = 1, onRate, playing, dense, glossParts }: {
  chip: string; title?: string; lead?: string; phrases: string[]; az: string; reading?: string; ipa?: string; structure?: string[];
  notes?: string[]; example?: { en: string; az: string }; scenes?: string[];
  /** A short conversation (girl and boy take turns) instead of one phrase in the banner. */
  dialog?: { en: string; az: string }[];
  /** Yeni söz: “Where is → Where's” shown as one compact row inside the card. */
  shortForm?: { full: string; short: string };
  onPlay: (t: string, rate?: number) => void; onWord?: (w: string) => void;
  /** Lesson speed (1x → 0.75x → 0.5x → 1.25x), shared with every normal sound button. */ rate?: number; onRate?: () => void; playing?: boolean;
  /** Compact rows — only when the card does not fit at normal size (decided by the lesson screen). */ dense?: boolean;
  /** The word-by-word strip is shown under the card, so a word-by-word note would only repeat it. */ glossParts?: boolean;
}) {
  // Approved simple card (user, 13 Nov 2026): one phrase, its reading in the bubble, then Mənası · (Quruluşu) · Nümunə · one short note.
  // No scrolling, no phonetic line (that stays in the word pop-up and Lüğətim).
  const image = sceneImage(scenes);
  const spoken = phrases.join('. ');
  const long = phrases.join(' ').length > 16;
  // Yeni söz cards must fit the screen without scrolling (user, 21 Nov 2026): no picture slot, tighter rows.
  const word = chip === 'Yeni söz';
  const oneLine = word && phrases.length > 1 && phrases.join(' · ').length <= 18;
  // Roomy by default; compact only on cards that would not fit (user, 25 Nov 2026: “why is it squeezed”).
  const tight = Boolean(dense);
  const art = useArtFit();
  void ipa;
  // No repeats on Yeni söz (user, 25 Nov 2026): a Quruluşu that only restates the phrase and a note that only glosses
  // the words (the strip below already does) are hidden. Rows keep their natural size (approved picture, 25 Nov 2026).
  const bare = (x: string) => x.toLowerCase().replace(/[^a-z' ]/g, '').replace(/\s+/g, ' ').trim();
  const showStructure = Boolean(structure?.length) && !(word && structure!.every(p => phrases.some(ph => bare(ph) === bare(p))));
  // A pure gloss: only “word — meaning” pairs (after an optional “Who’s = Who is:” lead). Notes with any other hint stay.
  const pureGloss = (n: string) => { const pieces = n.replace(/^[^:=]+=[^:]+:\s*/, '').replace(/\.$/, '').split(/[,;]\s*/);
    return pieces.length >= 2 && pieces.every(piece => /^[A-Za-z’'.]+ — [^:“”.]+$/.test(piece.trim())); };
  // A note that only restates the Qısa forma row (“Where's — where is-in qısası”) is hidden too (user, 25 Nov 2026).
  const restatesShort = (n: string) => Boolean(shortForm) && /qısa/i.test(n) && n.toLowerCase().includes(shortForm!.short.toLowerCase().replace('’', "'"));
  const note = notes?.[0] && !(glossParts && pureGloss(notes[0])) && !restatesShort(notes[0].replace(/’/g, "'")) ? notes[0] : '';
  return <View style={{ gap: 10 }}>
    <View style={{ gap: 4 }}>
      <KindChip kind={chip} icon={chip === 'Yeni söz' ? 'tag' : 'layers'} />
      {title ? <Text accessibilityRole="header" style={ds.title}>{title}</Text> : null}
      {lead ? <Text style={ds.subtitle}>{lead}</Text> : null}
    </View>
    {word ? null : image ? <Image source={image} style={[s.wordImage, { height: Math.round(170 * art) }]} contentFit="cover" accessibilityIgnoresInvertColors /> : <ImageSlot scenes={scenes} height={44} />}
    {dialog ? <View style={[s.info, shadow, { paddingVertical: 10, gap: 10 }]}>{dialog.map((l, i) => <View key={l.en} style={s.moreRow}>
      <Avatar who={i % 2 ? 'B' : 'G'} size={40} />
      <View style={{ flex: 1 }}><TapText text={l.en} style={s.dialogEn} onWord={onWord} /><Text style={s.moreAz}>{l.az}</Text></View>
      <PlayButton onPress={() => onPlay(l.en)} size={40} label={`Dinlə: ${l.en}`} />
    </View>)}</View> : <View style={[s.banner, word ? [s.bannerWhite, s.softShadow] : shadow]}>
      {/* No mascot on Yeni söz cards (user, 20 Nov 2026): the phrase gets the full width. */}
      {chip === 'Yeni söz' ? null : <Image source={mascotFull} style={{ width: 78, height: 96 }} contentFit="contain" accessibilityLabel="Maskot" />}
      <View style={[s.bannerBubble, word && { paddingVertical: 20, gap: 8 }, tight && { paddingVertical: 8, gap: 4 }]}>
        {/* Short phrase pairs on one line: “Hello! · Hi!” (user, 25 Nov 2026). */}
        {(oneLine ? [phrases.join(' · ')] : phrases).map(p => <Text key={p} accessibilityRole="header" style={[s.bannerText, long && { fontSize: 24, lineHeight: 30 }, tight && phrases.length > 1 && !oneLine && { fontSize: 22, lineHeight: 27 }]}>{nameSlot(p)}</Text>)}
        {reading ? <Reading text={reading} /> : null}
        {/* The approved purple-framed card is back (user, 25 Nov 2026); ▶ + the lesson speed button in place of the turtle. */}
        {/* Yeni söz: white card, ▶ and the speed in one capsule (approved picture, 25 Nov 2026). */}
        <View style={word ? s.audioCapsule : s.bannerAudio}><PlayButton onPress={() => onPlay(spoken)} size={44} label={playing ? 'Dinləmə gedir' : 'Dinlə'} />
          {onRate && word ? <View style={s.capsuleBar} /> : null}
          {onRate ? <Pressable accessibilityRole="button" accessibilityLabel={`Sürət ${rate}x. Dəyişmək üçün toxun`} onPress={() => { tapHaptic(); onRate(); }} style={({ pressed }) => [word ? s.speedPlain : s.speedRound, pressed && { opacity: .8 }]}>
            <Text style={s.capRateText}>{rate}x</Text></Pressable> : null}
        </View>
      </View>
    </View>}
    <View style={[s.info, word ? s.softShadow : shadow, word && s.infoTight]}>
      {dialog ? null : <InfoRow first icon="tag" label="Mənası" tight={tight}><Slotted text={az} style={[s.infoStrong, tight && { fontSize: 18, lineHeight: 23 }]} /></InfoRow>}
      {shortForm ? <View style={[s.infoRow, s.infoLine, { alignItems: 'center', paddingVertical: 6 }]} accessibilityLabel="Qısa forma">
        {/* Short forms are explained where they first appear, without grammar terms (20 Nov 2026). */}
        <View style={s.infoIcon}><Icon name="layers" size={20} color={d.purple} /></View>
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Text style={s.rowLabel}>QISA FORMA</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={`Dinlə: ${shortForm.full}`} onPress={() => onPlay(shortForm.full)} style={s.sfChip}><Text style={s.sfWord}>{shortForm.full}</Text></Pressable>
            <Text style={s.sfWord}>→</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={`Dinlə: ${shortForm.short}`} onPress={() => onPlay(shortForm.short)} style={[s.sfChip, s.partChipNew]}><Text style={[s.sfWord, { color: d.purple }]}>{shortForm.short}</Text></Pressable>
          </View>
          <Text style={s.partAz}>Danışıqda qısa deyilir, mənası eynidir. (') düşən hərfin yerini göstərir.</Text>
        </View>
      </View> : null}
      {showStructure ? <InfoRow icon="layers" label="Quruluşu" tight={tight}><View style={[s.patterns, tight && { gap: 6 }]}>{structure.map(p => <Pattern key={p} text={p} small={tight} />)}</View></InfoRow> : null}
      {example ? <View style={[s.infoRow, !dialog && s.infoLine, { alignItems: 'center' }, tight && { paddingVertical: 6 }]}>
        <View style={s.infoIcon}><Icon name="chat" size={20} color={d.purple} /></View>
        <View style={{ flex: 1, gap: 1 }}><Text style={s.rowLabel}>NÜMUNƏ</Text><TapText text={example.en} style={[s.exampleEn, tight && { fontSize: 17 }]} onWord={onWord} /><Text style={[s.moreAz, word && { color: d.slate }]}>{nameSlot(example.az)}</Text></View>
        <PlayButton onPress={() => onPlay(example.en)} size={40} label="Nümunəni dinlə" />
      </View> : null}
      {note ? <View style={[s.infoRow, (example || !dialog) && s.infoLine, { alignItems: 'center' }, word && s.tipStrip]}>
        <View style={s.infoIcon}><Icon name="bulb" size={20} color={d.purple} /></View>
        <Text style={[s.noteText, { flex: 1 }, tight && { fontSize: 14, lineHeight: 19 }]}>{note}</Text>
      </View> : null}
    </View>
  </View>;
}

/** Söz-söz (25 Nov 2026): an iOS-style segmented control. Every segment keeps its word AND meaning visible (rule:
 *  each new word explained separately); the white pill springs to the tapped word, which is spoken. Up to 4 words per
 *  row — longer phrases wrap into a second row. Under it: the active word's note (th sound). */
function WordParts({ parts, onPlay, thNote }: { parts: { word: string; az: string; fresh?: boolean }[]; onPlay: (t: string) => void; thNote: boolean }) {
  const [active, setActive] = useState(0);
  const rows: typeof parts[] = [];
  for (let i = 0; i < parts.length; i += 4) rows.push(parts.slice(i, i + 4));
  const note = thNote && /th/i.test(parts[active]?.word ?? '') ? 'th — dilin ucu dişlərin arasında, Thank you-dakı kimi.'
    : thNote && parts.some(p => p.fresh && /th/i.test(p.word)) ? 'th — dilin ucu dişlərin arasında, Thank you-dakı kimi.' : '';
  return <View style={[s.parts, s.softShadow]} accessibilityLabel="Söz-söz izah">
    {rows.map((row, r) => <Segments key={r} items={row} active={active - r * 4} onPick={k => { tapHaptic(); setActive(r * 4 + k); onPlay(row[k].word); }} />)}
    {note ? <Text style={s.partNote}><Text style={{ color: d.purple, ...font.extrabold }}>th</Text>{note.slice(2)}</Text> : null}
  </View>;
}
function Segments({ items, active, onPick }: { items: { word: string; az: string; fresh?: boolean }[]; active: number; onPick: (k: number) => void }) {
  const [w, setW] = useState(0);
  const seg = w / Math.max(1, items.length);
  const x = useSharedValue(0), shown = useSharedValue(active >= 0 && active < items.length ? 1 : 0);
  useEffect(() => {
    const on = active >= 0 && active < items.length;
    shown.value = withTiming(on ? 1 : 0, { duration: 160 });
    if (on) x.value = withSpring(active * seg, { damping: 18, stiffness: 220 });
  }, [active, seg, x, shown, items.length]);
  const pill = useAnimatedStyle(() => ({ opacity: shown.value, transform: [{ translateX: x.value }] }));
  return <View style={s.segTrack} onLayout={e => setW(e.nativeEvent.layout.width - 8)}>
    {w > 0 ? <Reanimated.View pointerEvents="none" style={[s.segPill, { width: seg }, pill]} /> : null}
    {items.map((p, k) => <Pressable key={p.word} accessibilityRole="tab" accessibilityState={{ selected: k === active }} accessibilityLabel={`${p.word}, ${p.az}. Dinlə`} onPress={() => onPick(k)} style={s.seg}>
      <Text style={[s.segWord, p.fresh && { color: d.purple }]} numberOfLines={1} adjustsFontSizeToFit>{p.word}</Text>
      <Text style={s.segAz} numberOfLines={1} adjustsFontSizeToFit>{p.az}</Text>
    </Pressable>)}
  </View>;
}

/** “Yeni söz” card on the approved teaching layout. */
export function WordView({ card, onPlay, onWord, rate, onRate, playing, dense }: { card: WordCard; onPlay: (t: string, rate?: number) => void; onWord?: (w: string) => void; rate?: number; onRate?: () => void; playing?: boolean; dense?: boolean }) {
  const parts = wordParts(card);
  // Cards start at the top at full size (centering them made the auto-fit shrink the text — user, 25 Nov 2026).
  return <View style={{ gap: 10 }}>
    <LearnView chip="Yeni söz" phrases={card.word.split(/\s*·\s*/)} az={card.az} reading={card.reading} ipa={card.pronunciation} structure={card.structure}
      notes={card.notes} example={{ en: card.example, az: card.exampleAz }} scenes={card.scenes} shortForm={card.shortForm} onPlay={onPlay} onWord={onWord} rate={rate} onRate={onRate} playing={playing} dense={dense} glossParts={parts.length > 0} />
    {parts.length ? <WordParts parts={parts} onPlay={onPlay} thNote={!card.notes?.some(n => /\bth\b/i.test(n))} /> : null}
  </View>;
}

// Which card first teaches each English word (course order) — a word is “new” only on that card.
let FIRST: Map<string, string> | null = null;
const tokens = (text: string) => (text.match(/[A-Za-z]+(?:'[a-z]+)?/g) ?? []).map(w => w.toLowerCase());
function firstTaught() {
  if (FIRST) return FIRST;
  FIRST = new Map();
  // Lazy require keeps the screen module free of a data import cycle.
  const { designLessons } = require('../../data/designLessons') as typeof import('../../data/designLessons');
  for (const l of designLessons) for (const c of l.cards) if (c.type === 'word') for (const w of tokens(c.word)) if (!FIRST.has(w)) FIRST.set(w, c.id);
  return FIRST;
}
function wordParts(card: WordCard) {
  const words = [...new Set(tokens(card.word))];
  // Single words, letter groups and number groups need no breakdown: the meaning line already says it.
  // Two or three phrases on one card (“Hello! · Hi!”): one segment per phrase with its own meaning (user, 25 Nov 2026).
  if (card.word.includes(' · ')) {
    const phrases = card.word.split(/\s*·\s*/), az = card.az.split(/\s*·\s*/);
    return phrases.length >= 2 && phrases.length <= 4 && az.length === phrases.length && !phrases.every(p => p.replace(/[^A-Za-z]/g, '').length <= 1)
      ? phrases.map((p, i) => ({ word: p, az: az[i], fresh: true })) : [];
  }
  if (words.length < 2 || words.every(w => w.length === 1)) return [];
  const first = firstTaught();
  // Show each word as written in the phrase (“I'm”, “OK”), not in the glossary's lower case.
  const asWritten = (w: string) => card.word.match(new RegExp(`(?:^|[^A-Za-z'’])(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?![A-Za-z])`, 'i'))?.[1] ?? w;
  return words.map(w => { const g = glossOf(w); return g ? { word: asWritten(w), az: g.az, fresh: first.get(w) === card.id } : undefined; })
    .filter((x): x is { word: string; az: string; fresh: boolean } => Boolean(x));
}

const s = StyleSheet.create({
  parts: { gap: 8, padding: 10, borderRadius: 24, backgroundColor: '#fff' },
  segTrack: { flexDirection: 'row', backgroundColor: '#F1F0F7', borderRadius: 16, padding: 4 },
  segPill: { position: 'absolute', left: 4, top: 4, bottom: 4, borderRadius: 12, backgroundColor: '#fff', shadowColor: '#0F172A', shadowOpacity: .1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  seg: { flex: 1, alignItems: 'center', paddingVertical: 6, paddingHorizontal: 4 },
  segWord: { color: d.title, fontSize: 18, ...font.extrabold },
  segAz: { color: d.inkSoft, fontSize: 13, ...font.semibold },
  slotPill: { color: d.purple, backgroundColor: '#F3F0FF', ...font.extrabold },
  softShadow: { shadowColor: '#5B4B9A', shadowOpacity: .08, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  hero: { alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 24, paddingVertical: 16, paddingHorizontal: 14 },
  heroText: { color: d.title, fontSize: 32, lineHeight: 38, textAlign: 'center', ...font.extrabold },
  capsule: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'center', backgroundColor: '#F5F3FF', borderRadius: 999, padding: 5, paddingRight: 16, marginTop: 4 },
  capPlay: { width: 48, height: 48, borderRadius: 24, backgroundColor: d.purple, alignItems: 'center', justifyContent: 'center' },
  capLine: { width: 1, height: 24, backgroundColor: '#DDD6FE' },
  capRate: { minWidth: 48, alignItems: 'center' },
  capRateText: { color: d.purple, fontSize: 17, ...font.extrabold },
  rowLabel: { color: '#64748B', fontSize: 13, letterSpacing: 1, ...font.extrabold },
  tipStrip: { backgroundColor: '#F8F7FC', marginHorizontal: -14, paddingHorizontal: 14, paddingVertical: 8, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  partsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  partChip: { minWidth: 64, maxWidth: 150, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, backgroundColor: d.surface, borderWidth: 1, borderColor: d.border },
  partChipNew: { borderColor: d.purple, backgroundColor: d.purpleSoft },
  partWord: { color: d.ink, fontSize: 17, ...font.extrabold },
  partAz: { color: d.inkSoft, fontSize: 13, ...font.bold },
  partNote: { color: d.ink, fontSize: 14, lineHeight: 20, ...font.semibold, paddingHorizontal: 4 },
  imageSlot: { alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: d.orange, backgroundColor: d.orangeSoft },
  slotNote: { color: '#B4530A', fontSize: 14, textAlign: 'center', ...font.extrabold },
  sayRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  sayCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.card, backgroundColor: d.surface, borderWidth: 1, borderColor: d.border },
  vline: { width: 1, alignSelf: 'stretch', backgroundColor: d.border },
  playRound: { backgroundColor: d.purple, alignItems: 'center', justifyContent: 'center' },
  slowRound: { backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 24, backgroundColor: '#5B2BC9', padding: 12 },
  bannerBubble: { flex: 1, alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 22, paddingVertical: 12, paddingHorizontal: 10 },
  bannerText: { color: d.ink, fontSize: 30, lineHeight: 36, textAlign: 'center', ...font.extrabold },
  bannerAudio: { flexDirection: 'row', gap: 12 },
  bannerWhite: { backgroundColor: '#fff', padding: 0 },
  audioCapsule: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: d.purpleSoft, borderRadius: 999, padding: 4, paddingRight: 16 },
  capsuleBar: { width: 1, height: 22, backgroundColor: '#C4B5FD' },
  speedPlain: { height: 44, justifyContent: 'center' },
  speedRound: { minWidth: 44, height: 44, borderRadius: 22, paddingHorizontal: 8, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  info: { borderRadius: radius.card, backgroundColor: d.surface, borderWidth: 1, borderColor: d.border, paddingHorizontal: 14, paddingVertical: 4 },
  // Yeni söz breakdown card: borderless, soft shadow, hairline rows (25 Nov 2026).
  infoRow: { flexDirection: 'row', gap: 12, paddingVertical: 12 },
  noteText: { color: d.ink, fontSize: 15, lineHeight: 21, ...font.semibold },
  infoLine: { borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  infoTight: { paddingTop: 2, paddingBottom: 0, borderWidth: 0, borderRadius: 24 },
  sfChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: d.surface, borderWidth: 1, borderColor: d.border },
  sfWord: { color: d.ink, fontSize: 15, ...font.extrabold },
  infoIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },
  infoStrong: { color: d.ink, fontSize: 20, lineHeight: 26, ...font.extrabold },
  patterns: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pattern: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: d.purpleSoft },
  patternText: { color: d.ink, fontSize: 17, ...font.extrabold },
  moreRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 2 },
  dialogEn: { color: d.ink, fontSize: 18, lineHeight: 24, ...font.extrabold },
  moreAz: { color: d.lavenderText, fontSize: 15, ...font.bold },
  sayBubble: { flex: 1, gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 22, borderTopLeftRadius: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border },
  sayText: { color: d.ink, fontSize: 20, lineHeight: 27, ...font.extrabold },
  sayAudio: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  outChips: { backgroundColor: d.purpleSoft, borderColor: d.borderStrong, paddingHorizontal: 8, paddingVertical: 8 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end' },
  chip: { minHeight: 40, paddingHorizontal: 14, borderRadius: 14, backgroundColor: d.purple, justifyContent: 'center' },
  chipText: { color: '#fff', fontSize: 17, ...font.extrabold },
  reading: { color: d.purple, fontSize: 17, textAlign: 'center', ...font.extrabold },
  inRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  inBubble: { maxWidth: '78%', paddingHorizontal: 16, paddingVertical: 11, borderRadius: 20, borderBottomLeftRadius: 6, backgroundColor: '#fff', ...shadow, shadowOpacity: .06 },
  bubbleText: { color: d.ink, fontSize: 17, lineHeight: 23, ...font.bold },
  thread: { borderRadius: 24, backgroundColor: '#F7F6FC', borderWidth: 1, borderColor: '#EEF0F5' },
  threadSub: { color: d.inkSoft, fontSize: 13, ...font.semibold },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: d.inkSoft },
  today: { alignSelf: 'center', backgroundColor: '#ECEAF4', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 3 },
  todayText: { color: d.inkSoft, fontSize: 12, ...font.semibold },
  msgTime: { color: d.inkSoft, fontSize: 12, ...font.regular },
  threadHead: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, borderBottomWidth: 1, borderBottomColor: d.purpleSoft },
  threadName: { color: d.ink, fontSize: 17, ...font.extrabold },
  threadBody: { gap: 10, padding: 14, minHeight: 120, justifyContent: 'flex-end' },
  outBubble: { alignSelf: 'flex-end', maxWidth: '82%', minWidth: 90, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 20, borderBottomRightRadius: 6, backgroundColor: d.purple, borderWidth: 2, borderColor: d.purple },
  outEmpty: { backgroundColor: 'transparent', borderStyle: 'dashed', borderColor: d.lavender },
  tray: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: d.purpleSoft },
  tile: { minHeight: 44, minWidth: 44, paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, borderColor: '#C5ADF2', backgroundColor: '#F4EEFD', alignItems: 'center', justifyContent: 'center' },
  tileUsed: { backgroundColor: '#F7F3FC', borderStyle: 'dashed', borderColor: '#DCD0F0' },
  tileText: { color: d.ink, fontSize: 17, ...font.bold },
  gapText: { color: d.ink, fontSize: 32, lineHeight: 44, ...font.extrabold },
  gapCenter: { textAlign: 'center' },
  gapFlow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', columnGap: 9, rowGap: 6 },
  gapCap: { minWidth: 96, minHeight: 52, paddingHorizontal: 14, borderRadius: 999, borderWidth: 2, borderColor: d.purple, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  gapTools: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  gapTool: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 40, paddingHorizontal: 18, borderRadius: 999, backgroundColor: d.purpleSoft },
  gapToolLine: { borderWidth: 1, borderColor: '#DDD6FE' },
  gapToolText: { color: d.purple, fontSize: 15, ...font.extrabold },
  gapSlot: { color: d.purple, backgroundColor: d.purpleSoft },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  pill: { minHeight: 60, minWidth: 100, alignItems: 'center', paddingHorizontal: 24, borderRadius: 30, borderWidth: 2, borderColor: 'transparent', backgroundColor: '#fff', justifyContent: 'center' },
  pillOn: { borderWidth: 2, borderColor: d.purple, backgroundColor: d.purpleSoft },
  pillText: { color: d.ink, fontSize: 21, ...font.extrabold },
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mCard: { backgroundColor: '#fff', borderRadius: 20, padding: 12, gap: 10, ...shadow, shadowOpacity: .07, shadowRadius: 14, shadowOffset: { width: 0, height: 4 } },
  mTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mAvatar: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', backgroundColor: d.purpleSoft },
  mEn: { flex: 1, color: d.ink, fontSize: 17, ...font.extrabold },
  gapLine: { fontSize: 19, lineHeight: 27 },
  gapBubble: { flex: 1, paddingHorizontal: 18, paddingVertical: 16, borderRadius: 18, borderBottomLeftRadius: 6, backgroundColor: '#fff', ...shadow, shadowOpacity: .06 },
  gapWord: { ...font.extrabold, borderRadius: 6 },
  gapOn: { color: d.violet, backgroundColor: '#EDE9FE' },
  gapEmpty: { color: '#B8BCCB', backgroundColor: '#F3F4F8' },
  gapTray: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', paddingTop: 12 },
  gapChip: { minHeight: 54, minWidth: 92, paddingHorizontal: 20, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  mSlot: { minHeight: 46, borderRadius: 12, paddingHorizontal: 14, justifyContent: 'center' },
  mSlotFilled: { borderWidth: 1.5, borderColor: 'transparent', backgroundColor: d.purpleSoft }, // same border width as the empty slot: no shift
  mSlotActive: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: d.violet, backgroundColor: '#F5F3FF' },
  mSlotWaiting: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#E2E8F0', backgroundColor: '#FAFAFC' },
  mFilledRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mFilledText: { flex: 1, color: d.purple, fontSize: 16, ...font.extrabold },
  mPrompt: { color: d.lavenderText, fontSize: 16, ...font.semibold },
  mGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  mCell: { width: '48.5%' },
  mChip: { minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: '#DDD6FE', backgroundColor: '#fff', paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  mChipUsed: { backgroundColor: '#EEF0F5', borderColor: '#EEF0F5' },
  mChipText: { color: d.ink, fontSize: 15, textAlign: 'center', ...font.extrabold },
  matchBubble: { flex: 1, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderBottomLeftRadius: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border },
  matchEn: { color: d.ink, fontSize: 17, ...font.extrabold },
  slot: { width: 120, minHeight: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  slotEmpty: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: d.borderStrong },
  slotFilled: { borderWidth: 1, borderColor: d.borderStrong, backgroundColor: d.purpleSoft },
  slotActive: { borderWidth: 2, borderStyle: 'solid', borderColor: d.purple, backgroundColor: d.purpleSoft },
  slotText: { color: d.purple, fontSize: 15, textAlign: 'center', ...font.extrabold },
  meanings: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12, borderRadius: 18, backgroundColor: d.surface, borderWidth: 1, borderColor: d.border },
  meaning: { minHeight: 44, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#C5ADF2', backgroundColor: '#F4EEFD', justifyContent: 'center' },
  meaningText: { color: d.ink, fontSize: 15, ...font.extrabold },
  turn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  turnNo: { width: 26, height: 26, borderRadius: 13, backgroundColor: d.purple, alignItems: 'center', justifyContent: 'center' },
  turnNoText: { color: '#fff', fontSize: 13, ...font.extrabold },
  turnSlot: { flex: 1, minHeight: 46, borderRadius: 16, justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 8 },
  turnFilled: { backgroundColor: '#fff', borderWidth: 1, borderColor: d.border },
  turnText: { color: d.ink, fontSize: 16, lineHeight: 22, ...font.extrabold },
  orderTray: { gap: 8, padding: 10, borderRadius: 18, backgroundColor: d.surface, borderWidth: 1, borderColor: d.border },
  orderChip: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 46, paddingHorizontal: 10, borderRadius: 14, borderWidth: 1, borderColor: '#C5ADF2', backgroundColor: '#F4EEFD' },
  chipPlay: { width: 26, height: 26, borderRadius: 13, backgroundColor: d.purple, alignItems: 'center', justifyContent: 'center', paddingLeft: 2 },
  scene: { width: '100%', aspectRatio: 1.55, borderRadius: 24, overflow: 'hidden', backgroundColor: d.purpleSoft, borderWidth: 1, borderColor: d.border },
  spot: { position: 'absolute', width: 40, height: 40, marginLeft: -20, marginTop: -20, borderRadius: 20, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  spotText: { fontSize: 18, ...font.extrabold },
  tvTail: { position: 'absolute', left: -7, top: '50%', marginTop: -7, width: 14, height: 14, backgroundColor: '#fff', borderLeftWidth: 1.5, borderBottomWidth: 1.5, borderColor: d.purpleSoft, transform: [{ rotate: '45deg' }] },
  tvScaleSpan: { position: 'absolute', height: 8, borderRadius: 4, backgroundColor: '#B3A9D6' },
  tvHeading: { color: d.ink, fontSize: 30, lineHeight: 36, ...font.extrabold },
  tvForm: { flex: 1, gap: 4, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1.5, borderColor: d.border, padding: 12, ...shadow },
  tvFormOn: { backgroundColor: '#F4EFFF', borderColor: '#B9A4F2' },
  tvFormLit: { borderColor: d.lavenderMist, borderWidth: 2, shadowColor: d.violetLight, shadowOpacity: .28, shadowRadius: 12 },
  tvTag: { flexShrink: 1, backgroundColor: '#EEF0F5', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  tvTagText: { color: d.inkSoft, fontSize: 12, letterSpacing: .4, ...font.extrabold },
  tvFormEn: { color: d.ink, fontSize: 28, ...font.extrabold },
  tvFormAz: { color: d.inkSoft, fontSize: 17, lineHeight: 22, ...font.semibold },
  tvScaleEnd: { color: d.inkSoft, fontSize: 14, ...font.semibold },
  tvScale: { height: 36, justifyContent: 'center' },
  tvScaleLine: { height: 8, borderRadius: 4, backgroundColor: '#E3E0EC' },
  tvMarkAt: { position: 'absolute', top: 0, bottom: 0, width: 120, marginLeft: -60, alignItems: 'center', justifyContent: 'center' },
  tvMark: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5, ...shadow },
  tvMarkText: { color: '#fff', fontSize: 15, ...font.extrabold },
  tvAttention: { gap: 6, backgroundColor: '#F4EFFF', borderRadius: 20, borderWidth: 1, borderColor: '#DCD0FA', padding: 14 },
  tvAttentionTucked: { marginTop: -34, paddingTop: 34 + 14, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTopWidth: 0 },
  tvAttentionTitle: { color: d.purple, fontSize: 16, ...font.extrabold },
  tvBubble: { flex: 1, backgroundColor: '#fff', borderRadius: 18, borderWidth: 1.5, borderColor: d.purpleSoft, paddingHorizontal: 14, paddingVertical: 10, ...shadow },
  tvCard: { backgroundColor: '#fff', borderRadius: 22, borderWidth: 1.5, borderColor: d.purpleSoft, padding: 16, gap: 14, ...shadow },
  tvDivider: { borderTopWidth: 1, borderTopColor: d.purpleSoft, paddingTop: 14 },
  tvPair: { flex: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10 },
  tvBig: { color: d.ink, fontSize: 22, ...font.extrabold },
  tvPlay: { width: 44, height: 44, borderRadius: 22, backgroundColor: d.purple, alignItems: 'center', justifyContent: 'center' },
  mapBox: { width: '100%', aspectRatio: 1.55, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: d.border, backgroundColor: '#E3EEFB' },
  phrase: { alignItems: 'center', gap: 6, padding: 18, borderRadius: radius.card, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border },
  phraseText: { color: d.ink, fontSize: 26, lineHeight: 34, textAlign: 'center', ...font.extrabold },
  phraseNote: { color: d.ink, fontSize: 15, textAlign: 'center', ...font.semibold },
  wordImage: { width: '100%', height: 170, borderRadius: 18, backgroundColor: d.purpleSoft },
  ipa: { color: d.ink, fontSize: 14, ...font.semibold },
  exampleEn: { color: d.ink, fontSize: 18, ...font.extrabold },
});

// ---------- Bölmə 2 screens (14 noyabr 2026) ----------
// “Nömrəni yığ”: a phone keypad. The number appears on a phone-style display in groups of 3–2–2.
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
const groupDigits = (v: string) => v.replace(/(\d{3})(\d{0,3})(\d{0,2})(\d*)/, (_, a, b, c, rest) => [a, b, c, rest].filter(Boolean).join(' ')) || v;
export function PhoneKeypad({ value, onChange, disabled, mark, label }: { value: string; onChange: (v: string) => void; disabled?: boolean; mark?: Mark; label: string }) {
  const color = markColor(mark, d.ink);
  return <View style={n.phone}>
    <View style={[n.display, mark === 'correct' && { borderColor: d.green }, mark === 'wrong' && { borderColor: d.red }]} accessibilityLabel={`${label}: ${value || 'boş'}`}>
      <Text style={n.displayLabel}>{label}</Text>
      <Text style={[n.displayText, { color }, !value && { color: d.purpleDisabledText }]} numberOfLines={1} adjustsFontSizeToFit>{value ? groupDigits(value) : '— — —'}</Text>
    </View>
    <View style={n.keys}>
      {KEYS.map((k, i) => k === '' ? <View key={i} style={n.keySpace} /> : <Pressable key={i} disabled={disabled || (k === '⌫' && !value)}
        accessibilityRole="button" accessibilityLabel={k === '⌫' ? 'Sil' : k}
        onPress={() => onChange(k === '⌫' ? value.slice(0, -1) : (value + k).slice(0, 15))}
        style={({ pressed }) => [n.key, k === '⌫' && n.keyErase, pressed && { backgroundColor: d.purpleSoft, transform: [{ scale: .96 }] }, disabled && { opacity: .5 }]}>
        <Text style={[n.keyText, k === '⌫' && { color: d.purple, fontSize: 22 }]}>{k}</Text>
      </Pressable>)}
    </View>
  </View>;
}

/** “Hərfləri tut”: big letter boxes fill from left to right; tapping a placed letter takes it back. Letters are not voiced (that would give the answer away). */
export function LetterBoard({ letters, picked, onPick, onRemove, disabled, mark, length }: {
  letters: string[]; picked: number[]; onPick: (i: number) => void; onRemove: (i: number) => void; disabled?: boolean; mark?: Mark; length: number;
}) {
  const slots = Math.max(length, picked.length);
  const border = mark === 'correct' ? d.green : mark === 'wrong' ? d.red : d.borderStrong;
  return <View style={{ gap: 18 }}>
    <View style={n.slots} accessibilityLabel={`Cavab: ${picked.map(i => letters[i]).join(' ') || 'boş'}`}>
      {Array.from({ length: slots }, (_, k) => {
        const i = picked[k];
        return <Pressable key={k} disabled={disabled || i === undefined} accessibilityRole="button" accessibilityLabel={i === undefined ? 'Boş yer' : `${letters[i]}, geri qaytar`}
          onPress={() => i !== undefined && onRemove(i)} style={[n.slot, { borderColor: i === undefined ? d.border : border }, i !== undefined && { backgroundColor: '#fff' }]}>
          <Text style={[n.slotText, { color: markColor(mark, d.purple) }]}>{i === undefined ? '' : letters[i]}</Text>
        </Pressable>;
      })}
    </View>
    <View style={n.letters}>
      {letters.map((l, i) => {
        const used = picked.includes(i);
        return <Pressable key={i} disabled={disabled || used} accessibilityRole="button" accessibilityLabel={used ? `${l}, artıq cavabdadır` : l}
          onPress={() => onPick(i)} style={({ pressed }) => [n.letter, used && n.letterUsed, pressed && { transform: [{ scale: .94 }] }]}>
          <Text style={[n.letterText, used && { color: d.purpleDisabledText }]}>{l}</Text>
        </Pressable>;
      })}
    </View>
  </View>;
}

/** “Formanı doldur”: a printed registration form — header band, numbered rows with a line to write on. */
export function FormSheet({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return <View style={[n.form, shadow]}>
    <View style={n.formHead}>
      <Icon name="doc" size={22} color="#fff" />
      <View style={{ flex: 1 }}><Text style={n.formTitle}>{title}</Text>{subtitle ? <Text style={n.formSub}>{subtitle}</Text> : null}</View>
    </View>
    <View style={n.formBody}>{children}</View>
  </View>;
}

const n = StyleSheet.create({
  phone: { gap: 14, alignItems: 'center' },
  display: { alignSelf: 'stretch', borderRadius: 20, borderWidth: 2, borderColor: d.border, backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 10, gap: 2 },
  displayLabel: { color: d.lavenderText, fontSize: 14, ...font.bold },
  displayText: { fontSize: 32, lineHeight: 40, letterSpacing: 2, ...font.extrabold },
  keys: { width: 264, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  key: { width: 80, height: 52, borderRadius: 26, backgroundColor: '#fff', borderWidth: 1.5, borderColor: d.border, alignItems: 'center', justifyContent: 'center' },
  keyErase: { backgroundColor: d.purpleSoft, borderColor: d.purpleSoft },
  keySpace: { width: 80, height: 52 },
  keyText: { color: d.ink, fontSize: 26, ...font.extrabold },
  slots: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  slot: { width: 48, height: 58, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed', backgroundColor: d.surface, alignItems: 'center', justifyContent: 'center' },
  slotText: { fontSize: 30, ...font.extrabold },
  letters: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  letter: { width: 54, height: 54, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1.5, borderColor: d.borderStrong, alignItems: 'center', justifyContent: 'center', ...shadow },
  letterUsed: { backgroundColor: d.surface, borderColor: d.border, shadowOpacity: 0, elevation: 0 },
  letterText: { color: d.purple, fontSize: 26, ...font.extrabold },
  form: { borderRadius: 22, backgroundColor: '#fff', overflow: 'hidden', borderWidth: 1, borderColor: d.border },
  formHead: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: d.purple, paddingHorizontal: 16, paddingVertical: 12 },
  formTitle: { color: '#fff', fontSize: 19, letterSpacing: .5, ...font.extrabold },
  formSub: { color: '#E6DAFB', fontSize: 14, ...font.bold },
  formBody: { padding: 16, gap: 14 },
});
