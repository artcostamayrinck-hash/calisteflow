import type { Exercise } from '../../types';
import { CREF_REVIEWER_SPECIALIST } from './reviewer';

export const SKILL_EXERCISES: Exercise[] = [
  // ==========================================
  // L-SIT & V-SIT
  // ==========================================
  {
    id: 'lsit-solo-tuck',
    name: 'Tuck L-Sit no Solo ou Paralelas',
    category: 'Skill',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: ['abdomen', 'triceps'],
    secondaryMuscles: ['ombros', 'quadriceps', 'peito'],
    defaultSets: 4,
    defaultHoldSeconds: 15,
    defaultRestSeconds: 60,
    description: 'Primeiro degrau do L-sit. Com mãos apoiadas no solo ou paralelas baixas, deprime-se as escápulas e eleva-se os quadris com joelhos dobrados no peito.',
    breathingTip: 'Respire em pequenas e controladas expirações mantendo o core comprimido.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Empurre o solo com força para afastar os ombros das orelhas.'],
    padrao: 'skills',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['hollowbody', 'prancha-joelhos'],
    progressoes: ['lsit-solo-uma-perna', 'lsit'],
    variacoes: ['hollowbody'],
    adaptacoes: {
      punho: ['lsit-solo-tuck'],
      ombro: ['hollowbody']
    },
    criterioAvanco: 'Manter 4 séries de 20 segundos de sustentação sólida',
    sinonimos: ['tuck l-sit', 'l sit dobrado'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Mãos ao Lado dos Quadris', description: 'Sente-se no solo ou paralelas com as palmas firmes ao lado das coxas.' },
      { step: 2, title: 'Depressão Escapular', description: 'Empurre os ombros para baixo com braços retos, levantando o quadril do solo.' },
      { step: 3, title: 'Encolhimento dos Joelhos', description: 'Puxe os joelhos colados ao peitoral mantendo os pés suspensos do chão.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar os ombros subirem em direção ao pescoço', correction: 'Pressione com firmeza as escápulas para baixo durante todo o tempo.' }
    ]
  },
  {
    id: 'lsit-solo-uma-perna',
    name: 'L-Sit com Uma Perna Estendida',
    category: 'Skill',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: ['abdomen', 'triceps', 'quadriceps'],
    secondaryMuscles: ['ombros', 'peito'],
    defaultSets: 4,
    defaultHoldSeconds: 12,
    defaultRestSeconds: 60,
    description: 'Ponte entre o tuck e o L-sit completo. Uma perna permanece estendida reta à frente enquanto a outra fica dobrada, alternando as séries.',
    breathingTip: 'Mantenha fluxo respiratório sem bloquear o diafragma.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Trabalhe a flexibilidade de isquiotibiais para não curvar em excesso a lombar.'],
    padrao: 'skills',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['lsit-solo-tuck'],
    progressoes: ['lsit'],
    variacoes: ['lsit-solo-tuck'],
    adaptacoes: {
      punho: ['lsit-solo-tuck']
    },
    criterioAvanco: 'Manter 15 segundos sólidos com cada perna',
    sinonimos: ['single leg l-sit'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Elevação em Apoio', description: 'Empurre o solo e erga a pelve com os braços esticados.' },
      { step: 2, title: 'Extensão Unilateral', description: 'Estenda uma perna perfeitamente reta à frente com a ponta do pé apontada.' },
      { step: 3, title: 'Sustentação Paralela', description: 'Mantenha a perna estendida na altura da bacia ou acima.' }
    ],
    commonMistakes: [
      { mistake: 'Perna estendida cair abaixo do plano horizontal', correction: 'Contraia o quadríceps com força máxima para sustentar o pé alto.' }
    ]
  },
  {
    id: 'lsit',
    name: 'L-Sit Completo (Solo ou Paralelas)',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: ['abdomen', 'triceps', 'quadriceps'],
    secondaryMuscles: ['ombros', 'peito', 'lombar'],
    defaultSets: 4,
    defaultHoldSeconds: 15,
    defaultRestSeconds: 90,
    description: 'Habilidade clássica de ginástica onde o corpo forma um ângulo de 90° perfeito em formato de L sustentado apenas pelas mãos.',
    breathingTip: 'Respire em curtas expirações com abdômen hipercontraído.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não deixe os cotovelos dobrarem durante a sustentação.'],
    padrao: 'skills',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['lsit-solo-uma-perna', 'lsit-solo-tuck'],
    progressoes: ['vsit'],
    variacoes: ['lsit-solo-tuck'],
    adaptacoes: {
      punho: ['lsit-solo-tuck']
    },
    criterioAvanco: 'Manter 4 séries de 20 segundos de L-sit no chão com pernas retas',
    sinonimos: ['l-sit solo', 'elevação em L'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posição Sentada', description: 'Sente-se com as pernas esticadas e unidas à frente, mãos ao lado das coxas.' },
      { step: 2, title: 'Depressão e Compressão', description: 'Empurre o chão com os braços travados e comprima o abdômen puxando as pernas para cima.' },
      { step: 3, title: 'Linha em L', description: 'Sustente as pernas paralelas ao chão sem deixar os calcanhares tocarem a superfície.' }
    ],
    commonMistakes: [
      { mistake: 'Dobrar os joelhos por falta de força no quadríceps', correction: 'Trabalhe elevações de perna sentado no chão (pike compression).' }
    ]
  },
  {
    id: 'vsit',
    name: 'V-Sit de Ginástica',
    category: 'Skill',
    difficulty: 'Elite',
    type: 'isometric',
    primaryMuscles: ['abdomen', 'triceps', 'quadriceps'],
    secondaryMuscles: ['ombros', 'lombar'],
    defaultSets: 4,
    defaultHoldSeconds: 8,
    defaultRestSeconds: 120,
    description: 'Evolução extrema do L-sit onde as pernas são elevadas a 45° ou 60° acima da horizontal, formando um V esculpido com o tronco.',
    breathingTip: 'Mantenha respiração ritmada enquanto comprime o tronco contra as coxas.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Requer altíssima flexibilidade ativa de isquiotibiais.'],
    padrao: 'skills',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['lsit'],
    progressoes: [],
    variacoes: ['lsit'],
    adaptacoes: {
      punho: ['lsit']
    },
    criterioAvanco: 'Manter 4 séries de 10 segundos com pés na linha da cabeça',
    sinonimos: ['v-sit', 'elevação em V ginástica'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posição em L-Sit', description: 'Inicie em um L-sit sólido no chão ou paralelas.' },
      { step: 2, title: 'Compressão Máxima', description: 'Incline os ombros ligeiramente para trás e comprima violentamente o abdômen.' },
      { step: 3, title: 'Elevação em V', description: 'Projete os pés para o alto ultrapassando a altura dos ombros.' }
    ],
    commonMistakes: [
      { mistake: 'Permitir que os braços dobrem sob a alavanca', correction: 'Mantenha os cotovelos absolutamente travados em hiperextensão ativa.' }
    ]
  },

  // ==========================================
  // CROW & CRANE POSE
  // ==========================================
  {
    id: 'crow-pose',
    name: 'Crow Pose (Postura do Corvo - Bakasana)',
    category: 'Skill',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['ombros', 'triceps', 'abdomen'],
    secondaryMuscles: ['antebraco', 'peito'],
    defaultSets: 4,
    defaultHoldSeconds: 20,
    defaultRestSeconds: 60,
    description: 'Equilíbrio sobre as mãos com cotovelos levemente flexionados e joelhos apoiados na parte de trás dos braços, ideal para perder o medo de cair para frente.',
    breathingTip: 'Respire suavemente focando o olhar 20 cm à frente das mãos.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Coloque uma almofada à frente do rosto caso perca o equilíbrio.'],
    padrao: 'skills',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['plank', 'pushup'],
    progressoes: ['crane-pose', 'handstand-livre'],
    variacoes: ['crane-pose'],
    adaptacoes: {
      punho: ['plank']
    },
    criterioAvanco: 'Manter 30 segundos estáveis sem tocar os pés no chão',
    sinonimos: ['postura do corvo', 'bakasana'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Cócoras e Apoio', description: 'Agache em cócoras com mãos firmes no solo afastadas na largura dos ombros.' },
      { step: 2, title: 'Joelhos nos Tríceps', description: 'Encaixe os joelhos na parte de trás dos braços próximo às axilas.' },
      { step: 3, title: 'Transferência de Peso', description: 'Incline o tronco para a frente e tire um pé, depois o outro, equilibrando nas mãos.' }
    ],
    commonMistakes: [
      { mistake: 'Olhar para baixo entre as mãos (provoca perda de equilíbrio)', correction: 'Fixe o olhar à frente formando um triângulo no solo.' }
    ]
  },
  {
    id: 'crane-pose',
    name: 'Crane Pose (Postura da Garça com Braços Retos)',
    category: 'Skill',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: ['ombros', 'triceps', 'abdomen'],
    secondaryMuscles: ['peito', 'antebraco'],
    defaultSets: 4,
    defaultHoldSeconds: 15,
    defaultRestSeconds: 60,
    description: 'Variação avançada da postura do corvo executada com os braços completamente estendidos e escápulas protraídas, exigindo grande força escapular.',
    breathingTip: 'Respire concentrado mantendo o vácuo abdominal.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Aquecer muito bem os punhos antes de tentar braços retos.'],
    padrao: 'skills',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['crow-pose'],
    progressoes: ['planche-lean', 'handstand-livre'],
    variacoes: ['crow-pose'],
    adaptacoes: {
      punho: ['crow-pose']
    },
    criterioAvanco: 'Manter 20 segundos com braços 100% esticados',
    sinonimos: ['postura da garça', 'crane pose braços retos'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Braços Rígidos', description: 'Posicione as mãos no chão e trave os cotovelos completamente.' },
      { step: 2, title: 'Encaixe Alto', description: 'Coloque os joelhos o mais próximo possível das axilas.' },
      { step: 3, title: 'Protração e Elevação', description: 'Empurre o chão afastando as escápulas e eleve os pés do chão com os braços retos.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar os cotovelos flexionarem sob a carga', correction: 'Tranque a articulação do cotovelo e empurre o solo ativamente.' }
    ]
  },

  // ==========================================
  // PLANCHE
  // ==========================================
  {
    id: 'planche-lean',
    name: 'Planche Lean (Inclinação para Prancha)',
    category: 'Skill',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: ['ombros', 'peito', 'abdomen'],
    secondaryMuscles: ['antebraco', 'triceps'],
    defaultSets: 4,
    defaultHoldSeconds: 20,
    defaultRestSeconds: 60,
    description: 'Exercício primordial para condicionamento dos tendões do bíceps e deltóide anterior. Em prancha alta, o corpo é inclinado para frente além dos punhos.',
    breathingTip: 'Mantenha respiração constante sem colapsar a cavidade torácica.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Vire os dedos 45° para fora para proteger os punhos.'],
    padrao: 'skills',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['flexao-pseudo-planche', 'plank'],
    progressoes: ['tuck-planche'],
    variacoes: ['flexao-pseudo-planche'],
    adaptacoes: {
      punho: ['flexao-pseudo-planche']
    },
    criterioAvanco: 'Manter 4 séries de 25 segundos com ombros bem à frente dos punhos',
    sinonimos: ['inclinação planche', 'planche lean solo'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Prancha com Protração', description: 'Fique em prancha alta, trave cotovelos e empurre o chão arredondando a parte superior das costas.' },
      { step: 2, title: 'Inclinação Anterior', description: 'Transfira o peso para a frente na ponta dos pés até os ombros passarem a linha das mãos.' },
      { step: 3, title: 'Sustentação Rígida', description: 'Aperte o abdômen e glúteos mantendo os braços como duas colunas de ferro.' }
    ],
    commonMistakes: [
      { mistake: 'Perder a protrusão das escápulas e juntá-las atrás', correction: 'Pense em empurrar o chão para o mais longe possível do peito.' }
    ]
  },
  {
    id: 'tuck-planche',
    name: 'Tuck Planche no Solo ou Paralelas',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: ['ombros', 'peito', 'abdomen'],
    secondaryMuscles: ['triceps', 'antebraco'],
    defaultSets: 4,
    defaultHoldSeconds: 12,
    defaultRestSeconds: 90,
    description: 'Primeira variação com os pés fora do solo. O corpo fica suspenso na horizontal com joelhos encolhidos sob o peitoral e braços estendidos.',
    breathingTip: 'Solte o ar comprimindo o abdômen enquanto ergue os pés.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Se sentir desconforto agudo no tendão distal do bíceps, pare imediatamente.'],
    padrao: 'skills',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['planche-lean', 'crane-pose'],
    progressoes: ['straddle-planche', 'planche'],
    variacoes: ['planche-lean'],
    adaptacoes: {
      punho: ['planche-lean']
    },
    criterioAvanco: 'Manter 4 séries de 15 segundos com quadril na altura dos ombros',
    sinonimos: ['tuck planche', 'planche encolhida'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Apoio e Protração', description: 'Apoie as mãos com dedos ligeiramente rodados externamente e ative as escápulas.' },
      { step: 2, title: 'Inclinação Profunda', description: 'Incline os ombros à frente até o centro de gravidade permitir levantar os pés.' },
      { step: 3, title: 'Flutuação em Tuck', description: 'Dobre os joelhos junto ao peito e eleve o quadril nivelado aos ombros.' }
    ],
    commonMistakes: [
      { mistake: 'Dobrar os braços transformando o movimento em uma flexão', correction: 'Mantenha os cotovelos absolutamente travados.' }
    ]
  },
  {
    id: 'straddle-planche',
    name: 'Straddle Planche (Pernas Afastadas)',
    category: 'Skill',
    difficulty: 'Elite',
    type: 'isometric',
    primaryMuscles: ['ombros', 'peito', 'lombar'],
    secondaryMuscles: ['gluteos', 'abdomen', 'triceps'],
    defaultSets: 4,
    defaultHoldSeconds: 6,
    defaultRestSeconds: 120,
    description: 'Com as pernas abertas em afastamento lateral máximo, encurta-se o centro de gravidade em relação à prancha completa com sustentação horizontal.',
    breathingTip: 'Respire em pequenas doses de ar sustentando o torque máximo nos deltóides.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Requer anos de preparação articular nos tendões dos punhos e cotovelos.'],
    padrao: 'skills',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['tuck-planche'],
    progressoes: ['planche'],
    variacoes: ['tuck-planche'],
    adaptacoes: {
      punho: ['tuck-planche']
    },
    criterioAvanco: 'Manter 4 séries de 8 segundos com pernas e tronco horizontais',
    sinonimos: ['straddle planche', 'planche pernas abertas'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Preparação Escapular', description: 'Mãos no solo, escápulas em máxima protrusão e depressão.' },
      { step: 2, title: 'Abertura das Pernas', description: 'Afaste as pernas no maior straddle possível apontando as pontas dos pés.' },
      { step: 3, title: 'Inclinação e Levitação', description: 'Incline para frente até o corpo inteiro flutuar paralelo ao chão.' }
    ],
    commonMistakes: [
      { mistake: 'Quadril cair abaixo da linha dos ombros (banana planche)', correction: 'Ative com violência os glúteos e a lombar para segurar a bacia alta.' }
    ]
  },
  {
    id: 'planche',
    name: 'Full Planche (Prancha Completa)',
    category: 'Skill',
    difficulty: 'Elite',
    type: 'isometric',
    primaryMuscles: ['ombros', 'peito', 'lombar', 'gluteos'],
    secondaryMuscles: ['triceps', 'abdomen', 'antebraco'],
    defaultSets: 4,
    defaultHoldSeconds: 5,
    defaultRestSeconds: 150,
    description: 'O Santo Graal da calistenia de empurrar. O corpo flutua completamente reto e paralelo ao solo sustentado unicamente pelas palmas das mãos.',
    breathingTip: 'Respire superficialmente mantendo toda a cadeia miofascial em contração máxima.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Habilidade de nível olímpico; execute apenas com autorização e base consolidada.'],
    padrao: 'skills',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['straddle-planche', 'tuck-planche'],
    progressoes: [],
    variacoes: ['straddle-planche'],
    adaptacoes: {
      punho: ['straddle-planche']
    },
    criterioAvanco: 'Manter 5 segundos sólidos de full planche perfeitamente horizontal',
    sinonimos: ['full planche', 'prancha completa calistenia'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posicionamento Inicial', description: 'Mãos firmes no solo com dedos abertos levemente virados para fora.' },
      { step: 2, title: 'Alinhamento em Bloco', description: 'Pernas unidas, pontas dos pés esticadas e tronco totalmente ativado.' },
      { step: 3, title: 'Voo Horizontal', description: 'Incline os ombros além do limite dos punhos até o corpo flutuar em linha reta estrita.' }
    ],
    commonMistakes: [
      { mistake: 'Arquear a lombar ou dobrar levemente os cotovelos', correction: 'Cotovelos 100% retos e corpo reto sem quebrar na cintura.' }
    ]
  },

  // ==========================================
  // FRONT LEVER
  // ==========================================
  {
    id: 'tuck-front-lever',
    name: 'Tuck Front Lever na Barra',
    category: 'Skill',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: ['costas', 'abdomen'],
    secondaryMuscles: ['antebraco', 'ombros', 'biceps'],
    defaultSets: 4,
    defaultHoldSeconds: 15,
    defaultRestSeconds: 60,
    description: 'Primeira progressão horizontal de puxada. Pendurado na barra com cotovelos retos e joelhos dobrados no peito, o corpo é sustentado na horizontal.',
    breathingTip: 'Expire empurrando a barra para baixo com braços retos.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha os cotovelos travados; a puxada é pura retração e depressão dorsal.'],
    padrao: 'skills',
    equipamento: ['barra'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['toes-to-bar', 'pullup'],
    progressoes: ['frontlever'],
    variacoes: ['dragon-flag-tuck'],
    adaptacoes: {
      ombro: ['remada-invertida-pes-elevados'],
      'sem-equipamento': ['dragon-flag-negativa']
    },
    criterioAvanco: 'Manter 4 séries de 20 segundos com costas retas paralelas ao teto',
    sinonimos: ['tuck front lever', 'front lever encolhido'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Suspensão com Braços Retos', description: 'Segure a barra em pegada pronada e trave os cotovelos esticados.' },
      { step: 2, title: 'Puxada Dorsal Reta', description: 'Empurre a barra para baixo com os braços rígidos como se fizesse um pullover.' },
      { step: 3, title: 'Tronco Horizontal', description: 'Dobre os joelhos no peito e nivele as costas horizontalmente com o chão.' }
    ],
    commonMistakes: [
      { mistake: 'Flexionar os cotovelos tentando ajudar com o bíceps', correction: 'Tranque as articulações dos cotovelos; o movimento vem do grande dorsal.' }
    ]
  },
  {
    id: 'frontlever',
    name: 'Front Lever Completo na Barra',
    category: 'Skill',
    difficulty: 'Elite',
    type: 'isometric',
    primaryMuscles: ['costas', 'abdomen', 'lombar'],
    secondaryMuscles: ['antebraco', 'ombros', 'gluteos'],
    defaultSets: 4,
    defaultHoldSeconds: 6,
    defaultRestSeconds: 120,
    description: 'Habilidade rainha de puxar na calistenia. O corpo inteiro fica suspenso em linha perfeitamente horizontal abaixo da barra com braços retos.',
    breathingTip: 'Respire em curtas expirações com dorsal armada em máxima retração.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não deixe os quadris desabarem abaixo da linha dos ombros.'],
    padrao: 'skills',
    equipamento: ['barra'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['tuck-front-lever', 'dragon-flag'],
    progressoes: [],
    variacoes: ['tuck-front-lever'],
    adaptacoes: {
      ombro: ['tuck-front-lever'],
      'sem-equipamento': ['dragon-flag']
    },
    criterioAvanco: 'Manter 6 segundos limpos sem afundar o quadril',
    sinonimos: ['front lever completo', 'alavanca frontal'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Pegada Firme na Barra', description: 'Segure a barra com pegada falsa ou pronada forte, escápulas deprimidas e retraídas.' },
      { step: 2, title: 'Puxada Estrita', description: 'Pressione a barra para baixo com os braços esticados erguendo o corpo em bloco.' },
      { step: 3, title: 'Linha Reta Horizontal', description: 'Trave glúteos, abdômen e pernas estendidas formando uma mesa suspensa no ar.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar o peito afundar e os ombros subirem', correction: 'Mantenha a retração e depressão escapular ativas do início ao fim.' }
    ]
  },

  // ==========================================
  // BACK LEVER
  // ==========================================
  {
    id: 'tuck-back-lever',
    name: 'Tuck Back Lever na Barra ou Argolas',
    category: 'Skill',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: ['lombar', 'gluteos', 'ombros'],
    secondaryMuscles: ['biceps', 'costas', 'peito'],
    defaultSets: 4,
    defaultHoldSeconds: 15,
    defaultRestSeconds: 60,
    description: 'Sustentação invertida em rotação posterior dos ombros (skin the cat) com corpo na horizontal e joelhos dobrados voltados para baixo.',
    breathingTip: 'Respire calmo sem entrar em pânico na posição invertida.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Pegada pronada é mais gentil para o tendão do bíceps nos estágios iniciais.'],
    padrao: 'skills',
    equipamento: ['barra'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['retracao-escapular-barra', 'superman'],
    progressoes: ['back-lever'],
    variacoes: ['superman'],
    adaptacoes: {
      cotovelo: ['retracao-escapular-barra'],
      'sem-equipamento': ['superman']
    },
    criterioAvanco: 'Manter 4 séries de 20 segundos confortáveis',
    sinonimos: ['tuck back lever', 'alavanca dorsal encolhida'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Giro Invertido', description: 'Passe os pés por entre os braços (skin the cat) ficando suspenso de costas.' },
      { step: 2, title: 'Encolhimento em Tuck', description: 'Dobre os joelhos no abdômen e desça o tronco até a linha horizontal.' },
      { step: 3, title: 'Sustentação dos Ombros', description: 'Ative o peitoral e bíceps segurando a rotação estendida com segurança.' }
    ],
    commonMistakes: [
      { mistake: 'Descer o corpo muito rápido estressando o bíceps', correction: 'Entre na posição com controle milimétrico.' }
    ]
  },
  {
    id: 'back-lever',
    name: 'Back Lever Completo',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: ['lombar', 'gluteos', 'ombros', 'peito'],
    secondaryMuscles: ['biceps', 'costas'],
    defaultSets: 4,
    defaultHoldSeconds: 6,
    defaultRestSeconds: 90,
    description: 'Corpo inteiro estendido na horizontal com a frente voltada para o chão, sustentado pela extensão posterior dos braços.',
    breathingTip: 'Respire controlado mantendo os glúteos e eretores da espinha totalmente travados.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Cuidado com o tendão do bíceps: treine extensões e condicionamento prévio dos cotovelos.'],
    padrao: 'skills',
    equipamento: ['barra'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['tuck-back-lever'],
    progressoes: [],
    variacoes: ['tuck-back-lever'],
    adaptacoes: {
      cotovelo: ['tuck-back-lever'],
      'sem-equipamento': ['superman']
    },
    criterioAvanco: 'Manter 4 séries de 8 segundos com corpo reto e paralelo',
    sinonimos: ['back lever completo', 'alavanca posterior'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Descida Guiada', description: 'Passe pela inversão de skin the cat esticando os braços com pegada firme.' },
      { step: 2, title: 'Extensão das Pernas', description: 'Estenda as pernas para trás unindo os pés e apontando os dedos.' },
      { step: 3, title: 'Alinhamento em Prancha Reversa', description: 'Sustente o corpo paralelo ao solo com peito aberto e escápulas protraídas.' }
    ],
    commonMistakes: [
      { mistake: 'Arquear a lombar quebrando a linha horizontal', correction: 'Mantenha a retroversão pélvica e glúteos em contração máxima.' }
    ]
  },

  // ==========================================
  // HUMAN FLAG
  // ==========================================
  {
    id: 'bandeira-humana-tuck',
    name: 'Bandeira Humana Tuck (Human Flag Encolhida)',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: ['ombros', 'abdomen', 'costas'],
    secondaryMuscles: ['triceps', 'biceps', 'gluteos'],
    defaultSets: 4,
    defaultHoldSeconds: 8,
    defaultRestSeconds: 90,
    description: 'Sustentação lateral em mastro ou espaldar com braço de baixo empurrando e o de cima puxando, mantendo joelhos recolhidos ao tórax.',
    breathingTip: 'Mantenha a expiração forçada gerando pressão intra-abdominal.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Alterne os lados para evitar desequilíbrios na musculatura lateral do tronco.'],
    padrao: 'skills',
    equipamento: ['barra'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['copenhagen-plank-pe', 'prancha-lateral-elevacao-quadril'],
    progressoes: ['bandeira-humana'],
    variacoes: ['copenhagen-plank-pe'],
    adaptacoes: {
      ombro: ['prancha-lateral'],
      'sem-equipamento': ['copenhagen-plank-pe']
    },
    criterioAvanco: 'Manter 10 segundos sustentados com cada lado',
    sinonimos: ['tuck human flag', 'bandeira humana encolhida'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Pegada no Poste', description: 'Segure a barra vertical com uma mão em cima puxando e a mão de baixo empurrando com braço reto.' },
      { step: 2, title: 'Elevação em Tuck', description: 'Puxe os joelhos ao peito e salte suavemente erguendo a pelve na horizontal.' },
      { step: 3, title: 'Equilíbrio de Forças', description: 'Equilibre o empurrão do braço inferior com a tração do superior.' }
    ],
    commonMistakes: [
      { mistake: 'Dobrar o braço de baixo perdendo o apoio de pilar', correction: 'O braço inferior funciona como uma estaca rígida travada.' }
    ]
  },
  {
    id: 'bandeira-humana',
    name: 'Bandeira Humana Completa (Full Human Flag)',
    category: 'Skill',
    difficulty: 'Elite',
    type: 'isometric',
    primaryMuscles: ['ombros', 'abdomen', 'costas', 'gluteos'],
    secondaryMuscles: ['triceps', 'biceps', 'antebraco'],
    defaultSets: 4,
    defaultHoldSeconds: 5,
    defaultRestSeconds: 120,
    description: 'Uma das poses estéticas mais impressionantes do mundo físico. O corpo flutua na horizontal perpendicular a um mastro como uma bandeira ao vento.',
    breathingTip: 'Respire em pequenas e intensas expirações mantendo o tronco como aço.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Exige força absurda de deltóides, grande dorsal e oblíquos.'],
    padrao: 'skills',
    equipamento: ['barra'],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['bandeira-humana-tuck'],
    progressoes: [],
    variacoes: ['bandeira-humana-tuck'],
    adaptacoes: {
      ombro: ['bandeira-humana-tuck'],
      'sem-equipamento': ['copenhagen-plank-pe']
    },
    criterioAvanco: 'Manter 5 segundos retos e horizontais em ambos os lados',
    sinonimos: ['full human flag', 'bandeira humana estrita'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Fixação das Mãos', description: 'Trave pegada forte em mastro vertical: braço de baixo empurra com palma para cima/frente, braço de cima puxa com pegada pronada.' },
      { step: 2, title: 'Extensão em Alavanca', description: 'Eleve o tronco estendendo as pernas unidas com pontas dos pés esticadas.' },
      { step: 3, title: 'Linha Perfeita', description: 'Sustente o corpo inteiro reto e paralelo ao chão sustentado pelas forças opostas dos braços.' }
    ],
    commonMistakes: [
      { mistake: 'Girar o peito para o chão perdendo a orientação lateral', correction: 'Mantenha o peito voltado perpendicularmente para frente.' }
    ]
  }
];
