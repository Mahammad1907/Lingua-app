// Screens for the new task kinds (approved mockups, 13 noyabr 2026).
// Principle: every task is a small conversation — speech bubbles, avatars, a message thread.
// No paired two-column buttons, no 2×2 picture grids, no 3D button shadows, no gradients or emoji.
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { characterAz } from '../../config/characters';
import { sceneImage } from '../../config/sceneImages';
import type { ChatLine, MatchTask, WordCard, Who } from '../../data/designLessonTypes';
import Icon from './Icons';
import { ds } from './parts';
import { d, font, radius, shadow } from './theme';

const mascotHead = require('../../../assets/mascot/hood_head.png');

type Mark = 'correct' | 'wrong' | undefined;
const markColor = (m: Mark, fallback: string) => m === 'correct' ? d.green : m === 'wrong' ? d.red : fallback;

/** Small round avatar: the mascot picture, or the girl's purple / boy's orange colour until their pictures exist. */
export function Avatar({ who, size = 34 }: { who: Who; size?: number }) {
  if (who === 'M') return <Image source={mascotHead} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: d.purpleSoft }} contentFit="contain"
    accessibilityLabel={characterAz('mascot') || 'Dostun'} />;
  const look = who === 'G' ? { backgroundColor: '#E9D9FF', borderColor: d.purple } : who === 'B' ? { backgroundColor: '#FFD9B8', borderColor: d.orange } : { backgroundColor: d.purpleSoft, borderColor: d.borderStrong };
  return <View accessibilityLabel={who === 'G' ? characterAz('girl') || 'Qız' : who === 'B' ? characterAz('boy') || 'Oğlan' : undefined}
    style={[{ width: size, height: size, borderRadius: size / 2, borderWidth: 2 }, look]} />;
}

function Bubble({ line }: { line: ChatLine }) {
  return <View style={s.inRow}>
    <Avatar who={line.from} />
    <View style={s.inBubble}><Text style={s.bubbleText}>{line.text}</Text></View>
  </View>;
}

/** Chat thread for “Dialoqu tamamla” and “Mesaj yaz”. The learner's bubble is the last one. */
export function ChatThread({ partner, from, lines, mine, placeholder, mark, children }: {
  partner: string; from: Who; lines: ChatLine[]; mine: string; placeholder: string; mark?: Mark; children?: ReactNode;
}) {
  return <View style={s.thread}>
    <View style={s.threadHead}>
      <Avatar who={from} size={30} />
      <Text style={s.threadName}>{partner}</Text>
    </View>
    <View style={s.threadBody}>
      {lines.map((l, i) => <Bubble key={i} line={l} />)}
      <View accessibilityLabel={mine ? `Sənin cavabın: ${mine}` : placeholder}
        style={[s.outBubble, !mine && s.outEmpty, mark && { backgroundColor: markColor(mark, d.purple), borderColor: markColor(mark, d.purple) }]}>
        <Text style={[s.bubbleText, mine ? { color: '#fff' } : { color: d.lavenderText }]}>{mine || placeholder}</Text>
      </View>
    </View>
    {children}
  </View>;
}

/** Word tiles under the chat. A tapped tile moves into the reply and leaves a dashed place; tapping the place takes the word back. */
export function TileTray({ tiles, picked, onPick, disabled }: { tiles: string[]; picked: number[]; onPick: (i: number) => void; disabled?: boolean }) {
  return <View style={s.tray}>
    {tiles.map((t, i) => {
      const used = picked.includes(i);
      return <Pressable key={i} accessibilityRole="button" accessibilityLabel={used ? `${t}, cavabdan çıxar` : t} accessibilityState={{ disabled }}
        disabled={disabled} onPress={() => onPick(i)} style={({ pressed }) => [used ? s.tileUsed : s.tile, pressed && { transform: [{ scale: .96 }] }]}>
        <Text style={[s.tileText, used && { opacity: 0 }]}>{t}</Text>
      </Pressable>;
    })}
  </View>;
}

/** “Sözü tamamla”: one sentence in a bubble with a gap, options as a row of pills. */
export function GapSentence({ speaker, before, after, options, value, onPick, mark, disabled }: {
  speaker?: Who; before: string; after: string; options: string[]; value: string; onPick: (o: string) => void; mark?: Mark; disabled?: boolean;
}) {
  return <View style={s.inRow}>
    {speaker ? <Avatar who={speaker} size={40} /> : null}
    <View style={{ flex: 1, gap: 14 }}>
      <View style={s.gapBubble}>
        <Text style={s.gapText}>{before}{before ? ' ' : ''}<Text style={[s.gapSlot, mark && { color: markColor(mark, d.purple), backgroundColor: mark === 'correct' ? d.greenSoft : d.redSoft }]}>
          {value ? ` ${value} ` : '      '}</Text>{after.startsWith('.') || after.startsWith('?') || after.startsWith('!') || after.startsWith(',') ? '' : ' '}{after}</Text>
      </View>
      <View style={s.pills}>
        {options.map(o => {
          const on = value === o;
          return <Pressable key={o} accessibilityRole="radio" accessibilityState={{ selected: on, disabled }} disabled={disabled} onPress={() => onPick(o)}
            style={[s.pill, on && s.pillOn, on && mark && { borderColor: markColor(mark, d.purple) }]}>
            <Text style={s.pillText}>{o}</Text>
          </Pressable>;
        })}
      </View>
    </View>
  </View>;
}

/** “Kim nə dedi?”: sentence bubbles with a meaning slot; meanings below. Tap a slot, then a meaning (or just a meaning: it fills the first empty slot). */
export function MatchBoard({ task, pairs, active, onActive, onPlace, marks, disabled }: {
  task: MatchTask; pairs: Record<string, string>; active: string; onActive: (en: string) => void; onPlace: (az: string) => void;
  marks?: Record<string, 'correct' | 'wrong'>; disabled?: boolean;
}) {
  const used = new Set(Object.values(pairs));
  const meanings = [...task.rows.map(r => r.az), ...task.extra].sort((a, b) => a.localeCompare(b, 'az'));
  return <View style={{ gap: 14 }}>
    <View style={{ gap: 12 }}>
      {task.rows.map(r => {
        const value = pairs[r.en], mark = marks?.[r.en], on = active === r.en && !disabled;
        return <View key={r.en} style={s.matchRow}>
          {r.from ? <Avatar who={r.from} size={30} /> : null}
          <View style={s.matchBubble}><Text style={s.matchEn}>{r.en}</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel={value ? `${r.en}: ${value}. Dəyişmək üçün toxun` : `${r.en}: mənası boşdur`} disabled={disabled}
            onPress={() => onActive(r.en)} style={[s.slot, value ? s.slotFilled : s.slotEmpty, on && s.slotActive,
              mark === 'correct' && { backgroundColor: d.greenSoft, borderColor: d.green }, mark === 'wrong' && { backgroundColor: d.redSoft, borderColor: d.red }]}>
            <Text numberOfLines={2} style={[s.slotText, mark && { color: markColor(mark, d.purple) }]}>{value || (on ? '?' : '')}</Text>
          </Pressable>
        </View>;
      })}
    </View>
    <View style={s.meanings}>
      {meanings.map(m => <Pressable key={m} accessibilityRole="button" accessibilityState={{ disabled: disabled || used.has(m) }} disabled={disabled || used.has(m)}
        onPress={() => onPlace(m)} style={[s.meaning, used.has(m) && { opacity: .35 }]}>
        <Text style={s.meaningText}>{m}</Text>
      </Pressable>)}
    </View>
  </View>;
}

/** “Səhnədə tap”: numbered places on the scene picture. Returns null when the picture is not there yet. */
export function SceneSpots({ scenes, spots, value, onPick, mark, disabled }: {
  scenes?: string[]; spots: { option: string; x: number; y: number }[]; value: string; onPick: (o: string) => void; mark?: Mark; disabled?: boolean;
}) {
  const image = sceneImage(scenes);
  if (!image) return null;
  return <View style={s.scene}>
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

/** “Dinlə və təkrarla”: the phrase, with the stressed word in orange. */
export function PhraseCard({ text, stress, note }: { text: string; stress?: string; note?: string }) {
  const parts = stress ? text.split(new RegExp(`(\\b${stress.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b)`)) : [text];
  return <View style={s.phrase}>
    <Text style={s.phraseText}>{parts.map((p, i) => p === stress ? <Text key={i} style={{ color: d.orange }}>{p}</Text> : p)}</Text>
    {note ? <Text style={s.phraseNote}>{note}</Text> : null}
  </View>;
}

/** “Yeni söz”: picture (when ready), the word with sound, pronunciation, meaning and one example. */
export function WordView({ card, onPlay }: { card: WordCard; onPlay: (t: string) => void }) {
  const image = sceneImage(card.scenes);
  return <View style={{ gap: 16 }}>
    <View style={s.newChip}><Text style={s.newChipText}>Yeni söz</Text></View>
    <View style={[s.wordCard, shadow]}>
      {image ? <Image source={image} style={s.wordImage} contentFit="cover" accessibilityIgnoresInvertColors /> : null}
      <View style={s.wordRow}>
        <Text accessibilityRole="header" style={s.word}>{card.word}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Dinlə" onPress={() => onPlay(card.word.replace(/\s*\/\s*/g, '. '))} hitSlop={6} style={s.listen}>
          <Icon name="speaker" size={22} color={d.purple} />
        </Pressable>
      </View>
      <Text style={s.ipa}>{card.pronunciation}</Text>
      <Text style={s.az}>{card.az}</Text>
      {card.note ? <Text style={[ds.body, { textAlign: 'center' }]}>{card.note}</Text> : null}
    </View>
    <Pressable accessibilityRole="button" accessibilityHint="Nümunəni dinlə" onPress={() => onPlay(card.example)} style={s.example}>
      <Text style={s.exampleLabel}>NÜMUNƏ</Text>
      <Text style={s.exampleEn}>{card.example}</Text>
      <Text style={s.exampleAz}>{card.exampleAz}</Text>
    </Pressable>
    <View style={s.saved}><Icon name="doc" size={18} color={d.purple} /><Text style={s.savedText}>“Lüğətim”ə əlavə olundu</Text></View>
  </View>;
}

const s = StyleSheet.create({
  inRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  inBubble: { maxWidth: '78%', paddingHorizontal: 16, paddingVertical: 11, borderRadius: 20, borderBottomLeftRadius: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border },
  bubbleText: { color: d.ink, fontSize: 17, lineHeight: 23, ...font.bold },
  thread: { borderRadius: 24, backgroundColor: d.surface, borderWidth: 1, borderColor: d.border, overflow: 'hidden' },
  threadHead: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: d.purpleSoft },
  threadName: { color: d.ink, fontSize: 15, ...font.extrabold },
  threadBody: { gap: 10, padding: 14, minHeight: 150, justifyContent: 'flex-end' },
  outBubble: { alignSelf: 'flex-end', maxWidth: '82%', minWidth: 90, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 20, borderBottomRightRadius: 6, backgroundColor: d.purple, borderWidth: 2, borderColor: d.purple },
  outEmpty: { backgroundColor: 'transparent', borderStyle: 'dashed', borderColor: d.lavender },
  tray: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: d.purpleSoft },
  tile: { minHeight: 44, minWidth: 44, paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, borderColor: '#C5ADF2', backgroundColor: '#F4EEFD', alignItems: 'center', justifyContent: 'center' },
  tileUsed: { minHeight: 44, minWidth: 44, paddingHorizontal: 16, borderRadius: 22, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#C5ADF2' },
  tileText: { color: d.ink, fontSize: 17, ...font.bold },
  gapBubble: { paddingHorizontal: 20, paddingVertical: 18, borderRadius: 24, borderBottomLeftRadius: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border },
  gapText: { color: d.ink, fontSize: 26, lineHeight: 38, ...font.extrabold },
  gapSlot: { color: d.purple, backgroundColor: d.purpleSoft },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { minHeight: 46, paddingHorizontal: 22, borderRadius: 23, borderWidth: 1, borderColor: '#C5ADF2', backgroundColor: '#fff', justifyContent: 'center' },
  pillOn: { borderWidth: 2, borderColor: d.purple, backgroundColor: d.purpleSoft },
  pillText: { color: d.ink, fontSize: 19, ...font.extrabold },
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
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
  scene: { width: '100%', aspectRatio: 1.1, borderRadius: 24, overflow: 'hidden', backgroundColor: d.purpleSoft, borderWidth: 1, borderColor: d.border },
  spot: { position: 'absolute', width: 40, height: 40, marginLeft: -20, marginTop: -20, borderRadius: 20, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  spotText: { fontSize: 18, ...font.extrabold },
  phrase: { alignItems: 'center', gap: 6, padding: 18, borderRadius: radius.card, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border },
  phraseText: { color: d.ink, fontSize: 26, lineHeight: 34, textAlign: 'center', ...font.extrabold },
  phraseNote: { color: d.inkSoft, fontSize: 14, textAlign: 'center', ...font.semibold },
  newChip: { alignSelf: 'flex-start', backgroundColor: d.orangeSoft, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 },
  newChipText: { color: '#B4530A', fontSize: 14, ...font.extrabold },
  wordCard: { alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 18, paddingBottom: 20, borderRadius: 26, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border },
  wordImage: { width: '100%', height: 170, borderRadius: 18, backgroundColor: d.purpleSoft },
  wordRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  word: { color: d.purple, fontSize: 36, lineHeight: 44, textAlign: 'center', ...font.extrabold },
  listen: { width: 44, height: 44, borderRadius: 22, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  ipa: { color: d.inkSoft, fontSize: 15, marginTop: -6, ...font.semibold },
  az: { color: d.ink, fontSize: 22, textAlign: 'center', ...font.extrabold },
  example: { gap: 6, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 18, backgroundColor: d.surface, borderWidth: 1, borderColor: d.border },
  exampleLabel: { color: d.lavenderText, fontSize: 13, letterSpacing: .5, ...font.extrabold },
  exampleEn: { color: d.ink, fontSize: 18, ...font.extrabold },
  exampleAz: { color: d.inkSoft, fontSize: 15, ...font.semibold },
  saved: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  savedText: { color: d.inkSoft, fontSize: 14, ...font.bold },
});
