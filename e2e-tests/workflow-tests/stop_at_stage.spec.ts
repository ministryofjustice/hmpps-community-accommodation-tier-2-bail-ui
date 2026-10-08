import { expect } from '@playwright/test'
import test from '../test'
import {
  completeAboutThePersonSection,
  completeAreaAndFundingSection,
  completeBeforeYouStartForCustodyApplications,
  completeCheckAnswersSection,
  completeHealthNeedsSection,
  completeOffencesAndConcernsSection,
  confirmApplicant,
  enterCrn,
  startANewCohortApplication,
  submitApplication,
} from '../steps/apply'
import { updateStatus, viewSubmittedApplication, addNote, addAssessmentDetails } from '../steps/assess'
import signIn from '../steps/signIn'

function stopAtStage(stage: string): boolean {
  return process.env.STOP_AT_STAGE === stage
}

test('create, submit and assess a CAS2 application', async ({
  page,
  generatedPerson,
  nomisCourtUser,
  assessorUser,
}) => {
  test.skip(!generatedPerson.crn, 'only run via the stop-at-stage workflow')

  await signIn(page, nomisCourtUser)
  await startANewCohortApplication(page, 'other')
  await enterCrn(page, generatedPerson.crn)
  await confirmApplicant(page)
  await completeBeforeYouStartForCustodyApplications(page, generatedPerson.name)
  await completeAboutThePersonSection(page, generatedPerson.name, 'other')
  await completeAreaAndFundingSection(page, generatedPerson.name, 'other')
  await completeOffencesAndConcernsSection(page, generatedPerson.name, 'other')
  await completeHealthNeedsSection(page, generatedPerson.name, 'other')
  await completeCheckAnswersSection(page, generatedPerson.name)
  await expect(page.getByText('You have completed 16 of 16 tasks')).toBeVisible()
  if (stopAtStage('application-created')) return

  await submitApplication(page)

  if (stopAtStage('application-submitted')) return

  await page.goto('/sign-out')
  await signIn(page, assessorUser)
  await viewSubmittedApplication(page)
  await updateStatus(page)
  await addNote(page)
  await addAssessmentDetails(page)
})
