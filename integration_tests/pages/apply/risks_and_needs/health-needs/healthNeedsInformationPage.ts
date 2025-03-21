import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import { pageIsActiveInNavigation } from '../utils'

export default class HealthNeedsInformationPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Provide information about ${nameOrPlaceholderCopy(application.person)}'s health needs`,
      application,
      'health-needs',
      'health-needs-information',
    )

    pageIsActiveInNavigation('Health needs information')
  }

  static visit(application: Application): HealthNeedsInformationPage {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'health-needs-information',
      }),
    )

    return new HealthNeedsInformationPage(application)
  }

  hasGuidance(): void {
    cy.get('[data-testid="health-needs-guidance"]').should('be.visible')
    cy.get('[data-testid="health-needs-inset-guidance"]').should('be.visible')
    cy.get('[data-testid="health-needs-details-guidance"]').should('be.visible')
  }
}
