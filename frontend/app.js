const $ = id => document.getElementById(id);

document.querySelectorAll(".tabs button").forEach(b => b.onclick = () => {
  document.querySelectorAll(".tabs button").forEach(x => x.classList.remove("active"));
  document.querySelectorAll(".card").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  $("tab-" + b.dataset.tab).classList.add("active");
});

function pill(text, ok) {
  const s = document.createElement("span");
  s.className = "pill " + (ok === true ? "ok" : ok === false ? "warn" : "dim");
  s.textContent = text;
  return s;
}

fetch("/api/engines").then(r => r.json()).then(e => {
  const box = $("engines");
  box.innerHTML = "";
  e.tts.forEach(t => box.appendChild(pill("TTS: " + t, true)));
  box.appendChild(pill("Local STT: " + (e.stt_local ? "on" : "off"), !!e.stt_local));
  box.appendChild(pill("Local clone: " + (e.clone_local ? "on" : "off"), !!e.clone_local));
  box.appendChild(pill("ffmpeg: " + (e.ffmpeg ? "on" : "off"), !!e.ffmpeg));
  const v = $("tts-voice");
  [...e.voices_ar.map(x => [x, "AR · " + x]), ...e.voices_en.map(x => [x, "EN · " + x])]
    .forEach(([val, label]) => { const o = document.createElement("option"); o.value = val; o.textContent = label; v.appendChild(o); });
}).catch(() => { $("engines").innerHTML = "<span class='pill warn'>Backend offline — run: python run.py</span>"; });

function play(id, file) { const a = $(id); a.src = file; a.play().catch(() => {}); }
async function fail(res) { try { const j = await res.json(); alert(j.detail || "Request failed"); } catch { alert("Request failed"); } }

async function doTTS() {
  const btn = event.target; btn.disabled = true;
  try {
    const voice = $("tts-voice").value;
    const body = { text: $("tts-text").value, voice, engine: $("tts-engine").value, lang: voice.startsWith("ar") ? "ar" : "en" };
    const r = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json();
    if (j.file) play("tts-audio", j.file); else alert(j.detail || "Failed");
  } finally { btn.disabled = false; }
}

async function doClone() {
  if (!$("clone-ref").files[0]) return alert("Please choose a reference audio file first.");
  const fd = new FormData();
  fd.append("reference", $("clone-ref").files[0]);
  fd.append("text", $("clone-text").value);
  fd.append("lang", $("clone-lang").value);
  const r = await fetch("/api/clone", { method: "POST", body: fd });
  const j = await r.json();
  if (j.file) play("clone-audio", j.file); else alert(j.detail || "Failed");
}

async function doSTT() {
  if (!$("stt-file").files[0]) return alert("Please choose an audio/video file first.");
  $("stt-out").textContent = "Transcribing…";
  const fd = new FormData();
  fd.append("audio", $("stt-file").files[0]);
  fd.append("language", $("stt-lang").value);
  const r = await fetch("/api/stt", { method: "POST", body: fd });
  const j = await r.json();
  $("stt-out").textContent = j.text || j.detail || "Failed";
}

async function doDub() {
  if (!$("dub-file").files[0]) return alert("Please choose a media file first.");
  $("dub-out").textContent = "Dubbing… (transcribe → translate → voice)";
  const fd = new FormData();
  fd.append("media", $("dub-file").files[0]);
  fd.append("source_lang", $("dub-src").value);
  fd.append("target_lang", $("dub-tgt").value);
  const r = await fetch("/api/dub", { method: "POST", body: fd });
  const j = await r.json();
  if (j.file) { $("dub-out").textContent = "SOURCE:\n" + j.source_text + "\n\nDUBBED:\n" + j.translated_text; play("dub-audio", j.file); }
  else $("dub-out").textContent = j.detail || "Failed";
}

async function doBook() {
  if (!$("book-text").value.trim()) return alert("Please paste some text first.");
  const body = { text: $("book-text").value, lang: "ar" };
  const r = await fetch("/api/audiobook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json();
  if (j.file) play("book-audio", j.file); else alert(j.detail || "Failed");
}
