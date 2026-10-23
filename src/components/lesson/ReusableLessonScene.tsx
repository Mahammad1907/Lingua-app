import { Image, StyleSheet, View } from 'react-native';
import type { ReusableSceneId } from '../../utils/packetScene';

// Stable IDs are deliberately independent of lesson IDs, language and level.
// Reuse an existing source here before generating art for another lesson.
const sources = {
  conversation: require('../../../assets/lessons/conversation-3d.webp'),
  gratitude: require('../../../assets/lessons/scenes/gratitude-3d.webp'),
  apology: require('../../../assets/lessons/scenes/apology-3d.webp'),
  clarify: require('../../../assets/lessons/scenes/clarify-3d.webp'),
  farewell: require('../../../assets/lessons/scenes/farewell-3d.webp'),
  'name-card': require('../../../assets/lessons/scenes/name-card-3d.webp'),
  feelings: require('../../../assets/lessons/scenes/feelings-3d.webp'),
};
export default function ReusableLessonScene({ name, height }: { name: ReusableSceneId; height?: number }) {
  return <View pointerEvents="none" style={[s.frame, height !== undefined && { height, aspectRatio: undefined, marginBottom: 0 }]}>
    <Image source={sources[name]} resizeMode="contain" accessible={false} style={s.image} />
  </View>;
}
const s = StyleSheet.create({
  frame: { width: '100%', aspectRatio: 1.5, marginBottom: 14, borderRadius: 22, overflow: 'hidden', backgroundColor: '#141429' },
  image: { width: '100%', height: '100%' },
});
