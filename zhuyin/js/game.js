/**
 * Little Zhuyin Explorer — Game Engine
 */

var getQEngineHelper = (typeof QuestionEngine !== 'undefined')
  ? QuestionEngine
  : (typeof require !== 'undefined' ? require('./question-engine.js').QuestionEngine : null);

var getSEngineHelper = (typeof StorageEngine !== 'undefined')
  ? StorageEngine
  : (typeof require !== 'undefined' ? require('./storage.js').StorageEngine : null);

class GameEngine {
  constructor(options = {}) {
    const defaultSettings = getSEngineHelper ? getSEngineHelper.getSettings() : { soundEnabled: true, maxRange: 4, questionsPerSession: 10 };
    this.settings = options.settings || defaultSettings;
    const QEngineClass = getQEngineHelper || QuestionEngine;
    this.questionEngine = new QEngineClass({ maxRange: this.settings.maxRange });
    this.resetState();
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.questionEngine.setMaxRange(this.settings.maxRange);
  }

  resetState() {
    this.mode = 'symbol';
    this.currentQuestionIndex = 0;
    this.totalQuestions = this.settings.questionsPerSession || 10;
    this.correctCount = 0;
    this.incorrectAttempts = 0;
    this.currentQuestion = null;
    this.isAnsweringLocked = false;
    this.state = 'HOME';
  }

  startSession(mode = 'symbol') {
    this.resetState();
    this.mode = mode;
    this.state = 'PLAYING';
    return this.nextQuestion();
  }

  nextQuestion() {
    if (this.currentQuestionIndex >= this.totalQuestions) {
      this.state = 'COMPLETED';
      if (getSEngineHelper) {
        const summary = this.getScoreSummary();
        getSEngineHelper.recordSessionResult(summary.stars, this.totalQuestions);
      }
      return null;
    }

    this.currentQuestionIndex++;
    this.incorrectAttempts = 0;
    this.isAnsweringLocked = false;
    this.state = 'PLAYING';

    this.currentQuestion = this.questionEngine.generateQuestion(this.mode);
    return this.currentQuestion;
  }

  submitAnswer(choice) {
    if (this.isAnsweringLocked || !this.currentQuestion) {
      return null;
    }

    const isCorrect = choice === this.currentQuestion.answer;

    if (isCorrect) {
      this.isAnsweringLocked = true;
      this.correctCount++;
      const isComplete = this.currentQuestionIndex >= this.totalQuestions;
      return {
        isCorrect: true,
        correctAnswer: this.currentQuestion.answer,
        isSessionComplete: isComplete,
        score: this.correctCount,
        total: this.totalQuestions
      };
    } else {
      this.incorrectAttempts++;
      return {
        isCorrect: false,
        correctAnswer: this.currentQuestion.answer,
        attempts: this.incorrectAttempts
      };
    }
  }

  getScoreSummary() {
    const ratio = this.correctCount / this.totalQuestions;
    let stars = 1;
    let message = '再試一次，你會越來越厲害！';

    if (ratio >= 1.0) {
      stars = 5;
      message = '🎉 完美滿分！獲得 5 顆星！你是注音小高手！';
    } else if (ratio >= 0.8) {
      stars = 4;
      message = '🌟 太棒了！獲得 4 顆星！做得非常好！';
    } else if (ratio >= 0.6) {
      stars = 3;
      message = '⭐ 很好！獲得 3 顆星！繼續加油！';
    } else if (ratio >= 0.4) {
      stars = 2;
      message = '👍 不錯喔！獲得 2 顆星！再接再厲！';
    } else {
      stars = 1;
      message = '💪 獲得 1 顆星！多練習會更厲害！';
    }

    return {
      correctCount: this.correctCount,
      totalQuestions: this.totalQuestions,
      stars,
      message
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GameEngine };
}
