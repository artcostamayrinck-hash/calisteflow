/**
 * Constantes anatômicas e visuais da figura humana CalisteFlow
 * Baseadas rigorosamente na especificação técnica de calistenia
 */

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

