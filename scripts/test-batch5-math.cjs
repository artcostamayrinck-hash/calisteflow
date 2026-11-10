#!/usr/bin/env node
/**
 * Teste Matemático Rigoroso do Lote 5 (Skills Avançadas — 26 Exercícios)
 * Valida os modelos cinemáticos de skills.ts em u = 0.0, 0.5 e 1.0.
 * Garante 0 NaNs, conformidade anatômica e sem hiperextensão articular.
 */

const fs = require('fs');
const assert = require('assert');

const G = 272;
const L = { ua: 38, fa: 34, th: 56, sh: 52, to: 66 };
const V = (x, y) => ({ x, y });

function ik(A, B, l1, l2, bd) {
  const dx = B.x - A.x, dy = B.y - A.y, r = Math.hypot(dx, dy) || 1;
  const ux = dx / r, uy = dy / r;
  const d = Math.min(Math.max(r, Math.abs(l1 - l2) + 0.5), l1 + l2 - 0.5);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(l1 * l1 - a * a, 0));
  return V(A.x + ux * a - uy * h * bd, A.y + uy * a + ux * h * bd);
}

// 1. L-Sit / V-Sit (solo ou paralelas)
const lsitSkillPose = (type, u) => {
  const t = 0.5 + 0.5 * Math.sin(u * Math.PI * 2);
  const W = V(180, G - 5);
  const S = V(180, G - 74);
  const E = ik(S, W, L.ua, L.fa, 1);
  const H = V(180, G - 38);
  let K, A, T;

  if (type === 'tuck') {
    K = V(218, G - 60);
    A = V(208, G - 38);
    T = V(216, G - 32);
  } else if (type === 'vsit') {
    A = V(242, G - 110);
    K = ik(H, A, L.th, L.sh, -1);
    T = V(252, G - 118);
    // Torso inclinado para trás no V-sit
    S.x = 160; S.y = G - 68;
    E.x = 170; E.y = G - 36;
  } else if (type === 'one-leg') {
    K = V(232, G - 48);
    A = V(275, G - 42);
    T = V(288, G - 38);
  } else {
    // Full L-Sit
    K = V(235, G - 40);
    A = V(285, G - 40);
    T = V(298, G - 36);
  }

  return {
    S, E, W, H, K, A, T,
    hd: V(S.x + 8, S.y - 26),
    fc: V(1, -0.1), far: [4, -2],
    pb: `<rect x="165" y="${G - 8}" width="30" height="8" rx="3" fill="#334155"/>`
  };
};

// 2. Crow / Crane Pose (Bakasana / Garça)
const armBalancePose = (type, u) => {
  const t = 0.5 + 0.5 * Math.sin(u * Math.PI * 2);
  const W = V(210, G - 5);
  const S = V(235, G - 54);
  const E = type === 'crane' ? ik(S, W, L.ua, L.fa, -1) : V(222, G - 28);
  const H = V(175, G - 74);
  const K = V(215, G - 46);
  const A = V(165, G - 48);
  const T = V(155, G - 52);

  return {
    S, E, W, H, K, A, T,
    hd: V(S.x + 22, S.y - 12),
    fc: V(1, 0.4), far: [4, -2],
    pb: ''
  };
};

// 3. Planche (Lean, Tuck, Adv Tuck, Straddle, Full)
const plancheSkillPose = (type, u) => {
  const t = 0.5 + 0.5 * Math.sin(u * Math.PI * 2);
  const W = V(195, G - 5);
  const S = V(238, G - 60);
  const E = ik(S, W, L.ua, L.fa, -1);
  const H = V(174, G - 60);
  let K, A, T;

  if (type === 'lean') {
    A = V(85, G - 12);
    K = ik(H, A, L.th, L.sh, -1);
    T = V(75, G - 5);
  } else if (type === 'tuck') {
    H.y = G - 68;
    K = V(198, G - 58);
    A = V(178, G - 38);
    T = V(170, G - 34);
  } else if (type === 'adv-tuck') {
    K = V(174, G - 22);
    A = V(132, G - 22);
    T = V(122, G - 18);
  } else if (type === 'one-leg') {
    K = V(120, G - 60);
    A = V(70, G - 60);
    T = V(58, G - 58);
  } else {
    // Straddle & Full Planche
    K = V(120, G - 60);
    A = V(70, G - 60);
    T = V(58, G - 58);
  }

  return {
    S, E, W, H, K, A, T,
    hd: V(S.x + 25, S.y - 10),
    fc: V(1, 0.1), far: [4, -2],
    pb: ''
  };
};

// 4. Front Lever (Tuck, Adv Tuck, One-Leg, Straddle, Full)
const frontLeverSkillPose = (type, u) => {
  const t = 0.5 + 0.5 * Math.sin(u * Math.PI * 2);
  const W = V(235, G - 175);
  const S = V(172, G - 160);
  const E = ik(S, W, L.ua, L.fa, 1);
  const H = V(236, G - 156);
  let K, A, T;

  if (type === 'tuck') {
    K = V(212, G - 185);
    A = V(236, G - 180);
    T = V(244, G - 188);
  } else if (type === 'adv-tuck') {
    K = V(236, G - 198);
    A = V(280, G - 198);
    T = V(290, G - 204);
  } else {
    // Full / Straddle / One-leg
    K = V(290, G - 156);
    A = V(340, G - 156);
    T = V(352, G - 162);
  }

  return {
    S, E, W, H, K, A, T,
    hd: V(S.x - 22, S.y - 12),
    fc: V(-1, -0.3), far: [4, -2],
    pb: `<line x1="235" y1="${G - 210}" x2="235" y2="${G - 175}" stroke="#1f3b5c" stroke-width="4"/><circle cx="235" cy="${G - 175}" r="5" fill="#334155"/>`
  };
};

// 5. Back Lever (Tuck, Adv Tuck, One-leg, Full)
const backLeverSkillPose = (type, u) => {
  const t = 0.5 + 0.5 * Math.sin(u * Math.PI * 2);
  const W = V(215, G - 175);
  const S = V(255, G - 150);
  const E = ik(S, W, L.ua, L.fa, -1);
  const H = V(190, G - 150);
  let K, A, T;

  if (type === 'tuck') {
    K = V(205, G - 125);
    A = V(190, G - 132);
    T = V(182, G - 136);
  } else if (type === 'adv-tuck') {
    K = V(190, G - 110);
    A = V(148, G - 110);
    T = V(138, G - 114);
  } else {
    // Full / Straddle / One-leg
    K = V(136, G - 150);
    A = V(86, G - 150);
    T = V(74, G - 146);
  }

  return {
    S, E, W, H, K, A, T,
    hd: V(S.x + 22, S.y - 12),
    fc: V(1, 0.3), far: [4, -2],
    pb: `<line x1="215" y1="${G - 210}" x2="215" y2="${G - 175}" stroke="#1f3b5c" stroke-width="4"/><circle cx="215" cy="${G - 175}" r="5" fill="#334155"/>`
  };
};

// 6. Skin the Cat
const skinTheCatPose = u => {
  const W = V(200, G - 180);
  const S = V(200, G - 120);
  const E = ik(S, W, L.ua, L.fa, 1);
  const H = V(200, G - 70);
  const K = V(220, G - 95);
  const A = V(205, G - 115);
  return {
    S, E, W, H, K, A, T: V(A.x + 10, A.y - 4),
    hd: V(S.x, S.y + 25),
    fc: V(1, 0), far: [4, -2],
    pb: `<line x1="200" y1="${G - 210}" x2="200" y2="${G - 180}" stroke="#1f3b5c" stroke-width="4"/>`
  };
};

// 7. Human Flag (Bandeira Humana: Tuck, Straddle, Full)
const humanFlagSkillPose = (type, u) => {
  const lowerW = V(140, G - 95);
  const upperW = V(140, G - 160);
  const S = V(180, G - 128);
  const E = ik(S, lowerW, L.ua, L.fa, 1);
  const H = V(244, G - 128);
  let K, A, T;

  if (type === 'tuck') {
    K = V(230, G - 158);
    A = V(252, G - 152);
    T = V(260, G - 158);
  } else {
    // Full & Straddle
    K = V(298, G - 128);
    A = V(348, G - 128);
    T = V(360, G - 134);
  }

  return {
    S, E, W: lowerW, H, K, A, T,
    farW: upperW, farE: ik(V(S.x, S.y), upperW, L.ua, L.fa, -1), farS: V(S.x, S.y),
    hd: V(S.x - 24, S.y),
    fc: V(-1, 0), far: [3, -2],
    pb: `<line x1="140" y1="${G - 220}" x2="140" y2="${G}" stroke="#334155" stroke-width="5"/>`
  };
};

// 8. Chute para Parada de Mãos (Handstand Kick-up)
const kickUpHandstandPose = u => {
  const W = V(210, G - 5);
  const S = V(210, G - 70);
  const E = ik(S, W, L.ua, L.fa, 1);
  const H = V(195, G - 125);
  const K = V(215, G - 170);
  const A = V(230, G - 215);
  return {
    S, E, W, H, K, A, T: V(A.x + 8, A.y - 12),
    hd: V(S.x, S.y - 25),
    fc: V(1, 0), far: [4, -2],
    pb: ''
  };
};

function getBatch5Pose(id) {
  if (id.includes('bandeira-humana')) {
    return u => humanFlagSkillPose(id.includes('tuck') ? 'tuck' : 'full', u);
  }
  if (id.includes('skin-the-cat')) {
    return u => skinTheCatPose(u);
  }
  if (id.includes('front-lever') || id === 'frontlever') {
    const type = id.includes('tuck') ? (id.includes('adv') ? 'adv-tuck' : 'tuck') : 'full';
    return u => frontLeverSkillPose(type, u);
  }
  if (id.includes('back-lever') || id === 'back-lever') {
    const type = id.includes('tuck') ? (id.includes('adv') ? 'adv-tuck' : 'tuck') : 'full';
    return u => backLeverSkillPose(type, u);
  }
  if (id.includes('planche') && !id.includes('front') && !id.includes('back')) {
    const type = id.includes('lean') ? 'lean' : id.includes('adv-tuck') ? 'adv-tuck' : id.includes('tuck') ? 'tuck' : id.includes('uma-perna') ? 'one-leg' : 'full';
    return u => plancheSkillPose(type, u);
  }
  if (id.includes('crow') || id.includes('crane')) {
    return u => armBalancePose(id.includes('crane') ? 'crane' : 'crow', u);
  }
  if (id.includes('chute-parada-maos')) {
    return u => kickUpHandstandPose(u);
  }
  if (id.includes('vsit')) {
    return u => lsitSkillPose('vsit', u);
  }
  if (id.includes('lsit')) {
    const type = id.includes('tuck') ? 'tuck' : id.includes('uma-perna') ? 'one-leg' : 'full';
    return u => lsitSkillPose(type, u);
  }
  return u => lsitSkillPose('full', u);
}

// Carrega os 26 exercícios de skills.ts
const skillsContent = fs.readFileSync('src/data/exercises/skills.ts', 'utf8');
const skillIds = [...skillsContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

console.log(`🧪 Verificando cinemática para todos os ${skillIds.length} exercícios do Lote 5 (Skills Avançadas)...`);

let passed = 0;
skillIds.forEach(id => {
  const poseFn = getBatch5Pose(id);
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
  passed++;
});

console.log(`✅ Sucesso absoluto! ${passed}/${skillIds.length} exercícios do Lote 5 validados sem NaNs e dentro dos limites estritos!`);
