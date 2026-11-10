/**
 * Motor de Análise Biomecânica e Parâmetros Cinemáticos do CalisteFlow
 * Gera dinamicamente keyframes angulares, ativações musculares (#00FF66) e análise de estresse articular
 * para qualquer um dos 208 exercícios do aplicativo.
 */

import type { Exercise } from '../../../types';
import { getExerciseById, EXERCISES_DATABASE } from '../../../data/exercisesData';

export interface BiomechanicalPhaseKeyframe {
  fase: 1 | 2 | 3;
  nome: string;
  duracaoMs: number;
  normalizedTime: number; // 0.0 = setup, 0.5 = pico, 1.0 = retorno
  apoioFixo: {
    membro: 'maos' | 'pes' | 'ombros' | 'costas' | 'joelhos' | 'antebraco';
    x: number;
    y: number;
  };
  angulosArticularesGraus: {
    ombro: number;
    cotovelo: number;
    quadril: number;
    joelho: number;
    tornozelo: number;
  };
  torqueEscapular: string;
  instrucaoCurta: string;
  focoPostural: string;
}

export interface BiomechanicalMuscleActivation {
  musculo: string;
  segmento: string;
  intensidade: number; // 0.0 a 1.0
  corDestaque: string; // #00FF66
  papel: string;
}

export interface BiomechanicalJointStress {
  articulacao: string;
  tipoCarga: string;
  nivelStress: 'moderado' | 'alto' | 'critico';
  alinhamentoCritico: string;
}

export interface BiomechanicalAnalysisData {
  exercicio: {
    nome: string;
    id: string;
    familia: string;
    nivel: string;
    padraoCinematico: string;
  };
  estiloVisual: {
    modo: string;
    canvas: {
      largura: number;
      altura: number;
      chaoY: number;
    };
    cores: {
      figuraBase: string;
      contornoArticular: string;
      destaqueAtivacao: string; // #00FF66
      pontoApoioFixo: string;
    };
    tracoEspessuraPx: number;
  };
  keyframes: {
    fase1_setup: BiomechanicalPhaseKeyframe;
    fase2_pico: BiomechanicalPhaseKeyframe;
    fase3_retorno: BiomechanicalPhaseKeyframe;
  };
  mapeamentoAtivacaoMuscular: BiomechanicalMuscleActivation[];
  pontosAtencaoStressArticular: BiomechanicalJointStress[];
  errosCriticos: Array<{
    erro: string;
    correcao: string;
    riscoLesao: string;
  }>;
}

/**
 * Mapeia grupo muscular para o segmento anatômico correspondente
 */
function getMuscleSegment(muscle: string): string {
  switch (muscle) {
    case 'peito': return 'tronco-anterior';
    case 'costas': return 'tronco-posterior';
    case 'ombros': return 'cintura-escapular';
    case 'triceps': return 'braco-posterior';
    case 'biceps': return 'braco-anterior';
    case 'antebraco': return 'antebraco';
    case 'abdomen': return 'core-anterior';
    case 'lombar': return 'core-posterior';
    case 'quadriceps': return 'coxa-anterior';
    case 'posteriores': return 'coxa-posterior';
    case 'gluteos': return 'quadril-posterior';
    case 'panturrilhas': return 'perna-distal';
    default: return 'tronco';
  }
}

/**
 * Gera a análise biomecânica completa e keyframes cinemáticos para qualquer exercício
 */
export function generateBiomechanicalAnalysis(exerciseOrId: Exercise | string): BiomechanicalAnalysisData {
  const exercise = typeof exerciseOrId === 'string'
    ? getExerciseById(exerciseOrId) || EXERCISES_DATABASE.find(e => e.id === exerciseOrId)
    : exerciseOrId;

  if (!exercise) {
    throw new Error(`Exercício não encontrado: ${exerciseOrId}`);
  }

  const padrao = exercise.padrao || 'empurrar-horizontal';
  const isIsometric = exercise.type === 'isometric' || exercise.estatico;

  // Keyframes cinemáticos padrão por família motora
  let k1: BiomechanicalPhaseKeyframe;
  let k2: BiomechanicalPhaseKeyframe;
  let k3: BiomechanicalPhaseKeyframe;
  let jointStresses: BiomechanicalJointStress[] = [];

  switch (padrao) {
    case 'empurrar-horizontal': {
      k1 = {
        fase: 1,
        nome: 'Setup / Prancha Alta',
        duracaoMs: 1000,
        normalizedTime: 0.0,
        apoioFixo: { membro: 'maos', x: 240, y: 272 },
        angulosArticularesGraus: { ombro: 72, cotovelo: 180, quadril: 180, joelho: 180, tornozelo: 90 },
        torqueEscapular: 'Protração ativa com escápulas abduzidas',
        instrucaoCurta: 'Corpo alinhado em linha reta dos calcanhares ao topo da cabeça com braços estendidos.',
        focoPostural: 'Trave glúteos e abdômen para impedir que o quadril afunde.',
      };
      k2 = {
        fase: 2,
        nome: 'Pico Concêntrico / Fundo',
        duracaoMs: 1400,
        normalizedTime: 0.5,
        apoioFixo: { membro: 'maos', x: 240, y: 272 },
        angulosArticularesGraus: { ombro: 30, cotovelo: 88, quadril: 180, joelho: 180, tornozelo: 80 },
        torqueEscapular: 'Retração escapular controlada sem encolher ombros',
        instrucaoCurta: 'Desça o peito até 2 a 3 cm do solo com cotovelos a 45° do tronco.',
        focoPostural: 'Máxima tensão no peitoral e tríceps; antebraços quase verticais sobre os punhos.',
      };
      k3 = {
        fase: 3,
        nome: 'Retorno Excêntrico / Empurrada Final',
        duracaoMs: 1000,
        normalizedTime: 1.0,
        apoioFixo: { membro: 'maos', x: 240, y: 272 },
        angulosArticularesGraus: { ombro: 72, cotovelo: 180, quadril: 180, joelho: 180, tornozelo: 90 },
        torqueEscapular: 'Empurrada máxima com protração no topo (Push-up Plus)',
        instrucaoCurta: 'Empurre o solo com força acelerando a subida até a extensão total dos braços.',
        focoPostural: 'Finalize afastando o peito do chão sem elevar o quadril antes do tronco.',
      };
      jointStresses = [
        {
          articulacao: 'punho',
          tipoCarga: 'Compressão axial e extensão a 90°',
          nivelStress: 'moderado',
          alinhamentoCritico: 'Dedos bem espalmados e peso distribuído na base do indicador e polegar.',
        },
        {
          articulacao: 'ombro (glenoumeral)',
          tipoCarga: 'Cisalhamento anterior se cotovelos abrirem a 90°',
          nivelStress: 'alto',
          alinhamentoCritico: 'Mantenha os cotovelos fechados a 45° em relação à caixa torácica.',
        },
        {
          articulacao: 'coluna lombar',
          tipoCarga: 'Extensão gravitacional induzida pelo peso da bacia',
          nivelStress: 'moderado',
          alinhamentoCritico: 'Bacia em retroversão ativa com contração de glúteos e abdômen.',
        },
      ];
      break;
    }

    case 'empurrar-vertical':
    case 'mergulhos': {
      k1 = {
        fase: 1,
        nome: 'Setup / Bloqueio no Topo',
        duracaoMs: 1000,
        normalizedTime: 0.0,
        apoioFixo: { membro: 'maos', x: 200, y: 160 },
        angulosArticularesGraus: { ombro: 15, cotovelo: 180, quadril: 170, joelho: 120, tornozelo: 90 },
        torqueEscapular: 'Depressão escapular ativa forçando ombros para baixo',
        instrucaoCurta: 'Sustente o corpo nas paralelas com braços retos e cotovelos travados.',
        focoPostural: 'Mantenha o peito aberto e pescoço longo; não deixe os ombros tocarem as orelhas.',
      };
      k2 = {
        fase: 2,
        nome: 'Pico de Descida / Máximo Torque de Ombro',
        duracaoMs: 1500,
        normalizedTime: 0.5,
        apoioFixo: { membro: 'maos', x: 200, y: 160 },
        angulosArticularesGraus: { ombro: 70, cotovelo: 90, quadril: 160, joelho: 120, tornozelo: 90 },
        torqueEscapular: 'Estabilização rígida em retração moderada',
        instrucaoCurta: 'Flexione os cotovelos até atingir 90° com ombros alinhados aos cotovelos.',
        focoPostural: 'Incline o tronco levemente para a frente para distribuir a carga entre peitoral e tríceps.',
      };
      k3 = {
        fase: 3,
        nome: 'Retorno / Empurrão Concêntrico',
        duracaoMs: 1100,
        normalizedTime: 1.0,
        apoioFixo: { membro: 'maos', x: 200, y: 160 },
        angulosArticularesGraus: { ombro: 15, cotovelo: 180, quadril: 170, joelho: 120, tornozelo: 90 },
        torqueEscapular: 'Trava terminal em máxima depressão escapular',
        instrucaoCurta: 'Empurre as barras para baixo estendendo os cotovelos sem trancos.',
        focoPostural: 'Bloqueie os cotovelos no topo com controle postural estrito.',
      };
      jointStresses = [
        {
          articulacao: 'ombro (cápsula anterior)',
          tipoCarga: 'Extensão forçada do úmero sob o peso corporal total',
          nivelStress: 'critico',
          alinhamentoCritico: 'Não ultrapasse 90° de flexão se não tiver mobilidade suficiente; evite rotação interna excessiva.',
        },
        {
          articulacao: 'cotovelo',
          tipoCarga: 'Momento de força no tendão tricipital',
          nivelStress: 'alto',
          alinhamentoCritico: 'Cotovelos paralelos sem abrir para fora (flare out).',
        },
      ];
      break;
    }

    case 'puxar-vertical': {
      k1 = {
        fase: 1,
        nome: 'Setup / Active Hang (Suspensão Ativa)',
        duracaoMs: 1000,
        normalizedTime: 0.0,
        apoioFixo: { membro: 'maos', x: 200, y: 60 },
        angulosArticularesGraus: { ombro: 175, cotovelo: 180, quadril: 180, joelho: 175, tornozelo: 100 },
        torqueEscapular: 'Depressão escapular de baixo para cima com afastamento das orelhas',
        instrucaoCurta: 'Pendurado na barra, ative as escápulas puxando-as para baixo antes de dobrar os braços.',
        focoPostural: 'Pernas unidas e abdômen travado em hollow body sem oscilações pendulares.',
      };
      k2 = {
        fase: 2,
        nome: 'Pico Concêntrico / Queixo sobre a Barra',
        duracaoMs: 1400,
        normalizedTime: 0.5,
        apoioFixo: { membro: 'maos', x: 200, y: 60 },
        angulosArticularesGraus: { ombro: 35, cotovelo: 45, quadril: 180, joelho: 170, tornozelo: 100 },
        torqueEscapular: 'Depressão e retração máxima com cotovelos puxados para trás',
        instrucaoCurta: 'Puxe o peito na barra até o queixo passar nitidamente a linha superior.',
        focoPostural: 'Cotovelos apontados para o chão; peito expandido liderando o movimento.',
      };
      k3 = {
        fase: 3,
        nome: 'Retorno Excêntrico Controlado',
        duracaoMs: 1200,
        normalizedTime: 1.0,
        apoioFixo: { membro: 'maos', x: 200, y: 60 },
        angulosArticularesGraus: { ombro: 175, cotovelo: 180, quadril: 180, joelho: 175, tornozelo: 100 },
        torqueEscapular: 'Descida lenta controlada mantendo ativação dorsal até a extensão',
        instrucaoCurta: 'Estenda os cotovelos em 2 a 3 segundos sem relaxar de forma abrupta.',
        focoPostural: 'Mantenha o controle excêntrico para proteger tendões de ombros e bíceps.',
      };
      jointStresses = [
        {
          articulacao: 'ombro (manguito rotador)',
          tipoCarga: 'Tração longitudinal e compressão acromial se desabar no dead hang',
          nivelStress: 'alto',
          alinhamentoCritico: 'Nunca solte o tônus escapular na base; inicie a repetição a partir do active hang.',
        },
        {
          articulacao: 'cotovelo (epicôndilo medial e lateral)',
          tipoCarga: 'Tensão flexora sob carga corporal suspensa',
          nivelStress: 'moderado',
          alinhamentoCritico: 'Evite quebrar os punhos em dorsiflexão excessiva se estiver em barra fixa pronada.',
        },
      ];
      break;
    }

    case 'skills': {
      k1 = {
        fase: 1,
        nome: 'Setup & Inclinação Inicial',
        duracaoMs: 1200,
        normalizedTime: 0.0,
        apoioFixo: { membro: 'maos', x: 200, y: 272 },
        angulosArticularesGraus: { ombro: 75, cotovelo: 180, quadril: 170, joelho: 180, tornozelo: 160 },
        torqueEscapular: 'Protração e depressão ativas armando a base',
        instrucaoCurta: 'Apoie as mãos firmemente, bloqueie os cotovelos e incline os ombros à frente dos punhos.',
        focoPostural: 'Crie a abóbada torácica antes de tirar os pés do apoio.',
      };
      k2 = {
        fase: 2,
        nome: isIsometric ? 'Sustentação Isométrica de Pico' : 'Pico de Alavanca',
        duracaoMs: 2000,
        normalizedTime: 0.5,
        apoioFixo: { membro: 'maos', x: 200, y: 272 },
        angulosArticularesGraus: { ombro: 48, cotovelo: 180, quadril: 180, joelho: 180, tornozelo: 180 },
        torqueEscapular: 'Máxima protração com alavanca horizontal estrita',
        instrucaoCurta: 'Eleve o corpo em linha horizontal perfeitamente nivelada sem dobrar os braços.',
        focoPostural: 'Trave glúteos e abdômen em retroversão pélvica rígida.',
      };
      k3 = {
        fase: 3,
        nome: 'Retorno / Desaceleração Controlada',
        duracaoMs: 1000,
        normalizedTime: 1.0,
        apoioFixo: { membro: 'maos', x: 200, y: 272 },
        angulosArticularesGraus: { ombro: 70, cotovelo: 180, quadril: 175, joelho: 180, tornozelo: 160 },
        torqueEscapular: 'Dissipação controlada da energia elástica',
        instrucaoCurta: 'Pouse ou desça com suavidade mantendo a tensão articular protegida.',
        focoPostural: 'Não permita colapso súbito sobre os punhos ou coluna.',
      };
      jointStresses = [
        {
          articulacao: 'punho',
          tipoCarga: 'Cisalhamento sob ângulo agudo em alavanca longa',
          nivelStress: 'critico',
          alinhamentoCritico: 'Dedos espalmados com rotação externa de 30° a 45° ou uso de parallettes.',
        },
        {
          articulacao: 'cotovelo (inserção do bíceps)',
          tipoCarga: 'Momento de extensão anti-gravitacional com braço 100% reto',
          nivelStress: 'critico',
          alinhamentoCritico: 'Cotovelos completamente travados; fossa cubital direcionada para a frente.',
        },
        {
          articulacao: 'coluna lombar',
          tipoCarga: 'Torque de extensão induzido pelo peso das pernas suspensas',
          nivelStress: 'alto',
          alinhamentoCritico: 'Retroversão pélvica ativa impedindo que a lombar curve para baixo (banana back).',
        },
      ];
      break;
    }

    case 'agachamento-pernas': {
      k1 = {
        fase: 1,
        nome: 'Setup / Postura Ereta em Pé',
        duracaoMs: 800,
        normalizedTime: 0.0,
        apoioFixo: { membro: 'pes', x: 190, y: 272 },
        angulosArticularesGraus: { ombro: 20, cotovelo: 180, quadril: 180, joelho: 180, tornozelo: 90 },
        torqueEscapular: 'Escápulas neutras e peito ereto',
        instrucaoCurta: 'Pés na largura dos ombros, pontas levemente voltadas para fora.',
        focoPostural: 'Distribua o peso uniformemente entre calcanhar, base do dedão e base do mindinho (tripé do pé).',
      };
      k2 = {
        fase: 2,
        nome: 'Pico Excêntrico / Agachamento Profundo',
        duracaoMs: 1400,
        normalizedTime: 0.5,
        apoioFixo: { membro: 'pes', x: 190, y: 272 },
        angulosArticularesGraus: { ombro: 85, cotovelo: 180, quadril: 65, joelho: 68, tornozelo: 65 },
        torqueEscapular: 'Braços à frente como contrapeso postural',
        instrucaoCurta: 'Desça o quadril abaixo da linha dos joelhos mantendo os calcanhares colados no chão.',
        focoPostural: 'Joelhos alinhados na direção do segundo dedo do pé, sem colapso valgo (joelho para dentro).',
      };
      k3 = {
        fase: 3,
        nome: 'Retorno Concêntrico / Extensão Tripla',
        duracaoMs: 1000,
        normalizedTime: 1.0,
        apoioFixo: { membro: 'pes', x: 190, y: 272 },
        angulosArticularesGraus: { ombro: 20, cotovelo: 180, quadril: 180, joelho: 180, tornozelo: 90 },
        torqueEscapular: 'Retorno com tronco ereto',
        instrucaoCurta: 'Pressione o chão com os calcanhares e estenda quadril e joelhos até a posição ereta.',
        focoPostural: 'Contraia os glúteos no topo sem hiperestender a lombar.',
      };
      jointStresses = [
        {
          articulacao: 'joelho (patelofemoral)',
          tipoCarga: 'Cisalhamento e compressão em máxima flexão',
          nivelStress: 'alto',
          alinhamentoCritico: 'Evite valgo dinâmico; joelhos sempre rastreando na linha dos pés.',
        },
        {
          articulacao: 'coluna lombar',
          tipoCarga: 'Momento de flexão anterior do tronco',
          nivelStress: 'moderado',
          alinhamentoCritico: 'Mantenha a lordose lombar fisiológica preservada (sem retroversão excessiva - butt wink).',
        },
        {
          articulacao: 'tornozelo',
          tipoCarga: 'Dorsiflexão máxima sob carga de equilíbrio',
          nivelStress: 'moderado',
          alinhamentoCritico: 'Calcanhares firmes no solo; não deixe o peso migrar para a ponta dos dedos.',
        },
      ];
      break;
    }

    default: {
      k1 = {
        fase: 1,
        nome: 'Setup e Posicionamento Inicial',
        duracaoMs: 1000,
        normalizedTime: 0.0,
        apoioFixo: { membro: 'maos', x: 200, y: 272 },
        angulosArticularesGraus: { ombro: 90, cotovelo: 180, quadril: 180, joelho: 180, tornozelo: 90 },
        torqueEscapular: 'Ativação escapular primária',
        instrucaoCurta: 'Alinhe a postura inicial respeitando o vetor de alavanca do movimento.',
        focoPostural: 'Estabilize o core antes de iniciar o esforço dinâmico ou isométrico.',
      };
      k2 = {
        fase: 2,
        nome: 'Pico de Esforço / Torque Máximo',
        duracaoMs: 1500,
        normalizedTime: 0.5,
        apoioFixo: { membro: 'maos', x: 200, y: 272 },
        angulosArticularesGraus: { ombro: 45, cotovelo: 90, quadril: 180, joelho: 180, tornozelo: 90 },
        torqueEscapular: 'Tensão máxima contra a força gravitacional',
        instrucaoCurta: 'Execute o pico da contração sustentando a postura em alinhamento estrito.',
        focoPostural: 'Mantenha as articulações travadas nos limites anatômicos prescritos.',
      };
      k3 = {
        fase: 3,
        nome: 'Retorno / Fase Excêntrica',
        duracaoMs: 1000,
        normalizedTime: 1.0,
        apoioFixo: { membro: 'maos', x: 200, y: 272 },
        angulosArticularesGraus: { ombro: 90, cotovelo: 180, quadril: 180, joelho: 180, tornozelo: 90 },
        torqueEscapular: 'Transição suave para o início da repetição seguinte',
        instrucaoCurta: 'Retorne à posição de setup com cadência controlada.',
        focoPostural: 'Evite desabamentos mecânicos na transição de volta ao ponto zero.',
      };
      jointStresses = [
        {
          articulacao: 'cintura escapular',
          tipoCarga: 'Estabilização articular funcional',
          nivelStress: 'moderado',
          alinhamentoCritico: 'Preservar estabilidade escapular sem protrações ou retrações descontroladas.',
        },
      ];
      break;
    }
  }

  // Mapeamento de ativação muscular dinâmico com realce #00FF66
  const primaryActivations: BiomechanicalMuscleActivation[] = exercise.primaryMuscles.map(m => ({
    musculo: m,
    segmento: getMuscleSegment(m),
    intensidade: 1.0,
    corDestaque: '#00FF66',
    papel: 'Agonista primário de contração concêntrica ou isometria',
  }));

  const secondaryActivations: BiomechanicalMuscleActivation[] = exercise.secondaryMuscles.map(m => ({
    musculo: m,
    segmento: getMuscleSegment(m),
    intensidade: 0.75,
    corDestaque: '#00FF66',
    papel: 'Sinergista ou estabilizador postural secundário',
  }));

  const erros = (exercise.commonMistakes || []).map(m => ({
    erro: m.mistake,
    correcao: m.correction,
    riscoLesao: 'Sobrecarga articular ou descompensação postural sob fadiga.',
  }));

  return {
    exercicio: {
      nome: exercise.name,
      id: exercise.id,
      familia: exercise.category || padrao,
      nivel: exercise.difficulty,
      padraoCinematico: exercise.tipoExercicio || (isIsometric ? 'isometria' : 'dinamico'),
    },
    estiloVisual: {
      modo: 'silhueta-biomecanica-ativa',
      canvas: {
        largura: 400,
        altura: 300,
        chaoY: 272,
      },
      cores: {
        figuraBase: '#1E293B',
        contornoArticular: '#38BDF8',
        destaqueAtivacao: '#00FF66',
        pontoApoioFixo: '#94A3B8',
      },
      tracoEspessuraPx: 2.5,
    },
    keyframes: {
      fase1_setup: k1,
      fase2_pico: k2,
      fase3_retorno: k3,
    },
    mapeamentoAtivacaoMuscular: [...primaryActivations, ...secondaryActivations],
    pontosAtencaoStressArticular: jointStresses,
    errosCriticos: erros.length > 0 ? erros : [
      {
        erro: 'Perda do alinhamento do core e desabamento escapular sob fadiga.',
        correcao: 'Reduza a alavanca ou encerre a série antes de comprometer a técnica.',
        riscoLesao: 'Estresse excessivo em ligamentos de ombros, punhos ou coluna.',
      },
      {
        erro: 'Compensação com movimentos de impulso balístico (kipping descontrolado).',
        correcao: 'Execute repetições estritas controlando o ritmo do movimento.',
        riscoLesao: 'Impacto articular de alta desaceleração.',
      },
    ],
  };
}

