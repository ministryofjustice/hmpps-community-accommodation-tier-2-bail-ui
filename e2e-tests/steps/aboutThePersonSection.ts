import { Page } from '@playwright/test'
import { ApplyPage, TaskListPage } from '../pages/apply'

export const completeEqualityAndDiversityTask = async (page: Page, name: string) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add equality and diversity monitoring information')

  await completeWillAnswerQuestionsPage(page, name)

  await completeDisabilityPage(page, name)

  await completeSexAndGenderPage(page)

  await completeSexualOrientationPage(page, name)

  await completeEthnicGroupPage(page, name)

  await completeWhiteBackgroundPage(page, name)

  await completeReligionPage(page, name)

  await completeMilitaryVeteranPage(page, name)

  await completeCareLeaverPage(page, name)

  await completeParentalOrCarerResponsibilitiesPage(page, name)

  await completeMaritalStatusPage(page, name)
}

async function completeMaritalStatusPage(page: Page, name: string) {
  const maritalStatusPage = await ApplyPage.initialize(
    page,
    `What is ${name}'s legal marital or registered civil partnership status?`,
  )
  await maritalStatusPage.checkRadio('Married', true)
  await maritalStatusPage.clickSave()
}

async function completeParentalOrCarerResponsibilitiesPage(page: Page, name: string) {
  const parentalOrCarerResponsibilitiesPage = await ApplyPage.initialize(
    page,
    `Does ${name} have parental or carer responsibilities?`,
  )
  await parentalOrCarerResponsibilitiesPage.checkRadio('Yes', true)
  await parentalOrCarerResponsibilitiesPage.clickSave()
}

async function completeCareLeaverPage(page: Page, name: string) {
  const careLeaverPage = await ApplyPage.initialize(page, `Is ${name} a care leaver?`)
  await careLeaverPage.checkRadio('Yes', true)
  await careLeaverPage.clickSave()
}

async function completeMilitaryVeteranPage(page: Page, name: string) {
  const militaryVeteranPage = await ApplyPage.initialize(page, `Is ${name} a military veteran?`)
  await militaryVeteranPage.checkRadio('Yes', true)
  await militaryVeteranPage.clickSave()
}

async function completeReligionPage(page: Page, name: string) {
  const religionPage = await ApplyPage.initialize(page, `What is ${name}'s religion?`)
  await religionPage.checkRadio('Agnostic', true)
  await religionPage.clickSave()
}

async function completeWhiteBackgroundPage(page: Page, name: string) {
  const whiteBackgroundPage = await ApplyPage.initialize(
    page,
    `Which of the following best describes ${name}'s White background?`,
  )
  await whiteBackgroundPage.checkRadio('Irish', true)
  await whiteBackgroundPage.clickSave()
}

async function completeEthnicGroupPage(page: Page, name: string) {
  const ethnicGroupPage = await ApplyPage.initialize(page, `What is ${name}'s ethnic group?`)
  await ethnicGroupPage.checkRadio('White', true)
  await ethnicGroupPage.clickSave()
}

async function completeSexualOrientationPage(page: Page, name: string) {
  const sexualOrientationPage = await ApplyPage.initialize(
    page,
    `Which of the following best describes ${name}'s sexual orientation?`,
  )
  await sexualOrientationPage.checkRadio('Gay', true)
  await sexualOrientationPage.clickSave()
}

async function completeSexAndGenderPage(page: Page) {
  const sexandGenderPage = await ApplyPage.initialize(page, 'Sex and gender identity')
  await sexandGenderPage.checkRadio('Male', true)
  await sexandGenderPage.checkRadio('Yes')
  await sexandGenderPage.clickSave()
}

async function completeDisabilityPage(page: Page, name: string) {
  const disabilityPage = await ApplyPage.initialize(page, `Does ${name} have a disability?`)

  await disabilityPage.checkRadio('No', true)
  await disabilityPage.clickSave()
}

async function completeWillAnswerQuestionsPage(page: Page, name: string) {
  const willAnswerEqualityQuestionsPage = await ApplyPage.initialize(page, `Equality questions for ${name}`)
  await willAnswerEqualityQuestionsPage.checkRadio('Yes')
  await willAnswerEqualityQuestionsPage.clickSave()
}

export const completeAddressHistoryTask = async (page: Page, name: string) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add address history')

  await completePreviousAddressPage(page, name)
}

async function completePreviousAddressPage(page: Page, name: string) {
  const previousAddressPage = await ApplyPage.initialize(
    page,
    `Did ${name} have a fixed address before being arrested?`,
  )
  await previousAddressPage.checkRadio('Yes')
  await previousAddressPage.fillField('Enter their last fixed address', '1 Example Road, Anytown, AB1 2CD')
  await previousAddressPage.checkRadio('supported accommodation')

  await previousAddressPage.clickSave()
}

export const completePersonalInformationTask = async (page: Page, name: string) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add personal information')

  await completeCustodyLocationPage(page, name)
  await completeWorkingMobilePhonePage(page, name)
  await completeImmigrationStatusPage(page, name)
  await completeGenderPage(page, name)
  await completePregnancyPage(page, name)
}

async function completeCustodyLocationPage(page: Page, name: string) {
  const custodyLocationPage = await ApplyPage.initialize(page, `Where is ${name} being held in custody?`)

  await custodyLocationPage.fillField(`Where is ${name} being held in custody?`, 'The Old Bailey')
  await custodyLocationPage.clickSave()
}

async function completeGenderPage(page: Page, name: string) {
  const genderPage = await ApplyPage.initialize(
    page,
    `Is the gender ${name} identifies with the same as the sex registered at birth?`,
  )

  await genderPage.checkRadio('Yes')
  await genderPage.clickSave()
}

async function completePregnancyPage(page: Page, name: string) {
  const pregnancyPage = await ApplyPage.initialize(page, `Is ${name} pregnant?`)

  await pregnancyPage.checkRadio("I don't know")
  await pregnancyPage.clickSave()
}

async function completeWorkingMobilePhonePage(page: Page, name: string) {
  const pageTitle = `Will ${name} have a working mobile phone?`
  const workingMobilePhonePage = await ApplyPage.initialize(page, pageTitle)

  await workingMobilePhonePage.checkRadioByTestId('hasWorkingMobilePhone-yes')
  await workingMobilePhonePage.fillField('What is their mobile number? (Optional)', '11111111111')
  await workingMobilePhonePage.checkRadioByTestId('isSmartPhone-yes')

  await workingMobilePhonePage.clickSave()
}

async function completeImmigrationStatusPage(page: Page, name: string) {
  const immigrationStatusPage = await ApplyPage.initialize(page, `What is ${name}'s immigration status?`)

  await immigrationStatusPage.chooseSelectItemByTestId('immigrationStatus', 'UK citizen')

  await immigrationStatusPage.clickSave()
}
