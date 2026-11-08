import { useState, useEffect, useCallback } from 'react';
import type { Routine, WorkoutSession, WorkoutStats, WeeklyPlan, ActiveWorkoutBackup } from './types';
import {
  getStoredRoutines,
  saveSingleRoutine,
  deleteRoutineById,
  resetToDefaultRoutines,
  getWorkoutHistory,
  saveWorkoutSession,
  deleteWorkoutSession,
  calculateStats,
  getStoredWeeklyPlan,
  saveWeeklyPlan,
  getActiveWorkoutBackup,
  clearActiveWorkoutBackup,
} from './utils/storage';
import { trackEvent } from './utils/analytics';
import { HomeView } from './components/home/HomeView';
import { RoutineListView } from './components/routines/RoutineListView';
import { RoutineDetailModal } from './components/routines/RoutineDetailModal';
import { RoutineEditorModal } from './components/routines/RoutineEditorModal';
import { WorkoutPlayer } from './components/workout/WorkoutPlayer';
import { WorkoutSummaryModal } from './components/workout/WorkoutSummaryModal';
import { ExerciseLibraryView } from './components/exercises/ExerciseLibraryView';
import { HistoryView } from './components/history/HistoryView';
import { WeeklyPlannerView } from './components/planner/WeeklyPlannerView';
import { OnboardingModal } from './components/planner/OnboardingModal';
import { HealthDisclaimerModal } from './components/safety/HealthDisclaimerModal';
import { SafeExecutionModal } from './components/safety/SafeExecutionModal';
import { FeedbackModal } from './components/retention/FeedbackModal';
import { ChangelogFaqModal } from './components/retention/ChangelogFaqModal';
import { UpdatePromptBanner } from './components/pwa/UpdatePromptBanner';
import { StorageRobustnessBanner } from './components/pwa/StorageRobustnessBanner';
import { BottomNav, type NavTab } from './components/layout/BottomNav';
import { soundManager } from './utils/audio';
import { requestPersistentStorage } from './utils/platform';
import { Flame, ShieldCheck } from 'lucide-react';
import logoHeaderImg from './assets/img/logo-header-256.png';

export function App() {
  // App Navigation — default to 'home'
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Persistence State
  const [routines, setRoutines] = useState<Routine[]>(() => getStoredRoutines());
  const [history, setHistory] = useState<WorkoutSession[]>(() => getWorkoutHistory());
  const [stats, setStats] = useState<WorkoutStats>(() => calculateStats(getWorkoutHistory()));
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(() => getStoredWeeklyPlan());
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      const hasProfile = localStorage.getItem('calistheflow_user_profile_v1');
      const hasDismissed = localStorage.getItem('calistheflow_onboarding_dismissed');
      return !hasProfile && !hasDismissed;
    } catch {
      return false;
    }
  });

  // Health and safety disclaimer state (first run)
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('calistheflow_health_disclaimer_accepted_v1');
    } catch {
      return false;
    }
  });

  // Safe Execution & CREF Biomechanics Modal
  const [isSafeExecutionOpen, setIsSafeExecutionOpen] = useState<boolean>(false);

  const handleAcceptDisclaimer = () => {
    try {
      localStorage.setItem('calistheflow_health_disclaimer_accepted_v1', 'true');
    } catch {
      // ignore quota
    }
    setIsDisclaimerOpen(false);
  };

  const handleSelectAudienceProgram = (audienceProgramId: string) => {
    const routine = routines.find(r => r.id === audienceProgramId);
    if (routine) {
      setDetailRoutine(routine);
    } else {
      setActiveTab('routines');
    }
  };

  // Record-beat micro-interaction state (used in handleSaveSummarySession)
  const triggerRecordVibrate = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([80, 40, 80]);
    }
    soundManager.playSuccessChime();
  }, []);

  // Active Workout Player State & Crash Recovery
  const [activeWorkoutRoutine, setActiveWorkoutRoutine] = useState<Routine | null>(null);
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState<boolean>(false);
  const [activeBackup, setActiveBackup] = useState<ActiveWorkoutBackup | null>(() => getActiveWorkoutBackup());

  // Additional modals (Feedback & FAQ)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false);

  useEffect(() => {
    trackEvent('app_opened');
    requestPersistentStorage();
  }, []);

  const handleResumeActiveBackup = () => {
    if (!activeBackup) return;
    soundManager.unlockAudio();
    const routine = routines.find(r => r.id === activeBackup.routine.id) || activeBackup.routine;
    setActiveWorkoutRoutine(routine);
    setIsPlayerFullscreen(true);
  };

  const handleDismissActiveBackup = () => {
    clearActiveWorkoutBackup();
    setActiveBackup(null);
  };

  // Modals
  const [detailRoutine, setDetailRoutine] = useState<Routine | null>(null);
  const [routineToEdit, setRoutineToEdit] = useState<Routine | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [summarySession, setSummarySession] = useState<WorkoutSession | null>(null);
  const [inspectExerciseId, setInspectExerciseId] = useState<string | null>(null);

  // Keep stats in sync whenever history updates
  useEffect(() => {
    setStats(calculateStats(history));
  }, [history]);

  // Routine Handlers
  const handleStartRoutine = (routine: Routine) => {
    soundManager.unlockAudio();
    setActiveWorkoutRoutine(routine);
    setIsPlayerFullscreen(true);
    setDetailRoutine(null);
  };

  const handleCreateNewRoutine = () => {
    setRoutineToEdit(null);
    setIsEditorOpen(true);
  };

  const handleEditRoutine = (routine: Routine) => {
    setRoutineToEdit(routine);
    setIsEditorOpen(true);
  };

  const handleDuplicateRoutine = (routine: Routine) => {
    const duplicated: Routine = {
      ...routine,
      id: `custom-copy-${Date.now()}`,
      title: `${routine.title} (Cópia)`,
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = saveSingleRoutine(duplicated);
    setRoutines(updated);
  };

  const handleDeleteRoutine = (id: string) => {
    const updated = deleteRoutineById(id);
    setRoutines(updated);
  };

  const handleSaveRoutine = (routine: Routine) => {
    const updated = saveSingleRoutine(routine);
    setRoutines(updated);
  };

  const handleResetDefaults = () => {
    const defaults = resetToDefaultRoutines();
    setRoutines(defaults);
  };

  // Weekly Planner Handlers
  const handleUpdateWeeklyPlan = (updated: WeeklyPlan) => {
    setWeeklyPlan(updated);
    saveWeeklyPlan(updated);
  };

  // Workout Completion & Summary Handlers
  const handleWorkoutFinished = (session: WorkoutSession) => {
    setIsPlayerFullscreen(false);
    setActiveWorkoutRoutine(null);
    setActiveBackup(null);
    setSummarySession(session);
  };

  const handleExitWorkout = () => {
    setIsPlayerFullscreen(false);
    setActiveWorkoutRoutine(null);
    setActiveBackup(null);
  };

  const handleSaveSummarySession = (finalSession: WorkoutSession) => {
    const updatedHistory = saveWorkoutSession(finalSession);
    setHistory(updatedHistory);
    setSummarySession(null);
    // Vibrate + chime to celebrate
    triggerRecordVibrate();
    setActiveTab('home');
  };

  const handleDeleteHistorySession = (sessionId: string) => {
    const updated = deleteWorkoutSession(sessionId);
    setHistory(updated);
  };

  const handleImportBackup = (importedHistory: WorkoutSession[]) => {
    localStorage.setItem('calistheflow_history_v1', JSON.stringify(importedHistory));
    setHistory(importedHistory);
  };

  const handleInspectExerciseFromRoutine = (exerciseId: string) => {
    setDetailRoutine(null);
    setInspectExerciseId(exerciseId);
    setActiveTab('exercises');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#020412]/95 border-b border-white/[0.08] px-4 py-3 sm:px-6 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Logo Brand Link */}
          <a
            href="/calisteflow/"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                setActiveTab('routines');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group active:scale-95 transition"
            aria-label="CalisteFlow"
          >
            <img
              src={logoHeaderImg}
              alt="CalisteFlow"
              width="40"
              height="40"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-contain shadow-md shadow-cyan-500/15 group-hover:scale-105 transition-transform duration-200"
              loading="eager"
            />
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-100 flex items-center gap-1.5">
                Caliste<span className="text-cyan-400">Flow</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5 font-medium">
                Rotinas de Calistenia & Postura
              </span>
            </div>
          </a>

          {/* Header Quick Status */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSafeExecutionOpen(true)}
              className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-2xl border border-emerald-500/30 transition active:scale-95 glow-emerald"
              title="Guia de Execução Segura & Biomecânica"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline font-bold">Segurança</span>
            </button>

            {stats.currentStreakDays > 0 && (
              <div
                onClick={() => setActiveTab('history')}
                className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-2xl text-amber-300 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition active:scale-95 glow-amber"
                title={`${stats.currentStreakDays} dias de streak`}
              >
                <Flame className="w-4 h-4 fill-current text-amber-400 animate-bounce" />
                <span>{stats.currentStreakDays} {stats.currentStreakDays === 1 ? 'dia' : 'dias'}</span>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-300 bg-white/[0.04] px-3 py-1.5 rounded-2xl border border-white/[0.06]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 glow-emerald animate-pulse" />
              <span>Offline & Local</span>
            </div>
          </div>
        </div>
      </header>

      {/* PWA Update Banner - Protegido contra recarga em treino ativo */}
      <UpdatePromptBanner isWorkoutActive={Boolean(activeWorkoutRoutine || isPlayerFullscreen)} />

      {/* Safari 7-Day Inactivity & Proactive Storage Banner */}
      <StorageRobustnessBanner workoutCount={history.length} />

      {/* Crash Recovery Notification Banner */}
      {activeBackup && !isPlayerFullscreen && (
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-b border-amber-500/30 px-4 py-2.5 backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
              <span className="text-xs text-amber-200 font-bold">
                Treino interrompido detectado ({Math.max(1, Math.round((Date.now() - activeBackup.timestamp) / 60000))} min atrás):{' '}
                <strong className="text-white">{activeBackup.routine.title}</strong> (Ex. {activeBackup.exerciseIndex + 1}, Série {activeBackup.setIndex + 1})
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleResumeActiveBackup}
                className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition active:scale-95 shadow-md shadow-amber-500/20"
              >
                Retomar Treino
              </button>
              <button
                onClick={handleDismissActiveBackup}
                className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 font-semibold text-xs transition"
              >
                Descartar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Content View */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6">
        {activeTab === 'home' && (
          <HomeView
            stats={stats}
            history={history}
            weeklyPlan={weeklyPlan}
            routines={routines}
            onStartRoutine={handleStartRoutine}
            onNavigateTo={tab => setActiveTab(tab)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onOpenSafeExecution={() => setIsSafeExecutionOpen(true)}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
            onOpenFaq={() => setIsFaqOpen(true)}
          />
        )}

        {activeTab === 'routines' && (
          <RoutineListView
            routines={routines}
            onStartRoutine={handleStartRoutine}
            onEditRoutine={handleEditRoutine}
            onDuplicateRoutine={handleDuplicateRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onViewDetails={routine => setDetailRoutine(routine)}
            onCreateNewRoutine={handleCreateNewRoutine}
            onResetDefaults={handleResetDefaults}
          />
        )}

        {activeTab === 'planner' && (
          <WeeklyPlannerView
            plan={weeklyPlan}
            onUpdatePlan={handleUpdateWeeklyPlan}
            onStartScheduledWorkout={handleStartRoutine}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}

        {activeTab === 'exercises' && (
          <ExerciseLibraryView initialExerciseId={inspectExerciseId} />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            stats={stats}
            onDeleteSession={handleDeleteHistorySession}
            onNavigateToRoutines={() => setActiveTab('routines')}
            onImportBackup={handleImportBackup}
          />
        )}
      </main>

      {/* Active Workout Fullscreen Mode */}
      {activeWorkoutRoutine && isPlayerFullscreen && (
        <WorkoutPlayer
          routine={activeWorkoutRoutine}
          onFinishWorkout={handleWorkoutFinished}
          onExitWorkout={handleExitWorkout}
          initialBackup={activeBackup}
        />
      )}

      {/* Routine Detail Modal */}
      <RoutineDetailModal
        routine={detailRoutine}
        onClose={() => setDetailRoutine(null)}
        onStart={handleStartRoutine}
        onSelectExerciseToInspect={handleInspectExerciseFromRoutine}
      />

      {/* Routine Editor Modal (Create or Edit) */}
      <RoutineEditorModal
        isOpen={isEditorOpen}
        routineToEdit={routineToEdit}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveRoutine}
      />

      {/* Workout Finished Celebration & Summary Modal */}
      {summarySession && (
        <WorkoutSummaryModal
          session={summarySession}
          onSaveAndClose={handleSaveSummarySession}
        />
      )}

      {/* Onboarding Wizard Modal */}
      {isOnboardingOpen && (
        <OnboardingModal
          onComplete={generated => {
            handleUpdateWeeklyPlan(generated);
            localStorage.setItem('calistheflow_onboarding_dismissed', 'true');
            setIsOnboardingOpen(false);
            setActiveTab('planner');
          }}
          onSkip={() => {
            localStorage.setItem('calistheflow_onboarding_dismissed', 'true');
            setIsOnboardingOpen(false);
          }}
        />
      )}

      {/* Health & Safety Disclaimer Modal (First Run) */}
      <HealthDisclaimerModal
        isOpen={isDisclaimerOpen}
        onAccept={handleAcceptDisclaimer}
      />

      {/* Safe Execution & CREF Biomechanics Guide Modal */}
      <SafeExecutionModal
        isOpen={isSafeExecutionOpen}
        onClose={() => setIsSafeExecutionOpen(false)}
        onSelectAudienceProgram={handleSelectAudienceProgram}
      />

      {/* Anonymous Feedback & Error Reporter Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Changelog & Interactive FAQ Modal */}
      <ChangelogFaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
      />

      {/* Mobile-First Bottom Dock Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={tab => {
          setActiveTab(tab);
          if (tab !== 'exercises') setInspectExerciseId(null);
        }}
        activeWorkoutRoutineTitle={activeWorkoutRoutine ? activeWorkoutRoutine.title : null}
        onResumeWorkout={() => setIsPlayerFullscreen(true)}
      />
    </div>
  );
}

export default App;
