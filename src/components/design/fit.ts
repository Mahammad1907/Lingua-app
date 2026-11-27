// Fixed lesson screens (user, 23 Nov 2026): when a card does not fit between the header and the footer, the
// pictures shrink first (this factor, 1 → ART_MIN); only then is the whole card scaled. Same on iPhone and Android.
import { createContext, useContext, useId } from 'react';
import type { LayoutChangeEvent } from 'react-native';

export const ART_MIN = 0.55;
export const ArtFit = createContext(1);
export const useArtFit = () => useContext(ArtFit);

// Exact picture size (27 Nov 2026, user: the picture stayed small with empty space below). Every picture reports its
// laid-out height; the lesson screen works out the one picture size that fills the free space in a single step.
export const ArtReport = createContext<((key: string, fullHeight: number) => void) | null>(null);
/** onLayout for a picture whose height follows the ArtFit factor. */
export function useArtLayout() {
  const report = useContext(ArtReport); const art = useContext(ArtFit); const key = useId();
  return report ? (e: LayoutChangeEvent) => report(key, e.nativeEvent.layout.height / Math.max(art, 0.01)) : undefined;
}
