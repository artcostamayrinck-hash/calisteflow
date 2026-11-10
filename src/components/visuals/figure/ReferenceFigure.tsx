/**
 * Componente React ReferenceFigure — Renderizador do Protótipo Aprovado
 * - 30 FPS rígidos via requestAnimationFrame delta-tracking
 * - Pausa automática fora da tela (IntersectionObserver) e com aba oculta (visibilityState)
 * - Câmera lenta 0.5x
 * - Suporte a prefers-reduced-motion e configuração do app "Reproduzir animações"
 * - Saída SVG 400x300 idêntica ao protótipo aprovado
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  getReferenceExerciseDef,
  drawReferenceSvg,
  calculateEffortU,
  type ReferenceExerciseDef,
} from './referenceEngine';
import { prefersReducedMotion as checkReducedMotion, getAppSettings } from '../../../utils/appSettings';

export interface ReferenceFigureProps {
  exerciseId: string;
  isPaused?: boolean;
  playbackRate?: number; // 1.0 = normal, 0.5 = câmera lenta
  staticFrame?: number;  // 0 a 1 para travar em um frame específico (ex: u=0.5)
  className?: string;
  onTogglePlay?: () => void;
}

export const ReferenceFigure: React.FC<ReferenceFigureProps> = ({
  exerciseId,
  isPaused = false,
  playbackRate = 1.0,
  staticFrame,
  className = '',
  onTogglePlay,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Obtém definição de dados do exercício
  const exDef: ReferenceExerciseDef = useMemo(() => {
    return getReferenceExerciseDef(exerciseId);
  }, [exerciseId]);

  // Checagem de animações desativadas (sistema ou preferência do usuário)
  const isReducedMotion = useMemo(() => {
    const settings = getAppSettings();
    return checkReducedMotion() || settings.playAnimations === false;
  }, []);

  // Observador de visibilidade na tela
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Observador de aba visível / minimizada
  useEffect(() => {
    const handleVis = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, []);

  // Loop RAF limitado a 30 FPS
  const lastTimeRef = useRef<number>(0);
  const accumulatedMsRef = useRef<number>(0);
  const animIdRef = useRef<number>(0);

  const shouldAnimate = !isPaused && isVisible && !isReducedMotion && staticFrame === undefined;

  useEffect(() => {
    if (!shouldAnimate) return;

    lastTimeRef.current = performance.now();
    accumulatedMsRef.current = 0;
    const FRAME_BUDGET_MS = 1000 / 30; // 33.33ms = 30 FPS máximo

    const loop = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      accumulatedMsRef.current += delta;

      if (accumulatedMsRef.current >= FRAME_BUDGET_MS) {
        const deltaSeconds = (accumulatedMsRef.current / 1000) * playbackRate;
        accumulatedMsRef.current = 0;
        setElapsedSeconds(prev => (prev + deltaSeconds) % exDef.durationSeconds!);
      }

      animIdRef.current = requestAnimationFrame(loop);
    };

    animIdRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animIdRef.current);
  }, [shouldAnimate, playbackRate, exDef.durationSeconds]);

  // Calcula o valor atual de u (0..1)
  const u = useMemo(() => {
    if (staticFrame !== undefined) {
      return Math.max(0, Math.min(1, staticFrame));
    }
    if (isReducedMotion) {
      return 0.5; // Pose estática no ápice do esforço
    }
    return calculateEffortU(elapsedSeconds, exDef.durationSeconds);
  }, [staticFrame, isReducedMotion, elapsedSeconds, exDef.durationSeconds]);

  // Gera o SVG exato do protótipo aprovado
  const innerSvgContent = useMemo(() => {
    return drawReferenceSvg(exDef, u);
  }, [exDef, u]);

  return (
    <div
      ref={containerRef}
      onClick={onTogglePlay}
      className={`relative w-full aspect-[4/3] overflow-hidden select-none ${className}`}
      style={{ touchAction: 'manipulation' }}
      title={onTogglePlay ? (isPaused ? 'Reproduzir animação' : 'Pausar animação') : undefined}
    >
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full block"
        preserveAspectRatio="xMidYMid meet"
        dangerouslySetInnerHTML={{ __html: innerSvgContent }}
      />
    </div>
  );
};
