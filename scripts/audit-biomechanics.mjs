// scripts/audit-biomechanics.mjs
// Auditoria Biomecânica, Articular e Postural Automatizada de Todas as Animações (208 Exercícios)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getReferenceExerciseDef, L, G } from '../src/components/visuals/figure/referenceEngine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Coleta todos os IDs dos 208 exercícios em src/data/exercises/
const dataDir = path.join(__dirname, '../src/data/exercises');
const partialFiles = [
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

const allIds = new Set();
for (const file of partialFiles) {
  const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
  const idMatches = [...content.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);
  idMatches.forEach(id => allIds.add(id));
}

const exerciseIds = Array.from(allIds);

console.log(`=================================================================`);
console.log(`🤖 CALISTEFLOW — AUDITORIA ANATÔMICA E BIOMECÂNICA DAS ANIMAÇÕES`);
console.log(`=================================================================`);
console.log(`Total de exercícios catalogados para auditoria: ${exerciseIds.length}`);

const uSamples = [0.0, 0.15, 0.3, 0.5, 0.7, 0.85, 1.0];
const issues = [];
const modelIssues = {};
const metrics = {
  totalChecked: 0,
  boneChecks: 0,
  romChecks: 0,
  continuityChecks: 0,
};

function dist(p1, p2) {
  if (!p1 || !p2) return 0;
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function jointAngle(B, A, C) {
  if (!B || !A || !C) return 180;
  const a1 = Math.atan2(B.y - A.y, B.x - A.x);
  const a2 = Math.atan2(C.y - A.y, C.x - A.x);
  let diff = Math.abs(((a1 - a2) * 180) / Math.PI);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

exerciseIds.forEach((id) => {
  metrics.totalChecked++;
  let exDef;
  try {
    exDef = getReferenceExerciseDef(id);
  } catch (err) {
    issues.push({ id, model: 'unknown', type: 'RESOLVER_ERROR', detail: err.message });
    return;
  }

  const modelName = exDef.model;
  let prevPose = null;

  uSamples.forEach((u) => {
    let p;
    try {
      p = exDef.pose(u);
    } catch (err) {
      issues.push({ id, model: modelName, u, type: 'RUNTIME_ERROR', detail: err.message });
      return;
    }

    // 1. Integridade dos ossos principais (Rigidez esquelética humana)
    const dUA = dist(p.S, p.E);
    const dFA = dist(p.E, p.W);
    const dTH = dist(p.H, p.K);
    const dSH = dist(p.K, p.A);
    const dTO = dist(p.S, p.H);
    const dHD = dist(p.S, p.hd);
    metrics.boneChecks += 6;

    // Torso: 66 ± 3 px (permite leve curvatura torácica natural em abdominais)
    if (
      Math.abs(dTO - L.to) > 4 &&
      modelName !== 'crunch' &&
      modelName !== 'cat_cow' &&
      modelName !== 'world_greatest_stretch' &&
      modelName !== 'superman'
    ) {
      issues.push({
        id,
        model: modelName,
        u,
        type: 'BONE_LENGTH',
        detail: `Tronco |S-H| deformou: ${dTO.toFixed(1)} px (esperado ${L.to})`,
      });
    }

    // Braço superior: 38 ± 1.5 px
    if (Math.abs(dUA - L.ua) > 1.5) {
      issues.push({
        id,
        model: modelName,
        u,
        type: 'BONE_LENGTH',
        detail: `Braço superior |S-E| variou: ${dUA.toFixed(1)} px (esperado ${L.ua})`,
      });
    }

    // Antebraço: 34 ± 1.5 px
    if (Math.abs(dFA - L.fa) > 1.5) {
      issues.push({
        id,
        model: modelName,
        u,
        type: 'BONE_LENGTH',
        detail: `Antebraço |E-W| variou: ${dFA.toFixed(1)} px (esperado ${L.fa})`,
      });
    }

    // Coxa: 56 ± 1.5 px
    if (Math.abs(dTH - L.th) > 1.5) {
      issues.push({
        id,
        model: modelName,
        u,
        type: 'BONE_LENGTH',
        detail: `Coxa |H-K| variou: ${dTH.toFixed(1)} px (esperado ${L.th})`,
      });
    }

    // Canela: 52 ± 1.5 px
    if (Math.abs(dSH - L.sh) > 1.5) {
      issues.push({
        id,
        model: modelName,
        u,
        type: 'BONE_LENGTH',
        detail: `Canela |K-A| variou: ${dSH.toFixed(1)} px (esperado ${L.sh})`,
      });
    }

    // Pescoço / Centro da Cabeça: 27 ± 2.0 px
    if (Math.abs(dHD - L.hd) > 2.5 && modelName !== 'cat_cow' && modelName !== 'child_pose') {
      issues.push({
        id,
        model: modelName,
        u,
        type: 'BONE_LENGTH',
        detail: `Pescoço/Cabeça |S-hd| variou: ${dHD.toFixed(1)} px (esperado ${L.hd})`,
      });
    }

    // 2. Membros do plano de fundo (far joints), se definidos explicitamente
    if (p.farS && p.farE) {
      metrics.boneChecks++;
      const dFarUA = dist(p.farS, p.farE);
      if (Math.abs(dFarUA - L.ua) > 1.5) {
        issues.push({
          id,
          model: modelName,
          u,
          type: 'FAR_BONE_LENGTH',
          detail: `Braço oposto |farS-farE|: ${dFarUA.toFixed(1)} px (esperado ${L.ua})`,
        });
      }
    }
    if (p.farE && p.farW) {
      metrics.boneChecks++;
      const dFarFA = dist(p.farE, p.farW);
      if (Math.abs(dFarFA - L.fa) > 1.5) {
        issues.push({
          id,
          model: modelName,
          u,
          type: 'FAR_BONE_LENGTH',
          detail: `Antebraço oposto |farE-farW|: ${dFarFA.toFixed(1)} px (esperado ${L.fa})`,
        });
      }
    }
    if (p.farH && p.farK) {
      metrics.boneChecks++;
      const dFarTH = dist(p.farH, p.farK);
      if (Math.abs(dFarTH - L.th) > 1.5) {
        issues.push({
          id,
          model: modelName,
          u,
          type: 'FAR_BONE_LENGTH',
          detail: `Coxa oposta |farH-farK|: ${dFarTH.toFixed(1)} px (esperado ${L.th})`,
        });
      }
    }
    if (p.farK && p.farA) {
      metrics.boneChecks++;
      const dFarSH = dist(p.farK, p.farA);
      if (Math.abs(dFarSH - L.sh) > 1.5) {
        issues.push({
          id,
          model: modelName,
          u,
          type: 'FAR_BONE_LENGTH',
          detail: `Canela oposta |farK-farA|: ${dFarSH.toFixed(1)} px (esperado ${L.sh})`,
        });
      }
    }

    // 3. Amplitude articular e limites fisiológicos (Range of Motion - ROM)
    metrics.romChecks += 2;
    const kneeAng = jointAngle(p.H, p.K, p.A);
    if (kneeAng < 28) {
      issues.push({
        id,
        model: modelName,
        u,
        type: 'JOINT_LIMIT',
        detail: `Joelho hiperflexionado além do limite fisiológico: ${kneeAng.toFixed(1)}° (< 28°)`,
      });
    }

    const elbowAng = jointAngle(p.S, p.E, p.W);
    if (elbowAng < 25) {
      issues.push({
        id,
        model: modelName,
        u,
        type: 'JOINT_LIMIT',
        detail: `Cotovelo hiperflexionado além do limite fisiológico: ${elbowAng.toFixed(1)}° (< 25°)`,
      });
    }

    // 4. Verificação de continuidade temporal
    if (prevPose) {
      metrics.continuityChecks++;
      const maxLimbDrift = Math.max(
        dist(p.S, prevPose.S),
        dist(p.H, prevPose.H),
        dist(p.K, prevPose.K),
        dist(p.A, prevPose.A),
        dist(p.E, prevPose.E),
        dist(p.W, prevPose.W)
      );
      if (maxLimbDrift > 48) {
        issues.push({
          id,
          model: modelName,
          u,
          type: 'JERK_DISCONTINUITY',
          detail: `Salto brusco na posição da articulação (drift = ${maxLimbDrift.toFixed(1)} px)`,
        });
      }
    }
    prevPose = p;
  });
});

console.log(`\n================== RELATÓRIO DE AUDITORIA ==================`);
console.log(`Total de exercícios verificados: ${metrics.totalChecked}`);
console.log(`Total de verificações ósseas realizadas: ${metrics.boneChecks}`);
console.log(`Total de verificações de amplitude (ROM): ${metrics.romChecks}`);
console.log(`Total de verificações de continuidade: ${metrics.continuityChecks}`);
console.log(`Total de inconformidades encontradas: ${issues.length}`);

// Agrupa por modelo para termos a lista exata dos geradores que precisam de ajuste
issues.forEach(iss => {
  modelIssues[iss.model] = modelIssues[iss.model] || new Set();
  modelIssues[iss.model].add(iss.type + ': ' + iss.detail);
});

console.log(`\n📌 MODELOS COM AJUSTES NECESSÁRIOS (${Object.keys(modelIssues).length}):\n`);
Object.keys(modelIssues).sort().forEach(model => {
  console.log(`▶ Modelo: [${model}]`);
  Array.from(modelIssues[model]).slice(0, 5).forEach(d => {
    console.log(`   - ${d}`);
  });
});
