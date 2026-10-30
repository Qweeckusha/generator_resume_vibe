/**
 * ResumeDocument.tsx — печатный документ (лента .print-root).
 *
 * Разметка резюме живёт в ResumeContent.tsx и используется И веб-предпросмотром,
 * И печатью. Здесь остаётся только то, что нужно исключительно при печати:
 *  • смысловые страницы идут одной лентой без «карточных» размеров и полей;
 *  • между страницами ставится ОДИН явный маркер разрыва (.page-break), а не
 *    break-after на каждом листе — иначе после текста появлялся пустой лист;
 *  • внутренние поля = те же 75 px, что у карточек предпросмотра (см.
 *    padding в src/print.css), поэтому контент не «отъезжает» от края;
 *  • вотермарка Free-тарифа (в вебе её рисует CSS-класс .watermark-bg).
 *
 * PDF создаётся движком Chromium через системный диалог печати (вариант A),
 * который вызывается из чистой страницы /print.html (src/print.tsx), поэтому
 * центрирование текста в плавках навыков и кнопках-ссылках совпадает с
 * предпросмотром один-в-один: разметка и движок рендеринга — одни и те же.
 */
import type { CSSProperties } from 'react';
import type { PrintData } from './pdfDocument';
import ResumeContent from './ResumeContent';

/* ===== Вотермарка: та же графика, что .watermark-bg в src/index.css ===== */
const WATERMARK_STYLE: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(-30deg, transparent, transparent 100px, rgba(124, 58, 237, 0.03) 100px, rgba(124, 58, 237, 0.03) 200px)," +
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Ctext x='200' y='100' font-family='Arial' font-size='48' font-weight='bold' fill='rgba(124,58,237,0.08)' text-anchor='middle' dominant-baseline='middle' transform='rotate(-30 200 100)'%3EPULUM-PULUM%3C/text%3E%3C/svg%3E\")",
  backgroundRepeat: 'repeat, repeat',
  backgroundSize: 'auto, 400px 200px',
  backgroundPosition: 'center, center',
};

interface Props {
  data: PrintData | null;
}

export default function ResumeDocument({ data }: Props) {
  if (!data) {
    return <div style={{ padding: 40, fontFamily: 'sans-serif' }}>Нет данных для отображения.</div>;
  }

  return (
    <div className={`print-root${data.watermark ? ' watermarked' : ''}`} style={data.watermark ? WATERMARK_STYLE : undefined}>
      {/* Смысловые страницы предпросмотра здесь — блоки ленты. Их размеры,
          поля и тени обнулены в src/print.css, поэтому лента печатается как
          один непрерывный документ. Разрыв — только по явному маркеру ниже:
          он стоит МЕЖДУ страницами, поэтому пустых листов не появляется. */}
      <div className="resume-page">
        <ResumeContent data={data} page="first" />
      </div>
      <div className="page-break" aria-hidden="true" />
      <div className="resume-page">
        <ResumeContent data={data} page="second" />
      </div>
    </div>
  );
}
