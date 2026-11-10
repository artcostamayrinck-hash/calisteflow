/**
 * CalisteFlow Reference Figure Engine — Motor de Alta Fidelidade Visual
 * Reprodução 100% fiel e exata do protótipo aprovado ("Barra fixa pronada").
 * Mesmas medidas, cores, camadas, cinemática inversa (ik) e ordem de renderização.
 */

import { REFERENCE_POSES_DATA, type RawPoseDef } from './referencePoseData';

// Constantes fundamentais do protótipo
export const G = 272; // Altura da linha do chão (px)
export const L = {
  ua: 38, // upper arm (braço)
  fa: 34, // forearm (antebraço)
  th: 56, // thigh (coxa)
  sh: 52, // shin (canela)
  to: 66, // torso (tronco ombro -> quadril)
  hd: 27, // centro da cabeça a 27 px do ombro
} as const;

export const P = 'p'; // Primário / Alvo (#34D399)
export const Q = 's'; // Secundário / Sinergista (#22D3EE)

export interface Vec2 {
  x: number;
  y: number;
}

export const V = (x: number, y: number): Vec2 => ({ x, y });

export const f = (n: number): string => n.toFixed(1);

export const lp = (a: Vec2, b: Vec2, t: number): Vec2 =>
  V(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);

export const L2 = (a: number, b: number, t: number): number => a + (b - a) * t;

export const pol = (a: Vec2, g: number, l: number): Vec2 =>
  V(a.x + Math.cos(g) * l, a.y - Math.sin(g) * l);

/**
 * Cinemática Inversa (Inverse Kinematics 2D) com ângulo de dobra articular (bd)
 */
export function ik(A: Vec2, B: Vec2, l1: number, l2: number, bd: number): Vec2 {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const r = Math.hypot(dx, dy) || 1;
  const ux = dx / r;
  const uy = dy / r;
  const d = Math.min(Math.max(r, Math.abs(l1 - l2) + 0.5), l1 + l2 - 0.5);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(l1 * l1 - a * a, 0));
  return V(A.x + ux * a - uy * h * bd, A.y + uy * a + ux * h * bd);
}

/**
 * Renderiza um membro trapezoidal com extremidades arredondadas por círculos
 */
export function limb(a: Vec2, b: Vec2, w1: number, w2: number, c: string): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy) || 1;
  const nx = -dy / d;
  const ny = dx / d;
  return `<path d="M${f(a.x + (nx * w1) / 2)} ${f(a.y + (ny * w1) / 2)}L${f(
    b.x + (nx * w2) / 2
  )} ${f(b.y + (ny * w2) / 2)}L${f(b.x - (nx * w2) / 2)} ${f(
    b.y - (ny * w2) / 2
  )}L${f(a.x - (nx * w1) / 2)} ${f(a.y - (ny * w1) / 2)}Z" fill="${c}"/><circle cx="${f(
    a.x
  )}" cy="${f(a.y)}" r="${w1 / 2}" fill="${c}"/><circle cx="${f(b.x)}" cy="${f(
    b.y
  )}" r="${w2 / 2}" fill="${c}"/>`;
}

export type MuscleTuple = [
  type: 'p' | 's',
  j1: string,
  j2: string,
  t: number,
  wx: number,
  wy: number,
  off: number,
  rx: number,
  ry: number
];

/**
 * Renderiza elipse semitransparente de ativação muscular
 */
export function mus(p: Record<string, Vec2>, m: MuscleTuple, op: number): string {
  const [k, j1, j2, t, wx, wy, off, rx, ry] = m;
  const a = p[j1];
  const b = p[j2];
  if (!a || !b) return '';
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d;
  let ny = dx / d;
  if (nx * wx + ny * wy < 0) {
    nx = -nx;
    ny = -ny;
  }
  const cx = a.x + dx * t + nx * off;
  const cy = a.y + dy * t + ny * off;
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const fillColor = k === P ? '#34d399' : '#22d3ee';
  const fillOpacity = k === P ? op : op * 0.8;
  return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${rx}" ry="${ry}" transform="rotate(${f(
    angleDeg
  )} ${f(cx)} ${f(cy)})" fill="${fillColor}" fill-opacity="${f(fillOpacity)}"/>`;
}

export interface PoseJoints {
  S: Vec2; // Ombro
  W: Vec2; // Punho
  E: Vec2; // Cotovelo
  H: Vec2; // Quadril
  K: Vec2; // Joelho
  A: Vec2; // Tornozelo
  T: Vec2; // Ponta do pé
  hd: Vec2; // Centro da cabeça
  fc: Vec2; // Direção do rosto
  far: [number, number]; // Deslocamento membros de trás [dx, dy]
  pb: string; // Props de trás (SVG)
  farH?: Vec2;
  farK?: Vec2;
  farA?: Vec2;
  farT?: Vec2;
  farS?: Vec2;
  farE?: Vec2;
  farW?: Vec2;
  [key: string]: any;
}

export interface ReferenceExerciseDef {
  id: string;
  name: string;
  model: 'pull' | 'push' | 'squat' | 'bridge' | 'row' | 'plank' | 'dip' | 'lunge' | 'deadbug';
  params?: Record<string, any>;
  far?: [number, number];
  durationSeconds?: number;
  muscles: MuscleTuple[];
  mus?: MuscleTuple[];
  pose: (u: number) => PoseJoints;
}

// 1. Poses canônicas do protótipo
export const pushPose = (bh = 0) => (u: number): PoseJoints => {
  const Fa = V(60, G - 9);
  const Wy = G - bh - 5;
  const Lb = L.sh + L.th + L.to;
  const as = (y: number) => Math.asin(Math.min(1, (Fa.y - y) / Lb));
  const tU = as(Wy - 71);
  const g = L2(tU, as(Wy - 30), u);
  const S = pol(Fa, g, Lb);
  const W = V(pol(Fa, tU, Lb).x, Wy);
  return {
    S,
    W,
    E: ik(S, W, L.ua, L.fa, 1),
    H: pol(Fa, g, L.sh + L.th),
    K: pol(Fa, g, L.sh),
    A: Fa,
    T: V(Fa.x + 9, G - 1),
    hd: pol(S, g + 0.08, 27),
    fc: V(1, 0.1),
    far: [7, -3],
    pb: bh
      ? `<rect x="${f(W.x - 20)}" y="${G - bh}" width="84" height="${bh}" fill="#475569"/><path d="M${f(
          W.x - 20
        )} ${G - bh}h84l12 -9h-84z" fill="#94a3b8"/>`
      : '',
  };
};

export const squatPose = (u: number): PoseJoints => {
  const A = V(190, G - 9);
  const H = V(A.x - 6 - 52 * u, L2(A.y - 105, A.y - 50, u));
  const K = ik(H, A, L.th, L.sh, -1);
  const a = 0.12 + 0.62 * u;
  const S = V(H.x + Math.sin(a) * L.to, H.y - Math.cos(a) * L.to);
  const E = V(S.x + L.ua * 0.98, S.y + 3);
  return {
    S,
    E,
    W: V(E.x + L.fa, E.y + 1),
    H,
    K,
    A,
    T: V(A.x + 21, G - 1),
    hd: V(S.x + Math.sin(a * 0.6) * 27, S.y - Math.cos(a * 0.6) * 27),
    fc: V(1, 0.1),
    far: [5, -2],
    pb: '',
  };
};

export const pullPose = (u: number): PoseJoints => {
  const bx = 215;
  const by = 34;
  const W = V(bx, by + 5);
  const S = V(bx - 14, L2(by + 72, by + 16, u));
  const H = V(S.x - 2, S.y + L.to * 0.98);
  const K = V(H.x + 6, H.y + 55.7);
  const A = V(K.x - 44, K.y + 28);
  return {
    S,
    W,
    E: ik(S, W, L.ua, L.fa, 1),
    H,
    K,
    A,
    T: V(A.x - 4, A.y + 17),
    hd: V(S.x + 5, S.y - 27),
    fc: V(1, 0.1),
    far: [6, -2],
    pb: `<path d="M${bx} ${by}H${bx + 70}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 66}" y="${
      by - 8
    }" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`,
  };
};

export const bridgePose = (u: number): PoseJoints => {
  const S = V(95, G - 15);
  const g = ((3 + 30 * u) * Math.PI) / 180;
  const H = pol(S, g, L.to);
  const A = V(250, G - 9);
  const K = ik(H, A, L.th, L.sh, -1);
  const E = V(S.x + 37, G - 9);
  return {
    S,
    E,
    W: V(E.x + 33, G - 9),
    H,
    K,
    A,
    T: V(A.x + 17, G - 2),
    hd: V(S.x - 25, G - 14),
    fc: V(0.2, -1),
    far: [6, -2],
    pb: '',
  };
};

export const rowPose = (params?: { barX?: number; barY?: number }) => (u: number): PoseJoints => {
  const barX = params?.barX ?? 180;
  const barY = params?.barY ?? 110;
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
    S,
    W,
    E: ik(S, W, L.ua, L.fa, -1),
    H,
    K,
    A: Fa,
    T: V(Fa.x + 16, G - 18),
    hd: V(S.x - Math.cos(g) * 27, S.y - Math.sin(g) * 27),
    fc: V(-0.3, -1),
    far: [6, -2],
    pb: `<path d="M${barX - 25} ${barY}H${barX + 45}" stroke="#64748b" stroke-width="5"/><rect x="${barX + 40}" y="${barY - 8}" width="10" height="${G - barY + 8}" fill="#334155"/><circle cx="${barX}" cy="${barY}" r="5" fill="#cbd5e1"/>`,
  };
};

export const plankPose = (u: number): PoseJoints => {
  const Fa = V(60, G - 9);
  const W = V(205, G - 9);
  const E = V(175, G - 9);
  const S = V(175, G - 9 - L.ua + 2);
  const breath = Math.sin(u * 2 * Math.PI) * 1.5;
  const H = V(S.x - L.to + 2, S.y + 4 + breath);
  const K = ik(H, Fa, L.th, L.sh, 1);
  return {
    S,
    E,
    W,
    H,
    K,
    A: Fa,
    T: V(Fa.x + 9, G - 1),
    hd: V(S.x + 25, S.y - 2),
    fc: V(0.8, 0.4),
    far: [6, -2],
    pb: '',
  };
};

export const dipPose = (params?: { barY?: number }) => (u: number): PoseJoints => {
  const barY = params?.barY ?? 140;
  const W = V(195, barY);
  const S = V(W.x - 4, L2(barY - L.ua - L.fa + 4, barY - 4, u));
  const H = V(S.x - 6, S.y + L.to * 0.98);
  const K = V(H.x + 14, H.y + 48);
  const A = V(K.x - 28, K.y + 32);
  return {
    S,
    W,
    E: ik(S, W, L.ua, L.fa, 1),
    H,
    K,
    A,
    T: V(A.x - 4, A.y + 16),
    hd: V(S.x + 8, S.y - 26),
    fc: V(1, 0.1),
    far: [6, -2],
    pb: `<path d="M120 ${barY}H270" stroke="#64748b" stroke-width="5"/><rect x="135" y="${barY}" width="10" height="${G - barY}" fill="#334155"/><rect x="255" y="${barY}" width="10" height="${G - barY}" fill="#334155"/>`,
  };
};

export const lungePose = (u: number): PoseJoints => {
  const frontA = V(208, G - 9);
  const backA = V(125, G - 9);
  const H = V(168, L2(G - 9 - 88, G - 9 - 46, u));
  const K = ik(H, frontA, L.th, L.sh, -1);
  const S = V(H.x + 2, H.y - L.to);
  const E = V(S.x - 4, S.y + L.ua * 0.95);
  const W = V(H.x - 2, H.y - 2);

  // Perna de trás no plano de fundo apoiada no solo
  const farH = V(H.x - 4, H.y);
  const farK = ik(farH, backA, L.th, L.sh, 1);
  const farT = V(backA.x - 8, G - 1);

  return {
    S,
    E,
    W,
    H,
    K,
    A: frontA,
    T: V(frontA.x + 18, G - 1),
    hd: V(S.x + 2, S.y - 27),
    fc: V(1, 0.05),
    far: [-8, 2],
    pb: '',
    farH,
    farK,
    farA: backA,
    farT,
  };
};

export const deadbugPose = (u: number): PoseJoints => {
  const S = V(155, G - 14);
  const H = V(221, G - 14);
  const hd = V(128, G - 14);

  // Membros próximos (em movimento)
  const armExtAngle = L2(Math.PI / 2, Math.PI * 0.95, u);
  const legExtAngle = L2(Math.PI / 2, Math.PI * 0.15, u);
  const E = V(S.x - Math.cos(armExtAngle) * L.ua, S.y - Math.sin(armExtAngle) * L.ua);
  const W = V(E.x - Math.cos(armExtAngle) * L.fa, E.y - Math.sin(armExtAngle) * L.fa);
  const K = V(H.x + Math.cos(legExtAngle) * L.th, H.y - Math.sin(legExtAngle) * L.th);
  const A = V(K.x + 10, K.y - L.sh * 0.85);

  // Membros de trás (posição isométrica de controle a 90°)
  const farArmAngle = Math.PI / 2;
  const farLegAngle = Math.PI / 2;
  const farS = V(S.x + 5, S.y - 4);
  const farE = V(farS.x - Math.cos(farArmAngle) * L.ua, farS.y - Math.sin(farArmAngle) * L.ua);
  const farW = V(farE.x - Math.cos(farArmAngle) * L.fa, farE.y - Math.sin(farArmAngle) * L.fa);
  const farH = V(H.x + 5, H.y - 4);
  const farK = V(farH.x + Math.cos(farLegAngle) * L.th, farH.y - Math.sin(farLegAngle) * L.th);
  const farA = V(farK.x + 10, farK.y - L.sh * 0.85);

  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x + 12, A.y - 4),
    hd,
    fc: V(0.1, -1),
    far: [5, -4],
    pb: '',
    farH,
    farK,
    farA,
    farT: V(farA.x + 12, farA.y - 4),
    farS,
    farE,
    farW,
  };
};

// Map de modelos instanciáveis a partir dos dados JSON
const MODEL_FACTORIES: Record<string, (params?: any) => (u: number) => PoseJoints> = {
  pull: () => pullPose,
  push: (params?: any) => pushPose(params?.benchHeight ?? 0),
  squat: () => squatPose,
  bridge: () => bridgePose,
  row: (params?: any) => rowPose(params),
  plank: () => plankPose,
  dip: (params?: any) => dipPose(params),
  lunge: () => lungePose,
  deadbug: () => deadbugPose,
};

/**
 * Carrega a definição do exercício a partir do catálogo JSON
 */
export function getReferenceExerciseDef(id: string): ReferenceExerciseDef {
  const item: RawPoseDef | undefined = REFERENCE_POSES_DATA[id];

  if (item) {
    const factory = MODEL_FACTORIES[item.model] || MODEL_FACTORIES.pull;
    const poseFn = factory(item.params);
    return {
      id: item.id,
      name: item.name,
      model: item.model,
      params: item.params,
      far: item.far,
      durationSeconds: item.durationSeconds || 3.6,
      muscles: item.muscles as MuscleTuple[],
      mus: item.muscles as MuscleTuple[],
      pose: poseFn,
    };
  }

  // Fallback baseado na família padrão caso ID não conste diretamente
  if (id.includes('squat') || id.includes('agachamento') || id.includes('afundo') || id.includes('pistol')) {
    return {
      id,
      name: 'Agachamento',
      model: 'squat',
      durationSeconds: 3.8,
      muscles: REFERENCE_POSES_DATA.squat.muscles,
      mus: REFERENCE_POSES_DATA.squat.muscles,
      pose: squatPose,
    };
  }

  if (id.includes('bridge') || id.includes('ponte') || id.includes('gluteo')) {
    return {
      id,
      name: 'Ponte de Glúteo',
      model: 'bridge',
      durationSeconds: 3.5,
      muscles: REFERENCE_POSES_DATA.bridge.muscles,
      mus: REFERENCE_POSES_DATA.bridge.muscles,
      pose: bridgePose,
    };
  }

  if (id.includes('incline') || id.includes('banco') || id.includes('inclinada')) {
    return {
      id,
      name: 'Flexão Inclinada',
      model: 'push',
      params: { benchHeight: 48 },
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA.incline_pushup.muscles,
      mus: REFERENCE_POSES_DATA.incline_pushup.muscles,
      pose: pushPose(48),
    };
  }

  if (id.includes('pushup') || id.includes('flexao')) {
    return {
      id,
      name: 'Flexão Tradicional',
      model: 'push',
      params: { benchHeight: 0 },
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA.pushup.muscles,
      mus: REFERENCE_POSES_DATA.pushup.muscles,
      pose: pushPose(0),
    };
  }

  // Padrão canônico do protótipo (Barra fixa)
  return {
    id,
    name: 'Barra Fixa',
    model: 'pull',
    params: { barX: 215, barY: 34 },
    durationSeconds: 3.6,
    muscles: REFERENCE_POSES_DATA.pullup.muscles,
    mus: REFERENCE_POSES_DATA.pullup.muscles,
    pose: pullPose,
  };
}

/**
 * Desenha a cena SVG 400x300 idêntica ao protótipo aprovado
 */
export function drawReferenceSvg(ex: ReferenceExerciseDef, u: number): string {
  const p = ex.pose(u);
  // Sanitiza id para identificador de gradiente SVG válido
  const safeId = ex.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const s = (q: Vec2) => V(q.x + p.far[0], q.y + p.far[1]);
  const op = 0.35 + 0.45 * u;
  const sk = `url(#sk${safeId})`;
  const sf = `url(#sf${safeId})`;
  const hd = p.hd;
  const fc = p.fc;
  const fl = Math.hypot(fc.x, fc.y) || 1;

  const leg = (H: Vec2, K: Vec2, A: Vec2, T: Vec2, c: string) =>
    limb(H, K, 24, 17, c) +
    limb(K, A, 16, 10, c) +
    limb(A, T, 9, 7, '#e2e8f0') +
    limb(H, lp(H, K, 0.5), 26, 24, '#1e293b');

  const arm = (S: Vec2, E: Vec2, W: Vec2, c: string) =>
    limb(S, E, 14, 11, c) +
    limb(E, W, 11, 8, c) +
    `<circle cx="${f(W.x)}" cy="${f(W.y)}" r="5.5" fill="${c}"/>`;

  return (
    `<defs>` +
    `<linearGradient id="sk${safeId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="300"><stop offset="0" stop-color="#f3c4a6"/><stop offset="1" stop-color="#b87a5b"/></linearGradient>` +
    `<linearGradient id="sf${safeId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="300"><stop offset="0" stop-color="#c99577"/><stop offset="1" stop-color="#8a5a43"/></linearGradient>` +
    `<linearGradient id="bg${safeId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1b33"/><stop offset="1" stop-color="#050b18"/></linearGradient>` +
    `</defs>` +
    `<rect width="400" height="300" fill="url(#bg${safeId})"/>` +
    `<rect y="${G}" width="400" height="${300 - G}" fill="#0a1222"/>` +
    `<path d="M0 ${G}H400" stroke="#1f3b5c"/>` +
    `<ellipse cx="200" cy="${G + 4}" rx="140" ry="6" fill="#000" fill-opacity=".35"/>` +
    p.pb +
    leg(p.farH ?? s(p.H), p.farK ?? s(p.K), p.farA ?? s(p.A), p.farT ?? s(p.T), sf) +
    arm(p.farS ?? s(p.S), p.farE ?? s(p.E), p.farW ?? s(p.W), sf) +
    limb(p.S, p.H, 31, 26, sk) +
    `<circle cx="${f(p.H.x)}" cy="${f(p.H.y)}" r="13.5" fill="#1e293b"/>` +
    limb(p.S, hd, 10, 9, sk) +
    `<circle cx="${f(hd.x)}" cy="${f(hd.y)}" r="13" fill="#1f2937"/><circle cx="${f(
      hd.x + (fc.x / fl) * 3
    )}" cy="${f(hd.y + (fc.y / fl) * 3)}" r="11" fill="${sk}"/>` +
    leg(p.H, p.K, p.A, p.T, sk) +
    arm(p.S, p.E, p.W, sk) +
    (ex.muscles || ex.mus || []).map((m: MuscleTuple) => mus(p, m, op)).join('')
  );
}

/**
 * Calcula o progresso senoidal do esforço u in [0..1]
 * u = 0.5 - 0.5 * cos(2π * t / T)
 * u = 0: posição inicial / neutra
 * u = 1: pico de contração concêntrica ou isometria
 */
export function calculateEffortU(tSeconds: number, durationSeconds = 3.6): number {
  const norm = (tSeconds % durationSeconds) / durationSeconds;
  return 0.5 - 0.5 * Math.cos(2 * Math.PI * norm);
}
