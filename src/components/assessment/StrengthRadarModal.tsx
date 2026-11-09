import React, { useState } from 'react';
import type { StrengthAssessment } from '../../types';
import { saveStrengthAssessment, getStrengthAssessments } from '../../utils/storage';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import { soundManager } from '../../utils/audio';
import {
  X,
  Activity,
  Award,
  ShieldAlert,
} from 'lucide-react';

interface StrengthRadarModalProps {
  onClose: () => void;
}

// Escalas de pontuação 0 a 100 para cada padrão
function calcScore(value: number, minRef: number, maxRef: number): number {
  if (value <= 0) return 15;
  const clamped = Math.min(Math.max(value, 0), maxRef);
  const ratio = (clamped - minRef) / (maxRef - minRef);
  return Math.round(Math.min(100, Math.max(20, 20 + ratio * 80)));
}

export const StrengthRadarModal: React.FC<StrengthRadarModalProps> = ({ onClose }) => {
  useBodyScrollLock(true, onClose);

  const existingAssessments = getStrengthAssessments();
  const lastAssessment = existingAssessments[0] || null;

  // Estado do formulário de teste
  const [pushups, setPushups] = useState<number>(lastAssessment?.rawValues.pushups || 12);
  const [pullups, setPullups] = useState<number>(lastAssessment?.rawValues.pullups || 5);
  const [plankSeconds, setPlankSeconds] = useState<number>(lastAssessment?.rawValues.plankSeconds || 45);
  const [squats, setSquats] = useState<number>(lastAssessment?.rawValues.squats || 25);
  const [dips, setDips] = useState<number>(lastAssessment?.rawValues.dips || 6);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Cálculo dos scores
  const scorePush = calcScore(pushups, 5, 40);
  const scorePull = calcScore(pullups, 2, 20);
  const scoreCore = calcScore(plankSeconds, 20, 120);
  const scoreLegs = calcScore(squats, 10, 60);
  const scoreDip = calcScore(dips, 2, 25);

  const overallScore = Math.round((scorePush + scorePull + scoreCore + scoreLegs + scoreDip) / 5);

  const levelClassification = (() => {
    if (overallScore >= 85) return 'Elite';
    if (overallScore >= 68) return 'Avançado';
    if (overallScore >= 45) return 'Intermediário';
    return 'Iniciante';
  })();

  // Coordenadas Pentágono SVG (cx=120, cy=120, R=80)
  const cx = 120;
  const cy = 120;
  const maxR = 80;

  const axes = [
    { label: 'Push (Flexão)', score: scorePush, raw: `${pushups} reps` },
    { label: 'Pull (Barra)', score: scorePull, raw: `${pullups} reps` },
    { label: 'Core (Prancha)', score: scoreCore, raw: `${plankSeconds}s` },
    { label: 'Legs (Agacho)', score: scoreLegs, raw: `${squats} reps` },
    { label: 'Dip (Mergulho)', score: scoreDip, raw: `${dips} reps` },
  ];

  const getCoord = (angleIdx: number, valueFactor: number) => {
    const angle = -Math.PI / 2 + (angleIdx * 2 * Math.PI) / 5;
    const r = maxR * valueFactor;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Caminho do polígono preenchido do usuário
  const userPolygonPoints = axes
    .map((axis, i) => {
      const coord = getCoord(i, axis.score / 100);
      return `${coord.x.toFixed(1)},${coord.y.toFixed(1)}`;
    })
    .join(' ');

  // Linhas concêntricas da teia (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const handleSave = () => {
    soundManager.triggerHaptic([30, 50]);
    const newAssessment: StrengthAssessment = {
      id: `sa_${Date.now()}`,
      date: new Date().toISOString(),
      scores: {
        push: scorePush,
        pull: scorePull,
        core: scoreCore,
        legs: scoreLegs,
        dip: scoreDip,
      },
      rawValues: {
        pushups,
        pullups,
        plankSeconds,
        squats,
        dips,
      },
      overallScore,
      level: levelClassification,
    };
    saveStrengthAssessment(newAssessment);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="radar-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg glass-panel border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[min(94dvh,calc(100dvh-2rem))] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 id="radar-title" className="text-sm sm:text-base font-black text-slate-100">
                Avaliação de Força Calistênica
              </h2>
              <p className="text-[11px] text-slate-400">
                Gráfico radar dos 5 pilares fundamentais do corpo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar avaliação"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Aviso de Segurança */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-200/90 leading-relaxed font-medium">
              <strong>Aviso de Segurança:</strong> Pare se houver dor aguda articular. Meça repetições completas em boa forma técnica, sem impulso excessivo.
            </p>
          </div>

          {/* Gráfico Radar Pentagonal SVG */}
          <div className="glass-card p-4 rounded-3xl border border-white/10 flex flex-col items-center">
            <div className="w-full max-w-[260px] aspect-square relative flex items-center justify-center">
              <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible">
                {/* Linhas poligonais de grade concêntrica */}
                {gridLevels.map(lvl => {
                  const pts = [0, 1, 2, 3, 4]
                    .map(i => {
                      const c = getCoord(i, lvl);
                      return `${c.x.toFixed(1)},${c.y.toFixed(1)}`;
                    })
                    .join(' ');
                  return (
                    <polygon
                      key={lvl}
                      points={pts}
                      fill={lvl === 1.0 ? 'rgba(255,255,255,0.02)' : 'none'}
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                      strokeDasharray={lvl === 1.0 ? undefined : '2,2'}
                    />
                  );
                })}

                {/* Eixos radiais */}
                {[0, 1, 2, 3, 4].map(i => {
                  const end = getCoord(i, 1.0);
                  return (
                    <line
                      key={i}
                      x1={cx}
                      y1={cy}
                      x2={end.x}
                      y2={end.y}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Área preenchida do usuário */}
                <polygon
                  points={userPolygonPoints}
                  fill="rgba(16, 185, 129, 0.35)"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* Pontos nas pontas */}
                {axes.map((axis, i) => {
                  const c = getCoord(i, axis.score / 100);
                  return (
                    <circle
                      key={i}
                      cx={c.x}
                      cy={c.y}
                      r="4.5"
                      fill="#34d399"
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Score Central & Classificação */}
            <div className="text-center mt-2">
              <div className="flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Nível Calistênico:
                </span>
                <span className="text-xs font-black text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  {levelClassification} ({overallScore}/100)
                </span>
              </div>
            </div>
          </div>

          {/* Sliders / Inputs dos 5 Pilares */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Ajuste suas Marcas Máximas
            </h3>

            {/* 1. Flexões (Push) */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-200">1. Flexões de Braço (Push)</span>
                <span className="text-emerald-400 font-mono font-black">{pushups} reps</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={pushups}
                onChange={e => setPushups(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* 2. Barra Fixa (Pull) */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-200">2. Barra Fixa Pronada (Pull)</span>
                <span className="text-emerald-400 font-mono font-black">{pullups} reps</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={pullups}
                onChange={e => setPullups(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* 3. Prancha (Core) */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-200">3. Prancha no Solo (Core Isométrico)</span>
                <span className="text-emerald-400 font-mono font-black">{plankSeconds}s</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={plankSeconds}
                onChange={e => setPlankSeconds(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* 4. Agachamento (Legs) */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-200">4. Agachamento Livre (Pernas)</span>
                <span className="text-emerald-400 font-mono font-black">{squats} reps</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="1"
                value={squats}
                onChange={e => setSquats(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* 5. Mergulho (Dip) */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-200">5. Mergulho em Paralelas / Banco (Dip)</span>
                <span className="text-emerald-400 font-mono font-black">{dips} reps</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={dips}
                onChange={e => setDips(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-white/10 shrink-0 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 min-h-[48px] py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition glow-emerald"
          >
            {savedSuccess ? '✓ Avaliação Salva!' : 'Salvar Avaliação no Perfil'}
          </button>
        </div>
      </div>
    </div>
  );
};
