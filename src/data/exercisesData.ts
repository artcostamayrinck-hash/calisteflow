import type { Exercise } from '../types';

export const EXERCISES_DATABASE: Exercise[] = [
  {
    id: 'pushup',
    name: 'Flexão de Braços Tradicional',
    category: 'Push',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['peito', 'triceps'],
    secondaryMuscles: ['ombros', 'abdomen'],
    defaultSets: 4,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'O exercício fundamental de empurrar na calistenia, fortalecendo peitorais, tríceps e estabilidade de tronco.',
    breathingTip: 'Inspire ao descer controladamente; expire ao empurrar o solo para cima.',
    animationType: 'pushup',
    executionSteps: [
      {
        step: 1,
        title: 'Posição Inicial',
        description: 'Mãos no chão na largura dos ombros, punhos alinhados com o peito. Corpo em linha reta da cabeça aos calcanhares com glúteos contraídos.'
      },
      {
        step: 2,
        title: 'Fase Excêntrica (Descida)',
        description: 'Desça o peito em direção ao solo mantendo os cotovelos em um ângulo de aproximadamente 45° em relação ao tronco (formato de flecha, nunca 90°).'
      },
      {
        step: 3,
        title: 'Ponto Mais Baixo',
        description: 'Desça até o peitoral ficar a cerca de 2 a 3 cm do chão, mantendo as escápulas aduzidas (fechadas).'
      },
      {
        step: 4,
        title: 'Fase Concêntrica (Subida)',
        description: 'Empurre o chão com força total até estender os cotovelos e realize a pró-tração escapular no topo (afaste as escápulas).'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Quadril caído ou muito elevado',
        correction: 'Mantenha o core e os glúteos firmemente travados como em uma prancha.'
      },
      {
        mistake: 'Cotovelos muito abertos a 90° (formato T)',
        correction: 'Mantenha os cotovelos a 45° para proteger os ombros de impacto e sobrecarga.'
      },
      {
        mistake: 'Amplitude incompleta',
        correction: 'Desça até encostar o peito perto do chão e estenda quase totalmente no topo.'
      }
    ]
  },
  {
    id: 'diamond_pushup',
    name: 'Flexão Diamante',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['triceps', 'peito'],
    secondaryMuscles: ['ombros', 'abdomen'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 75,
    description: 'Variação avançada com base fechada que prioriza intensamente a cabeça lateral e medial do tríceps.',
    breathingTip: 'Inspire na descida lenta; expire ao explodir na extensão dos braços.',
    animationType: 'pushup',
    executionSteps: [
      {
        step: 1,
        title: 'Posicionamento das Mãos',
        description: 'Junte os polegares e indicadores sob o esterno, desenhando um formato de triângulo ou diamante no chão.'
      },
      {
        step: 2,
        title: 'Descida Controlada',
        description: 'Flexione os cotovelos mantendo-os próximos ao tronco até tocar suavemente as mãos no centro do peitoral.'
      },
      {
        step: 3,
        title: 'Empurre com Tríceps',
        description: 'Concentre a pressão na palma das mãos para esticar os braços sem deixar o quadril perder o alinhamento.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Dor nos punhos por rigidez articular',
        correction: 'Afaste ligeiramente os dedos se faltar mobilidade de punho, ou faça no solo com apoio de parallettes.'
      },
      {
        mistake: 'Curvar as costas na subida',
        correction: 'Aperte o abdômen para impedir que o peito suba antes do quadril.'
      }
    ]
  },
  {
    id: 'dips',
    name: 'Mergulho nas Paralelas (Dips)',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['triceps', 'peito', 'ombros'],
    secondaryMuscles: ['abdomen', 'lombar'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 90,
    description: 'O rei dos exercícios de peito inferior e tríceps com peso corporal, desenvolvendo força bruta no plano vertical.',
    breathingTip: 'Inspire na descida flexionando cotovelos; expire fortemente ao empurrar até a extensão dos braços.',
    animationType: 'dip',
    executionSteps: [
      {
        step: 1,
        title: 'Suporte no Topo',
        description: 'Suba nas barras paralelas com braços esticados, ombros deprimidos (longe das orelhas) e olhar à frente.'
      },
      {
        step: 2,
        title: 'Descida com Inclinação',
        description: 'Incline ligeiramente o tronco para a frente e dobre os cotovelos para trás até atingir pelo menos 90 graus de flexão.'
      },
      {
        step: 3,
        title: 'Ponto de Virada',
        description: 'Sinta o alongamento no peitoral e ombros de forma controlada sem deixar os ombros colapsarem para dentro.'
      },
      {
        step: 4,
        title: 'Bloqueio no Topo',
        description: 'Pressione com firmeza para voltar ao topo, mantendo os ombros baixos e as pernas estáveis.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Elevar os ombros na orelha (falta de depressão escapular)',
        correction: 'Empurre ativamente as barras para baixo, mantendo o pescoço longo o tempo todo.'
      },
      {
        mistake: 'Balançar o corpo ou chutar com as pernas',
        correction: 'Trave os joelhos cruzados e o abdômen contraído para movimento 100% estrito.'
      }
    ]
  },
  {
    id: 'pullup',
    name: 'Barra Fixa Pronada (Pull-up)',
    category: 'Pull',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['costas', 'biceps'],
    secondaryMuscles: ['ombros', 'antebraco', 'abdomen'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 90,
    description: 'Exercício essencial para costas em V, grande dorsal e bíceps. Exige controle de tração vertical completa.',
    breathingTip: 'Inspire enquanto está suspenso; expire enquanto puxa seu corpo acima da barra.',
    animationType: 'pullup',
    executionSteps: [
      {
        step: 1,
        title: 'Pegada Pronada',
        description: 'Segure a barra com palmas viradas para a frente, pegada ligeiramente mais larga que a largura dos ombros.'
      },
      {
        step: 2,
        title: 'Ativação Escapular (Dead Hang para Active Hang)',
        description: 'Antes de dobrar os braços, puxe as escápulas para baixo e para trás, ativando as costas.'
      },
      {
        step: 3,
        title: 'Puxada Potente',
        description: 'Conduza os cotovelos em direção aos bolsos da calça até o queixo passar completamente por cima da barra.'
      },
      {
        step: 4,
        title: 'Descida Controlada',
        description: 'Desça de forma suave até estender completamente os braços antes de iniciar a próxima repetição.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Kipping (impulsionar com as pernas)',
        correction: 'Mantenha as pernas levemente à frente em hollow body sem impulsos bruscos.'
      },
      {
        mistake: 'Queixo esticado para alcançar a barra sem subir o peito',
        correction: 'Puxe o peito em direção à barra, mantendo o pescoço neutro.'
      }
    ]
  },
  {
    id: 'chinup',
    name: 'Barra Fixa Supinada (Chin-up)',
    category: 'Pull',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['biceps', 'costas'],
    secondaryMuscles: ['antebraco', 'abdomen'],
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 75,
    description: 'Variação com pegada invertida que coloca enorme ênfase no pico dos bíceps e grande dorsal.',
    breathingTip: 'Puxe expirando vigorosamente; desça inspirando com ritmo cadenciado.',
    animationType: 'pullup',
    executionSteps: [
      {
        step: 1,
        title: 'Pegada Supinada',
        description: 'Segure a barra com palmas voltadas para você, largura exatamente igual à dos ombros.'
      },
      {
        step: 2,
        title: 'Tracionamento',
        description: 'Puxe o corpo para cima flexionando os cotovelos e contraindo os bíceps até o queixo cruzar a barra.'
      },
      {
        step: 3,
        title: 'Extensão Total',
        description: 'Retorne à posição suspensa inicial esticando completamente os cotovelos.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Meia repetição sem esticar os braços embaixo',
        correction: 'Aproveite a máxima amplitude muscular iniciando do braço 100% estendido.'
      }
    ]
  },
  {
    id: 'australian_pullup',
    name: 'Remada Australiana (Inverted Row)',
    category: 'Pull',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['costas', 'antebraco'],
    secondaryMuscles: ['biceps', 'ombros', 'abdomen'],
    defaultSets: 4,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Puxada horizontal excelente para construir densidade nas costas, romboides e postura ereta.',
    breathingTip: 'Puxe soltando o ar; estenda os braços puxando o ar.',
    animationType: 'australianpullup',
    executionSteps: [
      {
        step: 1,
        title: 'Ajuste da Barra Baixa',
        description: 'Posicione-se sob uma barra na altura do quadril, calcanhares apoiados no chão e corpo em prancha diagonal.'
      },
      {
        step: 2,
        title: 'Puxada ao Peito',
        description: 'Puxe o peitoral até tocar na barra espremendo as escápulas no final do movimento.'
      },
      {
        step: 3,
        title: 'Descida Resistida',
        description: 'Retorne à posição de braços estendidos sem soltar a tensão nas costas.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Deixar o quadril cair',
        correction: 'Mantenha glúteos e abdômen contraídos em linha reta perfeita.'
      }
    ]
  },
  {
    id: 'pike_pushup',
    name: 'Flexão Pike para Ombros',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['ombros', 'triceps'],
    secondaryMuscles: ['costas', 'abdomen'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 75,
    description: 'Desenvolve força overhead e hipertrofia de deltoides, servindo de base para flexões na parada de mão.',
    breathingTip: 'Inspire enquanto inclina a cabeça para a frente e para baixo; expire ao empurrar.',
    animationType: 'pikepushup',
    executionSteps: [
      {
        step: 1,
        title: 'Posição em V Invertido',
        description: 'Pés e mãos no chão, quadril elevado no ar formando um "V" de cabeça para baixo. Mãos na largura dos ombros.'
      },
      {
        step: 2,
        title: 'Descida em Tripé',
        description: 'Desça a cabeça projetando-a ligeiramente à frente das mãos (formando um triângulo com os apoios).'
      },
      {
        step: 3,
        title: 'Empurrada Vertical',
        description: 'Pressione com os deltoides para empurrar a cabeça de volta entre os braços na posição final de lockout.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Cotovelos abrindo para os lados',
        correction: 'Mantenha os cotovelos apontando para trás e para dentro ao longo da descida.'
      }
    ]
  },
  {
    id: 'handstand_hold',
    name: 'Parada de Mão na Parede (Wall Handstand)',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: ['ombros', 'lombar', 'abdomen'],
    secondaryMuscles: ['triceps', 'antebraco', 'costas'],
    defaultSets: 3,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 90,
    description: 'Postura isométrica pura de elevação, desenvolvendo força nos deltoides, estabilidade escapular e equilíbrio.',
    breathingTip: 'Respire de forma curta e controlada pelo diafragma sem soltar a pressão abdominal.',
    animationType: 'handstand',
    executionSteps: [
      {
        step: 1,
        title: 'Entrada na Parede',
        description: 'Posicione as mãos a 15-20 cm da parede. Suba as pernas ou caminhe de ré na parede ficando de frente para ela.'
      },
      {
        step: 2,
        title: 'Elevação Escapular Ativa',
        description: 'Empurre o chão com os ombros cobrindo as orelhas (pró-tração e elevação total).'
      },
      {
        step: 3,
        title: 'Alinhamento em Linha Reta',
        description: 'Aperte pernas, aponte os pés para cima (pontas de bailarina) e elimine a curvatura da lombar.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Costas em formato de banana (hiperextensão)',
        correction: 'Aperte os glúteos e puxe as costelas para dentro (tuck lombar).'
      }
    ]
  },
  {
    id: 'squat',
    name: 'Agachamento Livre (Air Squat)',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['posteriores', 'panturrilhas', 'abdomen'],
    defaultSets: 4,
    defaultReps: 20,
    defaultRestSeconds: 60,
    description: 'Padrão motor primário de membros inferiores para construir coxas fortes, mobilidade de quadril e glúteos.',
    breathingTip: 'Inspire ao afundar o quadril; expire subindo pressionando calcanhares e mediopé.',
    animationType: 'squat',
    executionSteps: [
      {
        step: 1,
        title: 'Base de Apoio',
        description: 'Pés na largura dos ombros, pontas dos pés levemente apontadas para fora (15 a 30 graus).'
      },
      {
        step: 2,
        title: 'Descida com Joelhos Alinhados',
        description: 'Agache empurrando os joelhos na direção da ponta dos pés e descendo o quadril abaixo da linha dos joelhos.'
      },
      {
        step: 3,
        title: 'Subida e Extensão',
        description: 'Mantenha o peito aberto e suba empurrando o chão de forma firme até a extensão total dos quadris.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Joelhos colapsando para dentro (valgo dinâmico)',
        correction: 'Pense em "abrir o chão" com os pés e mantenha os joelhos sempre para fora.'
      },
      {
        mistake: 'Tirar os calcanhares do solo',
        correction: 'Distribua o peso no tripé do pé (calcanhar, base do dedão e base do dedinho).'
      }
    ]
  },
  {
    id: 'lunges',
    name: 'Passadas / Afundo Dinâmico',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['posteriores', 'panturrilhas'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Trabalho unilateral fundamental para correção de assimetrias, equilíbrio e força nas pernas.',
    breathingTip: 'Inspire no avanço do passo; expire ao retornar à posição ereta.',
    animationType: 'lunges',
    executionSteps: [
      {
        step: 1,
        title: 'Passo Amplo à Frente',
        description: 'Dê um passo longo e desça o joelho de trás até quase encostar no chão em um ângulo de 90°.'
      },
      {
        step: 2,
        title: 'Estabilidade do Joelho Frontal',
        description: 'O joelho da frente deve ficar sobre o tornozelo, sem oscilar para os lados.'
      },
      {
        step: 3,
        title: 'Retorno Potente',
        description: 'Empurre com a perna da frente de volta à posição inicial e alterne o lado.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Passo muito curto sobrecarregando a patela',
        correction: 'Dê um passo mais longo garantindo que o joelho forme ângulo reto de 90 graus.'
      }
    ]
  },
  {
    id: 'plank',
    name: 'Prancha Abdominal Isométrica',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['abdomen', 'lombar'],
    secondaryMuscles: ['gluteos', 'ombros'],
    defaultSets: 3,
    defaultHoldSeconds: 45,
    defaultRestSeconds: 45,
    description: 'O alicerce da estabilidade do tronco, criando uma couraça abdominal rígida contra forças rotacionais.',
    breathingTip: 'Mantenha respiração ritmada pelas costelas mantendo o umbigo sugado em direção à coluna.',
    animationType: 'plank',
    executionSteps: [
      {
        step: 1,
        title: 'Apoio nos Antebraços',
        description: 'Cotovelos alinhados sob os ombros no chão, antebraços paralelos.'
      },
      {
        step: 2,
        title: 'Bloqueio do Core e Glúteos',
        description: 'Corpo perfeitamente reto, aperte os glúteos com força e mantenha as pernas unidas.'
      },
      {
        step: 3,
        title: 'Sustentação Rígida',
        description: 'Evite que o quadril caia em direção ao solo ou suba formando uma pirâmide.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Deixar a lombar arquear para baixo',
        correction: 'Gire o quadril para trás (retroversão pélvica) e mantenha os abdominais ativos.'
      }
    ]
  },
  {
    id: 'lsit',
    name: 'L-Sit nas Paralelas ou Solo',
    category: 'Core',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: ['abdomen', 'triceps'],
    secondaryMuscles: ['quadriceps', 'ombros', 'lombar'],
    defaultSets: 3,
    defaultHoldSeconds: 20,
    defaultRestSeconds: 75,
    description: 'Movimento ginástico de alto nível que combina compressão abdominal ativa com força de tríceps em lockout.',
    breathingTip: 'Expirações curtas e controladas, sustentando a pressão intra-abdominal.',
    animationType: 'lsit',
    executionSteps: [
      {
        step: 1,
        title: 'Empurrão com Braços Estendidos',
        description: 'Apoie as mãos nas barras ou solo e empurre para cima travando totalmente os cotovelos.'
      },
      {
        step: 2,
        title: 'Elevação das Pernas a 90°',
        description: 'Erga as duas pernas juntas paralelas ao solo, joelhos completamente esticados e pés apontados.'
      },
      {
        step: 3,
        title: 'Compressão Máxima',
        description: 'Puxe as coxas em direção ao peitoral usando os flexores de quadril e reto femoral.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Dobrar os joelhos por falta de flexibilidade',
        correction: 'Faça a variação Tuck L-Sit (joelhos dobrados) até adquirir compressão necessária.'
      }
    ]
  },
  {
    id: 'hollow_body',
    name: 'Hollow Body Hold (Canoa)',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['quadriceps', 'lombar', 'ombros'],
    defaultSets: 3,
    defaultHoldSeconds: 40,
    defaultRestSeconds: 60,
    description: 'A postura ginástica mais importante da calistenia, criando a base para muscle-ups, handstands e alavancas.',
    breathingTip: 'Pequenas respirações superficiais sem jamais deixar a coluna lombar descolar do piso.',
    animationType: 'hollowbody',
    executionSteps: [
      {
        step: 1,
        title: 'Acomodação no Chão',
        description: 'Deite-se de costas, pressione a região lombar com força contra o chão eliminando qualquer espaço.'
      },
      {
        step: 2,
        title: 'Extensão em Alavanca',
        description: 'Estique os braços para trás colados às orelhas e eleve as pernas alguns centímetros do chão.'
      },
      {
        step: 3,
        title: 'Formato de Canoa',
        description: 'Eleve as escápulas do chão mantendo o queixo recolhido e pernas estendidas e unidas.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Lombar descolando do chão',
        correction: 'Se a lombar sair do chão, levante as pernas um pouco mais alto ou dobre levemente os joelhos.'
      }
    ]
  },
  {
    id: 'muscleup',
    name: 'Bar Muscle-up',
    category: 'Skill',
    difficulty: 'Elite',
    type: 'reps',
    primaryMuscles: ['costas', 'peito', 'triceps', 'ombros'],
    secondaryMuscles: ['abdomen', 'antebraco'],
    defaultSets: 3,
    defaultReps: 4,
    defaultRestSeconds: 120,
    description: 'A transição suprema da calistenia: puxada explosiva alta combinada com transição e mergulho sobre a barra.',
    breathingTip: 'Inspire no balanço; solte o ar na puxada explosiva e transição sobre a barra.',
    animationType: 'muscleup',
    executionSteps: [
      {
        step: 1,
        title: 'Puxada Explosiva ao Esterno',
        description: 'Inicie a subida com força máxima visando levar a barra até a altura da boca do estômago.'
      },
      {
        step: 2,
        title: 'Transição Escapular Rápida',
        description: 'Jogue os cotovelos para cima e para a frente sobre a barra de maneira coordenada e rápida.'
      },
      {
        step: 3,
        title: 'Lockout Final',
        description: 'Empurre a barra para baixo como num mergulho até os braços ficarem totalmente esticados.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Subir um braço de cada vez (frango/winging)',
        correction: 'Evite lesões de ombro subindo ambos os cotovelos simultaneamente.'
      }
    ]
  },
  {
    id: 'front_lever',
    name: 'Front Lever Hold',
    category: 'Skill',
    difficulty: 'Elite',
    type: 'isometric',
    primaryMuscles: ['costas', 'abdomen', 'antebraco'],
    secondaryMuscles: ['ombros', 'gluteos', 'lombar'],
    defaultSets: 4,
    defaultHoldSeconds: 15,
    defaultRestSeconds: 90,
    description: 'Movimento estático lendário da calistenia onde o corpo é suspenso horizontalmente paralelo ao solo.',
    breathingTip: 'Expirações curtas e controladas, mantendo o abdômen e grande dorsal sob tensão contínua.',
    animationType: 'frontlever',
    executionSteps: [
      {
        step: 1,
        title: 'Depressão e Retração Escapular',
        description: 'Puxe as escápulas fortemente para baixo e para trás antes de iniciar a alavanca horizontal.'
      },
      {
        step: 2,
        title: 'Alinhamento Horizontal Reto',
        description: 'Mantenha braços 100% esticados empurrando a barra para baixo, corpo alinhado da cabeça aos pés.'
      },
      {
        step: 3,
        title: 'Trava de Glúteo e Pélvis',
        description: 'Aperte os glúteos e aponte os pés para manter o corpo em uma prancha perfeitamente reta no ar.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Dobrar os cotovelos',
        correction: 'O front lever exige braços completamente retos com força nos dorsais e tríceps cabeça longa.'
      },
      {
        mistake: 'Quadril caído ou curvado em V',
        correction: 'Inicie com a variação Tuck ou Advanced Tuck antes do Front Lever completo.'
      }
    ]
  },
  {
    id: 'planche_lean',
    name: 'Planche Lean (Inclinação de Planche)',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: ['ombros', 'abdomen', 'antebraco'],
    secondaryMuscles: ['peito', 'lombar'],
    defaultSets: 4,
    defaultHoldSeconds: 25,
    defaultRestSeconds: 75,
    description: 'Exercício fundamental de condicionamento dos ombros e tendões do bíceps para a planche completa.',
    breathingTip: 'Respire pelo tórax mantendo a protração escapular máxima o tempo todo.',
    animationType: 'planche',
    executionSteps: [
      {
        step: 1,
        title: 'Base de Prancha com Protração',
        description: 'Mãos no solo ligeiramente viradas para fora. Empurre o chão afastando as escápulas no topo.'
      },
      {
        step: 2,
        title: 'Projeção Anterior do Peso',
        description: 'Incline os ombros significativamente à frente da linha dos punhos mantendo os braços estendidos.'
      },
      {
        step: 3,
        title: 'Sustentação na Ponta dos Pés',
        description: 'Fique na ponta dos dedos dos pés, sentindo o peso corporal inteiro recair sobre os ombros e punhos.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Retração escapular (escápulas afundadas)',
        correction: 'Mantenha a protração máxima (costas arredondadas e peito empurrado para cima).'
      }
    ]
  },
  {
    id: 'pistol_squat',
    name: 'Pistol Squat (Agachamento Unilateral)',
    category: 'Legs',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['quadriceps', 'gluteos'],
    secondaryMuscles: ['panturrilhas', 'abdomen', 'posteriores'],
    defaultSets: 3,
    defaultReps: 6,
    defaultRestSeconds: 75,
    description: 'O padrão ouro de força unilateral nas pernas, exigindo flexibilidade, estabilidade de tornozelo e potência pura.',
    breathingTip: 'Inspire na descida lenta; expire ao subir pressionando o calcanhar com força no solo.',
    animationType: 'pistolsquat',
    executionSteps: [
      {
        step: 1,
        title: 'Equilíbrio em Uma Perna',
        description: 'Fique sobre uma perna e estenda a outra totalmente à frente, paralela ao solo.'
      },
      {
        step: 2,
        title: 'Descida Profunda com Controle',
        description: 'Flexione o joelho e quadril descendo até o glúteo encostar no calcanhar sem apoiar a perna estendida.'
      },
      {
        step: 3,
        title: 'Extensão Concêntrica Explosiva',
        description: 'Empurre pelo mediopé e calcanhar até estender totalmente a perna de apoio.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Calcanhar descolando do solo',
        correction: 'Trabalhe a mobilidade de dorsiflexão do tornozelo ou use uma pequena elevação sob o calcanhar.'
      }
    ]
  }
];

export const MUSCLE_LABELS: Record<string, string> = {
  peito: 'Peitoral',
  costas: 'Costas / Dorsais',
  ombros: 'Deltoides / Ombros',
  triceps: 'Tríceps',
  biceps: 'Bíceps',
  abdomen: 'Abdômen / Core',
  lombar: 'Lombar',
  quadriceps: 'Quadríceps',
  posteriores: 'Isquiotibiais',
  gluteos: 'Glúteos',
  panturrilhas: 'Panturrilhas',
  antebraco: 'Antebraços'
};
