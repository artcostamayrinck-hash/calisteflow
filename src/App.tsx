import { useState, useEffect } from 'react';
import type { Routine, WorkoutSession, WorkoutStats } from './types';
import {
  getStoredRoutines,
  saveSingleRoutine,
  deleteRoutineById,
  resetToDefaultRoutines,
  getWorkoutHistory,
  saveWorkoutSession,
  deleteWorkoutSession,
  calculateStats,
} from './utils/storage';
import { RoutineListView } from './components/routines/RoutineListView';
import { RoutineDetailModal } from './components/routines/RoutineDetailModal';
import { RoutineEditorModal } from './components/routines/RoutineEditorModal';
import { WorkoutPlayer } from './components/workout/WorkoutPlayer';
import { WorkoutSummaryModal } from './components/workout/WorkoutSummaryModal';
import { ExerciseLibraryView } from './components/exercises/ExerciseLibraryView';
import { HistoryView } from './components/history/HistoryView';
import { BottomNav, type NavTab } from './components/layout/BottomNav';
import { Dumbbell, ShieldCheck, Flame } from 'lucide-react';

export function App() {
  // App Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('routines');

  // Persistence State
  const [routines, setRoutines] = useState<Routine[]>(() => getStoredRoutines());
  const [history, setHistory] = useState<WorkoutSession[]>(() => getWorkoutHistory());
  const [stats, setStats] = useState<WorkoutStats>(() => calculateStats(getWorkoutHistory()));

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
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-900/90 px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div
            onClick={() => setActiveTab('routines')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-100 flex items-center gap-1.5">
                CalisteFlow
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                Rotinas de Calistenia & Postura
              </span>
            </div>
          </div>

          {/* Header Quick Status */}
          <div className="flex items-center gap-3">
            {stats.currentStreakDays > 0 && (
              <div
                onClick={() => setActiveTab('history')}
                className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl text-amber-300 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition"
                title={`${stats.currentStreakDays} dias de streak`}
              >
                <Flame className="w-4 h-4 fill-current text-amber-400" />
                <span>{stats.currentStreakDays} {stats.currentStreakDays === 1 ? 'dia' : 'dias'}</span>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Armazenamento Local Ativo</span>
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
