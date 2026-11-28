// Bölmə 3 · Dərs 5 · 2-ci hissə: he ↔ she, “Where he from?”, “He is from Russia?” (sual sırası), “No, she not”, özü haqqında cavab.
module.exports = (rejects) => {
  rejects('u3d5b_c04', "Where's she from?", true);
  rejects('u3d5b_c04', 'Where he from?', true);
  rejects('u3d5b_c04', 'Where are you from?', true);
  rejects('u3d5b_c06', 'He is from Russia?');
  rejects('u3d5b_c06', 'Is he Russian?');
  rejects('u3d5b_c11', "No, he isn't.", true);
  rejects('u3d5b_c11', 'No, she not.', true);
  rejects('u3d5b_c11', "No, I'm not.", true);
  rejects('u3d5b_c11', 'Yes, she is.', true);
  rejects('u3d5b_c12', "She's from Azerbaijan.");
  rejects('u3d5b_c12', 'He from Azerbaijan.');
  rejects('u3d5b_c12', "He's Azerbaijan.");
};
