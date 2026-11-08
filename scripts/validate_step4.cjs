const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data/exercises');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts') && f !== 'reviewer.ts');

const exercises = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
  const blocks = content.split(/\{\s*id:\s*'/).slice(1);

  for (const block of blocks) {
    const id = block.split("'")[0];
    const nameMatch = block.match(/name:\s*'([^']+)'/);
    const name = nameMatch ? nameMatch[1] : id;

    const catMatch = block.match(/category:\s*'([^']+)'/);
    const category = catMatch ? catMatch[1] : '';

    const diffMatch = block.match(/difficulty:\s*'([^']+)'/);
    const difficulty = diffMatch ? diffMatch[1] : '';

    const typeMatch = block.match(/type:\s*'([^']+)'/);
    const type = typeMatch ? typeMatch[1] : '';

    const padraoMatch = block.match(/padrao:\s*'([^']+)'/);
    const padrao = padraoMatch ? padraoMatch[1] : '';

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

    const varMatch = block.match(/variacoes:\s*\[(.*?)\]/s);
    const variacoes = varMatch ? [...varMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];

    const sinonimosMatch = block.match(/sinonimos:\s*\[(.*?)\]/s);
    const sinonimos = sinonimosMatch ? [...sinonimosMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];

    exercises.push({
      file,
      id,
      name,
      category,
      difficulty,
      type,
      padrao,
      equipamento,
      primaryMuscles,
      secondaryMuscles,
      regressoes,
      progressoes,
      variacoes,
      sinonimos
    });
  }
}

console.log('--- TESTE 1: AUDITORIA DE IDS E NOMES ---');
const idMap = new Map();
let dupIds = 0;
exercises.forEach(e => {
  if (idMap.has(e.id)) {
    console.error('ERRO: ID Duplicado:', e.id);
    dupIds++;
  }
  idMap.set(e.id, e);
});
console.log('Total de IDs Únicos:', exercises.length, '| Duplicações de ID:', dupIds);

const normNameMap = new Map();
let dupNames = 0;
exercises.forEach(e => {
  const norm = e.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  if (normNameMap.has(norm)) {
    console.error('ERRO: Nome normalizado duplicado:', e.name, 'vs', normNameMap.get(norm).name);
    dupNames++;
  }
  normNameMap.set(norm, e);
});
console.log('Duplicações de Nomes Normalizados:', dupNames);

console.log('\n--- TESTE 2: MÚSCULOS E EQUIPAMENTO ---');
let missingMuscle = 0;
let missingEquip = 0;
exercises.forEach(e => {
  if (!e.primaryMuscles || e.primaryMuscles.length === 0) {
    console.error('ERRO: Exercício sem músculo primário:', e.id);
    missingMuscle++;
  }
  if (!e.equipamento || e.equipamento.length === 0) {
    console.error('ERRO: Exercício sem equipamento:', e.id);
    missingEquip++;
  }
});
console.log('Exercícios sem músculo primário:', missingMuscle);
console.log('Exercícios sem equipamento:', missingEquip);

console.log('\n--- TESTE 3: INTEGRIDADE DE PROGRESSÕES E REGRESSÕES ---');
const legacyAliases = ['diamond_pushup','dips','pike_pushup','australian_pullup','handstand_hold','hollow_body','front_lever','pistol_squat'];
legacyAliases.forEach(a => idMap.set(a, { id: a }));

let brokenLinks = 0;
exercises.forEach(e => {
  e.progressoes.forEach(p => {
    if (!idMap.has(p)) {
      console.error(`ERRO: [${e.id}] progressão aponta para ID inexistente [${p}]`);
      brokenLinks++;
    }
  });
  e.regressoes.forEach(r => {
    if (!idMap.has(r)) {
      console.error(`ERRO: [${e.id}] regressão aponta para ID inexistente [${r}]`);
      brokenLinks++;
    }
  });
});
console.log('Total de referências quebradas em progressão/regressão:', brokenLinks);

console.log('\n--- TESTE 4: DETECÇÃO DE CICLOS NAS CADEIAS ---');
let selfCycles = 0;
let directCycles = 0;
exercises.forEach(e => {
  if (e.progressoes.includes(e.id) || e.regressoes.includes(e.id)) {
    console.error(`ERRO: Auto-ciclo detectado em [${e.id}]`);
    selfCycles++;
  }
  e.progressoes.forEach(pId => {
    const target = idMap.get(pId);
    if (target && target.progressoes && target.progressoes.includes(e.id)) {
      console.error(`ERRO: Ciclo mútuo de progressão entre [${e.id}] e [${pId}]`);
      directCycles++;
    }
  });
});
console.log('Auto-ciclos:', selfCycles, '| Ciclos diretos em progressões:', directCycles);

console.log('\n--- TESTE 5: SIMULAÇÃO DE BUSCA E FILTROS DO APP ---');
// Filtro por músculo 'abdomen'
const coreFiltered = exercises.filter(e => 
  (e.primaryMuscles && e.primaryMuscles.includes('abdomen')) ||
  (e.secondaryMuscles && e.secondaryMuscles.includes('abdomen'))
);
const coreIds = new Set(coreFiltered.map(e => e.id));
console.log('Filtro Abdômen: Total retornado =', coreFiltered.length, '| IDs únicos =', coreIds.size, '(Sem repetição)');

// Filtro por músculo 'lombar'
const lombarFiltered = exercises.filter(e => 
  (e.primaryMuscles && e.primaryMuscles.includes('lombar')) ||
  (e.secondaryMuscles && e.secondaryMuscles.includes('lombar'))
);
const lombarIds = new Set(lombarFiltered.map(e => e.id));
console.log('Filtro Lombar: Total retornado =', lombarFiltered.length, '| IDs únicos =', lombarIds.size, '(Sem repetição)');

// Teste de Busca Textual por sinônimos e nomes
const searchTerms = ['prancha', 'hollow', 'dragon flag', 'abdominal', 'crunch', 'russian twist', 'climber'];
searchTerms.forEach(term => {
  const normTerm = term.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const matches = exercises.filter(e => {
    const nameMatch = e.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normTerm);
    const synMatch = e.sinonimos.some(s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normTerm));
    return nameMatch || synMatch;
  });
  const uniqueMatches = new Set(matches.map(m => m.id));
  console.log(`Busca "${term}": ${matches.length} itens encontrados (${uniqueMatches.size} únicos)`);
});
