import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import ApplyPage from '../../applyPage'

export default class MixedBackgroundPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Which of the following best describes ${nameOrPlaceholderCopy(
        application.person,
      )}'s mixed or multiple ethnic groups background?`,
      application,
      'equality-and-diversity-monitoring',
      'mixed-background',
    )
  }

  selectMixedBackground(): void {
    this.checkRadioByNameAndValue('mixedBackground', 'preferNotToSay')
  }
}
