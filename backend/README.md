# ResumeAI Backend

Бэкенд на FastAPI для генерации резюме с помощью LLM через Ollama.

## Установка

```bash
cd backend
pip install -r requirements.txt
```

## Запуск

```bash
# Убедитесь, что Ollama запущена и модель qwen3:8b загружена
ollama pull qwen3:8b

# Запуск сервера
python main.py
# или
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `GET /` — информация о API
- `GET /health` — проверка работоспособности
- `POST /api/generate-resume` — генерация резюме из данных анкеты
- `POST /api/generate-pdf` — генерация PDF из структурированных данных

## Структура

- `main.py` — FastAPI приложение, роуты, логика
- `ollama_client.py` — клиент для взаимодействия с Ollama
- `pdf_generator.py` — генерация PDF с помощью reportlab
