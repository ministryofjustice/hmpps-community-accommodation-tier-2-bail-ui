import { Page } from '@playwright/test'
import { ApplyPage, TaskListPage } from '../pages/apply'

export const completeProvideOffencesAndConvictionsDetailsTask = async (page: Page, name: string) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Provide offences and convictions details')

  await completeOffencesAndConvictionsGuidancePage(page, name)
}

export const completeAddProbationSupervisionDetailsTask = async (page: Page, name: string) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add probation supervision details')

  await completeSupervisedByProbationPage(page, name)
  await completeCPPDetailsPage(page, name)
  await completeContactedCppAboutCurrentRiskLevelsPage(page, name)
  await completeSeriousHarmRiskLevelsPage(page)
}

export const completeAllegedOffencesTask = async (page: Page, name: string) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add alleged offences')

  await completeAllegedOffenceDetailsPage(page, name)
  await completeAllegedOffencesPage(page, name)
  await completeAllegedOffencesSummaryPage(page, name)
}

async function completeOffencesAndConvictionsGuidancePage(page: Page, name: string) {
  const offencesAndConvictionsGuidancePage = await ApplyPage.initialize(
    page,
    `${name}'s current alleged offences and previous convictions`,
  )

  await offencesAndConvictionsGuidancePage.clickButton('Save and continue')
}

async function completeAllegedOffenceDetailsPage(page: Page, name: string) {
  const allegedOffenceDetailsPage = await ApplyPage.initialize(page, `Add ${name}'s current alleged offences`)
  await allegedOffenceDetailsPage.fillField('Current alleged offence name', 'Stalking')
  await allegedOffenceDetailsPage.fillDateFieldInGroup('When did the alleged offence take place?', {
    year: '2022',
    month: '3',
    day: '1',
  })
  await allegedOffenceDetailsPage.clickButton('Save and continue')
}

async function completeAllegedOffencesPage(page: Page, name: string) {
  const allegedOffencesPage = await ApplyPage.initialize(page, `View ${name}'s current alleged offences`)
  await allegedOffencesPage.clickButton('Save and continue')
}

async function completeAllegedOffencesSummaryPage(page: Page, name: string) {
  const allegedOffencesSummaryPage = await ApplyPage.initialize(
    page,
    `Add a summary of ${name}'s current alleged offences`,
  )
  await allegedOffencesSummaryPage.fillField(
    `Add a summary of ${name}'s current alleged offences`,
    'an offence summary',
  )
  await allegedOffencesSummaryPage.clickButton('Save and continue')
}

async function completeSupervisedByProbationPage(page: Page, name: string) {
  const supervisedByProbationPage = await ApplyPage.initialize(page, `Is ${name} currently supervised by probation?`)
  await supervisedByProbationPage.checkRadio('Yes')
  await supervisedByProbationPage.clickButton('Save and continue')
}

async function completeCPPDetailsPage(page: Page, name: string) {
  const cppDetailsPage = await ApplyPage.initialize(page, `Who is ${name}'s Community Probation Practitioner (CPP)?`)
  await cppDetailsPage.fillField('Full name', 'A. CPP')
  await cppDetailsPage.fillField('Probation region', 'south')
  await cppDetailsPage.fillField('Contact email address', 'an@email.gov.uk')
  await cppDetailsPage.fillField('Contact number', '12345')
  await cppDetailsPage.clickSave()
}

async function completeContactedCppAboutCurrentRiskLevelsPage(page: Page, name: string) {
  const contactedCppAboutCurrentRiskLevelsPage = await ApplyPage.initialize(
    page,
    `Have you contacted the CPP about ${name}'s current risk levels?`,
  )
  await contactedCppAboutCurrentRiskLevelsPage.checkRadio('Yes')
  await contactedCppAboutCurrentRiskLevelsPage.fillDateFieldInGroup('When did you contact them?', {
    year: '2024',
    month: '10',
    day: '11',
  })
  await contactedCppAboutCurrentRiskLevelsPage.clickSave()
}

async function completeSeriousHarmRiskLevelsPage(page: Page) {
  const seriousHarmRiskLevelsPage = await ApplyPage.initialize(
    page,
    'Confirm the current risk levels as discussed with the CPP',
  )
  await seriousHarmRiskLevelsPage.checkRadioInGroup('risk to children', 'Low risk')
  await seriousHarmRiskLevelsPage.checkRadioInGroup('risk to the public', 'Medium risk')
  await seriousHarmRiskLevelsPage.checkRadioInGroup('risk to known adults', 'High risk')
  await seriousHarmRiskLevelsPage.checkRadioInGroup('risk to staff', 'Very high risk')
  await seriousHarmRiskLevelsPage.checkRadioInGroup('overall risk', 'High risk')

  await seriousHarmRiskLevelsPage.clickSave()
}

export const completePreviousUnspentConvictionsTask = async (page: Page) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add previous unspent convictions')

  await completeAnyPreviousConvictionsPage(page)
}

async function completeAnyPreviousConvictionsPage(page: Page) {
  const anyPreviousConvictionsPage = await ApplyPage.initialize(page, `Check any previous unspent convictions`)
  await anyPreviousConvictionsPage.checkRadio('No, they do not have any previous unspent convictions')
  await anyPreviousConvictionsPage.clickSave()
}
