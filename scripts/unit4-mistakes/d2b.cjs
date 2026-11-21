// Dərs 2b — “My parents is …”, “My parents in …”, “My grandmother in …”, “grand mother”, “This is son”.
module.exports = (rejects) => {
  rejects('u4d2b_c05', 'grand mother');
  rejects('u4d2b_c05', 'mother');
  rejects('u4d2b_c07', 'My grandmother in Ganja.');
  rejects('u4d2b_c07', 'My grandmother are in Ganja.');
  rejects('u4d2b_c11', 'This is my son.', true);
  rejects('u4d2b_c11', 'This is daughter.', true);
  rejects('u4d2b_c12', 'My parents is in Baku.', true);
  rejects('u4d2b_c12', 'My parents in Baku.', true);
  rejects('u4d2b_c12', 'My parents are from Baku.', true);
};
