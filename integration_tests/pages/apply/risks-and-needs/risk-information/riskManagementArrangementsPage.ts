import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { pageIsActiveInNavigation } from '../../../utils'
import paths from '../../../../../server/paths/apply'

export default class RiskManagementArrangementsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(`Risk management arrangements`, application, 'risk-information', 'risk-management-arrangements')
    pageIsActiveInNavigation('Risk management arrangements')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risk-information',
        page: 'risk-management-arrangements',
      }),
    )
  }

  selectAllArrangements = (page: RiskManagementArrangementsPage) => {
    page.checkCheckboxByValue('mappa')
    page.checkCheckboxByValue('marac')
    page.checkCheckboxByValue('iom')
  }

  completeAllArrangementDetails = (page: RiskManagementArrangementsPage) => {
    page.getTextInputByIdAndEnterDetails('mappaDetails', 'details of mappa')
    page.getTextInputByIdAndEnterDetails('maracDetails', 'details of marac')
    page.getTextInputByIdAndEnterDetails('iomDetails', 'details of iom')
  }

  expectArrangementsToBeUnselected = () => {
    cy.get(`input[value="mappa"]`).should('not.be.checked')
    cy.get(`input[value="marac"]`).should('not.be.checked')
    cy.get(`input[value="iom"]`).should('not.be.checked')
  }

  expectArrangementDetailsToBeEmpty = () => {
    cy.get('#mappaDetails').should('have.value', '')
    cy.get('#maracDetails').should('have.value', '')
    cy.get('#iomDetails').should('have.value', '')
  }

  toggleBetweenNoAndArrangements = (page: RiskManagementArrangementsPage) => {
    cy.get(`input[value="no"]`).should('be.checked')
    page.checkCheckboxByValue('mappa')
    cy.get(`input[value="no"]`).should('not.be.checked')
    page.checkCheckboxByValue('no')
    page.checkCheckboxByValue('marac')
    cy.get(`input[value="no"]`).should('not.be.checked')
    page.checkCheckboxByValue('no')
    page.checkCheckboxByValue('iom')
    cy.get(`input[value="no"]`).should('not.be.checked')
  }
}
