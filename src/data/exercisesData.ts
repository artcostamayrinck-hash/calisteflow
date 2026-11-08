import type { Exercise } from '../types';
import { CREF_REVIEWER_SPECIALIST } from './exercises/reviewer';
import { PUSH_HORIZONTAL_EXERCISES } from './exercises/pushHorizontal';
import { PUSH_VERTICAL_EXERCISES } from './exercises/pushVertical';
import { PULL_VERTICAL_EXERCISES } from './exercises/pullVertical';
import { PULL_HORIZONTAL_EXERCISES } from './exercises/pullHorizontal';
import { CORE_EXERCISES } from './exercises/core';
import { LEGS_EXERCISES } from './exercises/legs';
import { SKILL_EXERCISES } from './exercises/skills';
import { WARMUP_MOBILITY_EXERCISES } from './exercises/warmupMobility';
import { STRETCH_EXERCISES } from './exercises/stretches';

export { CREF_REVIEWER_SPECIALIST };

// Agrupamento de todas as cadeias por padrão motor
const BASE_EXERCISES: Exercise[] = [
  ...PUSH_HORIZONTAL_EXERCISES,
  ...PUSH_VERTICAL_EXERCISES,
  ...PULL_VERTICAL_EXERCISES,
  ...PULL_HORIZONTAL_EXERCISES,
  ...CORE_EXERCISES,
  ...LEGS_EXERCISES,
  ...SKILL_EXERCISES,
  ...WARMUP_MOBILITY_EXERCISES,
  ...STRETCH_EXERCISES
];

// Aliases para retrocompatibilidade total com rotinas salvas no localStorage e presets antigos
const LEGACY_ALIASES: Record<string, string> = {
  diamond_pushup: 'diamondpushup',
  dips: 'dip',
  pike_pushup: 'pikepushup',
  australian_pullup: 'australianpullup',
  handstand_hold: 'handstand',
  hollow_body: 'hollowbody',
  front_lever: 'frontlever',
  pistol_squat: 'pistolsquat'
};

const existingIds = new Set(BASE_EXERCISES.map(e => e.id));
const aliasExercises: Exercise[] = [];

for (const [legacyId, targetId] of Object.entries(LEGACY_ALIASES)) {
  if (!existingIds.has(legacyId)) {
    const target = BASE_EXERCISES.find(e => e.id === targetId);
    if (target) {
      aliasExercises.push({
        ...target,
        id: legacyId
      });
      existingIds.add(legacyId);
    }
  }
}

export const EXERCISES_DATABASE: Exercise[] = [
  ...BASE_EXERCISES,
  ...aliasExercises
];

export const getExerciseById = (id: string): Exercise | undefined => {
  if (!id) return undefined;
  const direct = EXERCISES_DATABASE.find(e => e.id === id);
  if (direct) return direct;
  const aliasTarget = LEGACY_ALIASES[id];
  if (aliasTarget) {
    return EXERCISES_DATABASE.find(e => e.id === aliasTarget);
  }
  return undefined;
};

export const MUSCLE_LABELS: Record<string, string> = {
  peito: 'Peitoral',
  costas: 'Costas / Dorsais',
  ombros: 'Deltoides / Ombros',
  triceps: 'Tríceps',
  biceps: 'Bíceps',
  abdomen: 'Abdômen / Core',
  lombar: 'Lombar',
  quadriceps: 'Quadríceps',
  posteriores: 'Isquiotibiais',
  gluteos: 'Glúteos',
  panturrilhas: 'Panturrilhas',
  antebraco: 'Antebraços'
};
