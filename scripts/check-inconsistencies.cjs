const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data/exercises');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts') && f !== 'reviewer.ts');

const all = [];
files.forEach(f => {
  const content = fs.readFileSync(path.join(dataDir, f), 'utf8');
  const blocks = content.split(/\{\s*id:\s*'/).slice(1);
  blocks.forEach(b => {
    const id = b.split("'")[0];
    const nameMatch = b.match(/name:\s*'([^']+)'/);
    const name = nameMatch ? nameMatch[1] : id;
    const primMatch = b.match(/primaryMuscles:\s*\[(.*?)\]/s);
    const prim = primMatch ? [...primMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
    const secMatch = b.match(/secondaryMuscles:\s*\[(.*?)\]/s);
    const sec = secMatch ? [...secMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
    const regMatch = b.match(/regressoes:\s*\[(.*?)\]/s);
    const reg = regMatch ? [...regMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
    const progMatch = b.match(/progressoes:\s*\[(.*?)\]/s);
    const prog = progMatch ? [...progMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
    const variMatch = b.match(/variacoes:\s*\[(.*?)\]/s);
    const vari = variMatch ? [...variMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
    
    // Extrair apenas os valores de adaptacoes (os arrays de IDs dentro de cada chave)
    const adaptMatch = b.match(/adaptacoes:\s*\{([\s\S]*?)\n\s*\}/);
    const adaptValues = [];
    if (adaptMatch) {
      const inner = adaptMatch[1];
      const lines = inner.split('\n');
      for (const line of lines) {
        const colonIdx = line.indexOf(':');
        if (colonIdx > -1) {
          const valPart = line.slice(colonIdx + 1);
          const ids = [...valPart.matchAll(/'([^']+)'/g)].map(m => m[1]);
          adaptValues.push(...ids);
        }
      }
    }

    all.push({ id, name, file: f, prim, sec, reg, prog, vari, adapt: adaptValues });
  });
});

console.log('Total de exercícios catalogados:', all.length);

const idSet = new Set(all.map(e => e.id));
['diamond_pushup','dips','pike_pushup','australian_pullup','handstand_hold','hollow_body','front_lever','pistol_squat'].forEach(a => idSet.add(a));

// 1. Checar IDs duplicados
const idOccurrences = new Map();
all.forEach(e => {
  idOccurrences.set(e.id, (idOccurrences.get(e.id) || 0) + 1);
});
const duplicateIds = [...idOccurrences.entries()].filter(([_, count]) => count > 1);
console.log('IDs duplicados:', duplicateIds.length > 0 ? duplicateIds : 'Nenhum (0)');

// 2. Checar Nomes duplicados normalizados
const nameMap = new Map();
const duplicateNames = [];
all.forEach(e => {
  const norm = e.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  if (nameMap.has(norm)) {
    duplicateNames.push({ original: e.name, existing: nameMap.get(norm).name, id1: e.id, id2: nameMap.get(norm).id });
  } else {
    nameMap.set(norm, e);
  }
});
console.log('Nomes normalizados duplicados:', duplicateNames.length > 0 ? duplicateNames : 'Nenhum (0)');

// 3. Checar exercícios sem músculos
const missingMuscles = all.filter(e => e.prim.length === 0);
console.log('Exercícios sem músculos primários:', missingMuscles.length > 0 ? missingMuscles.map(e => e.id) : 'Nenhum (0)');

// 4. Checar referências quebradas reais
const broken = [];
all.forEach(e => {
  e.reg.forEach(ref => { if (!idSet.has(ref)) broken.push({ from: e.id, field: 'regressoes', to: ref }); });
  e.prog.forEach(ref => { if (!idSet.has(ref)) broken.push({ from: e.id, field: 'progressoes', to: ref }); });
  e.vari.forEach(ref => { if (!idSet.has(ref)) broken.push({ from: e.id, field: 'variacoes', to: ref }); });
  e.adapt.forEach(ref => { if (!idSet.has(ref)) broken.push({ from: e.id, field: 'adaptacoes', to: ref }); });
});
console.log('Referências quebradas reais:', broken.length > 0 ? broken : 'Nenhuma (0)');
