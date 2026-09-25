/**
 * Little Alphabet Explorer — English ABC Game App
 */

document.addEventListener('DOMContentLoaded', () => {
  const audio = new AudioEngine();
  const game = new GameEngine();

  audio.setEnabled(game.settings.soundEnabled);

  // Browser Speech Synthesis for English Phonics (Slow & Clear for 5yo)
  function speak(text) {
    if ('speechSynthesis' in window && game.settings.soundEnabled) {
      try {
        window.speechSynthesis.cancel();
        // Insert small pauses so letters and words don't blend together
        const formattedText = String(text).replace(/, for /g, ' ... for ... ');
        const utter = new SpeechSynthesisUtterance(formattedText);
        utter.lang = 'en-US';
        utter.rate = game.settings.speechRate || 0.65;
        utter.pitch = 1.05;
        window.speechSynthesis.speak(utter);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }
  }

  const views = {
    home: document.getElementById('view-home'),
    game: document.getElementById('view-game'),
    result: document.getElementById('view-result')
  };

  const soundBtn = document.getElementById('btn-sound-toggle');
  const parentBtn = document.getElementById('btn-parent-settings');
  const parentModal = document.getElementById('modal-parent-settings');
  const closeModalBtn = document.getElementById('btn-close-modal');

  // Star Header Badge Manager
  const headerTotalStars = document.getElementById('header-total-stars');

  function updateStarsAndRewardUI() {
    const stats = StorageEngine.getStats();
    const total = stats.totalStars || 0;
    if (headerTotalStars) headerTotalStars.textContent = total;
  }

  const progressText = document.getElementById('progress-text');
  const scoreStarsText = document.getElementById('score-stars-text');
  const visualContainer = document.getElementById('visual-container');
  const equationText = document.getElementById('equation-text');
  const subPromptText = document.getElementById('sub-prompt-text');
  const choicesContainer = document.getElementById('choices-container');
  const feedbackBanner = document.getElementById('feedback-banner');
  const feedbackText = document.getElementById('feedback-text');

  const resultStars = document.getElementById('result-stars');
  const resultScore = document.getElementById('result-score');
  const resultMessage = document.getElementById('result-message');
  const btnReplay = document.getElementById('btn-replay');
  const btnHome = document.getElementById('btn-home');

  const rangeSegment = document.getElementById('segment-range');
  const lengthSegment = document.getElementById('segment-length');

  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  function resizeCanvas() {
    if (canvas) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function showView(viewName) {
    Object.keys(views).forEach(key => {
      if (views[key]) {
        views[key].classList.toggle('active', key === viewName);
      }
    });
  }

  let confettiParticles = [];
  function launchConfetti() {
    if (!ctx) return;
    resizeCanvas();
    const colors = ['#FF4757', '#2ED573', '#1E90FF', '#FFA502', '#9B59B6'];
    confettiParticles = [];
    for (let i = 0; i < 40; i++) {
      confettiParticles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.7) * 10,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10
      });
    }

    let frame = 0;
    function animateConfetti() {
      if (frame > 60) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.rotation += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      frame++;
      requestAnimationFrame(animateConfetti);
    }
    animateConfetti();
  }

  function updateSoundUI() {
    if (soundBtn) {
      soundBtn.textContent = game.settings.soundEnabled ? '🔊' : '🔇';
    }
  }
  updateSoundUI();

  soundBtn.addEventListener('click', () => {
    const newState = !game.settings.soundEnabled;
    game.updateSettings({ soundEnabled: newState });
    StorageEngine.saveSettings({ soundEnabled: newState });
    audio.setEnabled(newState);
    if (newState) audio.playClick();
    updateSoundUI();
  });

  parentBtn.addEventListener('click', () => {
    audio.playClick();
    parentModal.classList.add('active');
  });

  closeModalBtn.addEventListener('click', () => {
    audio.playClick();
    parentModal.classList.remove('active');
  });

  parentModal.addEventListener('click', (e) => {
    if (e.target === parentModal) {
      parentModal.classList.remove('active');
    }
  });

  const modalToast = document.getElementById('modal-toast');
  const summaryRangeText = document.getElementById('summary-range-text');
  const summaryLengthText = document.getElementById('summary-length-text');

  function showModalToast(msg) {
    if (!modalToast) return;
    modalToast.textContent = msg;
    modalToast.classList.add('show');
    setTimeout(() => {
      modalToast.classList.remove('show');
    }, 1500);
  }

  function updateSummaryDisplay() {
    if (summaryRangeText) summaryRangeText.textContent = game.settings.maxLetterRange === 10 ? 'A–J (前10個)' : 'A–Z (全26個)';
    if (summaryLengthText) summaryLengthText.textContent = `${game.settings.questionsPerSession} 題`;
  }

  function updateSegmentActive(container, val) {
    if (!container) return;
    const btns = container.querySelectorAll('button');
    btns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-value') === String(val));
    });
  }

  const speedSegment = document.getElementById('segment-speed');

  updateSegmentActive(rangeSegment, game.settings.maxLetterRange);
  updateSegmentActive(lengthSegment, game.settings.questionsPerSession);
  updateSegmentActive(speedSegment, game.settings.speechRate || 0.65);
  updateSummaryDisplay();

  if (rangeSegment) {
    rangeSegment.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn) {
        const val = parseInt(btn.getAttribute('data-value'), 10);
        game.updateSettings({ maxLetterRange: val });
        StorageEngine.saveSettings({ maxLetterRange: val });
        updateSegmentActive(rangeSegment, val);
        updateSummaryDisplay();
        audio.playClick();
        showModalToast(`✅ 已切換字母範圍：${val === 10 ? 'A–J' : 'A–Z'}`);
      }
    });
  }

  if (speedSegment) {
    speedSegment.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn) {
        const val = parseFloat(btn.getAttribute('data-value'));
        game.updateSettings({ speechRate: val });
        StorageEngine.saveSettings({ speechRate: val });
        updateSegmentActive(speedSegment, val);
        audio.playClick();
        showModalToast(`✅ 已設定發音語速：${val}x`);
        speak('A for Apple');
      }
    });
  }

  if (lengthSegment) {
    lengthSegment.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn) {
        const val = parseInt(btn.getAttribute('data-value'), 10);
        game.updateSettings({ questionsPerSession: val });
        StorageEngine.saveSettings({ questionsPerSession: val });
        updateSegmentActive(lengthSegment, val);
        updateSummaryDisplay();
        audio.playClick();
        showModalToast(`✅ 已切換題數：${val} 題`);
      }
    });
  }

  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      const mode = card.getAttribute('data-mode');
      audio.playClick();
      startNewGame(mode);
    });
  });

  function startNewGame(mode) {
    showView('game');
    game.startSession(mode);
    renderCurrentQuestion();
  }

  function renderCurrentQuestion() {
    const q = game.currentQuestion;
    if (!q) return;

    progressText.textContent = `第 ${game.currentQuestionIndex} / ${game.totalQuestions} 題`;
    scoreStarsText.textContent = `⭐ ${game.correctCount}`;

    feedbackBanner.classList.remove('show', 'retry');
    equationText.textContent = q.prompt;
    if (subPromptText) subPromptText.textContent = q.subPrompt || '';

    // Render visual helper
    visualContainer.innerHTML = '';
    if (q.type === 'letter') {
      visualContainer.innerHTML = `
        <div class="abc-visual-box">
          <span class="abc-visual-icon">${q.visualIcon}</span>
          <span class="abc-visual-word">${q.visualText}</span>
        </div>
      `;
      speak(`${q.targetItem.letter}, for ${q.targetItem.word}`);
    } else if (q.type === 'word') {
      visualContainer.innerHTML = `
        <div class="abc-visual-box">
          <span class="abc-visual-icon" style="font-size: 5rem;">${q.visualIcon}</span>
        </div>
      `;
      speak(q.targetItem.word);
    } else if (q.type === 'order') {
      visualContainer.innerHTML = `
        <div class="abc-seq-box">
          ${q.visualSequence.map(l => `<span class="seq-item">${l}</span>`).join('')}
          <span class="seq-item question-mark">?</span>
        </div>
      `;
    }

    choicesContainer.innerHTML = '';
    q.choices.forEach(choiceVal => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      if (String(choiceVal).length > 3) {
        btn.classList.add('long-text');
      }
      btn.textContent = choiceVal;

      btn.addEventListener('click', () => {
        handleChoiceSelection(btn, choiceVal);
      });

      choicesContainer.appendChild(btn);
    });
  }

  let isSpeechUnlocked = false;
  function unlockSpeechAndAudio() {
    audio.unlockAudio();
    if (!isSpeechUnlocked && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const silentUtterance = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(silentUtterance);
        isSpeechUnlocked = true;
      } catch (e) {}
    }
  }
  window.addEventListener('touchstart', unlockSpeechAndAudio, { passive: true });
  window.addEventListener('click', unlockSpeechAndAudio, { passive: true });

  function handleChoiceSelection(buttonEl, choiceVal) {
    if (game.isAnsweringLocked) return;
    unlockSpeechAndAudio();

    const result = game.submitAnswer(choiceVal);
    if (!result) return;

    if (result.isCorrect) {
      buttonEl.classList.add('correct');
      audio.playCorrect();
      launchConfetti();

      const item = game.currentQuestion.targetItem;
      speak(item ? item.word : choiceVal);

      const praises = ['🎉 太棒啦！', 'Great Job!', '你好厲害！', '⭐ Super Star!'];
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];
      feedbackText.textContent = randomPraise;
      feedbackBanner.classList.remove('retry');
      feedbackBanner.classList.add('show');

      setTimeout(() => {
        if (result.isSessionComplete) {
          showResultScreen();
        } else {
          game.nextQuestion();
          renderCurrentQuestion();
        }
      }, 1000);
    } else {
      buttonEl.classList.add('shake');
      audio.playIncorrect();

      feedbackText.textContent = '差一點點！再試一次 🙂';
      feedbackBanner.classList.add('show', 'retry');

      setTimeout(() => {
        buttonEl.classList.remove('shake');
      }, 500);
    }
  }

  function showView(viewName) {
    Object.keys(views).forEach(v => {
      if (views[v]) views[v].classList.remove('active');
    });
    if (views[viewName]) {
      views[viewName].classList.add('active');
    }
    updateStarsAndRewardUI();
  }

  function showResultScreen() {
    const summary = game.getScoreSummary();
    const stats = StorageEngine.recordSessionResult(summary.stars, summary.totalQuestions);

    showView('result');
    audio.playComplete();
    launchConfetti();

    resultStars.textContent = '⭐'.repeat(summary.stars);
    resultScore.textContent = `答對 ${summary.correctCount} / ${summary.totalQuestions} 題`;
    resultMessage.textContent = summary.message;

    const resTotal = document.getElementById('result-total-stars-text');
    if (resTotal) resTotal.textContent = `⭐ 本次獲得 ${summary.stars} 顆星！總共累積：${stats.totalStars} 顆星`;
    updateStarsAndRewardUI();

    speak(`Congratulations! You earned ${summary.stars} stars! ${summary.message}`);
  }

  btnReplay.addEventListener('click', () => {
    audio.playClick();
    startNewGame(game.mode);
  });

  btnHome.addEventListener('click', () => {
    audio.playClick();
    showView('home');
  });

  const brandTitle = document.getElementById('btn-brand-title');
  if (brandTitle) {
    brandTitle.addEventListener('click', () => {
      audio.playClick();
      showView('home');
    });
  }
});
