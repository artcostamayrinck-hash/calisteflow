#!/usr/bin/env node
/**
 * Script de automação Git para CalisteFlow
 * Uso: npm run ship [mensagem opcional]
 * Executa build de verificação, git add, commit convencional e push automático.
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
  return execSync(command, { encoding: 'utf-8' }).trim();
}

console.log('🚀 [Git Automation] Verificando status do repositório...');
const status = runOutput('git status --porcelain');

if (!status) {
  console.log('✨ Nada para commitar, a árvore de trabalho já está 100% limpa!');
  process.exit(0);
}

console.log('🔨 [Git Automation] Executando verificação de build (TypeScript + Vite)...');
run('npm run build');

const customMsg = process.argv.slice(2).join(' ').trim();
const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
const commitMsg = customMsg || `feat: atualizacao automatica CalisteFlow (${now})`;

console.log(`📦 [Git Automation] Adicionando arquivos e commitando: "${commitMsg}"`);
run('git add -A');
run(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);

console.log('🌐 [Git Automation] Enviando alterações para o GitHub (origin main)...');
run('git push origin main');

console.log('✅ [Git Automation] Concluído com sucesso! Repositório sincronizado.');
