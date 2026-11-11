import type { StyleProp, ImageStyle } from 'react-native';
import { Image } from 'expo-image';
import type { HomeArtworkKey } from '../../utils/homeCourse';
const images = {
  fox: require('../../../assets/mascot/lesson-guide.webp'),
  identity: require('../../../assets/home/identity.webp'),
  family: require('../../../assets/home/family.webp'),
  backpack: require('../../../assets/home/backpack.webp'),
  house: require('../../../assets/home/house.webp'),
  clock: require('../../../assets/home/clock.webp'),
  guitar: require('../../../assets/home/guitar.webp'),
  headphones: require('../../../assets/home/headphones.webp'),
};
export function HomeArtwork({ name, style }: { name: HomeArtworkKey; style?: StyleProp<ImageStyle> }) {
  return <Image source={images[name]} style={style} contentFit="contain" accessible={false} />;
}
