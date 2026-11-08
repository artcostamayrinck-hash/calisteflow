import type { Exercise } from '../../types';
import { CREF_REVIEWER_SPECIALIST } from './reviewer';

export const PUSH_HORIZONTAL_EXERCISES: Exercise[] = [
  {
    id: 'flexao-parede',
    name: 'Flexão na Parede',
    category: 'Push',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['peito', 'triceps'],
    secondaryMuscles: ['ombros', 'abdomen'],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 45,
    description: 'Variação inicial com menor sobrecarga gravitacional, ideal para iniciantes absolutos, sobrepeso ou reabilitação articular.',
    breathingTip: 'Inspire ao se aproximar da parede; expire ao empurrar o corpo para trás.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Pare imediatamente se sentir dor nos ombros ou punhos.', 'Mantenha o abdômen firme sem curvar a lombar.'],
    padrao: 'empurrar-horizontal',
    equipamento: ['parede'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: [],
    progressoes: ['flexao-inclinada'],
    variacoes: ['flexao-escapular'],
    adaptacoes: {
      punho: ['flexao-parede'],
      ombro: ['flexao-parede'],
      sobrepeso: ['flexao-parede'],
      'sem-equipamento': ['flexao-parede'],
    },
    criterioAvanco: '3x15 repetições limpas com controle total',
    sinonimos: ['wall push-up', 'flexão em pé'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Posicionamento', description: 'Fique de frente para a parede a cerca de um braço de distância com as mãos na largura dos ombros.' },
      { step: 2, title: 'Descida', description: 'Flexione os cotovelos a 45° aproximando o peitoral da parede de forma suave.' },
      { step: 3, title: 'Retorno', description: 'Empurre a parede até a extensão completa dos braços sem travar bruscamente as articulações.' }
    ],
    commonMistakes: [
      { mistake: 'Cotovelos abertos a 90° em T', correction: 'Aproxime os cotovelos do tronco a cerca de 45°.' }
    ]
  },
  {
    id: 'flexao-inclinada',
    name: 'Flexão Inclinada',
    category: 'Push',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['peito', 'triceps'],
    secondaryMuscles: ['ombros', 'abdomen'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Executada com as mãos apoiadas em uma superfície elevada (mesa, banco ou degrau), reduzindo a carga corporal.',
    breathingTip: 'Inspire na descida; expire no impulso de subida.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Garanta que o apoio (banco ou mesa) esteja perfeitamente firme e travado.'],
    padrao: 'empurrar-horizontal',
    equipamento: ['banco'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-1',
    regressoes: ['flexao-parede'],
    progressoes: ['flexao-joelhos', 'pushup', 'pushup'],
    variacoes: ['flexao-inclinada-fechada'],
    adaptacoes: {
      punho: ['flexao-inclinada'],
      ombro: ['flexao-parede'],
      'sem-equipamento': ['flexao-inclinada']
    },
    criterioAvanco: '3x12 repetições com boa cadência',
    sinonimos: ['incline push-up', 'flexão no banco'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Apoio Firme', description: 'Apoie as mãos na borda do banco ou mesa na largura dos ombros.' },
      { step: 2, title: 'Prancha Reta', description: 'Estenda as pernas para trás mantendo uma linha reta dos calcanhares à cabeça.' },
      { step: 3, title: 'Descida e Empurrada', description: 'Desça até o peito quase tocar o apoio e empurre com firmeza.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar o quadril afundar', correction: 'Ative o core e glúteos como em uma prancha estática.' }
    ]
  },
  {
    id: 'flexao-joelhos',
    name: 'Flexão de Braços com Joelhos',
    category: 'Push',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['peito', 'triceps'],
    secondaryMuscles: ['ombros', 'abdomen'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Ponte de transição fundamental para a flexão tradicional, diminuindo a alavanca do tronco ao apoiar os joelhos no solo.',
    breathingTip: 'Inspire controlando a gravidade; expire empurrando o chão.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Utilize um colchonete ou toalha sob os joelhos para amortecer a patela.'],
    padrao: 'empurrar-horizontal',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-1',
    regressoes: ['flexao-inclinada'],
    progressoes: ['pushup', 'pushup'],
    variacoes: ['flexao-joelhos-fechada'],
    adaptacoes: {
      punho: ['flexao-joelhos'],
      joelho: ['flexao-inclinada'],
      lombar: ['flexao-inclinada'],
      'sem-equipamento': ['flexao-joelhos']
    },
    criterioAvanco: '3x12 repetições com peito tocando o solo',
    sinonimos: ['knee push-up', 'flexão com apoio'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Posição dos Joelhos', description: 'Ajoelhe-se em um tapete com mãos ligeiramente mais largas que os ombros.' },
      { step: 2, title: 'Tronco Alinhado', description: 'Projete o quadril à frente formando uma diagonal reta entre joelhos e ombros.' },
      { step: 3, title: 'Amplitude Completa', description: 'Desça até o peito quase encostar no chão e empurre estendendo os braços.' }
    ],
    commonMistakes: [
      { mistake: 'Manter o bumbum empinado para trás em quatro apoios', correction: 'Avance o quadril até formar uma prancha diagonal.' }
    ]
  },
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
    description: 'O exercício de base absoluto de empurrar na calistenia, fortalecendo peitorais, tríceps e estabilidade do tronco.',
    breathingTip: 'Inspire ao descer controladamente; expire ao empurrar o solo para cima.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: [
      'Pare imediatamente se sentir dor pontual nos ombros ou punhos.',
      'Mantenha os cotovelos a 45° em relação ao tronco para evitar pinçamento subacromial.',
      'Não deixe a pelve cair para proteger a coluna lombar.'
    ],
    padrao: 'empurrar-horizontal',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['flexao-joelhos', 'flexao-inclinada'],
    progressoes: ['flexao-declinada', 'diamondpushup', 'diamondpushup'],
    variacoes: ['flexao-aberta', 'flexao-hindu'],
    adaptacoes: {
      punho: ['dip-banco-chao', 'pushup'],
      ombro: ['flexao-inclinada'],
      'sem-equipamento': ['pushup']
    },
    criterioAvanco: '3x15 repetições limpas com amplitude completa',
    sinonimos: ['pushup', 'push-up', 'apoio de frente', 'pushup'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Posição de Prancha Rígida', description: 'Palmas firmes no chão na largura dos ombros, dedos espalhados, pés unidos e glúteos contraídos.' },
      { step: 2, title: 'Descida Controlada (Fase Excêntrica)', description: 'Flexione os cotovelos em ângulo de 45° em relação ao tronco, descendo o peitoral até 2 cm do chão.' },
      { step: 3, title: 'Empurrão com Protração Escapular', description: 'Empurre o solo com força estendendo os braços e projetando levemente as escápulas para frente no topo.' }
    ],
    commonMistakes: [
      { mistake: 'Cotovelos abertos em 90° formando um "T"', correction: 'Aproxime os cotovelos a 45° do tronco (formato de flecha/seta).' },
      { mistake: 'Quadril caído em hiperextensão lombar', correction: 'Acione ativamente o abdômen e contraia os glúteos em retroversão pélvica.' }
    ]
  },
  {
    id: 'flexao-fechada',
    name: 'Flexão com Pegada Fechada',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['triceps', 'peito'],
    secondaryMuscles: ['ombros', 'abdomen'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Mãos alinhadas na largura dos ombros com cotovelos colados às costelas, aumentando o recrutamento da cabeça longa do tríceps.',
    breathingTip: 'Inspire mantendo os cotovelos colados ao corpo; expire na subida.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não deixe os cotovelos abrirem lateralmente durante o esforço.'],
    padrao: 'empurrar-horizontal',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['flexao-inclinada', 'pushup'],
    progressoes: ['diamondpushup', 'diamondpushup'],
    variacoes: ['pushup'],
    adaptacoes: {
      punho: ['flexao-fechada'],
      cotovelo: ['pushup'],
      'sem-equipamento': ['flexao-fechada']
    },
    criterioAvanco: '3x12 repetições completas com boa cadência',
    sinonimos: ['close-grip push-up', 'flexão militar'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Mãos Alinhadas', description: 'Posicione as mãos exatamente abaixo da articulação dos ombros.' },
      { step: 2, title: 'Descida Rente', description: 'Desça mantendo os antebraços e braços roçando as laterais do tronco.' },
      { step: 3, title: 'Extensão de Tríceps', description: 'Empurre o solo focando na contração vigorosa do tríceps.' }
    ],
    commonMistakes: [
      { mistake: 'Abertura involuntária dos cotovelos', correction: 'Force os cotovelos para trás apontando para os calcanhares.' }
    ]
  },
  {
    id: 'diamondpushup',
    name: 'Flexão Diamante',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['triceps', 'peito'],
    secondaryMuscles: ['ombros', 'abdomen'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Variação clássica com as mãos unidas sob o peitoral formando um triângulo, com ênfase máxima no tríceps braquial.',
    breathingTip: 'Inspire descendo até tocar as mãos no peito; solte o ar empurrando o chão.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: [
      'Exige alta mobilidade de punhos; se houver dor, abra as mãos alguns centímetros.',
      'Mantenha o core rígido para evitar compensação na coluna lombar.'
    ],
    padrao: 'empurrar-horizontal',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['flexao-fechada', 'pushup'],
    progressoes: ['flexao-arqueiro', 'dip'],
    variacoes: ['flexao-fechada'],
    adaptacoes: {
      punho: ['flexao-fechada'],
      cotovelo: ['flexao-inclinada'],
      'sem-equipamento': ['diamondpushup']
    },
    criterioAvanco: '3x10 repetições tocando o peito no diamante',
    sinonimos: ['diamond pushup', 'diamond push-up', 'diamondpushup'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Formato Diamante', description: 'Junte polegares e indicadores no chão abaixo do centro do peitoral.' },
      { step: 2, title: 'Descida Estável', description: 'Desça com calma até o esterno tocar ou quase tocar o topo das mãos.' },
      { step: 3, title: 'Subida Explosiva', description: 'Estenda os braços completamente sem arquear a coluna.' }
    ],
    commonMistakes: [
      { mistake: 'Elevar o quadril antes do tronco', correction: 'Mantenha o corpo como uma prancha sólida única.' }
    ]
  },
  {
    id: 'flexao-declinada',
    name: 'Flexão Declinada (Pés Elevados)',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['peito', 'ombros'],
    secondaryMuscles: ['triceps', 'abdomen'],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSeconds: 75,
    description: 'Pés apoiados em banco ou cadeira e mãos no chão. Aumenta a porcentagem de massa corporal sustentada e foca no peitoral superior e ombros.',
    breathingTip: 'Inspire na descida mantendo a nuca neutra; expire empurrando.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não hiperestenda o pescoço olhando para a frente. Mantenha o olhar para o solo.'],
    padrao: 'empurrar-horizontal',
    equipamento: ['banco'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['pushup'],
    progressoes: ['pikepushup', 'flexao-pseudo-planche'],
    variacoes: ['flexao-declinada-fechada'],
    adaptacoes: {
      punho: ['flexao-declinada'],
      lombar: ['pushup'],
      'sem-equipamento': ['flexao-declinada']
    },
    criterioAvanco: '3x12 repetições com pés na altura do quadril',
    sinonimos: ['decline pushup', 'flexão pés elevados'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Elevação dos Pés', description: 'Coloque a ponta dos pés sobre um banco de 30-45 cm e mãos no solo.' },
      { step: 2, title: 'Alinhamento', description: 'Ative glúteos e abdômen para impedir que a pelve afunde.' },
      { step: 3, title: 'Movimento', description: 'Desça a cabeça e o peitoral em direção ao chão e empurre de volta.' }
    ],
    commonMistakes: [
      { mistake: 'Ceder na região lombar', correction: 'Trave o abdômen e glúteos ativamente.' }
    ]
  },
  {
    id: 'flexao-aberta',
    name: 'Flexão com Pegada Aberta',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['peito'],
    secondaryMuscles: ['ombros', 'triceps'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Mãos posicionadas cerca de 1,5x a largura dos ombros, aumentando o torque no peitoral com menor amplitude de tríceps.',
    breathingTip: 'Inspire alongando o peitoral; expire empurrando o solo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Pessoas com histórico de dor anterior de ombro devem evitar amplitudes excessivas.'],
    padrao: 'empurrar-horizontal',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['pushup'],
    progressoes: ['flexao-arqueiro'],
    variacoes: ['pushup'],
    adaptacoes: {
      ombro: ['pushup'],
      punho: ['dip'],
      'sem-equipamento': ['flexao-aberta']
    },
    criterioAvanco: '3x12 repetições completas com boa amplitude',
    sinonimos: ['wide pushup', 'flexão pegada aberta'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Abertura de Base', description: 'Afaste as mãos para além da linha dos ombros, com dedos levemente apontados para fora.' },
      { step: 2, title: 'Descida', description: 'Desça sentindo o alongamento da fáscia peitoral.' },
      { step: 3, title: 'Convergência', description: 'Empurre imaginando que está tentando aproximar as mãos uma da outra no chão.' }
    ],
    commonMistakes: [
      { mistake: 'Abrir excessivamente e forçar a articulação do ombro', correction: 'Limite a abertura a 1,5x a largura dos ombros.' }
    ]
  },
  {
    id: 'flexao-escapular',
    name: 'Flexão Escapular (Push-up Plus)',
    category: 'Push',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['ombros', 'abdomen'],
    secondaryMuscles: ['peito'],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 45,
    description: 'Movimento focado no serrátil anterior e controle da cintura escapular, essencial para saúde articular e postura.',
    breathingTip: 'Inspire ao aproximar as escápulas; expire ao arredondar as costas para cima.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Os braços ficam 100% estendidos o tempo todo; não dobre os cotovelos.'],
    padrao: 'empurrar-horizontal',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['flexao-parede'],
    progressoes: ['pushup'],
    variacoes: ['plank'],
    adaptacoes: {
      punho: ['flexao-escapular'],
      'sem-equipamento': ['flexao-escapular']
    },
    criterioAvanco: '3x15 repetições com controle isolado',
    sinonimos: ['scapular pushup', 'push-up plus', 'ativação de serrátil'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Prancha Rígida', description: 'Mantenha os cotovelos travados em extensão completa.' },
      { step: 2, title: 'Retração', description: 'Aproxime as escápulas deixando o peitoral descer alguns centímetros.' },
      { step: 3, title: 'Protração Máxima', description: 'Empurre o solo afastando as escápulas uma da outra para cima.' }
    ],
    commonMistakes: [
      { mistake: 'Flexionar os cotovelos', correction: 'Mantenha os braços estendidos como colunas rígidas.' }
    ]
  },
  {
    id: 'flexao-hindu',
    name: 'Flexão Hindu (Dive Bomber)',
    category: 'Push',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['ombros', 'peito', 'triceps'],
    secondaryMuscles: ['lombar', 'abdomen'],
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 75,
    description: 'Exercício dinâmico que combina empurrada em arco com mobilidade de coluna torácica e lombar.',
    breathingTip: 'Inspire ao mergulhar o peito rente ao chão; expire ao subir em postura da cobra.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Evite hiperextensão forçada da coluna lombar caso sinta incômodo.'],
    padrao: 'empurrar-horizontal',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: 'dinamico',
    regressoes: ['pikepushup', 'pushup'],
    progressoes: ['flexao-declinada'],
    variacoes: ['pikepushup'],
    adaptacoes: {
      lombar: ['pushup'],
      punho: ['pushup'],
      'sem-equipamento': ['flexao-hindu']
    },
    criterioAvanco: '3x10 repetições fluidas sem pausas',
    sinonimos: ['hindu pushup', 'dand', 'dive bomber'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'V Invertido', description: 'Inicie com o quadril alto em formato de V invertido (cão olhando para baixo).' },
      { step: 2, title: 'Mergulho', description: 'Mergulhe o nariz, queixo e peito raspando o chão entre as mãos.' },
      { step: 3, title: 'Extensão', description: 'Empurre o tronco para cima abrindo o peito e retorne o quadril ao topo.' }
    ],
    commonMistakes: [
      { mistake: 'Movimento recortado e sem fluidez', correction: 'Trabalhe o arco como uma onda contínua.' }
    ]
  },
  {
    id: 'flexao-arqueiro',
    name: 'Flexão Arqueiro (Archer Push-up)',
    category: 'Push',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['peito', 'triceps'],
    secondaryMuscles: ['ombros', 'abdomen'],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSeconds: 90,
    description: 'Transição avançada para o trabalho unilateral: um braço flexiona com carga pesada enquanto o outro estende como guia lateral.',
    breathingTip: 'Inspire deslocando o peso lateralmente; expire empurrando de volta ao centro.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['O braço estendido deve girar a palma suavemente para acomodar o cotovelo.'],
    padrao: 'empurrar-horizontal',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['flexao-aberta', 'diamondpushup'],
    progressoes: ['flexao-unilateral-assistida'],
    variacoes: ['flexao-arqueiro-inclinada'],
    adaptacoes: {
      ombro: ['diamondpushup'],
      punho: ['flexao-arqueiro'],
      'sem-equipamento': ['flexao-arqueiro']
    },
    criterioAvanco: '3x8 repetições de cada lado com controle',
    sinonimos: ['archer pushup', 'flexão lateral'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Base Bem Aberta', description: 'Mãos bem afastadas no chão e pés na largura dos quadris.' },
      { step: 2, title: 'Deslocamento Unilateral', description: 'Desça o peito sobre a mão direita enquanto o braço esquerdo estende lateralmente.' },
      { step: 3, title: 'Troca Controlada', description: 'Empurre até o centro e repita o movimento para o lado oposto.' }
    ],
    commonMistakes: [
      { mistake: 'Girar a bacia e perder a prancha', correction: 'Mantenha a pelve paralela ao chão durante todo o percurso.' }
    ]
  },
  {
    id: 'flexao-pseudo-planche',
    name: 'Flexão Pseudo Planche (PPPU)',
    category: 'Push',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['ombros', 'peito', 'triceps'],
    secondaryMuscles: ['abdomen', 'biceps'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 90,
    description: 'Mãos posicionadas na altura da cintura com inclinação anterior do corpo. Alavanca biomecânica para força de ombro e preparação para planche.',
    breathingTip: 'Inspire mantendo a protração escapular; expire empurrando o solo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Gire os dedos 45° para fora para proteger a articulação dos punhos.'],
    padrao: 'empurrar-horizontal',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['flexao-declinada', 'planche-lean'],
    progressoes: ['tuck-planche', 'planche'],
    variacoes: ['planche-lean'],
    adaptacoes: {
      punho: ['flexao-pseudo-planche'],
      ombro: ['flexao-declinada'],
      'sem-equipamento': ['flexao-pseudo-planche']
    },
    criterioAvanco: '3x10 repetições com as mãos na linha do umbigo',
    sinonimos: ['pseudo planche pushup', 'pppu', 'flexão planche'],
    animationType: 'planche',
    executionSteps: [
      { step: 1, title: 'Inclinação Anterior', description: 'Mãos no chão apontando para fora, incline os ombros bem à frente da linha dos punhos.' },
      { step: 2, title: 'Descida em Alavanca', description: 'Desça mantendo o peso projetado à frente sem recuar os ombros.' },
      { step: 3, title: 'Subida Hollow', description: 'Empurre para cima finalizando com escápulas protraídas e peito côncavo.' }
    ],
    commonMistakes: [
      { mistake: 'Recuar os ombros para trás na subida', correction: 'Mantenha a inclinação anterior constante em todo o trajeto.' }
    ]
  },
  {
    id: 'flexao-unilateral-assistida',
    name: 'Flexão Unilateral Assistida',
    category: 'Push',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['peito', 'triceps', 'ombros'],
    secondaryMuscles: ['abdomen', 'lombar'],
    defaultSets: 3,
    defaultReps: 5,
    defaultRestSeconds: 90,
    description: 'Um braço sustenta a maior parte da carga no chão, enquanto a outra mão repousa sobre um degrau ou apoio apenas com a ponta dos dedos.',
    breathingTip: 'Inspire travando o abdômen oblíquo; expire na força unilateral.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Afaste bem os pés para dar suporte à rotação de tronco.'],
    padrao: 'empurrar-horizontal',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-1',
    regressoes: ['flexao-arqueiro'],
    progressoes: ['flexao-unilateral'],
    variacoes: ['flexao-arqueiro'],
    adaptacoes: {
      ombro: ['flexao-arqueiro'],
      punho: ['dip'],
      'sem-equipamento': ['flexao-unilateral-assistida']
    },
    criterioAvanco: '3x6 repetições limpas por braço',
    sinonimos: ['assisted one-arm pushup', 'flexão com um braço assistida'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Base Estendida', description: 'Pés afastados para estabilidade rotacional, mão de trabalho sob o peitoral.' },
      { step: 2, title: 'Apoio Leve', description: 'A mão secundária apoia apenas a ponta dos dedos ao lado para equilíbrio.' },
      { step: 3, title: 'Força Unilateral', description: 'Desça com controle e empurre concentrando a força no braço ativo.' }
    ],
    commonMistakes: [
      { mistake: 'Empurrar com a mão de apoio', correction: 'Use a mão livre exclusivamente para não tombar de lado.' }
    ]
  },
  {
    id: 'flexao-unilateral',
    name: 'Flexão Unilateral (One-Arm Push-up)',
    category: 'Push',
    difficulty: 'Elite',
    type: 'reps',
    primaryMuscles: ['peito', 'triceps', 'abdomen'],
    secondaryMuscles: ['ombros', 'gluteos'],
    defaultSets: 4,
    defaultReps: 5,
    defaultRestSeconds: 120,
    description: 'O ápice da força horizontal de empurrar com peso corporal, exigindo força de peitoral, tríceps e antirotação de tronco.',
    breathingTip: 'Prenda o ar com bracing abdominal descendo; expire forte ao passar do ponto de fixação.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Exige excelente preparação prévia nos punhos e tendões dos cotovelos.'],
    padrao: 'empurrar-horizontal',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-1',
    regressoes: ['flexao-unilateral-assistida', 'flexao-arqueiro'],
    progressoes: [],
    variacoes: ['flexao-unilateral-assistida'],
    adaptacoes: {
      punho: ['flexao-unilateral-assistida'],
      lombar: ['flexao-arqueiro'],
      'sem-equipamento': ['flexao-unilateral']
    },
    criterioAvanco: '3x5 repetições com boa postura de cada lado',
    sinonimos: ['one arm pushup', 'oapu', 'flexão com um braço'],
    animationType: 'pushup',
    executionSteps: [
      { step: 1, title: 'Tripé Estável', description: 'Pés bem abertos, mão no solo centralizada sob o esterno, outro braço nas costas.' },
      { step: 2, title: 'Descida Rígida', description: 'Desça o peitoral até quase tocar o solo sem torcer o quadril em excesso.' },
      { step: 3, title: 'Pressão Potente', description: 'Empurre o solo com agressividade controlada até estender o braço.' }
    ],
    commonMistakes: [
      { mistake: 'Girar o quadril em 90 graus', correction: 'Mantenha o quadril o mais paralelo possível ao solo.' }
    ]
  }
];
