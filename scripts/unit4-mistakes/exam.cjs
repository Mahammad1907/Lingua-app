// Bölmə 4 imtahanı: tipik səhvlər qəbul olunmur (Who this?, he ↔ she, your ↔ you, No, it not., Yes, I have., His ↔ Her, a ↔ an).
module.exports = (rejects, find, rejectsField) => {
  rejects('u4x_c02', 'Who this?', true);
  rejects('u4x_c02', "Who's he?", true);
  rejects('u4x_c05', '70');
  rejects('u4x_c06', 'Is this you daughter?');
  rejects('u4x_c07', 'No, it not.', true);
  rejects('u4x_c07', "No, I'm not.", true);
  rejects('u4x_c07', 'Yes, it is.', true);
  rejects('u4x_c09', 'Yes, I have.');
  rejects('u4x_c09', 'I have sister.');
  rejects('u4x_c09', 'Yes, I am.');
  rejects('u4x_c12', 'How old he is?', true);
  rejects('u4x_c12', 'How old are he?', true);
  rejects('u4x_c12', 'How old is she?', true);
  rejects('u4x_c13', 'This is mother.');
  rejects('u4x_c13', 'This are my mother.');
  rejects('u4x_c13', 'This is your mother.');
  rejectsField('u4x_c11', 'u4x_c11a', "She's name is Lala.");
  rejectsField('u4x_c11', 'u4x_c11a', 'His name is Lala.');
  rejectsField('u4x_c11', 'u4x_c11a', 'Her name Lala.');
  rejectsField('u4x_c11', 'u4x_c11b', "She's student.");
  rejectsField('u4x_c11', 'u4x_c11b', "She's an student.");
  rejectsField('u4x_c11', 'u4x_c11b', "He's a student.");
};
