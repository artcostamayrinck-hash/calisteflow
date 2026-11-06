import { useState, useEffect } from 'react';
import type { Routine, WorkoutSession, WorkoutStats, WeeklyPlan } from './types';
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
} from './utils/storage';
import { RoutineListView } from './components/routines/RoutineListView';
import { RoutineDetailModal } from './components/routines/RoutineDetailModal';
import { RoutineEditorModal } from './components/routines/RoutineEditorModal';
import { WorkoutPlayer } from './components/workout/WorkoutPlayer';
import { WorkoutSummaryModal } from './components/workout/WorkoutSummaryModal';
import { ExerciseLibraryView } from './components/exercises/ExerciseLibraryView';
import { HistoryView } from './components/history/HistoryView';
import { WeeklyPlannerView } from './components/planner/WeeklyPlannerView';
import { OnboardingModal } from './components/planner/OnboardingModal';
import { BottomNav, type NavTab } from './components/layout/BottomNav';
import { Dumbbell, Flame } from 'lucide-react';

export function App() {
  // App Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('routines');

  // Persistence State
  const [routines, setRoutines] = useState<Routine[]>(() => getStoredRoutines());
  const [history, setHistory] = useState<WorkoutSession[]>(() => getWorkoutHistory());
  const [stats, setStats] = useState<WorkoutStats>(() => calculateStats(getWorkoutHistory()));
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(() => getStoredWeeklyPlan());
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Active Workout Player State
  const [activeWorkoutRoutine, setActiveWorkoutRoutine] = useState<Routine | null>(null);
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState<boolean>(false);

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
    setSummarySession(session);
  };

  const handleExitWorkout = () => {
    setIsPlayerFullscreen(false);
    setActiveWorkoutRoutine(null);
  };

  const handleSaveSummarySession = (finalSession: WorkoutSession) => {
    const updatedHistory = saveWorkoutSession(finalSession);
    setHistory(updatedHistory);
    setSummarySession(null);
    setActiveTab('history');
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
      <header className="sticky top-0 z-30 glass-panel border-b border-white/[0.08] px-4 py-3 sm:px-6 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div
            onClick={() => setActiveTab('routines')}
            className="flex items-center gap-2.5 cursor-pointer group active:scale-98 transition"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/25 group-hover:scale-105 transition glow-emerald">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-100 flex items-center gap-1.5">
                CalisteFlow
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5 font-medium">
                Rotinas de Calistenia & Postura
              </span>
            </div>
          </div>

          {/* Header Quick Status */}
          <div className="flex items-center gap-2.5">
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

      {/* Main Tab Content View */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6">
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
            setIsOnboardingOpen(false);
          }}
          onSkip={() => setIsOnboardingOpen(false)}
        />
      )}

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
