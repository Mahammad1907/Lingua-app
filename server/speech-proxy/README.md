# Azure Speech pilot (not production)

This private pilot accepts a signed-in Supabase user's short M4A recording, converts it in memory with FFmpeg to mono 16-bit/16-kHz WAV, then sends it to Azure's short-audio REST API. The app never contains the Azure key. The user sees and confirms the transcript before any grading. Declining, unclear audio, denial, errors, and connection failures remain unverified. The recording can be retried without losing a heart. This service is not a pronunciation assessment.

## Prerequisites

- A Speech resource with a matching region and key. The F0 free tier supports the short-audio API but allows only one concurrent recognition request. Fast transcription is not available in F0. Charges/quotas and F0 eligibility depend on the Azure account; verify in Azure before use.
- A Supabase project and a real signed-in user. The app and server must point to the same project. A publishable/anon key is not user authentication; the server validates the user's access token through Supabase Auth on every request.
- Node 20+ and FFmpeg. Keep the Azure key only in the server process environment or a secure server-side secret store; never put it in any `EXPO_PUBLIC_*` variable, commit, chat, or screenshot.
- The phone must use a trusted HTTPS endpoint for the proxy. The server intentionally listens on `127.0.0.1`; use a trusted HTTPS reverse proxy for a private pilot. Do not send user tokens or audio over plain LAN HTTP.

## Local setup (server only)

Provide `AZURE_SPEECH_ENDPOINT` as an HTTPS origin of either `https://<resource>.cognitiveservices.azure.com/` or `https://<region>.stt.speech.microsoft.com/`, `AZURE_SPEECH_KEY` as the matching server-side Speech key, and `SUPABASE_URL` / `SUPABASE_ANON_KEY` for the same Supabase project used by the app. Store these in the server process environment, not in the project or mobile bundle.

Run from the repository root:

```sh
node server/speech-proxy/index.mjs
```

The pilot runs on `127.0.0.1:8787` unless `PORT` is set. Make only this private local service reachable through a trusted HTTPS tunnel or reverse proxy. Only the public HTTPS base URL goes in the app's local `EXPO_PUBLIC_SPEECH_PROXY_URL`, then restart Expo. The key never goes there. If the URL is missing or invalid, the existing recording-only behavior remains available.

## Privacy and limitations

The app asks for permission before sending voice data to Microsoft Azure in each lesson session. The proxy holds recordings in memory during processing and does not deliberately save or log audio or transcripts. Azure and the HTTPS proxy have their own policies; review their current terms and the region before using real learner recordings.

Limits are 2 MiB, 20 seconds, one active request, and 20 requests per authenticated user per hour. The rate limit is per process and resets on restart. **Do not deploy this pilot as a public or multi-instance production service** without a shared durable rate limiter, abuse prevention, privacy/retention decisions, monitoring and a production hosting review. F0's concurrency limit is not suitable for many simultaneous users.

No physical iPhone, SDK 58, real Azure credentials or live server were available for validation. A synthetic M4A conversion, authentication/error cases and a mocked Azure response were tested locally. English lesson requests currently use `en-US`; the server can accept `en-GB`, `de-DE` and `ru-RU`, but future language lessons still need language-specific learning content and grading.

Tests: `node --test server/speech-proxy/speech.test.mjs` and `npx jest --config jest.lesson.config.cjs --runInBand`.
