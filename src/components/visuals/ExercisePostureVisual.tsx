import React, { useState, useEffect } from 'react';
import type { Exercise } from '../../types';
import { Play, Pause, AlertTriangle, Wind, ChevronDown } from 'lucide-react';

interface ExercisePostureVisualProps {
  exercise: Exercise;
  className?: string;
  embedded?: boolean;
}

export const ExercisePostureVisual: React.FC<ExercisePostureVisualProps> = ({
  exercise,
  className = '',
  embedded = false,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMistakesOpen, setIsMistakesOpen] = useState<boolean>(false);

  // Auto-play steps loop
  useEffect(() => {
    if (!isPlaying || exercise.executionSteps.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentStepIndex(prev => (prev + 1) % exercise.executionSteps.length);
    }, 2800);

    return () => clearInterval(timer);
  }, [isPlaying, exercise.executionSteps.length]);

  const activeStep = exercise.executionSteps[currentStepIndex] || exercise.executionSteps[0];

  // Specific dynamic SVG illustration based on animationType and current step
  const renderGraphicIllustration = () => {
    const isStepTwoOrHigher = currentStepIndex >= 1;

    switch (exercise.animationType) {
      case 'pushup':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full">
            <defs>
              <linearGradient id="groundGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>
            {/* Floor */}
            <line x1="20" y1="150" x2="300" y2="150" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <rect x="20" y="152" width="280" height="10" fill="url(#groundGrad)" rx="2" />

            {/* Pushup Human Figure (Transitions between top and bottom) */}
            {isStepTwoOrHigher ? (
              // Bottom Position (Chest near ground, elbows bent 45°)
              <g className="transition-all duration-500 ease-in-out">
                {/* Feet */}
                <circle cx="50" cy="144" r="5" fill="#38bdf8" />
                {/* Body straight line (Lower position) */}
                <line x1="50" y1="144" x2="220" y2="128" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
                {/* Head */}
                <circle cx="236" cy="125" r="9" fill="#10b981" />
                {/* Arms bent */}
                <polyline points="205,130 195,115 195,148" fill="none" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                {/* Hand on floor */}
                <circle cx="195" cy="148" r="4" fill="#38bdf8" />

                {/* Chest distance indicator */}
                <line x1="210" y1="135" x2="210" y2="148" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                <text x="218" y="144" fill="#f59e0b" fontSize="10" fontWeight="bold">3cm</text>

                {/* Force Vector (Pushing Up) */}
                <g className="animate-bounce">
                  <line x1="195" y1="110" x2="195" y2="92" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" />
                  <polygon points="195,86 190,96 200,96" fill="#10b981" />
                  <text x="205" y="96" fill="#10b981" fontSize="10" fontWeight="bold">Empurre</text>
                </g>
              </g>
            ) : (
              // Top Position (Plank with extended arms)
              <g className="transition-all duration-500 ease-in-out">
                {/* Feet */}
                <circle cx="50" cy="144" r="5" fill="#38bdf8" />
                {/* Body straight line */}
                <line x1="50" y1="144" x2="210" y2="90" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
                {/* Head */}
                <circle cx="228" cy="82" r="9" fill="#10b981" />
                {/* Straight Arm */}
                <line x1="195" y1="94" x2="195" y2="148" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                <circle cx="195" cy="148" r="4" fill="#38bdf8" />

                {/* Core Alignment Line */}
                <line x1="45" y1="148" x2="235" y2="78" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                <text x="16" y="24" fill="#10b981" fontSize="11" fontWeight="bold">Tronco Neutro 180°</text>
              </g>
            )}
          </svg>
        );

      case 'pullup':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            {/* Pull-up Bar */}
            <line x1="40" y1="28" x2="280" y2="28" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <rect x="156" y="8" width="8" height="20" fill="#64748b" />

            {isStepTwoOrHigher ? (
              // Chin over bar position
              <g className="transition-all duration-500 ease-in-out">
                {/* Hands on bar */}
                <circle cx="130" cy="28" r="5" fill="#38bdf8" />
                <circle cx="190" cy="28" r="5" fill="#38bdf8" />
                {/* Head above bar */}
                <circle cx="160" cy="20" r="10" fill="#10b981" />
                {/* Bent Arms */}
                <path d="M130 28 Q115 50 145 60" fill="none" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                <path d="M190 28 Q205 50 175 60" fill="none" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                {/* Torso */}
                <line x1="160" y1="50" x2="160" y2="120" stroke="#10b981" strokeWidth="14" strokeLinecap="round" />
                {/* Legs (Hollow body slightly forward) */}
                <line x1="160" y1="120" x2="155" y2="175" stroke="#38bdf8" strokeWidth="9" strokeLinecap="round" />
                <circle cx="154" cy="180" r="4" fill="#38bdf8" />

                {/* Queixo acima da barra tag */}
                <line x1="175" y1="20" x2="230" y2="20" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="235" y="24" fill="#10b981" fontSize="10" fontWeight="bold">Queixo Acima ✓</text>
              </g>
            ) : (
              // Dead Hang / Active Hang
              <g className="transition-all duration-500 ease-in-out">
                {/* Hands on bar */}
                <circle cx="135" cy="28" r="5" fill="#38bdf8" />
                <circle cx="185" cy="28" r="5" fill="#38bdf8" />
                {/* Extended Arms */}
                <line x1="135" y1="28" x2="148" y2="75" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                <line x1="185" y1="28" x2="172" y2="75" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                {/* Head below bar */}
                <circle cx="160" cy="65" r="10" fill="#10b981" />
                {/* Torso */}
                <line x1="160" y1="78" x2="160" y2="140" stroke="#10b981" strokeWidth="14" strokeLinecap="round" />
                {/* Legs straight */}
                <line x1="160" y1="140" x2="160" y2="185" stroke="#38bdf8" strokeWidth="9" strokeLinecap="round" />

                {/* Pull Vector arrow */}
                <polygon points="160,85 155,95 165,95" fill="#10b981" />
                <line x1="160" y1="95" x2="160" y2="115" stroke="#10b981" strokeWidth="3" />
                <text x="175" y="105" fill="#10b981" fontSize="10" fontWeight="bold">Puxada</text>
              </g>
            )}
          </svg>
        );

      case 'dip':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            {/* Parallel Bars */}
            <rect x="70" y="90" width="180" height="8" rx="4" fill="#94a3b8" />
            <line x1="90" y1="98" x2="90" y2="180" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
            <line x1="230" y1="98" x2="230" y2="180" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />

            {isStepTwoOrHigher ? (
              // Bottom 90 degree position
              <g className="transition-all duration-500 ease-in-out">
                {/* Hands on bar */}
                <circle cx="140" cy="90" r="5" fill="#38bdf8" />
                <circle cx="180" cy="90" r="5" fill="#38bdf8" />
                {/* Elbow bent 90° */}
                <polyline points="140,90 120,70 148,65" fill="none" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="180,90 200,70 172,65" fill="none" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                {/* Head */}
                <circle cx="160" cy="45" r="9" fill="#10b981" />
                {/* Torso leaned slightly forward */}
                <line x1="160" y1="55" x2="155" y2="120" stroke="#10b981" strokeWidth="13" strokeLinecap="round" />
                {/* Bent legs */}
                <polyline points="155,120 170,145 160,165" fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />

                {/* 90 deg badge */}
                <text x="95" y="65" fill="#f59e0b" fontSize="11" fontWeight="bold">90° Cotovelo</text>
              </g>
            ) : (
              // Top Lockout Position
              <g className="transition-all duration-500 ease-in-out">
                {/* Hands on bar */}
                <circle cx="145" cy="90" r="5" fill="#38bdf8" />
                <circle cx="175" cy="90" r="5" fill="#38bdf8" />
                {/* Straight Arms */}
                <line x1="145" y1="90" x2="148" y2="48" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                <line x1="175" y1="90" x2="172" y2="48" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                {/* Head */}
                <circle cx="160" cy="30" r="9" fill="#10b981" />
                {/* Torso */}
                <line x1="160" y1="42" x2="160" y2="105" stroke="#10b981" strokeWidth="13" strokeLinecap="round" />
                {/* Legs */}
                <polyline points="160,105 172,135 165,160" fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />

                <text x="185" y="40" fill="#10b981" fontSize="10" fontWeight="bold">Ombros Baixos ✓</text>
              </g>
            )}
          </svg>
        );

      case 'squat':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            {/* Ground */}
            <line x1="30" y1="180" x2="290" y2="180" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

            {isStepTwoOrHigher ? (
              // Deep squat (hips below knees)
              <g className="transition-all duration-500 ease-in-out">
                {/* Feet */}
                <rect x="110" y="174" width="25" height="6" rx="2" fill="#38bdf8" />
                <rect x="185" y="174" width="25" height="6" rx="2" fill="#38bdf8" />
                {/* Shins */}
                <line x1="125" y1="174" x2="115" y2="125" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
                <line x1="195" y1="174" x2="205" y2="125" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
                {/* Thighs parallel to floor */}
                <line x1="115" y1="125" x2="160" y2="128" stroke="#10b981" strokeWidth="10" strokeLinecap="round" />
                <line x1="205" y1="125" x2="160" y2="128" stroke="#10b981" strokeWidth="10" strokeLinecap="round" />
                {/* Torso upright */}
                <line x1="160" y1="128" x2="160" y2="70" stroke="#10b981" strokeWidth="13" strokeLinecap="round" />
                {/* Arms forward for counterbalance */}
                <line x1="160" y1="78" x2="195" y2="78" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
                {/* Head */}
                <circle cx="160" cy="55" r="9" fill="#10b981" />

                {/* Depth line */}
                <line x1="90" y1="128" x2="230" y2="128" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="235" y="132" fill="#f59e0b" fontSize="10" fontWeight="bold">Abaixo de 90° ✓</text>
              </g>
            ) : (
              // Standing start
              <g className="transition-all duration-500 ease-in-out">
                {/* Feet */}
                <rect x="130" y="174" width="20" height="6" rx="2" fill="#38bdf8" />
                <rect x="170" y="174" width="20" height="6" rx="2" fill="#38bdf8" />
                {/* Legs straight */}
                <line x1="140" y1="174" x2="148" y2="105" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
                <line x1="180" y1="174" x2="172" y2="105" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
                {/* Torso */}
                <line x1="160" y1="105" x2="160" y2="50" stroke="#10b981" strokeWidth="13" strokeLinecap="round" />
                {/* Head */}
                <circle cx="160" cy="35" r="9" fill="#10b981" />

                <text x="195" y="50" fill="#10b981" fontSize="10" fontWeight="bold">Postura Ereta</text>
              </g>
            )}
          </svg>
        );

      case 'plank':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full">
            {/* Ground */}
            <line x1="20" y1="150" x2="300" y2="150" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

            {/* Forearm Plank (Isometric Neutral Spine) */}
            <g>
              {/* Toes */}
              <circle cx="50" cy="144" r="5" fill="#38bdf8" />
              {/* Body perfectly straight */}
              <line x1="50" y1="144" x2="225" y2="110" stroke="#10b981" strokeWidth="13" strokeLinecap="round" />
              {/* Forearm support: Elbow under shoulder */}
              <line x1="205" y1="114" x2="205" y2="146" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
              <line x1="205" y1="146" x2="235" y2="146" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
              {/* Head neutral */}
              <circle cx="238" cy="105" r="9" fill="#10b981" />

              {/* Laser Straight Spine line */}
              <line x1="45" y1="146" x2="245" y2="102" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Core Activation Badge */}
              <g>
                <circle cx="140" cy="127" r="14" fill="#10b981" opacity="0.2" className="animate-ping" />
                <text x="16" y="24" fill="#10b981" fontSize="11" fontWeight="bold">Transverso Travado 🔒</text>
              </g>
            </g>
          </svg>
        );

      case 'lsit':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full">
            {/* Parallettes */}
            <rect x="80" y="115" width="40" height="6" rx="3" fill="#94a3b8" />
            <line x1="100" y1="120" x2="100" y2="160" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />

            {/* L-Sit Geometry */}
            <g>
              {/* Hands on bar */}
              <circle cx="100" cy="115" r="5" fill="#38bdf8" />
              {/* Locked Arm */}
              <line x1="100" y1="115" x2="100" y2="60" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
              {/* Head */}
              <circle cx="100" cy="42" r="9" fill="#10b981" />
              {/* Torso vertical */}
              <line x1="100" y1="55" x2="100" y2="105" stroke="#10b981" strokeWidth="13" strokeLinecap="round" />
              {/* Legs strictly 90 degrees horizontal */}
              <line x1="100" y1="105" x2="210" y2="105" stroke="#10b981" strokeWidth="11" strokeLinecap="round" />
              {/* Pointed Toes */}
              <line x1="210" y1="105" x2="225" y2="110" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />

              {/* 90 degree angle indicator */}
              <path d="M100 85 L120 85 L120 105" fill="none" stroke="#f59e0b" strokeWidth="2" />
              <text x="130" y="98" fill="#f59e0b" fontSize="11" fontWeight="bold">90° Perfeito</text>
            </g>
          </svg>
        );

      case 'handstand':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            {/* Floor */}
            <line x1="40" y1="180" x2="280" y2="180" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            {/* Wall */}
            <line x1="70" y1="10" x2="70" y2="180" stroke="#475569" strokeWidth="4" strokeDasharray="4 4" />
            <text x="45" y="40" fill="#64748b" fontSize="10">Parede</text>

            {/* Handstand Line */}
            <g>
              {/* Hands on ground */}
              <circle cx="100" cy="176" r="5" fill="#38bdf8" />
              {/* Arms pushing ground */}
              <line x1="100" y1="176" x2="100" y2="125" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
              {/* Head neutral between shoulders */}
              <circle cx="100" cy="132" r="8" fill="#10b981" />
              {/* Torso straight line */}
              <line x1="100" y1="125" x2="100" y2="70" stroke="#10b981" strokeWidth="13" strokeLinecap="round" />
              {/* Legs extended upward */}
              <line x1="100" y1="70" x2="100" y2="20" stroke="#10b981" strokeWidth="9" strokeLinecap="round" />
              {/* Pointed toes */}
              <line x1="100" y1="20" x2="100" y2="10" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />

              {/* Straight 180° Vertical axis */}
              <line x1="100" y1="5" x2="100" y2="180" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
              <text x="120" y="60" fill="#10b981" fontSize="11" fontWeight="bold">Linha Vertical 180°</text>
              <text x="120" y="78" fill="#38bdf8" fontSize="10">Elevação de Escápula ✓</text>
            </g>
          </svg>
        );

      case 'frontlever':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full">
            <line x1="60" y1="25" x2="260" y2="25" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <line x1="110" y1="25" x2="110" y2="85" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
            <circle cx="110" cy="25" r="5" fill="#38bdf8" />
            <circle cx="85" cy="85" r="9" fill="#10b981" />
            <line x1="95" y1="85" x2="250" y2="85" stroke="#10b981" strokeWidth="13" strokeLinecap="round" />
            <line x1="250" y1="85" x2="265" y2="85" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
            <line x1="75" y1="92" x2="260" y2="92" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="140" y="70" fill="#10b981" fontSize="11" fontWeight="bold">180° Horizontal</text>
            <text x="140" y="112" fill="#38bdf8" fontSize="10">Depressão Escapular Ativa</text>
          </svg>
        );

      case 'planche':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full">
            <line x1="20" y1="150" x2="300" y2="150" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <circle cx="120" cy="146" r="5" fill="#38bdf8" />
            <line x1="120" y1="146" x2="160" y2="85" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
            <circle cx="180" cy="78" r="9" fill="#10b981" />
            <line x1="170" y1="85" x2="50" y2="144" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            <circle cx="50" cy="144" r="5" fill="#38bdf8" />
            <line x1="120" y1="146" x2="120" y2="60" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M120 100 Q140 100 145 110" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <text x="135" y="72" fill="#f59e0b" fontSize="10" fontWeight="bold">Inclinação 45°</text>
            <text x="170" y="120" fill="#10b981" fontSize="10" fontWeight="bold">Protração Máxima</text>
          </svg>
        );

      case 'pistolsquat':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full">
            <line x1="30" y1="160" x2="290" y2="160" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <rect x="110" y="154" width="22" height="6" rx="2" fill="#38bdf8" />
            <line x1="120" y1="154" x2="120" y2="115" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            <line x1="120" y1="115" x2="125" y2="118" stroke="#10b981" strokeWidth="10" strokeLinecap="round" />
            <line x1="125" y1="118" x2="220" y2="118" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            <circle cx="225" cy="118" r="4" fill="#38bdf8" />
            <line x1="125" y1="118" x2="140" y2="70" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            <circle cx="145" cy="55" r="9" fill="#10b981" />
            <line x1="140" y1="78" x2="185" y2="78" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
            <text x="170" y="105" fill="#10b981" fontSize="10" fontWeight="bold">Perna 100% Horizontal</text>
          </svg>
        );

      default:
        // Generic Calisthenics Vector with motion arrows
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full">
            <line x1="40" y1="150" x2="280" y2="150" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <circle cx="160" cy="60" r="14" fill="#10b981" />
            <line x1="160" y1="75" x2="160" y2="120" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            <line x1="160" y1="120" x2="140" y2="148" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
            <line x1="160" y1="120" x2="180" y2="148" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
            {/* Arrows */}
            <circle cx="160" cy="90" r="40" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="6 6" />
          </svg>
        );
    }
  };

  const containerClasses = embedded
    ? `w-full overflow-hidden ${className}`
    : `w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg ${className}`;

  return (
    <div className={containerClasses}>
      {/* Visual Canvas Stage (Fixed 16:9 aspect-ratio, contain) */}
      <div className="relative w-full aspect-[16/9] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-2 overflow-hidden">
        {renderGraphicIllustration()}

        {/* Play/Pause Animation Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95"
          title={isPlaying ? 'Pausar animação' : 'Reproduzir animação'}
          aria-label={isPlaying ? 'Pausar animação' : 'Reproduzir animação'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Dedicated Breathing Cue Row right below animation */}
      {exercise.breathingTip && (
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-950/70 border-t border-slate-800/80 text-[11px] text-slate-300">
          <Wind className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="leading-snug">{exercise.breathingTip}</span>
        </div>
      )}

      {/* Compact Steps Indicator (Passo X de Y + segmented bars) */}
      {exercise.executionSteps && exercise.executionSteps.length > 0 && (
        <div className="px-3.5 py-2.5 bg-slate-950/50 border-t border-slate-800/70 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">
              Passo {currentStepIndex + 1} de {exercise.executionSteps.length}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 truncate max-w-[190px]">
              {activeStep.title}
            </span>
          </div>

          {/* Segmented clickable progress bars */}
          <div className="flex items-center gap-1.5 w-full">
            {exercise.executionSteps.map((step, idx) => (
              <button
                key={step.step}
                type="button"
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                }}
                aria-label={`Passo ${step.step}: ${step.title}`}
                className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                  currentStepIndex === idx
                    ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                    : idx < currentStepIndex
                    ? 'bg-emerald-600/70 hover:bg-emerald-500'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Current Step Description Card */}
      <div className="p-3 sm:p-4 space-y-2.5 border-t border-slate-800/60">
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
            {activeStep.step}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-100">{activeStep.title}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeStep.description}</p>
          </div>
        </div>

        {/* Common Mistakes to Avoid Accordion (collapsed by default) */}
        {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setIsMistakesOpen(!isMistakesOpen)}
              className="w-full flex items-center justify-between py-1 text-xs font-bold text-rose-400 hover:text-rose-300 transition"
              aria-expanded={isMistakesOpen}
            >
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Erros Críticos a Evitar ({exercise.commonMistakes.length})
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMistakesOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMistakesOpen && (
              <div className="mt-2 space-y-1.5 animate-in fade-in duration-150">
                {exercise.commonMistakes.map((m, i) => (
                  <div key={i} className="text-xs bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5 text-slate-300">
                    <div className="text-rose-300 font-semibold">❌ {m.mistake}</div>
                    <div className="text-emerald-400 mt-1">✓ Correção: {m.correction}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
