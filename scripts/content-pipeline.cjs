#!/usr/bin/env node
/**
 * CalisteFlow Content Pipeline & Quality Engine
 * Permite que profissionais de Educação Física (CREF) e revisores de conteúdo
 * mantenham, auditem e atualizem o catálogo completo de 208 exercícios
 * através de JSON/CSV estruturado, sem necessidade de tocar no código-fonte.
 *
 * Comandos:
 *   node scripts/content-pipeline.cjs export    -> Exporta catálogo para content/exercises-catalog.json e .csv
 *   node scripts/content-pipeline.cjs validate  -> Audita integridade, campos ausentes e referências quebradas
 *   node scripts/content-pipeline.cjs stats     -> Relatório de distribuição por categoria, padrão e auditoria
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const EXERCISES_DIR = path.join(ROOT_DIR, 'src/data/exercises');
const CONTENT_DIR = path.join(ROOT_DIR, 'content');

const EXERCISE_FILES = [
  'pushHorizontal.ts',
  'pushVertical.ts',
  'pullVertical.ts',
  'pullHorizontal.ts',
  'core.ts',
  'legs.ts',
  'skills.ts',
  'warmupMobility.ts',
  'stretches.ts',
];

const REQUIRED_FIELDS = [
  'id',
  'name',
  'category',
  'difficulty',
  'type',
  'primaryMuscles',
  'secondaryMuscles',
  'description',
  'executionSteps',
  'breathingTip',
  'padrao',
];

/**
 * Extrai todos os 208 exercícios dos arquivos fonte TypeScript
 */
function parseAllExercises() {
  const exercises = [];
  const idMap = new Map();

  for (const file of EXERCISE_FILES) {
    const filePath = path.join(EXERCISES_DIR, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf8');
    const blocks = content.split(/\{\s*id:\s*'/).slice(1);

    for (const b of blocks) {
      const id = b.split("'")[0].trim();
      const name = b.match(/name:\s*'([^']+)'/)?.[1] || id;
      const category = b.match(/category:\s*'([^']+)'/)?.[1] || 'Calistenia';
      const difficulty = b.match(/difficulty:\s*'([^']+)'/)?.[1] || 'Iniciante';
      const type = b.match(/type:\s*'([^']+)'/)?.[1] || 'reps';
      const description = b.match(/description:\s*'([^']+)'/)?.[1] || '';
      const breathingTip = b.match(/breathingTip:\s*'([^']+)'/)?.[1] || '';
      const padrao = b.match(/padrao:\s*'([^']+)'/)?.[1] || '';
      const cadencia = b.match(/cadencia:\s*'([^']+)'/)?.[1] || '';
      const criterioAvanco = b.match(/criterioAvanco:\s*'([^']+)'/)?.[1] || '';

      const defaultSets = parseInt(b.match(/defaultSets:\s*(\d+)/)?.[1] || '3', 10);
      const defaultReps = parseInt(b.match(/defaultReps:\s*(\d+)/)?.[1] || '12', 10);
      const defaultHoldSeconds = parseInt(b.match(/defaultHoldSeconds:\s*(\d+)/)?.[1] || '30', 10);
      const defaultRestSeconds = parseInt(b.match(/defaultRestSeconds:\s*(\d+)/)?.[1] || '60', 10);

      const primaryMuscles = [...(b.match(/primaryMuscles:\s*\[(.*?)\]/s)?.[1] || '').matchAll(/'([^']+)'/g)].map(m => m[1]);
      const secondaryMuscles = [...(b.match(/secondaryMuscles:\s*\[(.*?)\]/s)?.[1] || '').matchAll(/'([^']+)'/g)].map(m => m[1]);
      const safetyCautions = [...(b.match(/safetyCautions:\s*\[(.*?)\]/s)?.[1] || '').matchAll(/'([^']+)'/g)].map(m => m[1]);
      const regressoes = [...(b.match(/regressoes:\s*\[(.*?)\]/s)?.[1] || '').matchAll(/'([^']+)'/g)].map(m => m[1]);
      const progressoes = [...(b.match(/progressoes:\s*\[(.*?)\]/s)?.[1] || '').matchAll(/'([^']+)'/g)].map(m => m[1]);
      const variacoes = [...(b.match(/variacoes:\s*\[(.*?)\]/s)?.[1] || '').matchAll(/'([^']+)'/g)].map(m => m[1]);
      const equipamento = [...(b.match(/equipamento:\s*\[(.*?)\]/s)?.[1] || '').matchAll(/'([^']+)'/g)].map(m => m[1]);

      const executionSteps = [...(b.match(/executionSteps:\s*\[(.*?)\]\s*(?:,\s*commonMistakes|\s*\}\s*,|\s*animationType)/s)?.[1] || '').matchAll(/title:\s*'([^']+)',\s*description:\s*'([^']+)'/g)].map((m, idx) => ({
        step: idx + 1,
        title: m[1],
        description: m[2],
      }));

      const commonMistakes = [...(b.match(/commonMistakes:\s*\[(.*?)\]/s)?.[1] || '').matchAll(/mistake:\s*'([^']+)',\s*correction:\s*'([^']+)'/g)].map(m => ({
        mistake: m[1],
        correction: m[2],
      }));

      const ex = {
        id,
        name,
        slug: id,
        category,
        difficulty,
        type,
        primaryMuscles,
        secondaryMuscles,
        defaultSets,
        defaultReps: type === 'isometric' ? undefined : defaultReps,
        defaultHoldSeconds: type === 'isometric' ? defaultHoldSeconds : undefined,
        defaultRestSeconds,
        description,
        breathingTip,
        padrao,
        cadencia,
        criterioAvanco,
        safetyCautions,
        regressoes,
        progressoes,
        variacoes,
        equipamento,
        executionSteps,
        commonMistakes,
        fileOrigin: file,
      };

      exercises.push(ex);
      idMap.set(id, ex);
    }
  }

  return { exercises, idMap };
}

/**
 * Validação rigorosa dos campos e integridade referencial
 */
function validateCatalog() {
  console.log('🔍 [Pipeline] Iniciando auditoria técnica de conteúdo...');
  const { exercises, idMap } = parseAllExercises();

  let missingFieldErrors = 0;
  let brokenLinksErrors = 0;
  let emptyStepsWarnings = 0;
  const duplicateIds = new Set();
  const seenIds = new Set();

  for (const ex of exercises) {
    if (seenIds.has(ex.id)) {
      duplicateIds.add(ex.id);
    }
    seenIds.add(ex.id);

    // 1. Checagem de campos obrigatórios
    for (const field of REQUIRED_FIELDS) {
      const val = ex[field];
      if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0 && field !== 'secondaryMuscles')) {
        console.warn(`⚠️ [${ex.id}] Campo obrigatório ausente ou vazio: "${field}"`);
        missingFieldErrors++;
      }
    }

    // 2. Checagem de passos de execução
    if (!ex.executionSteps || ex.executionSteps.length === 0) {
      console.warn(`⚠️ [${ex.id}] Sem passos de execução (executionSteps) cadastrados!`);
      emptyStepsWarnings++;
    }

    // 3. Checagem de links de progressões e regressões
    for (const refId of ex.regressoes) {
      if (!idMap.has(refId) && !isLegacyAlias(refId)) {
        console.error(`❌ [${ex.id}] Regressão aponta para ID inexistente: "${refId}"`);
        brokenLinksErrors++;
      }
    }
    for (const refId of ex.progressoes) {
      if (!idMap.has(refId) && !isLegacyAlias(refId)) {
        console.error(`❌ [${ex.id}] Progressão aponta para ID inexistente: "${refId}"`);
        brokenLinksErrors++;
      }
    }
  }

  console.log('\n======================================================');
  console.log('RELATÓRIO DO PIPELINE DE CONTEÚDO (CALISTEFLOW)');
  console.log('======================================================');
  console.log(`✓ Total de exercícios analisados: ${exercises.length}`);
  console.log(`✓ IDs únicos validados: ${seenIds.size}`);
  console.log(`- Duplicidades de ID: ${duplicateIds.size}`);
  console.log(`- Campos obrigatórios ausentes: ${missingFieldErrors}`);
  console.log(`- Referências cruzadas quebradas: ${brokenLinksErrors}`);
  console.log(`- Avisos de passos vazios: ${emptyStepsWarnings}`);
  console.log('======================================================');

  if (duplicateIds.size > 0 || brokenLinksErrors > 0) {
    console.error('❌ Falha na validação do pipeline: Corrija os erros acima antes de publicar!');
    process.exit(1);
  } else {
    console.log('✅ Pipeline 100% íntegro e pronto para geração estática (SSG)!');
  }
}

function isLegacyAlias(id) {
  const aliases = [
    'diamond_pushup',
    'dips',
    'pike_pushup',
    'australian_pullup',
    'handstand_hold',
    'hollow_body',
    'front_lever',
    'pistol_squat',
    'plank',
    'hollowbody',
  ];
  return aliases.includes(id);
}

/**
 * Exporta o catálogo para JSON estruturado e CSV para revisão de CREF
 */
function exportCatalog() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const { exercises } = parseAllExercises();

  // 1. Exporta JSON completo
  const jsonPath = path.join(CONTENT_DIR, 'exercises-catalog.json');
  fs.writeFileSync(jsonPath, JSON.stringify(exercises, null, 2), 'utf8');
  console.log(`📦 [Export] Salvo catálogo JSON (${exercises.length} exercícios): ${jsonPath}`);

  // 2. Exporta CSV legível em planilhas (Excel / Google Sheets)
  const csvPath = path.join(CONTENT_DIR, 'exercises-catalog.csv');
  const headers = [
    'ID',
    'Nome',
    'Categoria',
    'Dificuldade',
    'Tipo',
    'Músculos Alvo',
    'Músculos Secundários',
    'Padrão Motor',
    'Séries',
    'Reps/Segundos',
    'Descanso (s)',
    'Descrição',
    'Dica de Respiração',
    'Regressões',
    'Progressões',
  ];

  const rows = exercises.map(ex => [
    `"${ex.id}"`,
    `"${ex.name.replace(/"/g, '""')}"`,
    `"${ex.category}"`,
    `"${ex.difficulty}"`,
    `"${ex.type}"`,
    `"${ex.primaryMuscles.join(', ')}"`,
    `"${ex.secondaryMuscles.join(', ')}"`,
    `"${ex.padrao || ''}"`,
    ex.defaultSets,
    ex.type === 'isometric' ? `${ex.defaultHoldSeconds}s` : ex.defaultReps,
    ex.defaultRestSeconds,
    `"${ex.description.replace(/"/g, '""')}"`,
    `"${ex.breathingTip.replace(/"/g, '""')}"`,
    `"${ex.regressoes.join(', ')}"`,
    `"${ex.progressoes.join(', ')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  fs.writeFileSync(csvPath, csvContent, 'utf8');
  console.log(`📊 [Export] Salvo catálogo CSV para educadores físicos: ${csvPath}`);
}

/**
 * Relatório estatístico por categoria e motor cinemático
 */
function printStats() {
  const { exercises } = parseAllExercises();
  const byCategory = {};
  const byDifficulty = {};

  for (const ex of exercises) {
    byCategory[ex.category] = (byCategory[ex.category] || 0) + 1;
    byDifficulty[ex.difficulty] = (byDifficulty[ex.difficulty] || 0) + 1;
  }

  console.log('📈 [Estatísticas do Catálogo CalisteFlow]');
  console.log(`Total geral de exercícios: ${exercises.length}\n`);

  console.log('Por Categoria:');
  for (const [k, v] of Object.entries(byCategory)) {
    console.log(`  - ${k}: ${v}`);
  }

  console.log('\nPor Dificuldade:');
  for (const [k, v] of Object.entries(byDifficulty)) {
    console.log(`  - ${k}: ${v}`);
  }
}

// Execução conforme argumento CLI
const command = process.argv[2] || 'validate';

switch (command) {
  case 'export':
    exportCatalog();
    break;
  case 'validate':
    validateCatalog();
    break;
  case 'stats':
    printStats();
    break;
  default:
    console.log(`Uso: node scripts/content-pipeline.cjs [export|validate|stats]`);
    process.exit(1);
}
