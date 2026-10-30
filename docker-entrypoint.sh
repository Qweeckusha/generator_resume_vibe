#!/usr/bin/env bash
set -e

echo "🚀 Запуск ResumeAI в Docker..."
echo "   Ollama: ${OLLAMA_BASE_URL:-http://localhost:11434}"
echo "   Модель: ${OLLAMA_MODEL:-qwen3.5:4b}"

# Фронтенд (собранный Vite) раздаём на :3000 в фоне
(
  cd /app && exec npx vite preview \
    --host 0.0.0.0 --port 3000 --strictPort --outDir dist
) &

# Бэкенд FastAPI на :8000
cd /app/backend
exec /opt/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
