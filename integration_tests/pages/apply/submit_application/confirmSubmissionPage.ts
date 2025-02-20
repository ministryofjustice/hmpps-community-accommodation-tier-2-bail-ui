import { Cas2v2Application as Application, FullPerson } from '@approved-premises/api'
import Page from '../../page'
import paths from '../../../../server/paths/apply'

export default class ConfirmSubmissionPage extends Page {
  constructor(name: string) {
    super('Are you sure you want to submit the application?', name)
  }

  static visit(application: Application): ConfirmSubmissionPage {
    cy.visit(paths.applications.confirmSubmission({ id: application.id }))

    const person = application.person as FullPerson

    return new ConfirmSubmissionPage(person.name)
  }
}
