const fs = require('fs');
const path = require('path');

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

const EXERCISES_DATABASE = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
  const blocks = content.split(/\{\s*id:\s*'/).slice(1);
  for (const block of blocks) {
    const id = block.split("'")[0];
    const nameMatch = block.match(/name:\s*'([^']+)'/);
    const name = nameMatch ? nameMatch[1] : id;
    const diffMatch = block.match(/difficulty:\s*'([^']+)'/);
    const difficulty = diffMatch ? diffMatch[1] : 'Iniciante';
    const primMatch = block.match(/primaryMuscles:\s*\[(.*?)\]/s);
    const primaryMuscles = primMatch ? [...primMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
    const secMatch = block.match(/secondaryMuscles:\s*\[(.*?)\]/s);
    const secondaryMuscles = secMatch ? [...secMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
    const padraoMatch = block.match(/padrao:\s*'([^']+)'/);
    const padrao = padraoMatch ? padraoMatch[1] : '';
    const regMatch = block.match(/regressoes:\s*\[(.*?)\]/s);
    const regressoes = regMatch ? [...regMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
    const progMatch = block.match(/progressoes:\s*\[(.*?)\]/s);
    const progressoes = progMatch ? [...progMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];

    EXERCISES_DATABASE.push({
      id,
      name,
      difficulty,
      padrao,
      primaryMuscles,
      secondaryMuscles,
      regressoes,
      progressoes
    });
  }
}

const allMuscles = [
  'peito', 'costas', 'ombros', 'triceps', 'biceps', 'abdomen',
  'lombar', 'quadriceps', 'posteriores', 'gluteos', 'panturrilhas', 'antebraco'
];

const DIFFICULTY_ORDER = {
  'Iniciante': 1,
  'Intermediário': 2,
  'Avançado': 3,
  'Elite': 4
};

function sortExerciseGroup(list, muscles, isPrimaryGroup) {
  return [...list].sort((a, b) => {
    if (muscles.length > 1) {
      const aMatches = muscles.filter(m => (isPrimaryGroup ? a.primaryMuscles : a.secondaryMuscles).includes(m)).length;
      const bMatches = muscles.filter(m => (isPrimaryGroup ? b.primaryMuscles : b.secondaryMuscles).includes(m)).length;
      if (bMatches !== aMatches) return bMatches - aMatches;
    }

    const diffA = DIFFICULTY_ORDER[a.difficulty] || 99;
    const diffB = DIFFICULTY_ORDER[b.difficulty] || 99;
    if (diffA !== diffB) return diffA - diffB;

    if (b.regressoes && b.regressoes.includes(a.id)) return -1;
    if (a.regressoes && a.regressoes.includes(b.id)) return 1;
    if (a.progressoes && a.progressoes.includes(b.id)) return -1;
    if (b.progressoes && b.progressoes.includes(a.id)) return 1;

    const regA = a.regressoes ? a.regressoes.length : 0;
    const regB = b.regressoes ? b.regressoes.length : 0;
    if (regA !== regB) return regA - regB;

    return a.name.localeCompare(b.name, 'pt-BR');
  });
}

function partitionExercises(exercises, selectedMuscles, selectedPattern = 'Todos') {
  if (!selectedMuscles || selectedMuscles.length === 0) {
    return {
      primary: exercises,
      secondary: [],
      hiddenByPattern: 0
    };
  }

  const rawPrimary = [];
  const rawSecondary = [];

  exercises.forEach(ex => {
    if (selectedPattern !== 'Todos' && ex.padrao !== selectedPattern) {
      return;
    }
    const isPrim = selectedMuscles.some(m => ex.primaryMuscles.includes(m));
    const isSec = selectedMuscles.some(m => ex.secondaryMuscles.includes(m));

    if (isPrim) {
      rawPrimary.push(ex);
    } else if (isSec) {
      rawSecondary.push(ex);
    }
  });

  const primary = sortExerciseGroup(rawPrimary, selectedMuscles, true);
  const secondary = sortExerciseGroup(rawSecondary, selectedMuscles, false);

  let hiddenByPattern = 0;
  if (selectedPattern !== 'Todos') {
    hiddenByPattern = exercises.filter(ex => {
      const matchesMuscle = selectedMuscles.some(m => ex.primaryMuscles.includes(m) || ex.secondaryMuscles.includes(m));
      return matchesMuscle && ex.padrao !== selectedPattern;
    }).length;
  }

  return { primary, secondary, hiddenByPattern };
}

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FALHA: ${message}`);
    process.exitCode = 1;
  }
}

console.log('=== SUÍTE DE TESTES AUTOMATIZADOS: FILTRO E ORDENAÇÃO MUSCULAR ===\n');

// -------------------------------------------------------------
// TESTE 1: TODAS AS 12 REGIÕES ANATÔMICAS (FRONTAL E POSTERIOR)
// -------------------------------------------------------------
console.log('--- TESTE 1: Testando cada uma das 12 regiões anatômicas do mapa ---');

allMuscles.forEach(muscle => {
  const { primary, secondary } = partitionExercises(EXERCISES_DATABASE, [muscle]);

  // A. Não pode haver mistura entre grupos
  const primHasSecOnly = primary.some(e => !e.primaryMuscles.includes(muscle));
  assert(!primHasSecOnly, `[${muscle}] Grupo 1 contém APENAS exercícios onde ${muscle} é primário (Total: ${primary.length})`);

  const secHasPrim = secondary.some(e => e.primaryMuscles.includes(muscle));
  assert(!secHasPrim, `[${muscle}] Grupo 2 NÃO contém nenhum exercício onde ${muscle} é primário (Total: ${secondary.length})`);

  // B. Interseção vazia entre Grupo 1 e Grupo 2
  const primaryIdSet = new Set(primary.map(e => e.id));
  const hasOverlap = secondary.some(e => primaryIdSet.has(e.id));
  assert(!hasOverlap, `[${muscle}] Interseção vazia garantida entre Grupo 1 e Grupo 2 (zero duplicações)`);

  // C. Ordenação de dificuldade dentro de cada grupo
  let diffOrderOk = true;
  for (let i = 0; i < primary.length - 1; i++) {
    const diff1 = DIFFICULTY_ORDER[primary[i].difficulty];
    const diff2 = DIFFICULTY_ORDER[primary[i + 1].difficulty];
    if (diff1 > diff2) {
      diffOrderOk = false;
      break;
    }
  }
  assert(diffOrderOk, `[${muscle}] Grupo 1 está ordenado crescentemente por dificuldade (Iniciante -> Elite)`);
});

// -------------------------------------------------------------
// TESTE 2: REGRA DE PRIORIDADE ALVO > SECUNDÁRIO
// -------------------------------------------------------------
console.log('\n--- TESTE 2: Regra de Prioridade Alvo > Secundário ---');
const simulatedExercise = {
  id: 'simulado-duplo',
  name: 'Exercício Simulado Duplo',
  difficulty: 'Iniciante',
  primaryMuscles: ['peito'],
  secondaryMuscles: ['peito', 'triceps'],
  regressoes: [],
  progressoes: []
};
const customList = [...EXERCISES_DATABASE, simulatedExercise];
const { primary: simPrim, secondary: simSec } = partitionExercises(customList, ['peito']);
assert(simPrim.some(e => e.id === 'simulado-duplo'), 'Exercício com músculo nos dois campos é classificado em Grupo 1 (Alvo)');
assert(!simSec.some(e => e.id === 'simulado-duplo'), 'Exercício não se repete no Grupo 2');

// -------------------------------------------------------------
// TESTE 3: SELEÇÃO DE MÚLTIPLOS MÚSCULOS
// -------------------------------------------------------------
console.log('\n--- TESTE 3: Seleção de Múltiplos Músculos ---');
const multiSelection = ['peito', 'triceps'];
const { primary: multiPrim, secondary: multiSec } = partitionExercises(EXERCISES_DATABASE, multiSelection);

const bothPrimary = multiPrim.filter(e => e.primaryMuscles.includes('peito') && e.primaryMuscles.includes('triceps'));
const firstItemHasBoth = multiPrim.length > 0 && bothPrimary.length > 0 ? (multiPrim[0].primaryMuscles.includes('peito') && multiPrim[0].primaryMuscles.includes('triceps')) : true;
assert(firstItemHasBoth, `Exercícios que atendem ambos os músculos selecionados têm prioridade de ordenação (Total com ambos: ${bothPrimary.length})`);
assert(multiPrim.length > 0 && multiSec.length > 0, `Multi-seleção [peito, triceps] particiona corretamente (${multiPrim.length} alvo • ${multiSec.length} secundários)`);

// -------------------------------------------------------------
// TESTE 4: INTERAÇÃO COM FILTRO DE PADRÃO E EXERCÍCIOS OCULTOS
// -------------------------------------------------------------
console.log('\n--- TESTE 4: Interação com Filtro de Padrão e Exercícios Ocultos ---');
const { primary: patPrim, secondary: patSec, hiddenByPattern } = partitionExercises(EXERCISES_DATABASE, ['abdomen'], 'empurrar-horizontal');
assert(hiddenByPattern === 101, `Contagem exata de exercícios ocultos: ${hiddenByPattern} exercícios de abdômen estão fora de empurrar-horizontal`);
assert(patPrim.length === 2, `2 exercícios com abdômen primário em empurrar-horizontal (flexao-escapular, flexao-unilateral)`);
assert(patSec.length === 11, `11 flexões com abdômen secundário exibidas corretamente no Grupo 2`);
assert(patPrim.length + patSec.length === 13, `Total de 13 exercícios em empurrar-horizontal que recrutam abdômen`);

// -------------------------------------------------------------
// TESTE 5: CASOS DE BORDA (GRUPOS VAZIOS / COMBINAÇÕES RESTRITAS)
// -------------------------------------------------------------
console.log('\n--- TESTE 5: Casos de Borda ---');
const { primary: bPrim, secondary: bSec } = partitionExercises(EXERCISES_DATABASE, ['panturrilhas'], 'core-anterior');
assert(bPrim.length === 0 && bSec.length === 0, 'Retorna grupos vazios de forma segura quando a combinação é inexistente (sem exceptions)');

const { primary: noMusclePrim, secondary: noMuscleSec } = partitionExercises(EXERCISES_DATABASE, []);
assert(noMusclePrim.length === EXERCISES_DATABASE.length, `Sem seleção muscular retorna todos os ${EXERCISES_DATABASE.length} exercícios na lista padrão`);
assert(noMuscleSec.length === 0, 'Sem seleção muscular Grupo 2 é vazio');

console.log(`\n========================================`);
console.log(`RESULTADO FINAL DOS TESTES: ${passedTests}/${totalTests} APROVADOS (${Math.round((passedTests/totalTests)*100)}%)`);
console.log(`========================================`);
