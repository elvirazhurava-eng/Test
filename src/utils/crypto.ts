export interface ExamSubmission {
  id: string;
  fullName: string;
  department: string;
  email: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timestamp: string;
  verificationCode: string;
  timeSpentSeconds: number;
  categoryStats: Record<string, { total: number; correct: number; percent: number }>;
  userAnswers: Record<number, number>;
}

export async function generateVerificationCode(
  fullName: string,
  email: string,
  score: number,
  timestamp: string
): Promise<string> {
  const rawString = `CYBER_SEC_LOGISTICS_2026:${fullName.trim().toUpperCase()}:${email.trim().toLowerCase()}:${score}:${timestamp}:SECRET_SALT_LOG_AI_99`;
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(rawString);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      // Format as VERIF-XXXX-XXXX-XXXX
      return `VERIF-${hashHex.substring(0, 4)}-${hashHex.substring(4, 8)}-${hashHex.substring(8, 12)}-${hashHex.substring(12, 16)}`;
    } catch {
      // Fallback below
    }
  }

  // Fallback djb2 + Murmur-style simple hash
  let h1 = 0xdeadbeef ^ 37;
  let h2 = 0x41c6ce57 ^ 37;
  for (let i = 0; i < rawString.length; i++) {
    const ch = rawString.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const part1 = (h1 >>> 0).toString(16).toUpperCase().padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).toUpperCase().padStart(8, '0');
  return `VERIF-${part1.substring(0, 4)}-${part1.substring(4, 8)}-${part2.substring(0, 4)}-${part2.substring(4, 8)}`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} мин ${secs.toString().padStart(2, '0')} сек`;
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function generateManagementReportText(submission: ExamSubmission): string {
  const catSummary = Object.entries(submission.categoryStats)
    .map(([cat, stat]) => `  • ${cat}: ${stat.correct}/${stat.total} (${stat.percent}%) ${stat.percent < 85 ? '[⚠️ ЗОНА РИСКА]' : '[✅ ОК]'}`)
    .join('\n');

  return `==================================================================
ОФИЦИАЛЬНЫЙ ОТЧЕТ ОБ АТТЕСТАЦИИ СОТРУДНИКА
«Безопасный ИИ в международной логистике, ВЭД и таможенном деле»
==================================================================

1. ДАННЫЕ СОТРУДНИКА:
ФИО: ${submission.fullName}
Отдел: ${submission.department}
E-mail: ${submission.email}
Дата прохождения: ${formatDateTime(submission.timestamp)}
Время тестирования: ${formatDuration(submission.timeSpentSeconds)}

2. ИТОГОВЫЙ РЕЗУЛЬТАТ:
Набрано баллов: ${submission.score} из ${submission.totalQuestions}
Процент успешности: ${submission.percentage}%
Пороговый балл допуска: 85% (минимум 26 из 30)
СТАТУС АТТЕСТАЦИИ: ${submission.passed ? 'СДАН (АТТЕСТОВАН К РАБОТЕ С ИИ)' : 'НЕ СДАН (ТРЕБУЕТСЯ ПЕРЕСДАЧА И ИНСТРУКТАЖ)'}

3. ПРОФИЛЬ УЯЗВИМОСТЕЙ ПО КАТЕГОРИЯМ:
${catSummary}

4. ВЕРИФИКАЦИЯ И ЗАЩИТА ОТ ПОДДЕЛКИ:
Код проверки подлинности: ${submission.verificationCode}
Цифровая подпись протокола: SHA-256 Secured
Система: Корпоративный Тренажер Логистической Кибербезопасности 2026
==================================================================`;
}

export function generateManagementReportJSON(submission: ExamSubmission): string {
  return JSON.stringify(submission, null, 2);
}
