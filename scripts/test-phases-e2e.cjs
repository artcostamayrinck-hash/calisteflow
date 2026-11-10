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

let allExercises = [];
const seenIds = new Set();
const seenNames = new Set();
let duplicates = [];
let invalidPhases = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(dataDir, f), 'utf8');
  const blocks = content.split(/\{\s*id:\s*'/).slice(1);

  for (const block of blocks) {
    const id = block.split("'")[0];
    const nameMatch = block.match(/name:\s*'([^']+)'/);
    const name = nameMatch ? nameMatch[1] : id;
    const faseMatch = block.match(/fase:\s*'([^']+)'/);
    const fase = faseMatch ? faseMatch[1] : null;
    const secMatch = block.match(/fasesSecundarias:\s*\[(.*?)\]/s);
    const sec = secMatch ? [...secMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];

    if (seenIds.has(id)) duplicates.push(`ID duplicado: ${id}`);
    seenIds.add(id);

    const normName = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    if (seenNames.has(normName)) duplicates.push(`Nome duplicado: ${name}`);
    seenNames.add(normName);

    if (!fase || !['aquecimento', 'treino', 'alongamento'].includes(fase)) {
      invalidPhases.push(`[${id}] Fase inválida ou ausente: ${fase}`);
    }

    sec.forEach(s => {
      if (!['aquecimento', 'treino', 'alongamento'].includes(s)) {
        invalidPhases.push(`[${id}] Fase secundária inválida: ${s}`);
      }
    });

    allExercises.push({ id, name, fase, sec, file: f });
  }
});

console.log('=== TESTE DE INTEGRIDADE DAS FASES ===');
console.log(`Total de exercícios catalogados: ${allExercises.length}`);

const aqCount = allExercises.filter(e => e.fase === 'aquecimento').length;
const trCount = allExercises.filter(e => e.fase === 'treino').length;
const alCount = allExercises.filter(e => e.fase === 'alongamento').length;

console.log(`- Aquecimento (primário): ${aqCount}`);
console.log(`- Treino (primário): ${trCount}`);
console.log(`- Alongamento (primário): ${alCount}`);
console.log(`- Soma das fases: ${aqCount + trCount + alCount} (deve ser 208)`);

const aqTotalAccess = allExercises.filter(e => e.fase === 'aquecimento' || e.sec.includes('aquecimento')).length;
const trTotalAccess = allExercises.filter(e => e.fase === 'treino' || e.sec.includes('treino')).length;
const alTotalAccess = allExercises.filter(e => e.fase === 'alongamento' || e.sec.includes('alongamento')).length;

console.log(`\nExercícios acessíveis por aba na biblioteca (primários + secundários):`);
console.log(`- Aba Aquecimento: ${aqTotalAccess} exercícios`);
console.log(`- Aba Treino: ${trTotalAccess} exercícios`);
console.log(`- Aba Alongamento: ${alTotalAccess} exercícios`);

let hasError = false;
if (duplicates.length > 0) {
  console.error('\n❌ Duplicatas encontradas:', duplicates);
  hasError = true;
}
if (invalidPhases.length > 0) {
  console.error('\n❌ Erros de fase:', invalidPhases);
  hasError = true;
}
if (allExercises.length !== 208) {
  console.error(`\n❌ Contagem inesperada: esperado 208, obtido ${allExercises.length}`);
  hasError = true;
}

if (!hasError) {
  console.log('\n✅ TODOS OS TESTES DE VALIDAÇÃO DE FASES FORAM APROVADOS COM SUCESSO (100%)!');
} else {
  process.exit(1);
}

