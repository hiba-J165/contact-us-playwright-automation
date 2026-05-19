// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 180000,

  expect: {
    timeout: 20000,
  },

  fullyParallel: false,
  workers: 1,

  reporter: [
    ['list'],
    ['html'],
  ],

  use: {
    channel: 'chrome',

    viewport: {
      width: 1280,
      height: 850,
    },

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    launchOptions: {
      slowMo: 700,
      args: [
        '--window-size=1280,900',
        '--force-device-scale-factor=1',
      ],
    },
  },

  projects: [
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: {
          width: 1280,
          height: 850,
        },
      },
    },
  ],
});