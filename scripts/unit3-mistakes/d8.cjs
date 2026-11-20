// Bölmə 3 · Dərs 8 — Dil klubu: he ↔ she, “from”suz ölkə, “live at”, millət yerinə ölkə.
module.exports = (rejects, find, rejectsField) => {
  rejects('u3d8_c04', "I'm Azerbaijan. And you?", true);
  rejects('u3d8_c04', 'I from Baku. And you?', true);
  rejects('u3d8_c04', "I'm from Azeri. And you?", true);
  rejects('u3d8_c09', "She's from Baku. She's Azerbaijani.", true);
  rejects('u3d8_c09', "He's from Baku. He's Azeri.", true);
  rejects('u3d8_c12', 'I live at Baku.');
  rejects('u3d8_c12', "I'm live in Baku.");
  rejectsField('u3d8_c07', 'u3d8_c07a', "He's from Ganja.");
  rejectsField('u3d8_c07', 'u3d8_c07b', "She's Azerbaijan.");
  rejectsField('u3d8_c07', 'u3d8_c07b', "She's Azeri.");
};
