import { createAudioPlayer } from 'expo-audio';
/** Completion comes only from native playback, never a duration estimate. */
export function playPreparedAudio(source: number, rate: number, onDone: () => void, onError: () => void): () => void {
  const player = createAudioPlayer(source, { updateInterval: 100 });
  let closed = false;
  let subscription: { remove: () => void } | undefined;
  const stop = () => {
    if (closed) return;
    closed = true; subscription?.remove();
    try { player.pause(); } catch { /* Audio services may have been reset. */ }
    try { player.release(); } catch { /* Already released. */ }
  };
  try {
    subscription = player.addListener('playbackStatusUpdate', status => {
      if (closed) return;
      if (status.error) { stop(); onError(); }
      else if (status.didJustFinish && status.isLoaded) { stop(); onDone(); }
    });
    player.shouldCorrectPitch = true;
    player.playbackRate = Math.max(.4, Math.min(1.5, rate));
    player.play();
  } catch { stop(); onError(); }
  return stop;
}
