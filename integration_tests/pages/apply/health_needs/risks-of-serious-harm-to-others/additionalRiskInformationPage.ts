import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
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

  checkErrors(): void {
    this.shouldShowErrorSummary('Select whether there is any additional risk information')
  }

  completeForm(): void {
    this.checkRadioByNameAndValue('hasAdditionalInformation', 'no')
  }
}
