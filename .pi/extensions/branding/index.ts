import type { ExtensionAPI, Theme } from "@earendil-works/pi-coding-agent";
import { readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Ersetzt pi's built-in Startbildschirm + Terminal-Titel mit phi-Branding.
//
// Kombiniert mit `.pi/settings.json` `"quietStartup": true`, das pi's eigenen
// Header UND den Resource-Dump unterdrückt. Power-User können `phi --verbose`
// nutzen um quietStartup zu überschreiben.

const TAGLINE = "Poor-man's-ai-companion · local-first, llama.cpp-optimiert";

// Phi-Akzent — "cyan" #00BFFF (tiefes Himmelblau). Als 24-bit Truecolor SGR
// emittiert, unabhängig vom aktiven pi-Theme.
const CYAN = "\x1b[38;2;0;191;255m";
const cyanFg = (s: string): string => `${CYAN}${s}\x1b[39m`;

function readVersion(): string {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const pkgPath = join(here, "..", "..", "..", "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    if (typeof pkg?.version === "string" && pkg.version.length > 0) return pkg.version;
  } catch {
    // best-effort
  }
  return "0.0.0";
}

const VERSION = readVersion();

function buildHeader(theme: Theme): string[] {
  const logo =
    cyanFg("φ ") +
    theme.bold("phi") +
    cyanFg("▌") +
    theme.fg("dim", ` v${VERSION}`);
  const tagline = theme.fg("muted", TAGLINE);
  const dim = (s: string) => theme.fg("dim", s);
  const sep = theme.fg("muted", " · ");
  const hints = [
    `${dim("esc")} abbrechen`,
    `${dim("ctrl-l/ctrl-c")} leeren/beenden`,
    `${dim("/")} befehle`,
    `${dim("!")} bash`,
    `${dim("ctrl-r")} mehr`,
  ].join(sep);
  return ["", logo, tagline, "", hints, ""];
}

function setTitleForCwd(setTitle: (t: string) => void, cwd: string): void {
  setTitle(`phi - ${basename(cwd)}`);
}

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    if (!ctx.hasUI) return;

    ctx.ui.setHeader((_tui, theme) => ({
      render(_width: number): string[] {
        return buildHeader(theme);
      },
      invalidate() {},
    }));

    setTitleForCwd(ctx.ui.setTitle.bind(ctx.ui), ctx.cwd);
  });

  pi.on("turn_start", async (_event, ctx) => {
    if (!ctx.hasUI) return;
    setTitleForCwd(ctx.ui.setTitle.bind(ctx.ui), ctx.cwd);
  });

  pi.on("turn_end", async (_event, ctx) => {
    if (!ctx.hasUI) return;
    setTitleForCwd(ctx.ui.setTitle.bind(ctx.ui), ctx.cwd);
  });
}
