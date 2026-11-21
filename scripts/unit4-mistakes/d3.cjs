// Bölmə 4 · Dərs 3: “He's name”, “His is name”, “His name Elvin”, his ↔ her (sahibə görə), “She's husband”.
module.exports = (rejects) => {
  rejects('u4d3_c05', "He's name is Elvin.");
  rejects('u4d3_c05', 'His is name Elvin.');
  rejects('u4d3_c05', 'His name Elvin.');
  rejects('u4d3_c05', 'Her name is Elvin.');
  rejects('u4d3_c09', 'This is my sister. His name is Nigar.', true);
  rejects('u4d3_c09', "She's name is Nigar.", true);
  rejects('u4d3_c09', 'Her name Nigar.', true);
  rejects('u4d3_c09', 'This is my sister. My name is Nigar.', true);
  rejects('u4d3_c13', 'Yes, she is. This is his husband.');
  rejects('u4d3_c13', "Yes, she is. This is she's husband.");
  rejects('u4d3_c13', "Yes, she's. This is her husband.");
  rejects('u4d3_c13', 'Yes, she is. This is my husband.');
};
