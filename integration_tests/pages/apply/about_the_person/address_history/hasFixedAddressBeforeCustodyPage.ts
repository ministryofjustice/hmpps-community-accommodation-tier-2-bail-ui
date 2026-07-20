import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import { custodialCohorts } from '../../../../../server/utils/applications/cohortLabels'
import paths from '../../../../../server/paths/apply'

export default class HasFixedAddressBeforeCustodyPage extends ApplyPage {
  constructor(private readonly application: Application) {
    const name = nameOrPlaceholderCopy(application.person)
    const title = custodialCohorts.includes(application.cohort)
      ? `Did ${name} have a fixed address before entering custody?`
      : `Does ${name} have a fixed address?`

    super(title, application, 'address-history', 'has-fixed-address-before-custody')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'address-history',
        page: 'has-fixed-address-before-custody',
      }),
    )
  }

  checkErrors() {
    this.shouldShowErrorMessagesForFields(
      ['hasFixedAddressBeforeCustody'],
      'Select yes if the applicant had a fixed address before entering custody',
    )
  }

  completeForm(value = 'yes'): void {
    this.checkRadioByNameAndValue('hasFixedAddressBeforeCustody', value)
  }

  shouldShowSelectedAnswer(value = 'yes'): void {
    cy.get(`input[name="hasFixedAddressBeforeCustody"][value="${value}"]`).should('be.checked')
  }
}
