# ResumeAI — фронтенд (Vite/React) + бэкенд (FastAPI) в одном образе
FROM node:20-slim AS base

# python3/pip needed for the FastAPI backend, curl for the healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
        python3 python3-pip python3-venv curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ---- Frontend ----
COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.js tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Backend ----
COPY backend/requirements.txt ./backend/requirements.txt
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir -r backend/requirements.txt

COPY backend ./backend

EXPOSE 8000 3000

CMD ["bash", "/app/docker-entrypoint.sh"]
