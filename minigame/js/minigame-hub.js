/**
 * MiniGameHub - Controller for Mini Game Hub, Navigation, and Session Lifecycle
 */
document.addEventListener('DOMContentLoaded', () => {
  // Audio Controller Proxy
  const audioController = (typeof audio !== 'undefined') ? audio : {
    playClick: () => {},
    playCorrect: () => {},
    playIncorrect: () => {},
    playComplete: () => {}
  };

  const engine = new MiniGameEngine();

  // Elements
  const viewHub = document.getElementById('view-hub');
  const viewGame = document.getElementById('view-game-stage');
  const viewResult = document.getElementById('view-result');
  const stageContainer = document.getElementById('stage-container');
  const headerTotalStars = document.getElementById('header-total-stars');

  let activeGameInstance = null;

  function updateStarsUI() {
    if (typeof StorageEngine !== 'undefined' && headerTotalStars) {
      const stats = StorageEngine.getStats();
      headerTotalStars.textContent = stats.totalStars || 0;
    }
  }

  function showView(viewId) {
    [viewHub, viewGame, viewResult].forEach(v => {
      if (v) v.classList.remove('active');
    });
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active');
    updateStarsUI();
  }

  // Handle Game Card Selection in Hub
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      const gameId = card.getAttribute('data-game');
      audioController.playClick();
      startMiniGameSession(gameId);
    });
  });

  function startMiniGameSession(gameId) {
    engine.startSession(gameId, 3);
    showView('view-game-stage');
    nextChallenge();
  }

  function nextChallenge() {
    if (engine.currentChallengeIndex >= engine.sessionTotalChallenges) {
      finishSession();
      return;
    }

    engine.currentChallengeIndex++;

    // Determine skill based on index
    let mode = 'counting';
    if (engine.currentChallengeIndex === 2) mode = 'addition';
    if (engine.currentChallengeIndex === 3) mode = 'addition';

    const challenge = GameAdapter.createChallenge(mode, 10);

    if (activeGameInstance) {
      activeGameInstance.destroy();
    }

    if (engine.currentGameId === 'catch_fruit') {
      activeGameInstance = new CatchFruitGame(stageContainer, engine, audioController);
    } else if (engine.currentGameId === 'feed_monster') {
      activeGameInstance = new FeedMonsterGame(stageContainer, engine, audioController);
    } else if (engine.currentGameId === 'treasure_box') {
      activeGameInstance = new TreasureBoxGame(stageContainer, engine, audioController);
    }

    if (activeGameInstance) {
      activeGameInstance.startChallenge(challenge, (isCorrect) => {
        setTimeout(() => {
          nextChallenge();
        }, 500);
      });
    }
  }

  function finishSession() {
    if (activeGameInstance) {
      activeGameInstance.destroy();
      activeGameInstance = null;
    }

    const summary = engine.completeSession();
    showView('view-result');

    audioController.playComplete();

    document.getElementById('result-stars').textContent = '⭐'.repeat(summary.stars);
    document.getElementById('result-message').textContent = `太棒了！答對 ${summary.correct} / ${summary.total} 關！獲得 ${summary.stars} 顆星！`;

    if (typeof launchConfetti === 'function') {
      launchConfetti();
    }
  }

  // Result Actions
  document.getElementById('btn-result-replay')?.addEventListener('click', () => {
    audioController.playClick();
    startMiniGameSession(engine.currentGameId || 'catch_fruit');
  });

  document.getElementById('btn-result-hub')?.addEventListener('click', () => {
    audioController.playClick();
    showView('view-hub');
  });

  updateStarsUI();
});
