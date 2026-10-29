import { motion } from 'framer-motion';
import type { Page } from '../App';

interface Props {
  navigate: (p: Page) => void;
}

export default function Landing({ navigate }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
            R
          </div>
          <span className="text-xl font-bold gradient-text">ResumeAI</span>
        </div>
        <div className="flex gap-6 text-sm text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Возможности</a>
          <a href="#pricing" className="hover:text-white transition-colors">Тарифы</a>
          <a href="#how" className="hover:text-white transition-colors">Как это работает</a>
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
              <span className="gradient-text">за 2 минуты</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Искусственный интеллект создаст профессиональное резюме на основе ваших данных.
              Просто ответьте на несколько вопросов — получите готовый PDF.
            </p>
            <motion.button
              className="btn-primary text-lg px-10 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('survey')}
            >
              Создать резюме →
            </motion.button>
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
              { num: '2 мин', label: 'Среднее время' },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-6">
                <div className="text-3xl font-bold gradient-text">{s.num}</div>
                <div className="text-gray-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Почему <span className="gradient-text">ResumeAI</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🤖',
                title: 'AI-генерация',
                desc: 'Нейросеть qwen3 анализирует ваш опыт и создаёт продающий текст',
              },
              {
                icon: '🎨',
                title: '3 шаблона',
                desc: 'Классический, современный и креативный дизайн на выбор',
              },
              {
                icon: '📄',
                title: 'Готовый PDF',
                desc: 'Скачайте резюме в формате PDF, готовом к отправке работодателю',
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
                <p className="text-gray-400 text-sm">{f.desc}</p>
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
              { step: '01', title: 'Заполните анкету', desc: 'Расскажите о себе, опыте и навыках' },
              { step: '02', title: 'Оплатите', desc: 'Выберите тариф и оформите заказ' },
              { step: '03', title: 'Получите резюме', desc: 'AI создаст резюме и покажет предпросмотр' },
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
                  <p className="text-gray-400 text-sm">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Выберите <span className="gradient-text">тариф</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Базовый',
                price: '299 ₽',
                features: ['1 шаблон', 'PDF-файл', 'Базовая генерация'],
                popular: false,
              },
              {
                name: 'Про',
                price: '599 ₽',
                features: ['3 шаблона', 'PDF-файл', 'Расширенная генерация', 'Сопроводительное письмо'],
                popular: true,
              },
              {
                name: 'Премиум',
                price: '999 ₽',
                features: ['Все шаблоны', 'PDF + DOCX', 'AI-оптимизация', '3 ревизии', 'Приоритет'],
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`glass rounded-2xl p-8 relative ${plan.popular ? 'border-purple-500 glow-pulse' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-cyan-400 text-white text-xs font-bold px-4 py-1 rounded-full">
                    ПОПУЛЯРНЫЙ
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold gradient-text mb-4">{plan.price}</div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="text-gray-400 text-sm flex items-center gap-2">
                      <span className="text-green-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                  onClick={() => navigate('survey')}
                >
                  Выбрать
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass mt-20 px-6 py-8 text-center text-gray-500 text-sm">
        <p>© 2026 ResumeAI. Все права защищены.</p>
      </footer>
    </div>
  );
}
