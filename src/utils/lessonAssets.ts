import { Image as NativeImage } from 'react-native';
import { Image } from 'expo-image';
export const classroomSource = require('../../assets/lessons/written-classroom.webp');
export const lessonSceneSources = {
  conversation: require('../../assets/lessons/scenes/toy-park.webp'),
  gratitude: require('../../assets/lessons/scenes/toy-gratitude.webp'),
  apology: require('../../assets/lessons/scenes/toy-apology.webp'),
  clarify: require('../../assets/lessons/scenes/toy-clarify.webp'),
  farewell: require('../../assets/lessons/scenes/toy-farewell.webp'),
  'name-card': require('../../assets/lessons/scenes/toy-introduction.webp'),
  feelings: require('../../assets/lessons/scenes/toy-feeling-okay.webp'),
};
const warmed = new Set<string>();
export async function warmLessonArtwork(sources: readonly number[] = [classroomSource, lessonSceneSources.conversation]) {
  await Promise.all([...new Set(sources)].map(async source => {
    let uri: string | undefined;
    try {
      const resolved = NativeImage.resolveAssetSource?.(source) || source;
      uri = typeof resolved === 'object' && resolved ? resolved.uri : undefined;
      if (!uri || warmed.has(uri)) return;
      warmed.add(uri);
      if (!await Image.prefetch(uri, 'memory-disk')) warmed.delete(uri);
    } catch { if (uri) warmed.delete(uri); }
  }));
}
