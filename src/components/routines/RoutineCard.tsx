import { useState } from 'react';
import type { Routine, MuscleGroup } from '../../types';
import { EXERCISES_DATABASE, MUSCLE_LABELS } from '../../data/exercisesData';
import { soundManager } from '../../utils/audio';
import { Play, Clock, Dumbbell, MoreVertical, Edit2, Copy, Trash2, Zap, Share2 } from 'lucide-react';

interface RoutineCardProps {
  routine: Routine;
  onStart: (routine: Routine) => void;
  onEdit: (routine: Routine) => void;
  onDuplicate: (routine: Routine) => void;
  onDelete: (id: string) => void;
  onViewDetails: (routine: Routine) => void;
  onShare?: (routine: Routine) => void;
}

export const RoutineCard = ({
  routine,
  onStart,
  onEdit,
  onDuplicate,
  onDelete,
  onViewDetails,
  onShare,
}: RoutineCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

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
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Intermediário':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Avançado':
        return 'bg-orange-500/10 text-orange-300 border-orange-500/30';
      case 'Elite':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getCategoryTheme = (cat: Routine['category']) => {
    switch (cat) {
      case 'Push':
        return {
          pill: 'text-rose-300 border-rose-500/30 bg-rose-500/10',
          gradientBar: 'from-rose-500 via-pink-500 to-transparent',
        };
      case 'Pull':
        return {
          pill: 'text-sky-300 border-sky-500/30 bg-sky-500/10',
          gradientBar: 'from-sky-500 via-cyan-400 to-transparent',
        };
      case 'Legs':
        return {
          pill: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
          gradientBar: 'from-amber-500 via-orange-400 to-transparent',
        };
      case 'Core':
        return {
          pill: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
          gradientBar: 'from-emerald-500 via-teal-400 to-transparent',
        };
      case 'Skill':
        return {
          pill: 'text-purple-300 border-purple-500/30 bg-purple-500/10',
          gradientBar: 'from-purple-500 via-violet-400 to-transparent',
        };
      default:
        return {
          pill: 'text-indigo-300 border-indigo-500/30 bg-indigo-500/10',
          gradientBar: 'from-indigo-500 via-blue-400 to-transparent',
        };
    }
  };

  const theme = getCategoryTheme(routine.category);

  return (
    <div className="glass-card rounded-3xl p-5 shadow-xl hover:border-white/15 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden">
      {/* Top Ambient Glow Edge Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradientBar}`} />

      {/* Top Meta Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border ${theme.pill}`}>
              {routine.category}
            </span>
            <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${getDifficultyColor(routine.difficulty)}`}>
              {routine.difficulty}
            </span>
            {routine.isCustom && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> Criada
              </span>
            )}
            {routine.targetAudience && routine.targetAudience !== 'geral' && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {routine.targetAudience === 'iniciante_absoluto' && 'Iniciante Absoluto'}
                {routine.targetAudience === 'mulheres' && 'Mulheres'}
                {routine.targetAudience === 'longevidade_40' && '40+ Longevidade'}
                {routine.targetAudience === 'retorno_pausa' && 'Retorno Pós-Pausa'}
                {routine.targetAudience === 'casa_sem_equipamento' && 'Móveis / Casa'}
              </span>
            )}
          </div>

          {/* Routine Options Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition active:scale-95"
              title="Opções"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-40 w-44 glass-panel border border-white/10 rounded-2xl shadow-2xl py-1 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onViewDetails(routine);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:bg-white/[0.06] flex items-center gap-2"
                  >
                    <Dumbbell className="w-3.5 h-3.5 text-slate-400" /> Ver Detalhes
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(routine);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:bg-white/[0.06] flex items-center gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-cyan-400" /> Editar Rotina
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate(routine);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:bg-white/[0.06] flex items-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" /> Duplicar Rotina
                  </button>
                  {onShare && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onShare(routine);
                      }}
                      className="w-full px-3 py-2 text-left text-slate-300 hover:bg-white/[0.06] flex items-center gap-2"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-400" /> Exportar / PDF
                    </button>
                  )}
                  {routine.isCustom && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        if (confirm(`Deseja realmente excluir a rotina "${routine.title}"?`)) {
                          onDelete(routine.id);
                        }
                      }}
                      className="w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 border-t border-white/5"
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
          className="text-lg font-extrabold text-slate-100 hover:text-emerald-400 transition cursor-pointer tracking-tight"
        >
          {routine.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {routine.description}
        </p>
        {routine.safetyNotes && (
          <div className="mt-2.5 flex items-start gap-1.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 leading-tight">
            <span className="shrink-0 font-bold">🛡️</span>
            <span className="line-clamp-2">{routine.safetyNotes}</span>
          </div>
        )}

        {/* Exercises Preview List */}
        <div className="mt-3.5 space-y-1.5">
          {routine.exercises.slice(0, 3).map((re, idx) => {
            const ex = EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
            return (
              <div
                key={idx}
                className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/50 hover:bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/[0.04] transition"
              >
                <span className="truncate max-w-[190px] font-medium text-slate-200">
                  {ex ? ex.name : re.exerciseId}
                </span>
                <span className="text-slate-400 shrink-0 text-[11px] font-mono">
                  {re.sets} × {re.targetReps ? `${re.targetReps} reps` : `${re.targetHoldSeconds}s`}
                </span>
              </div>
            );
          })}
          {routine.exercises.length > 3 && (
            <p className="text-[11px] text-slate-400 pl-1 font-medium">
              + {routine.exercises.length - 3} outros exercícios na rotina
            </p>
          )}
        </div>

        {/* Muscle Focus Chips */}
        {primaryMuscles.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1">
            {primaryMuscles.slice(0, 4).map(m => (
              <span
                key={m}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.04] text-slate-300 border border-white/[0.06]"
              >
                {MUSCLE_LABELS[m] || m}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Duration, Exercise count & Start Workout CTA */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> {routine.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-slate-400" /> {routine.exercises.length} exerc.
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onShare && (
            <button
              onClick={() => onShare(routine)}
              className="p-2.5 rounded-2xl glass-card text-slate-400 hover:text-white border border-white/10 active:scale-95 transition"
              title="Compartilhar ou exportar para PDF"
              aria-label="Compartilhar ficha"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => {
              soundManager.triggerHaptic([40]);
              onStart(routine);
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition glow-emerald"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Treinar
          </button>
        </div>
      </div>
    </div>
  );
};
