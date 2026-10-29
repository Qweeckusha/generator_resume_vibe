import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import type { Page } from '../App';

interface Props {
  navigate: (p: Page) => void;
}

export default function Landing({ navigate }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="text-3xl font-black gradient-text leading-none">P</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted">
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          >
            {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          </button>
          <a href="#features" className="hover:text-purple-500 transition-colors">Возможности</a>
          <a href="#pricing" className="hover:text-purple-500 transition-colors">Тарифы</a>
          <a href="#how" className="hover:text-purple-500 transition-colors">Как это работает</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Идеальное резюме
              <br />
              <span className="gradient-text">за 10 минут</span>
            </h1>
            <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">
              Пройди простое интервью с AI-помощником — и получи профессиональное резюме, 
              которое выделит тебя среди других кандидатов.
            </p>
            <motion.button
              className="btn-primary text-lg px-10 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('survey')}
            >
              Создать резюме →
            </motion.button>
            <p className="text-sm text-muted mt-4">Бесплатно • Без регистрации</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { num: '10 000+', label: 'Резюме создано' },
              { num: '95%', label: 'Проходят ATS' },
              { num: '10 мин', label: 'Среднее время' },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-6">
                <div className="text-3xl font-bold gradient-text">{s.num}</div>
                <div className="text-muted text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Почему <span className="gradient-text">PULUM-PULUM</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎤',
                title: 'Интервью с AI',
                desc: 'Не заполняй пустые формы — просто расскажи о себе своими словами',
              },
              {
                icon: '✨',
                title: 'AI-переформулирование',
                desc: 'Нейросеть превратит твой опыт в профессиональные формулировки',
              },
              {
                icon: '📄',
                title: 'Готовый PDF',
                desc: 'Скачай резюме в формате PDF, готовое к отправке работодателю',
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                className="glass rounded-2xl p-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Как это <span className="gradient-text">работает</span>?
          </h2>
          <div className="space-y-6">
            {[
              { step: '01', title: 'Пройди интервью', desc: 'Ответь на простые вопросы о себе и своём опыте' },
              { step: '02', title: 'AI создаст резюме', desc: 'Нейросеть переформулирует твой опыт в профессиональный текст' },
              { step: '03', title: 'Скачай PDF', desc: 'Получи готовое резюме, которое можно сразу отправлять' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                className="glass rounded-2xl p-6 flex items-center gap-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="text-4xl font-bold gradient-text opacity-50">{s.step}</div>
                <div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="text-muted text-sm">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Выбери <span className="gradient-text">тариф</span>
          </h2>
          <p className="text-center text-muted mb-12">Начни бесплатно или выбери премиум для лучшего результата</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: 'Free',
                price: '0 ₽',
                period: '',
                features: ['1 резюме в месяц', 'Базовый шаблон', 'Вотермарка PULUM-PULUM', 'Текстовый экспорт'],
                popular: false,
                plan: 'free',
              },
              {
                name: 'Pro',
                price: '199 ₽',
                period: '',
                features: ['1 PDF-резюме', 'Премиум-шаблоны', 'Без вотермарки', 'ИИ-переформулирование'],
                popular: true,
                plan: 'pro',
              },
              {
                name: 'Pro+',
                price: '299 ₽',
                period: '',
                features: ['Всё из Pro', 'Сопроводительное письмо', 'Приоритетная генерация', 'Адаптация под вакансию'],
                popular: false,
                plan: 'pro_plus',
              },
              {
                name: 'Premium',
                price: '499 ₽',
                period: '/мес',
                features: ['Безлимитные резюме', 'Все шаблоны', 'Перевод на английский', 'ИИ-адаптация под вакансию'],
                popular: false,
                plan: 'premium',
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`glass rounded-2xl p-6 relative ${plan.popular ? 'border-purple-500 glow-pulse' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-cyan-400 text-white text-xs font-bold px-4 py-1 rounded-full">
                    ПОПУЛЯРНЫЙ
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold gradient-text">{plan.price}</span>
                  {plan.period && <span className="text-muted text-sm">{plan.period}</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="text-muted text-sm flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular ? 'btn-primary' : 'btn-secondary'
                  }`}
                  onClick={() => navigate('survey')}
                >
                  {plan.name === 'Free' ? 'Начать бесплатно' : 'Выбрать'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass mt-20 px-6 py-8 text-center text-muted text-sm">
        <p>© 2026 PULUM-PULUM. Все права защищены.</p>
      </footer>
    </div>
  );
}
