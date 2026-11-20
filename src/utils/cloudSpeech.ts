import { supabase } from '../lib/supabase';
import type { UnverifiedRecording } from './speechTurn';

export type CloudSpeechResult = { status: 'recognized'; text: string; confidence: number } | { status: 'unverified' };

// Public endpoint only: the Azure key is held by the backend, never the app.
export function speechProxyEndpoint(): string | null {
  const raw = process.env.EXPO_PUBLIC_SPEECH_PROXY_URL;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) return null;
    url.pathname = '/v1/speech/transcribe';
    return url.toString();
  } catch { return null; }
}

export async function recognizeRecording(recording: UnverifiedRecording, locale: 'en-US' | 'en-US' | 'de-DE' | 'ru-RU', signal?: AbortSignal): Promise<CloudSpeechResult> {
  const endpoint = speechProxyEndpoint();
  if (!endpoint || !supabase || recording.duration < .3 || recording.duration > 20.5) return { status: 'unverified' };
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token || signal?.aborted) return { status: 'unverified' };
    const local = await fetch(recording.uri, { signal });
    if (!local.ok) return { status: 'unverified' };
    const audio = await local.arrayBuffer();
    if (audio.byteLength < 32 || audio.byteLength > 2 * 1024 * 1024 || signal?.aborted) return { status: 'unverified' };
    const response = await fetch(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'audio/mp4', 'X-Speech-Locale': locale }, body: audio, signal });
    if (!response.ok) return { status: 'unverified' };
    const result: unknown = await response.json();
    if (!result || typeof result !== 'object') return { status: 'unverified' };
    const candidate = result as Partial<Extract<CloudSpeechResult, { status: 'recognized' }>>;
    if (candidate.status !== 'recognized' || typeof candidate.text !== 'string' || !candidate.text.trim() || candidate.text.length > 500 || typeof candidate.confidence !== 'number' || !Number.isFinite(candidate.confidence) || candidate.confidence < .35 || candidate.confidence > 1) return { status: 'unverified' };
    return { status: 'recognized', text: candidate.text.trim(), confidence: candidate.confidence };
  } catch { return { status: 'unverified' }; }
}
