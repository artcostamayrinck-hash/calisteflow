import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/audio';
import { pwaManager } from '../../utils/pwaManager';
import { RefreshCw, Sparkles, X } from 'lucide-react';

interface UpdatePromptBannerProps {
  isWorkoutActive?: boolean;
}

export const UpdatePromptBanner: React.FC<UpdatePromptBannerProps> = ({ isWorkoutActive = false }) => {
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    // Inscreve no gerenciador oficial do PWA para detectar worker em espera (waiting)
    const unsubscribe = pwaManager.onUpdateAvailable(() => {
      setHasUpdate(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // REGRA DE OURO: Nunca exibir ou aplicar atualização enquanto o usuário está em um treino ativo
  if (!hasUpdate || isWorkoutActive) return null;

  const handleApplyUpdate = () => {
    soundManager.triggerHaptic([30, 50]);
    // Instruímos o worker via postMessage (skipWaiting) e ele recarrega no controllerchange
    pwaManager.applyUpdate();
  };

  return (
    <div className="fixed top-16 left-4 right-4 z-40 max-w-md mx-auto animate-in slide-in-from-top-4 duration-300">
      <div className="p-3.5 rounded-2xl glass-panel border border-emerald-500/40 bg-slate-950/95 shadow-2xl flex items-center justify-between gap-3 glow-emerald">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
              Atualização Pronta
            </span>
            <p className="text-xs font-bold text-slate-100">
              Nova versão disponível do CalisteFlow
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleApplyUpdate}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1 active:scale-95 transition shadow"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Atualizar</span>
          </button>
          <button
            onClick={() => setHasUpdate(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            title="Ignorar por enquanto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
