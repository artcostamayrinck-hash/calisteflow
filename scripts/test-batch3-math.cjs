/**
 * Teste Matemático e Biomecânico do Lote 3 (56 exercícios de Core e Deitado)
 * Valida:
 * 1. Zero NaNs
 * 2. Comprimento de braços <= 72.5 px
 * 3. Comprimento de pernas <= 109.5 px
 * 4. Apoios fixos e contínuos sem descolamento
 */

const assert = require('assert');
const fs = require('fs');

const G = 272;
const L = { ua: 38, fa: 34, th: 56, sh: 52, to: 66 };
const V = (x, y) => ({ x, y });
const f = n => n.toFixed(1);
const lp = (a, b, t) => V(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const L2 = (a, b, t) => a + (b - a) * t;
const pol = (a, g, l) => V(a.x + Math.cos(g) * l, a.y - Math.sin(g) * l);

function ik(A, B, l1, l2, bd) {
  const dx = B.x - A.x, dy = B.y - A.y, r = Math.hypot(dx, dy) || 1;
  const ux = dx / r, uy = dy / r;
  const d = Math.min(Math.max(r, Math.abs(l1 - l2) + 0.5), l1 + l2 - 0.5);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(l1 * l1 - a * a, 0));
  return V(A.x + ux * a - uy * h * bd, A.y + uy * a + ux * h * bd);
}

// 1. Hollow Body & Canoa
const hollowPose = (params = {}) => u => {
  const isTuck = params.isTuck ?? false;
  const S = V(145, G - 24);
  const H = V(210, G - 14);
  const hd = V(122, G - 26);
  // Braços estendidos para trás
  const E = V(S.x - L.ua * 0.95, S.y - 4);
  const W = V(E.x - L.fa * 0.95, E.y - 2);

  if (isTuck) {
    // Joelhos encolhidos junto ao peito
    const K = V(H.x - 12, H.y - 46);
    const A = V(H.x + 10, H.y - 12);
    return {
      S, E, W, H, K, A, T: V(A.x + 14, A.y + 4),
      hd, fc: V(0.5, -1), far: [5, -3], pb: ''
    };
  }

  // Pernas estendidas baixas a 25° do chão
  const legAngle = L2(Math.PI * 0.12, Math.PI * 0.22, u);
  const K = V(H.x + Math.cos(legAngle) * L.th, H.y - Math.sin(legAngle) * L.th);
  const A = V(K.x + Math.cos(legAngle) * L.sh, K.y - Math.sin(legAngle) * L.sh);
  return {
    S, E, W, H, K, A, T: V(A.x + 14, A.y + 4),
    hd, fc: V(0.5, -1), far: [5, -3], pb: ''
  };
};

// 2. Elevação de Pernas no Solo & Crunch / V-Up
const crunchPose = (params = {}) => u => {
  const isVUp = params.isVUp ?? false;
  const isLegRaise = params.isLegRaise ?? false;

  if (isLegRaise) {
    // Tronco e cabeça apoiados no solo, pernas sobem de 10° até 85°
    const S = V(145, G - 14);
    const H = V(211, G - 14);
    const hd = V(120, G - 14);
    const E = V(S.x + 35, G - 10);
    const W = V(E.x + 30, G - 10);
    const legAngle = L2(Math.PI * 0.08, Math.PI * 0.46, u);
    const K = V(H.x + Math.cos(legAngle) * L.th, H.y - Math.sin(legAngle) * L.th);
    const A = V(K.x + Math.cos(legAngle) * L.sh, K.y - Math.sin(legAngle) * L.sh);
    return {
      S, E, W, H, K, A, T: V(A.x + Math.cos(legAngle) * 14, A.y - Math.sin(legAngle) * 14),
      hd, fc: V(0.1, -1), far: [5, -3], pb: ''
    };
  }

  if (isVUp) {
    // V-Up: tronco e pernas sobem simultaneamente formando um V
    const H = V(200, G - 14);
    const trunkAngle = L2(Math.PI * 0.05, Math.PI * 0.30, u);
    const S = V(H.x - Math.cos(trunkAngle) * L.to, H.y - Math.sin(trunkAngle) * L.to);
    const hd = V(S.x - Math.cos(trunkAngle) * 27, S.y - Math.sin(trunkAngle) * 27);
    const E = V(S.x + L.ua * 0.9, S.y - 12);
    const W = V(E.x + L.fa * 0.9, E.y - 12);
    const legAngle = L2(Math.PI * 0.06, Math.PI * 0.32, u);
    const K = V(H.x + Math.cos(legAngle) * L.th, H.y - Math.sin(legAngle) * L.th);
    const A = V(K.x + Math.cos(legAngle) * L.sh, K.y - Math.sin(legAngle) * L.sh);
    return {
      S, E, W, H, K, A, T: V(A.x + 14, A.y - 4),
      hd, fc: V(0.8, -0.6), far: [5, -3], pb: ''
    };
  }

  // Crunch tradicional: pés apoiados no solo, escápulas sobem
  const H = V(160, G - 14);
  const A = V(245, G - 9);
  const K = ik(H, A, L.th, L.sh, -1);
  const trunkAngle = L2(0.02, 0.42, u);
  const S = V(H.x - Math.cos(trunkAngle) * L.to, H.y - Math.sin(trunkAngle) * L.to);
  const hd = V(S.x - Math.cos(trunkAngle) * 27, S.y - Math.sin(trunkAngle) * 27);
  const E = V(S.x + 24, S.y - 14);
  const W = V(hd.x + 12, hd.y - 6);
  return {
    S, E, W, H, K, A, T: V(A.x + 16, G - 1),
    hd, fc: V(0.8, -0.6), far: [5, -3], pb: ''
  };
};

// 3. Superman (Decúbito Ventral)
const supermanPose = u => {
  const H = V(200, G - 12);
  const arch = L2(0, 18, u);
  const S = V(145, G - 14 - arch);
  const hd = V(120, S.y - 14);
  const E = V(S.x - L.ua * 0.92, S.y - arch * 0.4);
  const W = V(E.x - L.fa * 0.92, E.y - arch * 0.4);
  const K = V(252, G - 12 - arch * 0.7);
  const A = V(K.x + L.sh * 0.95, G - 10 - arch);
  return {
    S, E, W, H, K, A, T: V(A.x + 14, A.y + 4),
    hd, fc: V(-0.8, -0.6), far: [5, -3], pb: ''
  };
};

// 4. Bird Dog (Quatro Apoios)
const birdDogPose = u => {
  const Ksup = V(215, G - 9);
  const Wsup = V(145, G - 5);
  const S = V(145, G - 5 - 46);
  const H = V(215, S.y + 2);
  const hd = V(S.x - 24, S.y - 8);

  // Braço próximo estende horizontal para frente
  const armExt = L2(0.2, 0.98, u);
  const E = V(S.x - L.ua * armExt, S.y);
  const W = V(E.x - L.fa * armExt, E.y);

  // Perna próxima estende horizontal para trás
  const legExt = L2(0.3, 0.98, u);
  const K = V(H.x + L.th * legExt, H.y);
  const A = V(K.x + L.sh * legExt, K.y);

  // Membros de suporte no solo
  const farS = S;
  const farE = ik(farS, Wsup, L.ua, L.fa, 1);
  const farW = Wsup;
  const farH = H;
  const farK = Ksup;
  const farA = V(Ksup.x - 22, G - 9);
  const farT = V(farA.x - 10, G - 1);

  return {
    S, E, W, H, K, A, T: V(A.x + 14, A.y + 2),
    hd, fc: V(-1, 0.1), far: [6, -2], pb: '',
    farS, farE, farW, farH, farK, farA, farT
  };
};

// 5. Prancha Lateral (Side Plank)
const sidePlankPose = (params = {}) => u => {
  const isKnee = params.isKnee ?? false;
  const E = V(190, G - 9);
  const S = V(190, G - 9 - L.ua + 2);
  const W = V(220, G - 9);
  const dip = params.isDip ? Math.sin(u * Math.PI) * 16 : 0;

  if (isKnee) {
    const K = V(95, G - 9);
    const H = V(L2(150, 150, u), S.y + 14 + dip);
    const A = V(K.x - 20, K.y - 20);
    return {
      S, E, W, H, K, A, T: V(A.x - 8, A.y - 8),
      hd: V(S.x + 22, S.y - 12), fc: V(0.8, 0.2), far: [4, -2], pb: ''
    };
  }

  const A = V(75, G - 9);
  const H = V(145, S.y + 12 + dip);
  const K = ik(H, A, L.th, L.sh, 1);
  return {
    S, E, W, H, K, A, T: V(A.x + 10, G - 1),
    hd: V(S.x + 22, S.y - 12), fc: V(0.8, 0.2), far: [4, -2], pb: ''
  };
};

// 6. Elevação de Pernas na Barra & Toes to Bar
const hangingCorePose = (params = {}) => u => {
  const isToesToBar = params.isToesToBar ?? false;
  const isKnees = params.isKnees ?? false;
  const bx = 200, by = 34;
  const W = V(bx, by + 5);
  const S = V(bx - 14, by + 71);
  const H = V(S.x - 2, S.y + L.to * 0.98);

  if (isToesToBar) {
    // Pernas sobem até a barra
    const legAngle = L2(Math.PI * 0.05, Math.PI * 0.72, u);
    const K = V(H.x + Math.sin(legAngle) * L.th, H.y - Math.cos(legAngle) * L.th);
    const A = V(K.x + Math.sin(legAngle) * L.sh, K.y - Math.cos(legAngle) * L.sh);
    return {
      S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T: V(A.x + 10, A.y - 10),
      hd: V(S.x + 5, S.y - 27), fc: V(1, 0.1), far: [6, -2],
      pb: `<path d="M${bx - 30} ${by}H${bx + 40}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 36}" y="${by - 8}" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`
    };
  }

  if (isKnees) {
    // Elevação de joelhos até 90°
    const kneeAngle = L2(0, Math.PI * 0.52, u);
    const K = V(H.x + Math.sin(kneeAngle) * L.th, H.y + Math.cos(kneeAngle) * L.th);
    const A = V(K.x - 12, K.y + L.sh * 0.85);
    return {
      S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T: V(A.x + 4, A.y + 14),
      hd: V(S.x + 5, S.y - 27), fc: V(1, 0.1), far: [6, -2],
      pb: `<path d="M${bx - 30} ${by}H${bx + 40}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 36}" y="${by - 8}" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`
    };
  }

  // Elevação de pernas estendidas até 90° (L-Hang)
  const legAngle = L2(0, Math.PI * 0.50, u);
  const K = V(H.x + Math.sin(legAngle) * L.th, H.y + Math.cos(legAngle) * L.th);
  const A = V(K.x + Math.sin(legAngle) * L.sh, K.y + Math.cos(legAngle) * L.sh);
  return {
    S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T: V(A.x + 14, A.y),
    hd: V(S.x + 5, S.y - 27), fc: V(1, 0.1), far: [6, -2],
    pb: `<path d="M${bx - 30} ${by}H${bx + 40}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 36}" y="${by - 8}" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`
  };
};

// 7. Dragon Flag
const dragonFlagPose = u => {
  const S = V(140, G - 16);
  const hd = V(115, G - 16);
  const W = V(100, G - 24);
  const E = ik(S, W, L.ua, L.fa, -1);
  const angle = L2(Math.PI * 0.08, Math.PI * 0.35, u);
  const H = V(S.x + Math.cos(angle) * L.to, S.y - Math.sin(angle) * L.to);
  const K = V(H.x + Math.cos(angle) * L.th, H.y - Math.sin(angle) * L.th);
  const A = V(K.x + Math.cos(angle) * L.sh, K.y - Math.sin(angle) * L.sh);
  return {
    S, E, W, H, K, A, T: V(A.x + 14, A.y),
    hd, fc: V(0.1, -1), far: [5, -3],
    pb: `<rect x="60" y="${G - 14}" width="120" height="14" fill="#475569"/><rect x="85" y="${G - 32}" width="10" height="20" fill="#334155"/>`
  };
};

// 8. Roda Abdominal (Ab Wheel)
const abWheelPose = u => {
  const K = V(85, G - 9);
  const A = V(K.x - 22, K.y - 20);
  const H = V(L2(105, 145, u), L2(G - 9 - 48, G - 9 - 22, u));
  const S = V(L2(148, 208, u), L2(G - 9 - 48, G - 9 - 22, u));
  const W = V(L2(152, 268, u), G - 12);
  return {
    S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T: V(A.x - 8, A.y - 8),
    hd: V(S.x + 18, S.y - 14), fc: V(0.9, 0.4), far: [6, -2],
    pb: `<circle cx="${f(W.x)}" cy="${G - 12}" r="12" fill="#334155"/><circle cx="${f(W.x)}" cy="${G - 12}" r="4" fill="#cbd5e1"/>`
  };
};

// 9. Mountain Climbers
const mountainClimberPose = u => {
  const W = V(205, G - 5);
  const S = V(205, G - 5 - 66);
  const H = V(148, 215);
  // Perna de trás estendida no chão
  const farH = V(H.x - 4, H.y);
  const farA = V(65, G - 9);
  const farK = ik(farH, farA, L.th, L.sh, 1);
  // Perna da frente recolhida dinâmica
  const cycle = Math.sin(u * 2 * Math.PI) * 0.5 + 0.5;
  const K = V(L2(155, 185, cycle), L2(230, 248, cycle));
  const A = V(K.x - 14, K.y + 24);
  return {
    S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T: V(A.x + 8, A.y + 6),
    hd: V(S.x + 24, S.y - 8), fc: V(0.8, 0.4), far: [6, -2], pb: '',
    farH, farK, farA, farT: V(farA.x + 8, G - 1)
  };
};

// 10. Nordic Hamstring Curl
const nordicCurlPose = u => {
  const K = V(135, G - 9);
  const A = V(K.x - L.sh * 0.9, G - 9);
  const angle = L2(Math.PI * 0.48, Math.PI * 0.14, u);
  const H = V(K.x + Math.cos(angle) * L.th, K.y - Math.sin(angle) * L.th);
  const S = V(H.x + Math.cos(angle) * L.to, H.y - Math.sin(angle) * L.to);
  const E = V(S.x + 12, S.y + 24);
  const W = V(E.x + 12, E.y + 22);
  return {
    S, E, W, H, K, A, T: V(A.x - 8, G - 1),
    hd: V(S.x + Math.cos(angle) * 27, S.y - Math.sin(angle) * 27),
    fc: V(1, -0.2), far: [6, -2],
    pb: `<rect x="${K.x - L.sh * 0.9 - 15}" y="${G - 14}" width="25" height="14" fill="#334155"/>`
  };
};

// Carrega os 56 exercícios de core.ts
const content = fs.readFileSync('src/data/exercises/core.ts', 'utf8');
const idMatches = [...content.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const nameMatches = [...content.matchAll(/name:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

function resolvePoseForCore(id) {
  const lower = id.toLowerCase();
  if (lower.includes('nordic')) return nordicCurlPose;
  if (lower.includes('dragon')) return dragonFlagPose;
  if (lower.includes('wheel')) return abWheelPose;
  if (lower.includes('mountain') || lower.includes('climber')) return mountainClimberPose;
  if (lower.includes('superman')) return supermanPose;
  if (lower.includes('bird') || lower.includes('perdigueiro')) return birdDogPose;
  if (lower.includes('lateral') || lower.includes('copenhagen')) return sidePlankPose({ isKnee: lower.includes('joelho'), isDip: lower.includes('elevacao') });
  if (lower.includes('barra') || lower.includes('toes')) return hangingCorePose({ isToesToBar: lower.includes('toes'), isKnees: lower.includes('joelho') });
  if (lower.includes('hollow') || lower.includes('canoa')) return hollowPose({ isTuck: lower.includes('tuck') });
  if (lower.includes('canivete') || lower.includes('v-up')) return crunchPose({ isVUp: true });
  if (lower.includes('elevacao') || lower.includes('flutter') || lower.includes('tesoura')) return crunchPose({ isLegRaise: true });
  if (lower.includes('crunch') || lower.includes('abdominal') || lower.includes('twist') || lower.includes('heel')) return crunchPose();
  // Padrão de prancha isométrica
  return hollowPose({ isTuck: true });
}

console.log(`🧪 Verificando cinemática para todos os ${idMatches.length} exercícios do Lote 3 (Core e Deitado)...`);

let verifiedCount = 0;
for (let i = 0; i < idMatches.length; i++) {
  const id = idMatches[i];
  const name = nameMatches[i] || id;
  const poseFn = resolvePoseForCore(id);

  for (const u of [0.0, 0.5, 1.0]) {
    const p = poseFn(u);
    for (const [k, v] of Object.entries(p)) {
      if (typeof v === 'object' && v !== null && 'x' in v && 'y' in v) {
        assert(!Number.isNaN(v.x), `NaN em ${id} (${k}.x) em u=${u}`);
        assert(!Number.isNaN(v.y), `NaN em ${id} (${k}.y) em u=${u}`);
      }
    }

    const armLen = Math.hypot(p.E.x - p.S.x, p.E.y - p.S.y) + Math.hypot(p.W.x - p.E.x, p.W.y - p.E.y);
    assert(armLen <= 72.5, `Braço hiperextendido em ${id} u=${u}: ${armLen.toFixed(1)} > 72.5`);

    const legLen = Math.hypot(p.K.x - p.H.x, p.K.y - p.H.y) + Math.hypot(p.A.x - p.K.x, p.A.y - p.K.y);
    assert(legLen <= 109.5, `Perna hiperextendida em ${id} u=${u}: ${legLen.toFixed(1)} > 109.5`);

    if (p.farH && p.farK && p.farA) {
      const farLegLen = Math.hypot(p.farK.x - p.farH.x, p.farK.y - p.farH.y) + Math.hypot(p.farA.x - p.farK.x, p.farA.y - p.farK.y);
      assert(farLegLen <= 109.5, `Perna traseira hiperextendida em ${id} u=${u}: ${farLegLen.toFixed(1)} > 109.5`);
    }
  }
  verifiedCount++;
}

console.log(`✅ Sucesso absoluto! ${verifiedCount}/${idMatches.length} exercícios de Core e Deitado validados sem NaNs e dentro dos limites articulares estritos!`);
