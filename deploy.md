# Инструкция по развёртыванию PULUM-PULUM

Полное руководство по запуску проекта на локальной машине.

---

## 📋 Требования

- **Python 3.10+**
- **Node.js 18+** и npm
- **Ollama** (уже установлена ✅)
- **PyCharm** (рекомендуется для бэкенда)
- **VS Code** или любой редактор (для фронтенда)

---

## 🚀 Быстрый старт

### Шаг 1: Клонирование репозитория

```bash
git clone <your-repo-url>
cd pulum-pulum
```

---

## 🎨 Фронтенд (React + Vite)

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Фронтенд будет доступен по адресу: **http://localhost:5173**

### Сборка для продакшена

```bash
npm run build
```

Результат сборки появится в папке `dist/`.

### Предпросмотр продакшен-сборки

```bash
npm run preview
```

---

## 🔧 Бэкенд (FastAPI + Ollama)

### Шаг 1: Запуск Ollama

Откройте терминал и запустите Ollama:

```bash
ollama serve
```

### Шаг 2: Установка модели qwen3:8b

В отдельном терминале:

```bash
ollama pull qwen3:8b
```

Проверка установки:

```bash
ollama list
```

Вы должны увидеть `qwen3:8b` в списке моделей.

### Шаг 3: Создание виртуального окружения

**В PyCharm:**

1. Откройте папку `backend/` как проект в PyCharm
2. Перейдите в **File → Settings → Project → Python Interpreter**
3. Нажмите **Add Interpreter → Add Local Interpreter**
4. Выберите **Virtualenv Environment → New**
5. Укажите путь: `<project-root>/backend/venv`
6. Base interpreter: Python 3.10+
7. Нажмите **OK**

**Или через терминал:**

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate
```

### Шаг 4: Установка Python-зависимостей

```bash
pip install -r requirements.txt
```

### Шаг 5: Запуск бэкенда

**В PyCharm:**

1. Откройте файл `backend/main.py`
2. Нажмите правой кнопкой мыши → **Run 'main'**
3. Или нажмите **Shift+F10**

**Или через терминал:**

```bash
cd backend
python main.py
```

Бэкенд будет доступен по адресу: **http://localhost:8000**

### Проверка работоспособности

Откройте в браузере:

- API документация: **http://localhost:8000/docs**
- Проверка здоровья: **http://localhost:8000/health**

---

## 🔗 Связка фронтенда и бэкенда

На данный момент фронтенд работает с мок-данными (имитация AI-генерации). Для подключения к реальному бэкенду:

### В файле `src/pages/Loading.tsx`

Замените блок `useEffect` на реальный API-вызов:

```typescript
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
      // Fallback на мок-данные при ошибке
      // ... существующий код с мок-данными
    }
  };

  generate();
}, []);
```

---

## 📁 Структура проекта

```
pulum-pulum/
├── src/                    # Фронтенд (React + Tailwind)
│   ├── App.tsx            # Главный компонент
│   ├── hooks/
│   │   └── useTheme.ts    # Хук для управления темой
│   ├── pages/
│   │   ├── Landing.tsx    # Лендинг + тарифы
│   │   ├── Survey.tsx     # Интервью (8 шагов)
│   │   ├── Payment.tsx    # Оплата
│   │   ├── Loading.tsx    # Загрузка (AI генерирует)
│   │   └── Preview.tsx    # Предпросмотр резюме
│   └── index.css          # Стили
│
├── backend/               # Бэкенд (FastAPI + Ollama)
│   ├── main.py           # FastAPI приложение
│   ├── ollama_client.py  # Клиент для Ollama
│   ├── pdf_generator.py  # Генерация PDF
│   └── requirements.txt  # Python зависимости
│
├── DOCS/
│   └── scenarios.md      # Сценарии опросника
│
├── prac1.md              # Концепция проекта
├── prac2.md              # Бизнес-модель и ТЗ
└── deploy.md             # Эта инструкция
```

---

## 🧪 Тестирование

### Тестирование фронтенда

1. Запустите фронтенд: `npm run dev`
2. Откройте **http://localhost:5173**
3. Пройдите весь флоу:
   - Лендинг → Кнопка "Создать резюме"
   - Заполните анкету (8 шагов)
   - Выберите тариф (Free или платный)
   - Выберите шаблон
   - Дождитесь генерации
   - Проверьте предпросмотр

### Тестирование бэкенда

1. Убедитесь, что Ollama запущена: `ollama serve`
2. Запустите бэкенд: `python backend/main.py`
3. Откройте **http://localhost:8000/docs**
4. Протестируйте эндпоинт `/api/generate-resume`:
   - Нажмите **Try it out**
   - Введите тестовые данные
   - Нажмите **Execute**
   - Проверьте ответ

### Тестирование полной интеграции

1. Запустите Ollama: `ollama serve`
2. Запустите бэкенд: `python backend/main.py`
3. Запустите фронтенд: `npm run dev`
4. Подключите фронтенд к бэкенду (см. раздел "Связка фронтенда и бэкенда")
5. Пройдите полный флоу с реальной AI-генерацией

---

## 🐛 Решение проблем

### Проблема: Ollama не отвечает

**Решение:**
```bash
# Проверьте, запущена ли Ollama
ollama list

# Если нет моделей, установите qwen3:8b
ollama pull qwen3:8b

# Перезапустите Ollama
ollama serve
```

### Проблема: Бэкенд не запускается

**Решение:**
```bash
# Убедитесь, что виртуальное окружение активировано
# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

# Переустановите зависимости
pip install -r requirements.txt
```

### Проблема: Фронтенд не подключается к бэкенду

**Решение:**
1. Проверьте, что бэкенд запущен на порту 8000
2. Проверьте CORS в `backend/main.py` (должен быть `allow_origins=["*"]`)
3. Проверьте консоль браузера на наличие ошибок CORS
4. Убедитесь, что URL в fetch правильный: `http://localhost:8000/api/generate-resume`

### Проблема: PDF не генерируется

**Решение:**
```bash
# Переустановите reportlab
pip install --upgrade reportlab

# Проверьте, что все зависимости установлены
pip install -r requirements.txt
```

---

## 📦 Деплой на продакшен

### Фронтенд (Vercel / Netlify)

1. Соберите проект: `npm run build`
2. Загрузите папку `dist/` на хостинг
3. Настройте переменные окружения (если нужно)

### Бэкенд (Railway / Render / Heroku)

1. Создайте новый проект на платформе
2. Подключите репозиторий
3. Укажите команду запуска: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Настройте переменные окружения:
   - `OLLAMA_BASE_URL` — URL вашей Ollama
   - `MODEL_NAME` — название модели (по умолчанию `qwen3:8b`)

### Ollama (собственный сервер)

Для продакшена рекомендуется развернуть Ollama на отдельном сервере:

```bash
# На сервере
ollama serve

# Настройте firewall для доступа с бэкенда
# Обновите OLLAMA_BASE_URL в backend/ollama_client.py
```

---

## 🔐 Безопасность

### Перед продакшеном:

1. **CORS**: Укажите конкретные домены вместо `["*"]` в `backend/main.py`
2. **Rate limiting**: Добавьте ограничение запросов
3. **Валидация данных**: Усильте валидацию входных данных
4. **Логирование**: Добавьте логирование запросов
5. **Мониторинг**: Настройте мониторинг здоровья API

---

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи в терминале
2. Проверьте консоль браузера (F12)
3. Убедитесь, что все зависимости установлены
4. Проверьте, что Ollama запущена и модель загружена

---

## ✅ Чек-лист перед защитой

- [ ] Ollama запущена (`ollama serve`)
- [ ] Модель qwen3:8b установлена (`ollama list`)
- [ ] Бэкенд запущен (`python backend/main.py`)
- [ ] Фронтенд запущен (`npm run dev`)
- [ ] Фронтенд подключён к бэкенду (изменён Loading.tsx)
- [ ] Протестирован полный флоу создания резюме
- [ ] Проверена генерация PDF
- [ ] Проверена вотермарка для Free-тарифа
- [ ] Проверены все 4 тарифа (Free, Pro, Pro+, Premium)
- [ ] Проверены все 3 шаблона (Classic, Modern, Creative)
- [ ] Проверена смена темы (тёмная/светлая)

---

**Удачи на защите! 🎓**
