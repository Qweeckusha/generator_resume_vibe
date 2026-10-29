import { motion } from 'framer-motion';
import type { Page } from '../App';

interface Props {
  navigate: (p: Page) => void;
  resumeData: any;
}

export default function Preview({ navigate, resumeData }: Props) {
  if (!resumeData) {
    navigate('landing');
    return null;
  }

  const { personal, summary, experience, education, skills, template } = resumeData;

  const getAccentColor = () => {
    switch (template) {
      case 'classic': return '#1a365d';
      case 'creative': return '#7c3aed';
      default: return '#0f766e';
    }
  };

  const accent = getAccentColor();

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Toolbar */}
      <div className="max-w-[210mm] mx-auto mb-6">
        <div className="glass rounded-2xl p-4 flex items-center justify-between">
          <button
            onClick={() => navigate('landing')}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← На главную
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Ваше резюме готово!</span>
            <motion.button
              className="btn-primary text-sm px-6 py-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.print()}
            >
              📥 Скачать PDF
            </motion.button>
          </div>
        </div>
      </div>

      {/* Resume Pages */}
      <div className="max-w-[210mm] mx-auto">
        {/* Page 1 */}
        <motion.div
          className="resume-page"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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
          className="resume-page"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
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

          {/* Cover letter section */}
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
        </motion.div>
      </div>

      {/* Bottom actions */}
      <div className="max-w-[210mm] mx-auto mt-8 mb-12">
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-gray-400 mb-4">Вас устраивает результат?</p>
          <div className="flex justify-center gap-4">
            <button className="btn-secondary" onClick={() => navigate('survey')}>
              ✏️ Редактировать
            </button>
            <button className="btn-primary" onClick={() => window.print()}>
              📥 Скачать PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
