import { normalizeApostrophes, isSafeEnglishTypo } from './spelling';
// ═══════════════════════════════════════
// TYPO-TOLERANT CAVAB YOXLAMASI
// Data-driven: söz bazası ilə işləyir
// ═══════════════════════════════════════

import {
  AnswerLanguage,
  isWordInDatabase,
} from './wordDatabase';

// ═══════════════════════════════════════
// CAVABI TƏMİZLƏ
// - Böyük/kiçik hərf → kiçik
// - Mötərizə silinir: "Beş (5)" → "beş"
// - Durğu işarələri silinir: "sağ ol." → "sağ ol"
// - Çoxlu boşluqlar təkə çevrilir
// - Boşluqlar TAM SİLİNMİR (a man ≠ aman)
// ═══════════════════════════════════════
function cleanAnswer(text: string): string {
  return normalizeApostrophes(text)
    .toLowerCase()
    .trim()
    .replace(/\([^)]*\)/g, '')
    .replace(/[.!?,;:'"]/g, '')
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
export function allowedTypos(wordLength: number): number { return wordLength <= 3 ? 0 : 1; }

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
  if (language === 'en') return isSafeEnglishTypo(userLower, correctLower);

  if (isWordInDatabase(userLower, language)) {
    return false;
  }

  const len = Math.max(userLower.length, correctLower.length);
  const allowed = allowedTypos(len);
  if (allowed === 0) return false;

  return levenshtein(userLower, correctLower) <= allowed;
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
  const user = cleanAnswer(userAnswer);
  if (!user) return false;
  return [correctAnswer, ...(acceptedAnswers || [])].some(target => {
    const correct = cleanAnswer(target);
    if (user === correct) return true;
    if (language === 'az' && new Set(['sağ ol', 'sağol']).has(user) && new Set(['sağ ol', 'sağol']).has(correct)) return true;
    const actual = user.split(' '), expected = correct.split(' ');
    return actual.length === expected.length && expected.every((word, i) => isWordMatch(actual[i], word, language));
  });
}
