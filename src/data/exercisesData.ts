import type { Exercise, MuscleGroup, MuscleDefinition } from '../types';
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

export const MUSCLE_DEFINITIONS: Record<MuscleGroup, MuscleDefinition> = {
  peito: {
    id: 'peito',
    name: 'Peitoral',
    category: 'superior',
    synonyms: ['peito', 'peitoral', 'peitoral maior', 'peitoral menor', 'chest'],
    views: ['frontal']
  },
  costas: {
    id: 'costas',
    name: 'Costas / Dorsais',
    category: 'superior',
    synonyms: ['costas', 'dorsal', 'dorsais', 'latissimo', 'trapezio', 'back'],
    views: ['posterior']
  },
  ombros: {
    id: 'ombros',
    name: 'Deltoides / Ombros',
    category: 'superior',
    synonyms: ['ombro', 'ombros', 'deltoide', 'deltoides', 'shoulders'],
    views: ['frontal', 'posterior']
  },
  triceps: {
    id: 'triceps',
    name: 'Tríceps',
    category: 'superior',
    synonyms: ['triceps', 'tríceps', 'triceps braquial'],
    views: ['posterior']
  },
  biceps: {
    id: 'biceps',
    name: 'Bíceps',
    category: 'superior',
    synonyms: ['biceps', 'bíceps', 'biceps braquial', 'braquial'],
    views: ['frontal']
  },
  abdomen: {
    id: 'abdomen',
    name: 'Abdômen / Core',
    category: 'tronco',
    synonyms: ['abdomen', 'abdômen', 'abdominal', 'core', 'reto abdominal', 'obliquos', 'oblíquos', 'transverso'],
    views: ['frontal']
  },
  lombar: {
    id: 'lombar',
    name: 'Lombar',
    category: 'tronco',
    synonyms: ['lombar', 'eretores da espinha', 'costas baixa', 'lower back', 'paravertebrais'],
    views: ['posterior']
  },
  quadriceps: {
    id: 'quadriceps',
    name: 'Quadríceps',
    category: 'inferior',
    synonyms: ['quadriceps', 'quadríceps', 'coxa anterior', 'reto femoral', 'quads'],
    views: ['frontal']
  },
  posteriores: {
    id: 'posteriores',
    name: 'Isquiotibiais',
    category: 'inferior',
    synonyms: ['posteriores', 'posterior de coxa', 'isquiotibiais', 'isquios', 'isquiossurais', 'hamstrings'],
    views: ['posterior']
  },
  gluteos: {
    id: 'gluteos',
    name: 'Glúteos',
    category: 'inferior',
    synonyms: ['gluteo', 'glúteo', 'gluteos', 'glúteos', 'gluteo maximo', 'gluteo medio'],
    views: ['posterior']
  },
  panturrilhas: {
    id: 'panturrilhas',
    name: 'Panturrilhas',
    category: 'inferior',
    synonyms: ['panturrilha', 'panturrilhas', 'gemeos', 'gêmeos', 'gastrocnemio', 'gastrocêmio', 'soleo', 'sóleo', 'calves'],
    views: ['frontal', 'posterior']
  },
  antebraco: {
    id: 'antebraco',
    name: 'Antebraços',
    category: 'superior',
    synonyms: ['antebraco', 'antebraço', 'antebracos', 'antebraços', 'punho', 'flexores de punho', 'forearms'],
    views: ['frontal', 'posterior']
  }
};

export const MUSCLE_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(MUSCLE_DEFINITIONS).map(([id, def]) => [id, def.name])
);
