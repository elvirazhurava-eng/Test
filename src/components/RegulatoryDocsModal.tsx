import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Search,
  ExternalLink,
  Scale,
  ShieldAlert,
  FileText,
  AlertTriangle,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { REGULATORY_DOCS, RegulatoryDoc } from '../data/regulatoryDocs';
import { CATEGORIES } from '../data/examQuestions';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RegulatoryDocsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filteredDocs = REGULATORY_DOCS.filter((doc) => {
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesText =
      doc.title.toLowerCase().includes(q) ||
      doc.shortName.toLowerCase().includes(q) ||
      doc.scope.toLowerCase().includes(q) ||
      doc.relevanceToAI.toLowerCase().includes(q) ||
      doc.keyArticles.some((a) => a.toLowerCase().includes(q));
    return matchesCat && matchesText;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 my-6 text-slate-800 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  Нормативно-правовая база и регламенты
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Юридический комплаенс
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Официальные нормативные правовые акты, регулирующие ответственность при использовании ИИ в ВЭД
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

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 my-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-2xl overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Все акты ({REGULATORY_DOCS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('customs')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedCategory === 'customs'
                  ? 'bg-amber-100 text-amber-900 shadow-sm'
                  : 'text-slate-600 hover:text-amber-800'
              }`}
            >
              Таможня и ТН ВЭД
            </button>
            <button
              onClick={() => setSelectedCategory('pii')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedCategory === 'pii'
                  ? 'bg-purple-100 text-purple-900 shadow-sm'
                  : 'text-slate-600 hover:text-purple-800'
              }`}
            >
              ПДН (152-ФЗ / GDPR)
            </button>
            <button
              onClick={() => setSelectedCategory('commercial')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedCategory === 'commercial'
                  ? 'bg-emerald-100 text-emerald-900 shadow-sm'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              Коммерческая тайна
            </button>
            <button
              onClick={() => setSelectedCategory('compliance')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedCategory === 'compliance'
                  ? 'bg-rose-100 text-rose-900 shadow-sm'
                  : 'text-slate-600 hover:text-rose-800'
              }`}
            >
              Санкции (OFAC / EU)
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по законам, статьям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Documents Cards List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-sm transition-all space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                      {doc.shortName}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" />
                      {doc.authority}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{doc.title}</h3>
                </div>

                <a
                  href={doc.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
                >
                  <span>{doc.externalLinkText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed">
                <strong>Предмет регулирования:</strong> {doc.scope}
              </div>

              {/* Relevance to AI box */}
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-950 space-y-1">
                <strong className="font-bold flex items-center gap-1.5 text-blue-800">
                  <FileText className="w-3.5 h-3.5" />
                  Применение к искусственному интеллекту:
                </strong>
                <p className="leading-relaxed">{doc.relevanceToAI}</p>
              </div>

              {/* Key Articles */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-700 block">Ключевые статьи регламента:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {doc.keyArticles.map((art, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-slate-50 rounded-lg border border-slate-200/80 text-slate-700 text-[11px]"
                    >
                      • {art}
                    </div>
                  ))}
                </div>
              </div>

              {/* Consequences */}
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Юридическая ответственность:</strong> {doc.consequences}
                </div>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              По запросу «{searchQuery}» нормативных актов не найдено.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Служба комплаенса и правового обеспечения ВЭД © 2026</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
          >
            Закрыть справочник
          </button>
        </div>
      </div>
    </div>
  );
};
