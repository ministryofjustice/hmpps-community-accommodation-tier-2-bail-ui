import { Cas2v2Application as Application, FullPerson } from '@approved-premises/api'
import Page from '../../page'

export default class ApplicationSubmittedPage extends Page {
  constructor(private readonly application: Application) {
    const person = application.person as FullPerson
    super('Application submitted', person.name)
  }

  shouldShowApplicationDetails(): void {
    const person = this.application.person as FullPerson

    cy.get('h2').contains(this.application.id)
    cy.get('h2').contains(person.name)
  }
}
