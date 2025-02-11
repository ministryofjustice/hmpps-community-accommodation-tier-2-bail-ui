import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import ApplyPage from '../../applyPage'

export default class EthnicGroupPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `What is ${nameOrPlaceholderCopy(application.person)}'s ethnic group?`,
      application,
      'equality-and-diversity-monitoring',
      'ethnic-group',
    )
  }

  selectEthnicGroup(ethnicGroupValue: string): void {
    this.checkRadioByNameAndValue('ethnicGroup', ethnicGroupValue)
  }
}
