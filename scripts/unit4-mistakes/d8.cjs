// Bölmə 4 · Dərs 8 — Ailə söhbəti: my atılır, a/an, His ↔ Her, “has”, Do sualı.
const assert = require('node:assert/strict');
const L = require('../../src/utils/designLesson.ts');
module.exports = (rejects, find, rejectsField) => {
  const accepts = (id, value, voice = false) => assert.equal(L.gradeText(find(id), value, voice).status, 'correct', `${id}: “${value}” must be accepted`);
  rejects('u4d8_c04', 'This is brother.', true);
  rejects('u4d8_c04', 'This are my brother.', true);
  rejects('u4d8_c08', "She has fifty.", true);
  rejects('u4d8_c08', "She's fifty years.", true);
  rejects('u4d8_c08', "He's fifty.", true);
  for (const v of ["She's fifty.", "She's fifty years old.", "She's 50.", 'She is fifty.']) accepts('u4d8_c08', v, true);
  rejects('u4d8_c08', "She's fifteen.", true);
  rejects('u4d8_c09', 'I have son.');
  rejects('u4d8_c09', 'Yes, I have.');
  rejects('u4d8_c09', 'Have you a son?');
  rejects('u4d8_c09', 'I have a wife.');
  for (const v of ['Yes, I do.', 'Yes, I do. I have a son.', "No, I don't. And you?", "No, I don't have a son."]) accepts('u4d8_c09', v);
  rejectsField('u4d8_c13', 'u4d8_c13a', "He's name is Anar.");
  rejectsField('u4d8_c13', 'u4d8_c13a', 'Her name is Anar.');
  rejectsField('u4d8_c13', 'u4d8_c13b', "He's doctor.");
  rejectsField('u4d8_c13', 'u4d8_c13b', "He's an doctor.");
  rejects('u4d8_c14', "This is sister. She's a doctor.", true);
  rejects('u4d8_c14', "This is my sister. She's doctor.", true);
  rejects('u4d8_c14', "This is my sister. She's an doctor.", true);
  for (const v of ["This is my sister. She's a doctor.", "She's my sister. She's a doctor.", 'She is my sister. She is a doctor.']) accepts('u4d8_c14', v, true);
};
