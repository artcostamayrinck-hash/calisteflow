import { useState, useEffect } from 'react';
import type { Routine, WorkoutSession, WorkoutExerciseRecord, MuscleGroup } from '../../types';
import { EXERCISES_DATABASE } from '../../data/exercisesData';
import { soundManager } from '../../utils/audio';
import { ExercisePostureVisual } from '../visuals/ExercisePostureVisual';
import { MuscleMap } from '../visuals/MuscleMap';
import { CadenceMetronome } from './CadenceMetronome';
import {
  Play,
  Pause,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Volume2,
  VolumeX,
  X,
  RotateCcw,
  Plus,
  Minus,
  HelpCircle,
  Flame,
} from 'lucide-react';

interface WorkoutPlayerProps {
  routine: Routine;
  onFinishWorkout: (session: WorkoutSession) => void;
  onExitWorkout: () => void;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  routine,
  onFinishWorkout,
  onExitWorkout,
}) => {
  // Navigation & Step State
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const [setIndex, setSetIndex] = useState<number>(0);
  const [phase, setPhase] = useState<'exercise' | 'rest'>('exercise');

  // Timers
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState<number>(0);
  const [isWorkoutPaused, setIsWorkoutPaused] = useState<boolean>(false);

  // Rest Timer State
  const [restSecondsLeft, setRestSecondsLeft] = useState<number>(60);
  const [restInitialSeconds, setRestInitialSeconds] = useState<number>(60);

  // Isometric Exercise Timer State
  const [isometricTimerRunning, setIsometricTimerRunning] = useState<boolean>(false);
  const [isometricSecondsLeft, setIsometricSecondsLeft] = useState<number>(30);
  const [isometricInitialSeconds, setIsometricInitialSeconds] = useState<number>(30);

  // Current set reps adjustment
  const [currentReps, setCurrentReps] = useState<number>(10);

  // Audio / Sound toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Posture modal drawer
  const [showPostureDrawer, setShowPostureDrawer] = useState<boolean>(false);

  // Confirm exit dialog
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Completed records tracking
  const [sessionStartTime] = useState<string>(new Date().toISOString());
  const [completedRecords, setCompletedRecords] = useState<WorkoutExerciseRecord[]>(() =>
    routine.exercises.map(re => {
      const ex = EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
      return {
        exerciseId: re.exerciseId,
        exerciseName: ex ? ex.name : re.exerciseId,
        completed: false,
        sets: Array.from({ length: re.sets }, (_, i) => ({
          setNumber: i + 1,
          completed: false,
          completedReps: re.targetReps || 0,
          completedSeconds: re.targetHoldSeconds || 0,
        })),
      };
    })
  );

  const currentRoutineExercise = routine.exercises[exerciseIndex];
  const currentExerciseData = EXERCISES_DATABASE.find(e => e.id === currentRoutineExercise.exerciseId);
  const isIsometric = currentExerciseData?.type === 'isometric';

  // Request Screen Wake Lock (keep display awake during gym sessions)
  useEffect(() => {
    let wakeLock: any = null;
    if ('wakeLock' in navigator) {
      (navigator as any).wakeLock?.request('screen').then((lock: any) => {
        wakeLock = lock;
      }).catch(() => {});
    }
    return () => {
      wakeLock?.release?.().catch(() => {});
    };
  }, []);

  // Sync state when exercise changes
  useEffect(() => {
    if (!currentRoutineExercise) return;
    if (isIsometric) {
      const targetSec = currentRoutineExercise.targetHoldSeconds || 30;
      setIsometricSecondsLeft(targetSec);
      setIsometricInitialSeconds(targetSec);
      setIsometricTimerRunning(false);
    } else {
      setCurrentReps(currentRoutineExercise.targetReps || 10);
    }
    setPhase('exercise');
  }, [exerciseIndex, setIndex]);

  // Overall Workout Elapsed Timer
  useEffect(() => {
    if (isWorkoutPaused) return;
    const interval = setInterval(() => {
      setTotalElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWorkoutPaused]);

  // Rest Countdown Timer
  useEffect(() => {
    if (phase !== 'rest' || isWorkoutPaused) return;

    if (restSecondsLeft <= 0) {
      // Rest finished!
      soundManager.playSuccessChime();
      advanceToNextSetOrExercise();
      return;
    }

    if (restSecondsLeft <= 3 && restSecondsLeft > 0) {
      soundManager.playCountdownBeep();
    }

    const timer = setInterval(() => {
      setRestSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, restSecondsLeft, isWorkoutPaused]);

  // Isometric Exercise Countdown / Stopwatch
  useEffect(() => {
    if (phase !== 'exercise' || !isometricTimerRunning || isWorkoutPaused) return;

    if (isometricSecondsLeft <= 0) {
      soundManager.playSuccessChime();
      setIsometricTimerRunning(false);
      handleCompleteIsometricSet();
      return;
    }

    if (isometricSecondsLeft <= 3 && isometricSecondsLeft > 0) {
      soundManager.playCountdownBeep();
    }

    const timer = setInterval(() => {
      setIsometricSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isometricTimerRunning, isometricSecondsLeft, isWorkoutPaused]);

  // Advance to next set or exercise after rest
  const advanceToNextSetOrExercise = () => {
    if (setIndex < currentRoutineExercise.sets - 1) {
      // Next set in current exercise
      setSetIndex(prev => prev + 1);
      setPhase('exercise');
    } else if (exerciseIndex < routine.exercises.length - 1) {
      // Next exercise
      setExerciseIndex(prev => prev + 1);
      setSetIndex(0);
      setPhase('exercise');
    } else {
      // All exercises finished!
      handleTriggerFinish();
    }
  };

  // Complete Reps Set
  const handleCompleteRepsSet = () => {
    // Record set
    recordCurrentSet(currentReps, undefined);

    // Check if this was the last set of the last exercise
    const isLastSet = setIndex >= currentRoutineExercise.sets - 1;
    const isLastExercise = exerciseIndex >= routine.exercises.length - 1;

    if (isLastSet && isLastExercise) {
      soundManager.playSuccessChime();
      handleTriggerFinish();
      return;
    }

    // Trigger Rest Period
    const restTime = currentRoutineExercise.restSeconds || 60;
    setRestInitialSeconds(restTime);
    setRestSecondsLeft(restTime);
    setPhase('rest');
    soundManager.playCountdownBeep();
  };

  // Complete Isometric Set
  const handleCompleteIsometricSet = () => {
    const elapsedOrCompleted = isometricInitialSeconds - Math.max(0, isometricSecondsLeft);
    recordCurrentSet(undefined, elapsedOrCompleted || isometricInitialSeconds);

    const isLastSet = setIndex >= currentRoutineExercise.sets - 1;
    const isLastExercise = exerciseIndex >= routine.exercises.length - 1;

    if (isLastSet && isLastExercise) {
      soundManager.playSuccessChime();
      handleTriggerFinish();
      return;
    }

    const restTime = currentRoutineExercise.restSeconds || 60;
    setRestInitialSeconds(restTime);
    setRestSecondsLeft(restTime);
    setPhase('rest');
  };

  const recordCurrentSet = (reps?: number, seconds?: number) => {
    setCompletedRecords(prev => {
      const copy = [...prev];
      if (copy[exerciseIndex] && copy[exerciseIndex].sets[setIndex]) {
        copy[exerciseIndex].sets[setIndex] = {
          setNumber: setIndex + 1,
          completed: true,
          completedReps: reps,
          completedSeconds: seconds,
        };
        const allSetsCompleted = copy[exerciseIndex].sets.every(s => s.completed);
        copy[exerciseIndex].completed = allSetsCompleted;
      }
      return copy;
    });
  };

  const handleSkipRest = () => {
    advanceToNextSetOrExercise();
  };

  const handleAdjustRest = (deltaSeconds: number) => {
    setRestSecondsLeft(prev => Math.max(5, prev + deltaSeconds));
  };

  const handleTriggerFinish = () => {
    let totalSetsDone = 0;
    let totalRepsDone = 0;
    let totalIsoSecDone = 0;

    completedRecords.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed) {
          totalSetsDone++;
          if (s.completedReps) totalRepsDone += s.completedReps;
          if (s.completedSeconds) totalIsoSecDone += s.completedSeconds;
        }
      });
    });

    // Aggregate unique muscles worked
    const musclesWorked = Array.from(
      new Set(
        routine.exercises.flatMap(re => {
          const ex = EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
          return ex ? [...ex.primaryMuscles, ...ex.secondaryMuscles] : [];
        })
      )
    ) as MuscleGroup[];

    const session: WorkoutSession = {
      id: `workout-${Date.now()}`,
      routineId: routine.id,
      routineTitle: routine.title,
      startTime: sessionStartTime,
      endTime: new Date().toISOString(),
      durationSeconds: totalElapsedSeconds,
      exercises: completedRecords,
      totalSetsCompleted: totalSetsDone || 1,
      totalRepsCompleted: totalRepsDone,
      totalIsometricSeconds: totalIsoSecDone,
      musclesWorked,
    };

    onFinishWorkout(session);
  };

  const toggleSound = () => {
    soundManager.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  const formatMmSs = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress calculations
  const totalWorkoutSets = routine.exercises.reduce((acc, curr) => acc + curr.sets, 0);
  const completedSetsCount = completedRecords.reduce(
    (acc, curr) => acc + curr.sets.filter(s => s.completed).length,
    0
  );
  const progressPercent = Math.min(100, Math.round((completedSetsCount / totalWorkoutSets) * 100));

  // Rest radial progress ring calculations
  const restCircumference = 2 * Math.PI * 80;
  const restStrokeDashoffset = restCircumference - (restSecondsLeft / (restInitialSeconds || 1)) * restCircumference;

  // Next up preview
  const nextIsSameExercise = setIndex < currentRoutineExercise.sets - 1;
  const nextExerciseData = nextIsSameExercise
    ? currentExerciseData
    : EXERCISES_DATABASE.find(e => e.id === routine.exercises[exerciseIndex + 1]?.exerciseId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Top HUD Bar */}
      <div className="p-3 sm:p-4 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
        {/* Workout elapsed timer & Pause */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWorkoutPaused(!isWorkoutPaused)}
            className={`p-2 rounded-xl border transition ${
              isWorkoutPaused
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title={isWorkoutPaused ? 'Retomar treino' : 'Pausar treino'}
          >
            {isWorkoutPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatMmSs(totalElapsedSeconds)}</span>
              {isWorkoutPaused && (
                <span className="text-[10px] uppercase font-sans px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">
                  Pausado
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-[150px] sm:max-w-xs font-medium">
              {routine.title}
            </div>
          </div>
        </div>

        {/* Right HUD Controls: Sound & Exit */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition ${
              soundEnabled
                ? 'bg-slate-800 text-emerald-400 border-slate-700'
                : 'bg-slate-800/60 text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'Silenciar bipes' : 'Ativar bipes de áudio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 border border-slate-700 transition"
            title="Encerrar ou Sair do Treino"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar under HUD */}
      <div className="w-full bg-slate-900 h-1.5 shrink-0 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Active Training Stage */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center max-w-xl mx-auto w-full">
        {phase === 'exercise' ? (
          /* ================= PHASE 1: EXECUTING SET ================= */
          <div className="w-full flex flex-col items-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Exercise Header & Posture Trigger */}
            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Exercício {exerciseIndex + 1} de {routine.exercises.length}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300">
                    {currentExerciseData?.difficulty}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                  {currentExerciseData ? currentExerciseData.name : currentRoutineExercise.exerciseId}
                </h2>
                {currentRoutineExercise.notes && (
                  <p className="text-xs text-amber-300/90 mt-1 italic">
                    💡 {currentRoutineExercise.notes}
                  </p>
                )}
              </div>

              {/* View Posture Guide Button */}
              {currentExerciseData && (
                <button
                  onClick={() => setShowPostureDrawer(true)}
                  className="px-3 py-2 rounded-2xl bg-slate-800 text-emerald-400 hover:bg-slate-700 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shrink-0"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Postura</span>
                </button>
              )}
            </div>

            {/* Set Progression Pills */}
            <div className="flex items-center gap-2">
              {Array.from({ length: currentRoutineExercise.sets }).map((_, idx) => {
                const isCompleted = completedRecords[exerciseIndex]?.sets[idx]?.completed;
                const isCurrent = idx === setIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      isCurrent
                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-110'
                        : isCompleted
                        ? 'bg-emerald-950 border border-emerald-800/80 text-emerald-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                    <span>Série {idx + 1}</span>
                  </div>
                );
              })}
            </div>

            {/* Execution Card: Isometric vs Reps */}
            {isIsometric ? (
              /* ISOMETRIC EXERCISE HUD */
              <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-6 shadow-2xl relative">
                <div className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" /> Sustentação Isométrica
                </div>

                {/* Big Isometric Timer */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="88"
                      cy="88"
                      r="74"
                      stroke="#1e293b"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="88"
                      cy="88"
                      r="74"
                      stroke="#10b981"
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 74}
                      strokeDashoffset={
                        2 * Math.PI * 74 -
                        (isometricSecondsLeft / (isometricInitialSeconds || 1)) * (2 * Math.PI * 74)
                      }
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold font-mono text-slate-100">
                      {isometricSecondsLeft}s
                    </span>
                    <span className="text-[11px] text-slate-400">Meta: {isometricInitialSeconds}s</span>
                  </div>
                </div>

                {/* Isometric Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsometricTimerRunning(!isometricTimerRunning)}
                    className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg transition active:scale-95 ${
                      isometricTimerRunning
                        ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                        : 'bg-emerald-500 text-slate-950 shadow-emerald-500/20 hover:brightness-110'
                    }`}
                  >
                    {isometricTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    {isometricTimerRunning ? 'Pausar Isometria' : 'Iniciar Contagem'}
                  </button>

                  <button
                    onClick={() => {
                      setIsometricTimerRunning(false);
                      setIsometricSecondsLeft(isometricInitialSeconds);
                    }}
                    className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                    title="Reiniciar tempo"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Complete Isometric Set Button */}
                <button
                  onClick={handleCompleteIsometricSet}
                  className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs border border-emerald-500/20 flex items-center justify-center gap-2 transition"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Concluir Série Isométrica
                </button>
              </div>
            ) : (
              /* REPETITIONS EXERCISE HUD */
              <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-6 shadow-2xl">
                <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Repetições para esta Série
                </div>

                {/* Large Reps Counter with Steppers */}
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setCurrentReps(Math.max(1, currentReps - 1))}
                    className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center active:scale-95 transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <div className="flex flex-col items-center">
                    <span className="text-6xl font-black font-mono tracking-tight text-slate-100">
                      {currentReps}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">repetições</span>
                  </div>

                  <button
                    onClick={() => setCurrentReps(currentReps + 1)}
                    className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center active:scale-95 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Big Finish Set CTA */}
                <button
                  onClick={handleCompleteRepsSet}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-900/40 hover:brightness-110 active:scale-98 transition animate-pulse-ring"
                >
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> CONCLUIR SÉRIE
                </button>

                {/* Cadence TUT Metronome */}
                <CadenceMetronome />
              </div>
            )}
          </div>
        ) : (
          /* ================= PHASE 2: REST TIMER SCREEN ================= */
          <div className="w-full flex flex-col items-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Tempo de Descanso
              </span>
              <h3 className="text-xl font-bold text-slate-100 mt-2">Recupere o Fôlego</h3>
            </div>

            {/* Glowing Circular Countdown */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="80"
                  stroke="#1e293b"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="80"
                  stroke={restSecondsLeft <= 5 ? '#f43f5e' : '#10b981'}
                  strokeWidth="12"
                  strokeDasharray={restCircumference}
                  strokeDashoffset={restStrokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-300"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`text-5xl font-black font-mono ${
                    restSecondsLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-slate-100'
                  }`}
                >
                  {formatMmSs(restSecondsLeft)}
                </span>
                <span className="text-xs text-slate-400 mt-1">Descanso restante</span>
              </div>
            </div>

            {/* Rest Adjusters (-15s / +15s) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAdjustRest(-15)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition"
              >
                -15s
              </button>
              <button
                onClick={handleSkipRest}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
              >
                <SkipForward className="w-3.5 h-3.5 fill-current" /> Pular Descanso
              </button>
              <button
                onClick={() => handleAdjustRest(15)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition"
              >
                +15s
              </button>
            </div>

            {/* Up Next Card Preview */}
            {nextExerciseData && (
              <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
                    A Seguir:
                  </span>
                  <span className="font-bold text-slate-200 text-sm">
                    {nextExerciseData.name}
                  </span>
                  <span className="text-slate-400 block text-[11px] mt-0.5">
                    {nextIsSameExercise ? `Série ${setIndex + 2} de ${currentRoutineExercise.sets}` : 'Primeira série'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
                  <Play className="w-4 h-4 fill-current text-emerald-400" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Workout Navigation Bar */}
      <div className="p-3 sm:p-4 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
        <button
          disabled={exerciseIndex === 0}
          onClick={() => {
            if (exerciseIndex > 0) {
              setExerciseIndex(exerciseIndex - 1);
              setSetIndex(0);
              setPhase('exercise');
            }
          }}
          className="px-3 py-2 rounded-xl border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>

        {/* Finish workout button */}
        <button
          onClick={handleTriggerFinish}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition"
        >
          Finalizar Treino
        </button>

        <button
          disabled={exerciseIndex >= routine.exercises.length - 1}
          onClick={() => {
            if (exerciseIndex < routine.exercises.length - 1) {
              setExerciseIndex(exerciseIndex + 1);
              setSetIndex(0);
              setPhase('exercise');
            }
          }}
          className="px-3 py-2 rounded-xl border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition"
        >
          Próximo <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide-over Posture Drawer during Workout */}
      {showPostureDrawer && currentExerciseData && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[88vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                Guia de Postura: {currentExerciseData.name}
              </h3>
              <button
                onClick={() => setShowPostureDrawer(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              <ExercisePostureVisual exercise={currentExerciseData} />
              <MuscleMap
                primaryMuscles={currentExerciseData.primaryMuscles}
                secondaryMuscles={currentExerciseData.secondaryMuscles}
                size="sm"
              />
            </div>
            <div className="p-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowPostureDrawer(false)}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Entendido, Continuar Treino
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">Sair do Treino em Andamento?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Você pode finalizar e salvar o progresso feito até agora ou descartar a sessão.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  handleTriggerFinish();
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs transition"
              >
                Concluir e Salvar no Histórico
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExitWorkout();
                }}
                className="w-full py-2.5 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/25 transition"
              >
                Descartar Sessão e Sair
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium"
              >
                Continuar Treinando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
