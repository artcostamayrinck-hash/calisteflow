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
    | 'australianpullup';
}

export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  targetReps?: number;
  targetHoldSeconds?: number;
  restSeconds: number;
  notes?: string;
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  estimatedMinutes: number;
  exercises: RoutineExercise[];
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutSetRecord {
  setNumber: number;
  completedReps?: number;
  completedSeconds?: number;
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
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalSets: number;
  currentStreakDays: number;
  lastWorkoutDate?: string;
}

