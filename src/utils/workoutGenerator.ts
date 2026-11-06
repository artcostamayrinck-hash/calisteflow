import type {
  Exercise,
  BodyFocus,
  EquipmentType,
  FitnessGoal,
  WeeklyDayPlan,
  WeeklyPlan,
  WorkoutBlock,
  PlannedExercise,
  ExerciseDifficulty,
  MuscleGroup,
  UserOnboardingProfile,
  JointLimitation,
} from '../types';
import { EXERCISES_DATABASE } from '../data/exercisesData';

// Equipment requirement per exercise ID
export const EXERCISE_EQUIPMENT_MAP: Record<string, EquipmentType[]> = {
  pushup: ['nenhum'],
  diamond_pushup: ['nenhum'],
  dips: ['paralelas'],
  pullup: ['barra'],
  chinup: ['barra'],
  australian_pullup: ['barra', 'argolas'],
  pike_pushup: ['nenhum'],
  handstand_hold: ['nenhum'],
  squat: ['nenhum'],
  lunges: ['nenhum'],
  plank: ['nenhum'],
  lsit: ['nenhum', 'paralelas'],
  hollow_body: ['nenhum'],
  muscleup: ['barra'],
  front_lever: ['barra'],
  planche_lean: ['nenhum'],
  pistol_squat: ['nenhum'],
};

// Muscle mapping to focus categories
export const FOCUS_LABELS: Record<BodyFocus, { label: string; emoji: string; color: string }> = {
  peito: { label: 'Peito', emoji: '🛡️', color: 'from-rose-500 to-red-600' },
  costas: { label: 'Costas', emoji: '🦅', color: 'from-sky-500 to-blue-600' },
  ombros: { label: 'Ombros', emoji: '⚔️', color: 'from-amber-500 to-orange-600' },
  triceps: { label: 'Tríceps', emoji: '⚡', color: 'from-yellow-400 to-amber-500' },
  biceps: { label: 'Bíceps', emoji: '💪', color: 'from-indigo-500 to-purple-600' },
  abdomen: { label: 'Abdômen', emoji: '🧱', color: 'from-emerald-500 to-teal-600' },
  lombar: { label: 'Lombar', emoji: '🪵', color: 'from-stone-500 to-neutral-600' },
  quadriceps: { label: 'Quadríceps', emoji: '🦵', color: 'from-teal-500 to-emerald-600' },
  posteriores: { label: 'Posteriores', emoji: '🐆', color: 'from-cyan-500 to-teal-600' },
  gluteos: { label: 'Glúteos', emoji: '🍑', color: 'from-pink-500 to-rose-600' },
  panturrilhas: { label: 'Panturrilha', emoji: '🦿', color: 'from-violet-500 to-purple-600' },
  antebraco: { label: 'Antebraço', emoji: '🔨', color: 'from-amber-600 to-yellow-600' },
  full_body: { label: 'Full Body', emoji: '🔥', color: 'from-orange-500 to-rose-600' },
  skills: { label: 'Skills', emoji: '🤸', color: 'from-purple-500 to-indigo-600' },
  mobilidade: { label: 'Mobilidade', emoji: '🧘', color: 'from-teal-400 to-cyan-500' },
  core: { label: 'Core', emoji: '🎯', color: 'from-emerald-400 to-green-600' },
};

export const WEEK_DAYS_NAMES = [
  { dayOfWeek: 1, shortName: 'SEG', dayName: 'Segunda-feira' },
  { dayOfWeek: 2, shortName: 'TER', dayName: 'Terça-feira' },
  { dayOfWeek: 3, shortName: 'QUA', dayName: 'Quarta-feira' },
  { dayOfWeek: 4, shortName: 'QUI', dayName: 'Quinta-feira' },
  { dayOfWeek: 5, shortName: 'SEX', dayName: 'Sexta-feira' },
  { dayOfWeek: 6, shortName: 'SÁB', dayName: 'Sábado' },
  { dayOfWeek: 0, shortName: 'DOM', dayName: 'Domingo' },
];

export const JOINT_RISK_MAP: Record<JointLimitation, string[]> = {
  punho: ['planche_lean', 'handstand_hold', 'diamond_pushup'],
  ombro: ['dips', 'handstand_hold', 'muscleup', 'pike_pushup'],
  joelho: ['pistol_squat', 'lunges'],
  lombar: ['front_lever'],
};

/**
 * Filter exercises compatible with user's available equipment and level
 */
export function filterExercises(
  exercises: Exercise[],
  userLevel: ExerciseDifficulty,
  equipments: EquipmentType[],
  limitations?: JointLimitation[]
): Exercise[] {
  const levelOrder: Record<ExerciseDifficulty, number> = {
    Iniciante: 1,
    Intermediário: 2,
    Avançado: 3,
    Elite: 4,
  };
  const userLevelNum = levelOrder[userLevel] || 2;

  // Collect banned exercise IDs due to joint limitations
  const riskyIds = new Set<string>();
  if (limitations && limitations.length > 0) {
    limitations.forEach(lim => {
      const risks = JOINT_RISK_MAP[lim];
      if (risks) risks.forEach(id => riskyIds.add(id));
    });
  }

  return exercises.filter(ex => {
    // Avoid risky exercises for injured joints
    if (riskyIds.has(ex.id)) return false;

    // Check level compatibility (allow exercises up to user's level or 1 above with caution)
    const exLevelNum = levelOrder[ex.difficulty] || 1;
    if (exLevelNum > userLevelNum + 1) return false;

    // Check equipment compatibility
    const requiredEquip = EXERCISE_EQUIPMENT_MAP[ex.id] || ['nenhum'];
    const hasEquipment = requiredEquip.some(
      eq => eq === 'nenhum' || equipments.includes(eq)
    );
    return hasEquipment;
  });
}

/**
 * Generate a single day workout based on focuses, duration, equipment and goals
 */
export function generateDayWorkout(params: {
  focuses: BodyFocus[];
  targetDurationMinutes: 20 | 30 | 45 | 60;
  goal: FitnessGoal;
  userLevel: ExerciseDifficulty;
  equipments: EquipmentType[];
  limitations?: JointLimitation[];
  existingBlocks?: WorkoutBlock[]; // For locked exercises preservation
}): WorkoutBlock[] {
  const {
    focuses,
    targetDurationMinutes,
    goal,
    userLevel,
    equipments,
    limitations = [],
    existingBlocks = [],
  } = params;

  // Extract locked exercises to preserve
  const lockedExercises = existingBlocks.flatMap(b =>
    b.exercises.filter(e => e.locked)
  );
  const lockedIds = new Set(lockedExercises.map(e => e.exerciseId));

  // Determine volume / sets based on duration
  const setsConfig = {
    20: { mainSets: 3, accSets: 2, mainExercisesCount: 2 },
    30: { mainSets: 3, accSets: 3, mainExercisesCount: 3 },
    45: { mainSets: 4, accSets: 3, mainExercisesCount: 4 },
    60: { mainSets: 4, accSets: 4, mainExercisesCount: 5 },
  }[targetDurationMinutes];

  // Determine reps / rest based on goal
  const goalConfig = {
    forca: { reps: 6, holdSeconds: 20, rest: 90 },
    hipertrofia: { reps: 10, holdSeconds: 30, rest: 60 },
    resistencia: { reps: 15, holdSeconds: 45, rest: 45 },
    skills: { reps: 5, holdSeconds: 15, rest: 120 },
    perda_gordura: { reps: 15, holdSeconds: 35, rest: 35 },
    mobilidade: { reps: 8, holdSeconds: 40, rest: 40 },
  }[goal] || { reps: 10, holdSeconds: 30, rest: 60 };

  const availableExercises = filterExercises(
    EXERCISES_DATABASE,
    userLevel,
    equipments,
    limitations
  );

  // Helper: Match exercises to focuses
  const isMatch = (ex: Exercise, focus: BodyFocus): boolean => {
    if (focus === 'full_body') return true;
    if (focus === 'skills') return ex.category === 'Skill' || ex.difficulty === 'Avançado';
    if (focus === 'core' || focus === 'abdomen') {
      return (
        ex.category === 'Core' ||
        ex.primaryMuscles.includes('abdomen') ||
        ex.secondaryMuscles.includes('abdomen')
      );
    }
    if (focus === 'mobilidade') return ex.type === 'isometric';
    return (
      ex.primaryMuscles.includes(focus as MuscleGroup) ||
      ex.secondaryMuscles.includes(focus as MuscleGroup)
    );
  };

  // Find candidate exercises sorted by relevance
  const matchingCandidates = availableExercises.filter(ex =>
    focuses.some(f => isMatch(ex, f))
  );

  // Fallback pool if matching is scarce
  const pool = matchingCandidates.length >= 2 ? matchingCandidates : availableExercises;

  // Separate into compound strength vs isometric/core
  const mainStrengthCandidates = pool.filter(
    e => e.type === 'reps' && !lockedIds.has(e.id)
  );
  const isometricCoreCandidates = pool.filter(
    e => (e.type === 'isometric' || e.category === 'Core') && !lockedIds.has(e.id)
  );

  // 1. WARM-UP BLOCK (Aquecimento e Ativação)
  const warmupExercises: PlannedExercise[] = [
    {
      exerciseId: 'plank',
      sets: 2,
      targetHoldSeconds: 20,
      restSeconds: 30,
      notes: 'Aquecimento: ative o core e escápulas sem fadigar.',
    },
  ];

  // 2. MAIN STRENGTH BLOCK (Bloco Principal)
  const selectedMain: PlannedExercise[] = [];

  // Re-add locked exercises for main block
  existingBlocks
    .find(b => b.type === 'main')
    ?.exercises.filter(e => e.locked)
    .forEach(e => selectedMain.push(e));

  // Fill remaining slots
  const neededMain = Math.max(0, setsConfig.mainExercisesCount - selectedMain.length);
  const shuffledMain = [...mainStrengthCandidates].sort(() => 0.5 - Math.random());

  for (let i = 0; i < neededMain && i < shuffledMain.length; i++) {
    const ex = shuffledMain[i];
    selectedMain.push({
      exerciseId: ex.id,
      sets: setsConfig.mainSets,
      targetReps: ex.defaultReps || goalConfig.reps,
      restSeconds: ex.defaultRestSeconds || goalConfig.rest,
      notes: ex.breathingTip ? `Foco: ${ex.breathingTip}` : undefined,
    });
  }

  // 3. ISOMETRIC & CORE BLOCK (Isometria e Core)
  const selectedCore: PlannedExercise[] = [];
  existingBlocks
    .find(b => b.type === 'isometric_core')
    ?.exercises.filter(e => e.locked)
    .forEach(e => selectedCore.push(e));

  const neededCore = Math.max(0, 1 - selectedCore.length);
  const shuffledCore = [...isometricCoreCandidates].sort(() => 0.5 - Math.random());

  for (let i = 0; i < neededCore && i < shuffledCore.length; i++) {
    const ex = shuffledCore[i];
    selectedCore.push({
      exerciseId: ex.id,
      sets: setsConfig.accSets,
      targetHoldSeconds: ex.defaultHoldSeconds || goalConfig.holdSeconds,
      targetReps: ex.type === 'reps' ? 10 : undefined,
      restSeconds: 45,
      notes: 'Mantenha a postura e a tensão contínua.',
    });
  }

  // 4. COOLDOWN / ALONGAMENTO BLOCK
  const cooldownExercises: PlannedExercise[] = [
    {
      exerciseId: 'hollow_body',
      sets: 1,
      targetHoldSeconds: 30,
      restSeconds: 30,
      notes: 'Descompressão e alongamento respiratório.',
    },
  ];

  return [
    {
      id: `block-warmup-${Date.now()}`,
      title: 'Aquecimento & Ativação',
      type: 'warmup',
      exercises: warmupExercises,
    },
    {
      id: `block-main-${Date.now()}`,
      title: 'Bloco Principal de Força',
      type: 'main',
      exercises: selectedMain.length > 0 ? selectedMain : warmupExercises,
    },
    {
      id: `block-core-${Date.now()}`,
      title: 'Isometria & Estabilidade',
      type: 'isometric_core',
      exercises: selectedCore.length > 0 ? selectedCore : [warmupExercises[0]],
    },
    {
      id: `block-cooldown-${Date.now()}`,
      title: 'Alongamento & Volta à Calma',
      type: 'cooldown',
      exercises: cooldownExercises,
    },
  ];
}

/**
 * Generate Preset Weekly Plans (PPL, Upper/Lower, Full Body 3x, ABC, Core Diário)
 */
export function createPresetWeeklyPlan(
  templateType: 'ppl' | 'upper_lower' | 'fullbody' | 'abc' | 'core_daily',
  userLevel: ExerciseDifficulty = 'Intermediário',
  equipments: EquipmentType[] = ['nenhum', 'barra', 'paralelas']
): WeeklyPlan {
  const baseDays: WeeklyDayPlan[] = WEEK_DAYS_NAMES.map(d => ({
    dayOfWeek: d.dayOfWeek,
    dayName: d.dayName,
    shortName: d.shortName,
    isActive: false,
    name: 'Descanso Ativo',
    focuses: [],
    targetDurationMinutes: 45,
    goal: 'hipertrofia',
    blocks: [],
  }));

  const configureDay = (
    dayNum: number,
    name: string,
    focuses: BodyFocus[],
    goal: FitnessGoal = 'hipertrofia'
  ) => {
    const day = baseDays.find(d => d.dayOfWeek === dayNum);
    if (!day) return;
    day.isActive = true;
    day.name = name;
    day.focuses = focuses;
    day.goal = goal;
    day.blocks = generateDayWorkout({
      focuses,
      targetDurationMinutes: 45,
      goal,
      userLevel,
      equipments,
    });
  };

  let title = 'Plano Semanal Personalizado';

  switch (templateType) {
    case 'ppl': // Push / Pull / Legs (Seg, Ter, Qui, Sex)
      title = 'Divisão Push / Pull / Legs (PPL)';
      configureDay(1, 'Push (Peito, Ombros e Tríceps)', ['peito', 'ombros', 'triceps']);
      configureDay(2, 'Pull (Costas, Bíceps e Trapézio)', ['costas', 'biceps', 'antebraco']);
      configureDay(4, 'Legs (Pernas e Abdômen)', ['quadriceps', 'gluteos', 'abdomen']);
      configureDay(5, 'Push & Core', ['peito', 'triceps', 'core']);
      break;

    case 'upper_lower': // Upper / Lower (Seg, Ter, Qui, Sex)
      title = 'Divisão Upper / Lower (Membros Sup. e Inf.)';
      configureDay(1, 'Upper (Peito, Costas e Braços)', ['peito', 'costas', 'ombros']);
      configureDay(2, 'Lower (Pernas e Core)', ['quadriceps', 'posteriores', 'gluteos', 'abdomen']);
      configureDay(4, 'Upper Força', ['costas', 'peito', 'triceps'], 'forca');
      configureDay(5, 'Lower Isometria & Core', ['quadriceps', 'core'], 'skills');
      break;

    case 'fullbody': // Full Body 3x (Seg, Qua, Sex)
      title = 'Full Body 3x por Semana';
      configureDay(1, 'Full Body A (Foco Força)', ['full_body', 'peito', 'costas'], 'forca');
      configureDay(3, 'Full Body B (Foco Hipertrofia)', ['full_body', 'quadriceps', 'ombros'], 'hipertrofia');
      configureDay(5, 'Full Body C (Foco Isometria)', ['full_body', 'core', 'skills'], 'skills');
      break;

    case 'abc': // ABC Clássico (Seg, Ter, Qua)
      title = 'Divisão ABC Calistenia';
      configureDay(1, 'Treino A: Empurrar (Push)', ['peito', 'triceps', 'ombros']);
      configureDay(2, 'Treino B: Puxar (Pull)', ['costas', 'biceps']);
      configureDay(3, 'Treino C: Pernas & Abdômen', ['quadriceps', 'gluteos', 'abdomen']);
      break;

    case 'core_daily': // Core e Calistenia Diária (5 dias)
      title = 'Core & Habilidades Diárias';
      configureDay(1, 'Core & Push', ['abdomen', 'peito']);
      configureDay(2, 'Core & Pull', ['abdomen', 'costas']);
      configureDay(3, 'Core & Legs', ['abdomen', 'quadriceps']);
      configureDay(4, 'Skills & Isometria', ['skills', 'core']);
      configureDay(5, 'Full Body Queima', ['full_body', 'abdomen']);
      break;
  }

  return {
    id: `plan-${Date.now()}`,
    version: 1,
    title,
    userLevel,
    equipments,
    days: baseDays,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Builds a customized weekly plan from the 8-step onboarding questionnaire
 */
export function createCustomWeeklyPlanFromProfile(
  profile: UserOnboardingProfile
): WeeklyPlan {
  const actualLevel: ExerciseDifficulty =
    profile.level === 'Nunca treinei' ? 'Iniciante' : profile.level;

  const baseDays: WeeklyDayPlan[] = WEEK_DAYS_NAMES.map(d => ({
    dayOfWeek: d.dayOfWeek,
    dayName: d.dayName,
    shortName: d.shortName,
    isActive: false,
    name: 'Descanso Ativo',
    focuses: [],
    targetDurationMinutes: profile.durationMinutes,
    goal: profile.goal,
    timeReminder: profile.preferredTime,
    blocks: [],
  }));

  const selectedDays = profile.daysSelected.length > 0 ? profile.daysSelected : [1, 3, 5];

  const defaultDistributions: Record<number, { name: string; focuses: BodyFocus[] }[]> = {
    1: [{ name: 'Full Body Geral', focuses: ['full_body', 'core'] }],
    2: [
      { name: 'Membros Superiores (Upper)', focuses: ['peito', 'costas', 'ombros'] },
      { name: 'Membros Inferiores & Core (Lower)', focuses: ['quadriceps', 'gluteos', 'core'] },
    ],
    3: [
      { name: 'Push (Empurrar)', focuses: ['peito', 'ombros', 'triceps'] },
      { name: 'Pull (Puxar)', focuses: ['costas', 'biceps'] },
      { name: 'Legs & Core', focuses: ['quadriceps', 'gluteos', 'core'] },
    ],
    4: [
      { name: 'Push (Peito e Tríceps)', focuses: ['peito', 'triceps', 'ombros'] },
      { name: 'Pull (Costas e Bíceps)', focuses: ['costas', 'biceps', 'antebraco'] },
      { name: 'Legs (Pernas e Glúteos)', focuses: ['quadriceps', 'gluteos', 'posteriores'] },
      { name: 'Upper & Core', focuses: ['peito', 'costas', 'core'] },
    ],
    5: [
      { name: 'Push Força', focuses: ['peito', 'triceps'] },
      { name: 'Pull Força', focuses: ['costas', 'biceps'] },
      { name: 'Legs Completo', focuses: ['quadriceps', 'gluteos', 'posteriores'] },
      { name: 'Ombros & Skills', focuses: ['ombros', 'skills'] },
      { name: 'Core & Mobilidade', focuses: ['core', 'mobilidade'] },
    ],
    6: [
      { name: 'Push A', focuses: ['peito', 'triceps'] },
      { name: 'Pull A', focuses: ['costas', 'biceps'] },
      { name: 'Legs A', focuses: ['quadriceps', 'gluteos'] },
      { name: 'Push B', focuses: ['ombros', 'triceps'] },
      { name: 'Pull B', focuses: ['costas', 'antebraco'] },
      { name: 'Legs B & Core', focuses: ['posteriores', 'core'] },
    ],
    7: [
      { name: 'Push', focuses: ['peito', 'triceps'] },
      { name: 'Pull', focuses: ['costas', 'biceps'] },
      { name: 'Legs', focuses: ['quadriceps', 'gluteos'] },
      { name: 'Skills & Isometria', focuses: ['skills', 'core'] },
      { name: 'Upper Hipertrofia', focuses: ['peito', 'costas'] },
      { name: 'Lower & Core', focuses: ['quadriceps', 'core'] },
      { name: 'Mobilidade Ativa', focuses: ['mobilidade'] },
    ],
  };

  const distList = defaultDistributions[selectedDays.length] || defaultDistributions[3];

  selectedDays.forEach((dayNum, index) => {
    const day = baseDays.find(d => d.dayOfWeek === dayNum);
    if (!day) return;

    day.isActive = true;
    day.targetDurationMinutes = profile.durationMinutes;
    day.goal = profile.goal;
    day.timeReminder = profile.preferredTime;

    let dayFocuses: BodyFocus[] = [];
    let dayName = '';

    if (profile.focusMode === 'custom' && profile.dayFocusMap && profile.dayFocusMap[dayNum]) {
      dayFocuses = profile.dayFocusMap[dayNum];
      dayName = `Treino Personalizado (${dayFocuses.slice(0, 2).join(', ')})`;
    } else {
      const dist = distList[index % distList.length];
      dayFocuses = dist.focuses;
      dayName = dist.name;
    }

    day.name = dayName;
    day.focuses = dayFocuses;
    day.blocks = generateDayWorkout({
      focuses: dayFocuses,
      targetDurationMinutes: profile.durationMinutes,
      goal: profile.goal,
      userLevel: actualLevel,
      equipments: profile.equipments,
      limitations: profile.limitations,
    });
  });

  return {
    id: `plan-${Date.now()}`,
    version: 1,
    title: `Plano CalisteFlow • ${profile.goal.toUpperCase()}`,
    userLevel: actualLevel,
    equipments: profile.equipments,
    days: baseDays,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}


