/**
 * print.tsx — точка входа печатной страницы (/print.html).
 *
 * Рендерит ТОЛЬКО документ резюме (ResumeDocument → ResumeContent) — тот же
 * код, что рисует предпросмотр на сайте. Никакой обвязки приложения (App,
 * роутинг, фон, тулбары), поэтому в печати нет ни лишнего верхнего отступа,
 * ни пустых страниц: высота DOM-дерева равна высоте контента.
 *
 * Данные берутся из sessionStorage (ключ PRINT_DATA_KEY), которые записывает
 * Preview перед вызовом печати; если данных нет — показывается служебное
 * сообщение (оно не должно попасть в PDF, но помогает при отладке).
 */
import ReactDOM from 'react-dom/client';
import './print.css';
// Классы .resume-page / .resume-section и общие стили типографики — те же,
// что использует предпросмотр, поэтому печать и экран рисуются одинаково.
import './index.css';
import ResumeDocument from './ResumeDocument';
import { readPrintData } from './pdfDocument';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<ResumeDocument data={readPrintData()} />);
}
