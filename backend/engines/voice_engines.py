"""VoiceStudio-AR — محركات الصوت (هجين: محلي + سحابي)."""

from __future__ import annotations
import asyncio
import shutil
import tempfile
import os
import uuid

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "outputs")


def _out(ext: str) -> str:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    return os.path.join(OUTPUT_DIR, f"{uuid.uuid4().hex}.{ext}")


# ---------------- TTS ----------------
async def tts_synthesize(text: str, lang: str = "ar", voice: str = "ar-EG-SalmaNeural", engine: str = "edge") -> str:
    """يرجع مسار ملف صوتي مولّد."""
    engine = (engine or "edge").lower()
    if engine == "edge":
        return await _tts_edge(text, voice)
    if engine == "gtts":
        return await _tts_gtts(text, lang)
    if engine == "pyttsx3":
        return await asyncio.to_thread(_tts_pyttsx3, text)
    if engine == "elevenlabs":
        return await _tts_elevenlabs(text, voice)
    if engine == "openai":
        return await _tts_openai(text, voice)
    # افتراضي: edge ثم gtts ثم pyttsx3
    try:
        return await _tts_edge(text, voice)
    except Exception:
        try:
            return await _tts_gtts(text, lang)
        except Exception:
            return await asyncio.to_thread(_tts_pyttsx3, text)


async def _tts_edge(text: str, voice: str) -> str:
    import edge_tts
    out = _out("mp3")
    await edge_tts.Communicate(text, voice).save(out)
    return out


async def _tts_gtts(text: str, lang: str) -> str:
    from gtts import gTTS
    out = _out("mp3")
    await asyncio.to_thread(lambda: gTTS(text=text, lang=lang[:2] or "ar").save(out))
    return out


def _tts_pyttsx3(text: str) -> str:
    import pyttsx3
    out = _out("wav")
    eng = pyttsx3.init()
    eng.save_to_file(text, out)
    eng.runAndWait()
    return out


async def _tts_elevenlabs(text: str, voice: str) -> str:
    from elevenlabs.client import ElevenLabs
    key = os.getenv("ELEVENLABS_API_KEY", "")
    if not key:
        raise RuntimeError("ضع ELEVENLABS_API_KEY في البيئة أولاً")
    client = ElevenLabs(api_key=key)
    audio = await asyncio.to_thread(lambda: client.text_to_speech.convert(voice_id=voice, text=text))
    out = _out("mp3")
    with open(out, "wb") as f:
        for chunk in audio:
            f.write(chunk)
    return out


async def _tts_openai(text: str, voice: str) -> str:
    from openai import OpenAI
    client = OpenAI()
    out = _out("mp3")
    await asyncio.to_thread(
        lambda: client.audio.speech.create(model="gpt-4o-mini-tts", voice=voice or "alloy", input=text).stream_to_file(out)
    )
    return out


ARABIC_VOICES = [
    "ar-EG-SalmaNeural", "ar-EG-ShakirNeural",
    "ar-SA-ZariyahNeural", "ar-SA-HamedNeural",
    "ar-AE-FatimaNeural", "ar-AE-HamdanNeural",
]
EN_VOICES = ["en-US-AriaNeural", "en-US-GuyNeural", "en-GB-SoniaNeural", "en-GB-RyanNeural"]


# ---------------- Voice Clone ----------------
async def clone_synthesize(reference_path: str, text: str, lang: str = "ar") -> str:
    """استنساخ صوتي:
    - لو Coqui XTTS متثبت → استنساخ محلي حقيقي.
    - لو ElevenLabs API key موجود → استنساخ سحابي.
    - غير كده → TTS عادي بأقرب صوت (وضع تجريبي).
    """
    # 1) محلي: Coqui XTTS
    try:
        from TTS.api import TTS  # type: ignore
        raise NotImplementedError("lazy")
    except Exception:
        pass
    # نحاول استيراد فعلي بدون كسر التطبيق
    try:
        import importlib
        tts_mod = importlib.import_module("TTS.api")
        TTS = tts_mod.TTS
        model = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
        out = _out("wav")
        await asyncio.to_thread(model.tts_to_file, text, out, reference_path, lang)
        return out
    except Exception:
        pass
    # 2) سحابي ElevenLabs
    if os.getenv("ELEVENLABS_API_KEY"):
        # تبسيط: نستخدم نفس صوت TTS (الاستنساخ الكامل يحتاج رفع العينة أولاً من الواجهة)
        return await _tts_elevenlabs(text, os.getenv("ELEVENLABS_VOICE_ID", "Rachel"))
    # 3) fallback
    voice = "ar-EG-SalmaNeural" if lang.startswith("ar") else "en-US-AriaNeural"
    return await tts_synthesize(text, lang=lang, voice=voice, engine="edge")


# ---------------- STT ----------------
async def stt_transcribe(audio_path: str, language: str = "ar", engine: str = "auto") -> dict:
    """تفريغ صوتي. يحاول faster-whisper محلياً ثم OpenAI."""
    engine = (engine or "auto").lower()
    if engine in ("auto", "local"):
        try:
            from faster_whisper import WhisperModel
            model = await asyncio.to_thread(WhisperModel, "small", "cpu", "int8")
            segments, info = await asyncio.to_thread(model.transcribe, audio_path, language)
            segs = [{"start": s.start, "end": s.end, "text": s.text} for s in segments]
            full = " ".join(s["text"] for s in segs).strip()
            return {"text": full, "segments": segs, "engine": "faster-whisper-local", "language": info.language}
        except Exception as e:
            if engine == "local":
                raise RuntimeError(f"التفريغ المحلي غير متاح: {e}. ثبّت faster-whisper أو استخدم وضع auto.")
    # سحابي OpenAI
    try:
        from openai import OpenAI
        client = OpenAI()
        with open(audio_path, "rb") as f:
            tr = await asyncio.to_thread(client.audio.transcriptions.create, "whisper-1", f, language)
        return {"text": tr.text, "segments": [], "engine": "openai-whisper", "language": language}
    except Exception as e:
        raise RuntimeError(f"لا يوجد محرك تفريغ متاح. ثبّت faster-whisper أو ضع OPENAI_API_KEY. ({e})")


# ---------------- Dubbing ----------------
async def dub_media(media_path: str, source_lang: str, target_lang: str, voice: str = "") -> dict:
    """دبلجة مبسطة: تفريغ → ترجمة → TTS → (دمج لو ffmpeg متاح)."""
    tr = await stt_transcribe(media_path, language=source_lang, engine="auto")
    src_text = tr["text"]
    # ترجمة
    try:
        from deep_translator import GoogleTranslator
        translated = await asyncio.to_thread(
            GoogleTranslator(source=source_lang[:2], target=target_lang[:2]).translate, src_text
        )
    except Exception:
        translated = src_text
    v = voice or ("ar-EG-SalmaNeural" if target_lang.startswith("ar") else "en-US-AriaNeural")
    dubbed_audio = await tts_synthesize(translated, lang=target_lang, voice=v, engine="edge")
    # دمج مع الفيديو لو ffmpeg موجود
    final = dubbed_audio
    if shutil.which("ffmpeg") and media_path.lower().endswith((".mp4", ".mkv", ".mov", ".webm")):
        out = _out("mp4")
        cmd = f'ffmpeg -y -i "{media_path}" -i "{dubbed_audio}" -c:v copy -map 0:v:0 -map 1:a:0 -shortest "{out}"'
        proc = await asyncio.create_subprocess_shell(cmd)
        await proc.communicate()
        if os.path.exists(out) and os.path.getsize(out) > 0:
            final = out
    return {"source_text": src_text, "translated_text": translated, "audio": final, "stt_engine": tr["engine"]}


# ---------------- Audiobook ----------------
async def audiobook_synthesize(full_text: str, lang: str = "ar", voice: str = "", chunk_size: int = 1500) -> str:
    """نص طويل → ملف صوتي واحد (يقسمه مقاطع ويدمج بـ ffmpeg أو يرجع الأول)."""
    v = voice or ("ar-EG-SalmaNeural" if lang.startswith("ar") else "en-US-AriaNeural")
    chunks = [full_text[i:i + chunk_size] for i in range(0, len(full_text), chunk_size)] or [full_text]
    parts = []
    for c in chunks[:50]:  # سقف أمان
        parts.append(await tts_synthesize(c, lang=lang, voice=v, engine="edge"))
    if len(parts) == 1:
        return parts[0]
    if shutil.which("ffmpeg"):
        lst = _out("txt")
        with open(lst, "w", encoding="utf-8") as f:
            for p in parts:
                f.write(f"file '{p}'\n")
        out = _out("mp3")
        cmd = f'ffmpeg -y -f concat -safe 0 -i "{lst}" -c copy "{out}"'
        proc = await asyncio.create_subprocess_shell(cmd)
        await proc.communicate()
        if os.path.exists(out) and os.path.getsize(out) > 0:
            return out
    return parts[0]


def available_engines() -> dict:
    def has(pkg: str) -> bool:
        try:
            __import__(pkg)
            return True
        except Exception:
            return False
    return {
        "tts": ["edge-tts (مجاني)"] + (["pyttsx3 (أوفلاين)"] if has("pyttsx3") else []) + ["gTTS"],
        "stt_local": has("faster_whisper"),
        "clone_local": has("TTS"),
        "ffmpeg": bool(shutil.which("ffmpeg")),
        "elevenlabs": bool(os.getenv("ELEVENLABS_API_KEY")),
        "openai": bool(os.getenv("OPENAI_API_KEY")),
    }
