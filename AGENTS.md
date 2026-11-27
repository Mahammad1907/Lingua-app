This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## BilTalk — read first

**Everything about this project (rules, decisions, code map, open work) is in `docs/BIRTALK.md` (Azerbaijani). Read it before any work.** The old notes are kept for history only: `docs/ARXIV_AGENTS_2026-11-25.md`, `docs/BUTUN_QAYDALAR.md`, `docs/LAYIHE_DEFTERI.md`, `docs/YENI_SOHBET_UCUN.md`.

The most important rules (details in `docs/BIRTALK.md`):

1. Reply in Azerbaijani, short. Say what you will do and wait for “başla”; a question gets only an answer. A bare “Tamam” is not a go.
2. Never claim device testing that did not happen; say what was and was not checked.
3. Do not touch `package.json`, `package-lock.json` or SDK files without permission. Never run `npm run reset-project`.
4. Work only on branch `claude/lesson1-new-screens`.
5. No untaught English word in any task, hint or explanation (`check-taught`). One phrase per card. No placeholder “…” for learners.
6. The situation must fit the screen: face to face → speak, message → write (`docs/MENTIQ_YOXLAMASI.md`).
7. Forward buttons and the progress bar are mascot orange (`d.action`); after an answer the button is green (correct) / red (wrong). The listening icon is ▶ everywhere (`SoundButton`).
8. A shared element changed on one screen changes on every screen (`KindChip`, `Header`, `ChoiceOption`, `Field`, `Capsule`, …). New screen types: mockup first.
9. Lesson screens do not scroll (same on iPhone and Android): pictures shrink first, then the card scales.
10. Run `node scripts/check-all.cjs` after every change, and never commit unless it is fully green. Never weaken `check-taught` or `check-parts` — fix the content instead. GitHub runs it on every push (`.github/workflows/check.yml`).
