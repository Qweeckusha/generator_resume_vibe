import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Page, SurveyData, Plan } from '../App';

interface Props {
  navigate: (p: Page) => void;
  surveyData: SurveyData | null;
  setSurveyData: (d: SurveyData) => void;
}

const STEPS = [
  { id: 'intro', title: 'Знакомство', icon: '👋' },
  { id: 'goal', title: 'Цель', icon: '💼' },
  { id: 'experience', title: 'Опыт', icon: '💪' },
  { id: 'education', title: 'Образование', icon: '🎓' },
  { id: 'skills', title: 'Навыки', icon: '⚡' },
  { id: 'about', title: 'О себе', icon: '✨' },
  { id: 'plan', title: 'Тариф', icon: '💳' },
  { id: 'template', title: 'Шаблон', icon: '🎨' },
];

export default function Survey({ navigate, surveyData, setSurveyData }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SurveyData>(
    surveyData || {
      fullName: '',
      email: '',
      phone: '',
      city: '',
      position: '',
      experience: '',
      education: '',
      skills: '',
      about: '',
      template: 'modern',
      plan: 'pro',
    }
  );

  const update = (field: keyof SurveyData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };
  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const submit = () => {
    setSurveyData(data);
    if (data.plan === 'free') {
      navigate('loading');
    } else {
      navigate('payment');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <p className="text-muted mb-6">Привет! Давай познакомимся. Как тебя зовут и как с тобой связаться?</p>
            <div>
              <label className="block text-sm text-muted mb-1">ФИО</label>
              <input
                className="input-field"
                placeholder="Например, Иванов Иван Иванович"
                value={data.fullName}
                onChange={(e) => update('fullName', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1">Email</label>
                <input
                  className="input-field"
                  placeholder="email@example.com"
                  value={data.email}
                  onChange={(e) => update('email', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Телефон</label>
                <input
                  className="input-field"
                  placeholder="+7 (999) 123-45-67"
                  value={data.phone}
                  onChange={(e) => update('phone', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Город</label>
              <input
                className="input-field"
                placeholder="Москва"
                value={data.city}
                onChange={(e) => update('city', e.target.value)}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <p className="text-muted mb-6">
              На какую должность ты планируешь откликаться? Это поможет нам адаптировать резюме под конкретную роль.
            </p>
            <div>
              <label className="block text-sm text-muted mb-1">Желаемая должность</label>
              <input
                className="input-field"
                placeholder="Например: Frontend-разработчик, Менеджер проектов, Дизайнер"
                value={data.position}
                onChange={(e) => update('position', e.target.value)}
              />
            </div>
            <p className="text-xs text-muted mt-3 italic">
              💡 Если ты ещё не определился, напиши общее направление — например, "Разработка" или "Маркетинг".
            </p>
          </div>
        );
      case 2:
        return (
          <div>
            <p className="text-muted mb-6">
              Где ты работал(а) раньше? Не переживай, если это были подработки, стажировки или учебные проекты — всё считается!
            </p>
            <div>
              <label className="block text-sm text-muted mb-1">Опыт работы</label>
              <textarea
                className="input-field"
                rows={8}
                placeholder={`ООО "Технолоджи", 2022 — настоящее время
Должность: Frontend-разработчик

Чем занимался:
- Пилил фичи на React
- Фиксил баги, которые находили тестировщики
- Общался с дизайнерами по макетам

Достижения:
- Ускорил загрузку сайта на 40%
- Научил новичков, теперь они работают самостоятельно`}
                value={data.experience}
                onChange={(e) => update('experience', e.target.value)}
              />
            </div>
            <p className="text-xs text-muted mt-3 italic">
              💡 Пиши как есть, своими словами. Наш AI поможет "упаковать" это в профессиональные формулировки!
            </p>
          </div>
        );
      case 3:
        return (
          <div>
            <p className="text-muted mb-6">
              Расскажи о своём образовании — вуз, курсы, сертификаты. Даже если это онлайн-курсы или самообразование!
            </p>
            <div>
              <label className="block text-sm text-muted mb-1">Образование</label>
              <textarea
                className="input-field"
                rows={6}
                placeholder={`МГУ им. Ломоносова, 2018–2022
Бакалавр, Прикладная математика и информатика

Курсы:
- Яндекс.Практикум, Веб-разработчик, 2022
- Stepik, Алгоритмы и структуры данных, 2021`}
                value={data.education}
                onChange={(e) => update('education', e.target.value)}
              />
            </div>
            <p className="text-xs text-muted mt-3 italic">
              💡 Не забывай про онлайн-курсы, сертификаты и даже пет-проекты — всё это ценный опыт!
            </p>
          </div>
        );
      case 4:
        return (
          <div>
            <p className="text-muted mb-6">
              Перечисли свои ключевые навыки — технические, soft skills, инструменты. Пиши всё, что приходит в голову!
            </p>
            <div>
              <label className="block text-sm text-muted mb-1">Навыки</label>
              <textarea
                className="input-field"
                rows={5}
                placeholder={`Технические:
React, TypeScript, Node.js, PostgreSQL, Docker, Git

Soft skills:
Работа в команде, коммуникация, решение проблем

Инструменты:
Figma, Jira, Slack, Notion`}
                value={data.skills}
                onChange={(e) => update('skills', e.target.value)}
              />
            </div>
            <p className="text-xs text-muted mt-3 italic">
              💡 Не стесняйся перечислять даже базовые навыки — иногда именно они становятся ключевыми для вакансии!
            </p>
          </div>
        );
      case 5:
        return (
          <div>
            <p className="text-muted mb-6">
              Что тебя мотивирует? Какие у тебя сильные стороны? Чем ты гордишься? Пиши свободно, как будто рассказываешь другу.
            </p>
            <div>
              <label className="block text-sm text-muted mb-1">О себе</label>
              <textarea
                className="input-field"
                rows={6}
                placeholder="Я увлечённый разработчик, который любит создавать удобные интерфейсы. Мне нравится оптимизировать производительность и находить элегантные решения сложных задач. В свободное время изучаю новые технологии и участвую в open-source проектах."
                value={data.about}
                onChange={(e) => update('about', e.target.value)}
              />
            </div>
            <p className="text-xs text-muted mt-3 italic">
              💡 Это твоя возможность показать себя как личность. Не бойся быть искренним!
            </p>
          </div>
        );
      case 6:
        return (
          <div>
            <p className="text-muted mb-6">
              У нас есть несколько вариантов — от бесплатного до премиум. Выбери тот, который подходит именно тебе.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'free', name: 'Free', price: '0 ₽', desc: 'Базовый шаблон с вотермаркой', features: ['1 резюме/мес', 'Вотермарка'] },
                { id: 'pro', name: 'Pro', price: '199 ₽', desc: 'PDF без вотермарки + ИИ', features: ['Премиум-шаблоны', 'Без вотермарки'], popular: true },
                { id: 'pro_plus', name: 'Pro+', price: '299 ₽', desc: 'Pro + сопроводительное', features: ['Всё из Pro', 'Сопроводительное'] },
                { id: 'premium', name: 'Premium', price: '499 ₽/мес', desc: 'Безлимит + все фичи', features: ['Безлимит', 'Перевод на английский'] },
              ].map((p) => (
                <motion.button
                  key={p.id}
                  className={`p-5 rounded-2xl border-2 text-left transition-all relative ${
                    data.plan === p.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 hover:border-purple-500/50'
                  } ${p.popular ? 'ring-2 ring-purple-500/50' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => update('plan', p.id)}
                >
                  {p.popular && (
                    <div className="absolute -top-2 right-3 bg-gradient-to-r from-purple-500 to-cyan-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      ⭐
                    </div>
                  )}
                  <div className="font-bold text-lg">{p.name}</div>
                  <div className="text-2xl font-bold gradient-text mb-1">{p.price}</div>
                  <div className="text-xs text-muted mb-2">{p.desc}</div>
                  <div className="text-xs text-muted">
                    {p.features.join(' • ')}
                  </div>
                </motion.button>
              ))}
            </div>
            <p className="text-xs text-muted mt-4 italic">
              💡 Для первого резюме рекомендуем Pro — оптимальное соотношение цены и качества!
            </p>
          </div>
        );
      case 7:
        return (
          <div>
            <p className="text-muted mb-6">
              У нас есть три стиля — выбери тот, который больше подходит твоей профессии и характеру.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'classic', name: 'Классический', desc: 'Строгий и деловой', emoji: '📋', for: 'юристов, финансистов' },
                { id: 'modern', name: 'Современный', desc: 'Минимализм и стиль', emoji: '✨', for: 'разработчиков, дизайнеров' },
                { id: 'creative', name: 'Креативный', desc: 'Яркий и запоминающийся', emoji: '🎨', for: 'творческих профессий' },
              ].map((t) => (
                <motion.button
                  key={t.id}
                  className={`p-6 rounded-2xl border-2 text-center transition-all ${
                    data.template === t.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 hover:border-purple-500/50'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => update('template', t.id)}
                >
                  <div className="text-4xl mb-2">{t.emoji}</div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted mt-1">{t.desc}</div>
                  <div className="text-xs text-muted mt-2 italic">Для: {t.for}</div>
                </motion.button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto w-full mb-8">
        <button
          onClick={() => navigate('landing')}
          className="text-muted hover:text-purple-500 transition-colors text-sm mb-4"
        >
          ← На главную
        </button>
        <h1 className="text-3xl font-bold">
          Интервью с <span className="gradient-text">AI-помощником</span>
        </h1>
        <p className="text-muted mt-2">Шаг {step + 1} из {STEPS.length}</p>

        {/* Progress bar */}
        <div className="mt-4 h-2 bg-gray-800/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`flex flex-col items-center text-xs ${
                i <= step ? 'text-purple-400' : 'text-muted'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  i < step
                    ? 'bg-purple-500 text-white'
                    : i === step
                    ? 'bg-purple-500/20 border-2 border-purple-500'
                    : 'bg-gray-800/30'
                }`}
              >
                {i < step ? '✓' : s.icon}
              </div>
              <span className="hidden md:block">{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto w-full flex-1">
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span>{STEPS[step].icon}</span>
            {STEPS[step].title}
          </h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            className="btn-secondary"
            onClick={prev}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.4 : 1 }}
          >
            ← Назад
          </button>
          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={next}>
              Далее →
            </button>
          ) : (
            <button className="btn-primary" onClick={submit}>
              {data.plan === 'free' ? 'Создать резюме →' : 'Перейти к оплате →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
