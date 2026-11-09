import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { WorkoutSession, MuscleGroup } from '../../types';
import { MUSCLE_LABELS } from '../../data/exercisesData';
import { Trophy, Clock, CheckCircle2, Flame, ArrowRight, ShieldAlert } from 'lucide-react';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';

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
  const [jointDiscomfort, setJointDiscomfort] = useState<string[]>(
    (session.jointPainFeedback as string[]) || []
  );

  useBodyScrollLock(true);

  const toggleJoint = (joint: string) => {
    if (joint === 'nenhum') {
      setJointDiscomfort([]);
      return;
    }
    setJointDiscomfort(prev => {
      const exists = prev.includes(joint);
      const next = exists
        ? prev.filter(j => j !== joint)
        : [...prev.filter(j => j !== 'nenhum'), joint];
      return next;
    });
  };

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
      jointPainFeedback: jointDiscomfort.length > 0 ? (jointDiscomfort as any) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg glass-panel border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col space-y-5 max-h-[min(92dvh,calc(100dvh-2rem))] overflow-hidden">
        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-1">
          {/* Celebration Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500/25 to-teal-400/25 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl glow-emerald animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">Treino Concluído!</h2>
            <p className="text-xs text-slate-400 font-medium">
              Excelente trabalho! Você completou sua rotina com sucesso.
            </p>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 glow-emerald">
              {session.routineTitle}
            </div>
          </div>

          {/* D11: Cartão Comemorativo de Novos Recordes Pessoais (PRs) */}
          {session.newPRs && session.newPRs.length > 0 && (
            <div className="glass-card p-4 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 space-y-2.5 shadow-xl glow-amber animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                <span>Novos Recordes Pessoais (PRs) Batidos!</span>
              </div>
              <div className="space-y-1.5">
                {session.newPRs.map(pr => (
                  <div
                    key={pr.exerciseId}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-white/5 text-xs"
                  >
                    <span className="text-slate-200 font-bold">{pr.exerciseName}</span>
                    <span className="font-mono font-black text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                      {pr.type === 'isometric_seconds' ? `${pr.value}s` : `${pr.value} reps`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="glass-card p-3.5 rounded-2xl border border-white/5 text-center">
            <div className="flex items-center justify-center text-slate-400 mb-1">
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-base font-black font-mono text-slate-100">
              {formatTime(session.durationSeconds)}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Duração Total</div>
          </div>

          <div className="glass-card p-3.5 rounded-2xl border border-white/5 text-center">
            <div className="flex items-center justify-center text-slate-400 mb-1">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-base font-black font-mono text-slate-100">
              {session.totalSetsCompleted}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Séries Concluídas</div>
          </div>

          <div className="glass-card p-3.5 rounded-2xl border border-white/5 text-center col-span-2 sm:col-span-1">
            <div className="flex items-center justify-center text-slate-400 mb-1">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-base font-black font-mono text-slate-100">
              {session.totalRepsCompleted > 0
                ? `${session.totalRepsCompleted} reps`
                : `${session.totalIsometricSeconds}s`}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Volume Total</div>
          </div>
        </div>

        {/* Muscles Worked summary */}
        {session.musclesWorked && session.musclesWorked.length > 0 && (
          <div className="glass-card p-4 rounded-2xl border border-white/5">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Músculos Estimulados
            </div>
            <div className="flex flex-wrap gap-1.5">
              {session.musclesWorked.map((m: MuscleGroup) => (
                <span
                  key={m}
                  className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                >
                  {MUSCLE_LABELS[m] || m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Unlocked Progression Celebratory Card */}
        {session.userNotes && session.userNotes.includes('🏆') && (
          <div className="glass-card p-4 rounded-2xl border border-purple-500/30 bg-purple-500/10 space-y-1.5 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span>Conquista de Progressão Desbloqueada!</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {session.userNotes}
            </p>
          </div>
        )}

        {/* Perceived Effort Rating (RPE 1-10) */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
            <span>Percepção de Esforço (RPE):</span>
            <span className="text-emerald-400 font-black">{perceivedEffort} / 10</span>
          </label>
          <div className="flex items-center justify-between gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setPerceivedEffort(level)}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition ${
                  perceivedEffort === level
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/30 scale-105 glow-emerald'
                    : 'glass-card border border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
            <span>Leve / Fácil</span>
            <span>Moderado</span>
            <span>Exaustão Total</span>
          </div>
        </div>

        {/* D12: Feedback de Desconforto Articular */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300">
            Sentiu algum desconforto articular hoje?
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'nenhum', label: '✓ Nenhum (tudo bem)' },
              { id: 'punho', label: 'Punho' },
              { id: 'ombro', label: 'Ombro' },
              { id: 'cotovelo', label: 'Cotovelo' },
              { id: 'joelho', label: 'Joelho' },
              { id: 'lombar', label: 'Lombar' },
            ].map(item => {
              const isSelected = item.id === 'nenhum' ? jointDiscomfort.length === 0 : jointDiscomfort.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleJoint(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                    isSelected
                      ? item.id === 'nenhum'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-amber-500 text-slate-950 font-black glow-amber'
                      : 'glass-card border border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {jointDiscomfort.length > 0 && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-200/90 leading-relaxed font-medium">
                <strong>Orientações de Proteção:</strong> Pare se houver dor aguda. Para a sua próxima sessão, sugerimos regredir exercícios que sobrecarreguem {jointDiscomfort.join(', ')} e intensificar o aquecimento de mobilidade.
              </p>
            </div>
          )}
        </div>

        {/* Workout Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Anotações do Treino (opcional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Como foi a sensação? Algum recorde pessoal conquistado?"
            className="w-full px-3.5 py-2 rounded-2xl glass-card border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
        </div>

        {/* Save & Finish CTA com Safe Area */}
        <div className="pt-2 pb-[max(0.75rem,calc(env(safe-area-inset-bottom,0px)+0.5rem))] shrink-0">
          <button
            onClick={handleFinish}
            className="w-full min-h-[48px] py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 hover:brightness-110 active:scale-98 transition glow-emerald"
          >
            Salvar no Histórico & Continuar <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
