import { useState } from 'react';
import type { Routine, ExerciseCategory } from '../../types';
import { RoutineCard } from './RoutineCard';
import { RoutineShareModal } from './RoutineShareModal';
import { soundManager } from '../../utils/audio';
import { Plus, Search, Dumbbell, RotateCcw, X, Sparkles } from 'lucide-react';

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

export const RoutineListView = ({
  routines,
  onStartRoutine,
  onEditRoutine,
  onDuplicateRoutine,
  onDeleteRoutine,
  onViewDetails,
  onCreateNewRoutine,
  onResetDefaults,
}: RoutineListViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'Todos'>('Todos');
  const [sharingRoutine, setSharingRoutine] = useState<Routine | null>(null);

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
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      r.title.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query) ||
      (r.targetAudience && r.targetAudience.toLowerCase().includes(query)) ||
      (r.safetyNotes && r.safetyNotes.toLowerCase().includes(query));
    const matchesCategory = selectedCategory === 'Todos' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 safe-dock-pb">
      {/* Hero Welcome Banner */}
      <div className="relative glass-card rounded-3xl p-5 sm:p-7 overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Calistenia & Força Funcional
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Domine Seu <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Peso Corporal</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
              Rotinas estruturadas para hipertrofia, força e habilidades estáticas sem necessidade de equipamentos pesados.
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.triggerHaptic([40]);
              onCreateNewRoutine();
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition glow-emerald shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Nova Rotina
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar rotina por título ou foco muscular (ex: Push, Costas, Iniciante)..."
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

      {/* Category Filter Pills com Indicador de Rolagem */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-0.5">
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
        <div className="pointer-events-none absolute left-0 top-0 bottom-1 w-2.5 bg-gradient-to-r from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-5 bg-gradient-to-l from-slate-950 to-transparent" />
      </div>

      {/* Grid of Routine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredRoutines.map(routine => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            onStart={onStartRoutine}
            onEdit={onEditRoutine}
            onDuplicate={onDuplicateRoutine}
            onDelete={onDeleteRoutine}
            onViewDetails={onViewDetails}
            onShare={setSharingRoutine}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredRoutines.length === 0 && (
        <div className="p-12 text-center glass-card rounded-3xl border border-white/10 space-y-3">
          <Dumbbell className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-200">Nenhuma rotina encontrada</h4>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Não encontramos rotinas correspondentes ao filtro atual.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Todos');
            }}
            className="text-xs text-emerald-400 hover:underline font-bold"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}

      {/* Restore defaults helper */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={() => {
            if (confirm('Deseja restaurar as rotinas pré-carregadas originais? Suas rotinas personalizadas serão mantidas.')) {
              onResetDefaults();
            }
          }}
          className="text-[11px] text-slate-500 hover:text-slate-400 flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3 h-3" /> Restaurar Rotinas Padrão de Calistenia
        </button>
      </div>
      {/* D21: Modal de Compartilhamento & Exportação de Ficha de Treino */}
      {sharingRoutine && (
        <RoutineShareModal
          routine={sharingRoutine}
          onClose={() => setSharingRoutine(null)}
        />
      )}
    </div>
  );
};
