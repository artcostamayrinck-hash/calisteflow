import React, { useState } from 'react';
import type { Exercise } from '../../types';
import { getExerciseById, EXERCISES_DATABASE } from '../../data/exercisesData';
import {
  TrendingDown,
  TrendingUp,
  Target,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface QuickProgressionReferenceProps {
  exercise: Exercise;
  onSelectExercise?: (exercise: Exercise) => void;
  className?: string;
}

export const QuickProgressionReference: React.FC<QuickProgressionReferenceProps> = ({
  exercise,
  onSelectExercise,
  className = '',
}) => {
  const [showJointAdaptations, setShowJointAdaptations] = useState<boolean>(false);

  // Dicas biomecânicas dinâmicas de alavanca com base no padrão motor
  const getLeverGuidance = (type: 'easier' | 'harder', padrao?: string) => {
    switch (padrao) {
      case 'empurrar-horizontal':
        return type === 'easier'
          ? 'Eleve as mãos num banco/parede ou apoie os joelhos para reduzir o peso corporal sobre os braços.'
          : 'Abaixe os apoios, eleve os pés numa caixa ou aproxime as mãos para aumentar o braço de momento.';
      case 'puxar-vertical':
      case 'puxar-horizontal':
        return type === 'easier'
          ? 'Incline o corpo mais na vertical ou use elástico de assistência para aliviar a carga nos dorsais.'
          : 'Eleve os pés na linha dos punhos ou transicione para pegadas unilaterais/arqueiro.';
      case 'skills':
        return type === 'easier'
          ? 'Encolha os joelhos junto ao peito (Tuck) para encurtar o torque articular nos ombros e no core.'
          : 'Estenda progressivamente o quadril e as pernas para aumentar o comprimento da alavanca.';
      case 'agachamento-pernas':
        return type === 'easier'
          ? 'Utilize apoio leve das mãos ou sente numa caixa para guiar a descida e reduzir o impacto no joelho.'
          : 'Remova os apoios, aumente a profundidade articular ou transicione para bases unilaterais (Pistol).';
      default:
        return type === 'easier'
          ? 'Modifique o ângulo gravitacional ou reduza a alavanca para diminuir a sobrecarga.'
          : 'Aumente o braço de momento, a amplitude de movimento ou reduza a base de suporte.';
    }
  };

  const regressoes = (exercise.regressoes || [])
    .map(id => getExerciseById(id) || EXERCISES_DATABASE.find(e => e.id === id))
    .filter((e): e is Exercise => !!e);

  const progressoes = (exercise.progressoes || [])
    .map(id => getExerciseById(id) || EXERCISES_DATABASE.find(e => e.id === id))
    .filter((e): e is Exercise => !!e);

  const hasAdaptations = exercise.adaptacoes && Object.keys(exercise.adaptacoes).length > 0;

  return (
    <div className={`w-full rounded-2xl glass-card border border-white/10 overflow-hidden text-slate-100 ${className}`}>
      {/* Cabeçalho */}
      <div className="p-3.5 sm:p-4 bg-slate-950/60 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-black tracking-tight text-slate-100">
            Escada de Progressões & Regressões
          </h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
          {exercise.category}
        </span>
      </div>

      <div className="p-3.5 sm:p-4 space-y-3.5">
        {/* 1. DEGRAU ANTERIOR: REGRESSÃO (Facilitar se houver fadiga ou falha) */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" />
              Degrau Anterior (Regressão / Facilitar)
            </span>
            <span className="text-[10px] text-amber-300/80 font-semibold">Carga Mais Leve</span>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            💡 {getLeverGuidance('easier', exercise.padrao)}
          </p>

          {regressoes.length > 0 ? (
            <div className="space-y-1.5 pt-1">
              {regressoes.map(reg => (
                <div
                  key={reg.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-950/40 border border-amber-500/20"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-100 block truncate">{reg.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {reg.difficulty} • {reg.type === 'isometric' ? `${reg.defaultHoldSeconds || 20}s hold` : `${reg.defaultReps || 10} reps`}
                    </span>
                  </div>
                  {onSelectExercise && (
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.triggerHaptic([25]);
                        onSelectExercise(reg);
                      }}
                      className="px-2.5 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black active:scale-95 transition shrink-0"
                    >
                      Trocar Agora
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 italic">
              Este já é o nível base desta família de movimento. Se necessário, reduza a amplitude ou aumente os descansos.
            </div>
          )}
        </div>

        {/* 2. DEGRAU ATUAL: EXERCÍCIO ATIVO */}
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border-2 border-emerald-500/40 space-y-2 shadow-lg shadow-emerald-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              Exercício Atual (Você está aqui)
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
              {exercise.difficulty}
            </span>
          </div>

          <div className="text-sm font-black text-white">{exercise.name}</div>

          {exercise.criterioAvanco && (
            <div className="p-2 rounded-lg bg-slate-950/60 border border-emerald-500/20 text-[11px] text-emerald-200">
              <span className="font-bold text-emerald-300">🎯 Critério para avançar: </span>
              {exercise.criterioAvanco}
            </div>
          )}
        </div>

        {/* 3. DEGRAU SEGUINTE: PROGRESSÃO (Meta de evolução) */}
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/25 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Próximo Degrau (Progressão / Dificultar)
            </span>
            <span className="text-[10px] text-cyan-300/80 font-semibold">Maior Sobrecarga</span>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            🚀 {getLeverGuidance('harder', exercise.padrao)}
          </p>

          {progressoes.length > 0 ? (
            <div className="space-y-1.5 pt-1">
              {progressoes.map(prog => (
                <div
                  key={prog.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-950/40 border border-cyan-500/20"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-100 block truncate">{prog.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {prog.difficulty} • {prog.type === 'isometric' ? `${prog.defaultHoldSeconds || 20}s hold` : `${prog.defaultReps || 10} reps`}
                    </span>
                  </div>
                  {onSelectExercise && (
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.triggerHaptic([25]);
                        onSelectExercise(prog);
                      }}
                      className="px-2.5 py-1 rounded-md bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-[10px] font-black active:scale-95 transition shrink-0"
                    >
                      Avançar
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-slate-300 italic flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>🏆 Parabéns! Este exercício está no degrau mais alto (Elite) da sua linhagem.</span>
            </div>
          )}
        </div>

        {/* 4. ADAPTAÇÕES POR ARTICULAÇÃO (Alívio de dor / desconforto) */}
        {hasAdaptations && (
          <div className="pt-1 border-t border-white/5">
            <button
              type="button"
              onClick={() => setShowJointAdaptations(!showJointAdaptations)}
              className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 transition"
              aria-expanded={showJointAdaptations}
            >
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                Adaptações para Desconforto Articular
              </span>
              {showJointAdaptations ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showJointAdaptations && (
              <div className="mt-2 space-y-2 animate-in fade-in duration-150">
                {Object.entries(exercise.adaptacoes!).map(([joint, altIds]) => {
                  if (!altIds || altIds.length === 0) return null;
                  return (
                    <div key={joint} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 capitalize">
                        Alívio no {joint}:
                      </span>
                      <div className="space-y-1 pl-1">
                        {altIds.map(altId => {
                          const target = getExerciseById(altId);
                          if (!target) return null;
                          return (
                            <div key={altId} className="flex items-center justify-between gap-2 text-xs">
                              <span className="text-slate-300 text-[11px] truncate">{target.name}</span>
                              {onSelectExercise && (
                                <button
                                  type="button"
                                  onClick={() => onSelectExercise(target)}
                                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-bold"
                                >
                                  Usar esta
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
