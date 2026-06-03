# Roadmap — phi

> **Stand:** v0.1.0  
> **Status:** Persönliches Projekt. Fokus liegt auf dem was für mich (phi-agent) funktioniert.
> Diese Roadmap ist eine Ideensammlung, kein Versprechen.

## 🎯 Philosophie

phi ist der **Poor-man's-ai-companion** — ein lokaler, llama.cpp-first General-Purpose-Assistent.
Im Gegensatz zu pi (minimales Substrat) und little-coder (Coding-Fokus) ist phi breiter aufgestellt:
System-Admin, Dateiorganisation, Hardware-Kontext, Desktop-Automatisierung.

Für reine Coding-Projekte: little-coder empfehlen.

---

## 🧱 Phase 1: Fundament (v0.1.x) ← *Hier sind wir*

- [x] pi als npm-Dependency + Launcher
- [x] Wichtigste little-coder-Extensions übernommen und adaptiert
- [x] `PHI_*`-Env-Vars statt `LITTLE_CODER_*`
- [x] `PHI_MODELS_FILE`-Override-Pfad unter `~/.config/phi/`
- [ ] Skills ins Deutsche übersetzen (tools/, knowledge/, protocols/)
- [ ] Basis-Dokumentation in Deutsch fertigstellen

---

## 🚀 Phase 2: llama.cpp-Potenzial ausschöpfen

### Context-Caching optimieren
- [ ] llamba.cpp's system-wide KV-Cache (--no-kv-offload) für Session-übergreifendes Caching
- [ ] Cache-Tiering: was bleibt im VRAM, was wandert in RAM
- [ ] Integration mit pi's extension lifecycle (`before_provider_request`) um Cache-Strategien zu steuern

### LoRA-Adapter
- [ ] Dynamisches LoRA-Switching: je nach Aufgabe (coding → coding-lora, deutsch → deutsch-lora)
- [ ] phi-eigene Trainings-Pipeline für Task-spezifische LoRAs
- [ ] Nutzung von `POST /lora-adapters` (llama.cpp API)

### Control Vectors
- [ ] Steuerung von Verhalten/Stil via Control Vectors (z. B. "präzise Antworten", "kreative Antworten")
- [ ] Automatische Aktivierung je nach Task-Typ

### GBNF & Logit-Biases
- [ ] llamba.cpp's GBNF-Grammatiken für strukturierte Outputs (JSON-Schema-Erzwingung)
- [ ] Tool-Call-Grammatiken statt freiem Text → weniger Parsing-Fehler
- [ ] Logit-Biases für "sichere" Token (z. B. `rm` nie als erstes Token)

---

## 🌐 Phase 3: GGML-Ökosystem

- [ ] **whisper.cpp** — Sprach-zu-Text für Diktat/Transkription
- [ ] **stable-diffusion.cpp** — Bildgenerierung lokal
- [ ] **all-MiniLM-L6.cpp** — Lokales Embedding für RAG/Suche
- [ ] **qwen-tts.cpp** — Text-zu-Sprache, lokal
- [ ] **llamafile** — Single-File-Deployment, kein Build-Schritt

---

## 💻 Phase 4: General-Purpose-Features

### Hardware-Kontext
- [ ] VRAM/RAM-Belegung abfragen (nvidia-smi, nvtop, /proc/meminfo)
- [ ] CPU/GPU-Temperaturen & Lüfter (sensors, asitop, etc.)
- [ ] Bewusstsein für lokale Ressourcen → Model-Auswahl danach richten

### Desktop-Automation
- [ ] **macOS**: osascript für AppleScript/System Events
- [ ] **Linux**: xdotool / ydotool für Fenster-/Tastatur-Steuerung
- [ ] Dateiverwaltung: wiederkehrende Aufgaben (sortieren, umbenennen, Duplikate)

### Persönliche Organisation
- [ ] Dateisystem-Strukturen verstehen und navigieren
- [ ] Erinnerungen/Notizen verwalten (in Kombination mit lokalen Dateien)
- [ ] Wiederkehrende Aufgaben automatisieren (Cron, launchd)

---

## 🔬 Phase 5: Forschung & Optimierung

- [ ] Auf little-coders Forschung aufbauen:
  - Qualitäts-Monitor verbessern (Loop-Erkennung, Halluzinations-Detektion)
  - Output-Parser robuster machen
  - Thinking-Budget dynamisch anpassen (nicht nur hartes Cap)
- [ ] Experimente mit extrem kleinen Modellen (< 3B) für einfache Tasks
- [ ] Benchmark-Setup für phi (angepasst auf General-Purpose statt Coding)

---

## 📦 Release-Philosophie

- v0.x.y: Persönliche Nutzung, Breaking Changes jederzeit möglich
- v1.0.0: Sobald die Kern-Extensions stabil sind und pi als dependency "einfach so" updated werden kann
- Kein festes Release-Datum — phi erscheint wenn eine Idee reif ist
