import type { Exercise } from '../../types';
import { CREF_REVIEWER_SPECIALIST } from './reviewer';

export const PULL_VERTICAL_EXERCISES: Exercise[] = [
  {
    id: 'dead-hang',
    name: 'Dead Hang (Suspensão Passiva na Barra)',
    category: 'Pull',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['antebraco', 'costas'],
    secondaryMuscles: ['ombros'],
    defaultSets: 3,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 60,
    description: 'Sustentação pendurada na barra fixa com musculatura relaxada, promovendo descompressão vertebral e força de pegada.',
    breathingTip: 'Respire profunda e calmamente pelo abdômen soltando a tensão da coluna.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Se sentir pinçamento no topo dos ombros, use uma pegada neutra ou afaste as mãos.'],
    padrao: 'puxar-vertical',
    equipamento: ['barra'],
    tipoExercicio: 'aquecimento',
    estatico: true,
    cadencia: 'isometria',
    regressoes: [],
    progressoes: ['retracao-escapular-barra', 'suspensao-falsa-pegada', 'dead-hang-toalha', 'skin-the-cat'],
    variacoes: ['dead-hang-passivo'],
    adaptacoes: {
      ombro: ['dead-hang'],
      punho: ['dead-hang'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: 'Sustentar 45 segundos confortavelmente',
    sinonimos: ['dead hang', 'suspensão na barra', 'pendurado'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Pegada Segura', description: 'Segure a barra com pegada pronada na largura dos ombros com polegares travando a barra.' },
      { step: 2, title: 'Relaxamento', description: 'Tire os pés do chão e deixe o peso do corpo alongar os dorsais e descomprimir a coluna.' },
      { step: 3, title: 'Respiração', description: 'Mantenha a respiração fluida e solta sem tensionar o pescoço.' }
    ],
    commonMistakes: [
      { mistake: 'Balançar o corpo', correction: 'Mantenha o corpo parado na vertical como um pêndulo imóvel.' }
    ]
  },
  {
    id: 'retracao-escapular-barra',
    name: 'Retração Escapular Ativa na Barra (Scapular Pull)',
    category: 'Pull',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['costas', 'ombros'],
    secondaryMuscles: ['antebraco', 'abdomen'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Puxada curta isolada da cintura escapular sem dobrar os cotovelos. Ativa o grande dorsal e romboides para destravar a barra fixa.',
    breathingTip: 'Expire ao puxar as escápulas para baixo; inspire retornando ao dead hang.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha os cotovelos estendidos o tempo todo; não puxe com os braços.'],
    padrao: 'puxar-vertical',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['dead-hang'],
    progressoes: ['barra-negativa', 'barra-com-elastico'],
    variacoes: ['dead-hang'],
    adaptacoes: {
      ombro: ['australianpullup'],
      punho: ['retracao-escapular-barra'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x10 repetições com pausa de 1s de retração',
    sinonimos: ['scapular pullup', 'puxada escapular'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Suspensão Inicial', description: 'Inicie em dead hang com braços totalmente retos.' },
      { step: 2, title: 'Depressão Escapular', description: 'Puxe os ombros para baixo e para trás afastando-os das orelhas e elevando o tronco 10 cm.' },
      { step: 3, title: 'Controle', description: 'Segure 1 segundo no topo e desça controladamente sem despencar.' }
    ],
    commonMistakes: [
      { mistake: 'Dobrar os cotovelos tentando subir o corpo', correction: 'Trabalhe o movimento puramente nas costas e escápulas.' }
    ]
  },
  {
    id: 'barra-negativa',
    name: 'Barra Fixa (Fase Negativa)',
    category: 'Pull',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['antebraco', 'abdomen'],
    defaultSets: 4,
    defaultReps: 5,
    defaultRestSeconds: 90,
    description: 'Salte até o topo com o queixo acima da barra e resista à descida por 5 segundos completos. A forma mais rápida de conquistar a 1ª barra fixa.',
    breathingTip: 'Inspire no topo; solte o ar controladamente enquanto desce segurando a gravidade.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Tenha um apoio ou banco seguro para subir; não despenteie a descida no final.'],
    padrao: 'puxar-vertical',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '5-1-0',
    regressoes: ['retracao-escapular-barra', 'australianpullup'],
    progressoes: ['chinup-supinada', 'pullup', 'suspensao-queixo-acima-barra', 'chinup-excentrico'],
    variacoes: ['barra-com-elastico'],
    adaptacoes: {
      ombro: ['australianpullup'],
      cotovelo: ['chinup-supinada'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x5 repetições com 5 segundos de descida estrita',
    sinonimos: ['negative pullup', 'barra negativa'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Salto ao Topo', description: 'Suba com ajuda de um salto até o queixo ultrapassar a barra fixa com peito aberto.' },
      { step: 2, title: 'Descida Milimétrica', description: 'Resista à descida contando mentalmente até 5 segundos em velocidade uniforme.' },
      { step: 3, title: 'Extensão Final', description: 'Complete a extensão total dos braços sem soltar o corpo, pise no banco e repita.' }
    ],
    commonMistakes: [
      { mistake: 'Cair rápido nos últimos 20% do movimento', correction: 'Mantenha a força e o controle até esticar completamente os braços.' }
    ]
  },
  {
    id: 'barra-com-elastico',
    name: 'Barra Fixa Assistida com Elástico (Band Pull-up)',
    category: 'Pull',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['antebraco', 'abdomen'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 75,
    description: 'O elástico preso à barra e aos pés compensa o peso corporal na porção mais baixa da puxada, permitindo acumular volume com técnica perfeita.',
    breathingTip: 'Expire puxando o peito em direção à barra; inspire descendo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Prenda o elástico com firmeza no centro da sola do pé para que não escape.'],
    padrao: 'puxar-vertical',
    equipamento: ['barra', 'elastico'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['barra-negativa', 'australianpullup'],
    progressoes: ['chinup-supinada', 'pullup'],
    variacoes: ['barra-negativa'],
    adaptacoes: {
      ombro: ['chinup-supinada'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x10 repetições com elástico fino',
    sinonimos: ['band assisted pullup', 'barra com superband'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Fixação', description: 'Prenda o elástico na barra e posicione o pé ou joelho na laçada.' },
      { step: 2, title: 'Puxada', description: 'Puxe com as costas e bíceps até o queixo passar da barra.' },
      { step: 3, title: 'Descida Controlada', description: 'Desça até a extensão completa dos cotovelos sentindo a dorsal.' }
    ],
    commonMistakes: [
      { mistake: 'Chutar as pernas para usar a mola do elástico', correction: 'Trabalhe a força dos membros superiores de forma controlada.' }
    ]
  },
  {
    id: 'chinup-supinada',
    name: 'Barra Fixa Supinada (Chin-up)',
    category: 'Pull',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['biceps', 'costas'],
    secondaryMuscles: ['antebraco', 'abdomen'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 90,
    description: 'Palmas voltadas para o rosto (pegada supinada). Envolve fortemente os bíceps e grande dorsal, sendo a primeira variação completa dominada pela maioria dos atletas.',
    breathingTip: 'Expire ao puxar o queixo acima da barra; inspire na descida lenta.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não balance as pernas nem dê "chute de peixe" para subir.'],
    padrao: 'puxar-vertical',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['barra-negativa', 'barra-com-elastico'],
    progressoes: ['pullup', 'chinup-pausa-metade'],
    variacoes: ['barra-pegada-neutra'],
    adaptacoes: {
      cotovelo: ['barra-pegada-neutra'],
      ombro: ['barra-pegada-neutra'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x10 repetições completas sem balanço',
    sinonimos: ['chin-up', 'chinup', 'barra supinada'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Pegada Supinada', description: 'Segure a barra com as palmas viradas para você na largura dos ombros.' },
      { step: 2, title: 'Puxada com Peito Alto', description: 'Puxe o peitoral em direção à barra até o queixo ultrapassar a linha de apoio.' },
      { step: 3, title: 'Descida Completa', description: 'Desça até esticar os cotovelos mantendo os ombros ativos.' }
    ],
    commonMistakes: [
      { mistake: 'Meia repetição sem descer até o fim', correction: 'Estenda os braços completamente a cada repetição.' }
    ]
  },
  {
    id: 'pullup',
    name: 'Barra Fixa Pronada Tradicional (Pull-up)',
    category: 'Pull',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['antebraco', 'ombros', 'abdomen'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 90,
    description: 'O pilar mestre da calistenia para desenvolvimento de costas em V, grande dorsal espesso e força de tração vertical.',
    breathingTip: 'Inspire embaixo enchendo a caixa torácica; expire com potência tracionando o corpo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: [
      'Pare imediatamente caso sinta desconforto nos tendões do cotovelo (epicondilite).',
      'Não use o queixo para alcançar a barra esticando o pescoço; puxe o peitoral.'
    ],
    padrao: 'puxar-vertical',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['chinup-supinada', 'barra-negativa'],
    progressoes: ['barra-aberta', 'barra-arqueiro', 'lsit-pullup', 'barra-fixa-explosiva'],
    variacoes: ['barra-pegada-neutra'],
    adaptacoes: {
      cotovelo: ['barra-pegada-neutra', 'australianpullup'],
      ombro: ['barra-pegada-neutra'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x10 repetições estritas tocando a barra no peito',
    sinonimos: ['pullup', 'pull-up', 'barra fixa', 'barra pronada'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Pegada Pronada e Hollow Body', description: 'Palmas voltadas para a frente na largura dos ombros, abdômen ativado em canoa.' },
      { step: 2, title: 'Puxada com a Dorsal', description: 'Puxe os cotovelos para baixo e para trás projetando o peitoral em direção à barra.' },
      { step: 3, title: 'Descida Controlada', description: 'Desça em 2 segundos até o estiramento completo da dorsal mantendo escápulas sob tensão.' }
    ],
    commonMistakes: [
      { mistake: 'Balanço com kipping (usar o quadril)', correction: 'Cruze as pernas ou mantenha pernas esticadas à frente sem impulso.' }
    ]
  },
  {
    id: 'barra-pegada-neutra',
    name: 'Barra Fixa com Pegada Neutra',
    category: 'Pull',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['antebraco', 'ombros'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 90,
    description: 'Palmas voltadas uma para a outra em barras paralelas ou triângulo. A posição mais anatômica e segura para quem tem dores em punhos ou ombros.',
    breathingTip: 'Expire ao puxar; inspire descendo controladamente.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Excelente alternativa caso sinta desconforto na pegada pronada ou supinada.'],
    padrao: 'puxar-vertical',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['chinup-supinada', 'barra-negativa'],
    progressoes: ['pullup', 'lsit-pullup'],
    variacoes: ['pullup'],
    adaptacoes: {
      cotovelo: ['barra-pegada-neutra'],
      ombro: ['barra-pegada-neutra'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x10 repetições com peito tocando a barra',
    sinonimos: ['neutral grip pullup', 'barra neutra'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Pegada Paralela', description: 'Segure nas alças paralelas com palmas se entreolhando.' },
      { step: 2, title: 'Tração Vertical', description: 'Puxe forte direcionando os cotovelos para baixo rente ao tronco.' },
      { step: 3, title: 'Retorno Completo', description: 'Desça até a extensão sem desabar as escápulas.' }
    ],
    commonMistakes: [
      { mistake: 'Encolher os ombros no final da descida', correction: 'Mantenha as escápulas organizadas.' }
    ]
  },
  {
    id: 'barra-aberta',
    name: 'Barra Fixa Aberta (Wide Grip Pull-up)',
    category: 'Pull',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['costas'],
    secondaryMuscles: ['ombros', 'biceps', 'antebraco'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 90,
    description: 'Pegada aberta a 1,5x a largura dos ombros, isolando as fibras superiores e externas do grande dorsal e redondo maior.',
    breathingTip: 'Inspire embaixo; expire abrindo o peito no topo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não realize a puxada por trás da nuca (atrás da cabeça), pois sobrecarrega os ligamentos do ombro.'],
    padrao: 'puxar-vertical',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['pullup'],
    progressoes: ['barra-arqueiro'],
    variacoes: ['pullup'],
    adaptacoes: {
      ombro: ['barra-pegada-neutra'],
      cotovelo: ['chinup-supinada'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x8 repetições tocando o topo do peito',
    sinonimos: ['wide grip pullup', 'barra pegada aberta'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Abertura Larga', description: 'Posicione as mãos bem abertas na barra em pegada pronada.' },
      { step: 2, title: 'Tração Frontal', description: 'Puxe o esterno em direção ao centro da barra sempre pela FRENTE da cabeça.' },
      { step: 3, title: 'Alongamento em V', description: 'Desça sentindo a abertura e estiramento da asa dorsal.' }
    ],
    commonMistakes: [
      { mistake: 'Puxar a barra atrás da nuca', correction: 'Puxe sempre pela frente até a clavícula.' }
    ]
  },
  {
    id: 'barra-arqueiro',
    name: 'Barra Fixa Arqueiro (Archer Pull-up)',
    category: 'Pull',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['antebraco', 'abdomen'],
    defaultSets: 4,
    defaultReps: 5,
    defaultRestSeconds: 120,
    description: 'Puxada lateral sobre a barra: um braço flexiona com mais de 80% do peso enquanto o outro estende como arqueiro sobre a barra.',
    breathingTip: 'Inspire embaixo; solte o ar na puxada lateral explosiva.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Requer alta força em bíceps e ligamentos do antebraço.'],
    padrao: 'puxar-vertical',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['barra-aberta', 'pullup'],
    progressoes: ['barra-unilateral-assistida'],
    variacoes: ['pullup'],
    adaptacoes: {
      cotovelo: ['pullup'],
      ombro: ['barra-pegada-neutra'],
      'sem-equipamento': ['remada-arqueiro']
    },
    criterioAvanco: '3x6 repetições de cada lado com controle',
    sinonimos: ['archer pullup', 'barra arqueiro'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Pegada Larga', description: 'Mãos bem espaçadas na barra em pegada pronada.' },
      { step: 2, title: 'Puxada para o Lado', description: 'Puxe o queixo sobre a mão direita estendendo o braço esquerdo em linha reta ao longo da barra.' },
      { step: 3, title: 'Transição Suave', description: 'Desça ao centro com controle e repita alternando o braço.' }
    ],
    commonMistakes: [
      { mistake: 'Dobrar o braço de apoio', correction: 'Mantenha o braço guia reto com a palma descansando sobre a barra.' }
    ]
  },
  {
    id: 'lsit-pullup',
    name: 'Barra Fixa em L-Sit (L-Sit Pull-up)',
    category: 'Pull',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['costas', 'abdomen'],
    secondaryMuscles: ['biceps', 'quadriceps'],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSeconds: 120,
    description: 'Combina a puxada vertical com a sustentação de pernas a 90° em L-sit, eliminando qualquer chance de kipping ou balanço.',
    breathingTip: 'Expire na subida mantendo o abdômen travado; inspire na descida.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha os flexores do quadril e quadríceps ativos para não deixar as pernas caírem.'],
    padrao: 'puxar-vertical',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['pullup', 'hollowbody'],
    progressoes: ['muscleup'],
    variacoes: ['pullup'],
    adaptacoes: {
      lombar: ['pullup'],
      'sem-equipamento': ['australianpullup']
    },
    criterioAvanco: '3x6 repetições com pernas rigorosamente a 90°',
    sinonimos: ['l-sit pullup', 'barra com l-sit'],
    animationType: 'lsit',
    executionSteps: [
      { step: 1, title: 'Elevação das Pernas', description: 'Suspenda-se na barra e eleve as pernas estendidas a 90° em relação ao tronco.' },
      { step: 2, title: 'Tração Estrita', description: 'Execute a barra fixa sem perder a altura dos pés.' },
      { step: 3, title: 'Controle Completo', description: 'Desça até a extensão de cotovelos com as pernas firmes no ar.' }
    ],
    commonMistakes: [
      { mistake: 'Abaixar as pernas para conseguir puxar', correction: 'Mantenha a ponta dos pés na altura do umbigo.' }
    ]
  },
  {
    id: 'muscle-up-transicao',
    name: 'Muscle-up (Fase de Transição com Apoio)',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['costas', 'triceps', 'ombros'],
    secondaryMuscles: ['peito', 'abdomen'],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSeconds: 90,
    description: 'Treino da virada rápida de cotovelos da puxada para o mergulho sobre a barra baixa ou com pés apoiados em caixa.',
    breathingTip: 'Inspire ao puxar; expire forte e velozmente ao jogar o peito sobre a barra.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não bata o peito na barra de ferro; use protetores ou controle a aceleração.'],
    padrao: 'skills',
    equipamento: ['barra'],
    tipoExercicio: 'skill',
    estatico: false,
    cadencia: 'explosivo',
    regressoes: ['pullup', 'dip'],
    progressoes: ['muscleup'],
    variacoes: ['dip'],
    adaptacoes: {
      cotovelo: ['pullup'],
      ombro: ['dip'],
      'sem-equipamento': ['diamondpushup']
    },
    criterioAvanco: '3x6 transições limpas com os dois cotovelos juntos',
    sinonimos: ['muscle-up transition', 'transição de muscle up'],
    animationType: 'muscleup',
    executionSteps: [
      { step: 1, title: 'Barra Baixa', description: 'Em uma barra na altura do peito com pés no chão, puxe forte.' },
      { step: 2, title: 'Virada dos Cotovelos', description: 'Gire os cotovelos para cima da barra rapidamente projetando o tronco para a frente.' },
      { step: 3, title: 'Posição de Mergulho', description: 'Finalize apoiado na barra em posição inicial de dip.' }
    ],
    commonMistakes: [
      { mistake: 'Virar um cotovelo primeiro que o outro (subida em asa de galinha)', correction: 'Vire os dois cotovelos simultaneamente para proteger o ombro.' }
    ]
  },
  {
    id: 'muscleup',
    name: 'Muscle-up na Barra Fixa',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['costas', 'triceps', 'peito'],
    secondaryMuscles: ['ombros', 'abdomen', 'antebraco'],
    defaultSets: 4,
    defaultReps: 5,
    defaultRestSeconds: 120,
    description: 'A união suprema da puxada explosiva com a transição e mergulho sobre a barra em um único movimento espetacular.',
    breathingTip: 'Inspire no arco de entrada; expire explosivamente ao passar o peito sobre a barra.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: [
      'Nunca faça a transição unilateral ("asa de galinha"), pois pode causar lesão grave no ombro.',
      'Exige base sólida prévia de pelo menos 10 barras fixas e 12 dips rigorosos.'
    ],
    padrao: 'skills',
    equipamento: ['barra'],
    tipoExercicio: 'skill',
    estatico: false,
    cadencia: 'explosivo',
    regressoes: ['muscle-up-transicao', 'pullup', 'dip'],
    progressoes: ['barra-unilateral-assistida'],
    variacoes: ['muscleup-argolas'],
    adaptacoes: {
      ombro: ['pullup', 'dip'],
      cotovelo: ['pullup'],
      'sem-equipamento': ['pullup']
    },
    criterioAvanco: '3x5 repetições sem kipping excessivo',
    sinonimos: ['muscleup', 'muscle-up', 'subida na barra'],
    animationType: 'muscleup',
    executionSteps: [
      { step: 1, title: 'Puxada Explosiva Alta', description: 'Puxe o corpo para cima e para trás com velocidade máxima trazendo a barra abaixo do peito.' },
      { step: 2, title: 'Transição dos Cotovelos', description: 'Gire os dois cotovelos simultaneamente por cima da barra projetando a cabeça à frente.' },
      { step: 3, title: 'Extensão em Mergulho', description: 'Empurre a barra para baixo até estender os braços completamente acima da barra.' }
    ],
    commonMistakes: [
      { mistake: 'Subir um braço de cada vez torcendo o ombro', correction: 'Suba ambos os cotovelos alinhados e simultâneos.' }
    ]
  },
  {
    id: 'barra-unilateral-assistida',
    name: 'Barra Fixa Unilateral Assistida',
    category: 'Pull',
    difficulty: 'Elite',
    type: 'reps',
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['antebraco', 'abdomen'],
    defaultSets: 4,
    defaultReps: 3,
    defaultRestSeconds: 150,
    description: 'Um braço puxa na barra fixa enquanto a outra mão segura uma toalha ou elástico mais baixo para auxílio mínimo.',
    breathingTip: 'Prenda o ar na saída; expire forte ao passar o queixo da barra.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Carga enorme nos tendões do cotovelo; treine com descanso adequado de 48-72h.'],
    padrao: 'puxar-vertical',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['barra-arqueiro', 'pullup'],
    progressoes: [],
    variacoes: ['barra-arqueiro'],
    adaptacoes: {
      cotovelo: ['barra-arqueiro'],
      ombro: ['pullup'],
      'sem-equipamento': ['remada-unilateral']
    },
    criterioAvanco: '3x3 repetições limpas por braço',
    sinonimos: ['assisted one arm pullup', 'barra com um braço assistida'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Mão Principal na Barra', description: 'Segure a barra com uma mão e uma fita/toalha 30 cm abaixo com a outra mão.' },
      { step: 2, title: 'Puxada Unilateral', description: 'Puxe concentrando toda a força na dorsal e bíceps do braço de cima.' },
      { step: 3, title: 'Descida Controlada', description: 'Desça em velocidade controlada sem dar tranco no cotovelo.' }
    ],
    commonMistakes: [
      { mistake: 'Puxar com a mão da toalha com força igual', correction: 'A mão secundária deve usar apenas 2 ou 3 dedos para apoio.' }
    ]
  },
  {
    id: 'suspensao-falsa-pegada',
    name: 'Suspensão com Falsa Pegada (False Grip Hang)',
    category: 'Pull',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: [
      'antebraco'
    ],
    secondaryMuscles: [
      'costas',
      'ombros',
      'biceps'
    ],
    defaultSets: 3,
    defaultHoldSeconds: 20,
    defaultRestSeconds: 60,
    description: 'Sustentação isométrica na barra ou argolas com o punho posicionado acima do implemento (falsa pegada), requisito indispensável para a transição suave do muscle-up.',
    breathingTip: 'Respire ritmadamente mantendo a tensão máxima nos flexores de punho e antebraço.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Se sentir desconforto no túnel do carpo, reduza o tempo sob tensão.'
    ],
    padrao: 'puxar-vertical',
    equipamento: [
      'barra',
      'argolas'
    ],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: [
      'dead-hang'
    ],
    progressoes: [
      'muscle-up-transicao'
    ],
    variacoes: [
      'dead-hang'
    ],
    adaptacoes: {
      punho: [
        'dead-hang'
      ],
      semEquipamento: [
        'flexao-extensao-punho-chao'
      ]
    },
    criterioAvanco: 'Sustentar 3 séries de 25 segundos mantendo os punhos fixados sobre o suporte',
    sinonimos: [
      'false grip hang',
      'falsa pegada suspensa',
      'isometria false grip'
    ],
    animationType: 'pullup',
    executionSteps: [
      {
        step: 1,
        title: 'Posicionamento da Falsa Pegada',
        description: 'Apoie a base da palma da mão e o osso pisiforme por cima da barra ou argola.'
      },
      {
        step: 2,
        title: 'Envolvimento dos Dedos',
        description: 'Feche os dedos com firmeza mantendo os punhos fortemente flexionados em 90°.'
      },
      {
        step: 3,
        title: 'Suspensão Rígida',
        description: 'Retire os pés do apoio e sustente o corpo pendurado sem perder o apoio do punho sobre a barra.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Deixar o punho escorregar para a pegada comum',
        correction: 'Mantenha a dobra do punho travada acima da barra contraindo o antebraço.'
      },
      {
        mistake: 'Desengajar os ombros deixando os braços soltos',
        correction: 'Mantenha leve tensão escapular protegendo o ombro.'
      }
    ]
  },
  {
    id: 'suspensao-queixo-acima-barra',
    name: 'Suspensão com Queixo Acima da Barra (Flexed-Arm Hang)',
    category: 'Pull',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: [
      'costas',
      'biceps'
    ],
    secondaryMuscles: [
      'antebraco',
      'ombros',
      'abdomen'
    ],
    defaultSets: 3,
    defaultHoldSeconds: 20,
    defaultRestSeconds: 60,
    description: 'Sustentação isométrica no topo da barra fixa com queixo ultrapassando o suporte e escápulas aduzidas, excelente construtor de força final de puxada.',
    breathingTip: 'Mantenha respirações curtas e controladas sustentando a contração dorsal e peitoral.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Ao falhar, desça controladamente sem despencar de forma brusca.'
    ],
    padrao: 'puxar-vertical',
    equipamento: [
      'barra'
    ],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: [
      'barra-negativa',
      'barra-com-elastico'
    ],
    progressoes: [
      'pullup',
      'chinup-supinada'
    ],
    variacoes: [
      'barra-negativa'
    ],
    adaptacoes: {
      ombro: [
        'remada-invertida-joelhos'
      ],
      semEquipamento: [
        'remada-porta-toalha'
      ]
    },
    criterioAvanco: 'Manter 3 séries de 25 segundos com queixo acima da barra sem tocar o peito no ferro',
    sinonimos: [
      'flexed arm hang',
      'isometria topo da barra',
      'chin over bar hold'
    ],
    animationType: 'pullup',
    executionSteps: [
      {
        step: 1,
        title: 'Subida com Apoio ou Salto',
        description: 'Use um banco ou salto para posicionar o queixo acima da barra com pegada pronada ou supinada.'
      },
      {
        step: 2,
        title: 'Retração e Trava',
        description: 'Puxe os cotovelos para baixo e para trás juntando as escápulas com o tórax próximo à barra.'
      },
      {
        step: 3,
        title: 'Sustentação',
        description: 'Trave o abdômen e permaneça imóvel durante todo o tempo estipulado.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Apoiar o queixo na barra para descansar',
        correction: 'Mantenha o queixo elevado sem qualquer contato físico de repouso no ferro.'
      },
      {
        mistake: 'Cruzar e balançar as pernas',
        correction: 'Mantenha as pernas unidas em hollow body firme.'
      }
    ]
  },
  {
    id: 'barra-fixa-explosiva',
    name: 'Barra Fixa Explosiva (Explosive Pull-up)',
    category: 'Pull',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: [
      'costas',
      'biceps'
    ],
    secondaryMuscles: [
      'antebraco',
      'ombros',
      'abdomen'
    ],
    defaultSets: 3,
    defaultReps: 5,
    defaultRestSeconds: 90,
    description: 'Puxada vertical executada com velocidade máxima de contração para levar a barra até a linha do esterno ou abdômen superior, base de potência para o muscle-up.',
    breathingTip: 'Inspire no início da descida; expire fortemente na aceleração da subida.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Controle a fase excêntrica para amortecer o impacto nos ombros no ponto zero.'
    ],
    padrao: 'puxar-vertical',
    equipamento: [
      'barra'
    ],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: 'explosiva',
    regressoes: [
      'pullup'
    ],
    progressoes: [
      'muscleup'
    ],
    variacoes: [
      'pullup'
    ],
    adaptacoes: {
      ombro: [
        'australianpullup'
      ],
      punho: [
        'remada-argolas'
      ],
      semEquipamento: [
        'remada-porta-toalha'
      ]
    },
    criterioAvanco: 'Completar 3 séries de 6 repetições encostando a barra abaixo da linha do peitoral',
    sinonimos: [
      'explosive pullup',
      'barra peito na barra',
      'high pull-up',
      'chest to bar'
    ],
    animationType: 'pullup',
    executionSteps: [
      {
        step: 1,
        title: 'Suspensão com Tensão Ativa',
        description: 'Inicie pendurado na barra com cotovelos retos e grande dorsal ativado.'
      },
      {
        step: 2,
        title: 'Tracionamento Explosivo',
        description: 'Puxe a barra para baixo com aceleração máxima projetando o tronco para trás e o peito para cima.'
      },
      {
        step: 3,
        title: 'Descida Controlada',
        description: 'Retorne amortecendo o movimento com os braços sem soltar o corpo em queda livre.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Chutar com as pernas em kipping excessivo',
        correction: 'Gere a aceleração primariamente pelos membros superiores e dorsais.'
      },
      {
        mistake: 'Desabar os braços na descida distendendo a cápsula do ombro',
        correction: 'Mantenha controle na descida ativando as escápulas antes de estender totalmente.'
      }
    ]
  },
  {
    id: 'chinup-excentrico',
    name: 'Chin-up Excêntrico (Descida de 5 s)',
    category: 'Pull',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: [
      'biceps',
      'costas'
    ],
    secondaryMuscles: [
      'antebraco',
      'abdomen'
    ],
    defaultSets: 3,
    defaultReps: 5,
    defaultRestSeconds: 75,
    description: 'Fase excêntrica da barra fixa com pegada supinada sustentando a descida por 5 segundos completos, maximizando a síntese de força nos bíceps e grande dorsal.',
    breathingTip: 'Suba com auxílio inspirando; expire de forma ritmada e contínua durante todos os 5 segundos da descida.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Não solte o corpo bruscamente no final da descida.'
    ],
    padrao: 'puxar-vertical',
    equipamento: [
      'barra'
    ],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '1-0-5',
    regressoes: [
      'barra-negativa',
      'barra-com-elastico'
    ],
    progressoes: [
      'chinup-supinada'
    ],
    variacoes: [
      'barra-negativa'
    ],
    adaptacoes: {
      cotovelo: [
        'remada-invertida-supinada'
      ],
      semEquipamento: [
        'remada-porta-toalha'
      ]
    },
    criterioAvanco: 'Executar 3 séries de 6 repetições com descida controlada de 5 segundos milimetricamente cadenciada',
    sinonimos: [
      'negative chinup',
      'chin-up negativo',
      'descida excêntrica supinada'
    ],
    animationType: 'pullup',
    executionSteps: [
      {
        step: 1,
        title: 'Subida com Salto na Pegada Supinada',
        description: 'Com palmas viradas para o rosto, salte ou use um banco até o queixo ultrapassar a barra.'
      },
      {
        step: 2,
        title: 'Freamento da Descida',
        description: 'Inicie a descida resistindo à gravidade em velocidade constante por 5 segundos inteiros.'
      },
      {
        step: 3,
        title: 'Extensão Final Suave',
        description: 'Complete a extensão total dos braços sem impacto nos cotovelos e pouse os pés para reiniciar.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Cair rápido na metade final do movimento',
        correction: 'Distribua o tempo de descida igualmente do topo até a extensão completa dos cotovelos.'
      },
      {
        mistake: 'Projetar os ombros para a frente na descida',
        correction: 'Mantenha o peito aberto e escápulas ativas durante todo o percurso.'
      }
    ]
  },
  {
    id: 'chinup-pausa-metade',
    name: 'Chin-up com Pausa de 3 s na Metade',
    category: 'Pull',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: [
      'biceps',
      'costas'
    ],
    secondaryMuscles: [
      'antebraco',
      'abdomen'
    ],
    defaultSets: 3,
    defaultReps: 6,
    defaultRestSeconds: 90,
    description: 'Chin-up completo com pausa isométrica estrita de 3 segundos quando os cotovelos atingem o ângulo crítico de 90°, eliminando qualquer momento e gerando força em ângulo desfavorável.',
    breathingTip: 'Inspire na subida; prenda a respiração com tronco firme durante a pausa de 3 s; expire no topo ao finalizar.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Se sentir dor no tendão do bíceps, retorne à versão contínua.'
    ],
    padrao: 'puxar-vertical',
    equipamento: [
      'barra'
    ],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-3-1',
    regressoes: [
      'chinup-supinada'
    ],
    progressoes: [
      'barra-unilateral-assistida'
    ],
    variacoes: [
      'chinup-supinada'
    ],
    adaptacoes: {
      ombro: [
        'remada-invertida-supinada'
      ],
      semEquipamento: [
        'remada-porta-toalha'
      ]
    },
    criterioAvanco: '3 séries de 7 repetições com pausa estrita de 3 segundos a 90° de flexão em todas as repetições',
    sinonimos: [
      'pause chinup',
      'chin-up com pausa',
      'isometric chin up hold'
    ],
    animationType: 'pullup',
    executionSteps: [
      {
        step: 1,
        title: 'Início e Tração',
        description: 'Pendure-se com pegada supinada e puxe o corpo até os cotovelos formarem 90°.'
      },
      {
        step: 2,
        title: 'Pausa Isométrica a 90°',
        description: 'Congele imóvel por 3 segundos apertando os bíceps e dorsais sem perder altura.'
      },
      {
        step: 3,
        title: 'Finalização e Descida',
        description: 'Complete a puxada levando o queixo acima da barra e desça controladamente.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Balançar o corpo para quebrar a inércia após a pausa',
        correction: 'Mantenha o corpo reto em canoa sem usar chute de pernas.'
      },
      {
        mistake: 'Fazer uma pausa de menos de 1 segundo',
        correction: 'Conte 3 segundos completos de forma cadenciada mentalmente.'
      }
    ]
  },
  {
    id: 'dead-hang-toalha',
    name: 'Dead Hang com Toalha (Pegada Grossa)',
    category: 'Pull',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: [
      'antebraco'
    ],
    secondaryMuscles: [
      'costas',
      'ombros'
    ],
    defaultSets: 3,
    defaultHoldSeconds: 20,
    defaultRestSeconds: 60,
    description: 'Sustentação pendurada segurando toalhas enroladas na barra, aumentando drasticamente o diâmetro da pegada e exigindo máxima força de pinça e flexores dos dedos.',
    breathingTip: 'Respire profundamente pelo diafragma mantendo a preensão palmar contraída ao máximo.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Certifique-se de que a toalha é resistente e não deslize na barra.'
    ],
    padrao: 'puxar-vertical',
    equipamento: [
      'barra',
      'toalha'
    ],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: [
      'dead-hang'
    ],
    progressoes: [
      'dead-hang-unilateral-assistido'
    ],
    variacoes: [
      'dead-hang'
    ],
    adaptacoes: {
      punho: [
        'dead-hang'
      ],
      semEquipamento: [
        'flexao-extensao-punho-chao'
      ]
    },
    criterioAvanco: 'Sustentar 3 séries de 30 segundos com firmeza nas duas toalhas sem escorregar',
    sinonimos: [
      'towel dead hang',
      'suspensão com toalha',
      'pegada grossa na barra'
    ],
    animationType: 'pullup',
    executionSteps: [
      {
        step: 1,
        title: 'Enrolamento das Toalhas',
        description: 'Passe duas toalhas resistentes por cima da barra com as pontas verticais para baixo.'
      },
      {
        step: 2,
        title: 'Pegada Firme',
        description: 'Segure firmemente as pontas das toalhas com as mãos na largura dos ombros apertando a pinça manual.'
      },
      {
        step: 3,
        title: 'Suspensão e Estabilidade',
        description: 'Tire os pés do solo e sustente o corpo pendurado com os ombros ativos.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Segurar com a toalha frouxa escorregando pelos dedos',
        correction: 'Aperte a toalha com a força máxima de punho antes de tirar o peso do chão.'
      },
      {
        mistake: 'Deixar os ombros subirem encostando nas orelhas',
        correction: 'Deprima levemente as escápulas mantendo estabilidade articular.'
      }
    ]
  },
  {
    id: 'dead-hang-unilateral-assistido',
    name: 'Dead Hang Unilateral Assistido (One-Arm Hang)',
    category: 'Pull',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: [
      'antebraco',
      'costas'
    ],
    secondaryMuscles: [
      'ombros',
      'abdomen'
    ],
    defaultSets: 3,
    defaultHoldSeconds: 15,
    defaultRestSeconds: 75,
    description: 'Sustentação pendurada na barra com foco em um único braço, com 1 ou 2 dedos da outra mão servindo de assistência mínima para estabilidade rotacional.',
    breathingTip: 'Respire de forma controlada mantendo o ombro do braço de apoio ativo e travado.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Não deixe o ombro de apoio desengajar totalmente em suspensão passiva brusca.'
    ],
    padrao: 'puxar-vertical',
    equipamento: [
      'barra'
    ],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: [
      'dead-hang-toalha',
      'dead-hang'
    ],
    progressoes: [
      'barra-unilateral-assistida'
    ],
    variacoes: [
      'dead-hang'
    ],
    adaptacoes: {
      ombro: [
        'dead-hang'
      ],
      punho: [
        'dead-hang'
      ],
      semEquipamento: [
        'remada-porta-toalha'
      ]
    },
    criterioAvanco: 'Manter 3 séries de 20 segundos cada braço com apoio de apenas 1 dedo da mão de suporte',
    sinonimos: [
      'assisted one arm hang',
      'dead hang um braço',
      'suspensão unilateral barra'
    ],
    animationType: 'pullup',
    executionSteps: [
      {
        step: 1,
        title: 'Pegada Principal e Apoio',
        description: 'Segure a barra com uma mão firme e apoie 1 ou 2 dedos da outra mão na barra para equilíbrio.'
      },
      {
        step: 2,
        title: 'Ativação do Ombro',
        description: 'Engaje as escápulas do braço principal evitando torção descontrolada do corpo.'
      },
      {
        step: 3,
        title: 'Sustentação Unilateral',
        description: 'Sustente o tempo estipulado reduzindo ao mínimo o peso sobre os dedos auxiliares, alternando os lados.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Girar o corpo descontroladamente no próprio eixo',
        correction: 'Contraia o abdômen e use a ponta do dedo auxiliar para frear a rotação.'
      },
      {
        mistake: 'Desengajar o ombro deixando o peso puxar a cápsula sem ativação',
        correction: 'Puxe o ombro levemente para baixo mantendo o dorsal ativado.'
      }
    ]
  }
];
