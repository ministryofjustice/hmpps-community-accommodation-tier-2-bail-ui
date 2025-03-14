import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export default class SafetyOfStaffPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super('Concerns related to the safety of staff', application, 'risk-information', 'safety-of-staff')
  }

  enterPastRiskDetails(): void {
    this.checkRadioByNameAndValue('pastRiskToStaff', 'yes')
    this.getTextInputByIdAndEnterDetails('pastRiskToStaffDetail', 'some details')
  }

  enterCurrentRiskDetails(): void {
    this.checkRadioByNameAndValue('currentConcerns', 'yes')
    this.getTextInputByIdAndEnterDetails('currentConcernsDetail', 'some further details')
  }
}
