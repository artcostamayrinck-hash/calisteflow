import React, { useState, useEffect, useCallback } from 'react';
import type { Routine, WorkoutStats, WeeklyPlan } from '../../types';
import { convertDayPlanToRoutine } from '../../utils/storage';
import { soundManager } from '../../utils/audio';
import { getAppSettings, saveAppSettings, prefersReducedMotion } from '../../utils/appSettings';
import type { AppSettings } from '../../utils/appSettings';
import {
  Play,
  Zap,
  Flame,
  Calendar,
  Clock,
  ChevronRight,
  Dumbbell,
  TrendingUp,
  Sparkles,
  Settings,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  Activity,
  Download,
  RotateCcw,
  ShieldAlert,
  X,
  Database,
} from 'lucide-react';
import { GuidedJourneyCard } from '../retention/GuidedJourneyCard';
import { StrengthRadarModal } from '../assessment/StrengthRadarModal';
import { StyleComparisonGalleryModal } from '../visuals/figure/StyleComparisonGalleryModal';
import { SkillTreeModal } from '../skills/SkillTreeModal';
import { InstallGuideModal } from '../pwa/InstallGuideModal';
import { BackupRestoreModal } from '../pwa/BackupRestoreModal';
import type { WorkoutSession } from '../../types';

interface HomeViewProps {
  stats: WorkoutStats;
  history: WorkoutSession[];
  weeklyPlan: WeeklyPlan;
  routines: Routine[];
  onStartRoutine: (routine: Routine) => void;
  onNavigateTo: (tab: 'routines' | 'planner' | 'exercises' | 'history') => void;
  onOpenOnboarding: () => void;
  onOpenSafeExecution?: () => void;
  onOpenFeedback?: () => void;
  onOpenFaq?: () => void;
}

/** Greeting based on the hour of the day */
function getDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

/** Day-of-week number → short name */
function todayShortName(): string {
  return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][new Date().getDay()];
}

/** Format seconds → "Xm Ys" */
function fmtMinSec(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m > 0 ? `${m}m${s > 0 ? ` ${s}s` : ''}` : `${s}s`;
}

export const HomeView: React.FC<HomeViewProps> = ({
  stats,
  history,
  weeklyPlan,
  routines,
  onStartRoutine,
  onNavigateTo,
  onOpenOnboarding,
  onOpenSafeExecution,
  onOpenFeedback,
  onOpenFaq,
}) => {
  const [settings, setSettings] = useState<AppSettings>(getAppSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [showStyleComparison, setShowStyleComparison] = useState(false);
  const [showBackupRestoreModal, setShowBackupRestoreModal] = useState(false);
  const [recordPulse, setRecordPulse] = useState(false);

  // D13, D14, D18: Modais de Avaliação, Skills e Instalação PWA
  const [showStrengthRadar, setShowStrengthRadar] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  // D10: Detecção de Treino Perdido de Ontem
  const [dismissedReschedule, setDismissedReschedule] = useState(false);
  // D15: Detecção de Semana de Deload
  const [dismissedDeload, setDismissedDeload] = useState(false);

  const noMotion = prefersReducedMotion();
  const todayDayNum = new Date().getDay();
  const todayPlan = weeklyPlan.days.find(d => d.dayOfWeek === todayDayNum);
  const hasTodayWorkout = todayPlan?.isActive && todayPlan.blocks.length > 0;

  // D10: Análise de ontem
  const yesterdayDayNum = (todayDayNum + 6) % 7;
  const yesterdayPlan = weeklyPlan.days.find(d => d.dayOfWeek === yesterdayDayNum);
  const wasYesterdayActive = Boolean(yesterdayPlan?.isActive && yesterdayPlan.blocks.length > 0);

  const yesterdayDateStr = (() => {
    const d = new Date(Date.now() - 86400000);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const hasTrainedYesterday = history.some(s => {
    const d = new Date(s.endTime || s.startTime);
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return str === yesterdayDateStr;
  });

  const showRescheduleNotice = wasYesterdayActive && !hasTrainedYesterday && !dismissedReschedule && Boolean(yesterdayPlan);

  // D15: Sugestão de Deload após 4 semanas intensas seguidas
  const isDeloadRecommended = (() => {
    if (history.length < 12) return false;
    const now = Date.now();
    const fourWeeksMs = 28 * 86400000;
    const recentWorkouts = history.filter(s => {
      const time = new Date(s.endTime || s.startTime).getTime();
      return now - time <= fourWeeksMs;
    });
    return recentWorkouts.length >= 12;
  })();

  // Find next scheduled training day (starting from tomorrow)
  const nextActiveDay = (() => {
    for (let i = 1; i <= 7; i++) {
      const dayNum = (todayDayNum + i) % 7;
      const d = weeklyPlan.days.find(dd => dd.dayOfWeek === dayNum);
      if (d?.isActive && d.blocks.length > 0) return d;
    }
    return null;
  })();

  // Weekly stats derived from weeklyPlan
  const totalActiveDays = weeklyPlan.days.filter(d => d.isActive).length;
  const completedThisWeek = (() => {
    // Compare history sessions to this week's start (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - mondayOffset);
    monday.setHours(0, 0, 0, 0);
    // We don't have history here, use streak as approximation
    return Math.min(stats.currentStreakDays, totalActiveDays);
  })();

  // Trigger a subtle record pulse when stats are great
  useEffect(() => {
    if (stats.currentStreakDays >= 7 && !noMotion) {
      setRecordPulse(true);
      const t = setTimeout(() => setRecordPulse(false), 3000);
      return () => clearTimeout(t);
    }
  }, [stats.currentStreakDays, noMotion]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, val: AppSettings[K]) => {
    soundManager.triggerHaptic([20]);
    setSettings(prev => {
      const next = { ...prev, [key]: val };
      saveAppSettings(next);
      return next;
    });
  }, []);

  const handleStartTodayWorkout = () => {
    soundManager.triggerHaptic([50]);
    if (!todayPlan || !hasTodayWorkout) return;
    const routine = convertDayPlanToRoutine(todayPlan);
    onStartRoutine(routine);
  };

  const handleStartQuickWorkout = () => {
    soundManager.triggerHaptic([40]);
    // Start the first routine from the library as a quick session
    if (routines.length > 0) {
      onStartRoutine(routines[0]);
    } else {
      onNavigateTo('routines');
    }
  };

  const handleStartFromRoutine = (routine: Routine) => {
    soundManager.triggerHaptic([40]);
    onStartRoutine(routine);
  };

  // Large-text multiplier applied to key text size classes
  const lt = settings.largeText;
  // Left-hand mode: flex-row-reverse for action rows
  const lhm = settings.leftHandMode;

  return (
    <div
      className={`space-y-5 safe-dock-pb ${lt ? 'text-base' : ''}`}
      style={lhm ? { direction: 'rtl' } : undefined}
    >
      {/* ── HERO SECTION ── */}
      <div
        className="relative rounded-3xl overflow-hidden glass-card border border-white/10 shadow-2xl p-5 sm:p-6"
        style={{ direction: 'ltr' }} // always LTR inside hero
      >
        {/* Background decorative blobs */}
        <div
          className={`absolute -top-10 -right-10 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none ${noMotion ? '' : 'animate-pulse'}`}
        />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-cyan-500/8 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Greeting + Settings toggle */}
          <div className={`flex items-start justify-between mb-4 ${lhm ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-3 sm:gap-3.5">
              <img
                src="./assets/img/logo-512.png"
                alt="CalisteFlow"
                width="48"
                height="48"
                className="w-10 sm:w-12 h-auto object-contain shrink-0"
              />
              <div>
                <p className={`${lt ? 'text-sm' : 'text-xs'} text-slate-400 font-medium`}>
                  {getDayGreeting()} 👋
                </p>
                <h1
                  className={`${lt ? 'text-3xl' : 'text-2xl sm:text-3xl'} font-black text-slate-100 tracking-tight leading-none mt-0.5`}
                >
                  Vamos{' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    treinar?
                  </span>
                </h1>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.triggerHaptic([15]);
                setShowSettings(s => !s);
              }}
              className="p-2.5 rounded-2xl glass-card border border-white/10 text-slate-400 hover:text-white active:scale-90 transition shrink-0 mt-0.5"
              aria-label="Preferências de exibição"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Quick settings panel */}
          {showSettings && (
            <div
              className={`mb-4 p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5 ${noMotion ? '' : 'animate-in fade-in duration-150'}`}
              style={{ direction: 'ltr' }}
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Preferências do Aplicativo
                </p>
              </div>

              {/* Acesso Rápido: Avatar e Estilos de Figura */}
              <button
                type="button"
                onClick={() => setShowStyleComparison(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/15 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/15 text-cyan-300 transition active:scale-98 shadow-sm"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold block text-slate-100">Avatar & Estilos de Figura</span>
                    <span className="text-[10px] text-cyan-300/80">
                      4 estilos (Manequim, Anatômico, Silhueta, Contorno), biotipo e cores
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
              </button>

              {(
                [
                  { key: 'playAnimations', label: 'Reproduzir Animações', desc: 'Loop de movimento biomecânico nos exercícios' },
                  { key: 'outdoorMode', label: 'Modo Outdoor (Alto Contraste)', desc: 'Preto puro e elementos ampliados para sol direto' },
                  { key: 'leftHandMode', label: 'Modo Mão Esquerda', desc: 'Inverte controles para a esquerda' },
                  { key: 'largeText', label: 'Texto Grande', desc: 'Aumenta legibilidade em treino' },
                  { key: 'reducedMotion', label: 'Reduzir Animações', desc: 'Desativa microinterações' },
                  { key: 'wakeLockEnabled', label: 'Tela Sempre Ligada (Wake Lock)', desc: 'Evita bloqueio automático de tela no treino' },
                  { key: 'soundEnabled', label: 'Efeitos Sonoros & Beeps', desc: 'Alarmes de descanso e início' },
                  { key: 'voiceEnabled', label: 'Narração de Treino por Voz', desc: 'Anuncia exercícios e descanso em português (Web Speech)' },
                ] as { key: keyof AppSettings; label: string; desc: string }[]
              ).map(({ key, label, desc }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => updateSetting(key, !settings[key])}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition active:scale-98 border ${settings[key]
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'border-white/5 text-slate-400'
                    }`}
                >
                  <div className="text-left">
                    <span className="text-xs font-bold block">{label}</span>
                    <span className="text-[10px] text-slate-400">{desc}</span>
                  </div>
                  <div
                    className={`w-8 h-4.5 rounded-full transition-colors relative shrink-0 ${settings[key] ? 'bg-emerald-500' : 'bg-white/15'
                      }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${settings[key] ? 'translate-x-3.5' : 'translate-x-0'
                        }`}
                    />
                  </div>
                </button>
              ))}

              {/* Ajuste de Volume e Timbre */}
              {settings.soundEnabled && (
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Volume do Cronômetro</span>
                    <span className="text-emerald-400 font-mono">{Math.round(settings.soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.soundVolume}
                    onChange={e => updateSetting('soundVolume', parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 font-semibold">Timbre do Alarme</span>
                    <div className="flex gap-1">
                      {(['padrao', 'suave', 'apito'] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            updateSetting('soundTimbre', t);
                            soundManager.playStartBeep();
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize transition ${settings.soundTimbre === t
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-white/5 text-slate-400 hover:text-white'
                            }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 pt-0.5 italic">
                    💡 No iPhone/Safari, desative a chave física de silencioso lateral para escutar os beeps.
                  </p>
                </div>
              )}

              {/* Tema Visual (Claro / Escuro / Auto) */}
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-300 block">Tema da Interface</span>
                  <span className="text-[10px] text-slate-400">Escuro padrão, Claro de alto contraste ou Automático (sistema)</span>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${settings.theme === 'dark' ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                  >
                    Escuro
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSetting('theme', 'light')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${settings.theme === 'light' ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                  >
                    Claro
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSetting('theme', 'auto')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${settings.theme === 'auto' ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                  >
                    Auto
                  </button>
                </div>
              </div>

              {/* Tempo Padrão de Descanso entre Séries */}
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Tempo Padrão de Descanso
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{settings.defaultRestSeconds || 60}s</span>
                </div>
                <div className="flex gap-1 justify-between pt-1">
                  {[30, 45, 60, 90, 120].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateSetting('defaultRestSeconds', s)}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition ${
                        (settings.defaultRestSeconds || 60) === s
                          ? 'bg-cyan-500 text-slate-950 font-black shadow'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Backup & Restauração de Dados */}
              <button
                type="button"
                onClick={() => {
                  soundManager.triggerHaptic([25]);
                  setShowBackupRestoreModal(true);
                }}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/5 border border-emerald-500/30 hover:border-emerald-500/50 flex items-center justify-between text-left transition active:scale-98 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">Backup & Restauração (JSON)</span>
                    <span className="text-[10px] text-emerald-300/80">
                      Exportar ou importar treinos, rotinas e recordes offline
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0" />
              </button>

              {/* D18: Guia de Instalação PWA */}
              <button
                type="button"
                onClick={() => {
                  soundManager.triggerHaptic([25]);
                  setShowInstallGuide(true);
                }}
                className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 flex items-center justify-between text-left transition"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Como Instalar no Celular</span>
                    <span className="text-[10px] text-slate-400">Guia passo a passo para iPhone e Android</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Versão do CalisteFlow</span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  v{typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '4.2.0'}
                </span>
              </div>
            </div>
          )}

          {/* D10: Card de Reagendamento de Treino Perdido de Ontem */}
          {showRescheduleNotice && yesterdayPlan && (
            <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-3 animate-in fade-in">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                      Treino Pendente de Ontem
                    </span>
                    <h3 className="text-xs font-bold text-slate-100">
                      Você não registrou: {yesterdayPlan.name}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDismissedReschedule(true)}
                  aria-label="Dispensar aviso de reagendamento"
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Deseja reagendar e realizar a rotina de ontem hoje para não quebrar seu ritmo?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.triggerHaptic([35]);
                    onStartRoutine(convertDayPlanToRoutine(yesterdayPlan));
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md glow-amber active:scale-95 transition"
                >
                  Fazer Treino de Ontem Agora
                </button>
                <button
                  type="button"
                  onClick={() => setDismissedReschedule(true)}
                  className="py-2.5 px-3 rounded-xl bg-white/5 text-slate-400 hover:text-white font-bold text-xs active:scale-95 transition"
                >
                  Dispensar
                </button>
              </div>
            </div>
          )}

          {/* D15: Alerta Inteligente de Semana de Deload */}
          {isDeloadRecommended && !dismissedDeload && (
            <div className="p-4 rounded-3xl bg-teal-500/10 border border-teal-500/30 space-y-2.5 animate-in fade-in">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-4 h-4 text-teal-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 block">
                      Recuperação & Supercompensação
                    </span>
                    <h3 className="text-xs font-bold text-slate-100">
                      Sugestão de Semana de Deload
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDismissedDeload(true)}
                  aria-label="Dispensar sugestão de deload"
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Você acumulou 4 semanas consecutivas de treinos regulares! Uma <strong>Semana de Deload</strong> (reduzir 30-40% do volume de séries mantendo o plano) previne inflamação nos tendões e acelera ganhos de força.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-teal-400 italic font-semibold">
                  Pare se houver dor aguda articular.
                </span>
                <button
                  type="button"
                  onClick={() => setDismissedDeload(true)}
                  className="text-xs text-teal-300 hover:underline font-bold"
                >
                  Entendido
                </button>
              </div>
            </div>
          )}

          {/* TODAY's WORKOUT – Primary CTA */}
          {hasTodayWorkout ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className={`${lt ? 'text-sm' : 'text-xs'} font-bold text-emerald-400 uppercase tracking-wider`}>
                  Treino de hoje • {todayShortName()}
                </span>
              </div>

              <button
                onClick={handleStartTodayWorkout}
                className={`w-full min-h-[64px] flex items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-2xl shadow-emerald-500/30 hover:brightness-110 active:scale-98 transition ${noMotion ? '' : 'animate-pulse-ring'
                  } glow-emerald`}
                aria-label={`Iniciar treino: ${todayPlan?.name}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/20 flex items-center justify-center shrink-0">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left">
                    <span className={`${lt ? 'text-base' : 'text-sm'} font-black block leading-tight`}>
                      Treinar Agora
                    </span>
                    <span className="text-xs font-semibold opacity-80 block">
                      {todayPlan?.name} • {todayPlan?.targetDurationMinutes} min
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 stroke-[3] shrink-0" />
              </button>

              {/* Quick workout shortcut */}
              <button
                onClick={handleStartQuickWorkout}
                className="w-full min-h-[48px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl glass-card border border-white/10 text-slate-200 hover:border-white/20 transition active:scale-98"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span className={`${lt ? 'text-sm' : 'text-xs'} font-bold`}>
                  Treino Curto (10 min)
                </span>
              </button>
            </div>
          ) : (
            /* NO workout today */
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 text-center space-y-2">
                <div className="text-2xl">🛌</div>
                <p className={`${lt ? 'text-sm' : 'text-xs'} text-slate-300 font-semibold`}>
                  Hoje é dia de descanso ativo.
                </p>
                {nextActiveDay && (
                  <p className={`${lt ? 'text-xs' : 'text-[11px]'} text-slate-400`}>
                    Próximo treino: <strong className="text-emerald-400">{nextActiveDay.dayName}</strong>{' '}
                    — {nextActiveDay.name}
                  </p>
                )}
              </div>

              <button
                onClick={handleStartQuickWorkout}
                className="w-full min-h-[56px] flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-white/[0.06] border border-white/10 text-slate-200 hover:border-emerald-500/40 transition active:scale-98"
              >
                <Zap className="w-5 h-5 text-amber-400" />
                <span className={`${lt ? 'text-sm' : 'text-sm'} font-bold`}>
                  Fazer treino curto mesmo assim
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── GUIDED JOURNEY & RETENTION MILESTONES (G2) ── */}
      <GuidedJourneyCard
        stats={stats}
        history={history}
        onStartQuickWorkout={handleStartQuickWorkout}
        onNavigateToExercises={() => onNavigateTo('exercises')}
      />

      {/* ── WEEKLY OVERVIEW ── */}
      <div className="glass-card rounded-3xl border border-white/10 p-4 sm:p-5 space-y-3" style={{ direction: 'ltr' }}>
        <div className={`flex items-center justify-between ${lhm ? 'flex-row-reverse' : ''}`}>
          <h2 className={`${lt ? 'text-base' : 'text-sm'} font-black text-slate-100 flex items-center gap-2`}>
            <Calendar className="w-4 h-4 text-teal-400" />
            Semana Atual
          </h2>
          <button
            onClick={() => onNavigateTo('planner')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 active:scale-95 transition"
          >
            Ver plano <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Day pills */}
        <div className="grid grid-cols-7 gap-1">
          {weeklyPlan.days.map(d => {
            const isToday = d.dayOfWeek === todayDayNum;
            const done = false; // future: integrate actual history per day
            return (
              <div
                key={d.dayOfWeek}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl transition ${isToday
                    ? 'bg-emerald-500/20 border border-emerald-500/50'
                    : 'border border-white/5'
                  }`}
              >
                <span
                  className={`text-[10px] font-black uppercase ${isToday ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                >
                  {d.shortName}
                </span>
                <div
                  className={`w-3 h-3 rounded-full ${done
                      ? 'bg-emerald-400'
                      : d.isActive
                        ? isToday
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-emerald-500/40'
                        : 'bg-white/10'
                    }`}
                />
              </div>
            );
          })}
        </div>

        {/* Week stats row */}
        <div className={`grid grid-cols-3 gap-2 pt-1 ${lhm ? 'flex-row-reverse' : ''}`}>
          {[
            {
              icon: <Flame className="w-4 h-4 text-amber-400" />,
              value: stats.currentStreakDays,
              label: 'dias streak',
              highlight: stats.currentStreakDays >= 7,
            },
            {
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
              value: `${completedThisWeek}/${totalActiveDays}`,
              label: 'treinos',
              highlight: false,
            },
            {
              icon: <Clock className="w-4 h-4 text-teal-400" />,
              value: fmtMinSec(stats.totalMinutes * 60),
              label: 'tempo total',
              highlight: false,
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-0.5 p-2.5 rounded-2xl glass-card border ${s.highlight
                  ? `border-amber-500/30 bg-amber-500/10 ${recordPulse && !noMotion ? 'animate-pulse' : ''}`
                  : 'border-white/5'
                }`}
            >
              {s.icon}
              <span
                className={`${lt ? 'text-base' : 'text-sm'} font-black font-mono text-slate-100 leading-tight mt-0.5`}
              >
                {s.value}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── NEXT WORKOUT PREVIEW ── */}
      {nextActiveDay && (
        <div className="glass-card rounded-3xl border border-white/10 p-4 sm:p-5 space-y-3" style={{ direction: 'ltr' }}>
          <h2 className={`${lt ? 'text-base' : 'text-sm'} font-black text-slate-100 flex items-center gap-2`}>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Próximo Treino
          </h2>

          <div
            className={`flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/5 ${lhm ? 'flex-row-reverse' : ''
              }`}
          >
            <div>
              <p className={`${lt ? 'text-sm' : 'text-xs'} font-bold text-slate-200`}>
                {nextActiveDay.dayName} — {nextActiveDay.name}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {nextActiveDay.targetDurationMinutes} min •{' '}
                {nextActiveDay.focuses.slice(0, 3).join(', ')}
              </p>
            </div>
            <button
              onClick={() => onNavigateTo('planner')}
              className="p-2.5 rounded-xl glass-card border border-white/10 text-slate-400 hover:text-white active:scale-90 transition shrink-0"
              aria-label="Ver plano semanal"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── D13 & D14: PILARES & PROGRESSÃO TÉCNICA ── */}
      <div className="grid grid-cols-2 gap-3" style={{ direction: 'ltr' }}>
        <button
          type="button"
          onClick={() => {
            soundManager.triggerHaptic([30]);
            setShowStrengthRadar(true);
          }}
          className="p-4 rounded-3xl glass-card border border-cyan-500/20 hover:border-cyan-500/40 bg-cyan-500/5 text-left flex flex-col justify-between space-y-3 transition active:scale-98"
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 block">
              Radar Pentagonal
            </span>
            <p className="font-bold text-xs sm:text-sm text-slate-100 mt-0.5">
              Avaliação de Força
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              5 testes e gráfico SVG dos pilares
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.triggerHaptic([30]);
            setShowSkillTree(true);
          }}
          className="p-4 rounded-3xl glass-card border border-purple-500/20 hover:border-purple-500/40 bg-purple-500/5 text-left flex flex-col justify-between space-y-3 transition active:scale-98"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 block">
              Trilhas Lendárias
            </span>
            <p className="font-bold text-xs sm:text-sm text-slate-100 mt-0.5">
              Árvore de Skills
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Barra, Muscle-up, Planche e mais
            </p>
          </div>
        </button>
      </div>

      {/* ── SAFETY & CREF BIOMECHANICS BANNER ── */}
      {onOpenSafeExecution && (
        <button
          type="button"
          onClick={() => {
            soundManager.triggerHaptic([30]);
            onOpenSafeExecution();
          }}
          className="w-full p-4 rounded-3xl glass-card border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/5 transition flex items-center justify-between gap-3 text-left active:scale-98"
          style={{ direction: 'ltr' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 glow-emerald">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                Saúde & Biomecânica
              </span>
              <p className="font-bold text-xs sm:text-sm text-slate-100">
                Guia de Execução Segura & Checklist CREF
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Regra de ouro da dor, móveis em casa e programas por público.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-400 shrink-0" />
        </button>
      )}

      {/* ── QUICK-START ROUTINES ── */}
      {routines.length > 0 && (
        <div className="space-y-3" style={{ direction: 'ltr' }}>
          <div className={`flex items-center justify-between ${lhm ? 'flex-row-reverse' : ''}`}>
            <h2 className={`${lt ? 'text-base' : 'text-sm'} font-black text-slate-100 flex items-center gap-2`}>
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              Rotinas Rápidas
            </h2>
            <button
              onClick={() => onNavigateTo('routines')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 active:scale-95 transition"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {routines.slice(0, 3).map(routine => (
              <button
                key={routine.id}
                onClick={() => handleStartFromRoutine(routine)}
                className={`w-full min-h-[56px] flex items-center justify-between gap-3 p-3.5 rounded-2xl glass-card border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition active:scale-98 group ${lhm ? 'flex-row-reverse text-right' : ''
                  }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className={`${lt ? 'text-sm' : 'text-xs'} font-bold text-slate-200 truncate`}>
                      {routine.title}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {routine.estimatedMinutes} min • {routine.exercises.length} exercícios •{' '}
                      {routine.difficulty}
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/0 group-hover:bg-emerald-500/15 flex items-center justify-center transition shrink-0">
                  <Play className="w-4 h-4 text-emerald-400 fill-emerald-400 opacity-0 group-hover:opacity-100 transition" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── ONBOARDING PROMPT (if no plan configured) ── */}
      {weeklyPlan.days.every(d => !d.isActive) && (
        <div
          className="glass-card rounded-3xl border border-emerald-500/20 p-5 space-y-3 text-center"
          style={{ direction: 'ltr' }}
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className={`${lt ? 'text-base' : 'text-sm'} font-black text-slate-100`}>
              Monte seu plano de treino
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Responda 8 perguntas rápidas e geramos sua semana personalizada.
            </p>
          </div>
          <button
            onClick={() => {
              soundManager.triggerHaptic([40]);
              onOpenOnboarding();
            }}
            className="w-full min-h-[48px] py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition glow-emerald"
          >
            <Sparkles className="w-4 h-4" />
            Criar Meu Plano Agora
          </button>
        </div>
      )}

      {/* ── FOOTER: HELP, FAQ & ANONYMOUS FEEDBACK (G4) ── */}
      <div className="pt-2 pb-6 flex items-center justify-center gap-4 text-xs" style={{ direction: 'ltr' }}>
        {onOpenFaq && (
          <button
            type="button"
            onClick={() => {
              soundManager.triggerHaptic([20]);
              onOpenFaq();
            }}
            className="text-slate-400 hover:text-emerald-400 font-bold flex items-center gap-1.5 transition active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ & Novidades</span>
          </button>
        )}

        <span className="text-white/10">•</span>

        {onOpenFeedback && (
          <button
            type="button"
            onClick={() => {
              soundManager.triggerHaptic([20]);
              onOpenFeedback();
            }}
            className="text-slate-400 hover:text-emerald-400 font-bold flex items-center gap-1.5 transition active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Feedback & Erros</span>
          </button>
        )}
      </div>
      {/* D13, D14, D18: Modais Interativos */}
      {showStrengthRadar && <StrengthRadarModal onClose={() => setShowStrengthRadar(false)} />}
      {showSkillTree && (
        <SkillTreeModal
          onClose={() => setShowSkillTree(false)}
          onOpenExerciseDetails={() => onNavigateTo('exercises')}
        />
      )}
      {showInstallGuide && <InstallGuideModal onClose={() => setShowInstallGuide(false)} />}
      {showStyleComparison && (
        <StyleComparisonGalleryModal
          isOpen={showStyleComparison}
          onClose={() => setShowStyleComparison(false)}
        />
      )}
      {showBackupRestoreModal && (
        <BackupRestoreModal
          isOpen={showBackupRestoreModal}
          onClose={() => setShowBackupRestoreModal(false)}
        />
      )}
    </div>
  );
};

