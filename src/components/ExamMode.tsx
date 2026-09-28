import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Copy,
  Printer,
  Send,
  RotateCcw,
  ShieldCheck,
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  Building2,
  Mail,
  User,
  ExternalLink,
  HelpCircle,
  ShieldAlert,
  Scale,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  interactiveExamQuestions,
  examQuestions,
  CATEGORIES,
  ExamQuestion,
} from '../data/examQuestions';
import {
  ExamSubmission,
  generateVerificationCode,
  formatDuration,
  formatDateTime,
  generateManagementReportText,
  generateManagementReportJSON,
} from '../utils/crypto';
import { CertificatePrintView } from './CertificatePrintView';

interface Props {
  onBackToDashboard: () => void;
  onOpenRegulations: () => void;
  onOpenRegulatoryDocs: () => void;
}

export const ExamMode: React.FC<Props> = ({
  onBackToDashboard,
  onOpenRegulations,
  onOpenRegulatoryDocs,
}) => {
  // Step: 'register' | 'test' | 'results'
  const [step, setStep] = useState<'register' | 'test' | 'results'>('register');

  // Exam format: 'interactive10' (default) or 'full30'
  const [examFormat, setExamFormat] = useState<'interactive10' | 'full30'>('interactive10');

  // Active question pool based on format
  const activeQuestions: ExamQuestion[] =
    examFormat === 'interactive10' ? interactiveExamQuestions : examQuestions;

  // Registration Form
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Логистика');
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formError, setFormError] = useState('');

  // Test State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showUnansweredConfirm, setShowUnansweredConfirm] = useState(false);
  const [showInteractiveHint, setShowInteractiveHint] = useState(false);

  // Result state
  const [submission, setSubmission] = useState<ExamSubmission | null>(null);
  const [copiedType, setCopiedType] = useState<'text' | 'json' | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [webhookMessage, setWebhookMessage] = useState('');
  const [showFullReview, setShowFullReview] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (step === 'test' && startTime > 0) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, startTime]);

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFormError('Пожалуйста, укажите имя и фамилию сотрудника');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Укажите корректный корпоративный e-mail');
      return;
    }
    if (!agreedToTerms) {
      setFormError('Необходимо подтвердить ознакомление с регламентом безопасности');
      return;
    }

    setFormError('');
    setUserAnswers({});
    setCurrentQuestionIdx(0);
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setShowInteractiveHint(false);
    setStep('test');
  };

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const totalQuestions = activeQuestions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const currentQ = activeQuestions[currentQuestionIdx];

  const handleFinishExam = async () => {
    if (answeredCount < totalQuestions && !showUnansweredConfirm) {
      setShowUnansweredConfirm(true);
      return;
    }

    setShowUnansweredConfirm(false);
    const finalSeconds = elapsedSeconds;

    // Calculate score
    let score = 0;
    const catStats: Record<string, { total: number; correct: number; percent: number }> = {
      customs: { total: 0, correct: 0, percent: 0 },
      commercial: { total: 0, correct: 0, percent: 0 },
      pii: { total: 0, correct: 0, percent: 0 },
      compliance: { total: 0, correct: 0, percent: 0 },
      security: { total: 0, correct: 0, percent: 0 },
    };

    activeQuestions.forEach((q) => {
      const cat = q.category;
      if (catStats[cat]) {
        catStats[cat].total += 1;
        if (userAnswers[q.id] === q.correct) {
          score += 1;
          catStats[cat].correct += 1;
        }
      }
    });

    Object.keys(catStats).forEach((cat) => {
      const c = catStats[cat];
      c.percent = c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0;
    });

    const percentage = Math.round((score / totalQuestions) * 100);
    // Passing threshold: 85% (at least 9 out of 10, or 26 out of 30)
    const passThreshold = examFormat === 'interactive10' ? 9 : 26;
    const passed = score >= passThreshold;

    const timestamp = new Date().toISOString();
    const verifCode = await generateVerificationCode(fullName, email, score, timestamp);

    const newSubmission: ExamSubmission = {
      id: `EXAM-${Date.now()}`,
      fullName,
      department,
      email,
      score,
      totalQuestions,
      percentage,
      passed,
      timestamp,
      verificationCode: verifCode,
      timeSpentSeconds: finalSeconds,
      categoryStats: catStats,
      userAnswers,
    };

    setSubmission(newSubmission);
    setStep('results');

    try {
      const history = JSON.parse(localStorage.getItem('ai_logistics_exam_history') || '[]');
      history.unshift(newSubmission);
      localStorage.setItem('ai_logistics_exam_history', JSON.stringify(history.slice(0, 10)));
    } catch {
      // ignore
    }
  };

  const handleCopyTextReport = () => {
    if (!submission) return;
    const text = generateManagementReportText(submission);
    navigator.clipboard.writeText(text);
    setCopiedType('text');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopyJSONReport = () => {
    if (!submission) return;
    const json = generateManagementReportJSON(submission);
    navigator.clipboard.writeText(json);
    setCopiedType('json');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendWebhook = async () => {
    if (!webhookUrl.trim() || !submission) return;
    setWebhookStatus('loading');
    setWebhookMessage('');

    try {
      const payload = {
        event: 'ai_security_exam_completed',
        submission,
        sentAt: new Date().toISOString(),
      };

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors',
      });

      if (res.ok) {
        setWebhookStatus('success');
        setWebhookMessage('Данные успешно переданы в систему компании!');
      } else {
        setWebhookStatus('error');
        setWebhookMessage(`Сервер вернул статус ${res.status}. Проверьте URL.`);
      }
    } catch {
      setWebhookStatus('error');
      setWebhookMessage('Ошибка сети или CORS. Для Google Sheets используйте Google Apps Script Webhook.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Print View for certificate when user clicks print */}
      {submission && <CertificatePrintView submission={submission} />}

      {/* STEP 1: REGISTRATION & FORMAT SELECTOR */}
      {step === 'register' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Аттестационный экзамен по безопасности ИИ
                </h2>
                <p className="text-sm text-slate-500">
                  Квалификационная проверка допуска к работе с генеративным ИИ в международной логистике
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenRegulatoryDocs}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
              >
                Нормативные акты
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={onOpenRegulations}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Светофор безопасности
              </button>
            </div>
          </div>

          {/* Format Toggle: 10 Interactive Questions vs 30 Academic Questions */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Выберите формат аттестации:
              </span>
              <span className="text-xs text-blue-600 font-semibold">
                Рекомендован: Интерактивный (10 вопросов)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExamFormat('interactive10')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  examFormat === 'interactive10'
                    ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white/60 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Интерактивный экзамен (10 вопросов)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                    Экспресс
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  По 2 интерактивных кейса из всех 5 ключевых направлений. Интерактивные подсказки, карточки документов и быстрый сертификат.
                </p>
                <div className="mt-2 text-[11px] font-semibold text-emerald-700">
                  Порог сдачи: 9 из 10 (85%)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExamFormat('full30')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  examFormat === 'full30'
                    ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white/60 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-600" />
                    Полный аудит (30 вопросов)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">
                    Академический
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Полная база из всех 30 вопросов регламента. Исчерпывающее тестирование для старших декларантов и риск-офицеров.
                </p>
                <div className="mt-2 text-[11px] font-semibold text-slate-600">
                  Порог сдачи: 26 из 30 (85%)
                </div>
              </button>
            </div>
          </div>

          {/* Exam Rules & Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                Объем заданий
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                {examFormat === 'interactive10' ? '10 вопросов' : '30 вопросов'}
              </p>
              <p className="text-xs text-slate-500">
                Интерактивные сценарии по всем 5 направлениям регламента
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                Проходной балл
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                {examFormat === 'interactive10' ? '9 из 10 (85%)' : '26 из 30 (85%)'}
              </p>
              <p className="text-xs text-slate-500">
                Минимум 85% правильных ответов для допуска к работе с ИИ
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                Защита результата
              </div>
              <p className="text-2xl font-extrabold text-slate-900">SHA-256 Код</p>
              <p className="text-xs text-slate-500">
                Криптографическая подпись отчета руководству и сертификата
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleStartExam} className="space-y-5 pt-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Данные сотрудника для внесения в официальный протокол:
            </h3>

            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Фамилия и Имя сотрудника <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Иванов Алексей"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Подразделение / Отдел <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  >
                    <option value="Логистика">Отдел Логистики (Фрахт / Мультимодал)</option>
                    <option value="Таможня">Отдел Таможенного оформления (ДТ/ТН ВЭД)</option>
                    <option value="Продажи">Департамент Продаж и Тендеров</option>
                    <option value="Бухгалтерия">Финансовый отдел и Бухгалтерия</option>
                    <option value="Клиентский сервис">Клиентский сервис и Рекламации</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Корпоративный E-mail <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="a.ivanov@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  Я подтверждаю, что изучил корпоративный регламент безопасности ИИ (Красная, Желтая и Зеленая зоны),
                  требования ТК ЕАЭС, 152-ФЗ, 98-ФЗ и несу персональную ответственность за соблюдение информационной безопасности.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onBackToDashboard}
                className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Вернуться на Главную
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
              >
                Начать экзамен ({examFormat === 'interactive10' ? '10 вопросов' : '30 вопросов'})
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: TEST RUNNER (LIGHT THEME + INTERACTIVE ELEMENTS) */}
      {step === 'test' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-slate-800">
          {/* Header Bar with Progress and Timer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                  Вопрос {currentQuestionIdx + 1} из {totalQuestions}
                </span>
                <span className="text-xs text-slate-500">
                  {fullName} ({department})
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                {CATEGORIES[currentQ.category].title}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-xs font-mono font-bold">
                <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
                <span>Время: {formatDuration(elapsedSeconds)}</span>
              </div>
              <button
                onClick={handleFinishExam}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors"
              >
                Завершить экзамен
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Отвечено: {answeredCount} из {totalQuestions} вопросов</span>
              <span className="font-bold text-slate-700">
                {Math.round((answeredCount / totalQuestions) * 100)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Quick Matrix Selector */}
          <div
            className={`grid gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl ${
              totalQuestions <= 10 ? 'grid-cols-10' : 'grid-cols-10 sm:grid-cols-15'
            }`}
          >
            {activeQuestions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCurrent = idx === currentQuestionIdx;

              let style = 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100';
              if (isCurrent) {
                style = 'bg-blue-600 text-white font-bold ring-2 ring-blue-400 border-blue-600';
              } else if (isAnswered) {
                style = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionIdx(idx);
                    setShowInteractiveHint(false);
                  }}
                  className={`h-8 rounded-lg text-xs font-mono border transition-all ${style}`}
                  title={`Вопрос ${idx + 1}: ${isAnswered ? 'Отвечен' : 'Не отвечен'}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* INTERACTIVE DOCUMENT BADGE & CONTEXT */}
          {currentQ.interactive && (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-blue-900 block">
                    Документ кейса: {currentQ.interactive.documentType}
                  </span>
                  <span className="text-[11px] font-mono text-blue-700">
                    Номер дела: {currentQ.interactive.documentRef}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    currentQ.interactive.riskZone === 'red'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : currentQ.interactive.riskZone === 'yellow'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  Зона риска: {currentQ.interactive.riskZone.toUpperCase()}
                </span>

                <button
                  onClick={() => setShowInteractiveHint(!showInteractiveHint)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition-colors font-semibold flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{showInteractiveHint ? 'Скрыть подсказку' : 'Подсказка регламента'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Hint drawer */}
          {showInteractiveHint && currentQ.interactive && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Методическая подсказка:</strong> {currentQ.interactive.interactiveHint}
              </div>
            </div>
          )}

          {/* Question Text */}
          <div className="space-y-4 pt-1">
            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Кейс #{currentQuestionIdx + 1}:
              </span>
              <p className="text-base text-slate-900 font-semibold leading-relaxed">
                {currentQ.q}
              </p>
            </div>

            {/* Interactive Options list */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(currentQ.id, idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all text-sm flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-slate-900 shadow-sm ring-2 ring-blue-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed font-medium">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unanswered confirmation warning modal */}
          {showUnansweredConfirm && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-sm space-y-3">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Внимание: вы ответили на {answeredCount} из {totalQuestions} вопросов!
              </div>
              <p className="text-xs text-slate-600">
                Неотвеченные вопросы будут засчитаны как ошибки. Вы уверены, что хотите завершить экзамен сейчас?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowUnansweredConfirm(false)}
                  className="px-3 py-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  Вернуться к вопросам
                </button>
                <button
                  onClick={handleFinishExam}
                  className="px-4 py-1.5 text-xs font-bold bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Да, завершить досрочно
                </button>
              </div>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setCurrentQuestionIdx((p) => Math.max(0, p - 1));
                setShowInteractiveHint(false);
              }}
              disabled={currentQuestionIdx === 0}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Предыдущий
            </button>

            <span className="text-xs text-slate-400 hidden sm:inline">
              Строгий экзаменационный режим: фиксация ответов
            </span>

            {currentQuestionIdx < totalQuestions - 1 ? (
              <button
                onClick={() => {
                  setCurrentQuestionIdx((p) => Math.min(totalQuestions - 1, p + 1));
                  setShowInteractiveHint(false);
                }}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Следующий
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishExam}
                className="flex items-center gap-2 px-6 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all"
              >
                Завершить и получить сертификат
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: RESULTS & MANAGEMENT REPORT (LIGHT THEME) */}
      {step === 'results' && submission && (
        <div className="space-y-6">
          {/* Main Verdict Card */}
          <div
            className={`border rounded-3xl p-6 sm:p-8 shadow-sm ${
              submission.passed
                ? 'bg-white border-emerald-300 text-slate-900'
                : 'bg-white border-rose-300 text-slate-900'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div
                  className={`p-4 rounded-2xl ${
                    submission.passed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {submission.passed ? (
                    <Award className="w-10 h-10" />
                  ) : (
                    <ShieldAlert className="w-10 h-10" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                      {submission.passed ? 'ЭКЗАМЕН УСПЕШНО СДАН' : 'АТТЕСТАЦИЯ НЕ ПРОЙДЕНА'}
                    </h2>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                        submission.passed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {submission.passed ? 'ДОПУЩЕН К РАБОТЕ С ИИ' : 'ТРЕБУЕТСЯ ПЕРЕСДАЧА'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Сотрудник: <strong className="text-slate-800">{submission.fullName}</strong> | Отдел: {submission.department} | {submission.email}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-slate-900 font-mono">
                  {submission.score} / {submission.totalQuestions}
                </div>
                <div className="text-xs text-slate-500">
                  Успешность: <strong className={submission.passed ? 'text-emerald-700' : 'text-rose-700'}>{submission.percentage}%</strong> (Порог: 85%)
                </div>
              </div>
            </div>

            {/* Quick summary metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase block font-semibold">Время сдачи</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {formatDuration(submission.timeSpentSeconds)}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase block font-semibold">Дата и время</span>
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {formatDateTime(submission.timestamp)}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase block font-semibold">Код верификации</span>
                <span className="text-xs font-mono font-bold text-blue-700 block truncate">
                  {submission.verificationCode}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase block font-semibold">Подлинность</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SHA-256 Validated
                </span>
              </div>
            </div>

            {/* Category Vulnerabilities & Profile */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" />
                Профиль безопасности по 5 категориям:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(submission.categoryStats).map(([catKey, stat]) => {
                  const meta = CATEGORIES[catKey as keyof typeof CATEGORIES];
                  const isVulnerable = stat.percent < 85;

                  return (
                    <div
                      key={catKey}
                      className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
                        isVulnerable
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${isVulnerable ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                          <span className="text-xs font-bold text-slate-800">{meta.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isVulnerable && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
                              ⚠️ Уязвимость
                            </span>
                          )}
                          <span className="text-xs font-mono font-bold text-slate-800">
                            {stat.correct}/{stat.total} ({stat.percent}%)
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            isVulnerable ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${stat.percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 shadow-xs transition-colors"
                >
                  <Printer className="w-4 h-4 text-blue-600" />
                  Печать в PDF / Сертификат
                </button>

                <button
                  onClick={handleCopyTextReport}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 shadow-xs transition-colors"
                >
                  {copiedType === 'text' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      Отчет скопирован!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      Скопировать отчет (Текст)
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyJSONReport}
                  className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors"
                >
                  {copiedType === 'json' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      JSON скопирован
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      JSON для HR
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setStep('register');
                    setSubmission(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Пройти заново
                </button>
                <button
                  onClick={onBackToDashboard}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
                >
                  В главное меню
                </button>
              </div>
            </div>
          </div>

          {/* Webhook export module to Google Sheets / Company Database */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Интеграция с корпоративной таблицей (Google Sheets / Webhook)
              </h4>
            </div>
            <p className="text-xs text-slate-500">
              Отправьте результат аттестации сотрудника в таблицу службы информационной безопасности компании:
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec или корпоративный webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1 min-w-[280px] px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              <button
                onClick={handleSendWebhook}
                disabled={webhookStatus === 'loading' || !webhookUrl}
                className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-all shadow-xs"
              >
                {webhookStatus === 'loading' ? 'Отправка...' : 'Отправить в таблицу'}
              </button>
            </div>

            {webhookMessage && (
              <div
                className={`text-xs p-2.5 rounded-lg ${
                  webhookStatus === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {webhookMessage}
              </div>
            )}
          </div>

          {/* Detailed Question Review */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Детальный аудит ответов ({totalQuestions} вопросов)
                </h4>
                <p className="text-xs text-slate-500">
                  Проверьте, в каких ситуациях были допущены ошибки
                </p>
              </div>

              <button
                onClick={() => setShowFullReview(!showFullReview)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200"
              >
                {showFullReview ? 'Скрыть разбор' : `Показать все ${totalQuestions} вопросов`}
              </button>
            </div>

            {showFullReview && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                {activeQuestions.map((q, idx) => {
                  const userAnsIdx = submission.userAnswers[q.id];
                  const isCorrect = userAnsIdx === q.correct;
                  const isUnanswered = userAnsIdx === undefined;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border text-sm space-y-2 ${
                        isCorrect
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono text-white ${
                              isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-900">
                            {CATEGORIES[q.category].title}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {isCorrect ? '✓ Верно' : isUnanswered ? '✗ Не отвечен' : '✗ Ошибка'}
                        </span>
                      </div>

                      <p className="text-slate-800 font-semibold text-xs leading-relaxed">
                        {q.q}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                          <span className="text-slate-500 block mb-0.5">Выбранный ответ:</span>
                          <span className={isCorrect ? 'text-emerald-800 font-bold' : 'text-rose-800 font-bold'}>
                            {userAnsIdx !== undefined ? q.options[userAnsIdx] : '—'}
                          </span>
                        </div>

                        {!isCorrect && (
                          <div className="p-2.5 rounded-xl bg-white border border-emerald-300">
                            <span className="text-emerald-700 block mb-0.5 font-bold">
                              Правильный регламентный ответ:
                            </span>
                            <span className="text-emerald-800 font-medium">
                              {q.options[q.correct]}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-600 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <strong className="text-slate-800">Пояснение методиста:</strong> {q.expl}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
