// Dərs 3a — millət: ölkə adı ilə qarışdırmaq, “from” + millət, “Azeri” (qayda 20).
module.exports = (rejects) => {
  rejects('u3d3a_c09', "I'm Azerbaijan.");
  rejects('u3d3a_c09', "I'm from Azerbaijan.");
  rejects('u3d3a_c09', "I'm Azeri.");
  rejects('u3d3a_c09', "I'm Azerbaijan.", true);
  rejects('u3d3a_c10', "I'm from Azerbaijani.");
  rejects('u3d3a_c10', "I'm Azerbaijan.");
  rejects('u3d3a_c11', 'Georgia');
  rejects('u3d3a_c11', 'Gorgian');
};
