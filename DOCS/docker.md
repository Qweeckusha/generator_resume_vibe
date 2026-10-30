# 🐳 Docker — развёртывание PULUM-PULUM

Проект состоит из трёх контейнеров:

| Сервис   | Образ                      | Порт на хосте | Назначение                          |
|----------|----------------------------|---------------|-------------------------------------|
| ollama   | `ollama/ollama:latest`     | **11434** 🔒  | Локальная LLM (порт закреплён)      |
| backend  | `Dockerfile.backend`       | 8000          | FastAPI                             |
| frontend | `Dockerfile.frontend`      | 3000          | React + Vite → nginx                |

## Файлы

- `Dockerfile.backend` — образ бэкенда (python:3.11-slim + uvicorn)
- `Dockerfile.frontend` — multi-stage: сборка Vite (node:20) → раздача nginx
- `docker-compose.yml` — оркестрация всех трёх сервисов
- `nginx.conf` — конфиг фронтенда (SPA-роутинг + прокси `/api` → backend)
- `.dockerignore` — не тащим в образ node_modules, .git и пр.
- `.env.example` — шаблон переменных окружения

## Быстрый старт

```bash
# 1. (опционально) скорректировать порты/модель
cp .env.example .env

# 2. Собрать и запустить всё
docker compose up -d --build

# 3. Скачать модель внутрь контейнера Ollama (один раз)
docker exec pulum-ollama ollama pull qwen3.5:4b
```

Открыть: **http://localhost:3000** · API: http://localhost:8000/docs · Ollama: http://localhost:11434

## Вариант: Ollama уже запущена на хосте

Если Ollama крутится на машине как обычный сервис (порт 11434 занят ею),
не запускайте контейнер `ollama`, а укажите бэкенду адрес хоста:

```bash
# .env
OLLAMA_BASE_URL=http://host.docker.internal:11434   # Linux: добавьте extra_hosts 'host.docker.internal:host-gateway'
```

и запустите только два сервиса:

```bash
docker compose up -d --build backend frontend
```

## Полезные команды

```bash
docker compose logs -f backend      # логи бэкенда
docker compose ps                   # статус контейнеров
docker compose down                 # остановить (модели Ollama сохранятся в volume)
docker compose down -v              # удалить вместе с volume моделей
```

## Примечания

- Модели Ollama хранятся в named-volume `ollama_data` и переживают пересоздание контейнера.
- Для GPU (Linux + NVIDIA) раскомментируйте блок `deploy.resources` у сервиса `ollama`.
- Адрес API для фронтенда подшивается при сборке (`VITE_API_URL`); по умолчанию `http://localhost:8000`.
