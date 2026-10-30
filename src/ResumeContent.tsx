/**
 * ResumeContent.tsx — ЕДИНСТВЕННАЯ реализация содержимого резюме.
 *
 * Ключевая идея варианта A (печать через браузер): разметка резюме описана
 * ОДИН РАЗ и используется и веб-предпросмотром (Preview.tsx), и печатной
 * лентой (ResumeDocument.tsx). PDF создаётся тем же движком Chromium, что
 * рисует предпросмотр, поэтому текст в плавках навыков и кнопках-ссылках
 * физически не может «съехать» — расхождение двух независимых вёрсток
 * (сайта и reportlab) стало невозможным по построению.
 *
 * Важно: компонент рисует ТОЛЬКО содержимое страниц (без внешних wrapper'ов),
 * чтобы DOM-дерево внутри .resume-page совпадало в вебе и при печати один-в-один.
 */
import type { CSSProperties } from 'react';
import type { PrintData } from './pdfDocument';

/* ===== Акцентный цвет: те же значения, что в Preview.getAccentColor ===== */
export function accentForTemplate(template?: string): string {
  switch (template) {
    case 'classic':
      return '#1e40af'; // Насыщенный синий
    case 'creative':
      return '#7c3aed'; // Яркий фиолетовый
    default:
      return '#6d28d9'; // Насыщенный фиолетовый (modern)
  }
}

/* ===== Иконки для кнопок-ссылок (те же SVG-пути, что были в предпросмотре) ===== */
const ICON_PATHS: Record<string, string> = {
  github:
    'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  telegram:
    'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
  globe:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
};

function Icon({ name }: { name: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d={ICON_PATHS[name] ?? ICON_PATHS.globe} />
    </svg>
  );
}

interface Props {
  data: PrintData;
  /**
   * Какие секции рисовать. В веб-предпросмотре страницы разделены вручную
   * (две карточки .resume-page), поэтому компонент вызывается дважды:
   * page='first' — шапка/профиль/опыт, page='second' — всё остальное.
   * В печати тот же компонент рендерится целиком внутри одной .resume-page,
   * а Chromium сам переносит контент по страницам (break-after/break-inside).
   */
  page?: 'all' | 'first' | 'second';
}

export default function ResumeContent({ data, page = 'all' }: Props) {
  const { personal, summary, experience = [], education = [], skills = [] } = data;
  const accent = data.accent || accentForTemplate(data.template);

  const sectionTitle = (marginBottom = '12px'): CSSProperties => ({
    fontSize: '13pt',
    fontWeight: 'bold',
    color: accent,
    marginBottom,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  });

  /* ---------- Страница 1: шапка, профиль, опыт работы ---------- */
  const firstPage = (
    <>
      {/* Шапка */}
      <div className="resume-section" style={{ borderBottom: `3px solid ${accent}`, paddingBottom: '16px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28pt', fontWeight: 'bold', color: accent, margin: 0 }}>
          {personal.fullName}
        </h1>
        <p style={{ fontSize: '14pt', color: '#555', marginTop: '4px' }}>{personal.position}</p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '10pt', color: '#666' }}>
          <span>📧 {personal.email}</span>
          <span>📱 {personal.phone}</span>
          <span>📍 {personal.city}</span>
        </div>
      </div>

      {/* Профиль */}
      {summary && (
        <section className="resume-section">
          <h2 style={sectionTitle('8px')}>Профиль</h2>
          <p style={{ fontSize: '11pt', lineHeight: '1.6', color: '#333' }}>{summary}</p>
        </section>
      )}

      {/* Опыт работы */}
      <section className="resume-section">
        <h2 style={sectionTitle()}>Опыт работы</h2>
        {experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontSize: '12pt', fontWeight: 'bold', margin: 0 }}>{exp.position}</h3>
              <span style={{ fontSize: '9pt', color: '#888' }}>{exp.period}</span>
            </div>
            <p style={{ fontSize: '10pt', color: '#666', margin: '2px 0 8px 0', fontStyle: 'italic' }}>
              {exp.company}
            </p>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              {(exp.achievements ?? []).map((a, j) => (
                <li
                  key={j}
                  style={{ fontSize: '10.5pt', lineHeight: '1.5', color: '#333', marginBottom: '3px' }}
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );

  /* ---------- Страница 2: образование, навыки, доп. информация, письмо ---------- */
  const secondPage = (
    <>
      {/* Образование */}
      <section className="resume-section">
        <h2 style={sectionTitle()}>Образование</h2>
        {education.map((edu, i) => (
          <div key={i} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontSize: '12pt', fontWeight: 'bold', margin: 0 }}>{edu.institution}</h3>
              <span style={{ fontSize: '9pt', color: '#888' }}>{edu.period}</span>
            </div>
            <p style={{ fontSize: '10.5pt', color: '#555', margin: '2px 0 0 0' }}>{edu.degree}</p>
          </div>
        ))}
      </section>

      {/* Ключевые навыки — плавки; центрирует текст тот же flexbox, что и в PDF */}
      <section className="resume-section">
        <h2 style={sectionTitle()}>Ключевые навыки</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {skills.map((skill, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${accent}15`,
                color: accent,
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '10pt',
                fontWeight: '500',
                border: `1px solid ${accent}30`,
                lineHeight: '1',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Дополнительная информация */}
      {(!!data.links?.length || !!data.languages) && (
        <section className="resume-section" style={{ marginBottom: '24px' }}>
          <h2 style={sectionTitle()}>Дополнительная информация</h2>

          {!!data.links?.length && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {data.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: accent,
                    color: 'white',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '10pt',
                    fontWeight: '500',
                    lineHeight: '1',
                  }}
                >
                  <Icon name={link.icon} />
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {data.languages && (
            <div style={{ fontSize: '10.5pt', color: '#333', lineHeight: '1.6' }}>
              <p style={{ margin: 0 }}>
                <strong>Языки:</strong> {data.languages.replace(/\n/g, ', ')}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Сопроводительное письмо (только Pro+ / Premium) */}
      {data.coverLetter && (
        <section style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e5e5e5' }}>
          <h2 style={sectionTitle()}>Сопроводительное письмо</h2>
          <div style={{ fontSize: '10.5pt', color: '#333', lineHeight: '1.7' }}>
            <p>Уважаемый Hiring Manager,</p>
            <p style={{ marginTop: '8px' }}>
              Меня заинтересовала вакансия {(personal.position ?? '').toLowerCase()} в вашей компании.
              Мой опыт разработки высоконагруженных веб-приложений и руководства командой позволяет
              мне уверенно решать сложные технические задачи и приносить пользу бизнесу.
            </p>
            <p style={{ marginTop: '8px' }}>
              Буду рад обсудить, как мой опыт может быть полезен вашей команде.
              Спасибо за уделённое время!
            </p>
            <p style={{ marginTop: '12px' }}>
              С уважением,<br />
              {personal.fullName}
            </p>
          </div>
        </section>
      )}
    </>
  );

  if (page === 'first') return firstPage;
  if (page === 'second') return secondPage;
  return (
    <>
      {firstPage}
      {secondPage}
    </>
  );
}
