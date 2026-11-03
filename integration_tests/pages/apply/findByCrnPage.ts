import Page from '../page'

export default class FindByCrnPage extends Page {
  constructor(name: string) {
    super(`Enter the applicant’s CRN (case reference number)`, name)
  }

  static url() {
    return '/applications/search-by-crn'
  }

  static visit(name: string): FindByCrnPage {
    cy.visit(this.url())
    return new FindByCrnPage(name)
  }
}
