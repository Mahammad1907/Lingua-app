// Dərs 2a — “This is mother” (my missing), “This are my mother”, “This is sister”.
const assert = require('node:assert/strict');
const L = require('../../src/utils/designLesson.ts');
module.exports = (rejects, find) => {
  rejects('u4d2a_c05', 'This is mother.');
  rejects('u4d2a_c05', 'This are my mother.');
  rejects('u4d2a_c07', 'This is father.', true);
  rejects('u4d2a_c07', 'This is my brother.', true);
  rejects('u4d2a_c12', 'This is sister.', true);
  rejects('u4d2a_c12', 'This is my mother.', true);
  rejects('u4d2a_c12', "She's sister.", true);
  // Yeni ekranlar (21 Nov 2026): düz cavab qəbul olunur, tipik səhv qəbul olunmur və izah olunur.
  const ok = (g, id) => assert.equal(g.status, 'correct', `${id}: model answer accepted`);
  const no = (g, id, v) => { assert.equal(g.status, 'wrong', `${id}: “${v}” must not be accepted`); assert.ok(g.explain && g.explain.reason, `${id}: “${v}” explained`); };
};
