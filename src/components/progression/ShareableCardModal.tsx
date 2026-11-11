import React, { useEffect, useState } from 'react';
import type { Achievement } from '../../types/gamification';
import { renderShareableCardCanvas, shareOrDownloadCard } from '../../utils/cardGenerator';
import { soundManager } from '../../utils/audio';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import { X, Share2, Download, Sparkles, Check } from 'lucide-react';

interface ShareableCardModalProps {
  achievement: Achievement;
  onClose: () => void;
}

export const ShareableCardModal: React.FC<ShareableCardModalProps> = ({
  achievement,
  onClose,
}) => {
  useBodyScrollLock(true, onClose);

  const [canvasElem, setCanvasElem] = useState<HTMLCanvasElement | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [sharedNotice, setSharedNotice] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const generate = async () => {
      try {
        const dateStr = achievement.unlockedAt
          ? new Date(achievement.unlockedAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          : new Date().toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            });

        const canvas = await renderShareableCardCanvas({
          title: achievement.title,
          subtitle: achievement.description,
          badgeIcon: achievement.icon,
          categoryLabel: achievement.category,
          metricLabel: 'Critério Conquistado',
          metricValue: `${achievement.xpReward} XP`,
          dateStr,
        });

        if (isMounted) {
          setCanvasElem(canvas);
          setIsGenerating(false);
        }
      } catch (err) {
        console.error('[ShareableCard] Erro ao renderizar canvas:', err);
        if (isMounted) setIsGenerating(false);
      }
    };

    generate();
    return () => {
      isMounted = false;
    };
  }, [achievement]);

  const handleShare = async () => {
    if (!canvasElem) return;
    soundManager.triggerHaptic([35]);
    try {
      await shareOrDownloadCard(canvasElem, `calisteflow-${achievement.id}.png`);
      setSharedNotice(true);
      setTimeout(() => setSharedNotice(false), 2500);
    } catch (err) {
      console.warn('[Share] Erro:', err);
    }
  };

  const handleDownload = async () => {
    if (!canvasElem) return;
    soundManager.triggerHaptic([30]);
    const blob = await new Promise<Blob | null>(resolve => canvasElem.toBlob(resolve, 'image/png', 0.95));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calisteflow-${achievement.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setSharedNotice(true);
    setTimeout(() => setSharedNotice(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm sm:max-w-md glass-panel border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[min(94dvh,calc(100dvh-2rem))] overflow-hidden bg-slate-950/95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 id="card-modal-title" className="text-sm font-black text-slate-100">
              Cartão de Conquista Oficial
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar cartão"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Card Container */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center min-h-[360px]">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
              <span className="text-xs font-semibold">Renderizando cartão em alta definição...</span>
            </div>
          ) : canvasElem ? (
            <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/20 relative group">
              <img
                src={canvasElem.toDataURL('image/png')}
                alt={achievement.title}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="text-xs text-rose-400">Não foi possível gerar a prévia do cartão.</div>
          )}
        </div>

        {/* Footer Sharing Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 space-y-2 shrink-0">
          {sharedNotice && (
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs text-center font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Cartão salvo com sucesso!</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleShare}
              disabled={isGenerating || !canvasElem}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition glow-emerald cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartilhar</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating || !canvasElem}
              className="py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 border border-white/10"
            >
              <Download className="w-4 h-4" />
              <span>Baixar PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
