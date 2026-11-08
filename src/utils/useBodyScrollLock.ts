import { useEffect } from 'react';

let lockCount = 0;
let originalBodyOverflow = '';
let originalHtmlOverflow = '';

/**
 * Hook centralizado de travamento seguro de rolagem do body.
 * - Suporta múltiplos modais abertos simultaneamente com contagem de referência.
 * - Restaura a rolagem limpa ao fechar, tocar fora, pressionar Esc ou desmontar (botão voltar).
 * - Previne scroll bleed e congelamento de gestos no iOS Safari e PWA.
 */
export function useBodyScrollLock(isLocked: boolean, onEscapeClose?: () => void) {
  useEffect(() => {
    if (!isLocked) return;

    if (lockCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      // No iOS Safari / PWA, travar também html impede que o rubber-band do viewport ocorra atrás do modal
      document.documentElement.style.overflow = 'hidden';
    }
    lockCount++;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscapeClose) {
        e.preventDefault();
        onEscapeClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      lockCount = Math.max(0, lockCount - 1);

      if (lockCount === 0) {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      }
    };
  }, [isLocked, onEscapeClose]);
}

