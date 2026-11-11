import React, { useState, useMemo } from 'react';
import type { WorkoutStats, WorkoutSession, PersonalRecord, Routine } from '../../types';
import type {
  SkillCategory,
  SkillNode,
  UserSkillProgress,
  StructuredProgram,
  UserProgramEnrollment,
  Achievement,
  UserGamificationProfile,
  Challenge,
  EvolutionReport,
} from '../../types/gamification';
import { SKILL_CATEGORIES_CONFIG, SKILL_TREE_NODES } from '../../data/skillsData';
import { STRUCTURED_PROGRAMS } from '../../data/programsData';
import {
  getSkillProgressMap,
  saveSkillProgress,
  getProgramEnrollments,
  getActiveProgram,
  enrollInProgram,
  completeProgramSession,
  pauseProgram,
  resumeProgram,
  abandonProgram,
  restartProgram,
  evaluateAchievements,
  calculateUserGamificationProfile,
  getChallengesWithProgress,
  toggleJoinChallenge,
  generateEvolutionReport,
} from '../../utils/gamificationStorage';
import { SkillDetailModal } from './SkillDetailModal';
import { ProgramDetailModal } from './ProgramDetailModal';
import { ShareableCardModal } from './ShareableCardModal';
import { soundManager } from '../../utils/audio';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import {
  X,
  Sparkles,
  Trophy,
  Calendar,
  BarChart3,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Target,
  Share2,
} from 'lucide-react';

interface ProgressionHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: WorkoutStats;
  history: WorkoutSession[];
  personalRecords: Record<string, PersonalRecord>;
  onStartRoutine: (routine: Routine) => void;
  onOpenExerciseDetails?: (exerciseId: string) => void;
  initialTab?: 'skills' | 'programs' | 'achievements' | 'reports';
}

export const ProgressionHubModal: React.FC<ProgressionHubModalProps> = ({
  isOpen,
  onClose,
  stats,
  history,
  personalRecords,
  onStartRoutine,
  onOpenExerciseDetails,
  initialTab = 'skills',
}) => {
  useBodyScrollLock(isOpen, onClose);

  const [activeTab, setActiveTab] = useState<'skills' | 'programs' | 'achievements' | 'reports'>(initialTab);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<SkillCategory | 'todas'>('todas');
  const [inspectingSkill, setInspectingSkill] = useState<SkillNode | null>(null);
  const [inspectingProgram, setInspectingProgram] = useState<StructuredProgram | null>(null);
  const [sharingAchievement, setSharingAchievement] = useState<Achievement | null>(null);
  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [skillZoom, setSkillZoom] = useState<number>(1);

  // Estados dinâmicos de gamificação
  const [skillsProgress, setSkillsProgress] = useState<Record<string, UserSkillProgress>>(() => getSkillProgressMap());
  const [programEnrollments, setProgramEnrollments] = useState<UserProgramEnrollment[]>(() => getProgramEnrollments());
  const [challenges, setChallenges] = useState<Challenge[]>(() =>
    getChallengesWithProgress(history, stats, personalRecords)
  );

  // Recalcular Perfil e Conquistas
  const gamificationProfile: UserGamificationProfile = useMemo(
    () => calculateUserGamificationProfile(history, stats, personalRecords),
    [history, stats, personalRecords, skillsProgress]
  );

  const achievementsList: Achievement[] = useMemo(
    () => evaluateAchievements(history, stats, personalRecords),
    [history, stats, personalRecords, skillsProgress, programEnrollments]
  );

  const evolutionReport: EvolutionReport = useMemo(
    () => generateEvolutionReport(history, stats, personalRecords, reportPeriod),
    [history, stats, personalRecords, reportPeriod]
  );

  const activeProgramEnrollment = useMemo(() => getActiveProgram(), [programEnrollments]);
  const activeProgramData = useMemo(
    () => (activeProgramEnrollment ? STRUCTURED_PROGRAMS.find(p => p.id === activeProgramEnrollment.programId) : null),
    [activeProgramEnrollment]
  );

  if (!isOpen) return null;

  // Filtragem de Skills por Categoria
  const filteredSkills = SKILL_TREE_NODES.filter(
    s => selectedSkillCategory === 'todas' || s.category === selectedSkillCategory
  );

  const handleUpdateSkillStatus = (skillId: string, status: any, stepIndex: number = 0) => {
    const updated = saveSkillProgress(skillId, status, stepIndex);
    setSkillsProgress({ ...updated });
    if (inspectingSkill && inspectingSkill.id === skillId) {
      setInspectingSkill({ ...inspectingSkill });
    }
  };

  const handleEnrollProgram = (programId: string) => {
    enrollInProgram(programId);
    setProgramEnrollments(getProgramEnrollments());
  };

  const handleCompleteProgramSession = (programId: string, sessionId: string) => {
    soundManager.triggerHaptic([35]);
    completeProgramSession(programId, sessionId);
    setProgramEnrollments(getProgramEnrollments());
  };

  const handleToggleJoinChallenge = (challengeId: string) => {
    soundManager.triggerHaptic([20]);
    const updated = toggleJoinChallenge(challengeId);
    setChallenges(updated);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="progression-hub-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-4xl glass-panel border border-white/10 rounded-3xl shadow-2xl flex flex-col h-[94dvh] max-h-[900px] overflow-hidden bg-slate-950/95">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 shrink-0 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  CalisteFlow 2.0 • Evolução & Gamificação
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Nível {gamificationProfile.level} • {gamificationProfile.totalXp} XP
                </span>
              </div>
              <h2 id="progression-hub-title" className="text-sm sm:text-base font-black text-slate-100 mt-0.5">
                Árvore de Habilidades, Programas & Conquistas
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar hub de progressão"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Main Tabs Navigation */}
        <div className="flex items-center gap-1 p-2 sm:px-5 border-b border-white/10 shrink-0 bg-slate-950/80 overflow-x-auto no-scrollbar">
          {[
            { id: 'skills', label: 'Árvore de Skills', icon: Sparkles, count: `${gamificationProfile.pillars.skills.masteredCount}/${SKILL_TREE_NODES.length}` },
            { id: 'programs', label: 'Programas & Desafios', icon: Calendar, badge: activeProgramEnrollment ? '1 Ativo' : undefined },
            { id: 'achievements', label: 'Níveis & Conquistas', icon: Trophy, count: `${achievementsList.filter(a => a.unlocked).length}/${achievementsList.length}` },
            { id: 'reports', label: 'Relatórios de Evolução', icon: BarChart3 },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundManager.triggerHaptic([15]);
                  setActiveTab(tab.id as any);
                }}
                className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md glow-emerald'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-slate-950/30 text-slate-950' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Árvore de Habilidades (Skill Tree 2.0) */}
        {activeTab === 'skills' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Category Filter Pills & Zoom Controls */}
            <div className="p-3 border-b border-white/5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0 bg-slate-900/40">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedSkillCategory('todas')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer active:scale-95 ${
                    selectedSkillCategory === 'todas'
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Todas ({SKILL_TREE_NODES.length})
                </button>
                {(Object.keys(SKILL_CATEGORIES_CONFIG) as SkillCategory[]).map(cat => {
                  const cfg = SKILL_CATEGORIES_CONFIG[cat];
                  const isCatSelected = selectedSkillCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        soundManager.triggerHaptic([15]);
                        setSelectedSkillCategory(cat);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                        isCatSelected
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{cfg.icon}</span>
                      <span>{cfg.label.split(' & ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Zoom Buttons */}
              <div className="flex items-center gap-1 shrink-0 pl-2 border-l border-white/10">
                <button
                  type="button"
                  onClick={() => setSkillZoom(z => Math.max(0.85, z - 0.1))}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  title="Diminuir Zoom"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSkillZoom(1)}
                  className="px-2 py-1 rounded-lg bg-white/5 text-[10px] font-mono text-slate-400 hover:text-white cursor-pointer"
                  title="Resetar Zoom"
                >
                  {Math.round(skillZoom * 100)}%
                </button>
                <button
                  type="button"
                  onClick={() => setSkillZoom(z => Math.min(1.25, z + 0.1))}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  title="Aumentar Zoom"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Grid / Interactive Skill Nodes */}
            <div
              className="flex-1 overflow-y-auto p-4 sm:p-6 transition-transform"
              style={{ transform: `scale(${skillZoom})`, transformOrigin: 'top left' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredSkills.map(skill => {
                  const prog = skillsProgress[skill.id];
                  const status = prog?.status || 'locked';
                  const isMastered = status === 'mastered';
                  const isInProgress = status === 'in_progress';

                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => {
                        soundManager.triggerHaptic([25]);
                        setInspectingSkill(skill);
                      }}
                      className={`p-4 rounded-3xl text-left border transition active:scale-98 flex flex-col justify-between space-y-3 cursor-pointer group shadow-lg ${
                        isMastered
                          ? 'bg-emerald-500/10 border-emerald-500/40 hover:border-emerald-500/60 shadow-emerald-950/20'
                          : isInProgress
                          ? 'bg-amber-500/10 border-amber-500/40 hover:border-amber-500/60 shadow-amber-950/20'
                          : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-105 transition shrink-0">
                          {skill.icon}
                        </div>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                            isMastered
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : isInProgress
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-white/5 text-slate-400 border-white/10'
                          }`}
                        >
                          {isMastered ? 'Dominado' : isInProgress ? 'Em Treino' : 'Bloqueado'}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase text-purple-400">
                            Tier {skill.tier}
                          </span>
                          <span className="text-[10px] text-slate-500">•</span>
                          <span className="text-[10px] text-slate-400">{skill.difficulty}</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-100 mt-0.5 group-hover:text-purple-300 transition">
                          {skill.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {skill.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{skill.progressionSteps.length} degraus de evolução</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-purple-400 transition" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Programas & Desafios */}
        {activeTab === 'programs' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Active Program Card */}
            {activeProgramData && activeProgramEnrollment && (
              <div className="glass-card rounded-3xl p-5 border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-slate-900/80 to-teal-500/15 shadow-xl space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center text-2xl font-black shrink-0 shadow-md">
                      {activeProgramData.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                        Programa em Andamento • Semana {activeProgramEnrollment.currentWeek} de {activeProgramData.durationWeeks}
                      </span>
                      <h3 className="text-base font-black text-slate-100">
                        {activeProgramData.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activeProgramEnrollment.completedSessionIds.length} sessões concluídas
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectingProgram(activeProgramData)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                  >
                    <span>Ver Ficha</span> <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (activeProgramEnrollment.completedSessionIds.length /
                            (activeProgramData.durationWeeks * activeProgramData.sessionsPerWeek)) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Catalog of Programs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-400" /> Programas Estruturados Disponíveis
                </h3>
                <span className="text-xs text-slate-500">{STRUCTURED_PROGRAMS.length} programas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {STRUCTURED_PROGRAMS.map(prog => (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => {
                      soundManager.triggerHaptic([25]);
                      setInspectingProgram(prog);
                    }}
                    className="p-4 sm:p-5 rounded-3xl glass-card border border-white/10 hover:border-cyan-500/40 text-left flex flex-col justify-between space-y-3 transition active:scale-98 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                        {prog.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {prog.durationWeeks} Semanas
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-100 group-hover:text-cyan-300 transition">
                        {prog.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {prog.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                      <span>{prog.sessionsPerWeek}x/semana • {prog.recommendedLevel}</span>
                      <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Challenges Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-amber-400" /> Desafios Periódicos
                </h3>
                <span className="text-xs text-slate-500">Com descanso ético garantido</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {challenges.map(ch => (
                  <div
                    key={ch.id}
                    className={`p-4 rounded-3xl border transition space-y-2.5 ${
                      ch.completed
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : ch.joined
                        ? 'bg-amber-500/5 border-amber-500/25'
                        : 'bg-white/[0.03] border-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            ch.type === 'daily'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : ch.type === 'weekly'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}
                        >
                          {ch.type === 'daily' ? 'Diário' : ch.type === 'weekly' ? 'Semanal' : 'Mensal'} • +{ch.rewardXp} XP
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-slate-100 mt-1">{ch.title}</h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleJoinChallenge(ch.id)}
                        className={`text-xs px-2.5 py-1 rounded-xl font-bold transition cursor-pointer active:scale-95 ${
                          ch.completed
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : ch.joined
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {ch.completed ? '✓ Concluído' : ch.joined ? 'Participando' : 'Participar'}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">{ch.description}</p>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Progresso: {ch.current} / {ch.target} {ch.unit}</span>
                        <span>{Math.min(100, Math.round((ch.current / ch.target) * 100))}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, (ch.current / ch.target) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 italic pt-0.5">{ch.restDaySafeNotice}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Níveis & Conquistas */}
        {activeTab === 'achievements' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Level & XP Hero Banner */}
            <div className="glass-card rounded-3xl p-5 border border-purple-500/30 bg-gradient-to-br from-purple-500/15 via-slate-900/80 to-indigo-500/15 shadow-xl space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-purple-950/40 shrink-0">
                    {gamificationProfile.level}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 block">
                      Nível de Maestria
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-100">
                      {gamificationProfile.levelTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {gamificationProfile.totalXp} XP acumulados
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-purple-300">
                    +{gamificationProfile.xpForNextLevel - gamificationProfile.xpInCurrentLevel} XP
                  </span>
                  <span className="text-[10px] text-slate-500 block">para o próximo nível</span>
                </div>
              </div>

              {/* Progress bar to next level */}
              <div className="space-y-1 pt-1">
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${gamificationProfile.progressToNextLevelPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Nível {gamificationProfile.level}</span>
                  <span>{gamificationProfile.progressToNextLevelPct}% concluído</span>
                  <span>Nível {gamificationProfile.level + 1}</span>
                </div>
              </div>
            </div>

            {/* 5 Pillars Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: 'Experiência', value: `${gamificationProfile.pillars.experience.totalWorkouts} treinos`, sub: `${gamificationProfile.pillars.experience.totalMinutes}m totais`, icon: '⚡' },
                { label: 'Força', value: `${gamificationProfile.pillars.strength.score}/100`, sub: gamificationProfile.pillars.strength.label, icon: '💪' },
                { label: 'Skills', value: `${gamificationProfile.pillars.skills.masteredCount} dominadas`, sub: `de ${gamificationProfile.pillars.skills.totalSkills} no catálogo`, icon: '🥋' },
                { label: 'Consistência', value: `${gamificationProfile.pillars.consistency.currentStreakDays}d streak`, sub: `${gamificationProfile.pillars.consistency.weeklyAdherencePct}% aderência`, icon: '📅' },
                { label: 'Recordes', value: `${gamificationProfile.pillars.records.totalPrs} PRs`, sub: 'marcas batidas', icon: '🏆' },
              ].map((p, idx) => (
                <div key={idx} className="p-3 rounded-2xl glass-card border border-white/5 space-y-1 text-center">
                  <span className="text-lg block">{p.icon}</span>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">{p.label}</span>
                  <span className="text-xs sm:text-sm font-black text-slate-100 block">{p.value}</span>
                  <span className="text-[9px] text-slate-500 block truncate">{p.sub}</span>
                </div>
              ))}
            </div>

            {/* Achievements Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" /> Quadro de Conquistas Baseadas em Ações Reais
                </h3>
                <span className="text-xs text-slate-500">
                  {achievementsList.filter(a => a.unlocked).length} de {achievementsList.length} conquistadas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievementsList.map(ach => (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-3xl border transition flex items-start justify-between gap-3 ${
                      ach.unlocked
                        ? 'bg-white/[0.04] border-emerald-500/30'
                        : 'bg-white/[0.01] border-white/5 opacity-70'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md ${
                          ach.unlocked
                            ? `bg-gradient-to-br ${ach.badgeColor} text-white shadow-emerald-950/20`
                            : 'bg-slate-800 text-slate-600'
                        }`}
                      >
                        {ach.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-100 truncate">{ach.title}</h4>
                          <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded">
                            +{ach.xpReward} XP
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{ach.description}</p>
                        <p className="text-[10px] text-slate-500 mt-1 italic">
                          Critério: {ach.criterionText}
                        </p>
                      </div>
                    </div>

                    {/* Action: Share Card button if unlocked */}
                    {ach.unlocked ? (
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.triggerHaptic([30]);
                          setSharingAchievement(ach);
                        }}
                        className="p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 hover:text-white transition cursor-pointer shrink-0"
                        title="Gerar Cartão Compartilhável"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="text-[10px] font-mono text-slate-600 shrink-0 mt-1">
                        {ach.progressPercent}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Relatórios de Evolução */}
        {activeTab === 'reports' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Period Selector (Weekly vs Monthly) */}
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-cyan-400" /> Relatório Periódico de Desempenho
              </h3>
              <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10">
                <button
                  type="button"
                  onClick={() => setReportPeriod('weekly')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    reportPeriod === 'weekly'
                      ? 'bg-cyan-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Últimos 7 dias
                </button>
                <button
                  type="button"
                  onClick={() => setReportPeriod('monthly')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    reportPeriod === 'monthly'
                      ? 'bg-cyan-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Últimos 30 dias
                </button>
              </div>
            </div>

            {/* Highlight Banner */}
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
              <p className="text-xs sm:text-sm text-cyan-200 font-semibold leading-relaxed">
                {evolutionReport.highlightMessage}
              </p>
            </div>

            {/* Quick Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3.5 rounded-2xl glass-card border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Treinos Feitos</span>
                <div className="text-xl sm:text-2xl font-black text-slate-100 font-mono">
                  {evolutionReport.completedWorkoutsCount}
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {evolutionReport.adherencePercentage}% aderência à meta
                </span>
              </div>

              <div className="p-3.5 rounded-2xl glass-card border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Tempo sob Tensão</span>
                <div className="text-xl sm:text-2xl font-black text-slate-100 font-mono">
                  {evolutionReport.totalTrainingMinutes} min
                </div>
                <span className="text-[10px] text-slate-500">tempo total ativo</span>
              </div>

              <div className="p-3.5 rounded-2xl glass-card border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">PRs Superados</span>
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  {evolutionReport.prsBrokenCount}
                </div>
                <span className="text-[10px] text-slate-500">marcas batidas</span>
              </div>

              <div className="p-3.5 rounded-2xl glass-card border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Skills Avançadas</span>
                <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono">
                  {evolutionReport.skillsProgressedCount}
                </div>
                <span className="text-[10px] text-slate-500">em treino ou dominadas</span>
              </div>
            </div>

            {/* Muscle Volume Breakdown SVG Bar Chart */}
            <div className="p-4 sm:p-5 rounded-3xl glass-card border border-white/10 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Distribuição de Séries por Grupo Muscular ({reportPeriod === 'weekly' ? 'Semanal' : 'Mensal'})
              </h4>

              <div className="space-y-2">
                {[
                  { label: 'Peitoral & Tríceps (Empurrar)', value: evolutionReport.muscleVolumeSummary.peito + evolutionReport.muscleVolumeSummary.triceps, color: '#f59e0b' },
                  { label: 'Dorsais & Bíceps (Puxar)', value: evolutionReport.muscleVolumeSummary.costas + evolutionReport.muscleVolumeSummary.biceps, color: '#06b6d4' },
                  { label: 'Ombros & Deltoides', value: evolutionReport.muscleVolumeSummary.ombros, color: '#8b5cf6' },
                  { label: 'Core & Abdômen', value: evolutionReport.muscleVolumeSummary.abdomen, color: '#10b981' },
                  { label: 'Pernas & Glúteos', value: evolutionReport.muscleVolumeSummary.quadriceps + evolutionReport.muscleVolumeSummary.gluteos, color: '#ec4899' },
                ].map((item, idx) => {
                  const maxVal = Math.max(1, ...Object.values(evolutionReport.muscleVolumeSummary));
                  const pct = Math.min(100, Math.round((item.value / maxVal) * 100));
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-300">{item.label}</span>
                        <span className="font-mono text-slate-400 font-bold">{item.value} séries</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PRs Broken in Period */}
            {evolutionReport.prsList.length > 0 && (
              <div className="p-4 rounded-3xl glass-card border border-amber-500/20 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" /> Recordes Pessoais Conquistados no Período
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {evolutionReport.prsList.map((pr, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{pr.exerciseName}</span>
                      <span className="font-mono font-black text-amber-400">{pr.valueText}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sub-Modals */}
      {inspectingSkill && (
        <SkillDetailModal
          skill={inspectingSkill}
          userProgress={skillsProgress[inspectingSkill.id]}
          allSkillsProgress={skillsProgress}
          onClose={() => setInspectingSkill(null)}
          onUpdateStatus={handleUpdateSkillStatus}
          onOpenExercise={onOpenExerciseDetails}
        />
      )}

      {inspectingProgram && (
        <ProgramDetailModal
          program={inspectingProgram}
          enrollment={programEnrollments.find(p => p.programId === inspectingProgram.id)}
          onClose={() => setInspectingProgram(null)}
          onEnroll={handleEnrollProgram}
          onCompleteSession={handleCompleteProgramSession}
          onPause={id => {
            pauseProgram(id);
            setProgramEnrollments(getProgramEnrollments());
          }}
          onResume={id => {
            resumeProgram(id);
            setProgramEnrollments(getProgramEnrollments());
          }}
          onAbandon={id => {
            abandonProgram(id);
            setProgramEnrollments(getProgramEnrollments());
          }}
          onRestart={id => {
            restartProgram(id);
            setProgramEnrollments(getProgramEnrollments());
          }}
          onStartSessionWorkout={(routine) => {
            setInspectingProgram(null);
            onClose();
            onStartRoutine(routine);
          }}
        />
      )}

      {sharingAchievement && (
        <ShareableCardModal
          achievement={sharingAchievement}
          onClose={() => setSharingAchievement(null)}
        />
      )}
    </div>
  );
};

