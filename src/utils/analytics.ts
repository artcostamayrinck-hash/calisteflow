/**
 * CalisteFlow Local-First Anonymous Analytics Funnel
 * 100% private: stored in localStorage without transmitting personal identifiers.
 */

export type FunnelEvent =
  | 'app_opened'
  | 'app_installed'
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'first_workout_started'
  | 'first_workout_completed'
  | 'week2_retention_achieved'
  | 'quick_workout_triggered'
  | 'backup_restored';

interface StoredEvent {
  event: FunnelEvent;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

const ANALYTICS_KEY = 'calistheflow_funnel_events_v1';

export function trackEvent(
  event: FunnelEvent,
  metadata?: Record<string, string | number | boolean>
): void {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const events: StoredEvent[] = raw ? JSON.parse(raw) : [];
    
    // Avoid duplicate first-time milestones
    if (
      ['app_installed', 'onboarding_completed', 'first_workout_completed'].includes(event) &&
      events.some(e => e.event === event)
    ) {
      return;
    }

    events.push({
      event,
      timestamp: new Date().toISOString(),
      metadata,
    });

    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events));
  } catch (error) {
    console.warn('[Analytics] Failed to record event:', error);
  }
}

export function getFunnelMetrics(): {
  installed: boolean;
  onboardingCompleted: boolean;
  firstWorkoutCompleted: boolean;
  totalEventsLogged: number;
  events: StoredEvent[];
} {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const events: StoredEvent[] = raw ? JSON.parse(raw) : [];

    return {
      installed: events.some(e => e.event === 'app_installed'),
      onboardingCompleted: events.some(e => e.event === 'onboarding_completed'),
      firstWorkoutCompleted: events.some(e => e.event === 'first_workout_completed'),
      totalEventsLogged: events.length,
      events,
    };
  } catch {
    return {
      installed: false,
      onboardingCompleted: false,
      firstWorkoutCompleted: false,
      totalEventsLogged: 0,
      events: [],
    };
  }
}
