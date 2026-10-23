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

## BirTalk lesson artwork reuse

- The user wants the 3D teacher board as the primary lesson visual, with a few relevant static 3D scenes for variety. Do not add video or animation loops for this request.
- Before generating any lesson picture, read `assets/lessons/scene-library.json` and `docs/REUSABLE_3D_SCENES.md`. Reuse matching existing scenes across lessons, languages and levels; do not regenerate the same situation for a new question.
- Use stable scene IDs through `ReusableLessonScene`; keep questions and translations as native text. Topic scenes belong on selected introduction/teaching cards, not as answer cues in assessed questions or exams.

## User-confirmed lesson preferences (23 October 2026)

- Preserve the user's existing lesson screen system and layout. Fixes to grading, recording, navigation or vocabulary do not authorize a screen redesign. Keep the supplied existing introduction as the visual reference.
- In English sentences, highlight only the individual vocabulary words introduced for the first time, using the app's accent color. Previously taught words from earlier lessons/modules of that language keep their normal color. Do not color whole sentences, translations, proper names or answer choices as a correctness hint.
- New-word highlighting must follow the actual taught vocabulary and be consistent across future lessons. Dictionary entries may be phrases, but coloring is applied to the individual new words inside those phrases.
- Relevant questions may have a small lightbulb hint within the question card. A hint explains the approach without revealing a complete accepted answer.
- Assessable answers should show correct, partial or incorrect feedback before an explicit continue action. Speech recognition or technical uncertainty is separate from a typed language error.
- Listening cards use the requested sound effect in place of their 3D scene. Recording waves follow actual microphone input and settle during silence; preserve the agreed speech effect and controls.
