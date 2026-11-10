/**
 * Catálogo de Dados de Poses do Protótipo Aprovado (JSON estruturado em TypeScript)
 * Guarda âncoras, parâmetros e músculos como DADOS puros.
 */

import type { MuscleTuple } from './referenceEngine';

export interface RawPoseDef {
  id: string;
  name: string;
  model: 'pull' | 'push' | 'squat' | 'bridge' | 'row' | 'plank' | 'dip' | 'lunge' | 'deadbug';
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
};
