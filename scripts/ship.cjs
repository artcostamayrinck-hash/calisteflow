#!/usr/bin/env node
/**
 * Script de automação Git para CalisteFlow
 * Uso: npm run ship [mensagem opcional] ou npm run push [mensagem opcional]
 * Executa build de verificação, git add, commit convencional e push automático para o GitHub.
 */

const { execSync } = require('child_process');

function run(command) {
  try {
    return execSync(command, { stdio: 'inherit' });
  } catch (err) {
    console.error(`\n❌ Falha ao executar: ${command}`);
    process.exit(1);
  }
}

function runOutput(command) {
  try {
    return execSync(command, { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

console.log('🔍 [Git Automation] Verificando status do repositório...');
const status = runOutput('git status --porcelain');
const branch = runOutput('git branch --show-current') || 'main';

let unpushed = '';
try {
  unpushed = runOutput(`git log origin/${branch}..HEAD --oneline`);
} catch (e) {
  // Caso a branch remota ainda não tenha sido mapeada
}

if (!status && !unpushed) {
  console.log('✨ O repositório já está 100% limpo e sincronizado com o GitHub!');
  process.exit(0);
}

if (status) {
  console.log('🔨 [Git Automation] Executando verificação de build (TypeScript + Vite)...');
  run('npm run build');

  const customMsg = process.argv.slice(2).join(' ').trim();
  const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const commitMsg = customMsg || `feat: atualizacao CalisteFlow (${now})`;

  console.log(`📦 [Git Automation] Adicionando arquivos e commitando: "${commitMsg}"`);
  run('git add -A');
  run(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
} else {
  console.log('ℹ️ [Git Automation] Nenhuma alteração pendente de commit, enviando commits locais pendentes...');
}

console.log(`🌐 [Git Automation] Enviando alterações para o GitHub (origin ${branch})...`);
run(`git push origin ${branch}`);

console.log('✅ [Git Automation] Concluído com sucesso! Repositório perfeitamente sincronizado com o GitHub.');
