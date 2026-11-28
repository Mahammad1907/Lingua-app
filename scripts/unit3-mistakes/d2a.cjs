// Bölmə 3 · Dərs 2 · 1-ci hissə — country names written the Azerbaijani/Turkish way, “from” missing, letter slips.
module.exports = (rejects) => {
  rejects('u3d2a_c05', 'TURKIY');
  rejects('u3d2a_c12', 'Turkiye');
  rejects('u3d2a_c12', 'Türkiyə');
  rejects('u3d2a_c07', "I'm from Gruziya.", true);
  rejects('u3d2a_c13', "I'm Azerbaijan.", true);
  rejects('u3d2a_c13', 'I from Azerbaijan.', true);
};
