/**
 * Banco de Poses, Cinemática e Geradores de Movimento do CalisteFlow
 * Contém modelos biomecânicos paramétricos para todas as 13 famílias de exercícios (208 exercícios)
 */

import type { ExerciseAnimationDef, PoseState, Point2D } from './types';
import { BONE_LENGTHS, GROUND_Y } from './constants';
import { solveTwoBoneIK, lerp, lerpPoint, sineLoopPhase, eccentricPhase, breathingDisplacement } from './ik';

// ==========================================
// 1. FAMÍLIA: EMPURRAR HORIZONTAL (FLEXÕES)
// ==========================================

export interface PushupOptions {
  handHeight?: number;      // Altura do apoio das mãos (ex: 0 no chão, 70 na caixa, 160 na parede)
  feetHeight?: number;      // Altura dos pés (ex: 0 no chão, 50 na declinada)
  isKneePivot?: boolean;    // Flexão com apoio de joelho
  isUnilateral?: boolean;   // Flexão de um braço só
  isClap?: boolean;         // Fase aérea com palmas
  handsFarBack?: boolean;   // Pseudo-planche (mãos próximas à cintura)
  propType?: 'floor' | 'box' | 'wall';
}

export const createPushupAnimation = (
  id: string,
  name: string,
  options: PushupOptions = {},
  customMuscles?: { primary?: string[]; secondary?: string[] }
): ExerciseAnimationDef => {
  const handH = options.handHeight ?? 0;
  const feetH = options.feetHeight ?? 0;
  const isKnees = options.isKneePivot ?? false;

  return {
    exerciseId: id,
    name,
    familyId: 1,
    familyName: 'Empurrar horizontal (flexões)',
    view: 'side',
    timingType: 'smooth-loop',
    durationSeconds: 3.2,
    primaryMuscles: customMuscles?.primary ?? ['peito', 'triceps', 'ombros'],
    secondaryMuscles: customMuscles?.secondary ?? ['abdomen', 'quadriceps'],
    generatePose: (tNorm: number): PoseState => {
      const phase = sineLoopPhase(tNorm); // 0 = topo (braços estendidos), 1 = fundo (peito no apoio)
      const effort = phase; // Pico de esforço concêntrico na reversão no fundo

      // Apoio das mãos fixo
      const handX = 240 + (options.handsFarBack ? -30 : 0);
      const handY = GROUND_Y - handH;

      // Ponto de pivô dos pés ou joelhos
      const pivotX = 85;
      const pivotY = GROUND_Y - feetH;

      // Ângulo do corpo do pivô ao ombro:
      // No topo: ombro mais elevado. No fundo: peito aproxima do apoio
      const topElevation = handH > 100 ? 15 : 68; // Parede vs chão
      const bottomElevation = handH > 100 ? 2 : 28;

      const currentElevation = lerp(topElevation, bottomElevation, phase);

      // Comprimento tronco + pernas (ou tronco + coxa se joelhos)
      const bodyLen = isKnees
        ? BONE_LENGTHS.torso + BONE_LENGTHS.thigh
        : BONE_LENGTHS.torso + BONE_LENGTHS.thigh + BONE_LENGTHS.shin;

      // Calcula ombro e quadril na linha rígida do corpo
      const shoulderY = handY - currentElevation;
      const dy = shoulderY - pivotY;
      const dx = Math.sqrt(Math.max(10, bodyLen * bodyLen - dy * dy));
      const shoulderX = pivotX + dx;

      const bodyAngle = Math.atan2(dy, dx);

      // Posição do quadril ao longo do corpo
      const hipDistFromPivot = isKnees ? BONE_LENGTHS.thigh : BONE_LENGTHS.thigh + BONE_LENGTHS.shin;
      const hip = {
        x: pivotX + Math.cos(bodyAngle) * hipDistFromPivot,
        y: pivotY + Math.sin(bodyAngle) * hipDistFromPivot,
      };

      const shoulder = { x: shoulderX, y: shoulderY };

      // Pescoço e Cabeça (alinhados com a coluna torácica)
      const neck = {
        x: shoulder.x + Math.cos(bodyAngle) * 12,
        y: shoulder.y + Math.sin(bodyAngle) * 12,
      };
      const head = {
        x: shoulder.x + Math.cos(bodyAngle) * BONE_LENGTHS.headCenterDistance,
        y: shoulder.y + Math.sin(bodyAngle) * BONE_LENGTHS.headCenterDistance,
      };

      // Braço e Antebraço via IK com cotovelo dobrando para trás (bendSign = -1)
      const wrist = { x: handX, y: handY - 4 };
      const elbow = solveTwoBoneIK(
        shoulder,
        wrist,
        BONE_LENGTHS.upperArm,
        BONE_LENGTHS.forearm,
        -1
      );

      // Pernas:
      let knee: Point2D;
      let ankle: Point2D;
      let toe: Point2D;

      if (isKnees) {
        knee = { x: pivotX, y: pivotY };
        ankle = { x: pivotX - 25, y: pivotY - 10 };
        toe = { x: pivotX - 35, y: pivotY - 5 };
      } else {
        ankle = { x: pivotX, y: pivotY };
        toe = { x: pivotX + 14, y: pivotY + 4 };
        // Joelho reto ou leve flexão natural
        knee = solveTwoBoneIK(
          hip,
          ankle,
          BONE_LENGTHS.thigh,
          BONE_LENGTHS.shin,
          1
        );
      }

      // Prop de apoio se houver
      let propCfg = undefined;
      if (options.propType === 'box' || handH > 0 && handH < 100) {
        propCfg = { type: 'box' as const, height: handH, width: 84, x: handX - 20 };
      } else if (options.propType === 'wall' || handH >= 100) {
        propCfg = { type: 'wall' as const, x: handX + 15 };
      }

      return {
        joints: {
          shoulder,
          elbow,
          wrist,
          hand: { x: handX, y: handY },
          hip,
          knee,
          ankle,
          toe,
          neck,
          head,
        },
        view: 'side',
        gazeAngle: bodyAngle,
        effort,
        shadow: {
          cx: (shoulder.x + pivotX) / 2,
          cy: GROUND_Y,
          rx: 130,
          ry: 7,
          opacity: 0.35,
        },
        prop: propCfg,
      };
    },
  };
};

// ==========================================
// 2. FAMÍLIA: AGACHAMENTOS, AFUNDOS E PANTURRILHA
// ==========================================

export interface SquatOptions {
  isPistol?: boolean;
  isCossack?: boolean;
  isSumo?: boolean;
  isJump?: boolean;
  isWallSit?: boolean;
  isStepUp?: boolean;
  isCalfRaise?: boolean;
  propType?: 'box' | 'wall' | 'floor';
  boxHeight?: number;
}

export const createSquatAnimation = (
  id: string,
  name: string,
  options: SquatOptions = {}
): ExerciseAnimationDef => {
  return {
    exerciseId: id,
    name,
    familyId: 6,
    familyName: 'Agachamentos, afundos e panturrilha',
    view: options.isSumo || options.isCossack ? 'front' : 'side',
    timingType: options.isWallSit ? 'isometric' : 'smooth-loop',
    durationSeconds: 3.4,
    primaryMuscles: options.isCalfRaise ? ['panturrilhas'] : ['quadriceps', 'gluteos'],
    secondaryMuscles: options.isCalfRaise ? ['isquiotibiais'] : ['posteriores', 'panturrilhas', 'abdomen'],
    generatePose: (tNorm: number): PoseState => {
      const phase = options.isWallSit ? 1.0 : sineLoopPhase(tNorm);
      const breath = options.isWallSit ? breathingDisplacement(tNorm, 1.2) : 0;
      const effort = phase;

      // Pés firmes no chão em y=GROUND_Y
      const ankleX = 185;
      const ankleY = options.isCalfRaise ? GROUND_Y - 4 - phase * 16 : GROUND_Y - 4;
      const toe = { x: ankleX + 22, y: GROUND_Y };
      const ankle = { x: ankleX, y: ankleY };

      // No agachamento: quadril desce e recua ligeiramente para trás
      const standingHipY = ankleY - (BONE_LENGTHS.thigh + BONE_LENGTHS.shin - 3);
      const deepHipY = ankleY - 46 + breath;

      const hipY = lerp(standingHipY, deepHipY, phase);
      const hipX = lerp(ankleX + 2, ankleX - 38, phase);
      const hip = { x: hipX, y: hipY };

      // Joelho projetado para frente via IK (bendSign = 1)
      const knee = solveTwoBoneIK(
        hip,
        ankle,
        BONE_LENGTHS.thigh,
        BONE_LENGTHS.shin,
        1
      );

      // Inclinação do tronco (de 0.12 rad em pé a 0.74 rad no fundo para equilíbrio de massas)
      const torsoAngle = lerp(0.12, 0.65, phase) - Math.PI / 2; // medido a partir da horizontal
      const shoulder = {
        x: hip.x + Math.cos(torsoAngle) * BONE_LENGTHS.torso,
        y: hip.y + Math.sin(torsoAngle) * BONE_LENGTHS.torso,
      };

      const neck = {
        x: shoulder.x + Math.cos(torsoAngle) * 12,
        y: shoulder.y + Math.sin(torsoAngle) * 12,
      };
      const head = {
        x: shoulder.x + Math.cos(torsoAngle) * BONE_LENGTHS.headCenterDistance,
        y: shoulder.y + Math.sin(torsoAngle) * BONE_LENGTHS.headCenterDistance,
      };

      // Braços estendidos à frente como contrapeso motor suave
      const armAngle = lerp(0.9, 0.05, phase); // braços levantam na descida
      const wrist = {
        x: shoulder.x + Math.cos(armAngle) * (BONE_LENGTHS.upperArm + BONE_LENGTHS.forearm - 4),
        y: shoulder.y + Math.sin(armAngle) * (BONE_LENGTHS.upperArm + BONE_LENGTHS.forearm - 4),
      };
      const elbow = solveTwoBoneIK(
        shoulder,
        wrist,
        BONE_LENGTHS.upperArm,
        BONE_LENGTHS.forearm,
        1
      );

      // Se for pistol squat: perna oposta estendida à frente
      let backKnee = knee;
      let backAnkle = ankle;
      let backToe = toe;

      if (options.isPistol) {
        const extAngle = lerp(0.15, -0.05, phase); // perna sobe na frente
        const legReach = BONE_LENGTHS.thigh + BONE_LENGTHS.shin - 4;
        backAnkle = {
          x: hip.x + Math.cos(extAngle) * legReach,
          y: hip.y + Math.sin(extAngle) * legReach,
        };
        backToe = { x: backAnkle.x + 18, y: backAnkle.y + 3 };
        backKnee = solveTwoBoneIK(hip, backAnkle, BONE_LENGTHS.thigh, BONE_LENGTHS.shin, -1);
      }

      return {
        joints: {
          shoulder,
          elbow,
          wrist,
          hand: { x: wrist.x + 6, y: wrist.y },
          hip,
          knee,
          ankle,
          toe,
          neck,
          head,
          backKnee: options.isPistol ? backKnee : undefined,
          backAnkle: options.isPistol ? backAnkle : undefined,
          backToe: options.isPistol ? backToe : undefined,
        },
        view: 'side',
        gazeAngle: 0,
        effort,
        shadow: {
          cx: (hip.x + ankle.x) / 2,
          cy: GROUND_Y,
          rx: 90,
          ry: 6,
          opacity: 0.38,
        },
        prop: options.propType === 'wall'
          ? { type: 'wall', x: hip.x - 12 }
          : options.propType === 'box'
          ? { type: 'box', height: options.boxHeight || 50, x: ankle.x - 40 }
          : undefined,
      };
    },
  };
};

// ==========================================
// 3. FAMÍLIA: PUXAR VERTICAL (SUSPENSÃO)
// ==========================================

export interface PullupOptions {
  isChinup?: boolean;
  isDeadHang?: boolean;
  isScapularOnly?: boolean;
  isLsitPullup?: boolean;
  isNegative?: boolean;
  isBandAssisted?: boolean;
  isMuscleup?: boolean;
}

export const createPullupAnimation = (
  id: string,
  name: string,
  options: PullupOptions = {}
): ExerciseAnimationDef => {
  const barX = 200;
  const barY = 46;

  return {
    exerciseId: id,
    name,
    familyId: 4,
    familyName: 'Puxar vertical (suspensão)',
    view: 'side',
    timingType: options.isDeadHang ? 'isometric' : options.isNegative ? 'eccentric' : 'smooth-loop',
    durationSeconds: options.isNegative ? 4.5 : 3.2,
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['ombros', 'antebraco', 'abdomen'],
    generatePose: (tNorm: number): PoseState => {
      let phase: number;
      if (options.isDeadHang) {
        phase = 0;
      } else if (options.isNegative) {
        phase = eccentricPhase(tNorm);
      } else {
        phase = sineLoopPhase(tNorm); // 0 = suspensão (fundo), 1 = queixo acima da barra (topo)
      }

      const breath = options.isDeadHang ? breathingDisplacement(tNorm, 1.2) : 0;
      const effort = phase;

      // Punhos fixos na barra
      const wrist = { x: barX, y: barY };
      const hand = { x: barX, y: barY };

      // Altura do ombro:
      // Fundo (Dead Hang): ombro 72 px abaixo da barra
      // Topo: ombro a apenas 14 px abaixo da barra (queixo passa a barra)
      const hangShoulderY = barY + 72 + breath;
      const topShoulderY = options.isMuscleup
        ? barY - 32 // No muscle up, ombro passa acima da barra em apoio
        : barY + 16;

      const shoulderY = options.isScapularOnly
        ? hangShoulderY - phase * 10
        : lerp(hangShoulderY, topShoulderY, phase);

      const shoulder = { x: barX - 4, y: shoulderY };

      // Cotovelo via IK (dobra para trás e para baixo: bendSign = -1)
      const elbow = solveTwoBoneIK(
        shoulder,
        wrist,
        BONE_LENGTHS.upperArm,
        BONE_LENGTHS.forearm,
        -1
      );

      // Tronco vertical com leve inclinação torácica (peito apontando para a barra)
      const torsoAngle = Math.PI / 2 - lerp(0.08, 0.28, phase);
      const hip = {
        x: shoulder.x - Math.cos(torsoAngle) * BONE_LENGTHS.torso,
        y: shoulder.y + Math.sin(torsoAngle) * BONE_LENGTHS.torso,
      };

      // Cabeça orientada para a barra
      const neck = { x: shoulder.x, y: shoulder.y - 12 };
      const head = { x: shoulder.x + 2, y: shoulder.y - BONE_LENGTHS.headCenterDistance };

      // Pernas:
      let knee: Point2D;
      let ankle: Point2D;
      let toe: Point2D;

      if (options.isLsitPullup) {
        // Pernas estendidas em 90°
        ankle = { x: hip.x + 85, y: hip.y };
        knee = { x: hip.x + 48, y: hip.y };
        toe = { x: ankle.x + 16, y: ankle.y + 4 };
      } else {
        // Joelhos dobrados confortavelmente atrás para não bater no chão
        const kneeAngle = Math.PI / 2 + 0.25;
        knee = {
          x: hip.x - Math.cos(kneeAngle) * BONE_LENGTHS.thigh,
          y: hip.y + Math.sin(kneeAngle) * BONE_LENGTHS.thigh,
        };
        ankle = { x: knee.x - 22, y: knee.y + 36 };
        toe = { x: ankle.x - 8, y: ankle.y + 14 };
      }

      return {
        joints: {
          shoulder,
          elbow,
          wrist,
          hand,
          hip,
          knee,
          ankle,
          toe,
          neck,
          head,
        },
        view: 'side',
        gazeAngle: -0.4, // Olhar para cima em direção à barra
        effort,
        shadow: {
          cx: shoulder.x,
          cy: GROUND_Y,
          rx: 60,
          ry: 4,
          opacity: 0.25,
        },
        prop: {
          type: 'pullupBar',
          x: barX,
          y: barY,
        },
      };
    },
  };
};

// ==========================================
// 4. FAMÍLIA: MERGULHOS (PARALELAS E BANCO)
// ==========================================

export interface DipOptions {
  type: 'parallel' | 'bench' | 'rings' | 'tricepsBar';
  isWeighted?: boolean;
  isNegative?: boolean;
}

export const createDipAnimation = (
  id: string,
  name: string,
  options: DipOptions
): ExerciseAnimationDef => {
  const isBench = options.type === 'bench';
  const barY = isBench ? 190 : 140;
  const barX = isBench ? 150 : 200;

  return {
    exerciseId: id,
    name,
    familyId: 3,
    familyName: 'Mergulhos',
    view: 'side',
    timingType: options.isNegative ? 'eccentric' : 'smooth-loop',
    durationSeconds: options.isNegative ? 4.2 : 3.2,
    primaryMuscles: ['triceps', 'peito'],
    secondaryMuscles: ['ombros'],
    generatePose: (tNorm: number): PoseState => {
      const phase = options.isNegative ? eccentricPhase(tNorm) : sineLoopPhase(tNorm);
      const effort = phase;

      // Mão fixa na barra/banco
      const wrist = { x: barX, y: barY };
      const hand = { x: barX, y: barY };

      // Altura do ombro:
      // Topo (bloqueio de braços): ombro ~68 px acima da mão
      // Fundo (cotovelos a 90°): ombro na mesma altura ou pouco acima da mão (30 px)
      const topShoulderY = barY - 66;
      const bottomShoulderY = barY - 26;
      const shoulderY = lerp(topShoulderY, bottomShoulderY, phase);

      // Leve inclinação do tronco à frente no fundo
      const torsoForwardTilt = lerp(0.05, 0.28, phase);
      const shoulder = { x: barX - 12 + torsoForwardTilt * 25, y: shoulderY };

      // Cotovelos dobram para trás (bendSign = -1)
      const elbow = solveTwoBoneIK(
        shoulder,
        wrist,
        BONE_LENGTHS.upperArm,
        BONE_LENGTHS.forearm,
        -1
      );

      // Tronco e Quadril
      const hip = {
        x: shoulder.x - torsoForwardTilt * 40,
        y: shoulder.y + BONE_LENGTHS.torso - 4,
      };

      const neck = { x: shoulder.x + 3, y: shoulder.y - 12 };
      const head = { x: shoulder.x + 6, y: shoulder.y - BONE_LENGTHS.headCenterDistance };

      // Pernas
      let knee: Point2D;
      let ankle: Point2D;
      let toe: Point2D;

      if (isBench) {
        // No mergulho no banco: pernas estendidas à frente no chão
        ankle = { x: barX + 90, y: GROUND_Y - 4 };
        toe = { x: ankle.x + 20, y: GROUND_Y };
        knee = solveTwoBoneIK(hip, ankle, BONE_LENGTHS.thigh, BONE_LENGTHS.shin, 1);
      } else {
        // Em paralelas: pernas dobradas confortavelmente atrás
        knee = { x: hip.x + 15, y: hip.y + 44 };
        ankle = { x: knee.x - 24, y: knee.y + 36 };
        toe = { x: ankle.x - 6, y: ankle.y + 12 };
      }

      return {
        joints: {
          shoulder,
          elbow,
          wrist,
          hand,
          hip,
          knee,
          ankle,
          toe,
          neck,
          head,
        },
        view: 'side',
        gazeAngle: 0.1,
        effort,
        shadow: {
          cx: shoulder.x,
          cy: GROUND_Y,
          rx: 70,
          ry: 5,
          opacity: 0.32,
        },
        prop: isBench
          ? { type: 'box', height: GROUND_Y - barY, width: 65, x: barX - 60 }
          : { type: 'dipBars', x: barX - 70, y: barY },
      };
    },
  };
};

// ==========================================
// 5. FAMÍLIA: PUXAR HORIZONTAL (REMADA INVERTIDA)
// ==========================================

export const createRowAnimation = (
  id: string,
  name: string,
  options: { isKneesBent?: boolean; isFeetElevated?: boolean; isTowelDoor?: boolean } = {}
): ExerciseAnimationDef => {
  const barX = 230;
  const barY = 120;

  return {
    exerciseId: id,
    name,
    familyId: 5,
    familyName: 'Puxar horizontal (remada invertida)',
    view: 'side',
    timingType: 'smooth-loop',
    durationSeconds: 3.2,
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['ombros', 'abdomen'],
    generatePose: (tNorm: number): PoseState => {
      const phase = sineLoopPhase(tNorm); // 0 = braços estendidos, 1 = peito toca a barra
      const effort = phase;

      const hand = { x: barX, y: barY };
      const wrist = { x: barX, y: barY };

      // Pés apoiados como pivô nos calcanhares
      const pivotX = 75;
      const pivotY = options.isFeetElevated ? GROUND_Y - 50 : GROUND_Y - 4;

      // O peito sobe até a barra
      const bottomShoulder = { x: barX - 42, y: barY + 62 };
      const topShoulder = { x: barX - 10, y: barY + 16 };
      const shoulder = lerpPoint(bottomShoulder, topShoulder, phase);

      // Cotovelo via IK (dobra para trás)
      const elbow = solveTwoBoneIK(
        shoulder,
        wrist,
        BONE_LENGTHS.upperArm,
        BONE_LENGTHS.forearm,
        1
      );

      // Linha do corpo rígido
      const bodyAngle = Math.atan2(shoulder.y - pivotY, shoulder.x - pivotX);
      const hipDist = BONE_LENGTHS.thigh + BONE_LENGTHS.shin;
      const hip = {
        x: pivotX + Math.cos(bodyAngle) * hipDist,
        y: pivotY + Math.sin(bodyAngle) * hipDist,
      };

      const neck = {
        x: shoulder.x + Math.cos(bodyAngle) * 12,
        y: shoulder.y + Math.sin(bodyAngle) * 12,
      };
      const head = {
        x: shoulder.x + Math.cos(bodyAngle) * BONE_LENGTHS.headCenterDistance,
        y: shoulder.y + Math.sin(bodyAngle) * BONE_LENGTHS.headCenterDistance,
      };

      const ankle = { x: pivotX, y: pivotY };
      const toe = { x: pivotX + 16, y: pivotY - 8 };
      const knee = solveTwoBoneIK(hip, ankle, BONE_LENGTHS.thigh, BONE_LENGTHS.shin, 1);

      return {
        joints: {
          shoulder,
          elbow,
          wrist,
          hand,
          hip,
          knee,
          ankle,
          toe,
          neck,
          head,
        },
        view: 'side',
        gazeAngle: bodyAngle,
        effort,
        shadow: {
          cx: (shoulder.x + pivotX) / 2,
          cy: GROUND_Y,
          rx: 110,
          ry: 5,
          opacity: 0.30,
        },
        prop: options.isFeetElevated
          ? { type: 'box', height: 50, width: 60, x: pivotX - 40 }
          : { type: 'lowBar', x: barX, y: barY },
      };
    },
  };
};

// ==========================================
// 6. FAMÍLIA: PRANCHAS, ISOMETRIAS E ESTABILIDADE
// ==========================================

export const createPlankAnimation = (
  id: string,
  name: string,
  _options: { isSide?: boolean; isForearms?: boolean } = {}
): ExerciseAnimationDef => {
  return {
    exerciseId: id,
    name,
    familyId: 8,
    familyName: 'Pranchas, isometrias e estabilidade',
    view: 'side',
    timingType: 'isometric',
    durationSeconds: 3.5,
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['ombros', 'lombar', 'gluteos'],
    generatePose: (tNorm: number): PoseState => {
      const breath = breathingDisplacement(tNorm, 1.2);
      const effort = 0.85;

      const toe = { x: 90, y: GROUND_Y };
      const ankle = { x: 80, y: GROUND_Y - 4 };

      // Corpo reto em diagonal
      const shoulderX = 260;
      const shoulderY = GROUND_Y - 58 + breath;
      const shoulder = { x: shoulderX, y: shoulderY };

      // Apoio nos antebraços (cotovelo diretamente abaixo do ombro)
      const elbow = { x: shoulderX, y: GROUND_Y - 4 };
      const wrist = { x: shoulderX + 28, y: GROUND_Y - 4 };
      const hand = { x: wrist.x + 8, y: GROUND_Y - 4 };

      const bodyAngle = Math.atan2(shoulderY - ankle.y, shoulderX - ankle.x);
      const hipDist = BONE_LENGTHS.thigh + BONE_LENGTHS.shin;
      const hip = {
        x: ankle.x + Math.cos(bodyAngle) * hipDist,
        y: ankle.y + Math.sin(bodyAngle) * hipDist + breath * 0.4,
      };

      const knee = solveTwoBoneIK(hip, ankle, BONE_LENGTHS.thigh, BONE_LENGTHS.shin, 1);

      const neck = {
        x: shoulder.x + Math.cos(bodyAngle) * 12,
        y: shoulder.y + Math.sin(bodyAngle) * 12,
      };
      const head = {
        x: shoulder.x + Math.cos(bodyAngle) * BONE_LENGTHS.headCenterDistance,
        y: shoulder.y + Math.sin(bodyAngle) * BONE_LENGTHS.headCenterDistance,
      };

      return {
        joints: {
          shoulder,
          elbow,
          wrist,
          hand,
          hip,
          knee,
          ankle,
          toe,
          neck,
          head,
        },
        view: 'side',
        gazeAngle: 0.8, // Olhar para o chão
        effort,
        shadow: {
          cx: (shoulder.x + ankle.x) / 2,
          cy: GROUND_Y,
          rx: 120,
          ry: 6,
          opacity: 0.35,
        },
      };
    },
  };
};

// ==========================================
// 7. FAMÍLIA: CADEIA POSTERIOR (PONTE DE GLÚTEO)
// ==========================================

export const createGluteBridgeAnimation = (
  id: string,
  name: string,
  _options: { isUnilateral?: boolean; isHipThrust?: boolean } = {}
): ExerciseAnimationDef => {
  return {
    exerciseId: id,
    name,
    familyId: 7,
    familyName: 'Cadeia posterior',
    view: 'side',
    timingType: 'smooth-loop',
    durationSeconds: 3.2,
    primaryMuscles: ['gluteos', 'posteriores'],
    secondaryMuscles: ['lombar', 'abdomen'],
    generatePose: (tNorm: number): PoseState => {
      const phase = sineLoopPhase(tNorm); // 0 = quadril no chão, 1 = extensão total do quadril
      const effort = phase;

      // Ombros e cabeça apoiados no chão
      const shoulder = { x: 140, y: GROUND_Y - 14 };
      const neck = { x: shoulder.x - 12, y: shoulder.y };
      const head = { x: shoulder.x - BONE_LENGTHS.headCenterDistance, y: shoulder.y };

      // Pés fixos no chão
      const ankle = { x: 265, y: GROUND_Y - 4 };
      const toe = { x: ankle.x + 20, y: GROUND_Y };

      // Quadril sobe em arco:
      // Fundo: quadril quase no chão (y = GROUND_Y - 18)
      // Topo: alinha joelho-quadril-ombro (y = GROUND_Y - 68)
      const hipY = lerp(GROUND_Y - 18, GROUND_Y - 68, phase);
      const hipX = 205;
      const hip = { x: hipX, y: hipY };

      // Joelho via IK
      const knee = solveTwoBoneIK(hip, ankle, BONE_LENGTHS.thigh, BONE_LENGTHS.shin, -1);

      // Braços relaxados ao lado do corpo no chão
      const elbow = { x: shoulder.x + 26, y: GROUND_Y - 8 };
      const wrist = { x: elbow.x + 30, y: GROUND_Y - 6 };

      return {
        joints: {
          shoulder,
          elbow,
          wrist,
          hand: { x: wrist.x + 6, y: wrist.y },
          hip,
          knee,
          ankle,
          toe,
          neck,
          head,
        },
        view: 'side',
        gazeAngle: -Math.PI / 2, // Olhar para cima
        effort,
        shadow: {
          cx: (shoulder.x + ankle.x) / 2,
          cy: GROUND_Y,
          rx: 100,
          ry: 5,
          opacity: 0.35,
        },
      };
    },
  };
};

// ==========================================
// 8. FAMÍLIA: DEITADO (DEAD BUG & ABDOMINAIS)
// ==========================================

export const createDeadBugAnimation = (
  id: string,
  name: string
): ExerciseAnimationDef => {
  return {
    exerciseId: id,
    name,
    familyId: 9,
    familyName: 'Deitado (abdominais)',
    view: 'side',
    timingType: 'smooth-loop',
    durationSeconds: 3.4,
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['lombar'],
    generatePose: (tNorm: number): PoseState => {
      const phase = sineLoopPhase(tNorm);
      const effort = 0.5 + phase * 0.45;

      // Costas e cabeça no chão
      const shoulder = { x: 180, y: GROUND_Y - 14 };
      const neck = { x: shoulder.x - 12, y: shoulder.y };
      const head = { x: shoulder.x - BONE_LENGTHS.headCenterDistance, y: shoulder.y };
      const hip = { x: shoulder.x + BONE_LENGTHS.torso - 4, y: GROUND_Y - 16 };

      // Braço próximo vai para trás em direção ao chão
      const armAngle = lerp(-Math.PI / 2, -Math.PI + 0.25, phase);
      const elbow = {
        x: shoulder.x + Math.cos(armAngle) * BONE_LENGTHS.upperArm,
        y: shoulder.y + Math.sin(armAngle) * BONE_LENGTHS.upperArm,
      };
      const wrist = {
        x: elbow.x + Math.cos(armAngle) * BONE_LENGTHS.forearm,
        y: elbow.y + Math.sin(armAngle) * BONE_LENGTHS.forearm,
      };

      // Perna oposta desce estendida em direção ao chão
      const legAngle = lerp(0.12, 0.42, phase);
      const knee = {
        x: hip.x + Math.cos(legAngle) * BONE_LENGTHS.thigh,
        y: hip.y - Math.sin(legAngle) * BONE_LENGTHS.thigh,
      };
      const ankle = {
        x: knee.x + Math.cos(legAngle - 0.1) * BONE_LENGTHS.shin,
        y: knee.y - Math.sin(legAngle - 0.1) * BONE_LENGTHS.shin,
      };
      const toe = { x: ankle.x + 16, y: ankle.y + 4 };

      return {
        joints: {
          shoulder,
          elbow,
          wrist,
          hand: { x: wrist.x + 5, y: wrist.y },
          hip,
          knee,
          ankle,
          toe,
          neck,
          head,
        },
        view: 'side',
        gazeAngle: -Math.PI / 2,
        effort,
        shadow: {
          cx: 200,
          cy: GROUND_Y,
          rx: 110,
          ry: 5,
          opacity: 0.35,
        },
      };
    },
  };
};

// ==========================================
// 9. FAMÍLIA: EMPURRAR VERTICAL (HANDSTAND & PIKE)
// ==========================================

export const createHandstandAnimation = (
  id: string,
  name: string,
  options: { isPike?: boolean; isHSPU?: boolean; isWall?: boolean } = {}
): ExerciseAnimationDef => {
  return {
    exerciseId: id,
    name,
    familyId: 2,
    familyName: 'Empurrar vertical',
    view: 'side',
    timingType: options.isHSPU ? 'smooth-loop' : 'isometric',
    durationSeconds: 3.2,
    primaryMuscles: ['ombros', 'triceps'],
    secondaryMuscles: ['costas', 'abdomen'],
    generatePose: (tNorm: number): PoseState => {
      const phase = options.isHSPU ? sineLoopPhase(tNorm) : 0;
      const breath = breathingDisplacement(tNorm, 1.0);
      const effort = 0.7 + phase * 0.3;

      const handX = 200;
      const handY = GROUND_Y - 4;
      const hand = { x: handX, y: handY };
      const wrist = { x: handX, y: handY };

      if (options.isPike) {
        // Pike: V invertido com quadril alto
        const hipX = handX - 52;
        const hipY = GROUND_Y - 110 + phase * 22;
        const hip = { x: hipX, y: hipY };

        // Ombro entre as mãos e quadril
        const shoulderY = lerp(handY - 68, handY - 26, phase);
        const shoulder = { x: handX - 16, y: shoulderY };

        const elbow = solveTwoBoneIK(shoulder, wrist, BONE_LENGTHS.upperArm, BONE_LENGTHS.forearm, -1);
        const neck = { x: shoulder.x - 8, y: shoulder.y + 10 };
        const head = { x: shoulder.x - 16, y: shoulder.y + 18 };

        const ankle = { x: hipX - 65, y: GROUND_Y - 4 };
        const toe = { x: ankle.x + 18, y: GROUND_Y };
        const knee = solveTwoBoneIK(hip, ankle, BONE_LENGTHS.thigh, BONE_LENGTHS.shin, 1);

        return {
          joints: {
            shoulder,
            elbow,
            wrist,
            hand,
            hip,
            knee,
            ankle,
            toe,
            neck,
            head,
          },
          view: 'side',
          gazeAngle: 1.2,
          effort,
          shadow: {
            cx: (handX + ankle.x) / 2,
            cy: GROUND_Y,
            rx: 90,
            ry: 5,
            opacity: 0.35,
          },
        };
      } else {
        // Handstand invertido vertical
        const topShoulderY = handY - 68 + breath;
        const bottomShoulderY = handY - 24; // HSPU desce perto do solo
        const shoulderY = lerp(topShoulderY, bottomShoulderY, phase);
        const shoulder = { x: handX, y: shoulderY };

        const elbow = solveTwoBoneIK(shoulder, wrist, BONE_LENGTHS.upperArm, BONE_LENGTHS.forearm, -1);

        // Corpo estendido para cima
        const hip = { x: shoulder.x, y: shoulder.y - BONE_LENGTHS.torso };
        const knee = { x: hip.x, y: hip.y - BONE_LENGTHS.thigh };
        const ankle = { x: knee.x, y: knee.y - BONE_LENGTHS.shin };
        const toe = { x: ankle.x, y: ankle.y - 18 };

        const neck = { x: shoulder.x, y: shoulder.y + 10 };
        const head = { x: shoulder.x, y: shoulder.y + BONE_LENGTHS.headCenterDistance - 8 };

        return {
          joints: {
            shoulder,
            elbow,
            wrist,
            hand,
            hip,
            knee,
            ankle,
            toe,
            neck,
            head,
          },
          view: 'side',
          gazeAngle: 0.2,
          effort,
          shadow: {
            cx: handX,
            cy: GROUND_Y,
            rx: 40,
            ry: 4,
            opacity: 0.38,
          },
          prop: options.isWall ? { type: 'wall', x: handX - 25 } : undefined,
        };
      }
    },
  };
};

// ==========================================
// 10. FAMÍLIA: SKILLS (L-SIT, PLANCHE, FRONT LEVER)
// ==========================================

export const createSkillAnimation = (
  id: string,
  name: string,
  skillType: 'lsit' | 'planche' | 'frontlever' | 'backlever' | 'flag'
): ExerciseAnimationDef => {
  return {
    exerciseId: id,
    name,
    familyId: 11,
    familyName: 'Skills',
    view: 'side',
    timingType: 'isometric',
    durationSeconds: 3.5,
    primaryMuscles: skillType === 'lsit' ? ['abdomen'] : skillType === 'frontlever' ? ['costas', 'abdomen'] : ['ombros', 'peito'],
    secondaryMuscles: ['ombros', 'triceps'],
    generatePose: (tNorm: number): PoseState => {
      const breath = breathingDisplacement(tNorm, 1.0);
      const effort = 0.95;

      if (skillType === 'lsit') {
        // L-Sit em paralelas: tronco vertical, pernas estritamente a 90° horizontal
        const barX = 180;
        const barY = 160;
        const wrist = { x: barX, y: barY };
        const hand = { x: barX, y: barY };

        const shoulder = { x: barX, y: barY - 68 + breath };
        const elbow = { x: barX, y: barY - 34 + breath };

        const hip = { x: shoulder.x, y: barY - 8 };
        const knee = { x: hip.x + BONE_LENGTHS.thigh, y: hip.y };
        const ankle = { x: knee.x + BONE_LENGTHS.shin, y: hip.y };
        const toe = { x: ankle.x + 18, y: ankle.y + 2 };

        const neck = { x: shoulder.x, y: shoulder.y - 12 };
        const head = { x: shoulder.x, y: shoulder.y - BONE_LENGTHS.headCenterDistance };

        return {
          joints: {
            shoulder,
            elbow,
            wrist,
            hand,
            hip,
            knee,
            ankle,
            toe,
            neck,
            head,
          },
          view: 'side',
          gazeAngle: 0,
          effort,
          shadow: {
            cx: barX + 30,
            cy: GROUND_Y,
            rx: 75,
            ry: 5,
            opacity: 0.30,
          },
          prop: { type: 'dipBars', x: barX - 40, y: barY },
        };
      } else if (skillType === 'frontlever') {
        // Front Lever pendurado na barra: corpo 180° horizontal virado para cima
        const barX = 160;
        const barY = 60;
        const wrist = { x: barX, y: barY };
        const hand = { x: barX, y: barY };

        const shoulder = { x: barX, y: barY + 68 + breath };
        const elbow = { x: barX, y: barY + 34 + breath };

        const hip = { x: shoulder.x + BONE_LENGTHS.torso, y: shoulder.y };
        const knee = { x: hip.x + BONE_LENGTHS.thigh, y: shoulder.y };
        const ankle = { x: knee.x + BONE_LENGTHS.shin, y: shoulder.y };
        const toe = { x: ankle.x + 18, y: shoulder.y };

        const neck = { x: shoulder.x - 12, y: shoulder.y };
        const head = { x: shoulder.x - BONE_LENGTHS.headCenterDistance, y: shoulder.y };

        return {
          joints: {
            shoulder,
            elbow,
            wrist,
            hand,
            hip,
            knee,
            ankle,
            toe,
            neck,
            head,
          },
          view: 'side',
          gazeAngle: -Math.PI / 2,
          effort,
          shadow: {
            cx: barX + 80,
            cy: GROUND_Y,
            rx: 90,
            ry: 5,
            opacity: 0.25,
          },
          prop: { type: 'pullupBar', x: barX, y: barY },
        };
      } else {
        // Planche horizontal
        const handX = 220;
        const handY = GROUND_Y - 4;
        const wrist = { x: handX, y: handY };
        const hand = { x: handX, y: handY };

        // Mãos sob o quadril, ombro projetado à frente em protração
        const shoulder = { x: handX + 42, y: handY - 62 + breath };
        const elbow = solveTwoBoneIK(shoulder, wrist, BONE_LENGTHS.upperArm, BONE_LENGTHS.forearm, 1);

        const hip = { x: handX - 22, y: shoulder.y };
        const knee = { x: hip.x - BONE_LENGTHS.thigh, y: shoulder.y };
        const ankle = { x: knee.x - BONE_LENGTHS.shin, y: shoulder.y };
        const toe = { x: ankle.x - 18, y: shoulder.y };

        const neck = { x: shoulder.x + 12, y: shoulder.y };
        const head = { x: shoulder.x + BONE_LENGTHS.headCenterDistance, y: shoulder.y };

        return {
          joints: {
            shoulder,
            elbow,
            wrist,
            hand,
            hip,
            knee,
            ankle,
            toe,
            neck,
            head,
          },
          view: 'side',
          gazeAngle: 0.4,
          effort,
          shadow: {
            cx: handX,
            cy: GROUND_Y,
            rx: 110,
            ry: 5,
            opacity: 0.38,
          },
        };
      }
    },
  };
};

// ==========================================
// 11. MAPA GERAL DOS 208 EXERCÍCIOS
// ==========================================

export const getAnimationDefForExercise = (exerciseId: string, exerciseName: string): ExerciseAnimationDef => {
  const id = exerciseId.toLowerCase();

  // 1. Flexões (Empurrar Horizontal)
  if (id.includes('flexao') || id === 'pushup' || id === 'diamondpushup') {
    if (id.includes('parede')) return createPushupAnimation(id, exerciseName, { handHeight: 160, propType: 'wall' });
    if (id.includes('inclinada')) return createPushupAnimation(id, exerciseName, { handHeight: 70, propType: 'box' });
    if (id.includes('joelhos')) return createPushupAnimation(id, exerciseName, { isKneePivot: true });
    if (id.includes('declinada')) return createPushupAnimation(id, exerciseName, { feetHeight: 50, propType: 'box' });
    if (id.includes('pseudo-planche')) return createPushupAnimation(id, exerciseName, { handsFarBack: true });
    if (id.includes('unilateral')) return createPushupAnimation(id, exerciseName, { isUnilateral: true });
    if (id.includes('palmas') || id.includes('clap')) return createPushupAnimation(id, exerciseName, { isClap: true });
    return createPushupAnimation(id, exerciseName);
  }

  // 2. Empurrar Vertical
  if (id.includes('pike') || id.includes('handstand') || id.includes('hspu') || id === 'chute-parada-maos') {
    if (id.includes('pike')) return createHandstandAnimation(id, exerciseName, { isPike: true });
    if (id.includes('hspu')) return createHandstandAnimation(id, exerciseName, { isHSPU: true });
    return createHandstandAnimation(id, exerciseName, { isWall: !id.includes('livre') });
  }

  // 3. Mergulhos
  if (id.includes('dip') || id.includes('mergulho') || id.includes('extensao-triceps')) {
    if (id.includes('banco')) return createDipAnimation(id, exerciseName, { type: 'bench' });
    if (id.includes('argolas')) return createDipAnimation(id, exerciseName, { type: 'rings' });
    if (id.includes('negativa')) return createDipAnimation(id, exerciseName, { type: 'parallel', isNegative: true });
    return createDipAnimation(id, exerciseName, { type: 'parallel' });
  }

  // 4. Puxar Vertical
  if (id.includes('pullup') || id.includes('chinup') || id.includes('barra') || id.includes('dead-hang') || id.includes('suspensao')) {
    if (id.includes('dead-hang')) return createPullupAnimation(id, exerciseName, { isDeadHang: true });
    if (id.includes('escapular')) return createPullupAnimation(id, exerciseName, { isScapularOnly: true });
    if (id.includes('lsit')) return createPullupAnimation(id, exerciseName, { isLsitPullup: true });
    if (id.includes('negativa') || id.includes('excentrico')) return createPullupAnimation(id, exerciseName, { isNegative: true });
    if (id.includes('muscleup') || id.includes('muscle-up')) return createPullupAnimation(id, exerciseName, { isMuscleup: true });
    return createPullupAnimation(id, exerciseName, { isChinup: id.includes('chinup') });
  }

  // 5. Puxar Horizontal
  if (id.includes('australian') || id.includes('remada') || id.includes('rosca')) {
    return createRowAnimation(id, exerciseName, {
      isKneesBent: id.includes('joelhos'),
      isFeetElevated: id.includes('elevados'),
      isTowelDoor: id.includes('toalha') || id.includes('porta'),
    });
  }

  // 6. Pernas / Agachamentos
  if (id.includes('squat') || id.includes('agachamento') || id.includes('lunge') || id.includes('afundo') || id.includes('panturrilha') || id.includes('pogo') || id.includes('step-up')) {
    if (id.includes('pistol')) return createSquatAnimation(id, exerciseName, { isPistol: true });
    if (id.includes('parede') || id.includes('wall-sit')) return createSquatAnimation(id, exerciseName, { isWallSit: true, propType: 'wall' });
    if (id.includes('panturrilha')) return createSquatAnimation(id, exerciseName, { isCalfRaise: true });
    if (id.includes('sumo')) return createSquatAnimation(id, exerciseName, { isSumo: true });
    if (id.includes('cossack')) return createSquatAnimation(id, exerciseName, { isCossack: true });
    return createSquatAnimation(id, exerciseName);
  }

  // 7. Cadeia Posterior
  if (id.includes('ponte') || id.includes('hip-thrust') || id.includes('nordic') || id.includes('good-morning') || id.includes('stiff') || id.includes('leg-curl') || id.includes('quatro-apoios')) {
    return createGluteBridgeAnimation(id, exerciseName, {
      isUnilateral: id.includes('unilateral'),
      isHipThrust: id.includes('hip-thrust'),
    });
  }

  // 8. Pranchas
  if (id.includes('prancha') || id.includes('plank') || id.includes('hollow') || id.includes('superman') || id.includes('bird-dog') || id.includes('climber')) {
    return createPlankAnimation(id, exerciseName, { isSide: id.includes('lateral') });
  }

  // 9. Deitado (Abdominais)
  if (id.includes('dead-bug') || id.includes('crunch') || id.includes('abdominal') || id.includes('twist') || id.includes('flutter') || id.includes('heel-touch')) {
    return createDeadBugAnimation(id, exerciseName);
  }

  // 10. Skills
  if (id.includes('lsit') || id.includes('v-sit') || id.includes('planche') || id.includes('front-lever') || id.includes('back-lever') || id.includes('bandeira') || id.includes('flag')) {
    if (id.includes('front-lever')) return createSkillAnimation(id, exerciseName, 'frontlever');
    if (id.includes('back-lever')) return createSkillAnimation(id, exerciseName, 'backlever');
    if (id.includes('planche')) return createSkillAnimation(id, exerciseName, 'planche');
    if (id.includes('bandeira') || id.includes('flag')) return createSkillAnimation(id, exerciseName, 'flag');
    return createSkillAnimation(id, exerciseName, 'lsit');
  }

  // Default: Agachamento / Base biomecânica elegante
  return createSquatAnimation(id, exerciseName);
};
