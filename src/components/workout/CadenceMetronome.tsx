import { useState, useEffect } from 'react';
import { soundManager } from '../../utils/audio';
import { Activity, Play, Pause, ChevronDown, ChevronUp } from 'lucide-react';

interface CadenceMetronomeProps {
  onTempoTick?: (phase: 'down' | 'hold-bottom' | 'up' | 'hold-top', count: number) => void;
}

export const CadenceMetronome = ({ onTempoTick }: CadenceMetronomeProps) => {
  const [isActive, setIsActive] = useState(false);
  const [tempo, setTempo] = useState<{ down: number; holdBottom: number; up: number; holdTop: number }>({
    down: 3,
    holdBottom: 1,
    up: 1,
    holdTop: 0,
  });
  const [showConfig, setShowConfig] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'down' | 'hold-bottom' | 'up' | 'hold-top'>('down');
  const [currentSecond, setCurrentSecond] = useState(1);

  useEffect(() => {
    if (!isActive) {
      setCurrentPhase('down');
      setCurrentSecond(1);
      return;
    }

    const interval = setInterval(() => {
      soundManager.playCountdownBeep();

      setCurrentSecond(prevSec => {
        if (currentPhase === 'down') {
          if (prevSec >= tempo.down) {
            if (tempo.holdBottom > 0) {
              setCurrentPhase('hold-bottom');
              return 1;
            } else {
              setCurrentPhase('up');
              return 1;
            }
          }
          return prevSec + 1;
        }

        if (currentPhase === 'hold-bottom') {
          if (prevSec >= tempo.holdBottom) {
            setCurrentPhase('up');
            return 1;
          }
          return prevSec + 1;
        }

        if (currentPhase === 'up') {
          if (prevSec >= tempo.up) {
            if (tempo.holdTop > 0) {
              setCurrentPhase('hold-top');
              return 1;
            } else {
              setCurrentPhase('down');
              return 1;
            }
          }
          return prevSec + 1;
        }

        if (currentPhase === 'hold-top') {
          if (prevSec >= tempo.holdTop) {
            setCurrentPhase('down');
            return 1;
          }
          return prevSec + 1;
        }

        return 1;
      });

      if (onTempoTick) {
        onTempoTick(currentPhase, currentSecond);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentPhase, currentSecond, tempo, onTempoTick]);

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'down':
        return 'text-sky-400 border-sky-500/40 bg-sky-500/10';
      case 'hold-bottom':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      case 'up':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
      case 'hold-top':
        return 'text-purple-400 border-purple-500/40 bg-purple-500/10';
    }
  };

  const getPhaseName = () => {
    switch (currentPhase) {
      case 'down':
        return `Descida Excêntrica ⬇️ (${currentSecond}/${tempo.down}s)`;
      case 'hold-bottom':
        return `Pausa / Isometria Baixa ⏸️ (${currentSecond}/${tempo.holdBottom}s)`;
      case 'up':
        return `Subida Concêntrica ⬆️ (${currentSecond}/${tempo.up}s)`;
      case 'hold-top':
        return `Lockout no Topo ⏸️ (${currentSecond}/${tempo.holdTop}s)`;
    }
  };

  return (
    <div className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${isActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="font-semibold text-slate-200">Metrônomo de Cadência (TUT)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            {tempo.down}-{tempo.holdBottom}-{tempo.up}-{tempo.holdTop}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="p-1 rounded text-slate-400 hover:text-white"
            title="Ajustar tempo"
          >
            {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition ${
              isActive
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
            }`}
          >
            {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{isActive ? 'Pausar' : 'Ativar'}</span>
          </button>
        </div>
      </div>

      {/* Active Phase Bar */}
      {isActive && (
        <div className={`mt-2.5 p-2 rounded-xl border text-center font-bold text-xs transition-all ${getPhaseColor()}`}>
          {getPhaseName()}
        </div>
      )}

      {/* Cadence Settings Configuration */}
      {showConfig && (
        <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-4 gap-2 text-center text-[11px]">
          <div>
            <label className="text-slate-400 block mb-0.5">Descida</label>
            <input
              type="number"
              min="1"
              max="10"
              value={tempo.down}
              onChange={e => setTempo({ ...tempo, down: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded p-1 text-center font-bold"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-0.5">Pausa</label>
            <input
              type="number"
              min="0"
              max="5"
              value={tempo.holdBottom}
              onChange={e => setTempo({ ...tempo, holdBottom: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded p-1 text-center font-bold"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-0.5">Subida</label>
            <input
              type="number"
              min="1"
              max="5"
              value={tempo.up}
              onChange={e => setTempo({ ...tempo, up: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded p-1 text-center font-bold"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-0.5">Topo</label>
            <input
              type="number"
              min="0"
              max="5"
              value={tempo.holdTop}
              onChange={e => setTempo({ ...tempo, holdTop: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded p-1 text-center font-bold"
            />
          </div>
        </div>
      )}
    </div>
  );
};

