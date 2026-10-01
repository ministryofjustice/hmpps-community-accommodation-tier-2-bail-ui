import { expect } from '@playwright/test'
import test from '../test'
import {
  completeAboutThePersonSection,
  completeAreaAndFundingSection,
  completeBailInformationSection,
  completeBeforeYouStartSection,
  completeCheckAnswersSection,
  completeHealthNeedsSection,
  completeOffencesAndConcernsSection,
  confirmApplicant,
  enterCrn,
  selectBailApplicationOrigin,
  startAnApplication,
  startANewCohortApplication,
  submitApplication,
} from '../steps/apply'
import { updateStatus, viewSubmittedApplication, addNote, addAssessmentDetails } from '../steps/assess'
import signIn from '../steps/signIn'
import config from '../../server/config'

function stopAtStage(stage: string): boolean {
  return process.env.STOP_AT_STAGE === stage
}

test('create, submit and assess a CAS-2 Bail court bail application for a generated person', async ({
  page,
  generatedPerson,
  nomisCourtUser,
  assessorUser,
}) => {
  test.skip(!generatedPerson.crn, 'only run via the create-cas2-bail-application workflow')

  await signIn(page, nomisCourtUser)
  if (config.flags.cas2IsrEnabled) {
    await startANewCohortApplication(page, 'bail')
  } else {
    await startAnApplication(page)
  }
  await selectBailApplicationOrigin(page, 'courtBail')
  await enterCrn(page, generatedPerson.crn)
  await confirmApplicant(page)

  await completeBeforeYouStartSection(page, generatedPerson.name)
  await completeAboutThePersonSection(page, generatedPerson.name, 'bail')
  await completeAreaAndFundingSection(page, generatedPerson.name, 'bail')
  await completeOffencesAndConcernsSection(page, generatedPerson.name, 'bail')
  await completeHealthNeedsSection(page, generatedPerson.name, 'bail')
  await completeBailInformationSection(page)
  await completeCheckAnswersSection(page, generatedPerson.name)
  await expect(page.getByText('You have completed 18 of 18 tasks')).toBeVisible()

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
