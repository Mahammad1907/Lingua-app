// Typical Azerbaijani-learner mistakes (docs/AZ_OYRENEN_SEHVLERI.md, docs/BOLME_2_XERITESI.md) that Bölmə 2 tasks must reject.
// rejects(cardId, answer, voice?) — add one line per task that has a typical wrong answer.
const assert = require('node:assert/strict');
module.exports = (rejects, find) => {
  // Form / two-message fields: rejectsField(cardId, fieldId, answer).
  const { assessPacketAnswer } = require('../src/utils/packetAnswer.ts');
  const rejectsField = (cardId, fieldId, value) => {
    const field = find(cardId).fields.find(f => f.id === fieldId);
    assert.notEqual(assessPacketAnswer(value, field.rule).status, 'correct', `${fieldId}: “${value}” must not be accepted`);
  };
  // Dərs 1: th → t, five → “fife”, rəqəm səhv
  rejects('u2d1a_c11', 'tree');
  rejects('u2d1a_c11', 'free');
  rejects('u2d1a_c10', 'Excuse me, fife, please.', true);
  rejects('u2d1a_c10', 'Excuse me, three, please.', true);
  rejects('u2d1a_c07', '410');
  rejects('u2d1b_c11', 'eigth');
  rejects('u2d1b_c11', 'eyt');
  rejects('u2d1b_c12', 'Thank you!');
  rejects('u2d1b_c12', 'Please.');
  // Dərs 2: söz sırası, “My phone is”, oh-nu buraxmaq
  rejects('u2d2_c04', "What's your number phone?");
  rejects('u2d2_c04', "What's your name?");
  rejects('u2d2_c06', 'My phone is 050 321 45 67.', true);
  rejects('u2d2_c06', 'I am 050 321 45 67.', true);
  rejects('u2d2_c08', '55281496');
  rejects('u2d2_c12', 'Thank you!');
  rejectsField('u2d2_c13', 'u2d2_c13a', "What's your number phone?");
  rejectsField('u2d2_c13', 'u2d2_c13a', 'My phone?');
  rejectsField('u2d2_c13', 'u2d2_c13b', 'Is that true?');
  // Dərs 3: E ↔ I, G ↔ J, H “aş”
  rejects('u2d3a_c07', 'KPB');
  rejects('u2d3a_c10', 'G, K, G.', true);
  rejects('u2d3a_c12', '10 KP 205');
  rejects('u2d3b_c05', 'GID');
  rejects('u2d3b_c05', 'JYD');
  rejects('u2d3b_c11', 'L, H, E.', true);
  rejects('u2d3b_c12', 'My phone is 050 321 45 67.');
  // Dərs 4: “How you spell?”, double-ı “two” demək
  rejects('u2d4_c07', 'How you spell it?');
  rejects('u2d4_c07', 'How is your spell?');
  rejects('u2d4_c12', 'How you spell?', true);
  rejects('u2d4_c12', 'How do you write it?', true);
  rejects('u2d4_c11', 'Hasanof');
  rejects('u2d4_c05', 'GANGA');
  // Dərs 5: “surname name”, first/last qarışığı
  rejects('u2d5_c07', "What's your first name?");
  rejects('u2d5_c10', "What's your surname name?", true);
  rejects('u2d5_c10', "What's your name?", true);
  rejects('u2d5_c12', 'My name is Aysu.', true);
  rejects('u2d5_c11', 'Guliev');
  // Dərs 6: “et”, “nöqtə”, ünvanı sözlə yazmaq
  rejects('u2d6_c09', 'hasanova at mail dot com');
  rejects('u2d6_c09', 'hasanova@mailcom');
  rejects('u2d6_c10', 'kb et mail nöqtə com', true);
  rejectsField('u2d6_c12', 'u2d6_c12c', 'kb at mail dot com');
  rejects('u2d6_c05', "What's your phone?");
  // Dərs 7: “-teen” səhvləri, 13 ↔ 30, “I have 25 years”, “I'm 25 years”
  rejects('u2d7a_c10', 'fiveteen');
  rejects('u2d7a_c10', 'fifty');
  rejects('u2d7a_c13', "It's eighty.", true);
  rejects('u2d7b_c05', '1330');
  rejects('u2d7b_c09', 'I have 25 years.', true);
  rejects('u2d7b_c09', "I'm 25 years.", true);
  rejects('u2d7b_c09', 'I 25.', true);
  rejects('u2d7b_c09', 'My age is 25 years.', true);
  rejectsField('u2d7b_c11', 'u2d7b_c11c', 'I have 25 years');
  rejects('u2d7b_c13', 'How are you?');
  rejects('u2d7b_c13', 'How old is you?');
  // Dərs 8 və imtahan
  rejects('u2d8_c09', 'How you spell?', true);
  rejects('u2d8_c12', 'ganja5 at mail dot com');
  rejects('u2d8_c13', 'I have 25 years. And you?', true);
  rejects('u2d8_c13', "I'm 25.", true);
  rejects('u2x_c07', 'Talin');
  rejects('u2x_c08', 'How you spell?', true);
  rejects('u2x_c13', 'I have 30 years.', true);
  rejects('u2x_c15', 'aliyeva at mail dot com');
  rejects('u2x_c11', 'aliyeva et mail com');
};
