/**
 * App-level user preferences: left-hand mode, large text, reduced motion, sound, wake lock, theme.
 * Stored in localStorage, read synchronously to avoid flash on mount.
 */

import type { AvatarSettings } from '../components/visuals/figure/types';
import { DEFAULT_AVATAR_SETTINGS } from '../components/visuals/figure/constants';

export interface AppSettings {
  leftHandMode: boolean;
  largeText: boolean;
  reducedMotion: boolean; // user override; also checked against prefers-reduced-motion
  playAnimations: boolean; // Reproduzir animações ativas no app
  outdoorMode: boolean; // Modo de alto contraste para visibilidade sob luz solar direta
  defaultRestSeconds: number; // Tempo de descanso padrão configurável em segundos
  soundEnabled: boolean;
  soundVolume: number; // 0.0 to 1.0
  soundTimbre: 'padrao' | 'suave' | 'apito';
  wakeLockEnabled: boolean;
  theme: 'dark' | 'light';
  voiceEnabled: boolean;
  avatar: AvatarSettings;
}

const KEY = 'calistheflow_app_settings_v1';
const AVATAR_KEY = 'calistheflow_avatar_settings_v1';

const DEFAULTS: AppSettings = {
  leftHandMode: false,
  largeText: false,
  reducedMotion: false,
  playAnimations: true,
  outdoorMode: false,
  defaultRestSeconds: 60,
  soundEnabled: true,
  soundVolume: 0.8,
  soundTimbre: 'padrao',
  wakeLockEnabled: true,
  theme: 'dark',
  voiceEnabled: false,
  avatar: { ...DEFAULT_AVATAR_SETTINGS },
};

export function getAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
    // Aplica tema visual no elemento HTML se alternado
    if (typeof document !== 'undefined') {
      if (settings.theme === 'light') {
        document.documentElement.classList.add('theme-light');
      } else {
        document.documentElement.classList.remove('theme-light');
      }

      if (settings.outdoorMode) {
        document.documentElement.classList.add('mode-outdoor');
      } else {
        document.documentElement.classList.remove('mode-outdoor');
      }
    }
  } catch {
    // quota exceeded – silently ignore
  }
}

/** Returns true if animations should be suppressed (OS preference OR user override). */
export function prefersReducedMotion(): boolean {
  const settings = getAppSettings();
  if (settings.reducedMotion || settings.playAnimations === false) return true;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}

/** Obtém as configurações do avatar do usuário */
export function getAvatarSettings(): AvatarSettings {
  try {
    const raw = localStorage.getItem(AVATAR_KEY);
    if (!raw) return { ...DEFAULT_AVATAR_SETTINGS };
    return { ...DEFAULT_AVATAR_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_AVATAR_SETTINGS };
  }
}

/** Salva as configurações do avatar do usuário */
export function saveAvatarSettings(avatar: AvatarSettings): void {
  try {
    localStorage.setItem(AVATAR_KEY, JSON.stringify(avatar));
    // Sincroniza com as appSettings globais
    const current = getAppSettings();
    saveAppSettings({ ...current, avatar });
  } catch {
    // quota exceeded
  }
}
