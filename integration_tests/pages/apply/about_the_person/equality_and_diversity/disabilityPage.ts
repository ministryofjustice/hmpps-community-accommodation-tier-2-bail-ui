import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import ApplyPage from '../../applyPage'

export default class DisabilityPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Does ${nameOrPlaceholderCopy(application.person)} have a disability?`,
      application,
      'equality-and-diversity-monitoring',
      'disability',
    )
  }

  enterOtherDisabilityType(): void {
    this.checkRadioByNameAndValue('hasDisability', 'yes')
    this.checkCheckboxByValue('other')
    this.getTextInputByIdAndEnterDetails('otherDisability', 'a different disability')
  }
}
