import type { Exercise } from '../../types';
import { CREF_REVIEWER_SPECIALIST } from './reviewer';

export const PULL_HORIZONTAL_EXERCISES: Exercise[] = [
  {
    id: 'remada-invertida-joelhos',
    name: 'Remada Invertida com Joelhos Dobrados',
    category: 'Pull',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['antebraco', 'abdomen'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Com pés no chão e joelhos a 90°, diminui o peso sustentado, facilitando o aprendizado da retração escapular e força de puxada.',
    breathingTip: 'Expire puxando o peito em direção à barra; inspire descendo suavemente.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Certifique-se de que a barra ou apoio suporte seu peso com total firmeza.'],
    padrao: 'puxar-horizontal',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['remada-porta-toalha'],
    progressoes: ['australianpullup', 'australianpullup'],
    variacoes: ['remada-porta-toalha'],
    adaptacoes: {
      ombro: ['remada-invertida-joelhos'],
      punho: ['remada-argolas'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x12 repetições com peito tocando a barra',
    sinonimos: ['knee australian pullup', 'remada australiana fácil'],
    animationType: 'australianpullup',
    executionSteps: [
      { step: 1, title: 'Posição dos Pés', description: 'Deite sob uma barra baixa, segure com pegada pronada e dobre os joelhos a 90° com pés no chão.' },
      { step: 2, title: 'Elevação da Pelve', description: 'Mantenha o quadril alto em linha com as coxas e tronco.' },
      { step: 3, title: 'Puxada', description: 'Puxe o esterno até tocar a barra juntando as escápulas atrás.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar o quadril cair como um peso morto', correction: 'Contraia os glúteos e mantenha a pelve alta.' }
    ]
  },
  {
    id: 'australianpullup',
    name: 'Remada Australiana (Remada Invertida Tradicional)',
    category: 'Pull',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['ombros', 'antebraco', 'abdomen'],
    defaultSets: 4,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Pernas esticadas com calcanhares no solo e corpo em prancha diagonal rígida. Constrói espessura dorsal e romboides.',
    breathingTip: 'Expire ao puxar a barra no peito; inspire estendendo os braços.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: [
      'Pare imediatamente caso sinta dor aguda no manguito rotador.',
      'Não deixe o quadril desabar; mantenha linha reta dos tornozelos à cabeça.'
    ],
    padrao: 'puxar-horizontal',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['remada-invertida-joelhos', 'remada-porta-toalha'],
    progressoes: ['remada-invertida-pes-elevados', 'remada-argolas'],
    variacoes: ['remada-invertida-supinada'],
    adaptacoes: {
      ombro: ['remada-invertida-joelhos'],
      punho: ['remada-argolas'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x12 repetições com pausa de 1s no topo',
    sinonimos: ['australianpullup', 'australian pullup', 'remada invertida', 'remada australiana', 'australianpullup'],
    animationType: 'australianpullup',
    executionSteps: [
      { step: 1, title: 'Prancha Invertida', description: 'Suspenda-se sob a barra com pernas esticadas e calcanhares firmes no solo.' },
      { step: 2, title: 'Retração Escapular', description: 'Inicie puxando as escápulas para trás e tracionando o peitoral até a barra.' },
      { step: 3, title: 'Retorno Excêntrico', description: 'Retorne suavemente até estender os cotovelos sem soltar os glúteos.' }
    ],
    commonMistakes: [
      { mistake: 'Hiperestender o pescoço para a frente', correction: 'Mantenha o queixo alinhado com o peito e nuca neutra.' }
    ]
  },
  {
    id: 'remada-porta-toalha',
    name: 'Remada com Toalha na Porta',
    category: 'Pull',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['antebraco', 'abdomen'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Solução caseira sem barra: passe uma toalha resistente pelas maçanetas com a porta fechada e travada, puxando o corpo inclinado.',
    breathingTip: 'Expire ao aproximar o peitoral da porta; inspire ao estender os braços.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: [
      'REGRA DE SEGURANÇA: Certifique-se de que a porta fecha no sentido CONTRÁRIO à puxada (para que seu peso a feche, nunca a abra).',
      'Verifique a firmeza das maçanetas antes de se inclinar.'
    ],
    padrao: 'puxar-horizontal',
    equipamento: ['toalha'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['flexao-parede'],
    progressoes: ['australianpullup'],
    variacoes: ['remada-invertida-joelhos'],
    adaptacoes: {
      ombro: ['remada-porta-toalha'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x15 repetições com boa inclinação',
    sinonimos: ['door towel row', 'remada na porta', 'remada caseira'],
    animationType: 'australianpullup',
    executionSteps: [
      { step: 1, title: 'Fixação da Toalha', description: 'Prenda a toalha firmemente ou passe ao redor da maçaneta de uma porta trancada.' },
      { step: 2, title: 'Inclinação', description: 'Segure as pontas da toalha, coloque os pés próximos à base da porta e incline o corpo para trás.' },
      { step: 3, title: 'Puxada', description: 'Puxe o peitoral em direção à porta contraindo o meio das costas.' }
    ],
    commonMistakes: [
      { mistake: 'Usar porta com trinco solto', correction: 'Teste o peso com calma antes de inclinar todo o corpo.' }
    ]
  },
  {
    id: 'remada-invertida-pes-elevados',
    name: 'Remada Invertida com Pés Elevados',
    category: 'Pull',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['ombros', 'abdomen', 'lombar'],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSeconds: 75,
    description: 'Com os calcanhares sobre um banco na altura da barra, o corpo fica 100% horizontal, exigindo maior sobrecarga dorsal.',
    breathingTip: 'Expire ao puxar; inspire descendo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha o core rígido para a coluna não arquear para baixo.'],
    padrao: 'puxar-horizontal',
    equipamento: ['barra', 'banco'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['australianpullup'],
    progressoes: ['remada-argolas', 'front-lever-row'],
    variacoes: ['australianpullup'],
    adaptacoes: {
      ombro: ['australianpullup'],
      punho: ['remada-argolas'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x10 repetições tocando a barra no peito',
    sinonimos: ['elevated australian pullup', 'remada pés no banco'],
    animationType: 'australianpullup',
    executionSteps: [
      { step: 1, title: 'Posição Horizontal', description: 'Pés apoiados em um banco de 40 cm e mãos na barra com corpo paralelo ao solo.' },
      { step: 2, title: 'Puxada Estrita', description: 'Puxe o esterno até a barra sem flexionar os quadris.' },
      { step: 3, title: 'Extensão', description: 'Desça em 2 segundos estendendo os braços por completo.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar a barriga cair em arco', correction: 'Ative glúteos e abdômen formando uma tábua plana.' }
    ]
  },
  {
    id: 'remada-invertida-supinada',
    name: 'Remada Invertida com Pegada Supinada',
    category: 'Pull',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['biceps', 'costas'],
    secondaryMuscles: ['antebraco', 'abdomen'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Palmas voltadas para trás. Aumenta a ativação dos flexores do cotovelo (bíceps) com excelente recrutamento do grande dorsal.',
    breathingTip: 'Expire puxando o peito; inspire no retorno.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Se sentir pinçamento no punho, passe para a pegada neutra em argolas.'],
    padrao: 'puxar-horizontal',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['remada-invertida-joelhos'],
    progressoes: ['australianpullup', 'pullup'],
    variacoes: ['australianpullup'],
    adaptacoes: {
      cotovelo: ['remada-argolas'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x12 repetições com boa técnica',
    sinonimos: ['supinated australian pullup', 'remada supinada'],
    animationType: 'australianpullup',
    executionSteps: [
      { step: 1, title: 'Pegada Supinada', description: 'Segure a barra baixa com as palmas voltadas para você.' },
      { step: 2, title: 'Puxada Forte', description: 'Puxe até o peito encostar na barra contraindo bíceps e costas.' },
      { step: 3, title: 'Descida', description: 'Desça com cadência controlada.' }
    ],
    commonMistakes: [
      { mistake: 'Soltar os cotovelos para os lados', correction: 'Mantenha os cotovelos alinhados e rentes ao tronco.' }
    ]
  },
  {
    id: 'remada-argolas',
    name: 'Remada Invertida nas Argolas (com Rotação)',
    category: 'Pull',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['ombros', 'abdomen', 'antebraco'],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSeconds: 75,
    description: 'A liberdade das argolas permite iniciar em pronação e terminar em supinação, respeitando a rotação natural do antebraço e ombro.',
    breathingTip: 'Expire ao puxar e rotacionar as mãos; inspire ao estender os braços.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Excelente para quem tem tendinite de cotovelo ou dor no ombro por permitir rotação livre.'],
    padrao: 'puxar-horizontal',
    equipamento: ['argolas'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['australianpullup'],
    progressoes: ['remada-arqueiro', 'front-lever-row'],
    variacoes: ['australianpullup'],
    adaptacoes: {
      cotovelo: ['remada-argolas'],
      ombro: ['remada-argolas'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x12 repetições com rotação completa',
    sinonimos: ['ring row', 'remada nas argolas'],
    animationType: 'australianpullup',
    executionSteps: [
      { step: 1, title: 'Início Pronado', description: 'Segure as argolas com palmas para a frente e corpo inclinado em prancha.' },
      { step: 2, title: 'Puxada e Rotação', description: 'Puxe o peito entre as argolas girando as mãos para pegada neutra ou supinada.' },
      { step: 3, title: 'Aperto Escapular', description: 'Segure 1 segundo no pico de contração antes de estender os braços.' }
    ],
    commonMistakes: [
      { mistake: 'Perder a tensão nas alças das argolas', correction: 'Mantenha a fita sempre tensionada com força constante.' }
    ]
  },
  {
    id: 'remada-arqueiro',
    name: 'Remada Arqueiro (Archer Row)',
    category: 'Pull',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['abdomen', 'antebraco'],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSeconds: 90,
    description: 'Puxada horizontal assimétrica: um braço traciona quase todo o peso corporal enquanto o outro estende como guia lateral.',
    breathingTip: 'Expire puxando para o lado; inspire descendo ao centro.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Gire a palma da mão que estende para não forçar a cápsula articular.'],
    padrao: 'puxar-horizontal',
    equipamento: ['barra', 'argolas'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['remada-argolas', 'remada-invertida-pes-elevados'],
    progressoes: ['remada-unilateral', 'front-lever-row'],
    variacoes: ['remada-argolas'],
    adaptacoes: {
      cotovelo: ['remada-argolas'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x6 repetições de cada lado',
    sinonimos: ['archer row', 'remada australiana arqueiro'],
    animationType: 'australianpullup',
    executionSteps: [
      { step: 1, title: 'Pegada Larga', description: 'Segure a barra com pegada bem aberta e pernas estendidas.' },
      { step: 2, title: 'Tração Lateral', description: 'Puxe o peitoral sobre a mão direita estendendo o braço esquerdo lateralmente.' },
      { step: 3, title: 'Controle', description: 'Retorne ao centro e alterne o lado de trabalho.' }
    ],
    commonMistakes: [
      { mistake: 'Girar os ombros desgovernadamente', correction: 'Mantenha a prancha de tronco nivelada com o solo.' }
    ]
  },
  {
    id: 'remada-unilateral',
    name: 'Remada Invertida Unilateral (One-Arm Bodyweight Row)',
    category: 'Pull',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['costas', 'biceps', 'abdomen'],
    secondaryMuscles: ['antebraco', 'gluteos'],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSeconds: 90,
    description: 'Trabalho puro com um único braço em argola ou barra baixa, gerando força dorsal e antirotação no core.',
    breathingTip: 'Prenda o ar com bracing na saída; expire puxando a mão até o peito.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Ajuste o ângulo do corpo para menos inclinado caso perca o alinhamento das costas.'],
    padrao: 'puxar-horizontal',
    equipamento: ['argolas', 'barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['remada-arqueiro'],
    progressoes: ['front-lever-row'],
    variacoes: ['remada-arqueiro'],
    adaptacoes: {
      cotovelo: ['remada-argolas'],
      lombar: ['remada-argolas'],
      'sem-equipamento': ['remada-porta-toalha']
    },
    criterioAvanco: '3x6 repetições limpas sem torcer o quadril',
    sinonimos: ['one arm row', 'remada unilateral calistenia'],
    animationType: 'australianpullup',
    executionSteps: [
      { step: 1, title: 'Uma Mão', description: 'Segure uma argola ou barra com uma mão, pés afastados e outro braço livre junto ao corpo.' },
      { step: 2, title: 'Puxada Reta', description: 'Puxe o corpo até a mão encostar ao lado da caixa torácica sem girar os ombros.' },
      { step: 3, title: 'Descida Rígida', description: 'Desça com cadência estendendo o braço sob controle.' }
    ],
    commonMistakes: [
      { mistake: 'Girar 90 graus para puxar com o ombro', correction: 'Mantenha os dois ombros apontando para o teto.' }
    ]
  },
  {
    id: 'front-lever-row',
    name: 'Remada em Front Lever (Tuck Front Lever Row)',
    category: 'Pull',
    difficulty: 'Elite',
    type: 'reps',
    primaryMuscles: ['costas', 'abdomen', 'biceps'],
    secondaryMuscles: ['ombros', 'antebraco'],
    defaultSets: 4,
    defaultReps: 5,
    defaultRestSeconds: 150,
    description: 'Puxada horizontal realizada em suspensão completa no ar em alavanca front lever, exigindo força de costas e core.',
    breathingTip: 'Prenda o ar na elevação; expire forçando a barra até os quadris.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Requer domínio prévio do Tuck Front Lever estático por 20 segundos.'],
    padrao: 'skills',
    equipamento: ['barra'],
    tipoExercicio: 'skill',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['remada-invertida-pes-elevados', 'frontlever'],
    progressoes: [],
    variacoes: ['tuck-front-lever'],
    adaptacoes: {
      lombar: ['remada-invertida-pes-elevados'],
      ombro: ['remada-argolas'],
      'sem-equipamento': ['remada-invertida-pes-elevados']
    },
    criterioAvanco: '3x5 repetições tocando a barra nos joelhos/coxas',
    sinonimos: ['front lever row', 'remada front lever'],
    animationType: 'frontlever',
    executionSteps: [
      { step: 1, title: 'Alavanca Estável', description: 'Entre em Tuck Front Lever com as costas perfeitamente paralelas ao solo.' },
      { step: 2, title: 'Puxada Explosiva', description: 'Puxe os cotovelos para trás trazendo a barra até encostar nos quadris.' },
      { step: 3, title: 'Retorno sem Cair', description: 'Estenda os braços mantendo a linha horizontal sem desabar o quadril.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar o quadril cair em ângulo vertical', correction: 'Mantenha as costas rigorosamente horizontais durante a remada.' }
    ]
  }
];
