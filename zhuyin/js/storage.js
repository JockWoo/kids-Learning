/**
 * Little Zhuyin Explorer — Storage Engine
 */

const STORAGE_KEYS = {
  SETTINGS: 'little_zhuyin_explorer_settings_v2',
  STATS: 'little_zhuyin_explorer_stats'
};

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  maxRange: 11, // Default 11 (ㄅ~ㄏ)
  questionsPerSession: 10,
  speechRate: 0.65, // 0.65x slow preschool speed
  allowedModes: ['symbol', 'picture', 'sequence']
};

class StorageEngine {
  static getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
    } catch (e) {
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
