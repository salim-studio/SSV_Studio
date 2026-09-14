const $ = id => document.getElementById(id);

const I18N = {
en: {
  title: "SSV Studio — Local-first Voice Studio",
  tagline: "Local-first voice studio — synthesize, clone, transcribe, dub.",
  tab_tts: "Synthesize", tab_clone: "Clone", tab_stt: "Transcribe", tab_dub: "Dub", tab_book: "Audiobook",
  tts_h2: "Text to speech", tts_hint: "Type or paste text in Arabic or English, pick a voice, generate.",
  lbl_voice: "Voice", lbl_engine: "Engine",
  eng_edge: "Edge TTS — free, recommended", eng_gtts: "gTTS — fallback", eng_local: "pyttsx3 — fully offline",
  eng_eleven: "ElevenLabs — needs API key", eng_openai: "OpenAI — needs API key",
  btn_tts: "Generate speech",
  clone_h2: "Voice cloning", clone_hint: "Upload a clean 3–15 second clip of a single speaker, then enter the text.",
  lbl_ref: "Reference voice", clone_ph: "Text to speak in the cloned voice…", lbl_lang: "Language", btn_clone: "Clone & generate",
  clone_note: "True local cloning when Coqui XTTS is installed, otherwise the closest matching voice (demo mode). Only clone voices with the speaker's permission.",
  stt_h2: "Transcription", stt_hint: "Upload audio or video to get text back.",
  lbl_file: "Audio / video", opt_ar: "Arabic", opt_en: "English", opt_auto: "Auto", btn_stt: "Transcribe",
  stt_wait: "Transcript will appear here…", stt_busy: "Transcribing…",
  dub_h2: "Video dubbing", dub_hint: "Transcribe → translate → re-voice. Video is re-muxed when ffmpeg is available.",
  lbl_media: "Media file", lbl_from: "From", lbl_to: "To", btn_dub: "Dub now",
  dub_wait: "Dubbing result will appear here…", dub_busy: "Dubbing… (transcribe → translate → voice)",
  dub_src: "SOURCE:", dub_out: "DUBBED:",
  book_h2: "Audiobook", book_hint: "Paste a chapter or a full short text — it is chunked, voiced and joined.",
  book_ph: "Paste your chapter here…", btn_book: "Produce audiobook",
  pill_checking: "Checking engines…", pill_tts: "TTS: ", pill_stt: "Local STT: ", pill_clone: "Local clone: ",
  pill_ffmpeg: "ffmpeg: ", state_on: "on", state_off: "off", pill_offline: "Backend offline — run: python run.py",
  alert_ref: "Please choose a reference audio file first.", alert_media: "Please choose a media file first.",
  alert_text: "Please paste some text first.", alert_fail: "Request failed",
  sample: "Welcome to SSV Studio — your local-first voice studio. Type anything and hear it spoken naturally."
},
ar: {
  title: "SSV Studio — استوديو الصوت المحلي",
  tagline: "استوديو صوت يعمل على جهازك — توليد صوت، استنساخ، تفريغ، دبلجة.",
  tab_tts: "توليد صوت", tab_clone: "استنساخ", tab_stt: "تفريغ", tab_dub: "دبلجة", tab_book: "كتاب صوتي",
  tts_h2: "تحويل النص إلى صوت", tts_hint: "اكتب أو الصق نصاً بالعربية أو الإنجليزية، اختر الصوت، وولّد.",
  lbl_voice: "الصوت", lbl_engine: "المحرك",
  eng_edge: "Edge TTS — مجاني، موصى به", eng_gtts: "gTTS — بديل", eng_local: "pyttsx3 — أوفلاين بالكامل",
  eng_eleven: "ElevenLabs — يحتاج مفتاح API", eng_openai: "OpenAI — يحتاج مفتاح API",
  btn_tts: "توليد الصوت",
  clone_h2: "استنساخ الصوت", clone_hint: "ارفع مقطعاً واضحاً من 3 إلى 15 ثانية لمتحدث واحد، ثم أدخل النص.",
  lbl_ref: "الصوت المرجعي", clone_ph: "النص المراد نطقه بالصوت المستنسخ…", lbl_lang: "اللغة", btn_clone: "استنساخ وتوليد",
  clone_note: "استنساخ محلي حقيقي عند تثبيت Coqui XTTS، وإلا أقرب صوت مطابق (وضع تجريبي). لا تستنسخ الأصوات إلا بإذن صاحبها.",
  stt_h2: "التفريغ الصوتي", stt_hint: "ارفع ملف صوت أو فيديو للحصول على النص.",
  lbl_file: "صوت / فيديو", opt_ar: "العربية", opt_en: "الإنجليزية", opt_auto: "تلقائي", btn_stt: "فرّغ",
  stt_wait: "سيظهر النص هنا…", stt_busy: "جارٍ التفريغ…",
  dub_h2: "دبلجة الفيديو", dub_hint: "تفريغ ← ترجمة ← توليد صوت. يُدمج الفيديو عند توفر ffmpeg.",
  lbl_media: "ملف الوسائط", lbl_from: "من", lbl_to: "إلى", btn_dub: "دبلج الآن",
  dub_wait: "ستظهر نتيجة الدبلجة هنا…", dub_busy: "جارٍ الدبلجة… (تفريغ ← ترجمة ← صوت)",
  dub_src: "الأصل:", dub_out: "المدبلج:",
  book_h2: "الكتاب الصوتي", book_hint: "الصق فصلاً أو نصاً كاملاً — يُقسّم ويُحوَّل إلى صوت ثم يُدمج.",
  book_ph: "الصق الفصل هنا…", btn_book: "إنتاج الكتاب الصوتي",
  pill_checking: "جارٍ فحص المحركات…", pill_tts: "TTS: ", pill_stt: "تفريغ محلي: ", pill_clone: "استنساخ محلي: ",
  pill_ffmpeg: "ffmpeg: ", state_on: "مفعّل", state_off: "مغلق", pill_offline: "الخادم متوقف — شغّل: python run.py",
  alert_ref: "اختر ملف الصوت المرجعي أولاً.", alert_media: "اختر ملف الوسائط أولاً.",
  alert_text: "الصق نصاً أولاً.", alert_fail: "فشل الطلب",
  sample: "أهلاً بك في SSV Studio — استوديو الصوت الذي يعمل على جهازك. اكتب أي نص واستمع إليه بصوت طبيعي."
},
fr: {
  title: "SSV Studio — Studio vocal local",
  tagline: "Studio vocal local — synthèse, clonage, transcription, doublage.",
  tab_tts: "Synthèse", tab_clone: "Clonage", tab_stt: "Transcription", tab_dub: "Doublage", tab_book: "Livre audio",
  tts_h2: "Synthèse vocale", tts_hint: "Écrivez ou collez un texte en arabe ou en anglais, choisissez une voix.",
  lbl_voice: "Voix", lbl_engine: "Moteur",
  eng_edge: "Edge TTS — gratuit, recommandé", eng_gtts: "gTTS — secours", eng_local: "pyttsx3 — 100 % hors ligne",
  eng_eleven: "ElevenLabs — clé API requise", eng_openai: "OpenAI — clé API requise",
  btn_tts: "Générer la voix",
  clone_h2: "Clonage de voix", clone_hint: "Importez un extrait clair de 3 à 15 secondes d'un seul locuteur, puis saisissez le texte.",
  lbl_ref: "Voix de référence", clone_ph: "Texte à prononcer avec la voix clonée…", lbl_lang: "Langue", btn_clone: "Cloner et générer",
  clone_note: "Clonage vraiment local si Coqui XTTS est installé, sinon voix la plus proche (mode démo). Ne clonez une voix qu'avec l'accord du locuteur.",
  stt_h2: "Transcription", stt_hint: "Importez un fichier audio ou vidéo pour obtenir le texte.",
  lbl_file: "Audio / vidéo", opt_ar: "Arabe", opt_en: "Anglais", opt_auto: "Auto", btn_stt: "Transcrire",
  stt_wait: "La transcription apparaîtra ici…", stt_busy: "Transcription en cours…",
  dub_h2: "Doublage vidéo", dub_hint: "Transcrire → traduire → redoubler. Vidéo réassemblée si ffmpeg est disponible.",
  lbl_media: "Fichier média", lbl_from: "De", lbl_to: "Vers", btn_dub: "Doubler",
  dub_wait: "Le résultat apparaîtra ici…", dub_busy: "Doublage en cours… (transcription → traduction → voix)",
  dub_src: "SOURCE :", dub_out: "DOUBLÉ :",
  book_h2: "Livre audio", book_hint: "Collez un chapitre — il est découpé, vocalisé puis assemblé.",
  book_ph: "Collez votre chapitre ici…", btn_book: "Produire le livre audio",
  pill_checking: "Vérification des moteurs…", pill_tts: "TTS : ", pill_stt: "STT local : ", pill_clone: "Clonage local : ",
  pill_ffmpeg: "ffmpeg : ", state_on: "oui", state_off: "non", pill_offline: "Backend hors ligne — lancez : python run.py",
  alert_ref: "Choisissez d'abord un fichier audio de référence.", alert_media: "Choisissez d'abord un fichier média.",
  alert_text: "Collez d'abord un texte.", alert_fail: "Échec de la requête",
  sample: "Bienvenue dans SSV Studio — votre studio vocal local. Écrivez un texte et écoutez-le avec une voix naturelle."
},
es: {
  title: "SSV Studio — Estudio de voz local",
  tagline: "Estudio de voz local — sintetiza, clona, transcribe, dobla.",
  tab_tts: "Sintetizar", tab_clone: "Clonar", tab_stt: "Transcribir", tab_dub: "Doblar", tab_book: "Audiolibro",
  tts_h2: "Texto a voz", tts_hint: "Escribe o pega texto en árabe o inglés, elige una voz y genera.",
  lbl_voice: "Voz", lbl_engine: "Motor",
  eng_edge: "Edge TTS — gratis, recomendado", eng_gtts: "gTTS — alternativa", eng_local: "pyttsx3 — totalmente sin conexión",
  eng_eleven: "ElevenLabs — requiere clave API", eng_openai: "OpenAI — requiere clave API",
  btn_tts: "Generar voz",
  clone_h2: "Clonación de voz", clone_hint: "Sube un clip claro de 3 a 15 segundos de un solo hablante y luego escribe el texto.",
  lbl_ref: "Voz de referencia", clone_ph: "Texto para hablar con la voz clonada…", lbl_lang: "Idioma", btn_clone: "Clonar y generar",
  clone_note: "Clonación realmente local si Coqui XTTS está instalado; si no, la voz más parecida (modo demo). Clona voces solo con permiso del hablante.",
  stt_h2: "Transcripción", stt_hint: "Sube un audio o video para obtener el texto.",
  lbl_file: "Audio / video", opt_ar: "Árabe", opt_en: "Inglés", opt_auto: "Auto", btn_stt: "Transcribir",
  stt_wait: "La transcripción aparecerá aquí…", stt_busy: "Transcribiendo…",
  dub_h2: "Doblaje de video", dub_hint: "Transcribir → traducir → redoblar. Video reensamblado si ffmpeg está disponible.",
  lbl_media: "Archivo multimedia", lbl_from: "De", lbl_to: "A", btn_dub: "Doblar ahora",
  dub_wait: "El resultado aparecerá aquí…", dub_busy: "Doblando… (transcripción → traducción → voz)",
  dub_src: "ORIGINAL:", dub_out: "DOBLADO:",
  book_h2: "Audiolibro", book_hint: "Pega un capítulo — se divide, se convierte en voz y se une.",
  book_ph: "Pega tu capítulo aquí…", btn_book: "Producir audiolibro",
  pill_checking: "Comprobando motores…", pill_tts: "TTS: ", pill_stt: "STT local: ", pill_clone: "Clon local: ",
  pill_ffmpeg: "ffmpeg: ", state_on: "sí", state_off: "no", pill_offline: "Backend sin conexión — ejecuta: python run.py",
  alert_ref: "Elige primero un archivo de audio de referencia.", alert_media: "Elige primero un archivo multimedia.",
  alert_text: "Pega primero un texto.", alert_fail: "La solicitud falló",
  sample: "Bienvenido a SSV Studio — tu estudio de voz local. Escribe cualquier texto y escúchalo con una voz natural."
},
de: {
  title: "SSV Studio — Lokales Voice-Studio",
  tagline: "Lokales Voice-Studio — synthetisieren, klonen, transkribieren, synchronisieren.",
  tab_tts: "Synthese", tab_clone: "Klonen", tab_stt: "Transkribieren", tab_dub: "Sync", tab_book: "Hörbuch",
  tts_h2: "Text zu Sprache", tts_hint: "Text auf Arabisch oder Englisch eingeben, Stimme wählen, generieren.",
  lbl_voice: "Stimme", lbl_engine: "Engine",
  eng_edge: "Edge TTS — kostenlos, empfohlen", eng_gtts: "gTTS — Fallback", eng_local: "pyttsx3 — komplett offline",
  eng_eleven: "ElevenLabs — API-Schlüssel nötig", eng_openai: "OpenAI — API-Schlüssel nötig",
  btn_tts: "Sprache generieren",
  clone_h2: "Stimmklonen", clone_hint: "Klaren 3–15-Sekunden-Clip eines einzelnen Sprechers hochladen, dann Text eingeben.",
  lbl_ref: "Referenzstimme", clone_ph: "Text für die geklonte Stimme…", lbl_lang: "Sprache", btn_clone: "Klonen & generieren",
  clone_note: "Echtes lokales Klonen mit Coqui XTTS, sonst ähnlichste Stimme (Demo-Modus). Stimmen nur mit Erlaubnis klonen.",
  stt_h2: "Transkription", stt_hint: "Audio oder Video hochladen, um den Text zu erhalten.",
  lbl_file: "Audio / Video", opt_ar: "Arabisch", opt_en: "Englisch", opt_auto: "Auto", btn_stt: "Transkribieren",
  stt_wait: "Transkript erscheint hier…", stt_busy: "Transkribiere…",
  dub_h2: "Video-Synchronisation", dub_hint: "Transkribieren → übersetzen → neu vertonen. Video wird mit ffmpeg neu gemuxt.",
  lbl_media: "Mediendatei", lbl_from: "Von", lbl_to: "Nach", btn_dub: "Jetzt synchronisieren",
  dub_wait: "Ergebnis erscheint hier…", dub_busy: "Synchronisiere… (Transkription → Übersetzung → Stimme)",
  dub_src: "ORIGINAL:", dub_out: "SYNCHRONISIERT:",
  book_h2: "Hörbuch", book_hint: "Kapitel einfügen — wird aufgeteilt, vertont und zusammengefügt.",
  book_ph: "Kapitel hier einfügen…", btn_book: "Hörbuch produzieren",
  pill_checking: "Engines werden geprüft…", pill_tts: "TTS: ", pill_stt: "Lokales STT: ", pill_clone: "Lokaler Klon: ",
  pill_ffmpeg: "ffmpeg: ", state_on: "an", state_off: "aus", pill_offline: "Backend offline — starte: python run.py",
  alert_ref: "Bitte zuerst eine Referenz-Audiodatei wählen.", alert_media: "Bitte zuerst eine Mediendatei wählen.",
  alert_text: "Bitte zuerst einen Text einfügen.", alert_fail: "Anfrage fehlgeschlagen",
  sample: "Willkommen bei SSV Studio — deinem lokalen Voice-Studio. Gib einen Text ein und höre ihn mit natürlicher Stimme."
}
};

let LANG = localStorage.getItem("ssv_lang") || "en";
if (!I18N[LANG]) LANG = "en";

function t(key) { return (I18N[LANG] && I18N[LANG][key]) || I18N.en[key] || key; }

function setLang(lang) {
  if (!I18N[lang]) return;
  LANG = lang;
  localStorage.setItem("ssv_lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = t("title");
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll(".lang-switch button").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
  // Replace the demo sample text only if it is still a default sample (don't touch user input)
  const ta = $("tts-text");
  const samples = Object.values(I18N).map(d => d.sample);
  if (!ta.value.trim() || samples.includes(ta.value)) ta.value = t("sample");
  loadEngines();
}

document.querySelectorAll(".tabs button").forEach(b => b.onclick = () => {
  document.querySelectorAll(".tabs button").forEach(x => x.classList.remove("active"));
  document.querySelectorAll(".card").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  $("tab-" + b.dataset.tab).classList.add("active");
});
document.querySelectorAll(".lang-switch button").forEach(b => b.onclick = () => setLang(b.dataset.lang));

function pill(text, ok) {
  const s = document.createElement("span");
  s.className = "pill " + (ok === true ? "ok" : ok === false ? "warn" : "dim");
  s.textContent = text;
  return s;
}

function loadEngines() {
  fetch("/api/engines").then(r => r.json()).then(e => {
    const box = $("engines");
    box.innerHTML = "";
    e.tts.forEach(x => box.appendChild(pill(t("pill_tts") + x, true)));
    box.appendChild(pill(t("pill_stt") + (e.stt_local ? t("state_on") : t("state_off")), !!e.stt_local));
    box.appendChild(pill(t("pill_clone") + (e.clone_local ? t("state_on") : t("state_off")), !!e.clone_local));
    box.appendChild(pill(t("pill_ffmpeg") + (e.ffmpeg ? t("state_on") : t("state_off")), !!e.ffmpeg));
    const v = $("tts-voice");
    if (!v.options.length) {
      [...e.voices_ar.map(x => [x, "AR · " + x]), ...e.voices_en.map(x => [x, "EN · " + x])]
        .forEach(([val, label]) => { const o = document.createElement("option"); o.value = val; o.textContent = label; v.appendChild(o); });
    }
  }).catch(() => { $("engines").innerHTML = ""; $("engines").appendChild(pill(t("pill_offline"), false)); });
}

function play(id, file) { const a = $(id); a.src = file; a.play().catch(() => {}); }

async function doTTS() {
  const btn = event.target; btn.disabled = true;
  try {
    const voice = $("tts-voice").value;
    const body = { text: $("tts-text").value, voice, engine: $("tts-engine").value, lang: voice.startsWith("ar") ? "ar" : "en" };
    const r = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json();
    if (j.file) play("tts-audio", j.file); else alert(j.detail || t("alert_fail"));
  } finally { btn.disabled = false; }
}

async function doClone() {
  if (!$("clone-ref").files[0]) return alert(t("alert_ref"));
  const fd = new FormData();
  fd.append("reference", $("clone-ref").files[0]);
  fd.append("text", $("clone-text").value);
  fd.append("lang", $("clone-lang").value);
  const r = await fetch("/api/clone", { method: "POST", body: fd });
  const j = await r.json();
  if (j.file) play("clone-audio", j.file); else alert(j.detail || t("alert_fail"));
}

async function doSTT() {
  if (!$("stt-file").files[0]) return alert(t("alert_media"));
  $("stt-out").textContent = t("stt_busy");
  const fd = new FormData();
  fd.append("audio", $("stt-file").files[0]);
  fd.append("language", $("stt-lang").value);
  const r = await fetch("/api/stt", { method: "POST", body: fd });
  const j = await r.json();
  $("stt-out").textContent = j.text || j.detail || t("alert_fail");
}

async function doDub() {
  if (!$("dub-file").files[0]) return alert(t("alert_media"));
  $("dub-out").textContent = t("dub_busy");
  const fd = new FormData();
  fd.append("media", $("dub-file").files[0]);
  fd.append("source_lang", $("dub-src").value);
  fd.append("target_lang", $("dub-tgt").value);
  const r = await fetch("/api/dub", { method: "POST", body: fd });
  const j = await r.json();
  if (j.file) { $("dub-out").textContent = t("dub_src") + "\n" + j.source_text + "\n\n" + t("dub_out") + "\n" + j.translated_text; play("dub-audio", j.file); }
  else $("dub-out").textContent = j.detail || t("alert_fail");
}

async function doBook() {
  if (!$("book-text").value.trim()) return alert(t("alert_text"));
  const body = { text: $("book-text").value, lang: "ar" };
  const r = await fetch("/api/audiobook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json();
  if (j.file) play("book-audio", j.file); else alert(j.detail || t("alert_fail"));
}

setLang(LANG);
