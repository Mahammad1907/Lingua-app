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

## Pending lesson feedback request (24 October 2026)

- The user is collecting the next batch of lesson issues. Keep this request pending while collecting the remaining reports, before changing application code for this batch.
- Every incorrect answer must show a distinct wrong-answer animation and put that question into the end-of-lesson retry queue. Apply this consistently to all question types: choice, written response, sentence building, listening and assessed speech. Keep the explicit continue action and the existing distinction between a language mistake and technical/recognition uncertainty.

## Animation-only implementation scope (24 October 2026)

- The user has now authorized changing the existing lesson animations while preserving the existing screens. The 13-card content revision remains a separate paper design; do not silently replace the current lesson content with it.
- Preserve all existing layout, dimensions, typography, static colors, artwork, boards, buttons, icons and copy. Animate only the existing text and feedback elements; their settled appearance must match the original. Keep the current speech waveform and recording controls unchanged.
- Use the same reusable feedback effects across lessons. Limit each effect to 300–600 ms, scale to 1.05 and horizontal text movement to ±3 px. Do not move the entire screen/card, add a character animation or introduce red feedback.
- Respect reduced motion. Typing and recognition uncertainty must not trigger a correctness effect. Animation completion must never submit an answer, advance a card or alter assessment evidence.

## Authorized lesson feedback batch 26 October 2026

- Implement the collected eight fixes while keeping the original screen style. The user now authorizes contextual existing illustrations, feathered edges on lesson art, corrected introduction goals and spacing, orange/purple waveform colors, and a refined success effect.
- A confirmed verdict locks every response type, including a wrong retry. Show feedback, then explicit Continue. Unknown/technical responses can retry or continue as Unverified. Never loop a wrong retry.
- All confirmed mistakes queue a modality- and purpose-preserving retry after the main lesson. Keep skip, technical uncertainty, and accepted typos out of that queue. Remove the previous-question/answer/explanation block from retries.
- Preserve original first-attempt evidence. Same-lesson correction is Assisted; unresolved retry is Needs practice. Later unprompted rechecks are recorded separately.
- Do not replace the existing lesson flow with the separate 13-card paper lesson or edit the SDK/package files in this batch; the user upgraded their Windows installation separately.

## Pending follow-up feedback 26 October 2026

The user is still collecting this next batch. Record these requirements now; do not implement lesson/application changes until the user finishes reporting and authorizes the batch.

- Avoid consecutive farewell tasks that repeat the same learning purpose. Keep different recognition/production purposes when justified and improve their placement rather than deleting a skill.
- Confirmed wrong answers should receive a brief, soft red border animation on the wrong answer field/choice and feedback panel. This newer explicit preference supersedes the previous no-red rule for wrong-answer borders only. Keep reduced motion, no screen shake, and no error effect for technical or unverified answers.
- Use exactly two recurring human example characters across lesson situations: the orange-clothed boy/man is Əli in Azerbaijani prose and Ali in English; the purple-clothed girl/woman is Leyla in both languages. Keep names and visual identities consistent in prompts, dialogue, audio scripts, options, explanations and authored retries; do not introduce extra named human example characters without a user request.
- BirFox remains the mascot, teacher and conversation guide. Do not call a pictured human BirFox. In human situation tasks, name the pictured people instead. For the supplied farewell example: “Əli Leylagildən gedir, amma ‘Hi!’ deyir. Onun yerinə uyğun sağollaşma yaz.”
- The two-character rule governs authored examples and fixed roles, not the learner's identity: free self-introduction still accepts the learner's own/chosen name. Fixed-role answers must preserve the stated role name. Proper names are not new vocabulary and must not be added to the dictionary or highlighted as new words.

## Pending spaced review requirement 26 October 2026

This is item 4 of the follow-up batch currently being collected. Record now, implement together with the rest only after the user finishes reporting.

- Same-lesson end review contains confirmed mistakes only, with a new situation preserving the original communication goal and input modality. A successful correction is Assisted; continued difficulty is Needs practice. Do not loop indefinitely.
- In a suitable middle point of a subsequent lesson, revisit a previously difficult skill without a model. Start by considering the next one or two lessons, but adapt to task relevance, elapsed time and the learner's results. This is a BirTalk methodological starting point, not a CEFR-prescribed interval or fixed quota.
- Later lessons and sections also reuse older skills, including successfully learnt ones, in new communicative situations. Do not limit recall to the immediately preceding lesson, put the old questions at the beginning, or repeat the same question consecutively without a distinct learning purpose.
- Integrate old skills naturally with newly taught material, e.g. greeting plus self-introduction after self-introduction has been taught. Never require an untaught expression to complete a review.
- Keep initial independent evidence, same-lesson assisted correction and later model-free independent evidence distinct. A later independent success is recorded as such and does not rewrite the initial attempt. If difficulty remains, shorten the next suitable review interval.
- Skipped, technical and unassessable responses remain Unverified, not language mistakes; accepted meaning-preserving spelling variations do not enter the mistake bank.



## Follow-up implementation authorized 26 October 2026

The user finished reporting and authorized implementation of follow-up items 1–7. The pending follow-up and spaced-review sections above now describe active requirements. Keep the two human identities, context-matched copy, short concrete feedback, reduced-motion-safe red wrong-answer borders, and number-free animated lesson progress across future lessons. The progress bar indicates lesson activity progress and must not change hearts/energy, award XP, submit answers, or auto-advance. Technical/unassessable answers never receive a wrong-answer effect.

Durable user notebook: docs/LAYIHE_DEFTERI.md. Update it when future user decisions change these rules. Preserve the local Windows SDK migration; this content/UI batch does not change package files.
