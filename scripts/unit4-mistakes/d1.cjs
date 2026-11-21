// Dərs 1 — “This are”, “This is friend”, “This is friend my”, “Who this?”, “You're welcome.” for Welcome!, “I'm Tom.” / “This is me.” for a friend.
module.exports = (rejects) => {
  rejects('u4d1_c07', 'This are my friend.');
  rejects('u4d1_c07', 'This is friend.');
  rejects('u4d1_c12', 'This are Tom.');
  rejects('u4d1_c12', 'This is friend.');
  rejects('u4d1_c12', 'This is friend my.');
  rejects('u4d1_c12', "I'm Tom.");
  rejects('u4d1_c12', 'This is me.');
  rejects('u4d1_c09', 'Who this?', true);
  rejects('u4d1_c09', 'This is my friend.', true);
  rejects('u4d1_c13', "You're welcome.", true);
  rejects('u4d1_c13', 'Thank you!', true);
  rejects('u4d1_c05', 'friends');
  rejects('u4d1_c05', 'frend');
};
