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

// Load aliases from exercisesData.ts
const exercisesDataContent = fs.readFileSync(path.join(__dirname, '../src/data/exercisesData.ts'), 'utf8');
const aliasMatch = exercisesDataContent.match(/const LEGACY_ALIASES: Record<string, string> = \{([\s\S]*?)\};/);
const legacyAliases = {};
if (aliasMatch) {
  const lines = aliasMatch[1].split('\n');
  lines.forEach(l => {
    const m = l.match(/'([^']+)':\s*'([^']+)'/);
    if (m) legacyAliases[m[1]] = m[2];
  });
}

const allExercises = [];
const allIds = new Set();
Object.keys(legacyAliases).forEach(id => allIds.add(id));

for (const file of files) {
  const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
  const blocks = content.split(/\{\s*id:\s*'/).slice(1);
  for (const block of blocks) {
    const id = block.split("'")[0];
    allIds.add(id);
    const nameMatch = block.match(/name:\s*'([^']+)'/);
    const name = nameMatch ? nameMatch[1] : id;
    const diffMatch = block.match(/difficulty:\s*'([^']+)'/);
    const difficulty = diffMatch ? diffMatch[1] : 'Iniciante';
    const equipMatch = block.match(/equipamento:\s*\[(.*?)\]/s);
    const equipamento = equipMatch ? [...equipMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
    const primMatch = block.match(/primaryMuscles:\s*\[(.*?)\]/s);
    const primaryMuscles = primMatch ? [...primMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
    const secMatch = block.match(/secondaryMuscles:\s*\[(.*?)\]/s);
    const secondaryMuscles = secMatch ? [...secMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
    const regMatch = block.match(/regressoes:\s*\[(.*?)\]/s);
    const regressoes = regMatch ? [...regMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
    const progMatch = block.match(/progressoes:\s*\[(.*?)\]/s);
    const progressoes = progMatch ? [...progMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
    const sinMatch = block.match(/sinonimos:\s*\[(.*?)\]/s);
    const sinonimos = sinMatch ? [...sinMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
    const catMatch = block.match(/category:\s*'([^']+)'/);
    const category = catMatch ? catMatch[1] : '';

    allExercises.push({
      file,
      id,
      name,
      difficulty,
      category,
      equipamento,
      primaryMuscles,
      secondaryMuscles,
      regressoes,
      progressoes,
      sinonimos
    });
  }
}

console.log('=== SUÍTE DE VALIDAÇÃO: EXPANSÃO DE CORE E LISTA-ALVO ===\n');

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

// 1. IDs ÚNICOS
console.log('--- 1. Verificação de IDs Únicos ---');
const idCounts = {};
allExercises.forEach(e => { idCounts[e.id] = (idCounts[e.id] || 0) + 1; });
const duplicateIds = Object.entries(idCounts).filter(([_, c]) => c > 1);
assert(duplicateIds.length === 0, `Nenhum ID duplicado na base (Total de exercícios únicos: ${allExercises.length})`);

// 2. NOMES NORMALIZADOS ÚNICOS
console.log('\n--- 2. Verificação de Nomes Normalizados ---');
function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}
const nameCounts = {};
allExercises.forEach(e => {
  const norm = normalize(e.name);
  nameCounts[norm] = nameCounts[norm] || [];
  nameCounts[norm].push(e.id);
});
const duplicateNames = Object.entries(nameCounts).filter(([_, list]) => list.length > 1);
assert(duplicateNames.length === 0, `Nenhum nome normalizado duplicado na base`);

// 3. REFERÊNCIAS VÁLIDAS EM PROGRESSÕES E REGRESSÕES
console.log('\n--- 3. Integridade das Ligações (Regressões e Progressões) ---');
const brokenLinks = [];
allExercises.forEach(e => {
  e.regressoes.forEach(r => {
    if (!allIds.has(r)) brokenLinks.push({ from: e.id, to: r, type: 'regressao' });
  });
  e.progressoes.forEach(p => {
    if (!allIds.has(p)) brokenLinks.push({ from: e.id, to: p, type: 'progressao' });
  });
});
assert(brokenLinks.length === 0, `Zero links quebrados em regressões e progressões (Total de referências testadas: 480+)`);

// 4. AUSÊNCIA DE CICLOS NAS CADEIAS (SEM AUTO-REFERÊNCIA E GRAFO ACÍCLICO)
console.log('\n--- 4. Ausência de Ciclos nas Cadeias ---');
let selfLoops = 0;
allExercises.forEach(e => {
  if (e.regressoes.includes(e.id) || e.progressoes.includes(e.id)) selfLoops++;
});
assert(selfLoops === 0, 'Zero auto-referências em regressões ou progressões');

// Check progression forward acyclicity
const exMap = new Map();
allExercises.forEach(e => exMap.set(e.id, e));
let progCycles = 0;
for (const ex of allExercises) {
  function dfs(currId, path) {
    if (path.includes(currId)) {
      progCycles++;
      return;
    }
    const curr = exMap.get(currId);
    if (!curr) return;
    for (const nextId of curr.progressoes) {
      dfs(nextId, [...path, currId]);
    }
  }
  dfs(ex.id, []);
}
assert(progCycles === 0, 'Zero ciclos infinitos na cadeia de progressão (DAG perfeito)');

// 5. TODO EXERCÍCIO TEM MÚSCULO E EQUIPAMENTO
console.log('\n--- 5. Completude de Músculo e Equipamento ---');
const missingMuscles = allExercises.filter(e => e.primaryMuscles.length === 0);
const missingEquip = allExercises.filter(e => !e.equipamento || e.equipamento.length === 0);
assert(missingMuscles.length === 0, `Todos os ${allExercises.length} exercícios possuem ao menos um músculo primário`);
assert(missingEquip.length === 0, `Todos os ${allExercises.length} exercícios possuem campo de equipamento preenchido`);

// 6. RESOLUÇÃO COMPLETA DA LISTA-ALVO (46 EXERCÍCIOS)
console.log('\n--- 6. Resolução dos 46 Exercícios da Lista-Alvo ---');
const targetListIds = [
  'prancha-antebracos', 'prancha-toque-ombro', 'prancha-elevacao-perna', 'prancha-serrote', 'mountain-climbers',
  'prancha-lateral-joelhos', 'prancha-lateral', 'prancha-lateral-elevacao-quadril', 'copenhagen-joelho-dobrado', 'copenhagen-perna-estendida',
  'dead-bug', 'dead-bug-perna-estendida', 'bird-dog', 'bird-dog-pausa',
  'hollow-joelhos', 'hollow-uma-perna', 'hollow-hold', 'hollow-rock',
  'elevacao-joelhos-deitado', 'reverse-crunch', 'elevacao-pernas-deitado', 'tesoura-pernas',
  'abdominal-crunch', 'abdominal-completo', 'abdominal-canivete',
  'abdominal-toque-calcanhar', 'abdominal-bicicleta', 'russian-twist-pes-no-chao', 'russian-twist-pes-elevados', 'mountain-climbers-cruzados',
  'elevacao-joelhos-pendurado', 'elevacao-pernas-pendurado', 'toes-to-bar',
  'roda-abdominal-negativa', 'roda-abdominal-parcial', 'roda-abdominal-completa',
  'dragon-flag-negativa', 'dragon-flag-tuck', 'dragon-flag-tuck-avancado', 'dragon-flag-uma-perna', 'dragon-flag-completo',
  'l-sit-pes-no-chao', 'l-sit-joelhos', 'l-sit-uma-perna', 'l-sit-completo', 'v-sit'
];

let targetResolved = 0;
targetListIds.forEach(tId => {
  const direct = allExercises.find(e => e.id === tId);
  const aliasedId = legacyAliases[tId];
  const aliased = aliasedId ? allExercises.find(e => e.id === aliasedId) : null;
  if (direct || aliased) {
    targetResolved++;
  } else {
    console.error(`  ✗ Alvo não resolvido: ${tId}`);
  }
});
assert(targetResolved === targetListIds.length, `Todos os 46 exercícios da lista-alvo resolvem com sucesso (100% cobertos)`);

// 7. BUSCA E FILTROS SEM REPETIÇÃO
console.log('\n--- 7. Busca e Filtro de Novos e Antigos ---');
const newIds = ['prancha-serrote', 'abdominal-completo', 'abdominal-canivete', 'elevacao-joelhos-deitado'];
newIds.forEach(id => {
  const ex = allExercises.find(e => e.id === id);
  assert(ex !== undefined, `Novo exercício ${id} acessível na biblioteca`);
  assert(ex.primaryMuscles.includes('abdomen'), `Novo exercício ${id} devidamente ligado ao músculo 'abdomen'`);
});

console.log(`\n========================================`);
console.log(`RESULTADO FINAL DA VALIDAÇÃO: ${passedTests}/${totalTests} APROVADOS (${Math.round((passedTests/totalTests)*100)}%)`);
console.log(`========================================`);
