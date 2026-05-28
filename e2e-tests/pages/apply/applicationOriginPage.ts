import BasePage from '../basePage'

export default class ApplicationOriginPage extends BasePage {
  async chooseBail() {
    await this.checkRadio('Bail')
    await this.clickButton('Continue')
  }

  async chooseOther() {
    await this.checkRadio('A different type of application')
    await this.clickButton('Continue')
  }
}
