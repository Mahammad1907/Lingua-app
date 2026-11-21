// Bölmə 4 · Dərs 8 — Ailə söhbəti: my atılır, a/an, His ↔ Her, “has”, Do sualı.
module.exports = (rejects, find, rejectsField) => {
  rejects('u4d8_c04', 'This is brother.', true);
  rejects('u4d8_c04', 'This are my brother.', true);
  rejects('u4d8_c08', "She has fifty.", true);
  rejects('u4d8_c08', "She's fifty years.", true);
  rejects('u4d8_c08', "He's fifty.", true);
  rejects('u4d8_c09', 'I have brother.');
  rejects('u4d8_c09', 'Yes, I have.');
  rejects('u4d8_c09', 'Have you a brother?');
  rejectsField('u4d8_c13', 'u4d8_c13a', "He's name is Anar.");
  rejectsField('u4d8_c13', 'u4d8_c13a', 'Her name is Anar.');
  rejectsField('u4d8_c13', 'u4d8_c13b', "He's doctor.");
  rejectsField('u4d8_c13', 'u4d8_c13b', "He's an doctor.");
  rejects('u4d8_c14', "This is sister. She's a doctor.", true);
  rejects('u4d8_c14', "This is my sister. She's doctor.", true);
  rejects('u4d8_c14', "This is my sister. She's an doctor.", true);
};
