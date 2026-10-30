/**
 * pdfDocument.ts — единый источник данных печатного документа.
 *
 * Ключевая идея: вёрстка резюме описана ОДИН РАЗ (ResumeContent.tsx) и
 * используется и предпросмотром, и печатью. Раньше PDF собирался отдельным
 * движком (reportlab / html2canvas), которые не понимают flexbox и метрики
 * шрифтов браузера — из-за этого текст в плавках навыков и кнопках-ссылках
 * «съезжал». Теперь документ печатает сам Chromium (вариант A).
 */

export interface PrintData {
  personal: {
    fullName?: string;
    email?: string;
    phone?: string;
    city?: string;
    position?: string;
  };
  summary?: string;
  experience?: Array<{
    company?: string;
    position?: string;
    period?: string;
    achievements?: string[];
  }>;
  education?: Array<{ institution?: string; degree?: string; period?: string }>;
  skills?: string[];
  template?: string;
  /** Акцентный цвет, ТОЧНО как в предпросмотре (Preview.getAccentColor). */
  accent?: string;
  links?: Array<{ label: string; url: string; icon: 'github' | 'telegram' | 'globe' }>;
  languages?: string;
  coverLetter?: boolean;
  watermark?: boolean;
}

/** sessionStorage — данные видны только этой вкладке и живут до её закрытия. */
export const PRINT_DATA_KEY = 'pulum-print-data';

export function writePrintData(data: PrintData): void {
  try {
    sessionStorage.setItem(PRINT_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Не удалось сохранить данные для печати:', e);
  }
}

export function readPrintData(): PrintData | null {
  try {
    const raw = sessionStorage.getItem(PRINT_DATA_KEY);
    return raw ? (JSON.parse(raw) as PrintData) : null;
  } catch (e) {
    console.warn('Не удалось прочитать данные для печати:', e);
    return null;
  }
}

/* ===== Размеры страницы: A4 при 96 DPI (те же, что у .resume-page в вебе) =====
   Печать идёт через диалог браузера, поэтому размеры задаёт CSS
   (--resume-pad-px / --resume-pad-mm в src/index.css), а не этот модуль.
   Константы оставлены как справочные: 75 px = те же поля на экране и в PDF. */
export const PAGE_PX = { width: 794, height: 1123, padding: 75 };
export const PAGE_MM = { width: 210, height: 297 };

