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
import { getAvatarSettings } from '../../../utils/appSettings';

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
