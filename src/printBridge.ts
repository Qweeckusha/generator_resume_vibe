/**
 * printBridge.ts — запуск печати из ЧИСТОГО iframe (/print.html).
 *
 * Зачем iframe: окно сайта содержит обвязку (анимированный фон, min-h-screen,
 * тулбары). При window.print() из такого окна высота печатаемого дерева НЕ
 * равна высоте контента — отсюда лишние пустые страницы и съеханный верхний
 * отступ первой страницы. В iframe с /print.html в DOM только сам документ.
 *
 * Почему раньше PDF выходил полностью пустым (два бага, исправлены здесь):
 *  1) iframe загружался ОДИН раз и переиспользовался при каждом клике.
 *     React-дерево внутри него не перерисовывалось (данные читаются один раз
 *     при старте страницы), а sessionStorage после первого клика очищался.
 *     Итог: второе и все последующие скачивания печатали пустоту.
 *     Теперь перед каждой печатью iframe пересоздаётся («убить и создать»),
 *     гарантированно свежий рендер с актуальными данными.
 *  2) print.html грузится как модуль Vite/React — на рендер нужны миллисекунды,
 *     а print() вызывался сразу после события load, т.е. ДО отрисовки.
 *     Теперь печатная страница сообщает о готовности через
 *     window.parent.postMessage({type:'pulum-print-ready'}), и мост ждёт
 *     именно это событие (с таймаутом-страховкой), а не просто load.
 *
 * sessionStorage доступен iframe того же origin, поэтому данные для печати
 * передаются через writePrintData() — без postMessage и клонирования. Сами
 * данные одноразовые: печатная страница удаляет их сразу после чтения, чтобы
 * случайный Ctrl+P или повторная загрузка не напечатали чужое резюме.
 */
import type { PrintData } from './pdfDocument';
import { writePrintData } from './pdfDocument';

// Относительный путь + базовый URL страницы: работает и в dev (Vite отдаёт
// /print.html), и в прод-сборке, и если приложение лежит не в корне домена.
const PRINT_SRC = new URL('print.html', document.baseURI).href;

let frame: HTMLIFrameElement | null = null;

/** Уничтожает старый iframe (если есть) и создаёт новый. */
function recreateFrame(): HTMLIFrameElement {
  if (frame && frame.parentNode) frame.parentNode.removeChild(frame);
  frame = document.createElement('iframe');
  frame.setAttribute('title', 'Печатная версия резюме');
  // Невидим, но НЕ display:none — иначе Chromium не отдаёт layout для печати.
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
 * Ждёт два сигнала от новой страницы печати:
 *  • load       — ресурсы (JS/CSS) загружены;
 *  • postMessage pulum-print-ready — React успел отрендерить документ.
 * После второго можно печатать: кадр гарантированно не пустой.
 */
function waitForReady(el: HTMLIFrameElement, timeoutMs = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    let loaded = false;
    let settled = false;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      el.removeEventListener('load', onLoad);
      resolve(ok);
    };

    const onMessage = (e: MessageEvent) => {
      // Принимаем сообщение только от нашего iframe.
      if (e.source !== el.contentWindow) return;
      if (e.data && (e.data as any).type === 'pulum-print-ready') {
        // Крошечная пауза: дать браузеру завершить финальную отрисовку
        // (шрифты, фоны) перед снимком для диалога печати.
        setTimeout(() => finish(true), 120);
      }
    };

    const onLoad = () => {
      loaded = true;
      // Если страница по какой-то причине не прислала ready (упавший JS),
      // всё равно даём ей шанс отрендериться и продолжаем.
      setTimeout(() => finish(loaded), 800);
    };

    const timer = setTimeout(() => finish(false), timeoutMs);

    window.addEventListener('message', onMessage);
    el.addEventListener('load', onLoad);
  });
}

/**
 * Открывает системный диалог печати с печатной страницей. Возвращает true,
 * если печать удалось инициировать, false — если браузер заблокировал
 * вызов (тогда вызывающий код использует запасной путь — печать окна).
 */
export async function printResume(data: PrintData): Promise<boolean> {
  // Данные должны лежать в sessionStorage ДО загрузки iframe,
  // иначе печатная страница отрендерится пустой.
  writePrintData(data);

  // Всегда свежий iframe → всегда свежий рендер текущих данных.
  const el = recreateFrame();
  const ready = await waitForReady(el);
  if (!ready) {
    console.warn('Печатная страница не сообщила о готовности — используем запасной путь.');
    return false;
  }

  const win = el.contentWindow;
  if (!win) return false;

  try {
    // Диалог печати должен открыться именно с содержимым iframe.
    win.focus();
    win.print();
    return true;
  } catch (e) {
    console.warn('Печать из iframe недоступна:', e);
    return false;
  }
}
