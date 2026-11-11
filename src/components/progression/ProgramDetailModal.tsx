import React, { useState } from 'react';
import type { StructuredProgram, UserProgramEnrollment, ProgramSession } from '../../types/gamification';
import type { Routine, RoutineExercise } from '../../types';
import { getExerciseById, EXERCISES_DATABASE } from '../../data/exercisesData';
import { soundManager } from '../../utils/audio';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import {
  X,
  Play,
  Calendar,
  CheckCircle2,
  RotateCcw,
  Pause,
  Trash2,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface ProgramDetailModalProps {
  program: StructuredProgram;
  enrollment?: UserProgramEnrollment | null;
  onClose: () => void;
  onEnroll: (programId: string) => void;
  onCompleteSession: (programId: string, sessionId: string) => void;
  onPause: (programId: string) => void;
  onResume: (programId: string) => void;
  onAbandon: (programId: string) => void;
  onRestart: (programId: string) => void;
  onStartSessionWorkout: (routine: Routine, programId: string, sessionId: string) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  enrollment,
  onClose,
  onEnroll,
  onCompleteSession,
  onPause,
  onResume,
  onAbandon,
  onRestart,
  onStartSessionWorkout,
}) => {
  useBodyScrollLock(true, onClose);

  const [selectedWeek, setSelectedWeek] = useState<number>(enrollment?.currentWeek || 1);
  const isEnrolled = Boolean(enrollment && enrollment.status !== 'abandoned');
  const isCompleted = enrollment?.status === 'completed';
  const isPaused = enrollment?.status === 'paused';

  const completedSessionIds = new Set(enrollment?.completedSessionIds || []);
  const currentWeekData = program.weeks.find(w => w.weekNumber === selectedWeek) || program.weeks[0];

  // Converte a sessão do programa para uma Routine executável pelo WorkoutPlayer
  const handleLaunchSession = (session: ProgramSession) => {
    soundManager.triggerHaptic([40]);
    const routineExercises: RoutineExercise[] = session.exercises.map(ex => {
      const dbEx = getExerciseById(ex.exerciseId) || EXERCISES_DATABASE.find(e => e.id === ex.exerciseId);
      const isIso = dbEx?.type === 'isometric' || ex.repsOrHold.includes('s');
      const numericVal = parseInt(ex.repsOrHold.replace(/\D/g, ''), 10) || (isIso ? 20 : 10);

      return {
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: isIso ? undefined : numericVal,
        holdSeconds: isIso ? numericVal : undefined,
        restSeconds: ex.restSeconds,
        notes: ex.notes,
      };
    });

    const routine: Routine = {
      id: `prog-${program.id}-${session.id}`,
      title: `${program.title} • ${session.title}`,
      description: `${session.dayLabel} - ${session.focus}`,
      category: 'Full Body',
      difficulty: program.recommendedLevel,
      estimatedMinutes: session.estimatedMinutes,
      exercises: routineExercises,
      isCustom: true,
      safetyNotes: 'Sessão do programa guiado CalisteFlow. Mantenha cadência controlada e descanse nos intervalos.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onStartSessionWorkout(routine, program.id, session.id);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="program-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl glass-panel border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[min(94dvh,calc(100dvh-2rem))] overflow-hidden bg-slate-950/95"
        onClick={e => e.stopPropagation()}
      >
        {/* Banner Hero */}
        <div className={`p-5 sm:p-6 bg-gradient-to-r ${program.bannerGradient} relative shrink-0`}>
          <button
            onClick={onClose}
            aria-label="Fechar programa"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition active:scale-95 cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{program.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/30 text-white border border-white/20">
              {program.durationWeeks} Semanas • {program.sessionsPerWeek}x/sem • {program.recommendedLevel}
            </span>
            {isEnrolled && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                {isCompleted ? 'Concluído' : isPaused ? 'Pausado' : 'Em Andamento'}
              </span>
            )}
          </div>

          <h2 id="program-detail-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {program.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/90 font-medium mt-1 leading-relaxed">
            {program.subtitle}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Objective & Presentation */}
          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Apresentação & Metodologia
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {program.presentation}
            </p>
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
              <span><strong>Objetivo Final:</strong> {program.objective}</span>
            </div>
          </div>

          {/* Completion Criteria */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Critérios para Conclusão Oficial
            </h3>
            <div className="space-y-1.5">
              {program.completionCriteria.map((c, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Week Selector Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400" /> Calendário de Semanas
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {completedSessionIds.size} sessões feitas
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {program.weeks.map(w => {
                const isSelected = w.weekNumber === selectedWeek;
                const weekDone = w.sessions.every(s => completedSessionIds.has(s.id));
                return (
                  <button
                    key={w.weekNumber}
                    type="button"
                    onClick={() => {
                      soundManager.triggerHaptic([15]);
                      setSelectedWeek(w.weekNumber);
                    }}
                    className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md'
                        : weekDone
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <span>Semana {w.weekNumber}</span>
                    {weekDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>

            {/* Current Week Card */}
            {currentWeekData && (
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-slate-100">
                    Semana {currentWeekData.weekNumber}: {currentWeekData.theme}
                  </h4>
                </div>

                {/* Sessions in this week */}
                <div className="space-y-2.5 pt-1">
                  {currentWeekData.sessions.map(session => {
                    const isSessionDone = completedSessionIds.has(session.id);
                    return (
                      <div
                        key={session.id}
                        className={`p-3.5 rounded-2xl border transition ${
                          isSessionDone
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-slate-900/80 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase text-teal-400">
                                {session.dayLabel}
                              </span>
                              <span className="text-[10px] text-slate-400">• {session.estimatedMinutes} min</span>
                            </div>
                            <h5 className="text-xs sm:text-sm font-bold text-slate-100 mt-0.5">
                              {session.title}
                            </h5>
                            <span className="text-[11px] text-slate-400">{session.focus}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isSessionDone ? (
                              <button
                                type="button"
                                onClick={() => onCompleteSession(program.id, session.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Concluído</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleLaunchSession(session)}
                                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition shadow-md glow-emerald cursor-pointer flex items-center gap-1.5"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Treinar</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Exercise Pills */}
                        <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
                          {session.exercises.map((ex, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold text-slate-300 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5"
                            >
                              {ex.sets}x {ex.repsOrHold} • {ex.exerciseId.replace(/-/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Program Enrollment Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          {!isEnrolled ? (
            <button
              type="button"
              onClick={() => {
                soundManager.triggerHaptic([40]);
                onEnroll(program.id);
              }}
              className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-sm hover:brightness-110 active:scale-95 transition shadow-xl glow-emerald cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Inscrever-se Neste Programa</span>
            </button>
          ) : (
            <div className="flex items-center justify-between w-full flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {isPaused ? (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.triggerHaptic([30]);
                      onResume(program.id);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer flex items-center gap-1.5 active:scale-95 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Retomar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.triggerHaptic([20]);
                      onPause(program.id);
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-white/10 text-slate-300 hover:text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 active:scale-95 transition"
                  >
                    <Pause className="w-3.5 h-3.5" /> Pausar
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Deseja reiniciar seu progresso neste programa desde o início?')) {
                      soundManager.triggerHaptic([30]);
                      onRestart(program.id);
                    }
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white/5 text-slate-400 hover:text-slate-200 font-bold text-xs cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Deseja abandonar este programa? Seu histórico permanecerá salvo.')) {
                    soundManager.triggerHaptic([25]);
                    onAbandon(program.id);
                  }
                }}
                className="py-2.5 px-3 rounded-xl text-rose-400 hover:bg-rose-500/10 font-bold text-xs cursor-pointer flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Abandonar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
