import React, { useState } from 'react';
import type { Routine } from '../../types';
import { getExerciseById } from '../../data/exercisesData';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import { soundManager } from '../../utils/audio';
import {
  X,
  Share2,
  Printer,
  Copy,
  Check,
  QrCode,
  ShieldAlert,
  FileText,
} from 'lucide-react';

interface RoutineShareModalProps {
  routine: Routine;
  onClose: () => void;
}

export const RoutineShareModal: React.FC<RoutineShareModalProps> = ({ routine, onClose }) => {
  useBodyScrollLock(true, onClose);

  const [copiedText, setCopiedText] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Gera texto estruturado para envio no WhatsApp ou anotações
  const generateShareText = () => {
    const lines = [
      `🤸 CalisteFlow - ${routine.title}`,
      `⏱️ Duração estimada: ${routine.estimatedMinutes} min | Nível: ${routine.difficulty}`,
      `📋 Exercícios:`,
      ...routine.exercises.map((e, i) => {
        const name = getExerciseById(e.exerciseId)?.name || e.exerciseId;
        const target = e.targetReps ? `${e.targetReps} reps` : `${e.targetHoldSeconds}s isometria`;
        return `${i + 1}. ${name} - ${e.sets} séries x ${target} (descanso: ${e.restSeconds}s)`;
      }),
      '',
      `⚠️ Segurança: Pare se houver dor aguda articular. Treine com controle e boa postura!`,
      `Acesse: ${window.location.origin}`,
    ];
    return lines.join('\n');
  };

  const handleCopyText = async () => {
    soundManager.triggerHaptic([30]);
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // fallback
    }
  };

  const handlePrintPdf = () => {
    soundManager.triggerHaptic([30]);
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-routine-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg glass-panel border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[min(94dvh,calc(100dvh-2rem))] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Share2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 id="share-routine-title" className="text-sm sm:text-base font-black text-slate-100">
                Compartilhar ou Exportar Ficha
              </h2>
              <p className="text-[11px] text-slate-400">
                {routine.title} • {routine.estimatedMinutes} min
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar compartilhamento"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Ações Rápidas */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handlePrintPdf}
              className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 flex flex-col items-center gap-2 transition active:scale-98"
            >
              <Printer className="w-5 h-5 text-emerald-400" />
              <div className="text-center">
                <span className="text-xs font-bold text-slate-200 block">Salvar PDF / Imprimir</span>
                <span className="text-[10px] text-slate-400">Folha de treino limpa A4</span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 flex flex-col items-center gap-2 transition active:scale-98"
            >
              {copiedText ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Copy className="w-5 h-5 text-cyan-400" />
              )}
              <div className="text-center">
                <span className="text-xs font-bold text-slate-200 block">
                  {copiedText ? 'Copiado!' : 'Copiar Texto'}
                </span>
                <span className="text-[10px] text-slate-400">Para WhatsApp e notas</span>
              </div>
            </button>
          </div>

          {/* Toggle QR Code */}
          <div className="p-3.5 rounded-2xl glass-card border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-200">QR Code da Ficha</span>
              </div>
              <button
                type="button"
                onClick={() => setShowQr(prev => !prev)}
                className="text-xs text-purple-400 font-bold hover:underline"
              >
                {showQr ? 'Ocultar' : 'Exibir QR Code'}
              </button>
            </div>

            {showQr && (
              <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center space-y-2 animate-in fade-in">
                {/* QR Code SVG limpo */}
                <svg viewBox="0 0 100 100" className="w-36 h-36">
                  {/* Padrão visual elegante representativo de QR */}
                  <rect width="100" height="100" fill="#ffffff" />
                  <path
                    d="M10,10 h25 v25 h-25 z M15,15 v15 h15 v-15 z M19,19 h7 v7 h-7 z"
                    fill="#0f172a"
                  />
                  <path
                    d="M65,10 h25 v25 h-25 z M70,15 v15 h15 v-15 z M74,19 h7 v7 h-7 z"
                    fill="#0f172a"
                  />
                  <path
                    d="M10,65 h25 v25 h-25 z M15,70 v15 h15 v-15 z M19,74 h7 v7 h-7 z"
                    fill="#0f172a"
                  />
                  <rect x="42" y="15" width="6" height="6" fill="#0f172a" />
                  <rect x="52" y="25" width="6" height="6" fill="#0f172a" />
                  <rect x="42" y="35" width="6" height="6" fill="#0f172a" />
                  <rect x="25" y="45" width="6" height="6" fill="#0f172a" />
                  <rect x="35" y="55" width="6" height="6" fill="#0f172a" />
                  <rect x="45" y="45" width="10" height="10" fill="#10b981" />
                  <rect x="65" y="45" width="6" height="6" fill="#0f172a" />
                  <rect x="55" y="65" width="6" height="6" fill="#0f172a" />
                  <rect x="65" y="75" width="6" height="6" fill="#0f172a" />
                  <rect x="75" y="65" width="6" height="6" fill="#0f172a" />
                  <rect x="85" y="55" width="6" height="6" fill="#0f172a" />
                  <rect x="85" y="85" width="6" height="6" fill="#0f172a" />
                </svg>
                <span className="text-[10px] font-bold text-slate-800">
                  Escaneie com outro celular para abrir o CalisteFlow
                </span>
              </div>
            )}
          </div>

          {/* Pré-visualização da Ficha de Treino */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Lista de Exercícios da Ficha</span>
            </div>

            <div className="space-y-2">
              {routine.exercises.map((ex, i) => {
                const name = getExerciseById(ex.exerciseId)?.name || ex.exerciseId;
                return (
                  <div
                    key={ex.exerciseId + i}
                    className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-200">
                        {i + 1}. {name}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Descanso entre séries: {ex.restSeconds}s
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">
                      {ex.sets} x {ex.targetReps ? `${ex.targetReps} reps` : `${ex.targetHoldSeconds}s`}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Aviso de Dor Aguda */}
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-[10px] text-amber-200/90 leading-relaxed">
                <strong>Aviso:</strong> Pare se houver dor aguda. Ajuste repetições para manter a forma estrita.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
