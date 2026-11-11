import { useState, useRef, useMemo } from 'react';
import type { WorkoutSession, WorkoutStats, PersonalRecord, AdaptiveProgressionSuggestion } from '../../types';
import { MUSCLE_LABELS } from '../../data/exercisesData';
import {
  getPersonalRecords,
  computeAdaptiveProgressionSuggestions,
  saveAdaptiveProgressionDecision,
} from '../../utils/storage';
import { soundManager } from '../../utils/audio';
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
  Download,
  Upload,
  BarChart3,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Check,
  Filter,
} from 'lucide-react';

interface HistoryViewProps {
  history: WorkoutSession[];
  stats: WorkoutStats;
  onDeleteSession: (sessionId: string) => void;
  onNavigateToRoutines: () => void;
  onImportBackup?: (importedHistory: WorkoutSession[]) => void;
}

export const HistoryView = ({
  history,
  stats,
  onDeleteSession,
  onNavigateToRoutines,
  onImportBackup,
}: HistoryViewProps) => {
  const [activeTab, setActiveTab] = useState<'sessoes' | 'recordes' | 'progressoes'>('sessoes');
  const [periodFilter, setPeriodFilter] = useState<'todos' | '7dias' | '30dias' | 'mes'>('todos');
  const [exerciseFilter, setExerciseFilter] = useState<string>('todos');

  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [showVolumeAnalytics, setShowVolumeAnalytics] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [personalRecords] = useState<Record<string, PersonalRecord>>(getPersonalRecords);
  const [adaptiveSuggestions, setAdaptiveSuggestions] = useState<AdaptiveProgressionSuggestion[]>(() =>
    computeAdaptiveProgressionSuggestions(history)
  );

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

  // Coletar lista de exercícios únicos que o usuário já realizou
  const performedExercises = useMemo(() => {
    const map = new Map<string, string>();
    history.forEach(s => {
      s.exercises.forEach(ex => {
        if (!map.has(ex.exerciseId)) {
          map.set(ex.exerciseId, ex.exerciseName);
        }
      });
    });
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [history]);

  // Histórico filtrado por período e por exercício
  const filteredHistory = useMemo(() => {
    const now = Date.now();
    return history.filter(session => {
      const sessionTime = new Date(session.endTime || session.startTime).getTime();

      // Filtro de período
      if (periodFilter === '7dias' && now - sessionTime > 7 * 86400000) return false;
      if (periodFilter === '30dias' && now - sessionTime > 30 * 86400000) return false;
      if (periodFilter === 'mes') {
        const d = new Date(sessionTime);
        const cur = new Date();
        if (d.getMonth() !== cur.getMonth() || d.getFullYear() !== cur.getFullYear()) return false;
      }

      // Filtro de exercício
      if (exerciseFilter !== 'todos') {
        const hasEx = session.exercises.some(ex => ex.exerciseId === exerciseFilter);
        if (!hasEx) return false;
      }

      return true;
    });
  }, [history, periodFilter, exerciseFilter]);

  // Decisão na Progressão Adaptativa
  const handleProgressionDecision = (suggestionId: string, accepted: boolean) => {
    soundManager.triggerHaptic([30]);
    saveAdaptiveProgressionDecision(suggestionId, accepted);
    setAdaptiveSuggestions(prev =>
      prev.map(s => (s.id === suggestionId ? { ...s, accepted, dismissed: !accepted } : s))
    );
  };

  // Calculate muscle volume distribution
  const muscleVolumeMap: Record<string, number> = {};
  history.forEach(session => {
    session.musclesWorked?.forEach(m => {
      muscleVolumeMap[m] = (muscleVolumeMap[m] || 0) + (session.totalSetsCompleted || 1);
    });
  });

  const sortedMuscles = Object.entries(muscleVolumeMap).sort((a, b) => b[1] - a[1]);
  const maxMuscleSets = sortedMuscles.length > 0 ? sortedMuscles[0][1] : 1;

  // Set of dates with completed workouts (YYYY-MM-DD)
  const workoutDatesSet = new Set(
    history.map(s => {
      const d = new Date(s.endTime || s.startTime);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })
  );

  // Generate 28-day consistency calendar
  const calendarDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return {
      date: d,
      dateStr: str,
      dayNum: d.getDate(),
      trained: workoutDatesSet.has(str),
      isToday: i === 27,
    };
  });

  // Calculate workouts completed this week (since Monday)
  const workoutsThisWeek = (() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - mondayOffset);
    monday.setHours(0, 0, 0, 0);

    return history.filter(s => new Date(s.endTime || s.startTime).getTime() >= monday.getTime()).length;
  })();

  // Lembrete mensal de backup (D17)
  const [backupDismissed, setBackupDismissed] = useState(false);
  const isBackupReminderDue = (() => {
    if (history.length < 2 || backupDismissed) return false;
    try {
      const last = localStorage.getItem('calistheflow_last_backup_date');
      if (!last) return true;
      const daysSince = (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince >= 30;
    } catch {
      return false;
    }
  })();

  // Export JSON Backup
  const handleExportBackup = () => {
    try {
      localStorage.setItem('calistheflow_last_backup_date', new Date().toISOString());
    } catch {}
    const data = {
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      stats,
      history,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calisteflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup with Confirmation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.history)) {
          const confirmMsg = `ATENÇÃO: A restauração do backup substituirá seu histórico atual (${history.length} treinos) por ${parsed.history.length} treinos importados. Deseja realmente prosseguir?`;
          if (!window.confirm(confirmMsg)) {
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
          }

          if (onImportBackup) {
            onImportBackup(parsed.history);
          } else {
            localStorage.setItem('calistheflow_history_v1', JSON.stringify(parsed.history));
            window.location.reload();
          }
          alert(`Backup restaurado com sucesso! (${parsed.history.length} treinos carregados).`);
        } else {
          alert('Arquivo de backup inválido: não contém a lista de treinos esperada.');
        }
      } catch {
        alert('Erro ao processar o arquivo de backup. Certifique-se de que é um JSON válido.');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 safe-dock-pb">
      {/* Header with Export / Import Actions */}
      <div className="relative glass-card rounded-3xl p-5 sm:p-7 overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 flex items-center gap-2.5 tracking-tight">
              <Trophy className="w-7 h-7 text-amber-400" />
              Histórico & Progresso
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed font-medium">
              Acompanhe sua consistência calistênica, volume sob tensão e histórico de treinos salvo localmente.
            </p>
          </div>

          {/* Backup Buttons */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-2xl glass-card text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-white/10 transition active:scale-95"
              title="Importar Backup JSON"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" /> Importar
            </button>
            <button
              onClick={handleExportBackup}
              disabled={history.length === 0}
              className="px-3.5 py-2 rounded-2xl glass-card text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-white/10 disabled:opacity-40 transition active:scale-95 glow-emerald"
              title="Baixar Backup JSON"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" /> Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Lembrete Mensal de Backup (D17) */}
      {isBackupReminderDue && (
        <div className="glass-card rounded-3xl p-4 sm:p-5 border border-amber-500/40 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glow-amber animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                Lembrete de Segurança: Faça seu backup mensal
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Seus {history.length} treinos estão salvos no aparelho. Baixe o JSON para nunca perder seu histórico.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition active:scale-95 shadow-md flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Baixar Backup
            </button>
            <button
              type="button"
              onClick={() => setBackupDismissed(true)}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-semibold transition"
            >
              Lembrar depois
            </button>
          </div>
        </div>
      )}

      {/* Tabs de Navegação: Sessões, Recordes Pessoais, Progressão Adaptativa */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-white/10 glass-panel">
        <button
          type="button"
          onClick={() => {
            soundManager.triggerHaptic([15]);
            setActiveTab('sessoes');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'sessoes'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-md glow-emerald'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Sessões ({history.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.triggerHaptic([15]);
            setActiveTab('recordes');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'recordes'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md glow-amber'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Recordes (PRs) ({Object.keys(personalRecords).length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.triggerHaptic([15]);
            setActiveTab('progressoes');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 relative ${
            activeTab === 'progressoes'
              ? 'bg-purple-500 text-white font-black shadow-md glow-purple'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Progressão Adaptativa</span>
          {adaptiveSuggestions.filter(s => !s.accepted && !s.dismissed).length > 0 && (
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* ================= ABA 1: SESSÕES REALIZADAS ================= */}
      {activeTab === 'sessoes' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Aggregate Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Streak */}
            <div className="glass-card border border-amber-500/25 rounded-3xl p-5 flex flex-col justify-between shadow-xl glow-amber">
              <div className="flex items-center justify-between text-amber-400 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Streak Ativo</span>
                <Flame className="w-5 h-5 fill-current animate-bounce" />
              </div>
              <div>
                <div className="text-3xl font-black text-amber-300 font-mono tracking-tight">
                  {stats.currentStreakDays} {stats.currentStreakDays === 1 ? 'dia' : 'dias'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-semibold">Consistência diária</div>
              </div>
            </div>

            {/* Total Workouts */}
            <div className="glass-card border border-emerald-500/20 rounded-3xl p-5 flex flex-col justify-between shadow-xl glow-emerald">
              <div className="flex items-center justify-between text-emerald-400 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Treinos</span>
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-100 font-mono tracking-tight">{stats.totalWorkouts}</div>
                <div className="text-[11px] text-slate-400 mt-1 font-semibold">Sessões concluídas</div>
              </div>
            </div>

            {/* Total Time */}
            <div className="glass-card border border-cyan-500/20 rounded-3xl p-5 flex flex-col justify-between shadow-xl glow-cyan">
              <div className="flex items-center justify-between text-cyan-400 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tempo Total</span>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-100 font-mono tracking-tight">
                  {Math.floor(stats.totalMinutes / 60) > 0
                    ? `${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`
                    : `${stats.totalMinutes}m`}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-semibold">Tempo sob treino</div>
              </div>
            </div>

            {/* Total Sets */}
            <div className="glass-card border border-purple-500/20 rounded-3xl p-5 flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between text-purple-400 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Séries</span>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-100 font-mono tracking-tight">{stats.totalSets}</div>
                <div className="text-[11px] text-slate-400 mt-1 font-semibold">Séries executadas</div>
              </div>
            </div>
          </div>

          {/* Calendário de Constância (Últimos 28 Dias) & Metas */}
          <div className="glass-card rounded-3xl border border-white/10 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-100 tracking-tight">
                    Constância de Treinos (Últimas 4 Semanas)
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                    {workoutsThisWeek} {workoutsThisWeek === 1 ? 'treino realizado' : 'treinos realizados'} nesta semana
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 glow-emerald" /> Treinado
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-white/10" /> Descanso
                </span>
              </div>
            </div>

            {/* 28-Day Heat Grid (4 rows of 7 days) */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
              {calendarDays.map((cd) => (
                <div
                  key={cd.dateStr}
                  title={`${cd.date.toLocaleDateString('pt-BR')}: ${cd.trained ? 'Treino concluído!' : 'Descanso planejado'}`}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition cursor-default ${
                    cd.trained
                      ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-black glow-emerald'
                      : cd.isToday
                      ? 'bg-white/10 border border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/[0.03] border border-white/5 text-slate-400 font-medium hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="text-[11px] font-mono">{cd.dayNum}</span>
                  {cd.trained ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 glow-emerald" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Muscle Volume Distribution Analytics */}
          {sortedMuscles.length > 0 && (
            <div className="glass-card rounded-3xl border border-white/10 p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" /> Volume Acumulado por Grupo Muscular
                </h3>
                <button
                  onClick={() => setShowVolumeAnalytics(!showVolumeAnalytics)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  {showVolumeAnalytics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showVolumeAnalytics && (
                <div className="space-y-3 pt-1">
                  {sortedMuscles.map(([muscle, totalSets]) => {
                    const percent = Math.round((totalSets / maxMuscleSets) * 100);
                    return (
                      <div key={muscle} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-300">{MUSCLE_LABELS[muscle] || muscle}</span>
                          <span className="text-emerald-400 font-mono">{totalSets} séries estimuladas</span>
                        </div>
                        <div className="w-full bg-slate-950/80 h-2.5 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500 glow-emerald"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Filtros de Consulta: Período e Exercício */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl glass-card border border-white/5">
            {/* Filtro por Período */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5 text-cyan-400" /> Período:
              </span>
              {[
                { id: 'todos', label: 'Todos' },
                { id: '7dias', label: '7 Dias' },
                { id: '30dias', label: '30 Dias' },
                { id: 'mes', label: 'Este Mês' },
              ].map(pf => (
                <button
                  key={pf.id}
                  type="button"
                  onClick={() => {
                    soundManager.triggerHaptic([15]);
                    setPeriodFilter(pf.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition whitespace-nowrap active:scale-95 ${
                    periodFilter === pf.id
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {pf.label}
                </button>
              ))}
            </div>

            {/* Filtro por Exercício Específico */}
            {performedExercises.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Exercício:</span>
                <select
                  value={exerciseFilter}
                  onChange={e => {
                    soundManager.triggerHaptic([15]);
                    setExerciseFilter(e.target.value);
                  }}
                  className="bg-slate-900 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer max-w-[220px] truncate"
                >
                  <option value="todos">Todos os Exercícios</option>
                  {performedExercises.map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* History Log List */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Sessões Encontradas ({filteredHistory.length})
              </h3>
              {(periodFilter !== 'todos' || exerciseFilter !== 'todos') && (
                <button
                  type="button"
                  onClick={() => {
                    setPeriodFilter('todos');
                    setExerciseFilter('todos');
                  }}
                  className="text-xs text-cyan-400 hover:underline font-bold"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {filteredHistory.length > 0 ? (
              <div className="space-y-3.5">
                {filteredHistory.map(session => {
                  const isExpanded = expandedSessionId === session.id;

                  return (
                    <div
                      key={session.id}
                      className="glass-card rounded-3xl p-5 shadow-xl hover:border-white/15 transition-all duration-300 space-y-3"
                    >
                      {/* Session Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {formatDate(session.endTime || session.startTime)}
                            </span>
                            {session.perceivedEffort && (
                              <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/30 glow-amber">
                                RPE {session.perceivedEffort}/10
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-black text-slate-100 tracking-tight">
                            {session.routineTitle}
                          </h4>
                        </div>

                        <button
                          onClick={() => {
                            if (confirm('Deseja excluir esta sessão do histórico?')) {
                              onDeleteSession(session.id);
                            }
                          }}
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition active:scale-95"
                          title="Excluir sessão"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quick stats pills */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-3 py-1 rounded-xl bg-slate-950/70 border border-white/5 text-slate-300 flex items-center gap-1.5 font-mono">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          {formatDuration(session.durationSeconds)}
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-slate-950/70 border border-white/5 text-slate-300 flex items-center gap-1.5 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          {session.totalSetsCompleted} séries
                        </span>
                        {session.totalRepsCompleted > 0 && (
                          <span className="px-3 py-1 rounded-xl bg-slate-950/70 border border-white/5 text-slate-300 flex items-center gap-1.5 font-mono">
                            <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
                            {session.totalRepsCompleted} reps
                          </span>
                        )}
                        {session.totalIsometricSeconds > 0 && (
                          <span className="px-3 py-1 rounded-xl bg-slate-950/70 border border-white/5 text-slate-300 flex items-center gap-1.5 font-mono">
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
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                            >
                              {MUSCLE_LABELS[m] || m}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Personal notes */}
                      {session.userNotes && (
                        <p className="text-xs glass-card p-3 rounded-2xl border border-white/5 text-slate-300 italic font-medium">
                          "{session.userNotes}"
                        </p>
                      )}

                      {/* Detail toggle */}
                      <div className="pt-2 border-t border-white/[0.06]">
                        <button
                          onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                          className="text-xs text-emerald-400 font-bold flex items-center gap-1 hover:underline"
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
                          <div className="mt-3 space-y-2 pt-2 border-t border-white/[0.04] animate-in fade-in duration-150">
                            {session.exercises.map((ex, exIdx) => (
                              <div
                                key={exIdx}
                                className="glass-card p-3 rounded-2xl border border-white/5 text-xs"
                              >
                                <div className="font-bold text-slate-200 mb-1.5">
                                  {ex.exerciseName}
                                </div>
                                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                                  {ex.sets.map((s, sIdx) => (
                                    <span
                                      key={sIdx}
                                      className={`px-2 py-0.5 rounded-lg ${
                                        s.completed
                                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                          : 'bg-slate-800 text-slate-500'
                                      }`}
                                    >
                                      Série {s.setNumber}:{' '}
                                      {s.completedReps
                                        ? `${s.completedReps} reps`
                                        : `${s.completedSeconds || 0}s`}
                                      {s.weightKg ? ` (+${s.weightKg}kg)` : ''}
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
              <div className="p-10 text-center glass-card rounded-3xl border border-white/10 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto glow-emerald">
                  <Award className="w-7 h-7" />
                </div>
                <h4 className="text-base font-black text-slate-100">
                  Nenhum treino registrado neste período
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed font-medium">
                  Altere os filtros de período ou inicie uma nova rotina para preencher seu histórico.
                </p>
                <button
                  onClick={onNavigateToRoutines}
                  className="mt-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition glow-emerald"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Escolher uma Rotina
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= ABA 2: RECORDES PESSOAIS (PRs) ================= */}
      {activeTab === 'recordes' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="glass-card rounded-3xl p-5 border border-amber-500/30 bg-amber-500/5 space-y-1">
            <h3 className="text-sm sm:text-base font-black text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Quadro de Recordes Pessoais (PRs)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Registros automáticos dos seus picos de repetições máximas e tempos de isometria conquistados em cada movimento individual de calistenia.
            </p>
          </div>

          {Object.keys(personalRecords).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(personalRecords).map(pr => {
                const isReps = pr.type === 'reps';
                const hasPrevious = pr.previousValue && pr.previousValue > 0;
                const delta = hasPrevious ? pr.value - pr.previousValue! : 0;
                const deltaPercent = hasPrevious ? Math.round((delta / pr.previousValue!) * 100) : 0;

                return (
                  <div
                    key={pr.exerciseId}
                    className="p-4 sm:p-5 rounded-3xl glass-card border border-white/10 hover:border-amber-400/40 transition space-y-3 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                          {isReps ? 'Recorde de Repetições' : 'Recorde de Isometria'}
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-slate-100 mt-0.5">
                          {pr.exerciseName}
                        </h4>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center shrink-0">
                        <Trophy className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-3xl sm:text-4xl font-black font-mono text-amber-300">
                        {pr.value}
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase font-mono">
                        {isReps ? 'reps' : 'segundos'}
                      </span>
                      {hasPrevious && delta > 0 && (
                        <span className="ml-auto text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1 font-mono">
                          <TrendingUp className="w-3 h-3" /> +{delta} ({deltaPercent}%)
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Alcançado em:</span>
                      <span className="font-semibold text-slate-300">
                        {new Date(pr.achievedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center glass-card rounded-3xl border border-white/10 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto glow-amber">
                <Trophy className="w-7 h-7" />
              </div>
              <h4 className="text-base font-black text-slate-100">
                Nenhum recorde registrado ainda
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Ao concluir suas séries no Modo de Treino, o CalisteFlow identifica e salva automaticamente seus recordes de repetições e tempos estáticos.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================= ABA 3: PROGRESSÃO ADAPTATIVA ================= */}
      {activeTab === 'progressoes' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="glass-card rounded-3xl p-5 border border-purple-500/30 bg-purple-500/5 space-y-1">
            <h3 className="text-sm sm:text-base font-black text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Sugestões de Progressão Adaptativa
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              O CalisteFlow nunca altera a dificuldade do seu treino à força. Quando você domina um exercício em várias sessões com esforço controlado, sugerimos a próxima variação biomecânica para sua aprovação.
            </p>
          </div>

          {adaptiveSuggestions.length > 0 ? (
            <div className="space-y-3">
              {adaptiveSuggestions.map(sug => {
                const isDecided = sug.accepted || sug.dismissed;

                return (
                  <div
                    key={sug.id}
                    className={`p-4 sm:p-5 rounded-3xl glass-card border transition space-y-3 shadow-lg ${
                      sug.accepted
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : sug.dismissed
                        ? 'border-white/5 opacity-60'
                        : 'border-purple-500/40 bg-purple-500/5 hover:border-purple-500/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-slate-200">
                          {sug.fromExerciseName}
                        </span>
                        <ArrowRight className="w-4 h-4 text-purple-400 shrink-0" />
                        <span className="font-black text-sm text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-xl border border-purple-500/30">
                          {sug.toExerciseName}
                        </span>
                      </div>

                      {sug.accepted && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/40 flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> Aceito
                        </span>
                      )}
                      {sug.dismissed && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-white/5 text-slate-400 text-[10px] font-bold">
                          Dispensado
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {sug.reason}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="font-semibold text-slate-300">Evidência registrada:</span>
                      <span className="font-mono text-cyan-400 font-bold">{sug.metric}</span>
                    </div>

                    {!isDecided && (
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleProgressionDecision(sug.id, true)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Aceitar Progressão</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleProgressionDecision(sug.id, false)}
                          className="py-2.5 px-4 rounded-xl glass-card text-slate-400 hover:text-white font-bold text-xs active:scale-95 transition"
                        >
                          Dispensar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center glass-card rounded-3xl border border-white/10 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto glow-purple">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-base font-black text-slate-100">
                Continue treinando para desbloquear sugestões
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Quando você realizar pelo menos 2 a 3 treinos de um exercício completando todas as repetições com facilidade, as recomendações de avanço aparecerão aqui.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
