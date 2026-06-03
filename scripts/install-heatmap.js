/* eslint-disable no-console */
import 'dotenv/config';
import { spawnSync } from 'node:child_process';

function isEnabled(value) {
  return /^(1|true|yes)$/i.test(value?.trim() || '');
}

const shouldInstall = isEnabled(process.env.HEATMAP_INSTALL);
const endpoint = process.env.PLAYWRIGHT_URL?.trim();
const isVercel = process.env.VERCEL === '1';

if (!shouldInstall) {
  process.exit(0);
}

if (endpoint) {
  console.log('Skipping local heatmap browser install because PLAYWRIGHT_URL is set.');
  process.exit(0);
}

if (isVercel) {
  console.log('Skipping local heatmap browser install on Vercel. Use PLAYWRIGHT_URL for heatmap snapshots.');
  process.exit(0);
}

const command = process.platform === 'win32' ? 'playwright.cmd' : 'playwright';
const result = spawnSync(command, ['install', 'chromium', '--no-shell'], {
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
