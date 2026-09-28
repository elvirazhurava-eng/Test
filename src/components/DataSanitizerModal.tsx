import React, { useState } from 'react';
import { X, ShieldCheck, Copy, Check, Sparkles, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_TEXT = `Уважаемый агент Maersk Line в порту Ningbo!
Компания ООО «ТрансВостокЛогистик» (ИНН 7701234567, контакт: Иванов Иван Иванович, +7 (916) 123-45-67, ivanov@transvostok.ru) просит предоставить специальную ставку на перевозку 5 контейнеров 40HC (номера: MSCU9876543, CMAU1234567) по маршруту Ningbo - St. Petersburg. Наша целевая ставка: 2 450 USD за контейнер. Водитель Сидоров Петр (паспорт 4510 №123456) прибудет на погрузку 15.10.2026.`;

export const DataSanitizerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [inputText, setInputText] = useState(SAMPLE_TEXT);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Sanitization logic
  const sanitizeText = (raw: string): { clean: string; detectedCount: number } => {
    let text = raw;
    let count = 0;

    // Emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = text.match(emailRegex);
    if (emails) {
      count += emails.length;
      text = text.replace(emailRegex, '[EMAIL_ЗАСЕКРЕЧЕН]');
    }

    // Phone numbers
    const phoneRegex = /(\+?[78][- \s]?\(?\d{3}\)?[- \s]?\d{3}[- \s]?\d{2}[- \s]?\d{2})/g;
    const phones = text.match(phoneRegex);
    if (phones) {
      count += phones.length;
      text = text.replace(phoneRegex, '[ТЕЛЕФОН]');
    }

    // Passport format: 4 numbers + 6 numbers
    const passportRegex = /(паспорт\s*)?(\d{4}\s*[№N]?\s*\d{6})/gi;
    const passports = text.match(passportRegex);
    if (passports) {
      count += passports.length;
      text = text.replace(passportRegex, '[ПАСПОРТ_СЕРИЯ_НОМЕР]');
    }

    // Container numbers: 4 letters + 7 digits
    const containerRegex = /\b[A-Z]{4}\d{7}\b/g;
    const containers = text.match(containerRegex);
    if (containers) {
      count += containers.length;
      text = text.replace(containerRegex, '[КОНТЕЙНЕР_XXXU0000000]');
    }

    // INN (10 or 12 digits)
    const innRegex = /\bИНН\s*\d{10,12}\b/gi;
    const inns = text.match(innRegex);
    if (inns) {
      count += inns.length;
      text = text.replace(innRegex, '[ИНН_КОМПАНИИ]');
    }

    // Specific monetary rates e.g. 2 450 USD, 300$, 50000 руб
    const moneyRegex = /(\d[\d\s]*\d|\d+)\s*(USD|EUR|RUB|руб|долл|\$|€)/gi;
    const moneys = text.match(moneyRegex);
    if (moneys) {
      count += moneys.length;
      text = text.replace(moneyRegex, '[ТАРИФ_XXX]');
    }

    // Specific carrier / company names
    const companyRegex = /(ООО|ЗАО|ПАО|LLC|Inc\.)\s*[«"'][^»"']+[\»"']/gi;
    const companies = text.match(companyRegex);
    if (companies) {
      count += companies.length;
      text = text.replace(companyRegex, '[КОМПАНИЯ_ЗАКАЗЧИК]');
    }

    return { clean: text, detectedCount: count };
  };

  const { clean, detectedCount } = sanitizeText(inputText);

  const handleCopy = () => {
    navigator.clipboard.writeText(clean);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 my-6 text-slate-800 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Инструмент обезличивания данных (Data Sanitizer)</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Автоматическое удаление ПДН, номеров контейнеров, ставок и реквизитов перед отправкой в ИИ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info banner */}
        <div className="my-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Регламент компании:</strong> Любой текст коносаментов, переписки, инвойсов и упаковочных листов перед отправкой в публичные нейросети обязан пройти псевдонимизацию (Желтая зона регламента).
          </div>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
          {/* Input text */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Исходный текст логистического документа
              </label>
              <button
                onClick={() => setInputText(SAMPLE_TEXT)}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Вставить демо-пример
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Вставьте сюда черновик письма, строку из коносамента или заявки..."
              className="w-full flex-1 min-h-[220px] p-3.5 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
            />
          </div>

          {/* Cleaned text */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Обезличенный безопасный промт
              </label>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                Защищено: {detectedCount}
              </span>
            </div>
            <textarea
              readOnly
              value={clean}
              className="w-full flex-1 min-h-[220px] p-3.5 text-xs sm:text-sm font-mono bg-emerald-50/50 border border-emerald-300 rounded-2xl text-emerald-950 focus:outline-none resize-none font-medium"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 mt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
            <span>Заменяются:</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">MSCU1234567 → [КОНТЕЙНЕР]</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">2 450$ → [ТАРИФ]</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">Паспорта / ФИО</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Закрыть
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Скопировано в буфер!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Скопировать безопасный текст
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
