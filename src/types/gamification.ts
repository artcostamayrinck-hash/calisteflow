import type { ExerciseDifficulty, FitnessGoal, MuscleGroup } from './index';

// ==========================================
// 1. ÁRVORE DE HABILIDADES (SKILL TREE)
// ==========================================

export type SkillCategory =
  | 'flexoes'
  | 'barras'
  | 'paralelas'
  | 'core'
  | 'equilibrio'
  | 'forca'
  | 'estaticos'
  | 'explosivos';

export interface SkillPrerequisite {
  skillId?: string;
  name: string;
  benchmarkText: string;
  requiredValue?: string;
}

export interface SkillProgressionStep {
  id: string;
  stepNumber: number;
  title: string;
  targetMetric: string; // Ex: "3x 20s" ou "5 reps controladas"
  exerciseId?: string;
  description: string;
}

export interface AuxiliaryExerciseRef {
  exerciseId: string;
  title: string;
  purpose: string;
  recommendedVolume: string; // Ex: "3 séries de 8-12 reps"
}

export interface CommonMistakeRef {
  mistake: string;
  correction: string;
}

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  difficulty: ExerciseDifficulty;
  description: string;
  exerciseId: string; // Mapeado no catálogo de 208 exercícios do CalisteFlow
  prerequisites: SkillPrerequisite[];
  progressionSteps: SkillProgressionStep[];
  auxiliaryExercises: AuxiliaryExerciseRef[];
  evolutionCriteria: string; // Critério objetivo para considerar a skill dominada
  commonMistakes: CommonMistakeRef[];
  icon: string; // Emoji representativo
  tier: 1 | 2 | 3 | 4; // 1: Fundamento, 2: Intermediário, 3: Avançado, 4: Lendário
}

export type SkillMasteryStatus = 'locked' | 'in_progress' | 'mastered';

export interface UserSkillProgress {
  skillId: string;
  status: SkillMasteryStatus;
  currentStepIndex: number;
  startedAt?: string;
  masteredAt?: string;
  notes?: string;
  lastTrainedAt?: string;
}

// ==========================================
// 2. PROGRAMAS ESTRUTURADOS
// ==========================================

export interface ProgramExercisePrescription {
  exerciseId: string;
  sets: number;
  repsOrHold: string;
  restSeconds: number;
  notes?: string;
}

export interface ProgramSession {
  id: string;
  sessionNumber: number;
  dayLabel: string; // Ex: "Segunda - Dia 1"
  title: string;
  focus: string;
  estimatedMinutes: number;
  exercises: ProgramExercisePrescription[];
}

export interface ProgramWeek {
  weekNumber: number;
  theme: string;
  weeklyGoals: string[];
  sessions: ProgramSession[];
}

export interface StructuredProgram {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'iniciante' | 'forca' | 'resistencia' | 'skill' | 'mobilidade';
  recommendedLevel: ExerciseDifficulty;
  durationWeeks: number;
  sessionsPerWeek: number;
  targetGoal: FitnessGoal;
  presentation: string;
  objective: string;
  completionCriteria: string[];
  bannerGradient: string;
  icon: string;
  weeks: ProgramWeek[];
}

export type ProgramEnrollmentStatus = 'active' | 'paused' | 'completed' | 'abandoned';

export interface UserProgramEnrollment {
  programId: string;
  status: ProgramEnrollmentStatus;
  enrolledAt: string;
  pausedAt?: string;
  completedAt?: string;
  currentWeek: number;
  completedSessionIds: string[]; // Ex: ["w1_s1", "w1_s2"]
  sessionLogs: {
    sessionId: string;
    completedAt: string;
    workoutSessionId?: string;
  }[];
}

// ==========================================
// 3. SISTEMA DE CONQUISTAS (ACHIEVEMENTS)
// ==========================================

export type AchievementCategory =
  | 'treino'
  | 'forca'
  | 'habilidade'
  | 'consistencia'
  | 'mobilidade';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  badgeColor: string;
  criterionText: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progressPercent: number;
  currentValue?: number;
  targetValue?: number;
}

// ==========================================
// 4. SISTEMA MULTIDIMENSIONAL DE NÍVEIS
// ==========================================

export interface UserGamificationProfile {
  totalXp: number;
  level: number;
  levelTitle: string;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  progressToNextLevelPct: number;
  
  // 5 Pilares de Desenvolvimento Separados
  pillars: {
    experience: {
      level: number;
      label: string;
      totalWorkouts: number;
      totalMinutes: number;
    };
    strength: {
      score: number; // 0 - 100
      label: string;
      evaluatedPrsCount: number;
    };
    skills: {
      masteredCount: number;
      totalSkills: number;
      masteredIds: string[];
    };
    consistency: {
      currentStreakDays: number;
      bestStreakDays: number;
      weeklyAdherencePct: number;
    };
    records: {
      totalPrs: number;
      recentPrsCount30d: number;
    };
  };
}

// ==========================================
// 5. DESAFIOS (CHALLENGES)
// ==========================================

export type ChallengeType = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  rewardXp: number;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
  joined: boolean;
  joinedAt?: string;
  completedAt?: string;
  expiresAt: string;
  restDaySafeNotice: string; // Aviso ético de segurança/descanso
}

// ==========================================
// 6. RELATÓRIOS DE EVOLUÇÃO
// ==========================================

export interface EvolutionReport {
  periodType: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  completedWorkoutsCount: number;
  totalTrainingMinutes: number;
  targetFrequencyDays: number;
  adherencePercentage: number;
  prsBrokenCount: number;
  prsList: { exerciseName: string; valueText: string; date: string }[];
  skillsProgressedCount: number;
  programsSessionsCompleted: number;
  muscleVolumeSummary: Record<MuscleGroup, number>; // total de séries por grupo
  highlightMessage: string;
}

