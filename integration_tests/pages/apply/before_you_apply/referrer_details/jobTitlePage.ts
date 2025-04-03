import { Cas2v2Application as Application } from '@approved-premises/api'
import paths from '../../../../../server/paths/apply'
import ApplyPage from '../../applyPage'

export default class JobTitlePage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(`What is your job title?`, application, 'referrer-details', 'job-title')
  }

  static visit = (application: Application) => {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'referrer-details',
        page: 'job-title',
      }),
    )
  }

  completeForm(): void {
    this.getTextInputByIdAndEnterDetails('jobTitle', 'POM')
  }
}
