const path = require('path');

// We can compile and test the generator logic directly
const { JOINT_RISK_MAP } = require('./riskMapHelper.cjs');
const fs = require('fs');

// Simple test to ensure JOINT_RISK_MAP has valid definitions
console.log('Testing JOINT_RISK_MAP contraindication integrity...');

const limitations = ['punho', 'ombro', 'joelho', 'lombar'];
for (const lim of limitations) {
  const risks = JOINT_RISK_MAP[lim];
  if (!risks || risks.length === 0) {
    console.error(`❌ Falha: Nenhuma contraindicação cadastrada para limitação "${lim}".`);
    process.exit(1);
  }
  console.log(`✓ Limitação [${lim}]: ${risks.length} exercícios contraindicados catalogados.`);
}

console.log('\n✅ Teste de integridade do mapa de riscos concluído com sucesso!');

