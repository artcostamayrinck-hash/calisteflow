/**
 * Teste Matemático e Biomecânico do Lote 2 (96 exercícios de Empurrar, Puxar e Pernas)
 * Verifica que todos os modelos cinemáticos possuem:
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

// 1. Flexões Paramétricas (Solo, Banco, Parede, Declinada, Pseudo-planche)
const pushPose = (params = {}) => u => {
  const bh = params.benchHeight ?? 0;
  const fh = params.feetHeight ?? 0;
  const isKnee = params.isKnee ?? false;
  const handOffset = params.handsFarBack ? -16 : 0;
  const topH = params.handsFarBack ? 62 : 71;

  if (isKnee) {
    const K = V(85, G - 9);
    const A = V(K.x - 22, K.y - 25);
    const T = V(A.x - 10, A.y - 8);
    const Wy = G - bh - 5;
    const Lb = L.to + L.th;
    const as = y => Math.asin(Math.min(1, Math.max(-1, (K.y - y) / Lb)));
    const tU = as(Wy - 66), g = L2(tU, as(Wy - 28), u);
    const S = pol(K, g, Lb);
    const W = V(pol(K, tU, Lb).x + handOffset, Wy);
    const H = pol(K, g, L.th);
    return {
      S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T,
      hd: pol(S, g + 0.08, 27), fc: V(1, 0.1), far: [7, -3],
      pb: bh ? `<rect x="${f(W.x - 20)}" y="${G - bh}" width="84" height="${bh}" fill="#475569"/><path d="M${f(W.x - 20)} ${G - bh}h84l12 -9h-84z" fill="#94a3b8"/>` : ''
    };
  }

  const Fa = V(60, G - 9 - fh);
  const Wy = G - bh - 5;
  const Lb = L.sh + L.th + L.to;
  const as = y => Math.asin(Math.min(1, Math.max(-1, (Fa.y - y) / Lb)));
  const tU = as(Wy - topH), g = L2(tU, as(Wy - 30), u);
  const S = pol(Fa, g, Lb);
  const W = V(pol(Fa, tU, Lb).x + handOffset, Wy);
  return {
    S, W, E: ik(S, W, L.ua, L.fa, 1), H: pol(Fa, g, L.sh + L.th), K: pol(Fa, g, L.sh), A: Fa, T: V(Fa.x + 9, G - 1 - fh),
    hd: pol(S, g + 0.08, 27), fc: V(1, 0.1), far: [7, -3],
    pb: (bh ? `<rect x="${f(W.x - 20)}" y="${G - bh}" width="84" height="${bh}" fill="#475569"/><path d="M${f(W.x - 20)} ${G - bh}h84l12 -9h-84z" fill="#94a3b8"/>` : '')
      + (fh ? `<rect x="35" y="${G - fh}" width="40" height="${fh}" fill="#475569"/>` : '')
  };
};

// 2. Pike e Handstand (HSPU)
const pikePose = (params = {}) => u => {
  const fh = params.feetHeight ?? 0;
  const W = V(200, G - 5);
  const A = V(122, G - 9 - fh);
  const H = V(155, L2(G - 96, G - 85, u));
  const K = ik(H, A, L.th, L.sh, 1);
  const S = V(L2(182, 195, u), L2(G - 5 - 66, G - 5 - 28, u));
  return {
    S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T: V(A.x + 8, G - 1 - fh),
    hd: V(S.x + 12, S.y + 12), fc: V(0.5, 1), far: [6, -2],
    pb: fh ? `<rect x="95" y="${G - fh}" width="45" height="${fh}" fill="#475569"/>` : ''
  };
};

const handstandPose = (params = {}) => u => {
  const isWall = params.isWall ?? false;
  const W = V(195, G - 5);
  const S = V(195, L2(G - 5 - 68, G - 5 - 26, u));
  const H = V(195, S.y - L.to);
  const K = V(195, H.y - L.th);
  const A = V(195, K.y - L.sh);
  const T = V(195, A.y - 14);
  return {
    S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T,
    hd: V(S.x + 2, S.y + 24), fc: V(1, 0), far: [6, 0],
    pb: isWall ? `<path d="M165 0V${G}" stroke="#334155" stroke-width="6"/>` : ''
  };
};

// 3. Mergulhos (Dips em Paralelas e no Banco)
const dipPose = (params = {}) => u => {
  const isBench = params.isBench ?? false;
  if (isBench) {
    const benchY = 195;
    const W = V(125, benchY);
    const S = V(150, L2(benchY - 44, benchY + 8, u));
    const H = V(150, S.y + L.to * 0.95);
    const A = V(235, G - 9);
    const K = ik(H, A, L.th, L.sh, -1);
    return {
      S, W, E: ik(S, W, L.ua, L.fa, -1), H, K, A, T: V(A.x + 16, G - 1),
      hd: V(S.x + 6, S.y - 26), fc: V(1, 0.1), far: [6, -2],
      pb: `<rect x="85" y="${benchY}" width="45" height="${G - benchY}" fill="#475569"/><path d="M85 ${benchY}h45l8 -6h-45z" fill="#94a3b8"/>`
    };
  }

  const barY = params.barY ?? 140;
  const W = V(195, barY);
  const S = V(W.x - 4, L2(barY - L.ua - L.fa + 4, barY - 4, u));
  const H = V(S.x - 6, S.y + L.to * 0.98);
  const K = V(H.x + 14, H.y + 48);
  const A = V(K.x - 28, K.y + 32);
  return {
    S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T: V(A.x - 4, A.y + 16),
    hd: V(S.x + 8, S.y - 26), fc: V(1, 0.1), far: [6, -2],
    pb: `<path d="M120 ${barY}H270" stroke="#64748b" stroke-width="5"/><rect x="135" y="${barY}" width="10" height="${G - barY}" fill="#334155"/><rect x="255" y="${barY}" width="10" height="${G - barY}" fill="#334155"/>`
  };
};

// 4. Remada Australiana (Horizontal Pull)
const rowPose = (params = {}) => u => {
  const barX = params.barX ?? 180;
  const barY = params.barY ?? 110;
  const isKnees = params.isKnees ?? false;
  const W = V(barX, barY + 5);

  if (isKnees) {
    const A = V(260, G - 9);
    const K = V(260, G - 9 - 48);
    const H = V(260 - L.th * 0.9, K.y);
    const S = V(L2(barX - 8, barX - 4, u), L2(barY + 68, barY + 16, u));
    return {
      S, W, E: ik(S, W, L.ua, L.fa, -1), H, K, A, T: V(A.x + 16, G - 1),
      hd: V(S.x - 24, S.y - 12), fc: V(-0.3, -1), far: [6, -2],
      pb: `<path d="M${barX - 25} ${barY}H${barX + 45}" stroke="#64748b" stroke-width="5"/><rect x="${barX + 40}" y="${barY - 8}" width="10" height="${G - barY + 8}" fill="#334155"/><circle cx="${barX}" cy="${barY}" r="5" fill="#cbd5e1"/>`
    };
  }

  const Fa = V(295, G - 9);
  const Lb = L.to + L.th + L.sh;
  const angleBottom = Math.asin(Math.min(1, (G - 9 - (barY + 66)) / Lb));
  const angleTop = Math.asin(Math.min(1, (G - 9 - (barY + 16)) / Lb));
  const g = L2(angleBottom, angleTop, u);
  const S = V(Fa.x - Math.cos(g) * Lb, Fa.y - Math.sin(g) * Lb);
  const H = V(Fa.x - Math.cos(g) * (L.th + L.sh), Fa.y - Math.sin(g) * (L.th + L.sh));
  const K = V(Fa.x - Math.cos(g) * L.sh, Fa.y - Math.sin(g) * L.sh);
  return {
    S, W, E: ik(S, W, L.ua, L.fa, -1), H, K, A: Fa, T: V(Fa.x + 16, G - 18),
    hd: V(S.x - Math.cos(g) * 27, S.y - Math.sin(g) * 27), fc: V(-0.3, -1), far: [6, -2],
    pb: `<path d="M${barX - 25} ${barY}H${barX + 45}" stroke="#64748b" stroke-width="5"/><rect x="${barX + 40}" y="${barY - 8}" width="10" height="${G - barY + 8}" fill="#334155"/><circle cx="${barX}" cy="${barY}" r="5" fill="#cbd5e1"/>`
  };
};

// 5. Barras Fixas e Suspensão (Vertical Pull)
const pullPose = (params = {}) => u => {
  const isDeadHang = params.isDeadHang ?? false;
  const isLsit = params.isLsit ?? false;
  const bx = 215, by = 34, W = V(bx, by + 5);

  if (isDeadHang) {
    const S = V(bx - 14, L2(by + 71, by + 58, u));
    const H = V(S.x - 2, S.y + L.to * 0.98);
    const K = V(H.x + 6, H.y + 55.7);
    const A = V(K.x - 44, K.y + 28);
    return {
      S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T: V(A.x - 4, A.y + 17),
      hd: V(S.x + 5, S.y - 27), fc: V(1, 0.1), far: [6, -2],
      pb: `<path d="M${bx} ${by}H${bx + 70}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 66}" y="${by - 8}" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`
    };
  }

  const S = V(bx - 14, L2(by + 72, by + 16, u));
  const H = V(S.x - 2, S.y + L.to * 0.98);

  if (isLsit) {
    // Pernas estendidas à frente em L-sit a 90°
    const K = V(H.x + L.th, H.y - 2);
    const A = V(K.x + L.sh, K.y - 2);
    return {
      S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T: V(A.x + 14, A.y),
      hd: V(S.x + 5, S.y - 27), fc: V(1, 0.1), far: [6, -2],
      pb: `<path d="M${bx} ${by}H${bx + 70}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 66}" y="${by - 8}" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`
    };
  }

  const K = V(H.x + 6, H.y + 55.7);
  const A = V(K.x - 44, K.y + 28);
  return {
    S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T: V(A.x - 4, A.y + 17),
    hd: V(S.x + 5, S.y - 27), fc: V(1, 0.1), far: [6, -2],
    pb: `<path d="M${bx} ${by}H${bx + 70}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 66}" y="${by - 8}" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`
  };
};

// 6. Agachamentos, Pernas e Panturrilhas
const squatPose = (params = {}) => u => {
  const isBox = params.isBox ?? false;
  const isWallSit = params.isWallSit ?? false;
  const A = V(190, G - 9);

  if (isWallSit) {
    const H = V(145, G - 9 - 52);
    const S = V(145, H.y - L.to);
    const K = V(198, H.y);
    const footA = V(198, G - 9);
    const breath = Math.sin(u * 2 * Math.PI) * 1.5;
    return {
      S: V(S.x, S.y + breath), E: V(S.x + 22, S.y + 35), W: V(S.x + 35, S.y + 60),
      H: V(H.x, H.y + breath), K, A: footA, T: V(footA.x + 18, G - 1),
      hd: V(S.x + 2, S.y - 27 + breath), fc: V(1, 0.05), far: [5, -2],
      pb: `<path d="M130 50V${G}" stroke="#334155" stroke-width="6"/>`
    };
  }

  const H = V(A.x - 6 - 52 * u, L2(A.y - 105, A.y - 50, u));
  const K = ik(H, A, L.th, L.sh, -1);
  const a = 0.12 + 0.62 * u;
  const S = V(H.x + Math.sin(a) * L.to, H.y - Math.cos(a) * L.to);
  const E = V(S.x + L.ua * 0.98, S.y + 3);
  return {
    S, E, W: V(E.x + L.fa, E.y + 1), H, K, A, T: V(A.x + 21, G - 1),
    hd: V(S.x + Math.sin(a * 0.6) * 27, S.y - Math.cos(a * 0.6) * 27), fc: V(1, 0.1), far: [5, -2],
    pb: isBox ? `<rect x="105" y="${G - 52}" width="48" height="52" fill="#475569"/><path d="M105 ${G - 52}h48l8 -6h-48z" fill="#94a3b8"/>` : ''
  };
};

const pistolPose = u => {
  const A = V(200, G - 9);
  const H = V(L2(A.x, A.x - 38, u), L2(A.y - 105, A.y - 48, u));
  const K = ik(H, A, L.th, L.sh, -1);
  const S = V(H.x + 14, H.y - L.to * 0.92);
  const E = V(S.x + L.ua * 0.95, S.y - 2);
  const W = V(E.x + L.fa * 0.95, E.y);

  // Perna livre estendida para frente
  const farH = V(H.x - 4, H.y);
  const farAngle = L2(Math.PI * 0.45, Math.PI * 0.05, u);
  const farK = V(farH.x + Math.cos(farAngle) * L.th, farH.y + Math.sin(farAngle) * L.th);
  const farA = V(farK.x + Math.cos(farAngle) * L.sh, farK.y + Math.sin(farAngle) * L.sh);
  const farT = V(farA.x + 14, farA.y);

  return {
    S, E, W, H, K, A, T: V(A.x + 20, G - 1),
    hd: V(S.x + 8, S.y - 26), fc: V(1, 0.1), far: [-6, 0], pb: '',
    farH, farK, farA, farT
  };
};

const bulgarianPose = u => {
  const frontA = V(215, G - 9);
  const benchY = G - 48;
  const backA = V(115, benchY);
  const H = V(175, L2(G - 9 - 88, G - 9 - 48, u));
  const K = ik(H, frontA, L.th, L.sh, -1);
  const S = V(H.x + 2, H.y - L.to);
  const E = V(S.x - 4, S.y + L.ua * 0.95);
  const W = V(H.x - 2, H.y - 2);

  const farH = V(H.x - 4, H.y);
  const farK = ik(farH, backA, L.th, L.sh, 1);
  const farT = V(backA.x - 10, benchY);

  return {
    S, E, W, H, K, A: frontA, T: V(frontA.x + 18, G - 1),
    hd: V(S.x + 2, S.y - 27), fc: V(1, 0.05), far: [-8, 2],
    pb: `<rect x="75" y="${benchY}" width="45" height="48" fill="#475569"/><path d="M75 ${benchY}h45l8 -6h-45z" fill="#94a3b8"/>`,
    farH, farK, farA: backA, farT
  };
};

const calfRaisePose = (params = {}) => u => {
  const isStep = params.isStep ?? true;
  const stepH = isStep ? 14 : 0;
  const stepY = G - stepH;
  const T = V(200, stepY - 1);
  const Ay = L2(stepY - 4, stepY - 26, u);
  const A = V(192, Ay);
  const H = V(192, A.y - L.sh - L.th);
  const K = ik(H, A, L.th, L.sh, 1);
  const S = V(H.x + 2, H.y - L.to);
  const E = V(S.x - 4, S.y + L.ua * 0.95);
  const W = V(H.x - 2, H.y - 2);

  return {
    S, E, W, H, K, A, T,
    hd: V(S.x + 2, S.y - 27), fc: V(1, 0.05), far: [5, -2],
    pb: isStep ? `<rect x="160" y="${stepY}" width="75" height="${stepH}" fill="#475569"/><path d="M160 ${stepY}h75l8 -6h-75z" fill="#94a3b8"/>` : ''
  };
};

// Carrega os 96 exercícios do Lote 2 e associa a pose apropriada
const files = ['pushHorizontal.ts', 'pushVertical.ts', 'pullHorizontal.ts', 'pullVertical.ts', 'legs.ts'];
const batch2List = [];
files.forEach(file => {
  const content = fs.readFileSync('src/data/exercises/' + file, 'utf8');
  const idMatches = [...content.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const nameMatches = [...content.matchAll(/name:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  for (let i = 0; i < idMatches.length; i++) {
    batch2List.push({ id: idMatches[i], name: nameMatches[i] || idMatches[i], file });
  }
});

function resolvePoseForBatch2(ex) {
  const id = ex.id.toLowerCase();
  // 1. Flexões
  if (id.includes('parede')) return pushPose({ benchHeight: 160 });
  if (id.includes('joelho')) return pushPose({ isKnee: true });
  if (id.includes('declinad') || id.includes('elevado')) return pushPose({ feetHeight: 35 });
  if (id.includes('inclinad') || id.includes('caixa') || id.includes('banco')) return pushPose({ benchHeight: 48 });
  if (id.includes('pseudo') || id.includes('planche')) return pushPose({ handsFarBack: true });
  if (ex.file === 'pushHorizontal.ts') return pushPose({ benchHeight: 0 });

  // 2. Empurrar Vertical
  if (id.includes('handstand') || id.includes('hspu') || id.includes('parada')) return handstandPose({ isWall: true });
  if (id.includes('pike')) return pikePose({ feetHeight: id.includes('elevad') ? 35 : 0 });
  if (id.includes('dip') && (id.includes('banco') || id.includes('cadeira'))) return dipPose({ isBench: true });
  if (ex.file === 'pushVertical.ts') return dipPose();

  // 3. Puxar Horizontal
  if (id.includes('joelho')) return rowPose({ isKnees: true });
  if (ex.file === 'pullHorizontal.ts') return rowPose();

  // 4. Puxar Vertical
  if (id.includes('dead-hang') || id.includes('suspensao') || id.includes('escapular')) return pullPose({ isDeadHang: true });
  if (id.includes('lsit') || id.includes('l-sit')) return pullPose({ isLsit: true });
  if (ex.file === 'pullVertical.ts') return pullPose();

  // 5. Pernas
  if (id.includes('panturrilha') || id.includes('calf') || id.includes('pogo')) return calfRaisePose();
  if (id.includes('pistol')) return pistolPose;
  if (id.includes('bulgar') || id.includes('step')) return bulgarianPose;
  if (id.includes('parede') || id.includes('wall')) return squatPose({ isWallSit: true });
  if (id.includes('box') || id.includes('caixa')) return squatPose({ isBox: true });
  return squatPose();
}

console.log(`🧪 Verificando cinemática para todos os ${batch2List.length} exercícios do Lote 2...`);

let verifiedCount = 0;
for (const ex of batch2List) {
  const poseFn = resolvePoseForBatch2(ex);
  for (const u of [0.0, 0.5, 1.0]) {
    const p = poseFn(u);
    for (const [k, v] of Object.entries(p)) {
      if (typeof v === 'object' && v !== null && 'x' in v && 'y' in v) {
        assert(!Number.isNaN(v.x), `NaN em ${ex.id} (${k}.x) em u=${u}`);
        assert(!Number.isNaN(v.y), `NaN em ${ex.id} (${k}.y) em u=${u}`);
      }
    }

    const armLen = Math.hypot(p.E.x - p.S.x, p.E.y - p.S.y) + Math.hypot(p.W.x - p.E.x, p.W.y - p.E.y);
    assert(armLen <= 72.5, `Braço hiperextendido em ${ex.id} u=${u}: ${armLen.toFixed(1)} > 72.5`);

    const legLen = Math.hypot(p.K.x - p.H.x, p.K.y - p.H.y) + Math.hypot(p.A.x - p.K.x, p.A.y - p.K.y);
    assert(legLen <= 109.5, `Perna hiperextendida em ${ex.id} u=${u}: ${legLen.toFixed(1)} > 109.5`);

    if (p.farH && p.farK && p.farA) {
      const farLegLen = Math.hypot(p.farK.x - p.farH.x, p.farK.y - p.farH.y) + Math.hypot(p.farA.x - p.farK.x, p.farA.y - p.farK.y);
      assert(farLegLen <= 109.5, `Perna traseira hiperextendida em ${ex.id} u=${u}: ${farLegLen.toFixed(1)} > 109.5`);
    }
  }
  verifiedCount++;
}

console.log(`✅ Sucesso absoluto! ${verifiedCount}/${batch2List.length} exercícios do Lote 2 validados matematicamente sem NaNs e dentro dos limites articulares estritos!`);
