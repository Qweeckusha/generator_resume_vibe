"""
ResumeAI Backend — FastAPI + Ollama
Генерация резюме с помощью LLM (qwen3:8b)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

from ollama_client import generate_resume
from pdf_generator import generate_pdf_bytes

app = FastAPI(title="ResumeAI API", version="1.0.0")

# CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ Models ============

class SurveyRequest(BaseModel):
    fullName: str
    email: str
    phone: str
    city: str
    position: str
    experience: str
    education: str
    skills: str
    about: str
    github: str = ""
    telegram: str = ""
    website: str = ""
    languages: str = ""
    template: str  # 'classic', 'modern', 'creative'


class ResumeResponse(BaseModel):
    personal: dict
    summary: str
    experience: list
    education: list
    skills: list
    template: str
    # Поля для PDF (кнопки-ссылки и языки). Необязательные — старые клиенты
    # могут их не присылать; frontend эти поля игнорирует.
    githubUrl: str = ""
    telegramUrl: str = ""
    websiteUrl: str = ""
    languages: str = ""


# ============ Routes ============

@app.get("/")
async def root():
    return {"message": "ResumeAI API is running", "version": "1.0.0"}


@app.get("/health")
async def health():
    """Проверка работоспособности API и Ollama"""
    try:
        from ollama_client import check_ollama
        ollama_ok = await check_ollama()
        return {"status": "ok", "ollama": ollama_ok}
    except Exception as e:
        return {"status": "degraded", "error": str(e)}


@app.post("/api/generate-resume", response_model=ResumeResponse)
async def generate_resume_endpoint(survey: SurveyRequest):
    """
    Основной эндпоинт: принимает данные анкеты,
    отправляет в Ollama, получает структурированное резюме.
    """
    try:
        print("\n" + "="*50)
        print("🚀 Получен запрос на генерацию резюме")
        print("="*50)
        
        # Формируем промпт из данных анкеты
        prompt = build_prompt(survey)
        print(f"✅ Промпт сформирован (длина: {len(prompt)} символов)")
        
        # Вызываем Ollama для генерации
        print("🤖 Отправляю запрос в Ollama...")
        raw_response = await generate_resume(prompt)
        print(f"✅ Получен ответ от Ollama (длина: {len(raw_response)} символов)")
        print(f"\n📝 Сырой ответ модели:\n{raw_response[:500]}...")
        
        # Парсим JSON из ответа модели
        print("\n🔍 Парсю JSON из ответа...")
        resume_data = parse_model_response(raw_response, survey)
        print("✅ JSON успешно распарсен")
        print("="*50 + "\n")
        
        return resume_data
        
    except json.JSONDecodeError as e:
        print(f"\n❌ Ошибка парсинга JSON: {str(e)}")
        print(f"Сырой ответ: {raw_response if 'raw_response' in locals() else 'N/A'}")
        raise HTTPException(status_code=500, detail=f"Ошибка парсинга ответа модели: {str(e)}")
    except Exception as e:
        print(f"\n❌ Ошибка генерации: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Ошибка генерации: {str(e)}")


@app.post("/api/generate-pdf")
async def generate_pdf_endpoint(resume_data: ResumeResponse):
    """Генерация PDF из данных резюме"""
    try:
        pdf_bytes = generate_pdf_bytes(resume_data.model_dump())
        return {"pdf_base64": pdf_bytes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка генерации PDF: {str(e)}")


# ============ Helpers ============

def build_prompt(survey: SurveyRequest) -> str:
    """Формирует промпт для LLM на основе данных анкеты"""
    return f"""Ты — профессиональный HR-специалист и карьерный консультант. 
Создай структурированное резюме на основе данных кандидата.

Данные кандидата:
- ФИО: {survey.fullName}
- Email: {survey.email}
- Телефон: {survey.phone}
- Город: {survey.city}
- Желаемая должность: {survey.position}

Опыт работы:
{survey.experience}

Образование:
{survey.education}

Навыки:
{survey.skills}

О себе:
{survey.about}

Стиль шаблона: {survey.template}

Верни ТОЛЬКО валидный JSON в следующем формате (без markdown, без пояснений):
{{
  "personal": {{
    "fullName": "ФИО",
    "email": "email",
    "phone": "телефон",
    "city": "город",
    "position": "должность"
  }},
  "summary": "Профиль кандидата (3-4 предложения, продающий текст)",
  "experience": [
    {{
      "company": "Название компании",
      "position": "Должность",
      "period": "Период работы",
      "achievements": ["Достижение 1", "Достижение 2", "..."]
    }}
  ],
  "education": [
    {{
      "institution": "Учебное заведение",
      "degree": "Степень/специальность",
      "period": "Годы обучения"
    }}
  ],
  "skills": ["Навык 1", "Навык 2", "..."]
}}

Важно:
1. Используй данные кандидата, но улучши формулировки
2. Добавь конкретные метрики и достижения где возможно
3. Summary должен быть продающим и профессиональным
4. Верни ТОЛЬКО JSON, без обёрток и пояснений"""


def parse_model_response(raw: str, survey: SurveyRequest) -> dict:
    """Парсит ответ модели в структурированный формат"""
    print("🔍 Начинаю парсинг ответа модели...")
    
    # Пытаемся извлечь JSON из ответа
    # Модель может обернуть JSON в markdown-блок
    cleaned = raw.strip()
    
    # Ищем JSON в ответе (может быть обёрнут в markdown)
    if "```json" in cleaned:
        print("📦 Найден markdown-блок с JSON")
        start = cleaned.find("```json") + 7
        end = cleaned.find("```", start)
        if end != -1:
            cleaned = cleaned[start:end].strip()
    elif "```" in cleaned:
        print("📦 Найден markdown-блок")
        start = cleaned.find("```") + 3
        end = cleaned.find("```", start)
        if end != -1:
            cleaned = cleaned[start:end].strip()
    
    # Ищем JSON по скобкам
    if not cleaned.startswith("{"):
        print("🔎 Ищу JSON по скобкам...")
        start = cleaned.find("{")
        end = cleaned.rfind("}") + 1
        if start != -1 and end > start:
            cleaned = cleaned[start:end]
            print(f"✅ JSON извлечён (длина: {len(cleaned)} символов)")
        else:
            print("❌ JSON не найден в ответе")
            raise json.JSONDecodeError("JSON not found in response", cleaned, 0)
    
    print(f"📝 Очищенный JSON:\n{cleaned[:300]}...")
    
    try:
        data = json.loads(cleaned)
        print("✅ JSON успешно распарсен")
    except json.JSONDecodeError as e:
        print(f"❌ Ошибка парсинга JSON: {e}")
        print(f"Проблемная позиция: {e.pos}")
        print(f"Контекст: ...{cleaned[max(0, e.pos-50):e.pos+50]}...")
        raise
    
    # Добавляем шаблон из запроса
    data["template"] = survey.template
    
    print("✅ Парсинг завершён успешно")
    return data


# ============ Run ============

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
