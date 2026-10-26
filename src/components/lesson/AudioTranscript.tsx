import { Animated, Pressable, StyleSheet } from 'react-native';
import { useLessonTextMotion } from './LessonTextMotion';
import { ink } from './LessonSurface';

export default function AudioTranscript({ text, onHide }: { text: string; onHide: () => void }) {
  const motion = useLessonTextMotion('reveal');
  return <Pressable accessibilityRole="button" accessibilityLabel="Audioda deyilən mətn" accessibilityHint="Mətni gizlətmək üçün toxun" onPress={onHide} style={s.touch}>
    <Animated.Text style={[s.text, { opacity: motion.reduced ? 1 : motion.progress }]}>{text}</Animated.Text>
  </Pressable>;
}
const s = StyleSheet.create({ touch: { minHeight: 44, justifyContent: 'center', paddingVertical: 5 }, text: { color: ink.violet, fontSize: 19, lineHeight: 26, fontWeight: '700' } });
