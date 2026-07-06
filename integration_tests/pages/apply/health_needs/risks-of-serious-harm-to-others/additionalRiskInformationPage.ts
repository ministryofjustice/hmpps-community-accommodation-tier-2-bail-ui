import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class AdditionalRiskInformationPage extends ApplyPage {
  constructor(application: Application) {
    super(
      `Additional risk information for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'risks-of-serious-harm-to-others',
      'additional-risk-information',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risks-of-serious-harm-to-others',
        page: 'additional-risk-information',
      }),
    )
  }

  checkErrors(): void {
    this.shouldShowErrorSummary('Select whether there is any additional risk information')
  }

  completeForm(): void {
    this.checkRadioByNameAndValue('hasAdditionalInformation', 'no')
  }
}
