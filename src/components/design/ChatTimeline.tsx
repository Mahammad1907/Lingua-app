// “İki mesajı özün yaz” as a chat timeline (25 Nov 2026 mockup). One card, no scrolling:
// header (avatar, name, Kömək) → lavender canvas with a time pill per step, the partner's lines, the learner's sent
// bubbles (✎ to edit, ▶ after the check) and a dashed “waiting” bubble for the next message. The input under the card
// has a ↑ button; after ↑ the partner “types…” for half a second and the next step slides in. Yoxla opens when every
// message is sent. The partner's reaction (emoji in Dərs 1, taught words later) appears only after a correct check.
import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Reanimated, { FadeInDown } from 'react-native-reanimated';
import type { ChatLine, Who } from '../../data/designLessonTypes';
import Icon from './Icons';
import { nameSlot, tapHaptic } from './parts';
import { Avatar, Pops, SoundButton, TapText, TypingDots } from './TaskScreens';
import { d, font, shadow } from './theme';

type Mark = 'correct' | 'wrong' | undefined;
export interface TimelineStep { id: string; pill: string; placeholder: string; mine: string; sent: boolean; mark?: Mark; reply?: string }

export function ChatTimeline({ partner, from, lines, steps, editing, checked, help, onEdit, onSay, onWord }: {
  partner: string; from: Who; lines: ChatLine[]; steps: TimelineStep[];
  /** Index of the message being typed or edited. */ editing: number;
  /** Yoxla was pressed: bubbles are final (▶ instead of ✎). */ checked: boolean;
  help?: ReactNode; onEdit: (i: number) => void; onSay?: (t: string) => void; onWord?: (w: string) => void;
}) {
  // Which steps are revealed: step 0 always; step i after step i-1 was sent and the partner finished “typing”.
  const [typingAfter, setTypingAfter] = useState(-1);
  const [shown, setShown] = useState(() => Math.max(1, steps.findIndex(s => !s.sent) < 0 ? steps.length : steps.findIndex(s => !s.sent) + 1));
  const lastSent = steps.reduce((n, s, i) => s.sent ? i : n, -1);
  useEffect(() => {
    if (lastSent >= 0 && lastSent + 1 < steps.length && shown <= lastSent + 1 && typingAfter !== lastSent) setTypingAfter(lastSent);
  }, [lastSent]); // eslint-disable-line react-hooks/exhaustive-deps
  return <View style={[s.card, shadow]}>
    <View style={s.head}>
      <Avatar who={from} size={44} />
      <Text style={s.name} numberOfLines={1}>{nameSlot(partner)}</Text>
      {help}
    </View>
    <View style={s.body}>
      {steps.map((st, i) => i >= shown ? null : <Reanimated.View key={st.id} entering={i ? FadeInDown.duration(320) : undefined} style={{ gap: 10 }}>
        <View style={s.pill}><Text style={s.pillText}>{st.pill}</Text></View>
        {i === 0 ? lines.map((l, k) => <View key={k} style={s.inRow}><Avatar who={l.from} size={30} /><View style={s.inBubble}><TapText text={l.text} style={s.text} onWord={onWord} /></View></View>) : null}
        {st.sent && editing !== i ? <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Pops on={st.sent}>
            <Pressable accessibilityRole="button" accessibilityLabel={checked ? `Sənin mesajın: ${st.mine}` : `Sənin mesajın: ${st.mine}. Düzəltmək üçün toxun`} disabled={checked}
              onPress={() => { tapHaptic(); onEdit(i); }} style={[s.out, st.mark === 'correct' && { backgroundColor: d.greenText }, st.mark === 'wrong' && { backgroundColor: d.redText }]}>
              <Text style={[s.text, { color: '#fff' }]}>{nameSlot(st.mine)}</Text>
            </Pressable>
          </Pops>
          <View style={s.meta}>
            {checked && onSay ? <SoundButton size={28} label={`Dinlə: ${st.mine}`} onPress={() => onSay(st.mine)} /> : null}
            <Text style={s.time}>{st.pill.match(/\d{1,2}:\d{2}/)?.[0] ?? ''}</Text>
            {checked ? <Icon name="check" size={15} color={d.purple} /> : <Icon name="edit" size={15} color={d.purple} />}
          </View>
        </View> : <View style={[s.waiting, editing === i && st.mine ? { borderStyle: 'solid' } : null]}>
          <Text style={[s.text, { color: st.mine ? d.ink : d.violet }]} numberOfLines={2}>{st.mine ? nameSlot(st.mine) : `${st.placeholder}...`}</Text>
        </View>}
        {checked && st.mark === 'correct' && st.reply ? <Reanimated.View entering={FadeInDown.springify().damping(14)} style={s.inRow}>
          <Avatar who={from} size={30} /><View style={s.inBubble}><Text style={s.text}>{st.reply}</Text></View></Reanimated.View> : null}
        {typingAfter === i ? <TypingDots onDone={() => { setTypingAfter(-1); setShown(n => Math.max(n, i + 2)); }} /> : null}
      </Reanimated.View>)}
    </View>
  </View>;
}

const s = StyleSheet.create({
  card: { borderRadius: 24, backgroundColor: '#F7F6FC', borderWidth: 1, borderColor: '#EEF0F5' },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, borderBottomWidth: 1, borderBottomColor: '#EEF0F5' },
  name: { flex: 1, color: d.title, fontSize: 18, ...font.extrabold },
  body: { gap: 12, padding: 14, minHeight: 160 },
  pill: { alignSelf: 'center', backgroundColor: '#E9E7F1', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  pillText: { color: d.inkSoft, fontSize: 13, ...font.semibold },
  inRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  inBubble: { maxWidth: '78%', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderBottomLeftRadius: 6, backgroundColor: '#fff', ...shadow, shadowOpacity: .06 },
  out: { maxWidth: '82%', minWidth: 80, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderBottomRightRadius: 6, backgroundColor: d.purple, ...shadow, shadowColor: d.purple, shadowOpacity: .25 },
  waiting: { alignSelf: 'flex-end', maxWidth: '82%', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderBottomRightRadius: 6, borderWidth: 1.5, borderStyle: 'dashed', borderColor: d.violet, backgroundColor: '#fff' },
  text: { color: d.ink, fontSize: 18, lineHeight: 24, ...font.bold },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  time: { color: d.inkSoft, fontSize: 12, ...font.regular },
});
