// Bölmə 4 · Dərs 6: “How old he is?”, “He has thirty”, “He is thirty years”, fourteen ↔ forty, he ↔ she.
const assert = require('node:assert/strict');
const L = require('../../src/utils/designLesson.ts');
module.exports = (rejects, find, rejectsField) => {
  const accepts = (id, value, voice = false) => assert.equal(L.gradeText(find(id), value, voice).status, 'correct', `${id}: “${value}” must be accepted`);
  rejects('u4d6_c07', '40');
  for (const v of ['She has sixteen.', "She's sixteen years.", "He's sixteen.", 'She sixteen.', "She's sixty.", 'She is 16 years.']) rejects('u4d6_c10', v, true);
  for (const v of ["She's sixteen.", 'She is 16.', "Yes, it is. She's sixteen.", "She's sixteen years old.", "Yes, she is. She's sixteen.", 'Yes. She\'s sixteen.']) accepts('u4d6_c10', v, true);
  rejects('u4d6_c11', 'How old your grandmother is?');
  rejects('u4d6_c11', 'How old are your grandmother?');
  rejects('u4d6_c11', 'How old she is?');
  rejects('u4d6_c11', 'How old are you?');
  for (const v of ['She has twenty.', "She's my sister. She's twenty years.", "He's my sister. He's twenty.", "She's my sister. She twenty.", 'She is my sister. She has 20.']) rejects('u4d6_c13', v);
  for (const v of ["She's my sister. She's twenty.", 'This is my sister. Her name is Aysel. She is 20.', "My sister. She's 25 years old."]) accepts('u4d6_c13', v);
  rejectsField('u4d6_c12', 'u4d6_c12a', "He's 50.");
  rejectsField('u4d6_c12', 'u4d6_c12a', '50 years');
  rejectsField('u4d6_c12', 'u4d6_c12b', 'He has 55.');
  rejectsField('u4d6_c12', 'u4d6_c12b', 'fifty-five years');
  // Yeni ekranlar (21 Nov 2026): düz cavab qəbul olunur, tipik səhv qəbul olunmur və izah olunur.
  const ok = (g, id) => assert.equal(g.status, 'correct', `${id}: model answer accepted`);
  const no = (g, id, v) => { assert.equal(g.status, 'wrong', `${id}: “${v}” must not be accepted`); assert.ok(g.explain && g.explain.reason, `${id}: “${v}” explained`); };
  { const t = find('u4d6_profile'); const right = { who: 'father', age: '55' }; ok(L.gradeProfile(t, right), 'u4d6_profile'); { const g = L.gradeProfile(t, { ...right, age: '15' }); no(g, 'u4d6_profile', '15'); assert.ok(g.notes.age, 'u4d6_profile: row age note'); } { const g = L.gradeProfile(t, { ...right, age: '50' }); no(g, 'u4d6_profile', '50'); assert.ok(g.notes.age, 'u4d6_profile: row age note'); } { const g = L.gradeProfile(t, { ...right, who: 'grandfather' }); no(g, 'u4d6_profile', 'grandfather'); assert.ok(g.notes.who, 'u4d6_profile: row who note'); } { const g = L.gradeProfile(t, { ...right, who: 'brother' }); no(g, 'u4d6_profile', 'brother'); assert.ok(g.notes.who, 'u4d6_profile: row who note'); } }
};
