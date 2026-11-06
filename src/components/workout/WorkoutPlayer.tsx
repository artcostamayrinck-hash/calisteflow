import { useState, useEffect } from 'react';
import type { Routine, WorkoutSession, WorkoutExerciseRecord, MuscleGroup } from '../../types';
import { EXERCISES_DATABASE } from '../../data/exercisesData';
import { soundManager } from '../../utils/audio';
import { ExercisePostureVisual } from '../visuals/ExercisePostureVisual';
import { MuscleMap } from '../visuals/MuscleMap';
import { CadenceMetronome } from './CadenceMetronome';
import { ExerciseVideoPlayer } from './ExerciseVideoPlayer';
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
  const [restTargetTimestamp, setRestTargetTimestamp] = useState<number | null>(null);

  // Isometric Exercise Timer State
  const [isometricTimerRunning, setIsometricTimerRunning] = useState<boolean>(false);
  const [isometricSecondsLeft, setIsometricSecondsLeft] = useState<number>(30);
  const [isometricInitialSeconds, setIsometricInitialSeconds] = useState<number>(30);

  // Current set reps & load adjustment
  const [currentReps, setCurrentReps] = useState<number>(10);
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(0);

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

  // Request Screen Wake Lock with re-acquisition on visibilitychange
  useEffect(() => {
    let wakeLock: any = null;
    const requestLock = async () => {
      if ('wakeLock' in navigator && document.visibilityState === 'visible') {
        try {
          wakeLock = await (navigator as any).wakeLock?.request('screen');
        } catch {
          // Ignore
        }
      }
    };

    requestLock();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
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

  // Rest Countdown Timer (Timestamp-based, resilient to background screen lock)
  useEffect(() => {
    if (phase !== 'rest' || isWorkoutPaused || !restTargetTimestamp) return;

    const checkRestTime = () => {
      const remaining = Math.max(0, Math.ceil((restTargetTimestamp - Date.now()) / 1000));
      setRestSecondsLeft(remaining);

      if (remaining <= 0) {
        soundManager.playSuccessChime();
        setRestTargetTimestamp(null);
        advanceToNextSetOrExercise();
        return;
      }

      if (remaining <= 3 && remaining > 0) {
        soundManager.playCountdownBeep();
      }
    };

    checkRestTime();
    const timer = setInterval(checkRestTime, 500);
    return () => clearInterval(timer);
  }, [phase, restTargetTimestamp, isWorkoutPaused]);

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
    // Record set with load
    recordCurrentSet(currentReps, undefined, currentWeightKg);

    // Check if this was the last set of the last exercise
    const isLastSet = setIndex >= currentRoutineExercise.sets - 1;
    const isLastExercise = exerciseIndex >= routine.exercises.length - 1;

    if (isLastSet && isLastExercise) {
      soundManager.playSuccessChime();
      handleTriggerFinish();
      return;
    }

    // Trigger Rest Period with timestamp anchor
    const restTime = currentRoutineExercise.restSeconds || 60;
    setRestInitialSeconds(restTime);
    setRestSecondsLeft(restTime);
    setRestTargetTimestamp(Date.now() + restTime * 1000);
    setPhase('rest');
    soundManager.playCountdownBeep();
  };

  // Complete Isometric Set
  const handleCompleteIsometricSet = () => {
    const elapsedOrCompleted = isometricInitialSeconds - Math.max(0, isometricSecondsLeft);
    recordCurrentSet(undefined, elapsedOrCompleted || isometricInitialSeconds, currentWeightKg);

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
    setRestTargetTimestamp(Date.now() + restTime * 1000);
    setPhase('rest');
    soundManager.playCountdownBeep();
  };

  const recordCurrentSet = (reps?: number, seconds?: number, weightKg?: number) => {
    setCompletedRecords(prev => {
      const copy = [...prev];
      if (copy[exerciseIndex] && copy[exerciseIndex].sets[setIndex]) {
        copy[exerciseIndex].sets[setIndex] = {
          setNumber: setIndex + 1,
          completed: true,
          completedReps: reps,
          completedSeconds: seconds,
          weightKg: weightKg || undefined,
        };
        const allSetsCompleted = copy[exerciseIndex].sets.every(s => s.completed);
        copy[exerciseIndex].completed = allSetsCompleted;
      }
      return copy;
    });
  };

  const handleSkipRest = () => {
    setRestTargetTimestamp(null);
    advanceToNextSetOrExercise();
  };

  const handleAdjustRest = (deltaSeconds: number) => {
    soundManager.triggerHaptic([20]);
    setRestSecondsLeft(prev => {
      const next = Math.max(5, prev + deltaSeconds);
      setRestTargetTimestamp(Date.now() + next * 1000);
      return next;
    });
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
    <div className="fixed inset-0 z-50 bg-[#060913] text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Top HUD Bar */}
      <div className="p-3.5 sm:p-4 glass-panel border-b border-white/[0.08] backdrop-blur-2xl flex items-center justify-between gap-3 shrink-0">
        {/* Workout elapsed timer & Pause */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              soundManager.triggerHaptic([30]);
              setIsWorkoutPaused(!isWorkoutPaused);
            }}
            className={`p-2.5 rounded-2xl border transition active:scale-95 ${
              isWorkoutPaused
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 glow-amber'
                : 'glass-card text-slate-300 hover:text-white border-white/10'
            }`}
            title={isWorkoutPaused ? 'Retomar treino' : 'Pausar treino'}
          >
            {isWorkoutPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="tracking-wider">{formatMmSs(totalElapsedSeconds)}</span>
              {isWorkoutPaused && (
                <span className="text-[10px] uppercase font-sans px-2 py-0.2 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Pausado
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-[150px] sm:max-w-xs font-semibold">
              {routine.title}
            </div>
          </div>
        </div>

        {/* Right HUD Controls: Sound & Exit */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-2xl border transition active:scale-95 ${
              soundEnabled
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 glow-emerald'
                : 'glass-card text-slate-500 border-white/5'
            }`}
            title={soundEnabled ? 'Silenciar bipes' : 'Ativar bipes de áudio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-2.5 rounded-2xl glass-card text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 transition active:scale-95"
            title="Encerrar ou Sair do Treino"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar under HUD */}
      <div className="w-full bg-slate-900/80 h-1.5 shrink-0 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 transition-all duration-300 glow-emerald"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Active Training Stage */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center max-w-xl mx-auto w-full">
        {phase === 'exercise' ? (
          /* ================= PHASE 1: EXECUTING SET ================= */
          <div className="w-full flex flex-col items-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Exercise Header & Posture Trigger */}
            <div className="w-full glass-card border border-white/10 rounded-3xl p-5 shadow-2xl flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Exercício {exerciseIndex + 1} de {routine.exercises.length}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                    {currentExerciseData?.difficulty}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                  {currentExerciseData ? currentExerciseData.name : currentRoutineExercise.exerciseId}
                </h2>
                {currentRoutineExercise.notes && (
                  <p className="text-xs text-amber-300/90 mt-1 italic font-medium">
                    💡 {currentRoutineExercise.notes}
                  </p>
                )}
              </div>

              {/* View Posture Guide Button */}
              {currentExerciseData && (
                <button
                  onClick={() => setShowPostureDrawer(true)}
                  className="px-3.5 py-2.5 rounded-2xl glass-card text-emerald-300 hover:text-white hover:bg-white/[0.08] border border-white/10 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shrink-0 glow-emerald"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Postura</span>
                </button>
              )}
            </div>

            {/* Set Progression Pills */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {Array.from({ length: currentRoutineExercise.sets }).map((_, idx) => {
                const isCompleted = completedRecords[exerciseIndex]?.sets[idx]?.completed;
                const isCurrent = idx === setIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/30 scale-105 glow-emerald'
                        : isCompleted
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                        : 'glass-card text-slate-500 border-white/5'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> : null}
                    <span>Série {idx + 1}</span>
                  </div>
                );
              })}
            </div>

            {/* Real-time Continuous Video Illustration Loop */}
            {currentExerciseData && (
              <ExerciseVideoPlayer
                exercise={currentExerciseData}
                isPaused={isWorkoutPaused}
                phase={phase}
                autoLoop={true}
              />
            )}

            {/* Execution Card: Isometric vs Reps */}
            {isIsometric ? (
              /* ISOMETRIC EXERCISE HUD */
              <div className="w-full glass-card border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-6 shadow-2xl relative">
                <div className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400 animate-bounce" /> Sustentação Isométrica
                </div>

                {/* Big Isometric Timer */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 filter drop-shadow-md">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#10b981"
                      strokeWidth="12"
                      strokeDasharray={2 * Math.PI * 80}
                      strokeDashoffset={
                        2 * Math.PI * 80 -
                        (isometricSecondsLeft / (isometricInitialSeconds || 1)) * (2 * Math.PI * 80)
                      }
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black font-mono text-slate-100 tracking-tight">
                      {isometricSecondsLeft}s
                    </span>
                    <span className="text-xs text-slate-400 font-semibold mt-1">Meta: {isometricInitialSeconds}s</span>
                  </div>
                </div>

                {/* Isometric Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      soundManager.triggerHaptic([30]);
                      setIsometricTimerRunning(!isometricTimerRunning);
                    }}
                    className={`px-7 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl transition active:scale-95 ${
                      isometricTimerRunning
                        ? 'bg-amber-500 text-slate-950 shadow-amber-500/25 glow-amber'
                        : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 shadow-emerald-500/25 glow-emerald hover:brightness-110'
                    }`}
                  >
                    {isometricTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    {isometricTimerRunning ? 'Pausar Isometria' : 'Iniciar Contagem'}
                  </button>

                  <button
                    onClick={() => {
                      soundManager.triggerHaptic([20]);
                      setIsometricTimerRunning(false);
                      setIsometricSecondsLeft(isometricInitialSeconds);
                    }}
                    className="p-3.5 rounded-2xl glass-card text-slate-300 hover:text-white border border-white/10 transition active:scale-95"
                    title="Reiniciar tempo"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Complete Isometric Set Button */}
                <button
                  onClick={() => {
                    soundManager.triggerHaptic([40]);
                    handleCompleteIsometricSet();
                  }}
                  className="w-full py-3.5 rounded-2xl glass-card hover:bg-white/[0.08] text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Concluir Série Isométrica
                </button>
              </div>
            ) : (
              /* REPETITIONS EXERCISE HUD */
              <div className="w-full glass-card border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-6 shadow-2xl">
                <div className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                  Repetições Concluídas nesta Série
                </div>

                {/* Large Reps Counter with Steppers */}
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => {
                      soundManager.triggerHaptic([20]);
                      setCurrentReps(Math.max(1, currentReps - 1));
                    }}
                    className="w-14 h-14 rounded-2xl glass-card hover:bg-white/[0.1] border border-white/10 text-slate-100 flex items-center justify-center active:scale-90 transition shadow-lg"
                  >
                    <Minus className="w-6 h-6" />
                  </button>

                  <div className="flex flex-col items-center">
                    <span className="text-7xl font-black font-mono tracking-tight text-slate-100 drop-shadow-md">
                      {currentReps}
                    </span>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">repetições</span>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.triggerHaptic([20]);
                      setCurrentReps(currentReps + 1);
                    }}
                    className="w-14 h-14 rounded-2xl glass-card hover:bg-white/[0.1] border border-white/10 text-slate-100 flex items-center justify-center active:scale-90 transition shadow-lg"
                    aria-label="Aumentar repetição"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>

                {/* Optional Weight / Extra Load Selector */}
                <div className="flex items-center justify-between w-full max-w-xs px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/5 text-xs">
                  <span className="font-bold text-slate-400">Carga Extra:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.triggerHaptic([15]);
                        setCurrentWeightKg(prev => Math.max(0, prev - 2));
                      }}
                      className="w-8 h-8 rounded-xl glass-card text-slate-300 font-bold active:scale-90 flex items-center justify-center border border-white/5"
                      aria-label="Diminuir 2kg"
                    >
                      -2
                    </button>
                    <span className="font-mono font-extrabold text-xs text-emerald-400 min-w-14 text-center">
                      {currentWeightKg > 0 ? `+${currentWeightKg}kg` : '0kg (Livre)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.triggerHaptic([15]);
                        setCurrentWeightKg(prev => prev + 2);
                      }}
                      className="w-8 h-8 rounded-xl glass-card text-slate-300 font-bold active:scale-90 flex items-center justify-center border border-white/5"
                      aria-label="Aumentar 2kg"
                    >
                      +2
                    </button>
                  </div>
                </div>

                {/* Big Finish Set CTA */}
                <button
                  onClick={() => {
                    soundManager.triggerHaptic([50]);
                    handleCompleteRepsSet();
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-base tracking-wide flex items-center justify-center gap-2.5 shadow-2xl shadow-emerald-500/30 hover:brightness-110 active:scale-98 transition animate-pulse-ring glow-emerald"
                >
                  <CheckCircle2 className="w-5 h-5 stroke-[3]" /> CONCLUIR SÉRIE
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
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 glow-emerald">
                Intervalo de Recuperação
              </span>
              <h3 className="text-2xl font-black text-slate-100 mt-2 tracking-tight">Respire Fundo</h3>
            </div>

            {/* Glowing Circular Countdown */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-4 rounded-full bg-emerald-500/5 blur-2xl animate-pulse" />
              <svg className="w-full h-full -rotate-90 filter drop-shadow-xl">
                <circle
                  cx="50%"
                  cy="50%"
                  r="85"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="14"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="85"
                  stroke={restSecondsLeft <= 5 ? '#f43f5e' : '#10b981'}
                  strokeWidth="14"
                  strokeDasharray={restCircumference}
                  strokeDashoffset={restStrokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-300"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`text-6xl font-black font-mono tracking-tight ${
                    restSecondsLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-slate-100'
                  }`}
                >
                  {formatMmSs(restSecondsLeft)}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Descanso</span>
              </div>
            </div>

            {/* Rest Adjusters (-15s / +15s) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAdjustRest(-15)}
                className="px-4 py-2.5 rounded-2xl glass-card text-slate-200 text-xs font-black hover:bg-white/[0.08] transition active:scale-95"
              >
                -15s
              </button>
              <button
                onClick={() => {
                  soundManager.triggerHaptic([40]);
                  handleSkipRest();
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition glow-emerald"
              >
                <SkipForward className="w-4 h-4 fill-current" /> Pular Descanso
              </button>
              <button
                onClick={() => handleAdjustRest(15)}
                className="px-4 py-2.5 rounded-2xl glass-card text-slate-200 text-xs font-black hover:bg-white/[0.08] transition active:scale-95"
              >
                +15s
              </button>
            </div>

            {/* Up Next Card Preview */}
            {nextExerciseData && (
              <div className="w-full glass-card rounded-3xl p-4 flex items-center justify-between gap-3 text-xs border border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                  {nextExerciseData.videoThumbnail ? (
                    <img
                      src={nextExerciseData.videoThumbnail}
                      alt={nextExerciseData.name}
                      className="w-12 h-12 rounded-xl object-cover bg-black/40 border border-white/10 shrink-0 shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                      <Play className="w-5 h-5 text-emerald-400" />
                    </div>
                  )}
                  <div>
                    <span className="text-emerald-400 font-extrabold block text-[10px] uppercase tracking-widest">
                      A Seguir:
                    </span>
                    <span className="font-black text-slate-100 text-sm">
                      {nextExerciseData.name}
                    </span>
                    <span className="text-slate-400 block text-[11px] mt-0.5 font-medium">
                      {nextIsSameExercise ? `Série ${setIndex + 2} de ${currentRoutineExercise.sets}` : 'Primeira série do próximo exercício'}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 glow-emerald shrink-0">
                  <Play className="w-4 h-4 fill-current" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Workout Navigation Bar */}
      <div className="p-3.5 sm:p-4 glass-panel border-t border-white/10 backdrop-blur-2xl flex items-center justify-between gap-3 shrink-0">
        <button
          disabled={exerciseIndex === 0}
          onClick={() => {
            soundManager.triggerHaptic([20]);
            if (exerciseIndex > 0) {
              setExerciseIndex(exerciseIndex - 1);
              setSetIndex(0);
              setPhase('exercise');
            }
          }}
          className="px-4 py-2.5 rounded-2xl glass-card text-slate-200 text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.08] transition active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>

        {/* Finish workout button */}
        <button
          onClick={() => {
            soundManager.triggerHaptic([30]);
            handleTriggerFinish();
          }}
          className="px-5 py-2.5 rounded-2xl glass-card text-slate-200 hover:text-white hover:bg-white/[0.08] text-xs font-black border border-white/10 transition active:scale-95"
        >
          Finalizar Treino
        </button>

        <button
          disabled={exerciseIndex >= routine.exercises.length - 1}
          onClick={() => {
            soundManager.triggerHaptic([20]);
            if (exerciseIndex < routine.exercises.length - 1) {
              setExerciseIndex(exerciseIndex + 1);
              setSetIndex(0);
              setPhase('exercise');
            }
          }}
          className="px-4 py-2.5 rounded-2xl glass-card text-slate-200 text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.08] transition active:scale-95"
        >
          Próximo <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide-over Posture Drawer during Workout */}
      {showPostureDrawer && currentExerciseData && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[88vh] glass-panel border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <h3 className="font-black text-sm text-slate-100 flex items-center gap-2 tracking-tight">
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
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <ExercisePostureVisual exercise={currentExerciseData} />
              <MuscleMap
                primaryMuscles={currentExerciseData.primaryMuscles}
                secondaryMuscles={currentExerciseData.secondaryMuscles}
                size="sm"
              />
            </div>
            <div className="p-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowPostureDrawer(false)}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 glow-emerald"
              >
                Continuar Treino
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm glass-panel border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-100 tracking-tight">Sair do Treino em Andamento?</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Você pode finalizar e salvar todo o progresso realizado até agora ou descartar esta sessão.
            </p>
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  handleTriggerFinish();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs transition active:scale-98 glow-emerald"
              >
                Concluir e Salvar no Histórico
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExitWorkout();
                }}
                className="w-full py-2.5 rounded-2xl bg-rose-500/10 text-rose-300 border border-rose-500/25 text-xs font-bold hover:bg-rose-500/20 transition active:scale-98"
              >
                Descartar Sessão e Sair
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-2 rounded-2xl text-slate-400 hover:text-white text-xs font-bold"
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
