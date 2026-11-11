import React, { useState } from 'react';
import type {
  Routine,
  WorkoutSession,
  FitnessGoal,
  ExerciseDifficulty,
  EquipmentType,
  JointLimitation,
  RoutineExercise,
  MuscleGroup,
} from '../../types';
import { getStoredUserProfile, getStoredRoutines, saveRoutines } from '../../utils/storage';
import { generateSmartCustomWorkout } from '../../utils/workoutGenerator';
import { EXERCISES_DATABASE, MUSCLE_LABELS } from '../../data/exercisesData';
import { soundManager } from '../../utils/audio';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import { ExerciseMedia } from '../visuals/figure/ExerciseMedia';
import {
  X,
  Sparkles,
  Play,
  RotateCcw,
  Save,
  ShieldCheck,
  Flame,
  Plus,
  Trash2,
  ChevronLeft,
  Check,
  Info,
} from 'lucide-react';

interface WorkoutGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRoutine: (routine: Routine) => void;
  history?: WorkoutSession[];
  onRoutineSaved?: (routine: Routine) => void;
}

const FITNESS_GOALS: Array<{ id: FitnessGoal; label: string; desc: string; icon: string }> = [
  { id: 'forca', label: 'Força Máxima', desc: 'Séries curtas, alta tensão mecânica e descanso longo', icon: '⚡' },
  { id: 'hipertrofia', label: 'Hipertrofia', desc: 'Volume ótimo de 8-12 reps e descanso moderado', icon: '💪' },
  { id: 'resistencia', label: 'Resistência Muscular', desc: 'Altas repetições com descansos curtos para densidade', icon: '🔥' },
  { id: 'skills', label: 'Habilidades & Isometrias', desc: 'Handstand, L-sit, Planche, Front Lever e transições', icon: '🤸' },
  { id: 'condicionamento', label: 'Condicionamento Metabólico', desc: 'Circuitos aeróbicos dinâmicos e controle cardíaco', icon: '🏃' },
  { id: 'mobilidade', label: 'Mobilidade & Postura', desc: 'Amplitude articular, descompressão e controle neuromuscular', icon: '🧘' },
];

export const WorkoutGeneratorModal: React.FC<WorkoutGeneratorModalProps> = ({
  isOpen,
  onClose,
  onStartRoutine,
  history = [],
  onRoutineSaved,
}) => {
  useBodyScrollLock(isOpen, onClose);

  // Perfil do usuário
  const userProfile = getStoredUserProfile();

  const [step, setStep] = useState<'config' | 'preview'>('config');
  const [goal, setGoal] = useState<FitnessGoal>(userProfile?.goal || 'hipertrofia');
  const [level, setLevel] = useState<ExerciseDifficulty>(
    userProfile?.level === 'Nunca treinei' ? 'Iniciante' : (userProfile?.level as ExerciseDifficulty) || 'Iniciante'
  );
  const [durationMinutes, setDurationMinutes] = useState<15 | 20 | 30 | 45 | 60>(
    userProfile?.durationMinutes || 30
  );
  const [equipments, setEquipments] = useState<EquipmentType[]>(
    userProfile?.equipments || ['nenhum', 'barra']
  );
  const [limitations] = useState<JointLimitation[]>(userProfile?.limitations || []);

  // Treino gerado e editável
  const [generatedRoutine, setGeneratedRoutine] = useState<Routine | null>(null);
  const [fatiguedMuscles, setFatiguedMuscles] = useState<MuscleGroup[]>([]);
  const [showAddExerciseDrawer, setShowAddExerciseDrawer] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  // Gerar treino inicial ao abrir se estiver no preview
  const handleGenerate = () => {
    soundManager.triggerHaptic([35]);
    const { routine, recentFatiguedMuscles } = generateSmartCustomWorkout({
      goal,
      userLevel: level,
      durationMinutes,
      equipments,
      limitations,
      recentHistory: history,
      preferences: userProfile?.preferences,
    });

    setGeneratedRoutine(routine);
    setFatiguedMuscles(recentFatiguedMuscles);
    setStep('preview');
  };

  if (!isOpen) return null;

  // Controles de edição da rotina gerada
  const handleRemoveExercise = (idx: number) => {
    soundManager.triggerHaptic([20]);
    if (!generatedRoutine) return;
    const nextExs = generatedRoutine.exercises.filter((_, i) => i !== idx);
    setGeneratedRoutine({ ...generatedRoutine, exercises: nextExs });
  };

  const handleUpdateExercise = (idx: number, patch: Partial<RoutineExercise>) => {
    if (!generatedRoutine) return;
    const nextExs = [...generatedRoutine.exercises];
    nextExs[idx] = { ...nextExs[idx], ...patch };
    setGeneratedRoutine({ ...generatedRoutine, exercises: nextExs });
  };

  const handleAddExerciseToRoutine = (exId: string) => {
    soundManager.triggerHaptic([20]);
    const exData = EXERCISES_DATABASE.find(e => e.id === exId);
    if (!exData || !generatedRoutine) return;

    const newEx: RoutineExercise = {
      exerciseId: exId,
      sets: exData.defaultSets || 3,
      targetReps: exData.type === 'reps' ? exData.defaultReps || 10 : undefined,
      targetHoldSeconds: exData.type === 'isometric' ? exData.defaultHoldSeconds || 30 : undefined,
      restSeconds: exData.defaultRestSeconds || 60,
    };

    setGeneratedRoutine({
      ...generatedRoutine,
      exercises: [...generatedRoutine.exercises, newEx],
    });
    setShowAddExerciseDrawer(false);
  };

  const handleSaveToRoutines = () => {
    soundManager.triggerHaptic([35]);
    if (!generatedRoutine) return;
    const current = getStoredRoutines();
    const updated = [generatedRoutine, ...current];
    saveRoutines(updated);
    if (onRoutineSaved) {
      onRoutineSaved(generatedRoutine);
    }
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleStartWorkout = () => {
    soundManager.triggerHaptic([50]);
    if (!generatedRoutine) return;
    onStartRoutine(generatedRoutine);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="generator-title"
    >
      <div
        className="w-full max-w-2xl max-h-[min(92dvh,calc(100dvh-2rem))] sm:max-h-[88dvh] glass-panel border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 glass-panel">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                Motor Biomecânico CalisteFlow
              </span>
              <h2 id="generator-title" className="text-base sm:text-lg font-black text-slate-100 tracking-tight">
                Gerador de Treinos Personalizados
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= ETAPA 1: CONFIGURAÇÃO ================= */}
        {step === 'config' && (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Aviso de músculos fadigados recentemente */}
            {history.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5 text-xs text-slate-300">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  O gerador analisa seus treinos recentes para equilibrar a sobrecarga muscular e garantir períodos adequados de supercompensação.
                </span>
              </div>
            )}

            {/* 1. Escolha do Objetivo */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 block">
                1. Qual é o objetivo do treino de hoje?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FITNESS_GOALS.map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      soundManager.triggerHaptic([15]);
                      setGoal(g.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition active:scale-98 ${
                      goal === g.id
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-white glow-emerald shadow-md'
                        : 'bg-white/[0.03] border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm flex items-center gap-2">
                        <span>{g.icon}</span>
                        {g.label}
                      </span>
                      {goal === g.id && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{g.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Duração e Nível */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tempo */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-300 block">
                  2. Duração Total:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {([15, 20, 30, 45, 60] as const).map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        soundManager.triggerHaptic([15]);
                        setDurationMinutes(mins);
                      }}
                      className={`py-2 rounded-xl text-xs font-black transition active:scale-95 ${
                        durationMinutes === mins
                          ? 'bg-cyan-500 text-slate-950 font-black shadow'
                          : 'bg-white/[0.04] text-slate-400 border border-white/5 hover:text-white'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Nível */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-300 block">
                  3. Nível Desejado:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Iniciante', 'Intermediário', 'Avançado', 'Elite'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        soundManager.triggerHaptic([15]);
                        setLevel(lvl);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                        level === lvl
                          ? 'bg-emerald-500 text-slate-950 font-black shadow'
                          : 'bg-white/[0.04] text-slate-400 border border-white/5 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Equipamentos disponíveis rápidos */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 block">
                4. Equipamentos Disponíveis Agora:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'nenhum' as EquipmentType, label: 'Solo' },
                  { id: 'barra' as EquipmentType, label: 'Barra Fixa' },
                  { id: 'paralelas' as EquipmentType, label: 'Paralelas' },
                  { id: 'argolas' as EquipmentType, label: 'Argolas' },
                  { id: 'elastico' as EquipmentType, label: 'Elásticos' },
                  { id: 'banco' as EquipmentType, label: 'Banco/Apoio' },
                ].map(eq => {
                  const isSel = equipments.includes(eq.id);
                  return (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => {
                        soundManager.triggerHaptic([15]);
                        setEquipments(prev =>
                          isSel
                            ? prev.length > 1
                              ? prev.filter(e => e !== eq.id)
                              : ['nenhum']
                            : [...prev, eq.id]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                        isSel
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 glow-amber'
                          : 'bg-white/[0.03] text-slate-400 border border-white/5'
                      }`}
                    >
                      {eq.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer Ético de Prescrição CREF */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-slate-300 leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Aviso de Saúde & CREF:</strong> O algoritmo de prescrição do CalisteFlow segue diretrizes de biomecânica e periodização calistênica, porém não substitui a anamnese e orientação presencial de um profissional de Educação Física habilitado.
              </span>
            </div>

            {/* Botão Gerar */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-2xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition glow-emerald"
              >
                <Sparkles className="w-5 h-5 fill-current" />
                <span>Gerar Treino Personalizado Agora</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= ETAPA 2: PRÉVIA & EDIÇÃO ================= */}
        {step === 'preview' && generatedRoutine && (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Sucesso ao salvar */}
            {saveSuccessNotice && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4" />
                Rotina salva com sucesso na sua biblioteca de treinos!
              </div>
            )}

            {/* Header da Rotina Gerada */}
            <div className="glass-card p-4 sm:p-5 rounded-3xl border border-white/10 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {generatedRoutine.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/10 text-slate-300">
                      {generatedRoutine.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-100">
                    {generatedRoutine.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {generatedRoutine.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  className="p-2.5 rounded-2xl glass-card text-slate-400 hover:text-white border border-white/10 transition active:scale-95 shrink-0"
                  title="Regerar treino com outra variação"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Músculos em recuperação avisados */}
              {fatiguedMuscles.length > 0 && (
                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    Músculos em descanso (treinados nas últimas 48h):{' '}
                    <strong className="text-amber-300">
                      {fatiguedMuscles.map(m => MUSCLE_LABELS[m] || m).join(', ')}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            {/* Lista Editável de Exercícios */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Exercícios da Sessão ({generatedRoutine.exercises.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddExerciseDrawer(true)}
                  className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Exercício
                </button>
              </div>

              <div className="space-y-2">
                {generatedRoutine.exercises.map((re, idx) => {
                  const exData = EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
                  if (!exData) return null;

                  return (
                    <div
                      key={`${re.exerciseId}-${idx}`}
                      className="p-3 sm:p-4 rounded-2xl glass-card border border-white/5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Miniatura do Exercício */}
                        <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-slate-900/60 shadow-sm">
                          <ExerciseMedia exercise={exData} mode="card" className="w-full h-full" />
                        </div>

                        <div className="min-w-0">
                          <span className="font-bold text-slate-200 block truncate sm:text-sm">
                            {idx + 1}. {exData.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {exData.type === 'isometric'
                              ? `${re.sets} séries • ${re.targetHoldSeconds || 30}s hold`
                              : `${re.sets} séries • ${re.targetReps || 10} reps`}
                            {' • '}
                            {re.restSeconds}s descanso
                          </span>
                        </div>
                      </div>

                      {/* Controles de Séries & Remover */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-white/5">
                          <button
                            type="button"
                            onClick={() => handleUpdateExercise(idx, { sets: Math.max(1, re.sets - 1) })}
                            className="w-6 h-6 rounded-lg text-slate-400 hover:text-white flex items-center justify-center font-bold"
                            title="Diminuir séries"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-slate-200 min-w-4 text-center">
                            {re.sets}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateExercise(idx, { sets: re.sets + 1 })}
                            className="w-6 h-6 rounded-lg text-slate-400 hover:text-white flex items-center justify-center font-bold"
                            title="Aumentar séries"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(idx)}
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Remover exercício"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drawer Rápido de Adição de Exercício */}
            {showAddExerciseDrawer && (
              <div className="p-4 rounded-3xl bg-slate-950 border border-white/10 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Selecione um exercício para incluir:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddExerciseDrawer(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                  {EXERCISES_DATABASE.slice(0, 30).map(ex => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => handleAddExerciseToRoutine(ex.id)}
                      className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left text-xs flex items-center justify-between transition border border-transparent hover:border-white/5"
                    >
                      <span className="font-bold text-slate-200">{ex.name}</span>
                      <span className="text-[10px] text-slate-400">{ex.difficulty} • {ex.category}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ações Finais: Iniciar Treino ou Salvar */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => setStep('config')}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl glass-card text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>

              <button
                type="button"
                onClick={handleSaveToRoutines}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl glass-card text-xs font-bold text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/10 flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Rotina</span>
              </button>

              <button
                type="button"
                onClick={handleStartWorkout}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-2xl shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition glow-emerald"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Este Treino Agora</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
