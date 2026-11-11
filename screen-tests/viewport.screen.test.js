import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import FixedLessonViewport from '../src/components/lesson/FixedLessonViewport';

for (const [width, height] of [[320, 340], [390, 600], [430, 700]]) {
 test(`body fits ${width}×${height} including expanded content without scrolling or truncation`, async () => {
  await render(<FixedLessonViewport><Text>Full question and answer remain mounted</Text></FixedLessonViewport>);
  await act(async () => fireEvent(screen.getByTestId('fixed-lesson-viewport'), 'layout', { nativeEvent: { layout: { width, height } } }));
  for (const natural of [290, 700, 1000, 450]) {
   await act(async () => fireEvent(screen.getByTestId('fixed-lesson-viewport-content'), 'layout', { nativeEvent: { layout: { width, height: natural } } }));
   const style = StyleSheet.flatten(screen.getByTestId('fixed-lesson-viewport-content').props.style);
   const scale = style.transform[0].scale;
   expect(natural * scale).toBeLessThanOrEqual(height);
   expect(style.left).toBeGreaterThanOrEqual(0);
   expect(style.left + width * scale).toBeLessThanOrEqual(width);
   expect(screen.getByTestId('fixed-lesson-viewport').props.onScroll).toBeUndefined();
   expect(screen.getByText('Full question and answer remain mounted').props.numberOfLines).toBeUndefined();
  }
 });
}
test('choice layouts can fill the measured area while preserving unscaled controls', async () => {
 await render(<FixedLessonViewport fill><Text>Choice content</Text></FixedLessonViewport>);
 await act(async () => fireEvent(screen.getByTestId('fixed-lesson-viewport'), 'layout', { nativeEvent: { layout: { width: 390, height: 600 } } }));
 const style = StyleSheet.flatten(screen.getByTestId('fixed-lesson-viewport-content').props.style);
 expect(style.minHeight).toBe(598); expect(style.transform[0].scale).toBe(1);
});
