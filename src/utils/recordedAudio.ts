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
export function loadRecordedAudio(player: RecordingPlayer, uri?: unknown): 'idle' | 'ready' | 'error' {
  try {
    player.pause();
    if (uri === undefined || uri === null || uri === '') return 'idle';
    if (typeof uri !== 'string') return 'error';
    const source = uri.trim();
    if (!source) return 'idle';
    if (!/^(?:file|content|https?|blob):/i.test(source)) return 'error';
    player.replace({ uri: source });
    return 'ready';
  } catch { return 'error'; }
}
