import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Search,
  Printer,
  BookOpen,
} from 'lucide-react';
import { TRAFFIC_LIGHT_DATA, RegulationItem } from '../data/regulations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RegulationsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeZone, setActiveZone] = useState<'all' | 'red' | 'yellow' | 'green'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filterItems = (items: RegulationItem[]) => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.rule.toLowerCase().includes(query) ||
        item.exampleDangerous.toLowerCase().includes(query) ||
        item.exampleSafe.toLowerCase().includes(query)
    );
  };

  const filteredRed = activeZone === 'all' || activeZone === 'red' ? filterItems(TRAFFIC_LIGHT_DATA.red) : [];
  const filteredYellow = activeZone === 'all' || activeZone === 'yellow' ? filterItems(TRAFFIC_LIGHT_DATA.yellow) : [];
  const filteredGreen = activeZone === 'all' || activeZone === 'green' ? filterItems(TRAFFIC_LIGHT_DATA.green) : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 my-6 text-slate-800 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  Регламент компании «Светофор безопасности ИИ»
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Версия 2026.1
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Официальные правила работы с генеративным ИИ в международной логистике, фрахте и ВЭД
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              title="Распечатать регламент"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Filters and Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 my-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-2xl">
            <button
              onClick={() => setActiveZone('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeZone === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Все зоны
            </button>
            <button
              onClick={() => setActiveZone('red')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeZone === 'red'
                  ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-sm'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              Красная ({TRAFFIC_LIGHT_DATA.red.length})
            </button>
            <button
              onClick={() => setActiveZone('yellow')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeZone === 'yellow'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Желтая ({TRAFFIC_LIGHT_DATA.yellow.length})
            </button>
            <button
              onClick={() => setActiveZone('green')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeZone === 'green'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Зеленая ({TRAFFIC_LIGHT_DATA.green.length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по регламенту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Regulations list */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* RED ZONE */}
          {filteredRed.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider">
                  🔴 КРАСНАЯ ЗОНА (СТРОГО ЗАПРЕЩЕНО — Увольнение / Уголовная / Материальная ответственность)
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {filteredRed.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 bg-white border border-rose-200 rounded-2xl shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center justify-center text-xs font-bold font-mono">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
                        Zero Tolerance
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{item.rule}</p>

                    {item.consequences && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-900">
                        <strong>Последствия нарушения:</strong> {item.consequences}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200">
                        <span className="font-bold text-rose-700 block mb-1">❌ Как делать нельзя:</span>
                        <span className="text-slate-700">{item.exampleDangerous}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                        <span className="font-bold text-emerald-800 block mb-1">✅ Регламентная альтернатива:</span>
                        <span className="text-slate-700">{item.exampleSafe}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* YELLOW ZONE */}
          {filteredYellow.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider">
                  🟡 ЖЕЛТАЯ ЗОНА (РАЗРЕШЕНО ТОЛЬКО С ОБЕЗЛИЧИВАНИЕМ И ПРОВЕРКОЙ)
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {filteredYellow.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 bg-white border border-amber-200 rounded-2xl shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center text-xs font-bold font-mono">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                        Human-in-the-loop
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{item.rule}</p>

                    {item.requirements && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                        <strong>Обязательное условие:</strong> {item.requirements}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200">
                        <span className="font-bold text-rose-700 block mb-1">❌ Опасный промт:</span>
                        <span className="text-slate-700">{item.exampleDangerous}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                        <span className="font-bold text-emerald-800 block mb-1">✅ Безопасный промт:</span>
                        <span className="text-slate-700">{item.exampleSafe}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GREEN ZONE */}
          {filteredGreen.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider">
                  🟢 ЗЕЛЕНАЯ ЗОНА (СВОБОДНОЕ ИСПОЛЬЗОВАНИЕ БЕЗ ОГРАНИЧЕНИЙ)
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {filteredGreen.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 bg-white border border-emerald-200 rounded-2xl shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center text-xs font-bold font-mono">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        Безопасно
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{item.rule}</p>

                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs">
                      <span className="font-bold text-emerald-800 block mb-1">💡 Рекомендуемый сценарий:</span>
                      <span className="text-slate-700">{item.exampleSafe}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredRed.length === 0 && filteredYellow.length === 0 && filteredGreen.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              По запросу «{searchQuery}» ничего не найдено в регламенте.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Служба комплаенса и информационной безопасности © 2026</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors shadow-xs"
          >
            Понятно, закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
