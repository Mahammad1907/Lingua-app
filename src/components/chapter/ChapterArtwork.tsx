import { Image, StyleSheet, View } from 'react-native';
import type { JourneyArtwork } from '../../utils/chapterJourney';
import { HomeArtwork } from '../home/HomeArtwork';

const atlas = require('../../../assets/chapter/lesson-atlas.webp');
const cells = { greeting: [0, 0], board: [1, 0], dialogue: [0, 1], questions: [1, 1] } as const;

export function ChapterArtwork({ name, size }: { name: JourneyArtwork; size: number }) {
  if (!(name in cells)) {
    return <HomeArtwork name={name as Exclude<JourneyArtwork, keyof typeof cells>} style={{ width: size, height: size }} />;
  }
  const [column, row] = cells[name as keyof typeof cells];
  return <View pointerEvents="none" style={{ width: size, height: size, overflow: 'hidden' }}>
    <Image source={atlas} accessible={false} resizeMode="stretch" style={[s.atlas,
      { width: size * 2, height: size * 2, left: -column * size, top: -row * size }]} />
  </View>;
}
const s = StyleSheet.create({ atlas: { position: 'absolute' } });
