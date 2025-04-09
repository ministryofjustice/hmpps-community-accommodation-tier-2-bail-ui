import { Page } from '@playwright/test'
import { ApplyPage, TaskListPage } from '../pages/apply'

export const completeHealthNeedsTask = async (page: Page, name: string) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add health needs')

  await completeLiaisonAndDiversionPage(page, name)
  await completeHealthNeedsInformationPage(page, name)
  await completeSubstanceMisusePage(page, name)
  await completePhysicalHealthPage(page, name)
  await completeMentalHealthPage(page, name)
  await completeCommunicationAndLanguagePage(page, name)
  await completeLearningDifficultiesPage(page, name)
  await completeBrainInjuryPage(page, name)
  await completeOtherHealthPage(page, name)
}

async function completeHealthNeedsInformationPage(page: Page, name: string) {
  const healthNeedsInformationPage = await ApplyPage.initialize(
    page,
    `Provide information about ${name}'s health needs`,
  )
  await healthNeedsInformationPage.clickButton('Confirm and continue')
}

async function completeSubstanceMisusePage(page: Page, name: string) {
  const substanceMisusePage = await ApplyPage.initialize(page, `Substance and alcohol use needs details for ${name}`)

  await substanceMisusePage.checkRadioInGroup('substance and alcohol use', 'No')
  await substanceMisusePage.checkRadioInGroup('substitute medication', 'No')
  await substanceMisusePage.checkRadioInGroup('engaged with a drug and alcohol service', 'No')
  await substanceMisusePage.checkRadioInGroup('intention to refer them to a drug and alcohol service', 'No')
  await substanceMisusePage.checkRadioInGroup('naloxone', 'No')

  await substanceMisusePage.clickSave()
}

async function completePhysicalHealthPage(page: Page, name: string) {
  const physicalHealthPage = await ApplyPage.initialize(page, `Physical and mobility needs details for ${name}`)

  await physicalHealthPage.checkRadioInGroup('physical and mobility needs', 'No')
  await physicalHealthPage.checkRadioInGroup('need any support', 'No')
  await physicalHealthPage.checkRadioInGroup('climb stairs', 'Yes')
  await physicalHealthPage.checkRadioInGroup('live independently', 'Yes')

  await physicalHealthPage.clickSave()
}

async function completeMentalHealthPage(page: Page, name: string) {
  const mentalHealthPage = await ApplyPage.initialize(page, `Mental health needs details for ${name}`)

  await mentalHealthPage.checkRadioInGroup('any mental health needs', 'No')
  await mentalHealthPage.checkRadioInGroup('need any support', 'No')
  await mentalHealthPage.checkRadioInGroup('receive any treatment', 'No')
  await mentalHealthPage.checkRadioInGroup('engaged with a mental health service', 'No')
  await mentalHealthPage.checkRadioInGroup('Will a referral be made', 'No')

  await mentalHealthPage.clickSave()
}

async function completeCommunicationAndLanguagePage(page: Page, name: string) {
  const communicationPage = await ApplyPage.initialize(page, `Communication and language needs details for ${name}`)

  await communicationPage.checkRadioInGroup('impairments', 'No')
  await communicationPage.checkRadioInGroup('interpreter', 'No')

  await communicationPage.clickSave()
}

async function completeLearningDifficultiesPage(page: Page, name: string) {
  const learningPage = await ApplyPage.initialize(
    page,
    `Learning difficulties and neurodiversity needs details for ${name}`,
  )

  await learningPage.checkRadioInGroup('learning difficulties or neurodiversity', 'No')
  await learningPage.checkRadioInGroup('need any support', 'No')
  await learningPage.checkRadioInGroup('receive any treatment', 'No')
  await learningPage.checkRadioInGroup('vulnerable', 'No')

  await learningPage.clickSave()
}

async function completeBrainInjuryPage(page: Page, name: string) {
  const brainInjuryPage = await ApplyPage.initialize(page, `Brain injury details for ${name}`)

  await brainInjuryPage.checkRadioInGroup('brain injury?', 'No')
  await brainInjuryPage.checkRadioInGroup('any support', 'No')
  await brainInjuryPage.checkRadioInGroup('treatment', 'No')
  await brainInjuryPage.checkRadioInGroup('vulnerable', 'No')
  await brainInjuryPage.checkRadioInGroup('difficulties interacting', 'No')

  await brainInjuryPage.clickSave()
}

async function completeLiaisonAndDiversionPage(page: Page, name: string) {
  const liaisonAndDiversionPage = await ApplyPage.initialize(page, `Liaison and Diversion Assessment for ${name}`)

  await liaisonAndDiversionPage.checkRadioInGroup('Liaison and Diversion Assessment', 'No')

  await liaisonAndDiversionPage.clickSave()
}

async function completeOtherHealthPage(page: Page, name: string) {
  const otherHealthPage = await ApplyPage.initialize(page, `Other health needs for ${name}`)

  await otherHealthPage.checkRadioInGroup('any long term health conditions?', 'No')
  await otherHealthPage.checkRadioInGroup('seizures', 'No')
  await otherHealthPage.checkRadioInGroup('experienced a stroke?', 'No')
  await otherHealthPage.checkRadioInGroup('treatment for cancer', 'No')
  await otherHealthPage.checkRadioInGroup('any other health needs?', 'No')

  await otherHealthPage.clickSave()
}

export const completeRiskInformationTask = async (page: Page, name: string) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add information about concerns to the applicant and others')

  await completeConcernsPage(page, name)
  await completeSelfHarmPage(page, name)
  await addAnAcct(page)
  await completeViolenceAndArsonPage(page, name)
  await completeLivingInTheCommunityPage(page, name)
  await completeSafetyOfStaffPage(page)
  await completeAdditionalConcernsPage(page)
  await completeRiskManagementArrangementsPage(page)
}

async function completeRiskManagementArrangementsPage(page: Page) {
  const riskManagementPage = await ApplyPage.initialize(page, `Risk management arrangements`)
  await riskManagementPage.checkCheckboxes(['No, they do not have risk management arrangements'])
  await riskManagementPage.clickSave()
}

async function completeConcernsPage(page: Page, name: string) {
  const concernsPage = await ApplyPage.initialize(page, `Add information about concerns to ${name} and others`)

  concernsPage.clickButton('Confirm and continue')
}

async function completeSelfHarmPage(page: Page, name: string) {
  const selfHarmPage = await ApplyPage.initialize(page, `Concerns of self-harm and suicide for ${name}`)

  await selfHarmPage.checkRadioInGroup('in the past?', 'No')
  await selfHarmPage.checkRadioInGroup('any current concerns of self-harm', 'No')
  await selfHarmPage.checkRadioInGroup('have any specific triggers', 'No')

  selfHarmPage.clickSave()
}

async function completeViolenceAndArsonPage(page: Page, name: string) {
  const violenceAndArsonPage = await ApplyPage.initialize(page, `Concerns related to violence or arson for ${name}`)

  await violenceAndArsonPage.checkRadioInGroup('violence or arson in the past?', 'No')
  await violenceAndArsonPage.checkRadioInGroup('around violence or arson?', 'No')

  violenceAndArsonPage.clickSave()
}

async function completeLivingInTheCommunityPage(page: Page, name: string) {
  const livingInTheCommunityPage = await ApplyPage.initialize(
    page,
    `Concerns related to ${name} living in the community`,
  )

  await livingInTheCommunityPage.checkRadioInGroup(
    'convictions or behaviours noted related to aggression or hate',
    'No',
  )
  await livingInTheCommunityPage.checkRadioInGroup('victim of violence, bullying, or intimidation', 'No')
  await livingInTheCommunityPage.checkRadioInGroup('any other concerns', 'No')
  await livingInTheCommunityPage.checkRadioInGroup('Cell Sharing Risk Assessment', 'No')

  livingInTheCommunityPage.clickSave()
}

async function completeSafetyOfStaffPage(page: Page) {
  const safetyOfStaffPage = await ApplyPage.initialize(page, 'Concerns related to the safety of staff')
  await safetyOfStaffPage.checkRadioInGroup('in the past', 'No')
  await safetyOfStaffPage.checkRadioInGroup('any current concerns', 'No')

  safetyOfStaffPage.clickSave()
}

async function completeAdditionalConcernsPage(page: Page) {
  const additionalConcernsPage = await ApplyPage.initialize(page, 'Add any additional concerns')

  await additionalConcernsPage.checkRadioInGroup(
    'any additional past or present concerns',
    'No, they do not have any additional concerns',
  )

  additionalConcernsPage.clickSave()
}

async function addAnAcct(page: Page) {
  const acctsPage = await ApplyPage.initialize(page, undefined)
  await acctsPage.clickButton('Add an Acct note')
  await completeAcctDataPage(page)
  await acctsPage.clickSave()
}

async function completeAcctDataPage(page: Page) {
  const acctDataPage = await ApplyPage.initialize(page, 'Add an ACCT entry')
  await acctDataPage.fillDateFieldInGroup('When was the ACCT created?', { year: '2022', month: '3', day: '1' })
  await acctDataPage.checkRadio('Yes')
  await acctDataPage.fillField('Referring institution', 'HMPPS Sheffield')
  await acctDataPage.fillField('Details about the ACCT', 'some details')
  await acctDataPage.clickButton('Save and add ACCT')
}
