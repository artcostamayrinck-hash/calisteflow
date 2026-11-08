import React, { useState, useEffect, useRef } from 'react';
import type { Exercise } from '../../types';
import { ExercisePostureVisual } from '../visuals/ExercisePostureVisual';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Sparkles,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';

interface ExerciseVideoPlayerProps {
  exercise: Exercise;
  isPaused?: boolean;
  phase?: 'exercise' | 'rest';
  className?: string;
  autoLoop?: boolean;
  allowToggleMode?: boolean;
  defaultMode?: 'video' | 'posture';
  compact?: boolean;
}

export const ExerciseVideoPlayer: React.FC<ExerciseVideoPlayerProps> = ({
  exercise,
  isPaused = false,
  phase = 'exercise',
  className = '',
  autoLoop = true,
  allowToggleMode = true,
  defaultMode = 'video',
  compact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [viewMode, setViewMode] = useState<'video' | 'posture'>(defaultMode);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(compact);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMuted = true;

  useBodyScrollLock(isFullscreen, () => setIsFullscreen(false));

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isVideoFormat = Boolean(
    exercise.videoUrl &&
      (exercise.videoUrl.endsWith('.mp4') ||
        exercise.videoUrl.endsWith('.webm') ||
        exercise.videoUrl.endsWith('.mov') ||
        exercise.videoUrl.includes('video'))
  );

  // Auto pause/play on workout state change (to conserve battery in rest or paused states)
  useEffect(() => {
    const shouldPlay = !isPaused && phase === 'exercise' && !isCollapsed;
    setIsPlaying(shouldPlay);

    if (videoRef.current) {
      if (shouldPlay) {
        videoRef.current.play().catch(() => {
          // Autoplay policy prevented immediate playback
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPaused, phase, isCollapsed]);

  // Handle visibility changes (phone screen lock / app background)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (videoRef.current) videoRef.current.pause();
      } else if (!isPaused && phase === 'exercise' && isPlaying) {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPaused, phase, isPlaying]);

  // Adjust video playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Toggle playback rate (1.0x <-> 0.5x Slow-Motion)
  const toggleSlowMo = () => {
    soundManager.triggerHaptic([20]);
    setPlaybackRate(prev => (prev === 1.0 ? 0.5 : 1.0));
  };

  const togglePlayPause = () => {
    soundManager.triggerHaptic([25]);
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (videoRef.current) {
      if (nextState) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleRestart = () => {
    soundManager.triggerHaptic([20]);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // If there is no videoUrl or loading failed, fallback to biomechanical posture
  const showVideo = viewMode === 'video' && exercise.videoUrl && !hasError;

  return (
    <>
      <div
        className={`w-full glass-card border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 relative select-none ${
          isCollapsed ? 'py-3 px-3.5' : 'p-3 sm:p-4'
        } ${className}`}
      >
        {/* Top Mini Control Toolbar */}
        <div className="flex items-center justify-between gap-1.5 pb-2 mb-1 border-b border-white/[0.08] min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0">
            {allowToggleMode ? (
              <div className="flex items-center bg-white/[0.06] rounded-xl p-0.5 border border-white/5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.triggerHaptic([15]);
                    setViewMode('video');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                    viewMode === 'video'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  aria-label="Modo Vídeo Demonstrativo"
                >
                  <Activity className="w-3 h-3" /> Vídeo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.triggerHaptic([15]);
                    setViewMode('posture');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                    viewMode === 'posture'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  aria-label="Modo Diagrama Biomecânico"
                >
                  <Layers className="w-3 h-3" /> Biomecânica
                </button>
              </div>
            ) : (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {isPlaying ? 'Loop' : 'Pausado'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Speed Toggle (1x / 0.5x Slow-Motion) */}
            {showVideo && !isCollapsed && (
              <button
                type="button"
                onClick={toggleSlowMo}
                title="Alternar câmera lenta (0.5x)"
                className={`px-1.5 py-1 rounded-xl text-[10px] font-mono font-bold transition border ${
                  playbackRate === 0.5
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 glow-amber'
                    : 'glass-card text-slate-300 hover:text-white border-white/10'
                }`}
              >
                {playbackRate === 0.5 ? '0.5x' : '1.0x'}
              </button>
            )}

            {/* Expand Modal Button */}
            {!isCollapsed && (
              <button
                type="button"
                onClick={() => {
                  soundManager.triggerHaptic([20]);
                  setIsFullscreen(true);
                }}
                title="Expandir visualização"
                className="p-1 rounded-xl glass-card text-slate-400 hover:text-white border border-white/10 transition active:scale-95"
                aria-label="Expandir ilustração"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Collapse/Minimize Toggle Button */}
            <button
              type="button"
              onClick={() => {
                soundManager.triggerHaptic([15]);
                setIsCollapsed(!isCollapsed);
              }}
              title={isCollapsed ? 'Expandir demonstração' : 'Recolher demonstração'}
              className="p-1 rounded-xl glass-card text-slate-400 hover:text-white border border-white/10 transition active:scale-95"
              aria-label={isCollapsed ? 'Expandir ilustração' : 'Recolher ilustração'}
            >
              {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsed State Summary Pill */}
        {isCollapsed && (
          <div className="flex items-center justify-between text-xs py-1 text-slate-300">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Ilustração em loop oculta
            </span>
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="text-emerald-400 font-extrabold hover:underline text-[11px]"
            >
              Mostrar
            </button>
          </div>
        )}

        {/* Main Display Stage */}
        {!isCollapsed && (
          <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950/80 border border-white/5 flex items-center justify-center">
            {showVideo ? (
              <div className="relative w-full aspect-[16/9] flex items-center justify-center bg-black/40 overflow-hidden">
                {/* Loader Placeholder */}
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 z-10">
                    <div className="w-7 h-7 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-[11px] text-slate-400 font-medium">Carregando movimento...</span>
                  </div>
                )}

                {isVideoFormat ? (
                  <video
                    ref={videoRef}
                    src={exercise.videoUrl}
                    poster={exercise.videoThumbnail}
                    autoPlay
                    loop={autoLoop}
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    onLoadedData={() => setIsLoading(false)}
                    onError={() => {
                      setHasError(true);
                      setIsLoading(false);
                    }}
                    className={`w-full h-full object-contain transition-opacity duration-300 ${
                      isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                ) : (
                  <img
                    src={exercise.videoUrl}
                    alt={`Ilustração animada de ${exercise.name}`}
                    loading="lazy"
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                      setHasError(true);
                      setIsLoading(false);
                    }}
                    className={`w-full h-full object-contain select-none transition-opacity duration-300 ${
                      isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                )}

                {/* Video Floating Controls Overlay (Minimal on Touch) */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  {/* Play / Pause Floating Pill */}
                  <button
                    type="button"
                    onClick={togglePlayPause}
                    className="pointer-events-auto px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-slate-200 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md active:scale-95 transition shadow-lg"
                    aria-label={isPlaying ? 'Congelar quadro' : 'Reproduzir loop'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />}
                    <span className="text-[11px]">{isPlaying ? 'Pausar' : 'Play'}</span>
                  </button>

                  {/* Restart Loop */}
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="pointer-events-auto p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-slate-300 hover:text-white backdrop-blur-md active:scale-95 transition shadow-lg"
                    title="Reiniciar loop"
                    aria-label="Reiniciar loop"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Biomechanical Vector Steps Loop (no extra nested border) */
              <div className="w-full">
                <ExercisePostureVisual exercise={exercise} embedded={true} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expanded Fullscreen Inspection Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="w-full max-w-xl glass-panel border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[min(92dvh,calc(100dvh-2rem))]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 glass-panel">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  {exercise.category} • Loop Biomecânico
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-100">{exercise.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                aria-label="Fechar tela cheia"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 flex flex-col items-center">
              <div className="w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center min-h-[220px]">
                {exercise.videoUrl && !hasError ? (
                  isVideoFormat ? (
                    <video
                      src={exercise.videoUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full max-h-[380px] object-contain"
                    />
                  ) : (
                    <img
                      src={exercise.videoUrl}
                      alt={exercise.name}
                      className="w-full max-h-[380px] object-contain"
                    />
                  )
                ) : (
                  <ExercisePostureVisual exercise={exercise} />
                )}
              </div>

              {/* Execution Cue Card */}
              <div className="w-full p-4 rounded-2xl glass-card border border-white/10 text-xs space-y-2">
                <div className="text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" /> Dica de Execução & Respiração:
                </div>
                <p className="text-slate-300 font-medium leading-relaxed">
                  {exercise.breathingTip}
                </p>
              </div>
            </div>

            {/* Footer com Safe Area */}
            <div className="p-4 pb-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] border-t border-white/10 flex justify-end glass-panel shrink-0">
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition"
              >
                Fechar e Continuar Treino
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
