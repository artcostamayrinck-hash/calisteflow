import { getAppSettings } from './appSettings';

/**
 * Utilitário de narração por voz (Web Speech API) para comandos de treino em português
 */
class SpeechVoiceService {
  private isSupported: boolean;
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    if (this.isSupported) {
      this.initVoices();
      if (typeof window !== 'undefined' && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices(): void {
    if (!this.isSupported) return;
    try {
      const voices = window.speechSynthesis.getVoices();
      // Priorizar pt-BR
      const ptVoice =
        voices.find(v => v.lang === 'pt-BR') ||
        voices.find(v => v.lang.startsWith('pt')) ||
        voices[0] ||
        null;
      this.selectedVoice = ptVoice;
    } catch {
      this.selectedVoice = null;
    }
  }

  public speak(text: string, force = false): void {
    if (!this.isSupported) return;

    const settings = getAppSettings();
    if (!settings.voiceEnabled && !force) return;

    try {
      // Cancela fala em andamento para não encavalar
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05; // Leve aceleração para ficar natural e dinâmico durante o treino
      utterance.pitch = 1.0;
      utterance.volume = Math.max(0.1, settings.soundVolume);

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis cue failed:', err);
    }
  }

  public cancel(): void {
    if (!this.isSupported) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export const speechVoice = new SpeechVoiceService();
