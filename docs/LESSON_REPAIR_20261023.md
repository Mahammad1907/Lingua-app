# First acquaintance: implementation repair, 23 October 2026

This repair targets the seven live English lessons in `b1Packet.json` and the
`PacketLesson` route on `codex/b1-lesson-screens-20261021`. They are A1 introductory
communication practice, not a certificate for completing all of A1.

## Existing visual reference

The supplied original introduction was traced to commit
`743baa007547153d97feaa9cfa00914210555991`. `LessonWelcome` restores that component:
the natural title, subtitle, full-width cover board, three objectives, caption and
existing footer. The original scene-height rule is restored in its parent.
The compact task header and the existing lesson theme remain in place.

All fourteen lesson artwork/catalog files and `ParticleWave.tsx` are byte-identical
to the starting branch. No pictures were regenerated. The three existing farewell,
name-card and feelings illustrations retain their five teaching placements.
Assessed listening cards use the sound wave. Spoken answers retain the microphone,
actual input-driven wave, stop, review, replay when supported, delete, retry and
send controls. Silence settles the wave; playback may animate decoratively.

## Repairs

| Area | Resulting behavior |
| --- | --- |
| Feedback | Every assessable lesson answer stays on its card with correct, partial or incorrect feedback. A 650 ms input guard prevents a rapid second tap from skipping the feedback. The checkmark has a short entry animation and respects reduced motion. |
| Repeated answers | A fresh typed submission has a fresh token. Re-entering the same wrong answer in review still produces feedback. Genuine duplicate voice submissions remain blocked. |
| Written errors | Nonsense such as `hjj` is incorrect writing. Recognition uncertainty remains a separate technical state. |
| Meaning | Negative and positive feelings, complete questions and short return questions, names and other personal information, and repeat-plus-slow requests are evaluated separately. Busy, working, bored or married do not fulfill a name introduction. Free feelings include sick, bad, not happy and very well. |
| Alternatives and spelling | Common appropriate greeting, farewell, thanks, repeat and slow requests are accepted. Apostrophe variants normalize before Unicode normalization. Each audited English word may have one harmless letter error; dictionary words with another meaning, short grammar words and role names remain protected. This is conservative spelling tolerance, not unrestricted fuzzy matching. |
| Back and defer | Optional speech in lessons 1–6 can be left without erasing completed written answers. Required speech in lesson 7 stays required. General skip links are removed from ordinary untouched written questions; a hint or technical problem can expose “Sonra qayıt”. Missing required answers are clearly listed and retried without replaying completed answers. |
| Hints | A small bulb within relevant question cards gives a goal-specific approach. It does not read the answer key or reveal a complete accepted response. |
| Listening failure | Native error, missing callback and manually reported silent audio unlock an explicitly labeled text prompt. Lesson and exam results store this as technical text, outside independent/assisted listening. A late callback cannot unlock a later question. |
| Exam evidence | Correct written answers cannot certify a required spoken response or technically unavailable listening task. The result explains what remains unchecked and awards no full-pass XP until the required evidence exists. |
| Native audio | Empty, invalid and released sources are guarded before `AudioPlayer.replace`. Native receives an object with a valid URI, never `null`. Source loading and playback failures have recoverable UI. |
| Voice review | The learner reviews and explicitly sends recognized text. Edits are labeled as writing immediately. A real native recording URI enables replay when the recognition service supports recording. Expo Go can record/replay practice but cannot certify recognized speech. |
| Dictionary | All highlighted new words have their own entries, alongside the existing phrases: 65 authored cards total. Completed users receive appended vocabulary without changing existing card IDs/order. Canonical duplicate detection, hydration and queued writes prevent loss/duplication. Completion awaits vocabulary saving; failures are visible and retryable. |
| Dictionary tests | English aliases and Azerbaijani translation alternatives are used in the correct test direction. Incomplete templates and ambiguous grammar-only entries remain visible in the dictionary but are not used as misleading translation quizzes. |
| New-word color | Only new individual English tokens on introductory/teaching boards, teaching text and examples use the app accent. Earlier taught words, names, translations and assessment choices retain normal color. The preference is also recorded in `AGENTS.md`. |
| Artwork loading | Shared boards/scenes use `expo-image` memory/disk caching. The common board and upcoming scenes are prefetched. Images stay mounted through feedback; measurement no longer delays the image mount. A failed image can be retried without blocking the task. Bundled files remain under 120 KiB each. |

Earlier fixes for distinct review purposes, all 95 audio meanings, actual slow
follow-up speech, assisted versus independent evidence, reward deduplication and
required-answer completion are preserved and rechecked.

## Validation

The following checks pass with the existing production dependency installation:

```sh
npx tsc --noEmit
npx expo lint
node scripts/check-b1-packet.cjs
node scripts/check-lesson-regressions.cjs
node scripts/check-lesson-screens.cjs
node scripts/check-lesson-voice.cjs
node scripts/check-lesson-speech-native.cjs
node scripts/check-recorded-audio.cjs
node scripts/check-progression.cjs
node scripts/check-vocabulary-persistence.cjs
node scripts/check-lesson-assets.cjs
npx expo export --platform all --max-workers 2
```

- TypeScript: no errors. ESLint: no errors, one pre-existing unused
  `handleLogout` warning in the profile screen.
- 212 authored original/review/exam rules and 79 targeted answer regressions pass.
- All 95 authored listening/reply meanings resolve.
- Persistence checks cover reloading, existing-user vocabulary upgrades,
  interrupted writes, hydration races, required evidence and duplicate rewards.
- The optional UI suite has 23 passing tests: all seven lesson flows, optional
  voice back, missing-only retry, audio error/timeout/silent fallback, edited
  mandatory speech, incorrect/partial feedback, rapid taps, repeated wrong answers,
  all 17 exam answers with native/technical/edited evidence, image error/retry and
  the original introduction structure, native-independent web image loading and
  individual word coloring on teaching boards.

The UI suite uses Jest 29.7.0, jest-expo 57.0.6 and React Native Testing Library
14.1.0. With these optional test tools installed, run
`npx jest --config jest.lesson.config.cjs --runInBand`.
Production manifests and the lockfile are unchanged by this repair.

## Device verification still required

The checks above exercise component behavior with mocked native services and
compile/export the platform bundles. They are not an iPhone/Android hardware run
or a pixel comparison of native screenshots. Verify the original introduction,
keyboard visibility on Android edge-to-edge, microphone permissions, actual TTS
sound, recognition/replay availability, background interruptions and cold/warm
image loading on the user's phones. Development-mode asset transport and the
phone's network can still affect first-load latency. No measured device-speed
claim or pronunciation score is made.
