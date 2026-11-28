// Bölmə 4 · Dərs 3: “He's name”, “His is name”, “His name Elvin”, his ↔ her (sahibə görə), “She's husband”.
const assert = require('node:assert/strict');
const L = require('../../src/utils/designLesson.ts');
module.exports = (rejects, find) => {
  rejects('u4d3_c05', "He's name is Elvin.");
  rejects('u4d3_c05', 'His is name Elvin.');
  rejects('u4d3_c05', 'His name Elvin.');
  rejects('u4d3_c05', 'Her name is Elvin.');
  rejects('u4d3_c09', 'This is my sister. His name is Nigar.', true);
  rejects('u4d3_c09', "She's name is Nigar.", true);
  rejects('u4d3_c09', 'Her name Nigar.', true);
  rejects('u4d3_c09', 'This is my sister. My name is Nigar.', true);
  rejects('u4d3_c13', 'Yes, she is. This is his husband.');
  rejects('u4d3_c13', "Yes, she is. This is she's husband.");
  rejects('u4d3_c13', "Yes, she's. This is her husband.");
  rejects('u4d3_c13', 'Yes, she is. This is my husband.');
  rejects('u4d3_c13', 'This is her husband.');
  rejects('u4d3_c13', "Yes, she's my brother. This is her husband.");
  // Yeni ekranlar (21 Nov 2026): düz cavab qəbul olunur, tipik səhv qəbul olunmur və izah olunur.
  const ok = (g, id) => assert.equal(g.status, 'correct', `${id}: model answer accepted`);
  const no = (g, id, v) => { assert.equal(g.status, 'wrong', `${id}: “${v}” must not be accepted`); assert.ok(g.explain && g.explain.reason, `${id}: “${v}” explained`); };
  { const t = find('u4d3_drag'); ok(L.gradeDrag(t, { lala: 'wife', elvin: 'brother' }), 'u4d3_drag'); no(L.gradeDrag(t, { lala: 'husband', elvin: 'brother' }), 'u4d3_drag', 'husband/brother'); no(L.gradeDrag(t, { lala: 'brother', elvin: 'wife' }), 'u4d3_drag', 'brother/wife'); }
};
