import React from 'react';
import type { Routine, MuscleGroup } from '../../types';
import { EXERCISES_DATABASE } from '../../data/exercisesData';
import { MuscleMap } from '../visuals/MuscleMap';
import { X, Play, Clock, Dumbbell, Shield, Info } from 'lucide-react';

interface RoutineDetailModalProps {
  routine: Routine | null;
  onClose: () => void;
  onStart: (routine: Routine) => void;
  onSelectExerciseToInspect: (exerciseId: string) => void;
}

export const RoutineDetailModal: React.FC<RoutineDetailModalProps> = ({
  routine,
  onClose,
  onStart,
  onSelectExerciseToInspect,
}) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {routine.category}
            </span>
            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {routine.difficulty}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Title & Stats */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">{routine.title}</h2>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">{routine.description}</p>

            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{routine.estimatedMinutes} minutos estimados</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
                <Dumbbell className="w-4 h-4 text-cyan-400" />
                <span>{routine.exercises.length} exercícios</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>{totalSets} séries totais</span>
              </div>
            </div>
          </div>

          {/* Muscle Anatomy Diagram for this Routine */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sequência de Exercícios ({routine.exercises.length})
            </h3>

            <div className="space-y-2.5">
              {routine.exercises.map((re, index) => {
                const ex = EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
                return (
                  <div
                    key={index}
                    className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-200">
                            {ex ? ex.name : re.exerciseId}
                          </span>
                          {ex && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                              {ex.type === 'isometric' ? 'Isometria' : 'Repetições'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-emerald-400 mt-0.5 flex items-center gap-2">
                          <span>
                            {re.sets} séries × {re.targetReps ? `${re.targetReps} reps` : `${re.targetHoldSeconds}s`}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{re.restSeconds}s descanso</span>
                        </div>
                        {re.notes && (
                          <p className="text-[11px] text-slate-400 mt-1 italic">
                            Nota: {re.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {ex && (
                      <button
                        onClick={() => onSelectExerciseToInspect(ex.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition shrink-0"
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

        {/* Modal Bottom CTA */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800 transition"
          >
            Voltar
          </button>
          <button
            onClick={() => {
              onClose();
              onStart(routine);
            }}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 hover:brightness-110 active:scale-95 transition"
          >
            <Play className="w-4 h-4 fill-current" /> Iniciar Treino Agora
          </button>
        </div>
      </div>
    </div>
  );
};
