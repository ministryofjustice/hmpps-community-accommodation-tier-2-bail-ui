import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import paths from '../../../../../server/paths/apply'

export const noFixedAddressDetails = {
  howLong: 'some duration',
  lastKnownAddressLine1: 'some address line 1',
  lastKnownTownOrCity: 'some town or city',
  lastKnownPostcode: 'some postcode',
}

export default class NoFixedAddressPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `How long has ${nameOrPlaceholderCopy(application.person)} had no fixed address for?`,
      application,
      'address-history',
      'no-fixed-address',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'address-history',
        page: 'no-fixed-address',
      }),
    )
  }

  checkErrors() {
    this.shouldShowErrorMessagesForFields(['howLong'], 'Enter how long they have had no fixed address')
  }

  completeForm(): void {
    this.getTextInputByIdAndEnterDetails('howLong', noFixedAddressDetails.howLong)
    this.getTextInputByIdAndEnterDetails('lastKnownAddressLine1', noFixedAddressDetails.lastKnownAddressLine1)
    this.getTextInputByIdAndEnterDetails('lastKnownTownOrCity', noFixedAddressDetails.lastKnownTownOrCity)
    this.getTextInputByIdAndEnterDetails('lastKnownPostcode', noFixedAddressDetails.lastKnownPostcode)
  }

  shouldShowEnteredDetails(): void {
    cy.get('#howLong').should('have.value', noFixedAddressDetails.howLong)
    cy.get('#lastKnownAddressLine1').should('have.value', noFixedAddressDetails.lastKnownAddressLine1)
    cy.get('#lastKnownTownOrCity').should('have.value', noFixedAddressDetails.lastKnownTownOrCity)
    cy.get('#lastKnownPostcode').should('have.value', noFixedAddressDetails.lastKnownPostcode)
  }
}
