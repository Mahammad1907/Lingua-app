interface RecordingPlayer { pause: () => void; replace: (source: { uri: string }) => void }

// Some Expo Go native audio versions reject replace(null), despite the JS type.
// Clearing a draft pauses the old source; only a real recording is replaced.
export function loadRecordedAudio(player: RecordingPlayer, uri?: string | null): 'idle' | 'ready' | 'error' {
  try {
    player.pause();
    if (!uri || !uri.trim()) return 'idle';
    player.replace({ uri });
    return 'ready';
  } catch { return 'error'; }
}
