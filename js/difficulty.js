/**
 * Little Math Explorer — Difficulty Engine
 * Configures difficulty settings and range limitations.
 */

const DIFFICULTY_PRESETS = {
  easy: { max: 5, label: '入門 (0–5)' },
  normal: { max: 10, label: '標準 (0–10)' },
  hard: { max: 20, label: '進階 (0–20)' }
};

class DifficultyEngine {
  constructor(preset = 'normal') {
    this.setPreset(preset);
  }

  setPreset(preset) {
    if (DIFFICULTY_PRESETS[preset]) {
      this.currentPreset = preset;
      this.maxNumber = DIFFICULTY_PRESETS[preset].max;
    } else {
      this.currentPreset = 'normal';
      this.maxNumber = 10;
    }
  }

  setMaxNumber(max) {
    const num = parseInt(max, 10);
    if (!isNaN(num) && num > 0) {
      this.maxNumber = num;
    }
  }

  getMaxNumber() {
    return this.maxNumber;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DIFFICULTY_PRESETS, DifficultyEngine };
}
