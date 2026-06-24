import { Page } from '@playwright/test'
import { fakerEN_GB as faker } from '@faker-js/faker'
import { addDays } from 'date-fns'
import { ApplyPage, TaskListPage } from '../pages/apply'
import CohortSelectionPage from '../pages/apply/cohortSelectionPage'
import { cohortLabels } from '../../server/utils/applicationUtils'
import CohortLicenceDetailsPage from '../pages/apply/cohortLicenceDetailsPage'

export const completeEligibilityTask = async (page: Page, name: string) => {
  const confirmEligibilityPage = await ApplyPage.initialize(page, `Confirm ${name} is eligible for CAS2 for bail`)

  await confirmEligibilityPage.checkRadio('Yes')
  await confirmEligibilityPage.clickConfirm()
}

export const completeNewCohortEligibilityTask = async (page: Page, name: string) => {
  const confirmEligibilityPage = await ApplyPage.initialize(page, `Confirm ${name} is eligible to apply`)

  await confirmEligibilityPage.checkRadio('Yes')
  await confirmEligibilityPage.clickConfirm()
}

export const completeConsentTask = async (page: Page, name: string) => {
  const confirmConsentPage = await ApplyPage.initialize(page, `Confirm ${name}'s consent`)

  await confirmConsentPage.checkRadio('Yes')
  await confirmConsentPage.fillDateFieldInGroup('When did they give consent?', {
    year: '2022',
    month: '3',
    day: '1',
  })
  await confirmConsentPage.clickConfirm()
}

export const completeCohortSelectionTask = async (page: Page, name: string) => {
  const cohortSelectionPage = await CohortSelectionPage.initialize(page, `Why does ${name} need CAS2 accommodation?`)
  await cohortSelectionPage.checkRadio(cohortLabels.atcr)
  await cohortSelectionPage.clickConfirm()

  const atcrLicenceDetailsPage = await CohortLicenceDetailsPage.initialize(page, `${name}'s licence`)

  const yesterday = addDays(new Date(), -1)
  const licenceStartDate = faker.date.recent({ days: 28, refDate: yesterday })

  await atcrLicenceDetailsPage.fillDateFieldInGroup(`What is ${name}'s licence start date/conditional release date?`, {
    year: licenceStartDate.getFullYear().toString(),
    month: (licenceStartDate.getMonth() + 1).toString(),
    day: licenceStartDate.getDate().toString(),
  })

  const tomorrow = addDays(new Date(), 1)
  const licenceEndDate = faker.date.soon({ days: 7, refDate: tomorrow })

  await atcrLicenceDetailsPage.fillDateFieldInGroup(`What is ${name}'s licence end date?`, {
    year: licenceEndDate.getFullYear().toString(),
    month: (licenceEndDate.getMonth() + 1).toString(),
    day: licenceEndDate.getDate().toString(),
  })

  await atcrLicenceDetailsPage.checkRadioInGroup(`Does ${name} have an HDC expiry date?`, 'No')

  await atcrLicenceDetailsPage.clickSave()
}

export const completeReferrerDetailsTask = async (page: Page) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add referrer details')

  await completeConfirmDetailsPage(page)
  await completeJobTitlePage(page)
  await completeContactNumberPage(page)
  await completeLocationPage(page)
}

export const completeNewCohortReferrerDetailsTask = async (page: Page, name: string) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add referrer details')

  await completeConfirmDetailsPage(page)
  await completeAreYouPractitionerPage(page, name)
  await completeContactNumberPage(page)
}

async function completeConfirmDetailsPage(page: Page) {
  const confirmDetailsPage = await ApplyPage.initialize(page, `Confirm your details`)

  await confirmDetailsPage.clickSave()
}

async function completeJobTitlePage(page: Page) {
  const jobTitlePage = await ApplyPage.initialize(page, `What is your job title?`)

  await jobTitlePage.fillField('What is your job title?', 'POM')

  await jobTitlePage.clickSave()
}

async function completeAreYouPractitionerPage(page: Page, name: string) {
  const areYouPractitionerPage = await ApplyPage.initialize(page, `Are you ${name}'s community probation practitioner?`)

  await areYouPractitionerPage.checkRadio('Yes')

  await areYouPractitionerPage.clickSave()
}

async function completeContactNumberPage(page: Page) {
  const confirmDetailsPage = await ApplyPage.initialize(page, `What is your contact telephone number?`)

  await confirmDetailsPage.fillField('What is your contact telephone number?', '12345')

  await confirmDetailsPage.clickSave()
}

async function completeLocationPage(page: Page) {
  const locationPage = await ApplyPage.initialize(page, `Where are you based?`)

  await locationPage.fillField('Where are you based?', 'Here')
  await locationPage.clickSave()
}

export const completeSolicitorDetailsTask = async (page: Page, name: string) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add solicitor details')

  await completeHasSolicitorPage(page, name)
  await completeSolicitorContactInformationPage(page)
}

async function completeHasSolicitorPage(page: Page, name: string) {
  const hasSolicitorPage = await ApplyPage.initialize(page, `Does ${name} have a solicitor?`)

  await hasSolicitorPage.checkRadio('Yes')
  await hasSolicitorPage.clickSave()
}

async function completeSolicitorContactInformationPage(page: Page) {
  const bailHearingContactPage = await ApplyPage.initialize(page, "Add solicitor's contact information")

  await bailHearingContactPage.fillField('Full name', 'Jay Legal')
  await bailHearingContactPage.fillField('Legal firm address', 'Legal Firm, 1 Winchester Road, X14 3UF')
  await bailHearingContactPage.fillField('Email address', 'jay@legal.com')
  await bailHearingContactPage.fillField('Phone number', '11111111111')
  await bailHearingContactPage.clickButton('Save and continue')
}
