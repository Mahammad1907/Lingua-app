import { Animated, StyleSheet } from 'react-native';
import { useLessonTextMotion } from './LessonTextMotion';
export default function WrongAnswerBorder({ active, radius = 18 }: { active: boolean; radius?: number }) {
  const motion = useLessonTextMotion(active ? 'incorrect' : 'idle');
  if (!active) return null;
  return <Animated.View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[StyleSheet.absoluteFill, { borderWidth: 2, borderRadius: radius }, motion.borderStyle('#EF6B7740')]} />;
}
