import { Image, StyleSheet, View } from 'react-native';
import type { LessonPictureId } from '../../utils/lessonPicturePlan';
export const lessonPictureAssets: Record<LessonPictureId, { source: number; description: string }> = {
  P01: { source: require('../../../assets/lessons/v2-characters/P01.webp'), description: 'İki yeni tanış üz-üzə dayanıb salamlaşır.' },
  P02: { source: require('../../../assets/lessons/v2-characters/P02.webp'), description: 'Biri qapıda qalır, digəri uzaqlaşır; görüş başa çatır.' },
  P03: { source: require('../../../assets/lessons/v2-characters/P03.webp'), description: 'Bir insan özünü və boş ad nişanını göstərir, qarşı tərəf dinləyir.' },
  P04: { source: require('../../../assets/lessons/v2-characters/P04.webp'), description: 'İki yeni tanış qarşılıqlı mehriban jest edir.' },
  P05: { source: require('../../../assets/lessons/v2-characters/P05.webp'), description: 'Eyni personaj üç müxtəlif hal vəziyyətində göstərilir.' },
  P06: { source: require('../../../assets/lessons/v2-characters/P06.webp'), description: 'Bir insan digərinə kömək edir, digəri qarşılıq verir.' },
  'P07-attention': { source: require('../../../assets/lessons/v2-characters/P07-attention.webp'), description: 'Bir insan danışmazdan əvvəl digərinin diqqətini çəkir.' },
  'P07-apology': { source: require('../../../assets/lessons/v2-characters/P07-apology.webp'), description: 'Kiçik təsadüfi səhvdən sonra iki insan qarşılıqlı reaksiya verir.' },
  P08: { source: require('../../../assets/lessons/v2-characters/P08.webp'), description: 'Biri danışır, digəri eşitmək üçün diqqətlə qulaq asır.' },
  P09: { source: require('../../../assets/lessons/v2-characters/P09.webp'), description: 'Narıncı geyimli söhbət yoldaşının portreti.' },
};
// Alternative descriptions explain context without exposing target English words.
export default function LessonPicture({ ids, compact = false }: { ids: LessonPictureId[]; compact?: boolean }) {
  return <View style={s.row}>{ids.map(id => <Image key={id} source={lessonPictureAssets[id].source} accessibilityLabel={lessonPictureAssets[id].description} accessible resizeMode="contain" style={[s.image, { height: compact ? 72 : ids.length > 1 ? 108 : 132 }]} />)}</View>;
}
const s=StyleSheet.create({row:{flexDirection:'row',gap:8},image:{flex:1,minWidth:0,width:'100%'}});
