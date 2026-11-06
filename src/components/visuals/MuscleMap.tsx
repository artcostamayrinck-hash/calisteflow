import type { MuscleGroup } from '../../types';
import { MUSCLE_LABELS } from '../../data/exercisesData';

interface MuscleMapProps {
  primaryMuscles?: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
  selectedMuscle?: MuscleGroup | null;
  onSelectMuscle?: (muscle: MuscleGroup) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MuscleMap = ({
  primaryMuscles = [],
  secondaryMuscles = [],
  selectedMuscle = null,
  onSelectMuscle,
  className = '',
  size = 'md',
}: MuscleMapProps) => {
  const getMuscleColor = (muscle: MuscleGroup) => {
    if (selectedMuscle === muscle) {
      return '#f59e0b'; // Amber for currently selected
    }
    if (primaryMuscles.includes(muscle)) {
      return '#10b981'; // Primary: Vibrant Emerald
    }
    if (secondaryMuscles.includes(muscle)) {
      return '#06b6d4'; // Secondary: Bright Cyan
    }
    return '#334155'; // Inactive: Dark slate
  };

  const getMuscleOpacity = (muscle: MuscleGroup) => {
    if (primaryMuscles.includes(muscle) || secondaryMuscles.includes(muscle) || selectedMuscle === muscle) {
      return 1;
    }
    return 0.45;
  };

  const handleMuscleClick = (m: MuscleGroup) => {
    if (onSelectMuscle) {
      onSelectMuscle(m);
    }
  };

  const isInteractive = Boolean(onSelectMuscle);

  const containerSizes = {
    sm: 'max-w-[240px]',
    md: 'max-w-[340px]',
    lg: 'max-w-[440px]',
  };

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      {/* Front and Back Human Body SVG Silhouettes */}
      <div className={`w-full ${containerSizes[size]} grid grid-cols-2 gap-3 glass-card p-4 sm:p-5 rounded-3xl border border-white/10 shadow-2xl`}>
        {/* Front View */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
            Vista Frontal
          </span>
          <svg
            viewBox="0 0 100 200"
            className="w-full h-auto drop-shadow-lg filter"
            aria-label="Mapa Muscular Frontal"
          >
            <defs>
              <filter id="neonGlowFront" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#10b981" floodOpacity="0.4" />
              </filter>
            </defs>
            {/* Head */}
            <circle cx="50" cy="18" r="10" fill="#475569" opacity="0.6" />
            {/* Neck */}
            <rect x="47" y="27" width="6" height="7" rx="2" fill="#475569" opacity="0.6" />

            {/* Deltoids / Shoulders Front */}
            <g
              onClick={() => handleMuscleClick('ombros')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              <ellipse cx="28" cy="40" rx="7" ry="9" fill={getMuscleColor('ombros')} opacity={getMuscleOpacity('ombros')} />
              <ellipse cx="72" cy="40" rx="7" ry="9" fill={getMuscleColor('ombros')} opacity={getMuscleOpacity('ombros')} />
            </g>

            {/* Chest / Peitoral */}
            <g
              onClick={() => handleMuscleClick('peito')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              <path
                d="M36 36 Q50 38 64 36 Q64 54 51 55 Q36 54 36 36 Z"
                fill={getMuscleColor('peito')}
                opacity={getMuscleOpacity('peito')}
              />
              <line x1="50" y1="37" x2="50" y2="54" stroke="#0f172a" strokeWidth="1" />
            </g>

            {/* Biceps */}
            <g
              onClick={() => handleMuscleClick('biceps')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              <ellipse cx="24" cy="55" rx="5" ry="8" fill={getMuscleColor('biceps')} opacity={getMuscleOpacity('biceps')} />
              <ellipse cx="76" cy="55" rx="5" ry="8" fill={getMuscleColor('biceps')} opacity={getMuscleOpacity('biceps')} />
            </g>

            {/* Forearms / Antebraco Front */}
            <g
              onClick={() => handleMuscleClick('antebraco')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              <ellipse cx="20" cy="74" rx="4.5" ry="10" fill={getMuscleColor('antebraco')} opacity={getMuscleOpacity('antebraco')} />
              <ellipse cx="80" cy="74" rx="4.5" ry="10" fill={getMuscleColor('antebraco')} opacity={getMuscleOpacity('antebraco')} />
            </g>

            {/* Abdominals / Core */}
            <g
              onClick={() => handleMuscleClick('abdomen')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              <rect x="42" y="58" width="16" height="24" rx="3" fill={getMuscleColor('abdomen')} opacity={getMuscleOpacity('abdomen')} />
              {/* Six pack grid lines */}
              <line x1="50" y1="58" x2="50" y2="82" stroke="#0f172a" strokeWidth="1" />
              <line x1="42" y1="66" x2="58" y2="66" stroke="#0f172a" strokeWidth="0.8" />
              <line x1="42" y1="74" x2="58" y2="74" stroke="#0f172a" strokeWidth="0.8" />
            </g>

            {/* Pelvis */}
            <path d="M40 83 H60 L56 94 H44 Z" fill="#334155" opacity="0.4" />

            {/* Quadriceps (Front Thighs) */}
            <g
              onClick={() => handleMuscleClick('quadriceps')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              <path
                d="M38 95 C38 95 34 116 37 132 C39 135 44 135 46 132 C47 116 48 95 48 95 Z"
                fill={getMuscleColor('quadriceps')}
                opacity={getMuscleOpacity('quadriceps')}
              />
              <path
                d="M52 95 C52 95 53 116 54 132 C56 135 61 135 63 132 C66 116 62 95 62 95 Z"
                fill={getMuscleColor('quadriceps')}
                opacity={getMuscleOpacity('quadriceps')}
              />
            </g>

            {/* Knees */}
            <circle cx="41" cy="136" r="3.5" fill="#475569" opacity="0.5" />
            <circle cx="59" cy="136" r="3.5" fill="#475569" opacity="0.5" />

            {/* Calves Front (Tibialis & Shin) */}
            <g
              onClick={() => handleMuscleClick('panturrilhas')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              <path d="M38 140 Q35 155 39 174 Q43 174 44 155 Q43 140 38 140 Z" fill={getMuscleColor('panturrilhas')} opacity={getMuscleOpacity('panturrilhas')} />
              <path d="M62 140 Q65 155 61 174 Q57 174 56 155 Q57 140 62 140 Z" fill={getMuscleColor('panturrilhas')} opacity={getMuscleOpacity('panturrilhas')} />
            </g>

            {/* Feet */}
            <ellipse cx="37" cy="180" rx="4" ry="4" fill="#334155" opacity="0.4" />
            <ellipse cx="63" cy="180" rx="4" ry="4" fill="#334155" opacity="0.4" />
          </svg>
        </div>

        {/* Back View */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
            Vista Posterior
          </span>
          <svg
            viewBox="0 0 100 200"
            className="w-full h-auto drop-shadow-lg filter"
            aria-label="Mapa Muscular Posterior"
          >
            <defs>
              <filter id="neonGlowBack" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#06b6d4" floodOpacity="0.4" />
              </filter>
            </defs>
            {/* Head Back */}
            <circle cx="50" cy="18" r="10" fill="#475569" opacity="0.6" />
            {/* Trapezius & Upper Back */}
            <g
              onClick={() => handleMuscleClick('costas')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              {/* Trapezius / Dorsais */}
              <path
                d="M45 28 L55 28 L64 38 L62 60 L50 66 L38 60 L36 38 Z"
                fill={getMuscleColor('costas')}
                opacity={getMuscleOpacity('costas')}
              />
            </g>

            {/* Shoulders Back */}
            <g
              onClick={() => handleMuscleClick('ombros')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              <ellipse cx="28" cy="40" rx="7" ry="8" fill={getMuscleColor('ombros')} opacity={getMuscleOpacity('ombros')} />
              <ellipse cx="72" cy="40" rx="7" ry="8" fill={getMuscleColor('ombros')} opacity={getMuscleOpacity('ombros')} />
            </g>

            {/* Triceps */}
            <g
              onClick={() => handleMuscleClick('triceps')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              <ellipse cx="23" cy="55" rx="5" ry="9" fill={getMuscleColor('triceps')} opacity={getMuscleOpacity('triceps')} />
              <ellipse cx="77" cy="55" rx="5" ry="9" fill={getMuscleColor('triceps')} opacity={getMuscleOpacity('triceps')} />
            </g>

            {/* Forearms Back */}
            <g
              onClick={() => handleMuscleClick('antebraco')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              <ellipse cx="20" cy="74" rx="4.5" ry="10" fill={getMuscleColor('antebraco')} opacity={getMuscleOpacity('antebraco')} />
              <ellipse cx="80" cy="74" rx="4.5" ry="10" fill={getMuscleColor('antebraco')} opacity={getMuscleOpacity('antebraco')} />
            </g>

            {/* Lower Back / Lombar */}
            <g
              onClick={() => handleMuscleClick('lombar')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              <path d="M42 66 L58 66 L56 80 L44 80 Z" fill={getMuscleColor('lombar')} opacity={getMuscleOpacity('lombar')} />
            </g>

            {/* Gluteus / Glúteos */}
            <g
              onClick={() => handleMuscleClick('gluteos')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              <ellipse cx="44" cy="88" rx="7.5" ry="9" fill={getMuscleColor('gluteos')} opacity={getMuscleOpacity('gluteos')} />
              <ellipse cx="56" cy="88" rx="7.5" ry="9" fill={getMuscleColor('gluteos')} opacity={getMuscleOpacity('gluteos')} />
            </g>

            {/* Hamstrings / Posteriores */}
            <g
              onClick={() => handleMuscleClick('posteriores')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              <path
                d="M37 99 C37 99 34 116 36 130 C38 133 44 133 46 130 C47 116 48 99 48 99 Z"
                fill={getMuscleColor('posteriores')}
                opacity={getMuscleOpacity('posteriores')}
              />
              <path
                d="M52 99 C52 99 53 116 54 130 C56 133 62 133 64 130 C66 116 63 99 63 99 Z"
                fill={getMuscleColor('posteriores')}
                opacity={getMuscleOpacity('posteriores')}
              />
            </g>

            {/* Calves / Panturrilhas Back */}
            <g
              onClick={() => handleMuscleClick('panturrilhas')}
              className={isInteractive ? 'cursor-pointer hover:brightness-125 transition' : ''}
            >
              <ellipse cx="39" cy="154" rx="6" ry="13" fill={getMuscleColor('panturrilhas')} opacity={getMuscleOpacity('panturrilhas')} />
              <ellipse cx="61" cy="154" rx="6" ry="13" fill={getMuscleColor('panturrilhas')} opacity={getMuscleOpacity('panturrilhas')} />
            </g>

            {/* Heels */}
            <ellipse cx="39" cy="177" rx="3.5" ry="4" fill="#334155" opacity="0.4" />
            <ellipse cx="61" cy="177" rx="3.5" ry="4" fill="#334155" opacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Color Code Legend & Targeted Muscle Badges */}
      <div className="w-full mt-3.5 flex flex-wrap items-center justify-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 glass-card px-3 py-1 rounded-full border border-emerald-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 glow-emerald" />
          <span className="text-emerald-300 font-bold text-[11px]">Primário (Alvo)</span>
        </div>
        <div className="flex items-center gap-1.5 glass-card px-3 py-1 rounded-full border border-cyan-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 glow-cyan" />
          <span className="text-cyan-300 font-bold text-[11px]">Secundário (Sinergista)</span>
        </div>
      </div>

      {/* Chips for Active Muscles */}
      {(primaryMuscles.length > 0 || secondaryMuscles.length > 0) && (
        <div className="w-full mt-3 flex flex-wrap justify-center gap-1.5">
          {primaryMuscles.map(m => (
            <span
              key={`p-${m}`}
              onClick={() => handleMuscleClick(m)}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-default shadow-sm glow-emerald"
            >
              {MUSCLE_LABELS[m] || m}
            </span>
          ))}
          {secondaryMuscles.map(m => (
            <span
              key={`s-${m}`}
              onClick={() => handleMuscleClick(m)}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 cursor-default shadow-sm glow-cyan"
            >
              {MUSCLE_LABELS[m] || m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

