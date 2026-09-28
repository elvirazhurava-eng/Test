import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Target,
  GraduationCap,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Lock,
  TrendingUp,
  Scale,
  Award,
  ChevronDown,
  ChevronUp,
  Tv,
  ExternalLink,
  Play,
} from 'lucide-react';
import { TRAFFIC_LIGHT_DATA } from '../data/regulations';
import { CATEGORIES } from '../data/examQuestions';
import { ExamSubmission, formatDateTime } from '../utils/crypto';
import { REGULATORY_DOCS } from '../data/regulatoryDocs';

interface Props {
  onSelectTab: (tab: 'dashboard' | 'practice' | 'exam') => void;
  onOpenRegulations: () => void;
  onOpenSanitizer: () => void;
  onOpenCartoon: () => void;
  onOpenRegulatoryDocs: () => void;
}

export const Dashboard: React.FC<Props> = ({
  onSelectTab,
  onOpenRegulations,
  onOpenSanitizer,
  onOpenCartoon,
  onOpenRegulatoryDocs,
}) => {
  const [accordionOpen, setAccordionOpen] = useState(true);

  // Load history from localStorage
  const history: ExamSubmission[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('ai_logistics_exam_history') || '[]');
    } catch {
      return [];
    }
  })();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Cartoon Promo Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold">
            <Tv className="w-3.5 h-3.5 text-amber-300" />
            Интерактивная видео-история
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            Мультфильм: «Приключения Логиста Макса и Кибер-Светофор»
          </h2>
          <p className="text-sm text-blue-100 leading-relaxed">
            Посмотрите 3-минутную анимацию о том, как экспедитор Макс чуть не загрузил ставки Maersk в ChatGPT,
            и как Кибер-Капитан Влад спас компанию от штрафа в $500,000!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={onOpenCartoon}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-blue-50 text-indigo-950 font-extrabold text-sm shadow-xl transition-all active:scale-95 group"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
            </div>
            <span>Смотреть мультфильм</span>
          </button>
        </div>
      </div>

      {/* Main Hero Card (Light Theme) */}
      <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Корпоративный стандарт ИИ-безопасности 2026
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Безопасный ИИ в международной логистике и ВЭД
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Интерактивная среда обучения и официальной аттестации сотрудников экспедиторских, таможенных
            и фрахтовых компаний по безопасной работе с большими языковыми моделями (ChatGPT, Claude, Gemini).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTab('exam')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95 group"
            >
              <GraduationCap className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>🎓 Интерактивный экзамен (10 вопросов)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onSelectTab('practice')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all active:scale-95 group"
            >
              <Target className="w-5 h-5 text-blue-600 group-hover:rotate-12 transition-transform" />
              <span>🎯 Тренажер инцидентов</span>
            </button>

            <button
              onClick={onOpenRegulatoryDocs}
              className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200 transition-colors"
            >
              <Scale className="w-4 h-4 text-slate-700" />
              <span>Нормативные документы</span>
            </button>

            <button
              onClick={onOpenSanitizer}
              className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-sm border border-emerald-200 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Обезличить промт</span>
            </button>
          </div>
        </div>
      </div>

      {/* Accordion: Traffic Light Security Policy Widget (Light Theme) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div
          onClick={() => setAccordionOpen(!accordionOpen)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Справочник «Светофор безопасности»
                <span className="text-xs font-normal text-slate-500 hidden sm:inline">
                  (Регламент допуска и персональной ответственности)
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                🔴 Красная зона (Запрещено) | 🟡 Желтая зона (Обезличивание) | 🟢 Зеленая зона (Свободно)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenRegulations();
              }}
              className="text-xs font-semibold text-blue-600 hover:underline mr-2"
            >
              Открыть целиком
            </button>
            <div className="p-2 text-slate-500 hover:text-slate-800 rounded-xl bg-slate-100">
              {accordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {accordionOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            {/* RED ZONE SUMMARY */}
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  🔴 КРАСНАЯ ЗОНА
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 font-bold">
                  Увольнение
                </span>
              </div>
              <p className="text-xs text-rose-900 font-semibold">
                Категорически запрещено загружать в общедоступные нейросети:
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Ставки морских линий (Maersk, MSC), маржинальность, матрицы тарифов.</li>
                <li>Паспорта водителей, полные сканы коносаментов (B/L), CMR, инвойсов с ПДН.</li>
                <li>Проверка санкций (OFAC/EU) исключительно через ИИ (риск галлюцинаций).</li>
                <li>Автоматическая подача ДТ по коду ИИ без брокера (ст. 16.2 КоАП РФ).</li>
                <li>API-токены, пароли от TMS/WMS, личных кабинетов таможни.</li>
              </ul>
            </div>

            {/* YELLOW ZONE SUMMARY */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  🟡 ЖЕЛТАЯ ЗОНА
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 font-bold">
                  С десенсибилизацией
                </span>
              </div>
              <p className="text-xs text-amber-900 font-semibold">
                Разрешено ТОЛЬКО с предварительным обезличиванием данных:
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Деловая переписка с судовладельцами (замена имен на [Компания А], сумм на [XXX]).</li>
                <li>Претензионная работа (Demurrage/Detention) без номеров контейнеров и реквизитов.</li>
                <li>Суммаризация открытых отчетов фрахта (Drewry, Xeneta, Platts, SCFI).</li>
              </ul>
            </div>

            {/* GREEN ZONE SUMMARY */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  🟢 ЗЕЛЕНАЯ ЗОНА
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 font-bold">
                  Свободный доступ
                </span>
              </div>
              <p className="text-xs text-emerald-900 font-semibold">
                Безопасное и продуктивное использование ИИ без ограничений:
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Формулы Excel (ВПР, XLOOKUP, регулярные выражения) на синтетических данных.</li>
                <li>Мозговой штурм логистических цепочек в общем виде (без привязки к клиенту).</li>
                <li>Перевод и толкование правил Инкотермс 2020, конвенций CMR и Гаага-Висби.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Regulatory Documents Link Bar */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-xs">
            <Scale className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Правовая база и нормативные документы (9 актов)
            </h3>
            <p className="text-xs text-slate-500">
              ТК ЕАЭС, ст. 16.2 КоАП РФ, 152-ФЗ, GDPR, 98-ФЗ, OFAC SDN, Инкотермс 2020, КДПГ/CMR
            </p>
          </div>
        </div>

        <button
          onClick={onOpenRegulatoryDocs}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-xl transition-colors shadow-xs"
        >
          <span>Изучить нормативные акты</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5 Specialized Safety Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">5 направлений аттестации и комплаенса</h2>
          <span className="text-xs text-slate-500">10 интерактивных экзаменационных вопросов</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <div
              key={key}
              onClick={() => onSelectTab('practice')}
              className="group p-5 bg-white border border-slate-200 hover:border-blue-300 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${cat.badgeBg}`}>
                  {cat.shortTitle}
                </span>
                <span className="text-xs font-mono text-slate-400">2 вопроса</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                {cat.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {cat.description}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-blue-600">
                <span className="font-semibold">Тренировать кейсы</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}

          {/* Quick CTA to start 10-Question Exam */}
          <div
            onClick={() => onSelectTab('exam')}
            className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/20 text-white border border-white/30">
                Аттестация
              </span>
              <h3 className="text-base font-bold text-white mt-3 mb-1">
                Интерактивный экзамен (10 вопросов)
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Пройдите тестирование с интерактивными кейсами для получения именного сертификата и отчета руководству.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-300">
              <span>Начать экзамен сейчас</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Previous attempts history if any */}
      {history.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              История последних аттестаций на этом устройстве
            </h3>
            <span className="text-xs text-slate-500">Показаны последние {history.length} попыток</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Сотрудник</th>
                  <th className="py-2.5 px-3">Отдел</th>
                  <th className="py-2.5 px-3">Результат</th>
                  <th className="py-2.5 px-3">Статус</th>
                  <th className="py-2.5 px-3">Дата</th>
                  <th className="py-2.5 px-3">Код проверки</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{item.fullName}</td>
                    <td className="py-2.5 px-3 text-slate-500">{item.department}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {item.score}/{item.totalQuestions} ({item.percentage}%)
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          item.passed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.passed ? 'СДАН' : 'НЕ СДАН'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{formatDateTime(item.timestamp)}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-blue-600 font-bold">
                      {item.verificationCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
