import React, { useState } from 'react';
import type { Exercise, MuscleGroup, ExerciseCategory } from '../../types';
import { EXERCISES_DATABASE, MUSCLE_LABELS } from '../../data/exercisesData';
import { ExercisePostureVisual } from '../visuals/ExercisePostureVisual';
import { MuscleMap } from '../visuals/MuscleMap';
import { Search, Filter, Dumbbell, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';

interface ExerciseLibraryViewProps {
  initialExerciseId?: string | null;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({
  initialExerciseId = null,
}) => {
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
    <div className="space-y-6 pb-20">
      {/* Header & Search */}
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-emerald-400" />
            Exercícios & Guia de Postura
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Biblioteca anatômica com orientações biomecânicas passo a passo, músculos alvos e prevenção de lesões.
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por exercício ou músculo (ex: flexão, peito, barra, costas)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 placeholder:text-slate-500 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
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
              onClick={() => setShowInteractiveMap(!showInteractiveMap)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 transition"
            >
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filtrar por Músculo no Mapa 3D</span>
              {showInteractiveMap ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {selectedMuscle && (
              <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-xl text-xs">
                <span>Filtrando por: {MUSCLE_LABELS[selectedMuscle]}</span>
                <button
                  onClick={() => setSelectedMuscle(null)}
                  className="hover:text-white ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <span className="text-xs text-slate-400 shrink-0">
            {filteredExercises.length} exercícios encontrados
          </span>
        </div>

        {/* Interactive Muscle Map Drawer */}
        {showInteractiveMap && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Toque em um músculo para filtrar exercícios:
              </span>
              {selectedMuscle && (
                <button
                  onClick={() => setSelectedMuscle(null)}
                  className="text-xs text-emerald-400 hover:underline"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExercises.map(ex => (
          <div
            key={ex.id}
            className="bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-5 shadow-lg hover:border-slate-700 transition flex flex-col justify-between space-y-4"
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

              {/* Title & Description */}
              <h3 className="text-base sm:text-lg font-bold text-slate-100">{ex.name}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ex.description}</p>

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
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {ex.executionSteps.length} passos de postura detalhados
              </span>
              <button
                onClick={() => setSelectedExercise(ex)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-emerald-400 hover:bg-slate-700 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" /> Ver Ilustração & Postura
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">
          <Dumbbell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-300">Nenhum exercício encontrado</h4>
          <p className="text-xs text-slate-500 mt-1">
            Tente buscar com outro termo ou limpe os filtros de categoria e músculo.
          </p>
        </div>
      )}

      {/* Full Exercise Posture Inspection Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90 backdrop-blur-md">
              <div>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  {selectedExercise.category} • {selectedExercise.difficulty}
                </span>
                <h2 className="text-lg font-bold text-slate-100">{selectedExercise.name}</h2>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Animated Vector Posture Visual */}
              <ExercisePostureVisual exercise={selectedExercise} />

              {/* Targeted Muscle Map */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
                  Músculos Ativados em {selectedExercise.name}
                </h4>
                <MuscleMap
                  primaryMuscles={selectedExercise.primaryMuscles}
                  secondaryMuscles={selectedExercise.secondaryMuscles}
                  size="sm"
                />
              </div>

              {/* Recommended Default Prescription */}
              <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs flex items-center justify-around text-center">
                <div>
                  <div className="text-slate-400 text-[11px]">Séries Sugeridas</div>
                  <div className="text-base font-bold text-slate-100 mt-0.5">
                    {selectedExercise.defaultSets}
                  </div>
                </div>
                <div className="border-r border-slate-800 h-8" />
                <div>
                  <div className="text-slate-400 text-[11px]">
                    {selectedExercise.type === 'isometric' ? 'Sustentação' : 'Repetições'}
                  </div>
                  <div className="text-base font-bold text-slate-100 mt-0.5">
                    {selectedExercise.type === 'isometric'
                      ? `${selectedExercise.defaultHoldSeconds}s`
                      : `${selectedExercise.defaultReps} reps`}
                  </div>
                </div>
                <div className="border-r border-slate-800 h-8" />
                <div>
                  <div className="text-slate-400 text-[11px]">Descanso Ideal</div>
                  <div className="text-base font-bold text-slate-100 mt-0.5">
                    {selectedExercise.defaultRestSeconds}s
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
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

