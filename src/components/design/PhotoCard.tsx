// “Şəkil göndərdi” (26 Nov 2026, user): instead of describing a photo in words (“yanında yaşlı kişi var”), the task shows
// it — a small code-drawn photo in a chat card. The person the question is about wears an orange “?”. No image files.
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { PhotoLook, PhotoSpec } from '../../data/designLessonTypes';
import { nameSlot } from './parts';
import { Avatar } from './TaskScreens';
import { d, font } from './theme';

const SKIN = '#F2C9A8';
const LOOKS: Record<PhotoLook, { hair: string; shirt: string; scale: number; long?: boolean; tails?: boolean; beard?: boolean }> = {
  man: { hair: '#3B2A20', shirt: '#3B82F6', scale: 1 },
  woman: { hair: '#5B3A29', shirt: '#EC4899', scale: .97, long: true },
  oldMan: { hair: '#D1D5DB', shirt: '#64748B', scale: 1, beard: true },
  oldWoman: { hair: '#D1D5DB', shirt: '#A855F7', scale: .95, long: true },
  girl: { hair: '#4A2F22', shirt: '#F59E0B', scale: .72, tails: true },
  boy: { hair: '#2F2118', shirt: '#22C55E', scale: .72 },
  friend: { hair: '#2F2118', shirt: '#7C3AED', scale: 1 },
};

function Person({ look, ask, h }: { look: PhotoLook; ask?: boolean; h: number }) {
  const L = LOOKS[look], ph = h * L.scale, pw = ph * .5;
  return <View style={{ alignItems: 'center', justifyContent: 'flex-end', height: h + 34 }}>
    {ask ? <View style={s.ask}><Text style={s.askText}>?</Text></View> : null}
    <Svg width={pw} height={ph} viewBox="0 0 80 160">
      {L.long ? <Path d="M14 58 Q12 18 40 14 Q68 18 66 58 L66 86 L14 86 Z" fill={L.hair} /> : null}
      <Path d="M8 160 L8 112 Q8 92 28 90 L52 90 Q72 92 72 112 L72 160 Z" fill={L.shirt} />
      <Rect x={33} y={74} width={14} height={20} rx={6} fill={SKIN} />
      <Circle cx={40} cy={50} r={24} fill={SKIN} />
      {L.tails ? <><Circle cx={14} cy={50} r={9} fill={L.hair} /><Circle cx={66} cy={50} r={9} fill={L.hair} /></> : null}
      <Path d="M16 48 Q16 22 40 22 Q64 22 64 48 Q56 34 40 34 Q24 34 16 48 Z" fill={L.hair} />
      {L.beard ? <Path d="M24 58 Q40 84 56 58 Q50 66 40 66 Q30 66 24 58 Z" fill={L.hair} /> : null}
      <Circle cx={32} cy={52} r={2.6} fill="#1F2937" /><Circle cx={48} cy={52} r={2.6} fill="#1F2937" />
      <Path d="M33 62 Q40 67 47 62" stroke="#B45309" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </Svg>
  </View>;
}

export function PhotoCard({ photo }: { photo: PhotoSpec }) {
  return <View style={s.card} accessibilityLabel="Göndərilən şəkil">
    <View style={s.head}>
      <Avatar who={photo.who ?? 'other'} size={30} />
      <Text style={s.from} numberOfLines={1}>{nameSlot(photo.from)}</Text>
    </View>
    <LinearGradient colors={['#E0F2FE', '#F5F3FF']} style={s.photo}>
      <View style={s.ground} />
      <View style={s.people}>{photo.people.map((p, i) => <Person key={i} look={p.look} ask={p.ask} h={128} />)}</View>
    </LinearGradient>
  </View>;
}

const s = StyleSheet.create({
  card: { alignSelf: 'center', width: '78%', maxWidth: 320, backgroundColor: '#fff', borderRadius: 22, padding: 10, gap: 8,
    shadowColor: '#5B4B9A', shadowOpacity: .1, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  from: { flex: 1, color: d.title, fontSize: 15, ...font.extrabold },
  photo: { height: 176, borderRadius: 16, overflow: 'hidden', justifyContent: 'flex-end' },
  ground: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 30, backgroundColor: '#DDE7D8' },
  people: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 14 },
  ask: { position: 'absolute', top: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: d.action, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  askText: { color: '#fff', fontSize: 17, ...font.extrabold },
});
