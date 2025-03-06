import paths from '../../../server/paths/apply'
import Page from '../page'

export default class BeforeYouStartPage extends Page {
  constructor(name: string) {
    super('Apply for Short-Term Accommodation (CAS-2)', name)
  }

  static visit(name: string): BeforeYouStartPage {
    cy.visit(paths.applications.beforeYouStart({}))

    return new BeforeYouStartPage(name)
  }
}
