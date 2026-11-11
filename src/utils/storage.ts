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
  PersonalRecord,
  StrengthAssessment,
  SkillStatus,
  AdaptiveProgressionSuggestion,
} from '../types';
import type { AppSettings } from './appSettings';
import { getAppSettings, saveAppSettings } from './appSettings';
import { DEFAULT_ROUTINES } from '../data/routinesData';
import { EXERCISES_DATABASE, getExerciseById } from '../data/exercisesData';
import { createPresetWeeklyPlan } from './workoutGenerator';
import { idbStorage } from './indexedDb';

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
  LAST_BACKUP_EXPORT: 'calistheflow_last_backup_export_date_v1',
  SAFARI_BANNER_DISMISSED: 'calistheflow_safari_banner_dismissed_v1',
  FAVORITES: 'calistheflow_favorites_v1',
  RECENTS: 'calistheflow_recents_v1',
  PERSONAL_RECORDS: 'calistheflow_prs_v1',
  STRENGTH_ASSESSMENTS: 'calistheflow_strength_assessments_v1',
  SKILL_TREE_PROGRESS: 'calistheflow_skill_tree_progress_v1',
  ADAPTIVE_PROGRESSIONS: 'calistheflow_adaptive_progressions_v1',
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
    // Assíncrono para IndexedDB
    routines.forEach(r => idbStorage.put('routines', r).catch(() => {}));
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
    // Persistência assíncrona robusta no IndexedDB
    idbStorage.put('sessions', session).catch(() => {});
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
    // Exclui também do IndexedDB
    idbStorage.delete('sessions', sessionId).catch(() => {});
    return updated;
  } catch (error) {
    console.error('Failed to delete workout session:', error);
    return getWorkoutHistory();
  }
};

/**
 * Restaura sessões a partir do IndexedDB se o Safari tiver purgado o localStorage
 */
export const syncHistoryFromIndexedDB = async (): Promise<WorkoutSession[] | null> => {
  try {
    const sessions = await idbStorage.getAll<WorkoutSession>('sessions');
    if (sessions && sessions.length > 0) {
      const current = getWorkoutHistory();
      if (current.length === 0 && sessions.length > 0) {
        // Safari purgiu localStorage: recupera do IndexedDB!
        const sorted = sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(sorted));
        console.log(`[Storage] Recuperadas ${sorted.length} sessões do IndexedDB após purga do Safari.`);
        return sorted;
      }
    }
    return null;
  } catch (err) {
    console.warn('[Storage] Erro ao sincronizar do IndexedDB:', err);
    return null;
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

// ================= I1: SAFARI & PROACTIVE BACKUP HELPERS =================
export const getLastBackupExportDate = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_BACKUP_EXPORT);
  } catch {
    return null;
  }
};

export const recordBackupExport = (): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_BACKUP_EXPORT, new Date().toISOString());
  } catch {
    // ignore
  }
};

export const isSafariBannerDismissed = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEYS.SAFARI_BANNER_DISMISSED) === 'true';
  } catch {
    return false;
  }
};

export const setSafariBannerDismissed = (dismissed: boolean): void => {
  try {
    if (dismissed) {
      localStorage.setItem(STORAGE_KEYS.SAFARI_BANNER_DISMISSED, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.SAFARI_BANNER_DISMISSED);
    }
  } catch {
    // ignore
  }
};

// (FullBackupBundle e rotinas de exportação/importação definidas ao final do arquivo)

// ================= D2: FAVORITES & RECENTS =================
export const getFavoriteExerciseIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const toggleFavoriteExercise = (exerciseId: string): string[] => {
  try {
    const current = getFavoriteExerciseIds();
    const exists = current.includes(exerciseId);
    const updated = exists ? current.filter(id => id !== exerciseId) : [...current, exerciseId];
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const isFavoriteExercise = (exerciseId: string): boolean => {
  const current = getFavoriteExerciseIds();
  return current.includes(exerciseId);
};

export const getRecentExerciseIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const addRecentExercise = (exerciseId: string): string[] => {
  try {
    const current = getRecentExerciseIds().filter(id => id !== exerciseId);
    // Manter no máximo 20 exercícios recentes
    const updated = [exerciseId, ...current].slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.RECENTS, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

// ================= D11: PERSONAL RECORDS (PRs) =================
export const getPersonalRecords = (): Record<string, PersonalRecord> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PERSONAL_RECORDS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export const checkAndRecordPR = (
  exerciseId: string,
  exerciseName: string,
  value: number,
  type: 'reps' | 'isometric_seconds',
  sessionId?: string
): { isNewPR: boolean; record: PersonalRecord } => {
  try {
    const prs = getPersonalRecords();
    const existing = prs[exerciseId];
    const isNew = !existing || value > existing.value;

    if (isNew && value > 0) {
      const record: PersonalRecord = {
        exerciseId,
        exerciseName,
        type,
        value,
        previousValue: existing?.value,
        achievedAt: new Date().toISOString(),
        sessionId,
      };
      prs[exerciseId] = record;
      localStorage.setItem(STORAGE_KEYS.PERSONAL_RECORDS, JSON.stringify(prs));
      return { isNewPR: true, record };
    }

    return {
      isNewPR: false,
      record: existing || {
        exerciseId,
        exerciseName,
        type,
        value,
        achievedAt: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('Failed to update personal record:', err);
    return {
      isNewPR: false,
      record: {
        exerciseId,
        exerciseName,
        type,
        value,
        achievedAt: new Date().toISOString(),
      },
    };
  }
};

// ================= ADAPTIVE PROGRESSIONS (FASE 2 - SEÇÃO 8) =================
export const getAdaptiveProgressionDecisions = (): Record<string, { accepted?: boolean; dismissed?: boolean }> => {
  try {
    const raw = localStorage.getItem('calistheflow_adaptive_progression_decisions_v1');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveAdaptiveProgressionDecision = (suggestionId: string, accepted: boolean): void => {
  try {
    const current = getAdaptiveProgressionDecisions();
    current[suggestionId] = {
      accepted,
      dismissed: !accepted,
    };
    localStorage.setItem('calistheflow_adaptive_progression_decisions_v1', JSON.stringify(current));
  } catch (err) {
    console.error('Failed to save adaptive progression decision:', err);
  }
};

/**
 * Analisa o histórico de treinos e identifica oportunidades comprovadas de progressão adaptativa (Fase 2 - Seção 8)
 * Não altera a rotina automaticamente; gera sugestões explicadas com métricas de consistência.
 */
export const computeAdaptiveProgressionSuggestions = (
  history: WorkoutSession[]
): AdaptiveProgressionSuggestion[] => {
  if (!history || history.length < 2) return [];

  const storedDecisions = getAdaptiveProgressionDecisions();
  const suggestions: AdaptiveProgressionSuggestion[] = [];

  // Mapear sessões recentes por exercício
  const exerciseHistoryMap: Record<string, Array<{ reps: number; seconds: number; completed: boolean; rpe?: number }>> = {};

  // Ordenar cronologicamente
  const sorted = [...history].sort(
    (a, b) => new Date(a.endTime || a.startTime).getTime() - new Date(b.endTime || b.startTime).getTime()
  );

  sorted.forEach(session => {
    session.exercises.forEach(ex => {
      if (!exerciseHistoryMap[ex.exerciseId]) {
        exerciseHistoryMap[ex.exerciseId] = [];
      }
      const totalReps = ex.sets.reduce((sum, s) => sum + (s.completedReps || 0), 0);
      const totalSec = ex.sets.reduce((sum, s) => sum + (s.completedSeconds || 0), 0);
      const allDone = ex.sets.every(s => s.completed);
      exerciseHistoryMap[ex.exerciseId].push({
        reps: totalReps,
        seconds: totalSec,
        completed: allDone,
        rpe: session.perceivedEffort,
      });
    });
  });

  // Para cada exercício com pelo menos 2-3 sessões bem-sucedidas
  Object.entries(exerciseHistoryMap).forEach(([exId, sessions]) => {
    if (sessions.length < 2) return;
    const exData = getExerciseById(exId) || EXERCISES_DATABASE.find(e => e.id === exId);
    if (!exData || !exData.progressoes || exData.progressoes.length === 0) return;

    // Pegar as últimas 3 sessões (ou 2 se só tiver 2)
    const recent = sessions.slice(-3);
    const allSuccessful = recent.every(s => s.completed);
    const avgRpe = recent.reduce((sum, s) => sum + (s.rpe || 6), 0) / recent.length;

    if (allSuccessful && avgRpe <= 7.5) {
      const nextProgId = exData.progressoes[0];
      const nextExData = getExerciseById(nextProgId) || EXERCISES_DATABASE.find(e => e.id === nextProgId);
      if (!nextExData) return;

      const suggestionId = `prog-${exId}-${nextProgId}`;
      const decision = storedDecisions[suggestionId];

      // Se já foi dispensada, não re-sugerir
      if (decision?.dismissed) return;

      const isIso = exData.type === 'isometric';
      const avgVolume = Math.round(
        recent.reduce((sum, s) => sum + (isIso ? s.seconds : s.reps), 0) / recent.length
      );

      suggestions.push({
        id: suggestionId,
        fromExerciseId: exData.id,
        fromExerciseName: exData.name,
        toExerciseId: nextExData.id,
        toExerciseName: nextExData.name,
        reason: `Você completou ${recent.length} sessões consecutivas de ${exData.name} com esforço controlado. A progressão biomecânica recomendada é ${nextExData.name} para manter estímulos de sobrecarga.`,
        metric: isIso ? `Média de ${avgVolume}s sob tensão (RPE ${avgRpe.toFixed(1)}/10)` : `Média de ${avgVolume} repetições totais (RPE ${avgRpe.toFixed(1)}/10)`,
        suggestedAt: new Date().toISOString(),
        accepted: decision?.accepted || false,
        dismissed: decision?.dismissed || false,
      });
    }
  });

  return suggestions;
};

// ================= D13: STRENGTH ASSESSMENTS =================
export const getStrengthAssessments = (): StrengthAssessment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STRENGTH_ASSESSMENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveStrengthAssessment = (assessment: StrengthAssessment): StrengthAssessment[] => {
  try {
    const current = getStrengthAssessments();
    const updated = [assessment, ...current];
    localStorage.setItem(STORAGE_KEYS.STRENGTH_ASSESSMENTS, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

// ================= D14: SKILL TREE PROGRESS =================
export const getSkillTreeProgress = (): Record<string, SkillStatus> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SKILL_TREE_PROGRESS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export const saveSkillNodeStatus = (skillNodeId: string, status: SkillStatus): Record<string, SkillStatus> => {
  try {
    const current = getSkillTreeProgress();
    current[skillNodeId] = status;
    localStorage.setItem(STORAGE_KEYS.SKILL_TREE_PROGRESS, JSON.stringify(current));
    return current;
  } catch {
    return {};
  }
};

// ================= I1 & PWA: FULL BACKUP & RESTORE ENGINE =================

export interface FullBackupBundle {
  version: string;
  appVersion?: string;
  exportedAt: string;
  routines: Routine[];
  history: WorkoutSession[];
  weeklyPlan: WeeklyPlan;
  profile: UserOnboardingProfile | null;
  journeyProgress: UserJourneyProgress;
  personalRecords?: Record<string, PersonalRecord>;
  favorites?: string[];
  recents?: string[];
  strengthAssessments?: StrengthAssessment[];
  skillTreeProgress?: Record<string, SkillStatus>;
  settings?: AppSettings;
}

export interface BackupValidationResult {
  valid: boolean;
  error?: string;
  summary?: {
    historyCount: number;
    routinesCount: number;
    prsCount: number;
    exportedAt?: string;
    version?: string;
  };
}

export const generateFullBackupBundle = (): FullBackupBundle => {
  return {
    version: '1.2.0',
    appVersion: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '4.2.0',
    exportedAt: new Date().toISOString(),
    routines: getStoredRoutines(),
    history: getWorkoutHistory(),
    weeklyPlan: getStoredWeeklyPlan(),
    profile: getStoredUserProfile(),
    journeyProgress: getUserJourneyProgress(),
    personalRecords: getPersonalRecords(),
    favorites: getFavoriteExerciseIds(),
    recents: getRecentExerciseIds(),
    strengthAssessments: getStrengthAssessments(),
    skillTreeProgress: getSkillTreeProgress(),
    settings: getAppSettings(),
  };
};

export const downloadFullBackupFile = (): boolean => {
  try {
    const bundle = generateFullBackupBundle();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('download', `calisteflow-backup-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    recordBackupExport();
    return true;
  } catch (err) {
    console.error('Failed to export backup file:', err);
    return false;
  }
};

/**
 * Valida a estrutura e integridade de um arquivo de backup JSON
 */
export const validateBackupBundle = (data: unknown): BackupValidationResult => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Arquivo inválido: o formato não é um objeto JSON válido.' };
  }

  const obj = data as Partial<FullBackupBundle>;

  if (!obj.history && !obj.routines && !obj.weeklyPlan) {
    return {
      valid: false,
      error: 'Arquivo não reconhecido: não foram encontrados dados de treino, rotinas ou planejamento do CalisteFlow.',
    };
  }

  const history = Array.isArray(obj.history) ? obj.history : [];
  const routines = Array.isArray(obj.routines) ? obj.routines : [];
  const prsCount = obj.personalRecords && typeof obj.personalRecords === 'object'
    ? Object.keys(obj.personalRecords).length
    : 0;

  return {
    valid: true,
    summary: {
      historyCount: history.length,
      routinesCount: routines.length,
      prsCount,
      exportedAt: obj.exportedAt,
      version: obj.version || '1.0.0',
    },
  };
};

/**
 * Importa um bundle completo de backup para o LocalStorage e IndexedDB
 */
export const importFullBackupBundle = (
  bundle: FullBackupBundle,
  createSafetyBackup = true
): { success: boolean; message: string; summary?: { historyCount: number; routinesCount: number; prsCount: number } } => {
  try {
    const validation = validateBackupBundle(bundle);
    if (!validation.valid) {
      return { success: false, message: validation.error || 'Arquivo de backup inválido.' };
    }

    // Cria um backup de segurança prévio dos dados atuais antes de sobrescrever
    if (createSafetyBackup) {
      createAutomaticDataBackup();
    }

    // 1. Rotinas
    if (Array.isArray(bundle.routines) && bundle.routines.length > 0) {
      saveRoutines(bundle.routines);
    }

    // 2. Histórico de Treinos
    if (Array.isArray(bundle.history)) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(bundle.history));
      // Sincroniza todas as sessões com o IndexedDB para retenção robusta no iOS PWA
      bundle.history.forEach(session => {
        idbStorage.put('sessions', session).catch(() => {});
      });
    }

    // 3. Planejamento Semanal
    if (bundle.weeklyPlan && bundle.weeklyPlan.days) {
      saveWeeklyPlan(bundle.weeklyPlan);
    }

    // 4. Perfil do Usuário
    if (bundle.profile) {
      saveUserProfile(bundle.profile);
    }

    // 5. Progresso da Jornada
    if (bundle.journeyProgress) {
      saveUserJourneyProgress(bundle.journeyProgress);
    }

    // 6. Recordes Pessoais (PRs)
    if (bundle.personalRecords && typeof bundle.personalRecords === 'object') {
      localStorage.setItem(STORAGE_KEYS.PERSONAL_RECORDS, JSON.stringify(bundle.personalRecords));
    }

    // 7. Favoritos
    if (Array.isArray(bundle.favorites)) {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(bundle.favorites));
    }

    // 8. Recentes
    if (Array.isArray(bundle.recents)) {
      localStorage.setItem(STORAGE_KEYS.RECENTS, JSON.stringify(bundle.recents));
    }

    // 9. Avaliações de Força
    if (Array.isArray(bundle.strengthAssessments)) {
      localStorage.setItem(STORAGE_KEYS.STRENGTH_ASSESSMENTS, JSON.stringify(bundle.strengthAssessments));
    }

    // 10. Progresso da Árvore de Habilidades
    if (bundle.skillTreeProgress && typeof bundle.skillTreeProgress === 'object') {
      localStorage.setItem(STORAGE_KEYS.SKILL_TREE_PROGRESS, JSON.stringify(bundle.skillTreeProgress));
    }

    // 11. Configurações do App
    if (bundle.settings && typeof bundle.settings === 'object') {
      saveAppSettings(bundle.settings);
    }

    recordBackupExport();

    return {
      success: true,
      message: 'Backup restaurado com sucesso!',
      summary: {
        historyCount: bundle.history?.length || 0,
        routinesCount: bundle.routines?.length || 0,
        prsCount: bundle.personalRecords ? Object.keys(bundle.personalRecords).length : 0,
      },
    };
  } catch (err) {
    console.error('Falha ao importar backup:', err);
    return {
      success: false,
      message: `Erro ao restaurar dados: ${err instanceof Error ? err.message : 'desconhecido'}`,
    };
  }
};

/**
 * Lê e processa a string JSON crua de um arquivo enviado pelo usuário
 */
export const importBackupFromJSON = (
  jsonString: string
): { success: boolean; message: string; summary?: { historyCount: number; routinesCount: number; prsCount: number } } => {
  try {
    const parsed = JSON.parse(jsonString);
    return importFullBackupBundle(parsed, true);
  } catch (err) {
    return {
      success: false,
      message: `Falha ao interpretar arquivo JSON: ${err instanceof Error ? err.message : 'sintaxe inválida'}`,
    };
  }
};






