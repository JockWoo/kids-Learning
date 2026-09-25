/**
 * MiniGameEngine - Shared Session & Results Controller for Mini-Games
 */
class MiniGameEngine {
  constructor() {
    this.currentGameId = null;
    this.sessionTotalChallenges = 3;
    this.currentChallengeIndex = 0;
    this.correctCount = 0;
    this.starTotal = 0;
    this.sessionStartTime = null;
    this.challengeStartTime = null;
    this.resultsLog = [];
  }

  startSession(gameId, totalChallenges = 3) {
    this.currentGameId = gameId;
    this.sessionTotalChallenges = totalChallenges;
    this.currentChallengeIndex = 0;
    this.correctCount = 0;
    this.starTotal = 0;
    this.sessionStartTime = Date.now();
    this.resultsLog = [];
  }

  startChallenge() {
    this.challengeStartTime = Date.now();
  }

  recordAttempt(challenge, isCorrect, attemptCount = 1) {
    const responseTime = ((Date.now() - (this.challengeStartTime || Date.now())) / 1000).toFixed(1);
    
    if (isCorrect) {
      this.correctCount++;
    }

    const logEntry = {
      gameId: this.currentGameId,
      challengeId: challenge.id,
      skillId: challenge.skillId,
      difficulty: challenge.difficulty,
      correct: isCorrect,
      responseTime: parseFloat(responseTime),
      attemptCount: attemptCount,
      timestamp: Date.now()
    };

    this.resultsLog.push(logEntry);
    return logEntry;
  }

  completeSession() {
    const ratio = this.correctCount / this.sessionTotalChallenges;
    let starsEarned = 1;
    if (ratio >= 1.0) starsEarned = 5;
    else if (ratio >= 0.8) starsEarned = 4;
    else if (ratio >= 0.6) starsEarned = 3;
    else if (ratio >= 0.4) starsEarned = 2;

    this.starTotal = starsEarned;

    // Save to StorageEngine if available
    if (typeof StorageEngine !== 'undefined') {
      try {
        StorageEngine.recordSessionResult(starsEarned, this.sessionTotalChallenges);
      } catch (e) {
        console.warn('StorageEngine record failed:', e);
      }
    }

    return {
      gameId: this.currentGameId,
      total: this.sessionTotalChallenges,
      correct: this.correctCount,
      stars: starsEarned,
      logs: this.resultsLog
    };
  }

  static speakMandarin(text, rate = 0.65) {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'zh-TW';
        utter.rate = rate;
        utter.pitch = 1.05;
        window.speechSynthesis.speak(utter);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MiniGameEngine };
}
