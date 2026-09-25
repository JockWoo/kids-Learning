/**
 * Little Zhuyin Explorer — Audio Synthesizer Engine
 * Uses Web Audio API with iOS Safari unlocker for zero-latency audio on iPad/Mobile.
 */

class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
    this.isUnlocked = false;
    this.bindUnlockListeners();
  }

  init() {
    if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  bindUnlockListeners() {
    const unlock = () => {
      this.unlockAudio();
      if (this.isUnlocked) {
        window.removeEventListener('touchstart', unlock, true);
        window.removeEventListener('touchend', unlock, true);
        window.removeEventListener('click', unlock, true);
      }
    };
    window.addEventListener('touchstart', unlock, true);
    window.addEventListener('touchend', unlock, true);
    window.addEventListener('click', unlock, true);
  }

  unlockAudio() {
    try {
      this.init();
      if (this.audioCtx) {
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        const buffer = this.audioCtx.createBuffer(1, 1, 22050);
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioCtx.destination);
        source.start(0);
        this.isUnlocked = true;
      }
    } catch (e) {
      console.warn('Audio unlock error:', e);
    }
  }

  setEnabled(enabled) {
    this.enabled = !!enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.2, startTime = 0, gainValue = 0.15) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + startTime);

      gain.gain.setValueAtTime(gainValue, this.audioCtx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(this.audioCtx.currentTime + startTime);
      osc.stop(this.audioCtx.currentTime + startTime + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  playClick() {
    this.playTone(400, 'sine', 0.05, 0, 0.1);
  }

  playCorrect() {
    if (!this.enabled) return;
    this.playTone(523.25, 'triangle', 0.12, 0.0, 0.2);
    this.playTone(659.25, 'triangle', 0.12, 0.1, 0.2);
    this.playTone(783.99, 'triangle', 0.25, 0.2, 0.25);
  }

  playIncorrect() {
    if (!this.enabled) return;
    this.playTone(329.63, 'sine', 0.15, 0.0, 0.12);
    this.playTone(293.66, 'sine', 0.18, 0.12, 0.12);
  }

  playComplete() {
    if (!this.enabled) return;
    this.playTone(523.25, 'triangle', 0.15, 0.0, 0.25);
    this.playTone(659.25, 'triangle', 0.15, 0.12, 0.25);
    this.playTone(783.99, 'triangle', 0.24, 0.24, 0.25);
    this.playTone(1046.5, 'triangle', 0.25, 0.36, 0.3);
    this.playTone(1318.5, 'triangle', 0.55, 0.50, 0.35);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AudioEngine };
}
