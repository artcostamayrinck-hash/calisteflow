import type { Exercise } from '../../types';
import { CREF_REVIEWER_SPECIALIST } from './reviewer';

export const CORE_EXERCISES: Exercise[] = [
  // ==========================================
  // CORE ANTERIOR
  // ==========================================
  {
    id: 'prancha-joelhos',
    name: 'Prancha Isométrica com Joelhos no Chão',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['lombar', 'ombros'],
    defaultSets: 3,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 45,
    description: 'Regressão de prancha que reduz o braço de alavanca apoiando os joelhos no chão, ideal para aprender a retroversão pélvica sem sobrecarregar a lombar.',
    breathingTip: 'Respire continuamente pelo diafragma mantendo a parede abdominal tensa e engajada.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não deixe o quadril desabar em hiperextensão lombar.'],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['dead-bug'],
    progressoes: ['plank'],
    variacoes: ['dead-bug'],
    adaptacoes: {
      lombar: ['dead-bug'],
      punho: ['prancha-joelhos']
    },
    criterioAvanco: 'Manter 3 séries de 45 segundos com postura impecável',
    sinonimos: ['knee plank', 'prancha iniciante'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Apoio de Antebraços', description: 'Apoie os cotovelos sob os ombros e os joelhos no chão.' },
      { step: 2, title: 'Retroversão Pélvica', description: 'Puxe o umbigo para a coluna e aperte os glúteos alinhando joelhos, quadril e ombros.' },
      { step: 3, title: 'Sustentação', description: 'Empurre o chão afastando as escápulas e mantenha o pescoço neutro.' }
    ],
    commonMistakes: [
      { mistake: 'Quadril elevado como uma pirâmide', correction: 'Abaixe ligeiramente o quadril alinhando-o ao tronco e ative o abdômen.' }
    ]
  },
  {
    id: 'plank',
    name: 'Prancha Tradicional no Solo',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['lombar', 'ombros', 'gluteos'],
    defaultSets: 3,
    defaultHoldSeconds: 45,
    defaultRestSeconds: 60,
    description: 'Exercício estático de sustentação corporal que desenvolve estabilidade do tronco e resistência muscular do core anterior.',
    breathingTip: 'Evite apneia: respire de forma controlada mantendo o tônus muscular profundo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Se sentir pinçamento na lombar, interrompa e faça a regressão nos joelhos.'],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['prancha-joelhos', 'dead-bug'],
    progressoes: ['prancha-toque-ombro', 'prancha-elevacao-perna', 'hollowbody'],
    variacoes: ['prancha-toque-ombro', 'prancha-lateral'],
    adaptacoes: {
      lombar: ['prancha-joelhos', 'dead-bug'],
      punho: ['plank'],
      ombro: ['dead-bug']
    },
    criterioAvanco: 'Manter 3 séries de 60 segundos com coluna e pelve neutras',
    sinonimos: ['prancha frontal', 'forearm plank'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posição Inicial', description: 'Deite de bruços e apoie os antebraços no chão alinhados aos ombros.' },
      { step: 2, title: 'Elevação do Corpo', description: 'Suba o quadril e apoie as pontas dos pés, mantendo o corpo reto.' },
      { step: 3, title: 'Sustentação', description: 'Contraia o abdômen e os glúteos intensamente durante todo o tempo estipulado.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar o quadril ceder curvando a lombar', correction: 'Aperte os glúteos e contraia o abdômen como se recebesse um soco.' }
    ]
  },
  {
    id: 'prancha-toque-ombro',
    name: 'Prancha com Toque nos Ombros',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['ombros', 'gluteos', 'peito'],
    defaultSets: 3,
    defaultReps: 16,
    defaultRestSeconds: 60,
    description: 'Variação anti-rotacional da prancha alta, exigindo que o core mantenha a estabilidade pélvica enquanto uma das mãos é retirada do chão.',
    breathingTip: 'Solte o ar a cada toque e inspire na transição de apoio.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não gire os quadris para os lados durante o toque.'],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['plank', 'prancha-joelhos'],
    progressoes: ['prancha-elevacao-perna', 'hollowbody', 'elevacao-pernas-chao'],
    variacoes: ['prancha-joelhos'],
    adaptacoes: {
      punho: ['plank'],
      lombar: ['dead-bug']
    },
    criterioAvanco: '3x20 toques (10 por lado) sem oscilação visível da pelve',
    sinonimos: ['shoulder taps', 'prancha anti-rotacional'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Prancha Alta', description: 'Fique na posição de flexão com braços estendidos e pés ligeiramente afastados.' },
      { step: 2, title: 'Toque Alternado', description: 'Retire a mão direita e toque o ombro esquerdo de forma controlada.' },
      { step: 3, title: 'Alternância', description: 'Retorne ao solo e repita com a mão esquerda no ombro direito sem balançar o quadril.' }
    ],
    commonMistakes: [
      { mistake: 'Balançar o quadril exageradamente de um lado para o outro', correction: 'Afaste mais as pernas e fixe o quadril no lugar.' }
    ]
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug (Inseto Morto)',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['lombar'],
    defaultSets: 3,
    defaultReps: 14,
    defaultRestSeconds: 45,
    description: 'Exercício de controle motor e estabilidade profunda do core onde a coluna lombar deve permanecer 100% colada ao chão enquanto braços e pernas opostos se estendem.',
    breathingTip: 'Solte o ar ao estender o braço e perna; inspire retornando ao centro.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Se a lombar sair do solo, reduza a amplitude da perna.'],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: [],
    progressoes: ['dead-bug-perna-estendida', 'hollow-hold-tuck', 'plank'],
    variacoes: ['hollow-hold-tuck'],
    adaptacoes: {
      lombar: ['dead-bug'],
      ombro: ['dead-bug'],
      punho: ['dead-bug']
    },
    criterioAvanco: '3x16 repetições lentas mantendo contato lombar total',
    sinonimos: ['dead bug anti-extensão', 'estabilização lombar'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posição Supina', description: 'Deite de costas com braços apontados para o teto e joelhos dobrados a 90° sobre os quadris.' },
      { step: 2, title: 'Contato Lombar', description: 'Pressione toda a lombar contra o colchonete eliminando qualquer vão.' },
      { step: 3, title: 'Extensão Cruzada', description: 'Desça o braço direito atrás da cabeça e estenda a perna esquerda sem tocar o chão nem desgrudar a lombar.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar a coluna arquear e o abdômen saltar', correction: 'Empurre as costelas para baixo e não desça a perna tão longe.' }
    ]
  },
  {
    id: 'hollow-hold-tuck',
    name: 'Hollow Hold Tuck (Canoa Dobrada)',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['lombar', 'quadriceps'],
    defaultSets: 3,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 45,
    description: 'Posição de canoa com joelhos flexionados junto ao peito, reduzindo o torque na coluna enquanto ensina a compressão do abdômen e protrusão torácica.',
    breathingTip: 'Respire em pequenas inspirações sem relaxar a parede abdominal.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['A região lombar precisa ficar totalmente colada ao solo.'],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['dead-bug'],
    progressoes: ['hollow-hold-uma-perna', 'hollowbody'],
    variacoes: ['dead-bug'],
    adaptacoes: {
      lombar: ['dead-bug'],
      punho: ['hollow-hold-tuck']
    },
    criterioAvanco: 'Manter 3 séries de 40 segundos com escápulas e cabeça suspensas',
    sinonimos: ['tuck hollow body', 'canoa dobrada'],
    animationType: 'hollowbody',
    executionSteps: [
      { step: 1, title: 'Deitar de Costas', description: 'Deite-se no colchonete com joelhos flexionados a 90°.' },
      { step: 2, title: 'Retirar Escápulas', description: 'Eleve a cabeça e as escápulas do chão, esticando os braços à frente paralelos ao solo.' },
      { step: 3, title: 'Esmagar o Chão', description: 'Pressione com firmeza a coluna lombar para baixo sustentando a tensão no abdômen.' }
    ],
    commonMistakes: [
      { mistake: 'Descansar as escápulas no chão', correction: 'Enrole o tronco levantando o peitoral em direção ao umbigo.' }
    ]
  },
  {
    id: 'hollowbody',
    name: 'Hollow Body Hold (Canoa Completa)',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['quadriceps', 'lombar', 'ombros'],
    defaultSets: 3,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 60,
    description: 'A postura fundamental de ginástica e calistenia. Forma uma curvatura côncava contínua do corpo com pernas estendidas e braços acima da cabeça.',
    breathingTip: 'Mantenha a respiração superficial e contínua sob forte tensão abdominal.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Se a lombar sair do solo por 1 milímetro, encolha os joelhos para a versão tuck.'],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['hollow-hold-uma-perna', 'hollow-hold-tuck', 'dead-bug'],
    progressoes: ['hollow-rock', 'elevacao-pernas-barra', 'dragon-flag-tuck'],
    variacoes: ['hollow-hold-tuck'],
    adaptacoes: {
      lombar: ['hollow-hold-tuck', 'dead-bug'],
      ombro: ['hollow-hold-tuck']
    },
    criterioAvanco: 'Manter 3 séries de 45 segundos em alinhamento perfeito',
    sinonimos: ['canoa calistenia', 'hollow body hold'],
    animationType: 'hollowbody',
    executionSteps: [
      { step: 1, title: 'Posição Inicial', description: 'Deite-se com braços esticados para trás colados às orelhas e pernas juntas.' },
      { step: 2, title: 'Elevação Côncava', description: 'Tire os pés (15 a 20 cm) e as escápulas do chão simultaneamente.' },
      { step: 3, title: 'Bloqueio do Core', description: 'Aponte os pés, contraia quadríceps, glúteos e abdômen esmagando a lombar contra o solo.' }
    ],
    commonMistakes: [
      { mistake: 'Arquear a lombar criando espaço sob a coluna', correction: 'Suba um pouco as pernas ou dobre levemente os joelhos até a lombar colar de novo.' }
    ]
  },
    {
    id: 'elevacao-joelhos-deitado',
    name: 'Elevação de Joelhos Deitado no Solo',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['quadriceps', 'lombar'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 45,
    description: 'Exercício de base e regressão direta do reverse crunch, focado em flexão do quadril com joelhos flexionados a 90° mantendo a coluna lombar estável no solo.',
    breathingTip: 'Expire ao puxar os joelhos até a linha do quadril; inspire ao retornar os pés em direção ao solo.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Mantenha a região lombar sempre em contato com o solo.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: [],
    progressoes: ['elevacao-joelhos-chao', 'elevacao-pernas-chao'],
    variacoes: ['dead-bug'],
    adaptacoes: {
      lombar: ['dead-bug'],
      pescoco: ['dead-bug'],
      semEquipamento: ['elevacao-joelhos-deitado']
    },
    criterioAvanco: 'Completar 3 séries de 15 repetições controladas com lombar 100% apoiada',
    sinonimos: ['lying knee raise', 'elevação de joelhos no chão', 'knee tuck solo', 'elevação de joelhos deitado'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posição Inicial Deitado', description: 'Deite-se de costas com a coluna lombar colada ao solo e braços estendidos ao longo do corpo.' },
      { step: 2, title: 'Flexão dos Joelhos a 90°', description: 'Eleve os joelhos flexionados a 90° até que as coxas fiquem perpendiculares ao solo.' },
      { step: 3, title: 'Retorno com Controle', description: 'Abaixe as pernas de volta até as pontas dos pés quase tocarem o chão, sem perder a pressão lombar no piso.' }
    ],
    commonMistakes: [
      { mistake: 'Arquear a lombar criando espaço entre as costas e o solo', correction: 'Pressione o umbigo ativamente contra o solo durante toda a amplitude.' },
      { mistake: 'Tirar o quadril do chão com impulso descontrolado', correction: 'Mantenha a bacia apoiada e mova apenas as pernas pela articulação do quadril.' }
    ]
  },
{
    id: 'elevacao-joelhos-chao',
    name: 'Elevação de Joelhos Deitado (Reverse Crunch)',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['quadriceps'],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 45,
    description: 'Trabalho focado na porção infra-abdominal e flexores de quadril através do enrolamento pélvico no solo com baixo estresse lombar.',
    breathingTip: 'Solte o ar levando os joelhos ao peito e levantando a pelve.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não use impulso ou balance o tronco bruscamente.'],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['elevacao-joelhos-deitado', 'dead-bug'],
    progressoes: ['elevacao-pernas-chao', 'elevacao-joelhos-barra'],
    variacoes: ['dead-bug'],
    adaptacoes: {
      lombar: ['elevacao-joelhos-chao', 'dead-bug'],
      ombro: ['elevacao-joelhos-chao']
    },
    criterioAvanco: '3x18 repetições controladas com elevação da pelve',
    sinonimos: ['abdominal infra joelhos', 'reverse crunch'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posição Inicial', description: 'Deite de costas com mãos ao lado do quadril e joelhos dobrados a 90°.' },
      { step: 2, title: 'Enrolamento', description: 'Puxe os joelhos em direção ao peito tirando o quadril levemente do chão.' },
      { step: 3, title: 'Retorno', description: 'Desça com controle sem arquear a coluna nem tocar os pés com força no chão.' }
    ],
    commonMistakes: [
      { mistake: 'Puxar apenas as pernas sem descolar a pelve do solo', correction: 'Foque em rolar o osso do púbis em direção ao tórax.' }
    ]
  },
  {
    id: 'elevacao-pernas-chao',
    name: 'Elevação de Pernas no Solo (Lying Leg Raise)',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['quadriceps', 'lombar'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Com as pernas estendidas, o braço de alavanca aumenta substancialmente, exigindo alta força dos flexores de quadril e do reto abdominal para conter a curvatura lombar.',
    breathingTip: 'Expire ao subir as pernas e inspire descendo devagar.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Se a lombar começar a arquear na descida das pernas, limite a amplitude.'],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['elevacao-joelhos-chao'],
    progressoes: ['elevacao-pernas-chao-pausa', 'flutter-kicks', 'elevacao-joelhos-barra', 'elevacao-pernas-barra'],
    variacoes: ['hollowbody'],
    adaptacoes: {
      lombar: ['elevacao-joelhos-chao', 'dead-bug']
    },
    criterioAvanco: '3x15 repetições até 10 cm do solo sem levantar a lombar',
    sinonimos: ['abdominal infra pernas esticadas', 'leg raises solo'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posição Inicial', description: 'Deite de costas, braços ao lado do tronco, pernas unidas e estendidas.' },
      { step: 2, title: 'Subida', description: 'Eleve as pernas retas até ficarem a 90° em relação ao tronco.' },
      { step: 3, title: 'Descida Excêntrica', description: 'Desça os pés lentamente até quase tocarem o chão, preservando a pressão lombar.' }
    ],
    commonMistakes: [
      { mistake: 'Acelerar a descida e deixar os pés baterem no chão', correction: 'Freie os últimos 30 graus com máxima força do abdômen.' }
    ]
  },
  {
    id: 'elevacao-joelhos-barra',
    name: 'Elevação de Joelhos na Barra (Hanging Knee Raise)',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['antebraco', 'costas'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Trabalho de core em suspensão que desenvolve força de compressão abdominal e descompressão da coluna simultaneamente.',
    breathingTip: 'Solte o ar encolhendo os joelhos até o peito; inspire no retorno.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Evite balançar o corpo como um pêndulo.'],
    padrao: 'core-anterior',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['elevacao-pernas-chao'],
    progressoes: ['elevacao-pernas-barra', 'toes-to-bar'],
    variacoes: ['elevacao-pernas-chao'],
    adaptacoes: {
      ombro: ['elevacao-pernas-chao'],
      'sem-equipamento': ['elevacao-pernas-chao', 'hollowbody']
    },
    criterioAvanco: '3x15 repetições sem pêndulo com joelhos tocando o peitoral',
    sinonimos: ['hanging knee raise', 'joelhos na barra'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Suspensão Firme', description: 'Pendure-se na barra em pegada pronada com escápulas ativadas.' },
      { step: 2, title: 'Flexão com Enrolamento', description: 'Puxe os joelhos em direção ao peitoral, retrovertendo a pelve.' },
      { step: 3, title: 'Retorno Estável', description: 'Estenda as pernas controladamente sem deixar o corpo oscilar para frente.' }
    ],
    commonMistakes: [
      { mistake: 'Usar impulso da descida anterior para iniciar a próxima repetição', correction: 'Pare totalmente a inércia no ponto mais baixo antes de subir.' }
    ]
  },
  {
    id: 'elevacao-pernas-barra',
    name: 'Elevação de Pernas na Barra (Hanging Leg Raise)',
    category: 'Core',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['antebraco', 'quadriceps', 'costas'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 90,
    description: 'Movimento de alta exigência calistênica com pernas completamente estendidas até 90° ou acima, solicitando força estrita do abdômen e flexores.',
    breathingTip: 'Expire forte na elevação das pernas mantendo escápulas deprimidas.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha a pegada firme na barra e ombros empacotados.'],
    padrao: 'core-anterior',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['elevacao-joelhos-barra', 'elevacao-pernas-chao'],
    progressoes: ['toes-to-bar', 'lsit'],
    variacoes: ['toes-to-bar'],
    adaptacoes: {
      ombro: ['elevacao-pernas-chao'],
      'sem-equipamento': ['elevacao-pernas-chao', 'hollowbody']
    },
    criterioAvanco: '3x12 repetições perfeitas com pés acima da linha da cintura',
    sinonimos: ['hanging leg raise', 'pernas na barra'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Posição em Barra', description: 'Pendure-se com pernas unidas, pés apontados e escápulas ativas.' },
      { step: 2, title: 'Elevação Estrita', description: 'Eleve as pernas retas até formarem no mínimo 90° com o tronco.' },
      { step: 3, title: 'Descida Lenta', description: 'Desça de forma suave sem balanço pendular.' }
    ],
    commonMistakes: [
      { mistake: 'Dobrar os joelhos para completar o movimento', correction: 'Trabalhe o alongamento dos isquiotibiais ou volte à elevação de joelhos.' }
    ]
  },
  {
    id: 'toes-to-bar',
    name: 'Pés na Barra Estritos (Toes to Bar)',
    category: 'Core',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['costas', 'antebraco', 'quadriceps'],
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 90,
    description: 'Variação estrita (sem kipping de crossfit) onde os dedos dos pés tocam a barra entre as mãos, exigindo flexibilidade, compressão e força dorsal.',
    breathingTip: 'Expire profundamente no topo ao tocar os pés na barra.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não solte o corpo em queda livre na descida.'],
    padrao: 'core-anterior',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['elevacao-pernas-barra'],
    progressoes: ['dragon-flag-tuck'],
    variacoes: ['elevacao-pernas-barra'],
    adaptacoes: {
      ombro: ['elevacao-pernas-chao'],
      'sem-equipamento': ['dragon-flag-negativa', 'hollowbody']
    },
    criterioAvanco: '3x10 repetições estritas sem balanço',
    sinonimos: ['toes to bar estrito', 'T2B'],
    animationType: 'pullup',
    executionSteps: [
      { step: 1, title: 'Suspensão com Ativação Dorsal', description: 'Pendure-se e empurre a barra para baixo engajando o grande dorsal.' },
      { step: 2, title: 'Compressão e Toque', description: 'Eleve as pernas esticadas até que os dedos toquem suavemente a barra.' },
      { step: 3, title: 'Descida Excêntrica', description: 'Retorne descendo com controle de todo o arco de movimento.' }
    ],
    commonMistakes: [
      { mistake: 'Usar balanço de quadril tipo chicote (kipping)', correction: 'Execute o movimento com controle estrito focado no abdômen.' }
    ]
  },
  {
    id: 'ab-wheel-joelhos',
    name: 'Roda Abdominal de Joelhos (Ab Wheel Rollout)',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['costas', 'ombros', 'peito'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Exercício rei da anti-extensão lombar. A extensão progressiva dos braços desafia violentamente o reto abdominal a evitar que o tronco curve.',
    breathingTip: 'Inspire estendendo o corpo à frente; expire contraindo o abdômen para voltar.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Interrompa imediatamente se sentir desconforto ou pinçamento na lombar.'],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['ab-wheel-negativa', 'plank', 'hollowbody'],
    progressoes: ['ab-wheel-pe', 'dragon-flag-negativa'],
    variacoes: ['ab-wheel-negativa', 'plank'],
    adaptacoes: {
      lombar: ['hollowbody', 'dead-bug'],
      ombro: ['plank', 'dead-bug'],
      'sem-equipamento': ['hollowbody']
    },
    criterioAvanco: '3x12 repetições com peito quase tocando o chão',
    sinonimos: ['rodinha abdominal', 'rollout de joelhos'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Apoio de Joelhos', description: 'Ajoelhe-se em um colchonete e segure a roda sob o peitoral.' },
      { step: 2, title: 'Rolagem Anterior', description: 'Role a roda para a frente mantendo a pelve em retroversão e coluna ligeiramente convexa.' },
      { step: 3, title: 'Puxada Abdominal', description: 'Puxe a roda de volta com a força do abdômen, sem sentar nos calcanhares.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar a lombar afundar ao final da descida', correction: 'Diminua a distância percorrida até fortalecer a parede abdominal.' }
    ]
  },
  {
    id: 'ab-wheel-pe',
    name: 'Roda Abdominal em Pé (Standing Ab Wheel)',
    category: 'Core',
    difficulty: 'Elite',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['costas', 'ombros', 'peito', 'lombar'],
    defaultSets: 3,
    defaultReps: 5,
    defaultRestSeconds: 120,
    description: 'Um dos testes definitivos de força de core. Partindo em pé, o praticante estende todo o corpo até encostar o nariz no chão e puxa de volta.',
    breathingTip: 'Inspire na descida longa e expire forte puxando o peso para trás.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Exercício de altíssima intensidade; exige base sólida de joelhos prévia.'],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: false,
    cadencia: '3-1-2',
    regressoes: ['ab-wheel-joelhos'],
    progressoes: ['dragon-flag-adv-tuck', 'dragon-flag'],
    variacoes: ['ab-wheel-joelhos'],
    adaptacoes: {
      lombar: ['ab-wheel-joelhos'],
      ombro: ['ab-wheel-joelhos']
    },
    criterioAvanco: '3x6 repetições partindo com pés juntos',
    sinonimos: ['standing ab wheel', 'rollout em pé'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posição Inicial', description: 'Em pé, incline o tronco segurando a roda no solo à frente dos pés.' },
      { step: 2, title: 'Extensão Total', description: 'Role para frente esticando pernas e tronco até ficar paralelo ao chão.' },
      { step: 3, title: 'Retorno Brutal', description: 'Comprima o abdômen puxando a roda de volta para a posição ereta.' }
    ],
    commonMistakes: [
      { mistake: 'Perder a retroversão no final da extensão', correction: 'Treine a descida contra uma parede limitando a distância.' }
    ]
  },
  {
    id: 'dragon-flag-negativa',
    name: 'Dragon Flag Excêntrica (Negativa)',
    category: 'Core',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['costas', 'gluteos', 'lombar'],
    defaultSets: 3,
    defaultReps: 5,
    defaultRestSeconds: 90,
    description: 'Descida lenta de 4 a 5 segundos do corpo reto apoiado apenas na parte superior das costas, famoso pelo treino de Bruce Lee.',
    breathingTip: 'Respire concentrado freando a descida com tensão contínua.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Apoie o peso nos ombros/trapézio, NUNCA na coluna cervical.'],
    padrao: 'core-anterior',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '4-0-1',
    regressoes: ['toes-to-bar', 'hollowbody'],
    progressoes: ['dragon-flag-tuck', 'dragon-flag'],
    variacoes: ['dragon-flag-tuck'],
    adaptacoes: {
      lombar: ['hollowbody'],
      ombro: ['toes-to-bar'],
      'sem-equipamento': ['hollowbody']
    },
    criterioAvanco: '3x6 descidas lentas de 5 segundos cada',
    sinonimos: ['bruce lee flag negativa', 'dragon flag excêntrica'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Ponto Alto', description: 'Deitado em banco ou solo segurando apoio firme atrás da cabeça, suba o corpo na vertical.' },
      { step: 2, title: 'Alinhamento', description: 'Trave tronco, glúteos e pernas em uma única linha rígida.' },
      { step: 3, title: 'Descida Lenta', description: 'Desça o corpo inteiro em bloco por 5 segundos até quase tocar a base.' }
    ],
    commonMistakes: [
      { mistake: 'Dobrar o quadril deixando as nádegas caírem antes dos pés', correction: 'Tranque os glúteos e desça como uma prancha rígida.' }
    ]
  },
  {
    id: 'dragon-flag-tuck',
    name: 'Dragon Flag Tuck (Joelhos Encolhidos)',
    category: 'Core',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['costas', 'gluteos'],
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 90,
    description: 'Dragon flag completo executado com joelhos dobrados a 90°, diminuindo a alavanca para construir força concêntrica.',
    breathingTip: 'Expire subindo o corpo e inspire na descida.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha a escápula e ombros no banco/chão, sem empurrar com a nuca.'],
    padrao: 'core-anterior',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['dragon-flag-negativa'],
    progressoes: ['dragon-flag'],
    variacoes: ['dragon-flag-negativa'],
    adaptacoes: {
      lombar: ['hollowbody'],
      'sem-equipamento': ['hollowbody']
    },
    criterioAvanco: '3x10 repetições com subida e descida limpas',
    sinonimos: ['tuck dragon flag'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Apoio Firme', description: 'Segure firme na cabeceira do banco ou suporte no chão.' },
      { step: 2, title: 'Subida em Tuck', description: 'Dobre os joelhos e eleve o tronco inteiro do solo apoiado apenas nos ombros.' },
      { step: 3, title: 'Descida Controlada', description: 'Desça o tronco até quase encostar no banco e suba novamente.' }
    ],
    commonMistakes: [
      { mistake: 'Apoiar o peso no pescoço', correction: 'Desloque a pressão para as escápulas e trapézios superiores.' }
    ]
  },
  {
    id: 'dragon-flag',
    name: 'Dragon Flag Completo',
    category: 'Core',
    difficulty: 'Elite',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['costas', 'gluteos', 'lombar'],
    defaultSets: 3,
    defaultReps: 6,
    defaultRestSeconds: 120,
    description: 'Movimento icônico com pernas retas alinhadas ao tronco em subida e descida completas apoiado apenas na cintura escapular.',
    breathingTip: 'Respire vigorosamente entre cada repetição; expire subindo a alavanca.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não tente sem dominar a canoa, elevação na barra e dragon flag tuck.'],
    padrao: 'core-anterior',
    equipamento: ['barra'],
    tipoExercicio: 'skill',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['dragon-flag-uma-perna', 'dragon-flag-tuck', 'dragon-flag-negativa'],
    progressoes: ['frontlever'],
    variacoes: ['dragon-flag-tuck'],
    adaptacoes: {
      lombar: ['dragon-flag-tuck'],
      'sem-equipamento': ['hollowbody']
    },
    criterioAvanco: '3x8 repetições perfeitas com toque quase zero no solo',
    sinonimos: ['bandeira do dragão', 'dragon flag bruce lee'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posição', description: 'Segure um mastro vertical ou borda de banco firme atrás da cabeça.' },
      { step: 2, title: 'Alavanca Rígida', description: 'Eleve todo o corpo reto até a vertical como um poste erguido.' },
      { step: 3, title: 'Descida e Subida', description: 'Desça em bloco até quase a horizontal e puxe de volta sem quebrar a linha do corpo.' }
    ],
    commonMistakes: [
      { mistake: 'Arquear a lombar durante o ponto de inversão', correction: 'Tranque o abdômen e volte à variação de perna unilateral ou tuck.' }
    ]
  },

  // ==========================================
  // CORE LATERAL E ROTAÇÃO
  // ==========================================
  {
    id: 'prancha-lateral-joelhos',
    name: 'Prancha Lateral com Joelhos Dobrados',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['gluteos', 'ombros'],
    defaultSets: 3,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 45,
    description: 'Regressão de prancha lateral com apoio nos joelhos, fortalecendo oblíquos e glúteo médio sem estresse excessivo nas articulações.',
    breathingTip: 'Respire ritmicamente mantendo o quadril empurrado para o teto.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não deixe o ombro de apoio subir na orelha.'],
    padrao: 'core-lateral',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['dead-bug'],
    progressoes: ['prancha-lateral'],
    variacoes: ['dead-bug'],
    adaptacoes: {
      ombro: ['dead-bug'],
      lombar: ['dead-bug']
    },
    criterioAvanco: 'Manter 3 séries de 40 segundos por lado',
    sinonimos: ['side plank joelhos', 'prancha lateral fácil'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Apoio Lateral', description: 'Deite de lado apoiado no antebraço e dobre os joelhos a 90° alinhados ao quadril.' },
      { step: 2, title: 'Elevação', description: 'Suba a pelve formando uma linha reta dos ombros aos joelhos.' },
      { step: 3, title: 'Sustentação', description: 'Ative o oblíquo de baixo e o glúteo segurando a posição.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar o quadril cair em direção ao chão', correction: 'Empurre o solo com o joelho e antebraço elevando a bacia.' }
    ]
  },
  {
    id: 'prancha-lateral',
    name: 'Prancha Lateral Tradicional',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['gluteos', 'ombros', 'lombar'],
    defaultSets: 3,
    defaultHoldSeconds: 35,
    defaultRestSeconds: 60,
    description: 'Fortalece os músculos oblíquos, quadrado lombar e estabilizadores pélvicos através da sustentação lateral do peso corporal.',
    breathingTip: 'Mantenha respiração constante sem prender o ar.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Alinhe cotovelo diretamente embaixo da linha do ombro.'],
    padrao: 'core-lateral',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['prancha-lateral-joelhos'],
    progressoes: ['prancha-lateral-elevacao-quadril', 'copenhagen-plank-joelho'],
    variacoes: ['prancha-lateral-joelhos'],
    adaptacoes: {
      ombro: ['prancha-lateral-joelhos'],
      punho: ['prancha-lateral']
    },
    criterioAvanco: 'Manter 3 séries de 45 segundos por lado',
    sinonimos: ['side plank', 'prancha de lado'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posicionamento', description: 'Deite-se de lado com as pernas estendidas e pés sobrepostos ou em linha.' },
      { step: 2, title: 'Elevação do Quadril', description: 'Apoie o antebraço no chão e levante o quadril até o corpo formar uma linha diagonal.' },
      { step: 3, title: 'Estabilização', description: 'Mantenha o peito aberto e o abdômen contraído sem rodar para frente.' }
    ],
    commonMistakes: [
      { mistake: 'Tronco girar para o chão', correction: 'Mantenha o peito e o olhar virados para a frente em plano perpendicular ao solo.' }
    ]
  },
  {
    id: 'prancha-lateral-elevacao-quadril',
    name: 'Prancha Lateral com Elevação de Quadril (Hip Dips)',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['gluteos', 'ombros'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Adiciona movimento dinâmico vertical à prancha lateral, intensificando a contração concêntrica dos oblíquos e glúteo médio.',
    breathingTip: 'Expire ao elevar o quadril no ponto mais alto; inspire descendo suavemente.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não bata o quadril no chão ao descer.'],
    padrao: 'core-lateral',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['prancha-lateral'],
    progressoes: ['copenhagen-plank-joelho'],
    variacoes: ['prancha-lateral'],
    adaptacoes: {
      ombro: ['prancha-lateral-joelhos'],
      lombar: ['prancha-lateral']
    },
    criterioAvanco: '3x15 repetições completas por lado',
    sinonimos: ['side plank dips', 'mergulho de quadril lateral'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posição Alta', description: 'Inicie na posição superior da prancha lateral com corpo alinhado.' },
      { step: 2, title: 'Descida Controlada', description: 'Desça o quadril até quase tocar o colchonete.' },
      { step: 3, title: 'Elevação Máxima', description: 'Empurre a pelve para cima além da linha neutra contraindo o oblíquo.' }
    ],
    commonMistakes: [
      { mistake: 'Movimento curto e rápido sem amplitude', correction: 'Desça próximo ao solo e suba ao limite máximo com controle.' }
    ]
  },
  {
    id: 'copenhagen-plank-joelho',
    name: 'Copenhagen Plank com Apoio no Joelho',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['gluteos', 'quadriceps'],
    defaultSets: 3,
    defaultHoldSeconds: 25,
    defaultRestSeconds: 60,
    description: 'Exercício referência para fortalecimento dos adutores e cadeia lateral, prevenindo lesões de virilha e fortalecendo o core integrado.',
    breathingTip: 'Mantenha respiração constante durante a sustentação da adução.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Use um banco acolchoado sob a perna de apoio.'],
    padrao: 'core-lateral',
    equipamento: ['banco'],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['prancha-lateral'],
    progressoes: ['copenhagen-plank-pe'],
    variacoes: ['prancha-lateral'],
    adaptacoes: {
      joelho: ['prancha-lateral'],
      'sem-equipamento': ['prancha-lateral-elevacao-quadril']
    },
    criterioAvanco: 'Manter 3 séries de 35 segundos por perna',
    sinonimos: ['copenhagen adutores joelho'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Apoio no Banco', description: 'Deite de lado com o joelho e tíbia da perna de cima apoiados em um banco ou cadeira.' },
      { step: 2, title: 'Elevação Corporal', description: 'Apoie o antebraço no chão e levante todo o corpo, descolando a perna de baixo do solo.' },
      { step: 3, title: 'Adução Ativa', description: 'Aperte o banco com a perna superior mantendo o corpo perfeitamente reto.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar a perna de baixo encostada no chão aliviando o peso', correction: 'Mantenha a perna de baixo suspensa flexionada junto ao banco.' }
    ]
  },
  {
    id: 'copenhagen-plank-pe',
    name: 'Copenhagen Plank Completo (Apoio no Tornozelo)',
    category: 'Core',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['gluteos', 'ombros'],
    defaultSets: 3,
    defaultHoldSeconds: 25,
    defaultRestSeconds: 60,
    description: 'Alavanca máxima com apenas o pé/tornozelo apoiado no banco. Exige altíssima força dos adutores e estabilizadores pélvicos.',
    breathingTip: 'Respire firme sem prender o ar.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não execute se tiver dor aguda na virilha ou ligamentos do joelho.'],
    padrao: 'core-lateral',
    equipamento: ['banco'],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['copenhagen-plank-joelho'],
    progressoes: ['bandeira-humana-tuck'],
    variacoes: ['copenhagen-plank-joelho'],
    adaptacoes: {
      joelho: ['copenhagen-plank-joelho', 'prancha-lateral'],
      'sem-equipamento': ['prancha-lateral']
    },
    criterioAvanco: 'Manter 3 séries de 30 segundos por perna',
    sinonimos: ['copenhagen plank avançado'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posicionamento Distal', description: 'Apoie apenas o tornozelo e pé de cima sobre o banco.' },
      { step: 2, title: 'Elevação em Linha', description: 'Erga o quadril e mantenha o corpo em linha reta suspended do chão.' },
      { step: 3, title: 'Sustentação Rígida', description: 'Segure a perna de baixo colada por baixo do banco sustentando a pressão.' }
    ],
    commonMistakes: [
      { mistake: 'Rotacionar o quadril para trás', correction: 'Mantenha a pelve perpendicular ao solo.' }
    ]
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist sem Carga',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['lombar'],
    defaultSets: 3,
    defaultReps: 20,
    defaultRestSeconds: 45,
    description: 'Rotação do tronco sentado em posição V com calcanhares no chão ou elevados, trabalhando a musculatura oblíqua e estabilidade rotacional.',
    breathingTip: 'Expire a cada giro tocando o solo ao lado do quadril.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha o peito aberto; não arredonde excessivamente as costas.'],
    padrao: 'core-lateral',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['prancha-toque-ombro'],
    progressoes: ['russian-twist-pes-elevados', 'prancha-lateral-elevacao-quadril'],
    variacoes: ['mountain-climbers', 'prancha-toque-ombro'],
    adaptacoes: {
      lombar: ['dead-bug', 'prancha-lateral']
    },
    criterioAvanco: '3x24 rotações com pés suspensos do chão',
    sinonimos: ['rotação russa', 'giro russo'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posição em V', description: 'Sente-se com joelhos dobrados, incline o tronco para trás cerca de 45° mantendo a coluna ereta.' },
      { step: 2, title: 'Rotação dos Ombros', description: 'Gire os ombros e leve as duas mãos ao chão do lado direito.' },
      { step: 3, title: 'Alternância', description: 'Gire para o lado oposto com controle, mantendo os joelhos estáveis.' }
    ],
    commonMistakes: [
      { mistake: 'Mexer apenas os braços sem girar a caixa torácica', correction: 'Gire os ombros e o peito para o lado a cada repetição.' }
    ]
  },
  {
    id: 'mountain-climber-cruzado',
    name: 'Mountain Climber Cruzado (Cross-body)',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['ombros', 'quadriceps'],
    defaultSets: 3,
    defaultReps: 20,
    defaultRestSeconds: 45,
    description: 'Variação dinâmica na prancha alta onde o joelho viaja em direção ao cotovelo oposto, ativando oblíquos e elevando o gasto calórico.',
    breathingTip: 'Solte o ar na aproximação do joelho ao cotovelo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha os ombros sobre os punhos; evite pular descontroladamente.'],
    padrao: 'core-lateral',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['mountain-climbers', 'prancha-joelhos'],
    progressoes: ['prancha-toque-ombro'],
    variacoes: ['prancha-toque-ombro'],
    adaptacoes: {
      punho: ['dead-bug'],
      lombar: ['dead-bug']
    },
    criterioAvanco: '3x24 repetições com bom ritmo e pelve estável',
    sinonimos: ['escalador cruzado', 'cross body mountain climbers'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Prancha Alta', description: 'Inicie em posição de flexão com abdômen travado e escápulas protraídas.' },
      { step: 2, title: 'Cruzamento', description: 'Traga o joelho direito em direção ao cotovelo esquerdo mantendo o quadril baixo.' },
      { step: 3, title: 'Troca Fluida', description: 'Retorne e repita imediatamente com o joelho esquerdo no cotovelo direito.' }
    ],
    commonMistakes: [
      { mistake: 'Elevar o quadril muito alto durante a corrida', correction: 'Fixe a pelve na mesma altura dos ombros.' }
    ]
  },

  // ==========================================
  // COSTAS BAIXA E CADEIA POSTERIOR
  // ==========================================
  {
    id: 'bird-dog',
    name: 'Bird Dog (Perdigueiro)',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['lombar'],
    secondaryMuscles: ['gluteos', 'ombros', 'abdomen'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 45,
    description: 'Um dos "Big 3" do Dr. Stuart McGill para saúde da coluna. Desenvolve estabilidade do core e coordenação contralateral da cadeia posterior.',
    breathingTip: 'Expire na extensão e inspire retornando ao centro.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não hiperestenda a lombar; o foco é alongar e não chutar alto.'],
    padrao: 'costas-baixa',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: [],
    progressoes: ['bird-dog-pausa', 'superman', 'superman-alternado'],
    variacoes: ['superman-alternado'],
    adaptacoes: {
      lombar: ['bird-dog'],
      ombro: ['ponte-gluteo'],
      punho: ['bird-dog']
    },
    criterioAvanco: '3x14 repetições controladas com pausa de 2 s no topo',
    sinonimos: ['perdigueiro', 'quatro apoios contralateral'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Quatro Apoios', description: 'Posicione mãos sob os ombros e joelhos sob o quadril em solo plano.' },
      { step: 2, title: 'Extensão Cruzada', description: 'Estenda o braço direito para a frente e a perna esquerda para trás paralelamente ao chão.' },
      { step: 3, title: 'Pausa e Retorno', description: 'Segure 2 segundos contraindo glúteo e dorsal, e volte devagar sem tombar a bacia.' }
    ],
    commonMistakes: [
      { mistake: 'Girar a bacia para o lado ao levantar a perna', correction: 'Mantenha os dois ossos do quadril apontando retilíneos para o chão.' }
    ]
  },
  {
    id: 'superman',
    name: 'Superman Isométrico no Solo',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['lombar'],
    secondaryMuscles: ['gluteos', 'ombros', 'costas'],
    defaultSets: 3,
    defaultHoldSeconds: 25,
    defaultRestSeconds: 45,
    description: 'Fortalecimento dos eretores da espinha, glúteos e romboides em decúbito ventral, promovendo correção postural de cifose.',
    breathingTip: 'Respire normalmente enquanto sustenta a extensão torácica.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Evite pinçar a nuca olhando para cima; mantenha o queixo recolhido.'],
    padrao: 'costas-baixa',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['bird-dog'],
    progressoes: ['good-morning-peso-corpo', 'ponte-gluteo-unilateral'],
    variacoes: ['superman-alternado'],
    adaptacoes: {
      lombar: ['bird-dog', 'ponte-gluteo']
    },
    criterioAvanco: 'Manter 3 séries de 35 segundos com coxas e peito fora do solo',
    sinonimos: ['superman dorsal', 'extensão de tronco no solo'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Decúbito Ventral', description: 'Deite de bruços com braços estendidos à frente e pernas retas.' },
      { step: 2, title: 'Extensão', description: 'Eleve o peitoral, braços e coxas do chão simultaneamente contraindo glúteos e lombar.' },
      { step: 3, title: 'Sustentação', description: 'Mantenha a cabeça neutra e aperte a musculatura dorsal.' }
    ],
    commonMistakes: [
      { mistake: 'Jogar a cabeça para trás comprimindo as vértebras cervicais', correction: 'Olhe para o colchonete mantendo o pescoço em linha com a coluna.' }
    ]
  },
  {
    id: 'superman-alternado',
    name: 'Superman Alternado (Natação no Solo)',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['lombar'],
    secondaryMuscles: ['gluteos', 'ombros'],
    defaultSets: 3,
    defaultReps: 20,
    defaultRestSeconds: 45,
    description: 'Movimento alternado de braços e pernas deitado de bruços, oferecendo trabalho rítmico da cadeia cruzada posterior com menor compressão estática contínua.',
    breathingTip: 'Mantenha respiração ritmada a cada pernada.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não chute com força excessiva.'],
    padrao: 'costas-baixa',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['bird-dog'],
    progressoes: ['superman'],
    variacoes: ['bird-dog'],
    adaptacoes: {
      lombar: ['bird-dog']
    },
    criterioAvanco: '3x24 repetições rítmicas e contínuas',
    sinonimos: ['swimmers', 'natação de bruços'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Deitar de Bruços', description: 'Estenda braços e pernas mantendo peitoral ligeiramente suspenso.' },
      { step: 2, title: 'Ação Cruzada', description: 'Suba o braço direito e a perna esquerda, enquanto os outros descansam perto do solo.' },
      { step: 3, title: 'Troca Contínua', description: 'Alterne rapidamente como em um nado de crawl em terra firme.' }
    ],
    commonMistakes: [
      { mistake: 'Bater os membros sem controle postural', correction: 'Mantenha o abdômen colado e movimentos precisos de pequena amplitude.' }
    ]
  },
  {
    id: 'ponte-gluteo',
    name: 'Ponte de Glúteo no Solo (Glute Bridge)',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['gluteos'],
    secondaryMuscles: ['posteriores', 'lombar'],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 45,
    description: 'Exercício fundamental de ativação e extensão do quadril, essencial para combater a amnésia glútea decorrente de longos períodos sentado.',
    breathingTip: 'Solte o ar empurrando o chão pelos calcanhares e aperte os glúteos no topo.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não hiperestenda a coluna lombar no topo; empurre pela pelve.'],
    padrao: 'costas-baixa',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['bird-dog'],
    progressoes: ['ponte-gluteo-unilateral', 'hip-thrust-banco'],
    variacoes: ['ponte-gluteo-unilateral'],
    adaptacoes: {
      lombar: ['ponte-gluteo'],
      joelho: ['ponte-gluteo']
    },
    criterioAvanco: '3x20 repetições com contração de pico de 2 s',
    sinonimos: ['elevação pélvica', 'glute bridge'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posição Supina', description: 'Deite de costas com joelhos dobrados e pés firmes no chão na largura dos quadris.' },
      { step: 2, title: 'Empuxo pelos Calcanhares', description: 'Pressione os calcanhares no chão e eleve os quadris até alinhar joelhos, pelve e ombros.' },
      { step: 3, title: 'Contração e Descida', description: 'Aperte os glúteos intensamente no topo e desça sem relaxar a tensão.' }
    ],
    commonMistakes: [
      { mistake: 'Arquear a lombar empurrando a barriga para cima', correction: 'Mantenha as costelas abaixadas e use estritamente os glúteos para estender a coxa.' }
    ]
  },
  {
    id: 'ponte-gluteo-unilateral',
    name: 'Ponte de Glúteo Unilateral (Single Leg Bridge)',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['gluteos'],
    secondaryMuscles: ['posteriores', 'lombar', 'abdomen'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Dobra a carga em cada membro e corrige assimetrias de força entre os glúteos e posteriores de coxa.',
    breathingTip: 'Solte o ar no topo da extensão unilateral.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha a pelve nivelada; não deixe o lado sem apoio afundar.'],
    padrao: 'costas-baixa',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['ponte-gluteo'],
    progressoes: ['hip-thrust-banco', 'nordic-curl-negativa'],
    variacoes: ['ponte-gluteo'],
    adaptacoes: {
      lombar: ['ponte-gluteo'],
      joelho: ['ponte-gluteo']
    },
    criterioAvanco: '3x14 repetições por perna sem oscilação pélvica',
    sinonimos: ['single leg glute bridge', 'elevação pélvica uma perna'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Preparação Unilateral', description: 'Deite de costas e eleve uma das pernas dobrada ou estendida para o teto.' },
      { step: 2, title: 'Elevação com Força', description: 'Empurre com o calcanhar do pé de apoio e levante o quadril no alinhamento completo.' },
      { step: 3, title: 'Retorno Freado', description: 'Desça até a pelve quase encostar no chão e repita.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar o quadril inclinar para o lado da perna livre', correction: 'Trave o abdômen e oblíquos para manter a bacia paralela ao solo.' }
    ]
  },
  {
    id: 'hip-thrust-banco',
    name: 'Hip Thrust Apoiado no Banco (Peso do Corpo)',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['gluteos'],
    secondaryMuscles: ['posteriores', 'quadriceps'],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 60,
    description: 'Com as escápulas apoiadas na borda de um banco ou sofá, aumenta enormemente o arco de movimento da extensão do quadril.',
    breathingTip: 'Expire ao subir e aperte os glúteos com vigor no ponto alto.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha o queixo colado ao peito e o olhar à frente durante todo o movimento.'],
    padrao: 'costas-baixa',
    equipamento: ['banco'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['ponte-gluteo'],
    progressoes: ['nordic-curl-negativa'],
    variacoes: ['ponte-gluteo-unilateral'],
    adaptacoes: {
      lombar: ['ponte-gluteo'],
      'sem-equipamento': ['ponte-gluteo', 'ponte-gluteo-unilateral']
    },
    criterioAvanco: '3x20 repetições com amplitude completa',
    sinonimos: ['elevação de quadril no banco', 'bodyweight hip thrust'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Apoio Escapular', description: 'Apoie a linha média das costas na beirada de um banco com joelhos a 90° e pés firmes.' },
      { step: 2, title: 'Descida da Pelve', description: 'Desça os quadris flexionando a pelve mantendo o queixo voltado para a frente.' },
      { step: 3, title: 'Extensão Máxima', description: 'Empurre pelos calcanhares até o tronco e coxas formarem uma mesa reta.' }
    ],
    commonMistakes: [
      { mistake: 'Jogar a cabeça para trás arqueando a lombar', correction: 'Mantenha o olhar fixo para a frente olhando para os joelhos.' }
    ]
  },
  {
    id: 'good-morning-peso-corpo',
    name: 'Good Morning com Peso Corporal',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['lombar', 'posteriores'],
    secondaryMuscles: ['gluteos'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 45,
    description: 'Padrão de flexão de quadril (hip hinge) em pé que ensina a dobrar a bacia mantendo a coluna lombar reta e protegida enquanto alonga e fortalece a cadeia posterior.',
    breathingTip: 'Inspire inclinando o quadril para trás; expire retornando ereto.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Não curve a parte superior nem inferior das costas.'],
    padrao: 'costas-baixa',
    equipamento: ['nenhum'],
    tipoExercicio: 'aquecimento',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['bird-dog'],
    progressoes: ['nordic-curl-negativa'],
    variacoes: ['bird-dog'],
    adaptacoes: {
      lombar: ['bird-dog', 'ponte-gluteo'],
      joelho: ['good-morning-peso-corpo']
    },
    criterioAvanco: '3x15 repetições com tronco paralelo ao solo e coluna ereta',
    sinonimos: ['bom dia peso corporal', 'hip hinge calistenia'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Postura em Pé', description: 'Fique de pé com mãos na nuca e cotovelos abertos, pés na largura dos ombros.' },
      { step: 2, title: 'Flexão do Quadril', description: 'Dobre ligeiramente os joelhos e empurre o quadril para trás inclinando o tronco reto.' },
      { step: 3, title: 'Extensão com Glúteos', description: 'Ao sentir o estiramento nos isquiotibiais, empurre os quadris de volta para a frente.' }
    ],
    commonMistakes: [
      { mistake: 'Arredondar a coluna para tentar descer mais', correction: 'Desça apenas até onde conseguir manter o peito estufado e lombar selada.' }
    ]
  },
  {
    id: 'nordic-curl-negativa',
    name: 'Nordic Hamstring Curl Negativa (Descida Excêntrica)',
    category: 'Legs',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['posteriores'],
    secondaryMuscles: ['gluteos', 'lombar', 'panturrilhas'],
    defaultSets: 3,
    defaultReps: 5,
    defaultRestSeconds: 90,
    description: 'O exercício de calistenia com maior ativação comprovada dos isquiotibiais, focado na fase excêntrica da descida para prevenir lesões e construir força explosiva.',
    breathingTip: 'Respire concentrado e segure a descida o máximo de segundos possível.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Mantenha os tornozelos firmemente travados e coloque almofada macia sob os joelhos.'],
    padrao: 'costas-baixa',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '4-0-1',
    regressoes: ['ponte-gluteo-unilateral', 'hip-thrust-banco'],
    progressoes: ['nordic-curl'],
    variacoes: ['ponte-gluteo-unilateral'],
    adaptacoes: {
      joelho: ['ponte-gluteo-unilateral'],
      lombar: ['ponte-gluteo']
    },
    criterioAvanco: '3x6 repetições descendo lentamente por 4 a 5 segundos',
    sinonimos: ['flexão nórdica negativa', 'nordic curl excêntrico'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Ancoragem dos Pés', description: 'Ajoelhe-se com os calcanhares travados sob um suporte pesado ou segurados por um parceiro.' },
      { step: 2, title: 'Corpo Rígido', description: 'Mantenha uma linha reta dos joelhos à cabeça com glúteos contraídos.' },
      { step: 3, title: 'Freio Excêntrico', description: 'Incline-se lentamente para a frente lutando contra a gravidade até apoiar as mãos no chão.' }
    ],
    commonMistakes: [
      { mistake: 'Dobrar o quadril jogando a bunda para trás na descida', correction: 'Mantenha a pelve totalmente estendida durante toda a trajetória.' }
    ]
  },
  {
    id: 'nordic-curl',
    name: 'Nordic Hamstring Curl Completo',
    category: 'Legs',
    difficulty: 'Elite',
    type: 'reps',
    primaryMuscles: ['posteriores'],
    secondaryMuscles: ['gluteos', 'lombar', 'panturrilhas'],
    defaultSets: 3,
    defaultReps: 5,
    defaultRestSeconds: 120,
    description: 'A flexão nórdica completa com descida controlada e retorno à posição vertical usando unicamente a contração concêntrica dos posteriores de coxa.',
    breathingTip: 'Inspire na descida; solte o ar na puxada vigorosa de retorno.',
    reviewedBy: CREF_REVIEWER_SPECIALIST,
    safetyCautions: ['Exige nível avançado de condicionamento dos tendões posteriores.'],
    padrao: 'costas-baixa',
    equipamento: ['nenhum'],
    tipoExercicio: 'skill',
    estatico: false,
    cadencia: '3-0-2',
    regressoes: ['nordic-curl-negativa'],
    progressoes: [],
    variacoes: ['nordic-curl-negativa'],
    adaptacoes: {
      joelho: ['ponte-gluteo-unilateral'],
      lombar: ['ponte-gluteo']
    },
    criterioAvanco: '3x6 repetições concêntricas estritas',
    sinonimos: ['flexão nórdica completa', 'nordic hamstring curl'],
    animationType: 'squat',
    executionSteps: [
      { step: 1, title: 'Ajoelhado e Ancorado', description: 'Trave os calcanhares e alinhe tronco e coxas eretos.' },
      { step: 2, title: 'Descida Gradual', description: 'Desça o corpo em linha reta controlando com a parte de trás da coxa.' },
      { step: 3, title: 'Puxada Concêntrica', description: 'Puxe o corpo de volta para a vertical sem empurrar o chão com as mãos.' }
    ],
    commonMistakes: [
      { mistake: 'Usar impulso dos braços no solo para iniciar a subida', correction: 'Se necessário impulso, treine com elástico de suporte amarrado ao peito.' }
    ]
  },

  // ==========================================
  // EXPANSÃO DE CORE - LOTE 1 (PRANCHAS, HOLLOW, ELEVAÇÕES E ROTAÇÕES)
  // ==========================================
  {
    id: 'prancha-elevacao-perna',
    name: 'Prancha com Elevação Unilateral de Perna',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'isometric',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['gluteos', 'lombar', 'ombros'],
    defaultSets: 3,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 60,
    description: 'Variação anti-extensão e anti-rotação da prancha no solo, onde a redução da base de sustentação para 3 apoios intensifica o recrutamento do core profundo e dos estabilizadores do quadril.',
    breathingTip: 'Mantenha a respiração diafragmática ritmada sem prender o ar ao sustentar a perna elevada.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Não hiperestenda a coluna lombar ao erguer a perna.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['prancha-toque-ombro', 'plank'],
    progressoes: ['prancha-serrote', 'prancha-apoio-instavel'],
    variacoes: ['prancha-toque-ombro', 'prancha-joelhos'],
    adaptacoes: {
      lombar: ['prancha-joelhos', 'dead-bug'],
      punho: ['prancha-elevacao-perna'],
      ombro: ['dead-bug'],
      semEquipamento: ['prancha-elevacao-perna']
    },
    criterioAvanco: 'Sustentar 3 séries de 30 segundos cada lado sem oscilação pélvica',
    sinonimos: ['single leg plank', 'prancha 3 apoios', 'prancha com perna levantada'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Base de Prancha', description: 'Assuma a posição de prancha nos antebraços com escápulas protrusas e pelve em retroversão.' },
      { step: 2, title: 'Elevação Controlada', description: 'Erga uma das pernas cerca de 10 a 15 cm do solo, ativando intensamente o glúteo e o abdômen sem girar a bacia.' },
      { step: 3, title: 'Sustentação Rígida', description: 'Permaneça imóvel evitando qualquer afundamento lombar durante o tempo estipulado, alternando o lado.' }
    ],
    commonMistakes: [
      { mistake: 'Elevar a perna excessivamente arqueando a lombar', correction: 'Suba o calcanhar apenas até a linha do tronco, mantendo o abdômen contraído.' },
      { mistake: 'Girar a bacia para o lado da perna elevada', correction: 'Mantenha as duas cristas ilíacas apontadas diretamente para o chão.' }
    ]
  },
  {
    id: 'prancha-serrote',
    name: 'Prancha Serrote no Solo (Body Saw)',
    category: 'Core',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['ombros', 'lombar', 'gluteos'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Variação avançada de anti-extensão onde o corpo se desloca para frente e para trás sobre os antebraços com pés sobre superfície deslizante, aumentando a alavanca sobre o core.',
    breathingTip: 'Inspire ao deslizar para trás aumentando a tensão do core; expire ao puxar os cotovelos de volta à posição inicial.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Mantenha amplitude curta caso sinta pressão na lombar.'
    ],
    padrao: 'core-anterior',
    equipamento: ['toalha'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['prancha-elevacao-perna', 'plank'],
    progressoes: ['ab-wheel-negativa', 'prancha-apoio-instavel'],
    variacoes: ['ab-wheel-joelhos'],
    adaptacoes: {
      lombar: ['plank', 'dead-bug'],
      ombro: ['prancha-joelhos'],
      'sem-equipamento': ['prancha-elevacao-perna']
    },
    criterioAvanco: 'Executar 3 séries de 12 repetições completas mantendo a pelve em retroversão sem arqueamento lombar',
    sinonimos: ['body saw', 'prancha serrote', 'body saw plank', 'prancha deslizante'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posição de Prancha com Pés Deslizantes', description: 'Inicie na posição de prancha sobre os antebraços, com os pés apoiados sobre uma toalha ou sliders em superfície lisa.' },
      { step: 2, title: 'Deslizamento Posterior', description: 'Empurre o corpo para trás usando os ombros, estendendo a alavanca corporal sem deixar a pelve desabar.' },
      { step: 3, title: 'Retorno com Tração dos Cotovelos', description: 'Puxe o corpo de volta para a posição inicial flexionando os cotovelos sob os ombros e travando o abdômen.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar o quadril ceder em hiperextensão lombar no ponto mais distante', correction: 'Aperte os glúteos intensamente e limite o deslize até o ponto em que o core se mantém 100% rígido.' },
      { mistake: 'Subir os quadris em formato de pirâmide ao puxar de volta', correction: 'Mantenha o alinhamento reto e horizontal do corpo durante toda a transição.' }
    ]
  },
  {
    id: 'prancha-apoio-instavel',
    name: 'Prancha com Pés em Apoio Instável',
    category: 'Core',
    difficulty: 'Avançado',
    type: 'isometric',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['ombros', 'lombar', 'peito'],
    defaultSets: 3,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 60,
    description: 'Prancha executada com os pés ou antebraços apoiados sobre uma superfície móvel ou escorregadia (toalha, meias em piso liso ou apoio flexível), exigindo controle reflexo extremo do core.',
    breathingTip: 'Solte o ar de forma cadenciada mantendo a parede abdominal em contração máxima contínua.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Mantenha controle estrito da superfície para evitar escorregamento descontrolado.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['plank', 'prancha-toque-ombro'],
    progressoes: ['ab-wheel-joelhos'],
    variacoes: ['plank'],
    adaptacoes: {
      lombar: ['plank', 'prancha-joelhos'],
      punho: ['plank'],
      ombro: ['dead-bug'],
      semEquipamento: ['plank']
    },
    criterioAvanco: 'Sustentar 3 séries de 40 segundos com alinhamento neutro e estabilidade total',
    sinonimos: ['unstable plank', 'prancha na toalha', 'prancha instável'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posicionamento', description: 'Apoie os pés sobre uma toalha em piso liso ou apoio móvel e posicione os antebraços no chão.' },
      { step: 2, title: 'Ativação e Alinhamento', description: 'Estenda o corpo travando glúteos e abdômen, impedindo que o ponto instável se desloque.' },
      { step: 3, title: 'Controle Antidistúrbio', description: 'Mantenha a postura resistindo a qualquer micro-oscilação até o fim da série.' }
    ],
    commonMistakes: [
      { mistake: 'Perder a retroversão pélvica e arquear a lombar', correction: 'Aperte os glúteos com força máxima e reduza a distância se necessário.' }
    ]
  },
  {
    id: 'dead-bug-perna-estendida',
    name: 'Dead Bug com Perna Estendida',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['lombar', 'quadriceps'],
    defaultSets: 3,
    defaultReps: 16,
    defaultRestSeconds: 45,
    description: 'Evolução do Dead Bug tradicional onde a alavanca dos membros inferiores é aumentada estendendo o joelho próximo ao solo, aumentando a demanda de anti-extensão lombo-pélvica.',
    breathingTip: 'Solte o ar pela boca ao estender braço e perna opostos, inspirando ao retornar ao centro.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'A lombar jamais deve descolar do solo durante a extensão da perna.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['dead-bug'],
    progressoes: ['hollow-hold-tuck'],
    variacoes: ['dead-bug', 'hollow-hold-tuck'],
    adaptacoes: {
      lombar: ['dead-bug'],
      punho: ['dead-bug-perna-estendida'],
      pescoco: ['dead-bug-perna-estendida'],
      semEquipamento: ['dead-bug-perna-estendida']
    },
    criterioAvanco: 'Completar 3 séries de 20 repetições alternadas com a coluna lombar 100% colada ao chão',
    sinonimos: ['dead bug pernas retas', 'straight leg dead bug'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posição Inicial', description: 'Deite de costas no solo, braços estendidos para o teto e joelhos a 90 graus, pressionando a lombar contra o chão.' },
      { step: 2, title: 'Extensão Simultânea', description: 'Estenda um braço para trás da cabeça enquanto estende a perna oposta em linha reta a poucos centímetros do chão.' },
      { step: 3, title: 'Retorno Ativo', description: 'Retorne ao centro com controle e repita com o membro contralateral.' }
    ],
    commonMistakes: [
      { mistake: 'Arquear a lombar criando espaço entre a coluna e o solo', correction: 'Interrompa a descida da perna na angulação exata em que sua lombar conseguir ficar colada.' }
    ]
  },
  {
    id: 'bird-dog-pausa',
    name: 'Bird Dog com Pausa Isométrica',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['lombar'],
    secondaryMuscles: ['gluteos', 'ombros', 'abdomen'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 45,
    description: 'Exercício de estabilização lombo-pélvica e cadeia cruzada posterior, sustentando a posição de extensão máxima com pausa de 3 a 5 segundos no topo.',
    breathingTip: 'Inspire ao estender e sustente o ar e a tensão durante a pausa; expire ao recolher.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Não faça hiperextensão da coluna cervical nem gire a pelve.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'costas-baixa',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-3-2',
    regressoes: ['bird-dog'],
    progressoes: ['superman', 'superman-alternado'],
    variacoes: ['bird-dog'],
    adaptacoes: {
      lombar: ['bird-dog'],
      punho: ['bird-dog'],
      joelho: ['bird-dog'],
      semEquipamento: ['bird-dog-pausa']
    },
    criterioAvanco: 'Executar 3 séries de 12 repetições com pausa sólida de 3 segundos sem rotação do quadril',
    sinonimos: ['perdigueiro com pausa', 'isometric bird dog hold'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Quatro Apoios', description: 'Mãos sob os ombros e joelhos sob o quadril, mantendo a coluna em posição neutra.' },
      { step: 2, title: 'Extensão Cruzada', description: 'Estenda o braço direito para a frente e a perna esquerda para trás até alinharem-se com o tronco.' },
      { step: 3, title: 'Pausa Isométrica', description: 'Congele na posição por 3 a 5 segundos apertando glúteo e abdômen, e retorne suavemente.' }
    ],
    commonMistakes: [
      { mistake: 'Girar a bacia para cima do lado da perna estendida', correction: 'Mantenha os dois ossos do quadril rigorosamente paralelos ao piso.' }
    ]
  },
  {
    id: 'hollow-hold-uma-perna',
    name: 'Hollow Hold com Uma Perna Estendida',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['quadriceps', 'lombar', 'ombros'],
    defaultSets: 3,
    defaultHoldSeconds: 30,
    defaultRestSeconds: 45,
    description: 'Degrau intermediário entre a canoa encolhida (tuck) e a canoa completa, mantendo um joelho flexionado junto ao peito e a outra perna totalmente estendida à frente.',
    breathingTip: 'Respire curto e superficial pelas costelas, mantendo a pressão intra-abdominal e o umbigo sugado.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Se a lombar sair do solo, puxe ambos os joelhos para o tuck.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['hollow-hold-tuck', 'dead-bug'],
    progressoes: ['hollowbody'],
    variacoes: ['hollow-hold-tuck'],
    adaptacoes: {
      lombar: ['hollow-hold-tuck', 'dead-bug'],
      pescoco: ['dead-bug'],
      semEquipamento: ['hollow-hold-uma-perna']
    },
    criterioAvanco: 'Manter 3 séries de 30 segundos cada perna com retroversão pélvica impecável',
    sinonimos: ['single leg hollow hold', 'canoa uma perna', 'hollow body unilateral'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Decúbito Dorsal', description: 'Deite de costas e pressione a coluna lombar contra o solo sem deixar frestas.' },
      { step: 2, title: 'Posição Assimétrica', description: 'Eleve escápulas e cabeça do solo; traga um joelho dobrado próximo ao peito e estenda a outra perna à frente a 45 graus.' },
      { step: 3, title: 'Sustentação', description: 'Estenda os braços ao lado do corpo ou para trás da cabeça, sustentando a firmeza do core.' }
    ],
    commonMistakes: [
      { mistake: 'Permitir que a lombar descole do solo', correction: 'Eleve um pouco mais o ângulo da perna estendida para manter o contato lombar completo.' }
    ]
  },
  {
    id: 'hollow-rock',
    name: 'Hollow Rock (Balanço na Canoa)',
    category: 'Core',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['quadriceps', 'lombar', 'ombros'],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 60,
    description: 'Exercício clássico da ginástica olímpica: o corpo mantém a forma estrita de canoa (hollow) enquanto oscila suavemente como um arco contínuo, sem quebrar o alinhamento corporal.',
    breathingTip: 'Ritme a respiração mantendo o core selado: expire no balanço para trás e inspire no retorno.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'O movimento deve ser suave como uma canoa na água; não desabe em impacto sobre as costas.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '1-0-1',
    regressoes: ['hollowbody'],
    progressoes: ['dragon-flag-tuck', 'toes-to-bar'],
    variacoes: ['hollowbody'],
    adaptacoes: {
      lombar: ['hollow-hold-tuck', 'dead-bug'],
      pescoco: ['hollowbody'],
      semEquipamento: ['hollow-rock']
    },
    criterioAvanco: '3 séries de 20 oscilações ritmadas e contínuas sem dobrar joelhos ou quebrar o arco lombar',
    sinonimos: ['balanço na canoa', 'hollow body rocks', 'canoa oscilante'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Forma da Canoa', description: 'Assuma a posição de hollow body completo: pernas estendidas e unidas, braços estendidos atrás da cabeça e lombar arredondada contra o chão.' },
      { step: 2, title: 'Início da Oscilação', description: 'Com o corpo completamente rígido e travado, use uma leve inclinação de pernas para iniciar o balanço.' },
      { step: 3, title: 'Balanço Contínuo', description: 'Oscile da região lombar até as escápulas mantendo a curvatura sólida sem mexer os membros isoladamente.' }
    ],
    commonMistakes: [
      { mistake: 'Balançar dobrando e chutando os joelhos', correction: 'Tranque completamente as articulações dos joelhos e quadris; o movimento vem do conjunto inteiro.' }
    ]
  },
  {
    id: 'elevacao-pernas-chao-pausa',
    name: 'Elevação de Pernas Deitado com Pausa no Ponto Zero',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['quadriceps', 'lombar'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Variação avançada da elevação de pernas no solo que elimina qualquer inércia ao sustentar 2 segundos de pausa isométrica a poucos centímetros do chão, onde a alavanca é máxima.',
    breathingTip: 'Solte o ar enquanto sobe as pernas; inspire e segure o ar brevemente durante a pausa no fundo.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Não deixe a coluna lombar arquear durante a parada próxima ao chão.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-2-1',
    regressoes: ['elevacao-pernas-chao'],
    progressoes: ['elevacao-joelhos-barra', 'flutter-kicks'],
    variacoes: ['elevacao-pernas-chao', 'flutter-kicks'],
    adaptacoes: {
      lombar: ['elevacao-joelhos-chao', 'dead-bug'],
      pescoco: ['elevacao-pernas-chao'],
      semEquipamento: ['elevacao-pernas-chao-pausa']
    },
    criterioAvanco: '3 séries de 12 repetições com 2 segundos de pausa precisa sem arquear a coluna',
    sinonimos: ['leg raise com pausa', 'lying leg raise pause', 'infra com pausa'],
    animationType: 'leg-raise',
    executionSteps: [
      { step: 1, title: 'Posição Inicial', description: 'Deite de barriga para cima, mãos sob o quadril ou estendidas ao lado do tronco, pernas esticadas.' },
      { step: 2, title: 'Subida e Descida', description: 'Erga as pernas até a vertical e desça controladamente até quase tocar os calcanhares no chão.' },
      { step: 3, title: 'Pausa no Ponto Crítico', description: 'Congele a 5 cm do solo por 2 segundos completos mantendo a coluna pressionada para baixo, antes de subir novamente.' }
    ],
    commonMistakes: [
      { mistake: 'Descansar os calcanhares no chão durante a pausa', correction: 'Mantenha os calcanhares flutuando sob constante tensão abdominal.' }
    ]
  },
  {
    id: 'flutter-kicks',
    name: 'Tesoura Abdominal no Solo (Flutter Kicks)',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['quadriceps', 'lombar'],
    defaultSets: 3,
    defaultReps: 30,
    defaultRestSeconds: 60,
    description: 'Exercício de resistência e estabilização lombo-pélvica onde as pernas realizam movimentos rápidos e alternados para cima e para baixo com joelhos estendidos e lombar protegida.',
    breathingTip: 'Mantenha respiração contínua e rítmica, sem trancar a glote.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Se sentir desconforto na lombar, apoie as mãos sob a bacia ou eleve o ângulo das pernas.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '1-0-1',
    regressoes: ['elevacao-pernas-chao', 'elevacao-joelhos-chao'],
    progressoes: ['hollowbody', 'hollow-rock'],
    variacoes: ['elevacao-pernas-chao'],
    adaptacoes: {
      lombar: ['elevacao-joelhos-chao', 'dead-bug'],
      pescoco: ['flutter-kicks'],
      semEquipamento: ['flutter-kicks']
    },
    criterioAvanco: '3 séries de 40 batidas de perna com lombar cravada ao solo',
    sinonimos: ['tesourinha', 'chute tesoura', 'flutter kicks abdominal'],
    animationType: 'leg-raise',
    executionSteps: [
      { step: 1, title: 'Postura Inicial', description: 'Deite de costas, eleve levemente ombros e cabeça, com as mãos sob o glúteo para suporte pélvico.' },
      { step: 2, title: 'Elevação dos Pés', description: 'Tire os calcanhares do chão em torno de 15 a 25 cm, mantendo as pontas dos pés ativas.' },
      { step: 3, title: 'Batimento Alternado', description: 'Oscile as pernas para cima e para baixo em movimentos curtos e firmes, contraindo o abdômen sem parar.' }
    ],
    commonMistakes: [
      { mistake: 'Flexionar os joelhos durante a batida', correction: 'Mantenha os joelhos completamente estendidos para exigir o trabalho do abdômen e flexores.' }
    ]
  },
  {
    id: 'crunch-solo',
    name: 'Abdominal Curto no Solo (Crunch Tradicional)',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['lombar'],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 45,
    description: 'Movimento fundamental de flexão da coluna torácica aproximando as costelas da pelve, isolando o reto abdominal superior sem sobrecarga na coluna lombar.',
    breathingTip: 'Solte todo o ar pela boca na subida ao espremer o abdômen; inspire ao descer.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Não puxe a cabeça com as mãos; apoie os dedos suavemente na nuca ou cruze os braços no peito.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['dead-bug'],
    progressoes: ['abdominal-completo', 'abdominal-bicicleta', 'russian-twist'],
    variacoes: ['dead-bug', 'heel-touch'],
    adaptacoes: {
      lombar: ['dead-bug', 'crunch-solo'],
      pescoco: ['dead-bug'],
      semEquipamento: ['crunch-solo']
    },
    criterioAvanco: '3 séries de 20 repetições com contração máxima de 1 segundo no pico sem puxar o pescoço',
    sinonimos: ['crunch tradicional', 'abdominal clássico', 'abdominal supra'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Posicionamento', description: 'Deite de costas com os joelhos dobrados e os pés apoiados no chão na largura dos quadris.' },
      { step: 2, title: 'Flexão Torácica', description: 'Eleve os ombros e escápulas do chão enrolando o tronco em direção ao quadril, mantendo a lombar encostada.' },
      { step: 3, title: 'Pico e Retorno', description: 'Aperte a musculatura no topo por um instante e desça de forma lenta e controlada.' }
    ],
    commonMistakes: [
      { mistake: 'Puxar o pescoço com as mãos forçando a cervical', correction: 'Fixe o olhar em diagonal para cima e mantenha espaço de uma maçã entre queixo e peito.' }
    ]
  },
  {
    id: 'abdominal-completo',
    name: 'Abdominal Completo no Solo (Sit-Up)',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['quadriceps', 'lombar'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 45,
    description: 'Exercício clássico de flexão completa do tronco a partir do solo até a posição sentada, combinando o trabalho do reto abdominal e flexores de quadril.',
    breathingTip: 'Expire intensamente durante a subida do tronco; inspire de forma controlada na descida.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Evite puxar a cabeça com as mãos. Em caso de desconforto lombar prévio, prefira o crunch curto.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['crunch-solo'],
    progressoes: ['abdominal-canivete', 'elevacao-pernas-chao'],
    variacoes: ['crunch-solo', 'abdominal-bicicleta'],
    adaptacoes: {
      lombar: ['crunch-solo', 'dead-bug'],
      pescoco: ['crunch-solo'],
      semEquipamento: ['abdominal-completo']
    },
    criterioAvanco: 'Completar 3 séries de 15 repetições com subida e descida fluidas sem soltar o corpo no chão',
    sinonimos: ['sit-up', 'situp', 'abdominal militar', 'subida completa de tronco', 'abdominal completo'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Decúbito Dorsal', description: 'Deite-se de costas no solo com os joelhos dobrados a 90° e pés firmes no chão, braços cruzados sobre o peito.' },
      { step: 2, title: 'Flexão do Tronco', description: 'Eleve o tronco enrolando vértebra por vértebra até alcançar a posição sentada completa.' },
      { step: 3, title: 'Descida Articulada', description: 'Desça de maneira controlada, encostando a coluna gradualmente no solo sem impacto.' }
    ],
    commonMistakes: [
      { mistake: 'Puxar o pescoço com força gerando compressão cervical', correction: 'Mantenha os braços cruzados no peito ou ao lado das orelhas sem entrelaçar os dedos atrás da nuca.' },
      { mistake: 'Usar impulso dos braços e descolar a lombar em bloco rígido', correction: 'Articule a coluna suavemente focando na contração contínua da parede abdominal.' }
    ]
  },
  {
    id: 'abdominal-canivete',
    name: 'Abdominal Canivete no Solo (V-Up)',
    category: 'Core',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['quadriceps', 'ombros', 'lombar'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Exercício dinâmico e exigente de compressão corporal que fecha tronco e pernas simultaneamente em formato de "V", recrutando toda a parede abdominal.',
    breathingTip: 'Expire forte ao fechar no topo tocando os pés; inspire ao abrir o corpo com controle.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Pare se houver dor aguda.',
      'Se não conseguir manter as pernas estendidas sem curvar a lombar, inicie com joelhos dobrados (tuck-up).'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['abdominal-completo', 'elevacao-pernas-chao'],
    progressoes: ['toes-to-bar', 'hollow-rock'],
    variacoes: ['hollow-rock', 'elevacao-pernas-chao'],
    adaptacoes: {
      lombar: ['crunch-solo', 'elevacao-joelhos-chao'],
      sobrepeso: ['abdominal-completo'],
      semEquipamento: ['abdominal-canivete']
    },
    criterioAvanco: 'Executar 3 séries de 12 repetições tocando a ponta dos pés com pernas estendidas e descida amortecida',
    sinonimos: ['v-up', 'abdominal em V', 'jackknife sit-up', 'canivete abdominal', 'abdominal canivete'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Extensão Total no Solo', description: 'Deite-se no chão com braços estendidos acima da cabeça e pernas unidas e alinhadas.' },
      { step: 2, title: 'Fechamento em V', description: 'Em movimento sincrônico, eleve o tronco e as pernas estendidas até que as mãos toquem as canelas ou pés.' },
      { step: 3, title: 'Abertura Controlada', description: 'Retorne abrindo o corpo sem relaxar a musculatura do core nem bater os calcanhares no solo.' }
    ],
    commonMistakes: [
      { mistake: 'Flexionar excessivamente os joelhos e bater as costas no solo na descida', correction: 'Mantenha os membros tão retos quanto possível e freie a descida antes de tocar totalmente o chão.' },
      { mistake: 'Mover apenas os braços e pernas mantendo o tronco colado ao chão', correction: 'Tire a parte superior das costas do solo ativando a flexão torácica no topo.' }
    ]
  },
  {
    id: 'abdominal-bicicleta',
    name: 'Abdominal Bicicleta (Bicycle Crunch)',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['lombar', 'quadriceps'],
    defaultSets: 3,
    defaultReps: 20,
    defaultRestSeconds: 45,
    description: 'Exercício de alta ativação muscular com flexão e rotação de tronco sincronizadas, recrutando intensamente os oblíquos internos, externos e o reto abdominal.',
    breathingTip: 'Expire a cada cruzamento de cotovelo com o joelho oposto, inspirando suavemente na transição.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Faça o movimento com cadência controlada; evite girar no impulso rápido.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-lateral',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['crunch-solo', 'dead-bug'],
    progressoes: ['russian-twist', 'prancha-lateral'],
    variacoes: ['crunch-solo', 'russian-twist'],
    adaptacoes: {
      lombar: ['dead-bug', 'crunch-solo'],
      pescoco: ['dead-bug'],
      semEquipamento: ['abdominal-bicicleta']
    },
    criterioAvanco: '3 séries de 24 repetições alternadas com rotação ampla do tórax e extensão completa da perna',
    sinonimos: ['bicycle crunch', 'abdominal pedalada', 'crunch com rotação'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Preparação', description: 'Deite de costas, mãos ao lado das orelhas, joelhos suspensos a 90 graus e escápulas fora do chão.' },
      { step: 2, title: 'Giro e Extensão', description: 'Gire o tórax levando a axila/cotovelo direito em direção ao joelho esquerdo, estendendo a perna direita à frente.' },
      { step: 3, title: 'Transição Contínua', description: 'Alterne o lado suavemente sem deixar os ombros tocarem no chão entre as repetições.' }
    ],
    commonMistakes: [
      { mistake: 'Apenas mover os cotovelos sem girar o tronco', correction: 'Foque em apontar o ombro em direção ao joelho oposto, girando toda a caixa torácica.' }
    ]
  },

  // ==========================================
  // EXPANSÃO DE CORE - LOTE 2 (ROTAÇÃO, ANTI-EXTENSÃO, DRAGON FLAG E COMPRESSÕES)
  // ==========================================
  {
    id: 'russian-twist-pes-elevados',
    name: 'Russian Twist com Pés Elevados',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['lombar', 'quadriceps'],
    defaultSets: 3,
    defaultReps: 20,
    defaultRestSeconds: 45,
    description: 'Progressão do Russian Twist onde os pés são mantidos fora do solo em suspensão isométrica tipo V-hold, exigindo sustentação contínua do reto abdominal e flexores de quadril enquanto o tronco realiza as rotações laterais.',
    breathingTip: 'Expire ritmicamente a cada rotação dos braços ao tocar o solo lateralmente.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Mantenha a coluna reta e peito aberto; evite colapsar a torácica.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-lateral',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['russian-twist'],
    progressoes: ['copenhagen-plank-joelho', 'prancha-lateral-elevacao-quadril'],
    variacoes: ['russian-twist'],
    adaptacoes: {
      lombar: ['russian-twist', 'dead-bug'],
      pescoco: ['dead-bug'],
      semEquipamento: ['russian-twist-pes-elevados']
    },
    criterioAvanco: '3 séries de 24 rotações alternadas mantendo os pés perfeitamente imóveis no ar',
    sinonimos: ['giro russo pés elevados', 'elevated russian twist', 'russian twist v-sit'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Equilíbrio nos Ísquios', description: 'Sente-se, incline o tronco 45 graus para trás e eleve os pés do chão mantendo os joelhos semiflexionados.' },
      { step: 2, title: 'Rotação Controlada', description: 'Gire o tronco de um lado para o outro tocando as mãos próximo ao chão sem balançar as pernas.' },
      { step: 3, title: 'Retorno e Fluidez', description: 'Mantenha a cadência uniforme e o peito ereto até concluir as repetições.' }
    ],
    commonMistakes: [
      { mistake: 'Girar as pernas na direção oposta ao tronco', correction: 'Trave os joelhos e tornozelos juntos; a rotação deve ocorrer exclusivamente na cintura.' }
    ]
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers Frontal Tradicional',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['ombros', 'quadriceps', 'peito'],
    defaultSets: 3,
    defaultReps: 30,
    defaultRestSeconds: 45,
    description: 'Movimento dinâmico de corrida horizontal na postura de prancha alta, onde os joelhos sobem em linha reta sagital em direção ao peito, exigindo estabilidade anti-extensão.',
    breathingTip: 'Mantenha a respiração compassada no ritmo das passadas.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Não eleve excessivamente o quadril nem deixe a lombar ceder.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '1-0-1',
    regressoes: ['plank', 'prancha-joelhos'],
    progressoes: ['mountain-climber-cruzado', 'prancha-toque-ombro'],
    variacoes: ['mountain-climber-cruzado'],
    adaptacoes: {
      lombar: ['prancha-joelhos', 'dead-bug'],
      punho: ['plank'],
      ombro: ['prancha-joelhos'],
      semEquipamento: ['mountain-climbers']
    },
    criterioAvanco: '3 séries de 40 repetições contínuas com ritmo uniforme e alinhamento de prancha estrito',
    sinonimos: ['escalador frontal', 'alpinista horizontal', 'mountain climber tradicional'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Prancha Alta', description: 'Apoie as mãos sob a linha dos ombros e pernas estendidas com abdômen contraído.' },
      { step: 2, title: 'Puxada Sagital', description: 'Puxe um joelho em linha reta na direção do peito, mantendo o pé no ar sem tocar o chão.' },
      { step: 3, title: 'Troca Rápida', description: 'Retorne a perna estendida enquanto puxa imediatamente o joelho oposto em movimento fluido.' }
    ],
    commonMistakes: [
      { mistake: 'Balançar o quadril para cima e para baixo a cada passada', correction: 'Mantenha a linha do quadril no nível das escápulas durante toda a série.' }
    ]
  },
  {
    id: 'heel-touch',
    name: 'Toque nos Calcanhares Alternado (Penguin Crunch)',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['lombar'],
    defaultSets: 3,
    defaultReps: 24,
    defaultRestSeconds: 45,
    description: 'Exercício de flexão lateral da coluna deitado no solo, onde as mãos alternam toques nos calcanhares homolaterais com as escápulas suspensas, isolando os oblíquos com baixíssimo estresse articular.',
    breathingTip: 'Solte o ar a cada alcance lateral ao calcanhar; inspire ao passar pelo centro.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Não puxe a cabeça com as mãos; apoie o olhar suavemente para cima.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-lateral',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['dead-bug', 'crunch-solo'],
    progressoes: ['abdominal-bicicleta', 'russian-twist'],
    variacoes: ['crunch-solo'],
    adaptacoes: {
      lombar: ['dead-bug', 'heel-touch'],
      pescoco: ['dead-bug'],
      semEquipamento: ['heel-touch']
    },
    criterioAvanco: '3 séries de 30 toques alternados com sustentação escapular contínua',
    sinonimos: ['penguin crunch', 'toque de calcanhar', 'abdominal pinguim', 'alternating heel touch'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Decúbito Dorsal', description: 'Deite de costas com os joelhos flexionados e os pés apoiados no solo a cerca de 30 cm do quadril.' },
      { step: 2, title: 'Elevação Escapular', description: 'Tire os ombros e a parte superior das escápulas do chão mantendo os braços estendidos ao lado do corpo.' },
      { step: 3, title: 'Flexão Lateral', description: 'Deslize o tronco lateralmente até a mão direita tocar o calcanhar direito, retornando e tocando o esquerdo.' }
    ],
    commonMistakes: [
      { mistake: 'Apenas mexer os braços sem flexionar lateralmente a coluna', correction: 'Concentre o movimento no encurtamento da cintura de cada lado como um acordeão.' }
    ]
  },
  {
    id: 'ab-wheel-negativa',
    name: 'Roda Abdominal Excêntrica (Descida Controlada)',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['costas', 'ombros', 'peito', 'lombar'],
    defaultSets: 3,
    defaultReps: 6,
    defaultRestSeconds: 90,
    description: 'Treinamento da fase excêntrica da roda abdominal partindo dos joelhos, descendo lentamente até o corpo ficar próximo ao solo e retornando sem exigir a puxada concêntrica total.',
    breathingTip: 'Inspire profundamente na posição inicial e solte o ar de forma controlada durante a descida.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Não deixe a lombar desabar em momento algum da descida. Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '4-0-1',
    regressoes: ['plank', 'hollowbody'],
    progressoes: ['ab-wheel-joelhos'],
    variacoes: ['ab-wheel-joelhos'],
    adaptacoes: {
      lombar: ['plank', 'prancha-joelhos'],
      ombro: ['plank'],
      punho: ['plank'],
      semEquipamento: ['plank']
    },
    criterioAvanco: '3 séries de 8 repetições de descida com 4 segundos controlados até o solo',
    sinonimos: ['ab wheel negativa', 'rollout excêntrico', 'roda abdominal descida'],
    animationType: 'plank',
    executionSteps: [
      { step: 1, title: 'Ajoelhado com a Roda', description: 'Ajoelhe-se segurando a roda abdominal (ou toalha no chão liso) diretamente sob o peito.' },
      { step: 2, title: 'Rolagem Excêntrica', description: 'Role a roda para a frente estendendo os braços e o quadril em velocidade lenta e cadenciada (3 a 5 segundos).' },
      { step: 3, title: 'Finalização Suave', description: 'Ao atingir o ponto máximo sem perder a retroversão, deite no solo e volte à posição inicial de joelhos com calma.' }
    ],
    commonMistakes: [
      { mistake: 'Arquear a lombar antes de terminar a descida', correction: 'Interrompa a descida e deite suavemente no solo assim que o abdômen perder a tração.' }
    ]
  },
  {
    id: 'dragon-flag-adv-tuck',
    name: 'Dragon Flag Advanced Tuck (Coxas a 90°)',
    category: 'Core',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['costas', 'gluteos', 'lombar'],
    defaultSets: 3,
    defaultReps: 6,
    defaultRestSeconds: 90,
    description: 'Progressão intermediária do Dragon Flag onde o quadril é mantido aberto em ângulo de 90° a 110° em relação ao tronco com os joelhos dobrados, aumentando a alavanca em comparação ao tuck fechado.',
    breathingTip: 'Solte o ar na subida do tronco; inspire e trave o abdômen na descida excêntrica.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'O apoio deve ser sobre a parte superior das escápulas, NUNCA sobre as vértebras cervicais.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-2',
    regressoes: ['dragon-flag-tuck', 'dragon-flag-negativa'],
    progressoes: ['dragon-flag-uma-perna', 'dragon-flag'],
    variacoes: ['dragon-flag-tuck'],
    adaptacoes: {
      lombar: ['dragon-flag-tuck', 'hollowbody'],
      pescoco: ['hollowbody'],
      ombro: ['hollowbody'],
      semEquipamento: ['dragon-flag-tuck']
    },
    criterioAvanco: '3 séries de 6 repetições controladas com descida de 3 segundos sem dobrar o quadril além de 90°',
    sinonimos: ['advanced tuck dragon flag', 'dragon flag semi estendido'],
    animationType: 'dragon-flag',
    executionSteps: [
      { step: 1, title: 'Ancoragem', description: 'Deite em banco ou solo segurando firme uma barra ou apoio rígido atrás da cabeça.' },
      { step: 2, title: 'Elevação do Tronco', description: 'Erga o tronco apoiando-se unicamente nas escápulas, mantendo as coxas a 90 graus com o abdômen e joelhos dobrados.' },
      { step: 3, title: 'Descida Controlada', description: 'Desça o corpo em bloco reto das escápulas até o quadril até quase tocar o banco, e suba novamente.' }
    ],
    commonMistakes: [
      { mistake: 'Apoiar o peso sobre a nuca ou cervical', correction: 'Traga os ombros firmemente contra a superfície e garanta que o pescoço fique livre.' }
    ]
  },
  {
    id: 'dragon-flag-uma-perna',
    name: 'Dragon Flag com Uma Perna Estendida',
    category: 'Core',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['costas', 'gluteos', 'lombar'],
    defaultSets: 3,
    defaultReps: 5,
    defaultRestSeconds: 90,
    description: 'O penúltimo degrau para o Dragon Flag completo: uma das pernas permanece estendida em linha contínua com o tronco enquanto a outra fica dobrada junto ao peito.',
    breathingTip: 'Solte o ar com força na tração; inspire concentrado durante a descida.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Mantenha o glúteo da perna estendida travado para evitar que o quadril ceda.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '3-1-2',
    regressoes: ['dragon-flag-adv-tuck'],
    progressoes: ['dragon-flag'],
    variacoes: ['dragon-flag-adv-tuck'],
    adaptacoes: {
      lombar: ['dragon-flag-tuck', 'hollowbody'],
      pescoco: ['hollowbody'],
      semEquipamento: ['dragon-flag-adv-tuck']
    },
    criterioAvanco: '3 séries de 5 repetições cada lado com controle absoluto na descida',
    sinonimos: ['single leg dragon flag', 'dragon flag unilateral'],
    animationType: 'dragon-flag',
    executionSteps: [
      { step: 1, title: 'Pegada Firme', description: 'Segure firme o suporte atrás da cabeça e erga o tronco até a vertical nas escápulas.' },
      { step: 2, title: 'Alinhamento Unilateral', description: 'Estenda completamente uma perna alinhada ao tronco e mantenha o joelho oposto flexionado.' },
      { step: 3, title: 'Fase Excêntrica e Retorno', description: 'Desça o corpo em linha reta e puxe de volta com os dorsais e o abdômen sem desabar.' }
    ],
    commonMistakes: [
      { mistake: 'Deixar a perna estendida afundar antes do tronco', correction: 'Pense em formar uma viga única de aço dos ombros até a ponta do pé estendido.' }
    ]
  },
  {
    id: 'bar-pullover-joelhos',
    name: 'Bar Pull-Over com Joelhos Flexionados',
    category: 'Core',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['costas', 'biceps', 'ombros', 'antebraco'],
    defaultSets: 3,
    defaultReps: 5,
    defaultRestSeconds: 90,
    description: 'Movimento dinâmico de ginástica calistênica na barra fixa: flexão de braços e enrolamento abdominal sincronizados com joelhos dobrados para passar o quadril sobre a barra.',
    breathingTip: 'Solte o ar vigorosamente no momento de puxar o quadril sobre a barra fixa.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Certifique-se de manter pegada pronada firme e controle na rotação sobre a barra.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['barra'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['toes-to-bar', 'pullup'],
    progressoes: ['muscleup'],
    variacoes: ['toes-to-bar'],
    adaptacoes: {
      lombar: ['toes-to-bar', 'elevacao-joelhos-barra'],
      ombro: ['elevacao-joelhos-barra'],
      punho: ['elevacao-joelhos-barra'],
      semEquipamento: ['dragon-flag-tuck']
    },
    criterioAvanco: '3 séries de 6 pull-overs limpos e controlados sem impulsos ou chutes soltos',
    sinonimos: ['pullover na barra', 'bar pullover tuck', 'volta na barra'],
    animationType: 'pull-up',
    executionSteps: [
      { step: 1, title: 'Puxada e Enrolamento', description: 'Inicie uma barra fixa puxando o peito enquanto puxa os joelhos flexionados vigorosamente para cima.' },
      { step: 2, title: 'Passagem Pélvica', description: 'Gire o quadril para cima e sobre a barra enquanto os cotovelos sobem para a posição de apoio.' },
      { step: 3, title: 'Apoio Final', description: 'Estenda os braços terminando na posição de suporte reto sobre a barra fixa.' }
    ],
    commonMistakes: [
      { mistake: 'Tentar girar com os braços completamente estendidos', correction: 'Traga a barra bem perto do peito e queixo antes de rolar o quadril sobre ela.' }
    ]
  },
  {
    id: 'lsit-pes-chao',
    name: 'L-Sit com Apoio de Calcanhares no Solo',
    category: 'Core',
    difficulty: 'Iniciante',
    type: 'isometric',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['triceps', 'ombros', 'quadriceps'],
    defaultSets: 3,
    defaultHoldSeconds: 20,
    defaultRestSeconds: 45,
    description: 'Regressão fundamental do L-Sit no solo ou paralela: as mãos empurram o chão em depressão escapular máxima erguendo o quadril do chão, enquanto os calcanhares permanecem apoiados levemente à frente.',
    breathingTip: 'Mantenha a respiração contínua enquanto empurra vigorosamente o chão para baixo.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Não deixe os ombros subirem em direção às orelhas; mantenha depressão escapular ativa.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: true,
    cadencia: 'isometria',
    regressoes: ['hollow-hold-tuck', 'plank'],
    progressoes: ['lsit-solo-tuck'],
    variacoes: ['lsit-solo-tuck'],
    adaptacoes: {
      punho: ['lsit-pes-chao'],
      lombar: ['dead-bug', 'hollow-hold-tuck'],
      ombro: ['dead-bug'],
      semEquipamento: ['lsit-pes-chao']
    },
    criterioAvanco: '3 séries de 30 segundos sustentados com depressão escapular impecável',
    sinonimos: ['foot supported l-sit', 'l-sit com pés apoiados', 'l-sit iniciante'],
    animationType: 'l-sit',
    executionSteps: [
      { step: 1, title: 'Posição Sentada', description: 'Sente-se no solo com pernas estendidas à frente e apoie as palmas das mãos ao lado dos quadris.' },
      { step: 2, title: 'Depressão Escapular', description: 'Empurre o solo com força afastando as orelhas dos ombros e tirando o quadril do chão.' },
      { step: 3, title: 'Sustentação com Apoio', description: 'Mantenha os calcanhares encostados no solo aliviando parte do peso, ativando abdômen e tríceps.' }
    ],
    commonMistakes: [
      { mistake: 'Permitir que o quadril fique apoiado no solo', correction: 'Empurre o chão com mais intensidade travando os cotovelos totalmente estendidos.' }
    ]
  },
  {
    id: 'pike-compression',
    name: 'Compressão Pike no Solo (Elevação de Pernas Sentado)',
    category: 'Core',
    difficulty: 'Intermediário',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['quadriceps', 'lombar'],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    description: 'Exercício de força de compressão ativa da ginástica artística: sentado com pernas estendidas e unidas, as mãos apoiam próximo aos joelhos para erguer os pés do chão sem reclinar o tronco.',
    breathingTip: 'Solte o ar vigorosamente na subida das pernas; inspire ao tocar o chão com leveza.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Não incline o tronco para trás para compensar a falta de compressão abdominal.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['elevacao-pernas-chao'],
    progressoes: ['lsit', 'straddle-compression'],
    variacoes: ['straddle-compression'],
    adaptacoes: {
      lombar: ['elevacao-pernas-chao', 'dead-bug'],
      punho: ['elevacao-pernas-chao'],
      semEquipamento: ['pike-compression']
    },
    criterioAvanco: '3 séries de 12 repetições estritas com as mãos posicionadas além da linha dos joelhos',
    sinonimos: ['pike leg lift', 'compressão em pike', 'seated leg lift'],
    animationType: 'l-sit',
    executionSteps: [
      { step: 1, title: 'Sentado em L', description: 'Sente-se ereto com pernas unidas e pontas dos pés ativas apontadas para a frente.' },
      { step: 2, title: 'Mãos à Frente', description: 'Apoie as pontas dos dedos ou palmas no solo entre as coxas e os joelhos.' },
      { step: 3, title: 'Elevação por Compressão', description: 'Contraia o abdômen e quadríceps erguendo os calcanhares do chão em bloco sem reclinar o tronco para trás.' }
    ],
    commonMistakes: [
      { mistake: 'Inclinar o tronco para trás para alavancar a subida', correction: 'Traga as mãos mais para a frente e incline o tórax levemente sobre as pernas.' }
    ]
  },
  {
    id: 'straddle-compression',
    name: 'Compressão Straddle no Solo (Pernas Afastadas)',
    category: 'Core',
    difficulty: 'Avançado',
    type: 'reps',
    primaryMuscles: ['abdomen'],
    secondaryMuscles: ['quadriceps', 'lombar', 'gluteos'],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    description: 'Compressão ativa com pernas abertas em straddle: as mãos apoiam no solo à frente da virilha e as pernas estendidas são erguidas simultaneamente, exigindo flexibilidade ativa e força pura de core.',
    breathingTip: 'Expire com força ao erguer as pernas em straddle; inspire ao pousar de leve.',
    reviewedBy: null,
    revisadoPor: null,
    safetyCautions: [
      'Não faça movimentos balísticos; erga e desça as pernas com controle muscular.',
      'Pare se houver dor aguda.'
    ],
    padrao: 'core-anterior',
    equipamento: ['nenhum'],
    tipoExercicio: 'principal',
    estatico: false,
    cadencia: '2-1-2',
    regressoes: ['pike-compression'],
    progressoes: ['vsit'],
    variacoes: ['pike-compression'],
    adaptacoes: {
      lombar: ['pike-compression', 'elevacao-pernas-chao'],
      punho: ['pike-compression'],
      semEquipamento: ['straddle-compression']
    },
    criterioAvanco: '3 séries de 10 repetições estritas mantendo a abertura em straddle ampla e tronco firme',
    sinonimos: ['straddle leg lift', 'compressão straddle', 'elevação em abertura'],
    animationType: 'l-sit',
    executionSteps: [
      { step: 1, title: 'Posição em Straddle', description: 'Sente-se no solo com as pernas abertas em V o máximo que conseguir confortavelmente.' },
      { step: 2, title: 'Apoio Central', description: 'Apoie as mãos no solo à sua frente, entre as coxas, com os braços retos.' },
      { step: 3, title: 'Elevação Simultânea', description: 'Esprema o abdômen e flexores de quadril levantando ambos os calcanhares simultaneamente do solo.' }
    ],
    commonMistakes: [
      { mistake: 'Dobrar os joelhos para facilitar a subida', correction: 'Trave os joelhos estendidos e aponte os pés para fora mantendo as pernas ativas.' }
    ]
  }

];
