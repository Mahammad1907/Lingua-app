// Bölmə 3 · Dərs 1 — typical mistakes: “from” or “am” missing, “You too” instead of “Me too”.
module.exports = (rejects) => {
  rejects('u3d1_c05', "I'm Ganja.");
  rejects('u3d1_c05', 'I from Ganja.');
  rejects('u3d1_c07', "I'm Azerbaijan.", true);
  rejects('u3d1_c07', 'I from Azerbaijan.', true);
  rejects('u3d1_c07', "I'm from Azerbaijani.");
  rejects('u3d1_c07', "I'm Azeri.");
  rejects('u3d1_c11', 'You too.');
  rejects('u3d1_c12', "What's your name?", true);
};
