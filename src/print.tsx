/**
 * print.tsx — точка входа печатного документа (print.html)
 *
 * Зачем: PDF должен выглядеть ровно как предпросмотр на сайте. Предпросмотр
 * верстается браузером (flexbox + реальные шрифты), поэтому и PDF должен
 * печататься тем же движком, а не пересобираться «с нуля» в reportlab —
 * иначе центрирование текста в плавках навыков и кнопках-ссылках неизбежно
 * разъезжается (у каждого движка свои метрики строк и правила переноса).
 *
 * Как работает: страница рендерит то же самое резюме, что и предпросмотр
 * (данные берутся из sessionStorage — ключ `pulum-print-data`), после чего
 * автоматически запускает системный диалог печати, где в пару кликов
 * получается PDF с «Сохранить как PDF». Ничего не пересобирается на сервере,
 * поэтому съехать вёрстка не может.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import ResumeDocument from './ResumeDocument';
import { readPrintData } from './pdfDocument';

const data = readPrintData();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ResumeDocument data={data} />
  </React.StrictMode>
);

// Ждём два кадра + загрузку шрифтов: иначе Chromium может взять для заголовков
// фолбэк-шрифт, и строки встанут чуть плотнее, чем в предпросмотре.
async function autoPrint() {
  try {
    await (document as any).fonts?.ready;
  } catch {
    /* шрифты уже готовы или API недоступен — печатаем как есть */
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => window.print());
  });
}

autoPrint();
