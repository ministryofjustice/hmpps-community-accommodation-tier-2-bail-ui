import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class UnspentConvictionsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `View and add ${nameOrPlaceholderCopy(application.person)}'s previous unspent convictions`,
      application,
      'previous-unspent-convictions',
      'unspent-convictions',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'previous-unspent-convictions',
        page: 'unspent-convictions',
      }),
    )
  }

  hasListOfUnspentConvictions(): void {
    cy.get('.govuk-summary-card__title').contains('Arson')
    cy.get('.govuk-summary-list__value').contains('3')
    cy.get('.govuk-summary-list__value').contains('No')
    cy.get('.govuk-summary-list__value').contains('safeguarding detail')
  }

  clickAddAnotherUnspentConviction(): void {
    cy.get('[data-testid="add-another-unspent-conviction-button"]').click()
  }

  hasNoUnspentConvictions(): void {
    cy.get('.govuk-body').contains('No unspent convictions have been added.')
  }

  shouldShowErrorSummary(): void {
    cy.get('.govuk-error-summary').should('contain', 'Unspent convictions must be added to the application')
  }
}
