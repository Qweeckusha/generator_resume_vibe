"""
PDF Generator — генерация PDF-файла из данных резюме
Использует reportlab для создания PDF

Примечание об архитектуре: PDF собирается средствами reportlab "с нуля"
(текстовые слои + векторные фигуры), а не как растровый снимок веб-страницы.
Поэтому CSS-правила браузера (flexbox, align-items/justify-content,
border-radius) сюда автоматически не переносятся — их поведение нужно
воспроизводить явно. В этом файле оно воспроизведено так:

  * плашки навыков и кнопки-ссылки рисуются как Table с ALIGN='CENTER' и
    VALIGN='MIDDLE', что даёт точное центрирование текста по X и Y внутри
    фигуры (раньше текст "съезжал", т.к. навыки выводились одной строкой
    через " | ", а кнопок в PDF вообще не было);
  * полупрозрачный фон чипов (в вебе background: #RRGGBB15) имитируется
    цветом с alpha-каналом;
  * все данные экранируются в PDF-маркап reportlab — иначе символы "<", "&",
    "%" из текста, сгенерированного LLM, ломают вёрстку или молча съедают
    часть строк;
  * регистрируется TTF-шрифт с кириллицей (встроенный Helvetica кириллицу
    не содержит).
"""

import base64
import io
import os
from xml.sax.saxutils import escape as _escape_xml

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily


# ---------- Шрифты (с кириллицей) ----------
def _register_fonts() -> str:
    """Регистрирует первый доступный в системе TTF-шрифт с кириллицей.

    Возвращает имя базового шрифта для стилей. Если ничего не найдено —
    возвращаем 'Helvetica' (документ соберётся, но кириллица не отрисуется;
    это крайний случай, при котором сервер не падает).
    """
    candidates = [
        # (regular, bold)
        ("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
         "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"),
        ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
         "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
    ]
    for reg_path, bold_path in candidates:
        if os.path.exists(reg_path) and os.path.exists(bold_path):
            try:
                pdfmetrics.registerFont(TTFont("ResumeSans", reg_path))
                pdfmetrics.registerFont(TTFont("ResumeSans-Bold", bold_path))
                registerFontFamily(
                    "ResumeSans",
                    normal="ResumeSans",
                    bold="ResumeSans-Bold",
                    italic="ResumeSans",
                    boldItalic="ResumeSans-Bold",
                )
                return "ResumeSans"
            except Exception:
                continue
    return "Helvetica"


_BASE_FONT = _register_fonts()

# Эмодзи из веб-предпросмотра (📧 📱 📍) отсутствуют в текстовых шрифтах —
# в PDF заменяем их нейтральными подписями, чтобы не было пустых квадратиков.
_EMOJI_REPLACEMENTS = {
    "\U0001F4E7": "E-mail:",   # 📧
    "\U0001F4F1": "Tel:",      # 📱
    "\U0001F4CD": "",          # 📍
}


def _sanitize(text) -> str:
    """Готовит произвольную строку для PDF-маркапа reportlab:
    чистит неподдерживаемые глифы и экранирует спецсимволы разметки."""
    if text is None:
        return ""
    s = str(text)
    for emoji, repl in _EMOJI_REPLACEMENTS.items():
        s = s.replace(emoji, repl)
    # Убираем символы вне BMP (эмодзи и т.п.) — их нет в кириллических шрифтах
    s = "".join(ch for ch in s if ord(ch) <= 0xFFFF)
    s = _escape_xml(s)  # & < > -> &amp; &lt; &gt;
    return s.strip()


def _with_alpha(hex_color: HexColor, alpha: float) -> Color:
    """Цвет с прозрачностью (имитация rgba-фона из CSS)."""
    return Color(hex_color.red, hex_color.green, hex_color.blue, alpha=alpha)


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
    accent_hex = accent_colors.get(template, "#0f766e")
    accent = HexColor(accent_hex)

    # Стили
    styles = getSampleStyleSheet()

    def make(name, **kw):
        kw.setdefault("fontName", _BASE_FONT)
        return ParagraphStyle(name, **kw)

    name_style = make('Name', parent=styles['Heading1'], fontSize=24,
                      textColor=accent, spaceAfter=4)

    position_style = make('Position', parent=styles['Normal'], fontSize=14,
                          textColor=HexColor("#555555"), spaceAfter=8)

    section_style = make('Section', parent=styles['Heading2'], fontSize=13,
                         textColor=accent, spaceBefore=16, spaceAfter=8,
                         textTransform='uppercase')

    body_style = make('Body', parent=styles['Normal'], fontSize=10.5,
                      leading=14, textColor=HexColor("#333333"))

    company_style = make('Company', parent=styles['Normal'], fontSize=10,
                         textColor=HexColor("#666666"), italic=True,
                         spaceAfter=4)

    # Текст ВНУТРИ плашек: выравнивание по центру по горизонтали;
    # по вертикали центр задаётся TableStyle (VALIGN='MIDDLE').
    chip_text_style = make('ChipText', fontSize=9.5, leading=11.5,
                           alignment=TA_CENTER, textColor=accent)
    button_text_style = make('ButtonText', fontSize=9.5, leading=11.5,
                             alignment=TA_CENTER, textColor=HexColor("#ffffff"))

    content_width = doc.width

    def centered_chip(label_markup: str, *, bg: Color, border: Color,
                      text_style: ParagraphStyle, min_w: float = 18*mm,
                      pad_x: float = 4*mm, pad_y: float = 2.2*mm) -> Table:
        """Плашка с текстом, точно отцентрованным по X и Y внутри фигуры.

        Аналог веб-стиля: display:inline-flex; align-items:center;
        justify-content:center — но реализованный средствами reportlab,
        где такое центрирование даёт связка ALIGN/VALIGN таблицы.
        """
        para = Paragraph(label_markup, text_style)
        col_w = max(min_w, para.wrap(content_width, None)[0] + 2 * pad_x + 2)
        chip = Table([[para]], colWidths=[col_w],
                     style=TableStyle([
                         ('BACKGROUND', (0, 0), (-1, -1), bg),
                         ('BOX', (0, 0), (-1, -1), 0.6, border),
                         ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                         ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                         ('LEFTPADDING', (0, 0), (-1, -1), pad_x),
                         ('RIGHTPADDING', (0, 0), (-1, -1), pad_x),
                         ('TOPPADDING', (0, 0), (-1, -1), pad_y),
                         ('BOTTOMPADDING', (0, 0), (-1, -1), pad_y),
                     ]))
        return chip

    def chips_column(chips: list) -> Table:
        """Колонка плашек (как flex-wrap-контейнер в вебе, только в столбик —
        так надёжнее для печати: перенос строк в reportlab не поддерживается)."""
        rows = [[chip] for chip in chips]
        return Table(rows, colWidths=[content_width], hAlign='LEFT',
                     style=TableStyle([
                         ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                         ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                         ('LEFTPADDING', (0, 0), (-1, -1), 0),
                         ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                         ('TOPPADDING', (0, 0), (-1, -1), 1.1*mm),
                         ('BOTTOMPADDING', (0, 0), (-1, -1), 1.1*mm),
                     ]))

    # Собираем элементы документа
    story = []

    # Header
    personal = resume_data.get("personal", {})
    story.append(Paragraph(_sanitize(personal.get("fullName", "")), name_style))
    story.append(Paragraph(_sanitize(personal.get("position", "")), position_style))

    parts = []
    email = _sanitize(personal.get("email", ""))
    phone = _sanitize(personal.get("phone", ""))
    city = _sanitize(personal.get("city", ""))
    if email:
        parts.append(f"E-mail: {email}")
    if phone:
        parts.append(f"Tel: {phone}")
    if city:
        parts.append(city)
    if parts:
        story.append(Paragraph(" | ".join(parts), body_style))
    story.append(Spacer(1, 8*mm))

    # Summary
    story.append(Paragraph("ПРОФЕССИОНАЛЬНОЕ РЕЗЮМЕ", section_style))
    story.append(Paragraph(_sanitize(resume_data.get("summary", "")), body_style))

    # Experience
    story.append(Paragraph("ОПЫТ РАБОТЫ", section_style))
    for exp in resume_data.get("experience", []):
        story.append(Paragraph(
            f"<b>{_sanitize(exp.get('position', ''))}</b> — {_sanitize(exp.get('period', ''))}",
            body_style
        ))
        story.append(Paragraph(_sanitize(exp.get("company", "")), company_style))

        for achievement in exp.get("achievements", []):
            story.append(Paragraph(f"\u2022 {_sanitize(achievement)}", body_style))
        story.append(Spacer(1, 4*mm))

    # Education
    story.append(Paragraph("ОБРАЗОВАНИЕ", section_style))
    for edu in resume_data.get("education", []):
        story.append(Paragraph(
            f"<b>{_sanitize(edu.get('institution', ''))}</b> — {_sanitize(edu.get('period', ''))}",
            body_style
        ))
        story.append(Paragraph(_sanitize(edu.get("degree", "")), company_style))

    # Skills — стилизованные плашки, текст точно по центру фигуры
    story.append(Paragraph("КЛЮЧЕВЫЕ НАВЫКИ", section_style))
    skills = [s for s in (_sanitize(x) for x in resume_data.get("skills", [])) if s]
    if skills:
        chip_bg = _with_alpha(accent, 0.12)          # аналог ${accent}15 из CSS
        chip_border = _with_alpha(accent, 0.3)       # аналог ${accent}30 из CSS
        chips = [centered_chip(s, bg=chip_bg, border=chip_border,
                               text_style=chip_text_style) for s in skills]
        story.append(chips_column(chips))

    # Кнопки-ссылки (дополнительная информация) — то же центрирование,
    # белый текст на плашке акцентного цвета (как filled-кнопки в предпросмотре)
    links = []
    github = _sanitize(resume_data.get("githubUrl", "") or personal.get("github", ""))
    telegram = _sanitize(resume_data.get("telegramUrl", "") or personal.get("telegram", ""))
    website = _sanitize(resume_data.get("websiteUrl", "") or personal.get("website", ""))
    if github:
        links.append(("GitHub", github))
    if telegram:
        links.append(("Telegram", telegram))
    if website:
        site_label = website.replace("https://", "").replace("http://", "").rstrip("/")
        links.append((site_label, website))

    languages = _sanitize(resume_data.get("languages", ""))

    if links or languages:
        story.append(Paragraph("ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ", section_style))
        if links:
            buttons = []
            for label, url in links:
                markup = f"{_escape_xml(label)}<br/><font size=7.5 color='#e9e9e9'>{url}</font>"
                buttons.append(centered_chip(markup, bg=accent, border=accent,
                                             text_style=button_text_style,
                                             min_w=45*mm))
            story.append(chips_column(buttons))
        if languages:
            story.append(Spacer(1, 2*mm))
            story.append(Paragraph(f"<b>Языки:</b> {languages}", body_style))

    # Строим PDF
    doc.build(story)

    # Получаем bytes и кодируем в base64
    pdf_bytes = buffer.getvalue()
    buffer.close()

    return base64.b64encode(pdf_bytes).decode("utf-8")
