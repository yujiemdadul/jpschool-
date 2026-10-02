import { KanaChar, QuizQuestion } from '../types';
import { HIRAGANA_CHARS } from '../data/hiraganaData';
import { KATAKANA_CHARS } from '../data/katakanaData';

/**
 * Validates the entire Kana dataset at startup.
 * Throws an error or logs critical failures if any kana data is broken.
 */
export function validateKanaData(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const expectedRows = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa'];

  const validateSet = (chars: KanaChar[], type: 'hiragana' | 'katakana') => {
    if (chars.length !== 46) {
      errors.push(`${type} dataset count mismatch: expected 46 characters, got ${chars.length}`);
    }

    const seenIds = new Set<string>();
    const seenChars = new Set<string>();

    chars.forEach((item, index) => {
      // Check ID uniqueness
      if (seenIds.has(item.id)) {
        errors.push(`Duplicate ID found in ${type}: ${item.id}`);
      }
      seenIds.add(item.id);

      // Check character uniqueness
      if (seenChars.has(item.character)) {
        errors.push(`Duplicate character found in ${type}: ${item.character}`);
      }
      seenChars.add(item.character);

      // Check fields
      if (!item.romaji || item.romaji.trim() === '') {
        errors.push(`Missing Romaji for character ${item.character} at index ${index}`);
      }
      if (!item.bangla || item.bangla.trim() === '') {
        errors.push(`Missing Bangla pronunciation for character ${item.character} at index ${index}`);
      }
      if (!item.level || item.level < 1 || item.level > 10) {
        errors.push(`Invalid level ${item.level} for character ${item.character}`);
      }
      if (!expectedRows.includes(item.row)) {
        errors.push(`Invalid row '${item.row}' for character ${item.character}`);
      }
      if (!item.examples || item.examples.length === 0) {
        errors.push(`No examples provided for character ${item.character}`);
      } else {
        item.examples.forEach((ex, exIdx) => {
          if (!ex.japanese || !ex.romaji || !ex.bangla) {
            errors.push(`Incomplete example #${exIdx + 1} for ${item.character}`);
          }
        });
      }
      if (!item.strokeSteps || item.strokeSteps.length === 0) {
        errors.push(`No stroke steps provided for character ${item.character}`);
      }
    });
  };

  validateSet(HIRAGANA_CHARS, 'hiragana');
  validateSet(KATAKANA_CHARS, 'katakana');

  if (errors.length > 0) {
    console.error('❌ KANA DATA VALIDATION FAILED:', errors);
  } else {
    console.log('✅ Kana dataset validated successfully (46 Hiragana + 46 Katakana = 92 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates a single quiz question before it is rendered to the user.
 * Guarantees exactly 4 unique options, 1 verified correct answer matching kana source data.
 */
export function validateQuizQuestion(q: QuizQuestion): boolean {
  if (!q) return false;
  if (!q.id || !q.type || !q.promptText) return false;
  if (!q.sourceKana) return false;

  // Options must exist and have exactly 4 items
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    console.warn(`[QuizValidator] Invalid options length for question ${q.id}: expected 4, got ${q.options?.length}`);
    return false;
  }

  // Must not have empty options
  if (q.options.some(opt => !opt || opt.trim() === '')) {
    console.warn(`[QuizValidator] Empty option detected in question ${q.id}`);
    return false;
  }

  // No duplicate options allowed
  const uniqueOptions = new Set(q.options.map(o => o.trim()));
  if (uniqueOptions.size !== 4) {
    console.warn(`[QuizValidator] Duplicate options found in question ${q.id}:`, q.options);
    return false;
  }

  // Correct option index must be between 0 and 3
  if (q.correctOptionIndex < 0 || q.correctOptionIndex > 3) {
    console.warn(`[QuizValidator] Invalid correctOptionIndex ${q.correctOptionIndex} for question ${q.id}`);
    return false;
  }

  // Correct answer string must match options[correctOptionIndex]
  if (q.options[q.correctOptionIndex] !== q.correctAnswer) {
    console.warn(`[QuizValidator] Option index value '${q.options[q.correctOptionIndex]}' does not match correctAnswer '${q.correctAnswer}'`);
    return false;
  }

  // Verify answer matches source kana data
  const { sourceKana } = q;
  switch (q.type) {
    case 'jp_to_bn':
      if (q.correctAnswer !== sourceKana.bangla) return false;
      break;
    case 'bn_to_jp':
    case 'romaji_to_jp':
    case 'listen_to_jp':
      if (q.correctAnswer !== sourceKana.character) return false;
      break;
    case 'jp_to_romaji':
      if (q.correctAnswer !== sourceKana.romaji) return false;
      break;
  }

  return true;
}
