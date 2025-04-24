import Page from '../page'

export default class ApplicationOriginPage extends Page {
  constructor(name: string) {
    super(`Where are you making the application from?`, name)
  }

  static visit(name: string): ApplicationOriginPage {
    cy.visit('/applications/application-type')
    return new ApplicationOriginPage(name)
  }
}
