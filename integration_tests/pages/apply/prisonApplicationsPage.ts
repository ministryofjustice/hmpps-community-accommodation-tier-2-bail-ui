import paths from '../../../server/paths/apply'
import Page from '../page'

export default class PrisonApplicationsPage extends Page {
  constructor() {
    const name = undefined
    super('All CAS-2 Bail applications', name)
  }

  static visit(): PrisonApplicationsPage {
    cy.visit(paths.applications.prison({}))

    return new PrisonApplicationsPage()
  }
}
