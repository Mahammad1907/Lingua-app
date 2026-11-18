// Dərs 3a — millət: ölkə adı ilə qarışdırmaq, “from” + millət, “Azeri” (qayda 20).
const assert = require('node:assert/strict');
const L = require('../../src/utils/designLesson.ts');
module.exports = (rejects, find) => {
  const accepts = (id, value, voice = false) => assert.equal(L.gradeText(find(id), value, voice).status, 'correct', `${id}: “${value}” must be accepted`);
  rejects('u3d3a_c09', "I'm Azerbaijan.");
  rejects('u3d3a_c09', "I'm from Azerbaijan.");
  rejects('u3d3a_c09', "I'm Azeri.");
  rejects('u3d3a_c09', "I'm Azerbaijan.", true);
  rejects('u3d3a_c10', "I'm from Azerbaijani.");
  rejects('u3d3a_c10', "I'm Azerbaijan.");
  rejects('u3d3a_c11', 'Georgia');
  rejects('u3d3a_c11', 'Gorgian');
  // Review fixes (18 Nov 2026): the full sentence is accepted when only the nationality is asked.
  accepts('u3d3a_c11', "I'm Georgian.");
  accepts('u3d3a_c09', "I'm Azerbaijani. And you?", true);
};
