/**
 * Sistema de Destaque Muscular Dinâmico e Biomecânico para CalisteFlow
 * Renderiza elipses de ativação muscular com opacidade ligada ao vetor de esforço
 */

import type { SkeletonJoints, Point2D } from './types';
import { FIGURE_PALETTE, COLORBLIND_PALETTE } from './constants';

export interface MuscleVisualConfig {
  id: string;
  name: string;
  segment: 'torso' | 'upperArm' | 'forearm' | 'thigh' | 'shin';
  t: number;      // 0 a 1 ao longo do osso
  side: number;   // +1 = anterior/frente, -1 = posterior/costas, 0 = centro
  offset: number; // Distância em px do eixo ósseo
  rx: number;     // Raio longitudinal
  ry: number;     // Raio transversal
}

export const MUSCLE_TOPOLOGY: Record<string, MuscleVisualConfig> = {
  peito: {
    id: 'peito',
    name: 'Peitoral',
    segment: 'torso',
    t: 0.28,
    side: 1,
    offset: 11,
    rx: 14,
    ry: 8,
  },
  costas: {
    id: 'costas',
    name: 'Costas / Dorsais',
    segment: 'torso',
    t: 0.38,
    side: -1,
    offset: 10,
    rx: 16,
    ry: 9,
  },
  ombros: {
    id: 'ombros',
    name: 'Deltoides / Ombros',
    segment: 'upperArm',
    t: 0.12,
    side: 1,
    offset: 4,
    rx: 10,
    ry: 7,
  },
  triceps: {
    id: 'triceps',
    name: 'Tríceps',
    segment: 'upperArm',
    t: 0.48,
    side: -1,
    offset: 6,
    rx: 13,
    ry: 6,
  },
  biceps: {
    id: 'biceps',
    name: 'Bíceps',
    segment: 'upperArm',
    t: 0.50,
    side: 1,
    offset: 6,
    rx: 12,
    ry: 6,
  },
  antebraco: {
    id: 'antebraco',
    name: 'Antebraços',
    segment: 'forearm',
    t: 0.38,
    side: 1,
    offset: 4,
    rx: 11,
    ry: 5,
  },
  abdomen: {
    id: 'abdomen',
    name: 'Abdômen / Core',
    segment: 'torso',
    t: 0.62,
    side: 1,
    offset: 10,
    rx: 14,
    ry: 8,
  },
  lombar: {
    id: 'lombar',
    name: 'Lombar',
    segment: 'torso',
    t: 0.68,
    side: -1,
    offset: 9,
    rx: 13,
    ry: 7,
  },
  gluteos: {
    id: 'gluteos',
    name: 'Glúteos',
    segment: 'thigh',
    t: 0.12,
    side: -1,
    offset: 12,
    rx: 14,
    ry: 9,
  },
  quadriceps: {
    id: 'quadriceps',
    name: 'Quadríceps',
    segment: 'thigh',
    t: 0.48,
    side: 1,
    offset: 8,
    rx: 18,
    ry: 8,
  },
  posteriores: {
    id: 'posteriores',
    name: 'Isquiotibiais',
    segment: 'thigh',
    t: 0.52,
    side: -1,
    offset: 6,
    rx: 17,
    ry: 7,
  },
  panturrilhas: {
    id: 'panturrilhas',
    name: 'Panturrilhas',
    segment: 'shin',
    t: 0.35,
    side: -1,
    offset: 6,
    rx: 14,
    ry: 6,
  },
};

export interface RenderedMuscleEllipse {
  muscleId: string;
  name: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  angleDeg: number;
  color: string;
  opacity: number;
  isPrimary: boolean;
}

/**
 * Calcula a posição e opacidade exata de todos os músculos ativos no quadro atual
 */
export const calculateActiveMuscles = (
  joints: SkeletonJoints,
  primaryMuscles: string[],
  secondaryMuscles: string[],
  effort: number, // 0 a 1
  colorBlindMode: boolean = false
): RenderedMuscleEllipse[] => {
  const result: RenderedMuscleEllipse[] = [];

  const getSegmentEndpoints = (
    segment: MuscleVisualConfig['segment']
  ): { start: Point2D; end: Point2D } => {
    switch (segment) {
      case 'torso':
        return { start: joints.shoulder, end: joints.hip };
      case 'upperArm':
        return { start: joints.shoulder, end: joints.elbow };
      case 'forearm':
        return { start: joints.elbow, end: joints.wrist };
      case 'thigh':
        return { start: joints.hip, end: joints.knee };
      case 'shin':
        return { start: joints.knee, end: joints.ankle };
    }
  };

  const processMuscle = (muscleId: string, isPrimary: boolean) => {
    const config = MUSCLE_TOPOLOGY[muscleId];
    if (!config) return;

    const { start, end } = getSegmentEndpoints(config.segment);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));

    const ux = dx / len;
    const uy = dy / len;
    const nx = -uy;
    const ny = ux;

    const baseX = start.x + dx * config.t;
    const baseY = start.y + dy * config.t;

    const cx = baseX + nx * (config.side * config.offset);
    const cy = baseY + ny * (config.side * config.offset);

    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

    // Opacidade calculada rigorosamente pela especificação:
    // Primário: de 35% a 80% acompanhando o esforço
    // Secundário: 80% do primário (28% a 64%)
    const minOp = isPrimary
      ? FIGURE_PALETTE.muscleBaseOpacity
      : FIGURE_PALETTE.muscleBaseOpacity * FIGURE_PALETTE.secondaryOpacityFactor;
    const maxOp = isPrimary
      ? FIGURE_PALETTE.musclePeakOpacity
      : FIGURE_PALETTE.musclePeakOpacity * FIGURE_PALETTE.secondaryOpacityFactor;

    const opacity = minOp + (maxOp - minOp) * effort;
    const standardColor = isPrimary ? FIGURE_PALETTE.primaryMuscle : FIGURE_PALETTE.secondaryMuscle;
    const colorBlindColor = isPrimary ? COLORBLIND_PALETTE.primaryMuscle : COLORBLIND_PALETTE.secondaryMuscle;
    const color = colorBlindMode ? colorBlindColor : standardColor;

    result.push({
      muscleId,
      name: config.name,
      cx,
      cy,
      rx: config.rx,
      ry: config.ry,
      angleDeg,
      color,
      opacity,
      isPrimary,
    });
  };

  // Músculos secundários primeiro (ordem de desenho: sinergistas abaixo dos alvos)
  secondaryMuscles.forEach(m => processMuscle(m, false));
  primaryMuscles.forEach(m => processMuscle(m, true));

  return result;
};

