import tempfile
import os
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from docx import Document
from docx.enum.text import WD_COLOR_INDEX

app = FastAPI()

DIST_DIR = Path(__file__).parent / "frontend" / "dist"


def extract_highlights(path: str) -> list[dict]:
    doc = Document(path)
    highlights = []

    for para_idx, paragraph in enumerate(doc.paragraphs):
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
                        highlights.append({"text": current_text, "color": current_color, "para_index": para_idx})
                    current_color = color_name
                    current_text = run.text
            else:
                if current_text and current_color:
                    highlights.append({"text": current_text, "color": current_color, "para_index": para_idx})
                current_color = None
                current_text = ""

        if current_text and current_color:
            highlights.append({"text": current_text, "color": current_color, "para_index": para_idx})

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

    @app.get("/{full_path:path}")
    async def spa(full_path: str):
        index = DIST_DIR / "index.html"
        return FileResponse(index)
