import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Image as NativeImage } from 'react-native';
import LessonImage from '../src/components/lesson/LessonImage';
import LessonWelcome from '../src/components/lesson/LessonWelcome';
import ListeningScene from '../src/components/lesson/ListeningScene';
import { lessonSceneSources } from '../src/utils/lessonAssets';
import { b1Packet } from '../src/data/b1Course';
import { lessonIntroduction } from '../src/utils/lessonGuide';
import { ClassroomScene, ink } from '../src/components/lesson/LessonSurface';
jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(async () => null), setItem: jest.fn(async () => {}) }));
jest.mock('expo-image', () => ({ Image: props => {
  const { View } = require('react-native'); return <View testID="lesson-image" {...props} />;
} }));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: props => {
  const { View } = require('react-native'); return <View {...props} />;
} }));
jest.mock('react-native-svg', () => ({ __esModule: true, default: () => null, Path: () => null, Rect: () => null, Circle: () => null }));
beforeEach(() => { jest.spyOn(NativeImage, 'resolveAssetSource').mockImplementation(source => ({ uri: `asset:${source}`, width: 1200, height: 800, scale: 1 })); });
afterEach(() => jest.restoreAllMocks());
test('only the opted-in lesson listening scene reuses the neutral listening artwork', async () => {
  const view = await render(<ListeningScene playing={false} height={100} />);
  expect(screen.queryByTestId('lesson-image')).not.toBeOnTheScreen();
  await view.rerender(<ListeningScene playing={false} height={100} showIllustration />);
  expect(screen.getByTestId('lesson-image').props.source).toBe(lessonSceneSources.clarify);
  expect(screen.getByLabelText('Dinləmə tapşırığı')).toBeOnTheScreen();
});
test('image failure has a retry, successful load settles, a new source resets loading', async () => {
  const view = await render(<LessonImage source={1} />);
  expect(screen.getByText('Şəkil yüklənir…')).toBeOnTheScreen();
  expect(screen.getByTestId('lesson-image').props.cachePolicy).toBe('memory-disk');
  await act(async () => fireEvent(screen.getByTestId('lesson-image'), 'error'));
  await act(async () => fireEvent.press(screen.getByText('Şəkil açılmadı · Yenidən yüklə')));
  expect(screen.getByText('Şəkil yüklənir…')).toBeOnTheScreen();
  await act(async () => fireEvent(screen.getByTestId('lesson-image'), 'load'));
  expect(screen.queryByText('Şəkil yüklənir…')).not.toBeOnTheScreen();
  await view.rerender(<LessonImage source={2} />);
  expect(screen.getByText('Şəkil yüklənir…')).toBeOnTheScreen();
});
test('original introduction keeps the full title, uncropped board, objectives and caption', async () => {
  const packet = b1Packet[0], intro = lessonIntroduction(packet);
  await render(<LessonWelcome packet={packet} compact sceneHeight={180} />);
  expect(screen.getByRole('header').props.children).toBe(packet.title);
  expect(screen.getByTestId('lesson-image').props.contentFit).toBe('contain');
  expect(screen.getByText(intro.board)).toBeOnTheScreen();
  intro.objectives.forEach(text => expect(screen.getByText(text)).toBeOnTheScreen());
  expect(screen.getByText('Dinlə, məşq et və özün cavab ver.')).toBeOnTheScreen();
});
test('web images do not require native source resolution; teaching boards color individual new words', async () => {
  const nativeResolve = NativeImage.resolveAssetSource;
  NativeImage.resolveAssetSource = undefined;
  try {
    const view = await render(<LessonImage source={{ uri: '/board.webp' }} />);
    expect(screen.getByTestId('lesson-image').props.source.uri).toBe('/board.webp');
    await view.unmount();
    await render(<ClassroomScene text="Your name is Leyla." height={180} freshWords={new Set(['your'])} />);
    expect(screen.getByText('Your').props.style.color).toBe(ink.orange);
    expect(screen.getByText('Your name is Leyla.')).toBeOnTheScreen();
  } finally { NativeImage.resolveAssetSource = nativeResolve; }
});
