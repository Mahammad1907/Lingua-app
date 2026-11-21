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
};
