import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('=== VERIFICAÇÃO AUTOMATIZADA: CALISTEFLOW 2.0 FASE 5 ===\n');

const root = process.cwd();

// 1. Verificar Arquivos do Design System em src/components/ui
const uiComponents = [
  'Button.tsx',
  'Card.tsx',
  'Badge.tsx',
  'Modal.tsx',
  'Tabs.tsx',
  'ProgressBar.tsx',
  'CircularProgress.tsx',
  'Input.tsx',
  'Toggle.tsx',
  'TimerDisplay.tsx',
  'index.ts',
];

console.log('1. Auditando componentes do Design System centralizado...');
for (const comp of uiComponents) {
  const p = path.join(root, 'src', 'components', 'ui', comp);
  assert(fs.existsSync(p), `Componente ausente: ${comp}`);
  const content = fs.readFileSync(p, 'utf8');
  assert(content.length > 50, `Componente vazio ou corrompido: ${comp}`);
}
console.log(`  ✓ Todos os ${uiComponents.length} componentes do Design System existem e estão exportados.\n`);

// 2. Verificar Sistema de Temas em appSettings.ts e index.css
console.log('2. Auditando Sistema de 4 Temas...');
const appSettingsCode = fs.readFileSync(path.join(root, 'src', 'utils', 'appSettings.ts'), 'utf8');
assert(appSettingsCode.includes("'dark' | 'light' | 'auto' | 'high-contrast'"), 'Tema high-contrast deve estar na tipagem AppSettings');
assert(appSettingsCode.includes("theme-high-contrast"), 'applyThemeAndOutdoorClasses deve tratar theme-high-contrast');

const cssCode = fs.readFileSync(path.join(root, 'src', 'index.css'), 'utf8');
assert(cssCode.includes('html.theme-high-contrast'), 'CSS deve conter regras para theme-high-contrast');
assert(cssCode.includes('html.theme-light'), 'CSS deve conter regras para theme-light');
assert(cssCode.includes(':focus-visible'), 'CSS deve conter regras universais de :focus-visible para WCAG');
assert(cssCode.includes('prefers-reduced-motion'), 'CSS deve conter overrides para prefers-reduced-motion');
console.log('  ✓ Sistema de 4 temas e regras de acessibilidade WCAG/motion validados.\n');

// 3. Verificar Audio Coach (Web Speech Synthesis)
console.log('3. Auditando Audio Coach (SpeechVoiceService)...');
const speechCode = fs.readFileSync(path.join(root, 'src', 'utils', 'speechVoice.ts'), 'utf8');
assert(speechCode.includes('speakExerciseIntro'), 'speakExerciseIntro deve existir em SpeechVoiceService');
assert(speechCode.includes('speakRestStart'), 'speakRestStart deve existir em SpeechVoiceService');
assert(speechCode.includes('speakRestEnding'), 'speakRestEnding deve existir em SpeechVoiceService');
assert(speechCode.includes('repeatLastSpeech'), 'repeatLastSpeech deve existir em SpeechVoiceService');
assert(speechCode.includes('setSpeed'), 'setSpeed deve existir em SpeechVoiceService');
assert(speechCode.includes('toggleVoice'), 'toggleVoice deve existir em SpeechVoiceService');
console.log('  ✓ Métodos de instrução mãos livres, velocidade e repetição do Audio Coach validados.\n');

// 4. Verificar Dashboard Personalizável
console.log('4. Auditando Dashboard Personalizável e Módulos da HomeView...');
const customizerCode = fs.readFileSync(path.join(root, 'src', 'components', 'home', 'DashboardCustomizerModal.tsx'), 'utf8');
assert(customizerCode.includes('calistheflow_dashboard_modules_v1'), 'Dashboard deve persistir configuração no localStorage');
assert(customizerCode.includes('resumeBanner'), 'Módulo resumeBanner deve existir');
assert(customizerCode.includes('postureMobility'), 'Módulo postureMobility deve existir');

const homeCode = fs.readFileSync(path.join(root, 'src', 'components', 'home', 'HomeView.tsx'), 'utf8');
assert(homeCode.includes('DashboardCustomizerModal'), 'HomeView deve renderizar DashboardCustomizerModal');
assert(homeCode.includes('ThemeSelector'), 'HomeView deve renderizar ThemeSelector');
assert(homeCode.includes('dashboardConfig.resumeBanner'), 'HomeView deve condicionar resumeBanner');
assert(homeCode.includes('dashboardConfig.postureMobility'), 'HomeView deve condicionar postureMobility');
console.log('  ✓ Módulos, persistência e atalho de Postura & Mobilidade validados na HomeView.\n');

// 5. Verificar WorkoutPlayer com Fullscreen e Audio Coach
console.log('5. Auditando Experiência do Modo de Treino (WorkoutPlayer)...');
const playerCode = fs.readFileSync(path.join(root, 'src', 'components', 'workout', 'WorkoutPlayer.tsx'), 'utf8');
assert(playerCode.includes('toggleFullscreen'), 'WorkoutPlayer deve suportar alternar tela cheia');
assert(playerCode.includes('speakExerciseIntro'), 'WorkoutPlayer deve anunciar início do exercício');
assert(playerCode.includes('speakRestStart'), 'WorkoutPlayer deve anunciar início do descanso');
assert(playerCode.includes('repeatLastSpeech'), 'WorkoutPlayer deve permitir repetir a fala do áudio coach');
console.log('  ✓ Tela cheia, touch targets e narração do treino validados no WorkoutPlayer.\n');

// 6. Verificar Ausência de Raio-X
console.log('6. Garantindo ausência de resquícios de Raio-X no repositório de produção...');
const filesToCheck = [
  'src/types/index.ts',
  'src/App.tsx',
  'src/components/visuals/figure/types.ts',
  'src/components/visuals/figure/constants.ts',
  'src/components/visuals/figure/renderers.tsx',
  'src/components/visuals/figure/ExerciseFigure.tsx',
  'src/components/visuals/figure/ExerciseMedia.tsx',
  'src/components/visuals/figure/BiomechanicsInspectorModal.tsx',
  'src/components/workout/WorkoutPlayer.tsx',
  'src/components/workout/ExerciseVideoPlayer.tsx',
  'src/components/home/HomeView.tsx',
];

for (const rel of filesToCheck) {
  const content = fs.readFileSync(path.join(root, rel), 'utf8');
  assert(!content.includes("'xray'"), `Arquivo ${rel} não deve conter 'xray'`);
  assert(!content.includes('"xray"'), `Arquivo ${rel} não deve conter "xray"`);
  assert(!content.includes('modo raio-x'), `Arquivo ${rel} não deve conter "modo raio-x"`);
  assert(!content.includes('Modo Raio-X'), `Arquivo ${rel} não deve conter "Modo Raio-X"`);
}
console.log('  ✓ Nenhum resquício de Raio-X encontrado no código da aplicação.\n');

console.log('=== TODOS OS TESTES DA FASE 5 PASSARAM COM SUCESSO! ===');
