/**
 * Motor Matemático de Cinemática Inversa (IK) e Interpolação para CalisteFlow
 * Garante juntas anatomicamente corretas, sem descontinuidades ou NaNs
 */

import type { Point2D } from './types';

export const distance = (p1: Point2D, p2: Point2D): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const clamp = (val: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, val));
};

export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

export const lerpPoint = (p1: Point2D, p2: Point2D, t: number): Point2D => {
  return {
    x: lerp(p1.x, p2.x, t),
    y: lerp(p1.y, p2.y, t),
  };
};

/**
 * Cinemática Inversa Analítica de 2 Ossos (Two-Bone Analytic IK)
 * Calcula a posição exata da articulação intermediária (cotovelo ou joelho)
 * @param origin - Ponto de origem (ombro ou quadril)
 * @param target - Ponto alvo/apoio (punho ou tornozelo)
 * @param l1 - Comprimento do osso proximal (braço ou coxa)
 * @param l2 - Comprimento do osso distal (antebraço ou canela)
 * @param bendSign - Direção da flexão (+1 ou -1)
 */
export const solveTwoBoneIK = (
  origin: Point2D,
  target: Point2D,
  l1: number,
  l2: number,
  bendSign: 1 | -1 = 1
): Point2D => {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  let d = Math.sqrt(dx * dx + dy * dy);

  // Evita degenerescência e divisão por zero respeitando a desigualdade triangular
  const maxReach = l1 + l2 - 0.001;
  const minReach = Math.abs(l1 - l2) + 0.001;
  d = clamp(d, minReach, maxReach);

  // Ângulo base da linha que une origem ao alvo
  const baseAngle = Math.atan2(dy, dx);

  // Lei dos Cossenos para o ângulo interno na origem
  const cosAngle = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const clampedCos = clamp(cosAngle, -1, 1);
  const internalAngle = Math.acos(clampedCos);

  const jointAngle = baseAngle + bendSign * internalAngle;

  return {
    x: origin.x + l1 * Math.cos(jointAngle),
    y: origin.y + l1 * Math.sin(jointAngle),
  };
};

/**
 * Cinemática Direta (Forward Kinematics)
 * Retorna o ponto final a partir de uma origem, ângulo e comprimento
 */
export const forwardKinematics = (
  origin: Point2D,
  angleRad: number,
  length: number
): Point2D => {
  return {
    x: origin.x + length * Math.cos(angleRad),
    y: origin.y + length * Math.sin(angleRad),
  };
};

/**
 * Interpolação suave senoidal para ciclos contínuos (loop de 0 a 1 e volta a 0)
 * tNormalized vai de 0.0 a 1.0 (onde 0.0 = repouso, 0.5 = pico, 1.0 = volta ao repouso)
 */
export const sineLoopPhase = (tNormalized: number): number => {
  // t: 0 -> 1 -> 0 suave
  return 0.5 - 0.5 * Math.cos(tNormalized * 2 * Math.PI);
};

/**
 * Interpolação excêntrica assimétrica (subida rápida concêntrica, descida lenta excêntrica)
 * 0.0 a 0.25 = subida/concentric rápido (25% do ciclo)
 * 0.25 a 1.0 = descida/eccentric lenta e controlada (75% do ciclo)
 */
export const eccentricPhase = (tNormalized: number): number => {
  if (tNormalized < 0.25) {
    // Fase concêntrica rápida (0 a 1 em 25% do tempo)
    const tSub = tNormalized / 0.25;
    return 0.5 - 0.5 * Math.cos(tSub * Math.PI);
  } else {
    // Fase excêntrica lenta (1 a 0 em 75% do tempo)
    const tDesc = (tNormalized - 0.25) / 0.75;
    return 0.5 + 0.5 * Math.cos(tDesc * Math.PI);
  }
};

/**
 * Micro-oscilação sutil para exercícios isométricos (respiração humana: ~1 px)
 */
export const breathingDisplacement = (tNormalized: number, amplitude: number = 1.0): number => {
  return Math.sin(tNormalized * 2 * Math.PI) * amplitude;
};

