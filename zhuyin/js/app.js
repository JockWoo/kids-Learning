/**
 * Little Zhuyin Explorer — App Orchestrator with Mandarin Speech Synthesis
 */

document.addEventListener('DOMContentLoaded', () => {
  const audio = new AudioEngine();
  const game = new GameEngine();

  audio.setEnabled(game.settings.soundEnabled);

  // Mandarin Speech Synthesis for Zhuyin (Slow & Clear for 5yo)
  function speakMandarin(text) {
    if ('speechSynthesis' in window && game.settings.soundEnabled) {
      try {
        window.speechSynthesis.cancel();
        // Insert small pauses so Zhuyin symbol and example word sound distinct
        const formattedText = String(text).replace(/，/g, ' ... ');
        const utter = new SpeechSynthesisUtterance(formattedText);
        utter.lang = 'zh-TW';
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
    result: document.getElementById('view-result'),
    stroke: document.getElementById('view-stroke')
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

  function getRangeLabel(val) {
    if (val === 4) return '入門 (ㄅㄆㄇㄈ)';
    if (val === 11) return '基礎 (ㄅ~ㄏ)';
    return '進階 (全37個)';
  }

  function updateSummaryDisplay() {
    if (summaryRangeText) summaryRangeText.textContent = getRangeLabel(game.settings.maxRange);
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

  updateSegmentActive(rangeSegment, game.settings.maxRange);
  updateSegmentActive(lengthSegment, game.settings.questionsPerSession);
  updateSegmentActive(speedSegment, game.settings.speechRate || 0.65);
  updateSummaryDisplay();

  if (rangeSegment) {
    rangeSegment.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn) {
        const val = parseInt(btn.getAttribute('data-value'), 10);
        game.updateSettings({ maxRange: val });
        StorageEngine.saveSettings({ maxRange: val });
        updateSegmentActive(rangeSegment, val);
        updateSummaryDisplay();
        renderStrokeRibbon();
        selectStrokeSymbol(activeSymbol);
        audio.playClick();
        showModalToast(`✅ 已切換注音範圍：${getRangeLabel(val)}`);
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
        speakMandarin('ㄅ，包包');
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
      if (mode === 'stroke') {
        showView('stroke');
        initStrokeModule();
      } else {
        startNewGame(mode);
      }
    });
  });

  // ZHUYIN STROKE ORDER STUDIO LOGIC
  let strokeEngine = null;
  let activeSymbol = 'ㄅ';

  function renderStrokeRibbon() {
    const ribbon = document.getElementById('stroke-ribbon');
    if (!ribbon) return;

    ribbon.innerHTML = '';
    const currentMax = game.settings.maxRange || 11;
    const availableItems = ZHUYIN_DATA.slice(0, currentMax);

    // If activeSymbol is out of range, reset to first available item
    if (!availableItems.some(item => item.symbol === activeSymbol)) {
      activeSymbol = availableItems[0].symbol;
    }

    availableItems.forEach((item) => {
      const btn = document.createElement('button');
      btn.className = `stroke-ribbon-btn ${item.symbol === activeSymbol ? 'active' : ''}`;
      btn.textContent = item.symbol;
      btn.addEventListener('click', () => {
        ribbon.querySelectorAll('.stroke-ribbon-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        audio.playClick();
        activeSymbol = item.symbol;
        selectStrokeSymbol(activeSymbol);
      });
      ribbon.appendChild(btn);
    });
  }

  function initStrokeModule() {
    renderStrokeRibbon();

    const container = document.getElementById('rice-grid-container');
    if (!strokeEngine && container) {
      strokeEngine = new ZhuyinStrokeEngine(container, {
        onStepChange: (stepIdx, totalSteps, stepName) => {
          const badge = document.getElementById('stroke-step-badge');
          if (badge) badge.textContent = `筆畫 ${stepIdx} / ${totalSteps} (${stepName})`;
        },
        onComplete: () => {
          audio.playComplete();
          launchConfetti();
        }
      });
    }

    selectStrokeSymbol(activeSymbol);
  }

  function selectStrokeSymbol(sym) {
    const data = STROKE_DATA[sym] || STROKE_DATA['ㄅ'];
    const badge = document.getElementById('stroke-symbol-badge');
    if (badge) badge.textContent = `${data.symbol} ${data.word} ${data.icon}`;
    if (strokeEngine) strokeEngine.loadSymbol(sym);
  }

  // Stroke Action Controls
  const btnStrokePlay = document.getElementById('btn-stroke-play');
  if (btnStrokePlay) {
    btnStrokePlay.addEventListener('click', () => {
      audio.playClick();
      if (strokeEngine) strokeEngine.playStrokeSequence();
    });
  }

  const btnStrokeClear = document.getElementById('btn-stroke-clear');
  if (btnStrokeClear) {
    btnStrokeClear.addEventListener('click', () => {
      audio.playClick();
      if (strokeEngine) strokeEngine.clearTraced();
    });
  }

  const btnStrokeSpeak = document.getElementById('btn-stroke-speak');
  if (btnStrokeSpeak) {
    btnStrokeSpeak.addEventListener('click', () => {
      audio.playClick();
      const data = STROKE_DATA[activeSymbol] || STROKE_DATA['ㄅ'];
      speakMandarin(`${data.symbol}，${data.word}`);
    });
  }

  const btnStrokeHome = document.getElementById('btn-stroke-home');
  if (btnStrokeHome) {
    btnStrokeHome.addEventListener('click', () => {
      audio.playClick();
      if (strokeEngine) strokeEngine.stopAnimation();
      showView('home');
    });
  }

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
    if (q.type === 'symbol') {
      visualContainer.innerHTML = `
        <div class="zhuyin-visual-box">
          <span class="zhuyin-badge" style="font-size: 5.5rem; width: 1.3em; height: 1.3em; border-radius: 36px; box-shadow: 0 10px 24px rgba(255, 82, 82, 0.4);">${q.targetItem.symbol}</span>
          <span class="zhuyin-visual-word">${q.targetItem.icon} ${q.targetItem.word}</span>
        </div>
      `;
      speakMandarin(`${q.targetItem.symbol}，${q.targetItem.word}`);
    } else if (q.type === 'picture') {
      visualContainer.innerHTML = `
        <div class="zhuyin-visual-box">
          <span class="zhuyin-visual-icon" style="font-size: 5rem;">${q.visualIcon}</span>
          <span class="zhuyin-visual-word">${q.targetItem.word}</span>
        </div>
      `;
      speakMandarin(q.targetItem.word);
    } else if (q.type === 'sequence') {
      visualContainer.innerHTML = `
        <div class="zhuyin-seq-box">
          ${q.visualSequence.map(s => `<span class="seq-item">${s}</span>`).join('')}
          <span class="seq-item question-mark">?</span>
        </div>
      `;
      speakMandarin(q.visualSequence.join(' '));
    }

    choicesContainer.innerHTML = '';
    q.choices.forEach(choiceVal => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      if (String(choiceVal).length > 2) {
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
      speakMandarin(choiceVal);

      const praises = ['🎉 答對啦！', '太棒了！', '你好厲害！', '⭐ 真棒！'];
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

    speakMandarin(`恭喜完成！獲得 ${summary.stars} 顆星！${summary.message}`);
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
