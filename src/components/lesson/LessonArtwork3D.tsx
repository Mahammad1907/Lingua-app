import { StyleSheet, Text, View } from 'react-native';
import { lessonTheme as t } from '../../constants/lessonTheme';
import type { DayScene, LessonArtworkKind } from '../../utils/lessonArtwork';
import LessonImage from './LessonImage';
import { ChapterArtwork } from '../chapter/ChapterArtwork';
import { HomeArtwork } from '../home/HomeArtwork';

const art = {
  board: require('../../../assets/lessons/teacher-board-3d.webp'),
  conversation: require('../../../assets/lessons/conversation-3d.webp'),
  morning: require('../../../assets/lessons/morning-3d.webp'),
  afternoon: require('../../../assets/lessons/afternoon-3d.webp'),
  evening: require('../../../assets/lessons/evening-3d.webp'),
};

export function DaySceneArtwork({ scene }: { scene: DayScene }) {
  return <LessonImage canvasColor={t.background} source={art[scene]} style={s.dayImage} />;
}

export function TeacherBoard3D({ text, correction = false }: { text: string; correction?: boolean }) {
  return <View style={s.board}>
    <LessonImage canvasColor={t.background} source={art.board} style={s.image} />
    <View style={s.writing}>
      <Text style={[s.boardLabel, correction && { color: '#FFD39A' }]} maxFontSizeMultiplier={1.3}>{correction ? 'SƏHVİ TAP' : 'BİRFOX İLƏ MƏŞQ'}</Text>
      <Text style={[s.chalk, text.length > 40 && s.smallChalk]} maxFontSizeMultiplier={1.3} adjustsFontSizeToFit minimumFontScale={0.8} numberOfLines={4}>{text}</Text>
    </View>
  </View>;
}

// All lesson art is static. No timers, frame loops, video or network image URLs.
export default function LessonArtwork3D({ kind, boardText = '', correction = false }: {
  kind: LessonArtworkKind; boardText?: string; correction?: boolean;
}) {
  if (kind === 'board') return <TeacherBoard3D text={boardText} correction={correction} />;
  if (kind === 'conversation') return <View style={s.conversation}>
    <LessonImage canvasColor={t.background} source={art.conversation} style={s.image} />
    <Text style={s.caption}>Dinlə və söhbətə qoşul</Text>
  </View>;
  if (kind === 'listening') return <View style={s.listenCard}>
    <HomeArtwork name="headphones" style={s.headphones} />
    <View style={s.copy}><Text style={s.title}>Bir səs, üç səhnə</Text><Text style={s.subtitle}>Dinlə və günün vaxtını seç.</Text></View>
  </View>;
  if (kind === 'identity') return <View style={s.identityCard}>
    <ChapterArtwork name="identity" size={106} />
    <View style={s.copy}><Text style={s.eyebrow}>İLK TANIŞLIQ</Text><Text style={s.title}>Özünü təqdim et</Text><Text style={s.subtitle}>Adınla başlayan kiçik bir söhbət.</Text></View>
  </View>;
  return <View style={s.messageCard}>
    <ChapterArtwork name="dialogue" size={100} />
    <View style={s.copy}><Text style={s.eyebrow}>SÖHBƏTİN DAVAMI</Text><Text style={s.title}>Söz indi səndədir</Text><Text style={s.subtitle}>Qarşı tərəfə uyğun cavab hazırla.</Text></View>
  </View>;
}

const s = StyleSheet.create({
  image: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, width: '100%', height: '100%' },
  board: { width: '100%', aspectRatio: 1.5, marginBottom: 14 },
  // Coordinates measured from the generated, front-facing board surface.
  writing: { position: 'absolute', left: '43%', top: '18%', width: '48%', height: '52%', justifyContent: 'center', paddingHorizontal: 3 },
  boardLabel: { color: '#B9DACA', fontSize: 8, fontWeight: '700', letterSpacing: 0.7, marginBottom: 9, textAlign: 'center' },
  chalk: { color: '#F4F4DD', fontSize: 20, lineHeight: 27, fontWeight: '700', textAlign: 'center', flexShrink: 1 },
  smallChalk: { fontSize: 15, lineHeight: 20 },
  conversation: { width: '100%', aspectRatio: 1.6, marginBottom: 16 },
  caption: { position: 'absolute', bottom: 4, alignSelf: 'center', color: t.text, backgroundColor: '#19172CE8', paddingHorizontal: 13, paddingVertical: 6, borderRadius: 12, fontSize: 11, fontWeight: '600' },
  dayImage: { width: '100%', height: '100%' },
  listenCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#18172B', borderColor: '#3E3159', borderWidth: 1, borderRadius: 22, padding: 12, gap: 14, marginBottom: 18 },
  headphones: { width: 74, height: 82 },
  copy: { flex: 1, minWidth: 0 }, title: { color: t.text, fontSize: 18, lineHeight: 24, fontWeight: '800' },
  subtitle: { color: t.muted, fontSize: 12, lineHeight: 18, marginTop: 7 },
  eyebrow: { color: t.orange, fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
  identityCard: { flexDirection: 'row', alignItems: 'center', gap: 18, padding: 16, borderRadius: 24, backgroundColor: '#19172D', borderWidth: 1, borderColor: '#3D3157', marginBottom: 18 },
  messageCard: { flexDirection: 'row', alignItems: 'center', gap: 18, padding: 16, backgroundColor: '#19172D', borderWidth: 1, borderColor: '#3D3157', borderRadius: 24, marginBottom: 18 },
});
