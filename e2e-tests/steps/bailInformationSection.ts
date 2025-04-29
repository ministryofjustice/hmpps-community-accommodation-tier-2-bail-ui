import { Page } from '@playwright/test'
import { ApplyPage, TaskListPage } from '../pages/apply'

export const completeBailConditionsTask = async (page: Page, name: string) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add bail conditions')

  await completeNonStandardBailConditionsPage(page, name)
}

export const completeBailHearingInformationTask = async (page: Page, name: string) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add bail hearing information')

  await completeBailHearingDatePage(page, name)
  await completeCourtNamePage(page, name)
  await completeBailHearingMediumPage(page, name)
}

async function completeBailHearingMediumPage(page: Page, name: string) {
  const bailHearingMediumPage = await ApplyPage.initialize(page, `How will ${name}'s bail hearing be heard?`)
  await bailHearingMediumPage.checkRadio('Video link')
  await bailHearingMediumPage.clickButton('Save and continue')
}

async function completeBailHearingDatePage(page: Page, name: string) {
  const bailHearingDatePage = await ApplyPage.initialize(page, `When is ${name}'s bail hearing?`)
  await bailHearingDatePage.fillDateFieldInGroup(`When is ${name}'s bail hearing?`, {
    year: '2022',
    month: '3',
    day: '1',
  })
  await bailHearingDatePage.clickButton('Save and continue')
}

async function completeCourtNamePage(page: Page, name: string) {
  const courtNamePage = await ApplyPage.initialize(
    page,
    `What's the name of the court where ${name}'s bail hearing will take place? (optional)`,
  )
  await courtNamePage.fillField(
    `What's the name of the court where ${name}'s bail hearing will take place? (optional)`,
    'Barnsley Magistrates Court',
  )
  await courtNamePage.clickButton('Save and continue')
}

async function completeNonStandardBailConditionsPage(page: Page, name: string) {
  const nonStandardBailConditionsPage = await ApplyPage.initialize(
    page,
    `Are there any non-standard bail conditions being considered for ${name}?`,
  )
  await nonStandardBailConditionsPage.checkRadio('No')
  await nonStandardBailConditionsPage.clickButton('Save and continue')
}
