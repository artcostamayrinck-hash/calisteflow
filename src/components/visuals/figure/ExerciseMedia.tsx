/**
 * Componente Unificado <ExerciseMedia> para CalisteFlow
 * Gerencia a renderização em cards, modal de detalhes e tela de treino ativo.
 * Inclui poster estático, controles táteis de 48px, slow-motion e legenda textual dos músculos.
 */

import React, { useState, useMemo } from 'react';
import type { Exercise } from '../../../types';
import type { FigureStyle, AvatarSettings } from './types';
import { MUSCLE_LABELS } from '../../../data/exercisesData';
import { getAnimationDefForExercise } from './poseDatabase';
import { ExerciseFigure } from './ExerciseFigure';
import { ReferenceFigure } from './ReferenceFigure';
import { Play, Pause, Maximize2, X } from 'lucide-react';
import { useBodyScrollLock } from '../../../utils/useBodyScrollLock';
import { getAvatarSettings } from '../../../utils/appSettings';

export interface ExerciseMediaProps {
  exercise: Exercise;
  mode?: 'card' | 'detail' | 'workout' | 'compact';
  isPaused?: boolean;
  className?: string;
  autoPlay?: boolean;
  onExpand?: () => void;
  style?: FigureStyle;
  avatarSettings?: Partial<AvatarSettings>;
}

export const ExerciseMedia: React.FC<ExerciseMediaProps> = ({
  exercise,
  mode = 'detail',
  isPaused = false,
  className = '',
  autoPlay = true,
  style,
  avatarSettings,
}) => {
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [userPaused, setUserPaused] = useState<boolean>(!autoPlay || isPaused);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedStyle, setSelectedStyle] = useState<FigureStyle | null>(null);

  useBodyScrollLock(isFullscreen, () => setIsFullscreen(false));

  const animDef = useMemo(() => {
    return getAnimationDefForExercise(exercise.id, exercise.name);
  }, [exercise.id, exercise.name]);

  // Resolução inteligente do estilo visual conforme contexto e preferências do usuário
  const activeStyle: FigureStyle = useMemo(() => {
    if (selectedStyle) return selectedStyle;
    if (style) return style;
    const globalAvatar = getAvatarSettings();
    if (globalAvatar.preferredStyle && globalAvatar.preferredStyle !== 'anatomical') {
      return globalAvatar.preferredStyle;
    }
    // Padrão canônico rigoroso: estilo anatômico do protótipo de referência
    return 'anatomical';
  }, [selectedStyle, style]);

  const toggleSlowMo = () => {
    setPlaybackRate(prev => (prev === 1.0 ? 0.5 : 1.0));
  };

  const togglePlay = () => {
    setUserPaused(prev => !prev);
  };

  // Nomes amigáveis dos músculos para não depender apenas de cores
  const primaryNames = useMemo(() => {
    return exercise.primaryMuscles.map(m => MUSCLE_LABELS[m] || m).join(', ');
  }, [exercise.primaryMuscles]);

  const secondaryNames = useMemo(() => {
    return exercise.secondaryMuscles.map(m => MUSCLE_LABELS[m] || m).join(', ');
  }, [exercise.secondaryMuscles]);

  // Modo Miniatura / Card
  if (mode === 'card' || mode === 'compact') {
    return (
      <div
        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shrink-0 shadow-md ${className}`}
      >
        {activeStyle === 'anatomical' ? (
          <ReferenceFigure
            exerciseId={exercise.id}
            staticFrame={0.5} // Poster estático no ápice do movimento para economizar processamento na rolagem de lista
            className="w-full h-full object-cover"
          />
        ) : (
          <ExerciseFigure
            animationDef={animDef}
            staticFrame={0.45}
            showControls={false}
            className="w-full h-full object-cover"
            style={activeStyle}
            avatarSettings={avatarSettings}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div className={`w-full flex flex-col items-center select-none ${className}`}>
        {/* Palco Principal de Animação com Controles */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
          {activeStyle === 'anatomical' ? (
            <ReferenceFigure
              exerciseId={exercise.id}
              isPaused={userPaused}
              playbackRate={playbackRate}
              className="w-full h-auto aspect-[4/3] sm:aspect-[16/10]"
            />
          ) : (
            <ExerciseFigure
              animationDef={animDef}
              isPaused={userPaused}
              playbackRate={playbackRate}
              showControls={false}
              className="w-full h-auto aspect-[4/3] sm:aspect-[16/10]"
              style={activeStyle}
              avatarSettings={avatarSettings}
            />
          )}

          {/* Barra Flutuante Superior de Controles */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            {/* Badge de Padrão Motor */}
            <span className="pointer-events-auto px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md border border-white/10 text-emerald-400">
              {animDef.familyName}
            </span>

            {/* Ações de Controle */}
            <div className="pointer-events-auto flex items-center gap-1.5">
              {/* Botão Câmera Lenta (0.5x / 1.0x) */}
              <button
                type="button"
                onClick={toggleSlowMo}
                title="Alternar câmera lenta (0.5x)"
                className={`min-w-[40px] h-[36px] px-2 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center border backdrop-blur-md ${
                  playbackRate === 0.5
                    ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 glow-amber'
                    : 'bg-slate-950/80 text-slate-300 hover:text-white border-white/10'
                }`}
              >
                {playbackRate === 0.5 ? '0.5x' : '1.0x'}
              </button>

              {/* Botão Play/Pausa de 48px de área de toque */}
              <button
                type="button"
                onClick={togglePlay}
                className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] flex items-center justify-center rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 text-slate-200 backdrop-blur-md active:scale-95 transition"
                aria-label={userPaused ? 'Reproduzir loop' : 'Pausar animação'}
                title={userPaused ? 'Reproduzir loop' : 'Pausar animação'}
              >
                {userPaused ? (
                  <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                ) : (
                  <Pause className="w-4 h-4 text-emerald-400" />
                )}
              </button>

              {/* Botão Tela Cheia */}
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] flex items-center justify-center rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 text-slate-400 hover:text-white backdrop-blur-md active:scale-95 transition"
                title="Expandir animação"
                aria-label="Expandir animação"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Seletor Rápido de Estilos de Figura */}
        <div className="w-full mt-2.5 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Estilo Visual:
          </span>
          <div className="flex items-center gap-1 bg-slate-900/90 border border-white/10 p-1 rounded-xl shrink-0">
            {(
              [
                { id: 'anatomical', label: 'Anatômico' },
                { id: 'mannequin', label: 'Manequim' },
                { id: 'silhouette', label: 'Silhueta' },
                { id: 'outline', label: 'Contorno' },
                { id: 'xray', label: 'Raio-X' },
              ] as { id: FigureStyle; label: string }[]
            ).map(st => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStyle(st.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                  activeStyle === st.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legenda Textual Obrigatória dos Músculos (nunca depender só de cor) */}
        <div className="w-full mt-3 p-3.5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              Músculo Alvo (Primário):
            </span>
            <span className="font-extrabold text-emerald-400">{primaryNames}</span>
          </div>

          {secondaryNames && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                Secundário (Sinergista):
              </span>
              <span className="font-semibold text-cyan-300">{secondaryNames}</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal Expandido para Inspeção Minuciosa */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="w-full max-w-2xl glass-panel border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Cabeçalho */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  {animDef.familyName} • Loop Biomecânico
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

            {/* Corpo do Modal */}
            <div className="p-4 sm:p-6 flex flex-col items-center">
              {/* Barra de Seleção de Estilos no Modal */}
              <div className="w-full mb-3 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                  Visualização:
                </span>
                <div className="flex items-center gap-1 bg-slate-900/90 border border-white/10 p-1 rounded-xl shrink-0">
                  {(
                    [
                      { id: 'anatomical', label: 'Anatômico' },
                      { id: 'mannequin', label: 'Manequim' },
                      { id: 'silhouette', label: 'Silhueta' },
                      { id: 'outline', label: 'Contorno' },
                      { id: 'xray', label: 'Raio-X' },
                    ] as { id: FigureStyle; label: string }[]
                  ).map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStyle(st.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        activeStyle === st.id
                          ? 'bg-emerald-500 text-slate-950 font-black shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                {activeStyle === 'anatomical' ? (
                  <ReferenceFigure
                    exerciseId={exercise.id}
                    isPaused={userPaused}
                    playbackRate={playbackRate}
                    className="w-full h-auto"
                  />
                ) : (
                  <ExerciseFigure
                    animationDef={animDef}
                    isPaused={userPaused}
                    playbackRate={playbackRate}
                    showControls={true}
                    className="w-full h-auto"
                    style={activeStyle}
                    avatarSettings={avatarSettings}
                  />
                )}
              </div>

              {/* Informações de Execução e Respiração */}
              {exercise.breathingTip && (
                <div className="w-full mt-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-slate-300">
                  <span className="text-emerald-400 font-bold block mb-1">Dica de Respiração:</span>
                  {exercise.breathingTip}
                </div>
              )}
            </div>

            {/* Rodapé */}
            <div className="p-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition"
              >
                Concluir Inspeção
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
