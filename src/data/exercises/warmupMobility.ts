import type { Exercise } from '../../types';
import { CREF_REVIEWER_SPECIALIST } from './reviewer';

export const WARMUP_MOBILITY_EXERCISES: Exercise[] = [
  {
    id: 'circulos-punho',
    name: 'Círculos Articulares de Punho (Wrist Circles)',
    category: 'Full Body',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['antebraco'],
    secondaryMuscles: [],
    defaultSets: 2,
    defaultReps: 15,
    defaultRestSeconds: 30,
    description: 'Rotação suave dos punhos entrelaçados para lubrificação com líquido sinovial antes de exercícios de apoio e suspensão.',
    breathingTip: 'Respire normalmente enquanto faz movimentos circulares contínuos.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não force o punho além de um arco confortável sem dor.'],
    padrao: 'aquecimento',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: false,
    cadencia: 'suave',
    regressoes: [],
    progressoes: ['flexao-extensao-punho-chao'],
    variacoes: ['flexao-extensao-punho-chao'],
    adaptacoes: {
      punho: ['circulos-punho']
    },
    criterioAvanco: 'Completar 15 rotações para cada sentido com facilidade',
    sinonimos: ['wrist circles', 'rotação de punhos'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Entrelaçar os Dedos', description: 'Junte as palmas e entrelace os dedos com cotovelos relaxados junto ao peito.' },
      { step: 2, title: 'Círculos Fluidos', description: 'Desenhe círculos amplos e contínuos em formato de oito.' },
      { step: 3, title: 'Inversão', description: 'Inverta a direção dos círculos após metade das repetições.' }
    ],
    commonMistakes: [
      { mistake: 'Girar muito rápido sem amplitude articular', correction: 'Faça movimentos lentos e circulares completos.' }
    ]
  },
  {
    id: 'flexao-extensao-punho-chao',
    name: 'Aquecimento de Punho no Solo (Wrist Rockers)',
    category: 'Full Body',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['antebraco'],
    secondaryMuscles: [],
    defaultSets: 2,
    defaultReps: 12,
    defaultRestSeconds: 30,
    description: 'Em quatro apoios, balanços suaves para frente e para trás com palmas no chão aquecem flexores e extensores dos punhos para flexões e paradas.',
    breathingTip: 'Expire inclinando sobre os punhos; inspire recuando.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Controle o peso aplicado com os joelhos para não sobrecarregar.'],
    padrao: 'aquecimento',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: false,
    cadencia: 'suave',
    regressoes: ['circulos-punho'],
    progressoes: ['planche-lean'],
    variacoes: ['circulos-punho'],
    adaptacoes: {
      punho: ['circulos-punho']
    },
    criterioAvanco: '12 repetições confortáveis com palmas para frente e para trás',
    sinonimos: ['wrist rockers', 'mobilidade de punho 4 apoios'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Quatro Apoios', description: 'Ajoelhe-se e apoie as palmas no chão com dedos apontados para a frente.' },
      { step: 2, title: 'Balanço Anterior', description: 'Incline suavemente os ombros à frente dos punhos e retorne.' },
      { step: 3, title: 'Variação de Dedos', description: 'Gire os dedos apontando para os joelhos e incline o quadril para trás.' }
    ],
    commonMistakes: [
      { mistake: 'Jogar todo o peso do corpo subitamente nos punhos', correction: 'Mantenha o peso apoiado nos joelhos regulando a carga com sensibilidade.' }
    ]
  },
  {
    id: 'circulos-ombro',
    name: 'Circundução de Ombros (Arm Circles)',
    category: 'Full Body',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['ombros'],
    secondaryMuscles: ['peito', 'costas'],
    defaultSets: 2,
    defaultReps: 15,
    defaultRestSeconds: 30,
    description: 'Círculos pequenos que progridem para grandes giros de braço, aquecendo o manguito rotador e a cápsula articular glenoumeral.',
    breathingTip: 'Respire cadenciado acompanhando os giros.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha os círculos sem estalidos ou dor articular.'],
    padrao: 'aquecimento',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: false,
    cadencia: 'suave',
    regressoes: [],
    progressoes: ['passagem-ombro-toalha'],
    variacoes: ['passagem-ombro-toalha'],
    adaptacoes: {
      ombro: ['circulos-ombro']
    },
    criterioAvanco: '15 círculos para frente e 15 para trás com amplitude total',
    sinonimos: ['arm circles', 'rotação de braços'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Braços em Cruz', description: 'Fique de pé com braços abertos na altura dos ombros e palmas voltadas para baixo.' },
      { step: 2, title: 'Círculos Progressivos', description: 'Inicie círculos pequenos e vá aumentando o diâmetro até círculos completos.' },
      { step: 3, title: 'Inversão', description: 'Gire para a frente e depois repita no sentido contrário.' }
    ],
    commonMistakes: [
      { mistake: 'Encolher os ombros junto ao pescoço durante os giros', correction: 'Mantenha as escápulas deprimidas e peito aberto.' }
    ]
  },
  {
    id: 'passagem-ombro-toalha',
    name: 'Passagem de Ombros com Toalha ou Bastão (Dislocates)',
    category: 'Full Body',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['ombros'],
    secondaryMuscles: ['peito', 'costas'],
    defaultSets: 2,
    defaultReps: 12,
    defaultRestSeconds: 30,
    description: 'Passagem dos braços da frente para trás segurando uma toalha ou elástico com braços esticados, melhorando a mobilidade de rotação externa do ombro.',
    breathingTip: 'Inspire subindo os braços; solte o ar descendo atrás das costas.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Segure bem afastado; NUNCA force nem dobre os cotovelos para passar.'],
    padrao: 'aquecimento',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: false,
    cadencia: 'suave',
    regressoes: ['circulos-ombro'],
    progressoes: ['retracao-protracao-escapular'],
    variacoes: ['circulos-ombro'],
    adaptacoes: {
      ombro: ['circulos-ombro']
    },
    criterioAvanco: '12 passagens suaves sem dobrar os cotovelos',
    sinonimos: ['shoulder dislocates', 'passagem com bastão'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Pegada Larga', description: 'Segure uma toalha ou elástico bem aberta à frente das coxas com braços esticados.' },
      { step: 2, title: 'Elevação Acima da Cabeça', description: 'Suba os braços retos até passarem acima da cabeça.' },
      { step: 3, title: 'Descida Traseira', description: 'Leve suavemente a toalha até encostar na lombar e retorne à frente.' }
    ],
    commonMistakes: [
      { mistake: 'Dobrar um cotovelo para facilitar a passagem', correction: 'Abra mais a pegada na toalha até os braços passarem perfeitamente retos.' }
    ]
  },
  {
    id: 'retracao-protracao-escapular',
    name: 'Retração e Protração Escapular no Solo (Scap Push-up)',
    category: 'Push',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['ombros'],
    secondaryMuscles: ['peito', 'costas', 'abdomen'],
    defaultSets: 2,
    defaultReps: 12,
    defaultRestSeconds: 30,
    description: 'Em prancha ou de joelhos, afasta-se e junta-se as escápulas sem dobrar os cotovelos, ativando o serrátil anterior fundamental para a saúde do ombro.',
    breathingTip: 'Inspire descendo o peito (juntando escápulas); expire empurrando o chão (afastando escápulas).',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha os cotovelos travados durante todo o exercício.'],
    padrao: 'aquecimento',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['flexao-parede'],
    progressoes: ['flexao-escapular'],
    variacoes: ['flexao-escapular'],
    adaptacoes: {
      ombro: ['retracao-protracao-escapular'],
      punho: ['retracao-protracao-escapular']
    },
    criterioAvanco: '12 repetições com protrusão máxima sem dobrar os braços',
    sinonimos: ['scapular push up aquecimento', 'ativação de serrátil'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Quatro Apoios ou Prancha', description: 'Apoie as mãos na largura dos ombros com braços estendidos e tronco alinhado.' },
      { step: 2, title: 'Retração', description: 'Afunde o tórax em direção ao solo juntando as escápulas sem flexionar os cotovelos.' },
      { step: 3, title: 'Protração Máxima', description: 'Empurre o solo com força afastando as escápulas e arredondando as costas.' }
    ],
    commonMistakes: [
      { mistake: 'Dobrar os cotovelos imitando uma flexão tradicional', correction: 'Tranque os braços; o único movimento ocorre nas omoplatas.' }
    ]
  },
  {
    id: 'gato-vaca',
    name: 'Gato-Vaca (Cat-Cow)',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['lombar', 'costas'],
    secondaryMuscles: ['abdomen'],
    defaultSets: 2,
    defaultReps: 10,
    defaultRestSeconds: 30,
    description: 'Mobilização segmentar de toda a coluna vertebral entre flexão (gato) e extensão (vaca), aliviando tensões e preparando as costas.',
    breathingTip: 'Inspire olhando para frente e curvando o abdômen para o chão; expire arredondando as costas para o teto.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Movimentos fluidos e graduais sem trancos nas extremidades.'],
    padrao: 'aquecimento',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: false,
    cadencia: 'suave',
    regressoes: [],
    progressoes: ['rotacao-toracica'],
    variacoes: ['rotacao-toracica'],
    adaptacoes: {
      lombar: ['gato-vaca']
    },
    criterioAvanco: '10 ciclos coordenados com respiração profunda',
    sinonimos: ['cat cow', 'mobilidade de coluna gato vaca'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Quatro Apoios', description: 'Fique de quatro com mãos sob os ombros e joelhos sob os quadris.' },
      { step: 2, title: 'Posição da Vaca', description: 'Inspire, desça o abdômen, empurre o peito à frente e olhe ligeiramente para cima.' },
      { step: 3, title: 'Posição do Gato', description: 'Expire, curve a coluna empurrando o chão, recolhendo o queixo no peito.' }
    ],
    commonMistakes: [
      { mistake: 'Mexer rápido demais sem articular cada vértebra', correction: 'Sinta cada segmento da coluna mover-se como uma onda fluida.' }
    ]
  },
  {
    id: 'rotacao-toracica',
    name: 'Rotação Torácica em Quatro Apoios (Thread the Needle)',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['costas'],
    secondaryMuscles: ['ombros', 'lombar'],
    defaultSets: 2,
    defaultReps: 10,
    defaultRestSeconds: 30,
    description: 'Melhora a mobilidade rotacional da coluna torácica preservando a estabilidade da coluna lombar.',
    breathingTip: 'Expire ao passar o braço por baixo do tronco; inspire abrindo o peito para o teto.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha os quadris estáveis e perpendiculares ao solo.'],
    padrao: 'aquecimento',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: false,
    cadencia: 'suave',
    regressoes: ['gato-vaca'],
    progressoes: ['greatest-stretch'],
    variacoes: ['gato-vaca'],
    adaptacoes: {
      lombar: ['rotacao-toracica']
    },
    criterioAvanco: '10 repetições para cada lado com amplitude plena',
    sinonimos: ['thread the needle', 'passar a linha na agulha'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Base Quatro Apoios', description: 'Posicione-se em quatro apoios em colchonete macio.' },
      { step: 2, title: 'Passar por Baixo', description: 'Deslize o braço direito por baixo do tronco até encostar o ombro e têmpora suavemente no solo.' },
      { step: 3, title: 'Abertura para o Teto', description: 'Abra o mesmo braço apontando para o alto e acompanhe a mão com o olhar.' }
    ],
    commonMistakes: [
      { mistake: 'Girar o quadril para os lados', correction: 'Mantenha a bacia fixa e gire unicamente a caixa torácica.' }
    ]
  },
  {
    id: 'greatest-stretch',
    name: 'Maior Alongamento do Mundo (World’s Greatest Stretch)',
    category: 'Full Body',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'costas', 'gluteos'],
    secondaryMuscles: ['posteriores', 'ombros'],
    defaultSets: 2,
    defaultReps: 6,
    defaultRestSeconds: 30,
    description: 'Combina passada longa, flexão de quadril, abertura de virilha e rotação torácica em um único movimento dinâmico integral.',
    breathingTip: 'Expire afundando o cotovelo e inspire girando o braço para o céu.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha o calcanhar do pé da frente firme no chão.'],
    padrao: 'aquecimento',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: false,
    cadencia: 'suave',
    regressoes: ['lunges'],
    progressoes: ['cossack-squat'],
    variacoes: ['lunges'],
    adaptacoes: {
      joelho: ['lunges']
    },
    criterioAvanco: '6 repetições por lado com rotação torácica vertical completa',
    sinonimos: ['world greatest stretch', 'passada com rotação'],
    animationType: 'lunges',
    executionSteps: [
      { step: 1, title: 'Passada Longa', description: 'Dê um grande passo à frente apoiando as duas mãos no solo por dentro do pé dianteiro.' },
      { step: 2, title: 'Cotovelo ao Solo', description: 'Tente descer o cotovelo do mesmo lado em direção ao calcanhar dianteiro.' },
      { step: 3, title: 'Giro para o Alto', description: 'Gire o tronco e estenda o braço apontando os dedos para o teto, olhando para a mão.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar o joelho traseiro desabar sem manter a perna ativa', correction: 'Estenda a perna de trás ativando o glúteo e a coxa.' }
    ]
  },
  {
    id: 'rotacao-quadril-9090',
    name: 'Transição 90/90 de Quadril (90/90 Hip Switch)',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['gluteos'],
    secondaryMuscles: ['quadriceps', 'lombar'],
    defaultSets: 2,
    defaultReps: 10,
    defaultRestSeconds: 30,
    description: 'Sentado no solo com pernas a 90°, gira-se alternadamente os joelhos de um lado para o outro para desenvolver rotação interna e externa da cabeça do fêmur.',
    breathingTip: 'Respire suavemente permitindo que as pernas caiam lateralmente.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Se tiver desconforto no joelho, apoie as mãos no solo atrás das costas.'],
    padrao: 'aquecimento',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: false,
    cadencia: 'suave',
    regressoes: ['agachamento-profundo-assistido'],
    progressoes: ['cossack-squat'],
    variacoes: ['agachamento-profundo-assistido'],
    adaptacoes: {
      quadril: ['rotacao-quadril-9090']
    },
    criterioAvanco: '10 transições completas sem apoiar as mãos no chão',
    sinonimos: ['90/90 hip switch', 'transição 90 90 quadril'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Posição 90/90', description: 'Sente-se com uma coxa em rotação externa a 90° e a outra em rotação interna a 90°.' },
      { step: 2, title: 'Abertura do Joelho', description: 'Abra o joelho de trás o máximo possível mantendo o da frente no chão.' },
      { step: 3, title: 'Transição Fluida', description: 'Gire as duas pernas para o lado oposto sem arrastar os calcanhares.' }
    ],
    commonMistakes: [
      { mistake: 'Encurvar o tronco para a frente perdendo a postura alta', correction: 'Mantenha o peito aberto e a coluna alongada durante a troca.' }
    ]
  },
  {
    id: 'agachamento-profundo-assistido',
    name: 'Agachamento Profundo com Apoio (Deep Squat Hold)',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['panturrilhas', 'lombar'],
    defaultSets: 2,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 30,
    description: 'Permanecer no fundo do agachamento com calcanhares no chão e apoio leve em mastro ou batente, descomprimindo quadris, tornozelos e lombar.',
    breathingTip: 'Respire profundamente expandindo o abdômen e assoalho pélvico.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha os calcanhares no solo; se necessário, coloque um apoio sob eles.'],
    padrao: 'aquecimento',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['agachamento-assistido'],
    progressoes: ['squat'],
    variacoes: ['agachamento-assistido'],
    adaptacoes: {
      tornozelo: ['agachamento-profundo-assistido']
    },
    criterioAvanco: 'Manter 45 segundos confortáveis no fundo do agachamento',
    sinonimos: ['deep squat hold', 'cócoras apoiado'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Apoio em Mastro', description: 'Segure em um suporte firme com pés na largura dos ombros.' },
      { step: 2, title: 'Descida Completa', description: 'Desça até as coxas encostarem nas panturrilhas mantendo calcanhares no piso.' },
      { step: 3, title: 'Abertura com Cotovelos', description: 'Empurre os joelhos suavemente para fora abrindo a pelve e erguendo o peito.' }
    ],
    commonMistakes: [
      { mistake: 'Tirar os calcanhares do solo ficando na ponta dos pés', correction: 'Segure firme no suporte e projete o peso para trás até o calcanhar assentar.' }
    ]
  },
  {
    id: 'ativacao-gluteo-ponte',
    name: 'Ativação Glútea na Ponte com Isometria',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['gluteos'],
    secondaryMuscles: ['posteriores', 'lombar'],
    defaultSets: 2,
    defaultHoldSeconds: 25,
    defaultRestSeconds: 30,
    description: 'Sustentação isométrica no topo da elevação pélvica para "despertar" a contração dos glúteos antes do treino de pernas ou core.',
    breathingTip: 'Respire contínuo com contração máxima nos glúteos.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não hiperestenda a coluna lombar; o esforço é nos glúteos.'],
    padrao: 'aquecimento',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['ponte-gluteo'],
    progressoes: ['ponte-gluteo-unilateral'],
    variacoes: ['ponte-gluteo'],
    adaptacoes: {
      lombar: ['ativacao-gluteo-ponte']
    },
    criterioAvanco: 'Sustentar 30 segundos com pelve nivelada e glúteos rígidos',
    sinonimos: ['glute bridge hold', 'isometria de ponte'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Deitar de Costas', description: 'Pés no chão na largura dos quadris, joelhos flexionados a 90°.' },
      { step: 2, title: 'Empuxo e Trava', description: 'Empurre os calcanhares e eleve o quadril até a linha reta tronco-coxa.' },
      { step: 3, title: 'Sustentação Rígida', description: 'Mantenha a contração voluntária dos glúteos durante todo o tempo.' }
    ],
    commonMistakes: [
      { mistake: 'Sentir dor na lombar em vez de contração nos glúteos', correction: 'Abaixe ligeiramente o quadril e faça uma leve retroversão pélvica.' }
    ]
  },
  {
    id: 'dead-hang-passivo',
    name: 'Dead Hang Passivo para Descompressão',
    category: 'Pull',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['costas', 'antebraco'],
    secondaryMuscles: ['ombros'],
    defaultSets: 2,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 30,
    description: 'Ficar suspenso na barra com musculatura escapular relaxada, permitindo que a gravidade descomprima a coluna e alongue as dorsais e peitorais.',
    breathingTip: 'Solte todo o ar sentindo a coluna alongar para baixo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não solte a pegada de forma brusca; desça apoiando as pontas dos pés no solo.'],
    padrao: 'aquecimento',
    equipamento: ['barra'],
    tipoExercicio: 'aquecimento',
    estatico: true,
    cadencia: 'isometria',
    regressoes: [],
    progressoes: ['retracao-escapular-barra'],
    variacoes: ['retracao-escapular-barra'],
    adaptacoes: {
      ombro: ['retracao-escapular-barra'],
      'sem-equipamento': ['gato-vaca']
    },
    criterioAvanco: 'Manter 40 segundos confortáveis com descompressão total',
    sinonimos: ['dead hang passivo', 'suspensão passiva na barra'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Pegada Confortável', description: 'Segure a barra com pegada pronada na largura dos ombros.' },
      { step: 2, title: 'Relaxamento da Coluna', description: 'Tire os pés do chão e deixe o peso do corpo puxar os quadris para baixo.' },
      { step: 3, title: 'Descompressão', description: 'Relaxe o pescoço e ombros mantendo apenas os dedos firmemente fechados.' }
    ],
    commonMistakes: [
      { mistake: 'Pular bruscamente da barra no final do exercício', correction: 'Desça com os pés tocando uma caixa ou o chão suavemente.' }
    ]
  }
];
