/**
 * Renderizador de Apoios e Equipamentos de Calistenia (Props) para CalisteFlow
 * Desenhados em cinza-azulado com leve perspectiva ortogonal conforme especificação
 */

import React from 'react';
import type { PropConfig } from './types';
import { FIGURE_PALETTE, GROUND_Y } from './constants';

export const renderPropElement = (
  prop: PropConfig | undefined,
  isBackgroundLayer: boolean
): React.ReactNode => {
  if (!prop) return null;

  const { props: colors } = FIGURE_PALETTE;

  switch (prop.type) {
    case 'box': {
      // Caixa / Banco (frente #475569, topo #94A3B8, altura típica 70, largura 84)
      if (isBackgroundLayer) return null; // desenhado na camada frontal
      const w = prop.width || 84;
      const h = prop.height || 70;
      const x = prop.x ?? 220;
      const y = prop.y ?? (GROUND_Y - h);
      const topDepth = 8;

      return (
        <g id="prop-box" className="select-none">
          {/* Topo em perspectiva suave */}
          <polygon
            points={`${x},${y} ${x + topDepth},${y - topDepth} ${x + w + topDepth},${y - topDepth} ${x + w},${y}`}
            fill={colors.boxTop}
            stroke="#64748B"
            strokeWidth="1"
          />
          {/* Face lateral direita em perspectiva */}
          <polygon
            points={`${x + w},${y} ${x + w + topDepth},${y - topDepth} ${x + w + topDepth},${GROUND_Y - topDepth} ${x + w},${GROUND_Y}`}
            fill={colors.boxSide}
            stroke="#334155"
            strokeWidth="1"
          />
          {/* Face frontal */}
          <rect
            x={x}
            y={y}
            width={w}
            height={GROUND_Y - y}
            fill={colors.boxFront}
            stroke="#334155"
            strokeWidth="1.5"
            rx="2"
          />
        </g>
      );
    }

    case 'pullupBar': {
      // Barra Fixa (círculo #CBD5E1 de raio 5 na seção, braço de fixação #64748B e poste #334155)
      const barX = prop.x ?? 200;
      const barY = prop.y ?? 46;

      if (isBackgroundLayer) {
        // Poste e braço de fixação de trás
        return (
          <g id="prop-pullup-bar-structure" className="select-none">
            {/* Poste vertical até o chão */}
            <rect
              x={barX - 90}
              y={barY}
              width={10}
              height={GROUND_Y - barY}
              fill={colors.barPost}
              rx="2"
            />
            {/* Braço horizontal de fixação */}
            <rect
              x={barX - 90}
              y={barY - 4}
              width={100}
              height={8}
              fill={colors.barBracket}
              rx="2"
            />
            {/* Flange estrutural */}
            <circle cx={barX} cy={barY} r={8} fill={colors.barBracket} />
          </g>
        );
      } else {
        // Seção frontal da barra (onde as mãos seguram)
        return (
          <g id="prop-pullup-bar-grip" className="select-none">
            <circle cx={barX} cy={barY} r={5} fill={colors.barSteel} stroke="#94A3B8" strokeWidth="1" />
            <line
              x1={barX - 25}
              y1={barY}
              x2={barX + 25}
              y2={barY}
              stroke={colors.barSteel}
              strokeWidth="10"
              strokeLinecap="round"
            />
          </g>
        );
      }
    }

    case 'lowBar': {
      // Barra baixa para remada australiana / extensões
      const barX = prop.x ?? 240;
      const barY = prop.y ?? 135;

      if (isBackgroundLayer) {
        return (
          <g id="prop-lowbar-post" className="select-none">
            <rect x={barX - 6} y={barY} width={12} height={GROUND_Y - barY} fill={colors.barPost} rx="2" />
          </g>
        );
      } else {
        return (
          <g id="prop-lowbar-steel" className="select-none">
            <circle cx={barX} cy={barY} r={6} fill={colors.barSteel} stroke="#94A3B8" strokeWidth="1.5" />
          </g>
        );
      }
    }

    case 'dipBars': {
      // Barras paralelas (duplas com perspectiva lateral)
      const barY = prop.y ?? 140;
      const x1 = prop.x ?? 130;
      const x2 = x1 + 140;

      if (isBackgroundLayer) {
        // Barra traseira (mais escura)
        return (
          <g id="prop-dipbar-back" opacity="0.6">
            <line x1={x1 + 15} y1={barY - 8} x2={x2 + 15} y2={barY - 8} stroke={colors.barSteel} strokeWidth="7" strokeLinecap="round" />
            <line x1={x1 + 25} y1={barY - 8} x2={x1 + 25} y2={GROUND_Y} stroke={colors.barPost} strokeWidth="8" strokeLinecap="round" />
            <line x1={x2 + 5} y1={barY - 8} x2={x2 + 5} y2={GROUND_Y} stroke={colors.barPost} strokeWidth="8" strokeLinecap="round" />
          </g>
        );
      } else {
        // Barra frontal
        return (
          <g id="prop-dipbar-front">
            <line x1={x1} y1={barY} x2={x2} y2={barY} stroke={colors.barSteel} strokeWidth="8" strokeLinecap="round" />
            <line x1={x1 + 10} y1={barY} x2={x1 + 10} y2={GROUND_Y} stroke={colors.barPost} strokeWidth="9" strokeLinecap="round" />
            <line x1={x2 - 10} y1={barY} x2={x2 - 10} y2={GROUND_Y} stroke={colors.barPost} strokeWidth="9" strokeLinecap="round" />
          </g>
        );
      }
    }

    case 'rings': {
      // Argolas olímpicas suspensas
      const ringX = prop.x ?? 200;
      const ringY = prop.y ?? 110;

      if (isBackgroundLayer) {
        // Tiras de suspensão
        return (
          <g id="prop-rings-straps">
            <line x1={ringX - 4} y1={10} x2={ringX - 4} y2={ringY - 14} stroke="#1E293B" strokeWidth="4" />
          </g>
        );
      } else {
        // Aro da argola
        return (
          <g id="prop-ring">
            <circle cx={ringX} cy={ringY} r={14} fill="none" stroke="#D97706" strokeWidth="4.5" />
            <circle cx={ringX} cy={ringY} r={12} fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.6" />
          </g>
        );
      }
    }

    case 'wall': {
      // Parede de apoio
      if (!isBackgroundLayer) return null;
      const wallX = prop.x ?? 60;
      return (
        <g id="prop-wall">
          <line x1={wallX} y1={20} x2={wallX} y2={GROUND_Y} stroke={colors.wall} strokeWidth="12" />
          <line x1={wallX - 6} y1={GROUND_Y - 14} x2={wallX + 6} y2={GROUND_Y - 14} stroke={colors.wallSkirting} strokeWidth="6" />
        </g>
      );
    }

    case 'abWheel': {
      // Roda Abdominal
      if (isBackgroundLayer) return null;
      const wheelX = prop.x ?? 260;
      const wheelY = prop.y ?? (GROUND_Y - 14);

      return (
        <g id="prop-abwheel">
          <circle cx={wheelX} cy={wheelY} r={15} fill="#1E293B" stroke="#10B981" strokeWidth="3" />
          <circle cx={wheelX} cy={wheelY} r={4} fill="#CBD5E1" />
          <line x1={wheelX - 12} y1={wheelY} x2={wheelX + 12} y2={wheelY} stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    }

    case 'doorTowel': {
      // Toalha na porta para puxada horizontal ou rosca
      const attachX = prop.x ?? 300;
      const attachY = prop.y ?? 130;
      const handPoint = prop.secondaryPoint ?? { x: attachX - 50, y: attachY + 10 };

      if (isBackgroundLayer) {
        return (
          <g id="prop-door">
            <rect x={attachX} y={40} width={16} height={GROUND_Y - 40} fill="#334155" stroke="#475569" strokeWidth="1.5" />
            <circle cx={attachX - 3} cy={attachY} r={4} fill="#CBD5E1" />
          </g>
        );
      } else {
        return (
          <g id="prop-towel">
            <line
              x1={attachX - 3}
              y1={attachY}
              x2={handPoint.x}
              y2={handPoint.y}
              stroke="#38BDF8"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        );
      }
    }

    case 'band': {
      // Elástico de assistência
      if (isBackgroundLayer) return null;
      const startP = prop.attachmentPoint ?? { x: 200, y: 46 };
      const endP = prop.secondaryPoint ?? { x: 200, y: 180 };

      return (
        <line
          x1={startP.x}
          y1={startP.y}
          x2={endP.x}
          y2={endP.y}
          stroke="#EF4444"
          strokeWidth="4"
          strokeDasharray="6 3"
          strokeLinecap="round"
          opacity="0.85"
        />
      );
    }

    case 'backpack': {
      // Mochila de carga
      if (isBackgroundLayer) return null;
      const backX = prop.x ?? 180;
      const backY = prop.y ?? 150;

      return (
        <g id="prop-backpack">
          <rect x={backX - 10} y={backY - 14} width={20} height={28} rx="6" fill="#334155" stroke="#475569" strokeWidth="1.5" />
          <line x1={backX - 6} y1={backY - 8} x2={backX + 6} y2={backY - 8} stroke="#94A3B8" strokeWidth="1" />
        </g>
      );
    }

    default:
      return null;
  }
};
