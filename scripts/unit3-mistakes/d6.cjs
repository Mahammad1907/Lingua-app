// Bölmə 3 · Dərs 6: “I live at Baku”, “I'm live in”, from ↔ live, “and” əvəzinə “but”, “I'm Ganja”.
const assert = require('node:assert/strict');
const L = require('../../src/utils/designLesson.ts');
module.exports = (rejects, find, rejectsField) => {
  const accepts = (id, value, voice = false) => assert.equal(L.gradeText(find(id), value, voice).status, 'correct', `${id}: “${value}” must be accepted`);
  rejects('u3d6_c05', 'I live at Baku.', true);
  rejects('u3d6_c05', "I'm live in Baku.", true);
  rejects('u3d6_c05', "I'm from Baku.", true);
  rejects('u3d6_c05', 'I living in Baku.', true);
  rejects('u3d6_c09', "I'm from Shaki and I live in Baku.");
  rejects('u3d6_c09', "I'm from Shaki, but I live at Baku.");
  rejects('u3d6_c12', "I'm Ganja, but I live in Baku.", true);
  rejects('u3d6_c12', "I'm from Ganja, but I live at Baku.", true);
  rejects('u3d6_c12', "I from Ganja, but I live in Baku.", true);
  rejectsField('u3d6_c13', 'u3d6_c13a', 'Where do you live?');
  rejectsField('u3d6_c13', 'u3d6_c13b', 'Where are you from?');
  rejectsField('u3d6_c13', 'u3d6_c13b', 'Where are you live?');
  // Review fixes (18 Nov 2026): “here” is a place; “in here” is not accepted.
  accepts('u3d6_c12', "I'm from Ganja, but I live here.", true);
  rejects('u3d6_c12', "I'm from Ganja, but I live in here.", true);
};
