import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class AllegedOffencesPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Alleged offences for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'alleged-offences',
      'alleged-offences',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'alleged-offences',
        page: 'alleged-offences',
      }),
    )
  }

  hasListOfOffences(): void {
    cy.get('.govuk-summary-card__title').contains('Arson')
  }

  hasNoOffences(): void {
    cy.get('.govuk-body').contains('There are no alleged offences to show.')
  }

  shouldShowErrorSummary(): void {
    cy.get('.govuk-error-summary').should('contain', 'Alleged offences must be added to the application')
  }
}
