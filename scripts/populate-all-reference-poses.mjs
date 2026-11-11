// scripts/populate-all-reference-poses.mjs
// Mapeamento e centralização individual de todos os 208 exercícios do CalisteFlow em referencePoseData.ts

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { REFERENCE_POSES_DATA } from '../src/components/visuals/figure/referencePoseData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../src/data/exercises');
const files = [
  'pushHorizontal.ts',
  'pushVertical.ts',
  'pullVertical.ts',
  'pullHorizontal.ts',
  'core.ts',
  'legs.ts',
  'skills.ts',
  'warmupMobility.ts',
  'stretches.ts'
];

// Carrega todos os exercícios brutos com ID e Nome
const catalog = [];
for (const f of files) {
  const content = fs.readFileSync(path.join(dataDir, f), 'utf8');
  const matches = [...content.matchAll(/id:\s*'([^']+)',\s*name:\s*'([^']+)'/g)];
  for (const m of matches) {
    catalog.push({ id: m[1], name: m[2], file: f });
  }
}

console.log(`Exercícios catalogados: ${catalog.length}`);

// Tabela de especificações anatômicas e biomecânicas personalizadas para cada variação
const CUSTOM_SPECS = {
  // === PUSH HORIZONTAL (17) ===
  'flexao-parede': { model: 'push', params: { benchHeight: 80 } },
  'flexao-inclinada': { model: 'push', params: { benchHeight: 45 } },
  'flexao-joelhos': { model: 'push', params: { isKnee: true } },
  'pushup': { model: 'push', params: { benchHeight: 0 } },
  'flexao-fechada': { model: 'push', params: { isClose: true } },
  'diamondpushup': { model: 'push', params: { isDiamond: true } },
  'flexao-declinada': { model: 'push', params: { feetHeight: 35 } },
  'flexao-aberta': { model: 'push', params: { isWide: true } },
  'flexao-escapular': { model: 'push', params: { isScapular: true } },
  'flexao-hindu': { model: 'push', params: { isHindu: true } },
  'flexao-arqueiro': { model: 'push', params: { isArcher: true } },
  'flexao-pseudo-planche': { model: 'push', params: { handsFarBack: true } },
  'flexao-unilateral-assistida': { model: 'push', params: { isUnilateral: true, isAssisted: true } },
  'flexao-unilateral': { model: 'push', params: { isUnilateral: true } },
  'flexao-com-palmas': { model: 'push', params: { isExplosive: true } },
  'flexao-diamante-pes-elevados': { model: 'push', params: { isDiamond: true, feetHeight: 35 } },
  'flexao-dedos': { model: 'push', params: { isFingertip: true } },

  // === PUSH VERTICAL (19) ===
  'pike-pushup-joelhos': { model: 'pike', params: { isKnee: true } },
  'pikepushup': { model: 'pike', params: {} },
  'pike-pushup-elevado': { model: 'pike', params: { feetHeight: 35 } },
  'prancha-peito-parede': { model: 'handstand', params: { isWall: true, isHSPU: false } },
  'handstand': { model: 'handstand', params: { isWall: true, isHSPU: false } },
  'hspu-negativa-parede': { model: 'handstand', params: { isWall: true, isHSPU: true } },
  'hspu-parcial-parede': { model: 'handstand', params: { isWall: true, isHSPU: true } },
  'hspu-completo-parede': { model: 'handstand', params: { isWall: true, isHSPU: true } },
  'handstand-livre': { model: 'handstand', params: { isWall: false, isHSPU: false } },
  'hspu-livre': { model: 'handstand', params: { isWall: false, isHSPU: true } },
  'dip-banco-chao': { model: 'dip', params: { isBench: true, isFeetElevated: false } },
  'dip-banco-elevado': { model: 'dip', params: { isBench: true, isFeetElevated: true } },
  'dip-paralela-negativa': { model: 'dip', params: {} },
  'dip': { model: 'dip', params: {} },
  'dip-inclinado': { model: 'dip', params: {} },
  'dip-argolas': { model: 'dip', params: { isRings: true } },
  'dip-com-carga': { model: 'dip', params: {} },
  'extensao-triceps-barra-baixa': { model: 'push', params: { benchHeight: 50, handsFarBack: true } },
  'dip-com-pausa': { model: 'dip', params: {} },

  // === PULL VERTICAL (20) ===
  'dead-hang': { model: 'pull', params: { isDeadHang: true } },
  'retracao-escapular-barra': { model: 'pull', params: { isScapular: true } },
  'barra-negativa': { model: 'pull', params: {} },
  'barra-com-elastico': { model: 'pull', params: {} },
  'chinup-supinada': { model: 'pull', params: { isChinup: true } },
  'pullup': { model: 'pull', params: {} },
  'barra-pegada-neutra': { model: 'pull', params: { isNeutral: true } },
  'barra-aberta': { model: 'pull', params: { isWide: true } },
  'barra-arqueiro': { model: 'pull', params: { isArcher: true } },
  'lsit-pullup': { model: 'pull', params: { isLsit: true } },
  'muscle-up-transicao': { model: 'pull', params: { isMuscleUp: true } },
  'muscleup': { model: 'pull', params: { isMuscleUp: true } },
  'barra-unilateral-assistida': { model: 'pull', params: {} },
  'suspensao-falsa-pegada': { model: 'pull', params: { isDeadHang: true } },
  'suspensao-queixo-acima-barra': { model: 'pull', params: { isChinup: true } },
  'barra-fixa-explosiva': { model: 'pull', params: { isExplosive: true } },
  'chinup-excentrico': { model: 'pull', params: { isChinup: true } },
  'chinup-pausa-metade': { model: 'pull', params: { isChinup: true } },
  'dead-hang-toalha': { model: 'pull', params: { isTowel: true, isDeadHang: true } },
  'dead-hang-unilateral-assistido': { model: 'pull', params: { isDeadHang: true } },

  // === PULL HORIZONTAL (13) ===
  'remada-invertida-joelhos': { model: 'row', params: { isKnees: true } },
  'australianpullup': { model: 'row', params: { isKnees: false } },
  'remada-porta-toalha': { model: 'row', params: { isKnees: false } },
  'remada-invertida-pes-elevados': { model: 'row', params: { isFeetElevated: true } },
  'remada-invertida-supinada': { model: 'row', params: { isChinup: true } },
  'remada-argolas': { model: 'row', params: { isRings: true } },
  'remada-arqueiro': { model: 'row', params: { isArcher: true } },
  'remada-unilateral': { model: 'row', params: {} },
  'front-lever-row': { model: 'front_lever_skill', params: { type: 'tuck' } },
  'remada-invertida-pausa': { model: 'row', params: {} },
  'rosca-biceps-barra-baixa': { model: 'row', params: { isChinup: true } },
  'rosca-biceps-toalha-porta': { model: 'row', params: {} },
  'rosca-biceps-mochila': { model: 'standing_stretch', params: { type: 'biceps' } },

  // === CORE (56) ===
  'prancha-joelhos': { model: 'plank', params: { isKnee: true } },
  'plank': { model: 'plank', params: {} },
  'prancha-toque-ombro': { model: 'plank', params: { isShoulderTap: true, isHigh: true } },
  'dead-bug': { model: 'deadbug', params: {} },
  'hollow-hold-tuck': { model: 'hollow', params: { isTuck: true } },
  'hollowbody': { model: 'hollow', params: { isTuck: false } },
  'elevacao-joelhos-deitado': { model: 'crunch', params: { isLegRaise: true } },
  'elevacao-joelhos-chao': { model: 'crunch', params: { isLegRaise: true } },
  'elevacao-pernas-chao': { model: 'crunch', params: { isLegRaise: true } },
  'elevacao-joelhos-barra': { model: 'hanging_core', params: { isKnees: true } },
  'elevacao-pernas-barra': { model: 'hanging_core', params: { isToesToBar: false } },
  'toes-to-bar': { model: 'hanging_core', params: { isToesToBar: true } },
  'ab-wheel-joelhos': { model: 'ab_wheel', params: {} },
  'ab-wheel-pe': { model: 'ab_wheel', params: {} },
  'dragon-flag-negativa': { model: 'dragon_flag', params: {} },
  'dragon-flag-tuck': { model: 'dragon_flag', params: {} },
  'dragon-flag': { model: 'dragon_flag', params: {} },
  'prancha-lateral-joelhos': { model: 'side_plank', params: { isKnee: true } },
  'prancha-lateral': { model: 'side_plank', params: {} },
  'prancha-lateral-elevacao-quadril': { model: 'side_plank', params: { isDip: true } },
  'copenhagen-plank-joelho': { model: 'side_plank', params: { isCopenhagen: true, isKnee: true } },
  'copenhagen-plank-pe': { model: 'side_plank', params: { isCopenhagen: true } },
  'russian-twist': { model: 'crunch', params: { isVUp: true } },
  'mountain-climber-cruzado': { model: 'mountain_climber', params: {} },
  'bird-dog': { model: 'bird_dog', params: {} },
  'superman': { model: 'superman', params: {} },
  'superman-alternado': { model: 'superman', params: {} },
  'ponte-gluteo': { model: 'bridge', params: {} },
  'ponte-gluteo-unilateral': { model: 'bridge', params: {} },
  'hip-thrust-banco': { model: 'bridge', params: {} },
  'good-morning-peso-corpo': { model: 'standing_stretch', params: { type: 'hamstring' } },
  'nordic-curl-negativa': { model: 'nordic_curl', params: {} },
  'nordic-curl': { model: 'nordic_curl', params: {} },
  'prancha-elevacao-perna': { model: 'plank', params: {} },
  'prancha-serrote': { model: 'plank', params: { isSaw: true } },
  'prancha-apoio-instavel': { model: 'plank', params: {} },
  'dead-bug-perna-estendida': { model: 'deadbug', params: {} },
  'bird-dog-pausa': { model: 'bird_dog', params: {} },
  'hollow-hold-uma-perna': { model: 'hollow', params: { isTuck: false } },
  'hollow-rock': { model: 'hollow', params: { isTuck: false } },
  'elevacao-pernas-chao-pausa': { model: 'crunch', params: { isLegRaise: true } },
  'flutter-kicks': { model: 'crunch', params: { isLegRaise: true } },
  'crunch-solo': { model: 'crunch', params: {} },
  'abdominal-completo': { model: 'crunch', params: {} },
  'abdominal-canivete': { model: 'crunch', params: { isVUp: true } },
  'abdominal-bicicleta': { model: 'crunch', params: { isVUp: false } },
  'russian-twist-pes-elevados': { model: 'crunch', params: { isVUp: true } },
  'mountain-climbers': { model: 'mountain_climber', params: {} },
  'heel-touch': { model: 'crunch', params: {} },
  'ab-wheel-negativa': { model: 'ab_wheel', params: {} },
  'dragon-flag-adv-tuck': { model: 'dragon_flag', params: {} },
  'dragon-flag-uma-perna': { model: 'dragon_flag', params: {} },
  'bar-pullover-joelhos': { model: 'hanging_core', params: { isToesToBar: true } },
  'lsit-pes-chao': { model: 'lsit_skill', params: { type: 'tuck' } },
  'pike-compression': { model: 'crunch', params: { isVUp: true } },
  'straddle-compression': { model: 'crunch', params: { isVUp: true } },

  // === LEGS (27) ===
  'agachamento-assistido': { model: 'squat', params: {} },
  'squat': { model: 'squat', params: {} },
  'agachamento-parede': { model: 'squat', params: { isWallSit: true } },
  'agachamento-sumo': { model: 'squat', params: { isSumo: true } },
  'agachamento-pausa': { model: 'squat', params: {} },
  'agachamento-salto': { model: 'squat', params: { isJump: true } },
  'lunges': { model: 'lunge', params: {} },
  'afundo-reverso': { model: 'lunge', params: {} },
  'afundo-bulgaro': { model: 'bulgarian', params: {} },
  'cossack-squat': { model: 'squat', params: { isCossack: true } },
  'step-up-baixo': { model: 'bulgarian', params: {} },
  'step-up-alto': { model: 'bulgarian', params: {} },
  'panturrilha-dupla': { model: 'calf', params: { isStep: true } },
  'panturrilha-unilateral': { model: 'calf', params: { isStep: true } },
  'pistol-squat-assistido': { model: 'pistol', params: {} },
  'pistol-squat-caixa': { model: 'squat', params: { isBox: true } },
  'pistolsquat': { model: 'pistol', params: {} },
  'shrimp-squat': { model: 'lunge', params: {} },
  'ponte-gluteo-pes-elevados': { model: 'bridge', params: {} },
  'hip-thrust-unilateral-banco': { model: 'bridge', params: {} },
  'slider-leg-curl': { model: 'bridge', params: {} },
  'stiff-unilateral-peso-corpo': { model: 'standing_stretch', params: { type: 'hamstring' } },
  'extensao-quadril-quatro-apoios': { model: 'bird_dog', params: {} },
  'hidrante-quatro-apoios': { model: 'bird_dog', params: {} },
  'panturrilha-sentado-mochila': { model: 'calf', params: { isStep: false } },
  'panturrilha-degrau-pausa': { model: 'calf', params: { isStep: true } },
  'saltos-pogo': { model: 'calf', params: { isStep: false } },

  // === SKILLS (26) ===
  'lsit-solo-tuck': { model: 'lsit_skill', params: { type: 'tuck' } },
  'lsit-solo-uma-perna': { model: 'lsit_skill', params: { type: 'one-leg' } },
  'lsit': { model: 'lsit_skill', params: { type: 'full' } },
  'vsit': { model: 'lsit_skill', params: { type: 'vsit' } },
  'crow-pose': { model: 'arm_balance', params: { type: 'crow' } },
  'crane-pose': { model: 'arm_balance', params: { type: 'crane' } },
  'planche-lean': { model: 'planche_skill', params: { type: 'lean' } },
  'tuck-planche': { model: 'planche_skill', params: { type: 'tuck' } },
  'straddle-planche': { model: 'planche_skill', params: { type: 'straddle' } },
  'planche': { model: 'planche_skill', params: { type: 'full' } },
  'tuck-front-lever': { model: 'front_lever_skill', params: { type: 'tuck' } },
  'frontlever': { model: 'front_lever_skill', params: { type: 'full' } },
  'tuck-back-lever': { model: 'back_lever_skill', params: { type: 'tuck' } },
  'back-lever': { model: 'back_lever_skill', params: { type: 'full' } },
  'bandeira-humana-tuck': { model: 'human_flag', params: { type: 'tuck' } },
  'bandeira-humana': { model: 'human_flag', params: { type: 'full' } },
  'adv-tuck-planche': { model: 'planche_skill', params: { type: 'adv-tuck' } },
  'planche-uma-perna': { model: 'planche_skill', params: { type: 'adv-tuck' } },
  'adv-tuck-front-lever': { model: 'front_lever_skill', params: { type: 'adv-tuck' } },
  'front-lever-uma-perna': { model: 'front_lever_skill', params: { type: 'adv-tuck' } },
  'straddle-front-lever': { model: 'front_lever_skill', params: { type: 'full' } },
  'adv-tuck-back-lever': { model: 'back_lever_skill', params: { type: 'adv-tuck' } },
  'back-lever-uma-perna': { model: 'back_lever_skill', params: { type: 'adv-tuck' } },
  'skin-the-cat': { model: 'skin_the_cat', params: {} },
  'bandeira-humana-straddle': { model: 'human_flag', params: { type: 'full' } },
  'chute-parada-maos': { model: 'kick_up_handstand', params: {} },

  // === WARMUP MOBILITY (18) ===
  'circulos-punho': { model: 'standing_mobility', params: {} },
  'flexao-extensao-punho-chao': { model: 'child_pose', params: {} },
  'circulos-ombro': { model: 'standing_mobility', params: {} },
  'passagem-ombro-toalha': { model: 'standing_mobility', params: {} },
  'retracao-protracao-escapular': { model: 'push', params: { isScapular: true } },
  'gato-vaca': { model: 'cat_cow', params: {} },
  'rotacao-toracica': { model: 'cat_cow', params: {} },
  'greatest-stretch': { model: 'world_greatest_stretch', params: {} },
  'rotacao-quadril-9090': { model: 'seated_hip_mobility', params: {} },
  'agachamento-profundo-assistido': { model: 'deep_squat_hold', params: {} },
  'ativacao-gluteo-ponte': { model: 'bridge', params: {} },
  'dead-hang-passivo': { model: 'pull', params: { isDeadHang: true } },
  'wall-angels': { model: 'standing_mobility', params: {} },
  'elevacao-y-deitado': { model: 'superman', params: {} },
  'mobilidade-tornozelo-parede': { model: 'standing_stretch', params: { type: 'calf' } },
  'balanco-pernas-dinamico': { model: 'standing_mobility', params: {} },
  'rotacao-externa-ombro-toalha': { model: 'standing_mobility', params: {} },
  'aquecimento-cardio-leve': { model: 'squat', params: { isJump: true } },

  // === STRETCHES (12) ===
  'alongamento-peitoral-parede': { model: 'standing_stretch', params: { type: 'chest' } },
  'alongamento-dorsal-barra': { model: 'standing_stretch', params: { type: 'lat' } },
  'alongamento-triceps-acima': { model: 'standing_stretch', params: { type: 'triceps' } },
  'alongamento-ombro-posterior': { model: 'standing_stretch', params: { type: 'shoulder' } },
  'alongamento-flexores-quadril': { model: 'lunge', params: {} },
  'alongamento-quadriceps': { model: 'standing_stretch', params: { type: 'quad' } },
  'alongamento-isquiotibiais': { model: 'standing_stretch', params: { type: 'hamstring' } },
  'alongamento-panturrilha': { model: 'standing_stretch', params: { type: 'calf' } },
  'alongamento-gluteo-pombo': { model: 'child_pose', params: {} },
  'alongamento-borboleta': { model: 'seated_hip_mobility', params: {} },
  'alongamento-rotacao-coluna': { model: 'child_pose', params: {} },
  'postura-crianca': { model: 'child_pose', params: {} },
};

// Extrai modelos padrão de REFERENCE_POSES_DATA
const modelDefaults = {};
for (const k in REFERENCE_POSES_DATA) {
  const item = REFERENCE_POSES_DATA[k];
  if (!modelDefaults[item.model]) {
    modelDefaults[item.model] = {
      far: item.far,
      durationSeconds: item.durationSeconds,
      muscles: item.muscles,
    };
  }
}

console.log(`Modelos com defaults extraídos: ${Object.keys(modelDefaults).length}`);

// Constrói o novo arquivo TypeScript limpo
let output = `/**
 * Catálogo de Dados de Poses do Protótipo Aprovado (JSON estruturado em TypeScript)
 * Guarda âncoras, parâmetros e músculos como DADOS puros.
 * Mapeamento exaustivo e individual de todos os 208 exercícios do CalisteFlow.
 */

import type { MuscleTuple } from './referenceEngine';

export interface RawPoseDef {
  id: string;
  name: string;
  model:
    | 'pull'
    | 'push'
    | 'squat'
    | 'bridge'
    | 'row'
    | 'plank'
    | 'dip'
    | 'lunge'
    | 'deadbug'
    | 'pike'
    | 'handstand'
    | 'pistol'
    | 'bulgarian'
    | 'calf'
    | 'hollow'
    | 'crunch'
    | 'superman'
    | 'bird_dog'
    | 'side_plank'
    | 'hanging_core'
    | 'dragon_flag'
    | 'ab_wheel'
    | 'mountain_climber'
    | 'nordic_curl'
    | 'cat_cow'
    | 'standing_mobility'
    | 'deep_squat_hold'
    | 'world_greatest_stretch'
    | 'seated_hip_mobility'
    | 'child_pose'
    | 'standing_stretch'
    | 'lsit_skill'
    | 'arm_balance'
    | 'planche_skill'
    | 'front_lever_skill'
    | 'back_lever_skill'
    | 'skin_the_cat'
    | 'human_flag'
    | 'kick_up_handstand';
  params?: Record<string, any>;
  far: [number, number];
  durationSeconds: number;
  muscles: MuscleTuple[];
}

export const REFERENCE_POSES_DATA: Record<string, RawPoseDef> = {
`;

function formatMuscles(mus) {
  if (!mus || mus.length === 0) return '[]';
  const lines = mus.map(m => `      ${JSON.stringify(m).replace(/"/g, "'")},`);
  return `[\n${lines.join('\n')}\n    ]`;
}

// 1. Gera todos os 208 exercícios catalogados
for (const ex of catalog) {
  const spec = CUSTOM_SPECS[ex.id] || { model: 'push', params: {} };
  const model = spec.model;
  const def = modelDefaults[model] || modelDefaults.push;

  // Se o exercício já existia com músculos específicos, preserva-os
  const existing = REFERENCE_POSES_DATA[ex.id];
  const muscles = (existing && existing.muscles && existing.muscles.length > 0) ? existing.muscles : def.muscles;
  const far = (existing && existing.far) ? existing.far : def.far;
  const durationSeconds = (existing && existing.durationSeconds) ? existing.durationSeconds : def.durationSeconds;

  const paramsStr = JSON.stringify(spec.params || {}, null, 6)
    .replace(/"([^"]+)":/g, '$1:')
    .split('\n')
    .map((l, i) => (i === 0 ? l : '    ' + l))
    .join('\n');

  const safeName = ex.name.replace(/'/g, "\\'");

  output += `  '${ex.id}': {\n`;
  output += `    id: '${ex.id}',\n`;
  output += `    name: '${safeName}',\n`;
  output += `    model: '${model}',\n`;
  output += `    params: ${paramsStr},\n`;
  output += `    far: ${JSON.stringify(far)},\n`;
  output += `    durationSeconds: ${durationSeconds},\n`;
  output += `    muscles: ${formatMuscles(muscles)},\n`;
  output += `  },\n\n`;
}

// 2. Adiciona os aliases clássicos para retrocompatibilidade
const legacyAliases = [
  ['pullup', 'pullup', 'Barra fixa pronada', 'pull', {}],
  ['pushup', 'pushup', 'Flexão de braços tradicional', 'push', { benchHeight: 0 }],
  ['incline_pushup', 'incline_pushup', 'Flexão inclinada', 'push', { benchHeight: 45 }],
  ['decline_pushup', 'decline_pushup', 'Flexão declinada', 'push', { feetHeight: 35 }],
  ['knee_pushup', 'knee_pushup', 'Flexão com joelhos', 'push', { isKnee: true }],
  ['pseudo_planche_pushup', 'pseudo_planche_pushup', 'Flexão pseudo planche', 'push', { handsFarBack: true }],
  ['squats', 'squats', 'Agachamento livre', 'squat', {}],
  ['glute_bridge', 'glute_bridge', 'Ponte de glúteos', 'bridge', {}],
  ['australian_pullup', 'australian_pullup', 'Remada australiana', 'row', { isKnees: false }],
  ['dips', 'dips', 'Mergulho nas paralelas', 'dip', {}],
  ['deadbug', 'deadbug', 'Inseto morto (Dead bug)', 'deadbug', {}],
  ['side_plank', 'side_plank', 'Prancha lateral', 'side_plank', {}],
];

output += `  // === Aliases Legados para Retrocompatibilidade ===\n`;
for (const [key, id, name, model, params] of legacyAliases) {
  if (!catalog.some(c => c.id === key)) {
    const def = modelDefaults[model] || modelDefaults.push;
    const existing = REFERENCE_POSES_DATA[key];
    const muscles = (existing && existing.muscles && existing.muscles.length > 0) ? existing.muscles : def.muscles;
    const far = (existing && existing.far) ? existing.far : def.far;
    const durationSeconds = (existing && existing.durationSeconds) ? existing.durationSeconds : def.durationSeconds;
    const paramsStr = JSON.stringify(params, null, 6).replace(/"([^"]+)":/g, '$1:');

    output += `  '${key}': {\n`;
    output += `    id: '${id}',\n`;
    output += `    name: '${name}',\n`;
    output += `    model: '${model}',\n`;
    output += `    params: ${paramsStr},\n`;
    output += `    far: ${JSON.stringify(far)},\n`;
    output += `    durationSeconds: ${durationSeconds},\n`;
    output += `    muscles: ${formatMuscles(muscles)},\n`;
    output += `  },\n\n`;
  }
}

output += `};\n`;

const targetPath = path.join(__dirname, '../src/components/visuals/figure/referencePoseData.ts');
fs.writeFileSync(targetPath, output, 'utf8');
console.log(`\n✅ Sucesso! referencePoseData.ts atualizado com todos os 208 exercícios.`);
