import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export default class SafetyOfStaffPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super('Concerns related to the safety of staff', application, 'risk-information', 'safety-of-staff')
  }

  enterPastRiskDetails(): void {
    this.checkRadioByNameAndValue('pastRiskToStaff', 'yes')
    this.getTextInputByIdAndEnterDetails('pastRiskToStaffDetail', 'some details')
  }

  enterCurrentRiskDetails(): void {
    this.checkRadioByNameAndValue('currentConcerns', 'yes')
    this.getTextInputByIdAndEnterDetails('currentConcernsDetail', 'some further details')
  }

  hasGuidanceText = (): void => {
    cy.get('.guidance').contains('Consider concerns towards')
    cy.get('.guidance').contains('support and housing staff')
    cy.get('.guidance').contains('probation workers')
    cy.get('.guidance').contains('accommodation staff')
    cy.get('.guidance').contains('police staff')
    cy.get('.guidance').contains('custody staff')
  }
}
