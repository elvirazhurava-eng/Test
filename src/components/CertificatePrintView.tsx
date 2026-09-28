import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { ExamSubmission, formatDateTime, formatDuration } from '../utils/crypto';
import { CATEGORIES } from '../data/examQuestions';

interface Props {
  submission: ExamSubmission;
}

export const CertificatePrintView: React.FC<Props> = ({ submission }) => {
  return (
    <div className="print-only hidden font-serif text-slate-900 bg-white p-8 max-w-4xl mx-auto border-8 border-double border-slate-800 rounded-sm">
      {/* Outer Certificate Frame */}
      <div className="border-2 border-slate-700 p-8 relative flex flex-col justify-between min-h-[900px]">
        {/* Top Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-300">
          <div className="flex items-center justify-center gap-3 text-slate-800">
            <ShieldCheck className="w-10 h-10 text-blue-800" />
            <span className="text-sm font-sans font-bold tracking-widest uppercase">
              International Logistics Security & Compliance Council
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-wider font-sans">
            СЕРТИФИКАТ АТТЕСТАЦИИ
          </h1>
          <p className="text-xs font-sans text-slate-600 tracking-wide uppercase">
            Официальный протокол квалификационной проверки по стандарту:
            <br />
            «Безопасное применение ИИ в международной логистике, ВЭД и таможенном деле»
          </p>
        </div>

        {/* Certificate Body */}
        <div className="my-8 text-center space-y-4">
          <p className="text-sm font-sans text-slate-600 uppercase tracking-widest">
            Настоящий документ подтверждает, что сотрудник
          </p>

          <div className="text-3xl font-bold font-sans text-blue-900 underline decoration-slate-400 decoration-1 underline-offset-8">
            {submission.fullName}
          </div>

          <div className="text-sm font-sans text-slate-700">
            Подразделение: <strong className="font-semibold">{submission.department}</strong> | E-mail: <strong>{submission.email}</strong>
          </div>

          <div className="py-4">
            <p className="text-sm font-sans text-slate-700 max-w-xl mx-auto leading-relaxed">
              успешно прошел(ла) официальное тестирование регламента информационной безопасности
              и санкционного комплаенса, подтвердив необходимые компетенции для работы с генеративными моделями ИИ.
            </p>
          </div>

          {/* Results Box */}
          <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-300 rounded-lg font-sans">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-xs text-slate-500 uppercase block">Итоговый балл</span>
                <span className="text-2xl font-bold text-slate-900">
                  {submission.score} / {submission.totalQuestions}
                </span>
                <span className="text-xs text-emerald-700 block font-semibold">({submission.percentage}%)</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase block">Статус допуска</span>
                <span className={`text-lg font-bold block mt-1 ${submission.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {submission.passed ? '✓ АТТЕСТОВАН' : '✗ НЕ ДОПУЩЕН'}
                </span>
                <span className="text-[10px] text-slate-500">Порог: 85% (26 из 30)</span>
              </div>
            </div>
          </div>

          {/* Categories breakdown table */}
          <div className="max-w-lg mx-auto mt-6 font-sans text-left">
            <div className="text-xs font-bold text-slate-700 uppercase mb-2 text-center">
              Результаты по профильным блокам:
            </div>
            <div className="grid grid-cols-1 gap-1 text-xs border border-slate-200 rounded p-2 bg-slate-50/50">
              {Object.entries(submission.categoryStats).map(([key, stat]) => {
                const catMeta = CATEGORIES[key as keyof typeof CATEGORIES];
                return (
                  <div key={key} className="flex justify-between items-center py-0.5 border-b border-slate-100 last:border-none">
                    <span className="text-slate-700">{catMeta ? catMeta.title : key}:</span>
                    <span className={`font-mono font-semibold ${stat.percent >= 85 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {stat.correct}/{stat.total} ({stat.percent}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Verification and Signatures Footer */}
        <div className="pt-6 border-t-2 border-slate-300 font-sans">
          <div className="grid grid-cols-3 gap-4 text-xs text-slate-600 items-end">
            <div>
              <div className="font-semibold text-slate-800">Дата тестирования:</div>
              <div>{formatDateTime(submission.timestamp)}</div>
              <div className="text-[11px] text-slate-500">Затрачено: {formatDuration(submission.timeSpentSeconds)}</div>
            </div>

            <div className="text-center">
              <div className="inline-block p-2 border border-slate-400 rounded bg-white shadow-sm">
                <div className="font-mono text-[10px] text-slate-500">Код проверки:</div>
                <div className="font-mono text-xs font-bold text-slate-900 tracking-wider">
                  {submission.verificationCode}
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5">SHA-256 Validated</div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="font-semibold text-slate-800">Департамент безопасности:</div>
              <div className="font-serif italic text-sm text-slate-700">Audit Compliance Seal</div>
              <div className="text-[10px] text-slate-500">Электронная подпись подтверждена</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
