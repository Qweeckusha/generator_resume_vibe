/**
 * Preview.tsx — предпросмотр резюме на сайте.
 *
 * ВАРИАНТ A (печать через браузер): PDF больше НЕ собирается ни html2canvas,
 * ни reportlab. Причина «съехавшего» текста была именно в этом: каждый движок
 * по-своему измеряет шрифты и переносит строки, поэтому идеальная веб-вёрстка
 * при выгрузке в PDF неизбежно разъезжалась.
 *
 * Теперь кнопка «Скачать PDF» открывает печатный документ (print.html), который
 * рендерит ТУ ЖЕ саму разметку (ResumeContent) тем же Chromium и вызывает
 * системный диалог печати — там достаточно выбрать «Сохранить как PDF».
 * Вёрстка PDF совпадает с предпросмотром пиксель в пиксель по построению.
 */
import { motion } from 'framer-motion';
import type { Page, SurveyData } from '../App';
import ResumeContent from '../ResumeContent';
import { buildPrintData } from '../buildPrintData';
import { writePrintData, openPrintWindow } from '../pdfDocument';

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
   * Скачивание PDF (вариант A): печать через браузер. Вызываем системный
   * диалог печати прямо на странице предпросмотра — в @media print из
   * src/index.css скрыт весь интерфейс, а карточки .resume-page печатаются
   * как отдельные листы A4. Тот же Chromium и та же разметка, что на экране,
   * поэтому в PDF текст в плавках навыков и кнопках-ссылках стоит ровно там же.
   */
  const downloadPDF = () => {
    // Данные для печати сохраняем на случай отдельного печатного документа
    // (print.html) — это единый источник данных для обоих путей печати.
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
          поэтому PDF из диалога печати совпадает с предпросмотром один-в-один. */}
      <div className="max-w-[794px] mx-auto">
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
