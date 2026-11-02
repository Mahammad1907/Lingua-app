import { recognizeRecording, speechProxyEndpoint } from '../src/utils/cloudSpeech';

const mockGetSession = jest.fn();
jest.mock('../src/lib/supabase', () => ({ supabase: { auth: { getSession: (...args) => mockGetSession(...args) } } }));
const recording = { uri: 'file:///audio.m4a', duration: 1, token: 'recording:1' };
const savedFetch = global.fetch;

afterEach(() => { global.fetch = savedFetch; delete process.env.EXPO_PUBLIC_SPEECH_PROXY_URL; jest.clearAllMocks(); });

test('cloud speech requires HTTPS and does not send audio without a signed-in user', async () => {
  process.env.EXPO_PUBLIC_SPEECH_PROXY_URL = 'http://example.com';
  expect(speechProxyEndpoint()).toBeNull();
  process.env.EXPO_PUBLIC_SPEECH_PROXY_URL = 'https://example.com';
  mockGetSession.mockResolvedValue({ data: { session: null } }); global.fetch = jest.fn();
  expect(await recognizeRecording(recording, 'en-US')).toEqual({ status: 'unverified' });
  expect(global.fetch).not.toHaveBeenCalled();
});

test('recognition sends recorded bytes with the user session and treats invalid output as unverified', async () => {
  process.env.EXPO_PUBLIC_SPEECH_PROXY_URL = 'https://speech.example.test';
  mockGetSession.mockResolvedValue({ data: { session: { access_token: 'user-token' } } });
  const bytes = new Uint8Array(64).buffer;
  global.fetch = jest.fn().mockResolvedValueOnce({ ok: true, arrayBuffer: async () => bytes }).mockResolvedValueOnce({ ok: true, json: async () => ({ status: 'recognized', text: 'Hello!', confidence: .9 }) });
  expect(await recognizeRecording(recording, 'en-US')).toEqual({ status: 'recognized', text: 'Hello!', confidence: .9 });
  const [url, init] = global.fetch.mock.calls[1];
  expect(url).toBe('https://speech.example.test/v1/speech/transcribe');
  expect(init.headers.Authorization).toBe('Bearer user-token'); expect(init.headers['X-Speech-Locale']).toBe('en-US'); expect(init.body).toBe(bytes);
  global.fetch.mockReset().mockResolvedValueOnce({ ok: true, arrayBuffer: async () => bytes }).mockResolvedValueOnce({ ok: true, json: async () => ({ status: 'recognized', text: 'Hi', confidence: .1 }) });
  expect(await recognizeRecording(recording, 'en-US')).toEqual({ status: 'unverified' });
});
