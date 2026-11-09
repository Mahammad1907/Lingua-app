import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PacketLesson } from '../../data/b1PacketTypes';
import { packetFlow } from '../../data/b1Course';
import LessonExplanationCard from './LessonExplanationCard';
import { LessonIcon } from './LessonSurface';

type Reply = { answer: string; status: 'independent' | 'assisted' | 'wrong' | 'unverified' };
export function DialogueTurn({ prompt, answer }: { prompt?: string; answer: string }) {
  return <View style={s.turn}>{prompt ? <Text style={s.partner}>{prompt}</Text> : null}<Text style={s.reply}>{answer}</Text></View>;
}
export default function LessonDialogueHistory({ packet, outcomes, currentId, onOpen, disabled = false }: { packet: PacketLesson; outcomes: Record<string, Reply>; currentId: string; onOpen: () => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const turns = packetFlow(packet).filter(c => c.kind === 'voice' && c.id !== currentId && outcomes[c.id]?.answer && outcomes[c.id].status !== 'unverified');
  if (!turns.length) return null;
  return <><Pressable accessibilityRole="button" disabled={disabled} accessibilityState={{ disabled }} onPress={() => { onOpen(); setOpen(true); }} style={s.button}><LessonIcon name="book" size={17} /><Text style={s.label}>Söhbət yaddaşı</Text></Pressable>
    <LessonExplanationCard visible={open} onClose={() => setOpen(false)} title="Tamamladığın növbələr">{turns.map(card => <View key={card.id}><DialogueTurn prompt={card.turns?.[0]?.audio || card.audio} answer={outcomes[card.id].answer} /><Text style={s.status}>{outcomes[card.id].status === 'wrong' ? 'Yenidən məşq lazımdır' : 'Qəbul olundu'}</Text></View>)}</LessonExplanationCard></>;
}
const s = StyleSheet.create({ turn: { gap: 8, paddingVertical: 7 }, partner: { alignSelf: 'flex-start', maxWidth: '88%', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 17, borderBottomLeftRadius: 5, backgroundColor: '#EBD8F9', fontSize: 16, lineHeight: 23, color: '#301341', fontWeight: '600' }, reply: { alignSelf: 'flex-end', maxWidth: '88%', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 17, borderBottomRightRadius: 5, backgroundColor: '#FFE4B5', fontSize: 16, lineHeight: 23, color: '#522C0E', fontWeight: '600' }, button: { minHeight: 44, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7 }, label: { fontSize: 13, color: '#8735C9', fontWeight: '600' }, status: { fontSize: 12, color: '#79578C' } });
