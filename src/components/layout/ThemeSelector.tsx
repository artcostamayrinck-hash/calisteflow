import React from 'react';
import { Sun, Moon, Eye, Monitor } from 'lucide-react';
import { getAppSettings, saveAppSettings, applyThemeAndOutdoorClasses } from '../../utils/appSettings';
import { soundManager } from '../../utils/audio';

export type ThemeMode = 'dark' | 'light' | 'auto' | 'high-contrast';

interface ThemeSelectorProps {
  currentTheme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
  compact?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
  compact = false,
}) => {
  const [theme, setTheme] = React.useState<ThemeMode>(() => {
    if (currentTheme) return currentTheme;
    const s = getAppSettings();
    return s.theme;
  });

  const handleSelect = (newTheme: ThemeMode) => {
    soundManager.triggerHaptic([30]);
    setTheme(newTheme);
    const s = getAppSettings();
    const updated = {
      ...s,
      theme: newTheme,
      outdoorMode: newTheme === 'high-contrast',
    };
    saveAppSettings(updated);
    applyThemeAndOutdoorClasses(newTheme, updated.outdoorMode);
    onThemeChange?.(newTheme);
  };

  const options: Array<{ id: ThemeMode; label: string; short: string; icon: React.ReactNode; desc: string }> = [
    {
      id: 'dark',
      label: 'Escuro',
      short: 'Escuro',
      icon: <Moon className="w-4 h-4" />,
      desc: 'Azul-marinho escuro padrão do protótipo',
    },
    {
      id: 'light',
      label: 'Claro (Sol/Outdoor)',
      short: 'Claro',
      icon: <Sun className="w-4 h-4" />,
      desc: 'Ideal para treinos em praças sob sol intenso',
    },
    {
      id: 'auto',
      label: 'Automático',
      short: 'Auto',
      icon: <Monitor className="w-4 h-4" />,
      desc: 'Sincroniza com as configurações do sistema',
    },
    {
      id: 'high-contrast',
      label: 'Alto Contraste',
      short: 'Contraste',
      icon: <Eye className="w-4 h-4" />,
      desc: 'Preto puro com bordas nítidas (WCAG AAA)',
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
        {options.map(opt => {
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title={opt.label}
              aria-label={`Mudar tema para ${opt.label}`}
              aria-pressed={isSelected}
            >
              {opt.icon}
              <span className="hidden sm:inline">{opt.short}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {options.map(opt => {
        const isSelected = theme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleSelect(opt.id)}
            className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3 cursor-pointer min-h-[52px] ${
              isSelected
                ? 'bg-emerald-500/15 border-emerald-500/60 shadow-md shadow-emerald-950/20 text-emerald-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
            }`}
            aria-pressed={isSelected}
          >
            <div
              className={`p-2 rounded-xl mt-0.5 ${
                isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {opt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold flex items-center gap-1.5">
                {opt.label}
                {isSelected && <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Ativo</span>}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">{opt.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
