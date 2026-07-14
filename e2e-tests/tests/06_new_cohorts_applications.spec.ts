import { expect } from '@playwright/test'
import test from '../test'
import signIn from '../steps/signIn'
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
  enterPrisonerNumber,
  selectBailApplicationOrigin,
  startANewCohortApplication,
  submitApplication,
} from '../steps/apply'

test('Create a CAS2 bail application', async ({ page, person, deliusPrisonUser }) => {
  await signIn(page, deliusPrisonUser)
  await startANewCohortApplication(page, 'bail')
  await selectBailApplicationOrigin(page, 'prisonBail')
  await enterPrisonerNumber(page, person.nomsNumber)
  await confirmApplicant(page)
  await completeBeforeYouStartSection(page, person.name)
  await completeAboutThePersonSection(page, person.name, 'bail')
  await completeAreaAndFundingSection(page, person.name, 'bail')
  await completeOffencesAndConcernsSection(page, person.name, 'bail')
  await completeHealthNeedsSection(page, person.name, 'bail')
  await completeBailInformationSection(page)
  await completeCheckAnswersSection(page, person.name)
  await expect(page.getByText('You have completed 18 of 18 tasks')).toBeVisible()
  await submitApplication(page)
})

test('Create a different CAS2 application', async ({ page, person, deliusProbationUser }) => {
  await signIn(page, deliusProbationUser)
  await startANewCohortApplication(page, 'other')
  await enterCrn(page, person.crn)
  await confirmApplicant(page)
  await completeBeforeYouStartForCustodyApplications(page, person.name)
  await completeAboutThePersonSection(page, person.name, 'other')
  await completeAreaAndFundingSection(page, person.name, 'other')
  await completeOffencesAndConcernsSection(page, person.name, 'other')
  await completeHealthNeedsSection(page, person.name, 'other')
  await completeCheckAnswersSection(page, person.name)
  await expect(page.getByText('You have completed 16 of 16 tasks')).toBeVisible()
  await submitApplication(page)
})
