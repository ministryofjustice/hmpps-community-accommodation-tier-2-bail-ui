import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
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

  shouldShowImportedRiskWidget = (): void => {
    cy.get('.rosh-widget').should('exist')
    cy.get('.govuk-hint').contains('Imported from OASys on')
  }
}
