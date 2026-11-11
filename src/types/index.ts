export type MuscleGroup =
  | 'peito'
  | 'costas'
  | 'ombros'
  | 'triceps'
  | 'biceps'
  | 'abdomen'
  | 'lombar'
  | 'quadriceps'
  | 'posteriores'
  | 'gluteos'
  | 'panturrilhas'
  | 'antebraco';

export interface MuscleDefinition {
  id: MuscleGroup;
  name: string;
  category: 'superior' | 'tronco' | 'inferior';
  synonyms: string[];
  views: ('frontal' | 'posterior')[];
}

export type ExerciseDifficulty = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Elite';

export type ExerciseCategory = 'Push' | 'Pull' | 'Legs' | 'Core' | 'Skill' | 'Full Body';

export type ExerciseType = 'reps' | 'isometric';

export interface ExercisePostureStep {
  step: number;
  title: string;
  description: string;
}

export interface ExerciseMistake {
  mistake: string;
  correction: string;
}

export interface ExerciseReviewer {
  name: string;
  cref: string;
  specialty: string;
  reviewDate: string;
  notes?: string;
}

export type MovementPattern =
  | 'empurrar-horizontal'
  | 'empurrar-vertical'
  | 'mergulhos'
  | 'puxar-vertical'
  | 'puxar-horizontal'
  | 'core-anterior'
  | 'core-lateral'
  | 'costas-baixa'
  | 'agachamento-pernas'
  | 'skills'
  | 'aquecimento'
  | 'alongamento';

export type ExerciseClassType = 'principal' | 'aquecimento' | 'alongamento' | 'skill';

export type ExercisePhase = 'aquecimento' | 'treino' | 'alongamento';

export interface ExerciseAdaptations {
  punho?: string[];
  ombro?: string[];
  cotovelo?: string[];
  joelho?: string[];
  lombar?: string[];
  tornozelo?: string[];
  quadril?: string[];
  'sem-equipamento'?: string[];
  'em-casa'?: string[];
  elastico?: string[];
  sobrepeso?: string[];
  [key: string]: string[] | undefined;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  type: ExerciseType;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  defaultSets: number;
  defaultReps?: number;
  defaultHoldSeconds?: number;
  defaultRestSeconds: number;
  description: string;
  executionSteps: ExercisePostureStep[];
  commonMistakes: ExerciseMistake[];
  breathingTip: string;
  videoUrl?: string;
  videoThumbnail?: string;
  reviewedBy?: ExerciseReviewer | null;
  revisadoPor?: string | null;
  safetyCautions?: string[];
  padrao?: MovementPattern;
  fase: ExercisePhase;
  fasesSecundarias?: ExercisePhase[];
  equipamento?: EquipmentType[];
  tipoExercicio?: ExerciseClassType;
  estatico?: boolean;
  cadencia?: string;
  regressoes?: string[];
  progressoes?: string[];
  variacoes?: string[];
  adaptacoes?: ExerciseAdaptations;
  criterioAvanco?: string;
  sinonimos?: string[];
  animationType:
    | 'pushup'
    | 'pullup'
    | 'dip'
    | 'squat'
    | 'plank'
    | 'lsit'
    | 'pikepushup'
    | 'hollowbody'
    | 'muscleup'
    | 'handstand'
    | 'lunges'
    | 'australianpullup'
    | 'frontlever'
    | 'planche'
    | 'pistolsquat'
    | string;
}

export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  targetReps?: number;
  targetHoldSeconds?: number;
  restSeconds: number;
  notes?: string;
}

export type RoutineTargetAudience =
  | 'geral'
  | 'iniciante_absoluto'
  | 'mulheres'
  | 'longevidade_40'
  | 'retorno_pausa'
  | 'casa_sem_equipamento';

export interface Routine {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  estimatedMinutes: number;
  exercises: RoutineExercise[];
  targetAudience?: RoutineTargetAudience;
  safetyNotes?: string;
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutSetRecord {
  setNumber: number;
  completedReps?: number;
  completedSeconds?: number;
  weightKg?: number;
  completed: boolean;
}

export interface WorkoutExerciseRecord {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSetRecord[];
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  routineId: string;
  routineTitle: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  exercises: WorkoutExerciseRecord[];
  totalSetsCompleted: number;
  totalRepsCompleted: number;
  totalIsometricSeconds: number;
  perceivedEffort?: number; // 1 to 10
  userNotes?: string;
  musclesWorked: MuscleGroup[];
  jointPainFeedback?: ('nenhum' | 'punho' | 'ombro' | 'joelho' | 'lombar' | 'cotovelo')[];
  newPRs?: PersonalRecord[];
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  type: 'reps' | 'isometric_seconds';
  value: number;
  previousValue?: number;
  achievedAt: string;
  sessionId?: string;
}

export interface StrengthAssessment {
  id: string;
  date: string;
  scores: {
    push: number; // 0 a 100
    pull: number;
    core: number;
    legs: number;
    dip: number;
  };
  rawValues: {
    pushups: number;
    pullups: number;
    plankSeconds: number;
    squats: number;
    dips: number;
  };
  overallScore: number;
  level: ExerciseDifficulty | 'Iniciante';
}

export type SkillStatus = 'locked' | 'in_progress' | 'mastered';

export interface SkillNode {
  id: string;
  title: string;
  level: string;
  description: string;
  exerciseId?: string;
  prerequisites: string[];
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalSets: number;
  currentStreakDays: number;
  lastWorkoutDate?: string;
}

export interface ActiveWorkoutBackup {
  routine: Routine;
  exerciseIndex: number;
  setIndex: number;
  phase: 'exercise' | 'rest';
  totalElapsedSeconds: number;
  completedRecords: WorkoutExerciseRecord[];
  sessionStartTime: string;
  timestamp: number;
  restTargetTimestamp?: number | null;
  isometricSecondsLeft?: number;
  isWorkoutPaused?: boolean;
  currentWeightKg?: number;
}

export interface UserJourneyProgress {
  day1Completed: boolean;
  day3Completed: boolean;
  day7Completed: boolean;
  firstWorkoutDate?: string;
  dismissedMessages: string[];
}

// ================= WEEKLY PLANNER TYPES =================

export type BodyFocus =
  | MuscleGroup
  | 'full_body'
  | 'skills'
  | 'mobilidade'
  | 'core';

export type EquipmentType =
  | 'nenhum'
  | 'barra'
  | 'paralelas'
  | 'argolas'
  | 'elastico'
  | 'banco'
  | 'parede'
  | 'cadeira'
  | 'toalha';

export type FitnessGoal = 'forca' | 'hipertrofia' | 'resistencia' | 'skills' | 'perda_gordura' | 'condicionamento' | 'mobilidade';

export type JointLimitation = 'punho' | 'ombro' | 'joelho' | 'lombar';

export interface UserTrainingPreferences {
  focusStyle?: 'equilibrado' | 'superiores' | 'inferiores' | 'skills_isometria';
  preferredRestSeconds?: number;
  includeWarmup?: boolean;
  includeStretching?: boolean;
}

export interface UserOnboardingProfile {
  goal: FitnessGoal;
  secondaryGoals?: FitnessGoal[];
  level: ExerciseDifficulty | 'Nunca treinei';
  pushupsCount?: number;
  pullupsCount?: number;
  equipments: EquipmentType[];
  daysSelected: number[]; // 0-6
  durationMinutes: 15 | 20 | 30 | 45 | 60;
  focusMode: 'auto' | 'custom';
  dayFocusMap?: Record<number, BodyFocus[]>;
  limitations: JointLimitation[];
  preferences?: UserTrainingPreferences;
  preferredTime?: string;
  notificationsEnabled?: boolean;
  completedAt?: string;
  updatedAt?: string;
}

export interface AdaptiveProgressionSuggestion {
  id: string;
  fromExerciseId: string;
  fromExerciseName: string;
  toExerciseId: string;
  toExerciseName: string;
  reason: string;
  metric: string; // Ex: "12 reps x 3 sessões (RPE moderado)"
  suggestedAt: string;
  accepted?: boolean;
  dismissed?: boolean;
}

export * from './gamification';


export type WorkoutBlockType = 'warmup' | 'main' | 'isometric_core' | 'cooldown';

export interface PlannedExercise {
  exerciseId: string;
  sets: number;
  targetReps?: number;
  targetHoldSeconds?: number;
  restSeconds: number;
  notes?: string;
  weightKg?: number;
  locked?: boolean;
}

export interface WorkoutBlock {
  id: string;
  title: string;
  type: WorkoutBlockType;
  exercises: PlannedExercise[];
}

export interface WeeklyDayPlan {
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  dayName: string;
  shortName: string;
  isActive: boolean; // Treino ativo ou descanso
  name: string; // Ex: "Push Intenso", "Pernas & Core"
  focuses: BodyFocus[];
  targetDurationMinutes: 15 | 20 | 30 | 45 | 60;
  goal: FitnessGoal;
  timeReminder?: string; // Ex: "07:30"
  blocks: WorkoutBlock[];
  isCustomized?: boolean;
}

export interface WeeklyPlan {
  id: string;
  version: number;
  title: string;
  userLevel: ExerciseDifficulty;
  equipments: EquipmentType[];
  days: WeeklyDayPlan[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanValidationNotice {
  id: string;
  type: 'warning' | 'info' | 'error';
  message: string;
  affectedDays?: number[];
  affectedMuscles?: MuscleGroup[];
}

declare global {
  const __APP_VERSION__: string;
  const __BUILD_TIMESTAMP__: string;
}



