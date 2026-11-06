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
  },
  {
    id: 'prog-iniciante-absoluto',
    title: 'Iniciante Absoluto: Base Articular & Adaptação',
    description: 'Criado para quem nunca treinou ou não consegue fazer flexões no chão. Foco em construir força de base sem dor ou sobrecarga.',
    category: 'Full Body',
    difficulty: 'Iniciante',
    targetAudience: 'iniciante_absoluto',
    estimatedMinutes: 25,
    safetyNotes: 'Use a parede ou uma mesa firme para inclinar as flexões e diminuir a carga no punho. Pare se sentir dor aguda.',
    exercises: [
      {
        exerciseId: 'pushup',
        sets: 3,
        targetReps: 8,
        restSeconds: 60,
        notes: 'Faça na parede ou mesa firme para reduzir a carga inicial.'
      },
      {
        exerciseId: 'squat',
        sets: 3,
        targetReps: 10,
        restSeconds: 60,
        notes: 'Pode segurar em uma cadeira para manter o equilíbrio.'
      },
      {
        exerciseId: 'australian_pullup',
        sets: 3,
        targetReps: 6,
        restSeconds: 75,
        notes: 'Posição do corpo mais inclinada para facilitar a subida.'
      },
      {
        exerciseId: 'plank',
        sets: 3,
        targetHoldSeconds: 20,
        restSeconds: 45,
        notes: 'Pode apoiar os joelhos no chão se a lombar cansar.'
      }
    ]
  },
  {
    id: 'prog-mulheres-funcional',
    title: 'Mulheres: Força Funcional & Postura',
    description: 'Ênfase em cadeia posterior, glúteos, abdômen e fortalecimento de ombros para progressão em flexões e barras.',
    category: 'Full Body',
    difficulty: 'Iniciante',
    targetAudience: 'mulheres',
    estimatedMinutes: 30,
    safetyNotes: 'Atenção ao alinhamento do joelho com a ponta dos pés nas passadas e agachamentos.',
    exercises: [
      {
        exerciseId: 'squat',
        sets: 3,
        targetReps: 15,
        restSeconds: 60,
        notes: 'Foco na ativação consciente de glúteos na subida.'
      },
      {
        exerciseId: 'lunges',
        sets: 3,
        targetReps: 12,
        restSeconds: 60,
        notes: 'Passada controlada, sem bater o joelho de trás no solo.'
      },
      {
        exerciseId: 'australian_pullup',
        sets: 3,
        targetReps: 8,
        restSeconds: 60,
        notes: 'Puxada ao peito com escápulas ativadas para correção postural.'
      },
      {
        exerciseId: 'pushup',
        sets: 3,
        targetReps: 8,
        restSeconds: 60,
        notes: 'Flexões com mãos elevadas ou joelhos no chão com controle excêntrico.'
      },
      {
        exerciseId: 'hollow_body',
        sets: 3,
        targetHoldSeconds: 25,
        restSeconds: 45,
        notes: 'Lombar totalmente colada no chão; expire profundamente.'
      }
    ]
  },
  {
    id: 'prog-40-longevidade',
    title: '40+ Longevidade Articular & Controle',
    description: 'Desenvolvido para preservar tendões e articulações. Ênfase em cadência lenta (3 segundos na descida), sem impacto e com proteção de coluna.',
    category: 'Full Body',
    difficulty: 'Iniciante',
    targetAudience: 'longevidade_40',
    estimatedMinutes: 30,
    safetyNotes: 'Cadência lenta e controlada. Evite qualquer movimento balístico ou hiperextensão de coluna.',
    exercises: [
      {
        exerciseId: 'squat',
        sets: 3,
        targetReps: 12,
        restSeconds: 75,
        notes: 'Descida lenta em 3 segundos; sem rebote no fundo.'
      },
      {
        exerciseId: 'australian_pullup',
        sets: 3,
        targetReps: 8,
        restSeconds: 75,
        notes: 'Fortalecimento de romboides e deltoide posterior para saúde dos ombros.'
      },
      {
        exerciseId: 'pushup',
        sets: 3,
        targetReps: 8,
        restSeconds: 75,
        notes: 'Cotovelos fechados a 45 graus para proteger a bursa subacromial.'
      },
      {
        exerciseId: 'plank',
        sets: 3,
        targetHoldSeconds: 30,
        restSeconds: 60,
        notes: 'Estabilização isométrica da coluna lombar sem arquear.'
      }
    ]
  },
  {
    id: 'prog-retorno-pausa',
    title: 'Retorno Pós-Pausa: Recondicionamento Gradual',
    description: 'Para quem ficou 2 semanas ou mais sem treinar. Volume calibrado para acordar o sistema muscular sem causar dor debilitante (DOMS).',
    category: 'Full Body',
    difficulty: 'Iniciante',
    targetAudience: 'retorno_pausa',
    estimatedMinutes: 25,
    safetyNotes: 'Não treine até a falha na primeira semana de retorno; mantenha 2 a 3 repetições de reserva.',
    exercises: [
      {
        exerciseId: 'pushup',
        sets: 2,
        targetReps: 10,
        restSeconds: 60,
        notes: 'Volume reduzido intencionalmente: 2 séries de ativação.'
      },
      {
        exerciseId: 'australian_pullup',
        sets: 2,
        targetReps: 8,
        restSeconds: 60,
        notes: 'Sinta a contração dorsal sem forçar a articulação do bíceps.'
      },
      {
        exerciseId: 'lunges',
        sets: 2,
        targetReps: 10,
        restSeconds: 60,
        notes: 'Reativação de pernas e equilíbrio unilateral.'
      },
      {
        exerciseId: 'plank',
        sets: 2,
        targetHoldSeconds: 30,
        restSeconds: 45,
        notes: 'Ativação do core sem fadiga residual excessiva.'
      }
    ]
  },
  {
    id: 'prog-casa-improvisos',
    title: 'Treino em Casa: Móveis & Improvisos Seguros',
    description: 'Treine sem gastar com equipamentos usando móveis comuns com rigorosos critérios de estabilidade e segurança.',
    category: 'Full Body',
    difficulty: 'Iniciante',
    targetAudience: 'casa_sem_equipamento',
    estimatedMinutes: 30,
    safetyNotes: 'ATENÇÃO: Trave a cadeira contra a parede. Na porta, verifique se fecha na direção contrária da tração.',
    exercises: [
      {
        exerciseId: 'pushup',
        sets: 3,
        targetReps: 10,
        restSeconds: 60,
        notes: 'Mãos no chão ou elevadas na borda de uma cama/mesa firme.'
      },
      {
        exerciseId: 'dips',
        sets: 3,
        targetReps: 8,
        restSeconds: 75,
        notes: 'Feito na borda de uma cadeira firme e encostada na parede.'
      },
      {
        exerciseId: 'australian_pullup',
        sets: 3,
        targetReps: 8,
        restSeconds: 75,
        notes: 'Embaixo de mesa firme e estável ou toalha bem presa na porta fechada.'
      },
      {
        exerciseId: 'squat',
        sets: 3,
        targetReps: 15,
        restSeconds: 60,
        notes: 'Peso do próprio corpo com cadência focada.'
      },
      {
        exerciseId: 'plank',
        sets: 3,
        targetHoldSeconds: 35,
        restSeconds: 45,
        notes: 'No chão com tapete ou toalha para conforto dos cotovelos.'
      }
    ]
  }
];

