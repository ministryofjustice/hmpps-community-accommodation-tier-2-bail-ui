import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
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

  shouldShowImportedRiskInformation = (whoIsAtRisk: string, natureOfRisk: string): void => {
    cy.get('#whoIsAtRisk').should('have.value', whoIsAtRisk)
    cy.get('#natureOfRisk').should('have.value', natureOfRisk)
  }

  clickSubmit(text = 'Confirm and continue'): void {
    super.clickSubmit(text)
  }

  checkErrors(): void {
    this.shouldShowErrorSummary('Enter who is at risk')
    this.shouldShowErrorSummary('Enter the nature of the risk')
  }

  completeForm(): void {
    cy.get('#whoIsAtRisk').clear()
    cy.get('#whoIsAtRisk').type('who is at risk answer')
    cy.get('#natureOfRisk').clear()
    cy.get('#natureOfRisk').type('nature of risk answer')
  }
}
