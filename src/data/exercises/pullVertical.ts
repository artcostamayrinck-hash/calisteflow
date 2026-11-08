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
    progressoes: ['retracao-escapular-barra'],
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
    progressoes: ['chinup-supinada', 'pullup'],
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
    progressoes: ['pullup'],
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
    progressoes: ['barra-aberta', 'barra-arqueiro', 'lsit-pullup'],
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
  }
];
