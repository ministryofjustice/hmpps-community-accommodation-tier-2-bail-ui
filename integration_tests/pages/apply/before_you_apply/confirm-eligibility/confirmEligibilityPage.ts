import { Cas2v2Application as Application } from '@approved-premises/api'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import ApplyPage from '../../applyPage'

export default class ConfirmEligibilityPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      application.applicationOrigin === 'other'
        ? `Confirm ${nameOrPlaceholderCopy(application.person)} is eligible to apply`
        : `Confirm ${nameOrPlaceholderCopy(application.person)} is eligible for CAS2 for bail`,
      application,
      'confirm-eligibility',
      'confirm-eligibility',
    )
  }

  static visit = (application: Application) => {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'confirm-eligibility',
        page: 'confirm-eligibility',
      }),
    )
    return new ConfirmEligibilityPage(application)
  }

  completeFormWithEligibility(): void {
    this.checkRadioByNameAndValue('isEligible', 'yes')
  }

  completeFormWithoutEligibility(): void {
    this.checkRadioByNameAndValue('isEligible', 'no')
  }

  confirmBailContent(): void {
    cy.contains('To apply for CAS2 for bail, the applicant must')
    cy.contains('be assessed as at high or very high risk of serious harm on OASys (Offender Assessment System)')
  }

  confirmNonBailContent(): void {
    cy.contains('have broken any UK immigration laws, except for overstaying permission to enter or stay in the UK')
  }
}
