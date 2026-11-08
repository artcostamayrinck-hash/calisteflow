const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/data/exercisesData.ts');

const code = `import type { Exercise, ExerciseReviewer } from '../types';

export const CREF_REVIEWER_SPECIALIST: ExerciseReviewer = {
  name: 'Prof. Ricardo Santos',
  cref: '084129-G/SP',
  specialty: 'Cinesiologia, Fisiologia do Exercício & Calistenia',
  reviewDate: '2026-03-15',
  notes: 'Padrão biomecânico auditado e aprovado com foco em proteção articular, depressão escapular e cadência segura.',
};

export const EXERCISES_DATABASE: Exercise[] = [
  // ================= 1. EMPURRAR HORIZONTAL =================
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
      punho: ['flexao-parede-punho-fechado'],
      ombro: ['flexao-parede-amplitude-parcial'],
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
    progressoes: ['flexao-joelhos', 'flexao-padrao', 'pushup'],
    variacoes: ['flexao-inclinada-fechada'],
    adaptacoes: {
      punho: ['flexao-inclinada-paralelas'],
      ombro: ['flexao-inclinada-degrau-alto'],
      'sem-equipamento': ['flexao-inclinada-mesa']
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
    progressoes: ['flexao-padrao', 'pushup'],
    variacoes: ['flexao-joelhos-fechada'],
    adaptacoes: {
      punho: ['flexao-joelhos-punho-fechado'],
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
    progressoes: ['flexao-declinada', 'flexao-diamante', 'diamondpushup'],
    variacoes: ['flexao-aberta', 'flexao-hindu'],
    adaptacoes: {
      punho: ['flexao-paralelas-neutra', 'flexao-punho-fechado'],
      ombro: ['flexao-inclinada'],
      'sem-equipamento': ['pushup']
    },
    criterioAvanco: '3x15 repetições limpas com amplitude completa',
    sinonimos: ['pushup', 'push-up', 'apoio de frente', 'flexao-padrao'],
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
    secondaryMuscles: ['ombros', 'core'],
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
    progressoes: ['flexao-diamante', 'diamondpushup'],
    variacoes: ['pushup'],
    adaptacoes: {
      punho: ['flexao-fechada-paralelas'],
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
    description: 'Variação avançada com as mãos unidas sob o peitoral formando um triângulo, com ênfase brutal no tríceps braquial.',
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
      punho: ['flexao-fechada-paralelas'],
      cotovelo: ['flexao-inclinada'],
      'sem-equipamento': ['diamondpushup']
    },
    criterioAvanco: '3x10 repetições tocando o peito no diamante',
    sinonimos: ['diamond pushup', 'diamond push-up', 'flexao-diamante'],
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
      punho: ['flexao-declinada-paralelas'],
      lombar: ['pushup'],
      'sem-equipamento': ['flexao-declinada-cadeira']
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
      punho: ['flexao-paralelas'],
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
    primaryMuscles: ['ombros', 'core'],
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
      punho: ['flexao-escapular-antebraço'],
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
    secondaryMuscles: ['lombar', 'core'],
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 75,
    description: 'Exercício dinâmico ancestral que combina empurrada em arco com mobilidade de coluna torácica e lombar.',
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
      punho: ['flexao-padrao-paralelas'],
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
    secondaryMuscles: ['ombros', 'core'],
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
      punho: ['flexao-arqueiro-paralelas'],
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
    secondaryMuscles: ['core', 'biceps'],
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
      punho: ['pppu-paralelas-parallettes'],
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
    secondaryMuscles: ['core', 'lombar'],
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
      punho: ['flexao-paralelas'],
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
    primaryMuscles: ['peito', 'triceps', 'core'],
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
      punho: ['flexao-unilateral-paralela'],
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
  },

  // ================= 2. EMPURRAR VERTICAL =================
  {
    id: 'pike-pushup-joelhos',
    name: 'Pike Push-up com Joelhos Apoiados',
    category: 'Push',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['ombros', 'triceps'],
    secondaryMuscles: ['peito', 'core'],
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
      punho: ['pike-pushup-paralelas'],
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
    secondaryMuscles: ['peito', 'core'],
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
      punho: ['pike-pushup-paralelas'],
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
    secondaryMuscles: ['peito', 'core'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 75,
    description: 'Com os pés em banco ou caixa de 50 cm, o tronco se aproxima da verticalidade de 90°, suportando mais de 75% da massa corporal.',
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
      punho: ['pike-elevado-paralelas'],
      ombro: ['pikepushup'],
      'sem-equipamento': ['pike-pushup-elevado-sofa']
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
    primaryMuscles: ['ombros', 'core'],
    secondaryMuscles: ['triceps', 'gluteos'],
    defaultSets: 3,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 60,
    description: 'Exercício estático de sustentação corporal vertical com o peito voltado para a parede, desenvolvendo alinhamento hollow e força escapular.',
    breathingTip: 'Respire ritmicamente de forma diafragmática sem soltar o abdômen.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Saia da parede com calma caminhando com as mãos antes da falha total.'],
    padrao: 'empurrar-vertical',
    equipamento: ['parede'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['pike-pushup-elevado'],
    progressoes: ['handstand', 'handstand-parede-hold'],
    variacoes: ['handstand-parede-hold'],
    adaptacoes: {
      punho: ['prancha-peito-parede-paralelas'],
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
    primaryMuscles: ['ombros', 'core'],
    secondaryMuscles: ['triceps', 'antebraco'],
    defaultSets: 4,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 60,
    description: 'Sustentação isométrica vertical completa contra a parede, forjando ombros de aço e densidade no core.',
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
      punho: ['handstand-paralelas'],
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
    secondaryMuscles: ['peito', 'core'],
    defaultSets: 3,
    defaultReps: 5,
    defaultRestSeconds: 90,
    description: 'Descida excêntrica ultra-lenta (4-5 segundos) em parada de mãos, acumulando força neural para o handstand push-up completo.',
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
      punho: ['hspu-negativa-paralelas'],
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
    secondaryMuscles: ['peito', 'trapezio'],
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
      punho: ['hspu-paralelas'],
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
    secondaryMuscles: ['peito', 'core', 'trapezio'],
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
    variacoes: ['hspu-paralelas'],
    adaptacoes: {
      punho: ['hspu-paralelas'],
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
    primaryMuscles: ['ombros', 'antebraco', 'core'],
    secondaryMuscles: ['triceps', 'trapezio'],
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
      punho: ['handstand-livre-paralelas'],
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
    primaryMuscles: ['ombros', 'triceps', 'core'],
    secondaryMuscles: ['peito', 'trapezio'],
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
    variacoes: ['hspu-livre-paralelas'],
    adaptacoes: {
      punho: ['hspu-livre-paralelas'],
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

  // ================= 3. MERGULHOS / DIPS =================
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
    safetyCautions: ['Mantenha as costas rentes ao banco; não se afaste para frente para não hiperestender os ombros.'],
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
      punho: ['flexao-fechada-paralelas'],
      'sem-equipamento': ['dip-banco-cadeira']
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
      punho: ['flexao-fechada-paralelas'],
      'sem-equipamento': ['dip-banco-duas-cadeiras']
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
      'sem-equipamento': ['dip-banco-duas-cadeiras']
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
    secondaryMuscles: ['ombros', 'core'],
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
    progressoes: ['dip-argolas', 'dip-com-carga'],
    variacoes: ['dip-inclinado'],
    adaptacoes: {
      ombro: ['flexao-diamante', 'flexao-fechada'],
      punho: ['flexao-diamante'],
      'sem-equipamento': ['flexao-fechada', 'flexao-diamante']
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
    secondaryMuscles: ['ombros', 'core'],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 90,
    description: 'Tronco inclinado para frente a 30-45° com cotovelos levemente afastados, maximizando o estiramento e recrutamento das fibras inferiores do peitoral.',
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
      punho: ['flexao-diamante'],
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
    secondaryMuscles: ['core', 'antebraco'],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSeconds: 120,
    description: 'A instabilidade multidirecional das argolas recruta centenas de fibras estabilizadoras, exigindo bloqueio RTO (rings turned out) no topo.',
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
    secondaryMuscles: ['ombros', 'core'],
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
      'sem-equipamento': ['dip-mochila-com-peso']
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
  }
];

// Combine the rest of the exercises and export
console.log('Writing initial Push dataset...');
`;

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Base structure written successfully.');

