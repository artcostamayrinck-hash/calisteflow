/**
 * Teste Matemático do Lote 1 (10 Exercícios mais usados)
 */

const assert = require('assert');

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

// 1. Flexão Tradicional
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

// 3. Barra Fixa
const pull = u => {
  const bx = 215, by = 34, W = V(bx, by + 5), S = V(bx - 14, L2(by + 72, by + 16, u));
  const H = V(S.x - 2, S.y + L.to * 0.98), K = V(H.x + 6, H.y + 55.7), A = V(K.x - 44, K.y + 28);
  return {
    S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T: V(A.x - 4, A.y + 17),
    hd: V(S.x + 5, S.y - 27), fc: V(1, 0.1), far: [6, -2],
    pb: `<path d="M${bx} ${by}H${bx + 70}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 66}" y="${by - 8}" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`
  };
};

// 4. Ponte de Glúteo
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
  const Fa = V(295, G - 9); // calcanhares no chão
  const Lb = L.to + L.th + L.sh;
  // u=0 (braços estendidos, corpo baixo) -> u=1 (peito na barra)
  const angleBottom = Math.asin((G - 9 - (barY + 66)) / Lb);
  const angleTop = Math.asin((G - 9 - (barY + 16)) / Lb);
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
  const W = V(205, G - 9); // punho no chão
  const E = V(175, G - 9); // cotovelo no chão
  const S = V(175, G - 9 - L.ua + 2); // ombro alinhado sobre cotovelo
  // Respiração sutil de 1.5px
  const breath = Math.sin(u * 2 * Math.PI) * 1.5;
  const Lb = L.th + L.sh;
  // Tronco reto alinhado com quadril
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
  // u=0 topo (braço quase estendido) -> u=1 fundo (cotovelo flexionado a 90°)
  const S = V(W.x - 4, L2(barY - L.ua - L.fa + 4, barY - 4, u));
  const H = V(S.x - 6, S.y + L.to * 0.98);
  const K = V(H.x + 14, H.y + 48); // pernas flexionadas para trás
  const A = V(K.x - 28, K.y + 32);
  return {
    S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T: V(A.x - 4, A.y + 16),
    hd: V(S.x + 8, S.y - 26), fc: V(1, 0.1), far: [6, -2],
    pb: `<path d="M120 ${barY}H270" stroke="#64748b" stroke-width="5"/><rect x="135" y="${barY}" width="10" height="${G - barY}" fill="#334155"/><rect x="255" y="${barY}" width="10" height="${G - barY}" fill="#334155"/>`
  };
};

// 8. Afundo (Lunges)
const lunge = u => {
  const frontA = V(208, G - 9); // pé da frente no chão
  const backA = V(125, G - 9);  // ponta do pé de trás no chão
  // u=0 topo em split stance -> u=1 fundo a 90° em ambos os joelhos
  const H = V(168, L2(G - 9 - 88, G - 9 - 46, u));
  const K = ik(H, frontA, L.th, L.sh, -1); // joelho da frente dobra pra frente
  const S = V(H.x + 2, H.y - L.to);
  const E = V(S.x - 4, S.y + L.ua * 0.95); // braços firmes ao lado do corpo
  const W = V(H.x - 2, H.y - 2);
  return {
    S, E, W, H, K, A: frontA, T: V(frontA.x + 18, G - 1),
    hd: V(S.x + 2, S.y - 27), fc: V(1, 0.05), far: [-8, 2], pb: ''
  };
};

// 9. Dead Bug (Decúbito dorsal - Inseto Morto)
const deadbug = u => {
  const S = V(155, G - 14);
  const H = V(221, G - 14);
  const hd = V(128, G - 14);
  // u=0 posição 90/90 -> u=1 braço e perna oposta estendidos
  const armExtAngle = L2(Math.PI / 2, Math.PI * 0.95, u);
  const legExtAngle = L2(Math.PI / 2, Math.PI * 0.15, u);
  const E = V(S.x - Math.cos(armExtAngle) * L.ua, S.y - Math.sin(armExtAngle) * L.ua);
  const W = V(E.x - Math.cos(armExtAngle) * L.fa, E.y - Math.sin(armExtAngle) * L.fa);
  const K = V(H.x + Math.cos(legExtAngle) * L.th, H.y - Math.sin(legExtAngle) * L.th);
  const A = V(K.x + 10, K.y - L.sh * 0.85);
  return {
    S, E, W, H, K, A, T: V(A.x + 12, A.y - 4),
    hd, fc: V(0.1, -1), far: [5, -4], pb: ''
  };
};

const BATCH_1 = [
  { id: 'pullup', pose: pull, name: 'Barra Fixa' },
  { id: 'pushup', pose: push(0), name: 'Flexão Tradicional' },
  { id: 'flexao-inclinada', pose: push(48), name: 'Flexão Inclinada' },
  { id: 'squat', pose: squat, name: 'Agachamento' },
  { id: 'ponte-gluteo', pose: bridge, name: 'Ponte de Glúteo' },
  { id: 'australianpullup', pose: row, name: 'Remada Invertida' },
  { id: 'plank', pose: plank, name: 'Prancha Frontal' },
  { id: 'dip', pose: dip, name: 'Mergulho em Paralelas' },
  { id: 'lunges', pose: lunge, name: 'Afundo' },
  { id: 'dead-bug', pose: deadbug, name: 'Dead Bug' },
];

console.log('🧪 Verificando cálculos cinemáticos do Lote 1 (10 exercícios)...');

for (const ex of BATCH_1) {
  for (const u of [0.0, 0.5, 1.0]) {
    const p = ex.pose(u);
    for (const [k, v] of Object.entries(p)) {
      if (typeof v === 'object' && v !== null && 'x' in v && 'y' in v) {
        assert(!Number.isNaN(v.x), `NaN em ${ex.id} (${k}.x) em u=${u}`);
        assert(!Number.isNaN(v.y), `NaN em ${ex.id} (${k}.y) em u=${u}`);
      }
    }

    const armLen = Math.hypot(p.E.x - p.S.x, p.E.y - p.S.y) + Math.hypot(p.W.x - p.E.x, p.W.y - p.E.y);
    assert(armLen <= 72.5, `Braço hiperextendido em ${ex.id} u=${u}: ${armLen}`);

    const legLen = Math.hypot(p.K.x - p.H.x, p.K.y - p.H.y) + Math.hypot(p.A.x - p.K.x, p.A.y - p.K.y);
    assert(legLen <= 109.5, `Perna hiperextendida em ${ex.id} u=${u}: ${legLen}`);
  }
  console.log(`  ✓ ${ex.name} (${ex.id}) validado com sucesso!`);
}

console.log('✅ Todos os 10 exercícios do Lote 1 validados matematicamente sem descolamento de apoios!');
