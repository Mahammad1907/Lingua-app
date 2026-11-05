# V2 support status — 7 groups / 12 lessons

## Implemented

The author ZIP remains immutable. `import-b1-v2.py` and `compile-v2-extras.py` compile learner text, hidden acceptance rules, audio text, feedback banks and supplements into typed data. The archive SHA is recorded in the group manifest/readiness record. No old lesson is merely renamed as a new lesson. The main course has exactly twelve versioned IDs in seven groups (1/1/2/2/3/2/1).

- Seven native map cards retain the existing lavender/orange home, mascot and island dimensions. Counts and the twelve-lesson percentage derive from real completions. Taps open a bottom panel; each row launches its own lesson and offers Start/Continue/Replay. Order checks apply at the session boundary. Draft cursor, responses, initial answer, sticky help/transcript evidence and adapted flow IDs persist. Opening/finishing a lesson does not start the next lesson. Old XP, dictionary and completion records are preserved without granting new v2 completions.
- Teaching words/phrases use longest authored-phrase matching and an opt-in meaning/example/English-TTS panel. Ellipsis templates and contraction/slash aliases work. New teaching entries are saved once; known items stay tappable without fresh coloring. Assessment choices do not receive correctness coloring before grading. Meaning/transcript support is sticky across hiding and reload; audio replay cannot erase that help. Azerbaijani translations are not sent to TTS.
- Native speech uses explicit record/review/replay/send for v2. The recording-only fallback also has an explicit send action and cannot report an assessed speech result by itself. Silence/no verified microphone level, cancellation/backgrounding, unknown recognition and skip do not earn a fabricated speech result. Existing recognition/recording infrastructure is reused; service and device availability are not assumed.
- Main voice stages have authored reply audio and gates for correct/partial/unknown/skipped answers. D12 repeat/speed partial criteria remain separate; the requested slow audio is actually sent at the slower rate. Spoken success never auto-advances a question. Successful criteria can be retained while the failed goal is retried in its authored new situation.
- D01-K10 retains the correct input field, disables editing of that retained field and retries the incorrect field in the author's video-call situation. The initial submitted text stays in the stored task. Only one retry is offered; continued difficulty remains Needs practice.
- Feedback banks are compiled separately from learner text. A matching factual error can show the author's reason/rule/new example alongside the actual response. A description that cannot be matched to the actual response receives neutral feedback; an author's hypothetical wrong answer is never attributed to the learner. Changed retry situations do not reuse an original situation's specific reason.
- Spaced review can replace an appropriate authored opening warm-up with a prior failed skill's authored bank task, with the same input/audio modality. It does not append unreviewed questions or change the lesson count. The chosen flow IDs are frozen for resume. Authored long-term warm-ups remain; there is no invented calendar scheduler.

## Separate supplements

`/lesson/supplement` opens the following flows. Their attempts/results use separate storage, never the main completion/XP transaction.

| Entry | Implemented flow |
|---|---|
| Keçid imtahanı | Explicit A/B selection; 14 numbered tasks + two separate follow-up subgoals in each variant; hidden answers until the final result; audio/help/skip/typed-versus-spoken evidence; prerequisite gates for follow-up audio; stored draft/results; new attempt and targeted practice links. |
| Özünü yoxla | Six authored tasks, optional unknown/skip handling, hidden pre-result answers, at most two targeted practice suggestions. The sixth repeat+slow practice uses its own authored two-goal prompt rather than falsely requiring the D12 third goal. |
| Hekayə | Opens after twelve main completions; three authored reading passages and five assessed stages; opt-in English dialogue audio; separate voices when available; one authored new-situation retry per actual error; original and assisted retry results remain separate. |

A/B results show actual goal evidence. **The packet intentionally supplies no automatic gate threshold.** The app does not invent a threshold, award a module pass or unlock future content from these results. That is a separate product-policy choice. Skipped/technical speech is Unverified, not a language weakness. No supplement contributes to the main twelve-lesson percentage or dictionary.

## Verification

- TypeScript and Expo lint pass with no new errors/warnings; the existing profile `handleLogout` warning remains. Profile/package/lock files are unchanged.
- `check-v2-groups.cjs`: 113 main canonical answers plus grouping, version isolation, grammar/name/literal-dictation and compound-input boundaries, persisted cursor/help, separate completion and dictionary deduplication.
- `check-v2-supplements.cjs`: 127 explicit authored alternatives; 43 supplemental canonical answers; 37 voice-stage correct/unknown/unrelated cases; A/B 14+2 structure; support/technical/skip/spoken boundaries; follow-up gates; saved-state validation; retained-field retry; single story retry and authored warm-up replacement.
- `check-v2-home-render.cjs`: mocked native 320/390/430 inputs, all seven group-panel callbacks, lock reason, updated percentage and all three supplemental destinations.
- `check-v2-supplement-render.cjs`: a complete six-question self-check with explicit save/continue, no pre-result answer reveal, manual voice submission, saved result reload, no automatic navigation and the story prerequisite. Audio/native primitives are mocked.
- Expo web export passes.

## What has not been verified

A physical iPhone/Android run, actual microphone/record/replay, recognizer confidence/network behavior, platform voice availability, native keyboard/safe-area geometry and animation smoothness are **not tested here**. These are device QA items, not completed validations. No claim of 100% language-answer coverage, official A1 certification or live ASR validation is made. Test fixtures cover the stated cases, not every possible free answer. The new supplemental screens use the light style; the previously discussed full visual redesign of all legacy lesson screens is not claimed by this content/flow batch.

The work remains on the isolated `codex/v2-groups-12-lessons-20261105` branch / PR #3 for device QA. It is not silently merged into the working home branch.
