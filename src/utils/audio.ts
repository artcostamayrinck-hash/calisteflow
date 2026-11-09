// Web Audio API sound generator & Haptics - works offline without external audio files
// Designed for mobile browser resilience (iOS WebKit and Android Chrome)
import { getAppSettings } from './appSettings';

class SoundManager {
  private audioCtx: AudioContext | null = null;
  public enabled: boolean = true;
  public hapticsEnabled: boolean = true;
  private isUnlocked: boolean = false;

  public get unlocked(): boolean {
    return this.isUnlocked;
  }

  constructor() {
    this.registerAutoUnlock();
  }

  private getVolumeMultiplier(): number {
    try {
      const s = getAppSettings();
      if (!s.soundEnabled) return 0;
      return typeof s.soundVolume === 'number' ? Math.max(0, Math.min(1, s.soundVolume)) : 0.8;
    } catch {
      return 0.8;
    }
  }

  private getTimbre(): 'padrao' | 'suave' | 'apito' {
    try {
      return getAppSettings().soundTimbre || 'padrao';
    } catch {
      return 'padrao';
    }
  }

  /**
   * Registers a one-time gesture listener to unlock Web Audio on mobile browsers
   */
  private registerAutoUnlock() {
    if (typeof window === 'undefined') return;

    const unlockHandler = () => {
      this.unlockAudio();
      window.removeEventListener('touchstart', unlockHandler, true);
      window.removeEventListener('touchend', unlockHandler, true);
      window.removeEventListener('click', unlockHandler, true);
    };

    window.addEventListener('touchstart', unlockHandler, { once: true, passive: true, capture: true });
    window.addEventListener('touchend', unlockHandler, { once: true, passive: true, capture: true });
    window.addEventListener('click', unlockHandler, { once: true, passive: true, capture: true });
  }

  /**
   * Explicitly unlocks the AudioContext with an initial silent buffer
   */
  public async unlockAudio(): Promise<boolean> {
    try {
      const ctx = this.getContext();
      if (!ctx) return false;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Play an imperceptible silent buffer to satisfy iOS WebKit audio policy
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);

      this.isUnlocked = true;
      return true;
    } catch (e) {
      console.warn('[SoundManager] Audio unlock failed:', e);
      return false;
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Short crisp beep for countdown ticks (3, 2, 1)
   */
  playCountdownBeep() {
    this.triggerHaptic([40]);
    if (!this.enabled) return;

    try {
      const vol = this.getVolumeMultiplier();
      if (vol <= 0) return;
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const timbre = this.getTimbre();

      if (timbre === 'suave') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
      } else if (timbre === 'apito') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
      }

      gain.gain.setValueAtTime(0.25 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Distinct starting whistle/beep for isometric hold initiation
   */
  playStartBeep() {
    this.triggerHaptic([60, 40, 60]);
    if (!this.enabled) return;

    try {
      const vol = this.getVolumeMultiplier();
      if (vol <= 0) return;
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const timbre = this.getTimbre();

      if (timbre === 'suave') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
      } else if (timbre === 'apito') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(1050, now);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
      }

      gain.gain.setValueAtTime(0.28 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Audio context failure fallback
    }
  }

  /**
   * Celebratory ascending triad chime when rest timer or set finishes
   */
  playSuccessChime() {
    this.triggerHaptic([80, 50, 120]);
    if (!this.enabled) return;

    try {
      const vol = this.getVolumeMultiplier();
      if (vol <= 0) return;
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note 1: E5 (659.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.25 * vol, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.2);

      // Note 2: G#5 (830.61 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(830.61, now + 0.12);
      gain2.gain.setValueAtTime(0.25 * vol, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.35);

      // Note 3: B5 (987.77 Hz)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(987.77, now + 0.25);
      gain3.gain.setValueAtTime(0.3 * vol, now + 0.25);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.25);
      osc3.stop(now + 0.65);
    } catch {
      // Audio context failure fallback
    }
  }

  /**
   * Haptic vibration fallback for silent mode and tactile feedback
   */
  triggerHaptic(pattern: number[] = [50]) {
    if (!this.hapticsEnabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // vibrate not supported on some iOS Safari releases
    }
  }
}

export const soundManager = new SoundManager();
