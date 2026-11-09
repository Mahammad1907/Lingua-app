import { Image, StyleSheet, View } from 'react-native';

// Context art only. The author's audio and prompts remain native controls.
export default function LessonDialogueScene({ mascot = false }: { mascot?: boolean }) {
  return <View testID="lesson-dialogue-scene" style={s.scene}><Image
    source={mascot ? require('../../../assets/onboarding/welcome.png') : require('../../../assets/lessons/current/greeting-pair.webp')}
    accessible={false} resizeMode="contain" style={s.image} /></View>;
}
const s = StyleSheet.create({ scene: { alignItems: 'center', paddingVertical: 3 }, image: { width: '100%', height: 108 } });
