import React, { useState } from 'react';
import type { Routine, RoutineExercise, ExerciseCategory, ExerciseDifficulty } from '../../types';
import { EXERCISES_DATABASE } from '../../data/exercisesData';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Save, Dumbbell } from 'lucide-react';

interface RoutineEditorModalProps {
  routineToEdit: Routine | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (routine: Routine) => void;
}

export const RoutineEditorModal: React.FC<RoutineEditorModalProps> = ({
  routineToEdit,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(routineToEdit?.title || '');
  const [description, setDescription] = useState(routineToEdit?.description || '');
  const [category, setCategory] = useState<ExerciseCategory>(routineToEdit?.category || 'Push');
  const [difficulty, setDifficulty] = useState<ExerciseDifficulty>(routineToEdit?.difficulty || 'Intermediário');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(routineToEdit?.estimatedMinutes || 30);
  const [exercises, setExercises] = useState<RoutineExercise[]>(
    routineToEdit?.exercises || [
      { exerciseId: 'pushup', sets: 3, targetReps: 12, restSeconds: 60, notes: '' },
    ]
  );
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  const handleAddExercise = (exerciseId: string) => {
    const exData = EXERCISES_DATABASE.find(e => e.id === exerciseId);
    if (!exData) return;

    const newExercise: RoutineExercise = {
      exerciseId,
      sets: exData.defaultSets || 3,
      targetReps: exData.type === 'reps' ? exData.defaultReps || 10 : undefined,
      targetHoldSeconds: exData.type === 'isometric' ? exData.defaultHoldSeconds || 30 : undefined,
      restSeconds: exData.defaultRestSeconds || 60,
      notes: '',
    };

    setExercises([...exercises, newExercise]);
    setShowAddDrawer(false);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= exercises.length) return;

    const updated = [...exercises];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setExercises(updated);
  };

  const handleUpdateExercise = (index: number, patch: Partial<RoutineExercise>) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], ...patch };
    setExercises(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor, informe o título da rotina.');
      return;
    }
    if (exercises.length === 0) {
      alert('Adicione pelo menos um exercício na rotina.');
      return;
    }

    const savedRoutine: Routine = {
      id: routineToEdit?.id || `custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      exercises,
      isCustom: true,
      createdAt: routineToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(savedRoutine);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[94vh] sm:max-h-[90vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90 backdrop-blur-md">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            {routineToEdit ? 'Editar Rotina' : 'Criar Nova Rotina'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Title & Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Nome da Rotina *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Treino de Peito & Ombros Calistênico"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Descrição ou Objetivo
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Objetivo principal, orientações de intensidade ou aquecimento..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category, Difficulty & Estimated Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ExerciseCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Push">Push (Empurrar)</option>
                <option value="Pull">Pull (Puxar)</option>
                <option value="Legs">Legs (Pernas)</option>
                <option value="Core">Core (Abdômen)</option>
                <option value="Skill">Skill (Habilidades)</option>
                <option value="Full Body">Full Body (Total)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Dificuldade
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as ExerciseDifficulty)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
                <option value="Elite">Elite</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Duração Estimada (min)
              </label>
              <input
                type="number"
                min="5"
                max="180"
                value={estimatedMinutes}
                onChange={e => setEstimatedMinutes(Math.max(5, parseInt(e.target.value) || 30))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Exercises List Editor */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Exercícios da Rotina ({exercises.length})
              </label>
              <button
                type="button"
                onClick={() => setShowAddDrawer(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-500/30 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Exercício
              </button>
            </div>

            {/* List of configured exercises */}
            <div className="space-y-3">
              {exercises.map((re, index) => {
                const exData = EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
                const isIsometric = exData?.type === 'isometric';

                return (
                  <div
                    key={index}
                    className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-sm text-slate-100">
                          {exData ? exData.name : re.exerciseId}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {isIsometric ? 'Isometria' : 'Repetições'}
                        </span>
                      </div>

                      {/* Move & Remove Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveExercise(index, 'up')}
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Subir"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === exercises.length - 1}
                          onClick={() => handleMoveExercise(index, 'down')}
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Descer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(index)}
                          className="p-1 rounded text-rose-400 hover:bg-rose-500/20 ml-1 transition"
                          title="Remover"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Exercise settings grid */}
                    <div className="grid grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Séries</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={re.sets}
                          onChange={e => handleUpdateExercise(index, { sets: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-center"
                        />
                      </div>

                      {isIsometric ? (
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Tempo (s)</label>
                          <input
                            type="number"
                            min="5"
                            max="300"
                            step="5"
                            value={re.targetHoldSeconds || 30}
                            onChange={e => handleUpdateExercise(index, { targetHoldSeconds: Math.max(5, parseInt(e.target.value) || 5) })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-center"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Reps / Série</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={re.targetReps || 10}
                            onChange={e => handleUpdateExercise(index, { targetReps: Math.max(1, parseInt(e.target.value) || 1) })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-center"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Descanso (s)</label>
                        <input
                          type="number"
                          min="10"
                          max="300"
                          step="5"
                          value={re.restSeconds}
                          onChange={e => handleUpdateExercise(index, { restSeconds: Math.max(10, parseInt(e.target.value) || 60) })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-center"
                        />
                      </div>
                    </div>

                    {/* Execution notes */}
                    <div>
                      <input
                        type="text"
                        placeholder="Nota de execução (ex: cotovelos fechados, pausar 1s embaixo...)"
                        value={re.notes || ''}
                        onChange={e => handleUpdateExercise(index, { notes: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 text-xs placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exercise Picker Modal / Drawer */}
          {showAddDrawer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <div className="w-full max-w-lg max-h-[80vh] bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-slate-100 text-sm">Biblioteca de Calistenia</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddDrawer(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="overflow-y-auto space-y-2 py-3 flex-1">
                  {EXERCISES_DATABASE.map(ex => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => handleAddExercise(ex.id)}
                      className="w-full text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 transition flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-xs text-slate-200">{ex.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {ex.category} • {ex.difficulty} • {ex.type === 'isometric' ? 'Isométrico' : 'Repetições'}
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-emerald-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 hover:brightness-110 active:scale-95 transition"
            >
              <Save className="w-4 h-4" /> Salvar Rotina
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
