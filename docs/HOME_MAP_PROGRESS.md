# Sharp native home and map progress

Targets `codex/b1-lesson-screens-20261021` through PR #2 / `codex/home-map-progress-20261104`.

## Problem and implementation

The approved home was a 520×1000 screenshot stretched across the page, plus a 520×92 footer image. Its text and icons were baked into those images, causing visible blur on a high-density phone. Transparent touch hotspots could not improve that image quality.

`ApprovedHome` now reconstructs the same lavender/orange home composition using native text, native Pressables, gradient tile surfaces, and scalable SVG symbols in `HomeSymbol`. The separate original 1218×1291 transparent `assets/onboarding/welcome.png` is reused for the orange hooded mascot. The full-page and footer screenshots are no longer imported; existing assets are retained for history. No new bitmap assets or dependencies were added.

Preserved: BirTalk wordmark, greeting, streak/XP locations, Analiz and AI söhbət actions, section heading/count, seven tiles in the same arrangement and icon subjects, listening caption, next-section preview and four bottom destinations. Typography/shadows are rendered at native density. The decorative phone frame from the screenshot is not application chrome.

The existing module callbacks and disabled conditions are unchanged: tiles still open the module; Analiz still opens profile; AI söhbət retains its existing module routing. This patch does not implement a separate AI conversation destination or change lesson access. Other language/level selections retain the existing dashboard fallback.

The map island is now a vector gradient surface with its completion tint behind the native labels/icons. Completing another lesson animates the route and island color over 600 ms. At 3/7, two links are filled; at 7/7, all six. Route fill stops at the first incomplete lesson, even with out-of-order saved completions. Tint uses real module completion. Initial saved progress renders settled, resets settle lower, reduced motion skips transitions, cleanup stops animation. The layer ignores touches and never writes progress, XP, assessment or unlock state.

The map heading and listening caption measure their actual native height. The puzzle/speech tiles and their corresponding route segments move together to keep the listening CTA clear, including larger system text. The footer is normal layout outside the scroll view, includes the bottom inset, and uses native labels and vector icons.

## Validation

- `npx tsc --noEmit`: passes.
- `npx expo lint`: no errors; existing unused `handleLogout` warning in profile.tsx.
- `ONBOARDING_RENDERER_MODULE=/path/to/react-test-renderer node scripts/check-home-render.cjs` (or `HOME_PROGRESS_RENDERER=... node scripts/check-home-progress.cjs`): passes with external React 19.2.3 renderer. Checks native text, only one high-resolution mascot raster, vector navigation, 0–7 completions at 320/390/430 widths, measured caption separation, larger-font inputs, tint/fill, reset, reduced motion, duplicate/unrelated IDs, out-of-order completion, locked state, fallback and existing callbacks. Primitives are mocked: this is not native rendering validation.
- Existing `check-home-reference.cjs`, `check-chapter-journey.cjs`, and all 210 `check-b1-packet.cjs` rules pass.
- Expo static web export passes.
- The actual SVG symbols were rendered separately and visually inspected for sharpness and clipping.

A live local browser could not launch in this sandbox (Chromium exited with SIGTRAP). Complete browser/physical iPhone/Android layout and native transition smoothness remain unverified. No zero-bug or physical-device certification is claimed.

Scope: only home presentation, its progress layer/symbols, home regression scripts and these notes. No lesson, voice, grading, persistence, route, onboarding, package or lock-file changes.
