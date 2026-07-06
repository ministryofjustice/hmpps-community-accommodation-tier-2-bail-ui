import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class OldOasysPage extends ApplyPage {
  constructor(application: Application) {
    super(
      `Does ${nameOrPlaceholderCopy(application.person)} have an older OASys with risk of serious harm (RoSH) information?`,
      application,
      'risks-of-serious-harm-to-others',
      'old-oasys',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risks-of-serious-harm-to-others',
        page: 'old-oasys',
      }),
    )
  }

  checkErrors(): void {
    this.shouldShowErrorSummary('Confirm whether they have an older OASys with risk of serious harm (RoSH) information')
  }

  completeForm(): void {
    // They do not have an OASys, so we complete the section manually
    this.checkRadioByNameAndValue('hasOldOasys', 'no')
  }
}
