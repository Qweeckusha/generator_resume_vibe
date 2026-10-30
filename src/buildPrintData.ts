/**
 * buildPrintData.ts — собирает данные печатного документа из состояния сайта.
 *
 * Здесь — в одном месте — описано, КАКИЕ именно данные попадают в PDF:
 * ФИО/контакты, опыт, образование, навыки, кнопки-ссылки (GitHub / Telegram /
 * сайт), языки, сопроводительное письмо и вотермарка. Акцентный цвет берётся
 * из той же функции, что использует предпросмотр, поэтому цвета не расходятся.
 */
import type { SurveyData } from './App';
import type { PrintData } from './pdfDocument';
import { accentForTemplate } from './ResumeDocument';

/** Нормализация username: убирает @, протокол и хвостовой слэш (как в Preview). */
export function normalizeUsername(value: string): string {
  if (!value) return '';
  return (
    value
      .replace(/^https?:\/\//, '')
      .replace(/^@/, '')
      .replace(/\/$/, '')
      .split('/')
      .pop() || ''
  );
}

export function buildPrintData(resumeData: any, surveyData: SurveyData | null): PrintData {
  const personal = resumeData?.personal ?? {};
  const plan = surveyData?.plan ?? 'pro';

  // Ссылки формируем так же, как в предпросмотре: сначала из данных резюме
  // (если бэкенд их вернул), затем из анкеты.
  const github = surveyData?.github || personal.github || '';
  const telegram = surveyData?.telegram || personal.telegram || '';
  const website = surveyData?.website || personal.website || '';

  const githubUrl = github ? `https://github.com/${normalizeUsername(github)}` : '';
  const telegramUrl = telegram ? `https://t.me/${normalizeUsername(telegram)}` : '';
  const websiteUrl = website
    ? /^https?:\/\//i.test(website)
      ? website
      : `https://${website}`
    : '';

  const links: PrintData['links'] = [];
  if (githubUrl) links.push({ label: 'GitHub', url: githubUrl, icon: 'github' });
  if (telegramUrl) links.push({ label: 'Telegram', url: telegramUrl, icon: 'telegram' });
  if (websiteUrl) links.push({ label: normalizeUsername(websiteUrl), url: websiteUrl, icon: 'globe' });

  return {
    personal: {
      fullName: personal.fullName ?? '',
      email: personal.email ?? '',
      phone: personal.phone ?? '',
      city: personal.city ?? '',
      position: personal.position ?? '',
    },
    summary: resumeData?.summary ?? '',
    experience: resumeData?.experience ?? [],
    education: resumeData?.education ?? [],
    skills: resumeData?.skills ?? [],
    template: resumeData?.template ?? surveyData?.template ?? 'modern',
    accent: accentForTemplate(resumeData?.template ?? surveyData?.template ?? 'modern'),
    links,
    languages: surveyData?.languages || personal.languages || '',
    coverLetter: plan === 'pro_plus' || plan === 'premium',
    watermark: plan === 'free',
  };
}
