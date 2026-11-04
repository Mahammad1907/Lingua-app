# Home rendering repair — 4 November 2026

The user's iPhone screenshot showed a corrupted mascot and an empty, very tall island instead of the lesson heading and nodes.

Two decorative SVGs in `ApprovedHome.tsx` used `StyleSheet.absoluteFillObject`, removed from the installed React Native API. Their style became undefined, leaving 100%-height SVGs in normal layout flow before their sibling content. Both now use the supported `StyleSheet.absoluteFill`. The island and dashed path are absolute decorative overlays; the section heading and lesson nodes retain their existing normal positions.

The home header no longer references the corrupted 135×121 `assets/home/approved_mascot.webp`. It reuses the clean transparent 1218×1291 `assets/onboarding/welcome.png` already committed for the approved orange hooded mascot. No regeneration, lesson changes, package changes, voice changes, persistence reset or new asset download is required.

Checks:

- Full `npx tsc --noEmit` now passes; the two previously reported Home API errors are resolved.
- `npx expo lint`: zero errors; pre-existing unused `handleLogout` warning remains.
- `scripts/check-home-render.cjs` with external compatible React renderer: 320/390/430-width render inputs retain absolute SVG positioning, section heading, seven actual lesson nodes, six initially locked lessons, active module action, clean high-resolution PNG and four navigation tabs. Native primitives are mocked: this does not certify phone geometry.
- `node scripts/check-home-reference.cjs`: existing course/progress/unlock checks pass.
- `node scripts/check-onboarding.cjs`: preference checks pass.
- `node scripts/check-b1-packet.cjs`: 210 existing lesson/review/exam rule checks pass.
- Web export passes.

Only Home rendering, this targeted regression script and this report change. The four new onboarding screens, user's local speech/SDK files and lesson logic are untouched. The supplied screenshot is the observed pre-fix phone failure. The repaired build has not been run on a physical iPhone/Android here; user device verification is still required. Existing AI-chat routing behavior is outside this two-bug repair and is not claimed fixed.
