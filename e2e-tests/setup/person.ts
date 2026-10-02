/* eslint-disable import/no-extraneous-dependencies, no-console */
import { expect, Page } from '@playwright/test'
import { createOffender } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender'
import { deliusPerson } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person'

export type GeneratedPerson = {
  crn: string
  name: string
}

const TEST_TEAM = {
  name: 'Community Accommodation Test Team',
  provider: 'London',
}

export const loginDelius = async (page: Page) => {
  await page.goto(process.env.DELIUS_URL as string, { waitUntil: 'domcontentloaded', timeout: 60_000 })

  const homePageTitle = 'National Delius Home Page'
  if ((await page.title()) === homePageTitle) {
    return
  }

  await expect(page).toHaveTitle(/National Delius - Login/)
  await page.fill('#j_username', process.env.DELIUS_USERNAME as string)
  await page.fill('#j_password', process.env.DELIUS_PASSWORD as string)
  await page.locator('.btn-primary', { hasText: 'Login' }).click({ noWaitAfter: true })
  await expect(page).toHaveTitle(homePageTitle, { timeout: 60_000 })
}

export const createTestPerson = async (page: Page): Promise<GeneratedPerson> => {
  await loginDelius(page)

  const person = deliusPerson()

  console.log(`Creating Delius offender for ${person.firstName} ${person.lastName}...`)
  const crn = await createOffender(page, { person, providerName: TEST_TEAM.provider })
  console.log(`Created Delius offender with CRN ${crn}`)

  return {
    crn,
    name: `${person.firstName} ${person.lastName}`,
  }
}
