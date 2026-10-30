# PULUM-PULUM — бэкенд (FastAPI + Uvicorn)
FROM python:3.12-slim

WORKDIR /app

# Зависимости Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Код бэкенда
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
