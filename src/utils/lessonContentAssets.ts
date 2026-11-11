import type { ApprovedSceneId } from './approvedLessonScenes';
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
const scenes: Record<ApprovedSceneId, ImageSourcePropType> = {
  'toy-entrance': require('../../assets/lessons/scenes/toy-entrance.webp'),
  'toy-introduction': require('../../assets/lessons/scenes/toy-introduction.webp'),
  'toy-ask-name': require('../../assets/lessons/scenes/toy-ask-name.webp'),
  'toy-feeling-good': require('../../assets/lessons/scenes/toy-feeling-good.webp'),
  'toy-feeling-okay': require('../../assets/lessons/scenes/toy-feeling-okay.webp'),
  'toy-feeling-unwell': require('../../assets/lessons/scenes/toy-feeling-unwell.webp'),
  'toy-gratitude': require('../../assets/lessons/scenes/toy-gratitude.webp'),
  'toy-apology': require('../../assets/lessons/scenes/toy-apology.webp'),
  'toy-clarify': require('../../assets/lessons/scenes/toy-clarify.webp'),
  'toy-park': require('../../assets/lessons/scenes/toy-park.webp'),
  'toy-farewell': require('../../assets/lessons/scenes/toy-farewell.webp'),
};
export const contentScene = (id: string): ImageSourcePropType | undefined => scenes[id as ApprovedSceneId];
