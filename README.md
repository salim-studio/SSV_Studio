<div align="center">

<img src="frontend/logo.svg" width="96" alt="SSV Studio logo">

# SSV Studio

**Open-source, local-first voice studio** — text-to-speech, voice cloning, transcription, video dubbing & audiobook creation. Arabic-first, English-ready.

No account. No API key. No subscription for the local workflow.

[Features](#-features) · [Quickstart](#-quickstart) · [API](#-api) · [Configuration](#%EF%B8%8F-configuration) · [Roadmap](#-roadmap)

</div>

---

## ✨ Features

| Area | What you get |
|---|---|
| 🔊 **Text-to-speech** | Free Edge TTS (excellent Arabic voices: Egyptian, Saudi, Emirati) + offline `pyttsx3` + optional ElevenLabs / OpenAI |
| 🧬 **Voice cloning** | True local cloning via Coqui XTTS v2 when installed, closest-voice demo mode otherwise |
| 📝 **Transcription** | Local `faster-whisper` (optional) or OpenAI Whisper, with segments + timestamps |
| 🎬 **Video dubbing** | Transcribe → translate → re-voice → re-mux with ffmpeg |
| 📚 **Audiobooks** | Long text chunked, voiced and joined into one file |
| 🌐 **Web UI** | Modern dark studio console, Arabic + English |

## 🚀 Quickstart

Requirements: Python 3.11+ and `ffmpeg` (optional, for dubbing/audiobooks).

```powershell
git clone https://github.com/salim-studio/SSV_Studio.git
cd SSV_Studio
pip install -r requirements.txt
python run.py
```

Open **http://127.0.0.1:3900** 🎙️

## 🔌 API

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Health check |
| `/api/engines` | GET | Available engines, voices, capabilities |
| `/api/tts` | POST | `{text, lang, voice, engine}` → `{file}` |
| `/api/clone` | POST | `multipart: reference, text, lang` → `{file}` |
| `/api/stt` | POST | `multipart: audio, language, engine` → `{text, segments}` |
| `/api/dub` | POST | `multipart: media, source_lang, target_lang, voice` → `{file, source_text, translated_text}` |
| `/api/audiobook` | POST | `{text, lang, voice}` → `{file}` |

Example:

```bash
curl http://127.0.0.1:3900/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello from SSV Studio","lang":"en","voice":"en-US-AriaNeural","engine":"edge"}'
```

## ⚙️ Configuration

Optional cloud keys (hybrid mode — local stays default):

```powershell
$env:ELEVENLABS_API_KEY="..."
$env:OPENAI_API_KEY="..."
```

Full offline mode (optional installs):

```powershell
pip install faster-whisper   # local transcription
pip install TTS              # local XTTS voice cloning
```

## 🗂️ Project structure

```
SSV_Studio/
├── backend/
│   ├── main.py            # FastAPI app + REST API
│   └── engines/
│       └── voice_engines.py  # TTS / clone / STT / dub / audiobook engines
├── frontend/
│   ├── index.html  app.js  style.css  logo.svg
├── outputs/               # generated audio (git-ignored)
├── requirements.txt
└── run.py
```

## 🗺️ Roadmap

- [ ] Speaker diarization + vocal isolation
- [ ] Batch queue + watch-folder dubbing
- [ ] `.m4b` chaptered audiobook export
- [ ] Desktop build + Docker image

## ⚠️ Responsible use

Only clone voices with the speaker's explicit permission. Generated audio keeps no watermark — use responsibly.

## 📄 License

MIT — see [LICENSE](LICENSE).
