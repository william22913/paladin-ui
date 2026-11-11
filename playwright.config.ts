import { defineConfig, devices } from '@playwright/test';

// Chromium is preinstalled in this environment rather than in Playwright's
// browser cache, so the launcher is pointed at it when the variable is set.
declare const process: { env: Record<string, string | undefined> };
const executablePath = process.env.NEXAI_CHROMIUM_PATH;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // The preview server is one small process; a handful of workers keeps runs stable.
  workers: 3,
  forbidOnly: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    // Keeps screenshots and assertions stable; the reduced-motion path is part of the design contract.
    reducedMotion: 'reduce',
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
