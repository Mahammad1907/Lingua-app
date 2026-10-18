import { Image, type StyleProp, type ImageStyle } from 'react-native';
import type { HomeArtworkKey } from '../../utils/homeCourse';
const images = {
  fox: require('../../../assets/home/fox.webp'),
  identity: require('../../../assets/home/identity.webp'),
  family: require('../../../assets/home/family.webp'),
  backpack: require('../../../assets/home/backpack.webp'),
  house: require('../../../assets/home/house.webp'),
  clock: require('../../../assets/home/clock.webp'),
  guitar: require('../../../assets/home/guitar.webp'),
  headphones: require('../../../assets/home/headphones.webp'),
};
export function HomeArtwork({ name, style }: { name: HomeArtworkKey; style?: StyleProp<ImageStyle> }) {
  return <Image source={images[name]} style={style} resizeMode="contain" accessible={false} />;
}
