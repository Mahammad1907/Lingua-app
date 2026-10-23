// ═══════════════════════════════════════
// TYPO-TOLERANT CAVAB YOXLAMASI
// Data-driven: söz bazası ilə işləyir
// ═══════════════════════════════════════

import {
  AnswerLanguage,
  isWordInDatabase,
} from './wordDatabase';
import { isSafeEnglishTypo, normalizeApostrophes, oneLetterDifference } from './spelling';
import { normalizeSpeech } from './spokenAnswer';

// ═══════════════════════════════════════
// CAVABI TƏMİZLƏ
// - Böyük/kiçik hərf → kiçik
// - Mötərizə silinir: "Beş (5)" → "beş"
// - Durğu işarələri silinir: "sağ ol." → "sağ ol"
// - Çoxlu boşluqlar təkə çevrilir
// - Boşluqlar TAM SİLİNMİR (a man ≠ aman)
// ═══════════════════════════════════════
function cleanAnswer(text: string, language: AnswerLanguage): string {
  return (language === 'en' ? normalizeSpeech(text) : normalizeApostrophes(text))
    .toLocaleLowerCase(language === 'az' ? 'az' : undefined)
    .trim()
    .replace(/\([^)]*\)/g, '')
    .replace(/[.!?,;:"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ═══════════════════════════════════════
// LEVENSHTEIN MƏSAFƏSİ
// ═══════════════════════════════════════
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

// ═══════════════════════════════════════
// SÖZ UZUNLUĞUNA GÖRƏ İCAZƏ VERİLƏN SƏHV
// ═══════════════════════════════════════
export function allowedTypos(wordLength: number): number {
  return wordLength >= 4 ? 1 : 0;
}

// ═══════════════════════════════════════
// TƏK SÖZ MÜQAYİSƏSİ
// ═══════════════════════════════════════
export function isWordMatch(
  user: string,
  correct: string,
  language: AnswerLanguage
): boolean {
  const userLower = user.toLowerCase().trim();
  const correctLower = correct.toLowerCase().trim();

  if (userLower === correctLower) return true;

  if (isWordInDatabase(userLower, language)) {
    return false;
  }

  if (language === 'en') return isSafeEnglishTypo(userLower, correctLower);
  return correctLower.length >= 4 && userLower.length >= 3 && oneLetterDifference(userLower, correctLower);
}

// ═══════════════════════════════════════
// TAM CAVAB MÜQAYİSƏSİ
// ═══════════════════════════════════════
export function isAnswerCorrect(
  userAnswer: string,
  correctAnswer: string,
  language: AnswerLanguage,
  acceptedAnswers?: string[]
): boolean {
  const user = cleanAnswer(userAnswer, language);
  if (!user) return false;
  return [correctAnswer, ...(acceptedAnswers || [])].some((candidate) => {
    const correct = cleanAnswer(candidate, language);
    if (user === correct) return true;
    // Only this conventional Azerbaijani spelling is explicitly space-insensitive.
    if (language === 'az' && [user, correct].every((value) => ['sağol', 'sağ ol'].includes(value))) return true;
    const actualWords = user.split(' '); const expectedWords = correct.split(' ');
    return actualWords.length === expectedWords.length && actualWords.every((word, i) => isWordMatch(word, expectedWords[i], language));
  });
}
