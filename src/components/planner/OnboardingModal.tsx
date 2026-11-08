import React, { useState, useEffect } from 'react';
import type {
  ExerciseDifficulty,
  EquipmentType,
  FitnessGoal,
  BodyFocus,
  JointLimitation,
  UserOnboardingProfile,
  WeeklyPlan,
} from '../../types';
import {
  createCustomWeeklyPlanFromProfile,
  createPresetWeeklyPlan,
  WEEK_DAYS_NAMES,
  FOCUS_LABELS,
} from '../../utils/workoutGenerator';
import {
  saveUserProfile,
  saveOnboardingDraft,
  getStoredOnboardingDraft,
  clearOnboardingDraft,
} from '../../utils/storage';
import { soundManager } from '../../utils/audio';
import { isIOS, isStandalone } from '../../utils/platform';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Shield,
  Zap,
  Target,
  Clock,
  Bell,
  AlertTriangle,
  RotateCcw,
  Award,
  Info,
} from 'lucide-react';

interface OnboardingModalProps {
  onComplete: (generatedPlan: WeeklyPlan) => void;
  onSkip?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onSkip }) => {
  // Try loading draft
  const draft = getStoredOnboardingDraft();

  const [step, setStep] = useState<number>(draft?.step || 1);

  // Form State
  const [goal, setGoal] = useState<FitnessGoal>(draft?.profile?.goal || 'forca');
  const [level, setLevel] = useState<ExerciseDifficulty | 'Nunca treinei'>(
    draft?.profile?.level || 'Iniciante'
  );
  const [pushupsCount, setPushupsCount] = useState<number | undefined>(
    draft?.profile?.pushupsCount
  );
  const [pullupsCount, setPullupsCount] = useState<number | undefined>(
    draft?.profile?.pullupsCount
  );
  const [equipments, setEquipments] = useState<EquipmentType[]>(
    draft?.profile?.equipments || ['nenhum', 'barra', 'paralelas']
  );
  const [daysSelected, setDaysSelected] = useState<number[]>(
    draft?.profile?.daysSelected || [1, 3, 5]
  );
  const [durationMinutes, setDurationMinutes] = useState<20 | 30 | 45 | 60>(
    draft?.profile?.durationMinutes || 45
  );
  const [focusMode, setFocusMode] = useState<'auto' | 'custom'>(
    draft?.profile?.focusMode || 'auto'
  );
  const [dayFocusMap, setDayFocusMap] = useState<Record<number, BodyFocus[]>>(
    draft?.profile?.dayFocusMap || {}
  );
  const [limitations, setLimitations] = useState<JointLimitation[]>(
    draft?.profile?.limitations || []
  );
  const [preferredTime, setPreferredTime] = useState<string>(
    draft?.profile?.preferredTime || '07:30'
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    draft?.profile?.notificationsEnabled || false
  );
  const [notifRequested, setNotifRequested] = useState<boolean>(false);

  // Auto-save draft on any change
  useEffect(() => {
    const currentProfile: Partial<UserOnboardingProfile> = {
      goal,
      level,
      pushupsCount,
      pullupsCount,
      equipments,
      daysSelected,
      durationMinutes,
      focusMode,
      dayFocusMap,
      limitations,
      preferredTime,
      notificationsEnabled,
    };
    saveOnboardingDraft({ step, profile: currentProfile });
  }, [
    step,
    goal,
    level,
    pushupsCount,
    pullupsCount,
    equipments,
    daysSelected,
    durationMinutes,
    focusMode,
    dayFocusMap,
    limitations,
    preferredTime,
    notificationsEnabled,
  ]);

  const toggleEquipment = (eq: EquipmentType) => {
    soundManager.triggerHaptic([20]);
    if (eq === 'nenhum') return; // Cannot uncheck floor
    setEquipments(prev =>
      prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq]
    );
  };

  const toggleDay = (dayNum: number) => {
    soundManager.triggerHaptic([20]);
    setDaysSelected(prev => {
      if (prev.includes(dayNum)) {
        if (prev.length <= 1) return prev; // At least 1 day required
        return prev.filter(d => d !== dayNum);
      } else {
        return [...prev, dayNum].sort();
      }
    });
  };

  const toggleLimitation = (lim: JointLimitation) => {
    soundManager.triggerHaptic([20]);
    setLimitations(prev =>
      prev.includes(lim) ? prev.filter(l => l !== lim) : [...prev, lim]
    );
  };

  const toggleDayFocus = (dayNum: number, focus: BodyFocus) => {
    soundManager.triggerHaptic([20]);
    setDayFocusMap(prev => {
      const currentList = prev[dayNum] || [];
      const updated = currentList.includes(focus)
        ? currentList.filter(f => f !== focus)
        : [...currentList, focus];
      return { ...prev, [dayNum]: updated };
    });
  };

  const handleRequestNotification = async () => {
    soundManager.triggerHaptic([30]);
    setNotifRequested(true);
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationsEnabled(true);
        } else {
          setNotificationsEnabled(false);
        }
      } catch (e) {
        console.warn('Notification permission error:', e);
      }
    }
  };

  const handleNextStep = () => {
    soundManager.triggerHaptic([30]);
    if (step < 9) {
      setStep(prev => prev + 1);
    } else {
      finalizeOnboarding();
    }
  };

  const handlePrevStep = () => {
    soundManager.triggerHaptic([20]);
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSkip = () => {
    soundManager.triggerHaptic([20]);
    clearOnboardingDraft();
    if (onSkip) {
      onSkip();
    } else {
      const defaultPlan = createPresetWeeklyPlan('ppl', 'Intermediário', ['nenhum', 'barra', 'paralelas']);
      onComplete(defaultPlan);
    }
  };

  const finalizeOnboarding = () => {
    soundManager.triggerHaptic([40, 60, 40]);
    const finalProfile: UserOnboardingProfile = {
      goal,
      level,
      pushupsCount,
      pullupsCount,
      equipments,
      daysSelected: daysSelected.length > 0 ? daysSelected : [1, 3, 5],
      durationMinutes,
      focusMode,
      dayFocusMap,
      limitations,
      preferredTime,
      notificationsEnabled,
      completedAt: new Date().toISOString(),
    };

    saveUserProfile(finalProfile);
    clearOnboardingDraft();

    const generatedPlan = createCustomWeeklyPlanFromProfile(finalProfile);
    onComplete(generatedPlan);
  };

  const goalDescriptions: Record<FitnessGoal, { label: string; desc: string; icon: React.ElementType; color: string }> = {
    forca: {
      label: 'Ganho de Força',
      desc: 'Progressões de alta intensidade, baixas repetições e controle neural.',
      icon: Shield,
      color: 'from-amber-500 to-orange-600',
    },
    hipertrofia: {
      label: 'Ganho de Massa Muscular',
      desc: 'Sobrecarga metabólica, 8 a 12 repetições e volume semanal balanceado.',
      icon: Flame,
      color: 'from-rose-500 to-red-600',
    },
    resistencia: {
      label: 'Resistência Muscular',
      desc: 'Maior capacidade de trabalho, circuitos e alta densidade de séries.',
      icon: Zap,
      color: 'from-blue-500 to-cyan-600',
    },
    skills: {
      label: 'Aprender Skills',
      desc: 'Handstand, Muscle-Up, Front Lever, Planche e alavancas isométricas.',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-600',
    },
    perda_gordura: {
      label: 'Perder Gordura / Definição',
      desc: 'Treinos dinâmicos com pausas menores e sustentação de alta frequência.',
      icon: Target,
      color: 'from-emerald-500 to-teal-600',
    },
    mobilidade: {
      label: 'Mobilidade & Postura',
      desc: 'Descompressão articular, flexibilidade ativa e saúde postural.',
      icon: Award,
      color: 'from-teal-500 to-emerald-600',
    },
  };

  const availableFocusList: BodyFocus[] = [
    'peito',
    'costas',
    'ombros',
    'biceps',
    'triceps',
    'core',
    'quadriceps',
    'gluteos',
    'skills',
    'mobilidade',
  ];

  useBodyScrollLock(true, handleSkip);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-xl glass-panel border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col space-y-5 max-h-[min(95dvh,calc(100dvh-1.5rem))] overflow-hidden">
        {/* Step Indicator & Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 glow-emerald">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block">
                {step === 9 ? 'Revisão Final' : `Passo ${step} de 8`}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {step === 9 ? 'Tudo pronto para começar' : 'Configuração do seu perfil'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-5 bg-gradient-to-r from-emerald-400 to-teal-300'
                    : s < step
                    ? 'w-2 bg-emerald-500/50'
                    : 'w-1.5 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scrollable Step Body */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-1">

        {/* STEP 1: OBJETIVO PRINCIPAL */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                Qual é o seu objetivo principal?
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Personalizaremos o volume, tempo de descanso e seleção de exercícios.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(goalDescriptions) as FitnessGoal[]).map(key => {
                const item = goalDescriptions[key];
                const isSelected = goal === key;
                const IconComponent = item.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      soundManager.triggerHaptic([20]);
                      setGoal(key);
                    }}
                    className={`min-h-[56px] p-3.5 rounded-2xl glass-card text-left transition active:scale-98 border flex items-start justify-between gap-2.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/15 glow-emerald shadow-lg'
                        : 'border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0 shadow-md`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-slate-100 block">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block leading-tight line-clamp-2">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: NÍVEL + MINI-TESTE OPCIONAL */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                Qual o seu nível de experiência?
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Usado para calibrar a dificuldade dos exercícios e progressões.
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'Nunca treinei' as const,
                  title: 'Nunca treinei calistenia',
                  desc: 'Início absoluto. Foco em base segura e postura.',
                },
                {
                  id: 'Iniciante' as const,
                  title: 'Iniciante',
                  desc: 'Faz até 5 flexões completas, aprendendo a sustentação na barra.',
                },
                {
                  id: 'Intermediário' as const,
                  title: 'Intermediário',
                  desc: 'Faz de 8 a 15 flexões e de 5 a 10 barras fixas completas.',
                },
                {
                  id: 'Avançado' as const,
                  title: 'Avançado / Pro',
                  desc: 'Domina dips, muscle-ups e sustentação de estáticos (L-sit, etc.).',
                },
              ].map(lvl => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    soundManager.triggerHaptic([20]);
                    setLevel(lvl.id);
                  }}
                  className={`min-h-[52px] w-full p-3.5 rounded-2xl glass-card text-left transition active:scale-98 border flex items-center justify-between gap-3 ${
                    level === lvl.id
                      ? 'border-emerald-500 bg-emerald-500/15 glow-emerald shadow-lg'
                      : 'border-white/5 hover:border-white/15'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-100 block">
                      {lvl.title}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      {lvl.desc}
                    </span>
                  </div>
                  {level === lvl.id && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Mini-teste opcional */}
            <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-3 bg-white/[0.02]">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Mini-teste de calibração rápida (opcional):</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">
                    Quantas flexões faz seguidas?
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Ex: 10"
                    value={pushupsCount ?? ''}
                    onChange={e => {
                      const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                      setPushupsCount(isNaN(val as number) ? undefined : val);
                    }}
                    className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-white/10 text-slate-100 text-sm font-mono focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">
                    Quantas barras fixas faz?
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    placeholder="Ex: 5"
                    value={pullupsCount ?? ''}
                    onChange={e => {
                      const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                      setPullupsCount(isNaN(val as number) ? undefined : val);
                    }}
                    className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-white/10 text-slate-100 text-sm font-mono focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: EQUIPAMENTOS */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                Quais equipamentos você tem acesso?
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Múltipla escolha. Se não tiver nada, adaptamos 100% para o chão.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'nenhum' as EquipmentType, label: 'Solo / Chão', emoji: '🧘', desc: 'Sempre disponível' },
                { id: 'barra' as EquipmentType, label: 'Barra Fixa', emoji: '🏗️', desc: 'Pull-ups e costas' },
                { id: 'paralelas' as EquipmentType, label: 'Barras Paralelas', emoji: '⚡', desc: 'Dips e L-sit' },
                { id: 'argolas' as EquipmentType, label: 'Argolas Olímpicas', emoji: '⭕', desc: 'Instabilidade' },
                { id: 'elastico' as EquipmentType, label: 'Elásticos / Band', emoji: '🎯', desc: 'Aquecimento e ajuda' },
                { id: 'banco' as EquipmentType, label: 'Banco / Cadeira', emoji: '🪑', desc: 'Apoio e elevação' },
              ].map(eq => {
                const isSelected = equipments.includes(eq.id);
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => toggleEquipment(eq.id)}
                    className={`min-h-[56px] p-3 rounded-2xl glass-card text-left transition active:scale-95 border flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-emerald-500/60 bg-emerald-500/15 glow-emerald'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl shrink-0">{eq.emoji}</span>
                      <div>
                        <span className="font-bold text-xs text-slate-200 block">{eq.label}</span>
                        <span className="text-[10px] text-slate-400 block">{eq.desc}</span>
                      </div>
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

        {/* STEP 4: DIAS DA SEMANA */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                Em quais dias da semana você pode treinar?
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Toque nos dias para ativar ou desativar. Os demais viram descanso ativo.
              </p>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {WEEK_DAYS_NAMES.map(d => {
                const isSelected = daysSelected.includes(d.dayOfWeek);
                return (
                  <button
                    key={d.dayOfWeek}
                    type="button"
                    onClick={() => toggleDay(d.dayOfWeek)}
                    className={`min-h-[58px] py-3 rounded-2xl glass-card border transition flex flex-col items-center justify-center gap-1 active:scale-95 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 glow-emerald font-black shadow-lg'
                        : 'border-white/5 text-slate-400 hover:border-white/15'
                    }`}
                  >
                    <span className="text-[11px] font-mono font-bold tracking-wider">{d.shortName}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-emerald-400 glow-emerald' : 'bg-white/10'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl glass-card border border-white/5 text-xs text-slate-300 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>{daysSelected.length} dias por semana</strong> selecionados. Distribuição
                com intervalos de recuperação fisiológica de 48h.
              </span>
            </div>
          </div>
        )}

        {/* STEP 5: DURAÇÃO POR TREINO */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                Quanto tempo você tem disponível por sessão?
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Ajustamos o número de séries e descansos para caber no seu tempo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { time: 20 as const, label: '20 minutos', desc: 'Treino expresso de alta densidade', tag: 'Rápido' },
                { time: 30 as const, label: '30 minutos', desc: 'Foco nos exercícios compostos essenciais', tag: 'Objetivo' },
                { time: 45 as const, label: '45 minutos', desc: 'Equilíbrio ideal de volume e descanso', tag: 'Recomendado' },
                { time: 60 as const, label: '60 minutos', desc: 'Sessão completa com mobilidade e core', tag: 'Completo' },
              ].map(item => {
                const isSelected = durationMinutes === item.time;
                return (
                  <button
                    key={item.time}
                    type="button"
                    onClick={() => {
                      soundManager.triggerHaptic([20]);
                      setDurationMinutes(item.time);
                    }}
                    className={`min-h-[56px] p-4 rounded-2xl glass-card text-left transition active:scale-95 border flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/15 glow-emerald shadow-lg'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-2xl font-black font-mono text-slate-100">
                        {item.time}<span className="text-xs text-slate-400 font-sans font-normal ml-0.5">min</span>
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 leading-tight">
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: FOCO MUSCULAR DOS DIAS */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                Como prefere organizar o foco dos treinos?
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Deixe o app sugerir a melhor divisão ou escolha dia a dia.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  soundManager.triggerHaptic([20]);
                  setFocusMode('auto');
                }}
                className={`min-h-[52px] p-3.5 rounded-2xl glass-card text-left transition active:scale-95 border flex items-center justify-between ${
                  focusMode === 'auto'
                    ? 'border-emerald-500 bg-emerald-500/15 glow-emerald'
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                <div>
                  <span className="font-bold text-xs text-slate-100 block">Sugerir para mim</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Recomendado</span>
                </div>
                {focusMode === 'auto' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.triggerHaptic([20]);
                  setFocusMode('custom');
                }}
                className={`min-h-[52px] p-3.5 rounded-2xl glass-card text-left transition active:scale-95 border flex items-center justify-between ${
                  focusMode === 'custom'
                    ? 'border-emerald-500 bg-emerald-500/15 glow-emerald'
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                <div>
                  <span className="font-bold text-xs text-slate-100 block">Personalizar Focos</span>
                  <span className="text-[10px] text-slate-400">Escolha por dia</span>
                </div>
                {focusMode === 'custom' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>

            {focusMode === 'custom' && (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {daysSelected.map(dayNum => {
                  const dayObj = WEEK_DAYS_NAMES.find(d => d.dayOfWeek === dayNum);
                  const selectedFocuses = dayFocusMap[dayNum] || [];
                  return (
                    <div key={dayNum} className="p-3 rounded-2xl glass-card border border-white/5 space-y-2">
                      <span className="text-xs font-bold text-emerald-400 block">
                        {dayObj?.dayName}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {availableFocusList.map(f => {
                          const active = selectedFocuses.includes(f);
                          const meta = FOCUS_LABELS[f];
                          return (
                            <button
                              key={f}
                              type="button"
                              onClick={() => toggleDayFocus(dayNum, f)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 border active:scale-95 ${
                                active
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                  : 'bg-white/5 text-slate-300 border-white/5 hover:border-white/15'
                              }`}
                            >
                              <span>{meta?.emoji}</span>
                              <span>{meta?.label || f}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 7: LIMITAÇÕES OU DORES ARTICULARES */}
        {step === 7 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                Você tem alguma dor ou limitação articular?
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Exercícios com sobrecarga nas regiões marcadas serão substituídos por variações seguras.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'punho' as JointLimitation, label: 'Punho', desc: 'Evita paradas de mão e apoios rígidos', emoji: '✋' },
                { id: 'ombro' as JointLimitation, label: 'Ombro', desc: 'Evita mergulhos profundos e impacto', emoji: '💪' },
                { id: 'joelho' as JointLimitation, label: 'Joelho', desc: 'Evita pistol squats e saltos profundos', emoji: '🦵' },
                { id: 'lombar' as JointLimitation, label: 'Lombar', desc: 'Evita alavancas de alta compressão', emoji: '⚡' },
              ].map(lim => {
                const isSelected = limitations.includes(lim.id);
                return (
                  <button
                    key={lim.id}
                    type="button"
                    onClick={() => toggleLimitation(lim.id)}
                    className={`min-h-[56px] p-3.5 rounded-2xl glass-card text-left transition active:scale-95 border flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'border-rose-500/70 bg-rose-500/15 glow-amber'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{lim.emoji}</span>
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-slate-200 block">
                          {lim.label}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block leading-tight">
                          {lim.desc}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                soundManager.triggerHaptic([20]);
                setLimitations([]);
              }}
              className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                limitations.length === 0
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Nenhuma dor articular / 100% apto</span>
            </button>
          </div>
        )}

        {/* STEP 8: LEMBRETE E NOTIFICAÇÃO */}
        {step === 8 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                Qual seu horário preferido de treino?
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Um lembrete diário pontual ajuda a manter sua sequência de treinos (streaks).
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Horário do Lembrete:
                </span>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  className="bg-slate-900 border border-white/20 text-emerald-400 font-mono font-bold px-3 py-1.5 rounded-xl text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Nós apenas enviamos um aviso no seu horário agendado nos dias em que há treino planejado.
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">Lembrete no Celular / PWA</span>
                </div>
                {notificationsEnabled ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Ativado
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-400">
                    Opcional
                  </span>
                )}
              </div>

              {/* iOS Safari requirement notice */}
              {isIOS() && !isStandalone() ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>Disponível no iPhone via Tela de Início</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    No iOS, a Apple exige que o aplicativo seja adicionado à <strong>Tela de Início</strong> para habilitar notificações sonoras e push:
                  </p>
                  <ol className="text-[11px] text-slate-400 list-decimal list-inside space-y-1 pl-1">
                    <li>Toque no ícone <strong className="text-slate-200">Compartilhar</strong> (abaixo no Safari)</li>
                    <li>Role e selecione <strong className="text-slate-200">Adicionar à Tela de Início</strong></li>
                    <li>Abra o CalisteFlow por lá para ativar os lembretes diários</li>
                  </ol>
                </div>
              ) : (
                <>
                  {!notificationsEnabled ? (
                    <button
                      type="button"
                      onClick={handleRequestNotification}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
                    >
                      <Bell className="w-4 h-4 text-emerald-400" />
                      <span>{notifRequested ? 'Permissão Solicitada' : 'Permitir Notificações de Treino'}</span>
                    </button>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-400 text-xs">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Notificações ativadas! Você receberá o alerta diário.</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* STEP 9: RESUMO EDITÁVEL ANTES DE CONFIRMAR */}
        {step === 9 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight flex items-center gap-2">
                <span>Seu Plano Personalizado</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Pronto
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Revise os detalhes abaixo antes de gerar suas rotinas semanais. Toque para editar qualquer item.
              </p>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {/* Card 1: Objetivo & Nível */}
              <div className="p-3 rounded-2xl glass-card border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Objetivo & Nível</span>
                    <span className="text-xs font-bold text-slate-200">
                      {goalDescriptions[goal]?.label} • {level}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1"
                >
                  Editar
                </button>
              </div>

              {/* Card 2: Frequência & Duração */}
              <div className="p-3 rounded-2xl glass-card border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Frequência & Duração</span>
                    <span className="text-xs font-bold text-slate-200">
                      {daysSelected.length} dias por semana • {durationMinutes} min/treino
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1"
                >
                  Editar
                </button>
              </div>

              {/* Card 3: Equipamentos */}
              <div className="p-3 rounded-2xl glass-card border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Equipamentos</span>
                    <span className="text-xs font-bold text-slate-200 capitalize">
                      {equipments.join(', ')}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1"
                >
                  Editar
                </button>
              </div>

              {/* Card 4: Limitações */}
              <div className="p-3 rounded-2xl glass-card border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Limitações Articulares</span>
                    <span className="text-xs font-bold text-slate-200 capitalize">
                      {limitations.length > 0 ? `Proteção: ${limitations.join(', ')}` : 'Nenhuma dor informada'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(7)}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1"
                >
                  Editar
                </button>
              </div>

              {/* Card 5: Lembrete */}
              <div className="p-3 rounded-2xl glass-card border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Lembrete Diário</span>
                    <span className="text-xs font-bold text-slate-200">
                      Às {preferredTime} {notificationsEnabled ? '(Notificação ativada)' : '(Sem notificação)'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(8)}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Bottom Actions Bar com Safe Area */}
        <div className="flex items-center justify-between pt-3 pb-[max(0.75rem,calc(env(safe-area-inset-bottom,0px)+0.5rem))] border-t border-white/10 shrink-0">
          {step === 1 ? (
            <button
              type="button"
              onClick={handleSkip}
              className="min-h-[48px] px-3 text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1.5 transition active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Pular (Plano Padrão)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePrevStep}
              className="min-h-[48px] px-3 text-xs text-slate-300 hover:text-white font-bold flex items-center gap-1.5 transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNextStep}
            className="min-h-[48px] px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition flex items-center gap-2 shadow-xl shadow-emerald-500/25 glow-emerald"
          >
            <span>{step === 9 ? 'Confirmar e Montar Minha Semana' : 'Continuar'}</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
