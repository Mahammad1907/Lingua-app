# Home map progress

Based on `803a6d4` on `codex/b1-lesson-screens-20261021`.

The English A1 approved home now overlays the existing artwork with a native SVG route and a restrained purple island tint. Completing another lesson animates both over 600 ms. Six separate curves stop at tile edges and fill through the last consecutively completed lesson: 3/7 means two filled links, 7/7 means all six. No connector is filled through an incomplete lesson, including out-of-order saved completions. The island uses the real module percentage, fading toward its edges to preserve the existing relief and contrast.

Initial saved progress renders settled. Resets settle to the lower state. Reduced motion skips transitions; animations stop on cleanup. The overlay ignores touches and does not write completion, XP, assessment or unlock state. The existing native percentage badge now exposes progressbar accessibility metadata. Other language/level selections retain the existing dashboard fallback.

The source artwork remains unchanged, including its baked-in lesson icon colors and active-lesson caption. This patch does not turn those raster elements into dynamic status controls or change AI-chat routing.

Validation:

- `npx tsc --noEmit`: passes.
- `npx expo lint`: no errors; pre-existing unused `handleLogout` warning in profile.tsx.
- `HOME_PROGRESS_RENDERER=/path/to/compatible/react-test-renderer node scripts/check-home-progress.cjs`: passes with external React 19.2.3 renderer, no app dependency edits. Checks 0–7 completions at widths 320/390/430, filled link endpoints, tint bounds, reduced motion, resets, duplicate/unrelated IDs, out-of-order progress, seven native lesson targets and existing navigation.
- `node scripts/check-home-reference.cjs` and `node scripts/check-chapter-journey.cjs`: pass.
- Static SVG/artwork composites at 0/43/100% visually inspected. This is not a live native animation test.

Physical iPhone/Android rendering and transition smoothness remain unverified. Package and lock files are unchanged.
