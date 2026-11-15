// Bölmə 3 imtahanı: tipik səhvlər qəbul olunmur; “Azeri” heç yerdə qəbul olunmur (qayda 20).
module.exports = (rejects, find, rejectsField) => {
  rejects('u3x_c02', "I'm Azerbaijan.", true);
  rejects('u3x_c02', "I'm from Azerbaijani.", true);
  rejects('u3x_c09', "Where's he from?", true);
  rejects('u3x_c10', 'I live at Ganja.');
  rejects('u3x_c11', 'Ganja');
  rejects('u3x_c12', 'I speak Russia.', true);
  rejects('u3x_c13', 'Are you speak Turkish?');
  rejectsField('u3x_c05', 'u3x_c05b', 'Azerbaijan');
  rejectsField('u3x_c05', 'u3x_c05b', 'Azeri');
};
