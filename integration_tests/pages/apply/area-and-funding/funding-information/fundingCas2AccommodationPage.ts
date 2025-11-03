import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { FundingSources } from '../../../../../server/form-pages/apply/area-and-funding/funding-information/fundingCas2Accommodation'

export default class FundingCas2AccommodationPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super('Funding CAS2 for bail accommodation', application, 'funding-information', 'funding-cas2-accommodation')
  }

  completeWithPersonalSavings(): void {
    this.selectFundingSource('personalSavings')
    this.enterFundingSourceDetails()
    this.enterNationalInsuranceNumber()
    this.enterBenefitsDetails()
  }

  private selectFundingSource(fundingSource: FundingSources): void {
    this.checkRadioByNameAndValue('fundingSource', fundingSource)
  }

  private enterFundingSourceDetails(): void {
    this.getTextInputByIdAndEnterDetails('fundingSourceDetail', 'Funding source details')
  }

  private enterNationalInsuranceNumber(): void {
    this.checkRadioByNameAndValue('hasNationalInsuranceNumber', 'yes')
    this.getTextInputByIdAndEnterDetails('nationalInsuranceNumber', 'SF123456X')
  }

  private enterBenefitsDetails(): void {
    this.checkRadioByNameAndValue('receivingBenefits', 'yes')
    this.checkRadioByNameAndValue('receivedBenefitSanctions', 'no')
  }
}
