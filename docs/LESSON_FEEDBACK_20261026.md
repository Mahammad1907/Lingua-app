# BirTalk lesson feedback batch 26 October 2026

Implemented on the lesson-screen branch. This change applies the collected lesson-screen feedback; it does not load the separate 13-card paper lesson into the app.

## Behavior

1. Retries show only the concise reason for revisiting and the new task. The previous question, previous answer and old-explanation panel are removed.
2. Free situation responses reuse the existing conversation, name-card, farewell, gratitude and apology art where the prompt already states the situation. Listening, choices and word banks retain neutral visuals so the answer is not revealed. No new image was needed. The first welcome now names the three goals and shows both Hello and Bye, preserves the original objective-card/emoji style, fits the picture without clipping, and uses the available viewport for spacing.
3. Shared lesson art feathers into its actual canvas color using non-interactive gradient edges. Raster assets remain unchanged and sharp; there is no blur or network asset request. Legacy lesson illustration wrappers use the same treatment.
4. Uncertain raw speech never becomes a definite wrong verdict. Edited text cannot prove a speaking task. Wrong feedback offers optional five-part help using the actual submitted response; unverified speech has an explicit continue action and no wrong animation.
5. All confirmed verdicts synchronously lock choice, text, word-bank and speech submissions, including wrong retry answers. An explicit Continue follows. Queued input events cannot erase the verdict. The 650 ms double-tap guard remains.
6. Every confirmed mistake queues its authored retry after the main part. All 56 task retries and every voice turn preserve their original input mode and goal. Listening stays listening; combined speech goals remain combined; the farewell correction remains farewell. A wrong retry records Needs practice and continues without a loop. First-attempt accuracy is preserved. Completing the activity does not imply mastery. Required blank tasks remain incomplete; explicitly unverified responses and skipped voice are distinguished from mistakes. Technical text does not count as listening.
7. Existing equalizer geometry, recording amplitude and timing are unchanged. Colors are now warm orange and lavender, with muted lavender at rest.
8. The success effect keeps the letter-by-letter green transition, one small pulse, and a refined check fade/pulse. It stays within 600 ms and scale 1.05, respects reduced motion, and never advances the lesson itself.

## Later evidence

Completed lesson progress stores which tasks need a later check. A subsequent lesson can insert one model-free authored recheck after its third assessed task, never at the beginning. It is optional for completion, retains the original modality and has a distinct ID and result. A successful independent recheck is recorded separately from the same-lesson assisted correction. No prior result is rewritten into an initial independent success.

## Verification

- TypeScript: passed.
- Lint: no errors; one existing unused handleLogout warning in profile.tsx.
- React Native screen tests: 46 passed, including all seven full lessons with every response wrong in both the main part and retry, no invented successful evidence, uncertainty, skip, technical-text, correction and later independent recheck scenarios.
- Answer regressions: 79 passed; 104 listening/reply meaning mappings.
- Authored rule checks: 212 original/review/exam rules passed.
- Existing primary lesson cards and existing raster assets preserved; only authored retries changed.
- Android, iOS and web JavaScript export: passed.

The repository dependency versions are unchanged by this batch. Automated checks ran against the installed SDK 57 workspace dependencies. The user's separate Windows SDK 58 migration is not overwritten. Shared API documentation for gradients was checked for both SDK 57 and SDK 58. A physical iPhone and SDK 58 device run have not been performed here. Visual spacing, gradients, native speech recognition and microphone behavior still require the user's device check; Expo Go does not include the app's custom speech-recognition module.

## Update the Windows checkout

Stop the running server with Ctrl+C, then run git pull --ff-only on codex/b1-lesson-screens-20261021. This commit does not touch package.json or package-lock.json, so it preserves the user's local SDK migration. Do not restore or discard those package files. No new dependency installation is required by this batch. Restart the existing working Expo connection and reload the project in Expo Go.
