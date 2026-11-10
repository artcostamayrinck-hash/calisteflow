/**
 * CalisteFlow Reference Figure Engine — Motor de Alta Fidelidade Visual
 * Reprodução 100% fiel e exata do protótipo aprovado ("Barra fixa pronada").
 * Mesmas medidas, cores, camadas, cinemática inversa (ik) e ordem de renderização.
 */

import { REFERENCE_POSES_DATA, type RawPoseDef } from './referencePoseData.ts';

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
  model:
    | 'pull'
    | 'push'
    | 'squat'
    | 'bridge'
    | 'row'
    | 'plank'
    | 'dip'
    | 'lunge'
    | 'deadbug'
    | 'pike'
    | 'handstand'
    | 'pistol'
    | 'bulgarian'
    | 'calf'
    | 'hollow'
    | 'crunch'
    | 'superman'
    | 'bird_dog'
    | 'side_plank'
    | 'hanging_core'
    | 'dragon_flag'
    | 'ab_wheel'
    | 'mountain_climber'
    | 'nordic_curl'
    | 'cat_cow'
    | 'standing_mobility'
    | 'deep_squat_hold'
    | 'world_greatest_stretch'
    | 'seated_hip_mobility'
    | 'child_pose'
    | 'standing_stretch'
    | 'lsit_skill'
    | 'arm_balance'
    | 'planche_skill'
    | 'front_lever_skill'
    | 'back_lever_skill'
    | 'skin_the_cat'
    | 'human_flag'
    | 'kick_up_handstand';
  params?: Record<string, any>;
  far?: [number, number];
  durationSeconds?: number;
  muscles: MuscleTuple[];
  mus?: MuscleTuple[];
  pose: (u: number) => PoseJoints;
}

// 1. Poses canônicas do protótipo e modelos paramétricos com Cinemática Anatômica Estrita
export const pushPose = (
  params: number | { benchHeight?: number; feetHeight?: number; isKnee?: boolean; handsFarBack?: boolean } = 0
) => (u: number): PoseJoints => {
  const bh = typeof params === 'number' ? params : params?.benchHeight ?? 0;
  const fh = typeof params === 'object' ? params?.feetHeight ?? 0 : 0;
  const isKnee = typeof params === 'object' ? params?.isKnee ?? false : false;
  const handsFarBack = typeof params === 'object' ? params?.handsFarBack ?? false : false;
  const handOffset = handsFarBack ? -16 : 0;
  const topH = handsFarBack ? 62 : 71;

  if (isKnee) {
    const K = V(85, G - 9);
    const A = pol(K, Math.PI - 0.45, L.sh);
    const T = V(A.x - 10, A.y - 8);
    const Wy = G - bh - 5;
    const Lb = L.to + L.th;
    const as = (y: number) => Math.asin(Math.min(1, Math.max(-1, (K.y - y) / Lb)));
    const tU = as(Wy - 66);
    const g = L2(tU, as(Wy - 28), u);
    const S = pol(K, g, Lb);
    const W = V(pol(K, tU, Lb).x + handOffset, Wy);
    const H = pol(K, g, L.th);
    return {
      S,
      W,
      E: ik(S, W, L.ua, L.fa, 1),
      H,
      K,
      A,
      T,
      hd: pol(S, g + 0.08, L.hd),
      fc: V(1, 0.1),
      far: [7, -3],
      pb: bh
        ? `<rect x="${f(W.x - 20)}" y="${G - bh}" width="84" height="${bh}" fill="#475569"/><path d="M${f(
            W.x - 20
          )} ${G - bh}h84l12 -9h-84z" fill="#94a3b8"/>`
        : '',
    };
  }

  const Fa = V(60, G - 9 - fh);
  const Wy = G - bh - 5;
  const Lb = L.sh + L.th + L.to;
  const as = (y: number) => Math.asin(Math.min(1, Math.max(-1, (Fa.y - y) / Lb)));
  const tU = as(Wy - topH);
  const g = L2(tU, as(Wy - 30), u);
  const S = pol(Fa, g, Lb);
  const W = V(pol(Fa, tU, Lb).x + handOffset, Wy);
  return {
    S,
    W,
    E: ik(S, W, L.ua, L.fa, 1),
    H: pol(Fa, g, L.sh + L.th),
    K: pol(Fa, g, L.sh),
    A: Fa,
    T: V(Fa.x + 9, G - 1 - fh),
    hd: pol(S, g + 0.08, L.hd),
    fc: V(1, 0.1),
    far: [7, -3],
    pb:
      (bh
        ? `<rect x="${f(W.x - 20)}" y="${G - bh}" width="84" height="${bh}" fill="#475569"/><path d="M${f(
            W.x - 20
          )} ${G - bh}h84l12 -9h-84z" fill="#94a3b8"/>`
        : '') +
      (fh ? `<rect x="35" y="${G - fh}" width="40" height="${fh}" fill="#475569"/>` : ''),
  };
};

export const squatPose = (params?: { isBox?: boolean; isWallSit?: boolean }) => (u: number): PoseJoints => {
  const isBox = params?.isBox ?? false;
  const isWallSit = params?.isWallSit ?? false;
  const A = V(190, G - 9);

  if (isWallSit) {
    const H = V(145, G - 9 - L.sh);
    const S = V(145, H.y - L.to);
    const K = V(H.x + L.th, H.y);
    const footA = V(K.x, G - 9);
    const breath = Math.sin(u * 2 * Math.PI) * 1.5;
    const currentS = V(S.x, S.y + breath);
    const currentH = V(H.x, H.y + breath);
    const W = V(K.x - 14, K.y - 8 + breath);
    return {
      S: currentS,
      E: ik(currentS, W, L.ua, L.fa, 1),
      W,
      H: currentH,
      K,
      A: footA,
      T: V(footA.x + 18, G - 1),
      hd: V(S.x, S.y - L.hd + breath),
      fc: V(1, 0.05),
      far: [5, -2],
      pb: `<path d="M130 50V${G}" stroke="#334155" stroke-width="6"/>`,
    };
  }

  const H = V(A.x - 6 - 52 * u, L2(A.y - 105, A.y - 50, u));
  const K = ik(H, A, L.th, L.sh, -1);
  const a = 0.12 + 0.60 * u;
  const S = V(H.x + Math.sin(a) * L.to, H.y - Math.cos(a) * L.to);
  const armAngle = 0.08 * (1 - u);
  const E = V(S.x + Math.cos(armAngle) * L.ua, S.y - Math.sin(armAngle) * L.ua);
  return {
    S,
    E,
    W: V(E.x + Math.cos(armAngle) * L.fa, E.y - Math.sin(armAngle) * L.fa),
    H,
    K,
    A,
    T: V(A.x + 21, G - 1),
    hd: V(S.x + Math.sin(a * 0.6) * L.hd, S.y - Math.cos(a * 0.6) * L.hd),
    fc: V(1, 0.1),
    far: [5, -2],
    pb: isBox
      ? `<rect x="105" y="${G - 52}" width="48" height="52" fill="#475569"/><path d="M105 ${
          G - 52
        }h48l8 -6h-48z" fill="#94a3b8"/>`
      : '',
  };
};

export const pullPose = (params?: { barX?: number; barY?: number; isDeadHang?: boolean; isLsit?: boolean } | number) => (
  u: number
): PoseJoints => {
  const pObj = typeof params === 'object' ? params : undefined;
  const bx = pObj?.barX ?? 215;
  const by = pObj?.barY ?? 34;
  const isDeadHang = pObj?.isDeadHang ?? false;
  const isLsit = pObj?.isLsit ?? false;
  const W = V(bx, by + 5);

  if (isDeadHang) {
    const S = V(bx - 14, L2(by + 71, by + 58, u));
    const H = V(S.x, S.y + L.to);
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
      hd: V(S.x, S.y - L.hd),
      fc: V(1, 0.1),
      far: [6, -2],
      pb: `<path d="M${bx} ${by}H${bx + 70}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 66}" y="${
        by - 8
      }" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`,
    };
  }

  const S = V(bx - 14, L2(by + 72, by + 16, u));
  const H = V(S.x, S.y + L.to);

  if (isLsit) {
    const K = V(H.x + L.th, H.y);
    const A = V(K.x + L.sh, K.y);
    return {
      S,
      W,
      E: ik(S, W, L.ua, L.fa, 1),
      H,
      K,
      A,
      T: V(A.x + 14, A.y),
      hd: V(S.x, S.y - L.hd),
      fc: V(1, 0.1),
      far: [6, -2],
      pb: `<path d="M${bx} ${by}H${bx + 70}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 66}" y="${
        by - 8
      }" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`,
    };
  }

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
    hd: V(S.x, S.y - L.hd),
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
  const E = V(S.x + L.ua, G - 9);
  return {
    S,
    E,
    W: V(E.x + L.fa, G - 9),
    H,
    K,
    A,
    T: V(A.x + 17, G - 2),
    hd: V(S.x - L.hd, G - 14),
    fc: V(0.2, -1),
    far: [6, -2],
    pb: '',
  };
};

export const rowPose = (params?: { barX?: number; barY?: number; isKnees?: boolean }) => (u: number): PoseJoints => {
  const barX = params?.barX ?? 180;
  const barY = params?.barY ?? 110;
  const isKnees = params?.isKnees ?? false;
  const W = V(barX, barY + 5);

  if (isKnees) {
    const A = V(255, G - 9);
    const S = V(L2(150, 175, u), L2(barY + 65, barY + 25, u));
    const E = ik(S, W, L.ua, L.fa, -1);
    const torsoAngle = L2(0.25, 0.52, u);
    const H = pol(S, -torsoAngle, L.to);
    const K = ik(H, A, L.th, L.sh, -1);
    return {
      S,
      W,
      E,
      H,
      K,
      A,
      T: V(A.x + 16, G - 1),
      hd: pol(S, Math.PI + torsoAngle, L.hd),
      fc: V(-0.3, -1),
      far: [6, -2],
      pb: `<path d="M${barX - 25} ${barY}H${barX + 45}" stroke="#64748b" stroke-width="5"/><rect x="${
        barX + 40
      }" y="${barY - 8}" width="10" height="${G - barY + 8}" fill="#334155"/><circle cx="${barX}" cy="${barY}" r="5" fill="#cbd5e1"/>`,
    };
  }

  const Fa = V(295, G - 9);
  const Lb = L.to + L.th + L.sh;
  const angleBottom = Math.asin(Math.min(1, (Fa.y - (barY + 65)) / Lb));
  const angleTop = Math.asin(Math.min(1, (Fa.y - (barY + 25)) / Lb));
  const g = L2(angleBottom, angleTop, u);
  const S = pol(Fa, Math.PI - g, Lb);
  const H = pol(Fa, Math.PI - g, L.th + L.sh);
  const K = pol(Fa, Math.PI - g, L.sh);
  return {
    S,
    W,
    E: ik(S, W, L.ua, L.fa, -1),
    H,
    K,
    A: Fa,
    T: V(Fa.x + 16, G - 18),
    hd: pol(S, Math.PI - g, L.hd),
    fc: V(-0.3, -1),
    far: [6, -2],
    pb: `<path d="M${barX - 25} ${barY}H${barX + 45}" stroke="#64748b" stroke-width="5"/><rect x="${
      barX + 40
    }" y="${barY - 8}" width="10" height="${G - barY + 8}" fill="#334155"/><circle cx="${barX}" cy="${barY}" r="5" fill="#cbd5e1"/>`,
  };
};

export const plankPose = (u: number): PoseJoints => {
  const W = V(210, G - 9);
  const E = V(W.x - L.fa, G - 9);
  const S = V(E.x, E.y - L.ua);
  const breath = Math.sin(u * 2 * Math.PI) * 1.5;
  const Lb = L.to + L.th + L.sh;
  const angle = Math.asin(Math.min(1, Math.max(0, (G - 9 - S.y) / Lb)));
  const Fa = V(S.x - Math.cos(angle) * Lb, G - 9);
  const H = pol(Fa, angle, L.sh + L.th);
  H.y += breath;
  const K = pol(Fa, angle, L.sh);
  return {
    S: V(S.x, S.y + breath),
    E,
    W,
    H,
    K,
    A: Fa,
    T: V(Fa.x + 12, G - 1),
    hd: pol(S, 0.05, L.hd),
    fc: V(0.8, 0.4),
    far: [6, -2],
    pb: '',
  };
};

export const dipPose = (params?: { barY?: number; isBench?: boolean }) => (u: number): PoseJoints => {
  const isBench = params?.isBench ?? false;
  if (isBench) {
    const benchY = 195;
    const W = V(125, benchY);
    const S = V(150, L2(benchY - 44, benchY - 8, u));
    const H = V(S.x, S.y + L.to);
    const A = V(235, G - 9);
    const K = ik(H, A, L.th, L.sh, -1);
    return {
      S,
      W,
      E: ik(S, W, L.ua, L.fa, -1),
      H,
      K,
      A,
      T: V(A.x + 16, G - 1),
      hd: V(S.x, S.y - L.hd),
      fc: V(1, 0.1),
      far: [6, -2],
      pb: `<rect x="85" y="${benchY}" width="45" height="${G - benchY}" fill="#475569"/><path d="M85 ${benchY}h45l8 -6h-45z" fill="#94a3b8"/>`,
    };
  }

  const barY = params?.barY ?? 140;
  const W = V(195, barY);
  const S = V(W.x - 4, L2(barY - L.ua - L.fa + 4, barY - 24, u));
  const H = V(S.x - 4, S.y + L.to);
  const K = pol(H, -Math.PI / 2 + 0.35, L.th);
  const A = pol(K, -Math.PI / 2 - 0.75, L.sh);
  return {
    S,
    W,
    E: ik(S, W, L.ua, L.fa, 1),
    H,
    K,
    A,
    T: V(A.x - 6, A.y + 14),
    hd: V(S.x + 4, S.y - L.hd),
    fc: V(1, 0.1),
    far: [6, -2],
    pb: `<path d="M120 ${barY}H270" stroke="#64748b" stroke-width="5"/><rect x="135" y="${barY}" width="10" height="${
      G - barY
    }" fill="#334155"/><rect x="255" y="${barY}" width="10" height="${G - barY}" fill="#334155"/>`,
  };
};

export const pikePose = (params?: { feetHeight?: number }) => (u: number): PoseJoints => {
  const fh = params?.feetHeight ?? 0;
  const A = V(122, G - 9 - fh);
  const H = V(165, G - 9 - fh * 0.4 - 85);
  const K = ik(H, A, L.th, L.sh, 1);
  const angle = fh > 0 ? L2(-Math.PI / 2 - 0.15, -Math.PI / 2 - 0.45, u) : L2(-Math.PI / 2 - 0.35, -Math.PI / 2 - 0.65, u);
  const S = pol(H, angle, L.to);
  const W = V(fh > 0 ? S.x + 12 : 178, G - 5);
  return {
    S,
    W,
    E: ik(S, W, L.ua, L.fa, 1),
    H,
    K,
    A,
    T: V(A.x + 8, G - 1 - fh),
    hd: pol(S, angle - 0.15, L.hd),
    fc: V(0.5, 1),
    far: [6, -2],
    pb: fh ? `<rect x="95" y="${G - fh}" width="45" height="${fh}" fill="#475569"/>` : '',
  };
};

export const handstandPose = (params?: { isWall?: boolean }) => (u: number): PoseJoints => {
  const isWall = params?.isWall ?? false;
  const W = V(195, G - 5);
  const S = V(195, L2(G - 5 - 68, G - 5 - 28, u));
  const H = V(195, S.y - L.to);
  const K = V(195, H.y - L.th);
  const A = V(195, K.y - L.sh);
  const T = V(195, A.y - 14);
  return {
    S,
    W,
    E: ik(S, W, L.ua, L.fa, 1),
    H,
    K,
    A,
    T,
    hd: V(S.x, S.y + L.hd),
    fc: V(1, 0),
    far: [6, 0],
    pb: isWall ? `<path d="M165 0V${G}" stroke="#334155" stroke-width="6"/>` : '',
  };
};

export const pistolPose = (u: number): PoseJoints => {
  const A = V(200, G - 9);
  const H = V(L2(A.x, A.x - 38, u), L2(A.y - 105, A.y - 48, u));
  const K = ik(H, A, L.th, L.sh, -1);
  const S = pol(H, Math.PI / 2 - 0.35, L.to);
  const E = V(S.x + L.ua, S.y);
  const W = V(E.x + L.fa, E.y);

  // Perna contralateral estendida para frente
  const farH = V(H.x - 4, H.y);
  const farAngle = L2(Math.PI * 0.45, Math.PI * 0.05, u);
  const farK = pol(farH, farAngle, L.th);
  const farA = pol(farK, farAngle, L.sh);
  const farT = V(farA.x + 14, farA.y);

  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x + 20, G - 1),
    hd: pol(S, Math.PI / 2 - 0.2, L.hd),
    fc: V(1, 0.1),
    far: [-6, 0],
    pb: '',
    farH,
    farK,
    farA,
    farT,
  };
};

export const bulgarianPose = (u: number): PoseJoints => {
  const frontA = V(215, G - 9);
  const benchY = G - 48;
  const backA = V(115, benchY);
  const H = V(175, L2(G - 9 - 88, G - 9 - 48, u));
  const K = ik(H, frontA, L.th, L.sh, -1);
  const S = V(H.x, H.y - L.to);
  const W = V(H.x + 8, H.y - 8);
  const E = ik(S, W, L.ua, L.fa, -1);

  const farH = V(H.x - 4, H.y);
  const farK = ik(farH, backA, L.th, L.sh, 1);
  const farT = V(backA.x - 10, benchY);

  return {
    S,
    E,
    W,
    H,
    K,
    A: frontA,
    T: V(frontA.x + 18, G - 1),
    hd: V(S.x, S.y - L.hd),
    fc: V(1, 0.05),
    far: [-8, 2],
    pb: `<rect x="75" y="${benchY}" width="45" height="48" fill="#475569"/><path d="M75 ${benchY}h45l8 -6h-45z" fill="#94a3b8"/>`,
    farH,
    farK,
    farA: backA,
    farT,
  };
};

export const calfRaisePose = (params?: { isStep?: boolean }) => (u: number): PoseJoints => {
  const isStep = params?.isStep ?? true;
  const stepH = isStep ? 14 : 0;
  const stepY = G - stepH;
  const T = V(200, stepY - 1);
  const Ay = L2(stepY - 4, stepY - 26, u);
  const A = V(192, Ay);
  const H = V(192, A.y - L.sh - L.th);
  const K = V(192, A.y - L.sh);
  const S = V(H.x, H.y - L.to);
  const W = V(H.x + 4, H.y - 6);
  const E = ik(S, W, L.ua, L.fa, -1);

  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T,
    hd: V(S.x, S.y - L.hd),
    fc: V(1, 0.05),
    far: [5, -2],
    pb: isStep
      ? `<rect x="160" y="${stepY}" width="75" height="${stepH}" fill="#475569"/><path d="M160 ${stepY}h75l8 -6h-75z" fill="#94a3b8"/>`
      : '',
  };
};

export const lungePose = (u: number): PoseJoints => {
  const frontA = V(208, G - 9);
  const backA = V(125, G - 9);
  const H = V(168, L2(G - 9 - 88, G - 9 - 46, u));
  const K = ik(H, frontA, L.th, L.sh, -1);
  const S = V(H.x, H.y - L.to);
  const W = V(H.x + 8, H.y - 8);
  const E = ik(S, W, L.ua, L.fa, -1);

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
    hd: V(S.x, S.y - L.hd),
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
  const H = V(S.x + L.to, G - 14);
  const hd = V(S.x - L.hd, G - 14);

  // Membros do lado próximo: Braço estende para trás, Perna fica estável em mesa a 90°
  const armExtAngle = L2(Math.PI / 2, Math.PI * 0.95, u);
  const E = pol(S, armExtAngle, L.ua);
  const W = pol(E, armExtAngle, L.fa);
  const K = pol(H, Math.PI / 2, L.th);
  const A = pol(K, 0, L.sh);

  // Membros do lado oposto (contralateral): Braço fica estável a 90°, Perna estende para frente
  const farS = V(S.x + 5, S.y - 4);
  const farH = V(H.x + 5, H.y - 4);
  const farE = pol(farS, Math.PI / 2, L.ua);
  const farW = pol(farE, Math.PI / 2, L.fa);
  const farLegAngle = L2(Math.PI / 2, Math.PI * 0.15, u);
  const farK = pol(farH, farLegAngle, L.th);
  const farA = pol(farK, farLegAngle, L.sh);

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

export const hollowPose = (params?: { isTuck?: boolean }) => (u: number): PoseJoints => {
  const isTuck = params?.isTuck ?? false;
  const H = V(210, G - 14);
  const S = pol(H, Math.PI - 0.18, L.to);
  const hd = pol(S, Math.PI - 0.22, L.hd);
  const E = pol(S, Math.PI - 0.12, L.ua);
  const W = pol(E, Math.PI - 0.12, L.fa);

  if (isTuck) {
    const K = pol(H, Math.PI / 2 + 0.35, L.th);
    const A = pol(K, -Math.PI / 2 + 0.95, L.sh);
    return {
      S,
      E,
      W,
      H,
      K,
      A,
      T: V(A.x + 14, A.y + 4),
      hd,
      fc: V(0.5, -1),
      far: [5, -3],
      pb: '',
    };
  }

  const legAngle = L2(Math.PI * 0.12, Math.PI * 0.22, u);
  const K = pol(H, legAngle, L.th);
  const A = pol(K, legAngle, L.sh);
  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x + 14, A.y + 4),
    hd,
    fc: V(0.5, -1),
    far: [5, -3],
    pb: '',
  };
};

export const crunchPose = (params?: { isVUp?: boolean; isLegRaise?: boolean }) => (u: number): PoseJoints => {
  const isVUp = params?.isVUp ?? false;
  const isLegRaise = params?.isLegRaise ?? false;

  if (isLegRaise) {
    const S = V(145, G - 14);
    const H = V(S.x + L.to, G - 14);
    const hd = V(S.x - L.hd, G - 14);
    const E = V(S.x + L.ua, G - 10);
    const W = V(E.x + L.fa, G - 10);
    const legAngle = L2(Math.PI * 0.08, Math.PI * 0.46, u);
    const K = pol(H, legAngle, L.th);
    const A = pol(K, legAngle, L.sh);
    return {
      S,
      E,
      W,
      H,
      K,
      A,
      T: pol(A, legAngle, 14),
      hd,
      fc: V(0.1, -1),
      far: [5, -3],
      pb: '',
    };
  }

  if (isVUp) {
    const H = V(200, G - 14);
    const trunkAngle = L2(Math.PI * 0.05, Math.PI * 0.3, u);
    const S = pol(H, Math.PI - trunkAngle, L.to);
    const hd = pol(S, Math.PI - trunkAngle, L.hd);
    const E = pol(S, trunkAngle, L.ua);
    const W = pol(E, trunkAngle, L.fa);
    const legAngle = L2(Math.PI * 0.06, Math.PI * 0.32, u);
    const K = pol(H, legAngle, L.th);
    const A = pol(K, legAngle, L.sh);
    return {
      S,
      E,
      W,
      H,
      K,
      A,
      T: V(A.x + 14, A.y - 4),
      hd,
      fc: V(0.8, -0.6),
      far: [5, -3],
      pb: '',
    };
  }

  const H = V(160, G - 14);
  const A = V(245, G - 9);
  const K = ik(H, A, L.th, L.sh, -1);
  const trunkAngle = L2(0.02, 0.42, u);
  const S = pol(H, Math.PI - trunkAngle, L.to);
  const hd = pol(S, Math.PI - trunkAngle, L.hd);
  const W = V(hd.x + 10, hd.y - 4);
  const E = ik(S, W, L.ua, L.fa, 1);
  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x + 16, G - 1),
    hd,
    fc: V(0.8, -0.6),
    far: [5, -3],
    pb: '',
  };
};

export const supermanPose = (u: number): PoseJoints => {
  const H = V(200, G - 12);
  const arch = L2(0.04, 0.26, u);
  const S = pol(H, Math.PI - arch, L.to);
  const hd = pol(S, Math.PI - arch - 0.08, L.hd);
  const E = pol(S, Math.PI - arch - 0.06, L.ua);
  const W = pol(E, Math.PI - arch - 0.06, L.fa);
  const legAngle = L2(0.04, 0.22, u);
  const K = pol(H, -legAngle, L.th);
  const A = pol(K, -legAngle, L.sh);
  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x + 14, A.y + 4),
    hd,
    fc: V(-0.8, -0.6),
    far: [5, -3],
    pb: '',
  };
};

export const birdDogPose = (u: number): PoseJoints => {
  const Ksup = V(215, G - 9);
  const farH = pol(Ksup, Math.PI / 2, L.th);
  const H = farH;
  const farK = Ksup;
  const farA = V(farK.x + L.sh, G - 9);
  const farT = V(farA.x + 12, G - 1);

  const S = V(H.x - L.to, H.y);
  const farS = S;
  const Wsup = V(S.x, G - 5);
  const farE = ik(farS, Wsup, L.ua, L.fa, 1);
  const farW = Wsup;

  const ease = 0.5 - 0.5 * Math.cos(u * Math.PI);
  const armExt = L2(Math.PI - 0.65, Math.PI, ease);
  const E = pol(S, armExt, L.ua);
  const W = pol(E, armExt, L.fa);

  const legExt = L2(-0.45, 0, ease);
  const K = pol(H, legExt, L.th);
  const A = pol(K, legExt, L.sh);

  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x + 14, A.y + 2),
    hd: pol(S, Math.PI - 0.2, L.hd),
    fc: V(-1, 0.1),
    far: [6, -2],
    pb: '',
    farS,
    farE,
    farW,
    farH,
    farK,
    farA,
    farT,
  };
};

export const sidePlankPose = (params?: { isKnee?: boolean; isDip?: boolean }) => (u: number): PoseJoints => {
  const isKnee = params?.isKnee ?? false;
  const E = V(180, G - 9);
  const W = V(E.x + L.fa, G - 9);
  const S = V(E.x, E.y - L.ua);
  const dip = params?.isDip ? Math.sin(u * Math.PI) * 14 : 0;
  const Lb = isKnee ? L.to + L.th : L.to + L.th + L.sh;
  const angle = Math.asin(Math.min(1, Math.max(0, (G - 9 - (S.y + dip)) / Lb)));

  if (isKnee) {
    const K = V(S.x - Math.cos(angle) * Lb, G - 9);
    const H = pol(K, angle, L.th);
    const A = pol(K, Math.PI - 0.45, L.sh);
    return {
      S: V(S.x, S.y + dip),
      E,
      W,
      H,
      K,
      A,
      T: V(A.x - 8, A.y - 8),
      hd: pol(S, -angle, L.hd),
      fc: V(0.8, 0.2),
      far: [4, -2],
      pb: '',
    };
  }

  const Fa = V(S.x - Math.cos(angle) * Lb, G - 9);
  const H = pol(Fa, angle, L.sh + L.th);
  const K = pol(Fa, angle, L.sh);
  return {
    S: V(S.x, S.y + dip),
    E,
    W,
    H,
    K,
    A: Fa,
    T: V(Fa.x + 10, G - 1),
    hd: pol(S, -angle, L.hd),
    fc: V(0.8, 0.2),
    far: [4, -2],
    pb: '',
  };
};

export const hangingCorePose = (params?: { isToesToBar?: boolean; isKnees?: boolean }) => (u: number): PoseJoints => {
  const isToesToBar = params?.isToesToBar ?? false;
  const isKnees = params?.isKnees ?? false;
  const bx = 200;
  const by = 34;
  const W = V(bx, by + 5);
  const S = V(bx - 14, by + 71);
  const H = V(S.x, S.y + L.to);

  if (isToesToBar) {
    const legAngle = L2(0, Math.PI * 0.58, u);
    const K = pol(H, -Math.PI / 2 + legAngle, L.th);
    const A = pol(K, -Math.PI / 2 + legAngle, L.sh);
    return {
      S,
      W,
      E: ik(S, W, L.ua, L.fa, 1),
      H,
      K,
      A,
      T: V(A.x + 10, A.y - 10),
      hd: V(S.x, S.y - L.hd),
      fc: V(1, 0.1),
      far: [6, -2],
      pb: `<path d="M${bx - 30} ${by}H${bx + 40}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 36}" y="${
        by - 8
      }" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`,
    };
  }

  if (isKnees) {
    const kneeAngle = L2(0, Math.PI * 0.48, u);
    const K = pol(H, -Math.PI / 2 + kneeAngle, L.th);
    const A = pol(K, -Math.PI / 2, L.sh);
    return {
      S,
      W,
      E: ik(S, W, L.ua, L.fa, 1),
      H,
      K,
      A,
      T: V(A.x + 4, A.y + 14),
      hd: V(S.x, S.y - L.hd),
      fc: V(1, 0.1),
      far: [6, -2],
      pb: `<path d="M${bx - 30} ${by}H${bx + 40}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 36}" y="${
        by - 8
      }" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`,
    };
  }

  const legAngle = L2(0, Math.PI * 0.46, u);
  const K = pol(H, -Math.PI / 2 + legAngle, L.th);
  const A = pol(K, -Math.PI / 2 + legAngle, L.sh);
  return {
    S,
    W,
    E: ik(S, W, L.ua, L.fa, 1),
    H,
    K,
    A,
    T: V(A.x + 14, A.y),
    hd: V(S.x, S.y - L.hd),
    fc: V(1, 0.1),
    far: [6, -2],
    pb: `<path d="M${bx - 30} ${by}H${bx + 40}" stroke="#64748b" stroke-width="5"/><rect x="${bx + 36}" y="${
      by - 8
    }" width="10" height="${G - by + 8}" fill="#334155"/><circle cx="${bx}" cy="${by}" r="5" fill="#cbd5e1"/>`,
  };
};

export const dragonFlagPose = (u: number): PoseJoints => {
  const S = V(140, G - 16);
  const hd = V(S.x - L.hd, S.y);
  const W = V(100, G - 24);
  const E = ik(S, W, L.ua, L.fa, -1);
  const angle = L2(Math.PI * 0.08, Math.PI * 0.35, u);
  const H = pol(S, angle, L.to);
  const K = pol(H, angle, L.th);
  const A = pol(K, angle, L.sh);
  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x + 14, A.y),
    hd,
    fc: V(0.1, -1),
    far: [5, -3],
    pb: `<rect x="60" y="${G - 14}" width="120" height="14" fill="#475569"/><rect x="85" y="${
      G - 32
    }" width="10" height="20" fill="#334155"/>`,
  };
};

export const abWheelPose = (u: number): PoseJoints => {
  const K = V(85, G - 9);
  const A = pol(K, Math.PI - 0.4, L.sh);
  const thighAngle = L2(1.25, 0.45, u);
  const H = pol(K, thighAngle, L.th);
  const torsoAngle = L2(0.18, 0.06, u);
  const S = pol(H, torsoAngle, L.to);
  const W = V(L2(152, 268, u), G - 12);
  return {
    S,
    W,
    E: ik(S, W, L.ua, L.fa, 1),
    H,
    K,
    A,
    T: V(A.x - 8, A.y - 8),
    hd: pol(S, torsoAngle + 0.05, L.hd),
    fc: V(0.9, 0.4),
    far: [6, -2],
    pb: `<circle cx="${f(W.x)}" cy="${G - 12}" r="12" fill="#334155"/><circle cx="${f(
      W.x
    )}" cy="${G - 12}" r="4" fill="#cbd5e1"/>`,
  };
};

export const mountainClimberPose = (u: number): PoseJoints => {
  const W = V(205, G - 5);
  const S = V(205, G - 5 - 66);
  const H = pol(S, Math.PI + 0.28, L.to);
  const farH = V(H.x - 4, H.y);
  const farA = V(65, G - 9);
  const farK = ik(farH, farA, L.th, L.sh, 1);
  const cycle = Math.sin(u * 2 * Math.PI) * 0.5 + 0.5;
  const legAngle = L2(-0.35, -0.95, cycle);
  const K = pol(H, legAngle, L.th);
  const A = pol(K, legAngle - 0.4, L.sh);
  return {
    S,
    W,
    E: ik(S, W, L.ua, L.fa, 1),
    H,
    K,
    A,
    T: V(A.x + 8, A.y + 6),
    hd: pol(S, 0.2, L.hd),
    fc: V(0.8, 0.4),
    far: [6, -2],
    pb: '',
    farH,
    farK,
    farA,
    farT: V(farA.x + 8, G - 1),
  };
};

export const nordicCurlPose = (u: number): PoseJoints => {
  const K = V(135, G - 9);
  const A = V(K.x - L.sh, G - 9);
  const angle = L2(Math.PI * 0.48, Math.PI * 0.14, u);
  const H = pol(K, angle, L.th);
  const S = pol(H, angle, L.to);
  const W = pol(S, angle - 0.55, 48);
  const E = ik(S, W, L.ua, L.fa, 1);
  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x - 8, G - 1),
    hd: pol(S, angle, L.hd),
    fc: V(1, -0.2),
    far: [6, -2],
    pb: `<rect x="${K.x - L.sh - 15}" y="${G - 14}" width="25" height="14" fill="#334155"/>`,
  };
};

export const catCowPose = (u: number): PoseJoints => {
  const t = Math.sin(u * Math.PI * 2);
  const K = V(225, G - 9);
  const A = V(K.x + L.sh, G - 9);
  const H = pol(K, Math.PI / 2 + t * 0.08, L.th);
  const S = pol(H, Math.PI + t * 0.05, L.to);
  const W = V(148, G - 5);
  const E = ik(S, W, L.ua, L.fa, -1);
  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x + 12, G - 5),
    hd: pol(S, Math.PI - 0.35 + t * 0.15, L.hd),
    fc: V(-1, t * 0.5),
    far: [4, -3],
    pb: `<line x1="140" y1="${G}" x2="275" y2="${G}" stroke="#1f3b5c" stroke-width="2"/>`,
  };
};

export const standingMobilityPose = (u: number): PoseJoints => {
  const A = V(180, G - 12);
  const K = V(A.x, A.y - L.sh);
  const H = V(K.x, K.y - L.th);
  const S = V(H.x, H.y - L.to);
  const theta = L2(-Math.PI / 4, Math.PI / 2, u);
  const W = pol(S, theta, 42);
  const E = ik(S, W, L.ua, L.fa, 1);
  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x + 14, G - 5),
    hd: V(S.x, S.y - L.hd),
    fc: V(1, 0),
    far: [5, -2],
    pb: '',
  };
};

export const deepSquatHoldPose = (u: number): PoseJoints => {
  const t = 0.5 + 0.5 * Math.sin(u * Math.PI * 2);
  const A = V(165, G - 12);
  const H = V(175, G - 45 + t * 4);
  const K = ik(H, A, L.th, L.sh, -1);
  const S = pol(H, Math.PI / 2 + 0.15, L.to);
  const W = V(S.x + 24, S.y + 40);
  const E = ik(S, W, L.ua, L.fa, -1);
  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x + 15, G - 5),
    hd: pol(S, Math.PI / 2 + 0.1, L.hd),
    fc: V(1, 0),
    far: [6, -2],
    pb: `<line x1="225" y1="${G - 160}" x2="225" y2="${G}" stroke="#334155" stroke-width="4"/>`,
  };
};

export const worldGreatestStretchPose = (u: number): PoseJoints => {
  const t = 0.5 + 0.5 * Math.sin(u * Math.PI * 2);
  const frontA = V(220, G - 12);
  const H = V(160, G - 42);
  const frontK = ik(H, frontA, L.th, L.sh, -1);
  const backA = V(70, G - 12);
  const farH = V(H.x - 4, H.y);
  const farK = ik(farH, backA, L.th, L.sh, 1);
  const S = pol(H, 0.45, L.to);
  const farW = V(205, G - 5);
  const farS = V(S.x + 4, S.y - 2);
  const farE = ik(farS, farW, L.ua, L.fa, -1);
  const reachAngle = L2(0.4, 1.4, t);
  const W = pol(S, reachAngle, 62);
  const E = ik(S, W, L.ua, L.fa, 1);
  return {
    S,
    E,
    W,
    H,
    K: frontK,
    A: frontA,
    T: V(frontA.x + 12, G - 5),
    farS,
    farE,
    farW,
    farH,
    farK,
    farA: backA,
    farT: V(backA.x - 12, G - 5),
    hd: pol(S, 0.35, L.hd),
    fc: V(1, -0.4),
    far: [4, -2],
    pb: '',
  };
};

export const seatedHipMobilityPose = (u: number): PoseJoints => {
  const breath = (0.5 + 0.5 * Math.sin(u * Math.PI * 2)) * 3;
  const H = V(190, G - 16 + breath);
  const S = pol(H, Math.PI / 2 + 0.1, L.to);
  const hd = pol(S, Math.PI / 2 + 0.05, L.hd);
  const W = V(H.x - 14, G - 15);
  const E = ik(S, W, L.ua, L.fa, -1);
  const K = pol(H, -0.2, L.th);
  const A = pol(K, -Math.PI / 2 - 0.2, L.sh);
  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x - 10, G - 6),
    hd,
    fc: V(1, 0),
    far: [6, -2],
    pb: '',
  };
};

export const childPose = (_u: number): PoseJoints => {
  const K = V(195, G - 9);
  const A = V(K.x + L.sh, G - 9);
  const H = pol(K, Math.PI - 0.25, L.th);
  const S = pol(H, Math.PI - 0.05, L.to);
  const W = V(S.x - 65, G - 5);
  const E = ik(S, W, L.ua, L.fa, -1);
  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x + 10, G - 7),
    hd: pol(S, Math.PI - 0.1, L.hd),
    fc: V(-1, 0.2),
    far: [4, -2],
    pb: '',
  };
};

export const standingStretchPose = (params?: { type?: string }) => (_u: number): PoseJoints => {
  const type = params?.type ?? 'quad';
  let A = V(175, G - 12);
  let K = V(A.x, A.y - L.sh);
  let H = V(K.x, K.y - L.th);
  let S = V(H.x, H.y - L.to);
  let W: Vec2;
  let E: Vec2;
  let legK = K;
  let legA = A;
  let legT = V(A.x + 14, G - 5);

  if (type === 'quad') {
    legK = pol(H, -Math.PI / 2 - 0.70, L.th);
    legA = pol(legK, Math.PI / 2 - 0.05, L.sh);
    legT = pol(legA, Math.PI / 2 - 0.05, 14);
    W = legA;
    E = ik(S, W, L.ua, L.fa, -1);
  } else if (type === 'triceps') {
    E = pol(S, Math.PI / 2 + 0.2, L.ua);
    W = pol(E, -Math.PI / 2 + 0.75, L.fa);
  } else if (type === 'lat') {
    W = V(S.x + 35, S.y - 60);
    E = ik(S, W, L.ua, L.fa, 1);
  } else if (type === 'calf') {
    H = V(180, G - 100);
    S = V(H.x, H.y - L.to);
    W = V(220, G - 140);
    E = ik(S, W, L.ua, L.fa, 1);
    legA = V(135, G - 12);
    legK = ik(H, legA, L.th, L.sh, 1);
  } else if (type === 'hamstring') {
    const hingeH = V(165, G - 9 - L.sh);
    legA = V(215, G - 12);
    legK = ik(hingeH, legA, L.th, L.sh, -1);
    S = pol(hingeH, 0.45, L.to);
    W = pol(S, -Math.PI / 2 + 0.35, 60);
    E = ik(S, W, L.ua, L.fa, 1);
    return {
      S,
      E,
      W,
      H: hingeH,
      K: legK,
      A: legA,
      T: legT,
      hd: pol(S, 0.45, L.hd),
      fc: V(1, 0),
      far: [5, -2],
      pb: '',
    };
  } else {
    W = V(type === 'chest' ? 135 : 195, S.y + 10);
    E = ik(S, W, L.ua, L.fa, 1);
  }

  return {
    S,
    E,
    W,
    H,
    K: legK,
    A: legA,
    T: legT,
    hd: V(S.x, S.y - L.hd),
    fc: V(1, 0),
    far: [5, -2],
    pb:
      type === 'calf' || type === 'chest'
        ? `<line x1="225" y1="${G - 200}" x2="225" y2="${G}" stroke="#334155" stroke-width="4"/>`
        : '',
  };
};

export const lsitSkillPose = (params?: { type?: string }) => (_u: number): PoseJoints => {
  const type = params?.type ?? 'full';
  const W = V(180, G - 5);
  const S = V(180, G - 5 - 68);
  const E = ik(S, W, L.ua, L.fa, 1);
  const H = V(180, S.y + L.to);
  let K: Vec2;
  let A: Vec2;
  let T: Vec2;

  if (type === 'tuck') {
    K = pol(H, 0.65, L.th);
    A = pol(K, -Math.PI / 2 + 0.35, L.sh);
    T = V(A.x + 12, A.y);
  } else if (type === 'vsit') {
    const vS = pol(H, Math.PI - 0.85, L.to);
    const vE = ik(vS, W, L.ua, L.fa, 1);
    A = pol(H, 0.9, L.th + L.sh);
    K = ik(H, A, L.th, L.sh, -1);
    T = V(A.x + 12, A.y - 6);
    return {
      S: vS,
      E: vE,
      W,
      H,
      K,
      A,
      T,
      hd: pol(vS, Math.PI - 0.85, L.hd),
      fc: V(1, -0.1),
      far: [4, -2],
      pb: `<rect x="165" y="${G - 8}" width="30" height="8" rx="3" fill="#334155"/>`,
    };
  } else if (type === 'one-leg') {
    K = V(H.x + L.th, H.y);
    A = V(K.x + L.sh, K.y);
    T = V(A.x + 14, A.y);
  } else {
    K = V(H.x + L.th, H.y);
    A = V(K.x + L.sh, K.y);
    T = V(A.x + 14, A.y);
  }

  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T,
    hd: V(S.x, S.y - L.hd),
    fc: V(1, -0.1),
    far: [4, -2],
    pb: `<rect x="165" y="${G - 8}" width="30" height="8" rx="3" fill="#334155"/>`,
  };
};

export const armBalancePose = (params?: { type?: string }) => (_u: number): PoseJoints => {
  const type = params?.type ?? 'crow';
  const W = V(210, G - 5);
  const S = V(235, G - 54);
  const E = type === 'crane' ? ik(S, W, L.ua, L.fa, -1) : ik(S, W, L.ua, L.fa, 1);
  const H = pol(S, Math.PI - 0.35, L.to);
  const K = pol(H, -0.4, L.th);
  const A = pol(K, -Math.PI / 2 + 0.25, L.sh);
  const T = V(A.x - 12, A.y);

  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T,
    hd: pol(S, 0.35, L.hd),
    fc: V(1, 0.4),
    far: [4, -2],
    pb: '',
  };
};

export const plancheSkillPose = (params?: { type?: string }) => (_u: number): PoseJoints => {
  const type = params?.type ?? 'full';
  const W = V(195, G - 5);
  const S = V(238, G - 60);
  const E = ik(S, W, L.ua, L.fa, -1);
  const H = pol(S, Math.PI, L.to);
  let K: Vec2;
  let A: Vec2;
  let T: Vec2;

  if (type === 'lean') {
    A = V(85, G - 12);
    K = ik(H, A, L.th, L.sh, -1);
    T = V(A.x - 10, G - 5);
  } else if (type === 'tuck') {
    K = pol(H, -0.65, L.th);
    A = pol(K, Math.PI - 1.15, L.sh);
    T = V(A.x - 10, A.y);
  } else if (type === 'adv-tuck') {
    K = pol(H, -Math.PI / 2, L.th);
    A = pol(K, Math.PI, L.sh);
    T = V(A.x - 12, A.y);
  } else {
    K = pol(H, Math.PI, L.th);
    A = pol(K, Math.PI, L.sh);
    T = V(A.x - 14, A.y);
  }

  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T,
    hd: pol(S, 0.2, L.hd),
    fc: V(1, 0.1),
    far: [4, -2],
    pb: '',
  };
};

export const frontLeverSkillPose = (params?: { type?: string }) => (_u: number): PoseJoints => {
  const type = params?.type ?? 'full';
  const W = V(235, G - 175);
  const S = V(W.x - 63, W.y + 15);
  const E = ik(S, W, L.ua, L.fa, 1);
  const H = pol(S, 0, L.to);
  let K: Vec2;
  let A: Vec2;
  let T: Vec2;

  if (type === 'tuck') {
    K = pol(H, Math.PI / 2 + 0.35, L.th);
    A = pol(K, -Math.PI / 2 + 0.95, L.sh);
    T = V(A.x + 12, A.y - 6);
  } else if (type === 'adv-tuck') {
    K = pol(H, Math.PI / 2, L.th);
    A = pol(K, 0, L.sh);
    T = V(A.x + 12, A.y);
  } else {
    K = pol(H, 0, L.th);
    A = pol(K, 0, L.sh);
    T = V(A.x + 14, A.y);
  }

  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T,
    hd: pol(S, Math.PI - 0.3, L.hd),
    fc: V(-1, -0.3),
    far: [4, -2],
    pb: `<line x1="235" y1="${G - 210}" x2="235" y2="${
      G - 175
    }" stroke="#1f3b5c" stroke-width="4"/><circle cx="235" cy="${G - 175}" r="5" fill="#334155"/>`,
  };
};

export const backLeverSkillPose = (params?: { type?: string }) => (_u: number): PoseJoints => {
  const type = params?.type ?? 'full';
  const W = V(215, G - 175);
  const S = V(W.x + 40, W.y + 25);
  const E = ik(S, W, L.ua, L.fa, -1);
  const H = pol(S, Math.PI, L.to);
  let K: Vec2;
  let A: Vec2;
  let T: Vec2;

  if (type === 'tuck') {
    K = pol(H, -Math.PI / 2 - 0.35, L.th);
    A = pol(K, Math.PI / 2 + 0.35, L.sh);
    T = V(A.x - 12, A.y);
  } else if (type === 'adv-tuck') {
    K = pol(H, -Math.PI / 2, L.th);
    A = pol(K, Math.PI, L.sh);
    T = V(A.x - 12, A.y);
  } else {
    K = pol(H, Math.PI, L.th);
    A = pol(K, Math.PI, L.sh);
    T = V(A.x - 14, A.y);
  }

  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T,
    hd: pol(S, 0.3, L.hd),
    fc: V(1, 0.3),
    far: [4, -2],
    pb: `<line x1="215" y1="${G - 210}" x2="215" y2="${
      G - 175
    }" stroke="#1f3b5c" stroke-width="4"/><circle cx="215" cy="${G - 175}" r="5" fill="#334155"/>`,
  };
};

export const skinTheCatPose = (_u: number): PoseJoints => {
  const W = V(200, G - 180);
  const S = V(W.x, W.y + 58);
  const E = ik(S, W, L.ua, L.fa, 1);
  const H = pol(S, -Math.PI / 2, L.to);
  const K = pol(H, -0.65, L.th);
  const A = pol(K, Math.PI - 1.15, L.sh);
  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x + 10, A.y - 4),
    hd: pol(S, Math.PI / 2, L.hd),
    fc: V(1, 0),
    far: [4, -2],
    pb: `<line x1="200" y1="${G - 210}" x2="200" y2="${G - 180}" stroke="#1f3b5c" stroke-width="4"/>`,
  };
};

export const humanFlagSkillPose = (params?: { type?: string }) => (_u: number): PoseJoints => {
  const type = params?.type ?? 'full';
  const lowerW = V(140, G - 95);
  const upperW = V(140, G - 160);
  const S = V(180, G - 128);
  const E = ik(S, lowerW, L.ua, L.fa, 1);
  const farS = S;
  const farE = ik(farS, upperW, L.ua, L.fa, -1);
  const farW = upperW;
  const H = pol(S, 0, L.to);
  let K: Vec2;
  let A: Vec2;
  let T: Vec2;

  if (type === 'tuck') {
    K = pol(H, Math.PI / 2 - 0.35, L.th);
    A = pol(K, -Math.PI / 2 + 0.35, L.sh);
    T = V(A.x + 12, A.y - 6);
  } else {
    K = pol(H, 0, L.th);
    A = pol(K, 0, L.sh);
    T = V(A.x + 14, A.y);
  }

  return {
    S,
    E,
    W: lowerW,
    H,
    K,
    A,
    T,
    farW,
    farE,
    farS,
    hd: pol(S, Math.PI, L.hd),
    fc: V(-1, 0),
    far: [3, -2],
    pb: `<line x1="140" y1="${G - 220}" x2="140" y2="${G}" stroke="#334155" stroke-width="5"/>`,
  };
};

export const kickUpHandstandPose = (_u: number): PoseJoints => {
  const W = V(210, G - 5);
  const S = V(W.x, G - 5 - 65);
  const E = ik(S, W, L.ua, L.fa, 1);
  const H = pol(S, -Math.PI / 2, L.to);
  const K = pol(H, -Math.PI / 2 - 0.25, L.th);
  const A = pol(K, -Math.PI / 2 - 0.25, L.sh);
  return {
    S,
    E,
    W,
    H,
    K,
    A,
    T: V(A.x + 8, A.y - 12),
    hd: pol(S, Math.PI / 2, L.hd),
    fc: V(1, 0),
    far: [4, -2],
    pb: '',
  };
};

// Map de modelos instanciáveis a partir dos dados JSON
const MODEL_FACTORIES: Record<string, (params?: any) => (u: number) => PoseJoints> = {
  pull: (params?: any) => pullPose(params),
  push: (params?: any) => pushPose(params),
  squat: (params?: any) => squatPose(params),
  bridge: () => bridgePose,
  row: (params?: any) => rowPose(params),
  plank: () => plankPose,
  dip: (params?: any) => dipPose(params),
  lunge: () => lungePose,
  deadbug: () => deadbugPose,
  pike: (params?: any) => pikePose(params),
  handstand: (params?: any) => handstandPose(params),
  pistol: () => pistolPose,
  bulgarian: () => bulgarianPose,
  calf: (params?: any) => calfRaisePose(params),
  hollow: (params?: any) => hollowPose(params),
  crunch: (params?: any) => crunchPose(params),
  superman: () => supermanPose,
  bird_dog: () => birdDogPose,
  side_plank: (params?: any) => sidePlankPose(params),
  hanging_core: (params?: any) => hangingCorePose(params),
  dragon_flag: () => dragonFlagPose,
  ab_wheel: () => abWheelPose,
  mountain_climber: () => mountainClimberPose,
  nordic_curl: () => nordicCurlPose,
  cat_cow: () => catCowPose,
  standing_mobility: () => standingMobilityPose,
  deep_squat_hold: () => deepSquatHoldPose,
  world_greatest_stretch: () => worldGreatestStretchPose,
  seated_hip_mobility: () => seatedHipMobilityPose,
  child_pose: () => childPose,
  standing_stretch: (params?: any) => standingStretchPose(params),
  lsit_skill: (params?: any) => lsitSkillPose(params),
  arm_balance: (params?: any) => armBalancePose(params),
  planche_skill: (params?: any) => plancheSkillPose(params),
  front_lever_skill: (params?: any) => frontLeverSkillPose(params),
  back_lever_skill: (params?: any) => backLeverSkillPose(params),
  skin_the_cat: () => skinTheCatPose,
  human_flag: (params?: any) => humanFlagSkillPose(params),
  kick_up_handstand: () => kickUpHandstandPose,
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
  const lowerId = id.toLowerCase();

  // 1. Panturrilhas
  if (lowerId.includes('panturrilha') || lowerId.includes('calf') || lowerId.includes('pogo')) {
    return {
      id,
      name: 'Elevação de Panturrilha',
      model: 'calf',
      params: { isStep: true },
      durationSeconds: 3.2,
      muscles: REFERENCE_POSES_DATA['panturrilha-dupla'].muscles,
      mus: REFERENCE_POSES_DATA['panturrilha-dupla'].muscles,
      pose: calfRaisePose({ isStep: true }),
    };
  }

  // 2. Pistol Squat
  if (lowerId.includes('pistol')) {
    return {
      id,
      name: 'Pistol Squat',
      model: 'pistol',
      durationSeconds: 4.0,
      muscles: REFERENCE_POSES_DATA.pistolsquat.muscles,
      mus: REFERENCE_POSES_DATA.pistolsquat.muscles,
      pose: pistolPose,
    };
  }

  // 3. Búlgaro e Step-Up
  if (lowerId.includes('bulgar') || lowerId.includes('step')) {
    return {
      id,
      name: 'Agachamento Búlgaro',
      model: 'bulgarian',
      durationSeconds: 3.8,
      muscles: REFERENCE_POSES_DATA['afundo-bulgaro'].muscles,
      mus: REFERENCE_POSES_DATA['afundo-bulgaro'].muscles,
      pose: bulgarianPose,
    };
  }

  // 4. Parada de mãos / Handstand / HSPU
  if (lowerId.includes('handstand') || lowerId.includes('hspu') || lowerId.includes('parada')) {
    return {
      id,
      name: 'Parada de Mãos',
      model: 'handstand',
      params: { isWall: true },
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA.handstand.muscles,
      mus: REFERENCE_POSES_DATA.handstand.muscles,
      pose: handstandPose({ isWall: true }),
    };
  }

  // 5. Pike Push-up
  if (lowerId.includes('pike')) {
    const feetHeight = lowerId.includes('elevad') ? 35 : 0;
    return {
      id,
      name: 'Pike Push-up',
      model: 'pike',
      params: { feetHeight },
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA.pikepushup.muscles,
      mus: REFERENCE_POSES_DATA.pikepushup.muscles,
      pose: pikePose({ feetHeight }),
    };
  }

  // 6. Mergulhos (Dips)
  if (lowerId.includes('dip') || lowerId.includes('mergulho')) {
    const isBench = lowerId.includes('banco') || lowerId.includes('cadeira');
    return {
      id,
      name: isBench ? 'Mergulho no Banco' : 'Mergulho em Paralelas',
      model: 'dip',
      params: { isBench },
      durationSeconds: 3.5,
      muscles: isBench ? REFERENCE_POSES_DATA['dip-banco-chao'].muscles : REFERENCE_POSES_DATA.dip.muscles,
      mus: isBench ? REFERENCE_POSES_DATA['dip-banco-chao'].muscles : REFERENCE_POSES_DATA.dip.muscles,
      pose: dipPose({ isBench }),
    };
  }

  // 7. Remadas Australianas
  if (lowerId.includes('remada') || lowerId.includes('australian') || lowerId.includes('row')) {
    const isKnees = lowerId.includes('joelho');
    return {
      id,
      name: 'Remada Invertida',
      model: 'row',
      params: { isKnees },
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA.australianpullup.muscles,
      mus: REFERENCE_POSES_DATA.australianpullup.muscles,
      pose: rowPose({ isKnees }),
    };
  }

  // 8. Agachamentos
  if (lowerId.includes('squat') || lowerId.includes('agachamento')) {
    const isWallSit = lowerId.includes('parede') || lowerId.includes('wall');
    const isBox = lowerId.includes('box') || lowerId.includes('caixa');
    return {
      id,
      name: isWallSit ? 'Wall Sit' : 'Agachamento Livre',
      model: 'squat',
      params: { isWallSit, isBox },
      durationSeconds: 3.8,
      muscles: REFERENCE_POSES_DATA.squat.muscles,
      mus: REFERENCE_POSES_DATA.squat.muscles,
      pose: squatPose({ isWallSit, isBox }),
    };
  }

  // 9. Pontes e Glúteos
  if (lowerId.includes('bridge') || lowerId.includes('ponte') || lowerId.includes('gluteo') || lowerId.includes('thrust')) {
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

  // 10. Prancha Frontal
  if (lowerId.includes('prancha') || lowerId.includes('plank')) {
    return {
      id,
      name: 'Prancha Frontal',
      model: 'plank',
      durationSeconds: 3.4,
      muscles: REFERENCE_POSES_DATA.plank.muscles,
      mus: REFERENCE_POSES_DATA.plank.muscles,
      pose: plankPose,
    };
  }

  // 11. Afundos
  if (lowerId.includes('afundo') || lowerId.includes('lunge')) {
    return {
      id,
      name: 'Afundo Tradicional',
      model: 'lunge',
      durationSeconds: 3.8,
      muscles: REFERENCE_POSES_DATA.lunges.muscles,
      mus: REFERENCE_POSES_DATA.lunges.muscles,
      pose: lungePose,
    };
  }

  // 12. Flexões
  if (lowerId.includes('pushup') || lowerId.includes('flexao')) {
    let benchHeight = 0;
    let feetHeight = 0;
    let isKnee = false;
    let handsFarBack = false;

    if (lowerId.includes('parede')) benchHeight = 160;
    else if (lowerId.includes('inclinad') || lowerId.includes('banco') || lowerId.includes('caixa')) benchHeight = 48;
    else if (lowerId.includes('declinad') || lowerId.includes('elevad')) feetHeight = 35;
    if (lowerId.includes('joelho')) isKnee = true;
    if (lowerId.includes('pseudo') || lowerId.includes('planche')) handsFarBack = true;

    return {
      id,
      name: 'Flexão de Braços',
      model: 'push',
      params: { benchHeight, feetHeight, isKnee, handsFarBack },
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA.pushup.muscles,
      mus: REFERENCE_POSES_DATA.pushup.muscles,
      pose: pushPose({ benchHeight, feetHeight, isKnee, handsFarBack }),
    };
  }

  // 13. Core e Deitado (Lote 3 Fallbacks)
  if (lowerId.includes('nordic')) {
    return {
      id,
      name: 'Nordic Hamstring Curl',
      model: 'nordic_curl',
      durationSeconds: 3.8,
      muscles: REFERENCE_POSES_DATA['nordic-curl'].muscles,
      mus: REFERENCE_POSES_DATA['nordic-curl'].muscles,
      pose: nordicCurlPose,
    };
  }

  if (lowerId.includes('dragon')) {
    return {
      id,
      name: 'Dragon Flag',
      model: 'dragon_flag',
      durationSeconds: 3.8,
      muscles: REFERENCE_POSES_DATA['dragon-flag'].muscles,
      mus: REFERENCE_POSES_DATA['dragon-flag'].muscles,
      pose: dragonFlagPose,
    };
  }

  if (lowerId.includes('wheel')) {
    return {
      id,
      name: 'Roda Abdominal',
      model: 'ab_wheel',
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA['ab-wheel-joelhos'].muscles,
      mus: REFERENCE_POSES_DATA['ab-wheel-joelhos'].muscles,
      pose: abWheelPose,
    };
  }

  if (lowerId.includes('mountain') || lowerId.includes('climber')) {
    return {
      id,
      name: 'Mountain Climbers',
      model: 'mountain_climber',
      durationSeconds: 3.0,
      muscles: REFERENCE_POSES_DATA['mountain-climbers'].muscles,
      mus: REFERENCE_POSES_DATA['mountain-climbers'].muscles,
      pose: mountainClimberPose,
    };
  }

  if (lowerId.includes('superman')) {
    return {
      id,
      name: 'Superman',
      model: 'superman',
      durationSeconds: 3.4,
      muscles: REFERENCE_POSES_DATA.superman.muscles,
      mus: REFERENCE_POSES_DATA.superman.muscles,
      pose: supermanPose,
    };
  }

  if (lowerId.includes('bird') || lowerId.includes('perdigueiro')) {
    return {
      id,
      name: 'Bird Dog',
      model: 'bird_dog',
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA['bird-dog'].muscles,
      mus: REFERENCE_POSES_DATA['bird-dog'].muscles,
      pose: birdDogPose,
    };
  }

  if (lowerId.includes('lateral') || lowerId.includes('copenhagen')) {
    const isKnee = lowerId.includes('joelho');
    const isDip = lowerId.includes('elevacao');
    return {
      id,
      name: 'Prancha Lateral',
      model: 'side_plank',
      params: { isKnee, isDip },
      durationSeconds: 3.4,
      muscles: REFERENCE_POSES_DATA['prancha-lateral'].muscles,
      mus: REFERENCE_POSES_DATA['prancha-lateral'].muscles,
      pose: sidePlankPose({ isKnee, isDip }),
    };
  }

  if (lowerId.includes('hollow') || lowerId.includes('canoa')) {
    const isTuck = lowerId.includes('tuck');
    return {
      id,
      name: isTuck ? 'Hollow Hold Tuck' : 'Hollow Body Hold',
      model: 'hollow',
      params: { isTuck },
      durationSeconds: 3.4,
      muscles: isTuck ? REFERENCE_POSES_DATA['hollow-hold-tuck'].muscles : REFERENCE_POSES_DATA.hollowbody.muscles,
      mus: isTuck ? REFERENCE_POSES_DATA['hollow-hold-tuck'].muscles : REFERENCE_POSES_DATA.hollowbody.muscles,
      pose: hollowPose({ isTuck }),
    };
  }

  if (lowerId.includes('canivete') || lowerId.includes('v-up')) {
    return {
      id,
      name: 'Abdominal Canivete',
      model: 'crunch',
      params: { isVUp: true },
      durationSeconds: 3.5,
      muscles: REFERENCE_POSES_DATA['abdominal-canivete'].muscles,
      mus: REFERENCE_POSES_DATA['abdominal-canivete'].muscles,
      pose: crunchPose({ isVUp: true }),
    };
  }

  if (lowerId.includes('elevacao') || lowerId.includes('flutter') || lowerId.includes('tesoura')) {
    if (lowerId.includes('barra') || lowerId.includes('toes')) {
      const isToes = lowerId.includes('toes');
      const isKnees = lowerId.includes('joelho');
      return {
        id,
        name: isToes ? 'Pés na Barra' : 'Elevação de Pernas na Barra',
        model: 'hanging_core',
        params: { isToesToBar: isToes, isKnees },
        durationSeconds: 3.6,
        muscles: REFERENCE_POSES_DATA['elevacao-pernas-barra'].muscles,
        mus: REFERENCE_POSES_DATA['elevacao-pernas-barra'].muscles,
        pose: hangingCorePose({ isToesToBar: isToes, isKnees }),
      };
    }
    return {
      id,
      name: 'Elevação de Pernas no Solo',
      model: 'crunch',
      params: { isLegRaise: true },
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA['elevacao-pernas-chao'].muscles,
      mus: REFERENCE_POSES_DATA['elevacao-pernas-chao'].muscles,
      pose: crunchPose({ isLegRaise: true }),
    };
  }

  if (lowerId.includes('crunch') || lowerId.includes('abdominal') || lowerId.includes('twist') || lowerId.includes('heel')) {
    return {
      id,
      name: 'Abdominal no Solo',
      model: 'crunch',
      durationSeconds: 3.2,
      muscles: REFERENCE_POSES_DATA['crunch-solo'].muscles,
      mus: REFERENCE_POSES_DATA['crunch-solo'].muscles,
      pose: crunchPose(),
    };
  }

  // 14. Skills Avançadas (Lote 5)
  if (lowerId.includes('bandeira-humana')) {
    const isTuck = lowerId.includes('tuck');
    return {
      id,
      name: isTuck ? 'Bandeira Humana Tuck' : 'Bandeira Humana Completa',
      model: 'human_flag',
      params: { type: isTuck ? 'tuck' : 'full' },
      durationSeconds: 3.8,
      muscles: REFERENCE_POSES_DATA['bandeira-humana'].muscles,
      mus: REFERENCE_POSES_DATA['bandeira-humana'].muscles,
      pose: humanFlagSkillPose({ type: isTuck ? 'tuck' : 'full' }),
    };
  }

  if (lowerId.includes('skin-the-cat')) {
    return {
      id,
      name: 'Skin the Cat',
      model: 'skin_the_cat',
      durationSeconds: 4.0,
      muscles: REFERENCE_POSES_DATA['skin-the-cat'].muscles,
      mus: REFERENCE_POSES_DATA['skin-the-cat'].muscles,
      pose: skinTheCatPose,
    };
  }

  if (lowerId.includes('front-lever') || lowerId === 'frontlever') {
    const type = lowerId.includes('tuck') ? (lowerId.includes('adv') ? 'adv-tuck' : 'tuck') : 'full';
    return {
      id,
      name: 'Front Lever',
      model: 'front_lever_skill',
      params: { type },
      durationSeconds: 3.8,
      muscles: REFERENCE_POSES_DATA.frontlever.muscles,
      mus: REFERENCE_POSES_DATA.frontlever.muscles,
      pose: frontLeverSkillPose({ type }),
    };
  }

  if (lowerId.includes('back-lever') || lowerId === 'backlever') {
    const type = lowerId.includes('tuck') ? (lowerId.includes('adv') ? 'adv-tuck' : 'tuck') : 'full';
    return {
      id,
      name: 'Back Lever',
      model: 'back_lever_skill',
      params: { type },
      durationSeconds: 3.8,
      muscles: REFERENCE_POSES_DATA['back-lever'].muscles,
      mus: REFERENCE_POSES_DATA['back-lever'].muscles,
      pose: backLeverSkillPose({ type }),
    };
  }

  if (lowerId.includes('planche') && !lowerId.includes('pseudo') && !lowerId.includes('front') && !lowerId.includes('back')) {
    const type = lowerId.includes('lean') ? 'lean' : lowerId.includes('adv-tuck') ? 'adv-tuck' : lowerId.includes('tuck') ? 'tuck' : 'full';
    return {
      id,
      name: 'Planche',
      model: 'planche_skill',
      params: { type },
      durationSeconds: 3.8,
      muscles: REFERENCE_POSES_DATA.planche.muscles,
      mus: REFERENCE_POSES_DATA.planche.muscles,
      pose: plancheSkillPose({ type }),
    };
  }

  if (lowerId.includes('crow') || lowerId.includes('crane') || lowerId.includes('corvo') || lowerId.includes('garca')) {
    const isCrane = lowerId.includes('crane') || lowerId.includes('garca');
    return {
      id,
      name: isCrane ? 'Crane Pose' : 'Crow Pose',
      model: 'arm_balance',
      params: { type: isCrane ? 'crane' : 'crow' },
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA['crow-pose'].muscles,
      mus: REFERENCE_POSES_DATA['crow-pose'].muscles,
      pose: armBalancePose({ type: isCrane ? 'crane' : 'crow' }),
    };
  }

  if (lowerId.includes('chute-parada-maos')) {
    return {
      id,
      name: 'Chute para Parada de Mãos',
      model: 'kick_up_handstand',
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA['chute-parada-maos'].muscles,
      mus: REFERENCE_POSES_DATA['chute-parada-maos'].muscles,
      pose: kickUpHandstandPose,
    };
  }

  if (lowerId.includes('vsit') || lowerId.includes('v-sit')) {
    return {
      id,
      name: 'V-Sit',
      model: 'lsit_skill',
      params: { type: 'vsit' },
      durationSeconds: 3.8,
      muscles: REFERENCE_POSES_DATA.vsit.muscles,
      mus: REFERENCE_POSES_DATA.vsit.muscles,
      pose: lsitSkillPose({ type: 'vsit' }),
    };
  }

  if (lowerId.includes('lsit') || lowerId.includes('l-sit')) {
    if (!lowerId.includes('pullup') && !lowerId.includes('barra')) {
      const type = lowerId.includes('tuck') ? 'tuck' : lowerId.includes('uma-perna') ? 'one-leg' : 'full';
      return {
        id,
        name: 'L-Sit',
        model: 'lsit_skill',
        params: { type },
        durationSeconds: 3.6,
        muscles: REFERENCE_POSES_DATA.lsit.muscles,
        mus: REFERENCE_POSES_DATA.lsit.muscles,
        pose: lsitSkillPose({ type }),
      };
    }
  }

  // 15. Aquecimento e Alongamento (Lote 4)
  if (lowerId.includes('gato') || lowerId.includes('retracao-protracao') || lowerId.includes('flexao-extensao-punho') || lowerId.includes('rotacao-toracica')) {
    return {
      id,
      name: 'Mobilidade em Quatro Apoios',
      model: 'cat_cow',
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA['gato-vaca'].muscles,
      mus: REFERENCE_POSES_DATA['gato-vaca'].muscles,
      pose: catCowPose,
    };
  }

  if (lowerId.includes('greatest') || lowerId.includes('flexores-quadril')) {
    return {
      id,
      name: 'Alongamento Dinâmico de Quadril',
      model: 'world_greatest_stretch',
      durationSeconds: 4.0,
      muscles: REFERENCE_POSES_DATA['greatest-stretch'].muscles,
      mus: REFERENCE_POSES_DATA['greatest-stretch'].muscles,
      pose: worldGreatestStretchPose,
    };
  }

  if (lowerId.includes('9090') || lowerId.includes('pombo') || lowerId.includes('borboleta')) {
    return {
      id,
      name: 'Mobilidade de Quadril no Solo',
      model: 'seated_hip_mobility',
      durationSeconds: 3.8,
      muscles: REFERENCE_POSES_DATA['rotacao-quadril-9090'].muscles,
      mus: REFERENCE_POSES_DATA['rotacao-quadril-9090'].muscles,
      pose: seatedHipMobilityPose,
    };
  }

  if (lowerId.includes('crianca')) {
    return {
      id,
      name: 'Postura da Criança',
      model: 'child_pose',
      durationSeconds: 4.0,
      muscles: REFERENCE_POSES_DATA['postura-crianca'].muscles,
      mus: REFERENCE_POSES_DATA['postura-crianca'].muscles,
      pose: childPose,
    };
  }

  if (lowerId.includes('agachamento-profundo') || lowerId.includes('mobilidade-tornozelo')) {
    return {
      id,
      name: 'Mobilidade de Agachamento Profundo',
      model: 'deep_squat_hold',
      durationSeconds: 4.0,
      muscles: REFERENCE_POSES_DATA['agachamento-profundo-assistido'].muscles,
      mus: REFERENCE_POSES_DATA['agachamento-profundo-assistido'].muscles,
      pose: deepSquatHoldPose,
    };
  }

  if (lowerId.includes('quadriceps')) {
    return {
      id,
      name: 'Alongamento de Quadríceps',
      model: 'standing_stretch',
      params: { type: 'quad' },
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA['alongamento-quadriceps'].muscles,
      mus: REFERENCE_POSES_DATA['alongamento-quadriceps'].muscles,
      pose: standingStretchPose({ type: 'quad' }),
    };
  }

  if (lowerId.includes('triceps')) {
    return {
      id,
      name: 'Alongamento de Tríceps',
      model: 'standing_stretch',
      params: { type: 'triceps' },
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA['alongamento-triceps-acima'].muscles,
      mus: REFERENCE_POSES_DATA['alongamento-triceps-acima'].muscles,
      pose: standingStretchPose({ type: 'triceps' }),
    };
  }

  if (lowerId.includes('dorsal')) {
    return {
      id,
      name: 'Alongamento de Dorsal',
      model: 'standing_stretch',
      params: { type: 'lat' },
      durationSeconds: 3.8,
      muscles: REFERENCE_POSES_DATA['alongamento-dorsal-barra'].muscles,
      mus: REFERENCE_POSES_DATA['alongamento-dorsal-barra'].muscles,
      pose: standingStretchPose({ type: 'lat' }),
    };
  }

  if (lowerId.includes('isquiotibiais')) {
    return {
      id,
      name: 'Alongamento de Isquiotibiais',
      model: 'standing_stretch',
      params: { type: 'hamstring' },
      durationSeconds: 3.8,
      muscles: REFERENCE_POSES_DATA['alongamento-isquiotibiais'].muscles,
      mus: REFERENCE_POSES_DATA['alongamento-isquiotibiais'].muscles,
      pose: standingStretchPose({ type: 'hamstring' }),
    };
  }

  if (lowerId.includes('peitoral')) {
    return {
      id,
      name: 'Alongamento de Peitoral',
      model: 'standing_stretch',
      params: { type: 'chest' },
      durationSeconds: 3.6,
      muscles: REFERENCE_POSES_DATA['alongamento-peitoral-parede'].muscles,
      mus: REFERENCE_POSES_DATA['alongamento-peitoral-parede'].muscles,
      pose: standingStretchPose({ type: 'chest' }),
    };
  }

  if (lowerId.includes('circulo') || lowerId.includes('rotacao') || lowerId.includes('mobilidade') || lowerId.includes('aquecimento') || lowerId.includes('passagem') || lowerId.includes('angels') || lowerId.includes('balanco')) {
    return {
      id,
      name: 'Mobilidade Ativa',
      model: 'standing_mobility',
      durationSeconds: 3.2,
      muscles: REFERENCE_POSES_DATA['circulos-ombro'].muscles,
      mus: REFERENCE_POSES_DATA['circulos-ombro'].muscles,
      pose: standingMobilityPose,
    };
  }

  // 16. Puxadas e Barras Fixas (Padrão canônico)
  const isDeadHang = lowerId.includes('dead-hang') || lowerId.includes('suspensao');
  const isLsit = lowerId.includes('lsit') || lowerId.includes('l-sit');
  return {
    id,
    name: 'Barra Fixa',
    model: 'pull',
    params: { barX: 215, barY: 34, isDeadHang, isLsit },
    durationSeconds: 3.6,
    muscles: lowerId.includes('chin') ? REFERENCE_POSES_DATA.chinup.muscles : REFERENCE_POSES_DATA.pullup.muscles,
    mus: lowerId.includes('chin') ? REFERENCE_POSES_DATA.chinup.muscles : REFERENCE_POSES_DATA.pullup.muscles,
    pose: pullPose({ barX: 215, barY: 34, isDeadHang, isLsit }),
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
