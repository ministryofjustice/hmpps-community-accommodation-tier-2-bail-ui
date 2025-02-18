import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'

export default class ApplicantIdPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(`What identity document (ID) does the applicant have?`, application, 'funding-information', 'applicant-id')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'funding-information',
        page: 'applicant-id',
      }),
    )
  }
}
