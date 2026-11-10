/**
 * Componente Central de Animação em SVG Vetorial — ExerciseFigure
 * Renderiza a figura humana anatômica em loop contínuo a 30 FPS com IK e músculos dinâmicos
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import type { ExerciseAnimationDef, PoseState, FigureStyle, AvatarSettings } from './types';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND_Y,
  STAGE_THEME,
  FIGURE_PALETTE,
  getLimbWidths,
} from './constants';
import { calculateActiveMuscles } from './muscles';
import { renderPropElement } from './props';
import { renderFigureStyle } from './renderers';
import {
  getAvatarSettings,
  prefersReducedMotion as checkReducedMotionSetting,
} from '../../../utils/appSettings';

interface FramedViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const viewBoxCache = new Map<string, FramedViewBox>();

export function computeFramedViewBox(animationDef: ExerciseAnimationDef): FramedViewBox {
  const cached = viewBoxCache.get(animationDef.exerciseId);
  if (cached) return cached;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const samples = [0, 0.2, 0.4, 0.5, 0.7, 0.85, 1.0];
  for (const t of samples) {
    try {
      const p = animationDef.generatePose(t);
      const j = p.joints;
      const keyPoints = [
        j.shoulder,
        j.elbow,
        j.wrist,
        j.hand,
        j.hip,
        j.knee,
        j.ankle,
        j.toe,
        j.head,
      ];
      if (j.backShoulder) keyPoints.push(j.backShoulder);
      if (j.backElbow) keyPoints.push(j.backElbow);
      if (j.backKnee) keyPoints.push(j.backKnee);
      if (j.backToe) keyPoints.push(j.backToe);

      for (const pt of keyPoints) {
        if (Number.isFinite(pt.x) && Number.isFinite(pt.y)) {
          if (pt.x < minX) minX = pt.x;
          if (pt.x > maxX) maxX = pt.x;
          if (pt.y < minY) minY = pt.y;
          if (pt.y > maxY) maxY = pt.y;
        }
      }
    } catch {
      // fallback se pose falhar
    }
  }

  if (!Number.isFinite(minX) || !Number.isFinite(maxX) || !Number.isFinite(minY) || !Number.isFinite(maxY)) {
    const fallback = { x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT };
    viewBoxCache.set(animationDef.exerciseId, fallback);
    return fallback;
  }

  // Padding anatômico (cabeça com cabelo, espessura dos membros e tênis)
  minX -= 16;
  maxX += 16;
  minY -= 16;
  maxY += 10;

  const motionWidth = maxX - minX;
  const motionHeight = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  // Ajuste de escala: a figura deve ocupar cerca de 70 a 80% (alvo ~75%) da altura do quadro,
  // com margem de segurança de ~8% nos limites
  let desiredHeight = motionHeight / 0.75;
  let desiredWidth = desiredHeight * (400 / 300);

  // Garante que a largura caiba com margem de 8%
  if (desiredWidth < motionWidth / 0.84) {
    desiredWidth = motionWidth / 0.84;
    desiredHeight = desiredWidth * (300 / 400);
  }

  // Limita os extremos de zoom para manter naturalidade visual
  desiredHeight = Math.max(160, Math.min(300, desiredHeight));
  desiredWidth = desiredHeight * (400 / 300);

  let viewX = centerX - desiredWidth / 2;
  let viewY = centerY - desiredHeight / 2;

  // Se o exercício ocorre no solo (GROUND_Y = 272), mantém a faixa de chão visível
  if (maxY >= GROUND_Y - 30) {
    const groundMargin = 16;
    if (viewY + desiredHeight < GROUND_Y + groundMargin) {
      viewY = GROUND_Y + groundMargin - desiredHeight;
    }
  }

  // Se o exercício ocorre suspenso em barra alta (y <= 70), garante espaço no topo
  if (minY <= 70) {
    if (viewY > 6) {
      viewY = 6;
    }
  }

  const result: FramedViewBox = {
    x: Math.round(viewX),
    y: Math.round(viewY),
    width: Math.round(desiredWidth),
    height: Math.round(desiredHeight),
  };

  viewBoxCache.set(animationDef.exerciseId, result);
  return result;
}

export interface ExerciseFigureProps {
  animationDef: ExerciseAnimationDef;
  isPaused?: boolean;
  playbackRate?: number; // 1.0 = normal, 0.5 = câmera lenta
  staticFrame?: number;  // 0 a 1 para congelar em um quadro específico
  className?: string;
  onTogglePlay?: () => void;
  showControls?: boolean;
  style?: FigureStyle;
  avatarSettings?: Partial<AvatarSettings>;
}

export const ExerciseFigure: React.FC<ExerciseFigureProps> = ({
  animationDef,
  isPaused = false,
  playbackRate = 1.0,
  staticFrame,
  className = '',
  onTogglePlay,
  showControls = true,
  style,
  avatarSettings,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [internalPaused, setInternalPaused] = useState<boolean>(false);
  const [currentNormTime, setCurrentNormTime] = useState<number>(staticFrame ?? 0);

  const effectivePaused = isPaused || internalPaused;

  // Respeito a prefers-reduced-motion e opção "Reproduzir Animações" em Ajustes
  const prefersReducedMotion = useMemo(() => {
    return checkReducedMotionSetting();
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

  // Configurações do Avatar e Estilo
  const activeAvatar: AvatarSettings = useMemo(() => {
    const globalAvatar = getAvatarSettings();
    return {
      ...globalAvatar,
      ...(avatarSettings || {}),
      preferredStyle: style || avatarSettings?.preferredStyle || globalAvatar.preferredStyle || 'anatomical',
    };
  }, [style, avatarSettings]);

  const currentStyle: FigureStyle = activeAvatar.preferredStyle;
  const widths = useMemo(
    () => getLimbWidths(activeAvatar.gender, activeAvatar.biotype),
    [activeAvatar.gender, activeAvatar.biotype]
  );

  // Calcula os músculos destacados para a pose (considerando Modo Daltônico)
  const activeMuscles = useMemo(() => {
    return calculateActiveMuscles(
      pose.joints,
      animationDef.primaryMuscles,
      animationDef.secondaryMuscles,
      pose.effort,
      activeAvatar.colorBlindMode
    );
  }, [pose, animationDef.primaryMuscles, animationDef.secondaryMuscles, activeAvatar.colorBlindMode]);

  const togglePause = useCallback(() => {
    if (onTogglePlay) {
      onTogglePlay();
    } else {
      setInternalPaused(prev => !prev);
    }
  }, [onTogglePlay]);

  const { joints } = pose;

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

  const viewBox = useMemo(() => computeFramedViewBox(animationDef), [animationDef]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] max-w-[500px] select-none rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl ${className}`}
      style={{ touchAction: 'manipulation' }}
    >
      <svg
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
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

          {/* Sombra suave e contorno dos músculos */}
          <filter id="cfMuscleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Cenário de Fundo Cobrindo todo o ViewBox */}
        <rect
          x={viewBox.x - 50}
          y={viewBox.y - 50}
          width={viewBox.width + 100}
          height={viewBox.height + 100}
          fill="url(#cfStageBg)"
        />

        {/* Faixa e Linha do Chão Dinâmica */}
        <rect
          x={viewBox.x - 200}
          y={GROUND_Y}
          width={viewBox.width + 400}
          height={Math.max(120, viewBox.y + viewBox.height - GROUND_Y + 100)}
          fill={STAGE_THEME.groundBar}
        />
        <line
          x1={viewBox.x - 200}
          y1={GROUND_Y}
          x2={viewBox.x + viewBox.width + 200}
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

        {/* 3 a 7. Renderização da Figura no Estilo Ativo */}
        {renderFigureStyle({
          style: currentStyle,
          joints,
          widths,
          avatar: activeAvatar,
          activeMuscles,
          torsoAngle,
          gazeOffset,
        })}

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
