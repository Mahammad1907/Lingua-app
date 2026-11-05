// The current course uses the 7-group / 12-lesson regression suite.
if (!process.env.V2_RENDERER) process.env.V2_RENDERER = process.env.ONBOARDING_RENDERER_MODULE || process.env.HOME_PROGRESS_RENDERER;
require('./check-v2-home-render.cjs');
