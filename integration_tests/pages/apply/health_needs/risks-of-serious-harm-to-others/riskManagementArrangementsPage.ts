import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class RiskManagementArrangementsPage extends ApplyPage {
  constructor(application: Application) {
    super(
      `Risk management arrangements for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'risks-of-serious-harm-to-others',
      'risk-management-arrangements',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risks-of-serious-harm-to-others',
        page: 'risk-management-arrangements',
      }),
    )
  }

  checkErrors(): void {
    this.shouldShowErrorSummary(
      "Select risk management arrangements or 'No, this person does not have risk management arrangements'",
    )
  }

  completeForm(): void {
    this.checkCheckboxByValue('no')
  }
}
