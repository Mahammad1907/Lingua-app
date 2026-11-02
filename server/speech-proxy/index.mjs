import { createSpeechServer } from './server.mjs';

const required = ['AZURE_SPEECH_ENDPOINT', 'AZURE_SPEECH_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
if (required.some(name => !process.env[name])) {
  console.error('Speech server configuration is missing. Check the server README; never put credentials in the mobile app.');
  process.exit(1);
}
const port = Number(process.env.PORT || 8787);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
const server = createSpeechServer({ speechEndpoint: process.env.AZURE_SPEECH_ENDPOINT, speechKey: process.env.AZURE_SPEECH_KEY, supabaseUrl: process.env.SUPABASE_URL, supabaseAnonKey: process.env.SUPABASE_ANON_KEY });
server.requestTimeout = 25000; server.headersTimeout = 10000;
server.listen(port, '127.0.0.1', () => console.log(`Private speech pilot listening on 127.0.0.1:${port}; use an HTTPS gateway for a phone.`));
