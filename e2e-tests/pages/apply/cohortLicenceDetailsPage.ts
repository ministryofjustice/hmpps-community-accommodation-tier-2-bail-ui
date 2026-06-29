import { expect, Page } from '@playwright/test'
import BasePage from '../basePage'

export default class CohortLicenceDetailsPage extends BasePage {
  static async initialize(page: Page, title?: string) {
    if (title) {
      await expect(page.locator('h1')).toContainText(title)
    }
    return new CohortLicenceDetailsPage(page)
  }
}
