import { Cas2v2Application as Application } from '@approved-premises/api'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import ApplyPage from '../../applyPage'

export default class ConfirmConsentPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Confirm ${nameOrPlaceholderCopy(application.person)}'s consent`,
      application,
      'confirm-consent',
      'confirm-consent',
    )
  }

  static visit = (application: Application) => {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'confirm-consent',
        page: 'confirm-consent',
      }),
    )
  }

  completeFormWithConsent(): void {
    this.checkRadioByNameAndValue('hasGivenConsent', 'yes')
    this.getTextInputByIdAndEnterDetails('consentDate-day', '1')
    this.getTextInputByIdAndEnterDetails('consentDate-month', '1')
    this.getTextInputByIdAndEnterDetails('consentDate-year', '2023')
  }

  completeFormWithoutConsent(): void {
    this.checkRadioByNameAndValue('hasGivenConsent', 'no')
  }
}
