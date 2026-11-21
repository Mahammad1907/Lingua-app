// Dərs 2a — “This is mother” (my missing), “This are my mother”, “This is sister”.
module.exports = (rejects) => {
  rejects('u4d2a_c05', 'This is mother.');
  rejects('u4d2a_c05', 'This are my mother.');
  rejects('u4d2a_c07', 'This is father.', true);
  rejects('u4d2a_c07', 'This is my brother.', true);
  rejects('u4d2a_c12', 'This is sister.', true);
  rejects('u4d2a_c12', 'This is my mother.', true);
  rejects('u4d2a_c12', "She's sister.", true);
};
