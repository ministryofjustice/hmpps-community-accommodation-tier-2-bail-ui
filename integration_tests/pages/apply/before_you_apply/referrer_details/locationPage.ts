import { Cas2v2Application as Application } from '@approved-premises/api'
import paths from '../../../../../server/paths/apply'
import ApplyPage from '../../applyPage'

export default class LocationPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(`Where are you based?`, application, 'referrer-details', 'location')
  }

  static visit = (application: Application) => {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'referrer-details',
        page: 'location',
      }),
    )
  }

  completeForm(): void {
    this.getTextInputByIdAndEnterDetails('location', 'Saturn')
  }
}
