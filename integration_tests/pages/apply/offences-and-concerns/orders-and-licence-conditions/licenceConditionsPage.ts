import { Cas2Application as Application, FullPerson } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export default class LicenceConditionsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Does ${(application.person as FullPerson).name} have any non-standard licence conditions?`,
      application,
      'orders-and-licence-conditions',
      'licence-conditions',
      'taskList',
    )
  }

  checkErrors() {
    this.shouldShowErrorSummary('Select yes if they have any non-standard licence conditions')
  }

  completeForm(): void {
    this.checkRadioByNameAndValue('hasLicenceConditions', 'no')
  }
}
