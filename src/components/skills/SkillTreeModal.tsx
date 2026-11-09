import React, { useState } from 'react';
import type { SkillStatus } from '../../types';
import { getSkillTreeProgress, saveSkillNodeStatus } from '../../utils/storage';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import { soundManager } from '../../utils/audio';
import {
  X,
  Sparkles,
  Lock,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface SkillTreeModalProps {
  onClose: () => void;
  onOpenExerciseDetails?: (exerciseId: string) => void;
}

interface SkillProgressTrack {
  id: string;
  name: string;
  category: string;
  description: string;
  nodes: {
    id: string;
    title: string;
    level: string;
    description: string;
    exerciseId?: string;
  }[];
}

const SKILL_TRACKS: SkillProgressTrack[] = [
  {
    id: 'pullup',
    name: 'Barra Fixa (Pull-up)',
    category: 'Puxar Vertical',
    description: 'Do suporte inicial na barra à primeira repetição estrita completa.',
    nodes: [
      {
        id: 'sk_dead_hang',
        title: 'Dead Hang Passivo',
        level: 'Iniciante',
        description: 'Construa 45 a 60 segundos de pegada firme na barra sem balançar.',
        exerciseId: 'dead-hang',
      },
      {
        id: 'sk_australian_pullup',
        title: 'Remada Australiana',
        level: 'Iniciante',
        description: 'Remada na barra baixa com calcanhares no solo para ativar dorsais.',
        exerciseId: 'barra-australiana',
      },
      {
        id: 'sk_negative_pullup',
        title: 'Barra Fixa Excêntrica (Negativa)',
        level: 'Intermediário',
        description: 'Suba com impulso e desça controladamente em 4 a 5 segundos.',
        exerciseId: 'barra-fixa-negativa',
      },
      {
        id: 'sk_strict_pullup',
        title: 'Barra Fixa Pronada Estrita',
        level: 'Intermediário',
        description: 'Primeira série de 5 repetições com queixo acima da barra sem embalo.',
        exerciseId: 'barra-fixa-pronada',
      },
    ],
  },
  {
    id: 'handstand',
    name: 'Parada de Mão (Handstand)',
    category: 'Equilíbrio & Empurrar',
    description: 'Domínio do alinhamento escapular, pulso e controle do centro de massa.',
    nodes: [
      {
        id: 'sk_pike_hold',
        title: 'Pike Hold no Solo',
        level: 'Iniciante',
        description: 'Sustentação em V invertido para acostumar ombros e trapézio com a carga.',
        exerciseId: 'pike-hold',
      },
      {
        id: 'sk_wall_walk',
        title: 'Wall Walk (Escalador de Parede)',
        level: 'Iniciante',
        description: 'Caminhe com os pés pela parede até ficar com a barriga próxima à parede.',
        exerciseId: 'wall-walk',
      },
      {
        id: 'sk_wall_handstand',
        title: 'Parada de Mão na Parede (60s)',
        level: 'Intermediário',
        description: 'Linha reta com retroversão pélvica e protração escapular ativa.',
        exerciseId: 'parada-mao-parede',
      },
      {
        id: 'sk_free_handstand',
        title: 'Parada de Mão Livre (10s+)',
        level: 'Avançado',
        description: 'Equilíbrio autônomo no centro da sala corrigindo com a ponta dos dedos.',
        exerciseId: 'parada-mao-livre',
      },
    ],
  },
  {
    id: 'muscleup',
    name: 'Muscle-up na Barra',
    category: 'Explosão & Transição',
    description: 'A união suprema da puxada explosiva com a transição e o mergulho alto.',
    nodes: [
      {
        id: 'sk_high_pullups',
        title: 'Barra Fixa Explosiva ao Peito',
        level: 'Intermediário',
        description: 'Puxe com máxima aceleração até encostar a barra na linha dos mamilos.',
        exerciseId: 'barra-fixa-peito',
      },
      {
        id: 'sk_straight_bar_dip',
        title: 'Mergulho na Barra Fixa',
        level: 'Intermediário',
        description: 'Mergulho frontal equilibrando o tronco sobre a barra sem balançar.',
        exerciseId: 'mergulho-barra-reta',
      },
      {
        id: 'sk_band_muscleup',
        title: 'Transição de Muscle-up com Elástico',
        level: 'Avançado',
        description: 'Aprenda o giro rápido dos cotovelos por cima da barra com auxílio.',
        exerciseId: 'muscleup-assistido',
      },
      {
        id: 'sk_strict_muscleup',
        title: 'Barra Muscle-up Completo',
        level: 'Elite',
        description: 'Puxada e mergulho fluidos sem kipping excessivo nem cotovelo solto.',
        exerciseId: 'muscle-up-barra',
      },
    ],
  },
  {
    id: 'frontlever',
    name: 'Front Lever',
    category: 'Força Isométrica de Dorsais',
    description: 'Sustentação horizontal completa do corpo sob a barra em extensão.',
    nodes: [
      {
        id: 'sk_tuck_front_lever',
        title: 'Tuck Front Lever',
        level: 'Intermediário',
        description: 'Joelhos recolhidos junto ao peito com braços estendidos e costas retas.',
        exerciseId: 'tuck-front-lever',
      },
      {
        id: 'sk_adv_tuck_front_lever',
        title: 'Advanced Tuck Front Lever',
        level: 'Avançado',
        description: 'Ângulo de 90° entre quadril e coxas mantendo o dorso plano.',
        exerciseId: 'adv-tuck-front-lever',
      },
      {
        id: 'sk_straddle_front_lever',
        title: 'Straddle Front Lever',
        level: 'Avançado',
        description: 'Pernas abertas e esticadas para reduzir a alavanca mecânica.',
        exerciseId: 'straddle-front-lever',
      },
      {
        id: 'sk_full_front_lever',
        title: 'Full Front Lever (5s+)',
        level: 'Elite',
        description: 'Corpo completamente horizontal em perfeita linha reta sob a barra.',
        exerciseId: 'full-front-lever',
      },
    ],
  },
  {
    id: 'planche',
    name: 'Planche no Solo & Paralelas',
    category: 'Poder de Ombro & Retração',
    description: 'Equilíbrio sobre as mãos com corpo horizontal suspenso no ar.',
    nodes: [
      {
        id: 'sk_planche_lean',
        title: 'Prancha Lean no Solo',
        level: 'Iniciante',
        description: 'Inclinação dos ombros à frente dos punhos com protração máxima.',
        exerciseId: 'planche-lean',
      },
      {
        id: 'sk_tuck_planche',
        title: 'Tuck Planche',
        level: 'Intermediário',
        description: 'Elevação dos pés com joelhos no peito e braços travados retos.',
        exerciseId: 'tuck-planche',
      },
      {
        id: 'sk_adv_tuck_planche',
        title: 'Advanced Tuck Planche',
        level: 'Avançado',
        description: 'Quadril e coluna alinhados na altura dos ombros por 10 segundos.',
        exerciseId: 'adv-tuck-planche',
      },
      {
        id: 'sk_straddle_planche',
        title: 'Straddle Planche',
        level: 'Elite',
        description: 'Pernas afastadas sustentadas no ar com cotovelos 100% esticados.',
        exerciseId: 'straddle-planche',
      },
    ],
  },
];

export const SkillTreeModal: React.FC<SkillTreeModalProps> = ({
  onClose,
  onOpenExerciseDetails,
}) => {
  useBodyScrollLock(true, onClose);

  const [progress, setProgress] = useState<Record<string, SkillStatus>>(getSkillTreeProgress);
  const [selectedTrackId, setSelectedTrackId] = useState<string>('pullup');

  const activeTrack = SKILL_TRACKS.find(t => t.id === selectedTrackId) || SKILL_TRACKS[0];

  const handleToggleStatus = (nodeId: string) => {
    soundManager.triggerHaptic([25]);
    const current = progress[nodeId] || 'locked';
    let next: SkillStatus;
    if (current === 'locked') next = 'in_progress';
    else if (current === 'in_progress') next = 'mastered';
    else next = 'locked';

    const updated = saveSkillNodeStatus(nodeId, next);
    setProgress({ ...updated });
  };

  const getStatusBadge = (status: SkillStatus) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Dominado
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-400" /> Em Treino
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
            <Lock className="w-3 h-3 text-slate-500" /> Bloqueado
          </span>
        );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="skilltree-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-xl glass-panel border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[min(94dvh,calc(100dvh-2rem))] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 id="skilltree-title" className="text-sm sm:text-base font-black text-slate-100">
                Árvore de Habilidades Calistênicas
              </h2>
              <p className="text-[11px] text-slate-400">
                Progressão passo a passo para dominar os 5 movimentos lendários
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar árvore de skills"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Track Selector Tabs */}
        <div className="flex items-center gap-1.5 p-3 sm:px-5 overflow-x-auto border-b border-white/5 no-scrollbar shrink-0">
          {SKILL_TRACKS.map(track => {
            const isSelected = track.id === selectedTrackId;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => {
                  soundManager.triggerHaptic([20]);
                  setSelectedTrackId(track.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20'
                    : 'glass-card border border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                {track.name.split(' (')[0]}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Track Description */}
          <div className="glass-card p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-black text-slate-100">{activeTrack.name}</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                {activeTrack.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{activeTrack.description}</p>
          </div>

          {/* Safety Notice */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-200/90 leading-relaxed font-medium">
              <strong>Segurança Biomecânica:</strong> Tendões e ligamentos adaptam-se mais lentamente que os músculos. Pare se houver dor aguda em cotovelos ou punhos.
            </p>
          </div>

          {/* Stepper / Progression Nodes */}
          <div className="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
            {activeTrack.nodes.map((node, index) => {
              const status = progress[node.id] || 'locked';
              const isMastered = status === 'mastered';
              const isInProgress = status === 'in_progress';

              return (
                <div
                  key={node.id}
                  className={`relative flex items-start gap-3.5 p-3.5 rounded-2xl border transition ${
                    isMastered
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : isInProgress
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-white/[0.03] border-white/5 opacity-85'
                  }`}
                >
                  {/* Step Node Icon Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(node.id)}
                    aria-label={`Alternar status de ${node.title}`}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 z-10 transition active:scale-90 shadow-md ${
                      isMastered
                        ? 'bg-emerald-500 text-slate-950 font-black glow-emerald'
                        : isInProgress
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-800 border border-white/10 text-slate-400'
                    }`}
                  >
                    {isMastered ? (
                      <CheckCircle2 className="w-5 h-5 stroke-[3]" />
                    ) : isInProgress ? (
                      <Clock className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <span className="text-xs font-mono font-black">{index + 1}</span>
                    )}
                  </button>

                  {/* Node Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-100">{node.title}</h4>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(node.id)}
                          className="hover:opacity-80 transition"
                        >
                          {getStatusBadge(status)}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {node.description}
                    </p>

                    {/* View Exercise In Library CTA */}
                    {node.exerciseId && onOpenExerciseDetails && (
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.triggerHaptic([20]);
                          onOpenExerciseDetails(node.exerciseId!);
                        }}
                        className="mt-2 text-[11px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 active:scale-95 transition"
                      >
                        Ver execução na biblioteca <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Hint */}
        <div className="p-3.5 border-t border-white/10 text-center text-[11px] text-slate-400 bg-white/[0.01]">
          Toque no ícone do passo para alternar entre <strong>Bloqueado</strong>, <strong>Em Treino</strong> e <strong>Dominado</strong>.
        </div>
      </div>
    </div>
  );
};
