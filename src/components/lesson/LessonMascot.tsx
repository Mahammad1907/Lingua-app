import type { ImageStyle, StyleProp } from 'react-native';
import { Image } from 'expo-image';
export default function LessonMascot({ height = 160, style }: { height?: number; style?: StyleProp<ImageStyle> }) {
  return <Image accessibilityLabel="Narıncı başlıqlı dərs bələdçisi" source={require('../../../assets/mascot/lesson-guide.webp')} contentFit="contain" style={[{ width: '100%', height }, style]} />;
}
