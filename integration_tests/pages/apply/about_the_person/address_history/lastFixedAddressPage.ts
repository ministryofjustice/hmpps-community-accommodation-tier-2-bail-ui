import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import paths from '../../../../../server/paths/apply'

export const lastFixedAddressDetails = {
  addressLine1: 'some address line 1',
  addressLine2: 'some address line 2',
  townOrCity: 'some town or city',
  county: 'some county',
  postcode: 'some postcode',
}

export default class LastFixedAddressPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Enter ${nameOrPlaceholderCopy(application.person)}'s last fixed address`,
      application,
      'address-history',
      'last-fixed-address',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'address-history',
        page: 'last-fixed-address',
      }),
    )
  }

  checkErrors() {
    this.shouldShowErrorMessagesForFields(['addressLine1'], 'Enter address line 1')
    this.shouldShowErrorMessagesForFields(['townOrCity'], 'Enter the town or city')
    this.shouldShowErrorMessagesForFields(['postcode'], 'Enter the postcode')
  }

  completeForm(): void {
    this.getTextInputByIdAndEnterDetails('addressLine1', lastFixedAddressDetails.addressLine1)
    this.getTextInputByIdAndEnterDetails('addressLine2', lastFixedAddressDetails.addressLine2)
    this.getTextInputByIdAndEnterDetails('townOrCity', lastFixedAddressDetails.townOrCity)
    this.getTextInputByIdAndEnterDetails('county', lastFixedAddressDetails.county)
    this.getTextInputByIdAndEnterDetails('postcode', lastFixedAddressDetails.postcode)
  }

  shouldShowEnteredDetails(): void {
    cy.get('#addressLine1').should('have.value', lastFixedAddressDetails.addressLine1)
    cy.get('#addressLine2').should('have.value', lastFixedAddressDetails.addressLine2)
    cy.get('#townOrCity').should('have.value', lastFixedAddressDetails.townOrCity)
    cy.get('#county').should('have.value', lastFixedAddressDetails.county)
    cy.get('#postcode').should('have.value', lastFixedAddressDetails.postcode)
  }
}
