import Page from '../page'

export default class FindByCrnPage extends Page {
  constructor(name: string) {
    super(`Enter the person's CRN`, name)
  }

  static visit(name: string): FindByCrnPage {
    cy.visit('/applications/search-by-crn')
    return new FindByCrnPage(name)
  }
}
