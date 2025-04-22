import Page from '../page'

export default class FindByCrnPage extends Page {
  constructor(name: string) {
    super(`Enter the applicant’s CRN (case reference number)`, name)
  }

  static visit(name: string): FindByCrnPage {
    cy.visit('/applications/search-by-crn')
    return new FindByCrnPage(name)
  }
}
