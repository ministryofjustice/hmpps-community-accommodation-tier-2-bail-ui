import { Page } from '@playwright/test'
import { ApplyPage, TaskListPage } from '../pages/apply'

export const completeBailConditionsAndSupportSessionsTask = async (page: Page, name: string) => {
  const taskListPage = new TaskListPage(page)
  await taskListPage.clickTask('Add bail conditions and support sessions')

  await completeNonStandardBailConditionsPage(page, name)
  await completeMandatorySupportSessionsPage(page, name)
}

async function completeNonStandardBailConditionsPage(page: Page, name: string) {
  const nonStandardBailConditionsPage = await ApplyPage.initialize(
    page,
    `Are there any non-standard bail conditions being considered for ${name}?`,
  )
  await nonStandardBailConditionsPage.checkRadio('No')
  await nonStandardBailConditionsPage.clickButton('Save and continue')
}

async function completeMandatorySupportSessionsPage(page: Page, name: string) {
  const mandatorySupportSessionsPage = await ApplyPage.initialize(
    page,
    `Does the court require more than one mandatory support session per week for ${name}?`,
  )
  await mandatorySupportSessionsPage.checkRadio('No')
  await mandatorySupportSessionsPage.clickButton('Save and continue')
}
