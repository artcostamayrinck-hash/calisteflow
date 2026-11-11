export interface ShareableCardOptions {
  title: string;
  subtitle: string;
  badgeIcon: string;
  categoryLabel: string;
  metricLabel: string;
  metricValue: string;
  dateStr: string;
}

/**
 * Gera um cartão visual 100% no cliente usando HTML5 Canvas em alta definição (DPR 2x).
 * Segue a identidade visual do CalisteFlow (dark carbon, acentos neon emerald/cyan).
 */
export async function renderShareableCardCanvas(
  options: ShareableCardOptions
): Promise<HTMLCanvasElement> {
  const { title, subtitle, badgeIcon, categoryLabel, metricLabel, metricValue, dateStr } = options;

  const width = 1080;
  const height = 1350; // Proporção 4:5 ideal para stories e redes sociais

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Não foi possível obter contexto 2D do Canvas');

  // 1. Fundo Gradiente Dark Carbon
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#0d1527');
  bgGrad.addColorStop(1, '#050811');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Brilhos de Iluminação e Neons (Ambient Glows)
  const glowTop = ctx.createRadialGradient(200, 200, 50, 200, 200, 600);
  glowTop.addColorStop(0, 'rgba(16, 185, 129, 0.25)'); // Emerald glow
  glowTop.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = glowTop;
  ctx.fillRect(0, 0, width, height);

  const glowBottom = ctx.createRadialGradient(880, 1150, 50, 880, 1150, 600);
  glowBottom.addColorStop(0, 'rgba(6, 182, 212, 0.25)'); // Cyan glow
  glowBottom.addColorStop(1, 'rgba(6, 182, 212, 0)');
  ctx.fillStyle = glowBottom;
  ctx.fillRect(0, 0, width, height);

  // 3. Moldura & Borda Interna de Vidro (Glassmorphic Card)
  const margin = 60;
  const cardW = width - margin * 2;
  const cardH = height - margin * 2;
  const radius = 48;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardW, cardH, radius);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.stroke();
  ctx.restore();

  const SANS = 'system-ui, -apple-system, sans-serif';

  // 4. Header: Logo & CalisteFlow Brand
  ctx.save();
  ctx.fillStyle = '#10b981';
  ctx.font = `900 36px ${SANS}`;
  ctx.fillText('CALISTEFLOW', margin + 60, margin + 100);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
  ctx.font = `600 22px ${SANS}`;
  ctx.fillText('EVOLUÇÃO & CALISTENIA', margin + 60, margin + 135);

  // Badge da categoria no topo direito
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  ctx.roundRect(width - margin - 320, margin + 70, 260, 56, 28);
  ctx.fill();
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.font = `800 20px ${SANS}`;
  ctx.fillText(categoryLabel.toUpperCase(), width - margin - 90, margin + 106);
  ctx.restore();

  // 5. Ícone Central da Conquista
  const iconCenterY = margin + 380;
  ctx.save();
  // Círculo de fundo do ícone
  const circleGrad = ctx.createLinearGradient(
    width / 2 - 120,
    iconCenterY - 120,
    width / 2 + 120,
    iconCenterY + 120
  );
  circleGrad.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
  circleGrad.addColorStop(1, 'rgba(6, 182, 212, 0.2)');
  ctx.beginPath();
  ctx.arc(width / 2, iconCenterY, 130, 0, Math.PI * 2);
  ctx.fillStyle = circleGrad;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.5)';
  ctx.stroke();

  // Emoji do badge
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '120px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
  ctx.fillText(badgeIcon, width / 2, iconCenterY);
  ctx.restore();

  // 6. Título da Conquista
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 54px ${SANS}`;
  ctx.fillText(title, width / 2, margin + 580);

  // Subtítulo / Descrição da Conquista
  ctx.fillStyle = 'rgba(203, 213, 225, 0.9)';
  ctx.font = `500 28px ${SANS}`;

  // Quebra de texto simples em 2 linhas se for longo
  const words = subtitle.split(' ');
  let line1 = '';
  let line2 = '';
  for (const w of words) {
    if ((line1 + w).length < 42) {
      line1 += (line1 ? ' ' : '') + w;
    } else {
      line2 += (line2 ? ' ' : '') + w;
    }
  }
  ctx.fillText(line1, width / 2, margin + 640);
  if (line2) {
    ctx.fillText(line2, width / 2, margin + 680);
  }
  ctx.restore();

  // 7. Card de Métrica em Destaque
  const metricCardY = margin + 740;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(margin + 60, metricCardY, cardW - 120, 220, 32);
  ctx.fillStyle = 'rgba(2, 6, 23, 0.6)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.25)';
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
  ctx.font = `700 22px ${SANS}`;
  ctx.fillText(metricLabel.toUpperCase(), width / 2, metricCardY + 60);

  // Valor da Métrica com Gradiente
  const textGrad = ctx.createLinearGradient(
    width / 2 - 200,
    metricCardY + 130,
    width / 2 + 200,
    metricCardY + 130
  );
  textGrad.addColorStop(0, '#34d399');
  textGrad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = textGrad;
  ctx.font = `900 68px ${SANS}`;
  ctx.fillText(metricValue, width / 2, metricCardY + 145);
  ctx.restore();

  // 8. Rodapé: Data e Selo Oficial de Autenticidade
  ctx.save();
  ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
  ctx.font = `600 24px ${SANS}`;
  ctx.textAlign = 'left';
  ctx.fillText(`Conquistado em: ${dateStr}`, margin + 60, height - margin - 70);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#10b981';
  ctx.font = `800 24px ${SANS}`;
  ctx.fillText('calisteflow.app', width - margin - 60, height - margin - 70);
  ctx.restore();

  return canvas;
}

/**
 * Dispara o compartilhamento nativo via Web Share API ou download direto da imagem PNG.
 */
export async function shareOrDownloadCard(
  canvas: HTMLCanvasElement,
  filename: string = 'conquista-calisteflow.png'
): Promise<void> {
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 0.95));
  if (!blob) throw new Error('Falha ao gerar arquivo de imagem');

  const file = new File([blob], filename, { type: 'image/png' });

  // Tentar Web Share API se suportado para arquivos
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Minha Conquista no CalisteFlow',
        text: 'Evolução real na calistenia com o CalisteFlow! 💪⚡',
      });
      return;
    } catch (e: any) {
      if (e.name === 'AbortError') return; // Usuário cancelou o share
      console.warn('[Share] Web Share falhou, fallback para download:', e);
    }
  }

  // Fallback: Download tradicional do arquivo PNG
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

