import BasePage from '../basePage'

export default class FindByCrnPage extends BasePage {
  async enterCrn(crn: string) {
    await this.page.getByLabel("Enter the person's CRN").fill(crn)
  }
}
