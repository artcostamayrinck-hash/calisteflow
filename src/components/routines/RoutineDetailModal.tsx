import type { Routine, MuscleGroup } from '../../types';
import { EXERCISES_DATABASE } from '../../data/exercisesData';
import { MuscleMap } from '../visuals/MuscleMap';
import { ExerciseMedia } from '../visuals/figure/ExerciseMedia';
import { X, Play, Clock, Dumbbell, Shield, Info, AlertTriangle } from 'lucide-react';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';

interface RoutineDetailModalProps {
  routine: Routine | null;
  onClose: () => void;
  onStart: (routine: Routine) => void;
  onSelectExerciseToInspect: (exerciseId: string) => void;
}

export const RoutineDetailModal = ({
  routine,
  onClose,
  onStart,
  onSelectExerciseToInspect,
}: RoutineDetailModalProps) => {
  useBodyScrollLock(Boolean(routine), onClose);

  if (!routine) return null;

  // Aggregate all muscles worked across this routine
  const allPrimaryMuscles = Array.from(
    new Set(
      routine.exercises.flatMap(re => {
        const ex = EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
        return ex ? ex.primaryMuscles : [];
      })
    )
  ) as MuscleGroup[];

  const allSecondaryMuscles = Array.from(
    new Set(
      routine.exercises.flatMap(re => {
        const ex = EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
        return ex ? ex.secondaryMuscles.filter(m => !allPrimaryMuscles.includes(m)) : [];
      })
    )
  ) as MuscleGroup[];

  const totalSets = routine.exercises.reduce((acc, curr) => acc + curr.sets, 0);

  const hasWarmup = routine.exercises.some(re => {
    const ex = EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
    return ex?.fase === 'aquecimento' || ex?.fasesSecundarias?.includes('aquecimento');
  });
  const hasStretch = routine.exercises.some(re => {
    const ex = EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
    return ex?.fase === 'alongamento' || ex?.fasesSecundarias?.includes('alongamento');
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[min(92dvh,calc(100dvh-2rem))] sm:max-h-[88dvh] glass-panel border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 glass-panel">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {routine.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/[0.06] text-slate-300 border border-white/10">
              {routine.difficulty}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Title & Stats */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">{routine.title}</h2>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed font-medium">{routine.description}</p>

            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 glass-card px-3 py-1.5 rounded-2xl border border-white/5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">{routine.estimatedMinutes} minutos</span>
              </div>
              <div className="flex items-center gap-1.5 glass-card px-3 py-1.5 rounded-2xl border border-white/5">
                <Dumbbell className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold">{routine.exercises.length} exercícios</span>
              </div>
              <div className="flex items-center gap-1.5 glass-card px-3 py-1.5 rounded-2xl border border-white/5">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">{totalSets} séries totais</span>
              </div>
            </div>
          </div>

          {/* Muscle Anatomy Diagram for this Routine */}
          <div className="glass-card p-5 rounded-3xl border border-white/10 shadow-lg">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <span>Mapa Muscular Deste Treino</span>
            </h3>
            <MuscleMap
              primaryMuscles={allPrimaryMuscles}
              secondaryMuscles={allSecondaryMuscles}
              size="sm"
            />
          </div>

          {/* Exercises Sequence */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Sequência de Exercícios ({routine.exercises.length})
              </h3>
              <span className="text-[10px] text-slate-400">
                Ordem recomendada: Aquecimento → Treino → Alongamento
              </span>
            </div>

            {(!hasWarmup || !hasStretch) && (
              <div className="p-3.5 rounded-2xl glass-card border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Estrutura de Fases Recomendada:</div>
                  <p className="text-[11px] text-amber-300/80 leading-relaxed">
                    {!hasWarmup && !hasStretch
                      ? 'Esta rotina possui apenas exercícios principais. Recomendamos realizar um bloco de Aquecimento antes e Alongamento ao final.'
                      : !hasWarmup
                      ? 'Recomendamos adicionar exercícios de Aquecimento articular antes de iniciar as séries intensas.'
                      : 'Recomendamos finalizar o treino com exercícios de Alongamento estático para recuperação miofascial.'}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              {routine.exercises.map((re, index) => {
                const ex = EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
                return (
                  <div
                    key={index}
                    className="p-4 glass-card rounded-2xl border border-white/5 hover:border-white/15 transition flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-center gap-3.5">
                      {ex ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-md bg-slate-900/60">
                          <ExerciseMedia exercise={ex} mode="card" className="w-full h-full" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-white/[0.06] text-slate-300 font-black text-xs flex items-center justify-center shrink-0 border border-white/10 font-mono">
                          {index + 1}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm text-slate-100">
                            {ex ? ex.name : re.exerciseId}
                          </span>
                          {ex && (
                            <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              ex.fase === 'aquecimento'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : ex.fase === 'alongamento'
                                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            }`}>
                              {ex.fase === 'aquecimento' ? 'Aquec.' : ex.fase === 'alongamento' ? 'Along.' : 'Treino'}
                            </span>
                          )}
                          {ex && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/5">
                              {ex.type === 'isometric' ? 'Isometria' : 'Repetições'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-emerald-400 mt-0.5 flex items-center gap-2 font-mono">
                          <span>
                            {re.sets} séries × {re.targetReps ? `${re.targetReps} reps` : `${re.targetHoldSeconds}s`}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400">{re.restSeconds}s descanso</span>
                        </div>
                        {re.notes && (
                          <p className="text-[11px] text-amber-300/80 mt-1 italic font-medium">
                            💡 Nota: {re.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {ex && (
                      <button
                        onClick={() => onSelectExerciseToInspect(ex.id)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-white/[0.08] transition shrink-0"
                        title="Ver instruções de postura"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Bottom CTA com Safe Area */}
        <div className="p-4 sm:p-5 pb-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] border-t border-white/10 glass-panel flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl glass-card text-slate-300 text-xs font-bold hover:bg-white/[0.08] transition"
          >
            Voltar
          </button>
          <button
            onClick={() => {
              onClose();
              onStart(routine);
            }}
            className="flex-1 sm:flex-none px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition glow-emerald"
          >
            <Play className="w-4 h-4 fill-current" /> Iniciar Treino Agora
          </button>
        </div>
      </div>
    </div>
  );
};
