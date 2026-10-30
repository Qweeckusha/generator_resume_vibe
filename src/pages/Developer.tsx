import { motion } from 'framer-motion';
import type { Page, SurveyData } from '../App';

interface Props {
  navigate: (p: Page) => void;
  setSurveyData: (data: SurveyData) => void;
}

const templates = [
  {
    name: 'Алексей',
    role: 'Frontend-разработчик',
    data: {
      fullName: 'Алексеев Алексей Алексеевич',
      email: 'aleksey.alexeev@example.com',
      phone: '+7 (999) 111-22-33',
      city: 'Москва',
      position: 'Frontend-разработчик',
      experience: `ООО "Технолоджи", 2022 — настоящее время
Должность: Senior Frontend-разработчик

Чем занимался:
- Разрабатывал SPA на React с TypeScript
- Писал unit-тесты и integration-тесты
- Ревьюил код junior-разработчиков
- Оптимизировал производительность приложений

Достижения:
- Ускорил загрузку главной страницы на 40%
- Внедрил CI/CD pipeline, сократив время деплоя с 30 до 5 минут
- Менторил 3 junior-разработчиков, 2 из которых повышены до middle

Веб-Студия "Креатив", 2020 — 2022
Должность: Frontend-разработчик

Чем занимался:
- Верстал адаптивные сайты по макетам из Figma
- Интегрировал REST API
- Работал с CMS WordPress и Bitrix

Достижения:
- Создал 15+ сайтов для клиентов из различных отраслей
- Разработал переиспользуемую библиотеку компонентов`,
      education: `МГУ им. М.В. Ломоносова, 2018–2022
Бакалавр, Прикладная математика и информатика

Яндекс.Практикум, 2022
Веб-разработчик

Stepik, 2021
Алгоритмы и структуры данных`,
      skills: `React, TypeScript, JavaScript (ES6+), HTML5, CSS3, Next.js, Redux, Node.js, PostgreSQL, Docker, Git, Webpack, Vite, Figma, Jira, Slack, Notion, VS Code, Postman`,
      about: `Увлечённый frontend-разработчик с 3+ годами коммерческого опыта. Люблю создавать удобные интерфейсы и оптимизировать производительность. 

В свободное время изучаю новые технологии, участвую в open-source проектах и пишу статьи на Habr. Ищу команду, где смогу расти как техлид и приносить пользу продукту.

Мои сильные стороны: внимание к деталям, умение работать в сжатые сроки, готовность помогать коллегам.`,
      github: 'aleksey-dev',
      telegram: '@aleksey_frontend',
      website: 'https://aleksey.dev',
      languages: 'Русский — родной\nEnglish — B2 (Upper-Intermediate)',
      template: 'modern' as const,
      plan: 'pro' as const,
    },
  },
  {
    name: 'Пётр',
    role: 'Backend-разработчик',
    data: {
      fullName: 'Петров Пётр Петрович',
      email: 'petr.petrov@example.com',
      phone: '+7 (999) 987-65-43',
      city: 'Санкт-Петербург',
      position: 'Backend-разработчик (Python)',
      experience: `FinTech Solutions, 2021 — настоящее время
Должность: Middle Python Developer

Чем занимался:
- Разрабатывал микросервисы на FastAPI
- Проектировал базы данных PostgreSQL
- Писал автотесты на pytest
- Работал с очередями сообщений (RabbitMQ, Kafka)

Достижения:
- Спроектировал и реализовал систему обработки платежей
- Оптимизировал SQL-запросы, ускорив работу API на 60%
- Внедрил систему мониторинга на Prometheus + Grafana

Startup Hub, 2019 — 2021
Должность: Junior Python Developer

Чем занимался:
- Разрабатывал REST API на Django
- Интегрировал сторонние сервисы
- Писал документацию к API

Достижения:
- Участвовал в разработке MVP для 3 стартапов
- Автоматизировал процесс деплоя с помощью Ansible`,
      education: `СПбГУ, 2017–2021
Бакалавр, Программная инженерия

Coursera, 2020
Python for Everybody Specialization`,
      skills: `Python, FastAPI, Django, Flask, PostgreSQL, MySQL, Redis, RabbitMQ, Kafka, Docker, Kubernetes, Git, Linux, pytest, PyCharm, VS Code, DBeaver, Postman, Swagger, Jenkins, GitLab CI`,
      about: `Backend-разработчик с фокусом на высоконагруженные системы. Люблю решать сложные архитектурные задачи и оптимизировать производительность.

Активно изучаю DevOps-практики и облачные технологии. В планах — получить сертификацию AWS Solutions Architect.

Ценю чистый код, автоматизацию и командную работу.`,
      github: 'petr-python',
      telegram: 'petr_backend',
      website: 'https://petr.dev',
      languages: 'Русский — родной\nEnglish — C1 (Advanced)',
      template: 'classic' as const,
      plan: 'pro_plus' as const,
    },
  },
  {
    name: 'Иван',
    role: 'UX/UI Дизайнер',
    data: {
      fullName: 'Иванов Иван Иванович',
      email: 'ivan.ivanov@example.com',
      phone: '+7 (999) 555-33-22',
      city: 'Казань',
      position: 'UX/UI Дизайнер',
      experience: `Digital Agency "Pixel", 2021 — настоящее время
Должность: Senior UX/UI Designer

Чем занимался:
- Проектировал интерфейсы мобильных приложений и веб-сервисов
- Проводил UX-исследования и юзабилити-тестирования
- Создавал дизайн-системы и компонентные библиотеки
- Работал с разработчиками над внедрением дизайна

Достижения:
- Спроектировал мобильное приложение с 100K+ скачиваний
- Разработал дизайн-систему для 5 продуктов компании
- Увеличил конверсию лендингов на 35% через A/B тестирование

Freelance, 2019 — 2021
Должность: UI Designer

Чем занимался:
- Создавал лендинги и корпоративные сайты
- Разрабатывал логотипы и брендбуки
- Делал иллюстрации для социальных сетей

Достижения:
- Работал с 20+ клиентами из различных сфер
- Разработал фирменный стиль для стартапа, получившего инвестиции`,
      education: `КФУ, 2017–2021
Бакалавр, Графический дизайн

Skillbox, 2020
UX/UI Designer Professional

Behance, 2019
Курс по типографике`,
      skills: `Figma, Sketch, Adobe XD, Photoshop, Illustrator, After Effects, InVision, Zeplin, User Research, Wireframing, Prototyping, Usability Testing, Information Architecture, User Flows, HTML/CSS (базовый уровень), Principle, Framer`,
      about: `UX/UI дизайнер с страстью к созданию интуитивных и красивых интерфейсов. Верю, что хороший дизайн — это баланс между эстетикой и функциональностью.

Люблю изучать поведение пользователей и находить неочевидные решения. Вдохновляюсь работами Apple, Airbnb и Stripe.

В свободное время рисую иллюстрации, фотографирую и веду блог о дизайне.`,
      github: 'ivan-design',
      telegram: '@ivan_ux',
      website: 'https://ivan.design',
      languages: 'Русский — родной\nEnglish — B1 (Intermediate)\nТатарский — родной',
      template: 'creative' as const,
      plan: 'premium' as const,
    },
  },
];

export default function Developer({ navigate, setSurveyData }: Props) {
  const handleSelectTemplate = (template: typeof templates[0]) => {
    setSurveyData(template.data);
    navigate('loading');
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Страница разработчика</span>
          </h1>
          <p className="text-muted text-lg mb-8">
            Выберите шаблон для быстрого тестирования генерации резюме
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {templates.map((template, index) => (
              <motion.div
                key={template.name}
                className="glass rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="text-5xl mb-4">
                  {template.name === 'Алексей' && '👨‍💻'}
                  {template.name === 'Пётр' && '👨‍💼'}
                  {template.name === 'Иван' && '🎨'}
                </div>
                <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
                <p className="text-muted mb-4">{template.role}</p>
                <div className="text-sm text-muted space-y-1">
                  <div>📧 {template.data.email}</div>
                  <div>📱 {template.data.phone}</div>
                  <div>📍 {template.data.city}</div>
                </div>
                <button className="btn-primary w-full mt-6">
                  Сгенерировать резюме
                </button>
              </motion.div>
            ))}
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Информация</h2>
            <ul className="space-y-2 text-muted">
              <li>• Каждый шаблон содержит полные тестовые данные</li>
              <li>• При клике данные автоматически заполняются в форму</li>
              <li>• Резюме генерируется через бэкенд (или мок-данные, если бэкенд недоступен)</li>
              <li>• Можно протестировать все три шаблона оформления</li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <button
              className="btn-secondary"
              onClick={() => navigate('landing')}
            >
              ← Вернуться на главную
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
