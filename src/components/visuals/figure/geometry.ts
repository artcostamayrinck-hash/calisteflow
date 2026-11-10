/**
 * Gerador de Geometria e Formas Anatômicas Vetoriais para o CalisteFlow
 * Cria segmentos corporais cônicos com pontas arredondadas e vestimentas
 */

import type { Point2D } from './types';
import { LIMB_WIDTHS } from './constants';

/**
 * Gera o path SVG para um segmento cônico com pontas arredondadas (cápsula cônica)
 * @param start - Ponto inicial da junta
 * @param end - Ponto final da junta
 * @param startWidth - Espessura no ponto inicial
 * @param endWidth - Espessura no ponto final
 */
export const createTaperedLimbPath = (
  start: Point2D,
  end: Point2D,
  startWidth: number,
  endWidth: number
): string => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  if (len < 0.001) {
    const r = startWidth / 2;
    return `M ${start.x - r} ${start.y} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 -${r * 2} 0 Z`;
  }

  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;

  const r1 = startWidth / 2;
  const r2 = endWidth / 2;

  // 4 vértices do tronco cônico
  const p1a = { x: start.x + nx * r1, y: start.y + ny * r1 };
  const p2a = { x: end.x + nx * r2, y: end.y + ny * r2 };
  const p2b = { x: end.x - nx * r2, y: end.y - ny * r2 };
  const p1b = { x: start.x - nx * r1, y: start.y - ny * r1 };

  return [
    `M ${p1a.x.toFixed(2)} ${p1a.y.toFixed(2)}`,
    `L ${p2a.x.toFixed(2)} ${p2a.y.toFixed(2)}`,
    `A ${r2.toFixed(2)} ${r2.toFixed(2)} 0 0 1 ${p2b.x.toFixed(2)} ${p2b.y.toFixed(2)}`,
    `L ${p1b.x.toFixed(2)} ${p1b.y.toFixed(2)}`,
    `A ${r1.toFixed(2)} ${r1.toFixed(2)} 0 0 1 ${p1a.x.toFixed(2)} ${p1a.y.toFixed(2)}`,
    'Z',
  ].join(' ');
};

/**
 * Cria a bermuda atlética cobrindo quadril e metade proximal da coxa
 */
export const createShortsPath = (
  hip: Point2D,
  knee: Point2D,
  torsoAngleRad: number
): string => {
  // Ponto na metade da coxa
  const midThigh = {
    x: hip.x + (knee.x - hip.x) * 0.52,
    y: hip.y + (knee.y - hip.y) * 0.52,
  };

  // Largura no quadril e na coxa
  const hipWidth = LIMB_WIDTHS.torso.end + 2;
  const thighWidth = LIMB_WIDTHS.thigh.start + 2;

  const dx = knee.x - hip.x;
  const dy = knee.y - hip.y;
  const len = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
  const nx = -dy / len;
  const ny = dx / len;

  const rHip = hipWidth / 2;
  const rThigh = thighWidth / 2;

  // Ajuste superior do cós da bermuda subindo ligeiramente em direção ao tronco
  const waistOffset = 8;
  const waistCenter = {
    x: hip.x - Math.cos(torsoAngleRad) * waistOffset,
    y: hip.y - Math.sin(torsoAngleRad) * waistOffset,
  };

  const w1 = { x: waistCenter.x + nx * rHip, y: waistCenter.y + ny * rHip };
  const w2 = { x: midThigh.x + nx * rThigh, y: midThigh.y + ny * rThigh };
  const w3 = { x: midThigh.x - nx * rThigh, y: midThigh.y - ny * rThigh };
  const w4 = { x: waistCenter.x - nx * rHip, y: waistCenter.y - ny * rHip };

  return `M ${w1.x.toFixed(2)} ${w1.y.toFixed(2)} L ${w2.x.toFixed(2)} ${w2.y.toFixed(2)} L ${w3.x.toFixed(2)} ${w3.y.toFixed(2)} L ${w4.x.toFixed(2)} ${w4.y.toFixed(2)} Z`;
};

/**
 * Cria o tênis claro atlético (#E2E8F0) com sola amortecida (#94A3B8)
 */
export const createSneakerPath = (ankle: Point2D, toe: Point2D): string => {
  const dx = toe.x - ankle.x;
  const dy = toe.y - ankle.y;
  const len = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;

  // Ankle radius e toe radius
  const rAnkle = 5.5;
  const rToe = 4.0;

  const p1 = { x: ankle.x + nx * rAnkle - ux * 3, y: ankle.y + ny * rAnkle - uy * 3 };
  const p2 = { x: toe.x + nx * rToe + ux * 2, y: toe.y + ny * rToe + uy * 2 };
  const p3 = { x: toe.x - nx * rToe + ux * 2, y: toe.y - ny * rToe + uy * 2 };
  const p4 = { x: ankle.x - nx * rAnkle - ux * 3, y: ankle.y - ny * rAnkle - uy * 3 };

  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} L ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} Q ${toe.x + ux * 4} ${toe.y + uy * 4} ${p3.x.toFixed(2)} ${p3.y.toFixed(2)} L ${p4.x.toFixed(2)} ${p4.y.toFixed(2)} Z`;
};

/**
 * Cria a regata atlética (tank top) com cavas confortáveis para visão dos deltoides
 */
export const createTankTopPath = (
  shoulder: Point2D,
  hip: Point2D,
  _torsoAngleRad: number,
  shoulderWidth: number = 31,
  hipWidth: number = 26
): string => {
  const dx = hip.x - shoulder.x;
  const dy = hip.y - shoulder.y;
  const len = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
  const nx = -dy / len;
  const ny = dx / len;

  const rS = (shoulderWidth * 0.95) / 2;
  const rH = (hipWidth * 1.02) / 2;

  const p1 = { x: shoulder.x + nx * rS, y: shoulder.y + ny * rS };
  const p2 = { x: hip.x + nx * rH, y: hip.y + ny * rH };
  const p3 = { x: hip.x - nx * rH, y: hip.y - ny * rH };
  const p4 = { x: shoulder.x - nx * rS, y: shoulder.y - ny * rS };

  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} L ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)} L ${p4.x.toFixed(2)} ${p4.y.toFixed(2)} Z`;
};

/**
 * Cria a camiseta esportiva com mangas curtas no terço superior do braço
 */
export const createTShirtPath = (
  shoulder: Point2D,
  hip: Point2D,
  elbow: Point2D,
  _torsoAngleRad: number,
  shoulderWidth: number = 31,
  hipWidth: number = 26
): { torso: string; sleeve: string } => {
  const torso = createTankTopPath(shoulder, hip, _torsoAngleRad, shoulderWidth * 1.05, hipWidth * 1.05);

  // Manga curta cobrindo o primeiro terço do braço
  const sleeveEnd = {
    x: shoulder.x + (elbow.x - shoulder.x) * 0.42,
    y: shoulder.y + (elbow.y - shoulder.y) * 0.42,
  };
  const sleeve = createTaperedLimbPath(shoulder, sleeveEnd, 17, 14);

  return { torso, sleeve };
};

