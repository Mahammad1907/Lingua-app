# A1 lesson screens: phone feedback corrections, 22 October 2026

Base: `ea5efcb7fc56cecb3f6f32bdd84aa349ff5f73eb`, branch `codex/b1-lesson-screens-20261021`.

## Visible changes

| Area | Result |
| --- | --- |
| Header | One compact, wrapping lesson title beside back/energy; the extra large title row is removed. |
| Content fit | Actual non-artwork content and badge height are measured. Decoration shrinks into the remaining viewport before any text/control is hidden. The footer takes normal layout space and cannot cover content. Long or accessibility-sized content retains a scroll fallback. |
| Teaching | Both example audio controls remain in the measured body; the classroom image yields space so “Hi!” is not placed behind the next action. |
| Listening | One original cyan/lavender particle wave above the question. Playback animates only while audio plays; the player has play/stop and a label, with no second waveform. No watermarked reference bitmap is shipped. |
| Playback speed | Slow/normal/fast choice persists locally across questions and app restarts. |
| Spoken answer | Redundant “İndi sən danış” heading, large record/replay panel and disabled “Yoxla” are removed from the lesson flow. Mic capture/transcript/status appear inline in the same screen, without a modal. |
| Written answer microphone | One tap opens inline capture and starts recognition when the native module is available. Switching to keyboard or leaving cancels pending/active recognition. The final recognized text uses the normal lesson answer rules automatically. |
| Feedback | Feedback belongs below the answer inside the content, rather than inside a growing footer. Selected answers stay in the content. A correct answer produces one “Düzdür!”, a brief mint flash, subtle check scaling and light haptic. Reduced motion disables the motion/haptic. Wrong answers show authored/contextual correction in a warm tone. |
| Entry/result | Previous passive entry objectives and confirmed exit behavior are preserved. No replacement result design is introduced. |

## Speech recognition boundary

The lessons now use `useLessonSpeech` directly rather than mounting `VoicePracticeRecorder`/its native recorder and playback objects. Recognition emits a live transcript and measured volume. After recognized speech, 1.8 seconds of quiet requests a final result. The operating system can also end recognition earlier in non-continuous mode. A completed final result is submitted once, after the native end event; interim text is never graded. Empty, low-confidence, cancelled, timed-out or interrupted capture does not record a language attempt. Eight seconds with no transcript cancels instead of sending an empty answer. Maximum capture is 20 seconds.

On-device recognition is used where supported. Apple/Google network recognition is offered only after an explicit permission action. Permission responses arriving after cancellation cannot start hidden recording. Background, confirmed exit, switching input mode and unmount remove/cancel capture. No audio getter/player/recorder is needed by the lesson recognition path. The remaining legacy record/replay component also guards native getters during polling and disposal, addressing the supplied `NotFoundException` cleanup stack.

**Expo Go does not include `expo-speech-recognition`.** JavaScript alone cannot add it. In Expo Go the microphone explains this when tapped; it does not pretend to transcribe or award verified voice credit. Actual automatic transcription requires an installed BirTalk development build containing the already-declared native plugin. `eas.json` includes development-device and simulator profiles. No external STT backend or secret key was added. No signed build was created or installed in this environment.

## Validation and limits

- TypeScript passed.
- ESLint across project source/config/scripts passed with zero errors and one existing unused-handler warning in the unchanged profile screen. Local generated bundler-cache files were excluded from lint.
- Mocked native-boundary tests passed: final/end automatic submission, duplicates, cancellation, permission pending/denied, background and unmount listener cleanup.
- Pure speech-turn tests passed: 1.8-second silence, empty input, partial versus final, confidence, timeout, cancellation and late events.
- Released native getter/stop failure regression passed.
- Presentation checks, 214 original/review/exam rules and progression/XP/energy/exit regressions passed.
- iOS Hermes export passed. Export is compilation, not an installed-device test.

There is no physical iPhone or iOS simulator here. Actual keyboard transitions, native permission dialogs, recognition quality, silence thresholds in a noisy room, haptics and pixel appearance remain for device review. No claim of device-tested perfection is made.

## Existing Windows preview

Stop Expo with Ctrl+C in `C:\Users\user\birtalk-yeni-ekranlar`. Fetch and switch to the published commit, then start with `npx.cmd expo start --go --clear --port 8083` for **visual/typed-answer preview only**.

For the full microphone flow, build and install the BirTalk development client through the owner's Expo and Apple signing accounts using the `development` profile, then use `npx.cmd expo start --dev-client --clear --port 8083`. An iPhone install requires signing/provisioning. The profile and speech-recognition plugin are prepared; account setup, identifiers and signing must be completed in that build step.

Sources: [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/), [EAS profiles](https://docs.expo.dev/build/eas-json/), [speech recognition module](https://github.com/jamsch/expo-speech-recognition), [SDK 57 audio](https://docs.expo.dev/versions/v57.0.0/sdk/audio/).
