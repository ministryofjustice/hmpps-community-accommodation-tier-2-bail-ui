import { Cas2Application as Application, FullPerson } from '@approved-premises/api'
import ApplyPage from '../../applyPage'

export default class CppCheckPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Are you ${(application.person as FullPerson).name}'s community probation practitioner?`,
      application,
      'referrer-details',
      'cpp-check',
    )
    cy.get('.govuk-fieldset__heading').should('not.exist')
  }

  checkErrors() {
    this.shouldShowErrorSummary(
      `Select if you are ${(this.application.person as FullPerson).name}'s community probation practitioner`,
    )
  }

  completeForm(value = 'yes'): void {
    this.checkRadioByNameAndValue('isCpp', value)
  }
}
