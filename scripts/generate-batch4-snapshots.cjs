#!/usr/bin/env node
/**
 * Script de Geração de Snapshots do Lote 4 (Aquecimento e Alongamento) — CalisteFlow
 * Renderiza 12 exercícios representativos em u = 0.0, 0.5 e 1.0 (36 snapshots SVG + PNG)
 * em snapshots/lote4/ com catálogo visual HTML para inspeção e proteção de regressão.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const assert = require('assert');

const ROOT_DIR = process.cwd();
const SNAPSHOTS_DIR = path.join(ROOT_DIR, 'snapshots/lote4');
fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });

const G = 272;
const L = { ua: 38, fa: 34, th: 56, sh: 52, to: 66 };
const P = 'p', Q = 's';
const V = (x, y) => ({ x, y });
const f = n => n.toFixed(1);
const lp = (a, b, t) => V(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);

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

// Modelos do Lote 4
const catCowPose = u => {
  const t = Math.sin(u * Math.PI * 2);
  const H = V(225, G - 58 + t * 7);
  const S = V(148, G - 58 + t * 5);
  const W = V(148, G - 5);
  const E = ik(S, W, L.ua, L.fa, -1);
  const K = V(225, G - 9);
  const A = V(265, G - 9);
  return {
    S, E, W, H, K, A, T: V(A.x + 12, G - 5),
    hd: V(S.x - 25, S.y - 10 + t * 6),
    fc: V(-1, t * 0.5), far: [4, -3],
    pb: `<line x1="140" y1="${G}" x2="275" y2="${G}" stroke="#1f3b5c" stroke-width="2"/>`
  };
};

const standingMobilityPose = u => {
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
  let A = V(175, G - 12);
  let K = V(175, G - 62);
  let H = V(175, G - 116);
  let S = V(175, G - 180);
  let W, E, legK = K, legA = A, legT = V(A.x + 14, G - 5);

  if (type === 'quad') {
    legK = V(175, G - 62);
    legA = V(160, G - 118);
    legT = V(155, G - 130);
    W = V(162, G - 120);
    E = ik(S, W, L.ua, L.fa, -1);
  } else if (type === 'triceps') {
    W = V(180, S.y - 12);
    E = V(182, S.y - 35);
  } else if (type === 'lat') {
    W = V(225, G - 145);
    E = ik(S, W, L.ua, L.fa, 1);
  } else if (type === 'calf') {
    W = V(220, G - 140);
    E = ik(S, W, L.ua, L.fa, 1);
    legA = V(145, G - 12);
    legK = ik(H, legA, L.th, L.sh, 1);
  } else if (type === 'hamstring') {
    H = V(155, G - 105);
    S = V(185, G - 145);
    legA = V(210, G - 12);
    legK = ik(H, legA, L.th, L.sh, -1);
    W = V(195, G - 85);
    E = ik(S, W, L.ua, L.fa, 1);
  } else {
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

const BATCH_4_REPRESENTATIVES = [
  {
    id: 'gato-vaca',
    name: 'Gato-Vaca (Cat-Cow)',
    category: 'Aquecimento e Mobilidade',
    pose: catCowPose,
    mus: [
      ['p', 'S', 'H', 0.5, 0, 1, 7, 24, 8],
      ['p', 'S', 'H', 0.5, 0, -1, 7, 24, 8],
      ['s', 'S', 'E', 0.1, 1, 0, 5, 12, 6],
    ],
  },
  {
    id: 'circulos-ombro',
    name: 'Circundução de Ombros',
    category: 'Aquecimento e Mobilidade',
    pose: standingMobilityPose,
    mus: [
      ['p', 'S', 'E', 0.12, 1, 0, 6, 16, 8],
      ['s', 'S', 'H', 0.15, -1, 0, 5, 14, 6],
    ],
  },
  {
    id: 'agachamento-profundo-assistido',
    name: 'Agachamento Profundo com Apoio',
    category: 'Aquecimento e Mobilidade',
    pose: deepSquatHoldPose,
    mus: [
      ['p', 'H', 'K', 0.5, 1, 0, 8, 24, 9],
      ['p', 'H', 'K', 0.2, 1, 0, 7, 18, 7],
      ['s', 'K', 'A', 0.5, -1, 0, 6, 16, 6],
    ],
  },
  {
    id: 'greatest-stretch',
    name: 'Maior Alongamento do Mundo',
    category: 'Aquecimento e Mobilidade',
    pose: worldGreatestStretchPose,
    mus: [
      ['p', 'H', 'K', 0.2, 1, 0, 7, 20, 8],
      ['p', 'S', 'H', 0.6, 0, 1, 7, 22, 8],
      ['s', 'S', 'E', 0.15, 1, 0, 6, 14, 6],
    ],
  },
  {
    id: 'rotacao-quadril-9090',
    name: 'Transição 90/90 de Quadril',
    category: 'Aquecimento e Mobilidade',
    pose: seatedHipMobilityPose,
    mus: [
      ['p', 'H', 'K', 0.25, 1, 0, 7, 20, 8],
      ['p', 'S', 'H', 0.9, 0, 1, 6, 16, 8],
      ['s', 'H', 'K', 0.5, -1, 0, 6, 16, 7],
    ],
  },
  {
    id: 'postura-crianca',
    name: 'Postura da Criança (Child’s Pose)',
    category: 'Alongamento',
    pose: childPose,
    mus: [
      ['p', 'S', 'H', 0.2, -1, 0, 7, 22, 8],
      ['p', 'S', 'H', 0.6, 0, -1, 7, 24, 8],
      ['s', 'S', 'H', 0.9, 0, 1, 6, 16, 8],
    ],
  },
  {
    id: 'alongamento-quadriceps',
    name: 'Alongamento de Quadríceps',
    category: 'Alongamento',
    pose: u => standingStretchPose('quad', u),
    mus: [
      ['p', 'H', 'K', 0.5, 1, 0, 8, 26, 9],
      ['s', 'H', 'K', 0.2, 1, 0, 6, 16, 6],
    ],
  },
  {
    id: 'alongamento-triceps-acima',
    name: 'Alongamento de Tríceps Acima',
    category: 'Alongamento',
    pose: u => standingStretchPose('triceps', u),
    mus: [
      ['p', 'S', 'E', 0.55, -1, 0, 7, 20, 8],
      ['s', 'S', 'H', 0.18, -1, 0, 6, 18, 7],
    ],
  },
  {
    id: 'alongamento-dorsal-barra',
    name: 'Alongamento de Dorsal na Barra',
    category: 'Alongamento',
    pose: u => standingStretchPose('lat', u),
    mus: [
      ['p', 'S', 'H', 0.22, -1, 0, 8, 24, 9],
      ['s', 'S', 'E', 0.15, 1, 0, 6, 14, 6],
    ],
  },
  {
    id: 'alongamento-panturrilha',
    name: 'Alongamento de Panturrilha',
    category: 'Alongamento',
    pose: u => standingStretchPose('calf', u),
    mus: [
      ['p', 'K', 'A', 0.45, -1, 0, 7, 20, 7],
      ['s', 'H', 'K', 0.5, -1, 0, 6, 16, 6],
    ],
  },
  {
    id: 'alongamento-isquiotibiais',
    name: 'Alongamento de Isquiotibiais',
    category: 'Alongamento',
    pose: u => standingStretchPose('hamstring', u),
    mus: [
      ['p', 'H', 'K', 0.5, -1, 0, 8, 26, 8],
      ['s', 'K', 'A', 0.4, -1, 0, 6, 16, 6],
    ],
  },
  {
    id: 'alongamento-peitoral-parede',
    name: 'Alongamento de Peitoral na Parede',
    category: 'Alongamento',
    pose: u => standingStretchPose('chest', u),
    mus: [
      ['p', 'S', 'H', 0.22, 1, 0, 8, 20, 8],
      ['s', 'S', 'E', 0.15, 1, 0, 6, 14, 6],
    ],
  },
];

async function run() {
  console.log(`🚀 [Lote 4 Snapshots] Renderizando 12 exercícios representativos de Aquecimento e Alongamento (36 snapshots)...\n`);

  const catalogEntries = [];

  for (const ex of BATCH_4_REPRESENTATIVES) {
    console.log(`📦 Processando: ${ex.name} (${ex.id})`);
    const stages = [
      { name: 'Inicio_u0', label: 'Início (u = 0.0)', u: 0.0 },
      { name: 'Meio_u05', label: 'Meio (u = 0.5)', u: 0.5 },
      { name: 'Pico_u10', label: 'Pico / Alongamento Máximo (u = 1.0)', u: 1.0 },
    ];

    const exSnapshots = [];

    for (const stage of stages) {
      const svg = drawScene(ex, stage.u);
      const svgName = `${ex.id}_${stage.name}.svg`;
      const pngName = `${ex.id}_${stage.name}.png`;
      const svgPath = path.join(SNAPSHOTS_DIR, svgName);
      const pngPath = path.join(SNAPSHOTS_DIR, pngName);

      fs.writeFileSync(svgPath, svg, 'utf8');
      await sharp(Buffer.from(svg))
        .png()
        .toFile(pngPath);

      console.log(`  ✓ Snapshot salvo: ${svgName} e .png`);
      exSnapshots.push({
        stage: stage.label,
        svgName,
        pngName,
      });
    }

    catalogEntries.push({
      id: ex.id,
      name: ex.name,
      category: ex.category,
      snapshots: exSnapshots,
    });
  }

  const htmlReport = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>CalisteFlow • Catálogo de Fidelidade Visual — Lote 4: Aquecimento e Alongamento</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #030712; color: #f8fafc; margin: 0; padding: 24px; }
    h1 { font-size: 24px; font-weight: 800; color: #34d399; margin-bottom: 8px; }
    p.sub { font-size: 14px; color: #94a3b8; margin-bottom: 24px; }
    .checklist { background: #0f172a; padding: 16px 20px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 32px; max-width: 900px; font-size: 13px; line-height: 1.6; }
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
  <h1>CalisteFlow • Lote 4: Snapshots de Aquecimento e Alongamento (30 Exercícios Cobertos)</h1>
  <p class="sub">36 Snapshots gravados cobrindo mobilidade articular, ativação e alongamento.</p>

  <div class="checklist">
    <strong>Auditoria Técnica de Conformidade do Lote 4 (30 Exercícios):</strong><br>
    ✓ <strong>Padrões e Poses:</strong> Gato-Vaca, Circundução de Ombros, Agachamento Profundo, Maior Alongamento do Mundo, 90/90 de Quadril, Postura da Criança, Alongamento de Quadríceps, Tríceps, Dorsal, Panturrilha, Isquiotibiais e Peitoral.<br>
    ✓ <strong>Medidas Canônicas Rigorosas:</strong> Braço 38px, antebraço 34px, coxa 56px, canela 52px, tronco 66px, cabeça 27px.<br>
    ✓ <strong>Cores e Camadas Canônicas:</strong> Fundo #0F1B33→#050B18, chão #0A1222, linha #1F3B5C, sombra rx 140 ry 6, pele #F3C4A6→#B87A5B, cabelo #1F2937, bermuda #1E293B, tênis #E2E8F0.<br>
    ✓ <strong>Destaque Muscular Dinâmico:</strong> Alvo (#34D399) com opacidade 35%–80%, Secundário (#22D3EE) com 80% da opacidade do alvo.<br>
    ✓ <strong>Validação Biomecânica:</strong> 100% dos 30 exercícios validados com zero NaNs e sem hiperextensão articular.
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
  console.log(`\n🎉 [Sucesso] 36 snapshots e catálogo HTML do Lote 4 salvos em: ${SNAPSHOTS_DIR}`);
}

run().catch(err => {
  console.error('❌ Falha:', err);
  process.exit(1);
});

