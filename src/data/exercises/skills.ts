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
    regressoes: ['lsit-pes-chao', 'hollowbody', 'prancha-joelhos'],
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
    progressoes: ['straddle-planche', 'planche', 'adv-tuck-planche'],
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
    progressoes: ['frontlever', 'adv-tuck-front-lever'],
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
    progressoes: ['back-lever', 'adv-tuck-back-lever'],
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
    progressoes: ['bandeira-humana', 'bandeira-humana-straddle'],
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
  },
  {
    id: 'adv-tuck-planche',
    name: 'Advanced Tuck Planche',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: [
      'ombros',
      'peito',
      'abdomen'
    ],
    secondaryMuscles: [
      'triceps',
      'antebraco',
      'lombar'
    ],
    defaultSets: 4,
    defaultHoldSeconds: 10,
    defaultRestSeconds: 90,
    description: 'Evolução crucial do tuck planche onde o quadril se abre para 90° em relação ao tronco e as costas ficam retas, aumentando consideravelmente o torque sobre os deltoides anteriores.',
    breathingTip: 'Respire de forma controlada mantendo protração escapular máxima e abdômen engajado.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Pare imediatamente se sentir queimação no tendão do bíceps braquial.'
    ],
    padrao: 'skills',
    equipamento: [
      'nenhum'
    ],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: [
      'tuck-planche'
    ],
    progressoes: [
      'planche-uma-perna'
    ],
    variacoes: [
      'tuck-planche'
    ],
    adaptacoes: {
      punho: [
        'planche-lean'
      ],
      ombro: [
        'tuck-planche'
      ],
      semEquipamento: [
        'adv-tuck-planche'
      ]
    },
    criterioAvanco: 'Sustentar 4 séries de 12 segundos com costas planas e coxas a 90°',
    sinonimos: [
      'advanced tuck planche',
      'planche tuck avançado',
      'adv tuck planche'
    ],
    animationType: 'planche',
    executionSteps: [
      {
        step: 1,
        title: 'Entrada a Partir do Tuck',
        description: 'Assuma a sustentação em tuck planche com braços retos e escápulas em protração.'
      },
      {
        step: 2,
        title: 'Abertura do Quadril a 90°',
        description: 'Afaste os joelhos do peito até que as coxas formem 90° com o tronco e as costas fiquem planas.'
      },
      {
        step: 3,
        title: 'Inclinação e Bloqueio',
        description: 'Incline os ombros para a frente compensando o aumento da alavanca com os braços estendidos.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Perder a protração escapular afundando o peito',
        correction: 'Empurre o chão com força afastando as escápulas em cúpula convexa.'
      },
      {
        mistake: 'Flexionar os cotovelos para aliviar a carga no bíceps',
        correction: 'Mantenha os braços 100% retos travados com bíceps voltados para a frente.'
      }
    ]
  },
  {
    id: 'planche-uma-perna',
    name: 'Planche com Uma Perna Estendida',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: [
      'ombros',
      'peito',
      'lombar'
    ],
    secondaryMuscles: [
      'gluteos',
      'abdomen',
      'triceps',
      'antebraco'
    ],
    defaultSets: 4,
    defaultHoldSeconds: 8,
    defaultRestSeconds: 90,
    description: 'Variação assimétrica preparatória para a straddle planche, onde uma perna fica estendida em linha com o corpo e a outra permanece dobrada no tuck.',
    breathingTip: 'Mantenha respiração ritmada sustentando a inclinação profunda dos ombros.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Mantenha aquecimento minucioso dos punhos e bíceps antes da execução.'
    ],
    padrao: 'skills',
    equipamento: [
      'nenhum'
    ],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: [
      'adv-tuck-planche'
    ],
    progressoes: [
      'straddle-planche'
    ],
    variacoes: [
      'adv-tuck-planche'
    ],
    adaptacoes: {
      punho: [
        'adv-tuck-planche'
      ],
      semEquipamento: [
        'planche-uma-perna'
      ]
    },
    criterioAvanco: 'Sustentar 4 séries de 10 segundos cada lado com alinhamento horizontal',
    sinonimos: [
      'one leg planche',
      'single leg planche',
      'planche uma perna'
    ],
    animationType: 'planche',
    executionSteps: [
      {
        step: 1,
        title: 'Base de Tuck Avançado',
        description: 'Inicie no advanced tuck planche com escápulas protraídas e braços estendidos.'
      },
      {
        step: 2,
        title: 'Extensão de Uma Perna',
        description: 'Estenda uma das pernas para trás em linha reta com o tronco, mantendo a outra encolhida.'
      },
      {
        step: 3,
        title: 'Equilíbrio da Alavanca',
        description: 'Incline ligeiramente mais os ombros à frente para equilibrar a extensão da perna.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Deixar a perna estendida cair abaixo da linha do tronco',
        correction: 'Ative o glúteo e a lombar para sustentar a perna perfeitamente horizontal.'
      },
      {
        mistake: 'Girar o quadril para o lado da perna dobrada',
        correction: 'Mantenha a bacia rigorosamente paralela ao solo.'
      }
    ]
  },
  {
    id: 'adv-tuck-front-lever',
    name: 'Advanced Tuck Front Lever',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: [
      'costas',
      'abdomen'
    ],
    secondaryMuscles: [
      'antebraco',
      'ombros',
      'biceps',
      'lombar'
    ],
    defaultSets: 4,
    defaultHoldSeconds: 10,
    defaultRestSeconds: 90,
    description: 'Evolução do tuck front lever onde as coxas se abrem a 90° em relação ao tronco e as costas ficam retas, aumentando a sobrecarga dorsal de puxada estática.',
    breathingTip: 'Expire ao assumir a posição; respire continuamente pelo diafragma com o core travado.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Mantenha depressão escapular ativa para proteger os ombros.'
    ],
    padrao: 'skills',
    equipamento: [
      'barra'
    ],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: [
      'tuck-front-lever'
    ],
    progressoes: [
      'front-lever-uma-perna'
    ],
    variacoes: [
      'tuck-front-lever'
    ],
    adaptacoes: {
      ombro: [
        'tuck-front-lever'
      ],
      semEquipamento: [
        'dragon-flag-tuck'
      ]
    },
    criterioAvanco: 'Sustentar 4 séries de 12 segundos com costas perfeitamente horizontais e coxas a 90°',
    sinonimos: [
      'advanced tuck front lever',
      'front lever tuck avançado',
      'adv tuck front lever'
    ],
    animationType: 'frontlever',
    executionSteps: [
      {
        step: 1,
        title: 'Suspensão e Puxada de Braços Retos',
        description: 'Empurre a barra para baixo com braços esticados trazendo o tronco para a linha horizontal.'
      },
      {
        step: 2,
        title: 'Abertura das Pernas a 90°',
        description: 'Afaste os joelhos do peito até as coxas formarem um ângulo reto com o tronco e as costas ficarem planas.'
      },
      {
        step: 3,
        title: 'Sustentação Rígida',
        description: 'Trave as dorsais e mantenha a cabeça neutra alinhada ao tronco.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Deixar o quadril cair abaixo da linha dos ombros',
        correction: 'Pressione a barra com força para baixo como se fizesse um pullover estático.'
      },
      {
        mistake: 'Dobrar os cotovelos para facilitar o movimento',
        correction: 'Mantenha os cotovelos totalmente estendidos com tríceps engajados.'
      }
    ]
  },
  {
    id: 'front-lever-uma-perna',
    name: 'Front Lever com Uma Perna Estendida',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: [
      'costas',
      'abdomen'
    ],
    secondaryMuscles: [
      'antebraco',
      'ombros',
      'gluteos',
      'lombar'
    ],
    defaultSets: 4,
    defaultHoldSeconds: 8,
    defaultRestSeconds: 90,
    description: 'Variação assimétrica preparatória onde uma perna se projeta totalmente estendida na horizontal e a outra permanece dobrada, equilibrando a transição para a straddle.',
    breathingTip: 'Mantenha a parede abdominal compacta e respirações curtas e controladas.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Não realize balanços bruscos ao entrar na posição.'
    ],
    padrao: 'skills',
    equipamento: [
      'barra'
    ],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: [
      'adv-tuck-front-lever'
    ],
    progressoes: [
      'straddle-front-lever'
    ],
    variacoes: [
      'adv-tuck-front-lever'
    ],
    adaptacoes: {
      ombro: [
        'adv-tuck-front-lever'
      ],
      semEquipamento: [
        'dragon-flag-uma-perna'
      ]
    },
    criterioAvanco: 'Manter 4 séries de 10 segundos cada lado com corpo paralelo ao solo',
    sinonimos: [
      'one leg front lever',
      'single leg front lever',
      'front lever uma perna'
    ],
    animationType: 'frontlever',
    executionSteps: [
      {
        step: 1,
        title: 'Elevação a Partir do Tuck Avançado',
        description: 'Eleve o corpo até a horizontal em advanced tuck com braços esticados.'
      },
      {
        step: 2,
        title: 'Extensão de Uma Perna',
        description: 'Estenda uma perna reta à frente apontando a ponta do pé, mantendo a outra flexionada.'
      },
      {
        step: 3,
        title: 'Sustentação e Alternância',
        description: 'Segure a posição com máxima contração dorsal e alterne o lado em séries sucessivas.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Girar a bacia para o lado da perna dobrada',
        correction: 'Mantenha o quadril alinhado horizontalmente sem rotação do quadril.'
      },
      {
        mistake: 'Perder a depressão escapular deixando o peito afundar',
        correction: 'Traga as escápulas para baixo empurrando a barra ativamente.'
      }
    ]
  },
  {
    id: 'straddle-front-lever',
    name: 'Straddle Front Lever',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: [
      'costas',
      'abdomen'
    ],
    secondaryMuscles: [
      'antebraco',
      'ombros',
      'gluteos',
      'lombar'
    ],
    defaultSets: 4,
    defaultHoldSeconds: 6,
    defaultRestSeconds: 90,
    description: 'Front lever completo executado com as pernas abertas em abdução máxima, encurtando o braço de alavanca e servindo de ponte direta para o full front lever.',
    breathingTip: 'Expulse o ar na entrada; respire com o abdômen e grande dorsal sob máxima contração.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Aqueça bem os adutores e isquiotibiais para permitir maior abertura das pernas.'
    ],
    padrao: 'skills',
    equipamento: [
      'barra'
    ],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: [
      'front-lever-uma-perna',
      'adv-tuck-front-lever'
    ],
    progressoes: [
      'frontlever'
    ],
    variacoes: [
      'front-lever-uma-perna'
    ],
    adaptacoes: {
      ombro: [
        'adv-tuck-front-lever'
      ],
      semEquipamento: [
        'dragon-flag'
      ]
    },
    criterioAvanco: 'Sustentar 4 séries de 8 segundos com pernas afastadas e corpo estritamente horizontal',
    sinonimos: [
      'straddle front lever',
      'front lever straddle',
      'front lever pernas abertas'
    ],
    animationType: 'frontlever',
    executionSteps: [
      {
        step: 1,
        title: 'Tracionamento com Braços Retos',
        description: 'Puxe a barra para baixo com cotovelos travados elevando o corpo do chão.'
      },
      {
        step: 2,
        title: 'Abertura Máxima em Straddle',
        description: 'Abra as pernas estendidas o mais amplamente possível mantendo os joelhos travados e pontas dos pés esticadas.'
      },
      {
        step: 3,
        title: 'Bloqueio na Horizontal',
        description: 'Alinhe cabeça, tronco e quadris em um único plano horizontal com o solo.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Deixar o quadril dobrar em formato de V (pique)',
        correction: 'Aperte os glúteos intensamente para manter a extensão do quadril perfeita.'
      },
      {
        mistake: 'Dobrar os joelhos durante a sustentação',
        correction: 'Trave os quadríceps e aponte os pés para manter as pernas retas.'
      }
    ]
  },
  {
    id: 'adv-tuck-back-lever',
    name: 'Advanced Tuck Back Lever',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: [
      'lombar',
      'gluteos',
      'ombros'
    ],
    secondaryMuscles: [
      'biceps',
      'costas',
      'peito'
    ],
    defaultSets: 4,
    defaultHoldSeconds: 10,
    defaultRestSeconds: 90,
    description: 'Variação intermediária de alavanca posterior onde as coxas formam 90° com o tronco e as costas se mantêm planas na linha horizontal viradas para o solo.',
    breathingTip: 'Respire continuamente com o abdômen e glúteos contraídos, sustentando a pressão nos ombros.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Aqueça a extensão de ombro e o tendão do bíceps distal antes da execução.'
    ],
    padrao: 'skills',
    equipamento: [
      'barra'
    ],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: [
      'tuck-back-lever'
    ],
    progressoes: [
      'back-lever-uma-perna'
    ],
    variacoes: [
      'tuck-back-lever'
    ],
    adaptacoes: {
      ombro: [
        'tuck-back-lever'
      ],
      semEquipamento: [
        'superman'
      ]
    },
    criterioAvanco: 'Sustentar 4 séries de 12 segundos com alinhamento horizontal das costas e coxas a 90°',
    sinonimos: [
      'advanced tuck back lever',
      'back lever tuck avançado',
      'adv tuck back lever'
    ],
    animationType: 'frontlever',
    executionSteps: [
      {
        step: 1,
        title: 'Descida a Partir do Skin the Cat',
        description: 'Passe as pernas pela barra até a posição invertida virada para baixo.'
      },
      {
        step: 2,
        title: 'Abertura das Coxas a 90°',
        description: 'Afaste os joelhos do peito até as coxas ficarem a 90° do tronco e as costas planas.'
      },
      {
        step: 3,
        title: 'Sustentação na Horizontal',
        description: 'Empurre a barra para trás sustentando o corpo paralelo ao solo com braços retos.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Deixar o quadril subir acima da linha dos ombros',
        correction: 'Mantenha os quadris e ombros na mesma altura horizontal.'
      },
      {
        mistake: 'Flexionar os cotovelos',
        correction: 'Mantenha os braços completamente estendidos com os cotovelos travados.'
      }
    ]
  },
  {
    id: 'back-lever-uma-perna',
    name: 'Back Lever com Uma Perna Estendida',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: [
      'lombar',
      'gluteos',
      'ombros'
    ],
    secondaryMuscles: [
      'peito',
      'biceps',
      'costas',
      'abdomen'
    ],
    defaultSets: 4,
    defaultHoldSeconds: 8,
    defaultRestSeconds: 90,
    description: 'Variação de back lever em que uma perna é totalmente estendida para trás e a outra se mantém dobrada, aumentando gradualmente a alavanca em direção ao full.',
    breathingTip: 'Mantenha respiração constante sustentando a extensão do quadril com glúteos contraídos.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Não solte os ombros bruscamente no final da série.'
    ],
    padrao: 'skills',
    equipamento: [
      'barra'
    ],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: [
      'adv-tuck-back-lever'
    ],
    progressoes: [
      'back-lever'
    ],
    variacoes: [
      'adv-tuck-back-lever'
    ],
    adaptacoes: {
      ombro: [
        'adv-tuck-back-lever'
      ],
      semEquipamento: [
        'superman'
      ]
    },
    criterioAvanco: 'Manter 4 séries de 10 segundos cada lado com tronco e perna estendida perfeitamente alinhados',
    sinonimos: [
      'one leg back lever',
      'single leg back lever',
      'back lever uma perna'
    ],
    animationType: 'frontlever',
    executionSteps: [
      {
        step: 1,
        title: 'Posicionamento Inicial',
        description: 'Entre em advanced tuck back lever com o corpo alinhado na horizontal.'
      },
      {
        step: 2,
        title: 'Extensão de Uma Perna',
        description: 'Estenda uma perna para trás mantendo os glúteos e quadríceps contraídos e a outra perna dobrada.'
      },
      {
        step: 3,
        title: 'Sustentação Isométrica',
        description: 'Sustente o corpo imóvel paralelo ao solo e alterne a perna nas séries seguintes.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Arquear excessivamente a lombar',
        correction: 'Contraia o abdômen e estenda a perna a partir do glúteo sem hiperextensão da coluna.'
      },
      {
        mistake: 'Girar o quadril para o lado',
        correction: 'Mantenha os quadris paralelos ao chão.'
      }
    ]
  },
  {
    id: 'skin-the-cat',
    name: 'Skin the Cat (Passagem de Ombros na Barra)',
    category: 'Skill',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: [
      'ombros',
      'costas'
    ],
    secondaryMuscles: [
      'biceps',
      'abdomen',
      'peito',
      'antebraco'
    ],
    defaultSets: 3,
    defaultReps: 5,
    defaultRestSeconds: 75,
    description: 'Movimento ginástico dinâmico fundamental onde o corpo gira 360° através dos braços na barra ou argolas até a posição de suspensão invertida em extensão profunda de ombro.',
    breathingTip: 'Inspire ao puxar os joelhos para a rotação; expire ao descer na extensão máxima de ombro.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Desça apenas até a amplitude de ombro confortável e controlável para retornar com força própria.'
    ],
    padrao: 'skills',
    equipamento: [
      'barra'
    ],
    tipoExercicio: 'skill',
    estatico: false,
    cadencia: '3-1-3',
    regressoes: [
      'dead-hang',
      'elevacao-joelhos-barra'
    ],
    progressoes: [
      'tuck-back-lever'
    ],
    variacoes: [
      'tuck-back-lever'
    ],
    adaptacoes: {
      ombro: [
        'dead-hang'
      ],
      semEquipamento: [
        'alongamento-rotacao-coluna'
      ]
    },
    criterioAvanco: 'Executar 3 séries de 6 repetições controladas do início ao fim sem tocar os pés no chão',
    sinonimos: [
      'skin the cat',
      'passagem de ombros barra',
      'german hang rotation'
    ],
    animationType: 'pullup',
    executionSteps: [
      {
        step: 1,
        title: 'Puxada em Inversão',
        description: 'Pendurado na barra, puxe os joelhos ao peito e passe as pernas entre os braços em rotação contínua.'
      },
      {
        step: 2,
        title: 'Descida em German Hang',
        description: 'Desça o quadril e pernas para trás com os braços esticados sentindo o alongamento dos ombros e peitorais.'
      },
      {
        step: 3,
        title: 'Tração de Retorno',
        description: 'Puxe o corpo de volta com a força das dorsais e abdômen até a posição inicial de dead hang.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Soltar a pegada ou despencar na descida do German Hang',
        correction: 'Mantenha a musculatura escapular e o abdômen ativos controlando cada centímetro da descida.'
      },
      {
        mistake: 'Fazer o movimento com impulsos ou trancos bruscos',
        correction: 'Execute o giro com suavidade e velocidade lenta e constante.'
      }
    ]
  },
  {
    id: 'bandeira-humana-straddle',
    name: 'Bandeira Humana Straddle',
    category: 'Skill',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: [
      'ombros',
      'abdomen',
      'costas'
    ],
    secondaryMuscles: [
      'triceps',
      'biceps',
      'gluteos'
    ],
    defaultSets: 4,
    defaultHoldSeconds: 5,
    defaultRestSeconds: 90,
    description: 'Variação de bandeira humana em barra vertical ou poste onde as pernas se abrem em straddle (afastadas), reduzindo o braço de alavanca e facilitando a sustentação horizontal.',
    breathingTip: 'Expulse o ar ao subir na horizontal; mantenha respirações superficiais sob tensão muscular extrema.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Alterne os lados para evitar desequilíbrios de força e sobrecarga assimétrica na coluna.'
    ],
    padrao: 'skills',
    equipamento: [
      'barra'
    ],
    tipoExercicio: 'skill',
    estatico: true,
    cadencia: 'isometria',
    regressoes: [
      'bandeira-humana-tuck'
    ],
    progressoes: [
      'bandeira-humana'
    ],
    variacoes: [
      'bandeira-humana-tuck'
    ],
    adaptacoes: {
      ombro: [
        'bandeira-humana-tuck'
      ],
      semEquipamento: [
        'prancha-lateral'
      ]
    },
    criterioAvanco: 'Sustentar 4 séries de 6 segundos cada lado perfeitamente na linha horizontal',
    sinonimos: [
      'straddle human flag',
      'bandeira humana pernas abertas',
      'human flag straddle'
    ],
    animationType: 'frontlever',
    executionSteps: [
      {
        step: 1,
        title: 'Pegada no Poste ou Barra Vertical',
        description: 'Braço inferior estendido empurrando o suporte e braço superior fletido puxando com pegada firme.'
      },
      {
        step: 2,
        title: 'Elevação com Pernas Afastadas',
        description: 'Eleve o corpo abrindo as pernas o máximo possível em straddle para encurtar a alavanca lateral.'
      },
      {
        step: 3,
        title: 'Sustentação na Linha Horizontal',
        description: 'Trave os oblíquos e o grande dorsal mantendo o corpo perpendicular ao poste.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Deixar o quadril ceder para baixo perdendo o alinhamento',
        correction: 'Empurre com máxima força o braço de baixo e contraia o oblíquo superior.'
      },
      {
        mistake: 'Girar o peito para cima virado para o céu',
        correction: 'Mantenha o peito virado para a frente em plano estritamente frontal.'
      }
    ]
  },
  {
    id: 'chute-parada-maos',
    name: 'Chute para Parada de Mãos (Kick-up)',
    category: 'Skill',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: [
      'ombros',
      'abdomen'
    ],
    secondaryMuscles: [
      'triceps',
      'antebraco',
      'gluteos'
    ],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSeconds: 60,
    description: 'Treino de entrada dinâmica e controle de subida para o handstand contra a parede ou no solo livre, desenvolvendo a dosagem precisa de força da perna de impulso e tração dos dedos.',
    breathingTip: 'Inspire na preparação do passo; expire no momento do chute mantendo o core compacto.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Pratique inicialmente com uma parede de segurança atrás para evitar quedas descontroladas.'
    ],
    padrao: 'skills',
    equipamento: [
      'parede'
    ],
    tipoExercicio: 'skill',
    estatico: false,
    cadencia: '1-1-1',
    regressoes: [
      'prancha-peito-parede'
    ],
    progressoes: [
      'handstand',
      'handstand-livre'
    ],
    variacoes: [
      'prancha-peito-parede'
    ],
    adaptacoes: {
      punho: [
        'prancha-peito-parede'
      ],
      semEquipamento: [
        'chute-parada-maos'
      ]
    },
    criterioAvanco: 'Completar 3 séries de 6 entradas suaves controlando o pouso contra a parede sem impacto ruidoso',
    sinonimos: [
      'handstand kick up',
      'entrada de parada de mãos',
      'chute para pino'
    ],
    animationType: 'handstand',
    executionSteps: [
      {
        step: 1,
        title: 'Posição de Saída em Afundo',
        description: 'Fique em pé de frente para a parede, dê um passo à frente apoiando as mãos no solo a ~20 cm da parede.'
      },
      {
        step: 2,
        title: 'Chute e Elevação da Perna Guia',
        description: 'Chute a perna de trás com força controlada e empurre o chão com a perna de base elevando os quadris.'
      },
      {
        step: 3,
        title: 'Pouso Suave dos Calcanhares',
        description: 'Encoste os calcanhares suavemente na parede com braços travados e ombros ativos em elevação.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Chutar com força excessiva batendo os pés ruidosamente na parede',
        correction: 'Dose a força do chute para subir com fluidez apenas até a verticalidade.'
      },
      {
        mistake: 'Dobrar os cotovelos ao tocar as mãos no chão',
        correction: 'Trave os cotovelos antes de chutar mantendo os braços como pilares rígidos.'
      }
    ]
  }
];
