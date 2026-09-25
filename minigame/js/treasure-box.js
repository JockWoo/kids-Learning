/**
 * TreasureBoxGame - 🔐 寶箱密碼 小遊戲
 * Acts as Challenge, Finale, and Reward Session Complete
 */
class TreasureBoxGame {
  constructor(stageEl, engine, audio) {
    this.stageEl = stageEl;
    this.engine = engine;
    this.audio = audio;

    this.boxEl = null;
    this.currentChallenge = null;
    this.onCompleteCallback = null;
    this.isGameActive = false;
  }

  startChallenge(challenge, onComplete) {
    this.currentChallenge = challenge;
    this.onCompleteCallback = onComplete;
    this.isGameActive = true;

    this.engine.startChallenge();
    this.renderStage();
  }

  renderStage() {
    this.stageEl.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'treasure-stage';

    const cleanPrompt = this.currentChallenge.prompt.replace('=', '等於').replace('+', '加');
    const speechText = `解開寶箱密碼：${cleanPrompt}，按下正確的鑰匙！`;

    // Prompt Header
    const promptEl = document.createElement('div');
    promptEl.className = 'treasure-prompt';
    promptEl.innerHTML = `🏴‍☠️ 寶箱密碼：<strong>${this.currentChallenge.prompt}</strong> <button class="speech-btn" id="btn-speak-prompt" style="background:none; border:none; font-size:1.4rem; cursor:pointer; margin-left:8px;">🔊</button>`;
    container.appendChild(promptEl);

    // Automatic Voice Speech Explanation
    MiniGameEngine.speakMandarin(speechText);

    // Re-speak button listener
    const speakBtn = promptEl.querySelector('#btn-speak-prompt');
    if (speakBtn) {
      speakBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        MiniGameEngine.speakMandarin(speechText);
      });
    }

    // Treasure Chest Graphic
    this.boxEl = document.createElement('div');
    this.boxEl.className = 'treasure-box-graphic';
    this.boxEl.innerHTML = '🔐';
    container.appendChild(this.boxEl);

    // Keys Grid (Choice buttons)
    const keysGrid = document.createElement('div');
    keysGrid.className = 'treasure-keys-grid';

    const choices = this.currentChallenge.choices || [this.currentChallenge.correctAnswer - 1, this.currentChallenge.correctAnswer, this.currentChallenge.correctAnswer + 1];
    
    choices.forEach(val => {
      const keyBtn = document.createElement('button');
      keyBtn.className = 'treasure-key-btn';
      keyBtn.textContent = val;

      keyBtn.addEventListener('click', () => {
        if (!this.isGameActive) return;
        this.submitAnswer(val, keyBtn);
      });

      keysGrid.appendChild(keyBtn);
    });

    container.appendChild(keysGrid);
    this.stageEl.appendChild(container);
  }

  submitAnswer(chosenVal, keyBtn) {
    const isCorrect = (chosenVal === this.currentChallenge.correctAnswer);

    if (isCorrect) {
      this.isGameActive = false;
      if (this.boxEl) {
        this.boxEl.classList.add('unlock');
        this.boxEl.innerHTML = '🔓';
      }
      if (this.audio) this.audio.playComplete();

      this.engine.recordAttempt(this.currentChallenge, true, 1);

      setTimeout(() => {
        if (this.onCompleteCallback) this.onCompleteCallback(true);
      }, 900);
    } else {
      if (this.audio) this.audio.playIncorrect();
      keyBtn.style.transform = 'shake';
      setTimeout(() => {
        keyBtn.style.transform = 'none';
      }, 400);
    }
  }

  destroy() {
    this.isGameActive = false;
    if (this.stageEl) this.stageEl.innerHTML = '';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreasureBoxGame };
}
