// Bölmə 4 imtahanı: tipik səhvlər qəbul olunmur (Who this?, he ↔ she, your ↔ you, No, it not., Yes, I have., His ↔ Her, a ↔ an).
const assert = require('node:assert/strict');
const L = require('../../src/utils/designLesson.ts');
module.exports = (rejects, find, rejectsField) => {
  rejects('u4x_c02', 'Who this?', true);
  rejects('u4x_c02', "Who's he?", true);
  rejects('u4x_c05', '70');
  rejects('u4x_c06', 'Is this you daughter?');
  rejects('u4x_c07', 'No, it not.', true);
  rejects('u4x_c07', "No, I'm not.", true);
  rejects('u4x_c07', 'Yes, it is.', true);
  rejects('u4x_c09', 'Yes, I have.');
  rejects('u4x_c09', 'I have sister.');
  rejects('u4x_c09', 'Yes, I am.');
  rejects('u4x_c09', 'I have a brother.');
  rejects('u4x_c12', 'How old he is?', true);
  rejects('u4x_c12', 'How old are he?', true);
  rejects('u4x_c12', 'How old is she?', true);
  rejects('u4x_c13', 'This is mother.');
  rejects('u4x_c13', 'This are my mother.');
  rejects('u4x_c13', 'This is your mother.');
  rejectsField('u4x_c11', 'u4x_c11a', "She's name is Lala.");
  rejectsField('u4x_c11', 'u4x_c11a', 'His name is Lala.');
  rejectsField('u4x_c11', 'u4x_c11a', 'Her name Lala.');
  rejectsField('u4x_c11', 'u4x_c11b', "She's student.");
  rejectsField('u4x_c11', 'u4x_c11b', "She's an student.");
  rejectsField('u4x_c11', 'u4x_c11b', "He's a student.");
  // Yeni ekranlar (21 Nov 2026): düz cavab qəbul olunur, tipik səhv qəbul olunmur və izah olunur.
  const ok = (g, id) => assert.equal(g.status, 'correct', `${id}: model answer accepted`);
  const no = (g, id, v) => { assert.equal(g.status, 'wrong', `${id}: “${v}” must not be accepted`); assert.ok(g.explain && g.explain.reason, `${id}: “${v}” explained`); };
  { const t = find('u4x_tree'); ok(L.gradeTree(t, 'grandfather'), 'u4x_tree'); no(L.gradeTree(t, 'father'), 'u4x_tree', 'father'); no(L.gradeTree(t, 'brother'), 'u4x_tree', 'brother'); }
  { const t = find('u4x_profile'); const right = { who: 'brother', age: '34', job: 'doctor' }; ok(L.gradeProfile(t, right), 'u4x_profile'); { const g = L.gradeProfile(t, { ...right, age: '43' }); no(g, 'u4x_profile', '43'); assert.ok(g.notes.age, 'u4x_profile: row age note'); } { const g = L.gradeProfile(t, { ...right, job: 'engineer' }); no(g, 'u4x_profile', 'engineer'); assert.ok(g.notes.job, 'u4x_profile: row job note'); } { const g = L.gradeProfile(t, { ...right, who: 'son' }); no(g, 'u4x_profile', 'son'); assert.ok(g.notes.who, 'u4x_profile: row who note'); } }
};
