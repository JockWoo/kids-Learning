/**
 * Little Zhuyin Explorer — Question Engine
 * Generates Zhuyin recognition, picture matching, and sequence questions dynamically without consecutive repeats.
 */

var getZhuyinHelper = (typeof getRandomZhuyinItem !== 'undefined')
  ? getRandomZhuyinItem
  : (typeof require !== 'undefined' ? require('./zhuyin-data.js').getRandomZhuyinItem : null);

var zhuyinList = (typeof ZHUYIN_DATA !== 'undefined')
  ? ZHUYIN_DATA
  : (typeof require !== 'undefined' ? require('./zhuyin-data.js').ZHUYIN_DATA : []);

class QuestionEngine {
  constructor(options = {}) {
    this.maxRange = options.maxRange || 11; // Default 11 (ㄅ~ㄏ)
    this.recentQuestions = [];
    this.historyLimit = 4;
  }

  setMaxRange(range) {
    this.maxRange = Math.min(37, Math.max(4, range));
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

  isRecentQuestion(sig) {
    return this.recentQuestions.includes(sig);
  }

  recordQuestion(sig) {
    this.recentQuestions.push(sig);
    if (this.recentQuestions.length > this.historyLimit) {
      this.recentQuestions.shift();
    }
  }

  generateQuestion(mode = 'symbol') {
    let activeMode = mode;
    if (mode === 'challenge') {
      const modes = ['symbol', 'picture', 'sequence'];
      activeMode = modes[Math.floor(Math.random() * modes.length)];
    }

    switch (activeMode) {
      case 'picture':
        return this.generatePictureQuestion();
      case 'sequence':
        return this.generateSequenceQuestion();
      case 'symbol':
      default:
        return this.generateSymbolQuestion();
    }
  }

  /**
   * Mode 1: Symbol Recognition ("哪個是注音 ㄅ？")
   */
  generateSymbolQuestion() {
    const available = zhuyinList.slice(0, this.maxRange);
    let target, sig;
    let attempts = 0;

    do {
      target = available[Math.floor(Math.random() * available.length)];
      sig = `sym_${target.symbol}`;
      attempts++;
    } while (this.isRecentQuestion(sig) && attempts < 10 && available.length > 2);

    this.recordQuestion(sig);

    const distractors = new Set();
    distractors.add(target.symbol);

    while (distractors.size < 3) {
      const randItem = available[Math.floor(Math.random() * available.length)];
      distractors.add(randItem.symbol);
    }

    const choices = this.shuffle(Array.from(distractors));

    return {
      type: 'symbol',
      targetItem: target,
      answer: target.symbol,
      choices,
      prompt: `哪個是注音「${target.symbol}」？`,
      subPrompt: `「${target.symbol}」 ${target.word} ${target.icon}`,
      visualIcon: target.icon,
      visualText: target.word
    };
  }

  /**
   * Mode 2: Picture Matching ("🎒 包包 的開頭注音是？")
   */
  generatePictureQuestion() {
    const available = zhuyinList.slice(0, this.maxRange);
    let target, sig;
    let attempts = 0;

    do {
      target = available[Math.floor(Math.random() * available.length)];
      sig = `pic_${target.symbol}`;
      attempts++;
    } while (this.isRecentQuestion(sig) && attempts < 10 && available.length > 2);

    this.recordQuestion(sig);

    const distractors = new Set();
    distractors.add(target.symbol);

    while (distractors.size < 3) {
      const randItem = available[Math.floor(Math.random() * available.length)];
      distractors.add(randItem.symbol);
    }

    const choices = this.shuffle(Array.from(distractors));

    return {
      type: 'picture',
      targetItem: target,
      answer: target.symbol,
      choices,
      prompt: `${target.icon} ${target.word} 的開頭注音是？`,
      subPrompt: `選選看 ${target.word} 的第一聲注音`,
      visualIcon: target.icon,
      visualText: target.symbol
    };
  }

  /**
   * Mode 3: Zhuyin Sequence ("ㄅ  ㄆ  ㄇ  ?")
   */
  generateSequenceQuestion() {
    const maxStart = Math.min(33, Math.max(0, this.maxRange - 4));
    let startIdx, seq, sig;
    let attempts = 0;

    do {
      startIdx = this.getRandomInt(0, Math.max(0, maxStart));
      seq = [
        zhuyinList[startIdx],
        zhuyinList[startIdx + 1],
        zhuyinList[startIdx + 2],
        zhuyinList[startIdx + 3]
      ];
      sig = `seq_${startIdx}`;
      attempts++;
    } while (this.isRecentQuestion(sig) && attempts < 10 && maxStart > 1);

    this.recordQuestion(sig);

    const answer = seq[3].symbol;
    const distractors = new Set();
    distractors.add(answer);

    while (distractors.size < 3) {
      const randIdx = this.getRandomInt(0, zhuyinList.length - 1);
      distractors.add(zhuyinList[randIdx].symbol);
    }

    const choices = this.shuffle(Array.from(distractors));
    const seqDisplay = `${seq[0].symbol}  ${seq[1].symbol}  ${seq[2].symbol}  ?`;

    return {
      type: 'sequence',
      targetItem: seq[3],
      answer: answer,
      choices,
      prompt: seqDisplay,
      subPrompt: '下一個注音符號是什麼？',
      visualIcon: seq[3].icon,
      visualSequence: [seq[0].symbol, seq[1].symbol, seq[2].symbol]
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QuestionEngine };
}
