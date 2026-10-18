# BirTalk — Bölmələr ana ekranı

Base: `557b668a51585eca73cf2adac3f9016be3598e26` (master before the broad 2D redesign).

Scope: the home route, its home-only footer override, isolated home components, progress projection, prepared 3D artwork, and preview/check files. Lesson, conversation, result, dictionary, shared theme, package files, and user progress storage are unchanged.

## Preview

Open `previews/home-reference.html` after fetching this branch. It is a static browser rendering of the actual `HomeDashboard` and `HomeNavigation` components, with the prepared assets resolved for offline viewing. Preview buttons explain that navigation is available in the app.

`previews/home-layout.webp` is a separately rendered static layout proof, **not an iPhone screenshot**. `HomePreview.fixture.tsx` contains the reference-only sample progress. None of its completion values or sample lessons are used by the actual home route.

The 3D artwork was recreated from the supplied visual reference. It is not the original source artwork; exact pixel identity with the reference cannot be claimed.

## Live data

- Modules, lesson totals, completed lesson IDs, and placement results come from the existing stores/data.
- Completion counts unique lesson IDs; answer scores are not used as completion percentages.
- A placement pass can unlock the next available module, but never marks lessons completed.
- No exam result is shown as an invented 0%/100% result.
- The existing hearts value is projected to an energy bar (`hearts / 5`). This change does not introduce or change an energy economy.
- English A1 includes display-only upcoming cards for the reference topics. They cannot be opened, do not affect totals, and do not create fake lessons. Actual registered module titles take precedence.
- Other language/level combinations show their registered content, or an honest empty state.
- Language/level preferences have a separate storage key; existing user data is not rewritten.
- The reference-matched footer is on the home screen only. Review opens the existing wrong-words list. Dictionary/profile navigation retains the existing screens and their original footer.

## Validation

- Full TypeScript check passed.
- ESLint on changed TypeScript/TSX files and new scripts passed.
- Targeted progress checks passed (filtering, deduplication, missing content, exam vs completion, locks, empty courses, bounded percentages).
- Expo web export passed for the application and preview fixture.
- Full-repository lint still reports the two pre-existing declaration-order errors in `src/app/index.tsx` and `src/app/onboarding/welcome.tsx`; these unrelated screens were not edited.
- Native iPhone rendering, safe-area behavior, image loading and navigation still require a device check. No physical-device or release performance claim is made.

No new dependency was installed. No merge into master was performed.
