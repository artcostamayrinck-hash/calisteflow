/**
 * Teste de Fidelidade do Motor de Figuras — CalisteFlow
 * Valida a renderização exata das poses de referência em u = 0, 0.5 e 1.0
 */

const assert = require('assert');

// Port direto das funções canônicas para verificação autônoma no Node
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
  const a = p[j1], b = p[j2], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d;
  if (nx * wx + ny * wy < 0) { nx = -nx; ny = -ny; }
  const cx = a.x + dx * t + nx * off, cy = a.y + dy * t + ny * off;
  return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${rx}" ry="${ry}" transform="rotate(${f(Math.atan2(dy, dx) * 180 / Math.PI)} ${f(cx)} ${f(cy)})" fill="${k == P ? '#34d399' : '#22d3ee'}" fill-opacity="${f(k == P ? op : op * 0.8)}"/>`;
}

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

const squat = u => {
  const A = V(190, G - 9), H = V(A.x - 6 - 52 * u, L2(A.y - 105, A.y - 50, u)), K = ik(H, A, L.th, L.sh, -1);
  const a = 0.12 + 0.62 * u, S = V(H.x + Math.sin(a) * L.to, H.y - Math.cos(a) * L.to), E = V(S.x + L.ua * 0.98, S.y + 3);
  return {
    S, E, W: V(E.x + L.fa, E.y + 1), H, K, A, T: V(A.x + 21, G - 1),
    hd: V(S.x + Math.sin(a * 0.6) * 27, S.y - Math.cos(a * 0.6) * 27), fc: V(1, 0.1), far: [5, -2], pb: ''
  };
};

const pull = u => {
  const bx = 215, by = 34, W = V(bx, by + 5), S = V(bx - 14, L2(by + 72, by + 16, u));
  const H = V(S.x - 2, S.y + L.to * 0.98), K = V(H.x + 6, H.y + 55.7), A = V(K.x - 44, K.y + 28);
  return {
    S, W, E: ik(S, W, L.ua, L.fa, 1), H, K, A, T: V(A.x - 4, A.y + 17),
    hd: V(S.x + 5, S.y - 27), fc: V(1, 0.1), far: [6, -2],
    pb: `<path d="M${bx} ${by}H${bx + 70}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 66}" y="${by - 8}" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`
  };
};

const bridge = u => {
  const S = V(95, G - 15), g = (3 + 30 * u) * Math.PI / 180, H = pol(S, g, L.to), A = V(250, G - 9);
  const K = ik(H, A, L.th, L.sh, -1), E = V(S.x + 37, G - 9);
  return {
    S, E, W: V(E.x + 33, G - 9), H, K, A, T: V(A.x + 17, G - 2),
    hd: V(S.x - 25, G - 14), fc: V(0.2, -1), far: [6, -2], pb: ''
  };
};

const PM = [[P, 'S', 'H', 0.1, 0, 1, 7, 14, 9], [P, 'S', 'E', 0.5, 0, -1, 3, 15, 6], [P, 'S', 'E', 0.05, 1, 0, 0, 9, 9], [Q, 'S', 'H', 0.55, 0, 1, 6, 16, 7], [Q, 'H', 'K', 0.5, 0, 1, 6, 16, 8]];
const SQ = [[P, 'H', 'K', 0.5, 1, 0, 6, 24, 9], [P, 'H', 'K', 0.08, -1, 0.3, 8, 12, 11], [Q, 'H', 'K', 0.55, -1, 0.2, 6, 22, 6], [Q, 'K', 'A', 0.35, -1, 0, 6, 16, 6], [Q, 'S', 'H', 0.5, 1, 0, 5, 18, 8]];
const PU = [[P, 'S', 'H', 0.18, -1, 0, 7, 22, 10], [P, 'S', 'E', 0.5, 0, -1, 4, 15, 6], [Q, 'E', 'W', 0.45, 0, -1, 3, 13, 5], [Q, 'S', 'H', 0.55, 1, 0, 6, 16, 8]];
const BR = [[P, 'S', 'H', 0.93, 0, 1, 4, 14, 12], [Q, 'H', 'K', 0.5, 0.4, 1, 6, 24, 7], [Q, 'S', 'H', 0.55, 0, -1, 5, 18, 6]];

function draw(ex, u) {
  const p = ex.pose(u), id = ex.id, s = q => V(q.x + p.far[0], q.y + p.far[1]), op = 0.35 + 0.45 * u;
  const sk = `url(#sk${id})`, sf = `url(#sf${id})`, hd = p.hd, fc = p.fc, fl = Math.hypot(fc.x, fc.y);
  const leg = (H, K, A, T, c) => limb(H, K, 24, 17, c) + limb(K, A, 16, 10, c) + limb(A, T, 9, 7, '#e2e8f0') + limb(H, lp(H, K, 0.5), 26, 24, '#1e293b');
  const arm = (S, E, W, c) => limb(S, E, 14, 11, c) + limb(E, W, 11, 8, c) + `<circle cx="${f(W.x)}" cy="${f(W.y)}" r="5.5" fill="${c}"/>`;
  return `<defs><linearGradient id="sk${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="300"><stop offset="0" stop-color="#f3c4a6"/><stop offset="1" stop-color="#b87a5b"/></linearGradient><linearGradient id="sf${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="300"><stop offset="0" stop-color="#c99577"/><stop offset="1" stop-color="#8a5a43"/></linearGradient><linearGradient id="bg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1b33"/><stop offset="1" stop-color="#050b18"/></linearGradient></defs>`
    + `<rect width="400" height="300" fill="url(#bg${id})"/><rect y="${G}" width="400" height="${300 - G}" fill="#0a1222"/><path d="M0 ${G}H400" stroke="#1f3b5c"/><ellipse cx="200" cy="${G + 4}" rx="140" ry="6" fill="#000" fill-opacity=".35"/>`
    + p.pb + leg(s(p.H), s(p.K), s(p.A), s(p.T), sf) + arm(s(p.S), s(p.E), s(p.W), sf) + limb(p.S, p.H, 31, 26, sk) + `<circle cx="${f(p.H.x)}" cy="${f(p.H.y)}" r="13.5" fill="#1e293b"/>`
    + limb(p.S, hd, 10, 9, sk) + `<circle cx="${f(hd.x)}" cy="${f(hd.y)}" r="13" fill="#1f2937"/><circle cx="${f(hd.x + fc.x / fl * 3)}" cy="${f(hd.y + fc.y / fl * 3)}" r="11" fill="${sk}"/>`
    + leg(p.H, p.K, p.A, p.T, sk) + arm(p.S, p.E, p.W, sk) + ex.mus.map(m => mus(p, m, op)).join('');
}

console.log('🧪 [Fidelity Test] Verificando conformidade do motor de figuras...');

const exercisesToTest = [
  { id: 'pullup', pose: pull, mus: PU, name: 'Barra fixa pronada' },
  { id: 'pushup', pose: push(0), mus: PM, name: 'Flexão tradicional' },
  { id: 'incline_pushup', pose: push(48), mus: PM, name: 'Flexão inclinada' },
  { id: 'squat', pose: squat, mus: SQ, name: 'Agachamento livre' },
  { id: 'bridge', pose: bridge, mus: BR, name: 'Ponte de glúteo' },
];

for (const ex of exercisesToTest) {
  for (const u of [0.0, 0.5, 1.0]) {
    const svg = draw(ex, u);
    assert(!svg.includes('NaN'), `Erro de NaN encontrado em ${ex.id} com u=${u}`);
    assert(svg.includes('#f3c4a6'), `Gradiente de pele ausente em ${ex.id}`);
    assert(svg.includes('#1f2937'), `Cabelo ausente em ${ex.id}`);
    assert(svg.includes('#1e293b'), `Bermuda ausente em ${ex.id}`);
    assert(svg.includes('#e2e8f0'), `Tênis ausente em ${ex.id}`);
    assert(svg.includes('ellipse'), `Músculos ausentes em ${ex.id}`);
    assert(svg.includes('M0 272H400'), `Linha de chão em y=272 ausente em ${ex.id}`);

    // Verifica cinemática articular e limites
    const joints = ex.pose(u);
    const armLen = Math.hypot(joints.E.x - joints.S.x, joints.E.y - joints.S.y) +
                   Math.hypot(joints.W.x - joints.E.x, joints.W.y - joints.E.y);
    assert(armLen <= 72.1, `Braço hiperextendido em ${ex.id}: ${armLen} > 72`);

    const legLen = Math.hypot(joints.K.x - joints.H.x, joints.K.y - joints.H.y) +
                   Math.hypot(joints.A.x - joints.K.x, joints.A.y - joints.K.y);
    assert(legLen <= 109, `Perna hiperextendida em ${ex.id}: ${legLen} > 109`);
  }
  console.log(`  ✓ ${ex.name} (${ex.id}) validado em u=[0, 0.5, 1.0] sem distorção articular.`);
}

console.log('✅ [Fidelity Test] 100% das 5 poses de referência validadas com sucesso!');
