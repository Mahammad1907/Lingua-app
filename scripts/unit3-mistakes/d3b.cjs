// Dərs 3b — millət: formada ölkə adı, “Azeri” (qayda 20), Nationality-yə ölkə ilə cavab.
module.exports = (rejects, find, rejectsField) => {
  rejectsField('u3d3b_c11', 'u3d3b_c11c', 'Azerbaijan');
  rejectsField('u3d3b_c11', 'u3d3b_c11c', 'Azeri');
  rejectsField('u3d3b_c11', 'u3d3b_c11c', "I'm from Azerbaijan");
  rejects('u3d3b_c12', 'Azerbaijan.');
  rejects('u3d3b_c12', "I'm from Azerbaijan.");
  rejects('u3d3b_c12', 'Azeri.');
  rejects('u3d3b_c12', 'Azerbaijan.', true);
  rejects('u3d3b_c07', "I'm Germany.", true);
};
