import { Image, LayoutChangeEvent, View } from 'react-native';
import { useState } from 'react';
type Crop = [number, number, number, number];
const atlas = require('../../assets/birtalk/learning-atlas.png');
export function AtlasCrop({ crop, ratio = 1 }: { crop: Crop; ratio?: number }) {
  const [width, setWidth] = useState(0);
  const [x, y, w, h] = crop;
  const height = width / ratio;
  const scale = Math.max(width / (1536 * w), height / (1024 * h));
  return <View onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)} style={{ width: '100%', aspectRatio: ratio, overflow: 'hidden' }}>
    {width > 0 ? <Image source={atlas} accessibilityIgnoresInvertColors style={{ position: 'absolute', width: 1536 * scale, height: 1024 * scale, left: -x * 1536 * scale - (1536 * w * scale - width) / 2, top: -y * 1024 * scale - (1024 * h * scale - height) / 2 }} /> : null}
  </View>;
}
export function BirFoxPortrait({ size = 42, variant = 0 }: { size?: number; variant?: number }) {
  const column = variant % 3;
  const row = Math.floor(variant / 3);
  return <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: '#28203E' }}><AtlasCrop crop={[.5 + column / 6, row ? .717 : .472, 1 / 6, row ? .283 : .245]} /></View>;
}
export const sceneCrops: Record<string, Crop> = { classroom: [0, 0, .5, .472], cafe: [.5, 0, .5, .472], park: [0, .472, .5, .528] };
