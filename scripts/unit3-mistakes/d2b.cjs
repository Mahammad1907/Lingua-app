// Bölmə 3 · Dərs 2 · 2-ci hissə — “the” dropped (USA), “the England”, no return question.
module.exports = (rejects) => {
  rejects('u3d2b_c07', 'USA');
  rejects('u3d2b_c09', "I'm from Almaniya.", true);
  rejects('u3d2b_c11', 'FRANSE');
  rejects('u3d2b_c13', "I'm from Azerbaijan.", true);
  rejects('u3d2b_c13', "I'm Azerbaijan. And you?", true);
  rejects('u3d2b_c13', 'I from Azerbaijan. And you?', true);
};
