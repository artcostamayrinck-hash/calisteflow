import React, { useState, useEffect } from 'react';
import type { Exercise } from '../../types';
import type { FigureStyle } from './figure/types';
import { Play, Pause, AlertTriangle, Wind, ChevronDown, Layers } from 'lucide-react';
import { ExerciseFigure } from './figure/ExerciseFigure';
import { getAnimationDefForExercise } from './figure/poseDatabase';

interface ExercisePostureVisualProps {
  exercise: Exercise;
  className?: string;
  embedded?: boolean;
  style?: FigureStyle;
}

export const ExercisePostureVisual: React.FC<ExercisePostureVisualProps> = ({
  exercise,
  className = '',
  embedded = false,
  style,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMistakesOpen, setIsMistakesOpen] = useState<boolean>(false);
  const [localStyle, setLocalStyle] = useState<FigureStyle | undefined>(style);

  // Sincroniza se o pai mudar
  useEffect(() => {
    if (style) setLocalStyle(style);
  }, [style]);

  // Auto-play steps loop
  useEffect(() => {
    if (!isPlaying || exercise.executionSteps.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentStepIndex(prev => (prev + 1) % exercise.executionSteps.length);
    }, 2800);

    return () => clearInterval(timer);
  }, [isPlaying, exercise.executionSteps.length]);

  const activeStep = exercise.executionSteps[currentStepIndex] || exercise.executionSteps[0];

  // Ilustração dinâmica em SVG anatômico com cinemática inversa (IK)
  const renderGraphicIllustration = () => {
    const animDef = getAnimationDefForExercise(exercise.id, exercise.name);
    const stepCount = exercise.executionSteps.length;
    const staticNormTime = stepCount > 1 ? currentStepIndex / (stepCount - 1) : 0.5;

    return (
      <ExerciseFigure
        animationDef={animDef}
        isPaused={!isPlaying}
        staticFrame={isPlaying ? undefined : staticNormTime}
        showControls={false}
        className="w-full h-full"
        style={localStyle}
      />
    );
  };

  const containerClasses = embedded
    ? `w-full overflow-hidden ${className}`
    : `w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg ${className}`;

  return (
    <div className={containerClasses}>
      {/* Visual Canvas Stage (Fixed 16:9 aspect-ratio, contain) */}
      <div className="relative w-full aspect-[16/9] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-2 overflow-hidden">
        {renderGraphicIllustration()}

        {/* Quick Style Switcher (Anatômico / Raio-X para checagem de alinhamento) */}
        <button
          type="button"
          onClick={() => setLocalStyle(prev => (prev === 'xray' ? 'anatomical' : 'xray'))}
          className="absolute top-2.5 left-2.5 px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95 flex items-center gap-1.5 z-10"
          title="Alternar entre visão anatômica e Raio-X de alinhamento"
        >
          <Layers className="w-3 h-3 text-cyan-400" />
          <span className={localStyle === 'xray' ? 'text-cyan-300 font-extrabold' : 'text-slate-300'}>
            {localStyle === 'xray' ? '🦴 Raio-X' : 'Visão Anatômica'}
          </span>
        </button>

        {/* Play/Pause Animation Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95"
          title={isPlaying ? 'Pausar animação' : 'Reproduzir animação'}
          aria-label={isPlaying ? 'Pausar animação' : 'Reproduzir animação'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Dedicated Breathing Cue Row right below animation */}
      {exercise.breathingTip && (
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-950/70 border-t border-slate-800/80 text-[11px] text-slate-300">
          <Wind className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="leading-snug">{exercise.breathingTip}</span>
        </div>
      )}

      {/* Compact Steps Indicator (Passo X de Y + segmented bars) */}
      {exercise.executionSteps && exercise.executionSteps.length > 0 && (
        <div className="px-3.5 py-2.5 bg-slate-950/50 border-t border-slate-800/70 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">
              Passo {currentStepIndex + 1} de {exercise.executionSteps.length}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 truncate max-w-[190px]">
              {activeStep.title}
            </span>
          </div>

          {/* Segmented clickable progress bars */}
          <div className="flex items-center gap-1.5 w-full">
            {exercise.executionSteps.map((step, idx) => (
              <button
                key={step.step}
                type="button"
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                }}
                aria-label={`Passo ${step.step}: ${step.title}`}
                className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                  currentStepIndex === idx
                    ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                    : idx < currentStepIndex
                    ? 'bg-emerald-600/70 hover:bg-emerald-500'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Current Step Description Card */}
      <div className="p-3 sm:p-4 space-y-2.5 border-t border-slate-800/60">
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
            {activeStep.step}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-100">{activeStep.title}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeStep.description}</p>
          </div>
        </div>

        {/* Common Mistakes to Avoid Accordion (collapsed by default) */}
        {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setIsMistakesOpen(!isMistakesOpen)}
              className="w-full flex items-center justify-between py-1 text-xs font-bold text-rose-400 hover:text-rose-300 transition"
              aria-expanded={isMistakesOpen}
            >
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Erros Críticos a Evitar ({exercise.commonMistakes.length})
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMistakesOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMistakesOpen && (
              <div className="mt-2 space-y-1.5 animate-in fade-in duration-150">
                {exercise.commonMistakes.map((m, i) => (
                  <div key={i} className="text-xs bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5 text-slate-300">
                    <div className="text-rose-300 font-semibold">❌ {m.mistake}</div>
                    <div className="text-emerald-400 mt-1">✓ Correção: {m.correction}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
