import { Cas2v2Application as Application, FullPerson } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export default class LicenceDatesNeededPage extends ApplyPage {
  constructor(application: Application) {
    super(
      `Is ${(application.person as FullPerson).name} on licence for a different offence?`,
      application,
      'cohort-selection',
      'licence-dates-needed',
    )
  }

  answerYes(): void {
    this.checkRadioByNameAndValue('licenceDatesNeeded', 'yes')
    this.clickSubmit('Continue')
  }
}
