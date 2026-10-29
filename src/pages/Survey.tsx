import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Page, SurveyData } from '../App';

interface Props {
  navigate: (p: Page) => void;
  surveyData: SurveyData | null;
  setSurveyData: (d: SurveyData) => void;
}

const STEPS = [
  { id: 'personal', title: 'Личные данные', icon: '👤' },
  { id: 'experience', title: 'Опыт работы', icon: '💼' },
  { id: 'education', title: 'Образование', icon: '🎓' },
  { id: 'skills', title: 'Навыки', icon: '⚡' },
  { id: 'about', title: 'О себе', icon: '✨' },
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
    navigate('payment');
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1">ФИО</label>
              <input
                className="input-field"
                placeholder="Иванов Иван Иванович"
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1">Город</label>
                <input
                  className="input-field"
                  placeholder="Москва"
                  value={data.city}
                  onChange={(e) => update('city', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Желаемая должность</label>
                <input
                  className="input-field"
                  placeholder="Frontend-разработчик"
                  value={data.position}
                  onChange={(e) => update('position', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <label className="block text-sm text-muted mb-1">
              Опыт работы (опишите места работы, должности, обязанности и достижения)
            </label>
            <textarea
              className="input-field"
              rows={8}
              placeholder={`ООО "Технолоджи", 2022 — н.в.
Должность: Frontend-разработчик
• Разработал SPA на React с нуля
• Увеличил скорость загрузки на 40%
• Менторил junior-разработчиков`}
              value={data.experience}
              onChange={(e) => update('experience', e.target.value)}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <label className="block text-sm text-muted mb-1">
              Образование (учебные заведения, степени, годы)
            </label>
            <textarea
              className="input-field"
              rows={6}
              placeholder={`МГУ им. Ломоносова, 2018–2022
Бакалавр, Прикладная математика и информатика

Курсы:
• Яндекс.Практикум, Веб-разработчик, 2022`}
              value={data.education}
              onChange={(e) => update('education', e.target.value)}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <label className="block text-sm text-muted mb-1">
              Ключевые навыки (через запятую или с новой строки)
            </label>
            <textarea
              className="input-field"
              rows={5}
              placeholder="React, TypeScript, Node.js, PostgreSQL, Docker, Git, Figma, Agile/Scrum"
              value={data.skills}
              onChange={(e) => update('skills', e.target.value)}
            />
          </div>
        );
      case 4:
        return (
          <div>
            <label className="block text-sm text-muted mb-1">
              О себе (кратко расскажите о себе, целях, сильных сторонах)
            </label>
            <textarea
              className="input-field"
              rows={6}
              placeholder="Увлечённый разработчик с 3+ годами опыта. Люблю создавать удобные интерфейсы и оптимизировать производительность. Ищу команду, где смогу расти как техлид."
              value={data.about}
              onChange={(e) => update('about', e.target.value)}
            />
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'classic', name: 'Классический', desc: 'Строгий и деловой', emoji: '📋' },
              { id: 'modern', name: 'Современный', desc: 'Минимализм и стиль', emoji: '✨' },
              { id: 'creative', name: 'Креативный', desc: 'Яркий и запоминающийся', emoji: '🎨' },
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
              </motion.button>
            ))}
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
          Заполните <span className="gradient-text">анкету</span>
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
              Перейти к оплате →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
