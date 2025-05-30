import { Cas2v2Application as Application } from '@approved-premises/api'
import { FullPerson } from '../../../../../server/@types/shared/models/FullPerson'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import Page from '../../../page'

export default class ConsentRefusedPage extends Page {
  constructor(private readonly application: Application) {
    const person = application.person as FullPerson
    super(`${nameOrPlaceholderCopy(application.person, 'The person')} has not given their consent`, person.name)
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'confirm-consent',
        page: 'consent-refused',
      }),
    )
  }

  hasGuidance(): void {
    cy.contains('You can still continue with the application and come back to this later.')
    cy.contains("You'll need to enter if the applicant has given their consent to submit the application.")
  }

  hasLinkToChangeAnswer(): void {
    cy.contains('Change your answer about consent').should(
      'have.attr',
      'href',
      paths.applications.pages.show({
        id: this.application.id,
        task: 'confirm-consent',
        page: 'confirm-consent',
      }),
    )
  }

  chooseToChangeAnswer(): void {
    cy.get('a').contains('Change your answer about consent').click()
  }
}
