import { StyleSheet, Text, View } from 'react-native';
import type { PacketCard } from '../../data/b1PacketTypes';
import { LessonIcon, type LessonIconName } from './LessonSurface';

export function stagePresentation(card: PacketCard): { title: string; caption: string; icon: LessonIconName } {
  if (card.kind === 'result') return { title: 'Nəticə', caption: 'Bu dərsdəki cavabların', icon: 'check' };
  if (card.kind === 'voice') return { title: 'Danışıq', caption: 'BirFox ilə hazırlanmış dialoq', icon: 'mic' };
  if (card.audio) return { title: 'Dinləmə', caption: 'Əvvəl dinlə, sonra cavab ver', icon: 'sound' };
  if (card.kind === 'teach') return { title: /qrammatika/i.test(card.title) || card.board?.includes('=') ? 'Qrammatika' : 'Sözlər', caption: 'Toxun, mənasını gör və dinlə', icon: 'book' };
  if (card.words || /qrammatika|boşluğu/i.test(card.title)) return { title: 'Qrammatika', caption: 'Öyrəndiyini tətbiq et', icon: 'book' };
  return { title: 'Tapşırıq', caption: card.options ? 'Uyğun cavabı seç' : 'Öz cavabını yaz', icon: 'keyboard' };
}
export default function LessonStageHeading({ card, reviewing }: { card: PacketCard; reviewing: boolean }) {
  const stage = stagePresentation(card);
  return <View style={s.heading}><View style={s.icon}><LessonIcon name={stage.icon} color="#8735C9" size={26} /></View><View style={s.copy}><Text accessibilityRole="header" style={s.title}>{reviewing ? 'Bir də məşq et' : stage.title}</Text><Text style={s.caption}>{reviewing ? 'Yeni vəziyyət · Yalnız çətinlik qalan hissə' : stage.caption}</Text></View></View>;
}
const s = StyleSheet.create({ heading: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 }, icon: { width: 48, height: 48, borderRadius: 17, borderWidth: 1, borderColor: '#DFC4F2', backgroundColor: '#EEDBFB', alignItems: 'center', justifyContent: 'center' }, copy: { flex: 1, gap: 3 }, title: { fontSize: 25, lineHeight: 31, color: '#301341', fontWeight: '800' }, caption: { fontSize: 12, lineHeight: 18, color: '#79578C', fontWeight: '500' } });
