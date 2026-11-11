import React from 'react';
import type { SkillNode, UserSkillProgress, SkillMasteryStatus } from '../../types/gamification';
import { getExerciseById, EXERCISES_DATABASE } from '../../data/exercisesData';
import { ExerciseMedia } from '../visuals/figure/ExerciseMedia';
import { soundManager } from '../../utils/audio';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import {
  X,
  CheckCircle2,
  Clock,
  Lock,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  Flame,
  Check,
} from 'lucide-react';

interface SkillDetailModalProps {
  skill: SkillNode;
  userProgress?: UserSkillProgress;
  allSkillsProgress: Record<string, UserSkillProgress>;
  onClose: () => void;
  onUpdateStatus: (skillId: string, status: SkillMasteryStatus, stepIndex?: number) => void;
  onOpenExercise?: (exerciseId: string) => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  userProgress,
  allSkillsProgress,
  onClose,
  onUpdateStatus,
  onOpenExercise,
}) => {
  useBodyScrollLock(true, onClose);

  const status = userProgress?.status || 'locked';
  const exerciseData = getExerciseById(skill.exerciseId) || EXERCISES_DATABASE.find(e => e.id === skill.exerciseId);

  const handleSetStatus = (newStatus: SkillMasteryStatus) => {
    soundManager.triggerHaptic([30]);
    onUpdateStatus(skill.id, newStatus, userProgress?.currentStepIndex || 0);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl glass-panel border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[min(94dvh,calc(100dvh-2rem))] overflow-hidden bg-slate-950/95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/40 flex items-center justify-center text-2xl shrink-0 shadow-md">
              {skill.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  Tier {skill.tier} • {skill.difficulty}
                </span>
              </div>
              <h2 id="skill-detail-title" className="text-base sm:text-lg font-black text-slate-100 mt-0.5">
                {skill.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar detalhes da habilidade"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Visual Animation Preview & Demonstration */}
          {exerciseData && (
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-900/60 shadow-inner">
              <div className="relative aspect-video max-h-56 sm:max-h-64 w-full flex items-center justify-center bg-black/40">
                <ExerciseMedia exercise={exerciseData} className="w-full h-full object-contain" />
              </div>
              <div className="p-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Demonstração anatômica do movimento</span>
                {onOpenExercise && (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.triggerHaptic([20]);
                      onOpenExercise(skill.exerciseId);
                    }}
                    className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 active:scale-95 transition cursor-pointer"
                  >
                    Ver na biblioteca <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
              Sobre a Habilidade
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {skill.description}
            </p>
          </div>

          {/* Evolution Criteria (Regra de Ouro da Maestria) */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Critério de Domínio (Maestria)
            </div>
            <p className="text-xs text-emerald-200/90 leading-relaxed font-semibold">
              {skill.evolutionCriteria}
            </p>
          </div>

          {/* Prerequisites Checklist */}
          {skill.prerequisites.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> Pré-Requisitos Recomendados
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {skill.prerequisites.map((req, idx) => {
                  const prereqMastered = req.skillId ? allSkillsProgress[req.skillId]?.status === 'mastered' : false;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100">{req.name}</span>
                          {req.skillId && (
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                prereqMastered
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {prereqMastered ? 'Dominado' : 'Pendente'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{req.benchmarkText}</p>
                      </div>
                      {prereqMastered && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Progressive Steps Ladder */}
          {skill.progressionSteps.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Escada de Progressões Passo a Passo
              </h3>
              <div className="space-y-2">
                {skill.progressionSteps.map(step => (
                  <div
                    key={step.id}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 hover:border-white/10 transition"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono font-black text-xs">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100">{step.title}</h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        Alvo: {step.targetMetric}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 pl-8">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auxiliary Exercises */}
          {skill.auxiliaryExercises.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Exercícios Auxiliares & Fortalecimento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {skill.auxiliaryExercises.map((aux, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-xs font-bold text-slate-200 block">{aux.title}</span>
                    <span className="text-[11px] text-slate-400 block">{aux.purpose}</span>
                    <span className="text-[10px] text-teal-400 font-mono block pt-0.5">
                      {aux.recommendedVolume}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes & Biomechanics */}
          {skill.commonMistakes.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Erros Comuns & Correções Biomecânicas
              </h3>
              <div className="space-y-2">
                {skill.commonMistakes.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1">
                    <div className="text-xs font-bold text-rose-300 flex items-start gap-1.5">
                      <span className="shrink-0 text-rose-400">⚠️</span>
                      <span>{m.mistake}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 pl-5 leading-relaxed">
                      <strong className="text-emerald-400">Correção:</strong> {m.correction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Notice */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              <strong>Aviso de Segurança:</strong> Movimentos estáticos e alavancas submetem tendões e ligamentos a alto torque. Respeite as pausas entre treinos e nunca force através de dor articular aguda.
            </p>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <div className="text-xs font-bold text-slate-300">
            Status Atual:{' '}
            <span
              className={`font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-[10px] ml-1.5 ${
                status === 'mastered'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : status === 'in_progress'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-white/10 text-slate-400'
              }`}
            >
              {status === 'mastered' ? 'Dominado' : status === 'in_progress' ? 'Em Treino' : 'Bloqueado'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {status !== 'in_progress' && status !== 'mastered' && (
              <button
                type="button"
                onClick={() => handleSetStatus('in_progress')}
                className="py-2.5 px-4 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Marcar Em Treino</span>
              </button>
            )}

            {status !== 'mastered' ? (
              <button
                type="button"
                onClick={() => handleSetStatus('mastered')}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition glow-emerald cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Marcar como Dominado</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSetStatus('in_progress')}
                className="py-2.5 px-3 rounded-xl bg-white/10 text-slate-300 font-bold text-xs hover:bg-white/20 active:scale-95 transition cursor-pointer"
              >
                Reabrir Treino
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
