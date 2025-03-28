import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class AllegedOffenceDataPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Add ${nameOrPlaceholderCopy(application.person)}'s alleged offence details`,
      application,
      'alleged-offences',
      'alleged-offence-data',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'alleged-offences',
        page: 'alleged-offence-data',
      }),
    )
  }

  addOffenceInformation(): void {
    this.getTextInputByIdAndEnterDetails('titleAndNumber', 'Arson (01000)')
    this.completeDateInputs('offenceDate', '2022-07-15')
  }

  clickSubmit(): void {
    cy.get('button').contains('Save and continue').click()
  }

  clickAddAnother(): void {
    cy.get('button').contains('Save and add another').click()
  }

  assertFormisEmpty(): void {
    cy.get('#titleAndNumber').should('have.value', '')
    cy.get('#offenceDate-day').should('have.value', '')
  }
}
