// Bölmə 3 · Dərs 5 · 1-ci hissə: he ↔ she (azərbaycancada ikisi də “o”), is-i atmaq (“She from …”).
module.exports = (rejects) => {
  rejects('u3d5a_c08', "She's from Georgia.", true);
  rejects('u3d5a_c08', 'He from Georgia.', true);
  rejects('u3d5a_c08', "I'm from Georgia.", true);
  rejects('u3d5a_c10', "He's from Germany.");
  rejects('u3d5a_c10', "She's from German.");
  rejects('u3d5a_c12', "He's from Germany.");
  rejects('u3d5a_c12', 'She from Germany.');
  rejects('u3d5a_c12', "She's from France.");
};
