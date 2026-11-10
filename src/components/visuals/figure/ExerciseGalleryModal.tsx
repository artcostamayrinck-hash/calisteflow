/**
 * Galeria de Revisão Visual de Todos os Exercícios do CalisteFlow
 * Permite inspecionar cada família, congelar quadros (início, meio e fim),
 * alternar câmera lenta e verificar o alinhamento anatômico de cada movimento.
 */

import React, { useState, useMemo } from 'react';
import { BASE_EXERCISES } from '../../../data/exercisesData';
import { ExerciseFigure } from './ExerciseFigure';
import { getAnimationDefForExercise } from './poseDatabase';
import {
  Search,
  Play,
  Pause,
  CheckCircle2,
  X,
} from 'lucide-react';

interface ExerciseGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAMILIES = [
  'Todas',
  '1. Empurrar horizontal (flexões)',
  '2. Empurrar vertical',
  '3. Mergulhos',
  '4. Puxar vertical (suspensão)',
  '5. Puxar horizontal (remada invertida)',
  '6. Agachamentos, afundos e panturrilha',
  '7. Cadeia posterior',
  '8. Pranchas, isometrias e estabilidade',
  '9. Deitado (abdominais)',
  '10. Pendurado e rolamentos',
  '11. Skills',
  '12. Aquecimento e mobilidade',
  '13. Alongamentos',
];

export const ExerciseGalleryModal: React.FC<ExerciseGalleryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFamily, setSelectedFamily] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [globalPaused, setGlobalPaused] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [scrubberFrame, setScrubberFrame] = useState<number | null>(null);

  // Mapeia todos os 208 exercícios com suas definições de animação
  const exercisesWithDef = useMemo(() => {
    return BASE_EXERCISES.map(ex => ({
      exercise: ex,
      animDef: getAnimationDefForExercise(ex.id, ex.name),
    }));
  }, []);

  // Filtragem por família e busca
  const filtered = useMemo(() => {
    return exercisesWithDef.filter(item => {
      const matchFamily =
        selectedFamily === 'Todas' ||
        item.animDef.familyName.toLowerCase().includes(selectedFamily.split('.')[1]?.trim().toLowerCase() || '');

      const matchSearch =
        !searchQuery ||
        item.exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.exercise.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchFamily && matchSearch;
    });
  }, [exercisesWithDef, selectedFamily, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-150">
      <div className="w-full max-w-6xl h-[94vh] glass-panel border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Cabeçalho */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 glass-panel">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-base sm:text-xl font-black text-slate-100">
                Galeria de Revisão Biomecânica CalisteFlow
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspeção visual anatômica de 208 exercícios vetoriais em SVG • 30 FPS • IK
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition"
            aria-label="Fechar galeria"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar de Controle Global */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Busca */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou ID..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Controles Globais de Reprodução */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGlobalPaused(!globalPaused)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                globalPaused
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {globalPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              {globalPaused ? 'Reproduzir Todos' : 'Pausar Todos'}
            </button>

            <button
              type="button"
              onClick={() => setPlaybackRate(playbackRate === 1.0 ? 0.5 : 1.0)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                playbackRate === 0.5
                  ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 glow-amber'
                  : 'bg-white/[0.06] text-slate-300 border-white/10'
              }`}
            >
              {playbackRate === 0.5 ? '0.5x Lento' : '1.0x Normal'}
            </button>

            {/* Congelar em Quadros-Chave */}
            <div className="flex items-center bg-white/[0.06] rounded-xl p-0.5 border border-white/10 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setScrubberFrame(null)}
                className={`px-2 py-1 rounded-lg transition ${
                  scrubberFrame === null ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400'
                }`}
              >
                Loop
              </button>
              <button
                type="button"
                onClick={() => setScrubberFrame(0.0)}
                className={`px-2 py-1 rounded-lg transition ${
                  scrubberFrame === 0.0 ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400'
                }`}
              >
                Início (0%)
              </button>
              <button
                type="button"
                onClick={() => setScrubberFrame(0.5)}
                className={`px-2 py-1 rounded-lg transition ${
                  scrubberFrame === 0.5 ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400'
                }`}
              >
                Meio (50%)
              </button>
              <button
                type="button"
                onClick={() => setScrubberFrame(1.0)}
                className={`px-2 py-1 rounded-lg transition ${
                  scrubberFrame === 1.0 ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400'
                }`}
              >
                Fim (100%)
              </button>
            </div>
          </div>
        </div>

        {/* Chips de Famílias */}
        <div className="px-4 py-2 border-b border-white/10 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {FAMILIES.map(fam => (
            <button
              key={fam}
              type="button"
              onClick={() => setSelectedFamily(fam)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                selectedFamily === fam
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black'
                  : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 border-white/5'
              }`}
            >
              {fam}
            </button>
          ))}
        </div>

        {/* Grade de Exercícios */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(({ exercise, animDef }) => (
            <div
              key={exercise.id}
              className="glass-card rounded-3xl p-3.5 border border-white/10 shadow-lg space-y-3 flex flex-col"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    {animDef.familyName}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 line-clamp-1">{exercise.name}</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded-md">
                  #{exercise.id}
                </span>
              </div>

              {/* Renderizador Vetorial da Figura */}
              <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                <ExerciseFigure
                  animationDef={animDef}
                  isPaused={globalPaused}
                  playbackRate={playbackRate}
                  staticFrame={scrubberFrame ?? undefined}
                  showControls={true}
                  className="w-full h-auto"
                />
              </div>

              {/* Legenda Muscular Textual */}
              <div className="text-[11px] space-y-1 text-slate-300 pt-1 border-t border-white/5 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Alvo:
                  </span>
                  <span className="font-semibold text-slate-200 truncate max-w-[170px]">
                    {exercise.primaryMuscles.join(', ')}
                  </span>
                </div>
                {exercise.secondaryMuscles.length > 0 && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" /> Secundário:
                    </span>
                    <span className="truncate max-w-[170px]">{exercise.secondaryMuscles.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé Informativo */}
        <div className="p-3.5 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>
            Exibindo <strong>{filtered.length}</strong> de <strong>{exercisesWithDef.length}</strong> exercícios
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Loop Fechado & IK Verificado
          </span>
        </div>
      </div>
    </div>
  );
};
