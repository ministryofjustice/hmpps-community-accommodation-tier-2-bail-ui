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
      'Once you provide the requested information, the assessor will make a decision on the application within one hour. In some cases, it may take longer.',
    )
  }

  shouldShowApplicationDetailsForPrisonUsers(): void {
    const person = this.application.person as FullPerson

    cy.get('h2').contains(this.application.id)
    cy.get('h2').contains(person.name)

    cy.get('li').contains(
      'Once you provide the requested information, the assessor will make a decision on the application within 3 working days. In some cases, it may take longer.',
    )
  }
}
