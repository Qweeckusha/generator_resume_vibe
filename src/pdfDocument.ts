/**
 * pdfDocument.ts — единый источник данных и размеров для печатного документа.
 *
 * Ключевая идея: вёрстка резюме описана ОДИН РАЗ (в ResumeDocument.tsx) и
 * используется и предпросмотром, и PDF. Раньше PDF собирался отдельным
 * движком (reportlab), который не понимает flexbox/шрифты браузера — из-за
 * этого текст в плавках навыков и кнопках-ссылках «съезжал».
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
   print.css задаёт ширину в CSS-пикселях, а page.pdf принимает поля в px того
   же масштаба, поэтому 75px отступа = ровно те же поля, что на экране. */
export const PAGE_PX = { width: 794, height: 1123, padding: 75 };
export const PAGE_MM = { width: 210, height: 297 };
/** Поля в пикселях для Playwright (unit: 'px'). */
export const PAGE_MARGINS_PX = {
  top: PAGE_PX.padding,
  right: PAGE_PX.padding,
  bottom: PAGE_PX.padding,
  left: PAGE_PX.padding,
};

/**
 * Открывает печатный документ в новой вкладке того же origin.
 *
 * Почему новая вкладка, а не iframe: sessionStorage изолирован по origin и
 * недоступен из cross-origin iframe (сайт на 5173, бэкенд на 8000). В новой
 * вкладке того же origin данные видны, и браузер сам выполнит печать/PDF без
 * участия сервера — поэтому вёрстка PDF совпадает с предпросмотром пиксель в
 * пиксель (тот же Chromium, тот же flexbox, те же шрифты).
 */
export function openPrintWindow(): Window | null {
  const url = `${window.location.origin}/print.html`;
  const win = window.open(url, '_blank');
  if (!win) {
    // Браузер заблокировал popup — открываем в текущей вкладке: печать всё
    // равно выполнится, а вернувшись назад пользователь увидит предпросмотр.
    window.location.href = url;
    return null;
  }
  return win;
}

