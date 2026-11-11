import { Image, type ImageStyle, type StyleProp } from 'react-native';
export default function LessonMascot({ height = 160, style }: { height?: number; style?: StyleProp<ImageStyle> }) {
  return <Image accessibilityLabel="Narıncı başlıqlı dərs bələdçisi" source={require('../../../assets/mascot/lesson-guide.webp')} resizeMode="contain" style={[{ width: '100%', height }, style]} />;
}
