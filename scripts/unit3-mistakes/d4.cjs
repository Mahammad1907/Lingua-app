// Dərs 4 — “Do you from…?”, “You are from…?”, “No, I not.”, “yes” where the answer is no.
const assert = require('node:assert/strict');
const L = require('../../src/utils/designLesson.ts');
module.exports = (rejects, find) => {
  const accepts = (id, value, voice = false) => assert.equal(L.gradeText(find(id), value, voice).status, 'correct', `${id}: “${value}” must be accepted`);
  rejects('u3d4_c07', 'No, I not.');
  rejects('u3d4_c07', 'No, I not.', true);
  rejects('u3d4_c07', 'Yes, I am.', true);
  rejects('u3d4_c11', 'Do you from Turkey?');
  rejects('u3d4_c11', 'Are you Turkish?');
  rejects('u3d4_c12', 'Do you from Georgia?', true);
  rejects('u3d4_c12', 'You are from Georgia?', true);
  rejects('u3d4_c12', 'Where are you from?', true);
  rejects('u3d4_c10', 'Me too.');
  // Review fixes (18 Nov 2026): “Me too” makes no sense after the partner's “I'm from Baku too!”.
  rejects('u3d4_c10', 'Really? Me too!');
};
