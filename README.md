# φ phi

**Eine local-model-first Pi-Distribution — optimiert für llama.cpp.
Persönlicher KI-Assistent, General-Purpose, Deutsch.**

phi ist eine persönliche Distribution des [pi]-Coding-Agenten, gebaut auf den
Schultern von [little-coder]. phi ist kein Fork — pi ist eine npm-Abhängigkeit,
und der gesamte phi-Mehrwert lebt in Extensions, Skills und Konfiguration.

> ⚠️ **phi ist ein persönliches Projekt.** Der Fokus liegt auf dem, was für mich
> funktioniert. Du darfst gerne forken und anpassen — aber erwarte keinen
> Community-Support wie bei little-coder oder pi.

## Motivation

Warum noch eine Pi-Distribution? Weil:

1. **Local-First, aber mit Schwerpunkt auf llama.cpp.** Ollama ist philosophisch
   und technisch zu weit entfernt von phi's Zielen. Der Fokus liegt auf llama.cpp
   und llamafile — und auf den erweiterten Funktionen, die diese Backends bieten
   (Context-Caching, LoRA-Adapter, Control Vectors, GBNF, Logit-Biases).
2. **General Purpose, nicht nur Coding.** phi soll ein arme-Leute-KI-Assistent
   sein — Dateien organisieren, Hardware überwachen, Desktop-Automatisierung,
   System-Admin, Notizen verwalten, wiederkehrende Aufgaben automatisieren.
3. **Deutsch als Hauptsprache.** Skills, Dokumentation und Interaktion sind
   auf Deutsch — weniger mentaler Load für deutschsprachige Nutzer.
4. **Baustein für phi's DNA: little-coder-Ideen + eigene Experimente.** 
   little-coder's Extension-Architektur (Write-Guard, Read-Guard, Skill-Inject,
   Output-Parser, Quality-Monitor, Thinking-Budget, Permission-Gate, etc.) wird
   übernommen und erweitert.

## Installation

**Voraussetzung:** Node.js ≥ 22.19.0

```bash
npm install -g @mounta11n/phi-agent
```

Oder mit bun:

```bash
bun add -g @mounta11n/phi-agent
```

## Verwendung

```bash
cd ~/dein-projekt
phi --model llamacpp/qwen3.6-35b-a3b
```

Oder mit Cloud-Modellen:

```bash
phi --model anthropic/claude-sonnet-4-5
phi --model openai/gpt-4o-mini "Was macht dieser Code?"
phi --list-models
```

### Lokales Modell (llama.cpp)

```bash
# llama.cpp Server starten (siehe little-coder-Doku für Details)
build/bin/llama-server -m ~/models/Qwen3.6-35B-A3B-UD-Q4_K_M.gguf \
   --host 127.0.0.1 --port 8888 --jinja \
   -c 16384 -ngl 99 --n-cpu-moe 999 --flash-attn on

# phi starten
export LLAMACPP_API_KEY=noop
phi --model llamacpp/qwen3.6-35b-a3b
```

## Was phi anders macht

### Im Vergleich zu pi

| Aspekt | pi | phi |
|--------|----|-----|
| Fokus | Minimales Agent-Substrat | Local-First Distribution |
| Extensions | Keine gebündelt | 20+ aus little-coder + eigene |
| Skills | Keine gebündelt | 30+ Skill-Markdowns (tools, knowledge, protocols) |
| Zielgruppe | Entwickler | Persönlicher Assistent |
| Sprache | Englisch | Deutsch |
| Provider | Alle Cloud + Lokal | llamba.cpp-first |

### Im Vergleich zu little-coder

| Aspekt | little-coder | phi |
|--------|-------------|-----|
| Fokus | Coding mit kleinen lokalen Modellen | General-Purpose persönlicher Assistent |
| Sprache | Englisch | Deutsch |
| Backend | llamba.cpp + Ollama + LM Studio | llamba.cpp + llamafile (kein Ollama-Support) |
| Zielgruppe | Forschung / Benchmark-Enthusiasten | Persönlicher Alltagsgebrauch |
| Coding | Primärfokus | Empfohlen: little-coder stattdessen nutzen |

## Projektstruktur

```
phi-agent/
├── bin/phi.mjs                # Launcher (startet pi mit phi-Konfiguration)
├── AGENTS.md                  # System-Prompt (Deutsch)
├── .pi/
│   ├── extensions/            # TypeScript-Extensions (von little-coder übernommen)
│   │   ├── branding/          # phi-Startbildschirm
│   │   ├── write-guard/       # Write verweigert bei existierenden Dateien
│   │   ├── read-guard/        # Kappt Lesevorgänge die Context-Window sprengen
│   │   ├── extra-tools/       # Zusätzliche Tools (glob, webfetch, websearch)
│   │   ├── skill-inject/      # Pro-Runde Skill-Auswahl
│   │   ├── output-parser/     # Repariert fehlerhafte Tool-Aufrufe
│   │   ├── quality-monitor/   # Erkennt leere/halluzinierte/schleifende Antworten
│   │   ├── thinking-budget/   # Begrenzt Thinking-Tokens
│   │   ├── permission-gate/   # Bash-Whitelist
│   │   ├── checkpoint/        # Snapshots vor Write/Edit
│   │   ├── tool-gating/       # Erzwingt _allowed_tools
│   │   ├── turn-cap/          # Maximale Runden begrenzen
│   │   ├── shell-session/     # ShellSession-Tools
│   │   ├── browser/           # Playwright-Browser-Tools
│   │   ├── evidence/          # Evidenz-Speicher
│   │   └── evidence-compact/  # Evidenz über Kompaktierung hinweg erhalten
│   └── settings.json          # Per-Modell-Profile
├── skills/                    # Skill-Markdowns (in Deutsch)
│   ├── tools/                 # Tool-Usage-Anleitungen
│   ├── knowledge/             # Algorithmus-Spickzettel
│   └── protocols/             # Workflow-Protokolle
├── models.json                # Provider-Registrierung
├── package.json               # npm-Paket (pi als dependency)
└── NOTICE                     # Lizenz-Hinweise
```

## Lizenz

Apache 2.0 — siehe [LICENSE](LICENSE) und [NOTICE](NOTICE).

phi baut auf [pi] und [little-coder] auf, beide Apache 2.0 lizenziert.

[pi]: https://pi.dev
[little-coder]: https://github.com/itayinbarr/little-coder
