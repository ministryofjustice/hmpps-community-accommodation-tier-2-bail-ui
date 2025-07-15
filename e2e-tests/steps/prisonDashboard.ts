import { Page, expect } from '@playwright/test'
import { DashboardPage } from '../pages/apply'

export default async (page: Page, name: string) => {
  const dashboardPage = new DashboardPage(page)
  await dashboardPage.goto()

  await dashboardPage.viewPrisonDashboard()

  await expect(page.locator('h1')).toContainText('All CAS-2 prison bail applications')
  await page.getByRole('link', { name }).first().click()
  await expect(page.locator('h1')).toContainText(name)
  await expect(page.locator('h2').first()).toContainText('Application history')
}
