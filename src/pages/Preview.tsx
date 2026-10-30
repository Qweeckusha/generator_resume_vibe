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
      case 'classic': return '#1a365d';
      case 'creative': return '#7c3aed';
      default: return '#0f766e';
    }
  };

  const accent = getAccentColor();

  const downloadPDF = () => {
    const element = document.getElementById('resume-content');
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `resume_${personal.fullName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Toolbar */}
      <div className="max-w-[210mm] mx-auto mb-6">
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
      <div className="max-w-[210mm] mx-auto">
        <div id="resume-content">
        {/* Page 1 */}
        <motion.div
          className="resume-page relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Watermark for Free plan */}
          {isFree && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-6xl font-bold text-purple-500/20 rotate-[-30deg] select-none">
                PULUM-PULUM
              </div>
            </div>
          )}

          {/* Header */}
          <div style={{ borderBottom: `3px solid ${accent}`, paddingBottom: '16px', marginBottom: '20px' }}>
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

          {/* Summary */}
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13pt', fontWeight: 'bold', color: accent, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Профессиональное резюме
            </h2>
            <p style={{ fontSize: '11pt', lineHeight: '1.6', color: '#333' }}>
              {summary}
            </p>
          </section>

          {/* Experience */}
          <section style={{ marginBottom: '24px' }}>
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
          className="resume-page relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Watermark for Free plan */}
          {isFree && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-6xl font-bold text-purple-500/20 rotate-[-30deg] select-none">
                PULUM-PULUM
              </div>
            </div>
          )}

          {/* Education */}
          <section style={{ marginBottom: '24px' }}>
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
          <section style={{ marginBottom: '24px' }}>
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
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13pt', fontWeight: 'bold', color: accent, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Дополнительная информация
            </h2>
            <div style={{ fontSize: '10.5pt', color: '#333', lineHeight: '1.6' }}>
              <p><strong>Языки:</strong> Русский (родной), English (B2 — Upper-Intermediate)</p>
              <p><strong>Портфолио:</strong> github.com/ivanov • linkedin.com/in/ivanov</p>
              <p><strong>Рекомендации:</strong> Предоставляются по запросу</p>
            </div>
          </section>

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
      <div className="max-w-[210mm] mx-auto mt-8 mb-12">
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
