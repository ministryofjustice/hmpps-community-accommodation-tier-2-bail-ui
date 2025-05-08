import { Page } from '@playwright/test'
import { ApplyPage, TaskListPage } from '../pages/apply'

export const completeBailConditionsTask = async (page: Page) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add bail conditions')

  await completeNonStandardBailConditionsPage(page)
}

export const completeBailHearingInformationTask = async (page: Page) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add bail hearing information')

  await completeBailHearingInformationPage(page)
}

async function completeBailHearingInformationPage(page: Page) {
  const bailHearingInformationPage = await ApplyPage.initialize(page, `Add bail hearing information`)
  await bailHearingInformationPage.checkRadioInGroup('when', 'No')

  await bailHearingInformationPage.clickButton('Save and continue')
}

async function completeNonStandardBailConditionsPage(page: Page) {
  const nonStandardBailConditionsPage = await ApplyPage.initialize(
    page,
    `Are there any non-standard bail conditions being considered?`,
  )
  await nonStandardBailConditionsPage.checkRadioInGroup('bail conditions', 'No')
  await nonStandardBailConditionsPage.clickButton('Save and continue')
}
