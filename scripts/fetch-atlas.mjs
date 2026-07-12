#!/usr/bin/env node
/**
 * Zero-dependency fetch of the pinned Atlas `ui-native` source into `vendor/`.
 *
 * Uses only system `git`. Atlas is consumed as read-only vendored source pinned to
 * a commit SHA for deterministic builds. Atlas itself is never modified.
 * See docs/atlas-integration.md and ADR-014 in .claude/decisions.md.
 *
 * Idempotent: if the vendored source already matches the pinned SHA, it does nothing
 * (and makes no network call).
 */
import { execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  cpSync,
  writeFileSync,
  readFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ── Pin (edit only to intentionally re-vendor a new Atlas ref) ──────────────────
const REPO = 'https://github.com/rizwan-uxd/atlas-design-system.git';
const SHA = '37be7e813d44686ad4d0c7a98c567e3945131382';
const SUBDIR = 'packages/ui-native';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dest = join(root, 'vendor', 'atlas-ui-native');
const pinFile = join(dest, '.atlas-pin.json');

const log = (m) => console.log(`[atlas-fetch] ${m}`);
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'pipe' });

// Idempotent: skip when already at the pinned SHA (no network).
if (existsSync(pinFile)) {
  try {
    if (JSON.parse(readFileSync(pinFile, 'utf8')).sha === SHA) {
      log(`already at ${SHA.slice(0, 7)} — skipping`);
      process.exit(0);
    }
  } catch {
    /* fall through and re-fetch */
  }
}

try {
  run('git --version');
} catch {
  console.error('[atlas-fetch] `git` is required to fetch the Atlas source.');
  process.exit(1);
}

log(`fetching ${SUBDIR} @ ${SHA.slice(0, 7)} …`);
const tmp = mkdtempSync(join(tmpdir(), 'atlas-'));
try {
  run('git init -q', tmp);
  run(`git remote add origin ${REPO}`, tmp);
  run(`git fetch -q --depth 1 origin ${SHA}`, tmp);
  run('git sparse-checkout init --cone', tmp);
  run(`git sparse-checkout set ${SUBDIR}`, tmp);
  run('git checkout -q FETCH_HEAD', tmp);

  const src = join(tmp, SUBDIR);
  if (!existsSync(src)) throw new Error(`subdir ${SUBDIR} missing after checkout`);

  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dirname(dest), { recursive: true });

  const SKIP = new Set(['node_modules', '.git', '.expo', 'package-lock.json']);
  cpSync(src, dest, {
    recursive: true,
    filter: (s) => !SKIP.has(s.split(/[\\/]/).pop()),
  });

  writeFileSync(
    pinFile,
    JSON.stringify(
      {
        repo: REPO,
        subdir: SUBDIR,
        sha: SHA,
        fetchedAt: new Date().toISOString(),
        note: 'Vendored read-only. Do NOT edit (equivalent to editing Atlas). Managed by scripts/fetch-atlas.mjs — ADR-014.',
      },
      null,
      2,
    ) + '\n',
  );
  log(`vendored → vendor/atlas-ui-native (pinned ${SHA.slice(0, 7)})`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
