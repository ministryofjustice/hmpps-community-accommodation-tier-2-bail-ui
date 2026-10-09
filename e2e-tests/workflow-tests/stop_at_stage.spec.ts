import { expect } from '@playwright/test'
import test from '../test'
import {
  completeAboutThePersonSection,
  completeAreaAndFundingSection,
  completeBailInformationSection,
  completeBeforeYouStartForCustodyApplications,
  completeBeforeYouStartSection,
  completeCheckAnswersSection,
  completeHealthNeedsSection,
  completeOffencesAndConcernsSection,
  confirmApplicant,
  enterCrn,
  selectBailApplicationOrigin,
  startANewCohortApplication,
  submitApplication,
} from '../steps/apply'
import { updateStatus, viewSubmittedApplication, addNote, addAssessmentDetails } from '../steps/assess'
import signIn from '../steps/signIn'

function applicationType(): 'bail' | 'other' {
  return process.env.APPLICATION_TYPE === 'bail' ? 'bail' : 'other'
}
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

  const type = applicationType()
  const isBail = type === 'bail'
  const expectedTaskCount = isBail ? '18 of 18' : '16 of 16'

  await signIn(page, nomisCourtUser)
  await startANewCohortApplication(page, type)

  if (isBail) {
    await selectBailApplicationOrigin(page, 'courtBail')
  }
  await enterCrn(page, generatedPerson.crn)
  await confirmApplicant(page)

  if (isBail) {
    await completeBeforeYouStartSection(page, generatedPerson.name)
  } else {
    await completeBeforeYouStartSection(page, generatedPerson.name)
  }

  await completeBeforeYouStartForCustodyApplications(page, generatedPerson.name)
  await completeAboutThePersonSection(page, generatedPerson.name, type)
  await completeAreaAndFundingSection(page, generatedPerson.name, type)
  await completeOffencesAndConcernsSection(page, generatedPerson.name, type)
  await completeHealthNeedsSection(page, generatedPerson.name, type)

  if (isBail) {
    await completeBailInformationSection(page)
  }

  await completeCheckAnswersSection(page, generatedPerson.name)
  await expect(page.getByText(`You have completed ${expectedTaskCount} tasks`)).toBeVisible()
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
