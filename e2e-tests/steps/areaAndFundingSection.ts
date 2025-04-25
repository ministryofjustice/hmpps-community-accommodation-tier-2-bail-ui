import { Page } from '@playwright/test'
import { ApplyPage, TaskListPage } from '../pages/apply'

export const completeFundingInformationTask = async (page: Page) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Confirm funding and ID')

  await completeFundingInformationPage(page)
  await completeIDPage(page)
}

async function completeFundingInformationPage(page: Page) {
  const fundingInformationPage = await ApplyPage.initialize(page, 'Funding CAS-2 accommodation')

  await fundingInformationPage.checkRadio('Personal savings, salary or pension', true)
  await fundingInformationPage.checkRadioInGroup('Does the applicant have a National Insurance number?', 'Yes')
  await fundingInformationPage.checkRadioByTestId('receiving-benefits-radio-yes')
  await fundingInformationPage.checkRadioByTestId('received-benefit-sanctions-radio-yes')

  await fundingInformationPage.clickSave()
}

async function completeIDPage(page: Page) {
  const idPage = await ApplyPage.initialize(page, 'What identity document (ID) does the applicant have?')

  await idPage.checkCheckboxes(['Passport'])
  await idPage.clickSave()
}

export const completeAreaInformationTask = async (page: Page, name: string) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add exclusion zones and preferred areas')

  await completeFirstAreaInformationPage(page, name)
  await completeSecondAreaInformationPage(page, name)
  await completeOtherAreaPreferencesPage(page, name)
  await completeExclusionZonesPage(page, name)
  await completeGangAffiliations(page, name)
  await completeFamilyAccommodationPage(page, name)
}

async function completeFirstAreaInformationPage(page: Page, name: string) {
  const firstAreaInformationPage = await ApplyPage.initialize(page, `First preferred area for ${name}`)

  await firstAreaInformationPage.fillField('First preferred area', 'London')
  await firstAreaInformationPage.fillField('Reason for first preference', 'Family')

  await firstAreaInformationPage.clickSave()
}

async function completeSecondAreaInformationPage(page: Page, name: string) {
  const secondAreaInformationPage = await ApplyPage.initialize(page, `Second preferred area for ${name}`)

  await secondAreaInformationPage.fillField('Second preferred area', 'Birmingham')
  await secondAreaInformationPage.fillField('Reason for second preference', 'Job')

  await secondAreaInformationPage.clickSave()
}

async function completeOtherAreaPreferencesPage(page: Page, name: string) {
  const otherAreaPreferencesPage = await ApplyPage.initialize(page, `Other area preferences for ${name}`)

  await otherAreaPreferencesPage.fillField('Enter any other preference information', 'Preference information')

  await otherAreaPreferencesPage.clickSave()
}

async function completeExclusionZonesPage(page: Page, name: string) {
  const exclusionZonesPage = await ApplyPage.initialize(page, `Exclusion zones for ${name}`)

  await exclusionZonesPage.checkRadio('Yes')
  await exclusionZonesPage.fillField('Enter any safeguarding details', 'Avoid Liverpool')

  await exclusionZonesPage.clickSave()
}

async function completeGangAffiliations(page: Page, name: string) {
  const exclusionZonesPage = await ApplyPage.initialize(page, `Does ${name} have any gang affiliations?`)

  await exclusionZonesPage.checkRadioInGroup('any gang affiliations', 'Yes')
  await exclusionZonesPage.fillField('details of the gang', 'Gang name')
  await exclusionZonesPage.checkRadioInGroup('rival gangs', 'Yes')

  await exclusionZonesPage.clickSave()
}

async function completeFamilyAccommodationPage(page: Page, name: string) {
  const familyAccommodationPage = await ApplyPage.initialize(page, `Family accommodation for ${name}`)

  await familyAccommodationPage.checkRadio('Yes')

  await familyAccommodationPage.clickSave()
}
