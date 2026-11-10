import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  FileJson,
  Database,
  History,
  ShieldCheck,
  RefreshCw,
  Clock,
} from 'lucide-react';
import {
  downloadFullBackupFile,
  validateBackupBundle,
  importBackupFromJSON,
  getWorkoutHistory,
  getStoredRoutines,
  getPersonalRecords,
  getAutomaticDataBackups,
  restoreDataBackup,
  type BackupValidationResult,
} from '../../utils/storage';
import { soundManager } from '../../utils/audio';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored?: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
}) => {
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<BackupValidationResult | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [autoBackups, setAutoBackups] = useState(getAutomaticDataBackups);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentHistory = getWorkoutHistory();
  const currentRoutines = getStoredRoutines();
  const currentPRs = getPersonalRecords();
  const prsCount = Object.keys(currentPRs).length;

  const handleExport = () => {
    soundManager.triggerHaptic([30]);
    const success = downloadFullBackupFile();
    if (success) {
      soundManager.playSuccessChime();
      setStatusMessage({
        type: 'success',
        text: 'Arquivo de backup exportado com sucesso! Salve-o em local seguro.',
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Não foi possível gerar o arquivo de backup no seu navegador.',
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundManager.triggerHaptic([20]);
    setIsProcessing(true);
    setStatusMessage(null);

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const text = event.target?.result as string;
        setSelectedFileContent(text);
        const parsed = JSON.parse(text);
        const validation = validateBackupBundle(parsed);
        setValidationResult(validation);

        if (!validation.valid) {
          setStatusMessage({
            type: 'error',
            text: validation.error || 'O arquivo selecionado não contém uma estrutura de backup válida.',
          });
        }
      } catch (err) {
        setValidationResult({
          valid: false,
          error: `Falha ao ler o arquivo JSON: ${err instanceof Error ? err.message : 'Sintaxe inválida'}`,
        });
        setStatusMessage({
          type: 'error',
          text: 'O arquivo selecionado não é um arquivo JSON legível.',
        });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setIsProcessing(false);
      setStatusMessage({
        type: 'error',
        text: 'Erro ao ler o arquivo do dispositivo.',
      });
    };

    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!selectedFileContent || !validationResult?.valid) return;

    const confirmed = window.confirm(
      'Atenção: A restauração substituirá seus dados atuais pelo conteúdo deste backup (um backup de segurança dos dados atuais será criado automaticamente antes da substituição). Deseja continuar?'
    );

    if (!confirmed) return;

    soundManager.triggerHaptic([50]);
    setIsProcessing(true);

    const result = importBackupFromJSON(selectedFileContent);

    if (result.success) {
      soundManager.playSuccessChime();
      setStatusMessage({
        type: 'success',
        text: `Backup restaurado com sucesso! (${result.summary?.historyCount || 0} treinos, ${result.summary?.routinesCount || 0} rotinas, ${result.summary?.prsCount || 0} recordes).`,
      });
      setSelectedFileContent(null);
      setValidationResult(null);
      setAutoBackups(getAutomaticDataBackups());

      if (onDataRestored) {
        onDataRestored();
      }

      // Opcional: recarregar suavemente a aplicação após breve timeout
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setStatusMessage({
        type: 'error',
        text: result.message,
      });
    }

    setIsProcessing(false);
  };

  const handleRestoreAutoBackup = (backupId: string) => {
    const confirmed = window.confirm(
      'Deseja restaurar este ponto de recuperação automático?'
    );
    if (!confirmed) return;

    soundManager.triggerHaptic([40]);
    const ok = restoreDataBackup(backupId);
    if (ok) {
      soundManager.playSuccessChime();
      setStatusMessage({
        type: 'success',
        text: 'Ponto de restauração automático recuperado com sucesso!',
      });
      if (onDataRestored) onDataRestored();
      setTimeout(() => window.location.reload(), 1200);
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Falha ao restaurar ponto automático.',
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[min(90dvh,calc(100dvh-2rem))] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Backup & Restauração</h2>
              <p className="text-xs text-slate-400">
                Segurança offline e portabilidade total dos seus dados
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs animate-in fade-in duration-150 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                  : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{statusMessage.text}</span>
            </div>
          )}

          {/* Resumo dos Dados Atuais no Aparelho */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Dados Salvos no Dispositivo
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                100% Offline
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-lg font-black text-slate-100 font-mono">{currentHistory.length}</span>
                <span className="text-[10px] text-slate-400 block">Treinos</span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-lg font-black text-slate-100 font-mono">{currentRoutines.length}</span>
                <span className="text-[10px] text-slate-400 block">Rotinas</span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-lg font-black text-slate-100 font-mono">{prsCount}</span>
                <span className="text-[10px] text-slate-400 block">Recordes</span>
              </div>
            </div>
          </div>

          {/* Seção 1: Exportar Backup Completo */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-black text-emerald-300 flex items-center gap-1.5">
                  <Download className="w-4 h-4" />
                  Exportar Backup Completo (JSON)
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Baixe um arquivo seguro com todo o seu histórico, recordes pessoais, rotinas personalizadas e progresso na calistenia.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Baixar Arquivo de Backup (.json)</span>
            </button>
          </div>

          {/* Seção 2: Importar e Restaurar Backup */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div>
              <h3 className="text-sm font-black text-cyan-300 flex items-center gap-1.5">
                <Upload className="w-4 h-4" />
                Restaurar Backup de um Arquivo
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Envie um arquivo <code className="text-cyan-300 bg-cyan-950/50 px-1 py-0.5 rounded">.json</code> exportado anteriormente para transferir seus treinos para este aparelho.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl border-2 border-dashed border-white/15 hover:border-cyan-500/50 bg-white/[0.02] hover:bg-cyan-500/5 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-98"
            >
              <FileJson className="w-4 h-4 text-cyan-400" />
              <span>Selecionar Arquivo .json de Backup</span>
            </button>

            {/* Prévia do Backup Selecionado */}
            {validationResult?.valid && validationResult.summary && (
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    Arquivo Válido Encontrado
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {validationResult.summary.exportedAt
                      ? new Date(validationResult.summary.exportedAt).toLocaleDateString('pt-BR')
                      : 'Data recente'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950/50 p-2 rounded-lg border border-cyan-500/20">
                    <div className="font-mono font-black text-cyan-300 text-sm">
                      {validationResult.summary.historyCount}
                    </div>
                    <div className="text-[10px] text-slate-400">Treinos</div>
                  </div>
                  <div className="bg-slate-950/50 p-2 rounded-lg border border-cyan-500/20">
                    <div className="font-mono font-black text-cyan-300 text-sm">
                      {validationResult.summary.routinesCount}
                    </div>
                    <div className="text-[10px] text-slate-400">Rotinas</div>
                  </div>
                  <div className="bg-slate-950/50 p-2 rounded-lg border border-cyan-500/20">
                    <div className="font-mono font-black text-cyan-300 text-sm">
                      {validationResult.summary.prsCount}
                    </div>
                    <div className="text-[10px] text-slate-400">Recordes</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmImport}
                  disabled={isProcessing}
                  className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-lg shadow-cyan-500/20 mt-1"
                >
                  <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>Restaurar Todos os Dados Agora</span>
                </button>
              </div>
            )}
          </div>

          {/* Seção 3: Pontos de Restauração Automáticos */}
          {autoBackups && autoBackups.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  Pontos de Restauração de Segurança
                </span>
                <span className="text-[10px] text-slate-400">Automáticos</span>
              </div>
              <div className="space-y-1.5">
                {autoBackups.map(b => (
                  <div
                    key={b.id}
                    className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-[11px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(b.timestamp).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {b.historyCount} treinos • {b.routinesCount} rotinas
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRestoreAutoBackup(b.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-bold active:scale-95 transition"
                    >
                      Restaurar
                    </button>
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
