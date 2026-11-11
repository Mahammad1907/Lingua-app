import type { ImageStyle, StyleProp } from 'react-native';
import { Image } from 'expo-image';
const poses = {
  welcome: require('../../../assets/mascot/lesson-guide.webp'),
  teaching: require('../../../assets/mascot/mascot-teaching.webp'),
  listening: require('../../../assets/mascot/mascot-listening.webp'),
  complete: require('../../../assets/mascot/mascot-complete.webp'),
};
export type LessonMascotPose = keyof typeof poses;
export default function LessonMascot({ height = 160, style, pose = 'welcome' }: { height?: number; style?: StyleProp<ImageStyle>; pose?: LessonMascotPose }) {
  return <Image accessibilityLabel="Narıncı başlıqlı dərs bələdçisi" source={poses[pose]} contentFit="contain" style={[{ width: '100%', height }, style]} />;
}
