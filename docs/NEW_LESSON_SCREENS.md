# BirTalk — authored seven-lesson screen implementation

Base: `f38bed6c82908bb29c4c7e44d9a7a7736ba650ff` (`codex/b1-packet-content-20261020`). This is the new seven-lesson curriculum, not the old six-lesson written-screen demo.

## Implemented

All `PacketLesson` routes use the same navy/lavender rounded surfaces, fine borders, orange gradient actions and mint feedback. This includes lesson introduction, teaching, answer selection, listening, written answers, word building, voice practice, mistake review and result summary. The existing authored content and assessment handlers remain in place.

The approved local classroom image is reused. Board text stays native and its coordinates follow the image crop. Selected teaching scenes retain the existing scene library. Voice practice uses a microphone and a history of native `volumechange` samples, not a mascot or a timer-generated waveform. The listening waveform is a static sound symbol with a playback state; it does not claim to visualize synthesized audio amplitude or show a fabricated time.

Keyboard events remove decorative artwork; the question, answer input and footer remain in the keyboard-avoiding layout. Short tasks use compact sizing. A ScrollView remains available for long authored prompts and large accessibility text. Correct-answer feedback is above the action rather than underneath it. Help is inside the scenario card only when appropriate; opening it still marks the attempt assisted. Earlier mistake context is explicitly separate from the replacement question.

Listening has 0.75×, 1× and 1.25× relative playback speeds. Glossary translations can be opened after a correct answer; unknown translations are not invented. Existing audio-first gating and skipped-answer rules remain. The skip action reads “Bu sualı keç”.

## Preserved

`b1Packet.json`, `b1Exams.json`, answer checking, lesson IDs/order, required/optional tasks, XP, energy, unlocks, home and map were not edited. No packages installed. No native iOS/Android project generated. Legacy route code and exams were not redesigned. The voice composer appearance is opt-in for the new lesson UI; other consumers retain their appearance.

The tracked `src - Copy` backup is excluded from TypeScript and ESLint; active `src` remains checked. This prevents the obsolete duplicate app from contributing routes/type errors to the new implementation.

## Validation

- Full TypeScript check: passed.
- Changed-file ESLint: passed without warnings.
- `scripts/check-b1-packet.cjs`: 214 original/review/exam rules passed.
- `scripts/check-progression.cjs`: passed.
- `scripts/check-lesson-screens.cjs`: eight content presentation modes, authored translations and keyboard/accessibility conditions passed.
- iOS Hermes export: passed, 1385 modules, 45 assets.
- Full project lint: fails on existing errors in `src/app/index.tsx`, `src/app/onboarding/welcome.tsx`, `src/app/lesson/complete.tsx` and `src/components/EarnedXP.tsx`; these files are unchanged.

Real iPhone appearance, keyboard transitions and native speech capture are not verified here. Expo Go does not include the installed speech recognition native module: voice verification and live microphone levels require a development build. The UI explicitly explains this and permits skipping; it does not fabricate a transcript, pronunciation score or XP.

## Windows: open without overwriting local edits

Run from the existing `C:\Users\user\lingua-app` checkout:

```powershell
git fetch origin
git worktree add --detach ..\birtalk-yeni-ekranlar origin/codex/b1-lesson-screens-20261021
cd ..\birtalk-yeni-ekranlar
cmd /c mklink /J node_modules C:\Users\user\lingua-app\node_modules
npx.cmd expo start --go --clear --port 8083
```

Select Expo Go when opening the QR link. This worktree starts the new seven-lesson app. The old `birtalk-yazili-sinaq` server on port 8082 is a different project. Do not reset or clean the main checkout to install this version.
