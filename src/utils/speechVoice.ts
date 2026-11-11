import { getAppSettings, saveAppSettings } from './appSettings';

/**
 * Utilitário de narração por voz (Audio Coach via Web Speech API) para comandos de treino em português.
 * Permite treinar com o celular afastado ouvindo instruções claras de séries, repetições e descanso.
 */
class SpeechVoiceService {
  private isSupported: boolean;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private lastSpokenText: string = '';
  private currentRate: number = 1.0;

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
      // Priorizar pt-BR nativo
      const ptVoice =
        voices.find(v => v.lang === 'pt-BR' || v.lang === 'pt_BR') ||
        voices.find(v => v.lang.startsWith('pt')) ||
        voices[0] ||
        null;
      this.selectedVoice = ptVoice;
    } catch {
      this.selectedVoice = null;
    }
  }

  public speak(text: string, force = false): void {
    if (!this.isSupported || !text) return;

    const settings = getAppSettings();
    if (!settings.voiceEnabled && !force) return;

    this.lastSpokenText = text;

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = this.currentRate || 1.0;
      utterance.pitch = 1.0;
      utterance.volume = Math.max(0.1, settings.soundVolume ?? 0.8);

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[SpeechVoice] Fala não executada:', err);
    }
  }

  /**
   * Repete a última instrução falada imediatamente
   */
  public repeatLastSpeech(): void {
    if (this.lastSpokenText) {
      this.speak(this.lastSpokenText, true);
    }
  }

  /**
   * Anuncia o início de uma nova série e exercício
   */
  public speakExerciseIntro(
    name: string,
    isIsometric: boolean,
    target: number,
    setNum: number,
    totalSets: number
  ): void {
    const targetPhrase = isIsometric
      ? `Sustente a isometria por ${target} segundos.`
      : `Faça ${target} repetições.`;
    const text = `Série ${setNum} de ${totalSets}. Próximo exercício: ${name}. ${targetPhrase} Inicie agora!`;
    this.speak(text);
  }

  /**
   * Anuncia o início do período de descanso
   */
  public speakRestStart(seconds: number, nextExerciseName?: string): void {
    const nextPhrase = nextExerciseName ? ` Próximo exercício: ${nextExerciseName}.` : '';
    const text = `Série concluída! Descanse por ${seconds} segundos.${nextPhrase}`;
    this.speak(text);
  }

  /**
   * Anuncia contagem regressiva final do descanso
   */
  public speakRestEnding(): void {
    this.speak('Atenção: 3, 2, 1, prepare-se para iniciar a próxima série!');
  }

  public pause(): void {
    if (!this.isSupported) return;
    try {
      window.speechSynthesis.pause();
    } catch {
      // ignore
    }
  }

  public resume(): void {
    if (!this.isSupported) return;
    try {
      window.speechSynthesis.resume();
    } catch {
      // ignore
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

  public setSpeed(rate: number): void {
    this.currentRate = Math.max(0.7, Math.min(1.5, rate));
  }

  public getSpeed(): number {
    return this.currentRate;
  }

  public toggleVoice(): boolean {
    const s = getAppSettings();
    const next = !s.voiceEnabled;
    saveAppSettings({ ...s, voiceEnabled: next });
    if (next) {
      this.speak('Modo guiado por áudio ativado. Instruções habilitadas.', true);
    } else {
      this.cancel();
    }
    return next;
  }
}

export const speechVoice = new SpeechVoiceService();
