// Loads .env for the content scripts, from every place this project actually
// keeps one, and says out loud which providers ended up configured.
//
// WHY THIS EXISTS
//
// `import "dotenv/config"` reads exactly one file: `.env` in process.cwd().
// This site runs from two directories, and that is the whole bug:
//
//   /root/iluxury            the git checkout, where the scripts are run
//   /var/www/iluxuryegypt    the live site, where the server runs
//
// The server loads /var/www/iluxuryegypt/.env, so a key added there works for
// the admin "Suggest Photo" button immediately. The scripts are run from
// /root/iluxury and load /root/iluxury/.env, which did not have the key. Every
// run therefore printed "unsplash: no API key configured, skipped" while the
// key sat, correctly spelled, in the other file.
//
// Nothing about the variable name or the import order was ever wrong, which is
// why reading the code did not show it. Below, the scripts read both files.

import fs from "fs";
import path from "path";
import dotenv from "dotenv";

/** Where this project keeps .env files, in the order they should win. */
export function envCandidates(): string[] {
  const repoRoot = path.resolve(import.meta.dirname, "..", "..");
  return [
    // An explicit override always wins, for anyone with a different layout.
    process.env.ENV_FILE?.trim() || "",
    path.join(process.cwd(), ".env"),
    path.join(repoRoot, ".env"),
    "/var/www/iluxuryegypt/.env",
  ].filter(Boolean);
}

export interface EnvReport {
  /** Files that existed and were read, in the order they were applied. */
  loaded: string[];
  /** Files that were looked for and are not there. Not an error. */
  absent: string[];
  /** Variable names this run took from a file other than the first one read. */
  filledFromFallback: string[];
}

let cached: EnvReport | null = null;

/**
 * Reads every candidate .env, first file wins per variable.
 *
 * dotenv does not overwrite a variable that is already set, so applying the
 * files in priority order gives "the local .env decides, the others fill the
 * gaps". That is what makes a key living only in the live site's .env reach a
 * script run from the git checkout, without the live site's DATABASE_URL
 * quietly overriding the one the operator meant to use.
 */
export function loadScriptEnv(): EnvReport {
  if (cached) return cached;

  const loaded: string[] = [];
  const absent: string[] = [];
  const filledFromFallback: string[] = [];
  const seen = new Set<string>();

  for (const file of envCandidates()) {
    const resolved = path.resolve(file);
    if (seen.has(resolved)) continue;
    seen.add(resolved);

    if (!fs.existsSync(resolved)) { absent.push(resolved); continue; }

    const before = new Set(Object.keys(process.env));
    const result = dotenv.config({ path: resolved });
    if (result.error) { absent.push(`${resolved} (unreadable: ${result.error.message})`); continue; }

    loaded.push(resolved);
    if (loaded.length > 1) {
      for (const key of Object.keys(result.parsed ?? {})) {
        if (!before.has(key)) filledFromFallback.push(`${key} (from ${resolved})`);
      }
    }
  }

  cached = { loaded, absent, filledFromFallback };
  return cached;
}

/**
 * One block at the top of a run saying where configuration came from and which
 * providers are usable. A run that silently skips its best provider is the
 * failure this is here to make impossible to miss.
 */
export function printEnvReport(report: EnvReport, keys: Record<string, string>): void {
  console.log("Environment:");
  if (report.loaded.length === 0) {
    console.log("  no .env file found in any of:");
    for (const f of envCandidates()) console.log(`    ${path.resolve(f)}`);
  } else {
    for (const f of report.loaded) console.log(`  read ${f}`);
  }
  for (const entry of report.filledFromFallback) console.log(`  picked up ${entry}`);

  const names = Object.keys(keys);
  const have = names.filter((n) => keys[n]);
  const missing = names.filter((n) => !keys[n]);
  console.log(`  keys present: ${have.join(", ") || "none"}`);
  if (missing.length > 0) console.log(`  keys missing: ${missing.join(", ")}`);
}

/**
 * Loaded when this module is first imported, so an entry script can put
 *
 *   import { ENV_REPORT } from "./lib/script-env";
 *
 * above its database import and have the connection string, and every API key,
 * already in process.env by the time anything reads them.
 */
export const ENV_REPORT: EnvReport = loadScriptEnv();
