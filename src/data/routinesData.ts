import type { Routine } from '../types';

export const DEFAULT_ROUTINES: Routine[] = [
  {
    id: 'push-basic',
    title: 'Push Day: Peito & Tríceps Foco',
    description: 'Rotina clássica de empurrar para hipertrofia e força de peitorais, tríceps e deltoides anteriores.',
    category: 'Push',
    difficulty: 'Iniciante',
    estimatedMinutes: 35,
    exercises: [
      {
        exerciseId: 'pushup',
        sets: 4,
        targetReps: 12,
        restSeconds: 60,
        notes: 'Mantenha os cotovelos a 45° do corpo e toque o peito no solo.'
      },
      {
        exerciseId: 'diamond_pushup',
        sets: 3,
        targetReps: 10,
        restSeconds: 75,
        notes: 'Foque na contração profunda do tríceps no topo da subida.'
      },
      {
        exerciseId: 'pike_pushup',
        sets: 3,
        targetReps: 8,
        restSeconds: 75,
        notes: 'Cabeça desce à frente das mãos formando um triângulo no solo.'
      },
      {
        exerciseId: 'plank',
        sets: 3,
        targetHoldSeconds: 45,
        restSeconds: 45,
        notes: 'Glúteos e abdômen travados para estabilização da coluna.'
      }
    ]
  },
  {
    id: 'pull-power',
    title: 'Pull Day: Costas & Bíceps',
    description: 'Desenvolvimento das costas em V, grande dorsal e bíceps com volume balanceado de tração vertical e horizontal.',
    category: 'Pull',
    difficulty: 'Intermediário',
    estimatedMinutes: 40,
    exercises: [
      {
        exerciseId: 'pullup',
        sets: 4,
        targetReps: 8,
        restSeconds: 90,
        notes: 'Queixo acima da barra com ativação escapular antes de iniciar a tração.'
      },
      {
        exerciseId: 'chinup',
        sets: 3,
        targetReps: 8,
        restSeconds: 75,
        notes: 'Pegada supinada para pico de contração dos bíceps.'
      },
      {
        exerciseId: 'australian_pullup',
        sets: 4,
        targetReps: 12,
        restSeconds: 60,
        notes: 'Puxada horizontal tocando a barra no esterno.'
      },
      {
        exerciseId: 'hollow_body',
        sets: 3,
        targetHoldSeconds: 35,
        restSeconds: 45,
        notes: 'Lombar colada no chão durante toda a sustentação.'
      }
    ]
  },
  {
    id: 'legs-core',
    title: 'Legs & Core: Membros Inferiores',
    description: 'Treino calistênico focado em potência de quadríceps, glúteos e estabilidade do complexo do core.',
    category: 'Legs',
    difficulty: 'Iniciante',
    estimatedMinutes: 30,
    exercises: [
      {
        exerciseId: 'squat',
        sets: 4,
        targetReps: 20,
        restSeconds: 60,
        notes: 'Quebre a paralela dos 90° e mantenha os joelhos para fora.'
      },
      {
        exerciseId: 'lunges',
        sets: 3,
        targetReps: 12,
        restSeconds: 60,
        notes: '12 repetições por perna com passada estável e controlada.'
      },
      {
        exerciseId: 'plank',
        sets: 3,
        targetHoldSeconds: 50,
        restSeconds: 45,
        notes: 'Mantenha a respiração cadenciada pelo diafragma.'
      },
      {
        exerciseId: 'lsit',
        sets: 3,
        targetHoldSeconds: 15,
        restSeconds: 60,
        notes: 'Se necessário faça em posição tucked (joelhos dobrados).'
      }
    ]
  },
  {
    id: 'full-body-starter',
    title: 'Full Body Fundamental',
    description: 'Rotina de corpo inteiro ideal para iniciantes ou dias de treino rápido com estímulo completo.',
    category: 'Full Body',
    difficulty: 'Iniciante',
    estimatedMinutes: 28,
    exercises: [
      {
        exerciseId: 'pushup',
        sets: 3,
        targetReps: 10,
        restSeconds: 60,
        notes: 'Ritmo cadenciado: 2s para descer, 1s para subir.'
      },
      {
        exerciseId: 'australian_pullup',
        sets: 3,
        targetReps: 10,
        restSeconds: 60,
        notes: 'Segure 1 segundo no topo com escápulas apertadas.'
      },
      {
        exerciseId: 'squat',
        sets: 3,
        targetReps: 15,
        restSeconds: 60,
        notes: 'Calcanhares firmes no solo o tempo todo.'
      },
      {
        exerciseId: 'hollow_body',
        sets: 3,
        targetHoldSeconds: 30,
        restSeconds: 45,
        notes: 'Alinhamento seguro sem arquear a coluna.'
      }
    ]
  },
  {
    id: 'pro-skills-dips',
    title: 'Elite Skills & Força Máxima',
    description: 'Rotina avançada com Mergulhos nas Paralelas, Muscle-ups e parada de mão isométrica.',
    category: 'Skill',
    difficulty: 'Avançado',
    estimatedMinutes: 45,
    exercises: [
      {
        exerciseId: 'muscleup',
        sets: 3,
        targetReps: 4,
        restSeconds: 120,
        notes: 'Transição sincronizada com cotovelos subindo juntos.'
      },
      {
        exerciseId: 'dips',
        sets: 4,
        targetReps: 10,
        restSeconds: 90,
        notes: 'Amplitude total até 90 graus de flexão de cotovelos.'
      },
      {
        exerciseId: 'handstand_hold',
        sets: 3,
        targetHoldSeconds: 30,
        restSeconds: 90,
        notes: 'Empurre o chão com os ombros cobrindo as orelhas.'
      },
      {
        exerciseId: 'lsit',
        sets: 3,
        targetHoldSeconds: 20,
        restSeconds: 75,
        notes: 'Pernas 100% esticadas e paralelas ao chão.'
      }
    ]
  }
];

