import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Page, SurveyData } from '../App';

interface Props {
  navigate: (p: Page) => void;
  surveyData: SurveyData | null;
  setResumeData: (d: any) => void;
}

export default function Loading({ navigate, surveyData, setResumeData }: Props) {
  useEffect(() => {
  const generate = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: surveyData?.fullName || '',
          email: surveyData?.email || '',
          phone: surveyData?.phone || '',
          city: surveyData?.city || '',
          position: surveyData?.position || '',
          experience: surveyData?.experience || '',
          education: surveyData?.education || '',
          skills: surveyData?.skills || '',
          about: surveyData?.about || '',
          template: surveyData?.template || 'modern',
        }),
      });

      if (!response.ok) throw new Error('Ошибка генерации');

      const data = await response.json();
      setResumeData(data);
      navigate('preview');
    } catch (error) {
      console.error('Ошибка:', error);

      const resumeData = {
        personal: {
          fullName: surveyData?.fullName || 'Иванов Иван Иванович',
          email: surveyData?.email || 'ivan@example.com',
          phone: surveyData?.phone || '+7 (999) 123-45-67',
          city: surveyData?.city || 'Москва',
          position: surveyData?.position || 'Frontend-разработчик',
        },
        summary:
          'Опытный frontend-разработчик с 3+ годами коммерческого опыта. Специализируюсь на создании высоконагруженных SPA-приложений с использованием React и TypeScript. Имею успешный опыт руководства командой из 5 разработчиков и внедрения лучших практик разработки.',
        experience: [
          {
            company: 'ООО "Технолоджи"',
            position: 'Senior Frontend-разработчик',
            period: 'Январь 2022 — настоящее время',
            achievements: [
              'Разработал SPA-приложение на React с нуля, обслуживающее 50 000+ пользователей',
              'Оптимизировал производительность: увеличение скорости загрузки на 40%',
              'Внедрил CI/CD pipeline, сократив время деплоя с 30 до 5 минут',
              'Менторил 3 junior-разработчиков, 2 из которых повышены до middle',
            ],
          },
          {
            company: 'Веб-Студия "Креатив"',
            position: 'Frontend-разработчик',
            period: 'Июнь 2020 — Декабрь 2021',
            achievements: [
              'Создал 15+ адаптивных сайтов для клиентов из различных отраслей',
              'Разработал переиспользуемую библиотеку компонентов, ускорив разработку на 30%',
              'Интегрировал REST API и реализовал сложную бизнес-логику на клиенте',
            ],
          },
        ],
        education: [
          {
            institution: 'МГУ им. М.В. Ломоносова',
            degree: 'Бакалавр, Прикладная математика и информатика',
            period: '2018 — 2022',
          },
          {
            institution: 'Яндекс.Практикум',
            degree: 'Веб-разработчик',
            period: '2022',
          },
        ],
        skills: [
          'React',
          'TypeScript',
          'Next.js',
          'Node.js',
          'PostgreSQL',
          'Docker',
          'Git',
          'Figma',
          'Agile/Scrum',
          'REST API',
          'GraphQL',
          'Redux',
        ],
        template: surveyData?.template || 'modern',
      };

      setResumeData(resumeData);
      navigate('preview');
    }
  };

  generate();
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="spinner mx-auto mb-8" />
        <h2 className="text-2xl font-bold mb-2">
          AI создаёт твоё <span className="gradient-text">резюме</span>
        </h2>
        <p className="text-muted">
          Анализируем данные и генерируем профессиональный документ...
        </p>
        <div className="mt-8 flex justify-center gap-2 flex-wrap">
          {['Анализ данных', 'Генерация текста', 'Форматирование'].map((s, i) => (
            <motion.div
              key={s}
              className="glass rounded-lg px-4 py-2 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 1.2 }}
            >
              {s}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
