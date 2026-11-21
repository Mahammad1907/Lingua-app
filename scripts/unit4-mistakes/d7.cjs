// Bölmə 4 · Dərs 7 — Peşə: a atılır, an doctor, a engineer, he ↔ she.
module.exports = (rejects, find, rejectsField) => {
  rejects('u4d7_c07', "He's doctor.");
  rejects('u4d7_c07', "He's an doctor.");
  rejects('u4d7_c07', "She's a doctor.");
  rejects('u4d7_c11', "He's doctor.", true);
  rejects('u4d7_c11', "He's an doctor.", true);
  rejects('u4d7_c11', 'He is teacher.', true);
  rejects('u4d7_c12', "Yes, she's.");
  rejects('u4d7_c13', "She's a engineer.", true);
  rejectsField('u4d7_c14', 'u4d7_c14a', "He's an teacher.");
  rejectsField('u4d7_c14', 'u4d7_c14a', 'He is teacher.');
  rejectsField('u4d7_c14', 'u4d7_c14b', "She's a engineer.");
  rejectsField('u4d7_c14', 'u4d7_c14b', "She's engineer.");
};
