import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import paths from '../../../../../server/paths/apply'

export default class CustodyLocationPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Where is ${nameOrPlaceholderCopy(application.person)} being held in custody?`,
      application,
      'personal-information',
      'custody-location',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'personal-information',
        page: 'custody-location',
      }),
    )
  }

  completeForm(): void {
    this.getTextInputByIdAndEnterDetails('custodyLocation', 'The Old Bailey')
  }
}
