import { defineConfig, devices } from '@playwright/test';

// End-to-end tests run against the production build, in the locally
// installed Chrome (no browser download needed).
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  // Each park test renders the game with WebGL; two browsers at a time keeps
  // slower machines from timing out.
  workers: 2,
  use: {
    baseURL: 'http://localhost:4173',
    channel: 'chrome',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    { name: 'phone', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
