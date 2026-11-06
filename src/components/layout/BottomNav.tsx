import { Dumbbell, BookOpen, Trophy, Play, CalendarDays } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export type NavTab = 'routines' | 'planner' | 'exercises' | 'history';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeWorkoutRoutineTitle?: string | null;
  onResumeWorkout?: () => void;
}

export const BottomNav = ({
  activeTab,
  onTabChange,
  activeWorkoutRoutineTitle,
  onResumeWorkout,
}: BottomNavProps) => {
  const handleTabClick = (tab: NavTab) => {
    soundManager.triggerHaptic([30]);
    onTabChange(tab);
  };

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-0 right-0 z-40 px-3 sm:px-4 pointer-events-none flex flex-col items-center">
      {/* Active Workout Floating Banner */}
      {activeWorkoutRoutineTitle && onResumeWorkout && (
        <div className="w-full max-w-sm mb-2 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => {
              soundManager.triggerHaptic([50]);
              onResumeWorkout();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-between shadow-xl shadow-emerald-500/25 active:scale-98 transition glow-emerald"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-950" />
              </span>
              <span className="truncate max-w-[200px]">Treino Ativo: {activeWorkoutRoutineTitle}</span>
            </div>
            <span className="flex items-center gap-1 uppercase tracking-wider text-[11px] bg-slate-950/15 px-2 py-0.5 rounded-lg">
              Retomar <Play className="w-3 h-3 fill-current ml-0.5" />
            </span>
          </button>
        </div>
      )}

      {/* Floating Modern Glass Pill Dock */}
      <nav className="w-full max-w-md pointer-events-auto glass-panel rounded-3xl p-1.5 shadow-2xl border border-white/10 grid grid-cols-4 gap-1 backdrop-blur-2xl">
        <button
          onClick={() => handleTabClick('routines')}
          className={`relative flex flex-col items-center justify-center py-2 px-2 rounded-2xl transition-all duration-200 active:scale-95 ${
            activeTab === 'routines'
              ? 'text-emerald-400 font-bold bg-white/[0.06] shadow-inner'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
          }`}
        >
          <Dumbbell className={`w-5 h-5 mb-1 transition-transform ${activeTab === 'routines' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-wide">Rotinas</span>
          {activeTab === 'routines' && (
            <span className="absolute bottom-1 w-4 h-0.5 bg-emerald-400 rounded-full glow-emerald" />
          )}
        </button>

        <button
          onClick={() => handleTabClick('planner')}
          className={`relative flex flex-col items-center justify-center py-2 px-2 rounded-2xl transition-all duration-200 active:scale-95 ${
            activeTab === 'planner'
              ? 'text-emerald-400 font-bold bg-white/[0.06] shadow-inner'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
          }`}
        >
          <CalendarDays className={`w-5 h-5 mb-1 transition-transform ${activeTab === 'planner' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-wide">Semana</span>
          {activeTab === 'planner' && (
            <span className="absolute bottom-1 w-4 h-0.5 bg-emerald-400 rounded-full glow-emerald" />
          )}
        </button>

        <button
          onClick={() => handleTabClick('exercises')}
          className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
            activeTab === 'exercises'
              ? 'text-emerald-400 font-bold bg-white/[0.06] shadow-inner'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
          }`}
        >
          <BookOpen className={`w-5 h-5 mb-1 transition-transform ${activeTab === 'exercises' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] tracking-wide">Exercícios</span>
          {activeTab === 'exercises' && (
            <span className="absolute bottom-1 w-4 h-0.5 bg-emerald-400 rounded-full glow-emerald" />
          )}
        </button>

        <button
          onClick={() => handleTabClick('history')}
          className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
            activeTab === 'history'
              ? 'text-emerald-400 font-bold bg-white/[0.06] shadow-inner'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
          }`}
        >
          <Trophy className={`w-5 h-5 mb-1 transition-transform ${activeTab === 'history' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] tracking-wide">Progresso</span>
          {activeTab === 'history' && (
            <span className="absolute bottom-1 w-4 h-0.5 bg-emerald-400 rounded-full glow-emerald" />
          )}
        </button>
      </nav>
    </div>
  );
};
