// Bölmə 4 · Dərs 5: “I am have”, “I has”, “Have you a brother?”, “I have not a sister”, “I have brother”, “Yes, I have.”
const assert = require('node:assert/strict');
const L = require('../../src/utils/designLesson.ts');
module.exports = (rejects, find, rejectsField) => {
  const accepts = (id, value, voice = false) => assert.equal(L.gradeText(find(id), value, voice).status, 'correct', `${id}: “${value}” must be accepted`);
  rejects('u4d5_c07', 'I have not a sister.');
  rejects('u4d5_c07', "I don't have sister.");
  rejects('u4d5_c07', 'I am not have a sister.');
  for (const v of ['I am have a brother.', 'I has a brother.', 'I have brother.', 'I have not a sister.', 'Yes, I have.', 'Yes, I am.', 'Have you a brother?', "I'm have a sister."]) rejects('u4d5_c10', v, true);
  for (const v of ['Yes, I do.', "No, I don't.", 'Yes, I do. I have a brother.', "No, I don't have a brother.", 'I have a brother and a sister.']) accepts('u4d5_c10', v, true);
  for (const v of ['I am have a brother.', 'I has a sister.', 'I have brother.', 'I have not a sister.', 'There is a brother.']) rejects('u4d5_c13', v);
  for (const v of ["I have a brother, but I don't have a sister.", 'I have a sister.', "I don't have a brother. I have a sister. And you?"]) accepts('u4d5_c13', v);
  rejectsField('u4d5_c12', 'u4d5_c12b', 'Have you a son?');
  rejectsField('u4d5_c12', 'u4d5_c12b', 'Are you have a son?');
  rejectsField('u4d5_c12', 'u4d5_c12a', 'I has a sister.');
  rejectsField('u4d5_c12', 'u4d5_c12a', 'I have sister.');
  rejectsField('u4d5_c12', 'u4d5_c12a', 'I am have a sister.');
};
