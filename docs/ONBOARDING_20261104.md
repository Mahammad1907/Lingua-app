# Approved four-screen onboarding — 4 November 2026

Base: `b1ba5c1` on `codex/b1-lesson-screens-20261021`.

## Scope and reference

Use only the user's final second set: `9FC73E31-E099-4829-8EDA-41D281295090(1).jpeg` (welcome), `846CFB61-286C-49B0-9D92-BACD694C0BA6(1).jpeg` (goal), `E2FB27A8-BC56-4CFF-999D-8E346614372D(1).jpeg` (level), `FCBEB9CD-7C2C-4121-9F37-B1280D822F21(1).jpeg` (plan). This supersedes the earlier dark onboarding direction and the first four mockups.

White/lavender gradients and waves are rendered in code. The orange hooded mascot is a separate transparent asset, large on welcome and flexible/small on selection screens. All headings, descriptions, radio selections, minutes and primary buttons are native React Native elements. No screenshot backgrounds, phone frames, fake clock or fake battery are rendered. The actual OS status bar remains system-owned.

Routes: `/` (welcome) → `/onboarding/goal` → `/onboarding/level` → `/onboarding/welcome` (plan). The existing placement route remains untouched, including its scoring and return to `/onboarding/welcome`. The root route retains the completed-user redirect. No other app screen, lesson content, assessment, voice code or SDK/package files are changed.

## State and honest capability

- Preferences are stored under `@birtalk_onboarding_v1` on explicit Continue, restored on focus, with validated defaults and migration from `user_level`.
- Manual levels are clearly labelled as a choice, not test evidence. The existing test option still invokes the existing placement test. Requesting a fresh test clears its old score rather than displaying a stale result.
- Goal is a saved preference only. The summary explicitly states that a separate goal-specific curriculum does not exist. No plan generation or remote personalization is claimed.
- The first topic is read from actual modules and lessons matching language/level and current unlock/completion state. A1 English currently has available content; unavailable levels say so and offer Home instead of inventing a lesson.
- Ten minutes is an editable recommendation, with 5/10/15/20-minute options. This setting does not alter lesson duration, award progress or claim scheduling/reminders.
- Continue waits for persistence, disables duplicate submission, shows retryable errors and does not complete onboarding after a failed write.
- Existing lesson progress and the assessment store are not overwritten. The existing home language/level selection key is updated only at onboarding completion, so it reflects the selected starting preference.

## Layout and verification boundary

One shared safe-area frame places all four progress dots in the same header position. Main pages do not use ScrollView. Artwork occupies remaining flexible space and yields before text; short viewports use smaller gaps and concise readable descriptions (full descriptions remain in accessibility labels). Very small/large-text selection views paginate the same choices, and the plan has two compact internal panels when needed. These are not additional onboarding routes. Body text is not globally transformed/scaled down or ellipsized. The large-text and short-screen strategy still needs physical-device verification.

Automated checks run here:

- `node scripts/check-onboarding.cjs`: passes 100 preference round trips, invalid data recovery, legacy mapping, manual/test summary honesty and actual course availability.
- `scripts/check-onboarding-flow.cjs` with an external, compatible `react-test-renderer`: React state/navigation tests pass for all four screens, preference restoration, changing minutes, unavailable content, storage failure/retry, placement handoff and small-screen choice pagination. Native primitives, router/storage and insets are mocked; these are behavior tests, not native visual layout tests. No renderer/test dependencies were added to the app package files.
- `node scripts/check-b1-packet.cjs`: 210 existing content/review/exam rule checks pass.
- `node scripts/check-lesson-screens.cjs`: existing lesson presentation/content checks pass.
- `npx expo lint`: no errors; one pre-existing unused `handleLogout` warning in `src/app/(tabs)/profile.tsx`.
- `npx tsc --noEmit`: blocked by two pre-existing `StyleSheet.absoluteFillObject` errors in `src/components/home/ApprovedHome.tsx` (lines 52, 60). The identical errors reproduce on a separate clean worktree at base commit `b1ba5c1`. No onboarding type errors remain. Unrelated Home was not changed.
- `npx expo export --platform web`: passes (repeat after final changes before push).

**Not verified:** browser visual rendering (Chromium fails to launch in this execution environment), physical iPhone, Android, actual safe-area rendering, large system text, touch/OS back interactions or the user's Windows/SDK58 environment. Neither JS behavior tests nor web export certify phone appearance. Do not describe this as device-approved or pixel-perfect.
