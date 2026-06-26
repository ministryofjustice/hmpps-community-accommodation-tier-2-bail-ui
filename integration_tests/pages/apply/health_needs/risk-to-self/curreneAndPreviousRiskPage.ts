import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class CurrentAndPreviousRiskPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `${nameOrPlaceholderCopy(application.person)}'s current and previous risks`,
      application,
      'risk-to-self',
      'current-and-previous-risk',
    )
  }

  checkErrors() {
    this.shouldShowErrorSummary('Confirm that the information is relevant and up to date')
    this.shouldShowErrorSummary(
      `Describe ${nameOrPlaceholderCopy(this.application.person)}'s current and previous issues and needs related to self harm and suicide`,
    )
  }

  completeForm() {
    this.getTextInputByIdAndEnterDetails('currentAndPreviousRiskDetail', 'some risk detail')
    this.checkCheckboxByValue('confirmed')
  }
}
