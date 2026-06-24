import test from '../test'
import signIn from '../steps/signIn'
import {
  completeAboutThePersonSection,
  completeAreaAndFundingSection,
  completeBeforeYouStartForCustodyApplications,
  completeBeforeYouStartSection,
  confirmApplicant,
  enterCrn,
  enterPrisonerNumber,
  selectBailApplicationOrigin,
  startANewCohortApplication,
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
})

test('Create a different CAS2 application', async ({ page, person, deliusPrisonUser }) => {
  await signIn(page, deliusPrisonUser)
  await startANewCohortApplication(page, 'other')
  await enterCrn(page, person.crn)
  await confirmApplicant(page)
  await completeBeforeYouStartForCustodyApplications(page, person.name)
  await completeAboutThePersonSection(page, person.name, 'other')
  await completeAreaAndFundingSection(page, person.name, 'other')
})
