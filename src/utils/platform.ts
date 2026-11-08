// Device, OS and Browser Platform Capabilities Utilities

export interface StorageStatus {
  isPersisted: boolean;
  isSupported: boolean;
  quotaMB?: number;
  usageMB?: number;
}

/**
 * Detects if the client is running on Apple iOS / iPadOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isAppleDevice = /iPad|iPhone|iPod/.test(ua);
  const isAppleSiliconIPad =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isAppleDevice || isAppleSiliconIPad;
}

/**
 * Detects if running on Android OS
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}

/**
 * Detects if the app is currently running in Standalone (Installed PWA / Home Screen) mode
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const isNavigatorStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  const isDisplayModeStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
  return isNavigatorStandalone || isDisplayModeStandalone || isFullscreen;
}

/**
 * Detects if the browser is Apple Safari (WebKit) rather than a third-party wrapper
 */
export function isSafari(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isWebkit = /WebKit/i.test(ua);
  const isNotChrome = !/Chrome|CriOS/i.test(ua);
  const isNotFirefox = !/FxiOS|Firefox/i.test(ua);
  const isNotEdge = !/EdgiOS|Edge/i.test(ua);
  return isWebkit && isNotChrome && isNotFirefox && isNotEdge;
}

/**
 * Requests persistent storage from the browser to avoid eviction
 * especially critical on Safari / Chromium under disk pressure.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage || !navigator.storage.persist) {
    return false;
  }
  try {
    const isAlreadyPersisted = await navigator.storage.persisted();
    if (isAlreadyPersisted) {
      return true;
    }
    const granted = await navigator.storage.persist();
    return granted;
  } catch (error) {
    console.warn('[Platform] Persistent storage request error:', error);
    return false;
  }
}

/**
 * Checks current storage persistence status and quota
 */
export async function checkStorageStatus(): Promise<StorageStatus> {
  if (typeof navigator === 'undefined' || !navigator.storage) {
    return { isPersisted: false, isSupported: false };
  }

  let isPersisted = false;
  let usageMB: number | undefined;
  let quotaMB: number | undefined;

  try {
    if (navigator.storage.persisted) {
      isPersisted = await navigator.storage.persisted();
    }
    if (navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      if (estimate.usage !== undefined) {
        usageMB = Math.round((estimate.usage / (1024 * 1024)) * 10) / 10;
      }
      if (estimate.quota !== undefined) {
        quotaMB = Math.round((estimate.quota / (1024 * 1024)) * 10) / 10;
      }
    }
    return {
      isPersisted,
      isSupported: true,
      usageMB,
      quotaMB,
    };
  } catch {
    return { isPersisted, isSupported: true };
  }
}

/**
 * Determines whether Notifications API is actually available in the current runtime.
 * Important: iOS Safari requires the app to be added to the Home Screen (standalone)
 * to support Web Push / Notifications (iOS 16.4+).
 */
export function getNotificationSupportStatus(): {
  supported: boolean;
  requiresHomeScreen: boolean;
  permission: NotificationPermission | 'unsupported';
} {
  if (typeof window === 'undefined') {
    return { supported: false, requiresHomeScreen: false, permission: 'unsupported' };
  }

  const ios = isIOS();
  const standalone = isStandalone();

  if (ios && !standalone) {
    // On iOS Safari normal browser tabs, Notification API is either not present
    // or permission request will fail until installed to Home Screen.
    return {
      supported: false,
      requiresHomeScreen: true,
      permission: 'unsupported',
    };
  }

  if (!('Notification' in window)) {
    return {
      supported: false,
      requiresHomeScreen: ios,
      permission: 'unsupported',
    };
  }

  return {
    supported: true,
    requiresHomeScreen: false,
    permission: Notification.permission,
  };
}

