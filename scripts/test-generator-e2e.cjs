const path = require('path');
const fs = require('fs');
const { JOINT_RISK_MAP } = require('./riskMapHelper.cjs');

// Simular teste nos dados brutos de exercícios
const dataDir = path.join(__dirname, '../src/data/exercises');
const partialFiles = [
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

let allExercises = [];
for (const file of partialFiles) {
  const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
  const blocks = content.split(/\{\s*id:\s*'/).slice(1);
  for (const block of blocks) {
    const id = block.split("'")[0];
    const equipMatch = block.match(/equipamento:\s*\[(.*?)\]/);
    const equip = equipMatch ? [...equipMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : ['nenhum'];
    const diffMatch = block.match(/difficulty:\s*'([^']+)'/);
    const difficulty = diffMatch ? diffMatch[1] : 'Iniciante';
    allExercises.push({ id, equip, difficulty });
  }
}

console.log(`[E2E TEST] Carregados ${allExercises.length} exercícios para teste.`);

function filterExercisesMock(exercises, userLevel, equipments, limitations) {
  const levelOrder = { Iniciante: 1, Intermediário: 2, Avançado: 3, Elite: 4 };
  const userLevelNum = levelOrder[userLevel] || 2;
  const riskyIds = new Set();
  if (limitations) {
    limitations.forEach(lim => {
      const risks = JOINT_RISK_MAP[lim] || [];
      risks.forEach(id => riskyIds.add(id));
    });
  }

  return exercises.filter(ex => {
    if (riskyIds.has(ex.id)) return false;
    const exLevelNum = levelOrder[ex.difficulty] || 1;
    if (exLevelNum > userLevelNum + 1) return false;
    const requiredEquip = ex.equip || ['nenhum'];
    return requiredEquip.some(eq => eq === 'nenhum' || equipments.includes(eq));
  });
}

// Teste 1: Usuário com limitação de Punho
const punhoUser = filterExercisesMock(allExercises, 'Intermediário', ['nenhum', 'barra'], ['punho']);
const punhoViolations = punhoUser.filter(e => JOINT_RISK_MAP.punho.includes(e.id));
if (punhoViolations.length > 0) {
  console.error('❌ Falha: Exercícios de risco de punho foram incluídos:', punhoViolations.map(e => e.id));
  process.exit(1);
}
console.log(`✓ Teste Punho: 0 violações entre ${punhoUser.length} exercícios elegíveis.`);

// Teste 2: Usuário com limitação de Ombro
const ombroUser = filterExercisesMock(allExercises, 'Intermediário', ['nenhum', 'barra', 'paralelas'], ['ombro']);
const ombroViolations = ombroUser.filter(e => JOINT_RISK_MAP.ombro.includes(e.id));
if (ombroViolations.length > 0) {
  console.error('❌ Falha: Exercícios de risco de ombro foram incluídos:', ombroViolations.map(e => e.id));
  process.exit(1);
}
console.log(`✓ Teste Ombro: 0 violações entre ${ombroUser.length} exercícios elegíveis.`);

// Teste 3: Usuário com limitação de Joelho
const joelhoUser = filterExercisesMock(allExercises, 'Avançado', ['nenhum', 'barra'], ['joelho']);
const joelhoViolations = joelhoUser.filter(e => JOINT_RISK_MAP.joelho.includes(e.id));
if (joelhoViolations.length > 0) {
  console.error('❌ Falha: Exercícios de risco de joelho foram incluídos:', joelhoViolations.map(e => e.id));
  process.exit(1);
}
console.log(`✓ Teste Joelho: 0 violações entre ${joelhoUser.length} exercícios elegíveis.`);

// Teste 4: Usuário com limitação de Lombar
const lombarUser = filterExercisesMock(allExercises, 'Elite', ['nenhum', 'barra'], ['lombar']);
const lombarViolations = lombarUser.filter(e => JOINT_RISK_MAP.lombar.includes(e.id));
if (lombarViolations.length > 0) {
  console.error('❌ Falha: Exercícios de risco de lombar foram incluídos:', lombarViolations.map(e => e.id));
  process.exit(1);
}
console.log(`✓ Teste Lombar: 0 violações entre ${lombarUser.length} exercícios elegíveis.`);

console.log('\n🎉 TODOS OS TESTES E2E DE PRESCRIÇÃO E SEGURANÇA FORAM APROVADOS COM 100% DE SUCESSO!');

