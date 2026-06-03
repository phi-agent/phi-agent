#!/usr/bin/env node
// phi — Launcher.
// Startet das gebündelte pi mit phi-spezifischen Extensions, AGENTS.md und Skills.
// Funktioniert von jedem Arbeitsverzeichnis aus.

import { spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ---- 1. Node-Version prüfen (>= 22.19.0) ----
const MIN_NODE = [22, 19, 0];
const cur = process.versions.node.split(".").map((n) => parseInt(n, 10));
const tooOld =
  cur[0] < MIN_NODE[0] ||
  (cur[0] === MIN_NODE[0] && cur[1] < MIN_NODE[1]) ||
  (cur[0] === MIN_NODE[0] && cur[1] === MIN_NODE[1] && cur[2] < MIN_NODE[2]);
if (tooOld) {
  console.error(
    `phi benötigt Node.js >= ${MIN_NODE.join(".")} (aktuell: ${process.versions.node}).\n` +
      `Installiere eine neuere Version via https://nodejs.org oder nvm: 'nvm install 22'.`,
  );
  process.exit(1);
}

// ---- 2. Paket-Wurzelverzeichnis auflösen ----
const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, "..");

// ---- 3. pi-CLI-Einstiegspunkt auflösen ----
const piPkgRoot = join(pkgRoot, "node_modules", "@earendil-works", "pi-coding-agent");
let piEntry;
try {
  const piPkgJson = JSON.parse(readFileSync(join(piPkgRoot, "package.json"), "utf-8"));
  const binRel = typeof piPkgJson?.bin === "string" ? piPkgJson.bin : piPkgJson?.bin?.pi;
  if (typeof binRel !== "string") throw new Error("pi package.json hat keinen bin.pi-Eintrag");
  piEntry = resolve(piPkgRoot, binRel);
} catch (err) {
  console.error(
    `phi: pi-CLI nicht gefunden unter ${piPkgRoot}.\n` +
      `Fehler: ${err?.message ?? err}\n` +
      `Versuch: npm install -g phi-agent`,
  );
  process.exit(1);
}
if (!existsSync(piEntry)) {
  console.error(
    `phi: pi nicht gefunden an ${piEntry}.\n` +
      `Versuch: npm install -g phi-agent`,
  );
  process.exit(1);
}

// ---- 4. Phi-Extensions automatisch erkennen ----
const extDir = join(pkgRoot, ".pi", "extensions");
const extArgs = [];
if (existsSync(extDir)) {
  // _shared ist eine Hilfsbibliothek, keine Extension — überspringen
  for (const name of readdirSync(extDir).sort()) {
    if (name === "_shared") continue;
    const subdir = join(extDir, name);
    const idx = join(subdir, "index.ts");
    try {
      if (statSync(subdir).isDirectory() && existsSync(idx)) {
        extArgs.push("--extension", idx);
      }
    } catch {
      // nicht lesbare Einträge überspringen
    }
  }
}

// ---- 5. pi-Argumente zusammensetzen ----
// --no-context-files : lokales AGENTS.md/CLAUDE.md ignorieren
// --no-extensions    : pi's Auto-Discovery ausschalten; nur unsere -e Flags laden
// --system-prompt    : <pkgRoot>/AGENTS.md laden
//
// Eigene Flags entfernen bevor wir an pi weiterleiten.
const userArgs = process.argv.slice(2).filter((a) => a !== "--no-update-check");
const agentsMd = join(pkgRoot, "AGENTS.md");
const piArgs = [
  "--no-context-files",
  "--no-extensions",
  ...(existsSync(agentsMd) ? ["--system-prompt", agentsMd] : []),
  ...extArgs,
  ...userArgs,
];

// ---- 6. pi-Version-Check-Banner unterdrücken ----
// pi ist eine interne Abhängigkeit; phi-Nutzer sollen keine pi-Update-Nags sehen.
if (process.env.PI_SKIP_VERSION_CHECK === undefined) {
  process.env.PI_SKIP_VERSION_CHECK = "1";
}

// ---- 7. quietStartup + lastChangelogVersion in pi's globalen Settings setzen ----
try {
  const agentDirEnv = process.env.PI_CODING_AGENT_DIR;
  let agentDir;
  if (agentDirEnv && agentDirEnv.trim().length > 0) {
    agentDir = agentDirEnv === "~"
      ? homedir()
      : agentDirEnv.startsWith("~/")
        ? homedir() + agentDirEnv.slice(1)
        : agentDirEnv;
  } else {
    agentDir = join(homedir(), ".pi", "agent");
  }
  mkdirSync(agentDir, { recursive: true });
  const globalSettingsPath = join(agentDir, "settings.json");
  let globalSettings = {};
  if (existsSync(globalSettingsPath)) {
    try {
      const parsed = JSON.parse(readFileSync(globalSettingsPath, "utf-8"));
      if (parsed && typeof parsed === "object") globalSettings = parsed;
    } catch {
      globalSettings = {};
    }
  }

  let bundledPiVersion;
  try {
    const piPkgJson = JSON.parse(
      readFileSync(join(piPkgRoot, "package.json"), "utf-8"),
    );
    if (typeof piPkgJson?.version === "string") bundledPiVersion = piPkgJson.version;
  } catch {
    // ignorieren
  }

  let mutated = false;
  if (globalSettings.quietStartup !== true) {
    globalSettings.quietStartup = true;
    mutated = true;
  }
  if (bundledPiVersion && globalSettings.lastChangelogVersion !== bundledPiVersion) {
    globalSettings.lastChangelogVersion = bundledPiVersion;
    mutated = true;
  }
  if (mutated) {
    writeFileSync(globalSettingsPath, JSON.stringify(globalSettings, null, 2));
  }
} catch {
  // Best-Effort; falls Schreibrechte fehlen, läuft pi trotzdem
}

// ---- 8. pi starten ----
const child = spawn(process.execPath, [piEntry, ...piArgs], {
  stdio: "inherit",
  cwd: process.cwd(),
  env: process.env,
});

const forward = (sig) => () => {
  try { child.kill(sig); } catch { /* Kind bereits tot */ }
};
process.on("SIGINT", forward("SIGINT"));
process.on("SIGTERM", forward("SIGTERM"));
process.on("SIGHUP", forward("SIGHUP"));

child.on("error", (err) => {
  console.error("phi: Fehler beim Start von pi:", err.message);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
