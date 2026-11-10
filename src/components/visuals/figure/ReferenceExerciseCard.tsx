/**
 * ReferenceExerciseCard — Card de Exercício Fiel ao Protótipo Aprovado
 * - Cantos arredondados de 16px, borda fina e fundo escuro
 * - Topo: Cena SVG 400x300 sem margem (largura total)
 * - Base: Título (1.05 rem), Nível (.75 rem), Pontos coloridos de 10px (Verde #34D399 e Ciano #22D3EE),
 *         Rótulos em negrito e dica (.85 rem)
 */

import React, { useState } from 'react';
import type { Exercise } from '../../../types';
import { MUSCLE_LABELS } from '../../../data/exercisesData';
import { ReferenceFigure } from './ReferenceFigure';
import { Play, Pause } from 'lucide-react';

export interface ReferenceExerciseCardProps {
  exercise: Exercise;
  className?: string;
  autoPlay?: boolean;
  playbackRate?: number;
}

export const ReferenceExerciseCard: React.FC<ReferenceExerciseCardProps> = ({
  exercise,
  className = '',
  autoPlay = true,
  playbackRate = 1.0,
}) => {
  const [isPaused, setIsPaused] = useState<boolean>(!autoPlay);
  const [rate, setRate] = useState<number>(playbackRate);

  const primaryNames = exercise.primaryMuscles.map(m => MUSCLE_LABELS[m] || m).join(', ');
  const secondaryNames = exercise.secondaryMuscles.map(m => MUSCLE_LABELS[m] || m).join(', ');

  const shortTip =
    exercise.breathingTip ||
    exercise.description ||
    'Mantenha a postura alinhada e controle o movimento em todo o percurso.';

  return (
    <div
      className={`rounded-[16px] border border-white/[0.08] bg-[#070d19] overflow-hidden shadow-2xl flex flex-col select-none ${className}`}
    >
      {/* 1. Cena SVG 400x300 (Largura Total sem margem) */}
      <div className="relative w-full aspect-[4/3] bg-[#050b18]">
        <ReferenceFigure
          exerciseId={exercise.id}
          isPaused={isPaused}
          playbackRate={rate}
          className="w-full h-full"
        />

        {/* Controles de Reprodução Sutis no Topo */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setRate(prev => (prev === 1.0 ? 0.5 : 1.0));
            }}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold backdrop-blur-md border transition ${
              rate === 0.5
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-black/40 border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Alternar Câmera Lenta 0.5x"
          >
            0.5x
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused(!isPaused);
            }}
            className="p-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition"
            title={isPaused ? 'Reproduzir animação' : 'Pausar animação'}
            aria-label={isPaused ? 'Reproduzir animação' : 'Pausar animação'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
          </button>
        </div>
      </div>

      {/* 2. Parte de Baixo (Especificação Rigorosa de Tipografia e Rótulos) */}
      <div className="p-4 flex flex-col gap-2.5 bg-[#070d19] border-t border-white/[0.06]">
        {/* Cabeçalho: Título e Nível */}
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-bold text-[1.05rem] text-white leading-tight tracking-tight">
            {exercise.name}
          </h3>
          <span className="text-[0.75rem] text-[#94A3B8] font-medium shrink-0">
            {exercise.difficulty}
          </span>
        </div>

        {/* Linhas de Músculos com Pontos Coloridos de 10px */}
        <div className="flex flex-col gap-1 text-[0.875rem]">
          {/* Alvo: Verde #34D399 */}
          <div className="flex items-center gap-2">
            <span
              className="w-[10px] h-[10px] rounded-full shrink-0"
              style={{ backgroundColor: '#34D399' }}
              aria-hidden="true"
            />
            <span className="text-slate-200">
              <strong className="font-bold text-white">Alvo: </strong>
              {primaryNames || 'Músculos Primários'}
            </span>
          </div>

          {/* Secundário: Ciano #22D3EE */}
          {secondaryNames && (
            <div className="flex items-center gap-2">
              <span
                className="w-[10px] h-[10px] rounded-full shrink-0"
                style={{ backgroundColor: '#22D3EE' }}
                aria-hidden="true"
              />
              <span className="text-slate-200">
                <strong className="font-bold text-white">Secundário: </strong>
                {secondaryNames}
              </span>
            </div>
          )}
        </div>

        {/* Dica Curta em Cinza */}
        <p className="text-[0.85rem] text-[#94A3B8] leading-snug pt-0.5 border-t border-white/[0.04]">
          {shortTip}
        </p>
      </div>
    </div>
  );
};

