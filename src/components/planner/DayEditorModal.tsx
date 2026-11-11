import { useState } from 'react';
import type {
  WeeklyDayPlan,
  BodyFocus,
  FitnessGoal,
  WorkoutBlock,
  PlannedExercise,
  MuscleGroup,
} from '../../types';
import { EXERCISES_DATABASE } from '../../data/exercisesData';
import { FOCUS_LABELS, generateDayWorkout } from '../../utils/workoutGenerator';
import { MuscleMap } from '../visuals/MuscleMap';
import { ExerciseMedia } from '../visuals/figure/ExerciseMedia';
import { soundManager } from '../../utils/audio';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import {
  X,
  Lock,
  Unlock,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Check,
  Flame,
  Clock,
  Target,
  Sliders,
} from 'lucide-react';

interface DayEditorModalProps {
  day: WeeklyDayPlan;
  onSaveDay: (updatedDay: WeeklyDayPlan) => void;
  onClose: () => void;
}

export const DayEditorModal = ({ day, onSaveDay, onClose }: DayEditorModalProps) => {
  const [name, setName] = useState<string>(day.name);
  const [isActive, setIsActive] = useState<boolean>(day.isActive);
  const [targetDurationMinutes, setTargetDurationMinutes] = useState<15 | 20 | 30 | 45 | 60>(
    day.targetDurationMinutes
  );
  const [goal, setGoal] = useState<FitnessGoal>(day.goal);
  const [focuses, setFocuses] = useState<BodyFocus[]>(day.focuses);
  const [blocks, setBlocks] = useState<WorkoutBlock[]>(day.blocks);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState<string | null>(null); // blockId

  // Toggle body focus
  const toggleFocus = (focus: BodyFocus) => {
    soundManager.triggerHaptic([20]);
    setFocuses(prev =>
      prev.includes(focus) ? prev.filter(f => f !== focus) : [...prev, focus]
    );
  };

  // Direct click on SVG Muscle Map
  const handleMuscleMapClick = (muscle: MuscleGroup) => {
    toggleFocus(muscle as BodyFocus);
  };

  // Regenerate exercises while keeping locked ones
  const handleRegenerate = () => {
    soundManager.triggerHaptic([35]);
    const regenerated = generateDayWorkout({
      focuses: focuses.length > 0 ? focuses : ['full_body'],
      targetDurationMinutes,
      goal,
      userLevel: 'Intermediário',
      equipments: ['nenhum', 'barra', 'paralelas'],
      existingBlocks: blocks,
    });
    setBlocks(regenerated);
  };

  // Toggle lock on an exercise
  const toggleExerciseLock = (blockId: string, exIndex: number) => {
    soundManager.triggerHaptic([15]);
    setBlocks(prev =>
      prev.map(b => {
        if (b.id !== blockId) return b;
        const copyEx = [...b.exercises];
        copyEx[exIndex] = {
          ...copyEx[exIndex],
          locked: !copyEx[exIndex].locked,
        };
        return { ...b, exercises: copyEx };
      })
    );
  };

  // Delete exercise
  const removeExercise = (blockId: string, exIndex: number) => {
    soundManager.triggerHaptic([30]);
    setBlocks(prev =>
      prev.map(b => {
        if (b.id !== blockId) return b;
        return {
          ...b,
          exercises: b.exercises.filter((_, idx) => idx !== exIndex),
        };
      })
    );
  };

  // Move exercise up or down in block
  const moveExercise = (blockId: string, fromIdx: number, toIdx: number) => {
    soundManager.triggerHaptic([15]);
    setBlocks(prev =>
      prev.map(b => {
        if (b.id !== blockId) return b;
        const copy = [...b.exercises];
        const [moved] = copy.splice(fromIdx, 1);
        copy.splice(toIdx, 0, moved);
        return { ...b, exercises: copy };
      })
    );
  };



  // Add custom exercise from database to block
  const addExerciseToBlock = (blockId: string, exerciseId: string) => {
    const exData = EXERCISES_DATABASE.find(e => e.id === exerciseId);
    if (!exData) return;

    soundManager.triggerHaptic([25]);
    const newPlanned: PlannedExercise = {
      exerciseId,
      sets: 3,
      targetReps: exData.type === 'reps' ? exData.defaultReps || 10 : undefined,
      targetHoldSeconds: exData.type === 'isometric' ? exData.defaultHoldSeconds || 30 : undefined,
      restSeconds: exData.defaultRestSeconds || 60,
    };

    setBlocks(prev =>
      prev.map(b => {
        if (b.id !== blockId) return b;
        return { ...b, exercises: [...b.exercises, newPlanned] };
      })
    );
    setShowAddExerciseModal(null);
  };

  const handleSave = () => {
    soundManager.triggerHaptic([40]);
    onSaveDay({
      ...day,
      name,
      isActive,
      targetDurationMinutes,
      goal,
      focuses,
      blocks,
      isCustomized: true,
    });
    onClose();
  };

  // Extract selected muscle groups for MuscleMap highlighting
  const primaryHighlightedMuscles = focuses.filter(
    f => f !== 'full_body' && f !== 'skills' && f !== 'mobilidade' && f !== 'core'
  ) as MuscleGroup[];

  const allFocusKeys = Object.keys(FOCUS_LABELS) as BodyFocus[];

  useBodyScrollLock(true, onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[min(92dvh,calc(100dvh-2rem))] glass-panel border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 glass-panel">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black font-mono text-sm glow-emerald">
              {day.shortName}
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                {day.dayName}
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-100">
                Editar Treino do Dia
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Day Active Status Toggle */}
          <div className="p-4 glass-card rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-sm text-slate-100">
                Treino Ativo neste Dia
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                {isActive ? 'Dia reservado para treino' : 'Marcado como Descanso Total'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                soundManager.triggerHaptic([20]);
                setIsActive(!isActive);
              }}
              className={`px-4 py-2 rounded-2xl font-black text-xs transition active:scale-95 border ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg glow-emerald'
                  : 'glass-card text-slate-400 border-white/10'
              }`}
            >
              {isActive ? 'ATIVO' : 'DESCANSO'}
            </button>
          </div>

          {isActive && (
            <>
              {/* Day Title & Goal Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Nome da Sessão:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Push Intenso (Peito e Tríceps)"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 text-slate-100 text-sm font-semibold focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" /> Duração Alvo:
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {([20, 30, 45, 60] as const).map(min => (
                        <button
                          key={min}
                          type="button"
                          onClick={() => setTargetDurationMinutes(min)}
                          className={`py-2 rounded-xl text-xs font-black font-mono transition border ${
                            targetDurationMinutes === min
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 glow-emerald'
                              : 'glass-card text-slate-400 border-white/5 hover:text-white'
                          }`}
                        >
                          {min}m
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goal */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-cyan-400" /> Objetivo:
                    </label>
                    <select
                      value={goal}
                      onChange={e => setGoal(e.target.value as FitnessGoal)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-xs font-semibold focus:outline-none focus:border-cyan-500"
                    >
                      <option value="hipertrofia">Hipertrofia (8-12 reps)</option>
                      <option value="forca">Força (4-6 reps pesadas)</option>
                      <option value="resistencia">Resistência (+15 reps)</option>
                      <option value="skills">Skills & Isometria</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Focus Selector: Interactive Muscle Map & Body Chips */}
              <div className="glass-card p-4 sm:p-5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-emerald-400" /> Foco Muscular & Habilidades
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Toque nos músculos do mapa ou selecione pelos chips abaixo
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {focuses.length} selecionado(s)
                  </span>
                </div>

                {/* SVG Muscle Map Selector */}
                <div className="py-2 flex justify-center">
                  <MuscleMap
                    primaryMuscles={primaryHighlightedMuscles}
                    onSelectMuscle={handleMuscleMapClick}
                    size="sm"
                  />
                </div>

                {/* Body Focus Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {allFocusKeys.map(key => {
                    const isSelected = focuses.includes(key);
                    const info = FOCUS_LABELS[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleFocus(key)}
                        className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 border ${
                          isSelected
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border-emerald-400 shadow-md font-black glow-emerald'
                            : 'glass-card text-slate-300 hover:text-white border-white/10'
                        }`}
                      >
                        <span>{info.emoji}</span>
                        <span>{info.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Regenerate CTA */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Altere os focos e gere novos exercícios compatíveis:
                  </span>
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    className="px-4 py-2 rounded-2xl bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 font-black text-xs flex items-center gap-1.5 transition active:scale-95 glow-emerald"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Regenerar Treino
                  </button>
                </div>
              </div>

              {/* Workout Structure Blocks */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-cyan-400" /> Estrutura de Blocos ({blocks.reduce((acc, b) => acc + b.exercises.length, 0)} exercícios)
                  </h3>
                </div>

                {blocks.map(block => (
                  <div
                    key={block.id}
                    className="glass-card rounded-2xl p-4 border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                      <span className="font-extrabold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        {block.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAddExerciseModal(block.id)}
                        className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar
                      </button>
                    </div>

                    {/* Exercises in block */}
                    <div className="space-y-2">
                      {block.exercises.map((pe, idx) => {
                        const exData = EXERCISES_DATABASE.find(e => e.id === pe.exerciseId);
                        return (
                          <div
                            key={`${pe.exerciseId}-${idx}`}
                            className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              {/* Reorder Buttons */}
                              <div className="flex flex-col gap-0.5">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => moveExercise(block.id, idx, idx - 1)}
                                  className="text-slate-500 hover:text-white disabled:opacity-20"
                                >
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === block.exercises.length - 1}
                                  onClick={() => moveExercise(block.id, idx, idx + 1)}
                                  className="text-slate-500 hover:text-white disabled:opacity-20"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Thumbnail / Avatar */}
                              {exData && (
                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-sm bg-slate-900/60">
                                  <ExerciseMedia exercise={exData} mode="card" className="w-full h-full" />
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                <span className="font-extrabold text-slate-100 block truncate">
                                  {exData?.name || pe.exerciseId}
                                </span>
                                <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-emerald-400">
                                  <span>{pe.sets} séries</span>
                                  <span>•</span>
                                  <span>
                                    {pe.targetReps ? `${pe.targetReps} reps` : `${pe.targetHoldSeconds}s`}
                                  </span>
                                  <span>•</span>
                                  <span className="text-slate-400">{pe.restSeconds}s rest</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions: Lock & Delete */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => toggleExerciseLock(block.id, idx)}
                                title={pe.locked ? 'Exercício travado' : 'Travar exercício'}
                                className={`p-2 rounded-xl border transition ${
                                  pe.locked
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 glow-amber'
                                    : 'text-slate-400 hover:text-slate-200 border-white/5'
                                }`}
                              >
                                {pe.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                type="button"
                                onClick={() => removeExercise(block.id, idx)}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 border border-white/5 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {block.exercises.length === 0 && (
                        <div className="text-center py-3 text-xs text-slate-500 italic">
                          Nenhum exercício neste bloco. Toque em "+ Adicionar".
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer com Safe Area */}
        <div className="p-4 sm:p-5 pb-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] border-t border-white/10 flex items-center justify-between glass-panel shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl glass-card text-slate-300 hover:text-white text-xs font-bold transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition flex items-center gap-1.5 shadow-xl shadow-emerald-500/20 glow-emerald"
          >
            <Check className="w-4 h-4 stroke-[3]" /> Salvar Dia
          </button>
        </div>
      </div>

      {/* Add Exercise Modal Picker */}
      {showAddExerciseModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowAddExerciseModal(null)}
        >
          <div
            className="w-full max-w-md glass-panel border border-white/10 rounded-3xl p-5 shadow-2xl max-h-[min(80dvh,calc(100dvh-3rem))] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 shrink-0">
              <h4 className="text-sm font-black text-slate-100">
                Adicionar Exercício ao Bloco
              </h4>
              <button
                type="button"
                onClick={() => setShowAddExerciseModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
              {EXERCISES_DATABASE.map(ex => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => addExerciseToBlock(showAddExerciseModal, ex.id)}
                  className="w-full p-2.5 rounded-2xl glass-card border border-white/5 hover:border-white/20 transition flex items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-sm bg-slate-900/60">
                      <ExerciseMedia exercise={ex} mode="card" className="w-full h-full" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-100 block">
                        {ex.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {ex.category} • {ex.difficulty}
                      </span>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-emerald-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
