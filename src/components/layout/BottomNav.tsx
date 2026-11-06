import React from 'react';
import { Dumbbell, BookOpen, Trophy, Play } from 'lucide-react';

export type NavTab = 'routines' | 'exercises' | 'history';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeWorkoutRoutineTitle?: string | null;
  onResumeWorkout?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  activeWorkoutRoutineTitle,
  onResumeWorkout,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 px-4 py-2 flex flex-col items-center">
      {/* Active Workout Floating Pill if minimized */}
      {activeWorkoutRoutineTitle && onResumeWorkout && (
        <div className="w-full max-w-md -mt-6 mb-2">
          <button
            onClick={onResumeWorkout}
            className="w-full py-2 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-between shadow-xl shadow-emerald-500/30 animate-pulse"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
              <span>Treino em Andamento: {activeWorkoutRoutineTitle}</span>
            </div>
            <span className="flex items-center gap-1 font-extrabold uppercase text-[10px]">
              Retomar <Play className="w-3 h-3 fill-current" />
            </span>
          </button>
        </div>
      )}

      {/* Main Tab Buttons */}
      <div className="w-full max-w-md grid grid-cols-3 gap-2">
        <button
          onClick={() => onTabChange('routines')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition active:scale-95 ${
            activeTab === 'routines'
              ? 'text-emerald-400 bg-emerald-500/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dumbbell className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Rotinas</span>
        </button>

        <button
          onClick={() => onTabChange('exercises')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition active:scale-95 ${
            activeTab === 'exercises'
              ? 'text-emerald-400 bg-emerald-500/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Exercícios</span>
        </button>

        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition active:scale-95 ${
            activeTab === 'history'
              ? 'text-emerald-400 bg-emerald-500/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Histórico</span>
        </button>
      </div>
    </div>
  );
};

