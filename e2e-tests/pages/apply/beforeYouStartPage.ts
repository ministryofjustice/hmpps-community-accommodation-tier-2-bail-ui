import BasePage from '../basePage'

export default class BeforeYouStartPage extends BasePage {
  async startNow() {
    await this.page.getByRole('button', { name: 'Start now' }).click()
  }
}
