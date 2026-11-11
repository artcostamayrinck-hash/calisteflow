import type { SkillNode, SkillCategory } from '../types/gamification';

export const SKILL_CATEGORIES_CONFIG: Record<
  SkillCategory,
  { label: string; desc: string; icon: string; color: string }
> = {
  flexoes: {
    label: 'Flexões & Empurrar Horizontal',
    desc: 'Do domínio bimanual ao controle unilateral e alavancas avançadas',
    icon: '⚡',
    color: 'from-amber-500 to-orange-600',
  },
  barras: {
    label: 'Barras & Puxar Vertical',
    desc: 'Tração corporal estrita, assimetrias e alavanca unilateral',
    icon: '🧗',
    color: 'from-cyan-500 to-blue-600',
  },
  paralelas: {
    label: 'Paralelas & Mergulhos (Dips)',
    desc: 'Potência de tríceps, peitoral inferior e estabilização em argolas',
    icon: '💪',
    color: 'from-emerald-500 to-teal-600',
  },
  core: {
    label: 'Core & Compressão Abdominal',
    desc: 'L-Sit, V-Sit, Dragon Flag e alavanca de flexores do quadril',
    icon: '🛡️',
    color: 'from-purple-500 to-pink-600',
  },
  equilibrio: {
    label: 'Equilíbrio & Parada de Mão (Handstand)',
    desc: 'Alinhamento escapular, centro de massa e força vertical invertida',
    icon: '🤸',
    color: 'from-yellow-400 to-amber-500',
  },
  forca: {
    label: 'Força Integrada & Calistenia Pura',
    desc: 'Transições compostas de alta demanda neural como o Muscle-up',
    icon: '🔥',
    color: 'from-rose-500 to-red-600',
  },
  estaticos: {
    label: 'Movimentos Estáticos & Alavancas',
    desc: 'Front Lever, Planche, Back Lever e Bandeira Humana',
    icon: '🏛️',
    color: 'from-indigo-500 to-violet-600',
  },
  explosivos: {
    label: 'Movimentos Explosivos & Potência',
    desc: 'Puxadas altas, flexões pliométricas e trocas com palmas',
    icon: '💥',
    color: 'from-orange-500 to-amber-600',
  },
};

export const SKILL_TREE_NODES: SkillNode[] = [
  // ========================================================
  // 1. FLEXÕES (FLEXOES)
  // ========================================================
  {
    id: 'sk_diamond_pushup',
    name: 'Flexão Diamante',
    category: 'flexoes',
    difficulty: 'Intermediário',
    tier: 1,
    icon: '💎',
    exerciseId: 'diamondpushup',
    description: 'Flexão com mãos unidas em formato de diamante sob o esterno, focando o pico de ativação do tríceps e peitoral medial.',
    prerequisites: [
      { name: 'Flexão Tradicional', benchmarkText: '15 flexões estritas no solo' },
      { name: 'Prancha Frontal', benchmarkText: '45 segundos em postura sólida' },
    ],
    progressionSteps: [
      { id: 'dp_1', stepNumber: 1, title: 'Flexão Diamante Inclinada (Banco)', targetMetric: '3x 12 reps', exerciseId: 'flexao-inclinada', description: 'Reduza a carga apoiando as mãos em banco elevado.' },
      { id: 'dp_2', stepNumber: 2, title: 'Flexão Diamante de Joelhos', targetMetric: '3x 10 reps', exerciseId: 'flexao-joelhos', description: 'Adapte o torque nos cotovelos sem carga total.' },
      { id: 'dp_3', stepNumber: 3, title: 'Flexão Diamante no Solo', targetMetric: '3x 8 reps', exerciseId: 'diamondpushup', description: 'Movimento completo com antebraços alinhados.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'extensao-triceps-barra-baixa', title: 'Extensão de Tríceps Corporal', purpose: 'Fortalecimento do tendão tricipital', recommendedVolume: '3x 10 reps' },
      { exerciseId: 'flexao-escapular', title: 'Flexão Escapular', purpose: 'Estabilidade do serrátil anterior', recommendedVolume: '3x 15 reps' },
    ],
    evolutionCriteria: 'Realizar 3 séries de 10 repetições estritas no solo com controle de 2s sem abrir cotovelos a mais de 45°.',
    commonMistakes: [
      { mistake: 'Cotovelos excessivamente abertos em 90°', correction: 'Aponte os cotovelos para trás em ~45° para proteger a articulação.' },
      { mistake: 'Perda da retroversão pélvica e hiperlordose', correction: 'Contraia glúteos e abdômen mantendo a linha do hollow body.' },
    ],
  },
  {
    id: 'sk_archer_pushup',
    name: 'Flexão Arqueiro (Archer)',
    category: 'flexoes',
    difficulty: 'Avançado',
    tier: 2,
    icon: '🏹',
    exerciseId: 'flexao-arqueiro',
    description: 'Transição assimétrica rumo à flexão unilateral. Um braço flexiona totalmente enquanto o outro permanece reto como guia.',
    prerequisites: [
      { skillId: 'sk_diamond_pushup', name: 'Flexão Diamante', benchmarkText: '12 repetições sólidas no solo' },
      { name: 'Flexão Aberta', benchmarkText: '15 repetições controladas com pegada ampla' },
    ],
    progressionSteps: [
      { id: 'ap_1', stepNumber: 1, title: 'Flexão Arqueiro Inclinada', targetMetric: '3x 8 reps/lado', exerciseId: 'flexao-inclinada', description: 'Em banco elevado, deslize o braço auxiliar lateralmente.' },
      { id: 'ap_2', stepNumber: 2, title: 'Flexão Arqueiro com Joelhos no Chão', targetMetric: '3x 6 reps/lado', description: 'Adaptação do torque escapular no solo.' },
      { id: 'ap_3', stepNumber: 3, title: 'Flexão Arqueiro Completa', targetMetric: '3x 5 reps/lado', exerciseId: 'flexao-arqueiro', description: 'No solo, estenda o braço oposto travando o cotovelo.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'flexao-pseudo-planche', title: 'Pseudo Planche Push-up', purpose: 'Força nos deltoides anteriores e bíceps distal', recommendedVolume: '3x 8 reps' },
    ],
    evolutionCriteria: 'Realizar 5 repetições fluidas para cada lado no solo mantendo o braço estendido completamente reto.',
    commonMistakes: [
      { mistake: 'Dobrar o cotovelo do braço de apoio', correction: 'Pressione a palma do braço estendido no chão para manter o cotovelo travado.' },
    ],
  },
  {
    id: 'sk_pseudo_planche',
    name: 'Flexão Pseudo-Planche',
    category: 'flexoes',
    difficulty: 'Avançado',
    tier: 2,
    icon: '🚀',
    exerciseId: 'flexao-pseudo-planche',
    description: 'Flexão com mãos alinhadas na altura do umbigo e ombros projetados bem à frente, gerando enorme torque no deltoide anterior e tendão do bíceps.',
    prerequisites: [
      { skillId: 'sk_diamond_pushup', name: 'Flexão Diamante', benchmarkText: '15 reps com postura impecável' },
      { name: 'Planche Lean', benchmarkText: '25 segundos sustentados com protração máxima' },
    ],
    progressionSteps: [
      { id: 'pp_1', stepNumber: 1, title: 'Planche Lean Sustentado', targetMetric: '4x 20s', exerciseId: 'pushup', description: 'Apenas sustentação isométrica inclinada à frente.' },
      { id: 'pp_2', stepNumber: 2, title: 'Pseudo-Planche Push-up Curto', targetMetric: '3x 6 reps', exerciseId: 'flexao-pseudo-planche', description: 'Flexão com inclinação moderada à frente.' },
      { id: 'pp_3', stepNumber: 3, title: 'Pseudo-Planche Push-up Completo', targetMetric: '4x 6 reps', exerciseId: 'flexao-pseudo-planche', description: 'Mãos ao lado do quadril com queixo à frente das mãos.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'flexao-escapular', title: 'Protração Escapular no Solo', purpose: 'Hipertrofia e ativação de serrátil anterior', recommendedVolume: '3x 12 reps' },
    ],
    evolutionCriteria: '4 séries de 8 repetições profundas mantendo os ombros à frente das pontas dos dedos o tempo todo.',
    commonMistakes: [
      { mistake: 'Recuar os ombros para trás ao descer', correction: 'Mantenha o vetor de força inclinado à frente em toda a amplitude.' },
    ],
  },
  {
    id: 'sk_one_arm_pushup',
    name: 'Flexão Unilateral (One-Arm Push-up)',
    category: 'flexoes',
    difficulty: 'Elite',
    tier: 3,
    icon: '👑',
    exerciseId: 'flexao-unilateral',
    description: 'A maestria máxima de empurrar no solo. Sustentação de quase 70% do peso corporal em um único membro com estabilização rotacional do core.',
    prerequisites: [
      { skillId: 'sk_archer_pushup', name: 'Flexão Arqueiro', benchmarkText: '8 reps perfeitas por lado no solo' },
      { skillId: 'sk_pseudo_planche', name: 'Flexão Pseudo-Planche', benchmarkText: '8 repetições estritas' },
      { name: 'Prancha Lateral', benchmarkText: '45 segundos por lado sem inclinar o tronco' },
    ],
    progressionSteps: [
      { id: 'oap_1', stepNumber: 1, title: 'Flexão Unilateral Inclinada na Parede/Mesa', targetMetric: '3x 8 reps/lado', exerciseId: 'flexao-unilateral-assistida', description: 'Adaptação do punho e controle de rotação torácica.' },
      { id: 'oap_2', stepNumber: 2, title: 'Flexão Unilateral com Elástico de Suporte', targetMetric: '3x 5 reps/lado', description: 'Elástico sob o peito aliviando o fundo do movimento.' },
      { id: 'oap_3', stepNumber: 3, title: 'Flexão Unilateral com Pés Afastados', targetMetric: '3x 3 reps/lado', exerciseId: 'flexao-unilateral', description: 'Base ampla de pés para controlar o momento de torção.' },
      { id: 'oap_4', stepNumber: 4, title: 'Flexão Unilateral Estrita (Pés Próximos)', targetMetric: '3x 3 reps/lado', exerciseId: 'flexao-unilateral', description: 'Execução canônica com mínimo desvio do quadril.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'flexao-arqueiro', title: 'Flexão Arqueiro Profunda', purpose: 'Sobrecarga excêntrica unilateral', recommendedVolume: '3x 6 reps/lado' },
      { exerciseId: 'plank', title: 'Prancha Unilateral (1 braço, 1 perna)', purpose: 'Anti-rotação do tronco', recommendedVolume: '3x 20s/lado' },
    ],
    evolutionCriteria: 'Realizar 3 repetições limpas por braço com peito a 5cm do solo sem girar os ombros para cima.',
    commonMistakes: [
      { mistake: 'Girar o quadril excessivamente para o lado', correction: 'Empurre a ponta do pé oposto no solo para travar a rotação da pelve.' },
    ],
  },

  // ========================================================
  // 2. BARRAS (BARRAS)
  // ========================================================
  {
    id: 'sk_pullup_strict',
    name: 'Barra Fixa Pronada Estrita (Pull-up)',
    category: 'barras',
    difficulty: 'Iniciante',
    tier: 1,
    icon: '⚡',
    exerciseId: 'pullup',
    description: 'O padrão ouro da tração vertical. Puxada pronada completa da extensão escapular ao queixo acima da barra.',
    prerequisites: [
      { name: 'Dead Hang Passivo', benchmarkText: '45 segundos na barra fixa sem soltar' },
      { name: 'Remada Australiana', benchmarkText: '12 repetições limpas com pés no solo' },
    ],
    progressionSteps: [
      { id: 'pu_1', stepNumber: 1, title: 'Ativação Escapular na Barra', targetMetric: '3x 10 reps', exerciseId: 'retracao-escapular-barra', description: 'Depressão e retração das escápulas sem dobrar os braços.' },
      { id: 'pu_2', stepNumber: 2, title: 'Barra Fixa com Elástico de Apoio', targetMetric: '3x 8 reps', exerciseId: 'barra-com-elastico', description: 'Elástico sob os joelhos para construir volume de puxada.' },
      { id: 'pu_3', stepNumber: 3, title: 'Barra Fixa Negativa (Excêntrica 5s)', targetMetric: '4x 4 reps', exerciseId: 'barra-negativa', description: 'Suba com salto e desça em 5 segundos controlados.' },
      { id: 'pu_4', stepNumber: 4, title: 'Barra Fixa Estrita Completa', targetMetric: '3x 5 reps', exerciseId: 'pullup', description: 'Séries estritas sem kipping ou impulso com as pernas.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'australianpullup', title: 'Remada Australiana', purpose: 'Hipertrofia de romboides e trapézio médio', recommendedVolume: '3x 10 reps' },
      { exerciseId: 'suspensao-queixo-acima-barra', title: 'Isometria no Topo da Barra', purpose: 'Força de trava dos braços', recommendedVolume: '3x 15s' },
    ],
    evolutionCriteria: 'Realizar 3 séries de 6 repetições estritas, iniciando em dead hang e queixo claramente ultrapassando a barra.',
    commonMistakes: [
      { mistake: 'Balançar o corpo ou chutar com as pernas (kipping)', correction: 'Cruze os tornozelos e aperte os glúteos em posição hollow.' },
      { mistake: 'Encolher os ombros no pescoço', correction: 'Puxe os cotovelos em direção aos bolsos da calça.' },
    ],
  },
  {
    id: 'sk_chinup',
    name: 'Barra Supinada (Chin-up)',
    category: 'barras',
    difficulty: 'Iniciante',
    tier: 1,
    icon: '💪',
    exerciseId: 'barra-pegada-neutra',
    description: 'Puxada vertical com palmas voltadas para o corpo, recrutando expressivamente o bíceps braquial e grande dorsal.',
    prerequisites: [
      { name: 'Remada Australiana Supinada', benchmarkText: '10 reps com peito tocando a barra' },
      { name: 'Dead Hang', benchmarkText: '30 segundos' },
    ],
    progressionSteps: [
      { id: 'cu_1', stepNumber: 1, title: 'Barra Supinada com Elástico', targetMetric: '3x 8 reps', exerciseId: 'barra-com-elastico', description: 'Construa a linha motora com alívio elástico.' },
      { id: 'cu_2', stepNumber: 2, title: 'Chin-up Negativa 5s', targetMetric: '3x 5 reps', exerciseId: 'barra-negativa', description: 'Controle a descida excêntrica completa.' },
      { id: 'cu_3', stepNumber: 3, title: 'Chin-up Estrita Completa', targetMetric: '3x 6 reps', exerciseId: 'pullup', description: 'Puxada total sem balançar o tronco.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'rosca-biceps-barra-baixa', title: 'Rosca Bíceps na Barra Baixa', purpose: 'Isolamento de flexão do cotovelo', recommendedVolume: '3x 10 reps' },
    ],
    evolutionCriteria: 'Completar 3 séries de 8 repetições com peito tocando a barra no topo e extensão total embaixo.',
    commonMistakes: [
      { mistake: 'Não descer até a extensão quase completa dos braços', correction: 'Estenda os cotovelos sem soltar a tensão escapular ativa.' },
    ],
  },
  {
    id: 'sk_archer_pullup',
    name: 'Barra Arqueiro (Archer Pull-up)',
    category: 'barras',
    difficulty: 'Avançado',
    tier: 2,
    icon: '🎯',
    exerciseId: 'barra-arqueiro',
    description: 'Puxada ampla onde o corpo sobe em direção a uma das mãos enquanto o braço oposto estende-se lateralmente sobre a barra.',
    prerequisites: [
      { skillId: 'sk_pullup_strict', name: 'Barra Fixa Estrita', benchmarkText: '12 repetições estritas e controladas' },
      { name: 'Barra Aberta', benchmarkText: '8 repetições em pegada ampla' },
    ],
    progressionSteps: [
      { id: 'apu_1', stepNumber: 1, title: 'Remada Australiana Arqueiro', targetMetric: '3x 8 reps/lado', exerciseId: 'australianpullup', description: 'No solo, estenda um braço e puxe com o outro.' },
      { id: 'apu_2', stepNumber: 2, title: 'Barra com Pegada Desigual (Toalha ou Elástico)', targetMetric: '3x 5 reps/lado', exerciseId: 'barra-unilateral-assistida', description: 'Mão auxiliar segura em nível inferior.' },
      { id: 'apu_3', stepNumber: 3, title: 'Barra Arqueiro Completa', targetMetric: '3x 4 reps/lado', exerciseId: 'barra-arqueiro', description: 'Deslize o braço estendido por cima da barra.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'barra-aberta', title: 'Barra Fixa com Pegada Ampla', purpose: 'Força nos latíssimos em ângulo aberto', recommendedVolume: '3x 6 reps' },
    ],
    evolutionCriteria: 'Realizar 4 repetições controladas para cada lado com cotovelo do braço aberto 100% esticado.',
    commonMistakes: [
      { mistake: 'Dobrar o cotovelo de guia para ajudar na subida', correction: 'Apenas apoie as pontas dos dedos para permitir o deslizamento reto.' },
    ],
  },
  {
    id: 'sk_one_arm_pullup',
    name: 'Barra Unilateral (One-Arm Pull-up)',
    category: 'barras',
    difficulty: 'Elite',
    tier: 4,
    icon: '🏆',
    exerciseId: 'barra-unilateral-assistida',
    description: 'O ápice da força de puxar na calistenia. Erguer todo o peso corporal exclusivamente com um braço a partir do repouso pendurado.',
    prerequisites: [
      { skillId: 'sk_archer_pullup', name: 'Barra Arqueiro', benchmarkText: '6 repetições por lado sem compensação' },
      { name: 'Barra Fixa com Lastro', benchmarkText: '+50% do peso corporal para 1 repetição máxima' },
    ],
    progressionSteps: [
      { id: 'oapu_1', stepNumber: 1, title: 'Barra com Apoio de 1 Dedo na Mão Oposta', targetMetric: '3x 4 reps/lado', exerciseId: 'barra-unilateral-assistida', description: 'Reduza a assistência para apenas um indicador.' },
      { id: 'oapu_2', stepNumber: 2, title: 'Negativa Unilateral 6s', targetMetric: '3x 2 reps/lado', description: 'Suba com dois braços e desça lentamente com um.' },
      { id: 'oapu_3', stepNumber: 3, title: 'Barra Unilateral com Elástico de Dedo', targetMetric: '3x 2 reps/lado', description: 'Assistência mínima de elástico fino.' },
      { id: 'oapu_4', stepNumber: 4, title: 'Barra Unilateral Completa', targetMetric: '1x 1 rep/lado', exerciseId: 'barra-unilateral-assistida', description: 'Tração pura com o queixo acima dos nós dos dedos.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'barra-arqueiro', title: 'Barra Arqueiro com Pausa de 2s', purpose: 'Sobrecarga de trava no topo', recommendedVolume: '3x 4 reps' },
      { exerciseId: 'dead-hang', title: 'Dead Hang Unilateral', purpose: 'Força de preensão e tendões do cotovelo', recommendedVolume: '3x 20s/braço' },
    ],
    evolutionCriteria: 'Executar 1 repetição estrita completa a partir de dead hang sem tocar na barra com o braço livre.',
    commonMistakes: [
      { mistake: 'Iniciar com giro violento do tronco para criar inércia', correction: 'Estabilize as pernas esticadas e use tração do dorsal antes de fletir o cotovelo.' },
    ],
  },

  // ========================================================
  // 3. PARALELAS & MERGULHOS (PARALELAS)
  // ========================================================
  {
    id: 'sk_dips',
    name: 'Mergulho em Paralelas (Dips)',
    category: 'paralelas',
    difficulty: 'Intermediário',
    tier: 1,
    icon: '💪',
    exerciseId: 'dip',
    description: 'Movimento fundamental de empurrar vertical para baixo, solicitando peitoral inferior, deltoide anterior e tríceps com o peso total do corpo.',
    prerequisites: [
      { name: 'Mergulho no Banco', benchmarkText: '15 repetições controladas com pernas elevadas' },
      { skillId: 'sk_diamond_pushup', name: 'Flexão Diamante', benchmarkText: '10 repetições' },
    ],
    progressionSteps: [
      { id: 'dip_1', stepNumber: 1, title: 'Suporte Isométrico nas Paralelas', targetMetric: '3x 30s', description: 'Braços esticados e ombros deprimidos para longe das orelhas.' },
      { id: 'dip_2', stepNumber: 2, title: 'Mergulho Excêntrico nas Paralelas (4s)', targetMetric: '3x 5 reps', exerciseId: 'dip-paralela-negativa', description: 'Salte para o topo e desça com controle a 90°.' },
      { id: 'dip_3', stepNumber: 3, title: 'Mergulho com Elástico', targetMetric: '3x 8 reps', description: 'Elástico sob os joelhos para atingir 90° com segurança.' },
      { id: 'dip_4', stepNumber: 4, title: 'Mergulho nas Paralelas Completo', targetMetric: '3x 8 reps', exerciseId: 'dip', description: 'Flexão até 90° e extensão total sem travar com impacto.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'pushup', title: 'Flexão Tradicional', purpose: 'Manutenção de volume de empurrar', recommendedVolume: '3x 12 reps' },
    ],
    evolutionCriteria: 'Completar 3 séries de 10 repetições com descida controlada até 90° nos cotovelos e subida explosiva.',
    commonMistakes: [
      { mistake: 'Descer além do limite de mobilidade gerando pinçamento no ombro', correction: 'Mantenha a descida até o cotovelo atingir 90° mantendo o peito projetado.' },
    ],
  },
  {
    id: 'sk_straight_bar_dip',
    name: 'Mergulho na Barra Reta (Straight Bar Dip)',
    category: 'paralelas',
    difficulty: 'Intermediário',
    tier: 2,
    icon: '⚡',
    exerciseId: 'dip-com-pausa',
    description: 'Mergulho com o tronco inclinado sobre uma barra reta transversal, componente mandatório da fase de transição do Muscle-up.',
    prerequisites: [
      { skillId: 'sk_dips', name: 'Mergulho em Paralelas', benchmarkText: '12 repetições estritas' },
      { name: 'Hollow Body Hold', benchmarkText: '45 segundos' },
    ],
    progressionSteps: [
      { id: 'sbd_1', stepNumber: 1, title: 'Suporte na Barra Reta', targetMetric: '3x 25s', description: 'Apoio sobre a barra com inclinação frontal e abdômen tenso.' },
      { id: 'sbd_2', stepNumber: 2, title: 'Mergulho na Barra Reta Negativo', targetMetric: '3x 5 reps', description: 'Desça encostando a linha da cintura na barra.' },
      { id: 'sbd_3', stepNumber: 3, title: 'Mergulho na Barra Reta Completo', targetMetric: '3x 6 reps', exerciseId: 'dip-com-pausa', description: 'Movimento completo desviando a cabeça à frente da barra.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'extensao-triceps-barra-baixa', title: 'Extensão de Tríceps', purpose: 'Força de empurrar final', recommendedVolume: '3x 10 reps' },
    ],
    evolutionCriteria: '3 séries de 8 repetições encostando o abdômen na barra e empurrando até os cotovelos travarem.',
    commonMistakes: [
      { mistake: 'Bater o peito na barra sem inclinar o tronco à frente', correction: 'Incline os ombros e a cabeça para a frente equilibrando o centro de gravidade.' },
    ],
  },
  {
    id: 'sk_ring_dips',
    name: 'Mergulho em Argolas (Ring Dips)',
    category: 'paralelas',
    difficulty: 'Avançado',
    tier: 3,
    icon: '⭕',
    exerciseId: 'dip-argolas',
    description: 'Mergulho com pontos de fixação instáveis. Exige estabilização massiva de manguito rotador e peitoral para impedir que as argolas se afastem.',
    prerequisites: [
      { skillId: 'sk_dips', name: 'Mergulho em Paralelas', benchmarkText: '15 repetições' },
      { name: 'Ring Support Hold', benchmarkText: '30s de suporte com argolas viradas para fora (RTO)' },
    ],
    progressionSteps: [
      { id: 'rd_1', stepNumber: 1, title: 'Ring Support Hold Neutro', targetMetric: '3x 30s', description: 'Sustentação sobre as argolas sem tremer.' },
      { id: 'rd_2', stepNumber: 2, title: 'Ring Support Hold com Turn-out (RTO)', targetMetric: '3x 20s', description: 'Gire as palmas das mãos para a frente no topo.' },
      { id: 'rd_3', stepNumber: 3, title: 'Ring Dips Excêntrico', targetMetric: '3x 4 reps', description: 'Descida controlada mantendo as argolas coladas ao tronco.' },
      { id: 'rd_4', stepNumber: 4, title: 'Ring Dips Completo', targetMetric: '3x 6 reps', exerciseId: 'dip-argolas', description: 'Amplitude profunda com rotação externa no topo.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'dip-com-carga', title: 'Dips em Paralelas com Peso', purpose: 'Sobrecarga de força pura', recommendedVolume: '3x 6 reps (+10kg)' },
    ],
    evolutionCriteria: '3 séries de 6 repetições nas argolas finalizando cada repetição com rotação externa (palmas viradas para fora).',
    commonMistakes: [
      { mistake: 'Deixar as argolas se abrirem excessivamente na descida', correction: 'Mantenha os antebraços e as correias roçando as laterais do tronco.' },
    ],
  },

  // ========================================================
  // 4. CORE & COMPRESSÃO (CORE)
  // ========================================================
  {
    id: 'sk_lsit',
    name: 'L-Sit no Solo / Paralelas',
    category: 'core',
    difficulty: 'Intermediário',
    tier: 1,
    icon: '📐',
    exerciseId: 'lsit',
    description: 'Sustentação isométrica do corpo com braços esticados e pernas estendidas a 90° formando a letra L no ar.',
    prerequisites: [
      { name: 'Hollow Body Hold', benchmarkText: '45 segundos com lombar colada ao solo' },
      { name: 'Elevação de Joelhos na Barra', benchmarkText: '12 repetições estritas' },
      { name: 'Alongamento de Isquiotibiais', benchmarkText: 'Alcançar as pontas dos pés sentado' },
    ],
    progressionSteps: [
      { id: 'ls_1', stepNumber: 1, title: 'Tuck L-Sit no Solo ou Paralelas', targetMetric: '4x 15s', exerciseId: 'lsit-solo-tuck', description: 'Joelhos dobrados no peito e escápulas deprimidas.' },
      { id: 'ls_2', stepNumber: 2, title: 'L-Sit com Uma Perna Estendida', targetMetric: '4x 12s/lado', exerciseId: 'lsit-solo-uma-perna', description: 'Alterne uma perna estendida reta à frente.' },
      { id: 'ls_3', stepNumber: 3, title: 'L-Sit Completo nas Paralelas Baixas', targetMetric: '4x 15s', exerciseId: 'lsit', description: 'Pernas retas paralelas ao solo.' },
      { id: 'ls_4', stepNumber: 4, title: 'L-Sit no Solo Puro', targetMetric: '3x 15s', exerciseId: 'lsit', description: 'Maior desafio de depressão escapular pela ausência de altura.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'elevacao-pernas-barra', title: 'Elevação de Pernas na Barra (Hanging Leg Raise)', purpose: 'Compressão ativa do reto abdominal', recommendedVolume: '3x 8 reps' },
      { exerciseId: 'pike-compression', title: 'Pike Compression no Chão', purpose: 'Força de psoas e quadríceps terminal', recommendedVolume: '3x 10 reps' },
    ],
    evolutionCriteria: 'Sustentar 3 séries de 15 segundos de L-Sit no solo com pernas 100% esticadas e pontas dos pés apontadas.',
    commonMistakes: [
      { mistake: 'Deixar os ombros subirem em direção às orelhas', correction: 'Empurre o solo com força máxima deprimindo as escápulas o tempo todo.' },
      { mistake: 'Dobrar os joelhos por falta de flexibilidade posterior', correction: 'Alongue cadeia posterior diariamente para manter joelhos travados.' },
    ],
  },
  {
    id: 'sk_vsit',
    name: 'V-Sit Avançado',
    category: 'core',
    difficulty: 'Elite',
    tier: 3,
    icon: '✌️',
    exerciseId: 'vsit',
    description: 'Evolução dramática do L-Sit. Os pés são elevados a 45° ou 60° acima da linha dos quadris, exigindo compressão abdominal extrema e flexibilidade.',
    prerequisites: [
      { skillId: 'sk_lsit', name: 'L-Sit no Solo', benchmarkText: '25 segundos sustentados com facilidade' },
      { name: 'Toes to Bar Estrito', benchmarkText: '10 repetições com pernas retas' },
    ],
    progressionSteps: [
      { id: 'vs_1', stepNumber: 1, title: 'L-Sit Alto com Elevação Dinâmica', targetMetric: '3x 6 pulses', description: 'Pulse as pernas para cima a partir do L-Sit.' },
      { id: 'vs_2', stepNumber: 2, title: 'Straddle V-Sit', targetMetric: '3x 10s', description: 'Pernas abertas facilitando a alavanca da compressão.' },
      { id: 'vs_3', stepNumber: 3, title: 'V-Sit Completo (45°)', targetMetric: '3x 10s', exerciseId: 'vsit', description: 'Tronco inclinado para trás e pernas apontando para cima.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'dragon-flag', title: 'Dragon Flag', purpose: 'Força do core em alavanca extendida', recommendedVolume: '3x 6 reps' },
    ],
    evolutionCriteria: 'Sustentar 10 segundos de V-Sit com pés na altura dos olhos e pernas perfeitamente unidas.',
    commonMistakes: [
      { mistake: 'Fletir os cotovelos para compensar a depressão escapular', correction: 'Mantenha os braços travados retos empurrando o chão para baixo.' },
    ],
  },
  {
    id: 'sk_dragon_flag',
    name: 'Dragon Flag (Alavanca de Bruce Lee)',
    category: 'core',
    difficulty: 'Avançado',
    tier: 2,
    icon: '🐉',
    exerciseId: 'dragon-flag',
    description: 'Movimento lendário onde apenas a parte superior dos ombros apoia o banco, enquanto o restante do corpo ergue-se em uma prancha rígida.',
    prerequisites: [
      { name: 'Hollow Body Hold', benchmarkText: '60 segundos perfeitos' },
      { skillId: 'sk_lsit', name: 'L-Sit', benchmarkText: '15 segundos' },
    ],
    progressionSteps: [
      { id: 'df_1', stepNumber: 1, title: 'Dragon Flag Negativo com Joelhos Dobrados', targetMetric: '3x 6 reps', description: 'Desça em 4s com joelhos encolhidos.' },
      { id: 'df_2', stepNumber: 2, title: 'Dragon Flag de 1 Perna', targetMetric: '3x 5 reps/lado', description: 'Uma perna estendida reta e outra dobrada.' },
      { id: 'df_3', stepNumber: 3, title: 'Dragon Flag Completo Negativo (6s)', targetMetric: '4x 4 reps', exerciseId: 'dragon-flag', description: 'Desça com corpo inteiro rígido até tocar o banco.' },
      { id: 'df_4', stepNumber: 4, title: 'Dragon Flag Completo Dinâmico', targetMetric: '3x 5 reps', exerciseId: 'dragon-flag', description: 'Subida e descida fluidas sem curvar o quadril.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'toes-to-bar', title: 'Toes to Bar Estrito', purpose: 'Resistência de cadeia anterior', recommendedVolume: '3x 8 reps' },
    ],
    evolutionCriteria: 'Realizar 5 repetições completas (subindo e descendo) sem quebrar o alinhamento reto entre ombros e calcanhares.',
    commonMistakes: [
      { mistake: 'Dobrar o quadril ao subir (quebrar a linha do corpo)', correction: 'A contração deve vir dos glúteos e do abdômen mantendo uma viga de aço reta.' },
    ],
  },

  // ========================================================
  // 5. EQUILÍBRIO & PARADA DE MÃO (EQUILIBRIO)
  // ========================================================
  {
    id: 'sk_crow_pose',
    name: 'Pose do Corvo (Crow Pose / Bakasana)',
    category: 'equilibrio',
    difficulty: 'Iniciante',
    tier: 1,
    icon: '🦅',
    exerciseId: 'crow-pose',
    description: 'Fundamento de entrada para o equilíbrio sobre as mãos. Joelhos apoiados na parte posterior dos braços com pés flutuando no ar.',
    prerequisites: [
      { name: 'Flexão Tradicional', benchmarkText: '10 repetições' },
      { name: 'Mobilidade de Punhos', benchmarkText: 'Sem dor ao apoiar palmas com inclinação frontal' },
    ],
    progressionSteps: [
      { id: 'cp_1', stepNumber: 1, title: 'Corvo com Pés no Bloco/Almofada', targetMetric: '3x 20s', description: 'Apenas retire a ponta de um pé de cada vez.' },
      { id: 'cp_2', stepNumber: 2, title: 'Pose do Corvo Sustentada', targetMetric: '3x 30s', exerciseId: 'crow-pose', description: 'Equilíbrio total usando a polpa dos dedos como freio.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'flexao-extensao-punho-chao', title: 'Fortalecimento de Punhos', purpose: 'Condicionamento dos tendões flexores', recommendedVolume: '3x 15 reps' },
    ],
    evolutionCriteria: 'Sustentar 40 segundos com respiração tranquila e cotovelos alinhados.',
    commonMistakes: [
      { mistake: 'Olhar para trás em direção aos pés', correction: 'Fixe o olhar 20cm à frente das mãos para equilibrar a cabeça.' },
    ],
  },
  {
    id: 'sk_handstand',
    name: 'Parada de Mão Livre (Handstand)',
    category: 'equilibrio',
    difficulty: 'Avançado',
    tier: 2,
    icon: '🤸',
    exerciseId: 'handstand-livre',
    description: 'O pilar visual da calistenia. Sustentação e equilíbrio livre invertido sobre as mãos em perfeita linha reta corporal.',
    prerequisites: [
      { skillId: 'sk_crow_pose', name: 'Pose do Corvo', benchmarkText: '30 segundos estáveis' },
      { name: 'Pike Push-up', benchmarkText: '10 repetições estritas' },
      { name: 'Parada de Mão na Parede (Barriga para a Parede)', benchmarkText: '60 segundos ininterruptos' },
    ],
    progressionSteps: [
      { id: 'hs_1', stepNumber: 1, title: 'Parada de Mão na Parede (Chest-to-Wall)', targetMetric: '4x 45s', exerciseId: 'handstand', description: 'Barriga voltada para a parede construindo alinhamento reto.' },
      { id: 'hs_2', stepNumber: 2, title: 'Descolamento Alternado dos Pés (Toe Taps)', targetMetric: '3x 20s', description: 'Flutue os pés longe da parede usando os dedos como freio.' },
      { id: 'hs_3', stepNumber: 3, title: 'Treino de Queda Segura (Pirouette / Roll)', targetMetric: '5 quedas dominadas', description: 'Aprenda a descer girando sem medo de cair de costas.' },
      { id: 'hs_4', stepNumber: 4, title: 'Handstand Livre no Meio da Sala', targetMetric: '5x 10s', exerciseId: 'handstand-livre', description: 'Entrada com chute controlado e equilíbrio ativo.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'pikepushup', title: 'Pike Push-up Elevado', purpose: 'Força vertical de deltoide e trapézio superior', recommendedVolume: '3x 8 reps' },
      { exerciseId: 'alongamento-dorsal-barra', title: 'Abertura de Ombros na Barra', purpose: 'Mobilidade de flexão glenoumeral para 180°', recommendedVolume: '3x 30s' },
    ],
    evolutionCriteria: 'Realizar 5 entradas consecutivas sustentando no mínimo 15 segundos cada sem sair do lugar e com linha reta.',
    commonMistakes: [
      { mistake: 'Arquear a lombar (parada de mão de banana)', correction: 'Ative a retroversão da pelve e empurre ativamente o solo para cima.' },
      { mistake: 'Dedos relaxados no chão', correction: 'Agarre o chão como garras (cambered fingers) para frear a queda.' },
    ],
  },
  {
    id: 'sk_hspu',
    name: 'Flexão na Parada de Mão (Handstand Push-up)',
    category: 'equilibrio',
    difficulty: 'Elite',
    tier: 3,
    icon: '⚡',
    exerciseId: 'pikepushup',
    description: 'Empurrar verticalmente 100% do próprio peso de cabeça para baixo, da cabeça tocando o solo até a extensão completa dos braços.',
    prerequisites: [
      { skillId: 'sk_handstand', name: 'Handstand Livre', benchmarkText: '15 segundos sustentados' },
      { name: 'Pike Push-up com Pés Elevados', benchmarkText: '12 repetições profundas' },
      { skillId: 'sk_dips', name: 'Mergulho em Paralelas', benchmarkText: '15 repetições' },
    ],
    progressionSteps: [
      { id: 'hspu_1', stepNumber: 1, title: 'HSPU Excêntrico na Parede (5s)', targetMetric: '3x 4 reps', description: 'Desça controladamente com cabeça à frente das mãos (tripé).' },
      { id: 'hspu_2', stepNumber: 2, title: 'HSPU na Parede com Déficit ou Bloco', targetMetric: '3x 5 reps', description: 'Toque a cabeça no bloco e empurre para cima.' },
      { id: 'hspu_3', stepNumber: 3, title: 'HSPU Completo na Parede', targetMetric: '4x 5 reps', description: 'Amplitude total tocando a cabeça no solo.' },
      { id: 'hspu_4', stepNumber: 4, title: 'Freestanding HSPU (Sem Parede)', targetMetric: '1x 2 reps', exerciseId: 'pikepushup', description: 'Equilíbrio e força simultâneos no centro da sala.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'pike-pushup-elevado', title: 'Pike Push-up com Pés na Caixa', purpose: 'Sobrecarga progressiva dos deltoides', recommendedVolume: '3x 8 reps' },
    ],
    evolutionCriteria: 'Realizar 5 repetições na parede com amplitude total e cotovelos recolhidos a 45° ou 1 repetição livre.',
    commonMistakes: [
      { mistake: 'Abrir cotovelos para os lados na linha dos ombros', correction: 'Mova a cabeça à frente das mãos criando um triângulo e aponte cotovelos a 45°.' },
    ],
  },

  // ========================================================
  // 6. FORÇA INTEGRADA & TRANSIÇÃO (FORCA)
  // ========================================================
  {
    id: 'sk_muscleup',
    name: 'Muscle-up na Barra Fixa',
    category: 'forca',
    difficulty: 'Avançado',
    tier: 2,
    icon: '🚀',
    exerciseId: 'muscleup',
    description: 'A assinatura máxima da calistenia. Transição explosiva da puxada vertical por baixo da barra para o mergulho por cima.',
    prerequisites: [
      { skillId: 'sk_pullup_strict', name: 'Barra Fixa Estrita', benchmarkText: '10 repetições estritas consecutivas' },
      { skillId: 'sk_straight_bar_dip', name: 'Mergulho na Barra Reta', benchmarkText: '8 repetições profundas' },
      { name: 'Barra Fixa Explosiva ao Peito', benchmarkText: '5 repetições tocando a linha dos mamilos' },
    ],
    progressionSteps: [
      { id: 'mu_1', stepNumber: 1, title: 'Puxada Explosiva ao Abdômen', targetMetric: '4x 3 reps', exerciseId: 'barra-fixa-explosiva', description: 'Puxe com máxima aceleração puxando os cotovelos para trás.' },
      { id: 'mu_2', stepNumber: 2, title: 'Muscle-up com Elástico de Apoio', targetMetric: '3x 4 reps', exerciseId: 'muscle-up-transicao', description: 'Aprenda o giro rápido e sincronizado dos dois cotovelos.' },
      { id: 'mu_3', stepNumber: 3, title: 'Muscle-up com Pequeno Balanço Técnico', targetMetric: '3x 2 reps', exerciseId: 'muscleup', description: 'Pequeno arco de hollow para arch antes da puxada em C.' },
      { id: 'mu_4', stepNumber: 4, title: 'Muscle-up Estrito Completo', targetMetric: '3x 3 reps', exerciseId: 'muscleup', description: 'Subida simultânea sem cotovelo atrasado (galinha).' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'barra-fixa-explosiva', title: 'Barra Explosiva com Soltura Leve', purpose: 'Velocidade de disparo da potência concêntrica', recommendedVolume: '4x 3 reps' },
      { exerciseId: 'dip-com-pausa', title: 'Mergulho na Barra Reta', purpose: 'Força de trava na transição', recommendedVolume: '3x 6 reps' },
    ],
    evolutionCriteria: 'Realizar 3 repetições limpas e consecutivas onde ambos os cotovelos giram ao mesmo tempo por cima da barra.',
    commonMistakes: [
      { mistake: 'Subir um cotovelo de cada vez (chicken wing)', correction: 'Isso sobrecarrega perigosamente o manguito. Fortaleça a puxada explosiva até subir ambos juntos.' },
      { mistake: 'Puxar em linha reta vertical colado na barra', correction: 'Puxe em curva (trajetória em C) para criar espaço para a cabeça passar.' },
    ],
  },
  {
    id: 'sk_pistol_squat',
    name: 'Pistol Squat (Agachamento Unilateral)',
    category: 'forca',
    difficulty: 'Intermediário',
    tier: 1,
    icon: '🦵',
    exerciseId: 'pistolsquat',
    description: 'Agachamento profundo sobre uma única perna enquanto a outra estende-se reta à frente sem encostar no solo.',
    prerequisites: [
      { name: 'Agachamento Profundo com Peso Corporal', benchmarkText: '25 repetições perfeitas com calcanhares no chão' },
      { name: 'Mobilidade de Tornozelo (Dorsiflexão)', benchmarkText: 'Joelho avança 10cm à frente do dedão' },
    ],
    progressionSteps: [
      { id: 'ps_1', stepNumber: 1, title: 'Pistol Squat na Caixa/Banco', targetMetric: '3x 8 reps/perna', exerciseId: 'pistol-squat-caixa', description: 'Sente e levante com uma perna em banco alto.' },
      { id: 'ps_2', stepNumber: 2, title: 'Pistol Squat com Apoio de Mão', targetMetric: '3x 6 reps/perna', exerciseId: 'pistol-squat-assistido', description: 'Segure levemente em poste ou elástico.' },
      { id: 'ps_3', stepNumber: 3, title: 'Pistol Squat Livre no Solo', targetMetric: '3x 5 reps/perna', exerciseId: 'pistolsquat', description: 'Amplitude máxima com calcanhar colado no chão.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'afundo', title: 'Afundo com Passada Larga', purpose: 'Estabilidade unilateral de quadríceps e glúteo', recommendedVolume: '3x 10 reps/lado' },
    ],
    evolutionCriteria: 'Realizar 5 repetições fluidas com cada perna até a dobra do quadril passar a linha do joelho sem descolar o calcanhar.',
    commonMistakes: [
      { mistake: 'Calcanhar descola do solo durante a descida', correction: 'Trabalhe a dorsiflexão de tornozelo ou use um pequeno calço temporário.' },
    ],
  },

  // ========================================================
  // 7. MOVIMENTOS ESTÁTICOS & ALAVANCAS (ESTATICOS)
  // ========================================================
  {
    id: 'sk_front_lever',
    name: 'Front Lever Completo',
    category: 'estaticos',
    difficulty: 'Elite',
    tier: 4,
    icon: '🏛️',
    exerciseId: 'frontlever',
    description: 'Sustentação horizontal completa do corpo sob a barra em perfeita linha reta através da força de retração e depressão escapular.',
    prerequisites: [
      { skillId: 'sk_pullup_strict', name: 'Barra Fixa Estrita', benchmarkText: '15 repetições estritas' },
      { skillId: 'sk_dragon_flag', name: 'Dragon Flag', benchmarkText: '5 repetições controladas' },
      { name: 'Tuck Front Lever', benchmarkText: '20 segundos com costas planas' },
    ],
    progressionSteps: [
      { id: 'fl_1', stepNumber: 1, title: 'Tuck Front Lever', targetMetric: '4x 15s', exerciseId: 'tuck-front-lever', description: 'Joelhos colados no peito com braços travados esticados.' },
      { id: 'fl_2', stepNumber: 2, title: 'Advanced Tuck Front Lever', targetMetric: '4x 12s', exerciseId: 'adv-tuck-front-lever', description: 'Abra o ângulo do quadril a 90° mantendo o dorso reto.' },
      { id: 'fl_3', stepNumber: 3, title: 'Straddle Front Lever', targetMetric: '4x 8s', exerciseId: 'straddle-front-lever', description: 'Pernas afastadas reduzindo a alavanca do quadril.' },
      { id: 'fl_4', stepNumber: 4, title: 'Full Front Lever', targetMetric: '3x 5s', exerciseId: 'frontlever', description: 'Pernas unidas e corpo perfeitamente horizontal.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'front-lever-row', title: 'Remada em Tuck Front Lever', purpose: 'Força dinâmica nos latíssimos em ângulo horizontal', recommendedVolume: '3x 6 reps' },
      { exerciseId: 'retracao-escapular-barra', title: 'Retração Escapular Suspensa', purpose: 'Depressão isométrica sustentada', recommendedVolume: '3x 12 reps' },
    ],
    evolutionCriteria: 'Sustentar 5 segundos de Front Lever perfeitamente horizontal sem dobrar os cotovelos nem arquear o peito.',
    commonMistakes: [
      { mistake: 'Flexionar os cotovelos para facilitar o movimento', correction: 'Tranque os braços 100% esticados; se dobrar, retorne à progressão anterior.' },
      { mistake: 'Quadril caído abaixo da linha dos ombros', correction: 'Ative glúteos e aperte o abdômen para alinhar pés, quadril e ombros.' },
    ],
  },
  {
    id: 'sk_back_lever',
    name: 'Back Lever Completo',
    category: 'estaticos',
    difficulty: 'Avançado',
    tier: 3,
    icon: '⚡',
    exerciseId: 'back-lever',
    description: 'Sustentação horizontal dorsal sob a barra com o peito voltado para o solo. Exige excepcional condicionamento do bíceps e deltoide anterior.',
    prerequisites: [
      { name: 'Skin the Cat na Barra ou Argolas', benchmarkText: '5 repetições fluidas com rotação completa' },
      { name: 'Dead Hang Passivo', benchmarkText: '45 segundos' },
    ],
    progressionSteps: [
      { id: 'bl_1', stepNumber: 1, title: 'Skin the Cat Controlado', targetMetric: '3x 5 reps', description: 'Passagem do quadril por entre os braços.' },
      { id: 'bl_2', stepNumber: 2, title: 'Tuck Back Lever', targetMetric: '4x 15s', exerciseId: 'tuck-back-lever', description: 'Corpo horizontal com joelhos encolhidos.' },
      { id: 'bl_3', stepNumber: 3, title: 'Adv Tuck / 1 Perna Back Lever', targetMetric: '4x 10s', exerciseId: 'adv-tuck-back-lever', description: 'Abertura progressiva da alavanca.' },
      { id: 'bl_4', stepNumber: 4, title: 'Full Back Lever', targetMetric: '3x 6s', exerciseId: 'back-lever', description: 'Horizontal completa com peito para baixo e glúteos travados.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'australianpullup', title: 'Remada Australiana', purpose: 'Estabilização de trapézio e romboides', recommendedVolume: '3x 10 reps' },
    ],
    evolutionCriteria: 'Sustentar 6 segundos de Back Lever horizontal com pernas unidas e pontas dos pés esticadas.',
    commonMistakes: [
      { mistake: 'Saltar etapas sem condicionamento do tendão do bíceps', correction: 'Avance gradualmente em semanas para que o tecido conjuntivo se adapte à hiperextensão.' },
    ],
  },
  {
    id: 'sk_planche',
    name: 'Full Planche (Prancha Suspensa)',
    category: 'estaticos',
    difficulty: 'Elite',
    tier: 4,
    icon: '👑',
    exerciseId: 'planche',
    description: 'O Santo Graal da calistenia de empurrar. O corpo fica totalmente horizontal suspenso no ar apoiado unicamente pelas mãos no solo ou paralelas.',
    prerequisites: [
      { skillId: 'sk_pseudo_planche', name: 'Flexão Pseudo-Planche', benchmarkText: '10 repetições profundas' },
      { skillId: 'sk_hspu', name: 'HSPU na Parede', benchmarkText: '8 repetições estritas' },
      { name: 'Planche Lean no Solo', benchmarkText: '30s com ombros bem à frente' },
    ],
    progressionSteps: [
      { id: 'pl_1', stepNumber: 1, title: 'Tuck Planche no Solo / Parallettes', targetMetric: '4x 15s', exerciseId: 'tuck-planche', description: 'Joelhos recolhidos no peito e pés elevados do solo.' },
      { id: 'pl_2', stepNumber: 2, title: 'Advanced Tuck Planche', targetMetric: '4x 10s', exerciseId: 'adv-tuck-planche', description: 'Coluna e quadril na mesma linha reta horizontal dos ombros.' },
      { id: 'pl_3', stepNumber: 3, title: 'Straddle Planche', targetMetric: '3x 5s', exerciseId: 'straddle-planche', description: 'Pernas bem abertas reduzindo o comprimento da alavanca.' },
      { id: 'pl_4', stepNumber: 4, title: 'Full Planche', targetMetric: '2x 3s', exerciseId: 'planche', description: 'Pernas unidas e corpo suspenso como uma prancha perfeita.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'flexao-pseudo-planche', title: 'Pseudo Planche Push-up com Pausa', purpose: 'Força nos flexores do ombro e peitoral', recommendedVolume: '3x 6 reps' },
      { exerciseId: 'flexao-escapular', title: 'Protração Máxima em Prancha', purpose: 'Serrátil anterior forte', recommendedVolume: '3x 15 reps' },
    ],
    evolutionCriteria: 'Sustentar 3 segundos de Full Planche (ou 8s de Straddle) com cotovelos 100% esticados e protração escapular ativa.',
    commonMistakes: [
      { mistake: 'Microflexão nos cotovelos (bicep cheat)', correction: 'Cotovelos DEVEM estar completamente travados em extensão para transferir a carga aos tendões.' },
    ],
  },
  {
    id: 'sk_human_flag',
    name: 'Bandeira Humana (Human Flag)',
    category: 'estaticos',
    difficulty: 'Elite',
    tier: 4,
    icon: '🚩',
    exerciseId: 'bandeira-humana',
    description: 'Segurando em uma barra vertical, o corpo é sustentado horizontalmente de lado como uma bandeira flutuando ao vento.',
    prerequisites: [
      { skillId: 'sk_pullup_strict', name: 'Barra Fixa', benchmarkText: '12 repetições' },
      { skillId: 'sk_dips', name: 'Dips nas Paralelas', benchmarkText: '15 repetições' },
      { name: 'Prancha Lateral', benchmarkText: '60 segundos por lado' },
    ],
    progressionSteps: [
      { id: 'hf_1', stepNumber: 1, title: 'Suporte em Poste (Pressão & Tração)', targetMetric: '3x 20s/lado', description: 'Braço de baixo empurra, braço de cima puxa.' },
      { id: 'hf_2', stepNumber: 2, title: 'Tuck Human Flag', targetMetric: '3x 8s/lado', description: 'Joelhos encolhidos ao tronco no plano horizontal.' },
      { id: 'hf_3', stepNumber: 3, title: 'Straddle Human Flag', targetMetric: '3x 5s/lado', description: 'Pernas abertas diminuindo o momento torçor.' },
      { id: 'hf_4', stepNumber: 4, title: 'Full Human Flag', targetMetric: '2x 3s/lado', exerciseId: 'bandeira-humana', description: 'Alinhamento lateral perfeito com pernas unidas.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'dragon-flag', title: 'Dragon Flag', purpose: 'Força de oblíquos e cadeia lateral', recommendedVolume: '3x 6 reps' },
    ],
    evolutionCriteria: 'Sustentar 4 segundos de Bandeira Humana perfeitamente horizontal em poste ou espaldar.',
    commonMistakes: [
      { mistake: 'Deixar o braço de baixo dobrar', correction: 'O braço inferior funciona como uma coluna rígida empurrando o poste.' },
    ],
  },

  // ========================================================
  // 8. MOVIMENTOS EXPLOSIVOS (EXPLOSIVOS)
  // ========================================================
  {
    id: 'sk_clap_pushup',
    name: 'Flexão com Palmas (Clap Push-up)',
    category: 'explosivos',
    difficulty: 'Intermediário',
    tier: 1,
    icon: '👏',
    exerciseId: 'flexao-com-palmas',
    description: 'Flexão pliométrica com aceleração concêntrica máxima, permitindo bater as palmas no ar antes de aterrissar suavemente.',
    prerequisites: [
      { skillId: 'sk_diamond_pushup', name: 'Flexão Diamante', benchmarkText: '10 repetições' },
      { name: 'Flexão Tradicional', benchmarkText: '20 repetições estritas' },
    ],
    progressionSteps: [
      { id: 'cp_step_1', stepNumber: 1, title: 'Flexão com Descolamento das Mãos', targetMetric: '3x 8 reps', description: 'Apenas levante as palmas 2cm do chão.' },
      { id: 'cp_step_2', stepNumber: 2, title: 'Flexão com 1 Palma no Ar', targetMetric: '3x 6 reps', exerciseId: 'flexao-com-palmas', description: 'Bata 1 palma rápida e aterrisse absorvendo com os cotovelos.' },
      { id: 'cp_step_3', stepNumber: 3, title: 'Flexão com Palma Tripla ou Atrás das Costas', targetMetric: '3x 4 reps', description: 'Poder de aceleração pliométrica avançada.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'pushup', title: 'Flexão Explosiva no Solo', purpose: 'Taxa de desenvolvimento de força (RFD)', recommendedVolume: '4x 5 reps' },
    ],
    evolutionCriteria: 'Realizar 8 repetições fluidas batendo as palmas e aterrissando sem barulho de impacto.',
    commonMistakes: [
      { mistake: 'Aterrissar com cotovelos travados rígidos', correction: 'Absorva o impacto flexionando os cotovelos imediatamente ao tocar o solo.' },
    ],
  },
  {
    id: 'sk_high_pullup',
    name: 'Barra Fixa Explosiva ao Peito/Cintura',
    category: 'explosivos',
    difficulty: 'Avançado',
    tier: 2,
    icon: '💥',
    exerciseId: 'barra-fixa-explosiva',
    description: 'Puxada com potência balística onde o corpo é acelerado até a barra tocar na linha do esterno inferior ou umbigo.',
    prerequisites: [
      { skillId: 'sk_pullup_strict', name: 'Barra Fixa Estrita', benchmarkText: '12 repetições estritas' },
    ],
    progressionSteps: [
      { id: 'hp_1', stepNumber: 1, title: 'Barra Fixa ao Queixo Rápida', targetMetric: '4x 5 reps', description: 'Foco em concêntrica em <0.5s.' },
      { id: 'hp_2', stepNumber: 2, title: 'Barra Fixa Tocando o Peitoral', targetMetric: '4x 4 reps', exerciseId: 'barra-fixa-explosiva', description: 'Toque o esterno na barra a cada repetição.' },
      { id: 'hp_3', stepNumber: 3, title: 'Barra Explosiva ao Umbigo', targetMetric: '4x 3 reps', exerciseId: 'barra-fixa-explosiva', description: 'Puxe os cotovelos para trás elevando o quadril.' },
    ],
    auxiliaryExercises: [
      { exerciseId: 'pullup', title: 'Barra com Lastro Explosiva', purpose: 'Potência concêntrica máxima', recommendedVolume: '3x 3 reps (+5kg)' },
    ],
    evolutionCriteria: 'Completar 5 repetições consecutivas com a barra tocando abaixo da linha dos mamilos sem kipping.',
    commonMistakes: [
      { mistake: 'Usar balanço exagerado das pernas', correction: 'Mantenha o corpo alinhado e gere a força na aceleração dos dorsais.' },
    ],
  },
];

