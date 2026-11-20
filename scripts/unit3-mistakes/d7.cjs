// Bölmə 3 · Dərs 7 — Dillər: “Are you speak”, “a”-sız little, dil yerinə ölkə, “Yes, I speak.”
const assert = require('node:assert/strict');
const L = require('../../src/utils/designLesson.ts');
module.exports = (rejects, find, rejectsField) => {
  const accepts = (id, value, voice = false) => assert.equal(L.gradeText(find(id), value, voice).status, 'correct', `${id}: “${value}” must be accepted`);
  rejects('u3d7_c05', 'Are you speak Russian?');
  rejects('u3d7_c05', 'Do you speak Russia?');
  rejects('u3d7_c09', 'I speak England.', true);
  rejects('u3d7_c09', 'I speak Azeri.', true);
  rejects('u3d7_c09', 'I speak English little.', true);
  rejects('u3d7_c09', 'Yes, I speak.', true);
  rejects('u3d7_c12', 'Yes, little.');
  rejects('u3d7_c12', "No, I don't.");
  rejects('u3d7_c12', 'Yes, I speak.');
  // Review fixes (18 Nov 2026): a “no” answer can also list the languages.
  accepts('u3d7_c09', "No, I don't. I speak Azerbaijani and English.", true);
  accepts('u3d7_c12', 'Yes, a little English.');
};
