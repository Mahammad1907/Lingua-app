interface RecordingPlayer { pause: () => void; replace: (source: { uri: string }) => void }

// Hook-owned native objects may already be released before our effect cleanup.
// Keep every native getter as well as method invocation inside the guard.
export function safelyStopRecorder(recorder: { readonly isRecording: boolean; stop: () => Promise<unknown> }): void {
  try { if (recorder.isRecording) void recorder.stop().catch(() => {}); } catch { /* Native hook already disposed it. */ }
}
export function safelyReadRecorder<T>(read: () => T): T | null {
  try { return read(); } catch { return null; }
}

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
