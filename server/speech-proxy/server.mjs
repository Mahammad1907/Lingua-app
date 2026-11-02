import http from 'node:http';
import { MAX_AUDIO_BYTES, allowedLocales, toPcmWav, transcribeAzure } from './speech-service.mjs';

const json = (response, status, body) => { response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); response.end(JSON.stringify(body)); };

export function createSpeechServer({ speechEndpoint, speechKey, supabaseUrl, supabaseAnonKey, fetcher = fetch, convert = toPcmWav, now = Date.now }) {
  // This per-process guard is intentionally only suitable for a small private
  // pilot. A multi-instance public service needs shared durable quotas.
  const attempts = new Map(); let busy = false;
  const base = new URL(supabaseUrl);
  if (base.protocol !== 'https:' || !/^[a-z0-9-]+\.supabase\.co$/i.test(base.hostname) || base.username || base.password || base.port || base.pathname !== '/' || base.search || base.hash) throw new Error('Invalid Supabase URL');
  const authUrl = new URL('/auth/v1/user', base);
  return http.createServer(async (request, response) => {
    if (request.method !== 'POST' || request.url !== '/v1/speech/transcribe') return json(response, 404, { error: 'not_found' });
    const auth = request.headers.authorization || '';
    if (!/^Bearer [A-Za-z0-9._-]+$/.test(auth)) return json(response, 401, { error: 'unauthorized' });
    const locale = request.headers['x-speech-locale'];
    if (typeof locale !== 'string' || !allowedLocales.has(locale)) return json(response, 400, { error: 'unsupported_language' });
    if (!/^audio\/(mp4|x-m4a|m4a)(?:\s*;.*)?$/i.test(request.headers['content-type'] || '')) return json(response, 415, { error: 'unsupported_audio' });
    if (Number(request.headers['content-length'] || 0) > MAX_AUDIO_BYTES) return json(response, 413, { error: 'audio_too_large' });
    try {
      const userResponse = await fetcher(authUrl, { headers: { apikey: supabaseAnonKey, Authorization: auth }, signal: AbortSignal.timeout(8000) });
      if (!userResponse.ok) return json(response, 401, { error: 'unauthorized' });
      const user = await userResponse.json();
      if (typeof user?.id !== 'string' || !user.id) return json(response, 401, { error: 'unauthorized' });
      const timestamp = now();
      for (const [id, history] of attempts) if (!history.some(time => timestamp - time < 3600000)) attempts.delete(id);
      const recent = (attempts.get(user.id) || []).filter(time => timestamp - time < 3600000);
      if (recent.length >= 20) return json(response, 429, { error: 'rate_limited' });
      if (busy) return json(response, 429, { error: 'busy' });
      busy = true; attempts.set(user.id, [...recent, timestamp]);
      try {
        const chunks = []; let length = 0;
        for await (const chunk of request) {
          length += chunk.length;
          if (length > MAX_AUDIO_BYTES) { json(response, 413, { error: 'audio_too_large' }); request.destroy(); return; }
          chunks.push(chunk);
        }
        if (request.aborted) return;
        const wav = await convert(Buffer.concat(chunks));
        const answer = await transcribeAzure(wav, { endpoint: speechEndpoint, key: speechKey, locale, fetcher });
        return json(response, 200, answer);
      } finally { busy = false; }
    } catch { if (!response.headersSent) json(response, 503, { error: 'unavailable' }); }
  });
}
