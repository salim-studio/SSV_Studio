"""SSV Studio — backend (FastAPI), hybrid local + cloud."""
from __future__ import annotations
import os
import shutil
import tempfile
import uuid
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.engines.voice_engines import (
    tts_synthesize, clone_synthesize, stt_transcribe, dub_media,
    audiobook_synthesize, available_engines, ARABIC_VOICES, EN_VOICES,
)

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND = os.path.join(BASE, "frontend")
if os.getenv("VERCEL"):
    # Vercel serverless filesystem is read-only except /tmp;
    # must match OUTPUT_DIR in backend/engines/voice_engines.py
    OUTPUTS = os.path.join(tempfile.gettempdir(), "ssv_outputs")
else:
    OUTPUTS = os.path.join(BASE, "outputs")
os.makedirs(OUTPUTS, exist_ok=True)

app = FastAPI(title="SSV Studio", description="Local-first open-source voice studio — TTS, cloning, transcription, dubbing & audiobooks")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class TTSReq(BaseModel):
    text: str
    lang: str = "ar"
    voice: str = "ar-EG-SalmaNeural"
    engine: str = "edge"


class AudiobookReq(BaseModel):
    text: str
    lang: str = "ar"
    voice: str = ""


def _serve(path: str):
    return FileResponse(path, media_type="audio/mpeg", filename=os.path.basename(path))


@app.get("/api/health")
def health():
    return {"ok": True, "app": "SSV Studio"}


@app.get("/api/engines")
def engines():
    return {
        **available_engines(),
        "voices_ar": ARABIC_VOICES,
        "voices_en": EN_VOICES,
    }


@app.post("/api/tts")
async def tts(req: TTSReq):
    if not req.text.strip():
        raise HTTPException(400, "النص فارغ")
    try:
        path = await tts_synthesize(req.text[:5000], lang=req.lang, voice=req.voice, engine=req.engine)
    except Exception as e:
        raise HTTPException(500, f"فشل التوليد: {e}")
    return {"file": f"/outputs/{os.path.basename(path)}"}


@app.post("/api/clone")
async def clone(reference: UploadFile = File(...), text: str = Form(...), lang: str = Form("ar")):
    if not text.strip():
        raise HTTPException(400, "النص فارغ")
    tmp = os.path.join(tempfile.gettempdir(), f"ref_{uuid.uuid4().hex}_{reference.filename}")
    with open(tmp, "wb") as f:
        shutil.copyfileobj(reference.file, f)
    try:
        path = await clone_synthesize(tmp, text[:5000], lang=lang)
    except Exception as e:
        raise HTTPException(500, f"فشل الاستنساخ: {e}")
    return {"file": f"/outputs/{os.path.basename(path)}", "note": "استنساخ محلي XTTS لو متثبت، وإلا أقرب صوت edge-tts"}


@app.post("/api/stt")
async def stt(audio: UploadFile = File(...), language: str = Form("ar"), engine: str = Form("auto")):
    tmp = os.path.join(tempfile.gettempdir(), f"stt_{uuid.uuid4().hex}_{audio.filename}")
    with open(tmp, "wb") as f:
        shutil.copyfileobj(audio.file, f)
    try:
        return await stt_transcribe(tmp, language=language, engine=engine)
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/dub")
async def dub(
    media: UploadFile = File(...),
    source_lang: str = Form("en"),
    target_lang: str = Form("ar"),
    voice: str = Form(""),
):
    tmp = os.path.join(tempfile.gettempdir(), f"dub_{uuid.uuid4().hex}_{media.filename}")
    with open(tmp, "wb") as f:
        shutil.copyfileobj(media.file, f)
    try:
        r = await dub_media(tmp, source_lang, target_lang, voice)
    except Exception as e:
        raise HTTPException(500, f"فشل الدبلجة: {e}")
    r["file"] = f"/outputs/{os.path.basename(r['audio'])}"
    return r


@app.post("/api/audiobook")
async def audiobook(req: AudiobookReq):
    if not req.text.strip():
        raise HTTPException(400, "النص فارغ")
    try:
        path = await audiobook_synthesize(req.text[:50000], lang=req.lang, voice=req.voice)
    except Exception as e:
        raise HTTPException(500, f"فشل إنتاج الكتاب: {e}")
    return {"file": f"/outputs/{os.path.basename(path)}"}


app.mount("/outputs", StaticFiles(directory=OUTPUTS), name="outputs")
if os.path.isdir(FRONTEND):
    app.mount("/", StaticFiles(directory=FRONTEND, html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=3900, reload=True)
