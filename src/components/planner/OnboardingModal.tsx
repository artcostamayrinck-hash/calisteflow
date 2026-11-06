import { useState } from 'react';
import type { ExerciseDifficulty, EquipmentType, WeeklyPlan } from '../../types';
import { createPresetWeeklyPlan } from '../../utils/workoutGenerator';
import { soundManager } from '../../utils/audio';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  Shield,
} from 'lucide-react';

interface OnboardingModalProps {
  onComplete: (generatedPlan: WeeklyPlan) => void;
  onSkip?: () => void;
}

export const OnboardingModal = ({ onComplete, onSkip }: OnboardingModalProps) => {
  const [step, setStep] = useState<number>(1);
  const [userLevel, setUserLevel] = useState<ExerciseDifficulty>('Intermediário');
  const [equipments, setEquipments] = useState<EquipmentType[]>([
    'nenhum',
    'barra',
    'paralelas',
  ]);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(4);
  const [selectedTemplate, setSelectedTemplate] = useState<
    'ppl' | 'upper_lower' | 'fullbody' | 'abc'
  >('ppl');

  const toggleEquipment = (eq: EquipmentType) => {
    soundManager.triggerHaptic([20]);
    if (eq === 'nenhum') return; // Cannot uncheck floor
    setEquipments(prev =>
      prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq]
    );
  };

  const handleNextStep = () => {
    soundManager.triggerHaptic([30]);
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Finalize and generate
      const generated = createPresetWeeklyPlan(selectedTemplate, userLevel, equipments);
      onComplete(generated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-lg glass-panel border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 glow-emerald">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Passo {step} de 4
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-6 bg-gradient-to-r from-emerald-400 to-teal-300'
                    : s < step
                    ? 'w-2.5 bg-emerald-500/40'
                    : 'w-2 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: NÍVEL */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <h2 className="text-xl font-black text-slate-100 tracking-tight">
                Qual é o seu nível na Calistenia?
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Isso define as progressões e o volume inicial das suas rotinas.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'Iniciante' as ExerciseDifficulty,
                  title: 'Iniciante',
                  desc: 'Até 5 flexões completas, aprendendo a sustentação e barra fixa.',
                  icon: Shield,
                },
                {
                  id: 'Intermediário' as ExerciseDifficulty,
                  title: 'Intermediário',
                  desc: 'Faz de 8 a 15 flexões e de 5 a 10 barras fixas completas.',
                  icon: Flame,
                },
                {
                  id: 'Avançado' as ExerciseDifficulty,
                  title: 'Avançado / Elite',
                  desc: 'Domina dips com peso, muscle-ups e sustentação de estáticos.',
                  icon: Sparkles,
                },
              ].map(lvl => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    soundManager.triggerHaptic([20]);
                    setUserLevel(lvl.id);
                  }}
                  className={`w-full p-4 rounded-2xl glass-card text-left transition active:scale-98 border flex items-center justify-between gap-3 ${
                    userLevel === lvl.id
                      ? 'border-emerald-500 bg-emerald-500/15 glow-emerald shadow-lg'
                      : 'border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <lvl.icon
                      className={`w-5 h-5 ${
                        userLevel === lvl.id ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    />
                    <div>
                      <span className="font-black text-sm text-slate-100 block">
                        {lvl.title}
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5 block leading-relaxed">
                        {lvl.desc}
                      </span>
                    </div>
                  </div>
                  {userLevel === lvl.id && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: EQUIPAMENTOS */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <h2 className="text-xl font-black text-slate-100 tracking-tight">
                Quais equipamentos você possui?
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Filtraremos os exercícios para o que você realmente pode fazer.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'nenhum' as EquipmentType, label: 'Solo / Chão', emoji: '🧘' },
                { id: 'barra' as EquipmentType, label: 'Barra Fixa', emoji: '🏗️' },
                { id: 'paralelas' as EquipmentType, label: 'Paralelas / Dips', emoji: '⚡' },
                { id: 'argolas' as EquipmentType, label: 'Argolas Olímpicas', emoji: '⭕' },
                { id: 'elastico' as EquipmentType, label: 'Elásticos / Band', emoji: '🎯' },
              ].map(eq => {
                const isSelected = equipments.includes(eq.id);
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => toggleEquipment(eq.id)}
                    className={`p-3.5 rounded-2xl glass-card text-left transition active:scale-95 border flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-emerald-500/60 bg-emerald-500/15 glow-emerald'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{eq.emoji}</span>
                      <span className="font-bold text-xs text-slate-200">{eq.label}</span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: DIAS DISPONÍVEIS */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <h2 className="text-xl font-black text-slate-100 tracking-tight">
                Quantos dias por semana quer treinar?
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Distribuiremos os descansos de forma fisiologicamente equilibrada.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6].map(days => (
                <button
                  key={days}
                  type="button"
                  onClick={() => {
                    soundManager.triggerHaptic([20]);
                    setDaysPerWeek(days);
                    if (days === 3) setSelectedTemplate('fullbody');
                    else if (days === 4) setSelectedTemplate('ppl');
                    else if (days === 5) setSelectedTemplate('ppl');
                    else setSelectedTemplate('ppl');
                  }}
                  className={`py-4 rounded-2xl glass-card border transition flex flex-col items-center justify-center gap-1 active:scale-95 ${
                    daysPerWeek === days
                      ? 'border-emerald-500 bg-emerald-500/15 glow-emerald shadow-lg'
                      : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <span className="text-2xl font-black font-mono text-slate-100">{days}</span>
                  <span className="text-[11px] font-bold text-slate-400">dias/sem</span>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl glass-card border border-white/5 text-xs text-slate-300 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Recomendação: {daysPerWeek} dias semanais permitem descanso ideal de 48h entre
                grupos musculares repetidos.
              </span>
            </div>
          </div>
        )}

        {/* STEP 4: DIVISÃO SUGERIDA */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <h2 className="text-xl font-black text-slate-100 tracking-tight">
                Escolha a sua Divisão Sugerida:
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Você poderá editar qualquer dia ou exercício depois.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'ppl' as const,
                  title: 'Push / Pull / Legs (PPL)',
                  desc: 'Divisão mais popular e eficiente para força e hipertrofia equilibrada.',
                },
                {
                  id: 'upper_lower' as const,
                  title: 'Upper / Lower (Superior e Inferior)',
                  desc: 'Excelente para quem quer intercalar membros superiores com pernas.',
                },
                {
                  id: 'fullbody' as const,
                  title: 'Full Body 3x (Corpo Inteiro)',
                  desc: 'Estímulo completo de alta frequência, perfeito para 3 dias na semana.',
                },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    soundManager.triggerHaptic([20]);
                    setSelectedTemplate(t.id);
                  }}
                  className={`w-full p-4 rounded-2xl glass-card text-left transition active:scale-98 border flex items-center justify-between gap-3 ${
                    selectedTemplate === t.id
                      ? 'border-emerald-500 bg-emerald-500/15 glow-emerald shadow-lg'
                      : 'border-white/5 hover:border-white/15'
                  }`}
                >
                  <div>
                    <span className="font-black text-sm text-slate-100 block">
                      {t.title}
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5 block leading-relaxed">
                      {t.desc}
                    </span>
                  </div>
                  {selectedTemplate === t.id && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          {onSkip && step === 1 ? (
            <button
              type="button"
              onClick={onSkip}
              className="text-xs text-slate-400 hover:text-white font-medium"
            >
              Pular Onboarding
            </button>
          ) : (
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              className="text-xs text-slate-400 hover:text-white font-medium disabled:opacity-0"
            >
              Voltar
            </button>
          )}

          <button
            type="button"
            onClick={handleNextStep}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition flex items-center gap-1.5 shadow-xl shadow-emerald-500/25 glow-emerald"
          >
            <span>{step === 4 ? 'Gerar Minha Semana' : 'Próximo'}</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
