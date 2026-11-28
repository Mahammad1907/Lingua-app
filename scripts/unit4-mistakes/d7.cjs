// Bölmə 4 · Dərs 7 — Peşə: a atılır, an doctor, a engineer, he ↔ she; Profil kartı (yaş 50 ↔ 15, peşə).
const assert = require('node:assert/strict');
const L = require('../../src/utils/designLesson.ts');
module.exports = (rejects, find, rejectsField) => {
  rejects('u4d7_c07', "He's doctor.");
  rejects('u4d7_c07', "He's an doctor.");
  rejects('u4d7_c07', "She's a doctor.");
  rejects('u4d7_c11', "He's doctor.", true);
  rejects('u4d7_c11', "He's an doctor.", true);
  rejects('u4d7_c11', 'He is teacher.', true);
  rejects('u4d7_c13', "She's a engineer.", true);
  rejectsField('u4d7_c14', 'u4d7_c14a', "He's an teacher.");
  rejectsField('u4d7_c14', 'u4d7_c14a', 'He is teacher.');
  rejectsField('u4d7_c14', 'u4d7_c14b', "She's a engineer.");
  rejectsField('u4d7_c14', 'u4d7_c14b', "She's engineer.");
  // Yeni ekranlar (21 Nov 2026): düz cavab qəbul olunur, tipik səhv qəbul olunmur və izah olunur.
  const ok = (g, id) => assert.equal(g.status, 'correct', `${id}: model answer accepted`);
  const no = (g, id, v) => { assert.equal(g.status, 'wrong', `${id}: “${v}” must not be accepted`); assert.ok(g.explain && g.explain.reason, `${id}: “${v}” explained`); };
  { const t = find('u4d7_profile'); const right = { who: 'mother', age: '50', job: 'teacher' }; ok(L.gradeProfile(t, right), 'u4d7_profile'); { const g = L.gradeProfile(t, { ...right, age: '15' }); no(g, 'u4d7_profile', '15'); assert.ok(g.notes.age, 'u4d7_profile: row age note'); } { const g = L.gradeProfile(t, { ...right, job: 'engineer' }); no(g, 'u4d7_profile', 'engineer'); assert.ok(g.notes.job, 'u4d7_profile: row job note'); } { const g = L.gradeProfile(t, { ...right, job: 'doctor' }); no(g, 'u4d7_profile', 'doctor'); assert.ok(g.notes.job, 'u4d7_profile: row job note'); } { const g = L.gradeProfile(t, { ...right, who: 'grandmother' }); no(g, 'u4d7_profile', 'grandmother'); assert.ok(g.notes.who, 'u4d7_profile: row who note'); } }
};
