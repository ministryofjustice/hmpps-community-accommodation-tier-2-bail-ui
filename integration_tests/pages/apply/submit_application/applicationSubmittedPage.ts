import { Cas2v2Application as Application, FullPerson } from '@approved-premises/api'
import Page from '../../page'

export default class ApplicationSubmittedPage extends Page {
  constructor(private readonly application: Application) {
    const person = application.person as FullPerson
    super('Application submitted', person.name)
  }

  shouldShowApplicationDetailsForCourtUsers(): void {
    const person = this.application.person as FullPerson

    cy.get('h2').contains(this.application.id)
    cy.get('h2').contains(person.name)

    cy.get('li').contains(
      'Once they have a fully completed application, they will make a decision within one hour. In some cases, it may take longer.',
    )
  }

  shouldShowApplicationDetailsForPrisonUsers(): void {
    const person = this.application.person as FullPerson

    cy.get('h2').contains(this.application.id)
    cy.get('h2').contains(person.name)

    cy.get('li').contains(
      'Once they have a fully completed application, they will make a decision within 24 hours. In some cases, it may take longer.',
    )
  }
}
