/**
 * Renderizadores de Estilo de Figura para CalisteFlow
 * Suporta os 5 estilos:
 * 1. Manequim Neutro
 * 2. Anatômico Simplificado
 * 3. Silhueta Sólida
 * 4. Contorno (Neon 2px)
 * 5. Raio-X (X-Ray)
 */

import React from 'react';
import type { SkeletonJoints, Point2D, FigureStyle, AvatarSettings } from './types';
import type { RenderedMuscleEllipse } from './muscles';
import {
  SKIN_TONE_PALETTES,
  HAIR_COLORS,
  STYLE_THEMES,
  FIGURE_PALETTE,
} from './constants';
import {
  createTaperedLimbPath,
  createShortsPath,
  createSneakerPath,
  createTankTopPath,
  createTShirtPath,
} from './geometry';

export interface StyleRendererProps {
  style: FigureStyle;
  joints: SkeletonJoints;
  widths: ReturnType<typeof import('./constants').getLimbWidths>;
  avatar: AvatarSettings;
  activeMuscles: RenderedMuscleEllipse[];
  torsoAngle: number;
  gazeOffset: Point2D;
}

export const renderFigureStyle = ({
  style,
  joints,
  widths,
  avatar,
  activeMuscles,
  torsoAngle,
  gazeOffset,
}: StyleRendererProps): React.ReactNode => {
  const skin = SKIN_TONE_PALETTES[avatar.skinTone] || SKIN_TONE_PALETTES.claro;
  const hairColor = HAIR_COLORS.preto;

  // Lado oposto (profundidade / trás)
  const backOffset = {
    x: FIGURE_PALETTE.backLimbOffsetX,
    y: FIGURE_PALETTE.backLimbOffsetY,
  };

  const backShoulder = joints.backShoulder ?? {
    x: joints.shoulder.x + backOffset.x,
    y: joints.shoulder.y + backOffset.y,
  };
  const backElbow = joints.backElbow ?? {
    x: joints.elbow.x + backOffset.x,
    y: joints.elbow.y + backOffset.y,
  };
  const backWrist = joints.backWrist ?? {
    x: joints.wrist.x + backOffset.x,
    y: joints.wrist.y + backOffset.y,
  };
  const backHand = joints.backHand ?? {
    x: joints.hand.x + backOffset.x,
    y: joints.hand.y + backOffset.y,
  };
  const backHip = joints.backHip ?? {
    x: joints.hip.x + backOffset.x,
    y: joints.hip.y + backOffset.y,
  };
  const backKnee = joints.backKnee ?? {
    x: joints.knee.x + backOffset.x,
    y: joints.knee.y + backOffset.y,
  };
  const backAnkle = joints.backAnkle ?? {
    x: joints.ankle.x + backOffset.x,
    y: joints.ankle.y + backOffset.y,
  };
  const backToe = joints.backToe ?? {
    x: joints.toe.x + backOffset.x,
    y: joints.toe.y + backOffset.y,
  };

  // ==========================================
  // ESTILO 1: MANEQUIM NEUTRO
  // ==========================================
  if (style === 'mannequin') {
    const { skinNearTop, skinNearBottom, skinBackTop, skinBackBottom, jointRing, jointStroke } = STYLE_THEMES.mannequin;

    const renderJointBall = (pt: Point2D, r: number = 4.5) => (
      <g key={`joint-${pt.x}-${pt.y}`}>
        <circle cx={pt.x} cy={pt.y} r={r} fill={jointRing} stroke={jointStroke} strokeWidth="1.5" />
        <circle cx={pt.x} cy={pt.y} r={r * 0.45} fill="#475569" />
      </g>
    );

    return (
      <g id="style-mannequin">
        <defs>
          <linearGradient id="mannequinNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skinNearTop} />
            <stop offset="100%" stopColor={skinNearBottom} />
          </linearGradient>
          <linearGradient id="mannequinBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skinBackTop} />
            <stop offset="100%" stopColor={skinBackBottom} />
          </linearGradient>
        </defs>

        {/* Lado oposto */}
        <g id="mannequin-back" opacity="0.6">
          <path d={createTaperedLimbPath(backHip, backKnee, widths.thigh.start, widths.thigh.end)} fill="url(#mannequinBack)" />
          <path d={createTaperedLimbPath(backKnee, backAnkle, widths.shin.start, widths.shin.end)} fill="url(#mannequinBack)" />
          <path d={createTaperedLimbPath(backAnkle, backToe, widths.foot.start, widths.foot.end)} fill="url(#mannequinBack)" />
          <path d={createTaperedLimbPath(backShoulder, backElbow, widths.upperArm.start, widths.upperArm.end)} fill="url(#mannequinBack)" />
          <path d={createTaperedLimbPath(backElbow, backWrist, widths.forearm.start, widths.forearm.end)} fill="url(#mannequinBack)" />
          <circle cx={backHand.x} cy={backHand.y} r={widths.handRadius} fill="url(#mannequinBack)" />
        </g>

        {/* Tronco */}
        <path d={createTaperedLimbPath(joints.shoulder, joints.hip, widths.torso.start, widths.torso.end)} fill="url(#mannequinNear)" />

        {/* Cabeça sem rosto, com visor clean de manequim */}
        <path d={createTaperedLimbPath(joints.shoulder, joints.neck, widths.neck.start, widths.neck.end)} fill="url(#mannequinNear)" />
        <circle cx={joints.head.x} cy={joints.head.y} r={widths.headRadius + 1} fill="url(#mannequinNear)" stroke={jointStroke} strokeWidth="1" />
        {/* Anel equatorial suave / visor estilizado */}
        <ellipse cx={joints.head.x + gazeOffset.x * 1.5} cy={joints.head.y + gazeOffset.y * 1.5} rx={widths.headRadius * 0.75} ry={3.5} fill="#64748B" opacity="0.7" />

        {/* Lado próximo */}
        <g id="mannequin-near">
          <path d={createTaperedLimbPath(joints.hip, joints.knee, widths.thigh.start, widths.thigh.end)} fill="url(#mannequinNear)" />
          <path d={createTaperedLimbPath(joints.knee, joints.ankle, widths.shin.start, widths.shin.end)} fill="url(#mannequinNear)" />
          <path d={createTaperedLimbPath(joints.ankle, joints.toe, widths.foot.start, widths.foot.end)} fill="url(#mannequinNear)" />

          <path d={createTaperedLimbPath(joints.shoulder, joints.elbow, widths.upperArm.start, widths.upperArm.end)} fill="url(#mannequinNear)" />
          <path d={createTaperedLimbPath(joints.elbow, joints.wrist, widths.forearm.start, widths.forearm.end)} fill="url(#mannequinNear)" />
          <circle cx={joints.hand.x} cy={joints.hand.y} r={widths.handRadius} fill="url(#mannequinNear)" />
        </g>

        {/* Articulações mecânicas proeminentes */}
        <g id="mannequin-joints">
          {renderJointBall(joints.shoulder, 5.5)}
          {renderJointBall(joints.elbow, 4.5)}
          {renderJointBall(joints.wrist, 4.0)}
          {renderJointBall(joints.hip, 6.0)}
          {renderJointBall(joints.knee, 5.0)}
          {renderJointBall(joints.ankle, 4.5)}
        </g>
      </g>
    );
  }

  // ==========================================
  // ESTILO 3: SILHUETA SÓLIDA
  // ==========================================
  if (style === 'silhouette') {
    const { fillNear, fillBack, backOpacity } = STYLE_THEMES.silhouette;

    return (
      <g id="style-silhouette">
        {/* Lado oposto */}
        <g id="silhouette-back" opacity={backOpacity} fill={fillBack}>
          <path d={createTaperedLimbPath(backHip, backKnee, widths.thigh.start, widths.thigh.end)} />
          <path d={createTaperedLimbPath(backKnee, backAnkle, widths.shin.start, widths.shin.end)} />
          <path d={createTaperedLimbPath(backAnkle, backToe, widths.foot.start, widths.foot.end)} />
          <path d={createTaperedLimbPath(backShoulder, backElbow, widths.upperArm.start, widths.upperArm.end)} />
          <path d={createTaperedLimbPath(backElbow, backWrist, widths.forearm.start, widths.forearm.end)} />
          <circle cx={backHand.x} cy={backHand.y} r={widths.handRadius} />
        </g>

        {/* Tronco, Pescoço e Cabeça */}
        <g id="silhouette-core" fill={fillNear}>
          <path d={createTaperedLimbPath(joints.shoulder, joints.hip, widths.torso.start, widths.torso.end)} />
          <path d={createTaperedLimbPath(joints.shoulder, joints.neck, widths.neck.start, widths.neck.end)} />
          <circle cx={joints.head.x} cy={joints.head.y} r={widths.headRadius + 1} />

          {/* Lado próximo */}
          <path d={createTaperedLimbPath(joints.hip, joints.knee, widths.thigh.start, widths.thigh.end)} />
          <path d={createTaperedLimbPath(joints.knee, joints.ankle, widths.shin.start, widths.shin.end)} />
          <path d={createTaperedLimbPath(joints.ankle, joints.toe, widths.foot.start, widths.foot.end)} />
          <path d={createTaperedLimbPath(joints.shoulder, joints.elbow, widths.upperArm.start, widths.upperArm.end)} />
          <path d={createTaperedLimbPath(joints.elbow, joints.wrist, widths.forearm.start, widths.forearm.end)} />
          <circle cx={joints.hand.x} cy={joints.hand.y} r={widths.handRadius} />
        </g>

        {/* Destaque muscular de alto contraste para treino */}
        <g id="silhouette-muscles">
          {activeMuscles.map(m => (
            <ellipse
              key={m.muscleId}
              cx={m.cx}
              cy={m.cy}
              rx={m.rx * 0.9}
              ry={m.ry * 0.9}
              transform={`rotate(${m.angleDeg} ${m.cx} ${m.cy})`}
              fill={m.color}
              opacity={Math.min(1.0, m.opacity * 1.25)}
            />
          ))}
        </g>
      </g>
    );
  }

  // ==========================================
  // ESTILO 4: CONTORNO (NEON 2px)
  // ==========================================
  if (style === 'outline') {
    const { strokeNear, strokeWidth, strokeBack, backOpacity } = STYLE_THEMES.outline;

    return (
      <g id="style-outline">
        {/* Lado oposto em traço mais fino e sutil */}
        <g id="outline-back" stroke={strokeBack} strokeWidth={strokeWidth - 0.5} fill="none" opacity={backOpacity}>
          <path d={createTaperedLimbPath(backHip, backKnee, widths.thigh.start, widths.thigh.end)} />
          <path d={createTaperedLimbPath(backKnee, backAnkle, widths.shin.start, widths.shin.end)} />
          <path d={createTaperedLimbPath(backAnkle, backToe, widths.foot.start, widths.foot.end)} />
          <path d={createTaperedLimbPath(backShoulder, backElbow, widths.upperArm.start, widths.upperArm.end)} />
          <path d={createTaperedLimbPath(backElbow, backWrist, widths.forearm.start, widths.forearm.end)} />
          <circle cx={backHand.x} cy={backHand.y} r={widths.handRadius} />
        </g>

        {/* Corpo principal em contorno ciano neon 2px */}
        <g id="outline-main" stroke={strokeNear} strokeWidth={strokeWidth} fill="rgba(34, 211, 238, 0.04)">
          <path d={createTaperedLimbPath(joints.shoulder, joints.hip, widths.torso.start, widths.torso.end)} />
          <path d={createTaperedLimbPath(joints.shoulder, joints.neck, widths.neck.start, widths.neck.end)} />
          <circle cx={joints.head.x} cy={joints.head.y} r={widths.headRadius} />

          {/* Lado próximo */}
          <path d={createTaperedLimbPath(joints.hip, joints.knee, widths.thigh.start, widths.thigh.end)} />
          <path d={createTaperedLimbPath(joints.knee, joints.ankle, widths.shin.start, widths.shin.end)} />
          <path d={createTaperedLimbPath(joints.ankle, joints.toe, widths.foot.start, widths.foot.end)} />

          <path d={createTaperedLimbPath(joints.shoulder, joints.elbow, widths.upperArm.start, widths.upperArm.end)} />
          <path d={createTaperedLimbPath(joints.elbow, joints.wrist, widths.forearm.start, widths.forearm.end)} />
          <circle cx={joints.hand.x} cy={joints.hand.y} r={widths.handRadius} />
        </g>

        {/* Nós articulares em anel neon */}
        <g id="outline-joints" stroke={strokeNear} strokeWidth="1.5" fill="#0A1222">
          <circle cx={joints.shoulder.x} cy={joints.shoulder.y} r="3.5" />
          <circle cx={joints.elbow.x} cy={joints.elbow.y} r="3.0" />
          <circle cx={joints.hip.x} cy={joints.hip.y} r="3.5" />
          <circle cx={joints.knee.x} cy={joints.knee.y} r="3.0" />
          <circle cx={joints.ankle.x} cy={joints.ankle.y} r="2.5" />
        </g>

        {/* Músculos destacados com preenchimento pontilhado/neon */}
        <g id="outline-muscles">
          {activeMuscles.map(m => (
            <ellipse
              key={m.muscleId}
              cx={m.cx}
              cy={m.cy}
              rx={m.rx}
              ry={m.ry}
              transform={`rotate(${m.angleDeg} ${m.cx} ${m.cy})`}
              fill={m.color}
              stroke={m.color}
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity={m.opacity * 0.9}
            />
          ))}
        </g>
      </g>
    );
  }

  // ==========================================
  // ESTILO 5: RAIO-X (X-RAY)
  // ==========================================
  if (style === 'xray') {
    const { boneFill, boneMarrow, jointSphere, vertebrae, glow } = STYLE_THEMES.xray;

    // Segmentos da coluna vertebral alinhada (7 vértebras simuladas do ombro ao quadril)
    const vertebraeDots: Point2D[] = [];
    for (let i = 1; i <= 7; i++) {
      const t = i / 8;
      vertebraeDots.push({
        x: joints.shoulder.x + (joints.hip.x - joints.shoulder.x) * t,
        y: joints.shoulder.y + (joints.hip.y - joints.shoulder.y) * t,
      });
    }

    const renderBone = (start: Point2D, end: Point2D, rStart: number, rEnd: number) => (
      <g key={`bone-${start.x}-${start.y}-${end.x}`}>
        <path d={createTaperedLimbPath(start, end, rStart, rEnd)} fill={boneFill} />
        {/* Canal medular interno */}
        <line
          x1={start.x + (end.x - start.x) * 0.15}
          y1={start.y + (end.y - start.y) * 0.15}
          x2={end.x - (end.x - start.x) * 0.15}
          y2={end.y - (end.y - start.y) * 0.15}
          stroke={boneMarrow}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
      </g>
    );

    return (
      <g id="style-xray">
        {/* Halo radiográfico de fundo */}
        <ellipse
          cx={(joints.shoulder.x + joints.hip.x) / 2}
          cy={(joints.shoulder.y + joints.hip.y) / 2}
          rx="60"
          ry="75"
          fill={glow}
          opacity="0.08"
        />

        {/* Esqueleto - Lado Oposto */}
        <g id="xray-back" opacity="0.45">
          {renderBone(backHip, backKnee, 14, 11)}
          {renderBone(backKnee, backAnkle, 10, 7)}
          {renderBone(backShoulder, backElbow, 9, 7)}
          {renderBone(backElbow, backWrist, 7, 5)}
        </g>

        {/* Coluna Vertebral & Caixa Torácica Radiográfica */}
        <g id="xray-spine">
          {/* Caixa torácica translúcida */}
          <ellipse
            cx={joints.shoulder.x + (joints.hip.x - joints.shoulder.x) * 0.35}
            cy={joints.shoulder.y + (joints.hip.y - joints.shoulder.y) * 0.35}
            rx={widths.torso.start * 0.45}
            ry={widths.torso.start * 0.6}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
          {/* Vértebras empilhadas */}
          {vertebraeDots.map((pt, idx) => (
            <ellipse
              key={`vert-${idx}`}
              cx={pt.x}
              cy={pt.y}
              rx={widths.torso.midWaist ? widths.torso.midWaist * 0.28 : 5}
              ry="2"
              fill={vertebrae}
              opacity="0.9"
            />
          ))}
        </g>

        {/* Crânio Radiográfico */}
        <g id="xray-skull">
          <circle cx={joints.head.x} cy={joints.head.y} r={widths.headRadius - 1} fill={boneFill} />
          {/* Órbita ocular e cavidade temporal */}
          <circle cx={joints.head.x + gazeOffset.x * 2.5 + 2} cy={joints.head.y + gazeOffset.y * 1.5 - 1} r="2.5" fill="#0A1222" opacity="0.75" />
          <ellipse cx={joints.head.x + 3} cy={joints.head.y + 6} rx="4" ry="2" fill="rgba(255,255,255,0.7)" />
        </g>

        {/* Esqueleto - Lado Próximo */}
        <g id="xray-near">
          {renderBone(joints.hip, joints.knee, 16, 12)}
          {renderBone(joints.knee, joints.ankle, 11, 8)}
          {renderBone(joints.ankle, joints.toe, 6, 4)}

          {renderBone(joints.shoulder, joints.elbow, 10, 8)}
          {renderBone(joints.elbow, joints.wrist, 8, 6)}
          <circle cx={joints.hand.x} cy={joints.hand.y} r="3.5" fill={boneFill} />
        </g>

        {/* Côndilos e Cápsulas Articulares Esféricas */}
        <g id="xray-joint-capsules">
          <circle cx={joints.shoulder.x} cy={joints.shoulder.y} r="5" fill={jointSphere} />
          <circle cx={joints.elbow.x} cy={joints.elbow.y} r="4.2" fill={jointSphere} />
          <circle cx={joints.wrist.x} cy={joints.wrist.y} r="3.2" fill={jointSphere} />
          <circle cx={joints.hip.x} cy={joints.hip.y} r="6.0" fill={jointSphere} />
          <circle cx={joints.knee.x} cy={joints.knee.y} r="5.0" fill={jointSphere} />
          <circle cx={joints.ankle.x} cy={joints.ankle.y} r="4.0" fill={jointSphere} />
        </g>

        {/* Músculos destacados como vetores translúcidos de tensão */}
        <g id="xray-muscles">
          {activeMuscles.map(m => (
            <ellipse
              key={m.muscleId}
              cx={m.cx}
              cy={m.cy}
              rx={m.rx * 0.85}
              ry={m.ry * 0.8}
              transform={`rotate(${m.angleDeg} ${m.cx} ${m.cy})`}
              fill={m.color}
              opacity={m.opacity * 0.85}
            />
          ))}
        </g>
      </g>
    );
  }

  // ==========================================
  // ESTILO 2: ANATÔMICO SIMPLIFICADO (PADRÃO DETALHADO)
  // ==========================================
  return (
    <g id="style-anatomical">
      <defs>
        {/* Degradê de pele próximo */}
        <linearGradient id="cfSkinNearCustom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skin.skinTop} />
          <stop offset="100%" stopColor={skin.skinBottom} />
        </linearGradient>

        {/* Degradê de pele traseiro */}
        <linearGradient id="cfSkinBackCustom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skin.skinBackTop} />
          <stop offset="100%" stopColor={skin.skinBackBottom} />
        </linearGradient>

        {/* Padrão de listras diagonais para modo daltônico */}
        <pattern id="cf-colorblind-stripes" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#FFFFFF" strokeWidth="2" opacity="0.35" />
        </pattern>
      </defs>

      {/* 1. Lado Oposto (Perna e Braço Traseiros) */}
      <g id="opposite-side-limbs" opacity="0.9">
        <path d={createTaperedLimbPath(backHip, backKnee, widths.thigh.start, widths.thigh.end)} fill="url(#cfSkinBackCustom)" />
        <path d={createTaperedLimbPath(backKnee, backAnkle, widths.shin.start, widths.shin.end)} fill="url(#cfSkinBackCustom)" />
        <path d={createSneakerPath(backAnkle, backToe)} fill="#CBD5E1" opacity="0.8" />

        <path d={createTaperedLimbPath(backShoulder, backElbow, widths.upperArm.start, widths.upperArm.end)} fill="url(#cfSkinBackCustom)" />
        <path d={createTaperedLimbPath(backElbow, backWrist, widths.forearm.start, widths.forearm.end)} fill="url(#cfSkinBackCustom)" />
        <circle cx={backHand.x} cy={backHand.y} r={widths.handRadius} fill="url(#cfSkinBackCustom)" />
      </g>

      {/* 2. Tronco e Vestimenta */}
      <g id="torso-and-clothing">
        <path d={createTaperedLimbPath(joints.shoulder, joints.hip, widths.torso.start, widths.torso.end)} fill="url(#cfSkinNearCustom)" />

        {/* Roupa Superior: Regata, Camiseta ou Bermuda com Tronco Nu */}
        {avatar.clothing === 'regata' && (
          <path
            d={createTankTopPath(joints.shoulder, joints.hip, torsoAngle, widths.torso.start, widths.torso.end)}
            fill="#1E293B"
            stroke="#334155"
            strokeWidth="0.8"
          />
        )}
        {avatar.clothing === 'camiseta' && (
          <g id="clothing-tshirt">
            {(() => {
              const { torso, sleeve } = createTShirtPath(
                joints.shoulder,
                joints.hip,
                joints.elbow,
                torsoAngle,
                widths.torso.start,
                widths.torso.end
              );
              return (
                <>
                  <path d={torso} fill="#1E293B" stroke="#334155" strokeWidth="0.8" />
                  <path d={sleeve} fill="#1E293B" />
                </>
              );
            })()}
          </g>
        )}

        {/* Bermuda Atlética */}
        <path d={createShortsPath(joints.hip, joints.knee, torsoAngle)} fill={FIGURE_PALETTE.shorts} />
        <circle cx={joints.hip.x} cy={joints.hip.y} r={widths.torso.end / 2 + 1} fill={FIGURE_PALETTE.shorts} />
      </g>

      {/* 3. Pescoço e Cabeça */}
      <g id="head-and-neck">
        <path d={createTaperedLimbPath(joints.shoulder, joints.neck, widths.neck.start, widths.neck.end)} fill="url(#cfSkinNearCustom)" />

        {/* Cabelo conforme estilo */}
        {avatar.hairStyle !== 'careca' && (
          <g id="avatar-hair">
            {/* Base do cabelo */}
            <circle cx={joints.head.x} cy={joints.head.y} r={widths.hairRadius} fill={hairColor} />

            {/* Cabelo longo: mechas caindo para trás */}
            {avatar.hairStyle === 'longo' && (
              <path
                d={`M ${joints.head.x - 10} ${joints.head.y} Q ${joints.head.x - 18} ${joints.head.y + 18} ${joints.head.x - 6} ${joints.head.y + 26} L ${joints.head.x} ${joints.head.y + 12} Z`}
                fill={hairColor}
              />
            )}

            {/* Cabelo preso: coque ou rabo de cavalo */}
            {avatar.hairStyle === 'preso' && (
              <circle cx={joints.head.x - 13} cy={joints.head.y - 4} r="5" fill={hairColor} />
            )}
          </g>
        )}

        {/* Rosto deslocado no vetor do olhar */}
        <circle
          cx={joints.head.x + gazeOffset.x}
          cy={joints.head.y + gazeOffset.y}
          r={widths.headRadius}
          fill="url(#cfSkinNearCustom)"
        />

        {/* Olho direcional */}
        <circle
          cx={joints.head.x + gazeOffset.x * 2.2 + 3}
          cy={joints.head.y + gazeOffset.y * 1.5 - 1}
          r={1.3}
          fill={FIGURE_PALETTE.faceEye}
        />
      </g>

      {/* 4. Lado Próximo (Perna e Braço em Primeiro Plano) */}
      <g id="near-side-limbs">
        <path d={createTaperedLimbPath(joints.hip, joints.knee, widths.thigh.start, widths.thigh.end)} fill="url(#cfSkinNearCustom)" />
        <path d={createTaperedLimbPath(joints.knee, joints.ankle, widths.shin.start, widths.shin.end)} fill="url(#cfSkinNearCustom)" />
        <path d={createSneakerPath(joints.ankle, joints.toe)} fill={FIGURE_PALETTE.sneaker} />
        <line
          x1={joints.ankle.x - 2}
          y1={joints.ankle.y + 4}
          x2={joints.toe.x + 2}
          y2={joints.toe.y + 4}
          stroke={FIGURE_PALETTE.sneakerSole}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <path d={createTaperedLimbPath(joints.shoulder, joints.elbow, widths.upperArm.start, widths.upperArm.end)} fill="url(#cfSkinNearCustom)" />
        <path d={createTaperedLimbPath(joints.elbow, joints.wrist, widths.forearm.start, widths.forearm.end)} fill="url(#cfSkinNearCustom)" />
        <circle cx={joints.hand.x} cy={joints.hand.y} r={widths.handRadius} fill="url(#cfSkinNearCustom)" />
      </g>

      {/* 5. Músculos Destacados (com suporte a Modo Daltônico com listras) */}
      <g id="highlighted-muscles" filter="url(#cfMuscleGlow)">
        {activeMuscles.map(m => (
          <g key={m.muscleId}>
            {/* Elipse colorida com opacidade dinâmica */}
            <ellipse
              cx={m.cx}
              cy={m.cy}
              rx={m.rx}
              ry={m.ry}
              transform={`rotate(${m.angleDeg} ${m.cx} ${m.cy})`}
              fill={m.color}
              opacity={m.opacity}
            />

            {/* Listras sobrepostas no Modo Daltônico */}
            {avatar.colorBlindMode && (
              <ellipse
                cx={m.cx}
                cy={m.cy}
                rx={m.rx}
                ry={m.ry}
                transform={`rotate(${m.angleDeg} ${m.cx} ${m.cy})`}
                fill="url(#cf-colorblind-stripes)"
                stroke="#FFFFFF"
                strokeWidth="0.8"
                opacity={m.opacity * 0.9}
              />
            )}
          </g>
        ))}
      </g>
    </g>
  );
};
