import type { Exercise } from '../../types';
import { CREF_REVIEWER_SPECIALIST } from './reviewer';

export const STRETCH_EXERCISES: Exercise[] = [
  {
    id: 'alongamento-peitoral-parede',
    name: 'Alongamento de Peitoral na Parede ou Batente',
    category: 'Full Body',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['peito'],
    secondaryMuscles: ['ombros', 'biceps'],
    defaultSets: 2,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 15,
    description: 'Com antebraço apoiado a 90° em batente de porta, gira-se o corpo para fora abrindo o peitoral maior e deltóide anterior encurtados por empurrar.',
    breathingTip: 'Expire profundamente relaxando a musculatura peitoral.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não faça giros bruscos; alongamento deve ser suave e indolor.'],
    padrao: 'alongamento',
    fase: 'alongamento',
    equipamento: ['nenhum'],
    tipoExercicio: 'alongamento',
    estatico: true,
    cadencia: 'estático',
    regressoes: [],
    progressoes: [],
    variacoes: [],
    adaptacoes: {
      ombro: ['alongamento-peitoral-parede']
    },
    criterioAvanco: 'Manter 35 segundos relaxados com abertura peitoral confortável',
    sinonimos: ['alongamento de peito', 'doorway chest stretch'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Apoio do Cotovelo', description: 'Apoie o antebraço e cotovelo a 90° contra o batente de uma porta na altura do ombro.' },
      { step: 2, title: 'Passo à Frente', description: 'Dê um pequeno passo à frente com a perna do mesmo lado.' },
      { step: 3, title: 'Giro Suave', description: 'Gire suavemente o tronco para o lado oposto até sentir o alongamento no peito.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar o ombro subir em direção à orelha', correction: 'Puxe o ombro para baixo e para trás antes de rodar o peito.' }
    ]
  },
  {
    id: 'alongamento-dorsal-barra',
    name: 'Alongamento de Dorsal na Barra ou Suporte (Lat Stretch)',
    category: 'Full Body',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['costas'],
    secondaryMuscles: ['ombros'],
    defaultSets: 2,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 15,
    description: 'Segurando em uma barra ou mastro fixo, projeta-se o quadril para trás com o tronco curvado, estirando amplamente o grande dorsal.',
    breathingTip: 'Inspire expandindo as costelas do lado alongado.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha a pegada segura para não escorregar.'],
    padrao: 'alongamento',
    fase: 'alongamento',
    equipamento: ['barra'],
    tipoExercicio: 'alongamento',
    estatico: true,
    cadencia: 'estático',
    regressoes: [],
    progressoes: [],
    variacoes: [],
    adaptacoes: {
      'sem-equipamento': ['postura-crianca']
    },
    criterioAvanco: 'Manter 30 segundos por lado com estiramento lateral profundo',
    sinonimos: ['lat stretch', 'alongamento dorsal'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Pegada Unilateral', description: 'Segure em um suporte firme com a mão direita na altura dos olhos.' },
      { step: 2, title: 'Recuo do Quadril', description: 'Dobre os joelhos e empurre o quadril direito para trás e para longe do suporte.' },
      { step: 3, title: 'Alongamento Lateral', description: 'Deixe o peso do quadril puxar a axila e a lateral das costas.' }
    ],
    commonMistakes: [
      { mistake: 'Puxar com o braço dobrado', correction: 'Mantenha o braço estendido relaxando o cotovelo.' }
    ]
  },
  {
    id: 'alongamento-triceps-acima',
    name: 'Alongamento de Tríceps Acima da Cabeça',
    category: 'Full Body',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['ombros'],
    defaultSets: 2,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 15,
    description: 'Com a mão alcançando a escápula por trás do pescoço, a outra mão empurra suavemente o cotovelo para trás e para baixo.',
    breathingTip: 'Respire calmo sem curvar o pescoço para a frente.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não force o cotovelo se tiver dor aguda na articulação.'],
    padrao: 'alongamento',
    fase: 'alongamento',
    equipamento: ['nenhum'],
    tipoExercicio: 'alongamento',
    estatico: true,
    cadencia: 'estático',
    regressoes: [],
    progressoes: [],
    variacoes: [],
    adaptacoes: {
      cotovelo: ['alongamento-triceps-acima']
    },
    criterioAvanco: 'Manter 30 segundos com cada braço mantendo a coluna ereta',
    sinonimos: ['overhead triceps stretch', 'alongamento de braço'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Braço Elevado', description: 'Levante o braço direito, dobre o cotovelo e alcance as costas entre as escápulas com a mão.' },
      { step: 2, title: 'Pressão Suave', description: 'Com a mão esquerda, segure o cotovelo direito e empurre-o suavemente para trás.' },
      { step: 3, title: 'Postura Neutra', description: 'Mantenha a cabeça ereta e peito aberto sem projetar o pescoço.' }
    ],
    commonMistakes: [
      { mistake: 'Empurrar a cabeça para a frente com o braço', correction: 'Mantenha a nuca alinhada e coluna vertical.' }
    ]
  },
  {
    id: 'alongamento-ombro-posterior',
    name: 'Alongamento de Deltoide Posterior (Cross-Body Stretch)',
    category: 'Full Body',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['ombros'],
    secondaryMuscles: ['costas'],
    defaultSets: 2,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 15,
    description: 'Puxando o braço reto cruzado à frente do peito com a outra mão, alivia a cápsula posterior do ombro e romboides após treinos intensos.',
    breathingTip: 'Expire ao aproximar o braço do tórax.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Segure no antebraço e evite puxar diretamente em cima do cotovelo.'],
    padrao: 'alongamento',
    fase: 'alongamento',
    equipamento: ['nenhum'],
    tipoExercicio: 'alongamento',
    estatico: true,
    cadencia: 'estático',
    regressoes: [],
    progressoes: [],
    variacoes: [],
    adaptacoes: {
      ombro: ['alongamento-ombro-posterior']
    },
    criterioAvanco: 'Manter 30 segundos em cada braço com ombro deprimido',
    sinonimos: ['cross body shoulder stretch', 'alongamento ombro cruzado'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Braço Cruzado', description: 'Estenda o braço direito horizontalmente cruzando a frente do tórax.' },
      { step: 2, title: 'Apoio do Antebraço', description: 'Use o antebraço esquerdo para puxar o braço direito de encontro ao peito.' },
      { step: 3, title: 'Abaixar o Ombro', description: 'Afaste o ombro direito da orelha intensificando o estiramento posterior.' }
    ],
    commonMistakes: [
      { mistake: 'Elevar o ombro alongado comprimindo o pescoço', correction: 'Mantenha as duas escápulas abaixadas e ombros nivelados.' }
    ]
  },
  {
    id: 'alongamento-flexores-quadril',
    name: 'Alongamento de Flexores de Quadril Meio-Ajoelhado',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['gluteos', 'lombar'],
    defaultSets: 2,
    defaultHoldSeconds: 35,
    defaultRestSeconds: 15,
    description: 'Postura do cavaleiro com retroversão pélvica ativa, esticando o psoas e reto femoral para restaurar o alinhamento lombar.',
    breathingTip: 'Expire apertando o glúteo de trás e deslizando a pelve para frente.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Apoie o joelho traseiro sobre superfície acolchoada macia.'],
    padrao: 'alongamento',
    fase: 'alongamento',
    equipamento: ['nenhum'],
    tipoExercicio: 'alongamento',
    estatico: true,
    cadencia: 'estático',
    regressoes: [],
    progressoes: [],
    variacoes: [],
    adaptacoes: {
      joelho: ['alongamento-flexores-quadril'],
      lombar: ['alongamento-flexores-quadril']
    },
    criterioAvanco: 'Manter 35 segundos confortáveis com retroversão pélvica',
    sinonimos: ['hip flexor stretch', 'alongamento de psoas'],
    animationType: 'lunges',
    executionSteps: [
      { step: 1, title: 'Posição do Cavaleiro', description: 'Ajoelhe-se com um joelho no chão e o outro pé à frente com joelho a 90°.' },
      { step: 2, title: 'Encaixe Pélvico', description: 'Contraia o glúteo da perna de trás recolhendo a pelve para a frente.' },
      { step: 3, title: 'Deslocamento Sutil', description: 'Projete o quadril alguns centímetros à frente sentindo a virilha alongar.' }
    ],
    commonMistakes: [
      { mistake: 'Arquear a lombar empurrando a barriga para frente', correction: 'Tranque o abdômen e mova apenas a bacia sem arquear a coluna.' }
    ]
  },
  {
    id: 'alongamento-quadriceps',
    name: 'Alongamento de Quadríceps em Pé',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['panturrilhas'],
    defaultSets: 2,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 15,
    description: 'Em pé sobre uma perna, segura-se o tornozelo da outra perna atrás das nádegas mantendo os joelhos juntos e pelve alinhada.',
    breathingTip: 'Respire suave mantendo o equilíbrio.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Apoie a mão livre em uma parede caso precise de equilíbrio.'],
    padrao: 'alongamento',
    fase: 'alongamento',
    equipamento: ['nenhum'],
    tipoExercicio: 'alongamento',
    estatico: true,
    cadencia: 'estático',
    regressoes: [],
    progressoes: [],
    variacoes: [],
    adaptacoes: {
      joelho: ['alongamento-quadriceps']
    },
    criterioAvanco: 'Manter 30 segundos por perna com joelhos alinhados',
    sinonimos: ['quadriceps stretch', 'alongamento coxa em pé'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Equilíbrio e Pegada', description: 'Fique de pé, dobre o joelho direito e segure o peito do pé com a mão direita.' },
      { step: 2, title: 'Alinhamento dos Joelhos', description: 'Junte os dois joelhos mantendo o tronco perfeitamente ereto.' },
      { step: 3, title: 'Puxe o Calcanhar', description: 'Aproxime o calcanhar da nádega e aperte o glúteo empurrando o quadril para frente.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar o joelho abrir para o lado ou para a frente', correction: 'Mantenha os dois joelhos paralelos colados um ao outro.' }
    ]
  },
  {
    id: 'alongamento-isquiotibiais',
    name: 'Alongamento de Isquiotibiais com Coluna Alinhada',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['posteriores'],
    secondaryMuscles: ['lombar', 'panturrilhas'],
    defaultSets: 2,
    defaultHoldSeconds: 35,
    defaultRestSeconds: 15,
    description: 'Com calcanhar apoiado à frente e joelho estendido, inclina-se a partir da bacia mantendo a coluna lombar reta sem arredondar as costas.',
    breathingTip: 'Solte o ar inclinando o umbigo em direção à coxa.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não curve a coluna para tentar alcançar a ponta dos dedos; dobre no quadril.'],
    padrao: 'alongamento',
    fase: 'alongamento',
    equipamento: ['nenhum'],
    tipoExercicio: 'alongamento',
    estatico: true,
    cadencia: 'estático',
    regressoes: [],
    progressoes: [],
    variacoes: [],
    adaptacoes: {
      lombar: ['alongamento-isquiotibiais']
    },
    criterioAvanco: 'Manter 35 segundos com coluna reta e estiramento na coxa',
    sinonimos: ['hamstring stretch', 'alongamento posterior de coxa'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Calcanhar à Frente', description: 'Coloque um pé à frente apoiado no calcanhar com a perna estendida.' },
      { step: 2, title: 'Dobra na Pelve', description: 'Dobre ligeiramente a perna de apoio de trás e empurre o quadril para trás.' },
      { step: 3, title: 'Peito Aberto', description: 'Incline o tronco reto mantendo o peito alto até sentir a parte de trás da coxa.' }
    ],
    commonMistakes: [
      { mistake: 'Arredondar a parte superior das costas tentando encostar a cabeça no joelho', correction: 'Mantenha a coluna neutra e pense em empurrar a bacia para trás.' }
    ]
  },
  {
    id: 'alongamento-panturrilha',
    name: 'Alongamento de Panturrilha na Parede',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['panturrilhas'],
    secondaryMuscles: [],
    defaultSets: 2,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 15,
    description: 'Com mãos na parede e uma perna estendida para trás com calcanhar cravado no solo, estira-se o gastrocnêmio e tendão calcâneo.',
    breathingTip: 'Respire firme pressionando o calcanhar traseiro no chão.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Aponte os dedos dos pés diretamente para a parede.'],
    padrao: 'alongamento',
    fase: 'alongamento',
    equipamento: ['nenhum'],
    tipoExercicio: 'alongamento',
    estatico: true,
    cadencia: 'estático',
    regressoes: [],
    progressoes: [],
    variacoes: [],
    adaptacoes: {
      tornozelo: ['alongamento-panturrilha']
    },
    criterioAvanco: 'Manter 30 segundos por perna com calcanhar firme',
    sinonimos: ['calf stretch parede', 'alongamento gastrocnêmio'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Apoio na Parede', description: 'Apoie as mãos na parede na altura do peito com braços esticados.' },
      { step: 2, title: 'Perna Posterior Reta', description: 'Dê um passo atrás com a perna direita mantendo-a perfeitamente esticada.' },
      { step: 3, title: 'Calcanhar no Chão', description: 'Empurre o calcanhar direito contra o chão e dobre o joelho dianteiro.' }
    ],
    commonMistakes: [
      { mistake: 'Virar o pé de trás para fora', correction: 'Mantenha os dedos de trás apontados retilíneos para a parede.' }
    ]
  },
  {
    id: 'alongamento-gluteo-pombo',
    name: 'Postura do Pombo para Glúteos (Pigeon Pose)',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['gluteos'],
    secondaryMuscles: ['lombar'],
    defaultSets: 2,
    defaultHoldSeconds: 35,
    defaultRestSeconds: 15,
    description: 'Clássica postura do ioga no solo para liberação profunda dos rotadores externos do quadril, glúteo médio e piriforme.',
    breathingTip: 'Solte o peso do corpo sobre a coxa flexionada a cada expiração.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Se sentir pressão no joelho dianteiro, faça a variação figura 4 deitado.'],
    padrao: 'alongamento',
    fase: 'alongamento',
    equipamento: ['nenhum'],
    tipoExercicio: 'alongamento',
    estatico: true,
    cadencia: 'estático',
    regressoes: [],
    progressoes: [],
    variacoes: [],
    adaptacoes: {
      joelho: ['alongamento-gluteo-pombo'],
      lombar: ['alongamento-gluteo-pombo']
    },
    criterioAvanco: 'Manter 40 segundos confortáveis com bacia nivelada',
    sinonimos: ['pigeon pose', 'postura do pombo glúteo'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Perna Dianteira em Ângulo', description: 'No solo, dobre o joelho direito à frente com a canela cruzada no chão.' },
      { step: 2, title: 'Perna Traseira Estendida', description: 'Estenda a perna esquerda reta para trás com a coxa voltada para o chão.' },
      { step: 3, title: 'Apoio dos Antebraços', description: 'Desça o tronco descansando os antebraços no solo sobre a perna direita.' }
    ],
    commonMistakes: [
      { mistake: 'Tombar todo o peso para o lado da nádega dianteira', correction: 'Mantenha os dois quadris paralelos e voltados para o colchonete.' }
    ]
  },
  {
    id: 'alongamento-borboleta',
    name: 'Alongamento Borboleta (Baddha Konasana)',
    category: 'Legs',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['gluteos'],
    secondaryMuscles: ['lombar'],
    defaultSets: 2,
    defaultHoldSeconds: 35,
    defaultRestSeconds: 15,
    description: 'Sentado com plantas dos pés unidas e joelhos caídos para fora, promove abertura suave dos adutores e relaxamento do assoalho pélvico.',
    breathingTip: 'Expire deixando os joelhos pesarem suavemente em direção ao chão.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não balance os joelhos com violência; permita que a gravidade atue.'],
    padrao: 'alongamento',
    fase: 'alongamento',
    equipamento: ['nenhum'],
    tipoExercicio: 'alongamento',
    estatico: true,
    cadencia: 'estático',
    regressoes: [],
    progressoes: [],
    variacoes: [],
    adaptacoes: {
      quadril: ['alongamento-borboleta']
    },
    criterioAvanco: 'Manter 40 segundos com coluna ereta e relaxamento dos adutores',
    sinonimos: ['alongamento borboleta', 'baddha konasana'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Pés Unidos', description: 'Sente-se no solo, dobre os joelhos e junte as solas dos pés próximas à virilha.' },
      { step: 2, title: 'Segurar os Tornozelos', description: 'Segure os pés ou tornozelos e erga a coluna estufando o peito.' },
      { step: 3, title: 'Abertura Gravitacional', description: 'Deixe os joelhos se aproximarem do solo sem forçar com as mãos.' }
    ],
    commonMistakes: [
      { mistake: 'Arredondar a coluna lombar em corcunda', correction: 'Sente-se sobre os ísquios com a pelve neutra e peito alto.' }
    ]
  },
  {
    id: 'alongamento-rotacao-coluna',
    name: 'Rotação de Coluna Deitado (Suave Iron Cross)',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['lombar'],
    secondaryMuscles: ['gluteos', 'peito'],
    defaultSets: 2,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 15,
    description: 'Deitado de costas, cruza-se um joelho dobrado por cima do corpo enquanto os ombros permanecem colados ao solo, aliviando tensões na coluna.',
    breathingTip: 'Solte todo o ar na torção torácica relaxando a lombar.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha os dois ombros no chão; não force a perna se houver dor aguda.'],
    padrao: 'alongamento',
    fase: 'alongamento',
    fasesSecundarias: ['aquecimento'],
    equipamento: ['nenhum'],
    tipoExercicio: 'alongamento',
    estatico: true,
    cadencia: 'estático',
    regressoes: [],
    progressoes: [],
    variacoes: [],
    adaptacoes: {
      lombar: ['alongamento-rotacao-coluna']
    },
    criterioAvanco: 'Manter 30 segundos por lado com ombros em contato com o solo',
    sinonimos: ['lying spinal twist', 'torção de coluna no chão'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Deitar de Costas', description: 'Deite com os braços abertos em cruz e palmas voltadas para cima.' },
      { step: 2, title: 'Flexão do Joelho', description: 'Dobre o joelho direito a 90° e cruze-o suavemente sobre o lado esquerdo do corpo.' },
      { step: 3, title: 'Olhar Oposto', description: 'Vire a cabeça para a direita enquanto mantém ambos os ombros firmes no chão.' }
    ],
    commonMistakes: [
      { mistake: 'Descolar o ombro oposto do solo para tentar encostar o joelho no chão', correction: 'A prioridade é o ombro no chão; o joelho fica onde a flexibilidade permitir.' }
    ]
  },
  {
    id: 'postura-crianca',
    name: 'Postura da Criança (Child’s Pose)',
    category: 'Full Body',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['costas', 'lombar'],
    secondaryMuscles: ['ombros'],
    defaultSets: 2,
    defaultHoldSeconds: 45,
    defaultRestSeconds: 15,
    description: 'Postura de descanso restaurativa com joelhos afastados, quadril nos calcanhares e braços estendidos à frente, relaxando toda a musculatura paravertebral.',
    breathingTip: 'Respire profunda e calmamente expandindo as costas e o abdômen.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Coloque uma almofada entre os calcanhares e coxas se tiver desconforto no joelho.'],
    padrao: 'alongamento',
    fase: 'alongamento',
    fasesSecundarias: ['aquecimento'],
    equipamento: ['nenhum'],
    tipoExercicio: 'alongamento',
    estatico: true,
    cadencia: 'estático',
    regressoes: [],
    progressoes: [],
    variacoes: [],
    adaptacoes: {
      lombar: ['postura-crianca'],
      joelho: ['postura-crianca']
    },
    criterioAvanco: 'Manter 60 segundos com respiração tranquila e descompressão total',
    sinonimos: ['childs pose', 'balasana', 'postura da criança'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Ajoelhar e Afastar', description: 'Ajoelhe-se no colchonete, junte os dedões dos pés e afaste os joelhos na largura do colchonete.' },
      { step: 2, title: 'Sentar nos Calcanhares', description: 'Sente o quadril sobre os calcanhares e incline o tronco para a frente.' },
      { step: 3, title: 'Estender Braços e Testa', description: 'Estique os braços no chão à frente e apoie a testa suavemente no solo.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar o quadril alto sem tentar relaxá-lo em direção aos pés', correction: 'Relaxe o peso da pelve sobre os calcanhares com a respiração profunda.' }
    ]
  }
];

