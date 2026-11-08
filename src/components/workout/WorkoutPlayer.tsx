import { useState, useEffect } from 'react';
import type { Routine, WorkoutSession, WorkoutExerciseRecord, MuscleGroup, ActiveWorkoutBackup, Exercise } from '../../types';
import { EXERCISES_DATABASE, getExerciseById } from '../../data/exercisesData';
import { soundManager } from '../../utils/audio';
import { saveActiveWorkoutBackup, clearActiveWorkoutBackup } from '../../utils/storage';
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
  AlertTriangle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface WorkoutPlayerProps {
  routine: Routine;
  onFinishWorkout: (session: WorkoutSession) => void;
  onExitWorkout: () => void;
  initialBackup?: ActiveWorkoutBackup | null;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  routine,
  onFinishWorkout,
  onExitWorkout,
  initialBackup,
}) => {
  // Navigation & Step State (supports restoring from active backup)
  const [exerciseIndex, setExerciseIndex] = useState<number>(initialBackup?.exerciseIndex || 0);
  const [setIndex, setSetIndex] = useState<number>(initialBackup?.setIndex || 0);
  const [phase, setPhase] = useState<'exercise' | 'rest'>(initialBackup?.phase || 'exercise');

  // Timers & Pause timestamp tracking
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState<number>(initialBackup?.totalElapsedSeconds || 0);
  const [isWorkoutPaused, setIsWorkoutPaused] = useState<boolean>(initialBackup?.isWorkoutPaused || false);
  const [pausedAtTimestamp, setPausedAtTimestamp] = useState<number | null>(null);
  const [totalPausedDurationMs, setTotalPausedDurationMs] = useState<number>(0);

  // Rest Timer State
  const [restSecondsLeft, setRestSecondsLeft] = useState<number>(() => {
    if (initialBackup?.phase === 'rest' && initialBackup.restTargetTimestamp) {
      return Math.max(0, Math.ceil((initialBackup.restTargetTimestamp - Date.now()) / 1000));
    }
    return 60;
  });
  const [restInitialSeconds, setRestInitialSeconds] = useState<number>(60);
  const [restTargetTimestamp, setRestTargetTimestamp] = useState<number | null>(() => {
    if (initialBackup?.phase === 'rest' && initialBackup.restTargetTimestamp && initialBackup.restTargetTimestamp > Date.now()) {
      return initialBackup.restTargetTimestamp;
    }
    return null;
  });

  // Isometric Exercise Timer State (Timestamp-based)
  const [isometricTimerRunning, setIsometricTimerRunning] = useState<boolean>(false);
  const [isometricTargetTimestamp, setIsometricTargetTimestamp] = useState<number | null>(null);
  const [isometricSecondsLeft, setIsometricSecondsLeft] = useState<number>(initialBackup?.isometricSecondsLeft || 30);
  const [isometricInitialSeconds, setIsometricInitialSeconds] = useState<number>(initialBackup?.isometricSecondsLeft || 30);

  // Current set reps & load adjustment
  const [currentReps, setCurrentReps] = useState<number>(10);
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(initialBackup?.currentWeightKg || 0);

  // Audio / Sound toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active routine state supporting dynamic in-workout adaptation without session interruption
  const [activeRoutine, setActiveRoutine] = useState<Routine>(routine);

  // Posture modal drawer
  const [showPostureDrawer, setShowPostureDrawer] = useState<boolean>(false);

  // Adaptation / Regression drawer
  const [showAdaptationModal, setShowAdaptationModal] = useState<boolean>(false);

  // Quick notice banner
  const [quickNotice, setQuickNotice] = useState<string | null>(null);

  // Unlocked progressions to recommend
  const [unlockedProgressions, setUnlockedProgressions] = useState<Array<{ from: string; to: string; toName: string }>>([]);

  // Set comfort / effort feedback
  const [lastSetFeedback, setLastSetFeedback] = useState<'facil' | 'ideal' | 'dificil' | 'dor' | null>(null);

  // Confirm exit dialog
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Completed records tracking (restores from backup if available)
  const [sessionStartTime] = useState<string>(initialBackup?.sessionStartTime || new Date().toISOString());
  const [completedRecords, setCompletedRecords] = useState<WorkoutExerciseRecord[]>(() => {
    if (initialBackup?.completedRecords && initialBackup.completedRecords.length > 0) {
      return initialBackup.completedRecords;
    }
    return routine.exercises.map(re => {
      const ex = getExerciseById(re.exerciseId) || EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
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
    });
  });

  const currentRoutineExercise = activeRoutine.exercises[exerciseIndex];
  const currentExerciseData = getExerciseById(currentRoutineExercise.exerciseId) || EXERCISES_DATABASE.find(e => e.id === currentRoutineExercise.exerciseId);
  const isIsometric = currentExerciseData?.type === 'isometric';

  // Dynamic on-the-fly exercise adaptation
  const handleSwapCurrentExercise = (newEx: Exercise) => {
    soundManager.triggerHaptic([30]);
    setActiveRoutine(prev => {
      const nextExs = [...prev.exercises];
      nextExs[exerciseIndex] = {
        ...nextExs[exerciseIndex],
        exerciseId: newEx.id,
        notes: `Adaptado durante treino: ${newEx.name}`,
        targetReps: newEx.defaultReps || nextExs[exerciseIndex].targetReps,
        targetHoldSeconds: newEx.defaultHoldSeconds || nextExs[exerciseIndex].targetHoldSeconds,
      };
      return { ...prev, exercises: nextExs };
    });

    setCompletedRecords(prev => {
      const copy = [...prev];
      if (copy[exerciseIndex]) {
        copy[exerciseIndex].exerciseId = newEx.id;
        copy[exerciseIndex].exerciseName = newEx.name;
      }
      return copy;
    });

    if (newEx.type === 'isometric') {
      const sec = newEx.defaultHoldSeconds || 30;
      setIsometricSecondsLeft(sec);
      setIsometricInitialSeconds(sec);
      setIsometricTimerRunning(false);
      setIsometricTargetTimestamp(null);
    } else {
      setCurrentReps(newEx.defaultReps || 10);
    }

    setShowAdaptationModal(false);
    setLastSetFeedback(null);
    setQuickNotice(`Exercício adaptado com sucesso para: ${newEx.name}`);
    setTimeout(() => setQuickNotice(null), 4000);
  };

  // Advance to next set or exercise after rest
  const advanceToNextSetOrExercise = () => {
    setRestTargetTimestamp(null);
    if (setIndex < currentRoutineExercise.sets - 1) {
      // Next set in current exercise
      setSetIndex(prev => prev + 1);
      setPhase('exercise');
    } else if (exerciseIndex < activeRoutine.exercises.length - 1) {
      // Next exercise
      setExerciseIndex(prev => prev + 1);
      setSetIndex(0);
      setPhase('exercise');
    } else {
      // All exercises finished!
      handleTriggerFinish();
    }
  };

  // Record set with load
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

  // Complete Reps Set
  const handleCompleteRepsSet = () => {
    recordCurrentSet(currentReps, undefined, currentWeightKg);

    const isLastSet = setIndex >= currentRoutineExercise.sets - 1;
    const isLastExercise = exerciseIndex >= activeRoutine.exercises.length - 1;

    // Check advancement criterion celebration on completing exercise sets
    if (isLastSet && currentExerciseData?.progressoes && currentExerciseData.progressoes.length > 0) {
      const targetReps = currentRoutineExercise.targetReps || currentExerciseData.defaultReps || 10;
      if (currentReps >= targetReps) {
        const nextProgId = currentExerciseData.progressoes[0];
        const nextProgEx = getExerciseById(nextProgId);
        if (nextProgEx) {
          setUnlockedProgressions(prev => {
            if (prev.some(p => p.to === nextProgId)) return prev;
            return [...prev, { from: currentExerciseData.name, to: nextProgId, toName: nextProgEx.name }];
          });
          setQuickNotice(`🎉 Meta atingida em ${currentExerciseData.name}! Próxima progressão sugerida: ${nextProgEx.name}`);
          setTimeout(() => setQuickNotice(null), 5000);
        }
      }
    }

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

  // Complete Isometric Set
  const handleCompleteIsometricSet = () => {
    setIsometricTimerRunning(false);
    setIsometricTargetTimestamp(null);
    const elapsedOrCompleted = isometricInitialSeconds - Math.max(0, isometricSecondsLeft);
    recordCurrentSet(undefined, elapsedOrCompleted || isometricInitialSeconds, currentWeightKg);

    const isLastSet = setIndex >= currentRoutineExercise.sets - 1;
    const isLastExercise = exerciseIndex >= activeRoutine.exercises.length - 1;

    // Check advancement criterion for isometric
    if (isLastSet && currentExerciseData?.progressoes && currentExerciseData.progressoes.length > 0) {
      const targetSec = currentRoutineExercise.targetHoldSeconds || currentExerciseData.defaultHoldSeconds || 20;
      if (elapsedOrCompleted >= targetSec) {
        const nextProgId = currentExerciseData.progressoes[0];
        const nextProgEx = getExerciseById(nextProgId);
        if (nextProgEx) {
          setUnlockedProgressions(prev => {
            if (prev.some(p => p.to === nextProgId)) return prev;
            return [...prev, { from: currentExerciseData.name, to: nextProgId, toName: nextProgEx.name }];
          });
          setQuickNotice(`🎉 Meta atingida em ${currentExerciseData.name}! Próxima progressão: ${nextProgEx.name}`);
          setTimeout(() => setQuickNotice(null), 5000);
        }
      }
    }

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

  // Workout pause toggle with pause-duration accumulation
  const toggleWorkoutPause = () => {
    soundManager.triggerHaptic([30]);
    if (!isWorkoutPaused) {
      setIsWorkoutPaused(true);
      setPausedAtTimestamp(Date.now());
      if (restTargetTimestamp) {
        setRestSecondsLeft(Math.max(0, Math.ceil((restTargetTimestamp - Date.now()) / 1000)));
        setRestTargetTimestamp(null);
      }
      if (isometricTargetTimestamp) {
        setIsometricSecondsLeft(Math.max(0, Math.ceil((isometricTargetTimestamp - Date.now()) / 1000)));
        setIsometricTargetTimestamp(null);
      }
    } else {
      setIsWorkoutPaused(false);
      if (pausedAtTimestamp) {
        setTotalPausedDurationMs(prev => prev + (Date.now() - pausedAtTimestamp));
        setPausedAtTimestamp(null);
      }
      if (phase === 'rest') {
        setRestTargetTimestamp(Date.now() + restSecondsLeft * 1000);
      }
      if (phase === 'exercise' && isIsometric && isometricTimerRunning) {
        setIsometricTargetTimestamp(Date.now() + isometricSecondsLeft * 1000);
      }
    }
  };

  // Isometric timer controls
  const toggleIsometricTimer = () => {
    soundManager.triggerHaptic([30]);
    if (!isometricTimerRunning) {
      soundManager.playStartBeep();
      setIsometricTargetTimestamp(Date.now() + isometricSecondsLeft * 1000);
      setIsometricTimerRunning(true);
    } else {
      if (isometricTargetTimestamp) {
        setIsometricSecondsLeft(Math.max(0, Math.ceil((isometricTargetTimestamp - Date.now()) / 1000)));
      }
      setIsometricTargetTimestamp(null);
      setIsometricTimerRunning(false);
    }
  };

  const resetIsometricTimer = () => {
    soundManager.triggerHaptic([20]);
    setIsometricTimerRunning(false);
    setIsometricTargetTimestamp(null);
    setIsometricSecondsLeft(isometricInitialSeconds);
  };

  // Request Screen Wake Lock with re-acquisition on visibilitychange & lock-screen catchup
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

        // 1. Re-sync elapsed workout time accurately from timestamps
        if (!isWorkoutPaused) {
          const sessionStartMs = new Date(sessionStartTime).getTime();
          const now = Date.now();
          const currentPaused = pausedAtTimestamp ? now - pausedAtTimestamp : 0;
          const actualElapsed = Math.max(
            0,
            Math.floor((now - sessionStartMs - totalPausedDurationMs - currentPaused) / 1000)
          );
          setTotalElapsedSeconds(actualElapsed);
        }

        // 2. Re-check rest timer if screen was locked
        if (phase === 'rest' && !isWorkoutPaused && restTargetTimestamp) {
          const remaining = Math.max(0, Math.ceil((restTargetTimestamp - Date.now()) / 1000));
          setRestSecondsLeft(remaining);
          if (remaining <= 0) {
            soundManager.playSuccessChime();
            setRestTargetTimestamp(null);
            advanceToNextSetOrExercise();
          }
        }

        // 3. Re-check isometric timer if screen was locked
        if (phase === 'exercise' && isIsometric && isometricTimerRunning && isometricTargetTimestamp) {
          const remaining = Math.max(0, Math.ceil((isometricTargetTimestamp - Date.now()) / 1000));
          setIsometricSecondsLeft(remaining);
          if (remaining <= 0) {
            soundManager.playSuccessChime();
            setIsometricTimerRunning(false);
            setIsometricTargetTimestamp(null);
            handleCompleteIsometricSet();
          }
        }
      } else if (document.visibilityState === 'hidden') {
        // App going to background: take snapshot immediately for bulletproof recovery
        saveActiveWorkoutBackup({
          routine,
          exerciseIndex,
          setIndex,
          phase,
          totalElapsedSeconds,
          completedRecords,
          sessionStartTime,
          timestamp: Date.now(),
          restTargetTimestamp,
          isometricSecondsLeft,
          isWorkoutPaused,
          currentWeightKg,
        });
      }
    };

    const handleBeforeUnload = () => {
      saveActiveWorkoutBackup({
        routine,
        exerciseIndex,
        setIndex,
        phase,
        totalElapsedSeconds,
        completedRecords,
        sessionStartTime,
        timestamp: Date.now(),
        restTargetTimestamp,
        isometricSecondsLeft,
        isWorkoutPaused,
        currentWeightKg,
      });
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      wakeLock?.release?.().catch(() => {});
    };
  }, [
    isWorkoutPaused,
    sessionStartTime,
    pausedAtTimestamp,
    totalPausedDurationMs,
    phase,
    restTargetTimestamp,
    isIsometric,
    isometricTimerRunning,
    isometricTargetTimestamp,
    routine,
    exerciseIndex,
    setIndex,
    totalElapsedSeconds,
    completedRecords,
    isometricSecondsLeft,
    currentWeightKg,
  ]);

  // Sync state when exercise changes
  useEffect(() => {
    if (!currentRoutineExercise) return;
    if (isIsometric) {
      const targetSec = currentRoutineExercise.targetHoldSeconds || 30;
      setIsometricSecondsLeft(targetSec);
      setIsometricInitialSeconds(targetSec);
      setIsometricTimerRunning(false);
      setIsometricTargetTimestamp(null);
    } else {
      setCurrentReps(currentRoutineExercise.targetReps || 10);
    }
    setPhase('exercise');
  }, [exerciseIndex, setIndex]);

  // Overall Workout Elapsed Timer (Interval tick + state tracker)
  useEffect(() => {
    if (isWorkoutPaused) return;
    const interval = setInterval(() => {
      setTotalElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWorkoutPaused]);

  // Active workout snapshot for crash/tab-close recovery
  useEffect(() => {
    saveActiveWorkoutBackup({
      routine,
      exerciseIndex,
      setIndex,
      phase,
      totalElapsedSeconds,
      completedRecords,
      sessionStartTime,
      timestamp: Date.now(),
      restTargetTimestamp,
      isometricSecondsLeft,
      isWorkoutPaused,
      currentWeightKg,
    });
  }, [
    routine,
    exerciseIndex,
    setIndex,
    phase,
    isWorkoutPaused,
    completedRecords,
    sessionStartTime,
    restTargetTimestamp,
    isometricSecondsLeft,
    currentWeightKg,
  ]);

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

  // Isometric Exercise Countdown / Stopwatch (Timestamp-based)
  useEffect(() => {
    if (phase !== 'exercise' || !isometricTimerRunning || isWorkoutPaused || !isometricTargetTimestamp) return;

    const checkIsometricTime = () => {
      const remaining = Math.max(0, Math.ceil((isometricTargetTimestamp - Date.now()) / 1000));
      setIsometricSecondsLeft(remaining);

      if (remaining <= 0) {
        soundManager.playSuccessChime();
        setIsometricTimerRunning(false);
        setIsometricTargetTimestamp(null);
        handleCompleteIsometricSet();
        return;
      }

      if (remaining <= 3 && remaining > 0) {
        soundManager.playCountdownBeep();
      }
    };

    checkIsometricTime();
    const timer = setInterval(checkIsometricTime, 500);
    return () => clearInterval(timer);
  }, [phase, isometricTimerRunning, isometricTargetTimestamp, isWorkoutPaused]);

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
        activeRoutine.exercises.flatMap(re => {
          const ex = getExerciseById(re.exerciseId) || EXERCISES_DATABASE.find(e => e.id === re.exerciseId);
          return ex ? [...ex.primaryMuscles, ...ex.secondaryMuscles] : [];
        })
      )
    ) as MuscleGroup[];

    const progressionSummary = unlockedProgressions.length > 0
      ? `🏆 Progressões recomendadas com base nas metas atingidas hoje: ${unlockedProgressions.map(p => `${p.from} ➔ ${p.toName}`).join(' | ')}`
      : undefined;

    const session: WorkoutSession = {
      id: `workout-${Date.now()}`,
      routineId: activeRoutine.id,
      routineTitle: activeRoutine.title,
      startTime: sessionStartTime,
      endTime: new Date().toISOString(),
      durationSeconds: totalElapsedSeconds,
      exercises: completedRecords,
      totalSetsCompleted: totalSetsDone || 1,
      totalRepsCompleted: totalRepsDone,
      totalIsometricSeconds: totalIsoSecDone,
      musclesWorked,
      userNotes: progressionSummary,
    };

    clearActiveWorkoutBackup();
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

  const isFirstSetOfFirstExercise = exerciseIndex === 0 && setIndex === 0;
  const isLastSetOfLastExercise =
    exerciseIndex >= routine.exercises.length - 1 &&
    setIndex >= currentRoutineExercise.sets - 1;

  const handlePreviousStep = () => {
    soundManager.triggerHaptic([20]);
    if (setIndex > 0) {
      setSetIndex(setIndex - 1);
      setPhase('exercise');
    } else if (exerciseIndex > 0) {
      const prevEx = routine.exercises[exerciseIndex - 1];
      setExerciseIndex(exerciseIndex - 1);
      setSetIndex(Math.max(0, (prevEx?.sets || 1) - 1));
      setPhase('exercise');
    }
  };

  const handleNextStep = () => {
    soundManager.triggerHaptic([20]);
    if (setIndex < currentRoutineExercise.sets - 1) {
      setSetIndex(setIndex + 1);
      setPhase('exercise');
    } else if (exerciseIndex < routine.exercises.length - 1) {
      setExerciseIndex(exerciseIndex + 1);
      setSetIndex(0);
      setPhase('exercise');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060913] text-slate-100 flex flex-col justify-between h-[100dvh] max-h-[100dvh] w-full overflow-hidden select-none box-border">
      {/* Top HUD Bar */}
      <header className="px-3 py-2.5 sm:px-4 sm:py-3 glass-panel border-b border-white/[0.08] backdrop-blur-2xl flex items-center justify-between gap-2 shrink-0 w-full min-w-0">
        {/* Workout elapsed timer & Pause */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            type="button"
            onClick={toggleWorkoutPause}
            className={`w-10 h-10 rounded-2xl border transition active:scale-95 flex items-center justify-center shrink-0 ${
              isWorkoutPaused
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 glow-amber'
                : 'glass-card text-slate-300 hover:text-white border-white/10'
            }`}
            title={isWorkoutPaused ? 'Retomar treino' : 'Pausar treino'}
            aria-label={isWorkoutPaused ? 'Retomar treino' : 'Pausar treino'}
          >
            {isWorkoutPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="tracking-wider tabular-nums inline-block min-w-[42px]">{formatMmSs(totalElapsedSeconds)}</span>
              {isWorkoutPaused && (
                <span className="text-[9px] uppercase font-sans px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shrink-0">
                  Pausado
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 font-semibold truncate block w-full max-w-full">
              {routine.title}
            </div>
          </div>
        </div>

        {/* Right HUD Controls: Sound & Exit */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={toggleSound}
            className={`w-10 h-10 rounded-2xl border transition active:scale-95 flex items-center justify-center shrink-0 ${
              soundEnabled
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 glow-emerald'
                : 'glass-card text-slate-500 border-white/5'
            }`}
            title={soundEnabled ? 'Silenciar bipes' : 'Ativar bipes de áudio'}
            aria-label={soundEnabled ? 'Silenciar bipes' : 'Ativar bipes de áudio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="w-10 h-10 rounded-2xl glass-card text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 transition active:scale-95 flex items-center justify-center shrink-0"
            title="Encerrar ou Sair do Treino"
            aria-label="Encerrar ou Sair do Treino"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Progress Bar under HUD */}
      <div className="w-full bg-slate-900/80 h-1.5 shrink-0 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 transition-all duration-300 glow-emerald"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Active Training Stage */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 flex flex-col items-center justify-start max-w-md sm:max-w-xl mx-auto w-full box-border pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]">
        {phase === 'exercise' ? (
          /* ================= PHASE 1: EXECUTING SET ================= */
          <div className="w-full flex flex-col items-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Exercise Header & Posture/Adaptation Triggers */}
            <div className="w-full glass-card border border-white/10 rounded-2xl p-3.5 sm:p-4 shadow-xl flex items-center justify-between gap-2.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 tabular-nums">
                    Exercício {exerciseIndex + 1} de {routine.exercises.length}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                    {currentExerciseData?.difficulty}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight truncate">
                  {currentExerciseData ? currentExerciseData.name : currentRoutineExercise.exerciseId}
                </h2>
                {currentRoutineExercise.notes && (
                  <p className="text-[11px] text-amber-300/90 mt-1 italic font-medium truncate">
                    💡 {currentRoutineExercise.notes}
                  </p>
                )}
                {currentExerciseData?.safetyCautions && currentExerciseData.safetyCautions.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 mt-1.5 max-w-full">
                    <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{currentExerciseData.safetyCautions[0]}</span>
                  </div>
                )}
              </div>

              {/* View Posture Guide & Quick Adapt Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {currentExerciseData && (
                  <button
                    type="button"
                    onClick={() => setShowPostureDrawer(true)}
                    className="px-2.5 py-2 rounded-xl glass-card text-emerald-300 hover:text-white hover:bg-white/[0.08] border border-white/10 text-xs font-bold flex items-center gap-1 transition active:scale-95 glow-emerald min-h-[40px]"
                    title="Guia de postura biomecânica"
                  >
                    <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="hidden sm:inline">Postura</span>
                  </button>
                )}

                {currentExerciseData && (
                  <button
                    type="button"
                    onClick={() => setShowAdaptationModal(true)}
                    className="px-2.5 py-2 rounded-xl glass-card text-amber-300 hover:text-white hover:bg-white/[0.08] border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition active:scale-95 min-h-[40px]"
                    title="Sentiu dor ou está pesado? Trocar versão"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="hidden sm:inline">Adaptar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Notice / Celebration Banner */}
            {quickNotice && (
              <div className="w-full bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold p-3 rounded-2xl shadow-xl flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 truncate">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{quickNotice}</span>
                </div>
                <button type="button" onClick={() => setQuickNotice(null)} className="text-slate-400 hover:text-white shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Set Progression Pills */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center w-full">
              {Array.from({ length: currentRoutineExercise.sets }).map((_, idx) => {
                const isCompleted = completedRecords[exerciseIndex]?.sets[idx]?.completed;
                const isCurrent = idx === setIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all tabular-nums ${
                      isCurrent
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/30 glow-emerald'
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

            {/* Execution Card: Isometric vs Reps (Directly after title & set pills) */}
            {isIsometric ? (
              /* ISOMETRIC EXERCISE HUD */
              <div className="w-full glass-card border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center space-y-4 shadow-xl relative">
                <div className="text-[11px] uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400 animate-bounce" /> Sustentação Isométrica
                </div>

                {/* Big Isometric Timer */}
                <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 filter drop-shadow-md">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="76"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="76"
                      stroke="#10b981"
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 76}
                      strokeDashoffset={
                        2 * Math.PI * 76 -
                        (isometricSecondsLeft / (isometricInitialSeconds || 1)) * (2 * Math.PI * 76)
                      }
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black font-mono text-slate-100 tracking-tight tabular-nums">
                      {isometricSecondsLeft}s
                    </span>
                    <span className="text-xs text-slate-400 font-semibold mt-1 tabular-nums">Meta: {isometricInitialSeconds}s</span>
                  </div>
                </div>

                {/* Isometric Controls (min 48px touch targets) */}
                <div className="flex items-center gap-2.5 w-full max-w-xs justify-center">
                  <button
                    type="button"
                    onClick={toggleIsometricTimer}
                    className={`h-12 px-6 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 flex-1 ${
                      isometricTimerRunning
                        ? 'bg-amber-500 text-slate-950 shadow-amber-500/25 glow-amber'
                        : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 shadow-emerald-500/25 glow-emerald hover:brightness-110'
                    }`}
                  >
                    {isometricTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isometricTimerRunning ? 'Pausar' : 'Iniciar'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={resetIsometricTimer}
                    className="w-12 h-12 rounded-2xl glass-card text-slate-300 hover:text-white border border-white/10 transition active:scale-95 flex items-center justify-center shrink-0"
                    title="Reiniciar tempo"
                    aria-label="Reiniciar tempo"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Complete Isometric Set Button */}
                <button
                  type="button"
                  onClick={() => {
                    soundManager.triggerHaptic([40]);
                    handleCompleteIsometricSet();
                  }}
                  className="w-full h-12 rounded-2xl glass-card hover:bg-white/[0.08] text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Concluir Série Isométrica
                </button>
              </div>
            ) : (
              /* REPETITIONS EXERCISE HUD */
              <div className="w-full glass-card border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center space-y-4 shadow-xl">
                <div className="text-[11px] uppercase font-extrabold tracking-widest text-slate-400 text-center">
                  Repetições Concluídas nesta Série
                </div>

                {/* Large Reps Counter with Steppers (min 48px touch targets) */}
                <div className="flex items-center justify-center gap-5 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.triggerHaptic([20]);
                      setCurrentReps(Math.max(1, currentReps - 1));
                    }}
                    className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-2xl glass-card hover:bg-white/[0.1] border border-white/10 text-slate-100 flex items-center justify-center active:scale-90 transition shadow-lg shrink-0"
                    aria-label="Diminuir repetição"
                  >
                    <Minus className="w-6 h-6" />
                  </button>

                  <div className="flex flex-col items-center min-w-[90px]">
                    <span className="text-6xl font-black font-mono tracking-tight text-slate-100 drop-shadow-md tabular-nums leading-none">
                      {currentReps}
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">repetições</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.triggerHaptic([20]);
                      setCurrentReps(currentReps + 1);
                    }}
                    className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-2xl glass-card hover:bg-white/[0.1] border border-white/10 text-slate-100 flex items-center justify-center active:scale-90 transition shadow-lg shrink-0"
                    aria-label="Aumentar repetição"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>

                {/* Optional Weight / Extra Load Selector */}
                <div className="flex items-center justify-between w-full max-w-xs px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/5 text-xs">
                  <span className="font-bold text-slate-400 text-[11px]">Carga Extra:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.triggerHaptic([15]);
                        setCurrentWeightKg(prev => Math.max(0, prev - 2));
                      }}
                      className="w-8 h-8 rounded-lg glass-card text-slate-300 font-bold active:scale-90 flex items-center justify-center border border-white/5 text-[11px]"
                      aria-label="Diminuir 2kg"
                    >
                      -2
                    </button>
                    <span className="font-mono font-extrabold text-xs text-emerald-400 min-w-14 text-center tabular-nums">
                      {currentWeightKg > 0 ? `+${currentWeightKg}kg` : '0kg (Livre)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.triggerHaptic([15]);
                        setCurrentWeightKg(prev => prev + 2);
                      }}
                      className="w-8 h-8 rounded-lg glass-card text-slate-300 font-bold active:scale-90 flex items-center justify-center border border-white/5 text-[11px]"
                      aria-label="Aumentar 2kg"
                    >
                      +2
                    </button>
                  </div>
                </div>

                {/* Big Finish Set CTA (48px touch height) */}
                <button
                  type="button"
                  onClick={() => {
                    soundManager.triggerHaptic([50]);
                    handleCompleteRepsSet();
                  }}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition glow-emerald shrink-0"
                >
                  <CheckCircle2 className="w-5 h-5 stroke-[3]" /> CONCLUIR SÉRIE
                </button>

                {/* Cadence TUT Metronome */}
                <CadenceMetronome />
              </div>
            )}

            {/* Continuous Video / Biomechanical Illustration Loop (Scrolling underneath) */}
            {currentExerciseData && (
              <ExerciseVideoPlayer
                exercise={currentExerciseData}
                isPaused={isWorkoutPaused}
                phase={phase}
                autoLoop={true}
              />
            )}
          </div>
        ) : (
          /* ================= PHASE 2: REST TIMER SCREEN ================= */
          <div className="w-full flex flex-col items-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 glow-emerald">
                Intervalo de Recuperação
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-100 mt-2 tracking-tight">Respire Fundo</h3>
            </div>

            {/* Glowing Circular Countdown */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              <div className="absolute inset-4 rounded-full bg-emerald-500/5 blur-2xl animate-pulse" />
              <svg className="w-full h-full -rotate-90 filter drop-shadow-xl">
                <circle
                  cx="50%"
                  cy="50%"
                  r="80"
                  stroke="rgba(255,255,255,0.08)"
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
                  className={`text-5xl sm:text-6xl font-black font-mono tracking-tight tabular-nums ${
                    restSecondsLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-slate-100'
                  }`}
                >
                  {formatMmSs(restSecondsLeft)}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Descanso</span>
              </div>
            </div>

            {/* Rest Adjusters (-15s / +15s) with 48px touch height */}
            <div className="flex items-center gap-2.5 w-full max-w-xs justify-center">
              <button
                type="button"
                onClick={() => handleAdjustRest(-15)}
                className="h-12 px-4 rounded-2xl glass-card text-slate-200 text-xs font-black hover:bg-white/[0.08] transition active:scale-95 flex items-center justify-center shrink-0"
                aria-label="Diminuir 15 segundos"
              >
                -15s
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.triggerHaptic([40]);
                  handleSkipRest();
                }}
                className="h-12 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition glow-emerald flex-1 truncate"
                aria-label="Pular Descanso"
              >
                <SkipForward className="w-4 h-4 fill-current shrink-0" />
                <span className="truncate">Pular</span>
              </button>
              <button
                type="button"
                onClick={() => handleAdjustRest(15)}
                className="h-12 px-4 rounded-2xl glass-card text-slate-200 text-xs font-black hover:bg-white/[0.08] transition active:scale-95 flex items-center justify-center shrink-0"
                aria-label="Aumentar 15 segundos"
              >
                +15s
              </button>
            </div>

            {/* Quick Intensity / Joint Comfort Feedback during Rest */}
            <div className="w-full glass-card rounded-2xl p-3.5 sm:p-4 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Como sentiu a última série?</span>
                {lastSetFeedback && (
                  <span className="text-[10px] text-emerald-400 font-semibold">Registrado</span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setLastSetFeedback('facil')}
                  className={`h-10 rounded-xl text-xs font-semibold transition ${
                    lastSetFeedback === 'facil' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  Fácil
                </button>
                <button
                  type="button"
                  onClick={() => setLastSetFeedback('ideal')}
                  className={`h-10 rounded-xl text-xs font-semibold transition ${
                    lastSetFeedback === 'ideal' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  Ideal
                </button>
                <button
                  type="button"
                  onClick={() => setLastSetFeedback('dificil')}
                  className={`h-10 rounded-xl text-xs font-semibold transition ${
                    lastSetFeedback === 'dificil' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  Pesado
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLastSetFeedback('dor');
                    setShowAdaptationModal(true);
                  }}
                  className={`h-10 rounded-xl text-xs font-semibold transition ${
                    lastSetFeedback === 'dor' ? 'bg-rose-500 text-white font-bold' : 'bg-white/[0.04] text-rose-300 hover:text-white'
                  }`}
                >
                  Dor / Falha
                </button>
              </div>

              {(lastSetFeedback === 'dificil' || lastSetFeedback === 'dor') && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-amber-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Sentiu desconforto?
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAdaptationModal(true)}
                    className="text-[11px] font-bold text-cyan-400 hover:underline"
                  >
                    Trocar por regressão
                  </button>
                </div>
              )}
            </div>

            {/* Up Next Card Preview */}
            {nextExerciseData && (
              <div className="w-full glass-card rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs border border-white/10 shadow-lg">
                <div className="flex items-center gap-3 min-w-0">
                  {nextExerciseData.videoThumbnail ? (
                    <img
                      src={nextExerciseData.videoThumbnail}
                      alt={nextExerciseData.name}
                      className="w-11 h-11 rounded-xl object-cover bg-black/40 border border-white/10 shrink-0 shadow-md"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                      <Play className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-emerald-400 font-extrabold block text-[10px] uppercase tracking-widest">
                      A Seguir:
                    </span>
                    <span className="font-black text-slate-100 text-xs sm:text-sm truncate block">
                      {nextExerciseData.name}
                    </span>
                    <span className="text-slate-400 block text-[10px] sm:text-[11px] mt-0.5 font-medium truncate">
                      {nextIsSameExercise ? `Série ${setIndex + 2} de ${currentRoutineExercise.sets}` : 'Primeira série do próximo'}
                    </span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 glow-emerald shrink-0">
                  <Play className="w-4 h-4 fill-current" />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Workout Navigation Bar (Equal 48px height, 3-column grid) */}
      <footer className="w-full shrink-0 glass-panel border-t border-white/10 backdrop-blur-2xl px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] box-border">
        <div className="grid grid-cols-3 gap-2 w-full max-w-md mx-auto">
          {/* Button 1: Anterior */}
          <button
            type="button"
            disabled={isFirstSetOfFirstExercise}
            onClick={handlePreviousStep}
            className="h-12 rounded-2xl glass-card text-slate-200 text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.08] active:scale-95 transition"
            aria-label="Série anterior"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span>Anterior</span>
          </button>

          {/* Button 2: Finalizar Treino (Destaque Principal) */}
          <button
            type="button"
            onClick={() => {
              soundManager.triggerHaptic([30]);
              handleTriggerFinish();
            }}
            className="h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition glow-emerald"
            aria-label="Finalizar Treino"
          >
            <span>Finalizar</span>
          </button>

          {/* Button 3: Próximo */}
          <button
            type="button"
            disabled={isLastSetOfLastExercise}
            onClick={handleNextStep}
            className="h-12 rounded-2xl glass-card text-slate-200 text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.08] active:scale-95 transition"
            aria-label="Próxima série"
          >
            <span>Próximo</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </footer>

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
              {currentExerciseData.reviewedBy && (
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                    ✓ Revisão Técnica Biomecânica
                  </span>
                  <p className="text-slate-200 font-bold">
                    {currentExerciseData.reviewedBy.name} • {currentExerciseData.reviewedBy.cref}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {currentExerciseData.reviewedBy.specialty}
                  </p>
                </div>
              )}
              {currentExerciseData.safetyCautions && currentExerciseData.safetyCautions.length > 0 && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Atenção & Proteção Articular
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-rose-200/90 space-y-1">
                    {currentExerciseData.safetyCautions.map((caution, i) => (
                      <li key={i}>{caution}</li>
                    ))}
                  </ul>
                </div>
              )}
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

      {/* Slide-over In-Workout Adaptation & Regression Drawer */}
      {showAdaptationModal && currentExerciseData && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg max-h-[85vh] glass-panel border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Ajuste sem Interromper a Sessão
                </span>
                <h3 className="font-black text-sm text-slate-100">
                  Trocar: {currentExerciseData.name}
                </h3>
              </div>
              <button
                onClick={() => setShowAdaptationModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              {/* Regressões Diretas */}
              {currentExerciseData.regressoes && currentExerciseData.regressoes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Regressão Direta (Carga Mais Leve):
                  </span>
                  {currentExerciseData.regressoes.map(regId => {
                    const target = getExerciseById(regId);
                    if (!target) return null;
                    return (
                      <div key={regId} className="glass-card p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-slate-100">{target.name}</div>
                          <div className="text-[10px] text-slate-400">{target.difficulty} • {target.category}</div>
                        </div>
                        <button
                          onClick={() => handleSwapCurrentExercise(target)}
                          className="px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs shadow-md active:scale-95"
                        >
                          Trocar Agora
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Adaptações por Articulação */}
              {currentExerciseData.adaptacoes && Object.keys(currentExerciseData.adaptacoes).length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Adaptações por Desconforto Articular:
                  </span>
                  {Object.entries(currentExerciseData.adaptacoes).map(([joint, altIds]) => (
                    <div key={joint} className="glass-card p-3 rounded-2xl border border-white/5 space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-300 capitalize">
                        Para alívio no {joint}:
                      </span>
                      <div className="space-y-1 pl-2">
                        {altIds?.map(altId => {
                          const target = getExerciseById(altId);
                          if (!target) return null;
                          return (
                            <div key={altId} className="flex items-center justify-between gap-2">
                              <span className="text-xs text-slate-200">{target.name}</span>
                              <button
                                onClick={() => handleSwapCurrentExercise(target)}
                                className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] active:scale-95"
                              >
                                Usar esta versão
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowAdaptationModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Manter Exercício Atual
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
                  clearActiveWorkoutBackup();
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
