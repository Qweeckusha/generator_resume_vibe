/**
 * print.tsx — точка входа печатной страницы (/print.html).
 *
 * Рендерит ТОЛЬКО документ резюме (ResumeDocument → ResumeContent) — тот же
 * код, что рисует предпросмотр на сайте. Никакой обвязки приложения (App,
 * роутинг, фон, тулбары), поэтому в печати нет ни лишнего верхнего отступа,
 * ни пустых страниц: высота DOM-дерева равна высоте контента.
 *
 * Данные берутся из sessionStorage (ключ PRINT_DATA_KEY), которые записывает
 * printBridge перед созданием iframe. После чтения данные удаляются — они
 * одноразовые (защита от случайного Ctrl+P с чужими данными).
 *
 * Важно: после монтирования React-дерева страница отправляет родителю
 * postMessage({type:'pulum-print-ready'}). Мост печатает ТОЛЬКО получив
 * этот сигнал — раньше print() вызывался сразу после load, до отрисовки,
 * и PDF выходил пустым листами. Дополнительно ждём готовность веб-шрифтов
 * (document.fonts.ready), чтобы метрики строк в PDF совпали с предпросмотром.
 */
import ReactDOM from 'react-dom/client';
import { flushSync } from 'react-dom';
import './print.css';
// Классы .resume-page / .resume-section и общие стили типографики — те же,
// что использует предпросмотр, поэтому печать и экран рисуются одинаково.
import './index.css';
import ResumeDocument from './ResumeDocument';
import { readPrintData } from './pdfDocument';

function notifyReady() {
  try {
    window.parent.postMessage({ type: 'pulum-print-ready' }, window.location.origin);
  } catch (e) {
    // Скриншот/песочница без доступа к parent — не критично,
    // у моста есть таймаут-страховка.
    console.warn('Не удалось отправить сигнал готовности печати:', e);
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  const data = readPrintData();
  // flushSync гарантирует, что DOM построен СИНХРОННО до сигнала готовности.
  flushSync(() => {
    ReactDOM.createRoot(rootEl).render(<ResumeDocument data={data} />);
  });

  // Ждём шрифты (иначе первая печать может использовать fallback-метрики),
  // затем даём один кадр на отрисовку и только потом зовём родителя.
  const fonts = (document as any).fonts;
  const fontsReady = fonts && fonts.ready ? fonts.ready : Promise.resolve();
  fontsReady
    .catch(() => undefined)
    .then(() => requestAnimationFrame(() => requestAnimationFrame(notifyReady)));
} else {
  notifyReady();
}
