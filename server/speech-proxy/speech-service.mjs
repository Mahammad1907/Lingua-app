import { spawn } from 'node:child_process';

export const allowedLocales = new Set(['en-US', 'en-GB', 'de-DE', 'ru-RU']);
export const MAX_AUDIO_BYTES = 2 * 1024 * 1024;
const MAX_PCM_BYTES = 20 * 16000 * 2;

// The short-audio API needs an accurate PCM WAV header; ffmpeg writes raw PCM
// to memory so no voice recordings are stored on the server's filesystem.
export async function toPcmWav(audio, { ffmpeg = 'ffmpeg', timeoutMs = 12000 } = {}) {
  if (!Buffer.isBuffer(audio) || audio.length < 32 || audio.length > MAX_AUDIO_BYTES || audio.subarray(4, 8).toString('ascii') !== 'ftyp') throw new Error('invalid_audio');
  return new Promise((resolve, reject) => {
    let done = false, total = 0; const chunks = [];
    const child = spawn(ffmpeg, ['-nostdin', '-hide_banner', '-loglevel', 'error', '-protocol_whitelist', 'pipe', '-f', 'mov', '-i', 'pipe:0', '-t', '20', '-vn', '-ac', '1', '-ar', '16000', '-f', 's16le', '-acodec', 'pcm_s16le', 'pipe:1'], { stdio: ['pipe', 'pipe', 'ignore'] });
    const finish = (error, value) => { if (done) return; done = true; clearTimeout(timer); if (error) { child.kill('SIGKILL'); reject(error); } else resolve(value); };
    const timer = setTimeout(() => finish(new Error('conversion_timeout')), timeoutMs);
    child.on('error', () => finish(new Error('conversion_failed')));
    child.stdin.on('error', () => {});
    child.stdout.on('data', chunk => { total += chunk.length; if (total > MAX_PCM_BYTES) finish(new Error('audio_too_long')); else chunks.push(chunk); });
    child.on('close', code => {
      if (done) return;
      if (code !== 0 || total < 9600 || total % 2) return finish(new Error('conversion_failed'));
      const header = Buffer.alloc(44); header.write('RIFF', 0); header.writeUInt32LE(total + 36, 4); header.write('WAVEfmt ', 8); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22); header.writeUInt32LE(16000, 24); header.writeUInt32LE(32000, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34); header.write('data', 36); header.writeUInt32LE(total, 40);
      finish(null, Buffer.concat([header, ...chunks]));
    });
    child.stdin.end(audio);
  });
}

export function parseAzureResult(response) {
  if (!response || response.RecognitionStatus !== 'Success' || !Array.isArray(response.NBest) || !response.NBest.length) return { status: 'unverified' };
  const top = response.NBest[0]; const text = typeof top.Display === 'string' ? top.Display.trim() : '';
  const confidence = top.Confidence;
  if (!text || text.length > 500 || typeof confidence !== 'number' || !Number.isFinite(confidence) || confidence < 0.35 || confidence > 1) return { status: 'unverified' };
  // The first hypothesis is Azure's best recognition result, not necessarily
  // the entry with the largest confidence. The user must verify it on-device.
  return { status: 'recognized', text, confidence };
}

export async function transcribeAzure(wav, { endpoint, key, locale, fetcher = fetch, timeoutMs = 20000 }) {
  if (!allowedLocales.has(locale)) throw new Error('unsupported_language');
  const base = new URL(endpoint);
  const custom = /^[a-z0-9-]+\.cognitiveservices\.azure\.com$/i.test(base.hostname);
  const regional = /^[a-z0-9-]+\.stt\.speech\.microsoft\.com$/i.test(base.hostname);
  if (base.protocol !== 'https:' || !(custom || regional) || base.username || base.password || base.port || base.pathname !== '/' || base.search || base.hash) throw new Error('invalid_endpoint');
  const url = new URL(`${custom ? '/stt' : ''}/speech/recognition/conversation/cognitiveservices/v1`, base);
  url.searchParams.set('language', locale); url.searchParams.set('format', 'detailed');
  const result = await fetcher(url, { method: 'POST', headers: { 'Ocp-Apim-Subscription-Key': key, 'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000', Accept: 'application/json' }, body: wav, signal: AbortSignal.timeout(timeoutMs) });
  if (!result.ok) throw new Error(result.status === 429 ? 'rate_limited' : 'service_error');
  return parseAzureResult(await result.json());
}
