import React from 'react';
import type { Routine, MuscleGroup } from '../../types';
import { EXERCISES_DATABASE, MUSCLE_LABELS } from '../../data/exercisesData';
import { Play, Clock, Dumbbell, MoreVertical, Edit2, Copy, Trash2 } from 'lucide-react';

interface RoutineCardProps {
  routine: Routine;
  onStart: (routine: Routine) => void;
  onEdit: (routine: Routine) => void;
  onDuplicate: (routine: Routine) => void;
  onDelete: (id: string) => void;
  onViewDetails: (routine: Routine) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onStart,
  onEdit,
  onDuplicate,
  onDelete,
  onViewDetails,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Compute targeted muscles across all exercises
  const primaryMuscles = Array.from(
    new Set(
      routine.exercises.flatMap(re => {
        const ex = EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
        return ex ? ex.primaryMuscles : [];
      })
    )
  ) as MuscleGroup[];

  const getDifficultyColor = (diff: Routine['difficulty']) => {
    switch (diff) {
      case 'Iniciante':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Intermediário':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Avançado':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'Elite':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  const getCategoryColor = (cat: Routine['category']) => {
    switch (cat) {
      case 'Push':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      case 'Pull':
        return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
      case 'Legs':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'Core':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'Skill':
        return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      default:
        return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-lg hover:border-slate-700 transition flex flex-col justify-between relative group">
      {/* Top Meta Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider border ${getCategoryColor(routine.category)}`}>
              {routine.category}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${getDifficultyColor(routine.difficulty)}`}>
              {routine.difficulty}
            </span>
            {routine.isCustom && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Personalizada
              </span>
            )}
          </div>

          {/* Routine Options Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Opções"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-40 w-44 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl py-1 text-xs">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onViewDetails(routine);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Dumbbell className="w-3.5 h-3.5 text-slate-400" /> Ver Detalhes
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(routine);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-cyan-400" /> Editar Rotina
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate(routine);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" /> Duplicar Rotina
                  </button>
                  {routine.isCustom && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        if (confirm(`Deseja realmente excluir a rotina "${routine.title}"?`)) {
                          onDelete(routine.id);
                        }
                      }}
                      className="w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 border-t border-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Excluir Rotina
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3
          onClick={() => onViewDetails(routine)}
          className="text-lg font-bold text-slate-100 hover:text-emerald-400 transition cursor-pointer"
        >
          {routine.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {routine.description}
        </p>

        {/* Exercises Preview List */}
        <div className="mt-3.5 space-y-1.5">
          {routine.exercises.slice(0, 3).map((re, idx) => {
            const ex = EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
            return (
              <div key={idx} className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800/60">
                <span className="truncate max-w-[180px] font-medium text-slate-200">
                  {ex ? ex.name : re.exerciseId}
                </span>
                <span className="text-slate-400 shrink-0 text-[11px]">
                  {re.sets} × {re.targetReps ? `${re.targetReps} reps` : `${re.targetHoldSeconds}s`}
                </span>
              </div>
            );
          })}
          {routine.exercises.length > 3 && (
            <p className="text-[11px] text-slate-400 pl-1 font-medium">
              + {routine.exercises.length - 3} outros exercícios
            </p>
          )}
        </div>

        {/* Muscle Focus Chips */}
        {primaryMuscles.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {primaryMuscles.slice(0, 4).map(m => (
              <span key={m} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60">
                {MUSCLE_LABELS[m] || m}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Duration, Exercise count & Start Workout CTA */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> {routine.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <Dumbbell className="w-3.5 h-3.5 text-slate-400" /> {routine.exercises.length} exerc.
          </span>
        </div>

        <button
          onClick={() => onStart(routine)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/30 hover:brightness-110 active:scale-95 transition"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> Treinar
        </button>
      </div>
    </div>
  );
};
