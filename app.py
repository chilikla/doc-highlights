import re
import tempfile
import os
from datetime import date
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from docx import Document
from docx.enum.text import WD_COLOR_INDEX

app = FastAPI()

DIST_DIR = Path(__file__).parent / "frontend" / "dist"

_DATE_RE = re.compile(r'^(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?')
_NOTE_RE = re.compile(r'\[(.+)\]')


def _parse_date_line(text: str, prev_year: int | None) -> tuple[date | None, str | None]:
    m = _DATE_RE.match(text.strip())
    if not m:
        return None, None
    day, month = int(m.group(1)), int(m.group(2))
    year_str = m.group(3)
    if year_str:
        year = int(year_str)
        if year < 100:
            year += 1900
    elif prev_year is not None:
        year = prev_year
    else:
        return None, None
    note_m = _NOTE_RE.search(text)
    note = note_m.group(1) if note_m else None
    try:
        return date(year, month, day), note
    except ValueError:
        return None, None


def extract_highlights(path: str) -> list[dict]:
    doc = Document(path)
    highlights = []
    current_date: date | None = None
    current_note: str | None = None
    prev_year: int | None = None

    for para_idx, paragraph in enumerate(doc.paragraphs):
        text = paragraph.text.strip()

        parsed, note = _parse_date_line(text, prev_year)
        if parsed is not None:
            current_date = parsed
            current_note = note
            prev_year = parsed.year
            continue

        current_color: str | None = None
        current_text = ""

        for run in paragraph.runs:
            color = run.font.highlight_color
            if color is not None and color != WD_COLOR_INDEX.AUTO:
                color_name = color.name.lower()
                if color_name == current_color:
                    current_text += run.text
                else:
                    if current_text and current_color:
                        highlights.append({
                            "text": current_text,
                            "color": current_color,
                            "para_index": para_idx,
                            "date": current_date.isoformat() if current_date else None,
                            "date_note": current_note,
                        })
                    current_color = color_name
                    current_text = run.text
            else:
                if current_text and current_color:
                    highlights.append({
                        "text": current_text,
                        "color": current_color,
                        "para_index": para_idx,
                        "date": current_date.isoformat() if current_date else None,
                        "date_note": current_note,
                    })
                current_color = None
                current_text = ""

        if current_text and current_color:
            highlights.append({
                "text": current_text,
                "color": current_color,
                "para_index": para_idx,
                "date": current_date.isoformat() if current_date else None,
                "date_note": current_note,
            })

    return highlights


@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    if not file.filename or not file.filename.endswith(".docx"):
        raise HTTPException(status_code=400, detail="יש להעלות קובץ .docx")

    with tempfile.NamedTemporaryFile(suffix=".docx", delete=False) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        highlights = extract_highlights(tmp_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"שגיאה בקריאת הקובץ: {e}")
    finally:
        os.unlink(tmp_path)

    return {"highlights": highlights}


if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

    @app.get("/favicon.png")
    async def favicon():
        return FileResponse(DIST_DIR / "favicon.png")

    @app.get("/{full_path:path}")
    async def spa(full_path: str):
        return FileResponse(DIST_DIR / "index.html")
