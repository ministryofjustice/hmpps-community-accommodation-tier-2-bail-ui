import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class ConcernsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Add information about concerns to ${nameOrPlaceholderCopy(application.person)} and others`,
      application,
      'risk-information',
      'concerns',
    )

    pageIsActiveInNavigation('Add information about concerns')
  }

  static visit(application: Application): ConcernsPage {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risk-information',
        page: 'concerns',
      }),
    )

    return new ConcernsPage(application)
  }

  hasGuidance(): void {
    cy.get('[data-testid="concerns-guidance"]').should('be.visible')
    cy.get('[data-testid="concerns-inset-guidance"]').should('be.visible')
    cy.get('[data-testid="concerns-details-guidance"]').should('be.visible')
  }
}
