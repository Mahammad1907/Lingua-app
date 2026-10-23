import LessonImage from './LessonImage';
import { lessonSceneSources } from '../../utils/lessonAssets';
import { StyleSheet, View } from 'react-native';
import type { ReusableSceneId } from '../../utils/packetScene';

// Stable IDs are deliberately independent of lesson IDs, language and level.
// Reuse an existing source here before generating art for another lesson.

export default function ReusableLessonScene({ name, height }: { name: ReusableSceneId; height?: number }) {
  return <View style={[s.frame, height !== undefined && { height, aspectRatio: undefined, marginBottom: 0 }]}>
    <LessonImage source={lessonSceneSources[name]} style={s.image} />
  </View>;
}
const s = StyleSheet.create({
  frame: { width: '100%', aspectRatio: 1.5, marginBottom: 14, borderRadius: 22, overflow: 'hidden', backgroundColor: '#141429' },
  image: { width: '100%', height: '100%' },
});
