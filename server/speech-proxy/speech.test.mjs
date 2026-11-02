import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { allowedLocales, parseAzureResult, toPcmWav, transcribeAzure } from './speech-service.mjs';
import { createSpeechServer } from './server.mjs';

const config = { endpoint: 'https://birtalk.cognitiveservices.azure.com/', key: 'secret-for-test', locale: 'en-US' };
const sample = () => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1', '-c:a', 'aac', '-movflags', 'frag_keyframe+empty_moov', '-f', 'mp4', 'pipe:1']);

test('converts an actual M4A into a valid mono 16 kHz 16-bit WAV', async () => {
  const wav = await toPcmWav(sample());
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF'); assert.equal(wav.toString('ascii', 8, 12), 'WAVE');
  assert.equal(wav.readUInt32LE(4), wav.length - 8); assert.equal(wav.readUInt16LE(22), 1); assert.equal(wav.readUInt32LE(24), 16000); assert.equal(wav.readUInt16LE(34), 16); assert.equal(wav.readUInt32LE(40), wav.length - 44);
  await assert.rejects(() => toPcmWav(Buffer.alloc(80)), /invalid_audio/);
});

test('low confidence, empty or uncertain responses remain unverified', () => {
  for (const value of [{ RecognitionStatus: 'NoMatch' }, { RecognitionStatus: 'Success', NBest: [{ Display: 'Hi', Confidence: .2 }] }, { RecognitionStatus: 'Success', NBest: [{ Display: 'Hi' }] }]) assert.deepEqual(parseAzureResult(value), { status: 'unverified' });
  assert.deepEqual(parseAzureResult({ RecognitionStatus: 'Success', NBest: [{ Display: 'Hello!', Confidence: .9 }] }), { status: 'recognized', text: 'Hello!', confidence: .9 });
  assert.ok(['en-US', 'de-DE', 'ru-RU'].every(locale => allowedLocales.has(locale)));
});

test('Azure receives only valid endpoint, locale and PCM; key is never returned', async () => {
  let seen;
  const fetcher = async (url, init) => { seen = { url: String(url), ...init }; return Response.json({ RecognitionStatus: 'Success', NBest: [{ Display: 'Hello!', Confidence: .9 }] }); };
  const result = await transcribeAzure(Buffer.from('RIFF'), { ...config, fetcher });
  assert.equal(result.text, 'Hello!'); assert.match(seen.url, /language=en-US/); assert.equal(seen.headers['Ocp-Apim-Subscription-Key'], config.key);
  assert.ok(!JSON.stringify(result).includes(config.key));
  await assert.rejects(() => transcribeAzure(Buffer.from('x'), { ...config, endpoint: 'https://evil.example/', fetcher }), /invalid_endpoint/);
  await assert.rejects(() => transcribeAzure(Buffer.from('x'), { ...config, locale: 'xx-ZZ', fetcher }), /unsupported_language/);
});

test('server requires a valid user and rejects invalid requests before sending audio', async t => {
  let azureCalls = 0;
  const fetcher = async (url, init) => {
    if (String(url).includes('/auth/v1/user')) return init.headers.Authorization === 'Bearer good.jwt.token' ? Response.json({ id: 'user-1' }) : new Response('', { status: 401 });
    azureCalls++; return Response.json({ RecognitionStatus: 'Success', NBest: [{ Display: 'Hello!', Confidence: .9 }] });
  };
  const server = createSpeechServer({ speechEndpoint: config.endpoint, speechKey: config.key, supabaseUrl: 'https://abc123.supabase.co', supabaseAnonKey: 'anon', fetcher, convert: async () => Buffer.from('RIFF') });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); t.after(() => server.close());
  const url = `http://127.0.0.1:${server.address().port}/v1/speech/transcribe`;
  const call = (authorization, locale = 'en-US') => fetch(url, { method: 'POST', headers: { authorization, 'content-type': 'audio/mp4', 'x-speech-locale': locale }, body: 'test-audio' });
  assert.equal((await call('Bearer bad.jwt.token')).status, 401); assert.equal(azureCalls, 0);
  assert.equal((await call('Bearer good.jwt.token', 'xx-ZZ')).status, 400); assert.equal(azureCalls, 0);
  const response = await call('Bearer good.jwt.token'); assert.equal(response.status, 200); const body = await response.json();
  assert.equal(body.text, 'Hello!'); assert.equal(azureCalls, 1); assert.ok(!JSON.stringify(body).includes(config.key));
});
