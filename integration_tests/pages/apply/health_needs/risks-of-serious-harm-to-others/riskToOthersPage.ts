import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class RiskToOthersPage extends ApplyPage {
  constructor(application: Application) {
    super(
      `Risk to others for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'risks-of-serious-harm-to-others',
      'risk-to-others',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risks-of-serious-harm-to-others',
        page: 'risk-to-others',
      }),
    )
  }

  shouldShowImportedRiskInformation = (whoIsAtRisk: string, natureOfRisk: string): void => {
    cy.get('#whoIsAtRisk').should('have.value', whoIsAtRisk)
    cy.get('#natureOfRisk').should('have.value', natureOfRisk)
  }

  checkErrors(): void {
    this.shouldShowErrorSummary('Confirm that the information is relevant and up to date')
  }

  completeForm(): void {
    cy.get('#whoIsAtRisk').clear()
    cy.get('#whoIsAtRisk').type('who is at risk answer')
    cy.get('#natureOfRisk').clear()
    cy.get('#natureOfRisk').type('nature of risk answer')
    this.checkCheckboxByValue('confirmed')
  }
}
