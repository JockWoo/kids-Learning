/**
 * Little Math Explorer — Game Engine (English Edition)
 */

var getQEngineHelper = (typeof QuestionEngine !== 'undefined')
  ? QuestionEngine
  : (typeof require !== 'undefined' ? require('./question-engine.js').QuestionEngine : null);

var getSEngineHelper = (typeof StorageEngine !== 'undefined')
  ? StorageEngine
  : (typeof require !== 'undefined' ? require('./storage.js').StorageEngine : null);

class GameEngine {
  constructor(options = {}) {
    const defaultSettings = getSEngineHelper ? getSEngineHelper.getSettings() : { soundEnabled: true, maxLetterRange: 26, questionsPerSession: 10, speechRate: 0.65 };
    this.settings = options.settings || defaultSettings;
    const QEngineClass = getQEngineHelper || QuestionEngine;
    this.questionEngine = new QEngineClass({ maxRange: this.settings.maxLetterRange });
    this.resetState();
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    if (this.questionEngine) {
      if (typeof this.questionEngine.setMaxLetterRange === 'function') {
        this.questionEngine.setMaxLetterRange(this.settings.maxLetterRange || 26);
      } else if (typeof this.questionEngine.setMaxRange === 'function') {
        this.questionEngine.setMaxRange(this.settings.maxLetterRange || 26);
      }
    }
  }

  resetState() {
    this.mode = 'addition';
    this.currentQuestionIndex = 0;
    this.totalQuestions = this.settings.questionsPerSession || 10;
    this.correctCount = 0;
    this.incorrectAttempts = 0;
    this.currentQuestion = null;
    this.isAnsweringLocked = false;
    this.state = 'HOME';
  }

  startSession(mode = 'addition') {
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
    let message = 'Great try! You are getting better!';

    if (ratio >= 1.0) {
      stars = 5;
      message = '🎉 Perfect Score! You got 5 Stars! You are an ABC Super Star!';
    } else if (ratio >= 0.8) {
      stars = 4;
      message = '🌟 Great Job! You got 4 Stars! Excellent work!';
    } else if (ratio >= 0.6) {
      stars = 3;
      message = '⭐ Well Done! You got 3 Stars! Keep it up!';
    } else if (ratio >= 0.4) {
      stars = 2;
      message = '👍 Good Effort! You got 2 Stars!';
    } else {
      stars = 1;
      message = '💪 You got 1 Star! Practice makes perfect!';
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
