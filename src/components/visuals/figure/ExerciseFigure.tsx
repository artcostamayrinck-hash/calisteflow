/**
 * Componente Central de Animação em SVG Vetorial — ExerciseFigure
 * Renderiza a figura humana anatômica em loop contínuo a 30 FPS com IK e músculos dinâmicos
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import type { ExerciseAnimationDef, PoseState } from './types';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND_Y,
  LIMB_WIDTHS,
  STAGE_THEME,
  FIGURE_PALETTE,
} from './constants';
import { createTaperedLimbPath, createShortsPath, createSneakerPath } from './geometry';
import { calculateActiveMuscles } from './muscles';
import { renderPropElement } from './props';

export interface ExerciseFigureProps {
  animationDef: ExerciseAnimationDef;
  isPaused?: boolean;
  playbackRate?: number; // 1.0 = normal, 0.5 = câmera lenta
  staticFrame?: number;  // 0 a 1 para congelar em um quadro específico
  className?: string;
  onTogglePlay?: () => void;
  showControls?: boolean;
}

export const ExerciseFigure: React.FC<ExerciseFigureProps> = ({
  animationDef,
  isPaused = false,
  playbackRate = 1.0,
  staticFrame,
  className = '',
  onTogglePlay,
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [internalPaused, setInternalPaused] = useState<boolean>(false);
  const [currentNormTime, setCurrentNormTime] = useState<number>(staticFrame ?? 0);

  const effectivePaused = isPaused || internalPaused;

  // Respeito a prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const isStatic = staticFrame !== undefined || prefersReducedMotion;
  const activeNormTime = isStatic ? (staticFrame ?? 0.5) : currentNormTime;

  // Observador de visibilidade (IntersectionObserver) para pausar fora da tela
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Observador de aba oculta (document.visibilityState)
  useEffect(() => {
    const handleVisChange = () => {
      if (document.hidden) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisChange);
    return () => document.removeEventListener('visibilitychange', handleVisChange);
  }, []);

  // Refs de tempo e id do frame para o loop RAF estável sem reatribuições pós-render
  const lastTimestampRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const animIdRef = useRef<number>(0);

  // Loop de Animação limitado estritamente a 30 FPS para máxima economia de bateria
  useEffect(() => {
    if (isStatic || effectivePaused || !isVisible) return;

    lastTimestampRef.current = performance.now();
    accumulatedTimeRef.current = 0;
    const frameIntervalMs = 1000 / 30; // 33.3 ms (30 FPS budget)

    const tick = (now: number) => {
      const deltaMs = now - lastTimestampRef.current;
      lastTimestampRef.current = now;

      accumulatedTimeRef.current += deltaMs;

      if (accumulatedTimeRef.current >= frameIntervalMs) {
        const durationMs = animationDef.durationSeconds * 1000;
        const progressDelta = (accumulatedTimeRef.current / durationMs) * playbackRate;
        accumulatedTimeRef.current = 0;

        setCurrentNormTime(prev => (prev + progressDelta) % 1.0);
      }

      animIdRef.current = requestAnimationFrame(tick);
    };

    animIdRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animIdRef.current);
  }, [
    isStatic,
    effectivePaused,
    isVisible,
    animationDef.durationSeconds,
    playbackRate,
  ]);

  // Calcula a pose para o tempo normalizado atual
  const pose: PoseState = useMemo(() => {
    return animationDef.generatePose(activeNormTime);
  }, [animationDef, activeNormTime]);

  // Calcula os músculos destacados para a pose
  const activeMuscles = useMemo(() => {
    return calculateActiveMuscles(
      pose.joints,
      animationDef.primaryMuscles,
      animationDef.secondaryMuscles,
      pose.effort
    );
  }, [pose, animationDef.primaryMuscles, animationDef.secondaryMuscles]);

  const togglePause = useCallback(() => {
    if (onTogglePlay) {
      onTogglePlay();
    } else {
      setInternalPaused(prev => !prev);
    }
  }, [onTogglePlay]);

  const { joints } = pose;

  // Lado oposto (profundidade de trás com pele mais escura)
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

  // Ângulo do tronco
  const torsoAngle = Math.atan2(
    joints.hip.y - joints.shoulder.y,
    joints.hip.x - joints.shoulder.x
  );

  // Vetor do olhar (gaze)
  const gazeAngle = pose.gazeAngle ?? 0;
  const gazeOffset = {
    x: Math.cos(gazeAngle) * 3,
    y: Math.sin(gazeAngle) * 3,
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] max-w-[500px] select-none rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl ${className}`}
      style={{ touchAction: 'manipulation' }}
    >
      <svg
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        className="w-full h-full block"
        aria-label={`Ilustração anatômica animada de ${animationDef.name}`}
        role="img"
      >
        <defs>
          {/* Fundo degradê */}
          <linearGradient id="cfStageBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={STAGE_THEME.bgGradientTop} />
            <stop offset="100%" stopColor={STAGE_THEME.bgGradientBottom} />
          </linearGradient>

          {/* Pele lado próximo (degradê vertical contínuo no cenário) */}
          <linearGradient id="cfSkinNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={FIGURE_PALETTE.skinTop} />
            <stop offset="100%" stopColor={FIGURE_PALETTE.skinBottom} />
          </linearGradient>

          {/* Pele lado oposto (mais escura para profundidade) */}
          <linearGradient id="cfSkinBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={FIGURE_PALETTE.skinBackTop} />
            <stop offset="100%" stopColor={FIGURE_PALETTE.skinBackBottom} />
          </linearGradient>

          {/* Sombra suave dos músculos */}
          <filter id="cfMuscleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Cenário de Fundo */}
        <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#cfStageBg)" />

        {/* Faixa e Linha do Chão */}
        <rect
          x="0"
          y={GROUND_Y}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT - GROUND_Y}
          fill={STAGE_THEME.groundBar}
        />
        <line
          x1="0"
          y1={GROUND_Y}
          x2={CANVAS_WIDTH}
          y2={GROUND_Y}
          stroke={STAGE_THEME.groundLine}
          strokeWidth="2"
        />

        {/* Sombra Elíptica no Chão */}
        <ellipse
          cx={pose.shadow.cx}
          cy={pose.shadow.cy ?? GROUND_Y}
          rx={pose.shadow.rx ?? STAGE_THEME.shadowWidth / 2}
          ry={pose.shadow.ry ?? STAGE_THEME.shadowHeight / 2}
          fill="rgba(0,0,0,0.4)"
        />

        {/* 2. Props de Trás (poste de barra, parede, estrutura traseira de paralelas) */}
        {renderPropElement(pose.prop, true)}

        {/* 3. Lado Oposto (Perna e Braço Traseiros) */}
        <g id="opposite-side-limbs" opacity="0.9">
          {/* Coxa e Canela Traseiras */}
          <path
            d={createTaperedLimbPath(backHip, backKnee, LIMB_WIDTHS.thigh.start, LIMB_WIDTHS.thigh.end)}
            fill="url(#cfSkinBack)"
          />
          <path
            d={createTaperedLimbPath(backKnee, backAnkle, LIMB_WIDTHS.shin.start, LIMB_WIDTHS.shin.end)}
            fill="url(#cfSkinBack)"
          />
          {/* Tênis Traseiro */}
          <path d={createSneakerPath(backAnkle, backToe)} fill="#CBD5E1" opacity="0.8" />

          {/* Braço e Antebraço Traseiros */}
          <path
            d={createTaperedLimbPath(backShoulder, backElbow, LIMB_WIDTHS.upperArm.start, LIMB_WIDTHS.upperArm.end)}
            fill="url(#cfSkinBack)"
          />
          <path
            d={createTaperedLimbPath(backElbow, backWrist, LIMB_WIDTHS.forearm.start, LIMB_WIDTHS.forearm.end)}
            fill="url(#cfSkinBack)"
          />
          <circle cx={backHand.x} cy={backHand.y} r={LIMB_WIDTHS.handRadius} fill="url(#cfSkinBack)" />
        </g>

        {/* 4. Tronco com Bermuda */}
        <g id="torso-and-clothing">
          {/* Tronco Nu (para visibilidade anatômica dos músculos) */}
          <path
            d={createTaperedLimbPath(joints.shoulder, joints.hip, LIMB_WIDTHS.torso.start, LIMB_WIDTHS.torso.end)}
            fill="url(#cfSkinNear)"
          />

          {/* Bermuda Cobrindo Quadril e Topo da Coxa */}
          <path d={createShortsPath(joints.hip, joints.knee, torsoAngle)} fill={FIGURE_PALETTE.shorts} />
          {/* Cós elástico sutil */}
          <circle cx={joints.hip.x} cy={joints.hip.y} r={LIMB_WIDTHS.torso.end / 2 + 1} fill={FIGURE_PALETTE.shorts} />
        </g>

        {/* 5. Pescoço e Cabeça com Rosto e Cabelo */}
        <g id="head-and-neck">
          {/* Pescoço */}
          <path
            d={createTaperedLimbPath(joints.shoulder, joints.neck, LIMB_WIDTHS.neck.start, LIMB_WIDTHS.neck.end)}
            fill="url(#cfSkinNear)"
          />

          {/* Cabelo (círculo r=13) */}
          <circle cx={joints.head.x} cy={joints.head.y} r={LIMB_WIDTHS.hairRadius} fill={FIGURE_PALETTE.hair} />

          {/* Rosto deslocado na direção do olhar (r=11) */}
          <circle
            cx={joints.head.x + gazeOffset.x}
            cy={joints.head.y + gazeOffset.y}
            r={LIMB_WIDTHS.headRadius}
            fill="url(#cfSkinNear)"
          />

          {/* Olho discreto acompanhando a direção do olhar */}
          <circle
            cx={joints.head.x + gazeOffset.x * 2.2 + 3}
            cy={joints.head.y + gazeOffset.y * 1.5 - 1}
            r={1.3}
            fill={FIGURE_PALETTE.faceEye}
          />
        </g>

        {/* 6. Lado Próximo (Perna e Braço em Primeiro Plano) */}
        <g id="near-side-limbs">
          {/* Coxa e Canela Próximas */}
          <path
            d={createTaperedLimbPath(joints.hip, joints.knee, LIMB_WIDTHS.thigh.start, LIMB_WIDTHS.thigh.end)}
            fill="url(#cfSkinNear)"
          />
          <path
            d={createTaperedLimbPath(joints.knee, joints.ankle, LIMB_WIDTHS.shin.start, LIMB_WIDTHS.shin.end)}
            fill="url(#cfSkinNear)"
          />
          {/* Tênis Claro */}
          <path d={createSneakerPath(joints.ankle, joints.toe)} fill={FIGURE_PALETTE.sneaker} />
          {/* Sola do Tênis */}
          <line
            x1={joints.ankle.x - 2}
            y1={joints.ankle.y + 4}
            x2={joints.toe.x + 2}
            y2={joints.toe.y + 4}
            stroke={FIGURE_PALETTE.sneakerSole}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Braço e Antebraço Próximos */}
          <path
            d={createTaperedLimbPath(joints.shoulder, joints.elbow, LIMB_WIDTHS.upperArm.start, LIMB_WIDTHS.upperArm.end)}
            fill="url(#cfSkinNear)"
          />
          <path
            d={createTaperedLimbPath(joints.elbow, joints.wrist, LIMB_WIDTHS.forearm.start, LIMB_WIDTHS.forearm.end)}
            fill="url(#cfSkinNear)"
          />
          <circle cx={joints.hand.x} cy={joints.hand.y} r={LIMB_WIDTHS.handRadius} fill="url(#cfSkinNear)" />
        </g>

        {/* 7. Músculos Destacados (Elipses com Opacidade Dinâmica) */}
        <g id="highlighted-muscles" filter="url(#cfMuscleGlow)">
          {activeMuscles.map(m => (
            <ellipse
              key={m.muscleId}
              cx={m.cx}
              cy={m.cy}
              rx={m.rx}
              ry={m.ry}
              transform={`rotate(${m.angleDeg} ${m.cx} ${m.cy})`}
              fill={m.color}
              opacity={m.opacity}
            />
          ))}
        </g>

        {/* 8. Props da Frente (barra frontal, pegadas, apoios) */}
        {renderPropElement(pose.prop, false)}
      </svg>

      {/* Alvo de toque acessível para Pausa/Play com 48px de área de acionamento */}
      {showControls && (
        <button
          type="button"
          onClick={togglePause}
          className="absolute top-2.5 right-2.5 min-w-[48px] min-h-[48px] flex items-center justify-center p-2 rounded-xl bg-slate-950/75 hover:bg-slate-900 border border-white/10 text-slate-300 hover:text-white backdrop-blur-md active:scale-95 transition shadow-lg cursor-pointer"
          title={effectivePaused ? 'Reproduzir animação' : 'Pausar animação'}
          aria-label={effectivePaused ? 'Reproduzir animação' : 'Pausar animação'}
        >
          {effectivePaused ? (
            <svg className="w-4 h-4 fill-emerald-400" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          ) : (
            <svg className="w-4 h-4 fill-emerald-400" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          )}
        </button>
      )}

      {/* Indicador de Esforço / Fase no Canto Inferior */}
      <div className="absolute bottom-2 left-2.5 flex items-center gap-2 pointer-events-none">
        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-950/80 border border-white/10 text-slate-300 backdrop-blur-sm">
          {animationDef.familyName}
        </span>
        {playbackRate === 0.5 && (
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            0.5x
          </span>
        )}
      </div>
    </div>
  );
};
