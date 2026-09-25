/**
 * GameAdapter - Module to connect Learning Engine / Question Engine with Mini-Games
 * Decouples game presentation from math question generation logic.
 */
class GameAdapter {
  /**
   * Create a normalized challenge payload for mini-games
   * @param {string} mode - 'counting' | 'addition' | 'subtraction'
   * @param {number} maxRange - 5, 10, or 20
   * @returns {Object} Normalized challenge object
   */
  static createChallenge(mode = 'counting', maxRange = 10) {
    let question = null;

    // Use global QuestionEngine if available
    if (typeof QuestionEngine !== 'undefined') {
      try {
        question = QuestionEngine.generateQuestion(mode, maxRange);
      } catch (e) {
        console.warn('GameAdapter fallback on QuestionEngine error:', e);
      }
    }

    // Fallback question generation if QuestionEngine is missing or failed
    if (!question) {
      question = GameAdapter.fallbackGenerator(mode, maxRange);
    }

    return GameAdapter.normalizePayload(question, mode);
  }

  /**
   * Convert raw question into normalized mini-game challenge
   */
  static normalizePayload(q, mode) {
    const fruits = ['🍎', '🍌', '🍊', '🍓', '🍇', '🍐'];
    const fruitIcon = fruits[Math.floor(Math.random() * fruits.length)];

    let targetCount = q.answer;
    let operands = q.operands || [q.answer];

    return {
      id: 'challenge_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      skillId: mode,
      difficulty: q.maxRange || 10,
      prompt: q.prompt || `算算看：${q.answer}`,
      visualType: q.visualType || mode,
      targetValue: q.answer,
      operands: operands,
      choices: q.choices || [q.answer - 1, q.answer, q.answer + 1],
      correctAnswer: q.answer,
      icon: fruitIcon,
      rawQuestion: q
    };
  }

  /**
   * Fallback standalone generator
   */
  static fallbackGenerator(mode, maxRange) {
    if (mode === 'addition') {
      const a = Math.floor(Math.random() * (maxRange / 2)) + 1;
      const b = Math.floor(Math.random() * (maxRange / 2)) + 1;
      const ans = a + b;
      return {
        prompt: `${a} + ${b} = ?`,
        answer: ans,
        operands: [a, b],
        choices: [ans, ans + 1, Math.max(1, ans - 1)].sort(() => Math.random() - 0.5)
      };
    } else {
      const count = Math.floor(Math.random() * 5) + 1;
      return {
        prompt: `接到 ${count} 顆水果`,
        answer: count,
        operands: [count],
        choices: [count, count + 1, Math.max(1, count - 1)].sort(() => Math.random() - 0.5)
      };
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GameAdapter };
}
