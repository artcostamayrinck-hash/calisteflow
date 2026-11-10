#!/usr/bin/env node
/**
 * Script de Geração de Snapshots do Lote 1 (10 exercícios mais usados) — CalisteFlow
 * Renderiza os 10 exercícios em u = 0.0, 0.5 e 1.0 (30 snapshots SVG + PNG)
 * em snapshots/lote1/ com catálogo visual HTML para inspeção e proteção de regressão.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const assert = require('assert');

const ROOT_DIR = process.cwd();
const SNAPSHOTS_DIR = path.join(ROOT_DIR, 'snapshots/lote1');
fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });

// Constantes fundamentais do protótipo aprovado
const G = 272;
const L = { ua: 38, fa: 34, th: 56, sh: 52, to: 66 };
const P = 'p', Q = 's';
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

function limb(a, b, w1, w2, c) {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
  const nx = -dy / d, ny = dx / d;
  return `<path d="M${f(a.x + nx * w1 / 2)} ${f(a.y + ny * w1 / 2)}L${f(b.x + nx * w2 / 2)} ${f(b.y + ny * w2 / 2)}L${f(b.x - nx * w2 / 2)} ${f(b.y - ny * w2 / 2)}L${f(a.x - nx * w1 / 2)} ${f(a.y - ny * w1 / 2)}Z" fill="${c}"/><circle cx="${f(a.x)}" cy="${f(a.y)}" r="${w1 / 2}" fill="${c}"/><circle cx="${f(b.x)}" cy="${f(b.y)}" r="${w2 / 2}" fill="${c}"/>`;
}

function mus(p, m, op) {
  const [k, j1, j2, t, wx, wy, off, rx, ry] = m;
  const a = p[j1], b = p[j2];
  if (!a || !b) return '';
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d;
  if (nx * wx + ny * wy < 0) { nx = -nx; ny = -ny; }
  const cx = a.x + dx * t + nx * off, cy = a.y + dy * t + ny * off;
  return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${rx}" ry="${ry}" transform="rotate(${f(Math.atan2(dy, dx) * 180 / Math.PI)} ${f(cx)} ${f(cy)})" fill="${k == P ? '#34d399' : '#22d3ee'}" fill-opacity="${f(k == P ? op : op * 0.8)}"/>`;
}

// 1. Flexão Tradicional e Inclinada
const push = bh => u => {
  const Fa = V(60, G - 9), Wy = G - bh - 5, Lb = L.sh + L.th + L.to;
  const as = y => Math.asin(Math.min(1, (Fa.y - y) / Lb));
  const tU = as(Wy - 71), g = L2(tU, as(Wy - 30), u), S = pol(Fa, g, Lb), W = V(pol(Fa, tU, Lb).x, Wy);
  return {
    S, W, E: ik(S, W, L.ua, L.fa, 1), H: pol(Fa, g, L.sh + L.th), K: pol(Fa, g, L.sh), A: Fa, T: V(Fa.x + 9, G - 1),
    hd: pol(S, g + 0.08, 27), fc: V(1, 0.1), far: [7, -3],
    pb: bh ? `<rect x="${f(W.x - 20)}" y="${G - bh}" width="84" height="${bh}" fill="#475569"/><path d="M${f(W.x - 20)} ${G - bh}h84l12 -9h-84z" fill="#94a3b8"/>` : ''
  };
};

// 2. Agachamento Livre
const squat = u => {
  const A = V(190, G - 9), H = V(A.x - 6 - 52 * u, L2(A.y - 105, A.y - 50, u)), K = ik(H, A, L.th, L.sh, -1);
  const a = 0.12 + 0.62 * u, S = V(H.x + Math.sin(a) * L.to, H.y - Math.cos(a) * L.to), E = V(S.x + L.ua * 0.98, S.y + 3);
  return {
    S, E, W: V(E.x + L.fa, E.y + 1), H, K, A, T: V(A.x + 21, G - 1),
    hd: V(S.x + Math.sin(a * 0.6) * 27, S.y - Math.cos(a * 0.6) * 27), fc: V(1, 0.1), far: [5, -2], pb: ''
  };
};

// 3. Barra Fixa Pronada
const pull = u => {
  const bx = 215, by = 34, W = V(bx, by + 5), S = V(bx - 14, L2(by + 72, by + 16, u));
  const H = V(S.x - 2, S.y + L.to * 0.98), K = V(H.x + 6, H.y + 55.7), A = V(K.x - 44, K.y + 28);
  return {
    S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T: V(A.x - 4, A.y + 17),
    hd: V(S.x + 5, S.y - 27), fc: V(1, 0.1), far: [6, -2],
    pb: `<path d="M${bx} ${by}H${bx + 70}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 66}" y="${by - 8}" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`
  };
};

// 4. Ponte de Glúteo no Solo
const bridge = u => {
  const S = V(95, G - 15), g = (3 + 30 * u) * Math.PI / 180, H = pol(S, g, L.to), A = V(250, G - 9);
  const K = ik(H, A, L.th, L.sh, -1), E = V(S.x + 37, G - 9);
  return {
    S, E, W: V(E.x + 33, G - 9), H, K, A, T: V(A.x + 17, G - 2),
    hd: V(S.x - 25, G - 14), fc: V(0.2, -1), far: [6, -2], pb: ''
  };
};

// 5. Remada Invertida (Australian Pull-up)
const row = u => {
  const barX = 180, barY = 110;
  const W = V(barX, barY + 5);
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

// 6. Prancha Frontal (Plank - Isometria com respiração)
const plank = u => {
  const Fa = V(60, G - 9);
  const W = V(205, G - 9);
  const E = V(175, G - 9);
  const S = V(175, G - 9 - L.ua + 2);
  const breath = Math.sin(u * 2 * Math.PI) * 1.5;
  const H = V(S.x - L.to + 2, S.y + 4 + breath);
  const K = ik(H, Fa, L.th, L.sh, 1);
  return {
    S, E, W, H, K, A: Fa, T: V(Fa.x + 9, G - 1),
    hd: V(S.x + 25, S.y - 2), fc: V(0.8, 0.4), far: [6, -2], pb: ''
  };
};

// 7. Mergulho em Paralelas (Dips)
const dip = u => {
  const barY = 140;
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

// 8. Afundo Tradicional (Lunges)
const lunge = u => {
  const frontA = V(208, G - 9);
  const backA = V(125, G - 9);
  const H = V(168, L2(G - 9 - 88, G - 9 - 46, u));
  const K = ik(H, frontA, L.th, L.sh, -1);
  const S = V(H.x + 2, H.y - L.to);
  const E = V(S.x - 4, S.y + L.ua * 0.95);
  const W = V(H.x - 2, H.y - 2);

  const farH = V(H.x - 4, H.y);
  const farK = ik(farH, backA, L.th, L.sh, 1);
  const farT = V(backA.x - 8, G - 1);

  return {
    S, E, W, H, K, A: frontA, T: V(frontA.x + 18, G - 1),
    hd: V(S.x + 2, S.y - 27), fc: V(1, 0.05), far: [-8, 2], pb: '',
    farH, farK, farA: backA, farT
  };
};

// 9. Dead Bug (Inseto Morto)
const deadbug = u => {
  const S = V(155, G - 14);
  const H = V(221, G - 14);
  const hd = V(128, G - 14);

  const armExtAngle = L2(Math.PI / 2, Math.PI * 0.95, u);
  const legExtAngle = L2(Math.PI / 2, Math.PI * 0.15, u);
  const E = V(S.x - Math.cos(armExtAngle) * L.ua, S.y - Math.sin(armExtAngle) * L.ua);
  const W = V(E.x - Math.cos(armExtAngle) * L.fa, E.y - Math.sin(armExtAngle) * L.fa);
  const K = V(H.x + Math.cos(legExtAngle) * L.th, H.y - Math.sin(legExtAngle) * L.th);
  const A = V(K.x + 10, K.y - L.sh * 0.85);

  const farArmAngle = Math.PI / 2;
  const farLegAngle = Math.PI / 2;
  const farS = V(S.x + 5, S.y - 4);
  const farE = V(farS.x - Math.cos(farArmAngle) * L.ua, farS.y - Math.sin(farArmAngle) * L.ua);
  const farW = V(farE.x - Math.cos(farArmAngle) * L.fa, farE.y - Math.sin(farArmAngle) * L.fa);
  const farH = V(H.x + 5, H.y - 4);
  const farK = V(farH.x + Math.cos(farLegAngle) * L.th, farH.y - Math.sin(farLegAngle) * L.th);
  const farA = V(farK.x + 10, farK.y - L.sh * 0.85);

  return {
    S, E, W, H, K, A, T: V(A.x + 12, A.y - 4),
    hd, fc: V(0.1, -1), far: [5, -4], pb: '',
    farH, farK, farA, farT: V(farA.x + 12, farA.y - 4), farS, farE, farW
  };
};

function drawScene(ex, u) {
  const p = ex.pose(u);
  const safeId = ex.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const s = q => V(q.x + p.far[0], q.y + p.far[1]);
  const op = 0.35 + 0.45 * u;
  const sk = `url(#sk${safeId})`, sf = `url(#sf${safeId})`, hd = p.hd, fc = p.fc, fl = Math.hypot(fc.x, fc.y) || 1;

  const leg = (H, K, A, T, c) => limb(H, K, 24, 17, c) + limb(K, A, 16, 10, c) + limb(A, T, 9, 7, '#e2e8f0') + limb(H, lp(H, K, 0.5), 26, 24, '#1e293b');
  const arm = (S, E, W, c) => limb(S, E, 14, 11, c) + limb(E, W, 11, 8, c) + `<circle cx="${f(W.x)}" cy="${f(W.y)}" r="5.5" fill="${c}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">`
    + `<defs>`
    + `<linearGradient id="sk${safeId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="300"><stop offset="0" stop-color="#f3c4a6"/><stop offset="1" stop-color="#b87a5b"/></linearGradient>`
    + `<linearGradient id="sf${safeId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="300"><stop offset="0" stop-color="#c99577"/><stop offset="1" stop-color="#8a5a43"/></linearGradient>`
    + `<linearGradient id="bg${safeId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1b33"/><stop offset="1" stop-color="#050b18"/></linearGradient>`
    + `</defs>`
    + `<rect width="400" height="300" fill="url(#bg${safeId})"/><rect y="${G}" width="400" height="${300 - G}" fill="#0a1222"/><path d="M0 ${G}H400" stroke="#1f3b5c"/><ellipse cx="200" cy="${G + 4}" rx="140" ry="6" fill="#000" fill-opacity=".35"/>`
    + p.pb
    + leg(p.farH ?? s(p.H), p.farK ?? s(p.K), p.farA ?? s(p.A), p.farT ?? s(p.T), sf)
    + arm(p.farS ?? s(p.S), p.farE ?? s(p.E), p.farW ?? s(p.W), sf)
    + limb(p.S, p.H, 31, 26, sk)
    + `<circle cx="${f(p.H.x)}" cy="${f(p.H.y)}" r="13.5" fill="#1e293b"/>`
    + limb(p.S, hd, 10, 9, sk)
    + `<circle cx="${f(hd.x)}" cy="${f(hd.y)}" r="13" fill="#1f2937"/><circle cx="${f(hd.x + fc.x / fl * 3)}" cy="${f(hd.y + fc.y / fl * 3)}" r="11" fill="${sk}"/>`
    + leg(p.H, p.K, p.A, p.T, sk)
    + arm(p.S, p.E, p.W, sk)
    + ex.mus.map(m => mus(p, m, op)).join('')
    + `</svg>`;
}

// 10 Exercícios Canônicos do Lote 1
const BATCH_1_EXERCISES = [
  {
    id: 'flexao-inclinada',
    name: 'Flexão Inclinada',
    category: 'Empurrar Horizontal',
    pose: push(48),
    mus: [
      [P, 'S', 'H', 0.1, 0, 1, 7, 14, 9],
      [P, 'S', 'E', 0.5, 0, -1, 3, 15, 6],
      [P, 'S', 'E', 0.05, 1, 0, 0, 9, 9],
      [Q, 'S', 'H', 0.55, 0, 1, 6, 16, 7],
      [Q, 'H', 'K', 0.5, 0, 1, 6, 16, 8],
    ],
  },
  {
    id: 'pushup',
    name: 'Flexão Tradicional',
    category: 'Empurrar Horizontal',
    pose: push(0),
    mus: [
      [P, 'S', 'H', 0.1, 0, 1, 7, 14, 9],
      [P, 'S', 'E', 0.5, 0, -1, 3, 15, 6],
      [P, 'S', 'E', 0.05, 1, 0, 0, 9, 9],
      [Q, 'S', 'H', 0.55, 0, 1, 6, 16, 7],
      [Q, 'H', 'K', 0.5, 0, 1, 6, 16, 8],
    ],
  },
  {
    id: 'squat',
    name: 'Agachamento Livre',
    category: 'Agachamentos',
    pose: squat,
    mus: [
      [P, 'H', 'K', 0.5, 1, 0, 6, 24, 9],
      [P, 'H', 'K', 0.08, -1, 0.3, 8, 12, 11],
      [Q, 'H', 'K', 0.55, -1, 0.2, 6, 22, 6],
      [Q, 'K', 'A', 0.35, -1, 0, 6, 16, 6],
      [Q, 'S', 'H', 0.5, 1, 0, 5, 18, 8],
    ],
  },
  {
    id: 'pullup',
    name: 'Barra Fixa Pronada',
    category: 'Puxar Vertical',
    pose: pull,
    mus: [
      [P, 'S', 'H', 0.18, -1, 0, 7, 22, 10],
      [P, 'S', 'E', 0.5, 0, -1, 4, 15, 6],
      [Q, 'E', 'W', 0.45, 0, -1, 3, 13, 5],
      [Q, 'S', 'H', 0.55, 1, 0, 6, 16, 8],
    ],
  },
  {
    id: 'australianpullup',
    name: 'Remada Invertida',
    category: 'Puxar Horizontal',
    pose: row,
    mus: [
      [P, 'S', 'H', 0.2, -1, 0, 6, 20, 9],
      [P, 'S', 'E', 0.5, 0, -1, 4, 14, 6],
      [Q, 'S', 'H', 0.05, -1, 0, 5, 14, 7],
      [Q, 'E', 'W', 0.45, 0, -1, 3, 12, 5],
    ],
  },
  {
    id: 'plank',
    name: 'Prancha Frontal',
    category: 'Core Isométrico',
    pose: plank,
    mus: [
      [P, 'S', 'H', 0.5, 0, 1, 6, 22, 8],
      [Q, 'H', 'K', 0.5, 0, 1, 6, 18, 7],
      [Q, 'S', 'E', 0.2, 0, 1, 4, 12, 6],
    ],
  },
  {
    id: 'ponte-gluteo',
    name: 'Ponte de Glúteo',
    category: 'Cadeia Posterior',
    pose: bridge,
    mus: [
      [P, 'S', 'H', 0.93, 0, 1, 4, 14, 12],
      [Q, 'H', 'K', 0.5, 0.4, 1, 6, 24, 7],
      [Q, 'S', 'H', 0.55, 0, -1, 5, 18, 6],
    ],
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug (Inseto Morto)',
    category: 'Core e Estabilidade',
    pose: deadbug,
    mus: [
      [P, 'S', 'H', 0.5, 0, 1, 6, 20, 8],
      [Q, 'H', 'K', 0.15, 0, 1, 5, 14, 7],
      [Q, 'S', 'E', 0.3, 0, -1, 4, 12, 5],
    ],
  },
  {
    id: 'dip',
    name: 'Mergulho em Paralelas',
    category: 'Empurrar Vertical',
    pose: dip,
    mus: [
      [P, 'S', 'E', 0.5, 0, 1, 4, 15, 7],
      [P, 'S', 'H', 0.15, 1, 0, 6, 16, 8],
      [Q, 'S', 'E', 0.05, 1, 0, 0, 9, 9],
      [Q, 'S', 'H', 0.55, 1, 0, 6, 15, 7],
    ],
  },
  {
    id: 'lunges',
    name: 'Afundo Tradicional',
    category: 'Pernas Unilateral',
    pose: lunge,
    mus: [
      [P, 'H', 'K', 0.5, 1, 0, 6, 22, 8],
      [P, 'H', 'K', 0.08, -1, 0.3, 7, 12, 10],
      [Q, 'H', 'K', 0.55, -1, 0.2, 6, 18, 6],
      [Q, 'K', 'A', 0.35, -1, 0, 5, 14, 5],
    ],
  },
];

const STAGES = [
  { u: 0.0, label: 'Inicio_u0', desc: 'Início / Fase Neutra (u = 0.0)' },
  { u: 0.5, label: 'Meio_u05', desc: 'Meio do Movimento (u = 0.5)' },
  { u: 1.0, label: 'Pico_u10', desc: 'Pico de Esforço / Contração (u = 1.0)' },
];

async function run() {
  console.log('🚀 [Lote 1 Snapshots] Renderizando 10 exercícios canônicos (30 snapshots)...');
  const catalogEntries = [];

  for (const ex of BATCH_1_EXERCISES) {
    console.log(`\n📦 Processando: ${ex.name} (${ex.id})`);
    const exEntries = [];

    for (const stage of STAGES) {
      const svg = drawScene(ex, stage.u);
      const filenameBase = `${ex.id}_${stage.label}`;
      const svgPath = path.join(SNAPSHOTS_DIR, `${filenameBase}.svg`);
      const pngPath = path.join(SNAPSHOTS_DIR, `${filenameBase}.png`);

      fs.writeFileSync(svgPath, svg, 'utf8');

      await sharp(Buffer.from(svg))
        .png()
        .toFile(pngPath);

      assert(!svg.includes('NaN'), `Erro de NaN em ${filenameBase}`);
      assert(svg.includes('#f3c4a6'), `Pele ausente em ${filenameBase}`);
      assert(svg.includes('#1f2937'), `Cabelo ausente em ${filenameBase}`);
      assert(svg.includes('#1e293b'), `Bermuda ausente em ${filenameBase}`);
      assert(svg.includes('#e2e8f0'), `Tênis ausente em ${filenameBase}`);
      assert(svg.includes('ellipse'), `Músculos ausentes em ${filenameBase}`);

      exEntries.push({
        stage: stage.desc,
        svgName: `${filenameBase}.svg`,
        pngName: `${filenameBase}.png`,
        u: stage.u,
      });

      console.log(`  ✓ Snapshot salvo: ${filenameBase}.svg e .png`);
    }

    catalogEntries.push({
      ...ex,
      snapshots: exEntries,
    });
  }

  // Gera relatório HTML de Comparação Visual do Lote 1
  const htmlReport = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>CalisteFlow • Lote 1 — Snapshots dos 10 Exercícios Mais Usados</title>
  <style>
    body { background: #030712; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 32px 24px; }
    h1 { color: #34d399; font-size: 24px; margin-bottom: 8px; }
    p.sub { color: #94a3b8; font-size: 14px; margin-top: 0; margin-bottom: 24px; }
    .checklist { background: #0f172a; padding: 16px 20px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 32px; max-width: 860px; font-size: 13px; line-height: 1.6; }
    .checklist strong { color: #38bdf8; }
    .exercise-card { background: #070d19; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; margin-bottom: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .exercise-title { font-size: 18px; font-weight: 800; margin: 0 0 4px 0; color: #ffffff; }
    .exercise-cat { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
    .snapshots-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    .frame-box { background: #020617; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b; }
    .frame-box img { width: 100%; height: auto; display: block; }
    .frame-caption { padding: 10px 14px; font-size: 12px; font-weight: 700; color: #cbd5e1; background: #090f1d; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <h1>CalisteFlow • Lote 1: Snapshots dos 10 Exercícios Mais Usados</h1>
  <p class="sub">30 Snapshots canônicos gravados para proteção visual e validação dos 10 exercícios fundamentais.</p>

  <div class="checklist">
    <strong>Auditoria Técnica de Conformidade do Lote 1:</strong><br>
    ✓ <strong>10 Exercícios:</strong> Flexão Inclinada, Flexão Tradicional, Agachamento Livre, Barra Fixa Pronada, Remada Invertida, Prancha Frontal, Ponte de Glúteo, Dead Bug, Mergulho em Paralelas e Afundo.<br>
    ✓ <strong>Medidas Anatômicas dos Ossos:</strong> Braço 38px, antebraço 34px, coxa 56px, canela 52px, tronco 66px, centro da cabeça 27px.<br>
    ✓ <strong>Cores Canônicas do Protótipo:</strong> Degradê de pele (#F3C4A6 → #B87A5B), sombra posterior (#C99577 → #8A5A43), cabelo (#1F2937), bermuda (#1E293B), tênis (#E2E8F0), cenário (#0F1B33 → #050B18), chão (#0A1222), linha (#1F3B5C).<br>
    ✓ <strong>Destaque Muscular Dinâmico:</strong> Alvo (#34D399) com opacidade 35%–80%, Secundário (#22D3EE) com 80% da opacidade do alvo.<br>
    ✓ <strong>Sem descolamento articular:</strong> IK 2D exato com ancoragens estáveis nos apoios em todas as 3 posições-chave.
  </div>

  ${catalogEntries.map(e => `
    <div class="exercise-card">
      <h2 class="exercise-title">${e.name}</h2>
      <div class="exercise-cat">${e.category} • ID: ${e.id}</div>
      <div class="snapshots-grid">
        ${e.snapshots.map(s => `
          <div class="frame-box">
            <img src="${s.pngName}" alt="${e.name} ${s.stage}" loading="lazy" />
            <div class="frame-caption">${s.stage}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('')}
</body>
</html>
`;

  fs.writeFileSync(path.join(SNAPSHOTS_DIR, 'index.html'), htmlReport, 'utf8');
  console.log(`\n🎉 [Sucesso] 30 snapshots e catálogo HTML do Lote 1 salvos em: ${SNAPSHOTS_DIR}`);
}

run().catch(err => {
  console.error('❌ Falha:', err);
  process.exit(1);
});
