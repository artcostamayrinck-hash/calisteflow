import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  HeartHandshake,
  Activity,
  Flame,
} from 'lucide-react';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';

interface HealthDisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export const HealthDisclaimerModal: React.FC<HealthDisclaimerModalProps> = ({
  isOpen,
  onAccept,
}) => {
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const handleConfirm = () => {
    soundManager.triggerHaptic([30, 50]);
    onAccept();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-lg glass-panel border border-amber-500/30 rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col space-y-4 max-h-[min(92dvh,calc(100dvh-2rem))] overflow-hidden">
        {/* Header with Safety Shield */}
        <div className="flex items-center gap-3 pb-3 border-b border-white/10 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 glow-amber">
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
              Compromisso de Segurança
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
              Aviso Importante de Saúde
            </h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
          {/* Core Disclaimer Message without Medical Promises */}
          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Sem Promessas Médicas:</strong> O CalisteFlow é uma ferramenta de auxílio ao treinamento físico com peso corporal e <strong>NÃO</strong> substitui consulta médica prévia nem a orientação presencial de um Profissional de Educação Física habilitado (CREF).
            </span>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              A Regra de Ouro da Dor:
            </p>
            <ul className="space-y-1.5 pl-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Queimação muscular gradual:</strong> Normal e esperada devido ao acúmulo de metabólitos no treino de força.</span>
              </li>
              <li className="flex items-start gap-2 text-rose-300">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>DOR AGUDA, pontadas ou queimação articular:</strong> PARE O EXERCÍCIO IMEDIATAMENTE! Não tente &quot;treinar por cima da dor&quot;.</span>
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl glass-card border border-white/5 space-y-1.5 text-xs">
            <p className="font-bold text-slate-200 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-cyan-400" />
              Para a sua proteção:
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Consulte seu médico antes de iniciar se você possui histórico de problemas cardíacos, lesões ortopédicas crônicas, hipertensão ou estiver em período gestacional.
            </p>
          </div>
        </div>

        {/* Checkbox Acknowledgment */}
        <button
          type="button"
          onClick={() => {
            soundManager.triggerHaptic([15]);
            setHasAcknowledged(!hasAcknowledged);
          }}
          className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center gap-3 active:scale-98 ${
            hasAcknowledged
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'glass-card border-white/10 text-slate-300 hover:border-white/20'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition ${
              hasAcknowledged
                ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                : 'border-white/20 bg-slate-900'
            }`}
          >
            {hasAcknowledged && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
          </div>
          <span className="text-xs font-semibold leading-tight">
            Li e compreendi que devo parar imediatamente em caso de dor articular aguda e que sou responsável por respeitar meus limites fisiológicos.
          </span>
        </button>
        </div>

        {/* Action Button */}
        <div className="pt-2 shrink-0">
          <button
            type="button"
            disabled={!hasAcknowledged}
            onClick={handleConfirm}
            className={`w-full min-h-[52px] py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-xl ${
              hasAcknowledged
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 shadow-emerald-500/25 glow-emerald hover:brightness-110 active:scale-98'
                : 'bg-white/10 text-slate-500 border border-white/5 cursor-not-allowed opacity-50'
            }`}
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>Concordar e Começar com Segurança</span>
          </button>
        </div>
      </div>
    </div>
  );
};

