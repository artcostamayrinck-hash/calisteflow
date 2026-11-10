/**
 * Catálogo de Dados de Poses do Protótipo Aprovado (JSON estruturado em TypeScript)
 * Guarda âncoras, parâmetros e músculos como DADOS puros.
 */

import type { MuscleTuple } from './referenceEngine';

export interface RawPoseDef {
  id: string;
  name: string;
  model:
    | 'pull'
    | 'push'
    | 'squat'
    | 'bridge'
    | 'row'
    | 'plank'
    | 'dip'
    | 'lunge'
    | 'deadbug'
    | 'pike'
    | 'handstand'
    | 'pistol'
    | 'bulgarian'
    | 'calf'
    | 'hollow'
    | 'crunch'
    | 'superman'
    | 'bird_dog'
    | 'side_plank'
    | 'hanging_core'
    | 'dragon_flag'
    | 'ab_wheel'
    | 'mountain_climber'
    | 'nordic_curl'
    | 'cat_cow'
    | 'standing_mobility'
    | 'deep_squat_hold'
    | 'world_greatest_stretch'
    | 'seated_hip_mobility'
    | 'child_pose'
    | 'standing_stretch'
    | 'lsit_skill'
    | 'arm_balance'
    | 'planche_skill'
    | 'front_lever_skill'
    | 'back_lever_skill'
    | 'skin_the_cat'
    | 'human_flag'
    | 'kick_up_handstand';
  params?: Record<string, any>;
  far: [number, number];
  durationSeconds: number;
  muscles: MuscleTuple[];
}

export const REFERENCE_POSES_DATA: Record<string, RawPoseDef> = {
  // 1. Barra Fixa Pronada
  pullup: {
    id: 'pullup',
    name: 'Barra fixa pronada',
    model: 'pull',
    params: {
      barX: 215,
      barY: 34,
    },
    far: [6, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.18, -1, 0, 7, 22, 10],
      ['p', 'S', 'E', 0.5, 0, -1, 4, 15, 6],
      ['s', 'E', 'W', 0.45, 0, -1, 3, 13, 5],
      ['s', 'S', 'H', 0.55, 1, 0, 6, 16, 8],
    ],
  },

  // 2. Flexão Tradicional no Solo
  pushup: {
    id: 'pushup',
    name: 'Flexão de braços tradicional',
    model: 'push',
    params: {
      benchHeight: 0,
    },
    far: [7, -3],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.1, 0, 1, 7, 14, 9],
      ['p', 'S', 'E', 0.5, 0, -1, 3, 15, 6],
      ['p', 'S', 'E', 0.05, 1, 0, 0, 9, 9],
      ['s', 'S', 'H', 0.55, 0, 1, 6, 16, 7],
      ['s', 'H', 'K', 0.5, 0, 1, 6, 16, 8],
    ],
  },

  // 3. Flexão Inclinada na Caixa/Banco
  incline_pushup: {
    id: 'incline_pushup',
    name: 'Flexão inclinada',
    model: 'push',
    params: {
      benchHeight: 48,
    },
    far: [7, -3],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.1, 0, 1, 7, 14, 9],
      ['p', 'S', 'E', 0.5, 0, -1, 3, 15, 6],
      ['p', 'S', 'E', 0.05, 1, 0, 0, 9, 9],
      ['s', 'S', 'H', 0.55, 0, 1, 6, 16, 7],
      ['s', 'H', 'K', 0.5, 0, 1, 6, 16, 8],
    ],
  },
  'flexao-inclinada': {
    id: 'flexao-inclinada',
    name: 'Flexão Inclinada',
    model: 'push',
    params: {
      benchHeight: 48,
    },
    far: [7, -3],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.1, 0, 1, 7, 14, 9],
      ['p', 'S', 'E', 0.5, 0, -1, 3, 15, 6],
      ['p', 'S', 'E', 0.05, 1, 0, 0, 9, 9],
      ['s', 'S', 'H', 0.55, 0, 1, 6, 16, 7],
      ['s', 'H', 'K', 0.5, 0, 1, 6, 16, 8],
    ],
  },

  // 4. Agachamento Livre Tradicional
  squat: {
    id: 'squat',
    name: 'Agachamento livre',
    model: 'squat',
    params: {},
    far: [5, -2],
    durationSeconds: 3.8,
    muscles: [
      ['p', 'H', 'K', 0.5, 1, 0, 6, 24, 9],
      ['p', 'H', 'K', 0.08, -1, 0.3, 8, 12, 11],
      ['s', 'H', 'K', 0.55, -1, 0.2, 6, 22, 6],
      ['s', 'K', 'A', 0.35, -1, 0, 6, 16, 6],
      ['s', 'S', 'H', 0.5, 1, 0, 5, 18, 8],
    ],
  },

  // 5. Ponte de Glúteo no Solo
  bridge: {
    id: 'bridge',
    name: 'Ponte de glúteo',
    model: 'bridge',
    params: {},
    far: [6, -2],
    durationSeconds: 3.5,
    muscles: [
      ['p', 'S', 'H', 0.93, 0, 1, 4, 14, 12],
      ['s', 'H', 'K', 0.5, 0.4, 1, 6, 24, 7],
      ['s', 'S', 'H', 0.55, 0, -1, 5, 18, 6],
    ],
  },
  'ponte-gluteo': {
    id: 'ponte-gluteo',
    name: 'Ponte de Glúteo no Solo',
    model: 'bridge',
    params: {},
    far: [6, -2],
    durationSeconds: 3.5,
    muscles: [
      ['p', 'S', 'H', 0.93, 0, 1, 4, 14, 12],
      ['s', 'H', 'K', 0.5, 0.4, 1, 6, 24, 7],
      ['s', 'S', 'H', 0.55, 0, -1, 5, 18, 6],
    ],
  },

  // 6. Remada Invertida (Australian Pull-up)
  australianpullup: {
    id: 'australianpullup',
    name: 'Remada Invertida Tradicional',
    model: 'row',
    params: {
      barX: 180,
      barY: 110,
    },
    far: [6, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.2, -1, 0, 6, 20, 9],
      ['p', 'S', 'E', 0.5, 0, -1, 4, 14, 6],
      ['s', 'S', 'H', 0.05, -1, 0, 5, 14, 7],
      ['s', 'E', 'W', 0.45, 0, -1, 3, 12, 5],
    ],
  },

  // 7. Prancha Frontal Tradicional (Isometria com respiração)
  plank: {
    id: 'plank',
    name: 'Prancha Frontal Tradicional',
    model: 'plank',
    params: {},
    far: [6, -2],
    durationSeconds: 3.4,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 6, 22, 8],
      ['s', 'H', 'K', 0.5, 0, 1, 6, 18, 7],
      ['s', 'S', 'E', 0.2, 0, 1, 4, 12, 6],
    ],
  },

  // 8. Mergulho em Barras Paralelas (Dips)
  dip: {
    id: 'dip',
    name: 'Mergulho em Barras Paralelas',
    model: 'dip',
    params: {
      barY: 140,
    },
    far: [6, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'E', 0.5, 0, 1, 4, 15, 7],
      ['p', 'S', 'H', 0.15, 1, 0, 6, 16, 8],
      ['s', 'S', 'E', 0.05, 1, 0, 0, 9, 9],
      ['s', 'S', 'H', 0.55, 1, 0, 6, 15, 7],
    ],
  },

  // 9. Afundo Tradicional (Lunges)
  lunges: {
    id: 'lunges',
    name: 'Afundo Tradicional',
    model: 'lunge',
    params: {},
    far: [-8, 2],
    durationSeconds: 3.8,
    muscles: [
      ['p', 'H', 'K', 0.5, 1, 0, 6, 22, 8],
      ['p', 'H', 'K', 0.08, -1, 0.3, 7, 12, 10],
      ['s', 'H', 'K', 0.55, -1, 0.2, 6, 18, 6],
      ['s', 'K', 'A', 0.35, -1, 0, 5, 14, 5],
    ],
  },

  // 10. Dead Bug (Inseto Morto)
  'dead-bug': {
    id: 'dead-bug',
    name: 'Dead Bug (Inseto Morto)',
    model: 'deadbug',
    params: {},
    far: [5, -4],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 6, 20, 8],
      ['s', 'H', 'K', 0.15, 0, 1, 5, 14, 7],
      ['s', 'S', 'E', 0.3, 0, -1, 4, 12, 5],
    ],
  },

  // ==========================================
  // LOTE 2: DEMAIS EMPURRAR / PUXAR / PERNAS
  // ==========================================

  // 11. Flexão na Parede (Wall Push-up)
  'flexao-parede': {
    id: 'flexao-parede',
    name: 'Flexão na Parede',
    model: 'push',
    params: { benchHeight: 160 },
    far: [7, -3],
    durationSeconds: 3.4,
    muscles: [
      ['p', 'S', 'H', 0.1, 0, 1, 7, 14, 9],
      ['p', 'S', 'E', 0.5, 0, -1, 3, 15, 6],
      ['s', 'S', 'H', 0.55, 0, 1, 6, 16, 7],
    ],
  },

  // 12. Flexão de Braços com Joelhos
  'flexao-joelhos': {
    id: 'flexao-joelhos',
    name: 'Flexão de Braços com Joelhos',
    model: 'push',
    params: { isKnee: true },
    far: [7, -3],
    durationSeconds: 3.5,
    muscles: [
      ['p', 'S', 'H', 0.1, 0, 1, 7, 14, 9],
      ['p', 'S', 'E', 0.5, 0, -1, 3, 15, 6],
      ['p', 'S', 'E', 0.05, 1, 0, 0, 9, 9],
      ['s', 'S', 'H', 0.55, 0, 1, 6, 16, 7],
    ],
  },

  // 13. Flexão Declinada (Pés Elevados)
  'flexao-declinada': {
    id: 'flexao-declinada',
    name: 'Flexão Declinada (Pés Elevados)',
    model: 'push',
    params: { feetHeight: 35 },
    far: [7, -3],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.08, 0, 1, 7, 15, 9],
      ['p', 'S', 'E', 0.05, 1, 0, 0, 9, 9],
      ['p', 'S', 'E', 0.5, 0, -1, 3, 15, 6],
      ['s', 'S', 'H', 0.55, 0, 1, 6, 16, 7],
    ],
  },

  // 14. Flexão Pseudo Planche (PPPU)
  'flexao-pseudo-planche': {
    id: 'flexao-pseudo-planche',
    name: 'Flexão Pseudo Planche (PPPU)',
    model: 'push',
    params: { handsFarBack: true },
    far: [7, -3],
    durationSeconds: 3.8,
    muscles: [
      ['p', 'S', 'E', 0.05, 1, 0, 0, 10, 10],
      ['p', 'S', 'H', 0.12, 0, 1, 7, 16, 9],
      ['p', 'S', 'E', 0.5, 0, -1, 4, 15, 6],
      ['s', 'S', 'H', 0.55, 0, 1, 6, 18, 7],
    ],
  },

  // 15. Pike Push-up (Flexão Pike)
  pikepushup: {
    id: 'pikepushup',
    name: 'Pike Push-up (Flexão Pike)',
    model: 'pike',
    params: {},
    far: [6, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'E', 0.05, 1, 0, 0, 9, 9],
      ['p', 'S', 'E', 0.5, 0, 1, 4, 15, 7],
      ['s', 'S', 'H', 0.15, 0, 1, 6, 14, 8],
      ['s', 'S', 'H', 0.55, 0, 1, 6, 16, 7],
    ],
  },

  // 16. Parada de Mãos na Parede (Handstand Hold)
  handstand: {
    id: 'handstand',
    name: 'Parada de Mãos na Parede',
    model: 'handstand',
    params: { isWall: true },
    far: [6, 0],
    durationSeconds: 3.5,
    muscles: [
      ['p', 'S', 'E', 0.05, 1, 0, 0, 9, 9],
      ['p', 'S', 'E', 0.5, 0, 1, 4, 15, 6],
      ['s', 'S', 'H', 0.5, 0, 1, 6, 18, 7],
      ['s', 'H', 'K', 0.5, 0, 1, 6, 18, 7],
    ],
  },

  // 17. Handstand Push-up Completo na Parede (HSPU)
  'hspu-completo-parede': {
    id: 'hspu-completo-parede',
    name: 'Handstand Push-up Completo na Parede',
    model: 'handstand',
    params: { isWall: true },
    far: [6, 0],
    durationSeconds: 3.8,
    muscles: [
      ['p', 'S', 'E', 0.05, 1, 0, 0, 10, 10],
      ['p', 'S', 'E', 0.5, 0, 1, 4, 16, 7],
      ['s', 'S', 'H', 0.15, 0, 1, 6, 16, 8],
      ['s', 'S', 'H', 0.5, 0, 1, 6, 18, 7],
    ],
  },

  // 18. Mergulho no Banco com Pés no Chão (Bench Dip)
  'dip-banco-chao': {
    id: 'dip-banco-chao',
    name: 'Mergulho no Banco com Pés no Chão',
    model: 'dip',
    params: { isBench: true },
    far: [6, -2],
    durationSeconds: 3.4,
    muscles: [
      ['p', 'S', 'E', 0.5, 0, -1, 4, 16, 7],
      ['s', 'S', 'E', 0.05, 1, 0, 0, 9, 9],
      ['s', 'S', 'H', 0.15, 1, 0, 6, 14, 7],
    ],
  },

  // 19. Barra Fixa Supinada (Chin-up)
  chinup: {
    id: 'chinup',
    name: 'Barra Fixa Supinada (Chin-up)',
    model: 'pull',
    params: { barX: 215, barY: 34 },
    far: [6, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'E', 0.5, 0, 1, 5, 16, 7],
      ['p', 'S', 'H', 0.18, -1, 0, 7, 22, 10],
      ['s', 'E', 'W', 0.45, 0, -1, 3, 13, 5],
      ['s', 'S', 'H', 0.55, 1, 0, 6, 16, 8],
    ],
  },

  // 20. Dead Hang (Suspensão Passiva/Ativa na Barra)
  'dead-hang': {
    id: 'dead-hang',
    name: 'Dead Hang (Suspensão na Barra)',
    model: 'pull',
    params: { isDeadHang: true },
    far: [6, -2],
    durationSeconds: 3.2,
    muscles: [
      ['p', 'E', 'W', 0.45, 0, -1, 4, 14, 6],
      ['s', 'S', 'H', 0.18, -1, 0, 6, 20, 8],
      ['s', 'S', 'H', 0.55, 1, 0, 6, 16, 7],
    ],
  },

  // 21. Barra Fixa em L-Sit (L-Sit Pull-up)
  'lsit-pullup': {
    id: 'lsit-pullup',
    name: 'Barra Fixa em L-Sit',
    model: 'pull',
    params: { isLsit: true },
    far: [6, -2],
    durationSeconds: 3.8,
    muscles: [
      ['p', 'S', 'H', 0.18, -1, 0, 7, 22, 10],
      ['p', 'S', 'H', 0.55, 1, 0, 7, 18, 9],
      ['p', 'S', 'E', 0.5, 0, -1, 4, 15, 6],
      ['s', 'H', 'K', 0.2, 1, 0, 6, 16, 7],
    ],
  },

  // 22. Pistol Squat Livre (Agachamento Pistola)
  pistolsquat: {
    id: 'pistolsquat',
    name: 'Pistol Squat Livre',
    model: 'pistol',
    params: {},
    far: [-6, 0],
    durationSeconds: 4.0,
    muscles: [
      ['p', 'H', 'K', 0.5, 1, 0, 7, 25, 9],
      ['p', 'H', 'K', 0.08, -1, 0.3, 8, 14, 11],
      ['s', 'K', 'A', 0.35, -1, 0, 6, 16, 6],
      ['s', 'S', 'H', 0.5, 1, 0, 5, 18, 8],
    ],
  },

  // 23. Agachamento Búlgaro (Bulgarian Split Squat)
  'afundo-bulgaro': {
    id: 'afundo-bulgaro',
    name: 'Agachamento Búlgaro',
    model: 'bulgarian',
    params: {},
    far: [-8, 2],
    durationSeconds: 3.8,
    muscles: [
      ['p', 'H', 'K', 0.5, 1, 0, 6, 24, 9],
      ['p', 'H', 'K', 0.08, -1, 0.3, 7, 13, 10],
      ['s', 'H', 'K', 0.55, -1, 0.2, 6, 18, 6],
    ],
  },

  // 24. Agachamento Isométrico na Parede (Wall Sit)
  'agachamento-parede': {
    id: 'agachamento-parede',
    name: 'Agachamento na Parede (Wall Sit)',
    model: 'squat',
    params: { isWallSit: true },
    far: [5, -2],
    durationSeconds: 3.2,
    muscles: [
      ['p', 'H', 'K', 0.5, 1, 0, 7, 24, 9],
      ['s', 'H', 'K', 0.08, -1, 0.3, 7, 12, 10],
      ['s', 'S', 'H', 0.5, 1, 0, 5, 18, 8],
    ],
  },

  // 25. Elevação de Panturrilha em Degrau
  'panturrilha-dupla': {
    id: 'panturrilha-dupla',
    name: 'Elevação de Panturrilha em Degrau',
    model: 'calf',
    params: { isStep: true },
    far: [5, -2],
    durationSeconds: 3.2,
    muscles: [
      ['p', 'K', 'A', 0.35, -1, 0, 7, 22, 9],
      ['s', 'H', 'K', 0.5, 1, 0, 5, 16, 7],
    ],
  },

  // 26. Remada Invertida com Joelhos Dobrados
  'remada-invertida-joelhos': {
    id: 'remada-invertida-joelhos',
    name: 'Remada Invertida com Joelhos Dobrados',
    model: 'row',
    params: { isKnees: true },
    far: [6, -2],
    durationSeconds: 3.5,
    muscles: [
      ['p', 'S', 'H', 0.2, -1, 0, 6, 20, 9],
      ['p', 'S', 'E', 0.5, 0, -1, 4, 14, 6],
      ['s', 'S', 'H', 0.05, -1, 0, 5, 14, 7],
      ['s', 'E', 'W', 0.45, 0, -1, 3, 12, 5],
    ],
  },

  // ==========================================
  // LOTE 3: CORE E DEITADO
  // ==========================================

  // 27. Hollow Body Hold (Canoa Completa)
  hollowbody: {
    id: 'hollowbody',
    name: 'Hollow Body Hold (Canoa)',
    model: 'hollow',
    params: { isTuck: false },
    far: [5, -3],
    durationSeconds: 3.4,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 7, 24, 9],
      ['p', 'H', 'K', 0.2, 1, 0, 6, 16, 7],
      ['s', 'S', 'E', 0.2, 0, 1, 4, 12, 5],
    ],
  },

  // 28. Hollow Hold Tuck (Canoa Dobrada)
  'hollow-hold-tuck': {
    id: 'hollow-hold-tuck',
    name: 'Hollow Hold Tuck',
    model: 'hollow',
    params: { isTuck: true },
    far: [5, -3],
    durationSeconds: 3.2,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 7, 22, 9],
      ['s', 'H', 'K', 0.2, 1, 0, 6, 14, 7],
    ],
  },

  // 29. Elevação de Pernas no Solo (Lying Leg Raise)
  'elevacao-pernas-chao': {
    id: 'elevacao-pernas-chao',
    name: 'Elevação de Pernas no Solo',
    model: 'crunch',
    params: { isLegRaise: true },
    far: [5, -3],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.6, 0, 1, 7, 22, 9],
      ['p', 'H', 'K', 0.15, 1, 0, 6, 18, 7],
      ['s', 'H', 'K', 0.5, 1, 0, 5, 16, 6],
    ],
  },

  // 30. Abdominal Canivete no Solo (V-Up)
  'abdominal-canivete': {
    id: 'abdominal-canivete',
    name: 'Abdominal Canivete (V-Up)',
    model: 'crunch',
    params: { isVUp: true },
    far: [5, -3],
    durationSeconds: 3.5,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 7, 24, 9],
      ['p', 'H', 'K', 0.2, 1, 0, 6, 18, 7],
      ['s', 'S', 'E', 0.3, 0, -1, 4, 14, 6],
    ],
  },

  // 31. Abdominal Curto no Solo (Crunch Tradicional)
  'crunch-solo': {
    id: 'crunch-solo',
    name: 'Abdominal Tradicional (Crunch)',
    model: 'crunch',
    params: {},
    far: [5, -3],
    durationSeconds: 3.2,
    muscles: [
      ['p', 'S', 'H', 0.45, 0, 1, 7, 22, 8],
      ['s', 'S', 'H', 0.1, 0, 1, 5, 14, 7],
    ],
  },

  // 32. Superman Isométrico no Solo
  superman: {
    id: 'superman',
    name: 'Superman no Solo',
    model: 'superman',
    params: {},
    far: [5, -3],
    durationSeconds: 3.4,
    muscles: [
      ['p', 'S', 'H', 0.7, 0, -1, 6, 20, 8],
      ['p', 'S', 'H', 0.95, 0, 1, 5, 15, 10],
      ['s', 'S', 'H', 0.1, -1, 0, 6, 16, 7],
      ['s', 'H', 'K', 0.5, 0.4, 1, 6, 20, 7],
    ],
  },

  // 33. Bird Dog (Perdigueiro)
  'bird-dog': {
    id: 'bird-dog',
    name: 'Bird Dog (Perdigueiro)',
    model: 'bird_dog',
    params: {},
    far: [6, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.7, 0, -1, 6, 20, 8],
      ['p', 'S', 'H', 0.95, 0, 1, 5, 15, 10],
      ['s', 'S', 'E', 0.2, 0, 1, 4, 12, 5],
      ['s', 'S', 'H', 0.4, 0, 1, 6, 18, 7],
    ],
  },

  // 34. Prancha Lateral Tradicional
  'prancha-lateral': {
    id: 'prancha-lateral',
    name: 'Prancha Lateral Tradicional',
    model: 'side_plank',
    params: { isKnee: false },
    far: [4, -2],
    durationSeconds: 3.4,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 7, 24, 9],
      ['s', 'S', 'E', 0.2, 0, 1, 4, 12, 6],
      ['s', 'H', 'K', 0.5, 0, 1, 6, 18, 7],
    ],
  },

  // 35. Elevação de Pernas na Barra (Hanging Leg Raise)
  'elevacao-pernas-barra': {
    id: 'elevacao-pernas-barra',
    name: 'Elevação de Pernas na Barra',
    model: 'hanging_core',
    params: { isToesToBar: false, isKnees: false },
    far: [6, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.55, 1, 0, 7, 24, 10],
      ['p', 'H', 'K', 0.2, 1, 0, 6, 18, 8],
      ['s', 'S', 'H', 0.18, -1, 0, 6, 18, 8],
      ['s', 'E', 'W', 0.45, 0, -1, 4, 14, 6],
    ],
  },

  // 36. Pés na Barra Estritos (Toes to Bar)
  'toes-to-bar': {
    id: 'toes-to-bar',
    name: 'Pés na Barra (Toes to Bar)',
    model: 'hanging_core',
    params: { isToesToBar: true },
    far: [6, -2],
    durationSeconds: 3.8,
    muscles: [
      ['p', 'S', 'H', 0.55, 1, 0, 8, 26, 10],
      ['p', 'H', 'K', 0.2, 1, 0, 7, 20, 8],
      ['s', 'S', 'H', 0.18, -1, 0, 7, 20, 8],
      ['s', 'E', 'W', 0.45, 0, -1, 4, 14, 6],
    ],
  },

  // 37. Dragon Flag Completo
  'dragon-flag': {
    id: 'dragon-flag',
    name: 'Dragon Flag Completo',
    model: 'dragon_flag',
    params: {},
    far: [5, -3],
    durationSeconds: 3.8,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 8, 26, 10],
      ['p', 'S', 'H', 0.18, -1, 0, 7, 20, 8],
      ['s', 'H', 'K', 0.3, 1, 0, 6, 18, 7],
      ['s', 'S', 'E', 0.4, 0, 1, 4, 14, 6],
    ],
  },

  // 38. Roda Abdominal de Joelhos (Ab Wheel Rollout)
  'ab-wheel-joelhos': {
    id: 'ab-wheel-joelhos',
    name: 'Roda Abdominal de Joelhos',
    model: 'ab_wheel',
    params: {},
    far: [6, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 8, 24, 9],
      ['p', 'S', 'H', 0.18, -1, 0, 6, 18, 8],
      ['s', 'S', 'E', 0.1, 1, 0, 5, 14, 6],
      ['s', 'H', 'K', 0.2, 1, 0, 6, 16, 7],
    ],
  },

  // 39. Mountain Climbers Frontal Tradicional
  'mountain-climbers': {
    id: 'mountain-climbers',
    name: 'Mountain Climbers Tradicional',
    model: 'mountain_climber',
    params: {},
    far: [6, -2],
    durationSeconds: 3.0,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 7, 22, 8],
      ['p', 'H', 'K', 0.2, 1, 0, 6, 18, 7],
      ['s', 'S', 'E', 0.1, 1, 0, 5, 12, 6],
    ],
  },

  // 40. Nordic Hamstring Curl Completo
  'nordic-curl': {
    id: 'nordic-curl',
    name: 'Nordic Hamstring Curl',
    model: 'nordic_curl',
    params: {},
    far: [6, -2],
    durationSeconds: 3.8,
    muscles: [
      ['p', 'H', 'K', 0.55, -1, 0.2, 8, 26, 8],
      ['p', 'S', 'H', 0.95, 0, 1, 6, 16, 10],
      ['s', 'S', 'H', 0.5, 0, 1, 6, 18, 7],
      ['s', 'K', 'A', 0.35, -1, 0, 6, 16, 6],
    ],
  },

  // ========================================================
  // LOTE 4: AQUECIMENTO E ALONGAMENTO (30 EXERCÍCIOS)
  // ========================================================

  'gato-vaca': {
    id: 'gato-vaca',
    name: 'Gato-Vaca (Cat-Cow)',
    model: 'cat_cow',
    far: [4, -3],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 7, 24, 8],
      ['p', 'S', 'H', 0.5, 0, -1, 7, 24, 8],
      ['s', 'S', 'E', 0.1, 1, 0, 5, 12, 6],
    ],
  },

  'circulos-ombro': {
    id: 'circulos-ombro',
    name: 'Circundução de Ombros',
    model: 'standing_mobility',
    far: [5, -2],
    durationSeconds: 3.2,
    muscles: [
      ['p', 'S', 'E', 0.12, 1, 0, 6, 16, 8],
      ['s', 'S', 'H', 0.15, -1, 0, 5, 14, 6],
    ],
  },

  'agachamento-profundo-assistido': {
    id: 'agachamento-profundo-assistido',
    name: 'Agachamento Profundo com Apoio',
    model: 'deep_squat_hold',
    far: [6, -2],
    durationSeconds: 4.0,
    muscles: [
      ['p', 'H', 'K', 0.5, 1, 0, 8, 24, 9],
      ['p', 'H', 'K', 0.2, 1, 0, 7, 18, 7],
      ['s', 'K', 'A', 0.5, -1, 0, 6, 16, 6],
    ],
  },

  'greatest-stretch': {
    id: 'greatest-stretch',
    name: 'Maior Alongamento do Mundo',
    model: 'world_greatest_stretch',
    far: [4, -2],
    durationSeconds: 4.2,
    muscles: [
      ['p', 'H', 'K', 0.2, 1, 0, 7, 20, 8],
      ['p', 'S', 'H', 0.6, 0, 1, 7, 22, 8],
      ['s', 'S', 'E', 0.15, 1, 0, 6, 14, 6],
    ],
  },

  'rotacao-quadril-9090': {
    id: 'rotacao-quadril-9090',
    name: 'Transição 90/90 de Quadril',
    model: 'seated_hip_mobility',
    far: [6, -2],
    durationSeconds: 3.8,
    muscles: [
      ['p', 'H', 'K', 0.25, 1, 0, 7, 20, 8],
      ['p', 'S', 'H', 0.9, 0, 1, 6, 16, 8],
      ['s', 'H', 'K', 0.5, -1, 0, 6, 16, 7],
    ],
  },

  'postura-crianca': {
    id: 'postura-crianca',
    name: 'Postura da Criança (Child’s Pose)',
    model: 'child_pose',
    far: [4, -2],
    durationSeconds: 4.0,
    muscles: [
      ['p', 'S', 'H', 0.2, -1, 0, 7, 22, 8],
      ['p', 'S', 'H', 0.6, 0, -1, 7, 24, 8],
      ['s', 'S', 'H', 0.9, 0, 1, 6, 16, 8],
    ],
  },

  'alongamento-quadriceps': {
    id: 'alongamento-quadriceps',
    name: 'Alongamento de Quadríceps',
    model: 'standing_stretch',
    params: { type: 'quad' },
    far: [5, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'H', 'K', 0.5, 1, 0, 8, 26, 9],
      ['s', 'H', 'K', 0.2, 1, 0, 6, 16, 6],
    ],
  },

  'alongamento-triceps-acima': {
    id: 'alongamento-triceps-acima',
    name: 'Alongamento de Tríceps Acima',
    model: 'standing_stretch',
    params: { type: 'triceps' },
    far: [5, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'E', 0.55, -1, 0, 7, 20, 8],
      ['s', 'S', 'H', 0.18, -1, 0, 6, 18, 7],
    ],
  },

  'alongamento-dorsal-barra': {
    id: 'alongamento-dorsal-barra',
    name: 'Alongamento de Dorsal na Barra',
    model: 'standing_stretch',
    params: { type: 'lat' },
    far: [5, -2],
    durationSeconds: 3.8,
    muscles: [
      ['p', 'S', 'H', 0.22, -1, 0, 8, 24, 9],
      ['s', 'S', 'E', 0.15, 1, 0, 6, 14, 6],
    ],
  },

  'alongamento-panturrilha': {
    id: 'alongamento-panturrilha',
    name: 'Alongamento de Panturrilha',
    model: 'standing_stretch',
    params: { type: 'calf' },
    far: [5, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'K', 'A', 0.45, -1, 0, 7, 20, 7],
      ['s', 'H', 'K', 0.5, -1, 0, 6, 16, 6],
    ],
  },

  'alongamento-isquiotibiais': {
    id: 'alongamento-isquiotibiais',
    name: 'Alongamento de Isquiotibiais',
    model: 'standing_stretch',
    params: { type: 'hamstring' },
    far: [5, -2],
    durationSeconds: 3.8,
    muscles: [
      ['p', 'H', 'K', 0.5, -1, 0, 8, 26, 8],
      ['s', 'K', 'A', 0.4, -1, 0, 6, 16, 6],
    ],
  },

  'alongamento-peitoral-parede': {
    id: 'alongamento-peitoral-parede',
    name: 'Alongamento de Peitoral na Parede',
    model: 'standing_stretch',
    params: { type: 'chest' },
    far: [5, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.22, 1, 0, 8, 20, 8],
      ['s', 'S', 'E', 0.15, 1, 0, 6, 14, 6],
    ],
  },

  // ========================================================
  // LOTE 5: SKILLS AVANÇADAS (26 EXERCÍCIOS)
  // ========================================================

  lsit: {
    id: 'lsit',
    name: 'L-Sit Completo (Solo ou Paralelas)',
    model: 'lsit_skill',
    params: { type: 'full' },
    far: [4, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 8, 26, 9],
      ['p', 'H', 'K', 0.2, 1, 0, 7, 18, 7],
      ['s', 'H', 'K', 0.5, 1, 0, 7, 22, 8],
      ['s', 'S', 'E', 0.5, -1, 0, 6, 18, 7],
    ],
  },

  'lsit-solo-tuck': {
    id: 'lsit-solo-tuck',
    name: 'Tuck L-Sit no Solo ou Paralelas',
    model: 'lsit_skill',
    params: { type: 'tuck' },
    far: [4, -2],
    durationSeconds: 3.4,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 8, 24, 8],
      ['p', 'H', 'K', 0.2, 1, 0, 7, 18, 7],
      ['s', 'S', 'E', 0.5, -1, 0, 6, 16, 6],
    ],
  },

  vsit: {
    id: 'vsit',
    name: 'V-Sit de Ginástica',
    model: 'lsit_skill',
    params: { type: 'vsit' },
    far: [4, -2],
    durationSeconds: 3.8,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 9, 28, 9],
      ['p', 'H', 'K', 0.2, 1, 0, 8, 20, 8],
      ['s', 'H', 'K', 0.5, 1, 0, 7, 22, 8],
      ['s', 'S', 'E', 0.5, -1, 0, 6, 18, 7],
    ],
  },

  'crow-pose': {
    id: 'crow-pose',
    name: 'Crow Pose (Postura do Corvo)',
    model: 'arm_balance',
    params: { type: 'crow' },
    far: [4, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'E', 0.5, -1, 0, 7, 18, 7],
      ['p', 'S', 'E', 0.12, 1, 0, 6, 14, 7],
      ['s', 'S', 'H', 0.5, 0, 1, 7, 20, 7],
    ],
  },

  'crane-pose': {
    id: 'crane-pose',
    name: 'Crane Pose (Postura da Garça)',
    model: 'arm_balance',
    params: { type: 'crane' },
    far: [4, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'E', 0.12, 1, 0, 7, 16, 7],
      ['p', 'S', 'H', 0.5, 0, 1, 8, 22, 8],
      ['s', 'S', 'E', 0.5, -1, 0, 6, 16, 6],
    ],
  },

  'planche-lean': {
    id: 'planche-lean',
    name: 'Planche Lean (Inclinação para Prancha)',
    model: 'planche_skill',
    params: { type: 'lean' },
    far: [4, -2],
    durationSeconds: 3.4,
    muscles: [
      ['p', 'S', 'E', 0.12, 1, 0, 8, 18, 8],
      ['p', 'S', 'H', 0.2, 1, 0, 7, 20, 7],
      ['s', 'S', 'H', 0.5, 0, 1, 7, 22, 8],
    ],
  },

  'tuck-planche': {
    id: 'tuck-planche',
    name: 'Tuck Planche no Solo ou Paralelas',
    model: 'planche_skill',
    params: { type: 'tuck' },
    far: [4, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'E', 0.12, 1, 0, 8, 18, 8],
      ['p', 'S', 'H', 0.5, 0, 1, 8, 24, 8],
      ['s', 'S', 'E', 0.5, -1, 0, 6, 16, 6],
    ],
  },

  'adv-tuck-planche': {
    id: 'adv-tuck-planche',
    name: 'Advanced Tuck Planche',
    model: 'planche_skill',
    params: { type: 'adv-tuck' },
    far: [4, -2],
    durationSeconds: 3.8,
    muscles: [
      ['p', 'S', 'E', 0.12, 1, 0, 8, 20, 8],
      ['p', 'S', 'H', 0.6, 0, -1, 8, 26, 8],
      ['s', 'S', 'H', 0.5, 0, 1, 7, 22, 8],
    ],
  },

  planche: {
    id: 'planche',
    name: 'Full Planche (Prancha Completa)',
    model: 'planche_skill',
    params: { type: 'full' },
    far: [4, -2],
    durationSeconds: 4.0,
    muscles: [
      ['p', 'S', 'E', 0.12, 1, 0, 9, 22, 9],
      ['p', 'S', 'H', 0.6, 0, -1, 9, 28, 9],
      ['s', 'S', 'H', 0.5, 0, 1, 8, 24, 8],
      ['s', 'S', 'H', 0.9, 0, 1, 7, 18, 8],
    ],
  },

  'tuck-front-lever': {
    id: 'tuck-front-lever',
    name: 'Tuck Front Lever na Barra',
    model: 'front_lever_skill',
    params: { type: 'tuck' },
    far: [4, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.22, -1, 0, 8, 26, 9],
      ['p', 'S', 'H', 0.5, 0, 1, 8, 24, 8],
      ['s', 'S', 'E', 0.5, 1, 0, 6, 16, 6],
    ],
  },

  frontlever: {
    id: 'frontlever',
    name: 'Front Lever Completo na Barra',
    model: 'front_lever_skill',
    params: { type: 'full' },
    far: [4, -2],
    durationSeconds: 4.0,
    muscles: [
      ['p', 'S', 'H', 0.22, -1, 0, 9, 28, 9],
      ['p', 'S', 'H', 0.5, 0, 1, 9, 28, 9],
      ['s', 'S', 'E', 0.5, 1, 0, 7, 18, 7],
      ['s', 'H', 'K', 0.5, 1, 0, 7, 22, 7],
    ],
  },

  'tuck-back-lever': {
    id: 'tuck-back-lever',
    name: 'Tuck Back Lever na Barra',
    model: 'back_lever_skill',
    params: { type: 'tuck' },
    far: [4, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'E', 0.12, 1, 0, 8, 18, 8],
      ['p', 'S', 'H', 0.22, 1, 0, 8, 22, 8],
      ['s', 'S', 'H', 0.5, 0, 1, 7, 20, 7],
    ],
  },

  'back-lever': {
    id: 'back-lever',
    name: 'Back Lever Completo',
    model: 'back_lever_skill',
    params: { type: 'full' },
    far: [4, -2],
    durationSeconds: 4.0,
    muscles: [
      ['p', 'S', 'E', 0.12, 1, 0, 9, 22, 8],
      ['p', 'S', 'H', 0.22, 1, 0, 9, 24, 9],
      ['s', 'S', 'H', 0.6, 0, -1, 8, 26, 8],
      ['s', 'S', 'H', 0.9, 0, 1, 7, 18, 8],
    ],
  },

  'skin-the-cat': {
    id: 'skin-the-cat',
    name: 'Skin the Cat (Passagem de Ombros)',
    model: 'skin_the_cat',
    params: {},
    far: [4, -2],
    durationSeconds: 4.0,
    muscles: [
      ['p', 'S', 'E', 0.12, 1, 0, 8, 20, 8],
      ['p', 'S', 'H', 0.22, -1, 0, 8, 24, 8],
      ['s', 'S', 'H', 0.5, 0, 1, 7, 22, 8],
    ],
  },

  'bandeira-humana-tuck': {
    id: 'bandeira-humana-tuck',
    name: 'Bandeira Humana Tuck',
    model: 'human_flag',
    params: { type: 'tuck' },
    far: [3, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 9, 24, 9],
      ['p', 'S', 'H', 0.22, -1, 0, 8, 24, 8],
      ['s', 'S', 'E', 0.12, 1, 0, 7, 18, 7],
    ],
  },

  'bandeira-humana': {
    id: 'bandeira-humana',
    name: 'Bandeira Humana Completa (Full Human Flag)',
    model: 'human_flag',
    params: { type: 'full' },
    far: [3, -2],
    durationSeconds: 4.0,
    muscles: [
      ['p', 'S', 'H', 0.5, 0, 1, 9, 28, 9],
      ['p', 'S', 'H', 0.22, -1, 0, 9, 26, 9],
      ['s', 'S', 'E', 0.12, 1, 0, 8, 20, 8],
      ['s', 'H', 'K', 0.3, 1, 0, 7, 18, 7],
    ],
  },

  'chute-parada-maos': {
    id: 'chute-parada-maos',
    name: 'Chute para Parada de Mãos',
    model: 'kick_up_handstand',
    params: {},
    far: [4, -2],
    durationSeconds: 3.6,
    muscles: [
      ['p', 'S', 'E', 0.12, 1, 0, 8, 20, 8],
      ['p', 'S', 'E', 0.5, -1, 0, 7, 18, 7],
      ['s', 'S', 'H', 0.5, 0, 1, 7, 22, 8],
    ],
  },
};
