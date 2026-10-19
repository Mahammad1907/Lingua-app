import { Image, StyleSheet, View } from 'react-native';
import type { JourneyArtwork } from '../../utils/chapterJourney';
import { HomeArtwork } from '../home/HomeArtwork';

const atlas = require('../../../assets/chapter/lesson-atlas.webp');
const referenceAtlas = require('../../../assets/chapter/reference-atlas.webp');
const cells = { greeting: [0, 0], board: [1, 0], dialogue: [0, 1], questions: [1, 1] } as const;

export function ChapterArtwork({ name, size }: { name: JourneyArtwork; size: number }) {
  if (name === 'identity') return <ReferenceArtwork name="identity" width={size} height={size} />;
  if (!(name in cells)) {
    return <HomeArtwork name={name as Exclude<JourneyArtwork, keyof typeof cells>} style={{ width: size, height: size }} />;
  }
  const [column, row] = cells[name as keyof typeof cells];
  return <View pointerEvents="none" style={{ width: size, height: size, overflow: 'hidden' }}>
    <Image source={atlas} accessible={false} resizeMode="stretch" style={[s.atlas,
      { width: size * 2, height: size * 2, left: -column * size, top: -row * size }]} />
  </View>;
}
export function ReferenceArtwork({ name, width, height }: { name: 'fox' | 'identity'; width: number; height: number }) {
  // The fox tail extends beyond the nominal half-cell in the generated atlas.
  // Crop the real clean bounds so the tail is retained and the ID stays separate.
  const crop = name === 'fox' ? { x: 0, width: 0.56 } : { x: 0.56, width: 0.44 };
  return <View pointerEvents="none" style={{ width, height, overflow: 'hidden' }}>
    <Image source={referenceAtlas} accessible={false} resizeMode="stretch" style={[s.atlas,
      { width: width / crop.width, height, left: -crop.x / crop.width * width, top: 0 }]} />
  </View>;
}
const s = StyleSheet.create({ atlas: { position: 'absolute' } });
