import type {
  WeeklyPlan,
  PlanValidationNotice,
  MuscleGroup,
} from '../types';
import { EXERCISES_DATABASE, MUSCLE_LABELS } from '../data/exercisesData';

export interface WeeklyMuscleVolume {
  muscle: MuscleGroup;
  totalSets: number;
  percentage: number;
}

/**
 * Validate plan rules: consecutive overload, forgotten muscle groups, extreme volume
 */
export function validateWeeklyPlan(plan: WeeklyPlan): PlanValidationNotice[] {
  const notices: PlanValidationNotice[] = [];
  const activeDays = plan.days.filter(d => d.isActive);

  if (activeDays.length === 0) {
    notices.push({
      id: 'no-active-days',
      type: 'warning',
      message: 'Nenhum dia de treino ativado. Escolha ao menos 1 dia para montar sua rotina.',
    });
    return notices;
  }

  // Map active days ordered by dayOfWeek (Monday = 1, ..., Sunday = 0/7)
  const sortedDays = [...plan.days].sort((a, b) => {
    const orderA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
    const orderB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
    return orderA - orderB;
  });

  // 1. Check for consecutive identical focus groups
  for (let i = 0; i < sortedDays.length - 1; i++) {
    const currentDay = sortedDays[i];
    const nextDay = sortedDays[i + 1];

    if (currentDay.isActive && nextDay.isActive) {
      // Find overlapping focuses
      const overlaps = currentDay.focuses.filter(
        f => nextDay.focuses.includes(f) && f !== 'core' && f !== 'mobilidade' && f !== 'full_body'
      );

      if (overlaps.length > 0) {
        const focusNames = overlaps.map(f => (MUSCLE_LABELS[f as MuscleGroup] || f)).join(', ');
        notices.push({
          id: `consecutive-${currentDay.dayOfWeek}-${nextDay.dayOfWeek}`,
          type: 'warning',
          message: `Atenção: ${focusNames} está agendado em dias seguidos (${currentDay.shortName} e ${nextDay.shortName}) sem 48h de recuperação.`,
          affectedDays: [currentDay.dayOfWeek, nextDay.dayOfWeek],
        });
      }
    }
  }

  // 2. Check weekly muscle volume distribution
  const volumeMap: Record<MuscleGroup, number> = {
    peito: 0,
    costas: 0,
    ombros: 0,
    triceps: 0,
    biceps: 0,
    abdomen: 0,
    lombar: 0,
    quadriceps: 0,
    posteriores: 0,
    gluteos: 0,
    panturrilhas: 0,
    antebraco: 0,
  };

  activeDays.forEach(day => {
    day.blocks.forEach(block => {
      block.exercises.forEach(pe => {
        const ex = EXERCISES_DATABASE.find(e => e.id === pe.exerciseId);
        if (ex) {
          ex.primaryMuscles.forEach(m => {
            volumeMap[m] = (volumeMap[m] || 0) + pe.sets;
          });
          ex.secondaryMuscles.forEach(m => {
            volumeMap[m] = (volumeMap[m] || 0) + Math.round(pe.sets * 0.5);
          });
        }
      });
    });
  });

  // 3. Neglected Muscle Group Warning (if user trains 3+ days)
  if (activeDays.length >= 3) {
    if (volumeMap.costas === 0) {
      notices.push({
        id: 'missing-pull',
        type: 'warning',
        message: 'Aviso de Desequilíbrio: Nenhum estímulo de Costas/Puxar nesta semana. Risco de encurtamento anterior.',
        affectedMuscles: ['costas'],
      });
    }

    if (volumeMap.quadriceps === 0 && volumeMap.posteriores === 0) {
      notices.push({
        id: 'missing-legs',
        type: 'info',
        message: 'Sugestão: As pernas não possuem estímulo planejado nesta semana.',
        affectedMuscles: ['quadriceps', 'posteriores', 'gluteos'],
      });
    }
  }

  // 4. Extreme Volume Alerts
  Object.entries(volumeMap).forEach(([muscle, sets]) => {
    if (sets > 26) {
      notices.push({
        id: `overtraining-${muscle}`,
        type: 'warning',
        message: `Volume muito alto em ${MUSCLE_LABELS[muscle as MuscleGroup] || muscle} (${sets} séries). Recomendado: 12-22 séries/semana.`,
        affectedMuscles: [muscle as MuscleGroup],
      });
    }
  });

  return notices;
}

/**
 * Calculate weekly volume distribution per muscle group
 */
export function calculateWeeklyMuscleVolume(plan: WeeklyPlan): WeeklyMuscleVolume[] {
  const volumeMap: Partial<Record<MuscleGroup, number>> = {};
  let totalSetsSum = 0;

  plan.days.forEach(day => {
    if (!day.isActive) return;
    day.blocks.forEach(block => {
      block.exercises.forEach(pe => {
        const ex = EXERCISES_DATABASE.find(e => e.id === pe.exerciseId);
        if (ex) {
          ex.primaryMuscles.forEach(m => {
            volumeMap[m] = (volumeMap[m] || 0) + pe.sets;
            totalSetsSum += pe.sets;
          });
          ex.secondaryMuscles.forEach(m => {
            volumeMap[m] = (volumeMap[m] || 0) + Math.round(pe.sets * 0.5);
            totalSetsSum += Math.round(pe.sets * 0.5);
          });
        }
      });
    });
  });

  const allMuscles: MuscleGroup[] = [
    'peito',
    'costas',
    'ombros',
    'triceps',
    'biceps',
    'abdomen',
    'lombar',
    'quadriceps',
    'posteriores',
    'gluteos',
    'panturrilhas',
    'antebraco',
  ];

  return allMuscles
    .map(muscle => {
      const sets = volumeMap[muscle] || 0;
      return {
        muscle,
        totalSets: sets,
        percentage: totalSetsSum > 0 ? Math.round((sets / totalSetsSum) * 100) : 0,
      };
    })
    .sort((a, b) => b.totalSets - a.totalSets);
}

