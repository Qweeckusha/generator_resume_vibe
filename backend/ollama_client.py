"""
Ollama Client — взаимодействие с локальной LLM
Используется модель qwen3:8b (или другая, указанная в конфиге)
"""

import httpx

# Конфигурация
OLLAMA_BASE_URL = "http://localhost:11434"
MODEL_NAME = "qwen3:8b"
REQUEST_TIMEOUT = 120.0  # 2 минуты на генерацию


async def check_ollama() -> bool:
    """Проверяет доступность Ollama"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            return response.status_code == 200
    except Exception:
        return False


async def generate_resume(prompt: str) -> str:
    """
    Отправляет промпт в Ollama и возвращает сгенерированный текст.
    Используется non-streaming режим для простоты.
    """
    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
        payload = {
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9,
                "num_predict": 2048,  # Максимальная длина ответа
            }
        }
        
        response = await client.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json=payload
        )
        
        if response.status_code != 200:
            raise Exception(f"Ollama error: {response.status_code} - {response.text}")
        
        data = response.json()
        return data.get("response", "")


async def list_models() -> list:
    """Возвращает список доступных моделей в Ollama"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if response.status_code == 200:
                data = response.json()
                return [m["name"] for m in data.get("models", [])]
    except Exception:
        pass
    return []


async def is_model_available(model_name: str = MODEL_NAME) -> bool:
    """Проверяет, доступна ли нужная модель"""
    models = await list_models()
    return any(model_name in m for m in models)
