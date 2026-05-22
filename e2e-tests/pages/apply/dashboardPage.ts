import BasePage from '../basePage'

export default class DashboardPage extends BasePage {
  async goto() {
    await this.page.goto('/')
  }

  async makeNewApplication() {
    await this.page.getByText('Start a new application', { exact: true }).click()
  }

  async makeNewCohortApplication() {
    await this.page.getByText('Start a new application (new cohorts)').click()
  }

  async viewPrisonDashboard() {
    await this.page.getByText('View all prison bail applications').click()
  }
}
