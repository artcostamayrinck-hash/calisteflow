/**
 * App-level user preferences: left-hand mode, large text, reduced motion, sound, wake lock, theme.
 * Stored in localStorage, read synchronously to avoid flash on mount.
 */

export interface AppSettings {
  leftHandMode: boolean;
  largeText: boolean;
  reducedMotion: boolean; // user override; also checked against prefers-reduced-motion
  soundEnabled: boolean;
  soundVolume: number; // 0.0 to 1.0
  soundTimbre: 'padrao' | 'suave' | 'apito';
  wakeLockEnabled: boolean;
  theme: 'dark' | 'light';
  voiceEnabled: boolean;
}

const KEY = 'calistheflow_app_settings_v1';

const DEFAULTS: AppSettings = {
  leftHandMode: false,
  largeText: false,
  reducedMotion: false,
  soundEnabled: true,
  soundVolume: 0.8,
  soundTimbre: 'padrao',
  wakeLockEnabled: true,
  theme: 'dark',
  voiceEnabled: false,
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
    }
  } catch {
    // quota exceeded – silently ignore
  }
}

/** Returns true if animations should be suppressed (OS preference OR user override). */
export function prefersReducedMotion(): boolean {
  const userPref = getAppSettings().reducedMotion;
  if (userPref) return true;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}
