import { Page, expect } from '@playwright/test'
import { faker } from '@faker-js/faker/locale/en_GB'

import {
  BeforeYouStartPage,
  DashboardPage,
  FindByPrisonNumberPage,
  FindByCrnPage,
  TaskListPage,
  ApplicationOriginPage,
} from '../pages/apply'
import {
  completeConsentTask,
  completeEligibilityTask,
  completeReferrerDetailsTask,
  completeSolicitorDetailsTask,
} from './beforeYouStartSection'
import {
  completeAddressHistoryTask,
  completeEqualityAndDiversityTask,
  completePersonalInformationTask,
} from './aboutThePersonSection'
import { completeHealthNeedsTask, completeRiskInformationTask } from './risksAndNeedsSection'
import { completeAreaInformationTask, completeFundingInformationTask } from './areaAndFundingSection'
import {
  completeProvideOffencesAndConvictionsDetailsTask,
  completeAllegedOffencesTask,
  completeCommunitySupervisionAndCurrentOffencesTask,
  completePreviousUnspentConvictionsTask,
} from './offenceAndLicenceInformationSection'
import completeCheckAnswersTask from './checkAnswersSection'
import { TestOptions } from '../testOptions'
import {
  completeBailConditionsAndSupportSessionsTask,
  completeBailHearingInformationTask,
} from './bailInformationSection'

export const startAnApplication = async (page: Page) => {
  // Start page
  // --------
  // visit the root url
  const dashboardPage = new DashboardPage(page)
  await dashboardPage.goto()

  // Follow link to 'new application'
  await dashboardPage.makeNewApplication()

  // // confirm that I'm ready to start
  const beforeYouStartPage = new BeforeYouStartPage(page)
  await beforeYouStartPage.startNow()
}

export const selectApplicationOrigin = async (page: Page, applicationOrigin: 'courtBail' | 'prisonBail') => {
  const applicationOriginPage = new ApplicationOriginPage(page)
  if (applicationOrigin === 'prisonBail') {
    await applicationOriginPage.choosePrisonBail()
  } else {
    await applicationOriginPage.chooseCourtBail()
  }
}

export const enterPrisonerNumber = async (page: Page, prisonNumber: string) => {
  const prisonNumberPage = new FindByPrisonNumberPage(page)
  await prisonNumberPage.enterPrisonNumber(prisonNumber)
  await prisonNumberPage.clickButton('Search for applicant')
}

export const enterCrn = async (page: Page, crn: string) => {
  const crnPage = new FindByCrnPage(page)
  await crnPage.enterCrn(crn)
  await crnPage.clickButton('Search for applicant')
}

export const confirmApplicant = async (page: Page) => {
  const confirmApplicantPage = new TaskListPage(page)
  await confirmApplicantPage.clickButton('Confirm and continue')
}

export const completeBeforeYouStartSection = async (page: Page, name: string) => {
  await completeEligibilityTask(page, name)
  await completeConsentTask(page, name)
  await completeReferrerDetailsTask(page)
  await completeSolicitorDetailsTask(page, name)
}

export const completeAreaAndFundingSection = async (page: Page, name: string) => {
  await completeAreaInformationTask(page, name)
  await completeFundingInformationTask(page)
}

export const completeAboutThePersonSection = async (page: Page, name: string) => {
  await completePersonalInformationTask(page, name)
  await completeEqualityAndDiversityTask(page, name)
  await completeAddressHistoryTask(page, name)
}

export const completeRisksAndNeedsSection = async (page: Page, name: string) => {
  await completeHealthNeedsTask(page, name)
  await completeRiskInformationTask(page, name)
}

export const completeOffenceInformationSection = async (page: Page, name: string) => {
  await completeProvideOffencesAndConvictionsDetailsTask(page, name)
  await completeAllegedOffencesTask(page, name)
  await completeCommunitySupervisionAndCurrentOffencesTask(page, name)
  await completePreviousUnspentConvictionsTask(page, name)
}

export const completeBailInformationSection = async (page: Page, name: string) => {
  await completeBailConditionsAndSupportSessionsTask(page, name)
  await completeBailHearingInformationTask(page, name)
}

export const completeCheckAnswersSection = async (page: Page, name: string) => {
  await completeCheckAnswersTask(page, name)
}

export const submitApplication = async (page: Page) => {
  await page.getByRole('link', { name: 'Submit application' }).click()
  await expect(page.locator('h1')).toContainText('Are you sure you want to submit the application?')
  await page.getByRole('button', { name: 'Yes, I am sure' }).click()
  await expect(page.locator('h1')).toContainText('Application submitted')
}

export const viewSubmittedApplication = async (page: Page, name: string) => {
  await page.goto('/applications#submitted')
  await expect(page.locator('h1')).toContainText('Your CAS-2 applications')
  await page.getByRole('link', { name }).first().click()
  await expect(page.locator('h1')).toContainText(name)
  await expect(page.locator('h2').first()).toContainText('Application history')
}

export const viewInProgressDashboard = async (page: Page) => {
  await page.goto('/applications')
}

export const addNote = async (page: Page) => {
  const note = faker.lorem.paragraph()
  await page.getByLabel('Add a note for the assessor', { exact: true }).fill(note)
  await page.getByTestId('submit-button').click()
  await expect(page.locator('h2').first()).toContainText('Success')
  await expect(page.locator('.moj-timeline__description').first()).toContainText(note)
  await expect(page.locator('.moj-timeline__title').first()).toContainText('Note')
}

export const checkAnApplicationByUserExists = async (page: Page, name: string) => {
  const tableRows = page.locator('.govuk-table__row')
  expect(tableRows.filter({ hasText: name }).first()).toBeVisible()
}

export const viewApplicationMadeByAnotherUser = async (page: Page, name: string) => {
  const tableRows = page.locator('.govuk-table__row')
  const rowWithOtherUser = tableRows.filter({ hasNotText: name }).last()
  await rowWithOtherUser.getByRole('link').click()
  await expect(page.locator('h2').first()).toContainText('Application history')
}

export const createAnInProgressApplication = async (
  page: Page,
  person: TestOptions['person'],
  applicationOrigin: 'courtBail' | 'prisonBail',
) => {
  await startAnApplication(page)
  await selectApplicationOrigin(page, applicationOrigin)
  if (applicationOrigin === 'courtBail') {
    await enterCrn(page, person.crn)
  } else {
    await enterPrisonerNumber(page, person.nomsNumber)
  }
  await confirmApplicant(page)
}
