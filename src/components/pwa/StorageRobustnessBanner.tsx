import React, { useState, useEffect } from 'react';
import { isIOS, isStandalone, requestPersistentStorage } from '../../utils/platform';
import {
  isSafariBannerDismissed,
  setSafariBannerDismissed,
  downloadFullBackupFile,
  getLastBackupExportDate,
} from '../../utils/storage';
import { soundManager } from '../../utils/audio';
import { ShieldAlert, Download, X, Share, PlusSquare, HardDrive } from 'lucide-react';

interface StorageRobustnessBannerProps {
  workoutCount: number;
}

export const StorageRobustnessBanner: React.FC<StorageRobustnessBannerProps> = ({ workoutCount }) => {
  const [showSafariAlert, setShowSafariAlert] = useState<boolean>(false);
  const [showBackupReminder, setShowBackupReminder] = useState<boolean>(false);
  const [showIosInstallGuide, setShowIosInstallGuide] = useState<boolean>(false);
  const [storagePersisted, setStoragePersisted] = useState<boolean>(true);

  useEffect(() => {
    // 1. Request persistent storage automatically on mobile
    requestPersistentStorage().then(persisted => {
      setStoragePersisted(persisted);
    });

    // 2. Safari Inactivity Warning (iOS WebKit 7-day storage purge policy)
    // Only shows if running on iOS inside Safari tab (not standalone) and not previously dismissed
    if (isIOS() && !isStandalone() && !isSafariBannerDismissed()) {
      setShowSafariAlert(true);
    }

    // 3. Proactive Backup Reminder
    // If user has recorded workouts and hasn't exported a backup in 14+ days
    const lastBackupStr = getLastBackupExportDate();
    if (workoutCount >= 3) {
      if (!lastBackupStr) {
        setShowBackupReminder(true);
      } else {
        const lastBackupTime = new Date(lastBackupStr).getTime();
        const daysSinceLastBackup = (Date.now() - lastBackupTime) / (1000 * 60 * 60 * 24);
        if (daysSinceLastBackup >= 14) {
          setShowBackupReminder(true);
        }
      }
    }
  }, [workoutCount]);

  const handleDismissSafari = () => {
    soundManager.triggerHaptic([20]);
    setSafariBannerDismissed(true);
    setShowSafariAlert(false);
  };

  const handleDownloadBackup = () => {
    soundManager.triggerHaptic([40]);
    downloadFullBackupFile();
    setShowBackupReminder(false);
  };

  if (!showSafariAlert && !showBackupReminder && !showIosInstallGuide) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-3 pb-1 space-y-2">
      {/* iOS Safari 7-day eviction warning */}
      {showSafariAlert && (
        <div className="p-3.5 rounded-2xl glass-panel border border-amber-500/30 bg-amber-950/20 shadow-lg text-slate-100 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                    Aviso do Safari iOS
                  </span>
                  {!storagePersisted && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                      Armazenamento transitório
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  No Safari do iPhone, dados de sites na aba podem ser limpos pela Apple após 7 dias de inatividade.
                  Para guardar seus dados com segurança perpétua, adicione à <strong className="text-white">Tela de Início</strong> ou faça backups regulares.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1.5">
                  <button
                    onClick={() => setShowIosInstallGuide(prev => !prev)}
                    className="text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 px-3 py-1 rounded-xl transition flex items-center gap-1.5"
                  >
                    <PlusSquare className="w-3.5 h-3.5" />
                    <span>Como Adicionar à Tela de Início</span>
                  </button>
                  <button
                    onClick={handleDownloadBackup}
                    className="text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1 rounded-xl transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Baixar Backup</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleDismissSafari}
              className="p-1 rounded-lg text-slate-400 hover:text-white shrink-0"
              title="Entendi e fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Illustrated Safari Install Drawer */}
          {showIosInstallGuide && (
            <div className="mt-3 pt-3 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Share className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div>
                  <strong className="block text-white text-[11px]">Passo 1</strong>
                  <span>Toque em Compartilhar no rodapé do Safari</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <PlusSquare className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <strong className="block text-white text-[11px]">Passo 2</strong>
                  <span>Selecione "Adicionar à Tela de Início"</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <HardDrive className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <div>
                  <strong className="block text-white text-[11px]">Passo 3</strong>
                  <span>Pronto! O app terá armazenamento isolado e durável</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Routine periodic backup reminder */}
      {showBackupReminder && !showSafariAlert && (
        <div className="p-3 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/20 shadow-md flex items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <HardDrive className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">
                Seus treinos são preciosos! Que tal salvar uma cópia de segurança?
              </p>
              <span className="text-[10px] text-slate-400">
                {workoutCount} treinos registrados no dispositivo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadBackup}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition active:scale-95 shadow"
            >
              <Download className="w-3 h-3" />
              <span>Salvar Backup</span>
            </button>
            <button
              onClick={() => setShowBackupReminder(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
              title="Lembrar mais tarde"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

