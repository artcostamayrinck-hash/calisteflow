const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data/exercises');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts') && f !== 'reviewer.ts');

const allExercises = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
  // Match each exercise object block
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

    const adaptMatch = block.match(/adaptacoes:\s*\{([\s\S]*?)\}/);
    const hasAdaptacoes = Boolean(adaptMatch && adaptMatch[1].trim().length > 0);

    const sinonimosMatch = block.match(/sinonimos:\s*\[(.*?)\]/s);
    const sinonimos = sinonimosMatch ? [...sinonimosMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];

    allExercises.push({
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
      hasAdaptacoes,
      sinonimos,
      rawBlock: '{ id: \'' + block
    });
  }
}

console.log('Total de exercícios carregados:', allExercises.length);

// Filtrar exercícios que trabalham abdômen / core (primário ou secundário) ou têm categoria Core
const coreExercises = allExercises.filter(ex => 
  ex.primaryMuscles.includes('abdomen') ||
  ex.secondaryMuscles.includes('abdomen') ||
  ex.primaryMuscles.includes('lombar') ||
  ex.secondaryMuscles.includes('lombar') ||
  ex.category === 'Core' ||
  (ex.padrao && ex.padrao.startsWith('core'))
);

console.log('Exercícios de Core/Abdômen encontrados:', coreExercises.length);

// Salvar inventário em JSON para análise
fs.writeFileSync(path.join(__dirname, 'core-inventory.json'), JSON.stringify(coreExercises, null, 2));

// Imprimir tabela formatada
console.log('\n--- TABELA DE EXERCÍCIOS DE CORE/ABDÔMEN ATUAIS ---');
console.log('| ID | Nome | Nível | Equipamento | Primários | Secundários | Regressão? | Progressão? | Adaptação? |');
console.log('|---|---|---|---|---|---|:---:|:---:|:---:|');
for (const ex of coreExercises) {
  const equip = ex.equipamento.join(', ') || 'nenhum';
  const hasReg = ex.regressoes.length > 0 ? `Sim (${ex.regressoes.length})` : 'Não';
  const hasProg = ex.progressoes.length > 0 ? `Sim (${ex.progressoes.length})` : 'Não';
  const hasAdapt = ex.hasAdaptacoes ? 'Sim' : 'Não';
  console.log(`| \`${ex.id}\` | ${ex.name} | ${ex.difficulty} | ${equip} | ${ex.primaryMuscles.join(', ')} | ${ex.secondaryMuscles.join(', ')} | ${hasReg} | ${hasProg} | ${hasAdapt} |`);
}

