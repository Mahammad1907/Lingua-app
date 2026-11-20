// Bölmə 3 · Dərs 1 — typical mistakes: “from” or “am” missing, “You too” instead of “Me too”.
const assert = require('node:assert/strict');
const L = require('../../src/utils/designLesson.ts');
module.exports = (rejects, find) => {
  const accepts = (id, value, voice = false) => assert.equal(L.gradeText(find(id), value, voice).status, 'correct', `${id}: “${value}” must be accepted`);
  rejects('u3d1_c05', "I'm Ganja.");
  rejects('u3d1_c05', 'I from Ganja.');
  rejects('u3d1_c07', "I'm Azerbaijan.", true);
  rejects('u3d1_c07', 'I from Azerbaijan.', true);
  rejects('u3d1_c07', "I'm from Azerbaijani.");
  rejects('u3d1_c07', "I'm Azeri.");
  rejects('u3d1_c11', 'You too.');
  rejects('u3d1_c12', "What's your name?", true);
  // Review fixes (18 Nov 2026): a short answer is asked; the full sentence alone is not enough.
  rejects('u3d1_c11', "I'm from Baku.");
  accepts('u3d1_c11', "Me too! I'm from Baku.");
};
