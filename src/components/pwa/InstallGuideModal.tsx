import React, { useState } from 'react';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import { soundManager } from '../../utils/audio';
import {
  X,
  Smartphone,
  Share,
  PlusSquare,
  Download,
  WifiOff,
  Zap,
} from 'lucide-react';

interface InstallGuideModalProps {
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ onClose }) => {
  useBodyScrollLock(true, onClose);

  const [platform, setPlatform] = useState<'ios' | 'android'>(() => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    }
    return 'android';
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg glass-panel border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[min(94dvh,calc(100dvh-2rem))] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Download className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 id="install-guide-title" className="text-sm sm:text-base font-black text-slate-100">
                Instalar o CalisteFlow no Celular
              </h2>
              <p className="text-[11px] text-slate-400">
                Aplicativo PWA: funciona sem internet e sem App Store
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar guia de instalação"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Switcher */}
        <div className="p-3 sm:px-5 border-b border-white/5 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              soundManager.triggerHaptic([20]);
              setPlatform('ios');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              platform === 'ios'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md glow-emerald'
                : 'glass-card border border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>iPhone / iPad (iOS)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.triggerHaptic([20]);
              setPlatform('android');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              platform === 'android'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md glow-emerald'
                : 'glass-card border border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android (Chrome)</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Benefícios do PWA */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
              <WifiOff className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-200">100% Offline</p>
                <p className="text-[10px] text-slate-400">Treine sem dados móveis</p>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-200">Acesso Rápido</p>
                <p className="text-[10px] text-slate-400">Ícone na tela de início</p>
              </div>
            </div>
          </div>

          {/* Instruções Passo a Passo */}
          {platform === 'ios' ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Passo a passo no Safari do iPhone:
              </h3>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Abra o site no navegador <strong>Safari</strong> (não use navegadores embutidos de apps).
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Toque no botão <strong>Compartilhar</strong>{' '}
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-slate-200 text-[10px] font-mono">
                    <Share className="w-3 h-3 inline mr-1" /> Compartilhar
                  </span>{' '}
                  na barra inferior do Safari.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Role a lista para baixo e toque em{' '}
                  <strong className="text-emerald-400">
                    <PlusSquare className="w-3.5 h-3.5 inline mr-1" /> Adicionar à Tela de Início
                  </strong>
                  .
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Toque em <strong>Adicionar</strong> no canto superior direito. Pronto! O app aparecerá junto com seus outros aplicativos.
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Passo a passo no Google Chrome do Android:
              </h3>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Abra o site no navegador <strong>Google Chrome</strong>.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Toque no menu de <strong>três pontinhos (⋮)</strong> no canto superior direito.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Selecione <strong className="text-emerald-400">Instalar aplicativo</strong> ou{' '}
                  <strong className="text-emerald-400">Adicionar à tela inicial</strong>.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Confirme em <strong>Instalar</strong>. O aplicativo funcionará em tela cheia com alta performance.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] py-3 px-5 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition glow-emerald"
          >
            Entendido, obrigado!
          </button>
        </div>
      </div>
    </div>
  );
};
