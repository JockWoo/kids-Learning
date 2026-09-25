/**
 * Little Math Explorer — Main Application UI Orchestrator
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize engines
  const audio = new AudioEngine();
  const game = new GameEngine();

  // Audio state init
  audio.setEnabled(game.settings.soundEnabled);

  // DOM Element References
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

  // Game UI elements
  const progressText = document.getElementById('progress-text');
  const scoreStarsText = document.getElementById('score-stars-text');
  const visualContainer = document.getElementById('visual-container');
  const equationText = document.getElementById('equation-text');
  const choicesContainer = document.getElementById('choices-container');
  const feedbackBanner = document.getElementById('feedback-banner');
  const feedbackText = document.getElementById('feedback-text');

  // Result elements
  const resultStars = document.getElementById('result-stars');
  const resultScore = document.getElementById('result-score');
  const resultMessage = document.getElementById('result-message');
  const btnReplay = document.getElementById('btn-replay');
  const btnHome = document.getElementById('btn-home');

  // Modal Setting Controls
  const rangeSegment = document.getElementById('segment-range');
  const lengthSegment = document.getElementById('segment-length');

  // Confetti Canvas
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

  // Screen Navigation Helper
  function showView(viewName) {
    Object.keys(views).forEach(key => {
      if (views[key]) {
        views[key].classList.toggle('active', key === viewName);
      }
    });
  }

  // Confetti Burst Effect
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
        p.vy += 0.3; // gravity
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

  // Audio Toggle UI Handler
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

  // Parent Settings Modal Handlers
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
    if (summaryRangeText) summaryRangeText.textContent = `0–${game.settings.maxNumber}`;
    if (summaryLengthText) summaryLengthText.textContent = `${game.settings.questionsPerSession} 題`;
  }

  function updateSegmentActive(container, val) {
    if (!container) return;
    const btns = container.querySelectorAll('button');
    btns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-value') === String(val));
    });
  }

  updateSegmentActive(rangeSegment, game.settings.maxNumber);
  updateSegmentActive(lengthSegment, game.settings.questionsPerSession);
  updateSummaryDisplay();

  if (rangeSegment) {
    rangeSegment.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn) {
        const val = parseInt(btn.getAttribute('data-value'), 10);
        game.updateSettings({ maxNumber: val });
        StorageEngine.saveSettings({ maxNumber: val });
        updateSegmentActive(rangeSegment, val);
        updateSummaryDisplay();
        audio.playClick();
        showModalToast(`✅ 已切換範圍：0–${val}`);
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

  // Home Screen Mode Selection
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      const mode = card.getAttribute('data-mode');
      audio.playClick();
      startNewGame(mode);
    });
  });

  // Start New Game Session
  function startNewGame(mode) {
    showView('game');
    game.startSession(mode);
    renderCurrentQuestion();
  }

  // Render Current Question to Screen
  function renderCurrentQuestion() {
    const q = game.currentQuestion;
    if (!q) return;

    // Progress & Score UI
    progressText.textContent = `第 ${game.currentQuestionIndex} / ${game.totalQuestions} 題`;
    scoreStarsText.textContent = `⭐ ${game.correctCount}`;

    // Hide feedback banner
    feedbackBanner.classList.remove('show', 'retry');

    // Equation Text
    equationText.textContent = q.prompt;

    // Render Visual Math Representation
    renderVisualRepresentation(q);

    // Render 3 Choice Buttons
    choicesContainer.innerHTML = '';
    q.choices.forEach(choiceVal => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choiceVal;

      btn.addEventListener('click', () => {
        handleChoiceSelection(btn, choiceVal);
      });

      choicesContainer.appendChild(btn);
    });
  }

  // Visual Renderer for Counting, Addition, Subtraction
  function renderVisualRepresentation(q) {
    visualContainer.innerHTML = '';
    const theme = q.theme;

    if (q.visualType === 'count') {
      const group = document.createElement('div');
      group.className = 'visual-group';
      group.innerHTML = renderVisualIcons(theme.icon, q.answer);
      visualContainer.appendChild(group);
    } else if (q.visualType === 'addition') {
      const [a, b] = q.operands;
      const groupA = document.createElement('div');
      groupA.className = 'visual-group';
      groupA.innerHTML = renderVisualIcons(theme.icon, a);

      const op = document.createElement('div');
      op.className = 'visual-operator';
      op.textContent = '+';

      const groupB = document.createElement('div');
      groupB.className = 'visual-group';
      groupB.innerHTML = renderVisualIcons(theme.icon, b);

      visualContainer.appendChild(groupA);
      visualContainer.appendChild(op);
      visualContainer.appendChild(groupB);
    } else if (q.visualType === 'subtraction') {
      const [total, takeAway] = q.operands;
      const group = document.createElement('div');
      group.className = 'visual-group';

      let html = '';
      const remaining = total - takeAway;
      for (let i = 0; i < remaining; i++) {
        html += `<span class="theme-icon-item">${theme.icon}</span>`;
      }
      for (let i = 0; i < takeAway; i++) {
        html += `<span class="theme-icon-item taken-away">${theme.icon}</span>`;
      }

      group.innerHTML = html;
      visualContainer.appendChild(group);
    }
  }

  // iOS Safari Audio & Speech Synthesis Unlocker
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

  // Answer Selection Handler
  function handleChoiceSelection(buttonEl, choiceVal) {
    if (game.isAnsweringLocked) return;
    unlockSpeechAndAudio();

    const result = game.submitAnswer(choiceVal);
    if (!result) return;

    if (result.isCorrect) {
      buttonEl.classList.add('correct');
      audio.playCorrect();
      launchConfetti();

      // Show Praise Banner
      const praises = ['答對啦！', '太棒了！', '你好厲害！', '做得很好！'];
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];
      feedbackText.textContent = `🎉 ${randomPraise}`;
      feedbackBanner.classList.remove('retry');
      feedbackBanner.classList.add('show');
      speakMandarin(randomPraise);

      // Auto advance after 1.0 seconds
      setTimeout(() => {
        if (result.isSessionComplete) {
          showResultScreen();
        } else {
          game.nextQuestion();
          renderCurrentQuestion();
        }
      }, 1000);
    } else {
      // Gentle Retry (No punishment)
      buttonEl.classList.add('shake');
      audio.playIncorrect();

      feedbackText.textContent = '差一點點！再試一次 🙂';
      feedbackBanner.classList.add('show', 'retry');
      speakMandarin('再試一次');

      setTimeout(() => {
        buttonEl.classList.remove('shake');
      }, 500);
    }
  }

  // View Navigation Helper
  function showView(viewName) {
    Object.keys(views).forEach(v => {
      if (views[v]) views[v].classList.remove('active');
    });
    if (views[viewName]) {
      views[viewName].classList.add('active');
    }
    updateStarsAndRewardUI();
  }

  // Mandarin Speech Synthesis Helper
  function speakMandarin(text) {
    if ('speechSynthesis' in window && game.settings.soundEnabled) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'zh-TW';
        utter.rate = 0.85;
        window.speechSynthesis.speak(utter);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }
  }

  // Show Result Screen at session end
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

    // Congratulatory Voice
    speakMandarin(`恭喜完成！獲得 ${summary.stars} 顆星！${summary.message}`);
  }

  // Result Action Buttons
  btnReplay.addEventListener('click', () => {
    audio.playClick();
    startNewGame(game.mode);
  });

  btnHome.addEventListener('click', () => {
    audio.playClick();
    showView('home');
  });

  document.querySelector('.brand-title').addEventListener('click', () => {
    audio.playClick();
    showView('home');
  });
});
