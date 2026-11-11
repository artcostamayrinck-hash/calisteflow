/**
 * Constantes anatômicas e visuais da figura humana CalisteFlow
 * Baseadas rigorosamente na especificação técnica de calistenia
 */

import type {
  AvatarGender,
  AvatarBiotype,
  AvatarSkinTone,
  AvatarSettings,
} from './types';

export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 300;
export const GROUND_Y = 272;

// Comprimentos dos segmentos ósseos (em px)
export const BONE_LENGTHS = {
  upperArm: 38,
  forearm: 34,
  thigh: 56,
  shin: 52,
  torso: 66,
  headCenterDistance: 27,
  foot: 22,
} as const;

// Espessuras dos segmentos (início -> fim do segmento em px)
export const LIMB_WIDTHS = {
  torso: { start: 31, end: 26 },
  thigh: { start: 24, end: 17 },
  shin: { start: 16, end: 10 },
  foot: { start: 9, end: 7 },
  upperArm: { start: 14, end: 11 },
  forearm: { start: 11, end: 8 },
  neck: { start: 10, end: 9 },
  handRadius: 5.5,
  headRadius: 11,
  hairRadius: 13,
} as const;

// Cores e estilos do cenário
export const STAGE_THEME = {
  bgGradientTop: '#0F1B33',
  bgGradientBottom: '#050B18',
  groundBar: '#0A1222',
  groundLine: '#1F3B5C',
  shadowColor: 'rgba(0, 0, 0, 0.35)',
  shadowWidth: 280,
  shadowHeight: 12,
} as const;

// Paleta da figura humana
export const FIGURE_PALETTE = {
  // Pele lado próximo (com degradê vertical contínuo)
  skinTop: '#F3C4A6',
  skinBottom: '#B87A5B',

  // Pele lado oposto (profundidade / trás)
  skinBackTop: '#C99577',
  skinBackBottom: '#8A5A43',
  backLimbOffsetX: 6,
  backLimbOffsetY: -2,

  // Cabelo e rosto
  hair: '#1F2937',
  faceEye: '#0F172A',

  // Vestimenta
  shorts: '#1E293B',
  shortsWaistband: '#334155',
  sneaker: '#E2E8F0',
  sneakerSole: '#94A3B8',

  // Músculos destacados
  primaryMuscle: '#34D399',      // Verde esmeralda vibrante
  secondaryMuscle: '#22D3EE',    // Ciano vibrante
  muscleBaseOpacity: 0.35,
  musclePeakOpacity: 0.80,
  secondaryOpacityFactor: 0.80,

  // Props em cinza-azulado com leve perspectiva
  props: {
    boxFront: '#475569',
    boxTop: '#94A3B8',
    boxSide: '#334155',
    barSteel: '#CBD5E1',
    barBracket: '#64748B',
    barPost: '#334155',
    strap: '#1E293B',
    ringWood: '#D97706',
    wall: '#1E293B',
    wallSkirting: '#334155',
  }
} as const;

// ==========================================
// CONFIGURAÇÕES PADRÃO DO AVATAR
// ==========================================

export const DEFAULT_AVATAR_SETTINGS: AvatarSettings = {
  preferredStyle: 'anatomical',
  gender: 'masculino',
  biotype: 'medio',
  skinTone: 'claro',
  hairStyle: 'curto',
  clothing: 'bermuda',
  colorBlindMode: false,
};

// 5 Tons de Pele com iluminação vertical contínua (topo -> base)
export const SKIN_TONE_PALETTES: Record<
  AvatarSkinTone,
  {
    name: string;
    skinTop: string;
    skinBottom: string;
    skinBackTop: string;
    skinBackBottom: string;
  }
> = {
  claro: {
    name: 'Claro',
    skinTop: '#F3C4A6',
    skinBottom: '#B87A5B',
    skinBackTop: '#C99577',
    skinBackBottom: '#8A5A43',
  },
  moreno: {
    name: 'Moreno',
    skinTop: '#E0A37E',
    skinBottom: '#9E6746',
    skinBackTop: '#BA7F5B',
    skinBackBottom: '#77492C',
  },
  bronze: {
    name: 'Bronze',
    skinTop: '#C6865A',
    skinBottom: '#824F2C',
    skinBackTop: '#9F633B',
    skinBackBottom: '#5C3218',
  },
  escuro: {
    name: 'Escuro',
    skinTop: '#8D5538',
    skinBottom: '#502A16',
    skinBackTop: '#6B3B22',
    skinBackBottom: '#38190B',
  },
  retinto: {
    name: 'Retinto',
    skinTop: '#523223',
    skinBottom: '#2C160C',
    skinBackTop: '#3B2014',
    skinBackBottom: '#1B0B04',
  },
};

// Cores e estilos de cabelo
export const HAIR_COLORS = {
  preto: '#111827',
  castanho: '#372213',
  loiro: '#CA8A04',
  ruivo: '#B45309',
  grisalho: '#94A3B8',
};

// Paleta do Modo Daltônico (Substitui verde/ciano por Laranja/Azul com alto contraste)
export const COLORBLIND_PALETTE = {
  primaryMuscle: '#F97316',   // Laranja vibrante
  secondaryMuscle: '#3B82F6', // Azul royal vibrante
};

// Temas visuais para os 5 estilos
export const STYLE_THEMES = {
  mannequin: {
    skinNearTop: '#475569',
    skinNearBottom: '#334155',
    skinBackTop: '#1E293B',
    skinBackBottom: '#0F172A',
    jointRing: '#CBD5E1',
    jointStroke: '#1E293B',
  },
  silhouette: {
    fillNear: '#E2E8F0',
    fillBack: '#64748B',
    backOpacity: 0.6,
  },
  outline: {
    strokeNear: '#22D3EE',
    strokeWidth: 2,
    strokeBack: '#0EA5E9',
    backOpacity: 0.45,
  },
};

// Calcula espessuras escaladas conforme gênero e biotipo
export const getLimbWidths = (
  gender: AvatarGender = 'masculino',
  biotype: AvatarBiotype = 'medio'
) => {
  // Escala pelo biotipo
  let scale = 1.0;
  if (biotype === 'magro') scale = 0.85;
  if (biotype === 'atletico') scale = 1.15;
  if (biotype === 'maior') scale = 1.28;

  // Ajustes por modelo/gênero mantendo estritamente os comprimentos de osso da IK
  const isFemale = gender === 'feminino';
  const isNeutral = gender === 'neutro';

  const shoulderFactor = isFemale ? 0.86 : isNeutral ? 0.94 : 1.03;
  const waistFactor = isFemale ? 0.82 : biotype === 'atletico' ? 0.90 : 1.0;
  const hipFactor = isFemale ? 1.14 : isNeutral ? 1.04 : 0.98;

  return {
    torso: {
      start: Math.round(LIMB_WIDTHS.torso.start * scale * shoulderFactor),
      end: Math.round(LIMB_WIDTHS.torso.end * scale * hipFactor),
      midWaist: Math.round(22 * scale * waistFactor),
    },
    thigh: {
      start: Math.round(LIMB_WIDTHS.thigh.start * scale * (isFemale ? 1.08 : 1.0)),
      end: Math.round(LIMB_WIDTHS.thigh.end * scale),
    },
    shin: {
      start: Math.round(LIMB_WIDTHS.shin.start * scale),
      end: Math.round(LIMB_WIDTHS.shin.end * scale),
    },
    foot: {
      start: Math.round(LIMB_WIDTHS.foot.start * scale),
      end: Math.round(LIMB_WIDTHS.foot.end * scale),
    },
    upperArm: {
      start: Math.round(LIMB_WIDTHS.upperArm.start * scale * (biotype === 'atletico' ? 1.12 : 1.0)),
      end: Math.round(LIMB_WIDTHS.upperArm.end * scale),
    },
    forearm: {
      start: Math.round(LIMB_WIDTHS.forearm.start * scale * (biotype === 'atletico' ? 1.1 : 1.0)),
      end: Math.round(LIMB_WIDTHS.forearm.end * scale),
    },
    neck: {
      start: Math.round(LIMB_WIDTHS.neck.start * scale * (isFemale ? 0.88 : 1.0)),
      end: Math.round(LIMB_WIDTHS.neck.end * scale * (isFemale ? 0.88 : 1.0)),
    },
    handRadius: LIMB_WIDTHS.handRadius * (isFemale ? 0.92 : 1.0),
    headRadius: LIMB_WIDTHS.headRadius * (isFemale ? 0.94 : 1.0),
    hairRadius: LIMB_WIDTHS.hairRadius * (isFemale ? 0.96 : 1.0),
  };
};

