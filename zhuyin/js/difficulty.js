/**
 * Little Zhuyin Explorer — Difficulty Engine
 */

const DIFFICULTY_PRESETS = {
  easy: { range: 4, label: '入門 (ㄅ~ㄈ 4個)' },
  normal: { range: 11, label: '基礎 (ㄅ~ㄏ 11個)' },
  hard: { range: 37, label: '進階 (全37個)' }
};

class DifficultyEngine {
  constructor(preset = 'normal') {
    this.setPreset(preset);
  }

  setPreset(preset) {
    if (DIFFICULTY_PRESETS[preset]) {
      this.currentPreset = preset;
      this.maxRange = DIFFICULTY_PRESETS[preset].range;
    } else {
      this.currentPreset = 'normal';
      this.maxRange = 11;
    }
  }

  setMaxRange(range) {
    const num = parseInt(range, 10);
    if (!isNaN(num) && num > 0) {
      this.maxRange = Math.min(37, num);
    }
  }

  getMaxRange() {
    return this.maxRange;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DIFFICULTY_PRESETS, DifficultyEngine };
}
