import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'
import { TestOptions } from './e2e-tests/testOptions'

export default defineConfig<TestOptions>({
  testDir: './e2e-tests/tests',
  outputDir: './e2e-tests/test_results',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  maxFailures: 1,
  workers: 1,
  reporter: [['html', { outputFolder: './e2e-tests/playwright-report/index.html' }]],
  timeout: process.env.CI ? 5 * 60 * 1000 : 2 * 60 * 1000,
  use: {
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'setupDev',
      testMatch: /.*\.setup\.ts/,
      use: { baseURL: 'https://community-accommodation-tier-2-bail-dev.hmpps.service.justice.gov.uk' },
    },
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://community-accommodation-tier-2-bail-dev.hmpps.service.justice.gov.uk',
      },
      dependencies: ['setupDev'],
    },
    {
      name: 'setupLocal',
      testMatch: /.*\.setup\.ts/,
      use: {
        baseURL: 'http://localhost:3000',
        pomUser: {
          name: 'Prison Officer',
          username: 'POM_USER',
          password: 'password123456',
        },
        lcaUser: {
          name: 'LCA User',
          username: 'CAS2_LICENCE_USER',
          password: 'password123456',
        },
        adminUser: {
          name: 'CAS2 Admin',
          username: 'CAS2_ADMIN_USER',
          password: 'password123456',
        },
        assessorUser: {
          name: 'CAS2 Assessor',
          username: 'CAS2_ASSESSOR_USER',
          password: 'password123456',
        },
        nomisCourtUser: {
          name: 'CAS2 Bail NOMIS Court',
          username: 'CAS2V2_NOMIS_CB',
          password: 'password123456'
        },
        nomisPrisonUser: {
          name: 'CAS2 Bail NOMIS Prison',
          username: 'CAS2V2_NOMIS_PB',
          password: 'password123456'
        }
      },
    },
    {
      name: 'local',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
        person: {
          name: 'Aadland Bertrand',
          crn: 'X320741',
          nomsNumber: 'A1234AI',
        },
        personWithoutOasys: {
          name: 'James Brown',
          crn: 'C246139',
          nomsNumber: 'A1234AJ',
        },
        pomUser: {
          name: 'Prison Officer',
          username: 'POM_USER',
          password: 'password123456',
        },
        lcaUser: {
          name: 'Licence Case-Admin',
          username: 'CAS2_LICENCE_USER',
          password: 'password123456',
        },
        adminUser: {
          name: 'CAS2 Admin',
          username: 'CAS2_ADMIN_USER',
          password: 'password123456',
        },
        assessorUser: {
          name: 'CAS2 Assessor',
          username: 'CAS2_ASSESSOR_USER',
          password: 'password123456',
        },
        miUser: {
          name: 'MI User',
          username: 'CAS2_MI_USER',
          password: 'password123456',
        },
        nomisCourtUser: {
          name: 'CAS2 Bail NOMIS Court',
          username: 'CAS2V2_NOMIS_CB',
          password: 'password123456'
        },
        nomisPrisonUser: {
          name: 'CAS2 Bail NOMIS Prison',
          username: 'CAS2V2_NOMIS_PB',
          password: 'password123456'
        }
      },
      dependencies: ['setupLocal'],
    },
  ],
})
