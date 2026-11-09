import { Image, StyleSheet, View } from 'react-native';
import type { CurrentScene } from '../../utils/currentScenePlan';
const introductions = require('../../../assets/lessons/current/introductions-atlas.webp');
const politeness = require('../../../assets/lessons/current/politeness-atlas.webp');
export const currentSceneAssets: Record<CurrentScene, { source: number; columns: number; rows: number; cell: number }> = {
  greeting: { source: require('../../../assets/lessons/current/greeting-pair.webp'), columns: 1, rows: 1, cell: 0 },
  farewell: { source: introductions, columns: 2, rows: 2, cell: 0 },
  name: { source: introductions, columns: 2, rows: 2, cell: 1 },
  meeting: { source: introductions, columns: 2, rows: 2, cell: 2 },
  feelings: { source: introductions, columns: 2, rows: 2, cell: 3 },
  thanks: { source: politeness, columns: 2, rows: 2, cell: 0 },
  attention: { source: politeness, columns: 2, rows: 2, cell: 1 },
  apology: { source: politeness, columns: 2, rows: 2, cell: 2 },
  repeat: { source: politeness, columns: 2, rows: 2, cell: 3 },
  conversation: { source: require('../../../assets/lessons/current/conversation.webp'), columns: 1, rows: 1, cell: 0 },
};
// The atlas cells were generated with entire bodies and internal safe margins.
// Select a cell without stretching it or cropping the figures inside that cell.
export function SceneFrame({ source, columns, rows, cell, height = 108 }: { source: number; columns: number; rows: number; cell: number; height?: number }) {
  const aspect = 1.5 * rows / columns;
  return <View testID="current-scene-art" accessible={false} style={s.outer}><View style={{ width: '100%', maxWidth: height * aspect, aspectRatio: aspect, overflow: 'hidden' }}><Image source={source} accessible={false} resizeMode="stretch" style={{ position: 'absolute', width: `${100 * columns}%`, height: `${100 * rows}%`, left: `${-(cell % columns) * 100}%`, top: `${-Math.floor(cell / columns) * 100}%` }} /></View></View>;
}
export default function CurrentSceneArt({ scene, height }: { scene: CurrentScene; height?: number }) {
  return <SceneFrame {...currentSceneAssets[scene]} height={height} />;
}
const s = StyleSheet.create({ outer: { width: '100%', alignItems: 'center', justifyContent: 'center' } });
