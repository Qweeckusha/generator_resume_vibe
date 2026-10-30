/**
 * Preview.tsx — предпросмотр резюме на сайте.
 *
 * ВАРИАНТ A (печать через браузер): PDF больше НЕ собирается ни html2canvas,
 * ни reportlab. Причина «съехавшего» текста была именно в этом: каждый движок
 * по-своему измеряет шрифты и переносит строки, поэтому идеальная веб-вёрстка
 * при выгрузке в PDF неизбежно разъезжалась.
 *
 * Кнопка «Скачать PDF» вызывает системный диалог печати этой же страницы:
 * тот же Chromium и та же разметка ResumeContent, поэтому вёрстка PDF
 * совпадает с предпросмотром один-в-один.
 *
 * Две роли разметки (см. src/index.css, @media print):
 *  • .screen-sheets — карточки A4, которые видит пользователь на сайте;
 *  • .print-root    — ОДНА непрерывная лента (ResumeDocument), которая
 *    уходит в PDF. Chromium сам переносит её по страницам, поэтому пустые
 *    листы между «страницами предпросмотра» больше не появляются.
 */
import { motion } from 'framer-motion';
import type { Page, SurveyData } from '../App';
import ResumeContent from '../ResumeContent';
import ResumeDocument from '../ResumeDocument';
import { buildPrintData } from '../buildPrintData';
import { writePrintData } from '../pdfDocument';

interface Props {
  navigate: (p: Page) => void;
  resumeData: any;
  surveyData: SurveyData | null;
}

export default function Preview({ navigate, resumeData, surveyData }: Props) {
  if (!resumeData) {
    navigate('landing');
    return null;
  }

  const plan = surveyData?.plan || 'pro';
  const isFree = plan === 'free';

  /**
   * Скачивание PDF (вариант A): печать через браузер. Системный диалог печати
   * открывается на самой странице предпросмотра; в @media print из src/index.css
   * скрыт весь интерфейс сайта, а в PDF уходит непрерывная лента .print-root
   * (ResumeDocument). Тот же Chromium и та же разметка ResumeContent, что на
   * экране, поэтому текст в плавках навыков и кнопках-ссылках стоит ровно там же.
   */
  const downloadPDF = () => {
    // Дублируем данные в sessionStorage: печать всегда берёт тот же объект,
    // что и предпросмотр (страховка от расхождения источников данных).
    writePrintData(printData);
    window.print();
  };

  // Единый объект данных для обеих страниц предпросмотра и для печати:
  // предпросмотр и PDF гарантированно получают одни и те же данные.
  const printData = buildPrintData(resumeData, surveyData);

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Toolbar */}
      <div className="max-w-[794px] mx-auto mb-6">
        <div className="glass rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={() => navigate('landing')}
            className="text-muted hover:text-purple-500 transition-colors text-sm"
          >
            ← На главную
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            {isFree && (
              <div className="text-sm text-orange-400 flex items-center gap-2">
                <span>⚠️</span>
                <span>Free-тариф с вотермаркой</span>
                <button
                  className="btn-secondary text-xs px-3 py-1"
                  onClick={() => navigate('survey')}
                >
                  Убрать вотермарку
                </button>
              </div>
            )}
            {!isFree && (
              <span className="text-sm text-green-400 flex items-center gap-2">
                <span>✓</span>
                <span>Ваше резюме готово!</span>
              </span>
            )}
            <motion.button
              className="btn-primary text-sm px-6 py-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadPDF}
            >
              📥 Скачать PDF
            </motion.button>
          </div>
        </div>
      </div>

      {/* Resume Pages — разметка ТО ЖЕ, что в печатном документе (ResumeContent),
          поэтому PDF из диалога печати совпадает с предпросмотром один-в-один.

          screen-sheets — то, что видит пользователь на сайте: две карточки A4.
          print-root    — то, что уходит в PDF: ОДНА непрерывная лента со всем
          содержимым. Её переносит по страницам сам Chromium, поэтому пустых
          листов между «страницами предпросмотра» больше не появляется. */}
      <div className="max-w-[794px] mx-auto screen-sheets">
          {/* Page 1 */}
          <motion.div
            className={`resume-page relative ${isFree ? 'watermark-bg' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ResumeContent data={printData} page="first" />
          </motion.div>

          {/* Page 2 */}
          <motion.div
            className={`resume-page relative ${isFree ? 'watermark-bg' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ResumeContent data={printData} page="second" />
          </motion.div>
      </div>

      {/* Печатная версия: видима ТОЛЬКО при печати (@media print) */}
      <div className="print-only">
        <ResumeDocument data={printData} />
      </div>

      {/* Bottom actions */}
      <div className="max-w-[794px] mx-auto mt-8 mb-12">
        <div className="glass rounded-2xl p-6 text-center">
          {isFree ? (
            <>
              <p className="text-muted mb-4">
                ⚠️ Это резюме создано с вотермаркой PULUM-PULUM
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <button className="btn-secondary" onClick={() => navigate('survey')}>
                  ✏️ Обновить до Pro
                </button>
                <button className="btn-primary" onClick={downloadPDF}>
                  📥 Скачать с вотермаркой
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-muted mb-4">Вас устраивает результат?</p>
              <div className="flex justify-center gap-4 flex-wrap">
                <button className="btn-secondary" onClick={() => navigate('survey')}>
                  ✏️ Редактировать
                </button>
                <button className="btn-primary" onClick={downloadPDF}>
                  📥 Скачать PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
