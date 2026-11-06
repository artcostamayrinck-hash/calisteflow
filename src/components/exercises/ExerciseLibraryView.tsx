import { useState } from 'react';
import type { Exercise, MuscleGroup, ExerciseCategory } from '../../types';
import { EXERCISES_DATABASE, MUSCLE_LABELS } from '../../data/exercisesData';
import { MuscleMap } from '../visuals/MuscleMap';
import { ExerciseVideoPlayer } from '../workout/ExerciseVideoPlayer';
import { soundManager } from '../../utils/audio';
import { Search, Filter, Dumbbell, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';

interface ExerciseLibraryViewProps {
  initialExerciseId?: string | null;
}

export const ExerciseLibraryView = ({
  initialExerciseId = null,
}: ExerciseLibraryViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'Todos'>('Todos');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(() => {
    if (initialExerciseId) {
      return EXERCISES_DATABASE.find(e => e.id === initialExerciseId) || null;
    }
    return null;
  });
  const [showInteractiveMap, setShowInteractiveMap] = useState<boolean>(false);

  // Filter exercises
  const filteredExercises = EXERCISES_DATABASE.filter(ex => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'Todos' || ex.category === selectedCategory;

    const matchesMuscle =
      !selectedMuscle ||
      ex.primaryMuscles.includes(selectedMuscle) ||
      ex.secondaryMuscles.includes(selectedMuscle);

    return matchesSearch && matchesCategory && matchesMuscle;
  });

  const categories: Array<ExerciseCategory | 'Todos'> = [
    'Todos',
    'Push',
    'Pull',
    'Legs',
    'Core',
    'Skill',
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Search */}
      <div className="space-y-4">
        {/* Banner */}
        <div className="relative glass-card rounded-3xl p-5 sm:p-7 overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Biomecânica & Anatomia
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
              <Dumbbell className="w-7 h-7 text-emerald-400" />
              Exercícios & Guia Postural
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed font-medium">
              Biblioteca anatômica com vetores de força passo a passo, ativação muscular direcionada e prevenção de lesões.
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por exercício ou músculo (ex: flexão, peito, barra, costas)..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl glass-card text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 placeholder:text-slate-500 shadow-md transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                soundManager.triggerHaptic([20]);
                setSelectedCategory(cat);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'glass-card text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Muscle Filter Toggle / Active Muscle Bar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                soundManager.triggerHaptic([20]);
                setShowInteractiveMap(!showInteractiveMap);
              }}
              className="px-3.5 py-2 rounded-2xl glass-card text-slate-300 text-xs font-bold flex items-center gap-2 hover:bg-white/[0.08] transition active:scale-95"
            >
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filtrar no Mapa Muscular 3D</span>
              {showInteractiveMap ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {selectedMuscle && (
              <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-2xl text-xs font-bold glow-amber">
                <span>Filtrando por: {MUSCLE_LABELS[selectedMuscle]}</span>
                <button
                  onClick={() => setSelectedMuscle(null)}
                  className="hover:text-white ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <span className="text-xs text-slate-400 shrink-0 font-medium">
            {filteredExercises.length} exercícios
          </span>
        </div>

        {/* Interactive Muscle Map Drawer */}
        {showInteractiveMap && (
          <div className="glass-panel border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                Toque em um músculo para filtrar exercícios:
              </span>
              {selectedMuscle && (
                <button
                  onClick={() => setSelectedMuscle(null)}
                  className="text-xs text-emerald-400 hover:underline font-bold"
                >
                  Limpar filtro
                </button>
              )}
            </div>
            <MuscleMap
              selectedMuscle={selectedMuscle}
              onSelectMuscle={m => setSelectedMuscle(m === selectedMuscle ? null : m)}
              size="md"
            />
          </div>
        )}
      </div>

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredExercises.map(ex => (
          <div
            key={ex.id}
            className="glass-card rounded-3xl p-5 shadow-xl hover:border-white/15 transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Exercise meta chips */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {ex.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300">
                    {ex.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-400">
                    {ex.type === 'isometric' ? 'Isometria' : 'Repetições'}
                  </span>
                </div>
              </div>

              {/* Title & Description & Thumbnail */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-100">{ex.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{ex.description}</p>
                </div>
                {ex.videoThumbnail && (
                  <img
                    src={ex.videoThumbnail}
                    alt={ex.name}
                    loading="lazy"
                    className="w-14 h-14 rounded-2xl object-cover bg-black/40 border border-white/10 shrink-0 shadow-md"
                  />
                )}
              </div>

              {/* Muscle pills */}
              <div className="flex flex-wrap gap-1 mt-3">
                {ex.primaryMuscles.map(m => (
                  <span
                    key={m}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    Alvo: {MUSCLE_LABELS[m] || m}
                  </span>
                ))}
                {ex.secondaryMuscles.map(m => (
                  <span
                    key={m}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-400"
                  >
                    {MUSCLE_LABELS[m] || m}
                  </span>
                ))}
              </div>
            </div>

            {/* Inspect Posture CTA */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {ex.executionSteps.length} passos de postura
              </span>
              <button
                onClick={() => {
                  soundManager.triggerHaptic([20]);
                  setSelectedExercise(ex);
                }}
                className="px-4 py-2 rounded-2xl glass-card text-emerald-300 hover:text-white hover:bg-white/[0.08] text-xs font-bold border border-white/10 flex items-center gap-1.5 transition active:scale-95 glow-emerald"
              >
                <Sparkles className="w-3.5 h-3.5" /> Postura & Músculos
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="p-12 text-center glass-card rounded-3xl border border-white/10 space-y-3">
          <Dumbbell className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-200">Nenhum exercício encontrado</h4>
          <p className="text-xs text-slate-400 mt-1">
            Tente buscar com outro termo ou limpe os filtros de categoria e músculo.
          </p>
        </div>
      )}

      {/* Full Exercise Posture Inspection Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] glass-panel border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 glass-panel">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  {selectedExercise.category} • {selectedExercise.difficulty}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">{selectedExercise.name}</h2>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Looping Video Illustration & Biomechanical Visual */}
              <ExerciseVideoPlayer exercise={selectedExercise} autoLoop={true} />

              {/* Targeted Muscle Map */}
              <div className="glass-card p-4 rounded-3xl border border-white/10 shadow-lg">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 text-center">
                  Músculos Ativados em {selectedExercise.name}
                </h4>
                <MuscleMap
                  primaryMuscles={selectedExercise.primaryMuscles}
                  secondaryMuscles={selectedExercise.secondaryMuscles}
                  size="sm"
                />
              </div>

              {/* Recommended Default Prescription */}
              <div className="p-4 glass-card rounded-3xl border border-white/10 text-xs flex items-center justify-around text-center shadow-md">
                <div>
                  <div className="text-slate-400 text-[11px] font-semibold">Séries Sugeridas</div>
                  <div className="text-lg font-black text-slate-100 mt-0.5 font-mono">
                    {selectedExercise.defaultSets}
                  </div>
                </div>
                <div className="border-r border-white/10 h-8" />
                <div>
                  <div className="text-slate-400 text-[11px] font-semibold">
                    {selectedExercise.type === 'isometric' ? 'Sustentação' : 'Repetições'}
                  </div>
                  <div className="text-lg font-black text-slate-100 mt-0.5 font-mono">
                    {selectedExercise.type === 'isometric'
                      ? `${selectedExercise.defaultHoldSeconds}s`
                      : `${selectedExercise.defaultReps} reps`}
                  </div>
                </div>
                <div className="border-r border-white/10 h-8" />
                <div>
                  <div className="text-slate-400 text-[11px] font-semibold">Descanso Ideal</div>
                  <div className="text-lg font-black text-slate-100 mt-0.5 font-mono">
                    {selectedExercise.defaultRestSeconds}s
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 glass-panel flex justify-end">
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 glow-emerald"
              >
                Fechar Guia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

