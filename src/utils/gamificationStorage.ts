import type { WorkoutStats, WorkoutSession, PersonalRecord, MuscleGroup } from '../types';
import type {
  SkillMasteryStatus,
  UserSkillProgress,
  UserProgramEnrollment,
  Achievement,
  UserGamificationProfile,
  Challenge,
  EvolutionReport,
} from '../types/gamification';
import { ACHIEVEMENTS_DEFINITIONS } from '../data/achievementsData';
import { SKILL_TREE_NODES } from '../data/skillsData';
import { STRUCTURED_PROGRAMS } from '../data/programsData';
import { INITIAL_CHALLENGES } from '../data/challengesData';

const STORAGE_KEYS = {
  SKILLS_PROGRESS: 'calistheflow_skills_progress_v2',
  PROGRAMS_ENROLLMENTS: 'calistheflow_programs_enrollments_v1',
  ACHIEVEMENTS_CACHE: 'calistheflow_achievements_v1',
  CHALLENGES: 'calistheflow_challenges_v1',
};

// ==========================================
// 1. SKILL TREE PROGRESS
// ==========================================

export const getSkillProgressMap = (): Record<string, UserSkillProgress> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SKILLS_PROGRESS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const saveSkillProgress = (
  skillId: string,
  status: SkillMasteryStatus,
  currentStepIndex: number = 0,
  notes?: string
): Record<string, UserSkillProgress> => {
  try {
    const current = getSkillProgressMap();
    const existing = current[skillId];

    const updated: UserSkillProgress = {
      skillId,
      status,
      currentStepIndex,
      startedAt: existing?.startedAt || (status !== 'locked' ? new Date().toISOString() : undefined),
      masteredAt: status === 'mastered' ? existing?.masteredAt || new Date().toISOString() : undefined,
      notes: notes !== undefined ? notes : existing?.notes,
      lastTrainedAt: new Date().toISOString(),
    };

    current[skillId] = updated;
    localStorage.setItem(STORAGE_KEYS.SKILLS_PROGRESS, JSON.stringify(current));
    return current;
  } catch (err) {
    console.warn('[Gamification] Erro ao salvar progresso de skill:', err);
    return getSkillProgressMap();
  }
};

// ==========================================
// 2. PROGRAMAS ESTRUTURADOS
// ==========================================

export const getProgramEnrollments = (): UserProgramEnrollment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRAMS_ENROLLMENTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const getActiveProgram = (): UserProgramEnrollment | null => {
  const list = getProgramEnrollments();
  return list.find(p => p.status === 'active' || p.status === 'paused') || null;
};

export const enrollInProgram = (programId: string): UserProgramEnrollment => {
  try {
    const list = getProgramEnrollments();
    // Pausar outros ativos
    const updatedList = list.map(p =>
      p.status === 'active' ? { ...p, status: 'paused' as const, pausedAt: new Date().toISOString() } : p
    );

    const existingIndex = updatedList.findIndex(p => p.programId === programId);
    let enrollment: UserProgramEnrollment;

    if (existingIndex >= 0) {
      enrollment = {
        ...updatedList[existingIndex],
        status: 'active',
        pausedAt: undefined,
      };
      updatedList[existingIndex] = enrollment;
    } else {
      enrollment = {
        programId,
        status: 'active',
        enrolledAt: new Date().toISOString(),
        currentWeek: 1,
        completedSessionIds: [],
        sessionLogs: [],
      };
      updatedList.push(enrollment);
    }

    localStorage.setItem(STORAGE_KEYS.PROGRAMS_ENROLLMENTS, JSON.stringify(updatedList));
    return enrollment;
  } catch (err) {
    console.warn('[Gamification] Erro ao matricular em programa:', err);
    return {
      programId,
      status: 'active',
      enrolledAt: new Date().toISOString(),
      currentWeek: 1,
      completedSessionIds: [],
      sessionLogs: [],
    };
  }
};

export const completeProgramSession = (
  programId: string,
  sessionId: string,
  workoutSessionId?: string
): UserProgramEnrollment | null => {
  try {
    const list = getProgramEnrollments();
    const idx = list.findIndex(p => p.programId === programId);
    if (idx < 0) return null;

    const current = list[idx];
    const completedSet = new Set(current.completedSessionIds);
    completedSet.add(sessionId);

    const logs = [...current.sessionLogs];
    if (!logs.some(l => l.sessionId === sessionId)) {
      logs.push({
        sessionId,
        completedAt: new Date().toISOString(),
        workoutSessionId,
      });
    }

    // Verificar se completou todas as sessões do programa
    const programDef = STRUCTURED_PROGRAMS.find(p => p.id === programId);
    let isFinished = false;
    if (programDef) {
      const allSessionIds = programDef.weeks.flatMap(w => w.sessions.map(s => s.id));
      isFinished = allSessionIds.every(id => completedSet.has(id));
    }

    const updated: UserProgramEnrollment = {
      ...current,
      completedSessionIds: Array.from(completedSet),
      sessionLogs: logs,
      status: isFinished ? 'completed' : current.status,
      completedAt: isFinished ? new Date().toISOString() : current.completedAt,
    };

    list[idx] = updated;
    localStorage.setItem(STORAGE_KEYS.PROGRAMS_ENROLLMENTS, JSON.stringify(list));
    return updated;
  } catch (err) {
    console.warn('[Gamification] Erro ao registrar sessão de programa:', err);
    return null;
  }
};

export const pauseProgram = (programId: string): void => {
  const list = getProgramEnrollments();
  const updated = list.map(p => (p.programId === programId ? { ...p, status: 'paused' as const, pausedAt: new Date().toISOString() } : p));
  localStorage.setItem(STORAGE_KEYS.PROGRAMS_ENROLLMENTS, JSON.stringify(updated));
};

export const resumeProgram = (programId: string): void => {
  const list = getProgramEnrollments();
  const updated = list.map(p => (p.programId === programId ? { ...p, status: 'active' as const, pausedAt: undefined } : p));
  localStorage.setItem(STORAGE_KEYS.PROGRAMS_ENROLLMENTS, JSON.stringify(updated));
};

export const abandonProgram = (programId: string): void => {
  const list = getProgramEnrollments();
  const updated = list.map(p => (p.programId === programId ? { ...p, status: 'abandoned' as const } : p));
  localStorage.setItem(STORAGE_KEYS.PROGRAMS_ENROLLMENTS, JSON.stringify(updated));
};

export const restartProgram = (programId: string): UserProgramEnrollment => {
  const list = getProgramEnrollments();
  const filtered = list.filter(p => p.programId !== programId);
  localStorage.setItem(STORAGE_KEYS.PROGRAMS_ENROLLMENTS, JSON.stringify(filtered));
  return enrollInProgram(programId);
};

// ==========================================
// 3. AVALIAÇÃO DE CONQUISTAS
// ==========================================

export const getUnlockedAchievementsCache = (): Record<string, { unlockedAt: string }> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS_CACHE);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const evaluateAchievements = (
  history: WorkoutSession[],
  stats: WorkoutStats,
  prs: Record<string, PersonalRecord>
): Achievement[] => {
  const skills = getSkillProgressMap();
  const programs = getProgramEnrollments();
  const cachedUnlocked = getUnlockedAchievementsCache();
  const newCache = { ...cachedUnlocked };

  const results: Achievement[] = ACHIEVEMENTS_DEFINITIONS.map(def => {
    const evalResult = def.evaluate({ history, stats, prs, skills, programs });
    const previouslyUnlocked = Boolean(cachedUnlocked[def.id]);
    const isNowUnlocked = evalResult.unlocked;

    if (isNowUnlocked && !previouslyUnlocked) {
      newCache[def.id] = { unlockedAt: new Date().toISOString() };
    }

    const unlockedAt = previouslyUnlocked
      ? cachedUnlocked[def.id].unlockedAt
      : isNowUnlocked
      ? newCache[def.id]?.unlockedAt || new Date().toISOString()
      : undefined;

    return {
      id: def.id,
      title: def.title,
      description: def.description,
      category: def.category,
      icon: def.icon,
      badgeColor: def.badgeColor,
      criterionText: def.criterionText,
      xpReward: def.xpReward,
      unlocked: isNowUnlocked,
      unlockedAt,
      progressPercent: evalResult.progressPercent,
      currentValue: evalResult.currentValue,
      targetValue: evalResult.targetValue,
    };
  });

  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS_CACHE, JSON.stringify(newCache));
  } catch {
    // ignore
  }

  return results;
};

// ==========================================
// 4. PERFIL MULTIDIMENSIONAL DE NÍVEIS & XP
// ==========================================

export const calculateUserGamificationProfile = (
  history: WorkoutSession[],
  stats: WorkoutStats,
  prs: Record<string, PersonalRecord>
): UserGamificationProfile => {
  const skills = getSkillProgressMap();
  const achievements = evaluateAchievements(history, stats, prs);

  // 1. Cálculo de XP
  // - 100 XP por treino concluído
  // - 10 XP por série concluída
  // - 50 XP por PR batido
  // - XP das conquistas desbloqueadas
  let workoutXp = history.length * 100;
  let setsXp = 0;
  for (const s of history) {
    if (s.exercises) {
      for (const e of s.exercises) {
        setsXp += (e.sets?.filter(st => st.completed).length || 1) * 10;
      }
    }
  }
  const prsXp = Object.keys(prs).length * 50;
  const achievementsXp = achievements
    .filter(a => a.unlocked)
    .reduce((acc, a) => acc + a.xpReward, 0);

  const totalXp = workoutXp + setsXp + prsXp + achievementsXp;

  // Sistema de Níveis: Base 500 XP, multiplicador 1.25x
  // Nível 1: 0 - 500
  // Nível 2: 500 - 1200
  // Nível 3: 1200 - 2100...
  const LEVEL_THRESHOLDS = [
    0, 500, 1200, 2100, 3200, 4500, 6000, 7800, 10000, 13000, 17000, 22000, 30000,
  ];
  const LEVEL_TITLES = [
    'Iniciante da Calistenia',
    'Praticante Constante',
    'Guerreiro do Peso Corporal',
    'Mestre das Trações',
    'Especialista em Alavancas',
    'Força Funcional Superior',
    'Atleta Avançado',
    'Mestre dos Estáticos',
    'Elite Calistênica',
    'Lenda do Solo & Barra',
    'Mestre Supremo da Gravidade',
    'Titã Imortal',
  ];

  let level = 1;
  while (level < LEVEL_THRESHOLDS.length && totalXp >= LEVEL_THRESHOLDS[level]) {
    level++;
  }

  const currentLevelFloor = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelCeil = LEVEL_THRESHOLDS[level] || currentLevelFloor + 5000;
  const xpInCurrentLevel = totalXp - currentLevelFloor;
  const xpForNextLevel = nextLevelCeil - currentLevelFloor;
  const progressToNextLevelPct = Math.min(100, Math.round((xpInCurrentLevel / xpForNextLevel) * 100));
  const levelTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];

  // 2. Pilares de Desenvolvimento
  // Força (0-100): baseado em quantidade de PRs e volume de treino
  const strengthScore = Math.min(100, Math.round(Object.keys(prs).length * 15 + Math.min(30, history.length * 2)));
  const strengthLabel =
    strengthScore >= 80 ? 'Força de Elite' : strengthScore >= 50 ? 'Força Avançada' : strengthScore >= 25 ? 'Força Intermediária' : 'Construção de Base';

  // Skills dominadas
  const masteredSkills = Object.values(skills).filter(s => s.status === 'mastered');
  const masteredIds = masteredSkills.map(s => s.skillId);

  // Consistência
  const streak = stats.currentStreakDays || 0;
  const bestStreak = streak;
  const recentWeekWorkouts = history.filter(s => Date.now() - new Date(s.endTime || s.startTime).getTime() <= 7 * 86400000).length;
  const weeklyAdherence = Math.min(100, Math.round((recentWeekWorkouts / 3) * 100));

  return {
    totalXp,
    level,
    levelTitle,
    xpInCurrentLevel,
    xpForNextLevel,
    progressToNextLevelPct,
    pillars: {
      experience: {
        level,
        label: levelTitle,
        totalWorkouts: stats.totalWorkouts,
        totalMinutes: stats.totalMinutes,
      },
      strength: {
        score: strengthScore,
        label: strengthLabel,
        evaluatedPrsCount: Object.keys(prs).length,
      },
      skills: {
        masteredCount: masteredIds.length,
        totalSkills: SKILL_TREE_NODES.length,
        masteredIds,
      },
      consistency: {
        currentStreakDays: streak,
        bestStreakDays: bestStreak,
        weeklyAdherencePct: weeklyAdherence,
      },
      records: {
        totalPrs: Object.keys(prs).length,
        recentPrsCount30d: Object.values(prs).filter(p => {
          const t = new Date(p.achievedAt).getTime();
          return Date.now() - t <= 30 * 86400000;
        }).length,
      },
    },
  };
};

// ==========================================
// 5. DESAFIOS (CHALLENGES)
// ==========================================

export const getStoredChallenges = (): Challenge[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(INITIAL_CHALLENGES));
      return INITIAL_CHALLENGES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CHALLENGES;
  }
};

export const getChallengesWithProgress = (
  history: WorkoutSession[],
  _stats: WorkoutStats,
  prs: Record<string, PersonalRecord>
): Challenge[] => {
  const stored = getStoredChallenges();
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 86400000;
  const thirtyDaysAgo = now - 30 * 86400000;

  const recentHistory7d = history.filter(s => new Date(s.endTime || s.startTime).getTime() >= sevenDaysAgo);
  const recentHistory30d = history.filter(s => new Date(s.endTime || s.startTime).getTime() >= thirtyDaysAgo);

  return stored.map(ch => {
    let current = ch.current;

    if (ch.id === 'ch_weekly_3_workouts') {
      current = recentHistory7d.length;
    } else if (ch.id === 'ch_monthly_12_workouts') {
      current = recentHistory30d.length;
    } else if (ch.id === 'ch_monthly_break_pr') {
      const recentPrs = Object.values(prs).filter(p => new Date(p.achievedAt).getTime() >= thirtyDaysAgo);
      current = recentPrs.length;
    } else if (ch.id === 'ch_weekly_pull_volume') {
      let pullReps = 0;
      for (const s of recentHistory7d) {
        if (!s.exercises) continue;
        for (const e of s.exercises) {
          if (e.exerciseId.includes('pullup') || e.exerciseId.includes('barra')) {
            pullReps += (e.sets || []).reduce((sum, st) => sum + (st.completedReps || 0), 0);
          }
        }
      }
      current = pullReps;
    }

    const completed = current >= ch.target;

    return {
      ...ch,
      current,
      completed,
      completedAt: completed ? ch.completedAt || new Date().toISOString() : undefined,
    };
  });
};

export const toggleJoinChallenge = (challengeId: string): Challenge[] => {
  try {
    const current = getStoredChallenges();
    const updated = current.map(ch => {
      if (ch.id !== challengeId) return ch;
      return {
        ...ch,
        joined: !ch.joined,
        joinedAt: !ch.joined ? new Date().toISOString() : undefined,
      };
    });
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(updated));
    return updated;
  } catch {
    return getStoredChallenges();
  }
};

// ==========================================
// 6. RELATÓRIOS DE EVOLUÇÃO
// ==========================================

export const generateEvolutionReport = (
  history: WorkoutSession[],
  _stats: WorkoutStats,
  prs: Record<string, PersonalRecord>,
  period: 'weekly' | 'monthly' = 'weekly'
): EvolutionReport => {
  const daysCount = period === 'weekly' ? 7 : 30;
  const msCutoff = Date.now() - daysCount * 86400000;

  const relevantHistory = history.filter(s => {
    const t = new Date(s.endTime || s.startTime).getTime();
    return t >= msCutoff;
  });

  const totalMinutes = relevantHistory.reduce((acc, s) => acc + Math.round((s.durationSeconds || 0) / 60), 0);
  const targetFrequencyDays = period === 'weekly' ? 3 : 12;
  const adherence = Math.min(100, Math.round((relevantHistory.length / Math.max(1, targetFrequencyDays)) * 100));

  // PRs batidos no período
  const recentPrs = Object.values(prs).filter(p => new Date(p.achievedAt).getTime() >= msCutoff);
  const prsList = recentPrs.map(p => ({
    exerciseName: p.exerciseName,
    valueText: p.type === 'reps' ? `${p.value} reps` : `${p.value}s`,
    date: p.achievedAt,
  }));

  // Volume muscular
  const muscleVolume: Record<MuscleGroup, number> = {
    peito: 0,
    costas: 0,
    ombros: 0,
    biceps: 0,
    triceps: 0,
    antebraco: 0,
    abdomen: 0,
    lombar: 0,
    quadriceps: 0,
    posteriores: 0,
    gluteos: 0,
    panturrilhas: 0,
  };

  for (const s of relevantHistory) {
    if (s.exercises) {
      for (const e of s.exercises) {
        // atribuir volume aproximado por grupo
        const exId = e.exerciseId.toLowerCase();
        const sets = (e.sets || []).filter(st => st.completed).length || 3;
        if (exId.includes('pushup') || exId.includes('flexao')) {
          muscleVolume.peito += sets;
          muscleVolume.triceps += Math.round(sets * 0.7);
          muscleVolume.ombros += Math.round(sets * 0.5);
        } else if (exId.includes('pullup') || exId.includes('barra')) {
          muscleVolume.costas += sets;
          muscleVolume.biceps += Math.round(sets * 0.7);
        } else if (exId.includes('dip')) {
          muscleVolume.triceps += sets;
          muscleVolume.peito += Math.round(sets * 0.7);
          muscleVolume.ombros += Math.round(sets * 0.5);
        } else if (exId.includes('plank') || exId.includes('core') || exId.includes('lsit') || exId.includes('abdomen')) {
          muscleVolume.abdomen += sets;
        } else if (exId.includes('squat') || exId.includes('lunge') || exId.includes('agachamento') || exId.includes('afundo')) {
          muscleVolume.quadriceps += sets;
          muscleVolume.gluteos += Math.round(sets * 0.7);
        }
      }
    }
  }

  // Sessões de programas
  const programs = getProgramEnrollments();
  let programSessions = 0;
  for (const p of programs) {
    programSessions += p.sessionLogs.filter(l => new Date(l.completedAt).getTime() >= msCutoff).length;
  }

  const highlightMessage =
    adherence >= 90
      ? 'Excelente consistência! Seu volume muscular está perfeitamente equilibrado.'
      : adherence >= 60
      ? 'Bom ritmo de treino. Mantenha os dias de descanso para consolidar a recuperação.'
      : 'Inicie a próxima semana com treinos curtos de 15 minutos para retomar o ritmo!';

  return {
    periodType: period,
    startDate: new Date(msCutoff).toISOString(),
    endDate: new Date().toISOString(),
    completedWorkoutsCount: relevantHistory.length,
    totalTrainingMinutes: totalMinutes,
    targetFrequencyDays,
    adherencePercentage: adherence,
    prsBrokenCount: recentPrs.length,
    prsList,
    skillsProgressedCount: Object.values(getSkillProgressMap()).filter(s => s.status !== 'locked').length,
    programsSessionsCompleted: programSessions,
    muscleVolumeSummary: muscleVolume,
    highlightMessage,
  };
};
