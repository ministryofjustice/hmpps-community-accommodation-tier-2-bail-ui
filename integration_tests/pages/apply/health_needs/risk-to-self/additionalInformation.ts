import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class AdditionalInformationPage extends ApplyPage {
  constructor(application: Application) {
    super(
      `Is there anything else to include about ${nameOrPlaceholderCopy(application.person)}'s risk to self?`,
      application,
      'risk-to-self',
      'additional-information',
    )
  }

  checkErrors() {
    this.shouldShowErrorSummary('Confirm whether you have additional information')
  }

  completeForm() {
    this.checkRadioByNameAndValue('hasAdditionalInformation', 'yes')
    this.getTextInputByIdAndEnterDetails('additionalInformationDetail', 'some additional information')
  }
}
