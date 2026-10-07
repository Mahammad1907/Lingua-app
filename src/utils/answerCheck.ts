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
  return text
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
export function allowedTypos(wordLength: number): number {
  if (wordLength <= 3) return 0;
  if (wordLength <= 5) return 1;
  if (wordLength <= 8) return 2;
  return 3;
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
  const correct = cleanAnswer(correctAnswer);

  // ═══ 1) acceptedAnswers yoxla ═══
  if (acceptedAnswers && acceptedAnswers.length > 0) {
    const allCorrect = [correctAnswer, ...acceptedAnswers].map(cleanAnswer);
    if (allCorrect.includes(user)) {
      return true;
    }
  }

  // ═══ 2) Tam uyğunluq ═══
  if (user === correct) return true;

  // ═══ 3) Boşluq fərqi yoxla (sağol = sağ ol) ═══
  const userNoSpace = user.replace(/\s+/g, '');
  const correctNoSpace = correct.replace(/\s+/g, '');
  if (userNoSpace === correctNoSpace) return true;

  // ═══ 4) Çoxsözlü cavab — söz-söz yoxla ═══
  const userWords = user.split(' ');
  const correctWords = correct.split(' ');
  if (userWords.length !== correctWords.length) return false;

  for (let i = 0; i < userWords.length; i++) {
    if (!isWordMatch(userWords[i], correctWords[i], language)) {
      return false;
    }
  }
  return true;
}