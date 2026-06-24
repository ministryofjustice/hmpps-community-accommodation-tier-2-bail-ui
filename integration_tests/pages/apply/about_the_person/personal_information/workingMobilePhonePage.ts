import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import paths from '../../../../../server/paths/apply'

export default class WorkingMobilePhonePage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Will ${nameOrPlaceholderCopy(application.person)} have a working mobile phone?`,
      application,
      'personal-information',
      'working-mobile-phone',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'personal-information',
        page: 'working-mobile-phone',
      }),
    )
  }

  completeForm(): void {
    this.checkRadioByNameAndValue('hasWorkingMobilePhone', 'yes')
    this.getTextInputByIdAndEnterDetails('mobilePhoneNumber', '11111111111')
    this.checkRadioByNameAndValue('isSmartPhone', 'yes')
  }

  checkErrors() {
    this.shouldShowErrorSummary(`Choose either Yes, No or I don't know`)
  }
}
