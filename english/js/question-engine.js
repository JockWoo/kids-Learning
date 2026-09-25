/**
 * Little Alphabet Explorer — Question Engine
 * Generates ABC letter recognition, word matching, and alphabet ordering questions.
 */

var getLetterHelper = (typeof getRandomLetterItem !== 'undefined')
  ? getRandomLetterItem
  : (typeof require !== 'undefined' ? require('./letters.js').getRandomLetterItem : null);

var alphabetList = (typeof ALPHABET_DATA !== 'undefined')
  ? ALPHABET_DATA
  : (typeof require !== 'undefined' ? require('./letters.js').ALPHABET_DATA : []);

class QuestionEngine {
  constructor(options = {}) {
    this.maxLetterRange = options.maxLetterRange || 26; // 10, 26
    this.recentQuestions = [];
    this.historyLimit = 5;
  }

  setMaxLetterRange(range) {
    this.maxLetterRange = Math.min(26, Math.max(5, range));
  }

  setMaxRange(range) {
    this.setMaxLetterRange(range);
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Main question generator
   */
  generateQuestion(mode = 'letter') {
    let activeMode = mode;
    if (mode === 'challenge') {
      const modes = ['letter', 'word', 'order'];
      activeMode = modes[Math.floor(Math.random() * modes.length)];
    }

    switch (activeMode) {
      case 'word':
        return this.generateWordQuestion();
      case 'order':
        return this.generateOrderQuestion();
      case 'letter':
      default:
        return this.generateLetterQuestion();
    }
  }

  /**
   * Mode 1: Letter Recognition ("Find the letter A!")
   */
  generateLetterQuestion() {
    const available = alphabetList.slice(0, this.maxLetterRange);
    const target = available[Math.floor(Math.random() * available.length)];

    const distractors = new Set();
    distractors.add(target.letter);

    while (distractors.size < 3) {
      const randItem = available[Math.floor(Math.random() * available.length)];
      distractors.add(randItem.letter);
    }

    const choices = this.shuffle(Array.from(distractors));

    return {
      type: 'letter',
      targetItem: target,
      answer: target.letter,
      choices,
      prompt: `哪個是字母 ${target.letter}？`,
      subPrompt: `${target.letter} is for ${target.word}`,
      visualIcon: target.icon,
      visualText: target.word
    };
  }

  /**
   * Mode 2: Word & Picture Matching ("🐶 是哪一個單字？")
   */
  generateWordQuestion() {
    const available = alphabetList.slice(0, this.maxLetterRange);
    const target = available[Math.floor(Math.random() * available.length)];

    const distractors = new Set();
    distractors.add(target.word);

    while (distractors.size < 3) {
      const randItem = available[Math.floor(Math.random() * available.length)];
      distractors.add(randItem.word);
    }

    const choices = this.shuffle(Array.from(distractors));

    return {
      type: 'word',
      targetItem: target,
      answer: target.word,
      choices,
      prompt: `${target.icon} 的英文單字是？`,
      subPrompt: `${target.letter} for ${target.word}`,
      visualIcon: target.icon,
      visualText: target.letter
    };
  }

  /**
   * Mode 3: Alphabet Sequence ("A  B  C  ?")
   */
  generateOrderQuestion() {
    const maxStart = Math.min(22, this.maxLetterRange - 4);
    const startIdx = this.getRandomInt(0, Math.max(0, maxStart));
    const seq = [
      alphabetList[startIdx],
      alphabetList[startIdx + 1],
      alphabetList[startIdx + 2],
      alphabetList[startIdx + 3]
    ];

    const answer = seq[3].letter;
    const distractors = new Set();
    distractors.add(answer);

    while (distractors.size < 3) {
      const randIdx = this.getRandomInt(0, alphabetList.length - 1);
      distractors.add(alphabetList[randIdx].letter);
    }

    const choices = this.shuffle(Array.from(distractors));
    const seqDisplay = `${seq[0].letter}  ${seq[1].letter}  ${seq[2].letter}  ?`;

    return {
      type: 'order',
      targetItem: seq[3],
      answer: answer,
      choices,
      prompt: seqDisplay,
      subPrompt: '下一個字母是什麼？',
      visualIcon: seq[3].icon,
      visualSequence: [seq[0].letter, seq[1].letter, seq[2].letter]
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QuestionEngine };
}
