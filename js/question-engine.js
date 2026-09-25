/**
 * Little Math Explorer — Question Engine
 * Generates math questions dynamically for counting, addition, and subtraction.
 */

var getThemeHelper = (typeof getRandomTheme !== 'undefined') 
  ? getRandomTheme 
  : (typeof require !== 'undefined' ? require('./themes.js').getRandomTheme : null);

class QuestionEngine {
  constructor(options = {}) {
    this.maxNumber = options.maxNumber || 10;
    this.recentQuestions = [];
    this.historyLimit = 5;
  }

  setMaxNumber(maxNumber) {
    this.maxNumber = Math.max(2, maxNumber);
  }

  /**
   * Helper to get a random integer between min and max inclusive
   */
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Shuffle an array in place
   */
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Generate 3 plausible answer choices guaranteeing uniqueness & correct answer inclusion
   */
  generateChoices(correctAnswer, maxRange = this.maxNumber) {
    const distractors = new Set();
    distractors.add(correctAnswer);

    // Candidates offsets around correct answer
    const offsets = [-1, 1, -2, 2, -3, 3];
    const shuffledOffsets = this.shuffle(offsets);

    for (const offset of shuffledOffsets) {
      if (distractors.size >= 3) break;
      const candidate = correctAnswer + offset;
      if (candidate >= 0 && candidate <= maxRange + 2 && candidate !== correctAnswer) {
        distractors.add(candidate);
      }
    }

    // Fallback fill if needed
    let fallbackCounter = 0;
    while (distractors.size < 3) {
      if (!distractors.has(fallbackCounter)) {
        distractors.add(fallbackCounter);
      }
      fallbackCounter++;
    }

    return this.shuffle(Array.from(distractors));
  }

  /**
   * Check if question signature was recently generated
   */
  isRecentQuestion(signature) {
    return this.recentQuestions.includes(signature);
  }

  /**
   * Record question signature
   */
  recordQuestion(signature) {
    this.recentQuestions.push(signature);
    if (this.recentQuestions.length > this.historyLimit) {
      this.recentQuestions.shift();
    }
  }

  /**
   * Main Question Generation Entry Point
   */
  generateQuestion(mode = 'addition') {
    let activeMode = mode;
    if (mode === 'challenge') {
      const modes = ['counting', 'addition', 'subtraction'];
      activeMode = modes[Math.floor(Math.random() * modes.length)];
    }

    const theme = getThemeHelper ? getThemeHelper() : { id: 'apple', icon: '🍎', name: '蘋果', unit: '個' };

    switch (activeMode) {
      case 'counting':
        return this.generateCountingQuestion(theme);
      case 'subtraction':
        return this.generateSubtractionQuestion(theme);
      case 'addition':
      default:
        return this.generateAdditionQuestion(theme);
    }
  }

  /**
   * Generate Counting Question
   */
  generateCountingQuestion(theme) {
    let count, sig;
    let attempts = 0;
    do {
      count = this.getRandomInt(1, this.maxNumber);
      sig = `count_${count}_${theme.id}`;
      attempts++;
    } while (this.isRecentQuestion(sig) && attempts < 10);

    this.recordQuestion(sig);

    const prompt = `有幾${theme.unit}${theme.name}？`;
    const choices = this.generateChoices(count, this.maxNumber);

    return {
      type: 'counting',
      operands: [count],
      answer: count,
      choices,
      theme,
      prompt,
      visualType: 'count'
    };
  }

  /**
   * Generate Addition Question
   */
  generateAdditionQuestion(theme) {
    let a, b, answer, sig;
    let attempts = 0;

    do {
      // Ensure sum is within maxNumber
      answer = this.getRandomInt(1, this.maxNumber);
      a = this.getRandomInt(0, answer);
      b = answer - a;
      sig = `add_${a}_${b}`;
      attempts++;
    } while (this.isRecentQuestion(sig) && attempts < 10);

    this.recordQuestion(sig);

    const prompt = `${a} + ${b} = ?`;
    const choices = this.generateChoices(answer, this.maxNumber);

    return {
      type: 'addition',
      operands: [a, b],
      answer,
      choices,
      theme,
      prompt,
      visualType: 'addition'
    };
  }

  /**
   * Generate Subtraction Question
   */
  generateSubtractionQuestion(theme) {
    let total, takeAway, remaining, sig;
    let attempts = 0;

    do {
      total = this.getRandomInt(1, this.maxNumber);
      takeAway = this.getRandomInt(0, total); // guarantees non-negative
      remaining = total - takeAway;
      sig = `sub_${total}_${takeAway}`;
      attempts++;
    } while (this.isRecentQuestion(sig) && attempts < 10);

    this.recordQuestion(sig);

    const prompt = `${total} - ${takeAway} = ?`;
    const choices = this.generateChoices(remaining, this.maxNumber);

    return {
      type: 'subtraction',
      operands: [total, takeAway],
      answer: remaining,
      choices,
      theme,
      prompt,
      subtractionPrompt: `原本有 ${total} ${theme.unit}，吃掉 ${takeAway} ${theme.unit}，還剩多少？`,
      visualType: 'subtraction'
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QuestionEngine };
}
