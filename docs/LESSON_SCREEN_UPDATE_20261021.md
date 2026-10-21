# Agreed lesson screens — implementation update

Parent: `52b93acef6df5ddbd05f7033a4d4f06a705c8214` on `codex/b1-lesson-screens-20261021`.

## Screen mapping

| Screen | Implementation |
| --- | --- |
| Lesson entry | Dedicated `LessonWelcome`: full lesson title, lesson badge, warm library/fox/blank-board artwork, native board phrase, three noninteractive objectives, short subtitle, orange “Dərsə başla”. Each of seven authored lessons has its own objectives and phrase. |
| Teaching | Existing authored explanation and bilingual examples remain. Explanation and examples are separated visually, with audio buttons and “Davam et”. No hint action on teaching/entry. |
| Written answer | Scenario, contextual hint, purple input and microphone. Native recognition fills the editable text field before the normal “Yoxla” action. The input microphone opens a dedicated recording panel directly, with measured levels. Expo Go records/replays; the native BirTalk build fills the editable field through speech recognition. |
| Listening | Compact animated playback equalizer (no mascot), player, slow/normal/fast playback, choices, grading feedback and authored glossary meaning after a correct answer. |
| Word building | Word bank, selected-word tray and an instruction hint that does not reveal the answer order. |
| Voice practice | Microphone plus actual measured levels; native recognition/recording retains existing grading. Expo Go uses recording/replay practice without fabricated transcripts, grades or XP. |
| Mistake/review | First-pass incorrect feedback remains visible until “Davam et”. Full explanation is behind “İzahına bax”; previous answer context remains separate from the replacement question. |
| Result | Existing result summary retained. A replacement result design was not approved. |

## Exit and layout

- Header title has its own wrapping row, so long lesson names do not compete with energy width. The lesson energy capsule reads the existing shared store; reward/energy rules are unchanged.
- Custom back and Android hardware back open the same confirmation dialog. iOS swipe-back is disabled on the lesson route so it cannot bypass confirmation in SDK 57.
- Continuing closes the dialog. Confirming exit removes only the unfinished attempt via `abandonLesson`; saved completions, receipts and XP remain. Saving cannot be interrupted through the dialog.
- Decorative artwork disappears for the keyboard and large accessibility text. Answer input and action stay in the keyboard-avoiding layout. Long content retains a scroll fallback.
- Current microphone capture pauses when the exit dialog opens. Native listeners/timers and recorder mode are cleaned up on unmount/background.
- Help before grading reads no answer keys or full explanations. Full explanations are available after grading or in the previous-answer review section.

## Voice limitations

Expo Go does not ship `expo-speech-recognition`. A JavaScript update cannot add that native module to Expo Go. The update therefore provides working recording/replay practice through the bundled `expo-audio` API, and a direct recording panel from the written-input microphone. Recording does not transcribe in Expo Go. After recording, “Dinlədim · Davam et” advances through the existing unverified/skip path. Unverified audio is never awarded completion credit. Automatic speech-to-text and native voice assessment require a signed BirTalk development build, existing native permissions and a supported recognition service/language model. No external AI/STT service or API key was added.

## Validation

- Full TypeScript check passed.
- Full project ESLint passed with zero errors and one existing unused-handler warning in the unchanged profile screen. Earlier lint errors in onboarding/entry and XP/completion state were corrected without changing their UI.
- 214 authored/review/exam answer rules passed.
- Progression/XP/energy regression checks passed, including new confirmed-exit, preserved saved progress, rejected abandoned-attempt finish and clean restart cases.
- Presentation checks passed for all seven intros, all task types, answer-key-free hints, preserved teaching paragraphs, glossary translations, accessibility conditions and measured-volume bounds.
- iOS Hermes export passed.

No native iPhone execution or rendered browser screenshots were available in this environment. The source was inspected against the supplied entry and written-screen references; pixel-level parity and device keyboard/audio behavior remain for phone review. No claim of device-tested perfection is made.

Daily lesson limits, reward ads, payment/premium and free-form AI conversation remain separate product work; they were discussed but are not implemented by this UI update.

## Update the existing Windows preview

In `C:\Users\user\birtalk-yeni-ekranlar`, stop the old Expo process with Ctrl+C and run each command separately:

```powershell
git fetch origin
git switch --detach origin/codex/b1-lesson-screens-20261021
npx.cmd expo start --go --clear --port 8083
```

The existing node_modules junction is reused. No reset or clean is required.

## Phone feedback correction (22 October)

- Fixed the reported native AudioSource render exception: both recording players now pause on an empty/cleared draft and only call `replace` with a real `{ uri }` source. A shared guarded loader catches native source failures; the recorder no longer calls `replace(null)` on mount.
- Written-input microphone opens a modal and starts capture directly, dismissing the keyboard. Actual recorder/recognizer measurements drive the waveform. Close cancels pending native-recognition permission work as well as active capture, so a permission response cannot start hidden capture after closing.
- Expo Go capture remains record/replay practice, with an explicit explanation that it does not transcribe or earn verified-answer credit. A native development build is still required for automatic speech-to-text; no new remote service, credentials or package was added.
- Keyboard mode removes decorative artwork, the extra title/badge and large playback controls. A compact header and inline replay remain, the skip action leaves the footer while typing, and scrolling follows the final viewport/content layout to reveal the editable answer above the footer. Long/accessibility content keeps a scroll fallback.
- Listening task artwork is now an equalizer. Its decorative animation runs only while speech playback runs and respects reduced motion. It does not claim to measure TTS amplitudes.
- Entry title wraps, the image uses contain geometry to retain the full fox, the negative artwork margin is removed, and artwork height uses the measured remaining viewport after the heading and passive objectives.

Validation: TypeScript and full ESLint passed (one existing profile unused-handler warning); recorded-audio regression, seven-lesson presentation, 214 content rules, progression/XP/energy checks and iOS Hermes export passed. There is no iPhone runtime in this environment: microphone permission prompts, actual recording/recognition, keyboard transitions and pixel appearance still require device verification. Exporting a bundle is not a device test.
