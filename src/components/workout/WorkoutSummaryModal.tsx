import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { WorkoutSession, MuscleGroup } from '../../types';
import { MUSCLE_LABELS } from '../../data/exercisesData';
import { Trophy, Clock, CheckCircle2, Flame, ArrowRight } from 'lucide-react';

interface WorkoutSummaryModalProps {
  session: WorkoutSession;
  onSaveAndClose: (updatedSession: WorkoutSession) => void;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  session,
  onSaveAndClose,
}) => {
  const [perceivedEffort, setPerceivedEffort] = useState<number>(session.perceivedEffort || 7);
  const [notes, setNotes] = useState<string>(session.userNotes || '');

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6'],
      });
      const timeout = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10b981', '#38bdf8'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f59e0b', '#10b981'],
        });
      }, 400);
      return () => clearTimeout(timeout);
    } catch {
      // Confetti fallback
    }
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const handleFinish = () => {
    onSaveAndClose({
      ...session,
      perceivedEffort,
      userNotes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">Treino Finalizado!</h2>
          <p className="text-xs text-slate-400 font-medium">
            Excelente trabalho! Você completou a rotina com sucesso.
          </p>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {session.routineTitle}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
            <div className="flex items-center justify-center text-slate-400 mb-1">
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-base font-bold text-slate-100">
              {formatTime(session.durationSeconds)}
            </div>
            <div className="text-[11px] text-slate-400">Duração Total</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
            <div className="flex items-center justify-center text-slate-400 mb-1">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-base font-bold text-slate-100">
              {session.totalSetsCompleted}
            </div>
            <div className="text-[11px] text-slate-400">Séries Concluídas</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center col-span-2 sm:col-span-1">
            <div className="flex items-center justify-center text-slate-400 mb-1">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-base font-bold text-slate-100">
              {session.totalRepsCompleted > 0
                ? `${session.totalRepsCompleted} reps`
                : `${session.totalIsometricSeconds}s`}
            </div>
            <div className="text-[11px] text-slate-400">Volume Total</div>
          </div>
        </div>

        {/* Muscles Worked summary */}
        {session.musclesWorked && session.musclesWorked.length > 0 && (
          <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Músculos Estimulados
            </div>
            <div className="flex flex-wrap gap-1.5">
              {session.musclesWorked.map((m: MuscleGroup) => (
                <span
                  key={m}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                >
                  {MUSCLE_LABELS[m] || m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Perceived Effort Rating (RPE 1-10) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>Percepção de Esforço (RPE):</span>
            <span className="text-emerald-400 font-bold">{perceivedEffort} / 10</span>
          </label>
          <div className="flex items-center justify-between gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setPerceivedEffort(level)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  perceivedEffort === level
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-105'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Leve / Fácil</span>
            <span>Moderado</span>
            <span>Exaustão Total</span>
          </div>
        </div>

        {/* Workout Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Anotações do Treino (opcional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Como foi a sensação? Algum recorde de reps ou variação desafiadora?"
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Save & Finish CTA */}
        <button
          onClick={handleFinish}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 hover:brightness-110 active:scale-98 transition"
        >
          Salvar no Histórico & Continuar <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
