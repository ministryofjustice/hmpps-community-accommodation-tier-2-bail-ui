import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class OldOasysPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Does ${nameOrPlaceholderCopy(application.person)} have an older OASys with risk to self information?`,
      application,
      'risk-to-self',
      'old-oasys',
    )
  }

  checkErrors() {
    this.shouldShowErrorSummary('Confirm whether they have an older OASys with risk to self information')
  }

  completeForm() {
    this.checkRadioByNameAndLabel('hasOldOasys', 'No, they do not have an OASys')
  }
}
