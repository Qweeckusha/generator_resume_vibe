# PULUM-PULUM — фронтенд (React + Vite + Tailwind)
FROM node:20-alpine

WORKDIR /app

# Зависимости (отдельный слой — кэшируется при неизменном package.json)
COPY package*.json ./
RUN npm install

# Исходники
COPY . .

EXPOSE 3000

# Dev-режим с hot-reload (для продакшена: npm run build && npx vite preview --port 3000)
CMD ["npm", "run", "dev"]
