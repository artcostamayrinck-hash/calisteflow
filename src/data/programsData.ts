import type { StructuredProgram } from '../types/gamification';

export const STRUCTURED_PROGRAMS: StructuredProgram[] = [
  // ========================================================
  // 1. PRIMEIRA BARRA FIXA EM 8 SEMANAS
  // ========================================================
  {
    id: 'prog_first_pullup_8w',
    title: 'Primeira Barra Fixa em 8 Semanas',
    subtitle: 'Do zero à sua primeira repetição estrita sem impulso',
    description: 'Programa progressivo focado em condicionamento de pegada, retração escapular ativa e fortalecimento excêntrico para conquistar a primeira barra pronada.',
    category: 'iniciante',
    recommendedLevel: 'Iniciante',
    durationWeeks: 8,
    sessionsPerWeek: 3,
    targetGoal: 'forca',
    presentation: 'A barra fixa é o rito de passagem da calistenia. Este programa foi desenhado com base em evidências biomecânicas: iniciamos com descompressão e força isométrica, avançamos para remadas horizontais e descidas excêntricas de 5 segundos.',
    objective: 'Capacitar o praticante a executar de 1 a 3 barras fixas pronadas estritas completas sem auxílio.',
    completionCriteria: [
      'Executar 1 repetição de barra fixa pronada a partir de dead hang completo',
      'O queixo deve ultrapassar a barra de forma visível sem quebrar a postura',
      'Zero kipping ou chute com os joelhos',
    ],
    bannerGradient: 'from-cyan-600 via-blue-600 to-indigo-700',
    icon: '🧗',
    weeks: [
      {
        weekNumber: 1,
        theme: 'Fundação da Pegada & Conexão Escapular',
        weeklyGoals: ['Alcançar 30s de dead hang', 'Ativar romboides e trapézio inferior'],
        sessions: [
          {
            id: 'p1_w1_s1',
            sessionNumber: 1,
            dayLabel: 'Segunda-feira',
            title: 'Iniciação à Tração Escapular',
            focus: 'Pegada & Escápulas',
            estimatedMinutes: 20,
            exercises: [
              { exerciseId: 'dead-hang', sets: 4, repsOrHold: '25s', restSeconds: 60, notes: 'Foco em não balançar' },
              { exerciseId: 'retracao-escapular-barra', sets: 3, repsOrHold: '8 reps', restSeconds: 60, notes: 'Puxe escápulas para baixo sem dobrar cotovelos' },
              { exerciseId: 'australianpullup', sets: 3, repsOrHold: '8 reps', restSeconds: 60, notes: 'Pés apoiados confortavelmente no solo' },
            ],
          },
          {
            id: 'p1_w1_s2',
            sessionNumber: 2,
            dayLabel: 'Quarta-feira',
            title: 'Volume de Remada Horizontal',
            focus: 'Dorsais & Romboides',
            estimatedMinutes: 20,
            exercises: [
              { exerciseId: 'australianpullup', sets: 4, repsOrHold: '10 reps', restSeconds: 60 },
              { exerciseId: 'dead-hang', sets: 3, repsOrHold: '30s', restSeconds: 60 },
              { exerciseId: 'rosca-biceps-barra-baixa', sets: 3, repsOrHold: '10 reps', restSeconds: 60 },
            ],
          },
          {
            id: 'p1_w1_s3',
            sessionNumber: 3,
            dayLabel: 'Sexta-feira',
            title: 'Consolidação de Isometria',
            focus: 'Resistência de Preensão',
            estimatedMinutes: 20,
            exercises: [
              { exerciseId: 'dead-hang', sets: 4, repsOrHold: '30s', restSeconds: 60 },
              { exerciseId: 'retracao-escapular-barra', sets: 3, repsOrHold: '10 reps', restSeconds: 60 },
              { exerciseId: 'australianpullup', sets: 3, repsOrHold: '10 reps', restSeconds: 60 },
            ],
          },
        ],
      },
      {
        weekNumber: 4,
        theme: 'Transição Excêntrica & Controle de Descida',
        weeklyGoals: ['Realizar descidas de 5 segundos', 'Controlar a passagem dos 90°'],
        sessions: [
          {
            id: 'p1_w4_s1',
            sessionNumber: 10,
            dayLabel: 'Segunda-feira',
            title: 'Barra Fixa Negativa Focada',
            focus: 'Força Excêntrica Pura',
            estimatedMinutes: 25,
            exercises: [
              { exerciseId: 'barra-negativa', sets: 4, repsOrHold: '4 reps (5s descida)', restSeconds: 90, notes: 'Salte até o queixo e desça muito devagar' },
              { exerciseId: 'australianpullup', sets: 3, repsOrHold: '10 reps', restSeconds: 60 },
              { exerciseId: 'dead-hang', sets: 3, repsOrHold: '35s', restSeconds: 60 },
            ],
          },
          {
            id: 'p1_w4_s2',
            sessionNumber: 11,
            dayLabel: 'Quarta-feira',
            title: 'Tração com Elástico / Assistência',
            focus: 'Amplitude Completa',
            estimatedMinutes: 25,
            exercises: [
              { exerciseId: 'barra-com-elastico', sets: 4, repsOrHold: '6 reps', restSeconds: 90 },
              { exerciseId: 'suspensao-queixo-acima-barra', sets: 3, repsOrHold: '15s', restSeconds: 60 },
              { exerciseId: 'australianpullup', sets: 3, repsOrHold: '10 reps', restSeconds: 60 },
            ],
          },
          {
            id: 'p1_w4_s3',
            sessionNumber: 12,
            dayLabel: 'Sexta-feira',
            title: 'Potência & Retração',
            focus: 'Sobrecarga de Puxada',
            estimatedMinutes: 25,
            exercises: [
              { exerciseId: 'barra-negativa', sets: 4, repsOrHold: '4 reps (5s)', restSeconds: 90 },
              { exerciseId: 'barra-com-elastico', sets: 3, repsOrHold: '6 reps', restSeconds: 90 },
              { exerciseId: 'dead-hang', sets: 3, repsOrHold: '40s', restSeconds: 60 },
            ],
          },
        ],
      },
      {
        weekNumber: 8,
        theme: 'Semana de Realização da 1ª Barra',
        weeklyGoals: ['Testar e conquistar a primeira barra fixa estrita oficial'],
        sessions: [
          {
            id: 'p1_w8_s1',
            sessionNumber: 22,
            dayLabel: 'Segunda-feira',
            title: 'Polimento Técnico Leve',
            focus: 'Ativação Sem Fadiga',
            estimatedMinutes: 20,
            exercises: [
              { exerciseId: 'retracao-escapular-barra', sets: 3, repsOrHold: '6 reps', restSeconds: 60 },
              { exerciseId: 'barra-com-elastico', sets: 2, repsOrHold: '4 reps', restSeconds: 90 },
              { exerciseId: 'suspensao-queixo-acima-barra', sets: 2, repsOrHold: '10s', restSeconds: 60 },
            ],
          },
          {
            id: 'p1_w8_s2',
            sessionNumber: 23,
            dayLabel: 'Quarta-feira',
            title: 'O Grande Teste: A Primeira Barra!',
            focus: 'Tentativa Máxima Estrita',
            estimatedMinutes: 20,
            exercises: [
              { exerciseId: 'pullup', sets: 3, repsOrHold: '1-2 reps', restSeconds: 120, notes: 'Dia decisivo! Queixo acima da barra sem embalo' },
              { exerciseId: 'australianpullup', sets: 3, repsOrHold: '8 reps', restSeconds: 60 },
            ],
          },
          {
            id: 'p1_w8_s3',
            sessionNumber: 24,
            dayLabel: 'Sexta-feira',
            title: 'Celebração & Consolidação',
            focus: 'Consolidação da Conquista',
            estimatedMinutes: 20,
            exercises: [
              { exerciseId: 'pullup', sets: 3, repsOrHold: '1 rep', restSeconds: 120 },
              { exerciseId: 'barra-negativa', sets: 3, repsOrHold: '3 reps (6s)', restSeconds: 90 },
            ],
          },
        ],
      },
    ],
  },

  // ========================================================
  // 2. DESAFIO 30 DIAS DE FLEXÕES
  // ========================================================
  {
    id: 'prog_pushups_30d',
    title: 'Desafio 30 Dias de Flexões',
    subtitle: 'Densidade peitoral e resistência de empurrar',
    description: 'Rotina progressiva diária de curto tempo (15 min) alternando variações de alavanca com dias estratégicos de recuperação ativa.',
    category: 'resistencia',
    recommendedLevel: 'Iniciante',
    durationWeeks: 4,
    sessionsPerWeek: 5,
    targetGoal: 'resistencia',
    presentation: '30 dias dedicados a transformar seu peitoral, ombros e tríceps com variações anatômicas inteligentes, mantendo a integridade articular com descansos programados.',
    objective: 'Aumentar a capacidade de repetições consecutivas de flexão em 50% a 100%.',
    completionCriteria: [
      'Completar as 20 sessões de treino ao longo dos 30 dias respeitando os dias de pausa',
      'Bater novo recorde pessoal de flexões no teste final do 30º dia',
    ],
    bannerGradient: 'from-amber-500 via-orange-600 to-red-600',
    icon: '⚡',
    weeks: [
      {
        weekNumber: 1,
        theme: 'Padronização da Forma & Volume Base',
        weeklyGoals: ['Dominar alinhamento hollow body e cotovelos a 45°'],
        sessions: [
          {
            id: 'p2_w1_s1',
            sessionNumber: 1,
            dayLabel: 'Dia 1',
            title: 'Teste Base de Flexões',
            focus: 'Diagnóstico de Repetições',
            estimatedMinutes: 15,
            exercises: [
              { exerciseId: 'pushup', sets: 3, repsOrHold: 'Max estrito', restSeconds: 90, notes: 'Anote sua contagem base' },
              { exerciseId: 'plank', sets: 3, repsOrHold: '30s', restSeconds: 45 },
            ],
          },
          {
            id: 'p2_w1_s2',
            sessionNumber: 2,
            dayLabel: 'Dia 3',
            title: 'Acúmulo de Volume Inclinado',
            focus: 'Recrutamento Metabólico',
            estimatedMinutes: 15,
            exercises: [
              { exerciseId: 'flexao-inclinada', sets: 4, repsOrHold: '12 reps', restSeconds: 45 },
              { exerciseId: 'pushup', sets: 3, repsOrHold: '8 reps', restSeconds: 60 },
            ],
          },
          {
            id: 'p2_w1_s3',
            sessionNumber: 3,
            dayLabel: 'Dia 5',
            title: 'Isometria no Fundo & Protração',
            focus: 'Tensão Mecânica',
            estimatedMinutes: 15,
            exercises: [
              { exerciseId: 'pushup', sets: 4, repsOrHold: '8 reps (2s pausa)', restSeconds: 60 },
              { exerciseId: 'flexao-escapular', sets: 3, repsOrHold: '15 reps', restSeconds: 45 },
            ],
          },
        ],
      },
      {
        weekNumber: 4,
        theme: 'Pico de Volume & Teste do 30º Dia',
        weeklyGoals: ['Superar a marca inicial do Dia 1'],
        sessions: [
          {
            id: 'p2_w4_s1',
            sessionNumber: 18,
            dayLabel: 'Dia 26',
            title: 'Pirâmide de Flexões',
            focus: 'Densidade Final',
            estimatedMinutes: 15,
            exercises: [
              { exerciseId: 'pushup', sets: 4, repsOrHold: '12-10-8-6 reps', restSeconds: 45 },
              { exerciseId: 'diamondpushup', sets: 3, repsOrHold: '6 reps', restSeconds: 60 },
            ],
          },
          {
            id: 'p2_w4_s2',
            sessionNumber: 19,
            dayLabel: 'Dia 30',
            title: 'O Grande Teste Final dos 30 Dias',
            focus: 'Recorde Máximo Oficial',
            estimatedMinutes: 15,
            exercises: [
              { exerciseId: 'pushup', sets: 1, repsOrHold: 'Max absoluto estrito', restSeconds: 120, notes: 'Bata seu novo PR!' },
              { exerciseId: 'flexao-com-palmas', sets: 3, repsOrHold: '5 reps', restSeconds: 60 },
            ],
          },
        ],
      },
    ],
  },

  // ========================================================
  // 3. HANDSTAND EM 12 SEMANAS
  // ========================================================
  {
    id: 'prog_handstand_12w',
    title: 'Handstand Livre em 12 Semanas',
    subtitle: 'Equilíbrio, alinhamento e parada de mão no centro da sala',
    description: 'Protocolo completo para vencer o medo de cair, alinhar escápulas e ombros e dominar os micro-ajustes com a ponta dos dedos.',
    category: 'skill',
    recommendedLevel: 'Intermediário',
    durationWeeks: 12,
    sessionsPerWeek: 4,
    targetGoal: 'skills',
    presentation: 'A parada de mão não é apenas equilíbrio: é força escapular de empurrar para cima e controle proprioceptivo do centro de massa.',
    objective: 'Sustentar 10 a 20 segundos de handstand livre no meio da sala com alinhamento reto.',
    completionCriteria: [
      'Alcançar 60s ininterruptos de handstand na parede (peito para a parede)',
      'Executar a saída segura em pirueta sem cair de costas',
      'Realizar 3 sustentações livres de 10s no centro da sala',
    ],
    bannerGradient: 'from-purple-600 via-indigo-600 to-blue-700',
    icon: '🤸',
    weeks: [
      {
        weekNumber: 1,
        theme: 'Condicionamento de Punhos & Alinhamento Escapular',
        weeklyGoals: ['Fortalecer flexores de punho', 'Aprender protração escapular'],
        sessions: [
          {
            id: 'p3_w1_s1',
            sessionNumber: 1,
            dayLabel: 'Dia 1',
            title: 'Fundamentos de Punho & Pike',
            focus: 'Ombros & Punhos',
            estimatedMinutes: 20,
            exercises: [
              { exerciseId: 'flexao-extensao-punho-chao', sets: 3, repsOrHold: '15 reps', restSeconds: 45 },
              { exerciseId: 'crow-pose', sets: 4, repsOrHold: '15s', restSeconds: 60 },
              { exerciseId: 'pikepushup', sets: 3, repsOrHold: '8 reps', restSeconds: 60 },
            ],
          },
          {
            id: 'p3_w1_s2',
            sessionNumber: 2,
            dayLabel: 'Dia 2',
            title: 'Iniciação à Parede (Chest-to-Wall)',
            focus: 'Linha Reta',
            estimatedMinutes: 20,
            exercises: [
              { exerciseId: 'handstand', sets: 4, repsOrHold: '20s', restSeconds: 60, notes: 'Peito na parede' },
              { exerciseId: 'plank', sets: 3, repsOrHold: '40s', restSeconds: 45 },
            ],
          },
        ],
      },
      {
        weekNumber: 12,
        theme: 'Equilíbrio Livre no Centro da Sala',
        weeklyGoals: ['Entradas autônomas e sustentação de 10s+'],
        sessions: [
          {
            id: 'p3_w12_s1',
            sessionNumber: 45,
            dayLabel: 'Dia 1',
            title: 'Série de Entradas Livres',
            focus: 'Chute & Equilíbrio',
            estimatedMinutes: 25,
            exercises: [
              { exerciseId: 'handstand-livre', sets: 6, repsOrHold: '10-15s', restSeconds: 90 },
              { exerciseId: 'pikepushup', sets: 3, repsOrHold: '6 reps', restSeconds: 60 },
            ],
          },
        ],
      },
    ],
  },

  // ========================================================
  // 4. EVOLUÇÃO DE RESISTÊNCIA & DENSIDADE (8 SEMANAS)
  // ========================================================
  {
    id: 'prog_endurance_8w',
    title: 'Evolução de Resistência & Densidade em 8 Semanas',
    subtitle: 'Capacidade de trabalho, circuitos e condicionamento integral',
    description: 'Aumente o volume total de trabalho com descansos curtos, circuitos metabólicos e sustentação de alta frequência.',
    category: 'resistencia',
    recommendedLevel: 'Intermediário',
    durationWeeks: 8,
    sessionsPerWeek: 4,
    targetGoal: 'resistencia',
    presentation: 'Projetado para calistênicos que desejam queimar gordura, construir resistência láctica e nunca mais perder o fôlego durante sequências longas.',
    objective: 'Aumentar a capacidade de trabalho em 40% com redução média do tempo de descanso.',
    completionCriteria: [
      'Completar circuito de 5 exercícios sem pausas intermediárias',
      'Concluir 100 flexões e 50 barras na mesma sessão em menos de 25 min',
    ],
    bannerGradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    icon: '🔥',
    weeks: [
      {
        weekNumber: 1,
        theme: 'Densidade Metabólica Base',
        weeklyGoals: ['Manter descansos estritos de 45s'],
        sessions: [
          {
            id: 'p4_w1_s1',
            sessionNumber: 1,
            dayLabel: 'Segunda-feira',
            title: 'Circuito Upper Body Densidade',
            focus: 'Puxar & Empurrar',
            estimatedMinutes: 30,
            exercises: [
              { exerciseId: 'pullup', sets: 4, repsOrHold: '6 reps', restSeconds: 45 },
              { exerciseId: 'pushup', sets: 4, repsOrHold: '15 reps', restSeconds: 45 },
              { exerciseId: 'dip', sets: 4, repsOrHold: '8 reps', restSeconds: 45 },
            ],
          },
        ],
      },
    ],
  },

  // ========================================================
  // 5. DESENVOLVIMENTO DE FORÇA PURA EM 12 SEMANAS
  // ========================================================
  {
    id: 'prog_strength_12w',
    title: 'Desenvolvimento de Força Pura em 12 Semanas',
    subtitle: 'Sobrecarga de alavancas, alta tensão e ganhos de força absoluta',
    description: 'Protocolo de força máxima com séries curtas, alta intensidade mecânica e descansos longos para promover hipertrofia miofibrilar e adaptação neural.',
    category: 'forca',
    recommendedLevel: 'Avançado',
    durationWeeks: 12,
    sessionsPerWeek: 4,
    targetGoal: 'forca',
    presentation: 'Baseado na periodização ondulatória. Foco em repetições de 3 a 6 com alavancas desfavoráveis e lastro corporal.',
    objective: 'Evoluir em 2 níveis na escada de alavancas (ex: barra estrita para arqueiro ou unilateral).',
    completionCriteria: [
      'Aumentar o PR de flexões avançadas e barras com lastro ou alavanca unilateral',
      'Completar o ciclo de 12 semanas sem falhas por overtraining',
    ],
    bannerGradient: 'from-rose-600 via-red-600 to-amber-700',
    icon: '👑',
    weeks: [
      {
        weekNumber: 1,
        theme: 'Adaptação Mecânica & Alavancas Pesadas',
        weeklyGoals: ['Trabalhar na faixa de 3 a 5 repetições com 90s de descanso'],
        sessions: [
          {
            id: 'p5_w1_s1',
            sessionNumber: 1,
            dayLabel: 'Segunda-feira',
            title: 'Força Máxima de Empurrar',
            focus: 'Tensão Intensa',
            estimatedMinutes: 35,
            exercises: [
              { exerciseId: 'flexao-arqueiro', sets: 4, repsOrHold: '4 reps/lado', restSeconds: 90 },
              { exerciseId: 'dip', sets: 4, repsOrHold: '6 reps', restSeconds: 90 },
              { exerciseId: 'flexao-pseudo-planche', sets: 3, repsOrHold: '5 reps', restSeconds: 90 },
            ],
          },
        ],
      },
    ],
  },

  // ========================================================
  // 6. MOBILIDADE PARA CALISTENIA EM 4 SEMANAS
  // ========================================================
  {
    id: 'prog_mobility_4w',
    title: 'Mobilidade Articular para Calistenia em 4 Semanas',
    subtitle: 'Descompressão espinhal, punhos de aço e amplitude completa',
    description: 'Programa preventivo e restaurativo para eliminar dores articulares em punhos, ombros e lombar, desbloqueando a mobilidade necessária para alavancas.',
    category: 'mobilidade',
    recommendedLevel: 'Iniciante',
    durationWeeks: 4,
    sessionsPerWeek: 3,
    targetGoal: 'mobilidade',
    presentation: 'A flexibilidade ativa protege tendões e ligamentos. Este programa restaura a amplitude escapular e descomprime as vértebras após treinos intensos.',
    objective: 'Alcançar 180° de flexão glenoumeral sem compensação lombar e punhos sem dor.',
    completionCriteria: [
      'Completar as 12 sessões restaurativas ao longo das 4 semanas',
      'Alcançar os pés com joelhos esticados no teste sentado',
    ],
    bannerGradient: 'from-teal-600 via-emerald-600 to-green-700',
    icon: '🧘',
    weeks: [
      {
        weekNumber: 1,
        theme: 'Descompressão de Punhos & Escápulas',
        weeklyGoals: ['Aliviar sobrecarga de empurrar'],
        sessions: [
          {
            id: 'p6_w1_s1',
            sessionNumber: 1,
            dayLabel: 'Dia 1',
            title: 'Resgate de Punhos & Ombros',
            focus: 'Mobilidade Ativa',
            estimatedMinutes: 20,
            exercises: [
              { exerciseId: 'flexao-extensao-punho-chao', sets: 3, repsOrHold: '15 reps', restSeconds: 30 },
              { exerciseId: 'alongamento-dorsal-barra', sets: 3, repsOrHold: '30s', restSeconds: 30 },
              { exerciseId: 'dead-hang', sets: 3, repsOrHold: '25s', restSeconds: 45 },
            ],
          },
        ],
      },
    ],
  },
];

