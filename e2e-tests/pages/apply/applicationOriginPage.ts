import { BasePage } from '../basePage'

export class ApplicationOriginPage extends BasePage {
  async choosePrisonBail() {
    await this.checkRadio('Prison bail')
    await this.clickButton('Confirm')
  }
}
