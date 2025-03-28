import BasePage from '../basePage'

export default class ApplicationOriginPage extends BasePage {
  async choosePrisonBail() {
    await this.checkRadio('Prison bail')
    await this.clickButton('Confirm')
  }

  async chooseCourtBail() {
    await this.checkRadio('Court bail')
    await this.clickButton('Confirm')
  }
}
