import type { Routine, WorkoutSession, WorkoutStats, WeeklyPlan, WeeklyDayPlan, RoutineExercise } from '../types';
import { DEFAULT_ROUTINES } from '../data/routinesData';
import { createPresetWeeklyPlan } from './workoutGenerator';

const STORAGE_KEYS = {
  ROUTINES: 'calistheflow_routines_v1',
  HISTORY: 'calistheflow_history_v1',
  SETTINGS: 'calistheflow_settings_v1',
  WEEKLY_PLAN: 'calistheflow_weekly_plan_v1',
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

export const calculateStats = (history: WorkoutSession[]): WorkoutStats => {
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

  // Calculate workout streak
  const uniqueDates = Array.from(
    new Set(
      history.map(s => {
        const d = new Date(s.endTime || s.startTime);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })
    )
  ).sort().reverse();

  let streak = 0;
  if (uniqueDates.length > 0) {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const yesterday = new Date(Date.now() - 86400000);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const latest = uniqueDates[0];
    if (latest === todayStr || latest === yesterdayStr) {
      streak = 1;
      let checkDate = new Date(latest);
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevExpected = new Date(checkDate.getTime() - 86400000);
        const prevExpectedStr = `${prevExpected.getFullYear()}-${String(prevExpected.getMonth() + 1).padStart(2, '0')}-${String(prevExpected.getDate()).padStart(2, '0')}`;
        if (uniqueDates[i] === prevExpectedStr) {
          streak++;
          checkDate = prevExpected;
        } else {
          break;
        }
      }
    }
  }

  return {
    totalWorkouts: history.length,
    totalMinutes: Math.round(totalDurationSec / 60),
    totalSets,
    currentStreakDays: streak,
    lastWorkoutDate: uniqueDates[0],
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


