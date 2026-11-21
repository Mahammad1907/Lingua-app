// Bölmə 4 · Dərs 4: “Is this you mother?”, “This is your father?”, “Do this is…”, “Yes, it's.”, “No, it not.”, “No, I'm not.”, he ↔ she, “His my brother”.
module.exports = (rejects) => {
  rejects('u4d4_c05', 'Is this you father?');
  rejects('u4d4_c05', 'This is your father?');
  rejects('u4d4_c05', 'Is this my father?');
  rejects('u4d4_c09', 'No, it not.', true);
  rejects('u4d4_c09', "No, isn't.", true);
  rejects('u4d4_c09', "No, I'm not.", true);
  rejects('u4d4_c09', 'Yes, it is.', true);
  rejects('u4d4_c09', "Yes, it's.", true);
  rejects('u4d4_c13', "She's my brother.");
  rejects('u4d4_c13', 'His my brother.');
  rejects('u4d4_c13', 'He my brother.');
  rejects('u4d4_c13', "He's brother.");
  rejects('u4d4_c11', 'Is this you mother?', true);
  rejects('u4d4_c11', 'This is your mother?', true);
  rejects('u4d4_c11', 'Do this is your mother?', true);
  rejects('u4d4_c11', 'Is this my mother?', true);
};
