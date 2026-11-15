// Bölmə 3 · Dərs 7 — Dillər: “Are you speak”, “a”-sız little, dil yerinə ölkə, “Yes, I speak.”
module.exports = (rejects, find, rejectsField) => {
  rejects('u3d7_c05', 'Are you speak Russian?');
  rejects('u3d7_c05', 'Do you speak Russia?');
  rejects('u3d7_c09', 'I speak England.', true);
  rejects('u3d7_c09', 'I speak Azeri.', true);
  rejects('u3d7_c09', 'I speak English little.', true);
  rejects('u3d7_c09', 'Yes, I speak.', true);
  rejects('u3d7_c12', 'Yes, little.');
  rejects('u3d7_c12', "No, I don't.");
  rejects('u3d7_c12', 'Yes, I speak.');
};
