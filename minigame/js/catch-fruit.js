/**
 * CatchFruitGame - 🍎 接水果 小遊戲
 * Designed for 5-year-old toddlers (Touch/Drag First, Instant Clarity)
 */
class CatchFruitGame {
  constructor(stageEl, engine, audio) {
    this.stageEl = stageEl;
    this.engine = engine;
    this.audio = audio;
    
    this.basketEl = null;
    this.promptEl = null;
    this.currentChallenge = null;
    this.basketX = 50; // percentage
    this.targetCount = 5;
    this.currentCaughtCount = 0;
    this.fallingInterval = null;
    this.activeFruits = [];
    this.isGameActive = false;
    this.onCompleteCallback = null;

    this.bindTouchControls();
  }

  bindTouchControls() {
    if (!this.stageEl) return;

    const moveBasket = (clientX) => {
      if (!this.isGameActive || !this.stageEl) return;
      const rect = this.stageEl.getBoundingClientRect();
      let percent = ((clientX - rect.left) / rect.width) * 100;
      percent = Math.max(10, Math.min(90, percent));
      this.basketX = percent;
      if (this.basketEl) {
        this.basketEl.style.left = `${this.basketX}%`;
      }
    };

    this.stageEl.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) moveBasket(e.touches[0].clientX);
    }, { passive: true });

    this.stageEl.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) moveBasket(e.touches[0].clientX);
    }, { passive: true });

    this.stageEl.addEventListener('mousemove', (e) => {
      moveBasket(e.clientX);
    });
  }

  startChallenge(challenge, onComplete) {
    this.currentChallenge = challenge;
    this.onCompleteCallback = onComplete;
    this.currentCaughtCount = 0;
    this.activeFruits = [];
    this.isGameActive = true;

    this.engine.startChallenge();
    this.renderStage();
    this.startFallingLoop();
  }

  renderStage() {
    this.stageEl.innerHTML = '';

    // Prompt Bar
    this.promptEl = document.createElement('div');
    this.promptEl.className = 'catch-prompt-bar';
    
    let speechText = '';

    if (this.currentChallenge.skillId === 'addition') {
      this.targetCount = 1; // 1 correct catch needed
      const cleanPrompt = this.currentChallenge.prompt.replace('=', '等於').replace('+', '加');
      speechText = `算算看：${cleanPrompt}！接住正確數字的水果！`;
      this.promptEl.innerHTML = `<span>算算看：</span> <strong>${this.currentChallenge.prompt}</strong> <button class="speech-btn" id="btn-speak-prompt" style="background:none; border:none; font-size:1.4rem; cursor:pointer; margin-left:8px;">🔊</button>`;
    } else {
      this.targetCount = Math.min(5, Math.max(3, this.currentChallenge.targetValue || 4));
      speechText = `接到 ${this.targetCount} 顆水果！`;
      this.promptEl.innerHTML = `<span>接到 ${this.targetCount} 顆 ${this.currentChallenge.icon}</span> <strong id="catch-progress">0 / ${this.targetCount}</strong> <button class="speech-btn" id="btn-speak-prompt" style="background:none; border:none; font-size:1.4rem; cursor:pointer; margin-left:8px;">🔊</button>`;
    }
    this.stageEl.appendChild(this.promptEl);

    // Automatic Voice Speech Explanation for 5yo
    MiniGameEngine.speakMandarin(speechText);

    // Re-speak button listener
    const speakBtn = this.promptEl.querySelector('#btn-speak-prompt');
    if (speakBtn) {
      speakBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        MiniGameEngine.speakMandarin(speechText);
      });
    }

    // Basket
    this.basketEl = document.createElement('div');
    this.basketEl.className = 'catch-basket';
    this.basketEl.innerHTML = '🧺';
    this.basketEl.style.left = `${this.basketX}%`;
    this.stageEl.appendChild(this.basketEl);
  }

  startFallingLoop() {
    if (this.fallingInterval) clearInterval(this.fallingInterval);

    this.fallingInterval = setInterval(() => {
      if (!this.isGameActive) return;
      this.spawnFruit();
    }, 1200);

    // Physics Animation Loop
    let lastTime = Date.now();
    const updatePhysics = () => {
      if (!this.isGameActive) return;
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      this.updateFallingFruits(dt);
      requestAnimationFrame(updatePhysics);
    };
    requestAnimationFrame(updatePhysics);
  }

  spawnFruit() {
    const isTarget = Math.random() < 0.65;
    const fruitsList = ['🍎', '🍌', '🍊', '🍓', '🍇'];
    let icon = this.currentChallenge.icon || '🍎';
    let badgeText = null;

    if (this.currentChallenge.skillId === 'addition') {
      if (isTarget) {
        badgeText = this.currentChallenge.correctAnswer;
      } else {
        const wrongChoice = this.currentChallenge.choices.find(c => c !== this.currentChallenge.correctAnswer) || 3;
        badgeText = wrongChoice;
      }
    } else {
      if (!isTarget) {
        icon = fruitsList.find(f => f !== this.currentChallenge.icon) || '🍌';
      }
    }

    const fruitEl = document.createElement('div');
    fruitEl.className = 'falling-fruit';
    fruitEl.innerHTML = `<span class="falling-fruit-icon">${icon}</span>` + 
                        (badgeText !== null ? `<span class="falling-fruit-badge">${badgeText}</span>` : '');
    
    const x = Math.random() * 80 + 10; // 10% to 90%
    fruitEl.style.left = `${x}%`;
    fruitEl.style.top = '-80px';
    this.stageEl.appendChild(fruitEl);

    this.activeFruits.push({
      el: fruitEl,
      x: x,
      y: -80,
      speed: Math.random() * 120 + 180, // pixels per second
      isTarget: isTarget,
      badgeText: badgeText,
      icon: icon
    });
  }

  updateFallingFruits(dt) {
    const stageHeight = this.stageEl.clientHeight || 400;

    for (let i = this.activeFruits.length - 1; i >= 0; i--) {
      const f = this.activeFruits[i];
      f.y += f.speed * dt;
      f.el.style.top = `${f.y}px`;

      // Collision Check with Basket at bottom (around stageHeight - 90px)
      const basketY = stageHeight - 90;
      if (f.y >= basketY && f.y <= basketY + 40) {
        const dist = Math.abs(f.x - this.basketX);
        if (dist < 14) { // Caught!
          this.handleCaughtFruit(f, i);
          continue;
        }
      }

      // Out of bounds
      if (f.y > stageHeight + 40) {
        f.el.remove();
        this.activeFruits.splice(i, 1);
      }
    }
  }

  handleCaughtFruit(fruit, index) {
    fruit.el.remove();
    this.activeFruits.splice(index, 1);

    let isCorrect = false;
    if (this.currentChallenge.skillId === 'addition') {
      isCorrect = (fruit.badgeText === this.currentChallenge.correctAnswer);
    } else {
      isCorrect = (fruit.icon === this.currentChallenge.icon);
    }

    if (isCorrect) {
      if (this.audio) this.audio.playCorrect();
      this.currentCaughtCount++;

      // Update UI Progress
      const prog = document.getElementById('catch-progress');
      if (prog) prog.textContent = `${this.currentCaughtCount} / ${this.targetCount}`;

      if (this.currentCaughtCount >= this.targetCount) {
        this.finishChallenge(true);
      }
    } else {
      if (this.audio) this.audio.playIncorrect();
    }
  }

  finishChallenge(isCorrect) {
    this.isGameActive = false;
    if (this.fallingInterval) clearInterval(this.fallingInterval);

    this.engine.recordAttempt(this.currentChallenge, isCorrect, 1);

    setTimeout(() => {
      if (this.onCompleteCallback) this.onCompleteCallback(isCorrect);
    }, 600);
  }

  destroy() {
    this.isGameActive = false;
    if (this.fallingInterval) clearInterval(this.fallingInterval);
    if (this.stageEl) this.stageEl.innerHTML = '';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CatchFruitGame };
}
