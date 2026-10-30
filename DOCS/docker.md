# Docker — быстрый запуск ResumeAI

## Требования
- Docker (и Docker Compose v2, входит в состав Docker Desktop)
- На хосте запущена **Ollama** с моделью `qwen3.5:4b` (`ollama pull qwen3.5:4b`)

## Запуск одной командой

```bash
docker compose up --build
```

После запуска:
- Фронтенд: http://localhost:3000
- Бэкенд (FastAPI): http://localhost:8000 (Swagger: http://localhost:8000/docs)

## Как контейнер получает доступ к Ollama (localhost:11434)

Контейнер не видит «свой» localhost как машину-хост, поэтому в `docker-compose.yml`:
- бэкенду передаётся `OLLAMA_BASE_URL=http://host.docker.internal:11434`;
- добавлена строка `extra_hosts: host.docker.internal:host-gateway`, чтобы это
  имя работало и на обычном Linux (на Docker Desktop/Windows/Mac оно встроено).

Модель можно переопределить без пересборки образа:

```bash
OLLAMA_MODEL=qwen3:8b docker compose up
```

Если Ollama крутится на другой машине:

```bash
OLLAMA_BASE_URL=http://192.168.1.50:11434 docker compose up
```

(в compose значение зафиксировано в `environment`, при необходимости отредактируйте файл).

## Только сборка/запуск образа без compose

```bash
docker build -t resumeai-app .
docker run -p 3000:3000 -p 8000:8000 \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  --add-host=host.docker.internal:host-gateway \
  resumeai-app
```

## Важно про фронтенд
`src/pages/Loading.tsx` жёстко обращается к `http://localhost:8000` — это работает
«из коробки», потому что бэкенд проброшен на тот же порт хоста (`8000:8000`).
Браузер на хост-машине видит свой localhost, поэтому ничего менять не нужно.

## Остановка / очистка

```bash
docker compose down          # остановить
docker compose down -v       # остановить и удалить volumes
```
