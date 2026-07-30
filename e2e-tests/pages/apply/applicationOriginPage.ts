import BasePage from '../basePage'

export default class ApplicationOriginPage extends BasePage {
  async chooseBail() {
    await this.checkRadio('Yes')
    await this.clickButton('Continue')
  }

  async chooseOther() {
    await this.checkRadio('No')
    await this.clickButton('Continue')
  }
}
