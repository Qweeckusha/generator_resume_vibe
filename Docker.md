# Docker — как собрать и запустить контейнеры

Инструкция по запуску проекта **PULUM-PULUM** в Docker.
Проект состоит из двух частей:

| Сервис | Технологии | Порт |
|---|---|---|
| `frontend` | React + Vite + Tailwind | `3000` |
| `backend` | FastAPI + Uvicorn + Ollama (qwen3:8b) | `8000` |
| `ollama` | LLM-сервер | `11434` |

---

## 1. Установка Docker

Проверьте, что Docker установлен:

```bash
docker --version
docker compose version
```

Если не установлен:

- **Linux:** `curl -fsSL https://get.docker.com | sh`
- **macOS / Windows:** скачайте [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## 2. Dockerfile для фронтенда

Создайте файл `Dockerfile` в корне проекта:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Зависимости
COPY package*.json ./
RUN npm install

# Исходники
COPY . .

EXPOSE 3000

# Dev-режим (для продакшена: npm run build && npx vite preview)
CMD ["npm", "run", "dev"]
```

### Сборка и запуск фронтенда

```bash
docker build -t pulum-frontend .
docker run -d --name pulum-frontend -p 3000:3000 pulum-frontend
```

Откройте в браузере: <http://localhost:3000>

---

## 3. Dockerfile для бэкенда

Создайте файл `backend/Dockerfile`:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Зависимости Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Код бэкенда
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Сборка и запуск бэкенда

```bash
docker build -t pulum-backend ./backend
docker run -d --name pulum-backend -p 8000:8000 pulum-backend
```

Проверка: <http://localhost:8000/docs> (Swagger API)

> ⚠️ Бэкенд обращается к Ollama по адресу `http://localhost:11434`.
> Внутри контейнера `localhost` — это сам контейнер, поэтому адрес Ollama
> нужно переопределить (см. пункт 4 — `OLLAMA_BASE_URL`).

---

## 4. docker-compose.yaml (рекомендуемый способ)

Чтобы поднять всё одной командой, создайте файл `docker-compose.yaml` в корне:

```yaml
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src        # hot-reload исходников
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
    depends_on:
      - ollama

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama

volumes:
  ollama_data:
```

> Для работы с `OLLAMA_BASE_URL` через переменную окружения замените в
> `backend/ollama_client.py` строку:
> ```python
> OLLAMA_BASE_URL = "http://localhost:11434"
> ```
> на:
> ```python
> import os
> OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
> ```

### Загрузка модели qwen3:8b (нужно сделать один раз)

```bash
docker exec -it $(docker ps -qf name=ollama) ollama pull qwen3:8b
```

### Команды docker compose

```bash
docker compose up -d --build   # собрать образы и запустить все сервисы
docker compose ps              # статус контейнеров
docker compose logs -f         # смотреть логи
docker compose down            # остановить и удалить контейнеры
docker compose down -v         # то же + удалить volumes (сброс моделей Ollama)
```

---

## 5. Полезные команды Docker

```bash
docker ps                        # список запущенных контейнеров
docker images                    # список образов
docker logs -f <имя_контейнера>  # логи
docker exec -it <имя> sh         # shell внутри контейнера
docker stop <имя>                # остановить
docker rm <имя>                  # удалить
docker rmi <образ>               # удалить образ
docker system prune -a           # почистить всё неиспользуемое
```

---

## 6. Частые проблемы

| Проблема | Решение |
|---|---|
| Порт 3000/8000 уже занят | Остановите процесс: `lsof -i :3000`, либо измените порт в compose |
| Бэкенд не видит Ollama | Проверьте `OLLAMA_BASE_URL` и что сервис `ollama` запущен (`docker compose ps`) |
| Модель не найдена | Выполните `ollama pull qwen3:8b` внутри контейнера (пункт 4) |
| Долгая первая сборка | Это нормально: скачиваются base-образы и зависимости; дальше используется кэш |
