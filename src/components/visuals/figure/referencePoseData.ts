/**
 * Catálogo de Dados de Poses do Protótipo Aprovado (JSON estruturado em TypeScript)
 * Guarda âncoras, parâmetros e músculos como DADOS puros.
 * Mapeamento exaustivo e individual de todos os 208 exercícios do CalisteFlow.
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
  'flexao-parede': {
    id: 'flexao-parede',
    name: 'Flexão na Parede',
    model: 'push',
    params: {
          benchHeight: 80
    },
    far: [7,-3],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['s','S','H',0.55,0,1,6,16,7],
    ],
  },

  'flexao-inclinada': {
    id: 'flexao-inclinada',
    name: 'Flexão Inclinada',
    model: 'push',
    params: {
          benchHeight: 45
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'flexao-joelhos': {
    id: 'flexao-joelhos',
    name: 'Flexão de Braços com Joelhos',
    model: 'push',
    params: {
          isKnee: true
    },
    far: [7,-3],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
    ],
  },

  'pushup': {
    id: 'pushup',
    name: 'Flexão de Braços Tradicional',
    model: 'push',
    params: {
          benchHeight: 0
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'flexao-fechada': {
    id: 'flexao-fechada',
    name: 'Flexão com Pegada Fechada',
    model: 'push',
    params: {
          isClose: true
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'diamondpushup': {
    id: 'diamondpushup',
    name: 'Flexão Diamante',
    model: 'push',
    params: {
          isDiamond: true
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'flexao-declinada': {
    id: 'flexao-declinada',
    name: 'Flexão Declinada (Pés Elevados)',
    model: 'push',
    params: {
          feetHeight: 35
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.08,0,1,7,15,9],
      ['p','S','E',0.05,1,0,0,9,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['s','S','H',0.55,0,1,6,16,7],
    ],
  },

  'flexao-aberta': {
    id: 'flexao-aberta',
    name: 'Flexão com Pegada Aberta',
    model: 'push',
    params: {
          isWide: true
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'flexao-escapular': {
    id: 'flexao-escapular',
    name: 'Flexão Escapular (Push-up Plus)',
    model: 'push',
    params: {
          isScapular: true
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'flexao-hindu': {
    id: 'flexao-hindu',
    name: 'Flexão Hindu (Dive Bomber)',
    model: 'push',
    params: {
          isHindu: true
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'flexao-arqueiro': {
    id: 'flexao-arqueiro',
    name: 'Flexão Arqueiro (Archer Push-up)',
    model: 'push',
    params: {
          isArcher: true
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'flexao-pseudo-planche': {
    id: 'flexao-pseudo-planche',
    name: 'Flexão Pseudo Planche (PPPU)',
    model: 'push',
    params: {
          handsFarBack: true
    },
    far: [7,-3],
    durationSeconds: 3.8,
    muscles: [
      ['p','S','E',0.05,1,0,0,10,10],
      ['p','S','H',0.12,0,1,7,16,9],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','S','H',0.55,0,1,6,18,7],
    ],
  },

  'flexao-unilateral-assistida': {
    id: 'flexao-unilateral-assistida',
    name: 'Flexão Unilateral Assistida',
    model: 'push',
    params: {
          isUnilateral: true,
          isAssisted: true
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'flexao-unilateral': {
    id: 'flexao-unilateral',
    name: 'Flexão Unilateral (One-Arm Push-up)',
    model: 'push',
    params: {
          isUnilateral: true
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'flexao-com-palmas': {
    id: 'flexao-com-palmas',
    name: 'Flexão com Palmas (Clap Push-up)',
    model: 'push',
    params: {
          isExplosive: true
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'flexao-diamante-pes-elevados': {
    id: 'flexao-diamante-pes-elevados',
    name: 'Flexão Diamante com Pés Elevados',
    model: 'push',
    params: {
          isDiamond: true,
          feetHeight: 35
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'flexao-dedos': {
    id: 'flexao-dedos',
    name: 'Flexão com Apoio nos Dedos (Finger Push-up)',
    model: 'push',
    params: {
          isFingertip: true
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'pike-pushup-joelhos': {
    id: 'pike-pushup-joelhos',
    name: 'Pike Push-up com Joelhos Apoiados',
    model: 'pike',
    params: {
          isKnee: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.05,1,0,0,9,9],
      ['p','S','E',0.5,0,1,4,15,7],
      ['s','S','H',0.15,0,1,6,14,8],
      ['s','S','H',0.55,0,1,6,16,7],
    ],
  },

  'pikepushup': {
    id: 'pikepushup',
    name: 'Pike Push-up (Flexão Pike)',
    model: 'pike',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.05,1,0,0,9,9],
      ['p','S','E',0.5,0,1,4,15,7],
      ['s','S','H',0.15,0,1,6,14,8],
      ['s','S','H',0.55,0,1,6,16,7],
    ],
  },

  'pike-pushup-elevado': {
    id: 'pike-pushup-elevado',
    name: 'Pike Push-up com Pés Elevados',
    model: 'pike',
    params: {
          feetHeight: 35
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.05,1,0,0,9,9],
      ['p','S','E',0.5,0,1,4,15,7],
      ['s','S','H',0.15,0,1,6,14,8],
      ['s','S','H',0.55,0,1,6,16,7],
    ],
  },

  'prancha-peito-parede': {
    id: 'prancha-peito-parede',
    name: 'Prancha de Peito na Parede (Wall Walk Hold)',
    model: 'handstand',
    params: {
          isWall: true,
          isHSPU: false
    },
    far: [6,0],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','E',0.05,1,0,0,9,9],
      ['p','S','E',0.5,0,1,4,15,6],
      ['s','S','H',0.5,0,1,6,18,7],
      ['s','H','K',0.5,0,1,6,18,7],
    ],
  },

  'handstand': {
    id: 'handstand',
    name: 'Parada de Mãos na Parede (Handstand Hold)',
    model: 'handstand',
    params: {
          isWall: true,
          isHSPU: false
    },
    far: [6,0],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','E',0.05,1,0,0,9,9],
      ['p','S','E',0.5,0,1,4,15,6],
      ['s','S','H',0.5,0,1,6,18,7],
      ['s','H','K',0.5,0,1,6,18,7],
    ],
  },

  'hspu-negativa-parede': {
    id: 'hspu-negativa-parede',
    name: 'HSPU Negativa na Parede',
    model: 'handstand',
    params: {
          isWall: true,
          isHSPU: true
    },
    far: [6,0],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','E',0.05,1,0,0,9,9],
      ['p','S','E',0.5,0,1,4,15,6],
      ['s','S','H',0.5,0,1,6,18,7],
      ['s','H','K',0.5,0,1,6,18,7],
    ],
  },

  'hspu-parcial-parede': {
    id: 'hspu-parcial-parede',
    name: 'HSPU Parcial com Bloqueio',
    model: 'handstand',
    params: {
          isWall: true,
          isHSPU: true
    },
    far: [6,0],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','E',0.05,1,0,0,9,9],
      ['p','S','E',0.5,0,1,4,15,6],
      ['s','S','H',0.5,0,1,6,18,7],
      ['s','H','K',0.5,0,1,6,18,7],
    ],
  },

  'hspu-completo-parede': {
    id: 'hspu-completo-parede',
    name: 'Handstand Push-up Completo na Parede (HSPU)',
    model: 'handstand',
    params: {
          isWall: true,
          isHSPU: true
    },
    far: [6,0],
    durationSeconds: 3.8,
    muscles: [
      ['p','S','E',0.05,1,0,0,10,10],
      ['p','S','E',0.5,0,1,4,16,7],
      ['s','S','H',0.15,0,1,6,16,8],
      ['s','S','H',0.5,0,1,6,18,7],
    ],
  },

  'handstand-livre': {
    id: 'handstand-livre',
    name: 'Parada de Mãos Livre (Handstand Balance)',
    model: 'handstand',
    params: {
          isWall: false,
          isHSPU: false
    },
    far: [6,0],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','E',0.05,1,0,0,9,9],
      ['p','S','E',0.5,0,1,4,15,6],
      ['s','S','H',0.5,0,1,6,18,7],
      ['s','H','K',0.5,0,1,6,18,7],
    ],
  },

  'hspu-livre': {
    id: 'hspu-livre',
    name: 'HSPU Livre (Freestanding HSPU)',
    model: 'handstand',
    params: {
          isWall: false,
          isHSPU: true
    },
    far: [6,0],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','E',0.05,1,0,0,9,9],
      ['p','S','E',0.5,0,1,4,15,6],
      ['s','S','H',0.5,0,1,6,18,7],
      ['s','H','K',0.5,0,1,6,18,7],
    ],
  },

  'dip-banco-chao': {
    id: 'dip-banco-chao',
    name: 'Mergulho no Banco com Pés no Chão',
    model: 'dip',
    params: {
          isBench: true,
          isFeetElevated: false
    },
    far: [6,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','E',0.5,0,-1,4,16,7],
      ['s','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.15,1,0,6,14,7],
    ],
  },

  'dip-banco-elevado': {
    id: 'dip-banco-elevado',
    name: 'Mergulho no Banco com Pés Elevados',
    model: 'dip',
    params: {
          isBench: true,
          isFeetElevated: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.5,0,1,4,15,7],
      ['p','S','H',0.15,1,0,6,16,8],
      ['s','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,1,0,6,15,7],
    ],
  },

  'dip-paralela-negativa': {
    id: 'dip-paralela-negativa',
    name: 'Mergulho em Paralelas (Fase Negativa)',
    model: 'dip',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.5,0,1,4,15,7],
      ['p','S','H',0.15,1,0,6,16,8],
      ['s','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,1,0,6,15,7],
    ],
  },

  'dip': {
    id: 'dip',
    name: 'Mergulho em Barras Paralelas (Dips)',
    model: 'dip',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.5,0,1,4,15,7],
      ['p','S','H',0.15,1,0,6,16,8],
      ['s','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,1,0,6,15,7],
    ],
  },

  'dip-inclinado': {
    id: 'dip-inclinado',
    name: 'Mergulho Inclinado com Foco em Peitoral',
    model: 'dip',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.5,0,1,4,15,7],
      ['p','S','H',0.15,1,0,6,16,8],
      ['s','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,1,0,6,15,7],
    ],
  },

  'dip-argolas': {
    id: 'dip-argolas',
    name: 'Mergulho nas Argolas Olímpicas (Ring Dips)',
    model: 'dip',
    params: {
          isRings: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.5,0,1,4,15,7],
      ['p','S','H',0.15,1,0,6,16,8],
      ['s','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,1,0,6,15,7],
    ],
  },

  'dip-com-carga': {
    id: 'dip-com-carga',
    name: 'Mergulho com Carga (Weighted Dips)',
    model: 'dip',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.5,0,1,4,15,7],
      ['p','S','H',0.15,1,0,6,16,8],
      ['s','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,1,0,6,15,7],
    ],
  },

  'extensao-triceps-barra-baixa': {
    id: 'extensao-triceps-barra-baixa',
    name: 'Extensão de Tríceps na Barra Baixa ou Mesa',
    model: 'push',
    params: {
          benchHeight: 50,
          handsFarBack: true
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'dip-com-pausa': {
    id: 'dip-com-pausa',
    name: 'Mergulho em Paralelas com Pausa no Fundo',
    model: 'dip',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.5,0,1,4,15,7],
      ['p','S','H',0.15,1,0,6,16,8],
      ['s','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,1,0,6,15,7],
    ],
  },

  'dead-hang': {
    id: 'dead-hang',
    name: 'Dead Hang (Suspensão Passiva na Barra)',
    model: 'pull',
    params: {
          isDeadHang: true
    },
    far: [6,-2],
    durationSeconds: 3.2,
    muscles: [
      ['p','E','W',0.45,0,-1,4,14,6],
      ['s','S','H',0.18,-1,0,6,20,8],
      ['s','S','H',0.55,1,0,6,16,7],
    ],
  },

  'retracao-escapular-barra': {
    id: 'retracao-escapular-barra',
    name: 'Retração Escapular Ativa na Barra (Scapular Pull)',
    model: 'pull',
    params: {
          isScapular: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'barra-negativa': {
    id: 'barra-negativa',
    name: 'Barra Fixa (Fase Negativa)',
    model: 'pull',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'barra-com-elastico': {
    id: 'barra-com-elastico',
    name: 'Barra Fixa Assistida com Elástico (Band Pull-up)',
    model: 'pull',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'chinup-supinada': {
    id: 'chinup-supinada',
    name: 'Barra Fixa Supinada (Chin-up)',
    model: 'pull',
    params: {
          isChinup: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'pullup': {
    id: 'pullup',
    name: 'Barra Fixa Pronada Tradicional (Pull-up)',
    model: 'pull',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'barra-pegada-neutra': {
    id: 'barra-pegada-neutra',
    name: 'Barra Fixa com Pegada Neutra',
    model: 'pull',
    params: {
          isNeutral: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'barra-aberta': {
    id: 'barra-aberta',
    name: 'Barra Fixa Aberta (Wide Grip Pull-up)',
    model: 'pull',
    params: {
          isWide: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'barra-arqueiro': {
    id: 'barra-arqueiro',
    name: 'Barra Fixa Arqueiro (Archer Pull-up)',
    model: 'pull',
    params: {
          isArcher: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'lsit-pullup': {
    id: 'lsit-pullup',
    name: 'Barra Fixa em L-Sit (L-Sit Pull-up)',
    model: 'pull',
    params: {
          isLsit: true
    },
    far: [6,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','H',0.55,1,0,7,18,9],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','H','K',0.2,1,0,6,16,7],
    ],
  },

  'muscle-up-transicao': {
    id: 'muscle-up-transicao',
    name: 'Muscle-up (Fase de Transição com Apoio)',
    model: 'pull',
    params: {
          isMuscleUp: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'muscleup': {
    id: 'muscleup',
    name: 'Muscle-up na Barra Fixa',
    model: 'pull',
    params: {
          isMuscleUp: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'barra-unilateral-assistida': {
    id: 'barra-unilateral-assistida',
    name: 'Barra Fixa Unilateral Assistida',
    model: 'pull',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'suspensao-falsa-pegada': {
    id: 'suspensao-falsa-pegada',
    name: 'Suspensão com Falsa Pegada (False Grip Hang)',
    model: 'pull',
    params: {
          isDeadHang: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'suspensao-queixo-acima-barra': {
    id: 'suspensao-queixo-acima-barra',
    name: 'Suspensão com Queixo Acima da Barra (Flexed-Arm Hang)',
    model: 'pull',
    params: {
          isChinup: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'barra-fixa-explosiva': {
    id: 'barra-fixa-explosiva',
    name: 'Barra Fixa Explosiva (Explosive Pull-up)',
    model: 'pull',
    params: {
          isExplosive: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'chinup-excentrico': {
    id: 'chinup-excentrico',
    name: 'Chin-up Excêntrico (Descida de 5 s)',
    model: 'pull',
    params: {
          isChinup: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'chinup-pausa-metade': {
    id: 'chinup-pausa-metade',
    name: 'Chin-up com Pausa de 3 s na Metade',
    model: 'pull',
    params: {
          isChinup: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'dead-hang-toalha': {
    id: 'dead-hang-toalha',
    name: 'Dead Hang com Toalha (Pegada Grossa)',
    model: 'pull',
    params: {
          isTowel: true,
          isDeadHang: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'dead-hang-unilateral-assistido': {
    id: 'dead-hang-unilateral-assistido',
    name: 'Dead Hang Unilateral Assistido (One-Arm Hang)',
    model: 'pull',
    params: {
          isDeadHang: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'remada-invertida-joelhos': {
    id: 'remada-invertida-joelhos',
    name: 'Remada Invertida com Joelhos Dobrados',
    model: 'row',
    params: {
          isKnees: true
    },
    far: [6,-2],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','H',0.2,-1,0,6,20,9],
      ['p','S','E',0.5,0,-1,4,14,6],
      ['s','S','H',0.05,-1,0,5,14,7],
      ['s','E','W',0.45,0,-1,3,12,5],
    ],
  },

  'australianpullup': {
    id: 'australianpullup',
    name: 'Remada Australiana (Remada Invertida Tradicional)',
    model: 'row',
    params: {
          isKnees: false
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.2,-1,0,6,20,9],
      ['p','S','E',0.5,0,-1,4,14,6],
      ['s','S','H',0.05,-1,0,5,14,7],
      ['s','E','W',0.45,0,-1,3,12,5],
    ],
  },

  'remada-porta-toalha': {
    id: 'remada-porta-toalha',
    name: 'Remada com Toalha na Porta',
    model: 'row',
    params: {
          isKnees: false
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.2,-1,0,6,20,9],
      ['p','S','E',0.5,0,-1,4,14,6],
      ['s','S','H',0.05,-1,0,5,14,7],
      ['s','E','W',0.45,0,-1,3,12,5],
    ],
  },

  'remada-invertida-pes-elevados': {
    id: 'remada-invertida-pes-elevados',
    name: 'Remada Invertida com Pés Elevados',
    model: 'row',
    params: {
          isFeetElevated: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.2,-1,0,6,20,9],
      ['p','S','E',0.5,0,-1,4,14,6],
      ['s','S','H',0.05,-1,0,5,14,7],
      ['s','E','W',0.45,0,-1,3,12,5],
    ],
  },

  'remada-invertida-supinada': {
    id: 'remada-invertida-supinada',
    name: 'Remada Invertida com Pegada Supinada',
    model: 'row',
    params: {
          isChinup: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.2,-1,0,6,20,9],
      ['p','S','E',0.5,0,-1,4,14,6],
      ['s','S','H',0.05,-1,0,5,14,7],
      ['s','E','W',0.45,0,-1,3,12,5],
    ],
  },

  'remada-argolas': {
    id: 'remada-argolas',
    name: 'Remada Invertida nas Argolas (com Rotação)',
    model: 'row',
    params: {
          isRings: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.2,-1,0,6,20,9],
      ['p','S','E',0.5,0,-1,4,14,6],
      ['s','S','H',0.05,-1,0,5,14,7],
      ['s','E','W',0.45,0,-1,3,12,5],
    ],
  },

  'remada-arqueiro': {
    id: 'remada-arqueiro',
    name: 'Remada Arqueiro (Archer Row)',
    model: 'row',
    params: {
          isArcher: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.2,-1,0,6,20,9],
      ['p','S','E',0.5,0,-1,4,14,6],
      ['s','S','H',0.05,-1,0,5,14,7],
      ['s','E','W',0.45,0,-1,3,12,5],
    ],
  },

  'remada-unilateral': {
    id: 'remada-unilateral',
    name: 'Remada Invertida Unilateral (One-Arm Bodyweight Row)',
    model: 'row',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.2,-1,0,6,20,9],
      ['p','S','E',0.5,0,-1,4,14,6],
      ['s','S','H',0.05,-1,0,5,14,7],
      ['s','E','W',0.45,0,-1,3,12,5],
    ],
  },

  'front-lever-row': {
    id: 'front-lever-row',
    name: 'Remada em Front Lever (Tuck Front Lever Row)',
    model: 'front_lever_skill',
    params: {
          type: "tuck"
    },
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.22,-1,0,8,26,9],
      ['p','S','H',0.5,0,1,8,24,8],
      ['s','S','E',0.5,1,0,6,16,6],
    ],
  },

  'remada-invertida-pausa': {
    id: 'remada-invertida-pausa',
    name: 'Remada Invertida com Pausa de 2 s no Topo',
    model: 'row',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.2,-1,0,6,20,9],
      ['p','S','E',0.5,0,-1,4,14,6],
      ['s','S','H',0.05,-1,0,5,14,7],
      ['s','E','W',0.45,0,-1,3,12,5],
    ],
  },

  'rosca-biceps-barra-baixa': {
    id: 'rosca-biceps-barra-baixa',
    name: 'Rosca de Bíceps na Barra Baixa (Bodyweight Curl)',
    model: 'row',
    params: {
          isChinup: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.2,-1,0,6,20,9],
      ['p','S','E',0.5,0,-1,4,14,6],
      ['s','S','H',0.05,-1,0,5,14,7],
      ['s','E','W',0.45,0,-1,3,12,5],
    ],
  },

  'rosca-biceps-toalha-porta': {
    id: 'rosca-biceps-toalha-porta',
    name: 'Rosca de Bíceps com Toalha na Porta',
    model: 'row',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.2,-1,0,6,20,9],
      ['p','S','E',0.5,0,-1,4,14,6],
      ['s','S','H',0.05,-1,0,5,14,7],
      ['s','E','W',0.45,0,-1,3,12,5],
    ],
  },

  'rosca-biceps-mochila': {
    id: 'rosca-biceps-mochila',
    name: 'Rosca com Mochila (Carga Improvisada)',
    model: 'standing_stretch',
    params: {
          type: "biceps"
    },
    far: [5,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','H','K',0.5,1,0,8,26,9],
      ['s','H','K',0.2,1,0,6,16,6],
    ],
  },

  'prancha-joelhos': {
    id: 'prancha-joelhos',
    name: 'Prancha Isométrica com Joelhos no Chão',
    model: 'plank',
    params: {
          isKnee: true
    },
    far: [6,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,6,22,8],
      ['s','H','K',0.5,0,1,6,18,7],
      ['s','S','E',0.2,0,1,4,12,6],
    ],
  },

  'plank': {
    id: 'plank',
    name: 'Prancha Tradicional no Solo',
    model: 'plank',
    params: {},
    far: [6,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,6,22,8],
      ['s','H','K',0.5,0,1,6,18,7],
      ['s','S','E',0.2,0,1,4,12,6],
    ],
  },

  'prancha-toque-ombro': {
    id: 'prancha-toque-ombro',
    name: 'Prancha com Toque nos Ombros',
    model: 'plank',
    params: {
          isShoulderTap: true,
          isHigh: true
    },
    far: [6,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,6,22,8],
      ['s','H','K',0.5,0,1,6,18,7],
      ['s','S','E',0.2,0,1,4,12,6],
    ],
  },

  'dead-bug': {
    id: 'dead-bug',
    name: 'Dead Bug (Inseto Morto)',
    model: 'deadbug',
    params: {},
    far: [5,-4],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.5,0,1,6,20,8],
      ['s','H','K',0.15,0,1,5,14,7],
      ['s','S','E',0.3,0,-1,4,12,5],
    ],
  },

  'hollow-hold-tuck': {
    id: 'hollow-hold-tuck',
    name: 'Hollow Hold Tuck (Canoa Dobrada)',
    model: 'hollow',
    params: {
          isTuck: true
    },
    far: [5,-3],
    durationSeconds: 3.2,
    muscles: [
      ['p','S','H',0.5,0,1,7,22,9],
      ['s','H','K',0.2,1,0,6,14,7],
    ],
  },

  'hollowbody': {
    id: 'hollowbody',
    name: 'Hollow Body Hold (Canoa Completa)',
    model: 'hollow',
    params: {
          isTuck: false
    },
    far: [5,-3],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,7,24,9],
      ['p','H','K',0.2,1,0,6,16,7],
      ['s','S','E',0.2,0,1,4,12,5],
    ],
  },

  'elevacao-joelhos-deitado': {
    id: 'elevacao-joelhos-deitado',
    name: 'Elevação de Joelhos Deitado no Solo',
    model: 'crunch',
    params: {
          isLegRaise: true
    },
    far: [5,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.6,0,1,7,22,9],
      ['p','H','K',0.15,1,0,6,18,7],
      ['s','H','K',0.5,1,0,5,16,6],
    ],
  },

  'elevacao-joelhos-chao': {
    id: 'elevacao-joelhos-chao',
    name: 'Elevação de Joelhos Deitado (Reverse Crunch)',
    model: 'crunch',
    params: {
          isLegRaise: true
    },
    far: [5,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.6,0,1,7,22,9],
      ['p','H','K',0.15,1,0,6,18,7],
      ['s','H','K',0.5,1,0,5,16,6],
    ],
  },

  'elevacao-pernas-chao': {
    id: 'elevacao-pernas-chao',
    name: 'Elevação de Pernas no Solo (Lying Leg Raise)',
    model: 'crunch',
    params: {
          isLegRaise: true
    },
    far: [5,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.6,0,1,7,22,9],
      ['p','H','K',0.15,1,0,6,18,7],
      ['s','H','K',0.5,1,0,5,16,6],
    ],
  },

  'elevacao-joelhos-barra': {
    id: 'elevacao-joelhos-barra',
    name: 'Elevação de Joelhos na Barra (Hanging Knee Raise)',
    model: 'hanging_core',
    params: {
          isKnees: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.55,1,0,7,24,10],
      ['p','H','K',0.2,1,0,6,18,8],
      ['s','S','H',0.18,-1,0,6,18,8],
      ['s','E','W',0.45,0,-1,4,14,6],
    ],
  },

  'elevacao-pernas-barra': {
    id: 'elevacao-pernas-barra',
    name: 'Elevação de Pernas na Barra (Hanging Leg Raise)',
    model: 'hanging_core',
    params: {
          isToesToBar: false
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.55,1,0,7,24,10],
      ['p','H','K',0.2,1,0,6,18,8],
      ['s','S','H',0.18,-1,0,6,18,8],
      ['s','E','W',0.45,0,-1,4,14,6],
    ],
  },

  'toes-to-bar': {
    id: 'toes-to-bar',
    name: 'Pés na Barra Estritos (Toes to Bar)',
    model: 'hanging_core',
    params: {
          isToesToBar: true
    },
    far: [6,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','S','H',0.55,1,0,8,26,10],
      ['p','H','K',0.2,1,0,7,20,8],
      ['s','S','H',0.18,-1,0,7,20,8],
      ['s','E','W',0.45,0,-1,4,14,6],
    ],
  },

  'ab-wheel-joelhos': {
    id: 'ab-wheel-joelhos',
    name: 'Roda Abdominal de Joelhos (Ab Wheel Rollout)',
    model: 'ab_wheel',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.5,0,1,8,24,9],
      ['p','S','H',0.18,-1,0,6,18,8],
      ['s','S','E',0.1,1,0,5,14,6],
      ['s','H','K',0.2,1,0,6,16,7],
    ],
  },

  'ab-wheel-pe': {
    id: 'ab-wheel-pe',
    name: 'Roda Abdominal em Pé (Standing Ab Wheel)',
    model: 'ab_wheel',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.5,0,1,8,24,9],
      ['p','S','H',0.18,-1,0,6,18,8],
      ['s','S','E',0.1,1,0,5,14,6],
      ['s','H','K',0.2,1,0,6,16,7],
    ],
  },

  'dragon-flag-negativa': {
    id: 'dragon-flag-negativa',
    name: 'Dragon Flag Excêntrica (Negativa)',
    model: 'dragon_flag',
    params: {},
    far: [5,-3],
    durationSeconds: 3.8,
    muscles: [
      ['p','S','H',0.5,0,1,8,26,10],
      ['p','S','H',0.18,-1,0,7,20,8],
      ['s','H','K',0.3,1,0,6,18,7],
      ['s','S','E',0.4,0,1,4,14,6],
    ],
  },

  'dragon-flag-tuck': {
    id: 'dragon-flag-tuck',
    name: 'Dragon Flag Tuck (Joelhos Encolhidos)',
    model: 'dragon_flag',
    params: {},
    far: [5,-3],
    durationSeconds: 3.8,
    muscles: [
      ['p','S','H',0.5,0,1,8,26,10],
      ['p','S','H',0.18,-1,0,7,20,8],
      ['s','H','K',0.3,1,0,6,18,7],
      ['s','S','E',0.4,0,1,4,14,6],
    ],
  },

  'dragon-flag': {
    id: 'dragon-flag',
    name: 'Dragon Flag Completo',
    model: 'dragon_flag',
    params: {},
    far: [5,-3],
    durationSeconds: 3.8,
    muscles: [
      ['p','S','H',0.5,0,1,8,26,10],
      ['p','S','H',0.18,-1,0,7,20,8],
      ['s','H','K',0.3,1,0,6,18,7],
      ['s','S','E',0.4,0,1,4,14,6],
    ],
  },

  'prancha-lateral-joelhos': {
    id: 'prancha-lateral-joelhos',
    name: 'Prancha Lateral com Joelhos Dobrados',
    model: 'side_plank',
    params: {
          isKnee: true
    },
    far: [4,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,7,24,9],
      ['s','S','E',0.2,0,1,4,12,6],
      ['s','H','K',0.5,0,1,6,18,7],
    ],
  },

  'prancha-lateral': {
    id: 'prancha-lateral',
    name: 'Prancha Lateral Tradicional',
    model: 'side_plank',
    params: {},
    far: [4,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,7,24,9],
      ['s','S','E',0.2,0,1,4,12,6],
      ['s','H','K',0.5,0,1,6,18,7],
    ],
  },

  'prancha-lateral-elevacao-quadril': {
    id: 'prancha-lateral-elevacao-quadril',
    name: 'Prancha Lateral com Elevação de Quadril (Hip Dips)',
    model: 'side_plank',
    params: {
          isDip: true
    },
    far: [4,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,7,24,9],
      ['s','S','E',0.2,0,1,4,12,6],
      ['s','H','K',0.5,0,1,6,18,7],
    ],
  },

  'copenhagen-plank-joelho': {
    id: 'copenhagen-plank-joelho',
    name: 'Copenhagen Plank com Apoio no Joelho',
    model: 'side_plank',
    params: {
          isCopenhagen: true,
          isKnee: true
    },
    far: [4,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,7,24,9],
      ['s','S','E',0.2,0,1,4,12,6],
      ['s','H','K',0.5,0,1,6,18,7],
    ],
  },

  'copenhagen-plank-pe': {
    id: 'copenhagen-plank-pe',
    name: 'Copenhagen Plank Completo (Apoio no Tornozelo)',
    model: 'side_plank',
    params: {
          isCopenhagen: true
    },
    far: [4,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,7,24,9],
      ['s','S','E',0.2,0,1,4,12,6],
      ['s','H','K',0.5,0,1,6,18,7],
    ],
  },

  'russian-twist': {
    id: 'russian-twist',
    name: 'Russian Twist sem Carga',
    model: 'crunch',
    params: {
          isVUp: true
    },
    far: [5,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.6,0,1,7,22,9],
      ['p','H','K',0.15,1,0,6,18,7],
      ['s','H','K',0.5,1,0,5,16,6],
    ],
  },

  'mountain-climber-cruzado': {
    id: 'mountain-climber-cruzado',
    name: 'Mountain Climber Cruzado (Cross-body)',
    model: 'mountain_climber',
    params: {},
    far: [6,-2],
    durationSeconds: 3,
    muscles: [
      ['p','S','H',0.5,0,1,7,22,8],
      ['p','H','K',0.2,1,0,6,18,7],
      ['s','S','E',0.1,1,0,5,12,6],
    ],
  },

  'bird-dog': {
    id: 'bird-dog',
    name: 'Bird Dog (Perdigueiro)',
    model: 'bird_dog',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.7,0,-1,6,20,8],
      ['p','S','H',0.95,0,1,5,15,10],
      ['s','S','E',0.2,0,1,4,12,5],
      ['s','S','H',0.4,0,1,6,18,7],
    ],
  },

  'superman': {
    id: 'superman',
    name: 'Superman Isométrico no Solo',
    model: 'superman',
    params: {},
    far: [5,-3],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.7,0,-1,6,20,8],
      ['p','S','H',0.95,0,1,5,15,10],
      ['s','S','H',0.1,-1,0,6,16,7],
      ['s','H','K',0.5,0.4,1,6,20,7],
    ],
  },

  'superman-alternado': {
    id: 'superman-alternado',
    name: 'Superman Alternado (Natação no Solo)',
    model: 'superman',
    params: {},
    far: [5,-3],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.7,0,-1,6,20,8],
      ['p','S','H',0.95,0,1,5,15,10],
      ['s','S','H',0.1,-1,0,6,16,7],
      ['s','H','K',0.5,0.4,1,6,20,7],
    ],
  },

  'ponte-gluteo': {
    id: 'ponte-gluteo',
    name: 'Ponte de Glúteo no Solo (Glute Bridge)',
    model: 'bridge',
    params: {},
    far: [6,-2],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','H',0.93,0,1,4,14,12],
      ['s','H','K',0.5,0.4,1,6,24,7],
      ['s','S','H',0.55,0,-1,5,18,6],
    ],
  },

  'ponte-gluteo-unilateral': {
    id: 'ponte-gluteo-unilateral',
    name: 'Ponte de Glúteo Unilateral (Single Leg Bridge)',
    model: 'bridge',
    params: {},
    far: [6,-2],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','H',0.93,0,1,4,14,12],
      ['s','H','K',0.5,0.4,1,6,24,7],
      ['s','S','H',0.55,0,-1,5,18,6],
    ],
  },

  'hip-thrust-banco': {
    id: 'hip-thrust-banco',
    name: 'Hip Thrust Apoiado no Banco (Peso do Corpo)',
    model: 'bridge',
    params: {},
    far: [6,-2],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','H',0.93,0,1,4,14,12],
      ['s','H','K',0.5,0.4,1,6,24,7],
      ['s','S','H',0.55,0,-1,5,18,6],
    ],
  },

  'good-morning-peso-corpo': {
    id: 'good-morning-peso-corpo',
    name: 'Good Morning com Peso Corporal',
    model: 'standing_stretch',
    params: {
          type: "hamstring"
    },
    far: [5,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','H','K',0.5,1,0,8,26,9],
      ['s','H','K',0.2,1,0,6,16,6],
    ],
  },

  'nordic-curl-negativa': {
    id: 'nordic-curl-negativa',
    name: 'Nordic Hamstring Curl Negativa (Descida Excêntrica)',
    model: 'nordic_curl',
    params: {},
    far: [6,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.55,-1,0.2,8,26,8],
      ['p','S','H',0.95,0,1,6,16,10],
      ['s','S','H',0.5,0,1,6,18,7],
      ['s','K','A',0.35,-1,0,6,16,6],
    ],
  },

  'nordic-curl': {
    id: 'nordic-curl',
    name: 'Nordic Hamstring Curl Completo',
    model: 'nordic_curl',
    params: {},
    far: [6,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.55,-1,0.2,8,26,8],
      ['p','S','H',0.95,0,1,6,16,10],
      ['s','S','H',0.5,0,1,6,18,7],
      ['s','K','A',0.35,-1,0,6,16,6],
    ],
  },

  'prancha-elevacao-perna': {
    id: 'prancha-elevacao-perna',
    name: 'Prancha com Elevação Unilateral de Perna',
    model: 'plank',
    params: {},
    far: [6,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,6,22,8],
      ['s','H','K',0.5,0,1,6,18,7],
      ['s','S','E',0.2,0,1,4,12,6],
    ],
  },

  'prancha-serrote': {
    id: 'prancha-serrote',
    name: 'Prancha Serrote no Solo (Body Saw)',
    model: 'plank',
    params: {
          isSaw: true
    },
    far: [6,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,6,22,8],
      ['s','H','K',0.5,0,1,6,18,7],
      ['s','S','E',0.2,0,1,4,12,6],
    ],
  },

  'prancha-apoio-instavel': {
    id: 'prancha-apoio-instavel',
    name: 'Prancha com Pés em Apoio Instável',
    model: 'plank',
    params: {},
    far: [6,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,6,22,8],
      ['s','H','K',0.5,0,1,6,18,7],
      ['s','S','E',0.2,0,1,4,12,6],
    ],
  },

  'dead-bug-perna-estendida': {
    id: 'dead-bug-perna-estendida',
    name: 'Dead Bug com Perna Estendida',
    model: 'deadbug',
    params: {},
    far: [5,-4],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.5,0,1,6,20,8],
      ['s','H','K',0.15,0,1,5,14,7],
      ['s','S','E',0.3,0,-1,4,12,5],
    ],
  },

  'bird-dog-pausa': {
    id: 'bird-dog-pausa',
    name: 'Bird Dog com Pausa Isométrica',
    model: 'bird_dog',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.7,0,-1,6,20,8],
      ['p','S','H',0.95,0,1,5,15,10],
      ['s','S','E',0.2,0,1,4,12,5],
      ['s','S','H',0.4,0,1,6,18,7],
    ],
  },

  'hollow-hold-uma-perna': {
    id: 'hollow-hold-uma-perna',
    name: 'Hollow Hold com Uma Perna Estendida',
    model: 'hollow',
    params: {
          isTuck: false
    },
    far: [5,-3],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,7,24,9],
      ['p','H','K',0.2,1,0,6,16,7],
      ['s','S','E',0.2,0,1,4,12,5],
    ],
  },

  'hollow-rock': {
    id: 'hollow-rock',
    name: 'Hollow Rock (Balanço na Canoa)',
    model: 'hollow',
    params: {
          isTuck: false
    },
    far: [5,-3],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,7,24,9],
      ['p','H','K',0.2,1,0,6,16,7],
      ['s','S','E',0.2,0,1,4,12,5],
    ],
  },

  'elevacao-pernas-chao-pausa': {
    id: 'elevacao-pernas-chao-pausa',
    name: 'Elevação de Pernas Deitado com Pausa no Ponto Zero',
    model: 'crunch',
    params: {
          isLegRaise: true
    },
    far: [5,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.6,0,1,7,22,9],
      ['p','H','K',0.15,1,0,6,18,7],
      ['s','H','K',0.5,1,0,5,16,6],
    ],
  },

  'flutter-kicks': {
    id: 'flutter-kicks',
    name: 'Tesoura Abdominal no Solo (Flutter Kicks)',
    model: 'crunch',
    params: {
          isLegRaise: true
    },
    far: [5,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.6,0,1,7,22,9],
      ['p','H','K',0.15,1,0,6,18,7],
      ['s','H','K',0.5,1,0,5,16,6],
    ],
  },

  'crunch-solo': {
    id: 'crunch-solo',
    name: 'Abdominal Curto no Solo (Crunch Tradicional)',
    model: 'crunch',
    params: {},
    far: [5,-3],
    durationSeconds: 3.2,
    muscles: [
      ['p','S','H',0.45,0,1,7,22,8],
      ['s','S','H',0.1,0,1,5,14,7],
    ],
  },

  'abdominal-completo': {
    id: 'abdominal-completo',
    name: 'Abdominal Completo no Solo (Sit-Up)',
    model: 'crunch',
    params: {},
    far: [5,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.6,0,1,7,22,9],
      ['p','H','K',0.15,1,0,6,18,7],
      ['s','H','K',0.5,1,0,5,16,6],
    ],
  },

  'abdominal-canivete': {
    id: 'abdominal-canivete',
    name: 'Abdominal Canivete no Solo (V-Up)',
    model: 'crunch',
    params: {
          isVUp: true
    },
    far: [5,-3],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','H',0.5,0,1,7,24,9],
      ['p','H','K',0.2,1,0,6,18,7],
      ['s','S','E',0.3,0,-1,4,14,6],
    ],
  },

  'abdominal-bicicleta': {
    id: 'abdominal-bicicleta',
    name: 'Abdominal Bicicleta (Bicycle Crunch)',
    model: 'crunch',
    params: {
          isVUp: false
    },
    far: [5,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.6,0,1,7,22,9],
      ['p','H','K',0.15,1,0,6,18,7],
      ['s','H','K',0.5,1,0,5,16,6],
    ],
  },

  'russian-twist-pes-elevados': {
    id: 'russian-twist-pes-elevados',
    name: 'Russian Twist com Pés Elevados',
    model: 'crunch',
    params: {
          isVUp: true
    },
    far: [5,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.6,0,1,7,22,9],
      ['p','H','K',0.15,1,0,6,18,7],
      ['s','H','K',0.5,1,0,5,16,6],
    ],
  },

  'mountain-climbers': {
    id: 'mountain-climbers',
    name: 'Mountain Climbers Frontal Tradicional',
    model: 'mountain_climber',
    params: {},
    far: [6,-2],
    durationSeconds: 3,
    muscles: [
      ['p','S','H',0.5,0,1,7,22,8],
      ['p','H','K',0.2,1,0,6,18,7],
      ['s','S','E',0.1,1,0,5,12,6],
    ],
  },

  'heel-touch': {
    id: 'heel-touch',
    name: 'Toque nos Calcanhares Alternado (Penguin Crunch)',
    model: 'crunch',
    params: {},
    far: [5,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.6,0,1,7,22,9],
      ['p','H','K',0.15,1,0,6,18,7],
      ['s','H','K',0.5,1,0,5,16,6],
    ],
  },

  'ab-wheel-negativa': {
    id: 'ab-wheel-negativa',
    name: 'Roda Abdominal Excêntrica (Descida Controlada)',
    model: 'ab_wheel',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.5,0,1,8,24,9],
      ['p','S','H',0.18,-1,0,6,18,8],
      ['s','S','E',0.1,1,0,5,14,6],
      ['s','H','K',0.2,1,0,6,16,7],
    ],
  },

  'dragon-flag-adv-tuck': {
    id: 'dragon-flag-adv-tuck',
    name: 'Dragon Flag Advanced Tuck (Coxas a 90°)',
    model: 'dragon_flag',
    params: {},
    far: [5,-3],
    durationSeconds: 3.8,
    muscles: [
      ['p','S','H',0.5,0,1,8,26,10],
      ['p','S','H',0.18,-1,0,7,20,8],
      ['s','H','K',0.3,1,0,6,18,7],
      ['s','S','E',0.4,0,1,4,14,6],
    ],
  },

  'dragon-flag-uma-perna': {
    id: 'dragon-flag-uma-perna',
    name: 'Dragon Flag com Uma Perna Estendida',
    model: 'dragon_flag',
    params: {},
    far: [5,-3],
    durationSeconds: 3.8,
    muscles: [
      ['p','S','H',0.5,0,1,8,26,10],
      ['p','S','H',0.18,-1,0,7,20,8],
      ['s','H','K',0.3,1,0,6,18,7],
      ['s','S','E',0.4,0,1,4,14,6],
    ],
  },

  'bar-pullover-joelhos': {
    id: 'bar-pullover-joelhos',
    name: 'Bar Pull-Over com Joelhos Flexionados',
    model: 'hanging_core',
    params: {
          isToesToBar: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.55,1,0,7,24,10],
      ['p','H','K',0.2,1,0,6,18,8],
      ['s','S','H',0.18,-1,0,6,18,8],
      ['s','E','W',0.45,0,-1,4,14,6],
    ],
  },

  'lsit-pes-chao': {
    id: 'lsit-pes-chao',
    name: 'L-Sit com Apoio de Calcanhares no Solo',
    model: 'lsit_skill',
    params: {
          type: "tuck"
    },
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.5,0,1,8,26,9],
      ['p','H','K',0.2,1,0,7,18,7],
      ['s','H','K',0.5,1,0,7,22,8],
      ['s','S','E',0.5,-1,0,6,18,7],
    ],
  },

  'pike-compression': {
    id: 'pike-compression',
    name: 'Compressão Pike no Solo (Elevação de Pernas Sentado)',
    model: 'crunch',
    params: {
          isVUp: true
    },
    far: [5,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.6,0,1,7,22,9],
      ['p','H','K',0.15,1,0,6,18,7],
      ['s','H','K',0.5,1,0,5,16,6],
    ],
  },

  'straddle-compression': {
    id: 'straddle-compression',
    name: 'Compressão Straddle no Solo (Pernas Afastadas)',
    model: 'crunch',
    params: {
          isVUp: true
    },
    far: [5,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.6,0,1,7,22,9],
      ['p','H','K',0.15,1,0,6,18,7],
      ['s','H','K',0.5,1,0,5,16,6],
    ],
  },

  'agachamento-assistido': {
    id: 'agachamento-assistido',
    name: 'Agachamento Assistido (Apoio em Porta ou Cadeira)',
    model: 'squat',
    params: {},
    far: [5,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,24,9],
      ['p','H','K',0.08,-1,0.3,8,12,11],
      ['s','H','K',0.55,-1,0.2,6,22,6],
      ['s','K','A',0.35,-1,0,6,16,6],
      ['s','S','H',0.5,1,0,5,18,8],
    ],
  },

  'squat': {
    id: 'squat',
    name: 'Agachamento Livre Tradicional (Air Squat)',
    model: 'squat',
    params: {},
    far: [5,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,24,9],
      ['p','H','K',0.08,-1,0.3,8,12,11],
      ['s','H','K',0.55,-1,0.2,6,22,6],
      ['s','K','A',0.35,-1,0,6,16,6],
      ['s','S','H',0.5,1,0,5,18,8],
    ],
  },

  'agachamento-parede': {
    id: 'agachamento-parede',
    name: 'Agachamento Isométrico na Parede (Wall Sit)',
    model: 'squat',
    params: {
          isWallSit: true
    },
    far: [5,-2],
    durationSeconds: 3.2,
    muscles: [
      ['p','H','K',0.5,1,0,7,24,9],
      ['s','H','K',0.08,-1,0.3,7,12,10],
      ['s','S','H',0.5,1,0,5,18,8],
    ],
  },

  'agachamento-sumo': {
    id: 'agachamento-sumo',
    name: 'Agachamento Sumô',
    model: 'squat',
    params: {
          isSumo: true
    },
    far: [5,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,24,9],
      ['p','H','K',0.08,-1,0.3,8,12,11],
      ['s','H','K',0.55,-1,0.2,6,22,6],
      ['s','K','A',0.35,-1,0,6,16,6],
      ['s','S','H',0.5,1,0,5,18,8],
    ],
  },

  'agachamento-pausa': {
    id: 'agachamento-pausa',
    name: 'Agachamento com Pausa de 3 Segundos',
    model: 'squat',
    params: {},
    far: [5,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,24,9],
      ['p','H','K',0.08,-1,0.3,8,12,11],
      ['s','H','K',0.55,-1,0.2,6,22,6],
      ['s','K','A',0.35,-1,0,6,16,6],
      ['s','S','H',0.5,1,0,5,18,8],
    ],
  },

  'agachamento-salto': {
    id: 'agachamento-salto',
    name: 'Agachamento com Salto (Jump Squat)',
    model: 'squat',
    params: {
          isJump: true
    },
    far: [5,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,24,9],
      ['p','H','K',0.08,-1,0.3,8,12,11],
      ['s','H','K',0.55,-1,0.2,6,22,6],
      ['s','K','A',0.35,-1,0,6,16,6],
      ['s','S','H',0.5,1,0,5,18,8],
    ],
  },

  'lunges': {
    id: 'lunges',
    name: 'Afundo Tradicional para a Frente (Walking/Forward Lunge)',
    model: 'lunge',
    params: {},
    far: [-8,2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,22,8],
      ['p','H','K',0.08,-1,0.3,7,12,10],
      ['s','H','K',0.55,-1,0.2,6,18,6],
      ['s','K','A',0.35,-1,0,5,14,5],
    ],
  },

  'afundo-reverso': {
    id: 'afundo-reverso',
    name: 'Afundo Reverso (Passo para Trás)',
    model: 'lunge',
    params: {},
    far: [-8,2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,22,8],
      ['p','H','K',0.08,-1,0.3,7,12,10],
      ['s','H','K',0.55,-1,0.2,6,18,6],
      ['s','K','A',0.35,-1,0,5,14,5],
    ],
  },

  'afundo-bulgaro': {
    id: 'afundo-bulgaro',
    name: 'Agachamento Búlgaro (Bulgarian Split Squat)',
    model: 'bulgarian',
    params: {},
    far: [-8,2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,24,9],
      ['p','H','K',0.08,-1,0.3,7,13,10],
      ['s','H','K',0.55,-1,0.2,6,18,6],
    ],
  },

  'cossack-squat': {
    id: 'cossack-squat',
    name: 'Agachamento Cossaco (Cossack Squat)',
    model: 'squat',
    params: {
          isCossack: true
    },
    far: [5,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,24,9],
      ['p','H','K',0.08,-1,0.3,8,12,11],
      ['s','H','K',0.55,-1,0.2,6,22,6],
      ['s','K','A',0.35,-1,0,6,16,6],
      ['s','S','H',0.5,1,0,5,18,8],
    ],
  },

  'step-up-baixo': {
    id: 'step-up-baixo',
    name: 'Subida no Banco Baixo (Low Step-Up)',
    model: 'bulgarian',
    params: {},
    far: [-8,2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,24,9],
      ['p','H','K',0.08,-1,0.3,7,13,10],
      ['s','H','K',0.55,-1,0.2,6,18,6],
    ],
  },

  'step-up-alto': {
    id: 'step-up-alto',
    name: 'Subida no Banco Alto (High Step-Up)',
    model: 'bulgarian',
    params: {},
    far: [-8,2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,24,9],
      ['p','H','K',0.08,-1,0.3,7,13,10],
      ['s','H','K',0.55,-1,0.2,6,18,6],
    ],
  },

  'panturrilha-dupla': {
    id: 'panturrilha-dupla',
    name: 'Elevação de Panturrilha em Degrau com Dois Pés',
    model: 'calf',
    params: {
          isStep: true
    },
    far: [5,-2],
    durationSeconds: 3.2,
    muscles: [
      ['p','K','A',0.35,-1,0,7,22,9],
      ['s','H','K',0.5,1,0,5,16,7],
    ],
  },

  'panturrilha-unilateral': {
    id: 'panturrilha-unilateral',
    name: 'Elevação de Panturrilha Unilateral em Degrau',
    model: 'calf',
    params: {
          isStep: true
    },
    far: [5,-2],
    durationSeconds: 3.2,
    muscles: [
      ['p','K','A',0.35,-1,0,7,22,9],
      ['s','H','K',0.5,1,0,5,16,7],
    ],
  },

  'pistol-squat-assistido': {
    id: 'pistol-squat-assistido',
    name: 'Pistol Squat Assistido (com Apoio ou Elástico)',
    model: 'pistol',
    params: {},
    far: [-6,0],
    durationSeconds: 4,
    muscles: [
      ['p','H','K',0.5,1,0,7,25,9],
      ['p','H','K',0.08,-1,0.3,8,14,11],
      ['s','K','A',0.35,-1,0,6,16,6],
      ['s','S','H',0.5,1,0,5,18,8],
    ],
  },

  'pistol-squat-caixa': {
    id: 'pistol-squat-caixa',
    name: 'Pistol Squat na Caixa (Box Pistol Squat)',
    model: 'squat',
    params: {
          isBox: true
    },
    far: [5,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,24,9],
      ['p','H','K',0.08,-1,0.3,8,12,11],
      ['s','H','K',0.55,-1,0.2,6,22,6],
      ['s','K','A',0.35,-1,0,6,16,6],
      ['s','S','H',0.5,1,0,5,18,8],
    ],
  },

  'pistolsquat': {
    id: 'pistolsquat',
    name: 'Pistol Squat Livre (Agachamento Pistola)',
    model: 'pistol',
    params: {},
    far: [-6,0],
    durationSeconds: 4,
    muscles: [
      ['p','H','K',0.5,1,0,7,25,9],
      ['p','H','K',0.08,-1,0.3,8,14,11],
      ['s','K','A',0.35,-1,0,6,16,6],
      ['s','S','H',0.5,1,0,5,18,8],
    ],
  },

  'shrimp-squat': {
    id: 'shrimp-squat',
    name: 'Shrimp Squat (Agachamento Camarão)',
    model: 'lunge',
    params: {},
    far: [-8,2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,22,8],
      ['p','H','K',0.08,-1,0.3,7,12,10],
      ['s','H','K',0.55,-1,0.2,6,18,6],
      ['s','K','A',0.35,-1,0,5,14,5],
    ],
  },

  'ponte-gluteo-pes-elevados': {
    id: 'ponte-gluteo-pes-elevados',
    name: 'Ponte de Glúteo com Pés Elevados',
    model: 'bridge',
    params: {},
    far: [6,-2],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','H',0.93,0,1,4,14,12],
      ['s','H','K',0.5,0.4,1,6,24,7],
      ['s','S','H',0.55,0,-1,5,18,6],
    ],
  },

  'hip-thrust-unilateral-banco': {
    id: 'hip-thrust-unilateral-banco',
    name: 'Hip Thrust Unilateral Apoiado no Banco',
    model: 'bridge',
    params: {},
    far: [6,-2],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','H',0.93,0,1,4,14,12],
      ['s','H','K',0.5,0.4,1,6,24,7],
      ['s','S','H',0.55,0,-1,5,18,6],
    ],
  },

  'slider-leg-curl': {
    id: 'slider-leg-curl',
    name: 'Slider Leg Curl (Flexão Deslizando com Toalha)',
    model: 'bridge',
    params: {},
    far: [6,-2],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','H',0.93,0,1,4,14,12],
      ['s','H','K',0.5,0.4,1,6,24,7],
      ['s','S','H',0.55,0,-1,5,18,6],
    ],
  },

  'stiff-unilateral-peso-corpo': {
    id: 'stiff-unilateral-peso-corpo',
    name: 'Stiff Unilateral com Peso Corporal (Single-Leg RDL)',
    model: 'standing_stretch',
    params: {
          type: "hamstring"
    },
    far: [5,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','H','K',0.5,1,0,8,26,9],
      ['s','H','K',0.2,1,0,6,16,6],
    ],
  },

  'extensao-quadril-quatro-apoios': {
    id: 'extensao-quadril-quatro-apoios',
    name: 'Extensão de Quadril em Quatro Apoios (Donkey Kick)',
    model: 'bird_dog',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.7,0,-1,6,20,8],
      ['p','S','H',0.95,0,1,5,15,10],
      ['s','S','E',0.2,0,1,4,12,5],
      ['s','S','H',0.4,0,1,6,18,7],
    ],
  },

  'hidrante-quatro-apoios': {
    id: 'hidrante-quatro-apoios',
    name: 'Hidrante (Fire Hydrant)',
    model: 'bird_dog',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.7,0,-1,6,20,8],
      ['p','S','H',0.95,0,1,5,15,10],
      ['s','S','E',0.2,0,1,4,12,5],
      ['s','S','H',0.4,0,1,6,18,7],
    ],
  },

  'panturrilha-sentado-mochila': {
    id: 'panturrilha-sentado-mochila',
    name: 'Elevação de Panturrilha Sentado com Mochila',
    model: 'calf',
    params: {
          isStep: false
    },
    far: [5,-2],
    durationSeconds: 3.2,
    muscles: [
      ['p','K','A',0.35,-1,0,7,22,9],
      ['s','H','K',0.5,1,0,5,16,7],
    ],
  },

  'panturrilha-degrau-pausa': {
    id: 'panturrilha-degrau-pausa',
    name: 'Elevação de Panturrilha com Pausa de 3 s no Topo',
    model: 'calf',
    params: {
          isStep: true
    },
    far: [5,-2],
    durationSeconds: 3.2,
    muscles: [
      ['p','K','A',0.35,-1,0,7,22,9],
      ['s','H','K',0.5,1,0,5,16,7],
    ],
  },

  'saltos-pogo': {
    id: 'saltos-pogo',
    name: 'Saltos Pogo (Pogo Hops)',
    model: 'calf',
    params: {
          isStep: false
    },
    far: [5,-2],
    durationSeconds: 3.2,
    muscles: [
      ['p','K','A',0.35,-1,0,7,22,9],
      ['s','H','K',0.5,1,0,5,16,7],
    ],
  },

  'lsit-solo-tuck': {
    id: 'lsit-solo-tuck',
    name: 'Tuck L-Sit no Solo ou Paralelas',
    model: 'lsit_skill',
    params: {
          type: "tuck"
    },
    far: [4,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,8,24,8],
      ['p','H','K',0.2,1,0,7,18,7],
      ['s','S','E',0.5,-1,0,6,16,6],
    ],
  },

  'lsit-solo-uma-perna': {
    id: 'lsit-solo-uma-perna',
    name: 'L-Sit com Uma Perna Estendida',
    model: 'lsit_skill',
    params: {
          type: "one-leg"
    },
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.5,0,1,8,26,9],
      ['p','H','K',0.2,1,0,7,18,7],
      ['s','H','K',0.5,1,0,7,22,8],
      ['s','S','E',0.5,-1,0,6,18,7],
    ],
  },

  'lsit': {
    id: 'lsit',
    name: 'L-Sit Completo (Solo ou Paralelas)',
    model: 'lsit_skill',
    params: {
          type: "full"
    },
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.5,0,1,8,26,9],
      ['p','H','K',0.2,1,0,7,18,7],
      ['s','H','K',0.5,1,0,7,22,8],
      ['s','S','E',0.5,-1,0,6,18,7],
    ],
  },

  'vsit': {
    id: 'vsit',
    name: 'V-Sit de Ginástica',
    model: 'lsit_skill',
    params: {
          type: "vsit"
    },
    far: [4,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','S','H',0.5,0,1,9,28,9],
      ['p','H','K',0.2,1,0,8,20,8],
      ['s','H','K',0.5,1,0,7,22,8],
      ['s','S','E',0.5,-1,0,6,18,7],
    ],
  },

  'crow-pose': {
    id: 'crow-pose',
    name: 'Crow Pose (Postura do Corvo - Bakasana)',
    model: 'arm_balance',
    params: {
          type: "crow"
    },
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.5,-1,0,7,18,7],
      ['p','S','E',0.12,1,0,6,14,7],
      ['s','S','H',0.5,0,1,7,20,7],
    ],
  },

  'crane-pose': {
    id: 'crane-pose',
    name: 'Crane Pose (Postura da Garça com Braços Retos)',
    model: 'arm_balance',
    params: {
          type: "crane"
    },
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.12,1,0,7,16,7],
      ['p','S','H',0.5,0,1,8,22,8],
      ['s','S','E',0.5,-1,0,6,16,6],
    ],
  },

  'planche-lean': {
    id: 'planche-lean',
    name: 'Planche Lean (Inclinação para Prancha)',
    model: 'planche_skill',
    params: {
          type: "lean"
    },
    far: [4,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','E',0.12,1,0,8,18,8],
      ['p','S','H',0.2,1,0,7,20,7],
      ['s','S','H',0.5,0,1,7,22,8],
    ],
  },

  'tuck-planche': {
    id: 'tuck-planche',
    name: 'Tuck Planche no Solo ou Paralelas',
    model: 'planche_skill',
    params: {
          type: "tuck"
    },
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.12,1,0,8,18,8],
      ['p','S','H',0.5,0,1,8,24,8],
      ['s','S','E',0.5,-1,0,6,16,6],
    ],
  },

  'straddle-planche': {
    id: 'straddle-planche',
    name: 'Straddle Planche (Pernas Afastadas)',
    model: 'planche_skill',
    params: {
          type: "straddle"
    },
    far: [4,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','E',0.12,1,0,8,18,8],
      ['p','S','H',0.2,1,0,7,20,7],
      ['s','S','H',0.5,0,1,7,22,8],
    ],
  },

  'planche': {
    id: 'planche',
    name: 'Full Planche (Prancha Completa)',
    model: 'planche_skill',
    params: {
          type: "full"
    },
    far: [4,-2],
    durationSeconds: 4,
    muscles: [
      ['p','S','E',0.12,1,0,9,22,9],
      ['p','S','H',0.6,0,-1,9,28,9],
      ['s','S','H',0.5,0,1,8,24,8],
      ['s','S','H',0.9,0,1,7,18,8],
    ],
  },

  'tuck-front-lever': {
    id: 'tuck-front-lever',
    name: 'Tuck Front Lever na Barra',
    model: 'front_lever_skill',
    params: {
          type: "tuck"
    },
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.22,-1,0,8,26,9],
      ['p','S','H',0.5,0,1,8,24,8],
      ['s','S','E',0.5,1,0,6,16,6],
    ],
  },

  'frontlever': {
    id: 'frontlever',
    name: 'Front Lever Completo na Barra',
    model: 'front_lever_skill',
    params: {
          type: "full"
    },
    far: [4,-2],
    durationSeconds: 4,
    muscles: [
      ['p','S','H',0.22,-1,0,9,28,9],
      ['p','S','H',0.5,0,1,9,28,9],
      ['s','S','E',0.5,1,0,7,18,7],
      ['s','H','K',0.5,1,0,7,22,7],
    ],
  },

  'tuck-back-lever': {
    id: 'tuck-back-lever',
    name: 'Tuck Back Lever na Barra ou Argolas',
    model: 'back_lever_skill',
    params: {
          type: "tuck"
    },
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.12,1,0,8,18,8],
      ['p','S','H',0.22,1,0,8,22,8],
      ['s','S','H',0.5,0,1,7,20,7],
    ],
  },

  'back-lever': {
    id: 'back-lever',
    name: 'Back Lever Completo',
    model: 'back_lever_skill',
    params: {
          type: "full"
    },
    far: [4,-2],
    durationSeconds: 4,
    muscles: [
      ['p','S','E',0.12,1,0,9,22,8],
      ['p','S','H',0.22,1,0,9,24,9],
      ['s','S','H',0.6,0,-1,8,26,8],
      ['s','S','H',0.9,0,1,7,18,8],
    ],
  },

  'bandeira-humana-tuck': {
    id: 'bandeira-humana-tuck',
    name: 'Bandeira Humana Tuck (Human Flag Encolhida)',
    model: 'human_flag',
    params: {
          type: "tuck"
    },
    far: [3,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.5,0,1,9,24,9],
      ['p','S','H',0.22,-1,0,8,24,8],
      ['s','S','E',0.12,1,0,7,18,7],
    ],
  },

  'bandeira-humana': {
    id: 'bandeira-humana',
    name: 'Bandeira Humana Completa (Full Human Flag)',
    model: 'human_flag',
    params: {
          type: "full"
    },
    far: [3,-2],
    durationSeconds: 4,
    muscles: [
      ['p','S','H',0.5,0,1,9,28,9],
      ['p','S','H',0.22,-1,0,9,26,9],
      ['s','S','E',0.12,1,0,8,20,8],
      ['s','H','K',0.3,1,0,7,18,7],
    ],
  },

  'adv-tuck-planche': {
    id: 'adv-tuck-planche',
    name: 'Advanced Tuck Planche',
    model: 'planche_skill',
    params: {
          type: "adv-tuck"
    },
    far: [4,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','S','E',0.12,1,0,8,20,8],
      ['p','S','H',0.6,0,-1,8,26,8],
      ['s','S','H',0.5,0,1,7,22,8],
    ],
  },

  'planche-uma-perna': {
    id: 'planche-uma-perna',
    name: 'Planche com Uma Perna Estendida',
    model: 'planche_skill',
    params: {
          type: "adv-tuck"
    },
    far: [4,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','E',0.12,1,0,8,18,8],
      ['p','S','H',0.2,1,0,7,20,7],
      ['s','S','H',0.5,0,1,7,22,8],
    ],
  },

  'adv-tuck-front-lever': {
    id: 'adv-tuck-front-lever',
    name: 'Advanced Tuck Front Lever',
    model: 'front_lever_skill',
    params: {
          type: "adv-tuck"
    },
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.22,-1,0,8,26,9],
      ['p','S','H',0.5,0,1,8,24,8],
      ['s','S','E',0.5,1,0,6,16,6],
    ],
  },

  'front-lever-uma-perna': {
    id: 'front-lever-uma-perna',
    name: 'Front Lever com Uma Perna Estendida',
    model: 'front_lever_skill',
    params: {
          type: "adv-tuck"
    },
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.22,-1,0,8,26,9],
      ['p','S','H',0.5,0,1,8,24,8],
      ['s','S','E',0.5,1,0,6,16,6],
    ],
  },

  'straddle-front-lever': {
    id: 'straddle-front-lever',
    name: 'Straddle Front Lever',
    model: 'front_lever_skill',
    params: {
          type: "full"
    },
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.22,-1,0,8,26,9],
      ['p','S','H',0.5,0,1,8,24,8],
      ['s','S','E',0.5,1,0,6,16,6],
    ],
  },

  'adv-tuck-back-lever': {
    id: 'adv-tuck-back-lever',
    name: 'Advanced Tuck Back Lever',
    model: 'back_lever_skill',
    params: {
          type: "adv-tuck"
    },
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.12,1,0,8,18,8],
      ['p','S','H',0.22,1,0,8,22,8],
      ['s','S','H',0.5,0,1,7,20,7],
    ],
  },

  'back-lever-uma-perna': {
    id: 'back-lever-uma-perna',
    name: 'Back Lever com Uma Perna Estendida',
    model: 'back_lever_skill',
    params: {
          type: "adv-tuck"
    },
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.12,1,0,8,18,8],
      ['p','S','H',0.22,1,0,8,22,8],
      ['s','S','H',0.5,0,1,7,20,7],
    ],
  },

  'skin-the-cat': {
    id: 'skin-the-cat',
    name: 'Skin the Cat (Passagem de Ombros na Barra)',
    model: 'skin_the_cat',
    params: {},
    far: [4,-2],
    durationSeconds: 4,
    muscles: [
      ['p','S','E',0.12,1,0,8,20,8],
      ['p','S','H',0.22,-1,0,8,24,8],
      ['s','S','H',0.5,0,1,7,22,8],
    ],
  },

  'bandeira-humana-straddle': {
    id: 'bandeira-humana-straddle',
    name: 'Bandeira Humana Straddle',
    model: 'human_flag',
    params: {
          type: "full"
    },
    far: [3,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.5,0,1,9,24,9],
      ['p','S','H',0.22,-1,0,8,24,8],
      ['s','S','E',0.12,1,0,7,18,7],
    ],
  },

  'chute-parada-maos': {
    id: 'chute-parada-maos',
    name: 'Chute para Parada de Mãos (Kick-up)',
    model: 'kick_up_handstand',
    params: {},
    far: [4,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.12,1,0,8,20,8],
      ['p','S','E',0.5,-1,0,7,18,7],
      ['s','S','H',0.5,0,1,7,22,8],
    ],
  },

  'circulos-punho': {
    id: 'circulos-punho',
    name: 'Círculos Articulares de Punho (Wrist Circles)',
    model: 'standing_mobility',
    params: {},
    far: [5,-2],
    durationSeconds: 3.2,
    muscles: [
      ['p','S','E',0.12,1,0,6,16,8],
      ['s','S','H',0.15,-1,0,5,14,6],
    ],
  },

  'flexao-extensao-punho-chao': {
    id: 'flexao-extensao-punho-chao',
    name: 'Aquecimento de Punho no Solo (Wrist Rockers)',
    model: 'child_pose',
    params: {},
    far: [4,-2],
    durationSeconds: 4,
    muscles: [
      ['p','S','H',0.2,-1,0,7,22,8],
      ['p','S','H',0.6,0,-1,7,24,8],
      ['s','S','H',0.9,0,1,6,16,8],
    ],
  },

  'circulos-ombro': {
    id: 'circulos-ombro',
    name: 'Circundução de Ombros (Arm Circles)',
    model: 'standing_mobility',
    params: {},
    far: [5,-2],
    durationSeconds: 3.2,
    muscles: [
      ['p','S','E',0.12,1,0,6,16,8],
      ['s','S','H',0.15,-1,0,5,14,6],
    ],
  },

  'passagem-ombro-toalha': {
    id: 'passagem-ombro-toalha',
    name: 'Passagem de Ombros com Toalha ou Bastão (Dislocates)',
    model: 'standing_mobility',
    params: {},
    far: [5,-2],
    durationSeconds: 3.2,
    muscles: [
      ['p','S','E',0.12,1,0,6,16,8],
      ['s','S','H',0.15,-1,0,5,14,6],
    ],
  },

  'retracao-protracao-escapular': {
    id: 'retracao-protracao-escapular',
    name: 'Retração e Protração Escapular no Solo (Scap Push-up)',
    model: 'push',
    params: {
          isScapular: true
    },
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'gato-vaca': {
    id: 'gato-vaca',
    name: 'Gato-Vaca (Cat-Cow)',
    model: 'cat_cow',
    params: {},
    far: [4,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.5,0,1,7,24,8],
      ['p','S','H',0.5,0,-1,7,24,8],
      ['s','S','E',0.1,1,0,5,12,6],
    ],
  },

  'rotacao-toracica': {
    id: 'rotacao-toracica',
    name: 'Rotação Torácica em Quatro Apoios (Thread the Needle)',
    model: 'cat_cow',
    params: {},
    far: [4,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.5,0,1,7,24,8],
      ['p','S','H',0.5,0,-1,7,24,8],
      ['s','S','E',0.1,1,0,5,12,6],
    ],
  },

  'greatest-stretch': {
    id: 'greatest-stretch',
    name: 'Maior Alongamento do Mundo (World’s Greatest Stretch)',
    model: 'world_greatest_stretch',
    params: {},
    far: [4,-2],
    durationSeconds: 4.2,
    muscles: [
      ['p','H','K',0.2,1,0,7,20,8],
      ['p','S','H',0.6,0,1,7,22,8],
      ['s','S','E',0.15,1,0,6,14,6],
    ],
  },

  'rotacao-quadril-9090': {
    id: 'rotacao-quadril-9090',
    name: 'Transição 90/90 de Quadril (90/90 Hip Switch)',
    model: 'seated_hip_mobility',
    params: {},
    far: [6,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.25,1,0,7,20,8],
      ['p','S','H',0.9,0,1,6,16,8],
      ['s','H','K',0.5,-1,0,6,16,7],
    ],
  },

  'agachamento-profundo-assistido': {
    id: 'agachamento-profundo-assistido',
    name: 'Agachamento Profundo com Apoio (Deep Squat Hold)',
    model: 'deep_squat_hold',
    params: {},
    far: [6,-2],
    durationSeconds: 4,
    muscles: [
      ['p','H','K',0.5,1,0,8,24,9],
      ['p','H','K',0.2,1,0,7,18,7],
      ['s','K','A',0.5,-1,0,6,16,6],
    ],
  },

  'ativacao-gluteo-ponte': {
    id: 'ativacao-gluteo-ponte',
    name: 'Ativação Glútea na Ponte com Isometria',
    model: 'bridge',
    params: {},
    far: [6,-2],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','H',0.93,0,1,4,14,12],
      ['s','H','K',0.5,0.4,1,6,24,7],
      ['s','S','H',0.55,0,-1,5,18,6],
    ],
  },

  'dead-hang-passivo': {
    id: 'dead-hang-passivo',
    name: 'Dead Hang Passivo para Descompressão',
    model: 'pull',
    params: {
          isDeadHang: true
    },
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.18,-1,0,7,22,10],
      ['p','S','E',0.5,0,-1,4,15,6],
      ['s','E','W',0.45,0,-1,3,13,5],
      ['s','S','H',0.55,1,0,6,16,8],
    ],
  },

  'wall-angels': {
    id: 'wall-angels',
    name: 'Wall Angels (Anjo na Parede)',
    model: 'standing_mobility',
    params: {},
    far: [5,-2],
    durationSeconds: 3.2,
    muscles: [
      ['p','S','E',0.12,1,0,6,16,8],
      ['s','S','H',0.15,-1,0,5,14,6],
    ],
  },

  'elevacao-y-deitado': {
    id: 'elevacao-y-deitado',
    name: 'Elevação em Y Deitado (Prone Y Raise)',
    model: 'superman',
    params: {},
    far: [5,-3],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.7,0,-1,6,20,8],
      ['p','S','H',0.95,0,1,5,15,10],
      ['s','S','H',0.1,-1,0,6,16,7],
      ['s','H','K',0.5,0.4,1,6,20,7],
    ],
  },

  'mobilidade-tornozelo-parede': {
    id: 'mobilidade-tornozelo-parede',
    name: 'Mobilidade de Tornozelo (Joelho à Parede)',
    model: 'standing_stretch',
    params: {
          type: "calf"
    },
    far: [5,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','H','K',0.5,1,0,8,26,9],
      ['s','H','K',0.2,1,0,6,16,6],
    ],
  },

  'balanco-pernas-dinamico': {
    id: 'balanco-pernas-dinamico',
    name: 'Balanço de Pernas Frontal e Lateral (Leg Swings)',
    model: 'standing_mobility',
    params: {},
    far: [5,-2],
    durationSeconds: 3.2,
    muscles: [
      ['p','S','E',0.12,1,0,6,16,8],
      ['s','S','H',0.15,-1,0,5,14,6],
    ],
  },

  'rotacao-externa-ombro-toalha': {
    id: 'rotacao-externa-ombro-toalha',
    name: 'Rotação Externa de Ombro com Toalha',
    model: 'standing_mobility',
    params: {},
    far: [5,-2],
    durationSeconds: 3.2,
    muscles: [
      ['p','S','E',0.12,1,0,6,16,8],
      ['s','S','H',0.15,-1,0,5,14,6],
    ],
  },

  'aquecimento-cardio-leve': {
    id: 'aquecimento-cardio-leve',
    name: 'Aquecimento Cardiovascular Leve (Polichinelo e Joelho Alto)',
    model: 'squat',
    params: {
          isJump: true
    },
    far: [5,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,24,9],
      ['p','H','K',0.08,-1,0.3,8,12,11],
      ['s','H','K',0.55,-1,0.2,6,22,6],
      ['s','K','A',0.35,-1,0,6,16,6],
      ['s','S','H',0.5,1,0,5,18,8],
    ],
  },

  'alongamento-peitoral-parede': {
    id: 'alongamento-peitoral-parede',
    name: 'Alongamento de Peitoral na Parede ou Batente',
    model: 'standing_stretch',
    params: {
          type: "chest"
    },
    far: [5,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.22,1,0,8,20,8],
      ['s','S','E',0.15,1,0,6,14,6],
    ],
  },

  'alongamento-dorsal-barra': {
    id: 'alongamento-dorsal-barra',
    name: 'Alongamento de Dorsal na Barra ou Suporte (Lat Stretch)',
    model: 'standing_stretch',
    params: {
          type: "lat"
    },
    far: [5,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','S','H',0.22,-1,0,8,24,9],
      ['s','S','E',0.15,1,0,6,14,6],
    ],
  },

  'alongamento-triceps-acima': {
    id: 'alongamento-triceps-acima',
    name: 'Alongamento de Tríceps Acima da Cabeça',
    model: 'standing_stretch',
    params: {
          type: "triceps"
    },
    far: [5,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.55,-1,0,7,20,8],
      ['s','S','H',0.18,-1,0,6,18,7],
    ],
  },

  'alongamento-ombro-posterior': {
    id: 'alongamento-ombro-posterior',
    name: 'Alongamento de Deltoide Posterior (Cross-Body Stretch)',
    model: 'standing_stretch',
    params: {
          type: "shoulder"
    },
    far: [5,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','H','K',0.5,1,0,8,26,9],
      ['s','H','K',0.2,1,0,6,16,6],
    ],
  },

  'alongamento-flexores-quadril': {
    id: 'alongamento-flexores-quadril',
    name: 'Alongamento de Flexores de Quadril Meio-Ajoelhado',
    model: 'lunge',
    params: {},
    far: [-8,2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,22,8],
      ['p','H','K',0.08,-1,0.3,7,12,10],
      ['s','H','K',0.55,-1,0.2,6,18,6],
      ['s','K','A',0.35,-1,0,5,14,5],
    ],
  },

  'alongamento-quadriceps': {
    id: 'alongamento-quadriceps',
    name: 'Alongamento de Quadríceps em Pé',
    model: 'standing_stretch',
    params: {
          type: "quad"
    },
    far: [5,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','H','K',0.5,1,0,8,26,9],
      ['s','H','K',0.2,1,0,6,16,6],
    ],
  },

  'alongamento-isquiotibiais': {
    id: 'alongamento-isquiotibiais',
    name: 'Alongamento de Isquiotibiais com Coluna Alinhada',
    model: 'standing_stretch',
    params: {
          type: "hamstring"
    },
    far: [5,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,-1,0,8,26,8],
      ['s','K','A',0.4,-1,0,6,16,6],
    ],
  },

  'alongamento-panturrilha': {
    id: 'alongamento-panturrilha',
    name: 'Alongamento de Panturrilha na Parede',
    model: 'standing_stretch',
    params: {
          type: "calf"
    },
    far: [5,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','K','A',0.45,-1,0,7,20,7],
      ['s','H','K',0.5,-1,0,6,16,6],
    ],
  },

  'alongamento-gluteo-pombo': {
    id: 'alongamento-gluteo-pombo',
    name: 'Postura do Pombo para Glúteos (Pigeon Pose)',
    model: 'child_pose',
    params: {},
    far: [4,-2],
    durationSeconds: 4,
    muscles: [
      ['p','S','H',0.2,-1,0,7,22,8],
      ['p','S','H',0.6,0,-1,7,24,8],
      ['s','S','H',0.9,0,1,6,16,8],
    ],
  },

  'alongamento-borboleta': {
    id: 'alongamento-borboleta',
    name: 'Alongamento Borboleta (Baddha Konasana)',
    model: 'seated_hip_mobility',
    params: {},
    far: [6,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.25,1,0,7,20,8],
      ['p','S','H',0.9,0,1,6,16,8],
      ['s','H','K',0.5,-1,0,6,16,7],
    ],
  },

  'alongamento-rotacao-coluna': {
    id: 'alongamento-rotacao-coluna',
    name: 'Rotação de Coluna Deitado (Suave Iron Cross)',
    model: 'child_pose',
    params: {},
    far: [4,-2],
    durationSeconds: 4,
    muscles: [
      ['p','S','H',0.2,-1,0,7,22,8],
      ['p','S','H',0.6,0,-1,7,24,8],
      ['s','S','H',0.9,0,1,6,16,8],
    ],
  },

  'postura-crianca': {
    id: 'postura-crianca',
    name: 'Postura da Criança (Child’s Pose)',
    model: 'child_pose',
    params: {},
    far: [4,-2],
    durationSeconds: 4,
    muscles: [
      ['p','S','H',0.2,-1,0,7,22,8],
      ['p','S','H',0.6,0,-1,7,24,8],
      ['s','S','H',0.9,0,1,6,16,8],
    ],
  },

  // === Aliases Legados para Retrocompatibilidade ===
  'incline_pushup': {
    id: 'incline_pushup',
    name: 'Flexão inclinada',
    model: 'push',
    params: {
      benchHeight: 45
},
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'decline_pushup': {
    id: 'decline_pushup',
    name: 'Flexão declinada',
    model: 'push',
    params: {
      feetHeight: 35
},
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'knee_pushup': {
    id: 'knee_pushup',
    name: 'Flexão com joelhos',
    model: 'push',
    params: {
      isKnee: true
},
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'pseudo_planche_pushup': {
    id: 'pseudo_planche_pushup',
    name: 'Flexão pseudo planche',
    model: 'push',
    params: {
      handsFarBack: true
},
    far: [7,-3],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.1,0,1,7,14,9],
      ['p','S','E',0.5,0,-1,3,15,6],
      ['p','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,0,1,6,16,7],
      ['s','H','K',0.5,0,1,6,16,8],
    ],
  },

  'squats': {
    id: 'squats',
    name: 'Agachamento livre',
    model: 'squat',
    params: {},
    far: [5,-2],
    durationSeconds: 3.8,
    muscles: [
      ['p','H','K',0.5,1,0,6,24,9],
      ['p','H','K',0.08,-1,0.3,8,12,11],
      ['s','H','K',0.55,-1,0.2,6,22,6],
      ['s','K','A',0.35,-1,0,6,16,6],
      ['s','S','H',0.5,1,0,5,18,8],
    ],
  },

  'glute_bridge': {
    id: 'glute_bridge',
    name: 'Ponte de glúteos',
    model: 'bridge',
    params: {},
    far: [6,-2],
    durationSeconds: 3.5,
    muscles: [
      ['p','S','H',0.93,0,1,4,14,12],
      ['s','H','K',0.5,0.4,1,6,24,7],
      ['s','S','H',0.55,0,-1,5,18,6],
    ],
  },

  'australian_pullup': {
    id: 'australian_pullup',
    name: 'Remada australiana',
    model: 'row',
    params: {
      isKnees: false
},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.2,-1,0,6,20,9],
      ['p','S','E',0.5,0,-1,4,14,6],
      ['s','S','H',0.05,-1,0,5,14,7],
      ['s','E','W',0.45,0,-1,3,12,5],
    ],
  },

  'dips': {
    id: 'dips',
    name: 'Mergulho nas paralelas',
    model: 'dip',
    params: {},
    far: [6,-2],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','E',0.5,0,1,4,15,7],
      ['p','S','H',0.15,1,0,6,16,8],
      ['s','S','E',0.05,1,0,0,9,9],
      ['s','S','H',0.55,1,0,6,15,7],
    ],
  },

  'deadbug': {
    id: 'deadbug',
    name: 'Inseto morto (Dead bug)',
    model: 'deadbug',
    params: {},
    far: [5,-4],
    durationSeconds: 3.6,
    muscles: [
      ['p','S','H',0.5,0,1,6,20,8],
      ['s','H','K',0.15,0,1,5,14,7],
      ['s','S','E',0.3,0,-1,4,12,5],
    ],
  },

  'side_plank': {
    id: 'side_plank',
    name: 'Prancha lateral',
    model: 'side_plank',
    params: {},
    far: [4,-2],
    durationSeconds: 3.4,
    muscles: [
      ['p','S','H',0.5,0,1,7,24,9],
      ['s','S','E',0.2,0,1,4,12,6],
      ['s','H','K',0.5,0,1,6,18,7],
    ],
  },

};
