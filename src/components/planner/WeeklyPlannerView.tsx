import { useState } from 'react';
import type {
  WeeklyPlan,
  WeeklyDayPlan,
  Routine,
} from '../../types';
import {
  FOCUS_LABELS,
  createPresetWeeklyPlan,
} from '../../utils/workoutGenerator';
import {
  validateWeeklyPlan,
  calculateWeeklyMuscleVolume,
} from '../../utils/planValidator';
import { convertDayPlanToRoutine } from '../../utils/storage';
import { DayEditorModal } from './DayEditorModal';
import { MuscleMap } from '../visuals/MuscleMap';
import { soundManager } from '../../utils/audio';
import {
  Calendar,
  Sparkles,
  Play,
  Edit3,
  Copy,
  Clock,
  AlertTriangle,
  Zap,
  BarChart2,
} from 'lucide-react';
import { MUSCLE_LABELS } from '../../data/exercisesData';

interface WeeklyPlannerViewProps {
  plan: WeeklyPlan;
  onUpdatePlan: (updatedPlan: WeeklyPlan) => void;
  onStartScheduledWorkout: (routine: Routine) => void;
  onOpenOnboarding: () => void;
}

export const WeeklyPlannerView = ({
  plan,
  onUpdatePlan,
  onStartScheduledWorkout,
  onOpenOnboarding,
}: WeeklyPlannerViewProps) => {
  // Current selected day tab in planner (default: today's day of week or Monday)
  const todayDayNum = new Date().getDay(); // 0 = Domingo, 1 = Segunda...
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(todayDayNum);
  const [editingDay, setEditingDay] = useState<WeeklyDayPlan | null>(null);
  const [showVolumeHeatmap, setShowVolumeHeatmap] = useState<boolean>(false);

  // Validation notices
  const validationNotices = validateWeeklyPlan(plan);
  const muscleVolumes = calculateWeeklyMuscleVolume(plan);

  // Active day plan object
  const activeDayPlan =
    plan.days.find(d => d.dayOfWeek === selectedDayOfWeek) || plan.days[0];

  // Check if today has a planned workout
  const todayPlan = plan.days.find(d => d.dayOfWeek === todayDayNum);
  const isTodayActive = todayPlan && todayPlan.isActive;

  // Toggle active/rest status for selected day
  const handleToggleDayActive = (dayOfWeek: number) => {
    soundManager.triggerHaptic([20]);
    const updatedDays = plan.days.map(d => {
      if (d.dayOfWeek !== dayOfWeek) return d;
      return {
        ...d,
        isActive: !d.isActive,
      };
    });
    onUpdatePlan({ ...plan, days: updatedDays });
  };

  // Save day after modal edit
  const handleSaveDayEdit = (updatedDay: WeeklyDayPlan) => {
    const updatedDays = plan.days.map(d =>
      d.dayOfWeek === updatedDay.dayOfWeek ? updatedDay : d
    );
    onUpdatePlan({ ...plan, days: updatedDays });
    setEditingDay(null);
  };

  // Copy current day to another day
  const handleCopyDayTo = (targetDayOfWeek: number) => {
    soundManager.triggerHaptic([30]);
    const updatedDays = plan.days.map(d => {
      if (d.dayOfWeek !== targetDayOfWeek) return d;
      return {
        ...activeDayPlan,
        dayOfWeek: targetDayOfWeek,
        dayName: d.dayName,
        shortName: d.shortName,
      };
    });
    onUpdatePlan({ ...plan, days: updatedDays });
  };

  // Reset to preset template
  const handleApplyPreset = (template: 'ppl' | 'upper_lower' | 'fullbody' | 'abc' | 'core_daily') => {
    soundManager.triggerHaptic([35]);
    const preset = createPresetWeeklyPlan(template, plan.userLevel, plan.equipments);
    onUpdatePlan(preset);
  };

  // Top muscles worked this week for highlighting on MuscleMap
  const primaryWeeklyMuscles = muscleVolumes
    .filter(mv => mv.totalSets >= 6)
    .map(mv => mv.muscle);

  const secondaryWeeklyMuscles = muscleVolumes
    .filter(mv => mv.totalSets > 0 && mv.totalSets < 6)
    .map(mv => mv.muscle);

  return (
    <div className="space-y-6 pb-28">
      {/* Hero Header Banner */}
      <div className="relative glass-card rounded-3xl p-5 sm:p-7 overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 glow-emerald">
              <Calendar className="w-3.5 h-3.5" /> Planejador Semanal CalisteFlow
            </div>
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Assistente de Divisão
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Seu Cronograma Semanal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
            Escolha os dias que quer treinar e qual grupo focar. O CalisteFlow monta e equilibra cada sessão para você.
          </p>
        </div>
      </div>

      {/* Shortcut "Treinar Hoje" Banner */}
      {isTodayActive && todayPlan && (
        <div className="glass-card rounded-3xl p-5 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-teal-950/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glow-emerald">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500 text-slate-950">
              Treino de Hoje ({todayPlan.shortName})
            </span>
            <h3 className="text-lg font-black text-slate-100">{todayPlan.name}</h3>
            <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <Clock className="w-3.5 h-3.5" /> ~{todayPlan.targetDurationMinutes} min
              </span>
              <span>•</span>
              <span>{todayPlan.blocks.reduce((acc, b) => acc + b.exercises.length, 0)} exercícios</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundManager.triggerHaptic([45]);
              const routine = convertDayPlanToRoutine(todayPlan);
              onStartScheduledWorkout(routine);
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition glow-emerald"
          >
            <Play className="w-4 h-4 fill-current" /> Iniciar Treino de Hoje
          </button>
        </div>
      )}

      {/* Preset Quick Templates */}
      <div className="space-y-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
          Divisões Rápidas Prontas:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ppl' as const, label: 'Push / Pull / Legs (PPL)' },
            { id: 'upper_lower' as const, label: 'Upper / Lower' },
            { id: 'fullbody' as const, label: 'Full Body 3x' },
            { id: 'abc' as const, label: 'ABC Clássico' },
            { id: 'core_daily' as const, label: 'Core Diário' },
          ].map(tpl => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleApplyPreset(tpl.id)}
              className="px-3.5 py-2 rounded-2xl glass-card hover:bg-white/[0.08] text-xs font-bold text-slate-300 hover:text-white border border-white/10 shrink-0 transition active:scale-95"
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Notices & Warnings */}
      {validationNotices.length > 0 && (
        <div className="space-y-2">
          {validationNotices.map(notice => (
            <div
              key={notice.id}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 text-xs ${
                notice.type === 'warning'
                  ? 'bg-amber-500/10 text-amber-200 border-amber-500/30'
                  : 'bg-cyan-500/10 text-cyan-200 border-cyan-500/30'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div className="leading-relaxed font-medium">{notice.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* Week Days Selector Bar (Seg a Dom) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            Dias da Semana:
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {plan.days.filter(d => d.isActive).length} dias ativos
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {plan.days.map(day => {
            const isSelected = day.dayOfWeek === selectedDayOfWeek;
            const isToday = day.dayOfWeek === todayDayNum;

            return (
              <button
                key={day.dayOfWeek}
                type="button"
                onClick={() => {
                  soundManager.triggerHaptic([15]);
                  setSelectedDayOfWeek(day.dayOfWeek);
                }}
                className={`py-3 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition active:scale-95 border relative ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-500 to-teal-600 text-slate-950 border-emerald-300 shadow-xl glow-emerald'
                    : day.isActive
                    ? 'glass-card border-white/15 text-slate-100 hover:border-white/25'
                    : 'glass-card border-white/5 text-slate-500 opacity-60'
                }`}
              >
                {isToday && (
                  <span className="absolute -top-1.5 px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-tighter bg-amber-400 text-slate-950">
                    Hoje
                  </span>
                )}
                <span className="text-[11px] font-black font-mono tracking-wider">
                  {day.shortName}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    day.isActive
                      ? isSelected
                        ? 'bg-slate-950'
                        : 'bg-emerald-400'
                      : 'bg-slate-700'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Training Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/10 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-black font-mono text-base text-emerald-400 glow-emerald shrink-0">
              {activeDayPlan.shortName}
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                {activeDayPlan.dayName}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-100">
                {activeDayPlan.isActive ? activeDayPlan.name : 'Dia de Descanso Ativo'}
              </h2>
            </div>
          </div>

          {/* Action Buttons for Day */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleToggleDayActive(activeDayPlan.dayOfWeek)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition border ${
                activeDayPlan.isActive
                  ? 'glass-card text-amber-300 border-amber-500/30 hover:bg-amber-500/10'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {activeDayPlan.isActive ? 'Tornar Descanso' : 'Ativar Treino'}
            </button>

            {activeDayPlan.isActive && (
              <button
                type="button"
                onClick={() => {
                  const target = (activeDayPlan.dayOfWeek + 1) % 7;
                  handleCopyDayTo(target);
                }}
                title="Copiar treino deste dia para o próximo dia da semana"
                className="p-2 rounded-xl glass-card text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition active:scale-95 flex items-center gap-1"
                aria-label="Copiar dia"
              >
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Duplicar</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setEditingDay(activeDayPlan)}
              className="px-4 py-2 rounded-xl glass-card text-slate-200 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" /> Editar
            </button>
          </div>
        </div>

        {activeDayPlan.isActive ? (
          <div className="space-y-4">
            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-white/[0.05] border border-white/10 text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> ~{activeDayPlan.targetDurationMinutes} minutos
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/[0.05] border border-white/10 text-slate-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Meta: {activeDayPlan.goal}
              </span>
            </div>

            {/* Focus Chips */}
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                Grupos em Foco:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeDayPlan.focuses.map(f => {
                  const info = FOCUS_LABELS[f] || { label: f, emoji: '⚡' };
                  return (
                    <span
                      key={f}
                      className="px-3 py-1 rounded-2xl text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5"
                    >
                      <span>{info.emoji}</span>
                      <span>{info.label}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Blocks sequence preview */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                Exercícios Programados ({activeDayPlan.blocks.reduce((acc, b) => acc + b.exercises.length, 0)}):
              </span>

              {activeDayPlan.blocks.map(block => (
                <div key={block.id} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {block.title}
                  </span>
                  <div className="space-y-1.5 pl-3">
                    {block.exercises.map((pe, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                        <span className="font-bold text-slate-200">
                          {pe.exerciseId.replace('_', ' ')}
                        </span>
                        <span className="font-mono text-emerald-400 text-[11px]">
                          {pe.sets} séries × {pe.targetReps ? `${pe.targetReps} reps` : `${pe.targetHoldSeconds}s`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Launch Workout CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.triggerHaptic([40]);
                  const routine = convertDayPlanToRoutine(activeDayPlan);
                  onStartScheduledWorkout(routine);
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition glow-emerald"
              >
                <Play className="w-5 h-5 fill-current" /> Iniciar Treino deste Dia
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-3">
            <span className="text-3xl">☕</span>
            <h4 className="text-base font-bold text-slate-200">Dia de Recuperação</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              O descanso faz parte da sua evolução. O tecido muscular se reconstrói e ganha força durante as pausas.
            </p>
            <button
              type="button"
              onClick={() => handleToggleDayActive(activeDayPlan.dayOfWeek)}
              className="px-5 py-2.5 rounded-2xl glass-card text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/10 transition"
            >
              Planejar Treino para este Dia
            </button>
          </div>
        )}
      </div>

      {/* Weekly Muscle Volume Heatmap Toggle */}
      <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Volume Semanal por Músculo (Mapa de Calor)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowVolumeHeatmap(!showVolumeHeatmap)}
            className="text-xs font-bold text-emerald-400 hover:underline"
          >
            {showVolumeHeatmap ? 'Ocultar' : 'Visualizar Mapa'}
          </button>
        </div>

        {showVolumeHeatmap && (
          <div className="space-y-5 animate-in fade-in duration-200 pt-2 border-t border-white/[0.08]">
            <div className="flex justify-center">
              <MuscleMap
                primaryMuscles={primaryWeeklyMuscles}
                secondaryMuscles={secondaryWeeklyMuscles}
                size="md"
              />
            </div>

            {/* Volume distribution bars */}
            <div className="space-y-2">
              {muscleVolumes.slice(0, 6).map(mv => (
                <div key={mv.muscle} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">
                      {MUSCLE_LABELS[mv.muscle] || mv.muscle}
                    </span>
                    <span className="font-mono font-extrabold text-emerald-400">
                      {mv.totalSets} séries / sem
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full glow-emerald"
                      style={{ width: `${Math.min(100, (mv.totalSets / 24) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Day Editor Modal */}
      {editingDay && (
        <DayEditorModal
          day={editingDay}
          onSaveDay={handleSaveDayEdit}
          onClose={() => setEditingDay(null)}
        />
      )}
    </div>
  );
};
