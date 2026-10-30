/**
 * printBridge.ts — запуск печати из ЧИСТОГО iframe (/print.html).
 *
 * Зачем iframe: окно сайта содержит обвязку (анимированный фон, min-h-screen,
 * тулбары) и скрытый дубль печатной разметки. При window.print() из такого
 * окна высота печатаемого дерева НЕ равна высоте контента — отсюда лишние
 * пустые страницы и съеханный верхний отступ первой страницы. В iframe с
 * /print.html в DOM только сам документ, поэтому разрывы страниц возникают
 * ровно там, где их задают @page и маркер .page-break.
 *
 * sessionStorage доступен iframe того же origin, поэтому данные для печати
 * передаются через writePrintData() — без postMessage и клонирования.
 */
import type { PrintData } from './pdfDocument';
import { writePrintData } from './pdfDocument';

const PRINT_SRC = 'print.html';

let frame: HTMLIFrameElement | null = null;

function ensureFrame(): HTMLIFrameElement {
  if (frame && document.body.contains(frame)) return frame;
  frame = document.createElement('iframe');
  frame.setAttribute('title', 'Печатная версия резюме');
  // Невидим, но не display:none — иначе Chromium не отдаёт layout для печати.
  frame.style.position = 'fixed';
  frame.style.right = '0';
  frame.style.bottom = '0';
  frame.style.width = '210mm'; /* ширина листа A4: layout считается «как на бумаге» */
  frame.style.height = '297mm';
  frame.style.border = '0';
  frame.style.opacity = '0';
  frame.style.pointerEvents = 'none';
  frame.style.zIndex = '-1';
  frame.src = PRINT_SRC;
  document.body.appendChild(frame);
  return frame;
}

/**
 * Открывает системный диалог печати с печатной страницей. Возвращает true,
 * если печать удалось инициировать, false — если браузер заблокировал
 * вызов (тогда вызывающий код может использовать запасной путь).
 */
export async function printResume(data: PrintData): Promise<boolean> {
  // Данные должны лежать в sessionStorage ДО загрузки iframe,
  // иначе печатная страница отрендерится пустой.
  writePrintData(data);

  const el = ensureFrame();

  if (!el.contentWindow) {
    // iframe ещё не готов — дождёмся load и повторим попытку один раз.
    await new Promise<void>((resolve) => {
      const onLoad = () => {
        el.removeEventListener('load', onLoad);
        resolve();
      };
      el.addEventListener('load', onLoad);
      setTimeout(resolve, 3000); // страховка от зависшей загрузки
    });
  }

  const win = el.contentWindow;
  if (!win) return false;

  try {
    // Фокус нужен, чтобы диалог печати открылся именно с содержимым iframe.
    win.focus();
    win.print();
    return true;
  } catch (e) {
    console.warn('Печать из iframe недоступна:', e);
    return false;
  }
}
