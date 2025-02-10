import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import ApplyPage from '../../applyPage'

export default class AsianBackgroundPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Which of the following best describes ${nameOrPlaceholderCopy(
        application.person,
      )}'s Asian or Asian British background?`,
      application,
      'equality-and-diversity-monitoring',
      'asian-background',
    )
  }

  selectAsianBackground(): void {
    this.checkRadioByNameAndValue('asianBackground', 'indian')
  }
}
