// Screens for the new task kinds (approved mockups, 13 noyabr 2026).
// Principle: every task is a small conversation — speech bubbles, avatars, a message thread.
// No paired two-column buttons, no 2×2 picture grids, no 3D button shadows, no gradients or emoji.
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { characterAz, hasCharacterName } from '../../config/characters';
import { missingScenes, sceneImage } from '../../config/sceneImages';
import type { ChatLine, MatchTask, WordCard, Who } from '../../data/designLessonTypes';
import { glossOf } from '../../data/unit1/glossary';
import Icon from './Icons';
import { ds } from './parts';
import { d, font, radius, shadow } from './theme';

const mascotHead = require('../../../assets/mascot/hood_head.png');

type Mark = 'correct' | 'wrong' | undefined;
const markColor = (m: Mark, fallback: string) => m === 'correct' ? d.green : m === 'wrong' ? d.red : fallback;

/** Round avatar: the mascot picture, or the girl's purple / boy's orange circle with an initial until their pictures exist. */
export function Avatar({ who, size = 34 }: { who: Who; size?: number }) {
  if (who === 'M') return <Image source={mascotHead} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: d.purpleSoft }} contentFit="contain"
    accessibilityLabel={characterAz('mascot') || 'Dostun'} />;
  const role = who === 'G' ? 'girl' as const : who === 'B' ? 'boy' as const : undefined;
  const name = role ? characterAz(role) || (role === 'girl' ? 'Qız' : 'Oğlan') : '';
  const initial = role && hasCharacterName(role) ? name.charAt(0) : role === 'girl' ? 'Q' : role === 'boy' ? 'O' : '•';
  const look = who === 'G' ? { backgroundColor: '#E9D9FF', borderColor: d.purple, color: d.purple } : who === 'B' ? { backgroundColor: '#FFE1C4', borderColor: d.orange, color: '#B4530A' } : { backgroundColor: d.purpleSoft, borderColor: d.borderStrong, color: d.lavenderText };
  return <View accessibilityLabel={name || undefined}
    style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: look.backgroundColor, borderColor: look.borderColor }}>
    <Text style={{ color: look.color, fontSize: size * .42, ...font.extrabold }}>{initial}</Text>
  </View>;
}

/** English text whose known words can be tapped (meaning + sound). Other characters stay plain. */
export function TapText({ text, style, onWord }: { text: string; style: any; onWord?: (w: string) => void }) {
  if (!onWord) return <Text style={style}>{text}</Text>;
  const parts = text.split(/(\s+)/);
  return <Text style={style}>{parts.map((p, i) => {
    const word = p.replace(/^[“"(]+|[.,!?”")…]+$/g, '');
    return word && glossOf(word) ? <Text key={i} onPress={() => onWord(word)} suppressHighlighting={false} style={{ textDecorationLine: 'underline', textDecorationStyle: 'dotted', textDecorationColor: d.borderStrong }}>{p}</Text> : p;
  })}</Text>;
}

/** Temporary dashed frame where a picture will go (docs/SEKIL_SIYAHISI.md). */
export function ImageSlot({ scenes, height = 150 }: { scenes?: string[]; height?: number }) {
  const notes = missingScenes(scenes);
  if (!notes.length) return null;
  return <View style={[s.imageSlot, { minHeight: height }]} accessibilityLabel="Burada şəkil olacaq">
    <Icon name="layers" size={22} color={d.lavender} />
    {notes.map(n => <Text key={n} style={s.slotNote}>Şəkil {n}</Text>)}
  </View>;
}

/** What the other person says: big avatar and a white speech bubble; the sound buttons sit inside the bubble. */
export function SayBubble({ who, text, onPlay, onSlow, playing, onWord }: { who: Who; text: string; onPlay?: () => void; onSlow?: () => void; playing?: boolean; onWord?: (w: string) => void }) {
  return <View style={s.sayRow}>
    <Avatar who={who} size={56} />
    <View style={[s.sayBubble, shadow]}>
      <TapText text={text} style={s.sayText} onWord={onWord} />
      {onPlay ? <View style={s.sayAudio}>
        <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Dinləmə gedir' : 'Dinlə'} onPress={onPlay} style={({ pressed }) => [s.sayPlay, pressed && { opacity: .85 }]}>
          <Icon name="play" size={16} color="#fff" /><Text style={s.sayPlayText}>Dinlə</Text>
        </Pressable>
        {onSlow ? <Pressable accessibilityRole="button" accessibilityLabel="Yavaş dinlə" onPress={onSlow} style={({ pressed }) => [s.saySlow, pressed && { opacity: .85 }]}>
          <Icon name="turtle" size={18} color={d.purple} /><Text style={s.saySlowText}>Yavaş</Text>
        </Pressable> : null}
      </View> : null}
    </View>
  </View>;
}

function Bubble({ line, onWord }: { line: ChatLine; onWord?: (w: string) => void }) {
  return <View style={s.inRow}>
    <Avatar who={line.from} />
    <View style={s.inBubble}><TapText text={line.text} style={s.bubbleText} onWord={onWord} /></View>
  </View>;
}

/** Chat thread for “Dialoqu tamamla” and “Mesaj yaz”. The learner's bubble is the last one. */
export function ChatThread({ partner, lines, mine, placeholder, mark, chips, onSay, onWord, children }: {
  partner: string; from: Who; lines: ChatLine[]; mine: string; placeholder: string; mark?: Mark; chips?: ReactNode; onSay?: (t: string) => void; onWord?: (w: string) => void; children?: ReactNode;
}) {
  return <View style={s.thread}>
    <View style={s.threadHead}><Text style={s.threadName}>{partner}</Text></View>
    <View style={s.threadBody}>
      {lines.map((l, i) => <Pressable key={i} disabled={!onSay} onPress={() => onSay?.(l.text)} accessibilityHint={onSay ? 'Dinləmək üçün toxun' : undefined}><Bubble line={l} onWord={onWord} /></Pressable>)}
      <View accessibilityLabel={mine ? `Sənin cavabın: ${mine}` : placeholder}
        style={[s.outBubble, !mine && !chips && s.outEmpty, mark && { backgroundColor: markColor(mark, d.purple), borderColor: markColor(mark, d.purple) }, chips ? s.outChips : null]}>
        {chips ?? <Text style={[s.bubbleText, mine ? { color: '#fff' } : { color: d.lavenderText }]}>{mine || placeholder}</Text>}
      </View>
    </View>
    {children}
  </View>;
}

/** The reply being built: each picked word is a chip inside the learner's bubble; tapping it sends it back to its place. */
export function PickedChips({ tiles, picked, onRemove, disabled, placeholder }: { tiles: string[]; picked: number[]; onRemove: (i: number) => void; disabled?: boolean; placeholder: string }) {
  if (!picked.length) return <Text style={[s.bubbleText, { color: d.lavenderText }]}>{placeholder}</Text>;
  return <View style={s.chipsRow}>
    {picked.map(i => <Pressable key={i} accessibilityRole="button" accessibilityLabel={`${tiles[i]}, geri qaytar`} disabled={disabled} onPress={() => onRemove(i)} hitSlop={4} style={s.chip}>
      <Text style={s.chipText}>{tiles[i]}</Text>
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
        <Text style={[s.tileText, used && { color: d.purpleDisabledText }]}>{t}</Text>
      </Pressable>;
    })}
  </View>;
}

/** “Sözü tamamla”: one sentence in a bubble with a gap, options as a row of pills. */
export function GapSentence({ speaker, before, after, options, value, onPick, onSay, mark, disabled }: {
  speaker?: Who; before: string; after: string; options: string[]; value: string; onPick: (o: string) => void; onSay?: (t: string) => void; mark?: Mark; disabled?: boolean;
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
          return <Pressable key={o} accessibilityRole="radio" accessibilityState={{ selected: on, disabled }} disabled={disabled} onPress={() => { onSay?.(o); onPick(o); }}
            style={[s.pill, on && s.pillOn, on && mark && { borderColor: markColor(mark, d.purple) }]}>
            <Text style={s.pillText}>{o}</Text>
          </Pressable>;
        })}
      </View>
    </View>
  </View>;
}

/** “Kim nə dedi?”: sentence bubbles with a meaning slot; meanings below. Tap a slot, then a meaning (or just a meaning: it fills the first empty slot). */
export function MatchBoard({ task, pairs, active, onActive, onPlace, onSay, marks, disabled }: {
  task: MatchTask; pairs: Record<string, string>; active: string; onActive: (en: string) => void; onPlace: (az: string) => void; onSay?: (t: string) => void;
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
          <Pressable accessibilityRole="button" accessibilityHint="Dinləmək üçün toxun" onPress={() => onSay?.(r.en)} style={s.matchBubble}><Text style={s.matchEn}>{r.en}</Text></Pressable>
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
export function PhraseCard({ text, stress, note, reading }: { text: string; stress?: string; note?: string; reading?: string }) {
  const parts = stress ? text.split(new RegExp(`(\\b${stress.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b)`)) : [text];
  return <View style={s.phrase}>
    <Text style={s.phraseText}>{parts.map((p, i) => p === stress ? <Text key={i} style={{ color: d.orange }}>{p}</Text> : p)}</Text>
    {reading ? <Reading text={reading} /> : null}
    {note ? <Text style={s.phraseNote}>{note}</Text> : null}
  </View>;
}

/** Azerbaijani-letter reading; **th** parts are bold (no Azerbaijani letter for that sound). */
export function Reading({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return <Text style={s.reading} accessibilityLabel={`Oxunuşu: ${text.replace(/\*/g, '')}`}>
    {parts.map((p, i) => p.startsWith('**') ? <Text key={i} style={{ ...font.extrabold, color: d.orange }}>{p.slice(2, -2)}</Text> : p)}
  </Text>;
}

/** “Yeni söz”: picture (or its temporary frame), the word with sound and slow sound, both readings, meaning, notes and one example. */
export function WordView({ card, onPlay, onWord }: { card: WordCard; onPlay: (t: string, rate?: number) => void; onWord?: (w: string) => void }) {
  const image = sceneImage(card.scenes);
  const spoken = card.word.replace(/\s*·\s*/g, '. ');
  return <View style={{ gap: 14 }}>
    <View style={s.newChip}><Text style={s.newChipText}>Yeni söz</Text></View>
    <View style={[s.wordCard, shadow]}>
      {image ? <Image source={image} style={s.wordImage} contentFit="cover" accessibilityIgnoresInvertColors /> : <ImageSlot scenes={card.scenes} height={120} />}
      <Text accessibilityRole="header" style={s.word}>{card.word}</Text>
      <Text style={s.ipa}>{card.pronunciation}</Text>
      {card.reading ? <Reading text={card.reading} /> : null}
      <View style={s.sayAudio}>
        <Pressable accessibilityRole="button" accessibilityLabel="Dinlə" onPress={() => onPlay(spoken)} style={({ pressed }) => [s.sayPlay, pressed && { opacity: .85 }]}>
          <Icon name="play" size={16} color="#fff" /><Text style={s.sayPlayText}>Dinlə</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Yavaş dinlə" onPress={() => onPlay(spoken, .45)} style={({ pressed }) => [s.saySlow, pressed && { opacity: .85 }]}>
          <Icon name="turtle" size={18} color={d.purple} /><Text style={s.saySlowText}>Yavaş dinlə</Text>
        </Pressable>
      </View>
      <Text style={s.az}>{card.az}</Text>
      {card.notes?.map(n => <Text key={n} style={[ds.body, { textAlign: 'center' }]}>{n}</Text>)}
    </View>
    <Pressable accessibilityRole="button" accessibilityHint="Nümunəni dinlə" onPress={() => onPlay(card.example)} style={s.example}>
      <Text style={s.exampleLabel}>NÜMUNƏ</Text>
      <TapText text={card.example} style={s.exampleEn} onWord={onWord} />
      <Text style={s.exampleAz}>{card.exampleAz}</Text>
    </Pressable>
  </View>;
}

const s = StyleSheet.create({
  imageSlot: { alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, borderRadius: 18, borderWidth: 1.5, borderStyle: 'dashed', borderColor: d.borderStrong, backgroundColor: 'rgba(230,218,251,.45)' },
  slotNote: { color: d.lavenderText, fontSize: 13, textAlign: 'center', ...font.bold },
  sayRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  sayBubble: { flex: 1, gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 22, borderTopLeftRadius: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border },
  sayText: { color: d.ink, fontSize: 20, lineHeight: 27, ...font.extrabold },
  sayAudio: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  sayPlay: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: d.purple },
  sayPlayText: { color: '#fff', fontSize: 15, ...font.extrabold },
  saySlow: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: d.purpleSoft },
  saySlowText: { color: d.purple, fontSize: 15, ...font.extrabold },
  outChips: { backgroundColor: d.purpleSoft, borderColor: d.borderStrong, paddingHorizontal: 8, paddingVertical: 8 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end' },
  chip: { minHeight: 40, paddingHorizontal: 14, borderRadius: 14, backgroundColor: d.purple, justifyContent: 'center' },
  chipText: { color: '#fff', fontSize: 17, ...font.extrabold },
  reading: { color: d.lavenderText, fontSize: 17, textAlign: 'center', ...font.bold },
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
  tileUsed: { backgroundColor: '#F7F3FC', borderStyle: 'dashed', borderColor: '#DCD0F0' },
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
  word: { color: d.purple, fontSize: 36, lineHeight: 44, textAlign: 'center', ...font.extrabold },
  ipa: { color: d.inkSoft, fontSize: 15, marginTop: -6, ...font.semibold },
  az: { color: d.ink, fontSize: 22, textAlign: 'center', ...font.extrabold },
  example: { gap: 6, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 18, backgroundColor: d.surface, borderWidth: 1, borderColor: d.border },
  exampleLabel: { color: d.lavenderText, fontSize: 13, letterSpacing: .5, ...font.extrabold },
  exampleEn: { color: d.ink, fontSize: 18, ...font.extrabold },
  exampleAz: { color: d.inkSoft, fontSize: 15, ...font.semibold },
});
