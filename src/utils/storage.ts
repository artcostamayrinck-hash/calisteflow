import type {
  Routine,
  WorkoutSession,
  WorkoutStats,
  WeeklyPlan,
  WeeklyDayPlan,
  RoutineExercise,
  UserOnboardingProfile,
  ActiveWorkoutBackup,
  UserJourneyProgress,
} from '../types';
import { DEFAULT_ROUTINES } from '../data/routinesData';
import { createPresetWeeklyPlan } from './workoutGenerator';

const STORAGE_KEYS = {
  ROUTINES: 'calistheflow_routines_v1',
  HISTORY: 'calistheflow_history_v1',
  SETTINGS: 'calistheflow_settings_v1',
  WEEKLY_PLAN: 'calistheflow_weekly_plan_v1',
  USER_PROFILE: 'calistheflow_user_profile_v1',
  ONBOARDING_DRAFT: 'calistheflow_onboarding_draft_v1',
  ACTIVE_WORKOUT_BACKUP: 'calistheflow_active_workout_backup_v1',
  JOURNEY_PROGRESS: 'calistheflow_journey_progress_v1',
  AUTO_BACKUPS: 'calistheflow_auto_backups_v1',
};

export const getStoredRoutines = (): Routine[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(DEFAULT_ROUTINES));
      return DEFAULT_ROUTINES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ROUTINES;
  } catch (error) {
    console.error('Failed to load routines from storage:', error);
    return DEFAULT_ROUTINES;
  }
};

export const saveRoutines = (routines: Routine[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  } catch (error) {
    console.error('Failed to save routines to storage:', error);
  }
};

export const saveSingleRoutine = (routine: Routine): Routine[] => {
  const current = getStoredRoutines();
  const existingIdx = current.findIndex(r => r.id === routine.id);
  let updated: Routine[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...routine, updatedAt: new Date().toISOString() };
  } else {
    updated = [
      ...current,
      {
        ...routine,
        isCustom: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
  saveRoutines(updated);
  return updated;
};

export const deleteRoutineById = (id: string): Routine[] => {
  const current = getStoredRoutines();
  const filtered = current.filter(r => r.id !== id);
  saveRoutines(filtered);
  return filtered;
};

export const resetToDefaultRoutines = (): Routine[] => {
  saveRoutines(DEFAULT_ROUTINES);
  return DEFAULT_ROUTINES;
};

export const getWorkoutHistory = (): WorkoutSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load history from storage:', error);
    return [];
  }
};

export const saveWorkoutSession = (session: WorkoutSession): WorkoutSession[] => {
  try {
    const current = getWorkoutHistory();
    const updated = [session, ...current];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to save workout session to storage:', error);
    return getWorkoutHistory();
  }
};

export const deleteWorkoutSession = (sessionId: string): WorkoutSession[] => {
  try {
    const current = getWorkoutHistory();
    const updated = current.filter(s => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to delete workout session:', error);
    return getWorkoutHistory();
  }
};

export const calculateStats = (
  history: WorkoutSession[],
  weeklyPlan?: WeeklyPlan
): WorkoutStats => {
  if (!history || history.length === 0) {
    return {
      totalWorkouts: 0,
      totalMinutes: 0,
      totalSets: 0,
      currentStreakDays: 0,
      lastWorkoutDate: undefined,
    };
  }

  let totalDurationSec = 0;
  let totalSets = 0;

  history.forEach(session => {
    totalDurationSec += session.durationSeconds || 0;
    totalSets += session.totalSetsCompleted || 0;
  });

  // Calculate workout streak with flexible rest days protection (G2 requirement)
  const workoutDatesSet = new Set(
    history.map(s => {
      const d = new Date(s.endTime || s.startTime);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })
  );

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const yesterday = new Date(Date.now() - 86400000);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  const hasTrainedRecently = workoutDatesSet.has(todayStr) || workoutDatesSet.has(yesterdayStr);

  let streak = 0;
  if (hasTrainedRecently) {
    let checkDate = workoutDatesSet.has(todayStr) ? new Date(today) : new Date(yesterday);
    let consecutiveRestDaysGrace = 0;

    for (let dayCount = 0; dayCount < 365; dayCount++) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      const dayOfWeek = checkDate.getDay();

      if (workoutDatesSet.has(dateStr)) {
        streak++;
        consecutiveRestDaysGrace = 0;
      } else {
        // Scheduled rest day grace: does not break streak
        const dayPlan = weeklyPlan?.days.find(d => d.dayOfWeek === dayOfWeek);
        const isScheduledRest = dayPlan ? !dayPlan.isActive : true;

        if (isScheduledRest && consecutiveRestDaysGrace < 2) {
          consecutiveRestDaysGrace++;
        } else {
          break;
        }
      }

      checkDate = new Date(checkDate.getTime() - 86400000);
    }
  }

  const sortedDates = Array.from(workoutDatesSet).sort().reverse();

  return {
    totalWorkouts: history.length,
    totalMinutes: Math.round(totalDurationSec / 60),
    totalSets,
    currentStreakDays: streak,
    lastWorkoutDate: sortedDates[0],
  };
};

export const getStoredWeeklyPlan = (): WeeklyPlan => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEEKLY_PLAN);
    if (!raw) {
      const defaultPlan = createPresetWeeklyPlan('ppl');
      localStorage.setItem(STORAGE_KEYS.WEEKLY_PLAN, JSON.stringify(defaultPlan));
      return defaultPlan;
    }
    const parsed = JSON.parse(raw);
    return parsed && parsed.days ? parsed : createPresetWeeklyPlan('ppl');
  } catch (error) {
    console.error('Failed to load weekly plan from storage:', error);
    return createPresetWeeklyPlan('ppl');
  }
};

export const saveWeeklyPlan = (plan: WeeklyPlan): void => {
  try {
    const updated = { ...plan, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.WEEKLY_PLAN, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save weekly plan:', error);
  }
};

/**
 * Converts a scheduled day plan into a runnable Routine entity for WorkoutPlayer
 */
export const convertDayPlanToRoutine = (day: WeeklyDayPlan): Routine => {
  const exercises: RoutineExercise[] = [];

  day.blocks.forEach(block => {
    block.exercises.forEach(pe => {
      exercises.push({
        exerciseId: pe.exerciseId,
        sets: pe.sets,
        targetReps: pe.targetReps,
        targetHoldSeconds: pe.targetHoldSeconds,
        restSeconds: pe.restSeconds || 60,
        notes: pe.notes ? `[${block.title}] ${pe.notes}` : `[${block.title}]`,
      });
    });
  });

  return {
    id: `scheduled-day-${day.dayOfWeek}-${Date.now()}`,
    title: `${day.shortName}: ${day.name}`,
    description: `Treino planejado para ${day.dayName}. Focos: ${day.focuses.join(', ')}`,
    category: 'Full Body',
    difficulty: 'Intermediário',
    estimatedMinutes: day.targetDurationMinutes || 45,
    exercises: exercises.length > 0 ? exercises : [
      { exerciseId: 'pushup', sets: 3, targetReps: 10, restSeconds: 60 }
    ],
    isCustom: true,
  };
};

export interface OnboardingDraftState {
  step: number;
  profile: Partial<UserOnboardingProfile>;
}

export const getStoredUserProfile = (): UserOnboardingProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to load user profile from storage:', error);
    return null;
  }
};

export const saveUserProfile = (profile: UserOnboardingProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save user profile:', error);
  }
};

export const getStoredOnboardingDraft = (): OnboardingDraftState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to load onboarding draft:', error);
    return null;
  }
};

export const saveOnboardingDraft = (draft: OnboardingDraftState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DRAFT, JSON.stringify(draft));
  } catch (error) {
    console.error('Failed to save onboarding draft:', error);
  }
};

export const clearOnboardingDraft = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DRAFT);
  } catch (error) {
    console.error('Failed to clear onboarding draft:', error);
  }
};

// ================= G3: ACTIVE WORKOUT BACKUP & RESUMPTION =================
export const saveActiveWorkoutBackup = (backup: ActiveWorkoutBackup): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT_BACKUP, JSON.stringify(backup));
  } catch (error) {
    console.error('Failed to save active workout backup:', error);
  }
};

export const getActiveWorkoutBackup = (): ActiveWorkoutBackup | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT_BACKUP);
    if (!raw) return null;
    const parsed: ActiveWorkoutBackup = JSON.parse(raw);
    // Discard if older than 4 hours
    if (Date.now() - parsed.timestamp > 4 * 60 * 60 * 1000) {
      clearActiveWorkoutBackup();
      return null;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to get active workout backup:', error);
    return null;
  }
};

export const clearActiveWorkoutBackup = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT_BACKUP);
  } catch (error) {
    console.error('Failed to clear active workout backup:', error);
  }
};

// ================= G2: GUIDED JOURNEY PROGRESS & RETENTION =================
export const getUserJourneyProgress = (): UserJourneyProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNEY_PROGRESS);
    if (!raw) {
      return {
        day1Completed: false,
        day3Completed: false,
        day7Completed: false,
        dismissedMessages: [],
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      day1Completed: false,
      day3Completed: false,
      day7Completed: false,
      dismissedMessages: [],
    };
  }
};

export const saveUserJourneyProgress = (progress: UserJourneyProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.JOURNEY_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save journey progress:', error);
  }
};

// ================= G3: AUTOMATED DATA BACKUPS BEFORE MIGRATIONS =================
export interface DataBackupRecord {
  id: string;
  timestamp: string;
  routinesCount: number;
  historyCount: number;
  weeklyPlanTitle: string;
  payload: {
    routines: Routine[];
    history: WorkoutSession[];
    weeklyPlan: WeeklyPlan;
    profile: UserOnboardingProfile | null;
  };
}

export const createAutomaticDataBackup = (): void => {
  try {
    const currentRoutines = getStoredRoutines();
    const currentHistory = getWorkoutHistory();
    const currentPlan = getStoredWeeklyPlan();
    const currentProfile = getStoredUserProfile();

    const backup: DataBackupRecord = {
      id: `backup-${Date.now()}`,
      timestamp: new Date().toISOString(),
      routinesCount: currentRoutines.length,
      historyCount: currentHistory.length,
      weeklyPlanTitle: currentPlan.title,
      payload: {
        routines: currentRoutines,
        history: currentHistory,
        weeklyPlan: currentPlan,
        profile: currentProfile,
      },
    };

    const raw = localStorage.getItem(STORAGE_KEYS.AUTO_BACKUPS);
    const existing: DataBackupRecord[] = raw ? JSON.parse(raw) : [];
    const updated = [backup, ...existing].slice(0, 3);
    localStorage.setItem(STORAGE_KEYS.AUTO_BACKUPS, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to create automatic backup:', error);
  }
};

export const getAutomaticDataBackups = (): DataBackupRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTO_BACKUPS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const restoreDataBackup = (backupId: string): boolean => {
  try {
    const backups = getAutomaticDataBackups();
    const target = backups.find(b => b.id === backupId);
    if (!target) return false;

    saveRoutines(target.payload.routines);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(target.payload.history));
    saveWeeklyPlan(target.payload.weeklyPlan);
    if (target.payload.profile) {
      saveUserProfile(target.payload.profile);
    }
    return true;
  } catch (error) {
    console.error('Failed to restore backup:', error);
    return false;
  }
};



