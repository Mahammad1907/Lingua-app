import { useEffect, useState, type PropsWithChildren } from 'react';
import { Animated } from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';
export default function LessonCardTransition({ children, cardId }: PropsWithChildren<{ cardId: string }>) {
  const reduced = useReducedMotion();
  const [opacity] = useState(() => new Animated.Value(1));
  useEffect(() => {
    opacity.stopAnimation();
    if (reduced) { opacity.setValue(1); return; }
    opacity.setValue(.45);
    const fade = Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true, isInteraction: false });
    fade.start(); return () => fade.stop();
  }, [cardId, opacity, reduced]);
  return <Animated.View style={{ opacity, gap: 10 }}>{children}</Animated.View>;
}
