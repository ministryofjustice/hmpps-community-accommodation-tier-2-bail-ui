import { defineConfig, devices } from '@playwright/test'
import { config } from 'dotenv'
import { TestOptions } from './e2e-tests/testOptions'

config({
  path: `e2e.env`,
  override: true,
})

export default defineConfig<TestOptions>({
  testDir: './e2e-tests',
  outputDir: './e2e-tests/test_results',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  maxFailures: 2,
  workers: 1,
  reporter: [['html', { outputFolder: './e2e-tests/playwright-report/index.html' }]],
  timeout: process.env.CI ? 5 * 60 * 1000 : 2 * 60 * 1000,
  use: {
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setupDev',
      testMatch: /(^|\/)tests\/.*\.setup\.ts$/,
      use: { baseURL: 'https://community-accommodation-tier-2-bail-dev.hmpps.service.justice.gov.uk' },
    },
    {
      name: 'dev',
      testMatch: /(^|\/)tests\/.*\.(spec|test)\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://community-accommodation-tier-2-bail-dev.hmpps.service.justice.gov.uk',
      },
      dependencies: ['setupDev'],
    },
    {
      name: 'setupLocal',
      testMatch: /(^|\/)tests\/.*\.setup\.ts$/,
      use: {
        baseURL: 'http://localhost:3000',
      },
    },
    {
      name: 'local',
      testMatch: /(^|\/)tests\/.*\.(spec|test)\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
      dependencies: ['setupLocal'],
    },
    {
      name: 'workflow',
      testMatch: /workflow-tests\/.*\.(spec|test)\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://community-accommodation-tier-2-bail-dev.hmpps.service.justice.gov.uk',
      },
    },
  ],
})
