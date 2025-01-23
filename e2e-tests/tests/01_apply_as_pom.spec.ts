import { expect } from '@playwright/test'
import { test } from '../test'
import {
  completeAboutThePersonSection,
  completeAreaAndFundingSection,
  completeBeforeYouStartSection,
  completeCheckAnswersSection,
  completeOffenceInformationSection,
  completeRisksAndNeedsSection,
  completeBailInformationSection,
  confirmApplicant,
  enterPrisonerNumber,
  selectApplicationOrigin,
  startAnApplication,
  submitApplication,
  viewSubmittedApplication,
  addNote,
  viewInProgressDashboard,
  createAnInProgressApplication,
} from '../steps/apply'
import { signIn } from '../steps/signIn'
import { cancelAnApplication, clickCancel } from '../steps/cancelInProgressApplication'

test('create a CAS-2 bail application', async ({ page, person, pomUser }) => {
  await signIn(page, pomUser)
  await startAnApplication(page)
  await selectApplicationOrigin(page)
  await enterPrisonerNumber(page, person.nomsNumber)
  await confirmApplicant(page)
  await completeBeforeYouStartSection(page, person.name)
  await completeAreaAndFundingSection(page, person.name)
  await completeAboutThePersonSection(page, person.name)
  await completeRisksAndNeedsSection(page, person.name)
  await completeOffenceInformationSection(page, person.name)
  await completeBailInformationSection(page, person.name)
  await completeCheckAnswersSection(page, person.name)
  await expect(page.getByText('You have completed 18 of 18 tasks')).toBeVisible()
  await submitApplication(page)
})

test('add a note to a submitted application', async ({ page, person, pomUser }) => {
  await signIn(page, pomUser)
  await viewSubmittedApplication(page, person.name)
  await addNote(page)
  await expect(page.locator('.moj-timeline__title').first()).toContainText('Note')
})

test('cancel an in progress application from the task list', async ({ page, pomUser, person }) => {
  await signIn(page, pomUser)
  await createAnInProgressApplication(page, person)
  await viewInProgressDashboard(page)
  const numberOfApplicationsBeforeCancellation = (await page.locator('tr').all()).length
  await clickCancel(page, person.name)
  await cancelAnApplication(page, person.name)
  const numberOfApplicationsAfterCancellation = (await page.locator('tr').all()).length
  await expect(page.getByText('Your CAS-2 applications')).toBeVisible()
  expect(numberOfApplicationsBeforeCancellation - numberOfApplicationsAfterCancellation).toEqual(1)
})
