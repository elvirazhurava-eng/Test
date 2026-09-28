import React, { useState } from 'react';
import {
  FileCheck,
  TrendingUp,
  ShieldAlert,
  Scale,
  Lock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Filter,
  Check,
  Sparkles,
} from 'lucide-react';
import { CATEGORIES, ExamQuestion, examQuestions, interactiveExamQuestions } from '../data/examQuestions';
import { practiceCases, PracticeCase, PracticeOption } from '../data/practiceCases';

interface Props {
  onOpenRegulations: () => void;
  onOpenSanitizer: () => void;
  onSwitchToExam: () => void;
}

export const PracticeMode: React.FC<Props> = ({
  onOpenRegulations,
  onOpenSanitizer,
  onSwitchToExam,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [practiceType, setPracticeType] = useState<'scenarios' | 'examQuestions'>('scenarios');
  const [currentIndex, setCurrentIndex] = useState(0);

  // States for scenarios
  const [selectedScenarioOption, setSelectedScenarioOption] = useState<number | null>(null);

  // States for exam questions in practice mode
  const [selectedExamOption, setSelectedExamOption] = useState<number | null>(null);

  // Stats
  const [solvedStats, setSolvedStats] = useState<{ safe: number; danger: number; warning: number }>({
    safe: 0,
    danger: 0,
    warning: 0,
  });

  // Filtered lists
  const filteredCases = practiceCases.filter(
    (c) => activeCategory === 'all' || c.category === activeCategory
  );

  const filteredExamQuestions = examQuestions.filter(
    (q) => activeCategory === 'all' || q.category === activeCategory
  );

  const totalItems = practiceType === 'scenarios' ? filteredCases.length : filteredExamQuestions.length;
  const safeIndex = Math.min(currentIndex, Math.max(0, totalItems - 1));

  const currentCase: PracticeCase | undefined = filteredCases[safeIndex];
  const currentExamQ: ExamQuestion | undefined = filteredExamQuestions[safeIndex];

  const handleNext = () => {
    if (safeIndex < totalItems - 1) {
      setCurrentIndex(safeIndex + 1);
      setSelectedScenarioOption(null);
      setSelectedExamOption(null);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
      setSelectedScenarioOption(null);
      setSelectedExamOption(null);
    }
  };

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    setCurrentIndex(0);
    setSelectedScenarioOption(null);
    setSelectedExamOption(null);
  };

  const handleSelectScenarioOption = (idx: number, opt: PracticeOption) => {
    if (selectedScenarioOption !== null) return;
    setSelectedScenarioOption(idx);
    setSolvedStats((prev) => ({
      ...prev,
      [opt.status]: prev[opt.status] + 1,
    }));
  };

  const handleSelectExamOption = (idx: number, correctIdx: number) => {
    if (selectedExamOption !== null) return;
    setSelectedExamOption(idx);
    if (idx === correctIdx) {
      setSolvedStats((prev) => ({ ...prev, safe: prev.safe + 1 }));
    } else {
      setSolvedStats((prev) => ({ ...prev, danger: prev.danger + 1 }));
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedScenarioOption(null);
    setSelectedExamOption(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-800">
      {/* Top Bar with Mode Switcher & Stats (Light Theme) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-xl font-bold text-slate-900">🎯 Тренажер логистических инцидентов</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Режим практики с разбором: изучите опасные промты, последствия и правильные действия
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenRegulations}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              Светофор безопасности
            </button>
            <button
              onClick={onOpenSanitizer}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Обезличить промт
            </button>
            <button
              onClick={onSwitchToExam}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all"
            >
              Перейти к Экзамену (10 вопр.)
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Practice Type Toggle: Scenarios vs All 30 Exam Questions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-2xl">
            <button
              onClick={() => {
                setPracticeType('scenarios');
                setCurrentIndex(0);
                setSelectedScenarioOption(null);
                setSelectedExamOption(null);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                practiceType === 'scenarios'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ситуационные инциденты ({practiceCases.length})
            </button>
            <button
              onClick={() => {
                setPracticeType('examQuestions');
                setCurrentIndex(0);
                setSelectedScenarioOption(null);
                setSelectedExamOption(null);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                practiceType === 'examQuestions'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Тренировка экзаменационной базы (30 вопросов)
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Счетчик:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-bold">
              Безопасно: {solvedStats.safe}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-mono font-bold">
              Риски: {solvedStats.danger}
            </span>
            {practiceType === 'scenarios' && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-mono font-bold">
                Ошибки: {solvedStats.warning}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => handleSelectCategory('all')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Все категории ({practiceType === 'scenarios' ? practiceCases.length : examQuestions.length})
        </button>

        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const count =
            practiceType === 'scenarios'
              ? practiceCases.filter((c) => c.category === key).length
              : examQuestions.filter((q) => q.category === key).length;

          const isSelected = activeCategory === key;

          return (
            <button
              key={key}
              onClick={() => handleSelectCategory(key)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all border ${
                isSelected
                  ? `${cat.badgeBg} shadow-xs ring-1 ring-slate-300`
                  : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
            >
              {cat.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {totalItems === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
          <p className="text-base mb-3">В этой категории пока нет заданий данного типа.</p>
          <button
            onClick={() => handleSelectCategory('all')}
            className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-xs"
          >
            Сбросить фильтр
          </button>
        </div>
      )}

      {/* PRACTICE CARD: SCENARIOS */}
      {practiceType === 'scenarios' && currentCase && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${CATEGORIES[currentCase.category].badgeBg}`}>
                {CATEGORIES[currentCase.category].title}
              </span>
              <span className="text-xs text-slate-500">
                Кейс {safeIndex + 1} из {totalItems}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-bold">
                Уровень риска: {currentCase.incidentContext.riskLevel}
              </span>
            </div>
          </div>

          {/* Scenario Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">{currentCase.title}</h3>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm leading-relaxed">
              {currentCase.scenario}
            </div>

            {/* Context details tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
              {currentCase.incidentContext.cargoOrType && (
                <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200">
                  📦 Груз / Тип: <strong className="text-slate-800">{currentCase.incidentContext.cargoOrType}</strong>
                </span>
              )}
              {currentCase.incidentContext.routeOrPort && (
                <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200">
                  📍 Маршрут: <strong className="text-slate-800">{currentCase.incidentContext.routeOrPort}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Question Options */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Выберите действие сотрудника логистической компании:
            </p>

            <div className="space-y-3">
              {currentCase.options.map((option, idx) => {
                const isSelected = selectedScenarioOption === idx;
                const hasSelectedAny = selectedScenarioOption !== null;

                let borderStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';
                if (hasSelectedAny) {
                  if (option.status === 'safe') {
                    borderStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium';
                  } else if (isSelected && option.status === 'danger') {
                    borderStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-medium';
                  } else if (isSelected && option.status === 'warning') {
                    borderStyle = 'border-amber-500 bg-amber-50 text-amber-950 font-medium';
                  } else {
                    borderStyle = 'border-slate-200 opacity-50 bg-slate-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasSelectedAny}
                    onClick={() => handleSelectScenarioOption(idx, option)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all text-sm flex items-start gap-3.5 ${borderStyle} ${
                      !hasSelectedAny ? 'cursor-pointer hover:bg-slate-50 active:scale-[0.99]' : 'cursor-default'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5 ${
                        isSelected
                          ? option.status === 'safe'
                            ? 'bg-emerald-600 text-white'
                            : option.status === 'danger'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Section */}
          {selectedScenarioOption !== null && (
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                currentCase.options[selectedScenarioOption].status === 'safe'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : currentCase.options[selectedScenarioOption].status === 'danger'
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2">
                {currentCase.options[selectedScenarioOption].status === 'safe' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {currentCase.options[selectedScenarioOption].status === 'danger' && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                {currentCase.options[selectedScenarioOption].status === 'warning' && (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <h4 className="font-extrabold text-sm">
                  {currentCase.options[selectedScenarioOption].title}
                </h4>
              </div>

              <div className="text-xs space-y-2 leading-relaxed text-slate-700">
                <p>
                  <strong>Разбор ситуации:</strong> {currentCase.options[selectedScenarioOption].feedback}
                </p>
                <p className="text-slate-600">
                  <strong>Статья регламента:</strong>{' '}
                  <span className="font-semibold text-slate-900">
                    {currentCase.options[selectedScenarioOption].regulationReference}
                  </span>
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800">
                  <strong className="text-emerald-700 block mb-1">💡 Как сделать по правилам:</strong>
                  {currentCase.options[selectedScenarioOption].correctActionRecommendation}
                </div>
              </div>
            </div>
          )}

          {/* Navigation between cases */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={safeIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Предыдущий кейс
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Сбросить ответ
            </button>

            <button
              onClick={handleNext}
              disabled={safeIndex >= totalItems - 1}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white shadow-xs transition-all"
            >
              Следующий кейс
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PRACTICE CARD: EXAM QUESTIONS (INSTANT TRAINING MODE) */}
      {practiceType === 'examQuestions' && currentExamQ && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${CATEGORIES[currentExamQ.category].badgeBg}`}>
                {CATEGORIES[currentExamQ.category].title}
              </span>
              <span className="text-xs text-slate-500">
                Вопрос {safeIndex + 1} из {totalItems}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">ID: #{currentExamQ.id}</span>
          </div>

          <p className="text-base font-bold text-slate-900 leading-relaxed">
            {currentExamQ.q}
          </p>

          <div className="space-y-3 pt-1">
            {currentExamQ.options.map((opt, idx) => {
              const hasSelected = selectedExamOption !== null;
              const isChosen = selectedExamOption === idx;
              const isCorrect = idx === currentExamQ.correct;

              let style = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';
              if (hasSelected) {
                if (isCorrect) {
                  style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium';
                } else if (isChosen && !isCorrect) {
                  style = 'border-rose-500 bg-rose-50 text-rose-950 font-medium';
                } else {
                  style = 'border-slate-200 opacity-50 bg-slate-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasSelected}
                  onClick={() => handleSelectExamOption(idx, currentExamQ.correct)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-sm flex items-start gap-3 ${style} ${
                    !hasSelected ? 'cursor-pointer hover:bg-slate-50 active:scale-[0.99]' : 'cursor-default'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5 ${
                      hasSelected
                        ? isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isChosen
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {selectedExamOption !== null && (
            <div
              className={`p-5 rounded-2xl border space-y-2 ${
                selectedExamOption === currentExamQ.correct
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {selectedExamOption === currentExamQ.correct ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Верно! Ответ соответствует регламенту</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Ошибка! Это нарушает регламент безопасности</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                <strong>Методический комментарий:</strong> {currentExamQ.expl}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={safeIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Предыдущий вопрос
            </button>

            <button
              onClick={handleNext}
              disabled={safeIndex >= totalItems - 1}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white shadow-xs transition-all"
            >
              Следующий вопрос
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
