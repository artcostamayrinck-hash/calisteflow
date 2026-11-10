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
  theme: 'dark' | 'light' | 'auto';
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

/** Aplica classes CSS de tema ('theme-light') e modo outdoor ('mode-outdoor') no <html> */
export function applyThemeAndOutdoorClasses(theme: 'dark' | 'light' | 'auto', outdoorMode: boolean): void {
  if (typeof document === 'undefined') return;

  const isLight =
    theme === 'light' ||
    (theme === 'auto' &&
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches);

  if (isLight) {
    document.documentElement.classList.add('theme-light');
  } else {
    document.documentElement.classList.remove('theme-light');
  }

  if (outdoorMode) {
    document.documentElement.classList.add('mode-outdoor');
  } else {
    document.documentElement.classList.remove('mode-outdoor');
  }
}

// Inicialização imediata de tema
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(KEY);
    const saved = raw ? JSON.parse(raw) : null;
    const initialTheme = saved?.theme || DEFAULTS.theme;
    const initialOutdoor = Boolean(saved?.outdoorMode);
    applyThemeAndOutdoorClasses(initialTheme, initialOutdoor);

    // Listener para transições do sistema quando em modo 'auto'
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
        const current = getAppSettings();
        if (current.theme === 'auto') {
          applyThemeAndOutdoorClasses('auto', current.outdoorMode);
        }
      });
    }
  } catch (e) {
    // ignore
  }
}

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
    applyThemeAndOutdoorClasses(settings.theme, settings.outdoorMode);
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
