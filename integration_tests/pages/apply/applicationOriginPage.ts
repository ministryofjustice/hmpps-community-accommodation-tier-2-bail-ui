import Page from '../page'

export default class ApplicationOriginPage extends Page {
  constructor(name: string) {
    super(`You are applying for:`, name)
  }

  static visit(name: string): ApplicationOriginPage {
    cy.visit('/applications/application-type')
    return new ApplicationOriginPage(name)
  }
}
