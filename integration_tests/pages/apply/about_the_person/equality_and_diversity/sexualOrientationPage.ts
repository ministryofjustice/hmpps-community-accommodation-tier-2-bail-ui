import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import ApplyPage from '../../applyPage'

export default class SexualOrientationPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Which of the following best describes ${nameOrPlaceholderCopy(application.person)}'s sexual orientation?`,
      application,
      'equality-and-diversity-monitoring',
      'sexual-orientation',
    )
  }

  selectOrientation(): void {
    this.checkRadioByNameAndValue('orientation', 'gay')
  }
}
