import React, { useState } from 'react';
import type { WorkoutStats, WorkoutSession } from '../../types';
import { getUserJourneyProgress, saveUserJourneyProgress } from '../../utils/storage';
import { soundManager } from '../../utils/audio';
import {
  Sparkles,
  X,
  Zap,
  ArrowRight,
  Flame,
  Calendar,
} from 'lucide-react';

interface GuidedJourneyCardProps {
  stats: WorkoutStats;
  history: WorkoutSession[];
  onStartQuickWorkout: () => void;
  onNavigateToExercises: () => void;
}

export const GuidedJourneyCard: React.FC<GuidedJourneyCardProps> = ({
  stats,
  history,
  onStartQuickWorkout,
  onNavigateToExercises,
}) => {
  const [progress, setProgress] = useState(() => getUserJourneyProgress());
  const [isDismissed, setIsDismissed] = useState(false);

  // Check days since last workout for guilt-free comeback
  const daysSinceLastWorkout = (() => {
    if (!stats.lastWorkoutDate) return null;
    const lastDate = new Date(stats.lastWorkoutDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  })();

  const isComebackScenario = daysSinceLastWorkout !== null && daysSinceLastWorkout >= 4;

  // Determine current milestone
  const workoutsCount = history.length;
  let currentMilestone: {
    dayKey: 'day1' | 'day3' | 'day7';
    badge: string;
    title: string;
    text: string;
    actionLabel: string;
    isCompleted: boolean;
  } | null = null;

  if (workoutsCount === 0) {
    currentMilestone = {
      dayKey: 'day1',
      badge: 'Dia 1 • Iniciação',
      title: 'Dê o primeiro passo sem pressão',
      text: 'Sua única meta para hoje: faça 1 série de qualquer exercício para sentir a respiração e a postura.',
      actionLabel: 'Começar Treino Curto (10 min)',
      isCompleted: progress.day1Completed,
    };
  } else if (workoutsCount >= 1 && workoutsCount < 3) {
    currentMilestone = {
      dayKey: 'day3',
      badge: 'Dia 3 • Adaptação',
      title: 'O segredo é a cadência, não a exaustão',
      text: 'Descanse de 60 a 90 segundos entre séries. A calistenia evolui pela adaptação do sistema nervoso.',
      actionLabel: 'Treinar com Cronômetro',
      isCompleted: progress.day3Completed,
    };
  } else if (workoutsCount >= 3 && workoutsCount < 7) {
    currentMilestone = {
      dayKey: 'day7',
      badge: 'Dia 7 • Hábito Instalado',
      title: '1ª Semana de Memória Muscular!',
      text: 'Você ativou a memória neuromuscular. Explore novas progressões e confira o volume semanal no mapa muscular.',
      actionLabel: 'Ver Variações & Progressões',
      isCompleted: progress.day7Completed,
    };
  }

  const handleDismiss = () => {
    soundManager.triggerHaptic([20]);
    setIsDismissed(true);
    const updated = {
      ...progress,
      dismissedMessages: [...progress.dismissedMessages, currentMilestone?.dayKey || 'current'],
    };
    setProgress(updated);
    saveUserJourneyProgress(updated);
  };

  if (isDismissed) return null;

  // Guilt-free comeback card
  if (isComebackScenario) {
    return (
      <div className="w-full p-4 rounded-3xl glass-card border border-teal-500/30 bg-teal-500/5 shadow-xl relative overflow-hidden animate-in fade-in duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0 glow-cyan">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300 px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30">
                  Bem-vindo de volta!
                </span>
                <span className="text-[11px] text-slate-400">Sem culpa</span>
              </div>
              <h3 className="font-black text-sm text-slate-100">
                Faz {daysSinceLastWorkout} dias desde o último treino?
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                A vida acontece e pausas fazem parte. O mais importante é não recomeçar até a exaustão: que tal uma sessão rápida de 10 minutos hoje só para reativar o corpo?
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-full text-slate-400 hover:text-white"
            title="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3.5 flex items-center gap-2 pt-2 border-t border-white/5">
          <button
            onClick={() => {
              soundManager.triggerHaptic([30]);
              onStartQuickWorkout();
            }}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Fazer Treino de 10 min Agora</span>
          </button>
        </div>
      </div>
    );
  }

  // Regular Milestone Card (Days 1, 3, 7)
  if (!currentMilestone) return null;

  return (
    <div className="w-full p-4 rounded-3xl glass-card border border-emerald-500/25 bg-emerald-500/5 shadow-xl relative overflow-hidden animate-in fade-in duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 glow-emerald">
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                {currentMilestone.badge}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> {stats.currentStreakDays}d streak
              </span>
            </div>
            <h3 className="font-black text-sm text-slate-100">
              {currentMilestone.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {currentMilestone.text}
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-full text-slate-400 hover:text-white"
          title="Dispensar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-white/5">
        <button
          onClick={() => {
            soundManager.triggerHaptic([30]);
            if (currentMilestone?.dayKey === 'day7') {
              onNavigateToExercises();
            } else {
              onStartQuickWorkout();
            }
          }}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition glow-emerald"
        >
          <span>{currentMilestone.actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          {workoutsCount}/7 treinos
        </span>
      </div>
    </div>
  );
};
