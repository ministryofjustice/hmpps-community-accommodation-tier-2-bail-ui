import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class SummaryPage extends ApplyPage {
  constructor(application: Application) {
    super(
      `Risk of serious harm (RoSH) summary for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'risks-of-serious-harm-to-others',
      'summary',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risks-of-serious-harm-to-others',
        page: 'summary',
      }),
    )
  }

  shouldShowImportedRiskWidget = (): void => {
    cy.get('.rosh-widget').should('exist')
    cy.get('.govuk-hint').contains('Imported from OASys on')
  }
}
