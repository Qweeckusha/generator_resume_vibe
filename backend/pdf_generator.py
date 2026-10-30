"""
PDF Generator — генерация PDF-файла из данных резюме
Использует reportlab для создания PDF
"""

import base64
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer


def generate_pdf_bytes(resume_data: dict) -> str:
    """
    Генерирует PDF из данных резюме и возвращает base64-строку.
    """
    buffer = io.BytesIO()
    
    # Создаём документ
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20*mm,
        leftMargin=20*mm,
        topMargin=20*mm,
        bottomMargin=20*mm,
    )
    
    # Определяем цвета по шаблону
    template = resume_data.get("template", "modern")
    accent_colors = {
        "classic": "#1a365d",
        "modern": "#0f766e",
        "creative": "#7c3aed",
    }
    accent = HexColor(accent_colors.get(template, "#0f766e"))
    
    # Стили
    styles = getSampleStyleSheet()
    
    name_style = ParagraphStyle(
        'Name',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=accent,
        spaceAfter=4,
    )
    
    position_style = ParagraphStyle(
        'Position',
        parent=styles['Normal'],
        fontSize=14,
        textColor=HexColor("#555555"),
        spaceAfter=8,
    )
    
    section_style = ParagraphStyle(
        'Section',
        parent=styles['Heading2'],
        fontSize=13,
        textColor=accent,
        spaceBefore=16,
        spaceAfter=8,
        textTransform='uppercase',
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=10.5,
        leading=14,
        textColor=HexColor("#333333"),
    )
    
    company_style = ParagraphStyle(
        'Company',
        parent=styles['Normal'],
        fontSize=10,
        textColor=HexColor("#666666"),
        italic=True,
        spaceAfter=4,
    )
    
    # Собираем элементы документа
    story = []
    
    # Header
    personal = resume_data.get("personal", {})
    story.append(Paragraph(personal.get("fullName", ""), name_style))
    story.append(Paragraph(personal.get("position", ""), position_style))
    
    contacts = f"📧 {personal.get('email', '')} | 📱 {personal.get('phone', '')} | 📍 {personal.get('city', '')}"
    story.append(Paragraph(contacts, body_style))
    story.append(Spacer(1, 8*mm))
    
    # Summary
    story.append(Paragraph("ПРОФЕССИОНАЛЬНОЕ РЕЗЮМЕ", section_style))
    story.append(Paragraph(resume_data.get("summary", ""), body_style))
    
    # Experience
    story.append(Paragraph("ОПЫТ РАБОТЫ", section_style))
    for exp in resume_data.get("experience", []):
        story.append(Paragraph(
            f"<b>{exp.get('position', '')}</b> — {exp.get('period', '')}",
            body_style
        ))
        story.append(Paragraph(exp.get("company", ""), company_style))
        
        for achievement in exp.get("achievements", []):
            story.append(Paragraph(f"• {achievement}", body_style))
        story.append(Spacer(1, 4*mm))
    
    # Education
    story.append(Paragraph("ОБРАЗОВАНИЕ", section_style))
    for edu in resume_data.get("education", []):
        story.append(Paragraph(
            f"<b>{edu.get('institution', '')}</b> — {edu.get('period', '')}",
            body_style
        ))
        story.append(Paragraph(edu.get("degree", ""), company_style))
    
    # Skills
    story.append(Paragraph("КЛЮЧЕВЫЕ НАВЫКИ", section_style))
    skills_text = " | ".join(resume_data.get("skills", []))
    story.append(Paragraph(skills_text, body_style))
    
    # Строим PDF
    doc.build(story)
    
    # Получаем bytes и кодируем в base64
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return base64.b64encode(pdf_bytes).decode("utf-8")
