// Dərs 2b — “My parents is …”, “My parents in …”, “My grandmother in …”, “grand mother”, “This is son”.
const assert = require('node:assert/strict');
const L = require('../../src/utils/designLesson.ts');
module.exports = (rejects, find) => {
  rejects('u4d2b_c05', 'grand mother');
  rejects('u4d2b_c05', 'mother');
  rejects('u4d2b_c07', 'My grandmother in Ganja.');
  rejects('u4d2b_c07', 'My grandmother are in Ganja.');
  rejects('u4d2b_c11', 'This is my son.', true);
  rejects('u4d2b_c11', 'This is daughter.', true);
  rejects('u4d2b_c12', 'My parents is in Baku.', true);
  rejects('u4d2b_c12', 'My parents in Baku.', true);
  rejects('u4d2b_c12', 'My parents are from Baku.', true);
  // Yeni ekranlar (21 Nov 2026): düz cavab qəbul olunur, tipik səhv qəbul olunmur və izah olunur.
  const ok = (g, id) => assert.equal(g.status, 'correct', `${id}: model answer accepted`);
  const no = (g, id, v) => { assert.equal(g.status, 'wrong', `${id}: “${v}” must not be accepted`); assert.ok(g.explain && g.explain.reason, `${id}: “${v}” explained`); };
  { const t = find('u4d2b_drag'); ok(L.gradeDrag(t, { p1: 'grandfather', p2: 'son' }), 'u4d2b_drag'); no(L.gradeDrag(t, { p1: 'grandmother', p2: 'son' }), 'u4d2b_drag', 'grandmother/son'); no(L.gradeDrag(t, { p1: 'son', p2: 'grandfather' }), 'u4d2b_drag', 'son/grandfather'); }
};
