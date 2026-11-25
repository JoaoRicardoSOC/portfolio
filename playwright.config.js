import { defineConfig } from '@playwright/test';

// CHROME_PATH permite usar um Chromium/Edge já instalado (sem baixar navegador).
const launchOptions = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};

export default defineConfig({
  testDir: 'testes',
  testMatch: /.*\.spec\.js/,
  timeout: 90_000,
  workers: 2,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4173',
    launchOptions,
  },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: 'npm run build && npx vite preview --port 4173 --strictPort', url: 'http://localhost:4173', reuseExistingServer: true, timeout: 120_000 },
});
