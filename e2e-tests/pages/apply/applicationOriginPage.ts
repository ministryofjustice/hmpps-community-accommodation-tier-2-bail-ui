import BasePage from '../basePage'

export default class ApplicationOriginPage extends BasePage {
  async choosePrisonBail() {
    await this.checkRadio('Prison')
    await this.clickButton('Confirm')
  }

  async chooseCourtBail() {
    await this.checkRadio('Court')
    await this.clickButton('Confirm')
  }
}
