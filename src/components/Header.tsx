import React from 'react';
import {
  ShieldCheck,
  BookOpen,
  Target,
  GraduationCap,
  Sparkles,
  Tv,
  Scale,
} from 'lucide-react';

interface Props {
  currentTab: 'dashboard' | 'practice' | 'exam';
  onSelectTab: (tab: 'dashboard' | 'practice' | 'exam') => void;
  onOpenRegulations: () => void;
  onOpenSanitizer: () => void;
  onOpenCartoon: () => void;
  onOpenRegulatoryDocs: () => void;
}

export const Header: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  onOpenRegulations,
  onOpenSanitizer,
  onOpenCartoon,
  onOpenRegulatoryDocs,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  LOGISTICS AI SECURITY
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  HUB 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Безопасный ИИ в международной логистике и ВЭД
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Главная
            </button>

            <button
              onClick={() => onSelectTab('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'practice'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-blue-500" />
              <span>Тренажер</span>
            </button>

            <button
              onClick={() => onSelectTab('exam')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'exam'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-500" />
              <span>Экзамен (10)</span>
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1 hidden md:block"></div>

            {/* Cartoon Button */}
            <button
              onClick={onOpenCartoon}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
              title="Смотреть обучающий мультфильм"
            >
              <Tv className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden lg:inline">Мультик</span>
            </button>

            {/* Regulatory Docs Button */}
            <button
              onClick={onOpenRegulatoryDocs}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Нормативно-правовые акты и законы"
            >
              <Scale className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden lg:inline">Законы</span>
            </button>

            {/* Traffic Light Button */}
            <button
              onClick={onOpenRegulations}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Открыть регламент Светофор безопасности"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">Светофор</span>
            </button>

            {/* Data Sanitizer Button */}
            <button
              onClick={onOpenSanitizer}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              title="Инструмент очистки промтов от конфиденциальных данных"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">Обезличить</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
