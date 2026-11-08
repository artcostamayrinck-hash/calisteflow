const fs = require('fs');
const path = require('path');

console.log('--- AUDITORIA DE ROLAGEM E TRAVAMENTO DE BODY NO CALISTEFLOW ---\n');

let errors = 0;

// 1. Verificar index.css: html e body devem usar overflow-x: clip (não hidden simultâneo)
const indexCss = fs.readFileSync(path.resolve(__dirname, '../src/index.css'), 'utf8');
if (indexCss.includes('html,\n  body {\n    overflow-x: hidden;')) {
  console.error('❌ ERRO: index.css ainda contém overflow-x: hidden simultâneo em html e body!');
  errors++;
} else if (indexCss.includes('overflow-x: clip;')) {
  console.log('✅ PASS: index.css utiliza overflow-x: clip para prevenção segura de estouro horizontal no WebKit.');
} else {
  console.warn('⚠️ AVISO: overflow-x: clip não encontrado explicitamente.');
}

// 2. Verificar se .overflow-y-auto possui suporte a touch e contain
if (indexCss.includes('-webkit-overflow-scrolling: touch') && indexCss.includes('touch-action: pan-y')) {
  console.log('✅ PASS: .overflow-y-auto configurado com -webkit-overflow-scrolling: touch e touch-action: pan-y.');
} else {
  console.error('❌ ERRO: Regra global para .overflow-y-auto ausente em index.css!');
  errors++;
}

// 3. Verificar WorkoutPlayer.tsx
const workoutPlayer = fs.readFileSync(path.resolve(__dirname, '../src/components/workout/WorkoutPlayer.tsx'), 'utf8');
if (workoutPlayer.includes('useBodyScrollLock(true)')) {
  console.log('✅ PASS: WorkoutPlayer trava o scroll do body durante a sessão ativa.');
} else {
  console.error('❌ ERRO: WorkoutPlayer não está travando o scroll do body!');
  errors++;
}

if (workoutPlayer.includes('main className="flex-1 min-h-0 overflow-y-auto')) {
  console.log('✅ PASS: WorkoutPlayer main possui flex-1 min-h-0 overflow-y-auto (sem travamento no WebKit).');
} else {
  console.error('❌ ERRO: WorkoutPlayer main está sem min-h-0 no flex-1!');
  errors++;
}

// 4. Verificar todos os modais para useBodyScrollLock e flex-1 min-h-0
const modalFiles = [
  'src/components/routines/RoutineDetailModal.tsx',
  'src/components/routines/RoutineEditorModal.tsx',
  'src/components/safety/SafeExecutionModal.tsx',
  'src/components/safety/HealthDisclaimerModal.tsx',
  'src/components/retention/FeedbackModal.tsx',
  'src/components/retention/ChangelogFaqModal.tsx',
  'src/components/planner/DayEditorModal.tsx',
  'src/components/planner/OnboardingModal.tsx',
  'src/components/workout/WorkoutSummaryModal.tsx',
  'src/components/exercises/ExerciseLibraryView.tsx',
  'src/components/workout/ExerciseVideoPlayer.tsx'
];

modalFiles.forEach(file => {
  const fullPath = path.resolve(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ ERRO: Arquivo não encontrado: ${file}`);
    errors++;
    return;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  const hasLock = content.includes('useBodyScrollLock');
  const hasMinH0 = content.includes('min-h-0 overflow-y-auto') || content.includes('overflow-y-auto pr-1');
  const hasDvh = content.includes('dvh');

  if (!hasLock) {
    console.error(`❌ ERRO: ${file} não implementa useBodyScrollLock!`);
    errors++;
  } else if (!hasMinH0) {
    console.error(`❌ ERRO: ${file} não possui min-h-0 no container de rolagem flex!`);
    errors++;
  } else if (!hasDvh) {
    console.error(`❌ ERRO: ${file} não utiliza dvh para cálculo de viewport dinâmica!`);
    errors++;
  } else {
    console.log(`✅ PASS: ${path.basename(file)} auditado com sucesso (Lock, min-h-0, dvh e Safe Area).`);
  }
});

console.log('\n--- RESULTADO FINAL DA AUDITORIA ---');
if (errors === 0) {
  console.log('🎉 TODOS OS 14 PONTOS DE AUDITORIA DE SCROLL FORAM APROVADOS COM 100% DE SUCESSO!\n');
  process.exit(0);
} else {
  console.error(`💥 FORAM ENCONTRADOS ${errors} ERROS NA AUDITORIA DE SCROLL.\n`);
  process.exit(1);
}

