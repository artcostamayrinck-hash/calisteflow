import React, { useState } from 'react';
import type { WorkoutSession, WorkoutStats } from '../../types';
import { MUSCLE_LABELS } from '../../data/exercisesData';
import {
  Trophy,
  Clock,
  Flame,
  CheckCircle2,
  Calendar,
  Trash2,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Play,
  Award,
} from 'lucide-react';

interface HistoryViewProps {
  history: WorkoutSession[];
  stats: WorkoutStats;
  onDeleteSession: (sessionId: string) => void;
  onNavigateToRoutines: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  stats,
  onDeleteSession,
  onNavigateToRoutines,
}) => {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          Histórico & Progresso
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Acompanhe sua consistência calistênica, volume de treino e histórico salvo localmente.
        </p>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Streak */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Streak</span>
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-300">
              {stats.currentStreakDays} {stats.currentStreakDays === 1 ? 'dia' : 'dias'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Sequência ativa</div>
          </div>
        </div>

        {/* Total Workouts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Treinos</span>
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100">{stats.totalWorkouts}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Sessões concluídas</div>
          </div>
        </div>

        {/* Total Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tempo Total</span>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100">
              {Math.floor(stats.totalMinutes / 60) > 0
                ? `${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`
                : `${stats.totalMinutes} min`}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Tempo sob treino</div>
          </div>
        </div>

        {/* Total Sets */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Séries</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100">{stats.totalSets}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Séries executadas</div>
          </div>
        </div>
      </div>

      {/* History Log List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Sessões Recentes ({history.length})
        </h3>

        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map(session => {
              const isExpanded = expandedSessionId === session.id;

              return (
                <div
                  key={session.id}
                  className="bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-5 shadow-lg space-y-3 transition"
                >
                  {/* Session Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(session.endTime || session.startTime)}
                        </span>
                        {session.perceivedEffort && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            RPE {session.perceivedEffort}/10
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-slate-100">
                        {session.routineTitle}
                      </h4>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Deseja excluir esta sessão do histórico?')) {
                          onDeleteSession(session.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Excluir sessão"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick stats pills */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {formatDuration(session.durationSeconds)}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      {session.totalSetsCompleted} séries
                    </span>
                    {session.totalRepsCompleted > 0 && (
                      <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                        <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
                        {session.totalRepsCompleted} reps
                      </span>
                    )}
                    {session.totalIsometricSeconds > 0 && (
                      <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-rose-400" />
                        {session.totalIsometricSeconds}s holds
                      </span>
                    )}
                  </div>

                  {/* Muscle badges */}
                  {session.musclesWorked && session.musclesWorked.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {session.musclesWorked.map(m => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/60"
                        >
                          {MUSCLE_LABELS[m] || m}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Personal notes */}
                  {session.userNotes && (
                    <p className="text-xs bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-slate-300 italic">
                      "{session.userNotes}"
                    </p>
                  )}

                  {/* Detail toggle */}
                  <div className="pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                      className="text-xs text-emerald-400 font-semibold flex items-center gap-1 hover:underline"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" /> Ocultar exercícios
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" /> Ver detalhamento por exercício
                        </>
                      )}
                    </button>

                    {/* Drill-down of sets */}
                    {isExpanded && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-slate-800/40 animate-in fade-in duration-150">
                        {session.exercises.map((ex, exIdx) => (
                          <div
                            key={exIdx}
                            className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 text-xs"
                          >
                            <div className="font-semibold text-slate-200 mb-1">
                              {ex.exerciseName}
                            </div>
                            <div className="flex flex-wrap gap-1.5 text-[11px]">
                              {ex.sets.map((s, sIdx) => (
                                <span
                                  key={sIdx}
                                  className={`px-2 py-0.5 rounded ${
                                    s.completed
                                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                      : 'bg-slate-800 text-slate-500'
                                  }`}
                                >
                                  Série {s.setNumber}:{' '}
                                  {s.completedReps
                                    ? `${s.completedReps} reps`
                                    : `${s.completedSeconds || 0}s`}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="p-10 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-100">
              Nenhum treino registrado ainda
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Inicie sua primeira rotina de calistenia para acompanhar seu tempo, séries e progresso automaticamente.
            </p>
            <button
              onClick={onNavigateToRoutines}
              className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-emerald-900/30 hover:brightness-110 active:scale-95 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Escolher uma Rotina
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
