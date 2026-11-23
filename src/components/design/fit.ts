// Fixed lesson screens (user, 23 Nov 2026): when a card does not fit between the header and the footer, the
// pictures shrink first (this factor, 1 → ART_MIN); only then is the whole card scaled. Same on iPhone and Android.
import { createContext, useContext } from 'react';

export const ART_MIN = 0.55;
export const ArtFit = createContext(1);
export const useArtFit = () => useContext(ArtFit);
