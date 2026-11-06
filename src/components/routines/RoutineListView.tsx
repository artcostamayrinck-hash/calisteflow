import React, { useState } from 'react';
import type { Routine, ExerciseCategory } from '../../types';
import { RoutineCard } from './RoutineCard';
import { Plus, Search, Dumbbell, RotateCcw, X } from 'lucide-react';

interface RoutineListViewProps {
  routines: Routine[];
  onStartRoutine: (routine: Routine) => void;
  onEditRoutine: (routine: Routine) => void;
  onDuplicateRoutine: (routine: Routine) => void;
  onDeleteRoutine: (id: string) => void;
  onViewDetails: (routine: Routine) => void;
  onCreateNewRoutine: () => void;
  onResetDefaults: () => void;
}

export const RoutineListView: React.FC<RoutineListViewProps> = ({
  routines,
  onStartRoutine,
  onEditRoutine,
  onDuplicateRoutine,
  onDeleteRoutine,
  onViewDetails,
  onCreateNewRoutine,
  onResetDefaults,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'Todos'>('Todos');

  const categories: Array<ExerciseCategory | 'Todos'> = [
    'Todos',
    'Push',
    'Pull',
    'Legs',
    'Core',
    'Skill',
    'Full Body',
  ];

  const filteredRoutines = routines.filter(r => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner & Quick Create */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 flex items-center gap-2">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              CalisteFlow
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Escolha uma rotina ou monte seu plano personalizado de calistenia.
          </p>
        </div>

        <button
          onClick={onCreateNewRoutine}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Criar Nova Rotina
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar rotina por nome ou objetivo (ex: Push, Costas, Iniciante)..."
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

      {/* Category Pills */}
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

      {/* Grid of Routines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoutines.map(routine => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            onStart={onStartRoutine}
            onEdit={onEditRoutine}
            onDuplicate={onDuplicateRoutine}
            onDelete={onDeleteRoutine}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredRoutines.length === 0 && (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
          <Dumbbell className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-300">Nenhuma rotina encontrada</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Não encontramos rotinas correspondentes ao filtro atual.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Todos');
            }}
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Reset to defaults helper button */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={() => {
            if (confirm('Deseja restaurar as rotinas pré-carregadas originais? Suas rotinas personalizadas serão mantidas.')) {
              onResetDefaults();
            }
          }}
          className="text-[11px] text-slate-500 hover:text-slate-400 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" /> Restaurar Rotinas Padrão
        </button>
      </div>
    </div>
  );
};
