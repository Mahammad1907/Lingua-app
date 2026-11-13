// Screens for the new task kinds (approved mockups, 13 noyabr 2026).
// Principle: every task is a small conversation — speech bubbles, avatars, a message thread.
// No paired two-column buttons, no 2×2 picture grids, no 3D button shadows, no gradients or emoji.
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { characterAz, hasCharacterName } from '../../config/characters';
import { missingScenes, sceneImage } from '../../config/sceneImages';
import type { ChatLine, MatchTask, WordCard, Who } from '../../data/designLessonTypes';
import { glossOf } from '../../data/unit1/glossary';
import Icon, { type IconName } from './Icons';
import { ds, nameSlot, Waveform } from './parts';
import { d, font, radius, shadow } from './theme';

const mascotHead = require('../../../assets/mascot/hood_head.png');
const mascotFull = require('../../../assets/mascot/hood_full.png');

type Mark = 'correct' | 'wrong' | undefined;
const markColor = (m: Mark, fallback: string) => m === 'correct' ? d.green : m === 'wrong' ? d.red : fallback;

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

/** Round sound buttons used everywhere: purple play, and the turtle (slow) with no text. */
export function PlayButton({ onPress, size = 48, playing, label = 'Dinlə' }: { onPress: () => void; size?: number; playing?: boolean; label?: string }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Dinləmə gedir' : label} onPress={onPress} hitSlop={4}
    style={({ pressed }) => [s.playPill, { height: size, borderRadius: size / 2 }, pressed && { opacity: .85 }]}>
    <Icon name="play" size={size * .36} color="#fff" /><Text style={[s.playText, { fontSize: size >= 44 ? 16 : 15 }]}>Dinlə</Text>
  </Pressable>;
}
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
        {chips ?? <Text style={[s.bubbleText, mine ? { color: '#fff' } : { color: d.lavenderText }]}>{mine ? nameSlot(mine) : placeholder}</Text>}
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
export function GapSentence({ speaker, before, after, options, value, onPick, onSay, mark, disabled }: {
  speaker?: Who; before: string; after: string; options: string[]; value: string; onPick: (o: string) => void; onSay?: (t: string) => void; mark?: Mark; disabled?: boolean;
}) {
  const color = mark === 'correct' ? d.green : mark === 'wrong' ? d.red : d.purple;
  const sentence = <Text style={s.gapText}>{nameSlot(before)}{before ? ' ' : ''}<Text style={[s.gapSlot, value ? { color, backgroundColor: mark === 'correct' ? d.greenSoft : mark === 'wrong' ? d.redSoft : d.purpleSoft } : null]}>
    {value ? ` ${value} ` : ' ______ '}</Text>{/^[.,!?]/.test(after) ? '' : ' '}{nameSlot(after)}</Text>;
  return <View style={{ gap: 18 }}>
    <View style={s.sayRow}>
      {speaker ? <Avatar who={speaker} size={56} /> : null}
      <View style={[s.sayBubble, shadow, !speaker && { borderTopLeftRadius: 22 }]}>{sentence}</View>
    </View>
    <View style={s.pills}>
      {options.map(o => {
        const on = value === o;
        return <Pressable key={o} accessibilityRole="radio" accessibilityState={{ selected: on, disabled }} disabled={disabled} onPress={() => { onSay?.(o); onPick(o); }}
          style={({ pressed }) => [s.pill, on && s.pillOn, on && mark && { borderColor: color, backgroundColor: mark === 'correct' ? d.greenSoft : d.redSoft }, pressed && { transform: [{ scale: .96 }] }]}>
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
  const used = new Set(Object.values(pairs));
  const meanings = [...task.rows.map(r => r.az), ...task.extra].sort((a, b) => a.localeCompare(b, 'az'));
  return <View style={{ gap: 14 }}>
    <View style={{ gap: 12 }}>
      {task.rows.map(r => {
        const value = pairs[r.en], mark = marks?.[r.en], on = active === r.en && !disabled;
        return <View key={r.en} style={s.matchRow}>
          {r.from ? <Avatar who={r.from} size={30} /> : null}
          <Pressable accessibilityRole="button" accessibilityHint="Dinləmək üçün toxun" onPress={() => onSay?.(r.en)} style={s.matchBubble}><Text style={s.matchEn}>{nameSlot(r.en)}</Text></Pressable>
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
    <Text style={s.phraseText}>{parts.map((p, i) => p === stress ? <Text key={i} style={{ color: d.orange }}>{p}</Text> : nameSlot(p))}</Text>
    {reading ? <Reading text={reading} /> : null}
    {note ? <Text style={s.phraseNote}>{note}</Text> : null}
  </View>;
}

/** Azerbaijani-letter reading; **th** parts are bold (no Azerbaijani letter for that sound). */
export function Reading({ text, left }: { text: string; left?: boolean }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return <Text style={[s.reading, left && { textAlign: 'left' }]} accessibilityLabel={`Oxunuşu: ${text.replace(/\*/g, '')}`}>
    {parts.map((p, i) => p.startsWith('**') ? <Text key={i} style={{ ...font.extrabold, color: d.orange }}>{p.slice(2, -2)}</Text> : p)}
  </Text>;
}

function InfoRow({ icon, label, children, first }: { icon: IconName; label: string; children: ReactNode; first?: boolean }) {
  return <View style={[s.infoRow, !first && s.infoLine]}>
    <View style={s.infoIcon}><Icon name={icon} size={22} color={d.purple} /></View>
    <View style={{ flex: 1, gap: 4 }}><Text style={ds.label}>{label}</Text>{children}</View>
  </View>;
}

/** “[ad]” inside a pattern is the name slot, shown in lavender. */
function Pattern({ text }: { text: string }) {
  return <View style={s.pattern}><Text style={s.patternText}>{text.split(/(\[[^\]]+\])/).map((p, i) => p.startsWith('[') ? <Text key={i} style={{ color: d.lavender }}>{p}</Text> : p)}</Text></View>;
}

/** Teaching card (approved “İlk salam” design): purple banner with the mascot and the phrase in a bubble,
 *  then Mənası · Oxunuşu · Quruluşu · other phrases · Qeyd · Nümunə rows. Used for Yeni söz and Öyrən cards. */
export function LearnView({ chip, title, lead, phrases, az, reading, ipa, structure, more, notes, example, scenes, dialog, onPlay, onWord }: {
  chip: string; title?: string; lead?: string; phrases: string[]; az: string; reading?: string; ipa?: string; structure?: string[];
  more?: { en: string; az: string; reading?: string }[]; notes?: string[]; example?: { en: string; az: string }; scenes?: string[];
  /** A short conversation (girl and boy take turns) instead of one phrase in the banner. */
  dialog?: { en: string; az: string }[];
  onPlay: (t: string, rate?: number) => void; onWord?: (w: string) => void;
}) {
  const image = sceneImage(scenes);
  const spoken = phrases.join('. ');
  return <View style={{ gap: 12 }}>
    <View style={{ gap: 4 }}>
      <View style={s.learnChip}><Text style={s.learnChipText}>{chip}</Text></View>
      {title ? <Text accessibilityRole="header" style={ds.title}>{title}</Text> : null}
      <Text style={ds.subtitle}>{lead ?? 'Dinlə və nümunəyə bax.'}</Text>
    </View>
    {image ? <Image source={image} style={s.wordImage} contentFit="cover" accessibilityIgnoresInvertColors /> : <ImageSlot scenes={scenes} height={64} />}
    {dialog ? <View style={[s.info, shadow, { paddingVertical: 10, gap: 10 }]}>{dialog.map((l, i) => <View key={l.en} style={s.moreRow}>
      <Avatar who={i % 2 ? 'B' : 'G'} size={40} />
      <View style={{ flex: 1 }}><TapText text={l.en} style={s.dialogEn} onWord={onWord} /><Text style={s.moreAz}>{l.az}</Text></View>
      <PlayButton onPress={() => onPlay(l.en)} size={40} label={`Dinlə: ${l.en}`} />
    </View>)}</View> : null}
    {dialog ? null : <View style={[s.banner, shadow]}>
      <Image source={mascotFull} style={{ width: 96, height: 120 }} contentFit="contain" accessibilityLabel="Maskot" />
      <View style={s.bannerBubble}>
        {phrases.map(p => <Text key={p} accessibilityRole="header" style={[s.bannerText, phrases.length > 1 && { fontSize: 26, lineHeight: 32 }]}>{nameSlot(p)}</Text>)}
        <View style={s.bannerAudio}><PlayButton onPress={() => onPlay(spoken)} size={46} /><SlowButton onPress={() => onPlay(spoken, .45)} size={46} /></View>
      </View>
    </View>}
    <View style={[s.info, shadow]}>
      {dialog ? null : <InfoRow first icon="tag" label="Mənası"><Text style={s.infoStrong}>{az}</Text></InfoRow>}
      {reading ? <InfoRow icon="speaker" label="Oxunuşu"><Reading text={reading} left />{ipa ? <Text style={s.ipa}>{ipa}</Text> : null}</InfoRow> : null}
      {structure?.length ? <InfoRow icon="layers" label="Quruluşu"><View style={s.patterns}>{structure.map(p => <Pattern key={p} text={p} />)}</View></InfoRow> : null}
      {more?.length ? <InfoRow icon="chat" label="Bunu da öyrən">{more.map(m => <View key={m.en} style={s.moreRow}>
        <View style={{ flex: 1 }}><TapText text={m.en} style={s.infoStrong} onWord={onWord} /><Text style={s.moreAz}>{m.az}</Text>{m.reading ? <Reading text={m.reading} left /> : null}</View>
        <PlayButton onPress={() => onPlay(m.en)} size={40} label={`Dinlə: ${m.en}`} />
      </View>)}</InfoRow> : null}
      {notes?.length ? <InfoRow first={Boolean(dialog)} icon="bulb" label="Qeyd">{notes.map(n => <Text key={n} style={ds.body}>{n}</Text>)}</InfoRow> : null}
      {example ? <View style={s.exampleBox}>
        <View style={s.infoIcon}><Icon name="chat" size={22} color={d.purple} /></View>
        <View style={{ flex: 1, gap: 2 }}><Text style={ds.label}>Nümunə</Text><TapText text={example.en} style={s.exampleEn} onWord={onWord} /><Text style={s.moreAz}>{example.az}</Text></View>
        <PlayButton onPress={() => onPlay(example.en)} size={44} label="Nümunəni dinlə" />
      </View> : null}
    </View>
  </View>;
}

/** “Yeni söz” card on the approved teaching layout. */
export function WordView({ card, onPlay, onWord }: { card: WordCard; onPlay: (t: string, rate?: number) => void; onWord?: (w: string) => void }) {
  return <LearnView chip="Yeni söz" phrases={card.word.split(/\s*·\s*/)} az={card.az} reading={card.reading} ipa={card.pronunciation} structure={card.structure}
    more={card.more} notes={card.notes} example={{ en: card.example, az: card.exampleAz }} scenes={card.scenes} onPlay={onPlay} onWord={onWord} />;
}

const s = StyleSheet.create({
  imageSlot: { alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, borderRadius: 18, borderWidth: 1.5, borderStyle: 'dashed', borderColor: d.borderStrong, backgroundColor: 'rgba(230,218,251,.45)' },
  slotNote: { color: d.lavenderText, fontSize: 13, textAlign: 'center', ...font.bold },
  sayRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  sayCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.card, backgroundColor: d.surface, borderWidth: 1, borderColor: d.border },
  vline: { width: 1, alignSelf: 'stretch', backgroundColor: d.border },
  playPill: { flexDirection: 'row', gap: 6, paddingHorizontal: 14, backgroundColor: d.purple, alignItems: 'center', justifyContent: 'center' },
  playText: { color: '#fff', ...font.extrabold },
  slowRound: { backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  learnChip: { alignSelf: 'flex-start', backgroundColor: d.purpleSoft, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 4 },
  learnChipText: { color: d.purple, fontSize: 15, ...font.bold },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 26, backgroundColor: '#5B2BC9', padding: 14 },
  bannerBubble: { flex: 1, alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 22, paddingVertical: 14, paddingHorizontal: 12 },
  bannerText: { color: d.ink, fontSize: 32, lineHeight: 38, textAlign: 'center', ...font.extrabold },
  bannerAudio: { flexDirection: 'row', gap: 12 },
  info: { borderRadius: radius.card, backgroundColor: d.surface, borderWidth: 1, borderColor: d.border, paddingHorizontal: 14, paddingVertical: 4 },
  infoRow: { flexDirection: 'row', gap: 12, paddingVertical: 10 },
  infoLine: { borderTopWidth: 1, borderTopColor: d.border },
  infoIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  infoStrong: { color: d.ink, fontSize: 20, lineHeight: 26, ...font.extrabold },
  patterns: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pattern: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: d.purpleSoft },
  patternText: { color: d.ink, fontSize: 17, ...font.extrabold },
  moreRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 2 },
  dialogEn: { color: d.ink, fontSize: 18, lineHeight: 24, ...font.extrabold },
  moreAz: { color: d.lavenderText, fontSize: 15, ...font.bold },
  exampleBox: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8, padding: 12, borderRadius: 18, backgroundColor: '#EFE6FD' },
  sayBubble: { flex: 1, gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 22, borderTopLeftRadius: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border },
  sayText: { color: d.ink, fontSize: 20, lineHeight: 27, ...font.extrabold },
  sayAudio: { flexDirection: 'row', alignItems: 'center', gap: 10 },
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
  gapText: { color: d.ink, fontSize: 28, lineHeight: 40, ...font.extrabold },
  gapSlot: { color: d.purple, backgroundColor: d.purpleSoft },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  pill: { minHeight: 56, minWidth: 92, alignItems: 'center', paddingHorizontal: 24, borderRadius: 28, borderWidth: 1, borderColor: '#C5ADF2', backgroundColor: '#fff', justifyContent: 'center' },
  pillOn: { borderWidth: 2, borderColor: d.purple, backgroundColor: d.purpleSoft },
  pillText: { color: d.ink, fontSize: 21, ...font.extrabold },
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
  wordImage: { width: '100%', height: 170, borderRadius: 18, backgroundColor: d.purpleSoft },
  ipa: { color: d.inkSoft, fontSize: 14, ...font.semibold },
  exampleEn: { color: d.ink, fontSize: 18, ...font.extrabold },
});
