/**
 * FeedMonsterGame - 🐲 餵怪獸 小遊戲
 * Designed for 5-year-old toddlers (Drag & Touch First)
 */
class FeedMonsterGame {
  constructor(stageEl, engine, audio) {
    this.stageEl = stageEl;
    this.engine = engine;
    this.audio = audio;

    this.monsterEl = null;
    this.currentChallenge = null;
    this.targetCount = 5;
    this.fedCount = 0;
    this.onCompleteCallback = null;
    this.isGameActive = false;
  }

  startChallenge(challenge, onComplete) {
    this.currentChallenge = challenge;
    this.onCompleteCallback = onComplete;
    this.fedCount = 0;
    this.isGameActive = true;

    if (this.currentChallenge.skillId === 'addition') {
      this.targetCount = this.currentChallenge.correctAnswer || 5;
    } else {
      this.targetCount = Math.min(6, Math.max(3, this.currentChallenge.targetValue || 4));
    }

    this.engine.startChallenge();
    this.renderStage();
  }

  renderStage() {
    this.stageEl.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'monster-stage';

    let speechText = '';

    // Prompt Header
    const promptEl = document.createElement('div');
    promptEl.className = 'monster-prompt';
    if (this.currentChallenge.skillId === 'addition') {
      const cleanPrompt = this.currentChallenge.prompt.replace('=', '等於').replace('+', '加');
      speechText = `怪獸想吃：${cleanPrompt} 顆水果！`;
      promptEl.innerHTML = `🐲 怪獸想吃 <strong>${this.currentChallenge.prompt}</strong> 顆水果！ <button class="speech-btn" id="btn-speak-prompt" style="background:none; border:none; font-size:1.4rem; cursor:pointer; margin-left:8px;">🔊</button>`;
    } else {
      speechText = `怪獸說：我想吃 ${this.targetCount} 顆水果！`;
      promptEl.innerHTML = `🐲 我想吃 <strong>${this.targetCount}</strong> 顆水果 ${this.currentChallenge.icon || '🍓'}！ (<span id="monster-counter">0 / ${this.targetCount}</span>) <button class="speech-btn" id="btn-speak-prompt" style="background:none; border:none; font-size:1.4rem; cursor:pointer; margin-left:8px;">🔊</button>`;
    }
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

    // Monster Graphic
    this.monsterEl = document.createElement('div');
    this.monsterEl.className = 'monster-character';
    this.monsterEl.innerHTML = '🐲';
    container.appendChild(this.monsterEl);

    // Food Tray
    const tray = document.createElement('div');
    tray.className = 'food-tray';

    const foodCount = Math.max(this.targetCount + 2, 6);
    for (let i = 0; i < foodCount; i++) {
      const food = document.createElement('div');
      food.className = 'food-item';
      food.innerHTML = this.currentChallenge.icon || '🍓';

      // Touch / Click Handler
      food.addEventListener('click', () => {
        if (!this.isGameActive || food.classList.contains('eaten')) return;
        this.feedItem(food);
      });

      // Pointer / Touch Drag Handler
      this.bindDragToFeed(food);
      tray.appendChild(food);
    }

    container.appendChild(tray);
    this.stageEl.appendChild(container);
  }

  bindDragToFeed(foodEl) {
    let startX = 0, startY = 0;
    let isDragging = false;

    const onStart = (clientX, clientY) => {
      if (!this.isGameActive || foodEl.classList.contains('eaten')) return;
      isDragging = true;
      startX = clientX;
      startY = clientY;
      foodEl.style.position = 'relative';
      foodEl.style.zIndex = '100';
    };

    const onMove = (clientX, clientY) => {
      if (!isDragging) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      foodEl.style.transform = `translate(${dx}px, ${dy}px) scale(1.1)`;

      // Check distance to monster
      if (this.monsterEl) {
        const mRect = this.monsterEl.getBoundingClientRect();
        if (clientX >= mRect.left && clientX <= mRect.right && clientY >= mRect.top && clientY <= mRect.bottom) {
          isDragging = false;
          foodEl.style.transform = 'none';
          this.feedItem(foodEl);
        }
      }
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      foodEl.style.transform = 'none';
      foodEl.style.position = 'static';
    };

    foodEl.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) onStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    foodEl.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    foodEl.addEventListener('touchend', onEnd);
  }

  feedItem(foodEl) {
    foodEl.classList.add('eaten');
    foodEl.style.visibility = 'hidden';

    // Monster Chewing Animation
    if (this.monsterEl) {
      this.monsterEl.classList.add('eating');
      this.monsterEl.innerHTML = '😋';
      setTimeout(() => {
        if (this.monsterEl) {
          this.monsterEl.classList.remove('eating');
          this.monsterEl.innerHTML = '🐲';
        }
      }, 400);
    }

    if (this.audio) this.audio.playCorrect();
    this.fedCount++;

    const counter = document.getElementById('monster-counter');
    if (counter) counter.textContent = `${this.fedCount} / ${this.targetCount}`;

    if (this.fedCount >= this.targetCount) {
      this.isGameActive = false;
      this.engine.recordAttempt(this.currentChallenge, true, 1);

      setTimeout(() => {
        if (this.onCompleteCallback) this.onCompleteCallback(true);
      }, 600);
    }
  }

  destroy() {
    this.isGameActive = false;
    if (this.stageEl) this.stageEl.innerHTML = '';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FeedMonsterGame };
}
