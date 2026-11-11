import React, { useState } from 'react';
import type { Exercise } from '../../../types';
import type { FigureStyle } from './types';
import { generateBiomechanicalAnalysis, type BiomechanicalAnalysisData } from './biomechanicsEngine';
import { ExerciseFigure } from './ExerciseFigure';
import { getAnimationDefForExercise } from './poseDatabase';
import { soundManager } from '../../../utils/audio';
import {
  Compass,
  Zap,
  ShieldAlert,
  Copy,
  Check,
  X,
  Activity,
} from 'lucide-react';

interface BiomechanicsInspectorModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
}

export const BiomechanicsInspectorModal: React.FC<BiomechanicsInspectorModalProps> = ({
  exercise,
  isOpen,
  onClose,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<1 | 2 | 3>(2); // Default to peak phase
  const [selectedStyle, setSelectedStyle] = useState<FigureStyle>('silhouette');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const analysis: BiomechanicalAnalysisData = generateBiomechanicalAnalysis(exercise);
  const animDef = getAnimationDefForExercise(exercise.id, exercise.name);

  const activeKeyframe =
    selectedPhase === 1
      ? analysis.keyframes.fase1_setup
      : selectedPhase === 2
      ? analysis.keyframes.fase2_pico
      : analysis.keyframes.fase3_retorno;

  const handleCopyJSON = () => {
    soundManager.triggerHaptic([30]);
    const jsonStr = JSON.stringify(analysis, null, 2);
    navigator.clipboard?.writeText(jsonStr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[min(92dvh,calc(100dvh-2rem))] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">{exercise.name}</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                  {exercise.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Parâmetros Cinemáticos, Ângulos Articulares & Vetores de Torque
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyJSON}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
              title="Copiar estrutura JSON completa de biomecânica"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copiado!' : 'JSON'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Palco Visual Biomecânico com Poses Interativas */}
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-xl relative">
            <div className="w-full aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center">
              <ExerciseFigure
                animationDef={animDef}
                isPaused={true}
                staticFrame={activeKeyframe.normalizedTime}
                style={selectedStyle}
                showControls={false}
                className="w-full h-full"
              />
            </div>

            {/* Controles de Estilo Visual Sobrepostos */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md border border-white/10 p-1 rounded-xl">
              {(
                [
                  { id: 'anatomical', label: 'Anatômico' },
                  { id: 'mannequin', label: 'Manequim' },
                  { id: 'silhouette', label: 'Silhueta' },
                ] as { id: FigureStyle; label: string }[]
              ).map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedStyle(st.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                    selectedStyle === st.id
                      ? 'bg-cyan-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Seletor de Fases / Keyframes */}
            <div className="p-2.5 bg-slate-950/90 border-t border-white/10 flex items-center justify-between gap-1.5 overflow-x-auto">
              {(
                [
                  { fase: 1, label: '1. Setup / Preparação', desc: 't = 0.0' },
                  { fase: 2, label: '2. Pico / Torque Máximo', desc: 't = 0.5' },
                  { fase: 3, label: '3. Retorno / Excêntrica', desc: 't = 1.0' },
                ] as const
              ).map(item => (
                <button
                  key={item.fase}
                  type="button"
                  onClick={() => {
                    soundManager.triggerHaptic([20]);
                    setSelectedPhase(item.fase);
                  }}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-left transition active:scale-95 border ${
                    selectedPhase === item.fase
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow'
                      : 'border-white/5 bg-white/[0.02] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[11px] font-black truncate">{item.label}</div>
                  <div className="text-[9px] opacity-75">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dados Cinemáticos da Fase Ativa */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                {activeKeyframe.nome}
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                Duração: {activeKeyframe.duracaoMs} ms
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {activeKeyframe.instrucaoCurta}
            </p>

            {/* Grade de Ângulos Articulares Medidos */}
            <div className="grid grid-cols-5 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-xs font-black text-cyan-300 font-mono">
                  {activeKeyframe.angulosArticularesGraus.ombro}°
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Ombro</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-xs font-black text-cyan-300 font-mono">
                  {activeKeyframe.angulosArticularesGraus.cotovelo}°
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Cotovelo</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-xs font-black text-cyan-300 font-mono">
                  {activeKeyframe.angulosArticularesGraus.quadril}°
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Quadril</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-xs font-black text-cyan-300 font-mono">
                  {activeKeyframe.angulosArticularesGraus.joelho}°
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Joelho</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-xs font-black text-cyan-300 font-mono">
                  {activeKeyframe.angulosArticularesGraus.tornozelo}°
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Tornozelo</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/50 border border-white/5 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="font-bold text-slate-400">Torque Escapular:</span>
                <span className="text-slate-200">{activeKeyframe.torqueEscapular}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="font-bold text-slate-400">Apoio Fixo:</span>
                <span className="text-slate-200 capitalize">
                  {activeKeyframe.apoioFixo.membro} (X: {activeKeyframe.apoioFixo.x}, Y: {activeKeyframe.apoioFixo.y})
                </span>
              </div>
              <div className="text-[11px] text-emerald-300/90 pt-0.5">
                <strong>Foco Postural: </strong>
                {activeKeyframe.focoPostural}
              </div>
            </div>
          </div>

          {/* Mapeamento de Ativação Muscular (#00FF66 Neon) */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#00FF66] flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                Mapeamento de Ativação Muscular (Highlight Ativo)
              </span>
              <span className="text-[10px] font-mono text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 rounded border border-[#00FF66]/30">
                #00FF66 Neon
              </span>
            </div>

            <div className="space-y-2">
              {analysis.mapeamentoAtivacaoMuscular.map(act => (
                <div
                  key={act.musculo}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66] shrink-0" />
                      <span className="text-xs font-black text-slate-100 capitalize">{act.musculo}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({act.segmento})</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{act.papel}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#00FF66] h-full shadow-[0_0_6px_#00FF66]"
                        style={{ width: `${Math.round(act.intensidade * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-[#00FF66] font-mono w-9 text-right">
                      {Math.round(act.intensidade * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pontos de Atenção & Estresse Articular */}
          {analysis.pontosAtencaoStressArticular.length > 0 && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Pontos de Atenção & Estresse Articular
              </span>

              <div className="space-y-2">
                {analysis.pontosAtencaoStressArticular.map(point => (
                  <div
                    key={point.articulacao}
                    className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/20 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-100 capitalize flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            point.nivelStress === 'critico'
                              ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                              : point.nivelStress === 'alto'
                              ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                              : 'bg-cyan-400'
                          }`}
                        />
                        {point.articulacao}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                          point.nivelStress === 'critico'
                            ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                            : point.nivelStress === 'alto'
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                            : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                        }`}
                      >
                        Stress: {point.nivelStress}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300">
                      <strong>Carga: </strong>
                      {point.tipoCarga}
                    </div>

                    <div className="text-[11px] text-emerald-300 bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/20">
                      <strong>Alinhamento Seguro: </strong>
                      {point.alinhamentoCritico}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Erros Críticos Biomecânicos a Evitar */}
          {analysis.errosCriticos.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Erros Críticos de Alavanca a Evitar
              </span>

              <div className="space-y-2">
                {analysis.errosCriticos.map((err, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/20 text-xs space-y-1">
                    <div className="text-rose-300 font-black">❌ {err.erro}</div>
                    <div className="text-emerald-400">✓ Correção: {err.correcao}</div>
                    <div className="text-[10px] text-slate-400 italic">Risco: {err.riscoLesao}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
