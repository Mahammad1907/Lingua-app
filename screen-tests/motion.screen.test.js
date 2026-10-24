import React from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { act, cleanup, render, screen } from '@testing-library/react-native';
import LessonTextMotion, { useLessonTextMotion } from '../src/components/lesson/LessonTextMotion';
import WrittenAnswerInput from '../src/components/lesson/WrittenAnswerInput';
import LessonFeedback from '../src/components/lesson/LessonFeedback';

let mockReduced = false;
jest.mock('../src/hooks/useReducedMotion', () => ({ useReducedMotion: () => mockReduced }));
jest.mock('../src/components/lesson/LessonVoiceInput', () => () => null);
jest.mock('expo-haptics', () => ({ impactAsync: jest.fn(async () => {}), ImpactFeedbackStyle: { Light: 'light' } }));
jest.mock('../src/components/lesson/LessonSurface', () => {
  const { Text } = require('react-native');
  return { ink: { text: '#F6F3FF', mint: '#58E4C1', orange: '#FFAB38', muted: '#ADA5CC' }, LessonIcon: () => <Text>icon</Text> };
});

const original = { color: '#F6F3FF', fontSize: 16, lineHeight: 23, width: 240, padding: 9 };
function Harness({ state }) {
  const motion = useLessonTextMotion(state);
  return <Animated.Text testID="motion" style={[original, motion.transformStyle, { color: motion.color(original.color) }]}>Hello!</Animated.Text>;
}
const readStyle = () => StyleSheet.flatten(screen.getByTestId('motion').props.style);

beforeEach(() => { jest.useFakeTimers(); mockReduced = false; });
afterEach(() => { cleanup(); jest.restoreAllMocks(); jest.useRealTimers(); });

test.each(['correct', 'incorrect', 'assisted', 'unverified', 'review'])('%s motion settles at the original appearance without changing text metrics', async state => {
  await render(<Harness state={state}/>);
  await act(async () => jest.advanceTimersByTime(1000));
  const style = readStyle();
  expect(style.fontSize).toBe(original.fontSize);
  expect(style.lineHeight).toBe(original.lineHeight);
  expect(style.width).toBe(original.width);
  expect(style.padding).toBe(original.padding);
  expect(style.transform).toEqual([{ scale: 1 }, { translateX: 0 }]);
  expect(style.color).toBe('rgba(246, 243, 255, 1)');
});

test('reduced motion keeps the existing native text and schedules no movement', async () => {
  mockReduced = true;
  const timing = jest.spyOn(Animated, 'timing');
  await render(<LessonTextMotion state="incorrect" style={original}>Hello!</LessonTextMotion>);
  expect(screen.getByText('Hello!')).toBeOnTheScreen();
  expect(StyleSheet.flatten(screen.getByText('Hello!').props.style)).toEqual(original);
  expect(timing).not.toHaveBeenCalled();
});

test('typing alone never starts correct or incorrect feedback', async () => {
  const timing = jest.spyOn(Animated, 'timing');
  const props = { value: 'Hello', onChange: jest.fn(), onVoiceFinal: jest.fn(), disabled: false, onBusyChange: jest.fn(), onFocus: jest.fn() };
  const view = await render(<WrittenAnswerInput {...props}/>);
  await view.rerender(<WrittenAnswerInput {...props} value="Helo"/>);
  expect(timing).not.toHaveBeenCalled();
  expect(screen.getByLabelText('Cavabını ingiliscə yaz').props.value).toBe('Helo');
});

test('recognition uncertainty does not animate as an incorrect answer', async () => {
  const timing = jest.spyOn(Animated, 'timing');
  await render(<LessonFeedback verdict={{ status: 'unknown', criteria: [], message: 'Səs tanınmadı' }} explanation="Səs tanınmadı" meaning={null}/>);
  expect(screen.getByText('Yenidən cəhd et')).toBeOnTheScreen();
  expect(timing).not.toHaveBeenCalled();
});

test('unmount stops pending motion and leaves no animation timer', async () => {
  const view = await render(<LessonTextMotion state="correct" style={original}>Hello!</LessonTextMotion>);
  await act(async () => jest.advanceTimersByTime(80));
  await view.unmount();
  await act(async () => jest.runOnlyPendingTimers());
  jest.runAllTicks(); // Flush React's act bookkeeping microtask before counting timers.
  expect(jest.getTimerCount()).toBe(0);
});

test('a new incorrect verdict interrupts the prior success effect', async () => {
  const view = await render(<Harness state="correct"/>);
  await act(async () => jest.advanceTimersByTime(100));
  await view.rerender(<Harness state="incorrect"/>);
  await act(async () => jest.advanceTimersByTime(1000));
  expect(readStyle().transform).toEqual([{ scale: 1 }, { translateX: 0 }]);
  expect(readStyle().color).toBe('rgba(246, 243, 255, 1)');
});
