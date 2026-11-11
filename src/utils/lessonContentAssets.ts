import type { ImageSourcePropType } from 'react-native';
/** Authored content uses stable IDs, never generated answers or remote image searches. */
const objectImages: Record<string, ImageSourcePropType> = {
  apple: require('../../assets/lessons/scenes/object-apple.webp'),
  backpack: require('../../assets/home/backpack.webp'),
  house: require('../../assets/home/house.webp'),
  clock: require('../../assets/home/clock.webp'),
  guitar: require('../../assets/home/guitar.webp'),
  headphones: require('../../assets/home/headphones.webp'),
};
export const objectImage = (id: string): ImageSourcePropType | undefined => objectImages[id];
const scenes: Record<string, ImageSourcePropType> = {
  'toy-park': require('../../assets/lessons/scenes/toy-park.webp'),
  'toy-farewell': require('../../assets/lessons/scenes/toy-farewell.webp'),
};
export const contentScene = (id: string): ImageSourcePropType | undefined => scenes[id];
