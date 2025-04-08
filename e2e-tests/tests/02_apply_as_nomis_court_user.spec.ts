import { expect } from '@playwright/test'
import test from '../test'
import {
  completeAboutThePersonSection,
  completeAreaAndFundingSection,
  completeBeforeYouStartSection,
  completeCheckAnswersSection,
  completeOffenceInformationSection,
  completeRisksAndNeedsSection,
  completeBailInformationSection,
  confirmApplicant,
  enterCrn,
  selectApplicationOrigin,
  startAnApplication,
  submitApplication,
  viewSubmittedApplication,
  addNote,
  viewInProgressDashboard,
  createAnInProgressApplication,
} from '../steps/apply'
import signIn from '../steps/signIn'
import { cancelAnApplication, clickCancel } from '../steps/cancelInProgressApplication'

test('create a CAS-2 bail application', async ({ page, person, nomisCourtUser }) => {
  await signIn(page, nomisCourtUser)
  await startAnApplication(page)
  await selectApplicationOrigin(page, 'courtBail')
  await enterCrn(page, person.crn)
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

test('add a note to a submitted application', async ({ page, person, nomisCourtUser }) => {
  await signIn(page, nomisCourtUser)
  await viewSubmittedApplication(page, person.name)
  await addNote(page)
  await expect(page.locator('.moj-timeline__title').first()).toContainText('Note')
})

test('cancel an in progress application from the task list', async ({ page, nomisCourtUser, person }) => {
  await signIn(page, nomisCourtUser)
  await createAnInProgressApplication(page, person, 'courtBail')
  await viewInProgressDashboard(page)
  await clickCancel(page, person.name)
  await cancelAnApplication(page, person.name)
  await expect(page.getByText('Your CAS-2 applications')).toBeVisible()
  await expect(page.locator('h2').first()).toContainText('Success')
  await expect(page.locator('h3').first()).toContainText(`The application for ${person.name} has been cancelled.`)
})
