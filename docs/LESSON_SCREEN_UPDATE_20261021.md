# Agreed lesson screens — implementation update

Parent: `52b93acef6df5ddbd05f7033a4d4f06a705c8214` on `codex/b1-lesson-screens-20261021`.

## Screen mapping

| Screen | Implementation |
| --- | --- |
| Lesson entry | Dedicated `LessonWelcome`: full lesson title, lesson badge, warm library/fox/blank-board artwork, native board phrase, three noninteractive objectives, short subtitle, orange “Dərsə başla”. Each of seven authored lessons has its own objectives and phrase. |
| Teaching | Existing authored explanation and bilingual examples remain. Explanation and examples are separated visually, with audio buttons and “Davam et”. No hint action on teaching/entry. |
| Written answer | Scenario, contextual hint, purple input and microphone. Native recognition fills the editable text field before the normal “Yoxla” action. In Expo Go, the mic button focuses the field and explains how to use keyboard dictation. |
| Listening | Compact classroom scene, player, slow/normal/fast playback, choices, grading feedback and authored glossary meaning after a correct answer. |
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

Expo Go does not ship `expo-speech-recognition`. A JavaScript update cannot add that native module to Expo Go. The update therefore provides working recording/replay practice through the bundled `expo-audio` API, plus keyboard dictation for written fields. After recording, “Dinlədim · Davam et” advances through the existing unverified/skip path. Unverified audio is never awarded completion credit. Automatic speech-to-text and native voice assessment require a signed BirTalk development build, existing native permissions and a supported recognition service/language model. No external AI/STT service or API key was added.

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
