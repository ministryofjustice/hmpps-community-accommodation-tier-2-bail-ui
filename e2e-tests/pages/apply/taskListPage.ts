import BasePage from '../basePage'

export default class TaskListPage extends BasePage {
  async clickTask(taskName: string) {
    await this.page.getByRole('link', { name: taskName }).click()
  }
}
