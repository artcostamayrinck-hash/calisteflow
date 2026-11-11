import React from 'react';
import { Modal } from '../ui/Modal';
import { Toggle } from '../ui/Toggle';
import { Button } from '../ui/Button';
import { RotateCcw, Check, LayoutGrid } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export interface DashboardModuleConfig {
  resumeBanner: boolean;
  weekSummary: boolean;
  recommendedWorkout: boolean;
  activeProgram: boolean;
  weeklyGoals: boolean;
  recentAchievements: boolean;
  quickAccess: boolean;
  postureMobility: boolean;
}

export const DEFAULT_DASHBOARD_CONFIG: DashboardModuleConfig = {
  resumeBanner: true,
  weekSummary: true,
  recommendedWorkout: true,
  activeProgram: true,
  weeklyGoals: true,
  recentAchievements: true,
  quickAccess: true,
  postureMobility: true,
};

const STORAGE_KEY = 'calistheflow_dashboard_modules_v1';

export function getDashboardConfig(): DashboardModuleConfig {
  if (typeof window === 'undefined') return { ...DEFAULT_DASHBOARD_CONFIG };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DASHBOARD_CONFIG };
    return { ...DEFAULT_DASHBOARD_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_DASHBOARD_CONFIG };
  }
}

export function saveDashboardConfig(config: DashboardModuleConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

interface DashboardCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DashboardModuleConfig;
  onChange: (config: DashboardModuleConfig) => void;
}

export const DashboardCustomizerModal: React.FC<DashboardCustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
}) => {
  const handleToggle = (key: keyof DashboardModuleConfig) => {
    soundManager.triggerHaptic([20]);
    const next = { ...config, [key]: !config[key] };
    onChange(next);
    saveDashboardConfig(next);
  };

  const handleReset = () => {
    soundManager.triggerHaptic([30]);
    onChange({ ...DEFAULT_DASHBOARD_CONFIG });
    saveDashboardConfig({ ...DEFAULT_DASHBOARD_CONFIG });
  };

  const modules: Array<{
    key: keyof DashboardModuleConfig;
    label: string;
    desc: string;
  }> = [
    {
      key: 'resumeBanner',
      label: 'Continuar Treino em Andamento',
      desc: 'Banner de restauração rápida quando um treino foi pausado ou interrompido',
    },
    {
      key: 'recommendedWorkout',
      label: 'Treino Recomendado do Dia',
      desc: 'Card de ação principal com o treino agendado para hoje ou sugestão de rotina',
    },
    {
      key: 'weekSummary',
      label: 'Resumo da Semana',
      desc: 'Métricas de treinos concluídos, sequência de dias e tempo total',
    },
    {
      key: 'activeProgram',
      label: 'Programa em Andamento',
      desc: 'Status do plano de treino atual e previsão do próximo treino',
    },
    {
      key: 'weeklyGoals',
      label: 'Metas e Progresso',
      desc: 'Acompanhamento da meta semanal de treinos e consistência',
    },
    {
      key: 'recentAchievements',
      label: 'Conquistas Recentes',
      desc: 'Medalhas desbloqueadas, recordes e marcos de evolução',
    },
    {
      key: 'postureMobility',
      label: 'Atalho de Postura & Mobilidade',
      desc: 'Acesso direto a rotinas de aquecimento articular, mobilidade e descompressão',
    },
    {
      key: 'quickAccess',
      label: 'Acesso Rápido à Biblioteca',
      desc: 'Atalhos para catálogo de exercícios, habilidades e histórico',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-emerald-400" />
          <span>Personalizar Tela Inicial</span>
        </div>
      }
      description="Escolha quais seções você deseja visualizar na sua página inicial para um treino focado."
      maxWidth="md"
    >
      <div className="space-y-2 py-1">
        {modules.map(m => (
          <Toggle
            key={m.key}
            checked={config[m.key]}
            onChange={() => handleToggle(m.key)}
            label={m.label}
            description={m.desc}
            className="border border-slate-800/80 hover:border-slate-700/80"
          />
        ))}
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<RotateCcw className="w-4 h-4" />}
          onClick={handleReset}
        >
          Restaurar Padrão
        </Button>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Check className="w-4 h-4" />}
          onClick={onClose}
        >
          Concluir
        </Button>
      </div>
    </Modal>
  );
};

