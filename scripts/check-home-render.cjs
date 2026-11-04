// Compatibility entry point for the native approved-home regression suite.
// ONBOARDING_RENDERER_MODULE=/path/to/react-test-renderer node scripts/check-home-render.cjs
if (!process.env.HOME_PROGRESS_RENDERER && process.env.ONBOARDING_RENDERER_MODULE) {
  process.env.HOME_PROGRESS_RENDERER = process.env.ONBOARDING_RENDERER_MODULE;
}
require('./check-home-progress.cjs');
