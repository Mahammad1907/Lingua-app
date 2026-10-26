import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, type TextProps } from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ink } from './LessonSurface';

export type LessonMotion = 'idle' | 'correct' | 'incorrect' | 'assisted' | 'unverified' | 'review' | 'reveal' | 'pulse';

export const lessonMotionDuration: Record<LessonMotion, number> = {
  idle: 0, correct: 600, incorrect: 300, assisted: 400,
  unverified: 300, review: 600, reveal: 400, pulse: 300,
};

const tone: Partial<Record<LessonMotion, string>> = {
  correct: ink.mint, incorrect: ink.orange, assisted: '#F4D889',
  unverified: ink.muted, review: '#8BC6FF',
};

export function outcomeMotion(status: 'independent' | 'assisted' | 'wrong' | 'unverified' | undefined): LessonMotion {
  return status === 'independent' ? 'correct' : status === 'assisted' ? 'assisted' :
    status === 'wrong' ? 'review' : 'unverified';
}

// Transforms never take layout space. Every effect returns to the existing
// font, color, size and position; no screen/container is moved or restyled.
export function useLessonTextMotion(state: LessonMotion, trigger?: string | number) {
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(1));
  useEffect(() => {
    progress.stopAnimation();
    if (state === 'idle' || reduced) { progress.setValue(1); return; }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1, duration: lessonMotionDuration[state],
      useNativeDriver: false, isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [state, trigger, reduced, progress]);
  const active = !reduced && state !== 'idle';
  const transformStyle = !active ? undefined : {
    transform: [
      { scale: state === 'correct'
        ? progress.interpolate({ inputRange: [0, 2 / 3, 5 / 6, 1], outputRange: [1, 1, 1.05, 1] })
        : state === 'pulse'
          ? progress.interpolate({ inputRange: [0, .5, 1], outputRange: [1, 1.05, 1] }) : 1 },
      { translateX: state === 'incorrect'
        ? progress.interpolate({ inputRange: [0, .25, .65, 1], outputRange: [0, -3, 3, 0] }) : 0 },
    ],
  };
  const color = (base: string, position = 0, count = 1) => {
    if (!active || !tone[state]) return base;
    if (state === 'correct') {
      const start = .02 + position / Math.max(1, count - 1) * .48;
      return progress.interpolate({
        inputRange: [0, start, start + .15, .8, 1],
        outputRange: [base, base, tone.correct!, tone.correct!, base],
      });
    }
    if (state === 'assisted') {
      return progress.interpolate({
        inputRange: [0, position === 0 ? .15 : .5, .75, 1],
        outputRange: [base, tone.assisted!, tone.assisted!, base],
      });
    }
    return progress.interpolate({
      inputRange: [0, .35, .8, 1], outputRange: [base, tone[state]!, tone[state]!, base],
    });
  };
  const opacity = (position: number, count: number) => active && state === 'reveal'
    ? progress.interpolate({
      inputRange: [0, .01 + position / Math.max(1, count - 1) * .6, .4 + position / Math.max(1, count - 1) * .6, 1],
      outputRange: [0, 0, 1, 1],
    }) : 1;
  const iconStyle = active && state === 'correct' ? {
    opacity: progress.interpolate({ inputRange: [0, .35, 1], outputRange: [.25, 1, 1] }),
    transform: [{ scale: progress.interpolate({ inputRange: [0, .45, .7, 1], outputRange: [1, 1.05, 1.02, 1] }) }],
  } : transformStyle;
  const borderStyle = (base: string) => state !== 'incorrect' ? undefined : {
    borderColor: reduced ? '#EF6B77' : progress.interpolate({ inputRange: [0, .3, .7, 1], outputRange: [base, '#EF6B77', '#EF6B77', base] }),
  };
  return { progress, reduced, active, transformStyle, iconStyle, color, opacity, borderStyle };
}

export default function LessonTextMotion({ state = 'idle', trigger, children, style, ...props }: TextProps & {
  state?: LessonMotion; trigger?: string | number;
}) {
  const motion = useLessonTextMotion(state, trigger);
  if (!motion.active) return <Text {...props} style={style}>{children}</Text>;
  const base = StyleSheet.flatten(style)?.color;
  const baseColor = typeof base === 'string' ? base : ink.text;
  // Keep combining marks with their letter. Long/unstructured React text stays
  // in one native text run instead of generating an unbounded animation tree.
  const characters = typeof children === 'string' && children.length <= 100
    ? children.match(/\P{M}\p{M}*|\p{M}+/gu) || [] : null;
  return <Animated.Text {...props}
    accessibilityLabel={props.accessibilityLabel || (typeof children === 'string' ? children : undefined)}
    style={[style, motion.transformStyle, !characters && { color: motion.color(baseColor) }]}>
    {characters ? characters.map((letter, i) => <Animated.Text key={i} accessible={false}
      style={{ color: motion.color(baseColor, i, characters.length), opacity: motion.opacity(i, characters.length) }}>{letter}</Animated.Text>) : children}
  </Animated.Text>;
}
