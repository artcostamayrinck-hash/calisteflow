import type { Exercise } from '../../types';
import { CREF_REVIEWER_SPECIALIST } from './reviewer';

export const PUSH_VERTICAL_EXERCISES: Exercise[] = [
  // ================= EMPURRAR VERTICAL =================
  {
    id: 'pike-pushup-joelhos',
    name: 'Pike Push-up com Joelhos Apoiados',
    category: 'Push',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['ombros', 'triceps'],
    secondaryMuscles: ['peito', 'abdomen'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Introdução ao empurrar vertical sobrecarregando os deltoides anteriores e médios com alavanca reduzida.',
    breathingTip: 'Inspire descendo a cabeça à frente das mãos; expire empurrando o chão.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não desça a cabeça entre as mãos, mas sim formando um triângulo à frente.'],
    padrao: 'empurrar-vertical',
    equipamento: ['banco'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-1',
    regressoes: ['flexao-inclinada'],
    progressoes: ['pikepushup'],
    variacoes: ['flexao-declinada'],
    adaptacoes: {
      punho: ['pikepushup'],
      ombro: ['flexao-inclinada'],
      'sem-equipamento': ['pike-pushup-joelhos']
    },
    criterioAvanco: '3x12 repetições com cabeça projetada à frente',
    sinonimos: ['knee pike pushup', 'flexão pike joelhos'],
    animationType: 'pikepushup',
    executionSteps: [
      { step: 1, title: 'Posição em L', description: 'Ajoelhe-se em um banco ou caixa e apoie as mãos no solo, elevando o quadril.' },
      { step: 2, title: 'Descida em Tripé', description: 'Desça a cabeça para a frente das mãos formando um triângulo equilátero.' },
      { step: 3, title: 'Retorno Vertical', description: 'Empurre o solo para trás e para cima alinhando braços e tronco.' }
    ],
    commonMistakes: [
      { mistake: 'Bater a cabeça entre as mãos', correction: 'Mire o topo da cabeça 15 cm à frente da linha dos dedos.' }
    ]
  },
  {
    id: 'pikepushup',
    name: 'Pike Push-up (Flexão Pike)',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['ombros', 'triceps'],
    secondaryMuscles: ['peito', 'abdomen'],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Movimento essencial para construir força vertical pura de ombros, ponte direta para handstand push-up.',
    breathingTip: 'Inspire descendo o topo da cabeça à frente das mãos; expire empurrando forte.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: [
      'Pare imediatamente caso sinta pinçamento no topo dos ombros.',
      'Não desça a cabeça entre as mãos; o ponto de contato é à frente, formando um tripé.'
    ],
    padrao: 'empurrar-vertical',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['pike-pushup-joelhos', 'flexao-declinada'],
    progressoes: ['pike-pushup-elevado', 'prancha-peito-parede'],
    variacoes: ['flexao-hindu'],
    adaptacoes: {
      punho: ['pikepushup'],
      ombro: ['flexao-declinada'],
      'sem-equipamento': ['pikepushup']
    },
    criterioAvanco: '3x10 repetições com tronco bem vertical',
    sinonimos: ['pikepushup', 'pike pushup', 'flexão em v'],
    animationType: 'pikepushup',
    executionSteps: [
      { step: 1, title: 'Formato V Invertido', description: 'Mãos no chão, pernas estendidas e quadril empinado o mais alto possível.' },
      { step: 2, title: 'Trajetória em Tripé', description: 'Projete os ombros à frente descendo a cabeça adiante da linha dos dedos.' },
      { step: 3, title: 'Elevação Escapular', description: 'Empurre com os ombros encaixando a cabeça entre os braços no topo.' }
    ],
    commonMistakes: [
      { mistake: 'Abrir cotovelos para os lados', correction: 'Feche os cotovelos apontando-os para trás a 45°.' }
    ]
  },
  {
    id: 'pike-pushup-elevado',
    name: 'Pike Push-up com Pés Elevados',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['ombros', 'triceps'],
    secondaryMuscles: ['peito', 'abdomen'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 75,
    description: 'Com os pés em banco de 40-50 cm, o tronco se aproxima da verticalidade de 90°, suportando mais de 75% da massa corporal.',
    breathingTip: 'Inspire na descida mantendo as pernas ativas; expire empurrando o chão.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Verifique a firmeza do banco e não curve a coluna lombar.'],
    padrao: 'empurrar-vertical',
    equipamento: ['banco'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['pikepushup'],
    progressoes: ['prancha-peito-parede', 'hspu-negativa-parede'],
    variacoes: ['pikepushup'],
    adaptacoes: {
      punho: ['pike-pushup-elevado'],
      ombro: ['pikepushup'],
      'sem-equipamento': ['pike-pushup-elevado']
    },
    criterioAvanco: '3x8 repetições com quadril alinhado aos ombros',
    sinonimos: ['elevated pike pushup', 'pike com pés no banco'],
    animationType: 'pikepushup',
    executionSteps: [
      { step: 1, title: 'Pés no Banco', description: 'Pés no banco e caminhe com as mãos para trás até o tronco ficar quase vertical.' },
      { step: 2, title: 'Descida Dianteira', description: 'Desça o topo da cabeça à frente das mãos controladamente.' },
      { step: 3, title: 'Empurrão Vertical', description: 'Empurre o solo empurrando a cabeça de volta para trás entre os braços.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar as mãos longe do banco em prancha', correction: 'Aproxime as mãos até empilhar quadril sobre os ombros.' }
    ]
  },
  {
    id: 'prancha-peito-parede',
    name: 'Prancha de Peito na Parede (Wall Walk Hold)',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: ['ombros', 'abdomen'],
    secondaryMuscles: ['triceps', 'gluteos'],
    defaultSets: 3,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 60,
    description: 'Sustentação isométrica vertical com o peito voltado para a parede, desenvolvendo alinhamento hollow e força escapular.',
    breathingTip: 'Respire ritmicamente de forma diafragmática sem soltar o abdômen.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Saia da parede com calma caminhando com as mãos antes da falha total.'],
    padrao: 'empurrar-vertical',
    equipamento: ['parede'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['pike-pushup-elevado'],
    progressoes: ['handstand', 'chute-parada-maos'],
    variacoes: ['handstand'],
    adaptacoes: {
      punho: ['prancha-peito-parede'],
      ombro: ['pike-pushup-elevado'],
      'sem-equipamento': ['prancha-peito-parede']
    },
    criterioAvanco: 'Sustentar 45 segundos em alinhamento perfeito',
    sinonimos: ['chest to wall handstand', 'wall walk hold'],
    animationType: 'handstand',
    executionSteps: [
      { step: 1, title: 'Subida na Parede', description: 'Deite de bruços com os pés na parede e caminhe com as mãos e pés para cima.' },
      { step: 2, title: 'Hollow Body', description: 'Encaixe o quadril, aponte os pés e empurre ativamente o chão com os ombros.' },
      { step: 3, title: 'Descida Segura', description: 'Caminhe com as mãos para a frente descendo suavemente até o solo.' }
    ],
    commonMistakes: [
      { mistake: 'Desabar a lombar formando uma "banana"', correction: 'Aperte os glúteos e puxe o umbigo para dentro em retroversão.' }
    ]
  },
  {
    id: 'handstand',
    name: 'Parada de Mãos na Parede (Handstand Hold)',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: ['ombros', 'abdomen'],
    secondaryMuscles: ['triceps', 'antebraco'],
    defaultSets: 4,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 60,
    description: 'Sustentação isométrica vertical completa contra a parede, forjando ombros fortes e densidade no core.',
    breathingTip: 'Mantenha respiração constante pelo nariz; nunca prenda o ar totalmente.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: [
      'Cuidado ao descer: afaste uma perna primeiro e amorteça com o pé.',
      'Não faça se tiver hipertensão descontrolada ou glaucoma.'
    ],
    padrao: 'empurrar-vertical',
    equipamento: ['parede'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['prancha-peito-parede', 'pike-pushup-elevado'],
    progressoes: ['hspu-negativa-parede', 'handstand-livre'],
    variacoes: ['prancha-peito-parede'],
    adaptacoes: {
      punho: ['handstand'],
      ombro: ['pike-pushup-elevado'],
      'sem-equipamento': ['handstand']
    },
    criterioAvanco: 'Sustentar 45 segundos com boa forma',
    sinonimos: ['handstand', 'parada de mãos', 'bananeira', 'handstand-parede-hold'],
    animationType: 'handstand',
    executionSteps: [
      { step: 1, title: 'Chute de Entrada', description: 'Mãos a 15-20 cm da parede, dê um impulso controlado com uma perna.' },
      { step: 2, title: 'Bloqueio e Protração', description: 'Empurre os ombros em direção às orelhas (elevação escapular ativa).' },
      { step: 3, title: 'Alinhamento', description: 'Mantenha pernas unidas e glúteos travados.' }
    ],
    commonMistakes: [
      { mistake: 'Ombros afundados (passivos)', correction: 'Empurre ativamente o chão para longe durante todo o tempo.' }
    ]
  },
  {
    id: 'hspu-negativa-parede',
    name: 'HSPU Negativa na Parede',
    category: 'Push',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['ombros', 'triceps'],
    secondaryMuscles: ['peito', 'abdomen'],
    defaultSets: 3,
    defaultReps: 5,
    defaultRestSeconds: 90,
    description: 'Descida excêntrica lenta (4-5 segundos) em parada de mãos, acumulando força neural para o handstand push-up completo.',
    breathingTip: 'Inspire enquanto desce controlando a gravidade; apoie os pés para reiniciar.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Coloque uma almofada ou colchonete sob a cabeça para proteção.'],
    padrao: 'empurrar-vertical',
    equipamento: ['parede'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '5-1-0',
    regressoes: ['handstand', 'pike-pushup-elevado'],
    progressoes: ['hspu-parcial-parede', 'hspu-completo-parede'],
    variacoes: ['hspu-parcial-parede'],
    adaptacoes: {
      punho: ['hspu-negativa-parede'],
      ombro: ['pike-pushup-elevado'],
      'sem-equipamento': ['hspu-negativa-parede']
    },
    criterioAvanco: '3x5 repetições com 5 segundos de descida pura',
    sinonimos: ['negative hspu', 'handstand push-up negativa'],
    animationType: 'handstand',
    executionSteps: [
      { step: 1, title: 'Posição no Topo', description: 'Suba em parada de mãos na parede com braços firmemente estendidos.' },
      { step: 2, title: 'Descida Lenta', description: 'Desça em 5 segundos projetando o topo da cabeça suavemente à frente das mãos.' },
      { step: 3, title: 'Toque Seguro', description: 'Toque de leve a cabeça na almofada, desça os pés e reinicie o ciclo.' }
    ],
    commonMistakes: [
      { mistake: 'Cair descontrolado no final da descida', correction: 'Segure a tensão muscular até o último milímetro.' }
    ]
  },
  {
    id: 'hspu-parcial-parede',
    name: 'HSPU Parcial com Bloqueio',
    category: 'Push',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['ombros', 'triceps'],
    secondaryMuscles: ['peito', 'costas'],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSeconds: 90,
    description: 'Empurrada vertical com amplitude reduzida (usando um bloco sob a cabeça), desenvolvendo força de empurrada concêntrica.',
    breathingTip: 'Inspire na descida; solte o ar empurrando o solo de volta ao topo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha os cotovelos a 45° sem deixá-los abrirem para os lados.'],
    padrao: 'empurrar-vertical',
    equipamento: ['parede'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['hspu-negativa-parede'],
    progressoes: ['hspu-completo-parede'],
    variacoes: ['hspu-negativa-parede'],
    adaptacoes: {
      ombro: ['pike-pushup-elevado'],
      punho: ['hspu-parcial-parede'],
      'sem-equipamento': ['hspu-parcial-parede']
    },
    criterioAvanco: '3x8 repetições com bloco baixo',
    sinonimos: ['partial hspu', 'flexão na bananeira parcial'],
    animationType: 'handstand',
    executionSteps: [
      { step: 1, title: 'Handstand na Parede', description: 'Suba em parada de mãos com uma almofada de 10 cm sob a cabeça.' },
      { step: 2, title: 'Toque Parcial', description: 'Desça até tocar a cabeça no apoio.' },
      { step: 3, title: 'Empurrada Concêntrica', description: 'Empurre com força total até bloquear os cotovelos.' }
    ],
    commonMistakes: [
      { mistake: 'Impulsionar com os pés na parede', correction: 'Mantenha os calcanhares apenas deslizando de leve na parede.' }
    ]
  },
  {
    id: 'hspu-completo-parede',
    name: 'Handstand Push-up Completo na Parede (HSPU)',
    category: 'Push',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['ombros', 'triceps'],
    secondaryMuscles: ['peito', 'abdomen', 'costas'],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSeconds: 120,
    description: 'O padrão ouro de força vertical: empurrar 100% da própria massa corporal da cabeça ao bloqueio completo dos braços.',
    breathingTip: 'Inspire na descida controlada; expire vigorosamente empurrando o chão.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não bata a cabeça no chão; use um colchonete fino.'],
    padrao: 'empurrar-vertical',
    equipamento: ['parede'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-1',
    regressoes: ['hspu-parcial-parede', 'hspu-negativa-parede'],
    progressoes: ['handstand-livre', 'hspu-livre'],
    variacoes: ['hspu-parcial-parede'],
    adaptacoes: {
      punho: ['hspu-parcial-parede'],
      ombro: ['pike-pushup-elevado'],
      'sem-equipamento': ['hspu-completo-parede']
    },
    criterioAvanco: '3x6 repetições limpas tocando o chão',
    sinonimos: ['wall hspu', 'flexão na bananeira completa'],
    animationType: 'handstand',
    executionSteps: [
      { step: 1, title: 'Posição Estável', description: 'Suba na parede, ative abdômen e escápulas.' },
      { step: 2, title: 'Descida em Tripé', description: 'Desça até o topo da cabeça encostar suavemente no solo à frente das mãos.' },
      { step: 3, title: 'Empurrão Forte', description: 'Empurre até extensão completa dos braços com cabeça entre os ombros.' }
    ],
    commonMistakes: [
      { mistake: 'Hiperestender a coluna em arco', correction: 'Trabalhe o core rígido em hollow body.' }
    ]
  },
  {
    id: 'handstand-livre',
    name: 'Parada de Mãos Livre (Handstand Balance)',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: ['ombros', 'antebraco', 'abdomen'],
    secondaryMuscles: ['triceps', 'costas'],
    defaultSets: 5,
    defaultHoldSeconds: 20,
    defaultRestSeconds: 90,
    description: 'Equilíbrio vertical sobre as mãos sem apoio de parede, dominando os micro-ajustes dos dedos e punhos.',
    breathingTip: 'Mantenha respiração constante e suave pelo nariz.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Aprenda primeiro a "piruetas" ou queda segura rodando lateralmente.'],
    padrao: 'skills',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['handstand', 'prancha-peito-parede'],
    progressoes: ['hspu-livre'],
    variacoes: ['crow-pose'],
    adaptacoes: {
      punho: ['handstand-livre'],
      'sem-equipamento': ['handstand-livre']
    },
    criterioAvanco: 'Sustentar 20 segundos em linha reta no centro do espaço',
    sinonimos: ['freestanding handstand', 'parada de mãos livre'],
    animationType: 'handstand',
    executionSteps: [
      { step: 1, title: 'Chute Controlado', description: 'Chute com uma perna mantendo o olhar entre os polegares.' },
      { step: 2, title: 'Agarrar o Chão', description: 'Use as pontas dos dedos e a base da palma para frear o avanço.' },
      { step: 3, title: 'Linha Reta', description: 'Empurre os ombros e aponte os pés para o teto.' }
    ],
    commonMistakes: [
      { mistake: 'Olhar para a parede ou fechar o peito', correction: 'Fixe o olhar entre os dedos e empurre os ombros.' }
    ]
  },
  {
    id: 'hspu-livre',
    name: 'HSPU Livre (Freestanding HSPU)',
    category: 'Skill',
    difficulty: 'Elite',
    type: 'reps',
    primaryMuscles: ['ombros', 'triceps', 'abdomen'],
    secondaryMuscles: ['peito', 'costas'],
    defaultSets: 4,
    defaultReps: 3,
    defaultRestSeconds: 150,
    description: 'A combinação máxima de equilíbrio ginástico e força pura de empurrar vertical sem qualquer suporte externo.',
    breathingTip: 'Prenda o ar com controle descendo; expire empurrando de volta ao equilíbrio.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Treine em grama ou tatame seguro com saída lateral dominada.'],
    padrao: 'skills',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['hspu-completo-parede', 'handstand-livre'],
    progressoes: [],
    variacoes: ['hspu-livre'],
    adaptacoes: {
      punho: ['hspu-livre'],
      'sem-equipamento': ['hspu-livre']
    },
    criterioAvanco: '3x3 repetições limpas sem tocar os pés',
    sinonimos: ['freestanding hspu', 'flexão na bananeira livre'],
    animationType: 'handstand',
    executionSteps: [
      { step: 1, title: 'Handstand Firme', description: 'Estabeleça uma parada de mãos sólida e imóvel.' },
      { step: 2, title: 'Descida Dianteira', description: 'Desça a cabeça à frente das mãos compensando suavemente com os quadris.' },
      { step: 3, title: 'Subida e Re-alinhamento', description: 'Empurre com força retomando a linha vertical perfeita.' }
    ],
    commonMistakes: [
      { mistake: 'Perder o equilíbrio ao trocar de direção', correction: 'Mantenha a pressão nos dedos ativa o tempo todo.' }
    ]
  },

  // ================= MERGULHOS / DIPS =================
  {
    id: 'dip-banco-chao',
    name: 'Mergulho no Banco com Pés no Chão',
    category: 'Push',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['triceps', 'peito'],
    secondaryMuscles: ['ombros'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Excelente introdução ao padrão de mergulho, onde as pernas suportam parte do peso e o tríceps é isolado.',
    breathingTip: 'Inspire descendo o quadril rente ao banco; expire empurrando.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha as costas rentes ao banco; não se afaste para frente para não sobrecarregar os ombros.'],
    padrao: 'mergulhos',
    equipamento: ['banco'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-1',
    regressoes: ['flexao-inclinada'],
    progressoes: ['dip-banco-elevado', 'dip-paralela-negativa'],
    variacoes: ['dip-banco-elevado'],
    adaptacoes: {
      ombro: ['flexao-fechada'],
      punho: ['flexao-fechada'],
      'sem-equipamento': ['dip-banco-chao']
    },
    criterioAvanco: '3x15 repetições com boa profundidade',
    sinonimos: ['bench dip', 'mergulho na cadeira'],
    animationType: 'dip',
    executionSteps: [
      { step: 1, title: 'Mãos no Banco', description: 'Apoie as mãos na borda do banco ao lado dos quadris, joelhos flexionados a 90° e pés no chão.' },
      { step: 2, title: 'Descida a 90°', description: 'Desça o quadril próximo ao banco até os cotovelos formarem 90°.' },
      { step: 3, title: 'Extensão', description: 'Empurre estendendo os braços e contraindo os tríceps.' }
    ],
    commonMistakes: [
      { mistake: 'Afastar o corpo para longe do banco', correction: 'Desça rente, como se as costas raspassem o banco.' }
    ]
  },
  {
    id: 'dip-banco-elevado',
    name: 'Mergulho no Banco com Pés Elevados',
    category: 'Push',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['triceps', 'peito'],
    secondaryMuscles: ['ombros'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Pés apoiados em outro banco na mesma altura, elevando a carga corporal sobre os tríceps e peitoral inferior.',
    breathingTip: 'Inspire na descida controlada; solte o ar empurrando o banco.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não desça além dos 90° de cotovelo para poupar a cápsula anterior do ombro.'],
    padrao: 'mergulhos',
    equipamento: ['banco'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['dip-banco-chao'],
    progressoes: ['dip-paralela-negativa', 'dip'],
    variacoes: ['dip-banco-chao'],
    adaptacoes: {
      ombro: ['dip-banco-chao'],
      punho: ['flexao-fechada'],
      'sem-equipamento': ['dip-banco-elevado']
    },
    criterioAvanco: '3x12 repetições com cadência perfeita',
    sinonimos: ['elevated bench dip', 'mergulho com pés elevados'],
    animationType: 'dip',
    executionSteps: [
      { step: 1, title: 'Dois Apoios', description: 'Mãos em um banco e calcanhares apoiados em outro à frente.' },
      { step: 2, title: 'Descida a 90°', description: 'Desça o tronco em linha vertical até os cotovelos dobrarem em 90°.' },
      { step: 3, title: 'Empurrão Limpo', description: 'Empurre de volta ao topo estendendo os cotovelos sem dar tranco.' }
    ],
    commonMistakes: [
      { mistake: 'Descer excessivamente e sentir dor na frente do ombro', correction: 'Interrompa a descida ao atingir 90° de flexão de cotovelo.' }
    ]
  },
  {
    id: 'dip-paralela-negativa',
    name: 'Mergulho em Paralelas (Fase Negativa)',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['triceps', 'peito'],
    secondaryMuscles: ['ombros'],
    defaultSets: 3,
    defaultReps: 5,
    defaultRestSeconds: 75,
    description: 'Suba com salto até o topo e controle a descida por 4-5 segundos, preparando os tendões e fibras para o dip completo.',
    breathingTip: 'Inspire durante a descida sustentada; apoie os pés e recupere o fôlego.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha os ombros deprimidos para baixo (longe das orelhas) durante toda a descida.'],
    padrao: 'mergulhos',
    equipamento: ['paralelas'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '4-1-0',
    regressoes: ['dip-banco-elevado'],
    progressoes: ['dip'],
    variacoes: ['dip-banco-elevado'],
    adaptacoes: {
      ombro: ['dip-banco-chao'],
      cotovelo: ['flexao-fechada'],
      'sem-equipamento': ['dip-banco-elevado']
    },
    criterioAvanco: '3x5 repetições com 5 segundos de descida controlada',
    sinonimos: ['negative dip', 'mergulho negativo'],
    animationType: 'dip',
    executionSteps: [
      { step: 1, title: 'Salto ao Topo', description: 'Pule até a posição de suporte nas paralelas com braços estendidos e ombros abaixados.' },
      { step: 2, title: 'Descida Lenta', description: 'Desça controlando por 4 a 5 segundos até os cotovelos atingirem 90°.' },
      { step: 3, title: 'Pouso', description: 'Toque os pés no solo, suba novamente com salto e repita.' }
    ],
    commonMistakes: [
      { mistake: 'Encolher os ombros junto ao pescoço', correction: 'Empurre as barras ativamente para baixo mantendo o pescoço longo.' }
    ]
  },
  {
    id: 'dip',
    name: 'Mergulho em Barras Paralelas (Dips)',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['triceps', 'peito'],
    secondaryMuscles: ['ombros', 'abdomen'],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSeconds: 90,
    description: 'Exercício rei da cadeia anterior de empurrar para tríceps e peitoral inferior, sustentando 100% do peso corporal no ar.',
    breathingTip: 'Inspire na descida controlada; solte o ar empurrando as barras para baixo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: [
      'Pare imediatamente caso sinta dor aguda no esterno ou nos ombros.',
      'Não desça além de 90° de flexão de cotovelos para proteger o manguito rotador.'
    ],
    padrao: 'mergulhos',
    equipamento: ['paralelas'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['dip-paralela-negativa', 'dip-banco-elevado'],
    progressoes: ['dip-argolas', 'dip-com-carga', 'dip-com-pausa'],
    variacoes: ['dip-inclinado'],
    adaptacoes: {
      ombro: ['diamondpushup', 'flexao-fechada'],
      punho: ['diamondpushup'],
      'sem-equipamento': ['flexao-fechada', 'diamondpushup']
    },
    criterioAvanco: '3x12 repetições completas com boa profundidade',
    sinonimos: ['dip', 'dips', 'mergulho', 'paralela'],
    animationType: 'dip',
    executionSteps: [
      { step: 1, title: 'Posição de Suporte Inicial', description: 'Suspenda-se nas barras com cotovelos estendidos, ombros empurrados para baixo e peito aberto.' },
      { step: 2, title: 'Descida Controlada', description: 'Incline o tronco levemente à frente e desça até os cotovelos dobrarem em ângulo de 90°.' },
      { step: 3, title: 'Subida e Bloqueio', description: 'Empurre com força total até estender os braços completamente sem arquear a coluna.' }
    ],
    commonMistakes: [
      { mistake: 'Projetar os ombros para frente e encolher o pescoço', correction: 'Mantenha escápulas deprimidas e peitoral aberto.' }
    ]
  },
  {
    id: 'dip-inclinado',
    name: 'Mergulho Inclinado com Foco em Peitoral',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['peito', 'triceps'],
    secondaryMuscles: ['ombros', 'abdomen'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 90,
    description: 'Tronco inclinado para frente a 30-45° com cotovelos levemente afastados, maximizando o estiramento das fibras inferiores do peitoral.',
    breathingTip: 'Inspire descendo com o tronco inclinado; expire empurrando.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Evite abrir os cotovelos em excesso para não sobrecarregar os tendões peitorais.'],
    padrao: 'mergulhos',
    equipamento: ['paralelas'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['dip'],
    progressoes: ['dip-argolas'],
    variacoes: ['dip'],
    adaptacoes: {
      ombro: ['dip'],
      punho: ['diamondpushup'],
      'sem-equipamento': ['flexao-declinada']
    },
    criterioAvanco: '3x10 repetições com tronco inclinado e peito ativo',
    sinonimos: ['chest dip', 'mergulho peitoral'],
    animationType: 'dip',
    executionSteps: [
      { step: 1, title: 'Inclinação', description: 'Nas paralelas, incline o tronco para a frente e dobre os joelhos cruzando os tornozelos.' },
      { step: 2, title: 'Descida Aberta', description: 'Desça até sentir o alongamento no peitoral com cotovelos a cerca de 60°.' },
      { step: 3, title: 'Aperto Peitoral', description: 'Empurre imaginando fechar as barras para dentro até o bloqueio.' }
    ],
    commonMistakes: [
      { mistake: 'Ficar reto verticalmente', correction: 'Mantenha o peito inclinado mirando para o solo à frente.' }
    ]
  },
  {
    id: 'dip-argolas',
    name: 'Mergulho nas Argolas Olímpicas (Ring Dips)',
    category: 'Push',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['peito', 'triceps', 'ombros'],
    secondaryMuscles: ['abdomen', 'antebraco'],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSeconds: 120,
    description: 'A instabilidade multidirecional das argolas recruta estabilizadores profundos, exigindo bloqueio RTO no topo.',
    breathingTip: 'Inspire mantendo as argolas coladas ao corpo; expire empurrando e girando as mãos para fora.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Domine pelo menos 30s de suporte estático estável nas argolas antes de tentar a descida.'],
    padrao: 'mergulhos',
    equipamento: ['argolas'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['dip'],
    progressoes: ['dip-com-carga'],
    variacoes: ['dip'],
    adaptacoes: {
      ombro: ['dip'],
      cotovelo: ['dip'],
      'sem-equipamento': ['dip']
    },
    criterioAvanco: '3x8 repetições com RTO perfeito no topo',
    sinonimos: ['ring dip', 'dips nas argolas'],
    animationType: 'dip',
    executionSteps: [
      { step: 1, title: 'Suporte Estável', description: 'Suspenda-se nas argolas com palmas voltadas para fora no topo (RTO).' },
      { step: 2, title: 'Descida Estreita', description: 'Desça mantendo as tiras das argolas roçando os braços até 90° de cotovelo.' },
      { step: 3, title: 'Empurrão e Rotação', description: 'Empurre para cima e, ao finalizar, gire as palmas para fora novamente.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar as argolas se afastarem lateralmente', correction: 'Segure as argolas firmemente coladas aos quadris.' }
    ]
  },
  {
    id: 'dip-com-carga',
    name: 'Mergulho com Carga (Weighted Dips)',
    category: 'Push',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['triceps', 'peito'],
    secondaryMuscles: ['ombros', 'abdomen'],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSeconds: 120,
    description: 'Sobrecarga progressiva utilizando cinto de peso ou mochila com carga, gerando hipertrofia máxima de tríceps e peitoral.',
    breathingTip: 'Inspire travando o core na descida; expire com força máxima na subida.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Aumente a carga progressivamente (2 a 5 kg por vez); nunca dê tranco nos ombros.'],
    padrao: 'mergulhos',
    equipamento: ['paralelas'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['dip'],
    progressoes: [],
    variacoes: ['dip-argolas'],
    adaptacoes: {
      ombro: ['dip'],
      lombar: ['dip'],
      'sem-equipamento': ['dip-com-carga']
    },
    criterioAvanco: '3x6 repetições com +20% do peso corporal',
    sinonimos: ['weighted dip', 'paralela com peso'],
    animationType: 'dip',
    executionSteps: [
      { step: 1, title: 'Acoplamento da Carga', description: 'Prenda o cinto com peso com segurança entre as pernas.' },
      { step: 2, title: 'Descida Cadenciada', description: 'Desça em 3 segundos até 90° de cotovelo sem oscilar o corpo.' },
      { step: 3, title: 'Empurrão Potente', description: 'Empurre estendendo os braços de forma limpa.' }
    ],
    commonMistakes: [
      { mistake: 'Balançar as pernas para ganhar impulso', correction: 'Mantenha as pernas juntas e o peso imóvel como um pêndulo vertical.' }
    ]
  },
  {
    id: 'extensao-triceps-barra-baixa',
    name: 'Extensão de Tríceps na Barra Baixa ou Mesa',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: [
      'triceps'
    ],
    secondaryMuscles: [
      'ombros',
      'peito',
      'abdomen'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Variação calistênica de isolamento para tríceps (bodyweight skull crusher) onde a cabeça se projeta por baixo de uma barra baixa ou mesa com flexão pura dos cotovelos.',
    breathingTip: 'Inspire ao flexionar os cotovelos levando a testa em direção à barra; expire ao estender os braços.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Mantenha os cotovelos paralelos para evitar pinçamento articular.'
    ],
    padrao: 'empurrar-vertical',
    equipamento: [
      'barra'
    ],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: [
      'flexao-inclinada',
      'pushup'
    ],
    progressoes: [
      'diamondpushup',
      'dip'
    ],
    variacoes: [
      'diamondpushup'
    ],
    adaptacoes: {
      cotovelo: [
        'flexao-inclinada'
      ],
      punho: [
        'extensao-triceps-barra-baixa'
      ],
      semEquipamento: [
        'flexao-fechada'
      ]
    },
    criterioAvanco: '3 séries de 12 repetições com corpo reto e amplitude máxima de extensão',
    sinonimos: [
      'bodyweight tricep extension',
      'tríceps testa calistênico',
      'skull crusher barra baixa'
    ],
    animationType: 'pushup',
    executionSteps: [
      {
        step: 1,
        title: 'Pegada na Barra Baixa',
        description: 'Segure a barra com pegada pronada na largura dos ombros, inclinando o corpo em prancha diagonal.'
      },
      {
        step: 2,
        title: 'Flexão dos Cotovelos',
        description: 'Dobre apenas os cotovelos projetando a cabeça por baixo da barra, mantendo o quadril alinhado.'
      },
      {
        step: 3,
        title: 'Extensão e Contração',
        description: 'Empurre a barra estendendo os cotovelos e contraindo o tríceps no pico da subida.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Abrir os cotovelos para as laterais',
        correction: 'Mantenha os cotovelos apontando estritamente para a frente durante todo o arco.'
      },
      {
        mistake: 'Mover o quadril em vez de dobrar os cotovelos',
        correction: 'Trave a pelve em prancha estática e mova apenas a articulação do cotovelo.'
      }
    ]
  },
  {
    id: 'dip-com-pausa',
    name: 'Mergulho em Paralelas com Pausa no Fundo',
    category: 'Push',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: [
      'triceps',
      'peito'
    ],
    secondaryMuscles: [
      'ombros',
      'abdomen'
    ],
    defaultSets: 3,
    defaultReps: 6,
    defaultRestSeconds: 90,
    description: 'Mergulho estrito com pausa isométrica de 2 a 3 segundos no ponto de maior profundidade articular, anulando o reflexo miotático e desenvolvendo força pura de saída.',
    breathingTip: 'Inspire na descida; congele a respiração com abdômen rígido durante a pausa; expire forte ao subir.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Não ultrapasse a profundidade confortável caso sinta desconforto no deltoide anterior.'
    ],
    padrao: 'mergulhos',
    equipamento: [
      'paralelas'
    ],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-2-1',
    regressoes: [
      'dip'
    ],
    progressoes: [
      'dip-com-carga',
      'dip-argolas'
    ],
    variacoes: [
      'dip'
    ],
    adaptacoes: {
      ombro: [
        'dip-banco-elevado'
      ],
      punho: [
        'dip-banco-chao'
      ],
      semEquipamento: [
        'dip-banco-chao'
      ]
    },
    criterioAvanco: 'Executar 3 séries de 8 repetições com pausa sólida de 2 segundos a 90° de cotovelo sem oscilação',
    sinonimos: [
      'pause dips',
      'mergulho com pausa',
      'isometric pause dip'
    ],
    animationType: 'dip',
    executionSteps: [
      {
        step: 1,
        title: 'Descida Controlada',
        description: 'Inicie no topo das barras paralelas e desça suavemente até os ombros atingirem o nível dos cotovelos.'
      },
      {
        step: 2,
        title: 'Pausa Isométrica no Fundo',
        description: 'Congele imóvel por 2 a 3 segundos mantendo peito aberto e escápulas deprimidas.'
      },
      {
        step: 3,
        title: 'Subida Explosiva e Bloqueio',
        description: 'Empurre com força máxima estendendo os braços de volta ao topo sem embalo.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Relaxar a musculatura escapular no fundo deixando os ombros subirem nas orelhas',
        correction: 'Mantenha ativa a depressão escapular durante toda a pausa isométrica.'
      },
      {
        mistake: 'Balançar as pernas para iniciar a subida',
        correction: 'Mantenha as pernas juntas e o core firme eliminando qualquer kipping.'
      }
    ]
  }
];
