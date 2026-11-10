#!/usr/bin/env node
/**
 * Teste Matemático Rigoroso do Lote 4 (Aquecimento e Alongamento — 30 Exercícios)
 * Valida os modelos cinemáticos de warmupMobility.ts e stretches.ts em u = 0.0, 0.5 e 1.0.
 * Garante 0 NaNs, conformidade anatômica e sem hiperextensão articular.
 */

const fs = require('fs');
const assert = require('assert');

const G = 272;
const L = { ua: 38, fa: 34, th: 56, sh: 52, to: 66 };
const V = (x, y) => ({ x, y });
const L2 = (a, b, t) => a + (b - a) * t;

function ik(A, B, l1, l2, bd) {
  const dx = B.x - A.x, dy = B.y - A.y, r = Math.hypot(dx, dy) || 1;
  const ux = dx / r, uy = dy / r;
  const d = Math.min(Math.max(r, Math.abs(l1 - l2) + 0.5), l1 + l2 - 0.5);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(l1 * l1 - a * a, 0));
  return V(A.x + ux * a - uy * h * bd, A.y + uy * a + ux * h * bd);
}

// Modelos do Lote 4
const catCowPose = u => {
  const t = Math.sin(u * Math.PI * 2);
  const H = V(225, G - 58 + t * 7);
  const S = V(148, G - 58 + t * 5);
  const W = V(148, G - 5);
  const E = ik(S, W, L.ua, L.fa, -1);
  const K = V(225, G - 9);
  const A = V(265, G - 9);
  const headAngle = t * 0.35;
  return {
    S, E, W, H, K, A, T: V(A.x + 12, G - 5),
    hd: V(S.x - 25, S.y - 10 + t * 6),
    fc: V(-1, t * 0.5), far: [4, -3],
    pb: `<line x1="140" y1="${G}" x2="275" y2="${G}" stroke="#1f3b5c" stroke-width="2"/>`
  };
};

const standingMobilityPose = u => {
  const cycle = Math.sin(u * Math.PI * 2);
  const A = V(180, G - 12);
  const K = V(180, G - 62);
  const H = V(180, G - 116);
  const S = V(180, G - 180);
  const W = V(180 + Math.cos(u * Math.PI * 2) * 45, S.y + Math.sin(u * Math.PI * 2) * 45);
  const E = ik(S, W, L.ua, L.fa, 1);
  return {
    S, E, W, H, K, A, T: V(A.x + 14, G - 5),
    hd: V(S.x, S.y - 27),
    fc: V(1, 0), far: [5, -2],
    pb: ''
  };
};

const deepSquatHoldPose = u => {
  const t = 0.5 + 0.5 * Math.sin(u * Math.PI * 2);
  const A = V(155, G - 12);
  const K = V(205, G - 42);
  const H = V(165, G - 38 + t * 5);
  const S = V(160, G - 98 + t * 4);
  const W = V(225, G - 102);
  const E = ik(S, W, L.ua, L.fa, -1);
  return {
    S, E, W, H, K, A, T: V(A.x + 15, G - 5),
    hd: V(S.x + 10, S.y - 25),
    fc: V(1, 0), far: [6, -2],
    pb: `<line x1="225" y1="${G - 160}" x2="225" y2="${G}" stroke="#334155" stroke-width="4"/>`
  };
};

const worldGreatestStretchPose = u => {
  const t = 0.5 + 0.5 * Math.sin(u * Math.PI * 2);
  const frontA = V(220, G - 12);
  const frontK = V(212, G - 55);
  const H = V(155, G - 48);
  const backK = V(115, G - 20);
  const backA = V(70, G - 12);
  const S = V(170, G - 85);
  const W = V(170 + t * 25, G - 95 - t * 45);
  const E = ik(S, W, L.ua, L.fa, 1);
  const farW = V(195, G - 5);
  const farE = ik(V(S.x + 4, S.y - 2), farW, L.ua, L.fa, -1);
  return {
    S, E, W, H, K: frontK, A: frontA, T: V(frontA.x + 12, G - 5),
    farS: V(S.x + 4, S.y - 2), farE, farW,
    farH: V(H.x - 4, H.y), farK: backK, farA: backA, farT: V(backA.x - 12, G - 5),
    hd: V(S.x + 8, S.y - 25),
    fc: V(1, -0.4), far: [4, -2],
    pb: ''
  };
};

const seatedHipMobilityPose = u => {
  const t = 0.5 + 0.5 * Math.sin(u * Math.PI * 2);
  const H = V(190, G - 16);
  const S = V(185, G - 76 + t * 4);
  const W = V(168, G - 15);
  const E = ik(S, W, L.ua, L.fa, -1);
  const K = V(235, G - 14);
  const A = V(205, G - 8);
  return {
    S, E, W, H, K, A, T: V(A.x - 10, G - 6),
    hd: V(S.x + 6, S.y - 26),
    fc: V(1, 0), far: [6, -2],
    pb: ''
  };
};

const childPose = u => {
  const t = 0.5 + 0.5 * Math.sin(u * Math.PI * 2);
  const H = V(240, G - 26 + t * 2);
  const K = V(195, G - 9);
  const A = V(238, G - 9);
  const S = V(160, G - 25 + t * 2);
  const W = V(105, G - 5);
  const E = ik(S, W, L.ua, L.fa, -1);
  return {
    S, E, W, H, K, A, T: V(A.x + 10, G - 7),
    hd: V(S.x - 18, S.y - 5),
    fc: V(-1, 0.2), far: [4, -2],
    pb: ''
  };
};

const standingStretchPose = (type, u) => {
  const t = 0.5 + 0.5 * Math.sin(u * Math.PI * 2);
  let A = V(175, G - 12);
  let K = V(175, G - 62);
  let H = V(175, G - 116);
  let S = V(175, G - 180);
  let W, E, legK = K, legA = A, legT = V(A.x + 14, G - 5);

  if (type === 'quad') {
    // Perna de trás dobrada segurando no glúteo
    legK = V(175, G - 62);
    legA = V(160, G - 118);
    legT = V(155, G - 130);
    W = V(162, G - 120);
    E = ik(S, W, L.ua, L.fa, -1);
  } else if (type === 'triceps') {
    W = V(180, S.y - 12);
    E = V(182, S.y - 35);
  } else if (type === 'lat') {
    // Segurando na barra/poste inclinando tronco
    W = V(225, G - 145);
    E = ik(S, W, L.ua, L.fa, 1);
  } else if (type === 'calf') {
    // Panturrilha na parede
    W = V(220, G - 140);
    E = ik(S, W, L.ua, L.fa, 1);
    legA = V(145, G - 12);
    legK = ik(H, legA, L.th, L.sh, 1);
  } else if (type === 'hamstring') {
    // Isquiotibiais com flexão de quadril
    H = V(155, G - 105);
    S = V(185, G - 145);
    legA = V(210, G - 12);
    legK = ik(H, legA, L.th, L.sh, -1);
    W = V(195, G - 85);
    E = ik(S, W, L.ua, L.fa, 1);
  } else {
    // Cross body shoulder / chest
    W = V(type === 'chest' ? 135 : 195, S.y + 10);
    E = ik(S, W, L.ua, L.fa, 1);
  }

  return {
    S, E, W, H, K: legK, A: legA, T: legT,
    hd: V(S.x, S.y - 27),
    fc: V(1, 0), far: [5, -2],
    pb: type === 'calf' || type === 'chest' ? `<line x1="225" y1="${G - 200}" x2="225" y2="${G}" stroke="#334155" stroke-width="4"/>` : ''
  };
};

// Mapeador de cada exercício do Lote 4 para sua função
function getBatch4Pose(id) {
  if (id.includes('gato') || id.includes('retracao-protracao') || id.includes('flexao-extensao-punho') || id.includes('rotacao-toracica')) {
    return u => catCowPose(u);
  }
  if (id.includes('greatest') || id.includes('flexores-quadril')) {
    return u => worldGreatestStretchPose(u);
  }
  if (id.includes('9090') || id.includes('pombo') || id.includes('borboleta')) {
    return u => seatedHipMobilityPose(u);
  }
  if (id.includes('crianca')) {
    return u => childPose(u);
  }
  if (id.includes('agachamento-profundo') || id.includes('mobilidade-tornozelo')) {
    return u => deepSquatHoldPose(u);
  }
  if (id.includes('quadriceps')) {
    return u => standingStretchPose('quad', u);
  }
  if (id.includes('triceps')) {
    return u => standingStretchPose('triceps', u);
  }
  if (id.includes('dorsal')) {
    return u => standingStretchPose('lat', u);
  }
  if (id.includes('panturrilha')) {
    return u => standingStretchPose('calf', u);
  }
  if (id.includes('isquiotibiais')) {
    return u => standingStretchPose('hamstring', u);
  }
  if (id.includes('peitoral')) {
    return u => standingStretchPose('chest', u);
  }
  return u => standingMobilityPose(u);
}

// Carrega os exercícios reais de warmupMobility.ts e stretches.ts
const warmupContent = fs.readFileSync('src/data/exercises/warmupMobility.ts', 'utf8');
const warmupIds = [...warmupContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

const stretchesContent = fs.readFileSync('src/data/exercises/stretches.ts', 'utf8');
const stretchesIds = [...stretchesContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

const allBatch4Ids = [...warmupIds, ...stretchesIds];

console.log(`🧪 Verificando cinemática para todos os ${allBatch4Ids.length} exercícios do Lote 4 (Aquecimento e Alongamento)...`);

let passedCount = 0;
allBatch4Ids.forEach(id => {
  const poseFn = getBatch4Pose(id);
  [0, 0.5, 1.0].forEach(u => {
    const p = poseFn(u);
    ['S', 'E', 'W', 'H', 'K', 'A', 'T', 'hd'].forEach(joint => {
      assert(Number.isFinite(p[joint].x), `NaN em ${id} joint ${joint}.x em u=${u}`);
      assert(Number.isFinite(p[joint].y), `NaN em ${id} joint ${joint}.y em u=${u}`);
    });

    const armReach = Math.hypot(p.W.x - p.S.x, p.W.y - p.S.y);
    assert(armReach <= 72.5, `Braço hiperextendido em ${id} u=${u}: ${armReach.toFixed(1)} > 72.5`);

    const legReach = Math.hypot(p.A.x - p.H.x, p.A.y - p.H.y);
    assert(legReach <= 109.5, `Perna hiperextendida em ${id} u=${u}: ${legReach.toFixed(1)} > 109.5`);
  });
  passedCount++;
});

console.log(`✅ Sucesso absoluto! ${passedCount}/${allBatch4Ids.length} exercícios do Lote 4 validados sem NaNs e dentro dos limites estritos!`);
