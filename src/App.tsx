import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PracticeMode } from './components/PracticeMode';
import { ExamMode } from './components/ExamMode';
import { RegulationsModal } from './components/RegulationsModal';
import { DataSanitizerModal } from './components/DataSanitizerModal';
import { CartoonModal } from './components/CartoonModal';
import { RegulatoryDocsModal } from './components/RegulatoryDocsModal';
import { ShieldCheck, Scale, Tv } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'practice' | 'exam'>('dashboard');

  // Modals state: Cartoon is open by default as requested ("Сделай вначале мультик про ИИ безопасность")
  const [isCartoonOpen, setIsCartoonOpen] = useState(true);
  const [isRegulationsOpen, setIsRegulationsOpen] = useState(false);
  const [isSanitizerOpen, setIsSanitizerOpen] = useState(false);
  const [isRegulatoryDocsOpen, setIsRegulatoryDocsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header Navigation (Light Theme) */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenRegulations={() => setIsRegulationsOpen(true)}
        onOpenSanitizer={() => setIsSanitizerOpen(true)}
        onOpenCartoon={() => setIsCartoonOpen(true)}
        onOpenRegulatoryDocs={() => setIsRegulatoryDocsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <Dashboard
            onSelectTab={setCurrentTab}
            onOpenRegulations={() => setIsRegulationsOpen(true)}
            onOpenSanitizer={() => setIsSanitizerOpen(true)}
            onOpenCartoon={() => setIsCartoonOpen(true)}
            onOpenRegulatoryDocs={() => setIsRegulatoryDocsOpen(true)}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeMode
            onOpenRegulations={() => setIsRegulationsOpen(true)}
            onOpenSanitizer={() => setIsSanitizerOpen(true)}
            onSwitchToExam={() => setCurrentTab('exam')}
          />
        )}

        {currentTab === 'exam' && (
          <ExamMode
            onBackToDashboard={() => setCurrentTab('dashboard')}
            onOpenRegulations={() => setIsRegulationsOpen(true)}
            onOpenRegulatoryDocs={() => setIsRegulatoryDocsOpen(true)}
          />
        )}
      </main>

      {/* Footer (Light Theme) */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-slate-700">
              Корпоративный центр ИИ-безопасности международной логистики © 2026
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-slate-600">
            <button
              onClick={() => setIsCartoonOpen(true)}
              className="hover:text-blue-600 transition-colors flex items-center gap-1 font-semibold"
            >
              <Tv className="w-3.5 h-3.5 text-blue-600" />
              <span>Мультфильм</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsRegulatoryDocsOpen(true)}
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Законы и регламенты</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsRegulationsOpen(true)}
              className="hover:text-amber-700 transition-colors"
            >
              Светофор
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSanitizerOpen(true)}
              className="hover:text-emerald-700 transition-colors"
            >
              Обезличивание
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('exam')}
              className="hover:text-blue-700 font-bold transition-colors"
            >
              Сдать экзамен (10 вопр.)
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Cartoon Modal (plays at beginning or when clicked) */}
      <CartoonModal
        isOpen={isCartoonOpen}
        onClose={() => setIsCartoonOpen(false)}
        onStartExam={() => {
          setIsCartoonOpen(false);
          setCurrentTab('exam');
        }}
      />

      {/* Regulatory Documents Modal */}
      <RegulatoryDocsModal
        isOpen={isRegulatoryDocsOpen}
        onClose={() => setIsRegulatoryDocsOpen(false)}
      />

      {/* Traffic Light Security Regulations Modal */}
      <RegulationsModal
        isOpen={isRegulationsOpen}
        onClose={() => setIsRegulationsOpen(false)}
      />

      {/* Data Sanitizer Tool Modal */}
      <DataSanitizerModal
        isOpen={isSanitizerOpen}
        onClose={() => setIsSanitizerOpen(false)}
      />
    </div>
  );
}
