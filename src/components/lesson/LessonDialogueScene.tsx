import CurrentSceneArt from './CurrentSceneArt';
import { currentDialogueScene } from '../../utils/currentScenePlan';
import { Image, StyleSheet, View } from 'react-native';

// Context art only. The author's audio and prompts remain native controls.
export default function LessonDialogueScene({ mascot = false, order = 1 }: { mascot?: boolean; order?: number }) {
  if (!mascot) return <CurrentSceneArt scene={currentDialogueScene(order)} />;
  return <View testID="lesson-dialogue-scene" style={s.scene}><Image
    source={require('../../../assets/onboarding/welcome.png')}
    accessible={false} resizeMode="contain" style={s.image} /></View>;
}
const s = StyleSheet.create({ scene: { alignItems: 'center', paddingVertical: 3 }, image: { width: '100%', height: 108 } });
