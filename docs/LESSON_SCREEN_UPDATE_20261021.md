# A1 lesson screens: phone feedback corrections, 22 October 2026

Base: `17f3dc50a196cf965b2193bdb8bcc39addc597da`, branch `codex/b1-lesson-screens-20261021`.

## Visible changes

| Area | Result |
| --- | --- |
| Header | One compact, wrapping lesson title beside back/energy; the extra large title row is removed. |
| Content fit | Actual non-artwork content and badge height are measured. Decoration shrinks into the remaining viewport before any text/control is hidden. The footer takes normal layout space and cannot cover content. Long or accessibility-sized content retains a scroll fallback. |
| Teaching | Both example audio controls remain in the measured body; the classroom image yields space so “Hi!” is not placed behind the next action. |
| Listening | One original cyan/lavender particle wave above the question. Playback animates only while audio plays; the player has play/stop and a label, with no second waveform. No watermarked reference bitmap is shipped. |
| Playback speed | Slow/normal/fast choice persists locally across questions and app restarts. |
| Spoken answer | Redundant “İndi sən danış” heading, large record/replay panel and disabled “Yoxla” are removed from the lesson flow. Mic capture/transcript/status appear inline in the same screen, without a modal. |
| Written answer microphone | One tap opens inline capture and starts recognition when the native module is available. Switching to keyboard or leaving cancels pending/active recognition. After capture ends, the learner reviews/edits the transcript and confirms checking. A correction is recorded as text input rather than falsely labeled original recognized speech. |
| Feedback | Feedback belongs below the answer inside the content, rather than inside a growing footer. Selected answers stay in the content. A correct answer produces one “Düzdür!”, a brief mint flash, subtle check scaling and light haptic. Reduced motion disables the motion/haptic. Wrong answers show authored/contextual correction in a warm tone. |
| Entry/result | Previous passive entry objectives and confirmed exit behavior are preserved. No replacement result design is introduced. |

## Speech recognition boundary

The free native path uses `useLessonSpeech` directly rather than mounting `VoicePracticeRecorder`/its native recorder and playback objects. Recognition emits a live transcript and measured volume. After recognized speech, 1.8 seconds of quiet requests a final result. The operating system can also end recognition earlier in non-continuous mode. After a completed final result and native end event, an editable transcript is shown. Only explicit confirmation invokes grading, once; interim text is never graded. The learner can re-record, correct the transcript or cancel without a language penalty. Edited/typed answers are explicitly marked and evaluated as written answers. Empty, low-confidence, cancelled, timed-out or interrupted capture does not record a language attempt. Eight seconds with no transcript cancels instead of sending an empty answer. Maximum capture is 20 seconds.

On-device recognition is used where supported. Apple/Google network recognition is offered only after an explicit permission action. Permission responses arriving after cancellation cannot start hidden recording. Background, confirmed exit, switching input mode and unmount remove/cancel capture. No audio getter/player/recorder is needed by the lesson recognition path. The remaining legacy record/replay component also guards native getters during polling and disposal, addressing the supplied `NotFoundException` cleanup stack.

**Expo Go does not include `expo-speech-recognition`.** JavaScript alone cannot add it. In Expo Go the microphone explains this when tapped; it does not pretend to transcribe or award verified voice credit. Actual automatic transcription requires an installed BirTalk development build containing the already-declared native plugin. `eas.json` includes development-device and simulator profiles. No paid transcription API, external STT backend or secret key was added. When no usable native service is available, the learner can choose a clearly labeled written response, not a fabricated voice result. Android 13+ offers an English offline-model download action when on-device support is missing or a language/service error occurs; system network recognition requires explicit consent and that consent is retained only for retries within the same input session. No signed build was created or installed in this environment.

## Validation and limits

- TypeScript passed.
- ESLint across project source/config/scripts passed with zero errors and one existing unused-handler warning in the unchanged profile screen. Local generated bundler-cache files were excluded from lint.
- Mocked native-boundary tests passed: final/end review without premature grading, empty correction rejection, explicit confirm and rapid-repeat protection, edited answer metadata, on-device default, explicit network consent/retry, missing-service typed fallback, model-download action, cancellation, permission pending/denied, background and unmount listener cleanup.
- Pure speech-turn tests passed: 1.8-second silence, empty input, partial versus final, confidence, timeout, cancellation and late events.
- Released native getter/stop failure regression passed.
- Presentation checks, 214 original/review/exam rules and progression/XP/energy/exit regressions passed.
- iOS and Android Hermes exports passed. Export is compilation, not an installed-device test.

There is no physical iPhone or iOS simulator here. Actual keyboard transitions, native permission dialogs, recognition quality, silence thresholds in a noisy room, haptics and pixel appearance remain for device review. No claim of device-tested perfection is made.

## Existing Windows preview

Stop Expo with Ctrl+C in `C:\Users\user\birtalk-yeni-ekranlar`. Fetch and switch to the published commit, then start with `npx.cmd expo start --go --clear --port 8083` for **visual/typed-answer preview only**.

For the full microphone flow, build and install the BirTalk development client through the owner's Expo and Apple signing accounts using the `development` profile, then use `npx.cmd expo start --dev-client --clear --port 8083`. An iPhone install requires signing/provisioning. The profile and speech-recognition plugin are prepared; account setup, identifiers and signing must be completed in that build step.

Sources: [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/), [EAS profiles](https://docs.expo.dev/build/eas-json/), [speech recognition module](https://github.com/jamsch/expo-speech-recognition), [SDK 57 audio](https://docs.expo.dev/versions/v57.0.0/sdk/audio/).

## Free native recognition: real-device acceptance still pending

- Test on both iPhone and Android with a signed/native development client, not Expo Go.
- Test English recognition with and without an installed offline model, permission denial, an unavailable system service and explicit network consent.
- Speak with the learner's accent and normal background noise; compare the editable transcript with the actual words. This feature checks recognized language content, not pronunciation quality.
- Verify that ending capture only opens review: no XP/energy/task result before confirmation. Confirm once, retry a recognition failure, edit the text, cancel and leave; prior completion receipts must stay intact.
- Android can be built/tested without Apple membership. A free personal iPhone test installation needs Mac/Xcode and a Personal Team; the existing Windows/EAS iPhone internal-distribution path still needs paid Apple signing membership. No such installation has been performed here.

References: [Expo recognition module](https://github.com/jamsch/expo-speech-recognition), [Apple personal-device testing](https://developer.apple.com/help/account/basics/about-your-developer-account), [Android SpeechRecognizer](https://developer.android.com/reference/android/speech/SpeechRecognizer).
