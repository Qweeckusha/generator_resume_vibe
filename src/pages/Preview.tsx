import { motion } from 'framer-motion';
import type { Page, SurveyData } from '../App';

declare const html2pdf: any;

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

  const { personal, summary, experience, education, skills, template } = resumeData;
  const plan = surveyData?.plan || 'pro';
  const isFree = plan === 'free';

  const getAccentColor = () => {
    switch (template) {
      case 'classic': return '#1e40af'; // Насыщенный синий
      case 'creative': return '#7c3aed'; // Яркий фиолетовый
      default: return '#6d28d9'; // Насыщенный фиолетовый (modern)
    }
  };

  const accent = getAccentColor();

  // Функция для нормализации username (убирает @, https://, и т.д.)
  const normalizeUsername = (value: string): string => {
    if (!value) return '';
    return value
      .replace(/^https?:\/\//, '') // Убираем http:// или https://
      .replace(/^@/, '') // Убираем @ в начале
      .replace(/\/$/, '') // Убираем / в конце
      .split('/')
      .pop() || ''; // Берём последнюю часть (username)
  };

  // Формируем полные URL из username
  const githubUrl = surveyData?.github ? `https://github.com/${normalizeUsername(surveyData.github)}` : '';
  const telegramUrl = surveyData?.telegram ? `https://t.me/${normalizeUsername(surveyData.telegram)}` : '';
  const websiteUrl = surveyData?.website || '';

  const downloadPDF = () => {
    const element = document.getElementById('resume-content');
    if (!element) return;

    // Клонируем элемент для PDF
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Убираем вотермарку из клона (она мешает рендерингу)
    const watermarks = clone.querySelectorAll('.watermark-bg');
    watermarks.forEach(w => w.classList.remove('watermark-bg'));

    const opt = {
      margin: 0,
      filename: `resume_${personal.fullName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        windowWidth: 794
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    html2pdf().set(opt).from(clone).save();
  };

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

      {/* Resume Pages */}
      <div className="max-w-[794px] mx-auto">
        <div id="resume-content">
          {/* Page 1 */}
          <motion.div
            className={`resume-page relative ${isFree ? 'watermark-bg' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="resume-section" style={{ borderBottom: `3px solid ${accent}`, paddingBottom: '16px', marginBottom: '20px' }}>
              <h1 style={{ fontSize: '28pt', fontWeight: 'bold', color: accent, margin: 0 }}>
                {personal.fullName}
              </h1>
              <p style={{ fontSize: '14pt', color: '#555', marginTop: '4px' }}>
                {personal.position}
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '10pt', color: '#666' }}>
                <span>📧 {personal.email}</span>
                <span>📱 {personal.phone}</span>
                <span>📍 {personal.city}</span>
              </div>
            </div>

            {/* Profile (Summary) */}
            {summary && (
              <section className="resume-section">
                <h2 style={{ fontSize: '13pt', fontWeight: 'bold', color: accent, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Профиль
                </h2>
                <p style={{ fontSize: '11pt', lineHeight: '1.6', color: '#333' }}>
                  {summary}
                </p>
              </section>
            )}

            {/* Experience */}
            <section className="resume-section">
              <h2 style={{ fontSize: '13pt', fontWeight: 'bold', color: accent, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Опыт работы
              </h2>
              {experience.map((exp: any, i: number) => (
                <div key={i} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '12pt', fontWeight: 'bold', margin: 0 }}>{exp.position}</h3>
                    <span style={{ fontSize: '9pt', color: '#888' }}>{exp.period}</span>
                  </div>
                  <p style={{ fontSize: '10pt', color: '#666', margin: '2px 0 8px 0', fontStyle: 'italic' }}>
                    {exp.company}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    {exp.achievements.map((a: string, j: number) => (
                      <li key={j} style={{ fontSize: '10.5pt', lineHeight: '1.5', color: '#333', marginBottom: '3px' }}>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </motion.div>

          {/* Page 2 */}
          <motion.div
            className={`resume-page relative ${isFree ? 'watermark-bg' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Education */}
            <section className="resume-section">
              <h2 style={{ fontSize: '13pt', fontWeight: 'bold', color: accent, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Образование
              </h2>
              {education.map((edu: any, i: number) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '12pt', fontWeight: 'bold', margin: 0 }}>{edu.institution}</h3>
                    <span style={{ fontSize: '9pt', color: '#888' }}>{edu.period}</span>
                  </div>
                  <p style={{ fontSize: '10.5pt', color: '#555', margin: '2px 0 0 0' }}>{edu.degree}</p>
                </div>
              ))}
            </section>

            {/* Skills */}
            <section className="resume-section">
              <h2 style={{ fontSize: '13pt', fontWeight: 'bold', color: accent, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Ключевые навыки
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    style={{
                      background: `${accent}15`,
                      color: accent,
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '10pt',
                      fontWeight: '500',
                      border: `1px solid ${accent}30`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

          {/* Additional info */}
          {(surveyData?.github || surveyData?.telegram || surveyData?.website || surveyData?.languages) && (
            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '13pt', fontWeight: 'bold', color: accent, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Дополнительная информация
              </h2>
              
              {/* Social links as buttons */}
              {(githubUrl || telegramUrl || websiteUrl) && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {githubUrl && (
                    <a 
                      href={githubUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        padding: '6px 12px',
                        backgroundColor: accent,
                        color: 'white',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '10pt',
                        fontWeight: '500'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                  {telegramUrl && (
                    <a 
                      href={telegramUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        padding: '6px 12px',
                        backgroundColor: accent,
                        color: 'white',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '10pt',
                        fontWeight: '500'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Telegram
                    </a>
                  )}
                  {websiteUrl && (
                    <a 
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer" 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '6px 16px',
                        backgroundColor: accent,
                        color: 'white',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '10pt',
                        fontWeight: '500'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                      .me
                    </a>
                  )}
                </div>
              )}
              
              {/* Languages */}
              {surveyData?.languages && (
                <div style={{ fontSize: '10.5pt', color: '#333', lineHeight: '1.6' }}>
                  <p><strong>Языки:</strong> {surveyData.languages.replace(/\n/g, ', ')}</p>
                </div>
              )}
            </section>
          )}

          {/* Cover letter section (only for Pro+ and Premium) */}
          {(plan === 'pro_plus' || plan === 'premium') && (
            <section style={{ marginTop: '40px', paddingTop: '20px', borderTop: `1px solid #e5e5e5` }}>
              <h2 style={{ fontSize: '13pt', fontWeight: 'bold', color: accent, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Сопроводительное письмо
              </h2>
              <div style={{ fontSize: '10.5pt', color: '#333', lineHeight: '1.7' }}>
                <p>Уважаемый Hiring Manager,</p>
                <p style={{ marginTop: '8px' }}>
                  Меня заинтересовала вакансия {personal.position.toLowerCase()} в вашей компании. 
                  Мой опыт разработки высоконагруженных веб-приложений и руководства командой 
                  позволяет мне уверенно решать сложные технические задачи и приносить пользу бизнесу.
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
        </motion.div>
        </div>
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
