# ResumeAI — Умное резюме за минуту

Сервис для генерации профессиональных резюме с помощью искусственного интеллекта (Ollama + qwen3:8b).

## 🏗️ Структура проекта

```
.
├── src/                    # Фронтенд (React + Tailwind)
│   ├── App.tsx            # Главный компонент, роутинг
│   ├── pages/
│   │   ├── Landing.tsx    # Главная страница (лендинг + тарифы)
│   │   ├── Survey.tsx     # Многошаговая форма опроса
│   │   ├── Payment.tsx    # Имитация оплаты
│   │   ├── Loading.tsx    # Экран загрузки (AI генерирует)
│   │   └── Preview.tsx    # Предпросмотр резюме (многостраничный)
│   └── index.css          # Стили (Tailwind + кастомные)
│
├── backend/               # Бэкенд (FastAPI + Ollama)
│   ├── main.py           # FastAPI приложение
│   ├── ollama_client.py  # Клиент для Ollama
│   ├── pdf_generator.py  # Генерация PDF
│   └── requirements.txt  # Python зависимости
│
└── index.html            # Точка входа
```

## 🚀 Быстрый старт

### Фронтенд
```bash
npm install
npm run dev
```

### Бэкенд
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Ollama
```bash
ollama pull qwen3:8b
ollama serve
```

## 🎨 Дизайн

- Тёмная тема с градиентами (фиолетовый → циан)
- Glassmorphism эффекты
- Плавные анимации (Framer Motion)
- Адаптивный дизайн
- Многостраничный предпросмотр резюме в формате A4

## 📋 Фичи

- [x] Лендинг с тарифами
- [x] Многошаговая форма опроса
- [x] Имитация оплаты
- [x] Экран загрузки с анимацией
- [x] Предпросмотр резюме (2+ страницы)
- [x] 3 шаблона (классический, современный, креативный)
- [x] Backend на FastAPI
- [x] Интеграция с Ollama (qwen3:8b)
- [x] Генерация PDF
- [x] Структурированный промпт для LLM
