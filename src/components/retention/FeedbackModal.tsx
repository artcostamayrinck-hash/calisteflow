import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import {
  MessageSquare,
  Bug,
  Lightbulb,
  Send,
  X,
  CheckCircle2,
  Copy,
  Info,
} from 'lucide-react';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'bug' | 'general'>('suggestion');
  const [message, setMessage] = useState('');
  const [copiedDiag, setCopiedDiag] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useBodyScrollLock(isOpen, onClose);

  if (!isOpen) return null;

  // Build anonymous technical environment diagnostics without personal data
  const technicalInfo = {
    appVersion: '1.7.0 (PWA Local-First)',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Desconhecido',
    screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A',
    platform: typeof navigator !== 'undefined' ? (navigator as any).userAgentData?.platform || navigator.platform : 'Web',
    onlineStatus: typeof navigator !== 'undefined' && navigator.onLine ? 'Online' : 'Offline',
    storageEstimate: 'LocalStorage + IndexedDB Ativo',
  };

  const handleCopyDiagnostics = () => {
    soundManager.triggerHaptic([20]);
    const diagText = JSON.stringify(technicalInfo, null, 2);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(diagText);
      setCopiedDiag(true);
      setTimeout(() => setCopiedDiag(false), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    soundManager.triggerHaptic([40, 60]);

    // Construct mailto URL or store locally for review
    const subject = encodeURIComponent(`[CalisteFlow Feedback - ${feedbackType.toUpperCase()}]`);
    const body = encodeURIComponent(
      `Tipo: ${feedbackType}\n\nMensagem:\n${message}\n\n---\nDados Técnicos do Dispositivo (Sem identificação pessoal):\n${JSON.stringify(technicalInfo, null, 2)}`
    );

    // Open mail client as an accessible fallback
    const mailtoUrl = `mailto:contato.calisteflow@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setMessage('');
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg glass-panel border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col space-y-4 max-h-[min(92dvh,calc(100dvh-2rem))] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 glow-emerald">
              <MessageSquare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                Comunicação Direta
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                Enviar Feedback ou Erro
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl glass-card text-slate-400 hover:text-white border border-white/10 transition active:scale-95"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="p-8 text-center space-y-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-base font-black text-slate-100">Obrigado pelo seu feedback!</h3>
            <p className="text-xs text-slate-400">
              Sua contribuição ajuda a aprimorar a biomecânica e estabilidade do CalisteFlow.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
            {/* Feedback Type Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'suggestion' as const, label: 'Sugestão', icon: Lightbulb },
                { id: 'bug' as const, label: 'Reportar Erro', icon: Bug },
                { id: 'general' as const, label: 'Geral', icon: MessageSquare },
              ].map(t => {
                const isSelected = feedbackType === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      soundManager.triggerHaptic([15]);
                      setFeedbackType(t.id);
                    }}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 border active:scale-95 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 glow-emerald'
                        : 'border-white/5 bg-white/[0.02] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                {feedbackType === 'bug' ? 'O que aconteceu e como reproduzir o erro?' : 'Qual sua ideia ou comentário?'}
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={
                  feedbackType === 'bug'
                    ? 'Ex: Ao clicar no botão de pausar isometria durante a prancha, o som continuou tocando...'
                    : 'Ex: Seria ótimo ter um contador de repetições por comando de voz para flexões...'
                }
                className="w-full p-3.5 rounded-2xl glass-card text-xs text-slate-100 placeholder:text-slate-500 border border-white/10 focus:border-emerald-500 outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Anonymous Technical Context Banner */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 flex items-center gap-1.5 text-[11px]">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  Dados Técnicos Anexados (Sem Dados Pessoais):
                </span>
                <button
                  type="button"
                  onClick={handleCopyDiagnostics}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
                >
                  <Copy className="w-3 h-3" />
                  {copiedDiag ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-mono leading-tight">
                Versão: {technicalInfo.appVersion} • {technicalInfo.platform} • {technicalInfo.screenResolution} • {technicalInfo.onlineStatus}
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!message.trim()}
                className="w-full min-h-[48px] py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition disabled:opacity-40 disabled:cursor-not-allowed glow-emerald"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Feedback</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
