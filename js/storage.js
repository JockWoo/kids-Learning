/**
 * Little Math Explorer — Storage Engine
 * Manages localStorage for settings, parent configuration, and stats.
 */

const STORAGE_KEYS = {
  SETTINGS: 'little_math_explorer_settings',
  STATS: 'little_math_explorer_stats'
};

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  maxNumber: 10, // 5, 10, 20
  questionsPerSession: 10, // 5, 10, 20
  allowedModes: ['counting', 'addition', 'subtraction']
};

class StorageEngine {
  static getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
    } catch (e) {
      console.warn('LocalStorage error reading settings:', e);
      return { ...DEFAULT_SETTINGS };
    }
  }

  static saveSettings(settings) {
    try {
      const current = StorageEngine.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('LocalStorage error saving settings:', e);
      return settings;
    }
  }

  static getStats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      return data ? JSON.parse(data) : { sessionsCompleted: 0, totalStars: 0 };
    } catch (e) {
      return { sessionsCompleted: 0, totalStars: 0 };
    }
  }

  static recordSessionResult(starsEarned, totalQuestions) {
    try {
      const stats = StorageEngine.getStats();
      stats.sessionsCompleted = (stats.sessionsCompleted || 0) + 1;
      stats.totalStars = (stats.totalStars || 0) + starsEarned;
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
      return stats;
    } catch (e) {
      console.warn('LocalStorage error saving stats:', e);
      return { sessionsCompleted: 1, totalStars: starsEarned };
    }
  }

  static consumeStars(amount = 10) {
    try {
      const stats = StorageEngine.getStats();
      stats.totalStars = Math.max(0, (stats.totalStars || 0) - amount);
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
      return stats;
    } catch (e) {
      return { totalStars: 0 };
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageEngine, DEFAULT_SETTINGS };
}
