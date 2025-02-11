import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import ApplyPage from '../../applyPage'

export default class WhiteBackgroundPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Which of the following best describes ${nameOrPlaceholderCopy(application.person)}'s White background?`,
      application,
      'equality-and-diversity-monitoring',
      'white-background',
    )
  }

  selectWhiteBackground(): void {
    this.checkRadioByNameAndValue('whiteBackground', 'english')
  }
}
