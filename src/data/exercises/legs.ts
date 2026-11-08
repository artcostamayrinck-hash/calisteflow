import type { Exercise } from '../../types';
import { CREF_REVIEWER_SPECIALIST } from './reviewer';

export const LEGS_EXERCISES: Exercise[] = [
  {
    id: 'agachamento-assistido',
    name: 'Agachamento Assistido (Apoio em Porta ou Cadeira)',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['posteriores', 'panturrilhas'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 45,
    description: 'Com apoio leve das mãos em batente de porta ou encosto de cadeira, permite aprender a profundidade e distribuição de peso sem medo de desequilibrar.',
    breathingTip: 'Inspire na descida mantendo peito ereto; expire subindo pelos calcanhares.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não puxe os braços com força excessiva; use-os apenas para equilíbrio.'],
    padrao: 'agachamento-pernas',
    equipamento: ['cadeira'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['agachamento-parede'],
    progressoes: ['squat'],
    variacoes: ['agachamento-parede'],
    adaptacoes: {
      joelho: ['agachamento-parede', 'agachamento-assistido'],
      lombar: ['agachamento-assistido']
    },
    criterioAvanco: '3x15 repetições fluidas com apoio mínimo das pontas dos dedos',
    sinonimos: ['assisted squat', 'agachamento com apoio'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Posição e Apoio', description: 'Fique de pé com pés na largura dos ombros, segurando levemente em um batente firme ou cadeira.' },
      { step: 2, title: 'Descida Guiada', description: 'Inicie empurrando o quadril para trás e descendo até as coxas ficarem paralelas ao solo.' },
      { step: 3, title: 'Subida Ativa', description: 'Empurre o solo com toda a planta dos pés para retornar à posição ereta.' }
    ],
    commonMistakes: [
      { mistake: 'Puxar o corpo com os braços em vez de usar as pernas', correction: 'Use apenas as pontas dos dedos no suporte para apoio sensorial.' }
    ]
  },
  {
    id: 'squat',
    name: 'Agachamento Livre Tradicional (Air Squat)',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['posteriores', 'panturrilhas', 'abdomen'],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 60,
    description: 'Movimento fundamental da calistenia para membros inferiores. Fortalece quadríceps, glúteos e estabilização de tornozelos e pelve.',
    breathingTip: 'Inspire descendo com o core preenchido; solte o ar na extensão completa.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha os calcanhares totalmente colados ao chão.'],
    padrao: 'agachamento-pernas',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['agachamento-assistido', 'agachamento-parede'],
    progressoes: ['agachamento-pausa', 'lunges', 'agachamento-salto'],
    variacoes: ['agachamento-sumo', 'agachamento-parede'],
    adaptacoes: {
      joelho: ['agachamento-assistido', 'agachamento-parede'],
      lombar: ['agachamento-parede']
    },
    criterioAvanco: '3x20 repetições com quadril descendo abaixo da linha dos joelhos',
    sinonimos: ['air squat', 'agachamento peso corporal'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Posição dos Pés', description: 'Pés na largura dos ombros ou ligeiramente mais afastados, pontas levemente voltadas para fora.' },
      { step: 2, title: 'Descida Controlada', description: 'Dobre quadris e joelhos simultaneamente, projetando os joelhos na direção dos dedos dos pés.' },
      { step: 3, title: 'Extensão Completa', description: 'Suba pressionando os calcanhares e trave os glúteos no topo sem hiperextensão lombar.' }
    ],
    commonMistakes: [
      { mistake: 'Descolar os calcanhares do solo', correction: 'Trabalhe mobilidade de tornozelo ou afaste um pouco mais os pés.' }
    ]
  },
  {
    id: 'agachamento-parede',
    name: 'Agachamento Isométrico na Parede (Wall Sit)',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['gluteos', 'panturrilhas'],
    defaultSets: 3,
    defaultHoldSeconds: 40,
    defaultRestSeconds: 45,
    description: 'Excelente para desenvolver resistência nos quadríceps e reabilitação de tendinopatias patelares, sem impacto dinâmico na cartilagem.',
    breathingTip: 'Respire profundamente com o tronco apoiado contra a parede.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha os joelhos alinhados a 90° sem ultrapassar os tornozelos.'],
    padrao: 'agachamento-pernas',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['agachamento-assistido'],
    progressoes: ['squat'],
    variacoes: ['squat'],
    adaptacoes: {
      joelho: ['agachamento-parede'],
      lombar: ['agachamento-parede']
    },
    criterioAvanco: 'Manter 3 séries de 60 segundos com ângulo reto exato',
    sinonimos: ['wall sit', 'cadeirinha na parede'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Apoio Dorsal', description: 'Encoste as costas completamente retas contra uma parede firme.' },
      { step: 2, title: 'Deslize a 90°', description: 'Deslize para baixo até as coxas ficarem perfeitamente paralelas ao piso com joelhos a 90°.' },
      { step: 3, title: 'Sustentação', description: 'Mantenha os braços soltos ao lado ou cruzados no peito sem apoiar nas coxas.' }
    ],
    commonMistakes: [
      { mistake: 'Apoiar as mãos nas coxas aliviando a tensão', correction: 'Mantenha as mãos cruzadas no peito ou livres.' }
    ]
  },
  {
    id: 'agachamento-sumo',
    name: 'Agachamento Sumô',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['gluteos', 'quadriceps'],
    secondaryMuscles: ['posteriores'],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 60,
    description: 'Postura com base mais ampla e pés rodados externamente a 45°, enfatizando a musculatura adutora e glúteos com menor exigência de flexão de tornozelo.',
    breathingTip: 'Inspire descendo abrindo os joelhos; expire subindo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Acompanhe a linha dos joelhos com a ponta dos pés.'],
    padrao: 'agachamento-pernas',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['agachamento-assistido', 'squat'],
    progressoes: ['cossack-squat'],
    variacoes: ['squat'],
    adaptacoes: {
      tornozelo: ['agachamento-sumo'],
      joelho: ['agachamento-assistido']
    },
    criterioAvanco: '3x20 repetições com abertura estável e tronco ereto',
    sinonimos: ['sumo squat', 'agachamento aberto'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Base Larga', description: 'Afaste os pés bem além da largura dos ombros, apontando os dedos para fora em cerca de 45°.' },
      { step: 2, title: 'Descida Vertical', description: 'Desça o quadril mantendo o tronco o mais vertical possível e empurrando os joelhos para fora.' },
      { step: 3, title: 'Subida com Adutores', description: 'Pressione os calcanhares e aperte a parte interna da coxa e glúteos no retorno.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar os joelhos caírem para dentro (valgo dinâmico)', correction: 'Force ativamente a rotação externa dos joelhos em direção aos dedinhos do pé.' }
    ]
  },
  {
    id: 'agachamento-pausa',
    name: 'Agachamento com Pausa de 3 Segundos',
    category: 'Legs',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['posteriores', 'abdomen'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Elimina o reflexo do ciclo alongamento-encurtamento (stretch-shortening), gerando enorme recrutamento muscular a partir do ponto de estagnação mais baixo.',
    breathingTip: 'Mantenha a respiração e tensão do core durante os 3 segundos de pausa profunda.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não relaxe na posição inferior; sustente a contração muscular ativa.'],
    padrao: 'agachamento-pernas',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-3-1',
    regressoes: ['squat'],
    progressoes: ['agachamento-salto', 'pistol-squat-assistido'],
    variacoes: ['squat'],
    adaptacoes: {
      joelho: ['agachamento-parede']
    },
    criterioAvanco: '3x15 repetições com cronometragem estrita da pausa',
    sinonimos: ['pause squat', 'agachamento isométrico embaixo'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Descida Controlada', description: 'Desça em 2 segundos até o fundo do agachamento mantendo o peito alto.' },
      { step: 2, title: 'Congelamento Ativo', description: 'Pause e segure firme por 3 segundos sem relaxar nos ligamentos.' },
      { step: 3, title: 'Subida Explosiva', description: 'Empurre o chão com vigor até estender totalmente.' }
    ],
    commonMistakes: [
      { mistake: 'Sentar passivamente nas articulações perdendo a tensão do quadríceps', correction: 'Mantenha os músculos armados como uma mola sob pressão.' }
    ]
  },
  {
    id: 'agachamento-salto',
    name: 'Agachamento com Salto (Jump Squat)',
    category: 'Legs',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['panturrilhas', 'posteriores'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 75,
    description: 'Exercício pliométrico que converte força básica em potência e velocidade de extensão tripla (tornozelo, joelho e quadril).',
    breathingTip: 'Solte o ar na propulsão aérea e inspire aterrissando suavemente.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Aterrissagem deve ser macia com flexão imediata dos joelhos.'],
    padrao: 'agachamento-pernas',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: 'explosiva',
    regressoes: ['squat', 'agachamento-pausa'],
    progressoes: ['step-up-alto', 'pistol-squat-assistido'],
    variacoes: ['squat'],
    adaptacoes: {
      joelho: ['agachamento-pausa', 'squat'],
      lombar: ['squat']
    },
    criterioAvanco: '3x15 saltos altos com recepção suave na ponta dos pés',
    sinonimos: ['jump squat', 'agachamento pliométrico'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Descida Preparatória', description: 'Desça em agachamento até um quarto ou metade da profundidade.' },
      { step: 2, title: 'Explosão Aérea', description: 'Empurre o solo com máxima velocidade saltando o mais alto possível.' },
      { step: 3, title: 'Aterrissagem Suave', description: 'Receba o solo na ponta dos pés absorvendo o impacto ao dobrar os joelhos diretamente no próximo agachamento.' }
    ],
    commonMistakes: [
      { mistake: 'Aterrissar de joelhos duros com pancada de calcanhar', correction: 'Amorteça flexionando joelhos e tornozelos silenciosamente.' }
    ]
  },
  {
    id: 'lunges',
    name: 'Afundo Tradicional para a Frente (Walking/Forward Lunge)',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['posteriores', 'panturrilhas'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Passada à frente com peso corporal, desenvolvendo equilíbrio unilateral e força funcional da coxa e pelve.',
    breathingTip: 'Inspire no passo e descida; solte o ar empurrando de volta.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não deixe o joelho dianteiro oscilar para dentro.'],
    padrao: 'agachamento-pernas',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['agachamento-assistido', 'squat'],
    progressoes: ['afundo-reverso', 'afundo-bulgaro'],
    variacoes: ['afundo-reverso'],
    adaptacoes: {
      joelho: ['afundo-reverso', 'agachamento-parede']
    },
    criterioAvanco: '3x16 passadas (8 por perna) com postura ereta',
    sinonimos: ['forward lunge', 'passada frontal'],
    animationType: 'lunges',
    executionSteps: [
      { step: 1, title: 'Posição em Pé', description: 'Inicie em pé com pés juntos e mãos na cintura.' },
      { step: 2, title: 'Passo à Frente', description: 'Dê um passo largo à frente e desça o joelho de trás até quase encostar no solo.' },
      { step: 3, title: 'Retorno', description: 'Empurre com a perna dianteira voltando à posição inicial.' }
    ],
    commonMistakes: [
      { mistake: 'Bater o joelho de trás com força no solo', correction: 'Controle a descida parando a 2 cm do chão.' }
    ]
  },
  {
    id: 'afundo-reverso',
    name: 'Afundo Reverso (Passo para Trás)',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['gluteos', 'quadriceps'],
    secondaryMuscles: ['posteriores'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Alternativa mais gentil para o tendão patelar do que o afundo frontal, pois a desaceleração é feita com o peso sobre a tíbia vertical dianteira.',
    breathingTip: 'Inspire dando o passo para trás; solte o ar subindo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha a tíbia da perna dianteira quase vertical.'],
    padrao: 'agachamento-pernas',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['squat'],
    progressoes: ['afundo-bulgaro', 'step-up-baixo'],
    variacoes: ['lunges'],
    adaptacoes: {
      joelho: ['afundo-reverso', 'agachamento-parede']
    },
    criterioAvanco: '3x16 repetições (8 cada perna) com fluidez',
    sinonimos: ['reverse lunge', 'passada para trás'],
    animationType: 'lunges',
    executionSteps: [
      { step: 1, title: 'Preparação', description: 'Em pé, contraia o abdômen e mantenha o olhar para frente.' },
      { step: 2, title: 'Passo Posterior', description: 'Dê um passo para trás e flexione ambos os joelhos a 90°.' },
      { step: 3, title: 'Empuxo do Calcanhar', description: 'Suba transferindo a força pelo calcanhar dianteiro.' }
    ],
    commonMistakes: [
      { mistake: 'Inclinar o tronco excessivamente para trás', correction: 'Mantenha o tronco reto ou com leve inclinação à frente.' }
    ]
  },
  {
    id: 'afundo-bulgaro',
    name: 'Agachamento Búlgaro (Bulgarian Split Squat)',
    category: 'Legs',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['posteriores', 'panturrilhas'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Com o pé de trás elevado em um banco, quase 85% do peso recai sobre a perna frontal, oferecendo tremenda sobrecarga para glúteos e quadríceps.',
    breathingTip: 'Inspire descendo até o paralelo; expire ao empurrar o solo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Encontre a distância correta do pé para não pinçar a virilha posterior.'],
    padrao: 'agachamento-pernas',
    equipamento: ['banco'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['afundo-reverso', 'lunges'],
    progressoes: ['pistol-squat-assistido', 'shrimp-squat'],
    variacoes: ['lunges'],
    adaptacoes: {
      joelho: ['afundo-reverso', 'agachamento-parede'],
      'sem-equipamento': ['afundo-reverso']
    },
    criterioAvanco: '3x12 repetições por perna com coxa dianteira quebrando o paralelo',
    sinonimos: ['bulgarian split squat', 'agachamento búlgaro'],
    animationType: 'lunges',
    executionSteps: [
      { step: 1, title: 'Apoio no Banco', description: 'Fique de costas para um banco e apoie o peito do pé de trás na borda.' },
      { step: 2, title: 'Descida Vertical', description: 'Desça o corpo dobrando o joelho da frente até a coxa ficar paralela ao chão.' },
      { step: 3, title: 'Subida Forte', description: 'Empurre o solo com o calcanhar dianteiro até a extensão quase total.' }
    ],
    commonMistakes: [
      { mistake: 'Pé dianteiro muito próximo do banco sobrecarregando o joelho', correction: 'Dê um passo mais longo à frente antes de posicionar o pé traseiro.' }
    ]
  },
  {
    id: 'cossack-squat',
    name: 'Agachamento Cossaco (Cossack Squat)',
    category: 'Legs',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['panturrilhas', 'posteriores'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Agachamento lateral profundo que combina força unilateral com mobilidade extrema de adutores e dorsiflexão de tornozelo no plano frontal.',
    breathingTip: 'Inspire agachando para um lado; solte o ar subindo de volta ao centro.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha o calcanhar do lado que agacha colado ao solo.'],
    padrao: 'agachamento-pernas',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['agachamento-sumo'],
    progressoes: ['pistol-squat-assistido'],
    variacoes: ['agachamento-sumo'],
    adaptacoes: {
      tornozelo: ['agachamento-sumo'],
      joelho: ['squat']
    },
    criterioAvanco: '3x12 repetições (6 cada lado) profundas sem erguer o calcanhar',
    sinonimos: ['cossack squat', 'agachamento lateral profundo'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Base Bem Aberta', description: 'Afaste os pés no dobro da largura dos ombros com pés apontados para a frente.' },
      { step: 2, title: 'Descida Unilateral', description: 'Desça totalmente sobre a perna direita enquanto a esquerda permanece estendida com calcanhar no solo e ponta para cima.' },
      { step: 3, title: 'Subida Central', description: 'Empurre com a perna direita voltando ao topo e repita para a esquerda.' }
    ],
    commonMistakes: [
      { mistake: 'Levantar o calcanhar do pé de apoio na descida', correction: 'Trabalhe mobilidade de tornozelo ou reduza a profundidade da descida.' }
    ]
  },
  {
    id: 'step-up-baixo',
    name: 'Subida no Banco Baixo (Low Step-Up)',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['panturrilhas'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 45,
    description: 'Subida em degrau ou banco na altura da canela/joelho, desenvolvendo força funcional e equilíbrio unilateral com baixo estresse articular.',
    breathingTip: 'Solte o ar na subida; inspire na descida controlada.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não pegue impulso com o pé que ficou no solo.'],
    padrao: 'agachamento-pernas',
    equipamento: ['banco'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['squat', 'lunges'],
    progressoes: ['step-up-alto', 'afundo-bulgaro'],
    variacoes: ['lunges'],
    adaptacoes: {
      joelho: ['agachamento-assistido'],
      'sem-equipamento': ['afundo-reverso']
    },
    criterioAvanco: '3x15 subidas por perna sem empurrar com a perna de trás',
    sinonimos: ['step-up degrau', 'subida na caixa'],
    animationType: 'lunges',
    executionSteps: [
      { step: 1, title: 'Pé na Plataforma', description: 'Coloque o pé inteiro sobre uma caixa ou banco firme de 30 a 40 cm.' },
      { step: 2, title: 'Subida Unilateral', description: 'Empurre com a perna de cima sem dar pulo com a de baixo, ficando de pé sobre a caixa.' },
      { step: 3, title: 'Descida Excêntrica', description: 'Desça suavemente até a ponta do pé de trás tocar o solo.' }
    ],
    commonMistakes: [
      { mistake: 'Pular com a perna de baixo em vez de puxar com a de cima', correction: 'Mantenha o tornozelo de baixo dorsifletido para não poder saltar.' }
    ]
  },
  {
    id: 'step-up-alto',
    name: 'Subida no Banco Alto (High Step-Up)',
    category: 'Legs',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['gluteos', 'quadriceps'],
    secondaryMuscles: ['posteriores', 'panturrilhas'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Subida em degrau na altura da metade da coxa ou quadril, exigindo extrema flexão de quadril e força concêntrica do glúteo máximo.',
    breathingTip: 'Expire forte ao vencer o ponto inicial mais baixo da subida.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Verifique a estabilidade da caixa ou banco antes de subir.'],
    padrao: 'agachamento-pernas',
    equipamento: ['banco'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['step-up-baixo', 'afundo-bulgaro'],
    progressoes: ['pistol-squat-caixa'],
    variacoes: ['afundo-bulgaro'],
    adaptacoes: {
      joelho: ['step-up-baixo'],
      'sem-equipamento': ['afundo-bulgaro']
    },
    criterioAvanco: '3x12 repetições limpas por perna',
    sinonimos: ['high step up', 'subida em caixa alta'],
    animationType: 'lunges',
    executionSteps: [
      { step: 1, title: 'Posição Alta', description: 'Apoie o pé em caixa alta de 50 a 60 cm.' },
      { step: 2, title: 'Incline o Tronco', description: 'Incline ligeiramente o peito à frente sobre a coxa de apoio.' },
      { step: 3, title: 'Subida Concêntrica', description: 'Comprima o calcanhar e suba controlando o equilíbrio até ficar ereto.' }
    ],
    commonMistakes: [
      { mistake: 'Desequilibrar no topo da caixa', correction: 'Fixe o olhar em um ponto à frente e trave o glúteo.' }
    ]
  },
  {
    id: 'panturrilha-dupla',
    name: 'Elevação de Panturrilha em Degrau com Dois Pés',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['panturrilhas'],
    secondaryMuscles: [],
    defaultSets: 3,
    defaultReps: 20,
    defaultRestSeconds: 45,
    description: 'Trabalho do gastrocnêmio e sóleo com amplitude total no degrau, alongando a fáscia plantar e fortalecendo o tendão de Aquiles.',
    breathingTip: 'Solte o ar na ponta máxima dos pés; inspire descendo bem abaixo do degrau.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Apoie a mão em uma parede para evitar perda de equilíbrio.'],
    padrao: 'agachamento-pernas',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['squat'],
    progressoes: ['panturrilha-unilateral'],
    variacoes: ['panturrilha-unilateral'],
    adaptacoes: {
      tornozelo: ['panturrilha-dupla']
    },
    criterioAvanco: '3x25 repetições com pausa de 2 segundos no topo',
    sinonimos: ['calf raises degrau', 'gêmeos em degrau'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Apoio dos Metatarsos', description: 'Apoie as pontas dos pés na borda de um degrau com os calcanhares no ar.' },
      { step: 2, title: 'Alongamento Máximo', description: 'Desça os calcanhares lentamente abaixo do nível do degrau sentindo o estiramento.' },
      { step: 3, title: 'Pico de Contração', description: 'Suba na ponta máxima dos dedos e segure por 2 segundos antes de descer.' }
    ],
    commonMistakes: [
      { mistake: 'Fazer repetições curtas e rápidas aproveitando a elasticidade do tendão', correction: 'Faça pausas de 1 segundo embaixo e 2 segundos no topo.' }
    ]
  },
  {
    id: 'panturrilha-unilateral',
    name: 'Elevação de Panturrilha Unilateral em Degrau',
    category: 'Legs',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['panturrilhas'],
    secondaryMuscles: [],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 60,
    description: 'Dobra a carga em cada membro, promovendo hipertrofia e prevenindo tendinopatias e entorses de tornozelo.',
    breathingTip: 'Expire subindo; inspire descendo lentamente.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha a perna quase reta com joelho levemente destravado.'],
    padrao: 'agachamento-pernas',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-2-2',
    regressoes: ['panturrilha-dupla'],
    progressoes: ['pistol-squat-assistido'],
    variacoes: ['panturrilha-dupla'],
    adaptacoes: {
      tornozelo: ['panturrilha-dupla']
    },
    criterioAvanco: '3x18 repetições completas e controladas por perna',
    sinonimos: ['single leg calf raise', 'panturrilha uma perna'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Apoio Unilateral', description: 'Apoie uma das pontas do pé no degrau e enlace a outra perna atrás.' },
      { step: 2, title: 'Descida Profunda', description: 'Desça o calcanhar até o alongamento confortável do tendão de Aquiles.' },
      { step: 3, title: 'Elevação Completa', description: 'Eleve o corpo até a ponta máxima do pé mantendo o equilíbrio.' }
    ],
    commonMistakes: [
      { mistake: 'Dobrar e esticar o joelho para ajudar na subida', correction: 'Mantenha a articulação do joelho fixa com movimento apenas no tornozelo.' }
    ]
  },
  {
    id: 'pistol-squat-assistido',
    name: 'Pistol Squat Assistido (com Apoio ou Elástico)',
    category: 'Legs',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['posteriores', 'panturrilhas', 'abdomen'],
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 60,
    description: 'Agachamento em uma perna com a outra estendida para frente, utilizando apoio em mastro, argola ou elástico para aliviar o pico de carga.',
    breathingTip: 'Inspire descendo devagar; solte o ar na subida forte.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha o calcanhar do pé no solo firmemente apoiado.'],
    padrao: 'agachamento-pernas',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['afundo-bulgaro', 'cossack-squat'],
    progressoes: ['pistol-squat-caixa', 'pistolsquat'],
    variacoes: ['pistol-squat-caixa'],
    adaptacoes: {
      joelho: ['afundo-bulgaro', 'agachamento-parede'],
      'sem-equipamento': ['afundo-bulgaro']
    },
    criterioAvanco: '3x10 repetições com auxílio de apenas uma das mãos',
    sinonimos: ['assisted pistol squat', 'pistol com apoio'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Apoio das Mãos', description: 'Segure em um suporte firme ou par de argolas na altura do peito.' },
      { step: 2, title: 'Perna Estendida', description: 'Eleve uma perna reta à frente e desça na outra perna até o fundo.' },
      { step: 3, title: 'Empuxo com Pouca Assistência', description: 'Suba usando predominantemente a força da perna, usando os braços só no ponto crítico.' }
    ],
    commonMistakes: [
      { mistake: 'Puxar o corpo todo com a força dos braços', correction: 'Use as mãos apenas para segurança e equilíbrio.' }
    ]
  },
  {
    id: 'pistol-squat-caixa',
    name: 'Pistol Squat na Caixa (Box Pistol Squat)',
    category: 'Legs',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['posteriores', 'panturrilhas'],
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 60,
    description: 'Executado ficando na borda de uma caixa, o que permite que a perna livre fique pendurada sem exigir tanta flexibilidade dos isquiotibiais.',
    breathingTip: 'Inspire na descida sentando suavemente na caixa; expire subindo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não desabe de peso sobre a caixa ao sentar.'],
    padrao: 'agachamento-pernas',
    equipamento: ['banco'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['afundo-bulgaro', 'pistol-squat-assistido'],
    progressoes: ['pistolsquat'],
    variacoes: ['pistol-squat-assistido'],
    adaptacoes: {
      joelho: ['afundo-bulgaro'],
      'sem-equipamento': ['pistol-squat-assistido']
    },
    criterioAvanco: '3x10 repetições em caixa na altura do joelho sem relaxar ao tocar',
    sinonimos: ['box pistol squat', 'pistol squat no banco'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Posição na Borda', description: 'Fique na borda de um banco ou caixa com uma perna suspensa ao lado.' },
      { step: 2, title: 'Descida Controlada', description: 'Agache na perna de apoio até a coxa atingir o paralelo ou o quadril tocar o banco.' },
      { step: 3, title: 'Subida Dinâmica', description: 'Empurre pelo calcanhar e estenda a perna sem descansar o peso no assento.' }
    ],
    commonMistakes: [
      { mistake: 'Sentar e relaxar os músculos no banco', correction: 'Apenas toque o assento suavemente e reverta imediatamente o movimento.' }
    ]
  },
  {
    id: 'pistolsquat',
    name: 'Pistol Squat Livre (Agachamento Pistola)',
    category: 'Legs',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['panturrilhas', 'abdomen', 'posteriores'],
    defaultSets: 3,
    defaultReps: 6,
    defaultRestSeconds: 90,
    description: 'O padrão ouro de força e controle unilateral na calistenia. Agachamento completo até o calcanhar em uma perna com a outra reta à frente.',
    breathingTip: 'Inspire na descida com abdômen rígido; solte o ar explodindo na subida.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha o calcanhar cravado no solo durante todo o movimento.'],
    padrao: 'agachamento-pernas',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['pistol-squat-assistido', 'pistol-squat-caixa'],
    progressoes: ['shrimp-squat'],
    variacoes: ['pistol-squat-assistido'],
    adaptacoes: {
      joelho: ['afundo-bulgaro', 'agachamento-pausa'],
      tornozelo: ['pistol-squat-caixa']
    },
    criterioAvanco: '3x8 repetições perfeitas por perna sem perda de equilíbrio',
    sinonimos: ['agachamento pistola', 'single leg squat livre'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Postura em Uma Perna', description: 'Fique em pé sobre uma perna e estenda a outra à frente paralela ao solo.' },
      { step: 2, title: 'Agachamento Profundo', description: 'Desça o quadril até a parte de trás da coxa encostar na panturrilha.' },
      { step: 3, title: 'Subida sem Desvio', description: 'Empurre o solo com força total pelo calcanhar mantendo a perna suspensa no ar.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar a perna da frente cair e tocar o chão', correction: 'Trabalhe a flexibilidade de isquiotibiais e força de flexores do quadril.' }
    ]
  },
  {
    id: 'shrimp-squat',
    name: 'Shrimp Squat (Agachamento Camarão)',
    category: 'Legs',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['posteriores', 'panturrilhas'],
    defaultSets: 3,
    defaultReps: 6,
    defaultRestSeconds: 90,
    description: 'Variação unilateral onde a perna livre é segurada para trás pela mão. Exige tremenda força de quadríceps em cadeia aberta e controle do joelho.',
    breathingTip: 'Inspire descendo o joelho livre até o solo; expire subindo com precisão.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Toque o joelho de trás no chão com extrema delicadeza; use um colchonete.'],
    padrao: 'agachamento-pernas',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['afundo-bulgaro', 'pistol-squat-assistido'],
    progressoes: ['pistolsquat'],
    variacoes: ['pistolsquat'],
    adaptacoes: {
      joelho: ['afundo-bulgaro', 'agachamento-parede']
    },
    criterioAvanco: '3x6 repetições segurando o pé com ambas as mãos (versão estrita)',
    sinonimos: ['agachamento camarão', 'skater squat avançado'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Segurar o Pé', description: 'Fique em uma perna e segure o tornozelo da perna de trás com a mão do mesmo lado.' },
      { step: 2, title: 'Descida Precisa', description: 'Agache flexionando a perna de apoio até o joelho traseiro tocar de leve o solo.' },
      { step: 3, title: 'Subida sem Impulso', description: 'Empurre com a coxa dianteira voltando à postura ereta sem apoiar os dedos de trás.' }
    ],
    commonMistakes: [
      { mistake: 'Bater o joelho traseiro no chão ou empurrar com os dedos do pé traseiro', correction: 'Toque como uma pena usando uma almofada acolchoada.' }
    ]
  }
];

